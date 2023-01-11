import {expect, test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {Pages} from '../../src/pages/request-change-page';

test.describe('Admin Login - Record page- Request Change button @request_changes', () => {
  test.use({storageState: ADMIN_SESSION});

  test(`Records with applicants have access to Request change button @OGT-43557`, async ({
    internalRecordPage,
    recordsApi,
    baseConfig,
  }) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
    });

    await test.step('I am on the record details', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });

    await test.step(`I see Request Changes button`, async () => {
      await internalRecordPage.verifyRequestChangesButtonDisplayed(true);
    });
  });

  test(`Clicking on the ‘Request Changes’ button should open the requesting changes flow @OGT-43560`, async ({
    requestChanges,
    internalRecordPage,
    recordsApi,
    baseConfig,
  }) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
    });

    await test.step('I am on the record details', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });

    await test.step(`I see Request Changes button`, async () => {
      await internalRecordPage.verifyRequestChangesButtonDisplayed(true);
    });

    await test.step(`I start the Request Change`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });
  });

  test(`Records w/o applicants should not not be able to proceed with request changes @OGT-43573`, async ({
    internalRecordPage,
    recordsApi,
  }) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(TestRecordTypes.Request_Changes_Tests);
    });

    await test.step('I am on the record details', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });

    await test.step(`I see Request Changes button`, async () => {
      await internalRecordPage.verifyRequestChangesButtonDisplayed(true);
    });

    await test.step(`I start the Request Change`, async () => {
      await internalRecordPage.clickOnRequestChange();
    });

    await test.step(`I see a warning modal informing users to add apllicant before requesting changes `, async () => {
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.inactivePopUpMessage,
        ),
      ).toBeVisible();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.noApplicantModalHeading,
        ),
      ).toBeVisible();
      await expect(
        internalRecordPage.page.locator(
          internalRecordPage.elements.noApplicantModalContent,
        ),
      ).toBeVisible();
    });
  });
});

test.describe('Employee Login - Record page - Request Change button @request_changes', () => {
  test.use({storageState: EMPLOYEE_SESSION});

  test(`An employee with "Can Edit" permission have access to the Request Changes button @OGT-43558`, async ({
    createRecordPage,
    internalRecordPage,
    navigationBarPage,
    selectRecordTypePage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step(`Start a record draft from record type [${TestRecordTypes.Employee_CanEdit_RT}] in department [Test Department]`, async () => {
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(
        TestRecordTypes.Employee_CanEdit_RT,
      );
    });

    await test.step('Save record', async () => {
      const recordNumber = await createRecordPage.saveRecord();
      expect(recordNumber).not.toBeUndefined();
    });

    await test.step(`I see Request Changes button`, async () => {
      await internalRecordPage.verifyRequestChangesButtonDisplayed(true);
    });
  });

  test(`An employee with "Can Admin" permission have access to the Request Changes button @OGT-43575`, async ({
    internalRecordPage,
    createRecordPage,
    navigationBarPage,
    selectRecordTypePage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step(`Start a record draft from record type [${TestRecordTypes.Employee_CanAdminister_RT}] in department [Test Department]`, async () => {
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(
        TestRecordTypes.Employee_CanAdminister_RT,
      );
    });

    await test.step('Save record', async () => {
      const recordNumber = await createRecordPage.saveRecord();
      expect(recordNumber).not.toBeUndefined();
    });

    await test.step(`I see Request Changes button`, async () => {
      await internalRecordPage.verifyRequestChangesButtonDisplayed(true);
    });
  });

  test(`An employee with "Can View" permission do not have access to the Request Changes button @OGT-43559`, async ({
    internalRecordPage,
    createRecordPage,
    navigationBarPage,
    selectRecordTypePage,
    page,
    employeeAppUrl,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Goto create record page', async () => {
      await navigationBarPage.clickCreateRecordButton();
    });

    await test.step(`Start a record draft from record type [${TestRecordTypes.Employee_CanView_RT}] in department [Test Department]`, async () => {
      await navigationBarPage.validateOpenGovLogoVisibility(true);
      await navigationBarPage.clickCreateRecordButton();
      await selectRecordTypePage.selectRecordType(
        TestRecordTypes.Employee_CanView_RT,
      );
    });

    await test.step('Create and add a new applicant', async () => {
      await createRecordPage.searchAndSelectApplicant(
        'API Employee',
        'api_employee@opengov.com',
      );

      await test.step('Save record', async () => {
        const recordNumber = await createRecordPage.saveRecord();
        expect(recordNumber).not.toBeUndefined();
      });

      await test.step(`I don't see the Request Changes button`, async () => {
        await internalRecordPage.verifyRequestChangesButtonDisplayed(false);
      });
    });
  });
});
