import {mergeArrays} from '@utils/array';

function treeSearch(trees = [], rect) {
  let tree = trees[0].search(rect);

  if (trees.length > 1) {
    for (let i = 1; i < trees.length; i++) {
      mergeArrays(tree, trees[i].search(rect));
    }
  }
  return tree;
}

export default treeSearch;
