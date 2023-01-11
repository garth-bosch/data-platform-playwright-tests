import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report', () => {
  let recTypeNo: any;
  const recTypeName = `@OGT-33607_${faker.random.alphaNumeric(4)}`;
  const recordName1 = `${recTypeName}_one`;
  const recordName2 = `${recTypeName}_two`;
  test.beforeEach(
    async ({
      employeeAppUrl,
      recordTypesApi,
      recordsApi,
      navigationBarPage,
      recordTypesSettingsPage,
      systemSettingsPage,
      page,
    }) => {
      await test.step('Create a Record Type', async () => {
        recTypeNo = await recordTypesApi.createRecordType(recTypeName);
      });
      await test.step('Navigate to Home Screen by URL', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to Admin Settings', async () => {
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section, select record type and publish', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recTypeName);
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
      await test.step('Create a multiple records', async () => {
        await recordsApi.createRecordWith({name: recordName1, id: recTypeNo});
        await recordsApi.createRecordWith({name: recordName2, id: recTypeNo});
      });
      await test.step('Delete record type', async () => {
        await recordTypesApi.deleteRecordType(recTypeNo);
      });
      await test.step('Navigate to Admin Settings', async () => {
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and verify deleted record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.setNameFilter(recTypeName);
        await recordTypesSettingsPage.verifyDeletedRecordType();
      });
    },
  );

  test(`Verify that filtering by deleted record type displays results if there exist records for it @reports @OGT-33607 @Xoriant_Test`, async ({
    page,
    employeeAppUrl,
    exploreReportsPage,
  }) => {
    await test.step('Navigate to Test Department Completed Filters', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/d2`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('User can filter Reports for the deleted recorded types', async () => {
      await exploreReportsPage.reportPageIsVisible();
      await exploreReportsPage.clickEditCompletedRecords();
      await exploreReportsPage.selectFilter('Record Type');
      await exploreReportsPage.applyFilterCondition(recTypeName);
      await exploreReportsPage.verifyRecordsCountOnReport(2);
    });
  });
});
