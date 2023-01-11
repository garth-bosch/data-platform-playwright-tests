import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  RecordTypeAccess,
  RecordType,
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Record submission @records @forms @broken_test', () => {
  test(
    `Calculated FF in Autofill section works without breaking the draft` +
      `@known_defect @ESN-6254 @OGT-33789 @broken_test @Xoriant_test @defect:OGT-48284`,
    async ({page, storeFrontRecordPage, storefrontUrl, recordTypesApi}) => {
      const recordTypeName = `@OGT-33789_${faker.random.alphaNumeric(4)}`;

      await test.step('Create record type via api with 3 number fields in multi entry', async () => {
        test.setTimeout(180 * 1000);
        const recordTypeID = await recordTypesApi.createRecordType(
          recordTypeName,
          'Test Department',
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Edit'],
            locationTypesToEnable: {
              address: true,
              point: false,
              segment: false,
            },
          },
        );

        const recType = await recordTypesApi.getRecordTypeById(recordTypeID);

        const updatePayload = {
          recordType: recType,
        };

        updatePayload.recordType.ApplyAccessID = 0;

        await recordTypesApi.updateRecordType(
          recordTypeID,
          updatePayload as RecordType,
        );
      });

      const sectionName = `Section ${faker.random.alphaNumeric(4)}`;

      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.sectionType = 1;

        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );

        await recordTypesApi.addFormSection(defaultFormSectionObject);
        defaultFormSectionObject.formSection.formSectionID = Number(
          baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
            .formSectionID,
        );
        defaultFormSectionObject.formSection.externalData = Boolean(true);
        defaultFormSectionObject.formSection.externalDataSourceTable =
          String('ex_Contractors_MA');

        await recordTypesApi.patchFormFieldSection(defaultFormSectionObject);
      });
      const fieldLabel1 = 'First Field';
      const fieldLabel2 = 'Second Field';
      const fieldLabel3 = 'Calculated Field';
      await test.step('Add 3 fields to form section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldLabel1;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );

        defaultPayloadForFormFieldsObject.data.attributes.externalData =
          Boolean(true);
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldLabel2;
        defaultPayloadForFormFieldsObject.data.attributes.externalDataSourceField =
          String('EXID');
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );

        //add calculated field
        const firstFieldID =
          baseConfig.citIndivApiData.addFieldToFormToRTResult.at(0).data
            .attributes.formFieldID;
        const secondFieldID =
          baseConfig.citIndivApiData.addFieldToFormToRTResult.at(1).data
            .attributes.formFieldID;
        defaultPayloadForFormFieldsObject.data.attributes.isCalculation =
          Boolean(true);
        defaultPayloadForFormFieldsObject.data.attributes.calculationFields = `${firstFieldID},${secondFieldID}`;
        defaultPayloadForFormFieldsObject.data.attributes.calculation = `{{${firstFieldID}}} * {{${secondFieldID}}}`;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldLabel3;

        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });

      await test.step('Land on STR homepage and start application', async () => {
        await page.goto(storefrontUrl);
        await storeFrontRecordPage.searchAndStartApplication(recordTypeName);
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.searchAndSelectLocationStorefront(
          '345 Park Avenue, New York, NY',
        );
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.clickAddSectionButton(sectionName);
        await storeFrontRecordPage.fillAndSubmitMultientrySection(
          fieldLabel1,
          '2',
        );
      });

      await test.step('Verify that fields are properly calculated', async () => {
        //TODO implement after bug is resolved
      });
    },
  );
});
