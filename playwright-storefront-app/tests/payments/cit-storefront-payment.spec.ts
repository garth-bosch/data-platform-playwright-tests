import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {PaymentMethod} from '../../src/pages/public-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

const recordStepName = 'Payment';
const paymentReceiptData = {
  'Payment Type': 'Credit Card',
  'Record Type': '01_Record_Steps_Test',
  'Total Amount': '100.00',
  Status: 'Paid',
};

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Payment @payments', () => {
  test.beforeEach(async ({storeFrontRecordPage, recordsApi, myAccountPage}) => {
    await recordsApi.createRecordWith(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
      null,
      [
        {
          fieldName: recordStepName,
          fieldValue: 'true',
        },
      ],
    );
    await myAccountPage.gotoRecordSubmissionPageById();
    await storeFrontRecordPage.validateRecordContainsStep(recordStepName);
    await storeFrontRecordPage.clickRecordStepByName(recordStepName);
  });

  test('Citizen can pay with bank account through Storefront @OGT-34382 @broken_test', async ({
    storeFrontRecordPage,
  }) => {
    await storeFrontRecordPage.completeStorefrontPaymentWith(
      PaymentMethod.Bank,
    );
    await storeFrontRecordPage.validateRecordStepStatus(
      recordStepName,
      'Completed',
    );
  });

  test('Citizen can pay with check through Storefront @OGT-34379', async ({
    storeFrontRecordPage,
  }) => {
    await storeFrontRecordPage.completeStorefrontPaymentWith(
      PaymentMethod.Check,
    );
  });

  test('Citizen cannot pay with check through Storefront @OGT-44402 @Xoriant_Test', async ({
    storeFrontRecordPage,
  }) => {
    await storeFrontRecordPage.completeStorefrontPaymentWith(
      PaymentMethod.Check,
    );
    await storeFrontRecordPage.verifyCheckOrCashNotification();
  });

  test('Citizen can pay with credit card through Storefront @OGT-34381 @broken_test @OGT-39957 @broken_test', async ({
    storeFrontRecordPage,
  }) => {
    await storeFrontRecordPage.completeStorefrontPaymentWith(
      PaymentMethod.Credit,
    );
    await storeFrontRecordPage.validateRecordStepStatus(
      recordStepName,
      'Completed',
    );
    await storeFrontRecordPage.printAndValidateReceipt(paymentReceiptData);
  });

  test('Citizen can proceed payment from My Account page @OGT-34383', async ({
    myAccountPage,
  }) => {
    await test.step('Complete payment from my account page.', async () => {
      await myAccountPage.proceedToMyAccount();
      await myAccountPage.proceedToPayments();
      await myAccountPage.completeFirstPaymentFromTable(recordStepName);
    });
  });
});
