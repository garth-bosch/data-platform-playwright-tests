import {faker} from '@faker-js/faker';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

export class PublicSignupPage extends BaseCitPage {
  readonly elements = {
    signUpButton: '.btn-primary',
    signupEmailInput: '[type="email"]',
    signupPasswordInput: '[type="password"]',
    confirmSignupButton: 'span.auth0-label-submit',
    signupTab: '//a[text()="Sign Up"]',
  };

  async fillAndSubmitEmailPasswordForSignup() {
    const randomString = faker.random.alphaNumeric(8);
    const randomGeneratedEmail = `${this.plcPrefix()}_${randomString}@opengov.com`;
    baseConfig.citTempData.createdUserEmail = randomGeneratedEmail;
    console.log(
      `Random email address for new STR user is: ${baseConfig.citTempData.createdUserEmail}`,
    );
    await this.page.click(this.elements.signUpButton);
    await this.page.click(this.elements.signupTab);
    await this.page.fill(this.elements.signupEmailInput, randomGeneratedEmail);
    await this.page.fill(
      this.elements.signupPasswordInput,
      baseConfig.citTestData.citAppPassword,
    );
    await this.page.click(this.elements.confirmSignupButton);
  }
}
