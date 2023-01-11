import {expect, test} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: ADMIN_SESSION});
test.describe('Admin can verify the different types of additional locations', () => {
  const recordTypeName = `@OGT-Xoriant_${faker.random.alphaNumeric(4)}`;
  test.beforeEach(async ({recordTypesApi, recordsApi, baseConfig}) => {
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
      {
        publish: true,
        enableLocations: true,
        enableAdditionalLocations: true,
        locationTypesToEnable: {
          point: true,
          segment: true,
          address: true,
        },
        employeeAccess: RecordTypeAccess['Can Edit'],
      },
    );
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
    });
  });

  test('Admin: Add Segement location as the main with additional locations of different types @OGT-40202 @broken_test @Xoriant_Test', async ({
    page,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Add primary address location type', async () => {
      await internalRecordPage.addPrimaryLocation();
      await createRecordPage.addSegmentLocationType(
        '1400 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1900 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Verify address location type hidden', async () => {
      await expect(
        page.locator(createRecordPage.elements.addressLocationType),
      ).toBeHidden();
    });
    await test.step('Add point map location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add segment location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addSegmentLocationType(
        '1401 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1901 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Verify segment location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.segmentLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more Address location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });

  test('Admin: Add Point location as the main with additional locations of different types @OGT-40199 @broken_test @Xoriant_Test', async ({
    page,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Add address location type', async () => {
      await internalRecordPage.addPrimaryLocation();
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Verify address location type hidden', async () => {
      await expect(
        page.locator(createRecordPage.elements.addressLocationType),
      ).toBeHidden();
    });
    await test.step('Add point map location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addPointOnMapLocationType('467 Waters Garden');
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add segment location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addSegmentLocationType(
        '1401 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1901 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Verify segment location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.segmentLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more Address location type', async () => {
      await internalRecordPage.addAdditionalLocation();
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });
});
