import {expect, test} from '../../src/base/base-test';

import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
const inspectionStepName = 'Inspection';
const comment = 'Test Comment';
test('Employees receive email notification when a comment is made on step user is assigned to @OGT-44267 @broken_test @Xoriant_Test @email', async ({
  recordsApi,
  recordPage,
  internalRecordPage,
}) => {
  await test.step('Create a record', async () => {
    await recordsApi.createRecordWith(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citEmployeeEmail,
      null,
      [
        {
          fieldName: 'Approval',
          fieldValue: 'false',
        },
        {
          fieldName: 'Inspection',
          fieldValue: 'true',
        },
        {
          fieldName: 'Payment',
          fieldValue: 'false',
        },
        {
          fieldName: 'Document',
          fieldValue: 'false',
        },
      ],
    );
  });

  await test.step('Schedule Inspection Type assigned to user', async () => {
    await recordsApi.scheduleInspection(
      inspectionStepName,
      baseConfig.citTestData.citEmployeeEmail,
      2,
    );
  });

  await test.step('Make public facing comment on Approval step', async () => {
    await recordPage.proceedToRecordById(baseConfig.citTempData.recordId);
    await internalRecordPage.clickCustomStepByName(inspectionStepName);
    await recordPage.commentStep(comment);
  });

  await test.step('Confirm that email is sent to step assigned user', async () => {
    // checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `${baseConfig.citTempData.recordName}`,
      `api admin commented on ${inspectionStepName} for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.subject).toContain(
      `api admin commented on ${inspectionStepName} for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
  });
});
