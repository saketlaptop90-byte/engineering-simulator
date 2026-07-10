import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        wireframe: false,
    });

    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.8,
    });

    const energyFieldMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
    });
    
    const darkObsidian = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.1,
        metalness: 0.9
    });

    // 1. Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(8, 10, 2, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Antimatter Base Pedestal",
        description: "A solid foundation anchoring the massive energies required for FTL transmission.",
        material: "Dark Steel / Obsidian",
        function: "Grounds tachyon discharge and provides structural stability.",
        assemblyOrder: 1,
        connections: ["Tachyon Accelerator Ring", "Power Conduit Core"],
        failureEffect: "Structural collapse leading to an uncontrolled micro-singularity.",
        cascadeFailures: ["Accelerator Ring fracture", "Core containment breach"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });
    baseMesh.position.set(0, -5, 0);

    // 2. Power Conduit Core
    const coreGeo = new THREE.CylinderGeometry(2, 2, 12, 32);
    const coreMesh = new THREE.Mesh(coreGeo, plasmaCoreMat);
    group.add(coreMesh);
    meshes.core = coreMesh;
    parts.push({
        name: "Tachyon Plasma Core",
        description: "The primary source of tachyon particles, superheated and condensed.",
        material: "Plasma Containment Field",
        function: "Generates raw tachyon particles for the array to collimate.",
        assemblyOrder: 2,
        connections: ["Base Pedestal", "Focusing Lenses"],
        failureEffect: "Core meltdown, massive tachyon radiation spike.",
        cascadeFailures: ["Complete system vaporization", "Local timeline fracturing"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 10 }
    });
    coreMesh.position.set(0, 2, 0);

    // 3. Accelerator Rings
    const ringGroup = new THREE.Group();
    meshes.rings = [];
    const ringGeo = new THREE.TorusGeometry(5, 0.5, 16, 100);
    for (let i = 0; i < 3; i++) {
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        ringMesh.position.y = -2 + i * 4;
        ringMesh.rotation.x = Math.PI / 2;
        ringGroup.add(ringMesh);
        meshes.rings.push(ringMesh);
    }
    group.add(ringGroup);
    parts.push({
        name: "Magnetic Accelerator Rings",
        description: "Superconducting toroids that accelerate tachyons past the speed of light.",
        material: "Chrome / Superconductors",
        function: "Pushes tachyons into an FTL state via cascading magnetic pulses.",
        assemblyOrder: 3,
        connections: ["Plasma Core", "Outer Containment Shell"],
        failureEffect: "Tachyon deceleration causing destructive Cherenkov radiation.",
        cascadeFailures: ["Core overheating", "Signal distortion"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -15, y: 2, z: 0 }
    });
    ringGroup.position.set(0, 2, 0);

    // 4. Focusing Lenses
    const lensGroup = new THREE.Group();
    meshes.lenses = [];
    const lensGeo = new THREE.DodecahedronGeometry(2.5, 1);
    for (let i = 0; i < 4; i++) {
        const lensMesh = new THREE.Mesh(lensGeo, neonBlue);
        lensMesh.position.x = Math.cos(i * Math.PI / 2) * 5;
        lensMesh.position.z = Math.sin(i * Math.PI / 2) * 5;
        lensGroup.add(lensMesh);
        meshes.lenses.push(lensMesh);
    }
    group.add(lensGroup);
    parts.push({
        name: "Gravimetric Focusing Lenses",
        description: "Crystalline matrices that shape the tachyon field into a directed beam.",
        material: "Quantum Glass / Neon Crystalline",
        function: "Collimates the FTL particles to target specific coordinates in spacetime.",
        assemblyOrder: 4,
        connections: ["Accelerator Rings", "Transmission Dish"],
        failureEffect: "Beam diffusion, hitting unintended targets across the galaxy.",
        cascadeFailures: ["Signal interception by hostile forces", "Temporal echoes"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 15, y: 6, z: 0 }
    });
    lensGroup.position.set(0, 6, 0);

    // 5. Energy Field / Containment Shell
    const fieldGeo = new THREE.SphereGeometry(9, 32, 32);
    const fieldMesh = new THREE.Mesh(fieldGeo, energyFieldMat);
    group.add(fieldMesh);
    meshes.field = fieldMesh;
    parts.push({
        name: "Tachyon Containment Sphere",
        description: "A projected energy field to keep rogue particles from escaping into local space.",
        material: "Hardlight Projection",
        function: "Prevents localized temporal anomalies around the array.",
        assemblyOrder: 5,
        connections: ["Accelerator Rings"],
        failureEffect: "Localized time dilation, causing the crew to age rapidly or regress.",
        cascadeFailures: ["Paradoxes", "Complete reality breakdown"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -15 }
    });
    fieldMesh.position.set(0, 2, 0);

    // 6. Transmission Dish
    const dishGeo = new THREE.ConeGeometry(8, 4, 32, 1, true);
    const dishMesh = new THREE.Mesh(dishGeo, steel);
    dishMesh.rotation.x = Math.PI;
    group.add(dishMesh);
    meshes.dish = dishMesh;
    parts.push({
        name: "FTL Transmission Dish",
        description: "The final emission point for the tachyon burst.",
        material: "Reinforced Steel",
        function: "Directs the collimated beam out of the ship's local reality and into hyperspace.",
        assemblyOrder: 6,
        connections: ["Focusing Lenses"],
        failureEffect: "Beam reflection back into the core.",
        cascadeFailures: ["Catastrophic feedback loop", "Core detonation"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });
    dishMesh.position.set(0, 12, 0);

    // 7. Communication Spire
    const spireGeo = new THREE.CylinderGeometry(0.2, 1, 10, 16);
    const spireMesh = new THREE.Mesh(spireGeo, copper);
    group.add(spireMesh);
    meshes.spire = spireMesh;
    parts.push({
        name: "Temporal Tuning Spire",
        description: "A precision instrument that adjusts the signal's temporal frequency.",
        material: "Hyper-conductive Copper",
        function: "Ensures the message arrives exactly when intended, rather than in the past or future.",
        assemblyOrder: 7,
        connections: ["Transmission Dish"],
        failureEffect: "Message arrives years before it was sent, causing causality loops.",
        cascadeFailures: ["Grandfather paradox triggers", "Communication failure"],
        originalPosition: { x: 0, y: 17, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });
    spireMesh.position.set(0, 17, 0);

    // 8. Rotating Data Core
    const dataCoreGeo = new THREE.OctahedronGeometry(1.5, 0);
    const dataCoreMesh = new THREE.Mesh(dataCoreGeo, tinted);
    group.add(dataCoreMesh);
    meshes.dataCore = dataCoreMesh;
    parts.push({
        name: "Quantum Entanglement Data Buffer",
        description: "Stores and encodes the immense data streams before transmission.",
        material: "Tinted Quantum Crystal",
        function: "Translates standard digital data into tachyon burst patterns.",
        assemblyOrder: 8,
        connections: ["Power Conduit Core", "Base Pedestal"],
        failureEffect: "Data corruption; sending gibberish at lightspeed.",
        cascadeFailures: ["Signal degradation", "Protocol desync"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -10, z: -10 }
    });
    dataCoreMesh.position.set(0, -2, 0);

    // 9. Floating Quantum Bits
    const bitGroup = new THREE.Group();
    meshes.bits = [];
    const bitGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    for (let i = 0; i < 20; i++) {
        const bitMesh = new THREE.Mesh(bitGeo, neonBlue);
        bitMesh.position.set(
            (Math.random() - 0.5) * 8,
            Math.random() * 10 - 2,
            (Math.random() - 0.5) * 8
        );
        bitGroup.add(bitMesh);
        meshes.bits.push({ mesh: bitMesh, speed: Math.random() * 2 + 1, offset: Math.random() * Math.PI * 2 });
    }
    group.add(bitGroup);
    parts.push({
        name: "Quantum Information Bits",
        description: "Raw data packets suspended in the magnetic field before transmission.",
        material: "Photonic Construct",
        function: "Visual representation of the immense data load.",
        assemblyOrder: 9,
        connections: ["Quantum Entanglement Data Buffer"],
        failureEffect: "Data loss in transit.",
        cascadeFailures: ["Incomplete transmission", "System crash"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: -10 }
    });

    const description = "The Tachyon Communication Array is the pinnacle of faster-than-light engineering, utilizing super-accelerated tachyon particles to transmit vast amounts of data across galactic distances instantaneously. It balances immense energy demands with precise temporal tuning to prevent causality violations.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Temporal Tuning Spire?",
            options: ["To cool down the plasma core", "To prevent the message from arriving in the past or future", "To increase transmission speed", "To translate alien languages"],
            correct: 1,
            explanation: "The Spire adjusts the temporal frequency of the signal, ensuring it arrives exactly when intended and preventing causality paradoxes.",
            difficulty: "Medium"
        },
        {
            question: "Which component shapes the tachyon field into a directed beam?",
            options: ["Antimatter Base Pedestal", "Magnetic Accelerator Rings", "Gravimetric Focusing Lenses", "FTL Transmission Dish"],
            correct: 2,
            explanation: "The Gravimetric Focusing Lenses are crystalline matrices that collimate the FTL particles to target specific spacetime coordinates.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the Tachyon Containment Sphere fails?",
            options: ["The ship explodes", "The transmission becomes faster", "Localized time dilation occurs around the array", "The data becomes encrypted"],
            correct: 2,
            explanation: "Failure of the hardlight projection field causes rogue particles to escape, resulting in localized time dilation affecting the crew's aging process.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Core pulses
        const coreIntensity = 3.5 + Math.sin(time * 5 * speed) * 1.5;
        meshes.core.material.emissiveIntensity = coreIntensity;
        meshes.core.scale.set(1 + Math.sin(time * 10 * speed) * 0.05, 1, 1 + Math.sin(time * 10 * speed) * 0.05);

        // Rings rotate in alternating directions
        meshes.rings[0].rotation.z = time * 2 * speed;
        meshes.rings[1].rotation.z = -time * 3 * speed;
        meshes.rings[2].rotation.z = time * 4 * speed;

        meshes.rings.forEach((ring, idx) => {
            const scale = 1 + Math.sin(time * 3 * speed + idx) * 0.1;
            ring.scale.set(scale, scale, scale);
        });

        // Lenses orbit
        meshes.lenses.forEach((lens, idx) => {
            lens.position.x = Math.cos(time * 2 * speed + idx * Math.PI / 2) * 5;
            lens.position.z = Math.sin(time * 2 * speed + idx * Math.PI / 2) * 5;
            lens.rotation.x += 0.05 * speed;
            lens.rotation.y += 0.05 * speed;
        });

        // Energy field pulses and rotates
        meshes.field.rotation.y = time * 0.5 * speed;
        meshes.field.rotation.x = time * 0.2 * speed;
        meshes.field.material.opacity = 0.3 + Math.sin(time * 2 * speed) * 0.1;
        meshes.field.scale.setScalar(1 + Math.sin(time * 4 * speed) * 0.02);

        // Data core spins rapidly
        meshes.dataCore.rotation.x = time * 5 * speed;
        meshes.dataCore.rotation.y = time * 7 * speed;

        // Spire bobs up and down slightly
        meshes.spire.position.y = 17 + Math.sin(time * 8 * speed) * 0.2;

        // Bits float around randomly
        meshes.bits.forEach((bitData) => {
            bitData.mesh.position.y += Math.sin(time * bitData.speed + bitData.offset) * 0.05 * speed;
            bitData.mesh.rotation.x += 0.02 * speed * bitData.speed;
            bitData.mesh.rotation.y += 0.03 * speed * bitData.speed;
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}
