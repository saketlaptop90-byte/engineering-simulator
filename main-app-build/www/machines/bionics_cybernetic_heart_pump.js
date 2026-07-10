import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing material for hydrodynamic bearings
    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const bioGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        transmission: 0.9,
        opacity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    // 1. Outer Housing
    const housingGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const housingMesh = new THREE.Mesh(housingGeometry, chrome);
    housingMesh.rotation.x = Math.PI / 2;
    group.add(housingMesh);
    parts.push({
        name: "Titanium Pump Housing",
        description: "Biocompatible titanium outer casing protecting the internal components.",
        material: "chrome",
        function: "Encloses the pump mechanism and ensures hemocompatibility with the body.",
        assemblyOrder: 1,
        connections: ["Aortic Graft Inflow", "Aortic Graft Outflow", "Stator Motor"],
        failureEffect: "Thrombosis or infection due to compromised seal.",
        cascadeFailures: ["Pump failure", "Patient sepsis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3 },
        mesh: housingMesh
    });

    // 2. Impeller
    const impellerGroup = new THREE.Group();
    const hubGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.8, 16);
    const hubMesh = new THREE.Mesh(hubGeometry, darkSteel);
    impellerGroup.add(hubMesh);
    
    for (let i = 0; i < 4; i++) {
        const bladeGeometry = new THREE.BoxGeometry(2.6, 1.6, 0.1);
        const bladeMesh = new THREE.Mesh(bladeGeometry, steel);
        bladeMesh.rotation.y = (Math.PI / 2) * i;
        bladeMesh.rotation.z = Math.PI / 6;
        impellerGroup.add(bladeMesh);
    }
    impellerGroup.rotation.x = Math.PI / 2;
    group.add(impellerGroup);
    parts.push({
        name: "Magnetically Levitated Impeller",
        description: "The sole moving part of the pump, a rotary impeller.",
        material: "steel",
        function: "Spins to propel blood continuously from the heart into the aorta.",
        assemblyOrder: 3,
        connections: ["Hydrodynamic Bearings", "Stator Motor"],
        failureEffect: "Loss of blood flow (pump thrombosis or mechanical seizure).",
        cascadeFailures: ["Systemic hypoxia", "Motor burnout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: impellerGroup
    });

    // 3. Hydrodynamic Bearings (Glowing)
    const bearingGeometry1 = new THREE.TorusGeometry(0.7, 0.1, 16, 32);
    const bearingMesh1 = new THREE.Mesh(bearingGeometry1, glowRed);
    bearingMesh1.position.z = 0.8;
    group.add(bearingMesh1);
    parts.push({
        name: "Anterior Hydrodynamic Bearing",
        description: "Uses blood itself as a lubricant to levitate the impeller.",
        material: "glowRed",
        function: "Prevents mechanical wear and minimizes red blood cell damage (hemolysis).",
        assemblyOrder: 2,
        connections: ["Impeller", "Housing"],
        failureEffect: "Impeller friction resulting in hemolysis.",
        cascadeFailures: ["Impeller seizure"],
        originalPosition: { x: 0, y: 0, z: 0.8 },
        explodedPosition: { x: 0, y: 2, z: 2 },
        mesh: bearingMesh1
    });

    const bearingGeometry2 = new THREE.TorusGeometry(0.7, 0.1, 16, 32);
    const bearingMesh2 = new THREE.Mesh(bearingGeometry2, glowBlue);
    bearingMesh2.position.z = -0.8;
    group.add(bearingMesh2);
    parts.push({
        name: "Posterior Hydrodynamic Bearing",
        description: "Rear levitation support for the rotary impeller.",
        material: "glowBlue",
        function: "Maintains axial stability of the impeller at high RPM.",
        assemblyOrder: 4,
        connections: ["Impeller", "Housing"],
        failureEffect: "Axial displacement of impeller.",
        cascadeFailures: ["Pump thrombosis"],
        originalPosition: { x: 0, y: 0, z: -0.8 },
        explodedPosition: { x: 0, y: -2, z: -2 },
        mesh: bearingMesh2
    });

    // 4. Stator Motor Coils
    const statorGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const coilGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        const angle = (i / 6) * Math.PI * 2;
        coilMesh.position.x = Math.cos(angle) * 1.2;
        coilMesh.position.y = Math.sin(angle) * 1.2;
        statorGroup.add(coilMesh);
    }
    statorGroup.rotation.x = Math.PI / 2;
    group.add(statorGroup);
    parts.push({
        name: "Electromagnetic Stator",
        description: "Copper wire coils arrayed around the housing.",
        material: "copper",
        function: "Generates the rotating magnetic field to drive the impeller.",
        assemblyOrder: 5,
        connections: ["Housing", "Driveline"],
        failureEffect: "Motor fails to spin, zero cardiac output.",
        cascadeFailures: ["Complete pump failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 },
        mesh: statorGroup
    });

    // 5. Inflow Graft
    const inflowGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const inflowMesh = new THREE.Mesh(inflowGeo, bioGlass);
    inflowMesh.position.z = 2;
    inflowMesh.rotation.x = Math.PI / 2;
    group.add(inflowMesh);
    parts.push({
        name: "Apical Inflow Graft",
        description: "Connects the pump to the left ventricle apex.",
        material: "bioGlass",
        function: "Channels oxygenated blood from the heart into the pump.",
        assemblyOrder: 6,
        connections: ["Housing", "Left Ventricle"],
        failureEffect: "Inflow obstruction, vacuum effect in ventricle (suction event).",
        cascadeFailures: ["Arrhythmia", "Pump damage"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: inflowMesh
    });

    // 6. Outflow Graft
    const outflowGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 32);
    const outflowMesh = new THREE.Mesh(outflowGeo, bioGlass);
    outflowMesh.position.y = 2.5;
    group.add(outflowMesh);
    parts.push({
        name: "Aortic Outflow Graft",
        description: "Dacron tube returning blood to circulation.",
        material: "bioGlass",
        function: "Routes pressurized blood from the pump to the ascending aorta.",
        assemblyOrder: 7,
        connections: ["Housing", "Aorta"],
        failureEffect: "Kinking or outflow obstruction.",
        cascadeFailures: ["High pump power consumption", "Low flow alarm"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: outflowMesh
    });

    // 7. Driveline
    const driveGeo = new THREE.TorusGeometry(3, 0.15, 8, 32, Math.PI);
    const driveMesh = new THREE.Mesh(driveGeo, rubber);
    driveMesh.position.x = -3;
    driveMesh.position.y = -1.5;
    group.add(driveMesh);
    parts.push({
        name: "Percutaneous Driveline",
        description: "Power and data cable exiting the patient's body.",
        material: "rubber",
        function: "Connects internal pump to external controller and batteries.",
        assemblyOrder: 8,
        connections: ["Stator Motor", "External Controller"],
        failureEffect: "Driveline infection or wire fracture.",
        cascadeFailures: ["Intermittent power loss", "Pump stop"],
        originalPosition: { x: -3, y: -1.5, z: 0 },
        explodedPosition: { x: -6, y: -3, z: 0 },
        mesh: driveMesh
    });

    const description = "The Cybernetic Heart Pump is a continuous-flow left ventricular assist device (LVAD). It uses a magnetically levitated rotary impeller, entirely avoiding mechanical wear. Hydrodynamic bearings utilize the blood itself to stabilize the rotor, enabling long-term circulatory support with minimal red blood cell damage.";

    const quizQuestions = [
        {
            question: "Why does the cybernetic heart pump use continuous flow instead of pulsatile flow?",
            options: ["It accurately simulates a real pulse", "Rotary mechanisms are smaller, more durable, and require fewer moving parts", "It prevents blood from flowing backwards into the lungs", "Continuous flow devices don't require electrical power"],
            correct: 1,
            explanation: "Continuous-flow rotary pumps have only one moving part (the impeller), making them much more reliable, smaller, and durable than complex pulsatile pumps.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the hydrodynamic bearings in this device?",
            options: ["To pump blood using sound waves", "To levitate the impeller using blood as a lubricant, preventing mechanical wear", "To generate electrical power for the motor", "To filter clots out of the blood stream"],
            correct: 1,
            explanation: "Hydrodynamic and magnetic levitation keeps the spinning impeller from physically touching the casing, preventing friction-induced wear and reducing red blood cell destruction.",
            difficulty: "Hard"
        },
        {
            question: "A 'suction event' occurs when the pump pulls more blood than the left ventricle can provide. Which part is primarily involved?",
            options: ["Aortic Outflow Graft", "Electromagnetic Stator", "Apical Inflow Graft", "Percutaneous Driveline"],
            correct: 2,
            explanation: "The Apical Inflow Graft pulls blood from the left ventricle. If pump speed is too high or patient fluid volume is too low, the ventricle walls can collapse around the inflow.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find impeller and spin it rapidly
        const impeller = meshes.find(m => m.name === "Magnetically Levitated Impeller");
        if (impeller) {
            impeller.mesh.rotation.y = time * speed * 15;
        }

        // Pulse the glowing bearings
        const antBearing = meshes.find(m => m.name === "Anterior Hydrodynamic Bearing");
        const postBearing = meshes.find(m => m.name === "Posterior Hydrodynamic Bearing");
        if (antBearing) {
            antBearing.mesh.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 5) * 0.5;
        }
        if (postBearing) {
            postBearing.mesh.material.emissiveIntensity = 1.5 + Math.cos(time * speed * 5) * 0.5;
        }

        // Blood flow effect in outflow graft (scaling it slightly to simulate pressure)
        const outflow = meshes.find(m => m.name === "Aortic Outflow Graft");
        if (outflow) {
            outflow.mesh.scale.x = 1.0 + Math.sin(time * speed * 10) * 0.05;
            outflow.mesh.scale.z = 1.0 + Math.sin(time * speed * 10) * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCyberneticHeartPump() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
