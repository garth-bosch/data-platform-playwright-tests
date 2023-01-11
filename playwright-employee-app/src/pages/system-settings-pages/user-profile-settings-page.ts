import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../base/base-test';

export class UserProfileSettingsPage extends BaseCitPage {
  readonly elements = {
    editUserLink: './/a[contains(.,"Edit User")]',
    saveChangesButton: './/button[contains(.,"Save Changes")]',
    resetPasswordButton: '.col-sm-12 [type="button"] [id="spinner"]',
    notificationText: '#fade_div',
    userEditFormFieldLabel: 'form#userEditForm .form-group label',
    updateEmailButton: '#userEditForm [data-target="#updateEmailModal"]',
    updateEmailModal: '#updateEmailModal',
    viewMoreButton: '#load-active-tab-record',
    noActiveRecords: '#active p:nth-child(2)',
    activeRecordsRows: '.tab-pane.active#active tbody tr',
    noCompleteRecords: '#complete p:nth-child(2)',
    completeRecordsRows: '.tab-pane.active#complete tbody tr',
    activeTab: '.nav-tabs li:nth-child(1) a',
    completeTab: '.nav-tabs li:nth-child(2) a',
    userEmail: '#user-email',
  };

  async clickResetPasswordButton() {
    await this.page.click(this.elements.resetPasswordButton);
  }

  async verifyNotificationTextForResetPassword(notificationText: string) {
    await this.elementContainsText(
      this.elements.notificationText,
      notificationText,
    );
  }

  async verifyUserEmail(email: string, exactMatch = false) {
    await this.locateWithText(this.elements.userEmail, email, exactMatch);
  }

  async clickEditProfileButton() {
    await this.page.click(this.elements.editUserLink);
    await this.elementVisible(this.elements.saveChangesButton);
  }

  async clickEditEmailButton() {
    await this.page.click(this.elements.updateEmailButton);
    await this.elementVisible(this.elements.updateEmailModal);
  }

  async verifyFieldDisplayed(fieldName: string) {
    await this.elementTextVisible(
      this.elements.userEditFormFieldLabel,
      fieldName,
    );
  }

  async verifyViewMoreButtonDisplayed(expectedStatus: boolean) {
    this.waitForVisibility(this.elements.viewMoreButton, expectedStatus);
  }

  async clickViewMoreButton() {
    await this.page.click(this.elements.viewMoreButton);
  }

  async verifyNoRecordMessageDisplayed(
    noRecordMessage: string,
    tab: 'Active' | 'Complete',
  ) {
    await this.elementContainsText(
      tab === 'Active'
        ? this.elements.noActiveRecords
        : this.elements.noCompleteRecords,
      noRecordMessage,
    );
  }

  async verifyRecordsAreNotEmpty(tab: 'Active' | 'Complete') {
    tab === 'Active'
      ? expect(
          await this.page.locator(this.elements.activeRecordsRows).count(),
        ).toBeGreaterThan(0)
      : expect(
          await this.page.locator(this.elements.completeRecordsRows).count(),
        ).toBeGreaterThan(0);
  }

  async clickRecordSpecificTab(tab: 'Active' | 'Complete') {
    await this.page.click(
      tab === 'Active' ? this.elements.activeTab : this.elements.completeTab,
    );
  }
}
