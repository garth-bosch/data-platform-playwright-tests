import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Check reports various @report @approval_reports', () => {
  test.beforeEach(async ({page, employeeAppUrl, exploreReportsPage}) => {
    await test.step('Login to EA and navigate to Reports page', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });

  test('User can explore active, completed records @Xoriant_Test @OGT-33580  @Xoriant_Temp_01_Mahesh', async ({
    exploreReportsPage,
  }) => {
    await test.step(`Check and verify completed and active records exists`, async () => {
      await exploreReportsPage.clickActiveRecords();
      await exploreReportsPage.clickCompletedRecordsFilter();
    });
    await test.step(`Go to default records`, async () => {
      await exploreReportsPage.clickRecordsMenu();
    });

    await test.step(`Navigate and verify the first item - active`, async () => {
      await exploreReportsPage.navigateToFirstItem('active');
    });
  });

  test('User can explore active, completed approvals @Xoriant_Test @OGT-33617  @Xoriant_Temp_01_Mahesh', async ({
    exploreReportsPage,
  }) => {
    await test.step(`Check and verify completed and active Approvals exists`, async () => {
      await exploreReportsPage.clickApprovalRecords();
      await exploreReportsPage.clickActiveApproval();
      await exploreReportsPage.clickCompletedApproval();
    });
    await test.step(`Go to default Approvals`, async () => {
      await exploreReportsPage.clickApprovalRecords();
    });

    await test.step(`Navigate and verify the first item - active`, async () => {
      await exploreReportsPage.navigateToFirstItem('active approvals');
    });
  });
});
