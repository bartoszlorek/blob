import {Graphics} from 'pixi.js';
import EntityContainer from '@models/EntityContainer';

class Layer {
  constructor(name, color = 0x7c7c7c) {
    this.name = name;
    this.color = color;

    this.graphics = new Graphics();
    this.entities = new EntityContainer();
    this.level = null;
  }

  get head() {
    return this.entities.items[0];
  }

  update(deltaTime) {
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });
  }

  render(global) {
    this.graphics.clear();
    this.entities.forEach(entity => {
      if (entity.visible) {
        this.graphics.beginFill(entity.color || this.color);
        this.graphics.drawRect(
          global.rootX + entity.left,
          global.rootY + entity.top,
          entity.size,
          entity.size
        );
      }
    });
  }

  append(entity) {
    if (entity.parent === this) {
      return;
    }
    if (entity.parent !== null) {
      entity.parent.remove(entity);
    }
    this.entities.add(entity);
    entity.parent = this;
  }

  remove(entity) {
    if (entity.parent === this) {
      this.entities.remove(entity);
      entity.parent = null;
    }
  }
}

export default Layer;
