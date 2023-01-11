import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {defaultPayloadForRenewal} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {
  DeadlineTypeID,
  StepTypeID,
} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});

test.describe('Employee App - Due dates related', () => {
  let workFlowApproval;
  const totalDays = 3;
  const recTypeName = `DueDates_${faker.random.alphaNumeric(5)}`;
  test(' Verify due date in Approval record step after setting date in record type workflow steps @OGT-34276 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const helpTextGivenApproval = `Custom_help_text_for_approval`;
    await test.step('Create a Record Type with approval and due date', async () => {
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
    await test.step('Update the record to have due date conditions', async () => {
      /*__ set to renew*/
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
          deadlineAlerts: true,
          deadlineEnabled: true,
          deadlineTypeID: DeadlineTypeID.DaysAfterStepActivation,
          deadlineDays: totalDays,
        },
      };
      await recordTypeWorkflowApi.updateWorkflowForRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Default_Step_Approval');
      await recordPage.assignStepToUserByEmail(
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to Inbox and verify due dates', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.selectInboxRow();
      try {
        /*Todo temp until UTC fix*/
        const dueDateText = await inboxPage.calculateDueDate(totalDays);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      } catch (e) {
        const dueDateText = await inboxPage.calculateDueDate(totalDays - 1);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      }
    });
  });

  test('Verify due date in Inspection record step after setting date in record type workflow steps @OGT-34278 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const helpTextGivenInspection = `Custom_help_text_for_inspection`;
    await test.step('Create a Record Type with Inspection and due date', async () => {
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
          helpText: helpTextGivenInspection,
          showToPublic: true,
          stepTypeID: StepTypeID.Inspection,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Update the record to have due date conditions', async () => {
      /*__ set to renew*/
      workFlowApproval = {
        templateStep: {
          template_StepID: String(
            baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep
              .template_StepID,
          ),
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          recordType: String(baseConfig.citTempData.recordTypeId),
          stepTypeID: StepTypeID.Inspection,
          isRenewal: false,
          helpText: helpTextGivenInspection,
          deadlineAlerts: true,
          deadlineEnabled: true,
          deadlineTypeID: DeadlineTypeID.DaysAfterStepAssignment,

          deadlineDays: totalDays,
        },
      };
      await recordTypeWorkflowApi.updateWorkflowForRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Default_Step_Approval');
      await recordPage.assignStepToUserByEmail(
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to Inbox and verify due dates', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.selectInboxRow();
      try {
        /*Todo temp until UTC fix*/
        const dueDateText = await inboxPage.calculateDueDate(totalDays);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      } catch (e) {
        const dueDateText = await inboxPage.calculateDueDate(totalDays - 1);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      }
    });
  });

  test('Verify due date in Payment record step  after setting date in record type workflow steps @OGT-34277 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const helpTextGivenPayment = `Custom_help_text_for_Payment`;

    await test.step('Create a Record Type with Inspection and due date', async () => {
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
          label: `Custom_Inspection_${faker.random.alphaNumeric(4)}`,
          helpText: helpTextGivenPayment,
          showToPublic: true,
          stepTypeID: StepTypeID.Payment,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Update the record to have due date conditions', async () => {
      /*__ set to renew*/
      workFlowApproval = {
        templateStep: {
          template_StepID: String(
            baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep
              .template_StepID,
          ),
          recordTypeID: Number(baseConfig.citTempData.recordTypeId),
          recordType: String(baseConfig.citTempData.recordTypeId),
          stepTypeID: StepTypeID.Payment,
          isRenewal: false,
          helpText: helpTextGivenPayment,
          deadlineAlerts: true,
          deadlineEnabled: true,
          deadlineTypeID: DeadlineTypeID.DaysAfterRecordSubmission,
          deadlineDays: totalDays,
        },
      };
      await recordTypeWorkflowApi.updateWorkflowForRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Default_Step');
      await recordPage.assignApplicantToUserByEmail(
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to Inbox and verify due dates', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.selectInboxRow();
      try {
        /*Todo temp until UTC fix*/
        const dueDateText = await inboxPage.calculateDueDate(totalDays);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      } catch (e) {
        const dueDateText = await inboxPage.calculateDueDate(totalDays - 1);
        await expect(page.locator(inboxPage.elements.dueDateText)).toHaveText(
          dueDateText.replace('Due ', ''),
        );
      }
    });
  });
});
