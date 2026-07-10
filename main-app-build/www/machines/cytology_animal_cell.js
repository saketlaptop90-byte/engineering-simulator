import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Ultra High-Tech Hyper-Realistic Animal Cell Simulator. Features a highly detailed, dynamically animated cytology model showcasing complex organelle interactions, translucent membranes, and dynamic intracellular transport systems.";

    const quizQuestions = [
        {
            question: "Which organelle is considered the powerhouse of the cell, producing ATP through cellular respiration?",
            options: ["Nucleus", "Mitochondrion", "Golgi Apparatus", "Lysosome"],
            answer: 1,
            explanation: "Mitochondria are the site of oxidative phosphorylation, generating most of the cell's supply of adenosine triphosphate (ATP)."
        },
        {
            question: "What is the primary function of the Rough Endoplasmic Reticulum?",
            options: ["Lipid synthesis", "Protein synthesis and folding", "Waste degradation", "Energy production"],
            answer: 1,
            explanation: "The Rough ER is studded with ribosomes, which translate RNA into proteins that are then folded and modified within the ER lumen."
        },
        {
            question: "Which cellular structure acts as the packaging and sorting center of the cell?",
            options: ["Golgi Apparatus", "Smooth Endoplasmic Reticulum", "Nucleolus", "Peroxisome"],
            answer: 0,
            explanation: "The Golgi Apparatus modifies, sorts, and packages proteins and lipids for delivery to targeted destinations."
        },
        {
            question: "What is the main role of the nucleolus located within the nucleus?",
            options: ["DNA replication", "Ribosome biogenesis", "Cell division", "Vesicle transport"],
            answer: 1,
            explanation: "The nucleolus is the primary site of ribosome synthesis and assembly within the cell."
        },
        {
            question: "Which component of the cytoskeleton provides structural support and tracks for intracellular transport?",
            options: ["Microtubules", "Chromatin", "Phospholipid bilayer", "Cristae"],
            answer: 0,
            explanation: "Microtubules are structural components that provide shape and serve as tracks for motor proteins like kinesin and dynein."
        }
    ];

    // Materials
    const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.15,
        transmission: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const cytoplasmMat = new THREE.MeshPhysicalMaterial({
        color: 0x113355,
        transparent: true,
        opacity: 0.05,
        transmission: 0.8,
        roughness: 0.5
    });

    const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x8844ff,
        roughness: 0.6,
        metalness: 0.1,
        emissive: 0x110033
    });

    const nucleolusMat = new THREE.MeshStandardMaterial({
        color: 0xff2266,
        roughness: 0.3,
        metalness: 0.2,
        emissive: 0x440011
    });

    const roughERMat = new THREE.MeshStandardMaterial({
        color: 0x33aa88,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const smoothERMat = new THREE.MeshStandardMaterial({
        color: 0x55ccaa,
        roughness: 0.6,
        metalness: 0.2
    });

    const golgiMat = new THREE.MeshStandardMaterial({
        color: 0xffaa33,
        roughness: 0.5,
        metalness: 0.2,
        side: THREE.DoubleSide,
        emissive: 0x221100
    });

    const mitoMat = new THREE.MeshStandardMaterial({
        color: 0xdd4433,
        roughness: 0.7,
        metalness: 0.3,
        emissive: 0x330000
    });

    const cristaeMat = new THREE.MeshStandardMaterial({
        color: 0xffaa88,
        roughness: 0.9,
        metalness: 0.1
    });

    const lysosomeMat = new THREE.MeshStandardMaterial({
        color: 0xaaff22,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0x113300
    });

    const peroxisomeMat = new THREE.MeshStandardMaterial({
        color: 0xbbbbff,
        roughness: 0.5,
        metalness: 0.1
    });

    const centrioleMat = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.3,
        metalness: 0.8
    });

    const microtubuleMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.4,
        metalness: 0.5,
        emissive: 0x111111
    });

    const ribosomeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.0
    });

    // 1. Cell Membrane
    const membraneRadius = 30;
    const membraneGeo = new THREE.SphereGeometry(membraneRadius, 128, 128);
    // Add some noise to the membrane sphere
    const posAttribute = membraneGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        const noise = 1 + 0.02 * Math.sin(x * 0.5) * Math.cos(y * 0.5) * Math.sin(z * 0.5);
        posAttribute.setXYZ(i, x * noise, y * noise, z * noise);
    }
    membraneGeo.computeVertexNormals();
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    group.add(membraneMesh);
    
    parts.push({
        name: "Plasma Membrane",
        description: "The semi-permeable phospholipid bilayer that encloses the cell.",
        material: "membraneMat",
        function: "Controls passage of substances in and out of the cell.",
        assemblyOrder: 1,
        connections: ["Cytoskeleton", "Extracellular Matrix"],
        failureEffect: "Cell lysis and death.",
        cascadeFailures: ["Loss of homeostasis", "Organelle degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 2. Cytoplasm
    const cytoplasmGeo = new THREE.SphereGeometry(membraneRadius - 0.5, 64, 64);
    const cytoplasmMesh = new THREE.Mesh(cytoplasmGeo, cytoplasmMat);
    group.add(cytoplasmMesh);

    parts.push({
        name: "Cytoplasm",
        description: "Jelly-like substance filling the cell.",
        material: "cytoplasmMat",
        function: "Suspends organelles and provides a medium for metabolic reactions.",
        assemblyOrder: 2,
        connections: ["All Organelles"],
        failureEffect: "Metabolic halt.",
        cascadeFailures: ["Energy failure", "Protein misfolding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // 3. Nucleus
    const nucleusRadius = 6;
    const nucleusGeo = new THREE.SphereGeometry(nucleusRadius, 64, 64);
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusMesh.position.set(2, 1, -2);
    group.add(nucleusMesh);

    // Nuclear Pores
    const poreGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const poreMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0 });
    const numPores = 150;
    for(let i=0; i<numPores; i++) {
        const phi = Math.acos(-1 + (2 * i) / numPores);
        const theta = Math.sqrt(numPores * Math.PI) * phi;
        const pore = new THREE.Mesh(poreGeo, poreMat);
        const pRadius = nucleusRadius;
        pore.position.set(
            pRadius * Math.cos(theta) * Math.sin(phi),
            pRadius * Math.sin(theta) * Math.sin(phi),
            pRadius * Math.cos(phi)
        );
        pore.lookAt(0,0,0);
        pore.rotateX(Math.PI/2);
        nucleusMesh.add(pore);
    }

    parts.push({
        name: "Nucleus",
        description: "The command center of the cell containing genetic material.",
        material: "nucleusMat",
        function: "Stores DNA and coordinates cell activities.",
        assemblyOrder: 3,
        connections: ["Rough ER", "Nucleolus", "Cytoplasm"],
        failureEffect: "Loss of cellular control and reproduction.",
        cascadeFailures: ["No protein synthesis", "Cell death"],
        originalPosition: { x: 2, y: 1, z: -2 },
        explodedPosition: { x: 20, y: 10, z: -20 }
    });

    // 4. Nucleolus
    const nucleolusGeo = new THREE.SphereGeometry(2, 32, 32);
    const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolusMesh.position.set(-1.5, 0.5, 1);
    nucleusMesh.add(nucleolusMesh); // Child of nucleus

    parts.push({
        name: "Nucleolus",
        description: "Dense region within the nucleus.",
        material: "nucleolusMat",
        function: "Synthesizes ribosomal RNA (rRNA) and assembles ribosomes.",
        assemblyOrder: 4,
        connections: ["Nucleoplasm"],
        failureEffect: "Inability to form ribosomes.",
        cascadeFailures: ["Protein synthesis halt"],
        originalPosition: { x: 0.5, y: 1.5, z: -1 },
        explodedPosition: { x: 30, y: 15, z: -30 }
    });

    // 5. Rough ER
    const roughERGroup = new THREE.Group();
    roughERGroup.position.set(2, 1, -2); // Centered around nucleus
    for (let i = 0; i < 5; i++) {
        const erGeo = new THREE.TorusGeometry(nucleusRadius + 1 + i*1.2, 0.8, 32, 100, Math.PI * 1.5);
        const erMesh = new THREE.Mesh(erGeo, roughERMat);
        erMesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        // Add Ribosomes to ER
        const riboGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const numRibosomes = 400 + i*100;
        for(let j=0; j<numRibosomes; j++) {
            const rMesh = new THREE.Mesh(riboGeo, ribosomeMat);
            const u = Math.random() * Math.PI * 1.5;
            const v = Math.random() * Math.PI * 2;
            const R = nucleusRadius + 1 + i*1.2;
            const r = 0.8;
            rMesh.position.x = (R + r * Math.cos(v)) * Math.cos(u);
            rMesh.position.y = (R + r * Math.cos(v)) * Math.sin(u);
            rMesh.position.z = r * Math.sin(v);
            
            // Add slight offset to be on surface
            const norm = rMesh.position.clone().normalize().multiplyScalar(0.05);
            rMesh.position.add(norm);
            erMesh.add(rMesh);
        }
        roughERGroup.add(erMesh);
    }
    group.add(roughERGroup);

    parts.push({
        name: "Rough Endoplasmic Reticulum",
        description: "Network of membranous tubules and sacs studded with ribosomes.",
        material: "roughERMat",
        function: "Protein synthesis, folding, and sorting.",
        assemblyOrder: 5,
        connections: ["Nucleus", "Ribosomes", "Golgi Apparatus"],
        failureEffect: "Accumulation of misfolded proteins.",
        cascadeFailures: ["ER stress", "Apoptosis"],
        originalPosition: { x: 2, y: 1, z: -2 },
        explodedPosition: { x: -20, y: 10, z: -20 }
    });

    // 6. Smooth ER
    const smoothERGroup = new THREE.Group();
    smoothERGroup.position.set(8, 3, -6);
    for (let i = 0; i < 15; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.random()*3, Math.random()*3, Math.random()*3),
            new THREE.Vector3(Math.random()*6-3, Math.random()*6-3, Math.random()*6-3),
            new THREE.Vector3(Math.random()*4, Math.random()*4, Math.random()*4)
        ]);
        const serGeo = new THREE.TubeGeometry(path, 20, 0.4, 16, false);
        const serMesh = new THREE.Mesh(serGeo, smoothERMat);
        serMesh.position.set(Math.random()*4-2, Math.random()*4-2, Math.random()*4-2);
        smoothERGroup.add(serMesh);
    }
    group.add(smoothERGroup);

    parts.push({
        name: "Smooth Endoplasmic Reticulum",
        description: "Tubular network lacking ribosomes.",
        material: "smoothERMat",
        function: "Lipid synthesis and detoxification.",
        assemblyOrder: 6,
        connections: ["Rough ER", "Cytoplasm"],
        failureEffect: "Toxicity buildup and membrane deficit.",
        cascadeFailures: ["Cell membrane rupture"],
        originalPosition: { x: 8, y: 3, z: -6 },
        explodedPosition: { x: 25, y: -10, z: -25 }
    });

    // 7. Golgi Apparatus
    const golgiGroup = new THREE.Group();
    golgiGroup.position.set(-8, -2, 6);
    golgiGroup.rotation.set(0.5, 0.5, 0);
    for(let i=0; i<6; i++) {
        const gGeo = new THREE.TorusGeometry(4 - i*0.4, 0.6, 32, 64, Math.PI * 1.2);
        const gMesh = new THREE.Mesh(gGeo, golgiMat);
        gMesh.position.y = i * 0.8 - 2;
        gMesh.scale.z = 0.5; // flatten
        // Add vesicles budding off
        if (i % 2 === 0) {
            const vesicle = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), golgiMat);
            vesicle.position.set(4 - i*0.4, 0, 0);
            gMesh.add(vesicle);
            const vesicle2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), golgiMat);
            vesicle2.position.set(-(4 - i*0.4), 0, 0);
            gMesh.add(vesicle2);
        }
        golgiGroup.add(gMesh);
    }
    group.add(golgiGroup);

    parts.push({
        name: "Golgi Apparatus",
        description: "Stack of flattened, membrane-bound sacs (cisternae).",
        material: "golgiMat",
        function: "Modifies, sorts, and packages proteins.",
        assemblyOrder: 7,
        connections: ["Rough ER", "Secretory Vesicles"],
        failureEffect: "Proteins not delivered to correct locations.",
        cascadeFailures: ["Lysosomal storage diseases", "Membrane defect"],
        originalPosition: { x: -8, y: -2, z: 6 },
        explodedPosition: { x: -30, y: -10, z: 20 }
    });

    // 8. Mitochondria
    const mitochondriaGroup = new THREE.Group();
    const animMitos = []; // For animation
    for(let i=0; i<12; i++) {
        const mito = new THREE.Group();
        
        // Outer membrane
        const outGeo = new THREE.SphereGeometry(2, 32, 32);
        const outMesh = new THREE.Mesh(outGeo, mitoMat);
        outMesh.scale.set(1, 0.5, 0.5);
        mito.add(outMesh);
        
        // Inner cristae (abstract representation using folded planes)
        for(let j=0; j<7; j++) {
            const cristaeGeo = new THREE.PlaneGeometry(1.6, 1.8);
            const cristaeMesh = new THREE.Mesh(cristaeGeo, cristaeMat);
            cristaeMesh.position.x = -1.2 + j * 0.4;
            cristaeMesh.rotation.y = Math.PI / 2;
            cristaeMesh.rotation.x = Math.random() * 0.5 - 0.25;
            mito.add(cristaeMesh);
        }

        // Random positioning in cell, avoiding nucleus
        let valid = false;
        while(!valid) {
            mito.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
            if(mito.position.length() < 22 && mito.position.distanceTo(nucleusMesh.position) > 10) {
                valid = true;
            }
        }
        mito.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        mitochondriaGroup.add(mito);
        animMitos.push(mito);
    }
    group.add(mitochondriaGroup);

    parts.push({
        name: "Mitochondria",
        description: "Double-membrane-bound organelle with inner folds (cristae).",
        material: "mitoMat",
        function: "Generates ATP through cellular respiration.",
        assemblyOrder: 8,
        connections: ["Cytoplasm", "Cytoskeleton"],
        failureEffect: "Energy depletion.",
        cascadeFailures: ["Apoptosis", "Cell death"],
        originalPosition: { x: 10, y: 10, z: 10 },
        explodedPosition: { x: 40, y: 40, z: 40 }
    });

    // 9. Lysosomes & 10. Peroxisomes
    const vesiclesGroup = new THREE.Group();
    const animVesicles = [];
    for(let i=0; i<30; i++) {
        const isLysosome = Math.random() > 0.5;
        const vGeo = new THREE.SphereGeometry(isLysosome ? 0.8 : 0.6, 32, 32);
        const vMesh = new THREE.Mesh(vGeo, isLysosome ? lysosomeMat : peroxisomeMat);
        
        let valid = false;
        while(!valid) {
            vMesh.position.set(
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 45,
                (Math.random() - 0.5) * 45
            );
            if(vMesh.position.length() < 25 && vMesh.position.distanceTo(nucleusMesh.position) > 8) {
                valid = true;
            }
        }
        vesiclesGroup.add(vMesh);
        animVesicles.push(vMesh);
    }
    group.add(vesiclesGroup);

    parts.push({
        name: "Lysosomes",
        description: "Spherical vesicles containing hydrolytic enzymes.",
        material: "lysosomeMat",
        function: "Breaks down waste materials and cellular debris.",
        assemblyOrder: 9,
        connections: ["Golgi Apparatus", "Endosomes"],
        failureEffect: "Waste accumulation.",
        cascadeFailures: ["Cell toxicity", "Storage diseases"],
        originalPosition: { x: 5, y: -5, z: 5 },
        explodedPosition: { x: 30, y: -30, z: 30 }
    });

    parts.push({
        name: "Peroxisomes",
        description: "Small vesicles with oxidative enzymes.",
        material: "peroxisomeMat",
        function: "Lipid metabolism and chemical detoxification.",
        assemblyOrder: 10,
        connections: ["Smooth ER"],
        failureEffect: "Reactive oxygen species buildup.",
        cascadeFailures: ["DNA damage", "Cellular aging"],
        originalPosition: { x: -5, y: 5, z: -5 },
        explodedPosition: { x: -30, y: 30, z: -30 }
    });

    // 11. Centrosome / Centrioles
    const centrosomeGroup = new THREE.Group();
    centrosomeGroup.position.set(-3, 6, -3);
    
    const createCentriole = () => {
        const centriole = new THREE.Group();
        const tripRadius = 0.6;
        for(let i=0; i<9; i++) {
            const angle = (i / 9) * Math.PI * 2;
            const triplet = new THREE.Group();
            for(let j=0; j<3; j++) {
                const mtGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
                const mtMesh = new THREE.Mesh(mtGeo, centrioleMat);
                mtMesh.position.set(0, 0, j * 0.16);
                triplet.add(mtMesh);
            }
            triplet.position.set(Math.cos(angle)*tripRadius, 0, Math.sin(angle)*tripRadius);
            triplet.rotation.y = -angle + Math.PI/4; // Slight twist
            centriole.add(triplet);
        }
        return centriole;
    };

    const centriole1 = createCentriole();
    const centriole2 = createCentriole();
    centriole2.position.set(0, 1.2, 0);
    centriole2.rotation.x = Math.PI / 2;
    centriole2.rotation.z = Math.PI / 4;
    
    centrosomeGroup.add(centriole1);
    centrosomeGroup.add(centriole2);
    group.add(centrosomeGroup);

    parts.push({
        name: "Centrosome",
        description: "Microtubule organizing center containing a pair of centrioles.",
        material: "centrioleMat",
        function: "Organizes microtubules and regulates cell division cycle.",
        assemblyOrder: 11,
        connections: ["Microtubules", "Nucleus"],
        failureEffect: "Defective cell division.",
        cascadeFailures: ["Aneuploidy", "Cancer progression"],
        originalPosition: { x: -3, y: 6, z: -3 },
        explodedPosition: { x: -20, y: 40, z: -20 }
    });

    // 12. Cytoskeleton (Microtubules)
    const cytoskeletonGroup = new THREE.Group();
    for(let i=0; i<60; i++) {
        const length = 15 + Math.random() * 20;
        const mtGeo = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        const mtMesh = new THREE.Mesh(mtGeo, microtubuleMat);
        
        // Connect from near centrosome to cell periphery
        const endPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        ).normalize().multiplyScalar(28);
        
        const startPoint = centrosomeGroup.position.clone().add(
            new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4)
        );

        const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
        const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
        
        mtMesh.position.copy(midPoint);
        mtMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), direction.normalize());
        // Scale to reach
        mtMesh.scale.y = direction.length() / length;

        cytoskeletonGroup.add(mtMesh);
    }
    group.add(cytoskeletonGroup);

    parts.push({
        name: "Cytoskeleton",
        description: "Dynamic network of protein filaments and tubules.",
        material: "microtubuleMat",
        function: "Provides structural support, shape, and facilitates movement.",
        assemblyOrder: 12,
        connections: ["Plasma Membrane", "All Organelles"],
        failureEffect: "Loss of cell shape and transport.",
        cascadeFailures: ["Organelle misplacement", "Cell collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // 13. Free Ribosomes
    const freeRibosomes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 8, 8), ribosomeMat, 1000);
    const dummy = new THREE.Object3D();
    for(let i=0; i<1000; i++) {
        let valid = false;
        while(!valid) {
            dummy.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            if(dummy.position.length() < 28 && dummy.position.distanceTo(nucleusMesh.position) > 7) {
                valid = true;
            }
        }
        dummy.updateMatrix();
        freeRibosomes.setMatrixAt(i, dummy.matrix);
    }
    group.add(freeRibosomes);

    parts.push({
        name: "Free Ribosomes",
        description: "Protein synthesis complexes floating freely in the cytoplasm.",
        material: "ribosomeMat",
        function: "Synthesizes proteins that function within the cytosol.",
        assemblyOrder: 13,
        connections: ["Cytoplasm"],
        failureEffect: "Deficiency in cytosolic proteins.",
        cascadeFailures: ["Metabolic enzyme lack"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -40, y: -40, z: -40 }
    });

    // Lights for hyper-realism
    const internalLight = new THREE.PointLight(0x88ccff, 1.5, 60);
    internalLight.position.set(0, 0, 0);
    group.add(internalLight);

    const nucleusLight = new THREE.PointLight(0xcc44ff, 1.0, 20);
    nucleusLight.position.copy(nucleusMesh.position);
    group.add(nucleusLight);

    const animate = (time, speed, meshes) => {
        // Rotate nucleus slowly
        nucleusMesh.rotation.y = time * 0.1 * speed;
        nucleolusMesh.rotation.x = time * 0.2 * speed;
        
        // Wobble membrane using shader or vertex displacement (simulated via scale for simplicity here, or sine waves)
        const scaleWave = 1 + Math.sin(time * speed) * 0.02;
        membraneMesh.scale.set(scaleWave, scaleWave, scaleWave);

        // Golgi vesicles bobbing
        golgiGroup.children.forEach((c, idx) => {
            if(c.geometry.type === 'TorusGeometry') {
                c.rotation.z = Math.sin(time * speed + idx) * 0.1;
            }
        });

        // Mitochondria drifting and rotating
        animMitos.forEach((mito, idx) => {
            mito.rotation.x += 0.01 * speed;
            mito.rotation.y += 0.015 * speed;
            mito.position.y += Math.sin(time * speed + idx) * 0.02;
        });

        // Vesicles active transport simulation (moving towards/away from centrosome/membrane)
        animVesicles.forEach((v, idx) => {
            const dir = v.position.clone().normalize();
            const move = Math.sin(time * speed * 2 + idx) * 0.05;
            v.position.add(dir.multiplyScalar(move));
            v.rotation.x += 0.05 * speed;
        });
        
        // Rotate centrosome slightly
        centrosomeGroup.rotation.y = time * 0.05 * speed;
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAnimalCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
