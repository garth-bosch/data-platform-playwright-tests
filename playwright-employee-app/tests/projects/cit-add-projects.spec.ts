import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
const testName = `@OGT-44740`;
const name = `${testName}${faker.random.alphaNumeric(4)}`;
test.describe('User can Add Projects and View the existing Records @projects', () => {
  test.beforeEach(
    async ({
      projectsApi,
      recordsApi,
      page,
      employeeAppUrl,
      internalRecordPage,
    }) => {
      await test.step('Project setup', async () => {
        await projectsApi.createProject(name);
        await recordsApi.createRecordWith(TestRecordTypes.Record_Steps_Test);
      });
      await page.goto(employeeAppUrl);
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.addToProject(name, testName);
    },
  );
  test('User can see Project listed on record with Project already present @OGT-44740 @Xoriant_Test @smoke', async ({
    page,
    internalRecordPage,
    employeeAppUrl,
  }) => {
    /*@OGT-44739*/
    /*  above is also satisfied by this */
    await test.step('Navigate to Reports', async () => {
      await page.goto(
        `${employeeAppUrl}/#/explore/reports/all/`,
      ); /* Just randomly navigating and coming back to check */
    });

    await test.step('Navigate to record and verify Project is already Added', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.validateProjectLabelOnTopOfRecordPage();
    });
  });
});
