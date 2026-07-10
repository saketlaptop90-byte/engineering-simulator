import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    machineGroup.name = 'Akashic_Record_Interface';

    const parts = [];
    const animationState = {
        time: 0,
        coreLayers: [],
        obelisks: [],
        rings: [],
        codeRains: [],
        runeSpheres: [],
        energyWebs: [],
        shards: [],
        pulsars: [],
        dataStreams: [],
        fractalNodes: [],
        holograms: []
    };

    const description = "GOD TIER AKASHIC RECORD INTERFACE: An inconceivably advanced hyper-dimensional construct that taps directly into the Planck-scale informational substrate of the universe. It translates raw ontological data into geometric projections, allowing observers to read the source code of reality. Built by a Type IV civilization, it manipulates spacetime and quantum entanglement to index all past, present, and probable futures.";

    // ==========================================
    // 1. QUIZ QUESTIONS (PhD-Level Quantum Info)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of quantum Shannon theory, what does the Holevo bound fundamentally limit?",
            options: [
                "The maximum rate of classical information transmission over a noisy quantum channel.",
                "The amount of accessible classical information that can be extracted from a quantum state.",
                "The degree of entanglement preservation during quantum teleportation.",
                "The maximum violation of Bell's inequalities in a bipartite system."
            ],
            answer: 1,
            explanation: "The Holevo bound establishes the upper limit on the amount of classical information that can be reliably transmitted or extracted from a given ensemble of quantum states."
        },
        {
            question: "In topological quantum computing using the Toric code, how are logical operations (gates) physically implemented?",
            options: [
                "By applying transverse magnetic fields to all physical qubits simultaneously.",
                "By braiding non-Abelian anyons around each other in 2+1 dimensional spacetime.",
                "By performing successive syndrome measurements and classical decoding.",
                "By manipulating the energy gap between the ground state and the first excited state."
            ],
            answer: 1,
            explanation: "Topological quantum computation relies on the braiding of anyons (quasiparticles with fractional statistics) to enact fault-tolerant unitary transformations, making them robust against local noise."
        },
        {
            question: "According to the Ryu-Takayanagi formula in the AdS/CFT correspondence, the entanglement entropy of a boundary subregion is proportional to:",
            options: [
                "The volume of the minimal bulk hypersurface homologous to the boundary subregion.",
                "The area of the minimal bulk surface anchored to the entanglement cut on the boundary.",
                "The logarithm of the conformal dimension of the primary operators.",
                "The trace of the stress-energy tensor integrated over the causal wedge."
            ],
            answer: 1,
            explanation: "The Ryu-Takayanagi conjecture elegantly bridges quantum information and gravity, stating that entanglement entropy in the CFT is proportional to the area of a minimal surface in the bulk AdS space, akin to the Bekenstein-Hawking entropy formula for black holes."
        },
        {
            question: "Which complexity class represents the set of decision problems solvable by a quantum computer in polynomial time with a bounded probability of error?",
            options: ["NP", "QMA", "BQP", "PSPACE"],
            answer: 2,
            explanation: "BQP (Bounded-error Quantum Polynomial time) is the quantum analogue of BPP and represents problems efficiently solvable on a quantum computer. It is known to contain P and be contained in PSPACE."
        },
        {
            question: "Tsirelson's bound limits the maximum quantum violation of the CHSH inequality to what value?",
            options: [
                "2",
                "2 * sqrt(2)",
                "4",
                "sqrt(2) / 2"
            ],
            answer: 1,
            explanation: "While classical local hidden variable theories restrict the CHSH correlation to a maximum of 2, quantum mechanics allows violations up to 2√2 (approximately 2.828), which is known as Tsirelson's bound."
        }
    ];

    // ==========================================
    // 2. ADVANCED MATERIALS
    // ==========================================
    // We clone base materials and create hyper-advanced glowing and semi-transparent variations.
    const quantumGlassMat = glass.clone();
    quantumGlassMat.color.setHex(0x00ffff);
    quantumGlassMat.transparent = true;
    quantumGlassMat.opacity = 0.6;
    quantumGlassMat.emissive.setHex(0x0044aa);
    quantumGlassMat.emissiveIntensity = 0.8;
    quantumGlassMat.roughness = 0.05;
    quantumGlassMat.metalness = 0.9;
    quantumGlassMat.side = THREE.DoubleSide;

    const darkMatterMat = darkSteel.clone();
    darkMatterMat.color.setHex(0x050505);
    darkMatterMat.roughness = 0.9;
    darkMatterMat.metalness = 1.0;
    
    const akashicGoldMat = chrome.clone();
    akashicGoldMat.color.setHex(0xffaa00);
    akashicGoldMat.emissive.setHex(0x331100);
    akashicGoldMat.emissiveIntensity = 0.5;
    akashicGoldMat.metalness = 1.0;
    akashicGoldMat.roughness = 0.2;

    const pureEnergyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const runeMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        side: THREE.DoubleSide
    });

    const voidCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x110022,
        roughness: 0,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0
    });

    const dataStreamMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const holographicMat = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    // ==========================================
    // 3. UTILITY FUNCTIONS FOR PROCEDURAL GENERATION
    // ==========================================
    function createComplexCrystal(radius, layers) {
        const group = new THREE.Group();
        for (let i = 0; i < layers; i++) {
            const geo = new THREE.IcosahedronGeometry(radius * (1 - i * 0.15), 1);
            const mat = i % 2 === 0 ? quantumGlassMat : pureEnergyMat;
            const mesh = new THREE.Mesh(geo, mat);
            if (i > 0) {
                mesh.rotation.x = Math.random() * Math.PI;
                mesh.rotation.y = Math.random() * Math.PI;
            }
            group.add(mesh);
            animationState.coreLayers.push({
                mesh: mesh,
                speedX: (Math.random() - 0.5) * 0.05,
                speedY: (Math.random() - 0.5) * 0.05,
                speedZ: (Math.random() - 0.5) * 0.05,
                baseScale: 1 - i * 0.15,
                pulseRate: 0.02 + i * 0.01
            });
        }
        return group;
    }

    function createProceduralRuneSymbol(size) {
        const group = new THREE.Group();
        const numStrokes = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < numStrokes; i++) {
            const length = size * (0.3 + Math.random() * 0.7);
            const thickness = size * 0.1;
            const geo = new THREE.BoxGeometry(length, thickness, thickness);
            const mesh = new THREE.Mesh(geo, runeMat);
            
            // Snap to 45 degree angles for a high-tech glyph look
            mesh.rotation.z = Math.floor(Math.random() * 8) * (Math.PI / 4);
            mesh.position.set(
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size,
                0
            );
            group.add(mesh);
        }
        return group;
    }

    function createDataObelisk(height, radius) {
        const obelisk = new THREE.Group();
        
        // Base
        const baseGeo = new THREE.CylinderGeometry(radius * 1.5, radius * 2, height * 0.1, 8);
        const base = new THREE.Mesh(baseGeo, darkMatterMat);
        base.position.y = -height / 2 + height * 0.05;
        obelisk.add(base);

        // Main Shaft
        const shaftGeo = new THREE.CylinderGeometry(radius * 0.8, radius, height * 0.8, 8);
        const shaft = new THREE.Mesh(shaftGeo, darkMatterMat);
        obelisk.add(shaft);

        // Inner Energy Core
        const coreGeo = new THREE.CylinderGeometry(radius * 0.4, radius * 0.5, height * 0.85, 8);
        const core = new THREE.Mesh(coreGeo, pureEnergyMat);
        obelisk.add(core);

        // Outer circuitry rings
        const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.05, 8, 32);
        for (let i = 0; i < 5; i++) {
            const ring = new THREE.Mesh(ringGeo, akashicGoldMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -height * 0.3 + (height * 0.6 * (i / 4));
            obelisk.add(ring);
            animationState.obelisks.push({ mesh: ring, type: 'ring', speed: (i%2==0 ? 1 : -1) * 0.02 });
        }

        // Cap
        const capGeo = new THREE.CylinderGeometry(0, radius * 0.9, height * 0.2, 8);
        const cap = new THREE.Mesh(capGeo, akashicGoldMat);
        cap.position.y = height / 2 + height * 0.1;
        obelisk.add(cap);

        // Floating Rune Halo above obelisk
        const haloGroup = new THREE.Group();
        for(let i=0; i<8; i++) {
            const rune = createProceduralRuneSymbol(radius * 0.3);
            rune.position.set(Math.cos(i * Math.PI/4) * radius * 1.5, 0, Math.sin(i * Math.PI/4) * radius * 1.5);
            rune.lookAt(0,0,0);
            haloGroup.add(rune);
        }
        haloGroup.position.y = height / 2 + height * 0.4;
        obelisk.add(haloGroup);
        animationState.obelisks.push({ mesh: haloGroup, type: 'halo', speed: 0.03 });

        return obelisk;
    }

    function createHyperSymmetricBase(radius) {
        const group = new THREE.Group();
        const baseGeo = new THREE.OctahedronGeometry(radius, 2);
        const base = new THREE.Mesh(baseGeo, darkMatterMat);
        base.scale.set(1, 0.1, 1);
        group.add(base);

        // Intricate floor patterns
        const ringGeo = new THREE.RingGeometry(radius * 0.2, radius * 0.22, 64);
        for(let i=1; i<8; i++) {
            const ring = new THREE.Mesh(ringGeo, runeMat);
            ring.rotation.x = -Math.PI / 2;
            ring.scale.set(i, i, i);
            ring.position.y = 0.1;
            group.add(ring);
            animationState.rings.push({ mesh: ring, speed: (i%2==0 ? 0.005 : -0.005) });
        }
        
        return group;
    }

    // ==========================================
    // 4. ASSEMBLING THE MACHINE PARTS
    // ==========================================
    
    // 4.1 The Central Singularity Core
    const singularityCore = createComplexCrystal(5, 7);
    singularityCore.position.y = 15;
    machineGroup.add(singularityCore);
    
    parts.push({
        name: "Central Singularity Core",
        description: "The primary computational nexus containing a trapped primordial micro-black hole, encapsulated in hyper-dimensional quantum glass. It computes all probabilistic timelines simultaneously.",
        material: "Quantum Glass / Pure Energy",
        function: "Main temporal and spatial data processor.",
        assemblyOrder: 1,
        connections: ["Akashic Obelisks", "Chronos Rings", "Quantum Data Web"],
        failureEffect: "Spontaneous timeline collapse, causing localized reality disintegration and causality loops.",
        cascadeFailures: ["Chronos Rings", "Observation Platform"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // 4.2 The Void Core (Inner singularity)
    const voidGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const voidCore = new THREE.Mesh(voidGeo, voidCoreMat);
    voidCore.position.y = 15;
    machineGroup.add(voidCore);
    animationState.pulsars.push(voidCore);

    parts.push({
        name: "Event Horizon Sphere",
        description: "The absolute center of the construct. A perfectly smooth sphere of dark matter that absorbs excess quantum entropy.",
        material: "Dark Matter",
        function: "Entropy sink and thermal regulator.",
        assemblyOrder: 2,
        connections: ["Central Singularity Core"],
        failureEffect: "Entropy overflow resulting in sudden hyper-freezing of the surrounding vacuum.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // 4.3 Akashic Obelisks (8 Monoliths)
    const obeliskDistance = 25;
    const obeliskHeight = 30;
    const obeliskRadius = 2.5;

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const obelisk = createDataObelisk(obeliskHeight, obeliskRadius);
        
        const px = Math.cos(angle) * obeliskDistance;
        const pz = Math.sin(angle) * obeliskDistance;
        
        obelisk.position.set(px, obeliskHeight / 2 - 2, pz);
        obelisk.lookAt(0, obelisk.position.y, 0);
        machineGroup.add(obelisk);

        const cardinalName = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"][i];

        parts.push({
            name: `Akashic Obelisk: ${cardinalName} Node`,
            description: `A monolithic data pillar composed of programmable dark matter and interwoven with quantum circuitry. It extracts localized historical records from the vacuum zero-point field.`,
            material: "Dark Matter / Akashic Gold",
            function: `Data extraction from quadrant ${i+1}.`,
            assemblyOrder: 3 + i,
            connections: ["Central Singularity Core", "Hyper-Symmetric Base"],
            failureEffect: `Loss of historical data integrity in quadrant ${i+1}, causing memory fragmentation.`,
            cascadeFailures: ["Quantum Data Web"],
            originalPosition: { x: px, y: obeliskHeight / 2 - 2, z: pz },
            explodedPosition: { x: px * 1.5, y: obeliskHeight / 2 - 2, z: pz * 1.5 }
        });
    }

    // 4.4 Hyper-Symmetric Base
    const baseRadius = 40;
    const base = createHyperSymmetricBase(baseRadius);
    machineGroup.add(base);

    parts.push({
        name: "Hyper-Symmetric Floor Base",
        description: "A geometric focusing lens that grounds the immense dimensional forces exerted by the singularity core. Engraved with non-Euclidean runes.",
        material: "Dark Matter / Rune Plasma",
        function: "Structural anchoring and spatial stabilization.",
        assemblyOrder: 11,
        connections: ["Akashic Obelisks"],
        failureEffect: "Spatial tearing, causing the entire construct to unmoor from current spacetime coordinates.",
        cascadeFailures: ["All Components"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 4.5 Chronos Rings (Massive orbiting structures)
    for (let i = 1; i <= 3; i++) {
        const ringGeo = new THREE.TorusKnotGeometry(12 + i * 4, 0.5 + i * 0.2, 256, 32, i + 1, i + 2);
        const ringMat = i === 2 ? pureEnergyMat : akashicGoldMat;
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 15;
        
        // Random initial rotations
        ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        machineGroup.add(ring);
        
        animationState.rings.push({
            mesh: ring,
            axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
            speed: 0.005 + (i * 0.002)
        });

        parts.push({
            name: `Chronos Torus-Knot Layer ${i}`,
            description: `A super-conducting topological ring that maps temporal manifolds. It prevents causality paradoxes by actively computing chronal-corrections. Parameter P=${i+1}, Q=${i+2}.`,
            material: i === 2 ? "Pure Energy" : "Akashic Gold",
            function: "Temporal stabilization and paradox resolution.",
            assemblyOrder: 12 + i,
            connections: ["Central Singularity Core"],
            failureEffect: "Uncontrolled time dilation loops in the immediate vicinity.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 15, z: 0 },
            explodedPosition: { x: 0, y: 15 + i * 15, z: 0 }
        });
    }

    // 4.6 Quantum Data Web (Tubes connecting Obelisks to Core)
    const webGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * obeliskDistance;
        const pz = Math.sin(angle) * obeliskDistance;
        
        // Create 3 curved tubes per obelisk
        for (let j = 0; j < 3; j++) {
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(px, obeliskHeight * 0.8, pz), // Obelisk top
                new THREE.Vector3(px * 0.5, 30 + j * 10, pz * 0.5), // Control point floating high
                new THREE.Vector3(0, 15, 0) // Core center
            );
            
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.2 + (Math.random() * 0.3), 8, false);
            const tube = new THREE.Mesh(tubeGeo, pureEnergyMat.clone());
            tube.material.opacity = 0.5;
            tube.material.transparent = true;
            webGroup.add(tube);
            animationState.energyWebs.push({
                mesh: tube,
                phase: Math.random() * Math.PI * 2,
                speed: 0.05 + Math.random() * 0.05
            });
        }
    }
    machineGroup.add(webGroup);

    parts.push({
        name: "Quantum Data Web Network",
        description: "A network of plasmic energy conduits transferring ontological data from the Obelisks to the Central Singularity.",
        material: "Pure Energy Plasma",
        function: "High-bandwidth data transfer (Yottabytes per attosecond).",
        assemblyOrder: 16,
        connections: ["Central Singularity Core", "Akashic Obelisks"],
        failureEffect: "Data bottlenecks causing spontaneous energy discharges.",
        cascadeFailures: ["Central Singularity Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 4.7 Source Code Rain (Matrix-style particle system)
    const rainCount = 15000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainSpeeds = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
        // Cylindrical distribution around the core
        const theta = Math.random() * Math.PI * 2;
        const r = 5 + Math.random() * 30; // Radius between 5 and 35
        const y = -10 + Math.random() * 60; // Height between -10 and 50
        
        rainPositions[i * 3] = Math.cos(theta) * r;
        rainPositions[i * 3 + 1] = y;
        rainPositions[i * 3 + 2] = Math.sin(theta) * r;

        rainSpeeds[i] = 0.1 + Math.random() * 0.5; // Downward speed
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    rainGeo.setAttribute('speed', new THREE.BufferAttribute(rainSpeeds, 1));
    const codeRainMesh = new THREE.Points(rainGeo, dataStreamMat);
    machineGroup.add(codeRainMesh);
    animationState.codeRains.push(codeRainMesh);

    parts.push({
        name: "Source Code Rain Projection",
        description: "A visual holographic manifestation of the universe's foundational variables. Raw logic cascades continuously as data is processed.",
        material: "Holographic Light",
        function: "User interface and data visualization.",
        assemblyOrder: 17,
        connections: ["Central Singularity Core"],
        failureEffect: "UI corruption; operators may experience extreme cognitive dissonance.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 4.8 Orbiting Holographic Rune Spheres
    const runeSphereGroup = new THREE.Group();
    runeSphereGroup.position.y = 15;
    for(let i=0; i<100; i++) {
        const rune = createProceduralRuneSymbol(1.5);
        
        // Random position on a sphere surface
        const phi = Math.acos(-1 + (2 * i) / 100);
        const theta = Math.sqrt(100 * Math.PI) * phi;
        const r = 22; // Orbit radius
        
        rune.position.x = r * Math.cos(theta) * Math.sin(phi);
        rune.position.y = r * Math.sin(theta) * Math.sin(phi);
        rune.position.z = r * Math.cos(phi);
        
        // Look at center
        rune.lookAt(0,0,0);
        runeSphereGroup.add(rune);
    }
    machineGroup.add(runeSphereGroup);
    animationState.runeSpheres.push({
        mesh: runeSphereGroup,
        speedX: 0.002,
        speedY: 0.003,
        speedZ: 0.001
    });

    parts.push({
        name: "Holographic Rosetta Sphere",
        description: "A swarm of self-organizing linguistic subroutines that translate multi-dimensional concepts into comprehensible 3D glyphs.",
        material: "Rune Plasma",
        function: "Semantic translation of Akashic data.",
        assemblyOrder: 18,
        connections: ["Central Singularity Core"],
        failureEffect: "Complete loss of semantic meaning; output becomes pure static noise.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 40 }
    });

    // 4.9 Crystalline Shards Swarm
    const shardGroup = new THREE.Group();
    shardGroup.position.y = 15;
    const shardGeo = new THREE.TetrahedronGeometry(0.8, 0);
    for (let i = 0; i < 200; i++) {
        const shard = new THREE.Mesh(shardGeo, quantumGlassMat);
        const distance = 8 + Math.random() * 6;
        shard.position.set(
            (Math.random() - 0.5) * distance * 2,
            (Math.random() - 0.5) * distance * 2,
            (Math.random() - 0.5) * distance * 2
        );
        shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        shardGroup.add(shard);
        
        animationState.shards.push({
            mesh: shard,
            orbitCenter: new THREE.Vector3(0, 0, 0),
            orbitSpeed: 0.01 + Math.random() * 0.02,
            orbitAngle: Math.random() * Math.PI * 2,
            orbitRadius: shard.position.length(),
            orbitAxis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
            rotSpeed: new THREE.Vector3(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1)
        });
    }
    machineGroup.add(shardGroup);

    parts.push({
        name: "Crystalline Deflector Swarm",
        description: "A cloud of independently calculating quantum glass shards. They dynamically reconfigure to block harmful psychokinetic feedback from the record.",
        material: "Quantum Glass",
        function: "Cognitive shielding for operators.",
        assemblyOrder: 19,
        connections: ["Central Singularity Core"],
        failureEffect: "Operator minds exposed to raw infinity, causing instant ego-death.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 30, y: 15, z: 30 }
    });
    
    // 4.10 Dimensional Stabilizer Rings (Under base)
    const stabilizerGroup = new THREE.Group();
    for (let i=0; i<3; i++) {
        const rad = 45 + i*5;
        const geom = new THREE.TorusGeometry(rad, 0.5, 16, 128);
        const mesh = new THREE.Mesh(geom, chrome);
        mesh.rotation.x = Math.PI/2;
        mesh.position.y = -2 - (i*1);
        stabilizerGroup.add(mesh);
        animationState.rings.push({
            mesh: mesh,
            axis: new THREE.Vector3(0,1,0),
            speed: (i%2==0 ? 1 : -1) * 0.002
        });
    }
    machineGroup.add(stabilizerGroup);

    parts.push({
        name: "Dimensional Stabilizer Perimeter",
        description: "Heavy chrome rings generating counter-gravitational fields to keep the construct firmly planted in the 3rd dimension.",
        material: "Chrome / Heavy Metals",
        function: "Gravimetric anchoring.",
        assemblyOrder: 20,
        connections: ["Hyper-Symmetric Base"],
        failureEffect: "Construct slowly phases into higher dimensions, vanishing from sight.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 4.11 Holographic Interface Consoles (For tiny operators)
    for(let i=0; i<4; i++) {
        const consoleGroup = new THREE.Group();
        const angle = (i/4) * Math.PI * 2 + Math.PI/4; // Offset from obelisks
        const dist = 32;
        
        const deskGeo = new THREE.BoxGeometry(4, 1, 2);
        const desk = new THREE.Mesh(deskGeo, darkMatterMat);
        desk.position.y = 1;
        consoleGroup.add(desk);

        const screenGeo = new THREE.PlaneGeometry(6, 3);
        const screen = new THREE.Mesh(screenGeo, holographicMat);
        screen.position.set(0, 3, -1);
        screen.rotation.x = -Math.PI / 6;
        consoleGroup.add(screen);
        
        // Console details
        const keysGeo = new THREE.BoxGeometry(3, 0.1, 1);
        const keys = new THREE.Mesh(keysGeo, runeMat);
        keys.position.set(0, 1.55, 0.2);
        consoleGroup.add(keys);

        consoleGroup.position.set(Math.cos(angle)*dist, 0, Math.sin(angle)*dist);
        consoleGroup.lookAt(0,0,0);
        machineGroup.add(consoleGroup);

        parts.push({
            name: `Operator Console Node ${i+1}`,
            description: "A terminal where Class-Omega engineers attempt to input queries into the Akasha. The interface translates manual input into chronal-pulses.",
            material: "Dark Matter / Holographic Light",
            function: "Local user interface.",
            assemblyOrder: 21 + i,
            connections: ["Hyper-Symmetric Base"],
            failureEffect: "Terminal lockout; query requests infinite loop.",
            cascadeFailures: [],
            originalPosition: { x: Math.cos(angle)*dist, y: 0, z: Math.sin(angle)*dist },
            explodedPosition: { x: Math.cos(angle)*dist*2, y: 5, z: Math.sin(angle)*dist*2 }
        });
    }

    // 4.12 Core Containment Pillars
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const pDist = 12;
        const pillarGeo = new THREE.CylinderGeometry(0.5, 1, 30, 8);
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(Math.cos(angle)*pDist, 15, Math.sin(angle)*pDist);
        
        const energyLineGeo = new THREE.CylinderGeometry(0.55, 0.55, 30, 8);
        const energyLine = new THREE.Mesh(energyLineGeo, holographicMat);
        energyLine.position.copy(pillar.position);
        
        machineGroup.add(pillar);
        machineGroup.add(energyLine);
        
        animationState.pulsars.push(energyLine);

        parts.push({
            name: `Core Containment Pillar ${i+1}`,
            description: "Reinforced steel pillars laced with holographic dampening fields to contain the sheer physical stress of the singularity.",
            material: "Steel / Holographic Forcefield",
            function: "Physical containment of the core.",
            assemblyOrder: 7 + i,
            connections: ["Hyper-Symmetric Base", "Central Singularity Core"],
            failureEffect: "Singularity expands violently, shredding local topography.",
            cascadeFailures: ["Central Singularity Core"],
            originalPosition: { x: Math.cos(angle)*pDist, y: 15, z: Math.sin(angle)*pDist },
            explodedPosition: { x: Math.cos(angle)*pDist*1.5, y: 15, z: Math.sin(angle)*pDist*1.5 }
        });
    }

    // 4.13 Zenith Transmitter (Top of the machine)
    const zenithGroup = new THREE.Group();
    zenithGroup.position.y = 45;

    const zBaseGeo = new THREE.ConeGeometry(5, 10, 8);
    const zBase = new THREE.Mesh(zBaseGeo, darkMatterMat);
    zBase.rotation.x = Math.PI; // point downwards
    zenithGroup.add(zBase);

    const zSphereGeo = new THREE.IcosahedronGeometry(2, 2);
    const zSphere = new THREE.Mesh(zSphereGeo, pureEnergyMat);
    zSphere.position.y = 7;
    zenithGroup.add(zSphere);
    
    // Orbiting rings around zenith
    for(let i=0; i<3; i++) {
        const zRingGeo = new THREE.RingGeometry(3+i, 3.5+i, 32);
        const zRing = new THREE.Mesh(zRingGeo, akashicGoldMat);
        zRing.rotation.x = Math.PI/2;
        zRing.position.y = 7;
        zenithGroup.add(zRing);
        animationState.rings.push({
            mesh: zRing,
            axis: new THREE.Vector3(0,1,0),
            speed: (i%2===0?1:-1)*0.05
        });
    }

    machineGroup.add(zenithGroup);

    parts.push({
        name: "Zenith Transmitter Subsystem",
        description: "Focuses the processed ontological data into a tight tachyon beam, broadcasting it to the broader interstellar neural network.",
        material: "Dark Matter / Pure Energy",
        function: "Macro-scale data broadcast.",
        assemblyOrder: 25,
        connections: ["Central Singularity Core"],
        failureEffect: "Data beam scatters, causing localized hallucinations in sentient beings within 5 parsecs.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 45, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    // 4.14 Nadir Receiver (Bottom of the machine, piercing floor)
    const nadirGeo = new THREE.ConeGeometry(8, 20, 16);
    const nadir = new THREE.Mesh(nadirGeo, darkMatterMat);
    nadir.position.y = -10;
    machineGroup.add(nadir);

    parts.push({
        name: "Nadir Deep-Core Receiver",
        description: "Penetrates deep into the planetary crust to tap into geothermal and telluric energy lines, providing the raw power required for operation.",
        material: "Dark Matter",
        function: "Power draw from planetary core.",
        assemblyOrder: 4,
        connections: ["Hyper-Symmetric Base"],
        failureEffect: "Power starvation leading to a dangerous un-spooled singularity.",
        cascadeFailures: ["Dimensional Stabilizer Perimeter"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // 4.15 Akashic Data Plates (Floating geometry near base)
    const plateGroup = new THREE.Group();
    plateGroup.position.y = 5;
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI*2;
        const plateGeo = new THREE.BoxGeometry(6, 0.2, 8);
        const plate = new THREE.Mesh(plateGeo, chrome);
        
        plate.position.set(Math.cos(angle)*25, 0, Math.sin(angle)*25);
        plate.lookAt(0, 5, 0);
        plate.rotation.x += Math.PI/4;

        // Add glowing screens to plates
        const screenGeo = new THREE.PlaneGeometry(5, 7);
        const screen = new THREE.Mesh(screenGeo, runeMat);
        screen.position.set(0, 0.15, 0);
        screen.rotation.x = -Math.PI/2;
        plate.add(screen);

        plateGroup.add(plate);

        // Simple floating animation
        animationState.obelisks.push({
            mesh: plate,
            type: 'plate',
            baseY: 0,
            phase: angle * 3,
            speed: 0.02
        });
    }
    machineGroup.add(plateGroup);

    parts.push({
        name: "Akashic Memory Plates",
        description: "Physical cache buffers that temporarily store massive amounts of chronal data before it is fed into the singularity.",
        material: "Chrome / Rune Plasma",
        function: "High-speed temporary memory storage.",
        assemblyOrder: 26,
        connections: ["Akashic Obelisks", "Hyper-Symmetric Base"],
        failureEffect: "Memory buffer overflow, dropping decades of historical records permanently.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -40 } // Generalized
    });


    // ==========================================
    // 5. ANIMATION LOGIC (Extremely Complex)
    // ==========================================
    function animate(time, speed, meshes) {
        const delta = speed * 0.01;
        animationState.time += delta;
        const t = animationState.time;

        // 1. Core Layers (Nested Icosahedrons)
        // They rotate independently, pulse in scale, and change opacity.
        animationState.coreLayers.forEach((layer, i) => {
            layer.mesh.rotation.x += layer.speedX * speed;
            layer.mesh.rotation.y += layer.speedY * speed;
            layer.mesh.rotation.z += layer.speedZ * speed;
            
            // Complex scale pulsing using sine wave interference
            const pulse = Math.sin(t * layer.pulseRate * 100) * 0.05 + 
                          Math.cos(t * layer.pulseRate * 150 + i) * 0.02;
            const newScale = layer.baseScale + pulse;
            layer.mesh.scale.set(newScale, newScale, newScale);
            
            // Material pulsing if possible
            if (layer.mesh.material === pureEnergyMat) {
                layer.mesh.material.emissiveIntensity = 3.0 + Math.sin(t * 50) * 1.5;
            }
        });

        // 2. Void Core (Inner singularity)
        animationState.pulsars.forEach((mesh, i) => {
            if (mesh.geometry.type === 'SphereGeometry') {
                // Throbbing effect
                const scale = 1.0 + Math.sin(t * 80) * 0.05;
                mesh.scale.set(scale, scale, scale);
                // Rotate slowly
                mesh.rotation.y += 0.01 * speed;
            } else if (mesh.geometry.type === 'CylinderGeometry') {
                // Containment pillar forcefields flashing
                mesh.material.opacity = 0.3 + Math.sin(t * 30 + i) * 0.2;
            }
        });

        // 3. Obelisks (Rings, Halos, Plates)
        animationState.obelisks.forEach(obj => {
            if (obj.type === 'ring') {
                obj.mesh.rotation.z += obj.speed * speed;
            } else if (obj.type === 'halo') {
                obj.mesh.rotation.y += obj.speed * speed;
                // Bobbing
                obj.mesh.position.y += Math.sin(t * 100) * 0.01;
            } else if (obj.type === 'plate') {
                obj.mesh.position.y = obj.baseY + Math.sin(t * 50 + obj.phase) * 1.5;
            }
        });

        // 4. Rings (Chronos Rings, Stabilizers, Zenith Rings)
        animationState.rings.forEach(ringObj => {
            if (ringObj.axis) {
                // Rotate around arbitrary axis
                ringObj.mesh.rotateOnAxis(ringObj.axis, ringObj.speed * speed);
            } else {
                // Rotate around Y
                ringObj.mesh.rotation.y += ringObj.speed * speed;
            }
            
            // If TorusKnot, make them pulse slightly
            if (ringObj.mesh.geometry.type === 'TorusKnotGeometry') {
                const s = 1.0 + Math.sin(t * 20 + ringObj.speed * 1000) * 0.02;
                ringObj.mesh.scale.set(s,s,s);
            }
        });

        // 5. Code Rain (Particle System)
        animationState.codeRains.forEach(pointsMesh => {
            const positions = pointsMesh.geometry.attributes.position.array;
            const speeds = pointsMesh.geometry.attributes.speed.array;
            
            for(let i=0; i<speeds.length; i++) {
                // Move down
                positions[i*3 + 1] -= speeds[i] * speed;
                
                // Reset to top if below threshold
                if (positions[i*3 + 1] < -10) {
                    positions[i*3 + 1] = 50;
                    // Slightly randomize X and Z when resetting
                    const r = 5 + Math.random() * 30;
                    const theta = Math.random() * Math.PI * 2;
                    positions[i*3] = Math.cos(theta) * r;
                    positions[i*3 + 2] = Math.sin(theta) * r;
                }
            }
            pointsMesh.geometry.attributes.position.needsUpdate = true;
        });

        // 6. Rune Spheres (Orbiting holographic sphere of symbols)
        animationState.runeSpheres.forEach(sphereObj => {
            sphereObj.mesh.rotation.x += sphereObj.speedX * speed;
            sphereObj.mesh.rotation.y += sphereObj.speedY * speed;
            sphereObj.mesh.rotation.z += sphereObj.speedZ * speed;
            
            // Make individual runes twinkle
            sphereObj.mesh.children.forEach((rune, idx) => {
                rune.material.opacity = 0.5 + Math.sin(t * 50 + idx) * 0.5;
            });
        });

        // 7. Crystalline Shard Swarm (Complex Orbital Mechanics)
        animationState.shards.forEach((shardObj, i) => {
            // Update orbital angle
            shardObj.orbitAngle += shardObj.orbitSpeed * speed;
            
            // Calculate new position based on axis and angle
            // Simple approach: rotate vector around axis
            const pos = new THREE.Vector3(shardObj.orbitRadius, 0, 0);
            pos.applyAxisAngle(shardObj.orbitAxis, shardObj.orbitAngle);
            
            // Add some chaotic perturbation (quantum jitter)
            const jitter = new THREE.Vector3(
                Math.sin(t * 100 + i) * 0.2,
                Math.cos(t * 110 + i) * 0.2,
                Math.sin(t * 120 + i) * 0.2
            );
            pos.add(jitter);
            
            shardObj.mesh.position.copy(pos);
            
            // Spin on own axes
            shardObj.mesh.rotation.x += shardObj.rotSpeed.x * speed;
            shardObj.mesh.rotation.y += shardObj.rotSpeed.y * speed;
            shardObj.mesh.rotation.z += shardObj.rotSpeed.z * speed;
        });

        // 8. Energy Webs (Tubes pulsing with data)
        animationState.energyWebs.forEach((webObj, i) => {
            // Modify opacity rapidly to simulate data packet transfer
            const signal = Math.sin(t * 200 * webObj.speed + webObj.phase);
            // Squaring the signal creates sharp pulses
            webObj.mesh.material.opacity = Math.max(0.1, signal * signal * 0.8);
            
            // Color shift from blue to purple
            const r = 0.0;
            const g = 0.5 + Math.sin(t * 50 + i) * 0.5;
            const b = 1.0;
            webObj.mesh.material.color.setRGB(r, g, b);
        });
    }

    // ==========================================
    // 6. RETURN OBJECT
    // ==========================================
    return {
        group: machineGroup,
        parts: parts,
        description: description,
        quizQuestions: quizQuestions,
        animate: animate
    };
}
