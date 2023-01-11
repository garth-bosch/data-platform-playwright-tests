import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
const SEARCH_KEYWORD = 'api_admin@';
const USER_ACCOUNT = TestUsers.Api_Admin.email;
test.use({storageState: ADMIN_SESSION});
test.describe('Admin can view active/complete records of user', async () => {
  test.beforeEach(async ({navigationBarPage, employeeAppUrl, page}) => {
    await test.step(`Admin enters a partial name ${SEARCH_KEYWORD} in global search and clicks on the displayed user`, async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.performGlobalSearchAndClick(SEARCH_KEYWORD);
    });
  });

  test('Admin can view active/complete records of user @OGT-34109 @Xoriant_Test @smoke', async ({
    userProfileSettingsPage,
  }) => {
    await test.step(`Verify searched user ${SEARCH_KEYWORD} is displayed`, async () => {
      await userProfileSettingsPage.verifyUserEmail(USER_ACCOUNT);
    });
    await test.step(`Verify atleast one Active records should present for ${USER_ACCOUNT}`, async () => {
      await userProfileSettingsPage.clickRecordSpecificTab('Active');
      await userProfileSettingsPage.verifyRecordsAreNotEmpty('Active');
    });
    await test.step(`Verify atleast one Complete records should present for ${USER_ACCOUNT}`, async () => {
      await userProfileSettingsPage.clickRecordSpecificTab('Complete');
      await userProfileSettingsPage.verifyRecordsAreNotEmpty('Complete');
    });
  });
});
