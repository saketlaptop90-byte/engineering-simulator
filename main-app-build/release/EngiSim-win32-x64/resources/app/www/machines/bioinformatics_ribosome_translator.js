import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const mrnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.5
    });

    const trnaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.2
    });

    const aminoAcidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.1
    });

    const largeSubunitMaterial = new THREE.MeshStandardMaterial({
        color: 0x3366ff,
        roughness: 0.7,
        metalness: 0.1,
        wireframe: true // High-tech look
    });

    const smallSubunitMaterial = new THREE.MeshStandardMaterial({
        color: 0x6699ff,
        roughness: 0.7,
        metalness: 0.1,
        wireframe: true // High-tech look
    });

    // 1. Small Subunit (30S/40S)
    const smallGeometry = new THREE.CapsuleGeometry(2, 4, 16, 32);
    const smallSubunit = new THREE.Mesh(smallGeometry, smallSubunitMaterial);
    smallSubunit.rotation.z = Math.PI / 2;
    smallSubunit.position.set(0, -2, 0);
    group.add(smallSubunit);
    
    parts.push({
        name: "Small Subunit (40S)",
        description: "Binds to the mRNA transcript and initiates translation.",
        material: "smallSubunitMaterial",
        function: "mRNA Decoding",
        assemblyOrder: 1,
        connections: ["mRNA", "Large Subunit"],
        failureEffect: "Cannot initiate translation.",
        cascadeFailures: ["Protein Synthesis Halt"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Large Subunit (50S/60S)
    const largeGeometry = new THREE.SphereGeometry(3.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const largeSubunit = new THREE.Mesh(largeGeometry, largeSubunitMaterial);
    largeSubunit.position.set(0, 0, 0);
    group.add(largeSubunit);

    parts.push({
        name: "Large Subunit (60S)",
        description: "Catalyzes peptide bond formation and contains A, P, and E sites.",
        material: "largeSubunitMaterial",
        function: "Peptide Bond Formation",
        assemblyOrder: 2,
        connections: ["Small Subunit", "tRNA", "Polypeptide Chain"],
        failureEffect: "Fails to form peptide bonds.",
        cascadeFailures: ["Truncated Protein"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. mRNA Tape ( glowing ribbon )
    const mrnaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -1, 0),
        new THREE.Vector3(-5, -1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(5, -1, 0),
        new THREE.Vector3(10, -1, 0)
    ]);
    const mrnaGeometry = new THREE.TubeGeometry(mrnaCurve, 64, 0.2, 8, false);
    const mrnaMesh = new THREE.Mesh(mrnaGeometry, mrnaMaterial);
    group.add(mrnaMesh);

    parts.push({
        name: "mRNA Transcript",
        description: "Carries genetic instructions from DNA.",
        material: "mrnaMaterial",
        function: "Information Template",
        assemblyOrder: 3,
        connections: ["Small Subunit"],
        failureEffect: "Nonsense translation.",
        cascadeFailures: ["Malformed Proteins"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: -3, z: 5 }
    });

    // 4. tRNA molecules (A, P, E sites)
    const trnaGeo = new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8);
    
    // A-Site tRNA
    const aSiteTrna = new THREE.Mesh(trnaGeo, trnaMaterial);
    aSiteTrna.position.set(1.5, 0, 0);
    group.add(aSiteTrna);
    
    // P-Site tRNA
    const pSiteTrna = new THREE.Mesh(trnaGeo, trnaMaterial);
    pSiteTrna.position.set(0, 0, 0);
    group.add(pSiteTrna);
    
    // E-Site tRNA
    const eSiteTrna = new THREE.Mesh(trnaGeo, trnaMaterial);
    eSiteTrna.position.set(-1.5, 0, 0);
    group.add(eSiteTrna);

    parts.push({
        name: "tRNA Complex (A, P, E Sites)",
        description: "Transfers specific amino acids to the growing polypeptide chain.",
        material: "trnaMaterial",
        function: "Amino Acid Delivery",
        assemblyOrder: 4,
        connections: ["Large Subunit", "mRNA"],
        failureEffect: "Wrong amino acid added.",
        cascadeFailures: ["Non-functional Protein"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 5. Emerging Polypeptide Chain
    const aminoAcids = new THREE.Group();
    const polypeptideMeshes = [];
    for(let i=0; i<10; i++) {
        const aaGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const aa = new THREE.Mesh(aaGeo, aminoAcidMaterial);
        aa.position.set(0, 2 + i * 0.8, 0);
        
        // Connectors
        if (i > 0) {
            const connGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
            const conn = new THREE.Mesh(connGeo, new THREE.MeshBasicMaterial({color: 0xffffff}));
            conn.position.set(0, 2 + i * 0.8 - 0.4, 0);
            aminoAcids.add(conn);
        }
        
        aminoAcids.add(aa);
        polypeptideMeshes.push(aa);
    }
    group.add(aminoAcids);

    parts.push({
        name: "Polypeptide Chain",
        description: "The newly synthesized protein emerging from the exit tunnel.",
        material: "aminoAcidMaterial",
        function: "Final Product",
        assemblyOrder: 5,
        connections: ["Large Subunit"],
        failureEffect: "Premature termination.",
        cascadeFailures: ["Cellular malfunction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    const description = "A high-tech biomechanical simulation of a Ribosome translating mRNA into a polypeptide chain. Features the large and small subunits, glowing mRNA tape, tRNAs in the A/P/E sites, and the extruding amino acid chain.";

    const quizQuestions = [
        {
            question: "Which ribosomal subunit is primarily responsible for binding the mRNA transcript?",
            options: ["The Large Subunit", "The Small Subunit", "tRNA", "Polypeptide Exit Tunnel"],
            correct: 1,
            explanation: "The small subunit (40S in eukaryotes) binds to the mRNA first and helps locate the start codon.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the tRNA at the 'A' site?",
            options: ["It holds the growing polypeptide chain", "It exits the ribosome", "It accepts the incoming aminoacyl-tRNA", "It binds directly to DNA"],
            correct: 2,
            explanation: "The A (Aminoacyl) site binds the incoming tRNA that carries the next amino acid to be added to the chain.",
            difficulty: "Hard"
        },
        {
            question: "What type of bond is formed between the amino acids in the ribosome?",
            options: ["Hydrogen bond", "Ionic bond", "Peptide bond", "Phosphodiester bond"],
            correct: 2,
            explanation: "The large ribosomal subunit catalyzes the formation of peptide bonds between amino acids.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate whole complex slowly
        group.rotation.y = time * 0.1 * speed;
        
        // Wobble subunits
        smallSubunit.position.y = -2 + Math.sin(time * 2 * speed) * 0.1;
        largeSubunit.position.y = 0 + Math.cos(time * 2 * speed) * 0.1;

        // Slide mRNA to simulate reading
        mrnaMesh.position.x = -((time * speed) % 5);

        // Bob tRNAs
        aSiteTrna.position.y = Math.sin(time * 3 * speed) * 0.2;
        pSiteTrna.position.y = Math.sin(time * 3 * speed + 1) * 0.2;
        eSiteTrna.position.y = Math.sin(time * 3 * speed + 2) * 0.2;

        // Wiggle the polypeptide chain
        polypeptideMeshes.forEach((aa, index) => {
            aa.position.x = Math.sin(time * 2 * speed + index) * 0.3;
            aa.position.z = Math.cos(time * 2 * speed + index) * 0.3;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRibosomeTranslator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
