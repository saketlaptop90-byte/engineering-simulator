export function createPlantCellStructure(THREE) {
    const group = new THREE.Group();

    // 1. Cell Wall (outermost rigid layer)
    const cellWallGeom = new THREE.BoxGeometry(12, 16, 12);
    const cellWallMat = new THREE.MeshPhongMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const cellWall = new THREE.Mesh(cellWallGeom, cellWallMat);
    cellWall.userData = { id: 'cell_wall', name: 'Cell Wall' };
    group.add(cellWall);

    // 2. Plasma Membrane (inner boundary)
    const membraneGeom = new THREE.BoxGeometry(11.8, 15.8, 11.8);
    const membraneMat = new THREE.MeshPhongMaterial({ color: 0x81C784, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const plasmaMembrane = new THREE.Mesh(membraneGeom, membraneMat);
    plasmaMembrane.userData = { id: 'plasma_membrane', name: 'Plasma Membrane' };
    group.add(plasmaMembrane);

    // 3. Cytoplasm (jelly-like substance filling the cell)
    const cytoplasmGeom = new THREE.BoxGeometry(11.5, 15.5, 11.5);
    const cytoplasmMat = new THREE.MeshPhongMaterial({ color: 0xE8F5E9, transparent: true, opacity: 0.1 });
    const cytoplasm = new THREE.Mesh(cytoplasmGeom, cytoplasmMat);
    cytoplasm.userData = { id: 'cytoplasm', name: 'Cytoplasm' };
    group.add(cytoplasm);

    // 4. Central Vacuole (large central sac)
    const vacuoleGeom = new THREE.SphereGeometry(3.5, 32, 32);
    const vacuoleMat = new THREE.MeshPhongMaterial({ color: 0x4DD0E1, transparent: true, opacity: 0.6 });
    const centralVacuole = new THREE.Mesh(vacuoleGeom, vacuoleMat);
    centralVacuole.position.set(0, 1.5, 0);
    centralVacuole.scale.set(1.2, 1.5, 1);
    centralVacuole.userData = { id: 'central_vacuole', name: 'Central Vacuole' };
    group.add(centralVacuole);

    // 5. Nucleus (control center)
    const nucleusGeom = new THREE.SphereGeometry(2, 32, 32);
    const nucleusMat = new THREE.MeshPhongMaterial({ color: 0x9C27B0 });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    nucleus.position.set(-2.5, -4, 2.5);
    nucleus.userData = { id: 'nucleus', name: 'Nucleus' };
    group.add(nucleus);

    // 6. Mitochondrion (powerhouse)
    const mitoGeom = new THREE.CapsuleGeometry(0.8, 1.5, 16, 16);
    const mitoMat = new THREE.MeshPhongMaterial({ color: 0xFF9800 });
    const mitochondrion = new THREE.Mesh(mitoGeom, mitoMat);
    mitochondrion.position.set(3, -3, -2);
    mitochondrion.rotation.z = Math.PI / 4;
    mitochondrion.userData = { id: 'mitochondrion', name: 'Mitochondrion' };
    group.add(mitochondrion);

    // 7. Golgi Apparatus (packaging center)
    const golgiGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const golgiSackGeom = new THREE.TorusGeometry(1.5 - i * 0.2, 0.2, 8, 24, Math.PI);
        const golgiSackMat = new THREE.MeshPhongMaterial({ color: 0xF44336 });
        const sack = new THREE.Mesh(golgiSackGeom, golgiSackMat);
        sack.position.set(0, i * 0.3, 0);
        sack.rotation.x = -Math.PI / 2;
        golgiGroup.add(sack);
    }
    golgiGroup.position.set(-3, 2, -3);
    golgiGroup.userData = { id: 'golgi_apparatus', name: 'Golgi Apparatus' };
    group.add(golgiGroup);

    // 8. Endoplasmic Reticulum (network of membranes)
    const erGeom = new THREE.TorusGeometry(2.5, 0.4, 16, 64, Math.PI * 1.5);
    const erMat = new THREE.MeshPhongMaterial({ color: 0x2196F3 });
    const er = new THREE.Mesh(erGeom, erMat);
    er.position.set(-2.5, -4, 2.5); // wrapped around nucleus
    er.rotation.x = Math.PI / 2;
    er.userData = { id: 'endoplasmic_reticulum', name: 'Endoplasmic Reticulum' };
    group.add(er);

    // 9. Ribosomes (protein synthesis)
    const ribosomeGroup = new THREE.Group();
    const riboGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const riboMat = new THREE.MeshPhongMaterial({ color: 0x000000 });
    for (let i = 0; i < 30; i++) {
        const ribosome = new THREE.Mesh(riboGeom, riboMat);
        // scattered around ER and cytoplasm
        ribosome.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8);
        ribosomeGroup.add(ribosome);
    }
    ribosomeGroup.userData = { id: 'ribosomes', name: 'Ribosomes' };
    group.add(ribosomeGroup);

    // 10. Cytoskeleton (structural support)
    const cytoskeletonGroup = new THREE.Group();
    const filamentMat = new THREE.LineBasicMaterial({ color: 0x9E9E9E, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 15; i++) {
        const points = [];
        points.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10));
        points.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10));
        const filamentGeom = new THREE.BufferGeometry().setFromPoints(points);
        const filament = new THREE.Line(filamentGeom, filamentMat);
        cytoskeletonGroup.add(filament);
    }
    cytoskeletonGroup.userData = { id: 'cytoskeleton', name: 'Cytoskeleton' };
    group.add(cytoskeletonGroup);

    // Animation: Cytoplasmic streaming (cyclosis) & Vacuole pulsating
    const clock = new THREE.Clock();
    let initialVacuoleScale = centralVacuole.scale.clone();
    
    function animate(delta, time) {
        // Pulsate vacuole to simulate water intake/turgor pressure variation
        const scaleFactor = 1 + Math.sin(time * 2) * 0.05;
        centralVacuole.scale.set(
            initialVacuoleScale.x * scaleFactor,
            initialVacuoleScale.y * scaleFactor,
            initialVacuoleScale.z * scaleFactor
        );

        // Rotate ribosomes slowly around center to simulate cyclosis (streaming)
        ribosomeGroup.rotation.y = time * 0.1;
        
        // Slightly move the mitochondria
        mitochondrion.rotation.x = time * 0.5;
        mitochondrion.rotation.y = time * 0.3;
    }

    const questions = [
        {
            question: "Which structure is primarily responsible for maintaining the shape and rigidity of the plant cell?",
            options: ["Cell Wall", "Plasma Membrane", "Cytoplasm", "Endoplasmic Reticulum"],
            correctAnswer: 0,
            explanation: "The Cell Wall provides structural support, protection, and maintains the shape of the plant cell."
        },
        {
            question: "Which organelle stores water, nutrients, and waste products, often taking up most of the plant cell's volume?",
            options: ["Nucleus", "Central Vacuole", "Golgi Apparatus", "Mitochondrion"],
            correctAnswer: 1,
            explanation: "The Central Vacuole stores water, maintains turgor pressure, and holds nutrients and waste products."
        },
        {
            question: "What is the function of ribosomes in a plant cell?",
            options: ["Energy production", "Photosynthesis", "Protein synthesis", "Lipid synthesis"],
            correctAnswer: 2,
            explanation: "Ribosomes are the site of protein synthesis in the cell, translating RNA into proteins."
        },
        {
            question: "Which part of the plant cell is known as the 'powerhouse' because it generates most of the cell's supply of ATP?",
            options: ["Chloroplast", "Golgi Apparatus", "Mitochondrion", "Nucleus"],
            correctAnswer: 2,
            explanation: "The Mitochondrion is responsible for cellular respiration, generating ATP (energy) for the cell."
        },
        {
            question: "What does the Golgi Apparatus do in a plant cell?",
            options: ["Synthesizes DNA", "Modifies, sorts, and packages proteins and lipids", "Breaks down cellular waste", "Controls cell division"],
            correctAnswer: 1,
            explanation: "The Golgi Apparatus modifies, sorts, and packages proteins and lipids for transport."
        },
        {
            question: "Which structure acts as a network of protein filaments that helps maintain the cell's shape and organizes its parts?",
            options: ["Cytoskeleton", "Endoplasmic Reticulum", "Plasma Membrane", "Cytoplasm"],
            correctAnswer: 0,
            explanation: "The Cytoskeleton provides structural support, facilitates cell movement, and organizes organelles within the cell."
        }
    ];

    return {
        group,
        animate,
        questions
    };
}
