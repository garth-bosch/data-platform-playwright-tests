import {expect, test} from '../../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  ReportColumns,
} from '@opengov/cit-base/build/constants/cit-constants';
const reportIds = [];
const times = 10;
test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Report view', () => {
  test('Employee should be able to see a big number of reports in the report list @OGT-47976. Based on ESN-5549', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    exploreReportsPage,
    reportsApi,
  }) => {
    const reportName = 'ESN-5549';

    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Go to explore reports page and click records facet', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await navigationBarPage.clickExploreReportsButton();
      await page
        .locator(exploreReportsPage.elements.completedRecordLink)
        .waitFor({state: 'visible'});
    });

    await test.step('Create 25 reports', async () => {
      for (let i = 0; i < times; i++) {
        const id = await reportsApi.createReport(
          page,
          [ReportColumns.recordNumber, ReportColumns.recordStatus],
          reportName,
        );
        reportIds.push(id);
      }
    });
    await test.step('Check that you can see 25 reports with given name', async () => {
      await expect
        .poll(
          async () => {
            await page.reload();
            await page
              .locator(exploreReportsPage.elements.completedRecordLink)
              .waitFor({state: 'visible'});
            const counter = await page
              .locator(`${exploreReportsPage.elements.recordsMenu}-esn-5549`)
              .count()
              .then((e) => {
                return e;
              });
            return counter == times;
          },
          {
            message: `Expected reports count to be ${times}`,
          },
        )
        .toBeTruthy();
    });
  });

  test.afterAll(async ({reportsApi}) => {
    await test.step('Cleanup report after test is complete', async () => {
      for (const id of reportIds) {
        await reportsApi.deleteReport(id);
      }
    });
  });
});
