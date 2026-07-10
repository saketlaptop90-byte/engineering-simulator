import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom High-Tech Materials
    const membraneMat = new THREE.MeshPhysicalMaterial({
        color: 0x4488ff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.6,
        thickness: 0.5,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00aa55,
        emissiveIntensity: 1.5,
        metalness: 0.3,
        roughness: 0.2,
        wireframe: true
    });

    const enzymeMat = new THREE.MeshStandardMaterial({
        color: 0xff44aa,
        emissive: 0x661144,
        emissiveIntensity: 0.8,
        roughness: 0.4
    });

    const proteinChannelMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.6,
        roughness: 0.4
    });

    const h2o2Mat = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        emissive: 0xaa0000,
        emissiveIntensity: 1.0
    });

    const waterMat = new THREE.MeshStandardMaterial({
        color: 0x2288ff,
        emissive: 0x1144aa,
        emissiveIntensity: 1.0
    });

    // Outer Membrane
    const membraneGeo = new THREE.SphereGeometry(10, 64, 64);
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.name = "Lipid Bilayer Membrane";
    group.add(membraneMesh);
    parts.push({
        name: "Lipid Bilayer Membrane",
        description: "The semi-permeable boundary of the peroxisome, isolating its oxidative reactions from the rest of the cell.",
        material: "membraneMat",
        function: "Separates toxic H2O2 production and degradation from the cytoplasm, ensuring cellular safety.",
        assemblyOrder: 1,
        connections: ["Transmembrane Proteins", "Matrix"],
        failureEffect: "Leakage of reactive oxygen species into the cytoplasm, causing severe cellular damage.",
        cascadeFailures: ["Cell Death (Apoptosis)", "Oxidative Stress"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // Crystalline Core (Catalase)
    const coreGeo = new THREE.OctahedronGeometry(3.5, 0);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.name = "Crystalline Core (Catalase)";
    group.add(coreMesh);
    parts.push({
        name: "Crystalline Core (Catalase)",
        description: "A dense, crystal-like aggregate of enzymes, primarily catalase and urate oxidase.",
        material: "coreMat",
        function: "Catalyzes the breakdown of highly toxic hydrogen peroxide (H2O2) into water and oxygen.",
        assemblyOrder: 2,
        connections: ["Matrix", "Reactive Substrates"],
        failureEffect: "Accumulation of hydrogen peroxide leading to toxic environment inside and outside the organelle.",
        cascadeFailures: ["Lipid Peroxidation", "DNA Damage"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // Transmembrane Protein Channels
    const channels = new THREE.Group();
    const channelCount = 12;
    for (let i = 0; i < channelCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / channelCount);
        const theta = Math.sqrt(channelCount * Math.PI) * phi;
        const x = 10 * Math.cos(theta) * Math.sin(phi);
        const y = 10 * Math.sin(theta) * Math.sin(phi);
        const z = 10 * Math.cos(phi);
        
        const channelGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
        const channelMesh = new THREE.Mesh(channelGeo, proteinChannelMat);
        channelMesh.position.set(x, y, z);
        channelMesh.lookAt(0, 0, 0);
        channels.add(channelMesh);
    }
    channels.name = "Transmembrane Proteins (Transporters)";
    group.add(channels);
    parts.push({
        name: "Transmembrane Proteins (Transporters)",
        description: "Specialized pore proteins embedded in the membrane.",
        material: "proteinChannelMat",
        function: "Import very long chain fatty acids and other substrates into the peroxisome for beta-oxidation.",
        assemblyOrder: 3,
        connections: ["Lipid Bilayer Membrane", "Cytoplasm"],
        failureEffect: "Inability to import substrates, causing buildup of very long chain fatty acids in the blood (e.g., X-ALD).",
        cascadeFailures: ["Neurological Degeneration", "Metabolic Arrest"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 0 }
    });

    // Matrix Enzymes
    const enzymes = new THREE.Group();
    for (let i = 0; i < 30; i++) {
        const enzymeGeo = new THREE.IcosahedronGeometry(0.6, 0);
        const enzymeMesh = new THREE.Mesh(enzymeGeo, enzymeMat);
        const r = 8 * Math.pow(Math.random(), 1/3);
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        enzymeMesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        enzymes.add(enzymeMesh);
    }
    enzymes.name = "Oxidative Enzymes (Matrix)";
    group.add(enzymes);
    parts.push({
        name: "Oxidative Enzymes (Matrix)",
        description: "Various oxidases suspended in the granular matrix of the peroxisome.",
        material: "enzymeMat",
        function: "Perform beta-oxidation of long-chain fatty acids and synthesize plasmalogens (ether lipids).",
        assemblyOrder: 4,
        connections: ["Lipid Bilayer Membrane", "Crystalline Core"],
        failureEffect: "Disruption of lipid metabolism and failure to synthesize essential myelin sheath components.",
        cascadeFailures: ["Demyelination", "Organelle Dysfunction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // Toxic/Neutralized Particles
    const particles = new THREE.Group();
    const particleData = [];
    for (let i = 0; i < 20; i++) {
        const isH2O2 = Math.random() > 0.5;
        const geo = new THREE.SphereGeometry(0.4, 8, 8);
        const mesh = new THREE.Mesh(geo, isH2O2 ? h2o2Mat : waterMat);
        
        let r = 4 + 5 * Math.random();
        let theta = Math.random() * 2 * Math.PI;
        let phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        particles.add(mesh);
        particleData.push({ mesh, isH2O2, theta, phi, r, speed: 0.02 + Math.random() * 0.03 });
    }
    particles.name = "Metabolic Substrates & Products";
    group.add(particles);

    const description = "The Peroxisome is a highly dynamic organelle responsible for lipid metabolism and chemical detoxification. It breaks down very long chain fatty acids and neutralizes harmful reactive oxygen species, particularly hydrogen peroxide, using its dense crystalline core of catalase.";

    const quizQuestions = [
        {
            question: "What is the primary function of the crystalline core (catalase) within the peroxisome?",
            options: [
                "Synthesizing ATP for the cell",
                "Breaking down hydrogen peroxide into water and oxygen",
                "Storing genetic information",
                "Folding newly synthesized proteins"
            ],
            correct: 1,
            explanation: "Catalase is an enzyme that rapidly breaks down toxic hydrogen peroxide (a byproduct of various oxidative reactions) into harmless water and oxygen.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following is a major metabolic pathway that occurs in the peroxisome?",
            options: [
                "Glycolysis",
                "The Krebs Cycle",
                "Beta-oxidation of very long chain fatty acids",
                "Photosynthesis"
            ],
            correct: 2,
            explanation: "Peroxisomes specifically handle the initial steps of beta-oxidation for very long chain fatty acids, shortening them so they can be fully oxidized by mitochondria.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the peroxisome's transmembrane transporter proteins fail?",
            options: [
                "The cell will burst due to osmotic pressure",
                "Very long chain fatty acids will accumulate in the cell and bloodstream",
                "Ribosomes will detach from the endoplasmic reticulum",
                "The peroxisome will merge with the nucleus"
            ],
            correct: 1,
            explanation: "Mutations in these transporter proteins (like in X-linked adrenoleukodystrophy) prevent very long chain fatty acids from entering the peroxisome for degradation, leading to toxic accumulation.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        const membrane = group.children.find(c => c.name === "Lipid Bilayer Membrane");
        const core = group.children.find(c => c.name === "Crystalline Core (Catalase)");
        const enz = group.children.find(c => c.name === "Oxidative Enzymes (Matrix)");
        const partsGroup = group.children.find(c => c.name === "Metabolic Substrates & Products");
        const channelsGrp = group.children.find(c => c.name === "Transmembrane Proteins (Transporters)");

        if (core) {
            core.rotation.y = time * 0.5 * speed;
            core.rotation.x = time * 0.3 * speed;
            core.scale.setScalar(1 + 0.05 * Math.sin(time * 2 * speed));
        }

        if (enz) {
            enz.rotation.y = -time * 0.1 * speed;
            enz.children.forEach((child, i) => {
                child.position.y += Math.sin(time * speed + i) * 0.02;
                child.rotation.x += 0.05 * speed;
                child.rotation.y += 0.05 * speed;
            });
        }

        if (membrane) {
            membrane.scale.setScalar(1 + 0.02 * Math.sin(time * speed));
        }

        if (channelsGrp) {
            channelsGrp.scale.setScalar(1 + 0.02 * Math.sin(time * speed));
        }

        if (partsGroup) {
            particleData.forEach((pd, i) => {
                pd.theta += pd.speed * speed;
                pd.phi += (pd.speed * 0.5) * speed;
                
                if (pd.isH2O2) {
                    pd.r -= 0.05 * speed;
                    if (pd.r < 3.8) {
                        pd.isH2O2 = false;
                        pd.mesh.material = waterMat;
                        pd.r = 4.0;
                    }
                } else {
                    pd.r += 0.05 * speed;
                    if (pd.r > 9.5) {
                        pd.isH2O2 = true;
                        pd.mesh.material = h2o2Mat;
                        pd.r = 9.0;
                    }
                }

                pd.mesh.position.set(
                    pd.r * Math.sin(pd.phi) * Math.cos(pd.theta),
                    pd.r * Math.sin(pd.phi) * Math.sin(pd.theta),
                    pd.r * Math.cos(pd.phi)
                );
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPeroxisome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
