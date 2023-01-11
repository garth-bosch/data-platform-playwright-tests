import {expect, test} from '../../src/base/base-test';
import {
  FilterTypes,
  RecordStatuses,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {TestUsers} from '@opengov/cit-base/build/constants/cit-constants';

const reportSection = ReportSections.Approvals;
const defaultReportName = 'Active Approvals';
const user = {
  email: TestUsers.Report_Admin.email,
  password: baseConfig.citTestData.citAppPassword,
  isAdmin: true,
};

test.setTimeout(180 * 1000);
test.describe('Employee App - Approval Reports @report @approval_reports', () => {
  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage, authPage}) => {
      await test.step('Login to EA and navigate to Reports page', async () => {
        await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
        await authPage.loginAs(user.email, user.password);
        await authPage.page.waitForNavigation();
        await authPage.loginSuccessful(user.isAdmin);
        await exploreReportsPage.waitReportTableLoaded();
        await exploreReportsPage.openReportSection(reportSection);
      });
    },
  );

  test('Employee User can see correct colors in the Status Bar column in the Approvals view @OGT-33627 @broken_test', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Status Bar report`;
    const column = 'Record Status Bar';

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step(`Add [${column}] column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(column);
      await exploreReportsPage.verifyColumnsAdded([column]);
      await exploreReportsPage.verifyColumnAdded(column);
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });

    for (const status in RecordStatuses) {
      await test.step(`Add and verify filter Approval Status with value ${status}`, async () => {
        await exploreReportsPage.waitReportTableLoaded();
        await exploreReportsPage.addNewFilter(
          'Approval Status',
          FilterTypes.Is,
          {selectOptions: [status]},
        );
        await exploreReportsPage.verifyStatusBarValue(RecordStatuses[status]);
        await exploreReportsPage.removeAllFilters();
      });
    }
  });

  test('Employee User can add/remove filters for columns in the Approvals view @OGT-33620', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Create report`;
    const columnName = 'Assignee';

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step(`Add [${columnName}] column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnsAdded([columnName]);
    });

    await test.step(`I create filter: [${columnName}] is 'empty'`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.addNewFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Empty);
    });
  });

  test('Employee User can create an Approval report @OGT-33626 @OGT-33622', async ({
    exploreReportsPage,
    navigationBarPage,
    authPage,
  }) => {
    let reportId: string;
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Create report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
      reportId = await exploreReportsPage.saveReport();
    });

    await test.step('Relogin as the same user', async () => {
      await navigationBarPage.logout();
      await authPage.loginAs(user.email, user.password);
      await authPage.page.waitForNavigation();
      await authPage.loginSuccessful(user.isAdmin);
    });

    await test.step(`Open created [${reportName}] report on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportId(reportId);
      await exploreReportsPage.clickReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });

  test('Employee User can delete an Approvals report view @OGT-33625', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Delete report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Delete Report', async () => {
      await exploreReportsPage.deleteReport(reportName);
      await expect(
        await exploreReportsPage.getReportLocator('Active Approvals'),
      ).toBeHidden();
    });

    await test.step(`Verify Deleted Report is not present in [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportSection(reportSection);
      await expect(
        await exploreReportsPage.getReportLocator(defaultReportName),
      ).toBeVisible();
      await expect(
        await exploreReportsPage.getReportLocator(reportName),
      ).toBeHidden();
    });
  });

  test('Employee User can edit default report view for Approvals @OGT-33618 @OGT-33619', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Assignee',
      'Label',
      'Applicant Email',
      'Building Type',
      'City',
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
        await exploreReportsPage.verifyColumnsAdded([column]);
      });
    }
  });

  //* TODO: This is a duplicate test of OGT-33617 @duplicate
  test('Employee User can explore active and completed approvals @broken_test', async ({
    exploreReportsPage,
  }) => {
    const reportsToBeOpened = [defaultReportName, 'Completed Approvals'];
    for (const reportName of reportsToBeOpened) {
      await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
        await exploreReportsPage.openReportAndValidateName(
          reportName,
          reportSection,
        );
      });
      await exploreReportsPage.waitReportTableLoaded();
    }

    await test.step('I navigate to the first [approval] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('approval');
    });
  });

  test('Employee Export reports: Approvals @OGT-33624', async ({
    exploreReportsPage,
    myExportsPage,
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
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
    });
  });

  test('Employee User can explore an existing report if hidden filter operator is present @OGT-40113 @broken_test', async ({
    exploreReportsPage,
  }) => {
    const report = {
      name: 'Test Report - DO NOT MODIFY',
      id: '8025',
    };

    await test.step(`Open [${report.name}] from [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportId(report.id);
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        report.name,
      );
    });

    await test.step('Add and verify [Approval Status] filter', async () => {
      await exploreReportsPage.checkFilter('Approval Status', FilterTypes.Any);
      await exploreReportsPage.getTotalRecordsCount();
      await exploreReportsPage.validateRecordCount();
    });
  });

  test('Personalized report view can be shared @OGT-33623', async ({
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
