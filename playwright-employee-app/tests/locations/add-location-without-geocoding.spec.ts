import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee app - Manually created locations @locations', () => {
  test(
    "Manually Created Location Units with no Map Pin or Geocoding can't be added to a record" +
      ' @OGT-33955 @broken_test @Xoriant_test',
    async ({
      createRecordPage,
      navigationBarPage,
      page,
      employeeAppUrl,
      changeLocationModalPage,
      recordPage,
    }) => {
      const locationData = {
        locationName: `OGT-33955_${faker.random.alphaNumeric(4)}`,
        streetNo: faker.random.numeric(4).toString(),
        streetName: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: parseInt(faker.address.zipCode()),
        unit: '1',
        subDivision: '11',
        submit: true,
      };

      await test.step('Login to EA', async () => {
        await page.goto(employeeAppUrl);
      });

      await test.step('Start a record draft', async () => {
        await navigationBarPage.clickCreateRecordButton();
        await createRecordPage.selectRecordByName(
          TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST.name,
        );
      });

      await test.step('Add a new location', async () => {
        await changeLocationModalPage.addLocationAddNew(locationData);
      });

      await test.step('Submit the record', async () => {
        await createRecordPage.clickOnSaveRecordButton();
      });

      await test.step('Change the location to an existing one', async () => {
        await recordPage.page
          .locator(recordPage.elements.recordLocationTab)
          .click();
        await recordPage.clickChangeLocation();
        await recordPage.searchAndSelectLocation(TestLocation.Test_Tole.name);
        await recordPage.verifyLocationTitle(
          TestLocation.Test_Tole.name.split(',')[0], // Requires street # and name only
        );
      });

      await test.step('Change the location back to the new one', async () => {
        await page.reload();
        await recordPage.clickChangeLocation();
        await recordPage.searchAndSelectLocation(
          `${locationData.streetNo} ${locationData.streetName}`,
        );
        await recordPage.verifyLocationTitle(
          `${locationData.streetNo} ${locationData.streetName}`,
        );
      });
    },
  );
});
