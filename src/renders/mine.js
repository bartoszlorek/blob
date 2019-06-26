export function renderMine({g, left, top, size, color}) {
  const cutSize = size / 4;
  const boxSize = size - cutSize * 2;

  g.beginFill(color);
  g.drawRect(left + cutSize, top, boxSize, boxSize);
  g.drawRect(left, top + cutSize, boxSize, boxSize);
  g.drawRect(left + cutSize * 2, top + cutSize, boxSize, boxSize);
  g.drawRect(left + cutSize, top + cutSize * 2, boxSize, boxSize);
  g.endFill();
}
