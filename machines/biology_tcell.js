import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        emissive: 0xff0000,
        emissiveIntensity: 1.2,
        roughness: 0.4,
        metalness: 0.5
    });

    const cellMembraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        emissive: 0x002244,
        emissiveIntensity: 0.5
    });
    
    const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x6600cc,
        emissive: 0x330066,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.1
    });

    // 1. Cell Body (Membrane)
    const bodyGeometry = new THREE.SphereGeometry(4, 64, 64);
    // Displace vertices slightly for organic look
    const pos = bodyGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(
            i,
            pos.getX(i) * (1 + 0.05 * Math.sin(pos.getY(i) * 5)),
            pos.getY(i) * (1 + 0.05 * Math.sin(pos.getZ(i) * 5)),
            pos.getZ(i) * (1 + 0.05 * Math.sin(pos.getX(i) * 5))
        );
    }
    bodyGeometry.computeVertexNormals();
    const cellBody = new THREE.Mesh(bodyGeometry, cellMembraneMat);
    group.add(cellBody);

    parts.push({
        name: "Cell Membrane",
        description: "The semi-permeable outer boundary of the T-cell, studded with various receptors.",
        material: "Organic Lipid Bilayer (Simulated)",
        function: "Protects internal organelles and hosts surface receptors for antigen recognition.",
        assemblyOrder: 1,
        connections: ["Cytoskeleton", "T-Cell Receptors"],
        failureEffect: "Cell lysis and death.",
        cascadeFailures: ["Loss of cellular integrity", "Release of intracellular contents"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: cellBody
    });

    // 2. Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMat);
    nucleus.position.set(0.5, 0.2, -0.5);
    group.add(nucleus);

    parts.push({
        name: "Nucleus",
        description: "The control center of the cell containing genetic material.",
        material: "Chromatin & Nuclear Envelope",
        function: "Stores DNA and regulates gene expression for cytokine production and cell division.",
        assemblyOrder: 2,
        connections: ["Endoplasmic Reticulum"],
        failureEffect: "Inability to function or divide.",
        cascadeFailures: ["Failure of clonal expansion", "Apoptosis"],
        originalPosition: { x: 0.5, y: 0.2, z: -0.5 },
        explodedPosition: { x: -10, y: 0, z: -5 },
        mesh: nucleus
    });

    // 3. T-Cell Receptors (TCRs)
    const tcrGroup = new THREE.Group();
    const tcrGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const tcrTopGeo = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    
    // Create several TCRs around the membrane
    const tcrMeshes = [];
    for (let i = 0; i < 20; i++) {
        const tcr = new THREE.Group();
        
        const stem = new THREE.Mesh(tcrGeometry, plastic);
        stem.position.y = 0.5;
        
        const receptor = new THREE.Mesh(tcrTopGeo, glowBlue);
        receptor.position.y = 1;
        
        tcr.add(stem);
        tcr.add(receptor);
        
        // Random placement on sphere
        const phi = Math.acos(-1 + (2 * i) / 20);
        const theta = Math.sqrt(20 * Math.PI) * phi;
        
        const r = 4.0;
        tcr.position.set(
            r * Math.cos(theta) * Math.sin(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(phi)
        );
        tcr.lookAt(0, 0, 0);
        // rotate so it points outward
        tcr.rotateX(-Math.PI / 2);
        
        tcrGroup.add(tcr);
        tcrMeshes.push(receptor); // Keep track of the glowing parts
    }
    group.add(tcrGroup);

    parts.push({
        name: "T-Cell Receptors (TCRs)",
        description: "Specialized protein complexes on the cell surface.",
        material: "Protein Complex / Glycoproteins",
        function: "Recognize and bind to specific foreign antigens presented by other cells.",
        assemblyOrder: 3,
        connections: ["Cell Membrane", "Intracellular Signaling Pathways"],
        failureEffect: "Inability to recognize pathogens.",
        cascadeFailures: ["Immunodeficiency", "Failure to activate immune response"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 10, z: 10 },
        mesh: tcrGroup,
        tcrMeshes: tcrMeshes
    });

    // 4. Mitochondria
    const mitoGroup = new THREE.Group();
    const mitoGeo = new THREE.CapsuleGeometry(0.3, 0.6, 16, 16);
    
    for(let i = 0; i < 5; i++) {
        const mito = new THREE.Mesh(mitoGeo, glowRed);
        mito.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        mito.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        // Ensure they are inside the cell
        if (mito.position.length() > 3) mito.position.setLength(2.5);
        mitoGroup.add(mito);
    }
    group.add(mitoGroup);

    parts.push({
        name: "Mitochondria",
        description: "Energy-producing organelles.",
        material: "Double Membrane Organelle",
        function: "Produces ATP to power cellular functions, especially during activation and proliferation.",
        assemblyOrder: 4,
        connections: ["Cytoplasm"],
        failureEffect: "Cellular energy depletion.",
        cascadeFailures: ["Exhaustion", "Inability to perform effector functions"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 5 },
        mesh: mitoGroup
    });


    const description = "A high-tech visualization of a T-Cell, a crucial lymphocyte of the immune system. This model highlights the cell membrane, the nucleus where genetic instructions are housed, the mitochondria that power its rapid response, and the specialized T-Cell Receptors (TCRs) that scan for and bind to specific pathogenic antigens.";

    const quizQuestions = [
        {
            question: "What is the primary function of the T-Cell Receptors (TCRs)?",
            options: [
                "To produce energy (ATP) for the cell.",
                "To store the cell's genetic material.",
                "To recognize and bind to specific antigens presented by other cells.",
                "To maintain the structural integrity of the cell membrane."
            ],
            correct: 2,
            explanation: "TCRs are specialized surface molecules that uniquely recognize and bind to specific foreign antigens, triggering the T-cell's immune response.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the mitochondria in a T-cell fail?",
            options: [
                "The cell becomes hyperactive.",
                "The cell loses its energy source, leading to exhaustion and inability to perform immune functions.",
                "The nucleus duplicates its DNA.",
                "The cell membrane immediately ruptures."
            ],
            correct: 1,
            explanation: "Mitochondria generate ATP, the energy currency of the cell. Without it, the T-cell cannot fuel the demanding processes of activation, proliferation, and effector functions.",
            difficulty: "Easy"
        },
        {
            question: "Where is the genetic material required for cytokine production stored?",
            options: [
                "In the Cell Membrane",
                "In the Mitochondria",
                "In the Nucleus",
                "In the TCRs"
            ],
            correct: 2,
            explanation: "The nucleus houses the DNA, which contains the genes necessary for producing cytokines—chemical messengers crucial for immune signaling.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly rotate the whole cell
        group.rotation.y = time * 0.1 * speed;
        group.rotation.z = Math.sin(time * 0.05 * speed) * 0.2;

        // Undulate the cell membrane slightly
        const membrane = parts.find(p => p.name === "Cell Membrane").mesh;
        membrane.scale.set(
            1 + 0.02 * Math.sin(time * speed * 2),
            1 + 0.02 * Math.cos(time * speed * 2.2),
            1 + 0.02 * Math.sin(time * speed * 1.8)
        );

        // Pulse the TCRs (scanning mode)
        const tcrData = parts.find(p => p.name === "T-Cell Receptors (TCRs)");
        if (tcrData && tcrData.tcrMeshes) {
            tcrData.tcrMeshes.forEach((mesh, index) => {
                const pulse = (Math.sin(time * speed * 5 + index) + 1) / 2; // 0 to 1
                mesh.material.emissiveIntensity = 0.5 + pulse * 1.5;
            });
        }
        
        // Rotate mitochondria
        const mito = parts.find(p => p.name === "Mitochondria").mesh;
        mito.children.forEach((m, idx) => {
            m.rotation.x += 0.01 * speed * (idx + 1);
            m.rotation.y += 0.015 * speed;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
