export function isOutsideOnCorner(body, tilemap) {
  const onTop = body.max[1] < tilemap.min[1];
  const onRight = body.min[0] > tilemap.max[0];
  const onBottom = body.min[1] > tilemap.max[1];
  const onLeft = body.max[0] < tilemap.min[0];

  return (
    (onTop && onLeft) ||
    (onTop && onRight) ||
    (onBottom && onLeft) ||
    (onBottom && onRight)
  );
}

export function getOutsideVector(body, tilemap, out) {
  // body on top
  if (body.max[1] <= tilemap.min[1]) {
    out[0] = 0;
    out[1] = 1;
    return out;
  }
  // bottom on bottom
  if (body.min[1] >= tilemap.max[1]) {
    out[0] = 0;
    out[1] = -1;
    return out;
  }
  // body on left
  if (body.max[0] <= tilemap.min[0]) {
    out[0] = 1;
    out[1] = 0;
    return out;
  }
  // body on right
  if (body.min[0] >= tilemap.max[0]) {
    out[0] = -1;
    out[1] = 0;
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
