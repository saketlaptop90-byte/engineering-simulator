import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const dnaMaterial = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        emissive: 0x1122aa,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
    });

    const targetDnaMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4444,
        emissive: 0xaa1111,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
    });

    const cas9Material = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
    });

    const sgRNAMaterial = new THREE.MeshPhongMaterial({
        color: 0x44ff44,
        emissive: 0x11aa11,
        shininess: 80,
    });

    // 1. Cas9 Protein Complex
    const cas9Geometry = new THREE.SphereGeometry(3, 32, 32);
    // Make it look more like a lobed protein
    const positionAttribute = cas9Geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        positionAttribute.setXYZ(i, x + Math.sin(y*2)*0.5, y + Math.cos(z*2)*0.5, z + Math.sin(x*2)*0.5);
    }
    cas9Geometry.computeVertexNormals();
    const cas9 = new THREE.Mesh(cas9Geometry, cas9Material);
    group.add(cas9);

    parts.push({
        name: "Cas9 Protein",
        description: "The endonuclease enzyme that acts as molecular scissors to cut DNA.",
        material: "cas9Material",
        function: "Cleaves the target DNA strands.",
        assemblyOrder: 1,
        connections: ["sgRNA", "Target DNA"],
        failureEffect: "Inability to cut DNA, leading to failed gene editing.",
        cascadeFailures: ["Gene editing fails"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. sgRNA (Single Guide RNA)
    const sgRNAGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 1, -1),
            new THREE.Vector3(-1, 2, 0),
            new THREE.Vector3(0, 1.5, 1),
            new THREE.Vector3(1, 1, 2),
            new THREE.Vector3(2, -0.5, 1.5)
        ]),
        64, 0.3, 8, false
    );
    const sgRNA = new THREE.Mesh(sgRNAGeometry, sgRNAMaterial);
    cas9.add(sgRNA); // Attached to Cas9

    parts.push({
        name: "sgRNA (Single Guide RNA)",
        description: "A synthetic RNA molecule that guides Cas9 to the specific DNA sequence.",
        material: "sgRNAMaterial",
        function: "Binds to the target DNA and directs Cas9 to the correct cutting site.",
        assemblyOrder: 2,
        connections: ["Cas9 Protein", "Target DNA"],
        failureEffect: "Cas9 will not bind to the correct DNA sequence, leading to off-target effects or no editing.",
        cascadeFailures: ["Off-target mutations", "Editing failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 5, z: 2 }
    });

    // 3. DNA Double Helix
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(0, 0, 0);
    
    const numBasePairs = 20;
    const radius = 1.2;
    const heightStep = 0.5;
    const angleStep = 0.4;
    
    const dnaMeshes = [];

    for (let i = -10; i < numBasePairs - 10; i++) {
        const y = i * heightStep;
        const angle = i * angleStep;
        
        // Is it the target region?
        const isTarget = Math.abs(i) < 3;
        const mat = isTarget ? targetDnaMaterial : dnaMaterial;

        // Backbone 1
        const bb1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
        bb1.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        dnaGroup.add(bb1);
        
        // Backbone 2
        const bb2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
        bb2.position.set(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
        dnaGroup.add(bb2);

        // Base pair connection
        const bpGeom = new THREE.CylinderGeometry(0.1, 0.1, radius * 2, 8);
        const bp = new THREE.Mesh(bpGeom, mat);
        bp.position.set(0, y, 0);
        bp.rotation.x = Math.PI / 2;
        bp.rotation.z = angle;
        dnaGroup.add(bp);
        
        if (isTarget) {
            dnaMeshes.push(bp); // Track target bonds for animation
        }
    }
    
    dnaGroup.rotation.z = Math.PI / 2; // Lie flat
    dnaGroup.position.set(-2, 0, 0);
    group.add(dnaGroup);

    parts.push({
        name: "Target DNA Sequence",
        description: "The specific section of the genome to be edited.",
        material: "targetDnaMaterial",
        function: "Contains the genetic information that needs modification.",
        assemblyOrder: 3,
        connections: ["sgRNA", "Cas9 Protein"],
        failureEffect: "If mutated, the sgRNA may not bind.",
        cascadeFailures: ["Failed binding"],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // Save meshes for animation
    const meshes = {
        cas9,
        dnaGroup,
        sgRNA,
        targetBonds: dnaMeshes
    };

    const description = "The CRISPR-Cas9 system is a revolutionary genetic engineering tool derived from the bacterial immune system. It consists of the Cas9 endonuclease, which acts as molecular scissors, and a single guide RNA (sgRNA) that directs Cas9 to a precise location in the genome. Once attached, Cas9 unzips the DNA and cleaves both strands, creating a double-strand break. This allows scientists to add, remove, or alter genetic material at specific locations.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cas9 protein in the CRISPR-Cas9 system?",
            options: [
                "To repair broken DNA strands",
                "To act as a molecular scissor and cut DNA",
                "To guide the system to the target location",
                "To synthesize new DNA"
            ],
            correct: 1,
            explanation: "Cas9 is an endonuclease enzyme that cleaves the phosphodiester bonds in the DNA double helix.",
            difficulty: "Medium"
        },
        {
            question: "What dictates the specific target location where Cas9 will cut the DNA?",
            options: [
                "The size of the Cas9 protein",
                "The PAM sequence alone",
                "The single guide RNA (sgRNA)",
                "The temperature of the cell"
            ],
            correct: 2,
            explanation: "The sgRNA contains a sequence that is complementary to the target DNA, allowing it to guide the Cas9 protein to the exact matching site.",
            difficulty: "Medium"
        },
        {
            question: "Which bacterial mechanism did the CRISPR-Cas9 technology originate from?",
            options: [
                "Bacterial reproduction",
                "Bacterial digestion",
                "Bacterial adaptive immune system",
                "Bacterial photosynthesis"
            ],
            correct: 2,
            explanation: "CRISPR-Cas9 evolved in bacteria and archaea as an adaptive immune system to defend against invading viruses (bacteriophages) by remembering and cutting their DNA.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Slow rotation of the whole DNA strand
        meshes.dnaGroup.position.x = Math.sin(time * speed * 0.5) * 0.5 - 2;
        
        // Cas9 breathing/pulsing effect
        const scale = 1 + Math.sin(time * speed * 2) * 0.02;
        meshes.cas9.scale.set(scale, scale, scale);

        // Guide RNA floating slightly
        meshes.sgRNA.position.y = Math.sin(time * speed * 3) * 0.1;

        // DNA cleavage simulation (bonds breaking in the target region)
        const cutPhase = (time * speed) % (Math.PI * 2);
        if (cutPhase > Math.PI && cutPhase < Math.PI * 1.5) {
            meshes.targetBonds.forEach((bond, i) => {
                // Break apart
                bond.scale.y = Math.max(0.1, 1 - (cutPhase - Math.PI) * 2);
            });
        } else if (cutPhase >= Math.PI * 1.5) {
            meshes.targetBonds.forEach(bond => { bond.scale.y = 0.1; });
        } else {
             meshes.targetBonds.forEach(bond => { bond.scale.y = 1; });
        }
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createCRISPRCas9() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
