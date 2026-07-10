import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const glowingFrontal = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingParietal = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingOccipital = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00aa00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingTemporal = new THREE.MeshStandardMaterial({
        color: 0xffa500,
        emissive: 0xff6600,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1
    });

    const corpusCallosumMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x444444,
        roughness: 0.1,
        metalness: 0.8
    });

    // We'll create stylized semi-spherical shapes for the lobes to make them look distinct yet part of a brain

    // Frontal Lobe
    const frontalGeom = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const frontalLobe = new THREE.Mesh(frontalGeom, glowingFrontal);
    frontalLobe.position.set(0, 0, 1.5);
    frontalLobe.scale.set(1, 0.8, 1.2);
    frontalLobe.userData = { id: 'frontalLobe' };
    group.add(frontalLobe);

    parts.push({
        name: "Frontal Lobe",
        description: "Responsible for higher cognitive functions such as memory, emotions, impulse control, problem solving, social interaction, and motor function.",
        material: glowingFrontal,
        function: "Executive functions, decision making, and voluntary movement control.",
        assemblyOrder: 1,
        connections: ["Parietal Lobe", "Temporal Lobe"],
        failureEffect: "Impaired judgment, personality changes, and difficulty with motor execution.",
        cascadeFailures: ["General cognitive decline", "Behavioral dysregulation"],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 2, z: 4 }
    });

    // Parietal Lobe
    const parietalGeom = new THREE.SphereGeometry(2.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5);
    const parietalLobe = new THREE.Mesh(parietalGeom, glowingParietal);
    parietalLobe.position.set(0, 1.5, -1);
    parietalLobe.rotation.x = -Math.PI / 4;
    parietalLobe.userData = { id: 'parietalLobe' };
    group.add(parietalLobe);

    parts.push({
        name: "Parietal Lobe",
        description: "Processes sensory information it receives from the outside world, mainly relating to touch, taste, and temperature.",
        material: glowingParietal,
        function: "Sensory perception and integration, spatial awareness.",
        assemblyOrder: 2,
        connections: ["Frontal Lobe", "Occipital Lobe", "Temporal Lobe"],
        failureEffect: "Difficulty interpreting sensory information, right-left confusion.",
        cascadeFailures: ["Loss of spatial coordination"],
        originalPosition: { x: 0, y: 1.5, z: -1 },
        explodedPosition: { x: 0, y: 4, z: -2 }
    });

    // Occipital Lobe
    const occipitalGeom = new THREE.SphereGeometry(2.2, 32, 32);
    const occipitalLobe = new THREE.Mesh(occipitalGeom, glowingOccipital);
    occipitalLobe.position.set(0, 0, -3.5);
    occipitalLobe.scale.set(1, 0.8, 0.8);
    occipitalLobe.userData = { id: 'occipitalLobe' };
    group.add(occipitalLobe);

    parts.push({
        name: "Occipital Lobe",
        description: "The visual processing center of the mammalian brain.",
        material: glowingOccipital,
        function: "Visual perception, including color, form, and motion.",
        assemblyOrder: 3,
        connections: ["Parietal Lobe", "Temporal Lobe"],
        failureEffect: "Visual field defects, difficulty recognizing colors or faces.",
        cascadeFailures: ["Complete cortical blindness"],
        originalPosition: { x: 0, y: 0, z: -3.5 },
        explodedPosition: { x: 0, y: -1, z: -6 }
    });

    // Temporal Lobe
    const temporalGeom = new THREE.CapsuleGeometry(1.5, 3, 16, 16);
    const temporalLobeRight = new THREE.Mesh(temporalGeom, glowingTemporal);
    temporalLobeRight.position.set(3, -1, 0);
    temporalLobeRight.rotation.x = Math.PI / 2;
    temporalLobeRight.userData = { id: 'temporalLobeRight' };
    group.add(temporalLobeRight);

    const temporalLobeLeft = new THREE.Mesh(temporalGeom, glowingTemporal);
    temporalLobeLeft.position.set(-3, -1, 0);
    temporalLobeLeft.rotation.x = Math.PI / 2;
    temporalLobeLeft.userData = { id: 'temporalLobeLeft' };
    group.add(temporalLobeLeft);

    parts.push({
        name: "Temporal Lobe",
        description: "Plays a key role in processing auditory information and with the encoding of memory.",
        material: glowingTemporal,
        function: "Auditory processing, language comprehension, and memory encoding.",
        assemblyOrder: 4,
        connections: ["Frontal Lobe", "Parietal Lobe", "Occipital Lobe"],
        failureEffect: "Hearing deficits, memory loss, language comprehension difficulties.",
        cascadeFailures: ["Wernicke's aphasia", "Amnesia"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 6, y: -3, z: 0 } // abstractly grouping them
    });

    // Central core / Corpus Callosum
    const coreGeom = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const core = new THREE.Mesh(coreGeom, corpusCallosumMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, -0.5, -0.5);
    core.userData = { id: 'corpusCallosum' };
    group.add(core);

    parts.push({
        name: "Corpus Callosum",
        description: "A thick band of nerve fibers that divides the cerebral cortex lobes into left and right hemispheres.",
        material: corpusCallosumMat,
        function: "Connects the left and right sides of the brain allowing for communication between both hemispheres.",
        assemblyOrder: 5,
        connections: ["All Lobes"],
        failureEffect: "Split-brain syndrome, lack of coordination between left and right sides of the body.",
        cascadeFailures: ["Hemispheric isolation"],
        originalPosition: { x: 0, y: -0.5, z: -0.5 },
        explodedPosition: { x: 0, y: -4, z: -0.5 }
    });

    const description = "The Brain Cortex Lobes constitute the outer layer of the cerebrum, playing a crucial role in consciousness, thought, emotion, reasoning, language, and memory. This high-tech cybernetic visualization maps the functional regions in real-time.";

    const quizQuestions = [
        {
            question: "Which lobe is primarily responsible for visual processing?",
            options: ["Frontal Lobe", "Parietal Lobe", "Occipital Lobe", "Temporal Lobe"],
            correct: 2,
            explanation: "The Occipital Lobe is the primary visual processing center of the brain.",
            difficulty: "Easy"
        },
        {
            question: "What is the main function of the Corpus Callosum?",
            options: ["Visual processing", "Connecting the left and right hemispheres", "Regulating heartbeat", "Memory encoding"],
            correct: 1,
            explanation: "The Corpus Callosum is a thick nerve tract that facilitates communication between the left and right hemispheres of the brain.",
            difficulty: "Medium"
        },
        {
            question: "Which lobe plays a key role in executive functions and decision making?",
            options: ["Temporal Lobe", "Occipital Lobe", "Parietal Lobe", "Frontal Lobe"],
            correct: 3,
            explanation: "The Frontal Lobe is heavily involved in executive functions, reasoning, and voluntary movement.",
            difficulty: "Medium"
        },
        {
            question: "Damage to the Temporal Lobe is most likely to affect which function?",
            options: ["Vision", "Hearing and memory", "Touch sensation", "Motor control"],
            correct: 1,
            explanation: "The Temporal Lobe is crucial for processing auditory information and memory encoding.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsating glowing effect for the lobes to simulate neural activity
        const pulse = Math.sin(time * speed * 2) * 0.2 + 0.8;
        const fastPulse = Math.sin(time * speed * 5) * 0.4 + 0.6;
        
        if (meshes.frontalLobe) {
            meshes.frontalLobe.material.emissiveIntensity = pulse;
            meshes.frontalLobe.scale.setScalar(1 + Math.sin(time * speed) * 0.02);
        }
        if (meshes.parietalLobe) {
            meshes.parietalLobe.material.emissiveIntensity = Math.sin(time * speed * 2.5 + 1) * 0.2 + 0.8;
            meshes.parietalLobe.position.y = 1.5 + Math.sin(time * speed * 1.5) * 0.05;
        }
        if (meshes.occipitalLobe) {
            meshes.occipitalLobe.material.emissiveIntensity = fastPulse;
        }
        if (meshes.temporalLobeRight) {
            meshes.temporalLobeRight.material.emissiveIntensity = pulse;
            meshes.temporalLobeRight.rotation.z = Math.sin(time * speed) * 0.05;
        }
        if (meshes.temporalLobeLeft) {
            meshes.temporalLobeLeft.material.emissiveIntensity = pulse;
            meshes.temporalLobeLeft.rotation.z = -Math.sin(time * speed) * 0.05;
        }
        if (meshes.corpusCallosum) {
            meshes.corpusCallosum.rotation.z = time * speed * 0.2;
        }
        
        // Gentle overall rotation
        group.rotation.y = Math.sin(time * speed * 0.5) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBrainCortex() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
