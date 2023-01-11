import {test, expect} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Records', () => {
  test('User can search for renewal records @OGT-33681 @Xoriant_Test', async ({
    recordsApi,
    internalRecordPage,
    page,
    employeeAppUrl,
    navigationBarPage,
  }) => {
    //This test only works with Admin user
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Renewal_Campaign_Tests,
        null,
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Renew the Record', async () => {
      await internalRecordPage.startDraftRecordRenewal();
      await internalRecordPage.submitRenewalRecord();
    });
    await test.step('Navigate to Home Page and Search for the Record', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.performGlobalSearchAndClick(
        baseConfig.citTempData.recordName,
      );
    });
    await test.step('Verify most recent Renewal record is displayed', async () => {
      await expect(
        page.locator(internalRecordPage.elements.renewalLabel),
      ).toContainText('Renewal');
    });
  });
});
