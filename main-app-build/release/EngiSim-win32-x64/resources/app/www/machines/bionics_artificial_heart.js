import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const titaniumMat = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.5,
    });
    
    const glowingRedMat = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 0.8,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
    });
    
    const glowingBlueMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044aa,
        emissiveIntensity: 0.8,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
    });
    
    const valveMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.5,
    });
    
    const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.5,
        roughness: 0.8,
        wireframe: true,
    });

    // 1. Titanium Casing
    const casingGeo = new THREE.CylinderGeometry(1.2, 1.0, 3, 32);
    const casing = new THREE.Mesh(casingGeo, titaniumMat);
    casing.position.set(0, 0, 0);
    casing.castShadow = true;
    casing.receiveShadow = true;
    group.add(casing);
    
    parts.push({
        name: "Titanium Casing",
        description: "A highly durable, biocompatible housing that protects internal pneumatic bladders and electronics.",
        material: "Titanium Alloy",
        function: "Structural Support & Protection",
        assemblyOrder: 1,
        connections: ["Left Ventricle Bladder", "Right Ventricle Bladder", "Drive Driveline"],
        failureEffect: "Structural breach leading to catastrophic failure of internal bladders.",
        cascadeFailures: ["Complete Hemodynamic Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Left Ventricle Bladder
    const lvGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const leftVentricle = new THREE.Mesh(lvGeo, glowingRedMat);
    leftVentricle.position.set(0.5, 0, 0.2);
    group.add(leftVentricle);
    
    parts.push({
        name: "Left Ventricle Bladder",
        description: "A polyurethane membrane responsible for pumping oxygenated blood to the systemic circulation.",
        material: "Segmented Polyurethane",
        function: "Systemic Pumping",
        assemblyOrder: 2,
        connections: ["Titanium Casing", "Aortic Valve", "Mitral Valve"],
        failureEffect: "Loss of systemic perfusion and immediate heart failure.",
        cascadeFailures: ["Organ Failure", "Cardiogenic Shock"],
        originalPosition: { x: 0.5, y: 0, z: 0.2 },
        explodedPosition: { x: 3, y: 0, z: 1 }
    });

    // 3. Right Ventricle Bladder
    const rvGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const rightVentricle = new THREE.Mesh(rvGeo, glowingBlueMat);
    rightVentricle.position.set(-0.5, 0, -0.2);
    group.add(rightVentricle);

    parts.push({
        name: "Right Ventricle Bladder",
        description: "Pumps deoxygenated blood into the pulmonary circulation for oxygenation.",
        material: "Segmented Polyurethane",
        function: "Pulmonary Pumping",
        assemblyOrder: 3,
        connections: ["Titanium Casing", "Pulmonary Valve", "Tricuspid Valve"],
        failureEffect: "Pulmonary congestion and right heart failure.",
        cascadeFailures: ["Hypoxia", "Right Ventricular Failure"],
        originalPosition: { x: -0.5, y: 0, z: -0.2 },
        explodedPosition: { x: -3, y: 0, z: -1 }
    });

    // 4. Inflow & Outflow Valves (Aortic & Pulmonary)
    const valveGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const aorticValve = new THREE.Mesh(valveGeo, valveMat);
    aorticValve.position.set(0.5, 1.6, 0.2);
    group.add(aorticValve);

    parts.push({
        name: "Aortic Valve Assembly",
        description: "Mechanical unidirectional valve preventing backflow of blood into the left ventricle.",
        material: "Pyrolytic Carbon",
        function: "Directional Flow Control",
        assemblyOrder: 4,
        connections: ["Left Ventricle Bladder", "Aorta"],
        failureEffect: "Aortic regurgitation leading to reduced cardiac output.",
        cascadeFailures: ["Pump Overload"],
        originalPosition: { x: 0.5, y: 1.6, z: 0.2 },
        explodedPosition: { x: 1, y: 3, z: 0.5 }
    });
    
    const pulmonaryValve = new THREE.Mesh(valveGeo, valveMat);
    pulmonaryValve.position.set(-0.5, 1.6, -0.2);
    group.add(pulmonaryValve);

    parts.push({
        name: "Pulmonary Valve Assembly",
        description: "Mechanical unidirectional valve ensuring flow towards the lungs.",
        material: "Pyrolytic Carbon",
        function: "Directional Flow Control",
        assemblyOrder: 5,
        connections: ["Right Ventricle Bladder", "Pulmonary Artery"],
        failureEffect: "Pulmonary regurgitation reducing oxygenation efficiency.",
        cascadeFailures: ["Hypoxia"],
        originalPosition: { x: -0.5, y: 1.6, z: -0.2 },
        explodedPosition: { x: -1, y: 3, z: -0.5 }
    });

    // 5. Pneumatic Driveline
    const drivelineGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 24);
    const driveline = new THREE.Mesh(drivelineGeo, tubeMat);
    driveline.position.set(0, -1.6, 0);
    driveline.rotation.x = Math.PI / 2;
    group.add(driveline);

    parts.push({
        name: "Pneumatic Driveline Port",
        description: "Connection point for external pneumatic driver tubes that pump air to actuate the bladders.",
        material: "Medical Grade Silicone",
        function: "Pneumatic Power Transfer",
        assemblyOrder: 6,
        connections: ["Titanium Casing", "External Controller"],
        failureEffect: "Loss of pneumatic pressure resulting in complete cessation of pumping.",
        cascadeFailures: ["Total System Failure"],
        originalPosition: { x: 0, y: -1.6, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    const description = "The Bionics Artificial Heart (Total Heart Replacement) is an advanced mechanical circulatory support device designed to completely replace the native ventricles. Utilizing pneumatically actuated polyurethane bladders housed in a titanium casing, it ensures continuous systemic and pulmonary circulation. Its pulsatile flow mimics a natural heart, controlled by an external pneumatic driver.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Left Ventricle Bladder in the artificial heart?",
            options: ["Pumping deoxygenated blood to the lungs", "Pumping oxygenated blood to the systemic circulation", "Generating electrical impulses", "Filtering toxins from the blood"],
            correct: 1,
            explanation: "The left ventricle bladder pumps oxygenated blood from the lungs out to the rest of the body, mimicking the function of the biological left ventricle.",
            difficulty: "Medium"
        },
        {
            question: "Which material is predominantly used for the rigid outer casing of the artificial heart due to its biocompatibility and strength?",
            options: ["Polyurethane", "Pyrolytic Carbon", "Titanium Alloy", "Medical Grade Silicone"],
            correct: 2,
            explanation: "Titanium alloy is used for the casing because it is highly biocompatible, corrosion-resistant, and structurally strong enough to protect internal components.",
            difficulty: "Easy"
        },
        {
            question: "A sudden loss of pneumatic pressure in the driveline would result in which immediate cascade failure?",
            options: ["Aortic regurgitation", "Total cessation of pumping", "Pulmonary congestion only", "Overheating of the casing"],
            correct: 1,
            explanation: "The artificial heart relies entirely on the external pneumatic driveline to actuate the bladders. Loss of pressure means the bladders cannot contract, leading to total cessation of pumping.",
            difficulty: "Hard"
        }
    ];

    const meshes = { casing, leftVentricle, rightVentricle, aorticValve, pulmonaryValve, driveline };

    function animate(time, speed, meshesObj) {
        // Heart beat animation (pulsating bladders)
        const beatFreq = 2.0; // BPM related factor
        const beatPhase = (time * speed * beatFreq) % 1.0;
        
        // Simulating systole and diastole (contraction and expansion)
        // Quick contraction, slower relaxation
        let scale = 1.0;
        if (beatPhase < 0.3) {
            // Systole (contraction)
            scale = 1.0 - (beatPhase / 0.3) * 0.2;
        } else {
            // Diastole (relaxation)
            scale = 0.8 + ((beatPhase - 0.3) / 0.7) * 0.2;
        }

        if (meshesObj) {
            if (meshesObj.leftVentricle) {
                meshesObj.leftVentricle.scale.set(scale, scale, scale);
                meshesObj.leftVentricle.material.emissiveIntensity = 0.8 + (1.0 - scale) * 2.0;
            }
            if (meshesObj.rightVentricle) {
                meshesObj.rightVentricle.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);
                meshesObj.rightVentricle.material.emissiveIntensity = 0.8 + (1.0 - scale) * 2.0;
            }
            if (meshesObj.casing) {
                meshesObj.casing.position.y = Math.sin(time * speed * beatFreq * Math.PI * 2) * 0.02;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createArtificialHeart() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
