import { useMemo } from 'react';
import { useControls } from 'leva';
import Pyramid from './world/pyramid';
import Plane from './world/plane';
import Slope1 from './world/slope1';
import Slope2 from './world/slope2';
import Slope3 from './world/slope3';
import Slope4 from './world/slope4';

const WORLD_MODELS = [
  { key: 'pyramid', Component: Pyramid },
  { key: 'plane', Component: Plane },
  { key: 'slope1', Component: Slope1 },
  { key: 'slope2', Component: Slope2 },
  { key: 'slope3', Component: Slope3 },
  { key: 'slope4', Component: Slope4 },
];

function createRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

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

function World({ countX = 5, countZ = 5, spacing = 4, ...props }) {
  const { position: worldPosition = [0, 0, 0], ...restProps } = props;
  const controls = useControls('Pyramid Grid', {
    countX: { value: countX, min: 1, max: 80, step: 1 },
    countZ: { value: countZ, min: 1, max: 80, step: 1 },
    spacing: { value: spacing, min: 1, max: 20, step: 0.5 },
    noiseScale: { value: 0.03, min: 0.01, max: 0.1, step: 0.01 },
    noiseMultiplier: { value: 6, min: 0, max: 40, step: 0.1 },
    noiseSeed: { value: 1, min: 0, max: 9999, step: 1 },
    modelSeed: { value: 1, min: 0, max: 9999, step: 1 },
  });

  const perlin = useMemo(() => createPerlin(controls.noiseSeed), [controls.noiseSeed]);

  const placements = useMemo(() => {
    const rng = createRng(controls.modelSeed);
    const items = [];
    for (let x = 0; x < controls.countX; x += 1) {
      for (let z = 0; z < controls.countZ; z += 1) {
        const baseX = (x - (controls.countX - 1) / 2) * controls.spacing;
        const baseZ = (z - (controls.countZ - 1) / 2) * controls.spacing;
        const noise = perlin(baseX * controls.noiseScale, baseZ * controls.noiseScale);
        const rawY = noise * controls.noiseMultiplier;
        const stepY = 2;
        const snappedY = Math.round(rawY / stepY) * stepY;
        const modelIndex = Math.floor(rng() * WORLD_MODELS.length);
        items.push({
          key: `${x}-${z}-${modelIndex}`,
          position: [baseX, snappedY, baseZ],
          modelIndex,
        });
      }
    }
    return items;
  }, [
    controls.countX,
    controls.countZ,
    controls.spacing,
    controls.noiseScale,
    controls.noiseMultiplier,
    controls.modelSeed,
    perlin,
  ]);

  return placements.map((item) => {
    const Model = WORLD_MODELS[item.modelIndex].Component;
    const position = [
      item.position[0] + worldPosition[0],
      item.position[1] + worldPosition[1],
      item.position[2] + worldPosition[2],
    ];
    return <Model key={item.key} position={position} {...restProps} />;
  });
}

export default World;
