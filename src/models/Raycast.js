import {sign} from '@utils/math';

class Raycast {
  constructor(global, layers = [], bounds) {
    this.global = global;
    this.layers = layers;
    this.bounds = bounds;
  }

  scan(origin, direction) {
    const originGridX = this.global.localToGrid(origin.x);
    const originGridY = this.global.localToGrid(origin.y);
    const horizontal = direction.y === 0;
    const targets = [];

    this.layers.forEach(layer => {
      layer.entities.forEach(entity => {
        const entityGridX = this.global.localToGrid(entity.pos.x);
        const entityGridY = this.global.localToGrid(entity.pos.y);

        const x = entityGridX - originGridX;
        const y = entityGridY - originGridY;

        if (sign(x) === direction.x && sign(y) === direction.y) {
          const distance = Math.abs(horizontal ? x : y);
          targets.push(distance);
        }
      });
    });

    if (targets.length) {
      return {
        type: 'solid',
        distance: Math.min(...targets)
      };
    }

    return {
      type: 'border',
      distance: this._getDistanceToBound(origin, direction)
    };
  }

  _getDistanceToBound(origin, direction) {
    const {top, right, bottom, left} = this.bounds;
    const originGridX = this.global.localToGrid(origin.x);
    const originGridY = this.global.localToGrid(origin.y);
    const extend = this.global.size / 2;

    if (direction.y === -1) {
      return Math.abs(this.global.localToGrid(top - extend) - originGridY);
    }
    if (direction.x === 1) {
      return Math.abs(this.global.localToGrid(right + extend) - originGridX);
    }
    if (direction.y === 1) {
      return Math.abs(this.global.localToGrid(bottom + extend) - originGridY);
    }
    if (direction.x === -1) {
      return Math.abs(this.global.localToGrid(left - extend) - originGridX);
    }
  }
}

export default Raycast;
