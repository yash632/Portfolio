import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Float, Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';

// Perspective grid floor
const GridFloor = () => {
  const gridRef = useRef();

  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const gridSize = 40;
    const divisions = 20;
    const step = gridSize / divisions;

    // Horizontal lines
    for (let i = -divisions; i <= divisions; i++) {
      positions.push(-gridSize, 0, i * step);
      positions.push(gridSize, 0, i * step);

      const color = new THREE.Color(i === 0 ? '#00f3ff' : '#38bdf8');
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    // Vertical lines
    for (let i = -divisions; i <= divisions; i++) {
      positions.push(i * step, 0, -gridSize);
      positions.push(i * step, 0, gridSize);

      const color = new THREE.Color(i === 0 ? '#00f3ff' : '#38bdf8');
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 4 - 2;
    }
  });

  return (
    <lineSegments ref={gridRef} geometry={gridGeometry} position={[0, -5, 0]} rotation={[0, 0, 0]}>
      <lineBasicMaterial vertexColors transparent opacity={0.3} />
    </lineSegments>
  );
};

// Floating holographic panels
const HoloPanels = ({ isMobile }) => {
  const panelsRef = useRef();

  const panels = useMemo(() => {
    const count = isMobile ? 5 : 15;
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20 - 10
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.3 + Math.random() * 0.5,
        speed: 0.5 + Math.random() * 1,
        color: Math.random() > 0.5 ? '#00f3ff' : '#a855f7'
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (panelsRef.current) {
      panelsRef.current.children.forEach((panel, i) => {
        const speed = panels[i].speed;
        panel.position.z += speed * 0.02;

        if (panel.position.z > 5) {
          panel.position.z = -20;
        }

        panel.rotation.y += 0.005;
      });
    }
  });

  return (
    <group ref={panelsRef}>
      {panels.map((panel, i) => (
        <mesh key={i} position={panel.position} rotation={panel.rotation} scale={panel.scale}>
          <boxGeometry args={[2, 1.5, 0.05]} />
          <meshBasicMaterial
            color={panel.color}
            transparent
            opacity={0.15}
            wireframe={Math.random() > 0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating Tech Text Elements (AI, Code, Symbols)
const FloatingTechSymbols = ({ isMobile }) => {
  const groupRef = useRef();
  const symbols = ["AI", "ML", "< / >", "{ }", "0", "1", "0/1", "DEV", "npm", "=>", "[]", "Wait", "pip", "python", "MERN", "flask", "( )", "Async", "<", ">"];

  const getTunnelPosition = () => {
    // Polar coordinates for donut distribution
    const angle = Math.random() * Math.PI * 2;
    // Radius between 4 (exclusion zone) and 12 (outer edge)
    const radius = 5 + Math.random() * 10;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.8 // Flatten slightly like the screen
    };
  };

  // Create static data for the symbols
  const items = useMemo(() => {
    const count = isMobile ? 20 : 80;
    return new Array(count).fill(0).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radiusOffset = Math.random() * 5; // Variation in spread

      return {
        text: symbols[i % symbols.length],
        angle,
        radiusOffset,
        position: [0, 0, (Math.random() - 0.5) * 40 - 20], // Initial positions will be fixed by first frame
        rotation: [
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          0
        ],
        scale: 0.5 + Math.random() * 0.8,
        color: Math.random() > 0.5 ? '#00f3ff' : '#a855f7',
        speed: 2 + Math.random() * 3
      };
    });
  }, [isMobile]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const item = items[i];
        child.position.z += item.speed * delta;

        // Reset if passes camera
        if (child.position.z > 5) {
          child.position.z = -35;
          // Randomize angle slightly on reset for variety
          item.angle = Math.random() * Math.PI * 2;
        }

        // Divergence logic: 
        // As Z increases (moves -35 -> 5), Radius increases.
        // Base radius at -35 is small (0-5).
        // At 0, radius should be > 6 to clear center.
        const zProgress = child.position.z + 35; // 0 to 40
        const currentRadius = item.radiusOffset + (zProgress * 0.35);

        child.position.x = Math.cos(item.angle) * currentRadius;
        child.position.y = Math.sin(item.angle) * currentRadius * 0.8;
        child.rotation.z += delta * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Text
          key={i}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          color={item.color}
          fontSize={1}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={'left'}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {item.text}
        </Text>
      ))}
    </group>
  );
};

// Floating Icon Images
const TechIcons = ({ isMobile }) => {
  const groupRef = useRef();

  // Select a mix of cool icons
  const iconFiles = [
    "/final_icons/01.webp",
    "/final_icons/02.webp",
    "/final_icons/04.webp",
    "/final_icons/05.webp",
    "/final_icons/06.webp",
    "/final_icons/07.webp",
    "/final_icons/08.webp",
    "/final_icons/09.webp",
    "/final_icons/10.webp",
    "/final_icons/11.webp",
    "/final_icons/12.webp",
    "/final_icons/13.webp",
    "/final_icons/14.webp",
    "/final_icons/15.webp",
    "/final_icons/16.webp",
    "/final_icons/20.webp",
    "/final_icons/23.webp",
    "/final_icons/24.webp",
    "/final_icons/25.webp",
    "/final_icons/26.webp",
    "/final_icons/27.webp",
    "/final_icons/ai_brain.webp",
    "/final_icons/cognitive_field.webp",
    "/final_icons/data_nodes.webp",
    "/final_icons/digital_cortex.webp",
    "/final_icons/intelligence_core.webp",
    "/final_icons/mind_mesh.webp",
    "/final_icons/neural_core.webp",
    "/final_icons/neural_grid.webp",
    "/final_icons/neural_links.webp",
    "/final_icons/neural_matrix.webp",
    "/final_icons/synapse_flow.webp",
    "/final_icons/synaptic_network.webp",
    "/final_icons/synthetic_brain.webp"
  ];

  const getTunnelPosition = () => {
    // Polar coordinates for donut distribution
    const angle = Math.random() * Math.PI * 2;
    // Radius between 6 (exclusion zone) and 14 (outer edge)
    // Slightly wider for icons
    const radius = 6 + Math.random() * 8;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.8 // Flatten slightly like the screen
    };
  };

  const items = useMemo(() => {
    const count = isMobile ? 10 : 30;
    return new Array(count).fill(0).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radiusOffset = 2 + Math.random() * 5; // Slightly wider start for icons

      return {
        url: iconFiles[i % iconFiles.length],
        angle,
        radiusOffset,
        position: [0, 0, (Math.random() - 0.5) * 30 - 10],
        rotation: [0, 0, (Math.random() - 0.5) * 0.5],
        scale: 0.8 + Math.random() * 0.8,
        speed: 1 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4
      };
    });
  }, [isMobile]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const item = items[i];
        child.position.z += item.speed * delta;

        if (child.position.z > 8) {
          child.position.z = -30;
          item.angle = Math.random() * Math.PI * 2;
        }

        // Divergence logic
        const zProgress = child.position.z + 30; // 0 to 38
        const currentRadius = item.radiusOffset + (zProgress * 0.4);

        child.position.x = Math.cos(item.angle) * currentRadius;
        child.position.y = Math.sin(item.angle) * currentRadius * 0.8;
        child.rotation.z += delta * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <DreiImage
          key={i}
          url={item.url}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          transparent
          opacity={item.opacity}
          side={THREE.DoubleSide}
        />
      ))}
    </group>
  );
};

const Hero3D = ({ isMobile }) => {
  return (
    <div className="hero-3d-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, #0a0015 0%, #020617 50%, #0a0a1a 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 5]} intensity={2} color="#00f3ff" />
        <pointLight position={[0, -5, -5]} intensity={1.5} color="#a855f7" />

        <Suspense fallback={null}>
          <GridFloor />
          <HoloPanels isMobile={isMobile} />
          <FloatingTechSymbols isMobile={isMobile} />
          <TechIcons isMobile={isMobile} />
        </Suspense>

        <fog attach="fog" args={['#020617', 5, 30]} />
      </Canvas>
    </div>
  );
};

export default Hero3D;
