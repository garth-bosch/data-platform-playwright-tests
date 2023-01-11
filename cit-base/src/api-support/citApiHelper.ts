import fetch from 'node-fetch';
import https from 'https';
import {baseConfig} from '../base/base-config';
import {
  fetchResponse,
  makeRequest,
  RequestMethod,
} from '@opengov/playwright-base/build/api-support/apiHelper';
import {expect} from '@playwright/test';
import * as domain from 'domain';

const httpsAgent = new https.Agent({rejectUnauthorized: false});

const railsUrl = () => baseConfig.citApiConfig.railsUrl;
const devRailsUrl = () => baseConfig.citApiConfig.railsUrl;
const nodeUrl = () => baseConfig.citApiConfig.nodeUrl;
const subdomain = () => baseConfig.citApiConfig.subdomain;
const devSubdomain = () => baseConfig.citApiConfig.subdomain;
const mandrillUrl = () => baseConfig.citApiConfig.mandrillUrl;
const accessToken = () => baseConfig.citApiConfig.accessToken;
const oAuthAccessToken = () => baseConfig.citApiConfig.oAuthAccessToken;

export async function makeCitApiRequest(
  requestBody: any,
  apiPath: string,
  method: RequestMethod,
  headers?: any,
  skipJson?: boolean,
) {
  return makeCitRequest(
    railsUrl(),
    requestBody,
    apiPath,
    method,
    subdomain(),
    headers,
    skipJson,
  );
}

export async function makeCitDevApiRequest(
  requestBody: any,
  apiPath: string,
  method: RequestMethod,
  headers?: any,
) {
  return makeCitRequest(
    devRailsUrl(),
    requestBody,
    apiPath,
    method,
    devSubdomain(),
    headers,
  );
}

export async function makeCitNodeApiRequest(
  requestBody: any,
  apiPath: string,
  method: RequestMethod,
  headers?: any,
) {
  return makeCitRequest(
    nodeUrl(),
    requestBody,
    apiPath,
    method,
    subdomain(),
    headers,
  );
}

export async function makeCitGraphQlApiRequest(
  apiService: string,
  requestBody: any,
  method: RequestMethod,
  headers?: any,
) {
  // If API is still not authenticated
  if (!accessToken()) {
    await authenticateApi();
  }
  const body = {
    method: `${method}`,
    body: requestBody === null ? null : JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken()}`,
    },
  };
  if (headers) {
    body.headers = Object.assign(body.headers, headers);
  }
  const response = await fetchResponse(apiService, body);
  return response.json();
}

async function makeCitRequest(
  apiService: string,
  requestBody: any,
  apiPath: string,
  method: RequestMethod,
  domain: string,
  headers?: any,
  skipJson?: boolean,
) {
  // If API is still not authenticated
  if (!accessToken()) {
    await authenticateApi();
  }

  return makeRequest(
    apiService,
    requestBody,
    apiPath,
    method,
    domain,
    accessToken(),
    headers,
    skipJson,
  );
}

export async function makeOauthRequest(
  apiService: string,
  requestBody: any,
  method: RequestMethod,
  headers?: any,
) {
  // If API is still not authenticated
  if (!oAuthAccessToken()) {
    await authenticateOauthApi();
  }
  const body = {
    method: `${method}`,
    body: requestBody === null ? null : JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${oAuthAccessToken()}`,
    },
  };
  if (headers) {
    body.headers = Object.assign(body.headers, headers);
  }
  const response = await fetchResponse(apiService, body);
  if (method !== RequestMethod.DELETE) {
    return response.json();
  } else {
    return response;
  }
}

export async function authenticateApi(userEmail?: string) {
  // If custom email specified, the existing token should be ignored. Also, it won't be replaced.
  if (accessToken() && !userEmail) {
    console.debug(`Reusing Token...`);
    return;
  }

  const authUrl: string = baseConfig.citApiConfig.oAuthUrl;
  const body = {
    grant_type: 'password',
    audience: 'viewpointcloud.com/api/test',
    username: userEmail ? userEmail : baseConfig.citTestData.citAdminEmail,
    password: baseConfig.citTestData.citAppPassword,
    client_id: baseConfig.citApiConfig.clientId,
    client_secret: baseConfig.citApiConfig.clientSecret,
  };
  const response = await fetchResponse(authUrl, {
    method: RequestMethod.POST,
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });
  const responseJson: any = await response.json();

  // If custom email specified, the token should not be saved to the shared variable
  // because it should not be reused anywhere else
  if (!userEmail) {
    baseConfig.citApiConfig.accessToken = await responseJson.access_token;
    console.debug('Token saved');
  } else {
    return responseJson.access_token;
  }
}

export async function getTokenByUserRole(
  forceRefreshToken = false,
  UserRole?: any,
) {
  if (!forceRefreshToken) {
    if (accessToken()) {
      console.debug(`Reusing Token...`);
      return;
    }
  }

  const authUrl: string = baseConfig.citApiConfig.oAuthUrl;
  const body = {
    grant_type: 'password',
    audience: 'viewpointcloud.com/api/test',
    username:
      UserRole != null ? UserRole : baseConfig.citTestData.citAdminEmail,
    password: baseConfig.citTestData.citAppPassword,
    client_id: baseConfig.citApiConfig.clientId,
    client_secret: baseConfig.citApiConfig.clientSecret,
  };
  const response = await fetchResponse(authUrl, {
    method: RequestMethod.POST,
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });
  const responseJson: any = await response.json();
  baseConfig.citApiConfig.accessToken = await responseJson.access_token;
  console.debug('Token saved');
}

export async function authenticateOauthApi() {
  if (oAuthAccessToken()) {
    console.debug(`Reusing Token...`);
    return;
  }
  const body = {
    grant_type: 'client_credentials',
    audience: baseConfig.citApiConfig.audienceOauthManager,
    client_id: baseConfig.citApiConfig.clientId,
    client_secret: baseConfig.citApiConfig.clientSecret,
  };
  const response = await fetchResponse(
    baseConfig.citApiConfig.oAuthManagementUrl,
    {
      method: RequestMethod.POST,
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    },
  );
  const responseJson: any = await response.json();
  expect(responseJson.access_token).toBeDefined();
  expect(responseJson.access_token).not.toBeNull();
  baseConfig.citApiConfig.oAuthAccessToken = responseJson.access_token;
  console.debug('Token saved');
}

export async function makeMandrillRequest(requestBody: any, apiPath: string) {
  const url = `${mandrillUrl()}/${apiPath}`;
  console.debug(`Request POST: ${url}`);
  return fetch(`${url}`, {
    method: `post`,
    body: JSON.stringify(requestBody),
  });
}

export const UserRole = {
  SUPER_USER: baseConfig.citTestData.citSuperUserEmail,
  ADMIN: baseConfig.citTestData.citAdminEmail,
  EMPLOYEE: baseConfig.citTestData.citEmployeeEmail,
  CITIZEN: baseConfig.citTestData.citCitizenEmail,
};

interface ICitApiServicePath {
  paths: {
    RECORDS: {with(recordId: string): string};
    GENERAL_SETTINGS: string;
    FORM_FIELDS_BY_RECORD: {with(recordId: string): string};
    FORM_FIELDS_ENTRIES_BY_RECORD: {with(recordId: string): string};
    ENTER_FORM_FIELDS_ENTRIES: {with(entryId: string): string};
    RECORD_STEPS: string;
    STEP_COMMENTS: string;
    STEP_FEES_ADHOC: string;
    RECORD_STEPS_BY_RECORD: {with(recordId: string): string};
    ATTACHMENTS: string;
    ATTACHMENTS_BY_RECORD_TYPE: {with(recordTypeId: string): string};
    RECORD_ATTACHMENT: string;
    RECORD_ATTACHMENT_BY_RECORD: {with(recordId: string): string};
    RECORD_GUESTS: string;
    USERS: string;
    USERS_BY_EMAIL: {with(email: string): string};
    MANDRILL_SEARCH_MESSAGES: string;
    MANDRILL_GET_MESSAGE_CONTENT: string;
    SEARCH_RESULTS: string;
    REPORTS: {with(reportId: string): string};
    INSPECTION_EVENTS: string;
    RECORD_TYPES: {with(recordTypeId: string): string};
    RECORD_TYPE_TEMPLATE_STEPS: string;
    CATEGORIES: string;
    FORM_FIELDS: string;
    CONDITION_TEMPLATES: string;
    FORM_SECTIONS: string;
    FORM_SECTIONS_ID: {with(formSectionID: string): string};
    DOC_TEMPLATES: string;
    LOCATION_SEARCH: {with(locationKey: string, locationType?: number): string};
    USERS_SEARCH: {with(userKey: string, howManyToFetch: number): string};
    LOCATION_ID: {with(locationId: string): string};
    FILE_SAS_TOKEN: {with(container: string, storageAccount: string): string};
    UPLOADED_FILES: string;
    RECORD_ATTACHMENT_DRAFT: {with(recordId: string): string};
    PROJECTS: string;
    PROJECTS_WITH_ID: {with(projectId: string): string};
    LOCATIONS: string;
    LOCATIONS_ID: {with(locationId: string): string};
    LOCATION_ID_SEARCH: {
      with(
        city: string,
        country: string,
        mode: string,
        postalCode: number,
        state: string,
        streetName: string,
        streetNo: number,
      ): string;
    };
    RECORD_TYPE_ADMINS: {with(recordTypeAdminId: string): string};
    FLAGS_WITH_ID: {with(flagId: string): string};
    ENTITY_FLAG_XREFS_WITH_ID: {with(flagId: string): string};
    SEARCH_FLAG_DETAILS: {
      with(
        entityPrimaryKey: string,
        entityTypeID: number,
        flagID: string,
      ): string;
    };
    RECORD_NUMBER_SCHEMAS: {
      with(recordNumberSchemaTypeID: number): string;
    };
    ASSIGNED_TASKS: {
      with(assignedToUserID: string, order: string): string;
    };
    UNASSIGN_ALL_FROM_USER: string;
    REPORTABLES: {
      with(reportScopeID: number): string;
    };
    RECORD_TYPE_ADMIN: string;
  };
}

export const servicePath: ICitApiServicePath = {
  paths: {
    RECORDS: {with: (recordId: string) => `records/${recordId}`},
    GENERAL_SETTINGS: 'general_settings/1',
    FORM_FIELDS_BY_RECORD: {
      with: (recordId: string) => `form_fields/?recordID=${recordId}`,
    },
    FORM_FIELDS_ENTRIES_BY_RECORD: {
      with: (recordId: string) =>
        `form_field_entries?page=createRecord&recordID=${recordId}`,
    },
    ENTER_FORM_FIELDS_ENTRIES: {
      with: (entryId: string) => `form_field_entries/${entryId}`,
    },
    RECORD_STEPS: 'record_steps',
    STEP_COMMENTS: 'step_comments',
    STEP_FEES_ADHOC: '/step_fees/adhoc' /*Need that extra / in the url*/,
    RECORD_STEPS_BY_RECORD: {
      with: (recordId: string) =>
        `${servicePath.paths.RECORD_STEPS}?recordID=${recordId}&submittedRecordPage=true`,
    },
    ATTACHMENTS: 'attachments',
    ATTACHMENTS_BY_RECORD_TYPE: {
      with: (recordTypeId: string) =>
        `attachments?recordTypeID=${recordTypeId}&reload=true`,
    },
    RECORD_ATTACHMENT: 'record_attachments',
    RECORD_ATTACHMENT_BY_RECORD: {
      with: (recordId: string) => `record_attachments?recordID=${recordId}`,
    },
    RECORD_GUESTS: 'record_guests',
    USERS: 'users',
    USERS_BY_EMAIL: {
      with: (email: string) => `users?email=${email}`,
    },
    MANDRILL_SEARCH_MESSAGES: 'messages/search',
    MANDRILL_GET_MESSAGE_CONTENT: 'messages/content',
    SEARCH_RESULTS: 'searchResults',
    REPORTS: {with: (reportId: string) => `reports/${reportId}`},
    INSPECTION_EVENTS: 'inspectionEvents',
    RECORD_TYPES: {
      with: (recordTypeId: string) => `recordTypes/${recordTypeId}`,
    },
    FORM_FIELDS: `form_fields/`,
    CONDITION_TEMPLATES: `condition_templates`,
    RECORD_TYPE_TEMPLATE_STEPS: 'templateSteps',
    CATEGORIES: 'categories',
    FORM_SECTIONS: 'formSections',
    FORM_SECTIONS_ID: {
      with: (formSectionID: string) => `formSections/${formSectionID}`,
    },
    DOC_TEMPLATES: 'docTemplates',
    LOCATION_SEARCH: {
      with: (locationKey, locationType) =>
        locationType
          ? `search_results?criteria=location&key=${locationKey}&locationTypeID=${locationType}`
          : `search_results?criteria=location&key=${locationKey}`,
    },
    USERS_SEARCH: {
      with: (userKey = 'API Not', howManyToFetch = 1) =>
        `searchResults?criteria=user&fetchNumber=${howManyToFetch}&key=${userKey.replace(
          / /g,
          '%20',
        )}`,
    },
    LOCATION_ID: {
      with: (locationId: string) => `locations/${locationId}`,
    },
    FILE_SAS_TOKEN: {
      with: (container, storageAccount) =>
        `storage/sas_token?container=${container}&storageAccount=${storageAccount}`,
    },
    UPLOADED_FILES: 'uploaded_files',
    RECORD_ATTACHMENT_DRAFT: {
      with: (recordId: string) =>
        `updateRecordDraftAttachments/${recordId}?recordID=${recordId}`,
    },
    PROJECTS: 'projects',
    PROJECTS_WITH_ID: {
      with: (projectId: string) => `projects/${projectId}`,
    },
    LOCATIONS: 'locations',
    LOCATIONS_ID: {
      with: (locationId) => `locations/${locationId}`,
    },
    LOCATION_ID_SEARCH: {
      with: (city, country, mode, postalCode, state, streetName, streetNo) =>
        `locations/?city=${city}&country=${country}&mode=${mode}&postalCode=${postalCode}&state=${state}` +
        `&streetName=${streetName}&streetNo=${streetNo}`,
    },
    RECORD_TYPE_ADMINS: {
      with: (recordTypeAdminId: string) =>
        `record_type_admins/${recordTypeAdminId}`,
    },
    FLAGS_WITH_ID: {
      with: (flagId: string) => `flags/${flagId}`,
    },
    ENTITY_FLAG_XREFS_WITH_ID: {
      with: (flagId: string) => `entity_flag_xrefs/${flagId}`,
    },
    SEARCH_FLAG_DETAILS: {
      with: (entityPrimaryKey: string, entityTypeID: number, flagID: string) =>
        `entity_flag_xrefs?entityPrimaryKey=${entityPrimaryKey}&entityTypeID=${entityTypeID}&flagID=${flagID}`,
    },
    RECORD_NUMBER_SCHEMAS: {
      with: (recordNumberSchemaTypeID: number) =>
        `record_number_schemas?filter[recordNumberSchemaTypeID]=${recordNumberSchemaTypeID}`,
    },
    UNASSIGN_ALL_FROM_USER: 'unassignAllFromUser',
    REPORTABLES: {
      with: (reportScopeID: number) =>
        `reportables?reportScopeID=${reportScopeID}`,
    },
    RECORD_TYPE_ADMIN: 'record_type_admins',
    ASSIGNED_TASKS: {
      with: (assignedToUserID: string, order: string) =>
        `record_steps?assignedToUserID=${assignedToUserID}&limit=20&offset=0&order=${order}&realm=inbox&status=1`,
    },
  },
};
