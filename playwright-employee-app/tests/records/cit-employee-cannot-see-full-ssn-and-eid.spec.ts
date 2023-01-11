import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {FormFieldType} from '@opengov/cit-base/build/api-support/api/recordsApi';

test.describe('Employee App - Records details @records', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test('Employee should not be able to reveal SSN form field from submitted record @OGT-43592 @broken_test', async ({
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

    await test.step('Verify the value cannnot be shown', async () => {
      await formsPage.validateShowLink('Social security number', false);
    });
  });

  test('Employee should not be able to reveal EID form field from submitted record @OGT-43591 @broken_test', async ({
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

    await test.step('Verify the value cannot be shown', async () => {
      await formsPage.validateShowLink('Employee ID', false);
    });
  });
});
