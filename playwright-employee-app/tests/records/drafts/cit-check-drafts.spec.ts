import {expect, test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsConditionsObject,
  defaultPayloadForFormFieldsObject,
  defaultPayloadForRenewal,
  FormFieldDataIntVal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('admin can view Help Text in Location', () => {
  test('Verify that record submissions are atomic, i.e.  record is not half-submitted.  @OGT-34249 @Xoriant_Test @Xoriant_Remove_01', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    createRecordPage,
    internalRecordPage,
  }) => {
    let recordTypeName;
    const testName = 'OGT-34249';
    const sectionName = `${testName}_Section_${faker.random.alphaNumeric(4)}`;
    const fieldName = `${testName}_Field_${faker.random.alphaNumeric(4)}`;

    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-34249 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
        workflowStepsToAdd: {
          inspection: true,
        },
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form field to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.isCalculation = true;
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add Condition to field', async () => {
        defaultPayloadForFormFieldsConditionsObject.data.attributes.recordTypeID =
          Number(baseConfig.citTempData.recordTypeId);
        defaultPayloadForFormFieldsConditionsObject.data.attributes.entityPrimaryKey =
          Number(
            baseConfig.citIndivApiData.addFieldToFormToRTResult.at(0).data
              .attributes.formFieldID,
          );
        await recordTypesApi.addFieldConditionToFieldSection(
          defaultPayloadForFormFieldsConditionsObject,
        );
      });
    });
    await test.step('Create record draft using that RT', async () => {
      await page.goto(employeeAppUrl);
      await createRecordPage.startDraftRecordFor(
        'Test Department',
        recordTypeName,
      );
      await createRecordPage.clickSaveDraftButton();
    });
    await test.step('Navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });

    await test.step('Verify Draft is visible', async () => {
      await expect(
        page.locator(createRecordPage.elements.saveDraftButton),
      ).toBeVisible();
      await expect(
        page.locator(createRecordPage.elements.discardDraftButton),
      ).toBeVisible();
    });
  });

  test('Admin can add a new form field to an existing multi entry section  @OGT-33825 @broken_test @Xoriant_Test @Xoriant_Temp_01_Mahesh @known_defect @incomplete', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    createRecordPage,
    internalRecordPage,
    recordTypeWorkflowApi,
    formDesignerPage,
  }) => {
    let recordTypeName;
    const testName = 'OGT-33825';
    const newFieldName = 'Field 3';
    const sectionName = `plc_prefix_${testName}_Section_${faker.random.alphaNumeric(
      4,
    )}`;
    const fieldName = `plc_prefix_${testName}_Field_${faker.random.alphaNumeric(
      4,
    )}`;

    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33825 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
        workflowStepsToAdd: {
          inspection: true,
        },
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionType = 1;
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form field to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.isCalculation = true;
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Add Condition to field', async () => {
        const renewPay = JSON.parse(JSON.stringify(defaultPayloadForRenewal));
        renewPay.recordType.renews = true;
        renewPay.recordType.recordTypeID = baseConfig.citTempData.recordTypeId;
        renewPay.recordType.name = recordTypeName;
        renewPay.recordType.status = 1;
        await recordTypeWorkflowApi.setRecordTypeToRenewalFlowsOnOff(renewPay);
      });

      await test.step('Add Condition to field', async () => {
        defaultPayloadForFormFieldsConditionsObject.data.attributes.multiEntryFormField =
          true;
        defaultPayloadForFormFieldsConditionsObject.data.attributes.recordTypeID =
          Number(baseConfig.citTempData.recordTypeId);
        defaultPayloadForFormFieldsConditionsObject.data.attributes.entityPrimaryKey =
          Number(
            baseConfig.citIndivApiData.addFieldToFormToRTResult.at(0).data
              .attributes.formFieldID,
          );
        await recordTypesApi.addFieldConditionToFieldSection(
          defaultPayloadForFormFieldsConditionsObject,
        );
      });
    });
    await test.step('Create record draft using that RT', async () => {
      await page.goto(employeeAppUrl);
      await createRecordPage.startDraftRecordFor(
        'Test Department',
        recordTypeName,
      );
      await createRecordPage.clickSaveDraftButton();
      await createRecordPage.saveRecord();
    });
    await test.step('Navigate to the record', async () => {
      await internalRecordPage.clickCustomStepByName('Details');
      await expect(
        page.locator(
          internalRecordPage.elements.fieldOnRecordPage.selector(sectionName),
        ),
      ).toBeVisible();
    });

    await test.step('Update record typw with new field', async () => {
      await page.goto(
        `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/form`,
      );
      await formDesignerPage.addFormField('Number', sectionName, newFieldName);
    });
    await test.step('Renew the  record', async () => {
      await internalRecordPage.navigateById();
      await internalRecordPage.startDraftRecordRenewal();
      await internalRecordPage.submitRenewalRecord();
    });
    await test.step('Verify the new filed exists', async () => {
      await expect(
        page.locator(
          internalRecordPage.elements.fieldOnRecordPage.selector(newFieldName),
        ),
      ).toBeVisible();
    });
  });
});
