import {faker} from '@faker-js/faker';
import retry from 'async-retry';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {DocumentDesignerPage} from './document-designer-page';
import {NavigationBarPage} from '../navigation-bar-page';
import {expect} from '../../base/base-test';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';

export class RecordTypesSettingsPage extends BaseCitPage {
  readonly elements = {
    recordTypesButton: '#settings-recordtypes-btn h4',
    recordType: 'td .pull-left',
    formTab: '#record-settings-form',
    organizationSettingTab: '#settings-organization-btn',
    /*Su settings*/
    gisSettingTab: '#settings-gis-btn',
    repairUserSettingTab: 'a[href="#/settings/system/repair-users"]',
    integrationTypesSettingTab: '#settings-integrations-btn',
    repairUsersSettingTab:
      '//a[contains(@href, "repair-users")]//h4[contains(.,"Repair Users")]',
    templateStoreSettingTab: '#settings-templates-btn',
    sourceDbDropdown: '#sourceDBSelector',
    sourceDepartmentDropdown: '#sourceDepartmentFilter',
    importButton: '#importRecordTypeButton',
    newDepartmentDropdownForImportedRt: '#newWSICDropdownValueSelector',
    /*Su settings end*/
    recordSettingsAccessButton: '#record-settings-access',
    allEmployeesAccessDropdown: '#dropdown_allEmployees',
    accessOption: '#dropdown_allEmployees option',
    noAccessDropdownOption: '#dropdown_allEmployees option[value="0"]',
    canViewDropdownOption: '#dropdown_allEmployees option[value="1"]',
    canEditDropdownOption: '#dropdown_allEmployees option[value="2"]',
    canAdministerDropdownOption: '#dropdown_allEmployees option[value="3"]',
    appUserDetail: {
      selector: (appName: string) =>
        `[data-test-attribute="app-user-details-${appName}"]`,
    },
    appAccessDropdown: {
      selector: (appName: string) =>
        `[data-test-attribute="app-user-current-access-${appName}"] select`,
    },
    noAppInstall: '[data-test-attribute="no-app-user-found"]',
    searchRecordTypeInput: '#search-todo',
    checkAccessPlaceholder: '#dropdown_allEmployees',
    departmentDropdown: '.clearfix .dropdown-toggle',
    departmentDropdownOptions: '.open li a',
    tableElementDepartment1: 'tbody tr:nth-child(1) td:nth-child(2)',
    tableElementDepartment2: 'tbody tr:nth-child(2) td:nth-child(2)',
    tableElementDepartment3: 'tbody tr:nth-child(3) td:nth-child(2)',
    tableElementName1: 'tbody tr:nth-child(1) td:nth-child(1)',
    tableElementName2Col1: 'tbody tr:nth-child(2) td:nth-child(1) a',
    tableElementName2: 'tbody tr:nth-child(2) td:nth-child(1)',
    addRecordType: '#add-record-type-btn',
    addRecordTypeName: '#addRecordTypeName',
    createRecordType: '.modal-footer .btn-primary',
    copyRecordType: '.svg-copy',
    confirm: '.btn-danger',
    deleteRecordType: '.svg-trash',
    noRecordLabel: '.center-vertical',
    publishRecord: '#publish-record-btn',
    publishRecordModal: '.modal-dialog .btn.bootbox-accept',
    revertToDraft: '#revert-to-draft-btn',
    revertToDraftModalAcceptButton: '.modal-dialog .btn.bootbox-accept',
    applicantON: '#attach-applicant-id .bootstrap-switch-on',
    applicantOff: '#attach-applicant-id .bootstrap-switch-off',
    locationOn: 'div.bootstrap-switch-on',
    locatinOff: '.bootstrap-switch-off',
    departmentChangeDropdown: '#select-dept-dropdown',
    departmentChangeOption: '#select-dept-dropdown option:nth-child(4)',
    numericBasic: '#num-pattern-basic',
    numericAnual: '#num-pattern-annual',
    numericPrefix: '#num-pattern-prefixed input',
    numericAnPr: '#num-pattern-annual-prefixed',
    prefixField: '#prefixfield',
    recordChangeName: '#record-name',
    recordTypeNameHeader: '.container-lg h3 span',
    recordTabNameHeader: '.panel-heading h4',
    tableElementsDepartment: 'table.table.width-auto',
    tableRowsDepartment: 'table.table.width-auto tbody tr',
    recordForDepartment: '#recordsType',
    departmentDropdownItems: '#addRecordTypeForm .dropdown div',
    annualNumberingPattern: '#num-pattern-annual input',
    nextNumberAvailable: '.m-b-20',
    recordPrefix: '#prefixfield',
    setRecordPrefixBtn: '.input-group-btn button',
    confirmChangePrefixBtn: '.bootbox-accept',
    prefixedNumberingPattern: '#num-pattern-prefixed',
    basicNumberingPattern: '#num-pattern-basic input',
    annualPrefixedNumberingPattern: '#num-pattern-annual-prefixed input',
    prefixNotSet: '.col-sm-14 h5',

    attachmentsTab: '#record-settings-attachments',
    locationsTab: '#record-settings-locations',
    workflowTab: '#record-settings-workflow',
    feesTab: '#record-settings-fees',
    renewalTab: `//a[normalize-space()='Renewal']`,
    newAttachmentForm: '//form[@id="newAttachmentForm"]',
    appAccessSection: '[data-test-attribute="app-user-access-controll"]',
    documentsTab: '#record-settings-documents',
    documentsTabDocumentLink: {
      selector: (docId: number, docName: string) =>
        `//a[@href="#/settings/docTemplate/${docId}"]//h5[contains(.,"${docName}")]`,
    },

    documentsTabDocumentTitleInput: `//div[label[contains(.,"Document Name")]]/input`,
    saveDocumentBtn: `//button[contains(.,"Save")]`,
    backToRecTypeButton: {
      selector: (recTypeId: string) =>
        `[href="#/settings/system/record-types/${recTypeId}/documents"]`,
    },
    addDocumentBtn: '#add-doc-btn',
    documentTitle: '#docTitle',
    createDocumentBtn: '#create-doc-btn',
    documentCreated: '.col-md-6',
    createdDocumentTitle: 'a[href*=docTemplate]:nth-child(2)',
    documentTemplate: 'div.container div.container',
    mergeTag: {
      selector: (tagName) =>
        `//h4[text() = "${tagName}"]/following-sibling::ul[1]`,
    },
    formFieldMergeTags: {
      selector: (formField) =>
        `//h4[contains(text(),'${formField}')]/following-sibling::ul[1]`,
    },
    feeLabel: '[href*=feeDesigner]',
    addFeeBtn: '#add-fee-btn',
    feeLabelInput: '#feeLabel',
    feeAccountNumber: '#accountNo',
    createFeeBtn: '#create-fee-btn',
    feeTable: '.panel-body',
    addressLocationCheckBox: '#allowAddressLocations_checkbox',
    pointLocationCheckBox: '#allowPointLocations_checkbox',
    segmentLocationCheckbox: '#allowSegmentLocations_checkbox',
    additionalLocationCheckBox: '#allowAdditionalLocations_checkbox',
    attachLocationCheckBox: '#attach-location',
    addressLocationHelpText: '#address-location-help-text',
    pointLocationHelpText: '#point-location-help-text',
    segmentLocationHelpText: '#segment-location-help-text',
    recordTypesHelpText: 'label.activity-link',
    activitySettingsButton: '#settings-activity-btn',
    renewsSwitch: 'input[name="renews"]',
    removeField: {
      selector: (numberToRemove = 1) =>
        `(//*[@data-hint="Remove Field"])[${numberToRemove}]`,
    },
    deActivate: `//button[contains(.,"Deactivate")]`,
  };

  async proceedToRecordTypeByUrl(
    recordTypeName: string,
    page: TabList = 'General',
  ) {
    const recordTypeId = RecordTypeNames.find(
      (k) => k.name === recordTypeName,
    ).id;
    await this.proceedToRecordTypeById(recordTypeId, page);
  }

  async proceedToRecordTypes() {
    await this.page.click(this.elements.recordTypesButton);
  }

  async proceedToRecordTypeById(
    recordTypeID: string,
    page: TabList = 'General',
  ) {
    await this.page.goto(
      `${
        baseConfig.employeeAppUrl
      }/#/settings/system/record-types/${recordTypeID}/${page.toLowerCase()}`,
    );
    if (page === 'Form') return;
    await this.elementContainsText(this.elements.recordTabNameHeader, page);
  }

  async proceedToRecordTypeRenewalById(recordTypeID: string) {
    await this.proceedToRecordTypeById(recordTypeID, 'Renewal');
  }

  async proceedToRecordType(recordTypeName: string) {
    await this.proceedToRecordTypes();
    await this.setNameFilter(recordTypeName);
    await this.page.locator(this.elements.recordType).first().click();
  }

  async clickPermissionsSettingButton() {
    await this.page.click(this.elements.recordSettingsAccessButton);
  }

  async setRecordPermission(permission: EmployeePermission) {
    await this.page.click(this.elements.allEmployeesAccessDropdown);
    switch (permission) {
      case EmployeePermission.Administer:
        await this.page.click(this.elements.canAdministerDropdownOption);
        break;
      case EmployeePermission.Edit:
        await this.page.click(this.elements.canEditDropdownOption);
        break;
      case EmployeePermission.NoAccess:
        await this.page.click(this.elements.noAccessDropdownOption);
        break;
      case EmployeePermission.View:
      default:
        await this.page.click(this.elements.canViewDropdownOption);
    }
  }

  async validateActivePermissionSetting(recordPermission: string) {
    await this.elementContainsText(
      this.elements.checkAccessPlaceholder,
      recordPermission,
    );
  }

  async setAppAccessPermission(
    appName: string,
    permission: AppAccessPermission,
  ) {
    switch (permission) {
      case AppAccessPermission.Read:
        await this.page
          .locator(this.elements.appAccessDropdown.selector(appName))
          .selectOption(AppAccessPermission.Read);
        break;
      case AppAccessPermission.ReadWrite:
        await this.page
          .locator(this.elements.appAccessDropdown.selector(appName))
          .selectOption(AppAccessPermission.ReadWrite);
        break;
      case AppAccessPermission.NoAccess:
      default:
        await this.page
          .locator(this.elements.appAccessDropdown.selector(appName))
          .selectOption(AppAccessPermission.NoAccess);
    }
  }

  async validateAppPermissionSetting(
    appName: string,
    recordPermission: string,
  ) {
    await this.waitForVisibility(this.elements.appAccessSection, true);
    let selectedValue: string = null;
    selectedValue = await this.page.$eval<string, HTMLSelectElement>(
      this.elements.appAccessDropdown.selector(appName),
      (e) => e.value,
    );
    expect(selectedValue).toEqual(recordPermission);
  }

  async validateAppUser(appName: string, isVisible = true) {
    if (isVisible)
      await expect(
        this.page.locator(this.elements.appUserDetail.selector(appName)),
      ).toBeVisible();
    else
      await expect(
        this.page.locator(this.elements.appUserDetail.selector(appName)),
      ).toBeHidden();
  }

  async selectDepartmentFilter(dep: string) {
    await this.page.click(this.elements.departmentDropdown);
    await this.clickElementWithText(
      this.elements.departmentDropdownOptions,
      dep,
    );
  }

  async checkDepartmentFilter(dep: string) {
    const rowCount = await this.page
      .locator(this.elements.tableRowsDepartment)
      .count();
    for (let row = 1; row <= rowCount; row++) {
      const tableElementDepartment = `tbody tr:nth-child(${row}) td:nth-child(2)`;
      await this.elementContainsText(tableElementDepartment, dep);
    }
  }

  async setNameFilter(name: string) {
    await this.page.fill(this.elements.searchRecordTypeInput, '');
    await this.page.fill(this.elements.searchRecordTypeInput, name);
  }

  async checkNameFilter(dep: string) {
    await this.elementContainsText(this.elements.tableElementName1, dep);
  }

  async selectRecordType(recordTypeIDArray: string) {
    await this.setNameFilter(`${recordTypeIDArray}`);
    await this.proceedToGeneral();
    await expect(this.page).toHaveURL(/.*general/);
  }

  async setsetupRecordTypeIdForHooks(
    recordTypeIDArray: string,
    isClonedReord = false,
  ) {
    await new NavigationBarPage(this.page).clickAdminSettingsButton();
    await this.proceedToRecordTypes();
    await this.selectRecordType(recordTypeIDArray);
    const recordTypeId = this.page
      .url()
      .toString()
      .replace('/general', '')
      .split('/')
      .pop();
    if (!isClonedReord) {
      baseConfig.citTempData.recordTypeId = recordTypeId;
    } else {
      baseConfig.citTempData.cloneRecordTypeId = recordTypeId;
    }
  }

  async checkNameFilterTextRow2(dep: string) {
    await this.locateWithText(this.elements.tableElementName2Col1, dep);
  }

  async addRecordType(defaultRecordType = faker.random.alphaNumeric(4)) {
    const name = `plc_${defaultRecordType}`;
    await this.page.click(this.elements.addRecordType);
    await this.page.fill(this.elements.addRecordTypeName, name);
    await this.page.click(this.elements.createRecordType);
    await this.setNameFilter(name);
    await this.setsetupRecordTypeIdForHooks(name);
    await new NavigationBarPage(this.page).clickAdminSettingsButton();
    await this.proceedToRecordTypes();
    await this.setNameFilter(name);
    return name;
  }

  async checkRecordTypeCreated() {
    await this.elementVisible(this.elements.tableElementName1);
    await this.elementNotVisible(this.elements.tableElementDepartment3);
  }

  async copyRecordType(
    originalRecordName: string,
    expectedCopiedRecordName: string,
  ) {
    await this.page.click(this.elements.copyRecordType);
    await this.page.click(this.elements.confirm);
    await this.checkRecordTypeCopy();
    await this.setsetupRecordTypeIdForHooks(expectedCopiedRecordName, true);
    await new NavigationBarPage(this.page).clickAdminSettingsButton();
    await this.proceedToRecordTypes();
    await this.setNameFilter(originalRecordName);
  }

  async checkRecordTypeCopy() {
    await this.elementVisible(this.elements.tableElementName2);
    await this.elementNotVisible(this.elements.tableElementDepartment3);
  }

  async deleteRecordType(failIfNotExists = true) {
    const result = await this.page
      .locator(this.elements.deleteRecordType)
      .isVisible();
    const flag = !failIfNotExists && !result;
    if (flag) return;
    await this.page.click(this.elements.deleteRecordType);
    await this.page.click(this.elements.confirm);
    await this.verifyDeletedRecordType();
  }

  async verifyDeletedRecordType() {
    await this.elementNotVisible(this.elements.tableElementName1);
    await this.elementNotVisible(this.elements.tableElementDepartment1);
    await this.elementVisible(this.elements.noRecordLabel);
  }

  async publishRecordType() {
    await this.page.click(this.elements.recordType);
    await this.elementVisible(this.elements.recordSettingsAccessButton);
    await retry(
      async () => {
        const regexp = new RegExp(/system\/record-types\/(\d+)\/general/g);
        const url = this.page.url();
        const recordTypeId = regexp.exec(url); // Array or null
        if (recordTypeId) {
          baseConfig.citTempData.recordTypeId = recordTypeId[1];
        } else {
          throw new Error('Page is not fully loaded. ID was not found.');
        }
        console.log(
          `Saved record type ID: ${baseConfig.citTempData.recordTypeId}`,
        );
      },
      {
        retries: 5,
        maxTimeout: 2000,
      },
    );
    await this.elementContainsText(this.elements.publishRecord, 'Publish');
    await this.page.click(this.elements.publishRecord);
    await this.page.click(this.elements.createRecordType);
    await this.elementContainsText(
      this.elements.revertToDraft,
      'Revert To Draft',
    );
  }

  async proceedToGeneral() {
    await this.page.click(this.elements.recordType);
  }

  async disallowAttachingIdentity() {
    await this.page.click(this.elements.applicantON);
    await this.elementVisible(this.elements.applicantOff);
    await this.elementNotVisible(this.elements.applicantON);
  }

  async disallowAttachingLocation() {
    await this.page.click(this.elements.locationOn);
    await this.elementVisible(this.elements.locatinOff);
    await this.elementNotVisible(this.elements.locationOn);
  }

  async changeDepartment(label: string) {
    await this.page
      .locator(this.elements.departmentChangeDropdown)
      .selectOption({label: label});
  }

  async setNumberingPrefix(prefix: string) {
    await this.page.locator(this.elements.prefixField).fill(prefix);
    await this.page.locator(this.elements.setRecordPrefixBtn).click();
    await this.page.locator(this.elements.publishRecordModal).click();
  }

  async checkNumberingPattern() {
    await this.allElementsVisible([
      this.elements.locatinOff,
      this.elements.numericAnPr,
      this.elements.numericAnual,
      this.elements.numericBasic,
      this.elements.numericPrefix,
    ]);
    await this.page.click(this.elements.numericPrefix);
    await this.elementVisible(this.elements.prefixField);
  }

  async changeName(recordTypeName: string) {
    await this.page.fill(this.elements.recordChangeName, recordTypeName);
  }

  async checkName(recordTypeName: string) {
    await this.elementContainsText(
      this.elements.recordTypeNameHeader,
      recordTypeName,
    );
  }

  async addRecordTypeForDepartment() {
    const name = `plc_${faker.random.alphaNumeric(4)}`;
    await this.page.click(this.elements.addRecordType);
    await this.page.fill(this.elements.addRecordTypeName, name);
    await this.page.click(this.elements.recordForDepartment);
    await this.clickElementWithText(
      this.elements.departmentDropdownItems,
      baseConfig.citTempData.departmentNameText,
    );
    await this.page.click(this.elements.createRecordType);
    await this.setNameFilter(name);
  }

  async selectNumberingPattern(pattern: string) {
    let patternToSelect;
    switch (pattern) {
      case NumberingPattern.Basic:
        patternToSelect = this.elements.basicNumberingPattern;
        break;

      case NumberingPattern.Annual:
        patternToSelect = this.elements.annualNumberingPattern;
        break;

      case NumberingPattern.Prefixed:
        patternToSelect = this.elements.numericPrefix;
        break;

      case NumberingPattern.AnnualPrefixed:
        patternToSelect = this.elements.annualPrefixedNumberingPattern;
        break;

      default:
        break;
    }
    await this.page.click(patternToSelect);
  }

  async validateNextAvailableNumber(prefix: string) {
    if (prefix !== 'none') {
      await this.elementContainsText(this.elements.nextNumberAvailable, prefix);
    }
    baseConfig.citTempData.recordName = await this.getElementText(
      this.elements.nextNumberAvailable,
    );
    console.info(
      'client.globals.temp.plc.recordName is: ',
      baseConfig.citTempData.recordName,
    );
  }

  async setRecordPrefix(prefix: string) {
    await this.page.fill(this.elements.recordPrefix, prefix);
    const result = this.page
      .locator(this.elements.setRecordPrefixBtn)
      .getAttribute('disabled');
    if (result) {
      const text = await this.getElementText(this.elements.nextNumberAvailable);
      if (!text.includes(prefix)) {
        throw new Error('Error in setting the prefix!');
      }
    } else {
      await this.page.click(this.elements.setRecordPrefixBtn);
      await this.page.click(this.elements.confirmChangePrefixBtn);
    }
  }

  async proceedToAttachmentsTab() {
    await this.page.click(this.elements.attachmentsTab);
  }

  async proceedToLocationTab() {
    await this.page.click(this.elements.locationsTab);
  }

  async proceedToWorkflowTab() {
    await this.page.click(this.elements.workflowTab);
  }

  async proceedToRenewalTab() {
    await this.page.click(this.elements.renewalTab);
  }

  async proceedToDocumentTab(): Promise<DocumentDesignerPage> {
    await this.page.click(this.elements.documentsTab);
    return new DocumentDesignerPage(this.page);
  }

  /* Edit Documents */
  async clickOnGivenDocInDocsTab(docId: number, docName: string) {
    await this.page.click(
      this.elements.documentsTabDocumentLink.selector(docId, docName),
    );
  }

  async updateDocumentTitle(title: string) {
    await this.page.fill(this.elements.documentsTabDocumentTitleInput, title);
  }

  async saveDocument() {
    await this.page.click(this.elements.saveDocumentBtn);
    await this.page.waitForTimeout(
      700,
    ); /* Saving takes a sec or so else need to optionally confirm save changes */
  }

  async backToRecType(recTypeId = baseConfig.citTempData.recordTypeId) {
    await this.page.click(
      this.elements.backToRecTypeButton.selector(recTypeId),
    );
  }

  /* Edit Documents End */

  async addDocumentTemplate(docTitle: string) {
    await this.page.click(this.elements.addDocumentBtn);
    await this.page.fill(this.elements.documentTitle, docTitle);
    await this.page.click(this.elements.createDocumentBtn);
    await this.elementVisible(this.elements.documentCreated);
  }

  async addFeesToRecordType(feeLabel: string) {
    await this.page.click(this.elements.addFeeBtn);
    await this.page.fill(this.elements.feeLabelInput, feeLabel);
    await this.page.click(this.elements.createFeeBtn);
    await this.elementVisible(this.elements.feeTable);
  }

  async selectDocumentTemplate() {
    await this.page.click(this.elements.createdDocumentTitle);
    await this.elementVisible(this.elements.documentTemplate);
  }

  async validateDataMergeTagsOnDocTemplate(mergeTagsDataTable: any) {
    const mergeTags = await mergeTagsDataTable.raw();
    let mergeElement;
    for (const element of mergeTags) {
      const tagName = await element;
      if (
        tagName[0] === 'Form Details' ||
        tagName[0] === 'Multi Entry Section Entries' ||
        tagName[0] === 'Multi Entry Sections' ||
        tagName[0] === 'Fees'
      )
        mergeElement = this.elements.formFieldMergeTags.selector(tagName[0]);
      else mergeElement = this.elements.mergeTag.selector(tagName[0]);
      await this.elementVisible(mergeElement);
    }
  }

  async isChecked(locator: string) {
    return (
      await this.page
        .locator(locator)
        .locator('.bootstrap-switch')
        .getAttribute('class')
    ).includes('bootstrap-switch-on');
  }

  async isLocationCheckboxDisabled(location: LocationType, isDisabled = true) {
    let locationOption: string;
    switch (location) {
      case 'Address':
        locationOption = this.elements.addressLocationCheckBox;
        break;
      case 'Point':
        locationOption = this.elements.pointLocationCheckBox;
        break;
      case 'Segment':
        locationOption = this.elements.segmentLocationCheckbox;
        break;
      case 'Additional':
        locationOption = this.elements.additionalLocationCheckBox;
        break;
      case 'Primary':
        locationOption = this.elements.attachLocationCheckBox;
        break;
      default:
        throw new Error('Unsupported Location Type');
    }
    expect(
      await this.isChecked(locationOption),
      `${location} Switch`,
    ).not.toEqual(isDisabled);
  }

  async isDisabled(locator: string) {
    const result = await this.page.locator(locator).getAttribute('disabled');
    return !!result;
  }

  async selectLocation(location: LocationType, expectedStatus = true) {
    let locationOption: string;
    switch (location) {
      case 'Address':
        locationOption = this.elements.addressLocationCheckBox;
        break;
      case 'Point':
        locationOption = this.elements.pointLocationCheckBox;
        break;
      case 'Segment':
        locationOption = this.elements.segmentLocationCheckbox;
        break;
      case 'Additional':
        locationOption = this.elements.additionalLocationCheckBox;
        break;
      case 'Primary':
        locationOption = this.elements.attachLocationCheckBox;
        break;
      default:
        break;
    }
    if (expectedStatus !== (await this.isChecked(locationOption))) {
      await this.page.click(`${locationOption} .bootstrap-switch`);
    }
    expect(await this.isChecked(locationOption)).toEqual(expectedStatus);
  }

  async validateHelpTextSize(location: LocationType, size: number) {
    const actualInput = 'a'.repeat(200);
    let helpText: string;
    await this.selectLocation(location);
    switch (location) {
      case 'Address':
        helpText = this.elements.addressLocationHelpText;
        break;
      case 'Point':
        helpText = this.elements.pointLocationHelpText;
        break;
      case 'Segment':
        helpText = this.elements.segmentLocationHelpText;
        break;
      default:
        break;
    }
    expect(this.isDisabled(helpText)).toBeTruthy();
    await this.page.fill(helpText, actualInput);
    await this.page.keyboard.type('Tab');
    const result = await this.page.locator(helpText).getAttribute('value');
    expect(result.length).toEqual(size);
  }

  async verifyHelpTextForLocationTypes(helpText: string) {
    const result = await this.getElementText(this.elements.recordTypesHelpText);
    expect(result).toEqual(helpText);
  }

  async proceedToActivitySettingsPage() {
    await this.page.click(this.elements.activitySettingsButton);
  }

  async proceedToFormTab() {
    await this.page.click(this.elements.formTab);
  }

  async proceedToFeesTab() {
    await this.page.click(this.elements.feesTab);
  }

  async removeFieldFromRecType() {
    /* make this function better pass field label or something or number etc*/
    await new Helpers().waitFor(1300);
    await this.page.evaluate(() => {
      document
        .evaluate(
          // locator,
          '(//*[@data-hint="Remove Field"])[1]',
          document,
          null,
          9,
          null,
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .singleNodeValue.click();
    });

    await this.page.click(this.elements.deActivate);
  }

  async proceedToOrgSettingsPage() {
    await this.page.click(this.elements.organizationSettingTab);
  }

  async publishRecordTypeFromDraft() {
    await this.page.click(this.elements.publishRecord);
    await this.page.click(this.elements.publishRecordModal);
  }

  async revertRecordTypeFromPublish() {
    await this.page.click(this.elements.revertToDraft);
    await this.page.click(this.elements.revertToDraftModalAcceptButton);
  }

  async verifyPublishRecordType(isVisible = true) {
    if (isVisible)
      await expect(
        this.page.locator(this.elements.publishRecord),
      ).toBeVisible();
    else
      await expect(this.page.locator(this.elements.publishRecord)).toBeHidden();
  }

  async verifyRevertToDraftRecordType(isVisible = true) {
    if (isVisible)
      await expect(
        this.page.locator(this.elements.revertToDraft),
      ).toBeVisible();
    else
      await expect(this.page.locator(this.elements.revertToDraft)).toBeHidden();
  }

  async setLocationsHelpText(locationType: LocationType, helpText: string) {
    let locator;
    switch (locationType) {
      case 'Address':
        locator = this.elements.addressLocationHelpText;
        break;
      case 'Point':
        locator = this.elements.pointLocationHelpText;
        break;
      case 'Segment':
        locator = this.elements.segmentLocationHelpText;
        break;
      default:
        throw new Error('Unsupported Location Type');
    }
    await this.selectLocation(locationType);
    await this.page.fill(locator, helpText);
    await expect(this.page.locator(locator)).toHaveValue(helpText);
    await this.page.waitForTimeout(1000);
  }

  async switchRenews() {
    const initialState = await this.page
      .locator(this.elements.renewsSwitch)
      .isChecked();

    // Won't click it without the 'label'
    await this.page.locator(`${this.elements.renewsSwitch} + label`).click();

    await expect(
      this.page.locator(this.elements.renewsSwitch).isChecked(),
    ).not.toEqual(initialState);
  }
  async selectSourceToImportRecordType(dbName: string, department: string) {
    await this.page.locator(this.elements.sourceDbDropdown).click();
    await this.page
      .locator(this.elements.sourceDbDropdown)
      .selectOption(dbName);

    await this.page.locator(this.elements.sourceDepartmentDropdown).click();
    await this.page
      .locator(this.elements.sourceDepartmentDropdown)
      .selectOption({label: department});
  }

  async importRecordType(
    name: string,
    targetDepartment: string,
    clickOnNewRecordType = false,
  ) {
    // Select record type from the list
    await this.page
      .locator('tr', {has: this.page.locator('td', {hasText: name})})
      .locator(this.elements.importButton)
      .click();

    // Select target department
    await this.page
      .locator(this.elements.newDepartmentDropdownForImportedRt)
      .click();
    await this.page
      .locator(this.elements.newDepartmentDropdownForImportedRt)
      .selectOption({label: targetDepartment});
    await this.page
      .locator('.modal-footer')
      .locator('button', {hasText: 'Import'})
      .click();

    // Wait for the record type imported
    const newRecordTypeLink = this.page
      .locator('.modal-body', {hasText: 'Your copy is ready'})
      .locator('a');
    await expect(newRecordTypeLink).toBeVisible();

    // Save the ID for after hooks
    baseConfig.citTempData.recordTypeId = (
      await newRecordTypeLink.getAttribute('href')
    )
      .split('/')
      .reverse()[0]; // The ID is placed at the end of the link

    if (clickOnNewRecordType) {
      await newRecordTypeLink.click();
    }
  }
  async switchCommunitySettingsOptionState(
    option: 'community status' | 'address integration',
    enable: boolean,
  ) {
    const switchElement = this.page
      .locator('div.row', {hasText: option})
      .locator('.bootstrap-switch');

    const initialState = (await switchElement.getAttribute('class')).includes(
      'bootstrap-switch-on',
    );

    if (initialState !== enable) {
      await switchElement.click();
      const newState = (await switchElement.getAttribute('class')).includes(
        'bootstrap-switch-on',
      );
      expect(newState).not.toEqual(initialState);
    }
  }
}

export enum EmployeePermission {
  Edit = 'Can Edit',
  View = 'Can View',
  NoAccess = 'No Access',
  Administer = 'Can Administer',
}

export enum AppAccessPermission {
  NoAccess = '0',
  Read = '1',
  ReadWrite = '2',
}

export const RecordTypeNames = [
  {
    name: '0_UI_SS',
    id: '6714',
  },
];

export enum NumberingPattern {
  Basic = 'Basic',
  Annual = 'Annual',
  Prefixed = 'Prefixed',
  AnnualPrefixed = 'Annual Prefixed',
}

type LocationType = 'Address' | 'Point' | 'Segment' | 'Additional' | 'Primary';
type TabList =
  | 'General'
  | 'Location'
  | 'Access'
  | 'Form'
  | 'Attachments'
  | 'Documents'
  | 'Fees'
  | 'Workflow'
  | 'Renewal';
