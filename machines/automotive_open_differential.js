import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 0.7,
        metalness: 0.8,
        roughness: 0.2,
    });
    
    const glowPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
    });

    // 1. Drive Shaft / Pinion Gear
    const pinionGeom = new THREE.CylinderGeometry(0.5, 1, 3, 16);
    const pinion = new THREE.Mesh(pinionGeom, glowBlue);
    pinion.rotation.x = Math.PI / 2;
    pinion.position.set(0, 0, 4);
    group.add(pinion);
    parts.push({
        name: "Drive Pinion",
        description: "Transmits power from the driveshaft to the ring gear.",
        material: "glowBlue",
        function: "Transmits engine torque to the differential.",
        assemblyOrder: 1,
        connections: ["Driveshaft", "Ring Gear"],
        failureEffect: "Loss of power transmission to wheels, loud clunking noise.",
        cascadeFailures: ["Ring gear teeth shearing"],
        originalPosition: { x: 0, y: 0, z: 4 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: pinion
    });

    // 2. Ring Gear
    const ringGeom = new THREE.TorusGeometry(3, 0.5, 16, 64);
    const ring = new THREE.Mesh(ringGeom, chrome);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-0.5, 0, 0);
    group.add(ring);
    parts.push({
        name: "Ring Gear",
        description: "Large gear driven by the pinion, attached to the differential carrier.",
        material: "chrome",
        function: "Reduces gear ratio and turns power 90 degrees.",
        assemblyOrder: 2,
        connections: ["Drive Pinion", "Carrier"],
        failureEffect: "Whining noise, complete loss of drive.",
        cascadeFailures: ["Carrier bearing damage"],
        originalPosition: { x: -0.5, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        mesh: ring
    });

    // 3. Differential Carrier (Cage)
    const carrierGeom = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const carrierMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true });
    const carrier = new THREE.Mesh(carrierGeom, carrierMaterial);
    carrier.rotation.z = Math.PI / 2;
    group.add(carrier);
    parts.push({
        name: "Differential Carrier",
        description: "Housing that spins with the ring gear and holds the spider gears.",
        material: "steel wireframe",
        function: "Houses the planetary gearset (spider gears).",
        assemblyOrder: 3,
        connections: ["Ring Gear", "Spider Gears", "Side Gears"],
        failureEffect: "Vibration, catastrophic failure of differential assembly.",
        cascadeFailures: ["Spider gear destruction", "Axle shaft damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: carrier
    });

    // 4. Spider Gears (Pinion gears inside carrier)
    const spiderGroup = new THREE.Group();
    
    const spider1Geom = new THREE.ConeGeometry(0.6, 1, 16);
    const spider1 = new THREE.Mesh(spider1Geom, glowRed);
    spider1.position.set(0, 1.2, 0);
    spiderGroup.add(spider1);
    
    const spider2 = new THREE.Mesh(spider1Geom, glowRed);
    spider2.rotation.x = Math.PI;
    spider2.position.set(0, -1.2, 0);
    spiderGroup.add(spider2);
    
    group.add(spiderGroup);
    
    parts.push({
        name: "Spider Gears",
        description: "Small planetary gears that allow axle shafts to spin at different speeds.",
        material: "glowRed",
        function: "Allows speed differentiation between wheels during turns.",
        assemblyOrder: 4,
        connections: ["Carrier Cross Pin", "Side Gears"],
        failureEffect: "Clicking or clunking on turns, locking of differential.",
        cascadeFailures: ["Side gear damage", "Carrier cracking"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: spiderGroup
    });

    // 5. Side Gears (connected to axles)
    const side1Geom = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const side1 = new THREE.Mesh(side1Geom, glowGreen);
    side1.rotation.z = Math.PI / 2;
    side1.position.set(1.5, 0, 0);
    group.add(side1);
    
    const side2 = new THREE.Mesh(side1Geom, glowPurple);
    side2.rotation.z = Math.PI / 2;
    side2.position.set(-1.5, 0, 0);
    group.add(side2);

    parts.push({
        name: "Right Side Gear",
        description: "Splined to the right axle shaft, driven by spider gears.",
        material: "glowGreen",
        function: "Transmits torque to the right wheel.",
        assemblyOrder: 5,
        connections: ["Spider Gears", "Right Axle"],
        failureEffect: "Loss of drive to right wheel.",
        cascadeFailures: ["Axle spline stripping"],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 },
        mesh: side1
    });

    parts.push({
        name: "Left Side Gear",
        description: "Splined to the left axle shaft, driven by spider gears.",
        material: "glowPurple",
        function: "Transmits torque to the left wheel.",
        assemblyOrder: 6,
        connections: ["Spider Gears", "Left Axle"],
        failureEffect: "Loss of drive to left wheel.",
        cascadeFailures: ["Axle spline stripping"],
        originalPosition: { x: -1.5, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 },
        mesh: side2
    });

    // 6. Axle Shafts
    const axleGeom = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    const axleRight = new THREE.Mesh(axleGeom, darkSteel);
    axleRight.rotation.z = Math.PI / 2;
    axleRight.position.set(4.5, 0, 0);
    group.add(axleRight);

    const axleLeft = new THREE.Mesh(axleGeom, darkSteel);
    axleLeft.rotation.z = Math.PI / 2;
    axleLeft.position.set(-4.5, 0, 0);
    group.add(axleLeft);

    parts.push({
        name: "Axle Shafts",
        description: "Connects the differential side gears to the wheels.",
        material: "darkSteel",
        function: "Delivers rotational force to the wheels.",
        assemblyOrder: 7,
        connections: ["Side Gears", "Wheel Hubs"],
        failureEffect: "Wheel detaches or no power to wheel.",
        cascadeFailures: ["Wheel bearing failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: group // abstracting for axles
    });

    const description = "An Open Differential is a mechanical device that splits engine torque into two outputs, allowing them to spin at different speeds. It is crucial for cornering, where the outer wheel must travel farther and faster than the inner wheel.";

    const quizQuestions = [
        {
            question: "What is the primary function of the spider gears in an open differential?",
            options: [
                "To increase engine horsepower.",
                "To lock the axles together.",
                "To allow the left and right wheels to spin at different speeds.",
                "To cool the differential fluid."
            ],
            correct: 2,
            explanation: "Spider gears rotate on the cross pin, permitting the side gears (and their connected axles) to rotate at different speeds relative to the carrier.",
            difficulty: "Medium"
        },
        {
            question: "Which component directly receives rotational power from the vehicle's driveshaft?",
            options: [
                "Ring Gear",
                "Drive Pinion",
                "Side Gear",
                "Axle Shaft"
            ],
            correct: 1,
            explanation: "The drive pinion is connected to the driveshaft and meshes with the ring gear to turn the rotational power 90 degrees.",
            difficulty: "Easy"
        },
        {
            question: "What happens to an open differential if one wheel completely loses traction (e.g., on ice)?",
            options: [
                "Power goes equally to both wheels.",
                "The wheel with traction receives all the torque.",
                "The wheel without traction spins freely, and the vehicle goes nowhere.",
                "The differential mechanically locks."
            ],
            correct: 2,
            explanation: "In an open differential, torque is always split 50/50. The amount of torque it can send is limited by the wheel with the least traction. Thus, the wheel on ice spins easily, and very little torque is sent to the wheel on solid ground.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // time is continuous time
        // speed is simulation speed (0 to 1+)
        
        const rotationSpeed = speed * 0.05;

        // Drive Pinion spins fastest
        pinion.rotation.y = time * rotationSpeed * 3.73; // e.g. 3.73:1 gear ratio

        // Ring gear & Carrier spin together
        ring.rotation.x = time * rotationSpeed;
        carrier.rotation.x = time * rotationSpeed;
        spiderGroup.rotation.z = time * rotationSpeed;

        // Simulating turning: Left wheel spins slower, right wheel spins faster
        const leftSpeedDiff = -0.5; // Turning left (inner wheel slower)
        const rightSpeedDiff = 0.5; // Turning left (outer wheel faster)

        side1.rotation.x = time * rotationSpeed * (1 + rightSpeedDiff); // Right side
        side2.rotation.x = time * rotationSpeed * (1 + leftSpeedDiff); // Left side

        axleRight.rotation.x = side1.rotation.x;
        axleLeft.rotation.x = side2.rotation.x;

        // Spider gears must rotate on their own axes to compensate for the speed difference
        spider1.rotation.y = time * rotationSpeed * rightSpeedDiff * 2;
        spider2.rotation.y = -time * rotationSpeed * rightSpeedDiff * 2;
        
        // Emissive pulsing for visual flair
        glowBlue.emissiveIntensity = 0.5 + Math.sin(time * 0.1) * 0.3;
        glowRed.emissiveIntensity = 0.5 + Math.sin(time * 0.2) * 0.3;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOpenDifferential() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
