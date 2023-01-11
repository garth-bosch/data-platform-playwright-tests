import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {expect} from '@playwright/test';

const paymentAmount = '100.00';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Refund @refunds ', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName('Payment');
    });
  });

  test('Employee can make a payment with Check, but refund with Cash  @OGT-40553 @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Refund the fee', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Cash);
    });
  });

  test('Employee can make a payment with Cash, but refund with Check  @OGT-40552 @Xoriant_Test @smoke', async ({
    internalRecordPage,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('Refund the fee', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Check);
    });
  });

  test('Verify that refund method and listed method are the same  @OGT-34396 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    employeeAppUrl,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('Refund the fee', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Cash);
      await internalRecordPage.verifyTotalCashRefundRows();
    });

    await test.step('Goto payments reports and verify', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/d7`);
      await exploreReportsPage.waitReportTableLoaded();
      const totalAmountRow1 = await exploreReportsPage.getColumnValueForRecord(
        'Amount',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        1,
      );
      const payMethodRow1 = await exploreReportsPage.getColumnValueForRecord(
        'Payment Method',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        1,
      );
      const totalAmountRow2 = await exploreReportsPage.getColumnValueForRecord(
        'Amount',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      const payMethodRow2 = await exploreReportsPage.getColumnValueForRecord(
        'Payment Method',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(totalAmountRow1).toMatch('$100.00');
      expect(totalAmountRow2).toMatch('-$100.00');
      expect(payMethodRow1).toMatch('Cash');
      expect(payMethodRow2).toMatch('Cash');
    });

    await test.step('Goto Ledger reports and verify', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
      const totalAmountRow1 = await exploreReportsPage.getColumnValueForRecord(
        'Amount Paid',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        1,
      );
      const payMethodRow1 = await exploreReportsPage.getColumnValueForRecord(
        'Method',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        1,
      );
      const totalAmountRow2 = await exploreReportsPage.getColumnValueForRecord(
        'Amount Paid',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      const payMethodRow2 = await exploreReportsPage.getColumnValueForRecord(
        'Method',
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(totalAmountRow1).toMatch('$100.00');
      expect(totalAmountRow2).toMatch('-$100.00');
      expect(payMethodRow1).toMatch('Cash');
      expect(payMethodRow2).toMatch('Cash');
    });
  });

  test('Payments and refunds can be made using different methods @OGT-33751 @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Validate the total due amount shown', async () => {
      await internalRecordPage.verifyFullRefundAmounts(paymentAmount);
    });

    await test.step('Make a payment via Check mode', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Validate total due and no refund amount shown', async () => {
      await internalRecordPage.verifyFullRefundAmounts(paymentAmount, false);
      await internalRecordPage.verifyFullRefundAmountLineItems(
        paymentAmount,
        PaymentMethod.Cash,
        false,
      );
    });

    await test.step('Refund full fee via Cash mode', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Cash);
    });

    await test.step('Validate no total due and refund amount shown', async () => {
      await internalRecordPage.verifyFullRefundAmounts(paymentAmount);
      await internalRecordPage.verifyFullRefundAmountLineItems(
        paymentAmount,
        PaymentMethod.Cash,
      );
    });
  });
});
