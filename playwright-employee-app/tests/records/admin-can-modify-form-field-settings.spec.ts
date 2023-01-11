import {test, expect} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings @records', () => {
  let recordTypeName, fieldName, sectionName;
  test.beforeEach(async ({recordTypesApi}) => {
    recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
    fieldName = `Field ${faker.random.alphaNumeric(5)}`;
    sectionName = `Section ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Add Form Section to Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultFormSectionObject.formSection.sectionType = 0;
      await recordTypesApi.addFormSection(defaultFormSectionObject);
    });
  });
  test('Admin can edit/modify any existing form fields and settings @OGT-33785 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
    recordsApi,
    internalRecordPage,
  }) => {
    const newFieldName = 'Updated Form Field Label';
    const newHelpText = 'Updated Help Text';
    await test.step('Add Checkbox form field to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
          .formSectionID,
      );

      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.Checkbox;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName;
      defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
    await test.step('Create Record with File Upload Form Field', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citCitizenEmail,
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
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Open Checkbox form field and modify the settings', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await page.locator(formDesignerPage.elements.helpEdit).fill(newHelpText);
      await formDesignerPage.renameField(newFieldName);
    });
    await test.step('Go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Verify the changes made to form field are reflected in the record', async () => {
      await expect(
        page.locator(internalRecordPage.elements.formField),
      ).toHaveText(newFieldName);
      await expect(
        page.locator(internalRecordPage.elements.formField).locator('span'),
      ).toHaveAttribute('data-hint', newHelpText);
    });
  });
});
