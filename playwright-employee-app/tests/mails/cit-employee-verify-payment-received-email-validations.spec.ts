import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {
  searchMessages,
  getMessageWithContent,
} from '@opengov/cit-base/build/api-support/mandrillHelper';
test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Email Validations for Payment flows', () => {
  const paymentName = `Payment`;

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citNotificationUserEmail,
        null,
        [
          {
            fieldName: paymentName,
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName(paymentName);
    });
  });

  test('Citizens receive notifications for ad-hoc payment required  @Xoriant_Test @OGT-40643', async () => {
    await test.step('Confirm payment required email is sent to assigned user', async () => {
      await searchMessages(
        baseConfig.citTestData.citNotificationUserEmail,
        `Payment required for ${paymentName}`,
      );

      await getMessageWithContent(
        baseConfig.citTestData.citNotificationUserEmail,
        `Payment required for ${paymentName}`,
        baseConfig.citTempData.recordName,
      );
    });
  });

  test('Citizens receive notifications for ad-hoc payment received  @Xoriant_Test @OGT-40644', async ({
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    //sent a mail to applicant
    await test.step('Confirm that email is sent to step assigned user', async () => {
      const emailResponse = await getMessageWithContent(
        baseConfig.citTestData.citNotificationUserEmail,
        `Payment Received`,
        baseConfig.citTempData.recordName,
      );
      expect(emailResponse.text).toContain('Total Paid\n  $100.00');
      expect(emailResponse.text).toContain('TestFee   $100.00');
    });
  });

  test('Citizen receives notification for ad-hoc payment Void @Xoriant_Test @OGT-40646', async ({
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Void payment', async () => {
      await internalRecordPage.voidPayment();
    });

    await test.step('Confirm payment void email is sent to assigned user', async () => {
      const emailResponse = await getMessageWithContent(
        baseConfig.citTestData.citNotificationUserEmail,
        `Payment Received`,
        baseConfig.citTempData.recordName,
      );
      console.log(emailResponse);
      expect(emailResponse.text).toContain('Note: VOID');
      expect(emailResponse.text).toContain('Total Paid\n  $100.00');
    });
  });
});
