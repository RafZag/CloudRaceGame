/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope4Url from '../../assets/gltf/world/slope4.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';
import { getHeightPaletteValue, WORLD_HEIGHT_COLORS } from './worldElementAppearance';
const SLOPE4_TEXTURES = [];

function Slope4({ snappedY = 0, yTextureShift = 0, tint, texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope4Url);
  const resolvedTextureUrl = textureUrl ?? getHeightPaletteValue(SLOPE4_TEXTURES, snappedY, yTextureShift);
  const loadedTexture = useOptionalTexture(resolvedTextureUrl);
  const map = texture ?? loadedTexture;
  const resolvedTint = tint ?? getHeightPaletteValue(WORLD_HEIGHT_COLORS, snappedY, yTextureShift) ?? '#ffffff';
  const clonedScene = useWorldModelScene(scene, { tint: resolvedTint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope4;

useGLTF.preload(slope4Url);
