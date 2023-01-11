import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Workflow related @records @record-steps', () => {
  let recTypeNo;
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;
  test.beforeEach(async ({employeeAppUrl, recordTypesApi, page}) => {
    await test.step('Create a Record Type', async () => {
      recTypeNo = await recordTypesApi.createRecordType(recTypeName);
      await page.goto(employeeAppUrl);
    });
  });

  test('Admin can set up workflows sequentially - Inspection - Renewal @OGT-45574 @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
  }) => {
    const testName = `@OGT-45574`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn();
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc);
    });
    await test.step('Add one more with sequence', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc2,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc2);
    });
    await test.step('Verify not parallel', async () => {
      await page.isHidden(
        renewalWorkflowDesignerPage.elements.sequenceStepsIndicator,
        {timeout: 6000},
      );
    });
  });
  test('Admin can set up workflows to be parallel - Inspection - Renewal @OGT-45579 @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
  }) => {
    const testName = `@OGT-45579`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn();
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc);
    });
    await test.step('Add one more with Parallel', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc2,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(
        updatedNameSequenc2,
        false,
      );
    });
    await test.step('Verify not parallel', async () => {
      await page.isVisible(
        renewalWorkflowDesignerPage.elements.sequenceStepsIndicator,
      );
    });
  });
  test('Admin can toggle renewal workflow On/Off - Renewal @OGT-44343 @Xoriant_Test', async ({
    page,
    recordStepsApi,
    recordPage,
    recordsApi,
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    internalRecordPage,
  }) => {
    const testName = `@OGT-44343`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedStepNameForRecord = `${updatedNameSequenc2}-seq-${faker.random.alphaNumeric(
      4,
    )}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn(true);
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
    });
    await test.step('Add one more with Parallel', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc2,
      );
    });
    await test.step('Reload page', async () => {
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
    });
    await test.step('Set Renewal off/Verify state', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn(false);
      await page
        .locator(
          renewalWorkflowDesignerPage.elements.stepNamesList.selector(
            updatedNameSequenc,
          ),
        )
        .isHidden();
      await page
        .locator(
          renewalWorkflowDesignerPage.elements.stepNamesList.selector(
            updatedNameSequenc2,
          ),
        )
        .isHidden();
    });
    await test.step('Reload page', async () => {
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
    });
    await test.step('Set Renewal on/Verify state', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn(true);
      await page
        .locator(
          renewalWorkflowDesignerPage.elements.stepNamesList.selector(
            updatedNameSequenc,
          ),
        )
        .isVisible();
      await page
        .locator(
          renewalWorkflowDesignerPage.elements.stepNamesList.selector(
            updatedNameSequenc2,
          ),
        )
        .isVisible();
    });
    await test.step('Add a record and check renewal available for record', async () => {
      await recordsApi.createRecordWith({name: recTypeName, id: recTypeNo});
      await recordStepsApi.addInspectionStep(updatedStepNameForRecord, 2);
      await internalRecordPage.proceedToRecordByUrl();
      await recordPage.clickRecordRenewal(true);
    });
    await test.step('Set Renewal off', async () => {
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
      await renewalWorkflowDesignerPage.setRenewalOn(false);
    });
    await test.step('Check record for renewal off for record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await recordPage.clickRecordRenewal(true, false);
    });
  });
  test('Verify Employee users unable to update all workflow steps to be Inactive at the same time @OGT-46023 @Xoriant_Test', async ({
    recordStepsApi,
    navigationBarPage,
    recordTypesSettingsPage,
    recordsApi,
    page,
    renewalWorkflowDesignerPage,
    internalRecordPage,
  }) => {
    const testName = `@OGT-46023`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedStepNameForRecord = `${updatedNameSequenc2}-${faker.random.alphaNumeric(
      4,
    )}`;
    const updatedStepNameForRecord2 = `${updatedNameSequenc2}-${faker.random.alphaNumeric(
      4,
    )}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn();
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
    });
    await test.step('Add one more', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'approval',
        updatedNameSequenc2,
      );
    });
    await test.step('Add a record  and steps', async () => {
      await recordsApi.createRecordWith({name: recTypeName, id: recTypeNo});
      await recordStepsApi.addInspectionStep(updatedStepNameForRecord, 1);
      await recordStepsApi.addApprovalStep(updatedStepNameForRecord2, 1);
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Deactivate one step', async () => {
      await internalRecordPage.clickCustomStepByName(updatedStepNameForRecord);
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Inactive,
      );
    });
    await test.step('Deactivate another step and verify record status and tooltip', async () => {
      await internalRecordPage.clickCustomStepByName(updatedStepNameForRecord2);
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Inactive,
      );
      await internalRecordPage.verifyRecordStepStatusIs(
        RecordStepStatus.In_Progress,
      );
      await page.click(internalRecordPage.elements.statusFilter);
      const givenInactiveButton = await page
        .locator(
          internalRecordPage.elements.statusFilterValue.selector(
            RecordStepStatus.Inactive,
          ),
        )
        .getAttribute('data-hint');
      await expect(givenInactiveButton.toString()).toContain(
        'All workflow steps cannot be inactive at the same time.',
      );
    });
  });

  test('Admin allow/disallow print at home feature for documents - Renewal @OGT-45705 @Xoriant_Test', async ({
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
  }) => {
    await test.step('Navigate to the Record type. Open the Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Turn on the Renewal workflow', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn(true);
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'document',
        'Custom Document',
      );
      await renewalWorkflowDesignerPage.clickOnStepName('Custom Document');
    });
    await test.step('Verify there is an option "Allow Print-at-Home" present and disabled', async () => {
      await expect(
        renewalWorkflowDesignerPage.page.locator(
          renewalWorkflowDesignerPage.elements.publicCanPrintOption,
        ),
      ).not.toBeChecked();
    });
  });

  test('Deadlines may be X days after activation, or X days after record submission - Renewal @OGT-33924 @Xoriant_Test', async ({
    recordTypesSettingsPage,
    renewalWorkflowDesignerPage,
    baseConfig,
  }) => {
    const workflowStepName = `Custom_Approval_${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to created record type', async () => {
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(
        baseConfig.citTempData.recordTypeId,
      );
    });
    await test.step('Add new Workflow step on Renewal tab', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'approval',
        workflowStepName,
      );
    });
    await test.step('Open created workflow step', async () => {
      await renewalWorkflowDesignerPage.clickOnStepName(workflowStepName);
    });
    await test.step('Click on due date settings toggle', async () => {
      await renewalWorkflowDesignerPage.clickOnDueDateCheckBox();
    });
    const dueDateOptions = [
      'days after record submission',
      'days after step activation',
      'days after step assignment',
    ];
    for (const optionLabel of dueDateOptions) {
      await test.step(`Choose due date option [${optionLabel}]`, async () => {
        await renewalWorkflowDesignerPage.selectDueDateOptionByLabel(
          optionLabel,
        );
      });
    }
  });
});
