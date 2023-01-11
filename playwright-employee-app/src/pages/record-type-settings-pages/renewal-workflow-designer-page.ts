import {expect} from '../../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

type StepTypeId = 'inspection' | 'payment' | 'approval' | 'document' | 'mark43';

export class RenewalWorkflowDesignerPage extends BaseCitPage {
  elements = {
    addNewStepButton: '#workflow-add-new-step',
    confirmDeleteButton: '//button[contains(normalize-space(), "Delete")]',
    removeStepByName: {
      selector: (stepName: string) =>
        `//div[contains(@class, "panel-body") and contains(.,"${stepName}")]/button[@data-hint="Remove Step"]`,
    },
    workflowSideBar: '.workflowSidebar .panel-default',
    stepNameInput: 'input[name="label"]',
    renews: `#renews`,
    doneButton: '.clearfix button',
    renewsToggle: `[for="renews"]`,
    selectSequence: '//div[ label[@for="sequence"]]/select',
    addIndivdualStepButton: {
      selector: (workflowStep: StepTypeId) =>
        `//*[contains(@id,'add-${workflowStep}-step')]`,
    },
    sequenceStepsIndicator: `//h6/i[contains(@class,"-arrow-down")]`,
    stepNamesList: {
      selector: (workflowStepName: string) =>
        `//h4[contains(normalize-space(),'${workflowStepName}')]`,
    },
    stepWithName: {
      selector: (workflowStepName: string) =>
        `//h4[contains(normalize-space(),'${workflowStepName}')]`,
    },
    dueDateOn:
      '//div[contains(.,"Add a due date")]/following-sibling::div[1]//span[contains(@class,"bootstrap-switch-label")]',
    dueDateInput: '#deadline-days-input',
    stepDeadlineDropdown: '#select-deadline-type-dropdown',
    automaticallyDueDateOn:
      '//div[contains(.,"automatically complete on due date")]/following-sibling::div[1]//span[contains(@class,"bootstrap-switch-label")]',
    stepDoneButton: '//button[normalize-space()="Done"]',
    documentInput: '#document_textBox',
    documentListSpinner: '.list-group-item.text-muted',
    documentResultRow: {
      selecttor: (matchingString: string) =>
        `//div[contains(@class,"resultRow")]//h5[contains(.,"${matchingString}")]`,
    },
    documentThumbnailTitle: `//label[@for="docTitle"]`,
    documentExpireToggleButton: `//label[contains(.,"Expires")]/following-sibling::span/span[contains(@class,"switch-square")]`,
    documentExpirationInput: 'input#expiresAfterAmount',
    dueDateSettingsToggle: '.step-deadline-settings .bs-switch > div',
    dueDateDropdown: '#select-deadline-type-dropdown',
    addNewConditionButton: '//a[contains(text(),"Add Condition")]',
    conditionFlagSelect: `//select[@class="form-control" and option[ contains(.,"Select ...")] ]`,
    conditionValueInput: 'input#newWSICValue',
    conditionSelector: '#newWSICLogicSelector',
    conditionSelect: `//select[@class="form-control" and option[ contains(.,"Select your option")] ]`,
    addStepConditionButton:
      '//div[@class="modal-dialog"]//button[contains(text(),"Add")]',
    conditionExists: `[data-test="condition-item"]`,
    publicCanPrintOption: '#publicCanPrint_',
  };

  async verifyRenewalOn(checkIfItIsOn = true) {
    const isRenewalOn = await this.page
      .locator(this.elements.renews)
      .isChecked();
    if (checkIfItIsOn) {
      expect(isRenewalOn).toBeTruthy();
    } else {
      expect(isRenewalOn).toBeFalsy();
    }
  }

  async setRenewalOn(setItOn = true) {
    const isRenewalOn = await this.page
      .locator(this.elements.renews)
      .isChecked();
    if (setItOn && !isRenewalOn) {
      await this.page.click(this.elements.renewsToggle);
      await this.verifyRenewalOn(true);
    }
    if (!setItOn && isRenewalOn) {
      await this.page.click(this.elements.renewsToggle);
      await this.verifyRenewalOn(false);
    }
  }

  async removeStepByStepName(stepName: string) {
    await this.page.click(this.elements.removeStepByName.selector(stepName));
    await this.page.click(this.elements.confirmDeleteButton);
  }

  async addNewStepRenewal(stepType: StepTypeId, stepName: string) {
    await this.setRenewalOn();
    await this.page.reload({waitUntil: 'domcontentloaded'});
    await this.page.click(this.elements.addNewStepButton);
    await this.page.click(
      this.elements.addIndivdualStepButton.selector(stepType),
    );
    await this.page.fill(this.elements.stepNameInput, stepName);
    await this.page.click(this.elements.doneButton);
    await this.elementNotVisible(this.elements.workflowSideBar);
  }

  async setDueDateRecordType(
    dueDataCondition: string,
    workflowStep: string,
    setAutomaticDueDateOn = false,
    dueDays?: number,
  ) {
    let flag = false;
    const max = 10;
    const min = 1;
    let randomNum: number = Math.floor(Math.random() * (max - min) + min);
    if (dueDays !== null) {
      randomNum = dueDays;
      baseConfig.citTempData.addDueDateNum = randomNum.toString();
    }
    await this.clickOnStepName(workflowStep);
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
    if (setAutomaticDueDateOn) {
      await this.page.click(this.elements.automaticallyDueDateOn);
    }
    await this.page.click(this.elements.stepDoneButton);
  }

  async addDocumentFromTemplate(documentName: string) {
    await this.elementVisible(this.elements.documentInput);
    await this.page.fill(this.elements.documentInput, documentName);
    await this.elementNotVisible(this.elements.documentListSpinner);
    await this.page.click(
      this.elements.documentResultRow.selecttor(documentName),
    );
    await this.elementVisible(this.elements.documentThumbnailTitle);
    await this.page.click(this.elements.stepDoneButton);
    await this.elementNotVisible(this.elements.workflowSideBar);
  }

  async setExipreDateOnDocumentRecordType(
    workflowStep: string,
    dueDays?: number,
  ) {
    let flag = false;
    const max = 10;
    const min = 1;
    let randomNum: number = Math.floor(Math.random() * (max - min) + min);
    if (dueDays !== null) {
      randomNum = dueDays;
      baseConfig.citTempData.addDueDateNum = randomNum.toString();
    }
    await this.clickOnStepName(workflowStep);
    const result = await this.page
      .locator(this.elements.dueDateInput)
      .isVisible();
    if (result === true) {
      flag = true;
      console.info(flag);
    }
    if (!flag) {
      await this.page.click(this.elements.documentExpireToggleButton);
    }
    await this.page.fill(
      this.elements.documentExpirationInput,
      randomNum.toString(),
    );
    await this.page.click(this.elements.stepDoneButton);
  }

  async clickOnStepName(stepName: string) {
    await this.page.click(this.elements.stepWithName.selector(stepName));
    await this.elementVisible(this.elements.workflowSideBar);
  }

  async updateStepSequence(stepName: string, sequentially = true) {
    const stepSelectValue = sequentially ? 0 : 1;
    await this.clickOnStepName(stepName);
    await this.page
      .locator(this.elements.selectSequence)
      .selectOption({index: stepSelectValue});
    await this.page.click(this.elements.doneButton);
  }

  async clickOnDueDateCheckBox() {
    await this.page.click(this.elements.dueDateSettingsToggle);
  }

  async selectDueDateOptionByLabel(label: string) {
    await this.page.selectOption(this.elements.dueDateDropdown, {
      label: label,
    });
  }

  async checkConditionExists() {
    await expect(
      this.page.locator(this.elements.conditionExists),
    ).toBeVisible();
  }

  async clickDoneButton() {
    await this.page.click(this.elements.doneButton);
  }

  async addGenericConditionToRenewalWorkflow(
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
}
