import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {PaymentMethod} from '../../src/pages/public-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {baseGeneralPaymentSettingsObject} from '@opengov/cit-base/build/api-support/api/commonApi';

test.use({storageState: CITIZEN_SESSION});
test.describe.configure({mode: 'serial'});
test.describe('Storefront - Payment - Echeck and CC tests @payments', () => {
  test.beforeEach(async ({recordsApi}) => {
    await recordsApi.createRecordWith(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
      null,
      [
        {
          fieldName: TestSteps.Payment,
          fieldValue: 'true',
        },
      ],
    );
  });

  test('Credit Card Customer vs. Community processing fees radio buttons present and functional @OGT-44124 @Xoriant_Test', async ({
    storeFrontRecordPage,
    commonApi,
    page,
    myAccountPage,
  }) => {
    let paymentSettingsBaseObject;
    await test.step('Setup User pays fees for credit card', async () => {
      paymentSettingsBaseObject = baseGeneralPaymentSettingsObject;
      paymentSettingsBaseObject.data.attributes.communityPaysCCFee = false;
      await commonApi.updateSystemSettingsPayments(paymentSettingsBaseObject);
    });
    await test.step('navigate to record step', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Payment);
      await storeFrontRecordPage.clickRecordStepByName(TestSteps.Payment);
    });
    await test.step('Verify Payment processing fees exist', async () => {
      await storeFrontRecordPage.checkStorefrontPaymentProcessingFees(
        PaymentMethod.Credit,
        '$3.98 processing fee',
      );
    });
    await test.step('Setup Community pays fees for credit card', async () => {
      paymentSettingsBaseObject.data.attributes.communityPaysCCFee = true;
      await commonApi.updateSystemSettingsPayments(paymentSettingsBaseObject);
      await page.reload(); /* Reload to see changes*/
    });
    await test.step('Verify Payment processing fees does not exist', async () => {
      await storeFrontRecordPage.checkStorefrontPaymentProcessingFees(
        PaymentMethod.Credit,
        'none',
      );
    });
  });

  test('E-check Customer vs. Community processing fees radio buttons present and functional @OGT-44125 @Xoriant_Test', async ({
    storeFrontRecordPage,
    commonApi,
    page,
    myAccountPage,
  }) => {
    let paymentSettingsBaseObject;
    await test.step('Setup User pays fees for check', async () => {
      paymentSettingsBaseObject = baseGeneralPaymentSettingsObject;
      paymentSettingsBaseObject.data.attributes.communityPaysCheckFee = false;
      await commonApi.updateSystemSettingsPayments(paymentSettingsBaseObject);
    });
    await test.step('Navigate to record step', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Payment);
      await storeFrontRecordPage.clickRecordStepByName(TestSteps.Payment);
    });
    await test.step('Verify Payment processing fees exist', async () => {
      await storeFrontRecordPage.checkStorefrontPaymentProcessingFees(
        PaymentMethod.Bank,
        '$2.25 processing fee',
      );
    });
    await test.step('Setup Community pays fees for Check', async () => {
      paymentSettingsBaseObject.data.attributes.communityPaysCheckFee = true;
      await commonApi.updateSystemSettingsPayments(paymentSettingsBaseObject);
      await page.reload(); /* Reload to see changes*/
    });
    await test.step('Verify Payment processing fees does not exist', async () => {
      await storeFrontRecordPage.checkStorefrontPaymentProcessingFees(
        PaymentMethod.Bank,
        'none',
      );
    });
  });
});
