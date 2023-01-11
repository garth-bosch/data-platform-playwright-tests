import {expect, Locator} from '@playwright/test';
import {BaseCitPage} from '../base/base-page';
import {baseConfig} from '../base/base-config';

export class AuthPage extends BaseCitPage {
  readonly elements = {
    email: '[name="email"]',
    password: '[name="password"]',
    loginButton: '[class="auth0-label-submit"]',
    loginFailureToast:
      '[class="auth0-global-message auth0-global-message-error"]',
    userLogo: '#user-dropdown-item',
    logoutButton: '.dropdown-menu li .pointer',
    landingPage: '#create-record',
    systemSettingsButton: '#sidebar-settings-btn',
  };

  async goto() {
    await this.page.goto(baseConfig.employeeAppUrl);
  }

  async fillEmailField(emailAddress: string) {
    const elem: Locator = this.page.locator(this.elements.email);
    await elem.click();
    await elem.fill(emailAddress);
  }

  async clickLogin() {
    await this.page.locator(this.elements.loginButton).click();
  }

  async fillPasswordField(password: string) {
    const elem: Locator = this.page.locator(this.elements.password);
    await elem.click();
    await elem.fill(password);
  }

  async loginAsAdmin() {
    await this.loginAs(
      baseConfig.citTestData.citAdminEmail,
      baseConfig.citTestData.citAppPassword,
    );
  }

  async loginAsCitizen() {
    await this.loginAs(
      baseConfig.citTestData.citCitizenEmail,
      baseConfig.citTestData.citAppPassword,
    );
  }

  async loginAs(
    emailAddress: string,
    password: string = baseConfig.citTestData.citAppPassword,
  ) {
    await this.fillEmailField(emailAddress);
    await this.fillPasswordField(password);
    // click the login button
    await this.clickLogin();
  }

  async validateLoginFailureToastIsVisible() {
    await expect(
      this.page.locator(this.elements.loginFailureToast),
    ).toBeVisible();
  }

  async validateEmailAndPasswordFieldsAreEmpty() {
    await expect(this.page.locator(this.elements.email)).toBeEmpty();
    await expect(this.page.locator(this.elements.password)).toBeEmpty();
  }

  async logout() {
    await this.page.click(this.elements.userLogo);
    await this.page.click(this.elements.logoutButton);
  }

  async loginSuccessful(isAdmin = false) {
    await expect(this.page.locator(this.elements.landingPage)).toBeVisible({
      timeout: 30000,
    });
    await this.waitForVisibility(this.elements.systemSettingsButton, isAdmin);
  }

  async getUserIdFromLocalStorage() {
    const userId = await this.page
      .context()
      .storageState()
      .then((f) => {
        return f.origins[0].localStorage.find((obj) => {
          return obj.name === 'ajs_user_traits';
        });
      });
    return JSON.parse(userId.value).user_id;
  }

  async getSubdomainFromLocalStorage() {
    const subdomain = await this.page
      .context()
      .storageState()
      .then((f) => {
        return f.origins[0].localStorage.find((obj) => {
          return obj.name === 'ajs_group_properties';
        });
      });
    return JSON.parse(subdomain.value).entity_plc_id;
  }
}
