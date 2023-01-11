import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  LocationSection,
  TestLocation,
  TestRecordTypes,
  TestSteps,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '@playwright/test';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Records @records', () => {
  test('Citizen can submit a record through Storefront @OGT-34312 @smoke @broken_test', async ({
    storeFrontRecordPage,
    storeFrontUserPage,
    storefrontUrl,
    formsPage,
    page,
  }) => {
    await test.step(`Start application draft`, async () => {
      await page.goto(storefrontUrl);
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Ghost_Test.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Toggle checkbox form field`, async () => {
      await formsPage.toggleCheckboxFormField('Checkbox');
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Verify attachment buckets are conditionally shown', async () => {
      await storeFrontRecordPage.validateAttachmentBucketPresence(
        'If Checkbox == True',
        true,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Confirm submission details and submit record', async () => {
      await storeFrontRecordPage.validateSubmissionConfirmationPage();
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step('Verify record steps after submission', async () => {
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Approval);
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Payment);
      await storeFrontRecordPage.validateRecordContainsStep(
        TestSteps.Inspection,
      );
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Document);
    });

    await test.step('Verify record step status', async () => {
      await storeFrontRecordPage.validateRecordStepStatus(
        TestSteps.Approval,
        'In progress',
      );
    });
  });

  test('Citizen can submit a record through Storefront with parallel steps @OGT-34317 @broken_test', async ({
    storeFrontRecordPage,
    myAccountPage,
    recordsApi,
  }) => {
    //Data setup
    await test.step(`Record setup`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Parallel,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
    });

    await test.step('Load submitted record in Storefront', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
    });

    await test.step('Verify record contains record steps', async () => {
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Payment);
      await storeFrontRecordPage.validateRecordContainsStep(
        TestSteps.Inspection,
      );
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Approval);
    });

    await test.step('Verify record statuses', async () => {
      await storeFrontRecordPage.validateRecordStepStatus(
        TestSteps.Approval,
        'In progress',
      );
      await storeFrontRecordPage.validateRecordStepStatus(
        TestSteps.Payment,
        'Due Now',
      );
      await storeFrontRecordPage.validateRecordStepStatus(
        TestSteps.Inspection,
        'In progress',
      );
      await storeFrontRecordPage.validateRecordStepStatus(
        TestSteps.Document,
        'Issued',
      );
    });
  });

  test(
    'Verify created point location can be searched and attached to a record by a citizen' +
      ' @OGT-34322 @broken_test @Xoriant_test',
    async ({storeFrontRecordPage, storeFrontUserPage, storefrontUrl, page}) => {
      await test.step(`Start a record draft`, async () => {
        await page.goto(storefrontUrl);
        await storeFrontUserPage.validateMyAccountButtonVisibility(true);
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.Additional_Location_Test.name,
        );
      });

      await test.step(`Proceed to the next step`, async () => {
        await storeFrontRecordPage.proceedToNextStep();
      });

      await test.step(`Search and select an existing Point Location`, async () => {
        await storeFrontRecordPage.searchAndSelectPointLocation(
          TestLocation.Test_Point_Location_01.name,
          LocationSection.PRIMARY,
        );
      });

      await test.step('Verify the Point location has been added', async () => {
        await storeFrontRecordPage.verifyLocationIsDisplayed(
          TestLocation.Test_Point_Location_01.name,
          LocationSection.PRIMARY,
        );
      });
    },
  );

  test('Citizen can print the document through Storefront. @OGT-34329 @broken_test', async ({
    storeFrontRecordPage,
    myAccountPage,
    recordsApi,
    page,
    storeFrontFormPage,
  }) => {
    //Data setup
    await test.step(`Record setup`, async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Parallel,
        baseConfig.citTestData.citCitizenEmail,
        null,
        [
          {
            fieldName: 'Payment',
            fieldValue: 'true',
          },
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
          {
            fieldName: 'Document',
            fieldValue: 'true',
          },
          {
            fieldName: 'Inspection',
            fieldValue: 'true',
          },
        ],
      );
    });

    await test.step('Load submitted record in Storefront', async () => {
      await myAccountPage.gotoRecordSubmissionPageById();
    });

    await test.step('Verify record contains record steps and click on Document', async () => {
      await storeFrontRecordPage.validateRecordContainsStep(TestSteps.Document);
      await storeFrontRecordPage.clickOnRecordStepName(TestSteps.Document);
    });

    await test.step('Verify Print ability', async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.on('dialog', (dialog) => dialog),
        page.on('popup', (dialog) => dialog),
        await storeFrontFormPage.clickOnPrintDocument(),
      ]);
      // const aa = await newPage.context().waitForEvent('page');
      const textValueOfPrint = (
        await newPage.locator('#printwindow').allInnerTexts()
      )[0].replace('\n', ' ');
      await newPage.waitForLoadState();
      await expect(textValueOfPrint).toContain(
        baseConfig.citTempData.recordTypeName,
      );
    });
  });
});
