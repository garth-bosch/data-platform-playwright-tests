import {test, expect} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('admin can add conditions @fee-conditions', () => {
  let recordTypeName;
  test('Conditions can be added to Fees @OGT-33716 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
    feeDesignerPage,
  }) => {
    await test.step('Create a Record Type, Location and User flags', async () => {
      recordTypeName = `@OGT-33716 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Fees Tab', async () => {
      await recordTypesSettingsPage.proceedToFeesTab();
    });
    await test.step('Set Calculations', async () => {
      await feeDesignerPage.proceedToFeeDesigner();
      await feeDesignerPage.setCalculation('$ flat');
    });
    await test.step('Click on Added Fees', async () => {
      await feeDesignerPage.clickAddedFee();
    });
    await test.step('Add User Condition', async () => {
      await feeDesignerPage.addUserCondition();
    });
    await test.step('Select Match Operator', async () => {
      await feeDesignerPage.selectMatchOperatorInConditionForm(
        'Match Any Condition',
      );
    });
    await test.step('Save and Verify Condition is present', async () => {
      await page.locator(feeDesignerPage.elements.saveFeeCalculation).click();
      await feeDesignerPage.clickAddedFee();
      await expect(
        page.locator(feeDesignerPage.elements.conditionFormInline),
      ).toBeVisible();
      await expect(
        await page
          .locator(feeDesignerPage.elements.matchOperatorConditionForm)
          .locator(
            `option[value="${await page
              .locator(feeDesignerPage.elements.matchOperatorConditionForm)
              .inputValue()}"]`,
          ),
      ).toHaveText('Match Any Condition');
    });
  });
});
