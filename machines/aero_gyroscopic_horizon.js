import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing material
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.5,
    });
    
    // Instrument Housing
    const housingGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    housingGeometry.rotateX(Math.PI / 2);
    const housing = new THREE.Mesh(housingGeometry, darkSteel);
    meshes.housing = housing;
    group.add(housing);

    parts.push({
        name: "Outer Housing",
        description: "The main casing of the instrument that mounts to the aircraft panel.",
        material: "Dark Steel",
        function: "Protects internal components and provides mounting points.",
        assemblyOrder: 1,
        connections: ["Gimbal Frame"],
        failureEffect: "Loss of instrument protection, possible mounting failure.",
        cascadeFailures: ["Gimbal binding", "Rotor damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // Outer Gimbal (Roll)
    const outerGimbalGeo = new THREE.TorusGeometry(1.6, 0.1, 16, 64);
    outerGimbalGeo.rotateY(Math.PI / 2);
    const outerGimbal = new THREE.Mesh(outerGimbalGeo, aluminum);
    meshes.outerGimbal = outerGimbal;
    group.add(outerGimbal);

    parts.push({
        name: "Outer Gimbal Ring",
        description: "The primary gimbal allowing rotation around the roll axis.",
        material: "Aluminum",
        function: "Provides roll degree of freedom for the inner gyro mechanism.",
        assemblyOrder: 2,
        connections: ["Outer Housing", "Inner Gimbal"],
        failureEffect: "Loss of roll indication.",
        cascadeFailures: ["Inaccurate pitch indication"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 }
    });

    // Inner Gimbal (Pitch)
    const innerGimbalGeo = new THREE.TorusGeometry(1.3, 0.1, 16, 64);
    const innerGimbal = new THREE.Mesh(innerGimbalGeo, chrome);
    meshes.innerGimbal = innerGimbal;
    outerGimbal.add(innerGimbal); // Inherits roll

    parts.push({
        name: "Inner Gimbal Ring",
        description: "The secondary gimbal allowing rotation around the pitch axis.",
        material: "Chrome",
        function: "Provides pitch degree of freedom for the gyro rotor.",
        assemblyOrder: 3,
        connections: ["Outer Gimbal", "Gyro Rotor"],
        failureEffect: "Loss of pitch indication.",
        cascadeFailures: ["Gyro tumbling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // Gyro Rotor
    const rotorGeo = new THREE.CylinderGeometry(1, 1, 0.4, 32);
    const rotor = new THREE.Mesh(rotorGeo, copper);
    rotor.rotation.x = Math.PI / 2;
    meshes.rotor = rotor;
    innerGimbal.add(rotor); // Inherits pitch and roll

    parts.push({
        name: "Gyro Rotor",
        description: "A high-mass wheel spinning at high RPM to provide gyroscopic rigidity.",
        material: "Copper",
        function: "Maintains a fixed orientation in space due to conservation of angular momentum.",
        assemblyOrder: 4,
        connections: ["Inner Gimbal"],
        failureEffect: "Complete loss of attitude indication.",
        cascadeFailures: ["Instrument tumbling", "Complete system failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // Horizon Display Sphere (Background)
    const skyGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const skyMat = new THREE.MeshStandardMaterial({ color: 0x2288ff, roughness: 0.5 });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    
    const groundGeo = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x884422, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);

    const horizonCard = new THREE.Group();
    horizonCard.add(sky);
    horizonCard.add(ground);
    
    // Horizon card is attached to inner gimbal to stay level
    meshes.horizonCard = horizonCard;
    innerGimbal.add(horizonCard);

    parts.push({
        name: "Horizon Card",
        description: "The visual representation of the sky and ground.",
        material: "Painted Aluminum",
        function: "Displays the aircraft's attitude relative to the true horizon.",
        assemblyOrder: 5,
        connections: ["Inner Gimbal Ring"],
        failureEffect: "Misleading visual reference.",
        cascadeFailures: ["Pilot spatial disorientation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // Miniature Airplane (Fixed to Housing)
    const planeGeo = new THREE.BoxGeometry(1.5, 0.05, 0.2);
    const airplane = new THREE.Mesh(planeGeo, neonOrange);
    airplane.position.z = 1.9;
    meshes.airplane = airplane;
    group.add(airplane);

    parts.push({
        name: "Miniature Airplane",
        description: "A fixed reference symbol representing the aircraft.",
        material: "Neon Orange Plastic",
        function: "Provides a fixed reference against the moving horizon card.",
        assemblyOrder: 6,
        connections: ["Outer Housing", "Glass Face"],
        failureEffect: "Difficulty interpreting attitude.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 1.9 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // Glass Face
    const glassGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32);
    glassGeo.rotateX(Math.PI / 2);
    const faceGlass = new THREE.Mesh(glassGeo, glass);
    faceGlass.position.z = 2.0;
    meshes.faceGlass = faceGlass;
    group.add(faceGlass);

    parts.push({
        name: "Instrument Glass",
        description: "The protective transparent cover of the instrument.",
        material: "Glass",
        function: "Protects internals while allowing pilot to see the display.",
        assemblyOrder: 7,
        connections: ["Outer Housing"],
        failureEffect: "Debris entering instrument.",
        cascadeFailures: ["Gyro mechanical jam"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: 0, y: 0, z: 7 }
    });

    const description = "The Gyroscopic Artificial Horizon is a critical flight instrument that provides the pilot with pitch and roll attitude information. It relies on a high-speed spinning rotor that maintains rigidity in space. As the aircraft pitches and rolls, the gimbals allow the housing to move around the fixed rotor, displaying the relative motion on the horizon card.";

    const quizQuestions = [
        {
            question: "What physical principle allows the artificial horizon to function?",
            options: ["Bernoulli's Principle", "Conservation of Angular Momentum", "Magnetic Deviation", "Doppler Effect"],
            correct: 1,
            explanation: "The gyro rotor spins at high speed, giving it rigidity in space due to the conservation of angular momentum.",
            difficulty: "Medium"
        },
        {
            question: "What does the miniature airplane represent?",
            options: ["The actual horizon", "The aircraft's fixed position", "The direction of flight", "The wind vector"],
            correct: 1,
            explanation: "The miniature airplane is fixed to the instrument casing (and thus the aircraft), providing a reference against the moving horizon card.",
            difficulty: "Easy"
        },
        {
            question: "If the vacuum pump driving the gyro fails, what happens?",
            options: ["The instrument freezes instantly", "The gyro slowly spools down and tumbles", "The horizon card turns entirely blue", "The aircraft physically loses control"],
            correct: 1,
            explanation: "Without power, the rotor slows down, losing its gyroscopic rigidity. The gimbals will eventually succumb to friction and gravity, causing the instrument to tumble and show false readings.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Rotor spins very fast continuously
        meshesObj.rotor.rotation.y += 0.5 * speed;

        // Simulate aircraft pitching and rolling
        const pitch = Math.sin(time * 0.5) * 0.5; // Pitch angle
        const roll = Math.cos(time * 0.3) * 0.8;  // Roll angle

        // Apply relative rotation to gimbals
        meshesObj.outerGimbal.rotation.z = -roll;
        meshesObj.innerGimbal.rotation.x = -pitch;
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createGyroscopicHorizon() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
