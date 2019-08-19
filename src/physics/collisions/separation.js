function separation(object1, object2, edge) {
  switch (edge) {
    case EDGE.BOTTOM:
      object1.maxY = object2.minY;
      object1.velocity.y = 0;
      break;

    case EDGE.TOP:
      object1.minY = object2.maxY;
      object1.velocity.y = 0;
      break;

    case EDGE.LEFT:
      object1.minX = object2.maxX;
      object1.velocity.x = 0;
      break;

    case EDGE.RIGHT:
      object1.maxX = object2.minX;
      object1.velocity.x = 0;
      break;
  }
}

export default separation;
