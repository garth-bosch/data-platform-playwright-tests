import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class ReportingSettingsPage extends BaseCitPage {
  readonly elements = {
    reportingSettingsEntityInput: `#reporting-entity`,
    reportingSettingsButton: `#settings-reporting-btn`,
    dataSyncToggleOn: `//div[contains(@class,'bootstrap-switch-on' )][//span[contains(.,'ON')]][div[contains(@style, 'margin-left: 0px;')]]`,
    dataSyncToggleOff: `//div[contains(@class,'bootstrap-switch-off' )][//span[contains(.,'OFF')]][div[contains(@style, 'margin-left: -42px;')]]`,
    givenDeptToggleButton: {
      selector: (deptName: string) =>
        `//tr[td[contains(.,"${deptName}")]]//span[ input[@name="dataSetToggle"] ] / label`,
    },
    givenDeptToggleState: {
      selector: (deptName: string) =>
        `//tr[td[contains(.,"${deptName}")]]//div[@data-test-cell-id="lastSynced"]`,
    },
  };
  async proceedToReportingSettingsPage() {
    await this.page.click(this.elements.reportingSettingsButton);
    await this.page.waitForURL(/reportings/g);
  }
  async isToggleOn() {
    const on = await this.page.$$(this.elements.dataSyncToggleOn);
    if (on.length === 1) {
      return true;
    }
    const off = await this.page.$$(this.elements.dataSyncToggleOff);
    if (off.length === 1) {
      return false;
    }
    throw new Error(`Can't find toggle or off`);
  }
  async toggleDataSyncOnOrOff(switchOn = true) {
    const currentStateOn = await this.isToggleOn();
    if (!currentStateOn && switchOn) {
      await this.page.click(this.elements.dataSyncToggleOff);
    }
    if (currentStateOn && !switchOn) {
      await this.page.click(this.elements.dataSyncToggleOn);
    }
  }
  async toggleGivenSettingCurrentState(whichDept: string) {
    const on = await this.page.$$(
      this.elements.givenDeptToggleState.selector(whichDept),
    );
    if (on.length >= 1) {
      return true;
    }
    return false;
  }
  async toggleGivenSettingOnOrOff(whichDept: string, shouldToggleOn = true) {
    const isToggleForThisDeptOn = await this.toggleGivenSettingCurrentState(
      whichDept,
    );
    if (shouldToggleOn) {
      if (!isToggleForThisDeptOn) {
        await this.page.click(
          this.elements.givenDeptToggleButton.selector(whichDept),
        );
      }
    }
    if (!shouldToggleOn) {
      if (isToggleForThisDeptOn) {
        await this.page.click(
          this.elements.givenDeptToggleButton.selector(whichDept),
        );
      }
    }
  }
}
