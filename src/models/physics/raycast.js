import {arrayForEach} from '@utils/array';
import {sign} from '@utils/math';

export function createRaycast(layers, bounds) {
  function raycast(entity, direction) {
    const {horizontal} = direction;
    const targets = [];

    arrayForEach(layers, layer => {
      layer.entities.forEach(other => {
        const x = other.gridX - entity.gridX;
        const y = other.gridY - entity.gridY;

        if (sign(x) === direction.x && sign(y) === direction.y) {
          const distance = Math.abs(horizontal ? x : y);
          targets.push(distance);
        }
      });
    });

    if (targets.length) {
      return {
        type: 'solid',
        distance: Math.min(...targets),
        direction
      };
    }

    return {
      type: 'border',
      distance: getDistanceToBound(entity, direction, bounds),
      direction
    };
  }

  return raycast;
}

function getDistanceToBound(entity, direction, bounds) {
  const {size} = entity.ownerGlobal;
  const extend = size / 2;

  if (direction.y === -1) {
    return Math.round(Math.abs(bounds.top - extend - entity.pos.y) / size);
  }
  if (direction.x === 1) {
    return Math.round(Math.abs(bounds.right + extend - entity.pos.x) / size);
  }
  if (direction.y === 1) {
    return Math.round(Math.abs(bounds.bottom + extend - entity.pos.y) / size);
  }
  if (direction.x === -1) {
    return Math.round(Math.abs(bounds.left - extend - entity.pos.x) / size);
  }
  return 0;
}
