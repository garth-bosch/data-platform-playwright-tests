import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
const attachmentName = `${
  baseConfig.citTestData.plcPrefix
}${faker.random.alphaNumeric(4)}`;
test.describe('Employee App - Attachments', () => {
  test('Admin can add attachment field to record type template @settings @OGT-33890', async ({
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

    const countBefore = await attachmentDesignerPage.getNumberOfAttachments();

    await test.step('Add attachment with random name and description', async () => {
      await attachmentDesignerPage.addAttachmentAndFillDescription(
        attachmentName,
      );
    });

    await test.step('Check if new attachment was added to attachment list', async () => {
      await expect
        .poll(
          async () => {
            const countAfter =
              await attachmentDesignerPage.getNumberOfAttachments();
            return countBefore < countAfter;
          },
          {
            message: `Expected number of attachments expected to be bigger ${countBefore}`,
          },
        )
        .toBeTruthy();
    });
  });
  test.afterAll(async ({attachmentDesignerPage}) => {
    await test.step('Cleanup added attachment', async () => {
      await attachmentDesignerPage.deleteAttachment(attachmentName);
    });
  });
});
