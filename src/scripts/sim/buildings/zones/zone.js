import * as THREE from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils.js';
import { DevelopmentModule, DevelopmentState } from '../modules/development.js';
import { Building } from '../building.js';

//Represents a zoned building such as residential, commercial or industrial
export class Zone extends Building {
  style = ['A', 'B', 'C'][Math.floor(3 * Math.random())];
  development = new DevelopmentModule(this);

  constructor(x = 0, y = 0) {
    super(x, y);
    this.name = 'Zone';
    
    // Randomize the building rotation
    this.rotation.y = 90 * Math.floor(4 * Math.random()) * DEG2RAD;
  }

  refreshView() {
    let modelName;
    switch (this.development.state) {
      case DevelopmentState.underConstruction:
      case DevelopmentState.undeveloped:
        modelName = 'under-construction';
        break;
      default:
        modelName = `${this.type}-${this.style}${this.development.level}`;
        break;
    }

    let mesh = window.assetManager.getModel(modelName, this);

    if (this.development.state === DevelopmentState.abandoned) {
      mesh.traverse((obj) => {
        if (obj.material) {
          obj.material.color = new THREE.Color(0x707070);
        }
      });
    }
    
    this.setMesh(mesh);
  }

  simulate(city) {
    super.simulate(city);
    this.development.simulate(city);
  }
}