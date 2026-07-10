import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = {
        title: "Golgi Apparatus",
        subtitle: "Cellular Shipping Center",
        overview: "The Golgi apparatus is a major organelle in most eukaryotic cells. It is part of the endomembrane system in the cytoplasm and packages proteins into membrane-bound vesicles inside the cell before the vesicles are sent to their destination.",
        systems: [
            {
                name: "Cis Face",
                description: "The receiving side of the Golgi apparatus, where vesicles from the Endoplasmic Reticulum (ER) arrive and fuse."
            },
            {
                name: "Medial Cisternae",
                description: "The central layers where proteins and lipids are modified through glycosylation and other biochemical reactions."
            },
            {
                name: "Trans Face",
                description: "The shipping side where modified molecules are sorted, packaged into transport vesicles, and dispatched."
            }
        ]
    };

    // Custom Materials
    const cisternaMat = plastic.clone();
    cisternaMat.color = new THREE.Color(0x3498db);
    cisternaMat.transparent = true;
    cisternaMat.opacity = 0.85;
    cisternaMat.emissive = new THREE.Color(0x113355);

    const activeCisternaMat = cisternaMat.clone();
    activeCisternaMat.color = new THREE.Color(0x9b59b6);
    activeCisternaMat.emissive = new THREE.Color(0x441155);

    const glowingProteinMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.8
    });

    const vesicleMat = new THREE.MeshPhysicalMaterial({
        color: 0x2ecc71,
        emissive: 0x115522,
        transparent: true,
        opacity: 0.6,
        transmission: 0.5,
        roughness: 0.1,
        metalness: 0.1
    });

    const meshes = {};

    // Build the Golgi Cisternae
    const numCisternae = 5;
    meshes.cisternae = [];
    
    for (let i = 0; i < numCisternae; i++) {
        const radius = 5 + Math.sin(i * Math.PI / numCisternae) * 2;
        const tube = 1.2 - (i * 0.1);
        const geometry = new THREE.TorusGeometry(radius, tube, 32, 100, Math.PI * 1.5);
        
        const mat = i === Math.floor(numCisternae/2) ? activeCisternaMat : cisternaMat;
        const mesh = new THREE.Mesh(geometry, mat);
        
        // Flatten the torus slightly to look like a flattened sac
        mesh.scale.set(1, 0.3, 1);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI / 4;
        
        const yPos = (i - numCisternae/2) * 1.5;
        mesh.position.set(0, yPos, 0);
        
        group.add(mesh);
        meshes.cisternae.push(mesh);

        let cName = i === 0 ? "Cis Face" : (i === numCisternae - 1 ? "Trans Face" : `Medial Cisterna ${i}`);
        
        parts.push({
            name: cName,
            description: `A flattened membrane sac (cisterna) of the Golgi. Layer ${i+1}.`,
            material: "Membrane Lipid Bilayer",
            function: i === 0 ? "Receives transport vesicles from the rough ER." : (i === numCisternae - 1 ? "Sorts and packages modified proteins into secretory vesicles." : "Modifies proteins and lipids via specific enzymes."),
            assemblyOrder: i + 1,
            connections: i === 0 ? ["ER Transport Vesicles", `Medial Cisterna ${i+1}`] : (i === numCisternae - 1 ? [`Medial Cisterna ${i-1}`, "Secretory Vesicles"] : [`Medial Cisterna ${i-1}`, `Medial Cisterna ${i+1}`]),
            failureEffect: "Proteins fail to be properly targeted or modified.",
            cascadeFailures: ["Vesicle accumulation", "Cellular secretion failure"],
            originalPosition: { x: 0, y: yPos, z: 0 },
            explodedPosition: { x: 0, y: yPos * 3, z: 0 }
        });
    }

    // Transport Vesicles (Incoming)
    meshes.incomingVesicles = [];
    for (let i = 0; i < 6; i++) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), vesicleMat);
        group.add(mesh);
        meshes.incomingVesicles.push({
            mesh: mesh,
            angle: Math.random() * Math.PI * 2,
            radius: 8 + Math.random() * 2,
            height: -5 - Math.random() * 3, // Below cis face
            speed: 0.5 + Math.random() * 0.5
        });
    }
    
    parts.push({
        name: "Incoming Transport Vesicles",
        description: "Small membrane-bound sacs containing newly synthesized proteins.",
        material: "Membrane and Proteins",
        function: "Transports raw materials from the ER to the cis-Golgi.",
        assemblyOrder: numCisternae + 1,
        connections: ["ER", "Cis Face"],
        failureEffect: "Loss of input material for the Golgi.",
        cascadeFailures: ["Empty Golgi", "Protein degradation in ER"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // Secretory Vesicles (Outgoing)
    meshes.outgoingVesicles = [];
    for (let i = 0; i < 8; i++) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), vesicleMat);
        
        // Add glowing protein inside
        const protein = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2), glowingProteinMat);
        mesh.add(protein);
        
        group.add(mesh);
        meshes.outgoingVesicles.push({
            mesh: mesh,
            angle: Math.random() * Math.PI * 2,
            radius: 7 + Math.random() * 3,
            height: 4 + Math.random() * 4, // Above trans face
            speed: 0.3 + Math.random() * 0.4
        });
    }
    
    parts.push({
        name: "Secretory Vesicles",
        description: "Vesicles budding from the trans-Golgi containing fully processed and tagged proteins.",
        material: "Membrane and Modified Proteins",
        function: "Deliver finished proteins to the cell membrane or other organelles.",
        assemblyOrder: numCisternae + 2,
        connections: ["Trans Face", "Plasma Membrane"],
        failureEffect: "Proteins do not reach their destination.",
        cascadeFailures: ["Cell signaling failure", "Membrane starvation"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // Protein Flow Particles (Internal)
    meshes.internalProteins = [];
    const flowGeom = new THREE.SphereGeometry(0.15, 16, 16);
    for (let i = 0; i < 30; i++) {
        const mesh = new THREE.Mesh(flowGeom, glowingProteinMat);
        group.add(mesh);
        meshes.internalProteins.push({
            mesh: mesh,
            progress: Math.random(), // 0 to 1 through the cisternae
            angleOffset: Math.random() * Math.PI * 2,
            speed: 0.1 + Math.random() * 0.1
        });
    }

    const quizQuestions = [
        {
            question: "Which face of the Golgi apparatus receives vesicles from the Endoplasmic Reticulum?",
            options: ["Trans face", "Medial face", "Cis face", "Lateral face"],
            correct: 2,
            explanation: "The cis face is the receiving side of the Golgi apparatus, typically located near the ER.",
            difficulty: "easy"
        },
        {
            question: "What happens to proteins as they pass through the medial cisternae?",
            options: ["They are synthesized.", "They are degraded.", "They are modified (e.g., glycosylation).", "They are translated from mRNA."],
            correct: 2,
            explanation: "Enzymes in the medial cisternae modify proteins and lipids, such as by adding or altering sugar chains (glycosylation).",
            difficulty: "medium"
        },
        {
            question: "Where do secretory vesicles primarily bud off from?",
            options: ["The cis face", "The trans face", "The nuclear envelope", "The mitochondria"],
            correct: 1,
            explanation: "The trans face is the shipping side of the Golgi, where vesicles bud off to carry modified materials to their destinations.",
            difficulty: "easy"
        },
        {
            question: "What would most likely happen if the Golgi apparatus ceased to function?",
            options: ["The cell would stop producing ATP.", "The cell membrane would lose its selective permeability immediately.", "Proteins would not be properly sorted or secreted.", "DNA replication would halt."],
            correct: 2,
            explanation: "The Golgi is essential for sorting, modifying, and packaging proteins. Without it, proteins would not reach their proper cellular destinations.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, sceneMeshes) {
        // Pulsate cisternae
        meshes.cisternae.forEach((cisterna, idx) => {
            const phase = time * 2 * speed + idx;
            const scaleBase = 1.0;
            const scaleVariation = 0.05 * Math.sin(phase);
            cisterna.scale.set(
                scaleBase + scaleVariation, 
                0.3 + scaleVariation * 0.5, 
                scaleBase + scaleVariation
            );
            
            if (cisterna.material.emissive) {
                cisterna.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(phase * 2);
            }
        });

        // Move incoming vesicles (moving up towards cis face)
        meshes.incomingVesicles.forEach(v => {
            v.height += v.speed * speed * 0.05;
            v.angle += v.speed * speed * 0.02;
            
            // Reset if they reach cis face
            if (v.height > -2) {
                v.height = -6 - Math.random() * 2;
                v.angle = Math.random() * Math.PI * 2;
                v.radius = 6 + Math.random() * 3;
            }
            
            v.mesh.position.set(
                Math.cos(v.angle) * v.radius,
                v.height,
                Math.sin(v.angle) * v.radius
            );
        });

        // Move outgoing vesicles (moving up and out from trans face)
        meshes.outgoingVesicles.forEach(v => {
            v.height += v.speed * speed * 0.05;
            v.radius += v.speed * speed * 0.02;
            v.angle += v.speed * speed * 0.01;
            
            // Reset if they go too far
            if (v.height > 10 || v.radius > 12) {
                v.height = 3 + Math.random() * 2;
                v.radius = 5 + Math.random() * 2;
                v.angle = Math.random() * Math.PI * 2;
            }
            
            v.mesh.position.set(
                Math.cos(v.angle) * v.radius,
                v.height,
                Math.sin(v.angle) * v.radius
            );
            
            // Rotate the vesicle and inner protein
            v.mesh.rotation.y += 0.05 * speed;
            v.mesh.rotation.x += 0.03 * speed;
            if(v.mesh.children[0]) {
               v.mesh.children[0].rotation.y -= 0.1 * speed; 
            }
        });

        // Move internal proteins through cisternae
        meshes.internalProteins.forEach(p => {
            p.progress += p.speed * speed * 0.01;
            if (p.progress > 1) {
                p.progress = 0;
            }
            
            p.angleOffset += 0.02 * speed;
            
            // Map progress to y-position (-3 to 3 approx)
            const y = -3 + (p.progress * 6);
            
            // Radius follows a slight bulge in the middle
            const rBase = 5;
            const rVariation = Math.sin(p.progress * Math.PI) * 2;
            const r = rBase + rVariation;
            
            p.mesh.position.set(
                Math.cos(p.angleOffset) * r,
                y,
                Math.sin(p.angleOffset) * r
            );
            
            // Pulse glow intensity
            p.mesh.material.emissiveIntensity = 1 + 2 * Math.sin(time * 5 + p.angleOffset);
        });
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
export function createGolgiApparatus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
