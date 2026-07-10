import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const glowBlue = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glowGreen = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const glowOrange = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 1.2
    });

    const enzymeBodyMat = new THREE.MeshPhysicalMaterial({
        color: 0x334455,
        roughness: 0.4,
        metalness: 0.7,
        clearcoat: 0.5
    });
    
    // 1. Core Polymerase Unit (The Hand: Palm, Fingers, Thumb)
    const coreGeom = new THREE.TorusKnotGeometry(2, 0.8, 128, 32);
    const coreMesh = new THREE.Mesh(coreGeom, enzymeBodyMat);
    coreMesh.scale.set(1.5, 1, 1.2);
    group.add(coreMesh);
    parts.push({
        name: "Polymerase Core (Palm & Fingers)",
        description: "The main catalytic site where nucleotides are added to the growing DNA strand.",
        material: "Enzyme Body Material",
        function: "Catalyzes the formation of phosphodiester bonds between nucleotides.",
        assemblyOrder: 1,
        connections: ["DNA Template", "Sliding Clamp"],
        failureEffect: "DNA replication halts entirely.",
        cascadeFailures: ["Cell division arrest", "Cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: -2 }
    });

    // 2. Sliding Clamp (Ring structure)
    const clampGeom = new THREE.TorusGeometry(1.5, 0.4, 32, 64);
    const clampMesh = new THREE.Mesh(clampGeom, chrome);
    clampMesh.rotation.y = Math.PI / 2;
    clampMesh.position.set(-3, 0, 0);
    group.add(clampMesh);
    parts.push({
        name: "Sliding Clamp (PCNA)",
        description: "A ring-shaped protein that encircles the DNA and tethers the polymerase to the template.",
        material: "Chrome",
        function: "Dramatically increases polymerase processivity by preventing it from dissociating from DNA.",
        assemblyOrder: 2,
        connections: ["Polymerase Core", "Clamp Loader"],
        failureEffect: "Polymerase frequently falls off, drastically slowing replication.",
        cascadeFailures: ["Incomplete replication", "DNA damage response activation"],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 5 }
    });

    // 3. DNA Template Strand (Incoming)
    const dnaTemplateGeom = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const dnaTemplateMesh = new THREE.Mesh(dnaTemplateGeom, glowBlue);
    dnaTemplateMesh.rotation.z = Math.PI / 2;
    dnaTemplateMesh.position.set(-5, 0, 0);
    group.add(dnaTemplateMesh);
    parts.push({
        name: "Template DNA Strand",
        description: "The single-stranded DNA serving as a template for synthesis.",
        material: "Glowing Blue Matrix",
        function: "Provides the sequence information via base pairing.",
        assemblyOrder: 3,
        connections: ["Polymerase Core", "Helicase"],
        failureEffect: "No sequence template.",
        cascadeFailures: ["Replication failure"],
        originalPosition: { x: -5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 5, z: 0 }
    });

    // 4. Newly Synthesized DNA Strand (Outgoing Double Helix mock)
    const newDnaGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const newDnaMesh = new THREE.Mesh(newDnaGeom, glowGreen);
    newDnaMesh.rotation.z = Math.PI / 2;
    newDnaMesh.position.set(3, 0, 0);
    group.add(newDnaMesh);
    parts.push({
        name: "Synthesized Double-Stranded DNA",
        description: "The resulting double helix exiting the polymerase.",
        material: "Glowing Green Matrix",
        function: "The finished product of replication.",
        assemblyOrder: 4,
        connections: ["Polymerase Core"],
        failureEffect: "Genetic information not duplicated.",
        cascadeFailures: ["Daughter cell lacks genome"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 10, y: -5, z: 0 }
    });

    // 5. Incoming Nucleotides (Energy orbs)
    const dNTPGroup = new THREE.Group();
    const dNTPGeom = new THREE.SphereGeometry(0.3, 16, 16);
    for (let i = 0; i < 5; i++) {
        const dNTPMesh = new THREE.Mesh(dNTPGeom, glowOrange);
        dNTPMesh.position.set(2 + Math.random() * 3, 2 + Math.random() * 3, -2 + Math.random() * 4);
        dNTPGroup.add(dNTPMesh);
    }
    group.add(dNTPGroup);
    parts.push({
        name: "Incoming dNTPs (Nucleotides)",
        description: "Deoxynucleotide triphosphates floating into the active site.",
        material: "Glowing Orange Energy",
        function: "Building blocks of the new DNA strand, providing energy via pyrophosphate cleavage.",
        assemblyOrder: 5,
        connections: ["Polymerase Core"],
        failureEffect: "Synthesis stops due to lack of building blocks.",
        cascadeFailures: ["Replication fork stall"],
        originalPosition: { x: 2, y: 2, z: 0 },
        explodedPosition: { x: 5, y: 8, z: 5 }
    });

    // 6. Exonuclease Domain (Proofreading)
    const exoGeom = new THREE.DodecahedronGeometry(0.8);
    const exoMesh = new THREE.Mesh(exoGeom, darkSteel);
    exoMesh.position.set(0, -2, 1);
    group.add(exoMesh);
    parts.push({
        name: "3' to 5' Exonuclease Domain",
        description: "The proofreading center of the polymerase.",
        material: "Dark Steel",
        function: "Detects mismatched bases and removes them, ensuring high replication fidelity.",
        assemblyOrder: 6,
        connections: ["Polymerase Core", "Synthesized DNA"],
        failureEffect: "Mutation rate increases exponentially.",
        cascadeFailures: ["Cancer", "Cellular senescence", "Apoptosis"],
        originalPosition: { x: 0, y: -2, z: 1 },
        explodedPosition: { x: 0, y: -6, z: 4 }
    });

    const description = "DNA Polymerase is a highly complex, ultra-precise molecular machine responsible for synthesizing new DNA strands. It functions somewhat like a specialized 3D printer for genetic code. The core enzyme resembles a right hand gripping the DNA, while a sliding clamp ensures it stays attached for thousands of base pairs. An integrated proofreading domain acts as quality control, removing mismatched nucleotides in real-time. This dynamic simulation visualizes the incoming dNTPs and the transformation of single-stranded template into a double helix.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Sliding Clamp (PCNA)?",
            options: [
                "To proofread the newly synthesized DNA",
                "To unwind the DNA double helix",
                "To increase the processivity of the polymerase by keeping it attached to the DNA",
                "To provide energy for the reaction"
            ],
            correct: 2,
            explanation: "The sliding clamp forms a ring around the DNA and binds to the polymerase, preventing it from frequently dissociating and thereby increasing the speed and processivity of replication.",
            difficulty: "Medium"
        },
        {
            question: "Which domain of the DNA Polymerase is responsible for error correction (proofreading)?",
            options: [
                "The Palm domain",
                "The 3' to 5' Exonuclease domain",
                "The Thumb domain",
                "The Clamp Loader"
            ],
            correct: 1,
            explanation: "The 3' to 5' Exonuclease domain can 'back up' and remove an incorrectly added nucleotide before synthesis continues, dramatically lowering the mutation rate.",
            difficulty: "Hard"
        },
        {
            question: "What acts as the building blocks for the new DNA strand during replication?",
            options: [
                "Amino acids",
                "RNA primers",
                "Deoxynucleotide triphosphates (dNTPs)",
                "ATP molecules"
            ],
            correct: 2,
            explanation: "dNTPs (dATP, dTTP, dCTP, dGTP) provide both the nucleotide base for the new strand and the energy (via cleavage of two phosphate groups) to form the phosphodiester bond.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the core complex slowly
        meshes[0].rotation.x = Math.sin(time * speed * 0.5) * 0.2;
        meshes[0].rotation.y = Math.cos(time * speed * 0.3) * 0.1;

        // Spin the sliding clamp
        meshes[1].rotation.x = time * speed * 2;

        // Pulse the glowing DNA strands
        const pulse = (Math.sin(time * speed * 4) + 1) / 2;
        meshes[2].material.emissiveIntensity = 1.0 + pulse;
        meshes[3].material.emissiveIntensity = 1.0 + pulse * 1.5;

        // Move the newly synthesized strand slightly to simulate progression
        meshes[3].position.x = 3 + Math.sin(time * speed * 2) * 0.2;

        // Animate incoming dNTPs swirling into the active site
        const dNTPs = meshes[4].children;
        dNTPs.forEach((dntp, i) => {
            const offset = i * (Math.PI * 2 / 5);
            dntp.position.x = Math.cos(time * speed * 3 + offset) * 2;
            dntp.position.y = Math.sin(time * speed * 3 + offset) * 2;
            dntp.position.z = Math.sin(time * speed * 2 + offset) * 2;
            
            // Periodically suck them into the center (0,0,0)
            const phase = (time * speed + i) % 2;
            if (phase < 0.5) {
                dntp.position.lerp(new THREE.Vector3(0,0,0), phase * 2);
            }
        });
        
        // Exonuclease domain slight "checking" vibration
        meshes[5].position.x = Math.sin(time * speed * 10) * 0.05;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDNAPolymerase() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
