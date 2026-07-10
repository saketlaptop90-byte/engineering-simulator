import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for high-tech biological feel
    const alphaChainMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xff3355, 
        roughness: 0.4, 
        transmission: 0.8, 
        thickness: 2.0, 
        clearcoat: 1.0,
        emissive: 0x440011,
        emissiveIntensity: 0.5,
        wireframe: false
    });
    
    const betaChainMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x3355ff, 
        roughness: 0.4, 
        transmission: 0.8, 
        thickness: 2.0, 
        clearcoat: 1.0,
        emissive: 0x001144,
        emissiveIntensity: 0.5
    });

    const hemeMat = new THREE.MeshStandardMaterial({ 
        color: 0x22ff22, 
        metalness: 0.8, 
        roughness: 0.2, 
        emissive: 0x005500,
        emissiveIntensity: 1.0
    });

    const ironMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        metalness: 1.0, 
        roughness: 0.1, 
        emissive: 0xff6600,
        emissiveIntensity: 2.0
    });

    const oxygenMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, 
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        emissive: 0x00ffff, 
        emissiveIntensity: 3.0,
        clearcoat: 1.0
    });

    // Helper to create globular organic structures
    function createChain(mat, radius, detail, position) {
        const geo = new THREE.IcosahedronGeometry(radius, detail);
        const mesh = new THREE.Mesh(geo, mat);
        
        // Perturb vertices for organic globular look
        const posAttribute = geo.attributes.position;
        const vertex = new THREE.Vector3();
        for (let i = 0; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            const noise = new THREE.Vector3(
                Math.random() - 0.5, 
                Math.random() - 0.5, 
                Math.random() - 0.5
            ).multiplyScalar(radius * 0.35);
            vertex.add(noise);
            posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        geo.computeVertexNormals();
        mesh.position.copy(position);
        
        // Add a high-tech wireframe shell
        const wireMat = new THREE.MeshBasicMaterial({ color: mat.color, wireframe: true, transparent: true, opacity: 0.15 });
        const wireMesh = new THREE.Mesh(geo, wireMat);
        wireMesh.scale.setScalar(1.02);
        mesh.add(wireMesh);

        return mesh;
    }

    // --- Subunits ---

    // Alpha 1 Chain
    const a1Pos = new THREE.Vector3(-3, 3, 1);
    const alpha1Mesh = createChain(alphaChainMat, 3.5, 4, a1Pos);
    group.add(alpha1Mesh);
    parts.push({
        name: 'Alpha 1 Subunit',
        meshName: 'alpha1',
        description: 'One of the two alpha polypeptide chains in adult hemoglobin, containing 141 amino acids. It shifts conformationally during oxygenation.',
        material: alphaChainMat,
        function: 'Forms half of the tetrameric structure, housing a heme group to bind oxygen and communicating state changes (T to R state) to other subunits.',
        assemblyOrder: 1,
        connections: ['Beta 1 Subunit', 'Beta 2 Subunit', 'Heme Group A1'],
        failureEffect: 'Alpha-thalassemia: reduced alpha chain production leads to excess beta chains forming unstable tetramers.',
        cascadeFailures: ['Hemolytic anemia', 'Splenomegaly', 'Tissue hypoxia'],
        originalPosition: { x: a1Pos.x, y: a1Pos.y, z: a1Pos.z },
        explodedPosition: { x: a1Pos.x * 2.5, y: a1Pos.y * 2.5, z: a1Pos.z * 2.5 }
    });

    // Alpha 2 Chain
    const a2Pos = new THREE.Vector3(3, -3, -1);
    const alpha2Mesh = createChain(alphaChainMat, 3.5, 4, a2Pos);
    group.add(alpha2Mesh);
    parts.push({
        name: 'Alpha 2 Subunit',
        meshName: 'alpha2',
        description: 'The second alpha polypeptide chain, structurally identical to Alpha 1.',
        material: alphaChainMat,
        function: 'Contributes to the quaternary structure and allosteric cooperativity of oxygen binding.',
        assemblyOrder: 2,
        connections: ['Beta 1 Subunit', 'Beta 2 Subunit', 'Heme Group A2'],
        failureEffect: 'Decreased cooperativity and structural instability.',
        cascadeFailures: ['Ineffective erythropoiesis', 'Iron overload'],
        originalPosition: { x: a2Pos.x, y: a2Pos.y, z: a2Pos.z },
        explodedPosition: { x: a2Pos.x * 2.5, y: a2Pos.y * 2.5, z: a2Pos.z * 2.5 }
    });

    // Beta 1 Chain
    const b1Pos = new THREE.Vector3(-3, -3, 2);
    const beta1Mesh = createChain(betaChainMat, 3.8, 4, b1Pos);
    group.add(beta1Mesh);
    parts.push({
        name: 'Beta 1 Subunit',
        meshName: 'beta1',
        description: 'One of the two beta polypeptide chains, containing 146 amino acids.',
        material: betaChainMat,
        function: 'Interacts strongly with alpha chains and binds 2,3-BPG to regulate oxygen affinity.',
        assemblyOrder: 3,
        connections: ['Alpha 1 Subunit', 'Alpha 2 Subunit', 'Heme Group B1'],
        failureEffect: 'Sickle cell mutation (HbS) causes polymerization under deoxygenated conditions.',
        cascadeFailures: ['RBC sickling', 'Vaso-occlusion', 'Organ infarction'],
        originalPosition: { x: b1Pos.x, y: b1Pos.y, z: b1Pos.z },
        explodedPosition: { x: b1Pos.x * 2.5, y: b1Pos.y * 2.5, z: b1Pos.z * 2.5 }
    });

    // Beta 2 Chain
    const b2Pos = new THREE.Vector3(3, 3, -2);
    const beta2Mesh = createChain(betaChainMat, 3.8, 4, b2Pos);
    group.add(beta2Mesh);
    parts.push({
        name: 'Beta 2 Subunit',
        meshName: 'beta2',
        description: 'The second beta polypeptide chain.',
        material: betaChainMat,
        function: 'Completes the hemoglobin tetramer, facilitating the Bohr effect (pH-dependent oxygen affinity).',
        assemblyOrder: 4,
        connections: ['Alpha 1 Subunit', 'Alpha 2 Subunit', 'Heme Group B2'],
        failureEffect: 'Beta-thalassemia: absent or reduced beta chain production.',
        cascadeFailures: ['Severe anemia', 'Extramedullary hematopoiesis', 'Bone marrow expansion'],
        originalPosition: { x: b2Pos.x, y: b2Pos.y, z: b2Pos.z },
        explodedPosition: { x: b2Pos.x * 2.5, y: b2Pos.y * 2.5, z: b2Pos.z * 2.5 }
    });

    // --- Heme Groups & Iron ---

    const hemePositions = [
        new THREE.Vector3(-4.5, 4.5, 2.5), // A1
        new THREE.Vector3(4.5, -4.5, -2.5), // A2
        new THREE.Vector3(-4.5, -4.5, 4.5), // B1
        new THREE.Vector3(4.5, 4.5, -4.5)  // B2
    ];

    const hemeNames = ['Heme Group A1', 'Heme Group A2', 'Heme Group B1', 'Heme Group B2'];
    const chainLinks = ['Alpha 1 Subunit', 'Alpha 2 Subunit', 'Beta 1 Subunit', 'Beta 2 Subunit'];

    for(let i=0; i<4; i++) {
        // Heme Porphyrin Ring
        const hemeGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
        const hemeMesh = new THREE.Mesh(hemeGeo, hemeMat);
        hemeMesh.position.copy(hemePositions[i]);
        hemeMesh.lookAt(new THREE.Vector3(0,0,0));
        
        // Add futuristic inner glowing disk to Heme
        const hemeCoreGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
        const hemeCoreMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x008800, transparent: true, opacity: 0.5 });
        const hemeCore = new THREE.Mesh(hemeCoreGeo, hemeCoreMat);
        hemeCore.rotation.x = Math.PI / 2;
        hemeMesh.add(hemeCore);

        group.add(hemeMesh);
        parts.push({
            name: hemeNames[i],
            meshName: 'heme'+i,
            description: 'A glowing heterocyclic porphyrin ring structure bound to each subunit.',
            material: hemeMat,
            function: 'Provides the rigid, planar chemical scaffold required to hold the iron ion securely in place for oxygen binding.',
            assemblyOrder: 5 + i * 3,
            connections: [chainLinks[i], 'Iron Ion ' + (i+1)],
            failureEffect: 'Porphyria: enzyme deficiencies inhibit heme synthesis, causing toxic precursor buildup.',
            cascadeFailures: ['Neurovisceral attacks', 'Photosensitivity', 'Skin lesions'],
            originalPosition: { x: hemePositions[i].x, y: hemePositions[i].y, z: hemePositions[i].z },
            explodedPosition: { x: hemePositions[i].x * 3.0, y: hemePositions[i].y * 3.0, z: hemePositions[i].z * 3.0 }
        });

        // Iron Ion (Fe2+)
        const ironGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const ironMesh = new THREE.Mesh(ironGeo, ironMat);
        ironMesh.position.copy(hemePositions[i]);
        
        // Add neon corona to iron
        const ironCorona = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending }));
        ironMesh.add(ironCorona);

        group.add(ironMesh);
        parts.push({
            name: 'Iron Ion ' + (i+1),
            meshName: 'iron'+i,
            description: 'Highly reactive Fe2+ (ferrous) ion stationed at the center of the heme ring.',
            material: ironMat,
            function: 'Directly coordinates with one O2 molecule. Binding pulls the iron into the porphyrin plane, triggering a massive conformation shift.',
            assemblyOrder: 6 + i * 3,
            connections: [hemeNames[i], 'Oxygen Molecule ' + (i+1)],
            failureEffect: 'Oxidation to Fe3+ (ferric state) forms Methemoglobin, destroying oxygen binding capability.',
            cascadeFailures: ['Cyanosis', 'Tissue Hypoxia', 'Death'],
            originalPosition: { x: hemePositions[i].x, y: hemePositions[i].y, z: hemePositions[i].z },
            explodedPosition: { x: hemePositions[i].x * 3.5, y: hemePositions[i].y * 3.5, z: hemePositions[i].z * 3.5 }
        });

        // Glowing Oxygen Molecule (O2)
        const o2Group = new THREE.Group();
        const o2Dir = new THREE.Vector3().copy(hemePositions[i]).normalize();
        const o2StartPos = hemePositions[i].clone().add(o2Dir.clone().multiplyScalar(8)); // starts far away
        const o2TargetPos = hemePositions[i].clone().add(o2Dir.clone().multiplyScalar(0.8)); // binds close to iron
        
        o2Group.position.copy(o2StartPos);
        
        const o1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), oxygenMat);
        o1.position.set(-0.3, 0, 0);
        const o2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), oxygenMat);
        o2.position.set(0.3, 0, 0);
        
        // Connecting neon bond
        const bondGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
        const bondMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.rotation.z = Math.PI / 2;

        o2Group.add(o1);
        o2Group.add(o2);
        o2Group.add(bond);
        
        // Add halo to O2
        const o2Halo = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending }));
        o2Group.add(o2Halo);

        group.add(o2Group);
        
        // Store animation data
        o2Group.userData = { 
            targetPos: o2TargetPos, 
            startPos: o2StartPos, 
            phaseOffset: i * (Math.PI / 2),
            isBound: false
        };

        parts.push({
            name: 'Oxygen Molecule ' + (i+1),
            meshName: 'o2_'+i,
            meshRef: o2Group, // internal reference for animation loop
            description: 'Diatomic oxygen (O2) wrapped in a neon energetic field.',
            material: oxygenMat,
            function: 'The vital payload. Binding is cooperative: the first O2 bound increases the affinity of the remaining heme groups.',
            assemblyOrder: 7 + i * 3,
            connections: ['Iron Ion ' + (i+1)],
            failureEffect: 'Carbon monoxide (CO) competitive inhibition; CO binds 200x tighter than O2.',
            cascadeFailures: ['Carboxyhemoglobin formation', 'Cellular asphyxiation', 'Systemic shutdown'],
            originalPosition: { x: o2TargetPos.x, y: o2TargetPos.y, z: o2TargetPos.z },
            explodedPosition: { x: o2StartPos.x, y: o2StartPos.y, z: o2StartPos.z }
        });
    }

    const description = "Hemoglobin (Hb) is a highly sophisticated, multi-subunit metalloprotein engineered for respiratory gas transport. This ultra high-tech simulation visualizes the tetrameric architecture, the critical porphyrin heme rings, and the dynamic, cooperative binding of glowing oxygen molecules transitioning the protein between Tense (T) and Relaxed (R) states.";

    const quizQuestions = [
        {
            question: "What state must the central Iron Ion be in to successfully bind Oxygen?",
            options: ["Fe+ (Cuprous)", "Fe2+ (Ferrous)", "Fe3+ (Ferric)", "Fe4+ (Ferryl)"],
            correct: 1,
            explanation: "Iron must be in the ferrous (Fe2+) state. If oxidized to the ferric (Fe3+) state, it forms Methemoglobin, destroying its oxygen binding capabilities.",
            difficulty: "Medium"
        },
        {
            question: "Which term describes the phenomenon where the binding of one O2 molecule increases the hemoglobin's affinity for subsequent O2 molecules?",
            options: ["Competitive Inhibition", "Allosteric Cooperativity", "The Bohr Effect", "Covalent Modulation"],
            correct: 1,
            explanation: "Allosteric Cooperativity allows hemoglobin to efficiently load oxygen in the lungs and rapidly unload it in hypoxic tissues by shifting from the T (Tense) to R (Relaxed) state.",
            difficulty: "Hard"
        },
        {
            question: "A genetic mutation causing a single amino acid substitution (Glutamic Acid to Valine) in the Beta subunits results in which catastrophic failure?",
            options: ["Alpha-thalassemia", "Hemophilia A", "Sickle Cell Disease", "Acute Intermittent Porphyria"],
            correct: 2,
            explanation: "This specific point mutation causes hemoglobin tetramers to polymerize into rigid strands under low oxygen conditions, deforming RBCs into a sickle shape and causing vaso-occlusion.",
            difficulty: "Medium"
        },
        {
            question: "How does Carbon Monoxide (CO) cause systemic asphyxiation?",
            options: ["It destroys the heme ring", "It oxidizes iron to Fe3+", "It competitively binds to iron with ~200x higher affinity than O2", "It denatures the alpha chains"],
            correct: 2,
            explanation: "CO binds to the same ferrous site as oxygen but with vastly higher affinity, forming carboxyhemoglobin and preventing oxygen transport.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Tense/Relaxed state breathing animation (protein conformation shifts)
        const breath = Math.sin(time * 1.5 * speed) * 0.05;
        const scale = 1 + breath;
        
        group.scale.set(scale, scale, scale);
        group.rotation.y = time * 0.15 * speed;
        group.rotation.z = Math.sin(time * 0.1 * speed) * 0.1;

        // Animate organic subunits morphing slightly
        [alpha1Mesh, alpha2Mesh, beta1Mesh, beta2Mesh].forEach(mesh => {
            mesh.rotation.x = Math.sin(time * speed * 0.5) * 0.05;
            mesh.rotation.y = Math.cos(time * speed * 0.5) * 0.05;
        });

        // Retrieve O2 meshes
        const o2Groups = parts.filter(p => p.meshRef).map(p => p.meshRef);
        
        // Animate oxygen molecules flying in, binding, and leaving
        o2Groups.forEach((o2Group) => {
            const phase = time * speed * 0.5 + o2Group.userData.phaseOffset;
            
            // Generate a cycle value between 0 and 1
            const cycle = (Math.sin(phase) + 1) / 2; 

            // Smooth interpolation between deep space (startPos) and bound (targetPos)
            o2Group.position.lerpVectors(o2Group.userData.startPos, o2Group.userData.targetPos, Math.pow(cycle, 3)); // Pow(3) makes it snap in faster at the end
            
            // Spin the O2 molecule dynamically
            o2Group.rotation.x += 0.05 * speed;
            o2Group.rotation.y += 0.08 * speed;

            // Pulse glowing intensity heavily when completely bound
            if (cycle > 0.9) {
                const pulse = 3.0 + Math.sin(time * 15 * speed) * 2.0;
                o2Group.children.forEach(c => {
                    if(c.material.emissiveIntensity !== undefined) {
                        c.material.emissiveIntensity = pulse;
                    }
                });
            } else {
                o2Group.children.forEach(c => {
                    if(c.material.emissiveIntensity !== undefined) {
                        c.material.emissiveIntensity = 3.0; // Normal bright state
                    }
                });
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHemoglobin() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
