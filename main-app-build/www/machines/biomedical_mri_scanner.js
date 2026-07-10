import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    // 1. Main Housing (Gantry)
    const gantryBodyGeom = new THREE.TorusGeometry(3.5, 1.5, 32, 64);
    const gantryBodyMesh = new THREE.Mesh(gantryBodyGeom, plastic);
    gantryBodyMesh.rotation.y = Math.PI / 2;
    gantryBodyMesh.position.set(0, 4, 0);
    gantryBodyMesh.scale.set(1, 1, 1.5);
    group.add(gantryBodyMesh);
    
    parts.push({
        name: "Main Gantry Housing",
        description: "The outer shell containing the magnetic coils and cooling systems.",
        material: "High-grade polymer/plastic",
        function: "Houses the superconducting magnet, gradient coils, and RF coils.",
        assemblyOrder: 1,
        connections: ["Superconducting Magnet", "Gradient Coils", "Patient Table"],
        failureEffect: "Environmental exposure to internal components.",
        cascadeFailures: ["Cooling System Leak"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Superconducting Magnet (The core)
    const magnetGeom = new THREE.CylinderGeometry(3.2, 3.2, 3.8, 64, 1, true);
    const magnetMesh = new THREE.Mesh(magnetGeom, darkSteel);
    magnetMesh.rotation.z = Math.PI / 2;
    magnetMesh.position.set(0, 4, 0);
    group.add(magnetMesh);

    parts.push({
        name: "Superconducting Magnet",
        description: "Produces a strong, uniform, static magnetic field (typically 1.5T to 3.0T).",
        material: "Niobium-titanium alloy bathed in liquid helium",
        function: "Aligns the protons in the patient's body.",
        assemblyOrder: 2,
        connections: ["Main Gantry Housing", "Helium Cooling System"],
        failureEffect: "Loss of magnetic field (Quench).",
        cascadeFailures: ["Helium Venting", "Scanner Inoperability"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -8 }
    });

    // 3. Gradient Coils
    const gradientGeom = new THREE.CylinderGeometry(2.8, 2.8, 3.5, 32, 1, true);
    const gradientMesh = new THREE.Mesh(gradientGeom, copper);
    gradientMesh.rotation.z = Math.PI / 2;
    gradientMesh.position.set(0, 4, 0);
    group.add(gradientMesh);

    parts.push({
        name: "Gradient Coils",
        description: "Three sets of coils (X, Y, Z) that create spatial variations in the magnetic field.",
        material: "Copper winding arrays",
        function: "Enables spatial localization of the MRI signal, allowing for 3D imaging.",
        assemblyOrder: 3,
        connections: ["Superconducting Magnet", "RF Coils"],
        failureEffect: "Inability to determine spatial origin of signals.",
        cascadeFailures: ["Distorted Images"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -15 }
    });

    // 4. RF Coils (Radio Frequency)
    const rfGeom = new THREE.CylinderGeometry(2.4, 2.4, 3, 32, 1, true);
    const rfMesh = new THREE.Mesh(rfGeom, glowBlue);
    rfMesh.rotation.z = Math.PI / 2;
    rfMesh.position.set(0, 4, 0);
    group.add(rfMesh);

    parts.push({
        name: "RF Body Coil",
        description: "Transmits radio frequency pulses and receives signals from the patient.",
        material: "Conductive metals and specialized circuitry",
        function: "Excites protons and detects their relaxation signals.",
        assemblyOrder: 4,
        connections: ["Gradient Coils", "Signal Processor"],
        failureEffect: "No signal transmission/reception.",
        cascadeFailures: ["Image Generation Failure"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -22 }
    });

    // 5. Patient Table (Bed)
    const tableBaseGeom = new THREE.BoxGeometry(2, 2, 6);
    const tableBaseMesh = new THREE.Mesh(tableBaseGeom, aluminum);
    tableBaseMesh.position.set(0, 1, 4);
    group.add(tableBaseMesh);

    const bedGeom = new THREE.BoxGeometry(1.5, 0.2, 8);
    const bedMesh = new THREE.Mesh(bedGeom, plastic);
    bedMesh.position.set(0, 2.1, 2);
    group.add(bedMesh);

    parts.push({
        name: "Patient Table",
        description: "Motorized bed that moves the patient into the scanner.",
        material: "Non-magnetic alloys and plastic",
        function: "Accurately positions the patient within the isocenter of the magnet.",
        assemblyOrder: 5,
        connections: ["Main Gantry Housing"],
        failureEffect: "Patient cannot be moved into the scanner.",
        cascadeFailures: ["Scan Delay"],
        originalPosition: { x: 0, y: 2.1, z: 2 },
        explodedPosition: { x: 0, y: 2.1, z: 12 }
    });

    // 6. Magnetic Field Visualizer (Decorative/Animated)
    const fieldGeom = new THREE.SphereGeometry(2.2, 32, 32);
    const fieldMesh = new THREE.Mesh(fieldGeom, glowGreen);
    fieldMesh.position.set(0, 4, 0);
    fieldMesh.scale.set(1, 0.5, 1);
    group.add(fieldMesh);

    parts.push({
        name: "RF Field Visualizer",
        description: "Visual representation of the radio frequency excitation field.",
        material: "Holographic light",
        function: "Demonstrates the area of active proton excitation.",
        assemblyOrder: 6,
        connections: ["RF Body Coil"],
        failureEffect: "N/A (Visual only)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    const description = "The Magnetic Resonance Imaging (MRI) scanner uses strong magnetic fields, magnetic field gradients, and radio waves to generate images of the organs in the body. It relies on the principles of nuclear magnetic resonance (NMR).";

    const quizQuestions = [
        {
            question: "What is the primary function of the superconducting magnet in an MRI scanner?",
            options: [
                "To generate radio waves that bounce off organs",
                "To align the spinning protons in the body's water molecules",
                "To cool down the patient during the scan",
                "To physically move the patient table"
            ],
            correct: 1,
            explanation: "The strong static magnetic field produced by the superconducting magnet aligns the protons in the hydrogen atoms of the body. This alignment is necessary before the RF coils can excite them.",
            difficulty: "Medium"
        },
        {
            question: "Why are gradient coils essential for MRI?",
            options: [
                "They keep the main magnet supercooled",
                "They generate the main 1.5T or 3.0T static field",
                "They create spatial variations in the magnetic field to localize signals",
                "They transmit radio frequencies to the patient"
            ],
            correct: 2,
            explanation: "Gradient coils alter the strength of the main magnetic field slightly over distance. This allows the scanner to identify exactly where a signal is coming from, enabling 3D image construction.",
            difficulty: "Hard"
        },
        {
            question: "What does the RF (Radio Frequency) coil do during a scan?",
            options: [
                "It excites the protons and 'listens' for their relaxation signal",
                "It cools the liquid helium to 4 Kelvin",
                "It protects the patient from radiation",
                "It moves the patient into the isocenter"
            ],
            correct: 0,
            explanation: "The RF coil sends out radio waves at the resonant frequency of the protons, tipping them out of alignment. As the protons realign, they emit a radio signal that the RF coil detects.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by part order or reference
        const rfCoil = group.children[3];
        const bed = group.children[5];
        const fieldVis = group.children[6];

        // Animate the field visualizer to pulse
        if (fieldVis) {
            const scalePulse = 1 + Math.sin(time * speed * 2) * 0.1;
            fieldVis.scale.set(scalePulse, scalePulse * 0.5, scalePulse);
            fieldVis.rotation.x += 0.01 * speed;
            fieldVis.rotation.y += 0.02 * speed;
            fieldVis.material.opacity = 0.5 + Math.sin(time * speed * 5) * 0.3;
        }

        // Simulate patient table sliding in and out
        if (bed) {
            bed.position.z = 2 - Math.sin(time * speed * 0.5) * 2;
        }

        // Rotate RF coil to simulate active scanning
        if (rfCoil) {
            rfCoil.material.opacity = 0.5 + Math.sin(time * speed * 10) * 0.3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMRIScanner() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
