/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope2Url from '../../assets/gltf/world/slope2.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Slope2({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope2Url);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope2;

useGLTF.preload(slope2Url);
