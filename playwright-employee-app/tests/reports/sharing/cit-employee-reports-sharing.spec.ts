import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ReportSections,
  ReportTabs,
  ReportTypes,
} from '../../../src/pages/explore-reports-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {TestUsers} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

const plcPrefix = () => baseConfig.citTestData.plcPrefix;
const departmentName = 'Test Data - DO NOT MODIFY';

test.setTimeout(180 * 1000);
test.describe('Share report - Report @report @rails-api-reporting', () => {
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

  test('User can view shared report view by others @OGT-33587 @broken_test @Xoriant_test @known_defect', async ({
    exploreReportsPage,
    authPage,
    page,
    employeeAppUrl,
  }) => {
    const reportName = `Tran_Rpt_OGT_33587_${plcPrefix()}${faker.random.alphaNumeric(
      4,
    )}`;
    const reportColumns = ['Community Paid Transaction Fee', 'Transaction Fee'];

    await test.step('Create Transactions Report on Payment report section', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Payments);
      await exploreReportsPage.createNewReport(
        ReportSections.Payments,
        ReportTypes.Transactions,
        reportName,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Add columns to the report and verify and save', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
      await exploreReportsPage.saveReport();
    });
    await test.step('Share report', async () => {
      await exploreReportsPage.clickReportAction('Share Report');
      await exploreReportsPage.clickShareReporModal();
    });
    await test.step('As Admin user Login after logging out', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citAdminEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Check login successful', async () => {
      await authPage.loginSuccessful(true);
    });
    await test.step('Go to reports page', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    });
    await test.step('Search and verify report', async () => {
      await exploreReportsPage.searchReport(reportName);
      await expect(
        await exploreReportsPage.getReportLocator(reportName),
      ).toBeVisible();
    });
  });
});
