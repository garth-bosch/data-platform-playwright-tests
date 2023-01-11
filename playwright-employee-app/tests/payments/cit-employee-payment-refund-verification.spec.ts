import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

const recordStepName = 'Payment';
const paymentAmount = '100.00';
const refundAmount = '70.00';
const dueAmount = '30.00';
const partialRefundProcessingFees = '$2.79';
const fullRefundProcessingFees = '-$3.98';
const fullProcessingFees = '$3.98';

test.use({storageState: ADMIN_SESSION});
test.describe('Verify correct processing fee refunded  for Partial/Full refund : [Customer pays transaction fees + Ledger verification only]', () => {
  test(`Employees credit card refunds have correct processing fee refunded @OGT-44470 @broken_test @Xoriant_Test @known_defect  `, async ({
    internalRecordPage,
    exploreReportsPage,
    recordsApi,
  }) => {
    /* Adding instead of before test here because max we will do 2 combinations and split the jira ticket into 3*/
    await test.step('Record setup 1', async () => {
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
    await test.step('Make a payment via Credit', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Credit);
    });

    await test.step('Partial refund and verify refunds page', async () => {
      await internalRecordPage.proceedToPartialRefund();
      await internalRecordPage.doPartialRefund(refundAmount);
      await internalRecordPage.verifyPartialRefundAmounts(
        dueAmount,
        refundAmount,
      );
    });
    await test.step('Go to ledger and verify the refund amounts', async () => {
      await exploreReportsPage.filterRecordFromLedger();
      await exploreReportsPage.verifyCellWithProcessingFees(
        fullRefundProcessingFees,
      );
      await exploreReportsPage.verifyCellWithProcessingFees(
        partialRefundProcessingFees,
      );
    });
    await test.step('Record setup 2 - Full refund', async () => {
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
      await internalRecordPage.refreshThisPage();
    });

    await test.step('Make a payment via Credit', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Credit);
    });

    await test.step('Full refund and verify refunds page', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.doRefund();
      await internalRecordPage.verifyFullRefundAmounts(paymentAmount);
    });

    await test.step('Go to ledger and verify the refund amounts', async () => {
      await exploreReportsPage.filterRecordFromLedger();
      await exploreReportsPage.verifyCellWithProcessingFees(
        fullRefundProcessingFees,
      );
      await exploreReportsPage.verifyCellWithProcessingFees(fullProcessingFees);
    });
  });
});
