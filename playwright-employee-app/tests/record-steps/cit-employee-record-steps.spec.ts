import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {
  RecordStatus,
  RecordStep,
  RecordStepStatus,
} from '../../src/pages/ea-record-page';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Payment @records @record-steps', () => {
  test.beforeEach(async ({createRecordPage, page, employeeAppUrl}) => {
    await test.step('Start a record draft', async () => {
      await page.goto(employeeAppUrl);
      await createRecordPage.startDraftRecordFor(
        TestDepartments.Test_Department,
        TestRecordTypes.Record_Steps_Parallel.name,
      );
    });
  });

  test('Inactive steps do not auto activate when record has Rejected step @OGT-45958 @broken_test', async ({
    formsPage,
    createRecordPage,
    recordPage,
  }) => {
    await test.step('Activate parallel record steps in record', async () => {
      await formsPage.toggleCheckboxFormField('Approval');
      await formsPage.toggleCheckboxFormField('Inspection');
      await formsPage.toggleCheckboxFormField('Payment', true);
      await createRecordPage.saveRecord();
    });

    await test.step('Validate parallel steps are activated', async () => {
      await recordPage.clickRecordStepName('Approval');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.In_Progress);
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.In_Progress);
      await recordPage.clickRecordStepName('Payment');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Due_Now);
      await recordPage.validateRecordStatus(RecordStatus.Active);
    });

    await test.step('Manually set a parallel step to Inactive', async () => {
      await recordPage.changeRecordWorkflowStepStatus(
        'Approval',
        RecordStepStatus.Active,
        RecordStepStatus.Inactive,
      );
      await recordPage.validateRecordStatus(RecordStatus.Active);
    });

    await test.step('Reject a record step', async () => {
      await recordPage.changeRecordWorkflowStepStatus(
        'Inspection',
        RecordStepStatus.Active,
        RecordStepStatus.Reject,
      );
      await recordPage.validateRecordStatus(RecordStatus.Stopped);
    });

    await test.step('Validate inactive step remains inactive', async () => {
      await recordPage.clickRecordStepName('Approval');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Review);
    });

    await test.step('Add an Adhoc step', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
      );
      await recordPage.clickRecordStepName('Adhoc-Inspection');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.In_Progress);
    });

    await test.step('Validate inactive step remains inactive and record status remains STOPPED', async () => {
      await recordPage.clickRecordStepName('Approval');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Review);
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Rejected);
      await recordPage.validateRecordStatus(RecordStatus.Stopped);
    });
  });
});

test.describe('Employee App - Record Steps @records @record-steps', () => {
  let recordTypeName;
  test.beforeEach(
    async ({
      recordTypesApi,
      recordTypeWorkflowApi,
      recordsApi,
      internalRecordPage,
    }) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-34493 ${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add workflow steps', async () => {
        const workFlowApproval = {
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
        workFlowApproval.templateStep.orderNo = 2;
        workFlowApproval.templateStep.sequence = 1;
        workFlowApproval.templateStep.label = 'Custom Inspection 1';
        workFlowApproval.templateStep.stepTypeID = 2;
        await recordTypeWorkflowApi.addWorkflowToRecordType(workFlowApproval);
        workFlowApproval.templateStep.orderNo = 3;
        workFlowApproval.templateStep.sequence = 0;
        workFlowApproval.templateStep.label = 'Custom Inspection 2';
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
        await internalRecordPage.navigateById(baseConfig.citTempData.recordId);
      });
    },
  );

  test('Parallel steps must trigger (become active) at the same time @OGT-34493 @Xoriant_Test', async ({
    internalRecordPage,
    page,
  }) => {
    await test.step('Verify parallel record steps in record are Inactive', async () => {
      expect(
        await page
          .locator(
            internalRecordPage.elements.stepIcon.selector(
              'Custom Inspection 1',
            ),
          )
          .getAttribute('class'),
      ).not.toContain('active');
      expect(
        await page
          .locator(
            internalRecordPage.elements.stepIcon.selector(
              'Custom Inspection 2',
            ),
          )
          .getAttribute('class'),
      ).not.toContain('active');
    });
    await test.step('Complete the Approval Step', async () => {
      await internalRecordPage.clickRecordStepName('Custom Approval');
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Complete,
      );
    });

    await test.step('Validate parallel steps are activated', async () => {
      await page.reload();
      expect(
        await page
          .locator(
            internalRecordPage.elements.stepIcon.selector(
              'Custom Inspection 1',
            ),
          )
          .getAttribute('class'),
      ).toContain('active');
      expect(
        await page
          .locator(
            internalRecordPage.elements.stepIcon.selector(
              'Custom Inspection 2',
            ),
          )
          .getAttribute('class'),
      ).toContain('active');
    });
  });
});

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Workflow record steps @records @record-steps', () => {
  test.beforeEach(async ({recordsApi, recordPage}) => {
    await test.step('Create a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
      await recordPage.proceedToRecordById(baseConfig.citTempData.recordId);
    });
  });

  test('Record steps should proceed according to their workflow design automatically @OGT-33553 @Xoriant_Test', async ({
    recordPage,
  }) => {
    const stepStatuses = [
      {
        recordStepName: 'Approval',
        statusBefore: RecordStepStatus.Active,
        statusAfter: RecordStepStatus.Complete,
      },
      {
        recordStepName: 'Inspection',
        statusBefore: RecordStepStatus.Inactive,
        statusAfter: RecordStepStatus.Active,
      },
    ];
    for (const stepStatus of stepStatuses) {
      await test.step('Validate step status according to workflow design', async () => {
        await recordPage.clickRecordStepName(stepStatus.recordStepName);
        await recordPage.validateWorkflowStepStatus(stepStatus.statusBefore);
      });
    }
    await test.step('Manually set a step to Completed', async () => {
      await recordPage.changeRecordWorkflowStepStatus(
        'Approval',
        RecordStepStatus.Active,
        RecordStepStatus.Complete,
      );
    });
    for (const stepStatus of stepStatuses) {
      await test.step('Validate step status according to workflow design', async () => {
        await recordPage.clickRecordStepName(stepStatus.recordStepName);
        await recordPage.validateWorkflowStepStatus(stepStatus.statusAfter);
      });
    }
  });

  test('Verify workflow step status to be stopped after selecting Reject status in the status selector menu for an Inspection or Approval step to a Rejected status @OGT-34290 @Xoriant_Test', async ({
    recordPage,
  }) => {
    await test.step('Open an Approval workflow step', async () => {
      await recordPage.clickRecordStepName('Approval');
    });
    await test.step('Manually set the step status to Reject', async () => {
      await recordPage.changeRecordWorkflowStepStatus(
        'Approval',
        RecordStepStatus.Active,
        RecordStepStatus.Reject,
      );
    });
    await test.step('Validate the next step has not been activated', async () => {
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.validateWorkflowStepStatus(RecordStepStatus.Inactive);
    });
    await test.step('Validate the record overall status is Stopped', async () => {
      await recordPage.validateRecordStatus('Stopped');
    });
  });
});
