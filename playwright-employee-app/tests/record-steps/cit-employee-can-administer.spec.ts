import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Administer @records @record-steps', () => {
  const docTempId = 'LetterDoc';
  test.beforeEach(async ({recordsApi}) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(
        {
          name: TestRecordTypes.Employee_CanAdminister_RT,
          id: TestRecordTypes.Record_Steps_Test.id,
        },
        baseConfig.citTestData.citAdminEmail,
      );
    });
  });

  test('Employee users with "can administer" access can manually add doc steps step @OGT-44270 @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to Record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(docTempId);
    });
    await test.step('Validate issued document', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');
    });
  });
  test('Employee users with "can administer" access can manually add doc steps step @OGT-44268 @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to Record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(docTempId);
    });
    await test.step('Validate issued document', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');
    });
    await test.step('Re issue document', async () => {
      await recordPage.reissueDocument();
    });
    await test.step('Verify the re issued document', async () => {
      await recordPage.verifyDocumentVisibility();
      await recordPage.verifyDocumentVersionIssuedText('Version 2');
    });
  });
});
