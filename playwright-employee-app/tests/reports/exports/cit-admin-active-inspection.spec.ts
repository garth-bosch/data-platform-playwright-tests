import {test} from '../../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';
import {faker} from '@faker-js/faker';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {
  defaultFormSectionObject,
  defaultPayloadForFormFieldsObject,
  FormFieldDataIntVal,
} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {expect} from '@playwright/test';
import {Helpers} from '@opengov/cit-base/build/helpers/helpers';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Report and verify form fields on columns', () => {
  const recTypeName = `@OGT-33605_${faker.random.alphaNumeric(6)}`;
  const recordName1 = `${recTypeName}_one`;
  const recordName2 = `${recTypeName}_two`;
  const recordName3 = `${recTypeName}_three`;
  const formFieldName = `@OGT-33605-Field_${faker.random.alphaNumeric(6)}`;
  const sectionName = `Section ${faker.random.alphaNumeric(6)}`;
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
      });
    },
  );

  test(`User can export a report from active, inspection results reports @reports @OGT-46183 @broken_test @Xoriant_Test`, async ({
    page,
    employeeAppUrl,
    exploreReportsPage,
  }) => {
    let prevVal, curVal;
    await test.step('Navigate to reports screen', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      // await page.goto(`${employeeAppUrl}/#/explore/reports/all/d2`);
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Go to Active inspection and edit', async () => {
      await exploreReportsPage.reportPageIsVisible();
      // await exploreReportsPage.clickEditCompletedRecords();
      await exploreReportsPage.clickEditInspectionActiveRecords();
      await exploreReportsPage.waitReportTableLoaded();
    });
    await test.step('Add filter and verify', async () => {
      prevVal = await exploreReportsPage.getTotalRowsWithText('admin');
      await exploreReportsPage.createFilter('Assignee', 'api admin', 'is');
      await exploreReportsPage.waitReportTableLoaded();
      curVal = await exploreReportsPage.getTotalRowsWithText('admin');
      expect(Number(curVal)).toBeGreaterThan(Number(prevVal));
    });
    await test.step('Go to inspection Results and edit', async () => {
      await page.goto(`${employeeAppUrl}/#/explore/reports/all/`);
      await exploreReportsPage.waitReportTableLoaded();
      await exploreReportsPage.reportPageIsVisible();
      await exploreReportsPage.clickEditInspectionResultsMenu();
      await exploreReportsPage.waitReportTableLoaded();
      await new Helpers().waitFor(1500); /*Still not getting correct rows*/
    });
    await test.step('Add filter and verify', async () => {
      prevVal = await exploreReportsPage.getTotalRowsWithText('admin');
      await exploreReportsPage.createFilter('Inspector', 'api admin', 'is');
      await exploreReportsPage.waitReportTableLoaded();
      await new Helpers().waitFor(1500); /*Still not getting correct rows*/
      curVal = await exploreReportsPage.getTotalRowsWithText('admin');
      expect(Number(curVal)).toBeGreaterThan(Number(prevVal));
    });
  });
});
