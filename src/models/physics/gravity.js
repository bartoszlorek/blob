import {createRaycast} from '@models/physics/raycast';
import {arrayForEach} from '@utils/array';
import Vector from '@models/Vector';
import Matrix from '@models/Matrix';

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
  const neighbours = new Matrix(3, 3);
  const {entries: e} = neighbours;

  arrayForEach(layers, layer => {
    neighbours.merge(layer.entities.closest(entity, 1));
  });

  return (
    (e[2][0] && !e[1][0] && !e[2][1]) || // top-right
    (e[2][2] && !e[2][1] && !e[1][2]) || // bottom-right
    (e[0][2] && !e[1][2] && !e[0][1]) || // bottom-left
    (e[0][0] && !e[0][1] && !e[1][0]) // top-left
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
