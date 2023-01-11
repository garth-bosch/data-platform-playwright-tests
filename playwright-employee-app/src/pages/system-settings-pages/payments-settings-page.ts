import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../base/base-test';

export class PaymentsSettingsPage extends BaseCitPage {
  readonly elements = {
    connectedToStripe: `//p[contains(.,"You are connected with Stripe.") and contains(@class, "alert-success")]`,
    connectNewAccountStripe: `//a[contains(@class,"stripe-connect") and span[contains(., "Connect New Account")] ]`,
    editSettingsStripe: `//a[@href="https://dashboard.stripe.com/account" and span[contains(.,"Edit Settings")]]`,
    currencyDropDown: `//select[@class="form-control"]`,
    clearStripeSettings: `//a[contains(normalize-space(), "Clear Stripe Settings")]`,
    paymentModeLabel: `//h4[contains(normalize-space(), "Payment Mode")]`,
    paymentModeLabelSiblingCurrency: `//h4[contains(.,"Currency")]/following-sibling::h4[1][contains(.,"Payment Mode")]`,
    paymentsSettingsButton: '#settings-payments-btn',
  };
  async proceedToPaymentsSettingsPage() {
    await this.page.click(this.elements.paymentsSettingsButton);
  }

  async verifyCurrencyDropdown(whichCurrency: CurrencyType) {
    if (whichCurrency === 'US Dollars') {
      expect(
        await this.page.locator(this.elements.currencyDropDown).inputValue(),
      ).toEqual('1');
    } else {
      expect(
        await this.page.locator(this.elements.currencyDropDown).inputValue(),
      ).toEqual('2');
    }
  }

  async selectCurrencyDropdown(whichCurrency: CurrencyType) {
    if (whichCurrency === 'US Dollars') {
      await this.page.selectOption(this.elements.currencyDropDown, '1');
      await this.verifyCurrencyDropdown(
        whichCurrency,
      ); /*Give enough time for option to be selected -- Flaky test*/
    } else {
      await this.page.selectOption(this.elements.currencyDropDown, '2');
      await this.verifyCurrencyDropdown(
        whichCurrency,
      ); /*Give enough time for option to be selected-- Flaky test*/
    }
  }
}

type CurrencyType = 'US Dollars' | 'Australian Dollars';
