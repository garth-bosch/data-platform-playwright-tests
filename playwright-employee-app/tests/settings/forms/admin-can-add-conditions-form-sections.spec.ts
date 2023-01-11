import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  CitEntityType,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {defaultFormSectionObject} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings @forms-conditions', () => {
  let recordTypeName, userFlag, locationFlag, sectionName;
  test.beforeEach(async ({flagsApi, recordTypesApi}) => {
    await test.step('Create a Record Type, User flag and Location Flag', async () => {
      recordTypeName = `Form Sections ${faker.random.alphaNumeric(4)}`;
      userFlag = `User Flag ${faker.random.alphaNumeric(4)}`;
      locationFlag = `Location Flag ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
    });
  });
  test('Conditions can be added to form sections @OGT-33719 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
    formDesignerPage,
  }) => {
    await test.step('Add Single Entry Form Section to Record Type', async () => {
      sectionName = `Single Entry Section ${faker.random.alphaNumeric(4)}`;
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      await recordTypesApi.addFormSection(defaultFormSectionObject);
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
    await test.step('Add User Flag condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('User Flag', userFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When User Flag is ${userFlag}`,
      );
    });
    await test.step('Add Location Flag condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('Location Flag', locationFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When Location Flag is ${locationFlag}`,
      );
    });
    await test.step('Add Renewal condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('Renewal', 'True');
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When Record is being renewed`,
      );
    });
  });
  test('Conditions can be added to multi entry form sections @OGT-33720 @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
    formDesignerPage,
  }) => {
    await test.step('Add Multi Entry Form Section to Record Type', async () => {
      sectionName = `Multi Entry Section ${faker.random.alphaNumeric(4)}`;
      defaultFormSectionObject.formSection.sectionLabel = sectionName;
      defaultFormSectionObject.formSection.recordTypeID = Number(
        baseConfig.citTempData.recordTypeId,
      );
      defaultFormSectionObject.formSection.sectionType = 1;
      await recordTypesApi.addFormSection(defaultFormSectionObject);
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
    await test.step('Add User Flag condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('User Flag', userFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When User Flag is ${userFlag}`,
      );
    });
    await test.step('Add Location Flag condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('Location Flag', locationFlag);
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When Location Flag is ${locationFlag}`,
      );
    });
    await test.step('Add Renewal condition on a form section', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.addCondition('Renewal', 'True');
      await formDesignerPage.clickOnDone();
    });
    await test.step('Open form section and verify Added condition is present', async () => {
      await formDesignerPage.clickOnSpecificSection(sectionName);
      await formDesignerPage.verifyConditionPresent(
        `When Record is being renewed`,
      );
    });
  });
});
