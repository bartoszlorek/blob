import separation from './separation';
import treeSearch from './treeSearch';
import collidingEdge from './collidingEdge';

function bodyGroupCollision(body, group, callback, separate, treeArray) {
  const result = treeSearch(treeArray, body);
  const length = result.length;

  for (let i = 0; i < length; i++) {
    const child = result[i];

    if (child === body) {
      continue;
    }
    if (child.isAlive && group.contains(child)) {
      const edge = collidingEdge(body, child);

      if (separate) {
        separation(body, child, edge);
      }
      if (callback) {
        callback(body, child, edge);
      }
    }
  }
}

function collidingEdge(object1, object2) {
  const diffX = object1.minX - object2.minX;
  const diffY = object1.minY - object2.minY;

  if (diffX === diffY) {
    return null;
  }
  if (Math.abs(diffX) > Math.abs(diffY)) {
    return diffX < 0 ? EDGE.RIGHT : EDGE.LEFT;
  } else {
    return diffY < 0 ? EDGE.BOTTOM : EDGE.TOP;
  }
}

export default bodyGroupCollision;
