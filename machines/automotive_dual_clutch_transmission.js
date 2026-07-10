import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for visual flair
    const glowOdd = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x008888,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.9
    });

    const glowEven = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.9
    });

    const neonAccent = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    // Helper to add parts
    function addPart(id, geometry, material, position, rotation, partData) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        if (rotation) {
            mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.id = id;
        group.add(mesh);
        meshes[id] = mesh;

        parts.push({
            ...partData,
            originalPosition: { x: position.x, y: position.y, z: position.z }
        });
    }

    // 1. Input Shaft
    addPart(
        'inputShaft',
        new THREE.CylinderGeometry(0.2, 0.2, 3, 32),
        chrome,
        { x: -3, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "Input Shaft",
            description: "Receives rotational power directly from the engine flywheel.",
            material: "Chrome",
            function: "Transmits torque to the clutch housing.",
            assemblyOrder: 1,
            connections: ["Clutch Housing", "Engine Flywheel"],
            failureEffect: "Complete loss of power transmission.",
            cascadeFailures: ["Clutch Assemblies"],
            explodedPosition: { x: -6, y: 0, z: 0 }
        }
    );

    // 2. Clutch Housing
    addPart(
        'clutchHousing',
        new THREE.CylinderGeometry(1.5, 1.5, 1, 32, 1, false, 0, Math.PI * 2),
        darkSteel,
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "Dual Clutch Housing",
            description: "Houses both the odd and even clutch packs.",
            material: "Dark Steel",
            function: "Rotates with engine speed and engages clutches via hydraulic pressure.",
            assemblyOrder: 2,
            connections: ["Input Shaft", "Odd Clutch", "Even Clutch"],
            failureEffect: "Inability to shift or engage any gears.",
            cascadeFailures: ["Hydraulic Pump", "Clutch Packs"],
            explodedPosition: { x: -1, y: 3, z: 0 }
        }
    );

    // 3. Odd Clutch Pack (Glowing Cyan)
    addPart(
        'oddClutch',
        new THREE.TorusGeometry(1.2, 0.2, 16, 100),
        glowOdd,
        { x: -0.8, y: 0, z: 0 },
        { x: 0, y: Math.PI / 2, z: 0 },
        {
            name: "Odd Clutch (Clutch 1)",
            description: "Controls the engagement of odd gears (1, 3, 5, 7).",
            material: "Cyan Plasma/Friction Material",
            function: "Couples input shaft to the inner solid shaft for odd gear sets.",
            assemblyOrder: 3,
            connections: ["Clutch Housing", "Inner Shaft"],
            failureEffect: "Loss of 1st, 3rd, 5th, and 7th gears.",
            cascadeFailures: ["Odd Synchronizers"],
            explodedPosition: { x: -0.8, y: 0, z: -3 }
        }
    );

    // 4. Even Clutch Pack (Glowing Magenta)
    addPart(
        'evenClutch',
        new THREE.TorusGeometry(0.8, 0.2, 16, 100),
        glowEven,
        { x: -0.4, y: 0, z: 0 },
        { x: 0, y: Math.PI / 2, z: 0 },
        {
            name: "Even Clutch (Clutch 2)",
            description: "Controls the engagement of even gears (2, 4, 6, Reverse).",
            material: "Magenta Plasma/Friction Material",
            function: "Couples input shaft to the outer hollow shaft for even gear sets.",
            assemblyOrder: 4,
            connections: ["Clutch Housing", "Outer Hollow Shaft"],
            failureEffect: "Loss of 2nd, 4th, 6th gears and Reverse.",
            cascadeFailures: ["Even Synchronizers"],
            explodedPosition: { x: -0.4, y: 0, z: 3 }
        }
    );

    // 5. Outer Hollow Shaft (Even)
    addPart(
        'outerShaft',
        new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
        steel,
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "Outer Hollow Shaft",
            description: "Concentric shaft connected to the Even Clutch.",
            material: "Steel",
            function: "Drives the even-numbered gear sets.",
            assemblyOrder: 5,
            connections: ["Even Clutch", "Even Gears"],
            failureEffect: "No power to even gears.",
            cascadeFailures: ["Outer Bearings"],
            explodedPosition: { x: 1, y: -3, z: 0 }
        }
    );

    // 6. Inner Solid Shaft (Odd)
    addPart(
        'innerShaft',
        new THREE.CylinderGeometry(0.2, 0.2, 4.5, 32),
        darkSteel,
        { x: 1.5, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "Inner Solid Shaft",
            description: "Runs through the center of the Outer Hollow Shaft.",
            material: "Dark Steel",
            function: "Drives the odd-numbered gear sets.",
            assemblyOrder: 6,
            connections: ["Odd Clutch", "Odd Gears"],
            failureEffect: "No power to odd gears.",
            cascadeFailures: ["Inner Bearings"],
            explodedPosition: { x: 4, y: 0, z: 0 }
        }
    );

    // 7. Gear 1 (Odd Set)
    addPart(
        'gear1',
        new THREE.CylinderGeometry(1.2, 1.2, 0.3, 20),
        aluminum,
        { x: 2.5, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "1st Gear",
            description: "Largest gear on the output shaft for high torque generation.",
            material: "Aluminum/Steel Alloy",
            function: "Provides initial acceleration.",
            assemblyOrder: 7,
            connections: ["Inner Shaft", "Output Shaft 1"],
            failureEffect: "Vehicle cannot launch smoothly.",
            cascadeFailures: ["Clutch Overheating"],
            explodedPosition: { x: 2.5, y: 2, z: 2 }
        }
    );

    // 8. Gear 2 (Even Set)
    addPart(
        'gear2',
        new THREE.CylinderGeometry(0.9, 0.9, 0.3, 20),
        copper,
        { x: 1.5, y: 0, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "2nd Gear",
            description: "Second gear mesh, connected to the hollow shaft.",
            material: "Copper/Steel Alloy",
            function: "Maintains acceleration after 1st gear.",
            assemblyOrder: 8,
            connections: ["Outer Shaft", "Output Shaft 1"],
            failureEffect: "Missing gear during acceleration, harsh shifts.",
            cascadeFailures: ["Transmission Control Module sync error"],
            explodedPosition: { x: 1.5, y: 2, z: -2 }
        }
    );

    // 9. Output Shaft
    addPart(
        'outputShaft',
        new THREE.CylinderGeometry(0.3, 0.3, 4, 32),
        chrome,
        { x: 2, y: -2, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "Output Shaft",
            description: "Collects power from selected gears.",
            material: "Chrome",
            function: "Transmits torque to the differential.",
            assemblyOrder: 9,
            connections: ["Gears 1/2/3...", "Differential"],
            failureEffect: "Complete loss of drive.",
            cascadeFailures: ["Final Drive gear damage"],
            explodedPosition: { x: 2, y: -5, z: 0 }
        }
    );

    // 10. Gear Meshes (on Output Shaft)
    addPart(
        'outGear1',
        new THREE.CylinderGeometry(1.0, 1.0, 0.3, 20),
        glowOdd,
        { x: 2.5, y: -2, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "1st Gear Driven",
            description: "Driven gear for 1st ratio.",
            material: "Cyan Plasma",
            function: "Meshes with 1st gear on input shaft.",
            assemblyOrder: 10,
            connections: ["1st Gear", "Output Shaft"],
            failureEffect: "Slipping in 1st.",
            cascadeFailures: ["None"],
            explodedPosition: { x: 2.5, y: -4, z: 2 }
        }
    );

    addPart(
        'outGear2',
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 20),
        glowEven,
        { x: 1.5, y: -2, z: 0 },
        { x: 0, y: 0, z: Math.PI / 2 },
        {
            name: "2nd Gear Driven",
            description: "Driven gear for 2nd ratio.",
            material: "Magenta Plasma",
            function: "Meshes with 2nd gear on input shaft.",
            assemblyOrder: 11,
            connections: ["2nd Gear", "Output Shaft"],
            failureEffect: "Slipping in 2nd.",
            cascadeFailures: ["None"],
            explodedPosition: { x: 1.5, y: -4, z: -2 }
        }
    );

    // 11. Casing (Transparent)
    addPart(
        'casing',
        new THREE.BoxGeometry(7, 6, 4),
        glass,
        { x: 1, y: -1, z: 0 },
        { x: 0, y: 0, z: 0 },
        {
            name: "Transmission Casing",
            description: "High-strength transparent housing containing the transmission fluid and components.",
            material: "Advanced Polymer Glass",
            function: "Protects internals and provides structural rigidity.",
            assemblyOrder: 12,
            connections: ["Engine Block", "Chassis Mounts"],
            failureEffect: "Fluid leak and rapid catastrophic failure.",
            cascadeFailures: ["Total Internal Destruction"],
            explodedPosition: { x: 1, y: -1, z: 8 }
        }
    );

    const description = "The Dual-Clutch Transmission (DCT) is a marvel of modern automotive engineering. By utilizing two separate clutches (one for odd gears, one for even gears) and concentric input shafts, it pre-selects the next gear before the shift even occurs. When it's time to shift, one clutch disengages while the other simultaneously engages, resulting in lightning-fast shifts without interrupting the flow of power to the wheels.";

    const quizQuestions = [
        {
            question: "How does a Dual-Clutch Transmission achieve near-instantaneous gear shifts?",
            options: [
                "By using a high-pressure torque converter",
                "By pre-selecting the next gear on an alternate shaft and swapping clutch engagements",
                "By using continuously variable belts",
                "By employing purely electronic dog clutches"
            ],
            correct: 1,
            explanation: "A DCT pre-selects the next gear on the unengaged shaft. The shift itself is just a simultaneous disengagement of one clutch and engagement of the other.",
            difficulty: "medium"
        },
        {
            question: "Why does a DCT feature concentric input shafts (an inner solid shaft and an outer hollow shaft)?",
            options: [
                "To save weight in the transmission casing",
                "To allow both clutch packs to connect to their respective gear sets within a compact footprint",
                "To increase the structural rigidity of the input shaft",
                "To circulate transmission fluid more efficiently"
            ],
            correct: 1,
            explanation: "Concentric shafts allow two separate power paths (one for odd gears, one for even) from two clutches at the front of the transmission, saving space.",
            difficulty: "hard"
        },
        {
            question: "What would be the most immediate symptom if the 'Odd' clutch pack failed?",
            options: [
                "The car would not start",
                "The car would only be able to drive in reverse",
                "The car would skip gears 1, 3, 5, and 7",
                "The transmission fluid would immediately overheat"
            ],
            correct: 2,
            explanation: "Since the odd clutch controls power to the inner shaft (which drives the odd gears), its failure results in the loss of 1st, 3rd, 5th, etc.",
            difficulty: "easy"
        },
        {
            question: "Which material is heavily used in the transmission casing in this visualizer to allow internal viewing?",
            options: [
                "Dark Steel",
                "Advanced Polymer Glass",
                "Carbon Fiber",
                "Aluminum"
            ],
            correct: 1,
            explanation: "The casing is designed with Advanced Polymer Glass (glass material) to permit a clear view of the complex internal mechanics.",
            difficulty: "easy"
        }
    ];

    let gearState = 1; // 1 = odd engaged, 2 = even engaged
    let lastShift = 0;

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        
        // We use activeMeshes to safely animate only the parts currently visible in the scene
        const getMesh = (id) => activeMeshes.find(m => m.userData.id === id) || meshes[id];

        // Determine if shifting based on time (simulated shifts every 3 seconds)
        if (time - lastShift > 3) {
            gearState = gearState === 1 ? 2 : 1;
            lastShift = time;
        }

        const baseSpeed = speed * 2;

        const input = getMesh('inputShaft');
        const housing = getMesh('clutchHousing');
        const oddC = getMesh('oddClutch');
        const evenC = getMesh('evenClutch');
        const innerS = getMesh('innerShaft');
        const outerS = getMesh('outerShaft');
        const g1 = getMesh('gear1');
        const g2 = getMesh('gear2');
        const og1 = getMesh('outGear1');
        const og2 = getMesh('outGear2');
        const outS = getMesh('outputShaft');

        // Input shaft always rotates with engine speed
        if (input) input.rotation.x += baseSpeed;
        if (housing) housing.rotation.x += baseSpeed;

        // Clutch engagement visual flair and rotation
        if (gearState === 1) {
            if (oddC) {
                oddC.material.emissiveIntensity = 1.0 + Math.sin(time * 10) * 0.5;
                oddC.rotation.y += baseSpeed;
            }
            if (innerS) innerS.rotation.x += baseSpeed;
            if (g1) g1.rotation.x += baseSpeed;
            if (og1) og1.rotation.x -= baseSpeed * 1.2; 
            
            if (evenC) {
                evenC.material.emissiveIntensity = 0.2;
                evenC.rotation.y += baseSpeed * 0.5; 
            }
            if (outerS) outerS.rotation.x += baseSpeed * 0.5;
            if (g2) g2.rotation.x += baseSpeed * 0.5;
            if (og2) og2.rotation.x -= baseSpeed * 0.5;
        } else {
            if (evenC) {
                evenC.material.emissiveIntensity = 1.0 + Math.sin(time * 10) * 0.5;
                evenC.rotation.y += baseSpeed;
            }
            if (outerS) outerS.rotation.x += baseSpeed;
            if (g2) g2.rotation.x += baseSpeed;
            if (og2) og2.rotation.x -= baseSpeed * 1.5; 
            
            if (oddC) {
                oddC.material.emissiveIntensity = 0.2;
                oddC.rotation.y += baseSpeed * 0.5; 
            }
            if (innerS) innerS.rotation.x += baseSpeed * 0.5;
            if (g1) g1.rotation.x += baseSpeed * 0.5;
            if (og1) og1.rotation.x -= baseSpeed * 0.5;
        }

        // Output shaft speed depends on engaged gear
        const outputSpeed = gearState === 1 ? baseSpeed * 1.2 : baseSpeed * 1.5;
        if (outS) {
            outS.rotation.x -= outputSpeed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDualClutchTransmission() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
