import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {defaultPayloadForRenewal} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {StepTypeID} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {expect} from '@playwright/test';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Due dates related', () => {
  let workFlowApproval;
  const recTypeName = `DueDates_${faker.random.alphaNumeric(5)}`;
  const dueDateTypes = {
    'days after step activation': '1',
    'days after step assignment': '2',
    'days after record submission': '3',
  };
  test.beforeEach(
    async ({
      navigationBarPage,
      page,
      employeeAppUrl,
      recordTypesApi,
      recordTypeWorkflowApi,
      systemSettingsPage,
      recordTypesSettingsPage,
      workflowDesignerPage,
    }) => {
      const helpTextGivenApproval = `Custom_help_text_for_Approval`;
      await test.step('Create a Record Type with Approval and due date', async () => {
        await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
          publish: true,
        });
        await page.goto(employeeAppUrl);
        /*__ set to renew*/
        const renewPay = JSON.parse(JSON.stringify(defaultPayloadForRenewal));
        renewPay.recordType.renews = true;
        await recordTypeWorkflowApi.setRecordTypeToRenewalFlowsOnOff(renewPay);
        /*__ set to renew*/
        workFlowApproval = {
          templateStep: {
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: `Custom_Approval_${faker.random.alphaNumeric(4)}`,
            helpText: helpTextGivenApproval,
            showToPublic: true,
            stepTypeID: StepTypeID.Approval,
            isRenewal: false,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
      await test.step('Navigate to workflow settings', async () => {
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recTypeName);
      });
      await test.step('Go to Workflow tab and select step', async () => {
        await recordTypesSettingsPage.proceedToWorkflowTab();
        await workflowDesignerPage.clickStepByName(
          workFlowApproval.templateStep.label,
        );
      });
    },
  );
  test('Deadlines may be X days after activation, or X days after record submission @OGT-33744 @Xoriant_Test', async ({
    page,
    workflowDesignerPage,
  }) => {
    await test.step('set due date on workflow approval', async () => {
      await workflowDesignerPage.setDueDateRecordType(
        dueDateTypes['days after record submission'],
        workFlowApproval.templateStep.label,
        1,
      );
    });
    await test.step('Open the workflow Field and Verify Match Operator is selected successfully', async () => {
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await expect(
        page
          .locator(workflowDesignerPage.elements.stepDeadlineDropdown)
          .locator(
            `option[value="${await page
              .locator(workflowDesignerPage.elements.stepDeadlineDropdown)
              .inputValue()}"]`,
          ),
      ).toHaveText('days after record submission');
    });
  });
  test('Steps may autocomplete upon expiration @OGT-33745 @broken_test @Xoriant_Test', async ({
    recordsApi,
    workflowDesignerPage,
    internalRecordPage,
    recordPage,
    page,
  }) => {
    await test.step('set due date on workflow approval', async () => {
      await workflowDesignerPage.setDueDateRecordType(
        dueDateTypes['days after record submission'],
        workFlowApproval.templateStep.label,
        0,
      );
    });
    await test.step('Open the workflow Field and Verify Match Operator is selected successfully', async () => {
      await workflowDesignerPage.clickStepByName(
        workFlowApproval.templateStep.label,
      );
      await expect(
        page
          .locator(workflowDesignerPage.elements.stepDeadlineDropdown)
          .locator(
            `option[value="${await page
              .locator(workflowDesignerPage.elements.stepDeadlineDropdown)
              .inputValue()}"]`,
          ),
      ).toHaveText('days after record submission');
    });
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName(
        workFlowApproval.templateStep.label,
      );
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Completed);
    });
  });
});
