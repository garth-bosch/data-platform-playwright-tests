import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {FooterButton, Pages} from '../../src/pages/request-change-page';

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
test.describe('Employee App - Requesting Change - Select Form Fields', () => {
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });

  test(`'Select Form Fields' and 'Select Attachment' page have 'Next' button @OGT-44585 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I am on 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I see 'Next' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(FooterButton.Next);
    });

    await test.step(`I am on 'Select Attachment' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Attachments,
      );
    });

    await test.step(`I see 'Next' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(FooterButton.Next);
    });

    await test.step(`I am on 'Confirm Request' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I see 'Cancel and Return to [Record Number]' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(
        FooterButton.Cancel_And_Return,
      );
    });
  });

  test(`'Confirm and Request Changes' button display on 'Confirm Request' page @OGT-44587 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I am on 'Confirm Request' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I see 'Confirm and Request Changes' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(
        FooterButton.Confirm_And_Request_Changes,
      );
    });
  });

  test(`Validate 'Back' button functionality @OGT-44588 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I am on 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I am on 'Select Attachment' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Attachments,
      );
    });

    await test.step(`I am on 'Confirm Request' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`Clicking 'Back' button on 'Confirm Request' page navigate to 'Select Attachment' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Attachments,
      );
    });

    await test.step(`Clicking 'Back' button on 'Select Attachment' page navigate to 'Select Form Fields' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });
  });

  test(`Validate 'Select Form Fields' display all of the form fields @OGT-44584 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
    createRecordPage,
  }) => {
    await test.step(`I add multi entry form section`, async () => {
      await createRecordPage.openNewMultiEntrySection('Multi-Entry Section');
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step(`I navigate to 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I validate single entry form section shows all form fields`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.validateFormFieldDisplay(
          'Single Entry Section',
          lisOfFormFields[key],
        );
      }
    });

    await test.step(`I validate multi-entry form section shows all form fields`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.validateFormFieldDisplay(
          'Multi-Entry Section',
          lisOfFormFields[key],
        );
      }
    });

    await test.step(`I validate each form field has checkbox and note section`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.checkTheFormField(
          'Single Entry Section',
          lisOfFormFields[key],
        );
        await requestChanges.validateCheckBoxAndNoteDisplay(
          'Single Entry Section',
          lisOfFormFields[key],
        );
      }
      for (const key in lisOfFormFields) {
        await requestChanges.checkTheFormField(
          'Multi-Entry Section',
          lisOfFormFields[key],
        );
        await requestChanges.validateCheckBoxAndNoteDisplay(
          'Multi-Entry Section',
          lisOfFormFields[key],
        );
      }
    });

    await test.step(`I see number of selected form fields`, async () => {
      await requestChanges.validateNumberOfSelectedFormFields(
        (Object.keys(lisOfFormFields).length * 2).toString(),
      );
    });
  });

  test(`Validate cancel request change warning dialogue @OGT-44761 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I see a cancel request change warning dialogue`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.clickOnCancelRequestChange();
    });

    await test.step(`I close the warning dialogue and continue a request change`, async () => {
      await requestChanges.clickOnKeepRequest();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I cancel the request change and return to record details page`, async () => {
      await requestChanges.clickOnCancelRequestChange();
      await requestChanges.cancelRequest();
      await internalRecordPage.validateRecordDetailsTabsVisibility();
    });
  });

  test(`Validate selected form fields and form field notes should persist on 'Select Form Field' Page
  @OGT-44586 @request_changes`, async ({
    createRecordPage,
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I add multi entry form section`, async () => {
      await createRecordPage.openNewMultiEntrySection('Multi-Entry Section');
      await createRecordPage.saveMultiEntrySection();
    });

    await test.step(`I navigate to 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I select a form field and add note `, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.selectAndAddNoteToFormField(
          'Single Entry Section',
          lisOfFormFields[key],
          'This note is optional',
        );
      }
      for (const key in lisOfFormFields) {
        await requestChanges.selectAndAddNoteToFormField(
          'Multi-Entry Section',
          lisOfFormFields[key],
          'This note is optional',
        );
      }
    });

    await test.step(`I navigate back to 'Select Form Fields page' from 'Select Attachement' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Attachments,
      );
      await requestChanges.clickOnButton(FooterButton.Back);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I see previously saved form field data persit`, async () => {
      for (const key in lisOfFormFields) {
        await requestChanges.validateSelectedFormFieldSaved(
          'Single Entry Section',
          lisOfFormFields[key],
          'This note is optional',
        );
      }
      for (const key in lisOfFormFields) {
        await requestChanges.validateSelectedFormFieldSaved(
          'Multi-Entry Section',
          lisOfFormFields[key],
          'This note is optional',
        );
      }
    });
  });

  test(`All pages should have 'Cancel and Return to [Record Number]' buttons @OGT-44589 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I am on 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I see 'Cancel and Return to [Record Number]' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(
        FooterButton.Cancel_And_Return,
      );
    });

    await test.step(`I am on 'Select Attachment' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Attachments,
      );
    });

    await test.step(`I see 'Cancel and Return to [Record Number]' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(
        FooterButton.Cancel_And_Return,
      );
    });

    await test.step(`I am on 'Confirm Request' page`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I see 'Cancel and Return to [Record Number]' button`, async () => {
      await requestChanges.validateButtonIsDisplayed(
        FooterButton.Cancel_And_Return,
      );
    });
  });

  test(`Validate 'Note to Applicant' show the previously entered note when corresponding form field checkbox uncheck and check @OGT-46399 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I navigate to 'Select Form Fields' page`, async () => {
      await internalRecordPage.clickOnRequestChange();
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Select_Form_Fields,
      );
    });

    await test.step(`I select the form field and add note `, async () => {
      await requestChanges.selectAndAddNoteToFormField(
        'Single Entry Section',
        lisOfFormFields.Date,
        'This note is optional',
      );
    });

    await test.step(`I uncheck and check the form field`, async () => {
      await requestChanges.checkTheFormField(
        'Single Entry Section',
        lisOfFormFields.Date,
      );
    });

    await test.step(`I see previously entered note for the form field`, async () => {
      await requestChanges.validateSelectedFormFieldSaved(
        'Single Entry Section',
        lisOfFormFields.Date,
        'This note is optional',
      );
    });
  });
});
