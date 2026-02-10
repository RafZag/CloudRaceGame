import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useControls } from 'leva';

function World({ countX = 10, countZ = 10, spacing = 4, ...props }) {
  const { scene } = useGLTF('/piramid.glb');
  const instancedRef = useRef(null);
  const controls = useControls('Pyramid Grid', {
    countX: { value: countX, min: 1, max: 80, step: 1 },
    countZ: { value: countZ, min: 1, max: 80, step: 1 },
    spacing: { value: spacing, min: 1, max: 20, step: 0.5 },
  });

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  const positions = useMemo(() => {
    const items = [];
    for (let x = 0; x < controls.countX; x += 1) {
      for (let z = 0; z < controls.countZ; z += 1) {
        items.push([
          (x - (controls.countX - 1) / 2) * controls.spacing,
          0,
          (z - (controls.countZ - 1) / 2) * controls.spacing,
        ]);
      }
    }
    return items;
  }, [controls.countX, controls.countZ, controls.spacing]);

  const sourceMesh = useMemo(() => {
    let found = null;
    scene.traverse((child) => {
      if (!found && child.isMesh) {
        found = child;
      }
    });
    return found;
  }, [scene]);

  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((position, index) => {
      dummy.position.set(position[0], position[1], position[2]);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(index, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  if (!sourceMesh) {
    return null;
  }

  return (
    <instancedMesh
      ref={instancedRef}
      args={[sourceMesh.geometry, sourceMesh.material, positions.length]}
      castShadow
      receiveShadow
      {...props}
    />
  );
}

export default World;
