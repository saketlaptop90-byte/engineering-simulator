import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Material
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Steering Column (Pinion Shaft)
    const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
    const shaft = new THREE.Mesh(shaftGeometry, chrome);
    shaft.rotation.z = Math.PI / 4;
    shaft.position.set(-2, 3, 0);
    group.add(shaft);

    parts.push({
        name: "Steering Column",
        description: "Transmits rotational input from the steering wheel to the pinion gear.",
        material: "Chrome",
        function: "Transmits torque from driver to steering mechanism.",
        assemblyOrder: 1,
        connections: ["Pinion Gear"],
        failureEffect: "Loss of steering control.",
        cascadeFailures: ["Complete steering failure"],
        originalPosition: { x: -2, y: 3, z: 0 },
        explodedPosition: { x: -4, y: 5, z: 0 },
        mesh: shaft
    });

    // 2. Pinion Gear
    const pinionGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16);
    const pinion = new THREE.Mesh(pinionGeometry, neonBlue);
    pinion.rotation.z = Math.PI / 4;
    pinion.rotation.x = Math.PI / 2;
    pinion.position.set(-0.5, 1.5, 0);
    group.add(pinion);

    parts.push({
        name: "Pinion Gear",
        description: "A small circular gear connected to the steering column that engages the rack.",
        material: "Neon Blue Steel",
        function: "Converts rotational motion of the steering wheel into linear motion of the rack.",
        assemblyOrder: 2,
        connections: ["Steering Column", "Rack"],
        failureEffect: "Steering slippage or jamming.",
        cascadeFailures: ["Rack tooth damage"],
        originalPosition: { x: -0.5, y: 1.5, z: 0 },
        explodedPosition: { x: -1, y: 3, z: 2 },
        mesh: pinion
    });

    // 3. Rack
    const rackGeometry = new THREE.BoxGeometry(8, 0.5, 0.8);
    const rack = new THREE.Mesh(rackGeometry, darkSteel);
    rack.position.set(0, 1, 0);
    group.add(rack);

    parts.push({
        name: "Rack",
        description: "A linear gear bar with teeth on one side that engages the pinion.",
        material: "Dark Steel",
        function: "Moves linearly left or right to steer the wheels.",
        assemblyOrder: 3,
        connections: ["Pinion Gear", "Tie Rods"],
        failureEffect: "Steering binding or uneven turning.",
        cascadeFailures: ["Pinion gear wear", "Tie rod bending"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -1, z: -2 },
        mesh: rack
    });

    // 4. Tie Rod Left
    const tieRodGeom = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    const tieRodLeft = new THREE.Mesh(tieRodGeom, steel);
    tieRodLeft.rotation.z = Math.PI / 2;
    tieRodLeft.position.set(-5.5, 1, 0);
    group.add(tieRodLeft);

    parts.push({
        name: "Left Tie Rod",
        description: "Connects the end of the rack to the left steering knuckle.",
        material: "Steel",
        function: "Pushes or pulls the wheel to turn.",
        assemblyOrder: 4,
        connections: ["Rack", "Left Wheel Knuckle"],
        failureEffect: "Loss of left wheel alignment.",
        cascadeFailures: ["Tire wear", "Steering pull"],
        originalPosition: { x: -5.5, y: 1, z: 0 },
        explodedPosition: { x: -8, y: 1, z: 0 },
        mesh: tieRodLeft
    });

    // 5. Tie Rod Right
    const tieRodRight = new THREE.Mesh(tieRodGeom, steel);
    tieRodRight.rotation.z = Math.PI / 2;
    tieRodRight.position.set(5.5, 1, 0);
    group.add(tieRodRight);

    parts.push({
        name: "Right Tie Rod",
        description: "Connects the end of the rack to the right steering knuckle.",
        material: "Steel",
        function: "Pushes or pulls the wheel to turn.",
        assemblyOrder: 5,
        connections: ["Rack", "Right Wheel Knuckle"],
        failureEffect: "Loss of right wheel alignment.",
        cascadeFailures: ["Tire wear", "Steering pull"],
        originalPosition: { x: 5.5, y: 1, z: 0 },
        explodedPosition: { x: 8, y: 1, z: 0 },
        mesh: tieRodRight
    });

    // 6. Rack Housing (Casing)
    const housingGeom = new THREE.CylinderGeometry(0.6, 0.6, 6, 32);
    const housing = new THREE.Mesh(housingGeom, aluminum);
    housing.rotation.z = Math.PI / 2;
    housing.position.set(0, 1, 0);
    housing.material.transparent = true;
    housing.material.opacity = 0.4;
    group.add(housing);

    parts.push({
        name: "Rack Housing",
        description: "Protective casing enclosing the rack and pinion mechanism.",
        material: "Transparent Aluminum",
        function: "Protects internal components and holds lubricating fluid.",
        assemblyOrder: 6,
        connections: ["Chassis"],
        failureEffect: "Fluid leak, dirt ingress.",
        cascadeFailures: ["Premature gear wear", "Steering stiffness"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 3 },
        mesh: housing
    });

    const description = "The rack and pinion is a type of linear actuator that comprises a circular gear (the pinion) engaging a linear gear (the rack). In an automotive application, it converts the rotational motion of the steering wheel into the linear motion needed to turn the wheels.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pinion Gear?",
            options: [
                "To connect the tie rods to the wheels.",
                "To convert linear motion into rotational motion.",
                "To convert rotational motion from the steering column into linear motion on the rack.",
                "To hold steering fluid."
            ],
            correct: 2,
            explanation: "The pinion gear rotates with the steering column and its teeth engage the rack, pushing it left or right.",
            difficulty: "Easy"
        },
        {
            question: "Which component connects the rack directly to the steering knuckle?",
            options: [
                "Pinion Gear",
                "Tie Rod",
                "Steering Column",
                "Housing"
            ],
            correct: 1,
            explanation: "Tie rods transmit the linear motion of the rack directly to the wheels' steering knuckles.",
            difficulty: "Medium"
        },
        {
            question: "What would likely happen if the rack housing seal fails?",
            options: [
                "The steering wheel would rotate indefinitely.",
                "The wheels would fall off.",
                "Dirt and moisture could enter, and lubricant could leak out, leading to gear wear and stiff steering.",
                "The pinion would instantly snap."
            ],
            correct: 2,
            explanation: "The housing protects the moving parts and holds grease/fluid. A failure allows contamination and fluid loss.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // time is continuous time, speed is user-controlled multiplier (can be negative)
        const cycle = (time * speed * 0.5) % (Math.PI * 2);
        
        // Oscillating back-and-forth steering motion
        const steerAngle = Math.sin(cycle) * Math.PI / 4; // Max rotation angle for pinion
        
        // Pinion rotates
        const pinionMesh = parts.find(p => p.name === "Pinion Gear").mesh;
        if(pinionMesh) pinionMesh.rotation.y = steerAngle;
        
        const shaftMesh = parts.find(p => p.name === "Steering Column").mesh;
        if(shaftMesh) shaftMesh.rotation.y = steerAngle;

        // Rack moves linearly based on pinion rotation
        // Circumference of pinion = 2 * PI * r = 2 * PI * 0.6 ≈ 3.77
        // Movement = (steerAngle / (2*PI)) * Circumference = steerAngle * 0.6
        const rackMovement = steerAngle * 0.6;
        
        const rackMesh = parts.find(p => p.name === "Rack").mesh;
        if(rackMesh) {
            rackMesh.position.x = rackMesh.userData.baseX !== undefined ? rackMesh.userData.baseX + rackMovement : rackMovement;
            if(rackMesh.userData.baseX === undefined) rackMesh.userData.baseX = rackMesh.position.x;
        }
        
        const tieLeftMesh = parts.find(p => p.name === "Left Tie Rod").mesh;
        if(tieLeftMesh) tieLeftMesh.position.x = parts.find(p => p.name === "Left Tie Rod").originalPosition.x + rackMovement;
        
        const tieRightMesh = parts.find(p => p.name === "Right Tie Rod").mesh;
        if(tieRightMesh) tieRightMesh.position.x = parts.find(p => p.name === "Right Tie Rod").originalPosition.x + rackMovement;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRackAndPinion() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
