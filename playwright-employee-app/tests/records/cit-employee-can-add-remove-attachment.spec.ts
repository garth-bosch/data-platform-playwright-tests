import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Records Attachments @records', async () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(TestRecordTypes.Ghost_Test);
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });
  test('Employee can add or remove attachments @OGT-34269 @broken_test @Xoriant_Test @smoke @broken_test', async ({
    internalRecordPage,
  }) => {
    await test.step('Add an attachment to the record', async () => {
      await internalRecordPage.uploadNewFile('pdf');
    });
    await test.step('Delete previously uploaded attachment from the record', async () => {
      await internalRecordPage.deleteAttachment('pdf');
    });
  });
  test('User can upload and download attachments for a record @OGT-34056 @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Add an attachment to the record', async () => {
      await internalRecordPage.uploadNewFile('png');
    });
    await test.step('Download previously uploaded attachment from the record', async () => {
      await internalRecordPage.clickAttachmentByName('png');
      await internalRecordPage.downloadAttachment('png');
    });
  });

  test('User can upload and download attachments of multiple file types for a record @OGT-34057 @Xoriant_Test', async ({
    internalRecordPage,
    page,
  }) => {
    await test.step('Add attachments to the record', async () => {
      await internalRecordPage.uploadNewFile('jpeg');
      await internalRecordPage.uploadNewFile('docx');
      await internalRecordPage.uploadNewFile('pdf');
    });
    await test.step('Download previously uploaded attachments from the record', async () => {
      await internalRecordPage.clickAttachmentByName('jpeg');
      await internalRecordPage.downloadAttachment('jpeg');
      await page
        .locator(internalRecordPage.elements.backToAttachmentsLink)
        .click();
      await internalRecordPage.clickAttachmentByName('docx');
      await internalRecordPage.downloadAttachment('docx');
      await page
        .locator(internalRecordPage.elements.backToAttachmentsLink)
        .click();
      await internalRecordPage.clickAttachmentByName('pdf');
      await internalRecordPage.downloadAttachment('pdf');
    });
  });
});
