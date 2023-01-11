import {test, expect} from '../../src/base/base-test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront App - Record Steps @records @record-steps', () => {
  let recordTypeName, workFlowApproval;
  test.beforeEach(
    async ({recordTypesApi, recordTypeWorkflowApi, recordsApi}) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-48084 ${faker.random.alphaNumeric(4)}`;
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
      await test.step('Create a Record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
          null,
          null,
        );
      });
    },
  );

  test('Verify that workflow steps show help text on both sides of the application @OGT-48084 @Xoriant_Test', async ({
    page,
    myAccountPage,
    storeFrontRecordPage,
  }) => {
    await test.step('Load submitted record in Storefront', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
    });
    await test.step('Open the Record Step', async () => {
      await storeFrontRecordPage.clickRecordStepByName('Custom Approval');
    });
    await test.step('Verify Help Text is present on the Approval Step', async () => {
      await expect(
        page.locator(`text=${workFlowApproval.templateStep.helpText}`),
      ).toBeVisible();
    });
  });
});
