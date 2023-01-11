import {test} from '../../../src/base/base-test';
import {
  TestRecordTypes,
  TestUsers,
  ADMIN_SESSION,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employees receive browser notification', () => {
  test('Employees receive browser notification when a comment is made on step user is assigned to @OGT-44041 @Xoriant_Test', async ({
    recordsApi,
    internalRecordPage,
    authPage,
    navigationBarPage,
  }) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Go to the record and click on the Approval step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickCustomStepByName('Approval');
    });
    await test.step('Assign step to different user', async () => {
      await internalRecordPage.assignStepToUserByEmail(
        TestUsers.Notification_user.email,
      );
    });
    await test.step('Add a comment', async () => {
      await internalRecordPage.addCommentOnRecordStep(
        'Test Comment for Browser Notification',
      );
    });
    await test.step('Login as a diff employee: Any', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step(' Verify the notification received for comment made on a step that is assigned to', async () => {
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.verifyNotificationbadgeContainsAtleast(1);
      const recordName = baseConfig.citTempData.recordName;
      await navigationBarPage.verifyGivenUnreadMessageNotificationText(
        1,
        `${TestUsers.Api_Admin.name} commented on Approval for ${TestRecordTypes.Record_Steps_Test.name} ${recordName}`,
      );
    });
  });
});
