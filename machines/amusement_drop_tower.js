import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Neon Material
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.5
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(15, 15, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    meshes.basePlatform = baseMesh;
    parts.push({
        name: 'Base Platform',
        description: 'The foundation of the drop tower, housing the hydraulic buffers and providing stability.',
        material: 'darkSteel',
        function: 'Structural support and landing safety.',
        assemblyOrder: 1,
        connections: ['central_tower'],
        failureEffect: 'Structural collapse.',
        cascadeFailures: ['all_components'],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Central Tower Column
    const towerGeo = new THREE.CylinderGeometry(2, 2, 80, 16);
    const towerMesh = new THREE.Mesh(towerGeo, steel);
    towerMesh.position.set(0, 41, 0);
    group.add(towerMesh);
    meshes.centralTower = towerMesh;
    parts.push({
        name: 'Central Tower Column',
        description: 'The main mast of the ride along which the carriage travels.',
        material: 'steel',
        function: 'Guidance and structural backbone.',
        assemblyOrder: 2,
        connections: ['basePlatform', 'magnetic_brakes', 'pulley_system'],
        failureEffect: 'Carriage derailment.',
        cascadeFailures: ['gondola_carriage'],
        originalPosition: { x: 0, y: 41, z: 0 },
        explodedPosition: { x: 0, y: 41, z: 30 }
    });

    // 3. Magnetic Brakes
    const brakeGeo = new THREE.CylinderGeometry(2.2, 2.2, 20, 16);
    const brakeMesh = new THREE.Mesh(brakeGeo, copper);
    brakeMesh.position.set(0, 12, 0);
    group.add(brakeMesh);
    meshes.magneticBrakes = brakeMesh;
    parts.push({
        name: 'Magnetic Brakes (Eddy Current)',
        description: 'Permanent rare-earth magnets interacting with copper fins to provide frictionless braking.',
        material: 'copper',
        function: 'Safely decelerate the gondola at the end of the drop.',
        assemblyOrder: 3,
        connections: ['centralTower'],
        failureEffect: 'Loss of braking force leading to hard impact.',
        cascadeFailures: ['gondola_carriage', 'passengers'],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: -20, y: 12, z: 0 }
    });

    // 4. Gondola Carriage
    const carriageGeo = new THREE.CylinderGeometry(4.5, 4.5, 3, 16, 1, true);
    const carriageMesh = new THREE.Mesh(carriageGeo, chrome);
    carriageMesh.position.set(0, 22, 0);
    group.add(carriageMesh);
    meshes.carriage = carriageMesh;

    const carriageFrameGeo = new THREE.TorusGeometry(3.5, 0.4, 8, 16);
    const topFrame = new THREE.Mesh(carriageFrameGeo, aluminum);
    topFrame.rotation.x = Math.PI / 2;
    topFrame.position.set(0, 1.5, 0);
    carriageMesh.add(topFrame);
    
    const bottomFrame = new THREE.Mesh(carriageFrameGeo, aluminum);
    bottomFrame.rotation.x = Math.PI / 2;
    bottomFrame.position.set(0, -1.5, 0);
    carriageMesh.add(bottomFrame);

    parts.push({
        name: 'Gondola Carriage',
        description: 'The vehicle holding the seats, equipped with magnetic brake fins.',
        material: 'chrome',
        function: 'Transport passengers up and down the tower.',
        assemblyOrder: 4,
        connections: ['centralTower', 'seats', 'hoist_cable'],
        failureEffect: 'Inability to move or uncontrolled descent.',
        cascadeFailures: ['seats'],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 20, y: 22, z: 0 }
    });

    // 5. Seats
    const seatGroup = new THREE.Group();
    const numSeats = 12;
    for (let i = 0; i < numSeats; i++) {
        const angle = (i / numSeats) * Math.PI * 2;
        const seatGeo = new THREE.BoxGeometry(1.5, 2, 1.5);
        const seatMesh = new THREE.Mesh(seatGeo, plastic);
        seatMesh.position.set(Math.cos(angle) * 4.5, 0, Math.sin(angle) * 4.5);
        seatMesh.rotation.y = -angle;

        const restraintGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16, Math.PI);
        const restraintMesh = new THREE.Mesh(restraintGeo, rubber);
        restraintMesh.position.set(0, 0.5, 0.5);
        restraintMesh.rotation.x = Math.PI;
        seatMesh.add(restraintMesh);

        seatGroup.add(seatMesh);
    }
    carriageMesh.add(seatGroup);
    meshes.seats = seatGroup;
    parts.push({
        name: 'Passenger Seats',
        description: 'Ergonomic seats with over-the-shoulder locking harnesses.',
        material: 'plastic',
        function: 'Secure passengers during weightless freefall.',
        assemblyOrder: 5,
        connections: ['gondola_carriage'],
        failureEffect: 'Ejection of passengers.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: 35, y: 22, z: 0 }
    });

    // 6. Neon Lighting Rings
    const neonGeo = new THREE.TorusGeometry(4.8, 0.2, 8, 32);
    const neonMesh1 = new THREE.Mesh(neonGeo, neonBlue);
    neonMesh1.rotation.x = Math.PI / 2;
    neonMesh1.position.y = 1.7;
    carriageMesh.add(neonMesh1);
    meshes.neon1 = neonMesh1;
    
    const neonMesh2 = new THREE.Mesh(neonGeo, neonBlue);
    neonMesh2.rotation.x = Math.PI / 2;
    neonMesh2.position.y = -1.7;
    carriageMesh.add(neonMesh2);
    meshes.neon2 = neonMesh2;

    const topNeonGeo = new THREE.TorusGeometry(2.5, 0.3, 16, 32);
    const topNeon = new THREE.Mesh(topNeonGeo, neonRed);
    topNeon.rotation.x = Math.PI / 2;
    topNeon.position.set(0, 81, 0);
    group.add(topNeon);
    meshes.topNeon = topNeon;
    
    parts.push({
        name: 'Neon Lighting System',
        description: 'High-intensity LED/Neon strips providing visual telemetry.',
        material: 'glass',
        function: 'Visual warnings and aesthetic appeal.',
        assemblyOrder: 6,
        connections: ['gondola_carriage', 'centralTower'],
        failureEffect: 'Loss of visual flair.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 81, z: 0 },
        explodedPosition: { x: 0, y: 90, z: 0 }
    });

    // 7. Hoist Cable
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8); // Height will be scaled
    const cableMesh = new THREE.Mesh(cableGeo, steel);
    group.add(cableMesh);
    meshes.hoistCable = cableMesh;
    parts.push({
        name: 'Hoist Cable',
        description: 'High-tensile steel wire rope.',
        material: 'steel',
        function: 'Lifts the carriage to the drop height.',
        assemblyOrder: 7,
        connections: ['gondola_carriage', 'pulley_system'],
        failureEffect: 'Premature drop.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 50, z: 0 },
        explodedPosition: { x: -10, y: 50, z: 0 }
    });

    // 8. Pulley System
    const crownGeo = new THREE.CylinderGeometry(3, 3, 2, 16);
    const crownMesh = new THREE.Mesh(crownGeo, darkSteel);
    crownMesh.position.set(0, 80, 0);
    group.add(crownMesh);
    meshes.pulley = crownMesh;
    parts.push({
        name: 'Crown Pulley System',
        description: 'The top assembly housing the sheaves and winch motors.',
        material: 'darkSteel',
        function: 'Routes the hoist cable and houses drop release mechanisms.',
        assemblyOrder: 8,
        connections: ['centralTower', 'hoist_cable'],
        failureEffect: 'Cable jam.',
        cascadeFailures: ['hoist_cable'],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    const description = "The Amusement Drop Tower is an engineering marvel designed to induce weightlessness and high G-forces safely. It employs a massive winch system to hoist the passenger gondola 80 meters into the air, a quick-release catch car, and passive magnetic eddy-current brakes that require no external power to stop the carriage reliably.";

    const quizQuestions = [
        {
            question: "Why do drop towers frequently use magnetic (eddy current) brakes instead of friction pads?",
            options: [
                "They are cheaper to install.",
                "They require no power, never wear out due to friction, and brake smoothly depending on speed.",
                "They generate electricity that powers the ride.",
                "They make the carriage lighter."
            ],
            correct: 1,
            explanation: "Eddy current brakes are fail-safe because they rely purely on the relative motion between permanent magnets and conductive fins, requiring no electricity or contact, thus eliminating wear.",
            difficulty: "Medium"
        },
        {
            question: "What physical sensation is experienced during the initial phase of the drop?",
            options: [
                "2 Gs of acceleration.",
                "Weightlessness (Zero-G).",
                "Lateral G-forces.",
                "Negative 2 Gs."
            ],
            correct: 1,
            explanation: "As the carriage falls freely under gravity, passengers experience a brief period of weightlessness (0 G) before the brakes engage.",
            difficulty: "Easy"
        },
        {
            question: "What happens if there is a complete power outage while the gondola is falling?",
            options: [
                "The carriage crashes into the ground.",
                "Emergency friction pads deploy.",
                "The magnetic brakes safely stop the carriage anyway.",
                "The carriage gets stuck mid-air."
            ],
            correct: 2,
            explanation: "Because the magnetic brakes consist of permanent magnets on the carriage and copper/aluminum fins on the tower, the braking force is generated by movement, completely independent of the power grid.",
            difficulty: "Hard"
        }
    ];

    let phase = 'climb';
    let carriageY = 22;
    let waitTimer = 0;
    const maxHeight = 76;
    const restHeight = 22;
    const brakeStart = 40; 
    let velocityY = 0;
    const gravity = -30;

    function animate(time, speed) {
        const delta = speed * 0.016;

        meshes.topNeon.material.emissiveIntensity = 1 + Math.sin(time * 5) * 0.5;

        if (phase === 'climb') {
            carriageY += 5 * delta;
            meshes.neon1.material.emissiveIntensity = 1.5;
            meshes.neon2.material.emissiveIntensity = 1.5;
            meshes.topNeon.material.emissive.setHex(0xff0000);
            
            if (carriageY >= maxHeight) {
                carriageY = maxHeight;
                phase = 'wait';
                waitTimer = 0;
            }
        } else if (phase === 'wait') {
            waitTimer += delta;
            meshes.neon1.material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 1.0;
            meshes.neon2.material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 1.0;
            if (waitTimer > 3) {
                phase = 'drop';
                velocityY = 0;
                meshes.neon1.material.emissiveIntensity = 0;
                meshes.neon2.material.emissiveIntensity = 0;
            }
        } else if (phase === 'drop') {
            velocityY += gravity * delta;
            carriageY += velocityY * delta;
            if (carriageY <= brakeStart) {
                phase = 'brake';
            }
        } else if (phase === 'brake') {
            const brakeForce = -velocityY * 2.5; 
            velocityY += (gravity + brakeForce) * delta;
            carriageY += velocityY * delta;

            if (carriageY <= restHeight) {
                carriageY = restHeight;
                velocityY = 0;
                phase = 'rest';
                waitTimer = 0;
            }
        } else if (phase === 'rest') {
            meshes.neon1.material.emissiveIntensity = 1.5; 
            meshes.neon2.material.emissiveIntensity = 1.5;
            meshes.topNeon.material.emissive.setHex(0x00ff00);
            waitTimer += delta;
            if (waitTimer > 3) {
                phase = 'climb';
            }
        }

        meshes.carriage.position.y = carriageY;

        const cableLength = 80 - carriageY;
        if (phase === 'climb' || phase === 'wait') {
            meshes.hoistCable.visible = true;
            meshes.hoistCable.scale.y = Math.max(0.01, cableLength);
            meshes.hoistCable.position.y = 80 - cableLength / 2;
        } else {
            meshes.hoistCable.visible = false;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDropTower() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
