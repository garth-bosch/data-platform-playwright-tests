import {expect, test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Adhoc records steps persists the completion order', () => {
  const recType = `plc_prefix_OGT-34315_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi, recordsApi}) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recType, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Administer'],
      });
    });
    await test.step('Create Record', async () => {
      baseConfig.citTestData.needStrFrontUser = true;
      baseConfig.citTestData.reAuthenticate = true;
      await recordsApi.createRecordWith(
        {
          name: baseConfig.citTempData.recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        undefined,
        undefined,
      );
      baseConfig.citTestData.needStrFrontUser = false;
      baseConfig.citTestData.reAuthenticate = false;
    });
  });

  test('Citizen submitted records through Storefront are available in Employee app @OGT-34315 @Xoriant_Test', async ({
    internalRecordPage,
    employeeAppUrl,
    exploreReportsPage,
    page,
  }) => {
    await test.step('navigate to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });
    await test.step('Navigate to reports screen', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/d2`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify the record exists', async () => {
      await expect(
        await page.locator(
          exploreReportsPage.elements.cellWithText.selector(recType),
        ),
      ).toBeVisible();
      await expect(
        await page.locator(
          exploreReportsPage.elements.cellWithText.selector(
            baseConfig.citTempData.recordName,
          ),
        ),
      ).toBeVisible();
    });
  });
});
