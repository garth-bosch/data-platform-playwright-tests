import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  FormField,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  defaultPayloadForRenewal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: CITIZEN_SESSION});
const singleEntryFields: FormField[] = [
  {
    label: 'Text',
    value: 'Single Entry text field',
  },
  {
    label: 'Date',
    value: '11/11/2020',
  },
  {
    label: 'Number field',
    value: '100',
  },
  {
    label: 'Number with limit',
    value: '100',
  },
];

const multiEntryFields: FormField[] = [
  {
    label: 'Required Text',
    value: 'Multi Entry text field',
  },
  {
    label: 'Required Number Multi Entry',
    value: '100',
  },
  {
    label: 'Number with Limit Multi Entry',
    value: '100',
  },
];

test.describe('Storefront - Record submission @records @forms @broken_test', () => {
  test.beforeEach(async ({storefrontUrl, storeFrontRecordPage, page}) => {
    await page.goto(storefrontUrl);

    await test.step(`Citizen starts a record draft for record type: ${TestRecordTypes.Smoke_Test}`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Smoke_Test,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Test_Tole.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });
  });

  test.afterEach(async ({commonApi}) => {
    await commonApi.restoreSystemSetting();
  });

  test('Citizen can submit a record through Storefront filling all types of form fields @OGT-34313 @smoke', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
    formsPage,
  }) => {
    await test.step(`Citizen fills form for single-entry section`, async () => {
      await storeFrontFormPage.formSectionIsVisible('Single Entry Section');
      await formsPage.enterFormFieldValues(singleEntryFields);
      await formsPage.toggleCheckboxFormField('Required checkbox');
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Citizen fills form for multi-entry section`, async () => {
      await storeFrontFormPage.formSectionIsVisible('Multi Entry Section');
      await storeFrontFormPage.clickAddMultiEntryButton();
      await formsPage.enterFormFieldValues(multiEntryFields);
      await storeFrontFormPage.clickSaveMultiEntryButton();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Citizen fills form for multi-entry section`, async () => {
      await storeFrontFormPage.formSectionIsVisible(
        'Required Multi Entry Section',
      );
      await storeFrontFormPage.clickAddMultiEntryButton();
      await formsPage.enterFormFieldValue('Num', '100');
      await storeFrontFormPage.clickSaveMultiEntryButton();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Citizen submits record`, async () => {
      await storeFrontFormPage.formSectionIsVisible('Totals section');
      await storeFrontFormPage.navigateToSection('Confirm your submission');
      await storeFrontRecordPage.proceedToNextStep('submit');
      await storeFrontRecordPage.validateRecordContainsStep(
        'Conditional Payment',
      );
    });
  });

  test('Citizen can fill form in Australian Date format @OGT-34314', async ({
    storeFrontRecordPage,
    storeFrontFormPage,
    formsPage,
    commonApi,
  }) => {
    const dateValue = '12/15/2020';
    await test.step(`SETUP - Set system Date settings to AU format`, async () => {
      await commonApi.updateAUSystemSetting();
    });

    await test.step(`Citizen fills Date form field for single-entry section`, async () => {
      await storeFrontFormPage.formSectionIsVisible('Single Entry Section');
      await formsPage.enterFormFieldValue('Text', 'AU Date test');
      await formsPage.toggleCheckboxFormField('Required checkbox');
      await formsPage.enterFormFieldValue('Date', dateValue);
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Citizen submits record and verify AU date format`, async () => {
      await storeFrontFormPage.formSectionIsVisible(
        'Required Multi Entry Section',
      );
      await storeFrontFormPage.clickAddMultiEntryButton();
      await storeFrontFormPage.clickSaveMultiEntryButton();
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontFormPage.formSectionIsVisible('Totals section');
      await storeFrontFormPage.navigateToSection('Confirm your submission');
      await storeFrontRecordPage.validateFormValuePostSubmission(
        'Date',
        dateValue,
      );
      await storeFrontRecordPage.proceedToNextStep('submit');
      await storeFrontRecordPage.validateRecordContainsStep(
        'Conditional Payment',
      );
    });
  });
});
test.describe('Storefront - Records @records @forms', () => {
  let recordTypeName;
  const fields: FormField[] = [
    {
      label: 'Number Field',
      value: '100',
    },
  ];
  test.beforeEach(
    async ({storefrontUrl, storeFrontRecordPage, page, recordTypesApi}) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type and make it public', async () => {
        await recordTypesApi.createRecordType(recordTypeName);
        defaultPayloadForRenewal.recordType.ApplyAccessID = 0;
        defaultPayloadForRenewal.recordType.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        defaultPayloadForRenewal.recordType.name = recordTypeName;
        defaultPayloadForRenewal.recordType.status = 1;
        defaultPayloadForRenewal.recordType.allowSegmentLocations = false;
        await recordTypesApi.updateRecordType(
          baseConfig.citTempData.recordTypeId,
          defaultPayloadForRenewal,
        );
      });
      await test.step('Add Single Entry Form Section and Digital Signature form field to Record Type', async () => {
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
          FormFieldDataIntVal.DigitalSignature;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          'Digital Sign 1';
        defaultPayloadForFormFieldsObject.data.attributes.fieldRequired = 1;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          'Number Field';
        defaultPayloadForFormFieldsObject.data.attributes.fieldRequired = 0;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add another Single Entry Form Section and Digital Signature form field to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel =
          'Single Entry Section 2';
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
          FormFieldDataIntVal.DigitalSignature;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          'Digital Sign 2';
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await page.goto(storefrontUrl);

      await test.step(`Citizen starts a record draft for record type: ${TestRecordTypes.Smoke_Test}`, async () => {
        await storeFrontRecordPage.searchAndStartApplication(recordTypeName);
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.searchAndSelectLocationStorefront(
          TestLocation.Test_Tole.name,
        );
        await storeFrontRecordPage.proceedToNextStep();
      });
    },
  );

  test('Validate mandatory digital signature field on single-entry section can not be bypassed @OGT-34360 @Xoriant_Test', async ({
    storeFrontFormPage,
    formsPage,
    publicRecordPage,
    page,
  }) => {
    await test.step(`Citizen fills form for single-entry section except Digital Signature form field`, async () => {
      await storeFrontFormPage.formSectionIsVisible('Single Entry Section 1');
      await formsPage.enterFormFieldValues(fields);
    });
    await test.step(`Click Next button`, async () => {
      await page.locator(publicRecordPage.elements.proceedButton).click();
    });
    await test.step(`Verify Error message is displayed for Mandatory Digital Signature Field`, async () => {
      await publicRecordPage.isErrorMessageDisplayed(
        'Digital Sign 1',
        'This field is required.',
      );
    });
  });
});
