import {notStrictEqual, strictEqual} from 'assert';
import {
  makeCitApiRequest,
  makeCitDevApiRequest,
  makeCitNodeApiRequest,
  servicePath,
} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {expect} from '../../base/base-test';

const subdomain = () => baseConfig.citApiConfig.subdomain;

interface GetUser {
  id: string;
  entityID: string;
  entityType: string;
  resultText: string;
  secondaryText: string;
  resultIcon: string;
}
export interface GetUsers {
  searchResult: GetUser[];
}

interface GeneralPaymentSettingsObjectType {
  data: {
    id: '1';
    attributes: {
      addressIntegration?: boolean;
      generalSettingsID?: number;
      currencyID?: number;
      allowTestPayments?: boolean;
      allowCCPayments?: boolean;
      allowACHPayments?: boolean;
      mapDefaultLatitude?: number;
      mapDefaultLongitude?: number;
      publicPortalPhoto?: string;
      publicPortalPhotoCredit?: string;
      publicPortalHeadline?: string;
      publicPortalSubHeader?: string;
      achPaymentLimit?: number;
      ccPaymentLimit?: number;
      accountingEmail?: any;
      publicPortalEnabled?: boolean;
      allowPublicRecordSearch?: boolean;
      allowPublicLocationSearch?: boolean;
      timeZoneID?: number;
      timeZoneName?: string;
      communityPaysCCFee?: boolean;
      communityPaysCheckFee?: boolean;
      dateFormatID?: number;
      reportingEntity?: string;
      ogReportingEnabled?: boolean;
    };
  };
}
export const baseGeneralPaymentSettingsObject: GeneralPaymentSettingsObjectType =
  {
    data: {
      id: '1',
      attributes: {
        generalSettingsID: 1,
      },
    },
  };

interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: number;
  employee: string;
  emailNotification: boolean;
  emailVerified: boolean;
  isActive: boolean;
  superUser: boolean;
  supportEnabled: boolean;
}

export class CommonApi {
  async getSystemSettings() {
    const responseJson: any = await makeCitApiRequest(
      null,
      servicePath.paths.GENERAL_SETTINGS,
      RequestMethod.GET,
    );
    notStrictEqual(responseJson, null);
    notStrictEqual(responseJson.data, null);
    notStrictEqual(responseJson.data.attributes, null);
    return responseJson.data.attributes;
  }

  async restoreSystemSetting(
    date: DateFormat = DateFormat.US,
    currency: CurrencyFormat = CurrencyFormat.US,
  ) {
    const body = {
      data: {attributes: {dateFormatID: date, currencyID: currency}},
    };
    const responseJson: any = await makeCitApiRequest(
      body,
      servicePath.paths.GENERAL_SETTINGS,
      RequestMethod.PATCH,
    );
    strictEqual(responseJson.data.attributes.dateFormatID, date);
    strictEqual(responseJson.data.attributes.currencyID, currency);
  }

  async updateSystemSettingsPayments(
    neededObjectForPayment: GeneralPaymentSettingsObjectType,
  ) {
    neededObjectForPayment.data.id = '1';
    neededObjectForPayment.data.attributes.generalSettingsID = 1;
    // const responseJson: any = await makeCitApiRequest(
    //     neededObjectForPayment,
    //     servicePath.paths.GENERAL_SETTINGS,
    //     RequestMethod.PATCH,
    // );
    // return [responseJson]; Todo remove Mahesh
    await this.updateSystemSettings(neededObjectForPayment);
  }

  async updateAUSystemSetting() {
    console.debug('Restoring System settings');
    await this.restoreSystemSetting(DateFormat.AU, CurrencyFormat.AU);
  }

  async restoreSearchSettingDev() {
    const body = {
      data: {
        attributes: {
          allowPublicRecordSearch: true,
          allowPublicLocationSearch: true,
        },
      },
    };
    const responseJson: any = await makeCitDevApiRequest(
      body,
      servicePath.paths.GENERAL_SETTINGS,
      RequestMethod.PATCH,
    );
    strictEqual(responseJson.data.attributes.allowPublicRecordSearch, true);
    strictEqual(responseJson.data.attributes.allowPublicLocationSearch, true);
  }

  async getUser(uniqueSearchtext: string, howMany = 1) {
    const responseJson: GetUsers = await makeCitNodeApiRequest(
      null,
      servicePath.paths.USERS_SEARCH.with(uniqueSearchtext, howMany),
      RequestMethod.GET,
    );
    baseConfig.citIndivApiData.searchedUsersList = responseJson;
    console.log(responseJson);
  }

  /**
   * Get user's data like firs & last name, email, and other attributes.
   *
   * @param email email of the user to get
   * @return      attributes of the user
   */
  async getUserData(email: string): Promise<UserAttributes> {
    const response: any = await makeCitApiRequest(
      null,
      servicePath.paths.USERS_BY_EMAIL.with(email),
      RequestMethod.GET,
    );
    expect(response).not.toBeNull();
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0].attributes).toBeDefined();
    expect(response.data[0].attributes).not.toBeNull();
    response.data[0].attributes.id = response.data[0].id.toString();
    return response.data[0].attributes;
  }

  /**
   * Create a new user.
   *
   * @return ID of the new user account
   */
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<string> {
    const payload = {
      data: {
        type: 'users',
        attributes: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          emailNotification: true,
          supportEnabled: false,
          isActive: true,
          employee: [subdomain],
          emailVerified: false,
          userType: 1,
          superUser: false,
        },
      },
    };
    const response: any = await makeCitApiRequest(
      payload,
      servicePath.paths.USERS,
      RequestMethod.POST,
    );
    expect(response).not.toBeNull();
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();

    return response.data.attributes.userID;
  }

  async deleteUser(email: string) {
    const userAttributes: any = await this.getUserData(email);
    const userIdByAscii = userAttributes.userID.replace('|', '%7C');

    await makeCitNodeApiRequest(
      null,
      `${servicePath.paths.UNASSIGN_ALL_FROM_USER}?userID=${userIdByAscii}`,
      RequestMethod.GET,
    );

    const payload = {
      id: userAttributes.userID,
      type: 'users',
      data: {
        attributes: userAttributes,
      },
    };
    payload.data.attributes.userType = 0; // To delete the user

    const response: any = await makeCitApiRequest(
      payload,
      `${servicePath.paths.USERS}/${userIdByAscii}`,
      RequestMethod.PATCH,
    );

    expect(response).not.toBeNull();
    expect(response.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.attributes).toBeDefined();
    expect(response.data.attributes).not.toBeNull();
    expect(response.data.attributes.userType).toEqual(0);
  }

  async updateSystemSettings(payload: GeneralPaymentSettingsObjectType) {
    const responseJson: any = await makeCitApiRequest(
      payload,
      servicePath.paths.GENERAL_SETTINGS,
      RequestMethod.PATCH,
    );
    expect(responseJson?.data?.attributes).toBeDefined();
    expect(responseJson.data.attributes).not.toBeNull();
    return responseJson;
  }

  async changeAddressIntegrationState(to: 'enable' | 'disable') {
    const currentSettings = await this.getSystemSettings();
    const newState = to === 'enable';

    // No need to perform any actions if the current state is already correct
    if (currentSettings.addressIntegration !== newState) {
      const payload: GeneralPaymentSettingsObjectType = {
        data: {id: '1', attributes: currentSettings},
      };
      payload.data.attributes.addressIntegration = newState;

      const responseJson = await this.updateSystemSettings(
        payload as GeneralPaymentSettingsObjectType,
      );
      expect(responseJson.data.attributes.addressIntegration).toEqual(
        payload.data.attributes.addressIntegration,
      );
    }
  }
}

export enum DateFormat {
  US = 1,
  AU = 2,
}

export enum CurrencyFormat {
  US = 1,
  AU = 2,
}
