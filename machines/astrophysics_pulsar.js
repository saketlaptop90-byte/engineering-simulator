import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neutronStarMat = new THREE.MeshStandardMaterial({
        color: 0xe0ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const jetMat = new THREE.MeshBasicMaterial({
        color: 0x8a2be2,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const diskMat = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff0000,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const magneticLineMat = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    // 1. Neutron Star Core
    const coreGeom = new THREE.SphereGeometry(2, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeom, neutronStarMat);
    group.add(coreMesh);
    parts.push({
        name: "Neutron Star Core",
        description: "The ultra-dense collapsed core of a massive star, composed primarily of neutrons.",
        material: "Degenerate Neutron Matter",
        function: "Source of immense gravity and extreme magnetic field.",
        assemblyOrder: 1,
        connections: ["Magnetic Field", "Accretion Disk"],
        failureEffect: "Star collapse into a black hole if mass exceeds Tolman-Oppenheimer-Volkoff limit.",
        cascadeFailures: ["Complete systemic annihilation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0},
        mesh: coreMesh
    });

    // 2. North Radiation Jet
    const jetGeom = new THREE.ConeGeometry(1.5, 15, 32, 1, true);
    jetGeom.translate(0, 7.5 + 1.8, 0); 
    const northJet = new THREE.Mesh(jetGeom, jetMat);
    
    // Tilt the magnetic axis relative to the rotation axis
    const magneticAxisTilt = 0.3; // radians
    
    parts.push({
        name: "North Radiation Jet",
        description: "A highly collimated beam of electromagnetic radiation emitted from the magnetic pole.",
        material: "Plasma/Photons",
        function: "Emits the 'pulse' observed when the jet sweeps across the observer's line of sight.",
        assemblyOrder: 2,
        connections: ["Neutron Star Core"],
        failureEffect: "Cessation of pulsar emissions (Death Line).",
        cascadeFailures: ["Pulsar invisible to radio telescopes"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0},
        mesh: northJet
    });

    // 3. South Radiation Jet
    const southJetGeom = new THREE.ConeGeometry(1.5, 15, 32, 1, true);
    southJetGeom.translate(0, -7.5 - 1.8, 0); 
    const southJet = new THREE.Mesh(southJetGeom, jetMat);
    
    parts.push({
        name: "South Radiation Jet",
        description: "The counterpart collimated beam of radiation from the south magnetic pole.",
        material: "Plasma/Photons",
        function: "Emits radiation in the opposite direction.",
        assemblyOrder: 3,
        connections: ["Neutron Star Core"],
        failureEffect: "Asymmetric radiation emission.",
        cascadeFailures: ["Spindown anomaly"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -15, z: 0},
        mesh: southJet
    });

    // Group the magnetic axis elements together so they rotate with the star but with a tilt
    const magneticGroup = new THREE.Group();
    magneticGroup.add(northJet);
    magneticGroup.add(southJet);
    
    // Add magnetic field lines
    for(let i=0; i<8; i++) {
        const torusGeom = new THREE.TorusGeometry(5 + i*0.5, 0.1, 8, 50, Math.PI*2);
        const torus = new THREE.Mesh(torusGeom, new THREE.MeshBasicMaterial({
            color: 0x00ffff, 
            transparent: true, 
            opacity: 0.1, 
            wireframe: true
        }));
        torus.rotation.y = (i / 8) * Math.PI;
        magneticGroup.add(torus);
    }
    
    magneticGroup.rotation.z = magneticAxisTilt;
    group.add(magneticGroup);

    parts.push({
        name: "Magnetic Field (Dipole)",
        description: "Extremely intense magnetic field, trillions of times stronger than Earth's.",
        material: "Magnetic Flux",
        function: "Accelerates particles and powers the radiation jets.",
        assemblyOrder: 4,
        connections: ["Neutron Star Core", "Radiation Jets"],
        failureEffect: "Loss of pulsar mechanism.",
        cascadeFailures: ["Transition to radio-quiet neutron star"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 10, y: 0, z: 10},
        mesh: magneticGroup
    });

    // 4. Accretion Disk
    const diskGeom = new THREE.RingGeometry(4, 12, 64);
    const diskMesh = new THREE.Mesh(diskGeom, diskMat);
    diskMesh.rotation.x = -Math.PI / 2;
    group.add(diskMesh);
    
    parts.push({
        name: "Accretion Disk",
        description: "Superheated gas and dust spiraling into the neutron star.",
        material: "Superheated Plasma",
        function: "Transfers mass to the pulsar, occasionally causing X-ray bursts.",
        assemblyOrder: 5,
        connections: ["Neutron Star Core"],
        failureEffect: "Depletion of matter supply.",
        cascadeFailures: ["Spindown rate increases without mass transfer"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0},
        mesh: diskMesh
    });

    const description = "An astrophysical pulsar model demonstrating a rapidly rotating neutron star with a misaligned magnetic axis, emitting collimated beams of electromagnetic radiation.";

    const quizQuestions = [
        {
            question: "What primarily causes the 'pulsing' effect observed from Earth?",
            options: [
                "The star physically expands and contracts rapidly",
                "Radiation jets sweep across our line of sight due to rotation",
                "Nuclear fusion bursts on the surface",
                "Eclipses by a binary companion"
            ],
            correct: 1,
            explanation: "Pulsars emit beams of radiation from their magnetic poles. As the star rotates, if the beam sweeps past Earth, we see a brief flash or 'pulse', much like a lighthouse.",
            difficulty: "Medium"
        },
        {
            question: "Why does a pulsar spin so rapidly?",
            options: [
                "Conservation of angular momentum during the star's collapse",
                "Continuous impacts from asteroids",
                "Dark energy accelerating its rotation",
                "Magnetic repulsion from nearby stars"
            ],
            correct: 0,
            explanation: "When a massive star's core collapses into a tiny neutron star, its rotation speeds up drastically to conserve angular momentum, similar to an ice skater pulling their arms in.",
            difficulty: "Easy"
        },
        {
            question: "What happens if a neutron star accretes too much mass and exceeds the Tolman-Oppenheimer-Volkoff limit?",
            options: [
                "It explodes as a Type Ia supernova",
                "It turns into a white dwarf",
                "It collapses further into a black hole",
                "It splits into two smaller neutron stars"
            ],
            correct: 2,
            explanation: "The Tolman-Oppenheimer-Volkoff limit is the maximum mass for a neutron star. Beyond this limit, neutron degeneracy pressure can no longer resist gravity, and it collapses into a black hole.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const baseSpeed = 0.01 * speed;
        
        if (meshes["Neutron Star Core"]) {
            meshes["Neutron Star Core"].rotation.y += baseSpeed * 10;
        }
        
        if (meshes["Magnetic Field (Dipole)"]) {
            meshes["Magnetic Field (Dipole)"].rotation.y += baseSpeed * 10;
        }
        
        if (meshes["Accretion Disk"]) {
            meshes["Accretion Disk"].rotation.z += baseSpeed * 2;
            const intensity = 0.8 + Math.sin(time * 0.005 * speed) * 0.2;
            meshes["Accretion Disk"].material.emissiveIntensity = intensity;
        }
        
        if (meshes["North Radiation Jet"]) {
            meshes["North Radiation Jet"].material.opacity = 0.5 + Math.sin(time * 0.02 * speed) * 0.3;
        }
        
        if (meshes["South Radiation Jet"]) {
            meshes["South Radiation Jet"].material.opacity = 0.5 + Math.sin(time * 0.02 * speed) * 0.3;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPulsar() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
