import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

let locationInfo: {
  name: string;
  type: number;
  locationId: string;
};

test.use({storageState: ADMIN_SESSION});
test.describe(' Verify Location and related Records', () => {
  const recordIdArray = [];
  const recordNameArray = [];

  test.beforeEach(async ({locationsApi, recordsApi}) => {
    await test.step('Location setup', async () => {
      const locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      locationInfo = {
        name: locationResponse.data.attributes.name,
        type: TestLocationTypes.Point_Location,
        locationId: locationResponse.data.attributes.locationID,
      };
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo,
      );
      recordIdArray[0] = baseConfig.citTempData.recordId;
      recordNameArray[0] = baseConfig.citTempData.recordName;
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo,
      );
      recordIdArray[1] = baseConfig.citTempData.recordId;
      recordNameArray[1] = baseConfig.citTempData.recordName;
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo,
      );
      recordIdArray[2] = baseConfig.citTempData.recordId;
      recordNameArray[2] = baseConfig.citTempData.recordName;
    });
  });

  test('All locations load successfully with correct records displaying @OGT-44046 @broken_test @Xoriant_Test', async ({
    locationPage,
  }) => {
    await test.step('Navigate to location page by id', async () => {
      await locationPage.navigateToLocationPageById(locationInfo.locationId);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Verify the records are tied to location', async () => {
      for (let i = 0; i < recordNameArray.length; i++) {
        await expect(
          locationPage.page.locator(
            locationPage.elements.recordsTable.selector(
              String(`${recordNameArray[i]}`),
            ),
          ),
        ).toBeVisible();
      }
    });
  });

  test.afterEach(async ({recordsApi}) => {
    await test.step(`Delete multiple record id's created`, async () => {
      let errorDeletingRecord = false;
      for (let i = 0; i < recordIdArray.length; i++) {
        /* Keep a log to later debug for any flakiness etc or help someone know we are already deleting same*/
        console.log(
          `Deleting record id's in after each: so ignore in after hooks: recordId: ${recordIdArray[i]}`,
        );
        try {
          await recordsApi.deleteRecord(recordIdArray[i]);
        } catch (e) {
          errorDeletingRecord = true;
          console.error(
            `Something went wrong but will continue to delete others`,
          );
          console.error(`${e}`);
        }
      }
      baseConfig.citTempData.recordId =
        ''; /* not required to delete in afterhooks */
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (errorDeletingRecord) {
        console.log(`Given record id's : ${recordIdArray}`);
        throw new Error('While deleting the record some error');
      }
    });
  });
});
