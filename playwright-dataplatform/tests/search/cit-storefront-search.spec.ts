import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Search @search', () => {
  test.beforeEach(async ({storefrontUrl, page}) => {
    await page.goto(storefrontUrl);
  });

  test('Citizen can search for a specific searchable record type via search bar @OGT-34156', async ({
    storeFrontUserPage,
  }) => {
    await test.step('Record type is searchable', async () => {
      await storeFrontUserPage.validateRecordTypeSearchResult(
        TestRecordTypes.Api_Test,
      );
    });
  });

  test('Search for public records, and see point location are shown correctly @OGT-34323 @broken_test', async ({
    recordsApi,
    storeFrontUserPage,
    storeFrontRecordPage,
  }) => {
    await test.step('Step test record with Point location', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Renewal_Campaign_Tests,
        baseConfig.citTestData.citCitizenEmail,
        TestLocation.Test_Point_Location,
      );
    });
    await test.step('Do public search for created record', async () => {
      await storeFrontUserPage.searchForRecord();
    });

    await test.step('Verify point location is shown', async () => {
      await storeFrontRecordPage.verifyLocationDetails(
        TestLocation.Test_Point_Location.name,
      );
    });
  });
});

test.describe('Draft search', () => {
  const recType = `plc_prefix_OGT-34480_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi, recordsApi, page, storefrontUrl}) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recType, undefined, {
        publish: false,
        employeeAccess: RecordTypeAccess['Can Administer'],
      });
    });
    await test.step('Create Record', async () => {
      await recordsApi.submitRecordDraft({
        name: baseConfig.citTempData.recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await page.goto(storefrontUrl);
  });

  test(' Drafts should not be publicly searchable @OGT-34480 @broken_test @Xoriant_Test @known_defect', async ({
    storeFrontUserPage,
    page,
  }) => {
    await test.step('Open the Explore reports page', async () => {
      await storeFrontUserPage.searchForRecord('record');
      await expect(
        page.locator(`//h4[contains(.,"404 Not found")]`),
      ).toBeVisible();
    });
  });
});
