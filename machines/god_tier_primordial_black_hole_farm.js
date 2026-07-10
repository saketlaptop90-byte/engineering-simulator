import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom High-Tech Materials
    const hawkingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 6.0,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.9
    });

    const hawkingPurple = new THREE.MeshStandardMaterial({
        color: 0xcc00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 5.0,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const singularityMat = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        roughness: 0.0,
        metalness: 1.0,
        envMapIntensity: 0.0
    });
    
    const magneticFieldMat = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        emissive: 0x0000ff,
        emissiveIntensity: 2.0,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    const glowingGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x111122,
        emissiveIntensity: 0.5,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 1.0,
        ior: 1.5
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff4400,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.7
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 4.0
    });

    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7,
        metalness: 0.8
    });

    const animatedObjects = {
        generators: [],
        stabilizers: [],
        mbhs: [],
        coils: [],
        plasmaRings: [],
        magneticKnots: []
    };

    const parts = [
        {
            name: "Central Singularity Reactor Core",
            description: "The primary containment vessel where primordial black holes are stabilized before energy extraction. Uses nested tachyon fields.",
            material: "darkAlloy / glowingGlass",
            function: "Maintains absolute zero-point energy equilibrium to prevent unintended hawking evaporation cascade.",
            assemblyOrder: 1,
            connections: ["Hawking Radiation Collector Coil", "Superconducting Plasma Conduits"],
            failureEffect: "Instantaneous micro-supernova event destroying the facility.",
            cascadeFailures: ["Event Horizon Stabilizer Ring", "Graviton Deflector Shield"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 50, z: 0}
        },
        {
            name: "Event Horizon Stabilizer Ring Alpha",
            description: "Massive rotating ring that generates a counter-gravitational field to manipulate the MBH event horizons.",
            material: "copper",
            function: "Modulates the spin of the captured black holes.",
            assemblyOrder: 2,
            connections: ["Central Singularity Reactor Core"],
            failureEffect: "Black holes begin to merge, creating a runaway gravitational pull.",
            cascadeFailures: ["Micro-Singularity Tracking Sensors"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 20, z: -50}
        },
        {
            name: "Magnetic Containment Funnel Array (North)",
            description: "Precision-machined latency funnel that guides incoming MBHs from the capture manifold into the pipes.",
            material: "chrome",
            function: "Magnetic steering of neutrally charged but gravitationally immense micro-singularities.",
            assemblyOrder: 3,
            connections: ["MBH Injection Manifold", "Transparent Containment Plumbing"],
            failureEffect: "MBHs bore straight through the planet's crust.",
            cascadeFailures: ["Transparent Containment Plumbing"],
            originalPosition: {x: 0, y: 80, z: 0},
            explodedPosition: {x: 0, y: 150, z: 0}
        },
        {
            name: "Superconducting Plasma Conduit Node 1",
            description: "Channels the extreme heat and plasma generated from Hawking radiation.",
            material: "glowingGlass",
            function: "Thermal transfer at near light-speed.",
            assemblyOrder: 4,
            connections: ["Central Singularity Reactor Core", "Quantum Vacuum Heat Exchanger"],
            failureEffect: "Plasma leak vaporizing local structures.",
            cascadeFailures: ["Dark Matter Coolant Reservoir"],
            originalPosition: {x: 40, y: -20, z: 40},
            explodedPosition: {x: 80, y: -20, z: 80}
        },
        {
            name: "Superconducting Plasma Conduit Node 2",
            description: "Channels the extreme heat and plasma generated from Hawking radiation.",
            material: "glowingGlass",
            function: "Thermal transfer at near light-speed.",
            assemblyOrder: 5,
            connections: ["Central Singularity Reactor Core", "Quantum Vacuum Heat Exchanger"],
            failureEffect: "Plasma leak vaporizing local structures.",
            cascadeFailures: ["Dark Matter Coolant Reservoir"],
            originalPosition: {x: -40, y: -20, z: -40},
            explodedPosition: {x: -80, y: -20, z: -80}
        },
        {
            name: "Hawking Radiation Collector Coil",
            description: "Highly complex copper and chrome array that converts the gamma radiation bursts into usable exawatts.",
            material: "copper / chrome",
            function: "Energy harvesting.",
            assemblyOrder: 6,
            connections: ["Central Singularity Reactor Core"],
            failureEffect: "Energy overload, grid destruction.",
            cascadeFailures: ["Tachyon Overflow Vents"],
            originalPosition: {x: 0, y: -30, z: 0},
            explodedPosition: {x: 0, y: -80, z: 0}
        },
        {
            name: "Dark Matter Coolant Reservoir",
            description: "Stores exotic dark matter used to rapidly cool the plasma conduits.",
            material: "darkSteel",
            function: "Extreme cryogenic cooling.",
            assemblyOrder: 7,
            connections: ["Superconducting Plasma Conduits"],
            failureEffect: "Thermal runaway.",
            cascadeFailures: ["Central Singularity Reactor Core"],
            originalPosition: {x: 60, y: 10, z: 0},
            explodedPosition: {x: 120, y: 10, z: 0}
        },
        {
            name: "Graviton Deflector Shield Generator",
            description: "Projects a localized spacetime bubble to protect operators from spaghettification.",
            material: "aluminum",
            function: "Spacetime integrity maintenance.",
            assemblyOrder: 8,
            connections: ["Central Singularity Reactor Core"],
            failureEffect: "Operators stretch into infinite threads.",
            cascadeFailures: ["Operator Cabin"],
            originalPosition: {x: -60, y: 10, z: 0},
            explodedPosition: {x: -120, y: 10, z: 0}
        },
        {
            name: "Transparent Containment Plumbing (Alpha Route)",
            description: "Vast network of glass-like tubes reinforced with force fields.",
            material: "glowingGlass",
            function: "Transit path for MBHs.",
            assemblyOrder: 9,
            connections: ["Magnetic Containment Funnel Array", "Central Singularity Reactor Core"],
            failureEffect: "MBH breach.",
            cascadeFailures: ["Everything"],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {x: 50, y: 80, z: 50}
        },
        {
            name: "Tachyon Overflow Vents",
            description: "Releases excess faster-than-light particles built up during the evaporation process.",
            material: "steel",
            function: "Pressure regulation in the temporal dimension.",
            assemblyOrder: 10,
            connections: ["Hawking Radiation Collector Coil"],
            failureEffect: "Temporal anomalies, causality loops.",
            cascadeFailures: ["Spacetime Warp Calibrators"],
            originalPosition: {x: 0, y: -60, z: 0},
            explodedPosition: {x: 0, y: -120, z: 0}
        },
        {
            name: "Spacetime Warp Calibrators",
            description: "Micro-adjusts the local gravitational constant G.",
            material: "chrome",
            function: "Fine-tuning of reactor efficiency.",
            assemblyOrder: 11,
            connections: ["Tachyon Overflow Vents"],
            failureEffect: "Unpredictable mass fluctuations.",
            cascadeFailures: ["Event Horizon Stabilizer Ring Alpha"],
            originalPosition: {x: 20, y: 20, z: -20},
            explodedPosition: {x: 60, y: 60, z: -60}
        },
        {
            name: "Antimatter Back-up Igniter",
            description: "Used to kickstart the singularity spin if they stall.",
            material: "steel / hawkingPurple",
            function: "Emergency power and spin correction.",
            assemblyOrder: 12,
            connections: ["Central Singularity Reactor Core"],
            failureEffect: "Total annihilation event.",
            cascadeFailures: [],
            originalPosition: {x: -20, y: 20, z: 20},
            explodedPosition: {x: -60, y: 60, z: 60}
        },
        {
            name: "Micro-Singularity Tracking Sensors",
            description: "High-frequency LIDAR and gravitational wave detectors.",
            material: "glass",
            function: "Telemetry for MBH paths.",
            assemblyOrder: 13,
            connections: ["Transparent Containment Plumbing"],
            failureEffect: "Blind spots in MBH transit.",
            cascadeFailures: ["Magnetic Containment Funnel Array"],
            originalPosition: {x: 0, y: 60, z: 30},
            explodedPosition: {x: 0, y: 100, z: 80}
        },
        {
            name: "Operator Cabin Control Deck",
            description: "Highly shielded room where PhD operators manage the farm.",
            material: "darkAlloy / tinted",
            function: "Human interface point.",
            assemblyOrder: 14,
            connections: ["Graviton Deflector Shield Generator"],
            failureEffect: "Loss of control.",
            cascadeFailures: ["Everything"],
            originalPosition: {x: 0, y: -10, z: 80},
            explodedPosition: {x: 0, y: -10, z: 150}
        },
        {
            name: "Main Superconducting Generator Turbine",
            description: "Converts the immense heat and magnetic flux into planetary-scale electricity.",
            material: "copper / steel",
            function: "Final energy output.",
            assemblyOrder: 15,
            connections: ["Hawking Radiation Collector Coil"],
            failureEffect: "Power grid blackout.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: -100, z: 0},
            explodedPosition: {x: 0, y: -200, z: 0}
        },
        {
            name: "Quantum Vacuum Heat Exchanger",
            description: "Dumps excess heat directly into the quantum vacuum.",
            material: "aluminum",
            function: "Ultimate heat sink.",
            assemblyOrder: 16,
            connections: ["Superconducting Plasma Conduits"],
            failureEffect: "Boiling of the local vacuum state.",
            cascadeFailures: ["False Vacuum Decay"],
            originalPosition: {x: 0, y: -40, z: -80},
            explodedPosition: {x: 0, y: -80, z: -160}
        }
    ];

    // --- Complex Geometry Generation ---

    // 1. Base Platform (Hexagonal Fractal Extrusion)
    const createBasePlatform = () => {
        const platformGroup = new THREE.Group();
        
        const shape = new THREE.Shape();
        const hexSize = 120;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * hexSize;
            const z = Math.sin(angle) * hexSize;
            if (i === 0) shape.moveTo(x, z);
            else shape.lineTo(x, z);
        }
        shape.closePath();

        // Add inner holes for pipes
        for(let i = 0; i < 6; i++) {
            const holePath = new THREE.Path();
            const angle = (i * Math.PI) / 3;
            const hx = Math.cos(angle) * 60;
            const hz = Math.sin(angle) * 60;
            holePath.absarc(hx, hz, 15, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }
        
        const centerHole = new THREE.Path();
        centerHole.absarc(0, 0, 30, 0, Math.PI * 2, false);
        shape.holes.push(centerHole);

        const extrudeSettings = {
            depth: 10,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 2,
            bevelThickness: 2
        };

        const platformGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const platformMesh = new THREE.Mesh(platformGeo, darkAlloy);
        platformMesh.rotation.x = Math.PI / 2;
        platformMesh.position.y = -50;
        platformGroup.add(platformMesh);

        // Add detailed grilles and support beams
        for(let i=0; i<12; i++) {
            const angle = (i * Math.PI) / 6;
            const beamGeo = new THREE.CylinderGeometry(2, 2, 120, 16);
            const beamMesh = new THREE.Mesh(beamGeo, steel);
            beamMesh.position.set(Math.cos(angle)*60, -45, Math.sin(angle)*60);
            beamMesh.rotation.x = Math.PI/2;
            beamMesh.rotation.z = angle;
            platformGroup.add(beamMesh);
        }

        return platformGroup;
    };
    group.add(createBasePlatform());

    // 2. Central Singularity Reactor Core
    const createReactorCore = () => {
        const coreGroup = new THREE.Group();
        
        // Outer containment sphere
        const sphereGeo = new THREE.IcosahedronGeometry(28, 4);
        const sphereMesh = new THREE.Mesh(sphereGeo, glowingGlass);
        coreGroup.add(sphereMesh);

        // Inner structural cage
        const cageGeo = new THREE.IcosahedronGeometry(27.5, 3);
        const cageMesh = new THREE.Mesh(cageGeo, steel);
        cageMesh.material.wireframe = true;
        animatedObjects.stabilizers.push({mesh: cageMesh, axis: new THREE.Vector3(1, 1, 0).normalize(), speed: 0.01});
        coreGroup.add(cageMesh);

        // Nested toruses for tachyon fields
        for(let i = 0; i < 5; i++) {
            const torusGeo = new THREE.TorusGeometry(32 + i*4, 1.5, 16, 100);
            const torusMesh = new THREE.Mesh(torusGeo, i%2===0 ? copper : chrome);
            torusMesh.rotation.x = Math.PI/2;
            animatedObjects.coils.push({mesh: torusMesh, phase: i, speed: 0.02 + i*0.005});
            coreGroup.add(torusMesh);
        }

        return coreGroup;
    };
    group.add(createReactorCore());

    // 3. Magnetic Containment Funnels (Top and Bottom arrays)
    const createFunnel = (x, y, z, invert) => {
        const funnelGroup = new THREE.Group();
        
        const points = [];
        for (let i = 0; i <= 30; i++) {
            const t = i / 30;
            // Flare out exponentially
            points.push(new THREE.Vector2(Math.exp(t * 3) + 2, t * 40));
        }
        const funnelGeo = new THREE.LatheGeometry(points, 64);
        const funnelMesh = new THREE.Mesh(funnelGeo, chrome);
        
        if (invert) {
            funnelMesh.rotation.x = Math.PI;
        }
        
        funnelGroup.add(funnelMesh);

        // Magnetic accelerator rings around funnel
        for(let i=0; i<8; i++) {
            const r = Math.exp((i/8) * 3) + 3;
            const ringGeo = new THREE.TorusGeometry(r, 0.8, 16, 64);
            const ringMesh = new THREE.Mesh(ringGeo, copper);
            ringMesh.position.y = invert ? -(i/8)*40 : (i/8)*40;
            ringMesh.rotation.x = Math.PI/2;
            animatedObjects.pulses.push({mesh: ringMesh, baseY: ringMesh.position.y, phase: i});
            funnelGroup.add(ringMesh);
        }

        funnelGroup.position.set(x, y, z);
        return funnelGroup;
    };

    // Add multiple funnels feeding into the system
    group.add(createFunnel(0, 35, 0, false));
    group.add(createFunnel(0, -35, 0, true));

    // 4. Transparent Containment Plumbing (The Pipes)
    // Complex paths for the MBHs to travel
    const pipeCurves = [];
    const createPipes = () => {
        const pipeGroup = new THREE.Group();
        
        // 8 peripheral injector pipes winding down to the core
        for(let i=0; i<8; i++) {
            const angle = (i * Math.PI) / 4;
            const startX = Math.cos(angle) * 150;
            const startZ = Math.sin(angle) * 150;
            const startY = 120;

            const midX1 = Math.cos(angle + 0.5) * 80;
            const midZ1 = Math.sin(angle + 0.5) * 80;
            const midY1 = 80;

            const midX2 = Math.cos(angle - 0.2) * 50;
            const midZ2 = Math.sin(angle - 0.2) * 50;
            const midY2 = 40;

            const endX = Math.cos(angle) * 25;
            const endZ = Math.sin(angle) * 25;
            const endY = 15;

            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(startX, startY, startZ),
                new THREE.Vector3(midX1, midY1, midZ1),
                new THREE.Vector3(midX2, midY2, midZ2),
                new THREE.Vector3(endX, endY, endZ)
            ]);
            pipeCurves.push(curve);

            const tubeGeo = new THREE.TubeGeometry(curve, 100, 3, 16, false);
            const tubeMesh = new THREE.Mesh(tubeGeo, glowingGlass);
            pipeGroup.add(tubeMesh);

            // Add support collars to the pipes
            for(let j=0; j<=10; j++) {
                const t = j/10;
                const pos = curve.getPointAt(t);
                const tangent = curve.getTangentAt(t);
                
                const collarGeo = new THREE.TorusGeometry(4.5, 0.5, 16, 32);
                const collarMesh = new THREE.Mesh(collarGeo, steel);
                collarMesh.position.copy(pos);
                // Align collar to tangent
                const up = new THREE.Vector3(0, 1, 0);
                const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
                const radians = Math.acos(up.dot(tangent));
                collarMesh.quaternion.setFromAxisAngle(axis, radians);
                pipeGroup.add(collarMesh);
            }
        }
        return pipeGroup;
    };
    group.add(createPipes());

    // 5. Micro Black Holes (MBHs)
    const createMBHs = () => {
        const mbhGroup = new THREE.Group();
        
        // For each curve, generate a few MBHs
        pipeCurves.forEach((curve, index) => {
            for(let i=0; i<3; i++) {
                const mGroup = new THREE.Group();
                
                // The actual singularity (pitch black)
                const singGeo = new THREE.IcosahedronGeometry(0.8, 3);
                const singMesh = new THREE.Mesh(singGeo, singularityMat);
                mGroup.add(singMesh);

                // The hawking radiation glow (corona)
                const coronaGeo = new THREE.IcosahedronGeometry(1.5, 3);
                const coronaMesh = new THREE.Mesh(coronaGeo, i%2===0 ? hawkingBlue : hawkingPurple);
                mGroup.add(coronaMesh);

                // Magnetic bow shock (TorusKnot)
                const shockGeo = new THREE.TorusKnotGeometry(1.8, 0.2, 64, 8);
                const shockMesh = new THREE.Mesh(shockGeo, magneticFieldMat);
                animatedObjects.magneticKnots.push(shockMesh);
                mGroup.add(shockMesh);

                mbhGroup.add(mGroup);

                // Store animation data
                animatedObjects.mbhs.push({
                    group: mGroup,
                    curve: curve,
                    t: (i * 0.33) + (index * 0.1), // staggered start times
                    speed: 0.002 + Math.random() * 0.001
                });
            }
        });
        return mbhGroup;
    };
    group.add(createMBHs());

    // 6. Massive Superconducting Generators
    const createGenerators = () => {
        const genGroup = new THREE.Group();
        
        for(let i=0; i<6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * 75;
            const z = Math.sin(angle) * 75;
            
            const turbineGroup = new THREE.Group();
            
            // Outer casing
            const casingGeo = new THREE.CylinderGeometry(15, 15, 60, 32);
            const casingMesh = new THREE.Mesh(casingGeo, darkAlloy);
            turbineGroup.add(casingMesh);

            // Spinning inner core
            const coreGeo = new THREE.CylinderGeometry(12, 12, 62, 16);
            const coreMesh = new THREE.Mesh(coreGeo, copper);
            animatedObjects.generators.push(coreMesh);
            turbineGroup.add(coreMesh);

            // Plasma glow rings
            for(let j=0; j<4; j++) {
                const ringGeo = new THREE.TorusGeometry(15.5, 1.0, 16, 64);
                const ringMesh = new THREE.Mesh(ringGeo, plasmaMat);
                ringMesh.position.y = -20 + (j * 13.33);
                ringMesh.rotation.x = Math.PI/2;
                animatedObjects.plasmaRings.push({mesh: ringMesh, phase: i+j});
                turbineGroup.add(ringMesh);
            }

            // Power conduit connecting to base
            const conduitGeo = new THREE.CylinderGeometry(4, 4, 40, 16);
            const conduitMesh = new THREE.Mesh(conduitGeo, steel);
            conduitMesh.position.y = -50;
            turbineGroup.add(conduitMesh);

            turbineGroup.position.set(x, -90, z);
            genGroup.add(turbineGroup);
        }
        return genGroup;
    };
    group.add(createGenerators());

    // 7. Operator Cabin & Heat Exchangers
    const createFacilities = () => {
        const facGroup = new THREE.Group();
        
        // Cabin
        const cabinGeo = new THREE.BoxGeometry(40, 15, 20);
        const cabinMesh = new THREE.Mesh(cabinGeo, steel);
        cabinMesh.position.set(0, 10, 100);
        facGroup.add(cabinMesh);

        const windowGeo = new THREE.BoxGeometry(38, 10, 2);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(0, 10, 90.5);
        facGroup.add(windowMesh);

        // Heat Exchangers (Arrays of fins)
        for(let i=0; i<4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI/4;
            const x = Math.cos(angle) * 100;
            const z = Math.sin(angle) * 100;
            
            const hxGroup = new THREE.Group();
            for(let j=0; j<20; j++) {
                const finGeo = new THREE.BoxGeometry(10, 40, 0.5);
                const finMesh = new THREE.Mesh(finGeo, aluminum);
                finMesh.position.set(0, 0, -10 + j);
                hxGroup.add(finMesh);
            }
            hxGroup.position.set(x, -60, z);
            hxGroup.rotation.y = angle;
            facGroup.add(hxGroup);
        }

        return facGroup;
    };
    group.add(createFacilities());

    // 8. Event Horizon Stabilizer Ring Alpha
    const createStabilizerRings = () => {
        const ringGroup = new THREE.Group();
        
        const outerGeo = new THREE.TorusGeometry(80, 4, 32, 128);
        const outerMesh = new THREE.Mesh(outerGeo, chrome);
        outerMesh.rotation.x = Math.PI / 2;
        
        // Add detailed nodes along the ring
        for(let i=0; i<12; i++) {
            const angle = (i * Math.PI) / 6;
            const nodeGeo = new THREE.BoxGeometry(12, 12, 12);
            const nodeMesh = new THREE.Mesh(nodeGeo, copper);
            nodeMesh.position.set(Math.cos(angle)*80, 0, Math.sin(angle)*80);
            nodeMesh.rotation.y = -angle;
            outerMesh.add(nodeMesh);
            
            // Neon lights on nodes
            const neonGeo = new THREE.BoxGeometry(13, 2, 13);
            const neonMesh = new THREE.Mesh(neonGeo, neonGreen);
            nodeMesh.add(neonMesh);
        }

        animatedObjects.stabilizers.push({mesh: outerMesh, axis: new THREE.Vector3(0, 1, 0), speed: 0.005});
        ringGroup.add(outerMesh);
        
        return ringGroup;
    };
    group.add(createStabilizerRings());


    // Animation Logic
    const animate = (time, speed, meshes) => {
        const t = time * speed;

        // 1. Spin Generators
        animatedObjects.generators.forEach(gen => {
            gen.rotation.y = t * 10;
        });

        // 2. Rotate Stabilizer Rings & Core Cages
        animatedObjects.stabilizers.forEach(stab => {
            stab.mesh.rotateOnAxis(stab.axis, stab.speed);
        });

        // 3. Move Micro Black Holes along curves
        animatedObjects.mbhs.forEach(mbh => {
            mbh.t += mbh.speed * speed * 20;
            if (mbh.t > 1) {
                mbh.t = 0; // Loop back to start
            }
            
            // Get position and tangent from curve
            const position = mbh.curve.getPointAt(mbh.t);
            mbh.group.position.copy(position);
            
            // Spin the MBH group for chaos
            mbh.group.rotation.x += 0.1;
            mbh.group.rotation.y += 0.2;
        });

        // 4. Spin Magnetic Knots on MBHs
        animatedObjects.magneticKnots.forEach((knot, index) => {
            knot.rotation.z = t * 5 + index;
            knot.rotation.x = t * 3;
        });

        // 5. Modulate Reactor Coils
        animatedObjects.coils.forEach(coil => {
            coil.mesh.rotation.z = Math.sin(t * coil.speed + coil.phase) * Math.PI;
            coil.mesh.rotation.y = Math.cos(t * coil.speed * 0.5 + coil.phase) * Math.PI;
        });

        // 6. Pulse Plasma Rings (emissive intensity)
        animatedObjects.plasmaRings.forEach(ring => {
            const intensity = 2.0 + Math.sin(t * 5 + ring.phase) * 1.5;
            // Since we reused material, we can't change it individually unless we clone. 
            // We scale the ring slightly instead for individual effect.
            const scale = 1.0 + Math.sin(t * 8 + ring.phase) * 0.05;
            ring.mesh.scale.set(scale, scale, scale);
        });

        // 7. Pulse Funnel Rings (Y translation)
        animatedObjects.pulses.forEach(pulse => {
            pulse.mesh.position.y = pulse.baseY + Math.sin(t * 10 + pulse.phase) * 1.5;
            const s = 1.0 + Math.sin(t * 10 + pulse.phase) * 0.1;
            pulse.mesh.scale.set(s, s, s);
        });
        
        // 8. Global Core breathing (scale)
        const coreScale = 1.0 + Math.sin(t * 2) * 0.02;
        group.children[1].scale.set(coreScale, coreScale, coreScale); // Assuming ReactorCore is index 1
    };

    const quizQuestions = [
        {
            question: "According to Stephen Hawking's original 1974 paper, the temperature of a black hole is inversely proportional to its what?",
            options: [
                "Spin (Angular Momentum)",
                "Mass",
                "Electric Charge",
                "Event Horizon Surface Area"
            ],
            correctAnswer: 1,
            explanation: "Hawking radiation temperature is inversely proportional to mass. As a black hole loses mass, it gets hotter and evaporates faster, leading to a massive explosive burst at the end of its life."
        },
        {
            question: "If a Primordial Black Hole with the mass of Mount Everest (~10^15 kg) was contained in this facility, approximately what is the radius of its event horizon (Schwarzschild radius)?",
            options: [
                "The size of a golf ball (~2 cm)",
                "The size of a grain of sand (~1 mm)",
                "The size of a single proton (~1 femtometer)",
                "The size of a typical atomic nucleus (~1.5 attometers)"
            ],
            correctAnswer: 2,
            explanation: "R_s = 2GM/c^2. For 10^15 kg, the radius is roughly 1.48 × 10^-15 meters, which is comparable to the size of a single proton."
        },
        {
            question: "What specific theoretical process allows particles to escape the black hole, creating Hawking Radiation?",
            options: [
                "Quantum Tunneling of Virtual Particle Pairs near the Event Horizon",
                "Gravitational Lensing of background Cosmic Microwave Background radiation",
                "Spaghettification of matter releasing kinetic energy",
                "Accretion disk friction surpassing the Eddington limit"
            ],
            correctAnswer: 0,
            explanation: "Hawking radiation is theorized to occur when quantum fluctuations create virtual particle-antiparticle pairs near the event horizon. If one particle falls in and the other escapes, the escaping particle becomes real Hawking radiation, drawing mass/energy from the black hole."
        },
        {
            question: "In the context of the Information Paradox, what hypothetical construct is proposed to store the quantum information of everything that falls into the black hole?",
            options: [
                "A White Hole",
                "A Planck Star",
                "The Holographic Principle on the Event Horizon",
                "A Tachyon Field"
            ],
            correctAnswer: 2,
            explanation: "The Holographic Principle suggests that all the 3D information of the volume inside a black hole is encoded as a 2D hologram on the boundary of its event horizon."
        },
        {
            question: "Primordial Black Holes (PBHs) are considered a strong candidate for explaining which cosmological mystery?",
            options: [
                "The accelerating expansion of the universe (Dark Energy)",
                "The Baryon Asymmetry (Matter/Antimatter imbalance)",
                "Dark Matter",
                "The Great Attractor"
            ],
            correctAnswer: 2,
            explanation: "Since PBHs formed in the high-density environment of the early universe and do not emit light (unless they are evaporating and very small), they are a prominent MACHO (Massive Astrophysical Compact Halo Object) candidate for Dark Matter."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
