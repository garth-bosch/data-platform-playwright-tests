import {test} from '../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

const reportSection = ReportSections.Projects;
const defaultReportName = 'All Projects';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe
  .serial('Employee App - Project Reports @report @project_reports', () => {
  test.beforeEach(async ({exploreReportsPage, page, employeeAppUrl}) => {
    await test.step('Navigate to Reports page', async () => {
      await page.goto(employeeAppUrl);
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.openReportSection(reportSection);
    });
  });

  test('User can add/remove filters for columns in the Projects view @OGT-33658 @broken_test', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Project';

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Add ${columnName} column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnAdded(columnName);
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });

    await test.step(`Add and verify filter ${columnName} with Empty value`, async () => {
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.addNewFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.removeAllFilters();
    });
  });

  test('User can create a Projects report @OGT-33659 @OGT-33660', async ({
    exploreReportsPage,
    navigationBarPage,
    authPage,
  }) => {
    let reportId: string;
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Project report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
      reportId = await exploreReportsPage.saveReport();
    });

    await test.step('Relogin as the same user', async () => {
      await navigationBarPage.logout();
      await authPage.loginAsAdmin();
      await authPage.loginSuccessful(true);
    });

    await test.step(`Open created [${reportName}] report on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportId(reportId);
      await exploreReportsPage.clickReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });

  test('User can delete a Projects report view @OGT-33663', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Delete report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportSection(reportSection);
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Delete Report', async () => {
      await exploreReportsPage.deleteReport(reportName);
    });
  });

  test('User can edit default report view for Projects @OGT-33656 @OGT-33657', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Date Started',
      'Created By User',
      'Project',
      'Project ID',
      'Project Template',
    ];

    await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Navigate to Columns Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });

    for (const column of columns) {
      await test.step(`Add [${column}] columns to report view`, async () => {
        await exploreReportsPage.addColumn(column);
      });

      await test.step(`Verify [${column}] columns added to report view`, async () => {
        await exploreReportsPage.verifyColumnAdded(column);
      });
    }
  });

  test('User can explore all Projects @OGT-33655', async ({
    exploreReportsPage,
  }) => {
    await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.openReportAndValidateName(
        defaultReportName,
        reportSection,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('I navigate to the first [project] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('project');
    });
  });

  test('Export reports: Projects @OGT-33662', async ({exploreReportsPage}) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Export report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
    });
  });

  test('Personalized report view can be shared @OGT-33661', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Shared report`;

    await test.step(`Create and share [${reportName}] from [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.shareReport(reportName, reportSection);
    });
  });
});
