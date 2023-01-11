import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  CitEntityType,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

let locationInfo: {
  name: string;
  type: number;
  locationId: string;
};
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Records', () => {
  test('Verify that location flags are visible. @OGT-34513 @Xoriant_Test', async ({
    locationsApi,
    flagsApi,
    recordsApi,
    internalRecordPage,
  }) => {
    const flagName: string = 'Test_Flag_' + faker.random.alphaNumeric(4);
    await test.step('Create a new Location', async () => {
      const locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      locationInfo = {
        name: locationResponse.data.attributes.name,
        type: TestLocationTypes.Point_Location,
        locationId: locationResponse.data.attributes.locationID,
      };
    });
    await test.step('Create a flag and assign it to location', async () => {
      await flagsApi.createFlag(flagName, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo.locationId,
      );
    });
    await test.step('Create a record with location', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo,
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Navigate to Location Tab', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Verify the location flag is present', async () => {
      await internalRecordPage.verifyLocationFlag(flagName);
    });
  });
});
