import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings - Conditional Form fields @forms-conditions', () => {
  let recordTypeName: string,
    fieldInput1: string,
    fieldInput2: string,
    substractedResult: string,
    allConditionsResult: string,
    sectionName: string;
  test.beforeEach(
    async ({
      recordTypesApi,
      employeeAppUrl,
      page,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      recordsApi,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      fieldInput1 = `FieldInput1_${faker.random.alphaNumeric(4)}`;
      fieldInput2 = `FieldInput2_${faker.random.alphaNumeric(4)}`;
      substractedResult = `SubstractedField_${faker.random.alphaNumeric(4)}`;
      allConditionsResult = `AllConditionsResultField_${faker.random.alphaNumeric(
        4,
      )}`;
      sectionName = `Section ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form fieldInput1 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldInput1;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldInput1}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form fieldInput2 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldInput2;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldInput2}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form substractedResult to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          substractedResult;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${substractedResult}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form allConditionsResult to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          allConditionsResult;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${allConditionsResult}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });

      await test.step('Create Record with Conditional Form Fields', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
        );
      });
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
    },
  );

  test('Verify that calculated fields with a negative value should not display as 0 @OGT-33835 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordPage,
    formDesignerPage,
  }) => {
    const input1 = '2';
    const input2 = '3';
    const result = Number(input1) - Number(input2);
    await test.step('Add a substraction calculations for fieldInput1 and fieldInput2 on form substractedResult', async () => {
      await formDesignerPage.clickOnSpecificFormField(substractedResult);
      await formDesignerPage.makeFieldCalculated();
      await formDesignerPage.fillCalculatedFormulaOnFieldValue(
        fieldInput1,
        fieldInput2,
        '-',
      );
      await formDesignerPage.clickOnDone();
    });
    await test.step('Go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        input1,
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput2,
        input2,
      );
    });
    await test.step('Verify negative calculated form field value shown on the record', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        substractedResult,
        sectionName,
        result,
      );
    });
  });

  test('Any or All conditional logic should trigger appropriately @OGT-33733 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordPage,
    formDesignerPage,
  }) => {
    const input1 = '4';
    const input2 = '3';
    await test.step('Add a greater than condition for fieldInput1 and fieldInput2 with Match All Conditions on a form allConditionsResult', async () => {
      await formDesignerPage.getFormFieldIdValue(
        allConditionsResult,
        sectionName,
      );
      await formDesignerPage.clickOnSpecificFormField(allConditionsResult);
      await formDesignerPage.makeFieldCalculated();
      await formDesignerPage.fillCalculatedFieldValue(fieldInput1);
      await formDesignerPage.addCondition(
        fieldInput1,
        'is greater than',
        'number',
        '1',
      );
      await formDesignerPage.verifyConditionPresent(
        `When ${fieldInput1} is greater than 1.00`,
      );
      await formDesignerPage.addCondition(
        fieldInput2,
        'is greater than',
        'number',
        '1',
      );
      await formDesignerPage.clickOnDone();
    });
    await test.step('Go to record and update fieldInput1 to 1 and fieldInout2 to 1', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '1',
      );
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput2,
        '1',
      );
      await page.reload();
    });
    await test.step('Verify all match conditions did not meet', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        allConditionsResult,
        sectionName,
        input1,
        false,
      );
    });
    await test.step('update fieldInpu1 and fieldInput2', async () => {
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        input1,
      );
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput2,
        input2,
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        input1,
      );
    });
    await test.step('Verify all match conditions met', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        allConditionsResult,
        sectionName,
        input1,
      );
    });
  });
});
