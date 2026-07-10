import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom materials for glowing effects and water
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1
    });

    const parts = [];

    // Base Pipe Connection (Steel)
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, steel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Pipe Connection",
        description: "Connects the sprinkler head to the main horizontal water supply pipe of the center pivot.",
        material: "Steel",
        function: "Provides structural support and water channel.",
        assemblyOrder: 1,
        connections: ["Main Supply Pipe", "Regulator Valve"],
        failureEffect: "Total loss of water pressure to this specific head.",
        cascadeFailures: ["Crop drought in local sector"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // Pressure Regulator Valve (Brass/Copper look)
    const regulatorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);
    const regulatorMesh = new THREE.Mesh(regulatorGeometry, copper);
    regulatorMesh.position.set(0, 2.3, 0);
    group.add(regulatorMesh);
    parts.push({
        name: "Pressure Regulator",
        description: "Maintains a constant output pressure regardless of input pressure variations along the pivot.",
        material: "Copper/Brass",
        function: "Ensures uniform water application.",
        assemblyOrder: 2,
        connections: ["Base Pipe Connection", "Drop Tube"],
        failureEffect: "Uneven water distribution, potential soil erosion or under-watering.",
        cascadeFailures: ["Drop tube blowout", "Yield reduction"],
        originalPosition: { x: 0, y: 2.3, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // Drop Tube (Rubber)
    const dropTubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const dropTubeMesh = new THREE.Mesh(dropTubeGeo, rubber);
    dropTubeMesh.position.set(0, -1, 0);
    group.add(dropTubeMesh);
    parts.push({
        name: "Drop Tube",
        description: "Flexible hose that brings the sprinkler head closer to the crop canopy.",
        material: "Rubber",
        function: "Reduces wind drift and evaporation.",
        assemblyOrder: 3,
        connections: ["Pressure Regulator", "Sprinkler Body"],
        failureEffect: "Water sprayed at high elevation, increasing evaporation loss.",
        cascadeFailures: ["Wind drift", "Water waste"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // Sprinkler Body (Plastic/Chrome)
    const bodyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const bodyMesh = new THREE.Mesh(bodyGeometry, chrome);
    bodyMesh.position.set(0, -3.3, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Sprinkler Body",
        description: "Housing for the nozzle and deflector mechanisms.",
        material: "Chrome/Plastic",
        function: "Directs water to the nozzle and supports the rotating deflector.",
        assemblyOrder: 4,
        connections: ["Drop Tube", "Nozzle", "Deflector Pad"],
        failureEffect: "Water leakage or improper nozzle seating.",
        cascadeFailures: ["Deflector jam", "Uneven spray"],
        originalPosition: { x: 0, y: -3.3, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // Nozzle (Aluminum)
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.5, 32);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, aluminum);
    nozzleMesh.position.set(0, -3.6, 0);
    group.add(nozzleMesh);
    parts.push({
        name: "Nozzle",
        description: "Precision orifice that determines the flow rate of the sprinkler.",
        material: "Aluminum",
        function: "Meters water flow and creates a high-velocity stream.",
        assemblyOrder: 5,
        connections: ["Sprinkler Body"],
        failureEffect: "Incorrect flow rate.",
        cascadeFailures: ["Over/under watering", "System pressure imbalance"],
        originalPosition: { x: 0, y: -3.6, z: 0 },
        explodedPosition: { x: 0, y: -7.5, z: 0 }
    });

    // Rotating Deflector Pad (Plastic / Glowing for effect)
    const deflectorGeo = new THREE.ConeGeometry(0.8, 0.4, 32);
    const deflectorMesh = new THREE.Mesh(deflectorGeo, neonBlue);
    deflectorMesh.position.set(0, -4.0, 0);
    deflectorMesh.rotation.x = Math.PI;
    group.add(deflectorMesh);
    parts.push({
        name: "Rotating Deflector Pad",
        description: "Grooved spinning pad that intercepts the water stream.",
        material: "High-Tech Polymer (Neon)",
        function: "Breaks water stream into droplets and distributes them in a circular pattern.",
        assemblyOrder: 6,
        connections: ["Sprinkler Body"],
        failureEffect: "Water shoots straight down in a single stream.",
        cascadeFailures: ["Deep rutting", "Crop destruction in localized spot"],
        originalPosition: { x: 0, y: -4.0, z: 0 },
        explodedPosition: { x: 0, y: -9, z: 0 }
    });

    // Water Dispersion Effect (Dynamic)
    const dropletsGeo = new THREE.BufferGeometry();
    const dropletCount = 200;
    const dropletPositions = new Float32Array(dropletCount * 3);
    for (let i = 0; i < dropletCount; i++) {
        dropletPositions[i * 3] = (Math.random() - 0.5) * 4;
        dropletPositions[i * 3 + 1] = (Math.random() - 0.5) * 2 - 5;
        dropletPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dropletsGeo.setAttribute('position', new THREE.BufferAttribute(dropletPositions, 3));
    const dropletsMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true, opacity: 0.6 });
    const dropletsMesh = new THREE.Points(dropletsGeo, dropletsMat);
    group.add(dropletsMesh);
    parts.push({
        name: "Water Dispersion Matrix",
        description: "Dynamic particle system representing the distributed water droplets.",
        material: "Water",
        function: "Irrigates the crop canopy uniformly.",
        assemblyOrder: 7,
        connections: ["Deflector Pad"],
        failureEffect: "Dry crops.",
        cascadeFailures: ["Yield loss"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 0 }
    });

    const description = "A high-tech Agricultural Center Pivot Irrigation Sprinkler Head. It features a pressure regulator, flexible drop tube, precision nozzle, and a spinning deflector pad to ensure uniform, wind-resistant water distribution over crops.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pressure Regulator in this sprinkler assembly?",
            options: [
                "To increase the overall water pressure from the pump.",
                "To maintain a constant output pressure despite input variations.",
                "To filter out debris from the water source.",
                "To change the direction of the center pivot."
            ],
            correct: 1,
            explanation: "The pressure regulator ensures that the sprinkler head delivers a consistent amount of water by normalizing pressure fluctuations along the length of the pivot pipe.",
            difficulty: "Medium"
        },
        {
            question: "Why are drop tubes commonly used in center pivot irrigation?",
            options: [
                "To make the pivot look taller.",
                "To reduce the weight on the main pipe.",
                "To bring the sprinkler closer to the crop, reducing wind drift and evaporation.",
                "To increase the water pressure artificially."
            ],
            correct: 2,
            explanation: "Drop tubes lower the sprinkler heads closer to the crop canopy, which minimizes the time water droplets are in the air, thereby significantly reducing loss due to wind drift and evaporation.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Rotating Deflector Pad fails or jams?",
            options: [
                "The system automatically shuts down.",
                "Water is sprayed in a fine mist across a wider area.",
                "Water shoots in a concentrated single stream, causing soil erosion and crop damage.",
                "The nozzle automatically unclogs itself."
            ],
            correct: 2,
            explanation: "The deflector pad breaks the water stream into a spray pattern. If it stops spinning or jams, the high-pressure stream will hit the ground directly, causing deep rutting and destroying crops in that spot.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by part order or reference
        const deflector = group.children[5]; // Deflector is 6th mesh added
        const droplets = group.children[6];  // Droplets

        if (deflector && deflector.type === "Mesh") {
            // Spin the deflector pad rapidly
            deflector.rotation.y = time * speed * 10;
        }

        if (droplets && droplets.type === "Points") {
            // Animate water droplets outward and downward
            const positions = droplets.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Expand outward
                let x = positions[i];
                let z = positions[i + 2];
                let dist = Math.sqrt(x*x + z*z);
                
                if (dist < 3) {
                    positions[i] *= 1.05;
                    positions[i+2] *= 1.05;
                } else {
                    positions[i] = (Math.random() - 0.5) * 0.5;
                    positions[i+2] = (Math.random() - 0.5) * 0.5;
                    positions[i+1] = -4.0; // Reset height to deflector
                }

                // Fall down
                positions[i + 1] -= speed * 2;
                if (positions[i + 1] < -8) {
                    positions[i + 1] = -4.0;
                }
            }
            droplets.geometry.attributes.position.needsUpdate = true;
            
            // Pulsate emissive intensity for high-tech effect
            neonBlue.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCenterPivotIrrigationSprinkler() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
