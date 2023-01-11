import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Record type settings - ME Form Fields', () => {
  test('Employee can validate document type @OGT-33578', async ({
    navigationBarPage,
    selectRecordTypePage,
    createRecordPage,
    recordPage,
    page,
    employeeAppUrl,
  }) => {
    await test.step(`Start a record draft`, async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType('_00_Circular_Calc_FF');
    });
    await test.step(`Start a record draft`, async () => {
      await createRecordPage.addApplicantToRecord(
        'API Test',
        'api_test@opengov.com',
      );
      await createRecordPage.addLocationToRecord(
        '11 Test Tole, Unit 11, TestCity, MA',
      );
      await createRecordPage.fillTextFormField('A', '100');
      await createRecordPage.openNewMultiEntrySection('Multi-Entry Section');
      await createRecordPage.fillTextFormField('ME-A', '200', 'multi');
      await createRecordPage.saveMultiEntrySection();
      await createRecordPage.fillTextFormField('one', '200');
      await createRecordPage.saveRecord();
    });
    await test.step(`Add document to record`, async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate('LetterDoc');
      await recordPage.verifyDocumentVisibility('issued');
    });
    await test.step(`Validate issued document`, async () => {
      await recordPage.validateIssuedDocument(
        'API Test',
        '11 Test Tole 11, TestCity',
      );
      await recordPage.validateFFOnIssuedDocument(100, 200);
    });
  });
});
