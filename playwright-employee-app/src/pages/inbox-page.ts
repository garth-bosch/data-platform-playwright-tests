import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../base/base-test';

export class InboxPage extends BaseCitPage {
  readonly pageUrl = '/inbox';
  readonly elements = {
    tasksDropdownMenu:
      'div.flex-nav-group-right > div > div:nth-child(1) > button',
    firstMessageAssignLabel: 'a[class*= list-group-item]:nth-child(1) h5',
    sideMenuMessageButton: '#sidebar-inbox-btn ',
    notificationMessage: '.badge',
    typesDropdownMenuButton:
      'div.flex-nav-group-right > div > div.position-relative.d-inline-block.m-l-10> button',
    typesDropdownMenu:
      'div.flex-nav-group-right > div > div.position-relative.d-inline-block.m-l-10 > ul li a',
    theNewestTask: 'a:nth-child(1) div.pull-left > h5',
    currentAssigneeName: 'span.step-assignment > span:nth-child(2)',
    assigneeSearchField: '.popover.assign input[name="searchFor"]',
    assigneeSearchDropdown: '.popover.assign .searchResultsContainer',
    assigneeDropdownElement:
      'div:nth-child(1) > div > div.media-body > h5.media-heading',
    calendarDay: {
      selector: (dayNumber: string) =>
        `#set-step-deadline tbody td[data-day="${dayNumber}"]`,
    },
    dueDateIcon: '.deadline-container svg',
    dueDateText: '.deadline-container span.m-l-5',
    dropDownCalendar: '#set-step-deadline',
    openTaskButton: '#open-task',
    recordActionsDropdown: '#record-dropdown-actions',
    printRecordButton: '#action-print-record',
    printPopUpButton:
      '#printRecordModal > div.modal-dialog > div > div.modal-footer > button',
    inboxSideBarMenu: '#sidebar-inbox-btn > a',
    dueDateRow: {
      selector: (recordNum: string) =>
        `(//div[contains(normalize-space(), '${recordNum}') and @class='text-gray']/preceding-sibling::div[@class='pull-right']/span)[1]`,
    },
    statusDropdownMenuButton:
      'div.flex-nav-group-right > div > div.position-relative.status-dropdown > button',
    statusDropdownMenu: {
      selector: (
        stepStatus: string,
      ) => `//ul[@id='step-status-dropdown']/li/a[contains(normalize-space(),
            '${stepStatus}')]`,
    },
    sortDropdownMenuButton:
      'div.flex-nav-group-right > div > div.relative-position > button',
    sortDropdownMenu: {
      selector: (
        stepStatus: string,
      ) => `//div[contains(@class,'relative-position')]//ul[@class='dropdown-menu']/li/a[contains(normalize-space(),
            '${stepStatus} First')]`,
    },
    workflowStepStatusRow: {
      selector: (recordNo: string) =>
        `//div[contains(normalize-space(),'${recordNo}') and @class='text-gray'][1]`,
    },
    assignedTaskLabel: '#process-tasklist [data-test-link="web"] h5',
    inboxItemsGivenRow: {
      selector: (rowNo: string) =>
        `(//div[@id="inbox-items-container"]/a[contains(@href, "#/inbox")]//h5)[${rowNo}]`,
    },
    inboxItemsGivenRowByRecordIdText: {
      selector: (recordId: string) =>
        `(//div[ @class="text-gray" and contains(., "${recordId}")])[1]`,
    },
    inboxSelectedItemRecordLink: {
      selector: (recordNo: string) =>
        `//a[ contains(@href,"#/explore/records/${recordNo}")]`,
    },
    inboxRecordStepRow: {
      selector: (recordId: string, recordTypeName) =>
        `//a[contains(@href,"${recordId}")]//h4[contains(., "${recordTypeName}")]`,
    },
    spinner: '.ember-application .spinner',
  };

  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}/#${this.pageUrl}`);
    await this.verifyInboxPageVisible();
  }

  async verifyInboxPageVisible() {
    await this.validTasksDropdownMenuVisible();
    await expect(this.page).toHaveURL(RegExp(this.pageUrl));
    await this.page.waitForSelector(this.elements.spinner, this.isNotVisible);
  }

  async validTasksDropdownMenuVisible() {
    await this.elementVisible(this.elements.tasksDropdownMenu);
  }

  async validateNotificationMarkOnMessageVisibility() {
    await this.elementVisible(this.elements.notificationMessage);
  }

  async validateMessageOfAssignmentPresent(assignment: string) {
    await this.page.click(this.elements.sideMenuMessageButton);
    await this.elementContainsText(
      this.elements.firstMessageAssignLabel,
      assignment,
    );
  }

  async getInboxItems() {
    await expect(
      this.page.locator(this.elements.firstMessageAssignLabel),
    ).toBeVisible();
    return await this.page
      .locator('a.inbox-item[data-test-link=web]')
      .allInnerTexts();
  }

  async validateTasksContainGivenText(text: string) {
    await expect(
      this.page.locator(this.elements.firstMessageAssignLabel),
    ).toBeVisible();
    await this.page
      .locator(this.elements.assignedTaskLabel)
      .allInnerTexts()
      .then((res) => {
        res.forEach((v) => {
          expect(v.match(text)).toBeTruthy();
        });
      });
  }

  async filterTasksByType(taskType: string) {
    await expect(
      this.page.locator(this.elements.firstMessageAssignLabel),
    ).toBeVisible();
    await expect(
      this.page.locator(this.elements.typesDropdownMenuButton),
    ).toBeVisible();
    await this.page.click(this.elements.typesDropdownMenuButton);
    await this.clickElementWithText(this.elements.typesDropdownMenu, taskType);
    await expect(
      this.page.locator(this.elements.firstMessageAssignLabel),
    ).toBeVisible();
  }

  async filterStepByStatus(statusType: string) {
    await this.page.click(this.elements.statusDropdownMenuButton);

    await this.page.click(
      this.elements.statusDropdownMenu.selector(statusType),
    );
  }

  async sortList(sortType: string) {
    await this.page.click(this.elements.sortDropdownMenuButton);

    await this.page.click(this.elements.sortDropdownMenu.selector(sortType));
  }

  async verifyTaskIsPresent(tasksName: string) {
    await this.clickElementWithText(this.elements.theNewestTask, tasksName);
  }

  async verifyInboxItemRowTitle(rowNo: string, titleName: string) {
    await this.clickElementWithText(
      this.elements.inboxItemsGivenRow.selector(rowNo),
      titleName,
    );
  }

  async reassignTaskToUser(userName: string) {
    await this.page.click(this.elements.currentAssigneeName);
    await this.page.fill(this.elements.assigneeSearchField, userName);
    await this.clickElementWithText(
      this.elements.assigneeDropdownElement,
      userName,
    );
    await this.elementContainsText(
      this.elements.currentAssigneeName,
      userName,
      true,
    );
  }

  async changeDueDate(dayNumber: string) {
    await this.page.click(this.elements.dueDateIcon);
    await this.elementVisible(this.elements.dropDownCalendar);
    await this.page.click(this.elements.calendarDay.selector(dayNumber));
    await this.elementVisible(this.elements.dueDateIcon);
    await this.elementTextNotVisible(this.elements.dueDateText, 'None');
  }

  async changeDueDateByDay() {
    await this.page.click(this.elements.dueDateIcon);
    await this.elementVisible(this.elements.dropDownCalendar);
    const d = new Date();
    const numdate = d.getDate();
    const date = numdate.toString();
    console.log(date);
    await this.page.click(this.elements.calendarDay.selector(date));
    await this.elementVisible(this.elements.dueDateIcon);
    await this.elementTextNotVisible(this.elements.dueDateText, 'None');
  }

  async openTask() {
    await this.page.click(this.elements.openTaskButton);
  }

  async clickPrintRecordButton() {
    await this.page.click(this.elements.recordActionsDropdown);
    await this.page.click(this.elements.printRecordButton);
    await this.page.click(this.elements.printPopUpButton);
  }

  async calculateDueDate(days: number): Promise<string> {
    const selectDate = new Date();
    selectDate.setDate(selectDate.getDate() + Number(days));
    const eMonth: string = selectDate.toLocaleString('default', {
      month: 'short',
    });
    const eDate: string = selectDate.getDate().toString();
    const date = eDate.length === 1 ? `0${eDate}` : eDate;

    const dueDate = `Due ${eMonth} ${date}`;
    return dueDate;
  }

  async verifyDueDateOfGivenRecordStepFromInbox(
    workflowStep: string,
    days: number,
    reloadAndFilter = true,
  ) {
    const recordNum = baseConfig.citTempData.recordName;
    console.info(`Record Number is ${recordNum}`);
    const dueDate = await this.calculateDueDate(days);
    if (reloadAndFilter) {
      await this.page.click(this.elements.inboxSideBarMenu);
      await this.page.reload();
      await this.filterTasksByType(workflowStep);
    }

    const givenText = (
      await this.page.textContent(this.elements.dueDateRow.selector(recordNum))
    )
      .replace(/\n/g, ' ')
      .replace(/  +/g, ' ');
    expect(givenText).toContain(dueDate);
  }

  async verifyDueDateSetThroughRecordTypeSettingsFromInbox(
    workflowStep: string,
  ) {
    const recordNum = baseConfig.citTempData.recordName;
    const addDueDateNum = baseConfig.citTempData.addDueDateNum;
    const selectDate = new Date();
    selectDate.setDate(selectDate.getDate() + Number(addDueDateNum));
    workflowStep === 'Approval'
      ? selectDate.setDate(selectDate.getDate() - 1)
      : selectDate.setDate(selectDate.getDate());

    const eMonth: string = selectDate.toLocaleString('default', {
      month: 'short',
    });
    const eDate: string = selectDate.getDate().toString();
    const date = eDate.length === 1 ? `0${eDate}` : eDate;
    const dueDate = `Due ${eMonth} ${date}`;

    await this.page.click(this.elements.inboxSideBarMenu);
    await this.page.reload();
    await this.filterTasksByType(workflowStep);
    await this.elementContainsText(
      this.elements.dueDateRow.selector(recordNum),
      dueDate,
    );
  }

  async verifyInboxItemsGivenRow(recordNumber: string, recordTypeName: string) {
    await expect(
      this.page.locator(
        this.elements.inboxItemsGivenRow.selector(`${recordNumber}`),
      ),
    ).toHaveText(recordTypeName);
  }

  async selectInboxRow(recordName: string = baseConfig.citTempData.recordName) {
    await this.page.click(
      this.elements.inboxItemsGivenRowByRecordIdText.selector(`${recordName}`),
    );
  }

  async verifyInboxRow(
    isVisible = true,
    recordName: string = baseConfig.citTempData.recordName,
  ) {
    await this.waitForVisibility(
      this.elements.inboxItemsGivenRowByRecordIdText.selector(`${recordName}`),
      isVisible,
    );
  }

  async verifyInboxTaskRowVisible(
    recordName: string = baseConfig.citTempData.recordName,
  ) {
    await expect(
      this.page.locator(
        this.elements.inboxItemsGivenRowByRecordIdText.selector(recordName),
      ),
    ).toBeVisible();
  }

  async clickInboxItemsGivenRow(recordNumber: string) {
    await this.page.click(
      this.elements.inboxItemsGivenRow.selector(`${recordNumber}`),
    );
  }

  async clickInboxSelectedItemRecordLink(recordId: string) {
    await this.page.click(
      this.elements.inboxSelectedItemRecordLink.selector(`${recordId}`),
    );
  }

  async verifyStepRow(recordId: string, recordTypeName: string) {
    const elem = await this.locateWithText(
      this.elements.inboxRecordStepRow.selector(recordId, recordTypeName),
      recordTypeName,
    );
    await expect(elem.first()).toBeVisible();
  }

  async navigateToInboxPage() {
    await this.page.click(this.elements.inboxSideBarMenu);
  }

  async verifyRecordWorkflowStepStatusFromInbox(
    workflowStepStatus: string,
    workflowStep: string,
    isVisible = true,
    sortListType = 'Oldest',
    recordName: string = baseConfig.citTempData.recordName,
  ) {
    const recordNum = baseConfig.citTempData.recordName;
    await this.filterTasksByType(workflowStep);
    await this.filterStepByStatus(workflowStepStatus);
    if (sortListType === 'Newest') {
      await this.sortList(sortListType);
    }
    await this.waitForVisibility(
      this.elements.inboxItemsGivenRowByRecordIdText.selector(`${recordName}`),
      isVisible,
    );
    await this.waitForVisibility(
      this.elements.dueDateRow.selector(recordNum),
      isVisible,
    );
  }
}
