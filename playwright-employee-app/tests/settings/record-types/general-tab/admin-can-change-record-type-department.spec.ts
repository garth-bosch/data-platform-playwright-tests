// Feature: Employee - Settings/Record Types
//
// @OGT-33706 @automationStatus:completed @PLCE-2765
// Scenario: Admin can change record type department
// Given I goto system setting page as 'admin' user
// And I proceed to 'Record Types' configuration setting page
// When I create new record type and search it
// And I can see a data of record type created
// Then I can change the department

import {test} from '../../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee - Settings/Record Types', () => {
  const recordTypeName = `@OGT-33706 ${faker.random.alphaNumeric(4)}`;
  const deptName = '1. Inspectional Services';
  test('Admin can change record type department @OGT-33706', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
      });
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to record type settings and search and navigate', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
    });

    await test.step('Change record type department to [1. Inspectional services]', async () => {
      await recordTypesSettingsPage.changeDepartment(deptName);
    });

    await test.step('Verify that record type department was changed', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
      await recordTypesSettingsPage.selectDepartmentFilter(deptName);
      await recordTypesSettingsPage.setNameFilter(recordTypeName);
      await expect(
        recordTypesSettingsPage.page
          .locator(recordTypesSettingsPage.elements.recordType)
          .first(),
      ).toHaveText(recordTypeName);
      await expect(
        recordTypesSettingsPage.page
          .locator(recordTypesSettingsPage.elements.tableElementDepartment1)
          .first(),
      ).toHaveText(deptName);
    });
  });
});
