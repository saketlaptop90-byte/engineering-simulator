import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM HYPER-TECH MATERIALS ---
    const pureEnergyMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const pureEnergyMatSolid = new THREE.MeshStandardMaterial({
        color: 0xccffff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.6
    });

    const darkEnergyMat = new THREE.MeshStandardMaterial({
        color: 0x050011,
        emissive: 0x220044,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 1.0,
        wireframe: false
    });

    const chronosMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const voidMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x000000,
        roughness: 1.0,
        metalness: 0.0
    });

    const tachyonMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x55ff55,
        emissiveIntensity: 4.0,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const quantumDataMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 2.5,
        roughness: 0.0,
        metalness: 1.0
    });

    const coreSingularityMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0
    });

    const matrixLatticeMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0x111111,
        metalness: 0.9,
        roughness: 0.4,
        wireframe: true
    });

    const dimensionFoldMat = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    // 1. OMEGA CORE SINGULARITY
    const coreGeo = new THREE.IcosahedronGeometry(10, 4);
    const coreMesh = new THREE.Mesh(coreGeo, coreSingularityMat);
    coreMesh.name = "Omega_Core_Singularity";
    group.add(coreMesh);
    parts.push({
        name: "Omega Core Singularity",
        description: "The absolute center of the computer, a zero-dimensional point expanded into 3D space for interface purposes. Simulates reality at a fundamental level.",
        material: "coreSingularityMat",
        function: "Houses the master timeline and reality matrix.",
        assemblyOrder: 1,
        connections: ["Dyson_Inner_Shell", "Data_Streams_Nexus"],
        failureEffect: "Total universal collapse, infinite loop of Big Bangs.",
        cascadeFailures: ["Everything"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. DYSON SHELL LAYER 1 (INNER)
    const shell1Geo = new THREE.IcosahedronGeometry(25, 2);
    const shell1Mesh = new THREE.Mesh(shell1Geo, pureEnergyMat);
    shell1Mesh.name = "Dyson_Inner_Shell";
    group.add(shell1Mesh);
    parts.push({
        name: "Dyson Inner Shell",
        description: "Primary energy containment lattice, harvesting Planck-scale vacuum energy.",
        material: "pureEnergyMat",
        function: "Energy containment and initial conversion to computational logic.",
        assemblyOrder: 2,
        connections: ["Omega_Core_Singularity", "Chronos_Rings"],
        failureEffect: "Energy leakage causing localized reality breakdown.",
        cascadeFailures: ["Chronos_Rings"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: -50 }
    });

    // 3. DYSON SHELL LAYER 2 (MIDDLE)
    const shell2Geo = new THREE.DodecahedronGeometry(45, 1);
    const shell2Mesh = new THREE.Mesh(shell2Geo, tachyonMat);
    shell2Mesh.name = "Dyson_Middle_Shell";
    group.add(shell2Mesh);
    parts.push({
        name: "Dyson Middle Shell",
        description: "Tachyon router layer, propagating data backwards in time to ensure instant computation.",
        material: "tachyonMat",
        function: "Acausal data routing.",
        assemblyOrder: 3,
        connections: ["Dyson_Inner_Shell", "Dyson_Outer_Shell"],
        failureEffect: "Paradoxes in computation results.",
        cascadeFailures: ["Quantum_Compute_Nodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -70, y: 70, z: 70 }
    });

    // 4. DYSON SHELL LAYER 3 (OUTER)
    const shell3Geo = new THREE.IcosahedronGeometry(75, 3);
    const shell3Mesh = new THREE.Mesh(shell3Geo, darkEnergyMat);
    shell3Mesh.name = "Dyson_Outer_Shell";
    group.add(shell3Mesh);
    parts.push({
        name: "Dyson Outer Shell",
        description: "Physical boundary made of condensed dark energy, isolating the Omega Point from external temporal decay.",
        material: "darkEnergyMat",
        function: "Temporal shielding and structural integrity.",
        assemblyOrder: 4,
        connections: ["Dyson_Middle_Shell", "Information_Horizon"],
        failureEffect: "Exposure to entropic decay from the dying universe.",
        cascadeFailures: ["Information_Horizon"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 5. QUANTUM COMPUTE NODES ARRAY
    const nodesGroup = new THREE.Group();
    nodesGroup.name = "Quantum_Compute_Nodes";
    const nodeGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 8);
    for (let i = 0; i < 300; i++) {
        const node = new THREE.Mesh(nodeGeo, quantumDataMat);
        const phi = Math.acos(-1 + (2 * i) / 300);
        const theta = Math.sqrt(300 * Math.PI) * phi;
        const radius = 35;
        node.position.x = radius * Math.cos(theta) * Math.sin(phi);
        node.position.y = radius * Math.sin(theta) * Math.sin(phi);
        node.position.z = radius * Math.cos(phi);
        node.lookAt(0, 0, 0);
        node.rotateX(Math.PI / 2);
        nodesGroup.add(node);
    }
    group.add(nodesGroup);
    parts.push({
        name: "Quantum Compute Nodes Array",
        description: "300 distributed quantum processing cores linked via quantum entanglement.",
        material: "quantumDataMat",
        function: "Parallel processing of infinite multiverses.",
        assemblyOrder: 5,
        connections: ["Dyson_Inner_Shell", "Data_Streams_Nexus"],
        failureEffect: "Loss of specific multiverse simulations.",
        cascadeFailures: ["Reality_Simulation_Galaxies"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -100, y: 0, z: 100 }
    });

    // 6. DIMENSIONAL FOLD TORUS
    const torusGeo = new THREE.TorusKnotGeometry(60, 3, 300, 32, 5, 8);
    const torusMesh = new THREE.Mesh(torusGeo, dimensionFoldMat);
    torusMesh.name = "Dimensional_Fold_Torus";
    group.add(torusMesh);
    parts.push({
        name: "Dimensional Fold Torus",
        description: "A physically manifested 11-dimensional fold, acting as a heat sink for the immense entropy generated.",
        material: "dimensionFoldMat",
        function: "Entropy venting into higher dimensions.",
        assemblyOrder: 6,
        connections: ["Dyson_Outer_Shell"],
        failureEffect: "Catastrophic overheating of the computer, resulting in a false vacuum decay.",
        cascadeFailures: ["Dyson_Outer_Shell", "Entropy_Reversal_Matrix"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -120, z: 0 }
    });

    // 7. REALITY SIMULATION GALAXIES (Particle System)
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyCount = 20000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const colorA = new THREE.Color(0x00ffff);
    const colorB = new THREE.Color(0xff00ff);
    for (let i = 0; i < galaxyCount; i++) {
        // Spiral galaxy distribution roughly
        const radius = Math.random() * 20 + 5;
        const angle = Math.random() * Math.PI * 2;
        const spiralOffset = radius * 0.5;
        const x = Math.cos(angle + spiralOffset) * radius;
        const y = (Math.random() - 0.5) * 4 * (1 - radius/25);
        const z = Math.sin(angle + spiralOffset) * radius;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const mixRatio = Math.random();
        const mixedColor = colorA.clone().lerp(colorB, mixRatio);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create a custom glowing point material using shader or standard points
    const galaxyMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const galaxySystem = new THREE.Points(galaxyGeo, galaxyMat);
    galaxySystem.name = "Reality_Simulation_Galaxies";
    group.add(galaxySystem);
    parts.push({
        name: "Reality Simulation Galaxies",
        description: "Holographic projection of simulated universes within the core processor, each point representing a billion galaxies.",
        material: "galaxyMat",
        function: "Visual telemetry of ongoing reality simulations.",
        assemblyOrder: 7,
        connections: ["Omega_Core_Singularity"],
        failureEffect: "Loss of simulation telemetry, though simulations continue.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Exploding would look weird for particles, keep them centered or scale them
    });

    // 8, 9, 10. DATA STREAM NEXUS (Tubes)
    class TrefoilCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            t *= Math.PI * 2;
            const x = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
            const y = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
            const z = Math.sin(3 * t);
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    const tubeGeo1 = new THREE.TubeGeometry(new TrefoilCurve(15), 200, 0.5, 8, true);
    const tubeGeo2 = new THREE.TubeGeometry(new TrefoilCurve(20), 200, 0.3, 8, true);
    const tubeGeo3 = new THREE.TubeGeometry(new TrefoilCurve(25), 200, 0.8, 8, true);

    const tube1 = new THREE.Mesh(tubeGeo1, pureEnergyMatSolid);
    tube1.name = "Data_Stream_Nexus_X";
    const tube2 = new THREE.Mesh(tubeGeo2, pureEnergyMatSolid);
    tube2.name = "Data_Stream_Nexus_Y";
    tube2.rotation.x = Math.PI / 2;
    const tube3 = new THREE.Mesh(tubeGeo3, pureEnergyMatSolid);
    tube3.name = "Data_Stream_Nexus_Z";
    tube3.rotation.y = Math.PI / 2;

    const dataNexusGroup = new THREE.Group();
    dataNexusGroup.add(tube1);
    dataNexusGroup.add(tube2);
    dataNexusGroup.add(tube3);
    dataNexusGroup.name = "Data_Streams_Nexus";
    group.add(dataNexusGroup);

    parts.push({
        name: "Data Stream Nexus",
        description: "Trefoil knotted fiber-optic conduits transmitting information at faster-than-light speeds.",
        material: "pureEnergyMatSolid",
        function: "Main data bus between core and computation nodes.",
        assemblyOrder: 8,
        connections: ["Omega_Core_Singularity", "Quantum_Compute_Nodes"],
        failureEffect: "Data traffic jam causing localized temporal anomalies.",
        cascadeFailures: ["Quantum_Compute_Nodes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 80, y: 0, z: -80 }
    });

    // 11. CHRONOS MANIPULATOR RINGS
    const ringGeo = new THREE.TorusGeometry(30, 1.5, 16, 100);
    const ringGroup = new THREE.Group();
    ringGroup.name = "Chronos_Rings";
    
    const ring1 = new THREE.Mesh(ringGeo, chronosMat);
    const ring2 = new THREE.Mesh(ringGeo, chronosMat);
    const ring3 = new THREE.Mesh(ringGeo, chronosMat);
    ring2.rotation.x = Math.PI / 2;
    ring3.rotation.y = Math.PI / 2;
    
    // Add intricate details to rings (lugs)
    const lugGeo = new THREE.BoxGeometry(2, 2.5, 2);
    for(let r = 0; r < 3; r++){
        let targetRing = r === 0 ? ring1 : r === 1 ? ring2 : ring3;
        for(let i = 0; i < 24; i++){
            const lug = new THREE.Mesh(lugGeo, steel);
            const angle = (i / 24) * Math.PI * 2;
            lug.position.x = Math.cos(angle) * 30;
            lug.position.y = Math.sin(angle) * 30;
            lug.rotation.z = angle;
            targetRing.add(lug);
        }
    }

    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);
    group.add(ringGroup);

    parts.push({
        name: "Chronos Manipulator Rings",
        description: "Gimbaled rings that independently align to manipulate the local flow of time.",
        material: "chronosMat + steel",
        function: "Temporal synchronization of the Omega Point.",
        assemblyOrder: 9,
        connections: ["Dyson_Inner_Shell", "Entropy_Reversal_Matrix"],
        failureEffect: "Time desynchronization, core aging at infinite speed.",
        cascadeFailures: ["Omega_Core_Singularity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 120 }
    });

    // 12. MULTIVERSE HOLOGRAM PROJECTORS
    const projShape = new THREE.Shape();
    projShape.moveTo(0, 0);
    projShape.lineTo(2, -1);
    projShape.lineTo(2, -4);
    projShape.lineTo(1, -5);
    projShape.lineTo(-1, -5);
    projShape.lineTo(-2, -4);
    projShape.lineTo(-2, -1);
    projShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const projGeo = new THREE.ExtrudeGeometry(projShape, extrudeSettings);
    projGeo.center();

    const projGroup = new THREE.Group();
    projGroup.name = "Multiverse_Projectors";
    for(let i = 0; i < 12; i++){
        const proj = new THREE.Mesh(projGeo, chrome);
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        const radius = 55;
        proj.position.x = radius * Math.cos(theta) * Math.sin(phi);
        proj.position.y = radius * Math.sin(theta) * Math.sin(phi);
        proj.position.z = radius * Math.cos(phi);
        proj.lookAt(0, 0, 0);
        // add glowing tip
        const tipGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const tip = new THREE.Mesh(tipGeo, pureEnergyMatSolid);
        tip.position.z = 6;
        proj.add(tip);

        projGroup.add(proj);
    }
    group.add(projGroup);

    parts.push({
        name: "Multiverse Hologram Projectors",
        description: "High-fidelity emission nozzles that project the mathematical structures of alternate realities.",
        material: "chrome + pureEnergyMatSolid",
        function: "Output generation for the simulation.",
        assemblyOrder: 10,
        connections: ["Dyson_Middle_Shell"],
        failureEffect: "Reality projections glitching into eldritch horrors.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -100, y: -100, z: -100 }
    });

    // 13. ENTROPY REVERSAL MATRIX
    const latticeGroup = new THREE.Group();
    latticeGroup.name = "Entropy_Reversal_Matrix";
    const strutGeo = new THREE.CylinderGeometry(0.2, 0.2, 100, 8);
    for(let i = 0; i < 50; i++){
        const strut = new THREE.Mesh(strutGeo, matrixLatticeMat);
        strut.position.x = (Math.random() - 0.5) * 100;
        strut.position.y = (Math.random() - 0.5) * 100;
        strut.position.z = (Math.random() - 0.5) * 100;
        strut.rotation.x = Math.random() * Math.PI;
        strut.rotation.y = Math.random() * Math.PI;
        strut.rotation.z = Math.random() * Math.PI;
        latticeGroup.add(strut);
    }
    group.add(latticeGroup);
    parts.push({
        name: "Entropy Reversal Matrix",
        description: "A sprawling, chaotic web of negative-mass struts designed to constantly pump entropy out of the system.",
        material: "matrixLatticeMat",
        function: "Maintains Maxwell's Demon protocols on a macro scale.",
        assemblyOrder: 11,
        connections: ["Dyson_Outer_Shell", "Dimensional_Fold_Torus"],
        failureEffect: "Heat death of the Omega Point.",
        cascadeFailures: ["Omega_Core_Singularity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 100, z: 100 }
    });

    // 14. INFORMATION HORIZON BOUNDARY
    const horizonGeo = new THREE.SphereGeometry(90, 64, 64);
    const horizonMat = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.1,
        roughness: 0,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.name = "Information_Horizon";
    group.add(horizonMesh);
    parts.push({
        name: "Information Horizon Boundary",
        description: "A computational black hole event horizon. No raw data can escape, only processed omniscience.",
        material: "Advanced MeshPhysicalMaterial (Glass-like Void)",
        function: "Absolute security and physical containment.",
        assemblyOrder: 12,
        connections: ["Dyson_Outer_Shell"],
        failureEffect: "Information paradoxes leaking into the dying universe.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Sphere just expands during explosion
    });

    // 15. DARK ENERGY COLLECTORS
    const lathePoints = [];
    for ( let i = 0; i < 20; i ++ ) {
        lathePoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 3 + 2, ( i - 10 ) * 1.5 ) );
    }
    const collectorGeo = new THREE.LatheGeometry( lathePoints, 32 );
    const collectorsGroup = new THREE.Group();
    collectorsGroup.name = "Dark_Energy_Collectors";
    
    const colPositions = [
        [0, 110, 0], [0, -110, 0], [110, 0, 0], [-110, 0, 0], [0, 0, 110], [0, 0, -110]
    ];
    colPositions.forEach(pos => {
        const col = new THREE.Mesh(collectorGeo, darkSteel);
        col.position.set(...pos);
        col.lookAt(0, 0, 0);
        col.rotateX(Math.PI / 2);
        
        // Add glowing ring inside
        const glowRingGeo = new THREE.TorusGeometry(3, 0.5, 16, 32);
        const glowRing = new THREE.Mesh(glowRingGeo, tachyonMat);
        glowRing.position.y = 10;
        glowRing.rotation.x = Math.PI / 2;
        col.add(glowRing);

        collectorsGroup.add(col);
    });
    group.add(collectorsGroup);
    parts.push({
        name: "Dark Energy Collectors",
        description: "Massive lathed constructs that funnel the universe's accelerating expansion into raw power.",
        material: "darkSteel + tachyonMat",
        function: "Power generation via cosmic expansion.",
        assemblyOrder: 13,
        connections: ["Information_Horizon"],
        failureEffect: "Power starvation, reducing compute rate.",
        cascadeFailures: ["Multiverse_Projectors"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    // 16. TACHYON COMM ARRAY
    const commArrayGeo = new THREE.ConeGeometry(5, 40, 16);
    const commArrayGroup = new THREE.Group();
    commArrayGroup.name = "Tachyon_Comm_Array";
    for(let i=0; i<8; i++){
        const comm = new THREE.Mesh(commArrayGeo, copper);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 100;
        comm.position.x = Math.cos(angle) * radius;
        comm.position.y = 0;
        comm.position.z = Math.sin(angle) * radius;
        comm.lookAt(0,0,0);
        comm.rotateX(-Math.PI / 2);
        
        // Detailed ridges
        const ridgeGeo = new THREE.TorusGeometry(3, 0.3, 8, 16);
        for(let j=0; j<5; j++){
            const ridge = new THREE.Mesh(ridgeGeo, pureEnergyMatSolid);
            ridge.position.y = -15 + j * 5;
            ridge.rotation.x = Math.PI / 2;
            comm.add(ridge);
        }

        commArrayGroup.add(comm);
    }
    group.add(commArrayGroup);
    parts.push({
        name: "Tachyon Comm Array",
        description: "Inter-dimensional communication spikes sending query results to entities residing outside spacetime.",
        material: "copper + pureEnergyMatSolid",
        function: "Data broadcast beyond the universe.",
        assemblyOrder: 14,
        connections: ["Information_Horizon"],
        failureEffect: "Complete isolation; the computer solves everything but cannot share it.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // 17. HYDRAULIC MANIFOLDS (Detailed Tube Networks)
    const hydGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
    const hydGroup = new THREE.Group();
    hydGroup.name = "Hydraulic_Manifolds";
    for(let i=0; i<40; i++){
        const hyd = new THREE.Mesh(hydGeo, glass);
        hyd.position.set((Math.random()-0.5)*150, (Math.random()-0.5)*150, (Math.random()-0.5)*150);
        hyd.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        // Piston rod inside
        const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 12, 8);
        const rod = new THREE.Mesh(rodGeo, chrome);
        hyd.add(rod);

        hydGroup.add(hyd);
    }
    group.add(hydGroup);
    parts.push({
        name: "Hydraulic Coolant Manifolds",
        description: "Physical liquid-helium coolant pumps backing up the higher-dimensional heat sinks.",
        material: "glass + chrome",
        function: "Emergency heat dissipation.",
        assemblyOrder: 15,
        connections: ["Entropy_Reversal_Matrix"],
        failureEffect: "Minor localized overheating.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: -50, z: 150 }
    });

    // --- EXPERT LEVEL QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of simulating a universe with a cosmological constant (Λ) > 0 within a finite memory Omega Point, what is the primary computational bottleneck as t approaches infinity?",
            options: [
                "The exponentially growing volume requires exponentially growing compute nodes.",
                "The event horizon distance shrinks, isolating compute nodes from each other due to the accelerating expansion (De Sitter space limitations).",
                "Dark matter condensation causes gravitational rounding errors in floating-point operations.",
                "Tachyon feedback loops create unresolvable grandfather paradoxes in the ALU."
            ],
            correctAnswer: 1,
            explanation: "In a universe with accelerating expansion (Λ > 0), the cosmic event horizon eventually bounds the observable universe for any observer. Nodes become causally disconnected, making a unified 'Omega Point' computation impossible without exploiting higher dimensions."
        },
        {
            question: "When applying the Bekenstein bound to the Information Horizon Boundary, the maximum information (I) the spherical boundary of radius R can contain is proportional to:",
            options: [
                "The volume of the sphere (R³).",
                "The diameter of the sphere (2R).",
                "The surface area of the sphere (R²).",
                "The Planck length divided by R."
            ],
            correctAnswer: 2,
            explanation: "The Bekenstein bound implies that the entropy (and thus maximal information) of a region of space is proportional to the surface area of its boundary, not its volume, leading to the Holographic Principle."
        },
        {
            question: "To reverse entropy within the Entropy Reversal Matrix without violating the Second Law of Thermodynamics globally, the Omega Point must:",
            options: [
                "Use a perfect Maxwell's Demon powered by zero-point energy.",
                "Compress the entropy into a localized singularity with infinite density.",
                "Vent the generated entropy into a causally disconnected parallel universe or higher-dimensional bulk.",
                "Run the computation perfectly reversibly (Landauer's principle), requiring zero energy."
            ],
            correctAnswer: 2,
            explanation: "Even reversible computing has theoretical limits in an expanding universe. To actually decrease local entropy massively, the waste heat (entropy) must be expelled to an external system, such as a higher-dimensional bulk (the 'heat sink')."
        },
        {
            question: "If the Omega Core Singularity processes logic gates using rotating Kerr black holes, what property is exploited to store qubits?",
            options: [
                "The Hawking radiation emission spectrum.",
                "The angular momentum (spin) and charge of the black hole.",
                "The spaghettification rate of infalling matter.",
                "The infinite density of the central ring singularity."
            ],
            correctAnswer: 1,
            explanation: "A Kerr (rotating) or Kerr-Newman (rotating, charged) black hole is completely described by mass, spin, and charge (No-Hair Theorem). These macroscopic quantum states can theoretically be manipulated as massive qubits."
        },
        {
            question: "The Reality Simulation Galaxies run on a discrete spacetime lattice. To maintain Lorentz invariance on macro scales while keeping a fixed lattice spacing (Planck length), the simulation must:",
            options: [
                "Use standard Euclidean geometry.",
                "Implement a dynamic, fluctuating lattice governed by causal dynamical triangulations or loop quantum gravity principles.",
                "Ignore Lorentz invariance since it's only a low-energy approximation.",
                "Round off spatial coordinates to the nearest integer."
            ],
            correctAnswer: 1,
            explanation: "A rigid fixed lattice breaks continuous symmetries like Lorentz invariance. Quantum gravity theories like Causal Dynamical Triangulations (CDT) use dynamically updating simplices to preserve these symmetries at macro scales."
        }
    ];

    // --- ANIMATION LOGIC ---
    let time = 0;
    
    const animate = (delta, speed, explodedRatio) => {
        time += delta * speed;

        // 1. Core pulses and rotates extremely fast
        coreMesh.rotation.x += 0.05 * speed;
        coreMesh.rotation.y += 0.07 * speed;
        const pulse = Math.sin(time * 5) * 0.2 + 1;
        coreMesh.scale.set(pulse, pulse, pulse);
        coreSingularityMat.emissiveIntensity = 5 + Math.sin(time * 10) * 5;

        // 2 & 3 & 4. Dyson Shells counter-rotate and fold
        shell1Mesh.rotation.y -= 0.01 * speed;
        shell1Mesh.rotation.x -= 0.005 * speed;
        
        shell2Mesh.rotation.y += 0.008 * speed;
        shell2Mesh.rotation.z += 0.008 * speed;
        // Middle shell breathes
        const breath = Math.sin(time * 2) * 0.05 + 1;
        shell2Mesh.scale.set(breath, breath, breath);

        shell3Mesh.rotation.x += 0.003 * speed;
        shell3Mesh.rotation.y -= 0.004 * speed;

        // 5. Compute Nodes pulsate their emission and shift along their axis
        nodesGroup.children.forEach((node, idx) => {
            node.position.normalize().multiplyScalar(35 + Math.sin(time * 3 + idx) * 2);
            // Pulsing light
            if (idx % 10 === 0) {
                quantumDataMat.emissiveIntensity = 2.5 + Math.sin(time * 8 + idx) * 2;
            }
        });
        nodesGroup.rotation.y += 0.02 * speed;

        // 6. Dimensional Fold Torus twists and scales
        torusMesh.rotation.x = Math.sin(time * 0.5) * Math.PI;
        torusMesh.rotation.y = Math.cos(time * 0.3) * Math.PI;
        dimensionFoldMat.opacity = 0.3 + Math.sin(time * 4) * 0.1;

        // 7. Reality Simulation Galaxies swirl
        const positions = galaxyGeo.attributes.position.array;
        for(let i=0; i<galaxyCount; i++){
            let x = positions[i*3];
            let z = positions[i*3+2];
            let radius = Math.sqrt(x*x + z*z);
            // Swirl based on radius
            let angle = Math.atan2(z, x);
            angle += 0.05 * speed * (20 / (radius + 1));
            positions[i*3] = Math.cos(angle) * radius;
            positions[i*3+2] = Math.sin(angle) * radius;
        }
        galaxyGeo.attributes.position.needsUpdate = true;
        galaxySystem.rotation.y -= 0.005 * speed;

        // 8,9,10. Data Streams cycle material offset or rotate
        tube1.rotation.z += 0.01 * speed;
        tube2.rotation.y -= 0.015 * speed;
        tube3.rotation.x += 0.02 * speed;

        // 11. Chronos rings spin wildly
        ringGroup.children[0].rotation.x += 0.03 * speed;
        ringGroup.children[1].rotation.y += 0.04 * speed;
        ringGroup.children[2].rotation.z += 0.05 * speed;

        // 12. Projectors track a phantom target (sine wave based)
        const targetX = Math.sin(time) * 100;
        const targetY = Math.cos(time * 1.3) * 100;
        const targetZ = Math.sin(time * 0.7) * 100;
        projGroup.children.forEach((proj, i) => {
            // Keep their base position but look slightly towards target
            proj.lookAt(targetX, targetY, targetZ);
        });

        // 13. Entropy matrix jitter (chaos)
        latticeGroup.children.forEach(strut => {
            strut.rotation.x += (Math.random() - 0.5) * 0.1 * speed;
            strut.rotation.y += (Math.random() - 0.5) * 0.1 * speed;
        });
        latticeGroup.rotation.y -= 0.002 * speed;

        // 14. Horizon sphere breathes very slowly
        horizonMesh.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);

        // 15. Dark energy collectors glow pulses
        collectorsGroup.children.forEach((col) => {
            col.rotation.z += 0.01 * speed; // spin on local axis
            const glowRing = col.children[0];
            glowRing.scale.setScalar(1 + Math.sin(time * 5) * 0.2);
        });

        // 16. Comm array spikes send waves
        commArrayGroup.children.forEach((comm, idx) => {
            comm.children.forEach((ridge, rIdx) => {
                ridge.scale.setScalar(1 + Math.sin(time * 10 + rIdx - idx) * 0.3);
            });
        });

        // 17. Hydraulics piston movement
        hydGroup.children.forEach(hyd => {
            const rod = hyd.children[0];
            rod.position.y = Math.sin(time * 4 + hyd.position.x) * 3;
        });

        // --- EXPLOSION LOGIC ---
        // Lerp positions towards explodedPosition based on explodedRatio
        if (explodedRatio > 0) {
            parts.forEach((part, index) => {
                const mesh = group.children.find(c => c.name === part.name.replace(/ /g, "_"));
                if (mesh) {
                    if (mesh.name === "Information_Horizon") {
                        mesh.scale.setScalar(1 + explodedRatio * 1.5);
                    } else if (mesh.name === "Reality_Simulation_Galaxies") {
                        // don't explode galaxies out, just fade them
                        galaxyMat.opacity = 0.9 * (1 - explodedRatio);
                    } else {
                        mesh.position.x = THREE.MathUtils.lerp(part.originalPosition.x, part.explodedPosition.x, explodedRatio);
                        mesh.position.y = THREE.MathUtils.lerp(part.originalPosition.y, part.explodedPosition.y, explodedRatio);
                        mesh.position.z = THREE.MathUtils.lerp(part.originalPosition.z, part.explodedPosition.z, explodedRatio);
                    }
                }
            });
        } else {
            // Reset positions
            parts.forEach((part, index) => {
                const mesh = group.children.find(c => c.name === part.name.replace(/ /g, "_"));
                if (mesh && mesh.name !== "Information_Horizon" && mesh.name !== "Reality_Simulation_Galaxies") {
                    mesh.position.copy(part.originalPosition);
                }
            });
            galaxyMat.opacity = 0.9;
        }
    };

    return {
        group,
        parts,
        description: "The Omega Point Computer (God Tier). A theoretical hyper-computer residing at the end of time, utilizing the entire energy of the dying universe to simulate all possible realities and solve the ultimate questions of existence. It employs dark energy harvesting, tachyon acausal routing, and dimensional folding to achieve infinite compute.",
        quizQuestions,
        animate
    };
}
