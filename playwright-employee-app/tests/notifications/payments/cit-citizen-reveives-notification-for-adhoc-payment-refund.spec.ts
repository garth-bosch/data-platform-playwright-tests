import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod, RecordStep} from '../../../src/pages/ea-record-page';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.setTimeout(180 * 1000);
test.describe('Email notifications @refunds', () => {
  test('Citizens receive notifications for ad-hoc payment refunded @known_defect @broken_test @OGT-40645 @broken_test @Xoriant_Test', async ({
    recordsApi,
    recordPage,
  }) => {
    await test.step('Create a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citEmployeeEmail,
        null,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
        ],
      );
      await recordPage.proceedToRecordByUrl();
    });

    await test.step('Add an ad-hoc payment step', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Payment],
        'Adhoc payment',
      );
      await recordPage.addFeeByName('TestFee');
      await recordPage.clickRecordStepName('Adhoc payment');
    });

    await test.step('Make a payment and refund it', async () => {
      await recordPage.completePaymentStepWith(PaymentMethod.Check);
      await recordPage.proceedToRefund();
      await recordPage.completeRefundStepWith(PaymentMethod.Check);
    });
    await test.step('Verify the applicant received an email notification', async () => {
      const emailBody = await getMessageWithContent(
        baseConfig.citTestData.citEmployeeEmail,
        'Refund Issued',
        `${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
      );
      expect(emailBody.includes('$100.00 Refunded')).toBeTruthy();
      expect(emailBody.includes('via Check')).toBeTruthy();
    });
  });
});
