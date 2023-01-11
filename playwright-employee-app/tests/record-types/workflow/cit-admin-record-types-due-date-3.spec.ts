import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {defaultPayloadForRenewal} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {StepTypeID} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Due dates related', () => {
  let workFlowApproval;
  const recTypeName = `DueDates_${faker.random.alphaNumeric(5)}`;
  test('Verify Due date for Payment Step @OGT-34274 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const totalDays = 5;
    const helpTextGivenPayment = `Custom_help_text_for_Payment`;
    await test.step('Create a Record Type with Payment and due date', async () => {
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
          label: `Custom_Payment_${faker.random.alphaNumeric(4)}`,
          helpText: helpTextGivenPayment,
          showToPublic: true,
          stepTypeID: StepTypeID.Payment,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there', async () => {
      await recordsApi.createRecordWith(
        {
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Custom_Payment');
      await recordPage.addDueDateForWorkflowSteps(
        baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep.label,
        totalDays,
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
  test('Verify Due date for Step - approval @OGT-47861 @broken_test @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const totalDays = 5;
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
          label: `Custom_Payment_${faker.random.alphaNumeric(4)}`,
          helpText: helpTextGivenApproval,
          showToPublic: true,
          stepTypeID: StepTypeID.Approval,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there - approval', async () => {
      await recordsApi.createRecordWith(
        {
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Custom_Payment');
      await recordPage.addDueDateForWorkflowSteps(
        baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep.label,
        totalDays,
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
  test('Verify Due date for  Step - inspection @OGT-47862 @broken_test @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    navigationBarPage,
    page,
    employeeAppUrl,
    recordTypesApi,
    recordTypeWorkflowApi,
    recordPage,
    recordsApi,
    inboxPage,
  }) => {
    const totalDays = 5;
    const helpTextGivenInspection = `Custom_help_text_for_Inspection`;
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
          label: `Custom_Payment_${faker.random.alphaNumeric(4)}`,
          helpText: helpTextGivenInspection,
          showToPublic: true,
          stepTypeID: StepTypeID.Inspection,
          isRenewal: false,
        },
      };
      await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
    });
    await test.step('Start record and navigate there - Inspection', async () => {
      await recordsApi.createRecordWith(
        {
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Custom_Inspection');
      await recordPage.addDueDateForWorkflowSteps(
        baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep.label,
        totalDays,
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
