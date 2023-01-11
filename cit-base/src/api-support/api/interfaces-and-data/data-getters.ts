import {
  AttachmentsResult,
  defaultAttachmentPayload,
  defaultDocumentPayload,
  defaultPayloadForFormFieldsConditionsObject,
  defaultPayloadForRenewal,
  defaultWorkflowStepTemplate,
  DocumentsResult,
  FormFieldTemplateResult,
  RecordType,
  RecordTypeWorkflowPayloadAndResponseBody,
} from './default-payloads-interfaces';
import {baseConfig} from '../../../base/base-config';
import {faker} from '@faker-js/faker';

export class DataGetters {
  /*___________________________________________________________  Renewal*/
  async getRenewalDefaults(givenData: any) {
    const defaultRenewalData = JSON.parse(
      JSON.stringify(defaultPayloadForRenewal),
    );
    const setdata: any = {};
    if (!givenData?.recordTypeID) {
      setdata.recordTypeID = baseConfig.citTempData.recordTypeId;
    }
    if (!givenData?.renews) {
      setdata.renews = false;
    }
    if (!givenData?.lastUpdatedByUserID) {
      setdata.lastUpdatedByUserID = '';
    }
    if (!givenData?.lastUpdatedByUser) {
      setdata.lastUpdatedByUser = '';
    }

    return {...defaultRenewalData, ...givenData, ...setdata};
  }

  /*___________________________________________________________  Workflow*/
  async getRtWorkflowDefaults(
    givenData: RecordTypeWorkflowPayloadAndResponseBody,
  ) {
    const defaultWorkflowData = JSON.parse(
      JSON.stringify(defaultWorkflowStepTemplate),
    );
    const setDataTemplate: any = {};
    let finalData: any = {};

    const templateStepRequestTemplate = defaultWorkflowData.templateStep;
    const templateStepRequestTemplateGiven = givenData.templateStep;

    if (!templateStepRequestTemplateGiven?.recordTypeID) {
      setDataTemplate.recordTypeId = Number(
        baseConfig.citTempData.recordTypeId,
      );
    }
    if (!templateStepRequestTemplateGiven?.template_StepID) {
      if (
        baseConfig.citIndivApiData.workflowTypeResult.length > 0 &&
        baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep
          .template_StepID > 0
      ) {
        setDataTemplate.template_StepID = String(
          baseConfig.citIndivApiData.workflowTypeResult.at(0).templateStep
            .template_StepID,
        );
      }
    }
    if (!templateStepRequestTemplateGiven?.label) {
      setDataTemplate.label = `Default_Step_Approval_${faker.random.alphaNumeric(
        4,
      )}`;
    }
    if (!templateStepRequestTemplateGiven?.helpText) {
      setDataTemplate.helpText = 'Default_Help_text_for_Approval';
    }

    if (!templateStepRequestTemplateGiven?.showToPublic) {
      setDataTemplate.showToPublic = true;
    }

    finalData = {
      ...templateStepRequestTemplate,
      ...templateStepRequestTemplateGiven,
      ...setDataTemplate,
    };
    defaultWorkflowData.templateStep = finalData;

    return defaultWorkflowData;
  }

  /*___________________________________________________________  Common*/
  async getRecTypeData(givenData) {
    const setData: any = {};
    if (undefined === givenData) {
      setData.recordTypeID = baseConfig.citTempData.recordTypeId;
      setData.recordType = `${baseConfig.citTempData.recordTypeId}`;
    }
    return setData;
  }

  /*___________________________________________________________  Document*/
  async getDefaultDocumentPayload(givenData: DocumentsResult | undefined) {
    const defaultPayloadForDocument = JSON.parse(
      JSON.stringify(defaultDocumentPayload),
    );
    const setData: any = this.getRecTypeData(givenData);
    return {
      ...defaultPayloadForDocument,
      ...givenData,
      ...setData,
    };
  }

  /*Todo why is this here .. which test*/
  async getDefaultLocationPayloadForRT(givenData: RecordType | undefined) {
    const defaultPayloadForRecordType = JSON.parse(
      JSON.stringify(defaultDocumentPayload),
    );
    const setData: any = this.getRecTypeData(givenData);
    return {
      ...defaultPayloadForRecordType,
      ...givenData,
      ...setData,
    };
  }

  /*___________________________________________________________  Attachments*/
  async getDefaultAttachmentPayload(givenData: AttachmentsResult) {
    const defaultPayloadForAttachment = JSON.parse(
      JSON.stringify(defaultAttachmentPayload),
    );
    const setData: any = this.getRecTypeData(givenData);

    return {
      ...defaultPayloadForAttachment,
      ...givenData,
      ...setData,
    };
  }

  /*___________________________________________________________________________________________ Form Fields*/

  /*___________________________________________________________  Form Field Templates*/
  async getDefaultFormFieldCondition(givenData: FormFieldTemplateResult) {
    const defaultPayloadForAttachment = JSON.parse(
      JSON.stringify(defaultPayloadForFormFieldsConditionsObject),
    );
    const setData = JSON.parse(
      JSON.stringify(defaultPayloadForFormFieldsConditionsObject),
    );
    if (!givenData.data.attributes?.recordTypeID) {
      setData.data.attributes.recordTypeID =
        baseConfig.citTempData.recordTypeId;
    }

    if (!givenData.data.attributes?.entityPrimaryKey) {
      setData.data.attributes.entityPrimaryKey =
        baseConfig.citIndivApiData.addFieldToFormToRTResult.at(
          0,
        ).data.attributes.formFieldID;
    }

    return {
      ...defaultPayloadForAttachment,
      ...givenData,
      ...setData,
    };
  }

  /*___________________________________________________________  Done*/
}
