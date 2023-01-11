import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Attachments', () => {
  test('Admin can see adhoc visibility settings on attachments tab @OGT-33897', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    recordTypesSettingsPage,
    attachmentDesignerPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto system settings page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
    });

    await test.step('Proceed to [O_UI_CONDITIONS_BUILDER] record, then go to Attachment settings', async () => {
      await recordTypesSettingsPage.proceedToRecordType(
        'O_UI_CONDITIONS_BUILDER',
      );
      await recordTypesSettingsPage.proceedToAttachmentsTab();
    });

    await test.step('Verify that admin is able to see [Ad-hoc Attachments Visibility] setting', async () => {
      await expect(
        attachmentDesignerPage.page.locator(
          attachmentDesignerPage.elements.panelPermission,
        ),
      ).toBeVisible();
    });
  });
});
