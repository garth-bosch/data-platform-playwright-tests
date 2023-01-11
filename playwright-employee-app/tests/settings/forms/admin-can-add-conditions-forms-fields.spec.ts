import {test, expect} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  CitEntityType,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe.configure({mode: 'serial'});
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName, userFlag, fieldName, sectionName, locationFlag;
  test.beforeEach(
    async ({
      recordTypesApi,
      employeeAppUrl,
      page,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
    }) => {
      recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
      fieldName = `Field ${faker.random.alphaNumeric(4)}`;
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
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
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
    },
  );
  test('Conditions can be based on user flag @OGT-33727 @Xoriant_Test', async ({
    formDesignerPage,
    flagsApi,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create User Flag', async () => {
      userFlag = `User Flag ${faker.random.alphaNumeric(4)}`;
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
    });
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Add User Flag condition on a form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('User Flag', userFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent(
        `When User Flag is ${userFlag}`,
      );
    });
  });
  test('Conditions can be based on location @OGT-33726 @Xoriant_Test', async ({
    formDesignerPage,
    flagsApi,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create Location Flag', async () => {
      locationFlag = `Location Flag ${faker.random.alphaNumeric(4)}`;
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Add Location Flag condition on a form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('Location Flag', locationFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent(
        `When Location Flag is ${locationFlag}`,
      );
    });
  });
  test('Conditions can be based on if the workflow is a renewal @OGT-33728 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Add Renewal condition on a form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('Renewal', 'True');
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent();
    });
  });
  test('Conditions apply for both MatchAll and MatchAny operator @OGT-33732 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    page,
  }) => {
    const matchOperatorList = ['Match All Conditions', 'Match Any Condition'];
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Add a condition on a form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('Renewal', 'True');
    });
    await test.step('Verify and Select a Match Operator', async () => {
      await expect(
        page.locator(formDesignerPage.elements.matchOperatorConditionForm),
      ).toContainText(matchOperatorList[0]);
      await expect(
        page.locator(formDesignerPage.elements.matchOperatorConditionForm),
      ).toContainText(matchOperatorList[1]);
      await formDesignerPage.selectMatchOperatorInConditionForm(
        matchOperatorList[1],
      );
    });
    await test.step('Click on Done Button', async () => {
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open the Form Field and Verify Match Operator is selected successfully', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await expect(
        await page
          .locator(formDesignerPage.elements.matchOperatorConditionForm)
          .locator(
            `option[value="${await page
              .locator(formDesignerPage.elements.matchOperatorConditionForm)
              .inputValue()}"]`,
          ),
      ).toHaveText(matchOperatorList[1]);
    });
  });
});
/*________________*/
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName, userFlag, fieldName, sectionName, locationFlag;
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
      await recordTypesApi.addFormSection(defaultFormSectionObject);
    });
  });
  test('Conditions can be based on checkbox type form field @OGT-33729 @Xoriant_Test', async ({
    formDesignerPage,
    flagsApi,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
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
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Create Location Flag', async () => {
      locationFlag = `Location Flag ${faker.random.alphaNumeric(4)}`;
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
    await test.step('Go to forms tab', async () => {
      await recordTypesSettingsPage.proceedToFormTab();
    });
    await test.step('Add Location Flag condition on Checkbox form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('Location Flag', locationFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open Checkbox form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent(
        `When Location Flag is ${locationFlag}`,
      );
    });
  });
  test('Conditions can be based on dropdown type form field @OGT-33730 @Xoriant_Test', async ({
    formDesignerPage,
    flagsApi,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
    await test.step('Add Drop-down form field to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
          .formSectionID,
      );
      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.DropDown;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName;
      defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
      await recordTypesApi.addFieldToFormSection(
        defaultPayloadForFormFieldsObject,
      );
    });
    await test.step('Create User Flag', async () => {
      userFlag = `User Flag ${faker.random.alphaNumeric(4)}`;
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
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
    await test.step('Add User Flag condition on Drop-down form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('User Flag', userFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open Drop-down form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent(
        `When User Flag is ${userFlag}`,
      );
    });
  });
  test('Conditions can be based on number type form field @OGT-33731 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
    await test.step('Add Number Type form field to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
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
    await test.step('Add Renewal condition on Number form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.addCondition('Renewal', 'True');
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open Number form field and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await formDesignerPage.verifyConditionPresent();
    });
  });
  test('Conditions can be added to date type field matching date criteria @OGT-33718 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
    await test.step('Add Date form field to Form Section', async () => {
      defaultPayloadForFormFieldsObject.data.attributes.formSectionID = Number(
        baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
          .formSectionID,
      );
      defaultPayloadForFormFieldsObject.data.attributes.dataType =
        FormFieldDataIntVal.DateField;
      defaultPayloadForFormFieldsObject.data.attributes.fieldLabel = fieldName;
      defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
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
    await test.step('Click and Verify Add Date condition on a form field', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await page.click(formDesignerPage.elements.addDateCondition);
      await formDesignerPage.elementVisible(
        formDesignerPage.elements.dateConditionSunday,
      );
      await expect(page.locator('text=Disable future dates')).toBeVisible();
      await expect(page.locator('text=Disable past dates')).toBeVisible();
    });
    await test.step('Verify Individual days of the week can be selected to be disabled', async () => {
      await formDesignerPage.verifyDisableDaysOfTheWeek();
    });
    await test.step('Verify Disable Past and Future Dates Functionality', async () => {
      await formDesignerPage.verifyDisablePastFutureDates();
    });
    await test.step('Click on Done Button', async () => {
      await formDesignerPage.clickOnDone();
    });
    await test.step('Validate Dates Conditions are present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await expect(page.locator('text=Disable Previous dates')).toBeVisible();
      await expect(page.locator('text=Disable Future dates')).toBeVisible();
    });
  });
  test('Conditions can be added to every type of form field @OGT-33717 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
    let fieldName;
    const formFields = [
      FormFieldDataIntVal.LongTextEntry,
      FormFieldDataIntVal.HelpText,
      FormFieldDataIntVal.SocialSecurityNumber,
      FormFieldDataIntVal.EmployerIDNumber,
      FormFieldDataIntVal.DigitalSignature,
      FormFieldDataIntVal.FileUpload,
    ];
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
    for await (const formField of formFields) {
      fieldName = `Field ${faker.random.alphaNumeric(5)}`;
      await test.step('Add form field to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(-1).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType = formField;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          fieldName;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${fieldName}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
        await page.goto(
          `${employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/form/`,
        );
      });
      await test.step('Add Renewal condition on form field', async () => {
        await formDesignerPage.clickOnSpecificFormField(fieldName);
        await formDesignerPage.addCondition('Renewal', 'True');
        await formDesignerPage.clickOnDone();
      });
      await test.step('Open form field and verify Added condition is present', async () => {
        await formDesignerPage.clickOnSpecificFormField(fieldName);
        await formDesignerPage.verifyConditionPresent();
      });
    }
  });
  test('Admin can add a Employee Identification number type field @OGT-33862 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
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
    await test.step('Add Employer ID Number field on a form and verify', async () => {
      await formDesignerPage.clickAddNewField();
      await formDesignerPage.addFormField(
        'Employer ID Number',
        baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
          .sectionLabel,
      );
      await expect(
        await page.locator(
          formDesignerPage.elements.formFieldByName.selector(
            'Employer ID Number',
          ),
        ),
      ).toBeVisible();
    });
  });
});
/*________________*/
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName, fieldName, sectionName;
  test.beforeEach(async ({recordTypesApi}) => {
    recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
    fieldName = `Field ${faker.random.alphaNumeric(5)}`;
    sectionName = `Section ${faker.random.alphaNumeric(4)}`;
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Add Multi Entry Form Section to Record Type', async () => {
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultFormSectionObject.formSection.sectionType = 1;
      await recordTypesApi.addFormSection(defaultFormSectionObject);
    });
  });
  test('Admin cannot add a condition to multi-entry form fields @OGT-46084 @Xoriant_Test', async ({
    formDesignerPage,
    recordTypesSettingsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesApi,
  }) => {
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
    await test.step('Open Checkbox form field and verify Add Condition button is not present', async () => {
      await formDesignerPage.clickOnSpecificFormField(fieldName);
      await expect(
        page.locator(formDesignerPage.elements.addConditionButtonInField),
      ).toBeHidden();
    });
  });
});
