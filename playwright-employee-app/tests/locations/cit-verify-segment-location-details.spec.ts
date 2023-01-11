import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

let locationInfo: {
  name: string;
  type: number;
  locationId: string;
};
let locationResponse = null;

test.use({storageState: ADMIN_SESSION});
test.describe('Verify the segment location details', () => {
  test.beforeEach(async ({locationsApi, recordsApi}) => {
    await test.step('location setup', async () => {
      locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Segment_Location,
      );
      locationInfo = {
        name: locationResponse.data.attributes.fullAddress,
        type: TestLocationTypes.Segment_Location,
        locationId: locationResponse.data.attributes.locationID,
      };
    });
    await recordsApi.createRecordWith(
      TestRecordTypes.Additional_Location_Test,
      baseConfig.citTestData.citCitizenEmail,
    );
    recordsApi.addPrimaryLocationToRecord(
      baseConfig.citTempData.recordId,
      locationInfo,
    );
  });

  test('Remove segment location from the record @OGT-34226 @broken_test', async ({
    internalRecordPage,
  }) => {
    await test.step('Proceed to record by record Id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Remove the segmenmt location', async () => {
      await internalRecordPage.removeLocation();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.primaryLocation,
        ),
      ).toBeHidden();
    });
  });
  test('Verify segment location details on record @OGT-34228 @broken_test', async ({
    internalRecordPage,
  }) => {
    await test.step('Proceed to record by record Id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Verify the segmenmt location details', async () => {
      await internalRecordPage.verifySegmentInformation({
        segmentStart: locationResponse.data.attributes.segmentPrimaryLabel,
        segmentEnd: locationResponse.data.attributes.segmentSecondaryLabel,
        segmentLabel: locationResponse.data.attributes.segmentLabel,
        segmentLength: '1716.93 feet',
      });
    });
  });
});
