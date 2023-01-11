import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Internal @internal', () => {
  test.beforeEach(async ({page, storefrontUrl}) => {
    await page.goto(storefrontUrl);
  });

  test('Citizen cannot see the API Integration step @OGT-34326', async ({
    storeFrontUserPage,
    storeFrontRecordPage,
    storeFrontFormPage,
  }) => {
    await test.step(`Start application draft and submit record`, async () => {
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.DFF_Record_Type.name,
      );
      await storeFrontRecordPage.proceedToNextStep();
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Test_Tole.name,
      );
      await storeFrontFormPage.navigateToSection('Confirm your submission');
      await storeFrontRecordPage.proceedToNextStep('submit');
    });

    await test.step(`Verify only internal steps are not visible to citizen`, async () => {
      await storeFrontRecordPage.validateRecordContainsStep(
        'Custom Inspection',
      );
      await storeFrontRecordPage.validateRecordNotContainsStep(
        'API Integration',
      );
      await storeFrontRecordPage.recordStepNotTracked('API Integration');
    });
  });
});
