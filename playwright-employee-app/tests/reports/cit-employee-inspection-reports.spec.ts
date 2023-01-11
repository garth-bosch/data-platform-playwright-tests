import {test} from '../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

const reportSection = ReportSections.Inspections;
const defaultReportName = 'Active Inspections';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe
  .serial('Employee App - Inspection Reports @report @inspection_reports', () => {
  test.beforeEach(async ({exploreReportsPage, page, employeeAppUrl}) => {
    await test.step('Navigate to Reports page', async () => {
      await page.goto(employeeAppUrl);
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.openReportSection(reportSection);
    });
  });

  test('User can add/remove filters for columns in the Inspections view @OGT-33640', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Full Address';

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step('Add Expires column to the report', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnAdded(columnName);
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });

    await test.step(`Add and verify filter Expires with Empty value`, async () => {
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.addNewFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.removeAllFilters();
    });
  });

  // TODO: This is a duplicate of @OGT-33642 @duplicate
  test('User can create an Inspections report @OGT-33641', async ({
    exploreReportsPage,
    navigationBarPage,
    authPage,
  }) => {
    let reportId: string;
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Inspection report`;

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

  test('User can delete an Inspections report view @OGT-33645', async ({
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

  test('User can edit default report view for Inspections @OGT-33638 @OGT-33639', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Last Inspection',
      'Next Inspection',
      'Inspection Status',
      'Due Date',
      'Expiration Date',
      'Submitted Online',
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

  test('User can explore active, instection results reports @OGT-33637 @yuri_deprecate @known_defect', async ({
    exploreReportsPage,
  }) => {
    const reportsToBeOpened = [defaultReportName, 'Inspection Results'];
    for (const reportName of reportsToBeOpened) {
      await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
        await exploreReportsPage.openReportAndValidateName(
          reportName,
          reportSection,
        );
      });
      await exploreReportsPage.waitReportTableLoaded();
    }

    await test.step('I navigate to the first [inspection] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('inspection');
    });
  });

  test('Export reports: Inspections @OGT-33644', async ({
    exploreReportsPage,
  }) => {
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

  test('Personalized report view can be shared @OGT-33643', async ({
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
