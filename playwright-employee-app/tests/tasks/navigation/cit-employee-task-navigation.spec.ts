import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';

const approvalStepName = 'OGT-34508_Approval';
let givenRecordDetails = {};
let recordId = '';

test.use({storageState: ADMIN_SESSION});
test('Employee can open tasks from the Inbox and it navigates to correct record step. @known_defect @OGT-34508 @broken_test @Xoriant_Test @multiple-sessions', async ({
  page,
  employeeAppUrl,
  recordsApi,
  internalRecordPage,
  recordPage,
  authPage,
  navigationBarPage,
  inboxPage,
}) => {
  await test.step('Creates task for task navigation', async () => {
    givenRecordDetails = await recordsApi.createRecordWith(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
    );
    recordId = givenRecordDetails[0].data.attributes.recordID;
    await internalRecordPage.proceedToRecordByUrl();
    await recordPage.addApprovalStep(
      approvalStepName,
      baseConfig.citTestData.citEmployeeEmail,
    );
    await authPage.logout();
  });

  await test.step('Employee login after task created and navigate to inbox.', async () => {
    await page.goto(`${employeeAppUrl}`);
    await authPage.loginAs(
      TestUsers.Api_Employee.email,
      baseConfig.citTestData.citAppPassword,
    );
    await navigationBarPage.clickExploreInboxButton();
  });
  await test.step('From inbox navigate to given Record', async () => {
    await inboxPage.verifyInboxItemsGivenRow('1', approvalStepName);
    await inboxPage.clickInboxItemsGivenRow('1');
  });
  await test.step('Click on the record step and verify', async () => {
    await inboxPage.clickInboxSelectedItemRecordLink(recordId);
    await recordPage.clickRecordStepName(approvalStepName);
    await recordPage.verifyRecordStepStatusIs(RecordStepStatus.In_Progress);
  });
});
