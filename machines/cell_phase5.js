import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const cellMembraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2288ff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const chromosomeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        roughness: 0.2
    });

    const spindleMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });

    const centrosomeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1.2,
        roughness: 0.1
    });

    // 1. Cleavage Furrow / Membrane (Cytokinesis)
    const membraneGeo = new THREE.SphereGeometry(3, 32, 32);
    const leftCellGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const leftCell = new THREE.Mesh(leftCellGeo, cellMembraneMaterial);
    leftCell.position.set(-1.5, 0, 0);
    group.add(leftCell);

    parts.push({
        name: 'Left Daughter Cell Membrane',
        description: 'The plasma membrane of the first resulting daughter cell after cytokinesis begins.',
        material: cellMembraneMaterial,
        function: 'Encloses the cellular contents and separates them from the environment.',
        assemblyOrder: 1,
        connections: ['Right Daughter Cell Membrane', 'Left Nucleus'],
        failureEffect: 'Cell lysis and death due to incomplete separation.',
        cascadeFailures: ['Cell cycle arrest'],
        originalPosition: { x: -1.5, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: 0 }
    });

    const rightCellGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const rightCell = new THREE.Mesh(rightCellGeo, cellMembraneMaterial);
    rightCell.position.set(1.5, 0, 0);
    group.add(rightCell);

    parts.push({
        name: 'Right Daughter Cell Membrane',
        description: 'The plasma membrane of the second resulting daughter cell.',
        material: cellMembraneMaterial,
        function: 'Encloses the cellular contents and separates them from the environment.',
        assemblyOrder: 2,
        connections: ['Left Daughter Cell Membrane', 'Right Nucleus'],
        failureEffect: 'Cell lysis and death due to incomplete separation.',
        cascadeFailures: ['Cell cycle arrest'],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 0, z: 0 }
    });

    // 2. Chromosomes (Replicated and separated)
    const chromosomesGroup = new THREE.Group();
    const chromoGeo = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8);
    
    // Left chromosomes
    for(let i=0; i<4; i++) {
        const chromo = new THREE.Mesh(chromoGeo, chromosomeMaterial);
        chromo.position.set(-1.5 + (Math.random() - 0.5)*1, (Math.random() - 0.5)*1, (Math.random() - 0.5)*1);
        chromo.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        chromosomesGroup.add(chromo);
    }
    // Right chromosomes
    for(let i=0; i<4; i++) {
        const chromo = new THREE.Mesh(chromoGeo, chromosomeMaterial);
        chromo.position.set(1.5 + (Math.random() - 0.5)*1, (Math.random() - 0.5)*1, (Math.random() - 0.5)*1);
        chromo.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        chromosomesGroup.add(chromo);
    }
    group.add(chromosomesGroup);

    parts.push({
        name: 'Chromatids / Chromosomes',
        description: 'Separated sister chromatids that are now individual chromosomes in each daughter cell.',
        material: chromosomeMaterial,
        function: 'Carries the genetic information (DNA) for the cell.',
        assemblyOrder: 3,
        connections: ['Mitotic Spindle', 'Nucleus'],
        failureEffect: 'Aneuploidy (incorrect number of chromosomes), leading to cell death or cancer.',
        cascadeFailures: ['Genetic disorders', 'Apoptosis'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 3. Centrosomes
    const centroGeo = new THREE.DodecahedronGeometry(0.2);
    const leftCentro = new THREE.Mesh(centroGeo, centrosomeMaterial);
    leftCentro.position.set(-2.5, 0, 0);
    group.add(leftCentro);
    
    const rightCentro = new THREE.Mesh(centroGeo, centrosomeMaterial);
    rightCentro.position.set(2.5, 0, 0);
    group.add(rightCentro);

    parts.push({
        name: 'Centrosomes',
        description: 'Microtubule organizing centers that pull the chromatids apart.',
        material: centrosomeMaterial,
        function: 'Organizes the spindle fibers to ensure even distribution of chromosomes.',
        assemblyOrder: 4,
        connections: ['Mitotic Spindle'],
        failureEffect: 'Uneven chromosome separation (nondisjunction).',
        cascadeFailures: ['Aneuploidy', 'Cell cycle arrest'],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -2.5, y: -2, z: 0 }
    });

    // 4. Mitotic Spindles
    const spindleGeo = new THREE.BufferGeometry();
    const spindlePoints = [];
    for(let i=0; i<20; i++) {
        // Left side spindles
        spindlePoints.push(-2.5, 0, 0); // from centrosome
        spindlePoints.push(-1.5 + (Math.random() - 0.5)*1, (Math.random() - 0.5)*1, (Math.random() - 0.5)*1); // to chromosomes
        // Right side spindles
        spindlePoints.push(2.5, 0, 0); // from centrosome
        spindlePoints.push(1.5 + (Math.random() - 0.5)*1, (Math.random() - 0.5)*1, (Math.random() - 0.5)*1); // to chromosomes
    }
    spindleGeo.setAttribute('position', new THREE.Float32BufferAttribute(spindlePoints, 3));
    const spindles = new THREE.LineSegments(spindleGeo, spindleMaterial);
    group.add(spindles);

    parts.push({
        name: 'Mitotic Spindles (Microtubules)',
        description: 'Protein fibers that attach to chromosomes and pull them to opposite poles.',
        material: spindleMaterial,
        function: 'Physically separates sister chromatids during anaphase.',
        assemblyOrder: 5,
        connections: ['Centrosomes', 'Kinetochores'],
        failureEffect: 'Chromosomes fail to separate, resulting in polyploidy or cell death.',
        cascadeFailures: ['Aneuploidy', 'Tumorigenesis'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 }
    });

    // 5. Cleavage Furrow Ring (Actin-Myosin contractile ring)
    const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0x880000, emissiveIntensity: 0.8, roughness: 0.3 });
    const contractileRing = new THREE.Mesh(ringGeo, ringMat);
    contractileRing.rotation.y = Math.PI / 2;
    group.add(contractileRing);

    parts.push({
        name: 'Actin-Myosin Contractile Ring',
        description: 'A ring of actin and myosin filaments that pinches the cell in two during cytokinesis.',
        material: plastic,
        function: 'Creates the cleavage furrow, ultimately dividing the cytoplasm.',
        assemblyOrder: 6,
        connections: ['Cell Membrane'],
        failureEffect: 'Binucleated cells (one cell with two nuclei).',
        cascadeFailures: ['Cell division failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    const description = "Phase 5: Mitosis & Cytokinesis. The final stage of cell division where replicated chromosomes are pulled apart by the mitotic spindle, and the cell membrane is pinched by the contractile ring to form two independent daughter cells.";

    const quizQuestions = [
        {
            question: "Which structure is primarily responsible for physically pinching the animal cell into two during cytokinesis?",
            options: ["Mitotic Spindle", "Centrosome", "Actin-Myosin Contractile Ring", "Cell Wall"],
            correct: 2,
            explanation: "In animal cells, cytokinesis is driven by a contractile ring composed of actin and myosin filaments that forms a cleavage furrow, pinching the cell in two.",
            difficulty: "Medium"
        },
        {
            question: "What would be the direct result if the mitotic spindles failed to attach to the kinetochores of some chromosomes?",
            options: ["The cell would immediately undergo cytokinesis.", "Uneven distribution of chromosomes (aneuploidy) in daughter cells.", "The cell wall would collapse.", "The contractile ring would contract faster."],
            correct: 1,
            explanation: "If spindle fibers fail to attach properly, chromosomes won't separate evenly during anaphase, leading to daughter cells with abnormal chromosome numbers (aneuploidy).",
            difficulty: "Hard"
        },
        {
            question: "Which organelle serves as the microtubule organizing center to generate the mitotic spindle?",
            options: ["Mitochondrion", "Ribosome", "Nucleolus", "Centrosome"],
            correct: 3,
            explanation: "The centrosome contains centrioles and organizes the microtubules that form the mitotic spindle during cell division.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate chromosome emission
        chromosomeMaterial.emissiveIntensity = 1.0 + Math.sin(time * speed * 5) * 0.5;
        
        // Spin centrosomes
        leftCentro.rotation.x = time * speed;
        leftCentro.rotation.y = time * speed * 1.2;
        rightCentro.rotation.x = -time * speed;
        rightCentro.rotation.y = -time * speed * 1.2;

        // Simulate cleavage furrow pinching (contractile ring shrinks slightly, cells move apart)
        const splitOffset = Math.sin(time * speed) * 0.5 + 0.5; // 0 to 1
        leftCell.position.x = -1.5 - splitOffset;
        rightCell.position.x = 1.5 + splitOffset;
        
        // Shrink the ring as the cell divides
        const scale = 1 - (splitOffset * 0.5);
        contractileRing.scale.set(scale, scale, scale);

        // Slowly rotate chromosomes
        chromosomesGroup.children.forEach((c, idx) => {
            c.rotation.x += 0.01 * speed;
            c.rotation.y += 0.015 * speed;
            c.position.y += Math.sin(time * speed * 10 + idx) * 0.01;
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
export function createCellPhase5() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
