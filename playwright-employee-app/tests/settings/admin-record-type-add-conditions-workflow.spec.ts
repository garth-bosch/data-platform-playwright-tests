import {test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ADMIN_SESSION,
  CitEntityType,
} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('admin can add conditions @workflow-conditions', () => {
  let recordTypeName, workFlowApproval, locationFlag, userFlag;
  test('Admin can add conditions on the API workflow step type @OGT-33771 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    baseConfig,
    recordTypeWorkflowApi,
    systemSettingsPage,
    recordTypesSettingsPage,
    workflowDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type and Location flag', async () => {
      recordTypeName = `@OGT-33771 ${faker.random.alphaNumeric(4)}`;
      locationFlag = `@OGT-33771 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
    await test.step('Add a workflow step', async () => {
      workFlowApproval = {
        templateStep: {
          template_StepID: null,
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          label: 'Custom API Integration',
          helpText: 'Custom help text for API Integration',
          showToPublic: true,
          stepTypeID: 9,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and API Integration step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add a condition on API Integration workflow step and verify', async () => {
      await workflowDesignerPage.addGenericConditionToWorkflow(
        'Location Flag',
        locationFlag,
      );
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${workFlowApproval.templateStep.recordTypeID}/workflow`,
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });

  test('Admin can add conditions on the Approval workflow step type @OGT-33721 @Xoriant_Test  @smoke', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    baseConfig,
    recordTypeWorkflowApi,
    systemSettingsPage,
    recordTypesSettingsPage,
    workflowDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type and User flag', async () => {
      recordTypeName = `@OGT-33721 ${faker.random.alphaNumeric(4)}`;
      userFlag = `@OGT-33721 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
    });
    await test.step('Add a workflow step', async () => {
      workFlowApproval = {
        templateStep: {
          template_StepID: null,
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          label: 'Custom Approval',
          helpText: 'Custom help text for Approval',
          showToPublic: true,
          stepTypeID: 1,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and Approval step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add a condition on Approval workflow step and verify', async () => {
      await workflowDesignerPage.addGenericConditionToWorkflow(
        'User Flag',
        userFlag,
      );
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${workFlowApproval.templateStep.recordTypeID}/workflow`,
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });

  test('Admin can add conditions on the Document workflow step type @OGT-33724 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    baseConfig,
    recordTypeWorkflowApi,
    systemSettingsPage,
    recordTypesSettingsPage,
    workflowDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type and Location flag', async () => {
      recordTypeName = `@OGT-33724 ${faker.random.alphaNumeric(4)}`;
      locationFlag = `@OGT-33724 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
    await test.step('Add a workflow step', async () => {
      workFlowApproval = {
        templateStep: {
          template_StepID: null,
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          label: 'Custom Document',
          helpText: 'Custom help text for Document',
          showToPublic: true,
          stepTypeID: 5,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and Document step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add a condition on Document workflow step and verify', async () => {
      await workflowDesignerPage.addGenericConditionToWorkflow(
        'Location Flag',
        locationFlag,
      );
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${workFlowApproval.templateStep.recordTypeID}/workflow`,
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });
  test('Admin can add conditions on the Inspection workflow step type @OGT-33722 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    baseConfig,
    recordTypeWorkflowApi,
    systemSettingsPage,
    recordTypesSettingsPage,
    workflowDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type and User flag', async () => {
      recordTypeName = `@OGT-33722 ${faker.random.alphaNumeric(4)}`;
      userFlag = `@OGT-33722 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
    });
    await test.step('Add a workflow step', async () => {
      workFlowApproval = {
        templateStep: {
          template_StepID: null,
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          label: 'Custom Inspection',
          helpText: 'Custom help text for Inspection',
          showToPublic: true,
          stepTypeID: 5,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and Inspection step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add a condition on Inspection workflow step and verify', async () => {
      await workflowDesignerPage.addGenericConditionToWorkflow(
        'User Flag',
        userFlag,
      );
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${workFlowApproval.templateStep.recordTypeID}/workflow`,
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });
  test('Admin can add conditions on the Payment workflow step type @OGT-33723 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    baseConfig,
    recordTypeWorkflowApi,
    systemSettingsPage,
    recordTypesSettingsPage,
    workflowDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type and Location flag', async () => {
      recordTypeName = `@OGT-33723 ${faker.random.alphaNumeric(4)}`;
      locationFlag = `@OGT-33723 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
    await test.step('Add a workflow step', async () => {
      workFlowApproval = {
        templateStep: {
          template_StepID: null,
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          label: 'Custom Payment',
          helpText: 'Custom help text for Payment',
          showToPublic: true,
          stepTypeID: 2,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and Payment step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add a condition on Payment workflow step and verify', async () => {
      await workflowDesignerPage.addGenericConditionToWorkflow(
        'Location Flag',
        locationFlag,
      );
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${workFlowApproval.templateStep.recordTypeID}/workflow`,
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });

  test('Admin can add ad hoc document step when there are many document templates in a Record Type @OGT-33914 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    baseConfig,
    recordsApi,
    recordPage,
    internalRecordPage,
  }) => {
    let recordTypeID;
    const first = 'First Doc Title';
    const second = 'Second Doc Title';
    const third = 'Third Doc Title';
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33914 ${faker.random.alphaNumeric(4)}`;
      recordTypeID = await recordTypesApi.createRecordType(
        recordTypeName,
        'Test Department',
        {
          publish: true,
          employeeAccess: RecordTypeAccess['Can Edit'],
        },
      );
    });
    await test.step('Add multiple Documents and create Record', async () => {
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: first,
          recordTypeID: recordTypeID,
        },
      });
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: second,
          recordTypeID: recordTypeID,
        },
      });
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: third,
          recordTypeID: recordTypeID,
        },
      });
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Navigate to record page', async () => {
      await page.goto(employeeAppUrl);

      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
    });
    await test.step(' Add Document Step / template First', async () => {
      await recordPage.addDocumentStep();
      await internalRecordPage.addDocumentTemplate(first, false);
    });
    await test.step(' Add Document Step / template Second', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await recordPage.addDocumentStep();
      await internalRecordPage.addDocumentTemplate(second, false);
    });
    await test.step('Verify individually all steps', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordStepName(first);
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordStepName(second);
    });
  });
});
