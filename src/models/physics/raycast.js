export function raycast(objects, entity, dX, dY) {
  // todo: handle multiple objects
  const match = objects[0].closestInDirection(
    entity.gridX,
    entity.gridY,
    dX,
    dY
  );

  // todo: object pools
  if (match) {
    return {
      type: 'solid',
      distance: entity.distance(match),
      direction: {x: dX, y: dY}
    };
  }

  // todo: handle multiple objects
  // todo: object pools
  return {
    type: 'border',
    distance: distanceToBorder(objects[0], entity, dX, dY),
    direction: {x: dX, y: dY}
  };
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
