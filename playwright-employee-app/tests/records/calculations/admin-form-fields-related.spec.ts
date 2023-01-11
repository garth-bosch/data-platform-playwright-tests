import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - RT/ - Record type settings @forms', () => {
  let recordTypeName, fieldName, sectionName;
  test.beforeEach(async ({recordTypesApi, recordPage, recordsApi}) => {
    recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
    fieldName = `Field_${faker.random.alphaNumeric(4)}`;
    sectionName = `Section ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Add Form Section to Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      await recordTypesApi.addFormSection(defaultFormSectionObject);
    });
    await test.step('Add form field to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
          .formSectionID,
      );
      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.Number;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName;
      defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
    await test.step('Create record with existing type and  navigate to record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await recordPage.proceedToRecordById(baseConfig.citTempData.recordId);
    });
  });
  test('Unit values should be rounded up to the next highest value @OGT-34402 @broken_test @Xoriant_Test @known_defect @defect:OGT-47595', async ({
    page,
    recordPage,
  }) => {
    await test.step('Create User Flag', async () => {
      await recordPage.editAndSaveFormField(
        baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
          .sectionLabel,
        baseConfig.citIndivApiData.addFieldToFormToRTResult.at(0).data
          .attributes.fieldLabel,
        '8.999',
      );
    });
    await test.step('Expect that rounded value', async () => {
      await expect(
        page.locator(
          recordPage.elements.formFieldInputBox.selector(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .sectionLabel,
            baseConfig.citIndivApiData.addFieldToFormToRTResult.at(0).data
              .attributes.fieldLabel,
          ),
        ),
      ).toHaveValue('8');
    });
  });
});
