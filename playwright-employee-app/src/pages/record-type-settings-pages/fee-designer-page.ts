import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {faker} from '@faker-js/faker';
import {expect} from '../../base/base-test';
import retry from 'async-retry';
export class FeeDesignerPage extends BaseCitPage {
  readonly elements = {
    addFeeButton: '.svg-plus',
    feeLabelInput: '#feeLabel',
    feeACInput: '#accountNo',
    createFeeButton: '#create-fee-btn',
    feeListElement: 'tr td a.ember-view',
    editFeeButton: '.svg-pencil',
    editLabelInput: 'tr:nth-child(1) td:nth-child(1) .edit',
    deleteFeeButton: '#deleteButton',
    saveEditButton: 'tbody .btn-primary',
    confirmFeeDelete: '.btn-danger',
    feeLabelList: 'tbody a.ember-view',
    feeDecoratorTitle: '.page-title',
    addCalculationButton: '#add-calc-link',
    feeLogicDropdown: '#fee-calc-logic',
    feeLogicOption: {
      selector: (name: string) =>
        `//select[@id='fee-calc-logic']/option[contains(.,'${name}')]`,
    },
    feeAmoundInput: '.page-body .ember-text-field',
    saveFeeCalculation: '#save-fee-calc-btn',
    feeHeader: 'h5.fee-header',
    perLogicAmountInput: 'input[name="perLogic_amount"]',
    perLogicDropdown: 'select[name="perLogic_dropDown"]',
    perLogicDropdownFirstValue:
      'select[name="perLogic_dropDown"] option:nth-child(2)',
    percentLogicDropdown: 'select[name="percentLogic_dropDown"]',
    percentLogicDropdownFirstValue:
      'select[name="percentLogic_dropDown"] option:nth-child(2)',
    anotherFeeDropdown: 'select[name="anotherFee_dropDown"]',
    anotherFeeDropdownFirstValue:
      'select[name="anotherFee_dropDown"] option:nth-child(2)',
    addOverallMinimum: '#add-min-fee-btn',
    minimumInput: '#minimumFeeField',
    saveFeeEditButton: '#save-fee-edits-btn',
    addOverallMax: '#add-max-fee-btn',
    maxInput: '#maximumFeeField',
    prorateHeader: '#prorate-header',
    prorateFeeSwitcher: '#prorate-fee-btn .bootstrap-switch-label',
    prorateTime: '#prorateTypeID',
    prorateType: '#recordProrateDateType',
    startMonth: '#startProrateMonth',
    endMonth: '#endProrateMonth',
    discountHeader: '#discount-flex h4',
    discountSwitcher: '#discount-fee-btn .bootstrap-switch-label',
    discountNumInput: '#editDiscountAmount',
    calculationCondition: '#fee-calc-add-condition',
    whenConditionDropdown: '#newFICTargetSelector',
    logicDropdown: '#newFICLogicSelector',
    conditionalValue: '#newFICValue',
    userFlagOption: 'option[value="userFlag"]',
    isUserOption: '.form-group:nth-child(4) .form-control',
    firstUserOption:
      '.form-group:nth-child(4) .form-control option:nth-child(2)',
    addConditionButton: '.modal-footer .btn-primary',
    conditionFormInline: '.form-inline',
    locationOption: 'option[value="locationFlag"]',
    deleteCalculation: '.deleteHover',
    confirmDelete: '.bootbox-accept',
    matchOperatorConditionForm: '[role="form"] select',
    feeExpanded: '//*[@class="fee-header"]/../following-sibling::div',
  };

  async createFee(name: string = null) {
    const feeName = name
      ? name
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;

    await this.page.click(this.elements.addFeeButton);
    await this.page.fill(this.elements.feeLabelInput, feeName);
    await this.page.fill(this.elements.feeACInput, feeName);
    await this.page.click(this.elements.createFeeButton);
    this.elementContainsText(this.elements.feeListElement, feeName, true);
  }

  async editFee() {
    const feeName1 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    const feeName2 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.createFee(feeName1);
    await this.page.click(this.elements.editFeeButton);
    await this.page.fill(this.elements.editLabelInput, feeName2);
    await this.page.click(this.elements.saveEditButton);
    this.elementContainsText(this.elements.feeListElement, feeName2, true);
  }

  async deleteFee() {
    await this.createFee();
    await this.page.click(this.elements.deleteFeeButton);
    await this.page.click(this.elements.confirmFeeDelete);
  }

  async proceedToFeeDesigner() {
    const feeName = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.createFee(feeName);
    await this.clickElementWithText(this.elements.feeLabelList, feeName);
    await this.elementContainsText(this.elements.feeDecoratorTitle, feeName);
    return feeName;
  }

  async clickOnFeeLabel() {
    await this.page.locator(this.elements.feeListElement).click();
  }

  async setCalculation(
    feeOption: string,
    conditionType: string = undefined,
    conditionObject: any = undefined,
    feeAmount = '100',
    perValue = 'Select ...',
  ) {
    await this.page.click(this.elements.addCalculationButton);
    await this.page.fill(this.elements.feeAmoundInput, feeAmount);
    await this.page.click(this.elements.feeLogicDropdown);
    await this.page
      .locator(this.elements.feeLogicDropdown)
      .selectOption({label: feeOption});
    if (conditionType === 'number') {
      await this.waitForVisibility(this.elements.calculationCondition);
      await this.page.click(this.elements.calculationCondition);
      await this.waitForVisibility(this.elements.whenConditionDropdown);
      await this.page.click(this.elements.whenConditionDropdown);
      await this.page
        .locator(this.elements.whenConditionDropdown)
        .selectOption({label: conditionObject.formFieldOption});
      await this.page.click(this.elements.logicDropdown);
      await this.page
        .locator(this.elements.logicDropdown)
        .selectOption({label: conditionObject.dropdownOption});
      await this.page
        .locator(this.elements.conditionalValue)
        .fill(conditionObject.formConditionValue);
      await this.page.click(this.elements.addConditionButton);
      await expect(
        this.page.locator(this.elements.conditionFormInline),
      ).toBeVisible();
    }
    if (feeOption === FeeOption.Flat) {
      await this.page.click(this.elements.saveFeeCalculation);
    } else if (feeOption === FeeOption.PerValue) {
      await this.page.fill(this.elements.perLogicAmountInput, '1');
      await this.page.selectOption(this.elements.perLogicDropdown, {
        label: perValue,
      });
      await this.page.click(this.elements.saveFeeCalculation);
    } else if (feeOption === FeeOption.PersentOf) {
      await this.page.click(this.elements.percentLogicDropdown);
      await this.page.click(this.elements.percentLogicDropdownFirstValue);
      await this.page.click(this.elements.saveFeeCalculation);
    } else if (feeOption === FeeOption.PersentOfAnotherFee) {
      await this.page.click(this.elements.anotherFeeDropdown);
      await this.page.click(this.elements.anotherFeeDropdownFirstValue);
      await this.page.click(this.elements.saveFeeCalculation);
    } else {
      throw new Error(
        `Fee option '${feeOption}' is not supported or does not exist.`,
      );
    }
  }

  async addOverallMinAndMax() {
    const feeAmount = '100';
    await this.page.click(this.elements.addOverallMinimum);
    await this.page.fill(this.elements.minimumInput, feeAmount);
    await this.page.click(this.elements.addOverallMax);
    await this.page.fill(this.elements.maxInput, feeAmount);
    await this.page.click(this.elements.saveFeeEditButton);
    await expect(
      this.page.locator(this.elements.addOverallMinimum),
    ).toBeHidden();
    await expect(this.page.locator(this.elements.addOverallMax)).toBeHidden();
  }

  async prorateFee() {
    const prorateText = 'Prorate this fee';
    await expect(this.page.locator(this.elements.prorateHeader)).toContainText(
      prorateText,
    );
    await this.page.click(this.elements.prorateFeeSwitcher);
    await expect(this.page.locator(this.elements.prorateType)).toBeVisible();
    await expect(this.page.locator(this.elements.prorateTime)).toBeVisible();
    await expect(this.page.locator(this.elements.startMonth)).toBeVisible();
    await expect(this.page.locator(this.elements.endMonth)).toBeVisible();
  }

  async discountFee() {
    const discountText = 'Discount this fee';
    await this.elementContainsText(
      this.elements.discountHeader,
      discountText,
      true,
    );
    await this.page.click(this.elements.discountSwitcher);
    await this.page.fill(this.elements.discountNumInput, '20');
    await this.page.click(this.elements.saveFeeEditButton);
  }

  async addUserCondition() {
    await this.page.click(this.elements.calculationCondition);
    await this.page.selectOption(this.elements.whenConditionDropdown, {
      label: 'User Flag',
    });
    await this.page.selectOption(this.elements.isUserOption, {
      value: '1',
    });
    await this.page.click(this.elements.addConditionButton);
    await expect(
      this.page.locator(this.elements.conditionFormInline),
    ).toBeVisible();
  }

  async addLocationCondition() {
    await this.page.click(this.elements.addCalculationButton);
    await this.page.click(this.elements.calculationCondition);
    await this.page.click(this.elements.whenConditionDropdown);
    await this.page.click(this.elements.locationOption);
    await this.page.click(this.elements.isUserOption);
    await this.page.click(this.elements.firstUserOption);
    await this.page.click(this.elements.addConditionButton);
    await expect(
      this.page.locator(this.elements.conditionFormInline),
    ).toBeVisible();
  }

  async addCondition(when: string, is: string) {
    await this.page.click(this.elements.calculationCondition);
    await this.page.selectOption(this.elements.whenConditionDropdown, {
      label: when,
    });
    await this.page.selectOption(this.elements.isUserOption, {
      label: is,
    });
    await this.page.click(this.elements.addConditionButton);
    await expect(
      this.page.locator(this.elements.conditionFormInline),
    ).toBeVisible();
  }

  async deleteCalculation() {
    await this.page.click(this.elements.addCalculationButton);
    await this.page.click(this.elements.deleteCalculation);
    await this.page.click(this.elements.confirmDelete);
    await expect(
      this.page.locator(this.elements.addCalculationButton),
    ).toBeVisible();
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

  async clickAddedFee() {
    await expect(this.page.locator(this.elements.feeExpanded)).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await retry(
      async () => {
        await this.page.locator(this.elements.feeHeader).click();
        expect(
          await this.page
            .locator(this.elements.feeExpanded)
            .getAttribute('aria-expanded'),
        ).toBe('true');
      },
      {
        retries: 2,
        minTimeout: 1000,
        maxTimeout: 3000,
      },
    );
  }
}

export enum FeeOption {
  Flat = '$ flat',
  PerValue = '$ per ...',
  PersentOf = '% of ...',
  PersentOfAnotherFee = '% of another fee',
}
