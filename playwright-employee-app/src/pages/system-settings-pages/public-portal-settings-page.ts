import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../base/base-test';
import {faker} from '@faker-js/faker';

export class PublicPortalSettingsPage extends BaseCitPage {
  readonly elements = {
    publicPortalButton: '#settings-public-portal-link',
    sectionButton: '.media-heading',
    clickPhoto: 'div:nth-child(5) > div > p',
    pageLoader: '.container',
    firstDepartmentToggleOff:
      '.panel-body > div > div > div:nth-child(1) .bootstrap-switch-off',
    firstDepartmentToggleOn:
      '.panel-body > div > div > div:nth-child(1) .bootstrap-switch-on',
    firstDepHeader:
      '.panel-body > div > div > div:nth-child(1) .category-tile-heading a',
    coverTitle: '.clearfix p',
    helpTextP: '.fr-view p',
    viewHtmlButton: '#html-1',
    saveHelpText: '.btn.btn-primary',
    addNewTemplate: '.container .pull-right .btn',
    newTemplateName: '#new_project_template_label',
    confirmButton: '.modal-footer .btn-primary',
    templateTitle: '.media-body h5',
    templateEditName: '.clearfix .col-sm-24 input',
    templateHeader: '.container > div > h3',
    addQuestion: 'div:nth-child(12) > div.col-sm-18 > a > span',
    addQuestionInput: '#add_new_question_body',
    saveQuestion: '.btn-group-sm .btn-primary',
    questionAnswer: '.radio input',
    projectOptionButton: '.fa-ellipsis-v',
    deleteButton: 'ul .text-danger',
    confirmDelete: '.bootbox-accept',
    locationOn:
      '.container > .bs-switch > div > div > .bootstrap-switch-handle-on',
    locationOff:
      '.container > .bs-switch > div > div > .bootstrap-switch-handle-off',
    firstCheckboxForVisibility: 'tr > td input',
    filterInput: '#searchRecordType',
    firstReportHeader: 'tbody > tr:nth-child(2) > td label .ember-view',
    searchableRT: {
      selector: (recordType: string) => `//a[text()='${recordType}']`,
    },
    selectDepartment: {
      selector: (departmentName: string) =>
        `//h5[@class='category-tile-heading']/a[text()='${departmentName}']`,
    },
    toggleOFFSwitch: {
      selector: (name: string) =>
        `(//a[text()='${name}']/following::div[contains(@class,'bootstrap-switch-on')])[1]`,
    },
    toggleONSwitch: {
      selector: (name: string) =>
        `(//a[text()='${name}']/following::div[contains(@class,'bootstrap-switch-off')])[1]`,
    },
    frame: 'iframe.fr-iframe',
    //div [ h4[contains(text(),'Public Record Search')] ]//div[contains(@class, "bootstrap-switch-off")]//input[@type="checkbox"]
    publicLocationsSearchTitle: `//div [ h4[contains(text(),'Public Location Search')] ]`,
    searchToggleBtnStatus: {
      selector: (
        searchType: 'Public Location Search' | 'Public Record Search',
        searchStatus: 'on' | 'off',
      ) =>
        `//div [ h4[contains(text(),'${searchType}')] and div/div[contains(@class, "bootstrap-switch-${searchStatus}")] and //input[@type="checkbox"] ]`,
    },
    searchToggleBtn: {
      selector: (
        searchType: 'Public Location Search' | 'Public Record Search',
      ) =>
        `//div [ h4[contains(text(),'${searchType}')] ] //div[ contains(@class, "bootstrap-switch-animate")]`,
    },
    projectTemplateToggle: {
      selector: (templateName: string) =>
        `(//h5[text()='${templateName}']/following::div[contains(@class,'bootstrap-switch-small')])[1]`,
    },
    activeSubmenu: '.submenu-margin .breadcrumb a.active',
    addRecordType: {
      selector: (addChecklist: string) =>
        `//a[normalize-space()='${addChecklist}']`,
    },
    ckecklistPanel: '.checklist-panel',
    selectRecordTypeDropdown: '#add_project_component',
    recordTypesList: {
      selector: (departmentName: string) =>
        `#add_project_component optgroup[label='${departmentName}'] option`,
    },
    saveRecordTypeBtn: '.flex-justify-end .btn-primary',
    recordTypePanel: '.panel-body',
    addConditionToRecordType: '.panel-body > p',
    saveChecklistConditionBtn: '.pull-right .btn-primary',
    removeRecordType: '.panel-body small a',
    searchBtn: '.nav.navbar-nav li:nth-child(2) a',
    recordTab: '#record-tab',
    inputRecordID: '#recordSearchKey',
    searchedRecord: '.list-group a',
  };

  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}/#/inbox/active`);
  }

  async awaitPublicSearchSection() {
    await this.page
      .locator(this.elements.publicLocationsSearchTitle)
      .waitFor({state: 'visible'});
  }
  async proceedToPortalSection(section: string) {
    await this.page.click(this.elements.publicPortalButton);
    await this.clickElementWithText(this.elements.sectionButton, section);
  }

  async validateCoverPhotoSettings() {
    const photoText = 'Click the photo or text to change';
    await this.elementContainsText(this.elements.clickPhoto, photoText, true);
  }

  async checkAndChangeDepartmentPresence(on: boolean) {
    if (on) {
      await this.elementVisible(this.elements.firstDepartmentToggleOn);
      await this.elementNotVisible(this.elements.firstDepartmentToggleOff);
      await this.page.click(this.elements.firstDepartmentToggleOn);
      await this.elementVisible(this.elements.firstDepartmentToggleOff);
      await this.elementNotVisible(this.elements.firstDepartmentToggleOn);
    } else {
      await this.elementVisible(this.elements.firstDepartmentToggleOff);
      await this.elementNotVisible(this.elements.firstDepartmentToggleOn);

      await this.page.click(this.elements.firstDepartmentToggleOff);
      await this.elementVisible(this.elements.firstDepartmentToggleOn);
      await this.elementNotVisible(this.elements.firstDepartmentToggleOff);
    }
  }

  async proceedToFirstDepartment() {
    baseConfig.citTempData.departmentNameText = await this.page
      .locator(this.elements.firstDepHeader)
      .innerText();
    await this.page.click(this.elements.firstDepHeader);
  }

  async checkDeptCover() {
    const title = 'Photos should be 1200x200 or larger for best performance.';
    await this.elementContainsText(this.elements.coverTitle, title, true);
  }

  async changeHelpText(text: string) {
    const elementFrame = this.page.frame(this.elements.frame);
    await elementFrame.fill(this.elements.helpTextP, '');
    await this.page.click(this.elements.viewHtmlButton);
    await this.page.keyboard.press('Enter');
    await elementFrame.fill(this.elements.helpTextP, text);
    await this.page.click(this.elements.viewHtmlButton);
    await this.clickElementWithText(this.elements.saveHelpText, 'Save Changes');
  }

  async validateHelpText(text: string) {
    const elementFrame = this.page.frame(this.elements.frame);
    const textContent = await elementFrame
      .locator(this.elements.helpTextP)
      .innerText();
    expect(textContent).toContain(text);
  }

  async addTemplate(name: string = null) {
    const text = name
      ? name
      : `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;

    await this.page.click(this.elements.addNewTemplate);
    await this.page.fill(this.elements.newTemplateName, text);
    await this.page.click(this.elements.confirmButton);
    await expect(
      this.page.locator(this.elements.templateTitle, {hasText: text}),
    ).toBeVisible();
    baseConfig.citTempData.projectTemplateName = text;
  }

  async editTemplate() {
    const text = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    const text2 = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.addTemplate(text);
    await this.clickElementWithText(this.elements.templateTitle, text);
    await this.page.fill(this.elements.templateEditName, text2);
    await this.elementContainsText(this.elements.templateHeader, text2, true);
    baseConfig.citTempData.projectTemplateName = text2;
  }

  async proceedToTemplate(text: string = null) {
    const templateName = text
      ? text
      : baseConfig.citTempData.projectTemplateName;
    await this.clickElementWithText(this.elements.templateTitle, templateName);
  }

  async addQuestion() {
    await this.page.click(this.elements.addQuestion);
    await this.page.fill(this.elements.addQuestionInput, 'To do?');
    await this.page.click(this.elements.saveQuestion);
    await expect(this.page.locator(this.elements.questionAnswer)).toHaveCount(
      2,
    );
  }

  async deleteProject() {
    await this.page.click(this.elements.projectOptionButton);
    await this.page.click(this.elements.deleteButton);
    await this.page.click(this.elements.confirmDelete);
  }

  async checkAndChangeLocationPresence(on: boolean) {
    if (on) {
      await this.elementVisible(this.elements.locationOn);
      await this.page.click(this.elements.locationOn);
      await this.elementVisible(this.elements.locationOff);
      await this.elementNotVisible(this.elements.locationOn);
    } else {
      await this.elementVisible(this.elements.locationOff);
      await this.page.click(this.elements.locationOff);
      await this.elementVisible(this.elements.locationOn);
      await this.elementNotVisible(this.elements.locationOff);
    }
  }

  async switchRecordType(
    toggle: string,
    recordType: string,
    department: string,
  ) {
    await this.page.click(this.elements.selectDepartment.selector(department));
    if (toggle === 'ON') {
      await this.page.click(this.elements.toggleONSwitch.selector(recordType));
    } else if (toggle === 'OFF') {
      await this.page.click(this.elements.toggleOFFSwitch.selector(recordType));
    }
  }

  async allowPublicSearch(
    searchStatus: 'on' | 'off',
    searchType: 'Public Location Search' | 'Public Record Search',
  ) {
    let searchOnOrOff = await this.page.isVisible(
      this.elements.searchToggleBtnStatus.selector(searchType, searchStatus),
    );
    if (!searchOnOrOff) {
      await this.page.click(this.elements.searchToggleBtn.selector(searchType));
    }
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
    await this.awaitPublicSearchSection();
    searchOnOrOff = await this.page.isVisible(
      this.elements.searchToggleBtnStatus.selector(searchType, searchStatus),
    );
    expect(searchOnOrOff).toBeTruthy();
  }

  async allowProjectTemplateVisibility(isVisibility: string) {
    const templateName = baseConfig.citTempData.projectTemplateName;
    const text = await this.page.getAttribute(
      this.elements.projectTemplateToggle.selector(templateName),
      'class',
    );
    if (
      (!text.includes('switch-on') && isVisibility === 'ON') ||
      (!text.includes('switch-off') && isVisibility === 'OFF')
    ) {
      console.info('text.value is : ', text);
      this.page.click(
        this.elements.projectTemplateToggle.selector(templateName),
      );
    }
  }

  async navigateBackToProjects() {
    await this.page.click(this.elements.activeSubmenu);
  }

  async searchableRecordTypeVisibility(isEnabled: boolean, recordType: string) {
    await this.page.fill(this.elements.filterInput, recordType);

    const result = await this.page.getAttribute(
      this.elements.firstCheckboxForVisibility,
      'checked',
    );
    console.info('result.value is: ', result);
    if ((!result && isEnabled) || (result && !isEnabled))
      this.page.click(this.elements.firstCheckboxForVisibility);
  }

  async addRecordTypeToTemplate(recordType: string, departmentName: string) {
    const dropdownSelector =
      this.elements.recordTypesList.selector(departmentName);
    await this.page.click(
      this.elements.addRecordType.selector('Add record type'),
    );
    await this.page.click(this.elements.selectRecordTypeDropdown);
    const value = await this.page
      .locator(dropdownSelector, {hasText: recordType})
      .getAttribute('value');
    await this.page.evaluate(
      `document.querySelector("[value='${value}']").selected='selected'`,
    );
    await this.page.click(this.elements.saveRecordTypeBtn);
    await expect(
      await this.page.locator(this.elements.recordTypePanel, {
        hasText: recordType,
      }),
    ).toBeVisible();
  }

  async removeRecordType() {
    await this.page.click(this.elements.removeRecordType);
    await this.page.click(this.elements.confirmDelete);
    await this.elementNotVisible(this.elements.recordTypePanel);
  }

  async searchRecord(recordVisibility: string, recordType: string) {
    await this.page.click(this.elements.searchBtn);
    await this.page.click(this.elements.recordTab);
    await this.page.fill(
      this.elements.inputRecordID,
      baseConfig.citTempData.recordName,
    );
    if (recordVisibility === 'can') {
      await this.clickElementWithText(
        this.elements.searchedRecord,
        'Record ' + `${baseConfig.citTempData.recordName}` + ` ${recordType}`,
      );
    } else {
      await this.elementNotVisible(this.elements.searchedRecord);
    }
  }
}
