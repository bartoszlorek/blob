import Vector from '@models/Vector';

export function raycast(out, objects, entity, dX, dY) {
  // todo: handle multiple objects
  const match = objects[0].closestInDirection(
    entity.gridX,
    entity.gridY,
    dX,
    dY
  );

  if (match) {
    out.type = 'solid';
    out.distance = entity.distance(match);
  } else {
    out.type = 'border';
    out.distance = distanceToBorder(objects[0], entity, dX, dY);
  }

  out.direction = new Vector(dX, dY);
  return out;
}

function distanceToBorder(object, entity, dX, dY) {
  if (dY === -1) {
    return Math.abs(object.boundsGrid.top - entity.gridY) + 1;
  }
  if (dX === 1) {
    return Math.abs(object.boundsGrid.right - entity.gridX) + 1;
  }
  if (dY === 1) {
    return Math.abs(object.boundsGrid.bottom - entity.gridY) + 1;
  }
  if (dX === -1) {
    return Math.abs(object.boundsGrid.left - entity.gridX) + 1;
  }
  return 0;
}
