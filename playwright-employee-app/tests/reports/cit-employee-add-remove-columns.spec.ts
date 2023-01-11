import {expect, test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {ReportSections, ReportTabs} from '../../src/pages/explore-reports-page';
import {
  baseTemplatesReports,
  ReportTypesScopeId,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report @report', () => {
  test('User can add/remove columns from view @report @OGT-46385 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
  }) => {
    const reportColumns = ['Archived', 'Location', 'City', 'Country'];
    await test.step('Login to Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to explore reports page', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });
    await test.step('Navigate to a Report', async () => {
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });
    await test.step('Add Columns to the Report and Verify Columns are added', async () => {
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
    });
    await test.step('Remove Columns from the Report', async () => {
      for (const reportColumn of reportColumns) {
        await exploreReportsPage.removeColumn(reportColumn);
      }
    });
    await test.step('Verify Columns were removed', async () => {
      for (const reportColumn of reportColumns) {
        expect(
          await exploreReportsPage.isColumnAdded(reportColumn),
        ).toBeFalsy();
      }
    });
  });

  test('Personalized views are persisted @OGT-33633 @Xoriant_Test @Xoriant_Temp_01_Mahesh @smoke', async ({
    exploreReportsPage,
    reportsApi,
    employeeAppUrl,
    page,
  }) => {
    const reportName = `@OGT-33633_${faker.random.alphaNumeric(8)}`;
    const colNames = baseTemplatesReports.columnsWithApplicantnamePaymentDue;
    await test.step('Create new report and navigate to it', async () => {
      await reportsApi.createNewReport(reportName, ReportTypesScopeId.Payments);
      await page.goto(
        `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Navigate to filter', async () => {
      await exploreReportsPage.proceedToReportSettings(ReportSections.Records);
    });
    await test.step('verify the filter values are correct', async () => {
      await expect(
        page.locator(
          `//label[@for="RecordsapplicantFullName" and contains(.,"Applicant Name")]`,
        ),
      ).toBeVisible();
    });
    await test.step('Verify the column order', async () => {
      const listOfColumns =
        await exploreReportsPage.getColumnListHeadersElements();
      for (let i = 0; i < listOfColumns.length; i++) {
        const textVal = (await listOfColumns[i].textContent())
          .toString()
          .replace(/\n/g, '')
          .trim();
        const colName = colNames.at(i).n;
        expect(textVal).toMatch(colName);
      }
    });
    await test.step('Verify the Checked inputs', async () => {
      await exploreReportsPage.clickColumnsTab();
      const listOfColumns = ['Applicant Name', 'Record #', 'Record Type'];
      for (let i = 0; i < 3; i++) {
        await expect(
          await page.locator(
            exploreReportsPage.elements.columnsTabColumnNames.selector(
              listOfColumns[i],
            ),
          ),
        ).toBeChecked();
      }
    });
  });

  test('Personalized views are persisted @OGT-33651 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    exploreReportsPage,
    reportsApi,
    employeeAppUrl,
    page,
  }) => {
    const reportName = `@OGT-33651_${faker.random.alphaNumeric(8)}`;
    const colNames = baseTemplatesReports.columnsWithApplicantnamePaymentDue;
    await test.step('Create new report and navigate to it', async () => {
      await reportsApi.createNewReport(
        reportName,
        ReportTypesScopeId.Documents,
      );
      await page.goto(
        `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Navigate to filter', async () => {
      await exploreReportsPage.proceedToReportSettings(
        ReportSections.Documents,
      );
    });
    await test.step('Verify Applicant name filter column is visible', async () => {
      await expect(
        page.locator(
          `//label[@for="RecordsapplicantFullName" and contains(.,"Applicant Name")]`,
        ),
      ).toBeVisible();
    });
    await test.step('Verify the column order - documents', async () => {
      const listOfColumns =
        await exploreReportsPage.getColumnListHeadersElements();
      for (let i = 0; i < listOfColumns.length; i++) {
        const textVal = (await listOfColumns[i].textContent())
          .toString()
          .replace(/\n/g, '')
          .trim();
        const colName = colNames.at(i).n;
        expect(textVal).toMatch(colName);
      }
    });
    await test.step('Verify the Checked inputs', async () => {
      await exploreReportsPage.clickColumnsTab();
      const listOfColumns = ['Applicant Name', 'Record #', 'Record Type'];
      for (let i = 0; i < 3; i++) {
        await expect(
          await page.locator(
            exploreReportsPage.elements.columnsTabColumnNames.selector(
              listOfColumns[i],
            ),
          ),
        ).toBeChecked();
      }
    });
  });
  test('Personalized views are persisted @OGT-33642 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    exploreReportsPage,
    reportsApi,
    employeeAppUrl,
    page,
  }) => {
    const reportName = `@OGT-33642_${faker.random.alphaNumeric(8)}`;
    const colNames = baseTemplatesReports.columnsWithApplicantnamePaymentDue;
    await test.step('Create new report and navigate to it', async () => {
      await reportsApi.createNewReport(
        reportName,
        ReportTypesScopeId.Inspections,
      );
      await page.goto(
        `${employeeAppUrl}/#/explore/reports/all/${baseConfig.citTempData.reportId}`,
      );
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Navigate to filter', async () => {
      await exploreReportsPage.proceedToReportSettings(
        ReportSections.Inspections,
      );
    });
    await test.step('Verify Applicant name filter column is visible', async () => {
      await expect(
        page.locator(
          `//label[@for="RecordsapplicantFullName" and contains(.,"Applicant Name")]`,
        ),
      ).toBeVisible();
    });
    await test.step('Verify the column order - documents', async () => {
      const listOfColumns =
        await exploreReportsPage.getColumnListHeadersElements();
      for (let i = 0; i < listOfColumns.length; i++) {
        const textVal = (await listOfColumns[i].textContent())
          .toString()
          .replace(/\n/g, '')
          .trim();
        const colName = colNames.at(i).n;
        expect(textVal).toMatch(colName);
      }
    });

    await test.step('Verify the Checked inputs', async () => {
      await exploreReportsPage.clickColumnsTab();
      const listOfColumns = ['Applicant Name', 'Record #', 'Record Type'];
      for (let i = 0; i < 3; i++) {
        await expect(
          await page.locator(
            exploreReportsPage.elements.columnsTabColumnNames.selector(
              listOfColumns[i],
            ),
          ),
        ).toBeChecked();
      }
    });
  });

  test('Verify that clicking a report header sorts the results according to the column. @report @OGT-33602 @broken_test @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
  }) => {
    const reportColumns = ['Archived', 'Location', 'City'];
    await test.step('Login to Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Go to explore reports page', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
    });
    await test.step('Navigate to a Report', async () => {
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });
    await test.step('Add Columns to the Report and Verify Columns are added', async () => {
      await exploreReportsPage.addColumns(reportColumns);
      await exploreReportsPage.verifyColumnsAdded(reportColumns);
      await exploreReportsPage.saveReportForName('@OGT-33602_Report');
    });
    await test.step('Sort Columns from the Report - location', async () => {
      await exploreReportsPage.sortColumn(reportColumns[2]);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Extract and compare', async () => {
      await exploreReportsPage.extractAndcompare(reportColumns);
      /* Adding in PO because of warnings sonar*/
    });
  });
});
