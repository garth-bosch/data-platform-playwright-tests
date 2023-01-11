import {test, expect} from '../../src/base/base-test';
import {
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {getMessageWithContent} from '@opengov/cit-base/build/api-support/mandrillHelper';

test.setTimeout(180 * 1000);
test.describe('Storefront - Login @login', () => {
  test('Email Notification Record Links should redirect to Login page @OGT-46429 @broken_test', async ({
    page,
    authPage,
    baseConfig,
    recordsApi,
  }) => {
    const applicantEmail = baseConfig.citTestData.citCitizenEmail,
      applicantPass = baseConfig.citTestData.citAppPassword,
      recordStepName = TestSteps.Inspection;
    let linkFromEmail: string,
      recordName: string,
      recordId: string,
      stepId: string;

    await test.step(`Create record with applicant ${applicantEmail}`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        applicantEmail,
        null,
        [
          {
            fieldName: recordStepName,
            fieldValue: 'true',
          },
        ],
      );
      recordName = baseConfig.citTempData.recordName;
      recordId = baseConfig.citTempData.recordId;

      stepId = (
        await recordsApi.getRecordStepByName(
          TestSteps[recordStepName],
          recordId,
        )
      ).id;
    });

    await test.step(`Get Email Notification Record Links`, async () => {
      const message = await getMessageWithContent(
        applicantEmail,
        'Please schedule a time for Inspection',
        recordName,
      );
      linkFromEmail = message.text.match(/https[^>]*/)[0];
      expect(linkFromEmail).toBeDefined();
    });

    await test.step('Verify link from email redirects to login page', async () => {
      await page.goto(linkFromEmail);
      await page.waitForNavigation();
      await expect(page).toHaveURL(RegExp(`.*/login.*`));
    });

    await test.step('Login with valid credentials', async () => {
      await authPage.fillEmailField(applicantEmail);
      await authPage.fillPasswordField(applicantPass);
      await authPage.clickLogin();
    });

    await test.step('Verify Record page opened', async () => {
      await page.waitForNavigation();
      await expect(page).toHaveURL(
        `${baseConfig.storefrontUrl}/track/${recordId}/step/${stepId}`,
      );
    });
  });
});
