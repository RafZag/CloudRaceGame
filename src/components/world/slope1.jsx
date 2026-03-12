/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope1Url from '../../assets/gltf/world/slope1.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Slope1({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope1Url);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope1;

useGLTF.preload(slope1Url);
