import {test} from '../../../src/base/base-test';
import {EMPLOYEE_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Notifications', () => {
  test(
    'Each checkbox on Notification settings page is present and functional @notifications @OGT-44010 ' +
      '@Xoriant_Test',
    async ({
      page,
      employeeAppUrl,
      navigationBarPage,
      notificationSettingsPage,
    }) => {
      await test.step('Login to EA', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to notification settings page', async () => {
        await navigationBarPage.clickNotificationButton();
        await navigationBarPage.clickNotificationSettingsButton();
        await notificationSettingsPage.verifyPageTitlePresent();
      });
      await test.step('Set all notifications to True state and verify', async () => {
        const notificationSettings = {
          assignments: [true, true],
          comments: [true, true],
          attachments: [true, true],
          inspections: [true, true],
          deadlines: [true, true],
          documents: true,
          payments: true,
        };
        await notificationSettingsPage.setNotificationCheckboxValues(
          notificationSettings,
        );
      });
      await test.step('Set all notifications to False state and verify', async () => {
        const notificationSettings = {
          assignments: [false, false],
          comments: [false, false],
          attachments: [false, false],
          inspections: [false, false],
          deadlines: [false, false],
          documents: false,
          payments: false,
        };
        await notificationSettingsPage.setNotificationCheckboxValues(
          notificationSettings,
        );
      });
    },
  );

  test(
    'Any changes made to Notification settings page successfully save @notifications @OGT-44011 ' +
      '@Xoriant_Test @smoke',
    async ({
      page,
      employeeAppUrl,
      navigationBarPage,
      notificationSettingsPage,
    }) => {
      await test.step('Login to EA', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to notification settings page', async () => {
        await navigationBarPage.clickNotificationButton();
        await navigationBarPage.clickNotificationSettingsButton();
        await notificationSettingsPage.verifyPageTitlePresent();
      });
      await test.step('Set all notifications to disabled or enabled state', async () => {
        const notificationSettings = {
          assignments: [false, false],
          comments: [true, true],
          attachments: [true, true],
          inspections: [true, false],
          deadlines: [true, false],
          documents: true,
          payments: true,
        };
        await notificationSettingsPage.setNotificationCheckboxValues(
          notificationSettings,
        );
      });
    },
  );

  test.afterEach(
    async ({
      page,
      navigationBarPage,
      notificationSettingsPage,
      employeeAppUrl,
    }) => {
      await test.step('location setup', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickNotificationButton();
        await navigationBarPage.clickNotificationSettingsButton();
        const notificationSettings = {
          assignments: [true, true],
          comments: [true, true],
          attachments: [true, true],
          inspections: [true, true],
          deadlines: [true, true],
          documents: true,
          payments: true,
        };
        await notificationSettingsPage.setNotificationCheckboxValues(
          notificationSettings,
        );
      });
    },
  );
});
