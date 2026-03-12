/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import planeUrl from '../../assets/gltf/world/plane.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Plane({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(planeUrl);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Plane;

useGLTF.preload(planeUrl);
