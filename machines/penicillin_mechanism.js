export function createPenicillinMechanism(THREE) {
    const machine = new THREE.Group();
    const parts = {};

    // 1. Penicillin Molecule
    const penicillinGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const penicillinMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const penicillin = new THREE.Mesh(penicillinGeo, penicillinMat);
    penicillin.position.set(-5, 0, 0);
    penicillin.userData.name = "Penicillin Molecule";
    machine.add(penicillin);
    parts.penicillin = penicillin;

    // 2. Beta-Lactam Ring
    const ringGeo = new THREE.TorusGeometry(0.3, 0.1, 8, 4);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const betaLactamRing = new THREE.Mesh(ringGeo, ringMat);
    betaLactamRing.position.set(0, 0, 0);
    betaLactamRing.userData.name = "Beta-Lactam Ring";
    penicillin.add(betaLactamRing);
    parts.betaLactamRing = betaLactamRing;

    // 3. Bacterial Cell Wall
    const wallGeo = new THREE.BoxGeometry(2, 6, 2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, transparent: true, opacity: 0.8 });
    const cellWall = new THREE.Mesh(wallGeo, wallMat);
    cellWall.position.set(5, 0, 0);
    cellWall.userData.name = "Bacterial Cell Wall";
    machine.add(cellWall);
    parts.cellWall = cellWall;

    // 4. Peptidoglycan Layer
    const peptGeo = new THREE.BoxGeometry(2.1, 5.8, 2.1);
    const peptMat = new THREE.MeshStandardMaterial({ color: 0xCD853F, wireframe: true });
    const peptidoglycan = new THREE.Mesh(peptGeo, peptMat);
    cellWall.add(peptidoglycan);
    peptidoglycan.userData.name = "Peptidoglycan Layer";
    parts.peptidoglycan = peptidoglycan;

    // 5. Penicillin-Binding Protein (PBP)
    const pbpGeo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const pbpMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const pbp = new THREE.Mesh(pbpGeo, pbpMat);
    pbp.position.set(-1.2, 0, 0);
    cellWall.add(pbp);
    pbp.userData.name = "Penicillin-Binding Protein";
    parts.pbp = pbp;

    // 6. Cross-linking Peptide
    const crossGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const crossMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const crossLink = new THREE.Mesh(crossGeo, crossMat);
    crossLink.position.set(0, 1, 0);
    crossLink.userData.name = "Cross-linking Peptide";
    peptidoglycan.add(crossLink);
    parts.crossLink = crossLink;

    // 7. Cleaved Peptidoglycan
    const cleavedGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cleavedMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const cleavedPept = new THREE.Mesh(cleavedGeo, cleavedMat);
    cleavedPept.position.set(0, -1, 0);
    cleavedPept.visible = false;
    peptidoglycan.add(cleavedPept);
    cleavedPept.userData.name = "Cleaved Peptidoglycan";
    parts.cleavedPept = cleavedPept;

    // 8. Water Influx
    const waterGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
    const waterInflux = new THREE.Mesh(waterGeo, waterMat);
    waterInflux.position.set(2, 0, 0);
    machine.add(waterInflux);
    waterInflux.userData.name = "Water Influx";
    parts.waterInflux = waterInflux;

    // 9. Osmotic Lysis
    const lysisGeo = new THREE.DodecahedronGeometry(1.5);
    const lysisMat = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
    const lysis = new THREE.Mesh(lysisGeo, lysisMat);
    lysis.position.set(5, 0, 0);
    machine.add(lysis);
    lysis.userData.name = "Osmotic Lysis";
    parts.lysis = lysis;

    // 10. Bacterial Membrane
    const memGeo = new THREE.BoxGeometry(1.8, 5.6, 1.8);
    const memMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const membrane = new THREE.Mesh(memGeo, memMat);
    membrane.position.set(5, 0, 0);
    machine.add(membrane);
    membrane.userData.name = "Bacterial Membrane";
    parts.membrane = membrane;

    // Animation simulating penicillin binding to PBP, blocking cell wall synthesis, and subsequent lysis.
    let time = 0;
    machine.update = function(delta) {
        time += delta;
        const cycle = time % 10; // 10 second cycle

        if (cycle < 3) {
            // Penicillin approaches PBP
            const progress = cycle / 3;
            penicillin.position.x = -5 + (progress * 8.8); // moving from -5 to 3.8
            
            pbp.material.color.setHex(0x00ff00); // active
            cellWall.scale.set(1, 1, 1);
            membrane.scale.set(1, 1, 1);
            lysis.material.opacity = 0;
            cleavedPept.visible = false;
            crossLink.scale.set(1, 1, 1);
            waterInflux.position.set(10, 0, 0); // hidden / far away
            waterInflux.scale.set(1, 1, 1);
        } else if (cycle < 6) {
            // Binding and blocking
            penicillin.position.x = 3.8;
            pbp.material.color.setHex(0x333333); // blocked PBP
            
            crossLink.scale.set(0.1, 0.1, 0.1);
            cleavedPept.visible = true;
            cleavedPept.rotation.x += 0.05;
            cleavedPept.position.y = -1 - (cycle - 3);
            waterInflux.position.set(5 - ((cycle - 3) * 0.5), 0, 0);
        } else if (cycle < 8) {
            // Water influx and swelling
            cellWall.scale.set(1 + (cycle - 6) * 0.2, 1, 1 + (cycle - 6) * 0.2);
            membrane.scale.set(1 + (cycle - 6) * 0.3, 1 + (cycle - 6) * 0.1, 1 + (cycle - 6) * 0.3);
            waterInflux.scale.set(1 + (cycle - 6), 1 + (cycle - 6), 1 + (cycle - 6));
        } else {
            // Osmotic lysis
            membrane.scale.set(0.01, 0.01, 0.01);
            cellWall.scale.set(0.01, 0.01, 0.01);
            lysis.material.opacity = 0.8 - (cycle - 8) * 0.4;
            lysis.scale.set(1 + (cycle - 8) * 2, 1 + (cycle - 8) * 2, 1 + (cycle - 8) * 2);
            waterInflux.scale.set(0.01, 0.01, 0.01);
            cleavedPept.visible = false;
        }
    };

    machine.questions = [
        {
            question: "What is the primary target of penicillin in bacterial cells?",
            options: ["Ribosomes", "DNA gyrase", "Penicillin-Binding Proteins (PBPs)", "RNA polymerase"],
            correctAnswer: 2
        },
        {
            question: "What is the key structural component of penicillin responsible for its antibacterial activity?",
            options: ["Thiazolidine ring", "Beta-lactam ring", "Acyl side chain", "Carboxyl group"],
            correctAnswer: 1
        },
        {
            question: "How does penicillin lead to bacterial cell death?",
            options: ["By inhibiting protein synthesis", "By causing DNA damage", "By inducing osmotic lysis", "By blocking cellular respiration"],
            correctAnswer: 2
        },
        {
            question: "Which bacterial layer is primarily affected by penicillin?",
            options: ["Outer membrane", "Peptidoglycan layer", "Lipopolysaccharide", "Cytoplasmic membrane"],
            correctAnswer: 1
        },
        {
            question: "What enzymatic function do Penicillin-Binding Proteins (PBPs) normally perform?",
            options: ["DNA replication", "Cross-linking of peptidoglycan strands", "Protein translation", "Lipid synthesis"],
            correctAnswer: 1
        },
        {
            question: "Penicillin is most effective against which type of bacteria?",
            options: ["Gram-negative", "Gram-positive", "Mycobacteria", "Mycoplasma"],
            correctAnswer: 1
        }
    ];

    return machine;
}
