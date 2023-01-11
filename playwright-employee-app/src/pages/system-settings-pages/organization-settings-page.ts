import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

import {resolve} from 'path';

export class OrganizationSettingsPage extends BaseCitPage {
  readonly elements = {
    presenceOfCommunitySettings:
      '//div[h4[contains(., " Community Settings")]]/div[contains(.,"Set address integration")]',
    addDepartmentButton: '.form-group .btn-primary',
    addDepartmentInput: '#addDepartmentName',
    departmentName: '.md-line-height',
    createDepartmentButton: '.modal-footer .btn-primary',
    editDepartment: {
      selector: (name: string) =>
        `(//div[text()='${name}']/ancestor::div/div[2]/a//*[name()='svg'])[1]/*[name()='path']`,
    },
    editDepartmentInput: '.row .input-group #editDepartmentName',
    saveEditButton: '.input-group-btn .btn-primary',
    deleteDepartment: {
      selector: (name: string) =>
        `//*[text()='${name}']/parent::div/parent::div/div[2]/a/div[@data-hint="Delete"]`,
    },
    confirmDeleteButton: '.modal-footer .btn-danger',
    dateFormatDropdown: '.container .form-group:nth-child(3) .form-control',
    dateDropdownOption:
      '.container .form-group:nth-child(3) .form-control option',
    departmentLabel: {
      selector: (name: string) => `//div[text()='${name}']`,
    },
    uploadLogoInput: '.logo-overlay .upload',
  };

  async addDepartmentToOrganizations(name: string = null) {
    const text = name
      ? name
      : `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.page.click(this.elements.addDepartmentButton);
    await this.page.fill(this.elements.addDepartmentInput, text);
    await this.page.click(this.elements.createDepartmentButton);
    await this.elementContainsText(this.elements.departmentName, text, true);
    baseConfig.citTempData.departmentNameText = text;
    console.info(
      'departmentNameText: ',
      baseConfig.citTempData.departmentNameText,
    );
  }

  async editDepartmentOfOrganizations(isAdded: boolean) {
    const text = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    const newText = `${this.plcPrefix()}${faker.random.alphaNumeric(3)}`;
    let departmentEditLocator = this.elements.editDepartment.selector(
      baseConfig.citTempData.departmentNameText,
    );
    if (isAdded === false) {
      departmentEditLocator = this.elements.editDepartment.selector(text);
      await this.addDepartmentToOrganizations(text);
    }
    await this.page.click(departmentEditLocator);
    await this.enterText(newText);
    await this.page.click(this.elements.saveEditButton);
    await this.elementNotVisible(departmentEditLocator);
    baseConfig.citTempData.departmentNameText = newText;
  }

  async deleteDepartmentFromOrganizations(isAdded: boolean) {
    const text = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    let departmentDeleteLocator = this.elements.deleteDepartment.selector(
      baseConfig.citTempData.departmentNameText,
    );
    if (isAdded === false) {
      departmentDeleteLocator = this.elements.deleteDepartment.selector(text);
      await this.addDepartmentToOrganizations(text);
    }
    await this.page.click(departmentDeleteLocator);
    await this.page.click(this.elements.confirmDeleteButton);
    baseConfig.citTempData.departmentNameText = text;
  }

  async changeDateFormat() {
    const nonUSDateFormat = 'DD/MM/YYYY';
    const usDateFormat = 'MM/DD/YYYY';
    await this.page.click(this.elements.dateFormatDropdown);

    await this.elementContainsText(
      this.elements.dateDropdownOption,
      nonUSDateFormat,
      true,
    );
    await this.elementContainsText(
      this.elements.dateDropdownOption,
      usDateFormat,
      true,
    );
    await this.clickElementWithText(
      this.elements.dateDropdownOption,
      usDateFormat,
      true,
    );
  }

  async checkDateFormat() {
    const usDateFormat = 'MM/DD/YYYY';
    await this.elementContainsText(
      this.elements.dateDropdownOption,
      usDateFormat,
      true,
    );
    await this.page.click(this.elements.dateFormatDropdown);
    await this.clickElementWithText(
      this.elements.dateDropdownOption,
      usDateFormat,
      true,
    );
  }

  async checkDepartmentAvailable(isPresent: boolean) {
    const departmentNameLocator = this.elements.departmentLabel.selector(
      baseConfig.citTempData.departmentNameText,
    );
    if (isPresent === true) {
      await this.elementVisible(this.elements.addDepartmentButton);
      await this.elementVisible(departmentNameLocator);
    } else {
      await this.elementVisible(this.elements.addDepartmentButton);
      await this.elementNotVisible(departmentNameLocator);
    }
  }

  async enterText(textToEnter: string) {
    for (const ch of textToEnter) {
      await this.page.fill(this.elements.editDepartmentInput, ch);
    }
  }

  async uploadLogoForOrganization(logoFileName: string) {
    await this.page.setInputFiles(
      this.elements.uploadLogoInput,
      `${resolve(process.cwd())}/src/resources/plc/${logoFileName}`,
    );
  }
}
