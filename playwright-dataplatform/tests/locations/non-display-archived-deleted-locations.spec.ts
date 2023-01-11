import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Locations @locations', () => {
  test("Deleted locations aren't publicly searchable @OGT-44044 @broken_test @Xoriant_Test", async ({
    page,
    storeFrontUserPage,
    locationsApi,
  }) => {
    /*OGT-44043*/
    /*Not automatable as per discussion with DIG*/
    let locationDetailsTest1, givenLocation;
    await test.step(`Ceate new location`, async () => {
      locationDetailsTest1 = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
    });
    await test.step(`Navigate to storefront`, async () => {
      await page.reload();
      /* Adding to refresh page and avoid flakiness*/
    });
    await test.step(`Search for created location before deleting`, async () => {
      givenLocation = `${locationDetailsTest1.data.attributes.name}`;
      await storeFrontUserPage.searchForLocation(givenLocation);
      await page.reload();
      /* Adding to refresh page and avoid flakiness*/
    });
    await test.step(`Delete location and check if it exists.`, async () => {
      await locationsApi.deleteLocationById(`${locationDetailsTest1.data.id}`);
      /*Ensuring the hooks does not run and error out */
      baseConfig.citTempData.locationId = '';
      await storeFrontUserPage.searchForLocation(givenLocation, false);
    });
  });
});
