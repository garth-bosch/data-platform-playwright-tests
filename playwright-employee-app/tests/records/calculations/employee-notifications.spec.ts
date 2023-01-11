import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Notifications for records', () => {
  let recordTypeName;
  test.beforeEach(async ({recordTypesApi, employeeAppUrl, page}) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `Rec_Type_Name_${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Administer'],
        workflowStepsToAdd: {
          payment: true,
        },
        locationTypesToEnable: {
          address: false,
          point: false,
          segment: true,
        },
      });
    });
    await test.step('Navigate to app url - first navigation', async () => {
      await page.goto(employeeAppUrl);
    });
  });
  test(`Employee gets task notification for assigned Payment @OGT-34500`, async ({
    workflowDesignerPage,
    baseConfig,
    recordsApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    authPage,
    recordPage,
  }) => {
    let recordId;
    await test.step('Go to Record type section workflow', async () => {
      await page.goto(
        `${employeeAppUrl}/#/settings/system/record-types/${baseConfig.citTempData.recordTypeId}/workflow`,
      );
    });
    await test.step('Add notification user', async () => {
      await workflowDesignerPage.clickStepByName('Payment');
      await workflowDesignerPage.addNotifier(
        baseConfig.citTestData.citNotificationUserEmail,
      );
    });
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await recordPage.proceedToRecordById(baseConfig.citTempData.recordId);
      recordId = baseConfig.citTempData.recordId;
    });
    await test.step('Logout login as assigned user', async () => {
      await authPage.logout();
    });
    await test.step('Login as another user', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citNotificationUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
    });
    await test.step('Logout/Login Manual waits - Flaky tests', async () => {
      await page.waitForNavigation();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector(navigationBarPage.elements.openGovLogo, {
        timeout: 18000,
        state: 'visible',
        strict: true,
      });
    });
    await test.step('Go to Record', async () => {
      await recordPage.proceedToRecordById(recordId);
    });
    await test.step('known test case issue', async () => {
      //todo
    });
  });
});
