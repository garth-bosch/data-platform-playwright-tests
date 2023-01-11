import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Reporting settings page', () => {
  test('Admin can add/remove record type to project template @OGT-34163 @broken_test @Xoriant_Test @known_defect', async ({
    page,
    employeeAppUrl,
    publicPortalSettingPage,
    navigationBarPage,
  }) => {
    const projectTemplate = `Project ${faker.random.alphaNumeric(4)}`;
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Project Templates in Public Portal Settings', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await publicPortalSettingPage.proceedToPortalSection('Project Templates');
    });
    await test.step('Create a new Project Template', async () => {
      await publicPortalSettingPage.addTemplate(projectTemplate);
      await publicPortalSettingPage.proceedToTemplate(projectTemplate);
    });
    await test.step('Add Record Type to Project Template', async () => {
      await publicPortalSettingPage.addRecordTypeToTemplate(
        TestRecordTypes.Smoke_Test,
        'Test Department',
      );
    });
    await test.step('Remove Record Type from Project Template', async () => {
      await publicPortalSettingPage.removeRecordType();
    });
  });
  test.afterEach(async ({publicPortalSettingPage}) => {
    await test.step('Delete Project Template', async () => {
      await publicPortalSettingPage.deleteProject();
    });
  });
});
