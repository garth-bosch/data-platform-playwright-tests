import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

let locationInfo: {
  name: string;
  type: number;
  location: string;
};

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Record steps comment @records @record-steps @ESN-4731', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        locationInfo,
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

  test('Validate comment or note added in workflow step is saved as draft @OGT-44593, @OGT-44508, @OGT-44595, @OGT-44594 @smoke', async ({
    recordPage,
  }) => {
    await test.step('Validate comment added in workflow step is saved as draft', async () => {
      await recordPage.clickRecordStepName('Approval');
      await recordPage.typeCommentInStep('Test Approval');
      await recordPage.clickRecordStepName('Payment');
      await recordPage.validateCommentInStepHasText('');
      await recordPage.clickRecordStepName('Approval');
      await recordPage.validateCommentInStepHasText('Test Approval');
      await recordPage.postCommentInStep();
      await recordPage.validateCommentInStepHasText('');
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.validateCommentInStepHasText('');
    });
  });

  test('Validate internal note added in workflow step is saved as draft @OGT-44652, @OGT-44649, @OGT-44650, @OGT-44651', async ({
    recordPage,
  }) => {
    await test.step('Validate internal note added in workflow step is saved as draft', async () => {
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.typeInternalCommentInStep('Inspection Note');
      await recordPage.clickRecordStepName('Document');
      await recordPage.validateInternalCommentInStepHasText('');
      await recordPage.clickRecordStepName('Inspection');
      await recordPage.validateInternalCommentInStepHasText('Inspection Note');
      await recordPage.postInternalCommentInStep();
      await recordPage.validateInternalCommentInStepHasText('');
      await recordPage.clickRecordStepName('Payment');
      await recordPage.validateInternalCommentInStepHasText('');
    });
  });
});
