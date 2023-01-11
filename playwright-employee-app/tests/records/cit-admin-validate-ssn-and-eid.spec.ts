import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {FormFieldType} from '@opengov/cit-base/build/api-support/api/recordsApi';

test.describe('Employee App - Records details @records', () => {
  test.use({storageState: ADMIN_SESSION});

  test('Admin should be able to reveal SSN form field from submitted record @OGT-43589 @broken_test', async ({
    recordsApi,
    internalRecordPage,
    formsPage,
  }) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST,
        null,
        null,
        [
          {
            fieldName: 'Social security number',
            fieldValue: '111-11-1111',
            fieldType: FormFieldType.SSN,
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });

    await test.step('Verify the SSN form field value is hidden', async () => {
      await formsPage.validateSsnOrEinFormField(
        'Social security number',
        'xxx-xx-1111',
      );
    });

    await test.step('Verify the value can be shown', async () => {
      await formsPage.validateShowLink('Social security number', true);
      await formsPage.validateSsnOrEinFormField(
        'Social security number',
        '111-11-1111',
      );
    });
  });

  test('Admin should be able to reveal EID form field from submitted record @OGT-43590 @broken_test', async ({
    recordsApi,
    internalRecordPage,
    formsPage,
  }) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST,
        null,
        null,
        [
          {
            fieldName: 'Employee ID',
            fieldValue: '12-2323232',
            fieldType: FormFieldType.EID,
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });

    await test.step('Verify the SSN form field value is hidden', async () => {
      await formsPage.validateSsnOrEinFormField('Employee ID', 'xx-xxx3232');
    });

    await test.step('Verify the value can be shown', async () => {
      await formsPage.validateShowLink('Employee ID', true);
      await formsPage.validateSsnOrEinFormField('Employee ID', '12-2323232');
    });
  });
});
