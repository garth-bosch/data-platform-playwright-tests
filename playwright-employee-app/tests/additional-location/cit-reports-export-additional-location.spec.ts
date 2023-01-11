import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {ReportSections} from '../../src/pages/explore-reports-page';
test.use({storageState: ADMIN_SESSION});
test.describe('Verify exported report file for additional locations in reports tab @additionalLocation @report', () => {
  const reportName = 'Active Records';
  test.beforeEach(async ({page, employeeAppUrl, exploreReportsPage}) => {
    await test.step('Login to EA', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });
  test('Separate CSV file for additional locations should not be included in the exported report @OGT-44765', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    await test.step('Navigate to reports section', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
    });

    //If Location column added in report,then two files will be exported and  extension will be .zip
    //If there is a single file in export, the extension will be .csv
    await test.step('Verify separate CSV file should not be included in the export file, if location column is not added in report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      await myExportsPage.verifyExportedFileExtention(reportName, '.csv');
    });
  });
});
