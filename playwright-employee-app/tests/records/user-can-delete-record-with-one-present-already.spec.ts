import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {RecordStep} from '../../src/pages/ea-record-page';
import {expect} from '@playwright/test';

const testName = `@OGT-44742`;
const name = `${testName}${faker.random.alphaNumeric(4)}`;
test.use({storageState: ADMIN_SESSION});
test.describe('User can delete project from record with one already present', () => {
  test.beforeEach(async ({projectsApi, recordsApi}) => {
    await test.step('Project setup', async () => {
      await projectsApi.createProject(name);
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
      );
    });
  });
  test('User can delete project from record with one already present @OGT-44742 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Navigate to employee app', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Proceed to record and add project and verify project presence on record page', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.addToProject(name, testName);
      await internalRecordPage.validateProjectLabelOnTopOfRecordPage();
    });
    await test.step('Delete project and verify project is deleted', async () => {
      await internalRecordPage.deleteProjectFromRecord();
      await internalRecordPage.verifyNoProjectLabelOnTop();
    });
  });
});

test.describe('Adhoc records steps persists the completion order', () => {
  const recType = `plc_prefix_OGT-34485_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi, recordsApi, internalRecordPage}) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recType, 'Test Department', {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Administer'],
      });
    });
    await test.step('Create Record', async () => {
      await recordsApi.createRecordWith(
        {
          name: baseConfig.citTempData.recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        undefined,
        undefined,
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test('Adhoc records steps persists the completion order @OGT-34485 @Xoriant_Test', async ({
    recordPage,
  }) => {
    await test.step('Add steps randomly', async () => {
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
      );
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Payment],
        'Adhoc-Payment',
      );
      await recordPage.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc2-Inspection',
      );
      await recordPage.clickRecordStepName(
        'Adhoc2-Inspection',
      ); /*So that a delay would load page properly*/
    });
    await test.step('Verify the steps order', async () => {
      const totStepNames = await recordPage.getTotalnavRows();
      await expect(await totStepNames[0].textContent()).toContain(
        'Adhoc-Inspection',
      );
      await expect(await totStepNames[1].textContent()).toContain(
        'Adhoc-Payment',
      );
      await expect(await totStepNames[2].textContent()).toContain(
        'Adhoc2-Inspection',
      );
    });
  });
});
