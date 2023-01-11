import {expect, test} from '../../src/base/base-test';

test.describe('No Sign Up option for new users', () => {
  test('Sign Up option should not be displayed on Employee Portal @OGT-43945 @Xoriant_Test', async ({
    page,
    employeeAppUrl,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await page.goto(employeeAppUrl, {waitUntil: 'networkidle'});
    });
    await test.step('Verify Sign Up option is not displayed', async () => {
      expect(await page.locator('text=Sign Up').isVisible()).toBe(false);
    });
  });
});
