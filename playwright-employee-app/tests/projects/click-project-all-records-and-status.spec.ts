import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
const testName = `@OGT-44260`;
const name = `${testName}${faker.random.alphaNumeric(4)}`;
let recordForProject1, recordForProject2, recordForProject3;
test.describe('Projects and Records Associated with it', () => {
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
        recordForProject1 = await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
        );
      });
      await page.goto(employeeAppUrl);
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.addToProject(name, testName);
      recordForProject2 = await recordsApi.createRecordWith(
        TestRecordTypes.Ghost_Test,
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.addToProject(name, testName);
      recordForProject3 = await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.addToProject(name, testName);
    },
  );
  test(' Clicking into a project will show all its existing records and their statuses @OGT-44260 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    projectPage,
  }) => {
    await test.step('Navigate to project & verify the project has all records', async () => {
      await internalRecordPage.clickOnProjectLabelOnTop();
      await projectPage.verifyRecordNameAndStatus(
        recordForProject1[0].data.attributes.recordID,
        recordForProject1[0].data.attributes.recordTypeName,
        'Completed',
      );
      await projectPage.verifyRecordNameAndStatus(
        recordForProject2[0].data.attributes.recordID,
        recordForProject2[0].data.attributes.recordTypeName,
        'In Progress',
      );
      await projectPage.verifyRecordNameAndStatus(
        recordForProject3[0].data.attributes.recordID,
        recordForProject3[0].data.attributes.recordTypeName,
        'In Progress',
      );
    });
  });
});
