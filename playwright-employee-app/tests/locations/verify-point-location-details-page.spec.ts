import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee app - Point locations @locations', () => {
  test.beforeEach(async ({recordsApi, recordPage}) => {
    await test.step('Create a new record with a Point location', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        TestLocation.Test_Point_Location,
      );
    });
    await test.step('Open the record', async () => {
      await recordPage.proceedToRecordById(baseConfig.citTempData.recordId);
    });
  });

  test(
    'Clicking the Display on map button on a created point location should take the user to' +
      ' the map page, and the location should be pinned @OGT-34199 @broken_test @Xoriant_test',
    async ({recordPage, locationPage}) => {
      let locationDetailsPage, lat, long;

      await test.step('Navigate to the Location tab', async () => {
        await recordPage.page
          .locator(recordPage.elements.recordLocationTab)
          .click();
      });

      await test.step('Navigate to location details page', async () => {
        [locationDetailsPage] = await Promise.all([
          recordPage.page.context().waitForEvent('page'),
          await recordPage.page
            .locator(recordPage.elements.viewLocationBtn)
            .click(),
        ]);
        await locationDetailsPage.waitForLoadState();
        await locationDetailsPage.bringToFront();
      });

      await test.step('Store location lat/long', async () => {
        const locationTitleLocator = locationDetailsPage.locator(
          locationPage.elements.locationTitleOnLocationsPage,
        );
        await expect(locationTitleLocator).toBeVisible();

        const coordinates = await locationTitleLocator
          .locator('small')
          .textContent();
        [lat, long] = coordinates
          .replace(/\n/g, '')
          .split(',')
          .map((v) => v.trim());
      });

      await test.step('CLick the "Display on Map" button', async () => {
        await locationDetailsPage
          .locator(locationPage.elements.displayOnMapButton)
          .click();
      });

      await test.step('Verify the point is displayed on the map', async () => {
        await locationDetailsPage
          .locator('#map')
          .locator('.leaflet-locationMarker-pane')
          .locator('path')
          .click();
      });

      await test.step('Get the lat/long and compare with the stored coordinates', async () => {
        const locationPopup = locationDetailsPage
          .locator('.popup-header')
          .locator('h4');
        await expect(locationPopup).toBeVisible();

        const coordinates = await locationPopup.textContent();
        const [actualLat, actualLong] = coordinates
          .split(':')[1]
          .replace(/\n/g, '')
          .split(',')
          .map((v) => v.trim());

        expect(actualLat).toEqual(lat);
        expect(actualLong).toEqual(long);
      });
    },
  );
});
