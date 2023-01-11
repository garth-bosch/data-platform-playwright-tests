import {test} from '../../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {TemplateStepTypes} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Renewal workflow @renewal @workflow', () => {
  test('Admin can set up workflows to be parallel - Approval - Renewal @OGT-45255 @Xoriant_Test @smoke', async ({
    recordTypesApi,
    page,
    baseConfig,
    recordTypesSettingsPage,
    workflowDesignerPage,
  }) => {
    const recordTypeName = `@OGT-45255${faker.random.alphaNumeric(4)}`;

    await test.step('Create a new Record Type', async () => {
      await recordTypesApi.createRecordType(recordTypeName, 'Test Department');
    });

    await test.step('Open the record type > renewal tab', async () => {
      await recordTypesSettingsPage.proceedToRecordTypeRenewalById(
        baseConfig.citTempData.recordTypeId,
      );
      await recordTypesSettingsPage.switchRenews();
    });

    await test.step('Add 2 parallel renewal workflow steps', async () => {
      await recordTypesApi.createTemplateStep(
        baseConfig.citTempData.recordTypeId,
        TemplateStepTypes.Approval,
        {
          label: 'First approval step',
          isRenewal: true,
        },
      );
      await recordTypesApi.createTemplateStep(
        baseConfig.citTempData.recordTypeId,
        TemplateStepTypes.Approval,
        {
          label: 'Second approval step',
          isRenewal: true,
          isParallel: true,
        },
      );
    });

    await test.step('Verify both steps are present', async () => {
      await page.reload();
      await workflowDesignerPage.clickStepByName('First approval step');
      await workflowDesignerPage.clickStepByName('Second approval step');
    });
  });
});
