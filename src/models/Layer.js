import {Graphics} from 'pixi.js';
import EntityContainer from '@models/EntityContainer';
import {renderDefaultBox} from '@renders/box';

class Layer {
  constructor(name, color = 0x7c7c7c) {
    this.name = name;
    this.color = color;

    this.level = null;
    this.graphics = new Graphics();
    this.entities = new EntityContainer();
    this.renderer = null;
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
      const props = {
        g: this.graphics,
        left: global.rootX + entity.left,
        top: global.rootY + entity.top,
        size: entity.size,
        color: entity.color || this.color
      };

      if (this.renderer) {
        this.renderer(props);
      } else {
        renderDefaultBox(props);
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
