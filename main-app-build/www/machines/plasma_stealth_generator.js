import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const plasmaMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const stealthMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, emissive: 0x8800ff, emissiveIntensity: 0.8, wireframe: true, transparent: true, opacity: 0.6 });
    const energyFieldMat = new THREE.MeshPhongMaterial({ color: 0xaa00ff, emissive: 0x8800ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const goldContacts = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 1.0 });

    // 1. Base Structure
    const baseGeo = new THREE.CylinderGeometry(4, 4.5, 1, 8);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -2, 0);
    group.add(base);
    parts.push({
        name: "Containment Base",
        description: "Heavy structural foundation that houses the primary power couplings and grounds the electromagnetic discharge.",
        material: "Dark Steel",
        function: "Provides stability and grounding for the stealth generator.",
        assemblyOrder: 1,
        connections: ["Vacuum Plasma Chamber", "Phase Emitter Array"],
        failureEffect: "Structural collapse and catastrophic electrical arcing.",
        cascadeFailures: ["Vacuum Plasma Chamber"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: base
    });
    meshes.base = base;

    // 2. Power Core (Plasma Chamber)
    const coreGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const core = new THREE.Mesh(coreGeo, glass);
    core.position.set(0, 1.5, 0);
    group.add(core);
    parts.push({
        name: "Vacuum Plasma Chamber",
        description: "A highly pressurized vacuum sphere where ionized gas is accelerated to form stealth plasma.",
        material: "Reinforced Glass",
        function: "Contains the plasma state.",
        assemblyOrder: 2,
        connections: ["Containment Base", "Ionized Plasma Core"],
        failureEffect: "Loss of vacuum, plasma leakage.",
        cascadeFailures: ["Ionized Plasma Core", "Magnetic Containment Coils"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: -6 },
        mesh: core
    });
    meshes.core = core;

    // 3. Inner Plasma Core
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const innerCore = new THREE.Mesh(innerCoreGeo, plasmaMat);
    core.add(innerCore); // child of core
    parts.push({
        name: "Ionized Plasma Core",
        description: "The super-heated ionized gas state that interacts with electromagnetic waves to absorb radar.",
        material: "Cyan Plasma",
        function: "Absorbs and scatters incoming radar waves.",
        assemblyOrder: 3,
        connections: ["Vacuum Plasma Chamber"],
        failureEffect: "Generator loses stealth capability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 6 },
        mesh: innerCore
    });
    meshes.innerCore = innerCore;

    // 4. Magnetic Field Coils
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 1.5, 0);
    for(let i=0; i<3; i++) {
        const coilGeo = new THREE.TorusGeometry(3.2, 0.2, 16, 64);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.rotation.x = Math.PI / 2;
        coil.rotation.y = (Math.PI / 3) * i;
        coilGroup.add(coil);
    }
    group.add(coilGroup);
    parts.push({
        name: "Magnetic Containment Coils",
        description: "Superconducting copper rings that generate immense magnetic fields to contain and shape the plasma.",
        material: "Superconducting Copper",
        function: "Prevents the plasma from touching the glass chamber and shapes the stealth field.",
        assemblyOrder: 4,
        connections: ["Vacuum Plasma Chamber"],
        failureEffect: "Magnetic containment failure, melting the chamber.",
        cascadeFailures: ["Vacuum Plasma Chamber", "Phase Emitter Array"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 6, y: 1.5, z: 0 },
        mesh: coilGroup
    });
    meshes.coilGroup = coilGroup;

    // 5. Stealth Field Emitters
    const emitterGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const angle = (Math.PI / 3) * i;
        const emitter = new THREE.Group();
        
        const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.set(0, 1.75, 0);
        
        const tipGeo = new THREE.ConeGeometry(0.3, 0.8, 8);
        const tip = new THREE.Mesh(tipGeo, goldContacts);
        tip.position.set(0, 3.9, 0);

        const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 16);
        const ring = new THREE.Mesh(ringGeo, stealthMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 2.5, 0);
        
        emitter.add(rod);
        emitter.add(tip);
        emitter.add(ring);

        emitter.position.set(Math.cos(angle) * 3.8, -2, Math.sin(angle) * 3.8);
        emitterGroup.add(emitter);
    }
    group.add(emitterGroup);
    parts.push({
        name: "Phase Emitter Array",
        description: "Six chrome antennas topped with gold contacts that broadcast the plasma interference pattern outward.",
        material: "Chrome and Gold",
        function: "Projects the radar-absorbing plasma field around the host vehicle.",
        assemblyOrder: 5,
        connections: ["Containment Base", "Magnetic Containment Coils"],
        failureEffect: "Radar cross-section spikes, revealing the vehicle.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -7, y: 0, z: 0 },
        mesh: emitterGroup
    });
    meshes.emitterGroup = emitterGroup;

    // 6. External Energy Field (Shield representation)
    const fieldGeo = new THREE.SphereGeometry(6, 32, 32);
    const energyField = new THREE.Mesh(fieldGeo, energyFieldMat);
    energyField.position.set(0, 1.5, 0);
    group.add(energyField);
    parts.push({
        name: "Electromagnetic Absorption Sphere",
        description: "The projected stealth field. Absorbs incoming RF waves and converts them into harmless heat.",
        material: "Photon/EM Field",
        function: "Hides the signature of the craft.",
        assemblyOrder: 6,
        connections: ["Phase Emitter Array"],
        failureEffect: "Stealth drops instantly.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 9, z: 0 },
        mesh: energyField
    });
    meshes.energyField = energyField;

    // 7. Core Rotator / Stabilizer
    const stabilizerGroup = new THREE.Group();
    stabilizerGroup.position.set(0, 1.5, 0);
    const s1 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.1, 8, 32), aluminum);
    const s2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.1, 8, 32), aluminum);
    s1.rotation.x = Math.PI / 2;
    s2.rotation.z = Math.PI / 2;
    stabilizerGroup.add(s1);
    stabilizerGroup.add(s2);
    group.add(stabilizerGroup);
    parts.push({
        name: "Gyroscopic Stabilizer",
        description: "Aluminum rings that spin rapidly to stabilize the plasma core against vehicular G-forces.",
        material: "Aluminum",
        function: "Prevents plasma shear during high-speed maneuvers.",
        assemblyOrder: 7,
        connections: ["Vacuum Plasma Chamber"],
        failureEffect: "Plasma core destabilizes during turns.",
        cascadeFailures: ["Vacuum Plasma Chamber"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 1.5, z: 7 },
        mesh: stabilizerGroup
    });
    meshes.stabilizerGroup = stabilizerGroup;


    const description = "The Plasma Stealth Generator utilizes a highly pressurized ionized plasma core and complex electromagnetic phase arrays to absorb and scatter incoming radar waves. By projecting a localized electromagnetic absorption sphere, it renders the host craft virtually invisible to standard radar systems, converting incoming RF energy into harmless heat dissipated by its base heat sinks.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Containment Coils?",
            options: ["To generate stealth signals", "To prevent plasma from touching the glass chamber", "To cool the generator base", "To power the gyro stabilizer"],
            correct: 1,
            explanation: "The superconducting copper rings generate immense magnetic fields that contain the superheated plasma, preventing it from melting the glass chamber.",
            difficulty: "Medium"
        },
        {
            question: "Which component converts incoming RF waves into heat?",
            options: ["Gyroscopic Stabilizer", "Containment Base", "Electromagnetic Absorption Sphere", "Phase Emitter Array"],
            correct: 2,
            explanation: "The Electromagnetic Absorption Sphere is the projected field that absorbs RF waves and converts them into heat.",
            difficulty: "Hard"
        },
        {
            question: "Why does the generator need a Gyroscopic Stabilizer?",
            options: ["To prevent plasma shear during high G-force maneuvers", "To power the emitter rods", "To look cool", "To reflect enemy lasers"],
            correct: 0,
            explanation: "The gyroscopic stabilizer keeps the plasma core steady and prevents plasma shear when the vehicle is undergoing high-speed or high-G turns.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * 0.001 * speed;

        // Inner plasma core pulses and rotates randomly
        meshes.innerCore.rotation.x = t * 0.5;
        meshes.innerCore.rotation.y = t * 0.7;
        meshes.innerCore.scale.setScalar(1 + Math.sin(t * 5) * 0.05);
        
        // Coils rotate slowly
        meshes.coilGroup.rotation.x = t * 0.3;
        meshes.coilGroup.rotation.y = t * 0.4;
        meshes.coilGroup.rotation.z = t * 0.2;

        // Stabilizer rings spin rapidly
        meshes.stabilizerGroup.rotation.y = t * 2.0;
        meshes.stabilizerGroup.rotation.x = t * 1.5;

        // Energy field pulses opacity and rotates
        meshes.energyField.rotation.y = -t * 0.2;
        meshes.energyField.material.opacity = 0.15 + Math.sin(t * 3) * 0.05;

        // Emitters pulse up and down slightly
        meshes.emitterGroup.position.y = Math.sin(t * 2) * 0.1;
        meshes.emitterGroup.rotation.y = t * 0.5;
        
        // Emitter rings pulse rotation
        meshes.emitterGroup.children.forEach((emitter, idx) => {
            const ring = emitter.children[2];
            ring.rotation.z = t * (idx % 2 === 0 ? 2 : -2);
            ring.material.emissiveIntensity = 0.5 + Math.sin(t * 5 + idx) * 0.5;
        });

        // Plasma core material emissive pulse
        if (meshes.innerCore.material) {
            meshes.innerCore.material.emissiveIntensity = 1.5 + Math.sin(t * 8) * 1.0;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (t, s) => animate(t, s, meshes)
    };
}
