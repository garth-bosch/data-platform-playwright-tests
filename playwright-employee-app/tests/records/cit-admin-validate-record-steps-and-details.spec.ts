import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.describe('Employee App - Records details @records', () => {
  test.use({storageState: ADMIN_SESSION});

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        TestLocation.Test_Point_Location,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
          {
            fieldName: 'Payment',
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
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Validate all record details tabs are loaded @OGT-33576 @broken_test', async ({
    internalRecordPage,
  }) => {
    await test.step('Verify all default tabs are displayed', async () => {
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Verify each default tab can be opened', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Details');
      await internalRecordPage.clickRecordDetailsTabSection('Activity');
      await internalRecordPage.clickRecordDetailsTabSection('Applicant');
      await internalRecordPage.clickRecordDetailsTabSection('Location');
      await internalRecordPage.clickRecordDetailsTabSection('Details');
    });
  });

  test('Validate all record steps are loaded for a new record @OGT-33577 @broken_test', async ({
    internalRecordPage,
  }) => {
    await test.step('Verify all default tabs are displayed', async () => {
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });

    await test.step('Verify each workflow step can be opened', async () => {
      await internalRecordPage.clickRecordStepName('Approval');
      await internalRecordPage.clickRecordStepName('Payment');
      await internalRecordPage.clickRecordStepName('Inspection');
      await internalRecordPage.clickRecordStepName('Document');
    });
  });
});
