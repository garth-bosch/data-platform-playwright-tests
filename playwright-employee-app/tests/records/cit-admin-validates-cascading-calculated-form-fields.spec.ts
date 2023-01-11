import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.describe('Employee App - Records details @records', () => {
  test.use({storageState: ADMIN_SESSION});

  test(`Calculated FFs based on Cascading fields from Form calculate correctly when editing field entries @OGT-46208 @broken_test @known_defect`, async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    selectRecordTypePage,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step(`Log in and start a record draft`, async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(
        TestRecordTypes.Circular_Calc_FF.name,
      );
    });
    await test.step('Fill form fields', async () => {
      await createRecordPage.fillTextFormField('A', '1');
      await createRecordPage.fillTextFormField('B', '2');
    });
    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });
    await test.step('Verify form field values', async () => {
      await internalRecordPage.validateFormFieldValue('Num section', 'A', '1');
      await internalRecordPage.validateFormFieldValue('Num section', 'B', '2');
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'A + 100',
        '101',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'B * 100',
        '200',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'A + B + 100',
        '103',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'Sum of all',
        '407',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'Sum off all - A',
        '406',
      );
    });
    await test.step('Change base form filed values', async () => {
      await internalRecordPage.editAndSaveFormField('Num section', 'A', '3');
      await internalRecordPage.editAndSaveFormField('Num section', 'B', '4');
    });
    await test.step('Verify re-calculated form field values', async () => {
      await internalRecordPage.validateFormFieldValue('Num section', 'A', '3');
      await internalRecordPage.validateFormFieldValue('Num section', 'B', '4');
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'A + 100',
        '103',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'B * 100',
        '400',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'A + B + 100',
        '107',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'Sum of all',
        '617',
      );
      await internalRecordPage.validateFormFieldValue(
        'Num section',
        'Sum off all - A',
        '614',
      );
    });
  });
});
