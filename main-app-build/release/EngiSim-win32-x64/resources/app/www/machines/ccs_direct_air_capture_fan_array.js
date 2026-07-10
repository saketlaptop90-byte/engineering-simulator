import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/Neon Materials for Visual Flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });
    
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.0,
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 0.6,
        wireframe: true
    });

    const activeCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });

    // 1. Array Housing / Main Frame
    const frameGeom = new THREE.BoxGeometry(16, 16, 3);
    const frameMesh = new THREE.Mesh(frameGeom, darkSteel);
    group.add(frameMesh);
    
    parts.push({
        name: "Array Housing",
        description: "Massive dark steel framework supporting the 9-fan capture matrix.",
        material: "darkSteel",
        function: "Provides rigid structural support to withstand high wind loads and vibration.",
        assemblyOrder: 1,
        connections: ["Fan Array", "Sorbent Filters", "Collector Pipes"],
        failureEffect: "Structural collapse of the array.",
        cascadeFailures: ["Fan Array", "Sorbent Filters", "Collector Pipes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });
    
    // 2. Fan Array (3x3 Matrix)
    const fansGroup = new THREE.Group();
    meshes.fanBlades = [];
    meshes.fanRotors = [];
    
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            const posX = (x - 1) * 5;
            const posY = (y - 1) * 5;
            
            // Fan Casing
            const casingGeom = new THREE.TorusGeometry(2.2, 0.2, 16, 64);
            const casing = new THREE.Mesh(casingGeom, steel);
            casing.position.set(posX, posY, 1.5);
            fansGroup.add(casing);

            // Rotor
            const rotorGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
            rotorGeom.rotateX(Math.PI / 2);
            const rotor = new THREE.Mesh(rotorGeom, chrome);
            rotor.position.set(posX, posY, 1.5);
            fansGroup.add(rotor);
            meshes.fanRotors.push(rotor);

            // Blades (3 per fan)
            const bladeGroup = new THREE.Group();
            bladeGroup.position.set(posX, posY, 1.5);
            for (let b = 0; b < 3; b++) {
                const bladeGeom = new THREE.BoxGeometry(0.1, 2.0, 0.4);
                bladeGeom.translate(0, 1.2, 0);
                const blade = new THREE.Mesh(bladeGeom, aluminum);
                blade.rotation.z = (b * Math.PI * 2) / 3;
                blade.rotation.y = 0.3; // Pitch
                bladeGroup.add(blade);
            }
            fansGroup.add(bladeGroup);
            meshes.fanBlades.push(bladeGroup);
            
            // Central glow indicator
            const glowGeom = new THREE.SphereGeometry(0.3, 16, 16);
            const glow = new THREE.Mesh(glowGeom, neonBlue);
            glow.position.set(posX, posY, 1.7);
            fansGroup.add(glow);
        }
    }
    
    group.add(fansGroup);
    
    parts.push({
        name: "Turbofan Matrix",
        description: "3x3 array of high-throughput industrial fans with chrome rotors and aluminum blades.",
        material: "aluminum / chrome / steel",
        function: "Draws massive volumes of ambient air into the filter banks.",
        assemblyOrder: 2,
        connections: ["Array Housing", "Sorbent Filters"],
        failureEffect: "Reduced air intake, drastically lowering the CO2 capture rate.",
        cascadeFailures: ["Processing Core"],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // 3. Sorbent Filters
    const filterGroup = new THREE.Group();
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            const posX = (x - 1) * 5;
            const posY = (y - 1) * 5;
            const filterGeom = new THREE.BoxGeometry(4.5, 4.5, 2);
            const filter = new THREE.Mesh(filterGeom, neonPurple);
            filter.position.set(posX, posY, -1);
            filterGroup.add(filter);
        }
    }
    group.add(filterGroup);
    meshes.filters = filterGroup;
    
    parts.push({
        name: "Solid Sorbent Filter Banks",
        description: "Deep, glowing violet banks of solid sorbent materials that chemically bind to CO2 molecules.",
        material: "neonPurple (wireframe/emissive)",
        function: "Captures and strips CO2 from the incoming air stream.",
        assemblyOrder: 3,
        connections: ["Turbofan Matrix", "Collector Pipes"],
        failureEffect: "Air passes through without CO2 removal.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: 0, y: 0, z: -12 }
    });

    // 4. CO2 Processing Core and Collector Pipes
    const pipeGroup = new THREE.Group();
    const coreGeom = new THREE.CylinderGeometry(1.5, 1.5, 16, 32);
    const core = new THREE.Mesh(coreGeom, copper);
    core.position.set(10, 0, -1);
    pipeGroup.add(core);
    
    const coreGlowGeom = new THREE.TorusGeometry(1.6, 0.2, 16, 64);
    const coreGlow = new THREE.Mesh(coreGlowGeom, neonGreen);
    coreGlow.position.set(10, -5, -1);
    coreGlow.rotation.x = Math.PI / 2;
    pipeGroup.add(coreGlow);
    meshes.coreGlow = coreGlow;

    // Lateral pipes from filters to core
    for (let y = 0; y < 3; y++) {
        const posY = (y - 1) * 5;
        const pGeom = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
        pGeom.rotateZ(Math.PI / 2);
        const pMesh = new THREE.Mesh(pGeom, steel);
        pMesh.position.set(5, posY, -1);
        pipeGroup.add(pMesh);
    }

    group.add(pipeGroup);
    
    parts.push({
        name: "Collector Pipes & Processing Core",
        description: "Copper and steel piping system channeling pure CO2 to the main storage core.",
        material: "copper / steel",
        function: "Transports and compresses captured CO2 for deep geological sequestration.",
        assemblyOrder: 4,
        connections: ["Solid Sorbent Filter Banks"],
        failureEffect: "Captured CO2 leaks back into the atmosphere.",
        cascadeFailures: ["Solid Sorbent Filter Banks"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: -5 }
    });

    // 5. Ambient Particles (Air and CO2 visualizer)
    const particleGroup = new THREE.Group();
    const particleGeom = new THREE.SphereGeometry(0.12, 8, 8);
    meshes.particles = [];
    
    for (let i = 0; i < 200; i++) {
        const isCO2 = Math.random() > 0.6; // 40% CO2 for visualization purposes
        const pMesh = new THREE.Mesh(particleGeom, isCO2 ? neonGreen : neonBlue);
        pMesh.position.set(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 16,
            Math.random() * 20 + 5
        );
        pMesh.userData = { 
            speed: Math.random() * 0.2 + 0.1, 
            isCO2: isCO2,
            targetX: (Math.random() - 0.5) * 14,
            targetY: (Math.random() - 0.5) * 14
        };
        particleGroup.add(pMesh);
        meshes.particles.push(pMesh);
    }
    group.add(particleGroup);
    
    parts.push({
        name: "Visualized Atmosphere",
        description: "Glowing particles representing ambient air (blue) and CO2 molecules (green).",
        material: "neonBlue / neonGreen",
        function: "Illustrates the flow of air and the selective capture of carbon dioxide.",
        assemblyOrder: 5,
        connections: [],
        failureEffect: "None (Visual only)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 10 },
        explodedPosition: { x: 0, y: 0, z: 30 }
    });

    const description = "Direct Air Capture (DAC) Fan Array: A colossal, highly advanced atmospheric scrubber. It uses immense arrays of turbofans to pull vast quantities of ambient air through deep banks of chemically active solid sorbent filters. The filters selectively bind CO2 (visualized as glowing green particles) while letting clean air (blue particles) pass through. Once saturated, the filters are heated to release pure CO2, which is pumped via copper cores for permanent geological sequestration.";

    const quizQuestions = [
        {
            question: "What is the primary function of the solid sorbent filters in the DAC array?",
            options: [
                "To cool down the ambient air",
                "To chemically bind and remove CO2 from the air stream",
                "To generate electricity from wind",
                "To filter out dust and particulate matter only"
            ],
            correct: 1,
            explanation: "Sorbent filters contain chemicals that specifically bind with CO2 molecules as air passes through them, effectively stripping the greenhouse gas from the atmosphere.",
            difficulty: "easy"
        },
        {
            question: "Why are immense fan arrays necessary for Direct Air Capture systems?",
            options: [
                "Because CO2 concentration in ambient air is very low (around 0.04%), requiring massive volumes of air to be processed.",
                "To keep the sorbent filters from overheating during the day.",
                "To blow the captured CO2 directly into underground caverns.",
                "To scare away birds from the facility."
            ],
            correct: 0,
            explanation: "Since CO2 makes up only about 400 parts per million of the atmosphere, DAC plants must move and process enormous quantities of air to capture meaningful amounts of carbon.",
            difficulty: "medium"
        },
        {
            question: "In a real DAC plant, how is the captured CO2 typically released from the sorbent filters for storage?",
            options: [
                "By freezing the filters to absolute zero.",
                "By rapidly spinning the filters in a centrifuge.",
                "By heating the filters (thermal swing) or applying a vacuum, breaking the chemical bond.",
                "By washing the filters with massive amounts of fresh water."
            ],
            correct: 2,
            explanation: "Most solid sorbent DAC systems use a 'temperature-vacuum swing' process where the saturated filters are heated to around 100°C (often under a vacuum) to release high-purity CO2.",
            difficulty: "hard"
        }
    ];

    const animate = (time, speed, globalMeshes) => {
        const timeVal = time * speed;
        
        // Spin turbofan blades
        if (meshes.fanBlades) {
            meshes.fanBlades.forEach((bladeGroup) => {
                bladeGroup.rotation.z -= 0.15 * speed;
            });
        }
        
        // Pulse sorbent filters with a glowing neon effect
        if (meshes.filters) {
            const pulse = (Math.sin(timeVal * 3) + 1) / 2; // oscillates between 0 and 1
            meshes.filters.children.forEach(filter => {
                filter.material.emissiveIntensity = 0.3 + (pulse * 0.5);
            });
        }
        
        // Move core glow ring up and down the processing pipe
        if (meshes.coreGlow) {
            meshes.coreGlow.position.y = (Math.sin(timeVal * 2) * 6);
            meshes.coreGlow.rotation.z += 0.05 * speed;
        }
        
        // Animate incoming air and CO2 particles
        if (meshes.particles) {
            meshes.particles.forEach(p => {
                // Move towards the array structure
                p.position.z -= p.userData.speed * speed;
                p.position.x += (p.userData.targetX - p.position.x) * 0.02 * speed;
                p.position.y += (p.userData.targetY - p.position.y) * 0.02 * speed;
                
                // Once particle reaches the fan array depth
                if (p.position.z < 1.5) {
                    if (p.userData.isCO2) {
                        // CO2 is captured and sucked towards the right-side processing core
                        p.position.x += 0.4 * speed;
                        p.position.z = -1; // locked into the filter depth
                        if (p.position.x > 10) {
                            // Reset CO2 particle back to the front
                            p.position.set(
                                (Math.random() - 0.5) * 16,
                                (Math.random() - 0.5) * 16,
                                Math.random() * 10 + 20
                            );
                        }
                    } else {
                        // Clean air passes straight through the back
                        if (p.position.z < -10) {
                            // Reset air particle back to the front
                            p.position.set(
                                (Math.random() - 0.5) * 16,
                                (Math.random() - 0.5) * 16,
                                Math.random() * 10 + 20
                            );
                        }
                    }
                }
            });
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDirectAirCaptureFanArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
