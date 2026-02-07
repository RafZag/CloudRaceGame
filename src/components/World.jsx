import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function World(props) {
  const { scene } = useGLTF('/world_slopes.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

export default World;
