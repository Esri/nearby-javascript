

import { stub } from 'sinon';
import { nearbyLayer } from './layers';
import { addLocations, initialize, locate, view } from './map';

jest.mock('esri/layers/FeatureLayer');
jest.mock('esri/core/watchUtils');
jest.mock('esri/layers/VectorTileLayer');
jest.mock('esri/Map');
jest.mock('esri/views/MapView');

describe('data/map', () => {
  describe('initialize', () => {
    let locateStub: any;

    beforeEach(() => {
      locateStub = stub(locate, 'locate');
    });

    afterEach(() => {
      locateStub.restore();
    });

    it('should initialize the mapview', () => {
      const element = document.createElement('div');
      initialize(element);
      expect(view.container).toEqual(element);
    });
  });

  describe('addLocations', () => {
    let queryOIDStub: any;
    let applyEditsStub: any;
    let viewWhenStub: any;
    let viewGoToStub: any;
    let realNearbyLayer: any;

    beforeEach(() => {
      realNearbyLayer = nearbyLayer;
      queryOIDStub = stub(nearbyLayer, 'queryObjectIds');
      applyEditsStub = stub(nearbyLayer, 'applyEdits');
      viewWhenStub = stub(view, 'when');
      viewGoToStub = stub(view, 'goTo');

      queryOIDStub.resolves([1, 2, 3]);
      applyEditsStub.resolves({ success: true });
      viewWhenStub.resolves();
      viewGoToStub.resolves();
    });

    afterEach(() => {
      (nearbyLayer as any) = realNearbyLayer;
      queryOIDStub.restore();
      applyEditsStub.restore();
      viewWhenStub.restore();
      viewGoToStub.restore();
    });

    it('should add results as graphics to the map', async () => {
      const item = {
        name: 'test',
        address: '221B Baker St',
        icon: 'food',
        location: {
          x: 22,
          y: 41
        }
      };

      await addLocations([item as any]);
      expect(queryOIDStub.called).toEqual(true);
      expect(applyEditsStub.called).toEqual(true);
    });
  });
});
