import {BaseCitPage} from '@opengov/cit-base/build/base/base-page';
import {CreateRecordPage} from './create-record-page';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

export class SelectRecordTypePage extends BaseCitPage {
  readonly elements = {
    pageHeader: '#create-topbar',
    departmentDropdown: '#reports-topbar .dropdown',
    departmentDropdownItems: '#reports-topbar .dropdown a',
    recordTypesList: '.list-group-item h5',
    recordCreationPageHeader: '.container h3',
    recordTypeFilterPlaceholder: '#record-filter',
  };

  async recordTypeSelectionPageIsVisible() {
    await this.elementVisible(this.elements.pageHeader);
  }

  async clickDepartDropdown() {
    await this.page.click(this.elements.departmentDropdown);
  }

  async selectDepartment(departmentName: string) {
    await this.clickDepartDropdown();
    await this.clickElementWithText(
      this.elements.departmentDropdownItems,
      departmentName,
    );
    await this.elementContainsText(
      this.elements.departmentDropdown,
      departmentName,
    );
  }

  async selectRecordType(recordTypeName: string) {
    await this.clickElementWithText(
      this.elements.recordTypesList,
      recordTypeName,
      true,
    );
    await new CreateRecordPage(this.page).createRecordPageIsVisible();
  }

  async validateDepartmentFilterName(departmentName: string) {
    await this.elementContainsText(
      this.elements.departmentDropdown,
      departmentName,
    );
  }

  async validateSelectedDepartmentRecord(departmentName: string) {
    await this.elementContainsText(
      this.elements.recordCreationPageHeader,
      departmentName,
    );
  }

  async fillRecordTypeFilter(recordTypeName: string) {
    await this.page.fill(
      this.elements.recordTypeFilterPlaceholder,
      recordTypeName,
    );
  }

  async validateFilteredRecordTypes(recordTypeName: string) {
    await this.elementContainsText(
      this.elements.recordTypesList,
      recordTypeName,
    );
  }

  async validateRecordTypeIsAbsent(isVisible: boolean, recordTypeName: string) {
    if (isVisible === true) {
      await this.validateFilteredRecordTypes(recordTypeName);
    } else {
      await this.fillRecordTypeFilter(recordTypeName);
      await this.elementTextNotVisible(
        this.elements.recordTypesList,
        recordTypeName,
      );
    }
  }

  async validateDepartmentDropdown(isVisible: string) {
    await this.clickDepartDropdown();
    if (isVisible === 'is') {
      await this.clickElementWithText(
        this.elements.departmentDropdownItems,
        baseConfig.citTempData.departmentNameText,
      );
      await this.elementContainsText(
        this.elements.departmentDropdown,
        baseConfig.citTempData.departmentNameText,
      );
    } else if (isVisible === 'is not') {
      await this.elementTextNotVisible(
        this.elements.departmentDropdown,
        baseConfig.citTempData.departmentNameText,
      );
    }
  }
}
