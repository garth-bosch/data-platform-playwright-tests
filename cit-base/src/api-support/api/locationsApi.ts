import {faker} from '@faker-js/faker';
import {strictEqual, notStrictEqual} from 'assert';
import {makeCitApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {
  TestLocationTypes,
  locationQueryData,
} from '../../constants/cit-constants';
import {baseConfig} from '../..';
import {expect} from '../../base/base-test';
import {LocationStepResult} from './recordStepsApi';

const locationPayload = () => {
  return {
    data: {
      attributes: {
        recordID: null,
        isEnabled: true,
        archived: false,
        name: null,
        streetNo: null,
        streetName: null,
        city: null,
        state: null,
        country: 'US',
        postalCode: null,
        latitude: null,
        longitude: null,
        locationTypeID: null,
        secondaryLatitude: null,
        secondaryLongitude: null,
        segmentLabel: null,
        segmentPrimaryLabel: null,
        segmentSecondaryLabel: null,
        segmentLength: null,
        locationID: null,
        additionalLocationIDs: null,
      },
      type: 'locations',
    },
  };
};

export class LocationsApi {
  /**
   * recordId : record id on which the locations will be added.
   * locationId: specific location id that will be added to the record
   * numberOfLocation: random locations that will be added e.g. '99' additional location to the record
   * function call addAdditionalLocationToRecord('12345',null,99) or addAdditionalLocationToRecord('12345','54321',null)
   */
  async addAdditionalLocationToRecord(
    recordId: string,
    locationId: string,
    numberOfLocation: number,
  ) {
    if (numberOfLocation) {
      const locationIdsArray = await this.getLocationsWithUnits();
      locationId = locationIdsArray.slice(0, numberOfLocation).join(',');
    }

    const addAdditionalLocationsBody = {
      data: {
        id: recordId,
        type: 'records',
        attributes: {
          additionalLocationIDs: locationId,
        },
      },
    };
    const recordPayload: any = await makeCitApiRequest(
      addAdditionalLocationsBody,
      servicePath.paths.RECORDS.with(recordId),
      RequestMethod.PATCH,
    );
    notStrictEqual(recordPayload.data, null);
    notStrictEqual(recordPayload.data.attributes.additionalLocationIDs, '');
  }
  /**
   * locationType : Location type e.g. which will come from locationType constant
   */
  async createNewLocation(locationType: number) {
    const locationTypePayload = await this.getLocationPayLoadByType(
      locationType,
    );
    const responsePayLoad: any = await makeCitApiRequest(
      locationTypePayload,
      servicePath.paths.LOCATIONS,
      RequestMethod.POST,
    );
    notStrictEqual(
      responsePayLoad.data,
      null,
      'response from api call to create new location is null',
    );
    notStrictEqual(
      responsePayLoad.data.attributes.id,
      null,
      'location id is null',
    );
    baseConfig.citTempData.locationId =
      responsePayLoad.data.attributes.locationID;
    baseConfig.citIndivApiData.locationStepResult = responsePayLoad;
    return responsePayLoad;
  }
  /**
   * locationType : Location type e.g. which will come from locationType constant
   */
  async updateLocation(additionalDetails?: LocationStepResult) {
    const responsePayLoad: any = await makeCitApiRequest(
      additionalDetails,
      servicePath.paths.LOCATIONS_ID.with(additionalDetails.data.id.toString()),
      RequestMethod.PATCH,
    );
    notStrictEqual(
      responsePayLoad.data,
      null,
      'response from api call to Update new location is null',
    );
    notStrictEqual(
      responsePayLoad.data.attributes.id,
      null,
      'location id is null after patch',
    );
    baseConfig.citTempData.locationId =
      responsePayLoad.data.attributes.locationID;
    baseConfig.citIndivApiData.locationStepResult = responsePayLoad;
    return responsePayLoad;
  }
  async getLocationPayLoadByType(locationType: number) {
    const city: string = faker.address.cityName();
    const state: string = faker.address.state();
    const latitude: string = faker.address.latitude();
    const longitude: string = faker.address.longitude();
    const postalCode: string = faker.address.zipCodeByState(state);
    const streetName: string = faker.address.street();
    const name: string = faker.address.streetAddress();
    const streetNo: number = faker.datatype.number(99);
    const locationTemplate = locationPayload();
    if (locationType === TestLocationTypes.Address_Location) {
      locationTemplate.data.attributes.name = name;
      locationTemplate.data.attributes.streetNo = streetNo;
      locationTemplate.data.attributes.streetName = streetName;
      locationTemplate.data.attributes.city = city;
      locationTemplate.data.attributes.state = state;
      locationTemplate.data.attributes.postalCode = postalCode;
      locationTemplate.data.attributes.latitude = latitude;
      locationTemplate.data.attributes.longitude = longitude;
      locationTemplate.data.attributes.locationTypeID =
        TestLocationTypes.Address_Location;
    } else if (locationType === TestLocationTypes.Point_Location) {
      locationTemplate.data.attributes.latitude = latitude;
      locationTemplate.data.attributes.longitude = longitude;
      locationTemplate.data.attributes.locationTypeID =
        TestLocationTypes.Point_Location;
      locationTemplate.data.attributes.name = name;
    } else if (locationType === TestLocationTypes.Segment_Location) {
      locationTemplate.data.attributes.secondaryLatitude = latitude;
      locationTemplate.data.attributes.secondaryLongitude = longitude;
      locationTemplate.data.attributes.segmentLabel =
        '152 Forsyth Street - 90 Bowery (Segment")';
      locationTemplate.data.attributes.segmentPrimaryLabel =
        '152 Forsyth St, New York, NY 10002, USA';
      locationTemplate.data.attributes.segmentSecondaryLabel =
        '90 Bowery #403, New York, NY 10013, USA';
      locationTemplate.data.attributes.segmentLength = '0.325176';
      locationTemplate.data.attributes.latitude = latitude;
      locationTemplate.data.attributes.longitude = longitude;
      locationTemplate.data.attributes.locationTypeID =
        TestLocationTypes.Segment_Location;
    }
    return locationTemplate;
  }
  async getLocationDetails(locationId: string) {
    const locationResponsePayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.LOCATION_ID.with(locationId),
      RequestMethod.GET,
    );
    notStrictEqual(
      locationResponsePayload.data,
      null,
      'response from api call to get location detail is null',
    );
    return locationResponsePayload;
  }
  async getLocationIdFromLocationDetails(locationDetail: {
    name: string;
    type: number;
  }): Promise<string> {
    const locationResponsePayload = await this.searchLocation(
      locationDetail.name,
      locationDetail.type,
    );
    notStrictEqual(
      locationResponsePayload.data,
      null,
      'response from api call to get location detail is null',
    );
    return locationResponsePayload.entityID;
  }
  async getLocationsWithUnits() {
    const locationUnitPayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.LOCATION_ID_SEARCH.with(
        locationQueryData.city,
        locationQueryData.country,
        locationQueryData.mode,
        locationQueryData.postalCode,
        locationQueryData.state,
        locationQueryData.streetName,
        locationQueryData.streetNo,
      ),
      RequestMethod.GET,
    );
    notStrictEqual(
      locationUnitPayload.data,
      null,
      'response from api call to get location detail is null',
    );
    return locationUnitPayload.data
      .filter((a) => a.id !== null)
      .map((a) => a.id);
  }
  async getRecordsPayloadForLocation(
    recordId: string,
    location: {name?: string; type: number; locationId?: string},
  ) {
    let locationData = null;
    const locationTemplate = locationPayload();
    if (location.type === TestLocationTypes.Segment_Location) {
      locationTemplate.data.attributes.locationID = location.locationId;
    } else {
      locationData = await this.searchLocation(location.name, location.type);
      locationTemplate.data.attributes.locationID = locationData.entityID;
    }

    locationTemplate.data.attributes.recordID = recordId;
    locationTemplate.data.attributes.locationTypeID = location.type;

    const locationDetails = await this.getLocationDetails(
      locationTemplate.data.attributes.locationID,
    );
    if (location.type === TestLocationTypes.Address_Location) {
      locationTemplate.data.attributes.streetNo =
        locationDetails.data.attributes.streetNo;
      locationTemplate.data.attributes.streetName =
        locationDetails.data.attributes.streetName;
      locationTemplate.data.attributes.city =
        locationDetails.data.attributes.city;
      locationTemplate.data.attributes.state =
        locationDetails.data.attributes.state;
      locationTemplate.data.attributes.country =
        locationDetails.data.attributes.country;
    } else if (location.type === TestLocationTypes.Segment_Location) {
      locationTemplate.data.attributes.secondaryLatitude =
        locationDetails.data.attributes.secondaryLatitude;
      locationTemplate.data.attributes.secondaryLongitude =
        locationDetails.data.attributes.secondaryLongitude;
      locationTemplate.data.attributes.segmentLabel =
        locationDetails.data.attributes.segmentLabel;
      locationTemplate.data.attributes.segmentPrimaryLabel =
        locationDetails.data.attributes.segmentPrimaryLabel;
      locationTemplate.data.attributes.segmentSecondaryLabel =
        locationDetails.data.attributes.segmentSecondaryLabel;
      locationTemplate.data.attributes.segmentLength =
        locationDetails.data.attributes.segmentLength;
    }
    locationTemplate.data.attributes.latitude =
      locationDetails.data.attributes.latitude;
    locationTemplate.data.attributes.longitude =
      locationDetails.data.attributes.longitude;
    return locationTemplate;
  }
  async promoteAdditionalLocation(
    recordId: string,
    primaryLocation: {name: string; type: number},
    locationToBePromoted: {name: string; type: number},
  ) {
    let additionallocID = null;
    if (primaryLocation) {
      additionallocID = await this.getLocationIdFromLocationDetails(
        primaryLocation,
      );
    }
    const locationTemplate = locationPayload();
    const locationData = await this.searchLocation(
      locationToBePromoted.name,
      locationToBePromoted.type,
    );
    locationTemplate.data.attributes.recordID = recordId;
    locationTemplate.data.attributes.locationTypeID = locationToBePromoted.type;
    locationTemplate.data.attributes.locationID = locationData.entityID;
    const locationDetails = await this.getLocationDetails(
      locationData.entityID,
    );
    if (locationToBePromoted.type === TestLocationTypes.Address_Location) {
      locationTemplate.data.attributes.streetNo =
        locationDetails.data.attributes.streetNo;
      locationTemplate.data.attributes.streetName =
        locationDetails.data.attributes.streetName;
      locationTemplate.data.attributes.city =
        locationDetails.data.attributes.city;
      locationTemplate.data.attributes.state =
        locationDetails.data.attributes.state;
      locationTemplate.data.attributes.country =
        locationDetails.data.attributes.country;
    }
    locationTemplate.data.attributes.latitude =
      locationDetails.data.attributes.latitude;
    locationTemplate.data.attributes.longitude =
      locationDetails.data.attributes.longitude;
    locationTemplate.data.attributes.additionalLocationIDs = additionallocID;

    const response = await makeCitApiRequest(
      locationTemplate,
      servicePath.paths.RECORDS.with(recordId),
      RequestMethod.PATCH,
    );
    notStrictEqual(response.data, null);
    strictEqual(
      response.data.attributes.locationID,
      locationData.entityID,
      'mismatch in primary location id',
    );
    if (primaryLocation) {
      strictEqual(
        response.data.attributes.additionalLocationIDs.toString(),
        additionallocID.toString(),
        'mismatch additional location id',
      );
    }
  }
  async deleteLocationById(locationId: string) {
    console.log(`Deleting location: ${locationId}`);
    await makeCitApiRequest(
      {},
      servicePath.paths.LOCATION_ID.with(locationId),
      RequestMethod.DELETE,
      {},
      true,
    );
  }
  async searchLocation(searchKey: string, locationType?: number) {
    let location: any;

    await expect
      .poll(
        async () => {
          const responseJson: any = await makeCitApiRequest(
            null,
            servicePath.paths.LOCATION_SEARCH.with(searchKey, locationType),
            RequestMethod.GET,
          );

          notStrictEqual(responseJson, null, 'No location data!');
          location = responseJson.find((d) => d.resultText === searchKey);
          notStrictEqual(location, null, `Location not found: ${searchKey}`);
          return location === undefined;
        },
        {
          message: `Failed to get location information for ${searchKey}`,
        },
      )
      .toBeFalsy();

    return location;
  }
}
