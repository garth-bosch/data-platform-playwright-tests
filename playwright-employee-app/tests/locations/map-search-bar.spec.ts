import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee app - Locations', () => {
  test(
    'Verify that points can be narrowed down by using the search in the map view while adding' +
      ' segment locations @OGT-35106 @broken_test @Xoriant_test',
    async ({createRecordPage, navigationBarPage, page, employeeAppUrl}) => {
      let initialAddressValue: string;
      await test.step('Open the EA', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Start a record draft', async () => {
        await navigationBarPage.clickCreateRecordButton();
        await createRecordPage.selectDepartment('Test Department');
        await createRecordPage.selectRecordByName(
          TestRecordTypes.Additional_Location_Test.name,
          true,
        );
      });
      await test.step('Select the Segment Location type', async () => {
        await createRecordPage.clickAddLocationBtn();
        await createRecordPage.page
          .locator(createRecordPage.elements.segmentLocationType)
          .click();
      });
      await test.step('Fill the search box and store a location point', async () => {
        await createRecordPage.searchOnMap('Boston');
        await createRecordPage.putPointOnMap();

        const addressValueElement = createRecordPage.page.locator(
          createRecordPage.elements.segmentStartingLocation,
        );
        await expect(addressValueElement).toHaveValue(/.+/);

        initialAddressValue = await addressValueElement.inputValue();

        await createRecordPage.page
          .locator(createRecordPage.elements.clearSegment)
          .click();
      });
      await test.step(
        'Put another value into the search box and verify the location has been' +
          ' changed',
        async () => {
          await createRecordPage.searchOnMap('New York City');
          await createRecordPage.putPointOnMap();

          const addressValueElement = createRecordPage.page.locator(
            createRecordPage.elements.segmentStartingLocation,
          );
          await expect(addressValueElement).toHaveValue(/.+/);

          const finalAddressValue = await addressValueElement.inputValue();
          expect(finalAddressValue).not.toEqual(initialAddressValue);
        },
      );
    },
  );
});
