export function createSarsCov2(THREE) {
    const sarsGroup = new THREE.Group();
    sarsGroup.parts = [];

    // Helper for even spherical distribution
    function fibonacciSphere(samples, i, radius) {
        const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
        const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        return new THREE.Vector3(x * radius, y * radius, z * radius);
    }

    // 1. Lipid Bilayer Membrane
    const membraneGeo = new THREE.SphereGeometry(5, 32, 32);
    const membraneMat = new THREE.MeshPhongMaterial({ color: 0xe0e0e0, transparent: true, opacity: 0.4, shininess: 10, depthWrite: false });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    membrane.userData = { id: 'lipid_membrane', name: 'Lipid Bilayer Membrane', description: 'The outer envelope of the virus, derived from the host cell membrane.' };
    sarsGroup.add(membrane);
    sarsGroup.parts.push(membrane);

    // 2. Single-Stranded RNA Genome
    class RNACurve extends THREE.Curve {
        constructor() { super(); }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const t2 = t * Math.PI * 12; // 6 coils
            const r = 2.5 * Math.sin(t * Math.PI);
            const x = r * Math.cos(t2);
            const y = r * Math.sin(t2);
            const z = 7 * (t - 0.5);
            return optionalTarget.set(x, y, z);
        }
    }
    const rnaGeo = new THREE.TubeGeometry(new RNACurve(), 150, 0.15, 8, false);
    const rnaMat = new THREE.MeshLambertMaterial({ color: 0xff3333 });
    const rna = new THREE.Mesh(rnaGeo, rnaMat);
    rna.userData = { id: 'rna_genome', name: 'Single-Stranded RNA Genome', description: 'The genetic material of the virus, carrying instructions to replicate.' };
    sarsGroup.add(rna);
    sarsGroup.parts.push(rna);

    // 3. Nucleocapsid Protein (N)
    const nGroup = new THREE.Group();
    const nGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const nMat = new THREE.MeshLambertMaterial({ color: 0x33ff33 });
    const nData = { id: 'nucleocapsid_n', name: 'Nucleocapsid Protein (N)', description: 'Proteins bound to the RNA genome, protecting it and aiding in viral replication.' };
    nGroup.userData = nData;
    
    for (let i = 0; i <= 150; i += 2) {
        const t = i / 150;
        const pt = new RNACurve().getPoint(t);
        const nMesh = new THREE.Mesh(nGeo, nMat);
        nMesh.position.copy(pt);
        nMesh.userData = nData;
        nGroup.add(nMesh);
    }
    sarsGroup.add(nGroup);
    sarsGroup.parts.push(nGroup);

    // 4. Envelope Protein (E)
    const eGroup = new THREE.Group();
    const eGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
    eGeo.translate(0, 0.25, 0);
    const eMat = new THREE.MeshLambertMaterial({ color: 0xffff33 });
    const eData = { id: 'envelope_e', name: 'Envelope Protein (E)', description: 'Small structural proteins involved in viral assembly and release.' };
    eGroup.userData = eData;
    
    for (let i = 0; i < 50; i++) {
        const pos = fibonacciSphere(50, i, 4.9);
        const eMesh = new THREE.Mesh(eGeo, eMat);
        eMesh.position.copy(pos);
        eMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pos.clone().normalize());
        eMesh.userData = eData;
        eGroup.add(eMesh);
    }
    sarsGroup.add(eGroup);
    sarsGroup.parts.push(eGroup);

    // 5. Membrane Protein (M)
    const mGroup = new THREE.Group();
    const mGeo = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    mGeo.translate(0, 0.3, 0);
    const mMat = new THREE.MeshLambertMaterial({ color: 0x3333ff });
    const mData = { id: 'membrane_m', name: 'Membrane Protein (M)', description: 'The most abundant structural protein, defining the shape of the viral envelope.' };
    mGroup.userData = mData;

    for (let i = 0; i < 80; i++) {
        const pos = fibonacciSphere(80, i, 4.9);
        const mMesh = new THREE.Mesh(mGeo, mMat);
        mMesh.position.copy(pos);
        mMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pos.clone().normalize());
        mMesh.userData = mData;
        mGroup.add(mMesh);
    }
    sarsGroup.add(mGroup);
    sarsGroup.parts.push(mGroup);

    // 6. Hemagglutinin-Esterase Dimer (HE)
    const heGroup = new THREE.Group();
    const heData = { id: 'he_dimer', name: 'Hemagglutinin-Esterase Dimer (HE)', description: 'Present in some coronaviruses, acts as a hemagglutinin and receptor-destroying enzyme.' };
    heGroup.userData = heData;

    const heGeoSingle = new THREE.Group();
    const heStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), new THREE.MeshLambertMaterial({color: 0xffaa00}));
    heStem.position.y = 0.25;
    const heHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshLambertMaterial({color: 0xffaa00}));
    heHead.position.y = 0.5;
    heGeoSingle.add(heStem);
    heGeoSingle.add(heHead);

    for (let i = 0; i < 40; i++) {
        const pos = fibonacciSphere(40, i, 4.9);
        const clone = heGeoSingle.clone();
        clone.position.copy(pos);
        clone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pos.clone().normalize());
        clone.userData = heData;
        clone.children.forEach(c => c.userData = heData);
        heGroup.add(clone);
    }
    sarsGroup.add(heGroup);
    sarsGroup.parts.push(heGroup);

    // 7. Spike Glycoprotein (S)
    const spikesGroup = new THREE.Group();
    const sData = { id: 'spike_s', name: 'Spike Glycoprotein (S)', description: 'Proteins that protrude from the surface, giving the virus its crown-like appearance.' };
    spikesGroup.userData = sData;

    const sGeoSingle = new THREE.Group();
    const sStemGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8);
    const sHeadGeo = new THREE.ConeGeometry(0.4, 0.8, 8);
    const sMat = new THREE.MeshLambertMaterial({color: 0xff5555});
    const sStemMesh = new THREE.Mesh(sStemGeo, sMat);
    sStemMesh.position.y = 0.6;
    const sHeadMesh = new THREE.Mesh(sHeadGeo, sMat);
    sHeadMesh.position.y = 1.6;
    sGeoSingle.add(sStemMesh);
    sGeoSingle.add(sHeadMesh);

    for (let i = 0; i < 30; i++) {
        const pos = fibonacciSphere(31, i + 1, 4.9); // skip the top pole for the detailed spike
        const clone = sGeoSingle.clone();
        clone.position.copy(pos);
        clone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), pos.clone().normalize());
        clone.userData = sData;
        clone.children.forEach(c => c.userData = sData);
        spikesGroup.add(clone);
    }
    sarsGroup.add(spikesGroup);
    sarsGroup.parts.push(spikesGroup);

    // Detailed Spike at the top pole to show distinct subunits
    const topPos = fibonacciSphere(31, 0, 4.9);
    const topQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), topPos.clone().normalize());

    const detailedSpikeGroup = new THREE.Group();
    detailedSpikeGroup.position.copy(topPos);
    detailedSpikeGroup.quaternion.copy(topQuat);
    sarsGroup.add(detailedSpikeGroup);

    // 8. S2 Subunit
    const s2Mat = new THREE.MeshLambertMaterial({color: 0xaa2222});
    const s2Mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.5, 16), s2Mat);
    s2Mesh.position.set(0, 0.75, 0); 
    s2Mesh.userData = { id: 's2_subunit', name: 'S2 Subunit', description: 'The stalk of the spike protein, responsible for fusing the viral and host cell membranes.' };
    detailedSpikeGroup.add(s2Mesh);
    sarsGroup.parts.push(s2Mesh);

    // 9. S1 Subunit
    const s1Mat = new THREE.MeshLambertMaterial({color: 0xff6666});
    const s1Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), s1Mat);
    s1Mesh.scale.set(1, 0.8, 1);
    s1Mesh.position.set(0, 1.8, 0);
    s1Mesh.userData = { id: 's1_subunit', name: 'S1 Subunit', description: 'The bulbous head of the spike protein, containing the receptor-binding domain.' };
    detailedSpikeGroup.add(s1Mesh);
    sarsGroup.parts.push(s1Mesh);

    // 10. Receptor-Binding Domain (RBD)
    const rbdMat = new THREE.MeshLambertMaterial({color: 0x00ffff});
    const rbdMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), rbdMat);
    rbdMesh.position.set(0.3, 2.1, 0.2);
    rbdMesh.userData = { id: 'rbd', name: 'Receptor-Binding Domain (RBD)', description: 'A critical part of the S1 subunit that directly binds to the ACE2 receptor on human cells.' };
    detailedSpikeGroup.add(rbdMesh);
    sarsGroup.parts.push(rbdMesh);

    // Animation function
    sarsGroup.animate = function(delta) {
        sarsGroup.rotation.y += 0.3 * delta;
        sarsGroup.rotation.x += 0.15 * delta;

        const time = Date.now() * 0.003;
        
        // Bobbing spikes
        spikesGroup.children.forEach((spike, index) => {
            const scale = 1 + 0.1 * Math.sin(time + index);
            spike.scale.set(1, scale, 1);
        });
        
        // Pulsing membrane
        const pulse = 1 + 0.02 * Math.sin(time * 2);
        membrane.scale.set(pulse, pulse, pulse);
    };

    // Quizzes (Exactly 6)
    sarsGroup.quizzes = [
        {
            question: "Which component of SARS-CoV-2 is primarily responsible for attaching to the host cell's ACE2 receptor?",
            options: ["Envelope Protein (E)", "Nucleocapsid Protein (N)", "Receptor-Binding Domain (RBD)", "Membrane Protein (M)"],
            answer: 2,
            explanation: "The Receptor-Binding Domain (RBD) located on the S1 subunit of the spike protein directly binds to the ACE2 receptor on human cells."
        },
        {
            question: "What type of genetic material does SARS-CoV-2 contain?",
            options: ["Double-Stranded DNA", "Single-Stranded RNA", "Double-Stranded RNA", "Single-Stranded DNA"],
            answer: 1,
            explanation: "SARS-CoV-2 is an RNA virus that contains a single-stranded, positive-sense RNA genome."
        },
        {
            question: "Which structural protein is the most abundant in the SARS-CoV-2 viral envelope?",
            options: ["Spike Glycoprotein (S)", "Envelope Protein (E)", "Membrane Protein (M)", "Nucleocapsid Protein (N)"],
            answer: 2,
            explanation: "The Membrane (M) protein is the most abundant structural protein and plays a central role in defining the shape of the viral envelope."
        },
        {
            question: "What is the primary function of the S2 Subunit of the spike protein?",
            options: ["Binding to the ACE2 receptor", "Protecting the RNA genome", "Fusing the viral and host cell membranes", "Synthesizing viral RNA"],
            answer: 2,
            explanation: "After the S1 subunit binds to the receptor, the S2 subunit undergoes a conformational change to mediate the fusion of the viral envelope with the host cell membrane."
        },
        {
            question: "Which protein binds directly to the viral RNA to form the ribonucleoprotein complex?",
            options: ["Nucleocapsid Protein (N)", "Spike Glycoprotein (S)", "Hemagglutinin-Esterase (HE)", "Envelope Protein (E)"],
            answer: 0,
            explanation: "The Nucleocapsid (N) protein binds directly to the single-stranded RNA genome, protecting it and forming the ribonucleoprotein core."
        },
        {
            question: "Where does the Lipid Bilayer Membrane of SARS-CoV-2 originate from?",
            options: ["Synthesized entirely from viral RNA", "Derived from the host cell during viral exit", "Absorbed from the environment", "Formed by the aggregation of Spike proteins"],
            answer: 1,
            explanation: "The virus acquires its lipid bilayer envelope from the host cell's membrane structures (like the endoplasmic reticulum or Golgi) as it buds out of the cell."
        }
    ];

    return sarsGroup;
}
