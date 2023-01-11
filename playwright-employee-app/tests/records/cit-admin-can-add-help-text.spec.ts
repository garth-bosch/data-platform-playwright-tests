import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Admin can add condition to Help text type field', () => {
  const recTypeDesc = `OGT-33859_${faker.random.alphaNumeric(12)}`;
  let recName = ``;
  const numberFieldName = `@OGT-33859-Number`,
    helpTextFieldName = '@OGT-33859-Help-Text';

  test(' Admin can add condition to Help text type field @OGT-33859 @OXoriant_Test', async ({
    page,
    employeeAppUrl,
    recordTypesSettingsPage,
    navigationBarPage,
    formDesignerPage,
  }) => {
    await test.step('Navigate to Employee page', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
    });
    await test.step('Create record type and add form and help test fields', async () => {
      recName = await recordTypesSettingsPage.addRecordType(recTypeDesc);
      await recordTypesSettingsPage.proceedToGeneral();
      await recordTypesSettingsPage.proceedToFormTab();
      await formDesignerPage.addSingleEntrySection();
      await formDesignerPage.clickAddNewField();
      await formDesignerPage.addNumberField(numberFieldName);
      await formDesignerPage.clickDoneButtonEditRightSidePanel();
      await formDesignerPage.clickAddNewField();
      await formDesignerPage.addHelpField(helpTextFieldName);
      await formDesignerPage.clickDoneButtonEditRightSidePanel();
      await recordTypesSettingsPage.publishRecordTypeFromDraft();
    });
    await test.step('Navigate back to Record type freshly after creation', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
      await recordTypesSettingsPage.setNameFilter(`${recName}`);
      await recordTypesSettingsPage.proceedToGeneral();
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Edit help text, add condition and verify successfully saved', async () => {
      await formDesignerPage.clickOnSpecificFormField(helpTextFieldName);
      await formDesignerPage.addCondition('Renewal', 'True');
      await formDesignerPage.clickOnDone();
      await formDesignerPage.clickOnSpecificFormField(helpTextFieldName);
      await formDesignerPage.verifyConditionPresent('Record is being renewed');
    });
  });
});
