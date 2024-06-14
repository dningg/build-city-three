import * as THREE from 'three';
import { AssetManager } from './assets/assetManager.js';
import { CameraManager } from './camera.js';
import { InputManager } from './input.js';
import { City } from './sim/city.js';
import { initClouds, animateClouds } from './sim/cloud/cloud.js';

export class Game {
  city;
  focusedObject = null;
  inputManager;
  selectedObject = null;
  cloud = [];
  audioLoader = new THREE.AudioLoader();
  listener = new THREE.AudioListener();
  backgroundMusic;

  constructor(city) {
    this.city = city;
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true
    });
    this.scene = new THREE.Scene();
    this.inputManager = new InputManager(window.ui.gameWindow);
    this.cameraManager = new CameraManager(window.ui.gameWindow);
    this.renderer.setSize(window.ui.gameWindow.clientWidth, window.ui.gameWindow.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    window.ui.gameWindow.appendChild(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();

    /**
     * Global instance of the asset manager
     */
    window.assetManager = new AssetManager(() => {
      window.ui.hideLoadingText();
      this.city = new City(24);//set up city size
      this.initialize(this.city);
      this.start();
      setInterval(this.simulate.bind(this), 1000);
    });

    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  /**
   * Initalizes the scene, clearing all existing assets
   */
  initialize(city) {
    this.scene.clear();
    this.scene.add(city);
    this.#setupLights();
    this.#setupGrid(city);
    this.clouds = initClouds(this.scene);
    // Load and set up the background music
    this.audioLoader.load('./scripts/music.mp3', (buffer) => {
      this.backgroundMusic = new THREE.Audio(this.listener);
      this.backgroundMusic.setBuffer(buffer);
      this.backgroundMusic.setLoop(true); 
      this.backgroundMusic.setVolume(1);
      this.backgroundMusic.play(); 
    });
  
  }
  

  #setupGrid(city) {
    // Add the grid
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      map: window.assetManager.textures['grid'],
      transparent: true,
      opacity: 0.2
    });
    gridMaterial.map.repeat = new THREE.Vector2(city.size, city.size);
    gridMaterial.map.wrapS = city.size;
    gridMaterial.map.wrapT = city.size;
    const grid = new THREE.Mesh(
      new THREE.BoxGeometry(city.size, 0.1, city.size),
      gridMaterial
    );
    grid.position.set(city.size / 2 - 0.5, -0.04, city.size / 2 - 0.5);
    this.scene.add(grid);
  }

  /**
   * Setup the lights for the scene
   */
  #setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(-10, 20, 0);
    sun.castShadow = true;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 50;
    sun.shadow.normalBias = 0.01;
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }
  
  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this));
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  draw() {
    this.city.draw();
    this.updateFocusedObject();
    if (this.inputManager.isLeftMouseDown) {
      this.useTool();
    }
    animateClouds(this.clouds);
    this.renderer.render(this.scene, this.cameraManager.camera);
  }


  simulate() {
    if (window.ui.isPaused) return;
    this.city.simulate(1);
  }


  useTool() {
    switch (window.ui.activeToolId) {
      case 'select':
        this.updateSelectedObject();
        break;
      case 'bulldoze':
        if (this.focusedObject) {
          const { x, y } = this.focusedObject;
          this.city.bulldoze(x, y);
        }
        break;
      default:
        if (this.focusedObject) {
          const { x, y } = this.focusedObject;
          this.city.placeBuilding(x, y, window.ui.activeToolId);
        }
        break;
    }
  }
  

  updateSelectedObject() {
    this.selectedObject?.setSelected(false);
    this.selectedObject = this.focusedObject;
    this.selectedObject?.setSelected(true);
  }


  updateFocusedObject() {  
    this.focusedObject?.setFocused(false);
    const newObject = this.#raycast();
    if (newObject !== this.focusedObject) {
      this.focusedObject = newObject;
    }
    this.focusedObject?.setFocused(true);
  }

  //Gets the mesh currently under the the mouse cursor. If there is nothing under the the mouse cursor, returns null
  #raycast() {
    var coords = {
      x: (this.inputManager.mouse.x / this.renderer.domElement.clientWidth) * 2 - 1,
      y: -(this.inputManager.mouse.y / this.renderer.domElement.clientHeight) * 2 + 1
    };

    this.raycaster.setFromCamera(coords, this.cameraManager.camera);

    let intersections = this.raycaster.intersectObjects(this.city.root.children, true);
    if (intersections.length > 0) {
      // The SimObject attached to the mesh is stored in the user data
      const selectedObject = intersections[0].object.userData;
      return selectedObject;
    } else {
      return null;
    }
  }

  //Resizes the renderer to fit the current game window
  onResize() {
    this.cameraManager.resize(window.ui.gameWindow);
    this.renderer.setSize(window.ui.gameWindow.clientWidth, window.ui.gameWindow.clientHeight);
  }
}

// Create a new game when the window is loaded
window.onload = () => {
  window.game = new Game();
}