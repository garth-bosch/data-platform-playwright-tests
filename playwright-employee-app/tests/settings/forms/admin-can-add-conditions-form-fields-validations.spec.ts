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
const conditionalFormFieldHtml = `<div> ConditionalFormField: <p class='conditionalFormField'>ConditionalFormFieldValue<br></p> </div>`;
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName,
    fieldName1,
    fieldName2,
    fieldName3,
    fieldName4,
    sectionName,
    recTypeNo;
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
      fieldName1 = `Field_${faker.random.alphaNumeric(4)}`;
      fieldName2 = `Field_${faker.random.alphaNumeric(4)}`;
      fieldName3 = `Field_${faker.random.alphaNumeric(4)}`;
      fieldName4 = `Field_${faker.random.alphaNumeric(4)}`;
      sectionName = `Section ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type', async () => {
        recTypeNo = await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form field1 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName1;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName1}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form field2 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName2;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName2}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form field3 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName3;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName3}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form field4 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName4;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName4}`;
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
      await test.step('Add a greater than condition on a form field2', async () => {
        await formDesignerPage.getFormFieldIdValue(fieldName2, sectionName);
        await formDesignerPage.clickOnSpecificFormField(fieldName2);
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.fillCalculatedFieldValue(fieldName1);
        await formDesignerPage.addCondition(
          fieldName1,
          'is greater than',
          'number',
          '1',
        );
        await formDesignerPage.verifyConditionPresent(
          `When ${fieldName1} is greater than 1.00`,
        );
        await formDesignerPage.clickOnDone();
      });
      await test.step('Add a substraction calculations for field1 and field3 on form field4', async () => {
        await formDesignerPage.clickOnSpecificFormField(fieldName4);
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.fillCalculatedFormulaOnFieldValue(
          fieldName1,
          fieldName3,
          '-',
        );
        await formDesignerPage.clickOnDone();
      });
      await test.step('Add Document to record type with conditional Form field2', async () => {
        await recordTypesApi.addDocuments({
          docTemplate: {
            docTitle: recordTypeName,
            recordTypeID: recTypeNo,
            html: conditionalFormFieldHtml.replace(
              'ConditionalFormFieldValue',
              `{{FF${baseConfig.citTempData.formFieldId}}}`,
            ),
          },
        });
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
    },
  );

  test('Field/sections from conditionally un-applicable fields/sections are given the eyeball icon on record details @OGT-43946 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to record and details section', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });
    await test.step('Verify no eyeball icon on satisfied condition form field value on the record', async () => {
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldName1,
        '2',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        fieldName2,
        sectionName,
      );
    });
    await test.step('Verify eyeball icon on un satisfied condition form field value on the record', async () => {
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldName1,
        '1',
      );
      await recordPage.validateFormFieldFireEyeOnRecord(
        fieldName2,
        sectionName,
        true,
      );
    });
  });
});
