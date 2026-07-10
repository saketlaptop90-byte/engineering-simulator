import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingPurple = new THREE.MeshStandardMaterial({
        color: 0xcc00ff,
        emissive: 0xcc00ff,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.1
    });

    const glowingMix = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    // 1. Base Frame
    const baseGeo = new THREE.BoxGeometry(10, 1, 6);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.5, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Main Base Frame',
        description: 'Sturdy steel base providing structural integrity and vibration dampening for the mixing unit.',
        material: 'darkSteel',
        function: 'Structural support',
        assemblyOrder: 1,
        connections: ['Mixing Tank', 'Pump Housing'],
        failureEffect: 'Excessive vibration leading to part misalignment.',
        cascadeFailures: ['Tank Seal Failure', 'Pipe Fracture'],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: baseMesh
    });

    // 2. Main Mixing Tank
    const tankGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(0, 4, 0);
    group.add(tankMesh);
    parts.push({
        name: 'Primary Mixing Tank',
        description: 'Transparent high-pressure glass tank where macro and micro nutrients are blended with water.',
        material: 'glass',
        function: 'Fluid containment and mixing zone',
        assemblyOrder: 2,
        connections: ['Main Base Frame', 'Agitator Assembly', 'Nutrient Reservoirs'],
        failureEffect: 'Fluid leakage and catastrophic pressure loss.',
        cascadeFailures: ['Pump Cavitation', 'Short Circuit'],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -5 },
        mesh: tankMesh
    });

    // 3. Mixed Fluid (Inside Tank)
    const fluidGeo = new THREE.CylinderGeometry(2.4, 2.4, 5, 32);
    const fluidMesh = new THREE.Mesh(fluidGeo, glowingMix);
    fluidMesh.position.set(0, 3.5, 0);
    group.add(fluidMesh);
    parts.push({
        name: 'Nutrient Solution',
        description: 'The homogenized blend of water and essential plant nutrients.',
        material: 'glowingMix',
        function: 'Final output product',
        assemblyOrder: 3,
        connections: ['Primary Mixing Tank'],
        failureEffect: 'Inconsistent plant growth.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: 5 },
        mesh: fluidMesh
    });

    // 4. Central Agitator Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 7, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.position.set(0, 4, 0);
    group.add(shaftMesh);
    parts.push({
        name: 'Agitator Shaft',
        description: 'High-speed rotating central column that drives the mixing blades.',
        material: 'chrome',
        function: 'Transmits rotational force from motor to blades',
        assemblyOrder: 4,
        connections: ['Motor Drive', 'Mixing Blades'],
        failureEffect: 'Incomplete mixing of nutrients.',
        cascadeFailures: ['Nutrient Stratification', 'Plant Toxicity'],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: shaftMesh
    });

    // 5. Mixing Blades
    const bladeGeo = new THREE.BoxGeometry(4, 0.2, 0.5);
    const blade1Mesh = new THREE.Mesh(bladeGeo, aluminum);
    blade1Mesh.position.set(0, 2, 0);
    const blade2Mesh = new THREE.Mesh(bladeGeo, aluminum);
    blade2Mesh.position.set(0, 4, 0);
    blade2Mesh.rotation.y = Math.PI / 2;
    const blade3Mesh = new THREE.Mesh(bladeGeo, aluminum);
    blade3Mesh.position.set(0, 6, 0);
    blade3Mesh.rotation.y = Math.PI / 4;
    
    const bladesGroup = new THREE.Group();
    bladesGroup.add(blade1Mesh, blade2Mesh, blade3Mesh);
    bladesGroup.position.set(0, 0, 0);
    group.add(bladesGroup);
    parts.push({
        name: 'Impeller Blades',
        description: 'Multi-level blades designed to create vigorous turbulent flow for rapid homogenization.',
        material: 'aluminum',
        function: 'Fluid agitation',
        assemblyOrder: 5,
        connections: ['Agitator Shaft'],
        failureEffect: 'Poor nutrient dissolution.',
        cascadeFailures: ['Clogged Emitters'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: bladesGroup
    });

    // 6. Drive Motor
    const motorGeo = new THREE.CylinderGeometry(1, 1, 2, 16);
    const motorMesh = new THREE.Mesh(motorGeo, copper);
    motorMesh.position.set(0, 8, 0);
    group.add(motorMesh);
    parts.push({
        name: 'Variable Speed Drive Motor',
        description: 'High-torque electric motor powering the agitator assembly.',
        material: 'copper',
        function: 'Provides mechanical rotation',
        assemblyOrder: 6,
        connections: ['Agitator Shaft', 'Power Supply'],
        failureEffect: 'Complete halt of mixing process.',
        cascadeFailures: ['Nutrient Settling', 'System Timeout'],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: motorMesh
    });

    // 7. Micro-Nutrient Reservoir A
    const resAGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const resAMesh = new THREE.Mesh(resAGeo, tinted);
    resAMesh.position.set(-3.5, 3.5, 2);
    group.add(resAMesh);
    parts.push({
        name: 'Reservoir A (Nitrogen/Calcium)',
        description: 'Storage tank for the first phase of micro-nutrients.',
        material: 'tinted',
        function: 'Holds precursor fluid A',
        assemblyOrder: 7,
        connections: ['Dosing Pump A', 'Main Base Frame'],
        failureEffect: 'Deficiency in critical growth elements.',
        cascadeFailures: ['Plant Stunting'],
        originalPosition: { x: -3.5, y: 3.5, z: 2 },
        explodedPosition: { x: -7, y: 3.5, z: 4 },
        mesh: resAMesh
    });

    // Fluid A
    const fluidAGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.5, 16);
    const fluidAMesh = new THREE.Mesh(fluidAGeo, glowingBlue);
    fluidAMesh.position.set(-3.5, 3.25, 2);
    group.add(fluidAMesh);
    parts.push({
        name: 'Nutrient Fluid A',
        description: 'High-concentration Nitrogen mix.',
        material: 'glowingBlue',
        function: 'Provides N and Ca',
        assemblyOrder: 8,
        connections: ['Reservoir A'],
        failureEffect: 'Incorrect mix ratio.',
        cascadeFailures: [],
        originalPosition: { x: -3.5, y: 3.25, z: 2 },
        explodedPosition: { x: -7, y: 3.25, z: 6 },
        mesh: fluidAMesh
    });

    // 8. Micro-Nutrient Reservoir B
    const resBGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const resBMesh = new THREE.Mesh(resBGeo, tinted);
    resBMesh.position.set(-3.5, 3.5, -2);
    group.add(resBMesh);
    parts.push({
        name: 'Reservoir B (Phosphorus/Potassium)',
        description: 'Storage tank for the second phase of micro-nutrients.',
        material: 'tinted',
        function: 'Holds precursor fluid B',
        assemblyOrder: 9,
        connections: ['Dosing Pump B', 'Main Base Frame'],
        failureEffect: 'Poor root development and flowering.',
        cascadeFailures: ['Low Yield'],
        originalPosition: { x: -3.5, y: 3.5, z: -2 },
        explodedPosition: { x: -7, y: 3.5, z: -4 },
        mesh: resBMesh
    });

    // Fluid B
    const fluidBGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.5, 16);
    const fluidBMesh = new THREE.Mesh(fluidBGeo, glowingGreen);
    fluidBMesh.position.set(-3.5, 3.25, -2);
    group.add(fluidBMesh);
    parts.push({
        name: 'Nutrient Fluid B',
        description: 'High-concentration PK mix.',
        material: 'glowingGreen',
        function: 'Provides P and K',
        assemblyOrder: 10,
        connections: ['Reservoir B'],
        failureEffect: 'Incorrect mix ratio.',
        cascadeFailures: [],
        originalPosition: { x: -3.5, y: 3.25, z: -2 },
        explodedPosition: { x: -7, y: 3.25, z: -6 },
        mesh: fluidBMesh
    });

    // 9. pH Adjustment Reservoir
    const resPGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);
    const resPMesh = new THREE.Mesh(resPGeo, tinted);
    resPMesh.position.set(3.5, 3, 0);
    group.add(resPMesh);
    parts.push({
        name: 'pH Down Reservoir',
        description: 'Contains acidic solution for pH balancing.',
        material: 'tinted',
        function: 'Lowers pH of the nutrient mix',
        assemblyOrder: 11,
        connections: ['pH Sensor', 'Main Mixing Tank'],
        failureEffect: 'Nutrient lockout due to high pH.',
        cascadeFailures: ['Crop Loss'],
        originalPosition: { x: 3.5, y: 3, z: 0 },
        explodedPosition: { x: 7, y: 3, z: 0 },
        mesh: resPMesh
    });

    // Fluid pH
    const fluidPGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.8, 16);
    const fluidPMesh = new THREE.Mesh(fluidPGeo, glowingPurple);
    fluidPMesh.position.set(3.5, 2.9, 0);
    group.add(fluidPMesh);
    parts.push({
        name: 'Acidic Buffer',
        description: 'Phosphoric or nitric acid blend.',
        material: 'glowingPurple',
        function: 'pH control',
        assemblyOrder: 12,
        connections: ['pH Down Reservoir'],
        failureEffect: 'Unbalanced pH.',
        cascadeFailures: [],
        originalPosition: { x: 3.5, y: 2.9, z: 0 },
        explodedPosition: { x: 9, y: 2.9, z: 0 },
        mesh: fluidPMesh
    });

    // 10. Control Panel
    const panelGeo = new THREE.BoxGeometry(0.5, 3, 2);
    const panelMesh = new THREE.Mesh(panelGeo, plastic);
    panelMesh.position.set(0, 4, 3.5);
    group.add(panelMesh);
    parts.push({
        name: 'Logic Control Unit',
        description: 'Microcontroller interface managing sensor inputs and pump dosing schedules.',
        material: 'plastic',
        function: 'System automation and monitoring',
        assemblyOrder: 13,
        connections: ['Sensors', 'Pumps', 'Motor'],
        failureEffect: 'Total loss of automated control.',
        cascadeFailures: ['Tank Overflow', 'Over-dosing'],
        originalPosition: { x: 0, y: 4, z: 3.5 },
        explodedPosition: { x: 0, y: 4, z: 8 },
        mesh: panelMesh
    });

    // 11. Feed Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 16);
    const pipe1Mesh = new THREE.Mesh(pipeGeo, steel);
    pipe1Mesh.position.set(-1.75, 5, 2);
    pipe1Mesh.rotation.z = Math.PI / 2;
    group.add(pipe1Mesh);
    parts.push({
        name: 'Dosing Pipe A',
        description: 'Transfers Fluid A into the main tank.',
        material: 'steel',
        function: 'Fluid transport',
        assemblyOrder: 14,
        connections: ['Reservoir A', 'Main Mixing Tank'],
        failureEffect: 'Fluid leaks.',
        cascadeFailures: ['Loss of pressure'],
        originalPosition: { x: -1.75, y: 5, z: 2 },
        explodedPosition: { x: -3, y: 8, z: 4 },
        mesh: pipe1Mesh
    });

    const description = "The Agri Hydroponic Nutrient Mixer is an ultra-precise fluid blending system designed for modern controlled environment agriculture. It automatically doses exact ratios of macro and micro nutrients while continuously balancing the pH to ensure optimal plant uptake.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Impeller Blades in this system?",
            options: [
                "To regulate fluid temperature",
                "To create turbulent flow for rapid homogenization of nutrients",
                "To filter out solid particulates",
                "To pump the final mixture to the plants"
            ],
            correct: 1,
            explanation: "The Impeller Blades are driven by the central shaft and create vigorous turbulence to quickly and evenly dissolve concentrated nutrient fluids into the water base.",
            difficulty: "easy"
        },
        {
            question: "Why is the pH adjustment system critical in a hydroponic nutrient mixer?",
            options: [
                "It changes the color of the water for better aesthetics",
                "It prevents the growth of algae in the tank",
                "It ensures the solution's pH is within the optimal range for nutrient uptake, preventing nutrient lockout",
                "It acts as a cleaning agent for the pipes"
            ],
            correct: 2,
            explanation: "Plants can only absorb specific nutrients at specific pH levels. If the pH drifts out of the optimal range (typically 5.5 - 6.5 for hydroponics), plants suffer from 'nutrient lockout' even if the nutrients are present in the water.",
            difficulty: "medium"
        },
        {
            question: "What cascade failure is likely if the Logic Control Unit fails?",
            options: [
                "The tank glass will shatter due to low pressure",
                "The motor will reverse its direction",
                "Total loss of automated control leading to potential tank overflow or incorrect dosing ratios",
                "The impeller blades will melt"
            ],
            correct: 2,
            explanation: "The Logic Control Unit orchestrates the dosing pumps and level sensors. Without it, the system cannot regulate how much fluid is added, leading to dangerous over-dosing or physical overflows.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the agitator shaft and blades
        const shaftIndex = parts.findIndex(p => p.name === 'Agitator Shaft');
        const bladesIndex = parts.findIndex(p => p.name === 'Impeller Blades');
        const fluidIndex = parts.findIndex(p => p.name === 'Nutrient Solution');
        
        if (shaftIndex !== -1 && meshes[shaftIndex]) {
            meshes[shaftIndex].rotation.y += 0.1 * speed;
        }
        if (bladesIndex !== -1 && meshes[bladesIndex]) {
            meshes[bladesIndex].rotation.y += 0.1 * speed; // Match shaft rotation
        }
        
        // Pulse the glowing fluid in the main tank
        if (fluidIndex !== -1 && meshes[fluidIndex]) {
            const material = meshes[fluidIndex].material;
            if (material) {
                material.emissiveIntensity = 0.8 + Math.sin(time * 0.005 * speed) * 0.2;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHydroponicNutrientMixer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
