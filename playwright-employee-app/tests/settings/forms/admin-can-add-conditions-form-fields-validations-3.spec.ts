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
const conditionalFormFieldHtml = `<div> ConditionalFormField: <p class='conditionalFormField'>ConditionalFormFieldValue<br></p> </div>`;
test.describe('Employee App - Settings - Record type settings - Conditional Form fields @forms-conditions', () => {
  let recordTypeName: string,
    fieldInput1: string,
    conditionalFieldOutput: string,
    sectionName: string,
    recTypeNo: string;
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
      await test.step('Add Document to record type with conditional Form conditionalFieldOutput', async () => {
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
  test('Admin can condition to any existing form fields (all types) @OGT-33783 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to record and update form field', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '2',
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '3',
      );
    });
    await test.step('Verify calculated form field value shown on the record', async () => {
      await recordPage.validateFormFieldValueOnRecord(
        conditionalFieldOutput,
        sectionName,
        3,
      );
    });
  });

  test('Admin can verify adding conditionally triggered FF merge tags to the request body @OGT-33772 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '2',
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '300',
      );
    });
    await test.step('Add document for conditional form field', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify conditional form field value shown on the document', async () => {
      await recordPage.verifyConditionalFormFieldOnDocument('300');
    });
  });

  test('Admin can verify FF/location merge tags that would result to null values @OGT-33773 @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document for conditional form field', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify conditional form field value is empty on the document', async () => {
      await recordPage.verifyConditionalFormFieldOnDocument('');
    });
  });

  test('Field/section from since-deleted fields/sections are given the trash can icon on record details @OGT-44452 @Xoriant_Test', async ({
    page,
    internalRecordPage,
    navigationBarPage,
    employeeAppUrl,
    systemSettingsPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Go to record and update form field', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '2',
      );
      await page.reload();
      await expect(
        await page.locator(
          internalRecordPage.elements.trashIconForFieldName.selector(
            fieldInput1,
          ),
        ),
      ).toBeHidden();
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to forms tab and remove any field', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
      await recordTypesSettingsPage.removeFieldFromRecType();
    });
    await test.step('Verify trash can icon', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await expect(
        await page.locator(
          internalRecordPage.elements.trashIconForFieldName.selector(
            fieldInput1,
          ),
        ),
      ).toBeVisible();
    });
  });
});
