import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Group App - Settings - Group settings', () => {
  let groupName: string;
  test.beforeEach(async ({systemSettingsPage}) => {
    await test.step('construct group name', async () => {
      groupName = `${systemSettingsPage.plcPrefix()}_${faker.random.alphaNumeric(
        4,
      )}`;
    });
  });

  test('Admin can add, edit, & delete a group from the organization @OGT-34117 @OGT-34112 @OGT-34113 @OGT-34114 @PLCE-2288', async ({
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Groups section -> create a group', async () => {
      await systemSettingsPage.proceedToSection('Groups');
      await systemSettingsPage.addGroup(groupName);
    });
    await test.step('Group does not appear in global search', async () => {
      await systemSettingsPage.checkGlobalSearch(groupName);
    });
    await test.step('Group can be edited', async () => {
      await systemSettingsPage.editGroupName(groupName, groupName + 1);
    });
    await test.step('Delete the created group', async () => {
      await systemSettingsPage.deleteGroup(groupName + 1);
    });
  });

  test('Admin can add & remove users the group @OGT-34116 @OGT-34115 @PLCE-2288', async ({
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Groups section -> add user to group', async () => {
      await systemSettingsPage.proceedToSection('Groups');
      await systemSettingsPage.addGroup(groupName);
      await systemSettingsPage.addUserToGroup('m');
    });
    await test.step('Remove user from group', async () => {
      await systemSettingsPage.removeUserFromGroup();
      await page.goBack();
      await systemSettingsPage.deleteGroup(groupName);
    });
  });
});
