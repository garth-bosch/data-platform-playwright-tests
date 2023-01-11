import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Records', () => {
  let recordTypeName: string;
  const fileUploadHtml = `<div> Uploaded File: <div class='fileUpload'>FileUpload<br></div> </div>`;
  test.beforeEach(
    async ({
      recordsApi,
      internalRecordPage,
      recordTypesApi,
      page,
      employeeAppUrl,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      formDesignerPage,
    }) => {
      recordTypeName = `OGT-${faker.random.alphaNumeric(8)}`;
      let recTypeNo: number, sectionName: string;
      await test.step('Create a Record Type and User flag', async () => {
        recTypeNo = Number(
          await recordTypesApi.createRecordType(recordTypeName),
        );
      });
      await test.step('Navigate to workflow settings', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recordTypeName);
      });
      await test.step('Go to forms tab', async () => {
        await recordTypesSettingsPage.proceedToFormTab();
      });
      await test.step('Add Form Section to Record Type', async () => {
        sectionName = `Section ${faker.random.alphaNumeric(8)}`;
        await formDesignerPage.addSingleEntrySection(sectionName);
      });
      await test.step('Add File Upload type field to the section', async () => {
        await formDesignerPage.addFormField('File Upload', sectionName);
        await formDesignerPage.clickOnFormField('File Upload', sectionName);
        await formDesignerPage.getFormFieldIdValue('File Upload', sectionName);
      });
      await test.step('Add Document to record type with File Upload Form field', async () => {
        await recordTypesApi.addDocuments({
          docTemplate: {
            docTitle: recordTypeName,
            recordTypeID: recTypeNo,
            html: fileUploadHtml.replace(
              'FileUpload',
              `{{FF${baseConfig.citTempData.formFieldId}}}`,
            ),
          },
        });
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
      await test.step('Create a Record', async () => {
        await recordsApi.createRecordWith({
          name: recordTypeName,
          id: recTypeNo,
        });
      });
      await test.step('Navigate to Record by id', async () => {
        await internalRecordPage.proceedToRecordById(
          baseConfig.citTempData.recordId,
        );
      });
    },
  );

  test(`User can see the image thumbnail for image file uploaded on issued document) @OGT-34458 @Xoriant_Test`, async ({
    recordPage,
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('png');
    });
    await test.step('Add document for file upload image', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify thumbnail of the image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadImageThumbnail();
    });
  });

  test(`User can see the colored square with file extension for file (other than image) uploaded on issued document @OGT-34459 @Xoriant_Test`, async ({
    recordPage,
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('docx');
    });
    await test.step('Add document for file upload image', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify non image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadNonImageThumbnail('docx');
    });
  });

  test(`User can see no value on Document for no file uploaded @OGT-34460 @Xoriant_Test`, async ({
    recordPage,
  }) => {
    await test.step('Add document for file upload image', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify no upload happened and no image or non image color is not shown on the document', async () => {
      await recordPage.verifyFileUploadImageThumbnail(false);
      await recordPage.verifyFileUploadNonImageThumbnail('docx', false);
    });
  });

  test(`User can see the updated file on reissued document @OGT-34461 @Xoriant_Test`, async ({
    recordPage,
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('docx');
    });
    await test.step('Add document for file upload image', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify non image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadNonImageThumbnail('docx');
    });
    await test.step('Navigate to record page by URL', async () => {
      await recordPage.clickRecordDetailsTabSection('Details');
    });
    await test.step('Delete file in File Upload type form field', async () => {
      await internalRecordPage.deleteFileOnFormField('docx');
    });
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('csv');
    });
    await test.step('Re-issue document', async () => {
      await recordPage.clickRecordStepName(recordTypeName);
      await recordPage.reissueDocument();
    });
    await test.step('Verify the re-issued document with digital signature', async () => {
      await recordPage.verifyDocumentVisibility();
      await recordPage.verifyDocumentVersionIssuedText('Version 2');
    });
    await test.step('Verify non image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadNonImageThumbnail('csv');
    });
  });

  test(`User can see no value for deleted file on reissued document @OGT-34462 @broken_test @Xoriant_Test`, async ({
    recordPage,
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('docx');
    });
    await test.step('Add document for file upload image', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Verify non image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadNonImageThumbnail('docx');
    });
    await test.step('Navigate to record page by URL', async () => {
      await recordPage.clickRecordDetailsTabSection('Details');
    });
    await test.step('Delete file in File Upload type form field', async () => {
      await internalRecordPage.deleteFileOnFormField('docx');
    });
    await test.step('Re-issue document', async () => {
      await recordPage.clickRecordStepName(recordTypeName);
      await recordPage.reissueDocument();
    });
    await test.step('Verify the re-issued document with digital signature', async () => {
      await recordPage.verifyDocumentVisibility();
      await recordPage.verifyDocumentVersionIssuedText('Version 2');
    });
    await test.step('Verify non image uploaded to the file upload field showing on the document', async () => {
      await recordPage.verifyFileUploadNonImageThumbnail('docx', false);
    });
  });
});
