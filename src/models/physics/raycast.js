import {arrayForEach} from '@utils/array';
import {sign} from '@utils/math';

export const originFromEntity = entity => ({
  x: entity.gridX,
  y: entity.gridY
});

export function createRaycast(solids, border) {
  function raycast(origin, direction) {
    const distance = distanceToSolid(solids, origin, direction);

    if (distance) {
      return {
        type: 'solid',
        distance,
        direction
      };
    }
    return {
      type: 'border',
      distance: distanceToBorder(border, origin, direction),
      direction
    };
  }

  return raycast;
}

function distanceToSolid(solids, origin, direction) {
  const {horizontal} = direction;
  const hits = [];

  arrayForEach(solids, entities => {
    entities.forEach(entity => {
      const distX = entity.gridX - origin.x;
      const distY = entity.gridY - origin.y;

      if (sign(distX) === direction.x && sign(distY) === direction.y) {
        hits.push(Math.abs(horizontal ? distX : distY));
      }
    });
  });

  if (hits.length) {
    return Math.min(...hits);
  }
  return null;
}

function distanceToBorder(border, origin, direction) {
  if (direction.y === -1) {
    return Math.abs(border.top - origin.y);
  }
  if (direction.x === 1) {
    return Math.abs(border.right - origin.x);
  }
  if (direction.y === 1) {
    return Math.abs(border.bottom - origin.y);
  }
  if (direction.x === -1) {
    return Math.abs(border.left - origin.x);
  }
  return 0;
}
