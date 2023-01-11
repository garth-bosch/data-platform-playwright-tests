import retry from 'async-retry';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {expect} from '../base/base-test';

export class RenewPage extends BaseCitPage {
  readonly elements = {
    newCampaignButton: '.flex-nav-group-right button',
    campaignName: 'input[name="campaignName"]',
    recordTypeSelect: 'select[name="campaignRecordType"]',
    firstRecordTypeSelect: 'optgroup:nth-child(2) option:nth-child(1)',
    campaignStartDate: 'input[name="campaignStartDate"]',
    campaignEndDate: 'input[name="campaignEndDate"]',
    daysBeforeExpiration: 'input[name="daysBeforeExpiration"]',
    daysAfterExpiration: 'input[name="daysAfterExpiration"]',
    enablePublicRenewalsButton: 'bootstrap-switch-label',
    notifyViaEmail: '#campaign-notify-email-input',
    setItLiveButton: '#campaign-live-btn-bottom',
    optionButton: '.flex-nav-group-right button',
    deleteCampaignButton: '.fa-trash',
    editCampaignButton: '.open li:nth-child(1) a',
    confirmationWindow: '.bootbox-close-button',
    confirmDeleteButton: '.btn-danger',
    renewalContainer: '#renwals-campaign-container',
    renewalNameHeader: '#renwals-campaign-container h2',
    renewalCompaignListNames: '.panel-body > h4',
    renewalInCompaignList: 'tbody > tr strong',
    recordStatus: {
      selector: (
        recordName,
        tagName,
        recordStatus,
      ) => `//strong[text()='${recordName}']/ancestor::td
      /following-sibling::td[4]/${tagName}[normalize-space()='${recordStatus}']`,
    },
    recordExpiryDate: {
      selector: (recordName) =>
        `//strong[text()='${recordName}']/ancestor::td/following-sibling::td[3]`,
    },
    selectCampaign: {
      selector: (campaignN) => `//h4[text()='${campaignN}']`,
    },
    selectRecordFromList: {
      selector: (record) => `//strong[text()='${record}']`,
    },
    exportRenewalCampaign: '#exportcsvid',
    confirmExportButton: '.modal-footer .btn-primary',
    allEmailsDropdown: '.container-fluid.container-lg .dropdown-toggle',
    allEmailsDropdownOption: '.dropdown.open li a',
    selectRecordType: 'select#input.form-control option',
    recordTypesToRenew: 'select[name=campaignRecordType] optgroup',
    cancelEditRenewalBtn: '#campaign-cancel-btn-top',
  };

  async clickNewCampaignButton() {
    await this.page.click(this.elements.newCampaignButton);
  }

  async fillRenewalInfo() {
    await this.page.fill(this.elements.campaignName, RenewalCampaignData.Name);
    await this.page.fill(
      this.elements.campaignStartDate,
      RenewalCampaignData.StartDate,
    );
    await this.page.click(this.elements.recordTypeSelect);
    await this.clickElementWithText(
      this.elements.selectRecordType,
      RenewalCampaignData.RecordType,
    );
    await this.page.fill(
      this.elements.campaignEndDate,
      RenewalCampaignData.EndDate,
    );
    await this.page.fill(
      this.elements.daysBeforeExpiration,
      RenewalCampaignData.DaysBeforeExpiration,
    );
    await this.page.fill(
      this.elements.daysAfterExpiration,
      RenewalCampaignData.DaysAfterExpiration,
    );
  }

  async createRenewal() {
    await this.page.click(this.elements.setItLiveButton);
  }

  async deleteRenewal() {
    await this.page.click(this.elements.optionButton);
    await this.page.click(this.elements.deleteCampaignButton);
    await this.page.click(this.elements.confirmDeleteButton);
  }

  async editRenewal() {
    await this.page.click(this.elements.optionButton);
    await this.page.click(this.elements.editCampaignButton);
    await this.page.fill(
      this.elements.campaignName,
      RenewalCampaignData.ChangedName,
    );
  }

  async validateEditedRenewal() {
    await this.elementContainsText(
      this.elements.renewalNameHeader,
      RenewalCampaignData.ChangedName,
    );
  }

  async validateRenewalExists(type: string, id: string) {
    await this.clickElementWithText(
      this.elements.renewalCompaignListNames,
      type,
      true,
    );
    await this.clickElementWithText(
      this.elements.renewalInCompaignList,
      id,
      true,
    );
    await this.elementVisible(this.elements.renewalInCompaignList);
  }

  async clickRenewCampaign() {
    await this.page.click(
      this.elements.selectCampaign.selector(RenewalCampaignData.Name),
    );
  }

  async validateRecordDetails(recordStatus: string) {
    let tagName;
    let expiryDate;
    switch (recordStatus) {
      case 'Open':
        tagName = 'span';
        break;

      case 'Pending':
        tagName = 'td';
        break;

      case 'Renewal Submitted':
        tagName = 'a';
        break;

      default:
        break;
    }
    await retry(
      async () => {
        expiryDate = await this.getElementText(
          this.elements.recordExpiryDate.selector(
            baseConfig.citTempData.recordName,
          ),
        );
        if (typeof expiryDate !== 'string') {
          throw new Error('Expiration date was not found'); // Will retry the checking
        }
      },
      {
        retries: 5,
        minTimeout: 500,
        maxTimeout: 500,
      },
    );
    expect(expiryDate.replace(/\./g, '')).toEqual(
      baseConfig.citTempData.recordExpiryDate,
    );
    await this.elementVisible(
      this.elements.recordStatus.selector(
        baseConfig.citTempData.recordName,
        tagName,
        recordStatus,
      ),
    );
  }

  async selectRecord() {
    await this.page.click(
      this.elements.selectRecordFromList.selector(
        baseConfig.citTempData.recordName,
      ),
    );
  }

  async exportReport() {
    const text = 'Take me to my exports';
    await this.page.click(this.elements.exportRenewalCampaign);
    await this.elementContainsText(this.elements.confirmExportButton, text);
    await this.page.click(this.elements.confirmExportButton);
  }

  async selectRenewCampaign(campaignName: string) {
    await this.page.click(this.elements.selectCampaign.selector(campaignName));
  }

  async clickAllEmailsDropdown() {
    await this.page.click(this.elements.allEmailsDropdown);
    await this.elementContainsText(
      this.elements.allEmailsDropdownOption,
      EmailOption.deliveredOption,
    );
    await this.elementContainsText(
      this.elements.allEmailsDropdownOption,
      EmailOption.openedOption,
    );
    await this.elementContainsText(
      this.elements.allEmailsDropdownOption,
      EmailOption.clickedOption,
    );
    await this.elementContainsText(
      this.elements.allEmailsDropdownOption,
      EmailOption.rejectedOption,
    );
  }

  async editRenewalRecordType() {
    await this.page.click(this.elements.optionButton);
    await this.page.click(this.elements.editCampaignButton);
    await this.page.click(this.elements.recordTypeSelect);
    await this.elementVisible(this.elements.recordTypesToRenew);
    await this.page.click(this.elements.cancelEditRenewalBtn);
  }
}

export enum RenewalCampaignData {
  Name = 'CAT CAMPAIGN',
  StartDate = '01/01/2020',
  EndDate = '01/01/2023',
  DaysBeforeExpiration = '100',
  DaysAfterExpiration = '100',
  ChangedName = 'DOG CAMPAIGN',
  RecordType = '0_UI_Renew_Do_Not_Delete',
}

export enum EmailOption {
  deliveredOption = 'delivered',
  openedOption = 'opened',
  clickedOption = 'clicked',
  rejectedOption = 'rejected',
}
