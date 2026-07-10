import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const laserMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const flowCellGlow = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const fluorophoreA = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.5 });
    const fluorophoreT = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const fluorophoreC = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 1.5 });
    const fluorophoreG = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 1.5 });

    // 1. Base / Main Chassis
    const baseGeo = new THREE.BoxGeometry(10, 2, 8);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Chassis",
        description: "The primary structural housing and vibration-isolation platform.",
        material: "Dark Steel",
        function: "Provides a stable platform, crucial for nanoscale optical alignment.",
        assemblyOrder: 1,
        connections: ["Flow Cell Deck", "Optical Module"],
        failureEffect: "Misalignment of optical components.",
        cascadeFailures: ["Laser Focus Lost", "Data Corruption"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Flow Cell Deck
    const deckGeo = new THREE.BoxGeometry(6, 0.5, 4);
    const deckMesh = new THREE.Mesh(deckGeo, aluminum);
    deckMesh.position.set(-1, 2.25, 1);
    group.add(deckMesh);
    parts.push({
        name: "Flow Cell Deck",
        description: "Thermal controlled stage where the sequencing flow cell is mounted.",
        material: "Aluminum",
        function: "Maintains precise temperature for enzymatic reactions and secures the flow cell.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Flow Cell"],
        failureEffect: "Enzyme activity halts or optics go out of focus due to thermal expansion.",
        cascadeFailures: ["Sequencing Run Fails"],
        originalPosition: { x: -1, y: 2.25, z: 1 },
        explodedPosition: { x: -1, y: 4, z: 1 },
        mesh: deckMesh
    });

    // 3. Flow Cell (Glass slide with glowing lanes)
    const flowCellGeo = new THREE.BoxGeometry(3, 0.1, 2);
    const flowCellMesh = new THREE.Mesh(flowCellGeo, tinted);
    flowCellMesh.position.set(-1, 2.55, 1);
    group.add(flowCellMesh);
    
    // Add glowing lanes inside flow cell
    for(let i=0; i<4; i++) {
        const laneGeo = new THREE.BoxGeometry(2.8, 0.11, 0.2);
        const laneMesh = new THREE.Mesh(laneGeo, flowCellGlow);
        laneMesh.position.set(0, 0, -0.6 + i*0.4);
        flowCellMesh.add(laneMesh);
    }

    parts.push({
        name: "Flow Cell",
        description: "A glass slide with microfluidic channels containing millions of DNA clusters.",
        material: "Tinted Glass / Silicon",
        function: "Hosts the sequencing-by-synthesis reaction. DNA strands are immobilized here.",
        assemblyOrder: 3,
        connections: ["Flow Cell Deck", "Microfluidic Pumps"],
        failureEffect: "Reagents leak or optical clarity is lost.",
        cascadeFailures: ["Total Run Failure"],
        originalPosition: { x: -1, y: 2.55, z: 1 },
        explodedPosition: { x: -1, y: 6, z: 1 },
        mesh: flowCellMesh
    });

    // 4. Optical Module (Lenses, lasers, cameras)
    const opticsGeo = new THREE.CylinderGeometry(1, 1, 3, 32);
    const opticsMesh = new THREE.Mesh(opticsGeo, chrome);
    opticsMesh.position.set(-1, 4.5, 1);
    group.add(opticsMesh);

    // Laser beam
    const laserBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.9, 16);
    const laserBeamMesh = new THREE.Mesh(laserBeamGeo, laserMaterial);
    laserBeamMesh.position.set(0, -1.5, 0); // relative to optics
    laserBeamMesh.name = "laserBeam";
    opticsMesh.add(laserBeamMesh);

    parts.push({
        name: "Optical Imaging System",
        description: "High-resolution objective lens, excitation lasers, and CCD/CMOS sensors.",
        material: "Chrome / Glass",
        function: "Excites fluorophores on incorporated nucleotides and records the emission spectra.",
        assemblyOrder: 4,
        connections: ["Main Chassis"],
        failureEffect: "No signal detected or blurred images.",
        cascadeFailures: ["High Error Rate", "Low Quality Scores"],
        originalPosition: { x: -1, y: 4.5, z: 1 },
        explodedPosition: { x: -1, y: 9, z: 1 },
        mesh: opticsMesh
    });

    // 5. Reagent Cartridge & Pumps
    const reagentGeo = new THREE.BoxGeometry(3, 4, 3);
    const reagentMesh = new THREE.Mesh(reagentGeo, plastic);
    reagentMesh.position.set(3, 4, -1);
    group.add(reagentMesh);
    parts.push({
        name: "Reagent Cartridge",
        description: "Stores dNTPs, polymerase, wash buffers, and cleavage enzymes.",
        material: "Plastic",
        function: "Delivers exact volumes of chemicals to the flow cell in timed cycles.",
        assemblyOrder: 5,
        connections: ["Main Chassis", "Flow Cell"],
        failureEffect: "Incomplete incorporation or poor washing.",
        cascadeFailures: ["Phasing/Pre-phasing errors", "Loss of signal"],
        originalPosition: { x: 3, y: 4, z: -1 },
        explodedPosition: { x: 7, y: 4, z: -1 },
        mesh: reagentMesh
    });

    // 6. Microfluidic Tubes
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(3, 2.5, -1),
        new THREE.Vector3(1, 2.5, 0),
        new THREE.Vector3(-0.5, 2.55, 1)
    );
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, rubber);
    group.add(tubeMesh);
    parts.push({
        name: "Microfluidic Tubing",
        description: "Precision capillary tubes connecting reagents to the flow cell.",
        material: "Rubber / Teflon",
        function: "Transports fluids without introducing air bubbles.",
        assemblyOrder: 6,
        connections: ["Reagent Cartridge", "Flow Cell"],
        failureEffect: "Air bubbles enter the flow cell.",
        cascadeFailures: ["Optical occlusion", "Cluster death"],
        originalPosition: { x: 0, y: 0, z: 0 }, // Relative to curve
        explodedPosition: { x: 3, y: 3, z: 1 },
        mesh: tubeMesh
    });

    // Fluorophores array (floating inside flow cell area for animation)
    const fluorophores = new THREE.Group();
    fluorophores.position.set(-1, 2.65, 1);
    group.add(fluorophores);
    
    const fluoMats = [fluorophoreA, fluorophoreT, fluorophoreC, fluorophoreG];
    for(let i=0; i<20; i++) {
        const fluoGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const fluoMesh = new THREE.Mesh(fluoGeo, fluoMats[Math.floor(Math.random()*4)]);
        fluoMesh.position.set((Math.random()-0.5)*2, 0, (Math.random()-0.5)*1.5);
        fluoMesh.userData = { offset: Math.random() * Math.PI * 2, speed: Math.random() * 2 + 1 };
        fluorophores.add(fluoMesh);
    }

    const description = "Next-Generation DNA Sequencer. Utilizes sequencing-by-synthesis (SBS). It flows fluorescently labeled nucleotides over a flow cell containing DNA clusters, using lasers to excite the fluorophores and a camera to record the sequence base-by-base.";

    const quizQuestions = [
        {
            question: "In sequencing-by-synthesis, what causes the newly incorporated nucleotide to emit light?",
            options: [
                "Bioluminescence from enzymes",
                "Excitation of a fluorophore by a laser",
                "Radioactive decay",
                "Heat from the thermal block"
            ],
            correct: 1,
            explanation: "Each nucleotide type (A, T, C, G) is attached to a specific fluorescent dye. The optical system's laser excites this dye, and the emitted light is captured by a camera.",
            difficulty: "Medium"
        },
        {
            question: "Why is the thermal control of the Flow Cell Deck critical?",
            options: [
                "To prevent the glass from shattering",
                "To keep the lasers from overheating",
                "To maintain optimal conditions for polymerase activity",
                "To boil off excess wash buffer"
            ],
            correct: 2,
            explanation: "Enzymes like DNA polymerase require very specific temperatures to function optimally during the incorporation step of sequencing.",
            difficulty: "Easy"
        },
        {
            question: "What is the consequence of an air bubble entering the microfluidic tubing?",
            options: [
                "It speeds up the sequencing run",
                "It acts as a lens and improves image quality",
                "It blocks reagents from reaching DNA clusters and causes optical artifacts",
                "It helps cool the flow cell"
            ],
            correct: 2,
            explanation: "Air bubbles displace the liquid reagents, preventing DNA synthesis in affected areas, and scatter the laser light, ruining the optical imaging for that section of the flow cell.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate fluorophores blinking / glowing
        fluorophores.children.forEach(fluo => {
            fluo.scale.setScalar(1 + 0.3 * Math.sin(time * speed * fluo.userData.speed + fluo.userData.offset));
            fluo.material.opacity = 0.5 + 0.5 * Math.sin(time * speed * fluo.userData.speed + fluo.userData.offset);
        });

        // Laser beam pulsing
        const laser = opticsMesh.getObjectByName("laserBeam");
        if (laser) {
            laser.material.opacity = 0.3 + 0.5 * Math.abs(Math.sin(time * speed * 4));
        }
        
        // Slight optical module scanning motion
        opticsMesh.position.x = -1 + 0.2 * Math.sin(time * speed * 0.5);
        if(laser) laser.position.x = 0; // keeps relative to optics
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDnaSequencer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
