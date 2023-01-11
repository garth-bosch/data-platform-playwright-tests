import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  AppStoreUrls,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';
import {faker} from '@faker-js/faker';
import {
  getTokenByUserRole,
  UserRole,
} from '@opengov/cit-base/build/api-support/citApiHelper';
test.use({storageState: ADMIN_SESSION});
const recordTypeName = TestRecordTypes.Additional_Location_Test.name;
let appClientId: string;
test.describe('Admin user able to enable and disable app inside my apps page and verify app access in record type access page @appstore', () => {
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

  test('[Admin User] Verify installed app access type inside record type access page by enable/disable the app from my apps page  @OGT-47750', async ({
    systemSettingsAppStorePage,
    navigationBarPage,
    recordTypesSettingsPage,
    appStoreApi,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID5}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(3)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };

    await test.step('Create a new app in app store', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.addNewApp(appData);
    });

    await test.step('Install the newly created app', async () => {
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
    await test.step('View the app details in my apps page', async () => {
      await systemSettingsAppStorePage.verifyNewAppData(appData);
    });
    await test.step('Verify app, default access type is "No Access" in record type access page while app is enabled in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, true);
      await recordTypesSettingsPage.validateAppPermissionSetting(appName, '0');
    });

    await test.step('Validate app should not be displaying in record type access page after disabling installed app', async () => {
      await getTokenByUserRole(true, UserRole.ADMIN);
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
      await getTokenByUserRole(true, UserRole.ADMIN);
      await appStoreApi.enableInstallApp({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
    });
    await test.step('Verify app, default access type is "No Access" in record type access page while app is enabled in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, true);
      await recordTypesSettingsPage.validateAppPermissionSetting(appName, '0');
    });
  });
  test('[Admin User] Newly created app should not display in my apps page and record type setting page  @OGT-47751', async ({
    systemSettingsAppStorePage,
    navigationBarPage,
    recordTypesSettingsPage,
    appStoreApi,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID6}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(8)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };

    await test.step('Create a new app in app store', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.addNewApp(appData);
    });

    await test.step('Verify the app should not display in my app page if the same app is not installed in app store page', async () => {
      await systemSettingsAppStorePage.selectadministrativeMyAppsIcon();
      await systemSettingsAppStorePage.verifyAppVisibilityInMyApps(appName);
    });
    await test.step('Verify the app should not display in record type access page while app is disabled in my apps page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.clickPermissionsSettingButton();
      await recordTypesSettingsPage.validateAppUser(appName, false);
    });
  });
  test('[Admin User] Verify the installed app is displaying in my apps page and record type setting page  @OGT-47752', async ({
    systemSettingsAppStorePage,
    navigationBarPage,
    recordTypesSettingsPage,
    appStoreApi,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID7}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(7)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };

    await test.step('Create a new app in app store', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.addNewApp(appData);
    });

    await test.step('Install the newly created app', async () => {
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
  });
  test('[Admin User] Check installed app should not display in record type access page while app is disabled in my apps page @OGT-47753', async ({
    systemSettingsAppStorePage,
    navigationBarPage,
    recordTypesSettingsPage,
    appStoreApi,
  }) => {
    appClientId = `${process.env.APP_STORE_CLIENT_ID8}`;
    const appName = `CIT_AUTOMATION_APP_USER_${faker.random.alphaNumeric(6)}`;
    const appData = {
      appName: appName,
      appDescription: 'Creating new app',
      homeUrl: AppStoreUrls.homePageUrl,
      webHookUrl: AppStoreUrls.webHookStaticUrl,
      webHookChecker: false,
      clientId: appClientId,
    };

    await test.step('Create a new app in app store', async () => {
      await getTokenByUserRole(true, UserRole.SUPER_USER);
      await appStoreApi.addNewApp(appData);
    });

    await test.step('Install the newly created app', async () => {
      await appStoreApi.appInstallationMutation({
        clientID: appClientId,
        appID: baseConfig.citTempData.appId,
      });
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
});
