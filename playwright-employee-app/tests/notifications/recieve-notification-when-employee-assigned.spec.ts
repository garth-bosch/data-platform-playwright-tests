import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Notifications', () => {
  test.beforeEach(async ({recordsApi}) => {
    await test.step('Create a record with an Inspection step', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
    });
  });

  test(
    "Employees receive browser notification when inspection they're assigned to was modified" +
      ' @OGT-44247 @Xoriant_test',
    async ({authPage, internalRecordPage, navigationBarPage}) => {
      await test.step('Open the step and assign it to an employee', async () => {
        await internalRecordPage.proceedToRecordByUrl();
        await internalRecordPage.clickRecordStepName('Inspection');
        await internalRecordPage.assignStepToUserByEmail(
          baseConfig.citTestData.citNotificationUserEmail,
        );
      });

      await test.step('Log out', async () => {
        await authPage.logout();
        await authPage.page.waitForNavigation();
      });

      await test.step('Log in as the assigned user', async () => {
        await authPage.loginAs(
          baseConfig.citTestData.citNotificationUserEmail,
          baseConfig.citTestData.citAppPassword,
        );
        await authPage.page.waitForNavigation();
      });

      await test.step('Verify the notification is present', async () => {
        await navigationBarPage.validateBellNotificationPresent(
          `Inspection for ${TestRecordTypes.Record_Steps_Test.name} ${baseConfig.citTempData.recordName} requires your attention`,
        );
      });
    },
  );
});
