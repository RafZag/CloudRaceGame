import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import planeUrl from '../../assets/gltf/world/plane.glb?url';

function Plane(props) {
  const { scene } = useGLTF(planeUrl);
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

export default Plane;

useGLTF.preload(planeUrl);
