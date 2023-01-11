import {test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('admin can view location settings', () => {
  let recordTypeName, recordNameCopy;
  test('Verify there is a new location tab in a RT setting to control location settings @OGT-33945 @Xoriant_Test', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33945 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Verify Locations tab', async () => {
      await recordTypesSettingsPage.proceedToLocationTab();
    });
  });

  test('Check by cloning a record type that the location settings persist @OGT-34188 @Xoriant_Test', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-34188 ${faker.random.alphaNumeric(4)}`;
      recordNameCopy = `${recordTypeName} Copy`;
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        workflowStepsToAdd: {
          payment: true,
        },
        locationTypesToEnable: {
          address: true,
          point: false,
          segment: true,
        },
      });
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Copy created record type', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
      await recordTypesSettingsPage.setNameFilter(`${recordTypeName}`);
      await recordTypesSettingsPage.copyRecordType(
        recordTypeName,
        recordNameCopy,
      );
    });
    await test.step('Proceed to Cloned Record Type', async () => {
      await recordTypesSettingsPage.selectRecordType(recordNameCopy);
    });
    await test.step('Proceed to Locations tab', async () => {
      await recordTypesSettingsPage.proceedToLocationTab();
    });
    await test.step('Verify Location settings are copied in Cloned Record Type', async () => {
      await recordTypesSettingsPage.proceedToLocationTab();
      await recordTypesSettingsPage.isLocationCheckboxDisabled(
        'Address',
        false,
      );
      await recordTypesSettingsPage.isLocationCheckboxDisabled('Point', true);
      await recordTypesSettingsPage.isLocationCheckboxDisabled(
        'Segment',
        false,
      );
    });
  });
});
