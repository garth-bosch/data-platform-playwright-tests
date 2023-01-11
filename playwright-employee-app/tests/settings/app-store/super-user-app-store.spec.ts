import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  AppStoreUrls,
  SUPER_USER_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  getTokenByUserRole,
  UserRole,
} from '@opengov/cit-base/build/api-support/citApiHelper';

test.use({storageState: SUPER_USER_SESSION});
const fieldNames = ['name', 'infoUrl', 'webhooksDeliveryUrl', 'clientID'];
const recordTypeName = TestRecordTypes.Additional_Location_Test.name;
let appClientId: string;
test.describe('Super user able to create app inside app store and verify app details @appstore', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Login to EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });
  test('[Super User] Create new app in app store and verify install,uninstall and verify app details @OGT-47744', async ({
    systemSettingsAppStorePage,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID1}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(9)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };
    try {
      await test.step('Create new app in app store', async () => {
        await systemSettingsAppStorePage.selectSuperUserAppStore();
        await systemSettingsAppStorePage.addNewApp(appData);
      });
      await test.step('Verify the installed app data', async () => {
        await systemSettingsAppStorePage.verifyNewAppData(appData);
      });
      await test.step('Install the new app', async () => {
        await systemSettingsAppStorePage.installApp(appName);
      });
      await test.step('Uninstall the new app', async () => {
        await systemSettingsAppStorePage.unInstallApp(appName);
      });
    } finally {
      await test.step('Delete app in app store', async () => {
        await systemSettingsAppStorePage.deleteApp(appName);
      });
    }
  });
  test('[Super User] Verify error message for empty input fields on create new app pop up screen @OGT-47746', async ({
    systemSettingsAppStorePage,
  }) => {
    await test.step('Verify error message while trying to create app with empty field value entry', async () => {
      await systemSettingsAppStorePage.selectSuperUserAppStore();
      await systemSettingsAppStorePage.addNewAppErrorValidation(fieldNames);
    });
  });
});
test.describe('Super user able to create ,install, uninstall, enable and disable app inside app store and verify app access in record type access page @appstore', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Login to EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });
  test.afterEach(async ({appStoreApi}) => {
    await test.step('Delete app in app store by graphql api', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.deleteApp({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
  });

  test('[Super User] Verify the app access status in record type access page after enable/disable the app from my apps page @OGT-47747', async ({
    systemSettingsAppStorePage,
    recordTypesSettingsPage,
    navigationBarPage,
    appStoreApi,
  }) => {
    await getTokenByUserRole(true, UserRole.SUPER_USER);
    appClientId = `${process.env.APP_STORE_CLIENT_ID2}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(8)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };
    await test.step('Create a new app in app store using graphql api', async () => {
      await appStoreApi.addNewApp(appData);
    });
    await test.step('Install the newly created app by graphql api', async () => {
      await appStoreApi.appInstallationMutation({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
    await test.step('Verify the installed app is by default enabled in my apps page', async () => {
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.verifyAppEnableDisableStatus(
        appName,
        'true',
      );
    });
    await test.step('Verify app, default access type is "No Access" in record type access page while app is enabled in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, true);
      await recordTypesSettingsPage.validateAppPermissionSetting(appName, '0');
    });
    await test.step('Disable the app in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.enableDisableInstalledApp(appName);
      await systemSettingsAppStorePage.verifyAppEnableDisableStatus(
        appName,
        'false',
      );
    });
    await test.step('Verify the app should not display in record type access page while app is disabled in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, false);
    });
  });
  test('[Super User] Verify app enable/disable status in my apps page after install/uninstall the app from app store page  @OGT-47748', async ({
    systemSettingsAppStorePage,
    appStoreApi,
    recordTypesSettingsPage,
    navigationBarPage,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID3}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(7)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };
    await test.step('Create a new app in app store using graphql api', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.addNewApp(appData);
    });
    await test.step('Install the app in app store page', async () => {
      await systemSettingsAppStorePage.selectSuperUserAppStore();
      await systemSettingsAppStorePage.installApp(appName);
    });
    await test.step('Verify the app status is enabled in my apps page after installing the app in app store page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.verifyAppEnableDisableStatus(
        appName,
        'true',
      );
    });
    await test.step('Uninstall the app in app store page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsAppStorePage.selectSuperUserAppStore();
      await systemSettingsAppStorePage.unInstallApp(appName);
    });
    await test.step('Verify the app should not display in my apps page after uninstalling the app in app store page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.verifyAppVisibilityInMyApps(appName);
    });
    await test.step('Verify the app should not display in record type access page while app is uninstalled in app store page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, false);
    });
  });
  test('[Super User] E2E- Create new app and verify the app access type inside record type access page @OGT-47749', async ({
    systemSettingsAppStorePage,
    recordTypesSettingsPage,
    navigationBarPage,
    appStoreApi,
  }) => {
    await getTokenByUserRole(true, UserRole.SUPER_USER);
    appClientId = `${process.env.APP_STORE_CLIENT_ID4}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(6)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };
    await test.step('Create a new app in app store by graphql api', async () => {
      await appStoreApi.addNewApp(appData);
    });
    await test.step('Install the newly created app', async () => {
      await appStoreApi.appInstallationMutation({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
    await test.step('Verify the default app status is enabled in my apps page after installing the new app', async () => {
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.verifyAppEnableDisableStatus(
        appName,
        'true',
      );
    });
    await test.step('Verify app, default access type is "No Access" in record type access page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppPermissionSetting(appName, '0');
    });
    await test.step('Validate app should not be displaying in record type access page after disabling installed app', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.disableInstallApp({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
    await test.step('Verify app should not display while app is disabled from my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, false);
    });
    await test.step('Validate app access type should preserve the previous changed access type after enabling app', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.enableInstallApp({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
    await test.step('Verify app, default access type is "No Access" in record type access page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppPermissionSetting(appName, '0');
    });
  });
});
