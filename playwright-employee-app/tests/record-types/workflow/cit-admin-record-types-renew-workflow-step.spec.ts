import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultPayloadForRenewal,
  RecordTypeAccess,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {RecordStepStatus} from '../../../src/pages/ea-record-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Inspections related', () => {
  let recTypeNo;
  const dueDateTypes = {
    'days after step activation': '1',
    'days after step assignment': '2',
    'days after record submission': '3',
  };
  const testName = `@OGT-Xoriant`;
  const recTypeName = `${testName}_DueDates_${faker.random.alphaNumeric(5)}`;
  const addStepName = `${testName}_Workflow_${faker.random.alphaNumeric(4)}`;
  const documentName = `${testName}_${faker.random.alphaNumeric(4)}`;

  test.beforeEach(
    async ({employeeAppUrl, recordTypesApi, page, recordTypeWorkflowApi}) => {
      await test.step('Create a Record Type', async () => {
        recTypeNo = await recordTypesApi.createRecordType(
          recTypeName,
          'Test Department',
          {
            publish: true,
            employeeAccess: RecordTypeAccess['Can Edit'],
          },
        );
        /*__ set to renew*/
        const renewPay = JSON.parse(JSON.stringify(defaultPayloadForRenewal));
        renewPay.recordType.renews = true;
        await recordTypeWorkflowApi.setRecordTypeToRenewalFlowsOnOff(renewPay);
      });
      await test.step('Navigate to employee app', async () => {
        await page.goto(employeeAppUrl);
      });
    },
  );

  test('Steps may autocomplete upon expiration - Renewal @OGT-33925 @broken_test @Xoriant_Test', async ({
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    recordsApi,
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Add new renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'inspection',
        addStepName,
      );
    });
    await test.step('Open approval step', async () => {
      await renewalWorkflowDesignerPage.clickOnStepName(addStepName);
    });
    await test.step('set due date on workflow approval', async () => {
      await renewalWorkflowDesignerPage.setDueDateRecordType(
        dueDateTypes['days after record submission'],
        addStepName,
        true,
        0,
      );
    });
    await test.step('Add a record', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Create a renewal record', async () => {
      await recordPage.startDraftRecordRenewal();
      await recordPage.submitRenewalRecord();
    });
    await test.step('open step and verify step status', async () => {
      await recordPage.clickCustomStepByName(addStepName);
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Completed);
    });
  });

  test('Expiration date registers correctly based on Renewal workflow document settings @OGT-44271 @broken_test @Xoriant_Test', async ({
    recordTypesSettingsPage,
    navigationBarPage,
    renewalWorkflowDesignerPage,
    recordTypesApi,
    recordsApi,
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Add a record', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('Add a Document to RT', async () => {
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: documentName,
          recordTypeID: recTypeNo,
        },
      });
    });
    await test.step('Navigate to RT and Renewal tab', async () => {
      await navigationBarPage.clickAdminSettingsButton();
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(recTypeNo);
      await recordTypesSettingsPage.proceedToRenewalTab();
    });
    await test.step('Add New document renewal step', async () => {
      await renewalWorkflowDesignerPage.addNewStepRenewal(
        'document',
        addStepName,
      );
    });
    await test.step('Open document renewal step', async () => {
      await renewalWorkflowDesignerPage.clickOnStepName(addStepName);
    });
    await test.step('add document from template to renewal step', async () => {
      await renewalWorkflowDesignerPage.addDocumentFromTemplate(documentName);
    });
    await test.step('Open document renewal step', async () => {
      await renewalWorkflowDesignerPage.clickOnStepName(addStepName);
    });
    await test.step('set expiration date on document renewal step', async () => {
      await renewalWorkflowDesignerPage.setExipreDateOnDocumentRecordType(
        addStepName,
        0,
      );
    });
    await test.step('navigate to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Create a renewal record', async () => {
      await recordPage.startDraftRecordRenewal();
      await recordPage.submitRenewalRecord();
    });
    await test.step('open step and verify step status', async () => {
      await recordPage.clickCustomStepByName(addStepName);
      await recordPage.verifyRecordStepStatusIs(RecordStepStatus.Completed);
    });
  });
});
