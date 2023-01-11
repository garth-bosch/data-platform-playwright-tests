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
    note: 'short_text',
  },
  {
    label: 'long_text',
    value: 'Long text field',
    note: 'long_text',
  },
  {
    label: 'N1',
    value: '100',
    note: 'N1',
  },
  {
    label: 'date',
    value: '11/11/2020',
    note: 'date',
  },
  {
    label: 'ssn',
    value: '111-22-3333',
    note: 'ssn',
  },
  {
    label: 'eid',
    value: '11-2233344',
    note: 'eid',
  },
];
let recordId: number;
test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Validate Update submission page @known_defect @request_changes', () => {
  test.beforeEach(async ({recordsApi, formsAPI, page, storefrontUrl}) => {
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
  });

  test(`Validate Update Submission page details @OGT-45750 @broken_test`, async ({
    updateSubmissionPage,
    storeFrontRecordPage,
  }) => {
    await test.step(`I see Update Submission page title`, async () => {
      await updateSubmissionPage.validateUpdateSubmissionTitleDisplayed();
    });

    await test.step(`I see Update Submission record header`, async () => {
      await updateSubmissionPage.validateUpdateSubmissionInfoTextDisplayed();
    });

    await test.step(`I see Request from Reviewer banner on Update Submission page`, async () => {
      await updateSubmissionPage.validateReviewerBannerDisplayed();
    });

    await test.step(`I see Form sections on Update Submission page`, async () => {
      await updateSubmissionPage.validateFormSections(
        Sections.Single_Entry_Section,
      );
      await updateSubmissionPage.validateFormSections(Sections.Attachments);
    });

    await test.step(`I see 'Continue' button`, async () => {
      await updateSubmissionPage.validateButtonIsDisplayed(
        NavigationButtons.Continue,
      );
    });

    await test.step(`I see 'Cancel' button`, async () => {
      await updateSubmissionPage.validateButtonIsDisplayed(
        NavigationButtons.Cancel,
      );
    });

    await test.step(`Original submission page links naviages to submission page`, async () => {
      await updateSubmissionPage.clickOnOriginalSubmissionPage();
      await storeFrontRecordPage.validateUpdateSubmissionBannerVisibility(true);
    });
  });

  test('Validate Review banner details @OGT-45751 @broken_test', async ({
    updateSubmissionPage,
  }) => {
    await test.step(`I see Request from Reviewer banner on Update Submission page`, async () => {
      await updateSubmissionPage.validateReviewerBannerDisplayed();
    });

    await test.step(`I see Overall note`, async () => {
      await updateSubmissionPage.validateDefaultOverallNote(false);
    });

    await test.step(`Validate accordian is collapsed by default`, async () => {
      await updateSubmissionPage.verifyReviewerBannerSubHeadingPresent();
      await updateSubmissionPage.validateAccordionIsCollapsed(true);
    });

    await test.step(`Validate accordian can be expanded and collapsed`, async () => {
      await updateSubmissionPage.clickAccordian();
      await updateSubmissionPage.validateAccordionIsCollapsed(false);
      await updateSubmissionPage.clickAccordian();
      await updateSubmissionPage.validateAccordionIsCollapsed(true);
    });

    await test.step(`Validate number of form fields in the accordian`, async () => {
      await updateSubmissionPage.clickAccordian();
      await updateSubmissionPage.validateNumberOfSelectedFormFields(
        formEntryFields,
      );
    });
  });

  test('Validate anchor links navigates to form fields @OGT-46543 @broken_test', async ({
    updateSubmissionPage,
  }) => {
    await test.step(`Validate anchor links navigates to the Single form field`, async () => {
      await updateSubmissionPage.page.click(
        updateSubmissionPage.elements.accordionTitle,
      );
      for (const key in formEntryFields) {
        await updateSubmissionPage.validateSingleFormFieldInViewPort(
          formEntryFields[key],
        );
      }
    });
  });

  test('Validate selected form fields are highlighted @OGT-45753 @broken_test', async ({
    updateSubmissionPage,
  }) => {
    await test.step(`Validate selected form fields are highlighted`, async () => {
      await updateSubmissionPage.validateSelectedFormFieldHighlighted();
    });

    await test.step(`Validate Note from Reviewer and note displayed for form fields`, async () => {
      for (const key in formEntryFields) {
        await updateSubmissionPage.validateAddedNoteDisplayedForFormField(
          'Single Entry Section',
          formEntryFields[key],
        );
      }
    });
    await test.step(`Validate data fills form for single-entry section`, async () => {
      await updateSubmissionPage.enterFormFieldValues(
        'Single Entry Section',
        formEntryFields,
      );
    });

    await test.step(`Verify entered data on form fields persist`, async () => {
      await updateSubmissionPage.formFieldsDataExists(
        'Single Entry Section',
        formEntryFields,
      );
    });

    await test.step('Validate updating the selected form fields', async () => {
      await updateSubmissionPage.validateUpdatedTagDisplayed(
        'Single Entry Section',
        formEntryFields,
      );
    });

    await test.step('Validate number of updated form fields', async () => {
      await updateSubmissionPage.validateNumberOfUpdatedFormFields(
        formEntryFields,
      );
    });
  });
});
