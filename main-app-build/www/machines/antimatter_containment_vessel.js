import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Materials
    const antimatterCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xaa00aa,
        emissiveIntensity: 4,
        transparent: true,
        opacity: 0.9,
        wireframe: true,
        roughness: 0,
        metalness: 1
    });

    const magneticFieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
    });

    const energyRingMat = new THREE.MeshStandardMaterial({
        color: 0xffdd00,
        emissive: 0xffdd00,
        emissiveIntensity: 3.5,
        wireframe: true
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5.5, 1, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.5, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Base Structure",
        description: "Vibration-dampening high-density osmium alloy base.",
        material: "Dark Steel",
        function: "Provides structural integrity to the magnetic field generator base and anchors the cryogenic lines.",
        assemblyOrder: 1,
        connections: ["Magnetic Pillars", "Cryogenic Coolers"],
        failureEffect: "Micro-vibrations destabilize the Penning trap.",
        cascadeFailures: ["Magnetic Field Collapse", "Antimatter Annihilation"],
        originalPosition: {x: 0, y: -0.5, z: 0},
        explodedPosition: {x: 0, y: -4, z: 0}
    });

    // 2. Magnetic Pillars (4x)
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.5, 9, 32);
    const pillarGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const p = new THREE.Mesh(pillarGeo, chrome);
        const angle = (Math.PI / 2) * i;
        p.position.set(Math.cos(angle)*4, 4, Math.sin(angle)*4);
        pillarGroup.add(p);
    }
    group.add(pillarGroup);
    meshes.pillars = pillarGroup;
    parts.push({
        name: "Magnetic Array Pillars",
        description: "Quadrupole electromagnets generating the outer containment shell.",
        material: "Chrome / Superconductors",
        function: "Maintains the static magnetic field necessary for radial confinement of antiprotons.",
        assemblyOrder: 2,
        connections: ["Base Structure", "Top Cap", "Superconducting Coils"],
        failureEffect: "Loss of radial containment.",
        cascadeFailures: ["Particle drift", "Wall collision", "Catastrophic Annihilation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 3. Superconducting Coils (Torus)
    const coilGroup = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(3.0, 0.35, 32, 100);
    for(let i=0; i<4; i++) {
        const c = new THREE.Mesh(coilGeo, copper);
        c.position.set(0, 1.5 + i*1.6, 0);
        c.rotation.x = Math.PI/2;
        coilGroup.add(c);
    }
    group.add(coilGroup);
    meshes.coils = coilGroup;
    parts.push({
        name: "Superconducting Coils",
        description: "Helium-cooled Niobium-Tin toroidal coils.",
        material: "Copper",
        function: "Generates the immense axial magnetic field gradient for the Penning Trap.",
        assemblyOrder: 3,
        connections: ["Magnetic Array Pillars", "Cryogenic Coolers"],
        failureEffect: "Axial field strength drops, antimatter escapes trap center.",
        cascadeFailures: ["Containment breach"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -8}
    });

    // 4. Plasma Stabilizer Rings
    const stabilizerGroup = new THREE.Group();
    const stabGeo = new THREE.TorusGeometry(3.6, 0.08, 16, 64);
    for(let i=0; i<3; i++) {
        const r = new THREE.Mesh(stabGeo, energyRingMat);
        r.position.set(0, 4, 0);
        stabilizerGroup.add(r);
    }
    group.add(stabilizerGroup);
    meshes.stabilizers = stabilizerGroup;
    parts.push({
        name: "Plasma Stabilizer Rings",
        description: "High-frequency electromagnetic pulse rings.",
        material: "Energy Matrix",
        function: "Applies dynamic corrections to the magnetic bottle to prevent plasma instabilities.",
        assemblyOrder: 4,
        connections: ["Containment Chamber"],
        failureEffect: "Antimatter cloud becomes turbulent.",
        cascadeFailures: ["Increased thermal radiation", "Trap failure"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 8, y: 4, z: 0}
    });

    // 5. Containment Chamber
    const chamberGeo = new THREE.CylinderGeometry(2.5, 2.5, 8, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, tinted);
    chamberMesh.position.set(0, 4, 0);
    group.add(chamberMesh);
    meshes.chamber = chamberMesh;
    parts.push({
        name: "Vacuum Containment Chamber",
        description: "Ultra-high vacuum transparent hyper-glass cylinder.",
        material: "Tinted Glass",
        function: "Provides a near-perfect vacuum (10^-15 Torr) to prevent antimatter annihilation with air molecules.",
        assemblyOrder: 5,
        connections: ["Base Structure", "Top Cap"],
        failureEffect: "Vacuum breach introduces baryonic matter.",
        cascadeFailures: ["Instant annihilation", "Vessel destruction"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: -8, y: 4, z: 0}
    });

    // 6. Antimatter Core
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMesh = new THREE.Mesh(coreGeo, antimatterCoreMat);
    coreMesh.position.set(0, 4, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;
    parts.push({
        name: "Antimatter Core",
        description: "Suspended antihydrogen plasma.",
        material: "Antimatter",
        function: "The primary fuel/payload, isolated from all ordinary matter.",
        assemblyOrder: 6,
        connections: ["Magnetic Field Array (Wireless)"],
        failureEffect: "If it touches matter, total energy conversion.",
        cascadeFailures: ["Total Vessel Annihilation"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 7. Core Energy Field (Inner Shell)
    const fieldGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const fieldMesh = new THREE.Mesh(fieldGeo, magneticFieldMat);
    fieldMesh.position.set(0, 4, 0);
    group.add(fieldMesh);
    meshes.field = fieldMesh;
    parts.push({
        name: "Inner Magnetic Bottle",
        description: "Visible representation of the central trapping field.",
        material: "Plasma Glow",
        function: "The immediate boundary pushing antiprotons inward.",
        assemblyOrder: 7,
        connections: ["Magnetic Array Pillars"],
        failureEffect: "Particle leakage.",
        cascadeFailures: ["Chamber wall deterioration"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 8. Top Cap
    const capGeo = new THREE.CylinderGeometry(5.2, 5, 1, 64);
    const capMesh = new THREE.Mesh(capGeo, darkSteel);
    capMesh.position.set(0, 8.5, 0);
    group.add(capMesh);
    meshes.cap = capMesh;
    parts.push({
        name: "Top Cap & Extraction Port",
        description: "Heavy shielding and controlled release valve.",
        material: "Dark Steel",
        function: "Seals the vacuum chamber and directs antimatter stream for engine injection.",
        assemblyOrder: 8,
        connections: ["Containment Chamber", "Magnetic Pillars"],
        failureEffect: "Uncontrolled antimatter venting.",
        cascadeFailures: ["Engine bay destruction"],
        originalPosition: {x: 0, y: 8.5, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0}
    });

    const description = "The Antimatter Containment Vessel utilizes an ultra-high vacuum environment combined with a state-of-the-art Penning Trap. By precisely orchestrating axial and radial magnetic fields, antihydrogen plasma is perfectly suspended away from all baryonic matter. Stabilizer rings prevent quantum tunneling and thermal drift, while cryogenic systems maintain the superconducting electromagnets at nearly absolute zero.";

    const quizQuestions = [
        {
            question: "What specific type of magnetic configuration is primarily used to trap the antimatter radially in this vessel?",
            options: ["Tokamak", "Penning Trap", "Dyson Sphere", "Cyclotron"],
            correct: 1,
            explanation: "A Penning Trap uses a homogenous axial magnetic field and an inhomogeneous quadrupole electric field to trap charged particles, which is the standard mechanism for antimatter containment.",
            difficulty: "Medium"
        },
        {
            question: "Why is an ultra-high vacuum (10^-15 Torr) critical inside the chamber?",
            options: ["To keep the components cold", "To prevent the magnetic field from shorting", "To eliminate stray baryonic matter that would cause annihilation", "To reduce the weight of the vessel"],
            correct: 2,
            explanation: "Any ordinary matter (like air molecules) interacting with antimatter results in instant, explosive annihilation. A near-perfect vacuum ensures no accidental collisions.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the superconducting Niobium-Tin coils lose their cryogenic cooling?",
            options: ["The vessel gets slightly warm", "They become resistive, the magnetic field drops, and containment is lost", "They generate extra antimatter", "The vacuum seal strengthens"],
            correct: 1,
            explanation: "Superconductors must be kept extremely cold. If they warm up (quench), they lose superconductivity, become highly resistive, and the magnetic field collapses.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed) {
        // Core rotation and pulsing
        meshes.core.rotation.x = time * 2 * speed;
        meshes.core.rotation.y = time * 3 * speed;
        const scale = 1 + Math.sin(time * 6 * speed) * 0.12;
        meshes.core.scale.set(scale, scale, scale);
        
        // Inner field pulsation
        meshes.field.material.opacity = 0.25 + Math.sin(time * 8 * speed) * 0.1;
        meshes.field.rotation.y = -time * speed;
        meshes.field.rotation.z = time * 0.5 * speed;

        // Multi-axis gyroscope rotation for plasma stabilizers
        meshes.stabilizers.children[0].rotation.x = time * 4 * speed;
        meshes.stabilizers.children[0].rotation.y = time * 2 * speed;
        
        meshes.stabilizers.children[1].rotation.x = -time * 3 * speed;
        meshes.stabilizers.children[1].rotation.z = time * 3.5 * speed;

        meshes.stabilizers.children[2].rotation.y = time * 5 * speed;
        meshes.stabilizers.children[2].rotation.z = -time * 2 * speed;

        // Coil subtle rotation and pulsing offsets
        meshes.coils.rotation.y = time * 0.3 * speed;
        meshes.coils.children.forEach((c, idx) => {
            const yOffset = Math.sin(time * 3 * speed + idx) * 0.08;
            c.position.y = 1.5 + idx*1.6 + yOffset;
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
