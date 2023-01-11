import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';

test.describe('Employee App - Grant & Revoke Guest Info on Records @records', () => {
  test.use({storageState: ADMIN_SESSION});

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        undefined,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Verify employee user add and revoke guest through employee app @OGT-34291 @Xoriant_Test', async ({
    internalRecordPage,
    page,
  }) => {
    await test.step(' Go to the record and add a step', async () => {
      await internalRecordPage.clickRecordStepName('Document');
      await expect(
        page.locator(internalRecordPage.elements.statusFilter),
      ).toBeHidden();
      await expect(
        page.locator(
          internalRecordPage.elements.statusFilterValue.selector('On Hold'),
        ),
      ).toBeHidden();
      await internalRecordPage.clickRecordStepName('Payment');
      await expect(
        page.locator(internalRecordPage.elements.statusFilter),
      ).toBeHidden();
      await expect(
        page.locator(
          internalRecordPage.elements.statusFilterValue.selector('On Hold'),
        ),
      ).toBeHidden();
    });
  });
});

test.describe('Employee App - Grant & Revoke Guest Info on Records - Employee @records', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        undefined,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
        ],
      );
    });
    await test.step('Navigate to record page by URL', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Verify employee user add and revoke guest through employee app @OGT-48006 @Xoriant_Test @known_defect ? Does not load record', async ({
    internalRecordPage,
    page,
  }) => {
    await test.step(' Go to the record and add a step', async () => {
      await internalRecordPage.clickRecordStepName('Document');
      await expect(
        page.locator(internalRecordPage.elements.statusFilter),
      ).toBeHidden();
      await expect(
        page.locator(
          internalRecordPage.elements.statusFilterValue.selector('On Hold'),
        ),
      ).toBeHidden();
      await internalRecordPage.clickRecordStepName('Payment');
      await expect(
        page.locator(internalRecordPage.elements.statusFilter),
      ).toBeHidden();
      await expect(
        page.locator(
          internalRecordPage.elements.statusFilterValue.selector('On Hold'),
        ),
      ).toBeHidden();
    });
  });
});
