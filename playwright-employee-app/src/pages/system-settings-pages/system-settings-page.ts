import {faker} from '@faker-js/faker';
import {getActivationLink} from '@opengov/cit-base/build/api-support/mandrillHelper';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {AuthPage} from '@opengov/cit-base/build/common-pages/auth-page';
import {NavigationBarPage} from '../navigation-bar-page';

let createdEmployeeEmail: string;
let createdEmployeePassword: string;

export class SystemSettingsPage extends BaseCitPage {
  readonly elements = {
    section: '.media-heading',
    settingSectionMenu: '.breadcrumb',
    addGroupButton: '.container .pull-right button',
    groupNameInput: '.modal-body .ember-text-field',
    createGroupSubmitButton: '.modal-footer .btn-primary',
    filterGroup: '#search-todo',
    firstRowGroupElement: 'tbody tr',
    editGroupButton: '.svg-pencil',
    editGroupInput: 'input[type="text"].edit',
    groupEditSaveButton: 'tbody .btn-primary',
    deleteGroupButton: '.svg-trash',
    confirmGroupDeleteButton: '.btn-danger',
    groupNameButton: 'tbody td:nth-child(1) a',
    addSomeUserLabel: '.fa-group',
    userSearchResult: '.searchResultsContainer .resultIcon',
    deleteUserButton: '.delete-hover',
    mainSearchboxInput: '#mainSearchBar_textBox',
    mainSearchResult: '.searchResultsContainer div.list-group-item',
    userFirstNameInput: '#firstName',
    userLastNameInput: '#lastName',
    userEmailInput: '#email',
    userEmailConfirmInput: '#emailCheck',
    addUserButton: '#addUserBtn',
    userEmployeeButton: '.table-icon .svg-user',
    userAdminButton: '.table-icon .svg-star',
    userMenuEployee: 'li .svg-user',
    userMenuAdmin: 'li .svg-star',
    usersTableRows: 'table.report tbody tr',
    editUserButton: '#user-profile-header-div a',
    editUserAddressField: '#address2',
    editUserSaveChanges: '.flex-justify-end .btn-primary',
    addFlagButton: '.fa-plus',
    addFlagSearchField: '#userFlagSearchKey_textBox',
    addFlagResult: '.resultRow .media-heading',
    userFlagsMenu: '.fa-ellipsis-v',
    removeFlagButton: '.fa-close',
    addNewFlagResult: '.searchResultsContainer .pointer .resultRow',
    inspectionDeleteButton: '.deleteButton',
    inspectionSearchRecord: '#search-todo',
    inspectionAddCheckList: '.glyphicon-plus',
    inspectionCodeInput: '#new_checklist_item_codeReference',
    inspectionItemInput: '#new_checklist_item_itemText',
    inspectionDeleteChecklist: '.fa-trash',
    inspectionEditCheckList: '.fa-pencil',
    inspectionEditCode: 'td:nth-child(1) input[type="text"].edit',
    inspectionEditText: 'td:nth-child(2) input[type="text"].edit',
    inspectionCodeText: 'tr td:nth-child(1)',
    inspectionTextText: 'tr td:nth-child(2)',
    paymentAddAcount: '.fa-plus',
    paymentTypeInput: '#newCustomPaymentType_name',
    paymentTypesTable: 'table tr td:nth-child(1)',
    paymentCreditCardSwitcherON: '.col-sm-16:nth-child(1) .bootstrap-switch-on',
    paymentECheckSwitcherON: '.col-sm-16:nth-child(2) .bootstrap-switch-on',
    paymentCreditCardSwitcherOFF:
      '.col-sm-16:nth-child(1) .bootstrap-switch-off',
    paymentECheckSwitcherOFF: '.col-sm-16:nth-child(2) .bootstrap-switch-off',
    paymentConnectAccount: '.btn-toolbar a:nth-child(1) span',
    modifyPaymentAccount: '.btn-toolbar a:nth-child(2) span',
    activityLogsHeader:
      '.row .navbar.navbar-default ul li:nth-child(1) a strong',
    logEmployeeFilterDropdown: '.custom-dropdwon-box .pull-left',
    logEmployeeResultList: '.dropdownItem',
    logActivityFirstElement: 'tr:nth-child(1) .activity-link',
    logActivitySecondElement: 'tr:nth-child(2) .activity-link',
    logActivityDateButton: '#recordsDateRange',
    logExportButton: '.row .navbar-default li:nth-child(2) a',
    logExportedLast: 'tbody tr:nth-child(1) td:nth-child(1)',
    logRecordSearchInput: '#RecordSearchKey',
    logRecordSearchResult: '.resultRow:nth-child(1) small',
    settingTabList: 'ul .presentation a',
    userActivationPassword: '#password',
    userActivationConfirmPassword: '#confirmpw',
    userExistsError: '.user-already-exists-alert',
    invalidEmailError: '[data-fv-validator="emailAddress"]',
    modalDialogBanner: '.modal-dialog .warning-box',
    linkInModal: '.modal-dialog .warning-box a',
    userEmail: '.limit-cell-250',
    recordTypeSettingsBtn: '#settings-recordtypes-btn',
    resendActivation: 'a.btn-xs.pointer',
    dateFormat: 'select.form-control',
  };

  async proceedToSection(section: string) {
    await this.clickElementWithText(this.elements.section, section, true);
    await this.elementVisible(this.elements.settingSectionMenu);
  }

  async addGroup(groupName: string) {
    const group = groupName
      ? groupName
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;

    await this.page.click(this.elements.addGroupButton);
    await this.page.fill(this.elements.groupNameInput, group);
    await this.page.click(this.elements.createGroupSubmitButton);
  }

  async checkGroup(groupName: string) {
    await this.page.fill(this.elements.filterGroup, groupName);
    await this.elementVisible(this.elements.firstRowGroupElement);
  }

  async editGroupName(name1: string, name2: string) {
    await this.page.fill(this.elements.filterGroup, name1);
    await this.elementVisible(this.elements.firstRowGroupElement);
    await this.page.click(this.elements.editGroupButton);
    await this.page.fill(this.elements.editGroupInput, name2);
    await this.page.click(this.elements.groupEditSaveButton);
    await this.checkGroup(name2);
  }

  async clickDeleteGroup(groupName: string, retryDelete?: boolean) {
    await this.page.fill(this.elements.filterGroup, groupName);
    await this.page.click(this.elements.deleteGroupButton);
    if (retryDelete === true) {
      await this.page.click(this.elements.confirmGroupDeleteButton);
    }
  }

  async deleteGroup(groupName: string) {
    await this.clickDeleteGroup(groupName);
    await this.page.click(this.elements.confirmGroupDeleteButton);
  }

  async addUserToGroup(groupName = 'employee') {
    const group = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.addGroup(group);
    await this.checkGroup(group);
    await this.page.click(this.elements.groupNameButton);
    await this.elementContainsText(this.elements.addGroupButton, 'Add User');
    await this.page.click(this.elements.addGroupButton);
    await this.page.fill(this.elements.groupNameInput, groupName);
    await this.page.click(this.elements.userSearchResult);
    await this.elementVisible(this.elements.firstRowGroupElement);
  }

  async removeUserFromGroup() {
    await this.page.click(this.elements.deleteUserButton);
    await this.elementNotVisible(this.elements.deleteUserButton);
  }

  async checkGlobalSearch(groupName: string) {
    const text = 'No Results found.';
    await this.page.fill(this.elements.mainSearchboxInput, groupName);
    await this.elementContainsText(this.elements.mainSearchResult, text);
  }

  async createUser(email = '', existing = false) {
    createdEmployeeEmail = email
      ? email
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}@opengov.com`;

    baseConfig.citTempData.createdUserEmail = createdEmployeeEmail;
    await this.page.fill(
      this.elements.userFirstNameInput,
      faker.name.fullName(),
    );
    await this.page.fill(
      this.elements.userLastNameInput,
      faker.name.fullName(),
    );
    await this.page.fill(this.elements.userEmailInput, createdEmployeeEmail);
    await this.page.fill(
      this.elements.userEmailConfirmInput,
      createdEmployeeEmail,
    );
    await this.page.click(this.elements.addUserButton);
    if (!existing) {
      await this.checkGroup(createdEmployeeEmail);
    }
    return createdEmployeeEmail;
  }

  async validateUserPresent(isPresent = true) {
    await this.waitForVisibility(this.elements.usersTableRows, isPresent);
  }

  async verifyExistingEmailError() {
    const text =
      'This User Already Exists\nThis user cannot be added because the email matches one already in the system.';
    await this.elementContainsText(this.elements.userExistsError, text);
  }

  async verifyInvalidEmailError() {
    await this.elementContainsText(
      this.elements.invalidEmailError,
      'Please enter a valid email address',
    );
  }

  async activateUser(email: string = createdEmployeeEmail) {
    createdEmployeePassword = faker.internet.password();
    const activationLink = await getActivationLink(email);
    await this.page.goto(activationLink);
    await this.page.fill(
      this.elements.userActivationPassword,
      createdEmployeePassword,
    );
    await this.page.fill(
      this.elements.userActivationConfirmPassword,
      createdEmployeePassword,
    );
    await this.clickElementWithText('button', 'Activate');
    await this.page.click('//button[contains(., "Log In")]');
  }

  async validateNewUserLogin() {
    await new AuthPage(this.page).loginAs(
      createdEmployeeEmail,
      createdEmployeePassword,
    );
    await new NavigationBarPage(this.page).validateOpenGovLogoVisibility(true);
  }

  async deleteUser() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    await this.createUser(userEmail);
    await this.deleteGroup(userEmail);
  }

  async searchUser() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    await this.createUser(userEmail);
    await this.page.fill(this.elements.mainSearchboxInput, userEmail);
    await this.elementContainsText(this.elements.mainSearchResult, userEmail);
  }

  async changeUserRole() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    await this.createUser(userEmail);
    await this.page.click(this.elements.userEmployeeButton);
    await this.page.click(this.elements.userMenuAdmin);
    await this.page.click(this.elements.userAdminButton);
    await this.page.click(this.elements.userMenuEployee);
    await this.elementVisible(this.elements.userEmployeeButton);
  }

  async changeUserInfo() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    await this.createUser(userEmail);
    await this.page.click(this.elements.groupNameButton);
    await this.page.click(this.elements.editUserButton);
    await this.page.fill(this.elements.editUserAddressField, userEmail);
    await this.page.click(this.elements.editUserSaveChanges);
  }

  async addUserFlag() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    const userFlag = 'Cat Person';
    await this.createUser(userEmail);
    await this.page.click(this.elements.groupNameButton);
    await this.page.click(this.elements.addFlagButton);
    await this.page.fill(this.elements.addFlagSearchField, userFlag);
    await this.page.click(this.elements.addFlagResult);
    await this.elementVisible(this.elements.userFlagsMenu);
  }

  async removeUserFlag() {
    await this.page.click(this.elements.userFlagsMenu);
    await this.page.click(this.elements.removeFlagButton);
    await this.elementNotVisible(this.elements.userFlagsMenu);
  }

  async createUserFlag() {
    const userEmail = `${this.plcPrefix()}_${faker.random.alphaNumeric(
      4,
    )}@opengov.com`;
    await this.createUser(userEmail);
    await this.page.click(this.elements.groupNameButton);
    await this.page.click(this.elements.addFlagButton);
    await this.page.fill(this.elements.addFlagSearchField, userEmail);
    await this.page.click(this.elements.addNewFlagResult);
    await this.elementVisible(this.elements.userFlagsMenu);
  }

  async addInspection(name: string = null) {
    const inspection = name
      ? name
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.page.click(this.elements.addGroupButton);
    await this.page.fill(this.elements.groupNameInput, inspection);
    await this.page.click(this.elements.createGroupSubmitButton);
    await this.page.fill(this.elements.inspectionSearchRecord, inspection);
    await this.elementVisible(this.elements.firstRowGroupElement);
    baseConfig.citTempData.inspectionName = inspection;
  }

  async checkInspection(isPresent: boolean) {
    await this.page.fill(
      this.elements.inspectionSearchRecord,
      baseConfig.citTempData.inspectionName,
    );
    await this.waitForVisibility(this.elements.firstRowGroupElement, isPresent);
  }

  async deleteInspection() {
    const inspection = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.addInspection(inspection);
    await this.page.click(this.elements.deleteGroupButton);
    await this.page.click(this.elements.confirmGroupDeleteButton);
    await this.elementNotVisible(this.elements.firstRowGroupElement);
    baseConfig.citTempData.inspectionName = inspection;
  }

  async editInspection() {
    const name1 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    const name2 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.addInspection(name1);
    await this.page.click(this.elements.editGroupButton);
    await this.page.fill(this.elements.editGroupInput, name2);
    await this.page.click(this.elements.groupEditSaveButton);
    await this.checkGroup(name2);
    baseConfig.citTempData.inspectionName = name2;
  }

  async addCheckListToInspection() {
    const inspection = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;

    await this.addInspection(inspection);
    await this.page.click(this.elements.groupNameButton);
    await this.page.click(this.elements.inspectionAddCheckList);
    await this.page.fill(this.elements.inspectionCodeInput, inspection);
    await this.page.fill(this.elements.inspectionItemInput, inspection);
    await this.page.click(this.elements.createGroupSubmitButton);
    await this.elementVisible(this.elements.firstRowGroupElement);
  }

  async removeCheckListFromInspection() {
    await this.addCheckListToInspection();
    await this.page.click(this.elements.inspectionDeleteChecklist);
    await this.page.click(this.elements.confirmGroupDeleteButton);
    await this.elementNotVisible(this.elements.firstRowGroupElement);
  }

  async editCheckList() {
    const name2 = `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;
    await this.addCheckListToInspection();
    await this.page.click(this.elements.inspectionEditCheckList);
    await this.page.fill(this.elements.inspectionEditCode, name2);
    await this.page.fill(this.elements.inspectionEditText, name2);
    await this.page.click(this.elements.groupEditSaveButton);
    await this.elementContainsText(this.elements.inspectionCodeText, name2);
    await this.elementContainsText(this.elements.inspectionTextText, name2);
  }

  async addPaymentMethod(email: string = null) {
    const method = email
      ? email
      : `${this.plcPrefix()}_${faker.random.alphaNumeric(4)}`;

    await this.page.click(this.elements.paymentAddAcount);
    await this.page.fill(this.elements.paymentTypeInput, method);
    await this.page.click(this.elements.groupEditSaveButton);
    await this.elementContainsText(this.elements.paymentTypesTable, method);
    await this.page.reload();
    await this.elementContainsText(this.elements.paymentTypesTable, method);
  }

  async deletePaymentMethod() {
    await this.addPaymentMethod();
    await this.page.click(this.elements.deleteGroupButton);
    await this.page.click(this.elements.confirmGroupDeleteButton);
  }

  async checkPayingSwitcher() {
    await this.elementVisible(this.elements.paymentCreditCardSwitcherON);
    // Avoid changing system setting, just existence will be checked,
  }

  async connectPaymentAccount() {
    const add = 'Connect New Account';
    await this.elementContainsText(this.elements.paymentConnectAccount, add);
    await this.page.click(this.elements.paymentConnectAccount);
    //invalid_redirect_uri is expected in test env so we do not proceed further
  }

  async modifyPaymentAccount() {
    const edit = 'Edit Settings';
    await this.elementContainsText(this.elements.modifyPaymentAccount, edit);
    await this.page.click(this.elements.modifyPaymentAccount);
    //invalid_redirect_uri is expected in test env so we do not proceed further
  }

  async editPaymentMethod() {
    await this.addPaymentMethod();
    await this.page.click(this.elements.editGroupButton);
    await this.page.fill(this.elements.editGroupInput, 'plc_ui_test');
    await this.page.click(this.elements.groupEditSaveButton);
  }

  async validateActivityLogs() {
    const logHeader = `Activity Log`;
    await this.elementContainsText(this.elements.activityLogsHeader, logHeader);
    await this.elementVisible(this.elements.logActivityFirstElement);
  }

  async filterActivityLogs() {
    const employee = `API Employee`;
    const employeeXpath = `//div[@class='dropdownItem' and text() = '${employee}']`;
    await this.page.click(this.elements.logEmployeeFilterDropdown);
    await this.page.click(employeeXpath);
    await this.elementContainsText(
      this.elements.logActivityFirstElement,
      employee,
    );
    await this.elementContainsText(
      this.elements.logActivitySecondElement,
      employee,
    );
  }

  async filterActivityLogsBy(record: string) {
    await this.page.fill(this.elements.logRecordSearchInput, record);
    await this.page.click(this.elements.logRecordSearchResult);
    await this.elementContainsText(
      this.elements.logActivityFirstElement,
      record,
    );
    await this.elementContainsText(
      this.elements.logActivitySecondElement,
      record,
    );
  }

  async exportActivityLogs() {
    const logHeader = `Export Log`;
    await this.elementContainsText(this.elements.logExportButton, logHeader);
    await this.page.click(this.elements.logExportButton);
    await this.elementVisible(this.elements.logExportedLast);
  }

  async proceedToRecordTypeSettingTab(tab: string) {
    await this.clickElementWithText(this.elements.settingTabList, tab);
  }

  async verifyBannerInUpdateEmailModal(text: string) {
    await this.elementContainsText(this.elements.modalDialogBanner, text);
  }
  async verifyLinkInUpdateEmailModal() {
    await this.elementContainsText(this.elements.linkInModal, 'Control Panel');
  }
  getResendActivationButton(user: string) {
    return this.page
      .locator(this.elements.firstRowGroupElement, {hasText: user})
      .locator(this.elements.resendActivation);
  }
}
