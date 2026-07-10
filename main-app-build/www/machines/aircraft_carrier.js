import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    // Parts

    // 1. Hull
    const hullGeometry = new THREE.BoxGeometry(20, 4, 60);
    const hullMesh = new THREE.Mesh(hullGeometry, darkSteel);
    hullMesh.position.set(0, -2, 0);
    group.add(hullMesh);
    parts.push({
        name: 'Hull',
        description: 'The main body of the aircraft carrier.',
        material: 'darkSteel',
        function: 'Provides buoyancy, houses internal systems, and supports the flight deck.',
        assemblyOrder: 1,
        connections: ['Flight Deck', 'Propulsion System'],
        failureEffect: 'Loss of buoyancy, ship sinks.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: hullMesh
    });

    // 2. Flight Deck
    const deckGeometry = new THREE.BoxGeometry(22, 0.5, 62);
    const deckMesh = new THREE.Mesh(deckGeometry, steel);
    deckMesh.position.set(0, 0.25, 0);
    group.add(deckMesh);
    parts.push({
        name: 'Flight Deck',
        description: 'The landing and takeoff area for aircraft.',
        material: 'steel',
        function: 'Provides a flat, durable surface for aircraft operations.',
        assemblyOrder: 2,
        connections: ['Hull', 'Catapult System', 'Arresting Wires'],
        failureEffect: 'Aircraft cannot launch or land safely.',
        cascadeFailures: ['Air Operations'],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: deckMesh
    });

    // 3. Steam Catapult Track 1
    const catapultGeometry = new THREE.BoxGeometry(0.5, 0.6, 25);
    const catapultMesh1 = new THREE.Mesh(catapultGeometry, glowingBlue);
    catapultMesh1.position.set(-6, 0.26, -15);
    group.add(catapultMesh1);
    parts.push({
        name: 'Steam Catapult Track 1',
        description: 'Accelerates aircraft to takeoff speed.',
        material: 'glowingBlue',
        function: 'Provides rapid acceleration for heavy aircraft over a short distance.',
        assemblyOrder: 3,
        connections: ['Flight Deck', 'Catapult Shuttle 1'],
        failureEffect: 'Cannot launch aircraft from this track.',
        cascadeFailures: ['Launch Operations (partial)'],
        originalPosition: { x: -6, y: 0.26, z: -15 },
        explodedPosition: { x: -12, y: 8, z: -15 },
        mesh: catapultMesh1
    });

    // 4. Catapult Shuttle 1
    const shuttleGeometry = new THREE.BoxGeometry(1.5, 0.8, 2);
    const shuttleMesh1 = new THREE.Mesh(shuttleGeometry, chrome);
    shuttleMesh1.position.set(-6, 0.6, -2);
    group.add(shuttleMesh1);
    parts.push({
        name: 'Catapult Shuttle 1',
        description: 'Connects the aircraft to the catapult track.',
        material: 'chrome',
        function: 'Transfers the force of the catapult track to the aircraft.',
        assemblyOrder: 4,
        connections: ['Steam Catapult Track 1', 'Aircraft'],
        failureEffect: 'Aircraft cannot be launched from this track.',
        cascadeFailures: [],
        originalPosition: { x: -6, y: 0.6, z: -2 },
        explodedPosition: { x: -12, y: 10, z: -2 },
        mesh: shuttleMesh1
    });

    // 5. Island (Control Tower)
    const islandGeometry = new THREE.BoxGeometry(3, 8, 10);
    const islandMesh = new THREE.Mesh(islandGeometry, darkSteel);
    islandMesh.position.set(8, 4.5, 10);
    group.add(islandMesh);
    parts.push({
        name: 'Island Control Tower',
        description: 'Command center for ship navigation and flight operations.',
        material: 'darkSteel',
        function: 'Houses bridge, primary flight control, and radar systems.',
        assemblyOrder: 5,
        connections: ['Flight Deck', 'Radar Mast'],
        failureEffect: 'Loss of command and control.',
        cascadeFailures: ['Ship Navigation', 'Air Operations'],
        originalPosition: { x: 8, y: 4.5, z: 10 },
        explodedPosition: { x: 20, y: 15, z: 10 },
        mesh: islandMesh
    });

    // 6. Radar Mast
    const mastGeometry = new THREE.CylinderGeometry(0.5, 1, 6, 16);
    const mastMesh = new THREE.Mesh(mastGeometry, aluminum);
    mastMesh.position.set(8, 11, 8);
    group.add(mastMesh);
    parts.push({
        name: 'Radar Mast',
        description: 'Supports radar and communication antennas.',
        material: 'aluminum',
        function: 'Detects incoming aircraft, ships, and threats.',
        assemblyOrder: 6,
        connections: ['Island Control Tower'],
        failureEffect: 'Loss of situational awareness.',
        cascadeFailures: ['Air Defense'],
        originalPosition: { x: 8, y: 11, z: 8 },
        explodedPosition: { x: 20, y: 25, z: 8 },
        mesh: mastMesh
    });

    // 7. Radar Dish
    const dishGeometry = new THREE.SphereGeometry(2, 16, 16, 0, Math.PI);
    const dishMesh = new THREE.Mesh(dishGeometry, glowingGreen);
    dishMesh.position.set(8, 14, 8);
    dishMesh.rotation.x = Math.PI / 2;
    group.add(dishMesh);
    parts.push({
        name: 'Primary Radar Dish',
        description: 'Scans the airspace for aircraft.',
        material: 'glowingGreen',
        function: 'Emits and receives radio waves to track objects.',
        assemblyOrder: 7,
        connections: ['Radar Mast'],
        failureEffect: 'Cannot detect aircraft.',
        cascadeFailures: ['Air Traffic Control', 'Air Defense'],
        originalPosition: { x: 8, y: 14, z: 8 },
        explodedPosition: { x: 25, y: 30, z: 8 },
        mesh: dishMesh
    });

    // 8. Arresting Wires
    const wireGeometry = new THREE.CylinderGeometry(0.1, 0.1, 16);
    const wiresGroup = new THREE.Group();
    
    for (let i = 0; i < 4; i++) {
        const wireMesh = new THREE.Mesh(wireGeometry, glowingRed);
        wireMesh.rotation.z = Math.PI / 2;
        wireMesh.position.set(0, 0.6, 20 + i * 2);
        wiresGroup.add(wireMesh);
    }
    group.add(wiresGroup);
    parts.push({
        name: 'Arresting Wires',
        description: 'Steel cables that catch landing aircraft.',
        material: 'glowingRed',
        function: 'Rapidly decelerates landing aircraft safely.',
        assemblyOrder: 8,
        connections: ['Flight Deck', 'Arresting Gear Engines'],
        failureEffect: 'Aircraft cannot land safely (must divert or ditch).',
        cascadeFailures: ['Recovery Operations'],
        originalPosition: { x: 0, y: 0.6, z: 23 },
        explodedPosition: { x: 0, y: 10, z: 35 },
        mesh: wiresGroup
    });
    
    // 9. Jet Blast Deflector
    const deflectorGeometry = new THREE.BoxGeometry(4, 2, 0.5);
    const deflectorMesh = new THREE.Mesh(deflectorGeometry, steel);
    deflectorMesh.position.set(-6, 1, -1);
    deflectorMesh.rotation.x = -Math.PI / 6;
    group.add(deflectorMesh);
    parts.push({
        name: 'Jet Blast Deflector',
        description: 'Protects personnel and equipment from jet exhaust.',
        material: 'steel',
        function: 'Redirects hot exhaust gases upwards during aircraft launch.',
        assemblyOrder: 9,
        connections: ['Flight Deck'],
        failureEffect: 'Hazard to deck crew and trailing aircraft.',
        cascadeFailures: ['Launch Operations (safety delay)'],
        originalPosition: { x: -6, y: 1, z: -1 },
        explodedPosition: { x: -15, y: 5, z: 5 },
        mesh: deflectorMesh
    });

    const description = "The Aircraft Carrier is a massive warship acting as a seagoing airbase. It features a full-length flight deck and facilities for carrying, arming, deploying, and recovering aircraft. Key components like the steam catapults and arresting wires enable the launch and recovery of heavy, high-speed jet aircraft in a remarkably short distance.";

    const quizQuestions = [
        {
            question: "What is the primary function of the steam catapult system?",
            options: [
                "To rapidly decelerate landing aircraft",
                "To accelerate aircraft to takeoff speed over a short distance",
                "To generate power for the ship's radar",
                "To move aircraft between the hangar and flight deck"
            ],
            correct: 1,
            explanation: "The steam catapult system provides massive thrust to accelerate heavy aircraft to their required liftoff speed within the short length of the flight deck.",
            difficulty: "easy"
        },
        {
            question: "Which component protects the deck crew from hot engine exhaust during a launch?",
            options: [
                "Arresting Wires",
                "Catapult Shuttle",
                "Jet Blast Deflector",
                "Island Control Tower"
            ],
            correct: 2,
            explanation: "The Jet Blast Deflector is raised behind the aircraft before launch to redirect the intense, hot exhaust gases safely upwards.",
            difficulty: "medium"
        },
        {
            question: "What happens if all arresting wires fail or break during flight operations?",
            options: [
                "Aircraft can use the catapult to land",
                "Aircraft simply land normally like on a standard runway",
                "Aircraft must divert to land on ground bases or another carrier",
                "The ship stops immediately"
            ],
            correct: 2,
            explanation: "Without arresting wires to catch the tailhook, aircraft do not have enough runway to stop safely on a carrier and must divert or, in worst cases, ditch into the sea.",
            difficulty: "hard"
        }
    ];

    let timeOffset = 0;

    function animate(time, speed, meshes) {
        timeOffset += speed * 0.05;

        // Rotate primary radar dish
        if (meshes['Primary Radar Dish']) {
            meshes['Primary Radar Dish'].rotation.z = timeOffset * 2;
        }

        // Pulse neon catapult track
        if (meshes['Steam Catapult Track 1']) {
            const intensity = 0.8 + 0.7 * Math.sin(timeOffset * 5);
            meshes['Steam Catapult Track 1'].material.emissiveIntensity = intensity;
        }

        // Animate catapult shuttle (launch cycle)
        if (meshes['Catapult Shuttle 1']) {
            const cycle = timeOffset % 10;
            if (cycle < 2) {
                // Launch phase
                meshes['Catapult Shuttle 1'].position.z = -2 - (cycle / 2) * 25;
            } else if (cycle < 4) {
                // Return phase
                const returnCycle = cycle - 2;
                meshes['Catapult Shuttle 1'].position.z = -27 + (returnCycle / 2) * 25;
            } else {
                // Reset/Ready phase
                meshes['Catapult Shuttle 1'].position.z = -2;
            }
        }
        
        // Pulse arresting wires
        if (meshes['Arresting Wires']) {
             const children = meshes['Arresting Wires'].children;
             for(let i = 0; i < children.length; i++) {
                 children[i].material.emissiveIntensity = 0.5 + 0.5 * Math.sin(timeOffset * 3 + i);
             }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAircraftCarrier() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
