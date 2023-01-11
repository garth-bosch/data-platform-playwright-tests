import {resolve} from 'path';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '../base/base-test';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';
import {LocationPage} from './location-page';

export class RecordStepInspectionPage extends BaseCitPage {
  readonly elements = {
    inspectionDelete: '#deleteButton',
    scheduleInspection: '.svg-clock',
    scheduleInspectionAssignUser: '//button[ img[contains(@class, "assign")] ]',
    scheduleInspectioncomments: `//*[@id="checklist-container"]//textarea`,
    scheduleInspectionAssignUserTextBox:
      '#inspectionEventAssignment_undefined_textBox',
    scheduleInspectionAssignUserSearchRow: {
      selector: (searchString: string) =>
        `//*[contains(@class, "resultRow")]//h5[contains(.,"${searchString.toLowerCase()}")]`,
    },
    choseCalendarDate: '.fa-calendar',
    todayCalendar: '.is-today',
    previousMonthCalendar: '.pika-title .pika-prev',
    isTodayDate: '//td[contains(@class, "is-today")]/button',
    nextMonthCalendar: '.pika-title .pika-next',
    scheduledDate:
      '[data-test="Inspection"] .form-group:nth-of-type(1) .form-control-static:nth-of-type(1)',
    inspectionDateOverride: '#inspection-date-dropdown',
    scheduledDateOnInspectionPage: '#inspection-date-dropdown strong',
    scheduledDateOnConfirmationPage: `#completeInspectionModalForm .dropdown-toggle`,
    confirmSchedule: '.media-body .btn-primary',
    cancelInspection: '.text-danger',
    confirmButton: '.bootbox-accept',
    editButton: '.media-body .panel-body .btn-default',
    noteArea: 'textarea.ember-view',
    noteText: '.form-group:nth-child(3) .form-control-static',
    addInspectionTypeButton: '//button[contains(.,"Add Inspection Type")]',
    inspectionTypeInput: '#inspectionTypeSearch_textBox',
    typeResult: '.resultRow h5',
    inspectionTypeTitle: 'td h5',
    doneButton: '.media-body .row .btn-default',
    remove: '.media-body tr:nth-child(1) .close',
    beginInspection: '.media-body .panel-body .btn-primary',
    passInspect:
      '#checklist-panel .ember-view > div > div:nth-child(3) .svg-check',
    passLabel:
      '#checklist-panel .ember-view > div > div:nth-child(3) .btn-success',
    failInspect: '#checklist-panel .ember-view > div > div:nth-child(3) .svg-x',
    failLabel:
      '#checklist-panel .ember-view > div > div:nth-child(3) .btn-danger',
    skipInspect:
      '#checklist-panel .ember-view > div > div:nth-child(3) .svg-dash',
    skipLabel:
      '#checklist-panel .ember-view > div > div:nth-child(3) .btn-default',
    failDropdownOption: '.dropdown-menu-right span[class="text-danger"]',
    passSecond: '.checklist-item:nth-child(4) .checklist-buttons .svg-check',
    passSecondLabel:
      '#checklist-panel .ember-view > div > div:nth-child(4) .btn-success',
    allFilter: '#checklist-filter ul li:nth-child(1)',
    failFilter: '#checklist-filter ul li:nth-child(2)',
    passFilter: '#checklist-filter ul li:nth-child(3)',
    skippFiler: '#checklist-filter ul li:nth-child(4)',
    createNewInspection: '#start-inspection-event',
    passInspectionTest: '#inspection-pass',
    completeInspectionTest: '#complete-inspection',
    deleteInspectionTest: '#delete-inspection',
    completeInspectionTestTypeRow: {
      selector: (searchString: string) =>
        `//a[contains(@href, "step-inspection-type") and contains(.,"${searchString}")]`,
    },
    completeInspectionTestFinishButton:
      '//*[@id="checklist-container"]//button[contains(.,"Complete")]',
    confirmComplete: '.modal-footer .btn-primary',
    testInspectionCompleteLabel: '.table .text-success',
    inspectDayBefore: '#inspections-date-earlier-button',
    inspectElement: '.inspection-event .media-heading',
    inspectBar: '#sidebar-inspect-btn',
    inspectPage: '#inspect-topbar',
    uploadOverallAttachmentBtn: '[id*=FileInput]',
    uploadedOverallImage: '.inspection-thumbnail',
    uploadedAttachmentLine: '.attachment-line',
    uploadCheclistAttachmentsBtn:
      '.list-group-item.checklist-item [id*=FileInput]',
    uploadedChecklistImage: '.checklist-item .inspection-thumbnail',
    uploadedChecklistAttachmentLine: '.checklist-item .attachment-line',
    reportImageThumbnail: '.report-thumbnail',
    checklistItem: '#checklist-container .checklist-item',
    checklistItemByNumberOrText: {
      selector: (givenRow?: number, givenText?: string) => {
        if (givenRow) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item")])[${givenRow}]`;
        }
        if (givenText) {
          return `//*[@id='checklist-container']//div[contains(@class, "checklist-item") and contains(., "${givenText}")]`;
        } else {
          throw new Error('Pls provide one or the other value');
        }
      },
    },
    checklistItemByNumberOrTextPass: {
      selector: (givenRow?: number, givenText?: string) => {
        if (givenRow) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item")])[${givenRow}]//button[contains(@class, "success")]`;
        }
        if (givenText) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item") and contains(., "${givenText}")])//button[contains(@class, "success")]`;
        } else {
          throw new Error('Pls provide one or the other value');
        }
      },
    },
    checklistItemByNumberOrTextAttachmentFileName: {
      selector: (textValue: string, givenRow?: number, givenText?: string) => {
        if (givenRow) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item")])[${givenRow}]//a[contains(@class, "attachment-file-name") and contains(.,"${textValue}")]`;
        }
        if (givenText) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item") and contains(., "${givenText}")])//a[contains(@class, "attachment-file-name") and contains(.,"${textValue}")]`;
        } else {
          throw new Error('Pls provide one or the other value');
        }
      },
    },
    checklistItemByNumberOrTextAttachmentImage: {
      selector: (imgNumber = 1, givenRow?: number, givenText?: string) => {
        if (givenRow) {
          return `((//*[@id='checklist-container']//div[contains(@class, "checklist-item")])[${givenRow}]//img)[${imgNumber}]`;
        }
        if (givenText) {
          return `((//*[@id='checklist-container']//div[contains(@class, "checklist-item") and contains(., "${givenText}")])//img)[${imgNumber}]`;
        } else {
          throw new Error('Pls provide one or the other value');
        }
      },
    },
    checklistItemByNumberOrTextFileInput: {
      selector: (givenRow?: number, givenText?: string) => {
        if (givenRow) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item")])[${givenRow}]//input[contains(@id,"FileInput")]`;
        }
        if (givenText) {
          return `(//*[@id='checklist-container']//div[contains(@class, "checklist-item") and contains(., "${givenText}")])//input[contains(@id,"FileInput")]`;
        } else {
          throw new Error('Pls provide one or the other value');
        }
      },
    },

    inspectionHistory: '.table.table-hover.pointer tbody a',
    reportChecklistImage: '.inspection-result-branch + div .report-thumbnail',
    reportChecklistAttachment:
      '.inspection-result-branch + div .attachment-line',
    reportOverallAttachment: '.attachment-line',
    scheduleInspRequest: '.btn-group button.btn-primary',
    discardInspRequest: '.btn-group .text-danger',
    requestInspectionTitle: 'h4 .text-warning',

    editInspection: '//a[contains(@href, "#/inspect/inspection/")]',
    inspectionScheduleData: {
      selector: (fieldName) =>
        `//*[@data-test="Inspection"]//*[contains(text(),'${fieldName}')]/following-sibling::*`,
    },
    stepInspectionTypes: `//a[contains(@href, "step-inspection-types")]`,
    inspectionResults: `//*[contains(@class, "inspection-type-result-branch")]`,
    inspectionResultsImage: `//*[contains(@class, "inspection-type-result-branch")]//img[contains(@src,"http")]`,
    editInspectionlink: '//a[contains(.,"Edit Inspection")]',
    deleteInspectionButton: '#delete-inspection',
    inspectionHistoryTable:
      '[data-test-attribute="completed-inspection-events"]',
    emailInput: '.bootbox-input-email',
  };

  async openLastInspectionHistory() {
    await this.page
      .locator(this.elements.inspectionHistoryTable)
      .locator('tbody')
      .locator('tr')
      .first()
      .locator('td')
      .first()
      .locator('a')
      .click();
  }
  async scheduleInspection(
    changeMonth: string | 'today' | 'next' = undefined,
    assignUser?: string,
  ) {
    const day = String(new Date().getDate());
    let dayPicker = `[data-day='${day}']`;
    await this.page.click(this.elements.scheduleInspection);
    await this.page.click(this.elements.choseCalendarDate);

    if (changeMonth) {
      if (changeMonth === 'today') {
        await this.page.click(this.elements.isTodayDate);
      } else {
        const monthCaret: string =
          changeMonth === 'next'
            ? this.elements.nextMonthCalendar
            : this.elements.previousMonthCalendar;

        await this.page.click(monthCaret);
        dayPicker = `[data-day='10']`; // There will always be day 10 in every month.
        await this.page.click(dayPicker);
      }
    }
    if (assignUser) {
      await this.page.click(this.elements.scheduleInspectionAssignUser);
      await this.page.fill(
        this.elements.scheduleInspectionAssignUserTextBox,
        assignUser,
      );
      await this.page.click(
        this.elements.scheduleInspectionAssignUserSearchRow.selector(
          assignUser,
        ),
      );
    }
    await this.page.waitForSelector(this.elements.confirmSchedule, {
      strict: true,
      state: 'visible',
    });
    expect(
      await this.page.isEnabled(this.elements.confirmSchedule),
    ).toBeTruthy();
    await new Helpers().waitFor(800);
    await this.page.dblclick(this.elements.confirmSchedule);
    await this.elementContainsText(
      this.elements.confirmSchedule,
      'Begin Inspection',
    );
    baseConfig.citTempData.inspectionScheduledDate = (
      await this.getElementText(this.elements.scheduledDate)
    ).trim();
  }

  async cancelInspection() {
    await this.page.click(this.elements.cancelInspection);
    await this.page.click(this.elements.confirmButton);
  }

  async editInspection() {
    await this.page.click(this.elements.editButton);
    await this.page.fill(this.elements.noteArea, 'CAT');
    await this.page.click(this.elements.confirmSchedule);
    await this.elementContainsText(this.elements.noteText, 'CAT');
  }

  async addInspectionType(type: string) {
    await this.page.click(this.elements.addInspectionTypeButton);
    await this.page.fill(this.elements.inspectionTypeInput, type);
    await this.page.click(this.elements.typeResult);
    await this.page.click(this.elements.doneButton);
    await this.elementContainsText(this.elements.inspectionTypeTitle, type);
  }

  async removeInspection() {
    await this.page.click(this.elements.remove);
    await this.page.click(this.elements.confirmButton);
    await this.page.click(this.elements.remove);
    await this.page.click(this.elements.confirmButton);
    await this.elementNotVisible(this.elements.scheduleInspection);
  }
  async clickBeginInspection() {
    await this.page.click(this.elements.beginInspection);
  }

  async clickPassedInspection() {
    await this.page.click(this.elements.stepInspectionTypes);
  }
  async passInspection(
    passInspectionTest = false,
    completeInspection = false,
    comments?: string,
  ) {
    await this.clickBeginInspection();
    await this.page.click(this.elements.passInspect);
    await this.elementVisible(this.elements.passLabel);
    if (passInspectionTest) {
      await this.passInspectionTest();
    }
    if (completeInspection) {
      await this.page.click(this.elements.completeInspectionTest);
      await this.page.click(this.elements.completeInspectionTestFinishButton);
    }
    if (comments) {
      await this.page.fill(this.elements.scheduleInspectioncomments, comments);
    }
  }

  async clickInspectionType(inspectionTypeName: string) {
    await this.page.isVisible(
      this.elements.completeInspectionTestTypeRow.selector(inspectionTypeName),
    );
    await this.page.click(
      this.elements.completeInspectionTestTypeRow.selector(inspectionTypeName),
    );
  }

  async verifyScheduleDate(
    forElement: string = this.elements.scheduledDateOnInspectionPage,
  ) {
    await this.elementContainsText(
      forElement,
      baseConfig.citTempData.inspectionScheduledDate,
    );
  }

  async overrideInspectionDay(day: string = null) {
    const calendarDay = day ? `[data-day='${day}']` : '.is-today';
    await this.page.click(this.elements.inspectionDateOverride);
    await this.page.click(calendarDay);
    baseConfig.citTempData.inspectionScheduledDate = (
      await this.getElementText(this.elements.scheduledDateOnInspectionPage)
    ).trim();
    await this.verifyScheduleDate();
  }

  async failInspection() {
    await this.clickBeginInspection();
    await this.page.click(this.elements.failInspect);
    await this.elementVisible(this.elements.failLabel);
  }

  async skipInspection() {
    await this.clickBeginInspection();
    await this.page.click(this.elements.skipInspect);
    await this.elementVisible(this.elements.skipLabel);
  }

  async passInspectionTest() {
    await this.page.click(this.elements.passInspectionTest);
  }

  async completeInspection() {
    await this.passInspection();
    await this.page.click(this.elements.completeInspectionTest);
    await this.verifyScheduleDate(
      this.elements.scheduledDateOnConfirmationPage,
    );
    await this.page.click(this.elements.confirmComplete);
    await this.elementVisible(this.elements.testInspectionCompleteLabel);
  }

  async changeStatusOfInspection() {
    await this.page.click(this.elements.passLabel);
    await this.page.click(this.elements.failDropdownOption);
    await this.elementVisible(this.elements.failLabel);
  }

  async passSecondInspection() {
    await this.page.click(this.elements.passSecond);
    await this.elementVisible(this.elements.passSecondLabel);
  }

  async sortByFilter() {
    await this.page.click(this.elements.allFilter);
    await this.allElementsVisible([
      this.elements.failLabel,
      this.elements.passSecondLabel,
      this.elements.failFilter,
    ]);
    await this.page.click(this.elements.failFilter);
    await this.allElementsVisible([
      this.elements.failLabel,
      this.elements.passFilter,
    ]);
    await this.allElementsNotVisible([
      this.elements.passLabel,
      this.elements.passSecondLabel,
    ]);
    await this.page.click(this.elements.passFilter);
    await this.allElementsVisible([
      this.elements.passLabel,
      this.elements.skippFiler,
    ]);
    await this.allElementsNotVisible([
      this.elements.failLabel,
      this.elements.passSecondLabel,
    ]);
    await this.page.click(this.elements.skippFiler);
    await this.allElementsNotVisible([
      this.elements.failLabel,
      this.elements.passSecondLabel,
      this.elements.passLabel,
    ]);
  }

  async createNewInspection() {
    await this.page.click(this.elements.createNewInspection);
    await this.elementVisible(this.elements.passInspect);
  }

  async completeNewInspection() {
    await this.page.click(this.elements.passInspectionTest);
    await this.page.click(this.elements.completeInspectionTest);
    await this.page.click(this.elements.confirmComplete);
    await this.elementVisible(this.elements.testInspectionCompleteLabel);
  }

  async goToInspectTabAndProceedToInspection() {
    await this.page.click(this.elements.inspectElement);
    await this.elementVisible(this.elements.addInspectionTypeButton);
  }

  async clickInspectionButton() {
    await this.page.click(this.elements.inspectBar);
    await this.elementVisible(this.elements.inspectPage);
  }

  async uploadAttachmentChecklistByRowNumberGivenFile(
    givenNumber: number,
    fileType: FileTypes,
  ) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    await this.page.setInputFiles(
      this.elements.checklistItemByNumberOrTextFileInput.selector(givenNumber),
      filePath,
    );
  }

  // async uploadAttachmentChecklistByRowNumber(
  //     givenNumber: number,
  //     fileType: FileTypes,
  // ) {
  //   await this.elementVisible(this.elements.checklistItem);
  //   await this.page.click(this.elements.checklistItem)[givenNumber - 1];
  //   await this.uploadAttachmentChecklistByRowNumberGivenFile(
  //       givenNumber,
  //       fileType,
  //   );
  // }
  /* Mahesh todo */

  async uploadAttachmentChecklistByRowNumber(
    givenNumber: number,
    fileType: FileTypes,
  ) {
    /*Todo refactor and update bnoth text and row number .. row number for api*/
    await expect(
      this.page.locator(
        this.elements.checklistItemByNumberOrText.selector(givenNumber),
      ),
    ).toBeVisible();
    await this.page.click(
      this.elements.checklistItemByNumberOrTextPass.selector(givenNumber),
    );
    await this.uploadAttachmentChecklistByRowNumberGivenFile(
      givenNumber,
      fileType,
    );
  }

  async uploadAttachments(
    fileType: 'pdf' | 'csv' | 'jpeg' | 'docx' | 'png',
    attachmentType: string,
  ) {
    const filePath = `${resolve(
      process.cwd(),
    )}/src/resources/cit/sample.${fileType}`;
    let attachmentBtn = '';
    let uploadedImage = '';
    if (
      attachmentType === 'overall' &&
      (fileType === 'png' || fileType === 'jpeg')
    ) {
      attachmentBtn = this.elements.uploadOverallAttachmentBtn;
      uploadedImage = this.elements.uploadedOverallImage;
    } else if (
      attachmentType === 'checklist' &&
      (fileType === 'png' || fileType === 'jpeg')
    ) {
      attachmentBtn = this.elements.uploadCheclistAttachmentsBtn;
      uploadedImage = this.elements.uploadedChecklistImage;
    } else if (
      attachmentType === 'overall' &&
      (fileType === 'pdf' || fileType === 'csv' || fileType === 'docx')
    ) {
      attachmentBtn = this.elements.uploadOverallAttachmentBtn;
      uploadedImage = this.elements.uploadedAttachmentLine;
    } else if (
      attachmentType === 'checklist' &&
      (fileType === 'pdf' || fileType === 'csv' || fileType === 'docx')
    ) {
      attachmentBtn = this.elements.uploadCheclistAttachmentsBtn;
      uploadedImage = this.elements.uploadedChecklistAttachmentLine;
    }
    await this.page.setInputFiles(attachmentBtn, filePath);
    await this.elementVisible(uploadedImage);
  }
  async clickInspectionHistory() {
    await this.page.click(this.elements.inspectionHistory);
  }

  async downloadAttachment(fileType: string) {
    //re-using the existing methods from Location page for downloading the attachments
    await new LocationPage(this.page).downloadAttachment(fileType);
  }

  async verifyOverallAttachmentOnInspectionReport(fileType: string) {
    if (fileType === 'png') {
      await this.page.click(this.elements.inspectionHistory);
      await this.elementVisible(this.elements.reportImageThumbnail);
    } else {
      await this.page.click(this.elements.inspectionHistory);
      await this.elementVisible(this.elements.reportOverallAttachment);
    }
  }

  async verifyChecklistAttachmentOnInspectionReport(fileType: string) {
    if (fileType === 'png') {
      await this.elementVisible(this.elements.reportChecklistImage);
    } else {
      await this.elementVisible(this.elements.reportChecklistAttachment);
    }
  }

  async verifyRequestedInspectionFrmStorefront() {
    await this.elementVisible(this.elements.scheduleInspRequest);
    await this.elementVisible(this.elements.discardInspRequest);
    await this.elementContainsText(
      this.elements.requestInspectionTitle,
      'Requested',
    );
    await this.page.click(this.elements.scheduleInspRequest);
    const confirmScheduleBtn = this.elements.confirmSchedule;
    const editInspection = this.elements.editButton;
    await this.elementVisible(this.elements.choseCalendarDate);
    await this.page.click(confirmScheduleBtn);
    await this.elementVisible(editInspection);
    await this.elementContainsText(confirmScheduleBtn, 'Begin Inspection');
  }

  async deleteInspection() {
    await this.page.click(this.elements.editInspectionlink);
    await this.page.click(this.elements.deleteInspectionButton);
    await this.page.click(this.elements.confirmButton);
    await expect(
      this.page.locator(this.elements.inspectionHistory),
    ).toBeHidden();
  }
  async emailInspectionReport(to: string) {
    await this.page.locator('a', {hasText: 'Email Report'}).click();
    await this.page.locator(this.elements.emailInput).fill(to);
    await this.page.locator('button', {hasText: 'Send'}).click();

    // Popup window should appear
    await expect(
      this.page.locator('h5', {hasText: 'Report sent'}),
    ).toBeVisible();

    await this.page.locator(this.elements.confirmButton).click();
  }
}

export type FileTypes = 'pdf' | 'csv' | 'jpeg' | 'docx' | 'png';
