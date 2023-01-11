import {expect} from '../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class ExploreAnalyticsPage extends BaseCitPage {
  readonly elements = {
    analyticsHeader: {
      selector: (analytics: string) => `//h3[contains(text(),'${analytics}')]`,
    },
    graphHeader: `//h4[contains(text(),'Records submitted over time')]`,
    graphLayout: '#morris-graph',
    filterOptions: {
      selector: (option: string) => `//h5[contains(text(),'${option}')]`,
    },
    analyticsDateLabel: 'label[for=recordsDateRange]',
    analyticsDateDropdowm: '.fa-calendar',
    analyticsDropdownOption: '.dropdown.open li div',
    analyticsDateOption: {
      selector: (date: string) =>
        `//div[contains(normalize-space(),'${date}')]`,
    },
    analyticsRecordTypeDropdown: '#recordsType',
    selectedRecordType: {
      selector: (recordName: string) => `//span[text()='${recordName}']`,
    },
    dropdownOption: '.dropdown.open li div',
    totalCount: {
      selector: (fieldName: string) =>
        `//label[normalize-space()='${fieldName}']/preceding-sibling::h3`,
    },
  };

  async validateAnalyticsGraph() {
    await expect(this.page.locator(this.elements.graphHeader)).toBeVisible();
    await expect(this.page.locator(this.elements.graphLayout)).toBeVisible();
  }

  async verifyFilterOption() {
    await expect(
      this.page.locator(this.elements.filterOptions.selector('Filter Results')),
    ).toBeVisible();
  }

  async verifyAnalyticsDateFilterOptions() {
    await expect(
      this.page.locator(this.elements.analyticsDateLabel),
    ).toBeVisible();
  }

  async selectAnalyticsDateOption(date: string) {
    await this.page.click(this.elements.analyticsDateDropdowm);
    await this.clickElementWithText(
      this.elements.analyticsDropdownOption,
      date,
    );
    await expect(
      this.page.locator(this.elements.analyticsDateOption.selector(date)),
    ).toBeVisible();
  }

  async selectAnalyticsRecordTypeOption(recordType: string) {
    await this.page.click(this.elements.analyticsRecordTypeDropdown);
    await this.clickElementWithText(this.elements.dropdownOption, recordType);
    await expect(
      this.page.locator(this.elements.selectedRecordType.selector(recordType)),
    ).toBeVisible();
  }

  async getTotalCount(fieldName: string) {
    return this.page
      .locator(this.elements.totalCount.selector(fieldName))
      .innerText();
  }
  async verifyTotalCount(recordType: string, count: string) {
    await this.page.reload();
    const totalUpdatedCount = await this.getTotalCount(recordType);
    expect(Number(count) + 1).toEqual(Number(totalUpdatedCount));
  }
}
