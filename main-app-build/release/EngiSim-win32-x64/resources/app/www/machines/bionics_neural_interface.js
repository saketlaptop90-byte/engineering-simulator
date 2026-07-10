import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing/neon materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2
    });

    const neonPurple = new THREE.MeshPhysicalMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.7
    });
    
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.8
    });

    // 1. Cerebral Hub
    const hubGeo = new THREE.CylinderGeometry(1.5, 1.2, 1.0, 64);
    const hub = new THREE.Mesh(hubGeo, chrome);
    hub.position.set(0, 6, 0);
    group.add(hub);
    
    // Core detail in hub
    const coreGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const core = new THREE.Mesh(coreGeo, neonBlue);
    core.position.set(0, 0, 0);
    hub.add(core);

    parts.push({
        name: "Cerebral Hub",
        description: "Primary neuro-processing core linking the biological brain to cybernetic systems. Houses the quantum intent translator.",
        material: "chrome / neonBlue",
        function: "Data translation and motor intent processing",
        assemblyOrder: 1,
        connections: ["Spinal Array", "Nerve Splices", "Cervical Collar"],
        failureEffect: "Complete motor control loss",
        cascadeFailures: ["Synaptic Overload", "Sensory Deprivation"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: hub
    });

    // 2. Spinal Array
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, 2, -0.5);
    const numSegments = 10;
    for (let i = 0; i < numSegments; i++) {
        const segGroup = new THREE.Group();
        segGroup.position.set(0, 3 - i * 0.75, Math.sin(i * 0.2) * 0.3); // Slight curvature
        
        // Vertebra block
        const segGeo = new THREE.BoxGeometry(1.4, 0.6, 1.2);
        const seg = new THREE.Mesh(segGeo, darkSteel);
        segGroup.add(seg);
        
        // Synaptic coupler nodes
        const couplerGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
        const couplerL = new THREE.Mesh(couplerGeo, neonPurple);
        couplerL.position.set(-0.8, 0, 0);
        couplerL.rotation.y = Math.PI / 2;
        segGroup.add(couplerL);

        const couplerR = new THREE.Mesh(couplerGeo, neonPurple);
        couplerR.position.set(0.8, 0, 0);
        couplerR.rotation.y = Math.PI / 2;
        segGroup.add(couplerR);

        // Core data bus
        const busGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.75, 16);
        const bus = new THREE.Mesh(busGeo, neonOrange);
        bus.position.set(0, -0.375, 0);
        segGroup.add(bus);

        spineGroup.add(segGroup);
    }
    group.add(spineGroup);
    
    parts.push({
        name: "Spinal Array",
        description: "Titanium-alloy articulated column replacing or augmenting the biological spine with ultra-high bandwidth data buses.",
        material: "darkSteel / neonOrange",
        function: "Structural support and high-bandwidth signal bussing",
        assemblyOrder: 2,
        connections: ["Cerebral Hub", "Synaptic Couplers", "Motor Nodes"],
        failureEffect: "Localized paralysis",
        cascadeFailures: ["Signal Latency", "Loss of Proprioception"],
        originalPosition: { x: 0, y: 2, z: -0.5 },
        explodedPosition: { x: 0, y: 2, z: -5 },
        mesh: spineGroup
    });

    // 3. Nerve Splices (Fiber-optic bundles)
    const spliceGroup = new THREE.Group();
    spliceGroup.position.set(0, 5, 0);
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5),
            new THREE.Vector3(Math.cos(angle)*2.5, -1, Math.sin(angle)*2.5),
            new THREE.Vector3(Math.cos(angle)*1.8, -3, Math.sin(angle)*1.8),
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const fiber = new THREE.Mesh(tubeGeo, neonBlue);
        spliceGroup.add(fiber);
    }
    group.add(spliceGroup);

    parts.push({
        name: "Nerve Splices",
        description: "Glowing fiber-optic bundles splicing directly into the biological spinal cord for full-body prosthesis control.",
        material: "neonBlue",
        function: "Biological neural signal acquisition and transmission",
        assemblyOrder: 3,
        connections: ["Cerebral Hub", "Biological Nerves"],
        failureEffect: "Sensory feedback distortion",
        cascadeFailures: ["Phantom Pain", "Motor Twitching"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 5, y: 5, z: 0 },
        mesh: spliceGroup
    });

    // 4. Cervical Collar
    const collarGeo = new THREE.CylinderGeometry(2.2, 2.5, 1.8, 32, 1, true, 0, Math.PI);
    const collar = new THREE.Mesh(collarGeo, aluminum);
    collar.position.set(0, 4.5, 0);
    collar.rotation.y = Math.PI;
    
    // Inner padding
    const paddingGeo = new THREE.CylinderGeometry(2.1, 2.4, 1.9, 32, 1, true, 0, Math.PI);
    const padding = new THREE.Mesh(paddingGeo, rubber);
    collar.add(padding);

    group.add(collar);
    parts.push({
        name: "Cervical Collar",
        description: "Reinforced mounting bracket with shock-absorbing rubber anchoring the interface to the cranium and upper spine.",
        material: "aluminum / rubber",
        function: "Mechanical stability and shock absorption",
        assemblyOrder: 4,
        connections: ["Cerebral Hub", "Spinal Array", "Biological Skeleton"],
        failureEffect: "Interface misalignment",
        cascadeFailures: ["Tissue Rejection", "Spinal Compression"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: -5, y: 4.5, z: 0 },
        mesh: collar
    });


    const description = "The Cybernetic Spinal Link is an ultra high-tech neural interface designed for seamless full-body prosthesis control. It intercepts motor signals directly from the brain stem, translates them via a quantum intent processor in the Cerebral Hub, and relays them through a segmented, high-bandwidth synthetic Spinal Array.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cerebral Hub?",
            options: [
                "Structural support and shock absorption", 
                "Data translation and motor intent processing", 
                "Nutrient delivery to biological nerves", 
                "Thermal dissipation"
            ],
            correct: 1,
            explanation: "The Cerebral Hub acts as the primary processing core, translating biological motor intents into digital signals for cybernetic systems.",
            difficulty: "Medium"
        },
        {
            question: "What failure effect occurs if the Nerve Splices are damaged?",
            options: [
                "Localized paralysis", 
                "Complete power loss", 
                "Sensory feedback distortion and Phantom Pain", 
                "Interface misalignment"
            ],
            correct: 2,
            explanation: "Nerve Splices handle sensory and signal acquisition. Damage to them disrupts the biological-to-digital translation, leading to sensory feedback distortion and potential phantom pain.",
            difficulty: "Hard"
        },
        {
            question: "Which component is responsible for mechanical stability and anchoring to the cranium?",
            options: [
                "Synaptic Couplers", 
                "Nerve Splices", 
                "Cervical Collar", 
                "Spinal Array"
            ],
            correct: 2,
            explanation: "The Cervical Collar serves as a reinforced mounting bracket with shock-absorbing padding to provide mechanical stability.",
            difficulty: "Easy"
        },
        {
            question: "What color material is used for the core data bus within the Spinal Array?",
            options: ["Neon Blue", "Neon Purple", "Chrome", "Neon Orange"],
            correct: 3,
            explanation: "The core data bus linking the vertebrae of the Spinal Array uses the glowing Neon Orange material.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        const timeFactor = time * speed;

        // 1. Cerebral Hub Core pulsing and rotation
        const hubPart = parts.find(p => p.name === "Cerebral Hub");
        if (hubPart && hubPart.mesh) {
            const core = hubPart.mesh.children[0];
            if (core) {
                core.rotation.y += 0.05 * speed;
                core.rotation.x += 0.03 * speed;
                core.scale.setScalar(1 + Math.sin(timeFactor * 4) * 0.08);
            }
        }

        // 2. Spine Array undulating slightly and pulsing data bus
        const spinePart = parts.find(p => p.name === "Spinal Array");
        if (spinePart && spinePart.mesh) {
            spinePart.mesh.children.forEach((segGroup, i) => {
                // Undulation
                segGroup.rotation.x = Math.sin(timeFactor * 2 + i * 0.4) * 0.05;
                
                // Pulsing data bus (3rd child)
                const bus = segGroup.children[2];
                if (bus && bus.material) {
                    const intensity = 1.5 + Math.sin(timeFactor * 8 - i) * 1.5;
                    bus.material.emissiveIntensity = Math.max(0.5, intensity);
                }

                // Synaptic Couplers rotating (1st and 2nd children)
                const couplerL = segGroup.children[1];
                const couplerR = segGroup.children[2]; // Wait, 1 and 2 are couplers, 3 is bus. Indexing: 0=seg, 1=L, 2=R, 3=bus
                if (segGroup.children[1]) segGroup.children[1].rotation.z += 0.1 * speed;
                if (segGroup.children[2]) segGroup.children[2].rotation.z -= 0.1 * speed;
            });
        }

        // 3. Nerve Splices animated colors/opacity
        const splicesPart = parts.find(p => p.name === "Nerve Splices");
        if (splicesPart && splicesPart.mesh) {
            splicesPart.mesh.rotation.y = Math.sin(timeFactor * 0.5) * 0.2; // Gentle twist
            
            splicesPart.mesh.children.forEach((fiber, i) => {
                const pulse = Math.sin(timeFactor * 5 + i) * 0.5 + 0.5;
                if (fiber.material) {
                    fiber.material.emissiveIntensity = 1 + pulse * 3;
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createNeuralInterface() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
