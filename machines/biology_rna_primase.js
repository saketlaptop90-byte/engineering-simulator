import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom materials
    const dnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    const rnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x440044,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
    });

    const primaseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        roughness: 0.3,
        metalness: 0.5,
        clearcoat: 0.5,
        transmission: 0.2,
    });

    const activeSiteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
    });

    // 1. DNA Template Strand (Single-stranded DNA segment)
    const dnaTemplateGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    dnaTemplateGeometry.rotateZ(Math.PI / 2);
    const dnaTemplate = new THREE.Mesh(dnaTemplateGeometry, dnaMaterial);
    group.add(dnaTemplate);
    meshes.dnaTemplate = dnaTemplate;

    parts.push({
        name: "DNA Template Strand",
        description: "Single-stranded DNA that serves as the template for RNA primer synthesis.",
        material: "DNA Material (Cyan)",
        function: "Provides the sequence information necessary for synthesizing a complementary RNA primer.",
        assemblyOrder: 1,
        connections: ["Primase Core", "Nucleotide Bases"],
        failureEffect: "Without a template, primase cannot synthesize a complementary primer.",
        cascadeFailures: ["RNA Primer Synthesis Failure", "DNA Replication Halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -2 }
    });

    // DNA Bases
    for (let i = -4; i <= 4; i++) {
        const baseGeom = new THREE.BoxGeometry(0.2, 0.6, 0.2);
        const baseMesh = new THREE.Mesh(baseGeom, dnaMaterial);
        baseMesh.position.set(i * 1.0, 0.4, 0);
        group.add(baseMesh);
    }

    // 2. Primase Core (The main enzyme body)
    const primaseCoreGeometry = new THREE.TorusKnotGeometry(1.5, 0.6, 64, 16);
    const primaseCore = new THREE.Mesh(primaseCoreGeometry, primaseMaterial);
    primaseCore.position.set(0, 0, 0);
    group.add(primaseCore);
    meshes.primaseCore = primaseCore;

    parts.push({
        name: "Primase Core Unit",
        description: "The main structural body of the RNA Primase enzyme.",
        material: "Enzyme Matrix (Orange/Translucent)",
        function: "Encloses the active site and binds to the single-stranded DNA template.",
        assemblyOrder: 2,
        connections: ["DNA Template Strand", "Active Site"],
        failureEffect: "Structural instability leading to loss of binding affinity to DNA.",
        cascadeFailures: ["Replication Initiation Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 3. Active Site (Where polymerization happens)
    const activeSiteGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const activeSite = new THREE.Mesh(activeSiteGeometry, activeSiteMaterial);
    activeSite.position.set(0, 0.5, 0.5);
    group.add(activeSite);
    meshes.activeSite = activeSite;

    parts.push({
        name: "Catalytic Active Site",
        description: "The region where RNA nucleotides are joined together.",
        material: "Glowing Core (White/Orange)",
        function: "Catalyzes the formation of phosphodiester bonds between incoming ribonucleotides.",
        assemblyOrder: 3,
        connections: ["Primase Core", "Incoming Nucleotides"],
        failureEffect: "Inability to link nucleotides, preventing primer formation.",
        cascadeFailures: ["Complete replication failure"],
        originalPosition: { x: 0, y: 0.5, z: 0.5 },
        explodedPosition: { x: 0, y: 3.5, z: 2 }
    });

    // 4. Synthesized RNA Primer
    const primerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    primerGeometry.rotateZ(Math.PI / 2);
    const primerStrand = new THREE.Mesh(primerGeometry, rnaMaterial);
    primerStrand.position.set(-1.5, 0.8, 0);
    group.add(primerStrand);
    meshes.primerStrand = primerStrand;

    parts.push({
        name: "RNA Primer",
        description: "A short strand of RNA synthesized by the primase.",
        material: "RNA Material (Magenta)",
        function: "Provides a free 3'-OH group for DNA polymerase to begin synthesis.",
        assemblyOrder: 4,
        connections: ["DNA Template Strand", "Active Site"],
        failureEffect: "DNA polymerase cannot initiate synthesis.",
        cascadeFailures: ["Okazaki Fragment Failure", "Lagging Strand Arrest"],
        originalPosition: { x: -1.5, y: 0.8, z: 0 },
        explodedPosition: { x: -3, y: 2, z: -2 }
    });

    // RNA Bases
    const rnaBases = [];
    for (let i = 0; i < 3; i++) {
        const baseGeom = new THREE.BoxGeometry(0.2, 0.6, 0.2);
        const baseMesh = new THREE.Mesh(baseGeom, rnaMaterial);
        baseMesh.position.set(-2.5 + i * 1.0, 0.5, 0);
        group.add(baseMesh);
        rnaBases.push(baseMesh);
    }
    meshes.rnaBases = rnaBases;

    // Incoming NTPs
    const ntpGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const incomingNTP = new THREE.Mesh(ntpGeom, rnaMaterial);
    incomingNTP.position.set(2, 2, 0);
    group.add(incomingNTP);
    meshes.incomingNTP = incomingNTP;

    parts.push({
        name: "Incoming Ribonucleotide (NTP)",
        description: "Free RNA nucleotides entering the active site.",
        material: "RNA Material (Magenta)",
        function: "Building blocks for the RNA primer.",
        assemblyOrder: 5,
        connections: ["Active Site"],
        failureEffect: "Primer extension halts.",
        cascadeFailures: ["Shortened primers", "Replication stall"],
        originalPosition: { x: 2, y: 2, z: 0 },
        explodedPosition: { x: 4, y: 4, z: 2 }
    });

    const description = "RNA Primase is a specialized RNA polymerase that synthesizes short RNA primers using a single-stranded DNA template. This step is critical because DNA polymerases can only extend existing strands and cannot initiate synthesis de novo. The glowing magenta structures represent the newly formed RNA primer, providing the crucial 3'-OH group for DNA replication to proceed.";

    const quizQuestions = [
        {
            question: "Why is RNA Primase essential for DNA replication?",
            options: [
                "It unwinds the DNA double helix",
                "It synthesizes DNA directly",
                "It provides a starting 3'-OH group for DNA polymerase",
                "It ligates Okazaki fragments together"
            ],
            correct: 2,
            explanation: "DNA polymerase cannot start synthesis from scratch; it requires an existing 3'-OH group, which is provided by the short RNA primer synthesized by primase.",
            difficulty: "Medium"
        },
        {
            question: "What type of molecules are joined together by RNA Primase?",
            options: [
                "Deoxyribonucleotides (dNTPs)",
                "Ribonucleotides (NTPs)",
                "Amino acids",
                "Fatty acids"
            ],
            correct: 1,
            explanation: "As an RNA polymerase, primase uses ribonucleoside triphosphates (NTPs) to build the RNA primer.",
            difficulty: "Easy"
        },
        {
            question: "On which strand is primase activity required most frequently during DNA replication?",
            options: [
                "Leading strand",
                "Lagging strand",
                "Both equally",
                "Neither"
            ],
            correct: 1,
            explanation: "The lagging strand is synthesized discontinuously as Okazaki fragments, each requiring a new RNA primer to initiate synthesis.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, explodedness) {
        // Core rotation
        meshes.primaseCore.rotation.x = time * 0.5 * speed;
        meshes.primaseCore.rotation.y = time * 0.3 * speed;
        
        meshes.activeSite.scale.setScalar(1 + Math.sin(time * 5 * speed) * 0.1);
        meshes.activeSite.material.emissiveIntensity = 0.5 + Math.sin(time * 5 * speed) * 0.3;

        // DNA template sliding effect
        const dnaSlide = (time * speed) % 2 - 1;
        meshes.dnaTemplate.position.x = dnaSlide * 0.5;

        // Incoming NTP floating
        meshes.incomingNTP.position.y = 2 + Math.sin(time * 3 * speed) * 0.5;
        meshes.incomingNTP.position.x = 1.5 + Math.cos(time * 2 * speed) * 0.5;

        // Apply explodedness
        parts.forEach((part) => {
            const meshName = part.name === "DNA Template Strand" ? "dnaTemplate" :
                             part.name === "Primase Core Unit" ? "primaseCore" :
                             part.name === "Catalytic Active Site" ? "activeSite" :
                             part.name === "RNA Primer" ? "primerStrand" :
                             part.name === "Incoming Ribonucleotide (NTP)" ? "incomingNTP" : null;
            
            if (meshName && meshes[meshName]) {
                const mesh = meshes[meshName];
                mesh.position.lerpVectors(
                    new THREE.Vector3(part.originalPosition.x, part.originalPosition.y, part.originalPosition.z),
                    new THREE.Vector3(part.explodedPosition.x, part.explodedPosition.y, part.explodedPosition.z),
                    explodedness
                );
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRNAPrimase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
