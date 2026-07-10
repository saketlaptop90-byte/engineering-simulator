import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0022,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const energyMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1,
        wireframe: true
    });

    // 1. Resonator Body (Cavity)
    const bodyGeometry = new THREE.SphereGeometry(2, 64, 64);
    const bodyMesh = new THREE.Mesh(bodyGeometry, glass);
    bodyMesh.position.set(0, 0, 0);
    group.add(bodyMesh);

    parts.push({
        name: "Spherical Cavity",
        description: "The main volume of the Helmholtz resonator, acting as an acoustic compliance (spring).",
        material: "glass",
        function: "Stores acoustic potential energy through air compression and expansion.",
        assemblyOrder: 1,
        connections: ["Neck"],
        failureEffect: "Loss of resonance frequency due to volume changes or leaks.",
        cascadeFailures: ["Neck Mass Oscillation Failure", "Energy Dissipation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Neck
    const neckGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const neckMesh = new THREE.Mesh(neckGeometry, chrome);
    neckMesh.position.set(0, 3, 0);
    group.add(neckMesh);

    parts.push({
        name: "Resonator Neck",
        description: "The narrow port or tube connecting the cavity to the outside air.",
        material: "chrome",
        function: "Acts as an acoustic mass (inertia), oscillating back and forth compressing the air in the cavity.",
        assemblyOrder: 2,
        connections: ["Spherical Cavity"],
        failureEffect: "Changes the resonant frequency drastically if blocked or modified.",
        cascadeFailures: ["Acoustic Tuning Shift"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 3. Acoustic Wave/Air Mass inside Neck (Visualizer)
    const airMassGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.8, 32);
    const airMassMesh = new THREE.Mesh(airMassGeometry, neonBlue);
    airMassMesh.position.set(0, 3, 0);
    group.add(airMassMesh);

    parts.push({
        name: "Oscillating Air Mass",
        description: "The slug of air vibrating within the neck.",
        material: "neonBlue",
        function: "Provides the inertia of the resonant system.",
        assemblyOrder: 3,
        connections: ["Resonator Neck", "Internal Air Volume"],
        failureEffect: "Friction or acoustic resistance dampens the oscillation.",
        cascadeFailures: ["Damped Resonance"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 4. Energy Field/Sound Waves inside cavity
    const waveGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const waveMesh = new THREE.Mesh(waveGeometry, energyMaterial);
    waveMesh.position.set(0, 0, 0);
    group.add(waveMesh);

    parts.push({
        name: "Acoustic Pressure Field",
        description: "Representation of the oscillating pressure inside the cavity.",
        material: "energyMaterial",
        function: "Illustrates the compression and rarefaction of air (the 'spring').",
        assemblyOrder: 4,
        connections: ["Spherical Cavity"],
        failureEffect: "Acoustic saturation at high SPL.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // 5. Sound Input Port (Optional/Visual)
    const inputGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 50);
    const inputMesh = new THREE.Mesh(inputGeometry, neonRed);
    inputMesh.rotation.x = Math.PI / 2;
    inputMesh.position.set(0, 4.1, 0);
    group.add(inputMesh);

    parts.push({
        name: "Acoustic Aperture Ring",
        description: "The entry point for external sound waves.",
        material: "neonRed",
        function: "Channels external sound waves into the resonator neck.",
        assemblyOrder: 5,
        connections: ["Resonator Neck"],
        failureEffect: "Reflects waves rather than capturing them.",
        cascadeFailures: ["Resonance Failure"],
        originalPosition: { x: 0, y: 4.1, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });


    const description = "A high-tech visualization of a Helmholtz Resonator. It models acoustic resonance by capturing air in a cavity (spring) and a neck (mass), demonstrating the principles behind acoustic damping, ported speakers, and ancient architectural acoustics.";

    const quizQuestions = [
        {
            question: "In a Helmholtz resonator, what component provides the acoustic 'mass' or inertia?",
            options: ["The cavity volume", "The air in the neck", "The external acoustic field", "The walls of the resonator"],
            correct: 1,
            explanation: "The air plug inside the neck moves back and forth, providing the mass (inertia) of the mass-spring system.",
            difficulty: "Medium"
        },
        {
            question: "How does increasing the volume of the cavity affect the resonant frequency?",
            options: ["Increases the frequency", "Decreases the frequency", "Has no effect", "Creates infinite resonance"],
            correct: 1,
            explanation: "A larger cavity volume increases the acoustic compliance (it becomes a softer 'spring'), which lowers the resonant frequency.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of a Helmholtz resonator in architectural acoustics?",
            options: ["To amplify all frequencies evenly", "To reflect high frequencies", "To absorb specific low frequency standing waves", "To generate sound waves actively"],
            correct: 2,
            explanation: "Helmholtz resonators are often tuned to absorb specific low-frequency resonances (room modes) by converting acoustic energy into heat at their resonant frequency.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes || meshes.length < 5) return;

        // Air mass oscillates up and down in the neck
        const oscillation = Math.sin(time * speed * 2) * 0.4;
        meshes[2].position.y = 3 + oscillation;
        
        // Pressure field expands and contracts based on the air mass pushing down
        const pressure = 1 - (oscillation * 0.3);
        meshes[3].scale.set(pressure, pressure, pressure);
        
        // Energy field rotates slowly
        meshes[3].rotation.y += 0.01 * speed;
        meshes[3].rotation.z += 0.005 * speed;

        // Aperture ring pulses
        const pulse = (Math.sin(time * speed * 4) + 1) * 0.5;
        meshes[4].scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1 + pulse * 0.1);
        meshes[4].material.emissiveIntensity = 1 + pulse;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticsHelmholtzResonator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
