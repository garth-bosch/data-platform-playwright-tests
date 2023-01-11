import {expect, test} from '../../../src/base/base-test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {ApiDepartments} from '@opengov/cit-base/build/api-support/api/departmentsApi';
import {ReportTypesScopeId} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.setTimeout(270 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Reports @report @record_reports', () => {
  test('User can verify the report table after sort @OGT-33595 @broken_test @Xoriant_test', async ({
    exploreReportsPage,
    recordPage,
    reportsApi,
    page,
  }) => {
    const departmentName = ApiDepartments.automatedTesting.name;
    const reportName = `${
      baseConfig.citTestData.plcPrefix
    }${faker.random.alphaNumeric(4)}_OGT-33595`;
    const columns = [
      'Record #',
      'Record Type',
      'Applicant Email',
      'Applicant PhoneNo',
      'Building Type',
      'City',
      'Country',
      'Date Draft Started',
      'Department',
      'Expiration Date',
      'Historical Permit No',
      'Is Historical',
      'Is Renewal',
      'Last Record Activity',
      'Latitude',
      'Location Flags',
      'Location ID',
      'Longitude',
      'Lot Area',
      'MAT ID',
      'Mbl',
      'Occupancy Type',
      'Owner City',
      'Owner Country',
      'Owner Email',
      'Owner Name',
      'Owner Phone No',
      'Owner Postal Code',
      'Owner State',
      'Owner Street Name',
      'Owner Street No',
      'Owner Unit',
      'Permit/License Issued Date',
      'Postal Code',
      'Project Label',
      'Project Name',
      'Property Use',
      'Renewal Submitted',
    ];
    let reportId;

    const availableColumns = await reportsApi.getReportColumns(
      ReportTypesScopeId.Records,
      columns,
    );

    await test.step(`Create a new report`, async () => {
      reportId = await reportsApi.createReport(
        page,
        availableColumns,
        reportName,
        ReportTypesScopeId.Records,
        departmentName,
      );
    });

    await test.step(`Open the report by ID ${reportId}`, async () => {
      await exploreReportsPage.openReportId(reportId, departmentName);
      await exploreReportsPage.waitReportTableLoaded();
    });

    for (const column of columns) {
      await test.step(`Verify sort by [${column}] column`, async () => {
        const recordsCountBeforeSort =
          await exploreReportsPage.getTotalRecordsCount();
        await recordPage.clickColumnName(column);
        await exploreReportsPage.waitReportTableLoaded();
        const recordsCountAfterSort =
          await exploreReportsPage.getTotalRecordsCount();
        expect(recordsCountAfterSort).toEqual(recordsCountBeforeSort);
      });
    }
  });
});
