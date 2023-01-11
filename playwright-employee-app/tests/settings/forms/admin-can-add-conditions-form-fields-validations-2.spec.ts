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
    conditionalFieldOutput: string,
    fieldInput2: string,
    additionResult: string,
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
      formDesignerPage,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      fieldInput1 = `FieldInput1_${faker.random.alphaNumeric(4)}`;
      conditionalFieldOutput = `ConditionalField_${faker.random.alphaNumeric(
        4,
      )}`;
      fieldInput2 = `FieldInput2_${faker.random.alphaNumeric(4)}`;
      additionResult = `AdditionField_${faker.random.alphaNumeric(4)}`;
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
      await test.step('Add form conditionalFieldOutput to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          conditionalFieldOutput;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${conditionalFieldOutput}`;
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
      await test.step('Add form additionResult to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          additionResult;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${additionResult}`;
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
      await test.step('Add a greater than condition on a form conditionalFieldOutput', async () => {
        await formDesignerPage.getFormFieldIdValue(
          conditionalFieldOutput,
          sectionName,
        );
        await formDesignerPage.clickOnSpecificFormField(conditionalFieldOutput);
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
        await formDesignerPage.clickOnDone();
      });
      await test.step('Add a greater than condition and add calculations for fieldInput1 and fieldInput2 on a form additionResult', async () => {
        await formDesignerPage.getFormFieldIdValue(additionResult, sectionName);
        await formDesignerPage.clickOnSpecificFormField(additionResult);
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.fillCalculatedFormulaOnFieldValue(
          fieldInput1,
          fieldInput2,
          '+',
        );
        await formDesignerPage.addCondition(
          conditionalFieldOutput,
          'is greater than',
          'number',
          '2',
        );
        await formDesignerPage.verifyConditionPresent(
          `When ${conditionalFieldOutput} is greater than 2.00`,
        );
        await formDesignerPage.clickOnDone();
      });
    },
  );

  test("Fields with eyeball icon don't have values count towards conditions on Form @OGT-44712 @Xoriant_Test", async ({
    page,
    internalRecordPage,
    recordPage,
  }) => {
    const input1 = '3';
    const input2 = '3';
    const result = Number(input1) + Number(input2);
    await test.step('Go to record and update fieldInput1', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '2',
      );
      await page.reload();
    });
    await test.step('update fieldInput1 and fieldInput2 form fields on record', async () => {
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
    await test.step('Verify conditional form field value shown on the document', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        conditionalFieldOutput,
        sectionName,
        input1,
      );
    });
    await test.step('Verify additonal calculated form field value and no eyeball icon shown on the record', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        additionResult,
        sectionName,
        result,
      );
      await recordPage.validateFormFieldFireEyeOnRecord(
        additionResult,
        sectionName,
      );
    });
    await test.step('Verify eyeball icon on satisfied condition form field value on the record', async () => {
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '2',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        additionResult,
        sectionName,
        true,
      );
    });
  });
});
