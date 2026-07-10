import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const greenLaserMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });

    const blueNeonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const aerosolMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // 1. Base Frame
    const baseGeometry = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Frame",
        description: "Heavy-duty vibration isolation base for stability during testing.",
        material: "darkSteel",
        function: "Supports the entire chamber and prevents external vibrations from affecting aerosol distribution.",
        assemblyOrder: 1,
        connections: ["Chamber Housing", "Control Console"],
        failureEffect: "Vibration introduces turbulent errors into particle readings.",
        cascadeFailures: ["Sensor Misalignment"],
        originalPosition: {x: 0, y: 0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: baseMesh
    });

    // 2. Chamber Housing (Glass Cylinder)
    const housingGeom = new THREE.CylinderGeometry(1.8, 1.8, 4, 32, 1, true);
    const housingMesh = new THREE.Mesh(housingGeom, glass);
    housingMesh.position.set(0, 2.5, 0);
    group.add(housingMesh);
    parts.push({
        name: "Test Chamber Housing",
        description: "Transparent cylindrical enclosure for containing the airborne dispersion.",
        material: "glass",
        function: "Contains the aerosol cloud while allowing optical access for laser diagnostics.",
        assemblyOrder: 2,
        connections: ["Base Frame", "Top Cap", "Laser Module"],
        failureEffect: "Loss of containment, aerosols escape to environment.",
        cascadeFailures: ["Contamination"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: 4},
        mesh: housingMesh
    });

    // 3. Top Cap / Filter Module
    const topCapGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.4, 32);
    const topCapMesh = new THREE.Mesh(topCapGeom, aluminum);
    topCapMesh.position.set(0, 4.7, 0);
    group.add(topCapMesh);
    parts.push({
        name: "HEPA Filter Cap",
        description: "High-efficiency particulate air filter housing and top seal.",
        material: "aluminum",
        function: "Seals the chamber and filters exhaust air to prevent hazardous release.",
        assemblyOrder: 3,
        connections: ["Chamber Housing", "Exhaust Valve"],
        failureEffect: "Unfiltered particles released into the lab.",
        cascadeFailures: ["Biohazard Alarm"],
        originalPosition: {x: 0, y: 4.7, z: 0},
        explodedPosition: {x: 0, y: 7, z: 0},
        mesh: topCapMesh
    });

    // 4. Atomizer Nozzle
    const nozzleGeom = new THREE.ConeGeometry(0.2, 0.6, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeom, chrome);
    nozzleMesh.position.set(0, 4.2, 0);
    nozzleMesh.rotation.x = Math.PI;
    group.add(nozzleMesh);
    parts.push({
        name: "Ultrasonic Atomizer Nozzle",
        description: "High-frequency vibrating nozzle that creates the aerosol dispersion.",
        material: "chrome",
        function: "Converts liquid sample into a fine mist of controlled droplet size.",
        assemblyOrder: 4,
        connections: ["Top Cap", "Fluid Line"],
        failureEffect: "Droplet size becomes inconsistent or liquid pooling occurs.",
        cascadeFailures: ["Invalid Test Results"],
        originalPosition: {x: 0, y: 4.2, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0},
        mesh: nozzleMesh
    });

    // 5. Laser Sheet Generator
    const laserBoxGeom = new THREE.BoxGeometry(0.4, 0.4, 0.8);
    const laserBoxMesh = new THREE.Mesh(laserBoxGeom, steel);
    laserBoxMesh.position.set(-2.2, 2.5, 0);
    group.add(laserBoxMesh);
    parts.push({
        name: "Laser Sheet Module",
        description: "Emits a 2D planar laser sheet for particle image velocimetry (PIV).",
        material: "steel",
        function: "Illuminates a cross-section of the chamber to track particle movement.",
        assemblyOrder: 5,
        connections: ["Base Frame"],
        failureEffect: "Loss of particle illumination.",
        cascadeFailures: ["Sensor Blindness"],
        originalPosition: {x: -2.2, y: 2.5, z: 0},
        explodedPosition: {x: -5, y: 2.5, z: 0},
        mesh: laserBoxMesh
    });

    // 6. Laser Sheet (Visual Effect)
    const laserSheetGeom = new THREE.PlaneGeometry(3.6, 3);
    const laserSheetMesh = new THREE.Mesh(laserSheetGeom, greenLaserMaterial);
    laserSheetMesh.position.set(0, 2.5, 0);
    laserSheetMesh.rotation.y = Math.PI / 2;
    group.add(laserSheetMesh);
    parts.push({
        name: "Illumination Plane",
        description: "The active green laser sheet illuminating the cross-section.",
        material: "neon",
        function: "Visualizes the aerosol density.",
        assemblyOrder: 6,
        connections: ["Laser Sheet Module"],
        failureEffect: "None (Visual only)",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: -2.5, y: 2.5, z: 0},
        mesh: laserSheetMesh
    });

    // 7. Aerosol Particle Cloud (Points)
    const particleCount = 2000;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 3;     // x
        particlePositions[i * 3 + 1] = Math.random() * 3.5 + 0.5; // y
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3; // z
        particleVelocities.push({
            y: -Math.random() * 0.05 - 0.02,
            x: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        });
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleSystem = new THREE.Points(particleGeom, aerosolMaterial);
    group.add(particleSystem);
    parts.push({
        name: "Aerosol Cloud",
        description: "The simulated dispersion of airborne particles.",
        material: "particles",
        function: "Represents the test subject moving through the chamber.",
        assemblyOrder: 7,
        connections: ["Atomizer Nozzle"],
        failureEffect: "No particles generated.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -1, z: -3},
        mesh: particleSystem,
        velocities: particleVelocities
    });

    // 8. Control Interface
    const consoleGeom = new THREE.BoxGeometry(1.5, 0.8, 0.5);
    const consoleMesh = new THREE.Mesh(consoleGeom, plastic);
    consoleMesh.position.set(0, 1.0, 2.2);
    consoleMesh.rotation.x = -Math.PI / 6;
    group.add(consoleMesh);
    parts.push({
        name: "Control Console",
        description: "Touchscreen interface for managing test parameters.",
        material: "plastic",
        function: "Allows users to set flow rate, aerosol density, and laser power.",
        assemblyOrder: 8,
        connections: ["Base Frame"],
        failureEffect: "Inability to control or monitor the test.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 1.0, z: 2.2},
        explodedPosition: {x: 0, y: 0, z: 4},
        mesh: consoleMesh
    });

    // 9. Status Light Ring
    const ringGeom = new THREE.TorusGeometry(1.9, 0.05, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeom, blueNeonMaterial);
    ringMesh.position.set(0, 4.5, 0);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);
    parts.push({
        name: "Status Indicator Ring",
        description: "LED ring showing system operational status.",
        material: "neon",
        function: "Provides visual feedback (e.g., blue for ready, red for hazard).",
        assemblyOrder: 9,
        connections: ["Top Cap"],
        failureEffect: "Loss of quick visual status.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: 6.5, z: 0},
        mesh: ringMesh
    });

    const description = "The Airborne Dispersion Chamber is a high-tech testing apparatus designed to analyze the behavior of aerosolized particles in a controlled environment. It features an ultrasonic atomizer for precise droplet generation and a planar laser sheet for real-time visualization and measurement of particle trajectories and densities.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Laser Sheet Module?",
            options: [
                "To heat the aerosol particles",
                "To illuminate a cross-section for particle visualization",
                "To sterilize the chamber",
                "To power the atomizer"
            ],
            correct: 1,
            explanation: "The planar laser sheet illuminates a thin slice of the chamber, allowing cameras to track the movement and density of particles via Particle Image Velocimetry (PIV).",
            difficulty: "Medium"
        },
        {
            question: "Why is the HEPA Filter Cap critical to the system?",
            options: [
                "It cools the chamber",
                "It measures the particle size",
                "It prevents hazardous particles from escaping into the lab",
                "It stabilizes the base"
            ],
            correct: 2,
            explanation: "The HEPA filter ensures that exhaust air is clean, maintaining safety and preventing environmental contamination during testing.",
            difficulty: "Easy"
        },
        {
            question: "How does the Ultrasonic Atomizer Nozzle create the aerosol?",
            options: [
                "By boiling the liquid",
                "By compressing air",
                "Through high-frequency vibration",
                "Using static electricity"
            ],
            correct: 2,
            explanation: "Ultrasonic atomizers use high-frequency vibrations to break liquids into a fine mist with precisely controlled droplet sizes.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate Laser Intensity
        laserSheetMesh.material.emissiveIntensity = 2.0 + Math.sin(time * 5 * speed) * 0.5;
        
        // Animate particles
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] += particleVelocities[i].y * speed; // Fall down
            positions[i * 3] += particleVelocities[i].x * speed;     // Drift X
            positions[i * 3 + 2] += particleVelocities[i].z * speed; // Drift Z

            // Reset particle if it hits the bottom
            if (positions[i * 3 + 1] < 0.5) {
                positions[i * 3 + 1] = 4.0;
                positions[i * 3] = (Math.random() - 0.5) * 1.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Rotate particles slowly
        particleSystem.rotation.y += 0.005 * speed;

        // Pulse the status ring
        ringMesh.material.emissiveIntensity = 1.0 + Math.sin(time * 2 * speed) * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAirborneDispersionChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
