import {test} from '../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

const reportSection = ReportSections.Documents;
const defaultReportName = 'Issued Documents';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe
  .serial('Employee App - Document Reports @report @document_reports', () => {
  test.beforeEach(async ({exploreReportsPage, page, employeeAppUrl}) => {
    await test.step('Navigate to Reports page', async () => {
      await page.goto(employeeAppUrl);
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.openReportSection(reportSection);
    });
  });

  test('Employee User can add/remove filters for columns in the Documents view @OGT-33649', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Expires';

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

    await test.step(`Add and verify filter Expires with Empty value`, async () => {
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.addNewFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.removeAllFilters();
    });
  });

  //* TODO: This is a duplicate of @OGT-33651 @duplicate
  test('Employee User can create a Documents report @OGT-33650', async ({
    exploreReportsPage,
    navigationBarPage,
    authPage,
  }) => {
    let reportId: string;
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Document report`;

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

  test('Employee User can delete a Documents report view @OGT-33654', async ({
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

  test('Employee User can edit default report view for Documents @OGT-33647 @OGT-33648', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Date Issued',
      'Document Type',
      'Record Type',
      'Applicant Email',
      'Applicant Name',
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

  test('Employee User can explore issued documents @OGT-33646', async ({
    exploreReportsPage,
  }) => {
    await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.openReportAndValidateName(
        defaultReportName,
        reportSection,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('I navigate to the first [document] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('document');
    });
  });

  test('Employee Export reports: Documents @OGT-33653', async ({
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

  test('Personalized report view can be shared @OGT-33652', async ({
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
