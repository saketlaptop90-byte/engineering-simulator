import * as materials from '../utils/materials.js';

export function create(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Helper to generate a globular protein chain (random walk of spheres)
    function createProteinChain(material, radius, count, seed) {
        const chainGroup = new THREE.Group();
        const geo = new THREE.SphereGeometry(radius, 16, 16);
        let pos = new THREE.Vector3(0, 0, 0);
        
        // Simple seeded random function
        const random = (s) => { 
            let x = Math.sin(s) * 10000; 
            return x - Math.floor(x); 
        };
        
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(geo, material);
            mesh.position.copy(pos);
            chainGroup.add(mesh);
            
            // Calculate next position in the folded chain
            const theta = random(seed + i * 2) * Math.PI * 2;
            const phi = random(seed + i * 2 + 1) * Math.PI;
            const dist = radius * 1.1; // Slight overlap
            pos.x += Math.sin(phi) * Math.cos(theta) * dist;
            pos.y += Math.sin(phi) * Math.sin(theta) * dist;
            pos.z += Math.cos(phi) * dist;
        }
        
        // Center the entire chain
        const box = new THREE.Box3().setFromObject(chainGroup);
        const center = new THREE.Vector3();
        box.getCenter(center);
        chainGroup.children.forEach(c => c.position.sub(center));
        
        return chainGroup;
    }

    // 1. RBC Membrane
    const rbcGroup = new THREE.Group();
    const rbcMat = materials.tinted(materials.plastic, 0xd42222);
    rbcMat.transparent = true;
    rbcMat.opacity = 0.25; // Transparent to show internals (cutaway effect)
    rbcMat.depthWrite = false;
    
    // Biconcave shape via Torus + thinner center Cylinder
    const torusGeo = new THREE.TorusGeometry(7, 2, 32, 64);
    const torus = new THREE.Mesh(torusGeo, rbcMat);
    const cylGeo = new THREE.CylinderGeometry(5.1, 5.1, 1.2, 64);
    const cyl = new THREE.Mesh(cylGeo, rbcMat);
    cyl.rotation.x = Math.PI / 2; // Align cylinder base with XY plane
    rbcGroup.add(torus);
    rbcGroup.add(cyl);
    
    parts.push({
        name: "RBC Membrane",
        description: "The biconcave lipid bilayer of the erythrocyte. Its shape maximizes surface area for gas exchange and allows it to squeeze through narrow capillaries.",
        material: "lipid membrane",
        function: "Encapsulates hemoglobin and facilitates rapid diffusion of O2 and CO2.",
        assemblyOrder: 10,
        connections: ["Hemoglobin Protein Complex"],
        failureEffect: "Membrane fragility causes cell rupture (hemolysis), leading to anemia.",
        cascadeFailures: ["Loss of oxygen transport capacity", "Vascular blockage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 },
        group: rbcGroup
    });
    group.add(rbcGroup);

    // 2. Hemoglobin Protein Complex (Scaffolding/Core)
    const hbGroup = new THREE.Group();
    const hbMat = materials.tinted(materials.glass, 0xffffff);
    hbMat.transparent = true;
    hbMat.opacity = 0.1;
    const hbGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const hbMesh = new THREE.Mesh(hbGeo, hbMat);
    hbMesh.material.wireframe = true;
    hbGroup.add(hbMesh);

    parts.push({
        name: "Hemoglobin Protein Complex",
        description: "The core metalloprotein inside the RBC, responsible for transporting oxygen. Consists of four bound globular subunits.",
        material: "protein framework",
        function: "Provides the quaternary structure that enables cooperative binding of oxygen.",
        assemblyOrder: 1,
        connections: ["Alpha Chains", "Beta Chains", "RBC Membrane"],
        failureEffect: "Inability to bind oxygen efficiently, leading to hypoxia.",
        cascadeFailures: ["Tissue damage", "Fatigue"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -5 },
        group: hbGroup
    });
    group.add(hbGroup);

    // 3. Alpha Chain 1
    const alphaMat1 = materials.tinted(materials.plastic, 0xff5555);
    const alpha1 = createProteinChain(alphaMat1, 0.3, 45, 100);
    alpha1.position.set(-1.2, 1.2, 0);
    parts.push({
        name: "Alpha Chain 1",
        description: "One of the two alpha-globin protein subunits in adult hemoglobin.",
        material: "alpha-globin",
        function: "Pairs with a beta chain to form a dimer, holding a heme group to bind O2.",
        assemblyOrder: 2,
        connections: ["Hemoglobin Protein Complex", "Beta Chain 1", "Heme Group 1"],
        failureEffect: "Alpha-thalassemia due to impaired or absent alpha chain synthesis.",
        cascadeFailures: ["Hemoglobin instability", "Red blood cell destruction"],
        originalPosition: { x: -1.2, y: 1.2, z: 0 },
        explodedPosition: { x: -4, y: 4, z: 0 },
        group: alpha1
    });
    group.add(alpha1);

    // 4. Alpha Chain 2
    const alphaMat2 = materials.tinted(materials.plastic, 0xdd4444);
    const alpha2 = createProteinChain(alphaMat2, 0.3, 45, 200);
    alpha2.position.set(1.2, -1.2, 0);
    parts.push({
        name: "Alpha Chain 2",
        description: "The second alpha-globin subunit in the hemoglobin tetramer.",
        material: "alpha-globin",
        function: "Contributes to the quaternary structure and allosteric regulation.",
        assemblyOrder: 3,
        connections: ["Hemoglobin Protein Complex", "Beta Chain 2"],
        failureEffect: "Unstable hemoglobin tetramers leading to reduced oxygen affinity.",
        cascadeFailures: ["Anemia", "Hypoxia"],
        originalPosition: { x: 1.2, y: -1.2, z: 0 },
        explodedPosition: { x: 4, y: -4, z: 0 },
        group: alpha2
    });
    group.add(alpha2);

    // 5. Beta Chain 1
    const betaMat1 = materials.tinted(materials.plastic, 0x6666ff);
    const beta1 = createProteinChain(betaMat1, 0.3, 50, 300);
    beta1.position.set(1.2, 1.2, 0);
    parts.push({
        name: "Beta Chain 1",
        description: "One of the two beta-globin subunits in adult hemoglobin.",
        material: "beta-globin",
        function: "Pairs with alpha chains. Contains a heme pocket for oxygen binding.",
        assemblyOrder: 4,
        connections: ["Hemoglobin Protein Complex", "Alpha Chain 1", "Heme Group 2"],
        failureEffect: "Beta-thalassemia or sickle cell disease (if mutated).",
        cascadeFailures: ["Cell sickling", "Capillary blockages"],
        originalPosition: { x: 1.2, y: 1.2, z: 0 },
        explodedPosition: { x: 4, y: 4, z: 0 },
        group: beta1
    });
    group.add(beta1);

    // 6. Beta Chain 2
    const betaMat2 = materials.tinted(materials.plastic, 0x4444dd);
    const beta2 = createProteinChain(betaMat2, 0.3, 50, 400);
    beta2.position.set(-1.2, -1.2, 0);
    parts.push({
        name: "Beta Chain 2",
        description: "The second beta-globin subunit.",
        material: "beta-globin",
        function: "Completes the tetramer structure essential for cooperative oxygen binding.",
        assemblyOrder: 5,
        connections: ["Hemoglobin Protein Complex", "Alpha Chain 2"],
        failureEffect: "Loss of cooperative oxygen binding.",
        cascadeFailures: ["Poor oxygen delivery to tissues"],
        originalPosition: { x: -1.2, y: -1.2, z: 0 },
        explodedPosition: { x: -4, y: -4, z: 0 },
        group: beta2
    });
    group.add(beta2);

    // 7. Heme Group 1
    const hemeGroup1 = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(0.4, 0.06, 16, 32);
    const ringMesh1 = new THREE.Mesh(ringGeo, materials.carbonFiber);
    const diskGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.04, 32);
    const diskMesh1 = new THREE.Mesh(diskGeo, materials.tinted(materials.plastic, 0x331111));
    diskMesh1.rotation.x = Math.PI / 2;
    hemeGroup1.add(ringMesh1);
    hemeGroup1.add(diskMesh1);
    hemeGroup1.position.set(-1.4, 1.4, 0.8);
    hemeGroup1.rotation.y = Math.PI / 4;
    parts.push({
        name: "Heme Group 1",
        description: "A porphyrin ring structure embedded in the globin chain.",
        material: "porphyrin",
        function: "Acts as a prosthetic group securely holding the central iron ion.",
        assemblyOrder: 6,
        connections: ["Alpha Chain 1", "Iron Ion (Fe2+)"],
        failureEffect: "Porphyria or inability to hold iron, destroying oxygen transport capability.",
        cascadeFailures: ["Iron toxicity", "Cellular damage"],
        originalPosition: { x: -1.4, y: 1.4, z: 0.8 },
        explodedPosition: { x: -5, y: 5, z: 3 },
        group: hemeGroup1
    });
    group.add(hemeGroup1);

    // 8. Heme Group 2
    const hemeGroup2 = new THREE.Group();
    const ringMesh2 = new THREE.Mesh(ringGeo, materials.carbonFiber);
    const diskMesh2 = new THREE.Mesh(diskGeo, materials.tinted(materials.plastic, 0x331111));
    diskMesh2.rotation.x = Math.PI / 2;
    hemeGroup2.add(ringMesh2);
    hemeGroup2.add(diskMesh2);
    hemeGroup2.position.set(1.4, 1.4, 0.8);
    hemeGroup2.rotation.y = -Math.PI / 4;
    parts.push({
        name: "Heme Group 2",
        description: "Another porphyrin ring located within the beta chain.",
        material: "porphyrin",
        function: "Supports additional oxygen binding sites, enabling high capacity transport.",
        assemblyOrder: 7,
        connections: ["Beta Chain 1"],
        failureEffect: "Decreased maximum oxygen saturation.",
        cascadeFailures: ["Respiratory distress at high exertion"],
        originalPosition: { x: 1.4, y: 1.4, z: 0.8 },
        explodedPosition: { x: 5, y: 5, z: 3 },
        group: hemeGroup2
    });
    group.add(hemeGroup2);

    // 9. Iron Ion (Fe2+)
    const ironGroup = new THREE.Group();
    const ironGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const ironMesh = new THREE.Mesh(ironGeo, materials.tinted(materials.glass, 0xffaa00));
    ironGroup.add(ironMesh);
    ironGroup.position.set(-1.4, 1.4, 0.82);
    parts.push({
        name: "Iron Ion (Fe2+)",
        description: "The ferrous iron ion centered inside the heme porphyrin ring.",
        material: "ferrous iron",
        function: "Forms a reversible coordinate bond with an oxygen molecule.",
        assemblyOrder: 8,
        connections: ["Heme Group 1", "Oxygen Molecule (O2)"],
        failureEffect: "Oxidation to Fe3+ (methemoglobin) which cannot bind oxygen.",
        cascadeFailures: ["Cyanosis", "Tissue Hypoxia"],
        originalPosition: { x: -1.4, y: 1.4, z: 0.82 },
        explodedPosition: { x: -6, y: 6, z: 4 },
        group: ironGroup
    });
    group.add(ironGroup);

    // 10. Oxygen Molecule (O2)
    const oxGroup = new THREE.Group();
    const oxGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const oxMat = materials.tinted(materials.glass, 0x88ccff);
    const o1 = new THREE.Mesh(oxGeo, oxMat);
    o1.position.set(-0.08, 0, 0);
    const o2 = new THREE.Mesh(oxGeo, oxMat);
    o2.position.set(0.08, 0, 0);
    oxGroup.add(o1);
    oxGroup.add(o2);
    oxGroup.position.set(-3.5, 3.5, 3.5); // Starts unbound
    parts.push({
        name: "Oxygen Molecule (O2)",
        description: "A diatomic oxygen molecule binding to the hemoglobin.",
        material: "gas",
        function: "Transported from the lungs to cellular tissues for cellular respiration.",
        assemblyOrder: 9,
        connections: ["Iron Ion (Fe2+)"],
        failureEffect: "Carbon monoxide can outcompete O2 for this binding site.",
        cascadeFailures: ["Asphyxiation", "Cellular death"],
        originalPosition: { x: -3.5, y: 3.5, z: 3.5 },
        explodedPosition: { x: -8, y: 8, z: 8 },
        group: oxGroup
    });
    group.add(oxGroup);

    const quizQuestions = [
        {
            question: "What is the primary evolutionary advantage of the biconcave shape of a mature red blood cell?",
            options: [
                "It allows the cell to hold a nucleus",
                "It maximizes surface area for gas exchange and allows flexibility",
                "It prevents the cell from being targeted by white blood cells",
                "It reduces the cell's weight for faster circulation"
            ],
            correct: 1,
            explanation: "The biconcave shape provides a high surface-area-to-volume ratio for efficient diffusion of gases and allows the cell to deform and squeeze through tiny capillaries.",
            difficulty: "Medium"
        },
        {
            question: "Why do mature mammalian red blood cells lack a nucleus?",
            options: [
                "To free up internal space for maximum hemoglobin packing",
                "Because they are dead cells",
                "To prevent viral replication",
                "Because they reproduce via mitosis in the bloodstream"
            ],
            correct: 0,
            explanation: "Mature red blood cells expel their nucleus (and most other organelles) during development to maximize the space available for hemoglobin, allowing them to transport more oxygen.",
            difficulty: "Medium"
        },
        {
            question: "What causes hemoglobin's affinity for oxygen to increase after the first oxygen molecule binds?",
            options: [
                "Cellular respiration",
                "Osmosis",
                "Cooperative binding causing a conformational change",
                "A decrease in body temperature"
            ],
            correct: 2,
            explanation: "Hemoglobin exhibits cooperative binding. When one oxygen molecule binds, the protein complex shifts from a tense (T) state to a relaxed (R) state, increasing the affinity of the remaining heme groups for oxygen.",
            difficulty: "Hard"
        },
        {
            question: "What specific component within the heme group directly binds to an oxygen molecule?",
            options: [
                "The alpha-globin chain",
                "The porphyrin ring",
                "The Iron (Fe2+) ion",
                "The beta-globin chain"
            ],
            correct: 2,
            explanation: "The Iron (Fe2+) ion situated at the center of the heme porphyrin ring is the site that forms a reversible chemical bond with an oxygen molecule.",
            difficulty: "Medium"
        },
        {
            question: "What structural defect at the molecular level is the primary cause of sickle cell anemia?",
            options: [
                "A lack of iron in the diet",
                "A genetic mutation in the beta-globin chain",
                "A ruptured biconcave membrane",
                "An overproduction of alpha-globin"
            ],
            correct: 1,
            explanation: "Sickle cell anemia is caused by a single amino acid substitution in the beta-globin chain, which causes hemoglobin molecules to polymerize and distort the red blood cell into a sickle shape under low-oxygen conditions.",
            difficulty: "Hard"
        },
        {
            question: "Why is carbon monoxide (CO) extremely dangerous to human respiration?",
            options: [
                "It dissolves the red blood cell membrane",
                "It binds to the iron in heme with a much higher affinity than oxygen",
                "It causes the lungs to collapse",
                "It destroys the alpha chains of hemoglobin"
            ],
            correct: 1,
            explanation: "Carbon monoxide binds to the iron in hemoglobin with over 200 times the affinity of oxygen. This blocks oxygen binding and prevents oxygen delivery to vital organs.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // 1. RBC Membrane slightly pulsates/deforms
        const membrane = meshes[0].group;
        membrane.scale.set(
            1 + 0.01 * Math.sin(t * 2),
            1 + 0.015 * Math.cos(t * 2.5),
            1 + 0.01 * Math.sin(t * 2)
        );
        
        // 2. Protein Chains breathe (dynamic protein nature)
        for (let i = 2; i <= 5; i++) {
            const chain = meshes[i].group;
            chain.rotation.x = Math.sin(t + i) * 0.02;
            chain.rotation.y = Math.cos(t + i) * 0.02;
        }
        
        // Oxygen binding animation cycle (pulsing from 0 to 1 and back)
        const cycle = t * 1.5;
        const phase = cycle % (Math.PI * 2);
        const progress = phase < Math.PI 
            ? (1 - Math.cos(phase)) / 2 
            : (1 + Math.cos(phase)) / 2;
            
        // Oxygen moves from far away to the Iron Ion
        const ox = meshes[9].group;
        const startX = -4, startY = 4, startZ = 4;
        
        // Conformational change (T to R state transition)
        // Hemoglobin chains shift slightly inward as oxygen binds
        const shift = 0.12 * progress;
        
        // Target tracking: Oxygen moves towards the dynamically shifting iron ion
        const endX = -1.4 + shift;
        const endY = 1.4 - shift;
        const endZ = 0.95; // Slightly above the iron (0.82)
        
        ox.position.set(
            startX + (endX - startX) * progress,
            startY + (endY - startY) * progress,
            startZ + (endZ - startZ) * progress
        );
        ox.rotation.x = t * 2;
        ox.rotation.y = t * 3;

        // Apply Conformational Shift to globin chains
        meshes[2].group.position.x = -1.2 + shift;
        meshes[2].group.position.y = 1.2 - shift;
        
        meshes[3].group.position.x = 1.2 - shift;
        meshes[3].group.position.y = -1.2 + shift;
        
        meshes[4].group.position.x = 1.2 - shift;
        meshes[4].group.position.y = 1.2 - shift;
        
        meshes[5].group.position.x = -1.2 + shift;
        meshes[5].group.position.y = -1.2 + shift;
        
        // Shift Heme 1 and Iron 1 along with Alpha Chain 1
        meshes[6].group.position.x = -1.4 + shift;
        meshes[6].group.position.y = 1.4 - shift;
        
        meshes[8].group.position.x = -1.4 + shift;
        meshes[8].group.position.y = 1.4 - shift;
    }

    return {
        group,
        parts,
        description: "An interactive 3D model of a Red Blood Cell and its internal Hemoglobin complex. Observe the conformational shape change of hemoglobin as an oxygen molecule binds to the central iron ion.",
        quizQuestions,
        animate
    };
}

// Ensure alternate naming convention is exported just in case
export const createRedBloodCell = create;
