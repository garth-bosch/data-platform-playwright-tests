import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: CITIZEN_SESSION});
test.describe('Employee App - locations additions and inspections etc', () => {
  const recordTypeName = `plc_rectype_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi}) => {
    /*_________*/
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
      {
        publish: true,
        enableLocations: true,
        enableAdditionalLocations: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
        workflowStepsToAdd: {
          inspection: true,
          document: true,
          approval: true,
          payment: true,
        },
        locationTypesToEnable: {
          address: true,
          point: true,
          segment: true,
        },
      },
    );
    /*_________*/
  });
  test('STR: Citizen: Add Address location as the main with additional locations of different types @OGT-40197 @broken_test @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    storefrontUrl,
    storeFrontUserPage,
  }) => {
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citCitizenEmail,
      );
      await page.goto(storefrontUrl);
      // await recordsApi.createRecordWith(
      //   TestRecordTypes.Additional_Location_Test,
      //   baseConfig.citTestData.citAdminEmail,
      // );
    });
    await test.step('Create record', async () => {
      await storeFrontUserPage.searchForRecord(
        baseConfig.citMultiRecordData
          .at(0)
          .data.attributes.recordNumber.toString(),
      );
      console.debug('___');
    });
  });
  /*__________________________________________________________________________________________ test 2*/
});
