import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "The Tracheal Cilia Sweep system, or the mucociliary escalator, is a crucial defense mechanism of the respiratory tract. It features a layer of mucus atop synchronized beating cilia that transport trapped particles upward toward the pharynx.";

    // Custom Materials
    const cellMembraneMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa5555,
        transparent: true,
        opacity: 0.8,
        shininess: 30
    });

    const ciliaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x004422,
        roughness: 0.4,
        metalness: 0.2
    });

    const mucusMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.8,
        opacity: 0.7,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        emissive: 0x002244
    });

    const particleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xaa5500,
        roughness: 0.8,
        metalness: 0.1
    });

    // 1. Epithelial Cell Base
    const cellGeom = new THREE.BoxGeometry(10, 4, 10);
    const cellMesh = new THREE.Mesh(cellGeom, cellMembraneMaterial);
    cellMesh.position.set(0, -2, 0);
    group.add(cellMesh);
    meshes.cell = cellMesh;

    parts.push({
        name: "Epithelial Cell Base",
        description: "Columnar epithelial cells that anchor the cilia and house organelles.",
        material: "Organic Tissue",
        function: "Structural support and energy production for ciliary movement.",
        assemblyOrder: 1,
        connections: ["Cilia Array", "Goblet Cells"],
        failureEffect: "Loss of anchor points for cilia, halting the sweep.",
        cascadeFailures: ["Ciliary dyskinesia", "Mucus stagnation"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 2. Cilia Array
    const ciliaGroup = new THREE.Group();
    const ciliaMeshes = [];
    const numRows = 8;
    const numCols = 8;
    const ciliaGeom = new THREE.CylinderGeometry(0.1, 0.2, 3, 8);
    ciliaGeom.translate(0, 1.5, 0); // Origin at base
    
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cilium = new THREE.Mesh(ciliaGeom, ciliaMaterial);
            const x = (i - numRows/2 + 0.5) * 1.2;
            const z = (j - numCols/2 + 0.5) * 1.2;
            cilium.position.set(x, 0, z);
            ciliaGroup.add(cilium);
            ciliaMeshes.push({
                mesh: cilium,
                baseX: x,
                baseZ: z,
                phaseOffset: (i * 0.5 + j * 0.2) // Metachronal wave phase
            });
        }
    }
    group.add(ciliaGroup);
    meshes.ciliaGroup = ciliaGroup;
    meshes.ciliaList = ciliaMeshes;

    parts.push({
        name: "Cilia Array",
        description: "Microtubule-based hair-like organelles extending from the cell surface.",
        material: "Microtubules & Dynein",
        function: "Perform coordinated whip-like beating to propel the mucus layer.",
        assemblyOrder: 2,
        connections: ["Epithelial Cell Base", "Mucus Layer"],
        failureEffect: "Inability to move mucus, leading to particle buildup.",
        cascadeFailures: ["Respiratory infections", "Bronchitis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 3. Mucus Layer (Gel/Sol)
    const mucusGeom = new THREE.BoxGeometry(10, 0.8, 10);
    const mucusMesh = new THREE.Mesh(mucusGeom, mucusMaterial);
    mucusMesh.position.set(0, 3.5, 0);
    group.add(mucusMesh);
    meshes.mucus = mucusMesh;

    parts.push({
        name: "Mucus Layer (Gel/Sol)",
        description: "A viscoelastic layer secreted by goblet cells floating above the cilia.",
        material: "Glycoproteins (Mucins)",
        function: "Traps inhaled particles and pathogens while providing a fluid medium for cilia to push.",
        assemblyOrder: 3,
        connections: ["Cilia Array", "Trapped Particles"],
        failureEffect: "Dehydration leads to thick mucus that cilia cannot move (e.g., cystic fibrosis).",
        cascadeFailures: ["Airway obstruction", "Pathogen colonization"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 }
    });

    // 4. Trapped Particles
    const particlesGroup = new THREE.Group();
    const particleList = [];
    for (let k = 0; k < 15; k++) {
        const pGeom = new THREE.DodecahedronGeometry(Math.random() * 0.2 + 0.1);
        const pMesh = new THREE.Mesh(pGeom, particleMaterial);
        const px = (Math.random() - 0.5) * 8;
        const pz = (Math.random() - 0.5) * 8;
        pMesh.position.set(px, 3.8, pz);
        particlesGroup.add(pMesh);
        particleList.push({
            mesh: pMesh,
            x: px,
            z: pz
        });
    }
    group.add(particlesGroup);
    meshes.particleList = particleList;

    parts.push({
        name: "Trapped Particles",
        description: "Dust, pollen, and pathogens inhaled from the environment.",
        material: "Environmental Debris",
        function: "Target payload that the mucociliary escalator aims to clear.",
        assemblyOrder: 4,
        connections: ["Mucus Layer"],
        failureEffect: "Accumulation can trigger inflammation or immune response.",
        cascadeFailures: ["Cellular damage", "Asthma exacerbation"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the mucociliary escalator?",
            options: [
                "To absorb oxygen into the bloodstream.",
                "To transport trapped particles and pathogens upwards towards the pharynx.",
                "To produce surfactant to prevent alveolar collapse.",
                "To detect olfactory stimuli in the nasal cavity."
            ],
            correct: 1,
            explanation: "The coordinated beating of cilia sweeps the mucus layer and trapped debris upwards, clearing the respiratory tract.",
            difficulty: "Easy"
        },
        {
            question: "Which cellular component generates the physical force for ciliary beating?",
            options: [
                "Mitochondria",
                "Dynein arms acting on microtubules",
                "Actin filaments",
                "Endoplasmic reticulum"
            ],
            correct: 1,
            explanation: "Motor proteins called dynein walk along the microtubule doublets within the cilium, causing it to bend and generate a power stroke.",
            difficulty: "Medium"
        },
        {
            question: "What occurs if the mucus layer becomes excessively thick, such as in cystic fibrosis?",
            options: [
                "Cilia beat faster to compensate.",
                "The mucus is absorbed back into the cells.",
                "Cilia are unable to move the heavy mucus, leading to stagnation and infection.",
                "Goblet cells stop secreting mucus entirely."
            ],
            correct: 2,
            explanation: "Thick, dehydrated mucus collapses the cilia, preventing the necessary metachronal waves from clearing the airways.",
            difficulty: "Hard"
        }
    ];

    const animate = function(time, speed, meshesObj) {
        if (!meshesObj.ciliaList) return;

        const timeScaled = time * speed * 0.005;

        // Metachronal wave for cilia
        meshesObj.ciliaList.forEach(c => {
            // Power stroke and recovery stroke simulation
            const angle = Math.sin(timeScaled + c.phaseOffset) * 0.5 + 0.2; 
            c.mesh.rotation.z = angle;
            // Slight twisting for 3D effect
            c.mesh.rotation.x = Math.cos(timeScaled + c.phaseOffset) * 0.1;
        });

        // Mucus layer undulating gently
        meshesObj.mucus.position.y = 3.5 + Math.sin(timeScaled * 0.5) * 0.1;
        meshesObj.mucus.position.x = Math.sin(timeScaled * 0.2) * 0.2;

        // Particles moving along the "conveyor belt" (X direction)
        meshesObj.particleList.forEach(p => {
            p.mesh.position.x += speed * 0.02;
            p.mesh.position.y = meshesObj.mucus.position.y + 0.3 + Math.sin(timeScaled * 2 + p.x) * 0.05;
            p.mesh.rotation.x += speed * 0.05;
            p.mesh.rotation.y += speed * 0.03;

            // Wrap around for continuous animation
            if (p.mesh.position.x > 5) {
                p.mesh.position.x = -5;
            }
        });
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createTrachealCilia() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
