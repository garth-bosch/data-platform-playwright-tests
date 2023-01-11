import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Group App - Settings - Group settings', () => {
  test('An employee can remove the existing user flag to any user @OGT-34510 @OGT-34509', async ({
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to users section', async () => {
      await systemSettingsPage.proceedToSection('Users');
    });
    await test.step('Admin can add user flag OGT-34510', async () => {
      await systemSettingsPage.addUserFlag();
    });
    await test.step('Admin can remove user flag OGT-34509', async () => {
      await systemSettingsPage.removeUserFlag();
    });
  });
});
