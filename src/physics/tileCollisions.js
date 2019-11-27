const temp = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
};

export function resolveTileCollision(out, tilemap, bbox, velocity) {
  const x = Math.round(bbox.minX);
  const y = Math.round(bbox.minY);
  const closest = tilemap.closest(x, y);

  // we should assume that velocity was already applied to the bbox
  // and before detecting collision on x-axis we have to shift y-axis
  // to the initial position and then reapply it again.

  temp.minX = bbox.minX;
  temp.maxX = bbox.maxX;
  temp.minY = bbox.minY - velocity.y;
  temp.maxY = bbox.maxY - velocity.y;

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
      temp.minX >= tileMaxX ||
      temp.maxX <= tileMinX ||
      temp.minY >= tileMaxY ||
      temp.maxY <= tileMinY;

    if (!noIntersects) {
      if (velocity.x > 0) {
        if (temp.maxX > tileMinX) {
          temp.minX = tileMinX - 1;
          temp.maxX = temp.minX + 1;
        }
      } else if (velocity.x < 0) {
        if (temp.minX < tileMaxX) {
          temp.minX = tileMaxX;
          temp.maxX = temp.minX + 1;
        }
      }
    }
  }

  temp.minY += velocity.y;
  temp.maxY += velocity.y;

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
      temp.minX >= tileMaxX ||
      temp.maxX <= tileMinX ||
      temp.minY >= tileMaxY ||
      temp.maxY <= tileMinY;

    if (!noIntersects) {
      if (velocity.y > 0) {
        if (temp.maxY > tileMinY) {
          temp.minY = tileMinY - 1;
          temp.maxY = temp.minY + 1;
        }
      } else if (velocity.y < 0) {
        if (temp.minY < tileMaxY) {
          temp.minY = tileMaxY;
          temp.maxY = temp.minY + 1;
        }
      }
    }
  }

  out.x = temp.minX - bbox.minX;
  out.y = temp.minY - bbox.minY;
  return out;
}
