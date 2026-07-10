import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xaa0000,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const createPart = (name, geometry, material, position, explodedPosition, metadata) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        group.add(mesh);
        
        parts.push({
            name,
            mesh,
            originalPosition: position,
            explodedPosition: explodedPosition,
            ...metadata
        });
        
        return mesh;
    };

    // 1. Tail Boom Tube
    const boomGeometry = new THREE.CylinderGeometry(0.5, 0.4, 5, 32);
    boomGeometry.rotateZ(Math.PI / 2);
    createPart('Tail Boom', boomGeometry, darkSteel, {x: -2.5, y: 0, z: 0}, {x: -4, y: 0, z: 0}, {
        description: 'Structural support housing the tail rotor driveshaft.',
        material: 'Carbon Fiber / Aerospace Aluminum',
        function: 'Carries torque and provides structural leverage for the anti-torque system.',
        assemblyOrder: 1,
        connections: ['Driveshaft', 'Vertical Fin'],
        failureEffect: 'Loss of structural integrity, catastrophic loss of anti-torque control.',
        cascadeFailures: ['Driveshaft shear', 'Rotor assembly detachment']
    });

    // 2. Driveshaft
    const driveshaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 16);
    driveshaftGeometry.rotateZ(Math.PI / 2);
    createPart('Driveshaft', driveshaftGeometry, steel, {x: -2.5, y: 0, z: 0}, {x: -2.5, y: 1, z: 0}, {
        description: 'Transmits power from the main transmission to the tail rotor gearbox.',
        material: 'High-strength Steel',
        function: 'Power transmission.',
        assemblyOrder: 2,
        connections: ['Tail Boom', '90-degree Gearbox'],
        failureEffect: 'Complete loss of tail rotor drive, uncontrollable aircraft spin (LTE).',
        cascadeFailures: ['Gearbox decoupling']
    });

    // 3. 90-degree Gearbox
    const gearboxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    createPart('90-Degree Gearbox', gearboxGeometry, aluminum, {x: 0, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {
        description: 'Changes the direction of drive from the driveshaft to the tail rotor.',
        material: 'Cast Aluminum casing, Steel gears',
        function: 'Changes rotational axis by 90 degrees and reduces RPM.',
        assemblyOrder: 3,
        connections: ['Driveshaft', 'Pitch Change Mechanism'],
        failureEffect: 'Seizure or loss of drive, catastrophic loss of yaw control.',
        cascadeFailures: ['Driveshaft failure', 'Rotor blade detachment']
    });

    // 4. Pitch Change Mechanism (Spider)
    const spiderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    spiderGeometry.rotateX(Math.PI / 2);
    createPart('Pitch Change Spider', spiderGeometry, chrome, {x: 0, y: 0, z: 0.5}, {x: 0, y: 0, z: 1.5}, {
        description: 'Controls the pitch angle of the tail rotor blades.',
        material: 'Machined Steel / Chrome',
        function: 'Translates pedal input into collective pitch changes for the tail blades.',
        assemblyOrder: 4,
        connections: ['Gearbox', 'Blade Grips', 'Control Cables'],
        failureEffect: 'Inability to change tail rotor pitch, stuck pedals.',
        cascadeFailures: ['Control cable snap']
    });

    // 5. Rotor Hub
    const hubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
    hubGeometry.rotateX(Math.PI / 2);
    createPart('Rotor Hub', hubGeometry, darkSteel, {x: 0, y: 0, z: 0.9}, {x: 0, y: 0, z: 2.5}, {
        description: 'Central mounting point for the tail rotor blades.',
        material: 'Titanium / Steel alloy',
        function: 'Secures blades and rotates them.',
        assemblyOrder: 5,
        connections: ['Pitch Change Spider', 'Rotor Blades'],
        failureEffect: 'Blade detachment.',
        cascadeFailures: ['Severe imbalance', 'Gearbox tear-out']
    });

    // 6. Rotor Blades
    const blade1Geometry = new THREE.BoxGeometry(0.2, 3, 0.05);
    blade1Geometry.translate(0, 1.5, 0);
    const blade1 = createPart('Blade 1', blade1Geometry, glowingBlue, {x: 0, y: 0, z: 0.9}, {x: 0, y: 2, z: 3}, {
        description: 'Aerodynamic surface producing anti-torque thrust.',
        material: 'Composite / Kevlar with Neon edge',
        function: 'Generates thrust to counteract main rotor torque.',
        assemblyOrder: 6,
        connections: ['Rotor Hub'],
        failureEffect: 'Loss of thrust, extreme vibration.',
        cascadeFailures: ['Hub destruction', 'Boom structural failure']
    });

    const blade2Geometry = new THREE.BoxGeometry(0.2, 3, 0.05);
    blade2Geometry.translate(0, -1.5, 0);
    const blade2 = createPart('Blade 2', blade2Geometry, glowingRed, {x: 0, y: 0, z: 0.9}, {x: 0, y: -2, z: 3}, {
        description: 'Aerodynamic surface producing anti-torque thrust.',
        material: 'Composite / Kevlar with Neon edge',
        function: 'Generates thrust to counteract main rotor torque.',
        assemblyOrder: 7,
        connections: ['Rotor Hub'],
        failureEffect: 'Loss of thrust, extreme vibration.',
        cascadeFailures: ['Hub destruction', 'Boom structural failure']
    });
    
    // Group blades to rotate them together
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0, 0.9);
    blade1.mesh.position.set(0, 0, 0);
    blade2.mesh.position.set(0, 0, 0);
    rotorGroup.add(blade1.mesh);
    rotorGroup.add(blade2.mesh);
    group.add(rotorGroup);
    
    // Update mesh references for animation
    const bladesObj = { mesh: rotorGroup };
    const driveshaftObj = parts.find(p => p.name === 'Driveshaft');

    const description = "The tail rotor is a key component of a conventional helicopter, designed to counteract the torque generated by the main rotor. Without it, the helicopter fuselage would spin uncontrollably in the opposite direction of the main rotor. It consists of a driveshaft, 90-degree gearbox, pitch change mechanism, and the rotor blades themselves.";

    const quizQuestions = [
        {
            question: "What is the primary function of the tail rotor?",
            options: [
                "To provide forward thrust.",
                "To cool the engine.",
                "To counteract the torque of the main rotor.",
                "To generate vertical lift."
            ],
            correct: 2,
            explanation: "The main rotor induces a torque reaction on the fuselage. The tail rotor creates horizontal thrust to counteract this, providing yaw control.",
            difficulty: "Beginner"
        },
        {
            question: "What happens if the tail rotor driveshaft shears during flight?",
            options: [
                "The helicopter immediately drops out of the sky.",
                "Loss of anti-torque control leading to uncontrollable spin.",
                "The main rotor stops turning.",
                "The engine automatically shuts down."
            ],
            correct: 1,
            explanation: "A sheared driveshaft removes power to the tail rotor, resulting in a loss of tail rotor effectiveness (LTE) and uncommanded yaw/spin.",
            difficulty: "Intermediate"
        },
        {
            question: "What does the 90-degree gearbox do in the tail rotor assembly?",
            options: [
                "Reverses the direction of the main rotor.",
                "Changes the axis of rotation from the boom to the tail rotor.",
                "Adjusts the pitch of the blades automatically.",
                "Stores emergency hydraulic fluid."
            ],
            correct: 1,
            explanation: "The 90-degree gearbox takes the longitudinal rotation of the driveshaft and changes it by 90 degrees to spin the tail rotor blades transversely.",
            difficulty: "Intermediate"
        }
    ];

    const animate = (time, speed, meshes) => {
        const rotationSpeed = speed * 0.5;
        
        // Rotate driveshaft
        if (driveshaftObj && driveshaftObj.mesh) {
            driveshaftObj.mesh.rotation.x += rotationSpeed;
        }
        
        // Rotate rotor blades
        if (bladesObj && bladesObj.mesh) {
            bladesObj.mesh.rotation.z += rotationSpeed * 2; // Tail rotor spins faster than driveshaft visually here
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHelicopterTailRotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
