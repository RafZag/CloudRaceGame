/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei';
import wingUrl from '../assets/gltf/wing.glb?url';

function Wing(props) {
  const { nodes, materials } = useGLTF(wingUrl);

  return (
    <group {...props}>
      <mesh geometry={nodes['wing'].geometry} material={materials.wing} castShadow />
      <mesh geometry={nodes['lines'].geometry} material={materials.lines} castShadow />
      <mesh geometry={nodes['harness'].geometry} material={materials.Harness} castShadow />
      <mesh geometry={nodes['head'].geometry} material={materials.helmet} castShadow />
    </group>
  );
}

export default Wing;
