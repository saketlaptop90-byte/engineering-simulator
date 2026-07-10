import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const pigmentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const muscleMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa2233,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const nerveMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    const reflectorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xccffcc,
        emissive: 0x22aa22,
        emissiveIntensity: 0.5,
        metalness: 1.0,
        roughness: 0.1,
        iridescence: 1.0,
        iridescenceIOR: 1.5
    });

    // 1. Central Pigment Sac (Sacculus)
    const sacGeo = new THREE.SphereGeometry(1, 64, 64);
    const sacMesh = new THREE.Mesh(sacGeo, pigmentMaterial);
    group.add(sacMesh);
    meshes.sac = sacMesh;

    parts.push({
        name: "Cytoelastic Sacculus",
        description: "The central sac containing pigment granules. It stretches to display color and retracts to hide it.",
        material: "Pigment Biomaterial",
        function: "Color display",
        assemblyOrder: 1,
        connections: ["Radial Muscles", "Iridophores"],
        failureEffect: "Loss of ability to change color or pattern.",
        cascadeFailures: ["Camouflage Failure", "Signaling Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2 }
    });

    // 2. Radial Muscles
    const numMuscles = 16;
    meshes.muscles = [];
    for (let i = 0; i < numMuscles; i++) {
        const angle = (i / numMuscles) * Math.PI * 2;
        const muscleGeo = new THREE.CylinderGeometry(0.1, 0.05, 3, 16);
        // Translate geometry so origin is at the base
        muscleGeo.translate(0, 1.5, 0);
        muscleGeo.rotateX(Math.PI / 2); // point along Z initially
        
        const muscleMesh = new THREE.Mesh(muscleGeo, muscleMaterial);
        
        // Position at the edge of the sac
        muscleMesh.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
        muscleMesh.lookAt(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
        
        group.add(muscleMesh);
        meshes.muscles.push(muscleMesh);
    }

    parts.push({
        name: "Radial Muscles",
        description: "Muscles attached to the equator of the sacculus. When they contract, they pull the sac outward, expanding it into a flat disc of color.",
        material: "Smooth Muscle Tissue",
        function: "Sac expansion and contraction",
        assemblyOrder: 2,
        connections: ["Cytoelastic Sacculus", "Motor Neurons"],
        failureEffect: "Sac cannot expand, remaining fixed in a retracted state.",
        cascadeFailures: ["Static appearance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 3. Motor Neurons
    meshes.neurons = [];
    for (let i = 0; i < numMuscles; i += 2) {
        const angle = (i / numMuscles) * Math.PI * 2;
        
        // Draw a path for the neuron
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 3, -1),
            new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0.5),
            new THREE.Vector3(Math.cos(angle) * 1, Math.sin(angle) * 1, 0)
        );
        
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const neuronMesh = new THREE.Mesh(tubeGeo, nerveMaterial);
        group.add(neuronMesh);
        meshes.neurons.push(neuronMesh);
    }

    parts.push({
        name: "Motor Neurons",
        description: "Nerve fibers that send electrical impulses to the radial muscles, triggering near-instantaneous contraction.",
        material: "Nerve Tissue",
        function: "Signal transmission",
        assemblyOrder: 3,
        connections: ["Radial Muscles", "Central Nervous System"],
        failureEffect: "Loss of control over the associated radial muscles.",
        cascadeFailures: ["Uncoordinated color patterns"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 0, z: -1 }
    });

    // 4. Photophores/Iridophores (Base Reflector Layer)
    const reflectorGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const reflectorMesh = new THREE.Mesh(reflectorGeo, reflectorMaterial);
    reflectorMesh.rotation.x = Math.PI / 2;
    reflectorMesh.position.set(0, 0, -0.5);
    group.add(reflectorMesh);
    meshes.reflector = reflectorMesh;

    parts.push({
        name: "Iridophore / Photophore Layer",
        description: "Underlying structural cells that reflect ambient light or generate bioluminescence to enhance or alter the color output.",
        material: "Reflective/Luminescent Proteins",
        function: "Structural coloration and light emission",
        assemblyOrder: 4,
        connections: ["Cytoelastic Sacculus"],
        failureEffect: "Loss of iridescence and bioluminescent capabilities.",
        cascadeFailures: ["Reduced signaling effectiveness in dark environments"],
        originalPosition: { x: 0, y: 0, z: -0.5 },
        explodedPosition: { x: 0, y: 0, z: -3 }
    });

    const description = "The Bioluminescent Chromatophore is a complex neuromuscular organ found in cephalopods like squid and octopuses. It consists of a pigment-filled saculus controlled by a ring of radial muscles. When the muscles contract, the sac expands, making the color visible. When they relax, the sac shrinks to an invisible dot. Combined with underlying light-reflecting iridophores and light-emitting photophores, these units allow the animal to change its appearance almost instantly for camouflage or communication.";

    const quizQuestions = [
        {
            question: "What is the primary function of the radial muscles in a chromatophore?",
            options: [
                "To produce the pigment within the sac",
                "To contract and expand the cytoelastic sacculus, exposing the pigment",
                "To generate bioluminescence in the dark",
                "To send electrical signals to the central nervous system"
            ],
            correct: 1,
            explanation: "When radial muscles contract, they stretch the cytoelastic sacculus outwards, spreading the pigment over a larger area and making the color visible.",
            difficulty: "Medium"
        },
        {
            question: "Which component provides structural coloration and reflection beneath the pigment sac?",
            options: [
                "Motor Neurons",
                "Radial Muscles",
                "Iridophores",
                "Glial Cells"
            ],
            correct: 2,
            explanation: "Iridophores are cells located beneath the chromatophores that contain reflecting plates, producing iridescent colors through structural coloration.",
            difficulty: "Easy"
        },
        {
            question: "Why can cephalopods change their skin color so much faster than chameleons?",
            options: [
                "Their pigments undergo a rapid chemical reaction",
                "Their chromatophores are directly controlled by the nervous system and motor neurons",
                "They shed their outer skin layer constantly",
                "They have fewer chromatophores to control"
            ],
            correct: 1,
            explanation: "Unlike chameleons, which rely primarily on hormonal control for color change, cephalopod chromatophores are neuromuscular organs wired directly to the brain, allowing for millisecond reaction times.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        const pulse = (Math.sin(time * speed * 2) + 1) / 2;
        
        const sacScaleX = 1 + pulse * 1.5;
        const sacScaleY = 1 + pulse * 1.5;
        const sacScaleZ = 1 - pulse * 0.8;
        
        meshes.sac.scale.set(sacScaleX, sacScaleY, sacScaleZ);
        meshes.sac.material.emissiveIntensity = 0.5 + pulse * 2.5;
        
        meshes.muscles.forEach(muscle => {
            muscle.scale.set(1 - pulse * 0.5, 1, 1 - pulse * 0.5);
        });

        meshes.neurons.forEach((neuron, index) => {
            const offset = index * 0.5;
            const signal = (Math.sin(time * speed * 5 + offset) + 1) / 2;
            neuron.material.emissiveIntensity = 0.5 + signal * 2.0;
        });
        
        meshes.reflector.material.emissiveIntensity = 0.5 + Math.sin(time * speed) * 0.3;
        meshes.reflector.rotation.z = time * speed * 0.1;
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createBioluminescentChromatophore() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
