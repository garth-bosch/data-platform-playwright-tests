import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  ReportColumns,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report exporting', () => {
  test('Report with Last Record Activity column should not crash during export @report @OGT-47320', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
    myExportsPage,
    reportsApi,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )}_ESN_5188`;
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await reportsApi.createReport(
      page,
      [
        ReportColumns.recordNumber,
        ReportColumns.lastActivity,
        ReportColumns.recordStatus,
      ],
      reportName,
    );

    await test.step('Go to explore reports page and click records facet', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });

    await test.step(`Select pre-defined report with name ${reportName}`, async () => {
      await exploreReportsPage.clickActiveRecords();
      await exploreReportsPage.selectReportByName(reportName);
    });

    await test.step('Export report and proceed to export page', async () => {
      await exploreReportsPage.exportReport(true);
    });

    await test.step('Wait for export to finish and check if it was successful', async () => {
      await myExportsPage.validateReportInMyExports(reportName);
    });
  });
});
