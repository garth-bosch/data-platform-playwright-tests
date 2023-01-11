import {test} from '../../src/base/base-test';
import {
  SUPER_USER_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Open EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });

  test(
    'If address integration is turned OFF, google maps search results are available for' +
      ' location choice in Employee App @OGT-44005 @Xoriant_test',
    async ({
      commonApi,
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Verify "Set address integration" is turned off', async () => {
        await commonApi.changeAddressIntegrationState('disable');
      });
      await test.step('Start a record draft', async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Record_Steps_Test.name,
        );
      });
      await test.step('Start adding a location and search for "10 Main"', async () => {
        await createRecordPage.clickAddLocationBtn();
        await createRecordPage.page
          .locator(createRecordPage.elements.locationSearchBox)
          .click({delay: 500});
        await createRecordPage.page
          .locator(createRecordPage.elements.locationSearchBox)
          .fill('10 Main');
      });
      await test.step(
        'Verify the search results include all pre-existing locations' +
          " as well as all Google Maps' search results",
        async () => {
          // Verify search results are already shown
          await expect(
            createRecordPage.page
              .locator(createRecordPage.elements.allLocationSearchResults)
              .first(),
          ).toBeVisible();
          // Verify there are many search results
          expect(
            await createRecordPage.page
              .locator(createRecordPage.elements.allLocationSearchResults)
              .count(),
          ).toBeGreaterThanOrEqual(20);
        },
      );
    },
  );
});
