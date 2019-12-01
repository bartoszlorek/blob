const _bbox = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
};

function applyCollision(axis, bbox, tilemap, velocity) {
  const {bounds, offset} = tilemap;
  const minX = Math.floor(bbox.minX);
  const minY = Math.floor(bbox.minY);
  const maxX = Math.ceil(bbox.maxX);
  const maxY = Math.ceil(bbox.maxY);

  for (let y = minY; y < maxY; y++) {
    if (y < bounds.minY || y > bounds.maxY) {
      continue;
    }
    for (let x = minX; x < maxX; x++) {
      if (x < bounds.minX || x > bounds.maxX) {
        continue;
      }
      const index = tilemap.getIndex(x - offset[0], y - offset[1]);

      if (tilemap.values[index] !== 0) {
        const base = axis === 'X' ? x : y;
        const edge = velocity > 0 ? base - 1 : base + 1;
        bbox['min' + axis] = edge;
        bbox['max' + axis] = edge + 1;
      }
    }
  }
}

export function resolveTileCollision(out, tilemap, bbox, velocity) {
  // we should assume that velocity was already applied to the bbox
  // and before detecting collision on x-axis we have to shift y-axis
  // to the initial position and then reapply it again.

  const actualMinY = bbox.minY;
  const actualMaxY = bbox.maxY;

  _bbox.minX = bbox.minX;
  _bbox.maxX = bbox.maxX;
  _bbox.minY = bbox.minY - velocity.y;
  _bbox.maxY = bbox.maxY - velocity.y;

  if (velocity.x !== 0) {
    applyCollision('X', _bbox, tilemap, velocity.x);
  }

  _bbox.minY = actualMinY;
  _bbox.maxY = actualMaxY;

  if (velocity.y !== 0) {
    applyCollision('Y', _bbox, tilemap, velocity.y);
  }

  out.x = _bbox.minX - bbox.minX;
  out.y = _bbox.minY - bbox.minY;
  return out;
}

export function resolveTileCollisionLegacy(out, tilemap, bbox, velocity) {
  const x = Math.round(bbox.minX);
  const y = Math.round(bbox.minY);
  const closest = tilemap.closest(x, y);

  // we should assume that velocity was already applied to the bbox
  // and before detecting collision on x-axis we have to shift y-axis
  // to the initial position and then reapply it again.

  const actualMinY = bbox.minY;
  const actualMaxY = bbox.maxY;

  _bbox.minX = bbox.minX;
  _bbox.maxX = bbox.maxX;
  _bbox.minY = bbox.minY - velocity.y;
  _bbox.maxY = bbox.maxY - velocity.y;

  let index = 0;

  // x-axis
  for (index = 0; index < 9; index++) {
    if (!closest[index]) {
      continue;
    }
    const tileMinX = x + ((index % 3) - 1);
    const tileMinY = y + (Math.floor(index / 3) - 1);
    const tileMaxX = tileMinX + 1;
    const tileMaxY = tileMinY + 1;

    const noIntersects =
      _bbox.minX >= tileMaxX ||
      _bbox.maxX <= tileMinX ||
      _bbox.minY >= tileMaxY ||
      _bbox.maxY <= tileMinY;

    if (!noIntersects) {
      if (velocity.x > 0) {
        if (_bbox.maxX > tileMinX) {
          _bbox.minX = tileMinX - 1;
          _bbox.maxX = _bbox.minX + 1;
        }
      } else if (velocity.x < 0) {
        if (_bbox.minX < tileMaxX) {
          _bbox.minX = tileMaxX;
          _bbox.maxX = _bbox.minX + 1;
        }
      }
    }
  }

  _bbox.minY = actualMinY;
  _bbox.maxY = actualMaxY;

  // y-axis
  for (index = 0; index < 9; index++) {
    if (!closest[index]) {
      continue;
    }
    const tileMinX = x + ((index % 3) - 1);
    const tileMinY = y + (Math.floor(index / 3) - 1);
    const tileMaxX = tileMinX + 1;
    const tileMaxY = tileMinY + 1;

    const noIntersects =
      _bbox.minX >= tileMaxX ||
      _bbox.maxX <= tileMinX ||
      _bbox.minY >= tileMaxY ||
      _bbox.maxY <= tileMinY;

    if (!noIntersects) {
      if (velocity.y > 0) {
        if (_bbox.maxY > tileMinY) {
          _bbox.minY = tileMinY - 1;
          _bbox.maxY = _bbox.minY + 1;
        }
      } else if (velocity.y < 0) {
        if (_bbox.minY < tileMaxY) {
          _bbox.minY = tileMaxY;
          _bbox.maxY = _bbox.minY + 1;
        }
      }
    }
  }

  out.x = _bbox.minX - bbox.minX;
  out.y = _bbox.minY - bbox.minY;
  return out;
}
