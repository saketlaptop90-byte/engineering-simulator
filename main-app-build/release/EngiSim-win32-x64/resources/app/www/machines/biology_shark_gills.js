import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom high-tech glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xaa0011,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.1
    });

    const cartilageMat = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        roughness: 0.8,
        metalness: 0.1
    });

    // Part 1: Branchial Arch (Cartilage support)
    const archGeo = new THREE.TorusGeometry(2, 0.3, 16, 64, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, cartilageMat);
    archMesh.position.set(0, 0, 0);
    archMesh.rotation.z = Math.PI / 2;
    archMesh.name = 'branchialArch';
    group.add(archMesh);
    
    parts.push({
        name: 'Branchial Arch',
        description: 'Cartilaginous skeletal structure supporting the gills.',
        material: cartilageMat,
        function: 'Provides structural support for the gill filaments and rakers.',
        assemblyOrder: 1,
        connections: ['Gill Filaments', 'Gill Rakers'],
        failureEffect: 'Collapse of the gill structure, preventing water flow.',
        cascadeFailures: ['Hypoxia', 'Death'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3 }
    });

    // Part 2: Primary Gill Filaments
    const filamentGeo = new THREE.CylinderGeometry(0.1, 0.05, 3, 16);
    const filamentsGroup = new THREE.Group();
    for(let i = 0; i < 10; i++) {
        const filamentMesh = new THREE.Mesh(filamentGeo, glowingRed);
        filamentMesh.position.set(2 + Math.sin(i * 0.3), -1.5 + i * 0.3, 0);
        filamentMesh.rotation.z = Math.PI / 4;
        filamentMesh.name = `filament_${i}`;
        filamentsGroup.add(filamentMesh);
    }
    filamentsGroup.position.set(0, 0, 0);
    group.add(filamentsGroup);
    
    parts.push({
        name: 'Primary Gill Filaments',
        description: 'Vascularized structures extending from the branchial arch.',
        material: glowingRed,
        function: 'Houses secondary lamellae and directs blood flow for gas exchange.',
        assemblyOrder: 2,
        connections: ['Branchial Arch', 'Secondary Lamellae'],
        failureEffect: 'Reduced blood flow to the exchange surfaces.',
        cascadeFailures: ['Reduced Oxygen Uptake'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 }
    });

    // Part 3: Secondary Lamellae
    const lamellaGeo = new THREE.BoxGeometry(0.5, 0.02, 0.2);
    const lamellaeGroup = new THREE.Group();
    for(let i = 0; i < 30; i++) {
        const lamellaMesh = new THREE.Mesh(lamellaGeo, glowingBlue);
        lamellaMesh.position.set(2.5, -1.5 + i * 0.1, 0.2);
        lamellaMesh.name = `lamella_${i}`;
        lamellaeGroup.add(lamellaMesh);
    }
    lamellaeGroup.position.set(0, 0, 0);
    group.add(lamellaeGroup);

    parts.push({
        name: 'Secondary Lamellae',
        description: 'Microscopic, highly folded surfaces on the filaments.',
        material: glowingBlue,
        function: 'Site of counter-current gas exchange between water and blood.',
        assemblyOrder: 3,
        connections: ['Primary Gill Filaments'],
        failureEffect: 'Cessation of oxygen extraction from water.',
        cascadeFailures: ['Asphyxiation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 2 }
    });

    // Part 4: Gill Rakers
    const rakerGeo = new THREE.ConeGeometry(0.1, 1, 16);
    const rakersGroup = new THREE.Group();
    for(let i = 0; i < 8; i++) {
        const rakerMesh = new THREE.Mesh(rakerGeo, cartilageMat);
        rakerMesh.position.set(-2, -1.2 + i * 0.4, 0);
        rakerMesh.rotation.z = -Math.PI / 2;
        rakerMesh.name = `raker_${i}`;
        rakersGroup.add(rakerMesh);
    }
    rakersGroup.position.set(0, 0, 0);
    group.add(rakersGroup);

    parts.push({
        name: 'Gill Rakers',
        description: 'Bony or cartilaginous projections from the branchial arch.',
        material: cartilageMat,
        function: 'Prevents food particles from passing through and damaging the delicate filaments.',
        assemblyOrder: 4,
        connections: ['Branchial Arch'],
        failureEffect: 'Debris damages the delicate gill filaments.',
        cascadeFailures: ['Infection', 'Decreased Gas Exchange Efficiency'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 }
    });

    const description = "Shark gills operate using an ultra-efficient counter-current gas exchange system. Water flows across the highly folded secondary lamellae in the opposite direction to blood flow, maximizing oxygen extraction efficiency.";

    const quizQuestions = [
        {
            question: "What is the primary function of the secondary lamellae?",
            options: [
                "To provide structural support",
                "To filter food particles",
                "To act as the primary site of counter-current gas exchange",
                "To pump water over the gills"
            ],
            correct: 2,
            explanation: "The secondary lamellae are highly folded, vascularized surfaces where oxygen from the water diffuses into the blood, maximizing surface area for exchange.",
            difficulty: "Medium"
        },
        {
            question: "What mechanism do shark gills use to maximize oxygen extraction?",
            options: [
                "Concurrent flow",
                "Counter-current exchange",
                "Active transport",
                "Osmosis"
            ],
            correct: 1,
            explanation: "In counter-current exchange, blood and water flow in opposite directions across the gills, ensuring a constant concentration gradient for optimal oxygen uptake.",
            difficulty: "Hard"
        },
        {
            question: "What role do the gill rakers play?",
            options: [
                "They extract oxygen from water.",
                "They protect the delicate filaments by preventing debris from passing through.",
                "They pump blood through the branchial arch.",
                "They produce mucus to trap oxygen."
            ],
            correct: 1,
            explanation: "Gill rakers project from the branchial arch and act as a filter, preventing food and debris from damaging the fragile respiratory surfaces.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle breathing motion: arch expansion
        const pulse = Math.sin(time * speed * 2) * 0.05;
        if (meshes['branchialArch']) {
            meshes['branchialArch'].scale.set(1 + pulse, 1 + pulse, 1 + pulse);
        }
        
        // Fluid ripple effect across lamellae
        for(let i = 0; i < 30; i++) {
            const lamella = meshes[`lamella_${i}`];
            if (lamella) {
                lamella.position.x = 2.5 + Math.sin(time * speed * 5 + i * 0.5) * 0.1;
                lamella.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5 + i * 0.5) * 0.5;
            }
        }

        // Slight movement of filaments
        for(let i = 0; i < 10; i++) {
            const filament = meshes[`filament_${i}`];
            if (filament) {
                filament.rotation.x = Math.sin(time * speed * 2 + i) * 0.05;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSharkGills() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
