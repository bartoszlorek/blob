export function renderDefaultBox({entity, layer, g, x, y}) {
  const {size} = entity;

  g.beginFill(entity.color || layer.color);
  g.drawRect(x, y, size, size);
  g.endFill();
}

export function renderBeveledBox(props) {
  const {entity, g, x, y} = props;
  const {size} = entity;

  renderDefaultBox(props);
  // bevel
  g.lineStyle(2, 0xffffff, 0.2, 0);
  g.moveTo(x + size, y);
  g.lineTo(x + size, y + size);
  g.lineTo(x, y + size);
  g.lineStyle(0);
}
