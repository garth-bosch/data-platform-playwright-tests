import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {
  ReportSections,
  ReportTabs,
} from '../../../src/pages/explore-reports-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report filterring @report', () => {
  test('User can filter existing report by departments and record types @OGT-48025 @broken_test', async ({
    exploreReportsPage,
  }) => {
    const departmentName = '1. Inspectional Services';
    const reportSection = ReportSections.Records;
    const reportName = 'Active Records';

    await test.step('Go to explore reports page', async () => {
      await exploreReportsPage.openReportId('');
      await exploreReportsPage.waitReportTableLoaded();
    });

    await test.step('Select department', async () => {
      await exploreReportsPage.selectDepartment(departmentName);
    });

    await test.step(`Open ${reportName} report in ${ReportSections[reportSection]} section`, async () => {
      await exploreReportsPage.proceedToReportSettings(
        reportSection,
        reportName,
      );
    });

    await test.step(`Navigate to General Report Tab`, async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.General);
    });

    await test.step(`Verify Department dropdown on General Tab is fulfilled`, async () => {
      const departmentDropdown =
        await exploreReportsPage.getDropdownFromGeneralTab('Department');
      expect(departmentDropdown.selectedValue).toEqual(departmentName);
    });

    await test.step(`Verify Record Type dropdown on General Tab does not have empty values`, async () => {
      const recordTypeDropdown =
        await exploreReportsPage.getDropdownFromGeneralTab('Record Type');
      expect(recordTypeDropdown.selectedValue).toEqual(
        'All Department Records',
      );
      const emptyValues = recordTypeDropdown.dropdownItems.filter(
        (item) => item === '',
      );
      expect(
        emptyValues.length,
        `Dropdown has empty values: ${recordTypeDropdown.dropdownItems.join(
          ', ',
        )}`,
      ).toEqual(0);
    });
  });
});
