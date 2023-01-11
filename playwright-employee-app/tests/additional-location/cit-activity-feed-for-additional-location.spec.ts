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
test.describe('Admin can verify the activity feed for additional locations @additionalLocation @broken_test', () => {
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
    });
  });
  test('Verify activity feed when primary location is present and additional location is promoted to primary @OGT-43385 @broken_test', async ({
    recordsApi,
    locationsApi,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Create record and location via api and add locations to record', async () => {
      const locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo2 = {
        name: locationResponse.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse.data.attributes.locationID,
      };
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo2.location,
        null,
      );
    });
    await test.step('Promote additional location to primary via api', async () => {
      await locationsApi.promoteAdditionalLocation(
        baseConfig.citTempData.recordId,
        locationInfo1,
        locationInfo2,
      );
    });
    await test.step('Login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key1 = `added additional location ${
        locationInfo2.name.split(',')[0]
      }`;
      const message =
        TestUsers.Api_Admin.name +
        ` added additional location ${locationInfo2.name} to Record ${baseConfig.citTempData.recordName}`;
      await internalRecordPage.validateActivityFeed(key1, message);

      const key2 =
        TestUsers.Api_Admin.name +
        ` moved Record ${baseConfig.citTempData.recordName}`;
      const message2 =
        key2 + ` from ${locationInfo1.name} to ${locationInfo2.name}`;
      await internalRecordPage.validateActivityFeed(key2, message2);
    });
  });
  test('Verify activity feed when primary location empty and additional location is promoted to primary @OGT-43386 @broken_test', async ({
    recordsApi,
    locationsApi,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Create record via api and locations to record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo1.location,
        null,
      );
    });
    await test.step('Promote additional location to primary via api', async () => {
      await locationsApi.promoteAdditionalLocation(
        baseConfig.citTempData.recordId,
        null,
        locationInfo1,
      );
    });
    await test.step('Login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key = TestUsers.Api_Admin.name + ` added additional location`;
      const message =
        key +
        `${locationInfo1.name} to Record ${baseConfig.citTempData.recordName}`;
      await internalRecordPage.validateActivityFeed(key, message);
    });
  });
  test('Verify activity feed after adding additional location to the record @OGT-43383 @broken_test', async ({
    recordsApi,
    locationsApi,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Create record via api and locations to record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo1.location,
        null,
      );
    });

    await test.step('Login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Proceed to record and click on activity feed section', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
    });
    await test.step('Verify the activity feed message', async () => {
      const key = TestUsers.Api_Admin.name + ` added additional location`;
      const message =
        key +
        `${locationInfo1.name} to Record ${baseConfig.citTempData.recordName}`;
      await internalRecordPage.validateActivityFeed(key, message);
    });
  });
});
