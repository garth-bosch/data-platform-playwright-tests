import {expect, test} from '../../src/base/base-test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {
  defaultFormSectionObject,
  defaultPayloadForRenewal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {baseConfig} from '@opengov/cit-base/build';
import {faker} from '@faker-js/faker';
test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Locations @locations @forms', () => {
  const recordType = `Record Type ${faker.random.alphaNumeric(4)}`;
  test.beforeEach(async ({recordTypesApi}) => {
    await test.step('Create a Record Type and make it public', async () => {
      await recordTypesApi.createRecordType(recordType, 'Test Department');
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      await recordTypesApi.addFormSection(defaultFormSectionObject);
      defaultPayloadForRenewal.recordType.ApplyAccessID = 0;
      defaultPayloadForRenewal.recordType.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultPayloadForRenewal.recordType.name = recordType;
      defaultPayloadForRenewal.recordType.status = 1;
      defaultPayloadForRenewal.recordType.allowSegmentLocations = true;
      await recordTypesApi.updateRecordType(
        baseConfig.citTempData.recordTypeId,
        defaultPayloadForRenewal,
      );
    });
  });

  test('Check that Segment locations can be enabled/disabled @OGT-33949 @Xoriant_Test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    recordTypesApi,
  }) => {
    await test.step('Citizen navigates to Storefront URL', async () => {
      await page.goto(storefrontUrl);
    });
    await test.step(`Citizen starts a record draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(recordType);
    });
    await test.step('Navigate to Locations and verify Segement Location option is displayed', async () => {
      await storeFrontRecordPage.proceedToNextStep();
      await expect(
        page.locator(
          storeFrontRecordPage.elements.locationTypeButton.selector('segment'),
        ),
      ).toBeVisible();
    });
    await test.step('Disable Segment location in Record Type and navigate to Locations Page', async () => {
      defaultPayloadForRenewal.recordType.allowSegmentLocations = false;
      await recordTypesApi.updateRecordType(
        baseConfig.citTempData.recordTypeId,
        defaultPayloadForRenewal,
      );
      await page.reload();
      await storeFrontRecordPage.proceedToNextStep();
    });
    await test.step('Verify Segment Location option is not displayed', async () => {
      await expect(
        page.locator(
          storeFrontRecordPage.elements.locationTypeButton.selector('segment'),
        ),
      ).toBeHidden();
    });
  });
});
