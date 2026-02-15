import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import slope3Url from '../../assets/gltf/world/slope3.glb?url';

function Slope3(props) {
  const { scene } = useGLTF(slope3Url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry && child.geometry.isGeometry) {
          child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} {...props} />;
}

export default Slope3;

useGLTF.preload(slope3Url);
