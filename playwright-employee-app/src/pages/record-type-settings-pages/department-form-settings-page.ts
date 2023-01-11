import {expect} from '../../base/base-test';
import {faker} from '@faker-js/faker';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class DepartmentFormSettings extends BaseCitPage {
  readonly elements = {
    dffAddButton: '#add-department-formfield-btn',
    addDFFInputName: '#addDepartmentFormFieldLabel',
    typeSelection: '#departmentFormFieldFieldTypeSelection',
    typeItem: '.dropdownItem',
    createDFF: '.modal-footer .btn-primary',
    filterInput: '.input-group #search-todo',
    dffListElement: 'tbody tr td:nth-child(1) a',
    dffListType: 'tbody tr td:nth-child(3) ',
    addFieldButton: '.container .btn-primary',
    addFieldInput: '#linkableFormFields_textBox',
    resultRow: '.resultRow:nth-child(1) h5',
    fieldList: 'tbody tr td:nth-child(1)',
    deleteField: '.svg-trash',
    confirmDelete: '.bootbox-accept',
    editField: '.svg-pencil',
    editFieldInput: '.edit',
    saveEditButton: 'td .btn-primary',
    secondFieldElement: 'tbody tr:nth-child(2) td:nth-child(1)',
  };

  async createDFF(recordTypeName: string, name: string = null) {
    const record = name
      ? name
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(3)}`;

    await this.page.click(this.elements.dffAddButton);
    await this.page.fill(this.elements.addDFFInputName, record);
    await this.page.click(this.elements.typeSelection);
    await this.clickElementWithText(this.elements.typeItem, recordTypeName);
    await this.page.click(this.elements.createDFF);
    await this.validateNewDFF(record);
  }

  async validateNewDFF(name: string) {
    await this.page.fill(this.elements.filterInput, name);
    await this.elementContainsText(this.elements.dffListElement, name, true);
  }

  async addField(name: string = null) {
    const field = name ? name : 'New Field';

    await this.page.click(this.elements.dffListElement);
    await this.page.click(this.elements.addFieldButton);
    await this.page.fill(this.elements.addFieldInput, field);
    await this.page.click(this.elements.resultRow);
    await this.elementContainsText(this.elements.fieldList, field, true);
  }

  async deleteField(name: string) {
    await expect(this.page.locator(this.elements.fieldList)).toBeVisible();
    await this.page.click(this.elements.deleteField);
    await expect(
      this.page.locator(this.elements.fieldList, {hasText: name}),
    ).toBeHidden();
  }

  async deleteDFF(name: string) {
    await expect(this.page.locator(this.elements.dffListElement)).toBeVisible();
    await this.page.click(this.elements.deleteField);
    await this.page.click(this.elements.confirmDelete);
    await expect(
      this.page.locator(this.elements.dffListElement, {hasText: name}),
    ).toBeHidden();
  }

  async editDFF() {
    const name = `${this.plcPrefix()}_${faker.random.alphaNumeric(3)}`;
    await expect(this.page.locator(this.elements.dffListElement)).toBeVisible();
    await this.page.click(this.elements.editField);
    await this.page.fill(this.elements.editFieldInput, name);
    await this.page.click(this.elements.saveEditButton);
    await this.elementContainsText(this.elements.dffListElement, name, true);
  }

  async addSecondField() {
    const name = 'New Field';
    await this.page.click(this.elements.addFieldButton);
    await this.page.fill(this.elements.addFieldInput, name);
    await this.page.click(this.elements.resultRow);
    await this.elementContainsText(
      this.elements.secondFieldElement,
      name,
      true,
    );
  }

  async addNotField(fieldName: string) {
    await this.page.click(this.elements.dffListElement);
    await this.page.click(this.elements.addFieldButton);
    await this.page.fill(this.elements.addFieldInput, fieldName);
    await expect(this.page.locator(this.elements.resultRow)).toBeHidden();
  }
}
