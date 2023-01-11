import {expect, test} from '../../src/base/base-test';
import {ReportSections, ReportTabs} from '../../src/pages/explore-reports-page';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestDepartments,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {FormFieldType} from '@opengov/cit-base/build/api-support/api/recordsApi';
import moment from 'moment';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App -  Reports @report', () => {
  test('Verify that Checkbox FF column is not empty if it is not filled out during the application @OGT-33573 @broken_test @Xoriant_Test', async ({
    recordsApi,
    exploreReportsPage,
    employeeAppUrl,
    page,
  }) => {
    await test.step('Create a Record with checkbox form field', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: TestSteps.Approval,
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Navigate to Reports', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.openReportSection(ReportSections.Records);
    });
    await test.step('Create a filter and add Checkbox column', async () => {
      await exploreReportsPage.selectDepartment(
        TestDepartments.Test_Department,
      );
      await exploreReportsPage.clickEditActiveRecords();
      await exploreReportsPage.clickFiltersTab();
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn('Test_Checkbox');
    });
    await test.step('Validate Checkbox Form Field Column value in the report', async () => {
      const checkBoxColumnValue =
        await exploreReportsPage.getColumnValueForRecord(
          'Test_Checkbox',
          exploreReportsPage.elements.reportsTable,
          baseConfig.citTempData.recordName,
        );
      expect(checkBoxColumnValue, 'Check Box Form Field Column').toBe('False');
    });
  });

  test('Verify that Date type form fields and DFF"s are shown with correct values. @OGT-33604 @Xoriant_Test', async ({
    recordsApi,
    exploreReportsPage,
    employeeAppUrl,
    page,
  }) => {
    await test.step('Create a Record with Date form field value', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.DFF_Record_Type,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Date',
            fieldValue: '12/12/2022',
            fieldType: FormFieldType.DATE,
          },
        ],
      );
    });
    await test.step('Navigate to Reports', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    });
    await test.step('Select DFF Department and open report', async () => {
      await exploreReportsPage.selectDepartment('DFF Department');
      await exploreReportsPage.openReportAndValidateName(
        'with DFF',
        ReportSections.Records,
      );
    });
    await test.step('Validate Date Form Field Column value in the report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.clickFiltersTab();
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const dffDateColumnValue =
        await exploreReportsPage.getColumnValueForRecord(
          'DFF Date',
          exploreReportsPage.elements.reportsTable,
          baseConfig.citTempData.recordName,
        );
      expect(dffDateColumnValue, 'Date Form Field Column').toBe('12/12/2022');
    });
  });

  test('Validate International Date formatting for Department Form fields @OGT-33612 @Xoriant_Test', async ({
    recordsApi,
    exploreReportsPage,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
  }) => {
    let date, dateFormat;
    await test.step('Navigate to Organization settings and get the Date Format', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
      await systemSettingsPage.proceedToSection('Organization');
      const value = await page
        .locator(systemSettingsPage.elements.dateFormat)
        .inputValue();
      dateFormat = (
        await page
          .locator(systemSettingsPage.elements.dateFormat)
          .locator(`[value= "${value}"]`)
          .innerText()
      ).trim();
      date = moment(new Date()).format(dateFormat);
    });
    await test.step('Create a Record with Date form field value', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.DFF_Record_Type,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Date',
            fieldValue: date,
            fieldType: FormFieldType.DATE,
          },
        ],
      );
    });
    await test.step('Navigate to Reports', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
    });
    await test.step('Select DFF Department and open report', async () => {
      await exploreReportsPage.selectDepartment('DFF Department');
      await exploreReportsPage.openReportAndValidateName(
        'with DFF',
        ReportSections.Records,
      );
    });
    await test.step('Validate Date Form Field format in the report', async () => {
      await exploreReportsPage.clickEditReportActiveButton();
      await exploreReportsPage.clickFiltersTab();
      await exploreReportsPage.createFilter(
        'Record #',
        baseConfig.citTempData.recordName,
      );
      await page.locator(exploreReportsPage.elements.reportsTable).waitFor();
      const dffDateColumnValue =
        await exploreReportsPage.getColumnValueForRecord(
          'DFF Date',
          exploreReportsPage.elements.reportsTable,
          baseConfig.citTempData.recordName,
        );
      expect(
        moment(dffDateColumnValue, dateFormat, true).isValid(),
        'Date Format',
      ).toBeTruthy();
    });
  });
});
