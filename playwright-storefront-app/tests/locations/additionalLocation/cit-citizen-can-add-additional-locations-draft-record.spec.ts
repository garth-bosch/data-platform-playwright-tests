import {test} from '../../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestLocationTypes,
  LocationTypes,
  LocationSection,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Add additional location @locations', () => {
  test('Citizen can add additional locations to the draft record - public portal @OGT-41532 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    locationsApi,
    storeFrontUserPage,
  }) => {
    let addressLocation1: string;
    let addressLocation2: string;
    let pointLocation: string;
    let segmentInfo: {
      primaryLabel: string;
      secondaryLabel: string;
    };

    await test.step('location setup', async () => {
      //address location1
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocation1 = locationResponse1.data.attributes.fullAddress;
      addressLocation1 = addressLocation1
        .replace(new RegExp(/(\d[0-9-]+$)/g), '')
        .trim();
      //address location2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocation2 = locationResponse2.data.attributes.fullAddress;
      //Point location
      const locationResponse3 = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      pointLocation = locationResponse3.data.attributes.name;
      //Segment location
      const locationResponse4 = await locationsApi.createNewLocation(
        TestLocationTypes.Segment_Location,
      );
      segmentInfo = {
        primaryLabel: locationResponse4.data.attributes.segmentPrimaryLabel,
        secondaryLabel: locationResponse4.data.attributes.segmentSecondaryLabel,
      };
    });
    await test.step(`Start application draft`, async () => {
      await page.goto(storefrontUrl);
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Additional_Location_Test.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Add primary location to draft record`, async () => {
      await storeFrontRecordPage.clickLocationType(LocationTypes.ADDRESS);
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        addressLocation1,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocation1,
        LocationSection.PRIMARY,
      );
    });

    await test.step(`Add additional location address/parcel to the draft record`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectAddressLocationAdditional(
        addressLocation2,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocation2,
        LocationSection.ADDITIONAL,
      );
    });
    await test.step(`Add additional point location to the draft reocrd`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectPointLocation(
        pointLocation,
        LocationSection.ADDITIONAL,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        pointLocation,
        LocationSection.ADDITIONAL,
      );
    });
    await test.step(`Add additional segment location to the draft reocrd`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectSegmentLocation(segmentInfo);
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        segmentInfo.primaryLabel,
        LocationSection.ADDITIONAL,
      );
    });
  });
});
