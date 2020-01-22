import BoundingBox from '@core/BoundingBox';
import Vector from '../Vector';

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
  // persist initial position to compare after detection
  // because original bbox can change during collision

  const initialX = bbox.min[0];
  const initialY = bbox.min[1];

  // we should assume that velocity was already applied to
  // the bbox and before detecting collision we have to shift
  // to the initial position

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

  m_vector[0] = m_bbox.min[0] - initialX;
  m_vector[1] = m_bbox.min[1] - initialY;

  // fix subtraction problem in javascript
  if (Math.abs(m_vector[0]) <= subtractError) m_vector[0] = 0;
  if (Math.abs(m_vector[1]) <= subtractError) m_vector[1] = 0;
  return m_vector;
}

// based on https://github.com/chrisdickinson/collide-2d-tilemap
function detectAxisCollision(moveAxis, tilemap, bbox, velocity, onCollision) {
  const {tilesize, offset} = tilemap;

  const positive = velocity[moveAxis] > 0;
  const direction = positive ? 1 : -1;

  const leading = bbox[positive ? 'max' : 'min'][moveAxis];
  const moveStart = Math.floor(leading / tilesize);
  const moveEnd = Math.floor((leading + velocity[moveAxis]) / tilesize);

  const sideAxis = +!moveAxis;
  const sideStart = Math.floor((bbox.min[sideAxis] + alignMargin) / tilesize);
  const sideEnd = Math.ceil((bbox.max[sideAxis] - alignMargin) / tilesize);

  const moveMin = tilemap.min[moveAxis] / tilesize;
  const moveMax = tilemap.max[moveAxis] / tilesize;
  const sideMin = tilemap.min[sideAxis] / tilesize;
  const sideMax = tilemap.max[sideAxis] / tilesize;

  for (let i = moveStart; i !== moveEnd + direction; i += direction) {
    if (i < moveMin || i >= moveMax) continue;

    for (let j = sideStart; j !== sideEnd; j += 1) {
      if (j < sideMin || j >= sideMax) continue;

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
