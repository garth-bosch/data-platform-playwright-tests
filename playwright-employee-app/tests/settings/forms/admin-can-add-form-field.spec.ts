import {expect, test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Settings - Record type settings', () => {
  let recordTypeName, sectionName;
  test.beforeEach(
    async ({
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      recordTypesApi,
      employeeAppUrl,
      page,
      formDesignerPage,
    }) => {
      await test.step('Create a Record Type and User flag', async () => {
        recordTypeName = `Record Type for Form ${faker.random.alphaNumeric(4)}`;
        await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Navigate to workflow settings', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recordTypeName);
      });
      await test.step('Go to forms tab', async () => {
        await recordTypesSettingsPage.proceedToFormTab();
      });
      await test.step('Add Form Section to Record Type', async () => {
        sectionName = `Section ${faker.random.alphaNumeric(4)}`;
        await formDesignerPage.addSingleEntrySection(sectionName);
      });
    },
  );
  test('Admin can add a File upload type field @OGT-33866 @Xoriant_Test', async ({
    page,
    formDesignerPage,
  }) => {
    await test.step('Add File upload type field to the section', async () => {
      await formDesignerPage.addFormField('File Upload', sectionName);
    });
    await test.step('Verify File Upload Type form field is added', async () => {
      await expect(
        page.locator(
          formDesignerPage.elements.formFieldInput.selector(
            sectionName,
            'File Upload',
          ),
        ),
      ).toBeVisible();
      await expect(
        page.locator(
          formDesignerPage.elements.fileUploadInput.selector('File Upload'),
        ),
        'File Upload Type Field',
      ).toBeVisible();
    });
  });

  test('Admin can add/edit the label of the fields (for all types) @OGT-33778 @Xoriant_Test', async ({
    page,
    formDesignerPage,
  }) => {
    const formFields = [
      'Short Text Entry',
      'Long Text Entry',
      'Number',
      'Checkbox',
      'Drop-down',
      'Date',
      'Help Text',
      'Social Security Number',
      'Employer ID Number',
      'Digital Signature',
      'File Upload',
    ];
    for await (const formField of formFields) {
      await test.step(`Add ${formField} type field to the section and verify Label is updated`, async () => {
        await formDesignerPage.addFormField(formField, sectionName);
        await expect(
          page.locator(
            formDesignerPage.elements.formFieldLabel.selector(
              sectionName,
              formField,
            ),
          ),
          `${formField} label update`,
        ).toBeVisible();
      });
    }
  });
});
