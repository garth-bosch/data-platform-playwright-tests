import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {RecordStep} from '../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Approval workflow with conditions', () => {
  let recordTypeName: string,
    fieldInput1: string,
    conditionalFieldOutput: string,
    sectionName: string,
    conditionObject: any;

  test.beforeEach(
    async ({
      recordTypesApi,
      employeeAppUrl,
      page,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      recordsApi,
      formDesignerPage,
      feeDesignerPage,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      fieldInput1 = `FieldInput1_${faker.random.alphaNumeric(4)}`;
      conditionalFieldOutput = `ConditionalField_${faker.random.alphaNumeric(
        4,
      )}`;
      conditionObject = {
        formFieldOption: `${conditionalFieldOutput}`,
        dropdownOption: 'is greater than or equal to ...',
        formConditionValue: '1',
      };
      sectionName = `Section ${faker.random.alphaNumeric(4)}`;
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(
          recordTypeName,
          TestDepartments.Test_Department,
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Administer'],
          },
        );
      });

      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form fieldInput1 to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldInput1;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldInput1}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add form conditionalFieldOutput to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          conditionalFieldOutput;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${conditionalFieldOutput}`;
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
      await test.step('Go to forms tab', async () => {
        await recordTypesSettingsPage.proceedToFormTab();
      });
      await test.step('Add a greater than condition on a form conditionalFieldOutput', async () => {
        await formDesignerPage.getFormFieldIdValue(
          conditionalFieldOutput,
          sectionName,
        );
        await formDesignerPage.clickOnSpecificFormField(conditionalFieldOutput);
        await formDesignerPage.makeFieldCalculated();
        await formDesignerPage.fillCalculatedFieldValue(fieldInput1);
        await formDesignerPage.addCondition(
          fieldInput1,
          'is greater than',
          'number',
          '1',
        );
        await formDesignerPage.verifyConditionPresent(
          `When ${fieldInput1} is greater than 1.00`,
        );
        await formDesignerPage.clickOnDone();
      });

      await test.step('Go to Workflow tab and select step', async () => {
        await recordTypesSettingsPage.proceedToFeesTab();
        await feeDesignerPage.createFee('FeeLabel');
        await feeDesignerPage.clickOnFeeLabel();
        await feeDesignerPage.setCalculation(
          '$ flat',
          'number',
          conditionObject,
        );
      });

      await test.step('Create Record with Conditional Form Fields', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citCitizenEmail,
        );
      });
    },
  );

  test("Fields with eyeball icon don't have values count towards conditions on Fee Labels' Calculations @OGT-44713 @Xoriant_Test", async ({
    internalRecordPage,
    recordPage,
    page,
  }) => {
    await test.step('Go to record and fulfill the conditions on form fields', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add payment step and fee label', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Payment],
        'Adhoc-Payment',
      );
      await recordPage.addFeeByName('FeeLabel');
    });
    await test.step('validate feeValue for unfilfilled condition', async () => {
      expect(
        await page.locator(recordPage.elements.feeBill).innerText(),
      ).toContain('$0.00');
    });
    await test.step('Go to record and fulfill the conditions on form fields', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '3',
      );
      await page.reload();
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '5',
      );
      await recordPage.validateFormFieldValueOnRecord(
        conditionalFieldOutput,
        sectionName,
        '5',
      );
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
      );
    });
    await test.step('validate feeValue for filfilled condition', async () => {
      await internalRecordPage.clickCustomStepByName('Adhoc-Payment');
      expect(
        await page.locator(recordPage.elements.feeBill).innerText(),
      ).toContain('$100.00');
    });
    await test.step('un-fulfill the conditions on form fields', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.editAndSaveFormField(
        sectionName,
        fieldInput1,
        '0',
      );
      await page.reload();
      await recordPage.validateFormFieldFireEyeOnRecord(
        conditionalFieldOutput,
        sectionName,
        true,
      );
    });
    await test.step('validate feeValue for unfilfilled condition', async () => {
      await internalRecordPage.clickCustomStepByName('Adhoc-Payment');
      expect(
        await page.locator(recordPage.elements.feeBill).innerText(),
      ).toContain('$0.00');
    });
  });
});
