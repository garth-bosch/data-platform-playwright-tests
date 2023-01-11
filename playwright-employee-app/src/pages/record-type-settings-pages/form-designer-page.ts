import {expect} from '../../base/base-test';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

let numberFF1;
let numberFF2;
let sumFF: string;
let multiplyFF: string;

export class FormDesignerPage extends BaseCitPage {
  readonly elements = {
    addNewSectionButton: '#custom_panel .btn-naked',
    addSingleEntryButton: '#add-section-single-entry-btn',
    addMultyEntryButton: '#add-section-multi-entry-btn',
    editSectionForm: '#editDefaultSection',
    editSectionHeader: '#restEditSection h4',
    editSectionField: '#editFormSectionLabel',
    editSectionHelpText: '#editFormSectionHelpText',
    editFieldForm: '#editcustomFieldItem',
    showToPublic: 'span label[for="showToPublic"]',
    showToPublicToggle: '#showToPublic',
    autoFill: 'span label[for="formSectionExternalData"]',
    doneEditButton: '.clearfix .btn',
    sectionHeader: 'h4 span',
    sectionLabel: {
      selector: (sectionNameText: string) =>
        `//*[contains(@class,"section-label") and contains(., "${sectionNameText}")]`,
    },
    anyConditionInEditField: {
      selector: (fieldLabel: string) =>
        `//*[@data-test="condition-item" and contains(., "${fieldLabel}")]`,
    },
    conditionInEditField: '(//div[@data-test="condition-item"])[last()]',
    multySectionWatermark: 'h4 small',
    deleteSection: '.hoverActive .formFieldClose',
    addNewFieldButton: '.draggable-object:nth-child(1) .btn-block',
    fieldButtonList: '.text-left',
    fieldDataType:
      '#editcustomFieldItem#editcustomFieldItem div.form-group div',
    requiredField: 'span label[for="fieldRequired"]',
    fieldSectionLabel: '#fieldLabel',
    helpEdit: '#helpText',
    addConditionButton: '#restEditSection .btn-naked',
    addConditionButtonInField: '//button[ contains( ., "Add Condition")]',
    conditionDropdown: '.target-condition-field',
    conditionSelect: 'ul.dropdown-menu-conditions',
    conditionDropdownValueSelect: {
      selector: (condition: string) =>
        `//ul[contains(@class,"dropdown-menu-conditions")]//a[contains(.,'${condition}')]`,
    },
    conditionFormControlValue: '.formSidebar input[type="number"]',
    conditionFirstDropdown: 'ul.dropdown-menu-conditions li:nth-child(1) a',
    selectRenewOption: '#restEditSection div:nth-child(4) option:nth-child(1)',
    selectRenewTrue: '#restEditSection div:nth-child(4) option:nth-child(2)',
    saveConditionButton: '#restEditSection .btn-toolbar .btn-primary',
    saveConditionButtonInFieldCondition:
      '//*[contains(@class, "formSidebar")]//button[contains(text(), "Save")]',
    conditionForm: '.list-group-item .ember-view',
    addConditionFormButton: '.panel-default .form-group .btn-naked',
    matchOperatorConditionForm: '[role="form"] select',
    selectRenewOptionType: '.form-group div:nth-child(4) option:nth-child(1)',
    selectRenewTypeTrue: '.form-group div:nth-child(4) option:nth-child(2)',
    saveConditionTypeButton: '.form-group .btn-toolbar .btn-primary',
    addDateCondition: '#editcustomFieldItem .btn-naked',
    dateConditionSunday: '.btn-group-justified label:nth-child(1)',
    disableDaysOfTheWeek: '.btn-group-justified label',
    dateDisableCondition: '#editcustomFieldItem .glyphicon',
    minOrMaxButton: 'span label[for="customMinMax"]',
    minValueInput: '#minValue',
    maxValueInput: '#maxValue',
    calculatedFieldButton: 'span label[for="isCalculation"]',
    formulaInput: '#formulaBox',
    calculatorIcon: '.fa-calculator',
    searchableButton: 'span label[for="isSearchable"]',
    selectYourOption:
      '//*[contains(@class, "formSidebar")]//select[ option[ contains(text(), "Select your option") ] ]',
    selectYourOptionTrue: 'true',
    selectYourOptionFalse: 'false',
    dropdownOptionNameInput: '#currentDropdownItemName',
    dropdownOptionItem: '.dropdown-option-item',
    editDropdownOption: '.fa-pencil',
    confirmEdit: '.bootbox-accept',
    editDropdownInput: '.panel-body .input-group input',
    saveDropdownEdit: '.input-group-btn .btn:nth-child(1)',
    deleteDropdownOption: '.fa-trash',
    fieldButtonListContainingText: {
      selector: (fieldLabel: string) =>
        `//*[@id="addField"]//button[ h5[contains(., "${fieldLabel}")] ]`,
    },
    formFieldValue: {
      selector: (fieldLabel: string) =>
        `//label[text()='${fieldLabel}']/parent::div/following-sibling::div/div/div`,
    },
    submitRecordButton: '#submit-record',
    fieldTypeOptions: '#addField',
    multiEntryAddNewFieldBtn: '.draggable-object:nth-child(2) .btn-block',
    addFieldSideBar: '.formSidebar',
    formFieldInput: {
      selector: (section: string, fieldLabel: string) =>
        `//span[text()='${section}']//following::label[text()='${fieldLabel}']/following::input[1]`,
    },
    formFieldLabel: {
      selector: (section: string, fieldLabel: string) =>
        `//span[text()='${section}']//following::*[text()='${fieldLabel}']`,
    },
    removeField: {
      selector: (fieldLabel: string, section: string) =>
        // tslint:disable-next-line:max-line-length
        `//span[text()='${section}']//following::label[text()='${fieldLabel}']/../preceding-sibling::div/button[@data-hint='Remove Field']`,
    },
    deactivateBtn: `//button[text()='Deactivate']`,
    addANewField: {
      selector: (sectionName: string) =>
        `//span[text()='${sectionName}']/following::button[contains(string(),'Click to Add a New Field')]`,
    },
    capacityRestrictionLbl: `//label[contains(text(),'Capacity restriction')]`,
    capacityRestrictionToggle: `#hasMaxCapacity + label`,
    capacityRestrictionValue: `#hasMaxCapacity`,
    maximumAllowedAmountLbl: `//label[contains(text(),'Maximum allowed amount')]`,
    maximumAllowedAmountInput: `#fieldMaxCapacity`,
    selectField: {
      selector: (fieldType: string) =>
        `//*[text()='${fieldType}']/parent::button`,
    },
    formFiledID: 'span#formFieldID',
    createdField: {
      selector: (sectionName: string, fieldName: string) =>
        `//span[text()='${sectionName}']//following::label[text()='${fieldName}']/following::input[1]`,
    },
    timeframe: `#fieldCapacityWindowSelector`,
    timeframeOptions: {
      selector: (option: string) =>
        `//select[@id='fieldCapacityWindowSelector']//option[text()='${option}']`,
    },
    formFieldByName: {
      selector: (name: string) =>
        `//*[ contains (@class, "sortableSectionFields")]//*[contains(@class, "sectionField")]//div[contains(., "${name}")]`,
    },
    fileUploadInput: {
      selector: (fieldName) =>
        `//div[label[text()='${fieldName}']]//input[@type='file']`,
    },
    disableDatesCloseButton: {
      selector: (disableDates: string) =>
        `//*[contains(label,"${disableDates}")]/button`,
    },
    disableDatesTextInput: {
      selector: (disableDates: string) =>
        `//*[contains(label,"${disableDates}")]//input`,
    },
    disableDatesSelectDropdown: {
      selector: (disableDays: string, by: string) =>
        `//*[contains(label,"${disableDays}")]//a[contains(.,"${by}")]`,
    },
    disableDatesSelectButton: {
      selector: (disableDays: string) =>
        `//*[contains(label,"${disableDays}")]//button[@data-toggle="dropdown"]`,
    },
    autoFillFormulaList: 'ul.atwho-view-ul li',
    sortableSections: '.sortableSections',
    sortableSectionFields: '.sortableSectionFields .sortableDiv',
  };

  async addSingleEntrySection(sectionName = 'New Custom Section') {
    await this.page.click(this.elements.addNewSectionButton);
    await this.page.click(this.elements.addSingleEntryButton);
    await this.page.fill(this.elements.editSectionField, sectionName);
    await expect(
      this.page.locator(this.elements.editSectionForm),
    ).toBeVisible();
    await this.clickDoneButtonEditRightSidePanel();
    await expect(
      this.page.locator(this.elements.sectionLabel.selector(sectionName)),
    ).toBeVisible();
  }

  async addMultyEntrySection(sectionName = 'New Custom Multi Entry Section') {
    await this.page.click(this.elements.addNewSectionButton);
    await this.page.click(this.elements.addMultyEntryButton);
    await this.page.fill(this.elements.editSectionField, sectionName);
    await expect(
      this.page.locator(this.elements.editSectionForm),
    ).toBeVisible();
    await this.clickDoneButtonEditRightSidePanel();
    await expect(
      this.page.locator(this.elements.sectionLabel.selector(sectionName)),
    ).toBeVisible();
  }

  async validateSectionEdit(name: string = null) {
    const sectionName = name
      ? name
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    const header = 'Edit Section';

    await this.elementContainsText(
      this.elements.editSectionHeader,
      header,
      true,
    );
    await this.page.fill(this.elements.editSectionField, sectionName);

    await this.elementVisible(this.elements.editSectionHelpText);
    await this.elementVisible(this.elements.showToPublic);
    await this.elementVisible(this.elements.autoFill);

    await this.page.click(this.elements.doneEditButton);

    await this.elementContainsText(
      this.elements.sectionHeader,
      sectionName,
      true,
    );
  }

  async clickAddNewField() {
    await this.page.hover(this.elements.addNewFieldButton);
    await this.page.dblclick(this.elements.addNewFieldButton);
  }

  async addField(name: string) {
    try {
      await this.clickElementWithText(this.elements.fieldButtonList, name);
    } catch (e) {
      throw TypeError(`Form field type: '${name}' can not be found.`);
    }

    await this.elementContainsText(this.elements.fieldDataType, name, true);
    await this.elementVisible(this.elements.fieldSectionLabel);

    await this.page.fill(this.elements.fieldSectionLabel, name);
    await this.elementVisible(this.elements.helpEdit);

    await this.page.fill(this.elements.helpEdit, name);
    await this.elementVisible(this.elements.showToPublic);
    await this.elementVisible(this.elements.requiredField);
  }

  async addHelpField(name = 'Help Text') {
    await this.page.click(
      this.elements.fieldButtonListContainingText.selector('Help Text'),
    );
    await this.elementVisible(this.elements.helpEdit);
    await this.page.fill(this.elements.helpEdit, name);
    await this.elementVisible(this.elements.showToPublic);
  }

  async addConditionToSection() {
    await this.page.click(this.elements.addConditionButton);
    await this.page.click(this.elements.conditionDropdown);
    await this.page.click(this.elements.conditionFirstDropdown);
    await this.page.click(this.elements.selectRenewOption);
    await this.page.click(this.elements.selectRenewTrue);
    await this.page.click(this.elements.saveConditionButton);
    await this.elementVisible(this.elements.conditionForm);
  }

  async addConditionToForm() {
    await this.page.click(this.elements.addConditionFormButton);
    await this.page.click(this.elements.conditionDropdown);
    await this.page.click(this.elements.conditionFirstDropdown);
    await this.page.click(this.elements.selectRenewOptionType);
    await this.page.click(this.elements.selectRenewTypeTrue);
    await this.page.click(this.elements.saveConditionTypeButton);
    await this.elementVisible(this.elements.conditionForm);
  }

  async verifyDisableDaysOfTheWeek() {
    const listDays = await this.page.$$(this.elements.disableDaysOfTheWeek);
    listDays.forEach(async (day) =>
      expect(await day.getAttribute('class')).not.toContain('active'),
    );
  }

  async verifyDisablePastFutureDates() {
    await this.page.click('text=Disable future dates');
    await expect(
      this.page.locator(
        this.elements.disableDatesTextInput.selector('Disable Future Dates'),
      ),
    ).toBeVisible();
    await this.page.click(
      this.elements.disableDatesCloseButton.selector('Disable Future Dates'),
    );
    await this.page.click('text=Disable future dates');
    await this.page.fill(
      this.elements.disableDatesTextInput.selector('Disable Future Dates'),
      '2',
    );
    await this.page.click(
      this.elements.disableDatesSelectButton.selector('Disable Future Dates'),
    );
    await this.page.click(
      this.elements.disableDatesSelectDropdown.selector(
        'Disable Future Dates',
        'Months',
      ),
    );
    await this.page.click('text=Disable past dates');
    await expect(
      this.page.locator(
        this.elements.disableDatesTextInput.selector('Disable Previous Dates'),
      ),
    ).toBeVisible();
    await this.page.click(
      this.elements.disableDatesCloseButton.selector('Disable Previous Dates'),
    );
    await this.page.click('text=Disable past dates');
    await this.page.fill(
      this.elements.disableDatesTextInput.selector('Disable Previous Dates'),
      '2',
    );
    await this.page.click(
      this.elements.disableDatesSelectButton.selector('Disable Previous Dates'),
    );
    await this.page.click(
      this.elements.disableDatesSelectDropdown.selector(
        'Disable Previous Dates',
        'Years',
      ),
    );
  }
  async addDateConditionToForm() {
    await this.page.click(this.elements.addDateCondition);
    await this.elementVisible(this.elements.dateConditionSunday);
    await this.page.click(this.elements.dateConditionSunday);
    await this.elementVisible(this.elements.dateDisableCondition);
  }

  async setMinMaxNumber() {
    await this.page.click(this.elements.minOrMaxButton);
    await this.page.fill(this.elements.minValueInput, '10');
    await this.page.fill(this.elements.maxValueInput, '1000');
  }

  async createCalculatedField() {
    const sectionName = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    const field = 'Number';
    await this.page.fill(this.elements.fieldSectionLabel, sectionName);
    await this.clickAddNewField();
    await this.addField(field);
    await this.makeFieldCalculated();
    await this.page.fill(this.elements.formulaInput, `@${this.plcPrefix()}`);
    await this.page.type(this.elements.formulaInput, 'Enter');
    await this.elementVisible(this.elements.calculatorIcon);
  }

  async fillCalculatedFieldValue(input: string) {
    await this.page.type(this.elements.formulaInput, `@${input}`, {delay: 100});
    await this.page.keyboard.press('Enter');
  }

  async makeFieldCalculated() {
    await this.page.click(this.elements.calculatedFieldButton);
    await this.elementVisible(this.elements.formulaInput);
  }

  async makeFieldSearchable() {
    await this.page.click(this.elements.searchableButton);
  }

  async addDropdownOption() {
    await this.page.fill(this.elements.dropdownOptionNameInput, 'YES');
    this.page.type(this.elements.dropdownOptionNameInput, 'Enter');
    await this.elementVisible(this.elements.dropdownOptionItem);
  }

  async editDropdownOption() {
    await this.page.click(this.elements.editDropdownOption);
    await this.page.click(this.elements.confirmEdit);
    await this.page.fill(this.elements.editDropdownInput, 'NO');
    await this.page.click(this.elements.saveDropdownEdit);
  }

  async deleteDropdownOption() {
    await this.elementVisible(this.elements.dropdownOptionItem);
    await this.page.click(this.elements.deleteDropdownOption);
    await this.page.click(this.elements.confirmEdit);
    await expect(
      this.page.locator(this.elements.dropdownOptionItem),
    ).toBeHidden();
  }

  async renameField(name: string) {
    await this.page.fill(this.elements.fieldSectionLabel, name);
    await this.page.click(this.elements.doneEditButton);
  }

  async addNumberField(name: string) {
    await this.clickElementWithText(
      this.elements.fieldButtonList,
      'Number',
      true,
    );
    await this.elementContainsText(this.elements.fieldDataType, 'Number', true);
    await this.elementVisible(this.elements.fieldSectionLabel);
    await this.page.fill(this.elements.fieldSectionLabel, name);
    await this.elementVisible(this.elements.helpEdit);
    await this.page.fill(this.elements.helpEdit, name);
    await this.elementVisible(this.elements.showToPublic);
    await this.elementVisible(this.elements.requiredField);
  }

  async createMultiplicationFormField() {
    numberFF2 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    multiplyFF = `${numberFF2}_mul`;
    await this.saveNumberField(numberFF2, false);
    await this.clickAddNewField();
    await this.saveNumberField(multiplyFF, true);
    await this.setFormulaOnCalculatedField(`@${numberFF2}`, `*100`);
    await this.clickAddNewField();
    await this.page.reload();
    return numberFF2;
  }
  async createSummationFormField() {
    numberFF1 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    sumFF = `${numberFF1}_add`;
    await this.saveNumberField(numberFF1, false);
    await this.clickAddNewField();
    await this.page.reload();
    await this.saveNumberField(sumFF, true);
    await this.setFormulaOnCalculatedField(`@${numberFF1}`, '+ 100');
    return numberFF1;
  }
  async sumCalculatedFormFields() {
    const sumCalcFF = `${sumFF} + ${multiplyFF}`;
    await this.saveNumberField(sumCalcFF, true);
    await this.setFormulaOnCalculatedField(`@${sumFF}`, `+ @${multiplyFF}`);
  }
  async validateFormFieldValue(formFieldLabel: string, value: string) {
    let formFieldData;
    const formFieldElement =
      this.elements.formFieldValue.selector(formFieldLabel);
    await this.page.click(this.elements.submitRecordButton);
    formFieldData = await this.page.locator(formFieldElement).innerText();
    formFieldData = formFieldData.replace(/,/g, '');
    expect(Math.abs(formFieldData)).toEqual(value);
  }

  async saveNumberField(name: string, isCalculatedField: boolean) {
    await this.clickAddNewField();
    await this.addNumberField(name);
    if (isCalculatedField === true) {
      await this.makeFieldCalculated();
    }
    await this.page.click(this.elements.doneEditButton);
  }

  async setFormulaOnCalculatedField(name1: string, name2: string) {
    await this.page.type(this.elements.formulaInput, name1);
    await this.page.keyboard.press('Enter');
    await this.page.type(this.elements.formulaInput, name2);
    await this.page.keyboard.press('Enter');
    await this.elementVisible(this.elements.calculatorIcon, false);
    await this.page.click(this.elements.doneEditButton);
  }

  async addMultiEntryFormField() {
    await this.page.click(this.elements.multiEntryAddNewFieldBtn);
  }

  async addFormField(
    name: string,
    sectionName: string,
    fieldLabel: string = name,
  ) {
    await this.page.click(this.elements.addANewField.selector(sectionName));
    await this.clickElementWithText(this.elements.fieldButtonList, name, true);
    if (name == 'Help Text') {
      await this.page.fill(this.elements.helpEdit, name);
    } else {
      await this.page.fill(this.elements.fieldSectionLabel, fieldLabel);
    }
    await this.page.evaluate(
      () => "document.querySelector('.clearfix button').click();",
    );
    try {
      await expect(this.page.locator(this.elements.editFieldForm)).toBeHidden({
        timeout: 1000,
      });
    } catch (error) {
      await this.page.click(this.elements.doneEditButton);
      await expect(this.page.locator(this.elements.editFieldForm)).toBeHidden();
    }
  }

  async removeFormField(name: string, sectionName: string) {
    this.page.click(this.elements.removeField.selector(name, sectionName));
    this.page.click(this.elements.deactivateBtn);
    await expect(
      this.page.locator(
        this.elements.formFieldInput.selector(sectionName, name),
      ),
    ).toBeHidden();
  }

  async isCapacityRestrictionfieldVisible() {
    await this.elementVisible(this.elements.capacityRestrictionToggle);
    await this.elementVisible(this.elements.capacityRestrictionLbl);
  }

  async toggleCapacityRestriction(expecteToggleValue: string) {
    try {
      await this.page.click(this.elements.capacityRestrictionToggle);
      await expect(
        this.page.locator(this.elements.maximumAllowedAmountInput),
      ).toBeHidden();
    } catch (error) {
      console.log(`Capacity retriction toggle was turned off`);
    }
    if (expecteToggleValue === 'On') {
      await this.page.click(this.elements.capacityRestrictionToggle);
    }
  }

  async isMaximumAllowedAmountFieldVisible(expectedValue: string) {
    const maximumAllowedAmountInput = this.elements.maximumAllowedAmountInput;
    const maximumAllowedAmountLbl = this.elements.maximumAllowedAmountLbl;
    if (expectedValue === 'is') {
      await this.elementVisible(maximumAllowedAmountInput);
      await this.elementVisible(maximumAllowedAmountLbl);
    } else {
      await this.elementNotVisible(maximumAllowedAmountInput);
      await this.elementVisible(maximumAllowedAmountLbl);
    }
  }

  async validateCapacityValuePlaceholderText(expectedText: string) {
    await expect(
      this.page.locator(this.elements.maximumAllowedAmountInput),
    ).toHaveAttribute('placeholder', expectedText);
  }

  async clickOnFormField(fieldLabel: string, sectionName: string) {
    const formFieldInputSelector = this.elements.formFieldInput.selector(
      sectionName,
      fieldLabel,
    );
    const formFieldLabelSelector = this.elements.formFieldLabel.selector(
      sectionName,
      fieldLabel,
    );
    try {
      await this.page.click(formFieldLabelSelector);
    } catch (error) {
      console.log(`Unable to click on form field. Trying one more time..`);
      await this.page.click(formFieldInputSelector);
    }
  }
  async setCapacityValue(value: string) {
    await this.page.fill(this.elements.maximumAllowedAmountInput, value);
  }
  async selecttimeframe(value: string) {
    await this.page.click(this.elements.timeframeOptions.selector(value));
  }

  async selectNewFormField(fieldInfoDataTable: any) {
    const dataTable = fieldInfoDataTable.hashes();
    const fieldType = dataTable[0].FIELD_TYPE;
    const fieldLabel = dataTable[0].FILED_LABEL;
    await this.page.click(this.elements.selectField.selector(fieldType));

    await this.page.fill(this.elements.fieldSectionLabel, fieldLabel);
  }
  async getFormFiledId(fieldInfoDataTable: any) {
    const dataTable = fieldInfoDataTable.hashes();
    const sectionName = dataTable[0].SECTION_NAME;
    const fieldName = dataTable[0].FILED_LABEL;
    await this.getFormFieldIdValue(sectionName, fieldName);
  }

  async getFormFieldIdValue(fieldName: string, sectionName: string) {
    await this.page.click(
      this.elements.formFieldLabel.selector(sectionName, fieldName),
    );
    const ffId = await this.page.locator(this.elements.formFiledID).innerText();
    baseConfig.citTempData.formFieldId = ffId;
  }

  async clickOnDone() {
    await this.page.click(this.elements.doneEditButton);
    await this.elementNotVisible(this.elements.doneEditButton);
  }

  async saveCapacityRestrictionSettings(capacityRestrictionValues: any) {
    const dataTable = capacityRestrictionValues.hashes();
    const capacityValue = dataTable[0].CAPACITY_VALUE;
    const timeframe = dataTable[0].CAPACITY_VALUE_PER;
    await this.setCapacityValue(capacityValue);
    await this.selecttimeframe(timeframe);
    await this.clickOnDone();
  }

  async haveCapacityRestrictionSettingsSaved(
    capacityRestrictionValues: any,
    shouldSave: string,
  ) {
    const dataTable = capacityRestrictionValues.hashes();
    const sectionName = dataTable[0].SECTION_NAME;
    const fieldName = dataTable[0].FILED_LABEL;
    const capacityValue = dataTable[0].CAPACITY_VALUE;
    const timeframe = dataTable[0].CAPACITY_VALUE_PER;
    await this.clickOnFormField(fieldName, sectionName);
    if (shouldSave === 'can') {
      await this.validateCapacityValueSaved(capacityValue);
      await this.validatetimeframeSaved(timeframe);
    } else {
      await this.elementNotVisible(this.elements.maximumAllowedAmountInput);
    }
  }
  async validateCapacityValueSaved(expectedValue: string) {
    await expect(
      this.page.locator(this.elements.maximumAllowedAmountInput),
    ).toHaveAttribute('value', expectedValue);
  }

  async validatetimeframeSaved(expectedValue: string) {
    await expect(this.page.locator(this.elements.timeframe)).toHaveAttribute(
      'value',
      expectedValue,
    );
  }

  async toggleShowToPublic(expecteToggleValue: string) {
    const isChecked = await this.page.getAttribute(
      this.elements.showToPublicToggle,
      'checked',
    );
    //By default, Show to public is set to enable. Hence, making it off then turned on to make sure toggle work.
    if (isChecked) {
      await this.page.click(this.elements.showToPublicToggle);
      await expect(
        this.page.locator(this.elements.showToPublicToggle),
      ).toHaveAttribute('checked', 'false');
    }
    if (expecteToggleValue === 'On') {
      await this.page.click(this.elements.showToPublicToggle);
      await expect(
        this.page.locator(this.elements.showToPublicToggle),
      ).toHaveAttribute('checked', 'true');
    }
  }
  async isShowToPublicFieldDisabled() {
    expect(
      this.page
        .locator(this.elements.showToPublicToggle)
        .getAttribute('disabled'),
    ).not.toBeNull();
  }
  async clickDoneButtonEditRightSidePanel() {
    await this.page.click(this.elements.doneEditButton);
  }

  async clickOnSpecificFormField(name: string) {
    await this.page.click(this.elements.formFieldByName.selector(name));
  }

  async verifyConditionPresent(name = 'When Record is being renewed') {
    expect(
      await this.page.locator(this.elements.conditionInEditField).innerText(),
    ).toContain(name);
  }
  /*  Use addCondition method to Add Condition on Form Section and Form Fields */
  async addCondition(
    condition: string,
    value: string,
    conditionType?: string,
    conditionTypeValue?: string,
  ) {
    await this.page.click(this.elements.addConditionButtonInField);
    await this.page.click(this.elements.conditionDropdown);
    await this.page
      .locator(this.elements.conditionDropdownValueSelect.selector(condition))
      .click();
    await this.page.click(this.elements.selectYourOption);
    await this.page
      .locator(this.elements.selectYourOption)
      .selectOption({label: value});
    if (conditionType === 'number') {
      await this.page.fill(
        this.elements.conditionFormControlValue,
        conditionTypeValue,
      );
    }
    await this.page.click(this.elements.saveConditionButtonInFieldCondition);
  }

  async clickOnSpecificSection(sectionName: string) {
    await this.page.click(this.elements.sectionLabel.selector(sectionName));
  }

  async selectMatchOperatorInConditionForm(matchOperator: string) {
    await Promise.all([
      // waiting till background api is completed
      this.page.waitForResponse((response) => response.status() === 200),
      await this.page
        .locator(this.elements.matchOperatorConditionForm)
        .selectOption({label: matchOperator}),
    ]);
  }

  async getFormFieldOrder(sectionName?: string) {
    const sectionElement = sectionName
      ? this.page.locator(this.elements.sortableSections, {
          hasText: sectionName,
        })
      : this.page.locator(this.elements.sortableSections);
    const sortableSectionFieldElements = sectionElement.locator(
      this.elements.sortableSectionFields,
    );
    await sortableSectionFieldElements.last().waitFor({state: 'visible'});
    return (await sortableSectionFieldElements.allInnerTexts()).map((value) => {
      return value.replace(/×\s*Remove\s*/, '');
    });
  }

  async fillCalculatedFormulaOnFieldValue(
    input1: string,
    input2: string,
    operator: string,
  ) {
    await this.page.type(this.elements.formulaInput, `@${input1}`, {
      delay: 100,
    });
    await this.page.keyboard.press('Enter');
    await this.page.type(this.elements.formulaInput, ` ${operator} `, {
      delay: 1000,
    });
    await this.page.type(this.elements.formulaInput, `@${input2}`, {
      delay: 100,
    });
    await this.page.keyboard.press('Enter');
  }
}
export enum CapacityPerValue {
  'Day' = '1',
  'Calendar week' = '2',
  'Calendar month' = '3',
  'Calendar quarter' = '4',
  'Calendar year' = '5',
}
