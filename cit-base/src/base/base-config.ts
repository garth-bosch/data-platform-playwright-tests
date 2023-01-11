import 'dotenv/config';
import {GetUsers} from '../api-support/api/commonApi';
import {
  FeeStepResult,
  LocationStepResult,
  RecordStepResult,
} from '../api-support/api/recordStepsApi';
import {
  AttachmentsResult,
  DocumentsResult,
  FormFieldResult,
  FormFieldTemplateResult,
  FormResult,
  RecordPayloadOrResult,
  RecordType,
  RecordTypeWorkflowPayloadAndResponseBody,
  ReportsResult,
} from '../api-support/api/interfaces-and-data/default-payloads-interfaces';

export interface ICitApiConfig {
  audience: string;
  oAuthUrl: string;
  railsUrl: string;
  nodeUrl: string;
  subdomain: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  mandrillApiKey: string;
  mandrillUrl: string;
  storageContainer: string;
  storageAccount: string;
  storageUrl: string;
  formsApiUrl: string;
  formsApiSubdomain: string;
  oAuthManagementUrl: string;
  oAuthAppUrl: string;
  audienceOauthManager: string;
  appStoreGraphQlUrl: string;
  oAuthAccessToken: string;
  appStoreUserAccessToken: string;
}

export interface ICitTestData {
  citAdminEmail: string;
  citSuperUserEmail: string;
  citEmployeeEmail: string;
  citPlcMobileSuperuserEmail: string;
  citCitizenEmail: string;
  citNotificationUserEmail: string;
  citAppPassword: string;
  plcPrefix: string;
  needStrFrontUser: boolean;
  reAuthenticate: boolean;
}

export interface ICitIndivApiData {
  searchedUsersList?: GetUsers | null;
  docRecordStepResult?: RecordStepResult | null;
  approvalRecordStepResult?: RecordStepResult | null;
  inspectionRecordStepResult?: Array<RecordStepResult>;
  paymentRecordStepResult: RecordStepResult | null;
  feeStepResult: FeeStepResult | null;
  locationStepResult: LocationStepResult | null;
  workflowTypeResult: Array<RecordTypeWorkflowPayloadAndResponseBody>;
  addDocumentToRTResult: Array<DocumentsResult>;
  addAttachmentToRTResult: Array<AttachmentsResult>;
  addFormToRTResult: Array<FormResult>;
  addFieldToFormToRTResult: Array<FormFieldResult>;
  addConditionToFormFieldToRTResult: Array<FormFieldTemplateResult>;
  addRecordTypeResult: Array<RecordType>;
  citMultiRecordData: Array<RecordPayloadOrResult>;
  createReportResult: ReportsResult;
}

export interface ICitTempData {
  recordNumber: string;
  recordAddress: string;
  recordId: string;
  recordExpiryDate: string;
  recordName: string;
  stepId: string;
  projectTemplateName: string;
  departmentNameText: string;
  recordTypeId: string;
  cloneRecordTypeId: string;
  recordTypeName: string;
  reportId: string;
  reportName: string;
  formFieldId: string;
  addDueDateNum: string;
  inspectionScheduledDate: string;
  createdRecordStepName: string;
  createdUserEmail: string;
  inspectionName: string;
  locationId: string;
  projectId: string;
  flagId: string;
  /*Step related Additions*/
  step_CommentID: string;
  record_StepID: string;
  userID: string;
  lastUpdatedByUserID: string;
  feeId: string;
  formChangeRequestID: '';
  appClientSecret: string;
  appId: string;
}

export interface IBaseConfig {
  employeeAppUrl: string;
  storefrontUrl: string;
  citTestData: ICitTestData;
  citApiConfig: ICitApiConfig;
  citTempData: ICitTempData;
  citMultiRecordData: Array<RecordPayloadOrResult> /* Use this when creating multiple records and need to store data*/;
  citIndivApiData: ICitIndivApiData;
}

const citApiConfig: ICitApiConfig = {
  /** CIT Api endpoint. */
  railsUrl: `https://api.${process.env.PLC_TEST_SUBDOMAIN}.com/v2/${process.env.PLC_TEST_ENV}`,
  /** Auth0 endpoint to generate access token. */
  nodeUrl: `https://${process.env.PLC_TEST_ENV}.${process.env.PLC_TEST_SUBDOMAIN}.io`,
  subdomain: `${process.env.PLC_TEST_ENV}`,
  oAuthUrl: `https://${process.env.CIT_OAUTH_HOST}`,
  audience: `${process.env.CIT_OAUTH_AUDIENCE}`,
  clientId: `${process.env.CIT_OAUTH_CLIENT_ID}`,
  clientSecret: `${process.env.CIT_OAUTH_CLIENT_SECRET}`,
  accessToken: '',
  mandrillApiKey: `${process.env.CIT_MANDRILL_API_KEY}`,
  mandrillUrl: `https://mandrillapp.com/api/1.0`,
  storageContainer: 'vpc3-files-test',
  storageAccount: 'vpc3uploadedfiles',
  storageUrl: `https://vpc3uploadedfiles.blob.core.windows.net/vpc3-files-test`,
  formsApiUrl: `https://forms.vpctest.com/graphql`,
  formsApiSubdomain: `${process.env.PLC_FORMS_API_TEST_ENV}`,
  oAuthManagementUrl: `https://dev-viewpointcloud.auth0.com/oauth/token`,
  oAuthAppUrl: `https://dev-viewpointcloud.auth0.com/api/v2/clients`,
  audienceOauthManager: `https://dev-viewpointcloud.auth0.com/api/v2/`,
  appStoreGraphQlUrl: `https://api.plce.ogstaging.us/integrations/${process.env.PLC_TEST_ENV}/graphql`,
  oAuthAccessToken: '',
  appStoreUserAccessToken: '',
};

const citTestData: ICitTestData = {
  /** CIT Test Data. */
  citAdminEmail: `${process.env.PLC_ADMIN_USER_EMAIL}`,
  citSuperUserEmail: `${process.env.PLC_SUPER_USER_EMAIL}`,
  citEmployeeEmail: `${process.env.PLC_EMPLOYEE_USER_EMAIL}`,
  citCitizenEmail: `${process.env.PLC_STOREFRONT_USER_EMAIL}`,
  citPlcMobileSuperuserEmail: `${process.env.PLC_MOBILE_SUPER_ADMIN_USER_EMAIL}`,
  citNotificationUserEmail: `${process.env.PLC_NOTIFICATION_USER_EMAIL}`,
  citAppPassword: `${process.env.PLC_APP_TEST_PASSWORD}`,
  plcPrefix: 'plc_N_test',
  needStrFrontUser: false,
  reAuthenticate: false,
};

const citIndivApiData: ICitIndivApiData = {
  approvalRecordStepResult: null,
  paymentRecordStepResult: null,
  feeStepResult: null,
  searchedUsersList: null,
  docRecordStepResult: null,
  inspectionRecordStepResult: [],
  locationStepResult: null,
  workflowTypeResult: [],
  addDocumentToRTResult: [],
  addAttachmentToRTResult: [],
  addFormToRTResult: [],
  addFieldToFormToRTResult: [],
  addRecordTypeResult: [],
  citMultiRecordData: [],
  createReportResult: null,
  addConditionToFormFieldToRTResult: [],
};

const citTempData: ICitTempData = {
  /** CIT Test Data. */
  recordNumber: ``,
  recordAddress: `37 Fairmont Avenue, Waltham, MA`,
  recordId: '',
  recordExpiryDate: '',
  recordName: '',
  stepId: '',
  projectTemplateName: '',
  departmentNameText: '',
  recordTypeId: '',
  cloneRecordTypeId: '',
  recordTypeName: '',
  reportId: '',
  reportName: '',
  formFieldId: '',
  addDueDateNum: '',
  inspectionScheduledDate: '',
  createdRecordStepName: '',
  createdUserEmail: '',
  inspectionName: '',
  locationId: '',
  projectId: '',
  flagId: '',
  step_CommentID: '',
  record_StepID: '',
  userID: '',
  lastUpdatedByUserID: '',
  feeId: '',
  formChangeRequestID: '',
  appClientSecret: '',
  appId: '',
};

export const baseConfig: IBaseConfig = {
  employeeAppUrl: `https://${process.env.PLC_TEST_ENV}.${process.env.PLC_TEST_SUBDOMAIN}.io`,
  storefrontUrl: `https://${process.env.PLC_TEST_ENV}.${process.env.PLC_TEST_SUBDOMAIN}.com`,
  citTestData: citTestData,
  citApiConfig: citApiConfig,
  citTempData: citTempData,
  citMultiRecordData: [],
  citIndivApiData: citIndivApiData,
};
