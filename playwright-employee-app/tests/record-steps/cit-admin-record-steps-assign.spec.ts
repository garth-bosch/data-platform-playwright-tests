import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestSteps,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Assign @records @record-steps', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        null,
        null,
        [
          {
            fieldName: TestSteps.Approval,
            fieldValue: 'true',
          },
          {
            fieldName: TestSteps.Inspection,
            fieldValue: 'true',
          },
        ],
      );
    });
    await internalRecordPage.proceedToRecordByUrl();
  });

  test('Admin can assign record step to any user/or to self @OGT-34487 @Xoriant_Test', async ({
    recordPage,
    page,
  }) => {
    await test.step('Go to approval step and un assign any previous users', async () => {
      await recordPage.clickRecordStepName(TestSteps.Approval);
      await recordPage.unassignUserFromStep('optional');
    });
    await test.step('Assign step to someone else and verify', async () => {
      await recordPage.assignStepToUserByEmail(TestUsers.Test_User.email);
      await expect(
        await page.locator(
          recordPage.elements.assignedUser.selector(TestUsers.Test_User.name),
        ),
      ).toBeVisible();
    });
    await test.step('Go to Inspection  and un assign any previous users', async () => {
      await recordPage.clickRecordStepName(TestSteps.Inspection);
      await recordPage.unassignUserFromStep('optional');
    });
    await test.step('Assign step to self and verify', async () => {
      await recordPage.assignStepToUserByEmail(TestUsers.Api_Admin.email);
      await expect(
        await page.locator(
          recordPage.elements.assignedUser.selector(TestUsers.Api_Admin.name),
        ),
      ).toBeVisible();
    });
  });
  test('User can upload and download attachments in an inspection event (item in the checklist) @OGT-34525 @Xoriant_Test @Xoriant_Temp_01_Mahesh', async ({
    recordPage,
    page,
    recordStepInspectionPage,
  }) => {
    await test.step('Go to Inspection', async () => {
      await recordPage.clickRecordStepName(TestSteps.Inspection);
    });
    await test.step('Schedule inspection', async () => {
      await recordStepInspectionPage.scheduleInspection('today', 'api admin');
    });
    await test.step('Begin inspection and upload pdf', async () => {
      await recordStepInspectionPage.clickBeginInspection();
    });
    await test.step('Upload & verify pdf', async () => {
      await recordStepInspectionPage.uploadAttachmentChecklistByRowNumber(
        1,
        'pdf',
      );
      await expect(
        page.locator(
          recordStepInspectionPage.elements.checklistItemByNumberOrTextAttachmentFileName.selector(
            'sample.pdf',
            1,
          ),
        ),
      ).toBeVisible();
    });
    await test.step('Upload & verify the jpeg', async () => {
      await recordStepInspectionPage.uploadAttachmentChecklistByRowNumberGivenFile(
        1,
        'jpeg',
      );
      await expect(
        page.locator(
          recordStepInspectionPage.elements.checklistItemByNumberOrTextAttachmentImage.selector(
            1,
            1,
          ),
        ),
      ).toBeVisible();
    });
    await test.step('Upload & verify the docx', async () => {
      await recordStepInspectionPage.uploadAttachmentChecklistByRowNumberGivenFile(
        1,
        'docx',
      );
      await expect(
        page.locator(
          recordStepInspectionPage.elements.checklistItemByNumberOrTextAttachmentFileName.selector(
            'sample.docx',
            1,
          ),
        ),
      ).toBeVisible();
    });
  });
});
