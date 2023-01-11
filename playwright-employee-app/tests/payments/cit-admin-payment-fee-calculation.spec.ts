import {expect, test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {FeeOption} from '../../src/pages/record-type-settings-pages/fee-designer-page';
const recordStepName = 'Payment';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Payment @payments', () => {
  let recordTypeName, feeName;
  test.beforeEach(
    async ({
      recordsApi,
      internalRecordPage,
      recordTypesApi,
      page,
      navigationBarPage,
      employeeAppUrl,
      systemSettingsPage,
      recordTypesSettingsPage,
      feeDesignerPage,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Add Single Entry Form Section and Number form field to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel =
          'Single Entry Section 1';
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        defaultFormSectionObject.formSection.sectionType = 0;
        await recordTypesApi.addFormSection(defaultFormSectionObject);
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );

        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          'Field 1';
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
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
      await test.step('Go to Fees Tab', async () => {
        await recordTypesSettingsPage.proceedToFeesTab();
      });
      await test.step('Set Calculations', async () => {
        feeName = await feeDesignerPage.proceedToFeeDesigner();
        await feeDesignerPage.setCalculation(
          FeeOption.PerValue,
          undefined,
          undefined,
          '0.00568',
          'Field 1',
        );
      });
      await test.step('Create Record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
          null,
        );
        await recordsApi.addAdhocStep('Payment', 'Payment', 1);
        await internalRecordPage.proceedToRecordByUrl();
      });
    },
  );

  test('Verify that fees in decimals should be calculated correctly @OGT-34401 @broken_test @Xoriant_Test @incomplete', async ({
    page,
    internalRecordPage,
  }) => {
    await test.step('Add value in Number form field and verify the fee amount', async () => {
      await internalRecordPage.editAndSaveFormField(
        'Single Entry Section 1',
        'Field 1',
        '1',
      );
      await internalRecordPage.clickRecordStepName(recordStepName);
      await internalRecordPage.addFeeByName(feeName);
      const textValue = (
        await page.locator(internalRecordPage.elements.feeBill).textContent()
      )
        .replace(/[\n\t]/g, ' ')
        .trim();
      await expect(textValue).toContain('$0.01');
    });
    await test.step('Update the Number form field', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        'Single Entry Section 1',
        'Field 1',
        '10',
      );
    });
    await test.step('Navigate to payment step and verify the fee is calculated correctly', async () => {
      await internalRecordPage.clickRecordStepName(recordStepName);
      const textValue = (
        await page.locator(internalRecordPage.elements.feeBill).textContent()
      )
        .replace(/[\n\t]/g, ' ')
        .trim();
      await expect(textValue).toContain('$0.06');
    });
  });
});
