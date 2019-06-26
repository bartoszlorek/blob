export function renderDefaultBox({g, left, top, size, color}) {
  g.beginFill(color);
  g.drawRect(left, top, size, size);
  g.endFill();
}

export function renderBeveledBox(props) {
  const {g, left, top, size} = props;
  renderDefaultBox(props);

  // bevel
  g.lineStyle(2, 0xffffff, 0.2, 0);
  g.moveTo(left + size, top);
  g.lineTo(left + size, top + size);
  g.lineTo(left, top + size);
  g.lineStyle(0);
}
