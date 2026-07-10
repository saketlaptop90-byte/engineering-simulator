import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const roughERMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8a2be2, // Purple hue
        metalness: 0.2,
        roughness: 0.8,
        clearcoat: 0.1,
        transmission: 0.3,
        thickness: 0.5,
        side: THREE.DoubleSide
    });

    const smoothERMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4169e1, // Royal blue
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.5,
        transmission: 0.5,
        thickness: 0.5,
        side: THREE.DoubleSide
    });

    const ribosomeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500, // Orange red
        emissive: 0xff4500,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const vesicleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff7f, // Spring green
        emissive: 0x00fa9a,
        emissiveIntensity: 0.5,
        transmission: 0.8,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1
    });

    // 1. Nucleus Envelope connection (Base)
    const envelopeGeo = new THREE.SphereGeometry(4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const envelopeMesh = new THREE.Mesh(envelopeGeo, chrome);
    envelopeMesh.position.set(0, -2, 0);
    envelopeMesh.rotation.x = Math.PI;
    group.add(envelopeMesh);
    parts.push({
        name: "Nuclear Envelope Connection",
        description: "The membrane connecting the ER directly to the cell nucleus, allowing mRNA to pass through.",
        material: "chrome",
        function: "mRNA Transfer",
        assemblyOrder: 1,
        connections: ["Rough ER Base"],
        failureEffect: "Stops mRNA from entering the ER, halting all targeted protein synthesis.",
        cascadeFailures: ["Ribosomes", "Rough ER Cisternae"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 2. Rough ER Cisternae (Folded sheets)
    const roughERGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const cisternaGeo = new THREE.TorusGeometry(3 + i * 0.8, 0.4, 16, 64, Math.PI * 1.5);
        const cisterna = new THREE.Mesh(cisternaGeo, roughERMaterial);
        cisterna.rotation.x = Math.PI / 2;
        cisterna.position.set(0, i * 0.6, 0);
        roughERGroup.add(cisterna);
        
        // Add ribosomes
        for (let j = 0; j < 30 + i * 10; j++) {
            const angle = (j / (30 + i * 10)) * Math.PI * 1.5;
            const riboGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const ribo = new THREE.Mesh(riboGeo, ribosomeMaterial);
            ribo.position.set(
                Math.cos(angle) * (3 + i * 0.8),
                Math.sin(angle) * (3 + i * 0.8),
                (Math.random() - 0.5) * 0.8
            );
            cisterna.add(ribo);
        }
    }
    group.add(roughERGroup);
    parts.push({
        name: "Rough ER Cisternae",
        description: "Flattened membrane disks studded with ribosomes, acting as the primary site for protein synthesis.",
        material: "roughERMaterial",
        function: "Protein Synthesis & Folding",
        assemblyOrder: 2,
        connections: ["Nuclear Envelope Connection", "Smooth ER Tubules"],
        failureEffect: "Unfolded protein response triggers; cell may undergo apoptosis.",
        cascadeFailures: ["Golgi Apparatus", "Cell Membrane"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Smooth ER Tubules
    const smoothERGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(5 + Math.random(), 0 + Math.random() * 2, (Math.random() - 0.5) * 4),
            new THREE.Vector3(7 + Math.random() * 2, 1 + Math.random() * 2, (Math.random() - 0.5) * 6),
            new THREE.Vector3(9 + Math.random() * 2, 0.5 + Math.random() * 2, (Math.random() - 0.5) * 8)
        ]);
        const tubeGeo = new THREE.TubeGeometry(path, 20, 0.3, 8, false);
        const tube = new THREE.Mesh(tubeGeo, smoothERMaterial);
        smoothERGroup.add(tube);
    }
    group.add(smoothERGroup);
    parts.push({
        name: "Smooth ER Tubules",
        description: "Tubular network lacking ribosomes, specialized in lipid synthesis, detoxification, and calcium storage.",
        material: "smoothERMaterial",
        function: "Lipid Synthesis & Detox",
        assemblyOrder: 3,
        connections: ["Rough ER Cisternae", "Transport Vesicles"],
        failureEffect: "Toxin buildup and lipid membrane degradation.",
        cascadeFailures: ["Vesicle Transport", "Mitochondria"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    // 4. Transport Vesicles
    const vesicles = [];
    for (let i = 0; i < 5; i++) {
        const vesGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const vesicle = new THREE.Mesh(vesGeo, vesicleMaterial);
        vesicle.position.set(8 + Math.random() * 3, 2 + Math.random() * 3, (Math.random() - 0.5) * 6);
        group.add(vesicle);
        vesicles.push({
            mesh: vesicle,
            offset: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            baseY: vesicle.position.y
        });
    }
    parts.push({
        name: "Transport Vesicles",
        description: "Membrane-bound spheres budding off the ER to transport proteins and lipids to the Golgi apparatus.",
        material: "vesicleMaterial",
        function: "Cargo Transport",
        assemblyOrder: 4,
        connections: ["Smooth ER Tubules"],
        failureEffect: "Proteins and lipids accumulate in the ER, unable to reach their destinations.",
        cascadeFailures: ["Golgi Apparatus"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 4, z: 0 }
    });

    const description = "The Endoplasmic Reticulum (ER) is a continuous membrane system that forms a series of flattened sacs within the cytoplasm of eukaryotic cells. It serves multiple functions, being important particularly in the synthesis, folding, modification, and transport of proteins (Rough ER) and the production of lipids (Smooth ER).";

    const quizQuestions = [
        {
            question: "Why does the Rough ER appear 'rough' under a microscope?",
            options: ["Due to high lipid concentrations", "It is studded with ribosomes", "Because of calcium deposits", "Due to folded cisternae"],
            correct: 1,
            explanation: "The Rough ER is covered in ribosomes, which are molecular machines responsible for protein synthesis, giving it a bumpy or 'rough' appearance.",
            difficulty: "Easy"
        },
        {
            question: "Which of the following is a primary function of the Smooth ER?",
            options: ["Protein synthesis", "DNA replication", "Lipid synthesis and detoxification", "ATP production"],
            correct: 2,
            explanation: "Unlike the Rough ER, the Smooth ER lacks ribosomes and is chiefly involved in synthesizing lipids, metabolizing carbohydrates, and detoxifying drugs and poisons.",
            difficulty: "Medium"
        },
        {
            question: "What happens to proteins immediately after they are synthesized in the Rough ER?",
            options: ["They are degraded by lysosomes", "They undergo folding and modification", "They are sent directly to the nucleus", "They exit the cell immediately"],
            correct: 1,
            explanation: "As proteins are synthesized by ribosomes on the Rough ER, they enter the ER lumen where they are folded into their 3D shapes and often modified (e.g., glycosylation).",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Gently pulse the rough ER cisternae
        const pulse = 1 + Math.sin(time * speed * 2) * 0.02;
        if (roughERGroup) {
            roughERGroup.scale.set(pulse, pulse, pulse);
        }

        // Rotate the entire ER slowly to show its 3D structure
        group.rotation.y = time * speed * 0.1;

        // Animate transport vesicles budding and moving
        vesicles.forEach(v => {
            v.mesh.position.y = v.baseY + Math.sin(time * speed * v.speed + v.offset) * 0.5;
            v.mesh.position.x += Math.cos(time * speed * v.speed + v.offset) * 0.01;
            // Reset position if they drift too far
            if (v.mesh.position.x > 12) v.mesh.position.x = 8;
            
            // Pulse emission
            v.mesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 4 + v.offset) * 0.3;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createEndoplasmicReticulum() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
