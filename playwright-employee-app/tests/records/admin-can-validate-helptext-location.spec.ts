import {test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';
test.use({storageState: ADMIN_SESSION});
test.describe('admin can view Help Text in Location', () => {
  let recordTypeName;
  test('Enter help text for Location settings and confirm in EA @OGT-33950 @Xoriant_Test', async ({
    recordTypesApi,
    recordsApi,
    page,
    employeeAppUrl,
    navigationBarPage,
    systemSettingsPage,
    recordTypesSettingsPage,
    internalRecordPage,
  }) => {
    await test.step('Create a Record Type', async () => {
      recordTypeName = `@OGT-33950 ${faker.random.alphaNumeric(4)}`;
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
    await test.step('Verify Locations tab', async () => {
      await recordTypesSettingsPage.proceedToLocationTab();
    });
    await test.step('Enter Help Text', async () => {
      await recordTypesSettingsPage.setLocationsHelpText(
        'Address',
        'Address Help Text',
      );
      await recordTypesSettingsPage.setLocationsHelpText(
        'Point',
        'Point Help Text',
      );
      await recordTypesSettingsPage.setLocationsHelpText(
        'Segment',
        'Segment Help Text',
      );
    });
    await test.step('Create Record', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
    });
    await test.step('Navigate to Record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Navigate to Location and Click Add Primary Location Button', async () => {
      await internalRecordPage.navigateById();
      await internalRecordPage.clickRecordDetailsTabSection('Location');
      await internalRecordPage.clickAddPrimaryLocation();
    });
    //some times helptext is not reflecting in UI
    await test.step('Verify Help Text', async () => {
      await internalRecordPage.verifyLocationHelpText(
        'Address',
        'Address Help Text',
      );
      await internalRecordPage.verifyLocationHelpText(
        'Point',
        'Point Help Text',
      );
      await internalRecordPage.verifyLocationHelpText(
        'Segment',
        'Segment Help Text',
      );
    });
  });
});
