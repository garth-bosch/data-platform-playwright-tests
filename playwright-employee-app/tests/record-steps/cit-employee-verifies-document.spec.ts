import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Documents @records @record-steps @documents', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a new record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        null,
        [
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Open the record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Verify that the document is well-formed @OGT-34470', async ({
    recordPage,
  }) => {
    await test.step('Open the document step', async () => {
      await recordPage.clickRecordStepName(TestSteps.Document);
      await recordPage.validateIssuedDocumentComplete();
    });
    await test.step('Validate issued document', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');

      // Verify plain text
      await expect(
        recordPage.page
          .frameLocator(recordPage.elements.printDoc)
          .locator(recordPage.elements.issuedDocument)
          .locator('span', {
            hasText:
              'This is an e-permit. To learn more, scan this barcode or visit ',
          }),
      ).toBeVisible();

      // Verify an image
      await expect(
        recordPage.page
          .frameLocator(recordPage.elements.printDoc)
          .locator(recordPage.elements.documentDefaultOgLogo),
      ).toBeVisible();
    });
  });
});
