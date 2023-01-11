import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Form Fields @records @forms', () => {
  test.beforeEach(async ({page, storefrontUrl, storeFrontRecordPage}) => {
    await test.step('Citizen navigates to Storefront URL', async () => {
      await page.goto(storefrontUrl);
    });
    await test.step(`Citizen starts a record draft`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Test_Tole.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });
  });

  test('User can upload a File in file upload type field @OGT-33870 @broken_test @Xoriant_Test', async ({
    storeFrontRecordPage,
  }) => {
    await test.step(`Citizen Uploads a file in upload type form field and verify`, async () => {
      await storeFrontRecordPage.uploadFileToFormField('pdf');
    });
  });

  test('Thumbnails are displayed for file upload form field type. (For image files) @OGT-33873 @broken_test @Xoriant_Test', async ({
    storeFrontRecordPage,
  }) => {
    await test.step(`Citizen Uploads a image file in upload type form field and verify the Thumbnail`, async () => {
      await storeFrontRecordPage.uploadFileToFormField('png');
    });
  });
});
