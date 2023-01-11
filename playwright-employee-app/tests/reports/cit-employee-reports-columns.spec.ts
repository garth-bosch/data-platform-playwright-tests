import {expect, test} from '../../src/base/base-test';
import {ReportSections} from '../../src/pages/explore-reports-page';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  baseTemplatesReports,
  ReportTypesScopeId,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

const columnsToCheck = ['Date Draft Started'];
const columnsToUnCheck = ['Applicant PhoneNo', 'Balance Remaining'];
const colsForInspAndApprovals = ['Applicant PhoneNo', 'Archived'];
const colsForArchived = ['Archived'];
let reportName = '';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
//eslint-disable-next-line
test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

const openReportsPage = async ({page, employeeAppUrl, exploreReportsPage}) =>
  await test.step('Open the Explore reports page', async () => {
    await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    await exploreReportsPage.waitReportTableLoaded();
  });

test.describe('@report @rails-api-reporting @OGT-46178 @Xoriant_Test', () => {
  const reportsDataToTest = ['Payments', 'Payments Due', 'Ledger'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can add columns for ${initialReportName}`, async ({
      exploreReportsPage,
    }) => {
      reportName = `@OGT-46178-${faker.random.alphaNumeric(4)}`;
      await test.step('Open report section and go to payments tab', async () => {
        await exploreReportsPage.openReportSection(ReportSections.Payments);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Payments,
          initialReportName,
        );
      });
      await test.step('Edit Payments tab and select/verify given col name', async () => {
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.addColumn(columnsToCheck[0]);
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[0]),
        ).toBeTruthy();
      });
      await test.step('Save and Validate Report - payment', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
      });
      await test.step('Select report and verify the report has the column - payment', async () => {
        await exploreReportsPage.clickReport(reportName);
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[0]),
        ).toBeTruthy();
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-47316 @broken_test @Xoriant_Test', () => {
  const reportsDataToTest = [
    {
      reportType: ReportTypesScopeId.Payments,
      columns: baseTemplatesReports.generalReportWithColumnsActive,
      filters: baseTemplatesReports.applicantNameFilter,
    },
    {
      reportType: ReportTypesScopeId.Ledger,
      columns: baseTemplatesReports.columnsWithAdditionalFilter,
      filters: baseTemplatesReports.additionalColumnsFilter,
    },
  ];

  for (const reportData of reportsDataToTest) {
    test(`User can Remove columns from ${
      ReportTypesScopeId[reportData.reportType]
    }`, async ({exploreReportsPage, reportsApi, page, employeeAppUrl}) => {
      reportName = `@OGT-47316-${faker.random.alphaNumeric(4)}`;
      await test.step('Create new report and navigate to it', async () => {
        await reportsApi.createNewReport(
          reportName,
          reportData.reportType,
          `${JSON.stringify(reportData.columns)}`,
          `${JSON.stringify(reportData.filters)}`,
        );
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Remove columns from the report filter', async () => {
        await exploreReportsPage.proceedToReportSettings();
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.removeColumn(columnsToUnCheck[0]);
        await exploreReportsPage.removeColumn(columnsToUnCheck[1]);
      });
      await test.step('Save Report', async () => {
        await exploreReportsPage.clickFilterSaveButton();
      });
      await test.step('Select report and verify the report does not have the column', async () => {
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await expect(
          exploreReportsPage.isColumnAdded(columnsToUnCheck[0]),
        ).toBeFalsy();
        await expect(
          exploreReportsPage.isColumnAdded(columnsToUnCheck[1]),
        ).toBeFalsy();
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-46181 @Xoriant_Test', () => {
  const reportsDataToTest = ['Active Inspections', 'Inspection Results'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can add columns for ${initialReportName} report`, async ({
      exploreReportsPage,
    }) => {
      reportName = `@OGT-46181-${faker.random.alphaNumeric(4)}`;

      await test.step(`Open report section and go to ${initialReportName}`, async () => {
        await exploreReportsPage.openReportSection(ReportSections.Inspections);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Inspections,
          initialReportName,
        );
      });
      await test.step('Edit Payments Due tab and select/verify given col name', async () => {
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.addColumn(columnsToCheck[0]);
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[0]),
        ).toBeTruthy();
      });
      await test.step('Save and Validate Report', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
      });
      await test.step('Select report and verify the report has the column', async () => {
        await exploreReportsPage.clickReport(reportName);
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[0]),
        ).toBeTruthy();
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-47318 @broken_test @Xoriant_Test', () => {
  const reportsDataToTest = [
    {
      reportType: ReportTypesScopeId.Inspections,
      columns: baseTemplatesReports.additionalColumnsForInspections,
      filters: baseTemplatesReports.additionalColFilterInspections,
    },
    {
      reportType: ReportTypesScopeId.InspectionResults,
      columns: baseTemplatesReports.additionalColumnsForInspections,
      filters: baseTemplatesReports.additionalColFilterInspections,
    },
  ];

  for (const reportData of reportsDataToTest) {
    test(`User can remove columns from ${
      ReportTypesScopeId[reportData.reportType]
    } report`, async ({
      exploreReportsPage,
      reportsApi,
      page,
      employeeAppUrl,
    }) => {
      reportName = `@OGT-47318-${faker.random.alphaNumeric(4)}`;
      await test.step('Create new report and navigate to it', async () => {
        await reportsApi.createNewReport(
          reportName,
          reportData.reportType,
          `${JSON.stringify(reportData.columns)}`,
          `${JSON.stringify(reportData.filters)}`,
        );
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Remove columns from the report filter', async () => {
        await exploreReportsPage.proceedToReportSettings();
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.removeColumn(colsForInspAndApprovals[0]);
        await exploreReportsPage.removeColumn(colsForInspAndApprovals[1]);
      });
      await test.step('Save the report', async () => {
        await exploreReportsPage.clickFilterSaveButton();
      });
      await test.step('Select report and verify the report does not have the column', async () => {
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[0]),
        ).toBeFalsy();
        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[1]),
        ).toBeFalsy();
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-46175 @broken_test @Xoriant_Test', () => {
  const reportsDataToTest = ['Active Approvals', 'Completed Approvals'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can add/remove columns from view for ${initialReportName} report`, async ({
      exploreReportsPage,
      employeeAppUrl,
      page,
    }) => {
      reportName = `@OGT-46175-${faker.random.alphaNumeric(4)}`;

      await test.step('Open report section and go to payments due', async () => {
        await exploreReportsPage.openReportSection(ReportSections.Approvals);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Approvals,
          initialReportName,
        );
      });
      await test.step('Edit Payments Due tab and select/verify given col name', async () => {
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.addColumn(colsForInspAndApprovals[0]);
        await exploreReportsPage.addColumn(colsForInspAndApprovals[1]);
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[0]),
        ).toBeTruthy();
        await expect(
          exploreReportsPage.isColumnAdded(columnsToCheck[1]),
        ).toBeTruthy();
      });
      await test.step('Save and Validate Report', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
      });
      await test.step('Select report and verify the report has the column', async () => {
        await exploreReportsPage.clickReport(reportName);
        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[0]),
        ).toBeTruthy();
        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[1]),
        ).toBeTruthy();
      });

      await test.step('Remove columns from the report filter', async () => {
        await exploreReportsPage.proceedToReportSettings();
        await exploreReportsPage.clickColumnsTab();
        await exploreReportsPage.removeColumn(colsForInspAndApprovals[0]);
        await exploreReportsPage.removeColumn(colsForInspAndApprovals[1]);
      });
      await test.step('Save Report', async () => {
        await exploreReportsPage.clickFilterSaveButton();
      });
      await test.step('Select report and verify the report does not have the column', async () => {
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[0]),
        ).toBeFalsy();

        await expect(
          exploreReportsPage.isColumnAdded(colsForInspAndApprovals[1]),
        ).toBeFalsy();
      });
    });
  }
});

test.describe('@report @rails-api-reporting', () => {
  test('Deleted records should not be publicly searchable @OGT-34478 @broken_test @Xoriant_Test', async ({
    exploreReportsPage,
    employeeAppUrl,
    page,
    recordsApi,
    internalRecordPage,
  }) => {
    reportName = `plc_prefix_@OGT-34478-${faker.random.alphaNumeric(4)}`;
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        TestLocation.Test_Point_Location,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.verifyRecordIdPageNavigated();
      await recordsApi.deleteRecord();
    });
    await test.step('Open report section and go to payments due', async () => {
      await openReportsPage({page, employeeAppUrl, exploreReportsPage});
      await exploreReportsPage.openReportSection(ReportSections.Approvals);
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.closeFilterButton();
    });
    await test.step('Edit Payments Due tab and select/verify given col name', async () => {
      await exploreReportsPage.clickColumnsTab();
      await exploreReportsPage.addColumn(colsForArchived[0]);
      await expect(
        exploreReportsPage.isColumnAdded(colsForArchived[0]),
      ).toBeTruthy();
    });
    await test.step('Save and Validate Report', async () => {
      await exploreReportsPage.clickReportSaveButton();
      await exploreReportsPage.saveReportByDepartment(reportName);
      await exploreReportsPage.validateReportName(reportName);
    });
    await test.step('Select report and verify the report has the column', async () => {
      const totRows = await exploreReportsPage.getTotalRowsWithText(
        baseConfig.citTempData.recordName,
      );
      expect(Number(totRows)).toBeLessThanOrEqual(0);
    });
  });
});

test.describe('@report @rails-api-reporting @OGT-33637 @broken_test @Xoriant_Test', () => {
  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  test(`User can explore active, inspection results reports`, async ({
    exploreReportsPage,
    page,
    employeeAppUrl,
  }) => {
    reportName = `@OGT-33637-${faker.random.alphaNumeric(4)}`;
    await test.step(`Open report section and go to active inspections`, async () => {
      await exploreReportsPage.openReportSection(ReportSections.Inspections);
      await exploreReportsPage.clickActiveInspections();
      await exploreReportsPage.clickRecordFromRow();
    });
    await test.step('verify navigation', async () => {
      await expect(await page.url()).toContain('explore/records/');
    });
    await test.step('Navigate to reports again', async () => {
      await openReportsPage({page, employeeAppUrl, exploreReportsPage});
    });
    await test.step(`Open report section and go to Active Inspection Results`, async () => {
      await exploreReportsPage.openReportSection(ReportSections.Inspections);
      await exploreReportsPage.clickInspectionsResults();
      await exploreReportsPage.clickRecordFromRow();
    });
    await test.step('verify navigation', async () => {
      await expect(await page.url()).toContain('explore/records/');
    });
  });
});
