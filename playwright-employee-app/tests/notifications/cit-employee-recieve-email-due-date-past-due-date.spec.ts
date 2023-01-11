import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
const recordTypeName = 'cit_employee_due_date_email';
const inspectionStepName = 'Inspection';
test('Employees receive email notifications for due date approaching or past due per RT settings on steps they are assigned to @OGT-44338 @Xoriant_Test @email', async ({
  recordTypesApi,
  recordsApi,
  internalRecordPage,
  workflowDesignerPage,
  page,
}) => {
  await test.step('Create a record type', async () => {
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
      {
        publish: true,
        employeeAccess: 3,
        workflowStepsToAdd: {
          approval: false,
          payment: false,
          inspection: true,
          document: false,
        },
        recordPrefixType: 3,
        recordPrefix: 'string',
      },
    );
  });
  await test.step('Navigate to created record type', async () => {
    await page.goto(
      `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/workflow`,
    );
  });

  await test.step('Open created workflow step', async () => {
    await workflowDesignerPage.clickStepByName(inspectionStepName);
  });

  await test.step('Click on due date settings toggle and then click on Done', async () => {
    await workflowDesignerPage.clickOnDueDateCheckBox();
    await workflowDesignerPage.page.click(
      workflowDesignerPage.elements.doneButton,
    );
  });

  await test.step('Create a Record', async () => {
    await recordsApi.createRecordWith(
      {
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      },
      baseConfig.citTestData.citCitizenEmail,
    );
  });
  await test.step('Assign step to notification user', async () => {
    await internalRecordPage.proceedToRecordByUrl();
    baseConfig.citTempData.recordName =
      await internalRecordPage.getCurrentRecordNumber();
    await internalRecordPage.clickCustomStepByName(inspectionStepName);
    await internalRecordPage.assignStepToUserByEmail(
      baseConfig.citTestData.citNotificationUserEmail,
    );
  });
  await test.step('Confirm that email is sent to step assigned user', async () => {
    const emailContent = await getMessageWithContent(
      baseConfig.citTestData.citNotificationUserEmail,
      `Inspection assigned for ${inspectionStepName}`,
      `${inspectionStepName} for ${recordTypeName} #${baseConfig.citTempData.recordName} has been assigned and requires your attention. Click the button below to review`,
    );
    expect(emailContent.html).toContain('View Task');
  });
});
