import {faker} from '@faker-js/faker';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '../../base/base-test';

type conditionFlag = 'Location Flag' | 'User Flag';
let stepPrefix: string;

export const workflowStepTypes = [
  'Approval',
  'Payment',
  'Inspection',
  'Document',
  'API Integration',
] as const;
type StepType = typeof workflowStepTypes[number];

export class WorkflowDesignerPage extends BaseCitPage {
  readonly elements = {
    addNewStepButton: '#workflow-add-new-step',
    addNewConditionButton: '//a[contains(text(),"Add Condition")]',
    addStepConditionButton:
      '//div[@class="modal-dialog"]//button[contains(text(),"Add")]',
    workflowSideBar: '.workflowSidebar',
    addStepName: '.workflowSidebar h5 span',
    editStepLayout: '#editStep',
    editHelpText: 'label[for="helpText"]',
    editAssignment: 'label[for="stepAssignment"]',
    editCondition: '#editStep a',
    assignToTextBox: '#assignto_textBox',
    assignToListDropDown: {
      selector: (userEmail: string) =>
        `//*[contains(@class, "resultRow")]//small[contains(.,"${userEmail}")]`,
    },
    userAutoAssignedAddCondition: {
      selector: (userText: string) =>
        `//div[contains(@class,"list-group-item") and span[contains(.,"${userText}")] ]//a`,
    },
    chooseConditionField: '//a[contains(.,"Choose field.")]',
    clickConditionField: {
      selector: (flagText: conditionFlag = 'Location Flag') =>
        `//a[contains(@class, "formFieldSelect")]//strong[contains(., "${flagText}")]`,
    },
    conditionFlagSelect: `//select[@class="form-control" and option[ contains(.,"Select ...")] ]`,
    conditionValueInput: 'input#newWSICValue',
    conditionSelector: '#newWSICLogicSelector',
    conditionSelect: `//select[@class="form-control" and option[ contains(.,"Select your option")] ]`,
    conditionSelectOptionValue: {
      selector: (optionValue: string) =>
        `//select[@class="form-control" and option[ contains(.,"Select your option")] ]/option[@value= "${optionValue}"]`,
    },
    conditionExists: `[data-test="condition-item"]`,
    stepSequentLabel: '#editStep div:nth-child(2) div:nth-child(3) select',
    optionWithDropdown:
      '#editStep div:nth-child(2) div:nth-child(3) select option:nth-child(1)',
    optionParallel:
      '#editStep div:nth-child(2) div:nth-child(3) select option:nth-child(2)',
    doneButton: '.clearfix button',
    stepNameInput: 'input[name="label"]',
    stepNamesList: {
      selector: (workflowStepName: string) =>
        `//*[contains(@class, "panel-primary") or contains(@class, "panel-default") and contains (., "${workflowStepName}") ]`,
    },
    stepLabel: '#editStep > div:nth-child(1)',
    followersInput: '#followers_textBox',
    folloerResult: 'div:nth-child(1) > div > div.media-body',
    notifierLabel: `//div[div[@id='followers_container']]/following-sibling::div/span`, // changed: ensure we have a strict option or we write correct selectors
    approvalFollowerInput: '#assignto_container input',
    approvalFollowerLabel: '#editStep .list-group-item span',
    addFeeButton: '#editStep div:nth-child(2) div:nth-child(2) select',
    addFeeOption:
      '#editStep div:nth-child(2) div:nth-child(2) select option:nth-child(3)',
    confirmFee: '#editStep div:nth-child(2)  div:nth-child(2) button',
    deleteFeeButton: '.fa-trash',
    feeIncluded: '.form-group .pointer',
    confirmDelete: '.bootbox-accept',
    inspectionPreloadInput: '#inspectionType_textBox',
    preloadInspectionOption: '.resultRow .media-heading',
    inspectionIncluded: '.panel-body p',
    deleteInspectionButton: '#editStep .panel-body .close',
    docPreloadInput: '#document_textBox',
    docIncluded: 'label[for="docTitle"]',
    allowPrintLabel: 'label[for="publicCanPrint"]',
    allowPrintCheckBox: '.switch-square input[type="checkbox"]',
    expireDocCheckBox: '#editStep div:nth-child(2) > span > span > label',
    expireLogic: '#expirationLogicSelector',
    expireDays: '#expiresAfterAmount',
    expireUnit: '#expiresAfterUnit',
    dueDateSwitcher: '.bs-switch .bootstrap-switch-handle-off',
    deadlineDate: '#deadline-days-input',
    deadlineSequent: '#select-deadline-type-dropdown',
    autocompliteHeader: '.help-block:nth-child(3) > div',
    alertHeader: '.help-block:nth-child(5) > div',
    workflowSteps: {
      selector: (workflowStep: string) =>
        `//h4[contains(normalize-space(),'${workflowStep}')]/button/i`,
    },
    deleteStepButtons: {
      selector: (workflowStep: string) =>
        `//*[contains(@class, 'sortable-item') and .//*[text()='${workflowStep}']]//*[contains(@class,'svg-trash')]`,
    },
    dueDateOn:
      '//h5[contains(.,"Due Date Settings")]/..//span[@class="bootstrap-switch-label"]',
    automationCompleteOndueDateToggle: `//*[contains(.,"automatically complete on due date")]/../following::span[@class="bootstrap-switch-label"][1]`,
    dueDateInput: '#deadline-days-input',
    stepDeadlineDropdown: '#select-deadline-type-dropdown',
    dueDateDoneButton: '//button[normalize-space()="Done"]',
    urlErrorMessage: '[data-fv-for="url"]',
    postURLInputBox: '[name="url"]',
    requestBodyErrorMessage: '[data-fv-for="requestBody"]',
    inputUrl: '[name="url"]',
    requestBody: '#request-body',
    apiStepSequentLabel: '//select[@class="form-control"]',
    apiOptionWithDropdown:
      '//option[contains(text(), "After the previous step")]',
    apiIntegrationstepNameInput: 'input[name="stepName"]',
    apiStepOptionParallel:
      '//option[contains(text(), "With the previous step")]',
    viewDataMergeTags: 'a[data-merge-tag-modal="true"]',
    mergeTagSelector: '.modal-body',
    mergeTagsCloseButton: '.modal-header button.close',
    mergeTagSectionLabel: '.modal-body h4',
    mergeTagText: '.merge-tag-li',
    formFieldMergeTag: '.modal-body ul li ul li',
    dueDateSettingsToggle: '.step-deadline-settings .bs-switch > div',
    dueDateDropdown: '#select-deadline-type-dropdown',
  };

  async changeStepName(stepName: string, stepType?: StepType) {
    if (stepType === 'API Integration') {
      await this.page.fill(this.elements.apiIntegrationstepNameInput, stepName);
    } else {
      await this.page.fill(this.elements.stepNameInput, stepName);
    }
  }

  async clickStepByName(stepName: string) {
    await this.page.click(this.elements.stepNamesList.selector(stepName));
    await this.elementVisible(this.elements.workflowSideBar);
  }

  async clickEditCondition() {
    await this.page.click(this.elements.editCondition);
  }

  async selectConditionValueToUser(value?: string, index = 2) {
    const selector = await this.page.$(this.elements.conditionSelect);
    await this.page.waitForTimeout(300); // flaky
    if (value) {
      await this.page.click(this.elements.conditionSelect);
      await selector.selectOption(value);
    } else {
      await selector.selectOption({index: index});
    }
  }

  async addConditionToUser(
    userText: string,
    conditionFlag: conditionFlag = 'Location Flag',
  ) {
    await this.page.click(
      this.elements.userAutoAssignedAddCondition.selector(userText),
    );
    await this.page.click(this.elements.chooseConditionField);
    await this.page.click(
      this.elements.clickConditionField.selector(conditionFlag),
    );
  }

  async addUserToAutoAssign(userEmail: string) {
    await this.page.fill(this.elements.assignToTextBox, userEmail);
    await this.page.click(
      this.elements.assignToListDropDown.selector(userEmail),
    );
  }

  async clickDoneButton() {
    await this.page.click(this.elements.doneButton);
  }

  async checkConditionExists() {
    await expect(
      this.page.locator(this.elements.conditionExists),
    ).toBeVisible();
  }

  async addConditionToAutoAssignUser(
    userEmail: string,
    userText: string,
    conditionFlag: conditionFlag,
    value?: string,
  ) {
    await this.addUserToAutoAssign(userEmail);
    await this.addConditionToUser(userText, conditionFlag);
    await this.selectConditionValueToUser(value);
    await this.clickDoneButton();
  }

  async addNewStep(stepName: StepType) {
    const workflowStep = `add-${stepName.toLowerCase()}-step`;
    await this.page.click(this.elements.addNewStepButton);
    await this.elementVisible(this.elements.workflowSideBar);
    await this.page.evaluate(
      () => `document.getElementById("${workflowStep}").click()`,
    );
  }

  async validateNewStep(stepName: string) {
    await this.elementVisible(this.elements.editStepLayout);
    await this.elementContainsText(this.elements.editHelpText, 'Help Text');
    await this.elementContainsText(this.elements.stepLabel, stepName);
    await this.elementContainsText(
      this.elements.editCondition,
      'Add Condition',
    );
  }

  /* deprecate and copy from renewal ? better code ? and does not work */
  async addStepWithName(stepType: StepType, stepName: string) {
    const generatedStepName = this.generateStepName(stepName);
    const workflowStep = `add-${stepType.toLowerCase()}-step`;
    await this.page.click(this.elements.addNewStepButton);
    await this.elementVisible(this.elements.workflowSideBar);
    await this.page.evaluate(
      () => `document.getElementById("${workflowStep}").click()`,
    );
    await this.changeStepName(generatedStepName, stepType);
    baseConfig.citTempData.createdRecordStepName = generatedStepName;
    await this.clickStepByName(generatedStepName);
  }

  /* deprecate and copy from renewal ? better code ? and does not work */
  async setSequentStep() {
    const text = 'With the previous step';
    const name = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.changeStepName(name);
    await this.page.click(this.elements.stepSequentLabel);
    await this.elementContainsText(this.elements.optionWithDropdown, text);
    await this.page.click(this.elements.optionWithDropdown);
    await this.clickDoneButton();
    await this.clickStepByName(name);
    await this.elementContainsText(this.elements.stepSequentLabel, text);
  }

  /* deprecate and copy from renewal ? better code ? and does not work */
  async setParallelStep() {
    const text = 'After the previous step';
    const text1 = 'With the previous step';
    const name = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.changeStepName(name);
    await this.page.click(this.elements.stepSequentLabel);
    await this.elementContainsText(this.elements.optionParallel, text);
    await this.page.click(this.elements.optionParallel);
    await this.clickDoneButton();
    await this.clickStepByName(name);
    await this.elementContainsText(this.elements.stepSequentLabel, text1);
  }

  async addNotifier(name: string) {
    await this.page.fill(this.elements.followersInput, name);
    await this.page.click(this.elements.folloerResult);
    await this.elementContainsText(this.elements.notifierLabel, 'API');
  }

  async addNotifierApproval(name: string) {
    await this.page.fill(this.elements.approvalFollowerInput, name);
    await this.page.click(this.elements.folloerResult);
    await this.elementContainsText(this.elements.approvalFollowerLabel, 'API');
  }

  async addFee() {
    await this.page.click(this.elements.addFeeButton);
    await this.page.click(this.elements.addFeeOption);
    await this.elementVisible(this.elements.confirmFee);
    await this.page.evaluate(
      () =>
        `document.querySelector('#editStep div.row .btn.btn-primary').click()`,
    );
    await this.elementVisible(this.elements.feeIncluded);
  }

  async removeFee() {
    await this.page.click(this.elements.deleteFeeButton);
    await this.page.click(this.elements.confirmDelete);
    await this.elementNotVisible(this.elements.feeIncluded);
  }

  async preloadInspection(name: string) {
    await this.page.fill(this.elements.inspectionPreloadInput, name);
    await this.page.click(this.elements.preloadInspectionOption);
    await this.elementVisible(this.elements.inspectionIncluded);
  }

  async deleteInspection() {
    await this.page.click(this.elements.deleteInspectionButton);
    await this.elementNotVisible(this.elements.feeIncluded);
  }

  async preloadDocument(name: string) {
    await this.page.fill(this.elements.docPreloadInput, name);
    await this.page.click(this.elements.preloadInspectionOption);
    await this.elementVisible(this.elements.docIncluded);
  }

  async checkPrintAtHome() {
    const text = 'Allow Print-at-Home';
    await this.elementContainsText(this.elements.allowPrintLabel, text);
    await this.page.click(this.elements.allowPrintLabel);
  }

  async expireDocument() {
    const name = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.changeStepName(name);
    await this.elementVisible(this.elements.expireDocCheckBox);
    await this.page.click(this.elements.expireDocCheckBox);
    await this.elementVisible(this.elements.expireLogic);
    await this.page.fill(this.elements.expireDays, '3');
    await this.elementVisible(this.elements.expireUnit);
    await this.elementVisible(this.elements.docIncluded);
    await this.clickDoneButton();
    await this.clickStepByName(name);
    await this.elementVisible(this.elements.stepSequentLabel);
    await this.elementVisible(this.elements.expireDays);
  }

  async addDeadline() {
    const text1 = `automatically complete on due date`;
    const text2 = `Schedule alerts for due dates`;
    const name = `${this.plcPrefix()}${faker.random.alphaNumeric(4)}`;
    await this.changeStepName(name);
    await this.page.click(this.elements.dueDateSwitcher);
    await this.page.fill(this.elements.deadlineDate, '5');
    await this.elementVisible(this.elements.deadlineSequent);
    await this.elementContainsText(this.elements.autocompliteHeader, text1);
    await this.elementContainsText(this.elements.alertHeader, text2);
    await this.clickDoneButton();
    await this.clickStepByName(name);
    await this.elementVisible(this.elements.autocompliteHeader);
    await this.elementVisible(this.elements.alertHeader);
  }

  async setDueDateRecordType(
    dueDataCondition: string,
    workflowStep: string,
    dueDays?: number,
    isAutomaticCompleteOnDueDate = false,
  ) {
    let flag = false;
    const max = 10;
    const min = 1;
    let randomNum: number = Math.floor(Math.random() * (max - min) + min);
    if (dueDays !== null) {
      randomNum = dueDays;
      baseConfig.citTempData.addDueDateNum = randomNum.toString();
    }
    await this.page.click(this.elements.workflowSteps.selector(workflowStep));
    const result = await this.page
      .locator(this.elements.dueDateInput)
      .isVisible();
    if (result === true) {
      flag = true;
      console.info(flag);
    }
    if (!flag) {
      await this.page.click(this.elements.dueDateOn);
    }
    await this.page.fill(this.elements.dueDateInput, randomNum.toString());
    await this.page.click(this.elements.stepDeadlineDropdown);
    await this.page
      .locator(this.elements.stepDeadlineDropdown)
      .selectOption({value: dueDataCondition});
    if (isAutomaticCompleteOnDueDate) {
      await this.setAutomaticCompleteOnDueDate();
    }
    await this.page.click(this.elements.dueDateDoneButton);
  }

  async setAutomaticCompleteOnDueDate() {
    await this.page
      .locator(this.elements.automationCompleteOndueDateToggle)
      .click();
  }

  async validateApiIntegrationStep(stepName: string) {
    await this.validateNewStep(stepName);
    await this.clickDoneButton();
    await this.elementContainsText(
      this.elements.urlErrorMessage,
      'URL is required.',
    );
    await this.page.fill(this.elements.postURLInputBox, 'testing');
    await this.elementContainsText(
      this.elements.urlErrorMessage,
      'Please enter a valid URL.',
    );
    await this.page.fill(this.elements.postURLInputBox, '.com');
  }

  async setURLOnApiIntegrationStep(
    url = 'https://reports-service-test-02.azurewebsites.net/api/reportData',
  ) {
    await this.page.fill(this.elements.inputUrl, url); //need to think about the url
  }

  async setRequestBodyOnApiIntegrationStep(requestBodyInput = '{}') {
    await this.page.fill(this.elements.requestBody, requestBodyInput);
  }

  async setStepSequence(action: string, stepName: string) {
    let stepActionElement;
    if (action === 'parallel') {
      stepActionElement = this.elements.apiStepOptionParallel;
    } else if (action === 'sequent') {
      stepActionElement = this.elements.apiOptionWithDropdown;
    }
    await this.page.click(this.elements.apiStepSequentLabel);
    await this.page.click(stepActionElement);

    // Need to split the function and move below methods to another
    await this.setURLOnApiIntegrationStep();
    await this.setRequestBodyOnApiIntegrationStep();
    await this.clickDoneButton();
    await this.clickStepByName(stepName);
  }

  async fillApiIntegrationWorkflow(
    url = 'https://reports-service-test-02.azurewebsites.net/api/reportData',
    requestBody = '{}',
  ) {
    await this.page.waitForTimeout(2000);
    await this.setURLOnApiIntegrationStep(url);
    await this.setRequestBodyOnApiIntegrationStep(requestBody);
    await this.clickDoneButton();
  }

  async clickToViewMergeTags() {
    await this.page.click(this.elements.viewDataMergeTags);
    await this.elementVisible(this.elements.mergeTagSelector);
  }

  async validateMergeTagsForRequestBody(
    mergeTagsDataTable: any,
    mergeTagType: string,
  ) {
    const mergeTagsSection = await mergeTagsDataTable.raw();
    for (const element of mergeTagsSection) {
      const sectionLabel = await element;
      console.info('tagName is: ', sectionLabel);
      if (mergeTagType === 'Form Section') {
        await this.elementContainsText(
          this.elements.mergeTagSectionLabel,
          sectionLabel,
        );
      } else {
        await this.elementTextNotVisible(
          this.elements.formFieldMergeTag,
          sectionLabel,
        );
      }
    }
  }

  async closeMergeTagsView() {
    await this.page.click(this.elements.mergeTagsCloseButton);
  }

  async deleteWorkflowStep(stepName: string) {
    const generatedStepName = this.generateStepName(stepName);
    await this.page.click(
      this.elements.deleteStepButtons.selector(generatedStepName),
    );
    await this.page.click(this.elements.confirmDelete);
    await this.elementNotVisible(
      this.elements.deleteStepButtons.selector(generatedStepName),
    );
  }

  generateStepName(stepName: string) {
    // Whether the stepName is standard name and equals to a step type
    if (workflowStepTypes.includes(stepName as StepType)) {
      stepPrefix = stepPrefix
        ? stepPrefix
        : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
      return `${stepPrefix}_${stepName}`;
    }
    return stepName;
  }

  async addGenericConditionToWorkflow(
    conditionFlag = 'Location Flag',
    dropdownOption: string,
    formType?: string,
    formConditionValue?: string,
  ) {
    await this.page.click(this.elements.addNewConditionButton);
    await this.page
      .locator(this.elements.conditionFlagSelect)
      .selectOption({label: conditionFlag});
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
      await this.page
        .locator(this.elements.conditionSelect)
        .selectOption({label: dropdownOption});
    }
    await this.page.click(this.elements.addStepConditionButton);
    await this.checkConditionExists();
    await this.clickDoneButton();
  }

  async clickOnDueDateCheckBox() {
    await this.page.click(this.elements.dueDateSettingsToggle);
  }
}
