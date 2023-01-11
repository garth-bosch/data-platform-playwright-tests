import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {expect} from '@playwright/test';
import {
  baseTemplatesReports,
  ReportTypesScopeId,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report - Search @report @rails-api-reporting', () => {
  //eslint-disable-next-line
  test.skip(({browserName}) => browserName == 'webkit', 'Dont run on Safari!');

  test('User can search for custom reports on the explore page on the employee app @OGT-44492 @broken_test @Xoriant_Test', async ({
    exploreReportsPage,
    reportsApi,
    page,
    employeeAppUrl,
  }) => {
    const reportName = `@OGT-44492-${faker.random.alphaNumeric(4)}`;

    await test.step('Create new report and open Explore page', async () => {
      await reportsApi.createNewReport(
        reportName,
        ReportTypesScopeId.Inspections,
        `${JSON.stringify(
          baseTemplatesReports.additionalColumnsForInspections,
        )}`,
        `${JSON.stringify(
          baseTemplatesReports.additionalColFilterInspections,
        )}`,
      );
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Search for Spec and verify present', async () => {
      await exploreReportsPage.searchReport(reportName);
      await expect(
        await exploreReportsPage.getReportLocator(reportName),
      ).toBeVisible();
    });
    await test.step('Search for Spec and verify not present', async () => {
      const randomTest = `${reportName}-${new Date()[Symbol.toPrimitive](
        'number',
      )}`;
      await exploreReportsPage.searchReport(randomTest);
      await expect(
        await exploreReportsPage.getReportLocator(randomTest),
      ).toBeHidden();
    });
  });
});
