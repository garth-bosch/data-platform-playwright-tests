import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {FeeStatus} from '../../src/pages/record-pages/fees/refund-modal-page';

const recordStepName = 'Payment';
const feeName = 'TestFee';
const adhocFeeName = 'Additional Fee';
const paymentAmount = '100.00';

test.use({storageState: ADMIN_SESSION});
//TODO Enable after ESN-4414 fix.
test.describe('Employee App - Payment @payments @known_defect @ESN-4414', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
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
      await internalRecordPage.clickRecordStepName(recordStepName);
    });
  });

  test('Employee can delete already paid fee after refunding payment @OGT-45097 @broken_test @smoke', async ({
    refundModalPage,
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });
    await test.step('Attempt to remove a paid Fee', async () => {
      await internalRecordPage.clickDeleteStepFeeByName(feeName);
    });

    await test.step('User is prevented from deleting paid step fee', async () => {
      await refundModalPage.deleteIsPrevented();
      await refundModalPage.verifyPaymentAmounts(paymentAmount, paymentAmount);
    });

    await test.step('Refund the fee', async () => {
      await refundModalPage.refundFromModal();
    });

    await test.step('Step Fee can be deleted after refunding payment', async () => {
      await refundModalPage.deleteStepFeeByName(feeName, FeeStatus.Refunded);
    });
  });

  test('Employee can delete already paid fee after voiding payment @OGT-45098 @broken_test', async ({
    refundModalPage,
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });
    await test.step('Attempt to remove a paid Fee', async () => {
      await internalRecordPage.clickDeleteStepFeeByName(feeName);
    });
    await test.step('User is prevented from deleting paid step fee', async () => {
      await refundModalPage.deleteIsPrevented();
      await refundModalPage.verifyPaymentAmounts(paymentAmount, paymentAmount);
    });

    await test.step('Void the payment', async () => {
      await refundModalPage.voidFromModal();
    });

    await test.step('Step Fee can be deleted after voiding payment', async () => {
      await refundModalPage.deleteStepFeeByName(feeName, FeeStatus.Voided);
    });
  });

  test('Employee can delete partially paid fees after refunding payment @OGT-45099 @broken_test', async ({
    refundModalPage,
    internalRecordPage,
  }) => {
    const firstPaymentAmount = '75';
    const secondPaymentAmount = '25';

    await test.step('Add an Adhoc fee', async () => {
      await internalRecordPage.addFeeByName(adhocFeeName);
    });

    await test.step('Make a partial payment', async () => {
      await internalRecordPage.completePartialPaymentWith(
        PaymentMethod.Check,
        firstPaymentAmount,
      );
    });

    await test.step('User is prevented from deleting paid step fee', async () => {
      await internalRecordPage.clickDeleteStepFeeByName(feeName);
      await refundModalPage.deleteIsPrevented();
      await refundModalPage.verifyPaymentAmounts(
        firstPaymentAmount,
        firstPaymentAmount,
      );
      await refundModalPage.closeModal();
    });

    await test.step('Make rest of the payment in full', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('User is prevented from deleting paid step fee', async () => {
      await internalRecordPage.clickDeleteStepFeeByName(feeName);
      await refundModalPage.verifyPaymentAmounts(
        secondPaymentAmount,
        secondPaymentAmount,
      );
    });

    await test.step('Refund both payments', async () => {
      await refundModalPage.refundFromModal(0);
      await internalRecordPage.clickDeleteStepFeeByName(feeName);
      await refundModalPage.refundFromModal(1);
    });

    await test.step('Step Fee can be deleted after refunding partially made payments', async () => {
      await refundModalPage.deleteStepFeeByName(feeName, FeeStatus.Refunded);
    });
  });
});
