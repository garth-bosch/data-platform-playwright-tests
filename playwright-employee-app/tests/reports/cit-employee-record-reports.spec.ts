import {test} from '../../src/base/base-test';
import {
  FilterTypes,
  ReportSections,
  ReportTabs,
} from '../../src/pages/explore-reports-page';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

const reportSection = ReportSections.Records;
const defaultReportName = 'Active Records';
const defaultDepartmentName = 'Test Data - DO NOT MODIFY';

test.setTimeout(300 * 1000);
test.use({storageState: ADMIN_SESSION});
test.describe
  .serial('Employee App - Record Reports @report @record_reports', () => {
  test.beforeEach(async ({exploreReportsPage, page, employeeAppUrl}) => {
    await test.step('Navigate to Reports page', async () => {
      await page.goto(employeeAppUrl);
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.openReportSection(reportSection);
    });
  });

  test('User can add/remove filters for columns in the view @OGT-33583', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Applicant Name';

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Add ${columnName} column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnAdded(columnName);
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });

    await test.step(`Add and verify filter ${columnName} with Empty value`, async () => {
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.addNewFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.checkFilter(columnName, FilterTypes.Empty);
      await exploreReportsPage.removeAllFilters();
    });
  });

  test('User can delete a Records report view @OGT-33589', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Delete report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.openReportSection(reportSection);
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Delete Report', async () => {
      await exploreReportsPage.deleteReport(reportName);
    });
  });

  test('User can edit default report view for Records @OGT-33581 @OGT-33582', async ({
    exploreReportsPage,
  }) => {
    const columns = [
      'Applicant Name',
      'Date Submitted',
      'Full Address',
      'Applicant Email',
      'Building Type',
      'City',
    ];

    await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Navigate to Columns Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });

    for (const column of columns) {
      await test.step(`Add [${column}] columns to report view`, async () => {
        await exploreReportsPage.addColumn(column);
      });

      await test.step(`Verify [${column}] columns added to report view`, async () => {
        await exploreReportsPage.verifyColumnAdded(column);
      });
    }
  });

  //* TODO: This is a duplicate test of @OGT-33580 @duplicate
  test('User can explore active, completed records @broken_test', async ({
    exploreReportsPage,
  }) => {
    const reportsToBeOpened = [defaultReportName, 'Completed Records'];
    for (const reportName of reportsToBeOpened) {
      await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
        await exploreReportsPage.openReportAndValidateName(
          reportName,
          reportSection,
        );
      });
      await exploreReportsPage.waitReportTableLoaded();
    }

    await test.step('I navigate to the first [record] from report page', async () => {
      await exploreReportsPage.navigateToFirstItem('record');
    });
  });

  test('Export reports: Records @OGT-33579 @OGT-33588', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Export report`;

    await test.step(`Create [${reportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.createReport(reportName, reportSection);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);
      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
    });
  });

  test('Personalized report view can be shared @OGT-33586', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Shared report`;

    await test.step(`Create and share [${reportName}] from [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.shareReport(reportName, reportSection);
    });
  });

  test('User sees search option for dropdown form field @OGT-33614 @broken_test @OGT-33615', async ({
    exploreReportsPage,
  }) => {
    const columnName = 'Shared Dropdown field';

    await test.step(`Select [${defaultDepartmentName}] department`, async () => {
      await exploreReportsPage.selectDepartment(defaultDepartmentName);
    });

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Add ${columnName} column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnAdded(columnName);
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
    });

    await test.step(`Add and verify filter [${columnName}] with [A] value`, async () => {
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.addNewFilter(
        columnName,
        FilterTypes.Is,
        {
          search: ['A'],
        },
        true,
      );
      await exploreReportsPage.checkFilter(columnName, 'A');
      await exploreReportsPage.removeAllFilters();
    });
  });

  test('Employee can save changed default column view @OGT-33584 @broken_test', async ({
    exploreReportsPage,
  }) => {
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Save report`;
    const columns = [
      'Applicant Name',
      'Date Submitted',
      'Full Address',
      'Applicant Email',
      'Building Type',
      'City',
    ];

    await test.step(`Select [${defaultDepartmentName}] department`, async () => {
      await exploreReportsPage.selectDepartment(defaultDepartmentName);
    });

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Navigate to Columns Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });

    for (const column of columns) {
      await test.step(`Add [${column}] columns to report view`, async () => {
        await exploreReportsPage.addColumn(column);
      });

      await test.step(`Verify [${column}] columns added to report view`, async () => {
        await exploreReportsPage.verifyColumnAdded(column);
      });
    }

    await test.step(`Save report`, async () => {
      await exploreReportsPage.saveReportAs(reportName);
    });

    for (const column of columns) {
      await test.step(`Verify [${column}] columns added to report view`, async () => {
        await exploreReportsPage.verifyColumnAdded(column);
      });
    }
  });

  test('Employee can verify pagination @OGT-33613', async ({
    exploreReportsPage,
  }) => {
    await test.step(`Select [${defaultDepartmentName}] department`, async () => {
      await exploreReportsPage.selectDepartment(defaultDepartmentName);
    });

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step('Verify pagination', async () => {
      await exploreReportsPage.getTotalRecordsCount();
      await exploreReportsPage.validateRecordCount();
    });
  });

  test('Employee can verify Date columns in an export file have correct format @OGT-39683', async ({
    exploreReportsPage,
    myExportsPage,
  }) => {
    const columnName = 'Multi Date';
    const reportName = `${exploreReportsPage.plcPrefix()}${faker.random.alphaNumeric(
      4,
    )} Export report`;

    await test.step(`Select [${defaultDepartmentName}] department`, async () => {
      await exploreReportsPage.selectDepartment(defaultDepartmentName);
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step(`Open [${defaultReportName}] on [${ReportSections[reportSection]}] report section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Select Record type`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.General);
      await exploreReportsPage.selectRecordType('Automation - DO NOT MODIFY');
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.removeAllFilters();
    });

    await test.step(`Add ${columnName} column to the report`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn(columnName);
      await exploreReportsPage.verifyColumnAdded(columnName);
    });

    await test.step(`Save report`, async () => {
      await exploreReportsPage.saveReportAs(reportName);
    });

    await test.step('Export report', async () => {
      await exploreReportsPage.exportReport(true);

      await myExportsPage.validateReportInMyExports(reportName, 'Finished');
      const exportedFilePath = await myExportsPage.downloadExportedFile(
        reportName,
      );
      const fileData = await myExportsPage.readExportFile(
        exportedFilePath,
        'multi',
      );
      await exploreReportsPage.validateDateFormatInExportFile(
        fileData,
        columnName,
      );
    });
  });

  test('User can see default column view @OGT-33621', async ({
    exploreReportsPage,
  }) => {
    const columns = ['Date Submitted', 'Record Type', 'Applicant Name'];

    await test.step(`Open ${defaultReportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        defaultReportName,
      );
    });

    await test.step(`Navigate to Columns Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
    });

    for (const column of columns) {
      await test.step(`Add [${column}] columns to report view`, async () => {
        await exploreReportsPage.addColumn(column);
      });

      await test.step(`Verify [${column}] columns added to report view`, async () => {
        await exploreReportsPage.verifyColumnAdded(column);
      });
    }
  });
});
