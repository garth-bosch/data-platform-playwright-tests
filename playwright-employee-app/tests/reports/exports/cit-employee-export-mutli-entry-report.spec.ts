import {test} from '../../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../../src/pages/explore-reports-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {TestUsers} from '@opengov/cit-base/build/constants/cit-constants';

const reportSection = ReportSections.Approvals;
const recordType = 'Automation - DO NOT MODIFY';
const departmentName = 'Test Data - DO NOT MODIFY';
const user = {
  email: TestUsers.Report_Admin.email,
  password: baseConfig.citTestData.citAppPassword,
  isAdmin: true,
};

test.setTimeout(180 * 1000);
test.describe('Multi-entry report Exports', () => {
  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage, authPage}) => {
      await test.step('Login to EA and navigate to Reports page', async () => {
        await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
        await authPage.loginAs(user.email, user.password);
        await authPage.page.waitForNavigation();
        await authPage.loginSuccessful(user.isAdmin);
        await exploreReportsPage.waitReportTableLoaded();
        await exploreReportsPage.openReportSection(reportSection);
        await exploreReportsPage.selectDepartment(departmentName);
        await exploreReportsPage.waitReportTableLoaded();
      });
    },
  );

  test('Multi-entry Exports with Form Columns are exported via zip files containing multiple files @OGT-46205 @broken_test @Xoriant_test', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `OGT-46205 ${faker.random.alphaNumeric(
      4,
    )} Multi Entry report`;
    const columnName = 'Multi text';

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.navigateToReportTab(ReportTabs.General);
      await exploreReportsPage.selectRecordType(recordType);
    });

    await test.step(`Add [${columnName}] column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnsAdded([columnName]);
    });

    await test.step(`I create form filter: [${columnName}] is 'empty'`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createNewFormFilter(columnName);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Any);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.verifyZipFileHasExpectedFilesList(
        reportName,
        2,
        '.csv',
      );
    });
  });

  test('Multi-entry Exports with Department Form Fields are exported via zip files containing multiple files @OGT-46204 @broken_test @Xoriant_test', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `OGT-46204 ${faker.random.alphaNumeric(
      4,
    )} Multi Entry report`;
    const columnName = 'Shared Multi text field';

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.navigateToReportTab(ReportTabs.General);
    });

    await test.step(`Add [${columnName}] column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnsAdded([columnName]);
    });

    await test.step(`I create form filter: [${columnName}] is 'empty'`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createNewFormFilter(columnName);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Any);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.verifyExportedFileExtention(reportName, '.csv');
    });
  });
});
