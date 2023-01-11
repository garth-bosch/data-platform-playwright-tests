import {test} from '../../src/base/base-test';
import {TestRecordTypes} from '@opengov/cit-base/build/constants/cit-constants';

test.describe('Storefront - Record type search @record-type', () => {
  test.beforeEach(async ({storefrontUrl, page}) => {
    await page.goto(storefrontUrl);
  });

  test('Record types for disabled categories are hidden from Public portal @OGT-34368 @smoke', async ({
    storeFrontRecordPage,
  }) => {
    const recordTypeName = TestRecordTypes.Fire_Department;
    await test.step(`Confirm record type:  ${recordTypeName} is not visible`, async () => {
      await storeFrontRecordPage.searchForRecordType(recordTypeName, false);
    });
  });

  test('Search for enabled categories but toggled off record types are hidden from Public portal @OGT-34367 @smoke', async ({
    storeFrontRecordPage,
  }) => {
    const recordTypeName = TestRecordTypes.Api_Notification_Test.name;
    await test.step(`Confirm record type:  ${recordTypeName} is not visible`, async () => {
      await storeFrontRecordPage.searchForRecordType(recordTypeName, false);
    });
  });

  test('Search for enabled categories and toggled on record types are searchable in Public portal @OGT-34366 @smoke', async ({
    storeFrontRecordPage,
  }) => {
    const recordTypeName = TestRecordTypes.Ghost_Test.name;
    await test.step(`Confirm record type:  ${recordTypeName} is visible`, async () => {
      await storeFrontRecordPage.searchForRecordType(recordTypeName, true);
    });
  });
});
