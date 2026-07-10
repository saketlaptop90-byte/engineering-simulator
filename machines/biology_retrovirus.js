import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech/biological glowing materials
    const envelopeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 0.5,
        emissive: 0x220044,
        emissiveIntensity: 0.5,
        clearcoat: 1.0,
    });

    const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x550011,
        emissiveIntensity: 0.8,
    });

    const capsidMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        metalness: 0.5,
        roughness: 0.4,
        wireframe: true,
        emissive: 0x004422,
    });

    const rnaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        metalness: 0.1,
        roughness: 0.1,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
    });

    const rtMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.9,
        roughness: 0.3,
        emissive: 0x442200,
    });

    const integraseMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x330033,
    });
    
    // Envelope
    const envelopeGeom = new THREE.SphereGeometry(3, 32, 32);
    const envelope = new THREE.Mesh(envelopeGeom, envelopeMaterial);
    envelope.name = "Viral Envelope";
    group.add(envelope);
    parts.push({
        name: "Viral Envelope",
        description: "Lipid bilayer membrane derived from the host cell, protecting the viral core.",
        material: "Bio-Lipid Membrane",
        function: "Protects the viral genome and carries glycoproteins for cell entry.",
        assemblyOrder: 5,
        connections: ["Glycoprotein Spikes", "Capsid"],
        failureEffect: "Virus loses ability to fuse with host cell membranes.",
        cascadeFailures: ["Infection Cycle Halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // Spikes (Glycoproteins)
    const spikeGeom = new THREE.ConeGeometry(0.2, 1, 8);
    const spikesGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const spike = new THREE.Mesh(spikeGeom, spikeMaterial);
        const phi = Math.acos(-1 + (2 * i) / 40);
        const theta = Math.sqrt(40 * Math.PI) * phi;
        
        spike.position.setFromSphericalCoords(3.2, phi, theta);
        spike.lookAt(0, 0, 0);
        spike.rotateX(-Math.PI / 2);
        spikesGroup.add(spike);
    }
    spikesGroup.name = "Glycoprotein Spikes";
    group.add(spikesGroup);
    parts.push({
        name: "Glycoprotein Spikes",
        description: "Surface proteins (e.g., gp120/gp41 in HIV) that bind to host cell receptors.",
        material: "Protein Complex",
        function: "Identify and attach to specific receptors on target host cells.",
        assemblyOrder: 6,
        connections: ["Viral Envelope"],
        failureEffect: "Inability to bind to host cells.",
        cascadeFailures: ["Viral Entry Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 5 }
    });

    // Capsid
    const capsidGeom = new THREE.IcosahedronGeometry(1.5, 1);
    const capsid = new THREE.Mesh(capsidGeom, capsidMaterial);
    capsid.name = "Viral Capsid";
    group.add(capsid);
    parts.push({
        name: "Viral Capsid",
        description: "Protein shell enclosing the viral RNA and enzymes.",
        material: "Viral Protein Core",
        function: "Protects RNA and delivers it into the host cell cytoplasm.",
        assemblyOrder: 3,
        connections: ["Viral Envelope", "RNA Genome", "Reverse Transcriptase"],
        failureEffect: "Premature degradation of viral RNA.",
        cascadeFailures: ["Replication Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: -2, z: 0 }
    });

    // RNA Genomes (two strands)
    const rnaGeom = new THREE.TorusKnotGeometry(0.5, 0.05, 64, 8, 2, 3);
    const rna1 = new THREE.Mesh(rnaGeom, rnaMaterial);
    rna1.position.x = -0.3;
    rna1.name = "RNA Strand 1";
    
    const rna2 = new THREE.Mesh(rnaGeom, rnaMaterial);
    rna2.position.x = 0.3;
    rna2.rotation.y = Math.PI;
    rna2.name = "RNA Strand 2";
    
    group.add(rna1);
    group.add(rna2);
    
    parts.push({
        name: "RNA Genomes",
        description: "Two identical single-stranded positive-sense RNA molecules.",
        material: "Nucleic Acid",
        function: "Carries the genetic blueprint of the virus.",
        assemblyOrder: 1,
        connections: ["Capsid", "Reverse Transcriptase"],
        failureEffect: "Loss of genetic information.",
        cascadeFailures: ["Viral Replication Halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -5 }
    });

    // Reverse Transcriptase
    const rtGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const rt1 = new THREE.Mesh(rtGeom, rtMaterial);
    rt1.position.set(-0.5, 0.5, 0);
    rt1.name = "Reverse Transcriptase 1";
    
    const rt2 = new THREE.Mesh(rtGeom, rtMaterial);
    rt2.position.set(0.5, -0.5, 0);
    rt2.name = "Reverse Transcriptase 2";
    
    group.add(rt1);
    group.add(rt2);
    
    parts.push({
        name: "Reverse Transcriptase",
        description: "Enzyme that converts viral RNA into DNA.",
        material: "Enzyme Complex",
        function: "Transcribes single-stranded RNA into double-stranded DNA.",
        assemblyOrder: 2,
        connections: ["RNA Genomes"],
        failureEffect: "Inability to synthesize DNA from RNA.",
        cascadeFailures: ["Integration Failure", "Replication Halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 4, z: -4 }
    });
    
    // Integrase
    const integraseGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const int1 = new THREE.Mesh(integraseGeom, integraseMaterial);
    int1.position.set(0, 0.8, 0);
    int1.name = "Integrase Enzyme";
    group.add(int1);
    
    parts.push({
        name: "Integrase Enzyme",
        description: "Enzyme responsible for integrating viral DNA into host genome.",
        material: "Enzyme Complex",
        function: "Splices viral DNA into the host cell's DNA.",
        assemblyOrder: 4,
        connections: ["Capsid"],
        failureEffect: "Viral DNA cannot enter host genome.",
        cascadeFailures: ["Provirus Formation Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: -4, z: 4 }
    });

    const description = "A detailed interactive 3D model of a Retrovirus. Retroviruses are unique in their use of Reverse Transcriptase to convert their RNA genome into DNA, which is then integrated into the host cell's genome via Integrase, forming a provirus.";

    const quizQuestions = [
        {
            question: "What is the primary function of Reverse Transcriptase in a retrovirus?",
            options: [
                "To transcribe host DNA into RNA",
                "To translate viral RNA into proteins",
                "To transcribe viral RNA into DNA",
                "To break down the host cell wall"
            ],
            correct: 2,
            explanation: "Reverse transcriptase performs reverse transcription: creating a double-stranded DNA copy from the viral single-stranded RNA genome.",
            difficulty: "Medium"
        },
        {
            question: "Which component allows the retrovirus to specifically bind to a host cell?",
            options: [
                "Viral Capsid",
                "Glycoprotein Spikes",
                "Integrase",
                "Lipid Envelope"
            ],
            correct: 1,
            explanation: "Glycoprotein spikes on the viral envelope recognize and bind to specific receptor molecules on the surface of target host cells.",
            difficulty: "Easy"
        },
        {
            question: "What is the role of the Integrase enzyme?",
            options: [
                "It synthesizes viral RNA.",
                "It degrades host DNA.",
                "It inserts the newly synthesized viral DNA into the host cell's genome.",
                "It aids in the assembly of the viral capsid."
            ],
            correct: 2,
            explanation: "Once reverse transcription is complete, integrase transports the viral DNA into the host nucleus and splices it into the host's genomic DNA.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Envelop pulsation
        const envelope = meshes.find(m => m.name === "Viral Envelope");
        if (envelope) {
            const scale = 1 + Math.sin(time * speed * 2) * 0.02;
            envelope.scale.set(scale, scale, scale);
            envelope.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 3) * 0.2;
        }

        // Rotate spikes group
        const spikes = meshes.find(m => m.name === "Glycoprotein Spikes");
        if (spikes) {
            spikes.rotation.x = time * speed * 0.1;
            spikes.rotation.y = time * speed * 0.15;
        }

        // Capsid rotation
        const capsid = meshes.find(m => m.name === "Viral Capsid");
        if (capsid) {
            capsid.rotation.x = time * speed * 0.5;
            capsid.rotation.y = time * speed * 0.3;
        }

        // RNA undulating and rotating
        const rna1 = meshes.find(m => m.name === "RNA Strand 1");
        const rna2 = meshes.find(m => m.name === "RNA Strand 2");
        if (rna1) {
            rna1.rotation.x = time * speed;
            rna1.rotation.y = time * speed * 1.2;
            rna1.material.emissiveIntensity = 1 + Math.sin(time * speed * 5) * 0.8;
        }
        if (rna2) {
            rna2.rotation.x = -time * speed;
            rna2.rotation.y = -time * speed * 1.2;
            rna2.material.emissiveIntensity = 1 + Math.cos(time * speed * 5) * 0.8;
        }

        // Enzymes floating
        const rt1 = meshes.find(m => m.name === "Reverse Transcriptase 1");
        const rt2 = meshes.find(m => m.name === "Reverse Transcriptase 2");
        if (rt1) {
            rt1.position.y = 0.5 + Math.sin(time * speed * 2) * 0.1;
            rt1.rotation.x = time * speed * 2;
        }
        if (rt2) {
            rt2.position.y = -0.5 + Math.cos(time * speed * 2) * 0.1;
            rt2.rotation.z = time * speed * 2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRetrovirusIntegration() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
