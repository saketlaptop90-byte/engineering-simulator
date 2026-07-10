import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
    });
    
    const glowingRed = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.2,
        roughness: 0.1,
    });

    const transparentSteel = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
    });

    const meshes = {};

    // Arch
    const archGeometry = new THREE.TorusGeometry( 50, 2, 32, 64, Math.PI );
    const archMesh1 = new THREE.Mesh(archGeometry, steel);
    archMesh1.position.set(0, 0, 10);
    group.add(archMesh1);
    
    const archMesh2 = new THREE.Mesh(archGeometry, steel);
    archMesh2.position.set(0, 0, -10);
    group.add(archMesh2);

    parts.push({
        name: "Main Arch Ribs",
        description: "The primary load-bearing arches that transfer loads to the abutments.",
        material: "Steel",
        function: "Compressive load transfer",
        assemblyOrder: 2,
        connections: ["Abutments", "Hangers", "Deck"],
        failureEffect: "Complete structural collapse",
        cascadeFailures: ["Deck", "Hangers"],
        originalPosition: { x: 0, y: 0, z: 10 },
        explodedPosition: { x: 0, y: 20, z: 30 }
    });
    meshes.arches = [archMesh1, archMesh2];

    // Deck
    const deckGeometry = new THREE.BoxGeometry( 110, 1, 30 );
    const deckMesh = new THREE.Mesh(deckGeometry, darkSteel);
    deckMesh.position.set(0, 5, 0);
    group.add(deckMesh);
    
    parts.push({
        name: "Bridge Deck",
        description: "The roadway or walkway surface supported by the arch.",
        material: "Reinforced Concrete / Steel",
        function: "Supports live loads (vehicles, pedestrians)",
        assemblyOrder: 3,
        connections: ["Hangers", "Abutments"],
        failureEffect: "Loss of usable path, localized failure",
        cascadeFailures: ["Hangers"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });
    meshes.deck = deckMesh;

    // Hangers (Suspension Cables/Rods)
    const hangers = [];
    for(let i = -40; i <= 40; i+=10) {
        if(i === 0) continue; // Skip center for variety or place a special one
        
        // Calculate arch height at this x
        const angle = Math.acos(i / 50);
        const archY = Math.sin(angle) * 50;
        
        const hangerHeight = archY - 5;
        const hangerGeo = new THREE.CylinderGeometry(0.2, 0.2, hangerHeight, 8);
        
        // Neon stress indicators
        const hangerMesh1 = new THREE.Mesh(hangerGeo, neonBlue);
        hangerMesh1.position.set(i, 5 + hangerHeight/2, 10);
        group.add(hangerMesh1);
        hangers.push(hangerMesh1);

        const hangerMesh2 = new THREE.Mesh(hangerGeo, neonBlue);
        hangerMesh2.position.set(i, 5 + hangerHeight/2, -10);
        group.add(hangerMesh2);
        hangers.push(hangerMesh2);
    }
    meshes.hangers = hangers;

    parts.push({
        name: "Hangers / Suspenders",
        description: "Vertical tension members that transfer the deck load to the arch.",
        material: "High-strength Steel Cables",
        function: "Tension load transfer",
        assemblyOrder: 4,
        connections: ["Main Arch Ribs", "Bridge Deck"],
        failureEffect: "Deck sagging, potential localized deck failure",
        cascadeFailures: ["Bridge Deck"],
        originalPosition: { x: 0, y: 25, z: 10 },
        explodedPosition: { x: 0, y: 40, z: 50 }
    });

    // Abutments
    const abutmentGeo = new THREE.BoxGeometry(20, 20, 40);
    const abutment1 = new THREE.Mesh(abutmentGeo, transparentSteel);
    abutment1.position.set(55, 0, 0);
    group.add(abutment1);

    const abutment2 = new THREE.Mesh(abutmentGeo, transparentSteel);
    abutment2.position.set(-55, 0, 0);
    group.add(abutment2);

    parts.push({
        name: "Abutments",
        description: "Massive foundations at the ends of the bridge that resist the outward thrust of the arch.",
        material: "Reinforced Concrete",
        function: "Thrust resistance and foundation support",
        assemblyOrder: 1,
        connections: ["Main Arch Ribs", "Bridge Deck", "Earth/Bedrock"],
        failureEffect: "Arch collapse due to spread of base",
        cascadeFailures: ["Main Arch Ribs", "Deck", "Hangers"],
        originalPosition: { x: 55, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 0, z: 0 }
    });

    // Cross Bracing
    const braceGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
    braceGeo.rotateX(Math.PI / 2);
    const braces = [];
    for(let i = -35; i <= 35; i+=10) {
        const angle = Math.acos(i / 50);
        const archY = Math.sin(angle) * 50;
        
        const brace = new THREE.Mesh(braceGeo, glowingRed);
        brace.position.set(i, archY, 0);
        group.add(brace);
        braces.push(brace);
    }
    meshes.braces = braces;

    parts.push({
        name: "Cross Bracing",
        description: "Lateral members connecting the arch ribs to prevent buckling.",
        material: "Steel",
        function: "Lateral stability and wind resistance",
        assemblyOrder: 5,
        connections: ["Main Arch Ribs"],
        failureEffect: "Lateral buckling of the arch ribs",
        cascadeFailures: ["Main Arch Ribs"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: 60, z: -30 }
    });

    const description = "An ultra high-tech Arch Bridge visualization showing structural components. Neon elements represent stress and tension pathways.";

    const quizQuestions = [
        {
            question: "What is the primary internal force that an arch structure experiences?",
            options: ["Tension", "Compression", "Torsion", "Shear"],
            correct: 1,
            explanation: "Arches are designed to primarily work in compression, transferring loads along the curve to the abutments.",
            difficulty: "Medium"
        },
        {
            question: "What component is crucial for resisting the horizontal thrust generated by an arch bridge?",
            options: ["Hangers", "Cross Bracing", "Deck", "Abutments"],
            correct: 3,
            explanation: "The abutments provide the necessary foundation and resistance to the outward horizontal thrust from the arch ribs.",
            difficulty: "Medium"
        },
        {
            question: "In a tied-arch bridge (where the deck acts as a tie), what force primarily acts on the deck?",
            options: ["Compression", "Torsion", "Tension", "Shear"],
            correct: 2,
            explanation: "In a tied-arch bridge, the deck acts as a tension member (a 'tie') to resist the outward horizontal forces of the arch, eliminating the need for massive abutments to resist thrust.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, m) {
        // Dynamic load shifting animation
        // Pulse hangers (tension)
        const intensity = (Math.sin(time * speed * 2) + 1) / 2; // 0 to 1
        
        meshes.hangers.forEach((hanger, index) => {
            const offset = index * 0.1;
            const wave = (Math.sin(time * speed * 3 + offset) + 1) / 2;
            hanger.material.emissiveIntensity = 0.5 + wave * 0.8;
            hanger.scale.x = hanger.scale.z = 1 + wave * 0.2;
        });

        // Pulse braces (compression/lateral)
        meshes.braces.forEach((brace) => {
            brace.material.emissiveIntensity = 0.5 + intensity;
        });

        // Small vibrations in the deck to simulate live load
        meshes.deck.position.y = 5 + Math.sin(time * speed * 10) * 0.1;
    }

    return { group, parts, description, quizQuestions, animate: (time, speed) => animate(time, speed, meshes) };
}

// Auto-generated missing stub
export function createArchBridge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
