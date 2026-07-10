import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // High-tech neon/glowing materials
    const boneMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe0e0e0, 
        roughness: 0.6,
        metalness: 0.3,
        emissive: 0x111111
    });
    
    const jointMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x008888,
        emissiveIntensity: 0.6,
        transmission: 0.9,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        clearcoat: 1.0
    });
    
    const cartilageMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x005522,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        transmission: 0.7,
        clearcoat: 0.8
    });

    const highlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    // Build Skeleton - A biomechanical leg showing ball-and-socket (hip) and hinge (knee) joints
    
    // Pelvis (Base)
    const pelvisGeom = new THREE.BoxGeometry(4, 2, 2);
    const pelvis = new THREE.Mesh(pelvisGeom, darkSteel);
    pelvis.position.set(0, 10, 0);
    group.add(pelvis);
    
    // Femur Group (attached to pelvis)
    const femurGroup = new THREE.Group();
    femurGroup.position.set(2, 10, 0); // Offset from center of pelvis
    group.add(femurGroup);

    // Femur Head (Ball of the hip joint)
    const femurHeadGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const femurHead = new THREE.Mesh(femurHeadGeom, jointMaterial);
    // Add a high-tech wireframe shell
    const femurHeadShell = new THREE.Mesh(femurHeadGeom, highlightMaterial);
    femurHeadShell.scale.set(1.1, 1.1, 1.1);
    femurHead.add(femurHeadShell);
    femurGroup.add(femurHead);
    
    // Femur Shaft
    const femurGeom = new THREE.CylinderGeometry(0.5, 0.4, 6);
    const femur = new THREE.Mesh(femurGeom, boneMaterial);
    femurGeom.translate(0, -3, 0); // Pivot at the top
    femurGroup.add(femur);
    
    // Knee joint (Hinge)
    const kneeGeom = new THREE.CylinderGeometry(0.7, 0.7, 1.4);
    kneeGeom.rotateZ(Math.PI / 2);
    const knee = new THREE.Mesh(kneeGeom, cartilageMaterial);
    knee.position.set(0, -6, 0); // Position at bottom of femur
    femurGroup.add(knee);

    // Tibia Group (attached to knee)
    const tibiaGroup = new THREE.Group();
    tibiaGroup.position.set(0, -6, 0);
    femurGroup.add(tibiaGroup);
    
    // Tibia Bone
    const tibiaGeom = new THREE.CylinderGeometry(0.4, 0.3, 5);
    const tibia = new THREE.Mesh(tibiaGeom, boneMaterial);
    tibiaGeom.translate(0, -2.5, 0); // Pivot at top
    tibiaGroup.add(tibia);

    // Parts data for UI/interaction
    parts.push({
        name: 'Biomechanical Pelvis',
        description: 'Forms the robust socket of the ball-and-socket hip joint, anchoring the leg and allowing multi-axial movement.',
        material: 'darkSteel',
        function: 'Base structural support and core articulation point.',
        assemblyOrder: 1,
        connections: ['Femur Head'],
        failureEffect: 'Total loss of structural integrity and hip stability.',
        cascadeFailures: ['Femur', 'Tibia'],
        originalPosition: {x: 0, y: 10, z: 0},
        explodedPosition: {x: -3, y: 12, z: 0}
    });

    parts.push({
        name: 'Femur Head (Ball Joint)',
        description: 'The spherical component of the hip joint. Enables complex rotation, flexion, extension, abduction, and adduction.',
        material: 'Neon Joint Material',
        function: 'Multi-axis rotational articulation.',
        assemblyOrder: 2,
        connections: ['Pelvis', 'Femur Shaft'],
        failureEffect: 'Dislocation of the hip, restricted multidirectional movement.',
        cascadeFailures: ['Femur Shaft', 'Knee'],
        originalPosition: {x: 2, y: 10, z: 0},
        explodedPosition: {x: 5, y: 13, z: 0}
    });
    
    parts.push({
        name: 'Femur Shaft',
        description: 'The primary load-bearing structural beam transferring force from the hip joint to the knee.',
        material: 'Synthetic Bone Material',
        function: 'Load distribution and spatial extension.',
        assemblyOrder: 3,
        connections: ['Femur Head', 'Knee'],
        failureEffect: 'Catastrophic loss of load-bearing capability.',
        cascadeFailures: ['Knee', 'Tibia'],
        originalPosition: {x: 2, y: 7, z: 0},
        explodedPosition: {x: 6, y: 7, z: 0}
    });
    
    parts.push({
        name: 'Knee Articulation (Hinge)',
        description: 'A specialized biomechanical hinge joint restricting movement to primarily one plane (flexion and extension).',
        material: 'Glowing Cartilage Material',
        function: 'Uni-axial movement and dynamic shock absorption.',
        assemblyOrder: 4,
        connections: ['Femur Shaft', 'Tibia'],
        failureEffect: 'Inability to flex or extend the lower limb, causing rigid locomotion.',
        cascadeFailures: ['Tibia'],
        originalPosition: {x: 2, y: 4, z: 0},
        explodedPosition: {x: 7, y: 4, z: 0}
    });

    parts.push({
        name: 'Tibia Shaft',
        description: 'The secondary lower limb strut, completing the kinetic chain from the knee down to the base.',
        material: 'Synthetic Bone Material',
        function: 'Lower extremity force transfer.',
        assemblyOrder: 5,
        connections: ['Knee'],
        failureEffect: 'Collapse of lower limb structure.',
        cascadeFailures: [],
        originalPosition: {x: 2, y: 1.5, z: 0},
        explodedPosition: {x: 8, y: 0, z: 0}
    });

    const description = "A high-tech biomechanical simulation of an Anatomy Skeleton focusing on the leg structure. This model vividly demonstrates the complex engineering of biological joints, contrasting the multi-axial freedom of the hip's ball-and-socket mechanism with the robust, uni-axial motion of the knee's hinge mechanism. Enhanced with glowing synthetic cartilage and reinforced materials.";

    const quizQuestions = [
        {
            question: "What mechanical engineering joint is biologically analogous to the human hip joint modeled here?",
            options: ["Hinge joint", "Ball-and-socket joint", "Pivot joint", "Universal joint"],
            correct: 1,
            explanation: "The hip functions as a ball-and-socket joint, which provides high mobility across multiple axes including rotation, flexion, and abduction.",
            difficulty: "easy"
        },
        {
            question: "Based on this simulation, what is the primary kinematic restriction of the knee joint?",
            options: ["It prevents any load bearing", "It allows full 360-degree rotation", "It restricts movement primarily to one plane (flexion/extension)", "It locks the leg permanently straight"],
            correct: 2,
            explanation: "The knee primarily acts as a hinge joint, constraining motion to one main axis to allow bending (flexion) and straightening (extension) while maintaining stability.",
            difficulty: "medium"
        },
        {
            question: "In biomechanical systems, what functional purpose does the specialized cartilage (glowing green in this model) serve at articulation points?",
            options: ["Generating kinetic energy for movement", "Providing rigid, immovable structural support", "Absorbing shock impacts and minimizing frictional wear", "Sensing mechanical strain and temperature"],
            correct: 2,
            explanation: "Cartilage acts as a critical interface material that absorbs mechanical shocks and provides a low-friction surface to prevent rapid degradation of the structural components.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Complex biomechanical walking/striding cycle
        const walkCycle = time * speed * 2;
        
        // Hip joint (Ball and socket) allows multi-axial movement
        // Flexion/Extension (Forward/Back)
        femurGroup.rotation.z = Math.sin(walkCycle) * 0.6; 
        // Abduction/Adduction (Slight side-to-side)
        femurGroup.rotation.x = Math.sin(walkCycle * 0.5) * 0.15;
        // Internal/External Rotation
        femurGroup.rotation.y = Math.cos(walkCycle) * 0.1;
        
        // Knee joint (Hinge) allows primarily uni-axial movement (flexion)
        // Knee only bends backwards (negative Z rotation relative to femur)
        // Math.min(0, ...) ensures it doesn't bend forward past straight
        tibiaGroup.rotation.z = Math.min(0, Math.sin(walkCycle - Math.PI/2)) * 1.2; 
        
        // Animate the neon materials to pulse
        const pulse = (Math.sin(time * 3) + 1) / 2; // 0 to 1
        jointMaterial.emissiveIntensity = 0.4 + (pulse * 0.4);
        cartilageMaterial.opacity = 0.6 + (pulse * 0.3);
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAnatomySkeleton() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
