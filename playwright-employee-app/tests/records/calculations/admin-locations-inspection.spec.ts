import {expect, test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - locations additions and inspections etc', () => {
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;
  const updatedStepNameForRecord = `Step-${faker.random.alphaNumeric(4)}`;
  const updatedStepNameForRecord2 = `Step2-${faker.random.alphaNumeric(4)}`;
  const updatedStepNameForRecord3 = `Step3-${faker.random.alphaNumeric(4)}`;

  test('Admin: Add Address location as the main with additional locations of different types @OGT-40195 @broken_test @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    createRecordPage,
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
    await test.step('Add primary location', async () => {
      await internalRecordPage.addPrimaryLocation();
    });
    await test.step('Add address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1800 Presidents Street, Reston, VA',
      );
    });
    await test.step('Verify address location type hidden', async () => {
      await expect(
        page.locator(createRecordPage.elements.addressLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add point map location type', async () => {
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add segment location type', async () => {
      await createRecordPage.addSegmentLocationType(
        '1400 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1900 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Verify segment location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.segmentLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add one more Address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });
  /*__________________________________________________________________________________________ test 2*/
  test('Inspector can complete an inspection from Inbox @OGT-34427 @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    recordStepsApi,
    page,
    inboxPage,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
      );
      await recordStepsApi.addInspectionStep(updatedStepNameForRecord, 2);
      await recordStepsApi.addInspectionStep(updatedStepNameForRecord2, 1);
      await recordStepsApi.addInspectionStep(updatedStepNameForRecord3, 0);
    });
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Click on record step name', async () => {
      await internalRecordPage.clickRecordStepName(
        baseConfig.citIndivApiData.inspectionRecordStepResult.at(1).data
          .attributes.label,
      );
    });
    await test.step('Add due date and assignee', async () => {
      await internalRecordPage.addDueDateToday();
      await internalRecordPage.assignStepToUser('myself');
    });
    await test.step('Go to Inbox to the record and open task', async () => {
      await page.goto(`${employeeAppUrl}/#/inbox/`);
      await inboxPage.selectInboxRow();
      await inboxPage.openTask();
    });
    await test.step('Go to the record step and update any status', async () => {
      await internalRecordPage.clickRecordStepName(
        baseConfig.citIndivApiData.inspectionRecordStepResult.at(1).data
          .attributes.label,
      );
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Complete,
      );
    });
    await test.step('Verify the inspection step status is success', async () => {
      const handle = await page.locator(
        internalRecordPage.elements.stepPageHeader,
      );
      await expect(await handle.getAttribute('class')).toContain(
        'text-success',
      );
    });
  });
});
