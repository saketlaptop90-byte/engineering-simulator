export function createPlantCell(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const cellWallMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.3, depthWrite: false });
    const cellMembraneMaterial = new THREE.MeshPhongMaterial({ color: 0x8BC34A, transparent: true, opacity: 0.4, depthWrite: false });
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0x9C27B0 });
    const chloroplastMaterial = new THREE.MeshPhongMaterial({ color: 0x2E7D32 });
    const vacuoleMaterial = new THREE.MeshPhongMaterial({ color: 0x03A9F4, transparent: true, opacity: 0.6, depthWrite: false });
    const mitochondriaMaterial = new THREE.MeshPhongMaterial({ color: 0xFF5722 });
    const golgiMaterial = new THREE.MeshPhongMaterial({ color: 0xFFEB3B });
    const roughERMaterial = new THREE.MeshPhongMaterial({ color: 0x00BCD4 });
    const smoothERMaterial = new THREE.MeshPhongMaterial({ color: 0x009688 });
    const cytoplasmMaterial = new THREE.MeshPhongMaterial({ color: 0xDCEDC8, transparent: true, opacity: 0.1, depthWrite: false });

    // 1. Cell Wall (Box)
    const cellWallGeom = new THREE.BoxGeometry(10, 10, 10);
    const cellWall = new THREE.Mesh(cellWallGeom, cellWallMaterial);
    group.add(cellWall);
    parts.push({ id: 'cell_wall', name: 'Cell Wall', description: 'Provides structural support and protection to the plant cell.' });

    // 2. Cell Membrane (Box slightly smaller)
    const cellMembraneGeom = new THREE.BoxGeometry(9.8, 9.8, 9.8);
    const cellMembrane = new THREE.Mesh(cellMembraneGeom, cellMembraneMaterial);
    group.add(cellMembrane);
    parts.push({ id: 'cell_membrane', name: 'Cell Membrane', description: 'Controls the movement of substances in and out of the cell.' });

    // 3. Nucleus
    const nucleusGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMaterial);
    nucleus.position.set(-2.5, 2, 2);
    group.add(nucleus);
    parts.push({ id: 'nucleus', name: 'Nucleus', description: 'Contains the genetic material and coordinates cell activities.' });

    // 4. Chloroplasts
    const chloroplastsGroup = new THREE.Group();
    const chloroplastGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
    for (let i = 0; i < 6; i++) {
        const chloroplast = new THREE.Mesh(chloroplastGeom, chloroplastMaterial);
        const angle = (i / 6) * Math.PI * 2;
        chloroplast.position.set(Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, -2.5);
        chloroplast.rotation.x = Math.PI / 2;
        chloroplastsGroup.add(chloroplast);
    }
    group.add(chloroplastsGroup);
    parts.push({ id: 'chloroplasts', name: 'Chloroplasts', description: 'Site of photosynthesis, converting solar energy into chemical energy.' });

    // 5. Large Central Vacuole
    const vacuoleGeom = new THREE.BoxGeometry(5, 6, 5);
    const vacuole = new THREE.Mesh(vacuoleGeom, vacuoleMaterial);
    vacuole.position.set(1.5, 0, -1);
    group.add(vacuole);
    parts.push({ id: 'large_central_vacuole', name: 'Large Central Vacuole', description: 'Maintains turgor pressure and stores nutrients and waste products.' });

    // 6. Mitochondria
    const mitochondriaGeom = new THREE.CapsuleGeometry(0.4, 0.8, 4, 8);
    const mitochondria1 = new THREE.Mesh(mitochondriaGeom, mitochondriaMaterial);
    mitochondria1.position.set(-3, -2.5, -2);
    mitochondria1.rotation.z = Math.PI / 4;
    group.add(mitochondria1);
    
    const mitochondria2 = new THREE.Mesh(mitochondriaGeom, mitochondriaMaterial);
    mitochondria2.position.set(3, -3, 3);
    mitochondria2.rotation.z = -Math.PI / 4;
    group.add(mitochondria2);
    parts.push({ id: 'mitochondria', name: 'Mitochondria', description: 'Powerhouse of the cell, generating ATP through cellular respiration.' });

    // 7. Golgi Apparatus
    const golgiGeom = new THREE.TorusGeometry(1.2, 0.2, 8, 24, Math.PI);
    const golgi = new THREE.Mesh(golgiGeom, golgiMaterial);
    golgi.position.set(2, 3, 2);
    golgi.rotation.x = Math.PI / 2;
    group.add(golgi);
    parts.push({ id: 'golgi_apparatus', name: 'Golgi Apparatus', description: 'Modifies, sorts, and packages proteins and lipids for transport.' });

    // 8. Rough ER
    const roughERGeom = new THREE.TorusKnotGeometry(1, 0.2, 64, 8);
    const roughER = new THREE.Mesh(roughERGeom, roughERMaterial);
    roughER.position.set(-2.5, 0, 2);
    group.add(roughER);
    parts.push({ id: 'rough_er', name: 'Rough ER', description: 'Studded with ribosomes, involved in protein synthesis and modification.' });

    // 9. Smooth ER
    const smoothERGeom = new THREE.TorusGeometry(0.8, 0.25, 8, 16);
    const smoothER = new THREE.Mesh(smoothERGeom, smoothERMaterial);
    smoothER.position.set(-2.5, -2, 2);
    smoothER.rotation.y = Math.PI / 2;
    group.add(smoothER);
    parts.push({ id: 'smooth_er', name: 'Smooth ER', description: 'Lacks ribosomes, involved in lipid synthesis and detoxification.' });

    // 10. Cytoplasm
    const cytoplasmGeom = new THREE.BoxGeometry(9.6, 9.6, 9.6);
    const cytoplasm = new THREE.Mesh(cytoplasmGeom, cytoplasmMaterial);
    group.add(cytoplasm);
    parts.push({ id: 'cytoplasm', name: 'Cytoplasm', description: 'Jelly-like substance filling the cell where organelles are suspended.' });

    const update = (delta, time) => {
        // Chloroplasts moving in a circular path representing cyclosis
        chloroplastsGroup.rotation.z = time * 0.3;
        
        // Gentle pulsation of the vacuole
        const scale = 1 + Math.sin(time * 2) * 0.02;
        vacuole.scale.set(scale, scale, scale);
    };

    const quiz = [
        {
            question: "Which organelle is responsible for maintaining turgor pressure in a plant cell?",
            options: ["Nucleus", "Large Central Vacuole", "Mitochondria", "Golgi Apparatus"],
            answer: 1,
            explanation: "The Large Central Vacuole stores water and maintains turgor pressure, keeping the plant cell firm."
        },
        {
            question: "What is the primary function of chloroplasts?",
            options: ["Cellular respiration", "Protein synthesis", "Photosynthesis", "Lipid storage"],
            answer: 2,
            explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis, converting light energy into chemical energy."
        },
        {
            question: "Which structure provides rigidity and protection to the plant cell, but is absent in animal cells?",
            options: ["Cell Membrane", "Cytoplasm", "Cell Wall", "Smooth ER"],
            answer: 2,
            explanation: "The Cell Wall is a rigid outer layer that provides structural support and protection to plant cells."
        },
        {
            question: "Where does cellular respiration primarily occur?",
            options: ["Chloroplasts", "Mitochondria", "Nucleus", "Rough ER"],
            answer: 1,
            explanation: "Mitochondria are known as the powerhouses of the cell because they generate most of the cell's supply of ATP through cellular respiration."
        },
        {
            question: "Which organelle modifies, sorts, and packages proteins?",
            options: ["Smooth ER", "Golgi Apparatus", "Large Central Vacuole", "Nucleus"],
            answer: 1,
            explanation: "The Golgi Apparatus receives proteins from the ER, modifies them, and packages them into vesicles for transport."
        },
        {
            question: "What differentiates the Rough ER from the Smooth ER?",
            options: ["Presence of ribosomes", "Presence of DNA", "Ability to perform photosynthesis", "Location outside the cell membrane"],
            answer: 0,
            explanation: "The Rough ER is studded with ribosomes, which are responsible for protein synthesis, whereas the Smooth ER lacks ribosomes."
        }
    ];

    return {
        id: 'plant_cell',
        name: 'Eukaryotic Plant Cell',
        group,
        update,
        parts,
        quiz
    };
}
