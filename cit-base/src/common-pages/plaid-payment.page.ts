import {FrameLocator, expect} from '@playwright/test';
import {BaseCitPage} from '../base/base-page';

export class PlaidPage extends BaseCitPage {
  private plaidFrame: FrameLocator;
  readonly elements = {
    frame: 'plaid-link-iframe-1',
    continueBankPaymentButton: 'span >> text=Continue',
    searchBankField: 'input[placeholder="Search Institutions"]',
    bankSelector: {
      selector: (bankName: string) =>
        `.SearchAndSelectPane-module__title >> text=${bankName}`,
    },
    bankUserName: '#aut-input-0',
    bankUserPassword: '#aut-input-1',
    submitBankPaymentButton: 'span >> text=Submit',
    primaryBankAccountCheckbox: {
      selector: (accountName: string) =>
        `//div[text()='${accountName}']/ancestor::*/input[@type='radio']`,
    },
    bankRoutingNumber: '#device-input',
    bankAccountNumber: '#account-number-input',
    bankAccountConfirmInput: '#account-number-confirmation',
    bankPaymentStatusText: '#a11y-title',
  };

  async clickContinueButton() {
    await this.plaidFrame
      .locator(this.elements.continueBankPaymentButton)
      .click();
  }

  async clickSubmitButton() {
    await this.plaidFrame
      .locator(this.elements.submitBankPaymentButton)
      .click();
  }

  async selectAppropriateBank(bankName: string) {
    await this.plaidFrame.locator(this.elements.searchBankField).fill(bankName);
    await this.plaidFrame
      .locator(this.elements.bankSelector.selector(bankName))
      .click();
  }

  async enterCredentials(userName: string, userPass: string) {
    await this.plaidFrame.locator(this.elements.bankUserName).fill(userName);
    await this.plaidFrame
      .locator(this.elements.bankUserPassword)
      .fill(userPass);
  }

  async choosePrimaryAccount(accountName: string) {
    // eslint-disable-next-line playwright/no-force-option
    await this.plaidFrame
      .locator(this.elements.primaryBankAccountCheckbox.selector(accountName))
      .click({
        force: true,
      });
  }

  async enterRoutingNumber(routingNumber: string) {
    await this.plaidFrame
      .locator(this.elements.bankRoutingNumber)
      .fill(routingNumber);
  }

  async enterAccountNumber(accountNumber: string, confirmation = false) {
    await this.plaidFrame
      .locator(
        confirmation
          ? this.elements.bankAccountConfirmInput
          : this.elements.bankAccountNumber,
      )
      .fill(accountNumber);
  }

  async verifyPaymentStatus(status: string) {
    await expect(
      this.plaidFrame.locator(this.elements.bankPaymentStatusText),
    ).toContainText(status);
  }

  async fillBankInfo(bankData: IBankPaymentData) {
    this.plaidFrame = this.page.frameLocator(`#${this.elements.frame}`);
    await this.clickContinueButton();
    await this.selectAppropriateBank(bankData.Institution);
    await this.enterCredentials(bankData.UserName, bankData.Password);
    await this.clickSubmitButton();
    await this.choosePrimaryAccount(bankData.PrimaryAccount);
    await this.clickContinueButton();
    await this.enterRoutingNumber(bankData.RoutingNumber);
    await this.clickContinueButton();
    await this.enterAccountNumber(bankData.AccountNumber);
    await this.clickContinueButton();
    await this.enterAccountNumber(bankData.AccountNumber, true); // Confirm Account Number
    await this.clickContinueButton();
    await this.verifyPaymentStatus('Success');
    await this.clickContinueButton();
  }
}

interface IBankPaymentData {
  Institution: string;
  UserName: string;
  Password: string;
  PrimaryAccount: string;
  RoutingNumber: string;
  AccountNumber: string;
}
