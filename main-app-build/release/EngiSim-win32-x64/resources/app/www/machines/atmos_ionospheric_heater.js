import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 0.5,
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x9900ff,
        emissiveIntensity: 0.6,
    });

    // 1. Base Platform (Steel/Dark Steel)
    const baseGeo = new THREE.BoxGeometry(40, 2, 40);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -1, 0);
    group.add(base);
    parts.push({
        name: "Foundation Platform",
        description: "A massive concrete and steel reinforced foundation designed to absorb the intense vibrations and ground currents.",
        material: "Dark Steel",
        function: "Provides stable support and grounding for the massive antenna array.",
        assemblyOrder: 1,
        connections: ["Antenna Array", "Power Generator"],
        failureEffect: "Structural instability leading to misalignment of the phased array.",
        cascadeFailures: ["Array collapse", "Power phase desynchronization"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 },
        mesh: base
    });

    // 2. Phased Array Antenna Network (Aluminum / Copper)
    // Create a grid of antennas
    const arrayGroup = new THREE.Group();
    const antennaGeo = new THREE.CylinderGeometry(0.2, 0.2, 15, 8);
    const crossbarGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    
    let antennaIndex = 0;
    for (let x = -15; x <= 15; x += 5) {
        for (let z = -15; z <= 15; z += 5) {
            const antMesh = new THREE.Mesh(antennaGeo, aluminum);
            antMesh.position.set(x, 7.5, z);
            arrayGroup.add(antMesh);
            
            // Add a cross dipole
            const cross1 = new THREE.Mesh(crossbarGeo, copper);
            cross1.rotation.z = Math.PI / 2;
            cross1.position.set(x, 14, z);
            arrayGroup.add(cross1);

            const cross2 = new THREE.Mesh(crossbarGeo, copper);
            cross2.rotation.x = Math.PI / 2;
            cross2.position.set(x, 14, z);
            arrayGroup.add(cross2);
            
            // Add a glowing emitter at the top
            const emitterGeo = new THREE.SphereGeometry(0.5, 16, 16);
            const emitterMesh = new THREE.Mesh(emitterGeo, glowBlue);
            emitterMesh.position.set(x, 15, z);
            emitterMesh.userData = { type: 'emitter', x, z }; // for animation
            arrayGroup.add(emitterMesh);
            antennaIndex++;
        }
    }
    group.add(arrayGroup);
    parts.push({
        name: "Phased Antenna Array",
        description: "A high-frequency phased array transmitter grid capable of directing precisely focused radio waves.",
        material: "Aluminum & Copper",
        function: "Emits coordinated HF signals to excite specific regions of the ionosphere.",
        assemblyOrder: 2,
        connections: ["Foundation Platform", "Transmitter Modules", "Phase Controllers"],
        failureEffect: "Loss of focused beam, scattering RF energy harmlessly or destructively.",
        cascadeFailures: ["Transmitter module burnout from reflection"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 },
        mesh: arrayGroup
    });

    // 3. Central Transmitter / Control Core (Chrome / Tinted Glass)
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.BoxGeometry(8, 6, 8);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreGroup.position.set(0, 3, 0);
    coreGroup.add(coreMesh);

    const windowGeo = new THREE.PlaneGeometry(6, 4);
    const coreWindow = new THREE.Mesh(windowGeo, tinted);
    coreWindow.position.set(0, 0, 4.01);
    coreGroup.add(coreWindow);
    
    // Core glowing lines
    const coreTrimGeo = new THREE.BoxGeometry(8.2, 0.5, 8.2);
    const coreTrim = new THREE.Mesh(coreTrimGeo, neonPurple);
    coreGroup.add(coreTrim);

    group.add(coreGroup);
    parts.push({
        name: "Control & Transmitter Core",
        description: "The heavily shielded central hub housing the massive RF transmitters, phase-locking systems, and diagnostic supercomputers.",
        material: "Chrome, Lead, Tinted Glass",
        function: "Generates the raw RF power and orchestrates the complex phase shifts required for beam steering.",
        assemblyOrder: 3,
        connections: ["Phased Antenna Array", "Cooling System", "Power Substation"],
        failureEffect: "Total system shutdown. Inability to generate or control the RF output.",
        cascadeFailures: ["Data loss", "Uncontrolled energy release"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 20 },
        mesh: coreGroup
    });

    // 4. Power Substation & Capacitors (Steel / Red Glow)
    const powerGroup = new THREE.Group();
    const subGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
    const subMesh1 = new THREE.Mesh(subGeo, steel);
    subMesh1.rotation.z = Math.PI / 2;
    subMesh1.position.set(-10, 2, 25);
    powerGroup.add(subMesh1);

    const subMesh2 = new THREE.Mesh(subGeo, steel);
    subMesh2.rotation.z = Math.PI / 2;
    subMesh2.position.set(10, 2, 25);
    powerGroup.add(subMesh2);

    const conduitGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 2, 25),
        new THREE.Vector3(-10, 1, 10),
        new THREE.Vector3(0, 1, 5)
    ]), 20, 0.5, 8, false);
    const conduit = new THREE.Mesh(conduitGeo, rubber);
    powerGroup.add(conduit);

    const energyCoreGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const energyCore1 = new THREE.Mesh(energyCoreGeo, glowRed);
    energyCore1.position.set(-14, 2, 25);
    powerGroup.add(energyCore1);
    
    const energyCore2 = new THREE.Mesh(energyCoreGeo, glowRed);
    energyCore2.position.set(14, 2, 25);
    powerGroup.add(energyCore2);

    group.add(powerGroup);
    parts.push({
        name: "High-Voltage Power Substation",
        description: "A colossal power conditioning array that converts raw grid power into clean, high-amperage direct current for the transmitters.",
        material: "Steel, Rubber, Copper",
        function: "Stores and delivers the multi-megawatt power spikes required during active transmission.",
        assemblyOrder: 4,
        connections: ["Control & Transmitter Core", "External Power Grid"],
        failureEffect: "Brownouts, or explosive capacitor failure under load.",
        cascadeFailures: ["Transmitter undervoltage", "Grid feedback loop"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 },
        mesh: powerGroup
    });

    // 5. Plasma Diagnostics Beam (Glass / Glow)
    const diagGroup = new THREE.Group();
    const diagBaseGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const diagBase = new THREE.Mesh(diagBaseGeo, darkSteel);
    diagBase.position.set(25, 2, 0);
    diagGroup.add(diagBase);

    const diagLaserGeo = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
    const diagLaser = new THREE.Mesh(diagLaserGeo, glowBlue);
    diagLaser.position.set(25, 14, 0);
    diagGroup.add(diagLaser);

    group.add(diagGroup);
    parts.push({
        name: "LIDAR Diagnostic Array",
        description: "An integrated atmospheric LIDAR and diagnostic laser used to measure ionospheric density in real-time.",
        material: "Dark Steel, Optics",
        function: "Provides feedback telemetry to adjust the phased array's targeting and frequency.",
        assemblyOrder: 5,
        connections: ["Control & Transmitter Core"],
        failureEffect: "Blind firing. The system cannot adjust to atmospheric changes.",
        cascadeFailures: ["Targeting drift", "Ineffective energy deposition"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 },
        mesh: diagGroup
    });

    const description = "The Atmospheric Ionospheric Heater (often compared to HAARP) is a massive phased-array radio transmitter designed to inject high-frequency radio energy into the ionosphere. By precisely controlling the phase of hundreds of individual antennas, it can focus multi-megawatt beams to temporarily heat specific regions of the upper atmosphere, causing them to expand and alter their reflective properties. This is primarily used for advanced communication and atmospheric physics research.";

    const quizQuestions = [
        {
            question: "How does the Ionospheric Heater focus its radio beam?",
            options: [
                "By using a giant parabolic dish mirror.",
                "By mechanically tilting the entire array of antennas.",
                "By altering the phase of the signal emitted by each individual antenna (Phased Array).",
                "By using powerful magnetic lenses to bend the radio waves."
            ],
            correct: 2,
            explanation: "The array functions as a 'phased array'. By carefully timing (phasing) when the signal leaves each fixed antenna, the resulting waves interfere constructively in a specific direction, allowing electronic steering without moving parts.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary effect of the emitted HF radiation on the targeted section of the ionosphere?",
            options: [
                "It freezes the plasma, creating a solid shield.",
                "It excites the electrons, heating the plasma and causing that region to temporarily expand.",
                "It completely destroys the ozone layer in that sector.",
                "It creates a permanent black hole in the atmosphere."
            ],
            correct: 1,
            explanation: "The high-frequency energy excites the electrons in the ionospheric plasma. This localized heating causes the plasma to expand and its density to change, which is useful for studying plasma physics and radio wave propagation.",
            difficulty: "Hard"
        },
        {
            question: "Why does the facility require such a massive high-voltage power substation?",
            options: [
                "To power the massive mechanical motors that rotate the antennas.",
                "To generate the multi-megawatt bursts of RF energy required to affect the upper atmosphere.",
                "To keep the facility warm in cold climates.",
                "To power the extremely bright neon lights for aircraft warning."
            ],
            correct: 1,
            explanation: "Heating the ionosphere, which is tens to hundreds of kilometers away, requires immense amounts of power. The transmitters typically require gigawatts of effective radiated power (ERP), necessitating huge power substations.",
            difficulty: "Easy"
        }
    ];

    let timeOffset = 0;

    const animate = (time, speed, meshes) => {
        timeOffset += speed * 0.05;
        
        // Pulse the purple core trim
        const coreTrimIntensity = 0.6 + Math.sin(timeOffset * 2) * 0.3;
        neonPurple.emissiveIntensity = coreTrimIntensity;

        // Pulse the red power cores
        const powerPulse = 0.5 + Math.abs(Math.sin(timeOffset * 4)) * 0.5;
        glowRed.emissiveIntensity = powerPulse;

        // Animate the phased array emitters
        // Create a sweeping wave effect across the grid
        arrayGroup.children.forEach(child => {
            if (child.userData.type === 'emitter') {
                const { x, z } = child.userData;
                // Complex wave function based on position
                const wave = Math.sin((x * 0.2) + (z * 0.2) - (timeOffset * 3));
                
                // Emissive pulse
                const pulse = Math.max(0.1, wave);
                
                // Scale emitters based on wave
                const scale = 1 + pulse * 0.8;
                child.scale.set(scale, scale, scale);
            }
        });
        
        // Modulate the shared material intensity slightly based on a global pulse
        glowBlue.emissiveIntensity = 0.5 + Math.sin(timeOffset * 5) * 0.5;
        
        // Rotate the diagnostic lidar beam
        diagGroup.rotation.y = timeOffset * 0.5;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createIonosphericHeaterArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
