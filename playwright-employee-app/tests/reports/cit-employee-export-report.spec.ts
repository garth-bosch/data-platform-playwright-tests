import {test} from '../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Report exporting', () => {
  test('User can export a report @report @OGT-46415 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
    myExportsPage,
  }) => {
    await test.step('Login to Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to explore reports page', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });
    await test.step('Export report and proceed to export page', async () => {
      await exploreReportsPage.exportReport(true);
    });
    await test.step('Wait for export to finish and check if it was successful', async () => {
      await myExportsPage.validateReportInMyExports('Active Records');
    });
  });
});
