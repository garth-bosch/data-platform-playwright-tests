import {expect} from '../base/base-test';
import {resolve} from 'path';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';
import {InternalRecordPage} from './ea-record-page';
import {NavigationBarPage} from './navigation-bar-page';
import {UserInfo} from '@opengov/cit-base/build/constants/cit-constants';

export class CreateRecordPage extends BaseCitPage {
  readonly recordPage: InternalRecordPage = new InternalRecordPage(this.page);
  readonly loginPage: AuthPage = new AuthPage(this.page);

  readonly elements = {
    formSections: '.row h4',
    addApplicationButton: '#add-applicant',
    applicantSearchBox: '#searchText',
    searchAndSelectButton: {
      selector: (searchKey: string) =>
        `(//tr/td/span[text()='${searchKey}']/following::td/button)[1]`,
    },
    recordApplicantEmailLink: '#applicant-panel a[href^=mailto]',
    changeLocationBtn: '[data-test="change-location-button"]',
    addLocationButton: '[data-test="add-location"]',
    locationSearchBox: '.address-locations input[type="search"]',
    locationSearchResults: {
      selector: (addressString: string) =>
        `//div[contains(@class,"location-result") and contains(., "${addressString}")]`,
    },
    confirmLocationButton: '.selected-location .location-footer button',
    recordLocationAddressLink: '.location .primary',
    submitRecordButton: '#submit-record',
    recordNumber: '#record-number',
    pointOnMapBtn: '.addon-locations div.panel-default:nth-of-type(2)',
    pointLocationSearchBox: '.address-locations input[type="Search"]',
    pointLocationSearchResults:
      '.addon-locations .list-group-item[role="button"]',
    selectPointLocationBtn: '.location-first-panel .location-footer button',
    selectPointLocationOnMap:
      '.addon-locations > div > div > div:nth-child(1) > div:nth-child(1)',
    pointLocationAdded: '.location a',
    locationNameTextbox: '.form-group.row div input',
    locationNameLink: '#locationEditForm div:nth-of-type(3) div a',
    saveLocationEditForm:
      '#locationEditForm div div.clearfix div button.btn.btn-primary',
    confirmLocationEditForm: '.bootbox-accept',
    chooseFileBtn: '.input-group [type=file]',
    createRecordForm: '#create-record-form',
    formFieldValue: {
      selector: (formField: string) =>
        `//label[text()='${formField}']/following-sibling::div/input`,
    },
    warningBanner: '.banner-variant.warning',
    warningBannerMessage: '.bannerBody',
    loginPage: '.auth0-lock-cred-pane.auth0-lock-quiet',
    locationSearchInput: '[placeholder="Start searching..."]',

    locationSearchInputResultRow: {
      selector: (address: string) =>
        `//div[contains(@class, "list-group")]//div[contains(@class, "location-result") and contains(.,"${address}")]`,
    },
    locationSearchInputResultConfirm: `[data-test="select-location-button"]`,
    pointOnMapSearchInput: '[placeholder="Search for a named point..."]',
    pointOnMapSearchInputResultRow: {
      selector: (address: string) =>
        `//div[contains(@class, "list-group")]//div[contains(@class, "search-result-item") and contains(.,"${address}")]`,
    },
    addressLocationType: '[data-test="address"]',
    pointOnMapLocationType: '[data-test="point"]',
    segmentLocationType: '[data-test="segment"]',
    segmentStartingLocation: '[data-test-location="start"] input',
    segmentEndingLocation: '[data-test-location="end"] input',
    clearSegment: '.segment-clear button',
    segmentLocationResult:
      'div[data-test-location] div.list-group-item[role="button"]',
    confirmSegmentLocationBtn: '[data-test-action="confirm"]',
    longTextFormFieldText: {
      selector: (fieldName, row, column) =>
        `//label[contains(string(),'${fieldName}')]/following::tbody/tr[${row}]/td[${column}]`,
    },
    saveBtn: '//*[@class="modal-dialog"]//button[contains(text(),"Save")]',
    uploadedFileName: `//a[contains(., 'Clear file')]/../preceding-sibling::div/span`,
    addNewAttachmentInput: '.dropzone input',
    addNewAttachmentModal: '#addAttachmentForm',
    uploadedAttachmentName: {
      selector: (formField: string) =>
        `.//h4[text()='${formField}']/../../../..//i/../../p[1]`,
    },
    saveDraftButton: '#save-draft-button',
    discardDraftButton: '#discard-draft-button',
    addMultiEntrySection: `#add-mei-button`,
    saveMultiEntrySection:
      '//*[@class="modal-dialog"]//button[contains(string(),"Save")]',
    removeBtn: `//button[contains()='Remove']`,
    recordApplicantPhoneNoMasked: 'input[id="phoneNo"][data-mask]',
    applicantEmailAddress: `#email`,
    applicantFirstName: `#firstName`,
    applicantLastName: `#lastName`,
    applicantPhoneNumber: `#phoneNo`,
    applicantAddress1: `#address`,
    applicantCity: `#city`,
    applicantState: `#state`,
    applicantZipCode: `#zip`,
    createApplicant: `#create-and-attach-applicant`,
    createRecordApplicantModal: '#createRecordApplicantModal',
    departmentDropdownToggle: '#reports-topbar .dropdown-toggle',
    departmentOptions: '#reports-topbar ul li',
    recordNameSearch: '#record-filter',
    recordTypes: '.submenu-margin .list-group-item',
    formGroupCheckbox: {
      selector: (name: string) =>
        `//div[contains(., '${name}')][contains(@class, 'form-group')]//input[contains(@class, 'checkboxOption')]`,
    },
    multiEntrySectionModal: '.modal[aria-hidden=false]',
    longTextInputArea: 'div div[contenteditable=true]',
    shortTextInputArea: 'div input',
    allLocationSearchResults: '.location-result',
    addApplicantModal: 'div.applicant-modal-body',
    mapPointMarker: `[aria-label="Map marker"]`,
    primaryLocationSection: `[data-test="primary-location-group"]`,
    locationSummary: '.location-summary .location',
    autofillField: 'div[id*=customField]',
    locationDropdownBtn: `[data-test='primary-location-group'] .dropdown-toggle`,
    dropdownMenuChangeLocation: `[data-test-attribute='change-location']`,
    mapSearchBox: '.mapboxgl-ctrl-geocoder--input',
    mapSearchSuggestions: '.suggestions-wrapper',
  };

  async clickSaveDraftButton() {
    await this.page.click(this.elements.saveDraftButton);
    baseConfig.citTempData.recordId = this.page.url().split('/').pop();
  }

  async startDraftRecordFor(
    departmentName: string,
    recordType = baseConfig.citTempData.recordTypeName,
  ) {
    const navPage = new NavigationBarPage(this.page);
    await navPage.validateOpenGovLogoVisibility(true);
    const selectRecordTypePage = await navPage.clickCreateRecordButton();
    await selectRecordTypePage.recordTypeSelectionPageIsVisible();
    await selectRecordTypePage.selectDepartment(departmentName);
    await selectRecordTypePage.selectRecordType(recordType);
    await this.createRecordPageIsVisible();
  }

  async createRecordPageIsVisible() {
    await expect(
      this.page.locator(this.elements.submitRecordButton),
    ).toBeVisible();
  }

  async selectDepartment(dptName: string) {
    await this.page.click(this.elements.departmentDropdownToggle);
    await this.page
      .locator(this.elements.departmentOptions, {hasText: dptName})
      .click();
  }

  async selectRecordByName(rcName: string, exactMatch = false) {
    await this.page.locator(this.elements.recordNameSearch).fill(rcName);
    const recordTypeElement = exactMatch
      ? this.page.locator(`${this.elements.recordTypes} >> text="${rcName}"`)
      : this.page.locator(this.elements.recordTypes, {hasText: rcName});
    await recordTypeElement.click();
  }

  async saveRecord(status = 'Active') {
    await this.page.click(this.elements.submitRecordButton);
    await this.page.waitForURL('**/explore/records/**');
    await expect(
      this.page.locator(this.elements.submitRecordButton),
    ).toBeHidden();
    await this.recordPage.validateRecordStatus(status);
    let recordNumber = await this.page
      .locator(this.elements.recordNumber)
      .innerText();
    expect(recordNumber).not.toBeNull();
    recordNumber = recordNumber.replace(/\s\s+/g, ' ');
    baseConfig.citTempData.recordName = recordNumber.trim();
    await this.storeRecordIdFromURL();
    return recordNumber.trim();
  }

  async searchAndSelectApplicant(
    applicantName: string,
    applicantEmail: string,
  ) {
    await this.clickAddApplicantBtn();
    await this.searchForUser(applicantName);

    const applicantSelect =
      this.elements.searchAndSelectButton.selector(applicantEmail);
    await this.page.click(applicantSelect);
  }

  async clickAddLocationBtn() {
    await this.page.click(this.elements.addLocationButton);
  }

  async searchAndSelectLocation(locationAddress: string) {
    await this.clickAddLocationBtn();
    await this.page.click(this.elements.locationSearchBox, {delay: 500});
    await this.page.fill(this.elements.locationSearchBox, locationAddress, {
      strict: false,
    });
    await this.page.click(
      this.elements.locationSearchResults.selector(locationAddress),
      {delay: 500},
    );
    await this.page.click(this.elements.confirmLocationButton, {delay: 500});
  }

  async addApplicantToRecord(applicantName: string, applicantEmail: string) {
    await this.searchAndSelectApplicant(applicantName, applicantEmail);
    await expect(
      this.page.locator(this.elements.recordApplicantEmailLink),
    ).toContainText(applicantEmail);
  }

  async addLocationToRecord(locationAddress: string) {
    await this.searchAndSelectLocation(locationAddress);
    await expect(
      this.page.locator(this.elements.recordLocationAddressLink),
    ).toContainText(locationAddress.split(',')[0]);
  }

  async renewRecordGetID() {
    await this.page.click(this.elements.submitRecordButton);
    const recordID = await this.page
      .locator(this.elements.recordNumber)
      .textContent();
    return recordID.replace('Renewal', '').trim();
  }

  async searchAndSelectPointLocation(locationAddress: string) {
    const pointLocationSearch = this.elements.pointOnMapBtn;
    const pointLocationSelect = this.elements.pointLocationSearchResults;
    await this.page.click(pointLocationSearch);
    await this.page.fill(this.elements.pointLocationSearchBox, locationAddress);

    await this.page.click(pointLocationSelect);
    await this.page.click(this.elements.selectPointLocationBtn);
  }

  async createAndSelectPointLocation(locationName: string) {
    await this.clickAddLocationBtn();
    const pointLocationSearch = this.elements.pointOnMapBtn;
    await this.page.click(pointLocationSearch);
    // .moveToElement(".mapboxgl-canvas", 38.926816, -77.193156) // 900 is X offset
    // .mouseButtonClick(0)
    await this.page.click('.mapboxgl-canvas', {
      position: {x: 38.926816, y: 77.193156},
    });
    /* todo .. Mahesh Check why is this*/
    await this.page.click(this.elements.selectPointLocationBtn);
    await this.page.click(this.elements.pointLocationAdded);
    await this.page.click(this.elements.locationNameLink);
    await this.page.fill(this.elements.locationNameTextbox, locationName);
    await this.page.click(this.elements.saveLocationEditForm);
    await this.page.click(this.elements.confirmLocationEditForm);
    await this.page.goBack();
    await expect(
      this.page.locator(this.elements.pointLocationAdded),
    ).toContainText(locationName);
  }

  async createRecordWithURLParam(
    formField: string,
    ffValue: string,
    formField2 = '',
    ffValue2 = '',
  ) {
    let firstFFid: string;
    let secondFFid: string;
    let createRecordURL = '';
    let loginPageVisible = false;
    switch (formField) {
      case 'Number':
        firstFFid = '29610';
        break;
      case 'Short Text':
        firstFFid = '29611';
        break;
      case 'Calc Number':
        firstFFid = '29632';
        break;
      case 'Multi Number':
        firstFFid = '29623';
        break;
      default:
        throw new Error(`'${formField}' is not a valid param`);
    }
    if (formField2 !== '') {
      secondFFid = formField2 === 'Number' ? '29610' : '29611';
      createRecordURL = `&ffid${secondFFid}=${ffValue2}`;
    }
    await this.page.goto(
      `${baseConfig.employeeAppUrl}` +
        `/#/prepare-record/9271?ffid${firstFFid}=${ffValue}${createRecordURL}`,
    );
    loginPageVisible = await this.page
      .locator(this.elements.loginPage)
      .isVisible();
    if (loginPageVisible) {
      await this.loginPage.loginAsAdmin();
    }
    await this.waitForVisibility(this.elements.createRecordForm);
  }

  async updateGivenFormFieldText(fieldName: string, inputValue: string) {
    const inputFormField = this.elements.formFieldValue.selector(fieldName);
    await this.page.fill(inputFormField, '');
    await this.page.fill(inputFormField, inputValue);
  }

  async validateRecordParams(dataTable: any) {
    const paramValues = await dataTable.raw();
    for (const element of paramValues) {
      const param = await element;
      const elemAttribute = await this.page
        .locator(this.elements.formFieldValue.selector(param[0]))
        .getAttribute('value');
      expect(elemAttribute).toEqual(param[1]);
    }
  }

  async validateErrorBanner(dataTable: any) {
    const paramValues = await dataTable.raw();
    for (const element of paramValues) {
      const param = await element;
      await this.createRecordWithURLParam(param[0], param[1]);
      await expect(
        this.page.locator(this.elements.warningBanner),
      ).toBeVisible();
      await expect(
        this.page.locator(this.elements.warningBannerMessage),
      ).toContainText(param[2]);
    }
  }

  async addSegmentLocationType(startingPoint: string, endpoint: string) {
    /* - timeouts : Await expects are also very very flaky .. runs too fast and in same page so does not work consistently*/
    await this.selectSegmentLocationType();
    await this.chooseSegmentLocationPoint('starting', startingPoint);
    await this.page.waitForTimeout(800);
    await this.chooseSegmentLocationPoint('ending', endpoint);
    await this.page.waitForTimeout(800);
    await this.confirmSelectedSegmentLocation();
  }

  async addAddressLocationType(address: string) {
    /* - timeouts : Await expects are also very very flaky .. runs too fast and in same page so does not work consistently*/
    await this.page.click(this.elements.addressLocationType);
    await this.page.fill(this.elements.locationSearchInput, address);
    await this.page.waitForSelector(
      this.elements.locationSearchInputResultRow.selector(address),
    );
    await this.page.waitForTimeout(800);
    await this.page.click(
      this.elements.locationSearchInputResultRow.selector(address),
    );
    await this.page.waitForTimeout(800);
    await this.page.click(this.elements.locationSearchInputResultConfirm);
  }

  async addPointOnMapLocationType(address: string) {
    /* - timeouts : Await expects are also very very flaky .. runs too fast and in same page so does not work consistently*/
    await this.page.click(this.elements.pointOnMapLocationType);
    await this.page.fill(this.elements.pointOnMapSearchInput, address);
    await this.page.waitForSelector(
      this.elements.pointOnMapSearchInputResultRow.selector(address),
    );
    await this.page.waitForTimeout(500);
    await this.page.click(
      this.elements.pointOnMapSearchInputResultRow.selector(address),
    );
    await this.page.waitForTimeout(500);
    await this.page.click(this.elements.locationSearchInputResultConfirm);
  }

  async storeRecordIdFromURL() {
    const regexp = new RegExp(/explore\/records\/(\d+)/g);
    await this.page.waitForURL('**/explore/records/**');
    const url = this.page.url();
    baseConfig.citTempData.recordId = regexp.exec(url)[1];
    console.debug('Record ID on save: ', baseConfig.citTempData.recordId);
  }

  async verifyFileWithNameWasAdded(fileName: string) {
    await expect(
      this.page.locator(this.elements.uploadedFileName),
    ).toContainText(fileName);
  }

  async verifyAttachmentWasUploaded(formField: string, attName: string) {
    await expect(
      this.page.locator(
        this.elements.uploadedAttachmentName.selector(formField),
      ),
    ).toContainText(attName);
  }

  async uploadAttachmentWithSlashInName() {
    await this.page.setInputFiles(
      this.elements.addNewAttachmentInput,
      `${resolve(process.cwd())}/src/resources/plc/sample_:_slash.png`,
    );
  }

  async verifyUploadAttachmentModalText(fileName: string) {
    const modalText = `File ${fileName} has an invalid filename!\nPlease only use a-z, A-Z, 0-9, !, -, _, ., *, ', (, ), and spaces`;
    await expect(
      this.page.locator(this.elements.addNewAttachmentModal),
    ).toContainText(modalText);
  }

  async selectAddressLocation(locationAddress: string) {
    const locationSearch = this.elements.locationSearchBox;
    const locationSelect =
      this.elements.locationSearchResults.selector(locationAddress);
    const confirmLocationButton = this.elements.confirmLocationButton;
    await this.page.click(locationSearch);
    await this.page.fill(locationSearch, locationAddress);
    await this.page.click(locationSelect);
    await this.page.click(confirmLocationButton);
  }

  async clickOnSaveRecordButton() {
    await this.page.click(this.elements.submitRecordButton);
    await this.storeRecordIdFromURL();
  }

  async clickAddApplicantBtn() {
    await this.page.click(this.elements.addApplicationButton);
  }

  async createAndAddRandomApplicant(userInfo: UserInfo) {
    await this.clickAddApplicantBtn();
    await this.page.fill(this.elements.applicantEmailAddress, userInfo.email);
    await this.page.fill(this.elements.applicantFirstName, userInfo.firstName);
    await this.page.fill(this.elements.applicantLastName, userInfo.lastName);
    await this.page.fill(
      this.elements.applicantPhoneNumber,
      userInfo.phoneNumber,
    );
    await this.page.fill(this.elements.applicantAddress1, userInfo.address);
    await this.page.fill(this.elements.applicantCity, userInfo.city);
    await this.page.fill(this.elements.applicantState, userInfo.state);
    await this.page.fill(this.elements.applicantZipCode, userInfo.zipCode);
    await this.page.click(this.elements.createApplicant);
    await expect(this.page.locator(this.elements.createApplicant)).toBeHidden();
    await expect(
      this.page.locator(this.elements.createRecordApplicantModal),
    ).toBeHidden();
    await expect(
      this.page.locator(this.elements.recordApplicantEmailLink),
    ).toContainText(userInfo.email);
  }

  async openNewMultiEntrySection(sectionName: string) {
    await this.clickElementWithText(
      this.elements.addMultiEntrySection,
      sectionName,
    );

    const saveButtonElement = this.page
      .locator(this.elements.multiEntrySectionModal, {hasText: sectionName})
      .locator(this.elements.saveMultiEntrySection);
    await expect(saveButtonElement).toBeVisible();
  }

  async saveMultiEntrySection() {
    const dialogElement = this.page.locator(
      this.elements.multiEntrySectionModal,
    );
    const saveButtonElement = dialogElement.locator(
      this.elements.saveMultiEntrySection,
    );
    await saveButtonElement.click();
    await expect(dialogElement).toBeHidden();
  }

  async toggleFormGroupCheckbox(name: string) {
    await this.page.click(this.elements.formGroupCheckbox.selector(name));
  }

  async fillTextFormField(
    fieldName: string,
    fieldValue: string,
    entryType: 'single' | 'multi' = 'single',
  ) {
    if (entryType === 'single') {
      await this.page
        .locator(
          `//div[contains(@class, "form-group")]/label[text() = "${fieldName}"]/following-sibling::div/input`,
        )
        .type(fieldValue);
    } else {
      await this.page
        .locator(this.elements.multiEntrySectionModal)
        .locator(
          `//label[(@for = "${fieldName}")]/following-sibling::div/div/input`,
        )
        .type(fieldValue);
    }
  }

  async searchForUser(applicantName: string) {
    await this.page.click(this.elements.applicantSearchBox);
    await this.page.fill(this.elements.applicantSearchBox, applicantName);
  }

  async waitTillSearchSpinnerDisappears() {
    const spinnerElement = this.page
      .locator(this.elements.addApplicantModal, {
        has: this.page.locator('div', {
          has: this.page.locator(this.elements.applicantSearchBox),
        }),
      })
      .locator('div', {hasText: 'Searching...'});
    await expect(spinnerElement).toBeHidden();
  }

  async selectSegmentLocationType() {
    await this.page.click(this.elements.segmentLocationType);
  }

  async putPointOnMap(coordinates = {x: 200, y: 200}) {
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

  async chooseSegmentLocationPoint(
    type: 'starting' | 'ending',
    address: string,
  ) {
    const initialNumberOfMapMarkers = (await this.page
      .locator(this.elements.mapPointMarker)
      .isVisible())
      ? 1
      : 0;

    type === 'starting'
      ? await this.page.fill(this.elements.segmentStartingLocation, address)
      : await this.page.fill(this.elements.segmentEndingLocation, address);

    await this.page.waitForSelector(this.elements.segmentLocationResult);
    await this.page.waitForTimeout(1000);
    await this.page.click(this.elements.segmentLocationResult);

    // It can be the 1st or the 2nd marker on the map
    initialNumberOfMapMarkers === 0
      ? await this.page.waitForSelector(this.elements.mapPointMarker)
      : await this.page.waitForFunction(
          `document.querySelectorAll('${this.elements.mapPointMarker}').length > 1`,
        );
  }

  async confirmSelectedSegmentLocation() {
    await this.page.click(this.elements.confirmSegmentLocationBtn);
  }

  async verifyAddedPrimaryLocation(label: RegExp) {
    expect(
      (
        await this.page
          .locator(this.elements.primaryLocationSection)
          .locator(this.elements.locationSummary)
          .textContent()
      ).trim(),
    ).toMatch(label);
  }

  /**
   * Search and selects autofill data during record creation.
   *
   * @param searchFor         Put this to the search bar
   * @param selectEntry       Select this string from the search results
   */
  async searchForAutofillData(searchFor: string, selectEntry: string) {
    const section = this.page.locator('#create-record-form');
    await section.locator('role=searchbox[name="Search..."]').fill(searchFor);

    await section
      .locator('.searchResultsContainer')
      .locator('div.resultRow h5', {
        hasText: selectEntry,
      })
      .click();
  }

  /**
   * Verify automatically filled data is present in a form field based on Autofill entry.
   *
   * @param formSectionName   Form section label where the Autofill option is enabled
   * @param fieldLabel        Form field which should be automatically filled
   */
  async verifyAutomaticallyFilledFormField(
    formSectionName: string,
    fieldLabel: string,
  ) {
    const section = this.page.locator('div.row', {
      has: this.page.locator(`h4 >> text="${formSectionName}"`),
    });

    const fieldValue = section
      .locator(this.elements.autofillField, {
        has: this.page.locator(`label >> text="${fieldLabel}"`),
      })
      .locator('input');

    // To wait for any value appears in the field
    const fieldValueId = await fieldValue.getAttribute('id');
    await this.page.waitForFunction(
      `document.querySelector('#${fieldValueId}').value`,
    );

    // Value changes from time to time
    expect(await fieldValue.inputValue()).not.toEqual('');
  }

  async clickChangeLocation() {
    await this.page.click(this.elements.locationDropdownBtn);
    await this.page.click(this.elements.dropdownMenuChangeLocation);
  }

  async searchOnMap(text: string) {
    await this.page.locator(this.elements.mapSearchBox).fill('');
    await this.page.locator(this.elements.mapSearchBox).type(text);

    // Click on the first suggestion
    const suggestionsElement = this.page
      .locator(this.elements.mapSearchSuggestions)
      .locator('li');
    await expect(suggestionsElement.first()).toContainText(text);
    await suggestionsElement.first().click();
    await this.page.waitForTimeout(3000); // The map will slowly move the layer
  }
}
