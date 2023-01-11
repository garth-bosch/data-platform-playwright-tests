import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
const recordTypeName = 'cit-step-assigined-user-comment-test';
const inspectionStepName = 'Inspection';
const approvalStepName = 'Approval';
test('Employees receive email notification when @-mentioned in step comment made by another employee @OGT-44242 @Xoriant_Test @email', async ({
  recordsApi,
  internalRecordPage,
  recordTypesApi,
}) => {
  await test.step('Create a record', async () => {
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
    );
    await recordsApi.createRecordWith({
      name: recordTypeName,
      id: Number(baseConfig.citTempData.recordTypeId),
    });
    await recordsApi.addAdhocStep('Inspection', inspectionStepName, 1);
    await recordsApi.addAdhocStep('Payment', 'Payment', 1);
    await recordsApi.addAdhocStep('Approval', approvalStepName, 1);
  });

  await test.step('Put a public facing comment on Payment step', async () => {
    await internalRecordPage.proceedToRecordById(
      baseConfig.citTempData.recordId,
    );
    await internalRecordPage.clickCustomStepByName('Payment');
    await internalRecordPage.mentionInComment('@API Employee', 'API Employee');
    await internalRecordPage.clickOnCommentButton();
  });

  await test.step('Put a public facing comment on Inspection step', async () => {
    await internalRecordPage.clickCustomStepByName(inspectionStepName);
    await internalRecordPage.assignStepToUserByEmail(
      baseConfig.citTestData.citNotificationUserEmail,
    );
    await internalRecordPage.commentStep('General Comment');
  });
  await test.step('Put a public facing comment and On Hold comment on approval step', async () => {
    await internalRecordPage.clickCustomStepByName(approvalStepName);
    await internalRecordPage.assignStepToUser('myself');
    await internalRecordPage.mentionInComment(
      '@API Employee',
      'API Employee',
      2,
    );
    await internalRecordPage.clickOnHoldButton();
  });

  await test.step('Confirm that email is sent to mentioned user in Payment step comment', async () => {
    //checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `${baseConfig.citTempData.recordName}`,
      `api admin mentioned you on Payment for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.subject).toContain(
      `api admin mentioned you on Payment for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.text).toContain('@API Employee');
  });

  await test.step('Confirm that email is sent to mentioned user in Inspection step comment', async () => {
    //checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citNotificationUserEmail,
      `${baseConfig.citTempData.recordName}`,
      `api admin commented on Inspection for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.subject).toContain(
      `api admin commented on Inspection for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.text).toContain('General Comment');
  });

  await test.step('Confirm that email is sent to mentioned user in approval step on hold', async () => {
    //checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `${baseConfig.citTempData.recordName}`,
      `api admin mentioned you on Approval for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.subject).toContain(
      `api admin mentioned you on Approval for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.text).toContain('@API Employee');
  });
});
