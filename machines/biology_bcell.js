import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom biological/tech materials
    const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a4a75,
        transparent: true,
        opacity: 0.3,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5,
    });

    const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0x2a0040,
    });

    const rerMat = new THREE.MeshStandardMaterial({
        color: 0x20b2aa,
        roughness: 0.7,
        metalness: 0.2,
    });

    const golgiMat = new THREE.MeshStandardMaterial({
        color: 0xff7f50,
        roughness: 0.5,
        metalness: 0.1,
    });

    const antibodyGlowMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
    });

    const vesicleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        transmission: 0.5,
        roughness: 0.1,
    });

    // 1. Cell Membrane (Outer Shell)
    const membraneGeom = new THREE.SphereGeometry(10, 64, 64);
    const membrane = new THREE.Mesh(membraneGeom, membraneMat);
    group.add(membrane);
    parts.push({
        name: "Cell Membrane",
        description: "The protective outer boundary of the B-Cell, controlling what enters and exits. In a factory, this is the security wall.",
        material: membraneMat,
        function: "Protection and regulation",
        assemblyOrder: 1,
        connections: ["Vesicles"],
        failureEffect: "Cell lysis and death",
        cascadeFailures: ["Entire cell destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: membrane
    });

    // 2. Nucleus (Command Center)
    const nucleusGeom = new THREE.SphereGeometry(3, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    group.add(nucleus);
    parts.push({
        name: "Nucleus",
        description: "Contains the DNA blueprints for specific antibodies. Acts as the command center.",
        material: nucleusMat,
        function: "Stores genetic code and regulates transcription",
        assemblyOrder: 2,
        connections: ["RER"],
        failureEffect: "Loss of antibody blueprint",
        cascadeFailures: ["Stops antibody production"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: -5 },
        mesh: nucleus
    });

    // 3. Rough Endoplasmic Reticulum (RER - Factory Floor)
    const rerGeom = new THREE.TorusGeometry(4, 0.8, 16, 64);
    const rer1 = new THREE.Mesh(rerGeom, rerMat);
    rer1.position.set(2, 0, 0);
    rer1.rotation.y = Math.PI / 4;
    const rer2 = new THREE.Mesh(rerGeom, rerMat);
    rer2.position.set(2.5, 0.5, -1);
    rer2.rotation.x = Math.PI / 3;
    
    const rerGroup = new THREE.Group();
    rerGroup.add(rer1, rer2);
    group.add(rerGroup);

    parts.push({
        name: "Rough ER",
        description: "Studded with ribosomes, this is where the raw antibody proteins are synthesized.",
        material: rerMat,
        function: "Protein synthesis",
        assemblyOrder: 3,
        connections: ["Nucleus", "Golgi Apparatus"],
        failureEffect: "Protein synthesis halts",
        cascadeFailures: ["No antibodies delivered to Golgi"],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 5, z: 5 },
        mesh: rerGroup
    });

    // 4. Golgi Apparatus (Packaging Center)
    const golgiGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const golgiGeom = new THREE.CylinderGeometry(2 - i*0.3, 2 - i*0.3, 0.5, 32);
        const g = new THREE.Mesh(golgiGeom, golgiMat);
        g.position.set(0, i * 0.8 - 1, 0);
        golgiGroup.add(g);
    }
    golgiGroup.position.set(5, 0, 2);
    group.add(golgiGroup);

    parts.push({
        name: "Golgi Apparatus",
        description: "Modifies, sorts, and packages the newly made antibodies into secretory vesicles.",
        material: golgiMat,
        function: "Protein processing and packaging",
        assemblyOrder: 4,
        connections: ["RER", "Secretory Vesicles"],
        failureEffect: "Antibodies improperly folded or packaged",
        cascadeFailures: ["Defective immune response"],
        originalPosition: { x: 5, y: 0, z: 2 },
        explodedPosition: { x: 12, y: -5, z: 8 },
        mesh: golgiGroup
    });

    // 5. Antibodies (Products) and Vesicles (Delivery Trucks)
    const transportGroup = new THREE.Group();
    const vesicles = [];
    const antibodies = [];

    // Antibody Geometry (Y-shape)
    const abMaterial = antibodyGlowMat;
    const abGeom = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), abMaterial);
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), abMaterial);
    arm1.position.set(0.1, 0.3, 0);
    arm1.rotation.z = -Math.PI / 4;
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3), abMaterial);
    arm2.position.set(-0.1, 0.3, 0);
    arm2.rotation.z = Math.PI / 4;
    abGeom.add(stem, arm1, arm2);

    for (let i = 0; i < 8; i++) {
        const vesicle = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), vesicleMat);
        
        // Add antibody inside vesicle
        const ab = abGeom.clone();
        vesicle.add(ab);
        
        // Random initial position near Golgi
        const angle = (Math.PI * 2 / 8) * i;
        vesicle.position.set(5 + Math.cos(angle)*1.5, Math.sin(angle)*1.5, 2);
        
        transportGroup.add(vesicle);
        vesicles.push({
            mesh: vesicle,
            angle: angle,
            distance: Math.random(),
            ab: ab
        });
        antibodies.push(ab);
    }
    group.add(transportGroup);

    parts.push({
        name: "Secretory Vesicles & Antibodies",
        description: "Vesicles transport the glowing Y-shaped antibodies from the Golgi to the membrane for secretion.",
        material: vesicleMat,
        function: "Transport and Immune Defense",
        assemblyOrder: 5,
        connections: ["Golgi Apparatus", "Cell Membrane"],
        failureEffect: "Antibodies trapped inside cell",
        cascadeFailures: ["Infection spreads in organism"],
        originalPosition: { x: 5, y: 0, z: 2 },
        explodedPosition: { x: 15, y: 0, z: 0 },
        mesh: transportGroup
    });


    const description = "The B-Cell is the immune system's high-tech manufacturing plant. Once activated by a specific antigen, it ramps up its internal machinery—the Rough ER and Golgi Apparatus—to synthesize, package, and export millions of specialized Y-shaped proteins called antibodies.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Rough Endoplasmic Reticulum in a B-Cell?",
            options: [
                "Storing genetic blueprints",
                "Generating ATP for energy",
                "Synthesizing raw antibody proteins",
                "Destroying invading viruses directly"
            ],
            correct: 2,
            explanation: "The Rough ER is studded with ribosomes, which translate mRNA into raw antibody proteins.",
            difficulty: "Medium"
        },
        {
            question: "Which organelle acts as the 'shipping and packaging center'?",
            options: [
                "Nucleus",
                "Golgi Apparatus",
                "Lysosome",
                "Mitochondrion"
            ],
            correct: 1,
            explanation: "The Golgi apparatus modifies, sorts, and packages the proteins into secretory vesicles.",
            difficulty: "Easy"
        },
        {
            question: "What shape do the glowing antibodies in this model take, reflecting their true biological structure?",
            options: [
                "Spherical",
                "T-shaped",
                "Y-shaped",
                "Double helix"
            ],
            correct: 2,
            explanation: "Antibodies are typically Y-shaped molecules, with two antigen-binding sites on the tips of the 'arms'.",
            difficulty: "Easy"
        },
        {
            question: "How do the antibodies exit the B-Cell?",
            options: [
                "Via exocytosis through secretory vesicles",
                "Through ion channels",
                "By lysing (bursting) the cell",
                "By diffusion across the lipid bilayer"
            ],
            correct: 0,
            explanation: "Secretory vesicles carry antibodies to the cell membrane, fuse with it, and release them outside via exocytosis.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Gently rotate the entire cell to show its 3D nature
        group.rotation.y = time * 0.1 * speed;
        group.rotation.z = Math.sin(time * 0.05 * speed) * 0.1;

        // Pulsate the nucleus slightly
        nucleus.scale.setScalar(1 + Math.sin(time * 2 * speed) * 0.02);

        // Rotate the RER toruses slowly
        rer1.rotation.z = time * 0.5 * speed;
        rer2.rotation.z = -time * 0.4 * speed;

        // Animate the secretory vesicles moving from Golgi to Membrane
        vesicles.forEach((v, index) => {
            // Cycle distance from 0 to 1
            v.distance = (v.distance + 0.005 * speed) % 1;
            
            // Golgi position is roughly (5, 0, 2)
            const startX = 5;
            const startY = 0;
            const startZ = 2;
            
            // Membrane edge is roughly radius 9 away from center
            const targetX = startX + Math.cos(v.angle) * 9;
            const targetY = startY + Math.sin(v.angle) * 9;
            const targetZ = startZ; // Keep it somewhat planar for visual clarity

            // Interpolate position
            v.mesh.position.x = THREE.MathUtils.lerp(startX, targetX, v.distance);
            v.mesh.position.y = THREE.MathUtils.lerp(startY, targetY, v.distance);
            v.mesh.position.z = THREE.MathUtils.lerp(startZ, targetZ, v.distance);

            // Spin the antibody inside the vesicle
            v.ab.rotation.y = time * 2 * speed + index;
            v.ab.rotation.x = time * speed;
            
            // Fade out as it reaches the membrane (exocytosis simulation)
            if (v.distance > 0.9) {
                v.mesh.material.opacity = (1 - v.distance) * 5 * 0.5; // fade vesicle
                v.ab.children.forEach(c => c.material.transparent = true);
                v.ab.children.forEach(c => c.material.opacity = (1 - v.distance) * 5); // fade antibody
            } else {
                v.mesh.material.opacity = 0.5;
                v.ab.children.forEach(c => c.material.opacity = 1);
                v.ab.children.forEach(c => c.material.transparent = false);
            }
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
