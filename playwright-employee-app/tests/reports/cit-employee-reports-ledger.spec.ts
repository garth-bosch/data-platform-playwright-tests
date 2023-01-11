import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {ReportTabs} from '../../src/pages/explore-reports-page';
import {expect} from '@playwright/test';
import moment from 'moment';
test.use({storageState: ADMIN_SESSION});
//* This is a duplicate of test @OGT-40553 @OGT-40552
test.describe('Employee App - Refund @refunds', () => {
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
  const transType = 'Transaction Type';
  const amountPaid = 'Amount Paid';
  const recordStepName = 'Payment';
  const fullAmount = '100.00';
  const refundAmount = '70.00';
  const dueAmount = '30.00';

  test('Make a payment and refund with Check, verify the information in Ledger report  @OGT-40571 @Xoriant_Test', async ({
    internalRecordPage,
    exploreReportsPage,
    page,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('Refund the fee', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Check);
    });
    await test.step('Go to Ledger', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain =
        await exploreReportsPage.getColumnValueForRecord(
          transType,
          exploreReportsPage.elements.reportsTable,
        );
      expect(givenRowShouldContain).toContain('Payment');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('Refund');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('$' + `${fullAmount}`);
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('-$' + `${fullAmount}`);
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
  test('Make a payment and refund with Credit Card, verify the information in Ledger report @OGT-40573 @Xoriant_Test', async ({
    internalRecordPage,
    exploreReportsPage,
    recordsApi,
    page,
  }) => {
    await test.step('Record setup:', async () => {
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
    await test.step('Go to ledger', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain;
      /* Payment________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('Payment');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('Payment');
      /* Refund________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        3,
      );
      expect(givenRowShouldContain).toContain('Refund');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        4,
      );
      expect(givenRowShouldContain).toContain('Refund');
      /* Payment Amount________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('$' + `${fullAmount}`);
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('-$3.98');

      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        3,
      );
      expect(givenRowShouldContain).toContain('-$' + `${refundAmount}`);
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        4,
      );
      expect(givenRowShouldContain).toContain('$2.79');
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
  test('Create a record with payment step, pay it using Credit Card and verify the information in Ledger report @OGT-40576 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    exploreReportsPage,
    recordsApi,
    page,
  }) => {
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
    await test.step('Make a payment via Credit', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Credit);
    });
    await test.step('Go to ledger', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain;
      /* Payment________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('Payment');
      /* Refund________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('Payment');
      /* Payment Amount________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('$' + `${fullAmount}`);

      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('-$3.98');
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
  test('Make a payment and refund with Cash, verify the information in Ledger report  @OGT-40572 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('Refund the fee', async () => {
      await internalRecordPage.proceedToRefund();
      await internalRecordPage.completeRefundStepWith(PaymentMethod.Cash);
    });
    await test.step('Go to ledger', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain;
      /* Payment________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('Payment');
      /* Payment Amount________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('$' + `${fullAmount}`);
      /* Refund Amount________________________________________________________________*/
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
  test('A partial refund can be made for a payment. @OGT-34398 @broken_test @Xoriant_Test @known_defect', async ({
    internalRecordPage,
    exploreReportsPage,
    recordsApi,
    page,
  }) => {
    let currentUrl;
    await test.step('Record setup:', async () => {
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
      currentUrl = page.url();
      await internalRecordPage.verifyPartialRefundAmounts(
        dueAmount,
        refundAmount,
      );
      await expect(
        page.locator(
          `//button[contains(@class, "btn-primary stripe-checkout")]`,
        ),
      ).toBeVisible();
    });
    await test.step('Go to ledger', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain;
      /* Payment________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('Payment');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('Payment');
      /* Refund________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        3,
      );
      expect(givenRowShouldContain).toContain('Refund');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        4,
      );
      expect(givenRowShouldContain).toContain('Refund');
      /* Payment Amount________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('$' + `${fullAmount}`);
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('-$3.98');

      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        3,
      );
      expect(givenRowShouldContain).toContain('-$' + `${refundAmount}`);
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        amountPaid,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        4,
      );
      expect(givenRowShouldContain).toContain('$2.79');
    });

    await test.step('Go to paymets', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d7`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify both paid and refund rows', async () => {
      let givenRowShouldContain;
      /* Payment________________________________________________________________*/
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain).toContain('Payment');
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        transType,
        exploreReportsPage.elements.reportsTable,
        baseConfig.citTempData.recordName,
        2,
      );
      expect(givenRowShouldContain).toContain('Refund');
    });
    await test.step('Navigate and check receipt', async () => {
      await page.goto(currentUrl);
      await page.click(internalRecordPage.elements.paymentOptionButton);
      await page.click(internalRecordPage.elements.printReceiptButton);
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await expect(
        await page.locator(
          `//tr[@class="total"] [td[contains(.,"Total Refunded")]]/td[contains(.,"$70.00")]`,
        ),
      ).toBeVisible();
      console.log(`[Flaky and does not get receipt oftentimes]`);
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
  test('Make a payment with Cash and Void, verify the payment is absent in Ledger report  @OGT-40579 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });

    await test.step('Void the Payment', async () => {
      await internalRecordPage.voidPayment();
    });
    await test.step('Go to ledger report', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify payment is absent in Ledger report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const rowCount = await page
        .locator(exploreReportsPage.elements.rowcount)
        .count();
      expect(rowCount).toBe(0);
    });
  });

  /*__________________________________________________________________________________________________________________________________ */
  test('Make a payment with Check and Void, verify the payment is absent in Ledger report @OGT-40578 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Void the Payment', async () => {
      await internalRecordPage.voidPayment();
    });
    await test.step('Go to ledger report', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify payment is absent in Ledger report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const rowCount = await page
        .locator(exploreReportsPage.elements.rowcount)
        .count();
      expect(rowCount).toBe(0);
    });
  });
  /*__________________________________________________________________________________________________________________________________ */
  test('Make a payment, void, pay again with the same method and verify the record in Ledger report @OGT-40580 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Void the Payment', async () => {
      await internalRecordPage.voidPayment();
    });
    await test.step('Make a payment again via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });
    await test.step('Go to ledger report', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify payment is present in Ledger report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      let givenRowShouldContain;
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Method',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Payment Method').toContain(
        PaymentMethod.Check,
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Date Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Date Paid').toBe(
        moment(new Date()).format('MMM D, YYYY'),
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Amount Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Amount Paid').toBe('$' + `${fullAmount}`);
    });
  });

  /*__________________________________________________________________________________________________________________________________ */
  test('Make a payment, void, pay again with the different method and verify the record in Ledger report @OGT-40584 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Void the Payment', async () => {
      await internalRecordPage.voidPayment();
    });
    await test.step('Make a payment again via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });
    await test.step('Go to ledger report', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify payment is present in Ledger report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      let givenRowShouldContain;
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Method',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Payment Method').toContain(
        PaymentMethod.Cash,
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Date Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Date Paid').toBe(
        moment(new Date()).format('MMM D, YYYY'),
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Amount Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Amount Paid').toBe('$' + `${fullAmount}`);
    });
  });
  /*__________________________________________________________________________________________________________________________________ */
  test('Make a payment, change the fee amount and verify the record in Ledger report @OGT-40592 @Xoriant_Test', async ({
    internalRecordPage,
    page,
    exploreReportsPage,
  }) => {
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });

    await test.step('Change the Fee', async () => {
      await internalRecordPage.updateFee('50.00');
      await expect(
        page.locator(
          internalRecordPage.elements.refundOwedAmount.selector('$50.00'),
        ),
        'Refund Amount Owed',
      ).toBeVisible();
    });
    await test.step('Go to ledger report', async () => {
      await page.goto(`${baseConfig.employeeAppUrl}/#/explore/reports/all/d8`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Verify payment is present in Ledger report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      let givenRowShouldContain;
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Method',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Payment Method').toContain(
        PaymentMethod.Check,
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Date Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Date Paid').toBe(
        moment(new Date()).format('MMM D, YYYY'),
      );
      givenRowShouldContain = await exploreReportsPage.getColumnValueForRecord(
        'Amount Paid',
        exploreReportsPage.elements.reportsTable,
      );
      expect(givenRowShouldContain, 'Amount Paid').toBe('$' + `${fullAmount}`);
    });
  });
  /*____________________________________________________________________________________________________________________________________*/
});
