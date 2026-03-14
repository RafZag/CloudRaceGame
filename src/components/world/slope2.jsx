/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope2Url from '../../assets/gltf/world/slope2.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';
import { getHeightPaletteValue, WORLD_HEIGHT_COLORS } from './worldElementAppearance';
const SLOPE2_TEXTURES = [];

function Slope2({ snappedY = 0, yTextureShift = 0, tint, texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope2Url);
  const resolvedTextureUrl = textureUrl ?? getHeightPaletteValue(SLOPE2_TEXTURES, snappedY, yTextureShift);
  const loadedTexture = useOptionalTexture(resolvedTextureUrl);
  const map = texture ?? loadedTexture;
  const resolvedTint = tint ?? getHeightPaletteValue(WORLD_HEIGHT_COLORS, snappedY, yTextureShift) ?? '#ffffff';
  const clonedScene = useWorldModelScene(scene, { tint: resolvedTint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope2;

useGLTF.preload(slope2Url);
