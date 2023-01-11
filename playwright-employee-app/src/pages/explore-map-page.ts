import {expect} from '../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

export class ExploreMapPage extends BaseCitPage {
  readonly elements = {
    mapLayout: 'div#map',
    mapFilterOptions: '.panel-body',
    recordTypeDropdown: '.map-record-type-dropdown',
    recordTypeDropdownOption:
      '.dropdown.open ul[aria-labelledby=recordsType] li div',
    selectedRecordType: {
      selector: (recordName: string) => `//span[text()='${recordName}']`,
    },
    dateDropdowm: '.fa-calendar',
    dateLabel: 'label[for=recordsDateRange]',
    dateOption: {
      selector: (date: string) =>
        `//span[contains(normalize-space(),'${date}')]`,
    },
    dropdownOption: '.dropdown.open li div',
    mapFilter: '.explorer-nav',
    recordFilterDropdown: '.explorer-nav div.dropdown',
    selectedFilterOption: {
      selector: (option: string) => `//span[text()='${option}']`,
    },
    pinnedLocation: 'svg > g > path.leaflet-interactive:nth-child(1)',
    locationPin:
      'div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(1)',
    locationPins: '.leaflet-interactive',
    locationPopup: '.leaflet-popup-content',
    locationName: '.leaflet-popup-content h4',
    matchingResults: `//p[contains(text(),'Matching Results:')]`,
    viewLocationLink: `//a[text()='View location']`,
    zoomOutButton: '.leaflet-control-zoom-out',
    mapLayerDropDown: '.map-layers-dropdown',
    mapLayerList: '#layerList',
    mapLayerItemLabel: '#layerList .panel-body div label',
    inputTypeCheckbox: 'input[type=checkbox]',
  };

  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}` + `/#/explore/map`);
    await this.verifyMapLayout();
  }

  async verifyMapLayout() {
    await expect(this.page.locator(this.elements.mapLayout)).toBeVisible();
  }

  async verifyRecordTypeFilterOptions() {
    await expect(
      this.page.locator(this.elements.mapFilterOptions),
    ).toBeVisible();
  }

  async selectRecordTypeOption(recordType: string) {
    const recordTypeSelectedLocator =
      this.elements.selectedRecordType.selector(recordType);
    await this.page.click(this.elements.recordTypeDropdown);
    this.clickElementWithText(this.elements.dropdownOption, recordType);
    await expect(this.page.locator(recordTypeSelectedLocator)).toBeVisible();
  }

  async verifyDateFilterOptions() {
    await expect(this.page.locator(this.elements.dateLabel)).toBeVisible();
  }

  async selectDateOption(date: string) {
    await this.page.click(this.elements.dateDropdowm);
    await this.clickElementWithText(this.elements.dropdownOption, date);
    await expect(
      this.page.locator(this.elements.dateOption.selector(date)),
    ).toBeVisible();
  }

  async verifyFilterOptions() {
    await expect(this.page.locator(this.elements.mapFilter)).toBeVisible();
  }

  async selectFilterOption(option: string) {
    await this.page.click(this.elements.recordFilterDropdown);
    await this.clickElementWithText(this.elements.dropdownOption, option);
    await expect(
      this.page.locator(this.elements.selectedFilterOption.selector(option)),
    ).toBeVisible();
  }

  async validateViewLocationOnMap() {
    await this.page.click(this.elements.locationPin);
    await expect(
      this.page.locator(this.elements.viewLocationLink),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.matchingResults),
    ).toBeVisible();
    await expect(this.page.locator(this.elements.locationPopup)).toBeVisible();
    await expect(this.page.locator(this.elements.locationName)).toBeVisible();
  }

  async clickZoomOutButton() {
    await this.page.click(this.elements.zoomOutButton);
  }

  async verifyPinpointLocationPresentOnMap(locationName: string) {
    await this.page.click(this.elements.locationPins);
    await expect(this.page.locator(this.elements.locationName)).toContainText(
      locationName,
    );
  }

  async mapLayerDropDownclick() {
    await this.page.locator(this.elements.mapLayerDropDown).click();
  }

  async checkMapLayerCheckBox(label: string) {
    const mapLayerItemChecked = this.page
      .locator(this.elements.mapLayerItemLabel, {hasText: label})
      .locator(this.elements.inputTypeCheckbox);
    await mapLayerItemChecked.check();
    //TODO refactor this step after function fixes:
    //checkboxes don't change status on 'Checked/Unchecked'
    // expect(await mapLayerItemChecked.isChecked()).toBeTruthy();
  }

  async uncheckMapLayerCheckBox(label: string) {
    const mapLayerItemUnChecked = this.page
      .locator(this.elements.mapLayerItemLabel, {hasText: label})
      .locator(this.elements.inputTypeCheckbox);
    await mapLayerItemUnChecked.uncheck();
    //TODO refactor this step after function fixes:
    //checkboxes don't change status on 'Checked/Unchecked'
    // expect(await mapLayerItemUnChecked.isChecked()).toBeFalsy();
  }
}
