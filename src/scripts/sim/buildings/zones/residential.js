import { Zone } from './zone.js';
import { BuildingType } from '../buildingType.js';

export class ResidentialZone extends Zone {
  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.residential;
  }

  simulate(city) {
    super.simulate(city);
  }

  dispose() {
    super.dispose();
  }
}