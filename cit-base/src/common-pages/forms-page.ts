import {expect} from '../base/base-test';
import {BaseCitPage} from '../base/base-page';
import {resolve} from 'path';
import {FormField} from '../constants/cit-constants';

export class FormsPage extends BaseCitPage {
  readonly elements = {
    formFieldElement: {
      selector: (fieldLabel: string) =>
        `//div[contains(@class, 'form-group')]//label[text()='${fieldLabel}']/..`,
    },
    formFieldInput: {
      selector: (fieldLabel: string) =>
        `//div[contains(@class, 'form-group')]//label[text()='${fieldLabel}']/..//input`,
    },
    formFieldItemLabels: '[id^=customField] label',
    saveMultiEntrySection: '.btn.btn-primary.btn-100',
    saveMultiEntrySectionWithName: {
      selector: (meSectionName: string) =>
        `//h4[text()='${meSectionName}' and @class='modal-title']/ancestor::` +
        `div[@class='modal-content']//button[@class='btn btn-primary btn-100']`,
    },
    signatureCheckbox: '.esignature-form-field-outer-div .checkboxOption',
    signatureTextbox: '#new-esignature',
    signatureSaveBtn: '#new-signature-modal .btn.btn-primary',
    eSignatureImage: '.esignature-check',
    eSignatureDate: '.esignature-date',
    chooseFileInSectionBtn: {
      selector: (sectionName: string) =>
        `//*[text()="${sectionName}"]/../..//div[@class="input-group"]/input[@type="file"]`,
    },
    attachmentBadge: '.input-group .badge',
    thumbnailAttachment: '.attachment-field-thumbnail',
    multiEntryChooseFileBtn: '.modal-content .input-group [type=file]',
    multiEntrySignatureCheckbox: '.modal-content .checkboxOption',
    multiEntrySignatureTextbox: '[id*=meie-esignature-customInput]',
    multiEntrySignatureSaveBtn: '.modal-content span .btn.btn-primary',
    multiEntryeSignatureImage: '.modal-content .esignature-check',
    multiEntryeSignatureDate: '.modal-content .esignature-date',
    multiEntryThumbnailAttachment: '.modal-content .attachment-field-thumbnail',
    multiEntryAttachmentBadge: '.modal-content .input-group .badge',
    longTextFormField: {
      selector: (fieldName: string) =>
        `//label[contains(string(),'${fieldName}')]/following-sibling::div//div[@contenteditable='true']`,
    },
    multiEntrySectionBtn: {
      selector: (sectionName: string) =>
        `//button[@id= 'add-mei-button' and contains(.,'Add ${sectionName}')]`,
    },
    multiEntrySectionModal: {
      selector: (modalName: string) =>
        `//*[@class='modal-title' and text()='${modalName}']`,
    },
    shortEntryTextFormField: {
      selector: (formField: string) =>
        `//label[text()='${formField}']/following-sibling::div//input`,
    },
    editBtnMultiEntrySection: {
      selector: (sectionName: string) =>
        `//*[text()=${sectionName}]/following::button[starts-with(@id, 'editButton')]`,
    },
    multiEntrySectionFormLabel: {
      selector: (
        sectionName: string,
        fieldName: string,
        fieldPosition: number,
      ) =>
        `//*[text()='${sectionName}']/parent::*/following-sibling::*//label[text()='${fieldName}'][${fieldPosition}]`,
    },
    multiEntrySectionCheckbox: {
      selector: (sectionName: string, fieldName: string) =>
        `//*[text()='${sectionName}']/parent::*[@class='modal-header']/` +
        `following-sibling::*//label[text()='${fieldName}']/following-sibling::*//input`,
    },
    uploadAttachmentFormField: {
      selector: (formField: string) =>
        `.//h4[text()='${formField}']/../../../../input`,
    },
    formFieldInputBox: {
      selector: (fieldName) =>
        `//label[text()='${fieldName}']/following-sibling::*//input[1]`,
    },
    editSection: {
      selector: (sectionName) =>
        `//*[contains(text(),'${sectionName}')]//following::a[contains(string(),'Edit')]`,
    },
    // For SSN and EIN form fields
    formField: {selector: (label) => `label[for='${label}']`},
    formFieldButton: {
      selector: (label) => `${this.elements.formField.selector(label)} a`,
    },
    showFormField: {
      selector: (label) =>
        `//label[@for='${label}']//a[contains(string(),'Show')]`,
    },
    hideFormField: {
      selector: (label) =>
        `//label[@for='${label}']//a[contains(string(),'Hide')]`,
    },
    secreteFormFieldValue: {
      selector: (label) => `label[for='${label}'] + div`,
    },
  };

  async validateFormFieldIsVisible(fieldLabel: string, visible = true) {
    await this.page.waitForSelector(
      this.elements.formFieldElement.selector(fieldLabel),
      visible ? this.isVisible : this.isNotVisible,
    );
  }

  async toggleCheckboxFormField(fieldLabel: string, exactMatch = false) {
    await (
      await this.locateWithText(
        this.elements.formFieldItemLabels,
        fieldLabel,
        exactMatch,
      )
    ).check();
  }

  async enterFormFieldValue(fieldLabel: string, value: string) {
    const formFieldElement = this.elements.formFieldInput.selector(fieldLabel);
    await this.page.click(formFieldElement);
    await this.page.fill(formFieldElement, value);
  }

  async enterFormFieldValues(formFields: FormField[]) {
    for (const field of formFields) {
      await this.enterFormFieldValue(field.label, field.value);
    }
  }

  async verifyFieldValueSaved(value: string, fieldName: string) {
    const element = this.elements.formFieldInputBox.selector(fieldName);
    await expect(this.page.locator(element)).toHaveAttribute('value', value);
  }

  async editFormField(sectionName: string) {
    await this.page.click(this.elements.editSection.selector(sectionName));
    await this.elementTextNotVisible('#h3', 'sectionName');
  }

  async clearFormFieldValue(fieldLabel: string) {
    const formFieldElement = this.elements.formFieldInput.selector(fieldLabel);
    await this.page.fill(formFieldElement, '');
  }

  async enterMultiEntryFormField(meSectionLabel: string) {
    const meiButton = 'add-mei-button';
    if (!meSectionLabel) {
      await this.page.evaluate(() =>
        document.getElementById(meiButton).click(),
      );
    } else {
      await this.page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight),
      );
      await this.clickElementWithText(meiButton, meSectionLabel, true);
    }
  }

  async saveMultiEntryFormField(meSectionLabel: string) {
    if (!meSectionLabel) {
      await this.page.click(this.elements.saveMultiEntrySection);
    } else {
      await this.page.click(
        this.elements.saveMultiEntrySectionWithName.selector(meSectionLabel),
      );
    }
  }

  async addSignatureToSingleEntrySection(signerName: string) {
    await this.page.click(this.elements.signatureCheckbox);
    await this.page.fill(this.elements.signatureTextbox, signerName);
    await this.page.click(this.elements.signatureSaveBtn);
    await this.page
      .locator(this.elements.eSignatureImage)
      .scrollIntoViewIfNeeded();
  }

  async addAttachmentsToSingleEntrySection(
    sectionName: string,
    numberOfFiles: number,
  ) {
    await this.page.setInputFiles(
      this.elements.chooseFileInSectionBtn.selector(sectionName),
      `${resolve(process.cwd())}/src/resources/plc/sample.pdf`,
    );

    await expect(
      this.page.locator(this.elements.attachmentBadge),
    ).toBeVisible();

    if (numberOfFiles === 2) {
      await this.page.setInputFiles(
        this.elements.chooseFileInSectionBtn.selector(sectionName),
        `${resolve(process.cwd())}/src/resources/plc/sample.png`,
      );
      await expect(
        this.page.locator(this.elements.thumbnailAttachment),
      ).toBeVisible();
    }
  }

  async addSignatureToMultiEntrySection(signerName: string) {
    await this.page.click(this.elements.multiEntrySignatureCheckbox);
    await this.page.fill(this.elements.multiEntrySignatureTextbox, signerName);
    await this.page.click(this.elements.multiEntrySignatureSaveBtn);
    await expect(
      this.page.locator(this.elements.multiEntryeSignatureImage),
    ).toBeVisible();
  }

  async addAttachmentsToMultiEntrySection() {
    await this.page.setInputFiles(
      this.elements.multiEntryChooseFileBtn,
      `${resolve(process.cwd())}/src/resources/plc/sample.pdf`,
    );
    await expect(
      this.page.locator(this.elements.multiEntryAttachmentBadge),
    ).toBeVisible();
    await this.page.setInputFiles(
      this.elements.multiEntryChooseFileBtn,
      `${resolve(process.cwd())}/src/resources/plc/sample.png`,
    );

    await expect(
      this.page.locator(this.elements.multiEntryThumbnailAttachment),
    ).toBeVisible();
  }

  async openMultiEntrySection(sectionName: string) {
    await this.page.click(
      this.elements.multiEntrySectionBtn.selector(sectionName),
    );
  }

  async fillLargeTextformField(dataTable: any) {
    const input = dataTable.hashes();
    for (const element of input) {
      await this.page.fill(
        this.elements.longTextFormField.selector(
          element.long_text_entry_field_name,
        ),
        element.input,
      );
    }
  }

  async saveMultiEntrySection() {
    await this.page.click(this.elements.saveMultiEntrySection);
    await expect(
      this.page.locator(this.elements.saveMultiEntrySection),
    ).toBeHidden();
  }

  async fillShortEntryTextformField(dataTable: any) {
    const input = dataTable.hashes();
    for (const element of input) {
      await this.page.fill(
        this.elements.shortEntryTextFormField.selector(
          element.short_text_entry_field_name,
        ),
        element.input,
      );
    }
  }

  async shouldMultiEntrySectiondisplayField(
    sectionName: string,
    fieldName: string,
    isPresent: string,
    fieldPosition = 1,
  ) {
    const fieldLabel = this.elements.multiEntrySectionFormLabel.selector(
      sectionName,
      fieldName,
      fieldPosition,
    );
    this.waitForVisibility(fieldLabel, isPresent === 'is not');
  }

  async toggleCheckboxInMultiEntrySection(
    sectionName: string,
    fieldLabel: string,
  ) {
    const checkbox = this.elements.multiEntrySectionCheckbox.selector(
      sectionName,
      fieldLabel,
    );
    await this.page.click(checkbox);
    await expect(
      this.page.locator(checkbox),
      'checked attribute could not found',
    ).toHaveAttribute('checked', 'true');
  }

  async uploadAttachmentToFormField(formField: string, attName: string) {
    await this.page.setInputFiles(
      this.elements.uploadAttachmentFormField.selector(formField),
      `${resolve(process.cwd())}/src/resources/plc/${attName}`,
    );
  }

  async validateSsnOrEinFormField(fieldLabel: string, expectedValue: string) {
    await this.elementVisible(this.elements.formField.selector(fieldLabel));
    await this.elementTextVisible(
      this.elements.secreteFormFieldValue.selector(fieldLabel),
      expectedValue,
    );
  }

  async validateShowLink(fieldLabel: string, visibility: boolean) {
    const formField = this.elements.formField.selector(fieldLabel);
    const formFieldShowButton = this.page.locator(
      this.elements.formFieldButton.selector(fieldLabel),
      {hasText: 'Show'},
    );
    const formFieldHideButton = this.page.locator(
      this.elements.formFieldButton.selector(fieldLabel),
      {hasText: 'Hide'},
    );
    const secreteFormFieldValue =
      this.elements.secreteFormFieldValue.selector(fieldLabel);
    await this.elementVisible(formField);
    if (visibility) {
      await formFieldShowButton.click();
      await expect(formFieldShowButton).toBeHidden();
      await expect(formFieldHideButton).toBeVisible();
    } else {
      await this.elementVisible(secreteFormFieldValue);
      await expect(formFieldShowButton).toBeHidden();
    }
  }
}
