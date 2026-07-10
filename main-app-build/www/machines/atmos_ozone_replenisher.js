import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const ozoneGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.5
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 1.5
    });

    const energyCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.5, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: 'Stabilization Platform',
        description: 'Anchors the replenisher and absorbs high-frequency vibrations during ozone synthesis.',
        material: 'darkSteel',
        function: 'Structural support and vibration dampening',
        assemblyOrder: 1,
        connections: ['Power Conduit', 'Reaction Chamber'],
        failureEffect: 'System destabilization leading to critical resonance cascade.',
        cascadeFailures: ['Reaction Chamber', 'Energy Core'],
        originalPosition: {x: 0, y: 0.5, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Power Conduit
    const conduitGeo = new THREE.CylinderGeometry(1.5, 2, 4, 16);
    const conduitMesh = new THREE.Mesh(conduitGeo, copper);
    conduitMesh.position.set(0, 3, 0);
    group.add(conduitMesh);
    meshes.conduit = conduitMesh;
    parts.push({
        name: 'Power Conduit',
        description: 'Channels high-voltage plasma required for molecular O3 bonding.',
        material: 'copper',
        function: 'Energy transmission',
        assemblyOrder: 2,
        connections: ['Stabilization Platform', 'Energy Core'],
        failureEffect: 'Power fluctuations causing incomplete ozone synthesis.',
        cascadeFailures: ['Energy Core'],
        originalPosition: {x: 0, y: 3, z: 0},
        explodedPosition: {x: 0, y: -2, z: 5}
    });

    // 3. Energy Core
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const coreMesh = new THREE.Mesh(coreGeo, energyCoreMat);
    coreMesh.position.set(0, 6, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;
    parts.push({
        name: 'Quantum Energy Core',
        description: 'Generates the localized fields needed to rip apart O2 and reform O3.',
        material: 'energyCoreMat',
        function: 'Energy generation',
        assemblyOrder: 3,
        connections: ['Power Conduit', 'Reaction Chamber'],
        failureEffect: 'Total loss of synthesis field. Zero ozone production.',
        cascadeFailures: ['Reaction Chamber', 'Dispersal Array'],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 5, y: 6, z: 5}
    });

    // 4. Reaction Chamber
    const chamberGeo = new THREE.SphereGeometry(3, 32, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, glass);
    chamberMesh.position.set(0, 6, 0);
    group.add(chamberMesh);
    meshes.chamber = chamberMesh;
    parts.push({
        name: 'Plasma Reaction Chamber',
        description: 'Contains the superheated plasma and ozone molecules under immense pressure.',
        material: 'glass',
        function: 'Containment and reaction environment',
        assemblyOrder: 4,
        connections: ['Stabilization Platform', 'Energy Core', 'Dispersal Array'],
        failureEffect: 'Plasma leak and atmospheric contamination.',
        cascadeFailures: ['Ozone Dispersal Rings'],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: -5, y: 6, z: -5}
    });

    // 5. Ozone Inner Glow (Visual effect inside chamber)
    const glowGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const glowMesh = new THREE.Mesh(glowGeo, ozoneGlow);
    glowMesh.position.set(0, 6, 0);
    group.add(glowMesh);
    meshes.glow = glowMesh;
    parts.push({
        name: 'O3 Plasma Field',
        description: 'Visible manifestation of the continuous creation of ozone molecules.',
        material: 'ozoneGlow',
        function: 'Visual feedback',
        assemblyOrder: 5,
        connections: ['Reaction Chamber'],
        failureEffect: 'Diminishing glow indicates system failure.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 0, y: 6, z: -8}
    });

    // 6. Dispersal Rings
    meshes.rings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(4 + (i * 1.5), 0.2, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(0, 6, 0);
        group.add(ringMesh);
        meshes.rings.push({ mesh: ringMesh, index: i });
        parts.push({
            name: `Dispersal Ring ${i + 1}`,
            description: `Aids in the controlled release of ozone into the stratosphere via magnetic manipulation.`,
            material: 'chrome',
            function: 'Ozone distribution',
            assemblyOrder: 6 + i,
            connections: ['Reaction Chamber'],
            failureEffect: 'Localized high ozone concentration, failing to repair global layer.',
            cascadeFailures: [],
            originalPosition: {x: 0, y: 6, z: 0},
            explodedPosition: {x: 0, y: 10 + (i * 4), z: 0}
        });
    }

    // 7. Emitter Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.2, 0.5, 6, 16);
    const antennaMesh = new THREE.Mesh(antennaGeo, aluminum);
    antennaMesh.position.set(0, 12, 0);
    group.add(antennaMesh);
    meshes.antenna = antennaMesh;
    parts.push({
        name: 'Stratospheric Emitter',
        description: 'Projects the final synthesized ozone up into the upper atmosphere.',
        material: 'aluminum',
        function: 'Final delivery',
        assemblyOrder: 9,
        connections: ['Reaction Chamber'],
        failureEffect: 'Ozone stays trapped at ground level (toxic).',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 12, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 8. Emitter Tip
    const tipGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const tipMesh = new THREE.Mesh(tipGeo, neonBlue);
    tipMesh.position.set(0, 15, 0);
    group.add(tipMesh);
    meshes.tip = tipMesh;
    parts.push({
        name: 'Ionization Tip',
        description: 'Charges the ozone particles to ensure stratospheric bonding.',
        material: 'neonBlue',
        function: 'Particle charging',
        assemblyOrder: 10,
        connections: ['Stratospheric Emitter'],
        failureEffect: 'Ozone degradation before reaching target altitude.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 24, z: 0}
    });

    const description = "The Stratospheric Ozone Replenisher is a state-of-the-art geoengineering marvel. It draws in ambient O2, subjects it to intense quantum-field plasma reactions to form pure O3, and then fires the charged ozone into the stratosphere via a magnetic emitter array, helping to repair the Earth's ozone layer at unprecedented speeds.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Quantum Energy Core?",
            options: [
                "To cool the system down",
                "To generate fields needed to rip apart O2 and reform O3",
                "To disperse ozone evenly",
                "To anchor the machine"
            ],
            correct: 1,
            explanation: "The Quantum Energy Core generates the extreme localized fields required to break the strong molecular bonds of Oxygen (O2) and synthesize Ozone (O3).",
            difficulty: "Medium"
        },
        {
            question: "If the Stratospheric Emitter fails, what is the critical danger?",
            options: [
                "The machine will overheat",
                "Ozone stays trapped at ground level, becoming toxic",
                "The core will explode",
                "No ozone will be produced"
            ],
            correct: 1,
            explanation: "Ozone is highly beneficial in the stratosphere but highly toxic and a major pollutant at ground level. A failure of the emitter prevents it from reaching the safe altitude.",
            difficulty: "Hard"
        },
        {
            question: "Why does the Ionization Tip charge the ozone particles?",
            options: [
                "To make them glow",
                "To power the rings",
                "To ensure stratospheric bonding and prevent premature degradation",
                "To speed up the reaction chamber"
            ],
            correct: 2,
            explanation: "Charging the particles ensures they remain stable and bond effectively with the existing stratospheric ozone layer without degrading on the way up.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, exploded) {
        if (!exploded) {
            // Core pulsing and rotation
            meshes.core.rotation.y += 0.05 * speed;
            meshes.core.rotation.z += 0.03 * speed;
            const pulse = Math.sin(time * 2 * speed) * 0.2 + 1;
            meshes.core.scale.set(pulse, pulse, pulse);

            // Glow pulsing
            const glowPulse = Math.sin(time * 3 * speed) * 0.1 + 1;
            meshes.glow.scale.set(glowPulse, glowPulse, glowPulse);
            meshes.glow.material.emissiveIntensity = 2.0 + Math.sin(time * 5 * speed) * 1.0;

            // Rings rotating
            meshes.rings.forEach((ringObj) => {
                const ring = ringObj.mesh;
                const i = ringObj.index;
                ring.rotation.x = Math.PI / 2 + Math.sin(time * speed + i) * 0.2;
                ring.rotation.y += 0.02 * speed * (i % 2 === 0 ? 1 : -1);
                ring.rotation.z += 0.01 * speed * (i + 1);
            });

            // Tip pulsing
            meshes.tip.material.emissiveIntensity = 1.5 + Math.sin(time * 10 * speed) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createOzoneReplenisher() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
