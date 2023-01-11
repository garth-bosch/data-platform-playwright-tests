import {expect, test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Inspect', () => {
  test('Inspector can filter inspection requests per Departments @OGT-34429 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    inspectPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Navigate to Inspect', async () => {
      await navigationBarPage.clickExploreInspectionsButton();
    });
    await test.step('Goto Requests Page and Change the Department filter', async () => {
      await page.locator(inspectPage.elements.requestsButton).click();
      await inspectPage.selectDepartment('Test Department');
    });
    await test.step('Verify Inspection Requests are filtered as per department', async () => {
      const inspectionRequest = await page
        .locator(inspectPage.elements.inspectionRequests)
        .allInnerTexts();
      const testRecordType = TestRecordTypes.Record_Steps_Test.name;
      expect(inspectionRequest[0].includes(testRecordType)).toBeTruthy();
    });
  });
});
