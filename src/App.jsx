/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Wing(props) {
  const { scene } = useGLTF('/wing.glb');
  return <primitive object={scene} {...props} />;
}

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas camera={{ position: [0, 4, 5], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.8} />
          {/* <spotLight position={[10, 10, 0]} angle={0.15} penumbra={1} decay={0} intensity={1} /> */}
          <hemisphereLight color="white" position={[0, 0, 0]} intensity={1.5} />
          <Wing position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        </Canvas>
      </div>
    </>
  );
}

export default App;
