import {expect} from '../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {PlaidPage} from '@opengov/cit-base/build/common-pages/plaid-payment.page';
import {StripePage} from '@opengov/cit-base/build/common-pages/stripe-payment-page';
import {resolve} from 'path';
import {
  LocationTypes,
  RESOURCES_DIR,
} from '@opengov/cit-base/build/constants/cit-constants';
import {Page} from '@playwright/test';
export type stepType =
  | 'Approval'
  | 'Document'
  | 'Payment'
  | 'Inspection'
  | string;
export class PublicRecordPage extends BaseCitPage {
  readonly stripePage: StripePage = new StripePage(this.page);
  readonly plaidPage: PlaidPage = new PlaidPage(this.page);

  readonly elements = {
    recordTypeFilterField: '#record-type-filter',
    searchResults: '.autocomplete-result-item',
    uploadNewFileBtn: '[type=file]',
    recordTypeNames: '.list-group-item .media-heading',
    recordApplicationPageHeader: 'h2',
    applyOnlineButton: ".btn-primary[href^='/prepare_record']",
    thumbnailImage: 'a[class*=thumbnail]',
    uploadedFormFieldFileBadge: '.form-group .badge',
    contactInfoForm: '#contactInfo',
    proceedButton: '.submit-footer .btn-primary',
    submitButton: '[data-target="#drilldown-form"] .pull-right',
    backButton: '.submit-footer .back-button',
    attachmentBucketLabels: 'table td .uploaded-file-name',
    inProgressRecordStep: `.step-tracker .media-body .fa-play-circle +span`,
    inProgressRecordStepDetail: `.row .fa-play-circle +strong`,
    completedRecordStep: `.step-tracker .media-body .fa-check-circle +span`,
    inProgressStepName: {
      selector: (stepName) =>
        `//span[@class="media pointer" and text()="${stepName}"]`,
    },
    recordStepNames: '.step-tracker .media-body span',
    stepPageHeader: 'div > div > h2',
    attachmentPage: '.submit-attachments',
    confirmationPage: '.submit-confirm',
    submissionPage: '.track-nav',
    confirmationPageSectionHeaders: '.row h4',
    bankPaymentRadioButton: 'input[name="payRadios"][value="4"]',
    bankPaymentRadioButtonText: {
      selector: (feeText) =>
        `//label[input[@name="payRadios"][@value="4"]]/small[contains(normalize-space(), "${feeText}")]`,
    },
    cashOrCheckRadioButton: 'input[name="payRadios"][value="2"]',
    cashOrCheckRadioButtonText: {
      selector: (feeText) =>
        `//label[input[@name="payRadios"][@value="2"]]/small[contains(normalize-space(), "${feeText}")]`,
    },
    creditCardPaymentRadioButton: 'input[name="payRadios"][value="1"]',
    creditCardPaymentRadioButtonText: {
      selector: (feeText) =>
        `//label[input[@name="payRadios"][@value="1"]]/small[contains(normalize-space(), "${feeText}")]`,
    },
    payButton: 'button.stripe-checkout',
    payWithBankButton: 'button.ember-view',
    yourRecordsButton: '[href="/dashboard/records"]',
    paymentContinueButton: 'button[id="submitButton"]',
    emailCardInput: 'input[type="email"]',
    nameCardInput: 'input[placeholder="Name"]',
    streetCardInput: 'input[placeholder="Address"]',
    cityCardInput: 'input[placeholder="City"]',
    postCodeCardInput: 'input[placeholder="ZIP"]',
    cardNumber: 'input[placeholder="Card number"]',
    cardExpiry: 'input[placeholder="MM / YY"]',
    cardCVC: 'input[placeholder="CVC"]',
    payUSDbutton: 'button[type="submit"]',
    cardPaymentFrame: 'iframe[name="stripe_checkout_app"]',
    bankPaymentFrame: 'iframe[id="plaid-link-iframe-1"]',
    commentArea: '#step_comment_box',
    headerTitle: '.container h3',
    dashboardRecordsLink: 'a[href="/dashboard/records"]',
    attachmentLink: '.nav.nav-pills li:nth-of-type(2)',
    uploadedFile: '.attachment-list-row.pointer',
    recordTabButton: '.nav.nav-pills.nav-stacked .media-body',
    recordNumber: '.media-heading',
    recordTypeName: '#main-content label',
    requestInspectionTitle: 'div.panel.panel-default h4',
    requestInspectionButton: 'div.panel.panel-default .btn-primary',
    requestInspectionCalendar: '#main-content .ember-power-calendar',
    submitRequestInspectionButton: '#main-content .btn-toolbar .btn-primary',
    cancelRequestTitle: 'div.panel.panel-default h4',
    cancelRequestButton: 'div.panel.panel-default a.text-danger',
    cancelRequestConfirmTitle: '.bootbox-confirm .bootbox-body',
    cancelRequestConfirmButton:
      '.bootbox-confirm button[data-bb-handler="confirm"]',
    inspectionHistoryLink: 'tbody tr',
    attachmentThumbnail: '.inspection.thumbnail',
    checklistAttachment: '.inspection-result-branch .inspection.thumbnail',
    inspectionRecord: 'tbody tr:nth-of-type(1)',
    locationInfo: '#location-panel h4,.location-summary h4',
    locationMapbox: '#mapbox',
    recordStepTracker: '.nav-pills.nav-stacked.step-tracker li div div span',
    commentInputField: 'textarea[name="step_comment_box"]',
    commentSubmitButton: '.btn-primary',
    commentBody: '.fr-view.comment',
    printReceiptButton: '//button[contains(text(), "Print Receipt")]',
    printDocumentButton: '//button[contains(text(), "Print Document")]',
    printWindow: '#printwindow',
    receiptBodyTable: '.invoice tr',
    receiptMainHeader: 'td.content-block h1',
    receiptAdditionalHeader: 'td.content-block h3',
    receiptTypeHeader: 'td.content-block h3:nth-child(4)',
    changeLocationBtn: `//button[contains(.,'Change Location')]`,
    capacityRestrictionError: {
      selector: (fieldName) =>
        `//label[contains(string(),'${fieldName}')]//following::small[@data-fv-result!='VALID'][position()=1]`,
    },
    forceSubmitButton: `//a[contains(string(), 'Force Submit')]`,
    downloadAttachmentButton:
      '[role=dialog][style*="display: block"] button.btn-primary',
    locationTypeButton: {
      selector: (locationType) =>
        `.addon-locations.location-type-select [data-test=${locationType}]`,
    },
    backToLocationTypesButton: 'a.location-breadcrumb',
    attachmentThumbnailLink: {
      selector: (attachmentName) =>
        `//*[@class="input-group" and .//*[text()="${attachmentName}"]]//a[@class="attachment-field-thumbnail"] | ` +
        `//a[text()="${attachmentName}"]`,
    },
    yourSubmissionLink: '.nav.nav-pills li:nth-of-type(1)',
    uploadAttachmentInput: '#FileInput_Adhoc',
    uploadAttachmentModalSubmit: '#addAttachmentModal .btn-primary',
    uploadAttachmentError: '#attachmentErrors',
    locationSearchBox: '.address-locations input[type="search"]',
    searchAndSelectLocationButtonStorefront: {
      selector: (searchKey: string) =>
        `//div[text()='${searchKey}']/..//button`,
    },
    formLabelWithValueSelector: {
      selector: (formLabel: string) =>
        `//label[@for='${formLabel}']/following-sibling::*//p[1]`,
    },
    addUnitDropdown: '#locationUnitsSelector',
    addNewUnitInput: '#newUnit',
    addUnitButton: '[data-test="add-action"]',
    pointLocationSearchResults: '.point-search .list-group-item[role="button"]',
    confirmLocationButton: 'button.btn-primary.confirm-button',
    searchAndSelectAddressLocationButton: {
      selector: (searchKey: string) =>
        `//div[text()='${searchKey}']/..//button`,
    },
    segmentStartingLocation: '[data-test-location="start"] input',
    segmentEndingLocation: '[data-test-location="end"] input',
    segmentLocationResult: {
      selector: (location: string) =>
        `//div[@class='list-group-item' and contains(.,'${location}')]`,
    },
    primaryLocationSection: `[data-test="primary-location-group"]`,
    additionalLocationSection: `[data-test="additional-location-group"]`,
    locationCardText: {
      selector: (locationSection) =>
        `${locationSection} .location-card .location`,
    },
    addAdditionalLocation:
      '[data-test-attribute="add-additional-location-anchor"]',
    locationSearchResults: '.address-search .list-group-item[role="button"]',
    addressSearchResults: '.location-result',
    selectLocationButton: '[data-test="select-location-button"]',
    selectLocationBtnDisabled: '[data-test="select-location-disabled-button"]',
    modalClose: '#createRecordLocationModal [aria-label="Close"]',
    removeAdditionalLocationBtn: {
      selector: (addressLoc: string) =>
        `//div[@data-test='additional-location-group']` +
        `//*[contains(@class,'location-card') and .//*[contains(.,'${addressLoc}')]]` +
        `//button[contains(@data-test,'Test String')]`,
    },
    removeLocationBtn: '[data-bb-handler="confirm"]',
    selectThisLocationBtn: '[data-test-action="confirm"]',
    toggleBtn: '[data-test="toggle-property-button"] i',
    setPrimaryLocationBtn: {
      selector: (addressLoc: string) =>
        `//div[@data-test='additional-location-group']` +
        `//*[contains(@class,'location-card') and .//*[contains(.,'${addressLoc}')]]` +
        `//a[@data-test="set-primary-location"]`,
    },
    locationText: {
      selector: (locationSection: string, addressLoc: string) =>
        `//div[@data-test='${locationSection}-location-group']//*[contains(@class,'primary') and contains(.,'${addressLoc}')]`,
    },
    setPrimaryLocBtnOnDialog: 'button[data-bb-handler="confirm"]',
    cancelBtnOnDialog: 'button[data-bb-handler="cancel"]',
    setPrimaryLocDialogText: '.modal-body .bootbox-body',
    additionalLocationDetails: '[data-test="additional-location-group"] p',
    viewMoreButton: '#load-more-record',
    noRecordMessage: '#main-content h4',
    locationsCount: '[data-test-attribute="locations-count"] p',
    editLocationLnk: '[data-test-attribute="edit-locations-link"] a',
    toggleLink: '[data-test-attribute="toggle-additional-locations-link"]',
    locationCardOnExpand:
      `//a[@data-test-attribute='toggle-additional-locations-link']` +
      `/parent::h4//following-sibling::div`,
    locationCard: {
      selector: (locationSection) => `${locationSection} .location-card`,
    },
    stepNameOnLeft: {
      selector: (stepName: stepType) =>
        `//ul[contains(@class, 'step-tracker')]//li//span[contains(.,"${stepName}")]`,
    },
    searchLoading: `.list-group.segment-results [data-test-search-results="loading"]`,
    addAdditionalLocationHintText:
      '[data-test-attribute="add-additional-location-hint-text"]',
    warningPrompt:
      '//div[ p[contains(normalize-space(),"Amount Due")] and p[contains(normalize-space(),"Total Payment Amount")] and contains(normalize-space(), "Please contact us to pay by cash or check") ]',
    mapPointMarker: `[aria-label="Map marker"]`,
    segmentLength: '[data-test-segment="length"]',
    clearSegmentAddressButton: '.segment-clear',
    addSectionButton: {selector: (name) => `xpath=//button[text()='${name}']`},
    sectionSearchField: '[name="searchFor"]',
    sectionSearchResults: '.list-group-item.resultRow',
    sectionNumberField: {
      selector: (fieldName) =>
        `xpath=//label[@for='${fieldName}']/following-sibling::div//input`,
    },
    sectionConfirmButton: '.btn-100',
    sectionEditButton: 'xpath=//button[contains(.,"Edit")]',
    updateSubmissionBanner: 'div[class*="variantInfo"]',
  };

  async validateRecordTypeFilterFieldVisibility(isVisible = false) {
    const recordTypeFilterFieldElement: string =
      this.elements.recordTypeFilterField;
    await this.waitForVisibility(recordTypeFilterFieldElement, isVisible);
  }

  async validateFormValuePostSubmission(formLabel: string, formValue: string) {
    await this.elementTextVisible(
      this.elements.formLabelWithValueSelector.selector(formLabel),
      formValue,
    );
  }

  async validateAttachmentBucketPresence(
    attachmentName: string,
    isPresent = true,
  ) {
    await this.waitForVisibility(this.elements.attachmentBucketLabels);
    isPresent
      ? await this.elementContainsText(
          this.elements.attachmentBucketLabels,
          attachmentName,
        )
      : await this.elementTextNotVisible(
          this.elements.attachmentBucketLabels,
          attachmentName,
        );
  }

  async validateSubmissionConfirmationPage() {
    const pageHeaderElement = this.elements.confirmationPageSectionHeaders;
    await this.elementTextVisible(pageHeaderElement, 'Contact Information');
    await expect(
      this.page.locator(pageHeaderElement, {hasText: 'Form'}).first(),
    ).toBeVisible();
    await this.elementTextVisible(pageHeaderElement, 'Attachments');
  }

  async validateRecordStepStatus(stepName: string, stepStatus: string) {
    switch (stepStatus) {
      case 'In progress':
      case 'Due Now':
        await expect(
          this.page.locator(this.elements.inProgressRecordStep, {
            hasText: stepName,
          }),
        ).toBeVisible();
        break;
      case 'Issued':
      case 'Completed':
        await expect(
          this.page.locator(this.elements.completedRecordStep, {
            hasText: stepName,
          }),
        ).toBeVisible();
        return;
      default:
        break;
    }

    // The next function works with "In progress" steps only, need to change it
    await this.clickRecordStepByName(stepName);
    await this.elementContainsText(
      this.elements.inProgressRecordStepDetail,
      `${stepStatus}.`,
    );
  }

  async validateRecordContainsStep(stepName: string) {
    await this.elementTextVisible(this.elements.recordStepNames, stepName);
  }

  async clickRecordStepByNameAnyStatus(stepName: string) {
    await this.clickElementWithText(this.elements.recordStepNames, stepName);
  }

  async clickPrintDocument() {
    await this.page.click(this.elements.printDocumentButton);
  }

  async validateRecordNotContainsStep(stepName: string) {
    await this.elementTextNotVisible(this.elements.recordStepNames, stepName);
  }

  async searchAndStartApplication(recordTypeName: string) {
    await this.searchForRecordType(recordTypeName);
    await this.elementContainsText(
      this.elements.recordApplicationPageHeader,
      recordTypeName,
    );
    await this.page.click(this.elements.applyOnlineButton);
    await this.page
      .locator(this.elements.contactInfoForm)
      .waitFor({state: 'visible', timeout: 10000});
  }

  async searchAndSelectLocationStorefront(locationAddress: string) {
    const locationSelect =
      this.elements.searchAndSelectLocationButtonStorefront.selector(
        locationAddress,
      );
    await this.page.click(this.elements.locationSearchBox);
    await this.fillLocationSearchBar(locationAddress);
    await this.page.click(locationSelect);
  }

  private async fillLocationSearchBar(text: string) {
    await this.page.click(this.elements.locationSearchBox);
    await this.page.fill(this.elements.locationSearchBox, text);
  }

  async searchForRecordType(recordTypeName: string, isVisible = true) {
    await this.page.click(this.elements.recordTypeFilterField);
    await this.page.fill(this.elements.recordTypeFilterField, recordTypeName);
    if (isVisible) {
      await this.clickElementWithText(
        this.elements.searchResults,
        recordTypeName,
        true,
      );
    } else {
      await this.elementTextNotVisible(
        this.elements.searchResults,
        recordTypeName,
        true,
      );
    }
  }

  async storeRecordIdAndStepIdFromURL() {
    const regexp = new RegExp(/track\/(\d+)\/step\/(\d+)/g);
    await this.page.waitForURL('**/track/**/step/**');
    const url = this.page.url();
    const regexpResult = regexp.exec(url);
    baseConfig.citTempData.recordId = regexpResult[1];
    baseConfig.citTempData.stepId = regexpResult[2];
    console.debug('Record ID on save: ', baseConfig.citTempData.recordId);
    console.debug('Step ID on save: ', baseConfig.citTempData.stepId);
  }

  async proceedToNextStep(action = 'next') {
    if (action === 'submit') {
      await this.page.click(this.elements.proceedButton);
      await this.storeRecordIdAndStepIdFromURL();
    } else if (action === 'force submit') {
      await this.page.evaluate(
        () => `document.querySelector('.btn-danger').click()`,
      );
      await this.elementVisible(this.elements.submissionPage);
    } else {
      await Promise.all([
        this.page.click(this.elements.proceedButton),
        this.page.waitForNavigation(),
        await expect(
          this.page.locator(this.elements.headerTitle).first(),
        ).toBeVisible(),
      ]);
    }
  }

  async skipAndSubmit() {
    await this.proceedToNextStep('next');
    await this.proceedToNextStep('next');
    await this.proceedToNextStep('next');
    await this.proceedToNextStep('submit');
  }

  async goBackToPreviousStep() {
    await this.page.click(this.elements.backButton);
  }

  async clickRecordStepByName(stepName: string) {
    await this.page
      .locator(this.elements.inProgressRecordStep, {hasText: stepName})
      .click();
    await this.elementContainsText(this.elements.stepPageHeader, stepName);
  }

  async checkStorefrontPaymentProcessingFees(
    paymentMethod: PaymentMethod,
    processingFeesToCheck: 'none' | string,
  ) {
    switch (true) {
      case paymentMethod === PaymentMethod.Bank &&
        processingFeesToCheck === 'none':
        await expect(
          this.page.locator(
            this.elements.bankPaymentRadioButtonText.selector(
              'No processing fee',
            ),
          ),
        ).toBeVisible();
        break;
      case paymentMethod === PaymentMethod.Bank &&
        processingFeesToCheck !== 'none':
        await expect(
          this.page.locator(
            this.elements.bankPaymentRadioButtonText.selector(
              processingFeesToCheck,
            ),
          ),
        ).toBeVisible();
        break;
      case paymentMethod === PaymentMethod.Credit &&
        processingFeesToCheck === 'none':
        await expect(
          this.page.locator(
            this.elements.creditCardPaymentRadioButtonText.selector(
              'No processing fee',
            ),
          ),
        ).toBeVisible();
        break;
      case paymentMethod === PaymentMethod.Credit &&
        processingFeesToCheck !== 'none':
        await expect(
          this.page.locator(
            this.elements.creditCardPaymentRadioButtonText.selector(
              processingFeesToCheck,
            ),
          ),
        ).toBeVisible();
        break;
      default:
        throw new Error('Pls choose correct payment method and options');
    }
  }

  async completeStorefrontPaymentWith(paymentMethod: PaymentMethod) {
    switch (paymentMethod) {
      case PaymentMethod.Cash:
      case PaymentMethod.Check:
        await this.page.click(this.elements.cashOrCheckRadioButton);
        await this.waitForVisibility(this.elements.payButton, false);
        await this.waitForVisibility(this.elements.payButton, false);
        break;
      case PaymentMethod.Bank:
        await this.page.click(this.elements.bankPaymentRadioButton);
        await this.page.click(this.elements.payWithBankButton);
        await this.waitForVisibility(this.elements.bankPaymentFrame);
        await this.plaidPage.fillBankInfo(BankPaymentData);
        break;
      case PaymentMethod.Credit:
        await this.page.click(this.elements.creditCardPaymentRadioButton);
        await this.page.click(this.elements.payButton);
        await this.stripePage.fillUserCardInfo(CardPaymentData);
        break;
      default:
        break;
    }
  }

  async verifyUploadedAttachments() {
    await this.page.click(this.elements.attachmentLink);
    await this.elementVisible(this.elements.uploadedFile, false);
  }

  async navigateToRecordTab(tabName: string) {
    await this.clickElementWithText(
      this.elements.recordTabButton,
      tabName,
      false,
    );
  }

  async saveRecordName() {
    let recordName = await this.page
      .locator(this.elements.recordNumber)
      .textContent();
    recordName = recordName.replace(/\s\s+/g, ' ');
    baseConfig.citTempData.recordName = recordName.trim();
    console.debug('Record name on save: ', baseConfig.citTempData.recordName);
    return baseConfig.citTempData.recordName;
  }

  async validateRequestInspectionSection() {
    await this.elementContainsText(
      this.elements.requestInspectionTitle,
      'Request an Inspection',
    );
    await this.elementContainsText(
      this.elements.requestInspectionButton,
      'Request Inspection',
    );
  }

  async verifyInspectionAttachments() {
    await this.page.click(this.elements.inspectionRecord);
    await this.page.click(this.elements.inspectionHistoryLink);
    await this.waitForVisibility(this.elements.attachmentThumbnail);
    await this.waitForVisibility(this.elements.checklistAttachment);
  }

  async verifyLocationDetails(segmentName: string) {
    await this.elementContainsText(this.elements.locationInfo, segmentName);
    await this.waitForVisibility(this.elements.locationMapbox);
  }

  async recordStepNotTracked(stepName: string) {
    await this.elementTextNotVisible(this.elements.recordStepTracker, stepName);
  }

  async commentStep(commentMessage: string) {
    await this.page.fill(this.elements.commentInputField, commentMessage);
    await this.page.click(this.elements.commentSubmitButton);
    await this.waitForVisibility(this.elements.commentBody);
  }

  async validateRecordTypeName(recordTypeName: string) {
    await this.elementContainsText(
      this.elements.recordTypeName,
      recordTypeName,
    );
  }

  async requestInspection() {
    await this.validateRequestInspectionSection();
    await this.page.click(this.elements.requestInspectionButton);
    await this.page.click(this.elements.submitRequestInspectionButton);
    await this.validateCancelRequestSection();
  }

  async validateCancelRequestSection() {
    await this.elementContainsText(
      this.elements.cancelRequestButton,
      'Cancel Request',
    );
  }

  async cancelRequest() {
    await this.validateCancelRequestSection();
    await this.page.click(this.elements.cancelRequestButton);

    await this.elementContainsText(
      this.elements.cancelRequestConfirmTitle,
      'Are you sure you want to cancel this inspection request?',
    );
    await this.page.click(this.elements.cancelRequestConfirmButton);
    await this.validateRequestInspectionSection();
  }

  async proceedToRecordInStorefrontByUrl() {
    await this.proceedToRecordInStorefrontById(baseConfig.citTempData.recordId);
  }
  async proceedToRecordInStorefrontById(recordId: string) {
    await this.waitForVisibility(this.elements.recordTypeFilterField);
    let attempt = 5;
    const resultStatus = -1;
    while (resultStatus === -1 && attempt--) {
      await this.page.goto(`${baseConfig.storefrontUrl}/track/${recordId}`);
      await this.waitForVisibility(this.elements.recordNumber);
    }
    await this.elementContainsText(
      this.elements.recordNumber,
      baseConfig.citTempData.recordName,
    );
  }

  async validateChangeLocationButtonDisplay() {
    await this.waitForVisibility(this.elements.changeLocationBtn);
  }

  async isErrorMessageDisplayed(fieldName: string, errorMessage: string) {
    const element = this.elements.capacityRestrictionError.selector(fieldName);
    await expect(this.page.locator(element)).toHaveText(
      errorMessage.replace(/(?:\r\n|\r|\n)/g, ''),
    );
  }

  async printAndValidateReceipt(paymentData: any) {
    const [receiptPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await this.page.click(this.elements.printReceiptButton),
    ]);
    await receiptPage.waitForLoadState();
    await receiptPage.bringToFront();

    const actualText = await this.getAllElementsText(
      this.elements.receiptBodyTable,
      receiptPage,
    );
    let totalAmount: string;
    let paymentStatus: string;

    for (const key in paymentData) {
      const value = paymentData[key];
      switch (key.toLowerCase()) {
        case 'status':
          paymentStatus = value;
          break;
        case 'record type': {
          const matchedRecord = actualText.filter((r) =>
            r.match(`${value} \\#${baseConfig.citTempData.recordName}`),
          );
          expect(matchedRecord.length).toEqual(1);
          break;
        }
        case 'total amount': {
          totalAmount = value;
          const matchedTotalAmount = actualText.filter((r) =>
            r.match(`Total Paid \\$${value}`),
          );
          expect(matchedTotalAmount.length).toEqual(1);
          break;
        }
        case 'payment type': {
          const receiptResult: string = await receiptPage
            .locator(this.elements.receiptTypeHeader)
            .textContent();
          const matchedPaymentType = receiptResult.match(`via ${value}`);
          expect(matchedPaymentType).not.toBeNull();
          break;
        }
        default:
          break;
      }
    }
    // Verifying the total Amount with Status
    const result: string = await receiptPage
      .locator(this.elements.receiptMainHeader)
      .textContent();
    const matchedTotalPaid = result.match(`\\$${totalAmount} ${paymentStatus}`);
    expect(matchedTotalPaid).not.toBeNull();

    // Find Date row and verify the date is today
    const dateStringRegexp = new RegExp(
      `\\w+ \\d{1,2}, ${new Date().getFullYear()}`,
    );
    const matchedDate = actualText.filter((r) => r.match(dateStringRegexp));
    expect(matchedDate.length).toEqual(1);
    expect(
      new Date(matchedDate[0].match(dateStringRegexp)[0]).toLocaleDateString(),
    ) // Parsing string to Date
      .toEqual(new Date().toLocaleDateString()); // Get today's date
  }

  async haveRecordSubmitted(success: string) {
    await this.page.click(this.elements.proceedButton);
    if (success === 'passed') {
      await this.storeRecordIdAndStepIdFromURL();
      console.debug('Record have been submitted');
    } else {
      console.debug('Record not yet submitted');
    }
  }

  async uploadAttachment(fileName: string, expectError: false) {
    const filePath = `${resolve(process.cwd())}${RESOURCES_DIR}${fileName}`;
    const errorText =
      'This file name can only include letters, numbers, and the following special characters !-_.*()';
    try {
      await this.page.setInputFiles(
        this.elements.uploadAttachmentInput,
        filePath,
      );
      if (expectError) {
        await expect(
          this.page.locator(this.elements.uploadAttachmentError),
        ).toContainText(errorText);
      } else {
        await this.page.click(this.elements.uploadAttachmentModalSubmit);
        await this.page.waitForSelector(
          this.elements.uploadAttachmentModalSubmit,
          {state: 'detached'},
        );
      }
    } catch (err) {
      console.info('File upload error: ', err);
    }
  }

  async uploadFileToFormField(fileType: string) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    await this.page.setInputFiles(this.elements.uploadNewFileBtn, filePath);
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
  async verifyNewTabWithAttachmentOpened(attachmentPage: Page) {
    expect(attachmentPage.url()).toContain(
      'vpc3uploadedfiles.blob.core.windows.net',
    );
    await expect(
      attachmentPage.locator(
        '[src*="vpc3uploadedfiles.blob.core.windows.net"]',
      ),
    ).toBeVisible();
  }

  async downloadAttachment() {
    await this.page.click(this.elements.uploadedFile);
    const [attachmentPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await this.page.click(this.elements.downloadAttachmentButton),
    ]);
    await this.verifyNewTabWithAttachmentOpened(attachmentPage);
  }

  async downloadAttachmentFromDetailsPage(attachmentName: string) {
    await this.page.click(this.elements.yourSubmissionLink);
    const [attachmentPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await this.page.click(
        this.elements.attachmentThumbnailLink.selector(attachmentName),
      ),
    ]);
    await this.verifyNewTabWithAttachmentOpened(attachmentPage);
  }

  async clickLocationType(locationType: string) {
    await this.page
      .locator(this.elements.locationTypeButton.selector(locationType))
      .waitFor({state: 'attached'});
    await this.page.click(
      this.elements.locationTypeButton.selector(locationType),
    );
    await expect(
      this.page.locator(this.elements.backToLocationTypesButton).first(),
    ).toBeVisible();
  }

  async addUnitTolocation(unitText: string) {
    await this.page.click(this.elements.addUnitDropdown);
    await (
      await this.page.$(this.elements.addUnitDropdown)
    ).selectOption({value: 'addUnit'});
    await this.page.fill(this.elements.addNewUnitInput, unitText);
    await this.page.click(this.elements.addUnitButton);
    await this.waitForVisibility(this.elements.addUnitDropdown);
  }

  async verifyUnitOnLocation(unitText: string, location: string) {
    if (unitText) {
      let selectedValue: Promise<string> = null;
      await expect
        .poll(
          async () => {
            selectedValue = this.page.$eval<string, HTMLSelectElement>(
              this.elements.addUnitDropdown,
              (e) => e.value,
            );
            return selectedValue;
          },
          {
            message: `Expected ${unitText} is not equal to ${selectedValue}`,
            timeout: 5000,
          },
        )
        .toEqual(unitText);
    }
    await expect(this.page.locator(this.elements.locationInfo)).toContainText(
      location,
    );
  }

  async searchAndSelectPointLocation(
    locationAddress: string,
    sectionName: string,
    isDuplicateCheck = false,
  ) {
    const locationButton =
      sectionName === 'primary'
        ? this.elements.confirmLocationButton
        : this.elements.selectLocationButton;
    const locationSearchBox = this.elements.locationSearchBox;
    const locationSelect = this.elements.pointLocationSearchResults;

    await this.clickLocationType(LocationTypes.POINT);
    await this.page.click(locationSearchBox);
    await this.page.fill(locationSearchBox, locationAddress);
    await this.waitForVisibility(this.elements.searchLoading, false);
    await this.page.click(locationSelect);
    if (isDuplicateCheck) {
      await this.verifyDuplicateLocationCheck();
      return;
    }
    await this.page.click(locationButton);
    await this.waitForVisibility(locationButton, false);
  }

  async searchAndSelectSegmentLocation(segmentInfo: {
    primaryLabel: string;
    secondaryLabel: string;
  }) {
    await this.clickLocationType(LocationTypes.SEGMENT);
    await this.chooseSegmentLocationPoint('starting', segmentInfo.primaryLabel);
    await this.chooseSegmentLocationPoint('ending', segmentInfo.secondaryLabel);
    await this.confirmSelectedSegmentLocation();
  }

  async searchAndSelectAddressLocationAdditional(
    locationAddress: string,
    isDuplicateCheck = false,
  ) {
    const locationSelect = this.elements.locationSearchResults;

    await this.clickLocationType(LocationTypes.ADDRESS);
    await this.page.click(this.elements.locationSearchBox);
    await this.page.fill(this.elements.locationSearchBox, locationAddress);
    await this.fillLocationSearchBar(locationAddress);
    await this.page.click(locationSelect);

    if (isDuplicateCheck) {
      await this.verifyDuplicateLocationCheck();
      return;
    }
    await this.page.click(this.elements.selectLocationButton);
    await this.waitForVisibility(this.elements.selectLocationButton, false);
  }

  async clickAdditionalLocationBtn() {
    await this.page
      .locator(this.elements.addAdditionalLocation)
      .waitFor({state: 'attached'});
    await this.waitForVisibility(this.elements.addAdditionalLocation);
    await this.page.click(this.elements.addAdditionalLocation);
    await this.waitForVisibility(this.elements.modalClose);
  }

  async verifyLocationIsDisplayed(locationName: string, sectionName: string) {
    const locator = this.elements.locationText.selector(
      sectionName,
      locationName.split(',')[0],
    );
    await expect
      .poll(
        async () => {
          const text = await this.page.locator(locator).innerText();
          return text.match(locationName.split(',')[0]);
        },
        {
          message: `${sectionName} location with name ${locationName} was not found`,
          timeout: 30000,
        },
      )
      .toBeTruthy();
  }

  async verifyDuplicateLocationCheck() {
    const locationBtnDisabled = this.elements.selectLocationBtnDisabled;
    await this.waitForVisibility(locationBtnDisabled);
    const modalCloseBtn = this.elements.modalClose;
    const tooltipText = 'This location has already been added to your record';
    await this.verifyTooltip(locationBtnDisabled, tooltipText);
    await this.page.click(modalCloseBtn);
    await this.waitForVisibility(locationBtnDisabled, false);
  }

  async removeAdditionalLocations(locationAddress: string) {
    const removeAddLocationBtn =
      this.elements.removeAdditionalLocationBtn.selector(
        locationAddress.split(',')[0],
      );
    await this.waitForVisibility(removeAddLocationBtn);
    await this.page.click(removeAddLocationBtn);
    await this.page.click(this.elements.removeLocationBtn, {timeout: 5000});
    await this.waitForVisibility(removeAddLocationBtn, false);
  }

  async clickToggleButton(action: string) {
    const toggleButton = this.elements.toggleBtn;
    const result = await this.page.locator(toggleButton).getAttribute('class');
    if (!result.includes(action)) {
      await this.page.click(toggleButton);
    }
  }

  async promoteAdditionalLocations(
    locationAddress: string,
    isTextCheck = false,
  ) {
    const setPrimaryLocBtn = this.elements.setPrimaryLocationBtn.selector(
      locationAddress.split(',')[0],
    );
    await this.page.click(setPrimaryLocBtn);
    if (isTextCheck) {
      await this.verifyPrimaryLocDialogText(locationAddress.split(',')[0]);
    }
    const primaryLocBtnOnDialog = this.elements.setPrimaryLocBtnOnDialog;
    await this.page.click(primaryLocBtnOnDialog);
    await this.waitForVisibility(primaryLocBtnOnDialog, false);
  }

  async verifyPrimaryLocDialogText(text: string) {
    const primaryLocDialogText = this.elements.setPrimaryLocDialogText;
    const cancelBtn = this.elements.cancelBtnOnDialog;
    await this.page.waitForSelector(cancelBtn);
    await this.waitForVisibility(cancelBtn);
    await expect(this.page.locator(primaryLocDialogText)).toContainText(text);
  }

  async verifyAdditionalLocationCountDetails(text: string) {
    const additionalLocationDetails = this.elements.additionalLocationDetails;
    await this.waitForVisibility(additionalLocationDetails);
    await expect(this.page.locator(additionalLocationDetails)).toContainText(
      text,
      {timeout: 5000},
    );
  }

  async verifyTooltip(element: any, tooltipText: string) {
    const result = await (
      await this.page.waitForSelector(element)
    ).getAttribute('data-hint');
    expect(result).toContain(tooltipText);
  }

  async verifyViewMoreButtonDisplayed(isVisible = true) {
    const viewMoreBtn = this.elements.viewMoreButton;
    if (isVisible) {
      await expect(this.page.locator(viewMoreBtn)).toBeVisible();
    } else {
      await expect(this.page.locator(viewMoreBtn)).toBeHidden();
    }
  }

  async clickViewMoreButton() {
    const viewMoreButton = this.elements.viewMoreButton;
    await this.page.locator(viewMoreButton).click();
  }

  async verifyNoRecordsMessageDisplayed(message: string) {
    await this.page.waitForSelector(this.elements.noRecordMessage);
    await expect(
      this.page.locator(this.elements.noRecordMessage),
    ).toContainText(message);
  }

  async verifyLocationsCount(locationCountText: string) {
    const totalLocationCount = this.elements.locationsCount;
    await this.page.waitForSelector(totalLocationCount);
    await expect(this.page.locator(totalLocationCount)).toContainText(
      locationCountText,
    );
  }

  async clickEditLocationLink() {
    const editLink = this.elements.editLocationLnk;
    await this.page.click(editLink);
    await expect(
      this.page.locator(this.elements.addAdditionalLocation),
    ).toBeVisible();
  }

  async verifyToggleButton(isPresent = true) {
    const toggleBtnLink = this.elements.toggleLink;
    if (isPresent) {
      await expect(this.page.locator(toggleBtnLink)).toBeVisible();
    } else {
      await expect(this.page.locator(toggleBtnLink)).toBeHidden();
    }
  }

  async verifyToggleButtonText(text: string) {
    const toggleBtnLink = this.elements.toggleLink;
    await this.page.waitForSelector(toggleBtnLink);
    await expect(this.page.locator(toggleBtnLink)).toContainText(text);
  }

  async clickToggleBtnLink(action: string) {
    const toggleBtnLink = this.elements.toggleLink;
    const locationCard = this.elements.locationCardOnExpand;
    await this.page.locator(toggleBtnLink).click();
    if (action.toLocaleLowerCase() === 'expand') {
      await expect(this.page.locator(locationCard)).toBeVisible();
    } else {
      await expect(this.page.locator(locationCard)).toBeHidden();
    }
  }

  async verifyElementsNotDisplayedInLocationSection(sectionName: string) {
    const locationSection =
      sectionName === 'primary'
        ? this.elements.primaryLocationSection
        : this.elements.additionalLocationSection;
    const locationCard = this.elements.locationCard.selector(locationSection);

    await expect(this.page.locator(locationCard)).toBeHidden();
  }

  async verifyAdditionalLocationButton(isPresent = true) {
    const additionalLocationBtn = this.elements.addAdditionalLocation;
    if (isPresent) {
      await expect(this.page.locator(additionalLocationBtn)).toBeVisible();
    } else {
      await expect(this.page.locator(additionalLocationBtn)).toBeHidden();
    }
  }

  async verifyLocationSection(sectionName: string, isDisplayed = true) {
    const locationSection =
      sectionName === 'primary'
        ? this.elements.primaryLocationSection
        : this.elements.additionalLocationSection;
    if (isDisplayed) {
      await expect(this.page.locator(locationSection)).toBeVisible();
    } else {
      await expect(this.page.locator(locationSection)).toBeHidden();
    }
  }
  async verifyCheckOrCashNotification() {
    await this.waitForVisibility(this.elements.warningPrompt);
  }

  async chooseSegmentLocationPoint(
    type: 'starting' | 'ending',
    address: string,
  ) {
    const initialNumberOfMapMarkers = (await this.page
      .locator(this.elements.mapPointMarker)
      .isVisible())
      ? 1
      : 0;

    if (type === 'starting') {
      await this.waitForVisibility(this.elements.segmentStartingLocation);
      await this.page.fill(this.elements.segmentStartingLocation, address);
    } else {
      await this.waitForVisibility(this.elements.segmentEndingLocation);
      await this.page.fill(this.elements.segmentEndingLocation, address);
    }
    await this.waitForVisibility(this.elements.searchLoading, false);
    await this.page.click(
      this.elements.segmentLocationResult.selector(address.split(',')[0]),
      {timeout: 5000},
    );

    // It can be the 1st or the 2nd marker on the map
    initialNumberOfMapMarkers === 0
      ? await this.page.waitForSelector(this.elements.mapPointMarker)
      : await this.page.waitForFunction(
          `document.querySelectorAll('${this.elements.mapPointMarker}').length > 1`,
        );
  }

  async confirmSelectedSegmentLocation() {
    await this.page.click(this.elements.selectThisLocationBtn);
    await this.waitForVisibility(this.elements.selectThisLocationBtn, false);
  }

  async clickOnRecordStepName(stepName: stepType) {
    await this.page.click(this.elements.stepNameOnLeft.selector(stepName));
  }

  async putPointOnMap(coordinates = {x: 200, y: 200}) {
    await this.page.waitForTimeout(1000); // Otherwise, the point may not work as expected

    const initialNumberOfMapMarkers = (await this.page
      .locator(this.elements.mapPointMarker)
      .isVisible())
      ? 1
      : 0;

    await this.page.click('canvas', {
      position: coordinates,
    });

    // It can be the 1st or the 2nd marker on the map
    initialNumberOfMapMarkers === 0
      ? await this.page.waitForSelector(this.elements.mapPointMarker)
      : await this.page.waitForFunction(
          `document.querySelectorAll('${this.elements.mapPointMarker}').length > 1`,
        );
  }

  async getSegmentLength() {
    const elementsText = await this.page
      .locator(this.elements.segmentLength)
      .textContent();
    return parseFloat(
      elementsText.replace('Selected length: ', '').replace('feet', '').trim(),
    );
  }

  async clickAddSectionButton(sectionName: string) {
    await this.page
      .locator(this.elements.addSectionButton.selector(sectionName))
      .click();
  }

  async fillAndSubmitMultientrySection(fieldName1: string, input1: string) {
    await this.page.locator(this.elements.sectionSearchField).fill('2');
    await this.page.locator(this.elements.sectionSearchResults).first().click();
    await this.page
      .locator(this.elements.sectionNumberField.selector(fieldName1))
      .fill(input1);
    await this.page.locator(this.elements.sectionConfirmButton).click();
  }
  async validateUpdateSubmissionBannerVisibility(isVisible: boolean) {
    await this.waitForVisibility(
      this.elements.updateSubmissionBanner,
      isVisible,
    );
  }
}

export enum PaymentMethod {
  Cash = 'Cash',
  Check = 'Check',
  Credit = 'Credit',
  Bank = 'Bank',
  Waiving = 'Waiving',
}

export enum BankPaymentData {
  // Plaid testing data
  Institution = 'Houndstooth Bank',
  UserName = 'user_good',
  Password = 'pass_good',
  PrimaryAccount = 'Plaid Saving',
  RoutingNumber = '021000021',
  AccountNumber = '1111222233331111',
}

export enum CardPaymentData {
  Email = 'cat@gmail.com',
  Name = 'Cat',
  Street = 'Cat',
  City = 'Cat',
  Postcode = '123',
  Number = '4242 4242 4242 4242',
  Expiry_MM = '01',
  Expiry_YY = '33',
  CVC = '132',
}
