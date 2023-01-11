import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
const attName = 'INTERNAL ATTACHMENT';
test.describe('Employee App - Attachments', () => {
  test('Admin can edit attachment on attachments tab @OGT-33896', async ({
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

    await test.step('Proceed to [0_UI_SS] record, then go to Attachment settings', async () => {
      await recordTypesSettingsPage.proceedToRecordType('0_UI_SS');
      await recordTypesSettingsPage.proceedToAttachmentsTab();
    });

    const internalFullname = 'Internal + Applicant';

    await test.step('Fill attachment without saving', async () => {
      await attachmentDesignerPage.clickAddAttachmentButton();
      await attachmentDesignerPage.page.type(
        attachmentDesignerPage.elements.addAttachmentDescription1,
        attName,
      );
    });

    await test.step('Set attachment visibility as [INTERNAL] and save attachment', async () => {
      await attachmentDesignerPage.setAttachmentsVisibility('internal');
      await attachmentDesignerPage.clickAddAttachmentButtonInsideForm();
    });

    await test.step('Verify attachment visibility is set to [INTERNAL]', async () => {
      await expect(
        attachmentDesignerPage.page.locator(
          attachmentDesignerPage.elements.attachmentAccessType.selector(
            attName,
            internalFullname,
          ),
        ),
      ).toBeVisible();
    });
  });
  test.afterAll(async ({attachmentDesignerPage}) => {
    await test.step('Cleanup added attachment', async () => {
      await attachmentDesignerPage.deleteAttachment(attName);
    });
  });
});
