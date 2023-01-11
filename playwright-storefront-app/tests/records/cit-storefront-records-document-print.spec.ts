import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Records @records', () => {
  test('Citizen can print the document through Storefront. @OGT-34329 @broken_test', async ({
    storeFrontRecordPage,
    myAccountPage,
    page,
    recordsApi,
  }) => {
    //Data setup
    await test.step(`Record setup`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Parallel,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
    });

    await test.step('Load submitted record in Storefront', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
    });

    await test.step('Verify record contains record steps', async () => {
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Payment);
      await storeFrontRecordPage.validateRecordContainsStep(
        TestSteps.Inspection,
      );
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Approval);
      await storeFrontRecordPage.clickRecordStepByNameAnyStatus(
        TestSteps.Document,
      );
    });
    await test.step('Click print button and Verify Print page', async () => {
      // Get page after a specific action (e.g. clicking a link)
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        await storeFrontRecordPage.clickPrintDocument(),
      ]);
      await newPage.waitForLoadState();
      await page.keyboard.press('Escape');
      await page.keyboard.press('Enter');
      const pagesList = page.context().pages();
      const aa332 = await pagesList[2].locator('//body').innerHTML();
      expect(aa332).toContain(baseConfig.citTempData.recordId);
    });
  });
});
