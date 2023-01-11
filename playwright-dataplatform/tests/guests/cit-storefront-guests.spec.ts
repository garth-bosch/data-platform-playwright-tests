import {test} from '../../src/base/base-test';
import {PaymentMethod} from '../../src/pages/public-record-page';
import {
  TestRecordTypes,
  TestSteps,
  TestUsers,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

const guestEmail: string = TestUsers.Guest_User.email;

test.describe('Storefront - Guests Portal Access @guests', () => {
  //TODO Enable after fix of ESN-4673.
  test('Guest has access to the record and can request an inspection and cancel the request @OGT-34353 @broken_test @known_defect @ESN-4673', async ({
    storeFrontRecordPage,
    recordsApi,
    storeFrontLoginPage,
  }) => {
    //Data setup
    const recordStepName = TestSteps.Inspection;
    await test.step(`Record ${recordStepName} setup for guest`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        null,
        [
          {
            fieldName: recordStepName,
            fieldValue: 'true',
          },
        ],
      );
      await recordsApi.addGuestToRecord(guestEmail);
    });

    await test.step(`Login to Storefront and goto Record ${recordStepName}`, async () => {
      await storeFrontLoginPage.loginAndGotoRecordStep(
        guestEmail,
        recordStepName,
      );
    });

    await test.step('Request and cancel inspection', async () => {
      await storeFrontRecordPage.requestInspection();
      await storeFrontRecordPage.validateCancelRequestSection();
      await storeFrontRecordPage.cancelRequest();
      await storeFrontRecordPage.validateRequestInspectionSection();
    });
  });

  test('Guest has access to the record and can perform payment @OGT-34352 @broken_test', async ({
    storeFrontRecordPage,
    recordsApi,
    storeFrontLoginPage,
  }) => {
    const recordStepName = TestSteps.Payment;
    await test.step(`Record ${recordStepName} setup for guest`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        null,
        [
          {
            fieldName: recordStepName,
            fieldValue: 'true',
          },
        ],
      );
      await recordsApi.addGuestToRecord(guestEmail);
    });

    await test.step(`Login to Storefront and goto Record ${recordStepName}`, async () => {
      await storeFrontLoginPage.loginAndGotoRecordStep(
        guestEmail,
        recordStepName,
      );
    });

    await test.step('Complete payment as Guest', async () => {
      await storeFrontRecordPage.completeStorefrontPaymentWith(
        PaymentMethod.Bank,
      );
    });
  });

  test('Verify Guest user can not revoke and add guests @OGT-34348 @broken_test @Xoriant_test', async ({
    storeFrontRecordPage,
    recordsApi,
    storeFrontLoginPage,
    guestsPage,
  }) => {
    const recordStepName = TestSteps.Payment;
    await test.step(`Record ${recordStepName} setup for guest`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        null,
        [
          {
            fieldName: recordStepName,
            fieldValue: 'true',
          },
        ],
      );
      await recordsApi.addGuestToRecord(guestEmail);
    });

    await test.step(`Login to Storefront and goto Record ${recordStepName}`, async () => {
      await storeFrontLoginPage.loginAndGotoRecordStep(
        guestEmail,
        recordStepName,
      );
    });

    await test.step('Navigate to Guests Tab', async () => {
      await storeFrontRecordPage.navigateToRecordTab('Guests');
    });

    await test.step('Verify Revoke Access button is disabled, grant access id hidden', async () => {
      await guestsPage.page.isHidden(
        guestsPage.elements.grantGuestAccessButton,
      );
      await guestsPage.page.isHidden(
        guestsPage.elements.revokeGuestAccessButton.selector(guestEmail),
      );
    });
  });

  test('Applicant can add guests to a record @OGT-34351 @broken_test', async ({
    storeFrontRecordPage,
    storeFrontLoginPage,
    guestsPage,
  }) => {
    await test.step(`Login to Storefront as Citizen`, async () => {
      await storeFrontLoginPage.loginToStorefront();
    });

    await test.step(`Start application for record type`, async () => {
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Ghost_Test.name,
      );
    });

    await test.step(`Skip pages and submit application`, async () => {
      await storeFrontRecordPage.skipAndSubmit();
    });
    await test.step('Add a guest and verify', async () => {
      await storeFrontRecordPage.navigateToRecordTab('Guests');
      await guestsPage.enterGuestEmail(guestEmail);
      await guestsPage.clickGrantAccessButton();
      await guestsPage.validateGuestEmailPresent(guestEmail, true);
    });

    await test.step('Revoke the guest and verify', async () => {
      await guestsPage.clickRevokeAccessButton(guestEmail);
      await guestsPage.clickProveRevokeAccessButton();
      await guestsPage.validateGuestEmailPresent(guestEmail, false);
      await guestsPage.page.reload();
      await guestsPage.page.waitForLoadState();
      await guestsPage.validateGuestEmailPresent(guestEmail, false);
    });
  });

  test(
    'Verify guest access to the record when main applicant removed by employee user' +
      ' @OGT-34341 @broken_test @Xoriant_Test',
    async ({
      storeFrontLoginPage,
      storeFrontRecordPage,
      recordsApi,
      formsPage,
      myAccountPage,
      storeFrontUserPage,
    }) => {
      await test.step('Create a record without applicant', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Record_Steps_Test,
          null,
          null,
          [
            {
              fieldName: 'Inspection',
              fieldValue: 'true',
            },
          ],
        );
      });

      await test.step('Add a guest user', async () => {
        await recordsApi.addGuestToRecord(guestEmail);
      });

      await test.step(`Login as the guest user and open the record`, async () => {
        await storeFrontLoginPage.loginToStorefront(guestEmail);
        await expect(
          storeFrontUserPage.page.locator(
            storeFrontUserPage.elements.organizationLogo,
          ),
        ).toBeVisible();
        await myAccountPage.gotoRecordSubmissionPageById();
      });

      await test.step('Verify the record is accessible for the guest user', async () => {
        // Form field is visible
        await expect(
          formsPage.page.locator(
            formsPage.elements.formFieldElement.selector('Inspection'),
          ),
        ).toBeVisible();

        // Record step is visible
        await storeFrontRecordPage.validateRecordContainsStep('Inspection');
      });
    },
  );

  test("Guests can't see internal step comments @OGT-44857 @broken_test @Xoriant_Test", async ({
    storeFrontLoginPage,
    storeFrontRecordPage,
    recordsApi,
    recordStepsApi,
    commonApi,
    myAccountPage,
    storeFrontUserPage,
  }) => {
    await test.step('Create a record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citAdminEmail,
        null,
        [
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
    });

    await test.step('Add a guest user', async () => {
      await recordsApi.addGuestToRecord(guestEmail);
    });

    await test.step('Add a comment to a workflow step', async () => {
      const recordStep = await recordsApi.getRecordStepByName(
        'Inspection',
        baseConfig.citTempData.recordId,
      );
      const userData = await commonApi.getUserData(
        baseConfig.citTestData.citAdminEmail,
      );
      const commentPayload = {
        userID: userData.id,
        record_StepID: recordStep.id,
        comment: 'The internal note should no be visible for guests',
        isEnabled: false,
        isInternalComment: true,
      };
      await recordStepsApi.addStepComments(commentPayload);
    });

    await test.step(`Login as the guest user and open the record`, async () => {
      await storeFrontLoginPage.loginToStorefront(guestEmail);
      await expect(
        storeFrontUserPage.page.locator(
          storeFrontUserPage.elements.organizationLogo,
        ),
      ).toBeVisible();
      await myAccountPage.gotoRecordSubmissionPageById();
    });

    await test.step('Open the workflow step', async () => {
      await storeFrontRecordPage.clickRecordStepByName('Inspection');
    });

    await test.step('Verify there are no comments visible', async () => {
      await expect(
        storeFrontRecordPage.page.locator(
          storeFrontRecordPage.elements.commentBody,
        ),
      ).toBeHidden();
    });
  });
});
