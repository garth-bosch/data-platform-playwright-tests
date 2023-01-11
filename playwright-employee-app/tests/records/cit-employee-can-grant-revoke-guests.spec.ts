import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

const guestEmail: string = TestUsers.Guest_User.email;

test.describe('Employee App - Grant & Revoke Guest Info on Records @records', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Ghost_Test,
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Verify employee user add and revoke guest through employee app @OGT-34363 @Xoriant_Test', async ({
    internalRecordPage,
    guestsPage,
  }) => {
    await test.step('Add a guest and verify', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Applicant');
      await guestsPage.enterGuestEmail(guestEmail);
      await guestsPage.clickGrantAccessButton();
      await guestsPage.validateGuestEmailPresent(guestEmail, true);
    });

    await test.step('Revoke the guest and verify', async () => {
      await internalRecordPage.refreshThisPage();
      await guestsPage.clickRevokeAccessButton(guestEmail);
      await guestsPage.clickProveRevokeAccessButton();
      await guestsPage.validateGuestEmailPresent(guestEmail, false);
      await internalRecordPage.refreshThisPage();
      await guestsPage.page.waitForLoadState();
      await guestsPage.validateGuestEmailPresent(guestEmail, false);
    });
  });
});
