import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

export class SsoSettingPage extends BaseCitPage {
  readonly elements = {
    pageTitle: '.m-b-35.m-t-15',
  };
  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}/#/settings/system/sso`);
  }
  async verifyPageTitleText(pageTitle: string) {
    await this.elementContainsText(this.elements.pageTitle, pageTitle);
  }
}
