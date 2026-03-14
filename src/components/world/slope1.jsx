/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope1Url from '../../assets/gltf/world/slope1.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';
import { getHeightPaletteValue, WORLD_HEIGHT_COLORS } from './worldElementAppearance';
const SLOPE1_TEXTURES = [];

function Slope1({ snappedY = 0, yTextureShift = 0, tint, texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope1Url);
  const resolvedTextureUrl = textureUrl ?? getHeightPaletteValue(SLOPE1_TEXTURES, snappedY, yTextureShift);
  const loadedTexture = useOptionalTexture(resolvedTextureUrl);
  const map = texture ?? loadedTexture;
  const resolvedTint = tint ?? getHeightPaletteValue(WORLD_HEIGHT_COLORS, snappedY, yTextureShift) ?? '#ffffff';
  const clonedScene = useWorldModelScene(scene, { tint: resolvedTint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope1;

useGLTF.preload(slope1Url);
