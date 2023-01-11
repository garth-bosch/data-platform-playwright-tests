import {expect} from '@playwright/test';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';

export class ProjectPage extends BaseCitPage {
  readonly elements = {
    pageTitle: '.container h5',
    projectsRecordListItem: {
      selector: (recordText: string) =>
        `//ul[contains(@class, "checklist")]//div[@class="media-body"]/div[1][contains(., "${recordText}")]`,
    },
    recordStatusByRecordId: {
      selector: (id: string) =>
        `//div[contains(@class,"media-right")]//*[@href="#/explore/records/${id}/form"]`,
    },
  };

  async goto() {
    await this.page.goto(`${baseConfig.employeeAppUrl}/#/explore/projects`);
  }

  async verifyProjectTitleText(projectTitle: string) {
    await this.elementContainsText(this.elements.pageTitle, projectTitle);
  }

  async verifyRecordNameAndStatus(
    id: string,
    recordText: string,
    status: string,
  ) {
    await expect(
      this.page.locator(this.elements.recordStatusByRecordId.selector(id)),
    ).toContainText(status);
    await expect(
      this.page.locator(
        this.elements.projectsRecordListItem.selector(recordText),
      ),
    ).toContainText(recordText);
  }
}
