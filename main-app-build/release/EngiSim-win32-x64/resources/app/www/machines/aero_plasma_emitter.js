import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xcc00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const meshes = {};

    function addPart(name, mesh, data) {
        mesh.position.set(data.originalPosition.x, data.originalPosition.y, data.originalPosition.z);
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({ name, mesh, ...data });
    }

    // 1. Wing Section (Aerofoil base)
    const wingGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const wingMesh = new THREE.Mesh(wingGeo, darkSteel);
    addPart('Wing Section', wingMesh, {
        description: "A section of an aircraft wing or aerodynamic surface.",
        material: "Carbon-Composite / Dark Steel",
        function: "Provides the base aerodynamic shape for lift generation.",
        assemblyOrder: 1,
        connections: ["Dielectric Layer"],
        failureEffect: "Structural failure leading to loss of aerodynamic profile.",
        cascadeFailures: ["Complete aerodynamic stall"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Dielectric Barrier
    const dielectricGeo = new THREE.BoxGeometry(3.8, 0.1, 0.5);
    const dielectricMesh = new THREE.Mesh(dielectricGeo, glass);
    addPart('Dielectric Barrier', dielectricMesh, {
        description: "An insulating layer preventing direct arcing between electrodes.",
        material: "Kapton or Ceramic Glass",
        function: "Isolates the electrodes to allow non-thermal plasma formation without sparking.",
        assemblyOrder: 2,
        connections: ["Wing Section", "Exposed Electrode", "Covered Electrode"],
        failureEffect: "Dielectric breakdown resulting in a direct short circuit.",
        cascadeFailures: ["Power Supply failure", "Loss of flow control"],
        originalPosition: { x: 0, y: 0.3, z: -0.6 },
        explodedPosition: { x: 0, y: 1.5, z: -1.0 }
    });

    // 3. Covered Electrode (Grounded)
    const coveredElecGeo = new THREE.BoxGeometry(3.6, 0.05, 0.2);
    const coveredElecMesh = new THREE.Mesh(coveredElecGeo, copper);
    addPart('Covered Electrode', coveredElecMesh, {
        description: "The grounded electrode embedded below the dielectric.",
        material: "Copper",
        function: "Acts as the ground reference for the high-voltage field.",
        assemblyOrder: 3,
        connections: ["Dielectric Barrier", "Power Supply"],
        failureEffect: "Loss of ground path.",
        cascadeFailures: ["No plasma generation"],
        originalPosition: { x: 0, y: 0.22, z: -0.5 },
        explodedPosition: { x: 0, y: 0.5, z: -1.5 }
    });

    // 4. Exposed Electrode (High Voltage)
    const exposedElecGeo = new THREE.BoxGeometry(3.6, 0.05, 0.1);
    const exposedElecMesh = new THREE.Mesh(exposedElecGeo, copper);
    addPart('Exposed Electrode', exposedElecMesh, {
        description: "The high-voltage electrode exposed to the airflow.",
        material: "Copper",
        function: "Ionizes the air molecules adjacent to its edge.",
        assemblyOrder: 4,
        connections: ["Dielectric Barrier", "Power Supply"],
        failureEffect: "Electrode erosion or oxidation.",
        cascadeFailures: ["Decreased plasma intensity", "Reduced aerodynamic efficiency"],
        originalPosition: { x: 0, y: 0.35, z: -0.7 },
        explodedPosition: { x: 0, y: 2.5, z: -1.0 }
    });

    // 5. Plasma Discharge (Visual effect)
    const plasmaGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.6, 16);
    plasmaGeo.rotateZ(Math.PI / 2);
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMaterial);
    addPart('Plasma Discharge', plasmaMesh, {
        description: "The non-thermal plasma region (violet/purple glow).",
        material: "Ionized Air",
        function: "Induces an electrohydrodynamic (EHD) body force in the boundary layer, accelerating the air.",
        assemblyOrder: 5,
        connections: ["Exposed Electrode", "Airflow"],
        failureEffect: "Flow separation not suppressed.",
        cascadeFailures: ["Increased drag", "Loss of lift"],
        originalPosition: { x: 0, y: 0.4, z: -0.6 },
        explodedPosition: { x: 0, y: 3.5, z: -1.0 }
    });

    // 6. High-Voltage Power Supply
    const hvpsGeo = new THREE.BoxGeometry(1, 0.6, 0.8);
    const hvpsMesh = new THREE.Mesh(hvpsGeo, chrome);
    addPart('High-Voltage AC Supply', hvpsMesh, {
        description: "Generates high frequency (kHz) and high voltage (kV) AC power.",
        material: "Chrome / Electronics",
        function: "Supplies the necessary voltage to create the dielectric barrier discharge (DBD).",
        assemblyOrder: 6,
        connections: ["Exposed Electrode", "Covered Electrode"],
        failureEffect: "Power loss or overheating.",
        cascadeFailures: ["Complete system shutdown"],
        originalPosition: { x: 0, y: -0.6, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 7. Cables
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const cableMesh1 = new THREE.Mesh(cableGeo, rubber);
    cableMesh1.rotation.x = Math.PI / 2;
    addPart('HV Wiring', cableMesh1, {
        description: "High-voltage insulated cables connecting the supply to the electrodes.",
        material: "Rubber / Copper",
        function: "Transmits high voltage without arcing to the wing structure.",
        assemblyOrder: 7,
        connections: ["High-Voltage AC Supply", "Exposed Electrode"],
        failureEffect: "Insulation breakdown.",
        cascadeFailures: ["Short circuit", "Fire hazard"],
        originalPosition: { x: 0, y: -0.1, z: -0.4 },
        explodedPosition: { x: 0, y: -1.5, z: -2 }
    });

    const description = "The Aero Plasma Emitter represents an Active Flow Control system using a Dielectric Barrier Discharge (DBD) plasma actuator. By applying high voltage AC across exposed and covered electrodes separated by a dielectric, a non-thermal plasma forms. This ionizes nearby air molecules, which are accelerated by the electric field to create a 'wall jet' or ionic wind, adding momentum to the boundary layer to delay flow separation and increase lift without any moving mechanical parts.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the Dielectric Barrier in this plasma actuator?",
            options: [
                "To increase the weight of the wing",
                "To act as a heat sink",
                "To prevent direct arcing/sparking between the electrodes",
                "To generate the high voltage"
            ],
            correct: 2,
            explanation: "The dielectric acts as an insulator that prevents the high voltage from creating a direct electrical arc (short circuit), enabling the formation of a stable, non-thermal plasma.",
            difficulty: "Medium"
        },
        {
            question: "How does the plasma actuator affect the aerodynamic airflow?",
            options: [
                "By creating thrust like a jet engine",
                "By adding momentum to the boundary layer to delay flow separation",
                "By freezing the moisture in the air",
                "By changing the physical shape of the wing"
            ],
            correct: 1,
            explanation: "The ions created by the plasma are accelerated by the electric field, colliding with neutral air molecules. This creates a small wall jet that adds momentum to the boundary layer, keeping the flow attached to the wing at higher angles of attack.",
            difficulty: "Hard"
        },
        {
            question: "Which type of power supply is typically required for a DBD plasma actuator?",
            options: [
                "Low voltage DC battery",
                "High Voltage, High Frequency AC",
                "Standard 120V AC wall power",
                "Solar panels directly connected"
            ],
            correct: 1,
            explanation: "DBD plasma actuators require High Voltage (several kilovolts) to ionize the air, and High Frequency AC (typically in the kilohertz range) to continuously maintain the plasma state.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Pulsate the plasma discharge
        if (activeMeshes['Plasma Discharge']) {
            const plasma = activeMeshes['Plasma Discharge'];
            // Vibrate scale slightly to simulate plasma flicker
            const scale = 1.0 + Math.sin(time * speed * 20) * 0.1;
            plasma.scale.set(scale, 1, scale);
            // Change opacity and emissive intensity
            plasma.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 15) * 1.5;
            plasma.material.opacity = 0.5 + Math.sin(time * speed * 30) * 0.2;
        }
        
        // Slight vibration of the power supply box
        if (activeMeshes['High-Voltage AC Supply']) {
            const hvps = activeMeshes['High-Voltage AC Supply'];
            hvps.position.x = (Math.random() - 0.5) * 0.01 * speed;
            hvps.position.y = -0.6 + (Math.random() - 0.5) * 0.01 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPlasmaEmitter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
