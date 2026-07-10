import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Define custom glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 1.0,
        metalness: 0.3,
        roughness: 0.1
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xa020f0,
        emissive: 0x6a0dad,
        emissiveIntensity: 0.7,
        metalness: 0.2,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
    });

    const pathogenMembraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        emissive: 0x110000,
        roughness: 0.8,
        metalness: 0.1,
        clearcoat: 0.1,
        transparent: true,
        opacity: 0.85
    });

    // 1. Pathogen Cell Surface
    const pathogenGeometry = new THREE.SphereGeometry(15, 64, 64);
    const pathogen = new THREE.Mesh(pathogenGeometry, pathogenMembraneMaterial);
    pathogen.position.set(0, -12, 0);
    group.add(pathogen);
    parts.push({
        name: "Pathogen Membrane",
        description: "The lipid bilayer of the target pathogen cell.",
        material: "PathogenMembrane",
        function: "Target surface for complement deposition and MAC pore formation.",
        assemblyOrder: 1,
        connections: ["C3b", "MAC Pore"],
        failureEffect: "Pathogen evades destruction",
        cascadeFailures: ["Infection spreads"],
        originalPosition: {x: 0, y: -12, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 2. C3b Opsonins (initiators)
    const c3bGeometry = new THREE.TetrahedronGeometry(1.5, 2);
    for (let i = 0; i < 5; i++) {
        const c3b = new THREE.Mesh(c3bGeometry, neonCyan);
        const angle = (i / 5) * Math.PI * 2;
        const radius = 6;
        c3b.position.set(Math.cos(angle) * radius, 2, Math.sin(angle) * radius);
        c3b.userData = { phase: Math.random() * Math.PI * 2, radius: radius, angle: angle };
        c3b.name = `C3b_${i}`;
        group.add(c3b);
    }
    parts.push({
        name: "C3b Opsonin",
        description: "Activated C3 fragment covalently bound to the pathogen surface.",
        material: "NeonCyan",
        function: "Tags the pathogen for phagocytosis and acts as a nucleus for MAC assembly.",
        assemblyOrder: 2,
        connections: ["Pathogen Membrane", "C5b"],
        failureEffect: "Opsonization fails, MAC cannot form",
        cascadeFailures: ["No MAC assembly", "No C5 convertase"],
        originalPosition: {x: 0, y: 2, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // 3. Membrane Attack Complex (MAC) - C5b-8 Complex
    const c5b8Geometry = new THREE.TorusGeometry(3, 0.8, 16, 32);
    const c5b8 = new THREE.Mesh(c5b8Geometry, neonPurple);
    c5b8.position.set(0, 3, 0);
    c5b8.rotation.x = Math.PI / 2;
    group.add(c5b8);
    parts.push({
        name: "C5b-8 Complex",
        description: "Intermediate complex that inserts slightly into the membrane.",
        material: "NeonPurple",
        function: "Provides the binding site for multiple C9 molecules to polymerize.",
        assemblyOrder: 3,
        connections: ["C3b", "C9 Polymer"],
        failureEffect: "Pore cannot complete",
        cascadeFailures: ["No cytolysis"],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 4. Poly-C9 (The Pore)
    const poreRadius = 2.8;
    const poreHeight = 5;
    const c9Count = 14;
    const c9Geometry = new THREE.CylinderGeometry(0.3, 0.3, poreHeight, 16);
    
    const polyC9Group = new THREE.Group();
    polyC9Group.position.set(0, 1.5, 0);

    for (let i = 0; i < c9Count; i++) {
        const c9 = new THREE.Mesh(c9Geometry, neonRed);
        const angle = (i / c9Count) * Math.PI * 2;
        c9.position.set(Math.cos(angle) * poreRadius, 0, Math.sin(angle) * poreRadius);
        // Tilt slightly
        c9.rotation.x = -Math.sin(angle) * 0.1;
        c9.rotation.z = Math.cos(angle) * 0.1;
        polyC9Group.add(c9);
    }
    group.add(polyC9Group);
    parts.push({
        name: "Poly-C9 Complex",
        description: "Polymerized C9 molecules forming a transmembrane channel.",
        material: "NeonRed",
        function: "Ruptures the cell membrane by allowing free flow of water and ions, causing osmotic lysis.",
        assemblyOrder: 4,
        connections: ["C5b-8 Complex", "Pathogen Membrane"],
        failureEffect: "Incomplete pore, cell survives",
        cascadeFailures: ["No cell death"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 25, z: 0}
    });

    // 5. Osmotic Fluid/Ions flowing through the pore
    const fluidParticles = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
    for(let i=0; i<30; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.userData = {
            phase: Math.random(),
            speed: 0.05 + Math.random() * 0.05,
            x: (Math.random() - 0.5) * 3,
            z: (Math.random() - 0.5) * 3
        };
        p.position.set(p.userData.x, 5 * p.userData.phase, p.userData.z);
        fluidParticles.add(p);
    }
    fluidParticles.position.set(0, 0, 0);
    group.add(fluidParticles);

    parts.push({
        name: "Osmotic Flow",
        description: "Ions and water rushing into the pathogen.",
        material: "LightBlueFluid",
        function: "Causes cell swelling and lysis.",
        assemblyOrder: 5,
        connections: ["Poly-C9 Complex"],
        failureEffect: "No lysis",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 10, z: 10}
    });

    const description = "The Membrane Attack Complex (MAC) is the final stage of the complement system. It assembles on the surface of pathogen cells to form a transmembrane pore. This pore disrupts the lipid bilayer, leading to massive influx of water and ions, culminating in osmotic lysis (bursting) of the target cell.";

    const quizQuestions = [
        {
            question: "Which complement protein polymerizes to form the structural ring of the MAC pore?",
            options: ["C3b", "C5a", "C9", "C8"],
            correct: 2,
            explanation: "Multiple C9 molecules polymerize into a ring structure to form the actual transmembrane channel of the MAC.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary mechanism of cell death caused by the MAC?",
            options: ["DNA degradation", "Osmotic lysis", "Protein denaturation", "Apoptosis"],
            correct: 1,
            explanation: "The pore formed by the MAC destroys membrane integrity, allowing unchecked fluid influx and resulting in osmotic lysis.",
            difficulty: "Easy"
        },
        {
            question: "Which complex provides the initial anchor point for C9 polymerization?",
            options: ["C3 convertase", "C5b-8", "C1qrs", "MBL"],
            correct: 1,
            explanation: "The C5b-8 complex partially inserts into the membrane and acts as the receptor and nucleating site for C9 polymerization.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Find specific components in meshes or group
        group.children.forEach(child => {
            if (child.name && child.name.startsWith('C3b_')) {
                // Bobbing and rotating
                const ud = child.userData;
                child.position.y = 2 + Math.sin(time * speed * 2 + ud.phase) * 0.5;
                child.rotation.x += 0.02 * speed;
                child.rotation.y += 0.03 * speed;
            }
        });

        // Pulsate the C5b-8 complex
        if(c5b8) {
            const scale = 1 + Math.sin(time * speed * 3) * 0.05;
            c5b8.scale.set(scale, scale, scale);
            neonPurple.emissiveIntensity = 0.5 + Math.sin(time * speed * 3) * 0.5;
        }

        // Animate poly-C9 building / rotating slightly
        if (polyC9Group) {
            polyC9Group.rotation.y = time * speed * 0.2;
        }

        // Animate fluid particles
        if (fluidParticles) {
            fluidParticles.children.forEach(p => {
                p.position.y -= p.userData.speed * speed * 5;
                if (p.position.y < -5) {
                    p.position.y = 5;
                    p.position.x = (Math.random() - 0.5) * 4;
                    p.position.z = (Math.random() - 0.5) * 4;
                }
            });
        }
        
        // Pathogen breathing effect
        if (pathogen) {
            const pathScale = 1 + Math.sin(time * speed) * 0.01;
            pathogen.scale.set(pathScale, pathScale, pathScale);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createComplementSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
