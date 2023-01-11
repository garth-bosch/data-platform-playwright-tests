import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import moment from 'moment';
test.use({storageState: ADMIN_SESSION});
const recordTypeName = 'cit_employee_inspection_modify';
const inspectionStepName = 'Test Inspection';
test('Employees receive email notification when inspection they are assigned to was modified @OGT-44342 @broken_test @Xoriant_Test @email', async ({
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

  await test.step('Modify inspection steps', async () => {
    await internalRecordPage.page.click(
      internalRecordPage.elements.selectStep.selector(inspectionStepName),
    );
    await internalRecordPage.modifyInspectionDate();
  });
  await test.step('Confirm that email is sent to step assigned user', async () => {
    //checking the content of the email
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citNotificationUserEmail,
      `${baseConfig.citTempData.recordName}`,
    );

    expect(emailContent.text.replace(/(\r\n|\n|\r)/gm, ' ')).toContain(
      `An inspection for ${recordTypeName} #${
        baseConfig.citTempData.recordName
      } has been scheduled for ${moment(new Date()).format(
        'MMMM Do, YYYY',
      )} at 7:00:00 am. Click below to view details.`,
    );
    expect(emailContent.subject).toContain(
      `Inspection scheduled for ${recordTypeName} #${baseConfig.citTempData.recordName}`,
    );
  });
});
