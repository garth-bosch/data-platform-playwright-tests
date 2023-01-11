import {test} from '../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Report', () => {
  test('User can filter Reports by Departments under Filter @reports @OGT-44493', async ({
    page,
    employeeAppUrl,
    exploreReportsPage,
  }) => {
    const reportName = `@OGT-44493-${faker.random.alphaNumeric(4)}`;
    await test.step('Login to EA', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    });
    await test.step('User can filter Reports by Departments under Filter', async () => {
      await exploreReportsPage.reportPageIsVisible();
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.clickReportTab();
      await exploreReportsPage.clickDepartmentDropdown();
      await exploreReportsPage.clickReportSaveButton();
      await exploreReportsPage.saveReportByDepartment(reportName);
      await exploreReportsPage.validateReportName(reportName);
    });
  });
});
