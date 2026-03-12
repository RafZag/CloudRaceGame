/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import pyramidUrl from '../../assets/gltf/world/piramid.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Pyramid({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(pyramidUrl);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Pyramid;

useGLTF.preload(pyramidUrl);
