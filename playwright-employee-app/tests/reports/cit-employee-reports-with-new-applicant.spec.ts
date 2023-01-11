import {expect, test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
  UserInfo,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {ReportSections, ReportTabs} from '../../src/pages/explore-reports-page';

const prefix = `${baseConfig.citTestData.plcPrefix}${faker.random.alphaNumeric(
  4,
)}`;

test.setTimeout(210 * 1000);
test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Report @report', () => {
  test('Email address should display in the email column in explore reports @OGT-45046 @broken_test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    selectRecordTypePage,
    createRecordPage,
    exploreReportsPage,
  }) => {
    const userInfo: UserInfo = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: `${prefix}@example.com`,
      phoneNumber: faker.phone.number(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
    };

    let recordNumber: string;
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step(`Start a record draft from record type [${TestRecordTypes.Api_Test}] in department [Test Department]`, async () => {
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(TestRecordTypes.Api_Test);
      await createRecordPage.createRecordPageIsVisible();
    });

    await test.step('Create and add a new applicant', async () => {
      console.info(userInfo);
      await createRecordPage.createAndAddRandomApplicant(userInfo);
    });

    await test.step('Save record', async () => {
      recordNumber = await createRecordPage.saveRecord();
      expect(recordNumber).not.toBeUndefined();
    });

    await test.step('I proceed to [Completed Records] report in [Records] section', async () => {
      await navigationBarPage.clickExploreRecordButton();
      await exploreReportsPage.openReportSection(ReportSections.Records);
      await exploreReportsPage.proceedToReportSettings(
        ReportSections.Records,
        'Completed Records',
      );
    });

    await test.step('Filter result by [Record #]', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Filters);
      await exploreReportsPage.removeAllFilters();
      await exploreReportsPage.selectFilter('Record #');
      await exploreReportsPage.selectAndApplyFilterCondition(
        'is',
        recordNumber,
      );
    });

    await test.step('Verify [Applicant Email] column value', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumn('Applicant Email');
      await exploreReportsPage.verifyColumnsAdded(['Applicant Email']);
      expect(
        await exploreReportsPage.getColumnValueForRecord(
          'Applicant Email',
          exploreReportsPage.elements.reportsTable,
          recordNumber,
        ),
      ).toStrictEqual(userInfo.email);
    });
  });
});
