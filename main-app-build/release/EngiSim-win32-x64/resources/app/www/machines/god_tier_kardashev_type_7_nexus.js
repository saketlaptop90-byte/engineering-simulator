import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animateTargets = [];
    const instancedArrays = [];
    const timeStreams = [];
    const pulsingMaterials = [];
    const rotators = [];
    const transformers = [];

    // ==========================================
    // OMNIVERSAL NEXUS LORE & DESCRIPTION
    // ==========================================
    const description = "The Kardashev Type VII Omniversal Nexus (God Tier). A construct not built, but retroactively manifested across all possible timelines by an intelligence that has subjugated the multiverse's foundational physics. It exists simultaneously in all dimensions (n-dimensional space), harvesting raw probability, processing branching timelines, and anchoring local realities against vacuum decay and cosmic entropy. It features impossible interlocking geometries, Penrose tesseracts, and infinite fractal regressions. Operating beyond the Planck limits, it weaves spacetime itself. Warning: Direct observation by unshielded biological entities may result in localized ontological collapse or spontaneous quantum decoherence.";

    // ==========================================
    // CUSTOM HYPER-TECH MATERIALS
    // ==========================================
    const voidMaterial = new THREE.MeshStandardMaterial({
        color: 0x020202,
        emissive: 0x110022,
        roughness: 0.1,
        metalness: 1.0,
        wireframe: false
    });

    const timelineMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    pulsingMaterials.push(timelineMaterial);

    const quantumFoamMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8
    });
    pulsingMaterials.push(quantumFoamMaterial);

    const tachyonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.5
    });
    pulsingMaterials.push(tachyonMaterial);

    const singularityMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x000000,
        metalness: 1,
        roughness: 0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 2.5,
        transmission: 1.0,
        opacity: 1.0
    });

    const chronosMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xaa4400,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    pulsingMaterials.push(chronosMaterial);

    // ==========================================
    // UTILITY: ADD PART FUNCTION
    // ==========================================
    function addPart(name, mesh, partDesc, materialName, func, order, connections, failure, cascade, origPos, explPos) {
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        group.add(mesh);
        
        parts.push({
            name,
            description: partDesc,
            material: materialName,
            function: func,
            assemblyOrder: order,
            connections,
            failureEffect: failure,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // ==========================================
    // GEOMETRY GENERATORS (IMPOSSIBLE MATH)
    // ==========================================

    // 1. The Omniversal Core (Fractal Icosahedron)
    const coreGroup = new THREE.Group();
    const coreGeom = new THREE.IcosahedronGeometry(20, 4);
    const coreMesh = new THREE.Mesh(coreGeom, singularityMaterial);
    const coreWireGeom = new THREE.IcosahedronGeometry(22, 2);
    const coreWireMesh = new THREE.Mesh(coreWireGeom, timelineMaterial);
    coreGroup.add(coreMesh);
    coreGroup.add(coreWireMesh);
    rotators.push({ mesh: coreGroup, axis: new THREE.Vector3(1, 1, 0).normalize(), speed: 0.005 });
    
    addPart(
        "Omniversal Core / Singularity Heart",
        coreGroup,
        "A naked singularity held in a suspended state of eternal inflation. It processes infinite timelines simultaneously. The wireframe cage prevents localized vacuum decay.",
        "singularityMaterial & timelineMaterial",
        "Generates infinite processing power via localized closed timelike curves.",
        1,
        ["Tesseract Frame Alpha", "Timeline Siphon Array", "Dark Energy Reactor"],
        "Immediate false vacuum decay, destroying the local universe bubble.",
        ["Tesseract Frame Alpha", "Timeline Siphon Array", "Probability Distributor"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 2. Tesseract Frame Alpha (Interlocking Impossible Geometry)
    const tesseractGroupAlpha = new THREE.Group();
    const tesseractSize = 50;
    const tubeRadius = 1.5;
    // We create a hypercube projection wireframe
    const hyperVertices = [];
    for(let i=0; i<16; i++) {
        hyperVertices.push(new THREE.Vector3(
            (i & 1 ? 1 : -1) * tesseractSize,
            (i & 2 ? 1 : -1) * tesseractSize,
            (i & 4 ? 1 : -1) * tesseractSize
        ));
    }
    // Connect vertices to form a 4D cube projection
    hyperVertices.forEach((v1, i) => {
        hyperVertices.forEach((v2, j) => {
            let diff = i ^ j;
            if(diff === 1 || diff === 2 || diff === 4 || diff === 8) {
                const distance = v1.distanceTo(v2);
                if (distance > 0 && distance < tesseractSize * 3) {
                    const cylGeom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, distance, 8);
                    const cylMesh = new THREE.Mesh(cylGeom, darkSteel);
                    // Orient cylinder
                    const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
                    cylMesh.position.copy(midpoint);
                    cylMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(v2, v1).normalize());
                    tesseractGroupAlpha.add(cylMesh);
                }
            }
        });
    });
    rotators.push({ mesh: tesseractGroupAlpha, axis: new THREE.Vector3(0, 1, 1).normalize(), speed: -0.002 });
    
    addPart(
        "Tesseract Frame Alpha",
        tesseractGroupAlpha,
        "The inner bounds of a 4-dimensional hypercube projected into 3D space. It stabilizes the chronological shear forces emitted by the Core.",
        "darkSteel",
        "Chronological shear stabilization and spatial anchoring.",
        2,
        ["Omniversal Core / Singularity Heart", "Tesseract Frame Beta"],
        "Spatial dimensions collapse from 3 to 2, turning the machine into a planar anomaly.",
        ["Tesseract Frame Beta", "Dimensional Anchor"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 3. Tesseract Frame Beta
    const tesseractGroupBeta = tesseractGroupAlpha.clone();
    tesseractGroupBeta.scale.set(1.5, 1.5, 1.5);
    // Change materials of children to chrome
    tesseractGroupBeta.traverse((child) => {
        if (child.isMesh) child.material = chrome;
    });
    rotators.push({ mesh: tesseractGroupBeta, axis: new THREE.Vector3(1, 0, 1).normalize(), speed: 0.0015 });
    
    addPart(
        "Tesseract Frame Beta",
        tesseractGroupBeta,
        "The outer hypercube manifold. Operates in an 11-dimensional Calabi-Yau space, shielding the physical universe from the Nexus's multiversal paradox radiation.",
        "chrome",
        "Multiversal Paradox Radiation shielding.",
        3,
        ["Tesseract Frame Alpha", "Probability Distributor"],
        "Paradox radiation leaks, causing spontaneous generation of conflicting timelines.",
        ["Probability Distributor", "Timeline Siphon Array"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 4. Timeline Siphon Array
    const siphonGroup = new THREE.Group();
    const streamCount = 128;
    for(let i=0; i<streamCount; i++) {
        const curvePoints = [];
        const a = Math.random() * Math.PI * 2;
        const b = Math.random() * Math.PI * 2;
        const c = Math.random() * Math.PI * 2;
        for(let t=0; t<=100; t++) {
            const u = t / 100 * Math.PI * 2;
            const x = Math.sin(u * 3 + a) * Math.cos(u * 5 + b) * 150;
            const y = Math.cos(u * 4 + a) * Math.sin(u * 2 + b) * 150;
            const z = Math.sin(u * 7 + c) * 150;
            curvePoints.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.5 + Math.random() * 1.5, 5, true);
        const streamMesh = new THREE.Mesh(tubeGeom, Math.random() > 0.5 ? timelineMaterial : tachyonMaterial);
        siphonGroup.add(streamMesh);
        
        // Save for animation (data flowing effect through scale/opacity modulation)
        timeStreams.push({
            mesh: streamMesh,
            phase: Math.random() * Math.PI * 2,
            speed: 0.05 + Math.random() * 0.05
        });
    }
    
    addPart(
        "Timeline Siphon Array",
        siphonGroup,
        "A sprawling network of non-Euclidean tubes carrying raw chronological data. They siphon uncollapsed wave functions from adjacent realities.",
        "timelineMaterial & tachyonMaterial",
        "Transports uncollapsed wave functions to the Probability Distributor.",
        4,
        ["Omniversal Core / Singularity Heart", "Probability Distributor", "Many-Worlds Branching Array"],
        "Timelines backflow, causing severe localized deja-vu and grandfather paradoxes.",
        ["Probability Distributor", "Many-Worlds Branching Array"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 5. Probability Distributor (Complex Lathe)
    const points = [];
    for ( let i = 0; i <= 100; i ++ ) {
        const t = i / 100;
        const radius = 20 + Math.sin(t * Math.PI * 20) * 10 + Math.cos(t * Math.PI * 5) * 20;
        points.push( new THREE.Vector2( radius, (t - 0.5) * 200 ) );
    }
    const latheGeom = new THREE.LatheGeometry( points, 128 );
    const probDistributor = new THREE.Mesh( latheGeom, chronosMaterial );
    rotators.push({ mesh: probDistributor, axis: new THREE.Vector3(0, 1, 0), speed: -0.01 });
    
    addPart(
        "Probability Distributor",
        probDistributor,
        "A hyper-lathe geometry that spins at irrational fractions of the speed of light. It calculates the statistical likelihood of every atomic interaction in the multiverse and redistributes favorable probabilities.",
        "chronosMaterial",
        "Manipulates quantum probability fields to ensure the Nexus's continued existence.",
        5,
        ["Timeline Siphon Array", "Quantum Foam Stabilizer", "Entropy Reverser"],
        "Murphy's Law reaches maximum entropy; all possible catastrophic failures occur simultaneously.",
        ["Quantum Foam Stabilizer", "Entropy Reverser", "Vacuum Energy Extractor"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: -300, z: 0}
    );

    // 6. Quantum Foam Stabilizer (Instanced Meshes forming a cloud)
    const qfCount = 10000;
    const qfGeom = new THREE.BoxGeometry(2, 2, 2);
    const qfInstanced = new THREE.InstancedMesh(qfGeom, quantumFoamMaterial, qfCount);
    const dummy = new THREE.Object3D();
    const qfPositions = [];
    for(let i=0; i<qfCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 250 + Math.random() * 100;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        qfPositions.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.1 });
        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.updateMatrix();
        qfInstanced.setMatrixAt(i, dummy.matrix);
    }
    instancedArrays.push({
        mesh: qfInstanced,
        data: qfPositions,
        dummy: dummy,
        type: 'foam'
    });
    
    addPart(
        "Quantum Foam Stabilizer",
        qfInstanced,
        "An artificial cloud of virtual particles popping in and out of existence. It dampens the violent vacuum energy fluctuations generated by the Tesseract Frames.",
        "quantumFoamMaterial",
        "Vacuum energy dampening and zero-point energy regulation.",
        6,
        ["Probability Distributor", "Vacuum Energy Extractor"],
        "Vacuum energy spikes, leading to miniature black hole generation across the hull.",
        ["Vacuum Energy Extractor", "Dimensional Anchor"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 7. Multiverse Fabricator
    const fabricatorGroup = new THREE.Group();
    const hexShape = new THREE.Shape();
    hexShape.moveTo(0, 20);
    for(let i=1; i<6; i++) {
        const angle = i * Math.PI / 3;
        hexShape.lineTo(Math.sin(angle) * 20, Math.cos(angle) * 20);
    }
    hexShape.lineTo(0, 20);
    const extrudeSettings = { depth: 400, bevelEnabled: true, bevelSegments: 5, steps: 10, bevelSize: 2, bevelThickness: 2 };
    const hexGeom = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    hexGeom.center();
    
    for(let i=0; i<6; i++) {
        const hexMesh = new THREE.Mesh(hexGeom, steel);
        const angle = i * Math.PI / 3;
        hexMesh.position.set(Math.sin(angle) * 300, 0, Math.cos(angle) * 300);
        hexMesh.rotation.x = Math.PI / 2;
        
        // Add glowing inner tubes
        const innerTubeGeom = new THREE.CylinderGeometry(5, 5, 450, 16);
        const innerTube = new THREE.Mesh(innerTubeGeom, timelineMaterial);
        innerTube.rotation.x = Math.PI / 2;
        hexMesh.add(innerTube);
        
        fabricatorGroup.add(hexMesh);
    }
    rotators.push({ mesh: fabricatorGroup, axis: new THREE.Vector3(0, 1, 0), speed: 0.005 });
    
    addPart(
        "Multiverse Fabricator (6-Pillar Array)",
        fabricatorGroup,
        "Massive extrusions of neutronium-infused steel. They weave new, bespoke pocket universes to store excess entropy generated by the Nexus.",
        "steel & timelineMaterial",
        "Pocket universe creation and entropy storage.",
        7,
        ["Entropy Reverser", "Parallel Universe Manifold"],
        "Newly created universes collapse instantly, sending shockwaves of pure entropy backward.",
        ["Entropy Reverser", "Parallel Universe Manifold", "String Theory Resonator"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 400, z: 0}
    );

    // 8. Entropy Reverser (Torus Knot Array)
    const entropyGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const tkGeom = new THREE.TorusKnotGeometry(120, 15, 256, 32, 3+i, 4+i);
        const tkMesh = new THREE.Mesh(tkGeom, copper);
        tkMesh.rotation.x = (Math.PI / 3) * i;
        tkMesh.rotation.y = (Math.PI / 4) * i;
        rotators.push({ mesh: tkMesh, axis: new THREE.Vector3(1, 1, 1).normalize(), speed: 0.02 * (i%2==0?1:-1) });
        entropyGroup.add(tkMesh);
    }
    
    addPart(
        "Entropy Reverser Array",
        entropyGroup,
        "A series of complex topological knots made from hyper-conductive isotopic copper. They force the second law of thermodynamics to run in reverse locally.",
        "copper",
        "Locally reverses thermodynamic time arrow.",
        8,
        ["Probability Distributor", "Multiverse Fabricator", "Chrono-Synclastic Infundibulum"],
        "Thermodynamics equalize instantly, superheating the core to Planck temperatures.",
        ["Multiverse Fabricator", "Omniversal Core / Singularity Heart"],
        {x: 0, y: 250, z: 0},
        {x: 0, y: 600, z: 0}
    );

    // 9. Dark Energy Reactor
    const darkEnergyGroup = new THREE.Group();
    const dodecaGeom = new THREE.DodecahedronGeometry(80, 2);
    const darkEnergyMesh = new THREE.Mesh(dodecaGeom, voidMaterial);
    const darkWireGeom = new THREE.DodecahedronGeometry(85, 2);
    const darkWireMesh = new THREE.Mesh(darkWireGeom, tachyonMaterial);
    darkEnergyGroup.add(darkEnergyMesh);
    darkEnergyGroup.add(darkWireMesh);
    transformers.push({ mesh: darkEnergyGroup, baseScale: 1.0, amplitude: 0.2, speed: 0.05 });
    
    addPart(
        "Dark Energy Reactor",
        darkEnergyGroup,
        "Contains and refines the cosmological constant. By modifying the expansion rate of space inside the reactor, it provides infinite kinetic energy.",
        "voidMaterial & tachyonMaterial",
        "Provides infinite kinetic scaling by utilizing spatial expansion.",
        9,
        ["Omniversal Core / Singularity Heart", "String Theory Resonator"],
        "Runaway spatial expansion; the Nexus rips itself apart at the atomic level (Big Rip).",
        ["String Theory Resonator", "Hyper-Spatial Lattice"],
        {x: 0, y: -250, z: 0},
        {x: 0, y: -600, z: 0}
    );

    // 10. Chrono-Synclastic Infundibulum
    const chronoGroup = new THREE.Group();
    const hourglassPoints = [];
    for(let i=0; i<=50; i++) {
        const t = i / 50;
        const radius = 5 + Math.pow(Math.abs(t - 0.5) * 2, 2) * 100;
        hourglassPoints.push(new THREE.Vector2(radius, (t - 0.5) * 300));
    }
    const hourglassGeom = new THREE.LatheGeometry(hourglassPoints, 64);
    const hourglassMesh = new THREE.Mesh(hourglassGeom, tinted);
    
    // Sand particles (tachyon flows)
    const sandCount = 5000;
    const sandGeom = new THREE.SphereGeometry(2, 4, 4);
    const sandInstanced = new THREE.InstancedMesh(sandGeom, chronosMaterial, sandCount);
    const sandPositions = [];
    for(let i=0; i<sandCount; i++) {
        sandPositions.push({
            r: Math.random(),
            theta: Math.random() * Math.PI * 2,
            h: Math.random(),
            speed: 0.001 + Math.random() * 0.004
        });
    }
    instancedArrays.push({
        mesh: sandInstanced,
        data: sandPositions,
        dummy: new THREE.Object3D(),
        type: 'hourglass',
        height: 300
    });
    
    chronoGroup.add(hourglassMesh);
    chronoGroup.add(sandInstanced);
    chronoGroup.rotation.z = Math.PI / 4;
    rotators.push({ mesh: chronoGroup, axis: new THREE.Vector3(0, 0, 1), speed: 0.005 });
    
    addPart(
        "Chrono-Synclastic Infundibulum",
        chronoGroup,
        "A physical intersection where all different truths fit together exactly as well as the parts of a solar watch. Contains tachyon sands flowing backward and forward simultaneously.",
        "tinted glass & chronosMaterial",
        "Harmonizes contradictory timeline truths to prevent logical paradox fractures.",
        10,
        ["Entropy Reverser", "Many-Worlds Branching Array"],
        "Truth divergence; the Nexus schisms into multiple contradictory states.",
        ["Many-Worlds Branching Array", "Observer Effect Stabilizer"],
        {x: 400, y: 0, z: 0},
        {x: 800, y: 0, z: 0}
    );

    // 11. Vacuum Energy Extractor (Pistons within Pistons)
    const vacGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const outerCylGeom = new THREE.CylinderGeometry(20, 20, 150, 16);
        const outerCyl = new THREE.Mesh(outerCylGeom, aluminum);
        
        const innerCylGeom = new THREE.CylinderGeometry(15, 15, 160, 16);
        const innerCyl = new THREE.Mesh(innerCylGeom, darkSteel);
        
        const rodGeom = new THREE.CylinderGeometry(5, 5, 200, 16);
        const rod = new THREE.Mesh(rodGeom, chrome);
        
        const pistonGroup = new THREE.Group();
        pistonGroup.add(outerCyl);
        pistonGroup.add(innerCyl);
        pistonGroup.add(rod);
        
        // Piston animation data
        transformers.push({
            mesh: innerCyl,
            type: 'translateY',
            baseValue: 0,
            amplitude: 40,
            speed: 0.1,
            phase: angle
        });
        transformers.push({
            mesh: rod,
            type: 'translateY',
            baseValue: 0,
            amplitude: 80,
            speed: 0.1,
            phase: angle
        });
        
        pistonGroup.position.set(Math.cos(angle) * 350, -100, Math.sin(angle) * 350);
        
        // Complex hydraulic lines
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -75, 20),
            new THREE.Vector3(0, -150, 50),
            new THREE.Vector3(-Math.cos(angle)*150, -200, -Math.sin(angle)*150)
        ]);
        const lineGeom = new THREE.TubeGeometry(lineCurve, 20, 2, 8, false);
        const lineMesh = new THREE.Mesh(lineGeom, rubber);
        pistonGroup.add(lineMesh);
        
        vacGroup.add(pistonGroup);
    }
    
    addPart(
        "Vacuum Energy Extractor Array",
        vacGroup,
        "Massive, hyper-dense hydraulic pistons that literally pump zero-point energy out of the quantum vacuum, relying on the Casimir effect amplified to macro scales.",
        "aluminum, darkSteel, chrome, rubber",
        "Provides foundational baseline power to the entire Nexus.",
        11,
        ["Quantum Foam Stabilizer", "Hyper-Spatial Lattice"],
        "Pistons seize, causing a localized drop to absolute zero.",
        ["Quantum Foam Stabilizer", "Hyper-Spatial Lattice"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: -400, z: 0}
    );

    // 12. Parallel Universe Manifold
    const manifoldGroup = new THREE.Group();
    const manifoldRadius = 500;
    const ringCount = 12;
    for(let i=0; i<ringCount; i++) {
        const ringGeom = new THREE.TorusGeometry(manifoldRadius, 10, 32, 100);
        const ringMesh = new THREE.Mesh(ringGeom, glass);
        ringMesh.rotation.x = Math.random() * Math.PI;
        ringMesh.rotation.y = Math.random() * Math.PI;
        rotators.push({ mesh: ringMesh, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 0.002 + Math.random() * 0.005 });
        
        // Inner data glowing ring
        const innerRingGeom = new THREE.TorusGeometry(manifoldRadius, 2, 16, 100);
        const innerRingMesh = new THREE.Mesh(innerRingGeom, timelineMaterial);
        ringMesh.add(innerRingMesh);
        
        manifoldGroup.add(ringMesh);
    }
    
    addPart(
        "Parallel Universe Manifold",
        manifoldGroup,
        "A gimbal-like array of immense glass and energy rings. Each ring aligns the Nexus with a different fundamental cluster of parallel universes.",
        "glass & timelineMaterial",
        "Multiverse targeting and alignment coordination.",
        12,
        ["Multiverse Fabricator", "Dimensional Anchor"],
        "Nexus loses lock on the prime reality, drifting into chaotic, unstructured nothingness.",
        ["Dimensional Anchor", "Omniversal Core / Singularity Heart"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 13. Hyper-Spatial Lattice
    const latticeGroup = new THREE.Group();
    const latticeSize = 400;
    const strutRadius = 3;
    for(let x=-1; x<=1; x++) {
        for(let y=-1; y<=1; y++) {
            for(let z=-1; z<=1; z++) {
                if(x===0 && y===0 && z===0) continue;
                const nodeGeom = new THREE.OctahedronGeometry(15, 1);
                const nodeMesh = new THREE.Mesh(nodeGeom, chrome);
                nodeMesh.position.set(x * latticeSize, y * latticeSize, z * latticeSize);
                
                // Pulsing nodes
                const glowNode = new THREE.Mesh(new THREE.OctahedronGeometry(18, 1), tachyonMaterial);
                nodeMesh.add(glowNode);
                transformers.push({ mesh: glowNode, baseScale: 1.0, amplitude: 0.3, speed: 0.1 });
                
                latticeGroup.add(nodeMesh);
                
                // Add connections to center
                const dist = Math.sqrt(x*x*latticeSize*latticeSize + y*y*latticeSize*latticeSize + z*z*latticeSize*latticeSize);
                const strutGeom = new THREE.CylinderGeometry(strutRadius, strutRadius, dist, 8);
                const strutMesh = new THREE.Mesh(strutGeom, steel);
                strutMesh.position.copy(nodeMesh.position).multiplyScalar(0.5);
                strutMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nodeMesh.position.clone().normalize());
                latticeGroup.add(strutMesh);
            }
        }
    }
    rotators.push({ mesh: latticeGroup, axis: new THREE.Vector3(1, 0, 0), speed: 0.001 });
    
    addPart(
        "Hyper-Spatial Lattice",
        latticeGroup,
        "The skeletal structure of the Nexus, woven from super-strings and bucky-tubes of dark matter. It maintains structural integrity across 11 dimensions.",
        "chrome, steel, tachyonMaterial",
        "Structural support against multi-dimensional collapsing forces.",
        13,
        ["Vacuum Energy Extractor", "Dark Energy Reactor"],
        "Complete structural spaghettification via tidal forces.",
        ["Vacuum Energy Extractor", "Dark Energy Reactor", "Tesseract Frame Alpha"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 14. String Theory Resonator
    const resonatorGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(60, 2, 100, 16, i%5+1, i%7+2), quantumFoamMaterial);
        knot.position.set(Math.sin(i)*150, Math.cos(i)*150, Math.sin(i*2)*150);
        knot.rotation.set(Math.random(), Math.random(), Math.random());
        rotators.push({ mesh: knot, axis: new THREE.Vector3(0, 1, 0), speed: 0.05 });
        resonatorGroup.add(knot);
    }
    
    addPart(
        "String Theory Resonator",
        resonatorGroup,
        "Plucks the fundamental 1D strings that make up all particles, playing a cosmic symphony that dictates local physical constants (speed of light, gravity).",
        "quantumFoamMaterial",
        "Calibration of universal constants.",
        14,
        ["Dark Energy Reactor", "Multiverse Fabricator"],
        "Physical constants randomize; gravity repels, light freezes.",
        ["Dark Energy Reactor", "Omniversal Core / Singularity Heart"],
        {x: 0, y: -400, z: 200},
        {x: 0, y: -800, z: 400}
    );

    // 15. Tachyon Collector
    const tachyonGroup = new THREE.Group();
    const dishGeom = new THREE.LatheGeometry(
        new Array(20).fill(0).map((_, i) => new THREE.Vector2(i * 10, Math.pow(i, 2) * 0.5)),
        64
    );
    const dishMesh = new THREE.Mesh(dishGeom, plastic);
    dishMesh.rotation.x = -Math.PI / 2;
    tachyonGroup.add(dishMesh);
    
    // Glowing receiver
    const receiverGeom = new THREE.CylinderGeometry(5, 0, 150, 16);
    const receiverMesh = new THREE.Mesh(receiverGeom, chronosMaterial);
    receiverMesh.position.y = 150;
    tachyonGroup.add(receiverMesh);
    
    addPart(
        "Tachyon Collector Dish",
        tachyonGroup,
        "A massive parabolic antenna made from metamaterials with a negative index of refraction. Captures tachyons sent from the distant future.",
        "plastic & chronosMaterial",
        "Receives updates and warnings from future iterations of the Nexus.",
        15,
        ["Observer Effect Stabilizer"],
        "Temporal blindness; Nexus can no longer predict multiversal shifts.",
        ["Observer Effect Stabilizer", "Probability Distributor"],
        {x: -400, y: 300, z: 0},
        {x: -800, y: 600, z: 0}
    );

    // 16. Observer Effect Stabilizer (Array of "Eyes")
    const eyeGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const phi = Math.acos( - 1 + ( 2 * i ) / 12 );
        const theta = Math.sqrt( 12 * Math.PI ) * phi;
        const x = 600 * Math.cos( theta ) * Math.sin( phi );
        const y = 600 * Math.sin( theta ) * Math.sin( phi );
        const z = 600 * Math.cos( phi );
        
        const eyeBase = new THREE.Mesh(new THREE.CylinderGeometry(30, 20, 40, 16), darkSteel);
        const lens = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 32, 0, Math.PI*2, 0, Math.PI/2), tinted);
        lens.position.y = 20;
        
        // Pupil laser
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2000, 8), tachyonMaterial);
        laser.position.y = 1000;
        laser.visible = false; // toggled in animation
        lens.add(laser);
        
        const eyeNode = new THREE.Group();
        eyeNode.add(eyeBase);
        eyeNode.add(lens);
        eyeNode.position.set(x, y, z);
        eyeNode.lookAt(new THREE.Vector3(0,0,0)); // Look at core
        eyeNode.rotateX(Math.PI/2);
        
        eyeGroup.add(eyeNode);
        
        // Add to animation array for erratic twitching and laser flashing
        transformers.push({
            mesh: eyeNode,
            type: 'lookAtNoise',
            target: new THREE.Vector3(0,0,0),
            speed: 0.05,
            laser: laser
        });
    }
    
    addPart(
        "Observer Effect Stabilizer Array",
        eyeGroup,
        "Mechanical consciousness nodes that constantly observe the Nexus. By collapsing quantum wave functions into definitive states, they prevent the machine from existing as a cloud of probability.",
        "darkSteel, tinted glass, tachyonMaterial",
        "Enforces objective reality through constant conscious observation.",
        16,
        ["Tachyon Collector", "Chrono-Synclastic Infundibulum"],
        "Nexus phases out of reality into a superposition state, disappearing entirely.",
        ["Omniversal Core / Singularity Heart", "All Systems"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 17. Many-Worlds Branching Array
    const branchGroup = new THREE.Group();
    function createFractalBranch(depth, size) {
        if(depth === 0) return new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), timelineMaterial);
        
        const g = new THREE.Group();
        const baseGeom = new THREE.CylinderGeometry(size*0.5, size, size*3, 8);
        const baseMesh = new THREE.Mesh(baseGeom, copper);
        baseMesh.position.y = size*1.5;
        g.add(baseMesh);
        
        const branchA = createFractalBranch(depth - 1, size * 0.7);
        branchA.position.y = size * 3;
        branchA.rotation.z = Math.PI / 4;
        branchA.rotation.x = Math.random() * Math.PI / 4;
        g.add(branchA);
        
        const branchB = createFractalBranch(depth - 1, size * 0.7);
        branchB.position.y = size * 3;
        branchB.rotation.z = -Math.PI / 4;
        branchB.rotation.x = Math.random() * Math.PI / 4;
        g.add(branchB);
        
        return g;
    }
    
    for(let i=0; i<4; i++) {
        const tree = createFractalBranch(6, 20);
        tree.rotation.y = (Math.PI / 2) * i;
        tree.position.set(Math.cos(tree.rotation.y)*400, 200, Math.sin(tree.rotation.y)*400);
        tree.rotation.x = Math.PI / 2; // point outward
        branchGroup.add(tree);
    }
    rotators.push({ mesh: branchGroup, axis: new THREE.Vector3(0, 1, 0), speed: 0.005 });
    
    addPart(
        "Many-Worlds Branching Array",
        branchGroup,
        "Fractal copper antennas that physically map the Hugh Everett Many-Worlds interpretation. They catalog and prune divergent timelines to prevent multiversal crowding.",
        "copper & timelineMaterial",
        "Pruning and cataloging of divergent quantum realities.",
        17,
        ["Timeline Siphon Array", "Chrono-Synclastic Infundibulum"],
        "Infinite timeline runaway; user drowns in quadrillions of alternate versions of themselves.",
        ["Timeline Siphon Array", "Omniversal Core / Singularity Heart"],
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 0}
    );

    // 18. Dimensional Anchor
    const anchorShape = new THREE.Shape();
    const innerRadius = 40;
    const outerRadius = 100;
    for(let i=0; i<8; i++) {
        const a = (i/8)*Math.PI*2;
        const a2 = ((i+0.5)/8)*Math.PI*2;
        anchorShape.lineTo(Math.cos(a)*outerRadius, Math.sin(a)*outerRadius);
        anchorShape.lineTo(Math.cos(a2)*innerRadius, Math.sin(a2)*innerRadius);
    }
    anchorShape.lineTo(outerRadius, 0);
    const anchorGeom = new THREE.ExtrudeGeometry(anchorShape, { depth: 50, bevelEnabled: true, bevelThickness: 5 });
    const anchorMesh = new THREE.Mesh(anchorGeom, darkSteel);
    anchorMesh.rotation.x = Math.PI / 2;
    
    addPart(
        "Dimensional Anchor Base",
        anchorMesh,
        "A hyper-dense mass of strange matter that pins the Nexus to a specific set of spatial dimensions, preventing it from floating off into the bulk (the higher-dimensional space).",
        "darkSteel",
        "Gravitational pinning to local spatial dimensions.",
        18,
        ["Parallel Universe Manifold", "Hyper-Spatial Lattice"],
        "Nexus detaches from reality, falling eternally through the bulk space.",
        ["Parallel Universe Manifold", "Tesseract Frame Alpha"],
        {x: 0, y: -700, z: 0},
        {x: 0, y: -1000, z: 0}
    );

    // ==========================================
    // QUIZ QUESTIONS (PHD LEVEL COSMOLOGY / MULTIVERSE THEORY)
    // ==========================================
    const quizQuestions = [
        {
            question: "Within the context of eternal inflation and the String Theory landscape, how does the Omniversal Core prevent the catastrophic decay of adjacent false vacua?",
            options: [
                "By continuously emitting Coleman-De Luccia tunneling suppression fields that raise the potential energy barrier between minima.",
                "By creating closed timelike curves that allow the false vacuum to decay before it actually decays, nullifying the event.",
                "By neutralizing the cosmological constant via Hawking radiation from localized micro-black holes.",
                "By converting all local vacuum energy directly into dark matter using the Penrose mechanism."
            ],
            correctAnswer: 0,
            explanation: "In eternal inflation, false vacua decay via quantum tunneling (described by Coleman-De Luccia instantons) creating expanding bubbles of lower-energy true vacuum. The Core suppresses this by artificially raising the potential energy barrier in the scalar field landscape."
        },
        {
            question: "How does the Chrono-Synclastic Infundibulum resolve the presence of closed timelike curves (CTCs) without violating the Novikov self-consistency principle?",
            options: [
                "It uses quantum decoherence to split the universe into orthogonal Hilbert spaces, preventing any interaction between past and future states.",
                "It enforces a boundary condition where any traversing particle's wave function perfectly interferes destructively with any paradox-causing outcome.",
                "It accelerates the tachyon flow until the CTC collapses into a naked singularity, erasing the timeline.",
                "It relies on the observer effect to forcibly collapse the CTC into a linear causal chain."
            ],
            correctAnswer: 1,
            explanation: "The Novikov self-consistency principle asserts that the probability of an event causing a paradox is zero. The Infundibulum enforces this mathematically by ensuring destructive quantum interference for any path through the CTC that would result in a paradox."
        },
        {
            question: "If the Dark Energy Reactor manipulates the scale factor $a(t)$ in the FLRW metric, what is the consequence on the local Hubble parameter $H$ when drawing infinite kinetic energy?",
            options: [
                "$H$ approaches zero, causing a localized 'Big Crunch' as kinetic energy is extracted.",
                "$H$ becomes negative, leading to spontaneous proton decay and baryon asymmetry.",
                "$H$ diverges to infinity in finite time, risking a localized 'Big Rip' scenario where atoms are torn apart.",
                "$H$ oscillates harmonically, creating gravitational wave resonance capable of shattering the Hyper-Spatial Lattice."
            ],
            correctAnswer: 2,
            explanation: "Extracting infinite kinetic energy by accelerating spatial expansion means increasing the scale factor exponentially. If $\\dot{a}/a = H$ diverges to infinity, phantom dark energy dominates, leading to a Big Rip where all bound structures (even atoms) are torn apart."
        },
        {
            question: "By what mechanism does the Quantum Foam Stabilizer bypass the Bekenstein bound when storing multiversal informational states?",
            options: [
                "It maps the information onto a 2D holographic boundary located at cosmological infinity.",
                "It utilizes anti-de Sitter (AdS) space geometry, allowing infinite information volume within a finite surface area.",
                "It leverages entanglement entropy across disconnected multiverse bubbles, distributing the informational load beyond the local Hubble volume.",
                "It doesn't; it simply deletes older universes to make room for new data streams."
            ],
            correctAnswer: 2,
            explanation: "The Bekenstein bound limits the entropy/information that can be contained in a finite spatial region. By entangling the local foam with disconnected multiverse bubbles, the informational state spans across non-local volumes, effectively bypassing the local Bekenstein limit."
        },
        {
            question: "When the Many-Worlds Branching Array catalogs divergent timelines via quantum decoherence, how does it manage the exponential scaling of Hilbert space dimensionality?",
            options: [
                "By continuously calculating the inner product of diverging states and collapsing those with a magnitude below the Planck scale.",
                "By employing a Non-Abelian gauge field to forcefully compactify extra dimensions, hiding the branches.",
                "By utilizing algorithmic complexity theory to identify and merge isomorphic realities, thus pruning the wave function mathematically.",
                "By injecting pure entropy into the system until the dimensionality overflows back to zero."
            ],
            correctAnswer: 2,
            explanation: "Because the Many-Worlds interpretation implies an exponentially growing Hilbert space of states, physical cataloging is impossible without pruning. Identifying isomorphic (structurally identical or statistically indistinguishable) realities and mathematically tracing them as a single tensor state prevents dimensionality overflow."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // 1. Rotate everything in the rotators array
        rotators.forEach(r => {
            r.mesh.rotateOnWorldAxis(r.axis, r.speed);
        });

        // 2. Transform items (Dark energy pulsing, Pistons pumping)
        transformers.forEach(t => {
            if(t.baseScale !== undefined) {
                const scale = t.baseScale + Math.sin(time * t.speed * 100) * t.amplitude;
                t.mesh.scale.set(scale, scale, scale);
            }
            if(t.type === 'translateY') {
                t.mesh.position.y = t.baseValue + Math.sin(time * t.speed * 100 + t.phase) * t.amplitude;
            }
            if(t.type === 'lookAtNoise') {
                // Erratic twitching for the Observer Eyes
                const targetX = Math.sin(time * t.speed * 100) * 100 + Math.random() * 20;
                const targetY = Math.cos(time * t.speed * 130) * 100 + Math.random() * 20;
                const targetZ = Math.sin(time * t.speed * 170) * 100 + Math.random() * 20;
                t.target.set(targetX, targetY, targetZ);
                t.mesh.lookAt(t.target);
                
                // Random laser flashes
                if(Math.random() < 0.05) {
                    t.laser.visible = true;
                } else {
                    t.laser.visible = false;
                }
            }
        });

        // 3. Animate Timeline Streams (Opacity and Scale pulsing simulating data flow)
        timeStreams.forEach(stream => {
            const flow = (Math.sin(time * stream.speed * 100 + stream.phase) + 1) / 2;
            stream.mesh.scale.setScalar(0.8 + flow * 0.4);
            stream.mesh.material.opacity = 0.3 + flow * 0.7;
        });

        // 4. Update Instanced Meshes (Quantum Foam and Chrono Sand)
        instancedArrays.forEach(inst => {
            if(inst.type === 'foam') {
                inst.data.forEach((d, i) => {
                    const jitter = Math.sin(time * d.speed * 200 + d.phase) * 5;
                    inst.dummy.position.set(d.x + jitter, d.y + jitter, d.z + jitter);
                    inst.dummy.rotation.x += d.speed;
                    inst.dummy.rotation.y += d.speed;
                    inst.dummy.updateMatrix();
                    inst.mesh.setMatrixAt(i, inst.dummy.matrix);
                });
                inst.mesh.instanceMatrix.needsUpdate = true;
            }
            if(inst.type === 'hourglass') {
                inst.data.forEach((d, i) => {
                    // Flowing through the hourglass shape
                    d.h -= d.speed;
                    if(d.h < 0) d.h = 1.0; // reset
                    
                    const tVal = d.h;
                    // match the hourglass radius math
                    const radius = (5 + Math.pow(Math.abs(tVal - 0.5) * 2, 2) * 100) * d.r;
                    const yPos = (tVal - 0.5) * inst.height;
                    
                    const xPos = Math.cos(d.theta) * radius;
                    const zPos = Math.sin(d.theta) * radius;
                    
                    inst.dummy.position.set(xPos, yPos, zPos);
                    inst.dummy.updateMatrix();
                    inst.mesh.setMatrixAt(i, inst.dummy.matrix);
                });
                inst.mesh.instanceMatrix.needsUpdate = true;
            }
        });

        // 5. Pulse Material Emissive Intensities
        pulsingMaterials.forEach((mat, i) => {
            // Complex interference pattern for pulsing
            const intensity = Math.abs(Math.sin(time * 2 + i)) * 2 + Math.abs(Math.cos(time * 5 + i)) * 3;
            mat.emissiveIntensity = intensity;
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
