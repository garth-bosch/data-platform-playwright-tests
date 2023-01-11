import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Location Settings in RT', () => {
  let recordTypeName;

  test.beforeEach(
    async ({recordTypesApi, employeeAppUrl, page, baseConfig}) => {
      await test.step('Create a Record Type', async () => {
        recordTypeName = `Rec_Type_Name_${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(
          recordTypeName,
          'Test Department',
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Administer'],
            workflowStepsToAdd: {
              inspection: true,
            },
            locationTypesToEnable: {
              address: false,
              point: false,
              segment: true,
            },
          },
        );
      });
      await test.step('Navigate to locations settings', async () => {
        await page.goto(employeeAppUrl);
        await page.goto(
          `${baseConfig.employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/locations`,
        );
      });
    },
  );

  test(`Check that Address can be enabled/disabled @OGT-33947 @broken_test @Xoriant_Test [Only IO tests] `, async ({
    recordTypesSettingsPage,
  }) => {
    await test.step('Go to Record type section and select record type', async () => {
      await recordTypesSettingsPage.selectLocation('Address');
    });
    await test.step('Go to Record type section and select record type', async () => {
      await recordTypesSettingsPage.selectLocation('Address', false);
    });
  });
  test(`Check that Point Location can be enabled/disabled @OGT-33948 @broken_test [Only IO tests] `, async ({
    recordTypesSettingsPage,
  }) => {
    await test.step('Go to Record type section and select record type', async () => {
      await recordTypesSettingsPage.selectLocation('Point');
    });
    await test.step('Go to Record type section and select record type', async () => {
      await recordTypesSettingsPage.selectLocation('Point', false);
    });
  });
});
