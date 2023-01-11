import {test} from '../src/base/base-test';
import {ApiDepartments} from '@opengov/cit-base/build/api-support/api/departmentsApi';
import {expect} from '@playwright/test';
import {CITIZEN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Public Portal', () => {
  test(
    `Admin can select/de-select links to be opened in a new tab - refactor` +
      `@OGT-34164 @broken_test @Xoriant_Test`,
    async ({page, storefrontUrl, storeFrontUserPage}) => {
      await test.step('Navigate to Public portal', async () => {
        await page.goto(storefrontUrl);
      });
      await test.step('Navigate to category by name', async () => {
        await storeFrontUserPage.proceedToProjectTemplate(
          ApiDepartments.automatedTesting.name,
        );
      });
      await test.step('Click on published link by text and verify if new tab was opened', async () => {
        const allPagesOpened = await Promise.all([
          page.context().waitForEvent('page'),
          await storeFrontUserPage.clickContentLinkWithText(
            'This link created by test @OGT-34164',
          ),
        ]);
        expect(allPagesOpened.length).toEqual(2);
      });
    },
  );
});
