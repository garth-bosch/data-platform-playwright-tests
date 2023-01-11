import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Records', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create Record with File Upload Form Field', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'File Upload',
            fieldValue: '',
            fieldType: 10,
          },
        ],
      );
    });
    await test.step('Navigate to Record by id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
    });
  });
  test('User can upload a File in file upload type field @OGT-33868 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload Type form field', async () => {
      await internalRecordPage.uploadFileToFormField('csv');
    });
    await test.step('Download file in File Upload Type form field', async () => {
      await internalRecordPage.downloadFormFieldFile('csv');
    });
  });

  test('User can delete uploaded file from file upload type field @OGT-33869 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('pdf');
    });
    await test.step('Delete file in File Upload type form field', async () => {
      await internalRecordPage.deleteFileOnFormField('pdf');
    });
  });

  test('Thumbnails are displayed for file upload form field type. (For image files) @OGT-33872 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
  }) => {
    await test.step('Upload file in File Upload type form field', async () => {
      await internalRecordPage.uploadFileToFormField('png');
    });
  });
});
