import Vector from '@models/Vector';

export function raycast(out, tiles, body, dX, dY) {
  const match = tiles.closestInDirection(body.gridX, body.gridY, dX, dY);

  if (match) {
    out.type = 'solid';
    out.distance = distanceToTile(body, match);
  } else {
    out.type = 'border';
    out.distance = distanceToBorder(tiles, body, dX, dY);
  }

  out.direction = new Vector(dX, dY);
  return out;
}

function distanceToBorder(tiles, body, dX, dY) {
  if (dY === -1) {
    return Math.abs(tiles.bounds.minY - body.gridY) + 1;
  }
  if (dX === 1) {
    return Math.abs(tiles.bounds.maxX - body.gridX) + 1;
  }
  if (dY === 1) {
    return Math.abs(tiles.bounds.maxY - body.gridY) + 1;
  }
  if (dX === -1) {
    return Math.abs(tiles.bounds.minX - body.gridX) + 1;
  }
  return 0;
}

function distanceToTile(body, tile) {
  return Math.abs(body.gridX - tile.x + body.gridY - tile.y);
}
