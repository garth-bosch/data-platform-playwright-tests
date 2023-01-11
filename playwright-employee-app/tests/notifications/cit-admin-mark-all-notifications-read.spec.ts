import {expect, test} from '../../src/base/base-test';
import {TestRecordTypes} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.describe.configure({mode: 'serial'});
const recordStepName = 'Payment';
const docTempLabel = 'LetterDoc';
let currentNotifications;
test.describe('Employee App - Notifications', () => {
  test.beforeEach(
    async ({
      recordsApi,
      internalRecordPage,
      navigationBarPage,
      page,
      recordPage,
      authPage,
    }) => {
      await test.step('Record setup1: clear existing notifications', async () => {
        await page.goto(`${baseConfig.employeeAppUrl}`);
        await authPage.page.waitForNavigation();
        await authPage.loginAs(
          baseConfig.citTestData.citNotificationUserEmail,
          baseConfig.citTestData.citAppPassword,
        );
        await authPage.page.waitForNavigation();
        await navigationBarPage.clickAndMarkAllBellNotificationAsRead();
        await authPage.logout();
      });
      await test.step('Record setup 2: login as admin and add record', async () => {
        await authPage.loginAs(
          baseConfig.citTestData.citAdminEmail,
          baseConfig.citTestData.citAppPassword,
        );
        await authPage.page.waitForNavigation();
        await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
          baseConfig.citTestData.citNotificationUserEmail,
          null,
          [
            {
              fieldName: recordStepName,
              fieldValue: 'true',
            },
          ],
        );
      });
      await test.step('Record setup 3: proceed to add document step', async () => {
        await page.goto(`${baseConfig.employeeAppUrl}`);
        await authPage.page.waitForNavigation();
        await internalRecordPage.proceedToRecordByUrl();
        await internalRecordPage.clickRecordStepName(recordStepName);
        await recordPage.addDocumentStep();
        await recordPage.addDocumentTemplate(docTempLabel);
      });
    },
  );

  test('User can mark all notifications as read @OGT-44012 @Xoriant_Test', async ({
    recordsApi,
    authPage,
    recordPage,
    internalRecordPage,
    navigationBarPage,
  }) => {
    await test.step(' Add one more record and navigate there', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: recordStepName,
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Create one more Notification by adding document step', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(docTempLabel);
      await authPage.logout();
      await authPage.page.waitForNavigation();
    });
    await test.step('As notification user Login', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Verify notification Greyed out', async () => {
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.verifyNotificationListItemUnread(1, 1);
      await navigationBarPage.verifyNotificationListItemUnread(1, 2);
    });
    await test.step('Mark all read and Verify color is neutral', async () => {
      await navigationBarPage.markAllBellNotificationAsRead();
      await navigationBarPage.verifyNotificationListItemRead(1, 0);
    });
  });

  test('User can mark an individual notification as read @OGT-44013 @broken_test @Xoriant_Test', async ({
    navigationBarPage,
    authPage,
    page,
  }) => {
    await test.step('As notification user Login', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Mark one notification unread and verify counts', async () => {
      await navigationBarPage.clickNotificationButton();
      currentNotifications =
        await navigationBarPage.getTotalUnreadNotifications();
      expect(currentNotifications).toEqual(2);
      await page.reload(); /* Giving some time for notifications to show up during repeat testing this was flaky*/
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.markGivenUnreadNotification();
      currentNotifications =
        await navigationBarPage.getTotalUnreadNotifications();
      expect(currentNotifications).toEqual(1);
    });
  });

  test('User can delete an individual notification @OGT-44014 @Xoriant_Test', async ({
    navigationBarPage,
    authPage,
  }) => {
    await test.step('As notification user Login', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Remove first notification and verify counts', async () => {
      currentNotifications =
        await navigationBarPage.getTotalUnreadNotifications();
      expect(currentNotifications).toEqual(2);
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.removeNthNotificationItemAndVerify();
      currentNotifications =
        await navigationBarPage.getTotalUnreadNotifications();
      expect(currentNotifications).toEqual(0);
    });
  });

  test(
    'Notification count next to Bell icon shows accurate number @OGT-44015 @Xoriant_Test @known_defect' +
      ' @decommisioned',
    async ({navigationBarPage, authPage, recordStepsApi}) => {
      console.log('Decommissioned .. too much time delay');
      /* sometimes takes a lot of time delay for multiple notifications */
      await test.step('As Admin Make max and ensure that Notifications maxed out', async () => {
        /*_______________________________________________*/
        for (let i = 0; i < 17; i++) {
          await recordStepsApi.addApprovalStep(`Approval Label - ${i}`);
        }
        /*_______________________________________________*/
        await authPage.logout();
      });
      await test.step('Login  As notification user', async () => {
        await authPage.loginAs(
          baseConfig.citTestData.citNotificationUserEmail,
          baseConfig.citTestData.citAppPassword,
        );
      });
      await test.step('Verify maxed out notifications', async () => {
        await navigationBarPage.clickNotificationButton();
        await navigationBarPage.verifyNotificationbadgeContainsMax();
      });
    },
  );

  test('User can see notification @OGT-33567 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    authPage,
    navigationBarPage,
  }) => {
    await test.step('As notification user Login', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
    });
    await test.step('Click and verify notifications', async () => {
      await navigationBarPage.clickNotificationButton();
      await navigationBarPage.verifyNotificationListItemUnread(1, 1);
    });
    await test.step('Mark all read', async () => {
      await navigationBarPage.markAllBellNotificationAsRead();
    });
  });
});
