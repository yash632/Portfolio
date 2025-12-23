import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const ProfileImage = () => {
  const texture = useLoader(THREE.TextureLoader, './img/hero_profile.jpg');
  const meshRef = useRef();
  const { viewport } = useThree();
  
  const isMobile = viewport.width < 5; 
  const position = isMobile ? [0, 2, 0] : [viewport.width / 4, 0, 0];
  const scale = isMobile ? 2 : 2.8;

  useFrame((state) => {
    if (meshRef.current) {
        const time = state.clock.elapsedTime;
        meshRef.current.position.y = (isMobile ? 1.5 : 0) + Math.sin(time) * 0.1;
        meshRef.current.position.x = position[0];
        // Slight glitchy twitch for hacker vibe? Maybe keep it smooth
        meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2; 
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} position={position} scale={scale}>
          <circleGeometry args={[1, 64]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
    </Float>
  );
};

// "The Matrix" Code Stream
const CodeStream = ({ position, speed, fontSize, opacity }) => {
    const ref = useRef();
    // Random binary string
    const [code] = useState(() => Array(15).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('\n'));
    
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Make it fall
        const yPos = position[1] - (t * speed) % 20; 
        // Wrap around
        ref.current.position.y = yPos > -10 ? yPos : yPos + 20;
    });

    return (
        <Text
            ref={ref}
            position={position}
            fontSize={fontSize}
            lineHeight={1}
            color="#0f0" // Hacker Green
            fillOpacity={opacity}
            // font prop removed to use default
            anchorX="center"
            anchorY="top"
        >
            {code}
        </Text>
    );
};

const MatrixRain = ({ count = 30 }) => {
    const { viewport } = useThree();
    
    const streams = useMemo(() => {
        return new Array(count).fill().map((_, i) => ({
            position: [
                (Math.random() - 0.5) * viewport.width * 1.5,
                Math.random() * 10 + 5, // Start high
                (Math.random() - 0.5) * 10 - 2 // Depth
            ],
            speed: Math.random() + 0.5,
            fontSize: Math.random() * 0.3 + 0.2,
            opacity: Math.random() * 0.5 + 0.2
        }));
    }, [viewport, count]);

    return (
        <group>
            {streams.map((props, i) => <CodeStream key={i} {...props} />)}
        </group>
    );
};

const Hero3D = () => {
  return (
    <div className="hero-3d-container" style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none',
      background: 'black' // Ensure deep black background
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Dark Hacker Atmosphere */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#0f0" /> {/* Green Light */}
        
        <React.Suspense fallback={null}>
            <ProfileImage />
            {/* The Matrix Rain */}
            <MatrixRain count={60} />
        </React.Suspense>
        
        {/* Subtle Green Fog for depth */}
        <fog attach="fog" args={['#000', 5, 20]} />

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> 
      </Canvas>
    </div>
  );
};

export default Hero3D;
