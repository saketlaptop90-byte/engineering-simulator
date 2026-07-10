import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingDNA = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x008888,
        emissiveIntensity: 0.5,
        roughness: 0.2, 
        metalness: 0.8 
    });
    const glowingRNA = new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        emissive: 0x880088,
        emissiveIntensity: 0.8,
        roughness: 0.3, 
        metalness: 0.5 
    });
    const enzymeMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0xaa5500,
        emissiveIntensity: 0.2,
        roughness: 0.7, 
        metalness: 0.2,
        transparent: true,
        opacity: 0.9
    });

    // 1. DNA Strand (Template & Coding)
    const dnaGroup = new THREE.Group();
    meshes.dna = [];
    for (let i = -10; i < 10; i++) {
        const basePair = new THREE.Group();
        
        // Backbone 1
        const bb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), glowingDNA);
        bb1.position.set(0, 1.5, 0);
        bb1.rotation.x = Math.PI / 2;
        basePair.add(bb1);
        
        // Backbone 2
        const bb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), glowingDNA);
        bb2.position.set(0, -1.5, 0);
        bb2.rotation.x = Math.PI / 2;
        basePair.add(bb2);
        
        // Base connection
        const conn = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3), plastic);
        conn.rotation.z = Math.PI / 2;
        basePair.add(conn);

        basePair.position.x = i * 1.2;
        basePair.userData.index = i;
        dnaGroup.add(basePair);
        meshes.dna.push(basePair);
    }
    group.add(dnaGroup);

    parts.push({
        name: "DNA Double Helix",
        description: "The genetic blueprint containing the instructions for life. It unwinds to allow transcription.",
        material: "glowingDNA",
        function: "Template for RNA synthesis",
        assemblyOrder: 1,
        connections: ["RNA Polymerase"],
        failureEffect: "Genetic information cannot be read.",
        cascadeFailures: ["Protein Synthesis Failure", "Cellular Malfunction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. RNA Polymerase
    const polymerase = new THREE.Group();
    
    // Core body
    const polyBody = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), enzymeMat);
    polyBody.scale.set(1.2, 0.8, 1);
    polymerase.add(polyBody);
    
    // Intake channel
    const intake = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.4, 16, 32), enzymeMat);
    intake.position.set(-1, 2, 0);
    intake.rotation.x = Math.PI/2;
    polymerase.add(intake);
    
    // Exit channel
    const exit = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), enzymeMat);
    exit.position.set(1, -2.5, 0);
    polymerase.add(exit);

    polymerase.position.set(0, 0, 0);
    group.add(polymerase);
    meshes.polymerase = polymerase;

    parts.push({
        name: "RNA Polymerase",
        description: "A complex enzyme that reads the DNA template and synthesizes the messenger RNA.",
        material: "enzymeMat",
        function: "Synthesizes mRNA by adding complementary RNA nucleotides",
        assemblyOrder: 2,
        connections: ["DNA Double Helix", "mRNA Strand", "Nucleotides"],
        failureEffect: "Transcription halts.",
        cascadeFailures: ["No mRNA production", "Protein Synthesis Stops"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 3. mRNA Strand
    const mrnaGroup = new THREE.Group();
    meshes.mrna = [];
    for (let i = 0; i < 15; i++) {
        const mrnaUnit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), glowingRNA);
        mrnaUnit.position.set(0, -i * 0.8, 0);
        mrnaGroup.add(mrnaUnit);
        meshes.mrna.push(mrnaUnit);
    }
    mrnaGroup.position.set(1, -2.5, 0);
    group.add(mrnaGroup);

    parts.push({
        name: "Messenger RNA (mRNA)",
        description: "The newly synthesized RNA transcript that carries the genetic code from DNA to ribosomes.",
        material: "glowingRNA",
        function: "Transmits genetic information",
        assemblyOrder: 3,
        connections: ["RNA Polymerase"],
        failureEffect: "Genetic code is lost before reaching ribosomes.",
        cascadeFailures: ["Defective proteins"],
        originalPosition: {x: 1, y: -2.5, z: 0},
        explodedPosition: {x: 5, y: -5, z: 0}
    });

    // 4. Free Nucleotides
    const nucGroup = new THREE.Group();
    meshes.nucleotides = [];
    for (let i = 0; i < 10; i++) {
        const nuc = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), glowingRNA);
        nuc.position.set(Math.random() * 5 + 3, Math.random() * 5 + 2, Math.random() * 5 - 2.5);
        nuc.userData = {
            targetOffset: i,
            speed: Math.random() * 0.05 + 0.02
        };
        nucGroup.add(nuc);
        meshes.nucleotides.push(nuc);
    }
    group.add(nucGroup);

    parts.push({
        name: "Free RNA Nucleotides",
        description: "Building blocks (A, U, G, C) used to construct the mRNA strand.",
        material: "glowingRNA",
        function: "Substrates for RNA Polymerase",
        assemblyOrder: 4,
        connections: ["RNA Polymerase"],
        failureEffect: "RNA synthesis stalls due to starvation.",
        cascadeFailures: ["Incomplete mRNA"],
        originalPosition: {x: 4, y: 4, z: 0},
        explodedPosition: {x: 8, y: 8, z: 0}
    });

    const description = "RNA Transcription is the fundamental biological process where an enzyme, RNA Polymerase, reads the DNA code and produces a complementary messenger RNA (mRNA) strand. This is the crucial first step in gene expression.";

    const quizQuestions = [
        {
            question: "Which enzyme is responsible for synthesizing the mRNA strand during transcription?",
            options: ["DNA Polymerase", "RNA Polymerase", "Helicase", "Ligase"],
            correct: 1,
            explanation: "RNA Polymerase is the main enzyme that reads the DNA template and builds the mRNA strand.",
            difficulty: "easy"
        },
        {
            question: "During transcription, the DNA double helix must be unwound. What happens to the DNA after the RNA Polymerase passes?",
            options: ["It remains permanently unwound", "It is degraded", "It rewinds back into a double helix", "It is converted into RNA"],
            correct: 2,
            explanation: "As RNA Polymerase moves along, the DNA behind it re-forms its double helix structure (rewinds).",
            difficulty: "medium"
        },
        {
            question: "In the newly synthesized mRNA strand, which nitrogenous base replaces Thymine (T) found in DNA?",
            options: ["Adenine (A)", "Guanine (G)", "Cytosine (C)", "Uracil (U)"],
            correct: 3,
            explanation: "In RNA, Uracil pairs with Adenine instead of Thymine.",
            difficulty: "easy"
        }
    ];

    const animateFn = (time, speed) => {
        const adjustedTime = time * speed;
        
        const dnaOffset = (adjustedTime * 2) % 24 - 12; 
        
        meshes.dna.forEach(basePair => {
            const index = basePair.userData.index;
            const pos = index * 1.2 - dnaOffset;
            
            basePair.position.x = pos;
            
            if (pos > -2 && pos < 2) {
                basePair.rotation.x = THREE.MathUtils.lerp(basePair.rotation.x, 0, 0.1);
                basePair.position.z = THREE.MathUtils.lerp(basePair.position.z, 0, 0.1);
            } else {
                const twist = pos * 0.5;
                basePair.rotation.x = twist;
                basePair.position.z = Math.sin(twist) * 0.2;
            }
        });

        const rnaLength = ((adjustedTime * 2) % 15) + 1;
        meshes.mrna.forEach((unit, idx) => {
            if (idx < rnaLength) {
                unit.visible = true;
                unit.position.x = Math.sin(adjustedTime * 3 + idx) * 0.2;
                unit.position.z = Math.cos(adjustedTime * 3 + idx) * 0.2;
            } else {
                unit.visible = false;
            }
        });

        meshes.nucleotides.forEach((nuc) => {
            nuc.position.x -= Math.sin(adjustedTime * nuc.userData.speed) * 0.1;
            nuc.position.y -= nuc.userData.speed;
            
            if (nuc.position.y < 2 && nuc.position.x < 1 && nuc.position.x > -1) {
                nuc.position.set(Math.random() * 5 + 3, Math.random() * 5 + 2, Math.random() * 5 - 2.5);
            }
            nuc.rotation.x += 0.05;
            nuc.rotation.y += 0.05;
        });

        meshes.polymerase.scale.set(
            1.2 + Math.sin(adjustedTime * 5) * 0.05,
            0.8 + Math.cos(adjustedTime * 5) * 0.05,
            1 + Math.sin(adjustedTime * 5) * 0.05
        );
    };

    return { group, parts, description, quizQuestions, animate: animateFn };
}

// Auto-generated missing stub
export function createRNATranscription() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
