import {makeCitApiRequest, servicePath} from '../citApiHelper';
import {baseConfig} from '../../base/base-config';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {expect} from '@playwright/test';

export class FlagsApi {
  async createFlag(flagName: string, flagTypeID: number) {
    const createFlagPayLoad = {
      data: {
        attributes: {
          flagText: flagName,
          entityTypeID: flagTypeID,
          colorID: 0,
        },
        type: 'flags',
      },
    };
    const response: any = await makeCitApiRequest(
      createFlagPayLoad,
      servicePath.paths.FLAGS_WITH_ID.with(''),
      RequestMethod.POST,
    );
    expect(response?.data?.attributes?.flagID).toBeDefined();
    expect(response.data.attributes.flagID).not.toBeNull();
    baseConfig.citTempData.flagId = response.data.attributes.flagID;
  }

  async assignFlag(flagID: string, flagTypeID: number, assignmentID: string) {
    const assignFlagPayLoad = {
      data: {
        attributes: {
          entityPrimaryKey: assignmentID,
          entityTypeID: flagTypeID,
          flagID: flagID,
        },
        type: 'entity-flag-xrefs',
      },
    };
    const response: any = await makeCitApiRequest(
      assignFlagPayLoad,
      servicePath.paths.ENTITY_FLAG_XREFS_WITH_ID.with(''),
      RequestMethod.POST,
    );
    expect(response?.data?.id).toBeDefined();
    expect(response.data.id).not.toBeNull();
  }

  async removeFlagAssignment(
    flagID: string,
    flagTypeID: number,
    assignmentID: string,
  ) {
    console.log(`Removing the Flag: ${flagID}`);
    const response = await makeCitApiRequest(
      null,
      servicePath.paths.SEARCH_FLAG_DETAILS.with(
        assignmentID,
        flagTypeID,
        flagID,
      ),
      RequestMethod.GET,
    );
    expect(response?.data).toBeDefined();
    expect(response.data).not.toBeNull();
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0].id).not.toBeNull();

    await makeCitApiRequest(
      null,
      servicePath.paths.ENTITY_FLAG_XREFS_WITH_ID.with(response.data[0].id),
      RequestMethod.DELETE,
    );
  }

  async deleteFlag(flagId: string) {
    console.log(`Deleting the Flag: ${flagId}`);
    await makeCitApiRequest(
      null,
      servicePath.paths.FLAGS_WITH_ID.with(flagId),
      RequestMethod.DELETE,
    );
  }
}
