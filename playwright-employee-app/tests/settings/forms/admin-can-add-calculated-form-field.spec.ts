import {test, expect} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName;
  test.beforeEach(async ({recordTypesApi}) => {
    recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Add Single Entry Form Section and Number form field to Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel =
        'Single Entry Section 1';
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultFormSectionObject.formSection.sectionType = 0;
      await recordTypesApi.addFormSection(defaultFormSectionObject);
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
          .formSectionID,
      );

      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.Number;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = 'Field 1';
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
    await test.step('Add Multi Entry Form Section and Number form fieldto Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel =
        'Multi Entry Section 1';
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultFormSectionObject.formSection.sectionType = 1;
      await recordTypesApi.addFormSection(defaultFormSectionObject);
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
          .formSectionID,
      );

      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.Number;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = 'Field 2';
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
  });
  test('All Number Form Fields in Record Type can be added to a Multi-Entry calculated form field @OGT-46207 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Create new Single and Multi Entry Sections with Number Form field', async () => {
      await formDesignerPage.addSingleEntrySection('Single Entry Section 2');
      await formDesignerPage.addFormField(
        'Number',
        'Single Entry Section 2',
        'Field 3',
      );
      await formDesignerPage.addMultyEntrySection('Multi Entry Section 2');
      await formDesignerPage.addFormField(
        'Number',
        'Multi Entry Section 2',
        'Field 4',
      );
    });
    await test.step('Create a Calculated Form Field', async () => {
      await formDesignerPage.addFormField(
        'Number',
        'Multi Entry Section 2',
        'Calculated Form Field',
      );
      await formDesignerPage.clickOnSpecificFormField('Calculated Form Field');
      await formDesignerPage.makeFieldCalculated();
    });
    await test.step('Verify Existing and Newly added form fields are shown in Calculated Form field', async () => {
      await page.type(formDesignerPage.elements.formulaInput, '@');
      const formulaList = await page
        .locator(formDesignerPage.elements.autoFillFormulaList)
        .allTextContents();
      const formFields = ['Field 1', 'Field 2', 'Field 3', 'Field 4'];
      formFields.forEach((field) =>
        expect(formulaList.find((elem) => elem.includes(field))).toBeTruthy(),
      );
    });

    await test.step('Add a Number Form Field to Calculated Form Field Formula', async () => {
      await page
        .locator(formDesignerPage.elements.autoFillFormulaList, {
          hasText: 'Field 1',
        })
        .click();
    });
    await test.step('Validate Calculated form field', async () => {
      await expect(
        page.locator(formDesignerPage.elements.calculatorIcon),
        'Calculator Icon',
      ).toBeVisible();
      await page.click(formDesignerPage.elements.doneEditButton);
    });
  });

  test('All Number Form Fields in Record Type can be added to a Single-Entry calculated form field @OGT-46206 @Xoriant_Test @smoke @broken_test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Create new Single and Multi Entry Sections with Number Form field', async () => {
      await formDesignerPage.addSingleEntrySection('Single Entry Section 2');
      await formDesignerPage.addFormField(
        'Number',
        'Single Entry Section 2',
        'Field 3',
      );
      await formDesignerPage.addMultyEntrySection('Multi Entry Section 2');
      await formDesignerPage.addFormField(
        'Number',
        'Multi Entry Section 2',
        'Field 4',
      );
    });
    await test.step('Create a Calculated Form Field', async () => {
      await formDesignerPage.addFormField(
        'Number',
        'Single Entry Section 2',
        'Calculated Form Field',
      );
      await formDesignerPage.clickOnSpecificFormField('Calculated Form Field');
      await formDesignerPage.makeFieldCalculated();
    });
    await test.step('Verify Existing and Newly added form fields are shown in Calculated Form field', async () => {
      await page.type(formDesignerPage.elements.formulaInput, '@');
      const formulaList = await page
        .locator(formDesignerPage.elements.autoFillFormulaList)
        .allTextContents();
      const formFields = ['Field 1', 'Field 2', 'Field 3', 'Field 4'];
      formFields.forEach((field) =>
        expect(formulaList.find((elem) => elem.includes(field))).toBeTruthy(),
      );
    });

    await test.step('Add a Number Form Field to Calculated Form Field Formula', async () => {
      await page
        .locator(formDesignerPage.elements.autoFillFormulaList, {
          hasText: 'Field 1',
        })
        .click();
    });
    await test.step('Validate Calculated form field', async () => {
      await expect(
        page.locator(formDesignerPage.elements.calculatorIcon),
        'Calculator Icon',
      ).toBeVisible();
      await page.click(formDesignerPage.elements.doneEditButton);
    });
  });
});
