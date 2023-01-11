import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../base/base-test';

export class NotificationSettings extends BaseCitPage {
  readonly elements = {
    pageTitle: '.col-lg-14 h4',
    pageLabel: '.col-lg-14 label',
    settingSection: {
      selector: (settingName: string) =>
        `//div[@id='user-notification-settings']//tbody/tr[contains(.,${settingName})]`,
    },
    assignmentBrowser: '#assignmentBrowser',
    assignmentEmail: '#assignmentEmail',
    commentBrowser: '#commentBrowser',
    commentEmail: '#commentEmail',
    attachmentBrowser: '#recordBrowser',
    attachmentEmail: '#recordEmail',
    inspectionBrowser: '#inspectionBrowser',
    inspectionEmail: '#inspectionEmail',
    deadlineBrowser: '#deadlineBrowser',
    deadlineEmail: '#deadlineEmail',
    documentBrowser: '#documentBrowser',
    paymentBrowser: '#paymentBrowser',
  };

  notificationSettings = {
    assignments: [true, true],
    comments: [true, true],
    attachments: [true, true],
    inspections: [true, true],
    deadlines: [true, true],
    documents: true,
    payments: true,
  };

  async verifySettingPresent(settingName: string) {
    await this.elementVisible(
      this.elements.settingSection.selector(settingName),
    );
  }

  async verifyAllSettingsPresent() {
    const settingsNames = [
      'Assignments',
      'Comments',
      'Attachments',
      'Inspections',
      'Deadlines',
      'Documents',
      'Payments',
    ];
    for (const item of settingsNames) {
      await this.verifySettingPresent(item);
    }
  }

  async verifyPageTitlePresent() {
    await this.page.waitForSelector(this.elements.pageTitle);
    this.elementVisible(this.elements.pageTitle);
  }

  async setNotificationCheckboxValues(notificationSettings: {
    assignments: boolean[];
    comments: boolean[];
    attachments: boolean[];
    inspections: boolean[];
    deadlines: boolean[];
    documents: boolean;
    payments: boolean;
  }) {
    await this.setCheckboxValue(
      this.elements.assignmentBrowser,
      notificationSettings.assignments[0],
    );
    await this.setCheckboxValue(
      this.elements.assignmentEmail,
      notificationSettings.assignments[1],
    );

    await this.setCheckboxValue(
      this.elements.commentBrowser,
      notificationSettings.comments[0],
    );
    await this.setCheckboxValue(
      this.elements.commentEmail,
      notificationSettings.comments[1],
    );

    await this.setCheckboxValue(
      this.elements.attachmentBrowser,
      notificationSettings.attachments[0],
    );
    await this.setCheckboxValue(
      this.elements.attachmentEmail,
      notificationSettings.attachments[1],
    );

    await this.setCheckboxValue(
      this.elements.inspectionBrowser,
      notificationSettings.inspections[0],
    );
    await this.setCheckboxValue(
      this.elements.inspectionEmail,
      notificationSettings.inspections[1],
    );

    await this.setCheckboxValue(
      this.elements.deadlineBrowser,
      notificationSettings.deadlines[0],
    );
    await this.setCheckboxValue(
      this.elements.deadlineEmail,
      notificationSettings.deadlines[1],
    );
    await this.setCheckboxValue(
      this.elements.documentBrowser,
      notificationSettings.documents,
    );

    await this.setCheckboxValue(
      this.elements.paymentBrowser,
      notificationSettings.payments,
    );
  }

  private async setCheckboxValue(locator: string, setValue: boolean) {
    const checkboxValue = await this.page.locator(locator).isChecked();
    if (checkboxValue != setValue) {
      await expect
        .poll(
          async () => {
            await this.page.locator(locator).click();
            return (await this.page.locator(locator).isChecked()) == setValue;
          },
          {
            message: 'Setting checkbox failed',
            timeout: 5000,
          },
        )
        .toBeTruthy();
    }
  }
}
