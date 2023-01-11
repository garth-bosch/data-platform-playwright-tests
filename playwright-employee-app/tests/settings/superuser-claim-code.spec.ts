import {expect, test} from '../../src/base/base-test';
import {
  SUPER_USER_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {RecordStepStatus} from '../../src/pages/ea-record-page';

test.use({storageState: SUPER_USER_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  test.beforeEach(async ({page, employeeAppUrl, navigationBarPage}) => {
    await test.step('Login to EA and navigate to Settings page', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.clickAdminSettingsButton();
    });
  });
  test('SuperUser "generate claim code" button is present and functional in all renewable records @OGT-44404 @broken_test @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    recordsApi,
    internalRecordPage,
    recordTypesApi,
  }) => {
    const testName = `@OGT-44404`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const recTypeName = `${testName}_${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await recordTypesApi.createRecordType(recTypeName);
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn();
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc);
    });
    await test.step('Add one more with sequence', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc2,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc2);
    });
    await test.step('Verify not parallel', async () => {
      await page.isHidden(
        renewalWorkflowDesignerPage.elements.sequenceStepsIndicator,
        {timeout: 6000},
      );
    });

    await test.step('Add record and navigate', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Parallel,
        undefined,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Approval',
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
      await internalRecordPage.navigateById();
    });
    await test.step('Verify Claim code', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await expect(
        await page.locator(
          internalRecordPage.elements.recordActionsSupUserGenerateClaimCode,
        ),
      ).toBeVisible();
    });
  });
  test('SuperUser "run sequence action" button is present and functional in all records @OGT-44346 @Xoriant_Test', async ({
    page,
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    recordsApi,
    internalRecordPage,
    recordTypesApi,
  }) => {
    const testName = `@OGT-44404`;
    const name = `${testName}${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const updatedNameSequenc2 = `${name}-seq-${faker.random.alphaNumeric(4)}`;
    const recTypeName = `${testName}_${faker.random.alphaNumeric(4)}`;
    await test.step('Navigate to RT and Renewal tab', async () => {
      await recordTypesApi.createRecordType(recTypeName);
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordType(recTypeName);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Set Renewal on', async () => {
      await renewalWorkflowDesignerPage.setRenewalOn();
    });
    await test.step('Add new Renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(updatedNameSequenc);
    });
    await test.step('Add one more with sequence', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        updatedNameSequenc2,
      );
      await renewalWorkflowDesignerPage.updateStepSequence(
        updatedNameSequenc2,
        false,
      );
    });
    await test.step('Verify not parallel', async () => {
      await page.isHidden(
        renewalWorkflowDesignerPage.elements.sequenceStepsIndicator,
        {timeout: 6000},
      );
    });

    await test.step('Add record and navigate and renew', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await internalRecordPage.navigateById();
      await internalRecordPage.clickRecordRenewal();
      await internalRecordPage.beginRenewalRecord();
      await internalRecordPage.submitRenewalRecord();
    });
    await test.step('Switch status for both records', async () => {
      await internalRecordPage.clickRecordStepName(updatedNameSequenc2);
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Active,
      );
      await internalRecordPage.clickRecordStepName(updatedNameSequenc);
      await internalRecordPage.updateRecordStepStatusTo(
        RecordStepStatus.Inactive,
      );
    });
    await test.step('Verify Claim code', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await internalRecordPage.clickOnRunSequenceButton();
    });

    await test.step('Verify status', async () => {
      await internalRecordPage.clickRecordStepName(updatedNameSequenc);
      await internalRecordPage.verifyRecordStepStatusIs(
        RecordStepStatus.In_Progress,
      );
    });
  });
});
