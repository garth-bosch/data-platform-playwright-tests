import {test, expect} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
  TestLocationTypes,
  CitEntityType,
} from '@opengov/cit-base/build/constants/cit-constants';
import {
  LocationType,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
let locationInfo1: {
  name: string;
  type: number;
  location: string;
};
let locationInfo2: {
  name: string;
  type: number;
  location: string;
};
test.use({storageState: ADMIN_SESSION});
test.describe('Validate number of locations column availablity inside reports table for Inspection and Payment tab @additionalLocation @report', () => {
  const reportColumns = ['Number of Locations'];
  const filterByOption = ['Is Empty', 'Has Any Value'];
  const reportTypes = ['approvals', 'records', 'documents'];
  const locationFlagName1 =
    'API_TEST_FLAG_' + faker.random.alphaNumeric(4).toUpperCase();
  const locationFlagName2 =
    'API_TEST_FLAG_' + faker.random.alphaNumeric(4).toUpperCase();
  const locationFlagNames = [locationFlagName1, locationFlagName2];
  let recordNumber: string;
  test.beforeEach(async ({page, employeeAppUrl, exploreReportsPage}) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });
  });
  test('Verify Number of Locations column should be hidden for Inspection and Payment reports @OGT-43076', async ({
    exploreReportsPage,
  }) => {
    await test.step('Validate that Number of locations column should not present inside Inspection tab', async () => {
      await exploreReportsPage.clickEditInspectionActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.verifyColumnAvailability('Number of Locations');
    });
    await test.step('Validate that Number of locations column should not present inside Payment tab', async () => {
      await exploreReportsPage.clickEditPaymentsActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.verifyColumnAvailability('Number of Locations');
    });
  });
  test('Verify Number of Locations count depending on different location added in record in reports @OGT-43069 @broken_test', async ({
    exploreReportsPage,
    recordsApi,
    locationsApi,
  }) => {
    for (const reportType of reportTypes) {
      await test.step('Create a draft record without adding any location', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Additional_Location_Test,
          null,
          null,
          [
            {
              fieldName: 'Document',
              fieldValue: 'true',
            },
          ],
        );
      });
      await test.step('Navigate to active record section and select Number of Location column', async () => {
        await exploreReportsPage.reportPageIsVisible();
        await exploreReportsPage.selectReportType(reportType);
        await exploreReportsPage.clickEditReportActiveButton();
        await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
        await exploreReportsPage.addColumns(reportColumns);
      });
      await test.step('Filter out the record and verify record having no location added', async () => {
        await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
        await exploreReportsPage.createLocationFilter(
          'Record #',
          baseConfig.citTempData.recordName,
        );
        expect(
          await exploreReportsPage.getColumnValueForRecord(
            'Number of Locations',
            exploreReportsPage.elements.reportsTable,
            recordNumber,
          ),
        ).toStrictEqual(LocationType.WithoutLocation);
      });
      await test.step('Add a primary location to record and verify the number of location count', async () => {
        await recordsApi.addPrimaryLocationToRecord(
          baseConfig.citTempData.recordId,
          TestLocation.Test_Point_Location_01,
        );
        await exploreReportsPage.clickOnNoOfLocationsColumn(
          'Number of Locations',
        );
        expect(
          await exploreReportsPage.getColumnValueForRecord(
            'Number of Locations',
            exploreReportsPage.elements.reportsTable,
            recordNumber,
          ),
        ).toStrictEqual(LocationType.PrimaryLocation);
      });
      await test.step('Add one more additional location to record and verify the number of location count', async () => {
        const locationID1 = await locationsApi.getLocationIdFromLocationDetails(
          TestLocation.Test_Point_Location_02,
        );
        await locationsApi.addAdditionalLocationToRecord(
          baseConfig.citTempData.recordId,
          locationID1,
          null,
        );
        await exploreReportsPage.clickOnNoOfLocationsColumn(
          'Number of Locations',
        );
        expect(
          await exploreReportsPage.getColumnValueForRecord(
            'Number of Locations',
            exploreReportsPage.elements.reportsTable,
            recordNumber,
          ),
        ).toStrictEqual(LocationType.AdditionalLocation);
      });
    }
  });

  test('Verify filtering on the Number of Locations column for Active, approval and document reports @OGT-43078', async ({
    exploreReportsPage,
  }) => {
    for (const reportType of reportTypes) {
      await test.step(`Navigate to active record section for report types ${reportType}`, async () => {
        await exploreReportsPage.reportPageIsVisible();
        await exploreReportsPage.selectReportType(reportType);
        await exploreReportsPage.clickEditReportActiveButton();
      });
      await test.step('Filter out Number of Locations column and verify filter types', async () => {
        await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
        await exploreReportsPage.selectFilter('Number of Locations');
        await exploreReportsPage.verifyFilterOptions(filterByOption, false);
      });
    }
  });

  test('Verify location flag linked to Additional location should be displayed in the Location Flag column in reports @OGT-43174 @broken_test', async ({
    exploreReportsPage,
    recordsApi,
    locationsApi,
  }) => {
    await test.step('Create a Active record without adding any location', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        null,
        null,
        [
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
        ],
      );
    });

    await test.step('Add additional location to the record having location flag', async () => {
      const locationID = await locationsApi.getLocationIdFromLocationDetails(
        TestLocation.Test_Point_Location_01,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationID,
        null,
      );
    });
    await test.step('Navigate to active report section and add the required column', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(['Location Flags']);
    });

    await test.step('Filter out the record containing additional location', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
    });
    await test.step('Verify location flags linked to the additional location should be displayed in the Location Flag column', async () => {
      expect(
        await exploreReportsPage.getColumnValueForRecord(
          'Location Flags',
          exploreReportsPage.elements.reportsTable,
          recordNumber,
        ),
      ).toStrictEqual('TEST');
    });
  });
  test('Verify location flags linked to either primary or additional location should be displayed in the Location Flag column @OGT-43175 @broken_test', async ({
    exploreReportsPage,
    recordsApi,
    locationsApi,
    flagsApi,
  }) => {
    await test.step('Create record and location via api and add locations to record', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse2.data.attributes.locationID,
      };
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo2.location,
        null,
      );
    });

    await test.step('Add location flag to location in the record', async () => {
      await flagsApi.createFlag(locationFlagName1, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo1.location,
      );
      await flagsApi.createFlag(locationFlagName2, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo2.location,
      );
    });

    await test.step('Navigate to active report section and add the required column', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(['Location Flags']);
    });

    await test.step('Filter out the record containing location flag in primary and additional locations', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
    });
    await test.step('Check any location flag linked to either the primary or additional location should be displayed in the Location Flag column', async () => {
      expect(await exploreReportsPage.getAllLocationFlags()).toEqual(
        expect.arrayContaining(locationFlagNames),
      );
    });
  });
  test('Verify that if multiple locations having the same flag then each flag should appear only once in reports @OGT-43176 @broken_test', async ({
    exploreReportsPage,
    recordsApi,
    locationsApi,
    flagsApi,
  }) => {
    await test.step('Create record and location via api and add locations to record', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse2.data.attributes.locationID,
      };
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo2.location,
        null,
      );
    });

    await test.step('Multiple locations with the same flag are attached to the record', async () => {
      await flagsApi.createFlag(locationFlagName1, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo1.location,
      );
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo2.location,
      );
    });

    await test.step('Navigate to active report section and add the required column', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(['Location Flags']);
    });

    await test.step('Filter out the record containing location flag in primary and additional locations', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
    });
    await test.step('Verify each flag should appear only once in reports', async () => {
      expect(
        (await exploreReportsPage.getAllLocationFlags()).toString(),
      ).toEqual(locationFlagName1);
    });
  });
  test('Allow for filtering on the location flag column for additional locations in reports @OGT-43172 @broken_test', async ({
    exploreReportsPage,
    recordsApi,
    locationsApi,
    flagsApi,
  }) => {
    await test.step('Create record and location via api and add locations to record', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse2.data.attributes.locationID,
      };
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citAdminEmail,
        locationInfo1,
      );
      await locationsApi.addAdditionalLocationToRecord(
        baseConfig.citTempData.recordId,
        locationInfo2.location,
        null,
      );
    });

    await test.step('Add flag to location in the record', async () => {
      await flagsApi.createFlag(locationFlagName1, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo1.location,
      );
      await flagsApi.createFlag(locationFlagName2, CitEntityType.LOCATION);
      await flagsApi.assignFlag(
        baseConfig.citTempData.flagId,
        CitEntityType.LOCATION,
        locationInfo2.location,
      );
    });

    await test.step('Navigate to active report section and add the required column', async () => {
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns(['Location Flags']);
    });

    await test.step('Filter out on Location Flags column', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.createLocationFilter(
        'Location Flags',
        locationFlagName1,
      );
    });
    await test.step('Apply filter option as "is" with flag value and verify records having flag should display in column', async () => {
      expect(
        (await exploreReportsPage.getAllLocationFlags()).toString(),
      ).toContain(locationFlagName1);
    });
  });
});
