import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;

  test.beforeEach(async ({employeeAppUrl, recordTypesApi, page}) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
        publish: true,
        workflowStepsToAdd: {
          inspection: true,
        },
      });
      await page.goto(employeeAppUrl);
    });
  });
  test('SuperUser Inspection Type history comment deletion button not available for standard admin and employee users @OGT-44548 @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    recordStepInspectionPage,
    internalRecordPage,
  }) => {
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Get to custom step', async () => {
      await internalRecordPage.clickCustomStepByName('Inspection');
    });
    await test.step('Add inspection', async () => {
      await recordStepInspectionPage.addInspectionType('Test Inspection');
    });
    await test.step('Schedule inspection', async () => {
      await recordStepInspectionPage.scheduleInspection('today', 'Api Admin');
    });
    await test.step('Pass inspection', async () => {
      await recordStepInspectionPage.passInspection(true, true, 'comments');
    });
    await test.step('Verify Inspection does not have delete button', async () => {
      await recordStepInspectionPage.clickInspectionType('Test Inspection');
      await expect(
        page.locator(recordStepInspectionPage.elements.inspectionDelete),
      ).toBeHidden();
    });
  });

  /*_____________-*/
  test('SuperUser "go to record type" button is not present for standard Admin or Employee users @OGT-44511 @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    internalRecordPage,
  }) => {
    await test.step('Navigate to RT', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Verify go to record button is not present', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await expect(
        page.locator(
          internalRecordPage.elements.recordActionsSupUserGoToRecordType,
        ),
      ).toBeHidden();
    });
  });
});
