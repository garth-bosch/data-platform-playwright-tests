import {test, expect} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Record Steps @records @record-steps', () => {
  let recordTypeName, workFlowApproval;
  test.beforeEach(
    async ({
      recordTypesApi,
      recordTypeWorkflowApi,
      recordsApi,
      internalRecordPage,
    }) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-34497 ${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add workflow steps', async () => {
        workFlowApproval = {
          templateStep: {
            template_StepID: null,
            recordTypeID: Number(baseConfig.citTempData.recordTypeId),
            label: 'Custom Approval',
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
      await test.step('Create and navigate to Record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
          null,
          null,
        );
        await internalRecordPage.navigateById(baseConfig.citTempData.recordId);
      });
    },
  );

  test('Verify that workflow steps show help text on both sides of the application @OGT-34497 @Xoriant_Test', async ({
    internalRecordPage,
    page,
  }) => {
    await test.step('Navigate to Added Approval step', async () => {
      await internalRecordPage.clickRecordStepName('Custom Approval');
    });
    await test.step('Verify Help Text is present on the Approval Step', async () => {
      await expect(
        page.locator(`text=${workFlowApproval.templateStep.helpText}`),
      ).toBeVisible();
    });
  });
});
