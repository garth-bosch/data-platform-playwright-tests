import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../../base/base-test';
import {InternalRecordPage} from '../../ea-record-page';

/**
 * Modal that shows up when deleting an already paid step fee.
 */
const refundPromptMessage =
  'You are trying to delete a step-fee that the applicant has already paid into. To proceed, all payments made towards this step fee must be refunded.';

export class RefundModalPage extends BaseCitPage {
  readonly internalRecordPage: InternalRecordPage = new InternalRecordPage(
    this.page,
  );
  readonly elements = {
    refundModalTile: '[id^=removeStepFeeModal].modal[aria-hidden=false] p',
    refundModalRefundButton:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-test-action="refund-payment"]',
    refundModalVoidButton:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-test-action="void-payment"]',
    refundModalDeleteStepFee:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-test-action="delete-step-fee"]',
    refundModalTotalPaymentAmount:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-test-table-cell="payment-amount"]',
    refundModalFeePaymentAmount:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-test-table-cell="step-fee-payment-amount"]',
    closeRefundModalButton:
      '[id^=removeStepFeeModal].modal[aria-hidden=false] [data-dismiss="modal"].close',
  };

  async deleteIsPrevented() {
    await expect(
      this.page.locator(this.elements.refundModalTile),
    ).toContainText(refundPromptMessage);
    await expect(
      this.page.locator(this.elements.refundModalRefundButton),
    ).toBeEnabled();
    await expect(
      this.page.locator(this.elements.refundModalVoidButton),
    ).toBeEnabled();
    await expect(
      this.page.locator(this.elements.refundModalDeleteStepFee),
    ).toBeDisabled();
  }

  async deleteStepFeeByName(
    feeName: string,
    expectedFeeStatus: FeeStatus,
    paymentIndex = 0,
  ) {
    await this.internalRecordPage.clickDeleteStepFeeByName(feeName);
    await expect(
      this.page.locator(this.elements.refundModalTile),
    ).toContainText(refundPromptMessage);
    const element = `${
      expectedFeeStatus === FeeStatus.Refunded
        ? this.elements.refundModalRefundButton
        : this.elements.refundModalVoidButton
    } >> nth=${paymentIndex}`;

    await expect(this.page.locator(element)).toContainText(expectedFeeStatus);
    await expect(this.page.locator(element)).toBeEnabled();
    const deleteFeeButton = this.page.locator(
      this.elements.refundModalDeleteStepFee,
    );
    await expect(deleteFeeButton).toBeEnabled();
    await deleteFeeButton.click();
    await this.internalRecordPage.feeIsDeleted(feeName);
  }

  async verifyPaymentAmounts(totalPaid: string, stepFeePaid: string) {
    await this.elementTextVisible(
      this.elements.refundModalTotalPaymentAmount,
      totalPaid,
    );
    await this.elementTextVisible(
      this.elements.refundModalFeePaymentAmount,
      stepFeePaid,
    );
  }

  async refundFromModal(paymentIndex = 0) {
    const element = `${this.elements.refundModalRefundButton} >> nth=${paymentIndex}`;
    await this.page.click(element);
    await this.internalRecordPage.doRefund();
  }

  async voidFromModal(paymentIndex = 0) {
    const element = `${this.elements.refundModalVoidButton} >> nth=${paymentIndex}`;
    await this.page.click(element);
    await this.internalRecordPage.doVoid();
  }

  async closeModal() {
    await this.page.click(this.elements.closeRefundModalButton);
  }
}

export enum FeeStatus {
  Refunded = 'Refunded',
  Voided = 'Voided',
}
