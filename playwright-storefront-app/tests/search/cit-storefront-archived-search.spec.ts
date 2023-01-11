import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Search @search', () => {
  test.beforeEach(async ({storefrontUrl, page}) => {
    await page.goto(storefrontUrl);
  });

  test('Search for Archived Records @OGT-44047 @Xoriant_Test', async ({
    recordsApi,
    storeFrontUserPage,
  }) => {
    /*@OGT-44856*/
    /*above is satisfied as part of this*/
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(TestRecordTypes.Record_Steps_Test);
    });
    await test.step('Archive the record using api', async () => {
      await recordsApi.archiveRecord();
    });
    await test.step('Verify Archived record is not displayed in search results', async () => {
      await storeFrontUserPage.verifySearchResultForRecord(false);
    });
  });
});
