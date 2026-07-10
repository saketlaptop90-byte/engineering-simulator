import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.9
    });
    
    const neonGold = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xff8c00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const energyCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        wireframe: true,
    });

    // 1. Pacemaker Core (Sinoatrial Node Core)
    const coreGeo = new THREE.DodecahedronGeometry(2);
    const coreMesh = new THREE.Mesh(coreGeo, energyCoreMat);
    coreMesh.position.set(0, 0, 0);
    group.add(coreMesh);

    parts.push({
        name: "Pacemaker Core",
        description: "The primary rhythmic generator simulating the specialized pacemaker cells.",
        material: "Energy Core",
        function: "Generates the initial electrical impulse.",
        assemblyOrder: 1,
        connections: ["Conduction Pathways"],
        failureEffect: "Heart rate drops to zero (cardiac arrest).",
        cascadeFailures: ["Atrial Contraction", "Ventricular Contraction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: coreMesh
    });

    // 2. Conduction Pathways
    const pathwayGeo = new THREE.TorusGeometry(3, 0.2, 16, 100);
    const pathwayMesh = new THREE.Mesh(pathwayGeo, neonBlue);
    pathwayMesh.position.set(0, 0, 0);
    group.add(pathwayMesh);

    parts.push({
        name: "Conduction Pathways",
        description: "Internodal pathways transmitting the electrical signal through the right atrium.",
        material: "Neon Blue",
        function: "Conducts impulses rapidly to the AV node.",
        assemblyOrder: 2,
        connections: ["Pacemaker Core", "Atrial Muscle Interface"],
        failureEffect: "Arrhythmia or delayed contraction.",
        cascadeFailures: ["AV Node Synchronization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: pathwayMesh
    });

    // 3. Atrial Muscle Interface
    const muscleGeo = new THREE.SphereGeometry(3.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const muscleMesh = new THREE.Mesh(muscleGeo, chrome);
    muscleMesh.position.set(0, -1, 0);
    muscleMesh.rotation.x = Math.PI;
    group.add(muscleMesh);

    parts.push({
        name: "Atrial Muscle Interface",
        description: "The junction where the pacemaker signal stimulates atrial muscle tissue.",
        material: "Chrome",
        function: "Initiates mechanical contraction of the atrium.",
        assemblyOrder: 3,
        connections: ["Conduction Pathways"],
        failureEffect: "Loss of atrial kick.",
        cascadeFailures: ["Ventricular Filling"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: muscleMesh
    });

    // 4. Autonomic Modulators
    const modulatorGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const mod1 = new THREE.Mesh(modulatorGeo, neonGold);
    mod1.position.set(-2, 2, 0);
    mod1.rotation.z = Math.PI / 4;
    
    const mod2 = new THREE.Mesh(modulatorGeo, neonGold);
    mod2.position.set(2, 2, 0);
    mod2.rotation.z = -Math.PI / 4;
    
    const modulatorGroup = new THREE.Group();
    modulatorGroup.add(mod1, mod2);
    group.add(modulatorGroup);

    parts.push({
        name: "Autonomic Modulators",
        description: "Simulates sympathetic and parasympathetic nervous system inputs.",
        material: "Neon Gold",
        function: "Modulates the intrinsic firing rate up or down.",
        assemblyOrder: 4,
        connections: ["Pacemaker Core"],
        failureEffect: "Inability to adapt heart rate to stress or rest.",
        cascadeFailures: ["Systemic Perfusion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 5 },
        mesh: modulatorGroup
    });

    const description = "The Sinoatrial (SA) Node is the heart's natural pacemaker. This biomechanical representation illustrates the generation, conduction, and modulation of the electrical impulse that drives cardiac rhythms.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Sinoatrial Node?",
            options: ["To pump blood to the lungs", "To generate the heart's electrical impulse", "To oxygenate blood", "To filter impurities from blood"],
            correct: 1,
            explanation: "The SA node contains specialized cells that spontaneously depolarize, setting the rhythm for the entire heart.",
            difficulty: "easy"
        },
        {
            question: "Which system directly modulates the firing rate of the SA Node?",
            options: ["Endocrine system", "Somatic nervous system", "Autonomic nervous system", "Lymphatic system"],
            correct: 2,
            explanation: "The autonomic nervous system, through sympathetic and parasympathetic branches, increases or decreases the heart rate.",
            difficulty: "medium"
        },
        {
            question: "If the SA Node fails, which mechanism typically takes over?",
            options: ["Atrioventricular (AV) Node", "Purkinje Fibers", "Bundle of His", "Ventricles"],
            correct: 0,
            explanation: "The AV node acts as a backup pacemaker, though at a slower intrinsic rate.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsating core
        const core = parts[0].mesh;
        const scale = 1 + 0.2 * Math.sin(time * speed * 5); // Heartbeat pulse
        core.scale.set(scale, scale, scale);
        core.rotation.x += 0.01 * speed;
        core.rotation.y += 0.02 * speed;

        // Energy pathways moving
        const pathways = parts[1].mesh;
        pathways.rotation.z -= 0.03 * speed;
        pathways.scale.x = 1 + 0.05 * Math.sin(time * speed * 10);
        pathways.scale.y = 1 + 0.05 * Math.sin(time * speed * 10);

        // Modulators spinning
        const modulators = parts[3].mesh;
        modulators.rotation.y = Math.sin(time * speed * 2) * 0.5;
        
        // Update emissive materials
        neonBlue.emissiveIntensity = 1.5 + 0.5 * Math.sin(time * speed * 5);
        neonGold.emissiveIntensity = 2.0 + 1.0 * Math.sin(time * speed * 2);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSinoatrialNode() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
