export function renderMine({entity, layer, g, x, y}) {
  const cutSize = entity.size / 4;
  const boxSize = entity.size - cutSize * 2;

  g.beginFill(entity.color || layer.color);
  g.drawRect(x + cutSize, y, boxSize, boxSize);
  g.drawRect(x, y + cutSize, boxSize, boxSize);
  g.drawRect(x + cutSize * 2, y + cutSize, boxSize, boxSize);
  g.drawRect(x + cutSize, y + cutSize * 2, boxSize, boxSize);
  g.endFill();
}
