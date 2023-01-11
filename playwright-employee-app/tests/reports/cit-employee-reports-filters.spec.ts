import {test} from '../../src/base/base-test';
import {ReportSections} from '../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {expect} from '@playwright/test';
import {ReportTypesScopeId} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.setTimeout(180 * 1000);
test.use({storageState: ADMIN_SESSION});
//eslint-disable-next-line
test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

let reportName = '';
const filterName = 'Applicant Name';
const filterValue = 'api admin';

const openReportsPage = async ({page, employeeAppUrl, exploreReportsPage}) =>
  await test.step('Open the Explore reports page', async () => {
    await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    await exploreReportsPage.waitReportTableLoaded();
  });

test.describe('@report @rails-api-reporting @OGT-46179 @Xoriant_Test', () => {
  const reportsDataToTest = ['Payments', 'Payments Due', 'Ledger'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can Add filters for columns in ${initialReportName} report`, async ({
      exploreReportsPage,
    }) => {
      reportName = `@OGT-46179-${faker.random.alphaNumeric(4)}`;
      await test.step(`Open report section and go to ${initialReportName}`, async () => {
        await exploreReportsPage.openReportSection(ReportSections.Payments);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Payments,
          initialReportName,
        );
      });
      await test.step('Create a filter', async () => {
        await exploreReportsPage.clickFiltersTab();
        await exploreReportsPage.createFilter(filterName, filterValue);
      });
      await test.step('Save report and validate it', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
        await exploreReportsPage.clickReport(reportName);
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalNamedRows(
          filterName,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toEqual(getTotalNamedRows);
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-47317 @Xoriant_Test', () => {
  const reportTypesToTest = [
    ReportTypesScopeId.Payments,
    ReportTypesScopeId.Ledger,
  ];

  for (const reportType of reportTypesToTest) {
    test(`User can Remove filters for columns in ${ReportTypesScopeId[reportType]} report`, async ({
      exploreReportsPage,
      reportsApi,
      employeeAppUrl,
      page,
    }) => {
      reportName = `@OGT-47317-${faker.random.alphaNumeric(4)}`;
      await test.step('Create new report and navigate to it', async () => {
        await reportsApi.createNewReport(reportName, reportType);
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Close filter and save and refresh', async () => {
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Records,
        );
        await exploreReportsPage.closeFilterButton();
        await exploreReportsPage.clickFilterSaveButton();
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalRowsWithText(
          filterValue,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toBeGreaterThan(getTotalNamedRows);
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-46182 @Xoriant_Test', () => {
  const reportsDataToTest = ['Active Inspections', 'Inspection Results'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can add filters for ${initialReportName} report`, async ({
      exploreReportsPage,
    }) => {
      reportName = `@OGT-46182-${faker.random.alphaNumeric(4)}`;
      await test.step(`Open report section and go to ${initialReportName}`, async () => {
        await exploreReportsPage.openReportSection(ReportSections.Inspections);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Inspections,
          initialReportName,
        );
      });
      await test.step('Create a filter', async () => {
        await exploreReportsPage.clickFiltersTab();
        await exploreReportsPage.createFilter(filterName, filterValue);
      });
      await test.step('Save report and validate it', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
        await exploreReportsPage.clickReport(reportName);
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalNamedRows(
          filterName,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toEqual(getTotalNamedRows);
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-47319 @Xoriant_Test', () => {
  const reportTypesToTest = [
    ReportTypesScopeId.Inspections,
    ReportTypesScopeId.InspectionResults,
  ];

  for (const reportType of reportTypesToTest) {
    test(`User can remove filters from ${ReportTypesScopeId[reportType]} report`, async ({
      exploreReportsPage,
      reportsApi,
      page,
      employeeAppUrl,
    }) => {
      reportName = `@OGT-47319-${faker.random.alphaNumeric(4)}`;
      await test.step('Create new report and navigate to it', async () => {
        await reportsApi.createNewReport(reportName, reportType);
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Close filter and save and refresh', async () => {
        await exploreReportsPage.proceedToReportSettings();
        await exploreReportsPage.closeFilterButton();
        await exploreReportsPage.clickFilterSaveButton();
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalRowsWithText(
          filterValue,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toBeGreaterThan(getTotalNamedRows);
      });
    });
  }
});

test.describe('@report @rails-api-reporting @OGT-46176 @broken_test @Xoriant_Test', () => {
  const reportsDataToTest = ['Active Approvals', 'Completed Approvals'];

  test.beforeEach(
    async ({page, employeeAppUrl, exploreReportsPage}) =>
      await openReportsPage({page, employeeAppUrl, exploreReportsPage}),
  );

  for (const initialReportName of reportsDataToTest) {
    test(`User can add/remove filters for columns from view for ${initialReportName} report`, async ({
      exploreReportsPage,
      employeeAppUrl,
      page,
    }) => {
      reportName = `@OGT-46176-${faker.random.alphaNumeric(4)}`;
      await test.step(`Open report section and go to ${initialReportName}`, async () => {
        await exploreReportsPage.openReportSection(ReportSections.Approvals);
        await exploreReportsPage.proceedToReportSettings(
          ReportSections.Approvals,
          initialReportName,
        );
      });
      await test.step('Create a filter', async () => {
        await exploreReportsPage.clickFiltersTab();
        await exploreReportsPage.createFilter(filterName, filterValue);
      });
      await test.step('Save report and validate it', async () => {
        await exploreReportsPage.clickReportSaveButton();
        await exploreReportsPage.saveReportByDepartment(reportName);
        await exploreReportsPage.validateReportName(reportName);
        await exploreReportsPage.clickReport(reportName);
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalNamedRows(
          filterName,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toEqual(getTotalNamedRows);
      });

      await test.step('Close Filter Buttons', async () => {
        await exploreReportsPage.proceedToReportSettings();
        await exploreReportsPage.closeFilterButton();
        await exploreReportsPage.clickFilterSaveButton();
        await page.goto(
          `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
        );
        await exploreReportsPage.waitReportTableLoaded();
      });
      await test.step('Verify the filter works by checking column values', async () => {
        const getTotalNamedRows = await exploreReportsPage.getTotalRowsWithText(
          filterValue,
        );
        const getTotalRows = await exploreReportsPage.getTotalRows();
        expect(getTotalRows).toBeGreaterThan(getTotalNamedRows);
      });
    });
  }
});
