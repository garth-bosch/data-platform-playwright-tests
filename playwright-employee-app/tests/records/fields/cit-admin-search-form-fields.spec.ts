import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';

test.describe('Employee App - Records Forms And Search @records', () => {
  test.use({storageState: ADMIN_SESSION});

  let fieldName, sectionName;
  test.beforeEach(
    async ({recordsApi, recordTypesApi, internalRecordPage, page}) => {
      const recTypeName = `Records_Forms_Rec_Type_${faker.random.alphaNumeric(
        4,
      )}`;
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(recTypeName, undefined, {
          publish: true,
        });
      });
      await test.step('Add Form Section to Record Type', async () => {
        sectionName = `Section_${faker.random.alphaNumeric(4)}`;
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form field to Form Section', async () => {
        fieldName = `Field_${faker.random.alphaNumeric(4)}`;
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName;
        defaultPayloadForFormFieldsObject.data.attributes.isSearchable = true;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Setup a record and open it', async () => {
        await page.goto(
          `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/form`,
        );
        await recordsApi.createRecordWith(
          {name: recTypeName, id: Number(baseConfig.citTempData.recordTypeId)},
          baseConfig.citTestData.citCitizenEmail,
        );
        await internalRecordPage.proceedToRecordByUrl();
      });
    },
  );

  test('User can search globally for a searchable form field @OGT-33566 @broken_test @known_defect', async ({
    internalRecordPage,
    navigationBarPage,
    page,
  }) => {
    const randNumber = `33566${faker.random.numeric(2)}`;
    await test.step('click on field step label and enter some value and save', async () => {
      await page.click(
        internalRecordPage.elements.fieldStepLabel.selector(fieldName),
      );
      await page.click(internalRecordPage.elements.fieldStepLabelInput);
      await page.fill(
        internalRecordPage.elements.fieldStepLabelInput,
        randNumber,
      );
      await new Helpers().waitFor(3000);
      /* Works flakily on and off .. successfully manually tested*/
      await page.click(internalRecordPage.elements.saveBtnForFormField);
      await new Helpers().waitFor(3000);
    });
    await test.step('Verify the field search-ability', async () => {
      await new Helpers().waitFor(3000);
      await navigationBarPage.performSearch(randNumber);
      await expect(
        await page.locator(`//li[contains(.,"${randNumber}")]`),
      ).toBeVisible();
    });
  });
});
