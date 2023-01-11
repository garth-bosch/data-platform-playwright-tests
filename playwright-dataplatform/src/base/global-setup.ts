import {chromium, FullConfig} from '@playwright/test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';
import {PublicLoginPage} from '../pages/public-login-page';
import {UserHomePage} from '../pages/user-home-page';

async function globalSetup(config: FullConfig) {
  console.log(config);
  const browser = await chromium.launch({
    headless: config.projects[0].use.headless,
  });
  await Promise.all([
    storeUserSession(
      browser,
      baseConfig.citTestData.citCitizenEmail,
      CITIZEN_SESSION,
    ),
  ]);
  await browser.close();
}

async function storeUserSession(
  browser: any,
  userEmail: string,
  sessionFile: string,
) {
  const loginPage = new PublicLoginPage(await browser.newPage());
  await loginPage.goto();
  await loginPage.selectSecureLoginPortalButton();
  const auth0page = new AuthPage(loginPage.page);
  await auth0page.loginAs(userEmail, baseConfig.citTestData.citAppPassword);
  await auth0page.page.waitForNavigation();
  const userHomePage = new UserHomePage(loginPage.page);
  await userHomePage.validateMyAccountButtonVisibility(true);
  await auth0page.page.context().storageState({path: sessionFile});
}

export default globalSetup;
