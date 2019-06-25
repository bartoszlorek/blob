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
    this.entities.memo.clear();
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });
  }

  render(global) {
    this.graphics.clear();
    this.entities.forEach(entity => {
      if (!entity.visible) {
        return;
      }
      const x = global.rootX + entity.left;
      const y = global.rootY + entity.top;
      const {size} = entity;

      this.graphics.beginFill(entity.color || this.color);
      this.graphics.drawRect(x, y, size, size);

      if (entity.bevel) {
        this.graphics.lineStyle(2, entity.bevel, 1, 0);
        this.graphics.moveTo(x + size, y);
        this.graphics.lineTo(x + size, y + size);
        this.graphics.lineTo(x, y + size);
        this.graphics.lineStyle(0);
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

  filters(array) {
    this.graphics.filters = array;
  }
}

export default Layer;
