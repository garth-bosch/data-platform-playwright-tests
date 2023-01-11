import {expect} from '../../src/base/base-test';
import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('Employee App - Notifications', () => {
  test('Employee: Verify Inspection task in the Inbox. Sort by newer first. @OGT-34046 @Xoriant_test', async ({
    page,
    recordsApi,
    employeeAppUrl,
    navigationBarPage,
  }) => {
    await test.step('Login to EA', async () => {
      await page.goto(employeeAppUrl);
    });

    await test.step('Land to inbox page', async () => {
      await navigationBarPage.clickExploreInboxButton();
    });

    await test.step('Verify that all listed tasks are sorted by newer first', async () => {
      const expectedTasksList = await recordsApi.getAssignedTasks('desc');
      const expectedTaskNames = expectedTasksList.data.map(
        (a) => a.attributes.label,
      );
      const actualTasksList = await navigationBarPage.getAllInboxItems();
      expect(actualTasksList).toEqual(expectedTaskNames);
    });
  });
});
