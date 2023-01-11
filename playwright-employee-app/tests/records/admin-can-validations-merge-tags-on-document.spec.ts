import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';

test.use({storageState: ADMIN_SESSION});
const mergeTagsList = [
  'orgName',
  'orgLogoURL',
  'docTitle',
  'issuedByUserName',
  'recordId',
  'recordType',
  'renewalNo',
  'dateSubmitted',
  'permitLicenseIssuedDate',
  'projectId',
  'projectName',
  'applicantFirstName',
  'applicantLastName',
  'applicantEmail',
  'applicantPhoneNo',
  'applicantStreet',
  'applicantCity',
  'applicantState',
  'applicantZip',
  'streetNo',
  'streetName',
  'unit',
  'city',
  'state',
  'zipCode',
  'ownerName',
  'ownerStreetNo',
  'ownerStreetName',
  'ownerCity',
  'ownerState',
  'ownerZipCode',
  'ownerUnit',
  'ownerPhoneNo',
  'ownerEmail',
  'bookPage',
  'yearBuilt',
  'mbl',
  'zoning',
  'lotArea',
  'propertyUse',
  'occupancy',
  'buildingType',
  'water',
  'sewage',
  'subdivision',
  'currentDay',
  'currentMonth',
  'currentYear',
  'currentYY',
  'currentDate',
  'latitude',
  'expirationDate',
  'longitude',
  'secondaryLatitude',
  'secondaryLongitude',
  'segmentPrimaryLabel',
  'segmentSecondaryLabel',
  'segmentLabel',
  'primaryLocation',
  'additionalLocations',
];
test.describe('Employee App - can add all merge tags on document and validate them', () => {
  let recordTypeName: string, recTypeNo: string, docTitle: string;
  test.beforeEach(
    async ({
      recordTypesApi,
      employeeAppUrl,
      page,
      navigationBarPage,
      systemSettingsPage,
      recordTypesSettingsPage,
      recordsApi,
      documentDesignerPage,
    }) => {
      recordTypeName = `Record_Type_${faker.random.alphaNumeric(4)}`;
      docTitle = recordTypeName + '_Doc';
      await test.step('Create a Record Type', async () => {
        recTypeNo = await recordTypesApi.createRecordType(recordTypeName);
      });
      await test.step('Navigate to workflow settings', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section and select record type', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recordTypeName);
      });
      await test.step('Add Document to record type with conditional Form conditionalFieldOutput', async () => {
        await recordTypesApi.addDocuments({
          docTemplate: {
            docTitle: docTitle,
            recordTypeID: recTypeNo,
          },
        });
        await recordTypesSettingsPage.proceedToDocumentTab();
      });
      await test.step('Update Document Title - click', async () => {
        await recordTypesSettingsPage.clickOnGivenDocInDocsTab(
          baseConfig.citIndivApiData.addDocumentToRTResult.at(0).docTemplate.id,
          docTitle,
        );
        await documentDesignerPage.addMergeTagToDocumentEditor(mergeTagsList);
      });
      await test.step('Update Document Save Document', async () => {
        await recordTypesSettingsPage.saveDocument();
      });
      await test.step('Create Record with Conditional Form Fields', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordTypeName,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          baseConfig.citTestData.citAdminEmail,
        );
      });
    },
  );
  test('User can edit document template using merge tags @OGT-34468 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
    documentDesignerPage,
  }) => {
    await test.step('validate merge on saved document template', async () => {
      await documentDesignerPage.validateMergeTagToDocumentEditor(
        mergeTagsList,
      );
    });
    await test.step('Go to record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document on Record', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(docTitle);
    });
    await test.step('Validate issued document and document state', async () => {
      // await internalRecordPage.validateMergeTagValueOnDocument(recTypeNo); // todo can we add the correct tag for merge document and test it later Mahesh
      await internalRecordPage.validateMergeTagValueOnDocument(recordTypeName);
      await internalRecordPage.validateMergeTagValueOnDocument(docTitle);
      await internalRecordPage.validateMergeTagValueOnDocument('api');
      await internalRecordPage.validateMergeTagValueOnDocument('admin');
      await internalRecordPage.validateMergeTagValueOnDocument(
        baseConfig.citTestData.citAdminEmail,
      );
      await recordPage.validateIssuedDocumentComplete();
    });
  });
});
