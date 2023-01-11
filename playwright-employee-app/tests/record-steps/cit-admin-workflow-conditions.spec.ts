import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Record Steps @records @record-steps', () => {
  let recordTypeName, workFlowApproval;
  test.beforeEach(
    async ({
      recordTypesApi,
      recordTypeWorkflowApi,
      recordsApi,
      internalRecordPage,
      page,
      employeeAppUrl,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      workflowDesignerPage,
    }) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-34496 ${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add Single Entry Form Section and Number form field to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel =
          'Single Entry Section';
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        defaultFormSectionObject.formSection.sectionType = 0;
        await recordTypesApi.addFormSection(defaultFormSectionObject);
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          'Number Field';
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add workflow steps', async () => {
        workFlowApproval = {
          templateStep: {
            template_StepID: null,
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: 'Custom Approval',
            helpText: 'Custom help text for approval',
            showToPublic: true,
            stepTypeID: 1,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
      await test.step('Navigate to settings', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recordTypeName);
      });
      await test.step('Go to Workflow tab', async () => {
        await recordTypesSettingsPage.proceedToWorkflowTab();
      });
      await test.step('Add Number Condition on Approval Workflow Step', async () => {
        await workflowDesignerPage.clickStepByName(
          workFlowApproval.templateStep.label,
        );
        await workflowDesignerPage.addGenericConditionToWorkflow(
          defaultPayloadForFormFieldsObject.data.attributes.fieldLabel,
          'is ...',
          'number',
          '5',
        );
      });
      await test.step('Create a Record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
          null,
          null,
        );
        await internalRecordPage.navigateById(baseConfig.citTempData.recordId);
      });
    },
  );

  test('Number condition for record steps is honored. @OGT-34496 @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Verify Workflow Step is not displayed', async () => {
      await internalRecordPage.verifyCustomStepVisibility(
        workFlowApproval.templateStep.label,
        false,
      );
    });
    await test.step('Enter the value in form field and save', async () => {
      await internalRecordPage.editAndSaveFormField(
        defaultFormSectionObject.formSection.sectionLabel,
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel,
        '5',
      );
    });
    await test.step('Verify Workflow Step is displayed', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.verifyCustomStepVisibility(
        workFlowApproval.templateStep.label,
        true,
      );
    });
  });
});
