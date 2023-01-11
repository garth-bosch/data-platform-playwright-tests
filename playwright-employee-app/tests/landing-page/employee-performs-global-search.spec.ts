import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee - Global Search', () => {
  test('Validate employee can search for other employees in Employee App @smoke', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(
        page,
        navigationBarPage,
        employeeAppUrl,
        'Ghost Test',
        'Ghost Tester',
      );
    });
  });

  // This test relies on static data
  test('Validate employee can search for a searchable form field in Employee App @OGT-33562 @broken_test', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(
        page,
        navigationBarPage,
        employeeAppUrl,
        'looking_for_me',
        'Record GH-',
      );
    });
  });

  test('Validate employee can search for a location in Employee App @OGT-33563', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
    locationsApi,
  }) => {
    let name = '';
    await test.step('location setup', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      const locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      name = locationInfo1.name;
    });
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(page, navigationBarPage, employeeAppUrl, name, name);
    });
  });

  // This test relies on static data
  test('Validate employee can search for a project in Employee App @OGT-33565 @broken_test', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(
        page,
        navigationBarPage,
        employeeAppUrl,
        'Ghost_project',
        'Ghost_project',
      );
    });
  });

  // This test relies on static data
  test('Validate employee can search for a record in Employee App @OGT-33564 @broken_test', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(
        page,
        navigationBarPage,
        employeeAppUrl,
        'GH-2',
        'Record GH-',
      );
    });
  });

  // This test relies on static data
  test('Validate employee can search location has many units in Employee App @OGT-40707 @broken_test', async ({
    page,
    navigationBarPage,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await baseTest(
        page,
        navigationBarPage,
        employeeAppUrl,
        '1 CITY HALL SQ BOSTON CITY HALL, Unit 355, BOSTON, MA 02201-1020',
        'Unit 355, BOSTON, MA 02201-1020',
      );
    });
  });
});

async function baseTest(
  page,
  navigationBarPage,
  employeeAppUrl,
  textToEnter: string,
  expectedText: string,
) {
  await page.goto(employeeAppUrl);
  await navigationBarPage.performSearchContaining(textToEnter);
  await navigationBarPage.verifySearchResultsContainKeyword(expectedText);
}
