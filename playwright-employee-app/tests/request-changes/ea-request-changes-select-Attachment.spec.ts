import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {FooterButton} from '../../src/pages/request-change-page';

const attachmentContianerName = ['ID', 'Address'];

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Requesting Change - Select Attachement', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test(`Admin able to add a note on selected attachments @OGT-44758 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I upload a file in 'ID' attachment `, async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Attachments');
      await internalRecordPage.uploadFileToAttachment(
        attachmentContianerName[0],
        'png',
      );
    });

    await test.step(`I start the change request and navigate to 'Select Attachment' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnButton(FooterButton.Next);
    });

    await test.step(`I can select the attachment including empty and add a note to it`, async () => {
      for (const element of attachmentContianerName) {
        await requestChanges.selectAndAddNoteToAttachment(element, 'Test');
      }
    });
  });

  // Would fail due to knwon issue with file opened in new tab shows error
  test(`Non-empty attachment can be open in a new tab @OGT-44759 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I upload a file in 'ID' attachment `, async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Attachments');
      await internalRecordPage.uploadFileToAttachment(
        attachmentContianerName[0],
        'png',
      );
    });

    await test.step(`I start the change request and navigate to 'Select Attachment' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnButton(FooterButton.Next);
    });

    await test.step(`I can open the non-empty attachment`, async () => {
      await requestChanges.clickOnAttachment(attachmentContianerName[0]);
      await requestChanges.validateAttachmentOpenInNewTab(
        attachmentContianerName[0],
        '.png',
      );
    });
  });

  test(`Empty attachment not clickable @OGT-44760 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I start the change request and navigate to 'Select Attachment' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnButton(FooterButton.Next);
    });

    await test.step(`I cannot open an empty attachment`, async () => {
      await requestChanges.validateEmptyAttachmentNotClickable(
        attachmentContianerName[0],
      );
    });
  });

  test(`Admin able to select all attachments including empty attachments @CIT-3062 @OGT-44756
   @request_changes`, async ({requestChanges, internalRecordPage}) => {
    await test.step(`I start the change request and navigate to 'Select Attachment' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnButton(FooterButton.Next);
    });

    await test.step(`I see all attachment attached to the record`, async () => {
      for (const element of attachmentContianerName) {
        await requestChanges.validateAttchmentDisplay(element);
      }
    });

    await test.step(`I select all attachment`, async () => {
      for (const element of attachmentContianerName) {
        await requestChanges.selectAttachment(element);
      }
    });

    await test.step(`I see number of selected attachement`, async () => {
      await requestChanges.validateNumberOfSelectedAttachment('2');
    });
  });
});
