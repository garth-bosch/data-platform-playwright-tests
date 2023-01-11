import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings', () => {
  let recordTypeName, workFlowApproval;

  test.beforeEach(
    async ({
      recordTypesApi,
      baseConfig,
      employeeAppUrl,
      page,
      navigationBarPage,
      recordTypeWorkflowApi,
    }) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-33725 ${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add a workflow step', async () => {
        workFlowApproval = {
          templateStep: {
            template_StepID: null,
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: 'Custom Workflow Approval',
            helpText: 'Custom help text for approval',
            showToPublic: true,
            stepTypeID: 1,
            orderNo: 1,
            sequence: 1,
            isEnabled: 1,
            isRenewal: false,
            deadlineEnabled: false,
            deadlineAutoCompletes: false,
            deadlineAlerts: false,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
      await test.step('Navigate to workflow settings', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
    },
  );

  test('Conditions can be added to auto user assignments for record steps @OGT-33725 @Xoriant_Test', async ({
    recordTypesSettingsPage,
    systemSettingsPage,
    workflowDesignerPage,
  }) => {
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Workflow tab and select step', async () => {
      await recordTypesSettingsPage.proceedToWorkflowTab();
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
    });
    await test.step('Add condition and verify the same', async () => {
      await workflowDesignerPage.addConditionToAutoAssignUser(
        'api_employee@opengov.com',
        'API Employee',
        'Location Flag',
      );
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await workflowDesignerPage.checkConditionExists();
    });
  });
});
