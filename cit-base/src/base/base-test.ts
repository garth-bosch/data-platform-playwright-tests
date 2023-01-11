import {test as baseTest} from '@playwright/test';

import {baseConfig, IBaseConfig} from './base-config';
import {RecordsApi} from '../api-support/api/recordsApi';
import {RecordTypesApi} from '../api-support/api/recordTypesApi';
import {ReportsApi} from '../api-support/api/reportsApi';
import {CommonApi} from '../api-support/api/commonApi';
import {AuthPage} from '../common-pages/auth-page';
import {GuestsPage} from '../common-pages/guests-page';
import {FormsPage} from '../common-pages/forms-page';
import {RecordAttachmentsApi} from '../api-support/api/recordAttachmentsApi';
import {LocationsApi} from '../api-support/api/locationsApi';
import {ProjectsApi} from '../api-support/api/projectsApi';
import {FlagsApi} from '../api-support/api/flagsApi';
import {RecordStepsApi} from '../api-support/api/recordStepsApi';
import {RecordTypeWorkflowApi} from '../api-support/api/recordTypeWorkflowApi';
import {FormsAPI} from '../api-support/api/formsAPI';
import {AppStoreApi} from '../api-support/api/appStoreApi';

export const test = baseTest.extend<{
  //Test configs..
  baseConfig: IBaseConfig;
  employeeAppUrl: string;
  storefrontUrl: string;

  //Common Objects
  recordsApi: RecordsApi;
  recordStepsApi: RecordStepsApi;
  recordTypeWorkflowApi: RecordTypeWorkflowApi;
  reportsApi: ReportsApi;
  recordTypesApi: RecordTypesApi;
  locationsApi: LocationsApi;
  projectsApi: ProjectsApi;
  flagsApi: FlagsApi;
  commonApi: CommonApi;
  recordAttachmentsApi: RecordAttachmentsApi;
  authPage: AuthPage;
  guestsPage: GuestsPage;
  formsPage: FormsPage;
  formsAPI: FormsAPI;
  appStoreApi: AppStoreApi;
}>({
  authPage: async ({page}, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },
  guestsPage: async ({page}, use) => {
    await use(new GuestsPage(page));
  },
  formsPage: async ({page}, use) => {
    await use(new FormsPage(page));
  },
  recordsApi: async function ({page}, use) {
    await use(new RecordsApi());
    //Records cleanup.
    await recordsAfterHook();
  },
  recordStepsApi: async function ({page}, use) {
    await use(new RecordStepsApi());
    //Records cleanup.
    await recordStepsAfterHook();
  },
  recordTypeWorkflowApi: async function ({}, use) {
    await use(new RecordTypeWorkflowApi());
  },
  locationsApi: async ({}, use) => {
    await use(new LocationsApi());
    //Locations Already cleaned up - clean up via API.
    await locationsAfterHook();
  },
  projectsApi: async ({}, use) => {
    await use(new ProjectsApi());
    //Project after hook.
    await projectsAfterHook();
  },
  flagsApi: async ({}, use) => {
    await use(new FlagsApi());
    //flags after hook.
    await flagsAfterHook();
  },
  reportsApi: async ({}, use) => {
    await use(new ReportsApi());
    //Records cleanup.
    await reportsAfterHook();
  },
  recordTypesApi: async ({}, use) => {
    await use(new RecordTypesApi());
    //Records type cleanup.
    await recordTypesAfterHook();
  },
  commonApi: async ({}, use) => {
    await use(new CommonApi());
  },
  recordAttachmentsApi: async ({}, use) => {
    await use(new RecordAttachmentsApi());
  },
  formsAPI: async ({}, use) => {
    await use(new FormsAPI());
  },
  appStoreApi: async ({}, use) => {
    await use(new AppStoreApi());
  },
  baseConfig: baseConfig,
  employeeAppUrl: baseConfig.employeeAppUrl,
  storefrontUrl: baseConfig.storefrontUrl,
});

export const recordTypesAfterHook = async () => {
  try {
    // Clean up created record type using its ID
    const recordTypeId = baseConfig.citTempData.recordTypeId;
    if (recordTypeId !== '') {
      await new RecordTypesApi().deleteRecordType(recordTypeId);
    }
    const cloneRecordTypeId = baseConfig.citTempData.cloneRecordTypeId;
    if (cloneRecordTypeId !== '') {
      await new RecordTypesApi().deleteRecordType(cloneRecordTypeId);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.recordTypeId = '';
    baseConfig.citTempData.cloneRecordTypeId = '';
  }
};

export const reportsAfterHook = async () => {
  try {
    // Clean up created report using its ID
    const reportId = baseConfig.citTempData.reportId;
    if (reportId !== '') {
      await new ReportsApi().deleteReport(reportId);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.reportId = '';
  }
};

export const locationsAfterHook = async () => {
  console.log('Running:Locations after hook');
  try {
    const locationNumber = baseConfig.citTempData.locationId;
    const locationsApi = new LocationsApi();
    if (locationNumber !== '') {
      await locationsApi.deleteLocationById(locationNumber);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.locationId = '';
  }
};
export const projectsAfterHook = async () => {
  console.log('Running:Project after hook');
  try {
    const projectId = baseConfig.citTempData.projectId;
    const projectApi = new ProjectsApi();
    if (projectId !== '') {
      await projectApi.deleteProject(projectId);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.projectId = '';
  }
};
export const flagsAfterHook = async () => {
  try {
    const flagId = baseConfig.citTempData.flagId;
    if (flagId !== '') {
      await new FlagsApi().deleteFlag(flagId);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.flagId = '';
  }
};
export const recordsAfterHook = async () => {
  console.log('Records after hook');
  try {
    let recordIdByNumber = '';
    // Clean up created record using its Number (Name)
    const recordNumber = baseConfig.citTempData.recordName;
    const recordsApi = new RecordsApi();
    if (recordNumber !== '') {
      recordIdByNumber = await recordsApi.getRecordIdByNumber(recordNumber);
      await recordsApi.deleteRecord(recordIdByNumber);
    }
    // todo need to check why where we are getting record number
    const recordId = baseConfig.citTempData.recordId;
    if (recordId !== '') {
      await recordsApi.deleteRecord(recordId);
    }
  } catch (err) {
    console.info(err);
  } finally {
    baseConfig.citTempData.recordName = '';
    baseConfig.citTempData.recordId = '';
  }
};

export const recordStepsAfterHook = async () => {
  console.log('TODO');
};

export {expect} from '@playwright/test';
