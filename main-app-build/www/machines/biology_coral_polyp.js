import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const glowAlgaeMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00aa44,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2
    });

    const fleshMat = new THREE.MeshPhysicalMaterial({
        color: 0xff66bb,
        emissive: 0x330022,
        roughness: 0.3,
        transmission: 0.6,
        thickness: 0.5,
        transparent: true,
        opacity: 0.85
    });

    const skeletonMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.9,
        metalness: 0.1,
        bumpScale: 0.05
    });

    const neonStingerMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        wireframe: true
    });

    // 1. Basal Plate
    const basalGeo = new THREE.CylinderGeometry(3, 3.5, 0.5, 32);
    const basalMesh = new THREE.Mesh(basalGeo, skeletonMat);
    basalMesh.position.set(0, 0.25, 0);
    group.add(basalMesh);
    parts.push({
        name: 'Basal Plate',
        description: 'Calcified base anchoring the polyp to the reef structure.',
        material: 'skeletonMat',
        function: 'Provides structural foundation and secure attachment to the substrate.',
        assemblyOrder: 1,
        connections: ['Calicle'],
        failureEffect: 'Polyp detachment and death from wave action.',
        cascadeFailures: ['Loss of skeletal integrity'],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Calicle (Limestone Cup)
    const calicleGeo = new THREE.CylinderGeometry(3.5, 3, 3, 32, 1, true);
    const calicleMesh = new THREE.Mesh(calicleGeo, skeletonMat);
    calicleMesh.position.set(0, 2, 0);
    group.add(calicleMesh);
    parts.push({
        name: 'Calicle',
        description: 'The limestone skeletal cup that houses the polyp body.',
        material: 'skeletonMat',
        function: 'Protects the soft tissues of the polyp from predators.',
        assemblyOrder: 2,
        connections: ['Basal Plate', 'Stomach Cavity'],
        failureEffect: 'Increased vulnerability to predation.',
        cascadeFailures: ['Soft tissue damage'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 0 }
    });

    // 3. Stomach Cavity (Coelenteron)
    const stomachGeo = new THREE.SphereGeometry(2.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const stomachMesh = new THREE.Mesh(stomachGeo, fleshMat);
    stomachMesh.rotation.x = Math.PI; // Flip it
    stomachMesh.position.set(0, 3.5, 0);
    group.add(stomachMesh);
    parts.push({
        name: 'Stomach Cavity',
        description: 'Central digestive sac where nutrients are broken down.',
        material: 'fleshMat',
        function: 'Digests captured plankton and absorbs nutrients from zooxanthellae.',
        assemblyOrder: 3,
        connections: ['Calicle', 'Mouth', 'Tentacles'],
        failureEffect: 'Starvation and inability to process nutrients.',
        cascadeFailures: ['Bleaching', 'Tissue necrosis'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 0 }
    });

    // 4. Mouth / Oral Disk
    const mouthGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const mouthMesh = new THREE.Mesh(mouthGeo, fleshMat);
    mouthMesh.rotation.x = Math.PI / 2;
    mouthMesh.position.set(0, 3.5, 0);
    group.add(mouthMesh);
    parts.push({
        name: 'Mouth / Oral Disk',
        description: 'Central opening surrounded by tentacles.',
        material: 'fleshMat',
        function: 'Ingests food and expels waste products.',
        assemblyOrder: 4,
        connections: ['Stomach Cavity', 'Tentacles'],
        failureEffect: 'Inability to consume captured prey or clear waste.',
        cascadeFailures: ['Internal toxicity'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 5. Tentacles
    const tentaclesGroup = new THREE.Group();
    tentaclesGroup.position.set(0, 3.5, 0);
    const numTentacles = 12;
    for (let i = 0; i < numTentacles; i++) {
        const angle = (i / numTentacles) * Math.PI * 2;
        const tentacleGeo = new THREE.CylinderGeometry(0.1, 0.3, 4, 16);
        // Shift geometry origin to the base
        tentacleGeo.translate(0, 2, 0);
        const tentacleMesh = new THREE.Mesh(tentacleGeo, fleshMat);
        
        // Position at the edge of the mouth
        const radius = 1.2;
        tentacleMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        tentacleMesh.rotation.x = Math.sin(angle) * 0.5;
        tentacleMesh.rotation.z = -Math.cos(angle) * 0.5;
        
        tentaclesGroup.add(tentacleMesh);
    }
    group.add(tentaclesGroup);
    parts.push({
        name: 'Tentacles',
        description: 'Flexible appendages surrounding the mouth, armed with stinging cells.',
        material: 'fleshMat',
        function: 'Captures plankton and defends against threats.',
        assemblyOrder: 5,
        connections: ['Mouth'],
        failureEffect: 'Loss of hunting capability (reliance solely on photosynthesis).',
        cascadeFailures: ['Nutritional deficiency'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 }
    });

    // 6. Zooxanthellae (Glowing Algae Particles)
    const algaeGroup = new THREE.Group();
    algaeGroup.position.set(0, 2.5, 0);
    const algaeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    for(let i=0; i<50; i++) {
        const algaeMesh = new THREE.Mesh(algaeGeo, glowAlgaeMat);
        const r = Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const h = Math.random() * 2 - 1;
        algaeMesh.position.set(r * Math.cos(theta), h, r * Math.sin(theta));
        algaeGroup.add(algaeMesh);
    }
    group.add(algaeGroup);
    parts.push({
        name: 'Zooxanthellae',
        description: 'Symbiotic dinoflagellates residing within the polyp tissue.',
        material: 'glowAlgaeMat',
        function: 'Provides up to 90% of energy through photosynthesis in exchange for shelter.',
        assemblyOrder: 6,
        connections: ['Stomach Cavity'],
        failureEffect: 'Coral bleaching and extreme energy deficit.',
        cascadeFailures: ['Starvation', 'Death of the polyp'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 4, y: 2.5, z: 4 }
    });

    // 7. Nematocysts (Stinging Cells)
    const nematocystGroup = new THREE.Group();
    tentaclesGroup.add(nematocystGroup);
    const nemGeo = new THREE.DodecahedronGeometry(0.15, 0);
    for(let i=0; i<numTentacles; i++) {
        const angle = (i / numTentacles) * Math.PI * 2;
        const radius = 1.2;
        const nemMesh = new THREE.Mesh(nemGeo, neonStingerMat);
        const bx = Math.cos(angle) * radius;
        const bz = Math.sin(angle) * radius;
        const tGroup = new THREE.Group();
        tGroup.position.set(bx, 0, bz);
        tGroup.rotation.x = Math.sin(angle) * 0.5;
        tGroup.rotation.z = -Math.cos(angle) * 0.5;
        nemMesh.position.set(0, 4.1, 0);
        tGroup.add(nemMesh);
        nematocystGroup.add(tGroup);
    }
    parts.push({
        name: 'Nematocysts',
        description: 'Microscopic, venomous harpoons on the tentacles.',
        material: 'neonStingerMat',
        function: 'Paralyzes zooplankton prey and deters predators.',
        assemblyOrder: 7,
        connections: ['Tentacles'],
        failureEffect: 'Inability to capture prey effectively.',
        cascadeFailures: ['Reduced growth rate'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    const description = "The Coral Polyp is a marine invertebrate that forms the building blocks of coral reefs. It secretes a calcium carbonate skeleton (calicle) and hosts symbiotic algae (zooxanthellae) which provide it with photosynthetic energy.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Zooxanthellae?",
            options: [
                "To capture zooplankton using venom.",
                "To provide energy to the polyp through photosynthesis.",
                "To secrete the calcium carbonate skeleton.",
                "To filter waste out of the stomach cavity."
            ],
            correct: 1,
            explanation: "Zooxanthellae are symbiotic algae that live within the coral tissue and provide most of the coral's energy needs via photosynthesis.",
            difficulty: "Medium"
        },
        {
            question: "Which structure acts as the protective outer 'cup' for the polyp?",
            options: [
                "Nematocyst",
                "Oral Disk",
                "Calicle",
                "Basal Plate"
            ],
            correct: 2,
            explanation: "The calicle is the hard limestone cup secreted by the basal plate, serving as physical protection for the soft body.",
            difficulty: "Easy"
        },
        {
            question: "What happens when Nematocysts fail to function?",
            options: [
                "The coral completely loses its color (bleaching).",
                "The coral cannot anchor to the reef.",
                "The coral loses its ability to paralyze and capture prey.",
                "The stomach cavity dissolves."
            ],
            correct: 2,
            explanation: "Nematocysts are stinging cells used to capture plankton. Without them, the polyp cannot hunt effectively.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        let tGroup, aGroup, nGroup;
        group.children.forEach(c => {
            if (c.children.length > 0 && c.children[0].geometry && c.children[0].geometry.type === 'CylinderGeometry') {
                tGroup = c;
            }
            if (c.children.length === 50) {
                aGroup = c;
            }
        });

        if (tGroup) {
            tGroup.children.forEach((tentacle, idx) => {
                if (tentacle.geometry && tentacle.geometry.type === 'CylinderGeometry') {
                    const offset = idx * 0.5;
                    const wave = Math.sin(time * speed * 2 + offset) * 0.2;
                    const angle = (idx / 12) * Math.PI * 2;
                    tentacle.rotation.x = Math.sin(angle) * 0.5 + wave * Math.cos(angle);
                    tentacle.rotation.z = -Math.cos(angle) * 0.5 + wave * Math.sin(angle);
                }
            });
            
            const nemGroupNode = tGroup.children.find(c => c.type === 'Group' && c.children.length === 12);
            if (nemGroupNode) {
                nemGroupNode.children.forEach((nBase, idx) => {
                    const offset = idx * 0.5;
                    const wave = Math.sin(time * speed * 2 + offset) * 0.2;
                    const angle = (idx / 12) * Math.PI * 2;
                    nBase.rotation.x = Math.sin(angle) * 0.5 + wave * Math.cos(angle);
                    nBase.rotation.z = -Math.cos(angle) * 0.5 + wave * Math.sin(angle);
                    
                    if(nBase.children[0]) {
                        nBase.children[0].material.emissiveIntensity = 1.0 + Math.sin(time * speed * 5 + offset) * 0.8;
                    }
                });
            }
        }

        if (aGroup) {
            aGroup.children.forEach((algae, idx) => {
                const pulse = Math.sin(time * speed * 3 + idx) * 0.5 + 0.5;
                algae.material.emissiveIntensity = 0.4 + pulse * 1.0;
                algae.position.y += Math.sin(time * speed * 4 + idx) * 0.005;
            });
        }
        
        const stomach = group.children.find(c => c.geometry && c.geometry.type === 'SphereGeometry');
        if (stomach) {
            const breath = Math.sin(time * speed * 1.5) * 0.05 + 1.0;
            stomach.scale.set(breath, breath, breath);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCoralPolyp() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
