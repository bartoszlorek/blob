import {objectForEach} from '@utils/object';

export function createDefinition(schema, layers) {
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
    const entry = buffer[name];

    if (!entry) {
      return null;
    }

    if (links) {
      objectForEach(links, (traits, link) => {
        if (!buffer[link]) {
          return;
        }

        function action(entity, other, edge) {
          let index = traits.length;

          while (index > 0) {
            entity[traits[--index]].collide(entity, other, edge);
          }
        }

        entry.links[link] = action;
      });
    }

    return entry;
  };
}

function empty(value) {
  return value;
}
