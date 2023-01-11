import {Locator, Page} from '@playwright/test';

export class StripePage {
  readonly page: Page;
  private stripeFrame: string;
  readonly elements = {
    frame: 'stripe_checkout_app',
    frameByName: {
      selector: (frameName: string) => `iframe[name="${frameName}"]`,
    },
    emailCardInput: 'input[type="email"]',
    nameCardInput: 'input[placeholder="Name"]',
    streetCardInput: 'input[placeholder="Address"]',
    cityCardInput: 'input[placeholder="City"]',
    postCodeCardInput: 'input[placeholder="ZIP"]',
    cardNumber: 'input[placeholder="Card number"]',
    cardExpiry: 'input[placeholder="MM / YY"]',
    cardCVC: 'input[placeholder="CVC"]',
    payUSDbutton: 'button[type="submit"]',
    paymentContinueButton: 'button[id="submitButton"]',
  };

  constructor(page: Page) {
    this.page = page;
  }

  async enterUserEmail(email: string) {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.emailCardInput)
      .fill(email);
  }

  async enterUserName(name: string) {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.nameCardInput)
      .fill(name);
  }

  async enterUserAddress(address: string) {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.streetCardInput)
      .fill(address);
  }

  async enterUserZipCode(zipCode: string) {
    const zipInput: Locator = this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.postCodeCardInput);
    await zipInput.click();
    await zipInput.fill(zipCode);
  }

  async enterUserCity(city: string) {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.cityCardInput)
      .fill(city);
  }

  async clickContinueButton() {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.paymentContinueButton)
      .click();
  }

  async enterCardNumber(cardNumber: string) {
    const cardInput: Locator = this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.cardNumber);
    await cardInput.click();
    // Stripe modal resets' cursor after every 4 digit of CC number input
    // this is why we enter card number 4 times split into batches.
    for (const numBatch of cardNumber.split(' ')) {
      await cardInput.type(numBatch);
    }
  }

  async enterCardExpiry(cardExpiryMonth: string, cardExpiryYear: string) {
    const cardExpiryInput: Locator = this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.cardExpiry);
    await cardExpiryInput.type(cardExpiryMonth);
    await cardExpiryInput.type(cardExpiryYear);
  }

  async enterCardCvc(cvcCode: string) {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.cardCVC)
      .fill(cvcCode);
  }

  async clickPayButton() {
    await this.page
      .frameLocator(this.stripeFrame)
      .locator(this.elements.payUSDbutton)
      .click();
  }

  async fillUserCardInfo(paymentInfo: IPaymentData) {
    this.stripeFrame = this.elements.frameByName.selector(this.elements.frame);
    await this.page.waitForSelector(this.stripeFrame);
    await this.enterUserEmail(paymentInfo.Email);
    await this.enterUserName(paymentInfo.Name);
    await this.enterUserAddress(paymentInfo.Street);
    await this.enterUserZipCode(paymentInfo.Postcode);
    await this.enterUserCity(paymentInfo.City);
    await this.clickContinueButton();
    await this.enterCardNumber(paymentInfo.Number);
    await this.enterCardExpiry(paymentInfo.Expiry_MM, paymentInfo.Expiry_YY);
    await this.enterCardCvc(paymentInfo.CVC);
    await this.clickPayButton();
  }
}

interface IPaymentData {
  Email: string;
  Name: string;
  Street: string;
  City: string;
  Postcode: string;
  Number: string;
  Expiry_MM: string;
  Expiry_YY: string;
  CVC: string;
}
