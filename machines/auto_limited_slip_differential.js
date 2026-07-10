import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing/neon materials for visual flair
    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044aa,
        emissiveIntensity: 2.5,
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowingOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 3.0,
        metalness: 0.5,
        roughness: 0.3
    });

    const neonPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0x5500aa,
        emissiveIntensity: 2.0,
        metalness: 0.9,
        roughness: 0.2
    });

    // 1. Differential Case (Housing)
    // Uses a hollow cylinder or complex shape. We'll use a standard cylinder and make it wireframe or transparent to see inside.
    const caseGeo = new THREE.CylinderGeometry(3.2, 3.2, 4.5, 32);
    const caseMat = darkSteel.clone();
    caseMat.transparent = true;
    caseMat.opacity = 0.4;
    caseMat.wireframe = true;
    const diffCase = new THREE.Mesh(caseGeo, caseMat);
    diffCase.rotation.z = Math.PI / 2;
    group.add(diffCase);
    parts.push({
        name: "Differential Housing",
        description: "The main casing that houses the gear assembly and clutch packs. Made semi-transparent/wireframe to reveal internal mechanics.",
        material: "Dark Steel (Wireframe)",
        function: "Encloses internal components and transfers torque from the ring gear to the spider gears.",
        assemblyOrder: 1,
        connections: ["Ring Gear", "Spider Gears", "Clutch Packs"],
        failureEffect: "Complete loss of torque transmission.",
        cascadeFailures: ["Gear misalignment", "Fluid leakage", "Catastrophic driveline failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: diffCase
    });

    // 2. Ring Gear
    const ringGeo = new THREE.TorusGeometry(3.5, 0.6, 16, 64);
    const ringGear = new THREE.Mesh(ringGeo, steel);
    ringGear.position.x = -1.5;
    ringGear.rotation.y = Math.PI / 2;
    group.add(ringGear);
    parts.push({
        name: "Ring Gear",
        description: "Large bevel gear that receives power from the drive shaft's pinion gear.",
        material: "High-Strength Steel",
        function: "Multiplies torque and changes rotation direction by 90 degrees.",
        assemblyOrder: 2,
        connections: ["Differential Housing", "Pinion Gear"],
        failureEffect: "Vehicle will not move; grinding noise.",
        cascadeFailures: ["Damaged pinion gear", "Differential housing fracture"],
        originalPosition: { x: -1.5, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 5, z: 0 },
        mesh: ringGear
    });

    // 3. Spider Gears (Pinion Gears inside diff)
    const spiderGroup = new THREE.Group();
    for(let i=0; i<2; i++) {
        const spGeo = new THREE.ConeGeometry(0.8, 1.5, 16);
        const spider = new THREE.Mesh(spGeo, chrome);
        spider.position.y = (i === 0 ? 1.4 : -1.4);
        spider.rotation.x = (i === 0 ? 0 : Math.PI);
        spiderGroup.add(spider);
    }
    group.add(spiderGroup);
    parts.push({
        name: "Spider Gears",
        description: "Bevel gears mounted on a cross pin, allowing axles to spin at different speeds.",
        material: "Chrome",
        function: "Distributes torque between side gears while allowing differential rotation.",
        assemblyOrder: 3,
        connections: ["Differential Housing", "Side Gears"],
        failureEffect: "Clicking or clunking sounds while turning, wheel hop.",
        cascadeFailures: ["Side gear damage", "Cross pin failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 },
        mesh: spiderGroup
    });

    // 4. Side Gears (Left and Right)
    const leftSideGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 16);
    const leftSide = new THREE.Mesh(leftSideGeo, neonPurple);
    leftSide.position.x = -1.2;
    leftSide.rotation.z = Math.PI / 2;
    group.add(leftSide);
    
    const rightSideGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 16);
    const rightSide = new THREE.Mesh(rightSideGeo, neonPurple);
    rightSide.position.x = 1.2;
    rightSide.rotation.z = Math.PI / 2;
    group.add(rightSide);

    parts.push({
        name: "Side Gears",
        description: "Splined gears that connect the spider gears directly to the axle shafts.",
        material: "Neon Purple Alloy",
        function: "Transfers power from spider gears to the axles.",
        assemblyOrder: 4,
        connections: ["Spider Gears", "Axle Shafts", "Clutch Packs"],
        failureEffect: "Loss of power to one or both wheels.",
        cascadeFailures: ["Axle spline stripping"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: leftSide
    });

    // 5. Clutch Packs (Left and Right)
    const leftClutchGroup = new THREE.Group();
    leftClutchGroup.position.x = -2.2;
    for(let i=0; i<6; i++) {
        const plateGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.08, 32);
        const plate = new THREE.Mesh(plateGeo, i % 2 === 0 ? glowingOrange : darkSteel);
        plate.position.x = i * 0.15 - 0.375;
        plate.rotation.z = Math.PI / 2;
        leftClutchGroup.add(plate);
    }
    group.add(leftClutchGroup);

    const rightClutchGroup = new THREE.Group();
    rightClutchGroup.position.x = 2.2;
    for(let i=0; i<6; i++) {
        const plateGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.08, 32);
        const plate = new THREE.Mesh(plateGeo, i % 2 === 0 ? glowingOrange : darkSteel);
        plate.position.x = -(i * 0.15 - 0.375);
        plate.rotation.z = Math.PI / 2;
        rightClutchGroup.add(plate);
    }
    group.add(rightClutchGroup);

    parts.push({
        name: "Clutch Packs",
        description: "Alternating friction (Glowing Orange) and steel plates.",
        material: "Glowing Orange / Dark Steel",
        function: "Locks the side gears to the housing under high torque or slip, preventing total traction loss.",
        assemblyOrder: 5,
        connections: ["Side Gears", "Differential Housing"],
        failureEffect: "Differential acts like an open differential; vehicle spins one wheel in low traction.",
        cascadeFailures: ["Contaminated gear oil", "Premature gear wear"],
        originalPosition: { x: -2.2, y: 0, z: 0 },
        explodedPosition: { x: -7, y: 0, z: 0 },
        mesh: leftClutchGroup
    });

    // 6. Axle Shafts (Left and Right)
    const leftAxleGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const leftAxle = new THREE.Mesh(leftAxleGeo, glowingBlue);
    leftAxle.position.x = -5;
    leftAxle.rotation.z = Math.PI / 2;
    group.add(leftAxle);

    const rightAxleGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const rightAxle = new THREE.Mesh(rightAxleGeo, glowingBlue);
    rightAxle.position.x = 5;
    rightAxle.rotation.z = Math.PI / 2;
    group.add(rightAxle);

    parts.push({
        name: "Axle Shafts",
        description: "High-strength shafts connecting the differential to the wheels.",
        material: "Glowing Blue Energy Forged Steel",
        function: "Transmits final torque from the side gears to the wheels.",
        assemblyOrder: 6,
        connections: ["Side Gears", "Wheels"],
        failureEffect: "Complete loss of drive to the affected wheel.",
        cascadeFailures: ["Wheel bearing damage", "Collateral suspension damage"],
        originalPosition: { x: -5, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 },
        mesh: leftAxle
    });

    const description = "A Limited Slip Differential (LSD) intelligently distributes power to the driving wheels. Unlike an open differential which can send all power to a slipping wheel, the LSD uses integrated clutch packs that engage when speed differences become too high. This transfers torque to the wheel with more grip, crucial for high-performance and off-road driving.";

    const quizQuestions = [
        {
            question: "What is the primary function of the alternating friction and steel plates (Clutch Packs) in an LSD?",
            options: [
                "To cool down the gear oil under high load",
                "To completely disconnect the axles during cornering",
                "To limit the speed difference between the two axles by locking the side gears to the housing",
                "To multiply torque coming from the drive shaft"
            ],
            correct: 2,
            explanation: "Clutch packs provide friction that resists independent rotation of the side gears relative to the housing, limiting wheel slip.",
            difficulty: "Medium"
        },
        {
            question: "Which component receives power directly from the drive shaft's pinion gear?",
            options: [
                "Side Gear",
                "Spider Gear",
                "Ring Gear",
                "Axle Shaft"
            ],
            correct: 2,
            explanation: "The Ring Gear meshes with the pinion gear on the drive shaft to multiply torque and change rotation direction by 90 degrees.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the clutch packs in an LSD fail or wear out completely?",
            options: [
                "The vehicle cannot turn",
                "The differential behaves like an open differential, sending power to the path of least resistance",
                "The wheels lock together permanently (spool effect)",
                "The engine will stall immediately"
            ],
            correct: 1,
            explanation: "Without friction from the clutch packs, there is nothing limiting the slip, causing the LSD to act exactly like a standard open differential.",
            difficulty: "Hard"
        },
        {
            question: "The spider gears (pinion gears inside the carrier) serve what primary purpose?",
            options: [
                "They drive the oil pump",
                "They lock the axles together at all times",
                "They allow the left and right side gears to rotate at different speeds",
                "They connect the drive shaft to the ring gear"
            ],
            correct: 2,
            explanation: "Spider gears rotate on their cross-pin axis to allow the outer wheel to spin faster than the inner wheel during a turn.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Base rotation of the differential housing and ring gear
        const baseRotation = time * speed;
        
        // Simulating a scenario where one wheel slips slightly or a turn is being made
        // Left wheel spins faster than right wheel
        const leftSpeed = baseRotation * 1.5;
        const rightSpeed = baseRotation * 0.5;

        // Diff case rotation (average of left and right, driven by ring gear)
        const caseSpeed = baseRotation;

        diffCase.rotation.x = caseSpeed;
        ringGear.rotation.x = caseSpeed;

        // Axles and side gears
        leftSide.rotation.x = leftSpeed;
        leftAxle.rotation.x = leftSpeed;

        rightSide.rotation.x = rightSpeed;
        rightAxle.rotation.x = rightSpeed;

        // Spider gears revolve around the axle axis but also rotate on their own axis
        spiderGroup.rotation.x = caseSpeed; // Revolution with the case
        
        // Rotation on their own local axis due to differential action
        const spiderSpin = (leftSpeed - rightSpeed) / 2; 
        spiderGroup.children.forEach(child => {
            child.rotation.y = time * speed * 2; // Continuous spin to visualize mechanics clearly
        });

        // Clutch packs rotate with their respective side gears (or housing depending on engagement)
        // Here we link them to the side gear speeds for visual dynamics
        leftClutchGroup.rotation.x = leftSpeed;
        rightClutchGroup.rotation.x = rightSpeed;

        // Visual Flair: Pulse the emissive intensity of glowing clutch packs to simulate friction/engagement heating
        const pulse = 1 + Math.sin(time * speed * 8) * 0.5;
        leftClutchGroup.children.forEach(plate => {
            if (plate.material === glowingOrange) {
                plate.material.emissiveIntensity = pulse * 2.5;
            }
        });
        rightClutchGroup.children.forEach(plate => {
            if (plate.material === glowingOrange) {
                plate.material.emissiveIntensity = pulse * 2.5;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLimitedSlipDifferential() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
