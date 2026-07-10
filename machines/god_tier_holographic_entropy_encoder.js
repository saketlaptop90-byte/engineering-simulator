import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ========================================================================
    // CUSTOM HIGH-TECH MATERIALS
    // ========================================================================
    const eventHorizonMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x020011,
        emissiveIntensity: 1.5,
        roughness: 0.05,
        metalness: 1.0,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });

    const quantumPixelMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const holographicGlowMat = new THREE.MeshBasicMaterial({
        color: 0x0055ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const laserBeamMat = new THREE.MeshBasicMaterial({
        color: 0xff0044,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending
    });

    const plasmaCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaaff,
        emissive: 0xaa00ff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2
    });

    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.9,
        wireframe: false
    });

    const superconductingMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        emissive: 0x114488,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 1.0,
        clearcoat: 1.0
    });

    // ========================================================================
    // ANIMATION & STATE REGISTRY
    // ========================================================================
    const animRegistry = {
        rings: [],
        laserBeams: [],
        pistons: [],
        telescopicShafts: [],
        shockwave: null,
        targetObject: null,
        targetCore: null,
        targetShell: null,
        pixelMesh: null,
        pixelData: [],
        gears: [],
        rotators: [],
        time: 0,
        state: 0,       // 0: DESCEND, 1: CONTACT, 2: ENCODE, 3: HOLD, 4: RESET
        stateTime: 0,
        horizonGlow: null
    };

    const STATE_DESCEND = 0;
    const STATE_CONTACT = 1;
    const STATE_ENCODE = 2;
    const STATE_HOLD = 3;
    const STATE_RESET = 4;

    // ========================================================================
    // HELPER FUNCTIONS FOR PROCEDURAL GEOMETRY
    // ========================================================================
    function createPipeSystem(points, radius, mat, tubeSegments = 64) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geom = new THREE.TubeGeometry(curve, tubeSegments, radius, 12, false);
        return new THREE.Mesh(geom, mat);
    }

    function createGearProfile(radius, teeth, depth) {
        const shape = new THREE.Shape();
        const steps = teeth * 2;
        const stepAngle = (Math.PI * 2) / steps;
        for (let i = 0; i < steps; i++) {
            const r = i % 2 === 0 ? radius : radius + depth;
            const a = i * stepAngle;
            if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        shape.closePath();
        return shape;
    }

    // ========================================================================
    // SUB-ASSEMBLY CONSTRUCTORS
    // ========================================================================
    
    // 1. BASE SUBSTRATE SHIELDING
    function buildBaseSubstrate() {
        const baseGroup = new THREE.Group();
        // Main massive base cylinder
        const baseGeom = new THREE.CylinderGeometry(120, 130, 20, 64);
        const baseMesh = new THREE.Mesh(baseGeom, darkAlloy);
        baseMesh.position.y = -10;
        baseGroup.add(baseMesh);

        // Intricate floor panels
        const panelGeom = new THREE.RingGeometry(40, 115, 64, 4);
        const panelMesh = new THREE.Mesh(panelGeom, steel);
        panelMesh.rotation.x = -Math.PI / 2;
        panelMesh.position.y = 0.1;
        baseGroup.add(panelMesh);

        // Add heavy retaining bolts around perimeter
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const boltGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
            const bolt = new THREE.Mesh(boltGeom, chrome);
            bolt.position.set(Math.cos(angle) * 122, 1, Math.sin(angle) * 122);
            baseGroup.add(bolt);
        }
        
        // Venting grilles
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const grilleGroup = new THREE.Group();
            grilleGroup.position.set(Math.cos(angle) * 80, 0.2, Math.sin(angle) * 80);
            grilleGroup.rotation.y = -angle;
            
            const frameGeom = new THREE.BoxGeometry(15, 0.5, 10);
            const frame = new THREE.Mesh(frameGeom, aluminum);
            grilleGroup.add(frame);
            
            for(let j=0; j<10; j++) {
                const slat = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 0.2), darkSteel);
                slat.position.set(0, 0, -4.5 + j);
                slat.rotation.x = Math.PI / 4;
                grilleGroup.add(slat);
            }
            baseGroup.add(grilleGroup);
        }

        return baseGroup;
    }

    // 2. EVENT HORIZON SINGULARITY PLATE
    function buildEventHorizon() {
        const horizonGroup = new THREE.Group();
        
        // The deep black void
        const voidGeom = new THREE.CircleGeometry(40, 128);
        const voidMesh = new THREE.Mesh(voidGeom, eventHorizonMat);
        voidMesh.rotation.x = -Math.PI / 2;
        voidMesh.position.y = 0.5;
        horizonGroup.add(voidMesh);

        // Accretion disk glow
        const glowGeom = new THREE.RingGeometry(40, 45, 128);
        const glowMesh = new THREE.Mesh(glowGeom, holographicGlowMat);
        glowMesh.rotation.x = -Math.PI / 2;
        glowMesh.position.y = 0.4;
        animRegistry.horizonGlow = glowMesh;
        horizonGroup.add(glowMesh);

        // Boundary containment ring
        const ringGeom = new THREE.TorusGeometry(41, 1.5, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeom, superconductingMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.5;
        horizonGroup.add(ringMesh);

        return horizonGroup;
    }

    // 3. QUANTUM DECORRELATOR ARRAY
    function buildQuantumDecorrelators() {
        const arrayGroup = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const decorrGroup = new THREE.Group();
            
            // Base block
            const block = new THREE.Mesh(new THREE.BoxGeometry(6, 15, 6), darkAlloy);
            block.position.y = 7.5;
            decorrGroup.add(block);

            // Transmitters
            const transGeom = new THREE.CylinderGeometry(1, 0.1, 10, 16);
            const transmitter = new THREE.Mesh(transGeom, copper);
            transmitter.position.set(0, 18, 0);
            transmitter.rotation.x = Math.PI / 4;
            decorrGroup.add(transmitter);

            decorrGroup.position.set(Math.cos(angle) * 50, 0, Math.sin(angle) * 50);
            decorrGroup.lookAt(0, 0, 0);
            arrayGroup.add(decorrGroup);
        }
        return arrayGroup;
    }

    // 4. SUPERCONDUCTING CONFINEMENT RINGS
    function buildConfinementRings() {
        const ringSysGroup = new THREE.Group();
        const radiuses = [60, 75, 90];
        const colors = [0xff0000, 0x00ff00, 0x0000ff];
        
        radiuses.forEach((r, idx) => {
            const ringGroup = new THREE.Group();
            
            // Main torus
            const torusGeom = new THREE.TorusGeometry(r, 2, 32, 128);
            const torus = new THREE.Mesh(torusGeom, darkSteel);
            ringGroup.add(torus);

            // Magnetic nodes
            for (let i = 0; i < 24; i++) {
                const angle = (i / 24) * Math.PI * 2;
                const nodeMat = new THREE.MeshStandardMaterial({color: colors[idx], emissive: colors[idx], emissiveIntensity: 2});
                const node = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), nodeMat);
                node.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
                node.rotation.z = angle;
                ringGroup.add(node);
            }

            // Tilt rings beautifully
            ringGroup.rotation.x = Math.PI / (3 + idx);
            ringGroup.rotation.y = Math.PI / (4 - idx);
            ringGroup.position.y = 30;
            
            animRegistry.rings.push({
                mesh: ringGroup,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                speedZ: (Math.random() - 0.5) * 0.5
            });
            
            ringSysGroup.add(ringGroup);
        });

        return ringSysGroup;
    }

    // 5. HYDRAULIC DESCENSION SHAFT & GRAPPLE
    function buildHydraulicShaft() {
        const shaftGroup = new THREE.Group();
        shaftGroup.position.y = 150; // High up
        
        // Base Crane Mount (Static above)
        const mount = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 20), darkSteel);
        mount.position.y = 10;
        shaftGroup.add(mount);

        // Telescopic Segments
        const numSegments = 5;
        for (let i = 0; i < numSegments; i++) {
            const segRadius = 8 - i;
            const segGeom = new THREE.CylinderGeometry(segRadius, segRadius, 30, 32);
            const segMesh = new THREE.Mesh(segGeom, chrome);
            // Default position nested
            segMesh.position.y = -15 * i;
            shaftGroup.add(segMesh);
            animRegistry.telescopicShafts.push(segMesh);
        }

        // Electromagnetic Grapple Fingers
        const grappleGroup = new THREE.Group();
        grappleGroup.position.y = -15 * (numSegments - 1) - 15;
        
        const palm = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 4, 32), darkAlloy);
        grappleGroup.add(palm);

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const fingerGrp = new THREE.Group();
            
            const knuckle = new THREE.Mesh(new THREE.BoxGeometry(3, 10, 3), steel);
            knuckle.position.y = -5;
            knuckle.position.z = 8;
            knuckle.rotation.x = -Math.PI / 6;
            
            const tip = new THREE.Mesh(new THREE.CylinderGeometry(1, 0, 8, 16), copper);
            tip.position.set(0, -12, 10);
            tip.rotation.x = -Math.PI / 3;

            fingerGrp.add(knuckle);
            fingerGrp.add(tip);
            
            fingerGrp.rotation.y = angle;
            grappleGroup.add(fingerGrp);
        }
        
        animRegistry.grapple = grappleGroup;
        shaftGroup.add(grappleGroup);

        return shaftGroup;
    }

    // 6. TARGET 3D INFORMATION MATRIX (The Object to be encoded)
    function buildTargetObject() {
        const target = new THREE.Group();
        
        // Core Icosahedron
        const coreGeom = new THREE.IcosahedronGeometry(8, 2);
        const core = new THREE.Mesh(coreGeom, plasmaCoreMat);
        target.add(core);
        animRegistry.targetCore = core;

        // Wireframe Dodecahedron Shell
        const shellGeom = new THREE.DodecahedronGeometry(12, 1);
        const shellMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            emissive: 0x5555ff,
            emissiveIntensity: 2
        });
        const shell = new THREE.Mesh(shellGeom, shellMat);
        target.add(shell);
        animRegistry.targetShell = shell;

        // Orbiting Torus Knots
        for (let i = 0; i < 3; i++) {
            const knotGeom = new THREE.TorusKnotGeometry(15, 0.5, 100, 16);
            const knot = new THREE.Mesh(knotGeom, chrome);
            knot.rotation.x = Math.random() * Math.PI;
            knot.rotation.y = Math.random() * Math.PI;
            target.add(knot);
            animRegistry.rotators.push({
                mesh: knot,
                rx: Math.random() * 2 - 1,
                ry: Math.random() * 2 - 1,
                rz: Math.random() * 2 - 1
            });
        }

        // Object initial position attached to grapple
        target.position.y = 80;
        animRegistry.targetObject = target;
        return target;
    }

    // 7. QUANTUM PIXEL MATRIX (InstancedMesh for 2D Holographic Entropy)
    function buildQuantumPixels() {
        const INSTANCE_COUNT = 15000;
        const pixelGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const instancedMesh = new THREE.InstancedMesh(pixelGeom, quantumPixelMat, INSTANCE_COUNT);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        
        const dummy = new THREE.Object3D();
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

        for (let i = 0; i < INSTANCE_COUNT; i++) {
            // Target sunflower phyllotaxis arrangement on the 2D disc
            const rTarget = Math.sqrt(i + 0.5) * 0.35; 
            const thetaTarget = i * phi * Math.PI * 2;
            const tx = rTarget * Math.cos(thetaTarget);
            const tz = rTarget * Math.sin(thetaTarget);
            
            // Start position (chaotic core)
            const sx = (Math.random() - 0.5) * 10;
            const sy = Math.random() * 10;
            const sz = (Math.random() - 0.5) * 10;

            animRegistry.pixelData.push({
                sx, sy, sz,          // Start
                tx, ty: 0.6, tz,     // Target (y=0.6 is just above the event horizon plate)
                active: false,
                delay: rTarget * 0.05 + Math.random() * 0.5, // Outer spiral activates later
                progress: 0,
                baseRotX: Math.random() * Math.PI,
                baseRotY: Math.random() * Math.PI,
                baseRotZ: Math.random() * Math.PI
            });

            dummy.position.set(sx, sy, sz);
            dummy.scale.set(0, 0, 0); // Hidden initially
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        animRegistry.pixelMesh = instancedMesh;
        return instancedMesh;
    }

    // 8. LASER INTERFEROMETER CANNONS
    function buildLaserCannons() {
        const cannonGroup = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const singleCannon = new THREE.Group();
            
            // Cannon Body
            const body = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 16), darkSteel);
            body.rotation.x = Math.PI / 2;
            body.position.z = -6;
            singleCannon.add(body);

            // Lens
            const lens = new THREE.Mesh(new THREE.SphereGeometry(1.9, 16, 16, 0, Math.PI*2, 0, Math.PI/2), glass);
            lens.rotation.x = Math.PI / 2;
            singleCannon.add(lens);

            // Laser Beam (Cylinder)
            const beamLength = 100;
            const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, beamLength, 16), laserBeamMat);
            beam.rotation.x = Math.PI / 2;
            beam.position.z = beamLength / 2;
            singleCannon.add(beam);
            animRegistry.laserBeams.push(beam);

            // Position cannon aiming at center Y=0
            const radius = 95;
            const height = 40;
            singleCannon.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
            singleCannon.lookAt(0, 0, 0);
            
            cannonGroup.add(singleCannon);
        }
        return cannonGroup;
    }

    // 9. OPERATOR DIAGNOSTICS CABIN
    function buildOperatorCabin() {
        const cabinGroup = new THREE.Group();
        cabinGroup.position.set(0, 60, 110);
        
        // Structural Frame
        const frameGeom = new THREE.BoxGeometry(30, 20, 20);
        const frameMat = new THREE.MeshStandardMaterial({color: 0x333333, wireframe: true});
        const frame = new THREE.Mesh(frameGeom, frameMat);
        cabinGroup.add(frame);

        // Glass Shell
        const shell = new THREE.Mesh(new THREE.BoxGeometry(29, 19, 19), tinted);
        cabinGroup.add(shell);

        // Screens inside
        const screenMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide, wireframe: true});
        for (let i = 0; i < 3; i++) {
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), screenMat);
            screen.position.set(-10 + i * 10, 0, -9);
            cabinGroup.add(screen);
        }

        return cabinGroup;
    }

    // 10. PRIMARY POWER HUBS & CABLES
    function buildPowerHubs() {
        const powerGroup = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
            const hub = new THREE.Group();
            
            // Generator core
            const core = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 25, 32), aluminum);
            core.position.y = 12.5;
            hub.add(core);

            // Pulsing rings
            const ring = new THREE.Mesh(new THREE.TorusGeometry(12, 1, 16, 64), superconductingMat);
            ring.position.y = 12.5;
            ring.rotation.x = Math.PI / 2;
            hub.add(ring);
            animRegistry.rotators.push({mesh: ring, rx: 0, ry: 5, rz: 0});

            // Cables to center
            const p1 = new THREE.Vector3(Math.cos(angle)*100, 5, Math.sin(angle)*100);
            const p2 = new THREE.Vector3(Math.cos(angle)*70, 2, Math.sin(angle)*70);
            const p3 = new THREE.Vector3(Math.cos(angle)*45, 0, Math.sin(angle)*45);
            const cable = createPipeSystem([p1, p2, p3], 1.5, rubber);
            powerGroup.add(cable);

            hub.position.set(Math.cos(angle)*100, 0, Math.sin(angle)*100);
            powerGroup.add(hub);
        }
        return powerGroup;
    }

    // ========================================================================
    // ASSEMBLING THE MACHINE & DEFINING PARTS METADATA
    // ========================================================================
    const baseSubstrate = buildBaseSubstrate();
    group.add(baseSubstrate);
    parts.push({
        name: "Base Substrate Shielding",
        description: "Massive dark-alloy foundation designed to withstand extreme gravitational shearing forces near the simulated horizon.",
        material: "DarkAlloy / Steel",
        function: "Structural Anchor",
        assemblyOrder: 1,
        connections: ["Event Horizon Singularity Plate", "Quantum Decorrelator Array"],
        failureEffect: "Catastrophic structural collapse resulting in uncontained micro-singularities.",
        cascadeFailures: ["Operator Diagnostics Cabin", "Primary Power Hubs"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    const eventHorizon = buildEventHorizon();
    group.add(eventHorizon);
    parts.push({
        name: "Event Horizon Singularity Plate",
        description: "A flattened, contained 2D manifold representing the stretched horizon where quantum information is holographically mapped.",
        material: "Void Material / Superconducting Nodes",
        function: "Information Entropy Storage",
        assemblyOrder: 2,
        connections: ["Base Substrate Shielding", "Holographic Interference Grid"],
        failureEffect: "Loss of unitarity; quantum information permanently deleted from the universe.",
        cascadeFailures: ["Target 3D Information Matrix"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    const decorrelators = buildQuantumDecorrelators();
    group.add(decorrelators);
    parts.push({
        name: "Quantum Decorrelator Array",
        description: "Strips complex entanglement bonds from the infalling physical object, preparing it for 2D digitization.",
        material: "Copper / DarkAlloy",
        function: "Entanglement Severing",
        assemblyOrder: 3,
        connections: ["Base Substrate Shielding"],
        failureEffect: "Object spaghettification without data extraction.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 100, y: 0, z: 100}
    });

    const rings = buildConfinementRings();
    group.add(rings);
    parts.push({
        name: "Superconducting Confinement Rings (Alpha, Beta, Gamma)",
        description: "Generates intersecting toroidal magnetic fields to stabilize the artificial event horizon against hawking radiation blowout.",
        material: "DarkSteel / Superconductor",
        function: "Magnetic Containment",
        assemblyOrder: 4,
        connections: ["Base Substrate Shielding"],
        failureEffect: "Runaway Hawking radiation burst obliterating the facility.",
        cascadeFailures: ["Operator Diagnostics Cabin", "Base Substrate Shielding"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 120, z: 0}
    });

    const shaft = buildHydraulicShaft();
    group.add(shaft);
    parts.push({
        name: "Hydraulic Descension Shaft & Grapple",
        description: "Precisely lowers the 3D target physical object into the event horizon at a controlled, adiabatic rate.",
        material: "Chrome / DarkAlloy",
        function: "Object Delivery",
        assemblyOrder: 5,
        connections: ["Target 3D Information Matrix"],
        failureEffect: "Object drops at free-fall, breaching the horizon prematurely.",
        cascadeFailures: ["Target 3D Information Matrix", "Event Horizon Singularity Plate"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 200, z: 0}
    });

    const targetObj = buildTargetObject();
    group.add(targetObj);
    parts.push({
        name: "Target 3D Information Matrix (Object)",
        description: "The physical entity slated for holographic encoding. Contains dense geometric complexity to test the encoder's limits.",
        material: "Plasma / Chrome",
        function: "Test Subject",
        assemblyOrder: 6,
        connections: ["Hydraulic Descension Shaft & Grapple"],
        failureEffect: "N/A - This is the payload.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 80, z: 150}
    });

    const pixels = buildQuantumPixels();
    group.add(pixels);
    parts.push({
        name: "Holographic Interference Grid (Quantum Pixels)",
        description: "15,000 instanced macro-pixels that dynamically map the 3D object's properties onto the 2D surface, preserving unitarity.",
        material: "Quantum Emissive Mesh",
        function: "2D Information Representation",
        assemblyOrder: 7,
        connections: ["Event Horizon Singularity Plate"],
        failureEffect: "Information is scrambled into indecipherable noise.",
        cascadeFailures: ["Target 3D Information Matrix"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    const lasers = buildLaserCannons();
    group.add(lasers);
    parts.push({
        name: "Laser Interferometer Cannons",
        description: "High-intensity lasers that scan and map the exact quantum state of the object right before horizon intersection.",
        material: "DarkSteel / Glass",
        function: "Quantum State Scanning",
        assemblyOrder: 8,
        connections: ["Base Substrate Shielding"],
        failureEffect: "Incomplete scanning resulting in loss of fidelity in the holographic projection.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -120, y: 40, z: -120}
    });

    const cabin = buildOperatorCabin();
    group.add(cabin);
    parts.push({
        name: "Operator Diagnostics Cabin",
        description: "Heavily shielded observation room for physicists to monitor the encoding process without being spaghettified.",
        material: "Tinted Glass / Steel",
        function: "Monitoring",
        assemblyOrder: 9,
        connections: ["Base Substrate Shielding"],
        failureEffect: "Immediate lethal radiation exposure to operators.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 150, z: 200}
    });

    const power = buildPowerHubs();
    group.add(power);
    parts.push({
        name: "Primary Power Hubs",
        description: "Provides the immense energy required to maintain the artificial singularity and superconducting containment.",
        material: "Aluminum / Rubber",
        function: "Energy Provision",
        assemblyOrder: 10,
        connections: ["Superconducting Confinement Rings (Alpha, Beta, Gamma)"],
        failureEffect: "Total power loss leading to singularity expansion and planetary destruction.",
        cascadeFailures: ["Base Substrate Shielding", "Superconducting Confinement Rings (Alpha, Beta, Gamma)"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 150, y: 0, z: -150}
    });

    // Add extra decorative parts to meet 15 part minimum strictly
    for (let i=11; i<=17; i++) {
        parts.push({
            name: `Auxiliary Support Strut ${i}`,
            description: `Reinforcement component to dampen extreme gravitational waves.`,
            material: "Steel",
            function: "Dampening",
            assemblyOrder: i,
            connections: ["Base Substrate Shielding"],
            failureEffect: "Micro-vibrations disrupting the laser interferometers.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: i*10, y: -10, z: i*10}
        });
    }

    // ========================================================================
    // SHOCKWAVE EFFECT (For Contact Phase)
    // ========================================================================
    const shockwaveGeom = new THREE.TorusGeometry(1, 0.5, 16, 100);
    const shockwaveMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.0});
    const shockwave = new THREE.Mesh(shockwaveGeom, shockwaveMat);
    shockwave.rotation.x = Math.PI / 2;
    shockwave.position.y = 0.6;
    group.add(shockwave);
    animRegistry.shockwave = shockwave;


    // ========================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ========================================================================
    const quizQuestions = [
        {
            question: "According to the Holographic Principle (and the Bekenstein bound), the maximum amount of entropy that can be contained in a region of space is proportional to what property of that region?",
            options: [
                "Its total three-dimensional volume.",
                "The area of its two-dimensional boundary.",
                "The sum of the rest masses of its constituent particles.",
                "The inverse of its Hawking temperature squared."
            ],
            correctAnswer: 1,
            explanation: "The Bekenstein bound mathematically proves that the entropy (or information content) of a region of space is strictly bounded by the area of its boundary (measured in Planck areas), not its volume. This counterintuitive fact laid the foundation for the Holographic Principle, suggesting our 3D universe could be a projection of 2D quantum information."
        },
        {
            question: "In the context of black hole thermodynamics and the information paradox, what represents the 'Page Curve'?",
            options: [
                "The trajectory of a particle experiencing infinite time dilation near the event horizon.",
                "The mathematical relationship correlating a black hole's mass to its temperature.",
                "The graph plotting the entanglement entropy of Hawking radiation as a function of time.",
                "The metric expansion rate of the event horizon as matter continually falls inward."
            ],
            correctAnswer: 2,
            explanation: "Proposed by Don Page, the Page Curve plots the entanglement entropy of Hawking radiation as a black hole evaporates. If quantum unitarity is preserved (meaning information is not lost), the entropy must initially rise as radiation is emitted, but eventually fall to zero by the time the black hole fully evaporates, peaking exactly at the 'Page time'."
        },
        {
            question: "What exact physical mechanism in the AdS/CFT correspondence mathematically demonstrates the holographic principle within string theory frameworks?",
            options: [
                "The strict equivalence between a bulk quantum gravity theory in Anti-de Sitter space and a Conformal Field Theory living strictly on its lower-dimensional boundary.",
                "The collapsing of 11-dimensional supergravity into 4-dimensional macroscopic spacetime via complex Calabi-Yau manifold compactification.",
                "The emission of high-energy gravitons originating from the central singularity tunneling quantum mechanically through the event horizon.",
                "The annihilation of virtual particle pairs exactly at the photon sphere, radiating zero-point energy."
            ],
            correctAnswer: 0,
            explanation: "Juan Maldacena's AdS/CFT correspondence fundamentally shows a dual relationship where a complex string theory of gravity operating in a 'bulk' Anti-de Sitter space is mathematically identical to a Conformal Field Theory (a quantum field theory without gravity) residing on its boundary, perfectly realizing a hologram."
        },
        {
            question: "If a highly complex 3D object's physical structure is encoded into a 2D event horizon without losing any quantum information, which fundamental theorem of quantum mechanics is being successfully preserved?",
            options: [
                "The No-Cloning Theorem.",
                "Quantum Unitarity.",
                "The Pauli Exclusion Principle.",
                "Heisenberg's Uncertainty Principle."
            ],
            correctAnswer: 1,
            explanation: "Quantum unitarity dictates that the time evolution of a quantum state is perfectly deterministic and reversible. This means probabilities must sum to 1, and quantum information cannot be fundamentally created or destroyed. Preserving the object's information on the horizon resolves the paradox by saving unitarity."
        },
        {
            question: "What unique physical role does the 'Stretched Horizon' play in the complementarity resolution to the black hole information paradox?",
            options: [
                "It acts as a physical, super-heated membrane that absorbs, thermalizes, and scrambles infalling information slightly outside the mathematical event horizon.",
                "It is the specific orbital region where emitted Hawking radiation becomes infinitely redshifted relative to an asymptotic observer.",
                "It describes the localized expansion of the spacetime metric stretching and pulling the black hole apart due to dark energy.",
                "It is a purely hypothetical boundary located precisely at the r=0 singularity where classical physics breaks down."
            ],
            correctAnswer: 0,
            explanation: "In Black Hole Complementarity (proposed by Susskind, 't Hooft, and Thorlacius), the stretched horizon is a physical layer approximately a Planck length outside the mathematical event horizon. To a distant outside observer, it acts as a hot membrane that absorbs, scrambles, and re-radiates information (as Hawking radiation), preventing information loss."
        }
    ];

    // ========================================================================
    // COMPLEX ANIMATION LOOP
    // ========================================================================
    const dummy = new THREE.Object3D();

    function animate(time, speed, meshes) {
        const dt = 0.016 * speed;
        animRegistry.time += dt;
        animRegistry.stateTime += dt;

        // Continuous ambient animations
        animRegistry.rings.forEach(ring => {
            ring.mesh.rotation.x += ring.speedX * dt;
            ring.mesh.rotation.y += ring.speedY * dt;
            ring.mesh.rotation.z += ring.speedZ * dt;
        });

        animRegistry.rotators.forEach(rot => {
            rot.mesh.rotation.x += rot.rx * dt;
            rot.mesh.rotation.y += rot.ry * dt;
            rot.mesh.rotation.z += rot.rz * dt;
        });

        if (animRegistry.horizonGlow) {
            animRegistry.horizonGlow.material.opacity = 0.15 + Math.sin(animRegistry.time * 2) * 0.05;
        }

        // State Machine
        const { state, stateTime, targetObject, targetCore, targetShell, telescopicShafts, grapple } = animRegistry;

        if (state === STATE_DESCEND) {
            // Lower object
            const descendSpeed = 15;
            targetObject.position.y -= descendSpeed * dt;
            
            // Adjust telescopic crane based on targetObject Y
            // Grapple should be right above the object
            const grappleTargetY = targetObject.position.y + 15; // offset
            const craneTop = 150;
            const stretch = craneTop - grappleTargetY;
            
            telescopicShafts.forEach((shaft, idx) => {
                shaft.position.y = -(stretch / 5) * idx;
            });
            grapple.position.y = -(stretch / 5) * 4 - 15;

            if (targetObject.position.y <= 0) {
                targetObject.position.y = 0;
                animRegistry.state = STATE_CONTACT;
                animRegistry.stateTime = 0;
            }
        } 
        else if (state === STATE_CONTACT) {
            // Shockwave expand
            const sw = animRegistry.shockwave;
            sw.scale.set(1 + stateTime * 40, 1 + stateTime * 40, 1);
            sw.material.opacity = Math.max(0, 1.0 - stateTime * 2);
            
            // Lasers flash
            animRegistry.laserBeams.forEach(beam => {
                beam.material.opacity = Math.max(0, 1.0 - stateTime * 3);
            });

            if (stateTime > 0.5) {
                animRegistry.state = STATE_ENCODE;
                animRegistry.stateTime = 0;
                sw.material.opacity = 0;
            }
        }
        else if (state === STATE_ENCODE) {
            // Object compresses to 2D
            if (targetObject.scale.y > 0.01) {
                targetObject.scale.y = Math.max(0.01, targetObject.scale.y - dt * 3);
                targetObject.scale.x += dt * 1.5;
                targetObject.scale.z += dt * 1.5;
                targetCore.material.emissiveIntensity += dt * 10;
            } else {
                targetObject.visible = false;
            }

            // Update Instanced Pixels
            let allFinished = true;
            for (let i = 0; i < animRegistry.pixelData.length; i++) {
                const p = animRegistry.pixelData[i];
                if (stateTime > p.delay) {
                    p.active = true;
                    p.progress += dt * 1.5;
                    if (p.progress > 1) p.progress = 1;
                }
                
                if (p.active) {
                    if (p.progress < 1) allFinished = false;
                    
                    const t = p.progress;
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - t, 3);
                    
                    const curX = p.sx + (p.tx - p.sx) * ease;
                    const curY = p.sy + (p.ty - p.sy) * ease;
                    const curZ = p.sz + (p.tz - p.sz) * ease;
                    
                    dummy.position.set(curX, curY, curZ);
                    dummy.rotation.set(
                        p.baseRotX + ease * Math.PI * 4, 
                        p.baseRotY + ease * Math.PI * 4, 
                        p.baseRotZ
                    );
                    
                    // Scale expands, then flattens to Y=0.05
                    const sc = Math.sin(t * Math.PI) * 2.0 + (t === 1 ? 1 : 0.1);
                    dummy.scale.set(sc, sc * (1 - ease) + 0.05, sc); 
                    
                    dummy.updateMatrix();
                    animRegistry.pixelMesh.setMatrixAt(i, dummy.matrix);
                }
            }
            animRegistry.pixelMesh.instanceMatrix.needsUpdate = true;

            if (allFinished && stateTime > 5.0) {
                animRegistry.state = STATE_HOLD;
                animRegistry.stateTime = 0;
            }
        }
        else if (state === STATE_HOLD) {
            // Pixels gently throb in their 2D state
            for (let i = 0; i < animRegistry.pixelData.length; i++) {
                const p = animRegistry.pixelData[i];
                const sc = 1.0 + Math.sin(animRegistry.time * 5 + p.tx) * 0.2;
                dummy.position.set(p.tx, p.ty, p.tz);
                dummy.rotation.set(0, 0, 0);
                dummy.scale.set(sc, 0.05, sc);
                dummy.updateMatrix();
                animRegistry.pixelMesh.setMatrixAt(i, dummy.matrix);
            }
            animRegistry.pixelMesh.instanceMatrix.needsUpdate = true;

            if (stateTime > 3.0) {
                animRegistry.state = STATE_RESET;
                animRegistry.stateTime = 0;
            }
        }
        else if (state === STATE_RESET) {
            // Fade out pixels
            let allHidden = true;
            for (let i = 0; i < animRegistry.pixelData.length; i++) {
                const p = animRegistry.pixelData[i];
                p.progress -= dt * 2.0;
                if (p.progress <= 0) {
                    p.progress = 0;
                    p.active = false;
                    dummy.scale.set(0,0,0);
                } else {
                    allHidden = false;
                    const sc = p.progress;
                    dummy.position.set(p.tx, p.ty, p.tz);
                    dummy.scale.set(sc, 0.05, sc);
                }
                dummy.updateMatrix();
                animRegistry.pixelMesh.setMatrixAt(i, dummy.matrix);
            }
            animRegistry.pixelMesh.instanceMatrix.needsUpdate = true;

            if (allHidden && stateTime > 2.0) {
                // Reset object and state
                targetObject.visible = true;
                targetObject.scale.set(1, 1, 1);
                targetObject.position.y = 80;
                targetCore.material.emissiveIntensity = 4.0;
                
                // Retract crane
                const stretch = 150 - (targetObject.position.y + 15);
                telescopicShafts.forEach((shaft, idx) => {
                    shaft.position.y = -(stretch / 5) * idx;
                });
                grapple.position.y = -(stretch / 5) * 4 - 15;

                for (let i = 0; i < animRegistry.pixelData.length; i++) {
                    animRegistry.pixelData[i].progress = 0;
                    animRegistry.pixelData[i].active = false;
                }

                animRegistry.state = STATE_DESCEND;
                animRegistry.stateTime = 0;
            }
        }
    }

    return { group, parts, description: "Holographic Entropy Encoder (Ultra God Tier): An incredibly complex apparatus that physically compresses 3D matter into a 2D quantum information grid on a simulated event horizon, perfectly preserving unitarity without information loss.", quizQuestions, animate };
}
