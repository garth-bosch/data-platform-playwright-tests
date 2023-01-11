import {expect} from '../base/base-test';
import {faker} from '@faker-js/faker';
import {resolve} from 'path';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {StripePage} from '@opengov/cit-base/build/common-pages/stripe-payment-page';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {NavigationBarPage} from './navigation-bar-page';
import {RequestChanges} from './request-change-page';
import {Page} from '@playwright/test';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';

const payerNameFake: string = faker.name.fullName();
const paymentNoteFake: string = faker.lorem.sentence();
const checkNumberFake: string = faker.finance.account();
let printRecordName: string[];

type propertyOwnerInLocation = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export class InternalRecordPage extends BaseCitPage {
  readonly stripePage: StripePage = new StripePage(this.page);
  readonly elements = {
    recordStatus: '.status-label',
    recordActionsDropdown: '#record-dropdown-actions',
    superUserRunToSequence: `//div[@id="record-action-bar"]//li[contains(.,"Run Sequence Action")]`,
    recordActionsSupUserGenerateClaimCode: '[data-target="#claimcode"]',
    recordActionsSupUserRunSequenceAction:
      '//li/a[contains(.,"Run Sequence Action")]',
    recordActionsSupUserGoToRecordType:
      '//li/a[contains(.,"Go To Record Type")]',
    printRecordButton: '#action-print-record',
    printPopUpButton:
      '#printRecordModal > div.modal-dialog > div > div.modal-footer > button',
    deleteRecordButton: '#delete-record',
    printRecordTitle: '#main > div.container > h5',
    printRecordStatus:
      '#main > div.container > div:nth-child(7) > div:nth-child(1)',
    deleteReasonInput: 'input[type="text"].bootbox-input',
    dropdownMenulink: {
      selector: (linkName: string) =>
        `//*[@class="btn-group pull-right open"]//a[contains(text(),"${linkName}")]`,
    },
    dialogPopupButton: {
      selector: (buttonName: string) =>
        `//div[@class='modal-dialog']//button[text()="${buttonName}"]`,
    },
    formField: 'form#globalFormSections label',
    confirmDeleteButton: '.btn-danger:enabled',
    timeline: '#timeline',
    recordDetailsTab: '#timeline [href$=form]',
    recordAttachmentsTab: '#timeline [href$=files]',
    recordActivityTab: '#timeline [href$=activity]',
    submittedRecordActivityHeading: '#submitted-record-outlet h4',
    recordApplicantTab: '#timeline [href$=applicant]',
    submittedApplicantImgIcon: '#submitted-record-outlet .record-applicant-pic',
    recordLocationTab: '#timeline [href$=location]',
    submittedLocationImgIcon:
      '#submitted-record-outlet [data-test="primary-location-group"]',
    recordStepContainer: 'div.flex.flex-justify-between.flex-grow',
    recordStepNames: '#timeline [data-test-step="label"]',
    recordStepStatus: '.active [data-test-step="description"]',
    stepPageHeader: '#submitted-record-outlet .media-body h3',
    stepAssignmentIcon: '#submitted-record-outlet div.step-assignment span img',
    assignToMeButton: '#submitted-record-outlet .popover button',
    assignToUser: '#submitted-record-outlet .popover .form-control',
    assignedUser: {
      selector: (assigneeName: string) =>
        `//div[label[contains(.,"Assignee")] ]//span[@class="step-assignment" and contains(.,"${assigneeName}")]`,
    },
    proposedUser: '.media-body > small',
    completeStepButton: '#step-action-approve',
    confirmCompleteButton: '.modal-dialog .btn-success',
    cashOrCheckRadioButton:
      'input[id="input"][name="paymentradios"][value="cash"]',
    creditCardPaymentRadioButton:
      'input[id="input"][name="paymentradios"][value="credit"]',
    payButton: '.panel-body .btn-group .btn-primary',
    confirmPayButton: '#offlinePayButton',
    refundMethodSelectorDropdown: '#offline-refund-method',
    paymentMethodSelectorDropdown: '#offline-payment-method',
    paymentMethodCashDropdownOption:
      '#offline-payment-method option[value="2"]',
    paymentMethodCheckDropdownOption:
      '#offline-payment-method option[value="3"]',
    partialPaymentOptionSelector: 'input[name=offlinePaymentOption][value="2"]',
    partialPaymentFirstFeeAmountInput:
      '.partialAmountBox tr:nth-of-type(1) input',
    payerNameInput: `input#payer-name`,
    checkNumberInput: `input#check-number`,
    paymentNoteInput: `input#payment-note`,
    paymentTableData: `table[class="table report"] td`,
    globalFormsSection: '#globalFormSections',
    fileUploadingTab: '#File_Uploading',
    commentsTabsLink: '#commentTabs [data-toggle="tab"]',
    commentInputField: '.froala-editor-instance > div > div',
    commentSubmitButton: '#step-comment-submit',
    commentBody: '.comment-body',
    addFeeButton: '.svg-plus',
    selectFeeToAdd: '[name="stepFeeSelector"]',
    firstFeeFromDropdown: '//option[contains(., "Additional Fee")]',
    submitFeeButton: '.table .pull-right .btn-primary',
    feeBill: '.fee-override',
    deleteFeeButton: '.panel-body .table .close',
    deleteFeeByName: {
      selector: (feeName: string) =>
        `//span[@title="${feeName}"]/../../td[3]//span`,
    },
    confirmFeeButton: '.bootbox-confirm .btn-primary',
    waivePaymentButton: '.panel-body > .btn-default',
    cashOption: '2',
    checkOption: '3',
    paymentContinueButton: 'button[id="submitButton"]',
    emailCardInput: 'input[type="email"]',
    nameCardInput: 'input[placeholder="Name"]',
    streetCardInput: 'input[placeholder="Address"]',
    cityCardInput: 'input[placeholder="City"]',
    countryCardInput: '#billing-country',
    postCodeCardInput: 'input[placeholder="ZIP"]',
    cardNumber: 'input[placeholder="Card number"]',
    cardExpiry: 'input[placeholder="MM / YY"]',
    cardCVC: 'input[placeholder="CVC"]',
    payUSDbutton: '#submitButton',
    cardPaymentFrame: 'iframe[name="stripe_checkout_app"]',
    paymentOptionButton: `(//i[contains(@class, "fa-ellipsis-v")])[last()]`,
    paymentRefundButton: '.text-right li:nth-child(2) > a',
    refundSubmitButton: '#refundButton',
    partialPaymentRefundAmount: '[name="partialRefundAmount"]',
    refundPaymentMark: '.text-right .text-warning',
    partialPaymentRefundButton: '[name="refundOption"][value="2"]',
    partialRefundDueAmount: {
      selector: (amountDue: string) =>
        `//tr[ td[contains(., "Total Due:")]]//span[contains(.,"${amountDue}")]`,
    },
    refundAmountLineItem: {
      selector: (amountDue: string) =>
        `//td[span[contains(text(), "Refund")]]/ancestor::tr/td[contains(., "($${amountDue})")]`,
    },
    refundAmountPaymentMethodLineItem: {
      selector: (paymentMethod: string) =>
        `//td[span[contains(text(), "Refund")]]/ancestor::tr/td[contains(., "${paymentMethod}")]`,
    },
    partialRefundPaidAmount: {
      selector: (amountPaid: string) =>
        `//tr[ td[contains(., "Total Paid:")]]//span[contains(.,"${amountPaid}")]`,
    },
    refundOwedAmount: {
      selector: (owedAmount: string) =>
        `//tr[ td[contains(., "Refund Owed:")]]//span[contains(.,"${owedAmount}")]`,
    },
    paymentVoidButton: '.text-right li:nth-child(3) > a',
    voidSubmitButton: '.modal-footer .btn-danger',
    voidPaymentMark: '.text-right .text-danger',
    printReceiptButton: '(//a[contains(@id, "payment-receipt")])[last()]',
    addNewRecordStepButton: '#add-new-timeline-btn',
    approvalDropdownOption: '#add-approval-link',
    paymentDropdownOption: '#add-payment-link',
    inspectionDropdownOption: '#add-inspection-link',
    newApprovalStepNameInput: 'input[name="approvalStepTitle"]',
    newApprovalUnassignedButton:
      '#addapproval div.step-assignment .no-assignment',
    newApprovalUnassignedSearchUser: '#stepAssignment_undefined_textBox',
    newApprovalUnassignedFirstRow:
      '#stepAssignment_undefined div.resultRow h5.media-heading',
    newApprovalUnassignedAddUser:
      '#addapproval .modal-footer button.btn.btn-primary',
    newPaymentStepNameInput: 'input[name="paymentStepLabel"]',
    newInspectionStepNameInput: 'input[name="InspectionStepLabel"]',
    newRecordStepSubmitButton: '.in .btn-primary',
    recordStepHeader: '.media-heading',
    stepMenuButton: '.panel-body #record-dropdown-actions',
    deleteStepButton: 'a[data-test-step-action="delete"]',
    submitDeletionButton: '.btn-danger',
    applicantMenuButton: '#record-applicant',
    clickHereToAddApplicantButton: '#submitted-record-outlet a',
    applicantInput: '#userSearchKey_textBox',
    applicantDropdownElement: '.resultRow',
    applicantPicture: '.record-applicant-pic',
    addInspectionTypeButton: '//button[contains(.,"Add Inspection Type")]',
    inspectionInput: '#inspectionTypeSearch_textBox',

    inspectionDropdownElement: {
      selector: (optionText: string) =>
        `//*[@id="inspectionTypeSearch"]//h5[contains(.,"${optionText}")]`,
    },
    removeInspectionButton: '.panel-default .table .close',
    dueDateButton: '.calendar',
    dueDateCalendarToday: '//td[contains(@class, "is-today")]/button',
    renewRecordButton: '#renew-record',
    confirmPopupButton: '.bootbox .btn-primary',
    submitRenewNewRecord: '#submit-record',
    beginRenewNewRecord: '//button[contains(., "begin renewal")]',
    renewalLabel: '#record-number .text-muted',
    documentDropdownOption: '#add-doc-link',
    documentTemplateDropdown: '[id*=recordStepDocTemplateSelectorID]',
    documentTemplateOptions: {
      selector: (optionName: string) =>
        `//option[ contains(., '${optionName}')]`,
    },
    addDocumentBtn:
      '#adddocument .modal-content .modal-footer button:nth-of-type(2)',
    documentRecordID: '#pagecontent table p:nth-of-type(1) span',
    documentRecordName: '#pagecontent p:nth-child(2) strong',
    documentUserName: {
      selector: (uname: string) => `//td[text()='${uname}']`,
    },
    documentLocation: {
      selector: (docLoc: string) => `//p[text()='${docLoc}']`,
    },
    digitalSignature: 'p.eSignature',
    digitalSignatureFormFieldCheckbox: '.esignature-form-field-outer-div input',
    digitalSignatureFormInput: '.new-esignature',
    digitalSignatureFormSaveButton: 'div#new-signature-modal .btn-primary',
    digitalSignatureInnerText: '.esignature-form-field-outer-div span',
    documentCompleteIcon:
      '.ember-view.pointer .svg-document.record-icon-complete',
    issuedDocument: '#pagecontent',
    recordID: '#record-number',
    recordName: '#record-type-name',
    printDoc: 'iframe#printdoc.doc-frame',
    toggleExpireOnDocument: 'span.switch-square label[for="adHoc_expires"]',
    documentExpireSelector: 'select#adHoc_expiresLogic',
    documentExpireInput: 'input#adHoc_expiresAfterAmount',
    documentExpireUnitSelector: 'select#adHoc_expiresAfterUnitSelection',
    expirationDate: '.svg-calendar',
    calendarDate: {
      selector: (day: string) => `//tr[ td[@data-day='${day}'] ]`,
    },
    reportColumnName: {
      selector: (column: string) =>
        `//table[contains(@class,'table-reports')]//th[contains(.,'${column}')]`,
    },
    reportTable: '.table-reports tbody',
    renewalsForRecord: '.panel.panel-default',
    originalRecord: '.text-center strong',
    latestRecord: '.table tbody tr:nth-of-type(1) td:nth-of-type(2) span',
    expirationDateSelected: `button[data-hint='Expiration Date'] span`,
    formFieldValue: '#pagecontent div p:nth-of-type(2)',
    calcFormFieldValue: '#pagecontent div p:nth-of-type(3)',
    multiEntryFFValue: '#pagecontent div ul:nth-of-type(1) li',
    calcMultiEntryFFValue: '#pagecontent div ul:nth-of-type(2) li',
    fileUploadBtn: '#FileInput_Adhoc',
    confirmFileUploadBtn: '#addAttachmentsModal .btn.btn-primary',
    attachmentTab: '#record-attachments',
    noAttachmentSection: '.panel-body-lg.text-center',
    attachmentName: '.media-heading.blue',
    attachmentFolder: '#record-attachment',
    attachmentInfo: '#record-files .text-muted',
    downloadAttachmentLink: '.panel-body .btn.btn-naked',
    thumbnailImage: 'a[class*=thumbnail]',
    uploadNewFileBtn: '[type=file]',
    attachmentFileSelected: '.panel-body.cr-attachment.file-selected-outline',
    uploadedFileBadge: '.div-hover-parent .badge',
    uploadFileVersion: '.table tbody tr',
    uploadedFormFieldFileBadge: '.form-group .badge',
    fileDownloadBtn: '.fa.fa-download',
    uploadPredefinedAttachment: {
      selector: (attachmentName: string) =>
        `//h4[text()='${attachmentName}']/ancestor::div/input`,
    },
    fileUploadImageThumbnail: 'div.fileUpload img',
    fileUploadNonImageThumbnail: `//div[@class="fileUpload"]//div`,
    attachedFile: {
      selector: (attachmentName: string) =>
        `//h4[text()='${attachmentName}']/ancestor::div[@class='panel-body cr-attachment file-selected-outline  ']`,
    },
    attachmentOrder: '#record-files div:nth-child(2) div.row a a',
    attachmentFileVersionOrder: '#attachmentPanel tbody tr td:nth-of-type(2)',
    reissueActionDropdown: '[id*=stepPanel] .dropdown-toggle',
    reissueDocumentLink: '.btn-group.open li a',
    confirmReissueBtn: '.modal-content .modal-footer button',
    versionHistoryPanel: '[id*=stepPanel] .panel.panel-default',
    versionHistoryPanelTableCellWithText: {
      selector: (text) =>
        `//*[contains(@id,"stepPanel")]//table//td[contains(normalize-space(.),"${text}")]`,
    },
    reissuedLabel: 'h4 div.label.label-default',
    processingSpinner: '.fa.fa-circle-o-notch.fa-spin',
    documentAttachment: '#pagecontent div div',
    documentSignature: 'em span',
    thumbnailImageOnDocument: '#pagecontent p img[src*=thumbnail]',
    multiEntryThumbnailImageOnDoc: '#pagecontent div.form-group div img',
    multiEntryDocumentAttachment: '#pagecontent div.form-group div div',
    multiEntryDocumentSignature: '#pagecontent div.form-group:nth-child(3) div',
    documentDefaultOgLogo: '#pagecontent img[alt="logo"]',
    feeItem: {
      selector: (fee, feeValue) => `//span[text()='${fee}: ${feeValue}']`,
    },
    dueDate: '.calendar',
    assignee: '.media-body .step-assignment.no-assignment span',
    assigneeToMeButton: '.popover-content .btn-default',
    assigneeEmailInput:
      '//input[@name="searchFor" and contains(@id, "stepAssignment")]',
    assigneeEmailSearchResultRow: {
      selector: (email: string) =>
        `//*[contains(@class, 'resultRow')]//small[contains(.,"${email}")]`,
    },
    assigneeAdded: 'div#submitted-record-outlet span.text-muted',
    assigneeAddFinally: `//*[@id='addinspection']//button[contains(.,"Add")]`,
    monthSelectorSelect: '.pika-select-month',
    monthSelectorOption: '.pika-select-month option',
    dateSelector: {
      selector: (date: string) => `//td[@data-day='${date}']/button`,
    },
    dueDateTextInTimeline: {
      selector: (workflowStep: string) =>
        `//*[contains(@class, "media") and .//h4[text()="${workflowStep}"]]//span[@data-test-step="deadline"]`,
    },
    globalSearchBar: '#mainSearchBar_textBox',
    showTimelineCheckbox: '#printRecordTimeline',
    showActivityCheckbox: '#printRecordModelActivity',
    showApplicantCheckbox: '#printRecordModelApplicant',
    showLocationCheckbox: '#printRecordModelLocation',
    showEmptyFieldsCheckbox: '#printRecordModelEmpty',
    showAttachmentsCheckbox: '#printRecordModelAttachments',
    showInternalFieldsCheckbox: '#printRecordModelInternal',
    timelinePreviewTable: '.timeline-table',
    labelCell: 'td[data-test-step="label"]',
    statusCell: 'td[data-test-step="status"]',
    assigneeCell: 'td[data-test-step="assigned"]',
    dueDateCell: 'td[data-test-step="deadline"]',
    dueDateIcon: '.deadline-container svg',
    dropDownCalendar: '#set-step-deadline',
    addToProjectButton: '#add-to-project-link',
    projectLabelOntop: {
      selector: (projectId: string) =>
        `[href="#/explore/projects/${projectId}"]`,
    },
    projectLabelOntopEllipsis:
      '//a[contains(@href,"#/explore/projects" )]//span[@id="flagmenu"]/i ',
    removeProject:
      '//a[contains(@href,"#/explore/projects" )]//ul/li[ a[contains(.,"Remove Project")] ]//i',
    addToProjectSearchBox: '#recordPageProjectSearch_textBox',
    addToProjectSearchBoxResult: '.resultRow h5',
    calendarDay: {
      selector: (dayNumber: string) =>
        `#set-step-deadline tbody td[data-day="${dayNumber}"]`,
    },
    dueDateText: '.deadline-container span.m-l-5',
    formFieldDetails: {
      selector: (formField: string, ffValue: string) =>
        `//label[text()='${formField}']/parent::div/..//div[text()='${ffValue}']`,
    },
    segmentMap: '.map-readonly',
    segmentInformationLabel: '.segment-information h4',
    segmentLocationInfo: {
      selector: (locPoint: string) =>
        `//label[contains(text(),'${locPoint}')]/following-sibling::p`,
    },
    printBtn: '[data-test-action=print]',
    printLocation: '[data-test=location]',
    statusFilter: 'button[data-test-action="filter-status"]',
    statusFilterValue: {
      selector: (filterStatus: string) => `//*[@id="step-status-dropdown"]/li/
        a[contains(normalize-space(),'${filterStatus}')]`,
    },
    workflowStepStatus:
      'button[data-test-action="filter-status"] span:nth-child(2)',
    changedStepStatus: {
      selector: (steStatus: string) => `//*[@id="submitted-record-outlet"]//
        descendant::p[text()='${steStatus}']`,
    },
    inactivePopUpMessage: `div[class="bootbox-body"]`,
    endpointRequestResponse: '.dotmaps-step div:nth-child(2) div h5',
    retryBtn: '#retry',
    responseMessage: `.//label[contains(text(),'Response body')]/following-sibling::p`,
    panelSpinner: '.panel .spinner',
    formFieldEditLink: {
      selector: (sectionName, fieldName) =>
        `//*[text()='${sectionName}']/parent::*//following-sibling::*` +
        `//label[text()='${fieldName}']/following::div[1]`,
    },
    formFieldvalueOnRecord: {
      selector: (sectionName: any, fieldName: any, input: any) =>
        `//*[text()='${sectionName}']/parent::*//following-sibling::*` +
        `//label[text()='${fieldName}']/../following-sibling::div[@class='div-hover' and contains(.,'${input}')]`,
    },
    formFieldEyeBallOnRecord: {
      selector: (sectionName: any, fieldName: any) =>
        `//*[text()='${sectionName}']/parent::*//following-sibling::*` +
        `//label[text()='${fieldName}']//i[contains(@class,'fa-eye-slash')]`,
    },
    formFieldInputBox: {
      selector: (sectionName, fieldName) =>
        `//*[text()='${sectionName}']/parent::*//following-sibling::*` +
        `//label[text()='${fieldName}']/following-sibling::*//input[1]`,
    },
    saveBtnForFormField: `//button[contains(text(),'Save')]`,
    searchResults: '#mainSearchBar .resultRow h5',
    paymentTransactionStatusTable: {
      selector: (status: string) =>
        `//table//td/span[contains(., "${status}")]`,
    },
    receiptBodyTable: '.invoice tr',
    receiptMainHeader: 'td.content-block h1',
    receiptAdditionalHeader: 'td.content-block h3',
    receiptTypeHeader: 'td.content-block h3:nth-child(4)',
    paymentFailedPopup: `//*[@class="bootbox-body"]//*[contains(./h4[text()], "Payment failed")]`,
    paymentFailedPopupMessage: `//*[@class="bootbox-body"]//h4[contains(., "Payment failed")]/following-sibling::p/strong`,
    uploadedFileAction: {
      selector: (section: string) =>
        `.//h4[text()="${section}"]/../..//a[@data-ember-action]`,
    },
    uploadedFileName: {
      selector: (name: string) =>
        `//span[@class="div-hover this-is-here"][contains(., "${name}")]`,
    },
    addLocationLink: `//a[contains(text(),'Click here to add a location')]`,
    viewLocationBtn: `//a[contains(text(),'View Location')]`,
    submitRecordButton: '#submit-record',
    requestChanges: `button[data-hint='Request Changes']`,
    customStepSection: '.shift .nav-pills h4',
    customApprovalAssignee: '#submitted-record-outlet span.step-assignment',
    assignOnMeButton: '//button[contains(.,"Assign to Me")]',
    commentTextInput: '#comment-text-area .fr-element',
    mentionedEmployeeBox: 'div#at-view-64 > ul > li > strong',
    confirmComment: '#step-comment-submit',
    unassignUserIcon: '#submitted-record-outlet [data-hint="Unassign user"] i',
    attachmentSection: {
      selector: (name: string) =>
        `//a[contains(@class,'media-heading blue') and text()='${name}']`,
    },
    uploadNewVersionBtn: `//button[contains(text(), 'Upload New Version')]`,
    fileUploadProgressBar: `//*[contains(text(), 'Uploading your file')]`,
    uploadNewFilesBtn: `//a[contains(@class,'fileUploadRecord')]`,
    noApplicantModalHeading: `//*[@class="bootbox-body"]//h4[contains(text(),
        "There is no applicant to request changes from.")]`,
    noApplicantModalContent: `//*[@class="bootbox-body"]//p[contains(text(),
      "Please add an applicant to this record in order to send a request for changes to them.")]`,
    activityFeedLabel: {
      selector: (name: string) => `//table//td[contains(., "${name}")]`,
    },
    triDotEllipsis: '.location-container button.btn-tridot',
    goToRecordType: '[data-target="#claimcode"]',
    additionalLocTriDotEllipsis:
      '[data-test="additional-location-group"] button.btn-tridot',
    additionalLocViewLocationButton:
      '//*[@data-test="additional-location-group"]//a[contains(.,"View Location")]',
    triDotEllipsisAttachment:
      '//div[div[@class="badge"]]//following-sibling::*//button',

    locationDropdownBtn: `[data-test='primary-location-group'] .dropdown-toggle`,
    dropdownMenuRemove: `[data-test-attribute='remove-location']`,
    removeLocationBtn: `.modal-content .btn-danger`,
    primaryLocation: `[data-test="primary-location-group"] .primary`,
    addPrimaryLocationButton: `//button[ span[contains(., "Add Primary Location")] ]`,
    addAdditionalLocationButton: `[data-test-attribute="add-additional-location-anchor"]`,
    addAdditionalLocationList: 'div.location-container',
    addAdditionalLocationDisableButton:
      'div.add-additional-location-div div.hint--bottom',
    dropdownMenuRemoveLocation: `[data-test-attribute='remove-location']`,
    dropdownMenuChangeLocation: `[data-test-attribute='change-location']`,
    dropDownMenuUpdateLocationOwner: `[data-test-attribute="update-owner-information"]`,
    updateLocationOwnerName: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Name") and not(contains(.,"Street"))]]/input`,
    updateLocationOwnerPhone: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Phone")]]/input`,
    updateLocationOwnerEmail: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Email")]]/input`,
    updateLocationOwnerStreetNo: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Street #")]]/input`,
    updateLocationOwnerStreetName: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Street Name")]]/input`,
    updateLocationOwnerUnit: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Unit")]]/input`,
    updateLocationOwnerCity: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"City")]]/input`,
    updateLocationOwnerState: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"State")]]/input`,
    updateLocationOwnerPostalCode: `//form[@id='editRecordOwnerInformation']//div[label[contains(.,"Zip")]]/input`,
    locationOwnerInformationPanelElement: {
      selector: (label: string, text: string) =>
        `//div[contains(@class,"owner-container")]//div[label[contains(., "${label}")]]/p[contains(normalize-space(),"${text}")]`,
    },
    applicantViewProfileButton: `//a[contains(@href ,"#/explore/users/")]/button[normalize-space()="View Profile"]`,
    locationFlag: '.location-flags',
    backToAttachmentsLink: '//a[contains(., "Back to Attachments")]',
    inputFeeValue: 'input[name=overrideAmount]',
    stepActivityText: 'li.text-muted',
    pointLocationHelpText: '[data-test="point"] .help',
    addresstLocationHelpText: '[data-test="address"] .help',
    segmentLocationHelpText: '[data-test="segment"] .help',
    deleteFileFormField: '//a[contains(text(),"Clear file")]',
    formFieldMergeTag: 'p.conditionalFormField',
    fieldStepLabelInput: `input[step="any"]`,
    fieldStepLabelInputDate: `input[placeholder="MM/DD/YYYY"]`,
    fieldStepLabel: {
      selector: (label: string) => `//label[contains(.,"${label}")]`,
    },
    submittedRecordOutlet: '#submitted-record-outlet',
    locationMenuDropdown: '.dropdown-toggle',
    addressLocationSearchBox: '.address-locations input[type="search"]',
    addressSearchResults: '.location-result',
    confirmLocationButton: '[data-test="select-location-button"]',
    fieldOnRecordPage: {
      selector: (label: string) => `(//h4[contains(.,"${label}")])[1]`,
    },
    overrideAmount: '[name="overrideAmount"]',
    stepIcon: {
      selector: (stepName) =>
        `//*[text()='${stepName}']/../../preceding-sibling::div/*`,
    },
    submittedRecordIconStatus: {
      selector: (status: string) =>
        `#submitted-record-outlet .ember-view svg.record-icon-${status}`,
    },
    stepAssginSearchBox: 'input[placeholder="Assign to..."]',
    onHoldCommentButton: {
      selector: (whichOne = 1) =>
        `(//*[contains(@class,"btn-warning") and contains(.,"On Hold")])[${whichOne}]`,
    },
    editStep: '//button[contains(text(),"Edit")]',
    inspectionDateDropdownToggle:
      '//*[@class="btn btn-default btn-block dropdown-toggle"]',
    confirmInspectionDateChngBtn: `//*[@class="btn-group"]//*[@class='btn btn-primary']`,
    selectStep: {
      selector: (stepName: any) =>
        `//*[@class="flex flex-justify-between flex-grow"]//div[contains(.,"${stepName}")]`,
    },
    firstOptionInNameDropdown: {
      selector: (textVal: any, whichElement = 1) =>
        `(//div[@class="atwho-view"]//ul//li/strong[contains(.,"${textVal}")])[${whichElement}]`,
    },
    documentTextElement: {
      selector: (text: string) => `//p[text()='${text}']`,
    },
    cancelRecordStepButton: 'div.panel.panel-default span.text-danger',
    trashIconForFieldName: {
      selector: (fieldLabelFor: string) =>
        `//label[@for="${fieldLabelFor}"]//i[contains(@class, "trash")]`,
    },
    expirationDateMonth: `//select[contains(@class,"pika-select-month")]`,
    expirationDateYear: `//select[contains(@class,"pika-select-year")]`,
  };

  async validateRecordStatus(recordStatus: string) {
    await expect(this.page.locator(this.elements.recordStatus)).toBeVisible();
    await expect(this.page.locator(this.elements.recordStatus)).toContainText(
      recordStatus,
      {timeout: 60 * 1000},
    );
  }

  async validateWorkflowStepStatus(recordStatus: string) {
    await expect(
      this.page.locator(this.elements.workflowStepStatus),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.workflowStepStatus),
    ).toContainText(recordStatus);
  }

  async validatePrintRecordStatus() {
    await expect(
      this.page.locator(this.elements.printRecordStatus),
    ).toBeVisible();
  }

  async validateDeleteOptionVisibility(isVisible = true) {
    await this.clickRecordActionsDropdownButton();
    const deleteReason = this.page.locator(this.elements.deleteReasonInput);

    if (isVisible) {
      await expect(deleteReason).toBeVisible();
    } else {
      await expect(deleteReason).toBeHidden();
    }
  }

  async validateRecordDetailsTabsVisibility() {
    await expect(
      this.page.locator(this.elements.recordDetailsTab),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.recordAttachmentsTab),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.recordActivityTab),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.recordApplicantTab),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.recordLocationTab),
    ).toBeVisible();
  }

  async clickOnApplicantViewProfile() {
    await this.page.click(this.elements.applicantViewProfileButton);
  }

  async clickRecordDetailsTabSection(section: RecordTabs) {
    switch (section) {
      case 'Details':
        await this.page.click(this.elements.recordDetailsTab);
        await expect(
          this.page.locator(this.elements.globalFormsSection),
        ).toBeVisible();
        break;
      case 'Attachments':
        await this.page.click(this.elements.recordAttachmentsTab);
        await expect(
          this.page.locator(this.elements.uploadNewFilesBtn),
        ).toBeVisible();
        break;
      case 'Activity':
        await this.page.click(this.elements.recordActivityTab);
        await expect(
          this.page.locator(this.elements.submittedRecordActivityHeading),
        ).toContainText('Activity Log');
        break;
      case 'Applicant':
        await this.page.click(this.elements.recordApplicantTab);
        await expect(
          this.page.locator(this.elements.submittedApplicantImgIcon),
        ).toBeVisible();
        break;
      case 'Location':
        await this.page.click(this.elements.recordLocationTab);
        await expect(
          this.page.locator(this.elements.submittedLocationImgIcon),
        ).toBeVisible();
        break;
    }
  }

  async refreshThisPage() {
    await this.page.reload();
  }

  async clickRecordStepName(stepName: string) {
    await this.clickElementWithText(
      this.elements.recordStepNames,
      stepName,
      true,
    );
    await this.elementTextVisible(
      this.elements.stepPageHeader,
      stepName,
      false,
    );
  }

  async deleteRecord() {
    await this.clickRecordActionsDropdownButton();
    await this.page.click(this.elements.deleteRecordButton);
    await this.page.click(this.elements.deleteReasonInput);
    await this.page.fill(this.elements.deleteReasonInput, 'Test Cleanup');
    await this.page.click(this.elements.confirmDeleteButton);
    await this.validateRecordStatus(RecordStatus.Archive);
  }

  async clickRecordActionsDropdownButton() {
    await this.page.click(this.elements.recordActionsDropdown);
  }

  async addDueDateToday() {
    await this.page.click(this.elements.dueDateButton);
    await this.page.click(this.elements.dueDateCalendarToday);
  }

  async assignStepToUser(assignedUser: string) {
    if (assignedUser === 'myself') {
      await this.page
        .locator(this.elements.stepAssignmentIcon)
        .scrollIntoViewIfNeeded();
      await this.page.click(this.elements.stepAssignmentIcon);
      await this.page
        .locator(this.elements.stepAssignmentIcon)
        .scrollIntoViewIfNeeded();
      await this.page.click(this.elements.assignToMeButton);
      await expect(
        this.page.locator(this.elements.completeStepButton),
      ).toBeVisible();
    } else {
      throw Error(`${assignedUser} is not currently supported`);
    }
  }

  async clickOnUpdateLocationOwner() {
    await this.page.click(this.elements.dropDownMenuUpdateLocationOwner, {
      delay: 500,
    });
  }

  async clickOnEllipsisForLocation() {
    await this.page.click(this.elements.triDotEllipsis);
  }

  async verifyLocationEditFields() {
    await this.clickOnEllipsisForLocation();
    await expect(
      this.page.locator(this.elements.dropDownMenuUpdateLocationOwner),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.dropdownMenuRemoveLocation),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.dropdownMenuChangeLocation),
    ).toBeVisible();
    await this.clickOnEllipsisForLocation();
  }

  async updatePropertyOwnerInformation(locationPropOwner) {
    await this.clickOnEllipsisForLocation();
    await this.clickOnUpdateLocationOwner();
    this.page.fill(
      this.elements.updateLocationOwnerName,
      locationPropOwner.ownerName,
    );
    this.page.fill(
      this.elements.updateLocationOwnerPhone,
      locationPropOwner.ownerPhone,
    );
    this.page.fill(
      this.elements.updateLocationOwnerEmail,
      locationPropOwner.ownerEmail,
    );
    this.page.fill(
      this.elements.updateLocationOwnerStreetNo,
      locationPropOwner.ownerStreetNo,
    );
    this.page.fill(
      this.elements.updateLocationOwnerStreetName,
      locationPropOwner.ownerStreetName,
    );
    this.page.fill(
      this.elements.updateLocationOwnerUnit,
      locationPropOwner.ownerUnit,
    );
    this.page.fill(
      this.elements.updateLocationOwnerCity,
      locationPropOwner.ownerCity,
    );
    this.page.fill(
      this.elements.updateLocationOwnerState,
      locationPropOwner.ownerState,
    );
    this.page.fill(
      this.elements.updateLocationOwnerPostalCode,
      locationPropOwner.ownerPostalCode,
    );
    await this.page.click(this.elements.saveBtnForFormField);
  }

  async verifyPropertyOwnerInformation(
    locationPropOwnerVerify: propertyOwnerInLocation,
  ) {
    await expect(
      this.page.locator(
        this.elements.locationOwnerInformationPanelElement.selector(
          'Name',
          locationPropOwnerVerify.name,
        ),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.locationOwnerInformationPanelElement.selector(
          'Email Address',
          locationPropOwnerVerify.email,
        ),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.locationOwnerInformationPanelElement.selector(
          'Phone',
          locationPropOwnerVerify.phone,
        ),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.locationOwnerInformationPanelElement.selector(
          'Address',
          locationPropOwnerVerify.address,
        ),
      ),
    ).toBeVisible();
  }

  async assignStepToUserByEmail(assignedUser: string) {
    await expect(
      this.page.locator(this.elements.customApprovalAssignee),
    ).toBeEnabled();
    await this.page.locator(this.elements.customApprovalAssignee).click();
    await this.page.click(this.elements.assignToUser);
    await this.page.fill(this.elements.assignToUser, assignedUser);
    await this.page.click(this.elements.proposedUser);
  }

  async assignApplicantToUserByEmail(assignedUser: string) {
    await this.page.click(this.elements.applicantMenuButton);
    await this.page.click(this.elements.clickHereToAddApplicantButton);
    await this.page.fill(this.elements.applicantInput, assignedUser);
    await this.page.click(this.elements.applicantDropdownElement);
    await expect(
      this.page.locator(this.elements.applicantPicture),
    ).toBeVisible();
  }

  async completeRecordStep() {
    await this.page.click(this.elements.completeStepButton);
    await this.page.click(this.elements.confirmCompleteButton);
    await this.page.reload();
    await this.verifyRecordStepStatusIs(RecordStepStatus.Completed);
  }

  async updateRecordStepStatusTo(recordStepStatus: RecordStepStatusTypes) {
    await this.page.click(this.elements.statusFilter);
    await this.page.click(
      this.elements.statusFilterValue.selector(recordStepStatus),
    );
  }

  async verifyRecordStepStatusIs(
    recordStepStatus: RecordStepStatus,
    stepName?: string,
  ) {
    if (stepName) {
      await expect(
        this.page
          .locator(this.elements.recordStepContainer, {
            has: this.page.locator(
              `${this.elements.recordStepNames} >> text="${stepName}"`,
            ),
          })
          .locator(this.elements.recordStepStatus),
      ).toContainText(recordStepStatus);
    } else {
      // Verify active step status
      await expect(
        this.page.locator('.active').locator(this.elements.recordStepStatus),
      ).toContainText(recordStepStatus);
    }
  }

  async validateFeeWith(feeName: string, feeValue: string) {
    const feeLabel = `//span[text()='${feeName}']`;
    const feeItemValue = `//tr[td[span[text()='${feeName}']]]//span[contains(@class, 'fee-override')]`;

    await expect(this.page.locator(feeLabel)).toBeVisible();
    await expect(this.page.locator(feeItemValue)).toContainText(feeValue);
  }

  async commentStep(commentMessage: string) {
    await this.page.fill(this.elements.commentInputField, commentMessage);
    await this.page.click(this.elements.commentSubmitButton);
    await expect(this.page.locator(this.elements.commentBody)).toBeVisible();
  }

  async typeCommentInStep(commentMessage: string) {
    await this.page.fill(this.elements.commentInputField, commentMessage);
  }

  async validateCommentInStepHasText(commentMessage: string) {
    if (commentMessage.length !== 0) {
      await expect(
        this.page.locator(this.elements.commentInputField),
      ).toContainText(commentMessage);
    } else {
      expect(
        await this.page.locator(this.elements.commentInputField).textContent(),
      ).toEqual('');
    }
  }

  async postCommentInStep() {
    await this.page.click(this.elements.commentSubmitButton);
    await expect(this.page.locator(this.elements.commentBody)).toBeVisible();
  }

  async internalCommentOnStep(commentMessage: string) {
    await this.page
      .locator(this.elements.commentsTabsLink, {hasText: 'Internal Note'})
      .click();
    await this.page.fill(this.elements.commentInputField, commentMessage);
    await this.page.click(this.elements.commentSubmitButton);
    await expect(this.page.locator(this.elements.commentBody)).toBeVisible();
  }

  async typeInternalCommentInStep(commentMessage: string) {
    await this.page
      .locator(this.elements.commentsTabsLink, {hasText: 'Internal Note'})
      .click();
    await this.page.fill(this.elements.commentInputField, commentMessage);
  }

  async validateInternalCommentInStepHasText(commentMessage: string) {
    await this.page
      .locator(this.elements.commentsTabsLink, {hasText: 'Internal Note'})
      .click();

    if (commentMessage.length !== 0) {
      await expect(
        this.page.locator(this.elements.commentInputField),
      ).toContainText(commentMessage);
    } else {
      expect(
        await this.page.locator(this.elements.commentInputField).textContent(),
      ).toEqual('');
    }
  }

  async postInternalCommentInStep() {
    await this.page
      .locator(this.elements.commentsTabsLink, {hasText: 'Internal Note'})
      .click();
    await this.page.click(this.elements.commentSubmitButton);
    await expect(this.page.locator(this.elements.commentBody)).toBeVisible();
  }

  async chooseCcRadioButtonAndClickPay() {
    await this.page.click(this.elements.creditCardPaymentRadioButton);
    await this.page.click(this.elements.payButton);
  }

  async verifyTotalCashRefundRows() {
    /* trying to skip sonar warnings */
    const totalRows = (await this.page.$$(`//td[contains(.,"Cash")]`)).length;
    expect(Number(totalRows)).toEqual(2);
  }

  async completeRefundStepWith(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.Cash:
        await this.page
          .locator(this.elements.refundMethodSelectorDropdown)
          .selectOption(this.elements.cashOption);
        await this.page.click(this.elements.refundSubmitButton);
        break;
      case PaymentMethod.Check:
        await this.page
          .locator(this.elements.refundMethodSelectorDropdown)
          .selectOption(this.elements.checkOption);
        await this.page.click(this.elements.refundSubmitButton);
        break;
      default:
        throw new Error(
          `Did not get completeRefundStepWith methods within default: ${JSON.stringify(
            PaymentMethod,
          )}`,
        );
    }
    await this.page.waitForTimeout(30000); // Todo .. Helpers await + remove hard coded
    await this.verifyRecordStepStatusIs(RecordStepStatus.Due_Now);
  }

  async completePaymentStepWith(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.Cash:
      case PaymentMethod.Check:
        await this.page.click(this.elements.cashOrCheckRadioButton);
        await this.page.click(this.elements.payButton);
        if (paymentMethod === PaymentMethod.Cash) {
          await this.page
            .locator(this.elements.paymentMethodSelectorDropdown)
            .selectOption(this.elements.cashOption);
        }
        await this.fillPayerInfoAndComplete(paymentMethod);
        await this.verifyPaymentInfo(paymentMethod);
        break;
      case PaymentMethod.Credit:
        await this.chooseCcRadioButtonAndClickPay();
        await this.stripePage.fillUserCardInfo(PaymentData);
        break;
      default:
        throw new Error(
          `Did not get completePaymentStepWith methods within default: ${JSON.stringify(
            PaymentMethod,
          )}`,
        );
    }
    await this.verifyRecordStepStatusIs(RecordStepStatus.Paid);
  }

  async completePartialPaymentWith(
    paymentMethod: PaymentMethod,
    payAmount: string,
  ) {
    await this.page.click(this.elements.cashOrCheckRadioButton);
    await this.page.click(this.elements.payButton);
    await this.page.click(this.elements.partialPaymentOptionSelector);
    await this.page.fill(
      this.elements.partialPaymentFirstFeeAmountInput,
      payAmount,
    );
    if (paymentMethod === PaymentMethod.Cash) {
      await this.page
        .locator(this.elements.paymentMethodSelectorDropdown)
        .selectOption(this.elements.cashOption);
    }
    await this.fillPayerInfoAndComplete(paymentMethod);
    await this.verifyPaymentInfo(paymentMethod);
    await this.verifyRecordStepStatusIs(RecordStepStatus.Due_Now);
  }

  async makeIncorrectPayment(failedPaymentType: string) {
    switch (failedPaymentType) {
      case 'disputed':
        await this.stripePage.fillUserCardInfo(DisputedPaymentData);
        break;
      case 'declined':
        await this.stripePage.fillUserCardInfo(DeclinedPaymentData);
        break;
      default:
        throw new Error(
          `The failure type "${failedPaymentType}" is not supported`,
        );
    }
  }

  async fillPayerInfoAndComplete(paymentMethod: PaymentMethod) {
    await this.page.fill(this.elements.payerNameInput, payerNameFake);
    await this.page.fill(this.elements.paymentNoteInput, paymentNoteFake);

    if (paymentMethod === PaymentMethod.Check) {
      await this.page.fill(
        this.elements.checkNumberInput,
        checkNumberFake.toString(),
      );
    } else {
      await expect(
        this.page.locator(this.elements.checkNumberInput),
      ).toBeHidden();
    }
    await this.page.click(this.elements.confirmPayButton);
  }

  async verifyPaymentInfo(paymentMethod: PaymentMethod) {
    await this.elementTextVisible(
      this.elements.paymentTableData,
      paymentNoteFake,
    );
    if (paymentMethod === PaymentMethod.Check) {
      await this.elementTextVisible(
        this.elements.paymentTableData,
        'Check',
        false,
      );
      await this.elementTextVisible(
        this.elements.paymentTableData,
        checkNumberFake.toString(),
        false,
      );
    }
  }

  async addFee() {
    await this.page.click(this.elements.addFeeButton);
    await this.page.click(this.elements.selectFeeToAdd);
    await this.page.click(this.elements.firstFeeFromDropdown);
    await this.page.click(this.elements.submitFeeButton);
    await expect(this.page.locator(this.elements.feeBill)).toBeVisible();
  }

  async addFeeByName(feeName: string) {
    await this.page.click(this.elements.addFeeButton);
    await this.page.selectOption(this.elements.selectFeeToAdd, {
      label: feeName,
    });
    await this.page.click(this.elements.submitFeeButton);
    await expect(this.page.locator(`[title="${feeName}"]`)).toBeVisible();
  }

  async removeFee() {
    const feesCount: number = await this.page
      .locator(this.elements.feeBill)
      .count();
    await this.page.click(this.elements.deleteFeeButton);
    await this.page.click(this.elements.confirmFeeButton);
    expect(this.page.locator(this.elements.feeBill).count()).toEqual(
      feesCount - 1,
    );
  }

  async updateFee(amount: string) {
    await this.page.click(this.elements.feeBill);
    await this.page.fill(this.elements.overrideAmount, amount);
    await this.page.click(this.elements.saveBtnForFormField);
    await expect(this.page.locator(this.elements.feeBill)).toHaveText(
      `$${amount}`,
    );
    await this.elementTextVisible(this.elements.feeBill, `$${amount}`);
  }
  async clickDeleteStepFeeByName(feeName: string) {
    await this.page
      .locator(this.elements.deleteFeeByName.selector(feeName))
      .click();
  }

  async feeIsDeleted(feeName: string) {
    await expect(
      this.page.locator(this.elements.deleteFeeByName.selector(feeName)),
    ).toBeHidden();
  }

  async waivePayment() {
    await this.page.click(this.elements.waivePaymentButton);
    await this.page.click(this.elements.confirmFeeButton);
    await this.verifyRecordStepStatusIs(RecordStepStatus.Waived);
  }

  async refundPayment() {
    await this.proceedToRefund();
    await this.doRefund();
  }

  async proceedToRefund() {
    await this.page.click(this.elements.paymentOptionButton);
    await this.page.click(this.elements.paymentRefundButton);
  }

  async doRefund() {
    await this.page.click(this.elements.refundSubmitButton);
    await expect(
      this.page.locator(this.elements.refundPaymentMark),
    ).toBeVisible();
  }

  async verifyFullRefundAmounts(totalDue: string, isVisible = true) {
    await this.waitForVisibility(
      this.elements.partialRefundDueAmount.selector(totalDue),
      isVisible,
    );
  }

  async verifyFullRefundAmountLineItems(
    totalDue: string,
    paymentMethod: string,
    isVisible = true,
  ) {
    await this.waitForVisibility(
      this.elements.refundAmountLineItem.selector(totalDue),
      isVisible,
    );
    await this.waitForVisibility(
      this.elements.refundAmountPaymentMethodLineItem.selector(paymentMethod),
      isVisible,
    );
  }

  async voidPayment() {
    await this.proceedToVoid();
    await this.doVoid();
  }

  async proceedToVoid() {
    await this.page.click(this.elements.paymentOptionButton);
    await this.page.click(this.elements.paymentVoidButton);
  }

  async doVoid() {
    await this.page.click(this.elements.voidSubmitButton);
    await expect(
      this.page.locator(this.elements.voidPaymentMark),
    ).toBeVisible();
  }

  async addAdhocStep(type: string, stepName = type) {
    let dropdownOptionLocator: string;
    let stepNameInput: string;
    switch (type) {
      case RecordStep[RecordStep.Payment]:
        dropdownOptionLocator = this.elements.paymentDropdownOption;
        stepNameInput = this.elements.newPaymentStepNameInput;
        break;
      case RecordStep[RecordStep.Inspection]:
        dropdownOptionLocator = this.elements.inspectionDropdownOption;
        stepNameInput = this.elements.newInspectionStepNameInput;
        break;
      default:
        dropdownOptionLocator = this.elements.approvalDropdownOption;
        stepNameInput = this.elements.newApprovalStepNameInput;
        break;
    }

    await this.page.click(this.elements.addNewRecordStepButton);
    await this.page.click(dropdownOptionLocator);
    await this.page.fill(stepNameInput, stepName);
    await this.page.click(this.elements.newRecordStepSubmitButton);
    await this.elementTextVisible(this.elements.recordStepHeader, type, false);
  }

  async deleteStep() {
    await this.page.click(this.elements.stepMenuButton);
    await this.page.click(this.elements.deleteStepButton);
    await this.page.click(this.elements.submitDeletionButton);
  }

  async addInspectionType(type: string) {
    await this.page.click(this.elements.addInspectionTypeButton);
    await this.page.fill(this.elements.inspectionInput, type);
    await this.page.click(
      this.elements.inspectionDropdownElement.selector(type),
    );
    await expect(
      this.page.locator(this.elements.removeInspectionButton),
    ).toBeVisible();
  }

  async removeInspection() {
    await this.page.click(this.elements.removeInspectionButton);
    await this.page.click(this.elements.voidSubmitButton);
    await expect(
      this.page.locator(this.elements.removeInspectionButton),
    ).toBeHidden();
  }

  async validateUserCannotModifyStep() {
    await this.page.click(this.elements.dueDateButton);
    await this.page.click(this.elements.stepAssignmentIcon);
    await expect(this.page.locator(this.elements.assignToUser)).toBeHidden();
  }

  async clickRecordRenewal(justVerify = false, isEnabled = true) {
    await this.clickRecordActionsDropdownButton();
    if (justVerify) {
      if (isEnabled) {
        await this.page.isVisible(this.elements.renewRecordButton);
        return;
      } else {
        await this.page.isHidden(this.elements.renewRecordButton);
        return;
      }
    }
    await this.page.click(this.elements.renewRecordButton);
  }

  async startDraftRecordRenewal() {
    await this.clickRecordActionsDropdownButton();
    await this.page.click(this.elements.renewRecordButton);
    await this.page.click(this.elements.confirmPopupButton);
    await expect(
      this.page.locator(this.elements.submitRenewNewRecord),
    ).toBeVisible();
  }

  async beginRenewalRecord() {
    await this.page.dblclick(this.elements.beginRenewNewRecord);
  }

  async submitRenewalRecord(beginRenewal = false) {
    await this.page.click(this.elements.submitRenewNewRecord);
    await expect(this.page.locator(this.elements.renewalLabel)).toContainText(
      'Renewal',
    );
    if (beginRenewal) {
      await this.beginRenewalRecord();
    }
  }

  async addDocumentStep() {
    await this.page.click(this.elements.addNewRecordStepButton);
    await this.page.click(this.elements.documentDropdownOption);
  }

  async addApprovalStep(stepName: string, userEmail: string) {
    await this.page.click(this.elements.addNewRecordStepButton);
    await this.page.click(this.elements.approvalDropdownOption);
    await this.page.fill(this.elements.newApprovalStepNameInput, stepName);
    await this.page.click(this.elements.newApprovalUnassignedButton);
    await this.page.fill(
      this.elements.newApprovalUnassignedSearchUser,
      userEmail,
    );
    await this.page.click(this.elements.newApprovalUnassignedFirstRow);
    await this.page.click(this.elements.newApprovalUnassignedAddUser);
  }

  async addDocumentTemplateWithExpirationDate(
    docType: string,
    waitForPrintDoc = true,
    setExpireDate = true,
    expirationValue = '1',
    expirationOption = '1',
    expirationUnit = '1',
  ) {
    await this.page.click(this.elements.documentTemplateDropdown);
    await this.page
      .locator(this.elements.documentTemplateDropdown)
      .selectOption({label: docType});
    if (setExpireDate) {
      await this.page.click(this.elements.toggleExpireOnDocument);
      await this.page
        .locator(this.elements.documentExpireSelector)
        .selectOption({value: expirationOption});
      await this.page.fill(this.elements.documentExpireInput, expirationValue);
      await this.page
        .locator(this.elements.documentExpireUnitSelector)
        .selectOption({value: expirationUnit});
    }
    await this.page.click(this.elements.addDocumentBtn);
    await this.page
      .locator(this.elements.processingSpinner)
      .waitFor({state: 'detached'});
    if (waitForPrintDoc) {
      await expect(this.page.locator(this.elements.printDoc)).toBeVisible();
    }
  }

  async addDocumentTemplate(
    docType: string,
    waitForPrintDoc = true,
    setExpireDate = false,
    expirationValues = undefined,
  ) {
    await this.page.click(this.elements.documentTemplateDropdown);
    await this.page
      .locator(this.elements.documentTemplateDropdown)
      .selectOption({label: docType});
    if (setExpireDate) {
      await this.page.click(this.elements.toggleExpireOnDocument);
      await this.page
        .locator(this.elements.documentExpireSelector)
        .selectOption({label: expirationValues.expirationOption});
      await this.page.fill(
        this.elements.documentExpireInput,
        expirationValues.expirationValue,
      );
      await this.page
        .locator(this.elements.documentExpireUnitSelector)
        .selectOption({label: expirationValues.expirationUnit});
    }
    await this.page.click(this.elements.addDocumentBtn);
    await this.page
      .locator(this.elements.processingSpinner)
      .waitFor({state: 'detached'});
    if (waitForPrintDoc) {
      await expect(this.page.locator(this.elements.printDoc)).toBeVisible();
    }
  }

  async validateIssuedDocument(uname: string, docLoc: string) {
    const recID: string = await this.page
      .locator(this.elements.recordID)
      .innerText();
    const recName: string = await this.page
      .locator(this.elements.recordName)
      .innerText();
    await this.page.waitForSelector(this.elements.printDoc);

    // await this.page.frame();
    // .frame(0)
    // TODO

    expect(
      await this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.documentRecordID)
        .innerText(),
    ).toEqual(recID);
    expect(
      await this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.documentRecordName)
        .innerText(),
    ).toEqual(recName.split(' ')[0]);
    await expect(
      this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.documentUserName.selector(uname)),
    ).toBeVisible();
    await expect(
      this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.documentLocation.selector(docLoc)),
    ).toBeVisible();
  }

  async addDigitalSignatureOnRecord(eSign: string) {
    await this.page.click(this.elements.digitalSignatureFormFieldCheckbox);
    await this.page.fill(this.elements.digitalSignatureFormInput, eSign);
    await Promise.all([
      // waiting till background api is completed
      await this.page.click(this.elements.digitalSignatureFormSaveButton),
      await this.page.waitForResponse((response) => response.status() === 200),
    ]);
    expect(
      await this.page
        .locator(this.elements.digitalSignatureInnerText)
        .innerText(),
    ).toEqual(eSign);
  }

  async validateIssuedDocumentComplete(isVisible = true) {
    if (isVisible)
      await expect(
        this.page.locator(this.elements.documentCompleteIcon),
      ).toBeVisible();
    else
      await expect(
        this.page.locator(this.elements.documentCompleteIcon),
      ).toBeHidden();
  }

  async validateMergeTagValueOnDocument(text: string) {
    await this.page.waitForSelector(this.elements.printDoc);
    await expect(
      this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.documentTextElement.selector(text)),
    ).toBeVisible();
  }
  async setExpirationDate(day: string) {
    await this.page.click(this.elements.expirationDate);
    await this.page.click(this.elements.calendarDate.selector(day));
    expect(
      this.page.locator(this.elements.expirationDateSelected).innerText(),
    ).toEqual(baseConfig.citTempData.recordExpiryDate);
  }

  async clickColumnName(columnName: string) {
    await this.page.click(this.elements.reportColumnName.selector(columnName));
  }

  async verifyReportsTable(
    recordCountBeforeSort: string,
    recordCountAfterSort: string,
  ) {
    expect(recordCountBeforeSort).toEqual(recordCountAfterSort);
    await expect(this.page.locator(this.elements.reportTable)).toBeVisible();
  }

  async verifyRecordRenewals() {
    await this.page.click(this.elements.renewalLabel);
    await expect(
      this.page.locator(this.elements.renewalsForRecord),
    ).toBeVisible();
    await expect(this.page.locator(this.elements.originalRecord)).toBeVisible();
    await expect(this.page.locator(this.elements.latestRecord)).toBeVisible();
  }

  async validateFFOnIssuedDocument(seFFValue: number, meFFValue: number) {
    expect(
      (
        await this.page
          .frameLocator('iframe')
          .locator(this.elements.formFieldValue)
          .allInnerTexts()
      )
        .join()
        .split(':')[1]
        .trim(),
    ).toEqual(seFFValue.toString());

    expect(
      (
        await this.page
          .frameLocator('iframe')
          .locator(this.elements.calcFormFieldValue)
          .allInnerTexts()
      )
        .join()
        .split(':')[1]
        .trim(),
    ).toEqual((Number(seFFValue) + 100).toString());

    expect(
      (
        await this.page
          .frameLocator('iframe')
          .locator(this.elements.multiEntryFFValue)
          .allInnerTexts()
      ).join(),
    ).toEqual(meFFValue.toString());

    expect(
      (
        await this.page
          .frameLocator('iframe')
          .locator(this.elements.calcMultiEntryFFValue)
          .allInnerTexts()
      ).join(),
    ).toEqual((Number(meFFValue) + 200).toString());
  }

  async addNewAttachment(fileType: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    await this.page.setInputFiles(this.elements.fileUploadBtn, filePath);
    await this.page.click(this.elements.confirmFileUploadBtn);
    await expect(
      this.page.locator(this.elements.attachmentFileSelected),
    ).toBeVisible();
  }

  async verifyAttachmentAvailable(fileType: string) {
    await this.page.click(this.elements.attachmentTab);
    if (fileType === 'pdf' || fileType === 'csv') {
      await expect(
        this.page.locator(this.elements.uploadedFileBadge),
      ).toContainText(fileType);
    } else if (fileType === 'png') {
      await expect(
        this.page.locator(this.elements.thumbnailImage),
      ).toBeVisible();
    }
    await expect(
      this.page.locator(this.elements.noAttachmentSection),
    ).toBeHidden();
  }

  async clickAttachmentByName(attachmentName: string) {
    await this.page
      .locator(this.elements.attachmentName, {hasText: attachmentName})
      .click();
  }

  async attachmentInfoContainsText(text: string) {
    await expect(this.page.locator(this.elements.attachmentInfo)).toContainText(
      text,
    );
  }

  async verifyAttachmentVersionOrder(selector: string, sanitizeDay = true) {
    await expect(this.page.locator(selector)).toBeVisible();
    const dates: string[] = await this.getAttachmentDates(
      selector,
      sanitizeDay,
    );

    let ordered = true;
    let attachmentDate = new Date(dates[0]);
    dates.forEach((day) => {
      const date = new Date(day);
      if (attachmentDate >= date) {
        attachmentDate = date;
      } else {
        ordered = false;
        attachmentDate = date;
      }
    });
    expect(ordered, 'Confirming attachment dates are ordered').toBeTruthy();
  }

  async getAttachmentDates(selector: string, sanitizeDay: boolean) {
    const dates: any = [];
    const dateElements = await this.page.locator(selector).allInnerTexts();
    dateElements.forEach((dateElem) => {
      let formattedDay = '';
      if (sanitizeDay) {
        //For EA
        formattedDay = dateElem.split(',')[0].replace('th', '');
      } else {
        //For STR
        formattedDay = dateElem.split('at')[0].replace(',', '');
      }
      dates.push(formattedDay);
    });
    return dates;
  }

  async downloadAttachment(fileType: string) {
    if (
      fileType == 'docx' ||
      (fileType == 'pdf' && ['true', undefined].includes(process.env.HEADLESS)) //pdf downloads instead of preview in chrome headless mode
    ) {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        await this.page.click(this.elements.downloadAttachmentLink),
      ]);
      await download.path();
      const path = download.suggestedFilename();
      await download.saveAs(`./downloads/${path}`);
      expect(download.suggestedFilename()).toContain(fileType);
    } else {
      const [attachmentPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        await this.page.click(this.elements.downloadAttachmentLink),
      ]);
      await this.verifyNewTabWithAttachmentOpened(attachmentPage);
    }
  }

  async downloadFormFieldFile(fileType: string) {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      await this.page.click(this.elements.uploadedFormFieldFileBadge),
    ]);
    await download.path();
    const path = download.suggestedFilename();
    await download.saveAs(`./downloads/${path}`);
    expect(download.suggestedFilename()).toContain(fileType);
  }

  async verifyNewTabWithAttachmentOpened(attachmentPage: Page) {
    expect(attachmentPage.url()).toContain(
      'uploadedfiles.blob.core.windows.net',
    );
    if (!attachmentPage.url().includes('.pdf')) {
      //not working for pdf files
      await expect(
        attachmentPage.locator('[src*="uploadedfiles.blob.core.windows.net"]'),
      ).toBeVisible();
    }
    await attachmentPage.close();
  }

  async uploadNewFile(fileType: string) {
    await this.page.click(this.elements.attachmentTab);
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;

    await this.page.setInputFiles(this.elements.uploadNewFileBtn, filePath);
    await this.page.click(this.elements.confirmFileUploadBtn);
    await this.verifyUploadedFiles(fileType);
  }

  async deleteAttachment(fileType: string) {
    await this.page.click(this.elements.triDotEllipsisAttachment);
    await this.page.click(this.elements.dropdownMenulink.selector('Delete'));
    await this.page.click(this.elements.dialogPopupButton.selector('Delete'));
    await this.verifyUploadedFiles(fileType, false);
  }

  async verifyUploadedFiles(fileType: string, verifyIfPresent = true) {
    if (verifyIfPresent) {
      if (fileType === 'pdf' || fileType === 'csv' || fileType === 'docx') {
        await expect(
          this.page.locator(this.elements.uploadedFileBadge, {
            hasText: fileType,
          }),
        ).toBeVisible();
      } else if (fileType === 'png' || fileType === 'jpeg') {
        await expect(
          this.page.locator(this.elements.thumbnailImage),
        ).toBeVisible();
      }
    } else {
      if (fileType === 'pdf' || fileType === 'csv' || fileType === 'docx') {
        await expect(
          this.page.locator(this.elements.uploadedFileBadge, {
            hasText: fileType,
          }),
        ).toBeHidden();
      } else if (fileType === 'png' || fileType === 'jpeg') {
        await expect(
          this.page.locator(this.elements.thumbnailImage),
        ).toBeHidden();
      }
    }
  }

  async verifyConditionalFormFieldOnDocument(
    formfieldValue: any,
    isVisible = true,
  ) {
    expect(
      await this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.formFieldMergeTag, {
          hasText: formfieldValue,
        })
        .isVisible(),
    ).toBe(isVisible);
  }

  async uploadNewFileVersion() {
    await this.page.click(this.elements.attachmentName);
    await expect(
      this.page.locator(this.elements.downloadAttachmentLink),
    ).toBeVisible();
    expect(this.page.locator(this.elements.uploadFileVersion).count()).toEqual(
      1,
    );
    const filePath = `${resolve(process.cwd())}/src/resources/plc/sample.png`;

    await this.page.setInputFiles(this.elements.uploadNewFileBtn, filePath);
    await expect(
      this.page.locator(this.elements.fileDownloadBtn),
    ).toBeVisible();
    expect(this.page.locator(this.elements.uploadFileVersion).count()).toEqual(
      2,
    );
  }

  async uploadPredefinedAttachment(fileType: string, attachmentName: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/plc/sample.${fileType}`;
    await this.page.setInputFiles(
      this.elements.uploadPredefinedAttachment.selector(attachmentName),
      filePath,
    );
    await expect(
      this.page.locator(this.elements.attachedFile.selector(attachmentName)),
    ).toBeVisible();
  }

  async checkTwoAttachmentsOrder(attName1: string, attName2: string) {
    await this.page.click(this.elements.attachmentTab);
    await expect(
      this.page.locator(this.elements.noAttachmentSection),
    ).toBeHidden();
    const regex = new RegExp(
      `Attachments\n*${attName1}\n*Uploaded by api admin on.*m\n*pdf\n*${attName2}`,
    );
    expect(
      this.page.locator(this.elements.attachmentFolder).textContent(),
    ).toMatch(regex);
  }

  async verifyAttachmentOrder(attachmentName1: string) {
    await this.page.click(this.elements.attachmentTab);
    if (attachmentName1 !== undefined) {
      await expect(
        this.page.locator(this.elements.noAttachmentSection),
      ).toBeHidden();
      await expect(
        this.page.locator(this.elements.attachmentOrder),
      ).toContainText(attachmentName1);
    } else {
      await expect(
        this.page.locator(this.elements.noAttachmentSection),
      ).toBeVisible();
    }
  }

  async verifyRecordStepName(stepName: string) {
    await expect(this.page.locator(this.elements.stepPageHeader)).toContainText(
      stepName,
    );
  }

  async reissueDocument(isTimeOut = false) {
    if (isTimeOut) await this.page.waitForTimeout(15000); //Added wait time to complete all API calls
    await this.page.click(this.elements.reissueActionDropdown);
    await this.page.click(this.elements.reissueDocumentLink);
    await this.page
      .locator(this.elements.confirmReissueBtn, {hasText: 'Reissue'})
      .click();
  }

  async verifyFileUploadImageThumbnail(isVisible = true) {
    expect(
      await this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.fileUploadImageThumbnail)
        .isVisible(),
    ).toBe(isVisible);
  }

  async verifyFileUploadNonImageThumbnail(
    documentType: string,
    isVisible = true,
  ) {
    expect(
      await this.page
        .frameLocator(this.elements.printDoc)
        .locator(this.elements.fileUploadNonImageThumbnail, {
          hasText: documentType,
        })
        .isVisible(),
    ).toBe(isVisible);
  }

  async verifyDocumentVersionIssuedText(text: string) {
    await expect(
      this.page.locator(
        this.elements.versionHistoryPanelTableCellWithText.selector(text),
      ),
    ).toBeVisible();
  }

  async verifyDocumentVisibility(status = 'reissued') {
    if (status === 'reissued') {
      await this.page.reload();
      await expect(
        this.page.locator(this.elements.versionHistoryPanel),
      ).toBeVisible();
      await expect(
        this.page.locator(this.elements.reissuedLabel),
      ).toBeVisible();
    }
    await expect(this.page.locator(this.elements.printDoc)).toBeVisible();
  }

  async validatePrefixedRecordName(
    recordName: string = baseConfig.citTempData.recordName,
  ) {
    expect(await this.page.locator(this.elements.recordID).innerText()).toEqual(
      recordName,
    );
  }

  async verifySignatureOnDocument(esignature: string, isVisible = true) {
    await expect
      .poll(
        async (): Promise<boolean> => {
          return (
            (await this.page
              .frameLocator(this.elements.printDoc)
              .locator(this.elements.digitalSignature, {
                hasText: esignature,
              })
              .isVisible()) == isVisible
          );
        },
        {
          message:
            'Verifying that signature is expected to be visible ' + isVisible,
          timeout: 20000,
        },
      )
      .toBe(true);
  }

  async verifyAttachmentOnDocument(formSection: string) {
    let attachmentElement;
    let thumbnailElement;
    if (formSection === 'single-entry') {
      attachmentElement = this.elements.documentAttachment;
      thumbnailElement = this.elements.thumbnailImageOnDocument;
    } else if (formSection === 'multi-entry') {
      attachmentElement = this.elements.multiEntryDocumentAttachment;
      thumbnailElement = this.elements.multiEntryThumbnailImageOnDoc;
    }
    await expect(
      this.page.frameLocator('iframe').locator(attachmentElement),
    ).toBeVisible();
    await expect(
      this.page.frameLocator('iframe').locator(thumbnailElement),
    ).toBeVisible();
  }

  async verifyValuesOnDocument(dataTableItems: any) {
    const docItems = await dataTableItems.raw();
    for (const element of docItems) {
      const docTag = await element;
      await expect(
        this.page
          .frameLocator('iframe')
          .locator(this.elements.feeItem.selector(docTag[0], docTag[1])),
      ).toBeVisible();
    }
  }

  async addDueDateForWorkflowSteps(workFlowStep: string, days: number) {
    console.debug(workFlowStep);
    const selectDate = new Date();
    selectDate.setDate(selectDate.getDate() + Number(days));
    const aMonth: string = selectDate.toLocaleString('default', {
      month: 'long',
    });
    const months = {
      January: '0',
      February: '1',
      March: '2',
      April: '3',
      May: '4',
      June: '5',
      July: '6',
      August: '7',
      September: '8',
      October: '9',
      November: '10',
      December: '11',
    };
    const aDate: string = selectDate.getDate().toString();
    await this.clickRecordStepName(workFlowStep);
    await this.addAssigneeForWorkflowSteps(workFlowStep);
    await this.page.click(this.elements.dueDate);
    await this.page
      .locator(this.elements.monthSelectorSelect)
      .selectOption({value: months[aMonth]});
    // ________________ done
    await this.page.click(this.elements.dateSelector.selector(aDate));
    await expect(
      this.page.locator(this.elements.dueDateText),
    ).not.toContainText('None');
    expect(
      (
        await this.page
          .locator(this.elements.dueDateTextInTimeline.selector(workFlowStep))
          .textContent()
      ).trim(),
    ).toEqual(
      (await this.page.locator(this.elements.dueDateText).textContent()).trim(),
    );
  }

  async addAssigneeForWorkflowSteps(workFlowStep: string, email?: string) {
    await this.clickRecordStepName(workFlowStep);
    if (
      workFlowStep === 'Approval' ||
      workFlowStep === 'Inspection' ||
      workFlowStep === 'Adhoc-Inspection'
    ) {
      await this.page.click(this.elements.assignee);
      if (email) {
        await this.page.fill(this.elements.assigneeEmailInput, email);
        await this.page.click(
          this.elements.assigneeEmailSearchResultRow.selector(email),
        );
        await this.waitForVisibility(this.elements.assigneeAdded);
      } else {
        await this.page.click(this.elements.assigneeToMeButton);
      }
      await this.waitForVisibility(this.elements.assigneeAdded);
    }
  }

  async clickPrintRecordButton() {
    await this.page.click(this.elements.recordActionsDropdown);
    await this.page.click(this.elements.printRecordButton);
    const recordName = await this.page
      .locator(this.elements.recordName)
      .innerText();
    printRecordName = recordName.split(' ');
  }

  async validatePrintRecordData() {
    const [recordPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await this.page.click(this.elements.printPopUpButton),
    ]);
    await recordPage.waitForLoadState();
    await recordPage.bringToFront();
    console.log(await recordPage.title());
    await expect(
      recordPage.locator(this.elements.printRecordStatus),
    ).toBeVisible();
    await expect(
      recordPage.locator(this.elements.printRecordTitle),
    ).toBeVisible();
    await expect(
      recordPage.locator(this.elements.printRecordTitle),
    ).toContainText(printRecordName[0]);
  }

  async verifySettingSelectedAndPrint(settingName: string) {
    let settingElementId: string;
    switch (settingName) {
      case 'Show Timeline':
        settingElementId = this.elements.showTimelineCheckbox;
        break;
      case 'Show Activity':
        settingElementId = this.elements.showActivityCheckbox;
        break;
      case 'Show Applicant':
        settingElementId = this.elements.showApplicantCheckbox;
        break;
      case 'Show Location':
        settingElementId = this.elements.showLocationCheckbox;
        break;
      case 'Show Empty Fields':
        settingElementId = this.elements.showEmptyFieldsCheckbox;
        break;
      case 'Show Attachments':
        settingElementId = this.elements.showAttachmentsCheckbox;
        break;
      case 'Show Internal Fields':
        settingElementId = this.elements.showInternalFieldsCheckbox;
        break;
      default:
        throw new Error(`Setting name "${settingName}" is not a valid option`);
    }

    await expect(this.page.locator(settingElementId)).toBeVisible();
    await this.page.locator('.btn-primary', {hasText: 'Print'}).click();
  }

  async verifyTimelineVisible(
    stepName: string,
    userName: string,
    status: string,
  ) {
    await expect(
      this.page.locator(this.elements.timelinePreviewTable),
    ).toBeVisible();
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );

    await expect(this.page.locator(this.elements.labelCell)).toContainText(
      stepName,
    );
    await expect(this.page.locator(this.elements.statusCell)).toContainText(
      status,
    );

    if (stepName !== 'API Integration') {
      await expect(this.page.locator(this.elements.statusCell)).toContainText(
        'Active',
      );
      await expect(this.page.locator(this.elements.assigneeCell)).toContainText(
        userName,
      );
      await expect(
        this.page.locator(this.elements.dueDateCell),
      ).not.toContainText('-');
    }

    // // Switching back to the initial browser tab
    // await (browser as any).switchWindowByIndex(0).pause(1000);

    //TODO refactor
  }

  async proceedToRecordByUrl() {
    await this.proceedToRecordById(baseConfig.citTempData.recordId);
  }

  async verifyRecordIdPageNavigated() {
    await expect(
      this.page.locator(this.elements.globalSearchBar),
    ).toBeVisible();
    await expect(this.page.locator(this.elements.recordID)).toBeVisible({
      timeout: 60 * 1000,
    });
  }

  async navigateById(recordId = baseConfig.citTempData.recordId) {
    await this.page.goto(
      `${baseConfig.employeeAppUrl}/#/explore/records/${recordId}/`,
    );
  }

  async proceedToRecordById(recordId: string) {
    await this.navigateById(recordId);
    await this.verifyRecordIdPageNavigated();
  }

  async proceedToRecordByNumber(recordNumber: string) {
    await this.elementVisible(this.elements.globalSearchBar);
    const navPage = new NavigationBarPage(this.page);
    await navPage.performSearchContaining(recordNumber, recordNumber);
    await this.page.click(this.elements.searchResults);
    this.elementVisible(this.elements.recordID);
  }

  async changeDueDate(dayNumber: string) {
    await this.page.click(this.elements.dueDateIcon);
    await this.page.click(this.elements.calendarDay.selector(dayNumber));
    await expect(
      this.page.locator(this.elements.dueDateText),
    ).not.toContainText('None');
  }

  async verifyRecordDetails(paramValues: any) {
    const paramsTable = paramValues.rawTable;
    for (const element of paramsTable) {
      const param = element;
      await expect(
        this.page.locator(
          this.elements.formFieldDetails.selector(param[0], param[1]),
        ),
      ).toBeVisible();
    }
  }

  async changeRecordWorkflowStepStatus(
    workflowStep: string,
    fromStatus: string,
    toStatus: RecordStepStatusTypes,
  ) {
    await this.clickRecordStepName(workflowStep);
    console.debug('current status is changed From', fromStatus, 'To', toStatus);
    await this.updateRecordStepStatusTo(toStatus);
    await this.page.waitForSelector(
      this.elements.workflowStepStatus,
      this.isVisible,
    );

    if (toStatus !== 'Active') {
      switch (toStatus) {
        case 'Skip':
          expect(
            (
              await this.page
                .locator(this.elements.changedStepStatus.selector('Skipped'))
                .textContent()
            ).trim(),
          ).toEqual('Skipped');
          break;
        case 'Reject':
          expect(
            (
              await this.page
                .locator(this.elements.changedStepStatus.selector('Rejected'))
                .textContent()
            ).trim(),
          ).toEqual('Rejected');
          break;
        default:
          expect(
            (
              await this.page
                .locator(this.elements.changedStepStatus.selector(toStatus))
                .textContent()
            ).trim(),
          ).toEqual(toStatus.trim());
      }
    }
  }

  async verifySegmentInformation(segmentInfo: {
    segmentStart: string;
    segmentEnd: string;
    segmentLabel: string;
    segmentLength: string;
  }) {
    await this.page.click(this.elements.recordLocationTab);
    await expect(this.page.locator(this.elements.segmentMap)).toBeVisible();

    expect(
      await this.page
        .locator(this.elements.segmentInformationLabel)
        .innerText(),
    ).toContain('Segment Information');
    expect(
      await this.page
        .locator(this.elements.segmentLocationInfo.selector('Starting Address'))
        .innerText(),
    ).toContain(segmentInfo.segmentStart);
    expect(
      await this.page
        .locator(this.elements.segmentLocationInfo.selector('Ending Address'))
        .innerText(),
    ).toContain(segmentInfo.segmentEnd);
    expect(
      await this.page.locator(this.elements.primaryLocation).innerText(),
    ).toContain(segmentInfo.segmentLabel);
    expect(
      await this.page
        .locator(this.elements.segmentLocationInfo.selector('Segment Length'))
        .innerText(),
    ).toContain(segmentInfo.segmentLength);
  }

  async validateLocationDetailsOnPrint(segmentLocationName: string) {
    //// Get page after a specific action (e.g. clicking a link)
    const [printPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.click(this.elements.printBtn), // Opens a new tab
    ]);
    await printPage.waitForLoadState();
    await printPage.keyboard.press('Escape');
    await expect(printPage.locator(this.elements.printLocation)).toContainText(
      segmentLocationName,
    );
  }

  async validateInactiveAlert() {
    expect(
      this.page.locator(this.elements.inactivePopUpMessage).textContent(),
    ).toEqual('Status change is not allowed. All other steps are inactive.');
  }

  async dotMapsEndpointRequestReponse(dotMapsEndpoint: string) {
    expect(
      this.page.locator(this.elements.endpointRequestResponse).textContent(),
    ).toContain(dotMapsEndpoint);
  }

  async retryFailedRequest(retryCount: number) {
    await this.page.waitForTimeout(20000);
    expect(
      this.page.locator(this.elements.responseMessage).textContent(),
    ).toContain('Failure');

    for (let i = 0; i < retryCount; i++) {
      await this.page.waitForSelector(
        this.elements.endpointRequestResponse,
        this.isVisible,
      );
      await this.page.click(this.elements.retryBtn);
    }
  }

  async validateRecordTypeName(recordTypeName: string) {
    await expect(this.page.locator(this.elements.recordName)).toContainText(
      recordTypeName,
    );
  }

  async clearFormFieldInMultiEntrySection(
    sectionName: string,
    formFieldLabel: string,
  ) {
    const editFormField = this.elements.formFieldEditLink.selector(
      sectionName,
      formFieldLabel,
    );
    const inputFormField = this.elements.formFieldInputBox.selector(
      sectionName,
      formFieldLabel,
    );
    const saveBtn = this.elements.saveBtnForFormField;
    await this.page.click(editFormField);
    await this.page.fill(inputFormField, '');
    await this.page.click(saveBtn);
    await this.page.waitForSelector(saveBtn, this.isNotVisible);
  }

  async validateValueSavedInMultiEntryFormField(
    sectionName: string,
    formFieldLabel: string,
    expectedValue: string,
  ) {
    const editFormField = this.elements.formFieldEditLink.selector(
      sectionName,
      formFieldLabel,
    );
    await expect(this.page.locator(editFormField)).toContainText(
      expectedValue,
      {useInnerText: true},
    );
  }

  async validatePaymentTransactionStatus(status: string) {
    await this.page.waitForSelector(
      this.elements.paymentTransactionStatusTable.selector(status),
      {
        state: 'visible',
        timeout: 90000,
      },
    );
  }

  async validateUploadedFileAction(sectionName: string, canEdit: boolean) {
    canEdit
      ? await expect(
          this.page.locator(
            this.elements.uploadedFileAction.selector(sectionName),
          ),
        ).toContainText('Clear file')
      : await expect(
          this.page.locator(
            this.elements.uploadedFileAction.selector(sectionName),
          ),
        ).toBeHidden();
  }

  async validateRecordHasFile(fileName: string) {
    await expect(
      this.page.locator(this.elements.uploadedFileName.selector(fileName)),
    ).toBeVisible();
  }

  async clickViewLocationButton() {
    await this.page.click(this.elements.submittedLocationImgIcon);
  }

  async printAndValidateReceipt(dataTable: any) {
    await this.page.click(this.elements.paymentOptionButton);
    await this.page.click(this.elements.printReceiptButton);
    const actualText = await this.getAllElementsText(
      this.elements.receiptBodyTable,
    );

    const toBeValidated: any = {};
    for (const item of dataTable.rawTable) {
      switch (item[0].toLowerCase()) {
        case 'fee name':
          toBeValidated.feeName = item[1];
          break;
        case 'fee amount':
          toBeValidated.feeAmount = item[1];
          break;
        case 'status':
          toBeValidated.paymentStatus = item[1];
          break;
        case 'total amount':
          toBeValidated.totalAmount = item[1];
          break;
        case 'record type': {
          const matchedRecord = actualText.filter((r) =>
            r.match(`${item[1]} \\#${baseConfig.citTempData.recordName}`),
          );
          expect(
            matchedRecord.length,
            'Verifying the Record Type is present',
          ).toEqual(1);
          break;
        }
        case 'payment type': {
          await this.page.waitForSelector(
            this.elements.receiptAdditionalHeader,
            this.isVisible,
          );
          const matchedPaymentType = (
            await this.page
              .locator(this.elements.receiptTypeHeader)
              .textContent()
          ).match(`via ${item[1]}`);
          expect(
            matchedPaymentType,
            'Verifying the Payment type',
          ).not.toBeNull();
          break;
        }
        default:
          break;
      }
    }

    // Verifying the Fee amount
    const matchedFeePayment = actualText.filter((r) =>
      r.match(`${toBeValidated.feeName} \\(?\\$${toBeValidated.feeAmount}\\)?`),
    );
    expect(
      matchedFeePayment.length,
      'Verifying the Fee name and amount',
    ).toEqual(1);

    // Verifying the total Amount with Status
    const matchedTotalAmount = actualText.filter((r) =>
      r.match(
        `Total ${toBeValidated.paymentStatus}(ed)? \\$\\-?${toBeValidated.totalAmount}`,
      ),
    );
    expect(matchedTotalAmount.length, 'Verifying Total paid amount').toEqual(1);

    const matchedTotalPaid = (
      await this.page.locator(this.elements.receiptMainHeader).textContent()
    ).match(
      `\\$\\-?${toBeValidated.totalAmount} ${toBeValidated.paymentStatus}`,
    );
    expect(
      matchedTotalPaid,
      'Verifying Total amount and payment status',
    ).not.toBeNull();

    // Find Date row and verify the date is today
    const dateStringRegexp = new RegExp(
      `\\w+ \\d{1,2}\\, ${new Date().getFullYear()}`,
    );
    const matchedDate = actualText.filter((r) => r.match(dateStringRegexp));
    expect(matchedDate.length, 'Verifying the Payment date present').toEqual(1);

    expect(
      new Date(matchedDate[0].match(dateStringRegexp)[0]).toLocaleDateString(),
      'Verifying the payment date is today',
    ) // Parsing string to Date
      .toEqual(new Date().toLocaleDateString()); // Get today's date
    // Switching back to the initial browser tab
    // await (browser as any).switchWindowByIndex(0).pause(1000);

    //TODO Refactor
  }

  async verifyPaymentFailedPopup(isDisplayed: boolean, message?: string) {
    if (isDisplayed) {
      await this.page.waitForSelector(
        this.elements.paymentFailedPopup,
        this.isVisible,
      );
      await expect(
        this.page.locator(this.elements.paymentFailedPopupMessage),
      ).toContainText(message);
      // Close the popup
      await this.page.click(this.elements.confirmPopupButton);
    } else {
      await this.page.waitForSelector(
        this.elements.processingSpinner,
        this.isNotVisible,
      );
      await expect(
        this.page.locator(this.elements.paymentFailedPopup),
      ).toBeHidden();
    }
  }

  async clickOnAddLocation() {
    await this.page.click(this.elements.recordLocationTab);
    await this.page.click(this.elements.addLocationLink);
  }

  async addPrimaryLocation() {
    await this.page.click(this.elements.recordLocationTab);
    await this.page.click(this.elements.addPrimaryLocationButton);
  }

  async addAdditionalLocation() {
    await this.page.waitForTimeout(
      1500,
    ); /* Await expects are also very very flaky .. runs too fast and in same page so does not work consistently*/
    await this.page.waitForSelector(this.elements.addAdditionalLocationButton);
    await this.page
      .locator(this.elements.addAdditionalLocationButton)
      .scrollIntoViewIfNeeded({timeout: 3000});
    await this.page.click(this.elements.addAdditionalLocationButton, {
      position: {x: 1, y: 1},
    });
    await this.page.waitForTimeout(
      1500,
    ); /* Await expects are also very very flaky .. runs too fast and in same page so does not work consistently*/
  }

  async validateAdditionalLocation(additionalLoactionCount = 99) {
    const count = await this.page
      .locator(this.elements.addAdditionalLocationList)
      .count();
    if (count === 99) {
      const toolTipMessage =
        "You have reached the maximum of 99 additional locations. If you need more locations you'll need to create another record.";
      await this.page.waitForSelector(
        this.elements.addAdditionalLocationDisableButton,
      );
      await this.page
        .locator(this.elements.addAdditionalLocationDisableButton)
        .scrollIntoViewIfNeeded({timeout: 3000});
      expect(
        await this.page
          .locator(this.elements.addAdditionalLocationDisableButton)
          .getAttribute('data-hint'),
      ).toContain(toolTipMessage);
      await expect(
        this.page.locator(this.elements.addAdditionalLocationButton),
      ).toBeHidden();
    }
    expect(count).toEqual(additionalLoactionCount);
  }

  async validateViewLocationBtnDisplay() {
    await expect(
      this.page.locator(this.elements.viewLocationBtn),
    ).toBeVisible();
  }

  async addToProject(searchName: string, projectName: string) {
    await this.page.click(this.elements.addToProjectButton);
    await this.page.fill(this.elements.addToProjectSearchBox, searchName);
    await this.clickElementWithText(
      this.elements.addToProjectSearchBoxResult,
      projectName,
    );
  }

  async validateProjectLabelOnTopOfRecordPage() {
    await expect(
      this.page.locator(
        this.elements.projectLabelOntop.selector(
          baseConfig.citTempData.projectId,
        ),
      ),
    ).toBeVisible();
  }

  async clickOnProjectLabelOnTop() {
    await this.page.click(
      this.elements.projectLabelOntop.selector(
        baseConfig.citTempData.projectId,
      ),
    );
  }

  async deleteProjectFromRecord() {
    await this.page.reload();
    await this.page.click(this.elements.projectLabelOntopEllipsis);
    await this.page.click(this.elements.removeProject);
  }

  async verifyNoProjectLabelOnTop() {
    await expect(
      this.page.locator(
        this.elements.projectLabelOntop.selector(
          baseConfig.citTempData.projectId,
        ),
      ),
    ).toHaveCount(0);
  }

  async validateRecordNotSubmitted() {
    await expect(
      this.page.locator(this.elements.recordDetailsTab),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.submitRecordButton),
    ).toBeVisible();
  }

  async editAndSaveFormField(
    sectionName: string,
    formFieldLabel: string,
    value: string,
  ) {
    const editFormField = this.elements.formFieldEditLink.selector(
      sectionName,
      formFieldLabel,
    );
    const inputFormField = this.elements.formFieldInputBox.selector(
      sectionName,
      formFieldLabel,
    );
    await this.page.click(editFormField);
    await this.page.fill(inputFormField, '');
    await this.page.type(inputFormField, value, {delay: 1000});
    await this.page.click(this.elements.saveBtnForFormField);
    await this.waitForVisibility(this.elements.saveBtnForFormField, false);
  }

  async validateFormFieldValueOnRecord(
    formFieldLabel: string,
    sectionName: string,
    input: any,
    expectedStatus = true,
  ) {
    const formFieldEle = this.elements.formFieldvalueOnRecord.selector(
      sectionName,
      formFieldLabel,
      input,
    );
    await this.waitForVisibility(formFieldEle, expectedStatus);
  }

  async validateFormFieldFireEyeOnRecord(
    formFieldLabel: string,
    sectionName: string,
    expectedStatus = false,
  ) {
    const formFieldEle = this.elements.formFieldEyeBallOnRecord.selector(
      sectionName,
      formFieldLabel,
    );
    await this.waitForVisibility(formFieldEle, expectedStatus);
  }

  async validateFormFieldIsBlank(formFieldLabel: string, sectionName: string) {
    const formFieldEle = this.elements.formFieldEditLink.selector(
      sectionName,
      formFieldLabel,
    );
    await expect(this.page.locator(formFieldEle)).toHaveAttribute(
      'innerText',
      '',
    );
  }

  async clickOnRequestChange(): Promise<RequestChanges> {
    await this.page.click(this.elements.requestChanges);
    return new RequestChanges(this.page);
  }

  async verifyRequestChangesButtonDisplayed(expectedStatus = true) {
    await this.waitForVisibility(this.elements.requestChanges, expectedStatus);
  }

  async clickCustomStepByName(name: string) {
    await this.page
      .locator(this.elements.customStepSection, {hasText: name})
      .click();
  }

  async verifyCustomStepVisibility(name: string, isVisible = true) {
    if (isVisible) {
      await expect(
        this.page.locator(this.elements.customStepSection, {hasText: name}),
      ).toBeVisible();
    } else {
      await expect(
        this.page.locator(this.elements.customStepSection, {hasText: name}),
      ).toBeHidden();
    }
  }

  async assignCustomApprovalOnMe() {
    await this.page.click(this.elements.customApprovalAssignee);
    await this.page.click(this.elements.assignOnMeButton);
  }

  async addCommentOnRecordStep(text: string) {
    await this.page.fill(this.elements.commentTextInput, text);
    await this.page.click(this.elements.confirmComment);
  }

  async addMentionCommentOnRecordStep(userName: string) {
    await this.page.fill(this.elements.commentTextInput, '@' + userName);
    await this.page.click(this.elements.commentTextInput);
    await this.page
      .locator(this.elements.mentionedEmployeeBox, {hasText: userName})
      .click();
    await this.page.click(this.elements.confirmComment);
  }

  async getCurrentRecordNumber() {
    return this.page.locator(this.elements.recordID).innerText();
  }

  async unassignUserFromStep(ifPresent: 'optional' | true = true) {
    try {
      await this.page.click(this.elements.unassignUserIcon, {timeout: 5000});
    } catch (e) {
      if (ifPresent === 'optional') {
        console.debug('Not throwing error, ');
      } else {
        throw new Error(e);
      }
    }
  }

  async uploadFileToAttachment(attachment: string, fileType: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    await this.page.click(this.elements.attachmentSection.selector(attachment));
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.page.click(this.elements.uploadNewVersionBtn),
    ]);
    await fileChooser.setFiles(filePath);
    await this.waitForVisibility(this.elements.thumbnailImage, true);
  }

  async validateActivityFeed(key: string, text: string, isVisible = true) {
    isVisible
      ? expect(
          (
            await this.page
              .locator(this.elements.activityFeedLabel.selector(key))
              .innerText()
          ).replace(/[^a-zA-Z0-9]/g, ''),
        ).toEqual(text.replace(/[^a-zA-Z0-9]/g, ''))
      : await expect(
          this.page.locator(this.elements.activityFeedLabel.selector(key)),
        ).toBeHidden();
  }

  async removeLocation() {
    await this.page.click(this.elements.locationDropdownBtn);
    await this.page.click(this.elements.dropdownMenuRemoveLocation);
    await this.page.click(this.elements.removeLocationBtn);
  }

  async proceedToPartialRefund() {
    await this.proceedToRefund();
    await this.page.click(this.elements.partialPaymentRefundButton);
  }

  async doPartialRefund(amount: string) {
    await this.page.fill(this.elements.partialPaymentRefundAmount, amount);
    await this.page.click(this.elements.refundSubmitButton);
    await expect(
      this.page.locator(this.elements.refundPaymentMark),
    ).toBeVisible();
  }

  async verifyPartialRefundAmounts(totalPaid: string, totalDue: string) {
    await expect(
      this.page.locator(
        this.elements.partialRefundPaidAmount.selector(totalPaid),
      ),
    ).toBeVisible();
    await expect(
      this.page.locator(
        this.elements.partialRefundDueAmount.selector(totalDue),
      ),
    ).toBeVisible();
  }

  async clickAdditionalLocViewLocationButton() {
    await this.page.click(this.elements.additionalLocViewLocationButton);
  }

  async verifyLocationFlag(flagName: string, isVisible = true) {
    if (isVisible) {
      await expect(this.page.locator(this.elements.locationFlag)).toHaveText(
        flagName,
      );
    } else {
      await expect(
        this.page.locator(this.elements.locationFlag, {
          hasText: flagName,
        }),
      ).toBeHidden();
    }
  }

  async overrideFee(name: string, newValue: number) {
    const overallFeeElement = this.page.locator('tr', {
      has: this.page.locator(`[title="${name}"]`),
    });

    await overallFeeElement.locator(this.elements.feeBill).click(); // To activate edit mode
    await overallFeeElement
      .locator(this.elements.inputFeeValue)
      .fill(newValue.toString());
    await overallFeeElement.locator('button', {hasText: 'Save'}).click(); // To Save value
    await expect(
      overallFeeElement.locator('button', {hasText: 'Save'}),
    ).toBeHidden(); // To wait for the page to reload
  }

  async clickAddPrimaryLocation() {
    await this.page.locator(this.elements.addPrimaryLocationButton).click();
  }

  async verifyLocationHelpText(locationType: string, helpText: string) {
    switch (locationType) {
      case 'Address':
        await expect(
          this.page.locator(this.elements.addresstLocationHelpText),
        ).toHaveText(helpText);
        break;
      case 'Point':
        await expect(
          this.page.locator(this.elements.pointLocationHelpText),
        ).toHaveText(helpText);
        break;
      case 'Segment':
        await expect(
          this.page.locator(this.elements.segmentLocationHelpText),
        ).toHaveText(helpText);
        break;
      default:
        throw new Error('Unsupported Location Type');
    }
  }

  async uploadFileToFormField(fileType: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    await Promise.all([
      // waiting till background api is completed
      await this.page.setInputFiles(this.elements.uploadNewFileBtn, filePath),
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/uploaded_files') &&
          response.status() === 201,
      ),
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/form_field_entries') &&
          response.status() === 200,
      ),
    ]);
    if (fileType == 'png') {
      await expect(
        this.page.locator(this.elements.thumbnailImage),
        'Verify Image Upload',
      ).toBeVisible();
    } else {
      await expect(
        this.page.locator(this.elements.uploadedFormFieldFileBadge, {
          hasText: fileType,
        }),
        'Verify File Upload',
      ).toBeVisible();
    }
  }

  async deleteFileOnFormField(fileType: string) {
    await Promise.all([
      // waiting till background api is completed
      await this.page.click(this.elements.deleteFileFormField),
      await this.page.click(this.elements.confirmPopupButton),
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/uploaded_files') &&
          response.status() === 204,
      ),
      await this.page.waitForResponse(
        (response) =>
          response.url().includes('/form_field_entries') &&
          response.status() === 200,
      ),
    ]);
    await expect(
      this.page.locator(this.elements.uploadedFormFieldFileBadge, {
        hasText: fileType,
      }),
      'Verify File Removed',
    ).toBeHidden();
  }

  async getTotalnavRows() {
    const elements = await this.page.$$(this.elements.recordStepNames);
    return elements;
  }

  async clickPrintOriginalRecord() {
    await this.page.locator('a', {hasText: 'Print Original Record'}).click();
  }

  /**
   * For a single entry form fields
   */
  async validateFormFieldValue(
    sectionName: string,
    formFieldLabel: string,
    expectedValue: string,
    exactMatch = true,
  ) {
    const editFormField = this.elements.formFieldEditLink.selector(
      sectionName,
      formFieldLabel,
    );
    exactMatch
      ? await expect(this.page.locator(editFormField)).toHaveText(expectedValue)
      : await expect(this.page.locator(editFormField)).toContainText(
          expectedValue,
        );
  }

  async clickChangeLocation() {
    await this.page
      .locator(this.elements.submittedRecordOutlet)
      .locator(this.elements.locationMenuDropdown)
      .click();
    await this.page.locator('a', {hasText: 'Change Location'}).click();
  }

  async searchAndSelectLocation(locationAddress: string) {
    await this.page.click(this.elements.addressLocationSearchBox);
    await this.page
      .locator(this.elements.addressLocationSearchBox)
      .fill(locationAddress);
    await this.page
      .locator(this.elements.addressSearchResults, {
        hasText: locationAddress,
      })
      .click();
    await this.page.click(this.elements.confirmLocationButton);
  }

  async verifyLocationTitle(title: string) {
    await expect(
      this.page
        .locator(this.elements.submittedRecordOutlet)
        .locator('h4.primary'),
    ).toContainText(title);
  }

  async onHoldStep(commentMessage: string) {
    await this.page.fill(this.elements.commentInputField, commentMessage);
    await this.page.click(this.elements.onHoldCommentButton.selector());
    await expect(this.page.locator(this.elements.commentBody)).toBeVisible();
  }

  async mentionInComment(
    mentionedName: string,
    searchValue: string,
    commentNumber = 1,
    delayValue = 100,
  ) {
    await this.page.type(this.elements.commentInputField, mentionedName, {
      delay: delayValue,
    });
    await this.page.click(
      this.elements.firstOptionInNameDropdown.selector(
        searchValue,
        commentNumber,
      ),
    );
  }

  async modifyInspectionDate() {
    await this.page.click(this.elements.editStep);
    await this.page.click(this.elements.inspectionDateDropdownToggle);
    await this.page.click(this.elements.dueDateCalendarToday);
    await this.page.click(this.elements.confirmInspectionDateChngBtn);
  }

  async clickOnHoldButton() {
    await this.page.click(this.elements.onHoldCommentButton.selector());
    await this.page.click(this.elements.onHoldCommentButton.selector(2));
  }

  async clickOnCommentButton() {
    await this.page.click(this.elements.commentSubmitButton);
  }
  async clickOnCancelRecordStepButton() {
    await this.page.click(this.elements.cancelRecordStepButton);
  }

  async clickOnDialogButtonByName(buttonName: string) {
    await this.page.click(this.elements.dialogPopupButton.selector(buttonName));
  }

  async setExpirationDateAndDay(month: number, day: number, year: number) {
    await this.page.click(this.elements.expirationDate);
    await new Helpers().waitFor(1000);
    await this.page
      .locator(this.elements.expirationDateYear)
      .selectOption({value: String(year)});
    await this.page
      .locator(this.elements.expirationDateMonth)
      .selectOption({value: String(month)});
    await this.page.click(this.elements.calendarDate.selector(String(day)));
  }
  async clickOnRunSequenceButton() {
    await this.page.click(this.elements.recordActionsSupUserRunSequenceAction);
  }
}

export const PaymentData: IPaymentData = {
  Email: 'cat@gmail.com',
  Name: 'Cat',
  Street: 'Cat',
  City: 'Cat',
  Postcode: '123',
  Number: '4242 4242 4242 4242',
  Expiry_MM: '01',
  Expiry_YY: '33',
  CVC: '132',
};

export const DisputedPaymentData: IPaymentData = {
  Email: 'cat@gmail.com',
  Name: 'Cat',
  Street: 'Cat',
  City: 'Cat',
  Postcode: '123',
  Number: '4000 0000 0000 0259',
  Expiry_MM: '01',
  Expiry_YY: '33',
  CVC: '132',
};

export const DeclinedPaymentData: IPaymentData = {
  Email: 'cat@gmail.com',
  Name: 'Cat',
  Street: 'Cat',
  City: 'Cat',
  Postcode: '123',
  Number: '4000 0000 0000 0002',
  Expiry_MM: '01',
  Expiry_YY: '33',
  CVC: '132',
};

interface IPaymentData {
  Email: string;
  Name: string;
  Street: string;
  City: string;
  Postcode: string;
  Number: string;
  Expiry_MM: string;
  Expiry_YY: string;
  CVC: string;
}

export enum PaymentMethod {
  Cash = 'Cash',
  Check = 'Check',
  Credit = 'Credit',
  Bank = 'Bank',
  Waiving = 'Waiving',
}

export enum RecordStepStatus {
  Complete = 'Complete',
  Completed = 'Completed',
  Paid = 'Paid',
  Issued = 'Issued',
  Waived = 'Waived',
  Due_Now = 'Due Now',
  Active = 'Active',
  In_Progress = 'In Progress',
  Inactive = 'Inactive',
  Review = 'Review',
  On_Hold = 'On Hold',
  Skip = 'Skip',
  Skipped = 'Skipped',
  Reject = 'Reject',
  Rejected = 'Rejected',
}

type RecordStepStatusTypes =
  | RecordStepStatus.Complete
  | RecordStepStatus.Completed
  | RecordStepStatus.Paid
  | RecordStepStatus.Issued
  | RecordStepStatus.Waived
  | RecordStepStatus.Due_Now
  | RecordStepStatus.Active
  | RecordStepStatus.In_Progress
  | RecordStepStatus.Inactive
  | RecordStepStatus.Review
  | RecordStepStatus.On_Hold
  | RecordStepStatus.Skip
  | RecordStepStatus.Skipped
  | RecordStepStatus.Reject
  | RecordStepStatus.Rejected;

export enum RecordStatus {
  Active = 'Active',
  Complete = 'Complete',
  Archive = 'Archived',
  Stopped = 'Stopped',
}

export enum RecordStep {
  Approval = 1,
  Payment = 2,
  Document = 5,
  Inspection = 4,
}

type RecordTabs =
  | 'Details'
  | 'Attachments'
  | 'Activity'
  | 'Applicant'
  | 'Location';
