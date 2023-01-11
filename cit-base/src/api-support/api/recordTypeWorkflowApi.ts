import {baseConfig} from '../../base/base-config';
import {makeCitNodeApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {DataGetters} from './interfaces-and-data/data-getters';
import {
  RecordType,
  RecordTypeWorkflowPayloadAndResponseBody,
} from './interfaces-and-data/default-payloads-interfaces';
import {expect} from '../../base/base-test';

export class RecordTypeWorkflowApi {
  async setRecordTypeToRenewalFlowsOnOff(
    givenWorkflowStepTemplate?: RecordType,
  ) {
    const finalPayload = await new DataGetters().getRenewalDefaults(
      givenWorkflowStepTemplate,
    );
    const response: RecordType = await makeCitNodeApiRequest(
      finalPayload,
      servicePath.paths.RECORD_TYPES.with(
        String(givenWorkflowStepTemplate.recordType.recordTypeID),
      ),
      RequestMethod.PUT,
    );
    expect(response?.recordType.recordTypeID).not.toBeNull();
    expect(response?.recordType.name).not.toBeNull();
    baseConfig.citIndivApiData.addRecordTypeResult.push(response);
    return response;
  }

  async addWorkflowToRecordType(
    givenWorkflowStepData?: RecordTypeWorkflowPayloadAndResponseBody,
  ) {
    const finalPayload = await new DataGetters().getRtWorkflowDefaults(
      givenWorkflowStepData,
    );
    const response: RecordTypeWorkflowPayloadAndResponseBody =
      await makeCitNodeApiRequest(
        finalPayload,
        servicePath.paths.RECORD_TYPE_TEMPLATE_STEPS,
        RequestMethod.POST,
      );
    expect(response?.templateStep.template_StepID).not.toBeNull();
    expect(response?.templateStep.recordTypeID).not.toBeNull();
    baseConfig.citIndivApiData.workflowTypeResult.push(response);
    return response;
  }

  async updateWorkflowForRecordType(
    givenWorkflowStepData?: RecordTypeWorkflowPayloadAndResponseBody,
  ) {
    const finalPayload = await new DataGetters().getRtWorkflowDefaults(
      givenWorkflowStepData,
    );
    expect(
      Number(givenWorkflowStepData.templateStep.template_StepID),
    ).toBeGreaterThan(0);
    const response: RecordTypeWorkflowPayloadAndResponseBody =
      await makeCitNodeApiRequest(
        finalPayload,
        `${servicePath.paths.RECORD_TYPE_TEMPLATE_STEPS}/${givenWorkflowStepData.templateStep.template_StepID}`,
        RequestMethod.PUT,
      );
    expect(response?.templateStep.template_StepID).not.toBeNull();
    expect(response?.templateStep.recordTypeID).not.toBeNull();
    baseConfig.citIndivApiData.workflowTypeResult.push(response);
    return response;
  }
}
