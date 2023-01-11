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
  test('Citizen: Add Address location as the main with additional locations of different types @OGT-40197 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    locationsApi,
    storeFrontUserPage,
  }) => {
    let addressLocationMain: string;
    let addressLocation: string;
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
      addressLocationMain = locationResponse1.data.attributes.fullAddress;
      addressLocationMain = addressLocationMain
        .replace(new RegExp(/(\d[0-9-]+$)/g), '')
        .trim();
      //address location2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocation = locationResponse2.data.attributes.fullAddress;
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
        addressLocationMain,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocationMain,
        LocationSection.PRIMARY,
      );
    });
    await test.step(`Add additional location address/parcel to the draft record`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectAddressLocationAdditional(
        addressLocation,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocation,
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
  test('Citizen: Add Point location as the main with additional locations of different types @OGT-40201 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    locationsApi,
    storeFrontUserPage,
  }) => {
    let pointLocationMain: string;
    let addressLocation: string;
    let pointLocation: string;
    let segmentInfo: {
      primaryLabel: string;
      secondaryLabel: string;
    };

    await test.step('location setup', async () => {
      //address location1
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      pointLocationMain = locationResponse1.data.attributes.name;
      //address location2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocation = locationResponse2.data.attributes.fullAddress;
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
      // await storeFrontRecordPage.clickLocationType(LocationTypes.POINT);
      await storeFrontRecordPage.searchAndSelectPointLocation(
        pointLocationMain,
        LocationSection.PRIMARY,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        pointLocationMain,
        LocationSection.PRIMARY,
      );
    });
    await test.step(`Add additional location address/parcel to the draft record`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectAddressLocationAdditional(
        addressLocation,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocation,
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
  test('Citizen: Add Segment location as the main with additional locations of different types @OGT-40204 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    locationsApi,
    storeFrontUserPage,
  }) => {
    let primarySegmentLocation: {
      primaryLabel: string;
      secondaryLabel: string;
    };
    let addressLocation: string;
    let pointLocation: string;
    let segmentInfo: {
      primaryLabel: string;
      secondaryLabel: string;
    };

    await test.step('location setup', async () => {
      //address location1
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Segment_Location,
      );
      primarySegmentLocation = {
        primaryLabel: locationResponse1.data.attributes.segmentPrimaryLabel,
        secondaryLabel: locationResponse1.data.attributes.segmentSecondaryLabel,
      };
      //address location2
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocation = locationResponse2.data.attributes.fullAddress;
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
      await storeFrontRecordPage.searchAndSelectSegmentLocation(
        primarySegmentLocation,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        primarySegmentLocation.primaryLabel,
        LocationSection.PRIMARY,
      );
    });
    await test.step(`Add additional location address/parcel to the draft record`, async () => {
      await storeFrontRecordPage.clickAdditionalLocationBtn();
      await storeFrontRecordPage.searchAndSelectAddressLocationAdditional(
        addressLocation,
      );
      await storeFrontRecordPage.verifyLocationIsDisplayed(
        addressLocation,
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
