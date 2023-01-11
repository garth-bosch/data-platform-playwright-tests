import {expect} from '../../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class SystemSettingsAppStorePage extends BaseCitPage {
  readonly elements = {
    addNewAppBtn: '[data-testid="appStore-button-addNewApp"]',
    appNameInput: '[data-test="addDetails-input-name"]',
    appDescriptionInput: '[data-test="addDetails-textaread-description"]',
    homePgUrlInput: '[data-test="addDetails-input-infoUrl"]',
    webHookUrlInput: '[data-test="addDetails-input-webhooksDeliveryUrl"]',
    webHookCheckSwitcher:
      '[data-test="addDetails-switch-webhookEnabler"] input',
    stepStatusCheck: '[data-test="addDetails-checkBox-events"] input',
    clientIdInput: '[data-test="addDetails-input-clientID"]',
    appCreateBtn: '[data-testid="addNewApp-button-create"]',
    cancelBtn: '[data-testid="addNewApp-button-cancel"]',
    newAppHeader: '[data-testid="addNewApp-header-title"]',
    superUserAppStoreIcon: '#settings-superUser-appStore-btn',
    adminUserAppStoreIcon: '#settings-administrative-appStore-btn',
    recordTypeSettingsBtn: '#settings-recordtypes-btn',
    administrativeMyAppsIcon: '#settings-administrative-apps-btn',
    appAccessSection: '[data-test-attribute="app-user-access-controll"]',
    deleteApp: '[data-test="addDetails-checkBox-deleteApp"]',
    toastMsg: '[data-test="addNewApp-toast-success"]',
    appDeleteWarningPopup: '[data-test="dialog-destructive-container"]',
    appDeleteConformationBtn: '[data-testid="addNewApp-button-delete"]',
    closeToastMsg: 'button > svg',
    inputAppNameErrorMsg:
      '//input[@data-test="addDetails-input-name"]/../../p[1]',
    mandatoryFieldRequiredErrorMsg: {
      selector: (fieldName: string) =>
        `//input[@data-test="addDetails-input-${fieldName}"]/../../p[1]`,
    },
    enableDisableAppOnMyApps: {
      selector: (appName: string) =>
        `//div[@data-test="appCard-switch-enableDisable-${appName}"]/div/input`,
    },
    installAppBtn: {
      selector: (appName: string) =>
        `[data-testid="appCard-installButton-${appName}"]`,
    },
    unInstallAppBtn: {
      selector: (appName: string) =>
        `[data-testid="appCard-uninstallButton-${appName}"]`,
    },
    appNameTextLabel: {
      selector: (appName: string) =>
        `[data-testid="appCard-appNameText-${appName}"]`,
    },
    appNameInstallTextLabel: {
      selector: (appName: string) =>
        `[data-testid="appCard-installedText-${appName}"]`,
    },
    appDescriptionLabel: {
      selector: (appName: string) =>
        `[data-testid="appCard-descriptionText-${appName}"]`,
    },
    enableDisableApp: {
      selector: (appName: string) =>
        `[data-test="appCard-switch-enableDisable-${appName}"]`,
    },
    appAccess: {
      selector: (appName: string) => `#dropdown_app_${appName}`,
    },
  };

  async selectSuperUserAppStore() {
    await this.page.click(this.elements.superUserAppStoreIcon);
  }
  async selectadministrativeMyAppsIcon() {
    await this.page.click(this.elements.administrativeMyAppsIcon);
  }
  async selectAdminUserAppStore() {
    await this.page.click(this.elements.adminUserAppStoreIcon);
  }
  async addNewApp(appDetails: {
    appName: string;
    appDescription: string;
    homeUrl: string;
    webHookUrl: string;
    webHookChecker: boolean;
    clientId: string;
  }) {
    await this.page.click(this.elements.addNewAppBtn);
    await this.waitForVisibility(this.elements.newAppHeader, true);
    await this.page.fill(this.elements.appNameInput, appDetails.appName);
    await this.page.fill(
      this.elements.appDescriptionInput,
      appDetails.appDescription,
    );
    await this.page.fill(this.elements.homePgUrlInput, appDetails.homeUrl);
    await this.page.fill(this.elements.webHookUrlInput, appDetails.webHookUrl);
    await this.page.fill(this.elements.clientIdInput, appDetails.clientId);
    await this.page.click(this.elements.appCreateBtn);
    await this.waitForVisibility(this.elements.newAppHeader, false);
    await this.closeToastMsg();
  }

  async installApp(appName: string) {
    await this.page.click(this.elements.installAppBtn.selector(appName));
    await this.waitForVisibility(
      this.elements.appNameInstallTextLabel.selector(appName),
      true,
    );
    await this.waitForVisibility(
      this.elements.unInstallAppBtn.selector(appName),
      true,
    );
    await this.closeToastMsg();
  }

  async unInstallApp(appName: string) {
    await this.page.click(this.elements.unInstallAppBtn.selector(appName));
    await this.waitForVisibility(
      this.elements.appNameInstallTextLabel.selector(appName),
      false,
    );
    await this.waitForVisibility(
      this.elements.installAppBtn.selector(appName),
      true,
    );
    await this.closeToastMsg();
  }
  async verifyNewAppData(appDetails: {
    appName: string;
    appDescription: string;
    homeUrl: string;
    webHookUrl: string;
    webHookChecker: boolean;
    clientId: string;
  }) {
    await this.page.click(
      this.elements.appNameTextLabel.selector(appDetails.appName),
    );
    await this.waitForVisibility(this.elements.newAppHeader, true);
    expect(
      await this.page.locator(this.elements.appNameInput).getAttribute('value'),
    ).toEqual(appDetails.appName);
    expect(
      (
        await this.page.locator(this.elements.appDescriptionInput).textContent()
      ).trim(),
    ).toEqual(appDetails.appDescription);
    expect(
      (
        await this.page
          .locator(this.elements.homePgUrlInput)
          .getAttribute('value')
      ).trim(),
    ).toEqual(appDetails.homeUrl);
    expect(
      (
        await this.page
          .locator(this.elements.webHookUrlInput)
          .getAttribute('value')
      ).trim(),
    ).toEqual(appDetails.webHookUrl);
    expect(
      (
        await this.page
          .locator(this.elements.clientIdInput)
          .getAttribute('value')
      ).trim(),
    ).toEqual(appDetails.clientId);
    await this.page.click(this.elements.cancelBtn);
    await this.waitForVisibility(this.elements.newAppHeader, false);
  }
  async verifyAppEnableDisableStatus(appName: string, enableStatus: string) {
    await this.waitForVisibility(this.elements.addNewAppBtn, false);
    expect(
      await this.page
        .locator(this.elements.enableDisableAppOnMyApps.selector(appName))
        .getAttribute('aria-checked'),
    ).toEqual(enableStatus);
  }
  async enableDisableInstalledApp(appName: string) {
    await this.page.click(
      this.elements.enableDisableAppOnMyApps.selector(appName),
    );
    await this.closeToastMsg();
  }
  async verifyAppVisibilityInMyApps(appName: string) {
    await this.waitForVisibility(
      this.elements.enableDisableAppOnMyApps.selector(appName),
      false,
    );
  }
  async addNewAppErrorValidation(fieldNames: string[]) {
    await this.page.click(this.elements.addNewAppBtn);
    await this.page.click(this.elements.appCreateBtn);
    for (const fieldName of fieldNames) {
      expect(
        (
          await this.page
            .locator(
              this.elements.mandatoryFieldRequiredErrorMsg.selector(fieldName),
            )
            .textContent()
        ).trim(),
      ).toEqual('Field is required');
    }
  }
  async deleteApp(appName: string) {
    await this.page.click(this.elements.appNameTextLabel.selector(appName));
    await this.waitForVisibility(this.elements.newAppHeader, true);
    await this.page.click(this.elements.deleteApp);
    await this.page.click(this.elements.appCreateBtn);
    await this.waitForVisibility(this.elements.appDeleteWarningPopup, true);
    await this.page.click(this.elements.appDeleteConformationBtn);
    await this.waitForVisibility(this.elements.appDeleteWarningPopup, false);
    await this.closeToastMsg();
    await this.waitForVisibility(
      this.elements.installAppBtn.selector(appName),
      false,
    );
  }
  async closeToastMsg() {
    await this.waitForVisibility(this.elements.closeToastMsg, true);
    await this.page.click(this.elements.closeToastMsg);
  }
}
