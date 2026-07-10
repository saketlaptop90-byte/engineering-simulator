import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing/neon materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.2,
        metalness: 0.2,
        roughness: 0.2
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        metalness: 0.3,
        roughness: 0.4
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // 1. Hub Core
    const hubGeo = new THREE.CylinderGeometry(1.5, 1.8, 3, 32);
    hubGeo.rotateX(Math.PI / 2);
    const hubMesh = new THREE.Mesh(hubGeo, chrome);
    group.add(hubMesh);
    parts.push({
        name: "Propeller Hub Core",
        description: "The central casing that houses the pitch change mechanism and attaches to the engine crankshaft.",
        material: "Chrome/Steel",
        function: "Transmits engine torque to the blades while containing the hydraulic or mechanical pitch controls.",
        assemblyOrder: 1,
        connections: ["Engine Crankshaft", "Blade Roots", "Dome Assembly"],
        failureEffect: "Complete loss of propulsion; catastrophic separation of blades.",
        cascadeFailures: ["Engine overspeed", "Airframe structural damage"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -2},
        mesh: hubMesh
    });

    // 2. Blades and Roots (x3)
    const bladePivots = [];
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        
        const pivot = new THREE.Group();
        pivot.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
        pivot.rotation.z = angle - Math.PI / 2;
        group.add(pivot);
        bladePivots.push(pivot);

        // Blade Root
        const rootGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
        rootGeo.translate(0, 0.75, 0);
        const rootMesh = new THREE.Mesh(rootGeo, darkSteel);
        pivot.add(rootMesh);

        parts.push({
            name: `Blade Root ${i+1}`,
            description: "The base of the propeller blade featuring the pitch change bearings and gear teeth.",
            material: "Dark Steel",
            function: "Allows the blade to rotate along its longitudinal axis to change pitch.",
            assemblyOrder: 2,
            connections: ["Hub Core", "Propeller Blade", "Pitch Change Gear"],
            failureEffect: "Blade gets stuck at current pitch angle.",
            cascadeFailures: ["Asymmetric thrust", "Engine vibration"],
            originalPosition: {x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5, z: 0},
            explodedPosition: {x: Math.cos(angle) * 4, y: Math.sin(angle) * 4, z: 0},
            mesh: rootMesh
        });

        // Blade Aerofoil
        const bladeGeo = new THREE.BoxGeometry(0.1, 6, 0.8);
        bladeGeo.translate(0, 4.5, 0); // start above root
        const bladeMesh = new THREE.Mesh(bladeGeo, aluminum);
        pivot.add(bladeMesh);

        parts.push({
            name: `Propeller Blade ${i+1}`,
            description: "Aerodynamic surface that converts engine torque into thrust.",
            material: "Aluminum",
            function: "Generates thrust; pitch angle determines efficiency and load.",
            assemblyOrder: 3,
            connections: ["Blade Root"],
            failureEffect: "Loss of thrust, intense vibration.",
            cascadeFailures: ["Engine mount failure"],
            originalPosition: {x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5, z: 0},
            explodedPosition: {x: Math.cos(angle) * 8, y: Math.sin(angle) * 8, z: 0},
            mesh: bladeMesh
        });

        // Counterweight
        const cwGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const cwMesh = new THREE.Mesh(cwGeo, glowingRed);
        cwMesh.position.set(0.8, 1.0, 0);
        pivot.add(cwMesh);
        
        parts.push({
            name: `Blade ${i+1} Counterweight`,
            description: "Centrifugal weights used to drive the propeller to coarse pitch/feather in absence of oil pressure.",
            material: "Glowing Neon Red",
            function: "Provides a mechanical fail-safe to prevent engine overspeed.",
            assemblyOrder: 4,
            connections: ["Blade Root"],
            failureEffect: "Propeller may fail to fine pitch on oil pressure loss.",
            cascadeFailures: ["Catastrophic engine overspeed"],
            originalPosition: {x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5, z: 0},
            explodedPosition: {x: Math.cos(angle) * 5, y: Math.sin(angle) * 5, z: 2},
            mesh: cwMesh
        });
    }

    // 3. Pitch Change Dome
    const domeGeo = new THREE.SphereGeometry(1.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.rotateX(-Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    domeMesh.position.set(0, 0, 1.5);
    group.add(domeMesh);
    parts.push({
        name: "Pitch Change Dome",
        description: "Housing for the hydraulic piston and cam mechanism.",
        material: "Tinted Glass/Chrome",
        function: "Contains hydraulic fluid and the sliding piston that converts linear motion to blade rotation.",
        assemblyOrder: 5,
        connections: ["Hub Core", "Hydraulic Piston"],
        failureEffect: "Loss of pitch control; propeller defaults to feather or fine pitch.",
        cascadeFailures: ["Engine overspeed", "Aerodynamic drag increase"],
        originalPosition: {x: 0, y: 0, z: 1.5},
        explodedPosition: {x: 0, y: 0, z: 5},
        mesh: domeMesh
    });

    // 4. Hydraulic Piston
    const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 1, 32);
    pistonGeo.rotateX(Math.PI / 2);
    const pistonMesh = new THREE.Mesh(pistonGeo, glowingBlue);
    pistonMesh.position.set(0, 0, 1.0);
    group.add(pistonMesh);
    parts.push({
        name: "Hydraulic Piston",
        description: "Moves axially within the dome under hydraulic pressure from the governor.",
        material: "Glowing Hydraulic Seal (Blue)",
        function: "Drives the pitch change links or gears to rotate the blades.",
        assemblyOrder: 6,
        connections: ["Pitch Change Dome", "Pitch Links"],
        failureEffect: "Inability to change pitch dynamically.",
        cascadeFailures: ["Engine over-torque", "Governor failure"],
        originalPosition: {x: 0, y: 0, z: 1.0},
        explodedPosition: {x: 0, y: 0, z: 7},
        mesh: pistonMesh
    });

    // 5. Constant Speed Governor Base
    const governorGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.5, 32);
    governorGeo.rotateX(Math.PI / 2);
    const governorMesh = new THREE.Mesh(governorGeo, glowingGreen);
    governorMesh.position.set(0, 0, -2.25);
    group.add(governorMesh);
    parts.push({
        name: "Constant Speed Governor Interface",
        description: "Regulates oil pressure to the dome piston based on engine RPM.",
        material: "Glowing Sensor Base (Green)",
        function: "Maintains selected engine RPM by automatically adjusting propeller pitch.",
        assemblyOrder: 7,
        connections: ["Engine Accessory Drive", "Hub Core Oil Transfer"],
        failureEffect: "Propeller behaves as a fixed-pitch propeller.",
        cascadeFailures: ["Sub-optimal cruise efficiency", "High RPM on descent"],
        originalPosition: {x: 0, y: 0, z: -2.25},
        explodedPosition: {x: 0, y: 0, z: -5},
        mesh: governorMesh
    });

    // 6. Transfer Rings / Slip Rings
    const slipRingGeo = new THREE.TorusGeometry(1.2, 0.1, 32, 50);
    const slipRingMesh = new THREE.Mesh(slipRingGeo, neonCyan);
    slipRingMesh.position.set(0, 0, -1.6);
    group.add(slipRingMesh);
    parts.push({
        name: "De-ice Slip Rings",
        description: "Transmits electrical power to the spinning propeller for blade heating.",
        material: "Neon Cyan / Copper",
        function: "Prevents ice accumulation on the propeller blades.",
        assemblyOrder: 8,
        connections: ["Hub Core", "Airframe Electrical System"],
        failureEffect: "Loss of blade de-icing.",
        cascadeFailures: ["Severe imbalance from ice shedding", "Loss of thrust"],
        originalPosition: {x: 0, y: 0, z: -1.6},
        explodedPosition: {x: 0, y: 0, z: -3.5},
        mesh: slipRingMesh
    });

    const description = "The Aero Variable Pitch Propeller Hub is a high-tech mechanism that continuously adjusts the angle of the propeller blades to maintain maximum aerodynamic efficiency across all flight regimes. By utilizing a constant speed governor and hydraulic piston, it regulates engine RPM, acting effectively as an continuously variable transmission (CVT) for the aircraft.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Constant Speed Governor?",
            options: [
                "To control the fuel flow to the engine",
                "To regulate oil pressure to the hub to maintain a selected engine RPM",
                "To provide electrical power to the de-ice slip rings",
                "To feather the propeller during an engine fire"
            ],
            correct: 1,
            explanation: "The constant speed governor automatically varies oil pressure to the propeller hub to adjust pitch and maintain a constant engine RPM.",
            difficulty: "Medium"
        },
        {
            question: "What happens if hydraulic pressure is lost in a counterweighted aerobatic propeller?",
            options: [
                "The propeller goes to fine pitch",
                "The propeller locks at its current angle",
                "Centrifugal force on the counterweights drives the blades to coarse pitch or feather",
                "The propeller detaches from the hub"
            ],
            correct: 2,
            explanation: "Counterweights use centrifugal force to physically twist the blades towards coarse pitch or feather as a fail-safe against engine overspeed when oil pressure is lost.",
            difficulty: "Hard"
        },
        {
            question: "What component prevents ice accumulation on the propeller blades?",
            options: [
                "Hydraulic Piston",
                "Pitch Change Dome",
                "De-ice Slip Rings",
                "Governor Base"
            ],
            correct: 2,
            explanation: "De-ice slip rings transfer electrical power from the stationary engine to the spinning propeller hub to heat the blade boots.",
            difficulty: "Easy"
        }
    ];

    let targetPitch = 0.5;
    let currentPitch = 0.0;
    
    function animate(time, speed, meshes) {
        group.rotation.z -= 0.1 * speed;

        // Simulate constant speed governor varying the pitch
        targetPitch = 0.3 + Math.sin(time * 0.5) * 0.2;
        currentPitch += (targetPitch - currentPitch) * 0.1;

        bladePivots.forEach(pivot => {
            pivot.rotation.y = currentPitch;
        });

        pistonMesh.position.z = 1.0 + (currentPitch * 1.5);

        glowingBlue.emissiveIntensity = 1.0 + Math.sin(time * 5) * 0.5;
        glowingGreen.emissiveIntensity = 0.8 + Math.cos(time * 3) * 0.2;
        glowingRed.emissiveIntensity = 1.2 + Math.sin(time * 10) * 0.3;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createVariablePitchPropeller() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
