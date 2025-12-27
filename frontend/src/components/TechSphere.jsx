import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Constants
const SKILLS = [
  "C",
  "C++",
  "Python",
  "HTML",
  "CSS",
  "JS",
  "ReactJS",
  "Node",
  "Express",
  "Flask",
  "ML",
  "AI",
  "CV",
  "Data Science",
  "MongoDB",
];

const COLORS = [
  "#00ffff",
  "#00bfff",
  "#1e90ff", // Cyan/Blue
  "#ff00ff",
  "#da70d6",
  "#8a2be2", // Purple/Pink
  "#ffffff",
  "#00ffcc", // Accents
];

// Reusable Text Sprite Component
const TextSprite = ({ text, position }) => {
  const texture = useMemo(() => {
    const fontface = "Arial";
    const fontsize = 40;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 128;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    context.shadowColor = color;
    context.shadowBlur = 15;
    context.fillStyle = color;
    context.font = "bold " + fontsize + "px " + fontface;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
  }, [text]);

  return (
    <sprite position={position} scale={[8, 4, 1]}>
      <spriteMaterial
        attach="material"
        map={texture}
        transparent={true}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
};

// Wireframe Sphere Component
const WireframeSphere = () => {
  return (
    <mesh>
      <sphereGeometry args={[10, 14, 14]} />
      <meshBasicMaterial
        color={0x0088ff}
        wireframe={true}
        transparent={true}
        opacity={0.1}
        depthWrite={false}
      />
    </mesh>
  );
};

// Background Particles Component
// const BackgroundParticles = () => {
//   const count = 200;
//   const positions = useMemo(() => {
//     const pos = new Float32Array(count * 3);
//     for (let i = 0; i < count * 3; i++) {
//       pos[i] = (Math.random() - 0.5) * 120;
//     }
//     return pos;
//   }, []);

//   const ref = useRef();

//   useFrame((state, delta) => {
//     if (ref.current) {
//       ref.current.rotation.y -= delta * 0.05;
//     }
//   });

//   return (
//     <points ref={ref}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.15}
//         color={0x88ccff}
//         transparent={true}
//         opacity={0.6}
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </points>
//   );
// };

// Rotating Group Container
const RotatingSphereGroup = () => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Tumbling effect
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x += 0.002;
      groupRef.current.rotation.z += 0.001;
    }
  });

  // Distribute skills on Fibonacci sphere
  const sprites = useMemo(() => {
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < SKILLS.length; i++) {
      const y = 1 - (i / (SKILLS.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const vector = new THREE.Vector3(x, y, z).normalize().multiplyScalar(12);
      items.push(<TextSprite key={i} text={SKILLS[i]} position={vector} />);
    }
    return items;
  }, []);

  return (
    <group ref={groupRef}>
      <WireframeSphere />
      {sprites}
    </group>
  );
};

const TechSphere = () => {
  return (
    <div style={{
      width: '140%',
      height: '140%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      background: 'transparent'
    }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 35], fov: 60 }} // Zoomed out to match scale on larger canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // fully transparent
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight
          position={[15, 15, 15]}
          color="#00ffff"
          intensity={3}
          distance={60}
        />
        <pointLight
          position={[-15, -15, -15]}
          color="#ff00ff"
          intensity={3}
          distance={60}
        />

        <RotatingSphereGroup />

        <OrbitControls enableZoom={false} enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};

export default TechSphere;
