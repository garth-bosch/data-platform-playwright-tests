import retry from 'async-retry';
import * as assert from 'assert';
import {notStrictEqual, strictEqual} from 'assert';
import {
  makeCitApiRequest,
  makeCitNodeApiRequest,
  servicePath,
} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {CommonApi} from './commonApi';
import {
  TestLocationTypes,
  TestRecordTypes,
} from '../../constants/cit-constants';
import {LocationsApi} from './locationsApi';
import {expect} from '../../base/base-test';
import {RecordPayloadOrResult} from './interfaces-and-data/default-payloads-interfaces';

const retryOps = {
  retries: 5,
  minTimeout: 10000,
  maxTimeout: 20000,
};

export enum stepStatus {
  Reject = -1,
  Inactive = 0,
  Active = 1,
  Complete = 2,
  Skip = 3,
  OnHold = 4,
}

const archiveRecordTemplate = {
  data: {
    id: '99999 - same as record id',
    attributes: {
      isDeletingRecord: true,
      deleted: true,
      recordID: 99999,
      isEnabled: false,
      deactivationMode: true,
      status: 1,
      deletionReason: `Default Reason`,
      lastUpdatedByUserID: `auth0|ReplaceValues here`,
      lastUpdatedDate: `${new Date().toISOString()}`,
      recordNumber: 990011,
      recordNo: '990011-same as above',
    },
    type: 'records',
  },
};
const baseRecordTemplate = () => {
  return {
    data: {
      attributes: {
        recordID: null,
        isEnabled: false,
        formComplete: false,
        isDeletingRecord: false,
        isSubmittingRecord: false,
        recordTypeID: null,
        recordTypeName: null,
        applicantFirstName: null,
        applicantLastName: null,
        applicantUserID: null,
        locationTypeID: null,
        latitude: null,
        longitude: null,
        locationID: null,
        streetNo: null,
        streetName: null,
        city: null,
        state: null,
        country: null,
      },
    },
  };
};

export class RecordsApi {
  private recordId: string;
  private recordPayload: RecordPayloadOrResult;

  /**
   * @param formFields.fieldValue if the field is Checkbox - should be 'true' or 'false'.
   *                              If Number - '1234'. If Date - value in format 'dd/mm/yyyy'.
   * @param formFields.fieldType  is not required for any Text, Number, Checkbox but required for
   *                              SSN, EID, Signature to make them behave as usual.
   */
  async createRecordWith(
    recordType: {name: string; id: number},
    applicantEmail?: string,
    locationData?: {name: string; type: number},
    formFields?: {
      fieldName: string;
      fieldValue: string;
      fieldType?: FormFieldType;
    }[],
  ) {
    await this.submitRecordDraft(recordType, applicantEmail, locationData);

    if (formFields) {
      for (const field of formFields) {
        await this.fillFormFieldForRecord(this.recordId, {
          name: field.fieldName,
          value: field.fieldValue,
          type: field.fieldType,
        });
      }
    }

    await this.submitFinalRecord();
    // Useful while developing tests. Very useful while putting breakpoints outside of pages.
    return [this.recordPayload, this.recordId];
  }

  async submitRecordDraft(
    recordType: {name: string; id: number},
    applicantEmail?: string,
    location?: {name: string; type: number},
  ) {
    const recordBodyTemplate = baseRecordTemplate();
    recordBodyTemplate.data.attributes.recordTypeID = recordType.id;
    recordBodyTemplate.data.attributes.recordTypeName = `${recordType.name}`;
    if (applicantEmail) {
      const userData = await this.getUserData(applicantEmail);
      recordBodyTemplate.data.attributes.applicantUserID = userData.id;
      recordBodyTemplate.data.attributes.applicantFirstName =
        userData.firstName;
      recordBodyTemplate.data.attributes.applicantLastName = userData.lastName;
    }
    if (location) {
      const locationData = await new LocationsApi().searchLocation(
        location.name,
        location.type,
      );
      recordBodyTemplate.data.attributes.locationTypeID = location.type;
      recordBodyTemplate.data.attributes.locationID = locationData.entityID;
      const locationDetails = await new LocationsApi().getLocationDetails(
        locationData.entityID,
      );
      if (location.type === TestLocationTypes.Address_Location) {
        recordBodyTemplate.data.attributes.streetNo =
          locationDetails.data.attributes.streetNo;
        recordBodyTemplate.data.attributes.streetName =
          locationDetails.data.attributes.streetName;
        recordBodyTemplate.data.attributes.city =
          locationDetails.data.attributes.city;
        recordBodyTemplate.data.attributes.state =
          locationDetails.data.attributes.state;
        recordBodyTemplate.data.attributes.country =
          locationDetails.data.attributes.country;
      }
      recordBodyTemplate.data.attributes.latitude =
        locationDetails.data.attributes.latitude;
      recordBodyTemplate.data.attributes.longitude =
        locationDetails.data.attributes.longitude;
    }
    this.recordId = await this.submitRecord(
      recordBodyTemplate,
      '',
      'DRAFT',
      RequestMethod.POST,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.recordPayload = recordBodyTemplate;
    baseConfig.citTempData.recordId = this.recordId;
    await this.updateAttachmentDraft(this.recordId);
  }

  async submitFinalRecord() {
    console.debug(`Patching record for submission`);
    this.recordPayload.data.attributes.recordID = this.recordId;
    this.recordPayload.data.attributes.isSubmittingRecord = true;
    this.recordPayload.data.attributes.formComplete = true;
    this.recordPayload.data.attributes.isEnabled = true;
    this.recordPayload.data.attributes.isEnabled = true;

    await this.submitRecord(
      this.recordPayload,
      this.recordId,
      'FINAL',
      RequestMethod.PATCH,
    );
  }

  async submitRecord(
    requestPayload: any,
    recordId: string,
    mode: string,
    method: RequestMethod,
  ) {
    console.debug(`Submitting record in ${mode} stage`);
    const recordPayloadSubmitRec: any = await makeCitApiRequest(
      requestPayload,
      servicePath.paths.RECORDS.with(recordId),
      method,
    );
    notStrictEqual(recordPayloadSubmitRec.data.attributes.recordID, null);
    notStrictEqual(recordPayloadSubmitRec.data.attributes.status, null);
    const submittedRecordId =
      recordPayloadSubmitRec.data.attributes.recordID.toString();
    if (mode === 'FINAL') {
      notStrictEqual(recordPayloadSubmitRec.data.attributes.recordNumber, null);
      baseConfig.citTempData.recordName =
        recordPayloadSubmitRec.data.attributes.recordNumber.toString();
      if (
        recordPayloadSubmitRec.data.attributes.status !== RecordStatuses.Active
      ) {
        await this.fetchRecordAndMatchStatus(recordId, RecordStatuses.Active);
      }
      baseConfig.citMultiRecordData.push(recordPayloadSubmitRec);
    }

    /* For use with multi record create*/
    return submittedRecordId;
  }

  async updateAttachmentDraft(
    recordId: string = baseConfig.citTempData.recordId,
  ) {
    await makeCitApiRequest(
      null,
      servicePath.paths.RECORD_ATTACHMENT_DRAFT.with(recordId),
      RequestMethod.GET,
      null,
      true,
    );
  }

  async fetchRecordAndMatchStatus(recordId: string, status: number) {
    await retry(async () => {
      // Workaround if initial PATCH response doesn't return the correct status.
      // We will retry only if status code = 200
      const fetchRecordResponse = await makeCitApiRequest(
        null,
        servicePath.paths.RECORDS.with(recordId),
        RequestMethod.GET,
      );
      // We ensure record has correct status.
      // Could be complete/active.
      strictEqual(
        [status, RecordStatuses.Complete].includes(
          fetchRecordResponse.data.attributes.status,
        ),
        true,
      );
    }, retryOps);
  }

  async getUserData(userEmail: string) {
    console.debug(`Getting user data for ${userEmail}`);
    const userData = {
      email: userEmail,
      id: null,
      lastName: null,
      firstName: null,
    };
    const userPayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.USERS_BY_EMAIL.with(userEmail),
      RequestMethod.GET,
    );
    notStrictEqual(userPayload.data[0].id, null);
    notStrictEqual(userPayload.data[0].attributes.lastName, null);
    notStrictEqual(userPayload.data[0].attributes.firstName, null);
    userData.id = userPayload.data[0].id;
    userData.lastName = userPayload.data[0].attributes.lastName;
    userData.firstName = userPayload.data[0].attributes.firstName;
    return userData;
  }

  async addGuestToRecord(guestEmail: string) {
    const recordId = baseConfig.citTempData.recordId;

    console.debug(`Adding a guest "${guestEmail}" to the record: ${recordId}`);
    const guestPayload = {
      community: process.env.PLC_TEST_ENV,
      currentUserID: null,
      guestEmail: guestEmail,
      recordID: recordId,
    };

    const response: any = await makeCitApiRequest(
      guestPayload,
      servicePath.paths.RECORD_GUESTS,
      RequestMethod.POST,
      {sourceapp: 'ea'},
    );
    notStrictEqual(response.data.id, null);
    strictEqual(response.data.type, 'record_guests');
    strictEqual(response.data.attributes.isEnabled, true);
    notStrictEqual(response.data.attributes.guestID, null);
  }

  async addAdhocStep(
    stepType: string,
    stepName: string,
    expectedStepStatus: stepStatus = stepStatus.Active,
  ) {
    const recordId = baseConfig.citTempData.recordId;
    const payload: any = {
      data: {
        type: 'record-steps',
        attributes: {
          recordID: recordId,
          label: stepName,
          stepTypeID: RecordStep[stepType],
          publicCanRequest: true,
          stepActivatedDate: new Date().toString(),
          isEnabled: true,
          visible: true,
          status: expectedStepStatus,
        },
      },
    };

    if (RecordStep[stepType] === RecordStep.Document) {
      const userData = await this.getUserData(
        baseConfig.citTestData.citAdminEmail,
      );

      payload.data.attributes.docTemplateID =
        TestRecordTypes.Record_Steps_Test.docTemplateID;
      payload.data.attributes.assignedToUserID = userData.id;
      payload.data.attributes.docTitle = stepName;
      payload.data.attributes.label = stepName;
      payload.data.attributes.autoAssign = true;
      payload.data.attributes.expiresAfter = false;
      payload.data.attributes.forceReload = false;
      payload.data.attributes.html = '';
      payload.data.attributes.publicCanPrint = true;
      payload.data.attributes.publicCanRequest = null;
      payload.data.attributes.unassign = false;
      payload.data.attributes.status = 2;
      payload.data.attributes.showToPublic = 1;
      payload.data.attributes.sequence = false;
      payload.data.attributes.unread = false;
    }
    const response: any = await makeCitApiRequest(
      payload,
      servicePath.paths.RECORD_STEPS,
      RequestMethod.POST,
    );
    notStrictEqual(response.data.id, null);
    strictEqual(response.data.type, 'record_steps');
    strictEqual(response.data.attributes.isEnabled, true);
    strictEqual(response.data.attributes.label, stepName);
    // tslint:disable-next-line: no-string-literal
    notStrictEqual(response.data.attributes['record_StepID'], null);
  }

  async deleteRecord(recordId = baseConfig.citTempData.recordId) {
    console.debug(`Deleting record: ${recordId}`);
    await makeCitApiRequest(
      null,
      servicePath.paths.RECORDS.with(recordId),
      RequestMethod.DELETE,
    );
  }

  async getAssignedTasks(order: string) {
    const userData = await this.getUserData(
      baseConfig.citTestData.citAdminEmail,
    );
    const response: any = await makeCitApiRequest(
      null,
      servicePath.paths.ASSIGNED_TASKS.with(userData.id, order),
      RequestMethod.GET,
    );
    return response;
  }

  async archiveRecord(
    recordId = baseConfig.citTempData.recordId,
    recordNumber = baseConfig.citTempData.recordNumber,
    deletionReason = 'Default deletion reason',
    withUser = 'api_admin@opengov.com',
  ) {
    const givenTemplate = archiveRecordTemplate;
    givenTemplate.data.attributes.recordNo = recordNumber;
    givenTemplate.data.attributes.recordNumber = Number(recordNumber);
    givenTemplate.data.id = recordNumber;
    givenTemplate.data.attributes.recordID = Number(recordId);
    const userData = await this.getUserData(withUser);
    givenTemplate.data.attributes.deletionReason = deletionReason;
    givenTemplate.data.attributes.lastUpdatedByUserID = userData.id;
    console.debug(`Deleting record: ${recordId}`);
    await makeCitApiRequest(
      givenTemplate,
      servicePath.paths.RECORDS.with(recordId),
      RequestMethod.PATCH,
    );
  }

  async checkRecordStepIsActive(stepToCheck: string, recordId: string) {
    console.debug('Making sure step is active');
    const recordSteps: any = await makeCitApiRequest(
      null,
      servicePath.paths.RECORD_STEPS_BY_RECORD.with(recordId),
      RequestMethod.GET,
    );
    notStrictEqual(recordSteps.data, null);
    const isVisible = recordSteps.data.find(
      (d) => d.attributes.label === stepToCheck,
    ).attributes.visible;
    strictEqual(isVisible, true);
    console.debug(`Your ${stepToCheck} step is now active`);
  }

  async getFormFieldsFromRecord(
    recordId: string,
  ): Promise<Array<{fieldLabel: string; fieldId: string}>> {
    recordId = recordId ? recordId : baseConfig.citTempData.recordId;

    const formFieldsPayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.FORM_FIELDS_BY_RECORD.with(recordId.toString()),
      RequestMethod.GET,
    );
    expect(formFieldsPayload?.data).toBeDefined();
    expect(formFieldsPayload.data).not.toBeNull();

    return formFieldsPayload.data.map((e) => {
      return {
        fieldLabel: e.attributes.fieldLabel,
        fieldId: e.attributes.formFieldID,
      };
    });
  }

  /**
   * @param fieldData.value if the field is Checkbox - should be 'true' or 'false'.
   *                        If Number - '1234'. If Date - value in format 'dd/mm/yyyy'.
   * @param fieldData.type  is required for SSN, EID, Signature
   */
  async fillFormFieldForRecord(
    recordId: string,
    fieldData: {name: string; value: string; type?: FormFieldType},
  ) {
    console.debug(`Fetching form fields from record ${recordId}`);
    const listFormFields = await this.getFormFieldsFromRecord(recordId);

    const formField = listFormFields.find(
      (d) => d.fieldLabel === fieldData.name,
    );
    expect(formField).toBeDefined();
    console.debug(`Form field ID is: ${formField.fieldId}`);

    console.debug(`Fetching form field entries from record ${recordId}`);
    const formFieldsEntryPayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.FORM_FIELDS_ENTRIES_BY_RECORD.with(recordId.toString()),
      RequestMethod.GET,
    );
    expect(formFieldsEntryPayload?.data).toBeDefined();
    expect(formFieldsEntryPayload.data).not.toBeNull();

    const formEntry = formFieldsEntryPayload.data.find(
      (d) => d.attributes.formFieldID === formField.fieldId,
    );
    expect(formEntry?.attributes?.formFieldEntryID).toBeDefined();
    expect(formEntry.attributes.formFieldEntryID).not.toBeNull();

    const formEntryId = formEntry.attributes.formFieldEntryID;

    console.debug(`Form field entry ID is: ${formEntryId}`);
    console.debug(`Submitting form fields ${fieldData.name}`);

    const formFieldEntryBody = {
      data: {
        id: `${formEntryId}`,
        attributes: {
          dataType: fieldData.type,
          formFieldEntryID: `${formEntryId}`,
          formFieldID: `${formField.fieldId}`,
          recordID: `${recordId}`,
          value: `${fieldData.value}`,
          esignature: null,
        },
      },
    };

    if (fieldData.type === FormFieldType.SIGNARUTE) {
      formFieldEntryBody.data.attributes.value = 'true';
      formFieldEntryBody.data.attributes.esignature = fieldData.value;
    }

    const formFieldsEntryResponse: any = await makeCitApiRequest(
      formFieldEntryBody,
      servicePath.paths.ENTER_FORM_FIELDS_ENTRIES.with(formEntryId),
      RequestMethod.PATCH,
    );
    expect(
      formFieldsEntryResponse?.data?.attributes?.formFieldEntryID,
    ).toBeDefined();
    expect(
      formFieldsEntryResponse.data.attributes.formFieldEntryID,
    ).not.toBeNull();
  }

  async getRecordIdByNumber(recordNumber: string) {
    const results: any = await this.searchUsingGlobalBar(recordNumber);
    return results
      .filter((o) => o.resultText.replace('Record ', '') === recordNumber)[0]
      .entityID.toString();
  }

  async searchUsingGlobalBar(requestField: string): Promise<any> {
    const searchData = {
      criteria: 'searchbar',
      key: requestField,
    };
    const response: any = await makeCitNodeApiRequest(
      searchData,
      servicePath.paths.SEARCH_RESULTS,
      RequestMethod.POST,
      {usertype: 2}, // Search as Admin
    );
    notStrictEqual(response, null);
    notStrictEqual(response.searchResult, null);
    return response.searchResult;
  }

  async getRecordStepsForRecord(recordId: string) {
    const recordSteps: any = await makeCitApiRequest(
      null,
      servicePath.paths.RECORD_STEPS_BY_RECORD.with(recordId),
      RequestMethod.GET,
    );
    notStrictEqual(recordSteps.data, null);
    return recordSteps;
  }

  async getRecordStepByName(recordStepName: string, recordId: string) {
    const recordSteps: any = await this.getRecordStepsForRecord(recordId);
    const step = recordSteps.data.find(
      (d) => d.attributes.label === recordStepName,
    );
    notStrictEqual(step, null);
    return step;
  }

  async scheduleInspection(
    inspectionStepName: string,
    inspectorEmail: string,
    daysFromNow: number,
  ) {
    const recordStep: any = await this.getRecordStepByName(
      inspectionStepName,
      baseConfig.citTempData.recordId,
    );
    const recordStepId = recordStep.id;
    const userData: any = await this.getUserData(inspectorEmail);

    // Prepare date value in UTC
    const scheduleDate = new Date();
    // tslint:disable-next-line:restrict-plus-operands
    scheduleDate.setUTCDate(scheduleDate.getDate() + daysFromNow);
    scheduleDate.setUTCHours(12, 0, 0, 0);

    // Get the Community's timezone
    const communitySettings = await new CommonApi().getSystemSettings();
    notStrictEqual(communitySettings.timeZoneName, null);

    // Convert UTC value to the Community's timezone
    const scheduleDateString = scheduleDate.toLocaleString('en-US', {
      timeZone: communitySettings.timeZoneName,
    });

    const newLocal = `${scheduleDateString} UTC`;

    const inspectionEventBody = {
      inspectionEvent: {
        status: 2,
        isEnabled: false,
        record_StepID: recordStepId,
        inspectorUserID: `${userData.id}`,
        inspector: `${userData.id}`,
        inspectorFullName: `${userData.firstName} ${userData.lastName}`,
        // These fields not in UTC, but this format is required for the App
        scheduledDate: `${new Date(newLocal).toISOString()}`,
        scheduledTime: `${new Date(newLocal).toISOString()}`,
        note: 'Default Note',
      },
    };
    const inspectionEvent: any = await makeCitNodeApiRequest(
      inspectionEventBody,
      servicePath.paths.INSPECTION_EVENTS,
      RequestMethod.POST,
    );
    assert.notStrictEqual(inspectionEvent.inspectionEvents, null);
    notStrictEqual(inspectionEvent.inspectionEvents, null);

    return inspectionEvent.inspectionEvents[0].id;
  }

  async addPrimaryLocationToRecord(
    recordId: string,
    locationData: {name: string; type: number},
  ) {
    const recordPayload = await new LocationsApi().getRecordsPayloadForLocation(
      recordId,
      locationData,
    );
    await makeCitApiRequest(
      recordPayload,
      servicePath.paths.RECORDS.with(recordId),
      RequestMethod.PATCH,
    );
  }
}

export enum RecordStep {
  Approval = 1,
  Payment = 2,
  Document = 5,
  Inspection = 4,
}

export enum RecordStatuses {
  Active = 1,
  Complete = 2,
  Draft = 0,
  Stopped = -1,
}

export enum FormFieldType {
  SHORT_TEXT = 0,
  LONG_TEXT = 1,
  NUMBER = 2,
  CHECKBOX = 3,
  DROPDOWN = 4,
  DATE = 5,
  SSN = 7,
  EID = 8,
  SIGNARUTE = 9,
}
