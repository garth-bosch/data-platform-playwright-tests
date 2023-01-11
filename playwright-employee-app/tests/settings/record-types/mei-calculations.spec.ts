import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Record type settings - ME Form Fields', () => {
  let recordTypeName, formSectionId;
  const formFieldIDs = [];

  test.beforeEach(
    async ({
      recordTypesApi,
      baseConfig,
      recordTypesSettingsPage,
      formDesignerPage,
    }) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `@OGT-33822_${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(
          recordTypeName,
          'Test Department',
          {publish: true},
        );
      });
      await test.step('', async () => {
        defaultFormSectionObject.formSection.sectionLabel = 'MEI';
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        defaultFormSectionObject.formSection.sectionType = 1; // Multi-entry
        formSectionId = await recordTypesApi.addFormSection(
          defaultFormSectionObject,
        );
      });
      for (const {value, index} of ['A', 'B'].map((value, index) => ({
        value,
        index,
      }))) {
        await test.step(`Add a new form field "${value}"`, async () => {
          defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
            formSectionId;
          defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = value;
          defaultPayloadForFormFieldsObject.data.attributes.dataType =
            FormFieldDataIntVal.Number;
          defaultPayloadForFormFieldsObject.data.attributes.isSectionType = 1;
          defaultPayloadForFormFieldsObject.data.attributes.orderNo = index;
          formFieldIDs[value] = await recordTypesApi.addFieldToFormSection(
            defaultPayloadForFormFieldsObject,
          );
        });
      }
      await test.step('Open the record type > Form tab', async () => {
        await recordTypesSettingsPage.proceedToRecordTypeById(
          baseConfig.citTempData.recordTypeId,
          'Form',
        );
      });
      await test.step('Add a formula for the "B" field based on the "A"', async () => {
        await formDesignerPage.clickOnFormField('B', 'MEI');
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.setFormulaOnCalculatedField('@A', '*100');
        await expect(
          formDesignerPage.page.locator(
            formDesignerPage.elements.calculatorIcon,
          ),
        ).toBeVisible();
        await expect(
          formDesignerPage.page.locator(
            formDesignerPage.elements.doneEditButton,
          ),
        ).toBeHidden();
      });
    },
  );

  test(
    'Admin can add MEI calculation after a referred field in a calculated field is renamed' +
      ' @OGT-33822 @Xoriant_test',
    async ({
      formDesignerPage,
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Rename the "A" field', async () => {
        await formDesignerPage.clickOnFormField('A', 'MEI');
        await formDesignerPage.renameField('new_A');
      });

      await test.step(`Start a record draft`, async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(recordTypeName);
      });

      await test.step(`Fill the "A" form field`, async () => {
        await createRecordPage.openNewMultiEntrySection('MEI');
        await createRecordPage.fillTextFormField('new_A', '10', 'multi');
        await createRecordPage.saveMultiEntrySection();
      });

      await test.step(`Verify calculated "B" value`, async () => {
        const element =
          createRecordPage.elements.longTextFormFieldText.selector(`B`, 1, 2);
        await expect(createRecordPage.page.locator(element)).toHaveText(
          '1,000',
        );
      });
    },
  );

  test(
    'Admin can add MEI calculation after a referred field in a calculated field is Edited' +
      ' @OGT-33821 @Xoriant_test',
    async ({
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
      recordPage,
    }) => {
      await test.step(`Start a record draft`, async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(recordTypeName);
      });

      await test.step(`Fill the "A" form field`, async () => {
        await createRecordPage.openNewMultiEntrySection('MEI');
        await createRecordPage.fillTextFormField('A', '10', 'multi');
        await createRecordPage.saveMultiEntrySection();
      });

      await test.step(`Verify calculated "B" value`, async () => {
        const element =
          createRecordPage.elements.longTextFormFieldText.selector(`B`, 1, 2);
        await expect(createRecordPage.page.locator(element)).toHaveText(
          '1,000',
        );
      });

      await test.step(`Save the record`, async () => {
        await createRecordPage.clickOnSaveRecordButton();
      });

      await test.step(`Edit the value of the "A" field`, async () => {
        await recordPage.editAndSaveFormField('MEI', 'A', '5');
      });

      await test.step(`Verify the value for the "B" has been automatically re-calculated`, async () => {
        await recordPage.validateValueSavedInMultiEntryFormField(
          'MEI',
          'B',
          '500',
        );
      });
    },
  );

  test(
    'Admin cannot add MEI calculation after a referred field in a calculated field is Deleted' +
      ' @OGT-33820 @Xoriant_test @smoke',
    async ({
      page,
      recordTypesApi,
      formDesignerPage,
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Add the 3rd form field', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          formSectionId;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = 'C';
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.isSectionType = 1;
        formFieldIDs['C'] = await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });

      await test.step('Add a formula for the "C" field based on the "B"', async () => {
        await page.reload();
        await formDesignerPage.clickOnFormField('C', 'MEI');
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.setFormulaOnCalculatedField('@B', '+1');
        await expect(
          formDesignerPage.page.locator(
            formDesignerPage.elements.doneEditButton,
          ),
        ).toBeHidden();
      });

      await test.step('Delete the "B" field', async () => {
        await recordTypesApi.deleteFormField(formFieldIDs['B']);
      });

      await test.step(`Start a record draft`, async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(recordTypeName);
      });

      await test.step(`Fill the "A" form field`, async () => {
        await createRecordPage.openNewMultiEntrySection('MEI');
        await createRecordPage.fillTextFormField('A', '10', 'multi');
        await createRecordPage.saveMultiEntrySection();
      });

      await test.step(`Verify calculated "B" value`, async () => {
        const element =
          createRecordPage.elements.longTextFormFieldText.selector(`C`, 1, 2);
        await expect(createRecordPage.page.locator(element)).toHaveText('1');
      });
    },
  );

  test(
    'Admin can add MEI calculation after a referred field in a calculated field is re-ordered' +
      ' @OGT-33823 @Xoriant_test',
    async ({
      page,
      recordTypesApi,
      formDesignerPage,
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Add the 3rd form field', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          formSectionId;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = 'C';
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.isSectionType = 1;
        defaultPayloadForFormFieldsObject.data.attributes.orderNo = 3;
        formFieldIDs['C'] = await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });

      const initialFormFieldsOrder =
        await test.step('Get initial Form Fields Order', async () => {
          await formDesignerPage.page.reload();
          return await formDesignerPage.getFormFieldOrder('MEI');
        });

      await test.step('Reorder the "A" field with "B"', async () => {
        await recordTypesApi.reorderFormFields(
          formFieldIDs['A'],
          formFieldIDs['B'],
        );
      });

      const formFieldsOrder =
        await test.step('Get Form Fields Order', async () => {
          await formDesignerPage.page.reload();
          return await formDesignerPage.getFormFieldOrder('MEI');
        });

      await test.step('Verify Form Fileds order after re-ordering', async () => {
        expect(formFieldsOrder).not.toEqual(initialFormFieldsOrder);
        expect(formFieldsOrder).toEqual(['B', 'A', 'C']);
      });

      await test.step('Add a formula for the "C" field based on the "A"', async () => {
        await page.reload();
        await formDesignerPage.clickOnFormField('C', 'MEI');
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.setFormulaOnCalculatedField('@A', '+1');
        await expect(
          formDesignerPage.page.locator(
            formDesignerPage.elements.doneEditButton,
          ),
        ).toBeHidden();
      });

      await test.step(`Start a record draft`, async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(recordTypeName);
      });

      await test.step(`Fill the "A" form field`, async () => {
        await createRecordPage.openNewMultiEntrySection('MEI');
        await createRecordPage.fillTextFormField('A', '10', 'multi');
        await createRecordPage.saveMultiEntrySection();
      });

      const expectedValues = [
        {formField: 'A', value: 10},
        {formField: 'B', value: 10 * 100},
        {formField: 'C', value: 10 + 1},
      ];
      for (const expected of expectedValues) {
        await test.step(`Verify calculated "${expected.formField}" value`, async () => {
          const element =
            createRecordPage.elements.longTextFormFieldText.selector(
              expected.formField,
              1,
              formFieldsOrder.indexOf(expected.formField) + 1,
            );
          await expect(createRecordPage.page.locator(element)).toHaveText(
            expected.value.toLocaleString(),
          );
        });
      }
    },
  );
});
