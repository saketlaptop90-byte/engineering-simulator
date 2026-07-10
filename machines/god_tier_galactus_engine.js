import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        core: null,
        mantle: null,
        shards: [],
        rings: [],
        grinders: [],
        conversionMatrix: null,
        conversionRings: [],
        particleSystem: null,
        particleVelocities: null,
        lasers: [],
        tractorArrays: [],
        stabilizers: [],
        coolantVents: []
    };

    // ==========================================
    // ADVANCED MATERIAL DEFINITIONS
    // ==========================================
    // We clone and heavily modify existing materials to create hyper-tech glowing variants.
    
    const magmaMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff1100,
        emissiveIntensity: 2.5,
        wireframe: true,
        roughness: 0.9,
        metalness: 0.1
    });

    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xeeffff,
        emissiveIntensity: 6.0,
        roughness: 0.1,
        metalness: 0.8
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.85,
        wireframe: false,
        roughness: 0.2,
        metalness: 1.0
    });

    const forceFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        transmission: 0.95,
        thickness: 2.0,
        side: THREE.DoubleSide
    });

    const laserMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const antimatterMat = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x4b0082,
        emissiveIntensity: 3.0,
        roughness: 0.4,
        metalness: 0.9
    });

    const darkEnergyMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x110022,
        emissiveIntensity: 1.5,
        roughness: 0.9,
        metalness: 0.1
    });

    // ==========================================
    // COMPLEX GEOMETRY GENERATORS
    // ==========================================
    
    // Generates a massive complex gear shape for extrusion
    const createGearShape = (teethCount, outerRad, innerRad) => {
        const shape = new THREE.Shape();
        for (let i = 0; i < teethCount * 2; i++) {
            const radius = i % 2 === 0 ? outerRad : innerRad;
            const angle = (i / (teethCount * 2)) * Math.PI * 2;
            if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        shape.closePath();
        return shape;
    };

    // Generates a complex lathed profile for energy conduits
    const createEnergyConduitGeometry = (length, segments, radius, waveAmplitude, waves) => {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const r = radius + Math.sin(t * Math.PI * waves) * waveAmplitude;
            points.push(new THREE.Vector2(r, t * length - length / 2));
        }
        return new THREE.LatheGeometry(points, 64);
    };

    const planetRadius = 60;

    // ==========================================
    // PART GENERATION MANIFEST
    // ==========================================
    // The machine is assembled via 20 uniquely engineered macro-components.
    
    const partDefinitions = [
        {
            name: "Central Singularity Core",
            metadata: {
                name: "Central Singularity Core",
                description: "The artificial microscopic black hole acting as the gravitational anchor and ultimate matter-annihilation point of the Engine.",
                material: "coreMat",
                function: "Generates the immense gravity well required to counter the planet's natural binding energy.",
                assemblyOrder: 1,
                connections: ["Matter-Energy Conversion Matrix", "Magma Mantle Layer"],
                failureEffect: "Instantaneous Hawking evaporation resulting in a supernova-level localized explosion.",
                cascadeFailures: ["All Components"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 0, z: -200 }
            },
            build: () => {
                const g = new THREE.Group();
                const coreGeom = new THREE.IcosahedronGeometry(planetRadius * 0.25, 5);
                const coreMesh = new THREE.Mesh(coreGeom, coreMat);
                meshes.core = coreMesh;
                g.add(coreMesh);
                
                // Event horizon shell
                const horizonGeom = new THREE.SphereGeometry(planetRadius * 0.28, 64, 64);
                const horizonMesh = new THREE.Mesh(horizonGeom, darkEnergyMat);
                horizonMesh.material.transparent = true;
                horizonMesh.material.opacity = 0.5;
                g.add(horizonMesh);
                
                return g;
            }
        },
        {
            name: "Magma Mantle Layer",
            metadata: {
                name: "Magma Mantle Layer",
                description: "The hyper-pressurized, superheated silicate layer of the target planet, currently being siphoned.",
                material: "magmaMat",
                function: "Serves as the thermal buffer and primary raw material reservoir prior to core collapse.",
                assemblyOrder: 2,
                connections: ["Central Singularity Core", "Fractured Planetary Crust"],
                failureEffect: "Mantle blowout, prematurely ejecting the crust into deep space.",
                cascadeFailures: ["Fractured Planetary Crust", "Equatorial Plasma Containment Ring"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 0, z: 200 }
            },
            build: () => {
                const g = new THREE.Group();
                const mantleGeom = new THREE.IcosahedronGeometry(planetRadius * 0.85, 8);
                const mantleMesh = new THREE.Mesh(mantleGeom, magmaMat);
                meshes.mantle = mantleMesh;
                g.add(mantleMesh);
                return g;
            }
        },
        {
            name: "Fractured Planetary Crust",
            metadata: {
                name: "Fractured Planetary Crust",
                description: "The disintegrating lithosphere of the planet, suspended in anti-gravity fields.",
                material: "darkSteel",
                function: "The outermost planetary shell being systematically broken down by the Grinders.",
                assemblyOrder: 3,
                connections: ["Magma Mantle Layer"],
                failureEffect: "Uncontrolled asteroid formation, bombarding the Engine superstructure.",
                cascadeFailures: ["Primary Lithosphere Grinder", "Orbital Alignment Ring Alpha"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: -200, y: 0, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const shardCount = 1200;
                for (let i = 0; i < shardCount; i++) {
                    const phi = Math.acos(1 - 2 * (i + 0.5) / shardCount);
                    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                    const x = planetRadius * Math.cos(theta) * Math.sin(phi);
                    const y = planetRadius * Math.sin(theta) * Math.sin(phi);
                    const z = planetRadius * Math.cos(phi);
                    
                    const shardGeom = new THREE.TetrahedronGeometry(Math.random() * 5 + 2, Math.floor(Math.random() * 3));
                    const shard = new THREE.Mesh(shardGeom, darkSteel);
                    shard.position.set(x, y, z);
                    shard.lookAt(0, 0, 0);
                    
                    shard.userData = {
                        originalPos: new THREE.Vector3(x, y, z),
                        velocity: new THREE.Vector3(x, y, z).normalize().multiplyScalar(Math.random() * 0.4 + 0.05),
                        rotSpeed: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1),
                        detached: Math.random() > 0.4,
                        delay: Math.random() * 100
                    };
                    meshes.shards.push(shard);
                    g.add(shard);
                }
                return g;
            }
        },
        {
            name: "Equatorial Plasma Containment Ring",
            metadata: {
                name: "Equatorial Plasma Containment Ring",
                description: "A massive, multi-terawatt toroid projecting a unified gravimetric field around the planet's equator.",
                material: "chrome / plasmaMat",
                function: "Prevents equatorial blowout during core pressurization.",
                assemblyOrder: 4,
                connections: ["Orbital Alignment Ring Alpha", "Orbital Alignment Ring Beta"],
                failureEffect: "Total loss of planetary containment, instantaneous atmospheric venting.",
                cascadeFailures: ["Polar Gravimetric Stabilizer Ring"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 0, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const ringGeom = new THREE.TorusGeometry(planetRadius * 1.5, 6, 64, 128);
                const ringMesh = new THREE.Mesh(ringGeom, chrome);
                ringMesh.rotation.x = Math.PI / 2;
                g.add(ringMesh);
                
                // Add plasma emitters along the ring
                for (let i = 0; i < 36; i++) {
                    const emitterGeom = new THREE.CylinderGeometry(2, 2, 14, 16);
                    const emitter = new THREE.Mesh(emitterGeom, darkSteel);
                    const angle = (i / 36) * Math.PI * 2;
                    emitter.position.set(Math.cos(angle) * planetRadius * 1.5, 0, Math.sin(angle) * planetRadius * 1.5);
                    emitter.lookAt(0, 0, 0);
                    emitter.rotation.x += Math.PI / 2;
                    
                    const plasmaCoreGeom = new THREE.SphereGeometry(3, 16, 16);
                    const plasmaCore = new THREE.Mesh(plasmaCoreGeom, plasmaMat);
                    plasmaCore.position.y = 8;
                    emitter.add(plasmaCore);
                    
                    g.add(emitter);
                }
                meshes.rings.push({ mesh: g, axis: 'y', speed: 0.01 });
                return g;
            }
        },
        {
            name: "Polar Gravimetric Stabilizer Ring",
            metadata: {
                name: "Polar Gravimetric Stabilizer Ring",
                description: "Interlocking polar ring system that counteracts the planet's axial tilt inertia during conversion.",
                material: "steel / plasmaMat",
                function: "Cancels out the planet's natural angular momentum.",
                assemblyOrder: 5,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Gyroscopic tearing of the entire Engine superstructure.",
                cascadeFailures: ["Sub-space Communication Array", "Command and Control Citadel"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 300, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const ringGeom = new THREE.TorusGeometry(planetRadius * 1.6, 4, 64, 128);
                const ringMesh = new THREE.Mesh(ringGeom, steel);
                g.add(ringMesh);
                meshes.rings.push({ mesh: g, axis: 'x', speed: 0.015 });
                return g;
            }
        },
        {
            name: "Orbital Alignment Ring Alpha",
            metadata: {
                name: "Orbital Alignment Ring Alpha",
                description: "Diagonal reinforcement toroid studded with heavy magnetic locks.",
                material: "darkSteel",
                function: "Maintains absolute structural rigidity of the containment sphere.",
                assemblyOrder: 6,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Structural resonance cascade.",
                cascadeFailures: ["Orbital Alignment Ring Beta"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 200, y: 200, z: 200 }
            },
            build: () => {
                const g = new THREE.Group();
                const ringGeom = new THREE.TorusGeometry(planetRadius * 1.7, 3, 32, 128);
                const ringMesh = new THREE.Mesh(ringGeom, darkSteel);
                ringMesh.rotation.x = Math.PI / 4;
                ringMesh.rotation.y = Math.PI / 4;
                
                // Add heavy magnetic locks
                for(let i=0; i<12; i++){
                    const lockGeom = new THREE.BoxGeometry(10, 10, 10);
                    const lock = new THREE.Mesh(lockGeom, chrome);
                    const angle = (i/12) * Math.PI * 2;
                    lock.position.set(Math.cos(angle) * planetRadius * 1.7, Math.sin(angle) * planetRadius * 1.7, 0);
                    ringMesh.add(lock);
                }
                
                g.add(ringMesh);
                meshes.rings.push({ mesh: g, axis: 'z', speed: -0.008 });
                return g;
            }
        },
        {
            name: "Orbital Alignment Ring Beta",
            metadata: {
                name: "Orbital Alignment Ring Beta",
                description: "Secondary diagonal reinforcement toroid.",
                material: "darkSteel",
                function: "Counter-balances Orbital Alignment Ring Alpha.",
                assemblyOrder: 7,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Harmonic destabilization of the Engine.",
                cascadeFailures: ["Orbital Alignment Ring Alpha"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: -200, y: -200, z: -200 }
            },
            build: () => {
                const g = new THREE.Group();
                const ringGeom = new THREE.TorusGeometry(planetRadius * 1.75, 3, 32, 128);
                const ringMesh = new THREE.Mesh(ringGeom, darkSteel);
                ringMesh.rotation.x = -Math.PI / 4;
                ringMesh.rotation.y = -Math.PI / 4;
                g.add(ringMesh);
                meshes.rings.push({ mesh: g, axis: 'z', speed: 0.009 });
                return g;
            }
        },
        {
            name: "Northern Hemisphere Tractor Array",
            metadata: {
                name: "Northern Hemisphere Tractor Array",
                description: "Array of colossal graviton emitters pointed towards the northern crust.",
                material: "chrome / plasmaMat",
                function: "Pulls massive continental plates upwards into the processing kilns.",
                assemblyOrder: 8,
                connections: ["Equatorial Plasma Containment Ring", "Matter-Energy Conversion Matrix"],
                failureEffect: "Crustal plates fall back, causing massive seismic shockwaves.",
                cascadeFailures: ["Primary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 250, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = planetRadius * 1.2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = planetRadius * 0.8;
                    
                    const arrayGeom = new THREE.CylinderGeometry(8, 4, 30, 32);
                    const arrayMesh = new THREE.Mesh(arrayGeom, chrome);
                    arrayMesh.position.set(x, y, z);
                    arrayMesh.lookAt(0, 0, 0);
                    arrayMesh.rotation.x += Math.PI / 2;
                    
                    const beamCoreGeom = new THREE.CylinderGeometry(2, 2, 40, 16);
                    const beamCore = new THREE.Mesh(beamCoreGeom, plasmaMat);
                    beamCore.position.y = -20;
                    arrayMesh.add(beamCore);
                    
                    g.add(arrayMesh);
                    meshes.tractorArrays.push(arrayMesh);
                }
                return g;
            }
        },
        {
            name: "Southern Hemisphere Tractor Array",
            metadata: {
                name: "Southern Hemisphere Tractor Array",
                description: "Mirrored graviton emitter array for the southern hemisphere.",
                material: "chrome / plasmaMat",
                function: "Pulls southern continental plates into processing.",
                assemblyOrder: 9,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Symmetrical gravity imbalance.",
                cascadeFailures: ["Secondary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: -250, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = planetRadius * 1.2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = -planetRadius * 0.8;
                    
                    const arrayGeom = new THREE.CylinderGeometry(8, 4, 30, 32);
                    const arrayMesh = new THREE.Mesh(arrayGeom, chrome);
                    arrayMesh.position.set(x, y, z);
                    arrayMesh.lookAt(0, 0, 0);
                    arrayMesh.rotation.x += Math.PI / 2;
                    g.add(arrayMesh);
                }
                return g;
            }
        },
        {
            name: "Primary Lithosphere Grinder",
            metadata: {
                name: "Primary Lithosphere Grinder",
                description: "A terrifyingly massive mechanical claw equipped with mono-molecular teeth, capable of chewing through tectonic plates.",
                material: "darkSteel / chrome",
                function: "Mechanical physical breakdown of the planetary crust.",
                assemblyOrder: 10,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Jamming of the mechanical processing line.",
                cascadeFailures: ["Tertiary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 300, y: 0, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const armGroup = new THREE.Group();
                
                // Base
                const baseGeom = new THREE.BoxGeometry(20, 20, 20);
                const base = new THREE.Mesh(baseGeom, darkSteel);
                base.position.set(planetRadius * 1.5, 0, 0);
                armGroup.add(base);
                
                // Articulated Arm
                const armGeom = new THREE.CylinderGeometry(6, 6, 60, 32);
                const arm = new THREE.Mesh(armGeom, chrome);
                arm.rotation.z = Math.PI / 2;
                arm.position.set(planetRadius * 1.5 - 30, 0, 0);
                armGroup.add(arm);
                
                // Grinder Head
                const shape = createGearShape(12, 18, 12);
                const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
                const headGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const head = new THREE.Mesh(headGeom, steel);
                head.rotation.y = Math.PI / 2;
                head.position.set(planetRadius * 1.5 - 60, 0, -5);
                armGroup.add(head);
                
                g.add(armGroup);
                meshes.grinders.push({ mesh: armGroup, head: head, baseAngle: 0 });
                return g;
            }
        },
        {
            name: "Secondary Lithosphere Grinder",
            metadata: {
                name: "Secondary Lithosphere Grinder",
                description: "Twin to the primary grinder, positioned at 120 degrees.",
                material: "darkSteel / chrome",
                function: "Mechanical physical breakdown of the planetary crust.",
                assemblyOrder: 11,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Reduced crust processing speed.",
                cascadeFailures: ["Primary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: -150, y: 0, z: 260 }
            },
            build: () => {
                const g = new THREE.Group();
                const armGroup = new THREE.Group();
                armGroup.rotation.y = Math.PI * 2 / 3;
                
                const baseGeom = new THREE.BoxGeometry(20, 20, 20);
                const base = new THREE.Mesh(baseGeom, darkSteel);
                base.position.set(planetRadius * 1.5, 0, 0);
                armGroup.add(base);
                
                const armGeom = new THREE.CylinderGeometry(6, 6, 60, 32);
                const arm = new THREE.Mesh(armGeom, chrome);
                arm.rotation.z = Math.PI / 2;
                arm.position.set(planetRadius * 1.5 - 30, 0, 0);
                armGroup.add(arm);
                
                const shape = createGearShape(12, 18, 12);
                const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
                const headGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const head = new THREE.Mesh(headGeom, steel);
                head.rotation.y = Math.PI / 2;
                head.position.set(planetRadius * 1.5 - 60, 0, -5);
                armGroup.add(head);
                
                g.add(armGroup);
                meshes.grinders.push({ mesh: armGroup, head: head, baseAngle: Math.PI * 2 / 3 });
                return g;
            }
        },
        {
            name: "Tertiary Lithosphere Grinder",
            metadata: {
                name: "Tertiary Lithosphere Grinder",
                description: "The final grinder in the triad, completing the global mechanical processing network.",
                material: "darkSteel / chrome",
                function: "Mechanical physical breakdown of the planetary crust.",
                assemblyOrder: 12,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Reduced crust processing speed.",
                cascadeFailures: ["Secondary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: -150, y: 0, z: -260 }
            },
            build: () => {
                const g = new THREE.Group();
                const armGroup = new THREE.Group();
                armGroup.rotation.y = Math.PI * 4 / 3;
                
                const baseGeom = new THREE.BoxGeometry(20, 20, 20);
                const base = new THREE.Mesh(baseGeom, darkSteel);
                base.position.set(planetRadius * 1.5, 0, 0);
                armGroup.add(base);
                
                const armGeom = new THREE.CylinderGeometry(6, 6, 60, 32);
                const arm = new THREE.Mesh(armGeom, chrome);
                arm.rotation.z = Math.PI / 2;
                arm.position.set(planetRadius * 1.5 - 30, 0, 0);
                armGroup.add(arm);
                
                const shape = createGearShape(12, 18, 12);
                const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
                const headGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const head = new THREE.Mesh(headGeom, steel);
                head.rotation.y = Math.PI / 2;
                head.position.set(planetRadius * 1.5 - 60, 0, -5);
                armGroup.add(head);
                
                g.add(armGroup);
                meshes.grinders.push({ mesh: armGroup, head: head, baseAngle: Math.PI * 4 / 3 });
                return g;
            }
        },
        {
            name: "Matter-Energy Conversion Matrix",
            metadata: {
                name: "Matter-Energy Conversion Matrix",
                description: "A colossal, multi-dimensional array hovering far above the north pole. It physically breaks down baryonic matter into pure energy using induced localized singularities.",
                material: "chrome / plasmaMat",
                function: "Total conversion of planetary mass into harvestable energy.",
                assemblyOrder: 13,
                connections: ["Central Singularity Core", "Core Extraction Syphon"],
                failureEffect: "Spontaneous matter-antimatter annihilation and absolute destruction of the Engine.",
                cascadeFailures: ["All"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 400, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                g.position.set(0, planetRadius * 3, 0);
                meshes.conversionMatrix = g;
                
                const baseGeom = new THREE.CylinderGeometry(40, 20, 20, 64);
                const base = new THREE.Mesh(baseGeom, darkSteel);
                g.add(base);
                
                for (let i = 0; i < 5; i++) {
                    const ringGeom = new THREE.TorusGeometry(50 + i * 15, 3, 32, 128);
                    const ring = new THREE.Mesh(ringGeom, chrome);
                    ring.rotation.x = Math.PI / 2;
                    meshes.conversionRings.push({ mesh: ring, speed: (i % 2 === 0 ? 0.02 : -0.02) * (i + 1) });
                    g.add(ring);
                    
                    for (let j = 0; j < 12; j++) {
                        const nodeGeom = new THREE.SphereGeometry(4, 32, 32);
                        const node = new THREE.Mesh(nodeGeom, plasmaMat);
                        const angle = (j / 12) * Math.PI * 2;
                        node.position.set(Math.cos(angle) * (50 + i * 15), 0, Math.sin(angle) * (50 + i * 15));
                        ring.add(node);
                    }
                }
                
                // Central beam shooting down to planet
                const beamGeom = new THREE.CylinderGeometry(10, 10, planetRadius * 3, 32);
                const beam = new THREE.Mesh(beamGeom, laserMat);
                beam.position.y = -planetRadius * 1.5;
                g.add(beam);
                
                return g;
            }
        },
        {
            name: "Dark Energy Coolant Vents",
            metadata: {
                name: "Dark Energy Coolant Vents",
                description: "Massive thermal exhaust ports venting excess heat into sub-space dimensions.",
                material: "darkEnergyMat",
                function: "Prevents the Conversion Matrix from melting down.",
                assemblyOrder: 14,
                connections: ["Matter-Energy Conversion Matrix"],
                failureEffect: "Thermal runaway.",
                cascadeFailures: ["Matter-Energy Conversion Matrix"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 450, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                g.position.set(0, planetRadius * 3 + 20, 0);
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const ventGeom = new THREE.ConeGeometry(8, 30, 16);
                    const vent = new THREE.Mesh(ventGeom, darkEnergyMat);
                    vent.position.set(Math.cos(angle) * 30, 15, Math.sin(angle) * 30);
                    vent.rotation.x = -Math.PI / 4;
                    vent.rotation.y = -angle;
                    g.add(vent);
                    meshes.coolantVents.push(vent);
                }
                return g;
            }
        },
        {
            name: "Antimatter Injection Valves",
            metadata: {
                name: "Antimatter Injection Valves",
                description: "Precision valves pumping anti-hydrogen into the core to catalyze singularity formation.",
                material: "antimatterMat / steel",
                function: "Catalyzes the breakdown of highly dense core materials.",
                assemblyOrder: 15,
                connections: ["Core Extraction Syphon"],
                failureEffect: "Loss of singularity confinement.",
                cascadeFailures: ["Central Singularity Core"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: -300, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                g.position.set(0, -planetRadius * 2, 0);
                const baseGeom = new THREE.TorusGeometry(30, 8, 32, 64);
                const base = new THREE.Mesh(baseGeom, antimatterMat);
                base.rotation.x = Math.PI / 2;
                g.add(base);
                
                // Injector pins
                for(let i=0; i<8; i++){
                    const pinGeom = new THREE.CylinderGeometry(2, 2, 40, 16);
                    const pin = new THREE.Mesh(pinGeom, steel);
                    const angle = (i/8)*Math.PI*2;
                    pin.position.set(Math.cos(angle)*30, 20, Math.sin(angle)*30);
                    pin.lookAt(0, 40, 0);
                    pin.rotation.x -= Math.PI/2;
                    g.add(pin);
                }
                return g;
            }
        },
        {
            name: "Planetary Fracturing Laser",
            metadata: {
                name: "Planetary Fracturing Laser",
                description: "An array of hyper-lasers that cut deep tectonic fault lines into the planet to ease mechanical grinding.",
                material: "laserMat",
                function: "Slices the planet into digestible chunks.",
                assemblyOrder: 16,
                connections: ["Equatorial Plasma Containment Ring"],
                failureEffect: "Grinders must work at 400% capacity.",
                cascadeFailures: ["Primary Lithosphere Grinder", "Secondary Lithosphere Grinder"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 0, z: 350 }
            },
            build: () => {
                const g = new THREE.Group();
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
                    const laserHousingGeom = new THREE.BoxGeometry(10, 30, 10);
                    const laserHousing = new THREE.Mesh(laserHousingGeom, darkSteel);
                    laserHousing.position.set(Math.cos(angle) * planetRadius * 2, 0, Math.sin(angle) * planetRadius * 2);
                    laserHousing.lookAt(0,0,0);
                    
                    const beamGeom = new THREE.CylinderGeometry(1, 1, planetRadius * 2, 16);
                    const beam = new THREE.Mesh(beamGeom, laserMat);
                    beam.rotation.x = Math.PI / 2;
                    beam.position.z = -planetRadius;
                    laserHousing.add(beam);
                    
                    g.add(laserHousing);
                    meshes.lasers.push(laserHousing);
                }
                return g;
            }
        },
        {
            name: "Core Extraction Syphon",
            metadata: {
                name: "Core Extraction Syphon",
                description: "A massive, drill-like conduit extending from the south pole directly into the planet's core.",
                material: "chrome / coreMat",
                function: "Siphons the liquid iron-nickel core up to the conversion matrix.",
                assemblyOrder: 17,
                connections: ["Central Singularity Core", "Antimatter Injection Valves"],
                failureEffect: "Core solidification, rendering matter extraction impossible.",
                cascadeFailures: ["Matter-Energy Conversion Matrix"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: -400, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const syphonGeom = createEnergyConduitGeometry(planetRadius * 2, 64, 15, 5, 10);
                const syphon = new THREE.Mesh(syphonGeom, chrome);
                syphon.position.y = -planetRadius;
                g.add(syphon);
                
                const innerSyphonGeom = new THREE.CylinderGeometry(8, 8, planetRadius * 2, 32);
                const innerSyphon = new THREE.Mesh(innerSyphonGeom, coreMat);
                innerSyphon.position.y = -planetRadius;
                g.add(innerSyphon);
                
                return g;
            }
        },
        {
            name: "Sub-space Communication Array",
            metadata: {
                name: "Sub-space Communication Array",
                description: "A delicate array of antennas using quantum entanglement for zero-latency communication with the fleet.",
                material: "glass / steel",
                function: "Transmits telemetry and energy yields.",
                assemblyOrder: 18,
                connections: ["Command and Control Citadel"],
                failureEffect: "Loss of remote control and monitoring.",
                cascadeFailures: [],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 100, y: 500, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                g.position.set(planetRadius * 1.5, planetRadius * 2, 0);
                
                const dishGeom = new THREE.SphereGeometry(15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
                const dish = new THREE.Mesh(dishGeom, glass);
                dish.material.side = THREE.DoubleSide;
                dish.rotation.x = Math.PI / 2;
                g.add(dish);
                
                const spireGeom = new THREE.CylinderGeometry(1, 0.1, 30, 16);
                const spire = new THREE.Mesh(spireGeom, steel);
                spire.position.y = 15;
                g.add(spire);
                
                return g;
            }
        },
        {
            name: "Command and Control Citadel",
            metadata: {
                name: "Command and Control Citadel",
                description: "The heavily armored, shielded hub where the god-tier AI oversees the planetary conversion process.",
                material: "darkSteel / tinted",
                function: "Provides computational oversight for billions of concurrent micro-adjustments in the gravity fields.",
                assemblyOrder: 19,
                connections: ["Matter-Energy Conversion Matrix", "Sub-space Communication Array"],
                failureEffect: "AI fragmentation, Engine goes rogue.",
                cascadeFailures: ["All"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: -100, y: 500, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                g.position.set(-planetRadius * 1.5, planetRadius * 2, 0);
                
                const hullGeom = new THREE.OctahedronGeometry(20, 1);
                const hull = new THREE.Mesh(hullGeom, darkSteel);
                g.add(hull);
                
                const windowGeom = new THREE.OctahedronGeometry(20.5, 1);
                const window = new THREE.Mesh(windowGeom, tinted);
                window.material.transparent = true;
                window.material.opacity = 0.7;
                g.add(window);
                
                return g;
            }
        },
        {
            name: "Ambient Particle Dissolver Field",
            metadata: {
                name: "Ambient Particle Dissolver Field",
                description: "A localized energy field that vaporizes microscopic planetary dust, converting it directly into the particle stream flowing to the matrix.",
                material: "plasmaMat",
                function: "Scavenges the remaining 0.001% of planetary mass floating as dust.",
                assemblyOrder: 20,
                connections: ["Matter-Energy Conversion Matrix"],
                failureEffect: "Kessler syndrome within the Engine's local space.",
                cascadeFailures: ["Sub-space Communication Array"],
                originalPosition: { x: 0, y: 0, z: 0 },
                explodedPosition: { x: 0, y: 0, z: 0 }
            },
            build: () => {
                const g = new THREE.Group();
                const particleCount = 60000;
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(particleCount * 3);
                const velocities = new Float32Array(particleCount * 3);
                
                for (let i = 0; i < particleCount; i++) {
                    const x = (Math.random() - 0.5) * 400;
                    const y = (Math.random() - 0.5) * 400;
                    const z = (Math.random() - 0.5) * 400;
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;
                    
                    velocities[i * 3] = (Math.random() - 0.5) * 3;
                    velocities[i * 3 + 1] = Math.random() * 8 + 2; 
                    velocities[i * 3 + 2] = (Math.random() - 0.5) * 3;
                }
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const particleMat = new THREE.PointsMaterial({
                    color: 0xffaa00,
                    size: 0.8,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                
                const particles = new THREE.Points(geometry, particleMat);
                meshes.particleSystem = particles;
                meshes.particleVelocities = velocities;
                g.add(particles);
                
                return g;
            }
        }
    ];

    // ==========================================
    // ASSEMBLY
    // ==========================================
    
    // Execute the builders and populate the standard EngiSim parts array.
    partDefinitions.forEach(def => {
        parts.push(def.metadata);
        const meshGroup = def.build();
        meshGroup.userData.name = def.name;
        group.add(meshGroup);
    });

    // ==========================================
    // METADATA & QUIZ
    // ==========================================

    const description = "THE GALACTUS ENGINE (GOD TIER PLANETARY CONVERTER)\n\n" +
        "A hyper-advanced, Class-3 Kardashev scale megastructure engineered for the systematic deconstruction and energy conversion of entire planetary bodies. " +
        "Operating on principles of localized gravity manipulation, quantum tunneling fragmentation, and controlled microscopic singularity induction, the Engine wraps itself around a target world. " +
        "Massive lithospheric grinders tear through the crust and mantle, while hyper-charged plasma containment rings prevent catastrophic premature fragmentation. " +
        "At the core of the machine lies the Matter-Energy Conversion Matrix, utilizing artificially induced Hawking radiation from contained micro-black holes to convert baryonic matter into pure, harnessable energy with 99.999% efficiency.";

    const quizQuestions = [
        {
            question: "Given an Earth-mass planet of mass M and radius R, the Galactus Engine must theoretically overcome its gravitational binding energy to dismantle it. If the Engine utilizes antimatter-catalyzed microscopic black holes to achieve this, which formula best describes the minimum energy threshold (U) required, and what happens to the localized Kerr metric spin parameter (a) as the core is breached?",
            options: [
                "U = 3GM^2 / 5R, and the spin parameter 'a' approaches 1 as angular momentum is conserved in the newly formed singularity.",
                "U = GMm / R, and 'a' approaches 0 due to the isotropic mass distribution of the collapsing core.",
                "U = mc^2, and 'a' becomes undefined because the event horizon expands infinitely.",
                "U = 3GM^2 / 5R, and 'a' becomes negative, indicating a spontaneous reversal of the planet's rotation."
            ],
            correctAnswerIndex: 0,
            explanation: "The gravitational binding energy of a uniform sphere is 3GM^2 / 5R. As the engine collapses the core into a microscopic black hole, the conservation of the planet's immense angular momentum forces the spin parameter 'a' of the resulting Kerr black hole to approach its maximal theoretical limit of 1."
        },
        {
            question: "During the operation of the Matter-Energy Conversion Matrix, baryonic matter is accelerated into an induced micro-singularity. According to the Bekenstein-Hawking entropy formula (S = k_B * A / 4 * l_P^2), how does the Engine prevent the singularity's event horizon area (A) from growing out of control and consuming the Engine itself?",
            options: [
                "By continuously feeding it dark energy to cool the singularity, artificially decreasing its mass.",
                "By matching the matter inflow rate exactly with the Hawking radiation emission rate, maintaining a stable, microscopic equilibrium mass.",
                "By encasing the singularity in a Faraday cage made of darkSteel.",
                "By rotating the singularity at super-luminal speeds, violating the weak energy condition."
            ],
            correctAnswerIndex: 1,
            explanation: "To prevent the black hole from growing and consuming the Engine, the system must maintain a precise equilibrium where the mass injected (matter inflow) is perfectly balanced by the mass lost through Hawking radiation emission."
        },
        {
            question: "The Equatorial Plasma Containment Ring projects a unifying gravimetric field. If this field suddenly failed, the planetary crust would undergo explosive decompression due to the release of mantle pressure. Which fluid dynamics principle best models the initial velocity of the ejected magma?",
            options: [
                "Bernoulli's principle, specifically Torricelli's Law (v = √(2gh)), modified for immense pressure differentials.",
                "Navier-Stokes equations for incompressible laminar flow.",
                "Archimedes' principle of buoyancy.",
                "Boyle's Law for ideal gases."
            ],
            correctAnswerIndex: 0,
            explanation: "Torricelli's law, derived from Bernoulli's principle, describes the velocity of fluid flowing out of an opening under pressure. In a catastrophic failure, the immense pressure of the mantle acts as the driving force for the magma ejection."
        },
        {
            question: "The Sub-space Communication Array utilizes quantum entanglement for zero-latency telemetry. If the Engine is converting matter at a rate of 10^20 kg/s, generating immense gravitational waves, how does the Engine maintain quantum coherence in the entangled particles?",
            options: [
                "It cannot; quantum coherence is always destroyed by gravity.",
                "By isolating the quantum state within a topological phase of matter that is impervious to local metric perturbations.",
                "By transmitting the data faster than the gravitational waves propagate.",
                "By using classical radio waves as a backup."
            ],
            correctAnswerIndex: 1,
            explanation: "Topological quantum computing uses quasiparticles (like anyons) whose quantum states depend on global topological properties rather than local geometry, making them highly resistant to local perturbations like intense gravitational waves."
        },
        {
            question: "The Planetary Fracturing Lasers emit photons with energy E = hc/λ. To effectively cleave the silicate crust (SiO2), the laser must break molecular bonds. If the bond dissociation energy of an Si-O bond is roughly 800 kJ/mol, what region of the electromagnetic spectrum must the individual photons belong to in order to photo-dissociate the bonds directly?",
            options: [
                "Microwave (λ ~ 1 mm)",
                "Infrared (λ ~ 10 μm)",
                "Visible Red (λ ~ 700 nm)",
                "Ultraviolet (λ < 150 nm)"
            ],
            correctAnswerIndex: 3,
            explanation: "800 kJ/mol equates to about 8.3 eV per bond. Photons with 8.3 eV of energy correspond to a wavelength of approximately 150 nm, which falls well into the ultraviolet (UV) region of the spectrum."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    
    function animate(time, speed) {
        const delta = speed * 0.01;
        const slowTime = time * 0.5;

        // 1. Core and Mantle Pulsation
        if (meshes.core) {
            meshes.core.rotation.y += delta * 0.5;
            meshes.core.rotation.z += delta * 0.3;
            // Intense pulsing effect
            meshes.core.material.emissiveIntensity = 5.0 + Math.sin(time * 8) * 2.0;
        }

        if (meshes.mantle) {
            meshes.mantle.rotation.x += delta * 0.1;
            meshes.mantle.rotation.y -= delta * 0.15;
            // Magma churning effect via scale breathing
            meshes.mantle.scale.setScalar(1.0 + Math.sin(time * 2) * 0.015);
        }

        // 2. Disintegrating Planetary Crust
        if (meshes.shards && meshes.shards.length > 0) {
            for (let i = 0; i < meshes.shards.length; i++) {
                const shard = meshes.shards[i];
                // Introduce a delay based on original position to stagger destruction
                if (shard.userData.detached && time * 10 > shard.userData.delay) {
                    // Move outwards
                    shard.position.add(shard.userData.velocity.clone().multiplyScalar(delta * 15));
                    // Spin chaotically
                    shard.rotation.x += shard.userData.rotSpeed.x * delta * 20;
                    shard.rotation.y += shard.userData.rotSpeed.y * delta * 20;
                    shard.rotation.z += shard.userData.rotSpeed.z * delta * 20;
                    
                    // Gravitational pull upwards towards the Conversion Matrix (y = 400)
                    const target = new THREE.Vector3(0, 400, 0);
                    const dir = target.sub(shard.position).normalize();
                    // Accelerate towards matrix
                    shard.userData.velocity.add(dir.multiplyScalar(delta * 0.8));
                    
                    // If a shard reaches the matrix or goes too far, reset it (simulates continuous consumption)
                    if (shard.position.y > 380 || shard.position.length() > planetRadius * 6) {
                        shard.position.copy(shard.userData.originalPos);
                        shard.userData.velocity.copy(shard.userData.originalPos).normalize().multiplyScalar(Math.random() * 0.4 + 0.05);
                        shard.userData.detached = Math.random() > 0.2; // 80% chance to detach again
                    }
                }
            }
        }

        // 3. Containment Ring Rotation
        meshes.rings.forEach(ringObj => {
            if (ringObj.axis === 'x') ringObj.mesh.rotation.x += ringObj.speed * delta * 10;
            if (ringObj.axis === 'y') ringObj.mesh.rotation.y += ringObj.speed * delta * 10;
            if (ringObj.axis === 'z') ringObj.mesh.rotation.z += ringObj.speed * delta * 10;
        });

        // 4. Lithosphere Grinder Articulation
        meshes.grinders.forEach((grinder, index) => {
            // Oscillate the base angle slightly to simulate chewing
            const chewAngle = Math.sin(time * 5 + index) * 0.1;
            grinder.mesh.rotation.y = grinder.baseAngle + chewAngle;
            
            // Spin the mono-molecular grinder head rapidly
            grinder.head.rotation.z += delta * 5.0;
            
            // Plunge the grinder in and out of the crust
            const plunge = Math.sin(time * 2 + index * Math.PI) * 10;
            grinder.mesh.position.set(0, 0, 0); // Reset base
            // Move along the local X axis (towards planet center)
            const dir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), grinder.baseAngle);
            grinder.mesh.position.add(dir.multiplyScalar(plunge));
        });

        // 5. Conversion Matrix Dynamics
        if (meshes.conversionMatrix) {
            meshes.conversionMatrix.rotation.y += delta * 0.2;
            meshes.conversionRings.forEach(ringObj => {
                ringObj.mesh.rotation.z += ringObj.speed * delta * 20;
            });
        }

        // 6. Laser Sweeping
        meshes.lasers.forEach((laser, index) => {
            // Lasers sweep across the planet surface
            laser.rotation.x = Math.sin(time * 3 + index) * 0.2;
            laser.rotation.z = Math.cos(time * 2 + index) * 0.2;
        });
        
        // 7. Coolant Vents Venting (Scale pulsing)
        meshes.coolantVents.forEach((vent, index) => {
            vent.scale.set(1 + Math.sin(time * 10 + index)*0.1, 1, 1 + Math.sin(time * 10 + index)*0.1);
        });

        // 8. Massive Particle System (100,000 points)
        if (meshes.particleSystem) {
            const positions = meshes.particleSystem.geometry.attributes.position.array;
            const vels = meshes.particleVelocities;
            
            for (let i = 0; i < 60000; i++) {
                const i3 = i * 3;
                positions[i3] += vels[i3] * delta * 5;
                positions[i3+1] += vels[i3+1] * delta * 5;
                positions[i3+2] += vels[i3+2] * delta * 5;

                // Vortex effect drawing particles into the upper Conversion Matrix
                const px = positions[i3];
                const py = positions[i3+1];
                const pz = positions[i3+2];
                
                // Centripetal pull towards Y axis
                vels[i3] -= (px * 0.001) * delta * 10;
                vels[i3+2] -= (pz * 0.001) * delta * 10;

                // Reset particles that reach the top or go out of bounds
                if (py > 400 || py < -400 || Math.abs(px) > 500 || Math.abs(pz) > 500) {
                    positions[i3] = (Math.random() - 0.5) * 400;
                    positions[i3+1] = (Math.random() - 0.5) * 400 - 100; // spawn lower
                    positions[i3+2] = (Math.random() - 0.5) * 400;
                    
                    vels[i3] = (Math.random() - 0.5) * 3;
                    vels[i3+1] = Math.random() * 8 + 2; 
                    vels[i3+2] = (Math.random() - 0.5) * 3;
                }
            }
            meshes.particleSystem.geometry.attributes.position.needsUpdate = true;
            
            // Pulse particle material opacity and color
            meshes.particleSystem.material.opacity = 0.5 + Math.sin(time * 4) * 0.3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
