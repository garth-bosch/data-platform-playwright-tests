import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';
import {RecordStepStatus} from '../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Documents @records @record-steps', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(TestRecordTypes.Renewal_Campaign_Tests);
    });
    await test.step('Open the record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test(
    "Verify renewal's expires after logic is not applicable on manually issued document step" +
      ' in a workflow @OGT-33692 @broken_test @Xoriant_Test',
    async ({createRecordPage, recordPage}) => {
      await test.step('Renew the record', async () => {
        await recordPage.startDraftRecordRenewal();
        await createRecordPage.toggleFormGroupCheckbox('Document');
        await recordPage.submitRenewalRecord();
      });
      await test.step('Open the completed document step', async () => {
        await recordPage.clickRecordStepName('Custom Document');
      });
      await test.step('Verify expiration date is present', async () => {
        const expirationDate = await recordPage.page
          .frameLocator(recordPage.elements.printDoc)
          .locator(recordPage.elements.issuedDocument)
          .locator('p', {
            has: recordPage.page.locator('strong', {
              hasText: 'Expires:',
            }),
          })
          .locator('span')
          .innerText();
        expect(expirationDate).toMatch(/[A-Za-z]+ \d+, \d{4}/);
      });
      await test.step('Add a new document step', async () => {
        await recordPage.addDocumentStep();
        await recordPage.addDocumentTemplate('LetterDoc');
        await recordPage.verifyRecordStepStatusIs(
          RecordStepStatus.Issued,
          'LetterDoc',
        );
      });
      await test.step('Verify expiration date is not present', async () => {
        const expirationDate = await recordPage.page
          .frameLocator(recordPage.elements.printDoc)
          .locator(recordPage.elements.issuedDocument)
          .locator('p', {
            has: recordPage.page.locator('strong', {
              hasText: 'Expires:',
            }),
          })
          .locator('span')
          .innerText();
        expect(expirationDate.trim()).toEqual('');
      });
    },
  );
});
