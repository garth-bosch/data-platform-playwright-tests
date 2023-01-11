import {expect} from '../../base/base-test';
import {faker} from '@faker-js/faker';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class AttachmentDesignerPage extends BaseCitPage {
  readonly elements = {
    addAttachmentButton: '#add-attachment-btn',
    addAttachmentsButtonInForm: '#newAttachmentForm #add-attachment-btn',
    addAttachmentDescription1: '#newAttachmentName',
    attachmentNameInput:
      '.panel-body #newAttachmentForm input[name="newAttachmentName"]',
    saveAttachment: '.btn-group #add-attachment-btn',
    requiredButton: '.switch-square label',
    requiredLabel: 'span[data-test="required"]',
    viewPermissionDropdown: '.record-type-attachment-perms-dropdown',
    singleAttachmentPermission: '#attachment-who-can-view',
    singleAttachmentPublic: '[data-test="view-access-public"]',
    singleAttachmentInternal: '[data-test="view-access-internal"]',
    publicDropdownOption:
      '#attachment-who-can-view .dropdown-menu li:nth-child(1) a',
    internalDropdownOption:
      '#attachment-who-can-view .dropdown-menu li:nth-child(2) a',
    panelHeader: '.panel-heading h3',
    panelPermission: '.panel-heading .record-type-attachment-perms-dropdown',
    addConditionButton: '[data-test="add-condition"]',
    selectConditionButton: '#add-attachment-condition select',
    optionDropdown: 'option strong',
    dynamicOptionDropdown: '#newWSCTargetSelector option',
    conditionsValueDropdown:
      '#add-attachment-condition div.form-group:last-of-type select',
    conditionsValueDropdownOptions:
      '#add-attachment-condition div.form-group:last-of-type select option',
    conditionValueRenewalDropdown:
      '.modal-dialog div.form-group select#newWSICCheckboxValueSelector',
    conditionValueInput: 'input#newWSICValue',
    conditionSelector: '#newWSICLogicSelector',
    conditionSelect: `//select[@class="form-control" and option[ contains(.,"Select your option")] ]`,
    confirmAddConditionButton: '.modal-footer .btn-primary',
    attachmentHeading: 'h4[data-test="name"]',
    attachmentHeader: {
      selector: (attachmentName: string) =>
        `//h4[@data-test="name" and contains(.,"${attachmentName}")]/../../..//button[@data-test="edit"]`,
    },
    saveEdit: '.pull-right .btn-group .btn-primary',
    editNameInput: 'input[name="selectedAttachmentName"]',
    deleteButton: '.text-danger',
    confirmDelete: '.bootbox-accept',
    existingConditions: '#newAttachmentForm strong',
    addedCondition: {
      selector: (attachmentName) =>
        `//div[h4[text()="${attachmentName}"]]/following-sibling::div[@data-test="condition-item"]`,
    },
    existingAttachmentNode1: {
      selector: (attName) =>
        `xpath=.//li[contains(@class, 'sortable-item')]/div[contains(., '${attName}')]`,
    },
    existingAttachmentNode: {
      selector: (attachmentName) =>
        `xpath=//h4[text()="${attachmentName}"]/../.././/div[@data-test]//p/strong`,
    },
    reorderButton: {
      selector: (status) => `xpath=//button[text()='${status}']`,
    },
    itemToMove: '.sortable li:nth-of-type(1) .attachment-name button',
    thirdItem: '.sortable li:nth-of-type(3) .attachment-name button',
    attachmentEditButton: {
      selector: (attName) =>
        `xpath=.//h4[text()='${attName}']/../../../div[contains(@class, 'attachment-options')]/button`,
    },
    attachmentDescriptionInput:
      '.panel-body #newAttachmentForm #newAttachment [contenteditable]',
    attachmentAccessType: {
      selector: (name, type) =>
        `xpath=.//li[contains(.,'${name}')]//i[@title='${type}']`,
    },
  };

  async clickAddAttachmentButton() {
    await this.page.click(this.elements.addAttachmentButton);
  }
  async clickAddAttachmentButtonInsideForm() {
    await this.page.click(this.elements.addAttachmentsButtonInForm);
  }

  async addAttachmentButtonIsVisible() {
    await this.waitForVisibility(this.elements.addAttachmentButton);
  }

  async enterAttachmentName(name: string = null) {
    const nameAtt = name
      ? name
      : `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;

    await this.page.fill(this.elements.attachmentNameInput, nameAtt);
  }

  async addAttachmentAndFillDescription(name: string) {
    await this.clickAddAttachmentButton();
    await this.page.type(this.elements.addAttachmentDescription1, name);
    await this.clickAddAttachmentButtonInsideForm();
  }

  async verifyAttachmentDescription(desc: string) {
    await this.locateWithText(this.elements.addAttachmentDescription1, desc);
  }

  async saveAttachment() {
    await this.page.click(this.elements.saveAttachment);
  }
  async addAttachment(name: string = null, description = '') {
    /* tobe redone todo*/
    const nameAtt = name
      ? name
      : `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;

    await this.page.fill(this.elements.attachmentNameInput, nameAtt);
    if (description) {
      await this.page.fill(
        this.elements.attachmentDescriptionInput,
        description,
      );
    }
    await this.page.click(this.elements.saveAttachment);
    await this.elementVisible(this.elements.attachmentHeader.selector(nameAtt));
  }
  async makeOptional() {
    const nameAtt = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.page.fill(this.elements.attachmentNameInput, nameAtt);
    await this.page.click(this.elements.requiredButton);
    await this.page.click(this.elements.saveAttachment);
    await expect(this.page.locator(this.elements.requiredLabel)).toBeVisible();
  }

  async checkPublicOption() {
    const option = 'Public';
    await this.page.click(this.elements.viewPermissionDropdown);
    await expect(
      this.page.locator(this.elements.publicDropdownOption),
    ).toContainText(option);
  }

  async checkInternalOption() {
    const option = 'Internal + Applicant';
    await this.page.click(this.elements.viewPermissionDropdown);
    await expect(
      this.page.locator(this.elements.publicDropdownOption),
    ).toContainText(option);
  }

  async checkAdHocOption() {
    const header = 'Ad-hoc Attachments Visibility';
    await expect(this.page.locator(this.elements.panelHeader)).toContainText(
      header,
    );
  }

  async addUserCondition(field: string) {
    await this.page.click(this.elements.addConditionButton);
    await this.page.click(this.elements.selectConditionButton);
    await expect(this.page.locator(this.elements.optionDropdown)).toContainText(
      field,
    );
  }

  async addDropdownCondition(field: string, dropdownOption: string) {
    await this.page.click(this.elements.addConditionButton);
    await expect(
      this.page.locator(this.elements.selectConditionButton),
    ).toBeVisible();
    await this.page
      .locator(this.elements.selectConditionButton)
      .selectOption({label: field});
    await expect(
      this.page.locator(this.elements.conditionsValueDropdown),
    ).toBeVisible();
    await this.page
      .locator(this.elements.conditionsValueDropdown)
      .selectOption({label: dropdownOption});
    await this.page.click(this.elements.confirmAddConditionButton);
  }

  async addDropdownConditionOnFormField(
    field: string,
    dropdownOption: string,
    formType?: string,
    formConditionValue?: string,
  ) {
    await this.page.click(this.elements.addConditionButton);
    await expect(
      this.page.locator(this.elements.selectConditionButton),
    ).toBeVisible();
    await this.page
      .locator(this.elements.selectConditionButton)
      .selectOption({label: field});
    if (formType === 'number') {
      await expect(
        this.page.locator(this.elements.conditionSelector),
      ).toBeVisible();
      await this.page
        .locator(this.elements.conditionSelector)
        .selectOption({label: dropdownOption});
      await this.page
        .locator(this.elements.conditionValueInput)
        .fill(formConditionValue);
    } else {
      await expect(
        this.page.locator(this.elements.conditionsValueDropdown),
      ).toBeVisible();
      await this.page
        .locator(this.elements.conditionsValueDropdown)
        .selectOption({label: dropdownOption});
    }
    await this.page.click(this.elements.confirmAddConditionButton);
  }

  async verifyConditionPresent(condition: string, attachmentName: string) {
    if (condition.includes('Is Renewal')) {
      condition = 'When Record is being renewed';
    }
    expect(
      await this.page
        .locator(this.elements.addedCondition.selector(attachmentName))
        .innerText(),
    ).toContain(condition);
  }
  async validateDropDownConditionExists(
    dropdownField: string,
    dropdownOption: string,
  ) {
    await this.elementContainsText(
      this.elements.existingConditions,
      dropdownField,
      true,
    );

    await this.elementContainsText(
      this.elements.existingConditions,
      dropdownOption,
      true,
    );
  }

  async validateConditionTextForExistingAttachment(
    attachmentName: string,
    conditionText: string,
  ) {
    const attachmentSelector =
      this.elements.existingAttachmentNode.selector(attachmentName);
    await this.elementContainsText(attachmentSelector, conditionText);
  }

  async editAttachment(oldName: string, newName: string) {
    await this.page
      .locator(this.elements.attachmentEditButton.selector(oldName))
      .click();
    await this.page.locator(this.elements.editNameInput).fill(newName);
    await this.page.locator(this.elements.saveEdit).click();
  }

  async deleteAttachment(name = '') {
    /* tobe redone todo*/
    if (name) {
      await this.page.click(this.elements.attachmentEditButton.selector(name));
    } else {
      await this.page.click(this.elements.attachmentHeader.selector(name));
    }
    await this.page.click(this.elements.deleteButton);
    await this.page.click(this.elements.confirmDelete);
  }

  async checkAttachmentIsPermanent(name: string) {
    /* tobe redone todo*/
    await this.elementContainsText(
      this.elements.attachmentHeader.selector(name),
      name,
    );
    await this.clickElementWithText(
      this.elements.attachmentHeader.selector(name),
      name,
      true,
    );
  }

  async reorderAttachments() {
    await this.page.click(
      this.elements.reorderButton.selector('Reorder Attachments'),
    );
    // we used 'require' instead of common typescript 'import' because 'import' didn't work
    // tslint:disable-next-line:no-require-imports
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dragAndDrop = require('html-dnd').codeForSelectors;
    await this.page.evaluate(
      () => dragAndDrop,
      [this.elements.itemToMove, this.elements.thirdItem],
    );
    await this.page.click(
      this.elements.reorderButton.selector('Done Reordering'),
    );
  }

  async getNumberOfAttachments() {
    const attachments = await this.page
      .locator(this.elements.attachmentHeading)
      .evaluateAll((list) => list.map((element) => element.textContent));
    return attachments.length;
  }

  async verifyAttachmentHasGivenCondition(
    attName: string,
    field: string,
    condition: string,
    fieldtype?: string,
    fieldValue?: string,
  ) {
    let expectedValue: string;
    if (fieldtype === 'number') {
      expectedValue = `When ${field} ${condition} ${fieldValue}`;
    } else {
      expectedValue = `When ${field} is ${condition}`;
    }
    await expect(
      this.page.locator(
        this.elements.existingAttachmentNode1.selector(attName),
        {hasText: expectedValue},
      ),
    ).toBeVisible();
  }

  async setAttachmentsVisibility(visibility: 'public' | 'internal') {
    await expect(
      this.page.locator(this.elements.singleAttachmentPermission),
    ).toBeVisible();
    await this.page.locator(this.elements.singleAttachmentPermission).click();
    switch (visibility) {
      case 'public': {
        await this.page.locator(this.elements.singleAttachmentPublic).click();
        break;
      }
      case 'internal': {
        await this.page.locator(this.elements.singleAttachmentInternal).click();
        break;
      }
    }
  }
  async addCondition(conditionFlag: string, value: string) {
    await this.page.click(this.elements.addConditionButton);
    await this.page
      .locator(this.elements.selectConditionButton)
      .selectOption({label: conditionFlag});
    if (conditionFlag === 'Is Renewal') {
      await this.page
        .locator(this.elements.conditionValueRenewalDropdown)
        .selectOption({label: value});
    } else {
      await this.page
        .locator(this.elements.conditionSelect)
        .selectOption({label: value});
    }
    await this.page.click(this.elements.confirmAddConditionButton);
  }

  async updateAttachmentName(
    name: string,
    newName = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`,
  ) {
    await this.page.click(this.elements.attachmentHeader.selector(name));
    await this.page.fill(this.elements.editNameInput, newName);
    await this.page.click(this.elements.saveEdit);
    await expect(
      this.page.locator(this.elements.attachmentHeader.selector(newName)),
    ).toBeVisible();
  }
}
