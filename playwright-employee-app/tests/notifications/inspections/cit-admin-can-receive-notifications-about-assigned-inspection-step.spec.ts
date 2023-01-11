import {expect, test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Notifications', () => {
  //* TODO: This is a duplicate test of @OGT-39589 @duplicate
  test('Citizen receives notifications that inspection requested @notifications @ESN-4792', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    createRecordPage,
    recordPage,
  }) => {
    await test.step('Set timeout for 180s', async () => {
      // increase timeout for mandrill API to return emails
      test.setTimeout(180 * 1000);
    });

    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step('Create record [0_UI_PAYMENT_TEST] from department [1. Inspectional Services]', async () => {
      await createRecordPage.selectDepartment('1. Inspectional Services');
      await createRecordPage.selectRecordByName('0_UI_PAYMENT_TEST');
      await createRecordPage.clickOnSaveRecordButton();
    });

    const recordNumber = await recordPage.getCurrentRecordNumber();

    await test.step('Select [Custom Inspection] step', async () => {
      await recordPage.clickCustomStepByName('Custom Inspection');
      await recordPage.changeRecordWorkflowStepStatus(
        'Custom Inspection',
        'Inactive',
        RecordStepStatus.Active,
      );
    });

    await test.step('Assign inspection on [api_test@opengov.com] user', async () => {
      await recordPage.assignStepToUserByEmail('api_test@opengov.com');
    });

    await test.step('Confirm that email is sent to assignee', async () => {
      const bodyText =
        'Custom Inspection for 0_UI_PAYMENT_TEST #' +
        recordNumber +
        ' has been assigned and requires your attention. Click the button below to review.';
      await getMessageWithContent(
        'api_test@opengov.com',
        'Inspection assigned for Custom Inspection',
        bodyText,
      );
    });

    await test.step('Assign inspection step to myself and check inbox counter', async () => {
      const counterBefore = await navigationBarPage.getInboxCounterNumber();
      await recordPage.unassignUserFromStep();
      await recordPage.assignCustomApprovalOnMe();
      await expect
        .poll(
          async () => {
            const counterAfter =
              await navigationBarPage.getInboxCounterNumber();
            return counterBefore !== counterAfter;
          },
          {
            message: `Expected message count to no longer be ${counterBefore}`,
          },
        )
        .toBeTruthy();
    });
  });

  test.setTimeout(180 * 1000);
  test('Employee receives notification when they are assigned to Inspection Step @OGT-44266 @Xoriant_Test @email', async ({
    recordTypesApi,
    recordsApi,
    recordPage,
    internalRecordPage,
  }) => {
    const workflowStep = `Test Inspection ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a record', async () => {
      await recordTypesApi.createRecordType(
        'cit_employee_inspection_step',
        TestDepartments.Test_Department,
      );
      await recordsApi.createRecordWith({
        name: 'cit_employee_inspection_step',
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Create a step with Inspection Type and navigate to the record', async () => {
      await recordsApi.addAdhocStep('Inspection', workflowStep, 1);
      await internalRecordPage.proceedToRecordByUrl();
      baseConfig.citTempData.recordName =
        await internalRecordPage.getCurrentRecordNumber();
    });
    await test.step('Assign an Employee to Inspection step', async () => {
      await internalRecordPage.clickCustomStepByName(workflowStep);
      await recordPage.assignStepToUserByEmail(
        TestUsers.Notification_user.email,
      );
    });
    await test.step('Confirm that email is sent to assignee', async () => {
      const emailContent = await getMessageWithContent(
        baseConfig.citTestData.citNotificationUserEmail,
        `Inspection assigned for ${workflowStep}`,
        `${baseConfig.citTempData.recordName}`,
      );
      const emailContentExpected = `${workflowStep} for cit_employee_inspection_step #${baseConfig.citTempData.recordName} has been assigned and requires your attention. Click the button below to review`;
      expect(emailContent.html).toContain(emailContentExpected);
      expect(emailContent.html).toContain('View Task');
    });
  });
});
