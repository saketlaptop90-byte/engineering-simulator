import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const glowMyosin = new THREE.MeshStandardMaterial({ 
        color: 0xff0044, 
        emissive: 0xaa0022,
        emissiveIntensity: 0.8,
        metalness: 0.8, 
        roughness: 0.2 
    });
    
    const glowActin = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0044aa,
        emissiveIntensity: 0.6,
        metalness: 0.6, 
        roughness: 0.3 
    });

    const glowZDisc = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00cc44,
        emissiveIntensity: 0.5,
        metalness: 0.4,
        roughness: 0.5,
        wireframe: true
    });

    const glowATP = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1.5,
        metalness: 0.9,
        roughness: 0.1
    });

    const glowCalcium = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xcc00cc,
        emissiveIntensity: 1.2,
        metalness: 0.7,
        roughness: 0.2
    });

    // 1. Z-Discs (Boundary of Sarcomere)
    const zDiscGeometry = new THREE.CylinderGeometry(4, 4, 0.5, 32);
    
    const zDiscLeft = new THREE.Mesh(zDiscGeometry, glowZDisc);
    zDiscLeft.rotation.z = Math.PI / 2;
    zDiscLeft.position.set(-10, 0, 0);
    group.add(zDiscLeft);
    
    parts.push({
        name: "Left Z-Disc",
        description: "The structural boundary of the sarcomere, anchoring the actin filaments.",
        material: "glowing protein mesh",
        function: "Anchors thin filaments and transmits force.",
        assemblyOrder: 1,
        connections: ["Actin Filaments", "Right Z-Disc via Titin"],
        failureEffect: "Sarcomere loses structural integrity, muscle tearing.",
        cascadeFailures: ["Loss of force transmission", "Muscle fiber rupture"],
        originalPosition: { x: -10, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 },
        mesh: zDiscLeft
    });

    const zDiscRight = new THREE.Mesh(zDiscGeometry, glowZDisc);
    zDiscRight.rotation.z = Math.PI / 2;
    zDiscRight.position.set(10, 0, 0);
    group.add(zDiscRight);

    parts.push({
        name: "Right Z-Disc",
        description: "The opposite structural boundary of the sarcomere.",
        material: "glowing protein mesh",
        function: "Anchors thin filaments and transmits force.",
        assemblyOrder: 2,
        connections: ["Actin Filaments", "Left Z-Disc via Titin"],
        failureEffect: "Sarcomere loses structural integrity, muscle tearing.",
        cascadeFailures: ["Loss of force transmission", "Muscle fiber rupture"],
        originalPosition: { x: 10, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 0, z: 0 },
        mesh: zDiscRight
    });

    // 2. Thick Filaments (Myosin)
    const myosinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 12, 16);
    const myosinGroup = new THREE.Group();
    
    // Create multiple myosin filaments
    const myosinMeshes = [];
    for (let i = 0; i < 5; i++) {
        const yOffset = (i - 2) * 1.2;
        const myosin = new THREE.Mesh(myosinGeometry, glowMyosin);
        myosin.rotation.z = Math.PI / 2;
        myosin.position.set(0, yOffset, 0);
        
        // Add myosin heads
        const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
        for(let h=0; h<6; h++) {
            const head1 = new THREE.Mesh(headGeo, chrome);
            head1.position.set(-5 + h*2, 0.3, 0);
            myosin.add(head1);
            const head2 = new THREE.Mesh(headGeo, chrome);
            head2.position.set(-5 + h*2, -0.3, 0);
            myosin.add(head2);
        }

        myosinGroup.add(myosin);
        myosinMeshes.push(myosin);
    }
    group.add(myosinGroup);

    parts.push({
        name: "Myosin Thick Filaments",
        description: "Motor proteins that pull on actin filaments to contract the muscle.",
        material: "myosin heavy/light chains",
        function: "Generates mechanical force via ATP hydrolysis.",
        assemblyOrder: 3,
        connections: ["Actin via cross-bridges", "M-line"],
        failureEffect: "Inability to generate contractile force.",
        cascadeFailures: ["Muscle weakness", "Paralysis"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 5 },
        mesh: myosinGroup
    });

    // 3. Thin Filaments (Actin)
    const actinGeometry = new THREE.CylinderGeometry(0.15, 0.15, 8, 16);
    const actinLeftGroup = new THREE.Group();
    const actinRightGroup = new THREE.Group();
    
    for (let i = 0; i < 6; i++) {
        const yOffset = (i - 2.5) * 1.2;
        
        // Left actin
        const actinL = new THREE.Mesh(actinGeometry, glowActin);
        actinL.rotation.z = Math.PI / 2;
        actinL.position.set(-6, yOffset + 0.6, 0);
        actinLeftGroup.add(actinL);

        // Right actin
        const actinR = new THREE.Mesh(actinGeometry, glowActin);
        actinR.rotation.z = Math.PI / 2;
        actinR.position.set(6, yOffset + 0.6, 0);
        actinRightGroup.add(actinR);
    }
    
    group.add(actinLeftGroup);
    group.add(actinRightGroup);

    parts.push({
        name: "Actin Thin Filaments (Left)",
        description: "Filaments attached to the Z-disc that are pulled towards the M-line.",
        material: "g-actin polymers",
        function: "Provides binding sites for myosin heads.",
        assemblyOrder: 4,
        connections: ["Left Z-Disc", "Myosin"],
        failureEffect: "No framework for myosin to pull against.",
        cascadeFailures: ["Failure of contraction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: -5, z: 0 },
        mesh: actinLeftGroup
    });

    parts.push({
        name: "Actin Thin Filaments (Right)",
        description: "Filaments attached to the Z-disc that are pulled towards the M-line.",
        material: "g-actin polymers",
        function: "Provides binding sites for myosin heads.",
        assemblyOrder: 5,
        connections: ["Right Z-Disc", "Myosin"],
        failureEffect: "No framework for myosin to pull against.",
        cascadeFailures: ["Failure of contraction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 0 },
        mesh: actinRightGroup
    });

    // 4. ATP Energy Sparks (Particles)
    const atpGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const atpGroup = new THREE.Group();
    const atpParticles = [];
    for(let i=0; i<20; i++) {
        const atp = new THREE.Mesh(atpGeo, glowATP);
        atp.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*6, (Math.random()-0.5)*2);
        atpGroup.add(atp);
        atpParticles.push({
            mesh: atp,
            phase: Math.random() * Math.PI * 2,
            speed: 2 + Math.random() * 3
        });
    }
    group.add(atpGroup);

    parts.push({
        name: "ATP Molecules",
        description: "The energy currency powering the power stroke of myosin heads.",
        material: "adenosine triphosphate",
        function: "Provides energy to detach and reset myosin heads.",
        assemblyOrder: 6,
        connections: ["Myosin Heads"],
        failureEffect: "Rigor mortis - heads remain bound to actin.",
        cascadeFailures: ["Muscle stiffness", "Cellular energy depletion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: -5 },
        mesh: atpGroup
    });

    const description = "The Sarcomere is the fundamental contractile unit of striated muscle. It operates via the sliding filament theory, where myosin thick filaments pull actin thin filaments toward the center (M-line), shortening the sarcomere and generating muscle contraction. This process is highly dependent on calcium ions to expose binding sites and ATP to power the molecular motors.";

    const quizQuestions = [
        {
            question: "According to the sliding filament theory, what happens to the Z-discs during muscle contraction?",
            options: [
                "They move farther apart",
                "They dissolve",
                "They move closer together",
                "They remain perfectly stationary"
            ],
            correct: 2,
            explanation: "As myosin pulls actin toward the M-line, the actin filaments drag the Z-discs (to which they are anchored) closer together, shortening the entire sarcomere.",
            difficulty: "Medium"
        },
        {
            question: "What is the role of ATP in the sarcomere cycle?",
            options: [
                "It covers the binding sites on actin",
                "It binds to myosin to detach it from actin and provide energy for the next stroke",
                "It transports calcium out of the cell",
                "It anchors actin to the Z-disc"
            ],
            correct: 1,
            explanation: "ATP binding causes myosin to detach from actin. Its subsequent hydrolysis provides the energy to 'cock' the myosin head for the next power stroke.",
            difficulty: "Hard"
        },
        {
            question: "Which protein makes up the thick filaments?",
            options: [
                "Actin",
                "Troponin",
                "Myosin",
                "Tropomyosin"
            ],
            correct: 2,
            explanation: "Myosin is the motor protein that constitutes the thick filaments, featuring heads that bind to actin.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Contract/Relax cycle based on a sine wave
        const cycle = Math.sin(time * speed); // -1 to 1
        // Map to 0 to 1 for contraction percentage
        const contraction = (cycle + 1) / 2; 
        
        // Z-discs move in
        const zDisplacement = 2.5 * contraction;
        zDiscLeft.position.x = -10 + zDisplacement;
        zDiscRight.position.x = 10 - zDisplacement;
        
        // Actin filaments move in with Z-discs
        actinLeftGroup.position.x = zDisplacement;
        actinRightGroup.position.x = -zDisplacement;

        // Myosin subtle pulsing
        myosinGroup.scale.x = 1 + 0.02 * Math.sin(time * speed * 4);
        
        // ATP particles swarming around
        atpParticles.forEach(p => {
            p.mesh.position.y += Math.sin(time * p.speed + p.phase) * 0.05;
            p.mesh.position.x += Math.cos(time * p.speed + p.phase) * 0.05;
            p.mesh.material.emissiveIntensity = 1 + 0.5 * Math.sin(time * 10 + p.phase);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMuscleSarcomere() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
