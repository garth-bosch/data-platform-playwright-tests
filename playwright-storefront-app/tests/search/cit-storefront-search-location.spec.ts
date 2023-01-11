import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
let locationResponse = null;
test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Search @search', () => {
  test.beforeEach(async ({storefrontUrl, page}) => {
    await page.goto(storefrontUrl);
  });

  test('Citizen can search for address on the Storefront using location name. @OGT-34479 @Xoriant_Test', async ({
    storeFrontUserPage,
    locationsApi,
  }) => {
    await test.step('Create a location', async () => {
      locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
    });
    await test.step('Search for the location using location name and verify same', async () => {
      const givenAddress = `${locationResponse.data.attributes.streetNo} ${locationResponse.data.attributes.streetName}, ${locationResponse.data.attributes.city}, ${locationResponse.data.attributes.state}`;
      await storeFrontUserPage.searchForLocation(
        locationResponse.data.attributes.name,
        true,
        givenAddress,
      );
    });
  });
});
