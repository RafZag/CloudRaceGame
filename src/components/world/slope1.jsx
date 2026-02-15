import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import slope1Url from '../../assets/gltf/world/slope1.glb?url';

function Slope1(props) {
  const { scene } = useGLTF(slope1Url);
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

export default Slope1;

useGLTF.preload(slope1Url);
