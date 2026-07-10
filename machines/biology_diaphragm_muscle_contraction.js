import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for muscle and energy
    const activeMuscleMat = new THREE.MeshPhysicalMaterial({
        color: 0xff2244,
        emissive: 0xaa0011,
        emissiveIntensity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        roughness: 0.4,
        metalness: 0.1
    });

    const lungTissueMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaadd,
        emissive: 0x220011,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.85,
        transmission: 0.5,
        roughness: 0.3,
        side: THREE.DoubleSide
    });

    const airwayMat = new THREE.MeshPhysicalMaterial({
        color: 0xdddddd,
        clearcoat: 0.8,
        roughness: 0.5,
        metalness: 0.05
    });

    const ribCageMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x005555,
        transparent: true,
        opacity: 0.3,
        roughness: 0.6,
        wireframe: true // Stylized high-tech look
    });

    // 1. Thoracic Cavity (Stylized Rib Cage)
    const thoraxGeom = new THREE.CylinderGeometry(2, 3, 6, 16, 4, true);
    const thoraxMesh = new THREE.Mesh(thoraxGeom, ribCageMat);
    thoraxMesh.position.set(0, 3, 0);
    group.add(thoraxMesh);
    parts.push({
        name: "Thoracic Cavity",
        description: "The chamber enclosed by the rib cage that houses the lungs and heart. Designed here as a high-tech holographic wireframe.",
        material: "Neon Wireframe Matrix",
        function: "Maintains a vacuum seal and protects vital organs; expands to reduce internal pressure.",
        assemblyOrder: 1,
        connections: ["Lungs", "Diaphragm"],
        failureEffect: "Pneumothorax (collapsed lung) due to loss of negative pressure.",
        cascadeFailures: ["Respiratory failure", "Hypoxia"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 5 },
        mesh: thoraxMesh
    });

    // 2. Diaphragm Muscle
    // A dome shape that flattens. We will represent it with a hemisphere.
    const diaphragmGeom = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeom, activeMuscleMat);
    diaphragmMesh.position.set(0, 0, 0);
    diaphragmMesh.scale.set(1, 0.4, 1); // Flattened sphere creates a dome
    group.add(diaphragmMesh);
    parts.push({
        name: "Diaphragm Muscle",
        description: "A sheet of internal skeletal muscle that extends across the bottom of the thoracic cavity.",
        material: "Active Bioluminescent Tissue",
        function: "Contracts (flattens) to increase thoracic volume, decreasing pressure and drawing air into lungs.",
        assemblyOrder: 2,
        connections: ["Thoracic Cavity", "Central Tendon"],
        failureEffect: "Inability to breathe independently (diaphragmatic paralysis).",
        cascadeFailures: ["Ventilatory failure", "Asphyxiation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: diaphragmMesh
    });

    // 3. Central Tendon
    const tendonGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const tendonMesh = new THREE.Mesh(tendonGeom, rubber);
    tendonMesh.position.set(0, 1.2, 0); // Sits at the top of the dome
    group.add(tendonMesh);
    parts.push({
        name: "Central Tendon",
        description: "The strong aponeurosis in the center of the diaphragm.",
        material: "Elastic Rubber/Collagen",
        function: "Serves as the insertion point for the muscle fibers of the diaphragm.",
        assemblyOrder: 3,
        connections: ["Diaphragm Muscle", "Pericardium"],
        failureEffect: "Loss of diaphragm mechanical advantage.",
        cascadeFailures: ["Reduced lung capacity"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: tendonMesh
    });

    // 4. Lungs (Left and Right)
    const lungGeom = new THREE.SphereGeometry(1.2, 32, 32);
    
    // Left Lung
    const leftLung = new THREE.Mesh(lungGeom, lungTissueMat);
    leftLung.position.set(-1.2, 3.5, 0);
    leftLung.scale.set(1, 1.8, 1);
    group.add(leftLung);
    parts.push({
        name: "Left Lung",
        description: "The respiratory organ on the left side, slightly smaller to accommodate the heart.",
        material: "Translucent Pink Plasma",
        function: "Facilitates gas exchange (oxygen in, carbon dioxide out).",
        assemblyOrder: 4,
        connections: ["Trachea", "Left Bronchus"],
        failureEffect: "Hypoxia and hypercapnia.",
        cascadeFailures: ["Organ failure", "Acidosis"],
        originalPosition: { x: -1.2, y: 3.5, z: 0 },
        explodedPosition: { x: -4, y: 3.5, z: 0 },
        mesh: leftLung
    });

    // Right Lung
    const rightLung = new THREE.Mesh(lungGeom, lungTissueMat);
    rightLung.position.set(1.2, 3.5, 0);
    rightLung.scale.set(1, 1.8, 1);
    group.add(rightLung);
    parts.push({
        name: "Right Lung",
        description: "The respiratory organ on the right side, larger and with three lobes.",
        material: "Translucent Pink Plasma",
        function: "Facilitates gas exchange.",
        assemblyOrder: 5,
        connections: ["Trachea", "Right Bronchus"],
        failureEffect: "Hypoxia and hypercapnia.",
        cascadeFailures: ["Organ failure", "Acidosis"],
        originalPosition: { x: 1.2, y: 3.5, z: 0 },
        explodedPosition: { x: 4, y: 3.5, z: 0 },
        mesh: rightLung
    });

    // 5. Trachea & Airway
    const tracheaGeom = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 16);
    const tracheaMesh = new THREE.Mesh(tracheaGeom, airwayMat);
    tracheaMesh.position.set(0, 6.5, 0);
    group.add(tracheaMesh);
    parts.push({
        name: "Trachea (Windpipe)",
        description: "A cartilaginous tube connecting the larynx to the bronchi.",
        material: "Composite Smooth Cartilage",
        function: "Provides air flow to and from the lungs.",
        assemblyOrder: 6,
        connections: ["Lungs", "External Environment"],
        failureEffect: "Airway obstruction.",
        cascadeFailures: ["Immediate asphyxia"],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: tracheaMesh
    });

    // 6. Alveoli / Energy Particles (Representing O2 exchange)
    const particleCount = 60;
    const particleGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(particleGeom, particleMat);
        p.position.set(
            (Math.random() - 0.5) * 3,
            3 + (Math.random() * 3),
            (Math.random() - 0.5) * 2
        );
        p.userData = {
            baseY: p.position.y,
            phase: Math.random() * Math.PI * 2,
            speedOffset: Math.random() * 0.5 + 0.5
        };
        group.add(p);
        particles.push(p);
    }

    const description = "The Diaphragm Muscle Contraction model demonstrates the biomechanical process of breathing. When the diaphragm muscle contracts, it flattens downwards, increasing the volume of the thoracic cavity. This creates negative pressure, drawing air down the trachea and inflating the lungs. Our high-tech visualization uses glowing bioluminescent tissues and neon wireframes to highlight mechanical functions.";

    const quizQuestions = [
        {
            question: "What happens to thoracic pressure when the diaphragm contracts?",
            options: [
                "It increases significantly",
                "It decreases, creating negative pressure",
                "It remains completely static",
                "It fluctuates rapidly"
            ],
            correct: 1,
            explanation: "When the diaphragm contracts and flattens, thoracic volume increases. According to Boyle's law, an increase in volume leads to a decrease in pressure, creating the negative pressure that draws air into the lungs.",
            difficulty: "Medium"
        },
        {
            question: "During exhalation (relaxation of the diaphragm), what is the shape of the diaphragm?",
            options: [
                "Flat",
                "Concave",
                "Dome-shaped",
                "Spherical"
            ],
            correct: 2,
            explanation: "In its relaxed state, the diaphragm rests in a dome shape curving up into the thoracic cavity.",
            difficulty: "Easy"
        },
        {
            question: "What physical law primarily governs pulmonary ventilation as demonstrated by the diaphragm's movement?",
            options: [
                "Newton's Third Law",
                "Boyle's Law",
                "Bernoulli's Principle",
                "Ohm's Law"
            ],
            correct: 1,
            explanation: "Boyle's Law states that pressure and volume are inversely related. Expanding the thoracic cavity volume decreases the pressure, allowing air to flow in.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Breathing cycle: a smooth sine wave
        // Math.sin(time) goes from -1 to 1.
        const cycle = Math.sin(time * speed * 2);
        
        // Contraction parameter (0 = relaxed/exhale, 1 = contracted/inhale)
        const contraction = (cycle + 1) / 2;

        const diaphragmMesh = meshes.find(p => p.name === "Diaphragm Muscle")?.mesh;
        const tendonMesh = meshes.find(p => p.name === "Central Tendon")?.mesh;
        const leftLung = meshes.find(p => p.name === "Left Lung")?.mesh;
        const rightLung = meshes.find(p => p.name === "Right Lung")?.mesh;
        const thoraxMesh = meshes.find(p => p.name === "Thoracic Cavity")?.mesh;

        if (diaphragmMesh) {
            // Flattens out and moves down when contracted
            diaphragmMesh.scale.y = 0.4 - (contraction * 0.25);
            diaphragmMesh.position.y = 0 - (contraction * 0.5);
            
            // Emissive intensity flares up during active contraction
            activeMuscleMat.emissiveIntensity = 0.5 + (contraction * 1.5);
        }

        if (tendonMesh) {
            tendonMesh.position.y = 1.2 - (contraction * 1.25); // moves down with diaphragm
        }

        if (leftLung && rightLung) {
            // Lungs expand as diaphragm contracts
            const lungScaleX = 1 + (contraction * 0.2);
            const lungScaleY = 1.8 + (contraction * 0.4);
            const lungScaleZ = 1 + (contraction * 0.2);
            leftLung.scale.set(lungScaleX, lungScaleY, lungScaleZ);
            rightLung.scale.set(lungScaleX, lungScaleY, lungScaleZ);
            
            // Lungs move down slightly
            const lungY = 3.5 - (contraction * 0.2);
            leftLung.position.y = lungY;
            rightLung.position.y = lungY;
            
            lungTissueMat.emissiveIntensity = 0.1 + (contraction * 0.3);
        }

        if (thoraxMesh) {
            // Rib cage expands slightly during inhalation
            const thoraxScale = 1 + (contraction * 0.05);
            thoraxMesh.scale.set(thoraxScale, thoraxScale, thoraxScale);
        }

        // Particle animation (air/O2 moving)
        const inhaleVelocity = -speed * 4;
        const exhaleVelocity = speed * 4;

        particles.forEach(p => {
            const v = (contraction > 0.5) ? inhaleVelocity : exhaleVelocity;
            p.position.y += v * p.userData.speedOffset;
            
            if (p.position.y < 2) p.position.y = 7;
            if (p.position.y > 7) p.position.y = 2;
            
            // Pulse particles slightly
            const s = 1 + Math.sin(time * 10 + p.userData.phase) * 0.2;
            p.scale.set(s, s, s);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDiaphragm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
