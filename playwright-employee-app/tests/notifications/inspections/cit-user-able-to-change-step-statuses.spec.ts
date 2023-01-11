import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';

test.setTimeout(120_000);
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Filtering by type and statuses', () => {
  test('Change inspection workflow step status and verify status from inbox @OGT-35101 @Xoriant_Test', async ({
    recordsApi,
    internalRecordPage,
    inboxPage,
  }) => {
    await test.step('Create record via API', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: TestSteps.Approval,
            fieldValue: 'true',
          },
          {
            fieldName: TestSteps.Inspection,
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Navigate to created record by ID', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
    });
    await test.step('Assign step to current user', async () => {
      await internalRecordPage.addAssigneeForWorkflowSteps(
        TestSteps.Inspection,
      );
      await inboxPage.page.waitForTimeout(3000);
    });
    const listOfStatusesToChange = [
      RecordStepStatus.Active,
      RecordStepStatus.Skip,
      RecordStepStatus.Complete,
      RecordStepStatus.On_Hold,
      RecordStepStatus.Reject,
    ];
    let previousStepStatus = RecordStepStatus.Inactive;
    for (const statusToChange of listOfStatusesToChange) {
      await test.step('Manually set a step status to other one', async () => {
        await internalRecordPage.changeRecordWorkflowStepStatus(
          TestSteps.Inspection,
          previousStepStatus,
          statusToChange,
        );
        previousStepStatus = statusToChange;
      });
      await test.step('Navigate to Inbox page', async () => {
        await inboxPage.goto();
      });
      await test.step('Apply task sorting by [Inspection]', async () => {
        await inboxPage.filterTasksByType(TestSteps.Inspection);
      });
      await test.step('Apply task sorting by status', async () => {
        await inboxPage.filterStepByStatus(statusToChange);
      });
      await test.step('Verify the task with changed status is visible', async () => {
        await inboxPage.verifyInboxTaskRowVisible();
      });
      await test.step('Select task with changed status and open it on inbox page', async () => {
        await inboxPage.selectInboxRow();
        await inboxPage.openTask();
      });
    }
  });
});
