import {BasePage} from '@opengov/playwright-base/build/base/base-page';
import {baseConfig} from './base-config';

export abstract class BaseCitPage extends BasePage {
  readonly plcPrefix = () => baseConfig.citTestData.plcPrefix;
}
