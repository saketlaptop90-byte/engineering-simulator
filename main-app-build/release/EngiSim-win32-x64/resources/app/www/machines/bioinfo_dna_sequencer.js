import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing/neon materials
    const laserMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const indicatorMatOn = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    // Base platform
    const baseGeo = new THREE.BoxGeometry(6, 0.5, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Frame",
        mesh: baseMesh,
        description: "Heavy-duty vibration isolation base to ensure stable optical reading.",
        material: "darkSteel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Optical Assembly", "Fluidics Chamber"],
        failureEffect: "Misalignment of optics.",
        cascadeFailures: ["Laser drift", "Read errors"],
        originalPosition: {x: 0, y: -0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // Optical Assembly
    const opticsGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const opticsMesh = new THREE.Mesh(opticsGeo, aluminum);
    opticsMesh.position.set(-1.5, 1, 0);
    group.add(opticsMesh);
    parts.push({
        name: "Laser Optics Assembly",
        mesh: opticsMesh,
        description: "Contains the high-precision laser array for exciting fluorophores.",
        material: "aluminum",
        function: "Fluorescence excitation",
        assemblyOrder: 2,
        connections: ["Main Frame", "Laser Diode"],
        failureEffect: "Incomplete fluorescence.",
        cascadeFailures: ["Signal dropout"],
        originalPosition: {x: -1.5, y: 1, z: 0},
        explodedPosition: {x: -3, y: 3, z: 0}
    });

    // Flow Cell Stage
    const flowCellStageGeo = new THREE.BoxGeometry(2, 0.2, 1.5);
    const flowCellStageMesh = new THREE.Mesh(flowCellStageGeo, chrome);
    flowCellStageMesh.position.set(0, 0.1, 0);
    group.add(flowCellStageMesh);
    parts.push({
        name: "Flow Cell Stage",
        mesh: flowCellStageMesh,
        description: "Precision motorized stage holding the DNA flow cell.",
        material: "chrome",
        function: "Sample positioning",
        assemblyOrder: 3,
        connections: ["Main Frame"],
        failureEffect: "Stage jammed.",
        cascadeFailures: ["Focus lost", "Image blurring"],
        originalPosition: {x: 0, y: 0.1, z: 0},
        explodedPosition: {x: 0, y: 1, z: 2}
    });

    // Flow Cell
    const flowCellGeo = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const flowCellMesh = new THREE.Mesh(flowCellGeo, glass);
    flowCellMesh.position.set(0, 0.225, 0);
    group.add(flowCellMesh);
    parts.push({
        name: "DNA Flow Cell",
        mesh: flowCellMesh,
        description: "Glass slide with nano-wells containing synthesized DNA clusters.",
        material: "glass",
        function: "Reaction chamber",
        assemblyOrder: 4,
        connections: ["Flow Cell Stage", "Fluidics Lines"],
        failureEffect: "Leakage or clumping.",
        cascadeFailures: ["Cross-contamination", "Low quality score"],
        originalPosition: {x: 0, y: 0.225, z: 0},
        explodedPosition: {x: 0, y: 2, z: 2}
    });

    // Camera Detector
    const cameraGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const cameraMesh = new THREE.Mesh(cameraGeo, steel);
    cameraMesh.position.set(1.5, 1.25, 0);
    group.add(cameraMesh);
    parts.push({
        name: "CMOS Detector",
        mesh: cameraMesh,
        description: "High-speed, ultra-sensitive imaging sensor.",
        material: "steel",
        function: "Signal detection",
        assemblyOrder: 5,
        connections: ["Main Frame", "Optics"],
        failureEffect: "Dead pixels.",
        cascadeFailures: ["Sequence gaps", "Data corruption"],
        originalPosition: {x: 1.5, y: 1.25, z: 0},
        explodedPosition: {x: 3, y: 3, z: 0}
    });

    // Fluidics Pump
    const pumpGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
    const pumpMesh = new THREE.Mesh(pumpGeo, plastic);
    pumpMesh.rotation.z = Math.PI / 2;
    pumpMesh.position.set(0, 0.5, -1);
    group.add(pumpMesh);
    parts.push({
        name: "Reagent Pump",
        mesh: pumpMesh,
        description: "Syringe pump that drives nucleotides and enzymes across the flow cell.",
        material: "plastic",
        function: "Fluid delivery",
        assemblyOrder: 6,
        connections: ["Main Frame", "Reagent Bottles"],
        failureEffect: "Uneven fluid delivery.",
        cascadeFailures: ["Phasing errors", "Reaction failure"],
        originalPosition: {x: 0, y: 0.5, z: -1},
        explodedPosition: {x: 0, y: 0.5, z: -3}
    });

    // Laser Beam (Animated)
    const laserBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const laserBeamMesh = new THREE.Mesh(laserBeamGeo, laserMaterial);
    laserBeamMesh.rotation.z = Math.PI / 2;
    laserBeamMesh.position.set(-0.75, 0.225, 0);
    group.add(laserBeamMesh);
    parts.push({
        name: "Excitation Laser Beam",
        mesh: laserBeamMesh,
        description: "Coherent light to trigger fluorophore emission.",
        material: "laserMaterial",
        function: "Energy transfer",
        assemblyOrder: 7,
        connections: ["Laser Optics Assembly"],
        failureEffect: "Laser attenuation.",
        cascadeFailures: ["Low signal-to-noise ratio"],
        originalPosition: {x: -0.75, y: 0.225, z: 0},
        explodedPosition: {x: -2, y: 0.225, z: 0}
    });

    const description = "The Automated DNA Sequencer uses fluorescently labeled nucleotides and high-resolution optics to " +
        "read DNA sequences in real-time. The process involves fluidic delivery of reagents, laser excitation, and CMOS detection.";

    const quizQuestions = [
        {
            question: "What is the primary function of the CMOS detector in a DNA sequencer?",
            options: [
                "To synthesize DNA strands",
                "To capture images of fluorescent emissions",
                "To control the temperature of the flow cell",
                "To pump reagents into the system"
            ],
            correct: 1,
            explanation: "The CMOS detector captures the fluorescent signals emitted by the incorporated nucleotides, allowing the system to identify the sequence.",
            difficulty: "Medium"
        },
        {
            question: "What failure might occur if the Flow Cell Stage is jammed?",
            options: [
                "Reagent leakage",
                "Focus lost and image blurring",
                "Laser wavelength shift",
                "Dead pixels on the detector"
            ],
            correct: 1,
            explanation: "The stage must move with nanometer precision. A jam causes the flow cell to lose focus relative to the fixed optics, causing image blurring.",
            difficulty: "Hard"
        },
        {
            question: "Which component is responsible for delivering nucleotides across the Flow Cell?",
            options: [
                "CMOS Detector",
                "Laser Optics Assembly",
                "Reagent Pump",
                "Main Frame"
            ],
            correct: 2,
            explanation: "The reagent pump precisely drives the different nucleotide solutions across the flow cell during sequencing cycles.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the laser beam pulsing
        if (meshes["Excitation Laser Beam"]) {
            const laser = meshes["Excitation Laser Beam"];
            laser.material.opacity = 0.5 + 0.5 * Math.sin(time * speed * 5);
        }
        // Animate the flow cell stage moving slightly back and forth
        if (meshes["Flow Cell Stage"] && meshes["DNA Flow Cell"]) {
            const offset = Math.sin(time * speed) * 0.2;
            meshes["Flow Cell Stage"].position.x = offset;
            meshes["DNA Flow Cell"].position.x = offset;
            if (meshes["Excitation Laser Beam"]) {
               meshes["Excitation Laser Beam"].position.x = -0.75 + offset / 2; // Keep beam aligned roughly
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDNASequencer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
