import {test} from '../src/base/base-test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test('CIT Test', async ({page, storefrontUrl, storeFrontUserPage}) => {
  await page.goto(storefrontUrl);
  await storeFrontUserPage.validateMyAccountButtonVisibility(true);
});
