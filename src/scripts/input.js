/** 
 * Manages mouse
 */
export class InputManager {
  mouse = { x: 0, y: 0 };
  isLeftMouseDown = false;
  isMiddleMouseDown = false;
  isRightMouseDown = false;

  constructor() {
    window.ui.gameWindow.addEventListener('mousedown', this.#onMouseDown.bind(this), false);
    window.ui.gameWindow.addEventListener('mouseup', this.#onMouseUp.bind(this), false);
    window.ui.gameWindow.addEventListener('mousemove', this.#onMouseMove.bind(this), false);
    window.ui.gameWindow.addEventListener('contextmenu', (event) => event.preventDefault(), false);
  }

  #onMouseDown(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = true;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = true;
    }
    if (event.button === 2) {
      this.isRightMouseDown = true;
    }
  }


  #onMouseUp(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = false;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = false;
    }
    if (event.button === 2) {
      this.isRightMouseDown = false;
    }
  }


  #onMouseMove(event) {
    this.isLeftMouseDown = event.buttons & 1;
    this.isRightMouseDown = event.buttons & 2;
    this.isMiddleMouseDown = event.buttons & 4;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }
}