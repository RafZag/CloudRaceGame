import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import pyramidUrl from '../../assets/gltf/world/piramid.glb?url';

function Pyramid(props) {
  const { scene } = useGLTF(pyramidUrl);
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

export default Pyramid;

useGLTF.preload(pyramidUrl);
