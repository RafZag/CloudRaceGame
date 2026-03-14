/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope3Url from '../../assets/gltf/world/slope3.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';
import slope3Texture0Url from '../../assets/textures/world/slope3_0.jpg?url';
import slope3Texture1Url from '../../assets/textures/world/slope3_1.jpg?url';
import slope3Texture2Url from '../../assets/textures/world/slope3_2.jpg?url';
import slope3Texture3Url from '../../assets/textures/world/slope3_3.jpg?url';
import slope3Texture4Url from '../../assets/textures/world/slope3_4.jpg?url';
import slope3Texture5Url from '../../assets/textures/world/slope3_5.jpg?url';
import slope3Texture6Url from '../../assets/textures/world/slope3_6.jpg?url';

import { getHeightPaletteValue, WORLD_HEIGHT_COLORS } from './worldElementAppearance';

const SLOPE3_TEXTURES = [
  slope3Texture0Url,
  slope3Texture1Url,
  slope3Texture2Url,
  slope3Texture3Url,
  slope3Texture4Url,
  slope3Texture5Url,
  slope3Texture6Url,
];

function Slope3({ snappedY = 0, yTextureShift = 0, tint, texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope3Url);
  const resolvedTextureUrl = textureUrl ?? getHeightPaletteValue(SLOPE3_TEXTURES, snappedY, yTextureShift);
  const loadedTexture = useOptionalTexture(resolvedTextureUrl);
  const map = texture ?? loadedTexture;
  const resolvedTint = tint ?? getHeightPaletteValue(WORLD_HEIGHT_COLORS, snappedY, yTextureShift) ?? '#ffffff';
  const clonedScene = useWorldModelScene(scene, { tint: resolvedTint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope3;

useGLTF.preload(slope3Url);
