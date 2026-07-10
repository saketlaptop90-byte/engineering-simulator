import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing/neon materials
    const dnaMaterial1 = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0
    });
    
    const dnaMaterial2 = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0x440044,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 1.0
    });

    const gRnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x008800,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const cas9Material = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        emissive: 0x113355,
        transmission: 0.8,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.1,
        ior: 1.5,
        thickness: 3.0,
        transparent: true
    });
    
    const cas9CoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xaa4400,
        wireframe: true,
        emissiveIntensity: 2.0
    });

    const meshes = {};

    // 1. DNA Strand
    const dnaGroup = new THREE.Group();
    const backbone1 = new THREE.Group();
    const backbone2 = new THREE.Group();
    const bases = new THREE.Group();
    
    const numPairs = 40;
    const helixRadius = 1.2;
    const heightStep = 0.4;
    const angleStep = 0.35;

    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const cylGeo = new THREE.CylinderGeometry(0.08, 0.08, helixRadius * 2, 8);

    for (let i = -numPairs/2; i < numPairs/2; i++) {
        const angle = i * angleStep;
        const y = i * heightStep;
        
        const x1 = Math.cos(angle) * helixRadius;
        const z1 = Math.sin(angle) * helixRadius;
        
        const x2 = Math.cos(angle + Math.PI) * helixRadius;
        const z2 = Math.sin(angle + Math.PI) * helixRadius;

        const bb1 = new THREE.Mesh(sphereGeo, dnaMaterial1);
        bb1.position.set(x1, y, z1);
        backbone1.add(bb1);

        const bb2 = new THREE.Mesh(sphereGeo, dnaMaterial2);
        bb2.position.set(x2, y, z2);
        backbone2.add(bb2);

        // Base pairs
        // Central region is targeted by gRNA
        const isTargetRegion = (i > -6 && i < 6);
        const pair = new THREE.Mesh(cylGeo, isTargetRegion ? gRnaMaterial : chrome);
        pair.position.set(0, y, 0);
        pair.rotation.x = Math.PI / 2;
        pair.rotation.z = -angle; 
        bases.add(pair);
    }
    
    dnaGroup.add(backbone1);
    dnaGroup.add(backbone2);
    dnaGroup.add(bases);
    
    // Make DNA horizontal
    dnaGroup.rotation.z = Math.PI / 2; 
    group.add(dnaGroup);
    meshes.dnaGroup = dnaGroup;
    meshes.backbone1 = backbone1;
    meshes.backbone2 = backbone2;
    meshes.bases = bases;

    // 2. Cas9 Protein
    const cas9Group = new THREE.Group();
    
    // Outer shell (lobed structure)
    const cas9Geo1 = new THREE.DodecahedronGeometry(3.5, 2);
    const cas9Mesh1 = new THREE.Mesh(cas9Geo1, cas9Material);
    cas9Mesh1.scale.set(1.4, 0.9, 1.1);
    cas9Mesh1.position.set(-1, 0, 0);
    
    const cas9Geo2 = new THREE.DodecahedronGeometry(2.5, 2);
    const cas9Mesh2 = new THREE.Mesh(cas9Geo2, cas9Material);
    cas9Mesh2.scale.set(1.0, 1.2, 0.8);
    cas9Mesh2.position.set(2, 1, 0);

    cas9Group.add(cas9Mesh1);
    cas9Group.add(cas9Mesh2);

    // Inner core / Active sites (HNH and RuvC domains)
    const coreGeo = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 16);
    const coreMesh = new THREE.Mesh(coreGeo, cas9CoreMaterial);
    coreMesh.position.set(0, 0, 0);
    cas9Group.add(coreMesh);
    
    cas9Group.position.set(0, 0, 0);
    group.add(cas9Group);
    meshes.cas9Group = cas9Group;
    meshes.coreMesh = coreMesh;

    // 3. Guide RNA (gRNA)
    const gRnaGroup = new THREE.Group();
    const gRnaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 2, 0),
        new THREE.Vector3(-2, 1, 1),
        new THREE.Vector3(0, 0, 0.5), // Base pairing region
        new THREE.Vector3(2, 0.5, -0.5),
        new THREE.Vector3(3, 2, 0),
        new THREE.Vector3(1.5, 3.5, 1)
    ]);
    const gRnaGeo = new THREE.TubeGeometry(gRnaCurve, 64, 0.25, 8, false);
    const gRnaMesh = new THREE.Mesh(gRnaGeo, gRnaMaterial);
    gRnaGroup.add(gRnaMesh);
    cas9Group.add(gRnaGroup); 
    meshes.gRnaGroup = gRnaGroup;

    // 4. Cutting mechanism (Energy / neon effect)
    const cutLight = new THREE.PointLight(0xffffff, 0, 15);
    cutLight.position.set(0, 0, 0);
    cas9Group.add(cutLight);
    meshes.cutLight = cutLight;

    // Define parts
    parts.push({
        name: "Cas9 Nuclease",
        description: "An endonuclease enzyme that acts as molecular scissors, cutting both strands of DNA at a specific location specified by the guide RNA.",
        material: cas9Material,
        function: "Cleaves the target DNA sequence to allow for genome editing.",
        assemblyOrder: 1,
        connections: ["Guide RNA", "Target DNA"],
        failureEffect: "If defective, DNA cleavage will not occur or will happen at non-target sites, leading to off-target mutations.",
        cascadeFailures: ["Genome Integrity", "Gene Expression"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    parts.push({
        name: "Guide RNA (gRNA)",
        description: "A synthetic RNA molecule that binds to the Cas9 enzyme and directs it to the specific DNA sequence to be edited.",
        material: gRnaMaterial,
        function: "Provides sequence specificity by complementary base pairing with the target DNA.",
        assemblyOrder: 2,
        connections: ["Cas9 Nuclease", "Target DNA"],
        failureEffect: "Incorrect guide RNA sequence leads to failure in recognizing the target DNA or binding to incorrect genomic locations.",
        cascadeFailures: ["Cas9 Targeting", "Precision Cut"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 4, z: 6}
    });

    parts.push({
        name: "Target DNA Double Helix",
        description: "The genomic DNA molecule containing the specific sequence (protospacer) and PAM sequence targeted for editing.",
        material: dnaMaterial1,
        function: "Stores the genetic information that is being interrogated and modified by the CRISPR system.",
        assemblyOrder: 3,
        connections: ["Cas9 Nuclease", "Guide RNA"],
        failureEffect: "Mutations in the PAM sequence prevent Cas9 from binding and initiating the cut.",
        cascadeFailures: ["Cleavage Event", "Repair Mechanism"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });

    const description = "The CRISPR-Cas9 system is a highly precise genome editing technology adapted from bacterial immune systems. It consists of two key components: the Cas9 endonuclease, acting as molecular scissors, and a guide RNA (gRNA) that directs Cas9 to a specific sequence in the genome. Upon recognizing the target sequence and adjacent PAM (Protospacer Adjacent Motif), Cas9 induces a double-strand break, triggering the cell's natural DNA repair mechanisms, which can be harnessed to add, remove, or alter genetic material.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cas9 enzyme in the CRISPR system?",
            options: [
                "To synthesize new DNA strands",
                "To cut double-stranded DNA at specific target sites",
                "To repair damaged DNA sequences",
                "To transcribe DNA into RNA"
            ],
            correct: 1,
            explanation: "Cas9 is an endonuclease (an enzyme that acts like molecular scissors) whose main role is to cleave both strands of DNA at a precise location designated by the guide RNA.",
            difficulty: "Medium"
        },
        {
            question: "How does the CRISPR-Cas9 complex 'know' where to cut the DNA?",
            options: [
                "It cuts DNA randomly until it finds a mutation.",
                "It is directed by the guide RNA (gRNA) which has a sequence complementary to the target DNA.",
                "It is guided by specific proteins present in the host cell.",
                "It targets the longest DNA sequences available."
            ],
            correct: 1,
            explanation: "The specificity of CRISPR-Cas9 relies on the guide RNA (gRNA), which contains a custom 20-nucleotide sequence that binds to its complementary sequence on the target DNA.",
            difficulty: "Easy"
        },
        {
            question: "What short DNA sequence is required immediately adjacent to the target site for Cas9 to bind and cleave?",
            options: [
                "Promoter region",
                "Start codon (AUG)",
                "Protospacer Adjacent Motif (PAM)",
                "Telomere"
            ],
            correct: 2,
            explanation: "Cas9 requires the presence of a Protospacer Adjacent Motif (PAM)—typically NGG for Streptococcus pyogenes Cas9—immediately downstream of the target sequence to successfully bind and cut the DNA.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, partsMeshes) {
        const t = time * speed;
        
        // Cas9 Core spinning and pulsing
        meshes.coreMesh.rotation.x = t * 0.5;
        meshes.coreMesh.rotation.y = t * 0.7;
        meshes.coreMesh.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
        
        // Scanning motion of Cas9 complex
        meshes.cas9Group.position.x = Math.sin(t * 0.5) * 1.5; 
        meshes.cas9Group.position.y = Math.sin(t * 2) * 0.2;
        
        // DNA floating and slow rotation
        meshes.dnaGroup.position.y = Math.cos(t) * 0.2;
        meshes.dnaGroup.rotation.x = Math.sin(t * 0.5) * 0.1;
        
        // Localized DNA melting (base separation) when Cas9 is near center
        const distanceToCenter = Math.abs(meshes.cas9Group.position.x);
        const meltFactor = Math.max(0, 1 - distanceToCenter); // 1 at center, 0 far away
        
        meshes.backbone1.position.z = meltFactor * 0.5;
        meshes.backbone2.position.z = -meltFactor * 0.5;
        
        // Flash cut light violently when exactly at center
        if (distanceToCenter < 0.1 && meltFactor > 0.9) {
            meshes.cutLight.intensity = Math.random() * 50 + 20;
            meshes.cutLight.color.setHex(0xffffff);
        } else {
            meshes.cutLight.intensity = Math.max(0, meltFactor * 10 - 5);
            meshes.cutLight.color.setHex(0x00aaff);
        }
        
        // Undulate gRNA slightly
        meshes.gRnaGroup.rotation.z = Math.sin(t * 3) * 0.05;
        meshes.gRnaGroup.rotation.x = Math.cos(t * 2) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCRISPRCas9() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
