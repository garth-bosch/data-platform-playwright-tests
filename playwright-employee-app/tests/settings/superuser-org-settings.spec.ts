import {test} from '../../src/base/base-test';
import {SUPER_USER_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Login to EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });
  test('Organization Settings doesnt display superUser "Community Settings" field for standard Admin or Employee users @OGT-45058 @Xoriant_Test', async ({
    page,
    organizationSettingPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Login to EA', async () => {
      await recordTypesSettingsPage.proceedToOrgSettingsPage();
    });
    await test.step('Go to Reporting Settings page and verify the button is present', async () => {
      await expect(
        page.locator(
          organizationSettingPage.elements.presenceOfCommunitySettings,
        ),
      ).toBeHidden();
    });
  });
  test('Reporting entity ID SuperUser field is not present for standard admin or employee users @OGT-44853 @broken_test @Xoriant_Test', async ({
    page,
    reportingSettingsPage,
  }) => {
    await test.step('Go to Reporting settings page', async () => {
      await reportingSettingsPage.proceedToReportingSettingsPage();
    });
    await test.step('Verify entity input not present', async () => {
      await expect(
        page.locator(
          reportingSettingsPage.elements.reportingSettingsEntityInput,
        ),
      ).toBeHidden();
    });
  });
  test('SuperUser "Payment Mode" Test/Live Toggle not present in Payment Settings for standard Admins @OGT-44647 @Xoriant_Test', async ({
    page,
    paymentsSettingsPage,
  }) => {
    await test.step('Go to Payments settings page', async () => {
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
    });
    await test.step('Verify Test/Live Toggle not present', async () => {
      await expect(
        page.locator(paymentsSettingsPage.elements.paymentModeLabel),
      ).toBeHidden();
      await expect(
        page.locator(
          paymentsSettingsPage.elements.paymentModeLabelSiblingCurrency,
        ),
      ).toBeHidden();
    });
  });
  test('SuperUser "Clear Stripe Settings" button not present in Payment Settings for standard Admins @OGT-44648 @Xoriant_Test', async ({
    page,
    paymentsSettingsPage,
  }) => {
    await test.step('Go to Payments settings page', async () => {
      await paymentsSettingsPage.proceedToPaymentsSettingsPage();
    });
    await test.step('Verify clear stripe settings not present', async () => {
      await expect(
        page.locator(paymentsSettingsPage.elements.clearStripeSettings),
      ).toBeHidden();
    });
  });

  test('Reporting entity ID SuperUser field is not present for standard admin or employee users @OGT-44663 @broken_test @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
  }) => {
    await test.step('Verify the GIS settings page not present', async () => {
      await expect(
        page.locator(recordTypesSettingsPage.elements.gisSettingTab),
      ).toBeHidden();
    });
  });
  test('SuperUser "Integration Types" button is not present for standard Admin users @OGT-44646 @broken_test @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
  }) => {
    await test.step('Verify the GIS settings page not present', async () => {
      await expect(
        page.locator(
          recordTypesSettingsPage.elements.integrationTypesSettingTab,
        ),
      ).toBeHidden();
    });
  });
  test('SuperUser "Repair User" tool not present for standard Admin users @OGT-44512 @broken_test', async ({
    page,
    recordTypesSettingsPage,
  }) => {
    await test.step('Verify SuperUser "Repair User" tool not present for standard Admin users', async () => {
      await expect(
        page.locator(recordTypesSettingsPage.elements.repairUsersSettingTab),
      ).toBeHidden();
    });
  });
});
