const DEFAULT_HEIGHT_STEP = 2;
export const WORLD_HEIGHT_COLORS = ['#0077D0', '#523932', '#4D9120', '#295011', '#8D837F', '#D9C9C4'];

export function getHeightPaletteValue(palette, snappedY, yTextureShift = 0, heightStep = DEFAULT_HEIGHT_STEP) {
  if (!Array.isArray(palette) || palette.length === 0) {
    return undefined;
  }

  const levelIndex = Math.round(snappedY / heightStep);
  const centerIndex = Math.floor((palette.length - 1) / 2);
  const shiftedIndex = levelIndex + centerIndex + yTextureShift;
  const clampedIndex = Math.max(0, Math.min(shiftedIndex, palette.length - 1));

  return palette[clampedIndex];
}
