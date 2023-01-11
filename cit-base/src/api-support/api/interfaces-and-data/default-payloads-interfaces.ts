import {faker} from '@faker-js/faker';
import {baseConfig} from '../../../base/base-config';
import {DeadlineTypeID, StepTypeID} from '../recordStepsApi';
import {ReportHeaders} from '../../../constants/cit-constants';
/*____________________________________________________________________recordTypeWorkflowApi.ts*/
export const defaultPayloadForRenewal = {
  recordType: {
    recordTypeID: 9999 /* Replace this*/,
    recordNumberSchemaTypeID: 0,
    prefix: null,
    name: `Default_Rec_Type_${faker.random.alphaNumeric(4)}`,
    iconID: 21,
    descriptionLabel: '',
    htmlcontent: null,
    descriptionRequired: false,
    defaultSectionLabel: 'Record For Record type renewal1',
    defaultSectionIconID: '21',
    defaultSectionHelpTextTitle: null,
    defaultSectionHelpText: null,
    userAccessLevel: 3,
    ApplyAccessID: 1,
    recordNumberSchemaID: 275 /* Replace this and need to check what is this about todo*/,
    ViewAccessID: 0,
    status: 0,
    orderNo: null,
    categoryID: 1100 /* Replace this and need to check what is this about todo*/,
    categoryTypeName: 'Test Department',
    isEnabled: true,
    lastUpdatedByUserID: null, // "'auth0|5ec573097f6d6c0c69f2136a'" /* Replace this*/,
    lastUpdatedDate: `${new Date().toISOString()}`,
    applicant: true,
    location: true,
    maxLocations: 1,
    allowProjects: false,
    offlinePayments: false,
    recordTypeAdminsJSON: null,
    externalDataJSONString: `'[{\\"tableName\\":\\"ex_Contractors_MA\\",\\"columns\\":[\\"Address\\", \\"City\\", \\"DBA\\", \\"DBAName\\", \\"EXID\\", \\"LicenseExpiration\\", \\"LicenseNo\\", \\"LicenseStatus\\", \\"LicenseType\\", \\"MailingAddress\\", \\"Name\\", \\"State\\", \\"Zip\\"]}]'`,
    renews: true /* Replace true or false*/,
    allowPointLocations: false,
    pointLocationsHelpText: null,
    allowAddressLocations: true,
    addressLocationsHelpText: null,
    allowSegmentLocations: false,
    segmentLocationsHelpText: null,
    allowAdditionalLocations: false,
    automaticExpirationDateExtension: false,
    automaticProjectRecordsExpirationDateExtension: false,
    expiresAfter: null,
    expiresAfterAmount: null,
    expiresAfterUnit: null,
    expiresOnMonth: null,
    expiresOnDay: null,
    adHocAttachmentViewAccessID: 3,
    recordTypeChanged: false,
    lastUpdatedByUser: null, //'auth0|5ec573097f6d6c0c69f2136a' /* Replace this*/,
    category: '', // '1100'/* Replace this and same as recordNumberSchemaID*/
    recordNumberSchema: '',
    // '275' /* Replace this and same as recordNumberSchemaID*/,
    recordTypeAdminItems: [
      '', // '27535',
    ] /* Replace this and need to check what is this about todo*/,
  },
};
export const defaultWorkflowStepTemplate = {
  templateStep: {
    template_StepID: null,
    recordTypeID: baseConfig.citTempData.recordTypeId,
    label: 'Custom Workflow Step',
    helpText: '',
    showToPublic: null,
    stepTypeID: StepTypeID.Approval,
    orderNo: 1,
    sequence: 1,
    isEnabled: 1,
    /* Booleans */
    isRenewal: false,
    deadlineEnabled: false,
    deadlineAutoCompletes: false,
    deadlineAlerts: false,
    /* Other Nulls */
    publicCanRequest: null,
    autoAssign: null,
    triggeredByGISRestrictionID: null,
    triggeredBy: null,
    lastUpdatedByUserID: null,
    lastUpdatedDate: null,
    iconURL: null,
    deadlineDays: null,
    deadlineTypeID: null,
    logicalOperatorTypeID: null,
    recordType: null,
    record: null,
    stepType: null,
    httpRequestTemplate: null,
    templateStepDocTemplate: null,
    deadlineType: null,
    entityLogicalOperator: null,
  },
};
/*______________________*/
// noinspection HtmlDeprecatedAttribute,HtmlUnknownTarget
export const defaultDocumentPayloadHtml = `<table width="100%"> <tbody> <tr> <td> <p><span style="color: #00a7e1; font-size: 50px; font-weight: bold;">{{recordId}}</span></p> <p><span style="font-size: 12px;">This is an e-permit. To learn more, scan this barcode or visit {{subdomainName}}.viewpointcloud.com/#/records/{{recordLinkId}}</span></p> </td> <td> <p><img alt="barcode" class="fr-fir fr-dii"src="https://chart.googleapis.com/chart?cht=qr&amp;chl=https%3A%2F%2F{{subdomainName}}.viewpointcloud.com%2F%23%2Frecords%2F{{recordLinkId}}&amp;choe=UTF-8&amp;chs=150x150"title="Barcode"></p> </td> </tr> </tbody> </table> </div> <div> <table width="100%"> <tbody> <tr> <td><strong>Issued to: </strong>{{applicantFirstName}} {{applicantLastName}}</td> <td><p style="text-align: right;"><strong>Location: </strong>{{streetNo}} {{streetName}} {{unit}}, {{city}}</p></td> </tr> </tbody> </table> <p><strong style="font-size: 50px;">{{recordType}}</strong></p> <p><br></p> <p><strong>Expires:</strong><span> {{expirationDate}}</span></p> <p><br></p> <table width="100%"> <tbody> <tr> <td width="150"><img src="{{orgLogoURL}}" alt="logo" class="fr-fil fr-dii" height="120" title="logo" width="120"></td> <td><span style="font-size: 30px;"><strong>{{orgName}}</strong></span></td> </tr> </tbody> </table> </div>`;
export const defaultDocumentPayload: DocumentsResult = {
  docTemplate: {
    docTemplateID: null,
    docTitle: 'Default Document Name',
    html: defaultDocumentPayloadHtml,
    docContent: 'Default Content',
    portrait: 0,
    recordTypeID: 99999,
    formDetails: null,
    feeDetails: null,
    docType: 1,
    lastUpdatedByUserID: null,
    lastUpdatedDate: null,
    isEnabled: true,
    recordType: null,
    id: null /*Always for payload*/,
  },
};
export const defaultAttachmentPayload: AttachmentsResult = {
  attachment: {
    attachmentID: null,
    recordTypeID: 999999,
    name: 'Default Name',
    description: 'Default Attachment',
    isEnabled: true,
    required: true,
    lastUpdatedByUserID: null,
    lastUpdatedDate: null,
    ViewAccessID: 0,
    orderNo: null,
    logicalOperatorTypeID: null,
    recordType: '999999',
    entityLogicalOperator: null,
    id: null /*Always for payload*/,
  },
};
export const defaultPayloadForFormFieldsObject: FormFieldResult = {
  data: {
    attributes: {
      formFieldID: null,
      formSectionID: 999999,
      fieldLabel: 'New Field 11',
      helpText: null,
      isSectionType: 0,
      dataType: 0,
      fieldRequired: 0,
      showToPublic: 1,
      isSearchable: null,
      customMinMax: null,
      minValue: null,
      maxValue: null,
      lockedOnRenewal: false,
      orderNo: 0,
      assignedDropdropLabel: null,
      recordTypeID: null,
      departmentFormFieldID: null,
      recordTypeName: null,
      isCalculation: false,
      calculation: null,
      calculationFields: null,
      hasMaxCapacity: false,
      maxCapacity: null,
      capacityWindowType: null,
      lastUpdatedByUserID: null,
      lastUpdatedDate: null,
      isEnabled: true,
      externalData: false,
      externalDataSourceField: null,
      publicCanModify: false,
      isPublicViewable: null,
      editPublicViewable: null,
      logicalOperatorTypeID: null,
    },
    type: 'form-fields',
  },
};
export const defaultPayloadForFormFieldsConditionsObject: FormFieldTemplateResult =
  {
    data: {
      attributes: {
        conditionTemplateID: null,
        recordTypeID: 0, // to be replaced
        isEnabled: true,
        entityPrimaryKey: 0, // to be replaced - form field id
        entityTypeID: 3,
        multiEntryFormField: false,
        dependentEntityPrimaryKey: 1,
        dependentEntityTypeID: 9,
        logicTypeID: 8,
        comparate1: 'true',
        comparate2: null,
      },
      type: 'condition-templates',
    },
  };

export interface RecordTypeWorkflowPayloadAndResponseBody {
  templateStep: {
    template_StepID?: number;
    recordTypeID?: number;
    label: string;
    helpText?: string;
    showToPublic?: boolean;
    stepTypeID:
      | StepTypeID.Approval
      | StepTypeID.Payment
      | StepTypeID.Inspection
      | StepTypeID.Document;
    orderNo?: number;
    sequence?: number;
    publicCanRequest?: any;
    autoAssign?: any;
    triggeredByGISRestrictionID?: any;
    triggeredBy?: any;
    isEnabled?: number;
    lastUpdatedByUserID?: any;
    lastUpdatedDate?: any;
    isRenewal?: boolean;
    iconURL?: any;
    deadlineEnabled?: boolean;
    deadlineDays?: number;
    deadlineAutoCompletes?: boolean;
    deadlineAlerts?: boolean;
    deadlineTypeID?:
      | DeadlineTypeID.DaysAfterRecordSubmission
      | DeadlineTypeID.DaysAfterStepAssignment
      | DeadlineTypeID.DaysAfterStepActivation;
    logicalOperatorTypeID?: any;
    recordType?: string;
    record?: any;
    stepType?: any;
    httpRequestTemplate?: any;
    templateStepDocTemplate?: any;
    deadlineType?: any;
    entityLogicalOperator?: any;
    id?: number;
  };
}

export interface RecordType {
  recordType: {
    id?: number;
    recordTypeID: number;
    name?: string;
    iconID?: number;
    descriptionLabel?: string;
    descriptionRequired?: number;
    defaultSectionLabel?: string;
    defaultSectionIconID?: number;
    defaultSectionHelpTextTitle?: any;
    defaultSectionHelpText?: any;
    ApplyAccessID?: number;
    categoryID?: number;
    isEnabled?: boolean;
    lastUpdatedByUserID?: string;
    lastUpdatedDate?: Date;
    applicant?: boolean;
    location?: boolean;
    offlinePayments?: boolean;
    ViewAccessID?: number;
    allowProjects?: any;
    htmlcontent?: any;
    status?: number;
    renews?: boolean;
    orderNo?: any;
    recordNumberSchemaID?: number;
    adHocAttachmentViewAccessID?: number;
    clonedDate?: any;
    parentRecordTypeID?: any;
    allowPointLocations?: boolean;
    allowAddressLocations?: boolean;
    allowSegmentLocations?: boolean;
    maxLocations?: number;
    pointLocationsHelpText?: any;
    addressLocationsHelpText?: any;
    templateStoreImportDate?: any;
    templateStoreOriginDatabase?: any;
    segmentLocationsHelpText?: any;
    allowAdditionalLocations?: boolean;
    automaticExpirationDateExtension?: boolean;
    automaticProjectRecordsExpirationDateExtension?: boolean;
    category?: number;
    lastUpdatedByUser?: string;
    icon?: number;
    feeID?: any;
    accountNumber?: any;
    label?: any;
    feeLastUpdatedByUser?: any;
    feeIsEnabled?: any;
    minimum?: any;
    maximum?: any;
    prorateTypeID?: any;
    operatorTypeID?: any;
    timeUnitID?: any;
    startProrateDateTypeID?: any;
    startFormFieldID?: any;
    endProrateDateTypeID?: any;
    endFormFieldID?: any;
    startProrateMonth?: any;
    startProrateDay?: any;
    endProrateMonth?: any;
    endProrateDay?: any;
    recordProrateDateTypeID?: any;
    recordProrateFormFieldID?: any;
    userAccessLevel?: number;
    categoryTypeName?: string;
    externalDataJSONString?: string;
    templateStepItems?: any[];
    docTemplateItems?: any[];
    recordTypeRequirementItems?: string;
    attachments?: any[];
    recordTypeAdminItems?: number[];
    recordTypeAdminsJSON?: any;
  };
}

export interface LocationObjectForRecordType {
  recordType: {
    location?: boolean;
    allowPointLocations?: boolean;
    pointLocationsHelpText?: string;
    allowAddressLocations?: boolean;
    addressLocationsHelpText?: string;
    allowSegmentLocations?: boolean;
    segmentLocationsHelpText?: string;
    allowAdditionalLocations?: boolean;
  };
}

export enum RecordTypeAccess {
  'No Access' = 0,
  'Can View' = 1,
  'Can Edit' = 2,
  'Can Administer' = 3,
}

export enum RecordTypeAppAccess {
  NO_ACCESS = 0,
  READ = 1,
  READ_WRITE = 2,
}

export enum ModeType {
  CHANGE = 'change',
  MODIFY = 'modify',
}

export enum RecordPrefixType {
  BASIC = 0,
  ANNUAL = 1,
  PREFIXED = 2,
  ANNUAL_PREFIXED = 3,
}

export type RecordTypeProperties = {
  /* Todo deprecate and replace individual ones*/
  publish?: boolean;
  enableLocations?: boolean;
  enableAdditionalLocations?: boolean;
  locationTypesToEnable?: {
    address?: boolean;
    point?: boolean;
    segment?: boolean;
  };
  employeeAccess?: RecordTypeAccess;
  formFields?: any; //TODO To be implemented
  attachments?: any; //TODO To be implemented
  fees?: any; //TODO To be implemented
  workflowStepsToAdd?: {
    approval?: boolean;
    payment?: boolean;
    inspection?: boolean;
    document?: boolean;
  };
  recordPrefixType?: RecordPrefixType;
  recordPrefix?: string;
};

export interface FormResult {
  formSection: {
    formSectionID?: number;
    recordTypeID: number;
    sectionLabel: string;
    iconID?: any;
    iconURL?: any;
    orderNo: number;
    helpText?: any;
    sectionType: number;
    externalData?: boolean;
    externalDataSourceTable?: any;
    externalDataSourceKey?: any;
    externalDataSecondaryKey?: any;
    externalDataJSONString?: any;
    externalPremium?: boolean;
    showToPublic?: number;
    lockedOnRenewal?: boolean;
    isFormFieldEntryEmpty?: boolean;
    isEditableMode?: boolean;
    lastUpdatedByUserID?: any;
    lastUpdatedDate?: any;
    isEnabled?: boolean;
    dataType?: any;
    isPublicViewable?: any;
    editPublicViewable?: any;
    entryRequired?: number;
    logicalOperatorTypeID?: any;
    record?: any;
    formCategory?: any;
    recordType?: any;
    entityLogicalOperator?: any;
    id?: number | null /*Not needed for input payload*/;
  };
}

export const defaultFormSectionObject: FormResult = {
  formSection: {
    formSectionID: null,
    recordTypeID: 99999,
    sectionLabel: 'New Custom Section',
    iconID: null,
    iconURL: null,
    orderNo: 0,
    helpText: null,
    sectionType: 0,
    externalData: false,
    externalDataSourceTable: null,
    externalDataSourceKey: null,
    externalDataSecondaryKey: null,
    externalDataJSONString: null,
    externalPremium: false,
    showToPublic: 1,
    lockedOnRenewal: false,
    isFormFieldEntryEmpty: false,
    isEditableMode: false,
    lastUpdatedByUserID: null,
    lastUpdatedDate: null,
    isEnabled: true,
    dataType: null,
    isPublicViewable: null,
    editPublicViewable: null,
    entryRequired: 0,
    logicalOperatorTypeID: null,
    record: null,
    formCategory: null,
    recordType: null,
    entityLogicalOperator: null,
  },
};

export const enum FormFieldDataInt {
  ShortTextEntry = 0,
  LongTextEntry = 1,
  Number = 2,
  Checkbox = 3,
  DropDown = 4,
  DateField = 5,
  HelpText = 6,
  SocialSecurityNumber = 7,
  EmployerIDNumber = 8,
  DigitalSignature = 9,
  FileUpload = 10,
}

export const FormFieldDataIntVal = {
  ShortTextEntry: 0,
  LongTextEntry: 1,
  Number: 2,
  Checkbox: 3,
  DropDown: 4,
  DateField: 5,
  HelpText: 6,
  SocialSecurityNumber: 7,
  EmployerIDNumber: 8,
  DigitalSignature: 9,
  FileUpload: 10,
};

export type FormFieldDataType =
  /* Refer to FormFieldResult for field specific values*/
  | FormFieldDataInt.ShortTextEntry
  | FormFieldDataInt.LongTextEntry
  | FormFieldDataInt.Number
  | FormFieldDataInt.Checkbox
  | FormFieldDataInt.DropDown
  | FormFieldDataInt.DateField
  | FormFieldDataInt.HelpText
  | FormFieldDataInt.SocialSecurityNumber
  | FormFieldDataInt.EmployerIDNumber
  | FormFieldDataInt.DigitalSignature
  | FormFieldDataInt.FileUpload;

export interface FormFieldTemplateResult {
  data: {
    id?: string;
    type?: string;
    attributes: {
      conditionTemplateID: number;
      entityPrimaryKey: number;
      entityTypeID: number;
      dependentEntityPrimaryKey: number;
      dependentEntityTypeID?: number;
      isEnabled: boolean;
      logicTypeID: number;
      comparate1: string;
      comparate2: any;
      lastUpdatedByUserID?: any;
      lastUpdatedDate?: any;
      createdByUserID?: any;
      dateCreated?: any;
      recordTypeID: number;
      multiEntryFormField: boolean;
      type?: any;
      dependentEntityValue?: any;
      isSatisfied?: any;
      logicalOperatorTypeID?: any;
      id?: number;
    };
    relationships?: {
      entity: {
        data: {
          type: string;
          id: number;
        };
      };
      dependentEntity: {
        data: {
          type: string;
          id: number;
        };
      };
      recordType: {
        data: {
          id: number;
          type: string;
        };
      };
    };
  };
}

export interface FormFieldResult {
  data: {
    attributes: {
      formFieldID?: number;
      formSectionID: number;
      fieldLabel: string;
      helpText?: any;
      isSectionType?: number;
      dataType?: FormFieldDataInt;
      fieldRequired?: number;
      showToPublic?: number;
      isSearchable?: any;
      customMinMax?: boolean;
      minValue?: number;
      maxValue?: any;
      lockedOnRenewal?: boolean;
      orderNo?: number;
      assignedDropdropLabel?: any;
      recordTypeID?: any;
      departmentFormFieldID?: any;
      recordTypeName?: any;
      isCalculation?: boolean;
      calculation?: any;
      calculationFields?: any;
      hasMaxCapacity?: boolean;
      maxCapacity?: any;
      capacityWindowType?: any;
      lastUpdatedByUserID?: string;
      lastUpdatedDate?: any;
      isEnabled?: number | boolean /*For payload Boolean*/;
      externalData?: boolean;
      externalDataSourceField?: any;
      publicCanModify?: boolean;
      isPublicViewable?: boolean;
      editPublicViewable?: any;
      logicalOperatorTypeID?: any;
      id?: number;
      data_type?: string;
      capacity_window_type?: any;
    };
    type: string;
  };
}

export interface AttachmentsResult {
  attachment: {
    attachmentID?: number;
    recordTypeID: number;
    name: string;
    description: string;
    isEnabled?: boolean;
    required?: boolean;
    lastUpdatedByUserID?: string;
    lastUpdatedDate?: any;
    ViewAccessID?: number;
    orderNo?: any;
    logicalOperatorTypeID?: any;
    recordType?: string;
    entityLogicalOperator?: any;
    id?: number;
  };
}

export interface DocumentsResult {
  docTemplate: {
    docTemplateID?: number;
    docTitle?: string;
    html?: string;
    docContent?: string;
    portrait?: number;
    recordTypeID?: number;
    formDetails?: any;
    feeDetails?: any;
    docType: number;
    lastUpdatedByUserID?: string;
    lastUpdatedDate?: Date;
    isEnabled?: boolean;
    recordType?: any;
    id?: number;
  };
}

export enum TemplateStepTypes {
  Approval = 1,
  Payment = 2,
  Inspection = 4,
  Document = 5,
}

export interface RecordPayloadOrResult {
  data: {
    id: string;
    type: string;
    attributes: {
      recordID?: string;
      recordTypeID?: number;
      dateCreated?: Date;
      applicantUserID?: any;
      applicantFirstName?: any;
      applicantLastName?: any;
      locationID?: any;
      description?: any;
      formComplete?: boolean;
      streetNo?: any;
      streetName?: any;
      unit?: any;
      city?: any;
      state?: any;
      mbl?: any;
      zoning?: any;
      lotArea?: any;
      bookPage?: any;
      propertyUse?: any;
      water?: any;
      sewage?: any;
      ownerStreetNo?: any;
      ownerStreetName?: any;
      ownerUnit?: any;
      ownerCity?: any;
      ownerState?: any;
      ownerPostalCode?: any;
      ownerCountry?: any;
      ownerPhoneNo?: any;
      ownerEmail?: any;
      occupancyType?: any;
      buildingType?: any;
      postalCode?: any;
      country?: any;
      ownerName?: any;
      latitude?: any;
      longitude?: any;
      yearBuilt?: any;
      locationTypeID?: any;
      resubmitReason?: any;
      resubmitUserID?: any;
      lastUpdatedByUserID?: string;
      isEnabled?: boolean;
      historicalID?: any;
      projectID?: any;
      createdByUserID?: any;
      historicalPermitNo?: any;
      expirationDate?: any;
      deletionReason?: any;
      additionalLocationIDs?: string;
      lastUpdatedDate?: Date;
      dateSubmitted?: Date;
      workflowScenarioID?: any;
      status?: number;
      applicantFullName?: any;
      renews?: boolean;
      renewalOfRecordID?: any;
      recordNumber?: number;
      renewalNo?: any;
      renewalSubmitted?: boolean;
      originalRecordID?: any;
      prefix?: any;
      recordNo?: string;
      storefrontSubmitted?: boolean;
      subdivision?: any;
      fullAddress?: string;
      formID?: any;
      value?: any;
      recordTypeName?: any;
      projectLabel?: any;
      label?: any;
      userAccessLevel?: any;
      isSubmittingRecord?: boolean;
      id?: number;
      zipCode?: any;
      ownerZipCode?: any;
    };
  };
}

/* Todo after branch 33892 is merged, these move to a file names as interfaces and constants defaults + Getter methods ______________ Start*/
export const reportPayload = {
  report: {
    id: '',
    reportID: '',
    ogReportID: null,
    reportPrivacyID: 1,
    name: '',
    reportScopeID: 1,
    categoryID: null,
    recordTypeID: null,
    filters: null,
    columns: null,
    createdByUserID: null,
    lastUpdatedByUserID: null,
    lastUpdatedDate: null,
    isEnabled: true,
    createdByUser: null,
    reportScope: 1,
    category: null,
    recordType: null,
    reportableScope: 1,
  },
};
export const headers: ReportHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  subdomain: '',
  user_id: '',
};

export enum ReportTypesScopeId {
  Records = 1,
  Approvals = 2,
  Documents = 4,
  Payments = 6,
  Transactions = 7,
  Ledger = 8,
  Inspections = 9,
  InspectionResults = 11,
  Projects = 12,
}

export const baseTemplatesReports = {
  applicantNameFilter: [
    // prettier-ignore
    {
      t: "Records",
      c: "applicantFullName",
      n: "Applicant Name",
      o: 1,
      d: "varchar",
      f: [{ op: 1, f: "api admin" }]
    },
  ],
  applicantNameFilterComplete: [
    // prettier-ignore
    {
      t: "RecordStatuses",
      c: "recordStatus",
      n: "Record Status",
      o: 0,
      d: "recordStatus",
      f: [{ op: 1, f: "Complete" }]
    },
    // prettier-ignore
    {
      t: "Records",
      c: "applicantFullName",
      n: "Applicant Name",
      o: 2,
      d: "varchar",
      f: [{ op: 1, f: "api admin" }]
    },
  ],
  columnsWithApplicantnamePaymentDue: [
    // prettier-ignore
    { t: "Records", c: "recordNo", n: "Record #", o: 1, d: "varchar", cl: "blue" },
    // prettier-ignore
    { t: "RecordTypes", c: "name", n: "Record Type", o: 2, d: "varchar" },
    // prettier-ignore
    { t: "Record_Steps", c: "label", n: "Label", o: 3, d: "varchar" },
    // prettier-ignore
    { t: "Record_Steps", c: "stepActivatedDate", n: "Became Due", o: 4, d: "datetime" },
    // prettier-ignore
    { t: "Records", c: "applicantFullName", n: "Applicant", o: 5, d: "varchar" },
  ],
  additionalColumnsFilter: [
    // prettier-ignore
    {
      "t": "StepStatuses",
      "c": "stepStatus",
      "n": "Payment Status",
      "o": 0,
      "d": "enum",
      "f": [{ "op": 1, "f": "Active" }]
    },
    // prettier-ignore
    { "t": "Records", "c": "renewalOfRecordID", "n": "Is Renewal", "o": 2, "d": "hiddenHasValue", "f": [{ "op": 10 }] },
    // prettier-ignore
    { "t": "Records", "c": "historicalID", "n": "Is Historical", "o": 3, "d": "hiddenHasValue", "f": [{ "op": 11 }] },
  ],
  columnsWithAdditionalFilter: [
    // prettier-ignore
    { t: "Records", c: "recordNo", n: "Record #", o: 1, d: "varchar", cl: "blue" },
    // prettier-ignore
    { t: "RecordTypes", c: "name", n: "Record Type", o: 2, d: "varchar" },
    // prettier-ignore
    { t: "Record_Steps", c: "label", n: "Label", o: 3, d: "varchar" },
    // prettier-ignore
    { t: "Record_Steps", c: "stepActivatedDate", n: "Became Due", o: 4, d: "datetime" },
    // prettier-ignore
    { t: "Records", c: "applicantFullName", n: "Applicant", o: 5, d: "varchar" },
    // prettier-ignore
    { t: "Applicants", c: "phoneNo", n: "Applicant PhoneNo", o: 6, d: "varchar" },
    // prettier-ignore
    { t: "Payments", c: "balanceRemaining", n: "Balance Remaining", o: 7, d: "balanceRemaining" },
  ],
  additionalColFilterInspections: [
    // prettier-ignore
    {
      "t": "StepStatuses",
      "c": "stepStatus",
      "n": "Inspection Status",
      "o": 0,
      "d": "enum",
      "f": [{ "op": 1, "f": "Active" }]
    },
  ],
  additionalColumnsForInspections: [
    // prettier-ignore
    { t: "Records", c: "recordNo", n: "Record #", o: 1, d: "varchar", cl: "blue" },
    // prettier-ignore
    { t: "RecordTypes", c: "name", n: "Record Type", o: 2, d: "varchar" },
    // prettier-ignore
    { t: "Record_Steps", c: "label", n: "Label", o: 3, d: "varchar" },
    // prettier-ignore
    { t: "Records", c: "fullAddress", n: "Address", o: 4, d: "varchar" },
    // prettier-ignore
    { t: "InspectionEventsSummary", c: "nextInspectionDate", n: "Next Inspection", o: 5, d: "datetime" },
    // prettier-ignore
    { t: "InspectionEventsSummary", c: "lastInspectionDate", n: "Last Inspection", o: 6, d: "datetime" },
    // prettier-ignore
    { t: "Record_Steps", c: "assignedToUserID", n: "Assignee", o: 7, d: "assignedToUser" },
    // prettier-ignore
    { t: "Applicants", c: "phoneNo", n: "Applicant PhoneNo", o: 8, d: "varchar" },
    // prettier-ignore
    { t: "Records", c: "isEnabled", n: "Archived", o: 9, d: "bit" },
  ],
  generalReportWithColumnsActive: [
    // prettier-ignore
    { "t": "Records", "c": "recordNo", "n": "Record #", "o": 1, "d": "varchar", "cl": "blue" },
    // prettier-ignore
    { "t": "RecordTypes", "c": "name", "n": "Record Type", "o": 2, "d": "varchar" },
    // prettier-ignore
    { "t": "Record_Steps", "c": "label", "n": "Label", "o": 3, "d": "varchar" },
    // prettier-ignore
    { "t": "Record_Steps", "c": "assignedToUserID", "n": "Assignee", "o": 4, "d": "assignedToUser" },
    // prettier-ignore
    { "t": "Record_Steps", "c": "stepActivatedDate", "n": "Start Date", "o": 5, "d": "datetime" },
  ],
  applicantNameFilterCompleteColumns: [
    // prettier-ignore
    { t: "Records", c: "recordNo", n: "Record #", o: 1, d: "varchar", cl: "blue" },
    // prettier-ignore
    { t: "RecordTypes", c: "name", n: "Record Type", o: 2, d: "varchar" },
    // prettier-ignore
    { t: "Records", c: "applicantFullName", n: "Applicant Name", o: 3, d: "varchar" },
    // prettier-ignore
    { t: "Records", c: "dateSubmitted", n: "Date Submitted", o: 4, d: "datetime" },
    // prettier-ignore
    { t: "Records", c: "fullAddress", n: "Address", o: 5, d: "varchar" },
    // prettier-ignore
    { t: "RecordStatuses", c: "recordStatus", n: "Record Status", o: 6, d: "recordStatus" },
  ],
};
/* Todo type definition */
export const baseTemplatesReportsPayload = {
  payloadCreateReportPaymentDue: {
    report: {
      reportID: null,
      name: 'Default_value_to_replace',
      reportScopeID: 6,
      reportPrivacyID: 1,
      categoryID: null,
      recordTypeID: null,
      /* Replace values as needed by importing this independently later*/
      filters: `${JSON.stringify(baseTemplatesReports.applicantNameFilter)}`,
      columns: `${JSON.stringify(
        baseTemplatesReports.columnsWithApplicantnamePaymentDue,
      )}`,
      createdByUserID: null,
      lastUpdatedByUserID: null,
      lastUpdatedDate: null,
      isEnabled: true,
      createdByUser: null,
      reportScope: null,
      reportableScope: null,
      recordType: null,
      category: null,
    },
  },
};

export interface ReportsResult {
  reports: {
    id: number;
    reportID: number;
    name: string;
    reportScopeID: number;
    reportPrivacyID: number;
    categoryID?: any;
    recordTypeID?: any;
    filters: string;
    columns: string;
    createdByUserID: string;
    lastUpdatedByUserID: string;
    lastUpdatedDate: Date;
    isEnabled: boolean;
    reportScope: number;
  }[];
}
