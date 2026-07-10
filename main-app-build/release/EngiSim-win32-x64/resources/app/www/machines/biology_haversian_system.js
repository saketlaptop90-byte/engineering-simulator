import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for biological/high-tech aesthetic
    const osteonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e5df,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.3,
        transparent: true,
        opacity: 0.9,
    });
    
    const bloodVesselRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xaa0000,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const bloodVesselBlue = new THREE.MeshStandardMaterial({
        color: 0x1111ff,
        emissive: 0x0000aa,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const nerveMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e342,
        emissive: 0x887700,
        emissiveIntensity: 0.6,
        roughness: 0.4
    });

    const lamellaeGlow = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x0055aa,
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const osteocyteMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00aa44,
        emissiveIntensity: 0.9,
        wireframe: false
    });

    const meshes = {};

    // 1. Central (Haversian) Canal
    const canalGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 32);
    const canal = new THREE.Mesh(canalGeo, glass);
    canal.position.set(0, 0, 0);
    group.add(canal);
    meshes.canal = canal;
    parts.push({
        name: "Haversian Canal",
        description: "Central channel containing blood vessels and nerves.",
        material: "glass",
        function: "Supplies nutrients, oxygen, and innervation to the osteon.",
        assemblyOrder: 1,
        connections: ["Blood Vessels", "Nerves", "Concentric Lamellae"],
        failureEffect: "Ischemia of the osteon.",
        cascadeFailures: ["Osteocyte death", "Bone necrosis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Artery
    const arteryGeo = new THREE.CylinderGeometry(0.2, 0.2, 11, 16);
    const artery = new THREE.Mesh(arteryGeo, bloodVesselRed);
    artery.position.set(0.25, 0, 0.25);
    group.add(artery);
    meshes.artery = artery;
    parts.push({
        name: "Artery",
        description: "Oxygen-rich blood vessel.",
        material: "bloodVesselRed",
        function: "Delivers oxygenated blood to the bone tissue.",
        assemblyOrder: 2,
        connections: ["Haversian Canal"],
        failureEffect: "Loss of oxygen supply.",
        cascadeFailures: ["Cellular hypoxia"],
        originalPosition: { x: 0.25, y: 0, z: 0.25 },
        explodedPosition: { x: 2, y: 5, z: 2 }
    });

    // 3. Vein
    const veinGeo = new THREE.CylinderGeometry(0.25, 0.25, 11, 16);
    const vein = new THREE.Mesh(veinGeo, bloodVesselBlue);
    vein.position.set(-0.25, 0, -0.25);
    group.add(vein);
    meshes.vein = vein;
    parts.push({
        name: "Vein",
        description: "Deoxygenated blood vessel.",
        material: "bloodVesselBlue",
        function: "Removes waste products and deoxygenated blood.",
        assemblyOrder: 3,
        connections: ["Haversian Canal"],
        failureEffect: "Waste accumulation.",
        cascadeFailures: ["Toxicity", "Acidosis"],
        originalPosition: { x: -0.25, y: 0, z: -0.25 },
        explodedPosition: { x: -2, y: 5, z: -2 }
    });

    // 4. Nerve
    const nerveGeo = new THREE.CylinderGeometry(0.1, 0.1, 11, 8);
    const nerve = new THREE.Mesh(nerveGeo, nerveMaterial);
    nerve.position.set(-0.3, 0, 0.3);
    group.add(nerve);
    meshes.nerve = nerve;
    parts.push({
        name: "Nerve Fiber",
        description: "Sensory nerve bundle.",
        material: "nerveMaterial",
        function: "Provides sensation, including pain during bone damage.",
        assemblyOrder: 4,
        connections: ["Haversian Canal"],
        failureEffect: "Loss of sensation.",
        cascadeFailures: ["Unnoticed microfractures"],
        originalPosition: { x: -0.3, y: 0, z: 0.3 },
        explodedPosition: { x: -2, y: 5, z: 2 }
    });

    // 5. Concentric Lamellae Rings (Layers of bone)
    const lamellaeGroup = new THREE.Group();
    meshes.lamellae = [];
    const numLayers = 4;
    for (let i = 0; i < numLayers; i++) {
        const innerRadius = 1.0 + (i * 1.2);
        const outerRadius = 2.0 + (i * 1.2);
        
        // Solid layer
        const lGeo = new THREE.CylinderGeometry(outerRadius, innerRadius, 9, 32, 1, true);
        const lMesh = new THREE.Mesh(lGeo, osteonMaterial);
        
        // Glowing wireframe layer for high-tech look
        const gGeo = new THREE.CylinderGeometry(outerRadius + 0.05, innerRadius + 0.05, 9.2, 16, 4, true);
        const gMesh = new THREE.Mesh(gGeo, lamellaeGlow);
        
        const ringGroup = new THREE.Group();
        ringGroup.add(lMesh);
        ringGroup.add(gMesh);
        
        lamellaeGroup.add(ringGroup);
        meshes.lamellae.push(ringGroup);
        
        parts.push({
            name: `Concentric Lamella Layer ${i+1}`,
            description: `Layer ${i+1} of calcified matrix.`,
            material: "osteonMaterial, lamellaeGlow",
            function: "Provides structural strength and houses osteocytes.",
            assemblyOrder: 5 + i,
            connections: [i === 0 ? "Haversian Canal" : `Lamella Layer ${i}`],
            failureEffect: "Structural weakness.",
            cascadeFailures: ["Microfractures"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: (i+1)*2, z: 0 }
        });
    }
    group.add(lamellaeGroup);

    // 6. Osteocytes in Lacunae (small glowing nodes)
    const osteocyteGroup = new THREE.Group();
    meshes.osteocytes = [];
    for (let i = 0; i < numLayers; i++) {
        const radius = 1.5 + (i * 1.2);
        const numCells = 8 + (i * 4);
        for (let j = 0; j < numCells; j++) {
            const angle = (j / numCells) * Math.PI * 2;
            const yPos = (Math.random() - 0.5) * 8;
            
            const cellGeo = new THREE.SphereGeometry(0.15, 8, 8);
            const cell = new THREE.Mesh(cellGeo, osteocyteMaterial);
            
            cell.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            osteocyteGroup.add(cell);
            meshes.osteocytes.push({mesh: cell, angle, radius, yPos, layer: i});
        }
    }
    group.add(osteocyteGroup);
    parts.push({
        name: "Osteocytes in Lacunae",
        description: "Mature bone cells residing in small cavities.",
        material: "osteocyteMaterial",
        function: "Maintains the bone matrix and senses mechanical stress.",
        assemblyOrder: 9,
        connections: ["Lamellae", "Canaliculi"],
        failureEffect: "Matrix degradation.",
        cascadeFailures: ["Bone resorption"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 5 }
    });

    const description = "The Haversian System, or osteon, is the fundamental functional unit of much compact bone. It features a central canal containing blood vessels and nerves, surrounded by concentric layers of bone matrix called lamellae. Mature bone cells (osteocytes) sit in tiny spaces (lacunae) between lamellae.";

    const quizQuestions = [
        {
            question: "What is housed within the central Haversian Canal?",
            options: [
                "Bone marrow",
                "Blood vessels and nerves",
                "Osteocytes",
                "Cartilage"
            ],
            correct: 1,
            explanation: "The Haversian Canal contains blood vessels that supply nutrients and nerves that provide sensation to the osteon.",
            difficulty: "Medium"
        },
        {
            question: "What are the concentric rings of calcified matrix called?",
            options: [
                "Canaliculi",
                "Lacunae",
                "Lamellae",
                "Trabeculae"
            ],
            correct: 2,
            explanation: "Lamellae are the concentric layers of mineralized bone matrix that provide structural strength to the osteon.",
            difficulty: "Easy"
        },
        {
            question: "Which cells reside in the small cavities (lacunae) within the lamellae?",
            options: [
                "Osteoclasts",
                "Osteoblasts",
                "Osteocytes",
                "Chondrocytes"
            ],
            correct: 2,
            explanation: "Osteocytes are mature bone cells that live within the lacunae and maintain the surrounding bone matrix.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, partMeshes) {
        // Pulsating effect for blood vessels
        const pulse = 1 + Math.sin(time * 5 * speed) * 0.05;
        if (meshes.artery) meshes.artery.scale.set(pulse, 1, pulse);
        
        const pulseVein = 1 + Math.cos(time * 5 * speed) * 0.05;
        if (meshes.vein) meshes.vein.scale.set(pulseVein, 1, pulseVein);

        // Nerve electrical pulsing
        if (meshes.nerve) {
            meshes.nerve.material.emissiveIntensity = 0.6 + Math.sin(time * 15 * speed) * 0.4;
        }

        // Slowly rotate lamellae rings in alternating directions
        meshes.lamellae.forEach((ring, index) => {
            const dir = index % 2 === 0 ? 1 : -1;
            ring.rotation.y = time * 0.1 * dir * speed;
        });

        // Osteocytes floating/glowing
        meshes.osteocytes.forEach((cellData, index) => {
            cellData.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * 2 * speed + index) * 0.5;
            // Slight movement
            cellData.mesh.position.y = cellData.yPos + Math.sin(time * 3 * speed + index) * 0.05;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHaversianSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
