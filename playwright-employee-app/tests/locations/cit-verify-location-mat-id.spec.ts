import {expect, test} from '../../src/base/base-test';
import {
  SUPER_USER_SESSION,
  TestLocation,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee app - Locations MAT integration @locations', () => {
  test(
    'MAT ID field not present for standard admin or employee users on Location pages' +
      ' @OGT-44668 @Xoriant_test',
    async ({authPage, page, locationPage, baseConfig, locationsApi}) => {
      let locationId: string;
      await test.step('Search for the location from the MAT', async () => {
        const response = await locationsApi.searchLocation(
          TestLocation.Location_with_MAT_id.name,
        );
        locationId = response.entityID;
        await page.goto(
          `${baseConfig.employeeAppUrl}/#/explore/locations/${locationId}`,
        );
        await locationPage.validateLocationPageVisibility();
      });
      await test.step('Verify MAT ID is visible', async () => {
        const matId: string = await locationPage.getDetailsPropertyValue(
          'MatID',
        );
        expect(matId).toBeDefined();
        expect(matId.length).toBeGreaterThan(0);
      });
      await test.step('Re-login as an Employee user', async () => {
        await authPage.logout();
        await authPage.page.waitForNavigation();
        await authPage.loginAs(
          baseConfig.citTestData.citEmployeeEmail,
          baseConfig.citTestData.citAppPassword,
        );
        await authPage.page.waitForNavigation();
        await authPage.loginSuccessful();
      });
      await test.step('Open the same location page', async () => {
        await page.goto(
          `${baseConfig.employeeAppUrl}/#/explore/locations/${locationId}`,
        );
        await locationPage.validateLocationPageVisibility();
      });
      await test.step('Verify MAT ID is not visible anymore', async () => {
        const matId: string = await locationPage.getDetailsPropertyValue(
          'MatID',
        );
        expect(matId).toBeUndefined();
      });
    },
  );
});
