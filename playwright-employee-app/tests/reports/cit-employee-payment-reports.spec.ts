import {test} from '../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

const reportSection = ReportSections.Payments;
const defaultReportName = 'Payments Due';

test.setTimeout(240 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe
  .serial('Employee App - Payment Reports @report @payment_reports', () => {
  test.beforeEach(async ({exploreReportsPage, page, employeeAppUrl}) => {
    await test.step('Navigate to Reports page', async () => {
      await page.goto(employeeAppUrl);
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.openReportSection(reportSection);
    });
  });

  test('User can add/remove filters for columns in the Payments view @OGT-33631', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Applicant Name';

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Navigate to Columns Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });

    await test.step(`Add [${columnName}] columns to report view`, async () => {
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

  // TODO: The OGT number for this is not correct
  test('User can create a Payments report @OGT-33632', async ({
    exploreReportsPage,
    navigationBarPage,
    authPage,
  }) => {
    let reportId: string;
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Payment report`;

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

  test('User can delete a Payments report view @OGT-33636', async ({
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

  test('User can edit default report view for Payments @OGT-33629 @OGT-33630', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Applicant Name',
      'Became Due',
      'Payment Status',
      'Balance Remaining',
      'Sewage',
      'Date Submitted',
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

  test('User can explore payments due, payments, ladger reports @OGT-33628', async ({
    exploreReportsPage,
  }) => {
    const reportsToBeOpened = [defaultReportName, 'Payments', 'Ledger'];
    for (const reportName of reportsToBeOpened) {
      await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
        await exploreReportsPage.openReportAndValidateName(
          reportName,
          reportSection,
        );
      });
      await exploreReportsPage.waitReportTableLoaded();
    }

    await test.step('I navigate to the first [payment] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('payment');
    });
  });

  test('Export reports: Payments @OGT-33635', async ({exploreReportsPage}) => {
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

  test('Personalized report view can be shared @OGT-33634', async ({
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
