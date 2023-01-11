import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
const attachmentName = `${
  baseConfig.citTestData.plcPrefix
}${faker.random.alphaNumeric(4)}`;
test.describe('Employee App - Attachments', () => {
  test('Admin can add user based condition to attachment @OGT-33898', async ({
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

    const conditionName = 'User Flag';
    const conditionValue = 'Cat Person';

    await test.step('Add attachment with condition as location', async () => {
      await attachmentDesignerPage.page
        .locator(attachmentDesignerPage.elements.addAttachmentButton)
        .click();
      await attachmentDesignerPage.page.type(
        attachmentDesignerPage.elements.addAttachmentDescription1,
        attachmentName,
      );
      await attachmentDesignerPage.addDropdownCondition(
        conditionName,
        conditionValue,
      );
      await attachmentDesignerPage.clickAddAttachmentButtonInsideForm();
    });

    await test.step('Verify attachment with condition was added', async () => {
      await attachmentDesignerPage.verifyAttachmentHasGivenCondition(
        attachmentName,
        conditionName,
        conditionValue,
      );
    });
  });
  test.afterAll(async ({attachmentDesignerPage}) => {
    await test.step('Cleanup added attachment', async () => {
      await attachmentDesignerPage.deleteAttachment(attachmentName);
    });
  });
});