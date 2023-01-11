import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  RecordStatus,
  RecordStep,
  RecordStepStatus,
} from '../../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Due dates related', () => {
  const recTypeName = `DueDates_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi, recordsApi, recordPage}) => {
    await test.step('Create a Record Type with Approval and due date', async () => {
      await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
        publish: true,
      });
    });
    await test.step('Start record and navigate there', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });

      await recordPage.proceedToRecordByUrl();
    });
  });
  test('Verify workflow step in inbox tab after changing its status Active->On-Hold->Inactive through Admin where Admin is not assigned to any workflow step(Approve or Inspection) @OGT-34289 @Xoriant_Test', async ({
    navigationBarPage,
    recordPage,
    inboxPage,
  }) => {
    await test.step(' Go to the record and add a step', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Approval],
        'Adhoc-Approval',
      );
    });

    await test.step('Manually set a step to On Hold', async () => {
      await recordPage.changeRecordWorkflowStepStatus(
        'Adhoc-Approval',
        RecordStepStatus.Active,
        RecordStepStatus.On_Hold,
      );
      await recordPage.validateRecordStatus(RecordStatus.Active);
    });

    await test.step('Navigate to Inbox and verify record as per step On Hold', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.On_Hold,
        'Approval',
        false,
        'Newest',
      );
    });
  });

  test('Change approval workflow step status with multiple status(Active->On-Hold,Reject,Complete,Skip) and verify the status from inbox @OGT-35100 @Xoriant_Test', async ({
    navigationBarPage,
    recordPage,
    inboxPage,
  }) => {
    await test.step(' Go to the record and add a step', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Approval],
        'Adhoc-Approval',
      );
    });
    await test.step('Assign user to custom step', async () => {
      await recordPage.clickCustomStepByName('Adhoc-Approval');
      await recordPage.assignStepToUserByEmail(
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to Inbox and verify record as per step Active status', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.Active,
        'Approval',
        true,
        'Newest',
      );
    });

    await test.step('Manually set a step to On hold', async () => {
      await recordPage.proceedToRecordByUrl();
      await recordPage.changeRecordWorkflowStepStatus(
        'Adhoc-Approval',
        RecordStepStatus.Active,
        RecordStepStatus.On_Hold,
      );
      await recordPage.validateRecordStatus(RecordStatus.Active);
    });
    await test.step('Navigate to Inbox and verify record as per step On Hold status', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.On_Hold,
        'Approval',
        true,
        'Newest',
      );
    });

    await test.step('Manually set a step to Reject', async () => {
      await recordPage.proceedToRecordByUrl();
      await recordPage.changeRecordWorkflowStepStatus(
        'Adhoc-Approval',
        RecordStepStatus.On_Hold,
        RecordStepStatus.Reject,
      );
      await recordPage.validateRecordStatus(RecordStatus.Stopped);
    });
    await test.step('Navigate to Inbox and verify record as per step Reject status', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.Reject,
        'Approval',
        true,
        'Newest',
      );
    });

    await test.step('Manually set a step to Complete', async () => {
      await recordPage.proceedToRecordByUrl();
      await recordPage.changeRecordWorkflowStepStatus(
        'Adhoc-Approval',
        RecordStepStatus.Reject,
        RecordStepStatus.Complete,
      );
      await recordPage.validateRecordStatus(RecordStatus.Complete);
    });
    await test.step('Navigate to Inbox and verify record as per step Complete status', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.Complete,
        'Approval',
        true,
        'Newest',
      );
    });

    await test.step('Manually set a step to skip', async () => {
      await recordPage.proceedToRecordByUrl();
      await recordPage.changeRecordWorkflowStepStatus(
        'Adhoc-Approval',
        RecordStepStatus.Reject,
        RecordStepStatus.Skip,
      );
      await recordPage.validateRecordStatus(RecordStatus.Complete);
    });
    await test.step('Navigate to Inbox and verify record as per step skip status', async () => {
      await navigationBarPage.clickExploreInboxButton();
      await inboxPage.verifyRecordWorkflowStepStatusFromInbox(
        RecordStepStatus.Skip,
        'Approval',
        true,
        'Newest',
      );
    });
  });
});
