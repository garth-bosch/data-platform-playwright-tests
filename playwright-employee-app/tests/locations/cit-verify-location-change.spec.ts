import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

let locationInfo;
let locationResponse = null;

test.use({storageState: ADMIN_SESSION});
test.describe('Verify that changes are successfully made to a location', () => {
  test.beforeEach(async ({locationsApi, recordsApi}) => {
    await test.step('location setup', async () => {
      locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo = {
        name: locationResponse.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        id: locationResponse.data.attributes.locationID,
      };
    });
    await recordsApi.createRecordWith(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
      locationInfo,
    );
  });

  test('Change location from the record @OGT-33957', async ({
    internalRecordPage,
    locationPage,
  }) => {
    await test.step('Proceed to record by record Id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
    });
    await test.step('Navigate to location page by id', async () => {
      await locationPage.navigateToLocationPageById(locationInfo.locationId);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Add a unit and verify the added unit', async () => {
      await locationPage.addNewUnit('@OGT-33957 Unit');
      await locationPage.verifyAddedUnit('@OGT-33957 Unit');
    });
  });
});
