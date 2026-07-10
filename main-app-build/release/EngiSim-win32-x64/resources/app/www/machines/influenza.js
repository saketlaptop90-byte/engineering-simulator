export function createInfluenza(THREE) {
    const group = new THREE.Group();
    group.parts = [];

    // 1. Lipid Envelope
    const envelopeGeo = new THREE.SphereGeometry(5, 64, 64);
    const envelopeMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x8aa8a0, 
        transparent: true, 
        opacity: 0.35,
        roughness: 0.2,
        transmission: 0.5,
        thickness: 0.5
    });
    const lipidEnvelope = new THREE.Mesh(envelopeGeo, envelopeMat);
    lipidEnvelope.userData = { id: 'lipid_envelope', name: 'Lipid Envelope', description: 'A lipid bilayer derived from the host cell membrane that protects the virus.' };
    group.add(lipidEnvelope);
    group.parts.push(lipidEnvelope);

    // 2. M1 Matrix Protein
    const m1Geo = new THREE.SphereGeometry(4.8, 64, 64);
    const m1Mat = new THREE.MeshStandardMaterial({ 
        color: 0x5a7ca8,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    const m1Matrix = new THREE.Mesh(m1Geo, m1Mat);
    m1Matrix.userData = { id: 'm1_matrix', name: 'M1 Matrix Protein', description: 'A protein layer inside the envelope that provides structure and stability to the virus.' };
    group.add(m1Matrix);
    group.parts.push(m1Matrix);

    // 3. Hemagglutinin (HA) Spikes
    const haGroup = new THREE.Group();
    const haGeo = new THREE.CylinderGeometry(0.05, 0.15, 1.2, 8);
    haGeo.translate(0, 0.6, 0);
    const haMat = new THREE.MeshStandardMaterial({ color: 0xc83232 });
    
    for (let i = 0; i < 150; i++) {
        const phi = Math.acos(-1 + (2 * i) / 150);
        const theta = Math.sqrt(150 * Math.PI) * phi;
        const haSpike = new THREE.Mesh(haGeo, haMat);
        haSpike.position.setFromSphericalCoords(5, phi, theta);
        haSpike.lookAt(0, 0, 0);
        haSpike.rotateX(Math.PI / 2);
        haGroup.add(haSpike);
    }
    haGroup.userData = { id: 'ha_spikes', name: 'Hemagglutinin (HA) Spikes', description: 'Glycoproteins on the surface that bind to sialic acid receptors on host cells.' };
    group.add(haGroup);
    group.parts.push(haGroup);

    // 4. Neuraminidase (NA) Spikes
    const naGroup = new THREE.Group();
    const naGeo = new THREE.BoxGeometry(0.3, 1.0, 0.3);
    naGeo.translate(0, 0.5, 0);
    const naMat = new THREE.MeshStandardMaterial({ color: 0x32c832 });
    
    for (let i = 0; i < 40; i++) {
        const phi = Math.acos(-1 + (2 * i) / 40);
        const theta = Math.sqrt(40 * Math.PI) * phi;
        const naSpike = new THREE.Mesh(naGeo, naMat);
        naSpike.position.setFromSphericalCoords(5, phi, theta + 0.5);
        naSpike.lookAt(0, 0, 0);
        naSpike.rotateX(Math.PI / 2);
        naGroup.add(naSpike);
    }
    naGroup.userData = { id: 'na_spikes', name: 'Neuraminidase (NA) Spikes', description: 'Enzymes that cleave sialic acid to release newly formed viruses from the host cell.' };
    group.add(naGroup);
    group.parts.push(naGroup);

    // 5. M2 Ion Channel
    const m2Group = new THREE.Group();
    const m2Geo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const m2Mat = new THREE.MeshStandardMaterial({ color: 0xc8c832 });
    
    for (let i = 0; i < 20; i++) {
        const phi = Math.acos(-1 + (2 * i) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        const m2Channel = new THREE.Mesh(m2Geo, m2Mat);
        m2Channel.position.setFromSphericalCoords(4.9, phi, theta + 1.0);
        m2Channel.lookAt(0, 0, 0);
        m2Channel.rotateX(Math.PI / 2);
        m2Group.add(m2Channel);
    }
    m2Group.userData = { id: 'm2_channel', name: 'M2 Ion Channel', description: 'Proton channels that lower the pH inside the virus, triggering uncoating.' };
    group.add(m2Group);
    group.parts.push(m2Group);

    // RNA and associated proteins inside
    const rnaGroup = new THREE.Group();
    const npGroup = new THREE.Group();
    const pb1Group = new THREE.Group();
    const pb2Group = new THREE.Group();
    const paGroup = new THREE.Group();

    const rnaMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const npMat = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const pb1Mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const pb2Mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const paMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    for (let i = 0; i < 8; i++) {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.sin(t * Math.PI * 6) * 0.4;
                const ty = (t - 0.5) * 5;
                const tz = Math.cos(t * Math.PI * 6) * 0.4;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        
        const path = new CustomSinCurve(1);
        const rnaGeo = new THREE.TubeGeometry(path, 100, 0.05, 8, false);
        const rnaSegment = new THREE.Mesh(rnaGeo, rnaMat);
        
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.2;
        const baseX = Math.cos(angle) * radius;
        const baseZ = Math.sin(angle) * radius;
        
        rnaSegment.position.set(baseX, 0, baseZ);
        rnaGroup.add(rnaSegment);

        // Add NP (Nucleoprotein) spheres along the RNA
        const npGeo = new THREE.SphereGeometry(0.15, 8, 8);
        for (let j = 0; j <= 30; j++) {
            const t = j / 30;
            const pt = path.getPoint(t);
            const npMesh = new THREE.Mesh(npGeo, npMat);
            npMesh.position.set(baseX + pt.x, pt.y, baseZ + pt.z);
            npGroup.add(npMesh);
        }

        // Polymerase complex at the top of each RNA
        const topPt = path.getPoint(1);
        
        const pb1Geo = new THREE.SphereGeometry(0.3, 16, 16);
        const pb1Mesh = new THREE.Mesh(pb1Geo, pb1Mat);
        pb1Mesh.position.set(baseX + topPt.x, topPt.y + 0.3, baseZ + topPt.z);
        pb1Group.add(pb1Mesh);

        const pb2Geo = new THREE.SphereGeometry(0.3, 16, 16);
        const pb2Mesh = new THREE.Mesh(pb2Geo, pb2Mat);
        pb2Mesh.position.set(baseX + topPt.x + 0.3, topPt.y + 0.35, baseZ + topPt.z);
        pb2Group.add(pb2Mesh);

        const paGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const paMesh = new THREE.Mesh(paGeo, paMat);
        paMesh.position.set(baseX + topPt.x, topPt.y + 0.35, baseZ + topPt.z + 0.3);
        paGroup.add(paMesh);
    }

    rnaGroup.userData = { id: 'viral_rna', name: 'Viral RNA Segments', description: 'The 8 negative-sense, single-stranded RNA segments that make up the viral genome.' };
    group.add(rnaGroup);
    group.parts.push(rnaGroup);

    npGroup.userData = { id: 'nucleoprotein', name: 'Nucleoprotein (NP)', description: 'Proteins that coat the viral RNA segments, protecting them and facilitating replication.' };
    group.add(npGroup);
    group.parts.push(npGroup);

    pb1Group.userData = { id: 'pb1', name: 'Polymerase Basic 1 (PB1)', description: 'The catalytic core of the viral RNA polymerase complex, responsible for RNA synthesis.' };
    group.add(pb1Group);
    group.parts.push(pb1Group);

    pb2Group.userData = { id: 'pb2', name: 'Polymerase Basic 2 (PB2)', description: 'A subunit of the polymerase complex that binds to the cap structures of host cell mRNAs.' };
    group.add(pb2Group);
    group.parts.push(pb2Group);

    paGroup.userData = { id: 'pa', name: 'Polymerase Acidic (PA)', description: 'A subunit of the polymerase complex with endonuclease activity, which cleaves host mRNAs.' };
    group.add(paGroup);
    group.parts.push(paGroup);

    group.animate = function(delta) {
        group.rotation.y += 0.2 * delta;
        group.rotation.x += 0.1 * delta;

        const scale = 1 + 0.05 * Math.sin(Date.now() * 0.005);
        rnaGroup.scale.set(scale, scale, scale);
        
        naGroup.children.forEach(child => {
            child.rotateY(2 * delta);
        });
    };

    group.quizzes = [
        {
            question: 'Which surface glycoprotein is responsible for binding the influenza virus to host cell receptors?',
            options: ['Neuraminidase (NA)', 'Hemagglutinin (HA)', 'M2 Ion Channel', 'Polymerase Basic 1 (PB1)'],
            answer: 1,
            explanation: 'Hemagglutinin (HA) binds to sialic acid receptors on the surface of host cells, initiating viral entry.'
        },
        {
            question: 'What is the function of the M2 Ion Channel in the influenza virus?',
            options: ['Cleaving host mRNAs', 'Binding to host ribosomes', 'Lowering the pH inside the virion to trigger uncoating', 'Synthesizing viral RNA'],
            answer: 2,
            explanation: 'The M2 Ion Channel allows protons to enter the virion, lowering its internal pH. This acidic environment is required for viral uncoating and release of RNA into the cell.'
        },
        {
            question: 'How many distinct viral RNA segments does a typical influenza A virus contain?',
            options: ['6', '8', '10', '12'],
            answer: 1,
            explanation: 'The genome of influenza A and B viruses consists of 8 separate segments of negative-sense RNA.'
        },
        {
            question: 'Which viral protein is primarily responsible for cleaving sialic acid to release newly formed virions from the host cell?',
            options: ['Neuraminidase (NA)', 'Hemagglutinin (HA)', 'Matrix 1 (M1)', 'Nucleoprotein (NP)'],
            answer: 0,
            explanation: 'Neuraminidase (NA) acts as an enzyme to cleave sialic acid residues, which prevents newly assembled viruses from clumping together and allows them to exit the host cell.'
        },
        {
            question: 'Which component of the RNA polymerase complex has endonuclease activity used for "cap-snatching"?',
            options: ['Nucleoprotein (NP)', 'Polymerase Basic 1 (PB1)', 'Polymerase Basic 2 (PB2)', 'Polymerase Acidic (PA)'],
            answer: 3,
            explanation: 'Polymerase Acidic (PA) contains an endonuclease domain that cleaves host cellular mRNAs to "snatch" their 5\' caps, which are then used as primers for viral mRNA transcription.'
        },
        {
            question: 'What role does the Nucleoprotein (NP) play in the influenza virus?',
            options: ['It forms the viral envelope', 'It pumps protons into the virion', 'It coats and protects the viral RNA segments', 'It attaches the virus to host cells'],
            answer: 2,
            explanation: 'Nucleoprotein (NP) binds to and encapsidates the viral RNA, forming ribonucleoprotein (RNP) complexes that protect the RNA and facilitate its transcription and replication.'
        }
    ];

    return group;
}
