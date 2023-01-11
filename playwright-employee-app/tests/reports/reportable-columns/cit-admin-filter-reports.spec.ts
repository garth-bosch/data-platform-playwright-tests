import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {ReportTabs} from '../../../src/pages/explore-reports-page';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report and verify form fields on columns', () => {
  const recTypeName = `@OGT-33605_${faker.random.alphaNumeric(6)}`;
  const recordName1 = `${recTypeName}_one`;
  const recordName2 = `${recTypeName}_two`;
  const recordName3 = `${recTypeName}_three`;
  const formFieldName = `@OGT-33605-Field_${faker.random.alphaNumeric(6)}`;
  const sectionName = `Section ${faker.random.alphaNumeric(6)}`;
  let recordNo1: any, recordNo2: any, recordNo3: any;
  test.beforeEach(
    async ({
      employeeAppUrl,
      recordTypesApi,
      recordsApi,
      navigationBarPage,
      recordTypesSettingsPage,
      systemSettingsPage,
      page,
    }) => {
      await test.step('Create a Record Type', async () => {
        await recordTypesApi.createRecordType(recTypeName);
      });
      await test.step('Add Form Section to Record Type', async () => {
        defaultFormSectionObject.formSection.sectionLabel = sectionName;
        defaultFormSectionObject.formSection.recordTypeID = Number(
          baseConfig.citTempData.recordTypeId,
        );
        await recordTypesApi.addFormSection(defaultFormSectionObject);
      });
      await test.step('Add form field to Form Section', async () => {
        defaultPayloadForFormFieldsObject.data.attributes.formSectionID =
          Number(
            baseConfig.citIndivApiData.addFormToRTResult.at(0).formSection
              .formSectionID,
          );
        defaultPayloadForFormFieldsObject.data.attributes.dataType =
          FormFieldDataIntVal.Number;
        defaultPayloadForFormFieldsObject.data.attributes.fieldLabel =
          formFieldName;
        defaultPayloadForFormFieldsObject.data.attributes.helpText = `Help Text for ${formFieldName}`;
        await recordTypesApi.addFieldToFormSection(
          defaultPayloadForFormFieldsObject,
        );
      });
      await test.step('Navigate to Home Screen by URL', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to Admin Settings', async () => {
        await navigationBarPage.clickAdminSettingsButton();
      });
      await test.step('Go to Record type section, select record type and publish', async () => {
        await systemSettingsPage.proceedToSection('Record Types');
        await recordTypesSettingsPage.selectRecordType(recTypeName);
        await recordTypesSettingsPage.publishRecordTypeFromDraft();
      });
      await test.step('Create record with existing type with form fields and navigate to record', async () => {
        await recordsApi.createRecordWith(
          {
            name: recordName1,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          null,
          null,
          [
            {
              fieldName: formFieldName,
              fieldValue: '100',
            },
          ],
        );
        recordNo1 = baseConfig.citTempData.recordNumber;
        await recordsApi.createRecordWith(
          {
            name: recordName2,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          null,
          null,
          [
            {
              fieldName: formFieldName,
              fieldValue: '200',
            },
          ],
        );
        recordNo2 = baseConfig.citTempData.recordNumber;
        await recordsApi.createRecordWith(
          {
            name: recordName3,
            id: Number(baseConfig.citTempData.recordTypeId),
          },
          null,
          null,
          [
            {
              fieldName: formFieldName,
              fieldValue: '300',
            },
          ],
        );
        recordNo3 = baseConfig.citTempData.recordNumber;
      });
    },
  );

  test(`Verify that Number type form field column contains correct values from its own fields @reports @OGT-33605 @Xoriant_Test`, async ({
    page,
    employeeAppUrl,
    exploreReportsPage,
  }) => {
    await test.step('Navigate to reports screen', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/d2`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('navigate to completed filters report', async () => {
      await exploreReportsPage.reportPageIsVisible();
      await exploreReportsPage.clickEditCompletedRecords();
    });
    await test.step('select department and record type on general tab', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.General);
      await exploreReportsPage.selectDepartmentOnReport('Test Department');
      await exploreReportsPage.selectRecordTypeOnReport(recTypeName);
    });
    await test.step('Add Columns to the Report and Verify Columns are added', async () => {
      await exploreReportsPage.navigateToReportTab(ReportTabs.Columns);
      await exploreReportsPage.addColumns([formFieldName]);
      await exploreReportsPage.verifyColumnsAdded([formFieldName]);
    });
    await test.step('verify form field values on report column', async () => {
      await exploreReportsPage.verifyRecordCellValues(recordNo3, '300');
      await exploreReportsPage.verifyRecordCellValues(recordNo2, '200');
      await exploreReportsPage.verifyRecordCellValues(recordNo1, '100');
    });
  });
});
