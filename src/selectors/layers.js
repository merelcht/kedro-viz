import { createSelector } from 'reselect';
import { getLayoutNodes, getGraphSize } from './layout';
import { getVisibleLayerIDs } from './disabled';

const getLayerName = state => state.layer.name;

/**
 * Get layer positions
 */
export const getLayers = createSelector(
  [getLayoutNodes, getVisibleLayerIDs, getLayerName, getGraphSize],
  (nodes, layerIDs, layerName, { width }) => {
    const bounds = {};

    for (const node of nodes) {
      const bound =
        bounds[node.layer] || (bounds[node.layer] = [Infinity, -Infinity]);
      if (node.y - node.height < bound[0]) bound[0] = node.y - node.height;
      if (node.y + node.height > bound[1]) bound[1] = node.y + node.height;
    }

    return layerIDs.map((id, i) => {
      const currentBound = bounds[id];
      const prevBound = bounds[layerIDs[i - 1]] || [
        currentBound[0],
        currentBound[0]
      ];
      const nextBound = bounds[layerIDs[i + 1]] || [
        currentBound[1],
        currentBound[1]
      ];
      const start = (prevBound[1] + currentBound[0]) / 2;
      const end = (currentBound[1] + nextBound[0]) / 2;

      return {
        id,
        name: layerName[id],
        x: -width / 2,
        y: start,
        width: width * 2,
        height: end - start
      };
    });
  }
);
