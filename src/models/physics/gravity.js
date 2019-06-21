import {createRaycast} from '@models/physics/raycast';
import {arrayForEach} from '@utils/array';
import {createMatrix} from '@utils/matrix';
import Vector from '@models/Vector';

const SOLID_SOLID = Symbol('solid-solid');
const SOLID_BORDER = Symbol('solid-border');
const BORDER_BORDER = Symbol('border-border');

export function calculateGravity({entity, layers, bounds}) {
  const outside = outsideBounds(entity, bounds);

  if (outside) {
    return outside;
  }
  // corner case outside bounds
  // should use last known gravity
  if (outside === null) {
    return null;
  }

  // corner case inside bounds
  if (isCornerCase(entity, layers)) {
    return null;
  }

  const raycast = createRaycast(layers, bounds);
  const top = raycast(entity, new Vector(0, -1));
  const right = raycast(entity, new Vector(1, 0));
  const bottom = raycast(entity, new Vector(0, 1));
  const left = raycast(entity, new Vector(-1, 0));

  const y = sortPair(top, bottom);
  const x = sortPair(left, right);

  // common cases
  if (x.type === SOLID_SOLID && y.type === SOLID_SOLID) {
    return console.log(SOLID_SOLID);
  }

  if (x.type === SOLID_BORDER && y.type === SOLID_BORDER) {
    if (x[0].distance < y[0].distance) {
      return x[0].direction;
    }
    if (x[0].distance > y[0].distance) {
      return y[0].direction;
    }
    if (x[1].distance < y[1].distance) {
      return x[0].direction;
    }
    if (x[1].distance > y[1].distance) {
      return y[0].direction;
    }
    return y[0].direction;
  }

  if (
    (x.type === SOLID_SOLID && y.type === SOLID_BORDER) ||
    (x.type === SOLID_BORDER && y.type === SOLID_SOLID)
  ) {
    return console.log(SOLID_SOLID, SOLID_BORDER);
  }
}

function outsideBounds(entity, bounds) {
  // corners
  if (
    (entity.bottom < bounds.top && entity.right < bounds.left) ||
    (entity.bottom < bounds.top && entity.left > bounds.right) ||
    (entity.top > bounds.bottom && entity.right < bounds.left) ||
    (entity.top > bounds.bottom && entity.left > bounds.right)
  ) {
    return null;
  }

  // straight
  if (entity.bottom <= bounds.top) {
    return new Vector(0, 1);
  }
  if (entity.top >= bounds.bottom) {
    return new Vector(0, -1);
  }
  if (entity.right <= bounds.left) {
    return new Vector(1, 0);
  }
  if (entity.left >= bounds.right) {
    return new Vector(-1, 0);
  }
}

function isCornerCase(entity, layers) {
  const mat = createMatrix(3, 3);

  // set matrix of closest neighbours
  arrayForEach(layers, layer => {
    layer.entities.forEach(other => {
      if (
        other.gridX >= entity.gridX - 1 &&
        other.gridY >= entity.gridY - 1 &&
        other.gridX <= entity.gridX + 1 &&
        other.gridY <= entity.gridY + 1
      ) {
        const x = other.gridX - entity.gridX + 1;
        const y = other.gridY - entity.gridY + 1;
        mat[x][y] = true;
      }
    });
  });

  return (
    (mat[2][0] && !mat[1][0] && !mat[2][1]) || // top-right
    (mat[2][2] && !mat[2][1] && !mat[1][2]) || // bottom-right
    (mat[0][2] && !mat[1][2] && !mat[0][1]) || // bottom-left
    (mat[0][0] && !mat[0][1] && !mat[1][0]) // top-left
  );
}

function sortPair(a, b) {
  const pair = [];

  if (a.type === 'solid') {
    pair.type = b.type === 'solid' ? SOLID_SOLID : SOLID_BORDER;
    pair.push(a, b);
  } else {
    pair.type = b.type === 'solid' ? SOLID_BORDER : BORDER_BORDER;
    pair.push(b, a);
  }
  return pair;
}
