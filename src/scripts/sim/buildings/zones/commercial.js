import { Zone } from './zone.js';
import { BuildingType } from '../buildingType.js';

export class CommercialZone extends Zone {
  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.commercial;
  }

  simulate(city) {
    super.simulate(city);
  }

  dispose() {
    super.dispose();
  }
}
