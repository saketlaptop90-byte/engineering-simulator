import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const outerMembraneMat = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        emissive: 0x004422,
        side: THREE.DoubleSide
    });

    const lpsMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.1
    });

    const peptidoglycanMat = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        emissive: 0x442200
    });

    const innerMembraneMat = new THREE.MeshPhongMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        emissive: 0x002244,
        side: THREE.DoubleSide
    });

    const porinMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 0.4,
        metalness: 0.3,
        roughness: 0.4
    });

    // 1. Inner Membrane (Phospholipid Bilayer)
    const innerMembraneGeom = new THREE.BoxGeometry(20, 0.5, 20);
    const innerMembraneMesh = new THREE.Mesh(innerMembraneGeom, innerMembraneMat);
    innerMembraneMesh.position.set(0, 0, 0);
    group.add(innerMembraneMesh);
    parts.push({
        name: "Inner Membrane",
        description: "A phospholipid bilayer that regulates the passage of substances in and out of the cytoplasm.",
        material: "innerMembraneMat",
        function: "Selective permeability, energy production (electron transport chain), and protein secretion.",
        assemblyOrder: 1,
        connections: ["Periplasmic Space"],
        failureEffect: "Loss of cellular integrity and energy production failure.",
        cascadeFailures: ["Cell Death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: innerMembraneMesh
    });

    // 2. Periplasmic Space & Peptidoglycan Layer
    const periplasmGeom = new THREE.BoxGeometry(20, 2, 20);
    const peptidoglycanMesh = new THREE.Mesh(periplasmGeom, peptidoglycanMat);
    peptidoglycanMesh.position.set(0, 1.25, 0);
    group.add(peptidoglycanMesh);
    parts.push({
        name: "Thin Peptidoglycan Layer",
        description: "A thin structural layer composed of sugars and amino acids located in the periplasmic space.",
        material: "peptidoglycanMat",
        function: "Provides structural support and maintains cell shape, though thinner than in Gram-positive bacteria.",
        assemblyOrder: 2,
        connections: ["Inner Membrane", "Outer Membrane", "Lipoproteins"],
        failureEffect: "Cell lysis due to osmotic pressure.",
        cascadeFailures: ["Cell Death"],
        originalPosition: { x: 0, y: 1.25, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: peptidoglycanMesh
    });

    // 3. Outer Membrane
    const outerMembraneGeom = new THREE.BoxGeometry(20, 0.5, 20);
    const outerMembraneMesh = new THREE.Mesh(outerMembraneGeom, outerMembraneMat);
    outerMembraneMesh.position.set(0, 2.5, 0);
    group.add(outerMembraneMesh);
    parts.push({
        name: "Outer Membrane",
        description: "An asymmetrical lipid bilayer containing lipopolysaccharides (LPS) on the outer leaflet.",
        material: "outerMembraneMat",
        function: "Acts as an extra barrier against certain antibiotics, digestive enzymes, and heavy metals.",
        assemblyOrder: 3,
        connections: ["Peptidoglycan Layer", "Porins", "LPS"],
        failureEffect: "Increased susceptibility to antibiotics and environmental stress.",
        cascadeFailures: ["Cell Death", "Loss of Pathogenicity"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: outerMembraneMesh
    });

    // 4. Porins (Channels in outer membrane)
    const porinGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    const porins = [];
    for (let i = 0; i < 15; i++) {
        const porinMesh = new THREE.Mesh(porinGeom, porinMat);
        const px = (Math.random() - 0.5) * 18;
        const pz = (Math.random() - 0.5) * 18;
        porinMesh.position.set(px, 2.5, pz);
        group.add(porinMesh);
        porins.push(porinMesh);
    }
    parts.push({
        name: "Porin Channels",
        description: "Protein channels spanning the outer membrane.",
        material: "porinMat",
        function: "Allow the passive diffusion of low-molecular-weight hydrophilic compounds like sugars and amino acids.",
        assemblyOrder: 4,
        connections: ["Outer Membrane"],
        failureEffect: "Inability to import essential nutrients or export waste.",
        cascadeFailures: ["Starvation", "Toxicity"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: porins
    });

    // 5. Lipopolysaccharides (LPS)
    const lpsGeom = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const lpsMolecules = [];
    for (let i = 0; i < 50; i++) {
        const lpsMesh = new THREE.Mesh(lpsGeom, lpsMat);
        const px = (Math.random() - 0.5) * 19;
        const pz = (Math.random() - 0.5) * 19;
        lpsMesh.position.set(px, 3.25, pz); // above outer membrane
        group.add(lpsMesh);
        lpsMolecules.push(lpsMesh);
    }
    parts.push({
        name: "Lipopolysaccharides (LPS)",
        description: "Large molecules consisting of a lipid and a polysaccharide found in the outer membrane.",
        material: "lpsMat",
        function: "Contributes to the structural integrity of the bacteria, protects membrane from certain chemical attacks, and acts as an endotoxin.",
        assemblyOrder: 5,
        connections: ["Outer Membrane"],
        failureEffect: "Loss of outer membrane stability and reduced evasion of host immune system.",
        cascadeFailures: ["Phagocytosis by Host", "Cell Lysis"],
        originalPosition: { x: 0, y: 3.25, z: 0 },
        explodedPosition: { x: 0, y: 11, z: 0 },
        mesh: lpsMolecules
    });

    const description = "The Gram-Negative Bacterial Cell Wall is a complex, multi-layered structure characterized by an inner cytoplasmic membrane, a thin peptidoglycan layer situated within the periplasmic space, and a unique outer membrane containing lipopolysaccharides (LPS) and porins. This architecture provides robust protection against environmental threats and many antibiotics.";

    const quizQuestions = [
        {
            question: "Which component of the Gram-negative cell wall is primarily responsible for its endotoxic effects?",
            options: ["Peptidoglycan", "Porins", "Lipopolysaccharides (LPS)", "Phospholipids"],
            correct: 2,
            explanation: "The lipid A portion of the lipopolysaccharide (LPS) complex in the outer membrane acts as an endotoxin, triggering strong immune responses when released.",
            difficulty: "Medium"
        },
        {
            question: "Where is the peptidoglycan layer located in a Gram-negative bacterium?",
            options: ["Outside the outer membrane", "Inside the cytoplasm", "In the periplasmic space between inner and outer membranes", "Attached to the flagella"],
            correct: 2,
            explanation: "In Gram-negative bacteria, the thin peptidoglycan layer is located in the periplasmic space, sandwiched between the inner and outer cell membranes.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of porins in the outer membrane?",
            options: ["Energy production", "DNA replication", "Active transport of large proteins", "Passive diffusion of small hydrophilic molecules"],
            correct: 3,
            explanation: "Porins act as channels that allow the passive diffusion of essential small hydrophilic molecules, such as sugars and amino acids, across the relatively impermeable outer membrane.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const lpsParts = meshes.find(m => m.name === "Lipopolysaccharides (LPS)");
        if (lpsParts && Array.isArray(lpsParts.mesh)) {
            lpsParts.mesh.forEach((mesh, index) => {
                const offset = index * 0.1;
                mesh.position.y = mesh.userData.baseY + Math.sin(time * speed + offset) * 0.1;
            });
        }

        const outerMembrane = meshes.find(m => m.name === "Outer Membrane")?.mesh;
        if (outerMembrane && !Array.isArray(outerMembrane)) {
            const scale = 1 + Math.sin(time * speed * 0.5) * 0.02;
            outerMembrane.scale.set(scale, 1, scale);
        }
        
        const periplasm = meshes.find(m => m.name === "Thin Peptidoglycan Layer")?.mesh;
        if (periplasm && !Array.isArray(periplasm)) {
            periplasm.material.opacity = 0.6 + Math.sin(time * speed * 2) * 0.2;
        }
    }

    lpsMolecules.forEach(m => { m.userData.baseY = m.position.y; });

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGramNegativeWall() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
