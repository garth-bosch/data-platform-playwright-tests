import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {FooterButton, Pages} from '../../src/pages/request-change-page';

const listOfAttachmentContainer = ['ID', 'Address'];
const lisOfFormFields = {
  'Short Text Entry': 'short_text',
  'Long Text Entry': 'long_text',
  Number: 'N1',
  'Calculated Field': 'calc_field',
  Checkbox: 'checkbox',
  'Drop-down': 'dropDown',
  Date: 'date',
  'Social Security Number': 'ssn',
  'Employer ID Number': 'eid',
  'File Upload': 'fileUpload',
  Signature: 'sign',
};

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Requesting Change - Confirm Request', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickOnRequestChange();
    });
  });

  test(`Validate trash wrapper display for all selected form fields and selected attachments @OGT-46022 @request_changes @confirm_request`, async ({
    requestChanges,
  }) => {
    await test.step(`I select a all form field and add note from 'Select Form Fields' page`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.selectAndAddNoteToFormField(
          'Single Entry Section',
          lisOfFormFields[key],
          'This note is optional',
        );
      }
    });

    await test.step(`I select all attachment including empty and add a note to it on 'Select Attachment' page `, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      for (const attachmentContianerName of listOfAttachmentContainer) {
        await requestChanges.selectAndAddNoteToAttachment(
          attachmentContianerName,
          'Test',
        );
      }
    });

    await test.step(`I go to 'Confirm Request' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I validate form field has trash icon and note`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.validateFormFieldHasTrashIconAndNote(
          lisOfFormFields[key],
        );
      }
    });

    await test.step(`I validate attachment has trash icon and note`, async () => {
      for (const name of listOfAttachmentContainer) {
        await requestChanges.validateAttachmentHasTrashIconAndNote(name);
      }
    });
  });

  test(`Validate deleted form field disappears from the confirmation page and is unchecked on 'Select form field' page @OGT-46021
    @request_changes @confirm_request`, async ({requestChanges}) => {
    await test.step(`I delete the selected form field from 'Confirm Request page`, async () => {
      await requestChanges.selectAndAddNoteToFormField(
        'Single Entry Section',
        lisOfFormFields.Checkbox,
      );
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.removeFormFieldFromConfirmationPage(
        lisOfFormFields.Checkbox,
      );
    });

    await test.step(`I see the form field unchecked on 'Select form field' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.isFormFieldSelected(
        'Single Entry Section',
        lisOfFormFields.Checkbox,
      );
    });
  });

  test(`Validate overall note on the 'Confirm Request' page @OGT-44583
    @request_changes @confirm_request`, async ({requestChanges}) => {
    await test.step(`I go to 'Confirm Request' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I see the 'Overall note to Applicant' section`, async () => {
      await requestChanges.validateOverallNoteToApplicantSectionDisplay();
    });

    await test.step(`I can add a note into 'Overall note to Applicant' section`, async () => {
      await requestChanges.addOverallNoteToApplicant(
        'This is notes'.repeat(200),
      );
    });

    await test.step(`I see overall note accepts only 2500 character`, async () => {
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validateOverallNoteToApplicantLimitsTo2500Character(
        2500,
      );
    });
  });

  test(`Validate remove form field warning dialog can be closed without removing the form field @OGT-44791
    @request_changes @confirm_request`, async ({requestChanges}) => {
    const formField = lisOfFormFields.Checkbox;
    await test.step(`I am on the confirmation page of requesting changes`, async () => {
      await requestChanges.selectAndAddNoteToFormField(
        'Single Entry Section',
        lisOfFormFields.Checkbox,
      );
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.clickOnButton(FooterButton.Next);
    });

    await test.step(`I open and cancel remove Field warning dialog`, async () => {
      await requestChanges.clickOnTrashIcon(formField);
      await requestChanges.cancelRemoveFormFieldWarning();
    });

    await test.step(`I can still see the selected form field`, async () => {
      await requestChanges.isSelectedFormFieldDisplayOnConfirmationPage(
        formField,
        true,
      );
    });

    await test.step(`I open and close remove Field warning dialog`, async () => {
      await requestChanges.clickOnTrashIcon(formField);
      await requestChanges.closeRemoveFormFieldWarning();
    });

    await test.step(`I can still see the selected form field`, async () => {
      await requestChanges.isSelectedFormFieldDisplayOnConfirmationPage(
        formField,
        true,
      );
    });
  });
});
