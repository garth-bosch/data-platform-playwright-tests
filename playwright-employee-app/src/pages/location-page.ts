import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {Page} from '@playwright/test';
import {expect} from '../base/base-test';
import {LocationModalFill} from './record-pages/location/change-location-page';

interface FillLocation extends LocationModalFill {
  submitOnTop?: boolean;
  submitAtBottom?: boolean;
}
export interface PropertyOwnerInfo extends FillLocation {
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerStreetNo?: string;
  ownerStreetName?: string;
  ownerUnit?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerPostalCode?: string;
}

export class LocationPage extends BaseCitPage {
  readonly elements = {
    locationMap: '.map-bg',
    uploadFilesBtn: '[type="file"]',
    uploadFileText: 'a.attachment-file-name span',
    imageAttachment: '.attachment-thumbnail',
    lineAttachment: '.attachment-line',
    globalSearchBar: '#mainSearchBar_textBox',
    locationSearchResult: '#mainSearchBar .resultRow h5',
    locationName: `//*[@id="locationEditForm"]//h5[contains(text(), 'Name')]/following::i[1]`,
    addFlagBtn: `//button[contains(string(),'Add Flag')]`,
    addAFlagInputBox: `#locationFlagSearchKey_textBox`,
    addFlagText: `//*[contains(@class,'searchResultsContainer list-group')]//*[contains(text(),'Add Flag')]`,
    flagLabel: {
      selector: (flagName) =>
        `//*[contains(@class,'label flag') and text()='${flagName}']`,
    },
    flagMenu: {
      selector: (flagName: string) =>
        `//*[contains(@class,'label flag') and text()='${flagName}']//span[@id='flagmenu']/i`,
    },
    removeFlagLink: {
      selector: (flagName: string) =>
        `//*[contains(@class,'label flag') and text()='${flagName}']//a[contains(string(),'Remove Flag')]`,
    },
    kebabMenu: `button[class='btn btn-default btn-tridot dropdown-toggle']`,
    bulkMove: `//a[contains(string(),'Bulk Move')]`,
    locationToMove: `#locationSearchKey`,
    searchResult: `#location .resultRow`,
    confirmBtn: `//button[contains(text(),'Confirm')]`,
    nextBtn: '[data-test-button="next"]',
    updateAllRecordsBtn: '//strong[contains(text(),"Update all records")]',
    okBtn: `//button[contains(text(),'Ok')]`,
    recordsMovedSucessMessage: `//*[contains(text(),'Records moved successfully!')]`,
    noRecordsMessage: `//*[contains(text(),'No records')]`,
    recordsTable: {
      selector: (recordName: string) =>
        `//*[contains(text(),'Records')]/following::table/tbody//a[contains(normalize-space(), "${recordName}")]`,
    },
    displayOnMapButton: '.displayonmap',
    deleteAttachmentCrossIcon: '.attachment-line-close',
    deleteAttachmentConfirmButton: '.modal-content .bootbox-accept',
    recordWithoutConflict: '[data-test="records-without-conflicts"]',
    recordWithNewLocation: '[data-test="records-already-new-location"]',
    recordReplacePrimary: '[data-test="replace-primary"]',
    recordLeaveAsPrimary: '[data-test="leave-as-primary"]',
    recordAddOrLeave: '[data-test="add-or-leave-as-additional"]',
    recordLabel: '.project-preview',
    attachmentIcon: '.file-view',
    editLocation: '[id="locationEditForm"]  button.btn-default',
    editLocationFormSubDivision:
      '//div[ label[contains(., "Subdivision")] ]/input',
    saveLocationOnTop: '(//button[@type="submit"])[1]',
    saveLocationAtBottom: '(//button[@type="submit"])[2]',
    confirmSaveLocation: '[class="modal-footer"]  button.bootbox-accept',
    locationFormSubdivision: '//div[ label[contains(., "Subdivision") ] ]/p',
    locationFormName: '(//div[ h5[ contains(., "Name")]]//i)[1]',
    noteLink: {
      selector: (type: string) =>
        `#locationEditForm div:nth-child(2) > div.row > div ${type}`,
    },
    noteTextElement: `.froala-editor-container`,
    locationFlag: `.label.flag.pull-left.label`,
    locationTable: `table.table-hover`,
    ownerName: '[placeholder="Owner Name"]',
    ownerPhone: '[placeholder="Phone Number"]',
    ownerEmail: '[placeholder="Owner Email"]',
    ownerStreetNo: '[placeholder="Street No."]',
    ownerStreetName: '[placeholder="Street Name"]',
    ownerUnit: '[placeholder="Unit"]',
    ownerCity: '[placeholder="City"]',
    ownerState: '[placeholder="State"]',
    ownerPostalCode: '[placeholder="Postal Code"]',
    locationTitleOnLocationsPage: '#location-id',
    addUnit: 'a[data-target="#addUnitModal"]',
    addUnitModalInput: '//input[@id="newUnit"]',
    addUnitModalButton:
      '//div[@class="modal-footer"]//button[@class="btn btn-primary"]',
    addedUnit: {
      selector: (type: string) => `//a[text()="${type}"]`,
    },
  };

  async validateLocationPageVisibility() {
    await this.elementVisible(this.elements.locationMap);
  }

  async uploadLocationAttachmentFile(fileType: string) {
    expect(
      ['jpeg', 'pdf', 'csv', 'png', 'docx'].includes(fileType),
    ).toBeTruthy();
    const fileName = `sample.${fileType}`;
    const fileLocation = `./src/resources/cit/${fileName}`;
    await this.page.setInputFiles(
      this.elements.uploadFilesBtn,
      `${fileLocation}`,
    );
    await this.locateWithText(this.elements.uploadFileText, fileLocation);
  }
  async uploadLocationAttachment(fileType: string) {
    await this.page.reload();
    await this.uploadLocationAttachmentFile(fileType);
    await this.elementVisible(
      fileType === 'jpeg' || fileType === 'png'
        ? this.elements.imageAttachment
        : this.elements.lineAttachment,
    );
  }
  async verifyProjectLabelInRecord(labelName: string) {
    await this.locateWithText(this.elements.recordLabel, labelName);
  }

  async editLocation() {
    await this.clickElementWithText(this.elements.editLocation, 'Edit');
  }
  async saveLocationAndConfirm(fillLocationObject: FillLocation) {
    if (fillLocationObject.submitOnTop) {
      await this.clickElementWithText(this.elements.saveLocationOnTop, 'Save');
    }

    if (fillLocationObject.submitAtBottom) {
      await this.clickElementWithText(
        this.elements.saveLocationAtBottom,
        'Save',
      );
    }

    await this.clickElementWithText(
      this.elements.confirmSaveLocation,
      'Confirm',
    );
  }
  async fillEditLocationForm(fillLocationObject: FillLocation) {
    if (fillLocationObject.subDivision) {
      await this.page.fill(
        this.elements.editLocationFormSubDivision,
        fillLocationObject.subDivision,
      );
    }
  }

  async addNewUnit(unitNumber: string) {
    await this.page.click(this.elements.addUnit);
    await this.page.fill(this.elements.addUnitModalInput, unitNumber);
    await this.page.click(this.elements.addUnitModalButton);
  }

  async verifyAddedUnit(unitNumber: string) {
    await expect(
      this.page.locator(this.elements.addedUnit.selector(unitNumber)),
    ).toBeVisible();
  }

  async verifyLocationForm(verifyObject: FillLocation) {
    if (verifyObject.subDivision) {
      await this.elementContainsText(
        this.elements.locationFormSubdivision,
        verifyObject.subDivision,
      );
    }
    if (verifyObject.locationName) {
      await this.elementContainsText(
        this.elements.locationFormName,
        verifyObject.locationName,
      );
    }
  }

  async editAndFillLocation(fillObject: FillLocation) {
    await this.editLocation();
    await this.fillEditLocationForm(fillObject);
    await this.saveLocationAndConfirm(fillObject);
  }

  private async fillOwnerInfo(ownerInfoObject: PropertyOwnerInfo) {
    await this.page.fill(this.elements.ownerName, ownerInfoObject.ownerName);
    await this.page.fill(this.elements.ownerPhone, ownerInfoObject.ownerPhone);
    await this.page.fill(this.elements.ownerEmail, ownerInfoObject.ownerEmail);
    await this.page.fill(
      this.elements.ownerStreetNo,
      ownerInfoObject.ownerStreetNo,
    );
    await this.page.fill(
      this.elements.ownerStreetName,
      ownerInfoObject.ownerStreetName,
    );
    await this.page.fill(this.elements.ownerUnit, ownerInfoObject.ownerUnit);
    await this.page.fill(this.elements.ownerCity, ownerInfoObject.ownerCity);
    await this.page.fill(this.elements.ownerState, ownerInfoObject.ownerState);
    await this.page.fill(
      this.elements.ownerPostalCode,
      ownerInfoObject.ownerPostalCode,
    );
  }

  async updateOwnerInformation(ownerInfoObject: PropertyOwnerInfo) {
    await this.editLocation();
    await this.fillOwnerInfo(ownerInfoObject);
    await this.saveLocationAndConfirm({submitAtBottom: true});
  }

  async searchLocation(searchText: string) {
    await this.page.click(this.elements.globalSearchBar);
    await this.page.fill(this.elements.globalSearchBar, searchText);
    await this.page.click(this.elements.locationSearchResult);
  }

  async validateLocationPageHasName(locationName: string) {
    await this.elementTextNotVisible(this.elements.locationName, locationName);
  }

  async canAddAndRemoveANewLocationFlag(flag?: string) {
    const flagName = flag ? flag : new Date().getTime().toString();
    await this.page.click(this.elements.addFlagBtn);
    await this.page.fill(this.elements.addAFlagInputBox, flagName);
    await this.page.click(this.elements.addFlagText);
    await this.elementVisible(
      this.elements.flagLabel.selector(flagName.toString()),
    );
    await this.page.click(this.elements.flagMenu.selector(flagName.toString()));
    await this.page.click(
      this.elements.removeFlagLink.selector(flagName.toString()),
    );
    await this.elementNotVisible(
      this.elements.flagLabel.selector(flagName.toString()),
    );
  }

  async getLocationWithBulkMove(firstLocation: string, secondLocation: string) {
    await this.searchLocation(firstLocation);

    if (await this.page.locator(this.elements.noRecordsMessage).isVisible()) {
      process.env.SOURCE_LOC = secondLocation;
      process.env.DESTINATION_LOC = firstLocation;
      await this.searchLocation(secondLocation);
    } else {
      process.env.SOURCE_LOC = firstLocation;
      process.env.DESTINATION_LOC = secondLocation;
    }
  }

  async canPerformBulkMove(destinationLocation: string, bulkMoveData: any) {
    await this.page.click(this.elements.kebabMenu);
    await this.page.click(this.elements.bulkMove);
    await this.page.click(this.elements.locationToMove);
    await this.page.fill(this.elements.locationToMove, destinationLocation);
    await this.page.click(this.elements.searchResult);
    await this.page.click(this.elements.updateAllRecordsBtn);
    await this.page.click(this.elements.nextBtn);
    if (bulkMoveData) {
      await this.verifyBulkMoveRecordCount(bulkMoveData);
    }
    await this.page.click(this.elements.confirmBtn);
    await this.elementNotVisible(this.elements.confirmBtn);
    await this.elementVisible(this.elements.noRecordsMessage);
  }

  async closeBulkMovePopup() {
    await this.page.click(this.elements.confirmBtn);
    await this.elementNotVisible(this.elements.confirmBtn);
  }

  async verifyBulkMoveRecordCount(bulkMoveData: any) {
    let recordAction: string;
    for (const key in bulkMoveData) {
      const value = bulkMoveData[key];
      switch (key.toLowerCase()) {
        case 'recordwithoutconflict':
          recordAction = this.elements.recordWithoutConflict;
          break;
        case 'recordwithnewlocation':
          recordAction = this.elements.recordWithNewLocation;
          break;
        case 'recordreplaceprimary':
          recordAction = this.elements.recordReplacePrimary;
          break;
        case 'recordleaveasprimary':
          recordAction = this.elements.recordLeaveAsPrimary;
          break;
        case 'recordaddorleave':
          recordAction = this.elements.recordAddOrLeave;
          break;
        default:
          throw new Error(`Case "${key}" does not match`);
      }
      await expect.soft(this.page.locator(recordAction)).toContainText(value);
    }
  }
  async clickDisplayOnMapButton() {
    await this.page.click(this.elements.displayOnMapButton);
  }

  async deleteAllAttachments() {
    const crossIconElt = this.elements.deleteAttachmentCrossIcon;
    const confirmElt = this.elements.deleteAttachmentConfirmButton;
    const handles = this.page.locator(crossIconElt);
    for (const el of await handles.elementHandles()) {
      await el.click();
      await this.page.locator(confirmElt).click();
    }
  }

  async deleteAttachment() {
    await this.page.click(this.elements.deleteAttachmentCrossIcon);
    await this.page.click(this.elements.deleteAttachmentConfirmButton);
  }

  async openAttachmentByIndex(index: number) {
    const attachmentElt = this.page.locator(this.elements.attachmentIcon);
    await (await attachmentElt.elementHandles()).at(index).click();
  }

  async addNotesToLocation(text: string) {
    await this.page.click(this.elements.noteLink.selector('a'));
    await this.page.click(this.elements.noteTextElement);
    await this.page.type(this.elements.noteTextElement, text);
    await this.page.click(this.elements.saveLocationOnTop);
    await this.page.click(this.elements.confirmBtn);
  }

  async navigateToLocationPageById(
    locationId = baseConfig.citTempData.locationId,
  ): Promise<void> {
    await this.page.goto(
      `${baseConfig.employeeAppUrl}/#/explore/locations/${locationId}`,
    );
  }

  async downloadAttachment(fileType: string) {
    if (
      fileType == 'docx' ||
      (fileType == 'pdf' && ['true', undefined].includes(process.env.HEADLESS)) //pdf downloads instead of preview in chrome headless mode
    ) {
      const [download] = await Promise.all([
        this.page.waitForEvent('download'),
        await this.page
          .locator(this.elements.uploadFileText, {hasText: fileType})
          .click(),
      ]);
      await download.path();
      const path = download.suggestedFilename();
      await download.saveAs(`./downloads/${path}`);
      expect(download.suggestedFilename()).toContain(fileType);
    } else {
      let attachmentPage: Page;
      if (fileType == 'jpeg') {
        [attachmentPage] = await Promise.all([
          this.page.context().waitForEvent('page'),
          await this.page.locator(this.elements.imageAttachment).click(),
        ]);
      } else {
        [attachmentPage] = await Promise.all([
          this.page.context().waitForEvent('page'),
          await this.page
            .locator(this.elements.uploadFileText, {hasText: fileType})
            .click(),
        ]);
      }

      await this.verifyNewTabWithAttachmentOpened(attachmentPage);
    }
  }

  async verifyNewTabWithAttachmentOpened(attachmentPage: Page) {
    expect(attachmentPage.url()).toContain(
      'uploadedfiles.blob.core.windows.net',
    );
    if (!attachmentPage.url().includes('.pdf')) {
      //not working for pdf files
      await expect(
        attachmentPage.locator('[src*="uploadedfiles.blob.core.windows.net"]'),
      ).toBeVisible();
    }
    await attachmentPage.close();
  }

  async getDetailsPropertyValue(label: string): Promise<string | undefined> {
    const propertyElement = this.page
      .locator('div.col-sm-8', {
        has: this.page.locator('label', {hasText: label}),
      })
      .locator('p');

    if (await propertyElement.isVisible()) {
      const value = await propertyElement.textContent();
      return value.replace('\n', '').trim();
    } else {
      return undefined;
    }
  }
}
