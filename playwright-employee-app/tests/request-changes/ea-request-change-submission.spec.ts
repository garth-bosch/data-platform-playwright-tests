import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  FooterButton,
  Pages,
  noFormFieldSelectedBanner,
} from '../../src/pages/request-change-page';
import {
  RecordStep,
  stepStatus,
} from '@opengov/cit-base/build/api-support/api/recordsApi';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Submit Request Change', () => {
  test.beforeEach(async ({recordsApi}) => {
    await test.step('Record setup', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Request_Changes_Tests,
        baseConfig.citTestData.citCitizenEmail,
      );
    });
  });

  test(`Request changes submitted for ACTIVE records navigate to record details page @OGT-46248 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I started the request change`, async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickOnRequestChange();
    });

    await test.step(`I select form field`, async () => {
      await requestChanges.selectAndAddNoteToFormField(
        'Single Entry Section',
        'short_text',
        'This note is optional',
      );
    });

    await test.step(`I select attachment`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.selectAndAddNoteToAttachment(
        'ID',
        'This note is optional',
      );
    });

    await test.step(`I submit the request change`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
      await requestChanges.clickOnButton(
        FooterButton.Confirm_And_Request_Changes,
      );
    });

    await test.step(`I navigate back to record details`, async () => {
      await internalRecordPage.validateRecordDetailsTabsVisibility();
      await internalRecordPage.validatePrefixedRecordName();
    });
  });

  test(`Request changes submitted for STOPPED records navigate to record details page @OGT-46255 @request_changes @smoke @broken_test`, async ({
    recordsApi,
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I started the request change for stopped record`, async () => {
      await recordsApi.addAdhocStep(
        RecordStep[RecordStep.Inspection],
        'Adhoc-Inspection',
        stepStatus.Reject,
      );
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickOnRequestChange();
    });

    await test.step(`I select form field`, async () => {
      await requestChanges.selectAndAddNoteToFormField(
        'Single Entry Section',
        'short_text',
        'This note is optional',
      );
    });

    await test.step(`I select attachment`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.selectAndAddNoteToAttachment(
        'ID',
        'This note is optional',
      );
    });

    await test.step(`I submit the request change`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
      await requestChanges.clickOnButton(
        FooterButton.Confirm_And_Request_Changes,
      );
    });

    await test.step(`I navigate back to record details`, async () => {
      await internalRecordPage.validateRecordDetailsTabsVisibility();
      await internalRecordPage.validatePrefixedRecordName();
    });
  });

  test(`Request change can not be submitted when there is no form field or attachment to update @OGT-46256 @request_changes`, async ({
    requestChanges,
    internalRecordPage,
  }) => {
    await test.step(`I started the request change`, async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.clickOnRequestChange();
    });

    await test.step(`I navigate to 'Confirm Request' page without selecting any form field or attachment`, async () => {
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.clickOnButton(FooterButton.Next);
      await requestChanges.validatePageHeadingIsDisplayed(
        Pages.Confirm_Request,
      );
    });

    await test.step(`I see 'Confirm and Request Changes' button disabled`, async () => {
      await requestChanges.validateConfirmRequestButtonIsDisabled();
    });

    await test.step(`I see a warning banner display there are no form field or attachment to update`, async () => {
      await requestChanges.validateThereIsNothingToUpdateWarningBaner(
        noFormFieldSelectedBanner.heading,
        noFormFieldSelectedBanner.body,
      );
    });
  });
});
