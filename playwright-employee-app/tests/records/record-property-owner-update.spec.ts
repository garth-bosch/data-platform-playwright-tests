import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.setTimeout(120000);
test.describe('Employee App - Updates to Records @records @record-steps', () => {
  let locationsDataCreated = {};
  const ownerDetails = {
    ownerName: 'test 01',
    ownerPhone: '2992992999',
    ownerEmail: 'xxx@gmail.com',
    ownerStreetNo: '22222',
    ownerStreetName: 'some street',
    ownerUnit: 'some Unit',
    ownerCity: 'Philly',
    ownerState: 'CA',
    ownerPostalCode: '22112',
  };

  const verifyOwnerDetails = {
    name: 'verifyThis',
    email: ownerDetails.ownerEmail,
    phone: ownerDetails.ownerPhone,
    address: `${ownerDetails.ownerStreetNo} ${ownerDetails.ownerStreetName} ${ownerDetails.ownerCity}, ${ownerDetails.ownerState} ${ownerDetails.ownerPostalCode}`,
  };
  let locationAtt,
    locationName = '';
  test.beforeEach(
    async ({
      navigationBarPage,
      page,
      locationsApi,
      locationPage,
      createRecordPage,
    }) => {
      await test.step(`Create a location`, async () => {
        locationsDataCreated = await locationsApi.createNewLocation(
          TestLocationTypes.Address_Location,
        );
      });
      await test.step(`Navigate to that location`, async () => {
        locationAtt = locationsDataCreated[`data`][`attributes`];
        locationName = locationAtt[`name`];
        await page.goto(baseConfig.employeeAppUrl);
        await locationPage.searchLocation(locationName);
      });
      await test.step(`Update Owner info`, async () => {
        await locationPage.updateOwnerInformation(ownerDetails);
      });
      await test.step(`Create a record `, async () => {
        await navigationBarPage.clickCreateRecordButton();
        await createRecordPage.selectRecordByName(
          TestRecordTypes.Storefront_locations_enabled,
        );
      });
      await test.step(`Add that location and save record`, async () => {
        await createRecordPage.searchAndSelectLocation(
          `${locationAtt.streetNo} ${locationAtt.streetName}, ${locationAtt.city}, ${locationAtt.state}`,
        );
        await createRecordPage.clickOnSaveRecordButton();
      });
    },
  );

  /*  The test is too small to put in two tests .. @OGT-44345 @OGT-44344 + :: Both combined in Jira*/
  test(' Record Property owner data can be successfully updated @OGT-44345 @broken_test @Xoriant_Test @known_defect', async ({
    internalRecordPage,
  }) => {
    /*@OGT-44248*/
    /* above also covered */
    await test.step('Navigate to employee app - Location tab', async () => {
      await internalRecordPage.proceedToRecordByUrl(); // Giving enough time to reflect the location.
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    await test.step('Verify the edit location fields', async () => {
      await internalRecordPage.verifyLocationEditFields();
    });
    await test.step('Update and verify the owner info', async () => {
      const updateOwnerDetails = ownerDetails;
      updateOwnerDetails.ownerName = 'verifyThis';
      await internalRecordPage.updatePropertyOwnerInformation(
        updateOwnerDetails,
      );
      await internalRecordPage.verifyPropertyOwnerInformation(
        verifyOwnerDetails,
      );
    });
  });
});
