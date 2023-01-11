import {test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('admin can revert already published record type via settings', () => {
  let recordTypeName;

  test.beforeEach(async ({recordTypesApi}) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33703 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
    });
  });
  test('Verify there is a new RT in a RT setting to control record type settings @OGT-33703 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section, select record type and publish', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
      await recordTypesSettingsPage.publishRecordTypeFromDraft();
    });
    await test.step('Verify Published Record type current state is Revert To Draft', async () => {
      await recordTypesSettingsPage.verifyRevertToDraftRecordType();
    });
    await test.step('Go to Published Record type and Revert To Draft', async () => {
      await recordTypesSettingsPage.revertRecordTypeFromPublish();
    });
    await test.step('Verify Revert To Draft Record type current state is Publish', async () => {
      await recordTypesSettingsPage.verifyPublishRecordType();
    });
  });
});
