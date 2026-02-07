/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import envUrl from './assets/golden_gate_hills_2k.hdr?url';
import Wing from './components/Wing.jsx';
import World from './components/World.jsx';

function App() {
  return (
    <>
      <div id="canvas-container">
        <Canvas camera={{ position: [0, 12, 8], fov: 60 }} dpr={[1, 2]} shadows={{ type: THREE.PCFSoftShadowMap }}>
          <Environment files={envUrl} environmentRotation={[0, -Math.PI, 0]} environmentIntensity={0.7} />
          {/* <ambientLight intensity={2} /> */}
          {/* <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} decay={0} intensity={1.2} /> */}
          {/* <rectAreaLight
            position={[0, 20, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            intensity={2.5}
            width={20}
            height={20}
            castShadow
          /> */}
          <directionalLight
            position={[0, 12, 0]}
            intensity={1.0}
            castShadow
            shadow-radius={0.5}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          {/* <hemisphereLight color="white" position={[0, 0, 0]} intensity={1.5} /> */}
          <Wing position={[0, 8, 0]} rotation={[0, Math.PI, 0]} />
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
