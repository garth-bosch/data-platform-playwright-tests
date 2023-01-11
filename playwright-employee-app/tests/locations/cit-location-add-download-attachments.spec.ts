import {test} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestLocationTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Locations', async () => {
  let locationInfo;
  test.beforeEach(async ({locationsApi}) => {
    await test.step('location setup', async () => {
      const locationResponse1 = await locationsApi.createNewLocation(
        TestLocationTypes.Address_Location,
      );
      locationInfo = {
        name: locationResponse1.data.attributes.fullAddress,
        type: TestLocationTypes.Address_Location,
        location: locationResponse1.data.attributes.locationID,
      };
    });
  });
  test('User can upload and download attachments for a location @OGT-34059 @Xoriant_Test', async ({
    locationPage,
    employeeAppUrl,
    page,
  }) => {
    await test.step('Go to the Employee App and search for the location', async () => {
      await page.goto(employeeAppUrl);
      await locationPage.searchLocation(locationInfo.name);
    });
    await test.step('Upload Attachments on Location page', async () => {
      await locationPage.uploadLocationAttachmentFile('pdf');
      await locationPage.uploadLocationAttachmentFile('jpeg');
      await locationPage.uploadLocationAttachmentFile('docx');
    });
    await test.step('Download Attachments and verify', async () => {
      await locationPage.downloadAttachment('pdf');
      await locationPage.downloadAttachment('jpeg');
      await locationPage.downloadAttachment('docx');
    });
  });
});
