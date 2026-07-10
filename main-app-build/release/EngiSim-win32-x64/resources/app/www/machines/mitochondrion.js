export function createMitochondrion(THREE) {
    const group = new THREE.Group();

    const parts = [
        { id: 'outer-membrane', name: 'Outer Membrane', description: 'The smooth outer covering of the mitochondrion.' },
        { id: 'inner-membrane', name: 'Inner Membrane', description: 'The highly folded inner membrane.' },
        { id: 'cristae', name: 'Cristae', description: 'The folds of the inner membrane that increase surface area.' },
        { id: 'matrix', name: 'Matrix', description: 'The fluid-filled internal space containing enzymes and DNA.' },
        { id: 'mitochondrial-dna', name: 'Mitochondrial DNA', description: 'Circular DNA molecules found in the matrix.' },
        { id: 'ribosomes', name: 'Ribosomes', description: 'Small structures responsible for protein synthesis.' },
        { id: 'atp-synthase', name: 'ATP Synthase', description: 'Enzymes on the inner membrane that produce ATP.' },
        { id: 'intermembrane-space', name: 'Intermembrane Space', description: 'The space between the inner and outer membranes.' },
        { id: 'porins', name: 'Porins', description: 'Proteins in the outer membrane allowing passage of molecules.' },
        { id: 'granules', name: 'Granules', description: 'Structures in the matrix often storing calcium and other ions.' }
    ];

    // 1. Outer Membrane (Capsule shape - Sphere stretched)
    const outerMembraneGeo = new THREE.CapsuleGeometry(2.2, 4, 16, 32);
    const outerMembraneMat = new THREE.MeshPhongMaterial({ color: 0xcc5500, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const outerMembrane = new THREE.Mesh(outerMembraneGeo, outerMembraneMat);
    outerMembrane.rotation.z = Math.PI / 2;
    outerMembrane.userData.id = 'outer-membrane';
    group.add(outerMembrane);

    // 2. Inner Membrane
    const innerMembraneGeo = new THREE.CapsuleGeometry(2.0, 3.8, 16, 32);
    const innerMembraneMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const innerMembrane = new THREE.Mesh(innerMembraneGeo, innerMembraneMat);
    innerMembrane.rotation.z = Math.PI / 2;
    innerMembrane.userData.id = 'inner-membrane';
    group.add(innerMembrane);

    // 3. Cristae
    const cristaeGroup = new THREE.Group();
    const cristaGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 16);
    const cristaMat = new THREE.MeshPhongMaterial({ color: 0xffbb33 });
    for(let i = -1.5; i <= 1.5; i += 0.5) {
        const crista = new THREE.Mesh(cristaGeo, cristaMat);
        crista.position.x = i;
        crista.rotation.z = Math.PI / 2;
        cristaeGroup.add(crista);
    }
    cristaeGroup.userData.id = 'cristae';
    group.add(cristaeGroup);

    // 4. Matrix
    const matrixGeo = new THREE.CapsuleGeometry(1.9, 3.6, 16, 32);
    const matrixMat = new THREE.MeshPhongMaterial({ color: 0xffdd88, transparent: true, opacity: 0.3 });
    const matrix = new THREE.Mesh(matrixGeo, matrixMat);
    matrix.rotation.z = Math.PI / 2;
    matrix.userData.id = 'matrix';
    group.add(matrix);

    // 5. Mitochondrial DNA
    const dnaGroup = new THREE.Group();
    const dnaGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 24);
    const dnaMat = new THREE.MeshPhongMaterial({ color: 0x55ff55 });
    for(let i = 0; i < 3; i++) {
        const dna = new THREE.Mesh(dnaGeo, dnaMat);
        dna.position.set(Math.random() * 2 - 1, Math.random() - 0.5, Math.random() - 0.5);
        dna.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dnaGroup.add(dna);
    }
    dnaGroup.userData.id = 'mitochondrial-dna';
    group.add(dnaGroup);

    // 6. Ribosomes
    const ribosomesGroup = new THREE.Group();
    const riboGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const riboMat = new THREE.MeshPhongMaterial({ color: 0x8888ff });
    for(let i = 0; i < 30; i++) {
        const ribo = new THREE.Mesh(riboGeo, riboMat);
        ribo.position.set(Math.random() * 3 - 1.5, Math.random() * 1.5 - 0.75, Math.random() * 1.5 - 0.75);
        ribosomesGroup.add(ribo);
    }
    ribosomesGroup.userData.id = 'ribosomes';
    group.add(ribosomesGroup);

    // 7. ATP Synthase
    const atpSynthaseGroup = new THREE.Group();
    const atpGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const atpMat = new THREE.MeshPhongMaterial({ color: 0xff4444 });
    const synthases = [];
    for(let i = -1.2; i <= 1.2; i += 0.8) {
        const atp = new THREE.Mesh(atpGeo, atpMat);
        atp.position.set(i, 1.8, 0);
        synthases.push(atp);
        atpSynthaseGroup.add(atp);
    }
    atpSynthaseGroup.userData.id = 'atp-synthase';
    group.add(atpSynthaseGroup);

    // 8. Intermembrane Space
    const imSpaceGeo = new THREE.CapsuleGeometry(2.1, 3.9, 16, 32);
    const imSpaceMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.1 });
    const imSpace = new THREE.Mesh(imSpaceGeo, imSpaceMat);
    imSpace.rotation.z = Math.PI / 2;
    imSpace.userData.id = 'intermembrane-space';
    group.add(imSpace);

    // 9. Porins
    const porinsGroup = new THREE.Group();
    const porinGeo = new THREE.TorusGeometry(0.1, 0.05, 8, 16);
    const porinMat = new THREE.MeshPhongMaterial({ color: 0x3333ff });
    for(let i = 0; i < 15; i++) {
        const porin = new THREE.Mesh(porinGeo, porinMat);
        const theta = Math.random() * Math.PI * 2;
        const y = Math.random() * 4 - 2;
        porin.position.set(y, Math.cos(theta) * 2.2, Math.sin(theta) * 2.2);
        porin.lookAt(new THREE.Vector3(y, 0, 0));
        porinsGroup.add(porin);
    }
    porinsGroup.userData.id = 'porins';
    group.add(porinsGroup);

    // 10. Granules
    const granulesGroup = new THREE.Group();
    const granuleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const granuleMat = new THREE.MeshPhongMaterial({ color: 0x44ffaa });
    for(let i = 0; i < 8; i++) {
        const granule = new THREE.Mesh(granuleGeo, granuleMat);
        granule.position.set(Math.random() * 2 - 1, Math.random() - 0.5, Math.random() - 0.5);
        granulesGroup.add(granule);
    }
    granulesGroup.userData.id = 'granules';
    group.add(granulesGroup);

    const quiz = [
        {
            question: "What is the primary function of the mitochondrion?",
            options: ["Protein synthesis", "Photosynthesis", "ATP production", "Lipid storage"],
            answer: 2,
            explanation: "Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
        },
        {
            question: "What are the folds of the inner mitochondrial membrane called?",
            options: ["Matrix", "Cristae", "Granules", "Porins"],
            answer: 1,
            explanation: "Cristae are the folds of the inner mitochondrial membrane that increase its surface area for ATP production."
        },
        {
            question: "Where is mitochondrial DNA located?",
            options: ["Outer Membrane", "Intermembrane Space", "Matrix", "Cristae"],
            answer: 2,
            explanation: "Mitochondrial DNA is found in the fluid-filled matrix of the mitochondrion."
        },
        {
            question: "Which enzyme is responsible for synthesizing ATP?",
            options: ["RNA polymerase", "ATP Synthase", "Helicase", "Lipase"],
            answer: 1,
            explanation: "ATP Synthase is the enzyme complex on the inner membrane that synthesizes ATP from ADP."
        },
        {
            question: "What do porins do in the outer membrane?",
            options: ["Synthesize ATP", "Allow passage of molecules", "Store calcium", "Replicate DNA"],
            answer: 1,
            explanation: "Porins form channels that allow molecules to freely pass through the outer mitochondrial membrane."
        },
        {
            question: "What is found in the mitochondrial matrix?",
            options: ["Enzymes, DNA, and ribosomes", "Only water", "Chlorophyll", "Chromatin"],
            answer: 0,
            explanation: "The mitochondrial matrix contains enzymes for the citric acid cycle, mitochondrial DNA, and ribosomes."
        }
    ];

    function update(delta, time) {
        // Rotate ATP Synthase
        synthases.forEach((synthase, index) => {
            synthase.rotation.y += 2 * delta * (index % 2 === 0 ? 1 : -1);
        });

        // Gently float the mitochondrion
        group.rotation.x = Math.sin(time * 0.5) * 0.1;
        group.rotation.y = Math.cos(time * 0.3) * 0.1;
        group.position.y = Math.sin(time) * 0.2;
    }

    return {
        id: 'mitochondrion',
        name: 'Mitochondrial Structure',
        group,
        update,
        parts,
        quiz
    };
}
