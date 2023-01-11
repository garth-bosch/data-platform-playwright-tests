import {expect, test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestDepartments,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - locations additions and inspections etc', () => {
  const recordTypeName = `plc_rectype_${faker.random.alphaNumeric(5)}`;
  test.beforeEach(async ({recordTypesApi, baseConfig}) => {
    /*_________*/
    baseConfig.citTestData.needStrFrontUser = false;
    baseConfig.citTestData.reAuthenticate = true;
    await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
      {
        publish: true,
        enableLocations: true,
        enableAdditionalLocations: true,
        employeeAccess: RecordTypeAccess['Can Administer'],
        workflowStepsToAdd: {
          inspection: true,
          document: true,
          approval: true,
          payment: true,
        },
        locationTypesToEnable: {
          address: true,
          point: true,
          segment: true,
        },
      },
    );
    /*_________*/
  });
  test('Employee: Add Address location as the main with additional locations of different types @OGT-40196 @broken_test @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Create record', async () => {
      baseConfig.citTestData.needStrFrontUser = true;
      baseConfig.citTestData.reAuthenticate = true;
      await recordsApi.createRecordWith({
        name: recordTypeName,
        id: Number(baseConfig.citTempData.recordTypeId),
      });
      baseConfig.citTestData.needStrFrontUser = false;
      baseConfig.citTestData.reAuthenticate = false;
      // await recordsApi.createRecordWith(
      //   TestRecordTypes.Additional_Location_Test,
      //   baseConfig.citTestData.citAdminEmail,
      // );
    });
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Add primary location', async () => {
      await internalRecordPage.addPrimaryLocation();
    });
    await test.step('Add address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1800 Presidents Street, Reston, VA',
      );
    });
    await test.step('Verify address location type hidden', async () => {
      await expect(
        page.locator(createRecordPage.elements.addressLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add point map location type', async () => {
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add segment location type', async () => {
      await createRecordPage.addSegmentLocationType(
        '1400 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1900 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Verify segment location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.segmentLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add one more Address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });
  /*__________________________________________________________________________________________ test 2*/
  test('Employee: Add Point location as the main with additional locations of different types @OGT-40200 @broken_test @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citEmployeeEmail,
      );
    });
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Add primary location', async () => {
      await internalRecordPage.addPrimaryLocation();
    });
    await test.step('Add address location type', async () => {
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Verify address location type hidden', async () => {
      await expect(
        page.locator(createRecordPage.elements.addressLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add point map location type', async () => {
      await createRecordPage.addPointOnMapLocationType('467 Waters Garden');
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add segment location type', async () => {
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
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add one more Address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });

  test('Employee: Add Segment location as the main with additional locations of different types @OGT-40203 @broken_test @Xoriant_Test', async ({
    baseConfig,
    recordsApi,
    page,
    createRecordPage,
    internalRecordPage,
  }) => {
    await test.step('Create record', async () => {
      await recordsApi.createRecordWith(
        TestRecordTypes.Additional_Location_Test,
        baseConfig.citTestData.citEmployeeEmail,
      );
    });
    await recordsApi.createRecordWith(
      TestRecordTypes.Additional_Location_Test,
      baseConfig.citTestData.citCitizenEmail,
    );
    await test.step('navigate to the record', async () => {
      await internalRecordPage.navigateById();
    });
    await test.step('Add primary location', async () => {
      await internalRecordPage.addPrimaryLocation();
    });
    await test.step('Add segment location type', async () => {
      await createRecordPage.addSegmentLocationType(
        '1401 Lake Fairfax Dr, Reston, VA 20190, USA',
        '1901 Reston Metro Plaza, Reston, VA 20190, USA',
      );
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add address location type', async () => {
      await createRecordPage.addPointOnMapLocationType(
        '465 Rowe Valleys_91386-3340',
      );
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add point map location type', async () => {
      await createRecordPage.addPointOnMapLocationType('467 Waters Garden');
    });
    await test.step('Verify point map location type', async () => {
      await expect(
        page.locator(createRecordPage.elements.pointOnMapLocationType),
      ).toBeHidden();
    });
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add segment location type', async () => {
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
    await test.step('Add one more location', async () => {
      await internalRecordPage.addAdditionalLocation();
    });
    await test.step('Add one more Address location type', async () => {
      await createRecordPage.addAddressLocationType(
        '1850 Town Center Parkway, Reston, VA',
      );
    });
  });
});
