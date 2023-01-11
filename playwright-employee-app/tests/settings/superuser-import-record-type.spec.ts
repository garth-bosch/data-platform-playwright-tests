import {test} from '../../src/base/base-test';
import {
  SUPER_USER_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee App - Settings - Template Store @settings', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Login to EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });

  test(
    'Validate fee settings is copying correctly in the imported record type @OGT-34186 @broken_test' +
      ' @Xoriant_test',
    async ({recordTypesSettingsPage}) => {
      await test.step('Navigate to the Template Store', async () => {
        await recordTypesSettingsPage.page
          .locator(recordTypesSettingsPage.elements.templateStoreSettingTab)
          .click();
      });

      await test.step('Choose a source record type and import it', async () => {
        await recordTypesSettingsPage.selectSourceToImportRecordType(
          process.env.PLC_TEST_ENV_DEV,
          'Test Department',
        );
        await recordTypesSettingsPage.importRecordType(
          TestRecordTypes.Record_type_step_fees,
          'Test Department',
          true,
        );
      });

      await test.step('Open the Fees tab', async () => {
        await recordTypesSettingsPage.page
          .locator(recordTypesSettingsPage.elements.feesTab)
          .click();
      });

      await test.step('Verify all fees are present', async () => {
        await expect(
          recordTypesSettingsPage.page.locator(
            recordTypesSettingsPage.elements.feeLabel,
            {hasText: 'Calculate fee per amount'},
          ),
        ).toBeVisible();
        await expect(
          recordTypesSettingsPage.page.locator(
            recordTypesSettingsPage.elements.feeLabel,
            {hasText: 'Calculated fee off another Calculated fee'},
          ),
        ).toBeVisible();
        await expect(
          recordTypesSettingsPage.page.locator(
            recordTypesSettingsPage.elements.feeLabel,
            {hasText: 'Calculated fee off calculated field'},
          ),
        ).toBeVisible();
        await expect(
          recordTypesSettingsPage.page.locator(
            recordTypesSettingsPage.elements.feeLabel,
            {hasText: 'Conditional Fee'},
          ),
        ).toBeVisible();
        await expect(
          recordTypesSettingsPage.page.locator(
            `${recordTypesSettingsPage.elements.feeLabel} >> text='Flat Fee'`,
          ),
        ).toBeVisible();
        await expect(
          recordTypesSettingsPage.page.locator(
            recordTypesSettingsPage.elements.feeLabel,
            {hasText: 'Flat fee with Discount and Prorated'},
          ),
        ).toBeVisible();
      });
    },
  );
});
