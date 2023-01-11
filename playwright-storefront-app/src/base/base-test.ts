import {
  recordsAfterHook,
  test as baseTest,
} from '@opengov/cit-base/build/base/base-test';
import {PublicFormPage} from '../pages/public-form-page';
import {PublicRecordPage} from '../pages/public-record-page';
import {UserHomePage} from '../pages/user-home-page';
import {MyAccountPage} from '../pages/my-account-page';
import {PublicLoginPage} from '../pages/public-login-page';
import {PublicSignupPage} from '../pages/public-signup-page';
import {PublicLocationsPage} from '../pages/public-locations-page';
import {UpdateSubmissionPage} from '../pages/update-submission-page';

export const test = baseTest.extend<{
  //STR Page objects
  storeFrontUserPage: UserHomePage;
  storeFrontRecordPage: PublicRecordPage;
  storeFrontFormPage: PublicFormPage;
  storeFrontLoginPage: PublicLoginPage;
  publicLocationsPage: PublicLocationsPage;
  myAccountPage: MyAccountPage;
  signupPage: PublicSignupPage;
  updateSubmissionPage: UpdateSubmissionPage;
  publicRecordPage: PublicRecordPage;
}>({
  storeFrontUserPage: async ({page}, use) => {
    await use(new UserHomePage(page));
  },
  storeFrontLoginPage: async ({page}, use) => {
    await use(new PublicLoginPage(page));
  },
  storeFrontRecordPage: async ({page}, use) => {
    await use(new PublicRecordPage(page));
    //Records cleanup.
    await recordsAfterHook();
  },
  storeFrontFormPage: async ({page}, use) => {
    await use(new PublicFormPage(page));
  },
  publicLocationsPage: async ({page}, use) => {
    await use(new PublicLocationsPage(page));
  },
  myAccountPage: async ({page}, use) => {
    await use(new MyAccountPage(page));
  },
  signupPage: async ({page}, use) => {
    await use(new PublicSignupPage(page));
  },
  updateSubmissionPage: async ({page}, use) => {
    await use(new UpdateSubmissionPage(page));
  },
  publicRecordPage: async ({page}, use) => {
    await use(new PublicRecordPage(page));
  },
});

export {expect} from '@playwright/test';
