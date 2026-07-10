import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for visual flair
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.1,
        roughness: 0.2
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.2,
        roughness: 0.3
    });

    const polishedBrass = new THREE.MeshStandardMaterial({
        color: 0xb5a642,
        metalness: 0.9,
        roughness: 0.1
    });

    // 1. Outer Housing
    const housingGeom = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true);
    const housing = new THREE.Mesh(housingGeom, darkSteel);
    housing.rotation.x = Math.PI / 2;
    group.add(housing);
    meshes.housing = housing;

    parts.push({
        name: "Outer Housing",
        description: "Encloses the gyroscope mechanism, providing a sealed environment and structural support.",
        material: "Dark Steel",
        function: "Protection and mounting for the instrument panel.",
        assemblyOrder: 1,
        connections: ["Outer Gimbal", "Glass Faceplate"],
        failureEffect: "Contamination of bearings and instrument failure.",
        cascadeFailures: ["Rotor bearing friction", "Gimbal lock"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 2. Outer Gimbal (Roll)
    const outerGimbalGeom = new THREE.TorusGeometry(3.5, 0.2, 16, 64);
    const outerGimbal = new THREE.Mesh(outerGimbalGeom, aluminum);
    group.add(outerGimbal);
    meshes.outerGimbal = outerGimbal;

    parts.push({
        name: "Outer Gimbal (Roll Ring)",
        description: "The outermost moving ring of the gyroscope, pivoted on the housing's longitudinal axis.",
        material: "Aluminum",
        function: "Allows the aircraft to roll freely without affecting the spinning rotor's orientation.",
        assemblyOrder: 2,
        connections: ["Outer Housing", "Inner Gimbal"],
        failureEffect: "Loss of roll indication.",
        cascadeFailures: ["Incorrect attitude readings during banking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Inner Gimbal (Pitch)
    const innerGimbalGeom = new THREE.TorusGeometry(2.8, 0.2, 16, 64);
    const innerGimbal = new THREE.Mesh(innerGimbalGeom, steel);
    innerGimbal.rotation.y = Math.PI / 2;
    outerGimbal.add(innerGimbal);
    meshes.innerGimbal = innerGimbal;

    parts.push({
        name: "Inner Gimbal (Pitch Ring)",
        description: "Pivots within the outer gimbal on the lateral axis.",
        material: "Steel",
        function: "Allows the aircraft to pitch freely while the rotor remains upright.",
        assemblyOrder: 3,
        connections: ["Outer Gimbal", "Rotor Assembly"],
        failureEffect: "Loss of pitch indication.",
        cascadeFailures: ["Incorrect attitude readings during climbs or descents"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 4. Rotor
    const rotorGeom = new THREE.CylinderGeometry(2, 2, 1, 32);
    const rotor = new THREE.Mesh(rotorGeom, polishedBrass);
    innerGimbal.add(rotor);
    meshes.rotor = rotor;

    parts.push({
        name: "Gyroscopic Rotor",
        description: "A heavy, rapidly spinning disc made of dense material, acting as the heart of the instrument.",
        material: "Polished Brass",
        function: "Maintains rigidity in space due to gyroscopic inertia, establishing a fixed reference plane.",
        assemblyOrder: 4,
        connections: ["Inner Gimbal"],
        failureEffect: "Complete loss of reliable attitude indication.",
        cascadeFailures: ["Gimbal tumbling", "Instrument failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 5. Spin Axis / Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const shaft = new THREE.Mesh(shaftGeom, chrome);
    rotor.add(shaft);

    parts.push({
        name: "Spin Axis Shaft",
        description: "The axle upon which the gyroscopic rotor spins.",
        material: "Chrome",
        function: "Supports the rotor and couples it to the inner gimbal bearings.",
        assemblyOrder: 5,
        connections: ["Rotor", "Inner Gimbal"],
        failureEffect: "Rotor wobbling or bearing seizure.",
        cascadeFailures: ["Rotor crash", "Total loss of gyroscopic rigidity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 6. Horizon Card / Display Sphere (attached to inner gimbal)
    const cardGeom = new THREE.SphereGeometry(3.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const card = new THREE.Mesh(cardGeom, neonOrange);
    card.rotation.x = -Math.PI / 2;
    innerGimbal.add(card);
    meshes.card = card;

    parts.push({
        name: "Horizon Card",
        description: "A spherical section visually representing the sky and ground (artificial horizon).",
        material: "Neon Orange (Synthetic)",
        function: "Provides visual attitude reference to the pilot based on the rotor's fixed position.",
        assemblyOrder: 6,
        connections: ["Inner Gimbal"],
        failureEffect: "Loss of visual interpretation of attitude.",
        cascadeFailures: ["Pilot spatial disorientation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 7. Glass Faceplate
    const glassGeom = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const glassFace = new THREE.Mesh(glassGeom, tinted);
    glassFace.position.z = 3.1;
    glassFace.rotation.x = Math.PI / 2;
    group.add(glassFace);

    parts.push({
        name: "Instrument Faceplate",
        description: "Transparent front cover of the instrument with miniature aircraft reference markings.",
        material: "Tinted Glass",
        function: "Protects the internals and provides a stationary reference (the miniature airplane) against the moving horizon card.",
        assemblyOrder: 7,
        connections: ["Outer Housing"],
        failureEffect: "Exposure of internals to dust/moisture.",
        cascadeFailures: ["Bearing degradation"],
        originalPosition: { x: 0, y: 0, z: 3.1 },
        explodedPosition: { x: 0, y: 0, z: 10 }
    });

    // Decorative/High-Tech glowing elements on the rotor
    const glowRingGeom = new THREE.TorusGeometry(2.1, 0.05, 16, 64);
    const glowRing1 = new THREE.Mesh(glowRingGeom, neonCyan);
    glowRing1.rotation.x = Math.PI / 2;
    rotor.add(glowRing1);
    
    const glowRing2 = new THREE.Mesh(glowRingGeom, neonCyan);
    glowRing2.rotation.x = Math.PI / 2;
    glowRing2.position.y = 0.4;
    rotor.add(glowRing2);
    
    const glowRing3 = new THREE.Mesh(glowRingGeom, neonCyan);
    glowRing3.rotation.x = Math.PI / 2;
    glowRing3.position.y = -0.4;
    rotor.add(glowRing3);

    const description = "An advanced Attitude Indicator (Artificial Horizon) utilizing a universally mounted high-speed gyroscope. The spinning brass rotor maintains rigidity in space while the gimbals allow the aircraft's pitch and roll to change freely around it, accurately displaying the aircraft's orientation relative to the earth's horizon.";

    const quizQuestions = [
        {
            question: "What physical principle allows the gyroscope rotor to act as a reliable attitude reference?",
            options: [
                "Magnetic induction",
                "Gyroscopic rigidity in space",
                "Centrifugal force",
                "Aerodynamic lift"
            ],
            correct: 1,
            explanation: "A rapidly spinning mass resists changes to its axis of rotation, a property known as gyroscopic inertia or rigidity in space.",
            difficulty: "Medium"
        },
        {
            question: "In an attitude indicator, which component moves to indicate aircraft roll?",
            options: [
                "The rotor",
                "The outer gimbal",
                "The inner gimbal",
                "The instrument housing"
            ],
            correct: 3,
            explanation: "The instrument housing (attached to the aircraft) rotates around the gimbals. From the pilot's perspective, the miniature airplane on the housing tilts relative to the fixed horizon card.",
            difficulty: "Hard"
        },
        {
            question: "What would be the effect of excessive friction in the inner gimbal bearings?",
            options: [
                "The rotor would spin faster",
                "The instrument would indicate incorrect pitch",
                "Gyroscopic precession would cause pitch/roll errors",
                "The glass faceplate would shatter"
            ],
            correct: 2,
            explanation: "Friction in gimbal bearings applies a torque to the spinning rotor. Due to gyroscopic precession, this torque causes a displacement 90 degrees in the direction of rotation, leading to indication errors.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, explodedness) {
        // Rotor spins extremely fast (rigidity)
        if (meshes.rotor) {
            meshes.rotor.rotation.y += speed * 0.5;
        }

        // Simulating roll and pitch of the aircraft
        const simulatedRoll = Math.sin(time * 0.5) * 0.5; // Aircraft roll
        const simulatedPitch = Math.cos(time * 0.3) * 0.3; // Aircraft pitch

        // In a real instrument, the outer gimbal is attached to the housing.
        // For visualization, we keep the outer housing still and rotate the gimbals
        // to show how they isolate the rotor.
        if (meshes.outerGimbal) {
            meshes.outerGimbal.rotation.z = -simulatedRoll;
        }
        if (meshes.innerGimbal) {
            meshes.innerGimbal.rotation.x = -simulatedPitch;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAvionicsGyroscope() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
