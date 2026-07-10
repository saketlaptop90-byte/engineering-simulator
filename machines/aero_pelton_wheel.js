import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingWaterMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowingEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 2.0,
        wireframe: true
    });

    // 1. Casing (Transparent)
    const casingGeo = new THREE.CylinderGeometry(8, 8, 4, 32, 1, false, 0, Math.PI);
    const casingMesh = new THREE.Mesh(casingGeo, glass);
    casingMesh.rotation.x = Math.PI / 2;
    casingMesh.position.set(0, 0, 0);
    group.add(casingMesh);
    parts.push({
        name: 'Turbine Casing',
        description: 'Protective housing that contains the water splash and channels it to the tailrace.',
        material: 'glass',
        function: 'Containment and splash protection',
        assemblyOrder: 9,
        connections: ['Penstock', 'Runner'],
        failureEffect: 'Water leakage, efficiency drop',
        cascadeFailures: ['Flooding of generator room'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 2. Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.rotation.x = Math.PI / 2;
    shaftMesh.position.set(0, 0, -4);
    group.add(shaftMesh);
    parts.push({
        name: 'Main Shaft',
        description: 'Transmits rotational mechanical energy from the runner to the generator.',
        material: 'chrome',
        function: 'Power transmission',
        assemblyOrder: 1,
        connections: ['Runner', 'Generator'],
        failureEffect: 'Loss of power transmission',
        cascadeFailures: ['Turbine overspeed', 'Bearing destruction'],
        originalPosition: { x: 0, y: 0, z: -4 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // 3. Runner (Wheel)
    const runnerGeo = new THREE.CylinderGeometry(4, 4, 1, 32);
    const runnerMesh = new THREE.Mesh(runnerGeo, darkSteel);
    runnerMesh.rotation.x = Math.PI / 2;
    group.add(runnerMesh);
    parts.push({
        name: 'Runner Disk',
        description: 'Central heavy disk to which the buckets are attached. Acts as a flywheel.',
        material: 'darkSteel',
        function: 'Rotational inertia, mounting point for buckets',
        assemblyOrder: 2,
        connections: ['Shaft', 'Buckets'],
        failureEffect: 'Severe imbalance, catastrophic failure',
        cascadeFailures: ['Shaft snapping', 'Casing destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -8 }
    });

    // 4. Buckets
    const numBuckets = 16;
    const bucketRadius = 4.2;
    const bucketsGroup = new THREE.Group();
    for (let i = 0; i < numBuckets; i++) {
        const angle = (i / numBuckets) * Math.PI * 2;
        // Simple bucket rep: a sphere cut in half
        const bucketGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI, 0, Math.PI);
        const bucketMesh = new THREE.Mesh(bucketGeo, aluminum);
        bucketMesh.position.set(Math.cos(angle) * bucketRadius, Math.sin(angle) * bucketRadius, 0);
        // Align buckets to face the jet at the bottom
        bucketMesh.rotation.z = angle + Math.PI / 2;
        bucketMesh.rotation.x = Math.PI;
        bucketsGroup.add(bucketMesh);
    }
    runnerMesh.add(bucketsGroup); // Attach to runner to spin together
    parts.push({
        name: 'Split Buckets',
        description: 'Double-cupped buckets that split the water jet, extracting maximum kinetic energy.',
        material: 'aluminum',
        function: 'Momentum transfer from fluid to solid',
        assemblyOrder: 3,
        connections: ['Runner Disk'],
        failureEffect: 'Loss of efficiency, cavitation damage',
        cascadeFailures: ['Imbalance vibration', 'Fatigue failure of adjacent buckets'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // 5. Penstock
    const penstockGeo = new THREE.CylinderGeometry(1, 1, 8, 16);
    const penstockMesh = new THREE.Mesh(penstockGeo, steel);
    penstockMesh.rotation.z = Math.PI / 2;
    penstockMesh.position.set(-8, -4.2, 0);
    group.add(penstockMesh);
    parts.push({
        name: 'Penstock Pipe',
        description: 'High pressure pipe that delivers water from the reservoir to the turbine.',
        material: 'steel',
        function: 'High pressure water conduit',
        assemblyOrder: 6,
        connections: ['Nozzle'],
        failureEffect: 'Massive water leak',
        cascadeFailures: ['Station flooding', 'Loss of head pressure'],
        originalPosition: { x: -8, y: -4.2, z: 0 },
        explodedPosition: { x: -15, y: -10, z: 0 }
    });

    // 6. Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.4, 1, 2, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, chrome);
    nozzleMesh.rotation.z = Math.PI / 2;
    nozzleMesh.position.set(-3, -4.2, 0);
    group.add(nozzleMesh);
    parts.push({
        name: 'Nozzle Assembly',
        description: 'Accelerates the high-pressure water into a high-velocity jet.',
        material: 'chrome',
        function: 'Convert pressure head to velocity head',
        assemblyOrder: 7,
        connections: ['Penstock', 'Spear Valve'],
        failureEffect: 'Poor jet formation',
        cascadeFailures: ['Loss of power output'],
        originalPosition: { x: -3, y: -4.2, z: 0 },
        explodedPosition: { x: -8, y: -4.2, z: 5 }
    });

    // 7. Spear Valve
    const spearGeo = new THREE.ConeGeometry(0.3, 2, 16);
    const spearMesh = new THREE.Mesh(spearGeo, darkSteel);
    spearMesh.rotation.z = -Math.PI / 2;
    spearMesh.position.set(-3.5, -4.2, 0);
    group.add(spearMesh);
    parts.push({
        name: 'Spear Valve',
        description: 'Needle-like valve that moves axially inside the nozzle to control water flow.',
        material: 'darkSteel',
        function: 'Flow regulation',
        assemblyOrder: 8,
        connections: ['Nozzle'],
        failureEffect: 'Inability to control speed/power',
        cascadeFailures: ['Turbine runaway'],
        originalPosition: { x: -3.5, y: -4.2, z: 0 },
        explodedPosition: { x: -3.5, y: -4.2, z: 8 }
    });

    // 8. Water Jet
    const jetGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const jetMesh = new THREE.Mesh(jetGeo, glowingWaterMaterial);
    jetMesh.rotation.z = Math.PI / 2;
    jetMesh.position.set(-0.5, -4.2, 0);
    group.add(jetMesh);
    parts.push({
        name: 'High-Velocity Water Jet',
        description: 'The concentrated stream of water striking the buckets.',
        material: 'glowingWaterMaterial',
        function: 'Deliver kinetic energy',
        assemblyOrder: 10,
        connections: ['Nozzle', 'Buckets'],
        failureEffect: 'Scattering of water',
        cascadeFailures: ['Erosion of casing'],
        originalPosition: { x: -0.5, y: -4.2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 9. Generator
    const genGeo = new THREE.CylinderGeometry(3, 3, 4, 32);
    const genMesh = new THREE.Mesh(genGeo, copper);
    genMesh.rotation.x = Math.PI / 2;
    genMesh.position.set(0, 0, -8);
    group.add(genMesh);
    
    const genCoilsGeo = new THREE.TorusGeometry(3.1, 0.2, 16, 50);
    const genCoilsMesh1 = new THREE.Mesh(genCoilsGeo, glowingEnergyMaterial);
    genCoilsMesh1.position.set(0, 0, -7);
    group.add(genCoilsMesh1);
    const genCoilsMesh2 = new THREE.Mesh(genCoilsGeo, glowingEnergyMaterial);
    genCoilsMesh2.position.set(0, 0, -9);
    group.add(genCoilsMesh2);

    parts.push({
        name: 'Generator Unit',
        description: 'Converts the mechanical rotation of the shaft into electrical energy.',
        material: 'copper',
        function: 'Electromagnetic induction',
        assemblyOrder: 4,
        connections: ['Shaft', 'Grid'],
        failureEffect: 'No power generation',
        cascadeFailures: ['Overheating', 'Electrical fire'],
        originalPosition: { x: 0, y: 0, z: -8 },
        explodedPosition: { x: 0, y: 0, z: -25 }
    });

    const description = "The Pelton Wheel is an impulse-type water turbine. It extracts energy from the impulse of moving water, as opposed to water's dead weight like the traditional overshot water wheel. High-speed jets of water are forced through nozzles, striking the double-cupped buckets attached to the rotor, causing it to spin at high speeds. Highly efficient for high-head, low-flow fluid dynamic environments.";

    const quizQuestions = [
        {
            question: "What type of turbine is a Pelton Wheel?",
            options: ["Reaction Turbine", "Impulse Turbine", "Gravity Turbine", "Wind Turbine"],
            correct: 1,
            explanation: "The Pelton Wheel is an impulse turbine, extracting energy from the kinetic energy (impulse) of a high-velocity water jet.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the spear valve inside the nozzle?",
            options: ["To increase water pressure", "To filter debris", "To control the water flow rate", "To split the water jet"],
            correct: 2,
            explanation: "The spear valve moves in and out of the nozzle to precisely control the flow rate of the water jet striking the buckets.",
            difficulty: "Medium"
        },
        {
            question: "Why do the buckets of a Pelton Wheel have a double-cupped shape with a splitter in the middle?",
            options: ["To reduce the weight of the runner", "To split the jet into two equal streams, balancing side-thrust forces", "To hold water longer", "For aesthetic reasons"],
            correct: 1,
            explanation: "The splitter divides the water jet evenly, which balances the axial thrust on the wheel bearings and smoothly deflects the water to extract maximum momentum.",
            difficulty: "Hard"
        }
    ];

    // Meshes for animation
    const meshes = {
        runner: runnerMesh,
        jet: jetMesh,
        spear: spearMesh,
        generatorCoils: [genCoilsMesh1, genCoilsMesh2]
    };

    function animate(time, speed = 1, animationMeshes) {
        const rpm = speed * 10;
        
        // Spin the runner
        if (animationMeshes.runner) {
            animationMeshes.runner.rotation.y -= rpm * 0.05;
        }

        // Pulse the energy coils
        if (animationMeshes.generatorCoils) {
            const intensity = 1 + Math.sin(time * rpm * 0.1) * 0.5;
            animationMeshes.generatorCoils.forEach(coil => {
                coil.material.emissiveIntensity = intensity * 2;
            });
        }
        
        // Animate the water jet (flowing texture effect via scaling/moving)
        if (animationMeshes.jet) {
            animationMeshes.jet.scale.y = 1 + Math.sin(time * 20) * 0.05;
            animationMeshes.jet.material.opacity = 0.7 + Math.sin(time * 15) * 0.3;
        }

        // Spear valve movement based on speed
        if (animationMeshes.spear) {
            // Speed 0 -> closed (-2.5), Speed 1 -> open (-3.5)
            const targetX = -2.5 - (speed * 1.0);
            animationMeshes.spear.position.x += (targetX - animationMeshes.spear.position.x) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPeltonWheel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
