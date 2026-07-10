import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.2
    });
    
    const glossyBlack = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // Parts Construction
    
    // 1. Base Housing
    const housingGeometry = new THREE.CylinderGeometry(2.2, 2.4, 1.5, 64);
    const housingMesh = new THREE.Mesh(housingGeometry, darkSteel);
    housingMesh.position.set(0, -0.75, 0);
    group.add(housingMesh);
    parts.push({
        name: 'Base Housing',
        mesh: housingMesh,
        description: 'Titanium-alloy structural base mounting the assembly to the spacecraft chassis.',
        material: 'darkSteel',
        function: 'Provides rigid structural support and thermal dissipation to the spacecraft frame.',
        assemblyOrder: 1,
        connections: ['Stator Assembly', 'Electronics Module'],
        failureEffect: 'Loss of structural integrity, excessive vibration coupling to spacecraft.',
        cascadeFailures: ['Bearing wear', 'Stator misalignment'],
        originalPosition: {x: 0, y: -0.75, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Stator Assembly
    const statorGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1.0, 32);
    const statorMesh = new THREE.Mesh(statorGeometry, copper);
    statorMesh.position.set(0, 0.5, 0);
    group.add(statorMesh);
    parts.push({
        name: 'Stator Core',
        mesh: statorMesh,
        description: 'Electromagnetic stator core with dense copper windings.',
        material: 'copper',
        function: 'Generates rotating magnetic field to drive the flywheel rotor.',
        assemblyOrder: 2,
        connections: ['Base Housing', 'Motor Bearings'],
        failureEffect: 'Loss of torque generation capability.',
        cascadeFailures: ['Thermal runaway in drive electronics'],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: 1, z: 0}
    });

    // 3. Stator Windings (Glowing accents)
    const windingGeometry = new THREE.TorusGeometry(1.52, 0.1, 16, 64);
    const windingMesh = new THREE.Mesh(windingGeometry, neonOrange);
    windingMesh.position.set(0, 0.5, 0);
    windingMesh.rotation.x = Math.PI / 2;
    group.add(windingMesh);
    parts.push({
        name: 'Stator Windings',
        mesh: windingMesh,
        description: 'High-density multi-phase coils with active current status.',
        material: 'neonOrange',
        function: 'Carries high-frequency AC current from the inverter.',
        assemblyOrder: 3,
        connections: ['Stator Core'],
        failureEffect: 'Short circuit or open phase, leading to torque ripple.',
        cascadeFailures: ['Inverter burnout'],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: 1.5, z: 0}
    });

    // 4. Rotor Flywheel (Massive, shiny)
    const flywheelGeometry = new THREE.CylinderGeometry(2.0, 2.0, 0.8, 64);
    const flywheelMesh = new THREE.Mesh(flywheelGeometry, chrome);
    flywheelMesh.position.set(0, 0.5, 0);
    group.add(flywheelMesh);
    parts.push({
        name: 'Flywheel Mass',
        mesh: flywheelMesh,
        description: 'High-inertia, precision-balanced chrome-steel alloy rotor.',
        material: 'chrome',
        function: 'Stores angular momentum and applies reaction torque to the spacecraft.',
        assemblyOrder: 4,
        connections: ['Motor Bearings'],
        failureEffect: 'Loss of attitude control, spacecraft tumbling.',
        cascadeFailures: ['Complete mission failure'],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 5. Flywheel Neon Ring (High-tech visual flair)
    const flyRingGeom = new THREE.TorusGeometry(2.0, 0.05, 16, 64);
    const flyRingMesh = new THREE.Mesh(flyRingGeom, neonBlue);
    flyRingMesh.position.set(0, 0.5, 0);
    flyRingMesh.rotation.x = Math.PI / 2;
    flywheelMesh.add(flyRingMesh);

    // 6. Motor Bearings
    const bearingGeometry = new THREE.TorusGeometry(0.5, 0.15, 16, 32);
    const bearingMesh = new THREE.Mesh(bearingGeometry, steel);
    bearingMesh.position.set(0, 1.1, 0);
    bearingMesh.rotation.x = Math.PI / 2;
    group.add(bearingMesh);
    parts.push({
        name: 'Magnetic Bearings',
        mesh: bearingMesh,
        description: 'Active magnetic levitation bearing system.',
        material: 'steel',
        function: 'Supports the spinning flywheel with near-zero friction.',
        assemblyOrder: 5,
        connections: ['Stator Core', 'Flywheel Mass'],
        failureEffect: 'Catastrophic mechanical friction and rapid despin.',
        cascadeFailures: ['Flywheel disintegration', 'Housing breach'],
        originalPosition: {x: 0, y: 1.1, z: 0},
        explodedPosition: {x: 0, y: 6, z: 0}
    });

    // 7. Enclosure Cover
    const coverGeometry = new THREE.CylinderGeometry(2.2, 2.2, 2.0, 64);
    const coverMesh = new THREE.Mesh(coverGeometry, glossyBlack);
    coverMesh.position.set(0, 0.5, 0);
    coverMesh.material.transparent = true;
    coverMesh.material.opacity = 0.3; // Glassy to see inside
    group.add(coverMesh);
    parts.push({
        name: 'Vacuum Enclosure',
        mesh: coverMesh,
        description: 'Sealed vacuum cover with transparent viewport.',
        material: 'glossyBlack',
        function: 'Maintains a vacuum environment to eliminate aerodynamic drag on the flywheel.',
        assemblyOrder: 6,
        connections: ['Base Housing'],
        failureEffect: 'Loss of vacuum, aerodynamic drag on flywheel.',
        cascadeFailures: ['Overheating', 'Increased power draw'],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // 8. Electronics board
    const boardGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
    const boardMesh = new THREE.Mesh(boardGeometry, darkSteel);
    boardMesh.position.set(0, -1.2, 0);
    group.add(boardMesh);
    parts.push({
        name: 'Electronics & Inverter Module',
        mesh: boardMesh,
        description: 'High-frequency drive electronics and telemetry processing.',
        material: 'darkSteel',
        function: 'Converts DC bus power to multi-phase AC for the stator and monitors RPM.',
        assemblyOrder: 7,
        connections: ['Base Housing', 'Stator Windings'],
        failureEffect: 'Loss of command and control of the wheel.',
        cascadeFailures: ['Uncontrolled spin down'],
        originalPosition: {x: 0, y: -1.2, z: 0},
        explodedPosition: {x: 0, y: -3.5, z: 0}
    });

    const description = "The Aerospace Reaction Wheel Assembly is a high-precision momentum exchange device used for spacecraft attitude control. By electrically accelerating or decelerating the massive flywheel, it imparts an equal and opposite reaction torque on the spacecraft chassis, allowing it to rotate without using thruster propellant. This model features an active magnetic bearing system and vacuum enclosure for ultra-low friction operation.";

    const quizQuestions = [
        {
            question: "What is the primary physical principle a reaction wheel uses to rotate a spacecraft?",
            options: [
                "Conservation of Linear Momentum",
                "Conservation of Angular Momentum",
                "Gyroscopic Precession",
                "Electromagnetic Induction"
            ],
            correct: 1,
            explanation: "Reaction wheels rely on the conservation of angular momentum. When the internal flywheel accelerates in one direction, the spacecraft must rotate in the opposite direction to keep the total angular momentum of the system constant.",
            difficulty: "Medium"
        },
        {
            question: "Why is the interior of the reaction wheel housing typically maintained as a vacuum?",
            options: [
                "To prevent the magnetic bearings from shorting out",
                "To protect the electronics from radiation",
                "To eliminate aerodynamic drag on the rapidly spinning flywheel",
                "To reduce the overall mass of the assembly"
            ],
            correct: 2,
            explanation: "Aerodynamic drag becomes extremely significant at the high RPMs typical of reaction wheels. A vacuum enclosure prevents air friction from slowing the wheel, which would cause excessive heat and require continuous power to maintain speed.",
            difficulty: "Hard"
        },
        {
            question: "What happens if a reaction wheel reaches its maximum RPM limit?",
            options: [
                "It continues to provide torque but at a lower efficiency",
                "It becomes saturated and can no longer provide torque in that direction",
                "It immediately explodes due to centrifugal forces",
                "It reverses direction automatically"
            ],
            correct: 1,
            explanation: "When a wheel reaches its maximum safe operating speed, it is considered 'saturated'. It cannot accelerate further, meaning it can no longer exert torque on the spacecraft in that direction until it is 'despun' using thrusters or magnetic torquers.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Accelerating massive flywheel visual
        const flywheel = parts.find(p => p.name === 'Flywheel Mass');
        if (flywheel && flywheel.mesh) {
            flywheel.mesh.rotation.y += 0.1 * speed;
        }

        // Pulse the neon rings
        const ring = parts.find(p => p.name === 'Stator Windings');
        if (ring && ring.mesh) {
            const intensity = 0.6 + 0.4 * Math.sin(time * 0.005 * speed);
            ring.mesh.material.emissiveIntensity = intensity;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createReactionWheelAssembly() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
