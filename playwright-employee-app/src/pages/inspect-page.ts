import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class InspectPage extends BaseCitPage {
  readonly elements = {
    recordLocation: {
      selector: (recordNumber: string) =>
        `//h5[contains(normalize-space(),'${recordNumber}')]/following::div[1]`,
    },
    recordInspectionLink: {
      selector: (recordNumber: string) =>
        `//h5[contains(normalize-space(),'${recordNumber}')]/ancestor::a`,
    },
    locationPin: '.leaflet-marker-icon .map-assign-pic',
    locationPopup: '.leaflet-popup-content',
    inspectDayBefore: '#inspections-date-earlier-button',
    beginInspectionButton: '.btn-toolbar .btn-primary',
    inspectPageTopBar: '#inspect-topbar',

    routeDropdown: '//*[@data-toggle="dropdown" and contains(.,"Route")]',
    linkOptimizeRoutes:
      '//ul[contains(@class,"dropdown-menu") and contains(.,"Optimize Route")]',
    inspectionEvents: 'li.inspection-event h5',

    requestsButton: '#inspections-requests-btn',
    departmentDropdownButton: '//button[contains(.,"All Departments")]',
    departmentDropdownList:
      '//button[contains(.,"All Departments")]/following-sibling::ul[@class="dropdown-menu"]/li',
    requestsPageContent: '.submenu-margin',
    inspectionRequests: '.submenu-margin .list-group-item h5',
  };

  async verifyRecordLocation(location: string) {
    const locationOnMap = this.elements.recordLocation.selector(
      baseConfig.citTempData.recordName,
    );
    await this.elementVisible(this.elements.inspectPageTopBar);
    const pinVisible = await this.page.locator(locationOnMap).isVisible();
    if (!pinVisible) {
      console.info('Location does not appear use workaround');
      await this.page.click(this.elements.inspectDayBefore);
    }

    this.elementContainsText(locationOnMap, location);
  }

  async clickInspectionLink() {
    const inspectionLink = this.elements.recordInspectionLink.selector(
      baseConfig.citTempData.recordName,
    );
    await this.page.isVisible(inspectionLink);
    await this.page.click(inspectionLink);
  }

  async verifyLocationOnMap(address: string) {
    const locationPinOnMap = this.elements.locationPin;
    const locationPopup = this.elements.locationPopup;
    await this.page.click(locationPinOnMap);
    await this.elementContainsText(locationPopup, address);
  }

  async optimizeRoutes(accept = true) {
    await this.page.locator(this.elements.routeDropdown).click();
    await this.page.locator(this.elements.linkOptimizeRoutes).click();
    if (accept) {
      await this.page.locator('button.bootbox-accept').click();
    } else {
      await this.page.locator('button.bootbox-cancel').click();
    }
  }
  async selectDepartment(department: string) {
    await this.page.locator(this.elements.departmentDropdownButton).click();

    await this.page
      .locator(this.elements.departmentDropdownList, {hasText: department})
      .click(),
      await this.page.waitForResponse((response) => response.status() === 200),
      await this.elementVisible(this.elements.requestsPageContent);
  }
}
