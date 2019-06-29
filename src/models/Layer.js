import {Container} from 'pixi.js';
import EntityContainer from '@models/EntityContainer';

class Layer {
  constructor(name = '') {
    this.name = name;
    this.level = null;

    // content
    this.entities = new EntityContainer();
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;
  }

  append(entity) {
    if (entity.parent === this) {
      return;
    }
    if (entity.parent !== null) {
      entity.parent.remove(entity);
    }
    this.entities.add(entity);
    this.graphics.addChild(entity.sprite);
    entity.parent = this;
  }

  remove(entity) {
    if (entity.parent === this) {
      this.entities.remove(entity);
      this.graphics.removeChild(entity.sprite);
      entity.parent = null;
    }
  }

  update(deltaTime) {
    this.entities.memo.clear();
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });
  }

  filters(array) {
    this.graphics.filters = array;
  }
}

export default Layer;
