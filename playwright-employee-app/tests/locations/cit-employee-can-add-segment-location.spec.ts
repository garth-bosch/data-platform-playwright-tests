import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Segment location @locations', () => {
  test.beforeEach(
    async ({
      page,
      employeeAppUrl,
      navigationBarPage,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      await test.step('Login to EA and start a record draft', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.validateOpenGovLogoVisibility(true);
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Additional_Location_Test.name,
        );
      });

      await test.step('Start adding a segment location', async () => {
        await createRecordPage.clickAddLocationBtn();
        await createRecordPage.selectSegmentLocationType();
      });
    },
  );

  test(
    'User is able to choose "From" point on the map and select endpoint from the search' +
      ' @OGT-34219 @broken_test @Xoriant_test',
    async ({createRecordPage}) => {
      await test.step('As the Ending Location search for address', async () => {
        await createRecordPage.chooseSegmentLocationPoint(
          'ending',
          'Washington, PA 15301, USA',
        );
      });

      await test.step('As the Starting Location choose a point on the map', async () => {
        await createRecordPage.putPointOnMap();
      });

      await test.step('Confirm the segment selection and verify it is saved', async () => {
        await createRecordPage.confirmSelectedSegmentLocation();
        await createRecordPage.verifyAddedPrimaryLocation(
          /^[ \w]+ - Washington \(Segment\)$/,
        );
      });
    },
  );

  //* TODO: This is a partial duplicate of @OGT-34218.  The other test is a storefront test, while this is an employee test @duplicate
  test(
    'User is able to select "From" street number from the search and click on the map to' +
      ' choose the endpoint @Xoriant_test @broken_test',
    async ({createRecordPage}) => {
      await test.step('As the Starting Location search for address', async () => {
        await createRecordPage.chooseSegmentLocationPoint(
          'starting',
          'Washington, PA 15301, USA',
        );
      });

      await test.step('As the Ending Location choose a point on the map', async () => {
        await createRecordPage.putPointOnMap();
      });

      await test.step('Confirm the segment selection and verify it is saved', async () => {
        await createRecordPage.confirmSelectedSegmentLocation();
        await createRecordPage.verifyAddedPrimaryLocation(
          /^Washington - [ \w]+ \(Segment\)$/,
        );
      });
    },
  );
});
