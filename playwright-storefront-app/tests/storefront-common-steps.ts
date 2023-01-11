import {test} from '../src/base/base-test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PublicRecordPage} from '../src/pages/public-record-page';
import {PublicLoginPage} from '../src/pages/public-login-page';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';
import {MyAccountPage} from '../src/pages/my-account-page';

/**
 * @deprecated
 * Prefer abstraction in POM instead of test layer.
 */
export const gotoRecordStep = (
  storeFrontLoginPage: PublicLoginPage,
  authPage: AuthPage,
  myAccountPage: MyAccountPage,
  storeFrontRecordPage: PublicRecordPage,
  recordStepName: string,
  guestEmail: string,
) =>
  test.step(`Login to Storefront and goto Record ${recordStepName}`, async () => {
    await storeFrontLoginPage.goto();
    await storeFrontLoginPage.selectSecureLoginPortalButton();
    await authPage.loginAs(guestEmail, baseConfig.citTestData.citAppPassword);
    await myAccountPage.proceedToMyAccount();
    await myAccountPage.proceedToApplications();
    await myAccountPage.proceedToRecordByName();
    await storeFrontRecordPage.navigateToRecordTab(recordStepName);
  });
