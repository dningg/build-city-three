import * as THREE from 'three';
import { Building } from './buildings/building.js';
import { SimObject } from './simObject.js';

export class Tile extends SimObject {
  terrain = 'grass';
  #building = null;

  constructor(x, y) {
    super(x, y);
    this.name = `Tile-${this.x}-${this.y}`;
  }


  get building() {
    return this.#building;
  }


  setBuilding(value) {
    // Remove and dispose resources for existing building
    if (this.#building) {
      this.#building.dispose();
      this.remove(this.#building);
    }

    this.#building = value;

    // Add to scene graph
    if (value) {
      this.add(this.#building);
    }
  }

  refreshView(city) {
    this.building?.refreshView(city);
    if (this.building?.hideTerrain) {
      this.setMesh(null);
    } else {
      /**
       * @type {THREE.Mesh}
       */
      const mesh = window.assetManager.getModel(this.terrain, this);
      mesh.name = this.terrain;
      this.setMesh(mesh);
    }
  }

  simulate(city) {
    this.building?.simulate(city);
  }

  distanceTo(tile) {
    return Math.abs(this.x - tile.x) + Math.abs(this.y - tile.y);
  }


};