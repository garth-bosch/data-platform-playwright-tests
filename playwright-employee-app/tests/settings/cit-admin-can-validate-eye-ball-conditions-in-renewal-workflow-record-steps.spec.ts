import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  defaultPayloadForRenewal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {RecordStepStatus} from '../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Renewal Workflow with conditions', () => {
  let recordTypeName: string,
    fieldInput1: string,
    conditionalFieldOutput: string,
    sectionName: string;
  const addStepName = `@OGT-Xoriant_Workflow_${faker.random.alphaNumeric(4)}`;
  const conditionValue = 'is greater than or equal to ...';
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
      renewalWorkflowDesignerPage,
      recordTypeWorkflowApi,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      fieldInput1 = `FieldInput1_${faker.random.alphaNumeric(4)}`;
      conditionalFieldOutput = `ConditionalField_${faker.random.alphaNumeric(
        4,
      )}`;
      sectionName = `Section ${faker.random.alphaNumeric(4)}`;
      const renewPay = JSON.parse(JSON.stringify(defaultPayloadForRenewal));
      renewPay.recordType.renews = true;
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(
          recordTypeName,
          'Test Department',
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Edit'],
          },
        );
      });
      await recordTypeWorkflowApi.setRecordTypeToRenewalFlowsOnOff(renewPay);
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

      await test.step('Go to Renewal tab and select step', async () => {
        await recordTypeWorkflowApi.addWorkflowToRecordType;
        await recordTypesSettingsPage.proceedToRenewalTab();
      });
      await test.step('Add new renewal step', async () => {
        await renewalWorkflowDesignerPage.addNewStepRenewal(
          'approval',
          addStepName,
        );
      });
      await test.step('Open approval step', async () => {
        await renewalWorkflowDesignerPage.clickOnStepName(addStepName);
      });
      await test.step('Add renewal workflow with condition', async () => {
        renewalWorkflowDesignerPage.addGenericConditionToRenewalWorkflow(
          conditionalFieldOutput,
          conditionValue,
          'number',
          '1',
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
    },
  );

  test("Fields with eyeball icon don't have values count towards conditions on Renewal Workflow Steps @OGT-44861 @Xoriant_Test", async ({
    internalRecordPage,
    recordPage,
    page,
  }) => {
    await test.step('Go to record and fulfill the conditions on form fields', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '3',
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '5',
      );
      await recordPage.validateFormFieldValueOnRecord(
        conditionalFieldOutput,
        sectionName,
        '5',
      );
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
      );
    });
    await test.step('validate approval step does not exists on record', async () => {
      await internalRecordPage.verifyCustomStepVisibility(addStepName, false);
    });
    await test.step('Create a renewal record', async () => {
      await recordPage.startDraftRecordRenewal();
      await recordPage.submitRenewalRecord();
    });
    await test.step('validate approval step exists on renewal record', async () => {
      await internalRecordPage.verifyCustomStepVisibility(addStepName);
    });
    await test.step('un-fulfill the conditions on renewal record form fields', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '0',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
        true,
      );
    });
    await test.step('validate approval step doesnot exist on renewal record', async () => {
      await internalRecordPage.verifyCustomStepVisibility(addStepName, false);
    });
    await test.step('fulfill the conditions on renewal record form fields', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '3',
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '5',
      );
      await recordPage.validateFormFieldValueOnRecord(
        conditionalFieldOutput,
        sectionName,
        '5',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
      );
    });
    await test.step('Complete approval step on renewal record', async () => {
      await internalRecordPage.clickCustomStepByName(addStepName);
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Complete,
      );
    });
    await test.step('un-fulfill the conditions on renewal record form fields', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '0',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
        true,
      );
    });
    await test.step('validate approval step does exist on renewal record even though condition not met', async () => {
      await internalRecordPage.verifyCustomStepVisibility(addStepName);
      await recordPage.clickCustomStepByName(addStepName);
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Completed);
    });
  });
});
