import {test} from '../../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

const locationModalFill = {
  //Todo add after hooks and move to constant
  locationName: `OGT-33952${faker.random.alphaNumeric(4)}`,
  streetNo: '6525',
  streetName: 'Crown Blvd',
  city: 'San Jose',
  state: 'Ca',
  zip: 95160,
  unit: '1',
  subDivision: '11',
  submit: true,
};
test.use({storageState: ADMIN_SESSION});
test.describe.configure({mode: 'serial'});
test('Check if changes to manually added locations are saved. @OGT-33952 @Xoriant_Test', async ({
  recordsApi,
  locationPage,
  internalRecordPage,
  changeLocationModalPage,
}) => {
  await test.step('Start a record draft', async () => {
    await recordsApi.submitRecordDraft(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
    );
  });
  await test.step('Create a location', async () => {
    await internalRecordPage.navigateById();
    await changeLocationModalPage.addLocationAddNew(locationModalFill);
  });
  await test.step('Edit and fill location and verify first edit', async () => {
    const subDiv = {subDivision: '222', submitOnTop: true};
    await locationPage.searchLocation(locationModalFill.locationName);
    await locationPage.editAndFillLocation(subDiv);
    await locationPage.verifyLocationForm({...locationModalFill, ...subDiv});
  });
  await test.step('Edit and fill location and verify second edit', async () => {
    const subDiv1 = {subDivision: '223', submitAtBottom: true};
    await locationPage.editAndFillLocation(subDiv1);
    await locationPage.verifyLocationForm({...locationModalFill, ...subDiv1});
  });
});

test('Attachments can be added to the address page. @OGT-33956 @Xoriant_Test', async ({
  recordsApi,
  locationPage,
  internalRecordPage,
  changeLocationModalPage,
}) => {
  await test.step('Submit record draft', async () => {
    await recordsApi.submitRecordDraft(
      TestRecordTypes.Record_Steps_Test,
      baseConfig.citTestData.citCitizenEmail,
    );
  });
  await test.step('Navigate and add new location', async () => {
    await internalRecordPage.navigateById();
    await changeLocationModalPage.addLocationAddNew(locationModalFill);
  });
  await test.step('Search and Upload Attachment file', async () => {
    await locationPage.searchLocation(locationModalFill.locationName);
    await locationPage.uploadLocationAttachmentFile('pdf');
    await locationPage.uploadLocationAttachmentFile('csv');
  });
});
