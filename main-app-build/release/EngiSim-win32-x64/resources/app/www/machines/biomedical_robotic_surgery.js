import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        emissive: 0xff0022,
        emissiveIntensity: 0.6,
        metalness: 0.1,
        roughness: 0.2,
    });

    const neonGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.1
    });

    const sterileWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.4,
    });

    // 1. Central Pillar (Base)
    const baseGeo = new THREE.CylinderGeometry(1.5, 2, 4, 32);
    const baseMesh = new THREE.Mesh(baseGeo, sterileWhite);
    baseMesh.position.set(0, 2, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Patient Cart Base',
        description: 'The main central support system that houses the power units and computational core for the surgical arms.',
        material: 'Sterile Plastic & Steel',
        function: 'Provides stability, power distribution, and central data processing.',
        assemblyOrder: 1,
        connections: ['Power Supply', 'Surgeon Console', 'Arm Mounts'],
        failureEffect: 'Complete system shutdown. Arms freeze in place.',
        cascadeFailures: ['All Surgical Arms', 'Vision System', 'Endowrist Control'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Optical Tower / Vision System
    const visionGeo = new THREE.BoxGeometry(1, 2, 1);
    const visionMesh = new THREE.Mesh(visionGeo, chrome);
    visionMesh.position.set(0, 5, 0);
    group.add(visionMesh);
    
    // Glowing lenses
    const lensGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 32);
    const lensMesh = new THREE.Mesh(lensGeo, neonBlue);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 5.5, 0.5);
    group.add(lensMesh);
    visionMesh.add(lensMesh);

    parts.push({
        name: '3D High-Definition Vision System',
        description: 'Stereoscopic endoscope providing highly magnified, 3D high-definition views of the surgical area.',
        material: 'Chrome & Fiber Optics',
        function: 'Transmits real-time high-definition video to the surgeon console.',
        assemblyOrder: 2,
        connections: ['Patient Cart Base', 'Fiber Optic Cable'],
        failureEffect: 'Loss of visual feed to surgeon console.',
        cascadeFailures: ['Surgeon Navigation'],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: visionMesh
    });

    // 3. Robotic Arms (4 arms)
    const armGeometries = [
        new THREE.CylinderGeometry(0.2, 0.2, 3, 16), // Upper arm
        new THREE.CylinderGeometry(0.15, 0.15, 2.5, 16) // Lower arm
    ];
    
    const armConfigs = [
        { x: -1.5, z: -1, color: neonBlue, type: 'Camera' },
        { x: 1.5, z: -1, color: neonRed, type: 'Scalpel' },
        { x: -2.5, z: 1, color: neonGreen, type: 'Forceps' },
        { x: 2.5, z: 1, color: neonGreen, type: 'Needle Driver' }
    ];

    const armMeshes = [];

    armConfigs.forEach((config, index) => {
        const armGroup = new THREE.Group();
        
        // Upper arm joint
        const joint1Geo = new THREE.SphereGeometry(0.4, 32, 32);
        const joint1Mesh = new THREE.Mesh(joint1Geo, darkSteel);
        joint1Mesh.position.set(config.x, 4.5, config.z);
        
        // Upper arm
        const upperArm = new THREE.Mesh(armGeometries[0], sterileWhite);
        upperArm.position.set(0, -1.5, 0);
        joint1Mesh.add(upperArm);
        
        // Elbow joint
        const joint2Geo = new THREE.SphereGeometry(0.3, 32, 32);
        const joint2Mesh = new THREE.Mesh(joint2Geo, darkSteel);
        joint2Mesh.position.set(0, -1.5, 0);
        upperArm.add(joint2Mesh);
        
        // Lower arm
        const lowerArm = new THREE.Mesh(armGeometries[1], sterileWhite);
        lowerArm.position.set(0, -1.25, 0);
        joint2Mesh.add(lowerArm);

        // Tool / Endowrist
        const toolGeo = new THREE.ConeGeometry(0.1, 0.5, 16);
        const toolMesh = new THREE.Mesh(toolGeo, config.color);
        toolMesh.rotation.x = Math.PI;
        toolMesh.position.set(0, -1.25, 0);
        lowerArm.add(toolMesh);

        group.add(joint1Mesh);
        armGroup.add(joint1Mesh);
        armMeshes.push({ base: joint1Mesh, lower: joint2Mesh, tool: toolMesh, type: config.type, initX: config.x, initZ: config.z });

        parts.push({
            name: `Surgical Arm ${index + 1} - ${config.type}`,
            description: `Articulated robotic arm equipped with EndoWrist instruments, offering 7 degrees of freedom. Function: ${config.type}.`,
            material: 'Aluminum & Sterile Plastic',
            function: 'Translates surgeon\'s hand movements into precise micro-movements inside the patient.',
            assemblyOrder: 3 + index,
            connections: ['Patient Cart Base', 'EndoWrist Instruments'],
            failureEffect: `Loss of ${config.type} function. Arm safely locks in position.`,
            cascadeFailures: [],
            originalPosition: { x: config.x, y: 4.5, z: config.z },
            explodedPosition: { x: config.x * 3, y: 6, z: config.z * 3 },
            mesh: armGroup
        });
    });

    // 4. Data Cables / Fiber Optics
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, -1),
        new THREE.Vector3(0, 2, -2),
        new THREE.Vector3(0, 0, -2)
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 20, 0.1, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, neonBlue);
    group.add(cableMesh);
    
    parts.push({
        name: 'Fiber Optic Data Core',
        description: 'High-bandwidth, zero-latency fiber optic lines connecting the Patient Cart to the Surgeon Console.',
        material: 'Fiber Optics & Silicone',
        function: 'Transmits control signals and 3D video streams instantaneously.',
        assemblyOrder: 7,
        connections: ['Surgeon Console', 'Optical Tower'],
        failureEffect: 'Disconnect between console and cart. Surgery halts automatically.',
        cascadeFailures: ['All Surgical Operations'],
        originalPosition: { x: 0, y: 2.5, z: -1.5 },
        explodedPosition: { x: 0, y: 2.5, z: -5 },
        mesh: cableMesh
    });

    const description = "The Advanced Biomedical Robotic Surgery System (similar to the da Vinci surgical system) translates a surgeon's hand movements into smaller, more precise movements of tiny instruments inside the patient's body. It features 3D high-definition vision and EndoWrist instruments that bend and rotate far greater than the human hand.";

    const quizQuestions = [
        {
            question: "What is the primary advantage of the EndoWrist instruments on the robotic arms?",
            options: [
                "They generate their own power using kinetic energy.",
                "They offer 7 degrees of freedom, exceeding the range of motion of a human hand.",
                "They are completely autonomous and require no human input.",
                "They are made of biological materials that merge with the patient."
            ],
            correct: 1,
            explanation: "EndoWrist instruments are designed to mimic the dexterity of the human hand and wrist, providing 7 degrees of freedom which allows for immense precision in tight surgical spaces.",
            difficulty: "Medium"
        },
        {
            question: "Why is a zero-latency fiber optic data core critical for this system?",
            options: [
                "To reduce the electricity bill of the hospital.",
                "To ensure the robotic arms move simultaneously with the surgeon's hands without delay.",
                "To stream surgical procedures directly to social media.",
                "To keep the internal components of the robot cool."
            ],
            correct: 1,
            explanation: "Any delay (latency) between the surgeon's hand movement at the console and the robotic arm's movement could lead to fatal errors during delicate surgical procedures.",
            difficulty: "Hard"
        },
        {
            question: "What happens if one of the surgical arms experiences a catastrophic failure?",
            options: [
                "The robot self-destructs.",
                "The other arms speed up to compensate.",
                "The arm safely locks in position to prevent injury to the patient.",
                "The arm detaches and falls away from the operating table."
            ],
            correct: 2,
            explanation: "In medical robotics, fail-safes are critical. A malfunctioning arm must immediately lock into place to avoid making unintended incisions or causing trauma.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed * 0.001;
        
        // Gentle breathing/idling motion for arms
        armMeshes.forEach((arm, i) => {
            arm.base.rotation.z = Math.sin(t + i) * 0.1;
            arm.base.rotation.x = Math.sin(t * 0.8 + i) * 0.05;
            arm.lower.rotation.x = Math.sin(t * 1.5 + i) * 0.2;
            
            if(arm.type === 'Scalpel' || arm.type === 'Camera') {
                arm.tool.rotation.y = t * 2;
                arm.tool.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.3;
            }
        });

        if(lensMesh && lensMesh.material) {
             lensMesh.material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRoboticSurgery() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
