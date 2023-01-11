// Feature: Employee - Settings/Record Types
//
// @OGT-33707 @broken_test @automationStatus:completed @PLCE-2765
// Scenario: Admin can set four different Numbering Pattern
// Given I goto system setting page as 'admin' user
// And I proceed to 'Record Types' configuration setting page
// When I create new record type and search it
// And I can see a data of record type created
// Then I can check four different Numbering Pattern

import {test} from '../../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';
import {NumberingPattern} from '../../../../src/pages/record-type-settings-pages/record-types-settings';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee - Settings/Record Types', () => {
  const recordTypeName = `@OGT-33707 ${faker.random.alphaNumeric(4)}`;
  test('Admin can set four different Numbering Pattern @OGT-33707 @broken_test', async ({
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
    await test.step('Navigate to record type settings page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
      await recordTypesSettingsPage.page
        .locator(recordTypesSettingsPage.elements.nextNumberAvailable)
        .waitFor({state: 'visible'});
    });
    await test.step('Check Annual numbering option. It should be selected by default', async () => {
      // annual means pattern 12-1234
      const nextNumber = recordTypesSettingsPage.page.locator(
        recordTypesSettingsPage.elements.nextNumberAvailable,
      );
      await expect(nextNumber).toHaveText(new RegExp('\\d{2}-\\d{4}\\s+'), {
        useInnerText: true,
      });
    });
    await test.step('Check Basic numbering option', async () => {
      //basic means pattern 123456
      await recordTypesSettingsPage.selectNumberingPattern(
        NumberingPattern.Basic,
      );
      const nextNumber = recordTypesSettingsPage.page.locator(
        recordTypesSettingsPage.elements.nextNumberAvailable,
      );
      await expect(nextNumber).toHaveText(new RegExp('\\d{6}'), {
        useInnerText: true,
      });
    });
    await test.step('Check Prefixed numbering option', async () => {
      //prefixed pattern for new RT most likely will be ABC-1 in this case
      await recordTypesSettingsPage.selectNumberingPattern(
        NumberingPattern.Prefixed,
      );
      await recordTypesSettingsPage.setNumberingPrefix('ABC');
      const nextNumber = recordTypesSettingsPage.page.locator(
        recordTypesSettingsPage.elements.nextNumberAvailable,
      );
      await expect(nextNumber).toHaveText(new RegExp('ABC-\\d'), {
        useInnerText: true,
      });
    });
    await test.step('Check Annual Prefixed numbering option', async () => {
      //Annual prefixed pattern is CBA-22-1
      await recordTypesSettingsPage.selectNumberingPattern(
        NumberingPattern.AnnualPrefixed,
      );
      await recordTypesSettingsPage.setNumberingPrefix('CBA');
      const nextNumber = recordTypesSettingsPage.page.locator(
        recordTypesSettingsPage.elements.nextNumberAvailable,
      );
      await expect(nextNumber).toHaveText(new RegExp('CBA-\\d{2}-\\d'), {
        useInnerText: true,
      });
    });
  });
});
