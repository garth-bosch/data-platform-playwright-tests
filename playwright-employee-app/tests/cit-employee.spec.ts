import {test} from '../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test('CIT Test @OGT-46051', async ({page, employeeAppUrl, authPage}) => {
  await page.goto(employeeAppUrl);
  await authPage.loginSuccessful();
});
