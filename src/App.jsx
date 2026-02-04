/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Wing(props) {
  const { nodes, materials } = useGLTF('/wing.glb');

  return (
    <group {...props}>
      <mesh geometry={nodes['wing'].geometry} material={materials.wing} />
      <mesh geometry={nodes['lines'].geometry} material={materials.lines} />
      <mesh geometry={nodes['harness'].geometry} material={materials.Harness} />
      <mesh geometry={nodes['head'].geometry} material={materials.helmet} />
    </group>
  );
}

function World(props) {
  const { scene } = useGLTF('/world_slopes.glb');

  return <primitive object={scene} {...props} />;
}

//

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas camera={{ position: [0, 12, 8], fov: 60 }} dpr={[1, 2]}>
          {/* <ambientLight intensity={2} /> */}
          {/* <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} decay={0} intensity={1.2} /> */}
          <rectAreaLight position={[0, 20, 0]} rotation={[-Math.PI / 2, 0, 0]} intensity={2.5} width={20} height={20} />
          <hemisphereLight color="white" position={[0, 0, 0]} intensity={1.5} />
          <Wing position={[0, 6, 0]} rotation={[0, Math.PI, 0]} />
          <World position={[0, 0, 0]} />
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#1c8749" />
          </mesh> */}
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} target={[0, 3, 0]} />
        </Canvas>
      </div>
    </>
  );
}

export default App;
