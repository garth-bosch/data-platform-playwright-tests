import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect, Locator} from '@playwright/test';

export enum FooterButton {
  Next = 'Next',
  Back = 'Back',
  Cancel_And_Return = 'Cancel And Return',
  Confirm_And_Request_Changes = 'Confirm and Request Changes',
}
export enum Pages {
  Select_Form_Fields = 'Select Form Fields',
  Select_Attachments = 'Select Attachments',
  Confirm_Request = 'Confirm Request',
}

export const noFormFieldSelectedBanner = {
  heading: 'There is Nothing for the Applicant to Update',
  body: 'Please go back and choose at least 1 form field or attachment for the applicant to update.',
};

export class RequestChanges extends BaseCitPage {
  readonly elements = {
    pageHeader: '#request-changes-header',
    nextButton: `//div[@data-testid='footer-buttons']/button[string()= 'Next']`,
    backButton: `//div[@data-testid='footer-buttons']/button[string()= 'Back']`,
    cancelAndReturnToRecordButton: `button[data-testid='cancel-return-button']`,
    confirmAndRequestChanges: `//div[@data-testid='footer-buttons']/button[string()= 'Confirm and Request Changes']`,
    selectFormFieldHeader: `//h3[text()='Select Form Fields']`,
    selectAttahmentHeader: `//h2[text()='Select Attachments']`,
    confirmRequestHeader: `div[data-testid='confirm-request']`,
    formFieldLabel: {
      selector: (section: string, formField: string) =>
        `//*[text()='${section}']//following::label[text()='${formField}'][1]`,
    },
    formFieldCheckBox: {
      selector: (section: string, formField: string) =>
        `//*[text()='${section}']//following::label[text()='${formField}'][1]/preceding::input[@type='checkbox'][1]/following-sibling::*`,
    },
    formFieldNote: {
      selector: (section: string, formField: string) =>
        `//*[text()='${section}']//following::label[text()='${formField}'][1]/following::*[@id='textAreaField'][1]`,
    },
    cancelRequestBtn: `button[data-testid='cancel-request']`,
    keepRequestBtn: `button[data-testid='no-cancel']`,
    attachmentCheckBox: {
      selector: (attachmentName: string) =>
        `//*[text()='${attachmentName}']/preceding::input[@type='checkbox'][1]/following-sibling::*`,
    },
    attachmentLabel: {
      selector: (attachmentName: string) =>
        `(//*[text()='${attachmentName}'])[1]`,
    },
    attachmentNote: {
      selector: (attachmentName: string) =>
        `//*[text()='${attachmentName}']/preceding::input[@type='checkbox'][1]/following::*[@id='textAreaField'][1]`,
    },
    attachmentThumbnail: {
      selector: (attachmentName: string) =>
        `(//*[text()='${attachmentName}']/preceding::*[@data-testid='attachment-thumbnail'])[1]`,
    },
    emptyAttachmentThumbnail: {
      selector: (attachmentName: string) =>
        `//*[text()='${attachmentName}']/following::*[text()='No File Uploaded']/preceding::*[@data-testid='attachment-thumbnail'][1]`,
    },
    bannerHeader: `//*[starts-with(@class,'bannerContent')]/*[@data-test='undefined-header']`,
    bannerBody: `//*[starts-with(@class,'bannerContent')]/*[@data-test='undefined-body']`,
    trashIconOnFormFields: {
      selector: (fieldName: string) =>
        `(//*[@data-testid='trash-wrapper']/descendant::label[text()='${fieldName}']/following-sibling::div/*[@data-testid='trash-icon'])[1]`,
    },
    trashIconOnAttachement: {
      selector: (attachementContainer: string) =>
        `//*[text()='${attachementContainer}']/ancestor::*[@data-testid="trash-wrapper"]//*[@data-testid='trash-icon']`,
    },
    trashWrapperNoteOnAttachment: {
      selector: (attachementContainer: string) =>
        `//*[text()='${attachementContainer}']/ancestor::*[@data-testid="trash-wrapper"]//*[@data-testid='trash-icon']`,
    },
    removeBtn: `//div[text()='Remove']/parent::button`,
    overallNoteToApplicationHeading: `//*[@data-testid='overall-comment']/*[@role='heading' and text()='Overall Note to Applicant (Optional)']`,
    overAllNoteInput: `//*[@data-testid='overall-comment']//*[@id='textAreaField']`,
    cancelBtn: `//button/*[text()='Cancel']`,
    closeBtn: `*[data-test='dialog-warning-close-button']`,
  };

  async validateButtonIsDisplayed(button: FooterButton) {
    let elementLoc: Locator;
    switch (button) {
      case FooterButton.Next:
        elementLoc = this.page.locator(this.elements.nextButton);
        break;
      case FooterButton.Back:
        elementLoc = this.page.locator(this.elements.backButton);
        break;
      case FooterButton.Cancel_And_Return:
        elementLoc = this.page.locator(
          this.elements.cancelAndReturnToRecordButton,
        );
        await this.elementContainsText(
          this.elements.cancelAndReturnToRecordButton,
          baseConfig.citTempData.recordNumber,
        );
        break;
      case FooterButton.Confirm_And_Request_Changes:
        elementLoc = this.page.locator(this.elements.confirmAndRequestChanges);
        break;
      default:
        throw new Error(`${button} button not found on footer`);
    }
    await expect(elementLoc).toBeVisible({timeout: 50000});
  }

  async clickOnButton(button: FooterButton) {
    let element;
    switch (button) {
      case FooterButton.Next:
        element = this.elements.nextButton;
        break;
      case FooterButton.Back:
        element = this.elements.backButton;
        break;
      case FooterButton.Cancel_And_Return:
        element = this.elements.cancelAndReturnToRecordButton;
        break;
      case FooterButton.Confirm_And_Request_Changes:
        element = this.elements.confirmAndRequestChanges;
        break;
      default:
        throw new Error(`${button} button not found on footer`);
    }
    await this.page.click(element);
  }

  async validatePageHeadingIsDisplayed(page: Pages) {
    let elementLoc: Locator;
    switch (page) {
      case Pages.Select_Form_Fields:
        elementLoc = this.page.locator(this.elements.selectFormFieldHeader);
        break;
      case Pages.Select_Attachments:
        elementLoc = this.page.locator(this.elements.selectAttahmentHeader);
        break;
      case Pages.Confirm_Request:
        elementLoc = this.page.locator(this.elements.confirmRequestHeader);
        break;
      default:
        throw new Error(`${page} page not found`);
    }
    await expect(elementLoc).toBeVisible({timeout: 50000});
  }

  async validateCheckBoxAndNoteDisplay(section: string, formField: string) {
    await expect(
      this.page.locator(
        this.elements.formFieldCheckBox.selector(section, formField),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.formFieldNote.selector(section, formField),
      ),
    ).toBeVisible();
  }

  async validateSelectedFormFieldSaved(
    section: string,
    formField: any,
    note: string,
  ) {
    await expect
      .soft(
        this.page.locator(
          this.elements.formFieldNote.selector(section, formField),
        ),
      )
      .toHaveText(note);
  }

  async selectAndAddNoteToFormField(
    section: string,
    formField: string,
    note = 'Note',
  ) {
    await this.page.check(
      this.elements.formFieldCheckBox.selector(section, formField),
    );
    await this.page.fill(
      this.elements.formFieldNote.selector(section, formField),
      note,
    );
  }

  async validateNumberOfSelectedFormFields(selectedFormField: string) {
    await this.elementContainsText(
      this.elements.selectFormFieldHeader,
      `${selectedFormField} Selected`,
    );
  }

  async clickOnKeepRequest() {
    await this.page.click(this.elements.keepRequestBtn);
  }

  async clickOnCancelRequestChange() {
    await this.page.click(this.elements.cancelAndReturnToRecordButton);
  }

  async cancelRequest() {
    await this.page.click(this.elements.cancelRequestBtn);
  }

  async validateFormFieldDisplay(sectionName: string, formField: string) {
    await expect(
      this.page.locator(
        this.elements.formFieldLabel.selector(sectionName, formField),
      ),
    ).toBeVisible({timeout: 50000});
  }

  async validateNumberOfSelectedAttachment(numberOfAttachment: string) {
    await this.elementContainsText(
      this.elements.selectAttahmentHeader,
      `${numberOfAttachment} Selected`,
    );
  }

  async validateAttachmentDisplay(attachmentName: string) {
    await expect(
      this.page.locator(
        this.elements.attachmentCheckBox.selector(attachmentName),
      ),
    ).toBeVisible({timeout: 50000});
  }

  async selectAttachment(attachmentName: string) {
    await this.page.check(
      this.elements.attachmentCheckBox.selector(attachmentName),
    );
  }

  async addNoteToAttachment(attachmentName: string, note?: string) {
    await this.selectAttachment(attachmentName);
    await this.page.fill(
      this.elements.attachmentNote.selector(attachmentName),
      note,
    );
  }
  async validateAttachmentOpenInNewTab(
    attachmentName: string,
    FileName: string,
  ) {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.click(
        this.elements.attachmentThumbnail.selector(attachmentName),
      ),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    expect(await popup.title()).toContain(FileName);
    await popup.close();
  }

  async clickOnAttachment(containerName: string, isNonEmpty = true) {
    if (isNonEmpty)
      await this.page.click(
        this.elements.attachmentLabel.selector(containerName),
      );
    else
      await this.page.click(
        this.elements.emptyAttachmentThumbnail.selector(containerName),
      );
  }

  async selectAndAddNoteToAttachment(containerName: string, note?: string) {
    await this.page.check(
      this.elements.attachmentCheckBox.selector(containerName),
    );
    await this.page.fill(
      this.elements.attachmentNote.selector(containerName),
      note,
    );
  }

  async validateAttchmentDisplay(containerName: string) {
    await expect(
      this.page.locator(this.elements.attachmentLabel.selector(containerName)),
    ).toBeVisible();
  }

  async validateEmptyAttachmentNotClickable(attachmentName: string) {
    await expect(
      this.page.locator(
        this.elements.emptyAttachmentThumbnail
          .selector(attachmentName)
          .concat('/a'),
      ),
    ).toBeHidden();
  }

  async submitRequestedChange() {
    await this.page.click(this.elements.confirmAndRequestChanges);
  }

  async validateThereIsNothingToUpdateWarningBaner(
    heading: string,
    body: string,
  ) {
    await expect(this.page.locator(this.elements.bannerHeader)).toContainText(
      heading,
    );
    await expect(this.page.locator(this.elements.bannerBody)).toContainText(
      body,
    );
  }

  async validateConfirmRequestButtonIsDisabled() {
    await expect(
      this.page.locator(this.elements.confirmAndRequestChanges),
    ).toBeDisabled();
  }

  async removeFormFieldFromConfirmationPage(formField: string) {
    await this.clickOnTrashIcon(formField);
    await this.page.click(this.elements.removeBtn);
    await expect(
      this.page.locator(
        this.elements.formFieldNote.selector('Selected Form Fields', formField),
      ),
    ).toBeHidden();
  }
  async validateFormFieldHasTrashIconAndNote(formField: string) {
    await this.isSelectedFormFieldDisplayOnConfirmationPage(formField, true);
    await expect(
      this.page.locator(
        this.elements.formFieldNote.selector('Selected Form Fields', formField),
      ),
    ).toBeVisible();
  }

  async isSelectedFormFieldDisplayOnConfirmationPage(
    formField: string,
    isVisible: boolean,
  ) {
    await this.waitForVisibility(
      this.elements.trashIconOnFormFields.selector(formField),
      isVisible,
    );
  }

  async validateAttachmentHasTrashIconAndNote(formField: string) {
    await expect(
      this.page.locator(
        this.elements.trashIconOnAttachement.selector(formField),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.trashWrapperNoteOnAttachment.selector(formField),
      ),
    ).toBeVisible();
  }

  async isFormFieldSelected(
    sectionName: string,
    formField: string,
    isSelected = false,
  ) {
    await expect(
      this.page.locator(
        this.elements.formFieldCheckBox.selector(sectionName, formField) +
          `/preceding-sibling::input`,
      ),
    ).toHaveAttribute('aria-checked', isSelected.toString().toLowerCase());
  }

  async validateOverallNoteToApplicantSectionDisplay() {
    await expect(
      this.page.locator(this.elements.overallNoteToApplicationHeading),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.overAllNoteInput),
    ).toBeVisible();
  }

  async cancelRemoveFormFieldWarning() {
    await this.page.click(this.elements.cancelBtn);
  }

  async closeRemoveFormFieldWarning() {
    await this.page.click(this.elements.closeBtn);
  }

  async isRemoveRequestChangeWarningDialogVisible(isVisible: boolean) {
    await this.waitForVisibility(this.elements.removeBtn, isVisible);
  }

  async clickOnTrashIcon(formField: string) {
    await this.page.click(
      this.elements.trashIconOnFormFields.selector(formField),
    );
  }

  async addOverallNoteToApplicant(noteText: string) {
    await this.page.fill(this.elements.overAllNoteInput, noteText);
    await this.page.click(this.elements.overallNoteToApplicationHeading);
  }

  async validateOverallNoteToApplicantLimitsTo2500Character(
    expectedCharCounter: number,
  ) {
    const elemAttribute = await this.page
      .locator(this.elements.overAllNoteInput)
      .textContent();
    expect(elemAttribute.length).toEqual(expectedCharCounter);
  }

  async checkTheFormField(section: string, formField: string) {
    await this.page.check(
      this.elements.formFieldCheckBox.selector(section, formField),
    );
  }
}
