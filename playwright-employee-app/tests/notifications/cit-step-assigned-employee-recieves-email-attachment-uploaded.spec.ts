import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
const recordTypeName = 'cit_employee_upload_attachment';
const inspectionStepName = 'Test Inspection';
test('Employees receive email notification when an attachment is uploaded on record where they are assigned to Active step @OGT-44269 @broken_test @Xoriant_Test @email', async ({
  recordTypesApi,
  recordsApi,
  internalRecordPage,
}) => {
  await test.step('Create a record', async () => {
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
    );
    await recordsApi.createRecordWith(
      {
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      },
      baseConfig.citTestData.citCitizenEmail,
    );
  });

  await test.step('Create a step with Inspection Type and navigate to the record', async () => {
    await recordsApi.addAdhocStep('Inspection', inspectionStepName, 1);
    await recordsApi.scheduleInspection(
      inspectionStepName,
      baseConfig.citTestData.citNotificationUserEmail,
      2,
    );
    await internalRecordPage.proceedToRecordByUrl();
  });

  await test.step('Upload Attachment', async () => {
    await internalRecordPage.uploadNewFile('pdf');
  });

  await test.step('Confirm that email is sent to step assigned user', async () => {
    //checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citNotificationUserEmail,
      `${baseConfig.citTempData.recordName}`,
    );
    expect(emailContent.html).toContain(
      `An attachment has been added to ${recordTypeName} #${baseConfig.citTempData.recordName}. Click below to view it`,
    );
    expect(emailContent.html).toContain('View Details');
    expect(emailContent.subject).toContain(
      `A document was uploaded to ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
  });
});
