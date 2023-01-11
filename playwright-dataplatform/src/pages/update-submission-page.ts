import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../base/base-test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {Locator} from '@playwright/test';

export enum NavigationButtons {
  Continue = 'Continue',
  Cancel = 'Cancel',
  Back = 'Back',
  Confirm_And_Submit = 'Confirm and Submit',
}
export enum Sections {
  Single_Entry_Section = 'Single Entry Section',
  Multi_Entry_Section = 'Multi-Entry Section',
  Attachments = 'Attachments',
  Updated_Form_Fields = 'Updated Form Fields',
  Updated_Attachments = 'Updated Attachments',
}

export const submissionConstants = {
  updateSubmissionHeading: 'Update',
  updateSubmissionInfoText:
    'These changes must be submitted all at once, so please be prepared to complete this in one sitting. If you want to make changes later, you can return from the link in your email or the original submission page.',
  cancelDialogTitle: 'Are you sure you want to leave?',
  cancelDialogInfoText1:
    "Any changes you've made to the application will not be saved if you leave.",
  cancelDialogInfoText2:
    'You can return and start again from the link in your email or the original submission page.',
  overallNote: 'This is an Overall Note to the applicant',
  defaultOverallNote:
    'A reviewer has requested that you make changes to the highlighted fields. Please make these changes in order to proceed with your submission.',
  reviewerBannerSubHeading: 'Please provide updates to the following fields.',
  errorText: 'Please update this information.',
  ssnErrorText: 'Please enter a 9-digit Social Security Number (SSN).',
  signErrorText: 'Please enter your full legal name.',
  confirmPgaeHeading: 'Review and Confirm Changes to',
  confirmPageInfo: 'Please review your changes before submitting.',
};

type FormField = {
  label: string;
  value?: string;
  note?: string;
};

export class UpdateSubmissionPage extends BaseCitPage {
  readonly elements = {
    updateSubmissionTitle: '[data-testid="submit-changes-header"]',
    updateSubmissionRecord:
      '//*[@data-testid="submit-changes-header"]/following-sibling::span[1]',
    updateSubmissionInfoText:
      '//*[@data-testid="submit-changes-header"]/following-sibling::span[2]',
    originalSubmissionPage:
      '//*[@data-testid="submit-changes-header"]/following-sibling::span[2]/a',
    reviewerBannerTitle: `//*[text()='Request from Reviewer']`,
    singleEntrySectionHeading: '[data-testid="single-section"]',
    multiEntrySectionHeading: '[data-testid="multi-section"]',
    attachmentsHeading: `//*[starts-with(@class,'header')][text()='Attachments']`,
    overallNote: `//*[text()='Request from Reviewer']//following-sibling::span`,
    accordionTitle: '[data-test="accordion-title"]',
    accordionCollapsed: 'div[class^=nodeHeader][aria-pressed=false]',
    accordionExpanded: 'div[class^=nodeHeader][aria-pressed=true]',
    cancelButton: '[data-testid="submit-cancel-button"]',
    continueButton: '[data-testid="submit-continue-button"]',
    cancelDialog: '[data-testid="dialog-warning-container"]',
    cancelDialogTitle: '#dialogTitle',
    cancelDialogInfoText: 'div[class^="dialogContent_"] p:nth-child(1)',
    cancelDialogInfoText2: 'div[class^="dialogContent_"] p:nth-child(2)',
    leaveButton: '[data-testid="cancel-request"]',
    keepWorkingButton: '[data-testid="no-cancel"]',
    cancelDialogCloseIcon: '[data-test="dialog-warning-close-button"]',
    formFieldSingleLink: {
      selector: (formField: string) =>
        `(//*[@data-test="accordion-body"]//button[contains(.,'${formField}')])[1]`,
    },
    formFieldMultiLink: {
      selector: (formField: string) =>
        `(//*[@data-test="accordion-body"]//button[contains(.,'${formField}')])[2]`,
    },
    formFieldView: {
      selector: (section: string, formField: string) =>
        `(//*[text()="${section}"]//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${formField}'])[1]`,
    },
    formFieldInput: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::input)[1]`,
    },
    formFieldInputValue: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::input)[1]`,
    },
    checkBoxField: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::input)[1]`,
    },
    formFieldsUpdated: '[data-testid="updated-wrapper"]',
    listOfFormFieldsLink: '[data-test="accordion-body"] > li',
    formFieldsHighlight: '[data-testid="needsUpdate-wrapper"]',
    formFieldsNonHighlight: '[data-testid="read-only-field"]',
    reviewerBannerSubHeading: 'h5[class^="header"]',
    noteFromReviewerLabel: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::label[text()="Note from Reviewer"])[1]`,
    },
    noteFromReviewer: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']/following::label[text()="Note from Reviewer"]/following::span)[1]`,
    },
    errorBanner: '#error-banner div[class*="variantError"]',
    errorSubHeading: '#error-banner span[class^="bannerHeader"]',
    listOfErrorFormFieldsLink: '#error-banner li',
    errorFormFieldSingleLink: {
      selector: (formField: string) =>
        `(//div[@id="error-banner"]//button[contains(.,"${formField}")])[1]`,
    },
    errorFormFieldMultiLink: {
      selector: (formField: string) =>
        `(//div[@id="error-banner"]//button[contains(.,"${formField}")])[2]`,
    },
    errorFormFieldView: {
      selector: (section: string, formField: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="error-wrapper"]//label[text()='${formField}'])[1]`,
    },
    errorFormFieldsHighlight: '[data-testid="error-wrapper"]',
    errorNoteFromReviewer: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']/following::div[@data-testid="error-wrapper"]//label[text()='${field}']/following::label[text()="Note from Reviewer"])[1]`,
    },
    errorText: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::label[text()='${field}']//ancestor::*[@data-testid="error-wrapper"]/following::div[@data-testid="error-message"])[1]`,
    },
    errorSign: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::label[text()='${field}']//ancestor::*[@data-testid="error-wrapper"]/following::div[@data-testid="error-message"]/*[@aria-label="Error"])[1]`,
    },
    updatedTag: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="updated-wrapper"]//label[text()='${field}']//following::label[text()='Updated'])[1]`,
    },
    dropdownField: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::button[text()='Select'])[1]`,
    },
    dropdownOption: {
      selector: (section: string, field: string) =>
        `(//*[text()='${section}']//following::div[@data-testid="needsUpdate-wrapper"]//label[text()='${field}']//following::input)[1]`,
    },
    confirmPageTitle: 'h2[class *="header"]',
    confirmPageRecordType:
      '//h2[starts-with(@class,"header")]/following-sibling::div/p[1]',
    confirmPageRecordAddress:
      '//h2[starts-with(@class,"header")]/following-sibling::div/p[2]',
    confirmPageInfo: '//h2[starts-with(@class,"header")]/following-sibling::p',
    updatedFormFieldsHeading: '//*[text()="Updated Form Fields"]',
    updatedAttachmentsHeading: '//*[text()="Updated Attachments"]',
    formFieldsSectionLabel: {
      selector: (section: string) =>
        `//*[text()="Updated Form Fields"]/following::div[text()="${section}"]`,
    },
    editSection: {
      selector: (section: string) =>
        `(//*[text()="${section}"]//following::*[@aria-label="Edit"])[1]`,
    },
    editMultiEntryAnswers: {
      selector: (section: string, position: string) =>
        `(//*[text()="${section}"]/following::*[contains(.,"Answer")][2]/following::*[@aria-label="Edit"])[${position}]`,
    },
    formFieldValue: {
      selector: (section: string, field: string) =>
        `(//*[text()="${section}"]/following::*[text()="${field}"]/following-sibling::*[contains(@data-testid,"read-only-")])[1]`,
    },
    formFieldNote: {
      selector: (section: string, field: string) =>
        `(//*[text()="${section}"]/following::*[text()="${field}"]/following::*[text()="Note from Reviewer"]/following::p)[1]`,
    },
    backButton: '//button[contains(.,"Back")]',
    submitButton: '//*[text()="Confirm and Submit"]',
  };

  async validateUpdateSubmissionTitleDisplayed() {
    await expect(
      this.page.locator(this.elements.updateSubmissionTitle),
    ).toBeVisible();
    await this.elementContainsText(
      this.elements.updateSubmissionTitle,
      baseConfig.citTempData.recordNumber,
    );
  }

  async validateUpdateSubmissionRecordDetails() {
    await this.elementContainsText(
      this.elements.updateSubmissionRecord,
      baseConfig.citTempData.recordTypeName,
    );
    await this.elementContainsText(
      this.elements.updateSubmissionRecord,
      baseConfig.citTempData.recordAddress,
    );
  }
  async validateUpdateSubmissionInfoTextDisplayed() {
    await this.elementContainsText(
      this.elements.updateSubmissionInfoText,
      submissionConstants.updateSubmissionInfoText,
    );
  }

  async clickOnOriginalSubmissionPage() {
    await this.page.click(this.elements.originalSubmissionPage);
  }

  async validateReviewerBannerDisplayed() {
    await expect(
      this.page.locator(this.elements.reviewerBannerTitle),
    ).toBeVisible();
  }

  async validateButtonIsDisplayed(button: NavigationButtons) {
    let elementLoc: Locator;
    switch (button) {
      case NavigationButtons.Continue:
        elementLoc = this.page.locator(this.elements.continueButton);
        break;
      case NavigationButtons.Back:
        elementLoc = this.page.locator(this.elements.backButton);
        break;
      case NavigationButtons.Cancel:
        elementLoc = this.page.locator(this.elements.cancelButton);
        break;
      case NavigationButtons.Confirm_And_Submit:
        elementLoc = this.page.locator(this.elements.submitButton);
        break;
      default:
        throw new Error(`${button} button not found`);
    }
    await expect(elementLoc).toBeVisible();
  }

  async clickOnButton(button: NavigationButtons) {
    let element;
    switch (button) {
      case NavigationButtons.Continue:
        element = this.elements.continueButton;
        break;
      case NavigationButtons.Back:
        element = this.elements.backButton;
        break;
      case NavigationButtons.Cancel:
        element = this.elements.cancelButton;
        break;
      case NavigationButtons.Confirm_And_Submit:
        element = this.elements.submitButton;
        break;
      default:
        throw new Error(`${button} button not found`);
    }
    await this.page.click(element);
  }

  async validateFormSections(section: Sections) {
    let elementLoc: Locator;
    switch (section) {
      case Sections.Single_Entry_Section:
        elementLoc = this.page.locator(this.elements.singleEntrySectionHeading);
        break;
      case Sections.Multi_Entry_Section:
        elementLoc = this.page.locator(this.elements.multiEntrySectionHeading);
        break;
      case Sections.Attachments:
        elementLoc = this.page.locator(this.elements.attachmentsHeading);
        break;
      case Sections.Updated_Form_Fields:
        elementLoc = this.page.locator(this.elements.updatedFormFieldsHeading);
        break;
      case Sections.Updated_Attachments:
        elementLoc = this.page.locator(this.elements.updatedAttachmentsHeading);
        break;
      default:
        throw new Error(`${section} not found`);
    }
    await expect(elementLoc).toBeVisible();
  }

  async verifyReviewerBannerSubHeadingPresent() {
    await this.elementContainsText(
      this.elements.reviewerBannerSubHeading,
      submissionConstants.reviewerBannerSubHeading,
    );
  }

  async validateDefaultOverallNote(isDefault: boolean) {
    if (isDefault) {
      await this.elementContainsText(
        this.elements.overallNote,
        submissionConstants.defaultOverallNote,
      );
    } else {
      await this.elementContainsText(
        this.elements.overallNote,
        submissionConstants.overallNote,
      );
    }
  }

  async clickAccordian() {
    await this.page.click(this.elements.accordionTitle);
  }

  async validateAccordionIsCollapsed(isDefault: boolean) {
    if (isDefault) {
      await expect(
        this.page.locator(this.elements.accordionCollapsed),
      ).toBeTruthy();
      await this.elementContainsText(
        this.elements.accordionTitle,
        'View List of Fields',
      );
    } else {
      await expect(
        this.page.locator(this.elements.accordionExpanded),
      ).toBeTruthy();
      await this.elementContainsText(
        this.elements.accordionTitle,
        'Hide List of Fields',
      );
    }
  }

  isIntersectingViewport(selector: string): Promise<boolean> {
    return this.page.$eval(selector, async (element) => {
      const visibleRatio: number = await new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
          resolve(entries[0].intersectionRatio);
          observer.disconnect();
        });
        observer.observe(element);
        // Firefox doesn't call IntersectionObserver callback unless
        // there are rafs.
        requestAnimationFrame(() => null);
      });
      return visibleRatio > 0; // where 0 - element has just appeared, and 1 - element fully visible;
    });
  }

  async validateSingleFormFieldInViewPort(formField: FormField) {
    await this.page.click(
      this.elements.formFieldSingleLink.selector(formField.label),
    );
    const isVisible = this.isIntersectingViewport(
      this.elements.formFieldView.selector(
        'Single Entry Section',
        formField.label,
      ),
    );
    await expect(isVisible).toBeTruthy();
  }

  async validateMultiFormFieldInViewPort(formField: FormField) {
    await this.page.click(this.elements.accordionTitle);
    await this.page.click(
      this.elements.formFieldMultiLink.selector(formField.label),
    );
    const isVisible = this.isIntersectingViewport(
      this.elements.formFieldView.selector(
        'Multi-Entry Section',
        formField.label,
      ),
    );
    await expect(isVisible).toBeTruthy();
  }

  async validateNumberOfSelectedFormFields(formField: any[]) {
    const accordianList = await this.page.$$(
      this.elements.listOfFormFieldsLink,
    );
    await expect(formField.length).toEqual(accordianList.length);
  }

  async validateSelectedFormFieldHighlighted() {
    const accordianList = await this.page.$$(
      this.elements.listOfFormFieldsLink,
    );
    const highlightedFields = await this.page.$$(
      this.elements.formFieldsHighlight,
    );
    await expect(accordianList.length).toEqual(highlightedFields.length);
  }

  async validateNotSelectedFormFieldNotHighlight(nonSelectedFormField: any[]) {
    const noHighlightedFields = await this.page.$$(
      this.elements.formFieldsNonHighlight,
    );
    await expect(nonSelectedFormField.length).toEqual(
      noHighlightedFields.length,
    ); // +1 for attachements - TODO
  }

  async validateAddedNoteDisplayedForFormField(
    section: string,
    formField: FormField,
  ) {
    await expect(
      this.page.locator(
        this.elements.noteFromReviewer.selector(section, formField.label),
      ),
    ).toHaveText(formField.note);
  }

  async validateNoteNotDisplayedForFormField(
    section: string,
    formField: FormField,
  ) {
    await expect(
      this.page.locator(
        this.elements.noteFromReviewer.selector(section, formField.label),
      ),
    ).toBeHidden();
  }

  async validateErrorBannerDisplayed() {
    await expect(this.page.locator(this.elements.errorBanner)).toBeVisible();
  }

  async validateNumberOfErrorFormFields(selectedFormField: any[]) {
    const errorFields = await this.page.$$(
      this.elements.listOfErrorFormFieldsLink,
    );
    await expect(selectedFormField.length).toEqual(errorFields.length);
  }

  async validateErrorFormFieldHighlighted() {
    const errorFields = await this.page.$$(
      this.elements.listOfErrorFormFieldsLink,
    );
    const errorFormFieldsHighlight = await this.page.$$(
      this.elements.errorFormFieldsHighlight,
    );
    await expect(errorFields.length).toEqual(errorFormFieldsHighlight.length);
  }

  async validateErrorTextDisplayed(section: string, formField: FormField) {
    await this.elementContainsText(
      this.elements.errorText.selector(section, formField.label),
      submissionConstants.errorText,
    );
    await expect(
      this.page.locator(
        this.elements.errorSign.selector(section, formField.label),
      ),
    ).toBeVisible();
  }

  async validateSingleFormFieldErrorInViewPort(formField: FormField) {
    await this.page.click(
      this.elements.errorFormFieldSingleLink.selector(formField.label),
    );
    const isVisible = this.isIntersectingViewport(
      this.elements.errorFormFieldView.selector(
        'Single Entry Section',
        formField.label,
      ),
    );
    await expect(isVisible).toBeTruthy();
  }

  async validateAddedNoteDisplayedForErrorFormField(
    section: string,
    formField: FormField,
  ) {
    await expect(
      this.page.locator(
        this.elements.errorNoteFromReviewer.selector(section, formField.label),
      ),
    ).toHaveText(formField.note);
  }

  async validateCancelDialog() {
    await this.elementContainsText(
      this.elements.cancelDialogTitle,
      submissionConstants.cancelDialogTitle,
    );
    await this.elementContainsText(
      this.elements.cancelDialogInfoText,
      submissionConstants.cancelDialogInfoText1,
    );
    await this.elementContainsText(
      this.elements.cancelDialogInfoText2,
      submissionConstants.cancelDialogInfoText2,
    );
  }

  async onCancellationPopupClick(action: 'Keep Working' | 'Leave' | 'Close') {
    if (action === 'Keep Working') {
      await this.page.click(this.elements.keepWorkingButton);
    } else if (action === 'Leave') {
      await this.page.click(this.elements.leaveButton);
    } else {
      await this.page.click(this.elements.cancelDialogCloseIcon);
    }
  }

  async enterFormFieldValue(section: string, formField: FormField) {
    const formFieldElement = this.elements.formFieldInput.selector(
      section,
      formField.label,
    );
    await this.page.click(formFieldElement);
    await this.page.fill(formFieldElement, formField.value);
  }

  async enterFormFieldValues(section: string, formFields: FormField[]) {
    for (const field of formFields) {
      await this.enterFormFieldValue(section, field);
    }
  }

  async formFieldsDataExists(section: string, formFields: FormField[]) {
    for (const field of formFields) {
      await expect(
        this.page.locator(
          this.elements.formFieldInput.selector(section, field.label),
        ),
      ).not.toBeNull();
    }
  }

  async validateUpdatedTagDisplayed(section: string, formFields: FormField[]) {
    for (const field of formFields) {
      await expect(
        this.page.locator(
          this.elements.updatedTag.selector(section, field.label),
        ),
      ).toBeVisible();
    }
  }

  async validateNumberOfUpdatedFormFields(formFields: any[]) {
    const updatedFields = await this.page.$$(this.elements.formFieldsUpdated);
    await expect(formFields.length).toEqual(updatedFields.length);
  }

  async checkTheFormField(section: string, formField: FormField) {
    await this.page.check(
      this.elements.checkBoxField.selector(section, formField.label),
    );
    expect(
      await this.page.isChecked(
        this.elements.checkBoxField.selector(section, formField.label),
      ),
    ).toBeTruthy();
  }

  async validateConfirmSubmissionTitleDisplayed() {
    await this.elementContainsText(
      this.elements.confirmPageTitle,
      'Review and Confirm Changes to ' + baseConfig.citTempData.recordNumber,
    );
  }

  async validateConfirmSubmissionRecordDetailsWithLocation(
    isLocation: boolean,
  ) {
    console.log();
    await this.elementContainsText(
      this.elements.confirmPageRecordType,
      baseConfig.citTempData.recordTypeName,
    );
    if (isLocation) {
      await this.elementContainsText(
        this.elements.confirmPageRecordAddress,
        baseConfig.citTempData.recordAddress,
      );
    }
  }
  async validateConfirmSubmissionInfoDisplayed() {
    await this.elementContainsText(
      this.elements.confirmPageInfo,
      submissionConstants.confirmPageInfo,
    );
  }

  async validateFormFieldSections(section: string) {
    await expect(
      this.page.locator(this.elements.formFieldsSectionLabel.selector(section)),
    ).toBeVisible();
  }

  async validateEditiableSections(section: string) {
    await expect(
      this.page.locator(this.elements.editSection.selector(section)),
    ).toBeVisible();
  }

  async validateEditiableAnswerSections(section: string, position: string) {
    await expect(
      this.page.locator(
        this.elements.editMultiEntryAnswers.selector(section, position),
      ),
    ).toBeVisible();
  }

  async validateFormFieldValues(section: string, formFields: FormField[]) {
    for (const field of formFields) {
      await expect(
        this.page.locator(
          this.elements.formFieldValue.selector(section, field.label),
        ),
      ).toContainText(field.value);
    }
  }
  async validateFormFieldNotes(section: string, formFields: FormField[]) {
    for (const field of formFields) {
      await expect(
        this.page.locator(
          this.elements.formFieldNote.selector(section, field.label),
        ),
      ).toHaveText(field.note);
    }
  }
}
