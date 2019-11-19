export function outsideVector(body, tiles, out = {}) {
  const {minX, maxX, minY, maxY} = tiles.localBounds;

  // corners
  if (
    (body.maxY < minY && body.maxX < minX) || // top-left
    (body.maxY < minY && body.minX > maxX) || // top-right
    (body.minY > maxY && body.maxX < minX) || // bottom-left
    (body.minY > maxY && body.minX > maxX) //    bottom-right
  ) {
    return null;
  }

  // from top
  if (body.maxY <= minY) {
    out.x = 0;
    out.y = 1;
    return out;
  }
  // from bottom
  if (body.minY >= maxY) {
    out.x = 0;
    out.y = -1;
    return out;
  }
  // from left
  if (body.maxX <= minX) {
    out.x = 1;
    out.y = 0;
    return out;
  }
  // from right
  if (body.minX >= maxX) {
    out.x = -1;
    out.y = 0;
    return out;
  }
}

export function isCornerCase(matrix) {
  return (
    (matrix[6] && !matrix[3] && !matrix[7]) || // bottom-left
    (matrix[8] && !matrix[5] && !matrix[7]) || // bottom-right
    (matrix[0] && !matrix[3] && !matrix[1]) || // top-left
    (matrix[2] && !matrix[5] && !matrix[1]) //    top-right
  );
}
