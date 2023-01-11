import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Verify the new additional locations cannot be added after 99th', () => {
  const recordTypeName = `@OGT-Xoriant_${faker.random.alphaNumeric(4)}`;
  test.beforeEach(
    async ({recordTypesApi, recordsApi, baseConfig, locationsApi}) => {
      await recordTypesApi.createRecordType(
        recordTypeName,
        TestDepartments.Test_Department,
        {
          publish: true,
          enableLocations: true,
          enableAdditionalLocations: true,
          locationTypesToEnable: {
            point: true,
            segment: true,
            address: true,
          },
          employeeAccess: RecordTypeAccess['Can Edit'],
        },
      );
      await test.step('Create record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citAdminEmail,
        );
      });
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        null,
        99,
      );
    },
  );

  test('Admin: Add maximum (99) additional locations @OGT-40205 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    baseConfig,
  }) => {
    await test.step('Proceed to record by record Id and navigate to locations', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Verify the Additional location button is not clickable', async () => {
      await internalRecordPage.validateAdditionalLocation(99);
    });
  });
});
