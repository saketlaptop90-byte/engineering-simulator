import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const mahoganyMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a0404,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xb5a642,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });

    const neonBlackMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x000000,
        roughness: 0.1,
        metalness: 0.5
    });

    const neonGreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingBallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const baseGeometry = new THREE.CylinderGeometry(15, 16, 4, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, mahoganyMaterial);
    baseMesh.position.y = -2;
    group.add(baseMesh);
    parts.push({
        name: 'Mahogany Base',
        description: 'The solid foundation of the roulette wheel, constructed from polished mahogany.',
        material: 'Mahogany',
        function: 'Provides stability and houses the central bearing mechanism.',
        assemblyOrder: 1,
        connections: ['Central Bearing', 'Outer Track'],
        failureEffect: 'Wobbling of the entire structure.',
        cascadeFailures: ['Bearing Misalignment', 'Inconsistent Spin'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: baseMesh
    });

    const outerTrackGeometry = new THREE.TorusGeometry(13.5, 1.5, 16, 64);
    const outerTrackMesh = new THREE.Mesh(outerTrackGeometry, mahoganyMaterial);
    outerTrackMesh.rotation.x = Math.PI / 2;
    outerTrackMesh.position.y = 0.5;
    group.add(outerTrackMesh);
    parts.push({
        name: 'Outer Ball Track',
        description: 'The track where the ball is initially spun before it decelerates.',
        material: 'Mahogany',
        function: 'Allows the ball to spin in the opposite direction of the wheel head with minimal friction.',
        assemblyOrder: 2,
        connections: ['Mahogany Base', 'Deflectors'],
        failureEffect: 'Ball gets stuck or jumps out of the wheel.',
        cascadeFailures: ['Game Invalidated'],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: outerTrackMesh
    });

    // Rotor (The spinning part)
    const rotorGroup = new THREE.Group();
    group.add(rotorGroup);

    const rotorBaseGeometry = new THREE.CylinderGeometry(11, 11, 1.5, 64);
    const rotorBaseMesh = new THREE.Mesh(rotorBaseGeometry, chrome);
    rotorBaseMesh.position.y = -0.25;
    rotorGroup.add(rotorBaseMesh);
    parts.push({
        name: 'Rotor Base',
        description: 'The central rotating disc that holds the pockets.',
        material: 'Chrome',
        function: 'Spins freely on the central bearing to determine the winning number.',
        assemblyOrder: 3,
        connections: ['Central Bearing', 'Pockets', 'Turret'],
        failureEffect: 'Wheel ceases to spin smoothly or stops abruptly.',
        cascadeFailures: ['Bearing Seizure'],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: rotorBaseMesh
    });

    // Pockets
    const pocketsGroup = new THREE.Group();
    rotorGroup.add(pocketsGroup);
    
    const pocketCount = 38; // American Roulette
    const pocketAngle = (Math.PI * 2) / pocketCount;
    
    for (let i = 0; i < pocketCount; i++) {
        let mat = i === 0 || i === 19 ? neonGreenMaterial : (i % 2 === 0 ? neonBlackMaterial : neonRedMaterial); // Simplified coloring
        
        const pocketGeo = new THREE.BoxGeometry(1.6, 1.5, 2.5);
        const pocketMesh = new THREE.Mesh(pocketGeo, mat);
        
        const angle = i * pocketAngle;
        const radius = 9.5;
        pocketMesh.position.set(Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius);
        pocketMesh.rotation.y = -angle;
        pocketsGroup.add(pocketMesh);
    }
    
    parts.push({
        name: 'Pocket Ring',
        description: 'The ring of numbered slots where the ball eventually lands.',
        material: 'Neon Acrylic / Metal',
        function: 'Captures the ball in a specific numbered slot to determine the game outcome.',
        assemblyOrder: 4,
        connections: ['Rotor Base', 'Frets'],
        failureEffect: 'Ball bounces out incorrectly or favors certain numbers.',
        cascadeFailures: ['Loss of Randomness'],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: pocketsGroup
    });

    // Turret (Cone in the center)
    const turretGeometry = new THREE.ConeGeometry(5, 4, 32);
    const turretMesh = new THREE.Mesh(turretGeometry, chrome);
    turretMesh.position.y = 2.5;
    rotorGroup.add(turretMesh);
    parts.push({
        name: 'Turret (Cone)',
        description: 'The decorative and functional center piece of the rotor.',
        material: 'Chrome',
        function: 'Prevents the ball from settling in the center and houses the handle for spinning.',
        assemblyOrder: 5,
        connections: ['Rotor Base'],
        failureEffect: 'Aesthetic damage or balance issues.',
        cascadeFailures: ['Rotor Imbalance'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 },
        mesh: turretMesh
    });
    
    // Central Bearing
    const bearingGeometry = new THREE.CylinderGeometry(1, 1, 3, 16);
    const bearingMesh = new THREE.Mesh(bearingGeometry, steel);
    bearingMesh.position.y = -1;
    group.add(bearingMesh);
    parts.push({
        name: 'Precision Ball Bearing',
        description: 'The high-precision bearing that supports the entire rotor weight.',
        material: 'Stainless Steel',
        function: 'Ensures a long, smooth, and near-frictionless spin of the rotor.',
        assemblyOrder: 6,
        connections: ['Mahogany Base', 'Rotor Base'],
        failureEffect: 'Grinding noise, shortened spin times.',
        cascadeFailures: ['Complete Rotor Seizure', 'Bias Introduction'],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: bearingMesh
    });

    // The Ball
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMesh = new THREE.Mesh(ballGeometry, glowingBallMaterial);
    ballMesh.position.set(13, 1, 0); // Starting on the track
    group.add(ballMesh);
    parts.push({
        name: 'Roulette Ball',
        description: 'The spherical ball spun on the outer track.',
        material: 'Teflon / Ivorine (Glowing)',
        function: 'Falls into a pocket to determine the winning number.',
        assemblyOrder: 7,
        connections: ['Outer Track', 'Pocket Ring'],
        failureEffect: 'Cracking or chipping leading to erratic bouncing.',
        cascadeFailures: ['Unpredictable Physics'],
        originalPosition: { x: 13, y: 1, z: 0 },
        explodedPosition: { x: 20, y: 5, z: 0 },
        mesh: ballMesh
    });

    // Deflectors (Diamonds)
    const deflectorsGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const deflectorGeo = new THREE.OctahedronGeometry(0.5);
        const deflectorMesh = new THREE.Mesh(deflectorGeo, brassMaterial);
        const angle = i * (Math.PI / 4);
        deflectorMesh.position.set(Math.cos(angle) * 11, 1, Math.sin(angle) * 11);
        deflectorMesh.rotation.y = angle;
        deflectorsGroup.add(deflectorMesh);
    }
    group.add(deflectorsGroup);
    parts.push({
        name: 'Deflectors (Diamonds)',
        description: 'Metal obstacles placed on the slope of the bowl.',
        material: 'Brass',
        function: 'Interrupts the ball\'s trajectory, adding randomness to its fall.',
        assemblyOrder: 8,
        connections: ['Mahogany Base'],
        failureEffect: 'Missing deflector alters drop probabilities.',
        cascadeFailures: ['Predictable Ball Drop'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 },
        mesh: deflectorsGroup
    });


    const description = "The Casino Roulette Wheel is a pinnacle of precision engineering disguised as a game of chance. It consists of a static wooden bowl, an outer track for the ball, and a perfectly balanced spinning rotor (the wheel head) supported by a high-grade central ball bearing. The precision ensures fair, unbiased outcomes.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Central Bearing?",
            options: [
                "To determine the winning number.",
                "To ensure near-frictionless, long spin times for the rotor.",
                "To interrupt the ball's trajectory.",
                "To keep the mahogany base stable."
            ],
            correct: 1,
            explanation: "The central bearing is crucial for the smooth operation of the roulette wheel, minimizing friction so the rotor can spin freely for an extended period, ensuring fairness.",
            difficulty: "easy"
        },
        {
            question: "Why are Deflectors (Diamonds) placed on the bowl's slope?",
            options: [
                "Purely for aesthetic decoration.",
                "To help the ball accelerate.",
                "To add unpredictability to the ball's path as it falls towards the pockets.",
                "To prevent the ball from flying out of the wheel."
            ],
            correct: 2,
            explanation: "Deflectors are deliberately placed to disrupt the ball's smooth descent, introducing chaotic bounces that make predicting the final landing spot nearly impossible.",
            difficulty: "medium"
        },
        {
            question: "What is a potential consequence if the Outer Track becomes misaligned or damaged?",
            options: [
                "The ball might get stuck or jump out, invalidating the spin.",
                "The rotor will spin faster.",
                "The deflectors will fall off.",
                "The pockets will change colors."
            ],
            correct: 0,
            explanation: "The outer track provides the initial centrifugal path for the ball. Any imperfection can cause the ball to derail, requiring a voided spin.",
            difficulty: "medium"
        }
    ];

    let spinAngle = 0;
    let ballAngle = 0;
    let ballRadius = 13.5;
    let ballSpeed = 0.1;
    let ballY = 1.5;

    function animate(time, speed, meshes) {
        // Rotor spins one way
        spinAngle += 0.02 * speed;
        const rotorBaseMesh = meshes.find(m => m.name === 'Rotor Base');
        if (rotorBaseMesh && rotorBaseMesh.mesh && rotorBaseMesh.mesh.parent) {
            rotorBaseMesh.mesh.parent.rotation.y = -spinAngle;
        }

        // Ball spins the other way, gradually spiraling in
        ballAngle += ballSpeed * speed;
        
        // Very basic simulation of ball dropping
        if (ballSpeed > 0.02) {
             ballSpeed -= 0.0001 * speed;
        } else {
             if (ballRadius > 9.5) {
                 ballRadius -= 0.05 * speed;
                 ballY -= 0.01 * speed;
             }
        }
        
        if (ballRadius < 9.5) ballRadius = 9.5;
        if (ballY < 0.5) ballY = 0.5;

        const ballPart = meshes.find(m => m.name === 'Roulette Ball');
        if (ballPart && ballPart.mesh) {
            ballPart.mesh.position.x = Math.cos(ballAngle) * ballRadius;
            ballPart.mesh.position.z = Math.sin(ballAngle) * ballRadius;
            ballPart.mesh.position.y = ballY;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRouletteWheel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
