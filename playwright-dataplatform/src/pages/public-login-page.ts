import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';
import {MyAccountPage} from './my-account-page';

export class PublicLoginPage extends BaseCitPage {
  readonly elements = {
    loginLink: '#login-desktop',
    securePortalLoginButton:
      'div[class="ember-view"] > button[class="btn btn-primary"]',
    secureSignupButton:
      'div[class="ember-view"] > button[class="btn btn-default"]',
    submitButton: 'button.auth0-lock-submit',
  };

  async goto() {
    await this.page.goto(`${baseConfig.storefrontUrl}/login`);
  }

  async clickLoginLink() {
    await this.page.click(this.elements.loginLink);
  }

  async selectSecureLoginPortalButton(): Promise<AuthPage> {
    await this.page.click(this.elements.securePortalLoginButton);
    await this.waitForVisibility(this.elements.submitButton);
    return new AuthPage(this.page);
  }

  async selectSecureSignupButton() {
    await this.page.click(this.elements.secureSignupButton);
    await this.waitForVisibility(this.elements.submitButton);
  }

  async loginToStorefront(
    email: string = baseConfig.citTestData.citCitizenEmail,
  ): Promise<MyAccountPage> {
    await this.goto();
    const authPage = await this.selectSecureLoginPortalButton();
    await authPage.loginAs(email, baseConfig.citTestData.citAppPassword);
    return new MyAccountPage(this.page);
  }

  async loginAndGotoRecordStep(loginAs: string, recordStepName: string) {
    const myAccountPage = await this.loginToStorefront(loginAs);
    await myAccountPage.proceedToMyAccount();
    await myAccountPage.proceedToApplications();
    const storeFrontRecordPage = await myAccountPage.proceedToRecordByName();
    await storeFrontRecordPage.navigateToRecordTab(recordStepName);
  }
}
