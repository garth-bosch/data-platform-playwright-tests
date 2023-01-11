import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspect', () => {
  let addressLocationInfo1,
    addressLocationInfo2,
    eventsList,
    recordId1,
    recordId2;
  test.beforeEach(
    async ({
      recordsApi,
      locationsApi,
      employeeAppUrl,
      navigationBarPage,
      recordStepInspectionPage,
      recordPage,
      page,
    }) => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      const locationResponse2 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      addressLocationInfo1 = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
      addressLocationInfo2 = {
        name: locationResponse2.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse2.data.attributes.locationID,
      };
      await test.step('Create a Record 1', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
          baseConfig.citTestData.citCitizenEmail,
          addressLocationInfo1,
          [
            {
              fieldName: 'Inspection',
              fieldValue: 'true',
            },
          ],
        );
        recordId1 = baseConfig.citTempData.recordId;
        await test.step('Create a Record 2', async () => {
          await recordsApi.createRecordWith(
            TestRecordTypes.Record_Steps_Test,
            baseConfig.citTestData.citCitizenEmail,
            addressLocationInfo2,
            [
              {
                fieldName: 'Inspection',
                fieldValue: 'true',
              },
            ],
          );
        });
        recordId2 = baseConfig.citTempData.recordId;
      });
      await test.step('Navigate to Record 1', async () => {
        await recordPage.proceedToRecordById(recordId1);
      });
      await test.step('Go to Inspection', async () => {
        await recordPage.clickRecordStepName(TestSteps.Inspection);
      });
      await test.step('Schedule inspection', async () => {
        await recordStepInspectionPage.scheduleInspection('today', 'api admin');
      });

      await test.step('Navigate to Record 2', async () => {
        await recordPage.proceedToRecordById(recordId2);
      });
      await test.step('Go to Inspection', async () => {
        await recordPage.clickRecordStepName(TestSteps.Inspection);
      });
      await test.step('Schedule inspection', async () => {
        await recordStepInspectionPage.scheduleInspection('today', 'api admin');
      });
      await test.step('Navigate to the Employee App', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to Inspect', async () => {
        await navigationBarPage.clickExploreInspectionsButton();
      });
    },
  );
  test.afterEach(async ({recordsApi, recordPage, recordStepInspectionPage}) => {
    await test.step('Cancelling the Inspection for data cleanup', async () => {
      await recordPage.proceedToRecordById(recordId1);
      await recordPage.clickRecordStepName(TestSteps.Inspection);
      await recordStepInspectionPage.cancelInspection();
      await recordPage.proceedToRecordById(recordId2);
      await recordPage.clickRecordStepName(TestSteps.Inspection);
      await recordStepInspectionPage.cancelInspection();
    });
    recordsApi.deleteRecord(recordId1);
  });
  test('Inspector can cancel optimize routes @OGT-34425 @Xoriant_Test', async ({
    page,
    inspectPage,
  }) => {
    await test.step('Get the inspection events order', async () => {
      await page
        .locator(inspectPage.elements.inspectionEvents)
        .nth(0)
        .waitFor();
      eventsList = await page
        .locator(inspectPage.elements.inspectionEvents)
        .allInnerTexts();
    });
    await test.step('Click Optimize routes and cancel', async () => {
      await inspectPage.optimizeRoutes(false);
    });
    await test.step('Verify Inspection Event order is not changed', async () => {
      await page
        .locator(inspectPage.elements.inspectionEvents)
        .nth(0)
        .waitFor();
      const eventsListPost = await page
        .locator(inspectPage.elements.inspectionEvents)
        .allInnerTexts();
      expect(JSON.stringify(eventsList)).toBe(JSON.stringify(eventsListPost));
    });
  });
});
