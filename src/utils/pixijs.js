export function extendBounds(bounds, value) {
  bounds.x -= value;
  bounds.y -= value;
  bounds.width += value * 2;
  bounds.height += value * 2;
  return bounds;
}
