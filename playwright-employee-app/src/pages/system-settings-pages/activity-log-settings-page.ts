import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../base/base-test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

export class ActivityLogSettingsPage extends BaseCitPage {
  readonly pageUrl = '/settings/system/activity';
  readonly elements = {
    activityTable: '.report-activities',
    reportActivityTable: '.report-activities',
    filtersHeadingText: './/h4[contains(text(), "Filter")]',
    filterContainer: '.container .panel-body',
    filterCalendarDropdown: '.fa-calendar',
    exportLogBreadcrumb: '.navbar-nav.w-100 li:last-of-type',
    exportLogTable: '#dvDisplayData',
    employeeFilterDropdown: '#Employee',
    employeeOptionsContainer: '.panel-body [aria-labelledby="Employee"]',
    employeeFilterOptions: '[role="presentation"]',
    emptyResults: "xpath=//i[contains(text(), 'No activities created yet.')]",
    filterCalendarOptions: '[aria-labelledby="recordsDateRange"] li',
    filterCalendarOptionsContainer: '[aria-labelledby="recordsDateRange"]',
    recordSearchInput: '#RecordSearchKey',
    recordSearchOptionsContainer: '#activityRecordDropDownSearch',
    recordSearchOptions: '#activityRecordDropDownSearch .list-group-item',
    activityTableElement: '.activity-link',
  };

  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}/#${this.pageUrl}`);
    await this.verifyActivityLogPageVisible();
  }

  async verifyActivityLogPageVisible() {
    await expect(this.page.locator(this.elements.activityTable)).toBeVisible();
    await expect(
      this.page.locator(this.elements.filterContainer),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.filterCalendarDropdown),
    ).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(this.pageUrl));
  }

  async navigateToExportLog() {
    await this.page.click(this.elements.exportLogBreadcrumb);
  }

  async verifyExportLogPageVisible() {
    await expect(this.page.locator(this.elements.exportLogTable)).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp('/settings/system/export'));
  }

  async selectFilteringByEmployee(name: string) {
    await expect(
      this.page.locator(this.elements.employeeFilterDropdown),
    ).toBeVisible();
    await this.page.locator(this.elements.employeeFilterDropdown).click();
    await expect(
      this.page.locator(this.elements.employeeOptionsContainer),
    ).toBeVisible();
    await this.page
      .locator(this.elements.employeeFilterOptions, {hasText: name})
      .click();
  }

  async selectDateFilter(date: string) {
    await expect(
      this.page.locator(this.elements.filterCalendarDropdown),
    ).toBeVisible();
    await this.page.locator(this.elements.filterCalendarDropdown).click();
    await expect(
      this.page.locator(this.elements.filterCalendarOptionsContainer),
    ).toBeVisible();
    await this.page
      .locator(this.elements.filterCalendarOptions, {hasText: date})
      .click();
  }

  async searchForRecord(recordName: string) {
    await expect(
      this.page.locator(this.elements.recordSearchInput),
    ).toBeVisible();
    await this.page.locator(this.elements.recordSearchInput).fill(recordName);
    await expect(
      this.page.locator(this.elements.recordSearchOptionsContainer),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.recordSearchOptions),
    ).toBeVisible();
    await expect
      .poll(
        async () => {
          const text = await this.page
            .locator(this.elements.recordSearchOptions)
            .first()
            .innerText();
          return text.match(new RegExp(recordName));
        },
        {
          message: 'First element still not shown or contains wrong text',
          timeout: 5000,
        },
      )
      .toBeTruthy();
    await this.page.locator(this.elements.recordSearchOptions).first().click();
  }

  async getActivityLogMessage(filter?: {number?: number; text?: string}) {
    let activityLog = await this.page
      .locator(this.elements.activityTable)
      .locator(this.elements.activityTableElement);

    if (filter?.text) {
      activityLog = activityLog.locator(filter.text);
    }

    activityLog = filter?.number
      ? activityLog.nth(filter.number)
      : activityLog.first();

    return activityLog.innerText();
  }
}
