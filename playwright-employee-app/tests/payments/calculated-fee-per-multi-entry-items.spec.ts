import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.describe('Employee App - Calculated fees based on Multi-entries @fees @payments', () => {
  test.use({storageState: ADMIN_SESSION});

  test.beforeEach(
    async ({
      navigationBarPage,
      selectRecordTypePage,
      page,
      employeeAppUrl,
      createRecordPage,
    }) => {
      await test.step(`Log in and start a record draft`, async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickCreateRecordButton();
        await navigationBarPage.validateOpenGovLogoVisibility(true);
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Record_type_step_fees,
        );
        await createRecordPage.fillTextFormField('Amount', '1', 'single');
      });
    },
  );

  test(`Fee setup and fee calculation based on MEI items @OGT-45567 @broken_test @Xoriant_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    for (let i = 0; i < 3; i++) {
      await test.step('Add 3 Multi-entry items', async () => {
        await createRecordPage.openNewMultiEntrySection(
          'Another Multi entry fee calculation',
        );
        await createRecordPage.saveMultiEntrySection();
      });
    }

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Open the payment step', async () => {
      await internalRecordPage.clickRecordStepName('Mandatory Payment');
    });

    await test.step('Verify the fee has correct value', async () => {
      await internalRecordPage.validateFeeWith(
        'Calculated fee per Multi-entry items',
        '300',
      );
    });
  });

  test(`User can verify MEI Fees @OGT-46000 @broken_test @Xoriant_test`, async ({
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Add a Multi-entry item with a form field', async () => {
      await createRecordPage.openNewMultiEntrySection(
        'Another Multi entry fee calculation',
      );
      await createRecordPage.fillTextFormField(
        'Another Multi-Entry Amount',
        '200',
        'multi',
      );
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step('Save record', async () => {
      await createRecordPage.saveRecord();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Open the payment step', async () => {
      await internalRecordPage.clickRecordStepName('Mandatory Payment');
    });

    await test.step('Verify the fee has the correct value', async () => {
      await internalRecordPage.validateFeeWith(
        'Calculated fee per Multi-entry field',
        '100',
      );
    });

    await test.step('Open the record details', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });

    await test.step('Change the value of the Multi-entry from field connected to the fee', async () => {
      await internalRecordPage.editAndSaveFormField(
        'Another Multi entry fee calculation',
        'Another Multi-Entry Amount',
        '600',
      );
    });

    await test.step("Verify the fee's value has been re-calculated", async () => {
      await internalRecordPage.clickRecordStepName('Mandatory Payment');
      await internalRecordPage.validateFeeWith(
        'Calculated fee per Multi-entry field',
        '300',
      );
    });
  });
});
