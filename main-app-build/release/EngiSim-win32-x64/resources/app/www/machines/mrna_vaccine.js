export function createmRNAVaccineDelivery(THREE) {
    const model = new THREE.Group();

    // 1. Lipid Nanoparticle (LNP)
    const lnpGeometry = new THREE.SphereGeometry(1, 32, 32);
    const lnpMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.8 });
    const lnp = new THREE.Mesh(lnpGeometry, lnpMaterial);
    lnp.name = 'Lipid Nanoparticle';
    lnp.position.set(-5, 5, 0);
    model.add(lnp);

    // 2. mRNA Strand (inside LNP initially, then moves out)
    const mrnaGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 64, 8);
    const mrnaMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const mrna = new THREE.Mesh(mrnaGeometry, mrnaMaterial);
    mrna.name = 'mRNA Strand';
    mrna.position.set(-5, 5, 0);
    model.add(mrna);

    // 3. Host Cell Membrane
    const cellMembraneGeometry = new THREE.BoxGeometry(20, 0.5, 10);
    const cellMembraneMaterial = new THREE.MeshPhongMaterial({ color: 0xffcccc, transparent: true, opacity: 0.5 });
    const cellMembrane = new THREE.Mesh(cellMembraneGeometry, cellMembraneMaterial);
    cellMembrane.name = 'Host Cell Membrane';
    cellMembrane.position.set(0, 3, 0);
    model.add(cellMembrane);

    // 4. Endosome
    const endosomeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const endosomeMaterial = new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });
    const endosome = new THREE.Mesh(endosomeGeometry, endosomeMaterial);
    endosome.name = 'Endosome';
    endosome.position.set(-3, 1, 0);
    endosome.visible = false;
    model.add(endosome);

    // 5. Ribosome
    const ribosomeGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const ribosomeMaterial = new THREE.MeshPhongMaterial({ color: 0x88ff88 });
    const ribosome = new THREE.Mesh(ribosomeGeometry, ribosomeMaterial);
    ribosome.name = 'Ribosome';
    ribosome.position.set(0, -1, 0);
    model.add(ribosome);

    // 6. Translated Spike Protein
    const spikeGeometry = new THREE.ConeGeometry(0.5, 1.5, 16);
    const spikeMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff });
    const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
    spike.name = 'Translated Spike Protein';
    spike.position.set(0, -1, 0);
    spike.visible = false;
    model.add(spike);

    // 7. Proteasome
    const proteasomeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const proteasomeMaterial = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
    const proteasome = new THREE.Mesh(proteasomeGeometry, proteasomeMaterial);
    proteasome.name = 'Proteasome';
    proteasome.position.set(3, -1, 0);
    model.add(proteasome);

    // 8. MHC Class I Molecule
    const mhcGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.6);
    const mhcMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const mhc = new THREE.Mesh(mhcGeometry, mhcMaterial);
    mhc.name = 'MHC Class I Molecule';
    mhc.position.set(4, 3.5, 0);
    model.add(mhc);

    // 9. T-Cell Receptor
    const tcrGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
    const tcrMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const tcr = new THREE.Mesh(tcrGeometry, tcrMaterial);
    tcr.name = 'T-Cell Receptor';
    tcr.position.set(4, 5, 0);
    tcr.visible = false;
    model.add(tcr);

    // 10. Immune Response Signal
    const signalGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const signalMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const signal = new THREE.Mesh(signalGeometry, signalMaterial);
    signal.name = 'Immune Response Signal';
    signal.position.set(4, 5.5, 0);
    signal.visible = false;
    model.add(signal);

    let time = 0;

    function update(delta) {
        time += delta;
        const cycle = time % 20;

        // Reset visibility to defaults for animation loop
        endosome.visible = false;
        lnp.visible = true;
        mrna.visible = true;
        spike.visible = false;
        tcr.visible = false;
        signal.visible = false;

        if (cycle < 3) {
            // LNP approaches cell membrane
            const t = cycle / 3;
            lnp.position.set(-5 + t * 2, 5 - t * 2, 0);
            mrna.position.copy(lnp.position);
        } else if (cycle < 6) {
            // Endocytosis
            const t = (cycle - 3) / 3;
            lnp.visible = false;
            endosome.visible = true;
            endosome.position.set(-3 + t * 1.5, 3 - t * 2, 0);
            mrna.position.copy(endosome.position);
        } else if (cycle < 9) {
            // Endosomal escape & mRNA moves to Ribosome
            const t = (cycle - 6) / 3;
            endosome.visible = false;
            lnp.visible = false;
            mrna.position.set(-1.5 + t * 1.5, 1 - t * 2, 0);
            mrna.rotation.z += delta;
        } else if (cycle < 12) {
            // Translation at Ribosome
            const t = (cycle - 9) / 3;
            mrna.position.set(0, -1, 0);
            mrna.rotation.x += delta;
            spike.visible = true;
            spike.position.set(0, -1 + t, 0);
            spike.scale.set(t, t, t);
        } else if (cycle < 14) {
            // Spike goes to Proteasome
            const t = (cycle - 12) / 2;
            mrna.position.set(0, -1, 0);
            spike.visible = true;
            spike.position.set(t * 3, -1, 0);
            spike.scale.set(1, 1, 1);
        } else if (cycle < 17) {
            // Presentation by MHC Class I
            const t = (cycle - 14) / 3;
            mrna.visible = false;
            spike.visible = true;
            spike.position.set(3 + t * 1, -1 + t * 4.5, 0);
            spike.scale.set(1 - t * 0.5, 1 - t * 0.5, 1 - t * 0.5);
            mhc.position.set(4, 3.5, 0);
        } else {
            // T-Cell Recognition & Immune Response
            mrna.visible = false;
            spike.visible = true;
            spike.position.set(4, 3.5, 0);
            spike.scale.set(0.5, 0.5, 0.5);
            tcr.visible = true;
            signal.visible = true;
            
            // Signal pulsing
            const pulse = (Math.sin(time * 10) + 1) / 2;
            signal.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        }
    }

    const quiz = [
        {
            question: "What is the primary function of the Lipid Nanoparticle (LNP) in an mRNA vaccine?",
            options: [
                "To cause the disease",
                "To protect the mRNA and facilitate entry into host cells",
                "To act as the active antigen",
                "To destroy the host cell DNA"
            ],
            answer: 1
        },
        {
            question: "What does the mRNA from the vaccine instruct the host cell to produce?",
            options: [
                "Lipid Nanoparticles",
                "Antibiotics",
                "The viral spike protein",
                "Host cell DNA"
            ],
            answer: 2
        },
        {
            question: "Which cellular organelle is responsible for translating the mRNA into the spike protein?",
            options: [
                "Nucleus",
                "Mitochondria",
                "Ribosome",
                "Lysosome"
            ],
            answer: 2
        },
        {
            question: "What role does the Proteasome play in cellular immunity related to mRNA vaccines?",
            options: [
                "It produces mRNA",
                "It transports the LNP",
                "It degrades proteins into peptides for presentation",
                "It translates the mRNA"
            ],
            answer: 2
        },
        {
            question: "Which molecule presents the viral peptides on the surface of the host cell?",
            options: [
                "MHC Class I Molecule",
                "T-Cell Receptor",
                "Endosome",
                "Lipid Nanoparticle"
            ],
            answer: 0
        },
        {
            question: "What happens after the T-Cell Receptor recognizes the presented viral peptide?",
            options: [
                "The cell divides rapidly",
                "An immune response signal is generated to target the antigen",
                "The mRNA is returned to the LNP",
                "The host cell becomes a virus"
            ],
            answer: 1
        }
    ];

    return {
        model,
        update,
        quiz
    };
}
