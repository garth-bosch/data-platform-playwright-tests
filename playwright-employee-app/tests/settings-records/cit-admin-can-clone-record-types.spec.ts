import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record types, Clone', () => {
  const recTypeDesc = `clone-record-type-OGT-33713_${faker.random.alphaNumeric(
    12,
  )}`;
  let recName = ``;
  let recNameCopy = ``;
  test('Admin can clone record types @OGT-33713 @Xoriant_Test @smoke', async ({
    page,
    employeeAppUrl,
    recordTypesSettingsPage,
    navigationBarPage,
    attachmentDesignerPage,
  }) => {
    await test.step('Navigate to record type settings page', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
    });
    await test.step('Create record type and add attachments', async () => {
      recName = await recordTypesSettingsPage.addRecordType(recTypeDesc);
      recNameCopy = `${recName} COPY`;
      await recordTypesSettingsPage.proceedToGeneral();
      await recordTypesSettingsPage.proceedToAttachmentsTab();
      await attachmentDesignerPage.addAttachmentAndFillDescription(recTypeDesc);
    });
    await test.step('Copy created record type', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
      await recordTypesSettingsPage.setNameFilter(`${recName}`);
      await recordTypesSettingsPage.copyRecordType(recName, recNameCopy);
      await recordTypesSettingsPage.checkNameFilterTextRow2(recNameCopy);
    });
    await test.step('Verify record type description', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypes();
      await recordTypesSettingsPage.setNameFilter(recNameCopy);
      await recordTypesSettingsPage.proceedToGeneral();
      await recordTypesSettingsPage.proceedToAttachmentsTab();
      await attachmentDesignerPage.verifyAttachmentDescription(recTypeDesc);
    });
  });
});
