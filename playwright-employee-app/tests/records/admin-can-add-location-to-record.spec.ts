import {expect, test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Records @records', () => {
  test('Verify that searching for location return results while adding it to a record @OGT-33958 @broken_test @Xoriant_Test', async ({
    createRecordPage,
    navigationBarPage,
    page,
    employeeAppUrl,
  }) => {
    const address = '1 North Jefferson Avenue, St. Louis, MO';
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });
    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });
    await test.step('Create record [01_Renewal_campaign_tests] from department [Test Department]', async () => {
      await createRecordPage.selectDepartment('Test Department');
      await createRecordPage.selectRecordByName('01_Renewal_campaign_tests');
    });
    await test.step('Search with address street', async () => {
      await createRecordPage.clickAddLocationBtn();
      await page.click(createRecordPage.elements.addressLocationType);
      await page.fill(
        createRecordPage.elements.locationSearchInput,
        '1 North Jefferson Avenue',
      );
    });
    await test.step('Verify similar locations returned in search results with street name', async () => {
      await page
        .locator(
          createRecordPage.elements.locationSearchInputResultRow.selector(
            address,
          ),
        )
        .waitFor();
      const locationResults = page.locator(
        createRecordPage.elements.locationSearchInputResultRow.selector(
          '1 North Jefferson Avenue',
        ),
      );
      expect(await locationResults.count()).toBeGreaterThan(1);
    });
  });
});
