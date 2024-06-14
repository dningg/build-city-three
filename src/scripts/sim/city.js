import * as THREE from 'three';
import { BuildingType } from './buildings/buildingType.js';
import { createBuilding } from './buildings/buildingFactory.js';
import { Tile } from './tile.js';
import { VehicleGraph } from './vehicles/vehicleGraph.js';

export class City extends THREE.Group {
  debugMeshes = new THREE.Group();
  root = new THREE.Group();
  services = [];
  size = 16;// dieu chinh kich thuoc o day
  simTime = 0;
  tiles = [];
  vehicleGraph;

  constructor(size, name = 'My City') {
    super();
    this.name = name;
    this.size = size;
    this.add(this.debugMeshes);
    this.add(this.root);
    this.tiles = [];
    for (let x = 0; x < this.size; x++) {
      const column = [];
      for (let y = 0; y < this.size; y++) {
        const tile = new Tile(x, y);
        tile.refreshView(this);
        this.root.add(tile);
        column.push(tile);
      }
      this.tiles.push(column);
    }
    this.services = [];
    this.vehicleGraph = new VehicleGraph(this.size);
    this.debugMeshes.add(this.vehicleGraph);
  }


  getTile(x, y) {
    if (x === undefined || y === undefined ||
      x < 0 || y < 0 ||
      x >= this.size || y >= this.size) {
      return null;
    } else {
      return this.tiles[x][y];
    }
  }


  simulate(steps = 1) {
    let count = 0;
    while (count++ < steps) {
      // Update services
      this.services.forEach((service) => service.simulate(this));
      // Update each building
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          this.getTile(x, y).simulate(this);
        }
      }
    }
    this.simTime++;
  }


  placeBuilding(x, y, buildingType) {
    const tile = this.getTile(x, y);
    // If the tile doesnt' already have a building, place one there
    if (tile && !tile.building) {
      tile.setBuilding(createBuilding(x, y, buildingType));
      tile.refreshView(this);
      // Update buildings on adjacent tile in case they need to
      // change their mesh (e.g. roads)
      this.getTile(x - 1, y)?.refreshView(this);
      this.getTile(x + 1, y)?.refreshView(this);
      this.getTile(x, y - 1)?.refreshView(this);
      this.getTile(x, y + 1)?.refreshView(this);
      if (tile.building.type === BuildingType.road) {
        this.vehicleGraph.updateTile(x, y, tile.building);
      }
    }
  }

  // Bulldozes the building at the specified coordinates
  bulldoze(x, y) {
    const tile = this.getTile(x, y);
    if (tile.building) {
      if (tile.building.type === BuildingType.road) {
        this.vehicleGraph.updateTile(x, y, null);
      }
      tile.building.dispose();
      tile.setBuilding(null);
      tile.refreshView(this);
      // Update neighboring tiles in case they need to change their mesh (e.g. roads)
      this.getTile(x - 1, y)?.refreshView(this);
      this.getTile(x + 1, y)?.refreshView(this);
      this.getTile(x, y - 1)?.refreshView(this);
      this.getTile(x, y + 1)?.refreshView(this);
    }
  }

  draw() {
    this.vehicleGraph.updateVehicles();
  }


  findTile(start, filter, maxDistance) {
    const startTile = this.getTile(start.x, start.y);
    const visited = new Set();
    const tilesToSearch = [];
    tilesToSearch.push(startTile);
    while (tilesToSearch.length > 0) {
      const tile = tilesToSearch.shift();
      if (visited.has(tile.id)) {
        continue;
      } else {
        visited.add(tile.id);
      }

      const distance = startTile.distanceTo(tile);
      if (distance > maxDistance) continue;
      tilesToSearch.push(...this.getTileNeighbors(tile.x, tile.y));
      if (filter(tile)) {
        return tile;
      }
    }
    return null;
  }

  getTileNeighbors(x, y) {
    const neighbors = [];
    if (x > 0) {
      neighbors.push(this.getTile(x - 1, y));
    }
    if (x < this.size - 1) {
      neighbors.push(this.getTile(x + 1, y));
    }
    if (y > 0) {
      neighbors.push(this.getTile(x, y - 1));
    }
    if (y < this.size - 1) {
      neighbors.push(this.getTile(x, y + 1));
    }
    return neighbors;
  }
}