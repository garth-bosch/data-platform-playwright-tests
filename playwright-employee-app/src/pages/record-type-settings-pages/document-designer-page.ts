import {expect} from '../../base/base-test';
import {faker} from '@faker-js/faker';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class DocumentDesignerPage extends BaseCitPage {
  readonly elements = {
    addDocumentButton: '#add-doc-btn',
    createDocumentButton: '#create-doc-btn',
    docTypeSelectDropdown: '#docTypeEdit',
    docTypeSelectOption: '#docTypeEdit option',
    docTitileInput: '#docTitle',
    docList: '.ember-view h5',
    orientationDropdown: '#orient',
    orientationOption: '#orient option',
    editDocType: '#docTypeEdit',
    docTypeEditOptions: '#docTypeEdit option',
    buttonOnToolbar: '.btn-toolbar .btn',
    docMenu: '.panel-body .dropdown-toggle',
    deleteDocButton: '.fa-trash',
    confirmDelete: '.bootbox-accept',
    saveEditButton: '.btn-toolbar .btn-primary',
    backButton: '.panel-body .fa-chevron-left',
    documentEditor: '.froala-editor-container .fr-element',
    mergeTags: {
      selector: (name: string) =>
        `//code[@class="merge-tag-code" and contains(.,'${name}')]`,
    },
    mergeTagsOnDocumentEditor: {
      selector: (name: string) => `//p[contains(.,'{{${name}}}')]`,
    },
  };

  async addMergeTagToDocumentEditor(mergeTagsList: string[]) {
    for (let i = 0; i < mergeTagsList.length; i++) {
      await this.page
        .locator(this.elements.mergeTags.selector(mergeTagsList[i]))
        .click({delay: 100});
      await this.page.locator(this.elements.documentEditor).click({delay: 100});
      await this.page.keyboard.press(`Enter`);
      await this.page.keyboard.press(`Meta+KeyV`);
      await this.page.keyboard.press(`Enter`);
    }
  }
  async validateMergeTagToDocumentEditor(mergeTagsList: string[]) {
    for (let i = 0; i < mergeTagsList.length; i++) {
      await expect(
        this.page.locator(
          this.elements.mergeTagsOnDocumentEditor.selector(mergeTagsList[i]),
        ),
      ).toBeVisible();
    }
  }
  async clickAddDocumentButton() {
    await this.page.click(this.elements.addDocumentButton);
  }

  async setDocType(docOption: string) {
    await this.page.click(this.elements.docTypeSelectDropdown);
    await this.elementContainsText(
      this.elements.docTypeSelectOption,
      docOption,
      true,
    );
    await this.clickElementWithText(
      this.elements.docTypeSelectOption,
      docOption,
      true,
    );
  }

  async createDefaultDoc() {
    const docName = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.page.click(this.elements.addDocumentButton);
    await this.page.fill(this.elements.docTitileInput, docName);
    await this.page.click(this.elements.createDocumentButton);
    await this.clickElementWithText(this.elements.docList, docName, true);
    await this.clickElementWithText(this.elements.docList, docName, true);
  }

  async checkOrientation() {
    await this.page.click(this.elements.orientationDropdown);
    await this.elementContainsText(
      this.elements.orientationOption,
      'Landscape',
      true,
    );
    await this.elementContainsText(
      this.elements.orientationOption,
      'Portrait',
      true,
    );
  }

  async changeDocType() {
    await this.page.click(this.elements.editDocType);

    await this.elementContainsText(
      this.elements.docTypeEditOptions,
      'Permit/License',
      true,
    );
    await this.elementContainsText(
      this.elements.docTypeEditOptions,
      'Certificate',
      true,
    );
    await this.elementContainsText(
      this.elements.docTypeEditOptions,
      'Letter',
      true,
    );
    await this.elementContainsText(
      this.elements.docTypeEditOptions,
      'Other',
      true,
    );
    await this.clickElementWithText(
      this.elements.docTypeEditOptions,
      'Letter',
      true,
    );
    await expect(
      this.page.locator(this.elements.docTypeSelectDropdown),
    ).toHaveValue(DocumentTypes.Letter);
    await this.page.click(this.elements.saveEditButton);
  }

  async checkChangeDocType(docType: DocumentTypes = DocumentTypes.Letter) {
    await expect(
      this.page.locator(this.elements.docTypeSelectDropdown),
    ).toHaveValue(docType);
  }

  async checkPrintOption() {
    await this.elementContainsText(
      this.elements.buttonOnToolbar,
      'Print Preview',
      true,
    );
    await this.clickElementWithText(
      this.elements.buttonOnToolbar,
      'Print Preview',
    );
  }

  async deleteDocument() {
    await this.page.click(this.elements.docMenu);
    await this.page.click(this.elements.deleteDocButton);
    await this.page.click(this.elements.confirmDelete);
  }
}

export enum DocumentTypes {
  Permit = '1',
  Certificate = '2',
  Letter = '3',
  Other = '0',
}
