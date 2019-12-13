import BoundingBox from '@models/BoundingBox';

const _bbox = new BoundingBox();
const _vec2 = [0, 0];

export function resolveTileCollisionLegacy(tilemap, bbox, velocity) {
  const {tilesize, boundingBox: tilebox, offset} = tilemap;

  const x = Math.round(bbox.min[0] / tilesize);
  const y = Math.round(bbox.min[1] / tilesize);
  const closest = tilemap.closest(x, y);

  let index = 0;

  // we should assume that velocity was already applied to
  // the bbox and before detecting collision we have to shift
  // to the initial position.

  _bbox.copy(bbox);
  _bbox.translateX(-velocity[0]);
  _bbox.translateY(-velocity[1]);

  const width = _bbox.max[0] - _bbox.min[0];
  const height = _bbox.max[1] - _bbox.min[1];

  // y-axis
  if (velocity[1] !== 0) {
    _bbox.translateY(velocity[1]);

    for (index = 0; index < 9; index++) {
      if (!closest[index]) {
        continue;
      }
      const tileMinX = (x + ((index % 3) - 1)) * tilesize;
      const tileMinY = (y + (Math.floor(index / 3) - 1)) * tilesize;
      const tileMaxX = tileMinX + tilesize;
      const tileMaxY = tileMinY + tilesize;

      const noIntersects =
        _bbox.min[0] >= tileMaxX ||
        _bbox.max[0] <= tileMinX ||
        _bbox.min[1] >= tileMaxY ||
        _bbox.max[1] <= tileMinY;

      if (!noIntersects) {
        if (velocity[1] > 0) {
          if (_bbox.max[1] > tileMinY) {
            _bbox.min[1] = tileMinY - height;
            _bbox.max[1] = tileMinY;
          }
        } else if (velocity[1] < 0) {
          if (_bbox.min[1] < tileMaxY) {
            _bbox.min[1] = tileMaxY;
            _bbox.max[1] = tileMaxY - height;
          }
        }
      }
    }
  }

  // x-axis
  if (velocity[0] !== 0) {
    _bbox.translateX(velocity[0]);

    for (index = 0; index < 9; index++) {
      if (!closest[index]) {
        continue;
      }
      const tileMinX = (x + ((index % 3) - 1)) * tilesize;
      const tileMinY = (y + (Math.floor(index / 3) - 1)) * tilesize;
      const tileMaxX = tileMinX + tilesize;
      const tileMaxY = tileMinY + tilesize;

      const noIntersects =
        _bbox.min[0] >= tileMaxX ||
        _bbox.max[0] <= tileMinX ||
        _bbox.min[1] >= tileMaxY ||
        _bbox.max[1] <= tileMinY;

      if (!noIntersects) {
        if (velocity[0] > 0) {
          if (_bbox.max[0] > tileMinX) {
            _bbox.min[0] = tileMinX - width;
            _bbox.max[0] = tileMinX;
          }
        } else if (velocity[0] < 0) {
          if (_bbox.min[0] < tileMaxX) {
            _bbox.min[0] = tileMaxX;
            _bbox.max[0] = tileMaxX + width;
          }
        }
      }
    }
  }

  return _bbox;
}
