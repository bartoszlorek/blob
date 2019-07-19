import {EDGE} from '@models/PhysicsEngine';

export function applyCollisions(definition, deltaTime = 1) {
  const {active, passive} = definition;
  const activeLength = active.length;

  for (let i = 0; i < activeLength; i++) {
    const {layer, links} = active[i];
    let index = layer.children.length;

    while (index > 0) {
      const child = layer.children[--index];

      // passive collisions: compares
      // each active with every passive

      if (child.velocity.x !== 0) {
        child.sprite.x += child.velocity.x * deltaTime;
        passiveCollision(child, links, passive, methodX);
      }
      if (child.velocity.y !== 0) {
        child.sprite.y += child.velocity.y * deltaTime;
        passiveCollision(child, links, passive, methodY);
      }

      // active collisions: compares each active
      // with other active but ONLY ONCE

      for (let j = i + 1; j < activeLength; j++) {
        activeCollision(child, links, active[j]);
      }
    }
  }
}

function passiveCollision(child, childLinks, passive, method) {
  const passiveLength = passive.length;
  const {name} = child.parent;

  for (let i = 0; i < passiveLength; i++) {
    const {layer, links: otherLinks} = passive[i];

    // skip layers that do not have common links
    if (!childLinks[layer.name] && !otherLinks[name]) {
      continue;
    }

    const closest = layer.closest(child.gridX, child.gridY);
    let index = closest ? closest.length : 0;

    while (index > 0) {
      const other = closest[--index];

      if (other && child.intersection(other)) {
        method(child, other, childLinks[layer.name], otherLinks[name]);
      }
    }
  }
}

function methodX(child, other, childLinks, otherLinks) {
  if (child.velocity.x > 0) {
    if (child.right > other.left) {
      childLinks && childLinks(child, other, EDGE.RIGHT);
      otherLinks && otherLinks(other, child, EDGE.LEFT);
    }
  } else if (child.velocity.x < 0) {
    if (child.left < other.right) {
      childLinks && childLinks(child, other, EDGE.LEFT);
      otherLinks && otherLinks(other, child, EDGE.RIGHT);
    }
  }
}

function methodY(child, other, childLinks, otherLinks) {
  if (child.velocity.y > 0) {
    if (child.bottom > other.top) {
      childLinks && childLinks(child, other, EDGE.BOTTOM);
      otherLinks && otherLinks(other, child, EDGE.TOP);
    }
  } else if (child.velocity.y < 0) {
    if (child.top < other.bottom) {
      childLinks && childLinks(child, other, EDGE.TOP);
      otherLinks && otherLinks(other, child, EDGE.BOTTOM);
    }
  }
}

function activeCollision(child, childLinks, other) {
  const {layer, links: otherLinks} = other;
  const {name} = child.parent;

  const childAction = childLinks[layer.name];
  const otherAction = otherLinks[name];

  // skip layers that do not have common links
  if (!childAction && !otherAction) {
    return;
  }

  let index = layer.children.length;

  while (index > 0) {
    const other = layer.children[--index];

    if (child.intersection(other)) {
      childAction && childAction(child, other);
      otherAction && otherAction(other, child);
    }
  }
}
