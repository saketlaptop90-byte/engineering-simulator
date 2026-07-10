import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        metalness: 0.8,
        roughness: 0.2
    });

    const holographicMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.3,
        transmission: 0.9,
        side: THREE.DoubleSide
    });

    const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0055,
        transparent: true,
        opacity: 0.6
    });

    // 1. Base Chassis
    const baseGeom = new THREE.CylinderGeometry(4, 4.5, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Base Chassis",
        description: "Heavy-duty enclosure housing the primary power systems and dampening vibration from the transducer array.",
        material: "Dark Steel",
        function: "Provides structural stability and grounds acoustic resonance.",
        assemblyOrder: 1,
        connections: ["Quantum Processor", "Cooling Pipes"],
        failureEffect: "Structural instability leading to misalignment of the focal point.",
        cascadeFailures: ["Transducer Array", "Haptic Volume"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Quantum Processor Core
    const procGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const procMesh = new THREE.Mesh(procGeom, chrome);
    procMesh.position.set(0, 2.25, 0);
    group.add(procMesh);
    
    // Processor glow
    const procGlowGeom = new THREE.BoxGeometry(1.8, 0.6, 1.8);
    const procGlowMesh = new THREE.Mesh(procGlowGeom, neonCyan);
    procMesh.add(procGlowMesh);
    
    meshes.processor = procMesh;
    parts.push({
        name: "Phase-Shift Processor",
        description: "Ultra-high-speed computational unit calculating phase delays for millions of acoustic waves per second.",
        material: "Chrome / Neon Cyan",
        function: "Calculates precise interference patterns to create spatial tactile sensations.",
        assemblyOrder: 2,
        connections: ["Base Chassis", "Transducer Array"],
        failureEffect: "Haptic feedback becomes blurry or loses shape entirely.",
        cascadeFailures: ["Haptic Volume"],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    // 3. Transducer Array
    const arrayGroup = new THREE.Group();
    arrayGroup.position.set(0, 3, 0);
    const arrayGeom = new THREE.CylinderGeometry(3.5, 3.5, 0.5, 32);
    const arrayBaseMesh = new THREE.Mesh(arrayGeom, aluminum);
    arrayGroup.add(arrayBaseMesh);

    meshes.transducers = [];
    // Emitters
    for (let r = 0.5; r <= 3.0; r += 0.5) {
        let count = Math.floor(r * 8);
        for (let i = 0; i < count; i++) {
            let theta = (i / count) * Math.PI * 2;
            let tx = Math.cos(theta) * r;
            let tz = Math.sin(theta) * r;
            let transGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 8);
            let transMesh = new THREE.Mesh(transGeom, copper);
            transMesh.position.set(tx, 0.35, tz);
            arrayGroup.add(transMesh);
            meshes.transducers.push(transMesh);
        }
    }
    
    group.add(arrayGroup);
    meshes.arrayGroup = arrayGroup;
    parts.push({
        name: "Phased Transducer Array",
        description: "A dense grid of ultrasonic emitters that generate high-frequency sound waves.",
        material: "Aluminum / Copper",
        function: "Emits targeted ultrasonic waves that constructively interfere at specific focal points.",
        assemblyOrder: 3,
        connections: ["Phase-Shift Processor", "Metamaterial Lens"],
        failureEffect: "Loss of acoustic pressure, resulting in weak or non-existent tactile feedback.",
        cascadeFailures: ["Haptic Volume"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 4. Metamaterial Lens
    const lensGeom = new THREE.SphereGeometry(3.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.15);
    const lensMesh = new THREE.Mesh(lensGeom, tinted);
    lensMesh.position.set(0, 3.2, 0);
    lensMesh.rotation.x = Math.PI; // flip
    group.add(lensMesh);
    meshes.lens = lensMesh;
    parts.push({
        name: "Metamaterial Acoustic Lens",
        description: "A specially engineered acoustic metamaterial that pre-shapes the wave fronts emitted by the transducers.",
        material: "Tinted Acoustic Glass",
        function: "Enhances the focal precision and extends the range of the haptic projection.",
        assemblyOrder: 4,
        connections: ["Transducer Array"],
        failureEffect: "Scattering of acoustic energy, reducing efficiency and resolution.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3.2, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Cooling Pipes
    const coolingGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        let angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        let pGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8);
        let pMesh = new THREE.Mesh(pGeo, copper);
        pMesh.position.set(Math.cos(angle)*3, 2, Math.sin(angle)*3);
        coolingGroup.add(pMesh);
    }
    group.add(coolingGroup);
    meshes.cooling = coolingGroup;
    parts.push({
        name: "Liquid Cooling System",
        description: "Copper piping circulating cryogenic fluid to manage heat from the transducer array.",
        material: "Copper",
        function: "Prevents thermal degradation of the piezoelectric transducer elements.",
        assemblyOrder: 5,
        connections: ["Base Chassis", "Transducer Array"],
        failureEffect: "Thermal runaway causing transducer meltdown and permanent hardware damage.",
        cascadeFailures: ["Transducer Array"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 }
    });

    // 6. Haptic Projection Volume (Visualized)
    const hapticGroup = new THREE.Group();
    hapticGroup.position.set(0, 7, 0);
    
    // Center focal point
    const focalGeom = new THREE.SphereGeometry(1, 32, 32);
    const focalMesh = new THREE.Mesh(focalGeom, holographicMaterial);
    hapticGroup.add(focalMesh);
    meshes.focalMesh = focalMesh;

    // Rings around it
    meshes.rings = [];
    for(let i=1; i<=3; i++) {
        let ringGeo = new THREE.TorusGeometry(1 + i*0.4, 0.02, 8, 32);
        let ringMesh = new THREE.Mesh(ringGeo, neonCyan);
        ringMesh.rotation.x = Math.PI / 2;
        hapticGroup.add(ringMesh);
        meshes.rings.push(ringMesh);
    }

    group.add(hapticGroup);
    meshes.hapticGroup = hapticGroup;
    parts.push({
        name: "Haptic Projection Volume",
        description: "The targeted region in 3D space where acoustic waves constructively interfere to create tactile sensations.",
        material: "Holographic Energy",
        function: "Provides mid-air tactile feedback corresponding to virtual objects.",
        assemblyOrder: 6,
        connections: ["Transducer Array"],
        failureEffect: "Loss of user immersion.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 }
    });

    // 7. Tracking Sensors
    const sensorGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        let angle = (i/3) * Math.PI * 2;
        let sGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
        let sMesh = new THREE.Mesh(sGeo, steel);
        sMesh.position.set(Math.cos(angle)*4, 4, Math.sin(angle)*4);
        sMesh.lookAt(0, 7, 0);
        
        // laser beam
        let laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 4);
        let laserMesh = new THREE.Mesh(laserGeo, laserMaterial);
        laserMesh.position.set(0, 0, 2);
        laserMesh.rotation.x = Math.PI/2;
        sMesh.add(laserMesh);
        
        sensorGroup.add(sMesh);
    }
    group.add(sensorGroup);
    meshes.sensors = sensorGroup;
    parts.push({
        name: "Spatial Tracking Lasers",
        description: "High-speed LiDAR sensors tracking the user's hands in the projection space.",
        material: "Steel / Red Laser",
        function: "Provides real-time positional data to the phase processor to update the focal point.",
        assemblyOrder: 7,
        connections: ["Phase-Shift Processor"],
        failureEffect: "Haptic feedback occurs in the wrong spatial location.",
        cascadeFailures: ["Phase-Shift Processor"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 4, z: 4 }
    });

    const description = "The Acoustic Holographic Emitter uses a dense array of ultrasonic transducers to create complex 3D tactile shapes in mid-air. By precisely controlling the phase and amplitude of each emitter, sound waves constructively interfere at specific points in space, creating acoustic radiation pressure strong enough to be felt by the human hand.";

    const quizQuestions = [
        {
            question: "What physical principle allows the Acoustic Holographic Emitter to create localized pressure points?",
            options: [
                "Magnetic resonance",
                "Constructive interference of ultrasonic waves",
                "Thermal expansion of air",
                "Quantum entanglement"
            ],
            correct: 1,
            explanation: "Constructive interference occurs when multiple sound waves arrive at the same point in phase, their amplitudes adding together to create a region of high acoustic pressure.",
            difficulty: "Medium"
        },
        {
            question: "Why is a liquid cooling system critical for the transducer array?",
            options: [
                "To freeze the air for better sound conduction",
                "To cool the user's hands",
                "To dissipate heat generated by thousands of rapidly oscillating piezoelectric elements",
                "To lubricate the moving parts"
            ],
            correct: 2,
            explanation: "Piezoelectric transducers generate significant heat when driven at high frequencies and high power. Without cooling, they would overheat and fail.",
            difficulty: "Easy"
        },
        {
            question: "What is the role of the Phase-Shift Processor?",
            options: [
                "It colors the hologram",
                "It controls the volume of the sound",
                "It calculates the precise timing delays for each individual emitter",
                "It translates spoken words into ultrasound"
            ],
            correct: 2,
            explanation: "To focus sound at an arbitrary point in 3D space, the processor must calculate exact time delays (phase shifts) for every emitter so all their waves reach the focal point simultaneously.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Transducer pulsing effect
        if (meshes.transducers) {
            meshes.transducers.forEach((trans, index) => {
                const wave = Math.sin(t * 10 + index) * 0.5 + 0.5;
                trans.scale.y = 1 + wave * 0.5;
                trans.material.color.setHSL(0.1, 0.8, 0.3 + wave * 0.4);
            });
        }

        // Haptic volume distortion
        if (meshes.focalMesh) {
            const scalePulse = Math.sin(t * 5) * 0.1 + 1;
            meshes.focalMesh.scale.set(scalePulse, scalePulse, scalePulse);
            meshes.focalMesh.rotation.y += 0.02 * speed;
            meshes.focalMesh.rotation.z += 0.01 * speed;
        }

        if (meshes.rings) {
            meshes.rings.forEach((ring, index) => {
                ring.rotation.x = Math.PI/2 + Math.sin(t * 2 + index) * 0.2;
                ring.rotation.y = Math.cos(t * 1.5 + index) * 0.2;
                ring.scale.setScalar(1 + Math.sin(t * 3 - index) * 0.05);
            });
        }

        // Processor processing
        if (meshes.processor) {
            meshes.processor.children[0].material.opacity = Math.random() * 0.5 + 0.5;
        }
        
        // Sensor movement (tracking)
        if (meshes.sensors) {
            meshes.sensors.children.forEach((sensor, index) => {
                const targetY = 7 + Math.sin(t + index) * 1.5;
                const targetX = Math.cos(t * 0.5 + index);
                const targetZ = Math.sin(t * 0.5 + index);
                sensor.lookAt(targetX, targetY, targetZ);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAcousticHolographicEmitter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
