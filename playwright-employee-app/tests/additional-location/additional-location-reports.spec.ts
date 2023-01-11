import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
} from '@opengov/cit-base/build/constants/cit-constants';
import {ReportSections, ReportTabs} from '../../src/pages/explore-reports-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Validate primary and additional locations visibility in the “Location” column on reports page @additionalLocation @report', () => {
  const reportColumns = ['Location', 'Number of Locations'];
  test.beforeEach(async ({page, employeeAppUrl, exploreReportsPage}) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('click on explore on landing page and select location and number of location column', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(reportColumns);
    });
  });
  test('Verify numerical icon should not display when only primary locations is present in the “Location” column @OGT-43080', async ({
    exploreReportsPage,
  }) => {
    await test.step('check numerical count should not appear if additional location not present in record', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter('Number of Locations', '1');
      await exploreReportsPage.verifyFilteredData(false, null);
    });
  });

  test('Verify numerical count should appear if additional location present in record @OGT-43079', async ({
    exploreReportsPage,
  }) => {
    await test.step('check numerical count should appear as additional location is present in record', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter('Number of Locations', '2');
      await exploreReportsPage.verifyFilteredData(true, null);
    });
  });
  test('Verify Explore reports can be filtered on additional locations @OGT-43154', async ({
    exploreReportsPage,
  }) => {
    await test.step('Check additional locations can be filtered in Explore reports page', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter(
        'Location',
        TestLocation.Test_Tole_12.name,
      );
      await exploreReportsPage.verifyFilteredData(
        false,
        TestLocation.Test_Tole_12.name,
      );
    });
  });
});
