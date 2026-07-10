import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials for Brain
    const brainShellMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaa88ff,
        metalness: 0.1,
        roughness: 0.3,
        transmission: 0.9,
        transparent: true,
        opacity: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const cortexMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaadd,
        roughness: 0.6,
        metalness: 0.1
    });

    const neuronMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff
    });
    
    const synapseMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    // 1. Cerebrum (Left & Right Hemispheres)
    // We'll simulate this with some complex geometries or simply scaled spheres for now,
    // adorned with a particle system for neurons.
    
    const cerebrumGeo = new THREE.SphereGeometry(3, 32, 32);
    cerebrumGeo.scale(1, 0.8, 1.2);
    const leftHemisphere = new THREE.Mesh(cerebrumGeo, brainShellMaterial);
    leftHemisphere.position.set(-1.6, 2, 0);
    group.add(leftHemisphere);
    meshes.leftHemisphere = leftHemisphere;

    parts.push({
        name: "Left Hemisphere",
        description: "Controls the right side of the body, responsible for logic, language, and analytical thinking.",
        material: "brainShellMaterial",
        function: "Logical processing and motor control of right side.",
        assemblyOrder: 1,
        connections: ["Corpus Callosum", "Right Hemisphere", "Brainstem"],
        failureEffect: "Loss of speech, right-sided paralysis.",
        cascadeFailures: ["Cognitive Decline", "Motor Function Impairment"],
        originalPosition: { x: -1.6, y: 2, z: 0 },
        explodedPosition: { x: -4, y: 3, z: 0 }
    });

    const rightHemisphere = new THREE.Mesh(cerebrumGeo, brainShellMaterial);
    rightHemisphere.position.set(1.6, 2, 0);
    group.add(rightHemisphere);
    meshes.rightHemisphere = rightHemisphere;

    parts.push({
        name: "Right Hemisphere",
        description: "Controls the left side of the body, responsible for creativity, intuition, and spatial awareness.",
        material: "brainShellMaterial",
        function: "Creative processing and motor control of left side.",
        assemblyOrder: 2,
        connections: ["Corpus Callosum", "Left Hemisphere", "Brainstem"],
        failureEffect: "Left-sided paralysis, impaired spatial reasoning.",
        cascadeFailures: ["Sensory Processing Error", "Motor Function Impairment"],
        originalPosition: { x: 1.6, y: 2, z: 0 },
        explodedPosition: { x: 4, y: 3, z: 0 }
    });

    // 2. Cerebellum
    const cerebellumGeo = new THREE.SphereGeometry(1.5, 32, 32);
    cerebellumGeo.scale(1.5, 0.6, 1);
    const cerebellum = new THREE.Mesh(cerebellumGeo, cortexMaterial);
    cerebellum.position.set(0, -0.5, -2);
    group.add(cerebellum);
    meshes.cerebellum = cerebellum;

    parts.push({
        name: "Cerebellum",
        description: "Coordinates voluntary movements, posture, and balance.",
        material: "cortexMaterial",
        function: "Motor control and coordination.",
        assemblyOrder: 3,
        connections: ["Brainstem"],
        failureEffect: "Loss of coordination, imbalance.",
        cascadeFailures: ["Motor Control Failure"],
        originalPosition: { x: 0, y: -0.5, z: -2 },
        explodedPosition: { x: 0, y: -2, z: -4 }
    });

    // 3. Brainstem
    const brainstemGeo = new THREE.CylinderGeometry(0.5, 0.4, 3, 16);
    const brainstem = new THREE.Mesh(brainstemGeo, cortexMaterial);
    brainstem.position.set(0, -1.5, -0.5);
    brainstem.rotation.x = Math.PI / 8;
    group.add(brainstem);
    meshes.brainstem = brainstem;

    parts.push({
        name: "Brainstem",
        description: "Regulates basic autonomous functions like heart rate and breathing.",
        material: "cortexMaterial",
        function: "Autonomous survival functions.",
        assemblyOrder: 4,
        connections: ["Cerebrum", "Cerebellum", "Spinal Cord"],
        failureEffect: "Respiratory failure, cardiac arrest.",
        cascadeFailures: ["Total System Failure"],
        originalPosition: { x: 0, y: -1.5, z: -0.5 },
        explodedPosition: { x: 0, y: -4, z: -0.5 }
    });

    // 4. Corpus Callosum
    const corpusGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const corpus = new THREE.Mesh(corpusGeo, new THREE.MeshStandardMaterial({color: 0xddddff, roughness: 0.2}));
    corpus.rotation.z = Math.PI / 2;
    corpus.position.set(0, 1.5, 0);
    group.add(corpus);
    meshes.corpus = corpus;

    parts.push({
        name: "Corpus Callosum",
        description: "Thick band of nerve fibers connecting the two hemispheres.",
        material: "whiteMatter",
        function: "Inter-hemispheric communication.",
        assemblyOrder: 5,
        connections: ["Left Hemisphere", "Right Hemisphere"],
        failureEffect: "Split-brain syndrome.",
        cascadeFailures: ["Hemispheric Desynchronization"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 5. Neural Network / Synaptic Pathways (Particle System)
    const particleCount = 2000;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const phaseArray = new Float32Array(particleCount);
    
    for(let i = 0; i < particleCount; i++) {
        // Randomly distribute inside two ellipsoids (hemispheres)
        const isLeft = Math.random() > 0.5;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * 2.8; // radius
        
        const xOffset = isLeft ? -1.6 : 1.6;
        posArray[i*3] = xOffset + r * Math.sin(phi) * Math.cos(theta);
        posArray[i*3+1] = 2 + (r * 0.8) * Math.sin(phi) * Math.sin(theta);
        posArray[i*3+2] = (r * 1.2) * Math.cos(phi);
        
        phaseArray[i] = Math.random() * Math.PI * 2;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('phase', new THREE.BufferAttribute(phaseArray, 1));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const neuronParticles = new THREE.Points(particlesGeo, particleMat);
    group.add(neuronParticles);
    meshes.neuronParticles = neuronParticles;

    parts.push({
        name: "Synaptic Pathways",
        description: "Billions of neural connections firing electrical impulses.",
        material: "neuronMaterial",
        function: "Information processing and memory storage.",
        assemblyOrder: 6,
        connections: ["Entire Brain"],
        failureEffect: "Loss of memory, cognitive impairment.",
        cascadeFailures: ["Dementia", "Loss of Consciousness"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    const description = "The Human Brain: A highly complex organ consisting of billions of neurons, responsible for processing sensory information, coordinating movement, and hosting consciousness.";

    const quizQuestions = [
        {
            question: "Which part of the brain is primarily responsible for coordinating voluntary movements and balance?",
            options: ["Cerebrum", "Cerebellum", "Brainstem", "Corpus Callosum"],
            correct: 1,
            explanation: "The cerebellum is located at the back of the brain and coordinates movement, posture, and balance.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Corpus Callosum?",
            options: ["Regulates heartbeat", "Processes visual data", "Connects the two cerebral hemispheres", "Controls reflex actions"],
            correct: 2,
            explanation: "The corpus callosum is a thick band of nerve fibers that allows communication between the left and right hemispheres.",
            difficulty: "Easy"
        },
        {
            question: "Damage to the brainstem would most likely result in which of the following?",
            options: ["Memory loss", "Inability to speak", "Loss of balance", "Failure of autonomous functions like breathing"],
            correct: 3,
            explanation: "The brainstem controls vital life functions such as breathing, heart rate, and blood pressure.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        // Pulse the hemispheres
        const scale = 1 + Math.sin(time * 2 * speed) * 0.02;
        if(meshesObj.leftHemisphere) meshesObj.leftHemisphere.scale.set(scale, scale * 0.8, scale * 1.2);
        if(meshesObj.rightHemisphere) meshesObj.rightHemisphere.scale.set(scale, scale * 0.8, scale * 1.2);

        // Animate synaptic pathways
        if(meshesObj.neuronParticles) {
            const positions = meshesObj.neuronParticles.geometry.attributes.position.array;
            const phases = meshesObj.neuronParticles.geometry.attributes.phase.array;
            for(let i = 0; i < phases.length; i++) {
                // Slightly jitter positions
                positions[i*3+1] += Math.sin(time * speed * 5 + phases[i]) * 0.005;
            }
            meshesObj.neuronParticles.geometry.attributes.position.needsUpdate = true;
            
            // Pulse opacity
            meshesObj.neuronParticles.material.opacity = 0.5 + Math.sin(time * speed * 8) * 0.4;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBrain() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
