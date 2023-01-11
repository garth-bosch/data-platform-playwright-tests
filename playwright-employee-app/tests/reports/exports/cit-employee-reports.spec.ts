import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ReportSections,
  ReportTabs,
  ReportTypes,
} from '../../../src/pages/explore-reports-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {TestUsers} from '@opengov/cit-base/build/constants/cit-constants';

const plcPrefix = () => baseConfig.citTestData.plcPrefix;
const departmentName = 'Test Data - DO NOT MODIFY';

test.setTimeout(180 * 1000);
test.describe('Employee App - Report @report @rails-api-reporting', () => {
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage, authPage}) => {
      await test.step('Login to EA and navigate to Reports page', async () => {
        await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
        await authPage.loginAs(
          TestUsers.Report_Admin.email,
          baseConfig.citTestData.citAppPassword,
        );
        await authPage.page.waitForNavigation();
        await authPage.loginSuccessful(true);
        await exploreReportsPage.waitReportTableLoaded();
        await exploreReportsPage.selectDepartment(departmentName);
      });
    },
  );

  test('User can create and export Ledger report @OGT-45391 @broken_test', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `Ledger Report ${plcPrefix()}${faker.random.alphaNumeric(
      4,
    )}`;
    const reportColumns = [
      'Fee Label',
      'Amount Paid',
      'Account',
      'Date Paid',
      'Payment Method',
      'Payment Note',
      'Invoice Number',
      'Receipt Number',
      'Transaction ID',
      'Transaction Type',
      'Processed by User',
      'Payer Name',
      'Check Number',
    ];

    await test.step('Create Ledger Report on Payment report section', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Payments);
      await exploreReportsPage.createNewReport(
        ReportSections.Payments,
        ReportTypes.Ledger,
        reportName,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Add columns to the report', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.downloadExportedFile(reportName);
    });
  });

  test('User can create and export Transactions report @OGT-45392 @broken_test', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `Transactions Report ${plcPrefix()}${faker.random.alphaNumeric(
      4,
    )}`;
    const reportColumns = [
      'Community Paid Transaction Fee',
      'Transaction Fee',
      'Check Number',
      'Payer Name',
      'Processed by User',
      'Transaction ID',
      'Receipt Number',
      'Payment Note',
      'Void',
      'Date Paid',
      'Amount',
      'Label',
      'Payment Method',
      'Invoice Number',
      'Transaction Type',
    ];

    await test.step('Create Transactions Report on Payment report section', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Payments);
      await exploreReportsPage.createNewReport(
        ReportSections.Payments,
        ReportTypes.Transactions,
        reportName,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Add columns to the report', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.downloadExportedFile(reportName);
    });
  });

  test('User can create and export Inspection results report @OGT-45393 @broken_test', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `Inspection results Report ${plcPrefix()}${faker.random.alphaNumeric(
      4,
    )}`;
    const reportColumns = [
      'Note',
      'Assignee',
      'Inspector',
      'Date',
      'Result',
      'Label',
      'Inspection Type',
    ];

    await test.step('Create Transactions Report on Payment report section', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Inspections);
      await exploreReportsPage.createNewReport(
        ReportSections.Inspections,
        ReportTypes.InspectionResults,
        reportName,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Add columns to the report', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.downloadExportedFile(reportName);
    });
  });
});
