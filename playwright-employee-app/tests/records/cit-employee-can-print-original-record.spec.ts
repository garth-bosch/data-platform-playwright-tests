import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

test.describe('Employee App - Record @records', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test(
    '"Print Original Record" can be accessed and displays correct data @OGT-43983' +
      ' @Xoriant_test',
    async ({recordsApi, recordPage}) => {
      await test.step('Create a record and open it', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
          null,
          null,
          [
            {
              fieldName: 'Approval',
              fieldValue: 'true',
            },
          ],
        );
        await recordPage.proceedToRecordByUrl();
      });

      await test.step('Open record actions dropdown and print Original Record', async () => {
        await recordPage.clickRecordActionsDropdownButton();
      });

      await test.step('Verify original record data', async () => {
        const [printPage] = await Promise.all([
          recordPage.page.context().waitForEvent('page'),
          await recordPage.clickPrintOriginalRecord(),
        ]);
        await printPage.waitForLoadState();
        await printPage.bringToFront();
        const overallDoc = await printPage.locator('#pagecontent');
        await expect(overallDoc.locator('div h5')).toHaveText(
          TestRecordTypes.Record_Steps_Test.name,
        );
        await expect(overallDoc.locator('div h3')).toHaveText(
          baseConfig.citTempData.recordName,
        );
        await expect(overallDoc.locator('div small')).toHaveText(
          /Submitted On: \w+ \d{1,2}, \d{4}/,
        );
        await expect(overallDoc.locator('h4').first()).toHaveText('Form');

        const fieldElement = overallDoc.locator('div[class*=col]', {
          has: printPage.locator('label >> text="Approval"'),
        });
        await expect(fieldElement).toBeVisible();
        await expect(fieldElement.locator('div')).toHaveText('true');
      });
    },
  );
});
