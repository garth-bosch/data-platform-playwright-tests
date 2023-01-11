import {test} from '../../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestLocationTypes,
  LocationSection,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Promote additional location @locations', () => {
  test('Citizen can promote additional location to primary - public portal @OGT-41191 @broken_test', async ({
    storeFrontRecordPage,
    locationsApi,
    recordsApi,
    myAccountPage,
  }) => {
    let addressLocationInfo1: {
      name: string;
      type: number;
      location: string;
    };
    let addressLocationInfo2: {
      name: string;
      location: string;
    };
    let pointLocationInfo: {
      name: string;
      location: string;
    };
    let segmentInfo: {
      primaryLabel: string;
      secondaryLabel: string;
      location: string;
    };

    await test.step('location setup', async () => {
      //address location1
      const locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocationInfo1 = {
        name: locationResponse.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse.data.attributes.locationID,
      };
      //address location2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        location: locationResponse2.data.attributes.locationID,
      };
      //point location
      const locationResponse3 = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      pointLocationInfo = {
        name: locationResponse3.data.attributes.name,
        location: locationResponse3.data.attributes.locationID,
      };
      //segment location
      const locationResponse4 = await locationsApi.createNewLocation(
        TestLocationTypes.Segment_Location,
      );
      segmentInfo = {
        primaryLabel: locationResponse4.data.attributes.segmentPrimaryLabel,
        secondaryLabel: locationResponse4.data.attributes.segmentSecondaryLabel,
        location: locationResponse4.data.attributes.locationID,
      };
    });
    await test.step('Draft record setup', async () => {
      await recordsApi.submitRecordDraft(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        addressLocationInfo1,
      );
    });
    await test.step(`Add Additional Locations to the draft record via API`, async () => {
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        [
          addressLocationInfo2.location,
          pointLocationInfo.location,
          segmentInfo.location,
        ].join(','),
        null,
      );
    });
    await test.step(`Start application draft`, async () => {
      await myAccountPage.gotoDraftRecordPageById();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Promote additional location 'address/pracel' to primary `, async () => {
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocationInfo1.name,
        LocationSection.PRIMARY,
      );
      await storeFrontRecordPage.promoteAdditionalLocations(
        addressLocationInfo2.name,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocationInfo2.name,
        LocationSection.PRIMARY,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocationInfo1.name,
        LocationSection.ADDITIONAL,
      );
    });
    await test.step(`Promote additional location 'Point' to primary `, async () => {
      await storeFrontRecordPage.promoteAdditionalLocations(
        pointLocationInfo.name,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        pointLocationInfo.name,
        LocationSection.PRIMARY,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocationInfo2.name,
        LocationSection.ADDITIONAL,
      );
    });
    await test.step(`Promote additional location 'segment' to primary `, async () => {
      await storeFrontRecordPage.promoteAdditionalLocations(
        segmentInfo.primaryLabel,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        segmentInfo.primaryLabel,
        LocationSection.PRIMARY,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        pointLocationInfo.name,
        LocationSection.ADDITIONAL,
      );
    });
  });
});
