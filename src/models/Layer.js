import {Container} from 'pixi.js';
import padBounds from '@utils/padBounds';
import EntityContainer from '@models/EntityContainer';

class Layer {
  constructor(name = '') {
    this.name = name;
    this.level = null;

    this.entities = new EntityContainer();
    this.graphics = new Container();
    this.graphics.interactiveChildren = false;

    this.interactive = true;
    this.filterMargin = 10;
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

    if (this.interactive) {
      this.entities.forEach(entity => {
        entity.update(deltaTime);
      });
      this.updateFilters();
    }
  }

  updateFilters() {
    if (!this.graphics.filters) {
      return;
    }
    // todo: cache bounds for static layers
    this.graphics.filterArea = padBounds(
      this.graphics.getBounds(),
      this.filterMargin
    );
  }
}

export default Layer;
