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

export default collidingEdge;
