import separation from './separation';

function bodyTilesCollision(body, tiles, callback, separate, deltaTime) {
  const closest = tiles.closest(body.gridX, body.gridY);
  const length = closest ? closest.length : 0;

  // x axis
  if (body.velocity.x !== 0) {
    // todo: put this assigment in body.postUpdate
    body.position.x += body.velocity.x * deltaTime;

    for (let i = 0; i < length; i++) {
      const tile = closest[i];

      if (tile && body.intersection(tile)) {
        if (body.velocity.x > 0) {
          if (body.maxX > tile.minX) {
            if (separate) {
              separation(body, tile, EDGE.RIGHT);
            }
            if (callback) {
              callback(body, tile, EDGE.RIGHT);
            }
          }
        } else if (body.velocity.x < 0) {
          if (body.minX < tile.maxX) {
            if (separate) {
              separation(body, tile, EDGE.LEFT);
            }
            if (callback) {
              callback(body, tile, EDGE.LEFT);
            }
          }
        }
      }
    }
  }

  // y axis
  if (body.velocity.y !== 0) {
    // todo: put this assigment in body.postUpdate
    body.position.y += body.velocity.y * deltaTime;

    for (let i = 0; i < length; i++) {
      const tile = closest[i];

      if (tile && body.intersection(tile)) {
        if (body.velocity.y > 0) {
          if (body.maxY > tile.minY) {
            if (separate) {
              separation(body, tile, EDGE.BOTTOM);
            }
            if (callback) {
              callback(body, tile, EDGE.BOTTOM);
            }
          }
        } else if (body.velocity.y < 0) {
          if (body.minY < tile.maxY) {
            if (separate) {
              separation(body, tile, EDGE.TOP);
            }
            if (callback) {
              callback(body, tile, EDGE.TOP);
            }
          }
        }
      }
    }
  }
}

export default bodyTilesCollision;
