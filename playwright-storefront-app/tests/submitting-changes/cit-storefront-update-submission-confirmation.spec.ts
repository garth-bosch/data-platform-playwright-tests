import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  NavigationButtons,
  Sections,
} from '../../src/pages/update-submission-page';

const formEntryFields = [
  {
    label: 'short_text',
    value: 'short text field',
    note: 'short_text note',
  },
  {
    label: 'long_text',
    value: 'Long text field',
    note: 'long_text note',
  },
  {
    label: 'N1',
    value: '100',
    note: 'N1 note',
  },
  {
    label: 'date',
    value: '11/11/2020',
    note: 'date note',
  },
  {
    label: 'ssn',
    value: '111-22-3333',
    note: 'ssn note',
  },
  {
    label: 'eid',
    value: '11-2233344',
    note: 'eid note',
  },
];
let recordId;

test.use({storageState: CITIZEN_SESSION});
test.describe('Applicant able to view details of change request and act on it @known_defect @request_changes', () => {
  test.beforeEach(
    async ({
      recordsApi,
      formsAPI,
      page,
      storefrontUrl,
      updateSubmissionPage,
    }) => {
      await test.step('Create a change request', async () => {
        await recordsApi.createRecordWith(
          TestRecordTypes.Request_Changes_Tests,
          baseConfig.citTestData.citCitizenEmail,
        );
        recordId = parseInt(baseConfig.citTempData.recordId);
      });

      await formsAPI.createAChangeRequest(
        recordId,
        {
          formFieldsList: formEntryFields,
        },
        'This is an Overall Note to the applicant',
      );

      await page.goto(storefrontUrl + `/update-submission/${recordId}`);

      await test.step(`Applicant fills form for single-entry section and continue`, async () => {
        await updateSubmissionPage.enterFormFieldValues(
          'Single Entry Section',
          formEntryFields,
        );
        await updateSubmissionPage.clickOnButton(NavigationButtons.Continue);
      });
    },
  );

  test(`Validate Review and Confirm Changes page details @OGT-45770 @broken_test`, async ({
    updateSubmissionPage,
  }) => {
    await test.step(`I see Update Submission page title`, async () => {
      await updateSubmissionPage.validateConfirmSubmissionTitleDisplayed();
    });

    await test.step(`I see Update Submission record header`, async () => {
      await updateSubmissionPage.validateConfirmSubmissionRecordDetailsWithLocation(
        false,
      );
      await updateSubmissionPage.validateConfirmSubmissionInfoDisplayed();
    });

    await test.step(`I see Updated Form Fields sections on Confirm Submission page`, async () => {
      await updateSubmissionPage.validateFormSections(
        Sections.Updated_Form_Fields,
      );
    });

    await test.step(`I see form fields sections in Updated Form Fields on Confirm Submission page`, async () => {
      await updateSubmissionPage.validateFormFieldSections(
        'Single Entry Section',
      );
    });

    await test.step(`I see edit link for every section on Confirm Submission page`, async () => {
      await updateSubmissionPage.validateEditiableSections(
        'Single Entry Section',
      );
    });

    await test.step(`I see 'Back' button`, async () => {
      await updateSubmissionPage.validateButtonIsDisplayed(
        NavigationButtons.Back,
      );
    });

    await test.step(`I see 'Confirm And Submit' button`, async () => {
      await updateSubmissionPage.validateButtonIsDisplayed(
        NavigationButtons.Confirm_And_Submit,
      );
    });
  });

  test('Validate form fields persist values and readonly @OGT-45773 @broken_test', async ({
    updateSubmissionPage,
  }) => {
    await test.step(`Verify previously entered value for the form field is persist`, async () => {
      await updateSubmissionPage.validateFormFieldValues(
        'Single Entry Section',
        formEntryFields,
      );
    });
    await test.step(`Verify previously entered note for the form field is persist`, async () => {
      await updateSubmissionPage.validateFormFieldNotes(
        'Single Entry Section',
        formEntryFields,
      );
    });
  });

  test('Validate Back button navigates to Update submission page @OGT-45804 @broken_test', async ({
    updateSubmissionPage,
  }) => {
    await test.step(`Verify previously entered value for the form field is persist`, async () => {
      await updateSubmissionPage.clickOnButton(NavigationButtons.Back);
      await updateSubmissionPage.validateUpdateSubmissionTitleDisplayed();
      await updateSubmissionPage.validateUpdatedTagDisplayed(
        'Single Entry Section',
        formEntryFields,
      );
    });
  });
});
