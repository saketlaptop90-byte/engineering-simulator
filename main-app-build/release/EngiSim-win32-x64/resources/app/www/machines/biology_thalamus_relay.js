import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowMaterialRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const glowMaterialBlue = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const glowMaterialGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const dataStreamMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.2,
        wireframe: true,
    });

    // 1. Central Thalamic Core (Switchboard)
    const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeometry, glass);
    coreMesh.name = 'thalamic_core';
    group.add(coreMesh);
    parts.push({
        name: 'Thalamic Core',
        description: 'The central switchboard of the brain, routing sensory information.',
        material: 'Glass / Chrome',
        function: 'Receives sensory inputs and projects them to the appropriate areas of the cerebral cortex.',
        assemblyOrder: 1,
        connections: ['sensory_inputs', 'cortical_outputs'],
        failureEffect: 'Loss of sensory perception and severe sleep disorders.',
        cascadeFailures: ['cortical_outputs', 'consciousness_regulation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 2. Sensory Data Streams (Input)
    const streamGeo = new THREE.TorusGeometry(3, 0.2, 16, 100);
    const streamMesh = new THREE.Mesh(streamGeo, dataStreamMaterial);
    streamMesh.rotation.x = Math.PI / 2;
    streamMesh.name = 'sensory_streams';
    group.add(streamMesh);
    parts.push({
        name: 'Sensory Data Streams',
        description: 'Afferent neural pathways bringing information from the body.',
        material: 'Neon Wireframe',
        function: 'Transmits visual, auditory, and somatosensory data to the thalamus.',
        assemblyOrder: 2,
        connections: ['thalamic_core'],
        failureEffect: 'Sensory deprivation or altered perception.',
        cascadeFailures: ['thalamic_core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 3. LGN (Lateral Geniculate Nucleus) - Visual Relay
    const lgnGeo = new THREE.CapsuleGeometry(0.5, 1, 16, 16);
    const lgnMesh1 = new THREE.Mesh(lgnGeo, glowMaterialRed);
    lgnMesh1.position.set(1.5, -0.5, 1.5);
    lgnMesh1.lookAt(new THREE.Vector3(0,0,0));
    lgnMesh1.name = 'lgn_right';
    group.add(lgnMesh1);
    
    const lgnMesh2 = new THREE.Mesh(lgnGeo, glowMaterialRed);
    lgnMesh2.position.set(-1.5, -0.5, 1.5);
    lgnMesh2.lookAt(new THREE.Vector3(0,0,0));
    lgnMesh2.name = 'lgn_left';
    group.add(lgnMesh2);

    parts.push({
        name: 'Lateral Geniculate Nucleus (LGN)',
        description: 'Visual relay center of the thalamus.',
        material: 'Glowing Red Plasma',
        function: 'Processes visual information from the retina and routes it to the visual cortex.',
        assemblyOrder: 3,
        connections: ['thalamic_core', 'visual_cortex_outputs'],
        failureEffect: 'Cortical blindness or visual field deficits.',
        cascadeFailures: ['visual_cortex_outputs'],
        originalPosition: { x: 1.5, y: -0.5, z: 1.5 },
        explodedPosition: { x: 4, y: -2, z: 4 }
    });

    // 4. MGN (Medial Geniculate Nucleus) - Auditory Relay
    const mgnGeo = new THREE.CapsuleGeometry(0.4, 0.8, 16, 16);
    const mgnMesh1 = new THREE.Mesh(mgnGeo, glowMaterialBlue);
    mgnMesh1.position.set(1.2, -0.8, -1.2);
    mgnMesh1.lookAt(new THREE.Vector3(0,0,0));
    mgnMesh1.name = 'mgn_right';
    group.add(mgnMesh1);

    const mgnMesh2 = new THREE.Mesh(mgnGeo, glowMaterialBlue);
    mgnMesh2.position.set(-1.2, -0.8, -1.2);
    mgnMesh2.lookAt(new THREE.Vector3(0,0,0));
    mgnMesh2.name = 'mgn_left';
    group.add(mgnMesh2);

    parts.push({
        name: 'Medial Geniculate Nucleus (MGN)',
        description: 'Auditory relay center of the thalamus.',
        material: 'Glowing Blue Plasma',
        function: 'Relays auditory information from the inferior colliculus to the auditory cortex.',
        assemblyOrder: 4,
        connections: ['thalamic_core', 'auditory_cortex_outputs'],
        failureEffect: 'Hearing impairments and difficulties in sound localization.',
        cascadeFailures: ['auditory_cortex_outputs'],
        originalPosition: { x: 1.2, y: -0.8, z: -1.2 },
        explodedPosition: { x: 3, y: -3, z: -3 }
    });
    
    // 5. Cortical Output Radiations
    const radiationGeo = new THREE.CylinderGeometry(0.1, 0.5, 4, 16);
    const radiationGroup = new THREE.Group();
    radiationGroup.name = 'cortical_radiations';
    
    for(let i=0; i<8; i++) {
        const rad = new THREE.Mesh(radiationGeo, glowMaterialGreen);
        rad.position.y = 2;
        rad.rotation.z = (Math.PI / 4) * i;
        rad.rotation.x = Math.PI / 4;
        radiationGroup.add(rad);
    }
    group.add(radiationGroup);

    parts.push({
        name: 'Thalamocortical Radiations',
        description: 'Nerve fibers connecting the thalamus to the cerebral cortex.',
        material: 'Glowing Green Connectors',
        function: 'Carries integrated sensory and motor signals to specific cortical regions.',
        assemblyOrder: 5,
        connections: ['thalamic_core', 'lgn_right', 'mgn_right'],
        failureEffect: 'Disconnection syndrome, global cognitive and sensory impairment.',
        cascadeFailures: ['all_cortical_areas'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    const description = "The Thalamus is a highly interconnected mass of gray matter situated deep in the forebrain. Often referred to as the brain's 'relay station', it acts as a central hub, receiving sensory and motor inputs and routing them to the cerebral cortex. This high-tech cybernetic visualization maps out distinct nuclei like the LGN and MGN as discrete glowing nodes routing specific data streams.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Thalamus?",
            options: [
                "Regulating heart rate and breathing",
                "Acting as a sensory relay station to the cerebral cortex",
                "Storing long-term episodic memories",
                "Controlling fine motor coordination"
            ],
            correct: 1,
            explanation: "The thalamus primarily acts as a relay station, filtering and directing sensory and motor signals to the appropriate areas of the cerebral cortex.",
            difficulty: "Medium"
        },
        {
            question: "Which sensory modality does NOT pass through the thalamus before reaching the cortex?",
            options: [
                "Vision",
                "Audition (Hearing)",
                "Olfaction (Smell)",
                "Somatosensation (Touch)"
            ],
            correct: 2,
            explanation: "Olfactory information bypasses the thalamus and goes directly to the olfactory cortex and other areas like the amygdala.",
            difficulty: "Hard"
        },
        {
            question: "Which thalamic nucleus is responsible for routing visual information?",
            options: [
                "Medial Geniculate Nucleus (MGN)",
                "Lateral Geniculate Nucleus (LGN)",
                "Ventral Posterolateral Nucleus (VPL)",
                "Pulvinar"
            ],
            correct: 1,
            explanation: "The Lateral Geniculate Nucleus (LGN) receives input from the retina and projects it to the primary visual cortex.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        
        // Rotate central core slowly
        const core = meshes['thalamic_core'];
        if (core) {
            core.rotation.y = time * 0.2 * speed;
            core.rotation.z = time * 0.1 * speed;
        }

        // Pulse the sensory data streams
        const streams = meshes['sensory_streams'];
        if (streams) {
            streams.rotation.z = time * 0.5 * speed;
            const scale = 1 + Math.sin(time * 3 * speed) * 0.05;
            streams.scale.set(scale, scale, scale);
        }

        // Float the LGN and MGN
        const lgn_r = meshes['lgn_right'];
        const lgn_l = meshes['lgn_left'];
        if (lgn_r && lgn_l) {
            lgn_r.position.y = -0.5 + Math.sin(time * 2 * speed) * 0.1;
            lgn_l.position.y = -0.5 + Math.sin(time * 2 * speed + Math.PI) * 0.1;
        }
        
        const mgn_r = meshes['mgn_right'];
        const mgn_l = meshes['mgn_left'];
        if (mgn_r && mgn_l) {
            mgn_r.position.y = -0.8 + Math.cos(time * 2.5 * speed) * 0.1;
            mgn_l.position.y = -0.8 + Math.cos(time * 2.5 * speed + Math.PI) * 0.1;
        }

        // Rotate the cortical radiations
        const radiations = meshes['cortical_radiations'];
        if (radiations) {
            radiations.rotation.y = -time * 0.3 * speed;
        }
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
export function createThalamusRelay() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
