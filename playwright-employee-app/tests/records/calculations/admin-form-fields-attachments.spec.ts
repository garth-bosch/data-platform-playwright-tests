import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {RecordStatus} from '../../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - RT/Forms etc  @forms', () => {
  let recordTypeName, fieldName, fieldName2, sectionName;
  test.beforeEach(async ({recordTypesApi, employeeAppUrl, page}) => {
    recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
    fieldName = `Field_${faker.random.alphaNumeric(4)}`;
    fieldName2 = `Field2_${faker.random.alphaNumeric(4)}`;
    sectionName = `Section_${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
      });
    });
    await test.step('Add Form Section to Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      await recordTypesApi.addFormSection(defaultFormSectionObject);
    });
    await test.step('Add form field1 to Form Section', async () => {
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
    await test.step('Add form field2 to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
          .formSectionID,
      );
      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.ShortTextEntry;
      defaultPayloadForFormFieldsObject.data.attributes.fieldRequired = 1;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName2;
      defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName2}`;
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
    await test.step('Go to employee app url', async () => {
      await page.goto(employeeAppUrl);
    });
  });
  test('User should be able to submit/continue the application without adding non-required details . @OGT-34371 @Xoriant_Test', async ({
    internalRecordPage,
    createRecordPage,
  }) => {
    await test.step('Create record draft', async () => {
      await createRecordPage.startDraftRecordFor(
        'Test Department',
        recordTypeName,
      );
    });
    await test.step('Update form field with help text', async () => {
      await createRecordPage.updateGivenFormFieldText(
        baseConfig.citIndivApiData.addFieldToFormToRTResult.at(1).data
          .attributes.fieldLabel,
        'Help text',
      );
    });
    await test.step('Save record', async () => {
      await createRecordPage.clickOnSaveRecordButton();
    });
    await test.step('Validate record status', async () => {
      await internalRecordPage.validateRecordStatus(RecordStatus.Active);
    });
  });
});
