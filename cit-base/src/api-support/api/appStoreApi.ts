import {baseConfig} from '../../base/base-config';
import {
  fetchResponse,
  RequestMethod,
} from '@opengov/playwright-base/build/api-support/apiHelper';
import {expect} from '@playwright/test';
import {makeCitGraphQlApiRequest, makeOauthRequest} from '../citApiHelper';

export class AppStoreApi {
  async createAppInOAuth(appName: string) {
    const body = {
      name: appName,
    };
    const response = await makeOauthRequest(
      baseConfig.citApiConfig.oAuthAppUrl,
      body,
      RequestMethod.POST,
    );
    expect(response.client_id).toBeDefined();
    expect(response.client_id).not.toBeNull();
    expect(response.client_secret).toBeDefined();
    expect(response.client_secret).not.toBeNull();
    console.log('client id', response.client_id);
  }
  async deleteAppUser(clientId: string) {
    const response = await makeOauthRequest(
      `${baseConfig.citApiConfig.oAuthAppUrl}/${clientId}`,
      null,
      RequestMethod.DELETE,
    );
    console.log(`Deleted client id: ${clientId}`);
  }

  async deleteApp({clientID, appID}) {
    const deleteApp = {
      query: `mutation {
      deleteApp (clientID: "${clientID}", appID: "${appID}") 
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      deleteApp,
      RequestMethod.POST,
    );
  }

  async addNewApp(appDetails: {
    appName: string;
    appDescription: string;
    homeUrl: string;
    clientId: string;
    webHookUrl: string;
  }) {
    const createAppData = {
      query: `mutation {
      addApp (input: {
        name: "${appDetails.appName}", 
        description: "${appDetails.appDescription}", 
        infoUrl: "${appDetails.homeUrl}", 
        clientID: "${appDetails.clientId}", 
        webhooksDeliveryUrl: "${appDetails.webHookUrl}"}) {
        name
        id
        description
        infoUrl
      }
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      createAppData,
      RequestMethod.POST,
    );
    expect(response.data.addApp.name).toBeDefined();
    expect(response.data.addApp.name).not.toBeNull();
    expect(response.data.addApp.id).toBeDefined();
    expect(response.data.addApp.id).not.toBeNull();
    baseConfig.citTempData.appId = response.data.addApp.id;
  }

  async appInstallationMutation({clientID, appID}) {
    const appInstall = {
      query: `mutation {
      installAppOnTarget (clientID: "${clientID}", appID: "${appID}") 
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      appInstall,
      RequestMethod.POST,
    );
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.installAppOnTarget).toEqual(true);
  }

  async appUninstallationMutation({clientID, appID}) {
    const appUnInstall = {
      query: `mutation {
      uninstallAppFromTarget (clientID: "${clientID}", appID: "${appID}") 
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      appUnInstall,
      RequestMethod.POST,
    );
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.uninstallAppFromTarget).toEqual(true);
  }

  async enableInstallApp({clientID, appID}) {
    const appEnable = {
      query: `mutation {
      enableAppOnTarget (clientID: "${clientID}", appID: "${appID}") 
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      appEnable,
      RequestMethod.POST,
    );
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.enableAppOnTarget).toEqual(true);
  }

  async disableInstallApp({clientID, appID}) {
    const appDisable = {
      query: `mutation {
      disableAppFromTarget (clientID: "${clientID}", appID: "${appID}") 
    }`,
    };
    const response = await makeCitGraphQlApiRequest(
      baseConfig.citApiConfig.appStoreGraphQlUrl,
      appDisable,
      RequestMethod.POST,
    );
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.disableAppFromTarget).toEqual(true);
  }
}
