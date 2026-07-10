import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    const rotorGroup = new THREE.Group();
    const statorGroup = new THREE.Group();
    const casingOuterGroup = new THREE.Group();

    // Custom Glowing Materials for High-Tech Vibe
    const magnetMaterial = new THREE.MeshStandardMaterial({
        color: 0x6688ff,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x001144,
        emissiveIntensity: 0.8
    });

    const coilMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.5, roughness: 0.5, emissive: 0xff0044, emissiveIntensity: 0 }),
        new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.5, roughness: 0.5, emissive: 0x44ff00, emissiveIntensity: 0 }),
        new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.5, roughness: 0.5, emissive: 0x0044ff, emissiveIntensity: 0 })
    ];

    // Helpers
    function createHollowCylinder(outerRadius, innerRadius, depth) {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
        const hole = new THREE.Path();
        hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        shape.holes.push(hole);
        const geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false, curveSegments: 64 });
        geo.center();
        geo.rotateY(Math.PI / 2);
        return geo;
    }

    // --- 1. Rotor Assembly ---
    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 32);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    rotorGroup.add(shaftMesh);

    // Rotor Core
    const rotorCoreGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 64);
    rotorCoreGeo.rotateZ(Math.PI / 2);
    const rotorCoreMesh = new THREE.Mesh(rotorCoreGeo, darkSteel);
    rotorGroup.add(rotorCoreMesh);

    // Neodymium Magnets
    const numMagnets = 8;
    const magnetGeo = new THREE.BoxGeometry(3.2, 0.2, 0.5);
    for (let i = 0; i < numMagnets; i++) {
        const angle = (i / numMagnets) * Math.PI * 2;
        const mag = new THREE.Mesh(magnetGeo, magnetMaterial);
        mag.position.set(0, Math.cos(angle) * 0.82, Math.sin(angle) * 0.82);
        mag.rotation.x = -angle;
        rotorGroup.add(mag);
    }
    
    group.add(rotorGroup);

    parts.push({
        name: "Rotor Assembly",
        description: "The rotating core containing the central shaft and permanent neodymium magnets. It is driven by the stator's alternating magnetic field.",
        material: "Chrome, Dark Steel & Neodymium",
        function: "Converts electromagnetic forces into physical rotation.",
        assemblyOrder: 1,
        connections: ["Front Bearing", "Rear Bearing", "Motor Load"],
        failureEffect: "Motor stalling, vibration, or loss of torque.",
        cascadeFailures: ["Bearing Failure", "Overheating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // --- 2. Stator Assembly ---
    const statorGeo = createHollowCylinder(1.5, 1.05, 3.0);
    const statorMesh = new THREE.Mesh(statorGeo, steel);
    statorGroup.add(statorMesh);

    const numSlots = 12;
    const toothGeo = new THREE.BoxGeometry(3.0, 0.45, 0.35);
    for (let i = 0; i < numSlots; i++) {
        const phase = i % 3;
        const angle = (i / numSlots) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo, coilMaterials[phase]);
        // Position them pointing inwards
        tooth.position.set(0, Math.cos(angle) * 1.25, Math.sin(angle) * 1.25);
        tooth.rotation.x = -angle;
        statorGroup.add(tooth);
    }

    group.add(statorGroup);

    parts.push({
        name: "Stator Assembly",
        description: "The stationary outer ring holding multi-phase copper electromagnet coils. High-tech sensors pulse these to create a rotating magnetic vortex.",
        material: "Steel Core & Neon-infused Copper Windings",
        function: "Generates a highly-controlled rotating magnetic field.",
        assemblyOrder: 2,
        connections: ["Motor Casing", "Electronic Speed Controller (ESC)"],
        failureEffect: "Short circuit, winding burnout, or complete motor failure.",
        cascadeFailures: ["ESC Burnout", "Thermal Runaway"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // --- 3. Motor Casing ---
    const casingGeo = createHollowCylinder(1.7, 1.5, 4.0);
    const casingMesh = new THREE.Mesh(casingGeo, aluminum);
    casingOuterGroup.add(casingMesh);
    
    // Cooling Fins
    const finGeo = new THREE.BoxGeometry(3.8, 0.2, 4.2);
    for(let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(0, Math.cos(angle) * 1.7, Math.sin(angle) * 1.7);
        fin.rotation.x = -angle;
        casingOuterGroup.add(fin);
    }

    group.add(casingOuterGroup);

    parts.push({
        name: "Motor Casing & Cooling Fins",
        description: "A precision-machined aluminum shell that protects internal components and features aerodynamic fins for aggressive heat dissipation.",
        material: "Aerospace Aluminum",
        function: "Structural integrity and thermal management.",
        assemblyOrder: 3,
        connections: ["Stator", "Front Endbell", "Rear Endbell"],
        failureEffect: "Internal components exposed to debris; overheating.",
        cascadeFailures: ["Stator Meltdown", "Magnet Demagnetization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // --- 4. Endbells & Bearings ---
    const endbellGroup = new THREE.Group();
    const endbellGeo = createHollowCylinder(1.7, 0.3, 0.4);
    
    const frontEndbell = new THREE.Mesh(endbellGeo, darkSteel);
    frontEndbell.position.set(-2.0, 0, 0);
    const rearEndbell = new THREE.Mesh(endbellGeo, darkSteel);
    rearEndbell.position.set(2.0, 0, 0);

    const bearingGeo = createHollowCylinder(0.4, 0.2, 0.3);
    const frontBearing = new THREE.Mesh(bearingGeo, steel);
    frontBearing.position.set(-2.0, 0, 0);
    const rearBearing = new THREE.Mesh(bearingGeo, steel);
    rearBearing.position.set(2.0, 0, 0);

    endbellGroup.add(frontEndbell, rearEndbell, frontBearing, rearBearing);
    group.add(endbellGroup);

    parts.push({
        name: "Endbells & Bearings",
        description: "Heavy-duty caps sealing the casing, holding ultra-low friction ball bearings to keep the rotor perfectly aligned.",
        material: "Dark Steel & Bearing Steel",
        function: "Reduces rotational friction and aligns the shaft.",
        assemblyOrder: 4,
        connections: ["Casing", "Shaft"],
        failureEffect: "Grinding noises, increased friction, shaft misalignment.",
        cascadeFailures: ["Rotor Strike against Stator", "Complete Lockup"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 }
    });

    const quizQuestions = [
        {
            question: "What is the main advantage of a BLDC motor over a brushed DC motor?",
            options: [
                "It runs purely on static electricity.",
                "It eliminates mechanical brushes, greatly reducing wear and maintenance.",
                "It operates without a magnetic field.",
                "It uses heavy lead cores instead of steel."
            ],
            correct: 1,
            explanation: "BLDC motors use an Electronic Speed Controller (ESC) for commutation instead of physical brushes rubbing against a commutator, leading to longer lifespan and higher efficiency.",
            difficulty: "Easy"
        },
        {
            question: "Which component in the BLDC motor is responsible for generating the rotating magnetic field?",
            options: [
                "The Neodymium Magnets on the Rotor",
                "The Cooling Fins on the Casing",
                "The Electromagnet Coils on the Stator",
                "The Low-Friction Bearings"
            ],
            correct: 2,
            explanation: "The stator consists of coils of copper wire that act as electromagnets. When energized in a specific sequence, they create a magnetic field that rotates, pulling the rotor along.",
            difficulty: "Medium"
        },
        {
            question: "Why does the stator pulse in different phases (e.g., Phase A, B, and C)?",
            options: [
                "To ensure the motor casing stays cold.",
                "To create a continuous pushing and pulling force on the rotor's permanent magnets.",
                "Because continuous current would demagnetize the neodymium.",
                "To generate colorful lights for aesthetics."
            ],
            correct: 1,
            explanation: "By alternating the polarity and energizing different phases sequentially, the stator creates a continuously shifting magnetic vortex that forces the rotor to keep spinning smoothly.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Spin the rotor
        rotorGroup.rotation.x += speed * 0.1;
        
        // Emissive pulsing logic for stator coils (Neon tech visual)
        const electricalFreq = speed * 5; 
        const e1 = Math.max(0, Math.sin(time * electricalFreq));
        const e2 = Math.max(0, Math.sin(time * electricalFreq + (Math.PI * 2 / 3)));
        const e3 = Math.max(0, Math.sin(time * electricalFreq + (Math.PI * 4 / 3)));
        
        coilMaterials[0].emissiveIntensity = e1 * 2.5; 
        coilMaterials[1].emissiveIntensity = e2 * 2.5;
        coilMaterials[2].emissiveIntensity = e3 * 2.5;

        // Subtle pulse for the neodymium magnets based on speed
        magnetMaterial.emissiveIntensity = 0.5 + (Math.sin(time * 10) * 0.3 * Math.min(speed, 1));
    };

    return { 
        group, 
        parts, 
        description: "Ultra High-Tech Brushless DC (BLDC) Motor. Features a neodymium permanent-magnet rotor, precision stator with glowing phase coils, and an aerodynamic aluminum casing.", 
        quizQuestions, 
        animate 
    };
}

// Auto-generated missing stub
export function createBLDCMotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
