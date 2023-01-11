import {CreateRecordPage} from '../../create-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {TestLocationTypes} from '@opengov/cit-base/build/constants/cit-constants';
import {LocationsApi} from '@opengov/cit-base/build/api-support/api/locationsApi';

/**
 * Modal that shows up adding a location via record.
 */

export interface LocationModalFill {
  locationName?: string;
  streetNo?: string;
  streetName?: string;
  city?: string;
  state?: string;
  unit?: string;
  zip?: number;
  subDivision?: string;
  submit?: boolean;
}
export class ChangeLocationModal extends CreateRecordPage {
  readonly elementsModal = {
    addNewLocation: 'button[data-test="add-new-location-button"]',
    addLocation: '[data-test="add-location"]',
    addNewLocationName: '#newName',
    addNewLocationStreetNo: '#newStreetNo',
    addNewLocationStreetName: '#newStreetName',
    addNewLocationCity: '#newCity',
    addNewLocationState: '#newState',
    addNewLocationUnit: '#createNewUnit',
    addNewLocationZip: '#newZip',
    addNewLocationSubDivision: '#newSubdivision',
    addNewLocationSubmit: '[class*="location-footer"] button.btn-primary',
    selectNewLocation: '[data-test="select-location-button"]',
  };

  async addNewLocation() {
    await this.page.click(this.elementsModal.addNewLocation);
  }

  async addNewLocationSubmit() {
    await this.page.click(this.elementsModal.addNewLocationSubmit);
  }

  async fillNewLocation(fillObject: LocationModalFill) {
    if (fillObject.locationName.length > 0) {
      await this.page.fill(
        this.elementsModal.addNewLocationName,
        fillObject.locationName,
      );
    }

    if (fillObject.streetNo.length > 0) {
      await this.page.fill(
        this.elementsModal.addNewLocationStreetNo,
        fillObject.streetNo,
      );
    }

    if (fillObject.streetName.length > 0) {
      await this.page.fill(
        this.elementsModal.addNewLocationStreetName,
        fillObject.streetName,
      );
    }

    if (fillObject.city.length > 0) {
      await this.page.fill(
        this.elementsModal.addNewLocationCity,
        fillObject.city,
      );
    }

    if (fillObject.state.length > 0) {
      await this.page.fill(
        this.elementsModal.addNewLocationState,
        fillObject.state,
      );
    }

    if (fillObject.unit) {
      await this.page.fill(
        this.elementsModal.addNewLocationUnit,
        fillObject.unit,
      );
    }

    if (String(fillObject.zip).length >= 1) {
      await this.page.fill(
        this.elementsModal.addNewLocationZip,
        String(fillObject.zip),
      );
    }

    if (fillObject.subDivision) {
      await this.page.fill(
        this.elementsModal.addNewLocationSubDivision,
        fillObject.subDivision,
      );
    }

    if (fillObject.submit) {
      await this.addNewLocationSubmit();
    }
  }

  async changeLocationAddNew(addNewObject: LocationModalFill) {
    await this.page.click(this.elements.changeLocationBtn);
    await this.page.click(this.elementsModal.addNewLocation);
    await this.fillNewLocation(addNewObject);
  }

  async setUpLocationId(locationObject: LocationModalFill) {
    const locationName = `${locationObject.streetNo} ${locationObject.streetName}, Unit ${locationObject.unit}, ${locationObject.city}, ${locationObject.state} ${locationObject.zip}`;
    const locationResponse = await new LocationsApi().searchLocation(
      locationName,
      TestLocationTypes.Address_Location,
    );
    baseConfig.citTempData.locationId = locationResponse.entityID;
  }

  async addLocationAddNew(addNewObject: LocationModalFill) {
    await this.page.click(this.elementsModal.addLocation);
    await this.page.click(this.elementsModal.addNewLocation);
    await this.fillNewLocation(addNewObject);
    await this.page.click(this.elementsModal.selectNewLocation);
    await this.setUpLocationId(addNewObject);
  }
}
