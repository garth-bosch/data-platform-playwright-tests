import {notStrictEqual} from 'assert';

import {
  makeCitApiRequest,
  makeCitNodeApiRequest,
  servicePath,
} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {DepartmentsApi} from './departmentsApi';
import {expect} from '../../base/base-test';
import {
  AttachmentsResult,
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  DocumentsResult,
  FormFieldResult,
  FormFieldTemplateResult,
  FormResult,
  ModeType,
  RecordPrefixType,
  RecordType,
  RecordTypeAccess,
  RecordTypeAppAccess,
  RecordTypeProperties,
  TemplateStepTypes,
} from './interfaces-and-data/default-payloads-interfaces';
import {DataGetters} from './interfaces-and-data/data-getters';

export class RecordTypesApi {
  async deleteRecordType(
    recordTypeID: string = baseConfig.citTempData.recordTypeId,
  ) {
    console.debug(`Deleting record type: ${recordTypeID}`);
    await makeCitNodeApiRequest(
      null,
      servicePath.paths.RECORD_TYPES.with(`${recordTypeID}`),
      RequestMethod.DELETE,
    );
    baseConfig.citTempData.recordTypeId = '';
  }

  async createRecordType(
    recordTypeName: string,
    departmentName = 'Test Department',
    recordTypeProps?: RecordTypeProperties,
  ): Promise<string> {
    const departmentId = await new DepartmentsApi().getDepartmentIdByName(
      departmentName,
    );
    let recPrefix = RecordPrefixType.ANNUAL; /*What should be default here?*/
    if (recordTypeProps?.recordPrefixType) {
      recPrefix = recordTypeProps.recordPrefixType;
    }

    const recordNumberSchemaID = await this.getRecordNumberSchemas(recPrefix);

    console.debug(`Creating record type with name : ${recordTypeName}`);
    const recordTypeRequest = {
      recordType: {
        name: recordTypeName,
        descriptionRequired: false,
        ApplyAccessID: 1,
        status: 0,
        categoryID: departmentId,
        isEnabled: true,
        applicant: false,
        location:
          !!recordTypeProps?.enableLocations ||
          !!recordTypeProps?.enableAdditionalLocations,
        allowProjects: false,
        offlinePayments: false,
        renews: false,
        allowAdditionalLocations: !!recordTypeProps?.enableAdditionalLocations,
        allowPointLocations: !!recordTypeProps?.locationTypesToEnable?.point,
        allowAddressLocations:
          !!recordTypeProps?.locationTypesToEnable?.address,
        allowSegmentLocations:
          !!recordTypeProps?.locationTypesToEnable?.segment,
        recordTypeChanged: false,
        category: departmentId,
        recordNumberSchemaID: recordNumberSchemaID,
        prefix: recPrefix,
      },
    };
    const response: RecordType = await makeCitNodeApiRequest(
      recordTypeRequest,
      servicePath.paths.RECORD_TYPES.with(''),
      RequestMethod.POST,
    );
    expect(response?.recordType?.recordTypeID).toBeDefined();
    expect(response?.recordType?.recordTypeID).not.toBeNull();

    const recordTypeId = (baseConfig.citTempData.recordTypeId = String(
      response.recordType.recordTypeID,
    ));

    console.debug(
      `Saved record type ID: ${baseConfig.citTempData.recordTypeId}`,
    );

    if (recordTypeProps?.publish) {
      await this.makeRecordTypePublic(
        recordTypeId,
        recordTypeName,
        departmentId,
        {
          allowAddressLocations:
            !!recordTypeProps?.locationTypesToEnable?.address,
          allowPointLocations: !!recordTypeProps?.locationTypesToEnable?.point,
          allowSegmentLocations:
            !!recordTypeProps?.locationTypesToEnable?.segment,
          allowAdditionalLocations:
            !!recordTypeProps?.enableAdditionalLocations,
        },
        recordNumberSchemaID,
      );
    }
    if (recordTypeProps?.employeeAccess) {
      await this.changeRecordTypeAccess(
        recordTypeId,
        recordTypeProps.employeeAccess,
      );
    }
    if (recordTypeProps?.workflowStepsToAdd?.approval) {
      await this.createTemplateStep(recordTypeId, TemplateStepTypes.Approval);
    }
    if (recordTypeProps?.workflowStepsToAdd?.inspection) {
      await this.createTemplateStep(recordTypeId, TemplateStepTypes.Inspection);
    }
    if (recordTypeProps?.workflowStepsToAdd?.payment) {
      await this.createTemplateStep(recordTypeId, TemplateStepTypes.Payment);
    }
    if (recordTypeProps?.workflowStepsToAdd?.document) {
      await this.createTemplateStep(recordTypeId, TemplateStepTypes.Document);
    }

    return recordTypeId.toString();
  }

  async createTemplateStep(
    recordTypeId: string,
    stepType: TemplateStepTypes,
    additionalParams?: {
      label?: string;
      isRenewal?: boolean;
      isParallel?: boolean;
    },
  ) {
    console.debug(
      `Creating ${TemplateStepTypes[stepType]} record step template`,
    );
    const templateStepRequest = {
      templateStep: {
        recordTypeID: recordTypeId,
        label: additionalParams?.label || TemplateStepTypes[stepType],
        stepTypeID: stepType,
        orderNo: 1,
        sequence: additionalParams?.isParallel ? 0 : 1,
        isEnabled: 1,
        isRenewal: !!additionalParams?.isRenewal,
        deadlineEnabled: false,
        deadlineAutoCompletes: false,
        deadlineAlerts: false,
      },
    };
    const res: any = await makeCitNodeApiRequest(
      templateStepRequest,
      servicePath.paths.RECORD_TYPE_TEMPLATE_STEPS,
      RequestMethod.POST,
    );
    notStrictEqual(res.templateStep.id, null);
  }

  async updateRecordType(
    recordTypeId: string,
    updatePayload: {
      recordType: Record<string, unknown>;
    },
  ) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      subdomain: 'qa-conditions',
    };
    console.debug(`Updating record type id : ${recordTypeId}`);
    console.debug('Payload: ' + JSON.stringify(updatePayload));
    const res: any = await makeCitNodeApiRequest(
      updatePayload,
      servicePath.paths.RECORD_TYPES.with(recordTypeId),
      RequestMethod.PUT,
      headers,
    );
    notStrictEqual(res.recordTypeID, null);
  }

  async deleteFormField(formFiledID: string) {
    const response: any = await makeCitApiRequest(
      null,
      servicePath.paths.FORM_FIELDS + formFiledID,
      RequestMethod.DELETE,
    );
    notStrictEqual(response.data, null);
  }

  async getFormField(formFiledID: string) {
    const response: FormFieldResult = await makeCitApiRequest(
      null,
      servicePath.paths.FORM_FIELDS + formFiledID,
      RequestMethod.GET,
    );
    notStrictEqual(response.data, null);
    notStrictEqual(response.data.attributes, null);
    return response;
  }

  async updateFormField(formFiledID: string, formField: FormFieldResult) {
    const response: any = await makeCitApiRequest(
      formField,
      servicePath.paths.FORM_FIELDS + formFiledID,
      RequestMethod.PATCH,
    );
    notStrictEqual(response.data, null);
  }

  async reorderFormFields(formFieldId_1: string, formFieldId_2: string) {
    const formField_1 = await this.getFormField(formFieldId_1);
    const formField_2 = await this.getFormField(formFieldId_2);
    const orderNo_ff1 = formField_1.data.attributes.orderNo;
    formField_1.data.attributes.orderNo = formField_2.data.attributes.orderNo;
    formField_2.data.attributes.orderNo = orderNo_ff1;
    await this.updateFormField(formFieldId_1, formField_1);
    await this.updateFormField(formFieldId_2, formField_2);
  }
  async makeRecordTypePublic(
    recordTypeId: string,
    recordTypeName: string,
    departmentId: string,
    locationsData?: {
      allowPointLocations: boolean;
      allowAddressLocations: boolean;
      allowSegmentLocations: boolean;
      allowAdditionalLocations: boolean;
    },
    recordNumberSchemaID?: string,
  ) {
    console.debug(`Publishing record type id : ${recordTypeId}`);
    // All the properties are required.
    // Also, the payload is not the same as any previous response from the /recordTypes endpoint.
    const updatePayload = {
      recordType: {
        recordTypeID: parseInt(recordTypeId),
        name: recordTypeName,
        categoryID: parseInt(departmentId),
        category: departmentId,
        descriptionLabel: '',
        recordNumberSchemaID: recordNumberSchemaID
          ? recordNumberSchemaID
          : await this.getRecordNumberSchemas(),
        ApplyAccessID: 1,
        ViewAccessID: 0,
        status: 1,
        htmlcontent: null,
        orderNo: null,
        isEnabled: true,
        applicant: true,
        location: true,
        maxLocations: 1,
        allowProjects: false,
        offlinePayments: false,
        renews: false,
        allowPointLocations: !!locationsData.allowPointLocations,
        pointLocationsHelpText: null,
        allowAddressLocations: !!locationsData.allowAddressLocations,
        addressLocationsHelpText: null,
        allowSegmentLocations: !!locationsData.allowSegmentLocations,
        segmentLocationsHelpText: null,
        allowAdditionalLocations: !!locationsData.allowAdditionalLocations,
        automaticExpirationDateExtension: false,
        adHocAttachmentViewAccessID: 3,
      },
    };
    await this.updateRecordType(recordTypeId, updatePayload);
  }

  /* use addDocuments method to Add Document in Record Type */
  async addDocuments(documentObjectGiven?: any | DocumentsResult) {
    const finalPayload = await new DataGetters().getDefaultDocumentPayload(
      documentObjectGiven,
    );
    const res: DocumentsResult = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.DOC_TEMPLATES,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.addDocumentToRTResult.push(res);
    notStrictEqual(res.docTemplate.docTemplateID, null);
  }

  /* use addAttachment method to Add Attachment in Record Type */
  async addAttachment(attachmentObjectGiven?: AttachmentsResult) {
    const finalPayload = await new DataGetters().getDefaultAttachmentPayload(
      attachmentObjectGiven,
    );
    const res: AttachmentsResult = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.ATTACHMENTS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.addAttachmentToRTResult.push(res);
    notStrictEqual(res.attachment.attachmentID, null);
  }

  /* use addFormSection method to Add Form Section in Record Type */
  async addFormSection(formSectionObjectGiven: FormResult) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      subdomain: 'qa-conditions',
    };
    const defaultPayloadForFormSection = JSON.parse(
      JSON.stringify(defaultFormSectionObject),
    );
    const finalPayload = {
      ...defaultPayloadForFormSection,
      ...formSectionObjectGiven,
    };
    const res: FormResult = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.FORM_SECTIONS,
      RequestMethod.POST,
      headers,
    );
    baseConfig.citIndivApiData.addFormToRTResult.push(res);
    notStrictEqual(res.formSection.formSectionID, null);
    return Number(res.formSection.formSectionID);
  }

  async patchFormFieldSection(formSectionObjectGiven: FormResult) {
    const defaultPayloadForFormSection = JSON.parse(
      JSON.stringify(defaultFormSectionObject),
    );
    const finalPayload = {
      ...defaultPayloadForFormSection,
      ...formSectionObjectGiven,
    };
    const res: FormResult = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.FORM_SECTIONS_ID.with(
        defaultPayloadForFormSection.formSection.formSectionID,
      ),
      RequestMethod.PUT,
    );
  }

  /* use addFieldToFormSection method to Add Form Field in Form Section */
  async addFieldToFormSection(formSectionObjectGiven: FormFieldResult) {
    const defaultPayl = JSON.parse(
      JSON.stringify(defaultPayloadForFormFieldsObject),
    );
    const finalPayload = {
      ...defaultPayl,
      ...formSectionObjectGiven,
    };
    const res: FormFieldResult = await makeCitApiRequest(
      finalPayload,
      servicePath.paths.FORM_FIELDS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.addFieldToFormToRTResult.push(res);
    notStrictEqual(res.data.attributes.formFieldID, null);
    return Number(res.data.attributes.formFieldID);
  }

  /* use addFieldToFormSection method to Add Form Field in Form Section */
  async addFieldConditionToFieldSection(
    formFieldSectionObjectGiven: FormFieldTemplateResult,
  ) {
    const finalPayload = await new DataGetters().getDefaultFormFieldCondition(
      formFieldSectionObjectGiven,
    );
    const res: FormFieldTemplateResult = await makeCitApiRequest(
      finalPayload,
      servicePath.paths.CONDITION_TEMPLATES,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.addConditionToFormFieldToRTResult.push(res);
    notStrictEqual(res.data.attributes.conditionTemplateID, null);
  }

  /* _____________      */
  async getRecordTypeById(
    recordTypeId: string,
  ): Promise<Record<string, unknown>> {
    const response: any = await makeCitNodeApiRequest(
      null,
      servicePath.paths.RECORD_TYPES.with(recordTypeId),
      RequestMethod.GET,
    );
    expect(response?.recordTypes).toBeDefined();
    expect(response?.recordTypes).not.toBeNull();
    expect(response.recordTypes.length).toBeGreaterThan(0);

    return response.recordTypes[0];
  }

  async changeRecordTypeAccess(
    recordTypeId: string,
    employeeAccess: RecordTypeAccess,
  ) {
    console.debug(
      `Changing record type access to ${RecordTypeAccess[employeeAccess]}`,
    );

    const recordTypeData: any = await this.getRecordTypeById(recordTypeId);
    expect(recordTypeData?.recordTypeAdminItems).toBeDefined();
    expect(recordTypeData?.recordTypeAdminItems).not.toBeNull();
    expect(recordTypeData.recordTypeAdminItems.length).toBeGreaterThan(0);

    const recordTypeAdminId = recordTypeData.recordTypeAdminItems[0];
    expect(recordTypeAdminId).toBeDefined();
    expect(recordTypeAdminId).not.toBeNull();

    const requestBody = {
      data: {
        id: recordTypeAdminId,
        type: 'record-type-admins',
        attributes: {
          recordTypeAdminID: parseInt(recordTypeAdminId),
          recordTypeID: parseInt(recordTypeId),
          entityID: '0',
          assignmentType: 0,
          recordTypeAccessLevelID: employeeAccess,
        },
      },
    };

    const response: any = await makeCitApiRequest(
      requestBody,
      servicePath.paths.RECORD_TYPE_ADMINS.with(recordTypeAdminId),
      RequestMethod.PATCH,
    );
    expect(response?.data?.attributes?.access_level).toBeDefined();
    expect(response?.data?.attributes?.access_level).not.toBeNull();
    expect(
      response.data.attributes.access_level.replace('_', ' ').toLowerCase(),
    ).toEqual(RecordTypeAccess[employeeAccess].toLowerCase());
  }

  async appAccessSetting(
    recordTypeId: string,
    clientId: string,
    appAccess: RecordTypeAppAccess,
    modeType: ModeType,
  ) {
    console.debug(`Modifying record type access to ${appAccess}`);
    const recordTypeData: any = await this.getRecordTypeById(recordTypeId);
    expect(recordTypeData?.recordTypeAdminItems).toBeDefined();
    expect(recordTypeData?.recordTypeAdminItems).not.toBeNull();
    expect(recordTypeData.recordTypeAdminItems.length).toBeGreaterThan(0);

    const recordTypeAdminId = recordTypeData.recordTypeAdminItems[0];
    expect(recordTypeAdminId).toBeDefined();
    expect(recordTypeAdminId).not.toBeNull();

    const requestBody = {
      data: {
        type: 'record-type-admins',
        attributes: {
          recordTypeAdminID: parseInt(recordTypeAdminId),
          recordTypeID: parseInt(recordTypeId),
          entityID: `${clientId}@clients`,
          assignmentType: 0,
          recordTypeAccessLevelID: appAccess,
        },
      },
    };
    let response: any;
    if (modeType == ModeType.MODIFY) {
      response = await makeCitApiRequest(
        requestBody,
        servicePath.paths.RECORD_TYPE_ADMINS.with(recordTypeAdminId),
        RequestMethod.PATCH,
      );
    } else {
      response = await makeCitApiRequest(
        requestBody,
        servicePath.paths.RECORD_TYPE_ADMIN,
        RequestMethod.POST,
      );
    }
    expect(response?.data?.attributes?.recordTypeAccessLevelID).toBeDefined();
    expect(response?.data?.attributes?.recordTypeAccessLevelID).not.toBeNull();
    expect(response.data.attributes.recordTypeAccessLevelID).toEqual(appAccess);
  }

  async getAttachments(recordType: {id: number | string}): Promise<Array<any>> {
    const response: any = await makeCitNodeApiRequest(
      null,
      servicePath.paths.ATTACHMENTS_BY_RECORD_TYPE.with(
        recordType.id.toString(),
      ),
      RequestMethod.GET,
      {usertype: 2},
    );
    notStrictEqual(response, null);
    notStrictEqual(response.attachments, null);

    return response.attachments;
  }

  async getRecordNumberSchemas(
    recordNumberSchemaTypeID: RecordPrefixType = RecordPrefixType.BASIC,
  ) {
    console.debug(
      `Submitting record in ${RecordPrefixType[RecordPrefixType.BASIC]} stage`,
    );
    const recordPayload: any = await makeCitApiRequest(
      null,
      servicePath.paths.RECORD_NUMBER_SCHEMAS.with(recordNumberSchemaTypeID),
      RequestMethod.GET,
    );
    expect(recordPayload?.data).toBeDefined();
    expect(recordPayload.data.length).toBeGreaterThan(0);
    expect(
      recordPayload.data[0].attributes?.recordNumberSchemaID,
    ).toBeDefined();
    expect(
      recordPayload.data[0].attributes.recordNumberSchemaID,
    ).not.toBeNull();
    return recordPayload.data[0].attributes.recordNumberSchemaID.toString();
  }
}
