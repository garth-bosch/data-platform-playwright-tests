import {test} from '../../../src/base/base-test';
import {
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStep} from '../../../src/pages/ea-record-page';

test.describe('Employees receive browser notification when @-mentioned in step comment made by another employee', () => {
  test('Employees receive browser notification when @-mentioned in step comment made by another employee @OGT-44045 @Xoriant_Test @known_defect @defect:OGT-48283', async ({
    recordsApi,
    employeeAppUrl,
    internalRecordPage,
    authPage,
    navigationBarPage,
    recordPage,
    page,
  }) => {
    await test.step('Login as an admin', async () => {
      await page.goto(employeeAppUrl);
      await authPage.page.waitForNavigation();
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
      await navigationBarPage.validateNotificationVisibility();
    });
    await test.step(' Go to the record and add a step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
      );
    });
    await test.step(' Add mention comment', async () => {
      await internalRecordPage.addMentionCommentOnRecordStep('API Employee');
    });

    await test.step(' Logout as other employee', async () => {
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
      await navigationBarPage.verifyGivenUnreadMessageNotificationText(
        1,
        `api admin mentioned you in a comment on`,
      );
    });
  });
});
