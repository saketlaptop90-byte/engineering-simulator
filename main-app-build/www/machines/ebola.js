export function createEbola(THREE) {
    const group = new THREE.Group();
    group.parts = [];
    group.quizzes = [];

    // 1. Path Generation for the Ebola Filament
    // Straight body part
    const bodyPoints = [];
    for(let i = 0; i <= 20; i++) {
        bodyPoints.push(new THREE.Vector3(-10 + i * 0.5, 0, 0));
    }
    const bodyCurve = new THREE.CatmullRomCurve3(bodyPoints);

    // Curled 6-shape / Crook part
    const loopPoints = [];
    for(let i = 0; i <= 20; i++) {
        const prog = i / 20;
        // Sweep 324 degrees to form a loop
        const a = Math.PI / 2 - prog * (Math.PI * 1.8);
        // Slight Z offset so the loop passes underneath itself without clipping
        const zOffset = prog * -1.5; 
        loopPoints.push(new THREE.Vector3(2 * Math.cos(a), -2 + 2 * Math.sin(a), zOffset));
    }
    const loopCurve = new THREE.CatmullRomCurve3(loopPoints);

    // Full continuous curve for internal structures
    const fullPoints = [...bodyPoints];
    for(let i = 1; i <= 20; i++) {
        fullPoints.push(loopPoints[i]);
    }
    const fullCurve = new THREE.CatmullRomCurve3(fullPoints);

    // 2. Shared Materials
    const envelopeMat = new THREE.MeshPhongMaterial({ 
        color: 0x88aa88, 
        transparent: true, 
        opacity: 0.45, 
        depthWrite: false, 
        side: THREE.DoubleSide 
    });
    const vp40Mat = new THREE.MeshPhongMaterial({ 
        color: 0xdddd00, 
        transparent: true, 
        opacity: 0.3, 
        wireframe: true 
    });
    const npMat = new THREE.MeshPhongMaterial({ color: 0x0055ff });
    const rnaMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const lMat = new THREE.MeshPhongMaterial({ color: 0x8800ff });

    // --- PART 1: Thread-like Lipid Envelope (Main Body) ---
    const bodyGeo = new THREE.TubeGeometry(bodyCurve, 64, 1.0, 16, false);
    const part1 = new THREE.Mesh(bodyGeo, envelopeMat);
    part1.userData = { 
        id: 'lipid_envelope', 
        name: 'Thread-like Lipid Envelope', 
        description: 'Host-derived lipid bilayer protecting the elongated virus body.' 
    };
    group.add(part1); 
    group.parts.push(part1);

    // --- PART 2: U-shape or 6-shape Structure (Terminal Loop) ---
    const loopGeo = new THREE.TubeGeometry(loopCurve, 64, 1.0, 16, false);
    // Distinct material tint to easily identify this structural region
    const loopMat = envelopeMat.clone();
    loopMat.color.setHex(0x779977); 
    const part2 = new THREE.Mesh(loopGeo, loopMat);
    part2.userData = { 
        id: 'u_shape_loop', 
        name: 'U-shape or 6-shape Structure', 
        description: 'The characteristic curled "crook" or 6-shape formed at one end of the filovirus.' 
    };
    group.add(part2); 
    group.parts.push(part2);

    // --- Helper variables for surface/curve math ---
    const binormal = new THREE.Vector3();
    const dummy = new THREE.Object3D();

    // --- PART 3: Glycoprotein (GP) Spikes ---
    const spikeGeo = new THREE.ConeGeometry(0.08, 0.5, 8);
    spikeGeo.translate(0, 0.25, 0); // shift pivot to base
    spikeGeo.rotateX(Math.PI / 2);  // point outwards
    const spikeMat = new THREE.MeshPhongMaterial({ color: 0xff5500 });
    const part3 = new THREE.InstancedMesh(spikeGeo, spikeMat, 500);
    part3.userData = { 
        id: 'gp_spikes', 
        name: 'Glycoprotein (GP) Spikes', 
        description: 'Trimeric surface proteins responsible for receptor binding and membrane fusion.' 
    };
    
    for(let i = 0; i < 500; i++) {
        const t = i / 499;
        const pt = fullCurve.getPointAt(t);
        const tang = fullCurve.getTangentAt(t);
        const a = Math.random() * Math.PI * 2;
        
        binormal.crossVectors(tang, new THREE.Vector3(0,1,0)).normalize();
        if(binormal.lengthSq() < 0.01) binormal.crossVectors(tang, new THREE.Vector3(1,0,0)).normalize();
        const n = new THREE.Vector3().crossVectors(binormal, tang).normalize();

        const dir = new THREE.Vector3(
            n.x * Math.cos(a) + binormal.x * Math.sin(a),
            n.y * Math.cos(a) + binormal.y * Math.sin(a),
            n.z * Math.cos(a) + binormal.z * Math.sin(a)
        );
        const outward = pt.clone().add(dir.multiplyScalar(1.0)); // Surface of envelope
        dummy.position.copy(outward);
        dummy.lookAt(outward.clone().add(dir)); // Point straight out
        dummy.updateMatrix();
        part3.setMatrixAt(i, dummy.matrix);
    }
    group.add(part3); 
    group.parts.push(part3);

    // --- PART 4: VP40 Matrix Protein ---
    const vp40Geo = new THREE.TubeGeometry(fullCurve, 120, 0.85, 12, false);
    const part4 = new THREE.Mesh(vp40Geo, vp40Mat);
    part4.userData = { 
        id: 'vp40_matrix', 
        name: 'VP40 Matrix Protein', 
        description: 'The most abundant viral protein, crucial for virus assembly and budding.' 
    };
    group.add(part4); 
    group.parts.push(part4);

    // --- PART 5: Nucleoprotein (NP) ---
    const npPoints = [];
    for(let i = 0; i <= 400; i++) {
        const t = i / 400;
        const pt = fullCurve.getPointAt(t);
        const tang = fullCurve.getTangentAt(t);
        
        binormal.crossVectors(tang, new THREE.Vector3(0,1,0)).normalize();
        if(binormal.lengthSq() < 0.01) binormal.crossVectors(tang, new THREE.Vector3(1,0,0)).normalize();
        const n = new THREE.Vector3().crossVectors(binormal, tang).normalize();

        const angle = t * Math.PI * 80; // 40 coils
        const r = 0.35; // Radius of coil
        const offset = new THREE.Vector3(
            n.x * Math.cos(angle) + binormal.x * Math.sin(angle),
            n.y * Math.cos(angle) + binormal.y * Math.sin(angle),
            n.z * Math.cos(angle) + binormal.z * Math.sin(angle)
        );
        npPoints.push(pt.clone().add(offset.multiplyScalar(r)));
    }
    const npCurve = new THREE.CatmullRomCurve3(npPoints);
    const npGeo = new THREE.TubeGeometry(npCurve, 500, 0.1, 8, false);
    const part5 = new THREE.Mesh(npGeo, npMat);
    part5.userData = { 
        id: 'nucleoprotein', 
        name: 'Nucleoprotein (NP)', 
        description: 'Encapsidates the viral genome, forming the robust helical nucleocapsid inside.' 
    };
    group.add(part5); 
    group.parts.push(part5);

    // --- PART 6: Single-Stranded RNA ---
    const rnaGeo = new THREE.TubeGeometry(fullCurve, 100, 0.06, 8, false);
    const part6 = new THREE.Mesh(rnaGeo, rnaMat);
    part6.userData = { 
        id: 'ss_rna', 
        name: 'Single-Stranded RNA', 
        description: 'Negative-sense single-stranded RNA genome of ~19kb traveling through the core.' 
    };
    group.add(part6); 
    group.parts.push(part6);

    // --- PART 7: Viral Polymerase (L) ---
    const lGeo = new THREE.DodecahedronGeometry(0.35);
    const part7 = new THREE.Mesh(lGeo, lMat);
    part7.position.copy(fullCurve.getPointAt(0.03));
    part7.userData = { 
        id: 'polymerase_l', 
        name: 'Viral Polymerase (L)', 
        description: 'Large multifunctional protein acting as the RNA-dependent RNA polymerase.' 
    };
    group.add(part7); 
    group.parts.push(part7);

    // --- Factory for scattered accessory proteins ---
    function createProteinCluster(id, name, desc, geo, color, count, radius, phaseOffset) {
        const mat = new THREE.MeshPhongMaterial({ color: color });
        const inst = new THREE.InstancedMesh(geo, mat, count);
        inst.userData = { id: id, name: name, description: desc };
        
        for(let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const pt = fullCurve.getPointAt(t);
            const tang = fullCurve.getTangentAt(t);
            
            binormal.crossVectors(tang, new THREE.Vector3(0,1,0)).normalize();
            if(binormal.lengthSq() < 0.01) binormal.crossVectors(tang, new THREE.Vector3(1,0,0)).normalize();
            const n = new THREE.Vector3().crossVectors(binormal, tang).normalize();

            // Match or interleave with the nucleoprotein helix
            const a = (t * Math.PI * 80) + phaseOffset; 
            const offset = new THREE.Vector3(
                n.x * Math.cos(a) + binormal.x * Math.sin(a),
                n.y * Math.cos(a) + binormal.y * Math.sin(a),
                n.z * Math.cos(a) + binormal.z * Math.sin(a)
            );
            
            dummy.position.copy(pt).add(offset.multiplyScalar(radius));
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            dummy.scale.setScalar(0.7 + Math.random() * 0.6);
            dummy.updateMatrix();
            inst.setMatrixAt(i, dummy.matrix);
        }
        group.add(inst); 
        group.parts.push(inst);
        return inst;
    }

    // --- PART 8: VP24 Membrane-Associated Protein ---
    const part8 = createProteinCluster(
        'vp24', 
        'VP24 Membrane-Associated Protein', 
        'Interferes with host immune response and links nucleocapsid to the lipid envelope.', 
        new THREE.SphereGeometry(0.12, 8, 8), 
        0x00ff88, 
        200, 
        0.65, 
        Math.PI / 4
    );

    // --- PART 9: VP30 Transcriptional Activator ---
    const part9 = createProteinCluster(
        'vp30', 
        'VP30 Transcriptional Activator', 
        'Essential zinc-binding protein required for the initiation of Ebola virus transcription.', 
        new THREE.OctahedronGeometry(0.15), 
        0x00ffff, 
        150, 
        0.3, 
        Math.PI
    );

    // --- PART 10: VP35 Polymerase Cofactor ---
    const part10 = createProteinCluster(
        'vp35', 
        'VP35 Polymerase Cofactor', 
        'Inhibits host interferon response and acts as an essential cofactor for the viral polymerase.', 
        new THREE.BoxGeometry(0.15, 0.15, 0.15), 
        0xff00ff, 
        150, 
        0.45, 
        Math.PI / 2
    );

    // 3. Quiz Setup
    group.quizzes = [
        {
            question: "Which Ebola virus protein forms the trimeric spikes on its outer surface?",
            options: ["VP40 Matrix Protein", "Nucleoprotein (NP)", "Glycoprotein (GP)", "Viral Polymerase (L)"],
            answer: 2,
            explanation: "Glycoprotein (GP) forms the distinctive spikes on the viral envelope and is critical for host cell attachment and membrane fusion."
        },
        {
            question: "What type of genetic material does the Ebola virus possess?",
            options: ["Double-Stranded DNA", "Single-Stranded RNA", "Double-Stranded RNA", "Single-Stranded DNA"],
            answer: 1,
            explanation: "Ebola is a negative-sense, single-stranded RNA virus encoding seven major proteins."
        },
        {
            question: "What structural shape is highly characteristic of the Ebola virion under an electron microscope?",
            options: ["Icosahedral", "Bullet-shaped", "Thread-like with a 6-shape or U-shape crook", "Perfectly Spherical"],
            answer: 2,
            explanation: "Ebola belongs to the Filoviridae family and forms long, filamentous structures, often appearing with a 'crook' or 6-shape at one end."
        },
        {
            question: "Which of the following proteins lines the envelope and is the primary driver of viral budding?",
            options: ["VP40 Matrix Protein", "VP30", "VP24 Membrane-Associated Protein", "VP35 Polymerase Cofactor"],
            answer: 0,
            explanation: "The VP40 matrix protein lines the inner leaflet of the lipid envelope and drives the assembly and budding of new virions from the host cell."
        },
        {
            question: "Which viral protein acts as an essential cofactor for the RNA-dependent RNA polymerase?",
            options: ["VP35 Polymerase Cofactor", "Glycoprotein (GP)", "Nucleoprotein (NP)", "VP24"],
            answer: 0,
            explanation: "VP35 serves as a critical polymerase cofactor and also potently antagonizes the host's innate antiviral interferon response."
        },
        {
            question: "Which nucleocapsid-associated protein serves as the primary transcriptional activator?",
            options: ["VP24", "VP30 Transcriptional Activator", "VP40", "Viral Polymerase (L)"],
            answer: 1,
            explanation: "VP30 is specifically required for the initiation of transcription of the Ebola virus genome, making it a unique transcriptional activator among filoviruses."
        }
    ];

    // 4. Animation Function (Filament undulating and wriggling)
    let time = 0;
    group.animate = function(delta) {
        time += delta;
        // Gently undulate the entire virus group
        group.position.y = Math.sin(time * 2.0) * 0.3;
        group.rotation.x = Math.sin(time * 1.5) * 0.1;
        group.rotation.z = Math.cos(time * 1.2) * 0.05;

        // Make the Polymerase (L) protein pulse
        const lProtein = group.parts.find(p => p.userData.id === 'polymerase_l');
        if (lProtein) {
            const scale = 1.0 + Math.sin(time * 5.0) * 0.15;
            lProtein.scale.set(scale, scale, scale);
        }
    };

    return group;
}
