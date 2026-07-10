import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const glowingWashcoat = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        emissive: 0xff4400, 
        emissiveIntensity: 0.5, 
        roughness: 0.8, 
        metalness: 0.2 
    });
    
    const sensorGlow = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.8,
        roughness: 0.3
    });

    // 1. Casing / Shell
    const casingGeo = new THREE.CylinderGeometry(2.1, 2.1, 8, 32, 1, true);
    const casing = new THREE.Mesh(casingGeo, chrome);
    casing.rotation.z = Math.PI / 2;
    group.add(casing);
    meshes.casing = casing;
    
    parts.push({
        name: 'Outer Casing',
        description: 'Stainless steel outer shell protecting the internal components.',
        material: 'chrome',
        function: 'Provides structural integrity, houses the catalyst substrates, and contains exhaust gases.',
        assemblyOrder: 3,
        connections: ['Inlet Cone', 'Outlet Cone', 'Heat Shield'],
        failureEffect: 'Exhaust leaks, loud noise, failed emissions test.',
        cascadeFailures: ['O2 sensor misreadings due to pressure loss', 'Heat damage to undercarriage'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 2. Ceramic Honeycomb Substrate (Catalyst)
    const substrateGeo = new THREE.CylinderGeometry(2, 2, 7.8, 32);
    const substrate = new THREE.Mesh(substrateGeo, glowingWashcoat);
    substrate.rotation.z = Math.PI / 2;
    group.add(substrate);
    meshes.substrate = substrate;

    parts.push({
        name: 'Ceramic Honeycomb Substrate',
        description: 'Ceramic core coated with precious metals (Platinum, Palladium, Rhodium).',
        material: 'glowingWashcoat',
        function: 'Reduces toxic gases (NOx, CO, unburnt HC) via oxidation and reduction reactions.',
        assemblyOrder: 1,
        connections: ['Outer Casing'],
        failureEffect: 'Increased toxic emissions, check engine light (P0420/P0430).',
        cascadeFailures: ['Engine power loss if clogged', 'Excessive fuel consumption'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Inlet Cone
    const inletGeo = new THREE.CylinderGeometry(1, 2.1, 3, 32);
    const inlet = new THREE.Mesh(inletGeo, steel);
    inlet.rotation.z = Math.PI / 2;
    inlet.position.set(-5.5, 0, 0);
    group.add(inlet);
    meshes.inlet = inlet;

    parts.push({
        name: 'Inlet Cone',
        description: 'Tapered entrance pipe expanding from the exhaust manifold to the converter shell.',
        material: 'steel',
        function: 'Directs hot exhaust gases from the engine evenly across the substrate face.',
        assemblyOrder: 2,
        connections: ['Exhaust Manifold', 'Outer Casing', 'Upstream O2 Sensor'],
        failureEffect: 'Exhaust gas leakage before catalyst processing.',
        cascadeFailures: ['Erratic upstream O2 sensor readings'],
        originalPosition: { x: -5.5, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 }
    });

    // 4. Outlet Cone
    const outletGeo = new THREE.CylinderGeometry(2.1, 1, 3, 32);
    const outlet = new THREE.Mesh(outletGeo, steel);
    outlet.rotation.z = Math.PI / 2;
    outlet.position.set(5.5, 0, 0);
    group.add(outlet);
    meshes.outlet = outlet;

    parts.push({
        name: 'Outlet Cone',
        description: 'Tapered exit pipe connecting to the rest of the exhaust system.',
        material: 'steel',
        function: 'Channels the treated exhaust gases toward the muffler.',
        assemblyOrder: 4,
        connections: ['Outer Casing', 'Downstream O2 Sensor', 'Resonator/Muffler'],
        failureEffect: 'Post-catalyst exhaust leaks.',
        cascadeFailures: ['Downstream O2 sensor errors', 'Increased noise'],
        originalPosition: { x: 5.5, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // 5. Upstream O2 Sensor
    const o2Geo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const o2Up = new THREE.Mesh(o2Geo, sensorGlow);
    o2Up.position.set(-5, 1.5, 0);
    group.add(o2Up);
    meshes.o2Up = o2Up;

    parts.push({
        name: 'Upstream O2 Sensor',
        description: 'Oxygen sensor mounted before the catalytic converter.',
        material: 'sensorGlow',
        function: 'Monitors the oxygen levels in the untreated exhaust to adjust the engine air-fuel ratio.',
        assemblyOrder: 5,
        connections: ['Inlet Cone', 'ECU'],
        failureEffect: 'Poor fuel economy, engine runs rich/lean, rough idle.',
        cascadeFailures: ['Catalytic converter overheating and melting (due to rich mixture)'],
        originalPosition: { x: -5, y: 1.5, z: 0 },
        explodedPosition: { x: -5, y: 4, z: 0 }
    });

    // 6. Downstream O2 Sensor
    const o2Down = new THREE.Mesh(o2Geo, sensorGlow);
    o2Down.position.set(5, 1.5, 0);
    group.add(o2Down);
    meshes.o2Down = o2Down;

    parts.push({
        name: 'Downstream O2 Sensor',
        description: 'Oxygen sensor mounted after the catalytic converter.',
        material: 'sensorGlow',
        function: 'Verifies the efficiency of the catalytic converter by comparing O2 levels with the upstream sensor.',
        assemblyOrder: 6,
        connections: ['Outlet Cone', 'ECU'],
        failureEffect: 'Check engine light (catalyst efficiency below threshold).',
        cascadeFailures: ['Inability to pass emissions testing'],
        originalPosition: { x: 5, y: 1.5, z: 0 },
        explodedPosition: { x: 5, y: 4, z: 0 }
    });

    const description = "A high-tech Catalytic Converter visualization. It transforms toxic exhaust gases into less harmful pollutants through chemical reactions catalyzed by precious metals.";

    const quizQuestions = [
        {
            question: "Which precious metals are most commonly used in the honeycomb washcoat of a catalytic converter?",
            options: ["Gold, Silver, and Bronze", "Platinum, Palladium, and Rhodium", "Iron, Nickel, and Copper", "Tungsten, Titanium, and Cobalt"],
            correct: 1,
            explanation: "Platinum, Palladium, and Rhodium serve as the primary catalysts for oxidation (reducing CO and HC) and reduction (reducing NOx) reactions.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the downstream O2 sensor?",
            options: ["To adjust the engine's air-fuel mixture", "To measure the exhaust gas temperature", "To monitor the efficiency of the catalytic converter", "To increase exhaust backpressure"],
            correct: 2,
            explanation: "While the upstream sensor adjusts the air-fuel mixture, the downstream sensor verifies that the converter is actually scrubbing the exhaust gases by comparing readings.",
            difficulty: "Medium"
        },
        {
            question: "What happens if an engine runs excessively 'rich' (too much fuel) for an extended period?",
            options: ["The catalytic converter cleans the exhaust more efficiently", "The substrate can overheat and melt, clogging the exhaust", "The outer shell becomes stronger", "The upstream O2 sensor produces more electricity"],
            correct: 1,
            explanation: "Unburnt fuel entering the hot catalytic converter ignites, causing extreme temperatures that can melt the ceramic honeycomb substrate, leading to severe exhaust blockage.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, currentMeshes) {
        // Pulsating glow on the substrate simulating heat and chemical reactions
        const heatPulse = (Math.sin(time * speed * 2) + 1) / 2;
        glowingWashcoat.emissiveIntensity = 0.4 + heatPulse * 0.6;
        
        // Sensor glowing
        const sensorPulse = (Math.cos(time * speed * 5) + 1) / 2;
        sensorGlow.emissiveIntensity = 0.3 + sensorPulse * 0.7;

        // Slight vibration of the entire assembly simulating engine running
        group.position.y = Math.sin(time * speed * 20) * 0.02;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCatalyticConverter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
