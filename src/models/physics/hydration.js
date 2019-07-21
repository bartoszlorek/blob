import {objectForEach} from '@utils/object';

export function hydrateSchema(schema, layers) {
  const {active = [], passive = []} = schema;
  const hydrator = createHydrator(layers);

  return {
    active: active.map(hydrator).filter(empty),
    passive: passive.map(hydrator).filter(empty)
  };
}

function createHydrator(layers) {
  const buffer = {};

  objectForEach(layers, (layer, name) => {
    buffer[name] = {
      name,
      layer,
      links: {}
    };
  });

  return ({name, links}) => {
    const layer = buffer[name];

    if (!layer) {
      return null;
    }

    if (links) {
      objectForEach(links, (traits, link) => {
        if (!buffer[link]) {
          return;
        }

        // created action will apply to each
        // colliding child from the given layer
        function action(entity, other, edge) {
          let index = traits.length;

          while (index > 0) {
            entity[traits[--index]].collide(entity, other, edge);
          }
        }

        layer.links[link] = action;
      });
    }

    return layer;
  };
}

function empty(value) {
  return value;
}
