import {test} from '../../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Add units to the location and verify @locations', () => {
  test('Add unit to the location and verify on primary location, confirm your submission and your submission pages @OGT-44243 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storefrontUrl,
    locationsApi,
    recordsApi,
    myAccountPage,
  }) => {
    let locationInfo1: {
      name: string;
      type: number;
      location: string;
    };
    const unitName: string = faker.random.alphaNumeric(4);
    let location: string = null;
    await test.step('location setup', async () => {
      const locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse.data.attributes.locationID,
      };
      await recordsApi.submitRecordDraft(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo1,
      );
    });
    await test.step(`Start application draft`, async () => {
      await page.goto(storefrontUrl);
      await myAccountPage.gotoDraftRecordPageById();
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Add unit to the location.`, async () => {
      await storeFrontRecordPage.addUnitTolocation(unitName);
    });
    await test.step(`Verify the unit added to the location`, async () => {
      location = `${locationInfo1.name.split(',')[0]} Unit ${unitName}`;
      await storeFrontRecordPage.verifyUnitOnLocation(unitName, location);
    });
    await test.step(`Verify the unit added to the location after move to next step and back to same step`, async () => {
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.goBackToPreviousStep();
      await storeFrontRecordPage.verifyUnitOnLocation(unitName, location);
    });
    await test.step(`Verify the location ${location} on conform your submission page`, async () => {
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.verifyUnitOnLocation(null, location);
    });
    await test.step(`Verify the location ${location} on your submission page`, async () => {
      await storeFrontRecordPage.proceedToNextStep('submit');
      await storeFrontRecordPage.navigateToRecordTab('Your Submission');
      await storeFrontRecordPage.verifyUnitOnLocation(null, location);
    });
  });
});
