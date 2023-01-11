import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';
import {ApiDepartments} from '@opengov/cit-base/build/api-support/api/departmentsApi';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Reporting settings page', () => {
  /*  @OGT-44254 - is already tested .. 257 etc would not be possible without this test so not really usefull*/
  test('Reporting button is present when enabled @OGT-44254 @broken_test @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    reportingSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Reporting Settings page and verify the button is present', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await reportingSettingsPage.proceedToReportingSettingsPage();
    });
  });

  test('Nightly data sync can be toggled On/Off @OGT-44257 @broken_test @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    reportingSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Reportings Settings page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await reportingSettingsPage.proceedToReportingSettingsPage();
    });
    await test.step('Toggle data sync on and verify', async () => {
      await reportingSettingsPage.toggleDataSyncOnOrOff(true);
      await expect(await reportingSettingsPage.isToggleOn()).toBeTruthy();
    });

    await test.step('Re navigate to Reportings Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await reportingSettingsPage.proceedToReportingSettingsPage();
    });
    await test.step('Toggle data sync off and verify', async () => {
      await reportingSettingsPage.toggleDataSyncOnOrOff(false);
      await expect(await reportingSettingsPage.isToggleOn()).toBeFalsy();
    });
  });

  test('Ability to toggle on/off all datasets @OGT-44258 @broken_test @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    reportingSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to Reportings Settings page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await reportingSettingsPage.proceedToReportingSettingsPage();
    });
    await test.step('Toggle Given dept sync on and verify', async () => {
      await reportingSettingsPage.toggleGivenSettingOnOrOff(
        ApiDepartments.automatedTesting.name,
      );
      await expect(
        await reportingSettingsPage.toggleGivenSettingCurrentState(
          ApiDepartments.automatedTesting.name,
        ),
      ).toBeTruthy();
    });

    await test.step('Toggle Given dept  sync off and verify', async () => {
      await reportingSettingsPage.toggleGivenSettingOnOrOff(
        ApiDepartments.automatedTesting.name,
        false,
      );
      await expect(
        await reportingSettingsPage.toggleGivenSettingCurrentState(
          ApiDepartments.automatedTesting.name,
        ),
      ).toBeFalsy();
    });
  });
});
