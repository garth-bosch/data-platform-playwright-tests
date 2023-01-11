import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '../base/base-test';
import {PublicRecordPage} from './public-record-page';

export class MyAccountPage extends BaseCitPage {
  readonly elements = {
    myAccountButton: '#my-account-desktop',
    dashboardButton: '#profile-dashboard-button',
    paymentsButton: '#profile-payments-button',
    paymentsTable: '.table-fit',
    firstPaymentRow: 'tbody > tr:nth-child(1)',
    recordStepNames: '.step-tracker .media-body span',
    paymentContinueButton: 'button[id="submitButton"]',
    creditCardPaymentRadioButton: 'input[name="payRadios"][value="1"]',
    payButton: 'button.stripe-checkout',
    emailCardInput: 'input[type="email"]',
    nameCardInput: 'input[placeholder="Name"]',
    streetCardInput: 'input[placeholder="Address"]',
    cityCardInput: 'input[placeholder="City"]',
    postCodeCardInput: 'input[placeholder="ZIP"]',
    cardNumber: 'input[placeholder="Card number"]',
    cardExpiry: 'input[placeholder="MM / YY"]',
    cardCVC: 'input[placeholder="CVC"]',
    payUSDbutton: '.Section-content button[type="submit"]',
    cardPaymentFrame: 'iframe[name="stripe_checkout_app"]',
    commentArea: '#step_comment_box',
    applicationsButton: '#profile-records-button',
    applicationsTableBody: '.table-hover.table-wrap.table-fit > tbody',
    recordName: {selector: (name) => `//tr[.//*[text()="${name}"]]`},
    recordNameSubmissionPage: 'h4.media-heading',
    inspectionsButton: '#profile-inspections-button',
    applicantInfo: '#contactInfo',
  };

  async proceedToMyAccount() {
    await this.page.click(this.elements.myAccountButton);
    await this.waitForVisibility(this.elements.dashboardButton);
  }

  async proceedToPayments() {
    await this.page.click(this.elements.paymentsButton);
    await this.waitForVisibility(this.elements.paymentsTable);
  }

  async proceedToApplications() {
    await this.page.click(this.elements.applicationsButton);
  }

  async proceedToInspections() {
    await this.page.click(this.elements.inspectionsButton);
  }

  async completeFirstPaymentFromTable(paymentStep: string) {
    await this.page.click(this.elements.firstPaymentRow);
    await this.clickElementWithText(this.elements.recordStepNames, paymentStep);
    await this.page.click(this.elements.creditCardPaymentRadioButton);
    await this.page.click(this.elements.payButton);
  }

  async proceedToRecordByName(): Promise<PublicRecordPage> {
    const recordNameSelector = this.elements.recordName.selector(
      baseConfig.citTempData.recordName,
    );
    await this.page.click(recordNameSelector);
    await this.waitForVisibility(this.elements.applicationsTableBody, false);
    return new PublicRecordPage(this.page);
  }

  async gotoRecordSubmissionPageById() {
    const recordId = baseConfig.citTempData.recordId;
    const recordName = baseConfig.citTempData.recordName;
    await this.page.goto(
      `${baseConfig.storefrontUrl}/track/${recordId}/submission`,
      {waitUntil: 'load'},
    );
    await expect(
      this.page.locator(this.elements.recordNameSubmissionPage),
    ).toContainText(recordName);
  }

  async gotoPublicRecordPageById() {
    const recordId = baseConfig.citTempData.recordId;
    const recordName = baseConfig.citTempData.recordName;
    await this.page.goto(`${baseConfig.storefrontUrl}/records/${recordId}`, {
      waitUntil: 'load',
    });
    await expect(this.page.locator(`text="${recordName}"`)).toBeVisible();
  }

  async gotoDraftRecordPageById() {
    const recordId = baseConfig.citTempData.recordId;
    await this.page.goto(`${baseConfig.storefrontUrl}/submit/${recordId}`, {
      waitUntil: 'load',
    });
    await expect(this.page.locator(this.elements.applicantInfo)).toBeVisible();
  }
}

export enum PaymentData {
  Email = 'cat@gmail.com',
  Name = 'Cat',
  Street = 'Cat',
  City = 'Cat',
  Postcode = '123',
  Number = '4242424242424242',
  Expiry_MM = '01',
  Expiry_YY = '33',
  CVC = '132',
}
