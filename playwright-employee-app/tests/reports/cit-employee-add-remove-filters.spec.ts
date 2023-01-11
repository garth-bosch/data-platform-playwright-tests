import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {ReportTabs} from '../../src/pages/explore-reports-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report @report', () => {
  test('User can add/remove filters for column in the view @OGT-46414 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
    recordsApi,
  }) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: TestSteps.Inspection,
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Login to Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to explore reports page', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });
    await test.step('Navigate to a Report', async () => {
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });
    await test.step('Create a filter and verify the records', async () => {
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const rowCount = await page
        .locator(exploreReportsPage.elements.rowcount)
        .count();
      expect(rowCount, 'Records table count').toBe(1);
      await expect(
        page.locator(exploreReportsPage.elements.firstDataRowRecordLink),
        'Record #',
      ).toHaveText(baseConfig.citTempData.recordName);
    });
    await test.step('Remove Filter and verify the record count is greater than 1', async () => {
      await page.click(
        exploreReportsPage.elements.closeFilterValueButton.selector('Record #'),
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const rowCount = await page
        .locator(exploreReportsPage.elements.rowcount)
        .count();
      expect(rowCount, 'Records table count').toBeGreaterThan(1);
    });
  });
});
