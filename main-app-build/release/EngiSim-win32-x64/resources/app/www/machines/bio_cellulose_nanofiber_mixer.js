import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing material
    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(4, 4, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Platform",
        description: "Heavy steel platform providing stability for high-shear operations.",
        material: "Dark Steel",
        function: "Absorbs vibrations from the homogenization process.",
        assemblyOrder: 1,
        connections: ["Main Chamber"],
        failureEffect: "Excessive vibration leading to misalignment.",
        cascadeFailures: ["Main Chamber", "Rotor Shaft"],
        originalPosition: {x: 0, y: 0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0},
        mesh: baseMesh
    });

    // 2. Main Chamber (Glass/Tinted)
    const chamberGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, glass);
    chamberMesh.position.set(0, 3.5, 0);
    group.add(chamberMesh);
    parts.push({
        name: "Main Reaction Chamber",
        description: "Pressurized glass chamber where wood pulp is processed.",
        material: "Reinforced Glass",
        function: "Contains the high-pressure mixture of pulp and enzymes.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Homogenizer Rotor", "Top Cap"],
        failureEffect: "Chamber rupture and loss of containment.",
        cascadeFailures: ["Entire System"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 3.5, z: 4},
        mesh: chamberMesh
    });

    // 3. Homogenizer Rotor (High Shear)
    const rotorGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 50);
    const rotorMesh = new THREE.Mesh(rotorGeo, chrome);
    rotorMesh.position.set(0, 3.5, 0);
    rotorMesh.rotation.x = Math.PI / 2;
    group.add(rotorMesh);
    
    // Blades for Rotor
    for(let i=0; i<4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 0.5, 3);
        const bladeMesh = new THREE.Mesh(bladeGeo, chrome);
        bladeMesh.rotation.y = (Math.PI / 2) * i;
        rotorMesh.add(bladeMesh);
    }
    
    parts.push({
        name: "Homogenizer Rotor",
        description: "High-speed spinning rotor applying intense shear forces to the pulp.",
        material: "Chrome/Steel",
        function: "Delaminates cellulose fibers down to the nanoscale.",
        assemblyOrder: 3,
        connections: ["Rotor Shaft", "Main Chamber"],
        failureEffect: "Inefficient fibrillation and low CNF yield.",
        cascadeFailures: ["Rotor Motor"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: -5, y: 3.5, z: 0},
        mesh: rotorMesh
    });

    // 4. Rotor Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, steel);
    shaftMesh.position.set(0, 4.5, 0);
    group.add(shaftMesh);
    parts.push({
        name: "Drive Shaft",
        description: "Transmits torque from the motor to the homogenizer rotor.",
        material: "Steel",
        function: "Rotational power transmission.",
        assemblyOrder: 4,
        connections: ["Homogenizer Rotor", "Top Motor"],
        failureEffect: "Shaft shearing or bending.",
        cascadeFailures: ["Homogenizer Rotor"],
        originalPosition: {x: 0, y: 4.5, z: 0},
        explodedPosition: {x: 0, y: 4.5, z: -4},
        mesh: shaftMesh
    });

    // 5. Top Motor Unit
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const motorMesh = new THREE.Mesh(motorGeo, copper);
    motorMesh.position.set(0, 9.5, 0);
    group.add(motorMesh);
    parts.push({
        name: "High-Torque Motor",
        description: "Provides the immense power required to overcome viscous forces.",
        material: "Copper/Steel",
        function: "Drives the main shaft at up to 20,000 RPM.",
        assemblyOrder: 5,
        connections: ["Drive Shaft", "Top Cap"],
        failureEffect: "Motor overheating or burnout.",
        cascadeFailures: ["Drive Shaft"],
        originalPosition: {x: 0, y: 9.5, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0},
        mesh: motorMesh
    });

    // 6. Extracted CNF Glow
    const cnfGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const cnfMesh = new THREE.Mesh(cnfGeo, glowGreen);
    cnfMesh.position.set(0, 3.5, 0);
    group.add(cnfMesh);
    parts.push({
        name: "Cellulose Nanofiber Matrix",
        description: "The glowing, highly structural output of the homogenization process.",
        material: "Glowing Bio-material",
        function: "Visualizes the concentration of successfully extracted CNF.",
        assemblyOrder: 6,
        connections: ["Main Chamber"],
        failureEffect: "Product degradation.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 5, y: 3.5, z: 0},
        mesh: cnfMesh
    });

    // 7. Coolant Coils
    const coilGeo = new THREE.TorusKnotGeometry(2.6, 0.15, 100, 16, 2, 15);
    const coilMesh = new THREE.Mesh(coilGeo, glowBlue);
    coilMesh.position.set(0, 3.5, 0);
    group.add(coilMesh);
    parts.push({
        name: "Cryo-Coolant System",
        description: "Circulates cooling fluid to prevent thermal degradation of cellulose.",
        material: "Neon Blue Tubing",
        function: "Maintains optimal temperature during high-shear friction.",
        assemblyOrder: 7,
        connections: ["Main Chamber"],
        failureEffect: "Thermal runaway and burning of the pulp.",
        cascadeFailures: ["Main Chamber", "Cellulose Nanofiber Matrix"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 3.5, z: 0},
        mesh: coilMesh
    });

    const description = "The Bio-Cellulose Nanofiber Mixer employs extreme high-shear mechanical forces and enzymatic pre-treatments to delaminate wood pulp into nanoscale structural fibers. Equipped with a high-torque motor and cryo-coolant system, it extracts glowing, highly robust cellulose nanofibers used in advanced sustainable materials.";

    const quizQuestions = [
        {
            question: "What is the primary mechanical force used in this machine to extract cellulose nanofibers?",
            options: ["Tensile pulling", "High-shear friction", "Ultrasonic cavitation", "Thermal expansion"],
            correct: 1,
            explanation: "High-shear homogenizers use intense friction and fluid dynamics to tear apart larger fibers into nanoscale fibrils.",
            difficulty: "Medium"
        },
        {
            question: "Why is the Cryo-Coolant System vital for the operation of the mixer?",
            options: ["To freeze the fibers", "To prevent thermal degradation of the cellulose", "To shrink the metal components", "To reduce the viscosity of the fluid"],
            correct: 1,
            explanation: "The high-shear process generates immense heat, which would burn or degrade the natural cellulose if not continuously cooled.",
            difficulty: "Easy"
        },
        {
            question: "What cascade failure is most likely if the Rotor Shaft shears during operation?",
            options: ["Cryo-Coolant System freeze", "Homogenizer Rotor halts and product agglomerates", "Base Platform shatters", "Cellulose matrix becomes too pure"],
            correct: 1,
            explanation: "If the drive shaft breaks, power is lost to the homogenizer rotor, stopping the mixing process and ruining the batch.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find specific parts for animation
        const rotor = parts.find(p => p.name === "Homogenizer Rotor")?.mesh;
        const shaft = parts.find(p => p.name === "Drive Shaft")?.mesh;
        const cnf = parts.find(p => p.name === "Cellulose Nanofiber Matrix")?.mesh;
        const coils = parts.find(p => p.name === "Cryo-Coolant System")?.mesh;

        if (rotor) rotor.rotation.z += 0.5 * speed;
        if (shaft) shaft.rotation.y += 0.5 * speed;
        
        if (cnf) {
            // Pulsating glow effect
            cnf.scale.setScalar(1 + Math.sin(time * 5) * 0.1 * speed);
            cnf.rotation.y += 0.1 * speed;
            cnf.rotation.x += 0.05 * speed;
        }

        if (coils) {
            // Subtle rotation of coolant coils to simulate fluid flow
            coils.rotation.z = Math.sin(time) * 0.1 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCelluloseMixer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
