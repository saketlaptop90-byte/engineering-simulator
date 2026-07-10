import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Core glowing material for the CMOS sensor
    const glowingSensorMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });

    // Optic nerve glow
    const nerveGlowMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    // Lens material
    const advancedLensMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.5,
        thickness: 0.5,
    });

    // 1. Sclera Shell (Outer casing)
    const scleraGeo = new THREE.SphereGeometry(2, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.85); // Open at the front
    const sclera = new THREE.Mesh(scleraGeo, plastic);
    sclera.rotation.x = Math.PI / 2;
    group.add(sclera);
    parts.push({
        name: "Titanium-Polymer Sclera",
        description: "The resilient outer shell providing structural integrity to the synthetic eye.",
        material: "Advanced Polymer",
        function: "Protects internal components from impact and electromagnetic interference.",
        assemblyOrder: 1,
        connections: ["Neural Interface", "Internal Chassis"],
        failureEffect: "Exposure of internal components to external elements.",
        cascadeFailures: ["Sensor Degradation", "Lens Misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: sclera
    });

    // 2. Cornea Dome
    const corneaGeo = new THREE.SphereGeometry(1.8, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const cornea = new THREE.Mesh(corneaGeo, advancedLensMat);
    cornea.position.z = 1.1;
    cornea.rotation.x = -Math.PI / 2;
    group.add(cornea);
    parts.push({
        name: "Synthetic Cornea",
        description: "A scratch-resistant, highly transmissive outer dome.",
        material: "Sapphire Glass",
        function: "Focuses incoming light and protects the iris and lens.",
        assemblyOrder: 8,
        connections: ["Sclera Shell", "Iris Mechanism"],
        failureEffect: "Blurry vision and potential damage to internal optics.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 1.1 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: cornea
    });

    // 3. Mechanical Iris
    const irisGroup = new THREE.Group();
    irisGroup.position.z = 0.8;
    const numBlades = 12;
    const irisBlades = [];
    for (let i = 0; i < numBlades; i++) {
        const bladeGeo = new THREE.BoxGeometry(1.2, 0.4, 0.05);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        
        // Pivot point
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / numBlades) * Math.PI * 2;
        
        blade.position.x = 1.0; 
        blade.rotation.z = Math.PI / 4;
        
        pivot.add(blade);
        irisGroup.add(pivot);
        irisBlades.push(pivot);
    }
    group.add(irisGroup);
    parts.push({
        name: "Mechanical Iris",
        description: "A dynamic aperture adjusting to varying light conditions instantly.",
        material: "Dark Steel / Chrome",
        function: "Regulates light reaching the CMOS sensor.",
        assemblyOrder: 7,
        connections: ["Cornea Dome", "CMOS Sensor"],
        failureEffect: "Sensor overload in bright light or blindness in dark.",
        cascadeFailures: ["CMOS Burnout"],
        originalPosition: { x: 0, y: 0, z: 0.8 },
        explodedPosition: { x: 0, y: -3, z: 3 },
        mesh: irisGroup,
        blades: irisBlades
    });

    // 4. Crystalline Lens Array
    const lensGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.5;
    group.add(lens);
    parts.push({
        name: "Adaptive Lens Array",
        description: "A liquid-crystal lens capable of instantaneous focus switching.",
        material: "Liquid Crystal / Glass",
        function: "Fine-tunes the focal point of incoming light onto the sensor.",
        assemblyOrder: 6,
        connections: ["Mechanical Iris", "Internal Chassis"],
        failureEffect: "Inability to focus on near or distant objects.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.5 },
        explodedPosition: { x: 3, y: 0, z: 2 },
        mesh: lens
    });

    // 5. CMOS Image Sensor
    const sensorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const sensor = new THREE.Mesh(sensorGeo, glowingSensorMat);
    sensor.rotation.x = Math.PI / 2;
    sensor.position.z = -0.2;
    group.add(sensor);
    parts.push({
        name: "Quantum CMOS Sensor",
        description: "An ultra-high-resolution, photon-counting imaging sensor.",
        material: "Silicon / Quantum Dots",
        function: "Converts light into digital neural signals.",
        assemblyOrder: 5,
        connections: ["Adaptive Lens Array", "Processing Unit"],
        failureEffect: "Complete loss of visual data.",
        cascadeFailures: ["Visual Cortex Deprivation"],
        originalPosition: { x: 0, y: 0, z: -0.2 },
        explodedPosition: { x: -3, y: 0, z: 1 },
        mesh: sensor
    });

    // 6. Neural Processing Unit
    const processorGeo = new THREE.BoxGeometry(1.5, 1.5, 0.4);
    const processor = new THREE.Mesh(processorGeo, chrome);
    processor.position.z = -0.8;
    group.add(processor);
    parts.push({
        name: "Neural Processing Core",
        description: "On-board AI for edge-processing of visual data, enhancing contrast and object recognition.",
        material: "Chrome / Silicon",
        function: "Processes raw sensor data before sending to the brain.",
        assemblyOrder: 4,
        connections: ["CMOS Sensor", "Neural Interface"],
        failureEffect: "Loss of object recognition and visual enhancements.",
        cascadeFailures: ["Signal Latency"],
        originalPosition: { x: 0, y: 0, z: -0.8 },
        explodedPosition: { x: 3, y: 3, z: -1 },
        mesh: processor
    });

    // 7. Internal Chassis/Housing
    const chassisGeo = new THREE.CylinderGeometry(1.6, 1.2, 1.2, 32);
    const chassis = new THREE.Mesh(chassisGeo, aluminum);
    chassis.rotation.x = Math.PI / 2;
    chassis.position.z = -0.4;
    group.add(chassis);
    parts.push({
        name: "Internal Support Chassis",
        description: "The internal framework holding the optic components in perfect alignment.",
        material: "Aluminum",
        function: "Provides structural support for the sensor, lens, and processor.",
        assemblyOrder: 3,
        connections: ["Sclera Shell", "Processing Unit"],
        failureEffect: "Misalignment of optical components.",
        cascadeFailures: ["Blurry Vision", "Component Rattling"],
        originalPosition: { x: 0, y: 0, z: -0.4 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: chassis
    });

    // 8. Neural Interface Cable (Optic Nerve)
    const nerveGroup = new THREE.Group();
    nerveGroup.position.z = -1.5;
    
    const nerveCoreGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const nerveCore = new THREE.Mesh(nerveCoreGeo, nerveGlowMat);
    nerveCore.rotation.x = Math.PI / 2;
    nerveCore.position.z = -1;
    nerveGroup.add(nerveCore);

    const nerveSheathGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 16);
    const nerveSheath = new THREE.Mesh(nerveSheathGeo, rubber);
    nerveSheath.rotation.x = Math.PI / 2;
    nerveSheath.position.z = -0.9;
    nerveGroup.add(nerveSheath);

    group.add(nerveGroup);
    parts.push({
        name: "Neural Interface Trunk",
        description: "The cybernetic equivalent of the optic nerve, transmitting terabytes of data directly to the visual cortex.",
        material: "Rubber / Superconductors",
        function: "Interfaces the synthetic eye with the biological brain.",
        assemblyOrder: 2,
        connections: ["Processing Unit", "Visual Cortex"],
        failureEffect: "Complete blindness and severe neural feedback.",
        cascadeFailures: ["Neural Shock"],
        originalPosition: { x: 0, y: 0, z: -1.5 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: nerveGroup
    });

    const description = "The Advanced Cybernetic Optic (Synthetic Eye) is a pinnacle of bionic engineering. It replaces a biological eye with superior technology, featuring a high-resolution quantum CMOS sensor, dynamic mechanical iris, and on-board neural processing for real-time visual enhancement and HUD overlays.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Mechanical Iris in the synthetic eye?",
            options: [
                "To interface directly with the visual cortex.",
                "To regulate the amount of light reaching the CMOS sensor.",
                "To process object recognition data.",
                "To provide structural support to the cornea."
            ],
            correct: 1,
            explanation: "Like a biological iris, the mechanical iris adjusts its aperture to control light intake, protecting the sensor from overload in bright conditions.",
            difficulty: "Easy"
        },
        {
            question: "Which component is responsible for edge-processing visual data before it reaches the brain?",
            options: [
                "Quantum CMOS Sensor",
                "Adaptive Lens Array",
                "Neural Processing Core",
                "Neural Interface Trunk"
            ],
            correct: 2,
            explanation: "The Neural Processing Core performs on-board AI enhancements, such as contrast adjustment and object recognition, reducing the cognitive load on the brain.",
            difficulty: "Medium"
        },
        {
            question: "A failure in the Titanium-Polymer Sclera could cascade into which of the following issues?",
            options: [
                "Immediate Neural Shock",
                "Inability to focus on distant objects",
                "Sensor Degradation and Lens Misalignment",
                "Overload of the Neural Interface"
            ],
            correct: 2,
            explanation: "The Sclera protects the internal components. Its failure exposes them to the environment, leading to sensor degradation and structural misalignment.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the iris opening and closing slowly
        const irisPart = parts.find(p => p.name === "Mechanical Iris");
        if (irisPart && irisPart.blades) {
            const pulse = Math.sin(time * speed * 2) * 0.2 + 0.3; // values between 0.1 and 0.5
            irisPart.blades.forEach(bladePivot => {
                // Adjust rotation of the blade to simulate aperture opening/closing
                bladePivot.children[0].rotation.z = Math.PI / 4 + pulse;
            });
        }

        // Pulse the CMOS sensor glow
        const sensorPart = parts.find(p => p.name === "Quantum CMOS Sensor");
        if (sensorPart) {
            sensorPart.mesh.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 5) * 0.5;
        }

        // Subtle rotation of the entire eye mimicking saccadic movements
        const saccade = Math.sin(time * speed * 10) > 0.9 ? 0.05 : 0;
        group.rotation.y = Math.sin(time * speed) * 0.1 + (Math.random() - 0.5) * saccade;
        group.rotation.x = Math.cos(time * speed * 0.8) * 0.1 + (Math.random() - 0.5) * saccade;
        
        // Pulse nerve glow
        if (nerveGlowMat) {
             nerveGlowMat.emissiveIntensity = 1.0 + Math.sin(time * speed * -10) * 0.5;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSyntheticEye() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
