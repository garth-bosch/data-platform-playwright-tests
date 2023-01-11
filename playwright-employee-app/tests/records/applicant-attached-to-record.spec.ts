import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocation,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.describe('Employee App - Applicant Profile @records', () => {
  test.use({storageState: ADMIN_SESSION});
  test.beforeEach(async ({recordsApi, internalRecordPage}) => {
    await test.step('Setup a record and open it', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Record_Steps_Test,
        baseConfig.citTestData.citCitizenEmail,
        TestLocation.Test_Point_Location,
        [
          {
            fieldName: 'Approval',
            fieldValue: 'true',
          },
        ],
      );
      await internalRecordPage.proceedToRecordByUrl();
    });
  });
  test('"View Profile" button present and functional @OGT-43984 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    userProfileSettingsPage,
  }) => {
    await test.step('Got to applicants tab, click on view profile and verify same', async () => {
      await internalRecordPage.clickRecordDetailsTabSection('Applicant');
      await internalRecordPage.clickOnApplicantViewProfile();
      await userProfileSettingsPage.verifyUserEmail(
        baseConfig.citTestData.citCitizenEmail,
      );
    });
  });
});
