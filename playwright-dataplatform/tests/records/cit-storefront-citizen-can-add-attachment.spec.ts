import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Records Attachments @records @attachments', () => {
  test.beforeEach(async ({recordsApi, recordStepsApi}) => {
    await test.step(`Create a record`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
      );
      await recordStepsApi.addPaymentStep(
        'Payment',
        1,
        baseConfig.citTempData.recordId,
      );
    });
  });

  test('Citizen can add attachment @OGT-34319 @broken_test @Xoriant_Test', async ({
    storeFrontRecordPage,
    myAccountPage,
    page,
    storefrontUrl,
  }) => {
    await test.step('Navigate to Created Record in StoreFront using my Account', async () => {
      await page.goto(storefrontUrl);
      await myAccountPage.proceedToMyAccount();
      await myAccountPage.proceedToPayments();
      await page.locator(myAccountPage.elements.firstPaymentRow).click();
    });

    await test.step('Upload an attachment', async () => {
      await page.locator(storeFrontRecordPage.elements.attachmentLink).click();
      await storeFrontRecordPage.uploadAttachment('sample.png', false);
    });

    await test.step('Verify uploaded attachment can be downloaded', async () => {
      await storeFrontRecordPage.verifyUploadedAttachments();
      await storeFrontRecordPage.downloadAttachment();
    });
  });
});
