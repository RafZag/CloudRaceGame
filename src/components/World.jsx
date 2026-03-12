import { useMemo } from 'react';
import { useControls } from 'leva';
import Pyramid from './world/pyramid';
import Plane from './world/plane';
import PlaneHigh from './world/planeHigh';
import Slope1 from './world/slope1';
import Slope2 from './world/slope2';
import Slope3 from './world/slope3';
import Slope4 from './world/slope4';

const WORLD_MODELS = [
  { key: 'pyramid', Component: Pyramid },
  { key: 'plane', Component: Plane },
  { key: 'planeHigh', Component: PlaneHigh },
  { key: 'slope1', Component: Slope1 },
  { key: 'slope2', Component: Slope2 },
  { key: 'slope3', Component: Slope3 },
  { key: 'slope4', Component: Slope4 },
];

const DEFAULT_HEIGHT_COLORS = ['#0077D0', '#523932', '#4D9120', '#295011', '#8D837F', '#D9C9C4'];

function createPerlin(seed) {
  const random = (() => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  })();

  const p = new Array(256).fill(0).map((_, i) => i);
  for (let i = p.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Array(512);
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t, a, b) => a + t * (b - a);
  const grad = (hash, x, y) => {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[xi + perm[yi]];
    const ab = perm[xi + perm[yi + 1]];
    const ba = perm[xi + 1 + perm[yi]];
    const bb = perm[xi + 1 + perm[yi + 1]];

    const x1 = lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf));
    const x2 = lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1));
    return lerp(v, x1, x2);
  };
}

function gridKey(x, z) {
  return `${x}:${z}`;
}

function getClampedPaletteColor(palette, index) {
  const clampedIndex = Math.max(0, Math.min(index, palette.length - 1));
  return palette[clampedIndex];
}

function World({ countX = 20, countZ = 20, spacing = 4, heightColors = DEFAULT_HEIGHT_COLORS, ...props }) {
  const { position: worldPosition = [0, 0, 0], ...restProps } = props;
  const palette = heightColors.length > 0 ? heightColors : DEFAULT_HEIGHT_COLORS;
  const controls = useControls('World Grid', {
    countX: { value: countX, min: 1, max: 80, step: 1 },
    countZ: { value: countZ, min: 1, max: 80, step: 1 },
    noiseScale: { value: 0.02, min: 0.01, max: 0.1, step: 0.01 },
    noiseMultiplier: { value: 8, min: 0, max: 40, step: 0.1 },
    noiseSeed: { value: 1, min: 0, max: 9999, step: 1 },
  });

  const perlin = useMemo(() => createPerlin(controls.noiseSeed), [controls.noiseSeed]);

  const placements = useMemo(() => {
    const items = [];
    for (let x = 0; x < controls.countX; x += 1) {
      for (let z = 0; z < controls.countZ; z += 1) {
        const baseX = (x - (controls.countX - 1) / 2) * spacing;
        const baseZ = (z - (controls.countZ - 1) / 2) * spacing;
        const noise = perlin(baseX * controls.noiseScale, baseZ * controls.noiseScale);
        const rawY = noise * controls.noiseMultiplier;
        const stepY = 2;
        const snappedY = Math.round(rawY / stepY) * stepY;
        // const modelIndex = Math.floor(rng() * WORLD_MODELS.length);
        const modelIndex = 1;

        items.push({
          key: `${x}-${z}-${modelIndex}`,
          gridX: x,
          gridZ: z,
          snappedY,
          position: [baseX, snappedY, baseZ],
          modelIndex,
        });
      }
    }

    const heights = items.map((item) => item.snappedY);
    const uniqueHeights = Array.from(new Set(heights)).sort((a, b) => a - b);
    const tintByHeight = new Map(
      uniqueHeights.map((height, index) => [height, getClampedPaletteColor(palette, index)]),
    );

    const itemByGrid = new Map();
    items.forEach((item) => {
      itemByGrid.set(gridKey(item.gridX, item.gridZ), item);
    });

    return items.map((item) => {
      const getNeighborSnappedY = (offsetX, offsetZ) => {
        const neighbor = itemByGrid.get(gridKey(item.gridX + offsetX, item.gridZ + offsetZ));
        return neighbor ? neighbor.snappedY : item.snappedY;
      };

      const cornerNeighbors = {
        leftTopSnappedY: [getNeighborSnappedY(-1, -1), getNeighborSnappedY(-1, 0), getNeighborSnappedY(0, -1)],
        rightTopSnappedY: [getNeighborSnappedY(1, -1), getNeighborSnappedY(1, 0), getNeighborSnappedY(0, -1)],
        leftBottomSnappedY: [getNeighborSnappedY(-1, 1), getNeighborSnappedY(-1, 0), getNeighborSnappedY(0, 1)],
        rightBottomSnappedY: [getNeighborSnappedY(1, 1), getNeighborSnappedY(1, 0), getNeighborSnappedY(0, 1)],
      };

      const higherCorners = {
        leftTop: cornerNeighbors.leftTopSnappedY.some((snappedY) => snappedY > item.snappedY),
        rightTop: cornerNeighbors.rightTopSnappedY.some((snappedY) => snappedY > item.snappedY),
        leftBottom: cornerNeighbors.leftBottomSnappedY.some((snappedY) => snappedY > item.snappedY),
        rightBottom: cornerNeighbors.rightBottomSnappedY.some((snappedY) => snappedY > item.snappedY),
      };

      return {
        ...item,
        tint: tintByHeight.get(item.snappedY),
        cornerNeighbors,
        higherCorners,
      };
    });
  }, [controls.countX, controls.countZ, controls.noiseScale, controls.noiseMultiplier, spacing, perlin, palette]);

  return placements.map((item) => {
    let Model = WORLD_MODELS[item.modelIndex].Component;
    let yRotation = 0;

    switch (
      item.higherCorners['leftTop'] +
      item.higherCorners['rightTop'] +
      item.higherCorners['leftBottom'] +
      item.higherCorners['rightBottom']
    ) {
      case 0:
        Model = WORLD_MODELS[1].Component; // Plane
        break;
      case 1:
        Model = WORLD_MODELS[4].Component; // Slope2
        if (item.higherCorners['leftBottom']) yRotation = Math.PI;
        if (item.higherCorners['rightTop']) yRotation = 0;
        if (item.higherCorners['leftTop']) yRotation = Math.PI / 2;
        if (item.higherCorners['rightBottom']) yRotation = -Math.PI / 2;

        break;
      case 2:
        Model = WORLD_MODELS[3].Component; // Slope1
        if (item.higherCorners['leftTop'] && item.higherCorners['rightTop']) yRotation = 0;
        if (item.higherCorners['rightTop'] && item.higherCorners['rightBottom']) yRotation = -Math.PI / 2;
        if (item.higherCorners['leftBottom'] && item.higherCorners['rightBottom']) yRotation = Math.PI;
        if (item.higherCorners['leftBottom'] && item.higherCorners['leftTop']) yRotation = Math.PI / 2;

        if (item.higherCorners['leftBottom'] && item.higherCorners['rightTop']) {
          Model = WORLD_MODELS[6].Component; // Slope4
          yRotation = 0;
        }

        if (item.higherCorners['leftTop'] && item.higherCorners['rightBottom']) {
          Model = WORLD_MODELS[6].Component;
          yRotation = Math.PI / 2;
        }

        break;
      case 3:
        Model = WORLD_MODELS[5].Component; // Slope3
        if (!item.higherCorners['rightTop']) yRotation = Math.PI;
        if (!item.higherCorners['rightBottom']) yRotation = Math.PI / 2;
        if (!item.higherCorners['leftBottom']) yRotation = 0;
        if (!item.higherCorners['leftTop']) yRotation = -Math.PI / 2;
        break;
      case 4:
        Model = WORLD_MODELS[2].Component; // Slope4

        break;
      default:
        Model = WORLD_MODELS[0].Component; // Pyramid (fallback)
    }

    const position = [
      item.position[0] + worldPosition[0],
      item.position[1] + worldPosition[1],
      item.position[2] + worldPosition[2],
    ];
    return <Model key={item.key} tint={item.tint} position={position} rotation={[0, yRotation, 0]} {...restProps} />;
  });
}

export default World;
