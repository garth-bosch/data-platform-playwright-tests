import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestFileTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Records Attachments @OGT-46174 @records @attachments', () => {
  // Webkit doesn't find a new attachment popup on headless mode. Works on headed though.
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');
  test.beforeEach(
    async ({page, storefrontUrl, storeFrontUserPage, storeFrontRecordPage}) => {
      await test.step(`Start application draft`, async () => {
        await page.goto(storefrontUrl);
        await storeFrontUserPage.validateMyAccountButtonVisibility(true);
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.Ghost_Test.name,
        );
      });
    },
  );

  const badFiletypes = [
    TestFileTypes.EXE,
    TestFileTypes.HTML,
    TestFileTypes.DMG,
    TestFileTypes.EMPTY,
  ];

  for (const fileType of badFiletypes) {
    test(`Citizen cannot upload file with ${fileType} extension`, async ({
      storeFrontFormPage,
      storeFrontRecordPage,
    }) => {
      await test.step(`Proceed to next steps`, async () => {
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.proceedToNextStep();
      });
      await test.step(`Upload an attachment with ${fileType} extension`, async () => {
        await storeFrontFormPage.uploadAdhocAttachment(fileType);
      });
      await test.step(`Refresh the page to reset error on file input`, async () => {
        await storeFrontFormPage.page.reload();
      });
    });
  }
});
