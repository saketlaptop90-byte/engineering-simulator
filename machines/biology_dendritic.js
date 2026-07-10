import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x4488ff,
        emissive: 0x2244ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.2,
        clearcoat: 1.0
    });

    const dendriteMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        roughness: 0.4,
        metalness: 0.3,
        emissive: 0x004433,
        emissiveIntensity: 0.5
    });

    const mhcMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x880088,
        emissiveIntensity: 0.6
    });

    const pathogenMat = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xbb1100,
        emissiveIntensity: 1.0,
        wireframe: true
    });

    const lysosomeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffff00,
        emissive: 0x888800,
        emissiveIntensity: 0.4,
        transmission: 0.5,
        transparent: true,
        opacity: 0.6
    });

    // 1. Main Cell Body (Soma)
    const somaGeom = new THREE.IcosahedronGeometry(2.5, 3);
    const somaMesh = new THREE.Mesh(somaGeom, glowingCoreMat);
    somaMesh.userData.id = 'soma';
    group.add(somaMesh);
    parts.push({
        name: 'Cell Body (Soma)',
        description: 'The main command center of the dendritic cell, housing the nucleus and organelles for processing captured antigens.',
        material: 'Glowing Membrane',
        function: 'Processes captured pathogens and coordinates the immune response.',
        assemblyOrder: 1,
        connections: ['Dendrites', 'Lysosomes', 'MHC Receptors'],
        failureEffect: 'Loss of cell viability and failure to process antigens.',
        cascadeFailures: ['Complete immune presentation failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 2. Dendrites (Tentacles/Projections)
    const dendritesGroup = new THREE.Group();
    const dendriteGeom = new THREE.ConeGeometry(0.3, 4, 8);
    dendriteGeom.translate(0, 2, 0); // shift origin to base
    
    const numDendrites = 16;
    for (let i = 0; i < numDendrites; i++) {
        const dendrite = new THREE.Mesh(dendriteGeom, dendriteMat);
        const phi = Math.acos(-1 + (2 * i) / numDendrites);
        const theta = Math.sqrt(numDendrites * Math.PI) * phi;
        
        dendrite.position.setFromSphericalCoords(2.4, phi, theta);
        dendrite.lookAt(0, 0, 0); // Point inward, so base is at surface, tip outward
        dendrite.rotateX(Math.PI / 2); // align cone
        
        // Save initial rotation for animation
        dendrite.userData.baseRotation = dendrite.rotation.clone();
        dendrite.userData.phase = Math.random() * Math.PI * 2;
        
        dendrite.userData.id = 'dendrite_' + i;
        dendritesGroup.add(dendrite);
    }
    somaMesh.add(dendritesGroup); // Attach to soma so it scales/moves with it
    parts.push({
        name: 'Dendritic Extensions',
        description: 'Spiky, branch-like projections that continuously extend and retract to probe the environment for foreign bodies.',
        material: 'Bio-Polymer Matrix',
        function: 'Maximal surface area for pathogen sampling and T-cell interaction.',
        assemblyOrder: 2,
        connections: ['Cell Body (Soma)', 'Pathogens'],
        failureEffect: 'Inability to detect or capture surrounding antigens.',
        cascadeFailures: ['Lack of antigen presentation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Pathogens (Antigens being engulfed)
    const pathogenGroup = new THREE.Group();
    const pathogenGeom = new THREE.DodecahedronGeometry(0.5, 1);
    for(let i = 0; i < 5; i++) {
        const pathogen = new THREE.Mesh(pathogenGeom, pathogenMat);
        const radius = 3.5 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pathogen.position.setFromSphericalCoords(radius, phi, theta);
        pathogen.userData.radiusBase = radius;
        pathogen.userData.theta = theta;
        pathogen.userData.phi = phi;
        pathogen.userData.id = 'pathogen_' + i;
        pathogenGroup.add(pathogen);
    }
    group.add(pathogenGroup);
    parts.push({
        name: 'Target Pathogens',
        description: 'Foreign entities (viruses, bacteria) being actively hunted and engulfed via phagocytosis.',
        material: 'Viral Capsid',
        function: 'Serves as the source of antigenic material to activate the immune system.',
        assemblyOrder: 3,
        connections: ['Dendritic Extensions'],
        failureEffect: 'Escapes detection, causing unimpeded infection.',
        cascadeFailures: ['Systemic infection'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 5 }
    });

    // 4. Lysosomes (Internal processing centers)
    const lysosomeGroup = new THREE.Group();
    const lysosomeGeom = new THREE.SphereGeometry(0.4, 16, 16);
    for(let i = 0; i < 4; i++) {
        const lysosome = new THREE.Mesh(lysosomeGeom, lysosomeMat);
        lysosome.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
        lysosome.userData.id = 'lysosome_' + i;
        lysosomeGroup.add(lysosome);
    }
    somaMesh.add(lysosomeGroup);
    parts.push({
        name: 'Lysosomes',
        description: 'Vesicles containing digestive enzymes that break down engulfed pathogens into smaller peptide fragments (antigens).',
        material: 'Enzyme-rich Vesicle',
        function: 'Pathogen degradation and peptide processing.',
        assemblyOrder: 4,
        connections: ['Cell Body (Soma)', 'MHC Receptors'],
        failureEffect: 'Intracellular accumulation of intact pathogens; no antigens produced.',
        cascadeFailures: ['MHC remains empty', 'No T-cell activation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 2, z: -4 }
    });

    // 5. Major Histocompatibility Complex (MHC) Class II Receptors
    const mhcGroup = new THREE.Group();
    const mhcGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    mhcGeom.translate(0, 0.4, 0); // base at origin
    for(let i = 0; i < 12; i++) {
        const mhc = new THREE.Mesh(mhcGeom, mhcMat);
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        mhc.position.setFromSphericalCoords(2.4, phi, theta);
        mhc.lookAt(0, 0, 0);
        mhc.rotateX(-Math.PI / 2); // Point outwards
        
        // Add tiny peptide fragment
        const peptideGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const peptide = new THREE.Mesh(peptideGeom, pathogenMat);
        peptide.position.set(0, 0.9, 0);
        mhc.add(peptide);
        
        mhc.userData.id = 'mhc_' + i;
        mhcGroup.add(mhc);
    }
    somaMesh.add(mhcGroup);
    parts.push({
        name: 'MHC Class II Receptors',
        description: 'Surface molecules that display processed pathogen fragments (antigens) to Helper T Cells.',
        material: 'Transmembrane Protein',
        function: 'Presents antigens to initiate the adaptive immune cascade.',
        assemblyOrder: 5,
        connections: ['Cell Body (Soma)', 'Lysosomes'],
        failureEffect: 'Inability to communicate with T-cells.',
        cascadeFailures: ['Lack of antibody production', 'Immunodeficiency'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    const description = "The Dendritic Cell is the ultimate sentinel of the immune system. Acting as an antigen-presenting cell (APC), it continuously samples its environment using its dynamic dendritic extensions. Once it captures a pathogen, it engulfs it, degrades it internally using lysosomes, and presents the resulting antigen fragments on its surface via MHC molecules. This vital process bridges the innate and adaptive immune responses, directly activating T-cells.";

    const quizQuestions = [
        {
            question: "What is the primary function of the dendritic extensions?",
            options: [
                "To release antibodies",
                "To provide motility to the cell",
                "To increase surface area for probing the environment and capturing antigens",
                "To synthesize proteins for the nucleus"
            ],
            correct: 2,
            explanation: "Dendritic extensions form a vast web-like network, greatly increasing the cell's surface area to efficiently sample the environment for foreign antigens.",
            difficulty: "Medium"
        },
        {
            question: "How does a Dendritic Cell bridge the innate and adaptive immune systems?",
            options: [
                "By differentiating directly into memory B cells",
                "By engulfing pathogens (innate) and presenting their antigens to T-cells (adaptive)",
                "By producing huge amounts of non-specific histamines",
                "By forming a physical barrier in the skin"
            ],
            correct: 1,
            explanation: "As an Antigen-Presenting Cell (APC), it performs phagocytosis (an innate mechanism) and then processes and presents those antigens to T-cells, triggering the adaptive immune response.",
            difficulty: "Hard"
        },
        {
            question: "Which cellular component is responsible for breaking down the engulfed pathogen into smaller fragments?",
            options: [
                "MHC Class II Receptors",
                "Lysosomes",
                "Nucleus",
                "Mitochondria"
            ],
            correct: 1,
            explanation: "Lysosomes are vesicles filled with digestive enzymes that fuse with the phagosome to degrade pathogens into small peptide fragments.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Find meshes by partial userData ID
        const soma = meshes.find(m => m.userData && m.userData.id === 'soma');
        const pathogens = meshes.filter(m => m.userData && m.userData.id && m.userData.id.startsWith('pathogen_'));
        const dendrites = meshes.filter(m => m.userData && m.userData.id && m.userData.id.startsWith('dendrite_'));
        const lysosomes = meshes.filter(m => m.userData && m.userData.id && m.userData.id.startsWith('lysosome_'));

        const s = speed * 0.001;

        if (soma) {
            // Gentle pulsing of the main cell body
            const scalePulse = 1.0 + Math.sin(time * s * 2) * 0.05;
            soma.scale.set(scalePulse, scalePulse, scalePulse);
            soma.rotation.y += s * 0.2;
            soma.rotation.x += s * 0.1;
        }

        dendrites.forEach((d, i) => {
            // Waving motion for dendrites
            d.rotation.x = d.userData.baseRotation.x + Math.sin(time * s * 3 + d.userData.phase) * 0.2;
            d.rotation.z = d.userData.baseRotation.z + Math.cos(time * s * 2.5 + d.userData.phase) * 0.2;
            // Extending/retracting
            const lengthPulse = 1.0 + Math.sin(time * s * 1.5 + d.userData.phase) * 0.3;
            d.scale.set(1, lengthPulse, 1);
        });

        pathogens.forEach((p, i) => {
            // Orbiting and occasionally pulling in
            const pullIn = (Math.sin(time * s * 0.5 + i) + 1) / 2; // 0 to 1
            const currentRadius = p.userData.radiusBase * (1.0 - pullIn * 0.5); // Gets closer to the cell occasionally
            p.userData.theta += s * 0.5;
            p.position.setFromSphericalCoords(currentRadius, p.userData.phi, p.userData.theta);
            
            // Spinning
            p.rotation.x += s * 2;
            p.rotation.y += s * 3;
            
            // Pulsing color intensity
            if(p.material && p.material.emissiveIntensity !== undefined) {
                p.material.emissiveIntensity = 0.5 + Math.sin(time * s * 5) * 0.5;
            }
        });

        lysosomes.forEach((l, i) => {
            // Swirling around inside the cell
            const lx = Math.sin(time * s * 2 + i) * 1.5;
            const ly = Math.cos(time * s * 1.5 + i * 2) * 1.5;
            const lz = Math.sin(time * s * 2.5 + i * 3) * 1.5;
            l.position.set(lx, ly, lz);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDendriticCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
