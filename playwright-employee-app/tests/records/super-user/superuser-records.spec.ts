import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Super user - non Super user settings check App - ', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        // Api_Notification_Test,
        null,
        null,
        [
          {
            fieldName: TestSteps.Approval,
            fieldValue: 'true',
          },
          {
            fieldName: TestSteps.Inspection,
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('SuperUser "run sequence action" button is not present for standard Admin or Employee users @OGT-44510', async ({
    internalRecordPage,
    page,
    authPage,
    navigationBarPage,
  }) => {
    await test.step('Verify run sequence action not present', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await expect(
        page.locator(internalRecordPage.elements.superUserRunToSequence),
      ).toHaveCount(0);
    });
    await test.step('Logout', async () => {
      await authPage.logout();
    });
    await test.step('Login - employee.', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citEmployeeEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await page.waitForNavigation();
      await navigationBarPage.validateOpenGovLogoVisibility(true);
    });
    await test.step('go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Verify run sequence action not present', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await expect(
        page.locator(internalRecordPage.elements.superUserRunToSequence),
      ).toHaveCount(0);
    });
  });

  test('Inspection superUser tool is not present for standard Admin or Employee users [Admin] @OGT-44509', async ({
    internalRecordPage,
    page,
    recordStepInspectionPage,
  }) => {
    await test.step('Create new inspection and validate delete button not there', async () => {
      await internalRecordPage.clickRecordStepName('Inspection');
      await recordStepInspectionPage.createNewInspection();
      await expect(
        await page.locator(
          recordStepInspectionPage.elements.deleteInspectionTest,
        ),
      ).toBeHidden();
    });
    await test.step('Go back and complete inspection', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName('Inspection');
      await recordStepInspectionPage.passInspection(true, true);
    });

    await test.step('Click on the history and verify that the edit inspection is not there', async () => {
      await recordStepInspectionPage.clickInspectionHistory();
      await expect(
        await page.locator(recordStepInspectionPage.elements.editInspection),
      ).toBeHidden();
      await expect(
        page.locator(internalRecordPage.elements.superUserRunToSequence),
      ).toHaveCount(0);
    });
  });
  test('Inspection superUser tool is not present for standard Admin or Employee users [Employee] @OGT-47901', async ({
    internalRecordPage,
    page,
    authPage,
    navigationBarPage,
    recordStepInspectionPage,
  }) => {
    await test.step('Create new inspection and validate delete button not there employee', async () => {
      await internalRecordPage.navigateById();
      await internalRecordPage.clickRecordStepName('Inspection');
      await internalRecordPage.assignStepToUserByEmail(
        baseConfig.citTestData.citEmployeeEmail,
      );
    });
    await test.step('Logout', async () => {
      await authPage.logout();
    });
    await test.step('Login - employee', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citEmployeeEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await page.waitForNavigation();
      await navigationBarPage.validateOpenGovLogoVisibility(true);
    });
    await test.step('Create new inspection and validate delete button not there employee', async () => {
      await internalRecordPage.navigateById();
      await internalRecordPage.clickRecordStepName('Inspection');
      await recordStepInspectionPage.createNewInspection();
      await expect(
        await page.locator(
          recordStepInspectionPage.elements.deleteInspectionTest,
        ),
      ).toBeHidden();
    });
    await test.step('Go back and complete inspection', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName('Inspection');
      await recordStepInspectionPage.passInspection(true, true);
    });

    await test.step('Click on the history and verify that the edit inspection is not there', async () => {
      await recordStepInspectionPage.clickInspectionHistory();
      await expect(
        await page.locator(recordStepInspectionPage.elements.editInspection),
      ).toBeHidden();
      await expect(
        page.locator(internalRecordPage.elements.superUserRunToSequence),
      ).toHaveCount(0);
    });
  });
});
