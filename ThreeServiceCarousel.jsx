import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const ThreeServiceCarousel = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // --- CONFIGURATION ---
        const CONFIG = {
            cycleDuration: 1.2,
            cycleDelay: 2500,
            posLeft: { x: -2.5, z: 0, rotY: -0.4 },
            posCenter: { x: 2.5, z: 0, rotY: 0 },
            posEnter: { x: 15, z: 0, rotY: 0 },
            posExit: { x: -15, z: 0, rotY: 0 },
        };

        const IMAGE_PATHS = [
            './img/1.jpg',
            './img/1.jpg',
            './img/1.jpg',
            './img/1.jpg', // Order from Home.jsx
            './img/1.jpg',
            './img/1.jpg',
            './img/1.jpg',
            './img/1.jpg'
        ];

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Append to ref
        const container = mountRef.current;
        if (container) {
            container.appendChild(renderer.domElement);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 5, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        // --- LOAD TEXTURES ---
        const textureLoader = new THREE.TextureLoader();
        const textures = [];

        // Fallback Logic
        function createFallbackTexture(text) {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 512;
            const ctx = canvas.getContext('2d');
            const grd = ctx.createLinearGradient(0, 0, 512, 512);
            grd.addColorStop(0, "#222"); grd.addColorStop(1, "#444");
            ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = "#fff"; ctx.font = "bold 40px sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(text || "PROJECT", 256, 256);
            return new THREE.CanvasTexture(canvas);
        }

        let loadedCount = 0;

        IMAGE_PATHS.forEach((path, index) => {
            textureLoader.load(
                path,
                (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    textures[index] = tex;
                    checkInit();
                },
                undefined,
                () => {
                    console.warn(`Failed to load ${path}`);
                    textures[index] = createFallbackTexture(`Project ${index + 1}`);
                    checkInit();
                }
            );
        });

        function checkInit() {
            loadedCount++;
            if (loadedCount === IMAGE_PATHS.length) {
                initObjects();
            }
        }

        // --- OBJECT POOL ---
        const meshPool = [];
        const POOL_SIZE = 3;

        function applyShearMorph(geometry, width) {
            geometry.translate(-width / 2, 0, 0);
            const positionAttribute = geometry.attributes.position;
            const morphPositions = [];
            const SKEW_FACTOR = 0.3;
            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);
                const z = positionAttribute.getZ(i);
                const newY = y + (x * SKEW_FACTOR);
                morphPositions.push(x, newY, z);
            }
            geometry.morphAttributes.position = [
                new THREE.Float32BufferAttribute(morphPositions, 3)
            ];
        }

        let animationId;
        let timeoutId;

        function initObjects() {
            const SCREEN_W = 5;
            const SCREEN_H = 4;

            const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H, 20, 20);
            applyShearMorph(screenGeo, SCREEN_W);

            for (let i = 0; i < POOL_SIZE; i++) {
                const group = new THREE.Group();
                const tex = textures[i % textures.length]; // Initial assignments

                const screenMat = new THREE.MeshBasicMaterial({ map: tex });
                const screenMesh = new THREE.Mesh(screenGeo, screenMat);
                screenMesh.morphTargetInfluences = [0];
                screenMesh.castShadow = true;
                screenMesh.receiveShadow = true;

                group.add(screenMesh);
                group.userData = { morphVal: 0 };

                scene.add(group);
                meshPool.push(group);
            }

            updateLayout(); // Initial resize
            setInitialState();
            timeoutId = setTimeout(animateCycle, 1000);
            animate();
        }

        // --- ANIMATION STATE ---
        let idxLeft = 0;
        let idxCenter = 1;
        let idxEnter = 2;
        let nextTextureIndex = POOL_SIZE; // Next image to load into "Enter" slot

        function updateMorph(group, value) {
            group.userData.morphVal = value;
            group.children.forEach(c => {
                if (c.morphTargetInfluences) c.morphTargetInfluences[0] = value;
            });
        }

        function setInitialState() {
            const left = meshPool[idxLeft];
            const center = meshPool[idxCenter];
            const enter = meshPool[idxEnter];

            left.position.set(CONFIG.posLeft.x, 0, CONFIG.posLeft.z);
            left.rotation.set(0, CONFIG.posLeft.rotY, 0);
            updateMorph(left, 1);
            left.visible = true;

            center.position.set(CONFIG.posCenter.x, 0, CONFIG.posCenter.z);
            center.rotation.set(0, CONFIG.posCenter.rotY, 0);
            updateMorph(center, 0);
            center.visible = true;

            enter.position.set(CONFIG.posEnter.x, 0, CONFIG.posEnter.z);
            enter.rotation.set(0, CONFIG.posEnter.rotY, 0);
            updateMorph(enter, 0);
            enter.visible = true;
        }

        function animateCycle() {
            const leftGrp = meshPool[idxLeft];
            const centerGrp = meshPool[idxCenter];
            const enterGrp = meshPool[idxEnter];

            const tl = gsap.timeline({
                onComplete: () => {
                    // Cycle Indices
                    const oldLeft = idxLeft;
                    idxLeft = idxCenter;
                    idxCenter = idxEnter;
                    idxEnter = oldLeft; // Recycled

                    // RESET RECYCLED MESH
                    const recycled = meshPool[idxEnter];
                    recycled.position.set(CONFIG.posEnter.x, 0, CONFIG.posEnter.z);
                    recycled.rotation.set(0, CONFIG.posEnter.rotY, 0);
                    updateMorph(recycled, 0);

                    // SWAP TEXTURE
                    // Assign next texture to the recycled mesh
                    const nextTex = textures[nextTextureIndex % textures.length];
                    const mesh = recycled.children[0];
                    if (mesh && mesh.material) {
                        mesh.material.map = nextTex;
                    }
                    nextTextureIndex++;

                    gsap.delayedCall(CONFIG.cycleDuration, animateCycle);
                }
            });

            // 1. Center -> Left
            tl.to(centerGrp.position, {
                x: CONFIG.posLeft.x,
                z: CONFIG.posLeft.z,
                duration: CONFIG.cycleDuration,
                ease: "power3.inOut"
            }, 0)
                .to(centerGrp.rotation, {
                    y: CONFIG.posLeft.rotY,
                    duration: CONFIG.cycleDuration,
                    ease: "power3.inOut"
                }, 0)
                .to(centerGrp.userData, {
                    morphVal: 1,
                    duration: CONFIG.cycleDuration,
                    ease: "power3.inOut",
                    onUpdate: () => updateMorph(centerGrp, centerGrp.userData.morphVal)
                }, 0);

            // 2. Left -> Exit
            tl.to(leftGrp.position, {
                x: CONFIG.posExit.x,
                z: CONFIG.posExit.z,
                duration: CONFIG.cycleDuration,
                ease: "power2.in"
            }, 0)
                .to(leftGrp.userData, {
                    morphVal: 0,
                    duration: CONFIG.cycleDuration,
                    ease: "power2.in",
                    onUpdate: () => updateMorph(leftGrp, leftGrp.userData.morphVal)
                }, 0);

            // 3. Enter -> Center
            tl.fromTo(enterGrp.position,
                { x: CONFIG.posEnter.x, z: CONFIG.posEnter.z },
                {
                    x: CONFIG.posCenter.x,
                    z: CONFIG.posCenter.z,
                    duration: CONFIG.cycleDuration,
                    ease: "power3.inOut"
                },
                0);
        }

        function animate() {
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        // --- RESPONSIVE LOGIC ---
        const updateLayout = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight; // Or fix height

            // If container height is 0 (often happens in flex), default to sensible
            // But we want it to fill parent.
            // We'll trust parent sizing or use window logic if full screen?
            // User wants it in "My Services". 

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Responsive Dist
            // We want to fill the screen with the 2 cards (Total width ~10 units)
            // targetWidth = 11 gives a slight margin.
            const targetWidth = 11;
            const vFOV = THREE.MathUtils.degToRad(camera.fov);
            const dist = targetWidth / (2 * Math.tan(vFOV / 2) * camera.aspect);
            camera.position.z = Math.max(10, dist);
            camera.position.y = -0.6; // Lifts the view up so images don't get cut off at bottom
        };

        const resizeObserver = new ResizeObserver(() => updateLayout());
        resizeObserver.observe(container);

        // cleanup
        return () => {
            cancelAnimationFrame(animationId);
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            if (container) container.removeChild(renderer.domElement);
            // Dispose basic stuff
            renderer.dispose();
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
            gsap.killTweensOf(scene);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: '400px', display: 'block' }} />;
};

export default ThreeServiceCarousel;
