import config from '../../../config.js';
import { SimModule } from './simModule.js';

export const DevelopmentState = {
  developed: 'developed',
  underConstruction: 'under-construction',
  undeveloped: 'undeveloped',
};

export class DevelopmentModule extends SimModule {
  #constructionCounter = 0;
  #level = 1;
  maxLevel = 3;
  #state = DevelopmentState.undeveloped;
  #zone;

  constructor(zone) {
    super();
    this.#zone = zone;
  }

  get level() {
    return this.#level;
  }

  set level(value) {
    this.#level = value;
    this.#zone.refreshView();
  }

  get state() {
    return this.#state;
  }

  set state(value) {
    this.#state = value;
    this.#zone.refreshView();
  }


  simulate(city) {
    switch (this.state) {
      case DevelopmentState.undeveloped:
        if (Math.random() < config.modules.development.redevelopChance) {
          this.state = DevelopmentState.underConstruction;
          this.#constructionCounter = 0;
        }
        break;
      case DevelopmentState.underConstruction:
        if (++this.#constructionCounter === config.modules.development.constructionTime) {
          this.state = DevelopmentState.developed;
          this.level = 1;
          this.#constructionCounter = 0;
        }
        break;
      case DevelopmentState.developed:
        if (this.level < this.maxLevel && Math.random() < config.modules.development.levelUpChance) {
          this.level++;
        }
        break;
    }
  }
}