import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

let locationInfo1: {
  name: string;
  type: number;
  location: string;
};
let locationInfo2: {
  name: string;
  type: number;
  location: string;
};

test.use({storageState: ADMIN_SESSION});
test.describe('Admin can verify the activity feed for bulk move @additionalLocation', () => {
  test.beforeEach(async ({locationsApi}) => {
    await test.step('location setup', async () => {
      //address 1
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      //address 2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse2.data.attributes.locationID,
      };
    });
  });
  test('Verify activity feed for bulk move when L1 is primary and L2 does not exist on the records @OGT-43933 @broken_test', async ({
    recordsApi,
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    let recordID1 = null;
    let recordName1 = null;
    await test.step('Create record via api', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      recordID1 = baseConfig.citTempData.recordId;
      recordName1 = baseConfig.citTempData.recordName;
    });
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and perform Bulk Move', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.canPerformBulkMove(locationInfo2.name, null);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(recordID1);
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key1 = TestUsers.Api_Admin.name + ` moved Record ${recordName1}`;
      const message =
        key1 + ` from ${locationInfo1.name} to ${locationInfo2.name}`;
      await internalRecordPage.validateActivityFeed(key1, message);
    });
  });
  test('Verify activity feed for bulk move when L1 is primary and L2 exists as additional location to record @OGT-43935 @broken_test', async ({
    recordsApi,
    locationsApi,
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    let recordID2 = null;
    let recordName2 = null;
    await test.step('Create record via api', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      recordID2 = baseConfig.citTempData.recordId;
      recordName2 = baseConfig.citTempData.recordName;
      await locationsApi.addAdditionalLocationToRecord(
        recordID2,
        locationInfo2.location,
        null,
      );
    });
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and perform Bulk Move', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.canPerformBulkMove(locationInfo2.name, null);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(recordID2);
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key2 = TestUsers.Api_Admin.name + ` moved Record ${recordName2}`;
      const message =
        key2 + ` from ${locationInfo1.name} to ${locationInfo2.name}`;
      await internalRecordPage.validateActivityFeed(key2, message);
    });
  });
  test('Verify activity feed for bulk move when L1 is additional location and L2 is not present on record @OGT-43938 @broken_test', async ({
    recordsApi,
    locationsApi,
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    let recordID3 = null;
    let recordName3 = null;
    await test.step('Create record via api', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      recordID3 = baseConfig.citTempData.recordId;
      recordName3 = baseConfig.citTempData.recordName;
      await locationsApi.addAdditionalLocationToRecord(
        recordID3,
        locationInfo1.location,
        null,
      );
    });
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and perform Bulk Move', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.canPerformBulkMove(locationInfo2.name, null);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(recordID3);
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key3 = `added additional location ${
        locationInfo1.name.split(',')[0]
      }`;
      const message =
        TestUsers.Api_Admin.name +
        ` added additional location ${locationInfo1.name} to Record ${recordName3}`;
      await internalRecordPage.validateActivityFeed(key3, message);
    });
  });
  test('Verify activity feed for bulk move when L1 and L2 are Additional location on record @OGT-43939 @broken_test', async ({
    recordsApi,
    locationsApi,
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    let recordID4 = null;
    let recordName4 = null;
    await test.step('Create record via api', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      recordID4 = baseConfig.citTempData.recordId;
      recordName4 = baseConfig.citTempData.recordName;
      await locationsApi.addAdditionalLocationToRecord(
        recordID4,
        [locationInfo1.location, locationInfo2.location].join(','),
        null,
      );
    });
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and perform Bulk Move', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.canPerformBulkMove(locationInfo2.name, null);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(recordID4);
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key4 = `moved Record ${recordName4} from`;
      await internalRecordPage.validateActivityFeed(key4, null, false);
    });
  });
  test('Verify activity feed for bulk move when L1 is Additional and L2 is a Primary location on record @OGT-43937 @broken_test', async ({
    recordsApi,
    locationsApi,
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    let recordID5 = null;
    let recordName5 = null;
    await test.step('Create record via api', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo2,
      );
      recordID5 = baseConfig.citTempData.recordId;
      recordName5 = baseConfig.citTempData.recordName;
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo1.location,
        null,
      );
    });
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and perform Bulk Move', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.canPerformBulkMove(locationInfo2.name, null);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(recordID5);
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key5 = `moved Record ${recordName5} from`;
      await internalRecordPage.validateActivityFeed(key5, null, false);
    });
  });
});
