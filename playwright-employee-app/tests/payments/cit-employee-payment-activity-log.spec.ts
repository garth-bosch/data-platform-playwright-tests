import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PaymentMethod} from '../../src/pages/ea-record-page';
import {expect} from '@playwright/test';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Payment step activity log', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record with a Payment step and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName('Payment');
    });
  });

  test('Verify that activity log contains correct user for fee steps @OGT-34395', async ({
    page,
    internalRecordPage,
    authPage,
  }) => {
    await test.step('Override the "TestFee" value', async () => {
      await internalRecordPage.overrideFee('TestFee', 150);
    });
    await test.step('Validate the step activity log', async () => {
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.stepActivityText,
          {
            hasText: `${TestUsers.Api_Admin.name} overrode fee TestFee to 150.00`,
          },
        ),
      ).toBeVisible();
    });
    await test.step('Make a payment via Check', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Check);
    });
    await test.step('Validate the step activity log', async () => {
      await page.reload();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.stepActivityText,
          {hasText: `${TestUsers.Api_Admin.name} processed a $150.00 payment`},
        ),
      ).toBeVisible();
    });
    await test.step('Re-login as another admin user', async () => {
      await authPage.logout();
      await authPage.loginAs(
        baseConfig.citTestData.citSuperUserEmail,
        baseConfig.citTestData.citAppPassword,
      );
      await authPage.page.waitForNavigation();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.globalSearchBar,
        ),
      ).toBeVisible();
    });
    await test.step('Open the record > the payment step', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickRecordStepName('Payment');
    });
    await test.step('Override the "TestFee" value one more time', async () => {
      await internalRecordPage.overrideFee('TestFee', 200);
    });
    await test.step('Validate the step activity log', async () => {
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.stepActivityText,
          {
            hasText: `${TestUsers.Superuser.name} overrode fee TestFee to 200.00`,
          },
        ),
      ).toBeVisible();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.stepActivityText,
          {hasText: 'reactivated this step'},
        ),
      ).toBeVisible();
    });
    await test.step('Make a payment via Cash', async () => {
      await internalRecordPage.completePaymentStepWith(PaymentMethod.Cash);
    });
    await test.step('Validate the step activity log', async () => {
      await page.reload();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.stepActivityText,
          {hasText: `${TestUsers.Superuser.name} processed a $50.00 payment`},
        ),
      ).toBeVisible();
    });
  });
});
