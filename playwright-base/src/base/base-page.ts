import {expect, Page} from '@playwright/test';

export abstract class BasePage {
  readonly isVisible: any = {state: 'visible'};
  readonly isNotVisible: any = {state: 'hidden'};

  constructor(public readonly page: Page) {}

  async clickElementWithText(
    selector: string,
    text: string,
    exactMatch = false,
  ) {
    await (await this.locateWithText(selector, text, exactMatch)).click();
  }

  async locateWithText(selector: string, text: string, exactMatch = false) {
    return exactMatch
      ? this.page.locator(`${selector} >> text='${text}'`)
      : this.page.locator(selector, {hasText: text});
  }

  async elementContainsText(
    selector: string,
    text: string,
    exactMatch = false,
  ) {
    exactMatch
      ? await expect(this.page.locator(selector)).toHaveText(text)
      : await expect(this.page.locator(selector)).toContainText(text);
  }

  async elementTextVisible(selector: string, text: string, strictMode = true) {
    const element = await this.locateWithText(selector, text, strictMode);
    await expect(element).toBeVisible();
  }

  async elementTextNotVisible(
    selector: string,
    text: string,
    strictMode = true,
  ) {
    if (strictMode) {
      await expect(this.page.locator(selector, {hasText: text})).toBeHidden();
    } else {
      const handle = await this.page.$(`${selector}:has-text('${text}')`);
      expect(await handle.isVisible()).toBeFalsy();
    }
  }

  async waitForVisibility(selector: string, shouldBeVisible = true) {
    shouldBeVisible
      ? await expect(this.page.locator(selector)).toBeVisible()
      : await expect(this.page.locator(selector)).toBeHidden();
  }

  async elementVisible(selector: string, strictMode = true) {
    strictMode
      ? await expect(this.page.locator(selector)).toBeVisible()
      : await expect(this.page.locator(selector).first()).toBeVisible();
  }

  async allElementsVisible(selectors: string[]) {
    selectors.forEach((s) => {
      this.elementVisible(s);
    });
  }

  async elementNotVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async allElementsNotVisible(selectors: string[]) {
    selectors.forEach((s) => {
      this.elementNotVisible(s);
    });
  }

  async getCurrentUrl() {
    await this.page.waitForNavigation();
    return this.page.url();
  }

  async getElementText(selector: string) {
    return this.page.locator(selector).innerText();
  }

  async getAllElementsText(selector: string, fromPage: Page = this.page) {
    // Get rows count from the Receipt
    const listItems = fromPage.locator(selector);
    const textData: string[] = await listItems.allInnerTexts();
    return textData.map((s) => s.replace(/[\n\t]/g, ' ').trim());
  }

  async close() {
    await this.page.close();
  }
}
