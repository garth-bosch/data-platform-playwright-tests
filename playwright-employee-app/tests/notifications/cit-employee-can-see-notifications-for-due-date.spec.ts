import {test} from '../../src/base/base-test';
import {expect} from '@playwright/test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  DeadlineTypeID,
  StepTypeID,
} from '@opengov/cit-base/build/api-support/api/recordStepsApi';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Due dates related', () => {
  let workFlowApproval;
  const recTypeName = `DueDates_${faker.random.alphaNumeric(5)}`;
  test(
    `Employees receive browser notifications for due date approaching or past due` +
      `@known_defect @OGT-44218 @broken_test @ESN-6255 @Xoriant_test @defect:OGT-48285`,
    async ({
      page,
      employeeAppUrl,
      recordTypesApi,
      recordTypeWorkflowApi,
      recordPage,
      recordsApi,
      navigationBarPage,
    }) => {
      const helpTextGivenApproval = `Custom_help_text_for_approval`;
      const worklflowLabel = `Custom_Approval_${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type with approval and due date', async () => {
        await test.setTimeout(180 * 1000);
        await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
          publish: true,
        });
        await page.goto(employeeAppUrl);
        const workFlowApproval = {
          templateStep: {
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: worklflowLabel,
            helpText: helpTextGivenApproval,
            showToPublic: true,
            stepTypeID: StepTypeID.Approval,
            isRenewal: false,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
      await test.step('Update the record to have due date conditions', async () => {
        workFlowApproval = {
          templateStep: {
            template_StepID: String(
              baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep
                .template_StepID,
            ),
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            recordType: String(baseConfig.citTempData.recordTypeId),
            stepTypeID: StepTypeID.Approval,
            isRenewal: false,
            helpText: helpTextGivenApproval,
            label: worklflowLabel,
            deadlineAlerts: true,
            deadlineEnabled: true,
            deadlineTypeID: DeadlineTypeID.DaysAfterStepAssignment,
            deadlineDays: 0,
          },
        };
        await recordTypeWorkflowApi.updateWorkflowForRecordType(
          workFlowApproval,
        );
      });
      await test.step('Start record and navigate there', async () => {
        await recordsApi.createRecordWith({
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        });
        await recordPage.proceedToRecordByUrl();
      });
      await test.step('Assign user to custom step', async () => {
        await recordPage.clickCustomStepByName(worklflowLabel);
        await recordPage.assignStepToUserByEmail(
          baseConfig.citTestData.citAdminEmail,
        );
      });
      await test.step('Navigate to Inbox and verify due dates', async () => {
        // if this passes then you need to update the test to include the entire notification
        const text = await navigationBarPage.getNotifications();
        expect(text).toContain('requires your attention');
      });
    },
  );
});
