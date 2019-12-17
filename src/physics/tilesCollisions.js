import BoundingBox from '@models/BoundingBox';
import Vector from '@models/Vector';

const alignMargin = 0.1;
const subtractError = 0.0001;

// mutable data
const m_bbox = new BoundingBox();
const m_vector = Vector.create();

export function detectTilesCollision(
  tilemap,
  bbox,
  deltaTimeVelocity,
  onCollision
) {
  // we should assume that velocity was already applied to
  // the bbox and before detecting collision we have to shift
  // to the initial position.

  m_bbox.copy(bbox);
  m_bbox.translateX(-deltaTimeVelocity[0]);
  m_bbox.translateY(-deltaTimeVelocity[1]);

  if (deltaTimeVelocity[0] > deltaTimeVelocity[1]) {
    if (deltaTimeVelocity[0] !== 0) {
      detectAxisCollision(0, tilemap, m_bbox, deltaTimeVelocity, onCollision);
      m_bbox.translateX(deltaTimeVelocity[0]);
    }

    if (deltaTimeVelocity[1] !== 0) {
      detectAxisCollision(1, tilemap, m_bbox, deltaTimeVelocity, onCollision);
      m_bbox.translateY(deltaTimeVelocity[1]);
    }
  } else {
    if (deltaTimeVelocity[1] !== 0) {
      detectAxisCollision(1, tilemap, m_bbox, deltaTimeVelocity, onCollision);
      m_bbox.translateY(deltaTimeVelocity[1]);
    }

    if (deltaTimeVelocity[0] !== 0) {
      detectAxisCollision(0, tilemap, m_bbox, deltaTimeVelocity, onCollision);
      m_bbox.translateX(deltaTimeVelocity[0]);
    }
  }

  m_vector[0] = m_bbox.min[0] - bbox.min[0];
  m_vector[1] = m_bbox.min[1] - bbox.min[1];

  // fix subtraction problem in javascript
  if (Math.abs(m_vector[0]) <= subtractError) m_vector[0] = 0;
  if (Math.abs(m_vector[1]) <= subtractError) m_vector[1] = 0;
  return m_vector;
}

// based on https://github.com/chrisdickinson/collide-2d-tilemap
function detectAxisCollision(moveAxis, tilemap, bbox, velocity, onCollision) {
  const {coordBoundingBox: tilebbox, tilesize, offset} = tilemap;

  const positive = velocity[moveAxis] > 0;
  const direction = positive ? 1 : -1;

  const leading = bbox[positive ? 'max' : 'min'][moveAxis];
  const moveStart = Math.floor(leading / tilesize);
  const moveEnd = Math.floor((leading + velocity[moveAxis]) / tilesize);

  const sideAxis = +!moveAxis;
  const sideStart = Math.floor((bbox.min[sideAxis] + alignMargin) / tilesize);
  const sideEnd = Math.ceil((bbox.max[sideAxis] - alignMargin) / tilesize);

  for (let i = moveStart; i !== moveEnd + direction; i += direction) {
    if (i < tilebbox.min[moveAxis] || i >= tilebbox.max[moveAxis]) {
      continue;
    }

    for (let j = sideStart; j !== sideEnd; j += 1) {
      if (j < tilebbox.min[sideAxis] || j >= tilebbox.max[sideAxis]) {
        continue;
      }

      m_vector[moveAxis] = i - offset[moveAxis];
      m_vector[sideAxis] = j - offset[sideAxis];

      const index = tilemap.getIndex.apply(tilemap, m_vector);
      const value = tilemap.values[index];

      if (value) {
        const tileEdge = (positive ? i : i + 1) * tilesize;
        const shift = tileEdge - leading;

        if (onCollision(value, index, moveAxis, shift, velocity)) {
          return true;
        }
      }
    }
  }

  return false;
}
