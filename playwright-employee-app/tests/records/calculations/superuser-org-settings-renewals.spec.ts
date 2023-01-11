import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Organization settings page', () => {
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;

  test.beforeEach(async ({employeeAppUrl, recordTypesApi, page}) => {
    await test.step('Create a Record Type', async () => {
      await recordTypesApi.createRecordType(recTypeName, 'Test Department', {
        publish: true,
      });
      await page.goto(employeeAppUrl);
    });
  });
  test('SuperUser "generate claim code" button is never present for standard Admin or Employee users @OGT-44549 @Xoriant_Test ', async ({
    baseConfig,
    recordsApi,
    page,
    employeeAppUrl,
    internalRecordPage,
  }) => {
    await test.step('Navigate to RT and Renewal tab', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
    });
    await test.step('navigate to the record', async () => {
      await page.goto(employeeAppUrl);
      await internalRecordPage.navigateById();
    });
    await test.step('Verify generate claim code is not present', async () => {
      await internalRecordPage.clickRecordActionsDropdownButton();
      await expect(
        await page.locator(
          internalRecordPage.elements.recordActionsSupUserGenerateClaimCode,
        ),
      ).toBeHidden();
    });
  });
});
