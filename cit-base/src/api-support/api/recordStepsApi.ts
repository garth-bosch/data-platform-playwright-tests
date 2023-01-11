import {makeCitApiRequest, servicePath} from '../citApiHelper';
import {RequestMethod} from '@opengov/playwright-base/build/api-support/apiHelper';
import {baseConfig} from '../../base/base-config';
import {CommonApi} from './commonApi';

export enum StepTypeID {
  Approval = 1,
  Payment = 2,
  Inspection = 4,
  Document = 5,
}

export enum DeadlineTypeID {
  DaysAfterStepActivation = 1,
  DaysAfterStepAssignment = 2,
  DaysAfterRecordSubmission = 3,
}

export enum Status {
  One = 1,
  Two = 2,
  Three = 3,
  Zero = 0,
}

export enum FeeId {
  Additional_Fee = 446,
  TestFee = 434,
  TestFee_Adhoc = 5226,
}

export enum ShowToPublic {
  Two = 2,
  One = 1,
  Zero = 0,
}

interface BaseCommentsTemplateType {
  step_CommentID?: string;
  userID?: string;
  record_StepID?: number;
  comment?: string;
  date?: string;
  isEnabled?: boolean;
  isInternalComment?: boolean;
}

const baseStepTemplate = () => {
  return {
    data: {
      attributes: {
        record_StepID: null,
        recordID: null,
        recordNo: null,
        label: 'Default Label',
        showToPublic: ShowToPublic.One,
        stepTypeID: StepTypeID.Document,
        orderNo: null,
        sequence: false,
        deadline: null,
        isEnabled: true,
        visible: true,
        stepStatusName: null,
        lastUpdatedDate: null,
        notifyUser: null,
        stepActivatedDate: `${new Date().toUTCString()}`,
        completionDate: null,
        timeIn: null,
        timeOut: null,
        userID: null,
        firstName: null,
        lastName: null,
        picURL: null,
        html: '',
        userAccessLevel: null,
        lastReadDate: null,
        unread: false,
        helpText: null,
        template_StepID: null,
        expires: null,
        expirationDate: null,
        expiresAfter: false,
        expiresAfterAmount: null,
        expiresAfterUnit: null,
        expiresOnMonth: null,
        expiresOnDay: null,
        minimumValidAmount: null,
        minimumValidUnit: null,
        docTemplateID: 1004971,
        docType: null,
        docPortrait: null,
        portrait: false,
        publicCanPrint: true,
        publicCanRequest: false,
        autoAssign: false,
        applicantFirstName: null,
        applicantLastName: null,
        streetNo: null,
        streetName: null,
        forceReload: false,
        locationID: null,
        recordTypeID: null,
        recordType: null,
        recordTypeName: null,
        docTitle: '',
        iconURL: null,
        iconID: null,
        unassign: false,
        waivedUserID: null,
        lastUpdatedByUserID: null,
        processingFlat: null,
        processingPercent: null,
        assignedToUserID:
          null /* Later reference - actual user values 'auth0|5ec573097f6d6c0c69f2136a' */,
        plaidProcessingFee: null,
        ViewAccessID: null,
        status: Status.Two,
        /*Later reference - 0 created, 1, issued, 2 Complete*/
        logicalOperatorTypeID: null,
      },
      type: 'record-steps',
    },
  };
};

const baseFeesTemplate = {
  record_StepID: 0,
  feeID: FeeId.TestFee,
  recordID: 0,
};

const baseCommentsTemplate = {
  data: {
    attributes: {
      step_CommentID: null,
      userID: baseConfig.citTempData.lastUpdatedByUserID,
      record_StepID: 0,
      comment: 'Default comment',
      date: new Date().toISOString(),
      isEnabled: true,
      isInternalComment: true,
    },
    type: 'step-comments',
  },
};

export class RecordStepsApi {
  async updateBaseConfigStepData(
    stepResultPayload: RecordStepResult | FeeStepResult,
  ) {
    baseConfig.citTempData.record_StepID = String(
      stepResultPayload.data.attributes.record_StepID,
    );
    baseConfig.citTempData.lastUpdatedByUserID =
      stepResultPayload.data.attributes.lastUpdatedByUserID;
    stepResultPayload?.data?.attributes?.step_FeeID
      ? (baseConfig.citTempData.feeId =
          stepResultPayload.data.attributes.step_FeeID)
      : '';
  }

  async addDocumentStep(
    label = `Default Document Label`,
    status:
      | Status.Zero
      | Status.One
      | Status.Two = Status.Two /* , Added? , Issued*/,
    recordId = baseConfig.citTempData.recordId,
  ) {
    const updatedDocStepTemplate = baseStepTemplate();
    updatedDocStepTemplate.data.attributes.recordID = recordId;
    updatedDocStepTemplate.data.attributes.label = label;
    updatedDocStepTemplate.data.attributes.status = status;
    const docPayload: RecordStepResult = await makeCitApiRequest(
      updatedDocStepTemplate,
      servicePath.paths.RECORD_STEPS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.docRecordStepResult = docPayload;
    await this.updateBaseConfigStepData(docPayload);
    return [docPayload, docPayload.data.id];
  }

  async addPaymentStep(
    label = `Default Fees Label`,
    status: 0 | 1 | 2 = 2 /* Initial, Due , Paid */,
    recordId = baseConfig.citTempData.recordId,
    feeType = FeeId.TestFee,
  ) {
    const updatedDocStepTemplate = baseStepTemplate();
    updatedDocStepTemplate.data.attributes.recordID = recordId;
    updatedDocStepTemplate.data.attributes.label = label;
    updatedDocStepTemplate.data.attributes.status = status;
    updatedDocStepTemplate.data.attributes.stepTypeID = StepTypeID.Payment;
    updatedDocStepTemplate.data.attributes.html = null;
    updatedDocStepTemplate.data.attributes.publicCanPrint = false;
    updatedDocStepTemplate.data.attributes.docTitle = null;

    const docPayload: RecordStepResult = await makeCitApiRequest(
      updatedDocStepTemplate,
      servicePath.paths.RECORD_STEPS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.paymentRecordStepResult = docPayload;
    const givenFeeObject = baseFeesTemplate;
    givenFeeObject.feeID = feeType;
    givenFeeObject.recordID = Number(recordId);
    givenFeeObject.record_StepID = docPayload.data.attributes.record_StepID;

    const feePayload: FeeStepResult = await makeCitApiRequest(
      givenFeeObject,
      servicePath.paths.STEP_FEES_ADHOC,
      RequestMethod.POST,
    );
    const feeId = feePayload.data.attributes.step_FeeID;
    baseConfig.citIndivApiData.feeStepResult = feePayload;
    await this.updateBaseConfigStepData(feePayload);
    return [docPayload, docPayload.data.id, feeId];
  }

  async addApprovalStep(
    label = `Default Approval step`,
    status: 0 | 1 | 2 = 2 /* Initial, Due , Paid */,
    recordId = baseConfig.citTempData.recordId,
  ) {
    const updatedDocStepTemplate = baseStepTemplate();
    updatedDocStepTemplate.data.attributes.recordID = recordId;
    updatedDocStepTemplate.data.attributes.label = label;
    updatedDocStepTemplate.data.attributes.status = status;
    updatedDocStepTemplate.data.attributes.stepTypeID = StepTypeID.Approval;
    updatedDocStepTemplate.data.attributes.html = null;
    updatedDocStepTemplate.data.attributes.publicCanPrint = false;
    updatedDocStepTemplate.data.attributes.docTitle = null;

    const approvalPayload: RecordStepResult = await makeCitApiRequest(
      updatedDocStepTemplate,
      servicePath.paths.RECORD_STEPS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.approvalRecordStepResult = approvalPayload;
    await this.updateBaseConfigStepData(approvalPayload);
    return [approvalPayload, approvalPayload.data.id];
  }

  async addInspectionStep(
    label = `Adhoc-Inspection`,
    status: 0 | 1 | 2 = 1 /* 1 = scheduled ? */,
    recordId = baseConfig.citTempData.recordId,
    assignEmail?: string,
  ) {
    const updatedDocStepTemplate = baseStepTemplate();
    updatedDocStepTemplate.data.attributes.recordID = recordId;
    updatedDocStepTemplate.data.attributes.label = label;
    updatedDocStepTemplate.data.attributes.status = status;
    updatedDocStepTemplate.data.attributes.stepTypeID = StepTypeID.Inspection;
    updatedDocStepTemplate.data.attributes.html = null;
    updatedDocStepTemplate.data.attributes.publicCanPrint = false;
    updatedDocStepTemplate.data.attributes.docTitle = null;

    const inspectionPayload: RecordStepResult = await makeCitApiRequest(
      updatedDocStepTemplate,
      servicePath.paths.RECORD_STEPS,
      RequestMethod.POST,
    );
    baseConfig.citIndivApiData.inspectionRecordStepResult.push(
      inspectionPayload,
    );
    await this.updateBaseConfigStepData(inspectionPayload);
    if (assignEmail) {
      await new CommonApi().getUser(assignEmail, 1);
      await this.assignUserToStep();
    }
    return [inspectionPayload, inspectionPayload.data.id];
  }

  async assignUserToStep() {
    /* should be default payload from the step definition*/
  }

  /* Todo update to getter method inputs*/
  async addStepComments(commentsTemplate?: BaseCommentsTemplateType) {
    const givenCommentsTemplate = baseCommentsTemplate;
    givenCommentsTemplate.data.attributes.record_StepID =
      commentsTemplate?.record_StepID
        ? Number(commentsTemplate.record_StepID)
        : Number(baseConfig.citTempData.record_StepID);
    commentsTemplate?.comment
      ? (givenCommentsTemplate.data.attributes.comment =
          commentsTemplate.comment)
      : '';
    commentsTemplate?.isEnabled
      ? (givenCommentsTemplate.data.attributes.isEnabled =
          commentsTemplate.isEnabled)
      : '';
    commentsTemplate?.isInternalComment
      ? (givenCommentsTemplate.data.attributes.isInternalComment =
          commentsTemplate.isInternalComment)
      : (givenCommentsTemplate.data.attributes.isInternalComment = true);
    commentsTemplate?.userID
      ? (givenCommentsTemplate.data.attributes.userID = commentsTemplate.userID)
      : (givenCommentsTemplate.data.attributes.userID =
          baseConfig.citTempData.lastUpdatedByUserID);
    const stepPayload: CommentStepResult = await makeCitApiRequest(
      givenCommentsTemplate,
      servicePath.paths.STEP_COMMENTS,
      RequestMethod.POST,
    );
    baseConfig.citTempData.step_CommentID = String(
      stepPayload.data.attributes.step_CommentID,
    );
    return [stepPayload, stepPayload.data.id];
  }
}

export interface RecordStepResult {
  data: {
    id: string;
    type: string;
    attributes: {
      record_StepID: number;
      recordID: number;
      label: string;
      showToPublic: boolean;
      stepTypeID: number;
      orderNo: number;
      sequence: boolean;
      status: number;
      assignedToUserID?: any;
      stepActivatedDate: any;
      workflowScenario_StepID?: any;
      waived: boolean;
      waivedUserID?: any;
      autoAssign: boolean;
      publicCanRequest: boolean;
      deadline?: any;
      lastUpdatedByUserID: string;
      isEnabled: boolean;
      visible: boolean;
      lastUpdatedDate?: any;
      template_StepID?: any;
      isVisibleDirty?: any;
      paymentTotal?: any;
      sendActivatedEmail?: any;
      step_FeeID?: any;
      oldStatus?: any;
      id: number;
      step_type?: string;
      /*Below Only for fees*/
      feeID?: number;
      flatAmount?: any;
      accountNumber?: string;
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
      discountAmount?: any;
      refundRemaining?: any;
    };
  };
}

export interface FeeStepResult {
  data: {
    id: string;
    type: string;
    attributes: {
      step_FeeID: number;
      record_StepID: number;
      feeID: number;
      flatAmount?: any;
      accountNumber: string;
      label: string;
      isEnabled: boolean;
      lastUpdatedByUserID: string;
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
      discountAmount?: any;
      paymentTotal?: any;
      refundRemaining?: any;
      recordID?: any;
      id: number;
    };
  };
}

export interface CommentStepResult {
  data: {
    id: string;
    type: string;
    attributes: {
      step_CommentID: number;
      userID: string;
      comment: string;
      date: any;
      record_StepID: number;
      isEnabled: boolean;
      isInternalComment: boolean;
      id: number;
    };
  };
}

export interface LocationStepResult {
  data: {
    id: string;
    type: string;
    attributes: {
      locationID?: number;
      streetNo?: string;
      streetName?: string;
      unit?: any;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      gisID?: any;
      ownerName?: any;
      latitude?: string;
      longitude?: string;
      yearBuilt?: any;
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
      lastUpdatedByUserID?: any;
      lastUpdatedDate?: any;
      matID?: any;
      name?: string;
      notes?: any;
      isEnabled?: boolean;
      archived?: boolean;
      subdivision?: any;
      locationTypeID?: number;
      fullAddress?: string;
      locationReportable?: string;
      secondaryLatitude?: any;
      secondaryLongitude?: any;
      segmentPrimaryLabel?: any;
      segmentSecondaryLabel?: any;
      segmentLabel?: any;
      segmentLength?: any;
      id?: number;
      occupancy?: any;
    };
  };
}
