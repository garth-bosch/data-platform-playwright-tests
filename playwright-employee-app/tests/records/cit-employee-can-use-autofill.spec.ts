import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Search @users @search', () => {
  test('Verify that autofill will pull contractor name @OGT-34251 @broken_test @Xoriant_test', async ({
    page,
    employeeAppUrl,
    navigationBarPage,
    selectRecordTypePage,
    createRecordPage,
  }) => {
    await test.step('Login to EA and start a record draft', async () => {
      await page.goto(employeeAppUrl);
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(
        TestRecordTypes.Autofill_Test.name,
      );
    });

    await test.step('Search for an autofill entry', async () => {
      await createRecordPage.searchForAutofillData(
        'Toledo',
        '127 russells mills rd s. dartmouth  MA 02748',
      );
    });

    await test.step('Verify automatically filled fields', async () => {
      await createRecordPage.verifyAutomaticallyFilledFormField(
        'Single Entry Section',
        'Name',
      );
      await createRecordPage.verifyAutomaticallyFilledFormField(
        'Single Entry Section',
        'City',
      );
      await createRecordPage.verifyAutomaticallyFilledFormField(
        'Single Entry Section',
        'Address 1',
      );
    });
  });
});
