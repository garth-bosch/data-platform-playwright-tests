import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestFormFields,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
const conditionalFormField = 'If Number > 10';

test.describe('Storefront - Conditions @conditions @broken_test', () => {
  test.beforeEach(
    async ({page, storefrontUrl, storeFrontUserPage, storeFrontRecordPage}) => {
      await test.step(`Start application draft`, async () => {
        await page.goto(storefrontUrl);
        await storeFrontUserPage.validateMyAccountButtonVisibility(true);
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.Ghost_Test.name,
        );
        await storeFrontRecordPage.proceedToNextStep();
      });
    },
  );

  test('Conditional attachments are correctly triggered in Storefront application @OGT-34515', async ({
    storeFrontRecordPage,
    formsPage,
  }) => {
    await test.step('Toggle the checkbox form field', async () => {
      await formsPage.toggleCheckboxFormField(TestFormFields.Checkbox);
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Verify attachment buckets are conditionally shown', async () => {
      await storeFrontRecordPage.validateAttachmentBucketPresence(
        'If Checkbox == True',
        true,
      );
      await storeFrontRecordPage.validateAttachmentBucketPresence(
        'If Checkbox == False',
        false,
      );
    });

    await test.step('Go back to previous step and toggle off checkbox', async () => {
      await storeFrontRecordPage.goBackToPreviousStep();
      await formsPage.toggleCheckboxFormField(TestFormFields.Checkbox);
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step('Verify attachment buckets are conditionally shown', async () => {
      await storeFrontRecordPage.validateAttachmentBucketPresence(
        'If Checkbox == True',
        true,
      );
      await storeFrontRecordPage.validateAttachmentBucketPresence(
        'If Checkbox == False',
        false,
      );
    });
  });

  test('Conditional form fields are correctly triggered in Storefront application @OGT-34514', async ({
    formsPage,
  }) => {
    await test.step('Verify form fields are shown correctly', async () => {
      await formsPage.validateFormFieldIsVisible(TestFormFields.Checkbox, true);
      await formsPage.validateFormFieldIsVisible(TestFormFields.Number, true);
      await formsPage.validateFormFieldIsVisible(TestFormFields.String, false);
      await formsPage.validateFormFieldIsVisible(conditionalFormField, false);
    });

    await test.step('Toggle the checkbox form field and verify checkbox conditions are fulfilled', async () => {
      await formsPage.toggleCheckboxFormField(TestFormFields.Checkbox);
      await formsPage.validateFormFieldIsVisible(TestFormFields.String, true);
    });

    await test.step('Enter numeric value and verify number conditions are fulfilled', async () => {
      await formsPage.enterFormFieldValue(TestFormFields.Number, '11');
      await formsPage.validateFormFieldIsVisible(conditionalFormField, true);
    });

    await test.step('Enter numeric value and verify number conditions are not fulfilled', async () => {
      await formsPage.enterFormFieldValue(TestFormFields.Number, '9');
      await formsPage.validateFormFieldIsVisible(conditionalFormField, false);
    });
  });
});
