import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for visual flair
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 1.2,
        metalness: 0.5,
        roughness: 0.2,
    });
    
    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6,
        metalness: 0.8,
        wireframe: true // Simulating a high-tech mesh/carbon weave look
    });

    // Helper to add a part
    function addPart(mesh, name, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, explX, explY, explZ) {
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            explodedPosition: { x: mesh.position.x + explX, y: mesh.position.y + explY, z: mesh.position.z + explZ }
        });
        
        return mesh;
    }

    // 1. Thigh Bracket (Carbon Fiber)
    const thighGeometry = new THREE.CylinderGeometry(1.2, 1.0, 4, 32);
    const thighMesh = new THREE.Mesh(thighGeometry, carbonFiber);
    thighMesh.position.set(0, 6, 0);
    const thigh = addPart(
        thighMesh,
        "Thigh Bracket",
        "Primary load-bearing structure for the upper leg.",
        "Carbon Fiber",
        "Distributes weight from the user's torso down to the knee joint.",
        1,
        ["Knee Joint", "Hip Actuator"],
        "Leg collapse under load",
        ["Knee Joint overload"],
        0, 3, 0
    );

    // 2. Knee Joint (Chrome & Dark Steel)
    const kneeGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const kneeMesh = new THREE.Mesh(kneeGeometry, chrome);
    kneeMesh.position.set(0, 3.5, 0);
    const knee = addPart(
        kneeMesh,
        "Knee Servo Joint",
        "High-torque motorized articulation node.",
        "Chrome Steel",
        "Provides flexion and extension mirroring the human knee with 10x torque.",
        2,
        ["Thigh Bracket", "Calf Support", "Hydraulic Pistons"],
        "Loss of leg bending capability",
        ["Hydraulic Piston rupture"],
        2, 0, 0
    );

    // 3. Hydraulic Pistons (Neon Blue & Steel)
    const pistonCylGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const pistonMesh = new THREE.Mesh(pistonCylGeometry, darkSteel);
    pistonMesh.position.set(1.5, 4.5, 0);
    pistonMesh.rotation.z = Math.PI / 8;
    const piston = addPart(
        pistonMesh,
        "Main Hydraulic Cylinder",
        "Contains the pressurized fluid for knee actuation.",
        "Dark Steel",
        "Generates the lifting force required for jumping and heavy lifting.",
        3,
        ["Knee Joint", "Thigh Bracket"],
        "Loss of active lifting strength",
        ["Fluid Reservoir drain"],
        3, 2, 0
    );

    const pistonRodGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    const pistonRodMesh = new THREE.Mesh(pistonRodGeometry, neonBlue); // Glowing rod
    pistonRodMesh.position.set(1.2, 2.8, 0);
    pistonRodMesh.rotation.z = Math.PI / 8;
    const pistonRod = addPart(
        pistonRodMesh,
        "Hydraulic Piston Rod",
        "Transmits mechanical force from the cylinder.",
        "Neon Core",
        "Directly actuates the knee hinge.",
        4,
        ["Main Hydraulic Cylinder", "Knee Joint"],
        "Joint locking",
        ["Main Hydraulic Cylinder overpressure"],
        4, 1, 0
    );

    // 4. Calf Support (Aluminum)
    const calfGeometry = new THREE.CylinderGeometry(0.9, 0.7, 4.5, 32);
    const calfMesh = new THREE.Mesh(calfGeometry, aluminum);
    calfMesh.position.set(0, 1, 0);
    const calf = addPart(
        calfMesh,
        "Calf Support Structure",
        "Lower leg structural housing.",
        "Aluminum",
        "Transmits force from the knee down to the ankle mechanism.",
        5,
        ["Knee Joint", "Ankle Joint"],
        "Lower leg buckling",
        ["Ankle Joint misalignment"],
        0, -2, 0
    );

    // 5. Ankle Joint (Dark Steel)
    const ankleGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
    const ankleMesh = new THREE.Mesh(ankleGeometry, darkSteel);
    ankleMesh.position.set(0, -1.5, 0);
    const ankle = addPart(
        ankleMesh,
        "Multi-Axis Ankle",
        "Complex joint mimicking the human ankle.",
        "Dark Steel",
        "Provides stability and adaptation to uneven terrain.",
        6,
        ["Calf Support", "Foot Plate"],
        "Loss of balance",
        ["Gyroscope disorientation"],
        0, -4, 2
    );

    // 6. Foot Plate & Shock Absorbers (Rubber & Neon Orange)
    const footGeometry = new THREE.BoxGeometry(2, 0.4, 4);
    const footMesh = new THREE.Mesh(footGeometry, rubber);
    footMesh.position.set(0, -2.2, 1);
    const foot = addPart(
        footMesh,
        "Shock-Absorbing Foot Plate",
        "Ground contact surface with integrated dampening.",
        "Rubber",
        "Absorbs impact from landing and walking.",
        7,
        ["Ankle Joint"],
        "Increased impact stress on joints",
        ["Thigh Bracket microfractures", "Knee Joint wear"],
        0, -5, 3
    );

    const heelCoreGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const heelCoreMesh = new THREE.Mesh(heelCoreGeometry, neonOrange);
    heelCoreMesh.position.set(0, -2, -0.5);
    const heel = addPart(
        heelCoreMesh,
        "Heel Energy Recycler",
        "Kinetic energy recovery system.",
        "Neon Orange Emitter",
        "Recovers energy from footfalls to recharge the internal battery.",
        8,
        ["Foot Plate", "Power Router"],
        "Reduced operating time",
        ["Battery drain"],
        0, -5, -2
    );

    const description = "The Bionics Exoskeleton Leg is a state-of-the-art lower-body augmentation system. Engineered with carbon fiber structural components, high-torque chrome servos, and neon-infused hydraulic pistons, it multiplies the user's natural strength and endurance. The built-in kinetic energy recycler in the heel ensures extended operational time even in demanding environments.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Heel Energy Recycler?",
            options: [
                "To provide decorative lighting",
                "To recover kinetic energy from footfalls and recharge the battery",
                "To act as a secondary hydraulic pump",
                "To increase walking speed directly"
            ],
            correct: 1,
            explanation: "The Heel Energy Recycler captures the kinetic energy generated when the heel strikes the ground, converting it into electrical power to extend the battery life of the exoskeleton.",
            difficulty: "Medium"
        },
        {
            question: "Which component is primarily responsible for transmitting force from the knee down to the ankle?",
            options: [
                "Thigh Bracket",
                "Calf Support Structure",
                "Hydraulic Piston Rod",
                "Foot Plate"
            ],
            correct: 1,
            explanation: "The Calf Support Structure, made of aluminum, acts as the primary load-bearing path between the Knee Joint and the Ankle Joint.",
            difficulty: "Easy"
        },
        {
            question: "If the Hydraulic Piston Rod locks up, which cascade failure is most likely?",
            options: [
                "Heel Energy Recycler overload",
                "Main Hydraulic Cylinder overpressure",
                "Ankle Joint misalignment",
                "Foot Plate detachment"
            ],
            correct: 1,
            explanation: "If the piston rod locks, the main hydraulic cylinder continues to build up fluid pressure but cannot release it, leading to a dangerous overpressure scenario.",
            difficulty: "Hard"
        }
    ];

    // Animation variables
    let timeAcc = 0;

    function animate(time, speed, meshes) {
        timeAcc += speed * 0.05;
        
        const thighM = meshes.find(m => m.name === "Thigh Bracket");
        const kneeM = meshes.find(m => m.name === "Knee Servo Joint");
        const pistonCylM = meshes.find(m => m.name === "Main Hydraulic Cylinder");
        const pistonRodM = meshes.find(m => m.name === "Hydraulic Piston Rod");
        const calfM = meshes.find(m => m.name === "Calf Support Structure");
        const ankleM = meshes.find(m => m.name === "Multi-Axis Ankle");
        const footM = meshes.find(m => m.name === "Shock-Absorbing Foot Plate");
        const heelM = meshes.find(m => m.name === "Heel Energy Recycler");

        // Walking simulation
        const legAngle = Math.sin(timeAcc) * 0.5; 
        const kneeAngle = Math.abs(Math.sin(timeAcc + Math.PI/2)) * 0.8; 

        if (thighM) {
            thighM.rotation.x = legAngle;
        }

        if (calfM && kneeM) {
            kneeM.rotation.x = legAngle;
            calfM.position.y = kneeM.position.y - 2.5 * Math.cos(kneeAngle);
            calfM.position.z = kneeM.position.z - 2.5 * Math.sin(kneeAngle);
            calfM.rotation.x = legAngle - kneeAngle;
        }

        if (pistonRodM && pistonCylM) {
            // Piston rod extension and glowing pulsing
            pistonRodM.position.y = pistonRodM.userData.origY || pistonRodM.position.y;
            if(!pistonRodM.userData.origY) pistonRodM.userData.origY = pistonRodM.position.y;
            
            const pistonExt = Math.sin(timeAcc) * 0.3;
            pistonRodM.position.x = 1.2 + pistonExt * 0.2;
            pistonRodM.position.y = 2.8 - pistonExt * 0.5;

            // Pulse glowing intensity based on movement speed (simulated by extension derivative)
            const material = pistonRodM.material;
            if (material && material.emissiveIntensity !== undefined) {
                material.emissiveIntensity = 0.8 + Math.abs(Math.cos(timeAcc)) * 1.5;
            }
        }
        
        if (heelM) {
            // Heel recycler pulsing
            const heelMat = heelM.material;
            if (heelMat && heelMat.emissiveIntensity !== undefined) {
                // High intensity on "impact" (when legAngle is low)
                const impact = Math.max(0, -Math.sin(timeAcc));
                heelMat.emissiveIntensity = 1.0 + impact * 3.0;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBionicLeg() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
