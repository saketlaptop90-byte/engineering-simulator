import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const glowingPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.0,
        roughness: 0.4
    });

    const energyMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const meshes = {};

    // 1. Base Platform (Magnetic Containment Ring)
    const baseGeo = new THREE.TorusGeometry(3, 0.4, 16, 100);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -2;
    group.add(baseMesh);
    meshes.base = baseMesh;
    
    parts.push({
        name: "Magnetic Containment Ring",
        description: "Stabilizes the chaperonin complex in a zero-gravity environment using strong magnetic fields.",
        material: "darkSteel",
        function: "Base structural support and energy supply.",
        assemblyOrder: 1,
        connections: ["Cis-Ring", "Power Grid"],
        failureEffect: "Chaperonin complex destabilizes, causing catastrophic protein misfolding.",
        cascadeFailures: ["Cis-Ring"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. GroEL Cis-Ring (Lower Chamber)
    const cisRingGeo = new THREE.CylinderGeometry(2.5, 2.5, 3, 14, 1, true);
    const cisRingMesh = new THREE.Mesh(cisRingGeo, aluminum);
    cisRingMesh.position.y = -0.5;
    group.add(cisRingMesh);
    meshes.cisRing = cisRingMesh;
    
    // Add neon details to Cis-Ring
    for (let i = 0; i < 7; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8);
        const pillarMesh = new THREE.Mesh(pillarGeo, neonBlue);
        const angle = (i / 7) * Math.PI * 2;
        pillarMesh.position.set(Math.cos(angle) * 2.6, 0, Math.sin(angle) * 2.6);
        cisRingMesh.add(pillarMesh);
    }

    parts.push({
        name: "GroEL Cis-Ring",
        description: "The lower barrel of the GroEL complex where unfolded proteins enter.",
        material: "aluminum, neonBlue",
        function: "Captures unfolded polypeptides exposing hydrophobic residues.",
        assemblyOrder: 2,
        connections: ["Magnetic Containment Ring", "Equatorial Domain", "Trans-Ring"],
        failureEffect: "Inability to capture denatured proteins.",
        cascadeFailures: ["Protein Refolding"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: -3, y: -1.5, z: -3}
    });

    // 3. Equatorial Domain (ATP Binding Sites)
    const equatorialGeo = new THREE.TorusGeometry(2.6, 0.3, 16, 50);
    const equatorialMesh = new THREE.Mesh(equatorialGeo, copper);
    equatorialMesh.rotation.x = Math.PI / 2;
    equatorialMesh.position.y = 1;
    group.add(equatorialMesh);
    meshes.equatorial = equatorialMesh;

    // ATP molecules (glowing spheres)
    meshes.atp = [];
    for(let i=0; i<7; i++) {
        const atpGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const atpMesh = new THREE.Mesh(atpGeo, glowingPink);
        const angle = (i / 7) * Math.PI * 2;
        atpMesh.position.set(Math.cos(angle) * 2.6, 1, Math.sin(angle) * 2.6);
        group.add(atpMesh);
        meshes.atp.push(atpMesh);
    }

    parts.push({
        name: "Equatorial Domain & ATP Bindings",
        description: "Hinge region of GroEL containing ATP binding pockets.",
        material: "copper, glowingPink",
        function: "Hydrolyzes ATP to drive the conformational changes needed for folding.",
        assemblyOrder: 3,
        connections: ["Cis-Ring", "Trans-Ring"],
        failureEffect: "Loss of ATP hydrolysis prevents conformational shift, halting the folding cycle.",
        cascadeFailures: ["GroES Lid Binding"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 3, y: 1, z: 3}
    });

    // 4. GroEL Trans-Ring (Upper Chamber)
    const transRingGeo = new THREE.CylinderGeometry(2.5, 2.5, 3, 14, 1, true);
    const transRingMesh = new THREE.Mesh(transRingGeo, steel);
    transRingMesh.position.y = 2.5;
    group.add(transRingMesh);
    meshes.transRing = transRingMesh;

    // Add neon details to Trans-Ring
    for (let i = 0; i < 7; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8);
        const pillarMesh = new THREE.Mesh(pillarGeo, neonBlue);
        const angle = (i / 7) * Math.PI * 2;
        pillarMesh.position.set(Math.cos(angle) * 2.6, 0, Math.sin(angle) * 2.6);
        transRingMesh.add(pillarMesh);
    }

    parts.push({
        name: "GroEL Trans-Ring",
        description: "The upper barrel of the GroEL complex.",
        material: "steel, neonBlue",
        function: "Acts as a secondary folding chamber or prepares for the next cycle.",
        assemblyOrder: 4,
        connections: ["Equatorial Domain", "GroES Lid"],
        failureEffect: "Reduces efficiency by half as alternating cycles cannot occur.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: -3, y: 3.5, z: -3}
    });

    // 5. GroES Lid (Cap)
    const lidGeo = new THREE.ConeGeometry(2.7, 1.5, 14);
    const lidMesh = new THREE.Mesh(lidGeo, chrome);
    lidMesh.position.y = 4.75;
    group.add(lidMesh);
    meshes.lid = lidMesh;

    parts.push({
        name: "GroES Co-chaperonin (Lid)",
        description: "A dome-like structure that caps the GroEL barrel.",
        material: "chrome",
        function: "Seals the folding chamber and induces a shift to a hydrophilic interior.",
        assemblyOrder: 5,
        connections: ["Trans-Ring"],
        failureEffect: "Polypeptide escapes prematurely or cannot fold efficiently due to lack of enclosed environment.",
        cascadeFailures: ["Protein Assembly"],
        originalPosition: {x: 0, y: 4.75, z: 0},
        explodedPosition: {x: 0, y: 7, z: 0}
    });

    // 6. Polypeptide Chain (Misfolded/Folding Protein)
    // Create a twisted knot structure
    const proteinGeo = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
    const proteinMesh = new THREE.Mesh(proteinGeo, neonGreen);
    proteinMesh.position.y = 2.5; // Inside trans ring
    group.add(proteinMesh);
    meshes.protein = proteinMesh;

    // Energy field around protein
    const fieldGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const fieldMesh = new THREE.Mesh(fieldGeo, energyMaterial);
    fieldMesh.position.y = 2.5;
    group.add(fieldMesh);
    meshes.field = fieldMesh;

    parts.push({
        name: "Polypeptide Substrate",
        description: "An unfolded or misfolded protein currently undergoing refolding.",
        material: "neonGreen",
        function: "The target molecule being assisted by the chaperonin.",
        assemblyOrder: 6,
        connections: ["Trans-Ring Chamber"],
        failureEffect: "Aggregates form, leading to neurodegenerative disease states.",
        cascadeFailures: ["Cellular Health"],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: 0}
    });

    const description = "A high-tech visualization of the GroEL/GroES chaperonin complex, a molecular machine essential for assisting the folding of newly synthesized or misfolded proteins. Powered by ATP hydrolysis, it undergoes dramatic conformational changes to create an enclosed, hydrophilic environment promoting correct protein folding.";

    const quizQuestions = [
        {
            question: "What provides the energy for the conformational changes in the GroEL/GroES complex?",
            options: ["GTP hydrolysis", "ATP hydrolysis", "Proton motive force", "Thermal fluctuations"],
            correct: 1,
            explanation: "The equatorial domain of GroEL contains ATP binding sites. Hydrolysis of ATP provides the energy necessary to drive the dramatic conformational changes.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the GroES lid?",
            options: ["To digest misfolded proteins", "To seal the chamber and induce a hydrophilic environment", "To synthesize new polypeptides", "To transport proteins to the Golgi"],
            correct: 1,
            explanation: "Binding of the GroES lid seals the target protein inside the GroEL chamber and causes the chamber walls to shift from hydrophobic to hydrophilic, which encourages the protein to fold properly.",
            difficulty: "Easy"
        },
        {
            question: "Which term best describes the overall shape of the GroEL complex without the lid?",
            options: ["Double-barreled cylinder", "Icosahedral shell", "Triple helix", "Tetrahedral cage"],
            correct: 0,
            explanation: "GroEL consists of two stacked rings (cis and trans), forming a double-barreled cylinder with a central cavity for protein binding.",
            difficulty: "Easy"
        },
        {
            question: "Why do hydrophobic residues on the inner wall of GroEL initially bind the unfolded protein?",
            options: ["Because folded proteins are entirely hydrophobic", "To prevent aggregation by binding exposed hydrophobic regions of the unfolded protein", "To break covalent bonds in the protein chain", "Because ATP is hydrophobic"],
            correct: 1,
            explanation: "Unfolded or misfolded proteins often expose hydrophobic amino acid residues that are prone to aggregation. GroEL binds these regions to prevent incorrect interactions before folding.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Base ring slow rotation
            meshes.base.rotation.z = time * speed * 0.2;

            // Chamber breathing effect (conformational change simulation)
            const breath = Math.sin(time * speed * 2) * 0.1 + 1;
            meshes.transRing.scale.set(breath, 1, breath);
            meshes.cisRing.scale.set(2 - breath, 1, 2 - breath); // Opposite phase

            // Equatorial domain rotation
            meshes.equatorial.rotation.z = time * speed * 0.5;

            // ATP molecules pulsing and orbiting
            meshes.atp.forEach((atp, index) => {
                const angle = (index / 7) * Math.PI * 2 + (time * speed);
                atp.position.set(Math.cos(angle) * 2.6, 1 + Math.sin(time * speed * 5 + index) * 0.2, Math.sin(angle) * 2.6);
                atp.scale.setScalar(Math.sin(time * speed * 10 + index) * 0.2 + 1);
            });

            // Protein folding animation
            meshes.protein.rotation.x = time * speed;
            meshes.protein.rotation.y = time * speed * 1.5;
            
            // Simulating the folding process (knot gets tighter then relaxes)
            const foldState = (Math.sin(time * speed) + 1) / 2; // 0 to 1
            meshes.protein.scale.setScalar(0.5 + foldState * 0.5);
            
            // Energy field pulsating
            meshes.field.scale.setScalar(1 + Math.sin(time * speed * 4) * 0.1);
            meshes.field.material.opacity = 0.3 + Math.sin(time * speed * 2) * 0.2;

            // GroES Lid bobbing (simulating binding/release cycle)
            const lidState = Math.sin(time * speed * 0.5);
            if (lidState > 0.8) {
                // Lid flies off
                meshes.lid.position.y = 4.75 + (lidState - 0.8) * 10;
                meshes.protein.position.y = 2.5 + (lidState - 0.8) * 5; // Protein released
            } else {
                meshes.lid.position.y = 4.75;
                meshes.protein.position.y = 2.5;
            }
            meshes.lid.rotation.y = time * speed * 2;
        } else {
            // Exploded view gentle rotations
            meshes.protein.rotation.x = time * speed * 0.5;
            meshes.protein.rotation.y = time * speed * 0.5;
            meshes.lid.rotation.y = time * speed;
            meshes.base.rotation.z = time * speed * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createProteinFolder() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
