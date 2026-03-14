/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import planeUrl from '../../assets/gltf/world/plane.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';
import { getHeightPaletteValue, WORLD_HEIGHT_COLORS } from './worldElementAppearance';
const PLANE_TEXTURES = [];

function Plane({ snappedY = 0, yTextureShift = 0, tint, texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(planeUrl);
  const resolvedTextureUrl = textureUrl ?? getHeightPaletteValue(PLANE_TEXTURES, snappedY, yTextureShift);
  const loadedTexture = useOptionalTexture(resolvedTextureUrl);
  const map = texture ?? loadedTexture;
  const resolvedTint = tint ?? getHeightPaletteValue(WORLD_HEIGHT_COLORS, snappedY, yTextureShift) ?? '#ffffff';
  const clonedScene = useWorldModelScene(scene, { tint: resolvedTint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Plane;

useGLTF.preload(planeUrl);
