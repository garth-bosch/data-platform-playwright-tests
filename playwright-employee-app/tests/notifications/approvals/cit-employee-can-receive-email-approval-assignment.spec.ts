import {test, expect} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee - email Notifications', () => {
  test('Employee receives email notification when assigned to Approval Step @OGT-44265 @broken_test @Xoriant_Test', async ({
    recordTypesApi,
    recordsApi,
    recordPage,
    internalRecordPage,
  }) => {
    const workflowStep = `Test Approval ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a record', async () => {
      await recordTypesApi.createRecordType(
        'cit_employee_approval_step',
        TestDepartments.Test_Department,
      );
      await recordsApi.createRecordWith({
        name: 'cit_employee_approval_step',
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Create a step with Approval Type and navigate to the record', async () => {
      await recordsApi.addAdhocStep('Approval', workflowStep, 1);
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Assign an Employee to Approval step', async () => {
      await internalRecordPage.clickCustomStepByName(workflowStep);
      await recordPage.assignStepToUserByEmail(
        baseConfig.citTestData.citNotificationUserEmail,
      );
    });
    await test.step('Confirm that email is sent to assignee', async () => {
      const emailContent = await getMessageWithContent(
        baseConfig.citTestData.citNotificationUserEmail,
        `Approval required for ${workflowStep}`,
        `${baseConfig.citTempData.recordName}`,
      );
      const emailContentExpected = `Your approval is required for ${workflowStep} cit_employee_approval_step #${baseConfig.citTempData.recordName}. Click the button below to review and give your response.`;
      expect(emailContent.html).toContain(emailContentExpected);
      expect(emailContent.html).toContain('View Task');
    });
  });
});
