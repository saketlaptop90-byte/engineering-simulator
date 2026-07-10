export function createHIV(THREE) {
    const group = new THREE.Group();
    group.parts = [];

    // Common dummy object for InstancedMesh placement
    const dummy = new THREE.Object3D();

    // 1. Viral Envelope
    const envGeo = new THREE.SphereGeometry(10, 64, 64);
    const envMat = new THREE.MeshPhysicalMaterial({
        color: 0x8b0000,
        transparent: true,
        opacity: 0.4,
        roughness: 0.6,
        transmission: 0.5,
        thickness: 0.5
    });
    const envelope = new THREE.Mesh(envGeo, envMat);
    envelope.userData = { id: 'viral_envelope', name: 'Viral Envelope', description: 'A lipid bilayer membrane derived from the host cell during viral budding.' };
    group.add(envelope);
    group.parts.push(envelope);

    // 2. gp120 Docking Glycoprotein (Caps)
    const gp120Geo = new THREE.SphereGeometry(0.8, 16, 16);
    const gp120Mat = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.4 });
    const gp120Mesh = new THREE.InstancedMesh(gp120Geo, gp120Mat, 72);
    gp120Mesh.userData = { id: 'gp120', name: 'gp120 Docking Glycoprotein', description: 'Exposed on the viral surface, it binds specifically to CD4 receptors on host immune cells.' };
    group.add(gp120Mesh);
    group.parts.push(gp120Mesh);

    // 3. gp41 Transmembrane Glycoprotein (Stalks)
    const gp41Geo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16);
    const gp41Mat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5 });
    const gp41Mesh = new THREE.InstancedMesh(gp41Geo, gp41Mat, 72);
    gp41Mesh.userData = { id: 'gp41', name: 'gp41 Transmembrane Glycoprotein', description: 'Anchors gp120 to the viral envelope and mediates the fusion of viral and cellular membranes.' };
    group.add(gp41Mesh);
    group.parts.push(gp41Mesh);

    // Distribute spikes on the envelope
    const numSpikes = 72;
    for (let i = 0; i < numSpikes; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / numSpikes);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        // Stalk (gp41)
        dummy.position.set(x * 10, y * 10, z * 10);
        dummy.lookAt(x * 11, y * 11, z * 11);
        dummy.rotateX(Math.PI / 2);
        dummy.updateMatrix();
        gp41Mesh.setMatrixAt(i, dummy.matrix);

        // Cap (gp120)
        dummy.position.set(x * 11, y * 11, z * 11);
        dummy.rotation.set(0, 0, 0); // Sphere, rotation doesn't matter much
        dummy.updateMatrix();
        gp120Mesh.setMatrixAt(i, dummy.matrix);
    }

    // 4. p17 Matrix Protein
    const matrixGeo = new THREE.IcosahedronGeometry(9, 4);
    const matrixMat = new THREE.MeshStandardMaterial({ 
        color: 0x4169e1, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.2 
    });
    const matrix = new THREE.Mesh(matrixGeo, matrixMat);
    matrix.userData = { id: 'p17_matrix', name: 'p17 Matrix Protein', description: 'A structural protein layer that lines the inner surface of the viral envelope, maintaining virion integrity.' };
    group.add(matrix);
    group.parts.push(matrix);

    // 5. p24 Capsid
    const capsidGeo = new THREE.CylinderGeometry(1.2, 3.2, 7, 32);
    const capsidMat = new THREE.MeshStandardMaterial({ color: 0xd2691e, roughness: 0.7 });
    const capsid = new THREE.Mesh(capsidGeo, capsidMat);
    capsid.userData = { id: 'p24_capsid', name: 'p24 Capsid', description: 'A conical protein shell housing the viral genome and critical enzymes.' };
    group.add(capsid);
    group.parts.push(capsid);

    // 6. Viral RNA Genome
    class RNACurve extends THREE.Curve {
        constructor(scale, freq, offset) {
            super();
            this.scale = scale;
            this.freq = freq;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const y = (t - 0.5) * 5.5; 
            const x = Math.sin(t * Math.PI * this.freq + this.offset) * this.scale;
            const z = Math.cos(t * Math.PI * this.freq + this.offset) * this.scale;
            return optionalTarget.set(x, y, z);
        }
    }
    const rnaGeo = new THREE.TubeGeometry(new RNACurve(0.4, 6, 0), 64, 0.1, 8, false);
    const rnaMat = new THREE.MeshStandardMaterial({ color: 0xff1493 });
    const rnaMesh = new THREE.InstancedMesh(rnaGeo, rnaMat, 2);
    rnaMesh.setMatrixAt(0, new THREE.Matrix4().identity());
    const rnaM2 = new THREE.Matrix4().makeRotationY(Math.PI);
    rnaMesh.setMatrixAt(1, rnaM2);
    rnaMesh.userData = { id: 'viral_rna', name: 'Viral RNA Genome', description: 'Two identical strands of positive-sense single-stranded RNA.' };
    group.add(rnaMesh);
    group.parts.push(rnaMesh);

    // 7. Reverse Transcriptase
    const rtGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const rtMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
    const rtMesh = new THREE.InstancedMesh(rtGeo, rtMat, 3);
    dummy.position.set(0.5, 1, 0.5); dummy.updateMatrix(); rtMesh.setMatrixAt(0, dummy.matrix);
    dummy.position.set(-0.5, -1, -0.5); dummy.updateMatrix(); rtMesh.setMatrixAt(1, dummy.matrix);
    dummy.position.set(0.2, -2, 0.4); dummy.updateMatrix(); rtMesh.setMatrixAt(2, dummy.matrix);
    rtMesh.userData = { id: 'rt', name: 'Reverse Transcriptase', description: 'Enzyme responsible for reverse transcribing viral RNA into double-stranded DNA.' };
    group.add(rtMesh);
    group.parts.push(rtMesh);

    // 8. Integrase
    const intGeo = new THREE.DodecahedronGeometry(0.25);
    const intMat = new THREE.MeshStandardMaterial({ color: 0x00bfff });
    const intMesh = new THREE.InstancedMesh(intGeo, intMat, 3);
    dummy.position.set(-0.3, 2, -0.3); dummy.updateMatrix(); intMesh.setMatrixAt(0, dummy.matrix);
    dummy.position.set(0.4, 0, -0.4); dummy.updateMatrix(); intMesh.setMatrixAt(1, dummy.matrix);
    dummy.position.set(-0.2, -2.5, 0.2); dummy.updateMatrix(); intMesh.setMatrixAt(2, dummy.matrix);
    intMesh.userData = { id: 'integrase', name: 'Integrase', description: 'Enzyme that integrates the newly formed viral DNA into the host cell\'s genome.' };
    group.add(intMesh);
    group.parts.push(intMesh);

    // 9. Protease
    const proGeo = new THREE.OctahedronGeometry(0.2);
    const proMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const proMesh = new THREE.InstancedMesh(proGeo, proMat, 4);
    dummy.position.set(0, 2.5, 0.3); dummy.updateMatrix(); proMesh.setMatrixAt(0, dummy.matrix);
    dummy.position.set(0.3, -0.5, 0.3); dummy.updateMatrix(); proMesh.setMatrixAt(1, dummy.matrix);
    dummy.position.set(-0.4, 1.5, -0.2); dummy.updateMatrix(); proMesh.setMatrixAt(2, dummy.matrix);
    dummy.position.set(0.1, -1.5, -0.4); dummy.updateMatrix(); proMesh.setMatrixAt(3, dummy.matrix);
    proMesh.userData = { id: 'protease', name: 'Protease', description: 'Enzyme that cleaves viral polyproteins into functional proteins, maturing the virion.' };
    group.add(proMesh);
    group.parts.push(proMesh);

    // 10. Vpr Protein
    const vprGeo = new THREE.TetrahedronGeometry(0.4);
    const vprMat = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
    const vprMesh = new THREE.InstancedMesh(vprGeo, vprMat, 15);
    for (let i = 0; i < 15; i++) {
        const r = 4 + Math.random() * 4;
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        dummy.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
        dummy.rotation.set(Math.random(), Math.random(), Math.random());
        dummy.updateMatrix();
        vprMesh.setMatrixAt(i, dummy.matrix);
    }
    vprMesh.userData = { id: 'vpr_protein', name: 'Vpr Protein', description: 'An accessory protein involved in nuclear import of the pre-integration complex and cell cycle arrest.' };
    group.add(vprMesh);
    group.parts.push(vprMesh);

    // Initialize core objects orientation
    const coreObjects = [capsid, rnaMesh, rtMesh, intMesh, proMesh];
    const initialCoreRotation = new THREE.Euler(Math.PI / 6, 0, Math.PI / 8);
    coreObjects.forEach(obj => {
        obj.rotation.copy(initialCoreRotation);
    });

    // 6 Quizzes
    group.quizzes = [
        {
            question: "Which glycoprotein on the HIV surface is primarily responsible for binding to the CD4 receptor on host immune cells?",
            options: ["gp41", "gp120", "p24", "p17"],
            answer: 1,
            explanation: "gp120 is the docking glycoprotein that directly interacts with the CD4 receptor on T-cells."
        },
        {
            question: "What is the primary function of the HIV Integrase enzyme?",
            options: [
                "To convert viral RNA into DNA",
                "To cleave viral polyproteins",
                "To integrate viral DNA into the host chromosome",
                "To bind to host cell receptors"
            ],
            answer: 2,
            explanation: "Integrase is responsible for taking the reverse-transcribed viral DNA and inserting it into the host cell's genome."
        },
        {
            question: "Which viral structure is conical in shape and houses the RNA genome?",
            options: ["Viral Envelope", "p17 Matrix", "gp120 Glycoprotein", "p24 Capsid"],
            answer: 3,
            explanation: "The p24 Capsid forms a distinct cone shape inside the HIV virion and contains the RNA genome and necessary enzymes."
        },
        {
            question: "How many strands of RNA are typically found in a single HIV virion?",
            options: ["One", "Two", "Three", "Four"],
            answer: 1,
            explanation: "HIV carries two identical copies of single-stranded positive-sense RNA."
        },
        {
            question: "What role does the viral Protease play in the HIV life cycle?",
            options: [
                "It cuts long viral polyproteins into mature, functional units",
                "It reverse transcribes RNA to DNA",
                "It fuses the viral envelope with the host cell membrane",
                "It transports the viral genome into the nucleus"
            ],
            answer: 0,
            explanation: "Protease acts like chemical scissors, cleaving polyproteins during budding to form mature, infectious viral particles."
        },
        {
            question: "Which structural protein lines the inner surface of the viral envelope?",
            options: ["p17 Matrix Protein", "p24 Capsid", "Vpr Protein", "Reverse Transcriptase"],
            answer: 0,
            explanation: "The p17 Matrix Protein forms a supportive shell directly under the viral envelope, maintaining the structural integrity of the virion."
        }
    ];

    // Animation Loop
    let time = 0;
    group.animate = function(delta) {
        time += delta;

        // Rotate the entire HIV model slowly
        group.rotation.y += delta * 0.05;
        group.rotation.z = Math.sin(time * 0.2) * 0.05;

        // Envelope pulsing effect
        const pulse = 1 + Math.sin(time * 2) * 0.02;
        envelope.scale.set(pulse, pulse, pulse);
        matrix.scale.set(pulse, pulse, pulse);

        // Rotate the core complex inside the envelope
        coreObjects.forEach(obj => {
            obj.rotation.x = initialCoreRotation.x + Math.sin(time * 0.5) * 0.1;
            obj.rotation.y += delta * 0.2; 
            obj.rotation.z = initialCoreRotation.z + Math.cos(time * 0.5) * 0.1;
        });

        // Wiggling effect for the RNA genome specifically
        rnaMesh.scale.set(
            1 + Math.sin(time * 5) * 0.05, 
            1 + Math.cos(time * 4) * 0.05, 
            1 + Math.sin(time * 6) * 0.05
        );
        
        // Bobbing effect for Vpr proteins floating around
        vprMesh.rotation.y += delta * 0.1;
        vprMesh.rotation.x += delta * 0.1;
    };

    return group;
}
