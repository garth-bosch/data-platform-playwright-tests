import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Edit record types @records @record-steps', () => {
  let recTypeNo;
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;
  test.beforeEach(async ({employeeAppUrl, recordTypesApi, page}) => {
    await test.step('Create a Record Type', async () => {
      recTypeNo = await recordTypesApi.createRecordType(recTypeName);
      await page.goto(employeeAppUrl);
    });
  });

  test('Admin can edit the document template in a record type @OGT-33905 @Xoriant_Test', async ({
    page,
    recordTypesApi,
    recordTypesSettingsPage,
    baseConfig,
    navigationBarPage,
  }) => {
    const testName = `@OGT-33905`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedName = `${name}${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to RT and Doc tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToDocumentTab();
    });
    await test.step('Add Document', async () => {
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: name,
          recordTypeID: recTypeNo,
        },
      });
      await page.reload();
    });
    await test.step('Update Document Title - click', async () => {
      await recordTypesSettingsPage.clickOnGivenDocInDocsTab(
        baseConfig.citIndivApiData.addDocumentToRTResult.at(0).docTemplate.id,
        name,
      );
    });
    await test.step('Update Document Title', async () => {
      await recordTypesSettingsPage.updateDocumentTitle(updatedName);
    });
    await test.step('Update Document Save Document', async () => {
      await recordTypesSettingsPage.saveDocument();
    });
    await test.step('Update Document back to Rec Type', async () => {
      await recordTypesSettingsPage.backToRecType();
    });
    await test.step('Verify new Doc name/title', async () => {
      await recordTypesSettingsPage.clickOnGivenDocInDocsTab(
        baseConfig.citIndivApiData.addDocumentToRTResult.at(0).docTemplate.id,
        updatedName,
      );
    });
  });

  test('Admin can have an option to Edit attachments, which will enable an edit state. @OGT-33892 @Xoriant_Test', async ({
    recordTypesApi,
    recordTypesSettingsPage,
    navigationBarPage,
    attachmentDesignerPage,
  }) => {
    const testName = `@OGT-33892`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const description = `${name}_Description`;
    const updatedName = `${name}${faker.random.alphaNumeric(4)}`;
    await test.step('Add attachment', async () => {
      await recordTypesApi.addAttachment({
        attachment: {
          name: name,
          description: description,
          recordTypeID: Number(recTypeNo),
          recordType: recTypeNo,
        },
      });
    });
    await test.step('Navigate to RT', async () => {
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Navigate to RT - attachment tab', async () => {
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToAttachmentsTab();
    });
    await test.step('Update/edit attachment name and verify same', async () => {
      await attachmentDesignerPage.updateAttachmentName(name, updatedName);
    });
  });

  test('Verify on/off for location for a RT @OGT-33946 @Xoriant_Test', async ({
    recordTypesSettingsPage,
    navigationBarPage,
    locationDesignerPage,
  }) => {
    await test.step('Navigate to RT and attachment tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToLocationTab();
    });
    await test.step('Update attachment name and verify same', async () => {
      await locationDesignerPage.toggleLocationSettingOnOff('on');
      await locationDesignerPage.toggleLocationSettingOnOff('off');
    });
  });

  test('Verify the conditional logic for Fees is triggered correctly @OGT-33734 @broken_test @Xoriant_Test', async ({
    page,
    feeDesignerPage,
    recordTypesSettingsPage,
    navigationBarPage,
    recordsApi,
    recordPage,
  }) => {
    let feeName: string;
    await test.step('Open the record type', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToFeesTab();
    });
    await test.step('Create a new fee', async () => {
      feeName = await feeDesignerPage.proceedToFeeDesigner();
      await feeDesignerPage.setCalculation('$ flat');
      await feeDesignerPage.clickAddedFee();
    });
    await test.step('Add 2 conditions', async () => {
      await feeDesignerPage.addCondition('User Flag', 'Dog Person');
      await feeDesignerPage.addCondition('Location Flag', 'Dog Heaven');
    });
    await test.step('Select "Match Any Condition" operator and save the fee', async () => {
      await feeDesignerPage.selectMatchOperatorInConditionForm(
        'Match Any Condition',
      );
      await page.locator(feeDesignerPage.elements.saveFeeCalculation).click();
    });
    await test.step('Create a record and open it', async () => {
      await recordsApi.createRecordWith(
        {
          name: recTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citCitizenEmail,
      );
      await recordPage.proceedToRecordByUrl();
    });
    await test.step('Add a payment step and navigate into it', async () => {
      await recordsApi.addAdhocStep('Payment', 'Adhoc payment step');
      await page.reload();
      await recordPage.clickRecordStepName('Adhoc payment step');
    });
    await test.step('Add the fee to the payment step', async () => {
      await recordPage.addFeeByName(feeName);
    });
    await test.step('Verify the fee value', async () => {
      await recordPage.validateFeeWith(feeName, '100');
    });
  });
});
