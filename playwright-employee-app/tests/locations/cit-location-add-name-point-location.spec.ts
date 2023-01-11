import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('Verify the notes and flags and record status on location page', () => {
  test('Verify user can name the created point location @OGT-34200 @broken_test @Xoriant_Test', async ({
    createRecordPage,
    navigationBarPage,
    page,
    employeeAppUrl,
  }) => {
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
    await test.step('Create a Point Location and update Name', async () => {
      await createRecordPage.createAndSelectPointLocation('Test Location Name');
    });
  });
});
