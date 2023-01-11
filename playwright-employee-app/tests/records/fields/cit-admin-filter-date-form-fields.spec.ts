import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';
import {FilterTypes} from '../../../src/pages/explore-reports-page';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';

test.describe('Employee App - Records Forms And Search @records', () => {
  test.use({storageState: ADMIN_SESSION});

  let fieldName, sectionName, recTypeName;
  test.beforeEach(async ({recordsApi, recordTypesApi, page}) => {
    recTypeName = `Records_Forms_Rec_Type_${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recTypeName, undefined, {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Administer'],
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
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
          .formSectionID,
      );
      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.DateField;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName;
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
      await recordsApi.createRecordWith(
        {name: recTypeName, id: Number(baseConfig.citTempData.recordTypeId)},
        baseConfig.citTestData.citCitizenEmail,
      );
    });
  });

  test('Verify that reports can be filtered by Date Form Field. @OGT-33606 @broken_test @known_defect @incomplete', async ({
    internalRecordPage,
    navigationBarPage,
    employeeAppUrl,
    exploreReportsPage,
    page,
  }) => {
    let randDate = `12/20/2022`;
    await test.step('click on field step label and enter some value and save', async () => {
      for (let i = 0; i < 2; i++) {
        await internalRecordPage.proceedToRecordById(
          baseConfig.citMultiRecordData[i].data.id,
        );
        await page.click(
          internalRecordPage.elements.fieldStepLabel.selector(fieldName),
        );
        await page.click(internalRecordPage.elements.fieldStepLabelInputDate);
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (i === 1) {
          randDate = `12/20/1998`;
        }
        await page.fill(
          internalRecordPage.elements.fieldStepLabelInputDate,
          randDate,
        );
        await page.click(internalRecordPage.elements.fieldStepLabelInputDate);
        await new Helpers().waitFor(1000);
        /* Works flakily on and off .. successfully manually tested*/
        await page.keyboard.press('Escape');
        await new Helpers().waitFor(1000);
        await page.click(internalRecordPage.elements.saveBtnForFormField);
        await new Helpers().waitFor(1000);
      }
    });
    await test.step('Login to Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to explore reports page', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });
    await test.step('Navigate to a Report and add new filter', async () => {
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.clickRecordLabelStatus();
      await exploreReportsPage.addNewFilter('Record Type', FilterTypes.Is, {
        search: [recTypeName],
      });
      await page.click(exploreReportsPage.elements.addNewFilter);
      await exploreReportsPage.fillDropDownInput('Date Submitted');
      await exploreReportsPage.selectDropDown('Date Submitted');
      await exploreReportsPage.fillDateDropdown(`12/20/2000`, '2');
      const totRec = await exploreReportsPage.getTotalRecordsCount();
      expect(Number(totRec)).toEqual(4);
    });
  });
});
