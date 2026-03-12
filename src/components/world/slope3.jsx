/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope3Url from '../../assets/gltf/world/slope3.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Slope3({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope3Url);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope3;

useGLTF.preload(slope3Url);
