import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
    });

    const glowingBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ccff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
    });
    
    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.3
    });

    // 1. PTO Housing (Main Casing)
    const housingGeom = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const housingMesh = new THREE.Mesh(housingGeom, darkSteel);
    housingMesh.rotation.z = Math.PI / 2;
    housingMesh.position.set(0, 0, 0);
    group.add(housingMesh);
    parts.push({
        name: "PTO Housing",
        description: "Heavy-duty cast iron or steel housing enclosing the gearset and clutches.",
        material: "darkSteel",
        function: "Protects internal components and provides structural support.",
        assemblyOrder: 1,
        connections: ["Input Shaft", "Output Shaft", "Clutch Pack"],
        failureEffect: "Loss of lubrication, exposure to debris, structural failure.",
        cascadeFailures: ["Gearset Damage", "Clutch Overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: housingMesh
    });

    // 2. Input Shaft (From Engine)
    const inputShaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const inputShaftMesh = new THREE.Mesh(inputShaftGeom, steel);
    inputShaftMesh.rotation.z = Math.PI / 2;
    inputShaftMesh.position.set(-2, 0, 0);
    group.add(inputShaftMesh);
    parts.push({
        name: "Input Shaft",
        description: "Receives rotational power directly from the tractor's engine or transmission.",
        material: "steel",
        function: "Transmits power into the PTO assembly.",
        assemblyOrder: 2,
        connections: ["Engine Flywheel", "PTO Clutch"],
        failureEffect: "Total loss of power to PTO.",
        cascadeFailures: ["None"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 },
        mesh: inputShaftMesh
    });

    // 3. PTO Clutch Pack (Multi-disc)
    const clutchGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const discGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const discMesh = new THREE.Mesh(discGeom, i%2===0 ? copper : steel);
        discMesh.rotation.z = Math.PI / 2;
        discMesh.position.set(-0.8 + i*0.15, 0, 0);
        clutchGroup.add(discMesh);
    }
    const clutchIndicator = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 16, 32), glowingRed);
    clutchIndicator.rotation.y = Math.PI / 2;
    clutchIndicator.position.set(-0.5, 0, 0);
    clutchGroup.add(clutchIndicator);
    
    group.add(clutchGroup);
    parts.push({
        name: "Clutch Pack",
        description: "Hydraulically engaged multi-disc wet clutch system.",
        material: "copper/steel/glowingRed",
        function: "Allows smooth engagement and disengagement of PTO power independent of the tractor's main transmission (Independent PTO).",
        assemblyOrder: 3,
        connections: ["Input Shaft", "Drive Gear"],
        failureEffect: "Slipping, inability to transmit full torque, overheating.",
        cascadeFailures: ["Burnt hydraulic fluid", "Damage to mating gears"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 2, z: 0 },
        mesh: clutchGroup
    });

    // 4. Drive Gear
    const driveGearGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 16);
    const driveGearMesh = new THREE.Mesh(driveGearGeom, chrome);
    driveGearMesh.rotation.z = Math.PI / 2;
    driveGearMesh.position.set(0.2, 0, 0);
    group.add(driveGearMesh);
    parts.push({
        name: "Drive Gear",
        description: "Primary gear driven by the clutch pack.",
        material: "chrome",
        function: "Transfers rotational energy to the reduction/selector gears.",
        assemblyOrder: 4,
        connections: ["Clutch Pack", "Selector Gear"],
        failureEffect: "Grinding noises, loss of power transfer.",
        cascadeFailures: ["Metal shavings in hydraulic fluid"],
        originalPosition: { x: 0.2, y: 0, z: 0 },
        explodedPosition: { x: 0.2, y: 3, z: 0 },
        mesh: driveGearMesh
    });

    // 5. Selector Gear (540 / 1000 RPM selector)
    const selectorGearGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 16);
    const selectorGearMesh = new THREE.Mesh(selectorGearGeom, neonOrange);
    selectorGearMesh.rotation.z = Math.PI / 2;
    selectorGearMesh.position.set(0.2, -1.2, 0);
    group.add(selectorGearMesh);
    parts.push({
        name: "Selector Gear Assembly",
        description: "Shiftable gearset allowing selection between standard PTO speeds (e.g., 540 RPM or 1000 RPM).",
        material: "neonOrange",
        function: "Changes the final drive ratio to match implement requirements.",
        assemblyOrder: 5,
        connections: ["Drive Gear", "Output Shaft"],
        failureEffect: "Stuck in one speed, false neutral, gear stripping.",
        cascadeFailures: ["Implement damage if wrong speed is forced"],
        originalPosition: { x: 0.2, y: -1.2, z: 0 },
        explodedPosition: { x: 0.2, y: -3, z: 0 },
        mesh: selectorGearMesh
    });

    // 6. Output Shaft (Splined)
    const outputShaftGeom = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 12);
    const outputShaftMesh = new THREE.Mesh(outputShaftGeom, steel);
    outputShaftMesh.rotation.z = Math.PI / 2;
    outputShaftMesh.position.set(1.5, -1.2, 0);
    
    // Spline details
    const splines = new THREE.Group();
    for(let i=0; i<6; i++) {
        const splineGeom = new THREE.BoxGeometry(0.6, 0.05, 0.05);
        const spline = new THREE.Mesh(splineGeom, chrome);
        spline.position.set(1.2, 0, 0);
        spline.rotation.x = (Math.PI / 3) * i;
        splines.add(spline);
    }
    outputShaftMesh.add(splines);
    
    group.add(outputShaftMesh);
    parts.push({
        name: "Splined Output Shaft",
        description: "The exterior shaft where implements connect. Commonly 6-spline (540 RPM) or 21-spline (1000 RPM).",
        material: "steel/chrome",
        function: "Delivers the final rotational power to the attached agricultural implement.",
        assemblyOrder: 6,
        connections: ["Selector Gear", "Implement Driveline"],
        failureEffect: "Twisted or sheared splines, shaft breakage.",
        cascadeFailures: ["Implement driveline separation"],
        originalPosition: { x: 1.5, y: -1.2, z: 0 },
        explodedPosition: { x: 4, y: -1.2, z: 0 },
        mesh: outputShaftMesh
    });

    // 7. Safety Shield
    const shieldGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16, 1, true, 0, Math.PI);
    const shieldMesh = new THREE.Mesh(shieldGeom, plastic);
    shieldMesh.rotation.z = Math.PI / 2;
    shieldMesh.rotation.y = Math.PI / 2;
    shieldMesh.position.set(2.5, -1.2, 0);
    shieldMesh.material.side = THREE.DoubleSide;
    group.add(shieldMesh);
    parts.push({
        name: "Safety Master Shield",
        description: "Stationary protective cover over the spinning output shaft.",
        material: "plastic",
        function: "Prevents clothing or limbs from becoming entangled in the spinning shaft.",
        assemblyOrder: 7,
        connections: ["Housing"],
        failureEffect: "Extreme safety hazard to operator.",
        cascadeFailures: ["Fatal injury"],
        originalPosition: { x: 2.5, y: -1.2, z: 0 },
        explodedPosition: { x: 2.5, y: -1.2, z: 2 },
        mesh: shieldMesh
    });
    
    // 8. PTO Brake
    const brakeGeom = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
    const brakeMesh = new THREE.Mesh(brakeGeom, rubber);
    brakeMesh.rotation.y = Math.PI / 2;
    brakeMesh.position.set(0.6, -1.2, 0);
    group.add(brakeMesh);
    parts.push({
        name: "PTO Brake",
        description: "Friction brake applied to the output shaft when clutch is disengaged.",
        material: "rubber",
        function: "Quickly stops the implement from freely spinning when power is cut off.",
        assemblyOrder: 8,
        connections: ["Output Shaft", "Housing"],
        failureEffect: "Implement continues to coast dangerously after shutoff.",
        cascadeFailures: ["Premature wear if engaged accidentally"],
        originalPosition: { x: 0.6, y: -1.2, z: 0 },
        explodedPosition: { x: 0.6, y: -1.2, z: -2 },
        mesh: brakeMesh
    });


    const description = "A Power Take-Off (PTO) is a mechanized driveline on a tractor that allows implements to draw energy from the tractor's engine. This assembly features an independent hydraulic clutch, a multi-speed gear selector (540/1000 RPM), and critical safety shielding.";

    const quizQuestions = [
        {
            question: "What is the primary function of the PTO Clutch Pack in an 'Independent PTO' system?",
            options: [
                "To select between 540 and 1000 RPM",
                "To allow the PTO to be engaged/disengaged independently of the tractor's forward motion",
                "To brake the spinning implement",
                "To connect the implement driveline to the output shaft"
            ],
            correct: 1,
            explanation: "An independent PTO has its own clutch, meaning you can stop the tractor's movement without stopping the PTO, or stop the PTO without stopping the tractor.",
            difficulty: "Medium"
        },
        {
            question: "Which component is critical for operator safety and prevents entanglement?",
            options: [
                "Selector Gear",
                "Drive Gear",
                "Safety Master Shield",
                "Splined Output Shaft"
            ],
            correct: 2,
            explanation: "The Safety Master Shield covers the spinning PTO stub shaft, preventing clothing or limbs from being caught, which can cause fatal injuries.",
            difficulty: "Easy"
        },
        {
            question: "If an implement requires 540 RPM but the PTO is accidentally run at 1000 RPM, what is the likely result?",
            options: [
                "The tractor engine will stall",
                "The PTO brake will automatically engage",
                "The implement will operate more efficiently",
                "Severe mechanical damage to the implement due to overspeeding"
            ],
            correct: 3,
            explanation: "Implements are designed for specific speeds. Running a 540 RPM implement at 1000 RPM will cause extreme centrifugal forces and rapid catastrophic failure.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the PTO Brake?",
            options: [
                "To slow down the tractor",
                "To stop the implement from coasting when the PTO clutch is disengaged",
                "To act as a parking brake for the tractor",
                "To limit the maximum torque of the PTO"
            ],
            correct: 1,
            explanation: "High-inertia implements (like mowers or balers) can coast for a long time. The PTO brake stops them quickly when the power is disengaged.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const ptoHousing = meshes.find(m => m.name === "PTO Housing")?.mesh;
        const inputShaft = meshes.find(m => m.name === "Input Shaft")?.mesh;
        const clutchPack = meshes.find(m => m.name === "Clutch Pack")?.mesh;
        const driveGear = meshes.find(m => m.name === "Drive Gear")?.mesh;
        const selectorGear = meshes.find(m => m.name === "Selector Gear Assembly")?.mesh;
        const outputShaft = meshes.find(m => m.name === "Splined Output Shaft")?.mesh;
        
        // Input rotates constantly with engine
        const engineSpeed = time * speed * 5;
        if (inputShaft) inputShaft.rotation.x = engineSpeed;
        
        // Simulate Clutch Engagement (Pulse effect)
        const clutchEngaged = Math.sin(time * speed * 0.5) > 0;
        
        if (clutchPack) {
            clutchPack.rotation.x = engineSpeed; // Clutch input side always spins
            // Glowing red ring pulses when engaging/slipping
            const indicator = clutchPack.children[clutchPack.children.length - 1];
            if (indicator) {
                indicator.material.emissiveIntensity = clutchEngaged ? 0.2 : 0.8 + Math.sin(time*10)*0.2;
            }
        }

        if (clutchEngaged) {
            if (driveGear) driveGear.rotation.x = engineSpeed;
            // Opposite rotation due to gear meshing
            if (selectorGear) selectorGear.rotation.x = -engineSpeed * 0.8;
            if (outputShaft) outputShaft.rotation.x = -engineSpeed * 0.8;
        } else {
            // Coasting down / braked
            if (driveGear) driveGear.rotation.x *= 0.95;
            if (selectorGear) selectorGear.rotation.x *= 0.95;
            if (outputShaft) outputShaft.rotation.x *= 0.95;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTractorPTOShaft() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
