import {test} from '../../src/base/base-test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';

test.use({storageState: CITIZEN_SESSION});
test.describe('Record Types tests - Deletions etc @records @recordTypes', () => {
  const recTypeName = `Default_Rec_Type_${faker.random.alphaNumeric(4)}`;
  let recTypeNo;
  test.beforeEach(async ({storefrontUrl, recordTypesApi, page}) => {
    await test.step('Create a Record Type', async () => {
      recTypeNo = await recordTypesApi.createRecordType(recTypeName);
      await page.goto(storefrontUrl);
    });
  });

  test('Pre-existing records from a deleted record type can be searched for in Storefront. @OGT-34481 @Xoriant_Test', async ({
    recordsApi,
    baseConfig,
    page,
    storefrontUrl,
    storeFrontUserPage,
    recordTypesApi,
  }) => {
    await test.step('Add 2 records', async () => {
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: recTypeNo,
      });
      await recordsApi.createRecordWith({
        name: recTypeName,
        id: recTypeNo,
      });
    });
    await test.step('Delete record type', async () => {
      await recordTypesApi.deleteRecordType(
        baseConfig.citTempData.recordTypeId,
      );
    });
    await test.step('Search and verify both recs', async () => {
      await storeFrontUserPage.searchForRecord(
        baseConfig.citMultiRecordData
          .at(0)
          .data.attributes.recordNumber.toString(),
      );
      await page.goto(storefrontUrl);
      await storeFrontUserPage.searchForRecord(
        baseConfig.citMultiRecordData
          .at(1)
          .data.attributes.recordNumber.toString(),
      );
    });
  });
});
