import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocation,
  TestRecordTypes,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
const securedFields = {
  SSN: {
    label: 'Social security number',
    value: '111-11-1111',
  },
  EID: {
    label: 'Employee ID',
    value: '12-2323232',
  },
};

test.describe('Storefront - Record submission @records @forms @broken_test', () => {
  test.beforeEach(
    async ({storefrontUrl, storeFrontRecordPage, formsPage, page}) => {
      await page.goto(storefrontUrl);

      await test.step(`Citizen starts a record draft`, async () => {
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.API_INTEGRATION_WORKFLOW_TEST.name,
        );
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.searchAndSelectLocationStorefront(
          TestLocation.Test_Tole.name,
        );
        await storeFrontRecordPage.proceedToNextStep();
      });

      await test.step(`Citizen fills SSN and EID form fields and submits record`, async () => {
        await formsPage.enterFormFieldValue(
          securedFields.SSN.label,
          securedFields.SSN.value,
        );
        await formsPage.enterFormFieldValue(
          securedFields.EID.label,
          securedFields.EID.value,
        );
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.proceedToNextStep();
        await storeFrontRecordPage.proceedToNextStep('submit');
      });
    },
  );

  test('Applicant can reveal SSN and EIN form field from their submitted record details @OGT-43593 @broken_test @OGT-43594 @broken_test', async ({
    storeFrontRecordPage,
    formsPage,
  }) => {
    await test.step(`Citizen reveals SSN and EID fields`, async () => {
      await storeFrontRecordPage.navigateToRecordTab('Your Submission');
      await formsPage.validateShowLink(securedFields.SSN.label, true);
      await formsPage.validateShowLink(securedFields.EID.label, true);
      await formsPage.validateSsnOrEinFormField(
        securedFields.SSN.label,
        securedFields.SSN.value,
      );
      await formsPage.validateSsnOrEinFormField(
        securedFields.EID.label,
        securedFields.EID.value,
      );
    });
  });

  test('Guest cannot reveal SSN and EIN form field from their submitted record details @OGT-43595 @broken_test @OGT-43596 @broken_test', async ({
    storeFrontRecordPage,
    storeFrontUserPage,
    storeFrontLoginPage,
    authPage,
    formsPage,
    guestsPage,
  }) => {
    await test.step(`Save record, and add guest to the record`, async () => {
      await storeFrontRecordPage.saveRecordName();
      await storeFrontRecordPage.navigateToRecordTab('Guests');
      await guestsPage.enterGuestEmail(TestUsers.Test_User.email);
      await guestsPage.clickGrantAccessButton();
    });

    await test.step(`Open the record as guest`, async () => {
      await storeFrontUserPage.logout();
      await storeFrontLoginPage.clickLoginLink();
      await storeFrontLoginPage.selectSecureLoginPortalButton();
      await authPage.loginAs(TestUsers.Test_User.email);
      await storeFrontRecordPage.proceedToRecordInStorefrontByUrl();
    });

    await test.step(`Guest cannot reveal secure fields`, async () => {
      await formsPage.validateShowLink(securedFields.SSN.label, false);
      await formsPage.validateShowLink(securedFields.EID.label, false);
    });
  });
});
