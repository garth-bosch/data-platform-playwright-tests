import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Search related', () => {
  let recordTypeName;
  test('User can search for specific record template type while creating a record @OGT-33575 @Xoriant_Test @smoke', async ({
    recordTypesApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    recordTypesSettingsPage,
  }) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33575 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
        workflowStepsToAdd: {
          inspection: true,
        },
      });
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to record type settings and search and navigate', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recordTypeName);
    });
  });
});
