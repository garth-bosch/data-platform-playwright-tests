import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '../base/base-test';
import retry from 'async-retry';

export class UserHomePage extends BaseCitPage {
  readonly elements = {
    userIcon: 'div.navbar-right.desktop > ul > div > button > img',
    logoutButton:
      'div.navbar-right.desktop > ul > div > ul > li:nth-child(3) > a',
    myAccountButton: '[id="my-account-desktop"]',
    recordTypeFilterField: '[name="record-type-filter"]',
    recordTypeSearchResult: {
      selector: (result) =>
        `//div[@class='autocomplete-result-item ' and text()='${result}']`,
    },
    recordTypeTextBox: '#record-type-filter',
    renewalRecord: {
      selector: (record) =>
        `//small[contains(normalize-space(),'${record}')]/parent::span/parent::td/following-sibling::td/button`,
    },
    confirmBeginRenewal: `button[data-bb-handler='confirm']`,
    renewalSubmission: `#submit-progress`,
    searchButton: '.nav.navbar-nav li:nth-of-type(2) a',
    recordTab: '#record-tab',
    inputRecordID: '#recordSearchKey',
    recordSearchNoResult:
      '//*[@class="list-group"]/span[contains(text(),"No results found")]',
    recordSearchResult: '.list-group a',
    recordSearchResultHavingText: {
      selector: (locationId, textValue) =>
        `//*[contains(@class, "list-group")]/a[contains(@href, "/locations/${locationId}") and contains(.,"${textValue}")]`,
    },
    filesTab: `.nav.nav-tabs li a[href='#files']`,
    attachmentVisibilty: {
      selector: (attachmentName) => `//span[text()='${attachmentName}']`,
    },
    attachmentContainer: '.file-selected-outline',
    attachmentInfo: '.file-selected-outline small:nth-of-type(1)',
    attachmentFileVersionOrder: 'tr[data-test-version] td:nth-of-type(2)',
    inspectionLink: '#profile-inspections-button',
    locationTab: '#location-tab',
    locationSearchTextBox: '#locationSearchKey',
    projectOrDepartmentHeader: {
      selector: (templateName) => `//h4[text()='${templateName}']`,
    },
    projectTemplateTitle: '.category-tile-heading',
    projectOrDepartmentHelpText: '.fr-view.ember-view',
    pageContentLink: '.fr-view.ember-view a',
    departmentTitle: {
      selector: (name) =>
        `//*[text()="${name}"]/../../*[@class="panel-footer"]//a`,
    },
    questionTitle: '.col-sm-8 h5',
    organizationLogo: '.brand-image',
    signUpButton: '.nav a[href="/sign-up"]',
    claimRecordButton: '[href="/claimRecord"]',
    claimRecordInput: '[name=recordClaimCode]',
  };

  async logout() {
    const userIconElement: string = this.elements.userIcon;
    const logoutButtonElement: string = this.elements.logoutButton;

    await this.page.click(userIconElement);
    await this.page.click(logoutButtonElement);
  }

  async proceedToRecordById() {
    await this.validateMyAccountButtonVisibility(true);
    const recdId = baseConfig.citTempData.recordId;
    const stepId = baseConfig.citTempData.stepId;
    await this.page.goto(
      `${baseConfig.employeeAppUrl}/track/${recdId}/step/${stepId}`,
    );
  }

  async validateMyAccountButtonVisibility(isVisible = false) {
    const myAccountButtonElement: string = this.elements.myAccountButton;
    await this.waitForVisibility(myAccountButtonElement, isVisible);
  }

  async verifyNoSearchResult() {
    const recordTypeResultLocator =
      this.elements.recordTypeSearchResult.selector('No results');

    await this.page.click(this.elements.recordTypeFilterField);
    await this.page.fill(
      this.elements.recordTypeFilterField,
      'storefront_enabled_do_not_delete',
    );
    await this.waitForVisibility(recordTypeResultLocator);
  }

  async validateRecordTypeSearchResult(recordType: string) {
    const recordTypeResultLocator =
      this.elements.recordTypeSearchResult.selector(recordType);
    await this.page.click(this.elements.recordTypeFilterField);
    await this.page.fill(this.elements.recordTypeFilterField, recordType);
    await this.waitForVisibility(recordTypeResultLocator);
  }

  async validateRecordIsAvailableForRenewal(recordRenewal: boolean) {
    await this.page.click(
      this.elements.renewalRecord.selector(baseConfig.citTempData.recordName),
    );
    await this.page.click(this.elements.confirmBeginRenewal);
    await this.waitForVisibility(
      this.elements.renewalSubmission,
      recordRenewal === true,
    );
  }

  async searchForRecord(recordName = baseConfig.citTempData.recordName) {
    await retry(
      async () => {
        await this.page.click(this.elements.searchButton);
        await this.page.click(this.elements.recordTab);
        await this.page.fill(this.elements.inputRecordID, '');
        await this.page.fill(this.elements.inputRecordID, recordName);
        await this.page.click(this.elements.recordSearchResult, {
          timeout: 5000,
        });
      },
      {
        retries: 5,
        minTimeout: 10000,
        maxTimeout: 20000,
      },
    );
  }

  async goToPublicSearchPage() {
    await this.page.click(this.elements.searchButton);
  }

  async fillLocationSearchText(locationAddressString: string) {
    await this.page.fill(
      this.elements.locationSearchTextBox,
      locationAddressString,
    );
  }

  async searchAndFillLocation(locationAddressString) {
    await this.goToPublicSearchPage();
    await this.fillLocationSearchText(locationAddressString);
  }

  async searchForLocation(
    locationAddressOrName: string,
    verifyIfPresent = true,
    fullAddress?: string,
  ) {
    const passAddress = fullAddress ? fullAddress : locationAddressOrName;
    await this.searchAndFillLocation(locationAddressOrName);
    if (verifyIfPresent) {
      await expect(
        this.page.locator(
          this.elements.recordSearchResultHavingText.selector(
            baseConfig.citTempData.locationId,
            passAddress,
          ),
        ),
      ).toBeVisible();
    } else {
      await expect(
        this.page.locator(
          this.elements.recordSearchResultHavingText.selector(
            baseConfig.citTempData.locationId,
            passAddress,
          ),
        ),
      ).toBeHidden();
    }
  }

  async searchAndNavigateToLocation(
    locationAddressString: string,
    locationId = baseConfig.citTempData.locationId,
    verifyIfPresent = true,
  ) {
    await this.searchForLocation(locationAddressString, verifyIfPresent);
    await this.page.click(
      this.elements.recordSearchResultHavingText.selector(
        locationId,
        locationAddressString,
      ),
    );
  }

  async accessPublicRecordById(recordId: string) {
    const resultStatus = -1;
    while (resultStatus === -1) {
      await this.page.goto(`${baseConfig.storefrontUrl}/records/${recordId}`);
      await this.waitForVisibility(this.elements.filesTab);
    }
  }

  async publicAttachmentInfoContainsText(text: string) {
    await this.elementContainsText(this.elements.attachmentInfo, text);
  }
  async clickAttachmentContainer() {
    await this.page.click(this.elements.attachmentInfo);
  }
  async verifyAttachmentVisibility(isVisible: boolean, attachmentName: string) {
    await this.page.click(this.elements.filesTab);
    await this.waitForVisibility(
      this.elements.attachmentVisibilty.selector(attachmentName),
      isVisible,
    );
  }

  async navigateToInspectionPage() {
    await this.page.click(this.elements.myAccountButton);
    await this.page.click(this.elements.inspectionLink);
  }

  async verifyLocationTabVisibility(isVisible: boolean) {
    await this.page.click(this.elements.searchButton);
    await this.waitForVisibility(
      this.elements.locationSearchTextBox,
      isVisible,
    );
  }

  async verifyRecordsTabVisibility(isVisible: boolean) {
    await this.page.click(this.elements.searchButton);
    await this.waitForVisibility(this.elements.inputRecordID, isVisible);
  }

  async validateProjectTemplateVisibility(isVisible: boolean) {
    const templateName = baseConfig.citTempData.projectTemplateName;
    await this.waitForVisibility(
      this.elements.projectOrDepartmentHeader.selector(templateName),
      isVisible,
    );
  }

  async validateDepartmentVisibility(isVisible: boolean) {
    const departmentName = baseConfig.citTempData.departmentNameText;
    await this.waitForVisibility(
      this.elements.projectOrDepartmentHeader.selector(departmentName),
      isVisible,
    );
  }

  async proceedToProjectTemplate(name: string = null) {
    const headerName = name ? name : baseConfig.citTempData.projectTemplateName;

    await this.clickElementWithText(
      this.elements.projectTemplateTitle,
      headerName,
    );
  }

  async proceedToDepartment(name: string = null) {
    const headerName = name ? name : baseConfig.citTempData.departmentNameText;
    await this.page.click(this.elements.departmentTitle.selector(headerName));
  }

  async verifyProjectOrDepartmentHelpText(type: string, text: string = null) {
    let expectedHelpText: string;
    if (text) {
      expectedHelpText = text;
    } else {
      if (type === 'project') {
        expectedHelpText = baseConfig.citTempData.projectTemplateName;
      } else {
        expectedHelpText = baseConfig.citTempData.departmentNameText;
      }
    }
    await this.elementContainsText(
      this.elements.projectOrDepartmentHelpText,
      expectedHelpText,
    );
  }

  async verifyProjectQuestion() {
    await this.elementContainsText(this.elements.questionTitle, 'To do?');
  }

  async clickClaimRecord() {
    await this.page.click(this.elements.claimRecordButton);
  }

  async verifyOrgLogoSrcMatches(logoName: string, logoExt: string) {
    const d = new Date();
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    const da = new Intl.DateTimeFormat('en', {weekday: 'short'}).format(d);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    const fileNameRegexp = new RegExp(`${logoName}_${da}_${mo}_${day}_${ye}`);

    await expect(
      this.page.locator(this.elements.organizationLogo),
    ).toHaveAttribute('src', fileNameRegexp);

    await expect(
      this.page.locator(this.elements.organizationLogo),
    ).toHaveAttribute('src', new RegExp(logoExt));
  }

  async clickSignupButton() {
    await this.page.click(this.elements.signUpButton);
  }
  async verifySearchResultForRecord(shouldBeVisible = true) {
    await this.page.click(this.elements.searchButton);
    await this.page.click(this.elements.recordTab);
    await this.page.fill(
      this.elements.inputRecordID,
      baseConfig.citTempData.recordName,
    );
    if (!shouldBeVisible) {
      await this.elementVisible(this.elements.recordSearchNoResult);
    } else {
      await this.elementNotVisible(this.elements.recordSearchNoResult);
    }
  }
  async clickContentLinkWithText(textLink: string) {
    await this.page
      .locator(this.elements.pageContentLink, {hasText: textLink})
      .click();
  }
}
