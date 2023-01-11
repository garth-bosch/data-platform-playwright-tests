import {expect} from '../base/base-test';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {SelectRecordTypePage} from './select-record-type-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
export class NavigationBarPage extends BaseCitPage {
  readonly elements = {
    recordID: '#record-number',
    userIcon: '[class="topbar-user-pic"]',
    userProfileLink: '//a[contains(.,"User Profile")]',
    logoutButton:
      '[class="dropdown-menu dropdown-menu-right"] a[class="pointer"]',
    openGovLogo: '.menu-desktop .svg-opengov-logobug',
    globalSearchBar: '#mainSearchBar_textBox',
    searchResultsSpinner: '.searchResultsContainer .list-group-item.text-muted',
    searchResults: '.searchResultsContainer div.resultRow.list-group-item',
    searchResultsRowText: {
      selector: (textValue: string) =>
        `//*[@id="mainSearchBar"]//*[contains(@class,"media-body") and contains(.,"${textValue}")]`,
    },
    searchSpinner: 'i.fa-spin',
    notificationsButton: '#notifications-button',
    notificationsIcon: '#notification-dropdown-item',
    notifications: '#notifications-list .media',
    inboxItems: '[data-test-inbox="item"]',
    inboxItemsText: '[data-test-link="web"] h5[data-test-item="label"]',
    notificationSettings: 'a[href="#/notification-settings"]',
    bellNotificationBadge: '.notification-bell .badge',
    notificationListElements: '#notifications-list .notification-body-text',
    markAllReadButton: `//*[@id='notifications-pane']//a[contains(.,'Mark all read')]`,
    supportButtonDropdown: '#support-dropdown-item',
    helpDocItem:
      '//*[@id="support-dropdown-item"]//li/a[contains(normalize-space(.),"OpenGov Help")]',
    ideasAndRoadmanItem:
      '//*[@id="support-dropdown-item"]//li/a[contains(normalize-space(.),"Ideas & Roadmap")]',
    chatSupportItem: '#intercom_launcher',
    createRecordButton: '#create-record',
    exploreRecordsButton: '#sidebar-explore-btn',
    exploreInboxButton: '#sidebar-inbox-btn',
    exploreInspectionsButton: '#sidebar-inspect-btn',
    exploreRenewalsButton: '#sidebar-renew-btn',
    adminSettingsButton: '#sidebar-settings-btn',
    exploreReportsButton: '[href="#/explore/reports"]',
    // :
    nthBellNotificationTitle: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]`,
    },
    givenBellNotificationMessageUnread: {
      selector: (firstOrNth = 1, givenText = '') =>
        `(//a[contains(@href, "explore")]//div[contains(@class, 'notification-body-text') and contains(.,"${givenText}")])[${firstOrNth}]`,
    },
    firstBellNotificationMessage: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]//div[ contains(@class, "notification-body-text")]`,
    },
    nthBellNotificationMarkAsRead: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]//button[ span/span[@data-hint="Mark notification as read"]]`,
    },
    nthBellNotificationMarkAsReadIconRead: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]//button[ span/span[@data-hint="Mark notification as read"]]//i[@class="fa fa-circle-thin"]`,
    },
    nthBellNotificationMarkAsReadIconUnread: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]//button[ span/span[@data-hint="Mark notification as read"]]//i[contains(@class,"fa-circle") and not(contains(@class,"fa-circle-thin"))]`,
    },
    nthBellNotificationRemoveNotification: {
      selector: (firstOrNth = 1) =>
        `(//*[contains(@id,'notifications-list')]//a[contains(@class, "list-group-item")])[${firstOrNth}]//button[ span[@data-hint="Delete notification"]]`,
    },
    reportsGroupMenuList: {
      selector: (sectionName) => `#reports-menu-${sectionName}`,
    },
    exploreMapButton: '#explore-topbar ul.nav.navbar-nav  li:nth-of-type(2)',
    exploreAnalyticsButton:
      '#explore-topbar ul.nav.navbar-nav  li:nth-of-type(3)',
    spinner: '.ember-application .spinner',
    searchResultsLocationIcon: {
      selector: (resName) =>
        `//h5[text()='${resName}']/../../div/img[contains(@src, '/profile-pictures/location')]`,
    },
    inboxUnreadCounter: '#sidebar-inbox-btn .badge',
  };

  async getInboxCounterNumber() {
    // This element isn't available if there are no notifications
    if (
      (await this.page.locator(this.elements.inboxUnreadCounter).count()) > 0
    ) {
      return this.page
        .locator(this.elements.inboxUnreadCounter)
        .innerText({timeout: 5000});
    } else {
      // if its not present then there are 0 notifications
      return '0';
    }
  }

  async clickExploreReportsButton() {
    await this.page.click(this.elements.exploreReportsButton);
  }

  async proceedToRecordByNumber(recordNumber: string) {
    await expect(
      this.page.locator(this.elements.globalSearchBar),
    ).toBeVisible();
    await this.performSearchContaining(recordNumber, recordNumber);
    await this.page.click(this.elements.searchResults);
    await expect(this.page.locator(this.elements.recordID)).toBeVisible();
  }

  async logout() {
    await this.page.click(this.elements.userIcon);
    await this.page.click(this.elements.logoutButton);
  }

  async validateOpenGovLogoVisibility(visible = false) {
    await this.page.waitForSelector(
      this.elements.openGovLogo,
      visible ? this.isVisible : this.isNotVisible,
    );
  }

  async clickNotificationButton() {
    await this.page.click(this.elements.notificationsButton);
  }

  async verifyGivenUnreadMessageNotificationText(whichOne = 1, givenText = '') {
    this.elementVisible(
      this.elements.givenBellNotificationMessageUnread.selector(
        whichOne,
        givenText,
      ),
    );
  }

  async getTotalUnreadNotifications(isMaxExpected = true) {
    try {
      let totalNotificications;
      const totalText = await this.page
        .locator(this.elements.bellNotificationBadge)
        .textContent();
      /* Is max expected - When the notifications are max, there is a + symbol which needs to be
                              replaced before converting to get how many notifications are there*/
      if (isMaxExpected) {
        totalNotificications = totalText
          .replace('\n', '')
          .replace('+', '')
          .trim();
        return Number(totalNotificications);
      } else {
        totalNotificications = totalText.replace('\n', '').trim();
        return totalNotificications;
      }
    } catch (e) {
      /* Sometimes possible to have zero notifications or existing elements etc .. so default then is 0*/
      return 0;
    }
  }

  /**
   * Gets notifications
   * @returns array of innner text items
   */
  async getNotifications(): Promise<string[]> {
    await this.page.locator(this.elements.notificationsIcon).click();
    const text = await this.page
      .locator(this.elements.notificationListElements)
      .allInnerTexts();
    return text;
  }

  async getNotificationListItemColors(whichItem = 1) {
    const listItem = this.page.locator(
      this.elements.nthBellNotificationTitle.selector(whichItem),
    );
    //
    const color = await listItem.evaluate((element) =>
      window.getComputedStyle(element).getPropertyValue('background'),
    );
    return [color.split(')')[0].replace('rgb(', '')];
  }

  async verifyNotificationListItemUnread(
    countUnReadItems: number,
    whichItem = 1,
  ) {
    const colorsArray = await this.getNotificationListItemColors();
    expect(colorsArray[0]).toBe(`239, 242, 245`);
    await expect(
      this.page.locator(
        this.elements.nthBellNotificationMarkAsReadIconUnread.selector(
          whichItem,
        ),
      ),
    ).toHaveCount(countUnReadItems);
  }

  async verifyNotificationListItemRead(whichItem = 1, countUnReadItems = 0) {
    const colorsArray = await this.getNotificationListItemColors();
    expect(colorsArray[0]).toBe(`255, 255, 255`);
    await expect(
      this.page.locator(
        this.elements.nthBellNotificationMarkAsReadIconUnread.selector(
          whichItem,
        ),
      ),
    ).toHaveCount(countUnReadItems);
  }

  async markGivenUnreadNotification(whichItem = 1) {
    await this.page.click(
      this.elements.nthBellNotificationMarkAsRead.selector(),
    );
    await this.verifyNotificationListItemRead(whichItem, 0);
    await this.page.reload();
  }

  async removeNthNotificationItemAndVerify(
    whichNumber = 1,
    textValue = baseConfig.citTempData.recordName,
    containsItemTextAfterRemoval = false,
  ) {
    await this.page
      .locator(
        this.elements.nthBellNotificationRemoveNotification.selector(
          whichNumber,
        ),
      )
      .click();
    await this.page
      .locator(
        this.elements.nthBellNotificationRemoveNotification.selector(
          whichNumber,
        ),
      )
      .click();
    await this.clickNotificationButton();
    await this.page.reload();
    await this.clickNotificationButton();
    await this.verifyNotificationListItemNotContainsTextOrNot(
      whichNumber,
      textValue,
      containsItemTextAfterRemoval,
    );
  }

  async verifyNotificationListItemNotContainsTextOrNot(
    whichNumber: number,
    textValue: string,
    containsText = true,
  ) {
    const textContValue = (
      await this.page
        .locator(
          this.elements.firstBellNotificationMessage.selector(whichNumber),
        )
        .textContent()
    )
      .replace('\n', '')
      .trim();
    if (containsText) {
      expect(textContValue).toContain(textValue);
    } else {
      expect(textContValue).not.toContain(textValue);
    }
  }

  async verifyNotificationbadgeContainsAtleast(notifications: number) {
    const totalNootications = await this.getTotalUnreadNotifications();
    expect(totalNootications).toBeGreaterThanOrEqual(notifications);
  }

  async verifyNotificationbadgeContainsMax() {
    await this.page.reload();
    const totalNootications = await this.getTotalUnreadNotifications(false);
    expect(totalNootications).toMatch('15+');
  }

  async validateNotificationVisibility(isVisible = true) {
    isVisible
      ? await this.page.waitForSelector(
          this.elements.notificationsButton,
          this.isVisible,
        )
      : await this.page.waitForSelector(
          this.elements.notifications,
          this.isNotVisible,
        );
  }

  async validateBellNotificationPresent(
    notificationTitle: string,
    notificationMessage = '',
  ) {
    await this.page.waitForSelector(this.elements.spinner, this.isNotVisible);
    await this.page.click(this.elements.notificationsButton);
    await expect(
      this.page.locator(this.elements.nthBellNotificationTitle.selector()),
    ).toContainText(notificationTitle);

    if (notificationMessage) {
      const message = notificationMessage.startsWith(notificationTitle)
        ? notificationMessage
        : `${notificationTitle} ${notificationMessage}`;
      await expect(
        this.page.locator(
          this.elements.firstBellNotificationMessage.selector(),
        ),
      ).toContainText(message);
    }
  }

  async markAllBellNotificationAsRead(optional = true) {
    const isMarkAllReadVisible = await this.page
      .locator(this.elements.markAllReadButton)
      .isVisible();
    if (optional) {
      if (isMarkAllReadVisible) {
        await this.page.click(this.elements.markAllReadButton);
        await this.page.reload();
      }
    } else {
      expect(isMarkAllReadVisible).toBeTruthy();
      await this.page.click(this.elements.markAllReadButton);
      await this.page.reload();
    }
  }

  async clickAndMarkAllBellNotificationAsRead(optional = true) {
    await this.clickNotificationButton();
    await this.markAllBellNotificationAsRead(optional);
  }

  async clickSupportButton() {
    await this.page.click(this.elements.supportButtonDropdown);
  }

  async clickOpenGovHelpButton() {
    await this.page.click(this.elements.helpDocItem);
  }

  async navigateToOpenGovHelp() {
    await this.clickSupportButton();
    await this.clickOpenGovHelpButton();
  }

  async validateHelpDocVisibility() {
    await this.page.waitForSelector(this.elements.helpDocItem, this.isVisible);
  }

  async validateChatSupportVisibility(isVisible = true) {
    await this.page.waitForSelector(
      this.elements.chatSupportItem,
      isVisible ? this.isVisible : this.isNotVisible,
    );
  }

  async performSearchContaining(
    searchText: string,
    searchResult: string = searchText,
  ) {
    const searchBar: string = this.elements.globalSearchBar;
    await this.page.click(searchBar);
    await this.page.fill(this.elements.globalSearchBar, searchText);
    await this.page.waitForSelector(
      this.elements.searchSpinner,
      this.isNotVisible,
    );

    await expect(
      await this.page
        .locator(this.elements.searchResultsRowText.selector(searchResult))
        .count(),
    ).toBeGreaterThan(0);
  }

  async clickCreateRecordButton(): Promise<SelectRecordTypePage> {
    await this.page.click(this.elements.createRecordButton);
    return new SelectRecordTypePage(this.page);
  }

  async clickRenewButton() {
    await this.page.click(this.elements.exploreRenewalsButton);
  }

  async clickExploreRecordButton() {
    await this.page.click(this.elements.exploreRecordsButton);
  }

  async clickExploreInboxButton() {
    await this.page.click(this.elements.exploreInboxButton);
  }

  async clickExploreInspectionsButton() {
    await this.page.click(this.elements.exploreInspectionsButton);
  }

  async clickExploreRenewalsButton() {
    await this.page.click(this.elements.exploreRenewalsButton);
  }

  async validateSettingsButtonVisibility(isVisible = true) {
    await this.page.waitForSelector(
      this.elements.adminSettingsButton,
      isVisible ? this.isVisible : this.isNotVisible,
    );
  }

  async validateInboxItemsVisible() {
    await this.page.waitForSelector(this.elements.inboxItems, this.isVisible);
  }

  async getAllInboxItems() {
    const itemsText = await this.page
      .locator(this.elements.inboxItemsText)
      .allTextContents();
    const regexp = '\\n';
    const trimmedItemsText = itemsText.map((element) => {
      return element.replace(regexp, '').trim();
    });
    return trimmedItemsText;
  }

  async clickAdminSettingsButton() {
    await this.page.click(this.elements.adminSettingsButton);
  }

  async proceedToReport(sectionName: string) {
    await this.page.click(this.elements.exploreRecordsButton);
    await this.page.waitForSelector(
      this.elements.reportsGroupMenuList.selector('records-active-records'),
      this.isVisible,
    );
    await this.page.click(
      this.elements.reportsGroupMenuList.selector(sectionName.toLowerCase()),
    );
  }

  async proceedToMap() {
    await this.page.click(this.elements.exploreRecordsButton);
    await this.page.click(this.elements.exploreMapButton);
  }

  async proceedToAnalytics() {
    await this.page.click(this.elements.exploreRecordsButton);
    await this.page.click(this.elements.exploreAnalyticsButton);
  }

  async performSearch(searchText: string) {
    const searchBar: string = this.elements.globalSearchBar;
    await this.page.click(searchBar);
    await this.page.fill(this.elements.globalSearchBar, searchText);
  }

  /*Provide default for row search*/
  async performGlobalSearchAndClick(searchText: string, textForRow = '') {
    await this.performSearch(searchText);
    this.waitForVisibility(this.elements.searchResultsSpinner, false);
    if (textForRow.length > 1) {
      await this.page.click(
        this.elements.searchResultsRowText.selector(textForRow),
      );
    } else {
      await this.page.click(this.elements.searchResults, {strict: false});
    }
  }

  async verifySearchResultsContainKeyword(keyword: string) {
    await expect(
      await (
        await this.page.locator(this.elements.searchResults).allInnerTexts()
      ).toString(),
    ).toContain(keyword);
  }

  async verifySearchResultsContainLocationIcon(resultsName: string) {
    await this.page.waitForSelector(
      this.elements.searchResultsLocationIcon.selector(resultsName),
      this.isVisible,
    );
  }

  async clickNotificationSettingsButton() {
    await this.page.click(this.elements.notificationSettings);
  }

  async clickUserProfileLink() {
    await this.page.click(this.elements.userIcon);
    await this.page.click(this.elements.userProfileLink);
  }
}
