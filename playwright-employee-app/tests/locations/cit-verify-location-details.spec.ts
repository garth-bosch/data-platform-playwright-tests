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
test.describe('Verify the location details', () => {
  let locationInfo1;
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
    //address 1
    const locationResponse1 = await locationsApi.createNewLocation(
      TestLocationTypes.Address_Location,
    );
    locationInfo1 = {
      name: locationResponse1.data.attributes.fullAddress,
      type: TestLocationTypes.Address_Location,
      location: locationResponse1.data.attributes.locationID,
    };
    await recordsApi.createRecordWith(
      TestRecordTypes.Additional_Location_Test,
      baseConfig.citTestData.citCitizenEmail,
    );

    await locationsApi.addAdditionalLocationToRecord(
      baseConfig.citTempData.recordId,
      locationInfo1.location,
      null,
    );
    recordsApi.addPrimaryLocationToRecord(
      baseConfig.citTempData.recordId,
      locationInfo,
    );
  });

  test('User should be able to search for address by clicking on location @OGT-34477 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    page,
    locationPage,
    baseConfig,
  }) => {
    let givenAddressForLocation;
    await test.step('Proceed to record by record Id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Verify the View location button and click it', async () => {
      await page.isVisible(
        internalRecordPage.elements.additionalLocTriDotEllipsis,
      );
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        await internalRecordPage.clickAdditionalLocViewLocationButton(),
      ]);
      await newPage.waitForLoadState();
      givenAddressForLocation = await newPage
        .locator(locationPage.elements.locationTitleOnLocationsPage)
        .innerText();
      givenAddressForLocation.replace(/\n/g, '').trim();
    });
    await test.step('Verify some location page details', async () => {
      const fullAddress =
        baseConfig.citIndivApiData.locationStepResult.data.attributes
          .fullAddress;
      expect(givenAddressForLocation).toContain(
        baseConfig.citIndivApiData.locationStepResult.data.attributes.streetNo,
      );
      expect(fullAddress).toContain(
        baseConfig.citIndivApiData.locationStepResult.data.attributes
          .streetName,
      );
      expect(fullAddress).toContain(
        baseConfig.citIndivApiData.locationStepResult.data.attributes.city,
      );
      expect(fullAddress).toContain(
        baseConfig.citIndivApiData.locationStepResult.data.attributes.state,
      );
      expect(fullAddress).toContain(
        baseConfig.citIndivApiData.locationStepResult.data.attributes
          .postalCode,
      );
    });
  });
});
