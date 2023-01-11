import {test} from '../../src/base/base-test';
import {
  CITIZEN_SESSION,
  LocationTypes,
  TestLocation,
  TestLocationTypes,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {baseConfig} from '@opengov/cit-base/build';
import {faker} from '@faker-js/faker';
import {expect} from '@playwright/test';

test.use({storageState: CITIZEN_SESSION});
test.describe('Storefront - Locations @locations', () => {
  test('Validate location with too many units(>1000) loads on Record details page @OGT-34252 @broken_test', async ({
    storeFrontRecordPage,
    page,
    storeFrontUserPage,
    storefrontUrl,
  }) => {
    await test.step(`Start application draft`, async () => {
      await page.goto(storefrontUrl);
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
      await storeFrontRecordPage.searchAndStartApplication(
        TestRecordTypes.Storefront_locations_enabled,
      );
      await storeFrontRecordPage.proceedToNextStep();
    });

    await test.step(`Validate location with 1000 units can be added to record.`, async () => {
      await storeFrontRecordPage.searchAndSelectLocationStorefront(
        TestLocation.Location_With_Units.name,
      );
      await storeFrontRecordPage.validateChangeLocationButtonDisplay();
    });
  });

  test(`Record's location data in EA matches what's present in Storefront / Public Search @OGT-44132 @Xoriant_Test`, async ({
    page,
    storeFrontUserPage,
    storefrontUrl,
    locationsApi,
    publicLocationsPage,
  }) => {
    let locationResponse2, updateObject;
    await test.step(`Create new Location, update with needed details`, async () => {
      await locationsApi.createNewLocation(TestLocationTypes.Address_Location);
      updateObject = {
        data: {
          id: baseConfig.citIndivApiData.locationStepResult.data.id,
          attributes: {
            yearBuilt: faker.datatype.number({
              min: 1900,
              max: 2010,
            }),
            mbl: null,
            zoning: '',
            water: null,
            sewage: 'Yes',
            occupancyType: `${faker.datatype.number({
              min: 5,
              max: 20,
            })}`,
            subdivision: `${faker.random.alphaNumeric(10, {casing: 'mixed'})}`,
            locationID: 73394,
          },
          type: 'locations',
        },
      };
      locationResponse2 = await locationsApi.updateLocation(updateObject);
    });
    await test.step(`Navigate to Storefront`, async () => {
      await page.goto(storefrontUrl);
    });
    await test.step(`Navigate to that location`, async () => {
      const givenAddress = `${locationResponse2.data.attributes.streetNo} ${locationResponse2.data.attributes.streetName}, ${locationResponse2.data.attributes.city}, ${locationResponse2.data.attributes.state}`;
      await storeFrontUserPage.searchAndNavigateToLocation(
        givenAddress,
        locationResponse2.data.attributes.id,
        true,
      );
    });
    await test.step(`Go to details tab and verify the location details`, async () => {
      await publicLocationsPage.clickOnDetailsTab();
      await publicLocationsPage.verifyLocationDetailsTab({
        occupancy: updateObject.data.attributes.occupancyType.toString(),
        yearBuilt: updateObject.data.attributes.yearBuilt.toString(),
        sewage: updateObject.data.attributes.sewage.toString(),
      });
    });
  });
});

test.describe('Storefront - Locations @locations', () => {
  test.beforeEach(
    async ({page, storefrontUrl, storeFrontUserPage, storeFrontRecordPage}) => {
      await test.step(`Start a record draft`, async () => {
        await page.goto(storefrontUrl);
        await storeFrontUserPage.validateMyAccountButtonVisibility(true);
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.Additional_Location_Test.name,
        );
      });

      await test.step(`Proceed to the next step`, async () => {
        await storeFrontRecordPage.proceedToNextStep();
      });
    },
  );

  test('Verify citizen can click on a point in the map and create a point type location @OGT-34321 @broken_test @Xoriant_test', async ({
    storeFrontRecordPage,
  }) => {
    await test.step(`CLick on the map to put a point`, async () => {
      await storeFrontRecordPage.clickLocationType(LocationTypes.POINT);
      await storeFrontRecordPage.putPointOnMap();
      await storeFrontRecordPage.page
        .locator(storeFrontRecordPage.elements.confirmLocationButton)
        .click();
    });

    await test.step('Verify the new Point location has been saved', async () => {
      await storeFrontRecordPage.verifyLocationDetails('Point Location');
    });
  });

  test('When street name is not entered, a user is still able to click two points on the street @OGT-34217 @broken_test @Xoriant_test', async ({
    storeFrontRecordPage,
  }) => {
    await test.step('Start adding a segment location', async () => {
      await storeFrontRecordPage.clickLocationType(LocationTypes.SEGMENT);
    });

    await test.step('Click on two points on the map for the starting & ending locations', async () => {
      await storeFrontRecordPage.putPointOnMap({x: 200, y: 200});
      await expect(
        storeFrontRecordPage.page.locator(
          storeFrontRecordPage.elements.segmentStartingLocation,
        ),
      ).toHaveValue(/.+/);

      await storeFrontRecordPage.putPointOnMap({x: 300, y: 300});
      await expect(
        storeFrontRecordPage.page.locator(
          storeFrontRecordPage.elements.segmentEndingLocation,
        ),
      ).toHaveValue(/.+/);
    });

    await test.step('Confirm the segment selection and verify it is saved', async () => {
      await storeFrontRecordPage.confirmSelectedSegmentLocation();
      await storeFrontRecordPage.verifyLocationDetails('(Segment)');
    });
  });

  test('The length of the segment are the same if start and endpoints are re-arranged @OGT-34215 @broken_test @Xoriant_test', async ({
    storeFrontRecordPage,
  }) => {
    await test.step('Start adding a segment location', async () => {
      await storeFrontRecordPage.clickLocationType('segment');
    });

    await test.step('Fill the starting & ending addresses', async () => {
      await storeFrontRecordPage.chooseSegmentLocationPoint(
        'starting',
        '15 John Adams Way, Boston PE21 6TN, UK',
      );
      await storeFrontRecordPage.chooseSegmentLocationPoint(
        'ending',
        '65 John Adams Way, Boston PE21 6TN, UK',
      );
    });

    let initialSegmentLength: number;
    await test.step('Store the length of the segment for the validation', async () => {
      initialSegmentLength = await storeFrontRecordPage.getSegmentLength();
    });

    await test.step('Clear address fields', async () => {
      const clearButtons = storeFrontRecordPage.page.locator(
        storeFrontRecordPage.elements.clearSegmentAddressButton,
      );
      for (const elem of await clearButtons.elementHandles()) {
        await elem.click();
      }
    });

    await test.step('Re-arrange starting & ending addresses', async () => {
      await storeFrontRecordPage.chooseSegmentLocationPoint(
        'starting',
        '65 John Adams Way, Boston PE21 6TN, UK',
      );
      await storeFrontRecordPage.chooseSegmentLocationPoint(
        'ending',
        '15 John Adams Way, Boston PE21 6TN, UK',
      );
    });

    await test.step('Verify the length of the segment is the same', async () => {
      const finalSegmentLength = await storeFrontRecordPage.getSegmentLength();
      expect(finalSegmentLength).toEqual(initialSegmentLength);
    });
  });

  test('If address integration is turned OFF, google maps search results are available for location choice in Storefront @OGT-44862 @broken_test @Xoriant_test', async ({
    commonApi,
    storeFrontRecordPage,
  }) => {
    await test.step('Verify "Set address integration" is turned off', async () => {
      await commonApi.changeAddressIntegrationState('disable');
    });

    await test.step('Start adding a location and search for "10 Main"', async () => {
      await storeFrontRecordPage.clickLocationType(LocationTypes.ADDRESS);
      await storeFrontRecordPage.page
        .locator(storeFrontRecordPage.elements.locationSearchBox)
        .click();
      await storeFrontRecordPage.page
        .locator(storeFrontRecordPage.elements.locationSearchBox)
        .fill('10 Main');
    });

    await test.step(
      'Verify the search results include all pre-existing locations' +
        " as well as all Google Maps' search results",
      async () => {
        // Verify search results are already shown
        await expect(
          storeFrontRecordPage.page
            .locator(storeFrontRecordPage.elements.addressSearchResults)
            .first(),
        ).toBeVisible();
        // Verify there are many search results
        expect(
          await storeFrontRecordPage.page
            .locator(storeFrontRecordPage.elements.addressSearchResults)
            .count(),
        ).toBeGreaterThanOrEqual(20);
      },
    );
  });
});

test.describe('Storefront - Segment locations @locations', () => {
  test.beforeEach(
    async ({page, storefrontUrl, storeFrontUserPage, storeFrontRecordPage}) => {
      await test.step('Login to STR and start a record draft', async () => {
        await page.goto(storefrontUrl);
        await storeFrontUserPage.validateMyAccountButtonVisibility(true);
        await storeFrontRecordPage.searchAndStartApplication(
          TestRecordTypes.Additional_Location_Test.name,
        );
      });

      await test.step('Proceed to the next step', async () => {
        await storeFrontRecordPage.proceedToNextStep();
      });

      await test.step('Start adding a segment location', async () => {
        await storeFrontRecordPage.clickLocationType('segment');
      });
    },
  );

  //* This is a partial duplicate of @OGT-34219, this is a storefront test while the other @OGT-34219 is a employee test @duplicate
  test(
    'User is able to choose "From" point on the map and select endpoint from the search @broken_test' +
      '  @Xoriant_test',
    async ({storeFrontRecordPage}) => {
      await test.step('As the Ending Location search for address', async () => {
        await storeFrontRecordPage.chooseSegmentLocationPoint(
          'ending',
          'Washington, PA 15301, USA',
        );
      });

      await test.step('As the Starting Location choose a point on the map', async () => {
        await storeFrontRecordPage.putPointOnMap();
      });

      await test.step('Confirm the segment selection and verify it is saved', async () => {
        await storeFrontRecordPage.confirmSelectedSegmentLocation();
        await storeFrontRecordPage.verifyLocationDetails(
          '- Washington (Segment)',
        );
      });
    },
  );

  test(
    'User is able to  select "From" street number from the search and click on the map to choose' +
      ' the endpoint @OGT-34218 @broken_test @Xoriant_test',
    async ({storeFrontRecordPage}) => {
      await test.step('As the Starting Location search for address', async () => {
        await storeFrontRecordPage.chooseSegmentLocationPoint(
          'starting',
          'Washington, PA 15301, USA',
        );
      });

      await test.step('As the Ending Location choose a point on the map', async () => {
        await storeFrontRecordPage.putPointOnMap();
      });

      await test.step('Confirm the segment selection and verify it is saved', async () => {
        await storeFrontRecordPage.confirmSelectedSegmentLocation();
        await storeFrontRecordPage.verifyLocationDetails('(Segment)');
      });
    },
  );
});
