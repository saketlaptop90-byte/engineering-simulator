import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    const description = "Kardashev Type III Megastructure (Ultra God Tier): A galactic-scale engineering marvel capable of harnessing the energy output of an entire galaxy. Features a central supermassive black hole energy extraction mechanism (Penrose process), a hyper-complex web of energy conduits tapping into billions of Dyson swarms, and massive Hyperspatial Traction Wheels (stellar engine tires) with aggressive treads to maneuver the galaxy through the cosmos.";

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const singularityMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.0, metalness: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.0 });
    const eventHorizonMaterial = new THREE.MeshStandardMaterial({ color: 0x110022, emissive: 0x220044, emissiveIntensity: 2, wireframe: true, transparent: true, opacity: 0.3 });
    const photonSphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff3300, emissiveIntensity: 8, transparent: true, opacity: 0.9 });
    const accretionDiskMaterialInner = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00ffff, emissiveIntensity: 5, side: THREE.DoubleSide });
    const accretionDiskMaterialOuter = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff1100, emissiveIntensity: 2, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const jetMaterial = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0x5500ff, emissiveIntensity: 10, transparent: true, opacity: 0.8 });
    const conduitMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffee, emissive: 0x0088ff, emissiveIntensity: 1.5, transmission: 0.9, opacity: 1, metalness: 0.8, roughness: 0.1 });
    const frameworkMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.4, wireframe: false });
    const neonGridMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 4, wireframe: true });
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
    const dysonSwarmMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1.0, roughness: 0.2, emissive: 0x0055ff, emissiveIntensity: 0.5 });
    const darkEnergyMaterial = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.8, emissive: 0x200050, emissiveIntensity: 0.2 });
    
    // Combining imported materials for specific use cases
    const tireRubberMaterial = rubber; // From imports
    const rimChromeMaterial = chrome; // From imports
    const chassisSteelMaterial = darkSteel; // From imports
    const tintedGlassMaterial = tinted; // From imports
    
    // ==========================================
    // EXTENSIVE PARTS DEFINITION (25 Parts)
    // ==========================================
    const defineParts = () => {
        parts.push({
            name: "Core Singularity Containment",
            description: "The absolute center. Harnesses the gravitational singularity.",
            material: "singularityMaterial",
            function: "Anchors the entire galactic structure and provides infinite density metrics.",
            assemblyOrder: 1,
            connections: ["Event Horizon Tether System"],
            failureEffect: "Spontaneous spaghettification of the central quadrant.",
            cascadeFailures: ["Accretion Disk Harvester"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        });

        parts.push({
            name: "Event Horizon Tether System",
            description: "A hyper-dimensional wireframe mesh stabilizing the event horizon.",
            material: "eventHorizonMaterial",
            function: "Prevents hawking radiation leakage and extracts zero-point energy.",
            assemblyOrder: 2,
            connections: ["Core Singularity Containment", "Photon Sphere Extractor"],
            failureEffect: "Event horizon expansion, engulfing inner harvesters.",
            cascadeFailures: ["Photon Sphere Extractor"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 200, z: 0 }
        });

        parts.push({
            name: "Photon Sphere Extractor",
            description: "Captures trapped light orbiting the black hole.",
            material: "photonSphereMaterial",
            function: "Converts infinite orbital photons into usable plasma streams.",
            assemblyOrder: 3,
            connections: ["Event Horizon Tether System", "Accretion Disk Harvester Inner"],
            failureEffect: "Blinding flash of trapped light escaping into the galaxy.",
            cascadeFailures: ["Accretion Disk Harvester Inner"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -200, z: 0 }
        });

        parts.push({
            name: "Accretion Disk Harvester Inner",
            description: "A dense ring of super-heated plasma siphons.",
            material: "accretionDiskMaterialInner",
            function: "Collects 90% of the energy from infalling matter.",
            assemblyOrder: 4,
            connections: ["Photon Sphere Extractor", "Accretion Disk Harvester Outer"],
            failureEffect: "Plasma eruption.",
            cascadeFailures: ["Accretion Disk Harvester Outer", "Polar Jet Magnetic Funnel North"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 400, y: 0, z: 0 }
        });

        parts.push({
            name: "Accretion Disk Harvester Outer",
            description: "The cooler, broader expanse of the accretion disk infrastructure.",
            material: "accretionDiskMaterialOuter",
            function: "Pre-processes stellar material before it reaches the inner disk.",
            assemblyOrder: 5,
            connections: ["Accretion Disk Harvester Inner", "Supermassive Energy Conduit Alpha"],
            failureEffect: "Loss of matter stream stabilization.",
            cascadeFailures: ["Supermassive Energy Conduit Alpha"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -400, y: 0, z: 0 }
        });

        parts.push({
            name: "Polar Jet Magnetic Funnel North",
            description: "Colossal magnetic coils channeling the north relativistic jet.",
            material: "jetMaterial",
            function: "Harvests kinetic energy from the black hole's relativistic jets.",
            assemblyOrder: 6,
            connections: ["Accretion Disk Harvester Inner", "Interstellar Power Transmission Grid"],
            failureEffect: "Jet stream breaches containment, destroying the northern galactic hemisphere.",
            cascadeFailures: ["Interstellar Power Transmission Grid"],
            originalPosition: { x: 0, y: 50, z: 0 },
            explodedPosition: { x: 0, y: 800, z: 0 }
        });

        parts.push({
            name: "Polar Jet Magnetic Funnel South",
            description: "Colossal magnetic coils channeling the south relativistic jet.",
            material: "jetMaterial",
            function: "Harvests kinetic energy from the black hole's relativistic jets.",
            assemblyOrder: 7,
            connections: ["Accretion Disk Harvester Inner", "Interstellar Power Transmission Grid"],
            failureEffect: "Jet stream breaches containment, destroying the southern galactic hemisphere.",
            cascadeFailures: ["Interstellar Power Transmission Grid"],
            originalPosition: { x: 0, y: -50, z: 0 },
            explodedPosition: { x: 0, y: -800, z: 0 }
        });

        parts.push({
            name: "Galactic Core Dyson Sphere Framework",
            description: "The primary structural lattice encompassing the galactic core.",
            material: "frameworkMaterial",
            function: "Provides physical mounting points for conduits and harvesters.",
            assemblyOrder: 8,
            connections: ["Accretion Disk Harvester Outer", "Dark Matter Stabilization Struts"],
            failureEffect: "Structural collapse of the core containment.",
            cascadeFailures: ["All Core Systems"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 500 }
        });

        parts.push({
            name: "Supermassive Energy Conduit Alpha",
            description: "Primary energy artery running along the Perseus Arm.",
            material: "conduitMaterial",
            function: "Transmits raw energy from the core to the outer spiral arms.",
            assemblyOrder: 9,
            connections: ["Galactic Core Dyson Sphere Framework", "Spiral Arm Dyson Swarm Nodes"],
            failureEffect: "Energy bottleneck leading to core overload.",
            cascadeFailures: ["Spiral Arm Dyson Swarm Nodes"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 600, y: 200, z: 200 }
        });

        parts.push({
            name: "Supermassive Energy Conduit Beta",
            description: "Secondary energy artery running along the Scutum-Centaurus Arm.",
            material: "conduitMaterial",
            function: "Balances the galactic energy load.",
            assemblyOrder: 10,
            connections: ["Galactic Core Dyson Sphere Framework", "Spiral Arm Dyson Swarm Nodes"],
            failureEffect: "Energy bottleneck leading to core overload.",
            cascadeFailures: ["Spiral Arm Dyson Swarm Nodes"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -600, y: -200, z: -200 }
        });

        parts.push({
            name: "Spiral Arm Dyson Swarm Nodes",
            description: "Billions of stellar harvesters deployed around stars.",
            material: "dysonSwarmMaterial",
            function: "Drains main-sequence stars of their output.",
            assemblyOrder: 11,
            connections: ["Supermassive Energy Conduit Alpha", "Supermassive Energy Conduit Beta"],
            failureEffect: "Local stellar populations go supernova.",
            cascadeFailures: ["Interstellar Power Transmission Grid"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 1000, y: 0, z: 1000 }
        });
        
        parts.push({
            name: "Interstellar Power Transmission Grid",
            description: "A neon-glowing web of quantum entanglement relays.",
            material: "neonGridMaterial",
            function: "Distributes energy instantaneously across lightyears.",
            assemblyOrder: 12,
            connections: ["Spiral Arm Dyson Swarm Nodes", "Hyperspatial Energy Router Hub"],
            failureEffect: "Grid desynchronization.",
            cascadeFailures: ["Hyperspatial Energy Router Hub"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -1000, y: 0, z: -1000 }
        });

        parts.push({
            name: "Dark Matter Stabilization Struts",
            description: "Invisible but massive gravitational supports.",
            material: "darkEnergyMaterial",
            function: "Prevents the galaxy from flying apart under extreme rotation.",
            assemblyOrder: 13,
            connections: ["Galactic Core Dyson Sphere Framework"],
            failureEffect: "Galactic disintegration.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 1000, z: 0 }
        });

        parts.push({
            name: "Hyperspatial Traction Wheel Port",
            description: "Massive galactic tire providing thrust through dark energy manipulation.",
            material: "tireRubberMaterial",
            function: "Moves the entire galaxy through the local group.",
            assemblyOrder: 14,
            connections: ["Dark Matter Stabilization Struts"],
            failureEffect: "Loss of galactic steering.",
            cascadeFailures: ["Galactic Navigation"],
            originalPosition: { x: -300, y: 0, z: 0 },
            explodedPosition: { x: -1500, y: 500, z: 0 }
        });

        parts.push({
            name: "Hyperspatial Traction Wheel Starboard",
            description: "Massive galactic tire providing thrust through dark energy manipulation.",
            material: "tireRubberMaterial",
            function: "Moves the entire galaxy through the local group.",
            assemblyOrder: 15,
            connections: ["Dark Matter Stabilization Struts"],
            failureEffect: "Loss of galactic steering.",
            cascadeFailures: ["Galactic Navigation"],
            originalPosition: { x: 300, y: 0, z: 0 },
            explodedPosition: { x: 1500, y: 500, z: 0 }
        });

        parts.push({
            name: "Traction Wheel Rim Port",
            description: "Complex spoke array supporting the port traction wheel.",
            material: "rimChromeMaterial",
            function: "Transfers rotational torque from the core to the tires.",
            assemblyOrder: 16,
            connections: ["Hyperspatial Traction Wheel Port", "Galactic Core Dyson Sphere Framework"],
            failureEffect: "Wheel detachment.",
            cascadeFailures: ["Hyperspatial Traction Wheel Port"],
            originalPosition: { x: -300, y: 0, z: 0 },
            explodedPosition: { x: -1500, y: 500, z: 200 }
        });

        parts.push({
            name: "Traction Wheel Rim Starboard",
            description: "Complex spoke array supporting the starboard traction wheel.",
            material: "rimChromeMaterial",
            function: "Transfers rotational torque from the core to the tires.",
            assemblyOrder: 17,
            connections: ["Hyperspatial Traction Wheel Starboard", "Galactic Core Dyson Sphere Framework"],
            failureEffect: "Wheel detachment.",
            cascadeFailures: ["Hyperspatial Traction Wheel Starboard"],
            originalPosition: { x: 300, y: 0, z: 0 },
            explodedPosition: { x: 1500, y: 500, z: -200 }
        });

        parts.push({
            name: "Galactic Halo Sensor Array",
            description: "Spherical array of sensors monitoring intergalactic space.",
            material: "glass",
            function: "Early warning system for intergalactic threats.",
            assemblyOrder: 18,
            connections: ["Dark Matter Stabilization Struts"],
            failureEffect: "Blindness to incoming Andromeda galaxy.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -1000, z: 0 }
        });

        parts.push({
            name: "Megastructure AI Core Nexus",
            description: "The supreme intelligence coordinating the Type III civilization.",
            material: "tintedGlassMaterial",
            function: "Calculates orbital mechanics for 100 billion stars simultaneously.",
            assemblyOrder: 19,
            connections: ["Galactic Core Dyson Sphere Framework"],
            failureEffect: "Uncontrolled galactic chaos.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 150, z: 0 },
            explodedPosition: { x: 0, y: 1500, z: 0 }
        });

        parts.push({
            name: "Neutron Star Forge Manifolds",
            description: "Heavy element synthesizers.",
            material: "chassisSteelMaterial",
            function: "Crushes matter into degenerate states for construction materials.",
            assemblyOrder: 20,
            connections: ["Supermassive Energy Conduit Alpha"],
            failureEffect: "Loss of building materials.",
            cascadeFailures: [],
            originalPosition: { x: 150, y: -100, z: 150 },
            explodedPosition: { x: 800, y: -800, z: 800 }
        });

        parts.push({
            name: "Quantum Vacuum Tappers",
            description: "Extracts energy from the vacuum of space.",
            material: "conduitMaterial",
            function: "Provides auxiliary power when stellar output dips.",
            assemblyOrder: 21,
            connections: ["Interstellar Power Transmission Grid"],
            failureEffect: "Brownouts in outer spiral arms.",
            cascadeFailures: [],
            originalPosition: { x: -150, y: -100, z: -150 },
            explodedPosition: { x: -800, y: -800, z: -800 }
        });
        
        parts.push({
            name: "Antimatter Containment Silos",
            description: "Stores antimatter generated by the black hole jets.",
            material: "frameworkMaterial",
            function: "Fuel storage for the Hyperspatial Traction Wheels.",
            assemblyOrder: 22,
            connections: ["Polar Jet Magnetic Funnel North"],
            failureEffect: "Catastrophic matter-antimatter annihilation.",
            cascadeFailures: ["Everything in a 1000 lightyear radius"],
            originalPosition: { x: 0, y: 200, z: 100 },
            explodedPosition: { x: 0, y: 1200, z: 1000 }
        });
        
        parts.push({
            name: "Shkadov Thruster Arrays",
            description: "Asymmetric stellar reflectors.",
            material: "aluminum",
            function: "Directs stellar wind to generate net thrust for individual star systems.",
            assemblyOrder: 23,
            connections: ["Spiral Arm Dyson Swarm Nodes"],
            failureEffect: "Stars drift out of alignment.",
            cascadeFailures: ["Supermassive Energy Conduit Alpha"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -1200, y: 0, z: 1200 }
        });
        
        parts.push({
            name: "Penrose Process Energy Extractors",
            description: "Massive mechanical arms reaching into the ergosphere.",
            material: "copper",
            function: "Drops mass into the black hole and catches the fragmented escapees to harvest rotational energy.",
            assemblyOrder: 24,
            connections: ["Core Singularity Containment"],
            failureEffect: "Loss of primary rotational energy harvest.",
            cascadeFailures: ["Megastructure AI Core Nexus"],
            originalPosition: { x: 50, y: 0, z: 50 },
            explodedPosition: { x: 300, y: 300, z: 300 }
        });
        
        parts.push({
            name: "Ergosphere Super-Torus",
            description: "A gigantic ring sitting exactly on the static limit.",
            material: "eventHorizonMaterial",
            function: "Defines the boundary where space itself is dragged faster than light.",
            assemblyOrder: 25,
            connections: ["Core Singularity Containment"],
            failureEffect: "Frame-dragging anomalies.",
            cascadeFailures: ["Event Horizon Tether System"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -500 }
        });
    };
    defineParts();

    // ==========================================
    // GEOMETRY GENERATION FUNCTIONS
    // ==========================================

    const scale = 50; // Base scale multiplier for the galactic core

    // 1. Core Singularity & Event Horizon
    const createCore = () => {
        const singularityGeo = new THREE.SphereGeometry(1 * scale, 64, 64);
        const singularity = new THREE.Mesh(singularityGeo, singularityMaterial);
        group.add(singularity);

        const eventHorizonGeo = new THREE.IcosahedronGeometry(1.2 * scale, 4);
        const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMaterial);
        group.add(eventHorizon);
        
        const photonSphereGeo = new THREE.SphereGeometry(1.5 * scale, 64, 64);
        const photonSphere = new THREE.Mesh(photonSphereGeo, photonSphereMaterial);
        group.add(photonSphere);

        const ergosphereGeo = new THREE.TorusGeometry(1.8 * scale, 0.2 * scale, 32, 100);
        const ergosphere = new THREE.Mesh(ergosphereGeo, eventHorizonMaterial);
        ergosphere.rotation.x = Math.PI / 2;
        group.add(ergosphere);

        updatables.push({ mesh: eventHorizon, type: 'rotate', axis: 'y', speed: 0.05 });
        updatables.push({ mesh: photonSphere, type: 'rotate', axis: 'y', speed: -0.03 });
        updatables.push({ mesh: ergosphere, type: 'pulse', baseScale: 1, amplitude: 0.05, speed: 2 });
    };

    // 2. Accretion Disk
    const createAccretionDisk = () => {
        const innerDiskGeo = new THREE.RingGeometry(1.6 * scale, 3 * scale, 128, 32);
        const innerDisk = new THREE.Mesh(innerDiskGeo, accretionDiskMaterialInner);
        innerDisk.rotation.x = -Math.PI / 2;
        group.add(innerDisk);

        const outerDiskGeo = new THREE.RingGeometry(3 * scale, 7 * scale, 128, 32);
        const outerDisk = new THREE.Mesh(outerDiskGeo, accretionDiskMaterialOuter);
        outerDisk.rotation.x = -Math.PI / 2;
        group.add(outerDisk);

        // Add volumetric particles to disk
        const particleCount = 20000;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const colorInner = new THREE.Color(0xffffff);
        const colorOuter = new THREE.Color(0xff3300);

        for (let i = 0; i < particleCount; i++) {
            const radius = (1.6 + Math.random() * 5.4) * scale;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * (10 * scale / radius); // Thicker in middle, thinner at edges

            positions[i * 3] = radius * Math.cos(theta);
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = radius * Math.sin(theta);

            const mixedColor = colorInner.clone().lerp(colorOuter, (radius / scale - 1.6) / 5.4);
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMat = new THREE.PointsMaterial({ size: 0.5, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        const diskParticles = new THREE.Points(particleGeo, particleMat);
        group.add(diskParticles);

        updatables.push({ mesh: innerDisk, type: 'rotate', axis: 'z', speed: 0.08 }); // Ring rotated, so z is local y
        updatables.push({ mesh: outerDisk, type: 'rotate', axis: 'z', speed: 0.04 });
        updatables.push({ mesh: diskParticles, type: 'rotate', axis: 'y', speed: 0.05 });
    };

    // 3. Polar Jets
    const createPolarJets = () => {
        const jetGeo = new THREE.CylinderGeometry(0.1 * scale, 1.5 * scale, 20 * scale, 32, 1, true);
        
        const jetNorth = new THREE.Mesh(jetGeo, jetMaterial);
        jetNorth.position.y = 10 * scale;
        group.add(jetNorth);

        const jetSouth = new THREE.Mesh(jetGeo, jetMaterial);
        jetSouth.position.y = -10 * scale;
        jetSouth.rotation.x = Math.PI;
        group.add(jetSouth);

        // Jet Funnel Rings
        for(let i=0; i<10; i++) {
            const ringGeo = new THREE.TorusGeometry( (0.1 + i*0.14) * scale, 0.05*scale, 16, 64);
            const ringN = new THREE.Mesh(ringGeo, neonGridMaterial);
            ringN.position.y = (2 + i*1.8) * scale;
            ringN.rotation.x = Math.PI/2;
            group.add(ringN);
            
            const ringS = new THREE.Mesh(ringGeo, neonGridMaterial);
            ringS.position.y = -(2 + i*1.8) * scale;
            ringS.rotation.x = Math.PI/2;
            group.add(ringS);

            updatables.push({ mesh: ringN, type: 'pulse', baseScale: 1, amplitude: 0.1, speed: 5 + i });
            updatables.push({ mesh: ringS, type: 'pulse', baseScale: 1, amplitude: 0.1, speed: 5 + i });
        }

        updatables.push({ mesh: jetNorth, type: 'rotate', axis: 'y', speed: 0.2 });
        updatables.push({ mesh: jetSouth, type: 'rotate', axis: 'y', speed: 0.2 });
    };

    // 4. Energy Conduits & Framework
    const createConduits = () => {
        const frameworkGeo = new THREE.IcosahedronGeometry(8 * scale, 2);
        const framework = new THREE.Mesh(frameworkGeo, new THREE.MeshStandardMaterial({color:0x222222, wireframe: true, metalness: 1.0}));
        group.add(framework);
        updatables.push({ mesh: framework, type: 'rotate', axis: 'y', speed: 0.01 });
        updatables.push({ mesh: framework, type: 'rotate', axis: 'x', speed: 0.005 });

        // Complex spline tubes for conduits
        const numConduits = 12;
        for (let i = 0; i < numConduits; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(Math.cos(i) * 5*scale, Math.sin(i*2) * 2*scale, Math.sin(i) * 5*scale),
                new THREE.Vector3(Math.cos(i+1) * 10*scale, Math.sin(i) * 4*scale, Math.sin(i+1) * 10*scale),
                new THREE.Vector3(Math.cos(i+2) * 20*scale, 0, Math.sin(i+2) * 20*scale)
            ]);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.2 * scale, 8, false);
            const tube = new THREE.Mesh(tubeGeo, conduitMaterial);
            group.add(tube);

            // Add glowing energy pulses along the tube
            const pulseGeo = new THREE.SphereGeometry(0.3 * scale, 16, 16);
            const pulse = new THREE.Mesh(pulseGeo, new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5}));
            group.add(pulse);
            
            updatables.push({ 
                mesh: pulse, 
                type: 'path', 
                curve: curve, 
                progress: i / numConduits, 
                speed: 0.002 
            });
        }
    };

    // 5. Spiral Arms (Dyson Swarms and Stars)
    const createSpiralArms = () => {
        const numStars = 5000;
        const arms = 4;
        const armSpread = 0.5;
        const maxRadius = 40 * scale;

        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(numStars * 3);

        const nodeGeo = new THREE.OctahedronGeometry(0.5, 0);
        const dysonInstanced = new THREE.InstancedMesh(nodeGeo, dysonSwarmMaterial, numStars);

        const dummy = new THREE.Object3D();

        for (let i = 0; i < numStars; i++) {
            const distance = Math.random() * maxRadius;
            const angle = (distance / (5*scale)) + (i % arms) * ((2 * Math.PI) / arms);
            const spreadX = (Math.random() - 0.5) * distance * armSpread;
            const spreadZ = (Math.random() - 0.5) * distance * armSpread;
            const spreadY = (Math.random() - 0.5) * (maxRadius - distance) * 0.2; // Thicker in middle

            const x = Math.cos(angle) * distance + spreadX;
            const y = spreadY;
            const z = Math.sin(angle) * distance + spreadZ;

            // Ensure hole in the middle for the core
            if (Math.sqrt(x*x + z*z) < 8 * scale) continue;

            starPos[i*3] = x;
            starPos[i*3+1] = y;
            starPos[i*3+2] = z;

            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            const s = Math.random() * 0.5 + 0.5;
            dummy.scale.set(s,s,s);
            dummy.updateMatrix();
            dysonInstanced.setMatrixAt(i, dummy.matrix);
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starPoints = new THREE.Points(starGeo, starMaterial);
        group.add(starPoints);
        group.add(dysonInstanced);

        updatables.push({ mesh: starPoints, type: 'rotate', axis: 'y', speed: 0.005 });
        updatables.push({ mesh: dysonInstanced, type: 'rotate', axis: 'y', speed: 0.005 });
    };

    // 6. GALACTIC HYPERSPATIAL TRACTION WHEELS (The "Tires")
    // Mandated by user requirement: TorusGeometry combined with hundreds of tiny extruded BoxGeometry lugs. Rims using CylinderGeometry with complex spoke arrays.
    const createGalacticTires = () => {
        const wheelRadius = 15 * scale;
        const wheelTube = 3 * scale;
        
        const createWheel = (xPos) => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(xPos, 0, 0);
            wheelGroup.rotation.x = Math.PI / 2; // Lay flat relative to galaxy, then tilt

            // Core Tire (Torus)
            const tireGeo = new THREE.TorusGeometry(wheelRadius, wheelTube, 32, 100);
            const tire = new THREE.Mesh(tireGeo, rubber); // Using imported rubber
            wheelGroup.add(tire);

            // Treads (Hundreds of tiny extruded BoxGeometry lugs)
            const treadGeo = new THREE.BoxGeometry(wheelTube * 2.5, wheelRadius * 0.1, wheelRadius * 0.3);
            const treadCount = 120;
            for(let i=0; i<treadCount; i++) {
                const angle = (i / treadCount) * Math.PI * 2;
                const tread = new THREE.Mesh(treadGeo, darkSteel);
                
                // Position along the outer edge of the torus
                tread.position.x = Math.cos(angle) * (wheelRadius + wheelTube * 0.9);
                tread.position.y = Math.sin(angle) * (wheelRadius + wheelTube * 0.9);
                
                // Rotate to match surface normal
                tread.rotation.z = angle;
                
                // Add an aggressive angle to the treads
                tread.rotation.x = Math.PI / 6;
                tread.rotation.y = Math.PI / 12;

                wheelGroup.add(tread);
            }

            // Rims (CylinderGeometry with complex spoke arrays)
            const rimDepth = wheelTube * 1.5;
            const rimGeo = new THREE.CylinderGeometry(wheelRadius - wheelTube, wheelRadius - wheelTube, rimDepth, 64);
            const rim = new THREE.Mesh(rimGeo, chrome);
            rim.rotation.x = Math.PI / 2;
            wheelGroup.add(rim);

            // Spokes
            const spokeCount = 24;
            const spokeGeo = new THREE.CylinderGeometry(0.2 * scale, 0.4 * scale, wheelRadius - wheelTube, 16);
            for(let i=0; i<spokeCount; i++) {
                const angle = (i / spokeCount) * Math.PI * 2;
                const spoke = new THREE.Mesh(spokeGeo, chrome);
                
                spoke.position.x = Math.cos(angle) * (wheelRadius - wheelTube)/2;
                spoke.position.y = Math.sin(angle) * (wheelRadius - wheelTube)/2;
                spoke.rotation.z = angle + Math.PI/2;
                
                // Intricate sub-spokes
                const subSpokeGeo = new THREE.BoxGeometry(0.1*scale, (wheelRadius - wheelTube)*0.8, 0.1*scale);
                const subSpoke = new THREE.Mesh(subSpokeGeo, tinted);
                subSpoke.position.copy(spoke.position);
                subSpoke.rotation.z = spoke.rotation.z - Math.PI/4;
                wheelGroup.add(subSpoke);

                wheelGroup.add(spoke);
            }

            // Central Hub
            const hubGeo = new THREE.CylinderGeometry(2 * scale, 2.5 * scale, rimDepth * 1.2, 32);
            const hub = new THREE.Mesh(hubGeo, plastic); // high tech composite plastic
            hub.rotation.x = Math.PI / 2;
            wheelGroup.add(hub);
            
            const glowingHubGeo = new THREE.SphereGeometry(1.5 * scale, 32, 32);
            const glowingHub = new THREE.Mesh(glowingHubGeo, neonGridMaterial);
            wheelGroup.add(glowingHub);

            // Connect wheel to galactic core via massive strut
            const axleGeo = new THREE.CylinderGeometry(1*scale, 1*scale, Math.abs(xPos), 32);
            const axle = new THREE.Mesh(axleGeo, frameworkMaterial);
            axle.position.set(-xPos/2, 0, 0);
            axle.rotation.z = Math.PI / 2;
            wheelGroup.add(axle);

            // Initial orientation of the whole wheel group
            wheelGroup.rotation.y = Math.PI / 2;
            group.add(wheelGroup);

            // Register for animation
            updatables.push({ mesh: wheelGroup, type: 'rotate', axis: 'x', speed: xPos > 0 ? 0.02 : -0.02 }); // Counter-rotating wheels
            updatables.push({ mesh: glowingHub, type: 'pulse', baseScale: 1, amplitude: 0.2, speed: 4 });
            
            return wheelGroup;
        };

        createWheel(25 * scale); // Starboard wheel
        createWheel(-25 * scale); // Port wheel
    };

    // 7. Megastructure Operator Cabin / AI Core
    const createAICore = () => {
        const cabinGroup = new THREE.Group();
        cabinGroup.position.y = 15 * scale;
        
        // Massive tinted glass dodecahedron
        const cabinGeo = new THREE.DodecahedronGeometry(3 * scale, 1);
        const cabin = new THREE.Mesh(cabinGeo, tinted);
        cabinGroup.add(cabin);

        // Internal glowing processing nodes
        const coreGeo = new THREE.IcosahedronGeometry(1.5 * scale, 2);
        const core = new THREE.Mesh(coreGeo, neonGridMaterial);
        cabinGroup.add(core);

        // Surrounding orbital rings (screens/control panels)
        for(let i=0; i<3; i++) {
            const ringGeo = new THREE.TorusGeometry(4 * scale + i*scale, 0.1 * scale, 16, 64);
            const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({color: 0x0055ff, emissive: 0x00aaff, emissiveIntensity: 2}));
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            cabinGroup.add(ring);
            updatables.push({ mesh: ring, type: 'rotate', axis: 'x', speed: 0.01 + i*0.01 });
            updatables.push({ mesh: ring, type: 'rotate', axis: 'y', speed: 0.015 + i*0.005 });
        }

        group.add(cabinGroup);
        updatables.push({ mesh: cabinGroup, type: 'hover', baseY: 15 * scale, amplitude: 1 * scale, speed: 0.001 });
        updatables.push({ mesh: core, type: 'rotate', axis: 'y', speed: -0.05 });
        updatables.push({ mesh: core, type: 'pulse', baseScale: 1, amplitude: 0.1, speed: 10 });
    };

    // Execute builders
    createCore();
    createAccretionDisk();
    createPolarJets();
    createConduits();
    createSpiralArms();
    createGalacticTires(); // Tires added!
    createAICore();

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshes) => {
        const t = time * 0.001 * speed; // normalize time

        updatables.forEach(item => {
            if (!item.mesh) return;
            
            if (item.type === 'rotate') {
                item.mesh.rotation[item.axis] += item.speed * speed;
            } 
            else if (item.type === 'pulse') {
                const s = item.baseScale + Math.sin(t * item.speed) * item.amplitude;
                item.mesh.scale.set(s, s, s);
            }
            else if (item.type === 'path') {
                // Move along CatmullRomCurve3
                item.progress += item.speed * speed;
                if (item.progress > 1) item.progress = 0;
                
                const pos = item.curve.getPointAt(item.progress);
                item.mesh.position.copy(pos);
            }
            else if (item.type === 'hover') {
                item.mesh.position.y = item.baseY + Math.sin(t * item.speed * 1000) * item.amplitude; // t is already small
            }
        });

        // Pulsate materials (Energy flow effect)
        accretionDiskMaterialInner.emissiveIntensity = 5 + Math.sin(t * 10) * 2;
        jetMaterial.emissiveIntensity = 10 + Math.cos(t * 15) * 4;
        neonGridMaterial.emissiveIntensity = 4 + Math.sin(t * 5) * 2;
        conduitMaterial.emissiveIntensity = 1.5 + Math.cos(t * 8) * 1;
    };

    // ==========================================
    // 5 PHD-LEVEL ASTROPHYSICS QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of a Type III civilization harnessing a central supermassive black hole, what is the maximum theoretical efficiency of energy extraction from a maximally rotating (Kerr) black hole via the Penrose process?",
            options: [
                "100% of its rest mass energy",
                "~29% of its rest mass energy",
                "~42% of its rest mass energy",
                "~11% of its rest mass energy"
            ],
            correctAnswer: 1,
            explanation: "The Penrose process allows energy extraction from a rotating black hole's ergosphere. For a maximally rotating Kerr black hole, the irreducible mass is sqrt(1/2) of the total mass, meaning 1 - sqrt(1/2) ≈ 29.29% of the initial mass-energy can theoretically be extracted before the black hole ceases to rotate."
        },
        {
            question: "When deploying Dysons swarms across galactic spiral density waves, what mathematical curve best approximates the trailing spiral arms of a typical grand design spiral galaxy where the nodes are anchored?",
            options: [
                "Archimedean spiral",
                "Fermat's spiral",
                "Logarithmic spiral",
                "Hyperbolic spiral"
            ],
            correctAnswer: 2,
            explanation: "Spiral galaxies typically exhibit arms that are well-approximated by logarithmic spirals (pitch angle remains constant). Density wave theory explains these as quasi-static density waves moving through the galactic disk, compressing gas and triggering star formation."
        },
        {
            question: "A megastructure utilizes the Shkadov thruster principle on billions of stars simultaneously to maneuver the galaxy (acting as galactic 'tires'). What is the primary mechanism of a classical Shkadov thruster (Class A stellar engine)?",
            options: [
                "Dropping mass into the star to induce artificial supernovae flares.",
                "Using an immense asymmetric mirror to reflect stellar radiation pressure, generating net thrust.",
                "Extracting plasma magnetically from the stellar poles and accelerating it via linear accelerators.",
                "Manipulating the local Higgs field to alter the star's inertial mass."
            ],
            correctAnswer: 1,
            explanation: "A Class A stellar engine (Shkadov thruster) uses a massive spherical arc mirror (a statite) placed over one side of a star. Radiation pressure from the star reflects off the mirror, creating a net thrust that slowly accelerates the entire star system."
        },
        {
            question: "To prevent the 'spaghettification' (tidal disruption) of the innermost accretion harvesters near the event horizon, the structure must withstand extreme tidal forces. How does the magnitude of the tidal force scale with the distance 'r' from the singularity?",
            options: [
                "Proportional to 1/r^2",
                "Proportional to 1/r^3",
                "Proportional to 1/r",
                "Exponentially with e^-r"
            ],
            correctAnswer: 1,
            explanation: "Tidal forces (the difference in gravitational pull across an object) in Newtonian mechanics and General Relativity scale with the inverse cube of the distance (1/r^3) from the central mass. Thus, as you halve the distance, tidal forces increase by a factor of 8."
        },
        {
            question: "The megastructure's AI core relies on the Bekenstein-Hawking entropy of the central supermassive black hole for quantum computational bounds. How does the entropy of the black hole scale?",
            options: [
                "Proportionally to its mass (M).",
                "Proportionally to the cube of its mass (M^3).",
                "Proportionally to the square of its mass (M^2), i.e., the area of its event horizon.",
                "Inversely to its temperature."
            ],
            correctAnswer: 2,
            explanation: "The Bekenstein-Hawking entropy of a black hole is directly proportional to the surface area of its event horizon (A). Since the radius of a black hole (Schwarzschild radius) is directly proportional to its mass (M), the area (and thus the entropy) is proportional to M^2. This is a foundational principle of the holographic principle."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
