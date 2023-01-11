import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  CitEntityType,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {RecordStatus} from '../../src/pages/ea-record-page';

let locationInfo: {
  name: string;
  type: number;
  locationId: string;
};
let recordName1: string;

test.use({storageState: ADMIN_SESSION});
test.describe('Verify the notes and flags and record status on location page', () => {
  test.beforeEach(async ({locationsApi, recordsApi}) => {
    await test.step('location setup', async () => {
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
      recordName1 = baseConfig.citTempData.recordName;
    });
  });

  test('Verify point location can have notes @OGT-34204 @broken_test', async ({
    locationPage,
  }) => {
    await test.step('Navigate to location page by id', async () => {
      await locationPage.navigateToLocationPageById(locationInfo.locationId);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Add notes to location and verify', async () => {
      const notes: string = 'Test_Note_' + faker.random.alphaNumeric(4);
      await locationPage.addNotesToLocation(notes);
      expect(
        (
          await locationPage.page
            .locator(locationPage.elements.noteLink.selector('p'))
            .textContent()
        ).trim(),
      ).toContain(notes);
    });
  });
  test('Verify flags on point location @OGT-34205 @broken_test', async ({
    locationPage,
    flagsApi,
  }) => {
    const flagName: string = 'Test_Flag_' + faker.random.alphaNumeric(4);
    await test.step('flag setup', async () => {
      await flagsApi.createFlag(flagName, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo.locationId,
      );
    });
    await test.step('Navigate to location page by id', async () => {
      await locationPage.navigateToLocationPageById(locationInfo.locationId);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Verify flag on location page', async () => {
      expect(
        (
          await locationPage.page
            .locator(locationPage.elements.flagLabel.selector(flagName))
            .textContent()
        )
          .trim()
          .replace(/(\n)/g, ''),
      ).toContain(flagName);
    });
  });
  test('Verify records created using point location show up in the locations page, with appropriate status @OGT-34207 @broken_test', async ({
    locationPage,
    recordsApi,
    exploreReportsPage,
  }) => {
    let recordName2: string;
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo,
      );
      recordName2 = baseConfig.citTempData.recordName;
    });
    await test.step('Navigate to location page by id', async () => {
      await locationPage.navigateToLocationPageById(locationInfo.locationId);
      await locationPage.validateLocationPageVisibility();
    });
    await test.step('Verify record status on location page', async () => {
      expect(
        await exploreReportsPage.getColumnValueForRecord(
          'Status',
          locationPage.elements.locationTable,
          recordName1,
        ),
      ).toStrictEqual(RecordStatus.Active.toUpperCase());
      expect(
        await exploreReportsPage.getColumnValueForRecord(
          'Status',
          locationPage.elements.locationTable,
          recordName2,
        ),
      ).toStrictEqual(RecordStatus.Complete.toUpperCase());
    });
  });
  test('Create a record, change Point Location. System activity log filtered for the last X days @OGT-35026 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    createRecordPage,
    baseConfig,
    activityLogSettingsPage,
    locationsApi,
  }) => {
    await test.step('Navigate to created record by record Id', async () => {
      await internalRecordPage.proceedToRecordById(
        baseConfig.citTempData.recordId,
      );
      await internalRecordPage.clickRecordDetailsTabSection('Location');
    });
    const newLocationName =
      await test.step('Create new location to change it in generated record', async () => {
        const newLocationResponse = await locationsApi.createNewLocation(
          TestLocationTypes.Point_Location,
        );
        return newLocationResponse.data.attributes.name;
      });
    await test.step('Changed location in record with Point on map option', async () => {
      await createRecordPage.clickChangeLocation();
      await createRecordPage.searchAndSelectPointLocation(newLocationName);
    });
    await test.step('Navigate to system setting - Activity log', async () => {
      await activityLogSettingsPage.goto();
    });
    await test.step('Search for record with changed location in Activity log', async () => {
      await activityLogSettingsPage.verifyActivityLogPageVisible();
      await activityLogSettingsPage.searchForRecord(
        `${baseConfig.citTempData.recordName}`,
      );
    });
    await test.step('Verify if there is correct record about location changes in Activity log', async () => {
      const recordName = baseConfig.citTempData.recordName;
      const expectedMessage = `moved Record ${recordName} from ${locationInfo.name} to ${newLocationName}`;
      expect(await activityLogSettingsPage.getActivityLogMessage()).toMatch(
        new RegExp(expectedMessage),
      );
    });
  });
});
