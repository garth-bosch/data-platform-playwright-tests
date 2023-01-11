import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
const comment = 'Test Comment';
test('Applicant receives email notification when a public-facing comment is made on any step @OGT-44263 @Xoriant_Test', async ({
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
          fieldValue: 'true',
        },
        {
          fieldName: 'Inspection',
          fieldValue: 'true',
        },
        {
          fieldName: 'Payment',
          fieldValue: 'true',
        },
        {
          fieldName: 'Document',
          fieldValue: 'true',
        },
      ],
    );
  });
  await test.step('Navigate to the record', async () => {
    await internalRecordPage.proceedToRecordByUrl();
  });
  await test.step('Make public facing comment on Approval step', async () => {
    await internalRecordPage.clickCustomStepByName('Approval');
    await recordPage.commentStep(comment);
  });

  await test.step('Make public facing comment on Inspection step', async () => {
    await internalRecordPage.clickCustomStepByName('Inspection');
    await recordPage.commentStep(comment);
  });

  await test.step('Make public facing comment on Payment step', async () => {
    await internalRecordPage.clickCustomStepByName('Payment');
    await recordPage.commentStep(comment);
  });

  await test.step('Make public facing comment on Document step', async () => {
    await internalRecordPage.clickCustomStepByName('Document');
    await recordPage.commentStep(comment);
  });

  await test.step('Confirm that email is sent to applicant for public facing comment on Approval step', async () => {
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `api admin commented on Approval for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
      `api admin commented on Approval for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.html).toContain(`<br><strong>"${comment}"</strong>`);
  });

  await test.step('Confirm that email is sent to applicant for public facing comment on Inspection step', async () => {
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `api admin commented on Inspection for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
      `api admin commented on Inspection for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.html).toContain(`<br><strong>"${comment}"</strong>`);
  });

  await test.step('Confirm that email is sent to applicant for public facing comment on Payment step', async () => {
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `api admin commented on Payment for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
      `api admin commented on Payment for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.html).toContain(`<br><strong>"${comment}"</strong>`);
  });

  await test.step('Confirm that email is sent to applicant for public facing comment on Document step', async () => {
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citEmployeeEmail,
      `api admin commented on Document for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
      `api admin commented on Document for ${TestRecordTypes.Record_Steps_Test.name} #${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.html).toContain(`<br><strong>"${comment}"</strong>`);
  });
});
