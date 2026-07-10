import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // custom glowing/neon materials
    const bileMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
    });
    
    const bloodMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.2,
    });

    const centralVeinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.1,
    });

    const hepatocyteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8b4513, // SaddleBrown
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.2,
        clearcoatRoughness: 0.5,
    });
    
    // Meshes definition
    const meshes = {};

    // 1. Central Vein
    const centralVeinGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const centralVeinMesh = new THREE.Mesh(centralVeinGeo, centralVeinMaterial);
    centralVeinMesh.position.set(0, 0, 0);
    group.add(centralVeinMesh);
    meshes.centralVein = centralVeinMesh;

    parts.push({
        name: "Central Vein",
        description: "Collects filtered blood from the sinusoids to return it to systemic circulation.",
        material: "Central Vein Material",
        function: "Venous return",
        assemblyOrder: 1,
        connections: ["Sinusoids"],
        failureEffect: "Blood congestion in the liver, leading to portal hypertension.",
        cascadeFailures: ["Hepatocyte necrosis", "Ascites"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 2. Hepatocyte Plates (Hexagonal arrangement)
    meshes.hepatocytes = [];
    const hexRadius = 6;
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * hexRadius;
        const z = Math.sin(angle) * hexRadius;
        
        const plateGeo = new THREE.BoxGeometry(2, 8, 4);
        const plateMesh = new THREE.Mesh(plateGeo, hepatocyteMaterial);
        
        plateMesh.position.set(x, 0, z);
        plateMesh.lookAt(0, 0, 0);
        
        group.add(plateMesh);
        meshes.hepatocytes.push({ mesh: plateMesh, angle: angle });
    }

    parts.push({
        name: "Hepatocyte Plates",
        description: "The primary functional cells of the liver, arranged in plates radiating from the central vein. They process toxins and produce bile.",
        material: "Hepatocyte Material",
        function: "Metabolism, detoxification, and bile production",
        assemblyOrder: 2,
        connections: ["Central Vein", "Sinusoids", "Bile Canaliculi"],
        failureEffect: "Loss of detoxification and metabolic function, jaundice.",
        cascadeFailures: ["Hepatic encephalopathy", "Coagulopathy"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 0, z: 10}
    });

    // 3. Portal Triads (at the corners of the hexagon)
    meshes.portalTriads = [];
    const triadRadius = 8;
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * triadRadius;
        const z = Math.sin(angle) * triadRadius;
        
        const triadGroup = new THREE.Group();
        triadGroup.position.set(x, 0, z);

        // Hepatic Artery
        const arteryGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
        const arteryMesh = new THREE.Mesh(arteryGeo, bloodMaterial);
        arteryMesh.position.set(-0.5, 0, 0);
        triadGroup.add(arteryMesh);

        // Portal Vein
        const veinGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
        const veinMesh = new THREE.Mesh(veinGeo, centralVeinMaterial);
        veinMesh.position.set(0.5, 0, 0);
        triadGroup.add(veinMesh);

        // Bile Duct
        const ductGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
        const ductMesh = new THREE.Mesh(ductGeo, bileMaterial);
        ductMesh.position.set(0, 0, 0.8);
        triadGroup.add(ductMesh);

        group.add(triadGroup);
        meshes.portalTriads.push(triadGroup);
    }

    parts.push({
        name: "Portal Triads",
        description: "Clusters of vessels at the periphery of the lobule, containing branches of the hepatic artery, portal vein, and bile duct.",
        material: "Mixed (Artery, Vein, Bile Duct)",
        function: "Supply oxygenated blood and nutrient-rich blood to the lobule, and collect bile.",
        assemblyOrder: 3,
        connections: ["Sinusoids", "Hepatocyte Plates"],
        failureEffect: "Ischemia or impaired nutrient delivery.",
        cascadeFailures: ["Lobule infarction", "Biliary cirrhosis"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 0, z: -15}
    });

    // 4. Sinusoids (Glowing network connecting triads to central vein)
    meshes.sinusoids = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        
        // Creating a series of pulsing spheres to represent blood flow
        const sinusoidGroup = new THREE.Group();
        for(let j=1; j<=5; j++) {
            const r = triadRadius - j * (triadRadius/6);
            const sx = Math.cos(angle) * r;
            const sz = Math.sin(angle) * r;
            
            const bloodParticleGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const bloodParticle = new THREE.Mesh(bloodParticleGeo, bloodMaterial);
            bloodParticle.position.set(sx, 0, sz);
            
            sinusoidGroup.add(bloodParticle);
            meshes.sinusoids.push({
                mesh: bloodParticle,
                baseDistance: r,
                angle: angle,
                offset: j * 0.5
            });
        }
        group.add(sinusoidGroup);
    }

    parts.push({
        name: "Sinusoids",
        description: "Highly permeable capillaries that carry mixed blood from the portal triads to the central vein, allowing hepatocytes to exchange substances.",
        material: "Glowing Blood Material",
        function: "Capillary exchange",
        assemblyOrder: 4,
        connections: ["Portal Triads", "Central Vein", "Hepatocyte Plates"],
        failureEffect: "Impaired blood-hepatocyte exchange, sinusoidal capillarization.",
        cascadeFailures: ["Fibrosis", "Cirrhosis"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    const description = "The Liver Lobule is the functional unit of the liver. It has a hexagonal structure with a central vein at its core and portal triads at its corners. Blood flows from the portal triads through the sinusoids to the central vein, while hepatocytes process toxins and produce bile, which flows outward into the bile ducts.";

    const quizQuestions = [
        {
            question: "Which structure carries nutrient-rich but oxygen-poor blood into the liver lobule?",
            options: ["Hepatic Artery", "Central Vein", "Portal Vein", "Bile Duct"],
            correct: 2,
            explanation: "The portal vein carries nutrient-rich blood from the digestive tract to the liver for processing.",
            difficulty: "Medium"
        },
        {
            question: "In what direction does bile flow within the liver lobule?",
            options: ["From the central vein to the portal triads", "From the portal triads to the central vein", "Randomly", "It does not flow"],
            correct: 0,
            explanation: "Bile is produced by hepatocytes and flows outward through bile canaliculi towards the bile ducts in the portal triads, opposite to the blood flow.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the hepatocytes?",
            options: ["Pumping blood", "Oxygenating blood", "Metabolism and detoxification", "Storing urine"],
            correct: 2,
            explanation: "Hepatocytes are the chief functional cells of the liver, responsible for metabolism, detoxification, and bile production.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, explodedState) {
        // Pulsing the central vein
        meshes.centralVein.scale.set(
            1 + Math.sin(time * 2 * speed) * 0.05,
            1,
            1 + Math.sin(time * 2 * speed) * 0.05
        );

        // Sinusoid blood flow animation (inward)
        meshes.sinusoids.forEach(s => {
            // moving towards the center
            const flowSpeed = 2;
            let currentR = s.baseDistance - (time * speed * flowSpeed + s.offset) % triadRadius;
            if (currentR < 1.5) {
                currentR = triadRadius; // reset to triad
            }
            s.mesh.position.x = Math.cos(s.angle) * currentR;
            s.mesh.position.z = Math.sin(s.angle) * currentR;
            
            // Pulse emissive intensity
            s.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5 + s.offset) * 0.3;
        });

        // Hepatocyte pulsing (metabolic activity)
        meshes.hepatocytes.forEach((h, index) => {
            h.mesh.position.y = Math.sin(time * speed + index) * 0.2;
        });
        
        // Rotate portal triads slowly
        meshes.portalTriads.forEach(triad => {
            triad.rotation.y = time * speed * 0.5;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLiverLobule() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
