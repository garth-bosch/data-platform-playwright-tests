import {baseConfig} from '@opengov/cit-base/build';
import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  EMPLOYEE_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

let locationInfo1: {
  name: string;
  type: number;
  location: string;
};
test.use({storageState: ADMIN_SESSION});
const name = `OGT-34511${faker.random.alphaNumeric(4)}`;
test.describe('Employee - Location page (Explore)', () => {
  test.beforeEach(async ({locationsApi, recordsApi, projectsApi}) => {
    await test.step('location setup', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      await projectsApi.createProject(name);
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
    });
  });

  test('Employee can add and remove a new location flag @OGT-34511', async ({
    locationPage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and search', async () => {
      await locationPage.searchLocation(locationInfo1.name);
    });
    await test.step('I can add and remove a new location flag', async () => {
      await locationPage.canAddAndRemoveANewLocationFlag();
    });
  });

  test.use({storageState: EMPLOYEE_SESSION});
  test('Employee can add and remove an existing location flag @OGT-34512', async ({
    locationPage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and search', async () => {
      await locationPage.searchLocation(locationInfo1.name);
    });
    await test.step('I can add and remove a new location flag', async () => {
      await locationPage.canAddAndRemoveANewLocationFlag('CAT_LOCATION');
    });
  });

  test.use({storageState: ADMIN_SESSION});
  test('Admin can bulk move location records @OGT-33571', async ({
    locationPage,
    page,
    employeeAppUrl,
  }) => {
    const location2 = '1 search Unit 1, 1, 1 1';
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and search', async () => {
      await locationPage.searchLocation(locationInfo1.name);
    });
    await test.step('Get location with bulk move', async () => {
      await locationPage.getLocationWithBulkMove(locationInfo1.name, location2);
    });
    await test.step('Bulk move records and verify', async () => {
      const bulkMoveRecordDetails = {
        recordWithoutConflict: '4 records can move without conflict',
        recordWithNewLocation: '0 records are already on the new location',
        recordReplacePrimary: `4 records will replace ${locationInfo1.name} with ${location2} as the Primary Location`,
        recordAddOrLeave: `0 records will add (or leave) ${location2} as an Additional Location`,
      };
      await locationPage.canPerformBulkMove(location2, bulkMoveRecordDetails);
    });
  });
});
