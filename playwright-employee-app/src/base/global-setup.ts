import {chromium, FullConfig} from '@playwright/test';
import {
  ADMIN_SESSION,
  EMPLOYEE_SESSION,
  SUPER_USER_SESSION,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';

async function globalSetup(config: FullConfig) {
  console.log(config);
  const browser = await chromium.launch({
    headless: config.projects[0].use.headless,
  });
  await Promise.all([
    storeUserSession(
      browser,
      baseConfig.citTestData.citAdminEmail,
      ADMIN_SESSION,
      true,
    ),
    storeUserSession(
      browser,
      baseConfig.citTestData.citEmployeeEmail,
      EMPLOYEE_SESSION,
    ),
    storeUserSession(
      browser,
      baseConfig.citTestData.citSuperUserEmail,
      SUPER_USER_SESSION,
      true,
    ),
  ]);
  await browser.close();
}

async function storeUserSession(
  browser: any,
  userEmail: string,
  sessionFile: string,
  adminSession = false,
) {
  const employeePage = new AuthPage(await browser.newPage());
  await employeePage.goto();
  await employeePage.loginAs(userEmail, baseConfig.citTestData.citAppPassword);
  await employeePage.page.waitForNavigation();
  await employeePage.loginSuccessful(adminSession);
  await employeePage.page.context().storageState({path: sessionFile});
}

export default globalSetup;
