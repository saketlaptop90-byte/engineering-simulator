import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for stellar interior & acoustic waves
    const plasmaCoreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 2.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        transparent: true,
    });

    const radiativeZoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 1.0,
        transmission: 0.5,
        opacity: 0.8,
        transparent: true,
        wireframe: true,
    });

    const convectiveZoneMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xaa2200,
        emissiveIntensity: 0.5,
        roughness: 0.8,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7,
    });

    const pModeWaveMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const gModeWaveMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // 1. Stellar Core
    const coreGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeometry, plasmaCoreMaterial);
    group.add(coreMesh);
    parts.push({
        name: "Stellar Core",
        description: "The central region where nuclear fusion occurs, generating the energy and profound acoustic waves.",
        material: "plasmaCoreMaterial",
        function: "Energy generation and source of excitation for internal acoustic waves (p-modes and g-modes).",
        assemblyOrder: 1,
        connections: ["Radiative Zone", "Internal Gravity Waves"],
        failureEffect: "Cessation of fusion, gravitational collapse, and loss of acoustic excitation.",
        cascadeFailures: ["Thermal support loss", "Stellar death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: coreMesh
    });

    // 2. Radiative Zone
    const radiativeGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const radiativeMesh = new THREE.Mesh(radiativeGeometry, radiativeZoneMaterial);
    group.add(radiativeMesh);
    parts.push({
        name: "Radiative Zone",
        description: "Region where energy travels via photon radiation. G-modes can propagate here but are trapped below the convective zone.",
        material: "radiativeZoneMaterial",
        function: "Energy transport and propagation medium for buoyancy-driven internal gravity waves.",
        assemblyOrder: 2,
        connections: ["Stellar Core", "Convective Zone"],
        failureEffect: "Disruption of energy transport and g-mode trapping.",
        cascadeFailures: ["Temperature profile distortion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 },
        mesh: radiativeMesh
    });

    // 3. Convective Zone
    const convectiveGeometry = new THREE.SphereGeometry(5, 64, 64);
    // Make it an outer shell
    const convectiveMesh = new THREE.Mesh(convectiveGeometry, convectiveZoneMaterial);
    group.add(convectiveMesh);
    parts.push({
        name: "Convective Zone",
        description: "Outer layer where turbulent convection transports energy. Turbulences excite the p-modes.",
        material: "convectiveZoneMaterial",
        function: "Turbulent excitation of acoustic pressure waves (p-modes) and outer boundary reflection.",
        assemblyOrder: 3,
        connections: ["Radiative Zone", "Surface Chromosphere"],
        failureEffect: "Loss of acoustic wave excitation, dampening of observable oscillations.",
        cascadeFailures: ["Surface oscillation collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        mesh: convectiveMesh
    });

    // 4. P-Mode Acoustic Waves (Pressure)
    const pModeWaves = [];
    for (let i = 0; i < 5; i++) {
        const waveGeometry = new THREE.TorusGeometry(3 + i * 0.4, 0.1, 16, 100);
        const waveMesh = new THREE.Mesh(waveGeometry, pModeWaveMaterial);
        waveMesh.rotation.x = Math.random() * Math.PI;
        waveMesh.rotation.y = Math.random() * Math.PI;
        group.add(waveMesh);
        pModeWaves.push(waveMesh);
    }
    
    parts.push({
        name: "P-Mode Waves (Acoustic)",
        description: "Pressure waves traveling through the stellar interior, reflecting off the surface.",
        material: "pModeWaveMaterial",
        function: "Probe the sound speed profile and internal rotation of the outer layers.",
        assemblyOrder: 4,
        connections: ["Convective Zone", "Stellar Surface"],
        failureEffect: "Lack of observable frequency spectra.",
        cascadeFailures: ["Information loss about interior structure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 2, z: 0 },
        mesh: pModeWaves[0]
    });

    // 5. G-Mode Waves (Gravity)
    const gModeWaves = [];
    for (let i = 0; i < 3; i++) {
        const waveGeometry = new THREE.TorusGeometry(2 + i * 0.3, 0.05, 16, 100);
        const waveMesh = new THREE.Mesh(waveGeometry, gModeWaveMaterial);
        waveMesh.rotation.x = Math.random() * Math.PI;
        waveMesh.rotation.z = Math.random() * Math.PI;
        group.add(waveMesh);
        gModeWaves.push(waveMesh);
    }

    parts.push({
        name: "G-Mode Waves (Gravity)",
        description: "Buoyancy waves confined to the deep interior radiative zone, carrying information about the core.",
        material: "gModeWaveMaterial",
        function: "Probe the deep stellar core's rotation and density profile.",
        assemblyOrder: 5,
        connections: ["Radiative Zone", "Stellar Core"],
        failureEffect: "Inability to probe the deep core directly.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 6, y: -2, z: 0 },
        mesh: gModeWaves[0]
    });

    // 6. Observation Satellite Sensor Platform
    const satGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
    const satellite = new THREE.Mesh(satGeometry, aluminum);
    
    const panelGeo = new THREE.PlaneGeometry(2, 1);
    const panel1 = new THREE.Mesh(panelGeo, tinted);
    panel1.position.set(0, 0.5, 0);
    satellite.add(panel1);
    
    satellite.position.set(8, 5, 8);
    satellite.lookAt(0,0,0);
    group.add(satellite);
    
    parts.push({
        name: "Photometric Telescope",
        description: "Space telescope observing minute variations in stellar luminosity caused by the acoustic waves.",
        material: "aluminum / tinted",
        function: "Measures precise light curves to perform Fourier analysis and extract oscillation frequencies.",
        assemblyOrder: 6,
        connections: ["Telemetry System"],
        failureEffect: "Loss of oscillation data collection.",
        cascadeFailures: ["Mission failure"],
        originalPosition: { x: 8, y: 5, z: 8 },
        explodedPosition: { x: 12, y: 8, z: 12 },
        mesh: satellite
    });

    const description = "Astroseismology Acoustic Waves Simulator: Visualizes the complex interplay of internal pressure (p-modes) and gravity (g-modes) waves that cause a star to ring like a bell. These waves allow astronomers to deduce the internal structure, density, and rotation profile of stars.";

    const quizQuestions = [
        {
            question: "What provides the restoring force for p-modes (acoustic waves) in a star?",
            options: ["Gravity", "Magnetic Fields", "Pressure", "Radiation"],
            correct: 2,
            explanation: "P-modes are acoustic waves where pressure acts as the restoring force. They travel mainly through the outer layers and are reflected just below the stellar surface.",
            difficulty: "Medium"
        },
        {
            question: "Why are g-modes (gravity waves) difficult to detect on the stellar surface?",
            options: ["They don't exist in stars", "They are trapped deep in the radiative zone and highly attenuated in the convective zone", "Their frequencies are too high to measure", "They only occur during supernovae"],
            correct: 1,
            explanation: "G-modes, governed by buoyancy, are trapped in the radiative interior. By the time they reach the surface through the convective zone, their amplitudes are tiny.",
            difficulty: "Hard"
        },
        {
            question: "What primarily excites the acoustic oscillations (p-modes) in solar-like stars?",
            options: ["Nuclear fusion pulses", "Turbulent convection near the surface", "Tidal forces from exoplanets", "Magnetic reconnection events"],
            correct: 1,
            explanation: "In solar-like stars, the oscillations are stochastically excited by the turbulent convection occurring in the outer envelope.",
            difficulty: "Medium"
        }
    ];

    let timeOffset = 0;

    function animate(time, speed, meshes) {
        timeOffset += speed * 0.05;

        // Core pulsation
        const coreScale = 1.0 + 0.02 * Math.sin(timeOffset * 5);
        if(meshes["Stellar Core"]) meshes["Stellar Core"].scale.set(coreScale, coreScale, coreScale);
        
        // Convective zone surface pulsation (complex modes)
        const convectiveScale = 1.0 + 0.01 * (Math.sin(timeOffset * 3) + Math.cos(timeOffset * 4.2));
        if(meshes["Convective Zone"]) meshes["Convective Zone"].scale.set(convectiveScale, convectiveScale, convectiveScale);
        
        // P-modes propagating (expanding/contracting toroids)
        pModeWaves.forEach((wave, i) => {
            wave.rotation.x += 0.01 * speed * (i % 2 === 0 ? 1 : -1);
            wave.rotation.y += 0.015 * speed;
            const s = 1.0 + 0.1 * Math.sin(timeOffset * 4 + i);
            wave.scale.set(s, s, s);
            wave.material.opacity = 0.2 + 0.2 * Math.sin(timeOffset * 2 + i);
        });

        // G-modes propagating (slower, deep interior)
        gModeWaves.forEach((wave, i) => {
            wave.rotation.z += 0.005 * speed * (i % 2 === 0 ? 1 : -1);
            wave.rotation.x += 0.008 * speed;
            const s = 1.0 + 0.05 * Math.sin(timeOffset * 1.5 + i);
            wave.scale.set(s, s, s);
            wave.material.opacity = 0.2 + 0.2 * Math.sin(timeOffset + i);
        });
        
        // Radiative zone slowly rotates
        if(meshes["Radiative Zone"]) meshes["Radiative Zone"].rotation.y += 0.002 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticWaves() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
