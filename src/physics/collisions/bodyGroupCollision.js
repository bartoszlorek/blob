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

export default bodyGroupCollision;
