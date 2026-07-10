import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff44,
        emissive: 0x00ff44,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.2
    });

    // 1. Input Shaft (Engine side)
    const inputShaftGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    inputShaftGeom.rotateZ(Math.PI / 2);
    const inputShaft = new THREE.Mesh(inputShaftGeom, chrome);
    inputShaft.position.set(-8, 0, 0);
    group.add(inputShaft);
    meshes.inputShaft = inputShaft;

    parts.push({
        name: "Engine Input Shaft",
        description: "Transfers rotational power from the engine flywheel into the dual-clutch transmission.",
        material: "Chrome Steel",
        function: "Main power input",
        assemblyOrder: 1,
        connections: ["Flywheel", "Clutch Housing"],
        failureEffect: "Total loss of propulsion",
        cascadeFailures: ["Damaged clutch packs", "Transmission housing rupture"],
        originalPosition: { x: -8, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    // 2. Outer Clutch Pack (Odd Gears)
    const outerClutchGeom = new THREE.CylinderGeometry(2.5, 2.5, 1.5, 32);
    outerClutchGeom.rotateZ(Math.PI / 2);
    const outerClutch = new THREE.Mesh(outerClutchGeom, steel);
    outerClutch.position.set(-4, 0, 0);
    group.add(outerClutch);
    meshes.outerClutch = outerClutch;

    // Glowing Engagement Ring - Odd
    const oddEngageGeom = new THREE.TorusGeometry(2.6, 0.1, 16, 64);
    oddEngageGeom.rotateY(Math.PI / 2);
    const oddEngage = new THREE.Mesh(oddEngageGeom, glowOrange);
    oddEngage.position.set(-4, 0, 0);
    group.add(oddEngage);
    meshes.oddEngage = oddEngage;

    parts.push({
        name: "Odd Gear Clutch Pack (K1)",
        description: "Large outer multi-plate clutch responsible for engaging gears 1, 3, 5, and 7.",
        material: "Friction plates and Steel",
        function: "Transmits power to the solid inner shaft",
        assemblyOrder: 2,
        connections: ["Input Shaft", "Inner Solid Shaft"],
        failureEffect: "Loss of odd gears (1,3,5,7)",
        cascadeFailures: ["Overheating transmission fluid", "Limpo mode activation"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 4, z: -4 }
    });

    // 3. Inner Clutch Pack (Even Gears)
    const innerClutchGeom = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 32);
    innerClutchGeom.rotateZ(Math.PI / 2);
    const innerClutch = new THREE.Mesh(innerClutchGeom, darkSteel);
    innerClutch.position.set(-2, 0, 0);
    group.add(innerClutch);
    meshes.innerClutch = innerClutch;

    // Glowing Engagement Ring - Even
    const evenEngageGeom = new THREE.TorusGeometry(1.9, 0.1, 16, 64);
    evenEngageGeom.rotateY(Math.PI / 2);
    const evenEngage = new THREE.Mesh(evenEngageGeom, glowBlue);
    evenEngage.position.set(-2, 0, 0);
    group.add(evenEngage);
    meshes.evenEngage = evenEngage;

    parts.push({
        name: "Even Gear Clutch Pack (K2)",
        description: "Smaller inner multi-plate clutch responsible for engaging gears 2, 4, 6, and Reverse.",
        material: "Friction plates and Dark Steel",
        function: "Transmits power to the hollow outer shaft",
        assemblyOrder: 3,
        connections: ["Input Shaft", "Outer Hollow Shaft"],
        failureEffect: "Loss of even gears and reverse",
        cascadeFailures: ["Stuck in gear", "Mechatronic failure"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -2, y: -4, z: 4 }
    });

    // 4. Hollow Outer Shaft (Even Gears)
    const hollowShaftGeom = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
    hollowShaftGeom.rotateZ(Math.PI / 2);
    const hollowShaft = new THREE.Mesh(hollowShaftGeom, copper);
    hollowShaft.position.set(2, 0, 0);
    group.add(hollowShaft);
    meshes.hollowShaft = hollowShaft;

    parts.push({
        name: "Hollow Outer Shaft",
        description: "Concentric hollow shaft that transfers power from the K2 clutch to the even gear sets.",
        material: "Copper/Steel Alloy",
        function: "Drives even gears",
        assemblyOrder: 4,
        connections: ["K2 Clutch", "Even Gear Pinions"],
        failureEffect: "Complete loss of drive in even gears",
        cascadeFailures: ["Bearing destruction", "Internal binding"],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 0, z: 5 }
    });

    // 5. Solid Inner Shaft (Odd Gears)
    const solidShaftGeom = new THREE.CylinderGeometry(0.6, 0.6, 12, 32);
    solidShaftGeom.rotateZ(Math.PI / 2);
    const solidShaft = new THREE.Mesh(solidShaftGeom, aluminum);
    solidShaft.position.set(4, 0, 0);
    group.add(solidShaft);
    meshes.solidShaft = solidShaft;

    parts.push({
        name: "Solid Inner Shaft",
        description: "Runs inside the hollow shaft to transfer power from the K1 clutch to the odd gear sets.",
        material: "High-strength Aluminum",
        function: "Drives odd gears",
        assemblyOrder: 5,
        connections: ["K1 Clutch", "Odd Gear Pinions"],
        failureEffect: "Complete loss of drive in odd gears",
        cascadeFailures: ["Sheared splines", "Catastrophic transmission failure"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: -5 }
    });

    // 6. Output Shaft
    const outputShaftGeom = new THREE.CylinderGeometry(0.8, 0.8, 10, 32);
    outputShaftGeom.rotateZ(Math.PI / 2);
    const outputShaft = new THREE.Mesh(outputShaftGeom, chrome);
    outputShaft.position.set(3, -3, 0);
    group.add(outputShaft);
    meshes.outputShaft = outputShaft;

    parts.push({
        name: "Output Shaft",
        description: "Collects power from the selected gear and sends it to the differential.",
        material: "Chrome Steel",
        function: "Final drive output",
        assemblyOrder: 6,
        connections: ["Gear Sets", "Differential"],
        failureEffect: "No power to wheels",
        cascadeFailures: ["Differential damage"],
        originalPosition: { x: 3, y: -3, z: 0 },
        explodedPosition: { x: 3, y: -8, z: 0 }
    });

    // Gears
    const gearGlow = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.8,
        roughness: 0.2
    });

    // Gear 1 (Odd, solid shaft)
    const gear1Geom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 24);
    gear1Geom.rotateZ(Math.PI / 2);
    const gear1 = new THREE.Mesh(gear1Geom, gearGlow);
    gear1.position.set(7, 0, 0);
    group.add(gear1);
    meshes.gear1 = gear1;

    // Output Gear 1
    const outGear1Geom = new THREE.CylinderGeometry(2, 2, 0.5, 24);
    outGear1Geom.rotateZ(Math.PI / 2);
    const outGear1 = new THREE.Mesh(outGear1Geom, steel);
    outGear1.position.set(7, -3, 0);
    group.add(outGear1);
    meshes.outGear1 = outGear1;

    // Gear 2 (Even, hollow shaft)
    const gear2Geom = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 24);
    gear2Geom.rotateZ(Math.PI / 2);
    const gear2 = new THREE.Mesh(gear2Geom, gearGlow);
    gear2.position.set(4, 0, 0);
    group.add(gear2);
    meshes.gear2 = gear2;

    // Output Gear 2
    const outGear2Geom = new THREE.CylinderGeometry(1.7, 1.7, 0.5, 24);
    outGear2Geom.rotateZ(Math.PI / 2);
    const outGear2 = new THREE.Mesh(outGear2Geom, darkSteel);
    outGear2.position.set(4, -3, 0);
    group.add(outGear2);
    meshes.outGear2 = outGear2;

    parts.push({
        name: "Gear Sets",
        description: "Pairs of gears transferring rotation from the input shafts to the output shaft.",
        material: "Hardened Steel",
        function: "Multiply torque and speed",
        assemblyOrder: 7,
        connections: ["Input Shafts", "Output Shaft"],
        failureEffect: "Slipping or grinding in specific gears",
        cascadeFailures: ["Metal shavings in fluid", "Total internal destruction"],
        originalPosition: { x: 5, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 5 }
    });

    const description = "A high-tech Dual-Clutch Transmission (DCT) featuring two separate clutches for odd and even gear sets. This design allows for lightning-fast gear changes by pre-selecting the next gear on the inactive shaft. The model highlights the concentric shaft design (solid inner, hollow outer) and visualizes the alternating engagement of the K1 (Orange) and K2 (Blue) clutches.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of a Dual-Clutch Transmission over a traditional manual?",
            options: [
                "It uses less transmission fluid",
                "It can pre-select the next gear for near-instant shifts",
                "It has only one shaft",
                "It operates without a computer"
            ],
            correct: 1,
            explanation: "DCTs have two separate shafts and clutches, allowing the computer to pre-engage the next gear on the unused shaft. When shifting, one clutch opens while the other closes simultaneously.",
            difficulty: "Medium"
        },
        {
            question: "In a typical DCT, which gears are controlled by the outer clutch (K1)?",
            options: [
                "Even gears (2, 4, 6)",
                "Reverse gear only",
                "Odd gears (1, 3, 5, 7)",
                "All gears"
            ],
            correct: 2,
            explanation: "The K1 clutch typically drives the solid inner shaft, which holds the odd-numbered gears.",
            difficulty: "Hard"
        },
        {
            question: "Why does the DCT use a concentric shaft design (a hollow shaft over a solid shaft)?",
            options: [
                "To save weight",
                "To fit two input shafts in the space of one",
                "To reduce aerodynamic drag",
                "To improve exhaust flow"
            ],
            correct: 1,
            explanation: "The concentric design allows both the odd and even gear sets to be driven from the same side of the transmission without making the unit overly long.",
            difficulty: "Hard"
        }
    ];

    let gearState = 1; // 1 = odd engaged, 2 = even engaged
    let shiftTimer = 0;

    const animate = (time, speed, meshesObj = meshes) => {
        const t = time * speed;
        
        // Base rotation from engine
        meshesObj.inputShaft.rotation.x = t * 5;

        // Shift logic
        shiftTimer += speed;
        if (shiftTimer > 5) {
            gearState = gearState === 1 ? 2 : 1;
            shiftTimer = 0;
        }

        // Clutch engagement visuals and shaft rotation
        if (gearState === 1) {
            // Odd gear engaged (K1)
            meshesObj.oddEngage.material.emissiveIntensity = 1 + Math.sin(t * 10) * 0.5;
            meshesObj.evenEngage.material.emissiveIntensity = 0.2;
            
            meshesObj.outerClutch.rotation.x = t * 5;
            meshesObj.solidShaft.rotation.x = t * 5;
            meshesObj.gear1.rotation.x = t * 5;
            
            // Output driven by gear 1
            meshesObj.outGear1.rotation.x = -t * 3.75;
            meshesObj.outputShaft.rotation.x = -t * 3.75;
            
            // Even gears spin at output speed
            meshesObj.outGear2.rotation.x = -t * 3.75;
            meshesObj.gear2.rotation.x = t * 4.41;
            meshesObj.hollowShaft.rotation.x = t * 4.41;
            meshesObj.innerClutch.rotation.x = t * 4.41;
            
        } else {
            // Even gear engaged (K2)
            meshesObj.evenEngage.material.emissiveIntensity = 1 + Math.sin(t * 10) * 0.5;
            meshesObj.oddEngage.material.emissiveIntensity = 0.2;
            
            meshesObj.innerClutch.rotation.x = t * 5;
            meshesObj.hollowShaft.rotation.x = t * 5;
            meshesObj.gear2.rotation.x = t * 5;
            
            // Output driven by gear 2
            meshesObj.outGear2.rotation.x = -t * 5.3;
            meshesObj.outputShaft.rotation.x = -t * 5.3;
            
            // Odd gears spin at output speed
            meshesObj.outGear1.rotation.x = -t * 5.3;
            meshesObj.gear1.rotation.x = t * 7.06;
            meshesObj.solidShaft.rotation.x = t * 7.06;
            meshesObj.outerClutch.rotation.x = t * 7.06;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDualClutch() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
