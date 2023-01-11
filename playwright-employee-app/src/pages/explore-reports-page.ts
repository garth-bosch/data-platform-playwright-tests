import {expect} from '../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {faker} from '@faker-js/faker';
import moment from 'moment';
import retry from 'async-retry';
import fs from 'fs';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {CommonApi} from '@opengov/cit-base/build/api-support/api/commonApi';
import {DepartmentsApi} from '@opengov/cit-base/build/api-support/api/departmentsApi';
import {ProjectPage} from './project-page';
import {InternalRecordPage} from './ea-record-page';
import {Locator} from '@playwright/test';
import {ElementHandle} from 'playwright-core';

let recordCount = '';
let generatedReportName = '';

export class ExploreReportsPage extends BaseCitPage {
  readonly elements = {
    searchReports: '#searchReportInput',
    reportMenu: {
      selector: (reportMenuName: string) =>
        `//*[@id="reports-menu-${reportMenuName}"]`,
    },
    recordsMenu: '#reports-menu-records',
    reportMenuSelection: {
      selector: (reportName: string) => `#reports-menu-${reportName}`,
    },
    editActiveReport: '//button[@class="btn btn-primary btn-xs pull-right"]',
    paymentsMenu: '#reports-menu-payments',
    paymentsMenuPaymentsDue: '#reports-menu-payments-payments-due',
    paymentsMenuPayments: '#reports-menu-payments-payments',
    paymentsMenuLedger: '#reports-menu-payments-ledger',
    columnNamePlace: '#columns-tab > h4',
    filteredSection: '//div[@id="filters-tab"]/div[2]',
    documentsMenu: '#reports-menu-documents',
    inspectionsMenu: '#reports-menu-inspections',
    projectsMenu: '#reports-menu-projects',
    activeRecords: '#reports-menu-records-active-records',
    editActiveRecords: '#edit-btn-records-active-records',
    editActiveInspection: '#edit-btn-inspections-active-inspections',
    inspectionResultsMenuActiveInspections:
      '#reports-menu-inspections-active-inspections',
    inspectionResultsMenu: '#reports-menu-inspections-inspection-results',
    activeInspectionsMenu: '#reports-menu-inspections-active-inspections',
    /*Inspections*/
    editInspectionResultsMenu: '#edit-btn-inspections-inspection-results',
    editActivePayments: '#edit-btn-payments-payments-due',
    generalTab: '#general-tab',
    columnsTab: 'a[href="#columns-tab"]',
    filtersTab: '#filters-tab',
    columnsTabColumnNames: {
      /* Can use generically, use '' for name and any numeric item for whichItem */
      selector: (columnName = '', whichItem = 1) =>
        `(//label[contains(.,"${columnName}")]/input[contains(@id, "reportable_checkbox")])[${whichItem}]`,
    },
    reportableColumns: '#columns-tab .ember-view',
    totalPaidColumn: '//div[@id="columns-tab"]/div//label[text()="Total Paid"]',
    reportsMenu: '.collapse[aria-expanded=true]',
    reportsMenuList: '[class="collapse in"] a',
    reportHeaderName: '.report-body h3',
    reportMenuApproval: '#reports-menu-approvals',
    reportActiveApproval: '#reports-menu-approvals-active-approvals',
    reportCompletedApproval: '#reports-menu-approvals-completed-approvals',
    reportNavHeaderName: '.text-nowrap li:nth-child(3)',
    addReportButton: {
      selector: (sectionName) => `#reports-menu-${sectionName} .svg-plus`,
    },
    reportNameInput: '#newReportForm input',
    createReportButton: '#newReportForm .btn-primary',
    activeRecordsButton: {
      selector: (sectionNumber: string) =>
        `div#collapse_${sectionNumber} li:nth-child(1)`,
    },
    reportCatList: '#reports-menu-records-cat',
    reportActionButton: '.report-inner .dropdown-toggle',
    reportActionShareTextModal: `//p[contains(.,"Are you sure you want to") and contains(.,"share this report? This report will be") and contains(.,"seen by all other employees in their Reports") ]`,
    reportActionShareModalButton: `//button[@data-dismiss="modal" and contains(.,"Share Report")]`,
    reportActionShareButton:
      '//ul[contains(@class,"dropdown-menu")]/li/a[contains(text(),"Share Report")]',
    reportActionExportButton: '//a[contains(text(),"Export Report")]',
    reportActionDeleteButton: '.report-inner li:nth-child(3)',
    closeFilterValueButton: {
      selector: (filterName: string) =>
        `//div[@id="filters-tab"]//label[text()="${filterName}"]/ancestor::*/div[@class="dropdown"]//div[@class="close"]`,
    },
    confirmShareButton:
      '#change-report-privacy-modal .modal-footer button.btn-primary',
    flagLabels: 'div.label.flag.pull-left.label',
    columnList: 'thead th div',
    columnListHeaders: `//div[@id='reports-table']//table/thead/tr[1]/th`,
    columnCheckboxList: '.checkbox-report label',
    completedRecordLink: '#reports-menu-records-completed-records',
    completedRecordEditButton: '#edit-btn-records-completed-records',
    editTabsList: '.nav-tabs a',
    editReportSaveAs: '#report-edit-save-btn',
    filterSaveButton: '//button[contains(.,"Save")]',
    saveReportAsInputName: '#saveAsNewReportForm .ember-text-field',
    saveReportFooterButton: '#reportSaveAsModal .btn-primary',
    addNewFilterButton: '#filters-tab #newDefaultsDropdown',
    dropdownFilter: {
      selector: (filterName: string) =>
        `//div[@class="dropdownItem" and text()="${filterName}"]`,
    },
    filterBody: '//div[@id="filters-tab"]',
    filterSearchValueInput: '.reporting-panel [name="searchFor"]',
    filterSearchValueInputResult: {
      selector: (resultValue: string) =>
        `//*[contains(@class,"resultRow")]//h5[contains(., "${resultValue}")]`,
    },
    filterSearchValueCondition: {
      selector: (whichCondition: 'is empty' | 'has any value' | 'is' = 'is') =>
        whichCondition !== 'is'
          ? `//*[contains(@class, "reporting-panel")]//label[contains(normalize-space(), "${whichCondition}")]/input`
          : `//*[contains(@class, "reporting-panel")]//label[contains(normalize-space(), "${whichCondition}") and not(contains(normalize-space(), "empty"))]/input`,
    },
    filterEmptyResult: '.radio:nth-child(2) input',
    filterAnyResult: '.radio:nth-child(3) input',
    filterIsResult: '.radio:nth-child(4) input',
    applyFilterButton: '.clearfix button',
    filterValue: '#_Input',
    rowcount: '//div[@id="reports-table"]//tbody/tr',
    searchForLocation: '#filters-tab input[name="searchFor"]',
    searchAutoSuggestion: '#filters-tab .searchResultsContainer h5',
    locationName: {
      selector: (rowno: number) =>
        `#reports-table tr:nth-of-type(${rowno}) td:nth-of-type(7)`,
    },
    locationCount: {
      selector: (rowno: number) =>
        `#reports-table tr:nth-of-type(${rowno}) td:nth-of-type(7) a`,
    },
    namedColumnList: {
      selector: (columnName: string) =>
        `//td[position() = count(//thead/tr/th/div[text()="${columnName}"]/../preceding-sibling::*)+1]`,
    },
    cellWithText: {
      selector: (text: string) => `//td[contains(normalize-space(),"${text}")]`,
    },
    allRows: `//tbody/tr`,
    namedColumnHeader: {
      selector: (columnName: string) =>
        `//thead/tr/th/div[text()="${columnName}"]/..`,
    },
    filterTabName: '#filters-tab .ember-view .checkbox-inline',
    filterTabAttribute: {
      selector: (attributeName: string) =>
        `//div[@class="attribute-label"]/label[contains(.,"${attributeName}")]`,
    },
    numberOfRecords: '.table.table-hover.table-reports tbody tr',
    reportsTable: '#reports-table',
    lastRow: '.table.table-hover.table-reports tbody tr:last-of-type',
    tableRows: '.table.table-hover.table-reports tbody tr',
    nextRow: {
      selector: (rowCount: string) =>
        `//table[@class='table table-hover table-reports']/tbody/tr[${rowCount}]`,
    },
    saveDocumentReportName: {
      selector: (documentReportName: string) =>
        `//h3[text()='${documentReportName}']`,
    },
    recordNumber: 'div.report-inner small',
    confirmExportButton: '#long-export-modal .modal-footer a button',
    exportPending: {
      selector: (reportName: string) =>
        `//tr[contains(.,"${reportName}")]/td[contains(.,"Pending")]`,
    },
    downloadReadyButton: {
      selector: (reportName: string) =>
        `//tr[contains(.,"${reportName}")]/td/a[contains(@class, "btn-primary")]`,
    },
    departmentDropdown: '#reports-category-selector',
    departmentDropdownItems: '#reports-category-selector a',
    addNewFormFilterButton: '#formFiltersDropdown',
    formFilterSearchInput: `ul[aria-labelledby='formFiltersDropdown'] input[class*='dropdown-searchbar']`,
    departmentFormFieldName: {
      selector: (fieldName: string) => `//div[text()='${fieldName}']`,
    },
    departmentDropdownOnReportTab: 'div#report-edit-dept button',
    departmentDropdownItemsOnReportTab: 'div#report-edit-dept ul div',
    recordTypeDropdownOnReportTab: 'div#report-edit-record-type button',
    recordTypeDropdownItemsOnReportTab: 'div#report-edit-record-type ul div',
    formFilterOption: {
      selector: (choiceOfFilter: string) =>
        `//label[contains(string(),'${choiceOfFilter}')]/input`,
      searchFor: `#filters-tab input[name='searchFor']`,
      resultRow: '.resultRow h5',
    },
    currentReportEntry: {
      selector: (reportName: string) =>
        `//tbody/tr[1]/td[text()="${reportName}"]/../td/div[text()="Finished"]`,
    },
    sectionSelector: {
      selector: (sectionName: string) => `#reports-menu-${sectionName}`,
    },
    reportSelector: {
      selector: (sectionName: string, reportName: string) =>
        `#reports-menu-${sectionName}-${reportName}`,
    },
    reportEditButtonSelector: {
      selector: (sectionName: string, reportName: string) =>
        `#edit-btn-${sectionName}-${reportName}`,
    },
    tableRowSpinner:
      'tr:last-child td:last-child div.animated-background.rowLoader',
    filterInput: `//ul[@aria-labelledby='newDefaultsDropdown']//descendant::input`,
    selectOption: `#StepStatusesstepStatus-dropdown button`,
    dropdownOption: {
      selector: (status: string) => `//li/div[text()='${status}']`,
    },
    dateSubmittedDropdown: `#RecordsdateSubmitted-dropdown`,
    beforeAfterDate: `//div[contains(@class, "dropdownItem") and contains(.,"Before / After Date")]`,
    calDate: '//*[@id="_calendar"]',
    columnFilter: `//li/a[normalize-space()='Columns']`,
    archivedCheckbox: `//label[normalize-space()='Archived']`,
    statusBarTrackerCell: {
      selector: (cellColor: string) =>
        `//td[position() = count(//div[text()="Record Status Bar"]/../preceding-sibling::*)+1]` +
        `//div[@class="tracker"]/span[contains(@class, "trace-${cellColor}")]`,
    },
    threeDotsButton: 'button[data-toggle=dropdown].btn-tridot',
    threeDotsDropdown: '#report-timezone-dropdown ul.dropdown-menu',
    utcTimezoneButton: '#utc',
    localTimezoneButton: '#local-timezone',
    columnsNames: 'thead tr th',
    cellByRecordAndIndex: {
      selector: (recordNumber: string, columnIndex: string, nthRow = 1) =>
        `(//a[text()='${recordNumber}']/../../td[${columnIndex}])[${nthRow}]`,
    },
    closeReportSettings: `.liquid-child .close`,
    closeFilterButton: '#filters-tab .attribute-label .close',
    recordTypeDropdown: '#report-edit-record-type',
    downloadReportButton: {
      selector: (reportName: string) => `//td[text()="${reportName}"]/..//a`,
    },
    activeReport: '.active.reportLink',
    activeReportEditButton: '.active.reportLink button[id*="edit-btn"]',
    firstDataRowRecordLink:
      '#reports-table tr:nth-of-type(1) td:nth-of-type(1) a',
    firstDataRowProjectLink:
      '#reports-table tr:nth-of-type(1) td:nth-of-type(2) a',
    loader: '.animated-background',
    dropdownSearchbar: '#columns-tab .dropdown-searchbar',
    reportTab: '[data-toggle="tab"]',
    headerColumn: 'thead th',
    newReportButton: '[data-hint="New Report"]',
    newReportName: '#newReportName',
    newReportScopeDropdown: '#newReportScopeDropdown',
    newReportScopeDropdownItem:
      '[aria-labelledby="newReportScopeDropdown"] .dropdownItem',
    checkbox: 'input[type="checkbox"]',
    filterResultRow: {
      selector: (searchText: string) =>
        `//div[contains(@class,'resultRow')]//h5[text()=${searchText}]`,
    },
    editBtn: '[id*=edit-btn]',
    tabList: '[role="tablist"]',
    exploreRecordsButton: '#sidebar-explore-btn',
    exploreRecordsPanelLedgerFilters: '#reports-menu-payments-ledger-filters',
    exploreRecordsPanelLedgerFiltersEdit: '#edit-btn-payments-ledger-filters',
    ledgerFiltersInputfilterName:
      '[aria-labelledby="newDefaultsDropdown"] input',
    ledgerFiltersRecordFilterDropdown:
      '//*[@class="dropdownItem" and contains(.,"Record #")]',
    ledgerFiltersRecordSearch:
      '#RecordsrecordNo_searchBar_container [name="searchFor"]',
    ledgerFiltersRecordSearchRecordDropdown: {
      selector: (recordId) =>
        `//*[contains(@class, "resultRow")]//h5[contains(.,${recordId})]`,
    },
    ledgerFiltersCreditCardProcessingFeeCell: {
      selector: (feesValue) =>
        `//tr[ td/p[@title="Credit Card Processing Fee" ]]/td[text()="${feesValue}"]`,
    },
    customColumnCellValue: {
      selector: (title, cellValue) =>
        `//tr[ td/p[@title="${title}" ]]/td/p[text()="${cellValue}"]`,
    },
    reportLink: '.reportLink',
    saveReportButton: '.report-edit-menu button.btn-primary',
    addNewFilter: '#newDefaultsDropdown',
    addNewFormFilter: '#formFiltersDropdown',
    filterDropDown: '.dropdown.open',
    filterOptions: '.reporting-panel .radio',
    editMenu: '.report-edit-menu',
    closeButton: '.close',
    reportBody: '.report-body',
    dropDownMenu: '.dropdown-menu',
    plusButton: '.glyphicon-plus',
    searchFor: 'input[name=searchFor]',
    searchForFilter: '.reporting-panel input[name=searchFor]',
    dropdownItems: '.dropdown .open .dropdownItem',
    reportRow: '.table.table-hover.table-reports tbody tr',
    reportRowRecord: {
      selector: (recordNumber = '', whichRow = 1) =>
        `(//a[contains(@href, "/#/explore/records/") and contains(@href, "${recordNumber}")])[${whichRow}]`,
    },
    editButton: '[id*=edit-btn]',
    genericReportName: {
      selector: (reportName: string) =>
        `//button[contains(@id, "reports-menu") and contains(@id, "${reportName.toLowerCase()}")]`,
    },
    genericReportNameEdit: {
      selector: (reportName: string) =>
        `//button[contains(@id, "edit-btn-") and contains(@id, "${reportName.toLowerCase()}")]`,
    },
    recordLabelStatus: `label[for="RecordStatusesrecordStatus"] span`,
    dropDownInput: `//ul[@aria-labelledby="newDefaultsDropdown"]//input`,
    applyButton: `//button[contains(.,"Apply")]`,
    tabContent: '.tab-content',
    dropdownBox: {
      selector: (dropdownLabel) =>
        `label:has-text("${dropdownLabel}") + .custom-dropdwon-box`,
      dropDownItem: '.dropdownItem',
      selectedValue: 'span.text-ellipse',
    },
  };

  async clickPaymentRecords() {
    await this.page.click(this.elements.paymentsMenu);
  }

  async clickPaymentsDueRecords() {
    await this.page.click(this.elements.paymentsMenuPaymentsDue);
  }

  async clickPaymentsRecords() {
    await this.page.click(this.elements.paymentsMenuPayments);
  }

  async clickPaymentsLedgerRecords() {
    await this.page.click(this.elements.paymentsMenuLedger);
  }

  async clickReportTab() {
    await this.page.click(this.elements.reportTab);
  }

  async selectReportByName(name: string) {
    await this.clickElementWithText(this.elements.reportsMenuList, name, true);
  }

  async clickReportSaveButton() {
    await this.page.click(this.elements.editReportSaveAs);
  }

  async clickFilterSaveButton() {
    await this.page.click(this.elements.filterSaveButton);
  }

  async clickReportsMenuRecords() {
    await this.openReportSection(ReportSections.Records);
  }

  async clickActiveRecords() {
    await this.page.click(this.elements.activeRecords);
  }

  async clickApprovalRecords() {
    await this.page.click(this.elements.reportMenuApproval);
  }

  async clickActiveApproval() {
    await this.page.click(this.elements.reportActiveApproval);
  }

  async clickCompletedApproval() {
    await this.page.click(this.elements.reportCompletedApproval);
  }

  async clickCompletedRecordsFilter() {
    await this.page.click(this.elements.completedRecordLink);
  }

  async clickEditActiveRecords() {
    await this.page.click(this.elements.editActiveRecords);
  }

  async clickRecordLabelStatus() {
    await this.page.click(this.elements.recordLabelStatus);
  }

  async fillDropDownInput(valToFill: string) {
    await this.page.fill(this.elements.dropDownInput, valToFill);
  }

  async selectDropDown(valToSelect: string) {
    await this.page.click(this.elements.dropdownOption.selector(valToSelect));
  }
  async fillDateDropdown(calDate: string, dateOptionValue: string) {
    await this.page.click(this.elements.dateSubmittedDropdown);
    await this.page.click(this.elements.beforeAfterDate);
    await this.page.fill(this.elements.calDate, calDate);
    await this.page
      .locator(`#beforeAfterDateOption`)
      .selectOption({value: dateOptionValue});
    await this.page.click(this.elements.applyButton);
  }

  async clickEditCompletedRecords() {
    await this.page.click(this.elements.completedRecordEditButton);
  }

  async clickColumnsTab() {
    await this.page.click(this.elements.columnsTab);
  }

  async clickGeneralTab() {
    await this.page.click(this.elements.generalTab);
  }

  async clickFiltersTab() {
    await this.page.click(this.elements.filtersTab);
  }

  async checkTotalPaidColumnAbsent() {
    await expect(this.page.locator(this.elements.totalPaidColumn)).toBeHidden();
  }

  async sanitizeReportSelector(reportName: string) {
    return reportName.replace(new RegExp(/_|\s/, 'g'), '-').toLowerCase();
  }

  async openReportAndValidateName(
    reportName: string,
    reportSection: ReportSections,
    exactMatch = true,
  ) {
    await this.clickReport(reportName, reportSection, exactMatch);
    await this.elementContainsText(this.elements.reportHeaderName, reportName);
  }

  async getTotalRecordsCount() {
    recordCount = await this.page
      .locator(this.elements.recordNumber)
      .innerText();
    recordCount = recordCount.replace('(', '').replace(')', '');
    return recordCount;
  }

  async validateRecordCount() {
    const rowCount = Number(await this.getTotalRecordsCount());
    let rowIndex = 0;
    do {
      rowIndex = Number(
        await this.page.locator(this.elements.reportRow).count(),
      );
    } while (rowCount !== rowIndex);
    expect(rowCount).toEqual(rowIndex);
  }

  async createReport(
    reportName: string,
    reportSection: ReportSections,
    reportType?: ReportTypes,
  ) {
    const reportSectionLocator = await this.getReportSectionLocator(
      reportSection,
    );
    await expect(reportSectionLocator).toBeVisible();
    await reportSectionLocator.hover();
    const createNewBtn = reportSectionLocator.locator(
      this.elements.newReportButton,
    );
    expect(createNewBtn).toBeDefined();
    await this.waitReportTableLoaded();
    await createNewBtn.click();
    await this.page.fill(this.elements.newReportName, reportName);
    if (reportType) {
      await this.selectReportTypeFromDropdown(reportType);
    }
    await this.page.click(this.elements.createReportButton);
    await expect(
      this.page.locator(this.elements.createReportButton),
    ).toBeHidden();
    await this.waitReportTableLoaded();
    this.saveReportIdFromUrl();
  }

  async deleteReport(reportName: string) {
    await this.closeEditMenu();
    await expect(
      this.page.locator(`${this.elements.reportLink} >> text='${reportName}'`),
    ).toBeVisible();
    await this.clickElementWithText(this.elements.reportLink, reportName, true);
    await this.proceedReportDeletion(reportName);
  }

  async proceedReportDeletion(reportName: string) {
    await this.clickElementWithText(this.elements.reportLink, reportName, true);
    await this.clickReportAction('Delete Report');
    await this.waitReportTableLoaded();
  }

  async shareReport(reportName: string, sectionName: ReportSections) {
    await this.createReport(reportName, sectionName);
    await this.closeEditMenu();
    await this.clickElementWithText(this.elements.reportLink, reportName, true);
    await this.clickReportAction('Share Report');
  }

  async selectReportAndExport(reportName: string) {
    await this.page.click(this.elements.closeReportSettings);
    await this.clickElementWithText(this.elements.reportsMenuList, reportName);
    await this.exportReport(true);
  }

  async exportReport(proceedToMyExports = false) {
    await this.page.click(this.elements.reportActionButton);
    await this.page.click(this.elements.reportActionExportButton);
    if (proceedToMyExports) {
      await this.elementContainsText(
        this.elements.confirmExportButton,
        'Take me to my exports',
      );
      await this.page.click(this.elements.confirmExportButton);
    }
  }

  async checkColumnExist(column1: string, column2: string, column3: string) {
    await this.elementContainsText(this.elements.columnList, column1);
    await this.elementContainsText(this.elements.columnList, column2);
    await this.elementContainsText(this.elements.columnList, column3);
  }

  async selectColumn(column: string) {
    await this.clickElementWithText(this.elements.columnCheckboxList, column);
    await this.elementVisible(this.elements.columnCheckboxList);
    await this.elementNotVisible(this.elements.tableRowSpinner);
  }

  async validateColumn(column: string) {
    await this.elementTextNotVisible(this.elements.columnList, column);
  }

  async proceedToEditSection(editSection: string) {
    await this.clickElementWithText(
      this.elements.editTabsList,
      editSection,
      true,
    );
  }

  /* Not sure which section is this, locator does not match left side sections in all parts*/
  async saveReportForName(reportName: string) {
    await this.page.click(this.elements.editReportSaveAs);
    await this.page.fill(this.elements.saveReportAsInputName, reportName);
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(this.elements.saveReportFooterButton),
    ]);
    this.saveReportIdFromUrl();
  }
  /* Not sure which section is this, locator does not match left side sections in all parts*/

  async saveReportAs(reportName: string) {
    generatedReportName = this.generateReportName(reportName);
    await this.saveReportForName(reportName);
    await this.waitForVisibility(this.elements.saveReportFooterButton, false);
    await this.waitReportTableLoaded();
    this.saveReportIdFromUrl();
  }

  async validateReportName(documentReportName: string) {
    await expect(
      this.page.locator(
        this.elements.saveDocumentReportName.selector(documentReportName),
      ),
    ).toContainText(documentReportName);
  }

  async saveReportByDepartment(reportName: string) {
    await this.page.fill(this.elements.saveReportAsInputName, reportName);
    await this.page.click(this.elements.saveReportFooterButton);
    await this.page.waitForNavigation();
    await this.waitReportTableLoaded();
    return this.saveReportIdFromUrl();
  }

  async createFilter(
    filterName: string,
    filterValue: string,
    whichCondition: 'is empty' | 'has any value' | 'is' = 'is',
    applyFilter = false,
  ) {
    await expect
      .poll(
        async (): Promise<boolean> => {
          await this.page.click(this.elements.addNewFilterButton);
          return await this.page
            .locator(this.elements.dropdownFilter.selector(filterName))
            .isVisible({timeout: 1000});
        },
        {
          message: 'Filter dropdown not visible',
          timeout: 10000,
        },
      )
      .toBe(true);
    await this.page.click(this.elements.dropdownFilter.selector(filterName));
    await this.elementVisible(this.elements.filterBody);
    if (filterValue.toLowerCase() === 'empty') {
      await this.page.click(this.elements.filterEmptyResult);
      await this.page.click(this.elements.applyFilterButton);
      await this.elementContainsText(this.elements.filterTabName, filterName);
    } else {
      await this.page.click(
        this.elements.filterSearchValueCondition.selector(whichCondition),
      );
      if ('' !== filterValue) {
        await this.page.fill(this.elements.filterSearchValueInput, filterValue);
        await this.page.click(
          this.elements.filterSearchValueInputResult.selector(filterValue),
        );
        await expect(
          this.page.locator(
            this.elements.filterTabAttribute.selector(filterName),
          ),
        ).toBeVisible();
      }
    }
    if (applyFilter) {
      await this.page.click(this.elements.applyFilterButton);
    }
  }

  async createLocationFilter(filterName: string, filterValue: string) {
    await this.page.click(this.elements.addNewFilterButton);
    await this.page.click(this.elements.dropdownFilter.selector(filterName));
    switch (filterName) {
      case 'Number of Locations':
        await this.page.click(this.elements.filterIsResult);
        await this.page.click(this.elements.filterAnyResult);
        await this.page.fill(this.elements.filterValue, filterValue);
        await this.page.click(this.elements.applyFilterButton);
        break;
      case 'Location':
      case 'Location Flags':
      case 'Record #':
        await this.page.click(this.elements.filterIsResult);
        await this.page.fill(this.elements.searchForLocation, filterValue);
        await this.page.click(this.elements.searchAutoSuggestion);
        break;
      default:
        break;
    }
    await this.waitReportTableLoaded();
  }

  async verifyFilteredData(visibility: boolean, filterValue: string) {
    const elements = await this.page
      .locator(this.elements.rowcount)
      .elementHandles();
    for (let i = 1; i < elements.length - 1; i++) {
      if (visibility) {
        await expect(
          this.page.locator(this.elements.locationCount.selector(i)),
        ).toBeVisible();
      } else if (filterValue) {
        await this.elementContainsText(
          this.elements.locationName.selector(i),
          filterValue,
        );
      } else if (!visibility) {
        await this.elementNotVisible(this.elements.locationCount.selector(i));
      }
    }
  }

  async getAllLocationFlags() {
    const columnElementArray: Array<string> = [];
    const flagValues = await this.page.$$(this.elements.flagLabels);
    for (const flagValue of flagValues) {
      const value = await flagValue.innerText();
      if (!value.includes('+')) {
        columnElementArray.push(value.trim().replace('\n', ','));
      }
    }
    return columnElementArray;
  }

  async clickOnNoOfLocationsColumn(columnName: string) {
    await this.page.click(this.elements.namedColumnHeader.selector(columnName));
    await this.waitReportTableLoaded();
  }

  async editFilter(
    filterName: string,
    newFilterValue: string,
    valueType: string,
  ) {
    // Remove currently selected filter value
    await this.page.click(
      this.elements.closeFilterValueButton.selector(filterName),
    );
    // Add new filter value
    switch (valueType) {
      case 'value':
        if (newFilterValue.toLowerCase() === 'empty') {
          await this.page.click(this.elements.filterEmptyResult);
        } else {
          await this.page.click(this.elements.filterAnyResult);
        }
        break;
      case 'text':
        throw new Error('This functionality currently is not supported');
      case 'option':
        await this.page.click(this.elements.selectOption);
        await this.page.click(
          this.elements.dropdownOption.selector(newFilterValue),
        );
        break;
      default:
        break;
    }
  }

  async checkFilter(filterName: string, filterValue: string | FilterTypes) {
    // Whether the filter is added
    await this.waitReportTableLoaded();
    await this.elementTextVisible(this.elements.filterTabName, filterName);
    // Whether the column is present
    let rows = this.page
      .locator(this.elements.columnsNames)
      .locator(`text="${filterName}"`);
    let count = await rows.count();
    for (let i = 0; i < count; ++i) {
      const cellValue = (await rows.nth(i).textContent()).trim();
      // Skip last row if this row doesn't have any values
      if (i !== count - 1 && cellValue)
        this.validateFilterValue(filterName, cellValue, filterValue);
    }
    // Sort the column ascending if possible and verify again
    await this.page
      .locator(this.elements.columnsNames)
      .locator(`text="${filterName}"`)
      .click();
    await this.waitReportTableLoaded();
    rows = this.page
      .locator(this.elements.columnsNames)
      .locator(`text="${filterName}"`);
    count = await rows.count();
    for (let i = 0; i < count; ++i) {
      const cellValue = (await rows.nth(i).textContent()).trim();
      // Skip last row if this row don't have any values
      if (i !== count - 1 && cellValue)
        this.validateFilterValue(filterName, cellValue, filterValue);
    }
  }

  async validateFilterValue(
    filterName: string,
    actualValue: string,
    filterValue: string,
  ) {
    if (filterValue.toLowerCase() === 'empty') {
      if (filterName.toLowerCase() === 'assignee') {
        expect(actualValue.trim()).toEqual('Unassigned');
      } else {
        expect(actualValue.trim()).toEqual('');
      }
    } else if (filterValue.toLowerCase() === 'any') {
      expect(actualValue, 'Verifying the value is not null').not.toBeNull();
      expect(actualValue, 'Verifying the value is not empty').not.toEqual('');
    } else {
      expect(actualValue.trim()).toEqual(filterValue);
    }
  }

  async proceedToColumnsTab() {
    await this.clickElementWithText(
      this.elements.editTabsList,
      'Columns',
      true,
    );
  }

  async reportPageIsVisible() {
    await this.page.click(this.elements.exploreRecordsButton);
  }

  async clickDepartmentDropdown() {
    await this.page.click(this.elements.departmentDropdown);
  }

  async clickEditInspectionActiveRecords() {
    await this.page.click(this.elements.inspectionsMenu);
    await this.page.click(this.elements.editActiveInspection);
  }

  async clickEditInspectionResultsMenu() {
    await this.page.click(this.elements.inspectionsMenu);
    await this.page.click(this.elements.inspectionResultsMenu);
    await expect(
      await this.page.locator(this.elements.editInspectionResultsMenu),
    ).toBeVisible();
    await this.page.click(this.elements.editInspectionResultsMenu);
  }

  async clickEditPaymentsActiveRecords() {
    await this.reportPageIsVisible();
    await this.page.click(this.elements.paymentsMenu);
    await this.page.click(this.elements.editActivePayments);
  }

  async clickEditReportActiveButton() {
    await this.page.click(this.elements.editActiveReport);
    await this.waitReportTableLoaded();
  }

  async selectReportType(reportType: string) {
    await this.page.click(
      this.elements.reportMenuSelection.selector(reportType),
    );
  }

  async searchReport(reportName: string) {
    await this.page.fill(this.elements.searchReports, reportName);
  }

  async verifyColumnAvailability(reportColumn: string) {
    await this.page.fill(this.elements.dropdownSearchbar, reportColumn);
    await this.elementTextNotVisible(
      this.elements.columnNamePlace,
      reportColumn,
    );
  }

  async verifyFilterOptions(filterByOptions: string[], isVisible: boolean) {
    for (const filterByOption of filterByOptions) {
      if (isVisible) {
        await this.elementTextVisible(
          this.elements.filteredSection,
          filterByOption,
        );
      } else {
        await this.elementTextNotVisible(
          this.elements.filteredSection,
          filterByOption,
        );
      }
    }
  }

  async validateDepartmentDropdown(isVisible: string) {
    if (isVisible === 'is') {
      await this.clickElementWithText(
        this.elements.departmentDropdownItems,
        baseConfig.citTempData.departmentNameText,
      );
    } else if (isVisible === 'is not') {
      await this.elementTextNotVisible(
        this.elements.departmentDropdownItems,
        baseConfig.citTempData.departmentNameText,
      );
    }
  }

  async selectDepartment(departmentName: string) {
    await this.page.click(this.elements.departmentDropdown);
    await this.clickElementWithText(
      this.elements.departmentDropdownItems,
      departmentName,
    );
  }

  async selectDepartmentOnReport(departmentName: string) {
    await this.page.click(this.elements.departmentDropdownOnReportTab);
    await this.clickElementWithText(
      this.elements.departmentDropdownItemsOnReportTab,
      departmentName,
    );
    await this.elementNotVisible(this.elements.tableRowSpinner);
  }

  async selectRecordTypeOnReport(recordTypeName: string) {
    await this.page.click(this.elements.recordTypeDropdownOnReportTab);
    await this.clickElementWithText(
      this.elements.recordTypeDropdownItemsOnReportTab,
      recordTypeName,
    );
    await this.elementNotVisible(this.elements.tableRowSpinner);
  }

  async createNewFormFilter(fieldName: string, filterValue: string = null) {
    let filterOperatorSelector: string;
    if (filterValue) {
      switch (filterValue.toLowerCase()) {
        case 'empty':
          filterOperatorSelector = '.radio [value="11"]';
          break;
        case 'any':
          filterOperatorSelector = '.radio [value="10"]';
          break;
        default:
          filterOperatorSelector = '.radio [value="3"]';
      }
    }
    await this.page.click(this.elements.addNewFormFilterButton);
    await this.page.fill(this.elements.formFilterSearchInput, fieldName);
    await this.page.click(
      this.elements.departmentFormFieldName.selector(fieldName),
    );
    if (filterValue) {
      // Select an operator
      await this.page.click(filterOperatorSelector);
      // Put the string value for "IS" operator
      if (
        filterValue.toLowerCase() !== 'empty' &&
        filterValue.toLowerCase() !== 'any'
      ) {
        await this.page.click(filterOperatorSelector);
        await this.page.fill(
          '#filters-tab input[name="searchFor"]',
          filterValue,
        );
        await this.page.click('#filters-tab .searchResultsContainer h5');
      }
    }
  }

  async validateSearchOptionsDisplayed(dataTable: any) {
    const formVals = await dataTable.raw();
    const vals = await formVals[0];
    for (const element of vals) {
      await this.page.click(this.elements.formFilterOption.selector(element));
      await this.elementVisible(this.elements.formFilterOption.searchFor);
    }
  }

  async validateReportInMyExports(reportName: string) {
    const embeddedRefreshButton = '//button[contains(., "Refresh")]';
    await retry(
      async () => {
        await this.page.waitForTimeout(3000);
        /* Element visible is default wait time, way larger than 3 secs.
                                                                              So we should be adding reduced wait times for such retries
                                                                              Observation is that it definitely never gets the elements at first try.
                                                                              this is a temp fix */
        await this.page.click(embeddedRefreshButton);
        await this.elementVisible(
          this.elements.currentReportEntry.selector(reportName),
        );
      },
      {
        retries: 3,
        minTimeout: 2000,
        maxTimeout: 90000,
      },
    );
  }

  async getReportSectionLocator(
    reportSection: ReportSections,
  ): Promise<Locator> {
    let reportLocators = this.page.locator(
      this.elements.reportMenu.selector(
        ReportSections[reportSection].toLowerCase(),
      ),
    );
    await expect
      .poll(
        async (): Promise<boolean> => {
          reportLocators = this.page.locator(
            this.elements.reportMenu.selector(
              ReportSections[reportSection].toLowerCase(),
            ),
          );
          return (await reportLocators.count()) > 0;
        },
        {
          message: 'Record not visible',
          timeout: 10000,
        },
      )
      .toBe(true);

    const amountOfLocators = await reportLocators.count();
    return amountOfLocators === 1 ? reportLocators : reportLocators[0];
  }

  async proceedToReportSettings(
    reportSection?: ReportSections,
    reportName?: string,
  ) {
    await this.waitReportTableLoaded();
    if (reportName && reportSection) {
      const reportSectionLocator = await this.getReportSectionLocator(
        reportSection,
      );
      const reportLocator = this.page
        .locator(this.elements.tabList, {has: reportSectionLocator})
        .locator(this.elements.reportsMenuList)
        .locator(`text="${reportName}"`);
      await reportLocator.click();
      await reportLocator.locator(this.elements.editButton).click();
    } else {
      await this.page.locator(this.elements.editButton).click();
    }
  }

  async validateStatusFilterForOnHold(filterCol: string) {
    await this.page.click(this.elements.addNewFilterButton);
    await this.page.fill(this.elements.filterInput, filterCol);
    await this.page.click(this.elements.dropdownOption.selector(filterCol));
    await this.page.click(this.elements.selectOption);
    await this.elementVisible(
      this.elements.dropdownOption.selector('Rejected'),
    );
    await this.elementVisible(this.elements.dropdownOption.selector('Skipped'));
    await this.elementVisible(
      this.elements.dropdownOption.selector('Inactive'),
    );
    await this.elementVisible(this.elements.dropdownOption.selector('On Hold'));
    await this.page.click(this.elements.columnFilter);
    await this.elementVisible(this.elements.archivedCheckbox);
  }

  async verifyStatusBarValue(
    expectedValue: RecordStatuses,
    recordNumber?: string,
  ) {
    const reportRow = recordNumber
      ? this.page.locator(this.elements.reportRow, {hasText: recordNumber})
      : this.page.locator(this.elements.reportRow);
    await expect(reportRow.first()).toBeVisible();
    const cellLocator = reportRow.locator(`.trace-${expectedValue}`).first();
    await expect(cellLocator).toBeVisible();
  }

  async proceedToMyExports() {
    await this.page.click(this.elements.threeDotsButton);
    await this.clickElementWithText(
      `${this.elements.threeDotsDropdown} li`,
      'My Exports',
    );
  }

  async selectTimezone(timezone: string) {
    await this.page.click(this.elements.threeDotsButton);
    await this.elementVisible(this.elements.threeDotsDropdown);
    let timezoneSelector: string;
    if (timezone === 'UTC') {
      timezoneSelector = this.elements.utcTimezoneButton;
    } else {
      timezoneSelector = this.elements.localTimezoneButton;
    }
    await this.page.click(timezoneSelector);
    await this.page.click(this.elements.threeDotsButton);
    expect(this.page.locator(timezoneSelector).isChecked()).toBeTruthy();
    await this.page.click(this.elements.threeDotsButton);
  }

  async getColumnIndex(columnName: string, tableElement: string) {
    let columnIndex: number;
    const reportsTable = this.page.locator(tableElement);
    const elements = await reportsTable
      .locator(this.elements.columnsNames)
      .elementHandles();
    for (let i = 0; i < elements.length; i++) {
      const text = (await elements[i].innerText()).trim();
      if (text === columnName) {
        columnIndex = i;
        break;
      }
    }
    expect(columnIndex).not.toBeUndefined();
    return columnIndex;
  }

  async getColumnValueForRecord(
    columnName: string,
    tableElement: string,
    recordNumber = baseConfig.citTempData.recordName,
    nthRow = 1,
  ) {
    const columnIndex = await this.getColumnIndex(columnName, tableElement);
    return this.page
      .locator(
        this.elements.cellByRecordAndIndex.selector(
          recordNumber,
          (columnIndex + 1).toString(),
          nthRow,
        ),
      )
      .innerText();
  }

  async compareInspectionDateValues(
    actualDateValue: any,
    expectedDateValue: Date,
    expectedTimezone: string,
  ) {
    // Convert to the correct format
    const actualInspectionDate = new Date(actualDateValue).toLocaleString(
      'en-US',
    );
    // Convert expected date values to the correct timezone
    let expectedInspectionDate: string;
    if (expectedTimezone.toLowerCase() === 'utc') {
      expectedInspectionDate = expectedDateValue.toLocaleString('en-US', {
        timeZone: 'UTC',
      });
    } else {
      // Get the Community's timezone
      const communitySettings = await new CommonApi().getSystemSettings();
      expect(communitySettings.timeZoneName).not.toBeNull();
      expectedInspectionDate = expectedDateValue.toLocaleString('en-US', {
        timeZone: communitySettings.timeZoneName,
      });
    }
    expect(
      actualInspectionDate,
      `Record # is ${baseConfig.citTempData.recordName}`,
    ).toEqual(expectedInspectionDate);
  }

  async selectRecordType(recordTypeName: string) {
    await this.page.click(this.elements.recordTypeDropdown);
    await this.page.click(
      this.elements.dropdownOption.selector(recordTypeName),
    );
  }

  async closeFilterButton() {
    await this.page.click(this.elements.closeFilterButton);
  }

  async removeAllFilters() {
    let filtersCount = await this.page
      .locator(this.elements.closeFilterButton)
      .count();
    while (filtersCount--) {
      await this.closeFilterButton();
    }
    await this.elementNotVisible(this.elements.closeFilterButton);
  }

  async downloadExportFile() {
    const reportName = `${generatedReportName}`;
    await this.validateReportInMyExports(reportName);
    await this.page.click(
      this.elements.downloadReportButton.selector(reportName),
    );
  }

  async readExportFile(entryType: string, isUtcTimezone: true) {
    const timezoneName = isUtcTimezone ? '(UTC)' : '';
    let downloadedFileName = `${timezoneName}${generatedReportName.replace(
      ' ',
      '-',
    )}`;
    downloadedFileName =
      entryType === 'single'
        ? `${downloadedFileName}`
        : `${downloadedFileName}_-Multi-Entry-Section_multiEntries`;

    // Checking the file in the directory
    let attempts = 30;
    while (attempts--) {
      console.log(
        `Waiting for the file download... Attempts left: ${attempts}`,
      );
      const allFiles: any = fs.readdirSync('downloads');
      // If the file does not exist in the directory
      if (
        allFiles.length === 0 ||
        allFiles.filter((f) => f.includes(downloadedFileName)).length === 0
      ) {
        if (!attempts) {
          // If it is the last attempt
          throw new Error(
            `The following file wasn't found: ${downloadedFileName}`,
          );
        }
        continue;
      }
      downloadedFileName = allFiles.filter((f) =>
        f.includes(downloadedFileName),
      )[0];
      break;
    }
    const data = fs.readFileSync(`downloads/${downloadedFileName}`);
    const csvString = '';
    (csvString as unknown as Buffer) = data;
    const CSV_DATA: any = csvString
      .toString()
      .split(/[\r\n]/)
      .filter((s) => s);
    const keys = CSV_DATA[0].replace(/"/g, '').split(',');
    // Convert to an array of objects.
    // Each key = column name, each value = the column value.
    const OBJECT_DATA = CSV_DATA.slice(1)
      .map((line) =>
        line
          .replace(/"/g, '')
          .split(',') // Array of arrays with values
          .map((v, i) => {
            // Convert each value to object { key: value }
            return {[keys[i]]: v};
          }),
      )
      .map((arr) => Object.assign(arr[0], arr[1])); // Join fields to single object
    return {likeCsv: CSV_DATA, likeObject: OBJECT_DATA};
  }

  async validateDateFormatInExportFile(
    fileData: any,
    columnName: string,
    dateFormat = 'MM/DD/YYYY',
  ) {
    expect(fileData).not.toBeNull();
    expect(fileData.likeObject).not.toBeNull();
    for (const record of fileData.likeObject) {
      if (record[columnName].length !== 0) {
        expect(
          record[columnName].length,
          'Amount of symbols in the date and date format should match',
        ).toEqual(dateFormat.length);

        const date = moment(record[columnName], dateFormat);
        expect(date.isValid()).toBeTruthy();
      }
    }
  }

  async openReportId(reportId: string, departmentName = '') {
    const departmentIdentifier = departmentName
      ? await new DepartmentsApi().getDepartmentIdByName(departmentName)
      : 'all';
    await retry(
      async () => {
        await this.page.goto(
          `${baseConfig.employeeAppUrl}/#/explore/reports/${departmentIdentifier}/${reportId}`,
        );
        await this.waitReportTableLoaded();
      },
      {
        retries: 5,
        maxTimeout: 20000,
      },
    );
  }

  async navigateToFirstItem(itemType: string) {
    const itemSelector: string =
      itemType === 'project'
        ? this.elements.firstDataRowProjectLink
        : this.elements.firstDataRowRecordLink;
    const itemNumber = await this.page.locator(itemSelector).innerText();
    await this.page.click(itemSelector);
    itemType === 'project'
      ? await new ProjectPage(this.page).verifyProjectTitleText(itemNumber)
      : await new InternalRecordPage(this.page).validatePrefixedRecordName(
          itemNumber,
        );
  }

  async addColumn(reportColumn: string) {
    await this.page.fill(this.elements.dropdownSearchbar, reportColumn);
    const checkboxElement = this.page
      .locator(this.elements.reportableColumns)
      .locator(`text="${reportColumn}"`)
      .locator(this.elements.checkbox);
    await checkboxElement.uncheck();
    await this.waitReportTableLoaded();
    await checkboxElement.check();
    await this.waitReportTableLoaded();
  }

  async addColumns(reportColumns: string[]) {
    for (const reportColumn of reportColumns) {
      await this.addColumn(reportColumn);
    }
  }

  async removeColumn(reportColumn: string) {
    await this.page.fill(this.elements.dropdownSearchbar, reportColumn);
    const checkboxElement = this.page
      .locator(this.elements.reportableColumns)
      .locator(`text="${reportColumn}"`)
      .locator(this.elements.checkbox);
    await checkboxElement.uncheck();
    await this.waitReportTableLoaded();
  }

  async createNewReport(
    reportSection: ReportSections,
    reportType: ReportTypes,
    reportName: string,
  ) {
    const reportSectionLocator = await this.getReportSectionLocator(
      reportSection,
    );
    await expect(reportSectionLocator).toBeVisible();
    await reportSectionLocator.hover();
    const createNewBtn = reportSectionLocator.locator(
      this.elements.newReportButton,
    );
    expect(createNewBtn).not.toBeUndefined();
    await this.waitReportTableLoaded();
    await createNewBtn.click();
    await this.page.fill(this.elements.newReportName, reportName);
    await this.selectReportTypeFromDropdown(reportType);
    await this.page.click(this.elements.createReportButton);
    await expect(
      this.page.locator(this.elements.createReportButton),
    ).toBeHidden();
    await this.waitReportTableLoaded();
    this.saveReportIdFromUrl();
  }

  async getCurrentReportSectionId(reportSection: ReportSections) {
    await this.openReportSection(reportSection);
    return this.page.url().split('/').pop();
  }

  async openReportSection(reportSection: ReportSections) {
    const reportSectionLocator = await this.getReportSectionLocator(
      reportSection,
    );
    const isSectionOpened: boolean = await reportSectionLocator
      .locator('[data-toggle="collapse"]')
      .isVisible();

    if (!isSectionOpened) {
      await reportSectionLocator.click();
      await this.waitReportTableLoaded();
    }
    await expect(
      reportSectionLocator.locator('[data-toggle="collapse"]'),
    ).toBeVisible();
    return reportSectionLocator;
  }

  async getColumnLabels() {
    const columns = await this.getAllElementsText(
      this.elements.totalPaidColumn,
    );
    const columnLabels = [];
    for (const column of columns) {
      columnLabels.push(column.trim());
    }
    return columnLabels;
  }

  async navigateToReportTab(reportTab: ReportTabs) {
    await this.page
      .locator(this.elements.reportTab, {hasText: ReportTabs[reportTab]})
      .click();
  }

  // Just for migration, previous name is verifyColumnAdded()
  async isColumnAdded(reportColumn: string) {
    await expect(this.page.locator(this.elements.reportsTable)).toBeVisible();
    return this.page
      .locator(this.elements.reportsTable)
      .locator(this.elements.headerColumn)
      .locator(`text="${reportColumn}"`)
      .isVisible();
  }

  async sortColumn(reportColumn: string) {
    await expect(this.page.locator(this.elements.reportsTable)).toBeVisible();
    await this.page
      .locator(this.elements.reportsTable)
      .locator(this.elements.headerColumn)
      .locator(`text="${reportColumn}"`)
      .click();
  }

  async selectReportTypeFromDropdown(reportType: ReportTypes) {
    const newReportScopeDropdown = this.page.locator(
      this.elements.newReportScopeDropdown,
    );
    const selectedValue = await this.page.$eval(
      this.elements.newReportScopeDropdown,
      (element) => element.textContent,
    );
    if (!selectedValue.includes(reportType)) {
      await newReportScopeDropdown.locator('.caret').click();
      await this.page
        .locator(this.elements.newReportScopeDropdownItem, {
          hasText: reportType,
        })
        .click();
      await expect(
        this.page.locator(this.elements.newReportScopeDropdown),
      ).toContainText(reportType);
    }
  }

  async verifyColumnAdded(reportColumn: string) {
    expect(await this.isColumnAdded(reportColumn)).toBeTruthy();
  }

  async verifyColumnsAdded(reportColumns: string[]) {
    for (const reportColumn of reportColumns) {
      expect(await this.isColumnAdded(reportColumn)).toBeTruthy();
    }
  }

  async waitReportTableLoaded() {
    await expect(this.page.locator(this.elements.reportsTable)).toBeVisible();
    await expect(this.page.locator(this.elements.loader)).toHaveCount(0);
  }

  async extractAndcompare(reportColumns: string[]) {
    const listOfAllCells = await this.page.$$(
      this.elements.namedColumnList.selector(reportColumns[2]),
    );
    const arrayOfValues = [];
    for (const element of listOfAllCells) {
      const textv = (await element.textContent())
        .replace(/(?:\r\n|\r|\n)/g, '')
        .trim();
      arrayOfValues.push(textv);
    }

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    const newArray = [...arrayOfValues].reverse();
    newArray.sort((a, b) => {
      return collator.compare(a, b);
    });
    const isItSorted = newArray.join('') === arrayOfValues.join('');
    expect(isItSorted).toBeTruthy();
  }

  generateReportName(reportName: string) {
    return `${baseConfig.citTestData.plcPrefix}_${faker.random.alphaNumeric(
      4,
    )}_${reportName}`;
  }

  saveReportIdFromUrl() {
    const url = this.page.url();
    console.info(`URL: ${url}`);
    const regexp = new RegExp(/explore\/reports\/(\d+|all)\/(\d+)/g);
    baseConfig.citTempData.reportId = regexp.exec(url)[2];
    console.info('Report ID on save: ', baseConfig.citTempData.reportId);
    return baseConfig.citTempData.reportId;
  }

  async selectFilter(filterName: string) {
    await this.page.click(this.elements.addNewFilterButton);
    await this.page.click(this.elements.dropdownFilter.selector(filterName));
    await expect(this.page.locator(this.elements.filterBody)).toBeVisible();
  }

  async applyFilterCondition(filterValue: string) {
    await this.page.fill(this.elements.formFilterOption.searchFor, filterValue);
    await this.elementVisible(this.elements.formFilterOption.resultRow);
    await this.page.click(this.elements.formFilterOption.resultRow);
  }

  async verifyRecordsCountOnReport(value: number) {
    await expect(this.page.locator(this.elements.reportsTable)).toBeVisible();
    expect(
      Number(await this.page.locator(this.elements.reportRow).count()),
    ).toEqual(value);
  }

  async selectAndApplyFilterCondition(
    condition: filterCondition,
    filterValue: string,
  ) {
    switch (condition) {
      case 'is empty':
      case 'has any value':
        return;
      case 'is':
        break;
      default:
        break;
    }
    await this.page.fill(this.elements.formFilterOption.searchFor, filterValue);
    await this.page.click(this.elements.filterResultRow.selector(filterValue));
    const applyFilterBtn = this.page.locator(this.elements.applyFilterButton);
    if (await applyFilterBtn.isVisible()) await applyFilterBtn.click();
    await expect(applyFilterBtn).toBeHidden();
  }

  async proceedToLedgerFilter() {
    await this.page.click(this.elements.exploreRecordsButton);
    await this.page.click(this.elements.paymentsMenu);
    await this.page.click(this.elements.exploreRecordsPanelLedgerFilters);
    await this.page.click(this.elements.exploreRecordsPanelLedgerFiltersEdit);
  }

  async addLedgerFilterForRecordName() {
    await this.page.click(this.elements.filtersTab);
    await this.page.click(this.elements.addNewFilterButton);
    await this.page.fill(
      this.elements.ledgerFiltersInputfilterName,
      'Record #',
    );
    await this.page.click(this.elements.ledgerFiltersRecordFilterDropdown);

    await this.page.fill(
      this.elements.ledgerFiltersRecordSearch,
      baseConfig.citTempData.recordName,
    );
    await this.page.click(
      this.elements.ledgerFiltersRecordSearchRecordDropdown.selector(
        baseConfig.citTempData.recordName,
      ),
    );
  }

  async filterRecordFromLedger() {
    await this.proceedToLedgerFilter();
    await this.addLedgerFilterForRecordName();
  }

  async verifyCellWithProcessingFees(feesValue) {
    await expect(
      this.page.locator(
        this.elements.ledgerFiltersCreditCardProcessingFeeCell.selector(
          feesValue,
        ),
      ),
    ).toBeVisible();
  }

  async verifyRecordCellValues(title, cellValue) {
    await expect(
      this.page.locator(
        this.elements.customColumnCellValue.selector(title, cellValue),
      ),
    ).toBeVisible();
  }

  async clickReport(
    reportName: string,
    reportSection?: ReportSections,
    exactMatch = true,
  ) {
    if (reportSection) await this.openReportSection(reportSection);
    const report = await this.getReportLocator(reportName, exactMatch);
    await report.click();
    return report;
  }

  async saveReport() {
    await this.page.click(this.elements.saveReportButton);
    await expect(this.page.locator('text="Saved!"')).toBeVisible();
    return this.saveReportIdFromUrl();
  }

  async addNewFilter(
    filterName: string,
    filterType: FilterTypes,
    filterValues?: FilterValues,
    isFormFilter?: boolean,
  ) {
    const formFilterLocator = isFormFilter
      ? this.page.locator(this.elements.addNewFormFilter)
      : this.page.locator(this.elements.addNewFilter);
    await formFilterLocator.click();
    const filterDropdownLocator = this.page.locator(
      this.elements.filterDropDown,
      {has: formFilterLocator},
    );
    await filterDropdownLocator.locator('input').fill(filterName);
    await filterDropdownLocator
      .locator(this.elements.dropdownOption.selector(filterName))
      .click();

    if (filterType === FilterTypes.Is) {
      if (filterValues.search) {
        for (const value of filterValues.search) {
          await this.selectFilterOption(value, true);
        }
      }
      if (filterValues.selectOptions) {
        for (const value of filterValues.selectOptions) {
          await this.selectFilterOption(value);
        }
      }
    } else if (
      filterType === FilterTypes.Empty ||
      filterType === FilterTypes.Any
    ) {
      await this.page
        .locator(this.elements.filterOptions, {hasText: filterType})
        .locator('input')
        .click();
    }
    const applyButton = this.page.locator(this.elements.applyFilterButton);
    if (await applyButton.isVisible()) await applyButton.click();
    await this.waitReportTableLoaded();
  }

  async closeEditMenu() {
    await this.page
      .locator(this.elements.editMenu)
      .locator(this.elements.closeButton)
      .click();
  }

  async clickShareReporModal() {
    await this.page
      .locator(this.elements.reportActionShareTextModal)
      .waitFor({state: 'visible'});
    await this.page.click(this.elements.reportActionShareModalButton);
  }

  async clickReportAction(reportAction: ReportActions) {
    await this.page.click(this.elements.reportActionButton);
    await this.page
      .locator(this.elements.reportBody)
      .locator(this.elements.dropDownMenu)
      .locator('a', {hasText: reportAction})
      .click();
  }

  async selectFilterOption(filterOption: string, isSearchNeeded?: boolean) {
    const filterTab = this.page.locator(this.elements.filtersTab);
    if (await filterTab.locator(this.elements.plusButton).isVisible()) {
      await filterTab.locator(this.elements.plusButton).click();
    }
    let optionLocator: Locator;
    if (isSearchNeeded) {
      await this.page.locator(this.elements.searchForFilter).fill(filterOption);
      optionLocator = this.page
        .locator(this.elements.formFilterOption.resultRow)
        .locator(`text="${filterOption}"`);
    } else {
      await filterTab.locator(this.elements.selectOption).click();
      optionLocator = filterTab
        .locator(this.elements.dropdownItems)
        .locator(`text="${filterOption}"`);
    }
    await expect(optionLocator).toBeVisible();
    await optionLocator.click();
    await expect(optionLocator).toBeHidden();
    await this.waitReportTableLoaded();
  }

  async getReportLocator(reportName: string, exactMatch = true) {
    return this.locateWithText(
      this.elements.reportLink,
      reportName,
      exactMatch,
    );
  }

  async getTotalNamedRows(filterName: string) {
    return (
      await this.page.$$(this.elements.namedColumnList.selector(filterName))
    ).length;
  }

  async getTotalRowsWithText(textValue: string) {
    return (await this.page.$$(this.elements.cellWithText.selector(textValue)))
      .length;
  }

  async getTotalRows() {
    return (await this.page.$$(this.elements.allRows)).length;
  }

  async clickRecordsMenu() {
    await this.page.click(this.elements.recordsMenu);
  }

  async clickActiveInspections() {
    await this.page.click(this.elements.inspectionResultsMenuActiveInspections);
  }

  async clickInspectionsResults() {
    await this.page.click(this.elements.inspectionResultsMenu);
  }

  async clickRecordFromRow(recordNumber = '', whichRow = 1) {
    await this.page.click(
      this.elements.reportRowRecord.selector(recordNumber, whichRow),
    );
  }
  async getColumnListHeadersElements(): Promise<
    ElementHandle<SVGElement | HTMLElement>[]
  > {
    return this.page.$$(this.elements.columnListHeaders);
  }

  async getDropdownFromGeneralTab(dropdownLabel: string): Promise<{
    selectedValue: string;
    dropdownItems: string[];
  }> {
    const dropdownLocator = this.page
      .locator(this.elements.tabContent)
      .locator(this.elements.dropdownBox.selector(dropdownLabel));
    await expect(dropdownLocator).toBeVisible();
    return {
      selectedValue: (
        await dropdownLocator
          .locator(this.elements.dropdownBox.selectedValue)
          .innerText()
      ).trim(),
      dropdownItems: (
        await dropdownLocator
          .locator(this.elements.dropdownBox.dropDownItem)
          .allInnerTexts()
      ).map((e) => {
        return e.trim();
      }),
    };
  }
}

type filterCondition = 'is empty' | 'has any value' | 'is';

export enum ReportSections {
  Records,
  Approvals,
  Payments,
  Documents,
  Inspections,
  Projects,
}

export enum ReportTypes {
  Records = 'Records',
  Approvals = 'Approvals',
  Documents = 'Documents',
  Payments = 'Payments',
  Transactions = 'Transactions',
  Ledger = 'Ledger',
  InspectionResults = 'Inspection Results',
  Inspections = 'Inspections',
  Projects = 'Projects',
}

export enum ReportTabs {
  General,
  Filters,
  Columns,
}

export enum LocationType {
  WithoutLocation = '0',
  PrimaryLocation = '1',
  AdditionalLocation = '2',
}

export enum FilterTypes {
  Empty = 'is empty',
  Any = 'any value',
  Is = 'is',
}

export type FilterValues = {
  selectOptions?: string[];
  search?: string[];
};

export type ReportActions = 'Export Report' | 'Share Report' | 'Delete Report';

export enum RecordStatuses {
  'Rejected' = 'red',
  'Active' = 'blue',
  'Complete' = 'green',
  'Skipped' = 'grey',
  'On Hold' = 'orange',
  'Inactive' = 'default',
}
