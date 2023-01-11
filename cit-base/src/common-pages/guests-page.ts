import {expect} from '../base/base-test';
import {BaseCitPage} from '../base/base-page';

export class GuestsPage extends BaseCitPage {
  readonly elements = {
    guestEmailInput: 'input#addGuestEmail',
    grantGuestAccessButton: '.invite-guest button[type="submit"]',
    guestUserField: '.single-guest',
    guestUserEmailElement: '.guest-email',
    guestUserEmail: {
      selector: (email) =>
        `//div[contains(@class, "guest-email") and text()="${email}"]`,
    },
    revokeGuestAccessButton: {
      selector: (email) =>
        `//div[text()="${email}"]/ancestor::div[contains(@class, "single-guest")]` +
        `/div[@class="guest-access"]/button`,
    },
    proveRevokeAccessButton: '.modal-dialog .modal-footer > button.btn-danger',
  };

  async enterGuestEmail(guestEmail: string) {
    await this.page.fill(this.elements.guestEmailInput, guestEmail);
  }

  async clickGrantAccessButton() {
    await this.page.click(this.elements.grantGuestAccessButton);
  }

  async validateGuestEmailPresent(guestEmail: string, isPresent: boolean) {
    if (isPresent) {
      await expect(
        this.page.locator(this.elements.guestUserEmailElement),
      ).toContainText(guestEmail);
    } else {
      await expect(
        this.page.locator(this.elements.guestUserEmail.selector(guestEmail)),
      ).toBeHidden();
    }
  }

  async clickRevokeAccessButton(guestEmail: string) {
    await this.page.click(
      this.elements.revokeGuestAccessButton.selector(guestEmail),
    );
  }

  async clickProveRevokeAccessButton() {
    await this.page.click(this.elements.proveRevokeAccessButton);
  }
}
