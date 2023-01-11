import {test} from '../../../src/base/base-test';
import {ReportSections} from '../../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {expect} from '@playwright/test';

test.setTimeout(180 * 1000);

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report - etc @report @rails-api-reporting', () => {
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

  test.beforeEach(async ({page, employeeAppUrl, exploreReportsPage}) => {
    await test.step('Navigate to the reports page', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });
  let reportName = '';
  const filterName = 'Applicant Name';
  const filterValue = 'api admin';

  const reportsDataToTest = ['Payments', 'Payments Due', 'Ledger'];

  for (const initialReportName of reportsDataToTest) {
    test(`User can export a ${initialReportName} report @OGT-46180 @Xoriant_Test`, async ({
      exploreReportsPage,
      myExportsPage,
      page,
    }) => {
      reportName = `@OGT-46179-${faker.random.alphaNumeric(4)}`;
      await test.step(`Open report section and go to ${initialReportName}`, async () => {
        await exploreReportsPage.openReportSection(ReportSections.Payments);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Payments,
          initialReportName,
        );
      });
      await test.step('Create a filter', async () => {
        await exploreReportsPage.clickFiltersTab();
        await exploreReportsPage.createFilter(filterName, filterValue);
      });
      await test.step('Save report and validate it', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
        await exploreReportsPage.clickReport(reportName);
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
