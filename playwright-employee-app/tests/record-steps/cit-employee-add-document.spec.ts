import {test, expect} from '../../src/base/base-test';
import {
  ADMIN_SESSION,
  TestDepartments,
} from '@opengov/cit-base/build/constants/cit-constants';
import {RecordTypeAccess} from '@opengov/cit-base/build/api-support/api/interfaces-and-data/default-payloads-interfaces';
import {baseConfig} from '@opengov/cit-base/build/base/base-config';
import {faker} from '@faker-js/faker';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Administer @records @record-steps', () => {
  const recordTypeName = `@OGT-Xoriant_${faker.random.alphaNumeric(4)}`;
  const firstDoc = 'First Doc Title';
  let recordTypeNum: any;
  test.beforeEach(async ({recordTypesApi, recordsApi, baseConfig}) => {
    recordTypeNum = await recordTypesApi.createRecordType(
      recordTypeName,
      TestDepartments.Test_Department,
      {
        publish: true,
        employeeAccess: RecordTypeAccess['Can Edit'],
      },
    );
    await recordTypesApi.addDocuments({
      docTemplate: {
        docTitle: firstDoc,
        recordTypeID: recordTypeNum,
      },
    });
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

  test('User can add a document and complete the workflow @OGT-34457 @broken_test @Xoriant_Test @smoke', async ({
    internalRecordPage,
    recordPage,
  }) => {
    await test.step('Go to Record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document on Record', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(firstDoc);
    });
    await test.step('Validate issued document and document state', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');
      await recordPage.validateIssuedDocumentComplete();
    });
  });

  test('Verify manually issued document expiration is based on document issuance date @OGT-33693 @broken_test @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    const expectedDate = new Date(
      new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}),
    );
    expectedDate.setDate(expectedDate.getDate() + 1);
    const month = expectedDate.toLocaleString('default', {month: 'long'});
    const year = expectedDate.toLocaleString('default', {year: 'numeric'});
    const day = expectedDate.toLocaleString('default', {day: 'numeric'});
    const expirationValues = {
      expirationOption: 'Expires After',
      expirationValue: '1',
      expirationUnit: 'Days',
    };
    await test.step('Go to Record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
    });
    await test.step('Add document on Record', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplate(
        firstDoc,
        true,
        true,
        expirationValues,
      );
    });
    await test.step('Validate issued document and document state', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');
      await recordPage.validateIssuedDocumentComplete();
    });
    await test.step('Verify expiration date is present on document', async () => {
      const expirationDate = await recordPage.page
        .frameLocator(recordPage.elements.printDoc)
        .locator(recordPage.elements.issuedDocument)
        .locator('p', {
          has: recordPage.page.locator('strong', {
            hasText: 'Expires:',
          }),
        })
        .locator('span')
        .innerText();
      expect(expirationDate).toContain(`${month} ${day}, ${year}`);
    });
    await test.step('Verify expiration date is present on record', async () => {
      await recordPage.refreshThisPage();
      await recordPage.validateIssuedDocumentComplete();
      const month = expectedDate.toLocaleString('default', {month: 'short'});
      expect(
        await recordPage.page
          .locator(recordPage.elements.expirationDateSelected)
          .innerText(),
      ).toEqual(`${month} ${Number(day) + 1}, ${year}`);
    });
  });
});

test.describe('Employee App - Administer @records @record-steps', () => {
  const recordTypeName = `Record Type ${faker.random.alphaNumeric(4)}`;
  test.beforeEach(async ({recordsApi, recordTypesApi}) => {
    await test.step('Create a Record Type', async () => {
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
      await recordTypesApi.addDocuments({
        docTemplate: {
          docTitle: 'First',
          recordTypeID: baseConfig.citTempData.recordTypeId,
        },
      });
    });

    await test.step('Create a Record', async () => {
      await recordsApi.createRecordWith(
        {
          name: recordTypeName,
          id: Number(baseConfig.citTempData.recordTypeId),
        },
        baseConfig.citTestData.citAdminEmail,
      );
    });
  });

  test('Ad-hoc document should implement the correct expiration logic @OGT-34494 @broken_test Env issue, @known_defect @env_issue @Xoriant_Test', async ({
    internalRecordPage,
    recordPage,
  }) => {
    const expectedDate = new Date(
      new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}),
    );
    expectedDate.setDate(expectedDate.getDate() + 1);
    const month = expectedDate.toLocaleString('default', {month: 'long'});
    const year = expectedDate.toLocaleString('default', {year: 'numeric'});
    const day = expectedDate.toLocaleString('default', {day: 'numeric'});
    await test.step('Go to Record', async () => {
      await internalRecordPage.proceedToRecordByUrl();
      await internalRecordPage.setExpirationDateAndDay(7, 10, 2025);
    });
    await test.step('Add document on Record', async () => {
      await recordPage.addDocumentStep();
      await recordPage.addDocumentTemplateWithExpirationDate('First', false);
    });
    await test.step('Validate issued document and document state', async () => {
      await recordPage.validateIssuedDocument('api admin', '  , ');
      await recordPage.validateIssuedDocumentComplete();
    });
    await test.step('Verify expiration date is present on document', async () => {
      const expirationDate = await recordPage.page
        .frameLocator(recordPage.elements.printDoc)
        .locator(recordPage.elements.issuedDocument)
        .locator('p', {
          has: recordPage.page.locator('strong', {
            hasText: 'Expires:',
          }),
        })
        .locator('span')
        .innerText();
      expect(expirationDate).toContain(`${month} ${day}, ${year}`);
    });
    await test.step('Verify expiration date is present on record', async () => {
      await recordPage.refreshThisPage();
      await recordPage.validateIssuedDocumentComplete();
      expect(
        await recordPage.page
          .locator(recordPage.elements.expirationDateSelected)
          .innerText(),
      ).toEqual(`August 10, 2025`);
    });
  });
});
