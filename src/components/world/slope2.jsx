import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import slope2Url from '../../assets/gltf/world/slope2.glb?url';

function Slope2(props) {
  const { scene } = useGLTF(slope2Url);
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

export default Slope2;

useGLTF.preload(slope2Url);
