import {test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ADMIN_SESSION,
  CitEntityType,
} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('admin can add conditions @attachment-conditions', () => {
  let recordTypeName, locationFlag, userFlag;
  test('Conditions can be added to attachments @OGT-33714 @broken_test @Xoriant_Test', async ({
    recordTypesApi,
    employeeAppUrl,
    page,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
    attachmentDesignerPage,
    flagsApi,
  }) => {
    await test.step('Create a Record Type, Location and User flags', async () => {
      recordTypeName = `@OGT-33714 ${faker.random.alphaNumeric(4)}`;
      locationFlag = `@OGT-33714 ${faker.random.alphaNumeric(4)}`;
      userFlag = `@OGT-33714 ${faker.random.alphaNumeric(4)}`;
      await recordTypesApi.createRecordType(recordTypeName);
      await flagsApi.createFlag(locationFlag, CitEntityType.LOCATION);
      await flagsApi.createFlag(userFlag, CitEntityType.USER);
    });
    await test.step('Navigate to workflow settings', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
    await test.step('Go to Record type section and select record type', async () => {
      await systemSettingsPage.proceedToSection('Record Types');
      await recordTypesSettingsPage.selectRecordType(recordTypeName);
    });
    await test.step('Go to Attachments Tab', async () => {
      await recordTypesSettingsPage.proceedToAttachmentsTab();
    });
    const conditions = new Map<string, string>([
      ['Location Flag', locationFlag],
      ['User Flag', userFlag],
      ['Is Renewal', 'True'],
    ]);
    for await (const condition of conditions) {
      await test.step('Add an Attachment', async () => {
        await attachmentDesignerPage.clickAddAttachmentButton();
        await attachmentDesignerPage.addAttachment(
          `Attachment OGT-33714 ${condition[0]}`,
        );
      });
      await test.step(`Edit the Attachment and Add ${condition[0]} Condition`, async () => {
        await page
          .locator(
            attachmentDesignerPage.elements.attachmentEditButton.selector(
              `Attachment OGT-33714 ${condition[0]}`,
            ),
          )
          .click();
        await attachmentDesignerPage.addCondition(condition[0], condition[1]);
        await page.locator(attachmentDesignerPage.elements.saveEdit).click();
      });
      await test.step('Verify Added condition on the Attachment', async () => {
        await attachmentDesignerPage.verifyConditionPresent(
          `When ${condition[0]} is ${condition[1]}`,
          `Attachment OGT-33714 ${condition[0]}`,
        );
      });
    }
  });
});
