import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for visual flair
    const hotGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3300,
        emissive: 0xaa1100,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const coldGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const highTechSteel = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.9,
        roughness: 0.4
    });

    function createPart(name, geometry, material, origPos, explPos, rotation = {x:0,y:0,z:0}) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        
        // High-tech wireframe overlay
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 }));
        mesh.add(line);
        
        group.add(mesh);
        meshes[name] = mesh;
        return mesh;
    }

    // 1. Turbine Housing (Hot Side)
    createPart('TurbineHousing', 
        new THREE.TorusGeometry(2, 1, 16, 64, Math.PI * 1.8), 
        hotGlowMaterial, 
        {x:-3, y:0, z:0}, {x:-8, y:0, z:0});
    
    parts.push({
        name: 'Turbine Housing',
        description: 'Cast iron or high-temp alloy housing that directs exhaust gas onto the turbine wheel.',
        material: 'Hot-Glow Alloy',
        function: 'Channels high-energy exhaust gases to drive the turbine wheel.',
        assemblyOrder: 1,
        connections: ['Exhaust Manifold', 'CHRA', 'Wastegate'],
        failureEffect: 'Exhaust leaks, loss of turbo spool-up, extreme under-hood temperatures.',
        cascadeFailures: ['Fire hazard', 'Engine power loss', 'O2 sensor reading errors'],
        originalPosition: {x:-3, y:0, z:0},
        explodedPosition: {x:-8, y:0, z:0}
    });

    // 2. Turbine Wheel
    createPart('TurbineWheel', 
        new THREE.CylinderGeometry(1.5, 0.5, 1, 16), 
        chrome, 
        {x:-3, y:0, z:0}, {x:-6, y:0, z:0}, {x:0, y:0, z:Math.PI/2});
    
    parts.push({
        name: 'Turbine Wheel',
        description: 'Aerodynamically designed wheel that converts exhaust gas energy into mechanical rotation.',
        material: 'Inconel / Chrome',
        function: 'Spins up from exhaust gas flow, driving the shaft connected to the compressor.',
        assemblyOrder: 2,
        connections: ['Turbine Housing', 'Shaft'],
        failureEffect: 'No boost pressure, rattling noise, oil leakage into exhaust.',
        cascadeFailures: ['Catalytic converter damage from oil', 'Total engine power loss'],
        originalPosition: {x:-3, y:0, z:0},
        explodedPosition: {x:-6, y:0, z:0}
    });

    // 3. Shaft
    createPart('Shaft', 
        new THREE.CylinderGeometry(0.2, 0.2, 6, 16), 
        highTechSteel, 
        {x:0, y:0, z:0}, {x:0, y:0, z:0}, {x:0, y:0, z:Math.PI/2});
    
    parts.push({
        name: 'Connecting Shaft',
        description: 'High-strength steel shaft connecting the turbine and compressor wheels.',
        material: 'High-Tech Steel',
        function: 'Transmits rotational energy from the turbine wheel directly to the compressor wheel.',
        assemblyOrder: 3,
        connections: ['Turbine Wheel', 'Compressor Wheel', 'Journal Bearings'],
        failureEffect: 'Shaft snap, immediate turbo failure, metallic grinding.',
        cascadeFailures: ['Compressor wheel striking housing', 'Metal shards entering engine intake'],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0}
    });

    // 4. CHRA (Bearing Housing)
    createPart('CHRA', 
        new THREE.CylinderGeometry(1.2, 1.2, 2, 32), 
        darkSteel, 
        {x:0, y:0, z:0}, {x:0, y:3, z:0}, {x:0, y:0, z:Math.PI/2});

    parts.push({
        name: 'CHRA (Bearing Housing)',
        description: 'The core of the turbocharger housing the shaft, bearings, and oil/water passages.',
        material: 'Dark Steel / Cast Iron',
        function: 'Provides support, lubrication, and cooling for the high-speed rotating shaft.',
        assemblyOrder: 4,
        connections: ['Turbine Housing', 'Compressor Housing', 'Oil Lines', 'Coolant Lines'],
        failureEffect: 'Oil starvation, bearing seizure, overheating.',
        cascadeFailures: ['Shaft snap', 'Catastrophic oil consumption', 'Engine bearing damage'],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:3, z:0}
    });

    // 5. Compressor Wheel
    createPart('CompressorWheel', 
        new THREE.CylinderGeometry(0.5, 1.5, 1, 16), 
        aluminum, 
        {x:3, y:0, z:0}, {x:6, y:0, z:0}, {x:0, y:0, z:Math.PI/2});

    parts.push({
        name: 'Compressor Wheel',
        description: 'Billet or cast aluminum wheel with intricate fins to compress intake air.',
        material: 'Billet Aluminum',
        function: 'Draws in ambient air and compresses it before sending it to the engine intake.',
        assemblyOrder: 5,
        connections: ['Shaft', 'Compressor Housing'],
        failureEffect: 'Loss of boost, compressor surge, whining noise.',
        cascadeFailures: ['Metal shavings entering intercooler/engine', 'Engine detonation'],
        originalPosition: {x:3, y:0, z:0},
        explodedPosition: {x:6, y:0, z:0}
    });

    // 6. Compressor Housing (Cold Side)
    createPart('CompressorHousing', 
        new THREE.TorusGeometry(2.2, 1.2, 16, 64, Math.PI * 1.8), 
        coldGlowMaterial, 
        {x:3, y:0, z:0}, {x:8, y:0, z:0});

    parts.push({
        name: 'Compressor Housing',
        description: 'Snail-shaped aluminum housing enclosing the compressor wheel.',
        material: 'Cold-Glow Aluminum',
        function: 'Collects high-velocity air from the compressor wheel and slows it down to increase pressure.',
        assemblyOrder: 6,
        connections: ['CHRA', 'Intercooler Piping', 'Intake'],
        failureEffect: 'Boost leaks, whistling sound under load.',
        cascadeFailures: ['Over-speeding of turbo to compensate for leak', 'Rich air-fuel ratio'],
        originalPosition: {x:3, y:0, z:0},
        explodedPosition: {x:8, y:0, z:0}
    });

    // 7. Wastegate Actuator
    createPart('WastegateActuator', 
        new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16), 
        steel, 
        {x:-1, y:2.5, z:1}, {x:-1, y:5, z:4});

    parts.push({
        name: 'Wastegate Actuator',
        description: 'Pneumatic or electronic actuator that controls the wastegate valve.',
        material: 'Steel / Rubber diaphragm',
        function: 'Opens the wastegate valve at a specific boost pressure to prevent engine damage.',
        assemblyOrder: 7,
        connections: ['Compressor Housing (vacuum line)', 'Turbine Housing (valve linkage)'],
        failureEffect: 'Overboosting or underboosting.',
        cascadeFailures: ['Engine detonation/blowout (overboost)', 'Sluggish performance (underboost)'],
        originalPosition: {x:-1, y:2.5, z:1},
        explodedPosition: {x:-1, y:5, z:4}
    });

    const description = "A high-performance automotive turbocharger. It uses exhaust gas energy to spin a turbine, which in turn spins a compressor via a shared shaft. This forces more air into the engine cylinder, significantly increasing power output. Operating at speeds exceeding 100,000 RPM and extreme temperatures, it requires precise engineering, advanced materials, and robust lubrication/cooling systems.";

    const quizQuestions = [
        {
            question: "What is the primary function of the wastegate in a turbocharger system?",
            options: [
                "To release excess intake air when the throttle closes",
                "To cool down the center housing rotating assembly",
                "To bypass exhaust gas around the turbine to regulate boost pressure",
                "To compress air before it enters the engine"
            ],
            correct: 2,
            explanation: "The wastegate bypasses some of the exhaust gas around the turbine wheel, limiting its speed and thus regulating the maximum boost pressure produced by the compressor.",
            difficulty: "Medium"
        },
        {
            question: "Why is the turbine housing typically made of cast iron or specialized high-temperature alloys, while the compressor housing is usually aluminum?",
            options: [
                "Aluminum is too heavy for the exhaust side",
                "The turbine housing must withstand extreme exhaust temperatures (up to 1050°C), while the compressor side sees much lower ambient/compressed air temps",
                "Cast iron improves the aerodynamics of the exhaust flow better than aluminum",
                "It is purely for aesthetic reasons to distinguish hot and cold sides"
            ],
            correct: 1,
            explanation: "Exhaust gases can reach over 1000°C. Aluminum would melt or severely deform at these temperatures. The compressor handles cooler air (ambient to ~150°C after compression).",
            difficulty: "Hard"
        },
        {
            question: "What directly connects the turbine wheel to the compressor wheel?",
            options: [
                "A timing belt",
                "A high-strength solid steel shaft",
                "A fluid coupling",
                "A planetary gear set"
            ],
            correct: 1,
            explanation: "A single, solid metal shaft directly connects the turbine wheel to the compressor wheel, forcing them to spin at exactly the same speed.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshesObj) {
        // High-speed rotation of internal components
        const rpm = speed * 15; // Fast multiplier for turbo speeds
        
        // Rotating the shaft, turbine, and compressor. 
        // Because they were initialized with rotation.z = PI/2, their local Y axis is along the global X axis.
        // We use rotateY to spin them around their own length.
        if (meshesObj.TurbineWheel) meshesObj.TurbineWheel.rotateY(rpm);
        if (meshesObj.Shaft) meshesObj.Shaft.rotateY(rpm);
        if (meshesObj.CompressorWheel) meshesObj.CompressorWheel.rotateY(rpm);
        
        // Slight vibration of actuator based on 'boost' pressure simulation
        if (meshesObj.WastegateActuator) {
            meshesObj.WastegateActuator.position.y = 2.5 + Math.sin(time * speed * 20) * 0.05;
        }

        // Pulse the hot/cold glowing materials
        if (hotGlowMaterial) {
            hotGlowMaterial.emissiveIntensity = 0.6 + Math.sin(time * speed * 2) * 0.2;
        }
        if (coldGlowMaterial) {
            coldGlowMaterial.emissiveIntensity = 0.4 + Math.cos(time * speed * 2) * 0.1;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createTurbocharger() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
