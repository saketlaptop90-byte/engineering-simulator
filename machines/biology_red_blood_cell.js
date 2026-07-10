import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const cellMembraneMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa0000,
        emissive: 0x440000,
        specular: 0xffaaaa,
        shininess: 30,
        transparent: true,
        opacity: 0.85
    });

    const hemoglobinGlowingMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff2222,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9
    });

    const oxygenGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6
    });

    // 1. Plasma Membrane (Biconcave shape)
    const rimGeo = new THREE.TorusGeometry(3, 1, 32, 64);
    rimGeo.scale(1, 1, 0.5);
    const centerGeo = new THREE.CylinderGeometry(2.9, 2.9, 0.8, 64);
    
    const membraneGroup = new THREE.Group();
    
    const rimMesh = new THREE.Mesh(rimGeo, cellMembraneMaterial);
    const centerMesh = new THREE.Mesh(centerGeo, cellMembraneMaterial);
    centerMesh.rotation.x = Math.PI / 2;
    membraneGroup.add(rimMesh);
    membraneGroup.add(centerMesh);
    
    group.add(membraneGroup);
    meshes.membrane = membraneGroup;

    parts.push({
        name: "Plasma Membrane",
        description: "The semipermeable outer layer of the red blood cell, uniquely shaped as a biconcave disc to maximize surface area for gas exchange.",
        material: cellMembraneMaterial,
        function: "Encloses the cell contents, maintains shape, and facilitates the exchange of oxygen and carbon dioxide.",
        assemblyOrder: 1,
        connections: ["Cytoskeleton", "Hemoglobin Core"],
        failureEffect: "Cell lysis (destruction), leading to anemia and inability to transport gases.",
        cascadeFailures: ["Loss of Hemoglobin", "Hypoxia in tissues"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 2. Hemoglobin Core (pulsating center)
    const hemoglobinGeo = new THREE.SphereGeometry(2.8, 32, 32);
    hemoglobinGeo.scale(1, 1, 0.3);
    const hemoglobinMesh = new THREE.Mesh(hemoglobinGeo, hemoglobinGlowingMaterial);
    group.add(hemoglobinMesh);
    meshes.hemoglobin = hemoglobinMesh;

    parts.push({
        name: "Hemoglobin Core",
        description: "The iron-containing protein inside the erythrocyte that binds to oxygen.",
        material: hemoglobinGlowingMaterial,
        function: "Reversibly binds oxygen in the lungs and releases it in tissues.",
        assemblyOrder: 2,
        connections: ["Plasma Membrane", "Oxygen Molecules"],
        failureEffect: "Inability to bind oxygen efficiently (e.g., sickle cell disease or carbon monoxide poisoning).",
        cascadeFailures: ["Cellular asphyxiation", "Organ damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 3. Bound Oxygen Molecules (Visual Flair)
    const oxygenGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const oxGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const oxMesh = new THREE.Mesh(oxGeo, oxygenGlowMaterial);
        const angle = (i / 4) * Math.PI * 2;
        oxMesh.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0.6);
        oxygenGroup.add(oxMesh);
    }
    group.add(oxygenGroup);
    meshes.oxygen = oxygenGroup;

    parts.push({
        name: "Bound Oxygen",
        description: "O2 molecules bound to the heme groups of the hemoglobin protein.",
        material: oxygenGlowMaterial,
        function: "Transported payload destined for cellular respiration in tissues.",
        assemblyOrder: 3,
        connections: ["Hemoglobin Core"],
        failureEffect: "Hypoxia in target tissues.",
        cascadeFailures: ["Tissue death", "Organ failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 8 }
    });

    const description = "The Erythrocyte (Red Blood Cell) is a highly specialized biological 'machine' designed for gas transport. Lacking a nucleus to maximize space for hemoglobin, it relies on a flexible, biconcave shape to squeeze through narrow capillaries while providing a massive surface area for oxygen and carbon dioxide diffusion. Its glowing core represents the oxygen-binding hemoglobin protein in action.";

    const quizQuestions = [
        {
            question: "Why does the red blood cell have a biconcave disc shape?",
            options: [
                "To store more water",
                "To maximize surface area-to-volume ratio for efficient gas exchange",
                "To hold a larger nucleus",
                "To move faster through veins"
            ],
            correct: 1,
            explanation: "The biconcave shape maximizes the surface area-to-volume ratio, allowing for optimal diffusion of oxygen and carbon dioxide.",
            difficulty: "Medium"
        },
        {
            question: "Which component of the red blood cell is primarily responsible for binding oxygen?",
            options: [
                "Plasma Membrane",
                "Nucleus",
                "Hemoglobin",
                "Mitochondria"
            ],
            correct: 2,
            explanation: "Hemoglobin is an iron-rich protein that binds to oxygen in the lungs and carries it to the tissues.",
            difficulty: "Easy"
        },
        {
            question: "What is a unique cellular characteristic of a mature human red blood cell compared to most other cells?",
            options: [
                "It lacks a nucleus and organelles.",
                "It has multiple nuclei.",
                "It has a rigid cell wall.",
                "It can divide continuously."
            ],
            correct: 0,
            explanation: "To maximize space for hemoglobin and maintain its flexible shape, mature human red blood cells expel their nucleus and most organelles during development.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, activeMeshes) => {
        if (!activeMeshes) return;

        // Make the cell undulate and float
        if (activeMeshes.membrane) {
            activeMeshes.membrane.rotation.x = Math.sin(time * 0.5 * speed) * 0.2;
            activeMeshes.membrane.rotation.y = time * 0.2 * speed;
            activeMeshes.membrane.position.y = Math.sin(time * speed) * 0.5;
        }

        // Hemoglobin pulses with 'breathing'
        if (activeMeshes.hemoglobin) {
            const pulse = 1 + Math.sin(time * 2 * speed) * 0.05;
            activeMeshes.hemoglobin.scale.set(pulse, pulse, 0.3 * pulse);
            activeMeshes.hemoglobin.material.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed) * 0.4;
            
            activeMeshes.hemoglobin.rotation.x = Math.sin(time * 0.5 * speed) * 0.2;
            activeMeshes.hemoglobin.rotation.y = time * 0.2 * speed;
            activeMeshes.hemoglobin.position.y = Math.sin(time * speed) * 0.5;
        }

        // Oxygen glows and orbits slightly
        if (activeMeshes.oxygen) {
            activeMeshes.oxygen.rotation.z = time * 0.5 * speed;
            activeMeshes.oxygen.children.forEach((ox, index) => {
                const oxPulse = 1 + Math.cos(time * 3 * speed + index) * 0.2;
                ox.scale.set(oxPulse, oxPulse, oxPulse);
                ox.material.opacity = 0.5 + Math.cos(time * 2 * speed + index) * 0.4;
            });
            
            activeMeshes.oxygen.rotation.x = Math.sin(time * 0.5 * speed) * 0.2;
            activeMeshes.oxygen.rotation.y = time * 0.2 * speed;
            activeMeshes.oxygen.position.y = Math.sin(time * speed) * 0.5;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRedBloodCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
