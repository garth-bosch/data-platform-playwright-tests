import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
const attachmentName = `${
  baseConfig.citTestData.plcPrefix
}${faker.random.alphaNumeric(4)}`;
const newAttName = 'RENAMED';
test.describe('Employee App - Attachments', () => {
  test('Admin can edit attachment on attachments tab @OGT-33901', async ({
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

    await test.step('Add attachment with random name and description', async () => {
      await attachmentDesignerPage.addAttachmentAndFillDescription(
        attachmentName,
      );
    });

    await test.step('Edit attachment name', async () => {
      await attachmentDesignerPage.editAttachment(attachmentName, newAttName);
    });
  });
  test.afterAll(async ({attachmentDesignerPage}) => {
    await test.step('Cleanup added attachment', async () => {
      await attachmentDesignerPage.deleteAttachment(newAttName);
    });
  });
});
