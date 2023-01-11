import {test} from '../../src/base/base-test';
import {
  SUPER_USER_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

let locationInfo: {
  name: string;
  type: number;
  location: string;
};

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  test.beforeEach(
    async ({page, employeeAppUrl, navigationBarPage, locationsApi}) => {
      await test.step('Open EA and navigate to Settings page', async () => {
        const locationResponse1 = await locationsApi.createNewLocation(
          TestLocationTypes.Address_Location,
        );
        locationInfo = {
          name: locationResponse1.data.attributes.fullAddress,
          type: TestLocationTypes.Address_Location,
          location: locationResponse1.data.attributes.locationID,
        };

        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
    },
  );

  test(
    'If address integration is turned OFF, choosing a previously unused Location selection from google' +
      'maps creates a location page @OGT-44016 @Xoriant_test',
    async ({
      page,
      navigationBarPage,
      recordTypesSettingsPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Open Organization settings', async () => {
        await recordTypesSettingsPage.proceedToOrgSettingsPage();
      });
      await test.step('Verify "Set address integration" is turned off', async () => {
        await recordTypesSettingsPage.switchCommunitySettingsOptionState(
          'address integration',
          false,
        );
      });
      await test.step('Start a record draft', async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Record_Steps_Test.name,
        );
      });
      await test.step('Add Location', async () => {
        // Search works withot ID in the end of location name
        const locationNameWithoutId = locationInfo.name.substring(
          0,
          locationInfo.name.lastIndexOf(' '),
        );
        await createRecordPage.searchAndSelectLocation(locationNameWithoutId);
      });
      await test.step('Verify location is present in global search', async () => {
        await navigationBarPage.performGlobalSearchAndClick(locationInfo.name);
        await expect(page).toHaveURL(new RegExp('explore/locations'));
      });
    },
  );
});
