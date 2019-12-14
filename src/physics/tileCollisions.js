// temporary data
const _vec2 = [0, 0];

export function applyTileCollision(tilemap, bbox, velocity) {
  // we should assume that velocity was already applied to
  // the bbox and before detecting collision we have to shift
  // to the initial position.

  bbox.translateX(-velocity[0]);
  bbox.translateY(-velocity[1]);

  if (velocity[0] > velocity[1]) {
    if (velocity[0] !== 0 && !applyAxisCollision(0, tilemap, bbox, velocity)) {
      bbox.translateX(velocity[0]);
    }

    if (velocity[1] !== 0 && !applyAxisCollision(1, tilemap, bbox, velocity)) {
      bbox.translateY(velocity[1]);
    }
  } else {
    if (velocity[1] !== 0 && !applyAxisCollision(1, tilemap, bbox, velocity)) {
      bbox.translateY(velocity[1]);
    }

    if (velocity[0] !== 0 && !applyAxisCollision(0, tilemap, bbox, velocity)) {
      bbox.translateX(velocity[0]);
    }
  }

  return bbox;
}

function applyAxisCollision(moveAxis, tilemap, bbox, velocity) {
  const {coordBoundingBox: tilebbox, tilesize, offset} = tilemap;

  const positive = velocity[moveAxis] > 0;
  const direction = positive ? 1 : -1;

  const leading = bbox[positive ? 'max' : 'min'][moveAxis];
  const moveStart = Math.floor(leading / tilesize);
  const moveEnd = Math.floor((leading + velocity[moveAxis]) / tilesize);

  const sideAxis = +!moveAxis;
  const sideStart = Math.floor(bbox.min[sideAxis] / tilesize);
  const sideEnd = Math.ceil(bbox.max[sideAxis] / tilesize);

  for (let i = moveStart; i !== moveEnd + direction; i += direction) {
    if (i < tilebbox.min[moveAxis] || i >= tilebbox.max[moveAxis]) {
      continue;
    }

    for (let j = sideStart; j !== sideEnd; j += 1) {
      if (j < tilebbox.min[sideAxis] || j >= tilebbox.max[sideAxis]) {
        continue;
      }

      _vec2[moveAxis] = i - offset[moveAxis];
      _vec2[sideAxis] = j - offset[sideAxis];

      const index = tilemap.getIndex.apply(tilemap, _vec2);
      const value = tilemap.values[index];

      if (value) {
        const tileEdge = (positive ? i : i + 1) * tilesize;
        const bboxSize = Math.round(bbox.max[moveAxis] - bbox.min[moveAxis]);

        if (positive) {
          bbox.min[moveAxis] = tileEdge - bboxSize;
          bbox.max[moveAxis] = tileEdge;
        } else {
          bbox.min[moveAxis] = tileEdge;
          bbox.max[moveAxis] = tileEdge + bboxSize;
        }

        return true;
      }
    }
  }

  return false;
}
