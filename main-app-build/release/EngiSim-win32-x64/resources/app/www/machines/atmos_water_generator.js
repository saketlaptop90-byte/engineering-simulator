import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00f3ff,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.8,
        metalness: 0.2,
        roughness: 0.1
    });

    const glowingIce = new THREE.MeshStandardMaterial({
        color: 0xaaffff,
        emissive: 0x55ffff,
        emissiveIntensity: 0.6,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8
    });

    // 1. Base / Frame
    const frameGeometry = new THREE.BoxGeometry(4, 0.5, 4);
    const frameMesh = new THREE.Mesh(frameGeometry, darkSteel);
    frameMesh.position.set(0, 0.25, 0);
    group.add(frameMesh);
    meshes.frame = frameMesh;
    parts.push({
        name: 'Main Frame',
        description: 'Structural chassis supporting all generator components.',
        material: 'darkSteel',
        function: 'Provides mechanical stability and vibration dampening.',
        assemblyOrder: 1,
        connections: ['Condenser Array', 'Compressor', 'Water Tank'],
        failureEffect: 'Excessive vibration leading to micro-fractures in pipes.',
        cascadeFailures: ['Refrigerant Leak', 'Compressor Failure'],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Intake Fan Assembly
    const fanCasingGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    fanCasingGeometry.rotateX(Math.PI / 2);
    const fanCasingMesh = new THREE.Mesh(fanCasingGeometry, aluminum);
    fanCasingMesh.position.set(0, 3.5, 2.2);
    group.add(fanCasingMesh);
    meshes.fanCasing = fanCasingMesh;

    const fanHubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
    fanHubGeometry.rotateX(Math.PI / 2);
    const fanHubMesh = new THREE.Mesh(fanHubGeometry, chrome);
    fanHubMesh.position.set(0, 3.5, 2.2);
    
    // Blades
    for(let i=0; i<5; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.8, 0.2);
        bladeGeo.translate(0, 0.9, 0);
        const bladeMesh = new THREE.Mesh(bladeGeo, plastic);
        bladeMesh.rotation.z = (Math.PI * 2 / 5) * i;
        bladeMesh.rotation.x = 0.2; // pitch
        fanHubMesh.add(bladeMesh);
    }
    group.add(fanHubMesh);
    meshes.fanHub = fanHubMesh;

    parts.push({
        name: 'Intake Fan',
        description: 'High-RPM axial fan drawing ambient air into the system.',
        material: 'aluminum/plastic',
        function: 'Creates required airflow volume for efficient moisture extraction.',
        assemblyOrder: 5,
        connections: ['Air Filter', 'Condenser Array'],
        failureEffect: 'Reduced airflow, drastically dropping water production.',
        cascadeFailures: ['Condenser Freezing'],
        originalPosition: { x: 0, y: 3.5, z: 2.2 },
        explodedPosition: { x: 0, y: 5, z: 5 }
    });

    // 3. Air Filter
    const filterGeo = new THREE.BoxGeometry(3, 2, 0.2);
    const filterMesh = new THREE.Mesh(filterGeo, tinted);
    filterMesh.position.set(0, 3.5, 1.8);
    group.add(filterMesh);
    meshes.filter = filterMesh;
    parts.push({
        name: 'HEPA / Carbon Filter',
        description: 'Multi-stage filtration matrix removing dust and VOCs.',
        material: 'tinted',
        function: 'Ensures extracted water is free of airborne contaminants.',
        assemblyOrder: 4,
        connections: ['Intake Fan', 'Condenser Array'],
        failureEffect: 'Contaminated water output, particle buildup on coils.',
        cascadeFailures: ['Coil Corrosion', 'Filter Blockage'],
        originalPosition: { x: 0, y: 3.5, z: 1.8 },
        explodedPosition: { x: 0, y: 3.5, z: 4 }
    });

    // 4. Condenser Coil Array
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 3.5, 0);
    const pipeMaterial = copper;
    for (let i = 0; i < 6; i++) {
        const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3, 16);
        pipeGeo.rotateZ(Math.PI / 2);
        const pipe = new THREE.Mesh(pipeGeo, pipeMaterial);
        pipe.position.set(0, (i * 0.3) - 0.75, (i % 2 === 0 ? 0.2 : -0.2));
        coilGroup.add(pipe);

        // Fins
        for (let j = 0; j < 20; j++) {
            const finGeo = new THREE.BoxGeometry(0.02, 0.4, 0.6);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.set((j * 0.14) - 1.33, (i * 0.3) - 0.75, (i % 2 === 0 ? 0.2 : -0.2));
            coilGroup.add(fin);
        }
    }
    group.add(coilGroup);
    meshes.condenser = coilGroup;
    parts.push({
        name: 'Condenser Coil Array',
        description: 'Super-cooled copper coil network with aluminum fins.',
        material: 'copper/aluminum',
        function: 'Cools ambient air below dew point to precipitate water vapor.',
        assemblyOrder: 3,
        connections: ['Compressor', 'Drip Pan'],
        failureEffect: 'Loss of cooling efficiency, no condensation occurs.',
        cascadeFailures: ['Compressor Overheating'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 3.5, z: -3 }
    });

    // 5. Compressor
    const compGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const compMesh = new THREE.Mesh(compGeo, steel);
    compMesh.position.set(-1.2, 1.1, -1);
    
    const compTopGeo = new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const compTopMesh = new THREE.Mesh(compTopGeo, steel);
    compTopMesh.position.set(0, 0.6, 0);
    compMesh.add(compTopMesh);
    
    group.add(compMesh);
    meshes.compressor = compMesh;
    parts.push({
        name: 'Refrigerant Compressor',
        description: 'Hermetically sealed rotary compressor for refrigerant circulation.',
        material: 'steel',
        function: 'Compresses refrigerant gas, driving the cooling cycle.',
        assemblyOrder: 2,
        connections: ['Condenser Array', 'Evaporator Coils'],
        failureEffect: 'Complete system halt, inability to cool coils.',
        cascadeFailures: ['Refrigerant Leak'],
        originalPosition: { x: -1.2, y: 1.1, z: -1 },
        explodedPosition: { x: -3, y: 1.1, z: -3 }
    });

    // 6. Drip Pan & UV Purifier
    const panGeo = new THREE.BoxGeometry(3.2, 0.2, 1.5);
    const panMesh = new THREE.Mesh(panGeo, plastic);
    panMesh.position.set(0, 2.2, 0);
    
    const uvTubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 16);
    uvTubeGeo.rotateZ(Math.PI / 2);
    const uvMesh = new THREE.Mesh(uvTubeGeo, glowingBlue);
    uvMesh.position.set(0, 0.2, 0);
    panMesh.add(uvMesh);
    
    group.add(panMesh);
    meshes.pan = panMesh;
    parts.push({
        name: 'Drip Pan & UV Purifier',
        description: 'Collection tray with integrated deep-UV sterilization lamp.',
        material: 'plastic',
        function: 'Collects condensate and kills biological contaminants instantly.',
        assemblyOrder: 6,
        connections: ['Condenser Array', 'Water Tank'],
        failureEffect: 'Bacterial growth in collected water.',
        cascadeFailures: ['Biofilm buildup in pipes'],
        originalPosition: { x: 0, y: 2.2, z: 0 },
        explodedPosition: { x: 0, y: 2.2, z: 3 }
    });

    // 7. Water Storage Tank
    const tankGeo = new THREE.CylinderGeometry(1, 1, 1.8, 32);
    const tankMesh = new THREE.Mesh(tankGeo, glass);
    tankMesh.position.set(1.2, 1.4, 0);
    
    // Glowing water inside
    const waterGeo = new THREE.CylinderGeometry(0.95, 0.95, 1.2, 32);
    const waterMesh = new THREE.Mesh(waterGeo, glowingIce);
    waterMesh.position.set(0, -0.25, 0);
    tankMesh.add(waterMesh);
    meshes.water = waterMesh; // to animate water level

    group.add(tankMesh);
    meshes.tank = tankMesh;
    parts.push({
        name: 'Storage Tank',
        description: 'Borosilicate glass reservoir for purified water.',
        material: 'glass',
        function: 'Stores generated water and maintains temperature.',
        assemblyOrder: 7,
        connections: ['Drip Pan', 'Dispenser Valve'],
        failureEffect: 'Water leakage, inability to store production.',
        cascadeFailures: ['Short Circuit from leak'],
        originalPosition: { x: 1.2, y: 1.4, z: 0 },
        explodedPosition: { x: 3, y: 1.4, z: 0 }
    });

    // 8. Control Panel
    const panelGeo = new THREE.BoxGeometry(1.5, 0.8, 0.1);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    panelMesh.position.set(0, 4.2, 2.4);
    panelMesh.rotation.x = -0.2;

    const screenGeo = new THREE.PlaneGeometry(1.3, 0.6);
    const screenMesh = new THREE.Mesh(screenGeo, glowingBlue);
    screenMesh.position.set(0, 0, 0.06);
    panelMesh.add(screenMesh);

    group.add(panelMesh);
    meshes.panel = panelMesh;
    parts.push({
        name: 'Digital Interface',
        description: 'Holographic/LED telemetry display and control unit.',
        material: 'darkSteel/glass',
        function: 'Monitors humidity, temperature, and system health.',
        assemblyOrder: 8,
        connections: ['Sensors', 'Compressor', 'Fan'],
        failureEffect: 'Loss of system control and monitoring.',
        cascadeFailures: ['Overworking compressor due to sensor blind-spots'],
        originalPosition: { x: 0, y: 4.2, z: 2.4 },
        explodedPosition: { x: 0, y: 6, z: 4 }
    });


    const description = "The Atmospheric Water Generator (AWG) utilizes a specialized vapor-compression refrigeration cycle to extract pure water from ambient air. By drawing in humid air and passing it over super-cooled condenser coils, water vapor is rapidly forced past its dew point. The resulting condensate is subjected to intense deep-UV sterilization before being stored in an inert glass reservoir, offering an independent, off-grid water supply.";

    const quizQuestions = [
        {
            question: "What physical mechanism allows the AWG to extract water from the air?",
            options: [
                "Reverse Osmosis",
                "Cooling air below its dew point",
                "Electrolysis of atmospheric gases",
                "Centrifugal separation of humidity"
            ],
            correct: 1,
            explanation: "The AWG uses condenser coils to cool the ambient air below its dew point, causing water vapor to condense into liquid water.",
            difficulty: "Medium"
        },
        {
            question: "Why is the UV purifier placed immediately after the drip pan?",
            options: [
                "To cool the water further",
                "To sterilize the water before storage",
                "To increase the water's mineral content",
                "To evaporate excess water"
            ],
            correct: 1,
            explanation: "The UV purifier uses ultraviolet light to destroy bacteria and other biological contaminants right after condensation, preventing biofilm growth in the tank.",
            difficulty: "Easy"
        },
        {
            question: "If the compressor fails, what is the immediate effect on the AWG?",
            options: [
                "The fan will stop spinning",
                "The water tank will drain",
                "The condenser coils will lose cooling capability",
                "The UV light will turn off"
            ],
            correct: 2,
            explanation: "The compressor drives the refrigeration cycle. Without it, the condenser coils cannot be cooled, and condensation will cease.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, partsMeshes) {
        if (!partsMeshes) return;
        
        // Spin the intake fan rapidly
        if (partsMeshes.fanHub) {
            partsMeshes.fanHub.rotation.z -= 0.15 * speed;
        }

        // Simulate compressor vibration
        if (partsMeshes.compressor) {
            partsMeshes.compressor.position.x = -1.2 + Math.sin(time * 20 * speed) * 0.01;
            partsMeshes.compressor.position.z = -1 + Math.cos(time * 23 * speed) * 0.01;
        }

        // Pulsating UI Screen
        if (partsMeshes.panel && partsMeshes.panel.children[0]) {
            const screen = partsMeshes.panel.children[0];
            screen.material.emissiveIntensity = 0.6 + Math.sin(time * 2 * speed) * 0.3;
        }

        // Slow variation in water level/glow
        if (partsMeshes.water) {
            partsMeshes.water.scale.y = 1 + Math.sin(time * 0.5 * speed) * 0.05;
            partsMeshes.water.material.emissiveIntensity = 0.5 + Math.sin(time * 1.5 * speed) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAtmosphericWaterGenerator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
