import {test} from '../../src/base/base-test';
import {ADMIN_SESSION} from '@opengov/cit-base/build/constants/cit-constants';

test.use({storageState: ADMIN_SESSION});
test.describe('User is able to manipulate of the map layers if GIS integration is enabled', () => {
  test(
    'Is GIS layer checklist present and functional ' +
      '@known_defect @Partial_Automation @OGT-44419 @broken_test @Xoriant_Test',
    async ({page, employeeAppUrl, exploreMapPage}) => {
      await test.step('User is logged into Employee-app', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to Map menu', async () => {
        await exploreMapPage.goto();
      });
      await test.step('Click on Map layer dropdown menu', async () => {
        await exploreMapPage.mapLayerDropDownclick();
      });
      await test.step('Check and uncheck map layer options', async () => {
        //TODO refactor this step after function fixes:
        //checkboxes don't change status on 'Checked/Unchecked'
        await exploreMapPage.checkMapLayerCheckBox('Housing Districts');
        await exploreMapPage.checkMapLayerCheckBox('Building Districts');
        await exploreMapPage.uncheckMapLayerCheckBox('Housing Districts');
        await exploreMapPage.uncheckMapLayerCheckBox('Building Districts');
      });
      await test.step('Verify if actions took an effect', async () => {
        //TODO need to implement after functional fixes
      });
    },
  );
  test(
    'GIS layers register correctly (if GIS integration is enabled) ' +
      '@known_defect @Partial_Automation @OGT-44261 @broken_test @Xoriant_Test',
    async ({page, employeeAppUrl, exploreMapPage}) => {
      await test.step('User is logged into Employee-app', async () => {
        await page.goto(employeeAppUrl);
      });
      await test.step('Navigate to Map menu', async () => {
        await exploreMapPage.goto();
      });
      await test.step('Click on Map layer dropdown menu', async () => {
        await exploreMapPage.mapLayerDropDownclick();
      });
      await test.step('Check map layer options', async () => {
        //TODO refactor this step after function fixes:
        //checkboxes don't change status on 'Checked/Unchecked'
        await exploreMapPage.checkMapLayerCheckBox('Zoning Districts');
        await exploreMapPage.checkMapLayerCheckBox('Neighborhoods');
      });
      await test.step('Verify if map layers were added after manipulation on layer list', async () => {
        //TODO need to implement after functional fixes
      });
    },
  );
});
