import { Building } from '../building.js';
import { BuildingType } from '../buildingType.js';

export class PowerPlant extends Building {

  constructor(x, y) {
    super(x, y);
    this.type = BuildingType.powerPlant;
  }


  get powerAvailable() {
    if (this.roadAccess.value) {
      return this.powerCapacity - this.powerConsumed;
    } else {
      return 0;
    }
  }

  refreshView() {
    let mesh = window.assetManager.getModel(this.type, this);
    this.setMesh(mesh);
  }
}