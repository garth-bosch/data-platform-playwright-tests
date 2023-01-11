import {baseConfig} from '../../base/base-config';
import requestChangeQuery from '../api/test_data/requestChangeQuery.json';

import {
  fetchResponse,
  RequestMethod,
} from '@opengov/playwright-base/build/api-support/apiHelper';
import {expect} from '@playwright/test';
import {authenticateApi} from '../citApiHelper';

const accessToken = () => baseConfig.citApiConfig.accessToken;
const formsApiSubdomain = () => baseConfig.citApiConfig.formsApiSubdomain;
const formsApiUrl = () => baseConfig.citApiConfig.formsApiUrl;

const getFormQuery = {
  query: requestChangeQuery.getFormQuery.query,
  variables: {
    recordID: null,
  },
};
const createChangeRequestQuery = {
  query: requestChangeQuery.saveChangeRequestQuery.query,
  variables: {
    input: {
      requestNote: null,
      recordID: null,
      entities: null,
    },
  },
};

const submitChangeResponseQuery = {
  query: requestChangeQuery.submitChangeResponseQuery.query,
  variables: {
    input: {
      recordID: null,
      formChangeRequestID: null,
      entities: null,
    },
  },
};

// Applied for both Attachments and Form fields
type requestChangeEntryMandatoryData = {
  formEntityUniqueId: string;
  label: string;
};

export class FormsAPI {
  async getFormFieldsAndAttachments(recordId: number) {
    const results: {
      formFields: requestChangeEntryMandatoryData[];
      attachments: requestChangeEntryMandatoryData[];
    } = {
      formFields: [],
      attachments: [],
    };
    getFormQuery.variables.recordID = recordId.toString();

    const responseJson = await this.makeAGraphQlRequest(
      getFormQuery,
      formsApiSubdomain(),
    );
    expect(responseJson.data).not.toBeNull();

    //Get all form field Id
    expect(responseJson.data.amendedForm).not.toBeUndefined();
    expect(responseJson.data.amendedForm.sections).not.toBeUndefined();
    const section = responseJson.data.amendedForm.sections;
    if (section.length !== 0) {
      section.map((ele) => {
        const fieldGroups = ele.fieldGroups;
        fieldGroups.map((element) => {
          const fields = element.fields;
          fields.map((element) => {
            results.formFields.push({
              formEntityUniqueId: element.formEntityUniqueId,
              label: element.label,
            });
          });
        });
      });
    }
    //Get attachment Id
    expect(responseJson.data.amendedForm.attachments).not.toBeUndefined();
    const attachments = responseJson.data.amendedForm.attachments;
    if (attachments.length !== 0) {
      attachments.map((element) => {
        results.attachments.push({
          formEntityUniqueId: element.formEntityUniqueId,
          label: element.label,
        });
      });
    }

    return results;
  }

  private findFormFieldByName(
    actualFormFieldsList: requestChangeEntryMandatoryData[],
    expectedFormFieldLabel: string,
    isMultiEntryField?: boolean,
  ): requestChangeEntryMandatoryData {
    const foundFormField = actualFormFieldsList.find((ff) => {
      if (expectedFormFieldLabel === ff.label) {
        if (
          (isMultiEntryField &&
            ff.formEntityUniqueId.includes('MULTI_FIELD')) ||
          (!isMultiEntryField && ff.formEntityUniqueId.includes('SINGLE_FIELD'))
        ) {
          return true;
        }
      }
      return false;
    });
    expect(foundFormField).toBeDefined();
    expect(foundFormField).not.toBeNull();

    return foundFormField;
  }

  private findAttachmentByName(
    actualAttachmentsList: requestChangeEntryMandatoryData[],
    expectedAttachmentLabel: string,
  ): requestChangeEntryMandatoryData {
    const foundAttachment = actualAttachmentsList.find(
      (a) => expectedAttachmentLabel === a.label,
    );
    expect(foundAttachment).toBeDefined();
    expect(foundAttachment).not.toBeNull();

    return foundAttachment;
  }

  async createAChangeRequest(
    recordId: number,
    requestChangesBody: {
      formFieldsList?: {label: string; note?: string; isMultiEntry?: boolean}[];
      attachmentsList?: {label: string; note?: string}[];
    },
    overAllNote?: string,
  ): Promise<void> {
    const entitiesArray = [];

    console.debug(`Fetching form fields from record ${recordId}`);
    const data = await this.getFormFieldsAndAttachments(recordId);

    // Add form fields to the request payload
    if (requestChangesBody.formFieldsList) {
      requestChangesBody.formFieldsList.forEach((expectedFormField) => {
        const actualFormFiled = this.findFormFieldByName(
          data.formFields,
          expectedFormField.label,
          expectedFormField.isMultiEntry,
        );

        entitiesArray.push({
          id: actualFormFiled.formEntityUniqueId,
          entityNote: expectedFormField.note ? expectedFormField.note : '',
        });
      });
    }

    // Add attachments to the request payload
    if (requestChangesBody.attachmentsList) {
      requestChangesBody.attachmentsList.forEach((expectedAttachment) => {
        const actualAttachment = this.findAttachmentByName(
          data.attachments,
          expectedAttachment.label,
        );

        entitiesArray.push({
          id: actualAttachment.formEntityUniqueId,
          entityNote: expectedAttachment.note ? expectedAttachment.note : '',
        });
      });
    }

    createChangeRequestQuery.variables.input.requestNote = overAllNote;
    createChangeRequestQuery.variables.input.recordID = recordId;
    createChangeRequestQuery.variables.input.entities = entitiesArray;

    const responseJson = await this.makeAGraphQlRequest(
      createChangeRequestQuery,
      formsApiSubdomain(),
    );

    expect(
      responseJson?.data?.saveChangeRequest?.formChangeRequestID,
    ).toBeDefined();
    expect(
      responseJson.data.saveChangeRequest.formChangeRequestID,
    ).not.toBeNull();
    baseConfig.citTempData.formChangeRequestID =
      responseJson.data.saveChangeRequest.formChangeRequestID;
  }

  async submitAChangeResponse(
    recordId: string,
    applicantEmail: string,
    requestChangesBody: {
      formFieldsList?: {label: string; value: string; isMultiEntry?: boolean}[];
      attachmentsList?: {label: string; uploadedFile: string}[];
    },
  ): Promise<void> {
    const entitiesArray = [];

    console.debug(`Fetching form fields from record ${recordId}`);
    const data = await this.getFormFieldsAndAttachments(parseInt(recordId));

    // Add form fields to the request payload
    if (requestChangesBody.formFieldsList) {
      requestChangesBody.formFieldsList.forEach((expectedFormField) => {
        const actualFormFiled = this.findFormFieldByName(
          data.formFields,
          expectedFormField.label,
          expectedFormField.isMultiEntry,
        );

        entitiesArray.push({
          formEntityUniqueId: actualFormFiled.formEntityUniqueId,
          value: expectedFormField.value,
        });
      });
    }

    // Add attachments to the request payload
    if (requestChangesBody.attachmentsList) {
      requestChangesBody.attachmentsList.forEach((expectedAttachment) => {
        const actualAttachment = this.findAttachmentByName(
          data.attachments,
          expectedAttachment.label,
        );

        entitiesArray.push({
          formEntityUniqueId: actualAttachment.formEntityUniqueId,
          uploadedFile: expectedAttachment.uploadedFile,
        });
      });
    }

    submitChangeResponseQuery.variables.input.recordID = recordId.toString();
    submitChangeResponseQuery.variables.input.formChangeRequestID =
      baseConfig.citTempData.formChangeRequestID.toString();
    submitChangeResponseQuery.variables.input.entities = entitiesArray;

    const responseJson = await this.makeAGraphQlRequest(
      submitChangeResponseQuery,
      formsApiSubdomain(),
      applicantEmail,
    );

    expect(
      responseJson?.data?.applicantResponse?.success,
      JSON.stringify(responseJson),
    ).toBeDefined();
    expect(responseJson.data.applicantResponse.success).toBeTruthy();
  }

  async makeAGraphQlRequest(
    requestBody: any,
    subDomain?: string,
    applicantEmail?: string,
  ) {
    // If the applicantEmail specified, the function will return a token
    // but not save it to the shared variable
    const customToken = await authenticateApi(applicantEmail);

    const response = await fetchResponse(formsApiUrl(), {
      method: RequestMethod.POST,
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${applicantEmail ? customToken : accessToken()}`,
        'Content-Type': 'application/json',
        community: subDomain, //Feature limited to DB dev-narwhal
      },
    });
    return response.json();
  }
}
