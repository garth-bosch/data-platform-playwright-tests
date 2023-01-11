import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {ReportTabs} from '../../../src/pages/explore-reports-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Total Paid column reportable @report @OGT-45159', () => {
  test('User cannot see total paid column as reportable', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Go to explore reports page and click records facet', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });

    await test.step('Check if Total Paid column is absent', async () => {
      await exploreReportsPage.clickActiveRecords();
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.checkTotalPaidColumnAbsent();
    });
  });
});
