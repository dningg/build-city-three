import * as THREE from 'three';
import { SimObject } from '../simObject';

export class Building extends SimObject {
  type = 'building';
  hideTerrain = false;
  #statusIcon = new THREE.Sprite();

  constructor() {
    super();
    this.#statusIcon.visible = false;
    this.#statusIcon.material = new THREE.SpriteMaterial({ depthTest: false })
    this.#statusIcon.layers.set(1);
    this.#statusIcon.scale.set(0.5, 0.5, 0.5);
    this.add(this.#statusIcon);
  }
  
  simulate(city) {
    super.simulate(city);
  }

  dispose() {
    super.dispose();
  }
}