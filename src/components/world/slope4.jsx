/* eslint-disable react/no-unknown-property, react/prop-types */
import { useGLTF } from '@react-three/drei';
import slope4Url from '../../assets/gltf/world/slope4.glb?url';
import { useOptionalTexture, useWorldModelScene } from './useWorldModelMaterial';

function Slope4({ tint = '#ffffff', texture, textureUrl, roughness, metalness, ...props }) {
  const { scene } = useGLTF(slope4Url);
  const loadedTexture = useOptionalTexture(textureUrl);
  const map = texture ?? loadedTexture;
  const clonedScene = useWorldModelScene(scene, { tint, map, roughness, metalness });

  return <primitive object={clonedScene} {...props} />;
}

export default Slope4;

useGLTF.preload(slope4Url);
