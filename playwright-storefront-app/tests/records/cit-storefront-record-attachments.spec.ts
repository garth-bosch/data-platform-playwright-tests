import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  LocationTypes,
  TestFileTypes,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {resolve} from 'path';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Records Attachments @records @attachments', () => {
  // Webkit doesn't find a new attachment popup on headless mode. Works on headed though.
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');
  test.beforeEach(async ({page, storefrontUrl, storeFrontUserPage}) => {
    await test.step(`Start application draft`, async () => {
      await page.goto(storefrontUrl);
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
    });
  });

  test('Citizen can add adhoc attachments to record through Storefront @OGT-34518', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    await test.step(`Start application draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Ghost_Test.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Upload an Adhoc attachment', async () => {
      await storeFrontFormPage.uploadAdhocAttachment(TestFileTypes.PDF);
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Confirm submission details and submit record', async () => {
      await storeFrontRecordPage.validateSubmissionConfirmationPage();
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step('Verify uploaded attachment', async () => {
      await storeFrontRecordPage.verifyUploadedAttachments();
    });
  });

  test('Citizen can download attachment uploaded to Single-Entry Section @OGT-43177 @broken_test', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    await test.step(`Start application draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Api_Test,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.clickLocationType(LocationTypes.ADDRESS);
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Test_Tole.name,
      );
    });

    await test.step('Upload attachment to Single-Entry Section', async () => {
      await storeFrontFormPage.navigateToSection('Single Entry');
      await storeFrontFormPage.addAttachments(2);
      await storeFrontFormPage.navigateToSection('Confirm your submission');
    });

    await test.step('Confirm submission details and submit record', async () => {
      await storeFrontRecordPage.validateSubmissionConfirmationPage();
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step('Verify attachment can be downloaded', async () => {
      await storeFrontRecordPage.downloadAttachmentFromDetailsPage(
        'sample.png',
      );
    });
  });

  test('Citizen can download attachment uploaded to Multi-Entry Section @OGT-43178 @broken_test', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    /* eslint-disable no-use-before-define */
    await test.step(`Start application draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Api_Test,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.clickLocationType(LocationTypes.ADDRESS);
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Test_Tole.name,
      );
    });

    await test.step('Upload attachment to Multi-Entry Section', async () => {
      await storeFrontFormPage.navigateToSection('Multi-Entry Section');
      await storeFrontFormPage.clickAddMultiEntryButton();
      await storeFrontFormPage.addAttachments(2);
      await storeFrontFormPage.clickSaveMultiEntryButton();
      await storeFrontFormPage.navigateToSection('Confirm your submission');
    });

    await test.step('Confirm submission details and submit record', async () => {
      await storeFrontRecordPage.validateSubmissionConfirmationPage();
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step('Verify attachment can be downloaded', async () => {
      await storeFrontRecordPage.downloadAttachmentFromDetailsPage(
        'sample.png',
      );
    });
  });

  test('Citizen can see only the public attachments @OGT-34520 @broken_test', async ({
    storeFrontUserPage,
    myAccountPage,
    recordsApi,
    recordAttachmentsApi,
  }) => {
    await test.step(`Setup record with public and private attachment`, async () => {
      const filePath = `${resolve(process.cwd())}/src/resources/cit/sample.png`;
      await recordsApi.submitRecordDraft(TestRecordTypes.UI_Attachment_order);
      await recordAttachmentsApi.uploadFileToAttachment(
        'Attachment 1',
        filePath,
      );
      await recordAttachmentsApi.uploadFileToAttachment(
        'Attachment 0',
        filePath,
      );
      await recordsApi.submitFinalRecord();
    });

    await test.step('Load public record in Storefront', async () => {
      await myAccountPage.gotoPublicRecordPageById();
    });

    await test.step('Verify Public Attachment is visible', async () => {
      await storeFrontUserPage.verifyAttachmentVisibility(true, 'Attachment 1');
    });

    await test.step('Verify Private Attachment is not visible', async () => {
      await storeFrontUserPage.verifyAttachmentVisibility(
        false,
        'Attachment 0',
      );
    });
  });

  test('Citizen can upload attachment to record from attachment bucket through Storefront @OGT-34519', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    await test.step(`Start application draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.UI_Attachment_order.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Upload a predefined attachment', async () => {
      await storeFrontFormPage.uploadAttachments(TestFileTypes.PNG);
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Confirm submission details and submit record', async () => {
      await storeFrontRecordPage.validateSubmissionConfirmationPage();
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step('Verify uploaded attachment can be downloaded', async () => {
      await storeFrontRecordPage.verifyUploadedAttachments();
      await storeFrontRecordPage.downloadAttachment();
    });
  });

  test('Citizen cannot upload attachment with restricted characters in file name to record through Storefront @OGT-43543', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    const allowedFilePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample_-_.png`;
    const restrictedFilePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample#.png`;
    await test.step(`Start application draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.UI_Attachment_order.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Upload attachment with a restricted character in filename', async () => {
      await storeFrontFormPage.uploadAttachmentWithFile(restrictedFilePath);
    });

    await test.step('Upload is prevented and error message is shown', async () => {
      await storeFrontFormPage.verifyUploadAttachmentErrorMessage(
        'nameNotSupported',
      );
    });

    await test.step('Upload attachment with allowed characters in filename', async () => {
      await storeFrontFormPage.uploadAttachmentWithFile(allowedFilePath);
    });
  });

  test('Citizen can view attachments added by admin @OGT-34320 @broken_test', async ({
    storeFrontRecordPage,
    myAccountPage,
    recordsApi,
    recordAttachmentsApi,
  }) => {
    await test.step(`Setup record with admin added attachment`, async () => {
      const filePath = `${resolve(process.cwd())}/src/resources/cit/sample.png`;
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
      );
      await recordAttachmentsApi.uploadFileToAttachment(
        'Image_Attachment',
        filePath,
        baseConfig.citTempData.recordId,
        true,
      );
    });

    await test.step('Load public record in Storefront', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
    });

    await test.step('Verify admin uploaded attachment is visible', async () => {
      await storeFrontRecordPage.verifyUploadedAttachments();
    });
  });
});
