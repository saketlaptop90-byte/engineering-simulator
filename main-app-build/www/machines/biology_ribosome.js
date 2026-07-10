import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const glowingPink = new THREE.MeshStandardMaterial({
        color: 0xff0088,
        emissive: 0xff0088,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowingCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9
    });

    // 1. Large Subunit (50S in bacteria, 60S in eukaryotes - we'll make a generic cool model)
    const largeSubunitGeo = new THREE.IcosahedronGeometry(3, 2);
    largeSubunitGeo.scale(1, 0.8, 1);
    const largeSubunit = new THREE.Mesh(largeSubunitGeo, glowingBlue);
    largeSubunit.position.set(0, 1.5, 0);
    group.add(largeSubunit);
    meshes.largeSubunit = largeSubunit;

    parts.push({
        name: "Large Subunit",
        description: "The top half of the ribosome, acts as the primary site of amino acid assembly.",
        material: "glowingBlue",
        function: "Catalyzes peptide bond formation and provides the A, P, and E binding sites.",
        assemblyOrder: 2,
        connections: ["Small Subunit", "tRNA", "Growing Polypeptide"],
        failureEffect: "Inability to form peptide bonds, halting protein synthesis.",
        cascadeFailures: ["Polypeptide chain termination", "Cell death"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Small Subunit (30S/40S)
    const smallSubunitGeo = new THREE.CapsuleGeometry(1.5, 4, 16, 32);
    smallSubunitGeo.rotateZ(Math.PI / 2);
    const smallSubunit = new THREE.Mesh(smallSubunitGeo, glowingPink);
    smallSubunit.position.set(0, -2, 0);
    group.add(smallSubunit);
    meshes.smallSubunit = smallSubunit;

    parts.push({
        name: "Small Subunit",
        description: "The bottom half of the ribosome, responsible for mRNA binding and decoding.",
        material: "glowingPink",
        function: "Binds to mRNA and decodes the codon sequence via tRNA matching.",
        assemblyOrder: 1,
        connections: ["Large Subunit", "mRNA"],
        failureEffect: "Failure to initiate translation or incorrect codon recognition.",
        cascadeFailures: ["Mutated proteins", "Frameshift errors"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. mRNA Tape
    const mRNAgeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    mRNAgeo.rotateZ(Math.PI / 2);
    const mRNA = new THREE.Mesh(mRNAgeo, glowingCyan);
    mRNA.position.set(0, -0.5, 0);
    group.add(mRNA);
    meshes.mRNA = mRNA;

    parts.push({
        name: "mRNA Tape",
        description: "Messenger RNA sequence providing the blueprint for the protein.",
        material: "glowingCyan",
        function: "Acts as a template carrying genetic information from DNA.",
        assemblyOrder: 3,
        connections: ["Small Subunit", "tRNA"],
        failureEffect: "Production of incorrect or incomplete proteins.",
        cascadeFailures: ["Loss of cellular function"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -0.5, z: 5 }
    });

    // 4. Growing Polypeptide Chain
    const polypeptideGroup = new THREE.Group();
    meshes.polypeptide = [];
    for (let i = 0; i < 15; i++) {
        const beadGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const bead = new THREE.Mesh(beadGeo, glowingGreen);
        bead.position.set(0, 4 + i * 0.9, 0);
        polypeptideGroup.add(bead);
        meshes.polypeptide.push(bead);
    }
    group.add(polypeptideGroup);
    meshes.polypeptideGroup = polypeptideGroup;

    parts.push({
        name: "Polypeptide Chain",
        description: "The emerging protein chain formed by linked amino acids.",
        material: "glowingGreen",
        function: "Folds into a functional protein after synthesis.",
        assemblyOrder: 4,
        connections: ["Large Subunit", "tRNA"],
        failureEffect: "Premature termination yielding non-functional protein.",
        cascadeFailures: ["Misfolded protein toxicity"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 5. tRNA molecules
    const tRNAgeo = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
    const tRNA_A = new THREE.Mesh(tRNAgeo, plastic);
    tRNA_A.position.set(1.5, 0.5, 0);
    const tRNA_P = new THREE.Mesh(tRNAgeo, plastic);
    tRNA_P.position.set(0, 0.5, 0);
    const tRNA_E = new THREE.Mesh(tRNAgeo, plastic);
    tRNA_E.position.set(-1.5, 0.5, 0);
    
    group.add(tRNA_A);
    group.add(tRNA_P);
    group.add(tRNA_E);
    meshes.tRNAs = [tRNA_A, tRNA_P, tRNA_E];

    parts.push({
        name: "tRNA Array (A, P, E sites)",
        description: "Transfer RNA molecules matching amino acids to mRNA codons.",
        material: "plastic",
        function: "Delivers specific amino acids to the ribosome.",
        assemblyOrder: 5,
        connections: ["mRNA", "Large Subunit", "Polypeptide Chain"],
        failureEffect: "Wrong amino acid incorporated into protein.",
        cascadeFailures: ["Protein dysfunction"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: -5 }
    });

    // Decorative Data Rings around the ribosome
    const ringGeo = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo, chrome);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);
    meshes.ring1 = ring1;

    const ring2 = new THREE.Mesh(ringGeo, chrome);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);
    meshes.ring2 = ring2;

    const description = "The Ribosome is a highly complex molecular machine found within all living cells. It serves as the site of biological protein synthesis (translation), linking amino acids together in the order specified by messenger RNA (mRNA).";

    const quizQuestions = [
        {
            question: "Which subunit is primarily responsible for binding the mRNA tape?",
            options: ["The Large Subunit", "The Small Subunit", "The tRNA", "The Polypeptide Chain"],
            correct: 1,
            explanation: "The Small Subunit binds to the mRNA and is responsible for matching the mRNA codons with the correct tRNA anticodons.",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the glowing green chain in this model?",
            options: ["It carries genetic information", "It supplies energy", "It is the growing polypeptide (protein) chain", "It is the structural backbone"],
            correct: 2,
            explanation: "As the ribosome reads mRNA, it links amino acids to form the growing polypeptide chain, which eventually folds into a protein.",
            difficulty: "Easy"
        },
        {
            question: "What happens at the A, P, and E sites of the ribosome?",
            options: ["DNA is replicated", "mRNA is transcribed", "tRNAs bind, form peptide bonds, and exit", "Lipids are synthesized"],
            correct: 2,
            explanation: "Aminoacyl-tRNA binds at the A site, the peptide bond forms at the P site, and the empty tRNA exits from the E site.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Pulsate subunits
            const scaleOffsetL = Math.sin(time * speed * 2) * 0.05;
            meshes.largeSubunit.scale.set(1 + scaleOffsetL, 0.8 + scaleOffsetL, 1 + scaleOffsetL);
            
            const scaleOffsetS = Math.cos(time * speed * 2) * 0.05;
            meshes.smallSubunit.scale.set(1 + scaleOffsetS, 1 + scaleOffsetS, 1 + scaleOffsetS);

            // Move mRNA like a conveyor belt
            meshes.mRNA.position.x = (Math.sin(time * speed) * 2);

            // Wiggle polypeptide
            meshes.polypeptide.forEach((bead, i) => {
                bead.position.x = Math.sin(time * speed * 5 + i * 0.5) * 0.3;
                bead.position.z = Math.cos(time * speed * 4 + i * 0.5) * 0.3;
            });

            // Bob tRNAs
            meshes.tRNAs.forEach((trna, i) => {
                trna.position.y = 0.5 + Math.sin(time * speed * 3 + i) * 0.2;
                trna.rotation.z = Math.sin(time * speed * 2 + i) * 0.2;
            });

            // Spin data rings
            meshes.ring1.rotation.z += 0.01 * speed;
            meshes.ring2.rotation.z -= 0.015 * speed;
            meshes.ring1.rotation.y = Math.sin(time * speed * 0.5) * 0.2;
            meshes.ring2.rotation.x = Math.PI / 2 + Math.cos(time * speed * 0.5) * 0.2;
        } else {
            // Reset scales
            meshes.largeSubunit.scale.set(1, 0.8, 1);
            meshes.smallSubunit.scale.set(1, 1, 1);
            meshes.mRNA.position.x = 0;
            meshes.polypeptide.forEach((bead) => { bead.position.x = 0; bead.position.z = 0; });
            meshes.tRNAs.forEach((trna) => { trna.rotation.z = 0; });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createRibosome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
