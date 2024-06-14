import { BuildingType } from './buildingType.js';
import { CommercialZone } from './zones/commercial.js';
import { ResidentialZone } from './zones/residential.js';
import { IndustrialZone } from './zones/industrial.js';
import { Road } from './transportation/road.js';
import { PowerPlant } from './power/powerPlant.js';
import { PowerLine } from './power/powerLine.js';

//Creates a new building object
export function createBuilding(x, y, type) {
  switch (type) {
    case BuildingType.residential: 
      return new ResidentialZone();
    case BuildingType.commercial: 
      return new CommercialZone();
    case BuildingType.industrial: 
      return new IndustrialZone();
    case BuildingType.road: 
      return new Road();
    case BuildingType.powerPlant:
      return new PowerPlant();
    case BuildingType.powerLine:
      return new PowerLine();
    default:
      console.error(`${type} is not a recognized building type.`);
  }
}