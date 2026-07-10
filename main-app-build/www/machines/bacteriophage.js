import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material
    const glowingDNA = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
    });

    const proteinCapsidMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.4,
    });

    const tailSheathMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.7,
        metalness: 0.5,
    });

    // 1. Icosahedral Head (Capsid)
    const headGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    const headMesh = new THREE.Mesh(headGeometry, proteinCapsidMaterial);
    headMesh.position.set(0, 6.5, 0);
    group.add(headMesh);
    parts.push({
        name: 'Capsid Head',
        description: 'An icosahedral protein shell that protects the viral genome.',
        material: 'proteinCapsidMaterial',
        function: 'Protects the DNA/RNA and attaches to the tail.',
        assemblyOrder: 1,
        connections: ['Viral DNA', 'Collar'],
        failureEffect: 'Viral genome exposed to environment and degraded.',
        cascadeFailures: ['Viral DNA'],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 2. Viral DNA (inside head)
    const dnaGeometry = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
    const dnaMesh = new THREE.Mesh(dnaGeometry, glowingDNA);
    dnaMesh.position.set(0, 6.5, 0);
    group.add(dnaMesh);
    parts.push({
        name: 'Viral DNA',
        description: 'The genetic material of the virus.',
        material: 'glowingDNA',
        function: 'Carries genetic instructions to hijack host cell machinery.',
        assemblyOrder: 2,
        connections: ['Capsid Head'],
        failureEffect: 'Inability to replicate inside host.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 3. Collar
    const collarGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const collarMesh = new THREE.Mesh(collarGeometry, chrome);
    collarMesh.position.set(0, 4, 0);
    group.add(collarMesh);
    parts.push({
        name: 'Collar',
        description: 'Connects the head to the tail sheath.',
        material: 'chrome',
        function: 'Acts as a base for the head and anchors the whiskers.',
        assemblyOrder: 3,
        connections: ['Capsid Head', 'Tail Sheath'],
        failureEffect: 'Head detaches from tail, preventing DNA injection.',
        cascadeFailures: ['Capsid Head', 'Viral DNA'],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 4. Tail Sheath
    const tailGeometry = new THREE.CylinderGeometry(0.6, 0.6, 4.5, 32);
    const tailMesh = new THREE.Mesh(tailGeometry, tailSheathMaterial);
    tailMesh.position.set(0, 1.5, 0);
    group.add(tailMesh);
    parts.push({
        name: 'Tail Sheath',
        description: 'A contractile structure wrapping the tail tube.',
        material: 'tailSheathMaterial',
        function: 'Contracts to puncture the host cell membrane and inject DNA.',
        assemblyOrder: 4,
        connections: ['Collar', 'Base Plate'],
        failureEffect: 'Cannot penetrate host cell.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 4.5, z: 0 }
    });

    // 5. Base Plate
    const basePlateGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
    const basePlateMesh = new THREE.Mesh(basePlateGeometry, steel);
    basePlateMesh.position.set(0, -1, 0);
    group.add(basePlateMesh);
    parts.push({
        name: 'Base Plate',
        description: 'The foundation of the tail structure.',
        material: 'steel',
        function: 'Anchors the tail fibers and tail pins; initiates tail contraction.',
        assemblyOrder: 5,
        connections: ['Tail Sheath', 'Tail Fibers'],
        failureEffect: 'Failure to securely attach to host cell surface.',
        cascadeFailures: ['Tail Sheath', 'Tail Fibers'],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // 6. Tail Fibers (6 pieces)
    const tailFibers = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const fiberGroup = new THREE.Group();
        
        // Upper fiber
        const upperFiberGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5);
        const upperFiber = new THREE.Mesh(upperFiberGeo, aluminum);
        upperFiber.position.set(0, -1.5, 1.5);
        upperFiber.rotation.x = Math.PI / 4;
        
        // Lower fiber
        const lowerFiberGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.5);
        const lowerFiber = new THREE.Mesh(lowerFiberGeo, aluminum);
        lowerFiber.position.set(0, -4.0, 2.7);
        lowerFiber.rotation.x = -Math.PI / 8;

        fiberGroup.add(upperFiber);
        fiberGroup.add(lowerFiber);
        fiberGroup.rotation.y = angle;
        
        // Offset starting from base plate edge
        const radiusOffset = 1.2;
        fiberGroup.position.set(Math.sin(angle) * radiusOffset, -1, Math.cos(angle) * radiusOffset);
        
        tailFibers.add(fiberGroup);
    }
    group.add(tailFibers);
    parts.push({
        name: 'Tail Fibers',
        description: 'Long, thin leg-like structures.',
        material: 'aluminum',
        function: 'Recognizes and binds to specific receptor sites on the host cell surface.',
        assemblyOrder: 6,
        connections: ['Base Plate'],
        failureEffect: 'Virus floats freely, unable to locate target cells.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    const description = "The T4 Bacteriophage is a highly evolved viral nanomachine that infects E. coli bacteria. It utilizes a syringe-like mechanism to inject its genetic material through the tough bacterial cell wall.";

    const quizQuestions = [
        {
            question: "What is the primary function of the bacteriophage's Tail Sheath?",
            options: [
                "To store viral DNA",
                "To contract and drive the central tube through the host cell wall",
                "To recognize specific receptors on the host",
                "To act as a protective barrier against enzymes"
            ],
            correct: 1,
            explanation: "The tail sheath acts like a spring. When the virus binds to a host, the sheath contracts, driving the tail tube like a syringe needle through the cell membrane.",
            difficulty: "Medium"
        },
        {
            question: "Where is the viral genome stored?",
            options: [
                "Inside the Collar",
                "Along the Tail Fibers",
                "Inside the Icosahedral Capsid Head",
                "Within the Base Plate"
            ],
            correct: 2,
            explanation: "The viral genome (DNA) is tightly packed within the icosahedral capsid head, protecting it until it is ready to be injected.",
            difficulty: "Easy"
        },
        {
            question: "Which component is primarily responsible for initially recognizing the correct host bacterium?",
            options: [
                "The Base Plate",
                "The Tail Fibers",
                "The Collar",
                "The Capsid"
            ],
            correct: 1,
            explanation: "The tail fibers are sensory organs that bind to specific lipopolysaccharide receptors on the bacterial surface, ensuring the phage infects only the correct host.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // DNA pulsing and rotating
        const dna = meshes ? meshes.find(m => m.name === 'Viral DNA' || m.geometry?.type === 'TorusKnotGeometry') || group.children[1] : group.children[1];
        if (dna) {
            dna.rotation.x += 0.01 * speed;
            dna.rotation.y += 0.02 * speed;
            dna.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(time * 0.005 * speed);
        }

        // Tail fibers waving/flexing slightly
        const fibers = meshes ? meshes.find(m => m.name === 'Tail Fibers') || group.children[5] : group.children[5];
        if (fibers && fibers.children) {
            fibers.children.forEach((fiberGroup, index) => {
                fiberGroup.rotation.x = Math.sin(time * 0.002 * speed + index) * 0.08;
            });
        }
        
        // Gentle vertical bobbing
        group.position.y = Math.sin(time * 0.002 * speed) * 0.4;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBacteriophage() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
