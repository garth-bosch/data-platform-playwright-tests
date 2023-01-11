import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import moment from 'moment';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspect', () => {
  test('Inspector can complete an inspection via Inspect: Schedule page @OGT-34428 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    inspectPage,
    recordsApi,
    recordStepInspectionPage,
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
    await test.step('Navigate to the Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Navigate to Inspect and click on the Inspection scheduled request', async () => {
      await navigationBarPage.clickExploreInspectionsButton();
      await inspectPage.clickInspectionLink();
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
  });
  test('All inspection logs, comments, and photos display successfully in Employee App @OGT-44006 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    inspectPage,
    recordsApi,
    recordStepInspectionPage,
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
    await test.step('Navigate to the Employee App', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Navigate to Inspect and click on the Inspection scheduled request', async () => {
      await navigationBarPage.clickExploreInspectionsButton();
      await inspectPage.clickInspectionLink();
    });
    const comments = 'Any comments';
    await test.step('Upload file', async () => {
      await recordStepInspectionPage.clickBeginInspection();
      await recordStepInspectionPage.uploadAttachments('png', 'overall');
      await page.fill(
        recordStepInspectionPage.elements.scheduleInspectioncomments,
        comments,
      );
    });

    await test.step('Navigate back', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickExploreInspectionsButton();
      await inspectPage.clickInspectionLink();
    });
    await test.step('Complete the Inspection and verify', async () => {
      await recordStepInspectionPage.passInspection(true, true, comments);
      await recordStepInspectionPage.clickPassedInspection();
      const commentsText = (
        await page
          .locator(recordStepInspectionPage.elements.inspectionResults)
          .innerText()
      )
        .replace(/[\n\t]/g, ' ')
        .trim();
      await expect(commentsText).toContain(comments);
      await expect(
        await page.locator(
          recordStepInspectionPage.elements.inspectionResultsImage,
        ),
      ).toBeVisible();
    });
  });
});
