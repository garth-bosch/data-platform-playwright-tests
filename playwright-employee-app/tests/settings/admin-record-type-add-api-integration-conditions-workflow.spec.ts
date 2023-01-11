import {expect, test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {StepTypeID} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {RecordStatus, RecordStepStatus} from '../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('admin can add merge tags on api integration workflow @workflow-conditions', () => {
  let recordTypeName, workFlowApproval, workFlowAPIIntegration;
  let salary: string, sectionName: string;
  let formFieldIdResult: any;
  test.beforeEach(
    async ({
      recordTypesApi,
      employeeAppUrl,
      page,
      navigationBarPage,
      baseConfig,
      recordTypeWorkflowApi,
      systemSettingsPage,
      recordTypesSettingsPage,
      workflowDesignerPage,
      formDesignerPage,
    }) => {
      recordTypeName = `@OGT-33774_${faker.random.alphaNumeric(4)}`;
      salary = `Salary_${faker.random.alphaNumeric(4)}`;
      sectionName = `Section ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type and Location flag', async () => {
        await recordTypesApi.createRecordType(
          recordTypeName,
          TestDepartments.Test_Department,
          {
            employeeAccess: RecordTypeAccess['Can Edit'],
          },
        );
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add Formfield Salary to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = salary;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${salary}`;
        formFieldIdResult = await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add a approval workflow step', async () => {
        workFlowApproval = {
          templateStep: {
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: `Custom_Approval`,
            helpText: 'Custom help text for Approval',
            showToPublic: true,
            stepTypeID: StepTypeID.Approval,
            isRenewal: false,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
      await test.step('Add a API Integration workflow step', async () => {
        workFlowAPIIntegration = {
          templateStep: {
            template_StepID: null,
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: 'Custom API Integration',
            helpText: 'Custom help text for API Integration',
            showToPublic: true,
            stepTypeID: 9,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(
          workFlowAPIIntegration,
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
      await test.step('Navigate to forms tab and get the formfield ID', async () => {
        await recordTypesSettingsPage.proceedToFormTab();
        await formDesignerPage.getFormFieldIdValue(salary, sectionName);
        await formDesignerPage.clickOnDone();
      });
      await test.step('Go to Workflow tab and API Integration step', async () => {
        await recordTypesSettingsPage.proceedToWorkflowTab();
        await workflowDesignerPage.clickStepByName(
          workFlowAPIIntegration.templateStep.label,
        );
      });
      await test.step('Add a request body and the URl on the API Integration Step', async () => {
        const requestPayload = `
      {
        "salary": {{FF${baseConfig.citTempData.formFieldId}}}
      }`;
        await workflowDesignerPage.fillApiIntegrationWorkflow(
          'https://dummy.restapiexample.com/api/v1/create',
          requestPayload,
        );
      });
      await test.step('publish recordType', async () => {
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
    },
  );

  test('Admin can verify the deleted/updated form fields attached to the request body @OGT-33774 @broken_test @Xoriant_Test', async ({
    page,
    internalRecordPage,
    recordsApi,
    baseConfig,
    recordTypesApi,
  }) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Go to record and fill salary formfield', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        salary,
        '2000',
      );
    });
    await test.step('delete salary formfield', async () => {
      await recordTypesApi.deleteFormField(formFieldIdResult);
    });
    await test.step('validate approval & API integration step exists on record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.verifyCustomStepVisibility(
        workFlowApproval.templateStep.label,
      );
      await internalRecordPage.verifyCustomStepVisibility(
        workFlowAPIIntegration.templateStep.label,
      );
    });
    await test.step('verify API integration status is pending', async () => {
      await internalRecordPage.clickCustomStepByName(
        workFlowAPIIntegration.templateStep.label,
      );
      await expect(
        page.locator(
          internalRecordPage.elements.submittedRecordIconStatus.selector(
            'pending',
          ),
        ),
      ).toBeVisible();
    });
    await test.step('Complete approval step', async () => {
      await internalRecordPage.clickCustomStepByName(
        workFlowApproval.templateStep.label,
      );
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Complete,
      );
    });
    await test.step('verify API integration status is complete and record status is complete', async () => {
      await internalRecordPage.clickCustomStepByName(
        workFlowAPIIntegration.templateStep.label,
      );
      await expect(
        page.locator(
          internalRecordPage.elements.submittedRecordIconStatus.selector(
            'complete',
          ),
        ),
      ).toBeVisible();
      await internalRecordPage.validateRecordStatus(RecordStatus.Complete);
    });
  });
});
