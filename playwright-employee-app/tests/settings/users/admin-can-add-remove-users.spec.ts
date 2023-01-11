import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - User settings', () => {
  let userEmail: string;
  test.beforeEach(async ({systemSettingsPage}) => {
    await test.step('construct user email', async () => {
      userEmail = `${systemSettingsPage.plcPrefix()}_${faker.random.alphaNumeric(
        4,
      )}@opengov.com`;
    });
  });

  test('Deleted users without any records should not show up in the global search results @OGT-34475 @broken_test @Xoriant_Test @known_defect @smoke', async ({
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Users section -> create a user and verify newly created email should present', async () => {
      await systemSettingsPage.proceedToSection('Users');
      await systemSettingsPage.createUser(userEmail);
      await systemSettingsPage.validateUserPresent();
    });
    await test.step('verify created user in global search', async () => {
      await navigationBarPage.performSearchContaining(userEmail, userEmail);
    });
    await test.step('Delete user email and verify user', async () => {
      await systemSettingsPage.deleteGroup(userEmail);
      await systemSettingsPage.validateUserPresent(false);
    });
    await test.step('verify deleted user in global search', async () => {
      await navigationBarPage.performSearchContaining(
        userEmail,
        'No Results found.',
      );
    });
  });
});
