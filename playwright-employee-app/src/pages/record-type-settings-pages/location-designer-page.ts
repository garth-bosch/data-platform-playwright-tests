import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {expect} from '../../base/base-test';

export class LocationDesignerPage extends BaseCitPage {
  readonly elements = {
    locationsTabToggleOnOff: {
      selector: (toggleOn: 'on' | 'off') =>
        `//*[@id="attach-location"]//div[contains(@class, "switch-${toggleOn}")]`,
    },
    locationsTabToggleOnOffButton: `//*[@id="attach-location"]//div[contains(@class, "switch-o")]//input`,
  };
  async toggleLocationSettingOnOff(toggleOn: 'on' | 'off' = 'on') {
    let isOnNow = await this.page.isVisible(
      this.elements.locationsTabToggleOnOff.selector(toggleOn),
      {timeout: 5000},
    );
    if (toggleOn === 'on' && !isOnNow) {
      await this.page.click(this.elements.locationsTabToggleOnOffButton);
      await this.page.waitForTimeout(
        400,
      ); /*Element is already present and in a prev state*/
      isOnNow = await this.page.isVisible(
        this.elements.locationsTabToggleOnOff.selector(toggleOn),
      );
      expect(isOnNow).toBeTruthy();
      expect(
        await this.page
          .locator(this.elements.locationsTabToggleOnOff.selector(toggleOn))
          .isChecked(),
      ).toBeTruthy();
    }
    if (toggleOn === 'off' && isOnNow) {
      await this.page.click(this.elements.locationsTabToggleOnOffButton);
      await this.page.waitForTimeout(
        400,
      ); /*Element is already present and in a prev state*/
      isOnNow = await this.page.isVisible(
        this.elements.locationsTabToggleOnOff.selector(toggleOn),
      );
      expect(isOnNow).toBeFalsy();
    }
  }
}
