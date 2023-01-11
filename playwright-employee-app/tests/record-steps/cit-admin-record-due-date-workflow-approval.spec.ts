import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {defaultPayloadForRenewal} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {StepTypeID} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {RecordStepStatus} from '../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Due dates workflow approval', () => {
  let workFlowApproval: any;
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
      recordsApi,
      internalRecordPage,
      recordPage,
    }) => {
      const helpTextGivenApproval = `Custom_help_text_for_Approval`;
      await test.step('Create a Record Type with Approval and due date', async () => {
        await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
          publish: true,
        });
        await page.goto(employeeAppUrl);
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
      });
      await test.step('Navigate to workflow settings', async () => {
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recTypeName);
      });
      await test.step('Go to Workflow tab and select step', async () => {
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
        await recordTypesSettingsPage.proceedToWorkflowTab();
        await workflowDesignerPage.clickStepByName(
          workFlowApproval.templateStep.label,
        );
      });
      await test.step('set due date on workflow approval', async () => {
        await workflowDesignerPage.setDueDateRecordType(
          dueDateTypes['days after record submission'],
          workFlowApproval.templateStep.label,
          0,
          true,
        );
      });
      await test.step('Add a record', async () => {
        await recordsApi.createRecordWith({
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        });
        await internalRecordPage.proceedToRecordByUrl();
        await recordPage.clickCustomStepByName(
          workFlowApproval.templateStep.label,
        );
        await page.reload();
      });
    },
  );

  test('Approval steps set to Auto-complete on due date will auto-complete @OGT-44472 @broken_test @known_defect @Xoriant_Test @defect:OGT-48235', async ({
    recordPage,
  }) => {
    await test.step('open step and verify step status', async () => {
      await recordPage.clickCustomStepByName(
        workFlowApproval.templateStep.label,
      );
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Completed);
    });
  });
});
