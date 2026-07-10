import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for glowing effects
    const rfGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const gradientGlowMaterialX = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xaa0033,
        emissiveIntensity: 0.3,
        wireframe: true
    });
    
    const gradientGlowMaterialY = new THREE.MeshStandardMaterial({
        color: 0x00ff55,
        emissive: 0x00aa33,
        emissiveIntensity: 0.3,
        wireframe: true
    });

    const gradientGlowMaterialZ = new THREE.MeshStandardMaterial({
        color: 0x5500ff,
        emissive: 0x3300aa,
        emissiveIntensity: 0.3,
        wireframe: true
    });

    const superconMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc0c0c0,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const cryostatMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1.0,
        opacity: 0.9,
        transparent: true
    });

    // 1. Main Superconducting Magnet (Outer Cylinder)
    const magnetGeo = new THREE.CylinderGeometry(1.2, 1.4, 2.5, 64, 1, true);
    const magnet = new THREE.Mesh(magnetGeo, superconMaterial);
    magnet.rotation.z = Math.PI / 2;
    group.add(magnet);
    parts.push({
        name: "Superconducting Magnet",
        description: "Generates the main static magnetic field (B0).",
        material: "superconMaterial",
        function: "Aligns protons in the patient's body.",
        assemblyOrder: 1,
        connections: ["Cryostat"],
        failureEffect: "Quench (loss of superconductivity), rapid helium boil-off.",
        cascadeFailures: ["Complete system shutdown", "Cryostat venting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: magnet
    });

    // 2. Cryostat (Holds liquid helium)
    const cryostatGeo = new THREE.CylinderGeometry(1.4, 1.5, 2.6, 64, 1, true);
    const cryostat = new THREE.Mesh(cryostatGeo, cryostatMaterial);
    cryostat.rotation.z = Math.PI / 2;
    group.add(cryostat);
    parts.push({
        name: "Liquid Helium Cryostat",
        description: "Vessel containing liquid helium to keep the magnet at 4.2K.",
        material: "cryostatMaterial",
        function: "Maintains superconductivity.",
        assemblyOrder: 2,
        connections: ["Superconducting Magnet", "Cold Head"],
        failureEffect: "Magnet warms up, loses superconductivity.",
        cascadeFailures: ["Quench"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: cryostat
    });

    // 3. Gradient Coils (X, Y, Z)
    const gradientGroup = new THREE.Group();
    
    const gradXGeo = new THREE.CylinderGeometry(0.9, 0.95, 2.0, 32, 1, true);
    const gradX = new THREE.Mesh(gradXGeo, gradientGlowMaterialX);
    gradX.rotation.z = Math.PI / 2;
    gradientGroup.add(gradX);
    
    const gradYGeo = new THREE.CylinderGeometry(0.85, 0.9, 2.0, 32, 1, true);
    const gradY = new THREE.Mesh(gradYGeo, gradientGlowMaterialY);
    gradY.rotation.z = Math.PI / 2;
    gradientGroup.add(gradY);

    const gradZGeo = new THREE.CylinderGeometry(0.8, 0.85, 2.0, 32, 1, true);
    const gradZ = new THREE.Mesh(gradZGeo, gradientGlowMaterialZ);
    gradZ.rotation.z = Math.PI / 2;
    gradientGroup.add(gradZ);

    group.add(gradientGroup);
    parts.push({
        name: "Gradient Coil Assembly",
        description: "Three orthogonal coils (X, Y, Z) for spatial encoding.",
        material: "gradientGlowMaterial",
        function: "Linearly varies the magnetic field to locate signals.",
        assemblyOrder: 3,
        connections: ["RF Coil", "Gradient Amplifiers"],
        failureEffect: "Image distortion or loss of spatial resolution.",
        cascadeFailures: ["Acoustic noise increase", "Amplifier overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: gradientGroup
    });

    // 4. Body RF Coil (Radiofrequency Coil)
    const rfCoilGeo = new THREE.CylinderGeometry(0.7, 0.72, 1.8, 64, 4, true);
    const rfCoil = new THREE.Mesh(rfCoilGeo, rfGlowMaterial);
    rfCoil.rotation.z = Math.PI / 2;
    
    // Add "birdcage" rungs
    const rungsGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const rungGeo = new THREE.BoxGeometry(1.8, 0.02, 0.02);
        const rung = new THREE.Mesh(rungGeo, copper);
        rung.position.set(0, Math.sin(angle)*0.71, Math.cos(angle)*0.71);
        rungsGroup.add(rung);
    }
    rfCoil.add(rungsGroup);
    group.add(rfCoil);
    
    parts.push({
        name: "Body RF Coil (Birdcage)",
        description: "Transmits RF pulses and receives signals from the body.",
        material: "rfGlowMaterial, copper",
        function: "Excites protons and detects MR signal (B1 field).",
        assemblyOrder: 4,
        connections: ["Patient Table", "Gradient Coils"],
        failureEffect: "No signal transmission/reception (black image).",
        cascadeFailures: ["RF Amplifier damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: rfCoil
    });

    // 5. Patient Table
    const tableGeo = new THREE.BoxGeometry(3.0, 0.1, 0.6);
    const table = new THREE.Mesh(tableGeo, plastic);
    table.position.set(0, -0.4, 0);
    group.add(table);
    parts.push({
        name: "Motorized Patient Table",
        description: "Moves the patient precisely into the isocenter.",
        material: "plastic",
        function: "Patient positioning.",
        assemblyOrder: 5,
        connections: ["Gantry Base"],
        failureEffect: "Patient cannot be positioned.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.4, z: 0 },
        explodedPosition: { x: -3, y: -0.4, z: 0 },
        mesh: table
    });

    // 6. Cold Head (Cryocooler)
    const coldHeadGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const coldHead = new THREE.Mesh(coldHeadGeo, chrome);
    coldHead.position.set(0, 1.6, 0);
    group.add(coldHead);
    parts.push({
        name: "Cold Head (Cryocooler)",
        description: "Recondenses boiled-off helium gas back into liquid.",
        material: "chrome",
        function: "Zero-boil-off system maintenance.",
        assemblyOrder: 6,
        connections: ["Cryostat", "Helium Compressor"],
        failureEffect: "Helium boils off rapidly, pressure increases.",
        cascadeFailures: ["Quench"],
        originalPosition: { x: 0, y: 1.6, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: coldHead
    });

    // 7. Gantry Housing
    const housingGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 64);
    const housingMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1
    });
    
    // Use CSG or simply rings for housing
    const housingOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.8, 64, 1, true), housingMat);
    housingOuter.rotation.z = Math.PI / 2;
    
    const housingFront = new THREE.Mesh(new THREE.RingGeometry(0.65, 1.6, 64), housingMat);
    housingFront.position.x = 1.4;
    housingFront.rotation.y = Math.PI / 2;

    const housingBack = new THREE.Mesh(new THREE.RingGeometry(0.65, 1.6, 64), housingMat);
    housingBack.position.x = -1.4;
    housingBack.rotation.y = Math.PI / 2;

    const housingInner = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.8, 64, 1, true), housingMat);
    housingInner.rotation.z = Math.PI / 2;

    const housingGroup = new THREE.Group();
    housingGroup.add(housingOuter, housingFront, housingBack, housingInner);
    group.add(housingGroup);

    parts.push({
        name: "Gantry Housing",
        description: "Aerodynamic plastic covers enclosing the scanner.",
        material: "plastic",
        function: "Aesthetics, noise dampening, patient safety.",
        assemblyOrder: 7,
        connections: ["Internal components"],
        failureEffect: "Exposed internals, increased noise.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: housingGroup
    });


    const description = "Ultra High-Tech MRI Scanner Gantry demonstrating the inner workings including superconducting magnet, liquid helium cryostat, gradient coils (X,Y,Z), and body RF birdcage coil.";

    const quizQuestions = [
        {
            question: "What is the primary function of the superconducting magnet in an MRI?",
            options: [
                "To excite the protons",
                "To create a strong, static magnetic field (B0) to align protons",
                "To create spatial gradients for imaging",
                "To cool the system"
            ],
            correct: 1,
            explanation: "The superconducting magnet generates the B0 field, which causes the net magnetization of protons in the body to align with it.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for spatial encoding (giving 3D coordinates to the signal)?",
            options: [
                "RF Coil",
                "Superconducting Magnet",
                "Cold Head",
                "Gradient Coils"
            ],
            correct: 3,
            explanation: "The gradient coils (X, Y, Z) linearly vary the magnetic field, changing the resonant frequency of protons depending on their position, allowing spatial encoding.",
            difficulty: "Hard"
        },
        {
            question: "What does the RF (Radiofrequency) Coil do?",
            options: [
                "Keeps the magnet cold",
                "Transmits B1 pulses to flip protons and receives the resulting echo signal",
                "Moves the patient table",
                "Produces the main B0 field"
            ],
            correct: 1,
            explanation: "The RF coil acts as an antenna, transmitting an RF pulse at the Larmor frequency to excite protons, and then 'listening' for the signal they emit as they relax.",
            difficulty: "Medium"
        },
        {
            question: "What liquid is used in the cryostat to keep the magnet superconducting?",
            options: [
                "Liquid Nitrogen",
                "Liquid Oxygen",
                "Liquid Helium",
                "Water"
            ],
            correct: 2,
            explanation: "Liquid Helium is used because it boils at ~4.2 Kelvin, keeping the NbTi wires below their critical temperature to maintain superconductivity.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // time is in seconds
        
        // Pulsating glow on gradient coils simulating rapid switching
        const pulseX = (Math.sin(time * speed * 20) + 1) / 2;
        const pulseY = (Math.cos(time * speed * 15) + 1) / 2;
        const pulseZ = (Math.sin(time * speed * 25 + Math.PI/4) + 1) / 2;
        
        gradientGlowMaterialX.emissiveIntensity = 0.1 + pulseX * 0.5;
        gradientGlowMaterialY.emissiveIntensity = 0.1 + pulseY * 0.5;
        gradientGlowMaterialZ.emissiveIntensity = 0.1 + pulseZ * 0.5;

        // RF coil excitation sequence (brief intense flashes)
        const rfPulse = Math.pow((Math.sin(time * speed * 5) + 1) / 2, 8); // Sharp peaks
        rfGlowMaterial.emissiveIntensity = 0.2 + rfPulse * 1.5;
        
        // Slight vibration of gradient coils simulating acoustic noise
        if (meshes) {
            const gradGroup = parts.find(p => p.name === "Gradient Coil Assembly").mesh;
            if (gradGroup && gradGroup.position.x === 0) { // Only vibrate if not exploded
                gradGroup.position.y = (Math.random() - 0.5) * 0.005 * speed;
                gradGroup.position.z = (Math.random() - 0.5) * 0.005 * speed;
            } else if (gradGroup) {
                 // reset if exploded
                 gradGroup.position.x = gradGroup.position.x;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMRIScannerGantry() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
