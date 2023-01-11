import {test} from '../../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestLocationTypes,
  LocationSection,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Additional locations limit @locations', () => {
  test('Citizen user can not add more than 99 locations to draft record Page - public portal @OGT-41332 @broken_test', async ({
    storeFrontRecordPage,
    locationsApi,
    myAccountPage,
    recordsApi,
  }) => {
    let locationInfo1: {
      name: string;
      type: number;
      location: string;
    };
    await test.step('Draft record setup', async () => {
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

    await test.step(`Add '99' Additional Locations to the draft record via API`, async () => {
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        null,
        99,
      );
    });
    await test.step(`Start application draft`, async () => {
      await myAccountPage.gotoDraftRecordPageById();
      await storeFrontRecordPage.proceedToNextStep();
    });
    await test.step(`Verify additional location count`, async () => {
      const message =
        '99 additional locations. 0 more can be added to this record.';
      await storeFrontRecordPage.verifyAdditionalLocationCountDetails(message);
    });
    await test.step(`Verify tooltip on 'Add Additional Location' button`, async () => {
      const tooltip =
        "You have reached the maximum of 99 additional locations. If you need more locations you'll need to create another record.";
      await storeFrontRecordPage.verifyTooltip(
        storeFrontRecordPage.elements.addAdditionalLocationHintText,
        tooltip,
      );
    });
    await test.step(`Remove one additional location and verify the count and tooltip`, async () => {
      const tooltip = '';
      const message =
        '98 additional locations. 1 more can be added to this record';
      //get fisrt location name which is added to draft record via api
      const locationElement =
        storeFrontRecordPage.elements.locationText.selector(
          LocationSection.ADDITIONAL,
          '',
        );
      const locationName = await (
        await storeFrontRecordPage.page
          .locator(locationElement)
          .elementHandles()
      )
        .at(0)
        .innerText();
      await storeFrontRecordPage.removeAdditionalLocations(locationName);
      await storeFrontRecordPage.verifyAdditionalLocationCountDetails(message);
      await storeFrontRecordPage.verifyTooltip(
        storeFrontRecordPage.elements.addAdditionalLocationHintText,
        tooltip,
      );
    });
  });
});
