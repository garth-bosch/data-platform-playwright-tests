import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {resolve} from 'path';
import {RESOURCES_DIR} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '../base/base-test';

export class PublicFormPage extends BaseCitPage {
  readonly elements = {
    formSectionHeader: 'h3',
    addMultiEntryItemButton: 'button[data-toggle=modal]',
    saveMultiEntry: '.modal-footer .btn-primary',
    uploadAdhocAttachmentBtn: '[id=FileInput_Adhoc]',
    attachedFile: '.attachment-list-row.pointer',
    confirmFileUploadBtn: '#addAttachmentModal .btn.btn-primary',
    uploadFirstAttachmentBtn: 'tbody tr.ember-view:nth-of-type(1) input',
    uploadSecondAttachmentBtn: 'tbody tr.ember-view:nth-of-type(2) input',
    noFileUploaded: 'div.no-pointer-events small',
    invalidFileExtensionError: '#invalidFileExtension_adhoc',
    attachmentError: '#attachmentErrors',
    chooseFile: 'input[type="file"]',
    attachmentBadge: '.input-group .badge',
    thumbnailAttachment: '.attachment-field-thumbnail',
    proceedButton: '.submit-footer .btn-primary',
    dashboardRecordsLink: 'a[href="/dashboard/records"]',
    documentName: {selector: (name) => `.//span[contains(.,"${name}")]`},
    printDocumentButton: '//button[contains(.,"Print Document")]',
    commentInput: '#step_comment_box',
    sendCommentButton: './/button[contains(.,"Send Message")]',
  };

  async formSectionIsVisible(formSection: string) {
    await this.elementTextVisible(
      this.elements.formSectionHeader,
      formSection,
      false,
    );
  }

  async clickAddMultiEntryButton() {
    await this.page.click(this.elements.addMultiEntryItemButton);
  }
  async clickSaveMultiEntryButton() {
    await this.clickElementWithText(this.elements.saveMultiEntry, 'Save');
  }

  async uploadAdhocAttachment(fileType: string) {
    const badFiletypes = ['exe', 'html', 'dmg'];
    let filePath = `${resolve(
      process.cwd(),
    )}${RESOURCES_DIR}sample.${fileType}`;
    if (fileType.length == 0) {
      filePath = filePath.replace('.', '');
    }
    await this.page.setInputFiles(
      this.elements.uploadAdhocAttachmentBtn,
      filePath,
    );
    if (!badFiletypes.find((e) => e === fileType) && fileType.length != 0) {
      await this.page.click(this.elements.confirmFileUploadBtn);
      await this.waitForVisibility(this.elements.attachedFile);
    }
  }

  async uploadAttachments(fileType: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}${RESOURCES_DIR}sample.${fileType}`;
    await this.page.setInputFiles(
      this.elements.uploadFirstAttachmentBtn,
      filePath,
    );

    await this.elementVisible(this.elements.attachedFile);
    await this.page.setInputFiles(
      this.elements.uploadSecondAttachmentBtn,
      filePath,
    );
    await this.elementNotVisible(
      `${this.elements.noFileUploaded}:has-text('No file uploaded')`,
    );
  }

  async proceedToDocumentByName(docName: string) {
    const documentSelector = this.elements.documentName.selector(docName);
    await this.page.click(documentSelector);
  }

  async leaveCommentForDocument(comment: string) {
    await this.page.fill(this.elements.commentInput, comment);
    await this.page.click(this.elements.sendCommentButton);
  }

  async uploadAttachmentWithFile(filename: string) {
    await this.page.setInputFiles(
      this.elements.uploadFirstAttachmentBtn,
      filename,
    );
  }

  async verifyUploadAttachmentErrorMessage(errorType: string) {
    const nameNotSupported = `This file name can only include letters, numbers, and the following special characters !-_.*()`;
    const formatNotSupported = 'File format is not supported';
    let locator = '';
    let modalText = '';
    switch (errorType) {
      case 'formatNotSupported':
        modalText = formatNotSupported;
        locator = this.elements.invalidFileExtensionError;
        break;
      case 'nameNotSupported':
        modalText = nameNotSupported;
        locator = this.elements.attachmentError;
        break;
      default:
        console.error(
          'Wrong parameter passed. Use [formatNotSupported|nameNotSupported]',
        );
        break;
    }

    await expect(
      this.page.locator(locator, {hasText: modalText}).first(),
    ).toBeVisible();
  }

  async addAttachments(numberOfFiles: 1 | 2) {
    await this.page.setInputFiles(
      this.elements.chooseFile,
      `${resolve(process.cwd())}${RESOURCES_DIR}sample.pdf`,
    );
    await expect(
      this.page.locator(this.elements.attachmentBadge),
    ).toBeVisible();
    if (numberOfFiles === 2) {
      await this.page.setInputFiles(
        this.elements.chooseFile,
        `${resolve(process.cwd())}${RESOURCES_DIR}sample.png`,
      );
      await expect(
        this.page.locator(this.elements.thumbnailAttachment),
      ).toBeVisible();
    }
  }

  async navigateToSection(sectionName: string) {
    let isNeededSection = false;
    while (!isNeededSection) {
      await Promise.all([
        this.page.click(this.elements.proceedButton),
        this.page.waitForNavigation(),
      ]);
      const sectionText = await this.page
        .locator(this.elements.formSectionHeader)
        .innerText();
      isNeededSection = sectionText.trim() === sectionName;
    }
  }
  async clickOnPrintDocument() {
    await this.page.click(this.elements.printDocumentButton);
  }
}
