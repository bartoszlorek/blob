import BoundingBox from '@models/BoundingBox';

const _bbox = new BoundingBox();
const _vec2 = [0, 0];

// todo: cleanup legacy
export {resolveTileCollisionLegacy} from './tileCollisionsLegacy';

export function resolveTileCollision(tilemap, bbox, velocity) {
  // we should assume that velocity was already applied to
  // the bbox and before detecting collision we have to shift
  // to the initial position.

  _bbox.copy(bbox);
  _bbox.translateX(-velocity[0]);
  _bbox.translateY(-velocity[1]);

  const aaxis = velocity[0] > velocity[1] ? 0 : 1;
  const baxis = +!aaxis;

  if (velocity[aaxis] !== 0) {
    detectCollision(aaxis, tilemap, _bbox, velocity, handleCollision);

    _vec2[aaxis] = velocity[aaxis];
    _vec2[baxis] = 0;
    _bbox.translate(_vec2);
  }

  if (velocity[baxis] !== 0) {
    detectCollision(baxis, tilemap, _bbox, velocity, handleCollision);

    _vec2[aaxis] = 0;
    _vec2[baxis] = velocity[baxis];
    _bbox.translate(_vec2);
  }

  return _bbox;
}

function handleCollision(value, index, diff, axis, velocity) {
  velocity[axis] = diff;
  return true;
}

function detectCollision(moveAxis, tilemap, box, velocity, onCollision) {
  const {tilesize, boundingBox: tilebox, offset} = tilemap;

  const positive = velocity[moveAxis] > 0;
  const leading = box[positive ? 'max' : 'min'][moveAxis];

  const direction = positive ? 1 : -1;
  const moveStart = Math.floor(leading / tilesize);
  const moveEnd = Math.floor((leading + velocity[moveAxis]) / tilesize);

  const sideAxis = +!moveAxis;
  const sideStart = Math.floor(box.min[sideAxis] / tilesize) | 0;
  const sideEnd = Math.ceil(box.max[sideAxis] / tilesize) | 0;

  for (let i = moveStart; i !== moveEnd + direction; i += direction) {
    if (i < tilebox.min[moveAxis] || i >= tilebox.max[moveAxis]) {
      continue;
    }

    for (let j = sideStart; j !== sideEnd; j += 1) {
      if (j < tilebox.min[sideAxis] || j >= tilebox.max[sideAxis]) {
        continue;
      }

      _vec2[moveAxis] = i - offset[moveAxis];
      _vec2[sideAxis] = j - offset[sideAxis];

      const index = tilemap.getIndex.apply(tilemap, _vec2);
      const value = tilemap.values[index];

      if (value) {
        const edge = (positive ? i : i + 1) * tilesize;
        const diff = edge - leading;

        if (onCollision(value, index, diff, moveAxis, velocity) === true) {
          return;
        }
      }
    }
  }
}
