import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

let locationAddress1: string = null;
let locationAddress2: string = null;
let bulkMoveRecordDetails: object = {};

test.use({storageState: ADMIN_SESSION});
test.describe('Admin can bulk move records from one location to another and verify the records', () => {
  test('Bulk move the records @OGT-46450 @broken_test @additionalLocation', async ({
    locationsApi,
    recordsApi,
    locationPage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('Create locations and records via a api for bulk move', async () => {
      //address 1
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationAddress1 = locationResponse1.data.attributes.fullAddress;
      const locationID1 = locationResponse1.data.attributes.locationID;
      const locationInfo1 = {
        name: locationAddress1,
        type: TestLocationTypes.Address_Location,
      };

      //address 2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationAddress2 = locationResponse2.data.attributes.fullAddress;
      const locationID2 = locationResponse2.data.attributes.locationID;
      const locationInfo2 = {
        name: locationAddress2,
        type: TestLocationTypes.Address_Location,
      };
      bulkMoveRecordDetails = {
        recordWithoutConflict: '2 records can move without conflict',
        recordWithNewLocation: '3 records are already on the new location',
        recordReplacePrimary: `2 records will replace ${locationAddress1} with ${locationAddress2} as the Primary Location`,
        recordLeaveAsPrimary: `1 record will leave ${locationAddress2} as the Primary Location`,
        recordAddOrLeave: `2 records will add (or leave) ${locationAddress2} as an Additional Location`,
      };
      //create record: 1
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );

      //create record 2
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationID2,
        null,
      );

      //create recoed  3
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo2,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationID1,
        null,
      );

      //create recoed  4
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationID1,
        null,
      );

      //create recoed  5
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        [locationID1, locationID2].join(','),
        null,
      );
    });

    //bulk move the locations
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step(`Search the location in search bar ${locationAddress1}`, async () => {
      await locationPage.searchLocation(locationAddress1);
    });

    await test.step('Perform bulk move and verify the record details on bulk move popup', async () => {
      await locationPage.canPerformBulkMove(
        locationAddress2,
        bulkMoveRecordDetails,
      );
    });
  });
});
