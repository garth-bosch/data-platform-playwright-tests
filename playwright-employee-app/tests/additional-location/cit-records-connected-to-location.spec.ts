import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

let locationInfo1: {
  name: string;
  type: number;
  location: string;
};
const testName = `@OGT-33953`;
const name = `${testName}${faker.random.alphaNumeric(4)}`;
test.use({storageState: ADMIN_SESSION});
test.describe('Check if records connected to location are displayed on its address page', () => {
  test.beforeEach(async ({locationsApi, projectsApi, recordsApi}) => {
    await test.step('location setup', async () => {
      //address 1
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
  test('Check if records connected to location are displayed on its address page @OGT-33953 @Xoriant_Test', async ({
    locationPage,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('login to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to the location page and search', async () => {
      await locationPage.searchLocation(locationInfo1.name);
    });
    await test.step('Proceed to record and add project', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.addToProject(name, testName);
    });
    await test.step('Search and verify project/label is associated with location', async () => {
      await locationPage.searchLocation(locationInfo1.name);
      await locationPage.verifyProjectLabelInRecord(testName);
    });
  });
});
