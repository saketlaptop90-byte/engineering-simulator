import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    const tubeLength = 12;
    const segments = 24;
    const tubeRadius = 1.5;
    
    // Meshes reference for animation
    const meshes = {};
    
    // Muscular tube segments (Circular/Longitudinal muscles)
    const muscleGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius + 0.2, tubeLength / segments, 32, 1, true);
    
    // Create custom glowing materials for muscles
    const muscleMaterialBase = new THREE.MeshPhysicalMaterial({
        color: 0x8b0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.8,
        roughness: 0.4,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });
    
    meshes.muscles = [];
    
    for (let i = 0; i < segments; i++) {
        const material = muscleMaterialBase.clone();
        const muscleSegment = new THREE.Mesh(muscleGeometry, material);
        const yPos = (i - segments / 2 + 0.5) * (tubeLength / segments);
        muscleSegment.position.y = yPos;
        muscleSegment.rotation.x = Math.PI / 2;
        group.add(muscleSegment);
        meshes.muscles.push({ mesh: muscleSegment, baseRadius: tubeRadius + 0.2, y: yPos });
        
        parts.push({
            name: `Muscle Ring ${i+1}`,
            description: 'Smooth muscle fibers containing both circular and longitudinal layers responsible for contracting to propel food forward.',
            material: 'Biological Muscle Tissue',
            function: 'Contracts in a coordinated wave to push the bolus.',
            assemblyOrder: i + 1,
            connections: [i > 0 ? `Muscle Ring ${i}` : 'Esophagus', i < segments - 1 ? `Muscle Ring ${i+2}` : 'Stomach'],
            failureEffect: 'Dysmotility or achalasia, leading to blockage.',
            cascadeFailures: ['Bolus stagnation', 'Bacterial overgrowth'],
            originalPosition: { x: 0, y: yPos, z: 0 },
            explodedPosition: { x: (Math.random() - 0.5) * 5, y: yPos, z: (Math.random() - 0.5) * 5 }
        });
    }
    
    // The Bolus
    const bolusGeometry = new THREE.SphereGeometry(tubeRadius * 0.8, 32, 32);
    const bolusMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transmission: 0.5
    });
    
    const bolus = new THREE.Mesh(bolusGeometry, bolusMaterial);
    group.add(bolus);
    meshes.bolus = bolus;
    
    parts.push({
        name: 'Food Bolus',
        description: 'A glowing representation of chewed food mixed with saliva moving through the tract.',
        material: 'Organic Matter (Glowing)',
        function: 'To be transported towards the stomach for further digestion.',
        assemblyOrder: segments + 1,
        connections: ['Digestive Tract'],
        failureEffect: 'Impacted bolus causing obstruction.',
        cascadeFailures: ['Tissue necrosis', 'Perforation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });
    
    // Inner mucosal lining (glass-like tube)
    const liningGeometry = new THREE.CylinderGeometry(tubeRadius - 0.1, tubeRadius - 0.1, tubeLength, 32, 64, true);
    const lining = new THREE.Mesh(liningGeometry, glass);
    lining.rotation.x = Math.PI / 2;
    group.add(lining);
    
    parts.push({
        name: 'Mucosal Lining',
        description: 'The inner protective lining of the digestive tract, secreting mucus for lubrication.',
        material: 'Biological Glass/Mucus',
        function: 'Protects muscle layers and lubricates bolus passage.',
        assemblyOrder: segments + 2,
        connections: ['Muscle Rings'],
        failureEffect: 'Ulceration and friction.',
        cascadeFailures: ['Bleeding', 'Inflammation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });
    
    // Enteric Nervous System network (glowing wires around the tube)
    const ensGroup = new THREE.Group();
    const ensMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    for (let i = 0; i < 5; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3((tubeRadius + 0.4) * Math.cos(i), tubeLength/2, (tubeRadius + 0.4) * Math.sin(i)),
            new THREE.Vector3((tubeRadius + 0.6) * Math.cos(i + 1), 0, (tubeRadius + 0.6) * Math.sin(i + 1)),
            new THREE.Vector3((tubeRadius + 0.4) * Math.cos(i + 2), -tubeLength/2, (tubeRadius + 0.4) * Math.sin(i + 2))
        ]);
        const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const nerve = new THREE.Mesh(tubeGeom, ensMaterial);
        ensGroup.add(nerve);
    }
    ensGroup.rotation.x = Math.PI / 2;
    group.add(ensGroup);
    meshes.ens = ensGroup;
    
    parts.push({
        name: 'Enteric Nervous System (ENS)',
        description: 'The intrinsic nervous network that directly controls the gastrointestinal system.',
        material: 'Neon Nerve Fibers',
        function: 'Coordinates the complex sequential contractions of peristalsis independently of the brain.',
        assemblyOrder: segments + 3,
        connections: ['Muscle Rings'],
        failureEffect: 'Uncoordinated contractions or paralysis (e.g., Hirschsprung disease).',
        cascadeFailures: ['Severe obstruction', 'Toxic megacolon'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 5 }
    });

    const description = "An advanced simulation of Gastrointestinal Peristalsis, demonstrating the wave-like muscle contractions that propel a glowing food bolus through the digestive tract. It highlights the coordinated effort of circular and longitudinal muscles driven by the Enteric Nervous System.";

    const quizQuestions = [
        {
            question: "Which nervous system is primarily responsible for coordinating the wave-like contractions of peristalsis independently of the central nervous system?",
            options: ["Sympathetic Nervous System", "Enteric Nervous System", "Somatic Nervous System", "Central Nervous System"],
            correct: 1,
            explanation: "The Enteric Nervous System (ENS) is a vast network of neurons in the wall of the gut that can operate autonomously to control digestion, including peristalsis.",
            difficulty: "Medium"
        },
        {
            question: "During peristalsis, what action occurs immediately behind the food bolus to push it forward?",
            options: ["Circular muscles relax", "Longitudinal muscles contract", "Circular muscles contract", "Both muscles relax completely"],
            correct: 2,
            explanation: "The circular muscles contract behind the bolus to prevent it from moving backward and to push it forward, while longitudinal muscles contract ahead of the bolus to shorten the tract.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the mucosal lining represented by the inner cylinder in the simulation?",
            options: ["To absorb oxygen", "To secrete acid", "To protect muscle layers and provide lubrication via mucus", "To generate electrical impulses"],
            correct: 2,
            explanation: "The mucosa secretes mucus that lubricates the passage of food and protects the underlying tissues from mechanical damage and digestive enzymes.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed = 1) {
        const adjustedTime = time * speed * 2;
        
        // Move bolus along the tube
        // Tube goes from -tubeLength/2 to tubeLength/2 along Z axis (after rotation)
        const bolusZ = ((adjustedTime % tubeLength) - tubeLength / 2);
        meshes.bolus.position.set(0, 0, bolusZ);
        
        // Pulse ENS nerves
        meshes.ens.children.forEach((child, idx) => {
            child.material.color.setHSL(0.5, 1, 0.5 + Math.sin(time * 5 + idx) * 0.4);
        });

        // Contraction wave matching the bolus
        meshes.muscles.forEach((muscleData, i) => {
            // Calculate distance from bolus to this segment
            const dist = muscleData.y - bolusZ;
            
            // Behind the bolus: contraction (scale down)
            // Ahead of bolus: relaxation (scale normal or slightly larger)
            let scaleX = 1.0;
            let scaleZ = 1.0;
            let emissiveInt = 0.1;
            
            if (dist < 0 && dist > -2.0) {
                // Squeezing behind bolus
                scaleX = 0.7;
                scaleZ = 0.7;
                emissiveInt = 1.0; // Glow brightly when contracting
            } else if (dist > 0 && dist < 1.5) {
                // Expanding to receive bolus
                scaleX = 1.2;
                scaleZ = 1.2;
                emissiveInt = 0.2;
            }
            
            // Smooth transitions
            muscleData.mesh.scale.x += (scaleX - muscleData.mesh.scale.x) * 0.2;
            muscleData.mesh.scale.z += (scaleZ - muscleData.mesh.scale.z) * 0.2;
            
            muscleData.mesh.material.emissiveIntensity = emissiveInt;
            
            // Give it a subtle pulsing base movement
            muscleData.mesh.rotation.y = Math.sin(time * speed + i * 0.2) * 0.1;
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPeristalsisMechanism() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
