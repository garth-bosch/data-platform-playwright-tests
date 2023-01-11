import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultPayloadForRenewal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {StepTypeID} from '@opengov/cit-base/build/api-support/api/recordStepsApi';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspections related', () => {
  let recTypeNo, workFlowApproval;

  test.beforeEach(
    async ({employeeAppUrl, recordTypesApi, page, recordTypeWorkflowApi}) => {
      await test.step('Create a Record Type', async () => {
        recTypeNo = await recordTypesApi.createRecordType(
          'AT_Employee_CanEdit',
          'Test Department',
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Edit'],
            workflowStepsToAdd: {
              inspection: true,
            },
          },
        );
        await page.goto(employeeAppUrl);
        const renewPay = JSON.parse(JSON.stringify(defaultPayloadForRenewal));
        renewPay.recordType.renews = true;
        await recordTypeWorkflowApi.setRecordTypeToRenewalFlowsOnOff(renewPay);
        workFlowApproval = {
          templateStep: {
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: `Custom_Inspection_Approval_${faker.random.alphaNumeric(4)}`,
            helpText: 'Custom_help_text_for_approval',
            showToPublic: true,
            stepTypeID: StepTypeID.Inspection,
            isRenewal: true,
          },
        };
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
      });
    },
  );

  test('Admin can delete preloaded inspection type - Renewal @OGT-45693 @Xoriant_Test', async ({
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    page,
  }) => {
    const testName = `@OGT-45693`;
    const givenWorkflowExisting =
      baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep.label;
    const givenWorkFlowNew = `${testName}_Workflow_${faker.random.alphaNumeric(
      4,
    )}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Add New step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        givenWorkFlowNew,
      );
    });
    await test.step('Remove old step and verify', async () => {
      await renewalWorkflowDesignerPage.removeStepByStepName(
        givenWorkflowExisting,
      );
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
      const isOldStepOn = await page
        .locator(
          renewalWorkflowDesignerPage.elements.stepNamesList.selector(
            givenWorkflowExisting,
          ),
        )
        .isVisible();
      expect(isOldStepOn).toBeFalsy();
    });
    await test.step('Verify New step still exists', async () => {
      await renewalWorkflowDesignerPage.clickOnStepName(givenWorkFlowNew);
    });
  });
});
