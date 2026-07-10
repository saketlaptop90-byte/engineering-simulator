import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8,
    });

    const ionBeamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
    });

    // 1. Base / Casing
    const baseGeo = new THREE.BoxGeometry(10, 1, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: "Main Housing Chassis",
        description: "Heavy-duty shielding to protect internal components from external electromagnetic interference and maintain vacuum.",
        material: "darkSteel",
        function: "Structural support and electromagnetic shielding.",
        assemblyOrder: 1,
        connections: ["Ion Source", "Mass Analyzer", "Detector"],
        failureEffect: "Loss of vacuum leading to signal attenuation.",
        cascadeFailures: ["Ion Source", "Detector"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 2. Ion Source (ESI / MALDI)
    const ionSourceGeo = new THREE.CylinderGeometry(0.8, 1.2, 2, 32);
    const ionSourceMesh = new THREE.Mesh(ionSourceGeo, chrome);
    ionSourceMesh.position.set(-3.5, 1, 0);
    ionSourceMesh.rotation.z = Math.PI / 2;
    group.add(ionSourceMesh);
    
    const ionSourceGlowGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
    const ionSourceGlowMesh = new THREE.Mesh(ionSourceGlowGeo, neonPurple);
    ionSourceGlowMesh.position.set(-4.5, 1, 0);
    ionSourceGlowMesh.rotation.y = Math.PI / 2;
    group.add(ionSourceGlowMesh);

    parts.push({
        name: "Electrospray Ionization (ESI) Source",
        description: "Vaporizes and ionizes sample molecules, converting them into gas-phase ions.",
        material: "chrome / neonPurple",
        function: "Ion production via high voltage applied to a liquid stream.",
        assemblyOrder: 2,
        connections: ["Main Housing Chassis", "Ion Optics"],
        failureEffect: "No ions generated; zero signal.",
        cascadeFailures: [],
        originalPosition: { x: -3.5, y: 1, z: 0 },
        explodedPosition: { x: -6, y: 3, z: 0 },
        mesh: ionSourceMesh
    });

    // 3. Ion Optics / Lenses
    const opticsGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const opticsMesh = new THREE.Mesh(opticsGeo, copper);
    opticsMesh.position.set(-2, 1, 0);
    opticsMesh.rotation.z = Math.PI / 2;
    group.add(opticsMesh);

    parts.push({
        name: "Ion Focusing Optics",
        description: "A series of electrostatic lenses that collimate and accelerate the ion beam into the mass analyzer.",
        material: "copper",
        function: "Focusing and acceleration of ions.",
        assemblyOrder: 3,
        connections: ["ESI Source", "Quadrupole Mass Filter"],
        failureEffect: "Poor ion transmission and loss of sensitivity.",
        cascadeFailures: [],
        originalPosition: { x: -2, y: 1, z: 0 },
        explodedPosition: { x: -3, y: 4, z: -2 },
        mesh: opticsMesh
    });

    // 4. Quadrupole Mass Analyzer
    const quadGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
        const rodMesh = new THREE.Mesh(rodGeo, aluminum);
        const angle = (i * Math.PI) / 2 + Math.PI/4;
        rodMesh.position.set(0, Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
        rodMesh.rotation.z = Math.PI / 2;
        quadGroup.add(rodMesh);
    }
    
    // Glowing center for quadrupole
    const quadGlowGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const quadGlowMesh = new THREE.Mesh(quadGlowGeo, neonBlue);
    quadGlowMesh.rotation.z = Math.PI / 2;
    quadGroup.add(quadGlowMesh);

    quadGroup.position.set(0.5, 1, 0);
    group.add(quadGroup);

    parts.push({
        name: "Quadrupole Mass Filter",
        description: "Four parallel cylindrical rods that apply oscillating RF and DC voltages to filter ions by mass-to-charge (m/z) ratio.",
        material: "aluminum / neonBlue",
        function: "Mass selection and filtering.",
        assemblyOrder: 4,
        connections: ["Ion Optics", "Collision Cell"],
        failureEffect: "Loss of mass resolution; spectral noise.",
        cascadeFailures: ["Detector Signal"],
        originalPosition: { x: 0.5, y: 1, z: 0 },
        explodedPosition: { x: 0.5, y: 5, z: 0 },
        mesh: quadGroup
    });

    // 5. Collision Cell (for MS/MS)
    const collisionGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const collisionMesh = new THREE.Mesh(collisionGeo, steel);
    collisionMesh.position.set(2.5, 1, 0);
    collisionMesh.rotation.z = Math.PI / 2;
    group.add(collisionMesh);
    
    const hexGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const hexRodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16);
        const hexRodMesh = new THREE.Mesh(hexRodGeo, glowingGreen);
        const angle = (i * Math.PI) / 3;
        hexRodMesh.position.set(0, Math.cos(angle) * 0.4, Math.sin(angle) * 0.4);
        hexRodMesh.rotation.z = Math.PI / 2;
        hexGroup.add(hexRodMesh);
    }
    hexGroup.position.set(2.5, 1, 0);
    group.add(hexGroup);

    parts.push({
        name: "Hexapole Collision Cell",
        description: "A chamber filled with neutral gas (e.g., Argon) where selected ions undergo collision-induced dissociation (CID).",
        material: "steel / glowingGreen",
        function: "Fragmentation of precursor ions for structural analysis.",
        assemblyOrder: 5,
        connections: ["Quadrupole Mass Filter", "Detector"],
        failureEffect: "No fragmentation; inability to perform MS/MS.",
        cascadeFailures: [],
        originalPosition: { x: 2.5, y: 1, z: 0 },
        explodedPosition: { x: 2.5, y: 6, z: 2 },
        mesh: collisionMesh
    });

    // 6. Time-of-Flight (TOF) Tube / Detector Tube
    const tofGeo = new THREE.CylinderGeometry(0.8, 1, 4, 32);
    const tofMesh = new THREE.Mesh(tofGeo, chrome);
    tofMesh.position.set(4, 3, 0);
    group.add(tofMesh);

    parts.push({
        name: "Time-of-Flight (TOF) Flight Tube",
        description: "A high-vacuum field-free region where accelerated ions drift. Lighter ions arrive at the detector faster than heavier ones.",
        material: "chrome",
        function: "Ion separation by velocity (m/z).",
        assemblyOrder: 6,
        connections: ["Collision Cell", "Electron Multiplier Detector"],
        failureEffect: "Peak broadening and loss of mass accuracy.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: 3, z: 0 },
        explodedPosition: { x: 6, y: 7, z: -2 },
        mesh: tofMesh
    });

    // 7. Detector (Electron Multiplier)
    const detectorGeo = new THREE.CylinderGeometry(1.2, 0.5, 1, 32);
    const detectorMesh = new THREE.Mesh(detectorGeo, darkSteel);
    detectorMesh.position.set(4, 5.5, 0);
    group.add(detectorMesh);

    const detectorGlowGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const detectorGlowMesh = new THREE.Mesh(detectorGlowGeo, neonBlue);
    detectorGlowMesh.position.set(4, 5.5, 0);
    group.add(detectorGlowMesh);

    parts.push({
        name: "Electron Multiplier Detector",
        description: "Converts ion impacts into an amplified cascade of electrons, producing a measurable electrical signal.",
        material: "darkSteel / neonBlue",
        function: "Ion detection and signal amplification.",
        assemblyOrder: 7,
        connections: ["TOF Flight Tube", "Data System"],
        failureEffect: "No signal detection.",
        cascadeFailures: [],
        originalPosition: { x: 4, y: 5.5, z: 0 },
        explodedPosition: { x: 6, y: 10, z: 0 },
        mesh: detectorMesh
    });

    // 8. Ion Trajectories (Animated Particles)
    const particleCount = 100;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++){
        particlePositions[i*3] = -5; // start x
        particlePositions[i*3+1] = 1; // start y
        particlePositions[i*3+2] = 0; // start z
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMesh = new THREE.Points(particlesGeo, new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    }));
    group.add(particlesMesh);

    const description = "The Mass Spectrometer is an advanced analytical instrument used to measure the mass-to-charge ratio (m/z) of ions. This hybrid Quadrupole-TOF system provides extremely high resolution and mass accuracy, crucial in proteomics, metabolomics, and drug discovery.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Electrospray Ionization (ESI) source?",
            options: [
                "To separate ions based on their m/z ratio",
                "To amplify the ion signal for the detector",
                "To vaporize and ionize sample molecules into gas-phase ions",
                "To fragment precursor ions into product ions"
            ],
            correct: 2,
            explanation: "The ESI source uses high voltage to create an aerosol of charged droplets, which evaporate to leave gas-phase ions ready for mass analysis.",
            difficulty: "Medium"
        },
        {
            question: "How does a Quadrupole mass filter select specific ions?",
            options: [
                "By measuring their time of flight through a tube",
                "By applying oscillating RF and DC voltages to four parallel rods",
                "By colliding them with inert gas molecules",
                "By using a strong magnetic field to bend their trajectory"
            ],
            correct: 1,
            explanation: "A quadrupole uses specific combinations of radio frequency (RF) and direct current (DC) voltages to create stable trajectories only for ions with a specific m/z ratio.",
            difficulty: "Hard"
        },
        {
            question: "In a Time-of-Flight (TOF) analyzer, which ions reach the detector first?",
            options: [
                "Heavier ions",
                "Lighter ions",
                "Highly charged heavy ions",
                "Ions with larger collision cross-sections"
            ],
            correct: 1,
            explanation: "In a TOF tube, all ions receive the same kinetic energy. Since Kinetic Energy = 1/2 * mv^2, lighter ions (lower mass) will have a higher velocity and thus reach the detector first.",
            difficulty: "Medium"
        },
        {
            question: "What happens in the collision cell during MS/MS (tandem mass spectrometry)?",
            options: [
                "Ions are detected and counted",
                "Selected precursor ions collide with neutral gas to undergo fragmentation",
                "Liquid samples are vaporized",
                "The vacuum is maintained by turbomolecular pumps"
            ],
            correct: 1,
            explanation: "The collision cell introduces a neutral gas (like argon or nitrogen) which collides with selected ions, transferring kinetic energy into internal vibrational energy, causing them to break into fragments (Collision-Induced Dissociation).",
            difficulty: "Hard"
        }
    ];

    // Animation function
    function animate(time, speed, meshes) {
        // Rotate quad glow and rods
        if (quadGroup) {
            quadGroup.children[4].rotation.x = time * speed * 2; // the glow cylinder
        }
        
        // Pulse ion source glow
        if (ionSourceGlowMesh) {
            const scale = 1 + Math.sin(time * speed * 5) * 0.1;
            ionSourceGlowMesh.scale.set(scale, scale, scale);
            ionSourceGlowMesh.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
        }

        // Pulse collision cell hexapole
        if (hexGroup) {
            hexGroup.rotation.x = time * speed;
        }
        
        // Detector pulse
        if (detectorGlowMesh) {
            detectorGlowMesh.material.emissiveIntensity = Math.random() * 0.5 + 0.5;
        }

        // Animate particles (Ion trajectories)
        const positions = particlesMesh.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            let x = positions[i * 3];
            let y = positions[i * 3 + 1];
            let z = positions[i * 3 + 2];

            // Path: -5(x) to 2.5(x) at y=1 -> up to 5.5(y) at x=4
            if (x < -3.5) {
                x += speed * 2 * Math.random();
                y = 1 + (Math.random() - 0.5) * 0.2;
                z = (Math.random() - 0.5) * 0.2;
            } else if (x < 2.5) {
                x += speed * 5;
                y = 1 + (Math.random() - 0.5) * 0.1;
                z = (Math.random() - 0.5) * 0.1;
            } else if (y < 5.5) {
                // Curving up into TOF
                const progress = (y - 1) / 4.5; // 0 to 1
                y += speed * 5;
                x = 2.5 + 1.5 * progress; 
                z = (Math.random() - 0.5) * 0.2;
            } else {
                // Reset
                x = -5 - Math.random();
                y = 1;
                z = 0;
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMassSpectrometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
