function padBounds(bounds, value) {
  bounds.x -= value;
  bounds.y -= value;
  bounds.width += value * 2;
  bounds.height += value * 2;
  return bounds;
}

export default padBounds;
