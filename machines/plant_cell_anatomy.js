export function createPlantCellAnatomy(THREE) {
    const modelGroup = new THREE.Group();
    const parts = [];

    // Colors
    const colors = {
        cellWall: 0x228B22, // Forest Green
        plasmaMembrane: 0x90EE90, // Light Green
        cytoplasm: 0xE0FFE0, // Very Light Green, transparent
        centralVacuole: 0x87CEFA, // Light Sky Blue
        nucleus: 0x8A2BE2, // Blue Violet
        chloroplast: 0x32CD32, // Lime Green
        mitochondria: 0xFF8C00, // Dark Orange
        golgi: 0xFF69B4, // Hot Pink
        er: 0xBA55D3, // Medium Orchid
        cytoskeleton: 0xD3D3D3 // Light Gray
    };

    // 1. Cell Wall (outermost, rigid, boxy or hexagonal)
    const wallGeo = new THREE.BoxGeometry(10.5, 10.5, 10.5);
    const wallMat = new THREE.MeshStandardMaterial({ 
        color: colors.cellWall, 
        transparent: true, 
        opacity: 0.15, 
        wireframe: true 
    });
    const cellWall = new THREE.Mesh(wallGeo, wallMat);
    cellWall.userData = { name: "Cell Wall" };
    modelGroup.add(cellWall);
    parts.push(cellWall);

    // 2. Plasma Membrane (just inside cell wall)
    const membraneGeo = new THREE.BoxGeometry(10, 10, 10);
    const membraneMat = new THREE.MeshStandardMaterial({ 
        color: colors.plasmaMembrane, 
        transparent: true, 
        opacity: 0.1 
    });
    const plasmaMembrane = new THREE.Mesh(membraneGeo, membraneMat);
    plasmaMembrane.userData = { name: "Plasma Membrane" };
    modelGroup.add(plasmaMembrane);
    parts.push(plasmaMembrane);

    // 3. Cytoplasm (fills the membrane)
    const cytoGeo = new THREE.BoxGeometry(9.8, 9.8, 9.8);
    const cytoMat = new THREE.MeshStandardMaterial({ 
        color: colors.cytoplasm, 
        transparent: true, 
        opacity: 0.05 
    });
    const cytoplasm = new THREE.Mesh(cytoGeo, cytoMat);
    cytoplasm.userData = { name: "Cytoplasm" };
    modelGroup.add(cytoplasm);
    parts.push(cytoplasm);

    // 4. Central Vacuole (large, occupies center)
    const vacGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const vacMat = new THREE.MeshStandardMaterial({ 
        color: colors.centralVacuole, 
        transparent: true, 
        opacity: 0.6 
    });
    const centralVacuole = new THREE.Mesh(vacGeo, vacMat);
    centralVacuole.position.set(0, 0, 0);
    centralVacuole.userData = { name: "Central Vacuole" };
    modelGroup.add(centralVacuole);
    parts.push(centralVacuole);

    // 5. Nucleus (pushed to the side)
    const nucleusGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: colors.nucleus });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleus.position.set(-2.5, 2.5, 2.5);
    nucleus.userData = { name: "Nucleus" };
    modelGroup.add(nucleus);
    parts.push(nucleus);

    // 6. Chloroplasts (multiple, distributed in cytoplasm)
    const chloroplastGroup = new THREE.Group();
    chloroplastGroup.userData = { name: "Chloroplasts" };
    const chloroGeo = new THREE.CapsuleGeometry(0.5, 0.5, 8, 16);
    const chloroMat = new THREE.MeshStandardMaterial({ color: colors.chloroplast });
    const chloroPositions = [
        [3, 3, 2], [-2, -3, 3], [2, -2, -3], [0, 4, -2], [-3, -1, -3]
    ];
    chloroPositions.forEach(pos => {
        const chloro = new THREE.Mesh(chloroGeo, chloroMat);
        chloro.position.set(pos[0], pos[1], pos[2]);
        chloro.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        chloroplastGroup.add(chloro);
    });
    modelGroup.add(chloroplastGroup);
    parts.push(chloroplastGroup);

    // 7. Mitochondria
    const mitoGroup = new THREE.Group();
    mitoGroup.userData = { name: "Mitochondria" };
    const mitoGeo = new THREE.CapsuleGeometry(0.3, 0.6, 8, 16);
    const mitoMat = new THREE.MeshStandardMaterial({ color: colors.mitochondria });
    const mitoPositions = [
        [4, -1, 1], [-4, -1, -2], [1, 3, 3], [-1, -4, 1]
    ];
    mitoPositions.forEach(pos => {
        const mito = new THREE.Mesh(mitoGeo, mitoMat);
        mito.position.set(pos[0], pos[1], pos[2]);
        mito.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mitoGroup.add(mito);
    });
    modelGroup.add(mitoGroup);
    parts.push(mitoGroup);

    // 8. Golgi Apparatus (near nucleus)
    const golgiGroup = new THREE.Group();
    golgiGroup.userData = { name: "Golgi Apparatus" };
    const golgiMat = new THREE.MeshStandardMaterial({ color: colors.golgi });
    for (let i = 0; i < 4; i++) {
        const golgiGeo = new THREE.TorusGeometry(0.6 + i*0.1, 0.1, 16, 50, Math.PI);
        const g = new THREE.Mesh(golgiGeo, golgiMat);
        g.position.set(-1.5 + i*0.1, 1.5, 3.5);
        g.rotation.x = Math.PI / 2;
        g.rotation.y = Math.PI / 4;
        golgiGroup.add(g);
    }
    modelGroup.add(golgiGroup);
    parts.push(golgiGroup);

    // 9. Endoplasmic Reticulum (surrounding nucleus)
    const erGroup = new THREE.Group();
    erGroup.userData = { name: "Endoplasmic Reticulum" };
    const erMat = new THREE.MeshStandardMaterial({ color: colors.er, wireframe: true });
    const erGeo = new THREE.TorusGeometry(1.6, 0.3, 16, 50);
    const er1 = new THREE.Mesh(erGeo, erMat);
    er1.position.copy(nucleus.position);
    er1.rotation.x = Math.PI/3;
    const er2 = new THREE.Mesh(erGeo, erMat);
    er2.position.copy(nucleus.position);
    er2.rotation.y = Math.PI/3;
    erGroup.add(er1, er2);
    modelGroup.add(erGroup);
    parts.push(erGroup);

    // 10. Cytoskeleton (network of fibers)
    const cytoSkelGroup = new THREE.Group();
    cytoSkelGroup.userData = { name: "Cytoskeleton" };
    const skelMat = new THREE.LineBasicMaterial({ color: colors.cytoskeleton, transparent: true, opacity: 0.3 });
    for (let i = 0; i < 30; i++) {
        const points = [];
        points.push(new THREE.Vector3( (Math.random()-0.5)*9, (Math.random()-0.5)*9, (Math.random()-0.5)*9 ));
        points.push(new THREE.Vector3( (Math.random()-0.5)*9, (Math.random()-0.5)*9, (Math.random()-0.5)*9 ));
        const skelGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(skelGeo, skelMat);
        cytoSkelGroup.add(line);
    }
    modelGroup.add(cytoSkelGroup);
    parts.push(cytoSkelGroup);

    let time = 0;
    const animate = () => {
        time += 0.03;
        
        // Pulsing of the central vacuole to maintain turgor pressure representation
        const scale = 1 + 0.05 * Math.sin(time);
        centralVacuole.scale.set(scale, scale, scale);

        // Cytoplasmic streaming represented by rotating organelle groups
        chloroplastGroup.rotation.y = time * 0.2;
        chloroplastGroup.rotation.z = time * 0.1;
        
        mitoGroup.rotation.y = -time * 0.15;
        mitoGroup.rotation.x = -time * 0.08;
    };

    const questions = [
        {
            question: "Which organelle is unique to plant cells and is responsible for photosynthesis?",
            options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
            correctAnswer: 1
        },
        {
            question: "What is the primary function of the Central Vacuole in a plant cell?",
            options: ["Generating ATP", "Synthesizing proteins", "Storing water and maintaining turgor pressure", "Controlling cellular activities"],
            correctAnswer: 2
        },
        {
            question: "What structure provides rigidity and structural support to plant cells, outside the plasma membrane?",
            options: ["Cytoskeleton", "Cell Wall", "Endoplasmic Reticulum", "Golgi Apparatus"],
            correctAnswer: 1
        },
        {
            question: "Which organelle is known as the powerhouse of the cell, generating energy even in plant cells?",
            options: ["Chloroplast", "Central Vacuole", "Mitochondria", "Nucleus"],
            correctAnswer: 2
        },
        {
            question: "What does the Golgi Apparatus do in a plant cell?",
            options: ["Modifies, sorts, and packages proteins and lipids", "Stores genetic information", "Performs photosynthesis", "Breaks down cellular waste"],
            correctAnswer: 0
        },
        {
            question: "Which part of the plant cell contains the genetic material (DNA)?",
            options: ["Cytoplasm", "Nucleus", "Ribosomes", "Plasma Membrane"],
            correctAnswer: 1
        }
    ];

    return {
        model: modelGroup,
        parts: parts,
        animate: animate,
        questions: questions
    };
}
