import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {faker} from '@faker-js/faker';

let guestEmail;
test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App -  Revoke Guest access on Records', () => {
  let recordTypeName;
  test.beforeEach(async ({recordsApi, internalRecordPage, recordTypesApi}) => {
    guestEmail = baseConfig.citTestData.citNotificationUserEmail;
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-34335_${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Create Record', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
      await recordsApi.addGuestToRecord(guestEmail);
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Verify revoke email notification for guest @OGT-34335 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    guestsPage,
  }) => {
    await test.step('Revoke the guest and verify', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Applicant');
      await guestsPage.clickRevokeAccessButton(guestEmail);
      await guestsPage.clickProveRevokeAccessButton();
      await guestsPage.validateGuestEmailPresent(guestEmail, false);
    });

    await test.step('Confirm that email is sent to removed Guest', async () => {
      const emailResponse = await getMessageWithContent(
        guestEmail,
        `You have been removed as a guest on ${recordTypeName} ${baseConfig.citTempData.recordName}.`,
        `${recordTypeName} #${baseConfig.citTempData.recordName}`,
      );
      expect(emailResponse.text).toContain(
        `${TestUsers.Api_Admin.name} has removed you as a guest from\n${recordTypeName} #${baseConfig.citTempData.recordName}`,
      );
    });
  });
});
