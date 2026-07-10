import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonDrugMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00aa88,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const screenGlowMat = new THREE.MeshBasicMaterial({ color: 0x00aaff });
    const greenLED = new THREE.MeshBasicMaterial({ color: 0x33ff33 });
    const redLED = new THREE.MeshBasicMaterial({ color: 0xff3333 });

    // Helper function to create cylinder
    const createCylinder = (radius, height, mat, x, y, z, rotX = 0, rotY = 0, rotZ = 0) => {
        const geo = new THREE.CylinderGeometry(radius, radius, height, 32);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.set(rotX, rotY, rotZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    };

    // Helper function to create box
    const createBox = (w, h, d, mat, x, y, z) => {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    };

    // 1. Base Housing
    const housingGroup = new THREE.Group();
    const baseMesh = createBox(15, 6, 8, plastic, 0, 0, 0);
    const topPanelMesh = createBox(14.5, 0.5, 7.5, darkSteel, 0, 3.25, 0);
    const sideGripL = createBox(0.2, 5, 6, rubber, -7.6, 0, 0);
    const sideGripR = createBox(0.2, 5, 6, rubber, 7.6, 0, 0);
    housingGroup.add(baseMesh, topPanelMesh, sideGripL, sideGripR);
    housingGroup.position.set(0, 0, 0);
    
    parts.push({
        name: "Main Housing Chassis",
        description: "Polycarbonate casing protecting internal electronics and drive mechanisms.",
        material: "Polycarbonate / Rubber",
        function: "Structural support and environmental protection.",
        assemblyOrder: 1,
        connections: ["Control Board", "Drive Motor", "Lead Screw"],
        failureEffect: "Exposure of internals to contamination.",
        cascadeFailures: ["Short circuit", "Mechanical jamming"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: housingGroup
    });
    group.add(housingGroup);

    // 2. Control Interface & Screen
    const interfaceGroup = new THREE.Group();
    const screenMesh = createBox(4, 2.5, 0.2, tinted, -4, 3.5, 3.5);
    const screenDisplay = createBox(3.6, 2.1, 0.1, screenGlowMat, -4, 3.5, 3.65);
    const btn1 = createCylinder(0.3, 0.2, greenLED, -1.5, 3.5, 3.5, Math.PI/2);
    const btn2 = createCylinder(0.3, 0.2, redLED, -0.5, 3.5, 3.5, Math.PI/2);
    const dial = createCylinder(0.6, 0.5, aluminum, 1, 3.5, 3.5, Math.PI/2);
    interfaceGroup.add(screenMesh, screenDisplay, btn1, btn2, dial);
    
    parts.push({
        name: "Control Interface",
        description: "LCD touchscreen and tactile buttons for configuring infusion rates.",
        material: "Glass / Electronics",
        function: "User input and parameter display.",
        assemblyOrder: 2,
        connections: ["Main Housing Chassis"],
        failureEffect: "Inability to set or monitor infusion.",
        cascadeFailures: ["Incorrect dosing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 10, z: 10 },
        mesh: interfaceGroup
    });
    group.add(interfaceGroup);

    // 3. Stepper Motor
    const motorGroup = new THREE.Group();
    const motorBody = createBox(3, 3, 3, aluminum, -5, 1, -1);
    const motorCap = createCylinder(1, 0.5, copper, -3.25, 1, -1, 0, 0, Math.PI/2);
    motorGroup.add(motorBody, motorCap);
    
    parts.push({
        name: "Precision Stepper Motor",
        description: "High-resolution stepper motor converting electrical pulses to precise rotation.",
        material: "Aluminum / Copper Winding",
        function: "Provides driving force for the lead screw.",
        assemblyOrder: 3,
        connections: ["Main Housing Chassis", "Lead Screw"],
        failureEffect: "Pump fails to move syringe plunger.",
        cascadeFailures: ["Infusion stops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 5, z: -5 },
        mesh: motorGroup
    });
    group.add(motorGroup);

    // 4. Lead Screw (Drive Mechanism)
    const leadScrewGroup = new THREE.Group();
    const screwShaft = createCylinder(0.2, 10, chrome, 2, 1, -1, 0, 0, Math.PI/2);
    const screwThread1 = createCylinder(0.25, 10, darkSteel, 2, 1, -1, 0, 0, Math.PI/2);
    leadScrewGroup.add(screwShaft, screwThread1);
    
    parts.push({
        name: "Precision Lead Screw",
        description: "Threaded rod translating rotational motion from the motor into linear motion.",
        material: "Chrome / Steel",
        function: "Drives the pusher block linearly.",
        assemblyOrder: 4,
        connections: ["Precision Stepper Motor", "Pusher Block"],
        failureEffect: "Uneven or stuck linear motion.",
        cascadeFailures: ["Inaccurate drug delivery", "Motor overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -10 },
        mesh: leadScrewGroup
    });
    group.add(leadScrewGroup);

    // 5. Pusher Block (Carriage)
    const pusherGroup = new THREE.Group();
    const carriageBase = createBox(2, 2.5, 3, steel, 4, 1, -1);
    const pusherArm = createBox(1, 4, 1, aluminum, 4, 3.5, 1.5);
    const sensorPad = createBox(0.2, 1, 1, rubber, 3.4, 3.5, 1.5);
    pusherGroup.add(carriageBase, pusherArm, sensorPad);
    
    parts.push({
        name: "Pusher Block & Force Sensor",
        description: "Carriage moving along the lead screw, equipped with pressure sensors for occlusion detection.",
        material: "Steel / Aluminum",
        function: "Pushes the syringe plunger and monitors resistance.",
        assemblyOrder: 5,
        connections: ["Precision Lead Screw", "Syringe Plunger"],
        failureEffect: "Fails to detect blockages (occlusions) in the IV line.",
        cascadeFailures: ["Line rupture", "Patient harm"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 5, z: -5 },
        mesh: pusherGroup
    });
    group.add(pusherGroup);

    // 6. Syringe Holder (Clamp)
    const holderGroup = new THREE.Group();
    const barrelRest = createBox(6, 1, 3, plastic, 0, 3, 1.5);
    const flangeClip = createBox(0.5, 2, 3, darkSteel, -3, 4, 1.5);
    const clampArm = createCylinder(0.3, 4, aluminum, 0, 5, 2.5, Math.PI/2);
    holderGroup.add(barrelRest, flangeClip, clampArm);

    parts.push({
        name: "Syringe Clamp",
        description: "Secures the syringe barrel to prevent movement during infusion.",
        material: "Plastic / Steel",
        function: "Holds syringe steady.",
        assemblyOrder: 6,
        connections: ["Main Housing Chassis", "Syringe Barrel"],
        failureEffect: "Syringe shifts during operation.",
        cascadeFailures: ["Inaccurate volume delivered"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: holderGroup
    });
    group.add(holderGroup);

    // 7. The Syringe (Barrel & Plunger)
    const syringeGroup = new THREE.Group();
    const barrel = createCylinder(1.2, 7, glass, 0, 4, 1.5, 0, 0, Math.PI/2);
    const nozzle = createCylinder(0.2, 1, plastic, -4, 4, 1.5, 0, 0, Math.PI/2);
    const plungerRod = createCylinder(0.4, 6, plastic, 3, 4, 1.5, 0, 0, Math.PI/2);
    const plungerSeal = createCylinder(1.1, 0.3, rubber, 0.5, 4, 1.5, 0, 0, Math.PI/2);
    
    // Neon Fluid Inside
    const fluid = createCylinder(1.1, 3.5, neonDrugMat, -1.75, 4, 1.5, 0, 0, Math.PI/2);
    
    syringeGroup.add(barrel, nozzle, plungerRod, plungerSeal, fluid);
    
    parts.push({
        name: "Syringe Assembly",
        description: "Disposable syringe containing the medication.",
        material: "Glass / Rubber / Fluid",
        function: "Contains and delivers fluid.",
        assemblyOrder: 7,
        connections: ["Syringe Clamp", "Pusher Block"],
        failureEffect: "Leakage or contamination.",
        cascadeFailures: ["Incorrect dosing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 10, z: 10 },
        mesh: syringeGroup,
        fluidMesh: fluid,
        plungerRod: plungerRod,
        plungerSeal: plungerSeal
    });
    group.add(syringeGroup);

    // Animations & Interactions
    let pumpProgress = 0;
    
    const animate = (time, speed, meshes) => {
        // Animate screen glow
        screenDisplay.material.opacity = 0.8 + Math.sin(time * 5) * 0.2;
        
        // Rotate motor cap and lead screw slightly
        const rotationSpeed = speed * 2;
        motorCap.rotation.x = time * rotationSpeed;
        screwShaft.rotation.x = time * rotationSpeed;
        
        // Linear translation of pusher block
        pumpProgress = (pumpProgress + 0.005 * speed) % 1;
        const startX = 4;
        const endX = -0.5;
        const currentX = startX - (startX - endX) * pumpProgress;
        
        if (meshes["Pusher Block & Force Sensor"]) {
            meshes["Pusher Block & Force Sensor"].position.x = currentX - 4;
        }

        // Animate plunger and fluid depletion
        if (meshes["Syringe Assembly"]) {
            meshes["Syringe Assembly"].plungerRod.position.x = currentX + 0.5;
            meshes["Syringe Assembly"].plungerSeal.position.x = currentX - 2.5;
            
            // Scale fluid
            const maxFluidLength = 4.5;
            const currentFluidLength = maxFluidLength * (1 - pumpProgress);
            meshes["Syringe Assembly"].fluidMesh.scale.y = currentFluidLength / 3.5; 
            meshes["Syringe Assembly"].fluidMesh.position.x = -4 + currentFluidLength / 2;
        }

        // Pulse the neon drug
        neonDrugMat.emissiveIntensity = 1.0 + Math.sin(time * 10) * 0.5;
    };

    const description = "A high-precision biomedical Syringe Pump. Uses a stepper motor and lead screw to precisely drive a syringe plunger, delivering micro-infusions of potent medications. Features a touchscreen interface and sensitive force sensors for occlusion detection.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pusher Block force sensor in a syringe pump?",
            options: [
                "To measure the volume of drug remaining.",
                "To detect occlusions (blockages) in the IV line by sensing backpressure.",
                "To monitor the patient's blood pressure.",
                "To verify the correct syringe size."
            ],
            correct: 1,
            explanation: "The force sensor detects if the plunger requires excessive force to push, indicating a blockage (occlusion) in the fluid line, which triggers an alarm.",
            difficulty: "Medium"
        },
        {
            question: "How does the pump achieve highly precise, very slow infusion rates?",
            options: [
                "By using a DC motor with variable voltage.",
                "By utilizing a stepper motor coupled with a fine-pitch lead screw.",
                "By relying on gravity and a drip chamber.",
                "By using a peristaltic squeezing mechanism."
            ],
            correct: 1,
            explanation: "Stepper motors move in discrete steps, and a lead screw converts this tiny rotation into microscopic linear movement, allowing for precise micro-infusions.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Syringe Clamp fails to properly secure the syringe barrel?",
            options: [
                "The pump will automatically increase motor speed.",
                "The entire syringe may shift, leading to a sudden, inaccurate bolus or loss of drug delivery.",
                "The touchscreen interface will reboot.",
                "The drug will freeze."
            ],
            correct: 1,
            explanation: "If the barrel is not held stationary, the pusher block will push the whole syringe instead of just the plunger, causing critical dosing errors.",
            difficulty: "Medium"
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSyringePump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
