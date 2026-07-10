import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 1.0,
        metalness: 0.6,
        roughness: 0.1
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x008822,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.3
    });

    // Helper functions
    function createGear(radius, width, teethCount, material) {
        const shape = new THREE.Shape();
        const outerRadius = radius;
        const innerRadius = radius * 0.8;
        const numTeeth = teethCount;
        
        for (let i = 0; i < numTeeth * 2; i++) {
            const angle = (i * Math.PI) / numTeeth;
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            if (i === 0) shape.moveTo(r * Math.cos(angle), r * Math.sin(angle));
            else shape.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        shape.lineTo(outerRadius, 0);

        const extrudeSettings = { depth: width, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    function createShaft(radius, length, material) {
        const geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    // Input Shaft
    const inputShaftMesh = createShaft(0.5, 4, darkSteel);
    inputShaftMesh.position.set(0, 0, -5);
    group.add(inputShaftMesh);
    parts.push({
        name: "Input Shaft",
        description: "Transmits power from the engine clutch into the transmission.",
        material: "darkSteel",
        function: "Power input",
        assemblyOrder: 1,
        connections: ["Input Gear", "Clutch"],
        failureEffect: "Complete loss of power transmission.",
        cascadeFailures: ["Transmission Housing"],
        originalPosition: { x: 0, y: 0, z: -5 },
        explodedPosition: { x: 0, y: 0, z: -10 },
        mesh: inputShaftMesh
    });

    // Input Gear
    const inputGearMesh = createGear(2.5, 1, 20, chrome);
    inputGearMesh.position.set(0, 0, -3.5);
    group.add(inputGearMesh);
    parts.push({
        name: "Input Gear",
        description: "Drives the countershaft assembly based on engine RPM.",
        material: "chrome",
        function: "Power transfer to countershaft",
        assemblyOrder: 2,
        connections: ["Input Shaft", "Countershaft Driven Gear"],
        failureEffect: "Loss of all forward gears.",
        cascadeFailures: ["Countershaft"],
        originalPosition: { x: 0, y: 0, z: -3.5 },
        explodedPosition: { x: 0, y: 5, z: -7 },
        mesh: inputGearMesh
    });

    // Countershaft (Layshaft)
    const countershaftMesh = createShaft(0.6, 12, steel);
    countershaftMesh.position.set(4, -3, 0);
    group.add(countershaftMesh);
    parts.push({
        name: "Countershaft",
        description: "Also known as the layshaft, it holds a cluster of gears and transfers power to the main shaft.",
        material: "steel",
        function: "Intermediate power transmission",
        assemblyOrder: 3,
        connections: ["Input Gear", "Countershaft Gears"],
        failureEffect: "No power transfer to any main shaft gear.",
        cascadeFailures: ["Main Shaft Gears"],
        originalPosition: { x: 4, y: -3, z: 0 },
        explodedPosition: { x: 8, y: -6, z: 0 },
        mesh: countershaftMesh
    });

    // Countershaft Driven Gear
    const counterDrivenGearMesh = createGear(3.0, 1.2, 24, glowBlue);
    counterDrivenGearMesh.position.set(4, -3, -3.5);
    group.add(counterDrivenGearMesh);
    parts.push({
        name: "Countershaft Driven Gear",
        description: "Mashes with the input gear to rotate the entire countershaft.",
        material: "glowBlue",
        function: "Receives power from input gear",
        assemblyOrder: 4,
        connections: ["Countershaft", "Input Gear"],
        failureEffect: "Countershaft stops rotating.",
        cascadeFailures: ["Countershaft Bearings"],
        originalPosition: { x: 4, y: -3, z: -3.5 },
        explodedPosition: { x: 10, y: -6, z: -5 },
        mesh: counterDrivenGearMesh
    });

    // Countershaft 1st Gear
    const counter1stGearMesh = createGear(1.5, 1, 12, glowOrange);
    counter1stGearMesh.position.set(4, -3, 2);
    group.add(counter1stGearMesh);
    parts.push({
        name: "Countershaft 1st Gear",
        description: "Smallest countershaft gear providing the highest torque ratio.",
        material: "glowOrange",
        function: "Drives main shaft 1st gear",
        assemblyOrder: 5,
        connections: ["Countershaft", "Main Shaft 1st Gear"],
        failureEffect: "Loss of 1st gear.",
        cascadeFailures: ["Main 1st Gear"],
        originalPosition: { x: 4, y: -3, z: 2 },
        explodedPosition: { x: 8, y: -6, z: 4 },
        mesh: counter1stGearMesh
    });

    // Main Shaft
    const mainShaftMesh = createShaft(0.5, 12, darkSteel);
    mainShaftMesh.position.set(0, 0, 1);
    group.add(mainShaftMesh);
    parts.push({
        name: "Main Shaft",
        description: "The output shaft of the transmission, delivering torque to the driveshaft.",
        material: "darkSteel",
        function: "Power output",
        assemblyOrder: 6,
        connections: ["Main Shaft Gears", "Synchronizers"],
        failureEffect: "No drive to wheels.",
        cascadeFailures: ["Output Yoke"],
        originalPosition: { x: 0, y: 0, z: 1 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: mainShaftMesh
    });

    // Main Shaft 1st Gear
    const main1stGearMesh = createGear(3.5, 1.2, 28, chrome);
    main1stGearMesh.position.set(0, 0, 2);
    group.add(main1stGearMesh);
    parts.push({
        name: "Main Shaft 1st Gear",
        description: "Large gear for starting from a standstill, freewheels on the main shaft until engaged.",
        material: "chrome",
        function: "Provides 1st gear ratio",
        assemblyOrder: 7,
        connections: ["Main Shaft", "Countershaft 1st Gear", "1st/2nd Synchronizer"],
        failureEffect: "Inability to select 1st gear.",
        cascadeFailures: ["Synchronizer Ring"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: -5, y: 5, z: 4 },
        mesh: main1stGearMesh
    });

    // 1st/2nd Synchronizer Hub & Sleeve
    const synchroMesh = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.4, 16, 32), glowGreen);
    synchroMesh.position.set(0, 0, 0.5);
    group.add(synchroMesh);
    parts.push({
        name: "1st/2nd Synchronizer",
        description: "Matches shaft and gear speeds before locking them together via dog teeth.",
        material: "glowGreen",
        function: "Gear engagement",
        assemblyOrder: 8,
        connections: ["Main Shaft", "Shift Fork"],
        failureEffect: "Grinding gears, difficult shifting.",
        cascadeFailures: ["Dog Teeth", "Shift Fork"],
        originalPosition: { x: 0, y: 0, z: 0.5 },
        explodedPosition: { x: 0, y: 8, z: 0.5 },
        mesh: synchroMesh
    });

    // Shift Fork
    const shiftForkShape = new THREE.Shape();
    shiftForkShape.absarc(0, 0, 1.8, 0, Math.PI, true);
    shiftForkShape.lineTo(-2, -3);
    shiftForkShape.lineTo(2, -3);
    const shiftForkGeo = new THREE.ExtrudeGeometry(shiftForkShape, { depth: 0.4, bevelEnabled: false });
    const shiftForkMesh = new THREE.Mesh(shiftForkGeo, aluminum);
    shiftForkMesh.position.set(0, 1.5, 0.3);
    group.add(shiftForkMesh);
    parts.push({
        name: "Shift Fork",
        description: "Moves the synchronizer sleeve forward or backward to engage gears.",
        material: "aluminum",
        function: "Gear selection mechanism",
        assemblyOrder: 9,
        connections: ["Synchronizer", "Shift Linkage"],
        failureEffect: "Cannot shift gears or stuck in gear.",
        cascadeFailures: ["Shift Linkage"],
        originalPosition: { x: 0, y: 1.5, z: 0.3 },
        explodedPosition: { x: -4, y: 10, z: 0.3 },
        mesh: shiftForkMesh
    });

    const description = "An ultra high-tech automotive manual transmission. Features glowing components to highlight power flow and gear selection. The transmission multiplies engine torque through a series of selectable gear ratios.";

    const quizQuestions = [
        {
            question: "Which component aligns the speed of the gear to the main shaft before engagement?",
            options: ["Shift Fork", "Synchronizer", "Countershaft", "Input Shaft"],
            correct: 1,
            explanation: "The synchronizer uses friction to match the speeds of the free-spinning gear and the main shaft, preventing gear grind.",
            difficulty: "Medium"
        },
        {
            question: "The layshaft is another name for the:",
            options: ["Input Shaft", "Output Shaft", "Countershaft", "Driveshaft"],
            correct: 2,
            explanation: "The countershaft, often called a layshaft, lies parallel to the main shaft and carries the drive from the input gear to the selectable gears.",
            difficulty: "Easy"
        },
        {
            question: "Why does 1st gear on the main shaft have a larger diameter than the input gear?",
            options: ["To increase top speed", "To multiply torque", "To reduce weight", "To increase shaft speed"],
            correct: 1,
            explanation: "A smaller driving gear turning a larger driven gear multiplies torque, which is essential for starting a vehicle from a stop.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by name mapping
        const inputShaft = meshes["Input Shaft"];
        const inputGear = meshes["Input Gear"];
        const counterShaft = meshes["Countershaft"];
        const counterDriven = meshes["Countershaft Driven Gear"];
        const counter1st = meshes["Countershaft 1st Gear"];
        const main1st = meshes["Main Shaft 1st Gear"];
        const mainShaft = meshes["Main Shaft"];
        const synchro = meshes["1st/2nd Synchronizer"];

        const engineRpm = speed * 0.05;

        // Input shaft and gear rotate together
        if (inputShaft) inputShaft.rotation.y += engineRpm;
        if (inputGear) inputGear.rotation.z += engineRpm;

        // Countershaft assembly rotates in opposite direction
        // Input Gear (20 teeth) driving CounterDriven (24 teeth) -> Ratio 20/24 = 5/6
        const counterRpm = -engineRpm * (20 / 24);
        if (counterShaft) counterShaft.rotation.y += counterRpm;
        if (counterDriven) counterDriven.rotation.z += counterRpm;
        if (counter1st) counter1st.rotation.z += counterRpm;

        // Main Shaft 1st Gear free spins on main shaft, driven by counter1st
        // Counter1st (12 teeth) driving Main1st (28 teeth) -> Ratio 12/28 = 3/7
        const main1stRpm = -counterRpm * (12 / 28);
        if (main1st) main1st.rotation.z += main1stRpm;

        // Simulate neutral vs 1st gear engagement
        // Pulse the synchronizer emission to show it's active
        if (synchro) {
            synchro.material.emissiveIntensity = 0.5 + Math.sin(time * 0.005) * 0.5;
            synchro.rotation.z += main1stRpm; // Assuming it's engaged
        }

        // Main shaft rotates with 1st gear (assuming engaged)
        if (mainShaft) mainShaft.rotation.y += main1stRpm;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createManualTransmission() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
