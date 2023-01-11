/**
 * Holds tests data that are shared/user in tests.
 * //TODO We will need to create all test data used in tests in the future. But keeping them here will consolidate them at one place.
 */

export const SUPER_USER_SESSION = 'sessions/superUserSession.json';
export const ADMIN_SESSION = 'sessions/adminSession.json';
export const EMPLOYEE_SESSION = 'sessions/employeeSession.json';
export const CITIZEN_SESSION = 'sessions/citizenSession.json';
export const RESOURCES_DIR = '/src/resources/cit/';

export enum LocationTypes {
  ADDRESS = 'address',
  POINT = 'point',
  SEGMENT = 'segment',
}

export const TestRecordTypes = {
  Ghost_Test: {
    name: '01_Ghost_Test',
    id: 6611,
  },
  Smoke_Test: '01_Smoke_Test (Please do not modify!!!)',
  Record_Steps_Test: {
    name: '01_Record_Steps_Test',
    id: 6651,
    docTemplateID: 1005269,
  },
  Record_Steps_Parallel: {
    name: '01_Record_Steps_Test_Parallel',
    id: 11820,
  },
  Renewal_Campaign_Tests: {
    name: '01_Renewal_campaign_tests',
    id: 9003,
  },
  UI_Attachment_order: {
    name: '_01_UI_Attachment_order',
    id: 9048,
  },
  Api_Test: '0_API_TEST',
  Api_Notification_Test: {name: 'API_NOTIFICATION_TEST', id: 6746},
  Fire_Department: 'Fire dep permit',
  Request_Changes_Tests: {
    name: 'All_Form_Fields_And_Sections',
    id: 25423,
  },
  Test_Step_Deadlines: 'Test_Step_Deadlines',
  Storefront_locations_enabled: 'Storefront_locations_enabled',
  API_INTEGRATION_WORKFLOW_TEST: {
    name: '03_API_INTEGRATION_WORKFLOW_TEST',
    id: 11389,
  },
  DFF_Record_Type: {name: '01_DFF_Record-Type', id: 6725},
  Additional_Location_Test: {
    name: 'Testing_additional_Location',
    id: 22025,
  },
  Employee_CanEdit_RT: '0_Employee_CanEdit_RT',
  Employee_CanAdminister_RT: '0_Employee_CanAdminister_RT',
  Employee_CanView_RT: '0_Employee_CanView_RT',
  Autofill_Test: {
    name: 'autofill_test',
    id: 9903,
  },
  Circular_Calc_FF: {
    name: '_00_Circular_Calc_FF',
    id: 8038,
  },
  Record_type_step_fees: 'API_RECORD_TYPE_STEP_FEES',
};

export const TestDepartments = {
  Test_Department: 'Test Department',
  Inspection_Services: '1. Inspectional Services',
};

export const TestUsers = {
  Guest_User: {
    email: 'api_guest@opengov.com',
    name: 'ABC M',
  },
  Test_User: {
    email: 'api_test@opengov.com',
    name: 'API Test',
  },
  Api_Employee: {
    email: 'api_employee@opengov.com',
    name: 'API Employee',
  },
  Api_Admin: {
    email: 'api_admin@opengov.com',
    name: 'api admin',
  },
  Notification_user: {
    email: 'api_notification_tester@opengov.com',
    name: 'notification user',
  },
  Report_Admin: {
    email: 'api_report_test@opengov.com',
    name: 'API Report Tester',
  },
  Superuser: {
    email: 'twalsh+12233@opengov.com',
    name: 'Troy Walsh',
  },
};

export const TestSteps = {
  Inspection: 'Inspection',
  Payment: 'Payment',
  Document: 'Document',
  Approval: 'Approval',
};

export const TestFormFields = {
  Checkbox: 'Checkbox',
  Number: 'Number',
  String: 'String',
  Date: 'Date',
};

export const TestLocationTypes = {
  Address_Location: 1,
  Point_Location: 2,
  Segment_Location: 3,
};

export const AppStoreUrls = {
  webHookStaticUrl:
    'https://api.plce.ogstaging.us/integrations/webhook-confirmation',
  homePageUrl: 'https://www.google.com/',
};

export const TestLocation = {
  Test_Point_Location: {
    name: 'Test Point A',
    type: TestLocationTypes.Point_Location,
  },
  Test_Point_Location_01: {
    name: 'TestPointLoc_01',
    type: TestLocationTypes.Point_Location,
  },
  Test_Point_Location_02: {
    name: 'TestPointLoc_02_DoNotModify',
    type: TestLocationTypes.Point_Location,
  },
  Test_Tole: {
    name: '11 Test Tole, Unit 11, TestCity, MA',
    type: TestLocationTypes.Address_Location,
  },
  Test_Tole_12: {
    name: '12 Test Tole, 12TestCity MA 11111',
    type: TestLocationTypes.Address_Location,
  },
  Location_With_Units: {
    name: `1 CITY HALL SQ BOSTON CITY HALL, Unit 1, BOSTON, MA`,
    type: TestLocationTypes.Address_Location,
  },
  Location_with_MAT_id: {
    name: '320 Congress Street, Unit 1b, Boston, MA 02210',
    type: TestLocationTypes.Address_Location,
  },
};

export const TestFileTypes = {
  PDF: 'pdf',
  JPEG: 'jpeg',
  PNG: 'png',
  EXE: 'exe',
  HTML: 'html',
  DMG: 'dmg',
  EMPTY: '',
};

export type FormField = {
  label: string;
  value: string;
};

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export type ReportHeaders = {
  'Content-Type': string;
  Accept: string;
  subdomain: string;
  user_id: string;
};

export type ReportColumn = {
  t: string;
  c: string;
  n: string;
  d: string;
  o?: number;
};

export const ReportColumns = {
  recordNumber: {
    t: 'Records',
    c: 'recordNo',
    n: 'Record #',
    d: 'varchar',
  },
  recordType: {
    t: 'RecordTypes',
    c: 'name',
    n: 'Record Type',
    d: 'varchar',
  },
  applicantFullName: {
    t: 'Records',
    c: 'applicantFullName',
    n: 'Applicant Name',
    d: 'varchar',
  },
  recordStatus: {
    t: 'RecordStatuses',
    c: 'recordStatus',
    n: 'Record Status',
    d: 'recordStatus',
  },
  lastActivity: {
    t: 'Records',
    c: 'lastRecordActivity',
    n: 'Last Record Activity',
    d: 'datetime',
  },
};

export const CitEntityType = {
  USER: 1,
  LOCATION: 2,
  FORM_FIELD: 3,
  FORM_SECTION: 4,
  ATTACHMENT: 5,
  RECORD_STEP: 6,
  FEE_ITEM: 7,
  STEP_ASSIGNMENT: 8,
  RECORD: 9,
  MULTI_ENTRY_ITEM: 10,
  FLAG: 11,
  TEMPLATE_STEP: 12,
  STEP_FEE_ITEM: 13,
  RECORD_ATTACHMENT: 14,
  CHECKLIST_ITEM_ATTACHMENT: 15,
  INSPECTION_ATTACHMENT: 22,
};

export const locationQueryData = {
  city: 'LOUISBURG',
  country: 'US',
  mode: 'unitLocations',
  postalCode: 27549,
  state: 'NC',
  streetName: 'NO STREET',
  streetNo: 0,
};

export enum LocationSection {
  PRIMARY = 'primary',
  ADDITIONAL = 'additional',
}
