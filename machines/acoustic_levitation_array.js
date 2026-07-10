import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // High-tech glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const glowingPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.5,
        side: THREE.DoubleSide
    });
    
    const glowingWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2.0,
        roughness: 0,
        metalness: 0.1
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(4.5, 5, 0.6, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Base Platform",
        description: "Heavy structural base housing the primary power supply, amplifiers, and stabilizing the array.",
        material: "Dark Steel",
        function: "Provides structural integrity, grounding, and power distribution.",
        assemblyOrder: 1,
        connections: ["Vertical Supports", "Control Unit"],
        failureEffect: "Mechanical instability causing acoustic nodes to shift, dropping levitated objects.",
        cascadeFailures: ["Transducer Misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // 2. Control Unit & Signal Generator
    const controlGeo = new THREE.BoxGeometry(2.5, 1.2, 1.8);
    const controlMesh = new THREE.Mesh(controlGeo, chrome);
    controlMesh.position.set(0, 0.9, 3);
    baseMesh.add(controlMesh); // attached to base
    
    // Glowing panel on control unit
    const panelGeo = new THREE.PlaneGeometry(2, 0.8);
    const panelMesh = new THREE.Mesh(panelGeo, glowingBlue);
    panelMesh.position.set(0, 0, 0.91);
    controlMesh.add(panelMesh);
    
    meshes.controlUnit = controlMesh;
    parts.push({
        name: "DSP Control Unit",
        description: "Digital signal processor generating high-frequency oscillations.",
        material: "Chrome / Electronics",
        function: "Generates synchronized 40kHz signals with microsecond phase control.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Bottom Transducers", "Top Transducers"],
        failureEffect: "Loss of acoustic standing wave or phase mismatch.",
        cascadeFailures: ["Levitated Particle Drops"],
        originalPosition: { x: 0, y: 0.9, z: 3 },
        explodedPosition: { x: 0, y: 0.9, z: 8 }
    });

    // 3. Vertical Support Columns
    const supportGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 32);
    const supports = new THREE.Group();
    const positions = [
        [-3.5, 4.3, -3.5],
        [3.5, 4.3, -3.5],
        [-3.5, 4.3, 3.5],
        [3.5, 4.3, 3.5]
    ];
    positions.forEach(pos => {
        const support = new THREE.Mesh(supportGeo, steel);
        support.position.set(...pos);
        
        // Add rubber dampeners
        const dampenerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 32);
        const dampenerBottom = new THREE.Mesh(dampenerGeo, rubber);
        dampenerBottom.position.set(0, -3.8, 0);
        const dampenerTop = new THREE.Mesh(dampenerGeo, rubber);
        dampenerTop.position.set(0, 3.8, 0);
        
        support.add(dampenerBottom);
        support.add(dampenerTop);
        supports.add(support);
    });
    group.add(supports);
    meshes.supports = supports;
    parts.push({
        name: "Vertical Support Columns",
        description: "Rigid steel columns maintaining exact spacing between transducer arrays.",
        material: "Steel & Rubber Dampeners",
        function: "Maintains exact acoustic resonance cavity length while isolating external vibrations.",
        assemblyOrder: 3,
        connections: ["Base Platform", "Top Transducer Plate", "Bottom Transducer Plate"],
        failureEffect: "Distance alteration disrupts standing wave resonance.",
        cascadeFailures: ["Standing Wave Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -8 }
    });

    // 4. Bottom Transducer Plate
    const plateGeo = new THREE.CylinderGeometry(4, 4, 0.4, 64);
    const bottomPlate = new THREE.Mesh(plateGeo, aluminum);
    bottomPlate.position.set(0, 1.2, 0);
    group.add(bottomPlate);
    meshes.bottomPlate = bottomPlate;
    parts.push({
        name: "Bottom Transducer Plate",
        description: "Precision-machined aluminum plate mounting the lower phased-array transducers.",
        material: "Aluminum",
        function: "Provides a rigid, heat-dissipating mount for the lower transducers.",
        assemblyOrder: 4,
        connections: ["Vertical Supports", "Bottom Transducers"],
        failureEffect: "Acoustic reflection interference due to warping.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 5. Top Transducer Plate
    const topPlate = new THREE.Mesh(plateGeo, aluminum);
    topPlate.position.set(0, 7.4, 0);
    group.add(topPlate);
    meshes.topPlate = topPlate;
    parts.push({
        name: "Top Transducer Plate",
        description: "Precision-machined aluminum plate mounting the upper phased-array transducers.",
        material: "Aluminum",
        function: "Provides a rigid mount for the upper array, directing waves downwards.",
        assemblyOrder: 5,
        connections: ["Vertical Supports", "Top Transducers"],
        failureEffect: "Loss of reflective or opposing wave boundaries.",
        cascadeFailures: ["Standing Wave Collapse"],
        originalPosition: { x: 0, y: 7.4, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // Helper to generate transducers
    function createTransducerArray(isTop) {
        const tGroup = new THREE.Group();
        const tGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16);
        let count = 0;
        
        // Concentric rings
        for (let r = 0; r <= 3.2; r += 0.4) {
            const num = Math.max(1, Math.floor(2 * Math.PI * r / 0.4));
            for (let i = 0; i < num; i++) {
                if (r === 0 && i > 0) continue;
                const angle = (i / num) * Math.PI * 2;
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                
                const t = new THREE.Mesh(tGeo, copper);
                t.position.set(x, isTop ? -0.25 : 0.25, z);
                
                // Add a small glowing tip
                const tipGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16);
                const tip = new THREE.Mesh(tipGeo, glowingBlue);
                tip.position.y = isTop ? -0.25 : 0.25;
                t.add(tip);

                tGroup.add(t);
                count++;
            }
        }
        return tGroup;
    }

    // 6. Bottom Transducers
    const transducersBottom = createTransducerArray(false);
    bottomPlate.add(transducersBottom);
    meshes.transducersBottom = transducersBottom;
    parts.push({
        name: "Bottom Ultrasonic Transducers",
        description: "Dense array of piezoelectric ceramic elements generating 40kHz sound waves.",
        material: "Copper / Piezoelectric Ceramics",
        function: "Emits high-pressure, phase-controlled ultrasonic waves upwards.",
        assemblyOrder: 6,
        connections: ["Bottom Transducer Plate", "Control Unit"],
        failureEffect: "Weak or asymmetrical acoustic pressure.",
        cascadeFailures: ["Particle Drops"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: -0.5, z: 0 }
    });

    // 7. Top Transducers
    const transducersTop = createTransducerArray(true);
    topPlate.add(transducersTop);
    meshes.transducersTop = transducersTop;
    parts.push({
        name: "Top Ultrasonic Transducers",
        description: "Dense array of piezoelectric elements synchronized perfectly with the bottom array.",
        material: "Copper / Piezoelectric Ceramics",
        function: "Emits opposing high-pressure ultrasonic waves to form stable standing nodes.",
        assemblyOrder: 7,
        connections: ["Top Transducer Plate", "Control Unit"],
        failureEffect: "Unbalanced acoustic pressure.",
        cascadeFailures: ["Particle Ejection"],
        originalPosition: { x: 0, y: 7.4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 8. Acoustic Standing Waves (Visualizer)
    const waveGeo = new THREE.CylinderGeometry(3.2, 3.2, 5.8, 64, 32, true);
    // Displace vertices to make it look like a wavy field
    const posAttribute = waveGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        // Create nodes
        const radiusScale = 0.8 + 0.2 * Math.sin(y * Math.PI * 2);
        posAttribute.setX(i, posAttribute.getX(i) * radiusScale);
        posAttribute.setZ(i, posAttribute.getZ(i) * radiusScale);
    }
    waveGeo.computeVertexNormals();

    const waveMesh = new THREE.Mesh(waveGeo, glowingPurple);
    waveMesh.position.set(0, 4.3, 0);
    group.add(waveMesh);
    meshes.waves = waveMesh;
    parts.push({
        name: "Acoustic Standing Waves",
        description: "Visual representation of the high-pressure acoustic antinodes and low-pressure nodes.",
        material: "Glowing Energy/Holographic",
        function: "Traps matter in low-pressure nodes surrounded by high acoustic radiation pressure.",
        assemblyOrder: 8,
        connections: [],
        failureEffect: "Visualizer only.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.3, z: 0 },
        explodedPosition: { x: 10, y: 4.3, z: 0 }
    });

    // 9. Levitated Particle
    const particleGeo = new THREE.IcosahedronGeometry(0.35, 2);
    const particleMesh = new THREE.Mesh(particleGeo, glowingWhite);
    particleMesh.position.set(0, 4.3, 0);
    
    // Add an inner core to the particle
    const coreGeo = new THREE.IcosahedronGeometry(0.15, 1);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    particleMesh.add(coreMesh);

    group.add(particleMesh);
    meshes.particle = particleMesh;
    parts.push({
        name: "Levitated Sample",
        description: "A metallic or liquid sample suspended completely in mid-air.",
        material: "Glowing Matter / Chrome",
        function: "Demonstrates containerless handling via acoustic radiation pressure.",
        assemblyOrder: 9,
        connections: ["Acoustic Standing Waves"],
        failureEffect: "Sample falls or is violently ejected.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.3, z: 0 },
        explodedPosition: { x: 0, y: 4.3, z: 0 }
    });

    const description = "The Acoustic Levitation Array utilizes synchronized arrays of piezoelectric ultrasonic transducers to emit 40kHz sound waves. By precisely aligning opposing arrays, it creates a macroscopic standing wave pattern in the air. Acoustic radiation pressure generates localized low-pressure 'nodes' where small objects—from liquid droplets to electronic components—can be stably trapped and levitated. This enables containerless processing, advanced material synthesis, and biological sample handling without surface contamination.";

    const quizQuestions = [
        {
            question: "What frequency range is most commonly utilized for acoustic levitation in air?",
            options: [
                "20 Hz - 200 Hz (Infrasound)",
                "2 kHz - 5 kHz (Audible frequencies)",
                "40 kHz (Ultrasound)",
                "2.4 GHz (Microwave)"
            ],
            correct: 2,
            explanation: "40 kHz is standard because it is above human hearing thresholds, avoiding auditory damage, while providing an ideal wavelength (approx 8.5mm) for trapping mm-sized objects.",
            difficulty: "Medium"
        },
        {
            question: "By what exact mechanism does an acoustic levitator hold an object against gravity?",
            options: [
                "Magnetic repulsion",
                "A continuous blast of acoustic wind pushing from below",
                "Trapping the object in an acoustic pressure node of a standing wave",
                "Ionizing the air around the object to create lift"
            ],
            correct: 2,
            explanation: "The interference of waves from opposing arrays creates a standing wave. Objects are stably trapped in the pressure nodes (points of minimal acoustic pressure) surrounded by high-pressure antinodes.",
            difficulty: "Hard"
        },
        {
            question: "Why is precise micrometer spacing between the top and bottom transducer plates critical?",
            options: [
                "To maintain the exact cavity length required for a resonant standing wave",
                "To prevent electrical arcing between the top and bottom arrays",
                "To ensure the levitated object doesn't get crushed",
                "To keep the base from tipping over due to weight imbalance"
            ],
            correct: 0,
            explanation: "The distance between arrays must be a precise integer multiple of half-wavelengths. If misaligned, the standing wave cavity loses resonance and the levitation capability collapses.",
            difficulty: "Medium"
        },
        {
            question: "What primarily dictates the maximum size of the object that can be stably levitated?",
            options: [
                "The mechanical weight limit of the support columns",
                "Roughly half the wavelength of the emitted sound wave",
                "The speed of sound in a vacuum",
                "The electrical conductivity of the levitated sample"
            ],
            correct: 1,
            explanation: "Objects larger than roughly half the wavelength (around 4-5mm for 40kHz waves in air) scatter and disrupt the acoustic field too severely to remain stably trapped.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, passedMeshes) {
        // Fallback to internal meshes if passedMeshes isn't provided
        const m = passedMeshes || meshes;
        const baseSpeed = time * speed;

        if (m.particle) {
            // Complex trapping oscillation
            m.particle.position.y = 4.3 + Math.sin(baseSpeed * 8) * 0.04;
            m.particle.position.x = Math.cos(baseSpeed * 12) * 0.02;
            m.particle.position.z = Math.sin(baseSpeed * 15) * 0.02;
            
            m.particle.rotation.x += 0.02 * speed;
            m.particle.rotation.y += 0.03 * speed;
            
            // Pulsating glow
            m.particle.material.emissiveIntensity = 1.5 + Math.sin(baseSpeed * 10) * 0.8;
        }

        if (m.waves) {
            // Animate standing wave visualizer flowing effect
            m.waves.material.opacity = 0.3 + Math.sin(baseSpeed * 10) * 0.15;
            
            // Rotate the holographic field slightly
            m.waves.rotation.y = baseSpeed * 0.5;
            
            // Pulse scale
            const scalePulse = 1 + Math.sin(baseSpeed * 20) * 0.01;
            m.waves.scale.set(scalePulse, 1, scalePulse);
        }

        if (m.transducersBottom) {
            // High-frequency vibration effect
            const vib = Math.sin(baseSpeed * 200) * 0.005;
            m.transducersBottom.position.y = vib;
        }

        if (m.transducersTop) {
            const vib = Math.sin(baseSpeed * 200 + Math.PI) * 0.005;
            m.transducersTop.position.y = vib;
        }
        
        if (m.controlUnit) {
            // Pulse the LED panel on the control unit
            m.controlUnit.children.forEach(child => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = 1 + Math.sin(baseSpeed * 8) * 0.6;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAcousticLevitationArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
