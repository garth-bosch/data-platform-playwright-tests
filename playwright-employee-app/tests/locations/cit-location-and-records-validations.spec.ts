import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
  TestLocation,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';
import {faker} from '@faker-js/faker';

let locationInfo: {
  name: string;
  type: number;
  locationId: string;
};

test.use({storageState: ADMIN_SESSION});
test.describe('Verify Location and related Records', () => {
  const recordIdArray = [];
  const recordNameArray = [];
  let locationResponse: any;
  let recordTypeName1: string;
  let recordTypeName2: string;
  let locationName: string;

  test.beforeEach(async ({locationsApi, recordsApi, recordTypesApi}) => {
    recordTypeName1 = `Record_Type1_${faker.random.alphaNumeric(6)}`;

    await test.step('RecordType, Location and Record setup', async () => {
      await recordTypesApi.createRecordType(
        recordTypeName1,
        TestDepartments.Test_Department,
        {
          locationTypesToEnable: {
            address: true,
            point: true,
            segment: true,
          },
          publish: true,
        },
      );

      recordTypeName2 = `Record_Type2_${faker.random.alphaNumeric(6)}`;

      await recordTypesApi.createRecordType(
        recordTypeName2,
        TestDepartments.Test_Department,
        {
          locationTypesToEnable: {
            address: true,
            point: true,
            segment: true,
          },
          publish: true,
        },
      );
      locationResponse = await locationsApi.createNewLocation(
        TestLocationTypes.Point_Location,
      );
      locationName = locationResponse.data.attributes.name;
      locationInfo = {
        name: locationResponse.data.attributes.name,
        type: TestLocationTypes.Point_Location,
        locationId: locationResponse.data.attributes.locationID,
      };
    });

    await recordsApi.createRecordWith(
      {
        name: recordTypeName2,
        id: Number(baseConfig.citTempData.recordTypeId),
      },
      baseConfig.citTestData.citCitizenEmail,
    );
    await recordsApi.addPrimaryLocationToRecord(
      baseConfig.citTempData.recordId,
      TestLocation.Test_Point_Location_01,
    );

    await recordsApi.createRecordWith(
      {
        name: recordTypeName1,
        id: Number(baseConfig.citTempData.recordTypeId),
      },
      baseConfig.citTestData.citCitizenEmail,
      locationInfo,
    );
    recordIdArray[0] = baseConfig.citTempData.recordId;
    recordNameArray[0] = baseConfig.citTempData.recordName;
  });

  test('All location data for a single location loads in UI @OGT-44123 @Xoriant_Test', async ({
    locationPage,
    internalRecordPage,
    navigationBarPage,
    page,
  }) => {
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Perform global search for location and navigate to location page', async () => {
      await navigationBarPage.performSearch(locationName);
      await navigationBarPage.verifySearchResultsContainKeyword(locationName);
      await navigationBarPage.performGlobalSearchAndClick(locationName);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Verify the records are tied to location', async () => {
      expect(
        await page
          .locator(locationPage.elements.locationTitleOnLocationsPage)
          .innerText(),
      ).toContain(locationResponse.data.attributes.name);

      for (let i = 0; i < recordNameArray.length; i++) {
        await expect(
          page.locator(
            locationPage.elements.recordsTable.selector(
              String(`${recordNameArray[i]}`),
            ),
          ),
        ).toBeVisible();
      }
    });
  });

  test('After point location is created, check from the map page that the pin can be seen @OGT-34208 @Xoriant_Test', async ({
    internalRecordPage,
    navigationBarPage,
    page,
    exploreMapPage,
  }) => {
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Navigate to Map', async () => {
      await navigationBarPage.proceedToMap();
      await exploreMapPage.verifyMapLayout();
    });
    await test.step('Apply filters on Map page', async () => {
      await exploreMapPage.selectRecordTypeOption(recordTypeName2);
      await exploreMapPage.selectDateOption('Today');
    });
    await test.step('Verify the Pinned Location on the record Type', async () => {
      await expect(
        page.locator(exploreMapPage.elements.pinnedLocation),
      ).toBeVisible();
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
