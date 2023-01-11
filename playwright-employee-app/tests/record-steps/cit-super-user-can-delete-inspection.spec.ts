import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import moment from 'moment';
import {baseConfig} from '@opengov/cit-base/build';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspection @records @record-steps', () => {
  test('User can delete inspection @OGT-34419 @Xoriant_Test', async ({
    page,
    recordsApi,
    recordStepInspectionPage,
    authPage,
    internalRecordPage,
  }) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: TestSteps.Inspection,
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Schedule an Inspection', async () => {
      await recordsApi.scheduleInspection(
        'Inspection',
        TestUsers.Api_Admin.email,
        0,
      );
    });
    await test.step('Navigate to Inspection Step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickCustomStepByName('Inspection');
    });
    await test.step('Verify the Inspection Step is displayed with Inspection request Details', async () => {
      await expect(
        page.locator(
          recordStepInspectionPage.elements.inspectionScheduleData.selector(
            'Assigned to',
          ),
        ),
      ).toHaveText(TestUsers.Api_Admin.name);
      await expect(
        page.locator(
          recordStepInspectionPage.elements.inspectionScheduleData.selector(
            'Note',
          ),
        ),
      ).toHaveText('Default Note');
      await expect(
        page.locator(
          recordStepInspectionPage.elements.inspectionScheduleData.selector(
            'Inspection Date',
          ),
        ),
      ).toContainText(moment(new Date()).format('MMM D, YYYY'));
    });
    await test.step('Complete the Inspection and verify', async () => {
      await recordStepInspectionPage.passInspection(true, true);
      await test.step('Verify Inspection does not have delete button', async () => {
        await recordStepInspectionPage.clickInspectionType('API Inspection');
        await expect(
          page.locator(recordStepInspectionPage.elements.inspectionDelete),
        ).toBeHidden();
      });
    });
    await test.step('Logout from the app', async () => {
      await authPage.logout();
    });
    await test.step('Login as Super User and navigate to Inspection Step', async () => {
      await authPage.loginAs(
        baseConfig.citTestData.citSuperUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await page.waitForNavigation();
      await expect(
        page.locator(internalRecordPage.elements.globalSearchBar),
      ).toBeVisible();
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickCustomStepByName('Inspection');
    });
    await test.step('Delete the Inspection from the Inspection History', async () => {
      await page.click(recordStepInspectionPage.elements.inspectionHistory);
      await recordStepInspectionPage.deleteInspection();
    });
  });
});
