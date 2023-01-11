import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Digital Signature verifcation on Record Document', () => {
  let recordTypeName: string,
    sectionName: string,
    recTypeNo: number,
    esignature: string;
  const digitalSignatureHtml = `<div> DigitalSignature: <p class='eSignature'>DigitalSignatureValue<br></p> </div>`;
  test.beforeEach(
    async ({
      recordTypesApi,
      page,
      formDesignerPage,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      employeeAppUrl,
    }) => {
      await test.step('Create a Record Type and User flag', async () => {
        recordTypeName = `@OGT-${faker.random.alphaNumeric(
          3,
        )}-${faker.random.alphaNumeric(5)}`;
        recTypeNo = Number(
          await recordTypesApi.createRecordType(recordTypeName),
        );
        esignature = `${recordTypeName}Signature`;
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
        sectionName = `${recordTypeName}-${faker.random.alphaNumeric(6)}`;
        await formDesignerPage.addSingleEntrySection(sectionName);
      });
      await test.step('Add Digital Signature type field to the section', async () => {
        await formDesignerPage.addFormField('Digital Signature', sectionName);
        await formDesignerPage.clickOnFormField(
          'Digital Signature',
          sectionName,
        );
        await formDesignerPage.getFormFieldIdValue(
          'Digital Signature',
          sectionName,
        );
      });
      await test.step('Add Document to record type with Digital Signature Form field', async () => {
        await recordTypesApi.addDocuments({
          docTemplate: {
            docTitle: recordTypeName,
            recordTypeID: recTypeNo,
            html: digitalSignatureHtml.replace(
              'DigitalSignatureValue',
              `{{FF${baseConfig.citTempData.formFieldId}}}`,
            ),
          },
        });
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
    },
  );
  test(`User can see the signer's name added (previously no value entered) on the reissued document @OGT-34465 @Xoriant_Test`, async ({
    internalRecordPage,
    recordsApi,
    recordPage,
  }) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: recTypeNo,
      });
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Validate issued document', async () => {
      await recordPage.verifySignatureOnDocument(esignature, false);
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add digital signature on record', async () => {
      await recordPage.addDigitalSignatureOnRecord(esignature);
    });
    await test.step('Re-issue document', async () => {
      await recordPage.clickRecordStepName(recordTypeName);
      await recordPage.reissueDocument(true);
    });
    await test.step('Verify the re-issued document with digital signature', async () => {
      await recordPage.verifyDocumentVisibility();
      await recordPage.verifyDocumentVersionIssuedText('Version 2');
      await recordPage.verifySignatureOnDocument(esignature);
    });
  });
  test(`User can see no value on Document for no Signature entered @OGT-34464 @Xoriant_Test`, async ({
    internalRecordPage,
    recordsApi,
    recordPage,
  }) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: recTypeNo,
      });
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Validate issued document', async () => {
      await recordPage.verifySignatureOnDocument(esignature, false);
    });
  });
  test(`User can see the signer's name entered for Signature on the document @OGT-34463 @Xoriant_Test`, async ({
    internalRecordPage,
    recordsApi,
    recordPage,
  }) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: recTypeNo,
      });
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add digital signature on record', async () => {
      await recordPage.addDigitalSignatureOnRecord(
        `${recordTypeName}Signature`,
      );
    });
    await test.step('Add document', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(recordTypeName);
    });
    await test.step('Validate issued document', async () => {
      await recordPage.verifySignatureOnDocument(esignature);
    });
  });
});
