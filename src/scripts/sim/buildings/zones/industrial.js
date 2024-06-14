import { BuildingType } from '../buildingType.js';
import { Zone } from './zone.js';

export class IndustrialZone extends Zone {
  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.industrial;
  }

  simulate(city) {
    super.simulate(city);
  }

  dispose() {
    super.dispose();
  }
}
