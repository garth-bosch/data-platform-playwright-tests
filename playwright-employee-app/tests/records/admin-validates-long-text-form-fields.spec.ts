import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.describe('Employee App - Records details @records', () => {
  test.use({storageState: ADMIN_SESSION});

  test.beforeEach(
    async ({navigationBarPage, selectRecordTypePage, page, employeeAppUrl}) => {
      await test.step(`Log in and start a record draft`, async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickCreateRecordButton();
        await navigationBarPage.validateOpenGovLogoVisibility(true);
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(TestRecordTypes.Api_Test);
      });
    },
  );

  test(`Validate script tags are sanitized in 'Long Text Entry' form field in multi-entry section @OGT-33596 @broken_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Fill a Multi-entry Long text form field with HTML code', async () => {
      await createRecordPage.openNewMultiEntrySection('Broken Modal section');
      await createRecordPage.fillTextFormField(
        'Long Text Entry',
        '<html><script type = “text/  javascript”> function fun() { alert (“OK”); }</script> </html>',
        'multi',
      );
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step('Verify HTML content has been sanitized', async () => {
      const element = createRecordPage.elements.longTextFormFieldText.selector(
        `Long Text Entry`,
        1,
        1,
      );
      // The text is indeed added
      await expect(createRecordPage.page.locator(element)).toContainText(
        `script type = “text/  javascript”`,
      );
      // The <script> has been sanitized
      await expect(createRecordPage.page.locator(element)).not.toContainText(
        `<script`,
      );
      await expect(createRecordPage.page.locator(element)).not.toContainText(
        `</script>`,
      );
    });

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Go to another screen and navigates back to the Details', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });

    await test.step('Print record and verify all print settings are displayed', async () => {
      await internalRecordPage.clickPrintRecordButton();
      await internalRecordPage.verifySettingSelectedAndPrint('Show Timeline');
    });
  });

  test(`Validate style tags are sanitized in 'Long Text Entry' form field in multi-entry section @OGT-33597 @broken_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Fill a Multi-entry Long text form field with HTML code', async () => {
      await createRecordPage.openNewMultiEntrySection('Broken Modal section');
      await createRecordPage.fillTextFormField(
        'Long Text Entry',
        '<html><style>h1 {color:red};}</style><h1> Sagar</h1><html>',
        'multi',
      );
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step('Verify HTML content has been sanitized', async () => {
      const element = createRecordPage.elements.longTextFormFieldText.selector(
        `Long Text Entry`,
        1,
        1,
      );
      // The text is indeed added
      await expect(createRecordPage.page.locator(element)).toContainText(
        `{color:red}`,
      );
      // The <script> has been sanitized
      await expect(createRecordPage.page.locator(element)).not.toContainText(
        `<style>`,
      );
      await expect(createRecordPage.page.locator(element)).not.toContainText(
        `</style>`,
      );
    });

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Go to another screen and navigates back to the Details', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });

    await test.step('Print record and verify all print settings are displayed', async () => {
      await internalRecordPage.clickPrintRecordButton();
      await internalRecordPage.verifySettingSelectedAndPrint('Show Timeline');
    });
  });

  test(`Validate style tags are preserved in 'Short Text Entry' field in multi-entry section @OGT-33598 @broken_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Fill a Multi-entry Short text form field with HTML code', async () => {
      await createRecordPage.openNewMultiEntrySection('Broken Modal section');
      await createRecordPage.fillTextFormField(
        'Short Text Entry',
        '<html><style>h1 {color:red};}</style><h1> Sagar</h1><html>',
        'multi',
      );
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step('Verify HTML content has NOT been sanitized', async () => {
      const element = createRecordPage.elements.longTextFormFieldText.selector(
        `Short Text Entry`,
        1,
        2,
      );
      await expect(createRecordPage.page.locator(element)).toContainText(
        '<html><style>h1 {color:red};}</style><h1> Sagar</h1><html>',
      );
    });

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Go to another screen and navigates back to the Details', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });

    await test.step('Print record and verify all print settings are displayed', async () => {
      await internalRecordPage.clickPrintRecordButton();
      await internalRecordPage.verifySettingSelectedAndPrint('Show Timeline');
    });
  });

  test(`Validate script tags are not sanitized in text form field in single-entry section @OGT-33599 @broken_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Fill a Single-entry Long text form field with HTML code', async () => {
      await createRecordPage.fillTextFormField(
        'Long text',
        '<html><script type = “text/javascript”> function fun() { alert (“OK”); }</script> </html>',
        'single',
      );
    });

    await test.step('Fill a Single-entry Short text form field with HTML code', async () => {
      await createRecordPage.fillTextFormField(
        'Short text',
        '<html><script type = “text/javascript”> function fun() { alert (“OK”); }</script> </html>',
        'single',
      );
    });

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Verify HTML content has NOT been sanitized', async () => {
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.formFieldDetails.selector(
            'Short text',
            '<html><script type = “text/javascript”> function fun() { alert (“OK”); }</script> </html>',
          ),
        ),
      ).toBeVisible();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.formFieldDetails.selector(
            'Long text',
            '<html><script type = “text/javascript”> function fun() { alert (“OK”); }</script> </html>',
          ),
        ),
      ).toBeVisible();
    });

    await test.step('Go to another screen and navigates back to the Details', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });

    await test.step('Print record and verify all print settings are displayed', async () => {
      await internalRecordPage.clickPrintRecordButton();
      await internalRecordPage.verifySettingSelectedAndPrint('Show Timeline');
    });
  });
});
