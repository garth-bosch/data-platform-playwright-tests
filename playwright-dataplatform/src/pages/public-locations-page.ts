import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../base/base-test';

interface DetailsTabElements {
  occupancy?: string;
  yearBuilt?: string;
  sewage?: string;
}

export class PublicLocationsPage extends BaseCitPage {
  readonly elements = {
    template: {
      selector: (xx) =>
        `//label[contains(string(),'${xx}')]//following::*[@form-custom-field-attr ='error-short-text']`,
    },
    detailsTab: `//a[@href="#attributes" and contains(.,"Details")]`,
    detailsTabOccupancy: `//*[@id="attributes"]//div[ label[ contains(.,"Occupancy") ]]/p`,
    detailsTabYearBuilt: `//*[@id="attributes"]//div[ label[ contains(.,"Year Built") ]]/p`,
    detailsTabSewage: `//*[@id="attributes"]//div[ label[ contains(.,"Sewage") ]]/p`,
  };

  async clickOnDetailsTab() {
    await this.page.click(this.elements.detailsTab);
  }

  async verifyLocationDetailsTab(detailsTabElements: DetailsTabElements) {
    if (detailsTabElements.occupancy) {
      await expect(
        this.page.locator(this.elements.detailsTabOccupancy),
      ).toHaveText(detailsTabElements.occupancy);
    }
    if (detailsTabElements.sewage) {
      await expect(
        this.page.locator(this.elements.detailsTabSewage),
      ).toHaveText(detailsTabElements.sewage);
    }
    if (detailsTabElements.yearBuilt) {
      await expect(
        this.page.locator(this.elements.detailsTabYearBuilt),
      ).toHaveText(detailsTabElements.yearBuilt);
    }
  }
}
