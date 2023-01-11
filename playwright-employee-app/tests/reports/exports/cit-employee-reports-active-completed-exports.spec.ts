import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {expect} from '@playwright/test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  baseTemplatesReports,
  ReportTypesScopeId,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.setTimeout(180 * 1000);

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report - etc @report @rails-api-reporting', () => {
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

  let reportName = '';
  const reportsDataToTest = [
    {
      reportType: ReportTypesScopeId.Approvals,
      columns: baseTemplatesReports.generalReportWithColumnsActive,
      filters: baseTemplatesReports.applicantNameFilter,
    },
    {
      reportType: ReportTypesScopeId.Records,
      columns: baseTemplatesReports.applicantNameFilterCompleteColumns,
      filters: baseTemplatesReports.applicantNameFilterComplete,
    },
  ];

  for (const reportData of reportsDataToTest) {
    test(`User can export a report in ${
      ReportTypesScopeId[reportData.reportType]
    } @OGT-46177 @Xoriant_Test`, async ({
      exploreReportsPage,
      reportsApi,
      employeeAppUrl,
      myExportsPage,
      page,
    }) => {
      reportName = `@OGT-46177-${faker.random.alphaNumeric(4)}`;
      await test.step(`Create new report and navigate to it: ${
        ReportTypesScopeId[reportData.reportType]
      }`, async () => {
        await reportsApi.createNewReport(
          reportName,
          reportData.reportType,
          `${JSON.stringify(reportData.columns)}`,
          `${JSON.stringify(reportData.filters)}`,
        );
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Verify export possible and download button enabled', async () => {
        await exploreReportsPage.exportReport(true);
        await exploreReportsPage.validateReportInMyExports(reportName);
        await expect(
          page.locator(
            exploreReportsPage.elements.exportPending.selector(reportName),
          ),
        ).toBeHidden();
        await expect(
          page.locator(
            exploreReportsPage.elements.downloadReadyButton.selector(
              reportName,
            ),
          ),
        ).toBeVisible();
      });
      await test.step('Download the report', async () => {
        await myExportsPage.downloadExportedFile(reportName);
      });
    });
  }
});
