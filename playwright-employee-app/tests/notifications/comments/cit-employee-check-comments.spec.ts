import {test} from '../../../src/base/base-test';
import {
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStep} from '../../../src/pages/ea-record-page';

test.describe('Applicant cant see Internal Comments', () => {
  test("Applicants can't see internal step comments @OGT-44185 @broken_test @Xoriant_Test", async ({
    recordsApi,
    employeeAppUrl,
    internalRecordPage,
    authPage,
    navigationBarPage,
    recordPage,
    page,
  }) => {
    await test.step('Initialize and mark notifications read', async () => {
      await page.goto(employeeAppUrl);
      await authPage.page.waitForNavigation();
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await navigationBarPage.clickAndMarkAllBellNotificationAsRead();
      await authPage.logout();
    });
    await test.step('Login as a diff employee: Any', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citAdminEmail,
        baseConfig.citTestData.citAppPassword,
      );
    });
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Api_Notification_Test,
        TestUsers.Notification_user.email,
      );
      await page.goto(employeeAppUrl, {waitUntil: 'domcontentloaded'});
    });
    await test.step(' Go to the record and add a step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
      );
    });
    await test.step(' Assign a user and update the step', async () => {
      await internalRecordPage.addAssigneeForWorkflowSteps(
        'Adhoc-Inspection',
        TestUsers.Notification_user.email,
      );
      await internalRecordPage.clickRecordStepName('Adhoc-Inspection');
      await internalRecordPage.addCommentOnRecordStep('@OGT-44185 Step');
    });
    await test.step('Logout as other employee', async () => {
      await authPage.logout();
    });
    await test.step(' Login as needed user', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
    });
    await test.step(' Verify the notification says require your attention', async () => {
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.verifyNotificationbadgeContainsAtleast(1);
      const recordId = baseConfig.citTempData.recordId;
      await navigationBarPage.verifyGivenUnreadMessageNotificationText(
        1,
        `${recordId} requires your attention`,
      );
    });
  });
});
