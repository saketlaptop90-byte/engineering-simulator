import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044aa,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const glowCopper = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x884400,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.2
    });

    const fieldLineMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });

    // 1. Outer Cryostat Vessel (Main Housing)
    const vesselGeometry = new THREE.CylinderGeometry(2, 2, 4, 64);
    const vesselMesh = new THREE.Mesh(vesselGeometry, chrome);
    vesselMesh.rotation.z = Math.PI / 2;
    group.add(vesselMesh);
    parts.push({
        name: "Outer Cryostat Vessel",
        description: "The vacuum-insulated outer shell that minimizes heat transfer to the super-cooled internal components.",
        material: "chrome",
        function: "Thermal insulation and structural support.",
        assemblyOrder: 1,
        connections: ["Helium Vessel", "Gradient Coils", "Quench Pipe"],
        failureEffect: "Loss of vacuum leads to rapid liquid helium boil-off.",
        cascadeFailures: ["Superconducting Quench", "Magnet Demagnetization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: vesselMesh
    });

    // 2. Liquid Helium Vessel (Inner Cryostat)
    const heliumGeometry = new THREE.CylinderGeometry(1.7, 1.7, 3.8, 64);
    const heliumMesh = new THREE.Mesh(heliumGeometry, glowBlue);
    heliumMesh.rotation.z = Math.PI / 2;
    group.add(heliumMesh);
    parts.push({
        name: "Liquid Helium Vessel",
        description: "Contains liquid helium at 4.2 Kelvin, immersing the superconducting coils to eliminate electrical resistance.",
        material: "glowBlue",
        function: "Maintains superconducting temperatures.",
        assemblyOrder: 2,
        connections: ["Outer Cryostat Vessel", "Superconducting Coils"],
        failureEffect: "Temperature rise causes coils to lose superconductivity.",
        cascadeFailures: ["Violent Quench", "Helium Venting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 0 },
        mesh: heliumMesh
    });

    // 3. Superconducting Coils
    const coilGroup = new THREE.Group();
    for (let i = -1.2; i <= 1.2; i += 0.8) {
        const coilGeometry = new THREE.TorusGeometry(1.4, 0.15, 16, 64);
        const coilMesh = new THREE.Mesh(coilGeometry, glowCopper);
        coilMesh.rotation.y = Math.PI / 2;
        coilMesh.position.x = i;
        coilGroup.add(coilMesh);
    }
    group.add(coilGroup);
    parts.push({
        name: "Superconducting Coils",
        description: "Niobium-titanium wires that generate the intense, uniform main magnetic field (B0).",
        material: "glowCopper",
        function: "Generates the static magnetic field.",
        assemblyOrder: 3,
        connections: ["Liquid Helium Vessel"],
        failureEffect: "Loss of magnetic field, scanner becomes useless.",
        cascadeFailures: ["Loss of imaging capability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: coilGroup
    });

    // 4. Gradient Coils
    const gradientGeometry = new THREE.CylinderGeometry(1.1, 1.1, 3.6, 64);
    const gradientMesh = new THREE.Mesh(gradientGeometry, aluminum);
    gradientMesh.rotation.z = Math.PI / 2;
    group.add(gradientMesh);
    parts.push({
        name: "Gradient Coils",
        description: "Three sets of coils (x, y, z) that alter the main magnetic field to allow spatial localization of the MRI signal.",
        material: "aluminum",
        function: "Spatial encoding of the MRI signal.",
        assemblyOrder: 4,
        connections: ["Outer Cryostat Vessel", "RF Coils"],
        failureEffect: "Images cannot be localized; resulting in blur or no image.",
        cascadeFailures: ["Diagnostic failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: gradientMesh
    });

    // 5. Radio Frequency (RF) Coil
    const rfGeometry = new THREE.CylinderGeometry(0.9, 0.9, 2.5, 32, 1, true);
    const rfMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true });
    const rfMesh = new THREE.Mesh(rfGeometry, rfMaterial);
    rfMesh.rotation.z = Math.PI / 2;
    group.add(rfMesh);
    parts.push({
        name: "Radio Frequency Coil",
        description: "Transmits RF pulses to excite protons and receives the returning signals.",
        material: "darkSteel",
        function: "Excites protons and receives MR signal.",
        assemblyOrder: 5,
        connections: ["Gradient Coils", "Patient Bore"],
        failureEffect: "No signal received from patient.",
        cascadeFailures: ["Image processing failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3.5, z: 0 },
        mesh: rfMesh
    });

    // 6. Patient Bore
    const boreGeometry = new THREE.CylinderGeometry(0.8, 0.8, 4.2, 64, 1, true);
    const boreMesh = new THREE.Mesh(boreGeometry, plastic);
    boreMesh.rotation.z = Math.PI / 2;
    group.add(boreMesh);
    parts.push({
        name: "Patient Bore Tube",
        description: "The inner tube where the patient lies, designed for comfort and sound dampening.",
        material: "plastic",
        function: "Patient housing and acoustic insulation.",
        assemblyOrder: 6,
        connections: ["RF Coil"],
        failureEffect: "Discomfort or claustrophobia for patient.",
        cascadeFailures: ["Patient movement artifacts"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: boreMesh
    });

    // 7. Quench Pipe
    const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const pipeMesh = new THREE.Mesh(pipeGeometry, chrome);
    pipeMesh.position.set(0, 2.5, 0);
    group.add(pipeMesh);
    parts.push({
        name: "Quench Vent Pipe",
        description: "Emergency exhaust pipe that safely vents boiled-off helium gas out of the building during a quench.",
        material: "chrome",
        function: "Safety venting of helium gas.",
        assemblyOrder: 7,
        connections: ["Outer Cryostat Vessel"],
        failureEffect: "Helium gas vents into the scanner room.",
        cascadeFailures: ["Asphyxiation risk for patient and staff"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 6.5, z: 0 },
        mesh: pipeMesh
    });

    // 8. Magnetic Field Lines (Visual Effect)
    const fieldLines = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const lineGeo = new THREE.TorusGeometry(3, 0.05, 8, 64);
        const lineMesh = new THREE.Mesh(lineGeo, fieldLineMaterial);
        lineMesh.rotation.x = Math.PI / 2;
        lineMesh.rotation.y = (i / 8) * Math.PI;
        fieldLines.add(lineMesh);
    }
    group.add(fieldLines);
    parts.push({
        name: "Magnetic Field Lines",
        description: "Visual representation of the powerful static magnetic field B0 generated by the scanner.",
        material: "glowCyan",
        function: "Aligns proton spins in the body.",
        assemblyOrder: 8,
        connections: ["Superconducting Coils"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 },
        mesh: fieldLines
    });

    const description = "The Magnetic Resonance Imaging (MRI) Superconducting Magnet is the core of an MRI scanner. It uses coils bathed in liquid helium at -269°C to achieve superconductivity, producing an intense and highly uniform magnetic field (typically 1.5T to 3T) required for detailed medical imaging.";

    const quizQuestions = [
        {
            question: "Why are the main coils of an MRI magnet bathed in liquid helium?",
            options: [
                "To create a bright blue glowing effect",
                "To reduce electrical resistance to zero by achieving superconductivity",
                "To lubricate the rotating components",
                "To generate the radio frequency pulses"
            ],
            correct: 1,
            explanation: "Liquid helium cools the niobium-titanium coils to 4.2 Kelvin, causing them to become superconducting. This allows a massive electrical current to flow without resistance, creating the strong magnetic field.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Quench Pipe?",
            options: [
                "To provide fresh air to the patient",
                "To safely vent expanding helium gas out of the building if the magnet loses superconductivity",
                "To drain water from the cooling system",
                "To act as an antenna for the RF signals"
            ],
            correct: 1,
            explanation: "If a magnet 'quenches' (loses superconductivity), the electrical energy turns into heat, rapidly boiling the liquid helium. The quench pipe safely vents this extremely cold, expanding gas outside to prevent asphyxiation in the MRI room.",
            difficulty: "Hard"
        },
        {
            question: "Which component is responsible for allowing the MRI to localize signals in 3D space?",
            options: [
                "Superconducting Coils",
                "Outer Cryostat Vessel",
                "Gradient Coils",
                "Radio Frequency Coil"
            ],
            correct: 2,
            explanation: "The gradient coils create slight, controlled variations in the main magnetic field along the X, Y, and Z axes, which allows the scanner to encode spatial information and build a 3D image.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate magnetic field lines
        const fieldGroup = parts.find(p => p.name === "Magnetic Field Lines").mesh;
        if (fieldGroup) {
            fieldGroup.rotation.x += 0.01 * speed;
            fieldGroup.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
            fieldGroup.children.forEach((child, index) => {
                child.material.opacity = 0.3 + 0.2 * Math.sin(time * 3 + index);
            });
        }

        // Pulse the inner superconducting coils
        const coils = parts.find(p => p.name === "Superconducting Coils").mesh;
        if (coils) {
            coils.children.forEach((coil, index) => {
                coil.material.emissiveIntensity = 0.8 + 0.4 * Math.sin(time * 4 + index);
            });
        }
        
        // Liquid helium slight pulse
        const helium = parts.find(p => p.name === "Liquid Helium Vessel").mesh;
        if (helium) {
            helium.material.opacity = 0.7 + 0.1 * Math.sin(time * 1.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMRIMagnet() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
