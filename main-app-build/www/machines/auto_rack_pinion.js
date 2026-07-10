import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xb026ff,
        emissive: 0xb026ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff003c,
        emissive: 0xff003c,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
    });

    // 1. Steering Column / Shaft
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 32);
    const columnGeoMesh = new THREE.Mesh(columnGeo, darkSteel);
    columnGeoMesh.rotation.z = Math.PI / 6;
    const columnOrigPos = { x: 0, y: 5, z: 0 };
    columnGeoMesh.position.set(columnOrigPos.x, columnOrigPos.y, columnOrigPos.z);
    
    // Add glowing accent to column
    const columnAccentGeo = new THREE.TorusGeometry(0.32, 0.05, 16, 50);
    const columnAccent = new THREE.Mesh(columnAccentGeo, neonBlue);
    columnAccent.rotation.x = Math.PI / 2;
    columnAccent.position.y = -2;
    columnGeoMesh.add(columnAccent);
    
    group.add(columnGeoMesh);
    
    parts.push({
        name: 'Steering Column',
        mesh: columnGeoMesh,
        description: 'Connects the steering wheel to the steering gear mechanism.',
        material: 'darkSteel with neonBlue accent',
        function: 'Transmits rotational force from the driver to the pinion gear.',
        assemblyOrder: 1,
        connections: ['Pinion Gear'],
        failureEffect: 'Complete loss of steering control.',
        cascadeFailures: ['Pinion Gear disconnect'],
        originalPosition: columnOrigPos,
        explodedPosition: { x: 0, y: 9, z: 0 }
    });

    // 2. Pinion Gear
    const pinionRadius = 0.8;
    const pinionTeeth = 16;
    const pinionGeo = new THREE.CylinderGeometry(pinionRadius, pinionRadius, 1, 32);
    const pinionMesh = new THREE.Mesh(pinionGeo, steel);
    
    // Create teeth
    for(let i=0; i<pinionTeeth; i++) {
        const toothGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const toothMesh = new THREE.Mesh(toothGeo, chrome);
        const angle = (i / pinionTeeth) * Math.PI * 2;
        toothMesh.position.x = Math.cos(angle) * (pinionRadius + 0.05);
        toothMesh.position.z = Math.sin(angle) * (pinionRadius + 0.05);
        toothMesh.rotation.y = -angle;
        pinionMesh.add(toothMesh);
    }
    
    const pinionOrigPos = { x: 2.5, y: 2.4, z: 0 };
    pinionMesh.position.set(pinionOrigPos.x, pinionOrigPos.y, pinionOrigPos.z);
    pinionMesh.rotation.x = Math.PI / 2;
    group.add(pinionMesh);

    parts.push({
        name: 'Pinion Gear',
        mesh: pinionMesh,
        description: 'A small gear located at the end of the steering column.',
        material: 'steel with chrome teeth',
        function: 'Converts rotational motion from the steering column into linear motion on the rack.',
        assemblyOrder: 2,
        connections: ['Steering Column', 'Rack'],
        failureEffect: 'Grinding noise, steering slips, loss of mechanical advantage.',
        cascadeFailures: ['Rack teeth damage', 'Loss of vehicle control'],
        originalPosition: pinionOrigPos,
        explodedPosition: { x: 4, y: 4, z: -2 }
    });

    // 3. The Rack
    const rackLength = 12;
    const rackGeo = new THREE.BoxGeometry(rackLength, 0.8, 0.8);
    const rackMesh = new THREE.Mesh(rackGeo, aluminum);
    
    // Add teeth to rack
    const numRackTeeth = 30;
    for(let i=0; i<numRackTeeth; i++) {
        const toothGeo = new THREE.BoxGeometry(0.2, 0.2, 0.8);
        const toothMesh = new THREE.Mesh(toothGeo, neonPurple);
        const xPos = -rackLength/2 + 0.4 + (i * 0.4);
        toothMesh.position.set(xPos, 0.45, 0);
        rackMesh.add(toothMesh);
    }

    const rackOrigPos = { x: 0, y: 1.6, z: 0 };
    rackMesh.position.set(rackOrigPos.x, rackOrigPos.y, rackOrigPos.z);
    group.add(rackMesh);

    parts.push({
        name: 'Rack (Linear Gear)',
        mesh: rackMesh,
        description: 'A linear gear bar that spans the width between the front wheels.',
        material: 'aluminum with neonPurple teeth',
        function: 'Translates rotational motion from the pinion into linear lateral movement.',
        assemblyOrder: 3,
        connections: ['Pinion Gear', 'Tie Rods (Left & Right)'],
        failureEffect: 'Steering dead zones, clunking noises.',
        cascadeFailures: ['Tie rod misalignment', 'Uneven tire wear'],
        originalPosition: rackOrigPos,
        explodedPosition: { x: 0, y: -1, z: 0 }
    });

    // 4. Tie Rods (Left and Right)
    const tieRodGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const tieRodL = new THREE.Mesh(tieRodGeo, darkSteel);
    const tieRodR = new THREE.Mesh(tieRodGeo, darkSteel);
    
    tieRodL.rotation.z = Math.PI / 2;
    tieRodR.rotation.z = Math.PI / 2;
    
    const tieRodLOrigPos = { x: -8, y: 1.6, z: 0 };
    const tieRodROrigPos = { x: 8, y: 1.6, z: 0 };
    
    tieRodL.position.set(tieRodLOrigPos.x, tieRodLOrigPos.y, tieRodLOrigPos.z);
    tieRodR.position.set(tieRodROrigPos.x, tieRodROrigPos.y, tieRodROrigPos.z);
    
    group.add(tieRodL);
    group.add(tieRodR);

    // Glowing accents on tie rods
    const tieRodAccentGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 50);
    const accentL = new THREE.Mesh(tieRodAccentGeo, neonRed);
    const accentR = new THREE.Mesh(tieRodAccentGeo, neonRed);
    accentL.rotation.y = Math.PI / 2;
    accentR.rotation.y = Math.PI / 2;
    tieRodL.add(accentL);
    tieRodR.add(accentR);

    parts.push({
        name: 'Tie Rods',
        mesh: [tieRodL, tieRodR],
        description: 'Rods connecting the ends of the rack to the steering knuckles.',
        material: 'darkSteel with neonRed accents',
        function: 'Pushes and pulls the wheels to steer them left or right.',
        assemblyOrder: 4,
        connections: ['Rack', 'Steering Knuckles'],
        failureEffect: 'Severe steering wander, vehicle pulling to one side.',
        cascadeFailures: ['Tire blowouts', 'Suspension damage'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        isMultiMesh: true,
        meshesData: [
            { mesh: tieRodL, orig: tieRodLOrigPos, exp: { x: -12, y: 1.6, z: 0 } },
            { mesh: tieRodR, orig: tieRodROrigPos, exp: { x: 12, y: 1.6, z: 0 } }
        ]
    });

    // 5. Rubber Boots (Bellows)
    const bootGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16, 10);
    // Displace vertices to make it look like a bellow
    const positions = bootGeo.attributes.position;
    for(let i=0; i<positions.count; i++) {
        const y = positions.getY(i);
        const radiusMult = 1 + 0.15 * Math.sin(y * 15);
        positions.setX(i, positions.getX(i) * radiusMult);
        positions.setZ(i, positions.getZ(i) * radiusMult);
    }
    bootGeo.computeVertexNormals();
    
    const bootL = new THREE.Mesh(bootGeo, rubber);
    const bootR = new THREE.Mesh(bootGeo, rubber);
    bootL.rotation.z = Math.PI / 2;
    bootR.rotation.z = Math.PI / 2;
    
    const bootLOrigPos = { x: -6, y: 1.6, z: 0 };
    const bootROrigPos = { x: 6, y: 1.6, z: 0 };
    
    bootL.position.set(bootLOrigPos.x, bootLOrigPos.y, bootLOrigPos.z);
    bootR.position.set(bootROrigPos.x, bootROrigPos.y, bootROrigPos.z);
    
    group.add(bootL);
    group.add(bootR);

    parts.push({
        name: 'Dust Boots (Bellows)',
        mesh: [bootL, bootR],
        description: 'Flexible rubber covers placed at each end of the rack housing.',
        material: 'rubber',
        function: 'Protects the inner tie rod joints and rack mechanism from dirt, water, and debris.',
        assemblyOrder: 5,
        connections: ['Rack Housing', 'Tie Rods'],
        failureEffect: 'Debris enters rack mechanism causing rapid wear.',
        cascadeFailures: ['Rack seal failure', 'Fluid leak', 'Steering gear destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        isMultiMesh: true,
        meshesData: [
            { mesh: bootL, orig: bootLOrigPos, exp: { x: -9, y: -2, z: 2 } },
            { mesh: bootR, orig: bootROrigPos, exp: { x: 9, y: -2, z: 2 } }
        ]
    });

    const description = "The high-tech Rack and Pinion steering gear provides precise, responsive control. Rotating the pinion (via steering wheel) moves the toothed rack laterally, adjusting the tie rods to pivot the vehicle's wheels. This simulation features glowing cyber-aesthetic components to highlight key mechanical interactions.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Pinion Gear in this assembly?",
            options: [
                "To connect the wheels to the tie rods.",
                "To convert rotational motion from the steering column into linear motion.",
                "To protect the inner joints from dirt.",
                "To generate hydraulic pressure."
            ],
            correct: 1,
            explanation: "The pinion gear is attached to the steering shaft. When it turns, its teeth engage the rack's teeth, moving it side-to-side linearly.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the Rubber Dust Boots are torn?",
            options: [
                "The steering ratio decreases.",
                "The pinion gear spins freely without turning the wheels.",
                "Dirt and moisture enter the rack housing, causing rapid wear and potential leaks.",
                "The tie rods become completely disconnected."
            ],
            correct: 2,
            explanation: "The boots seal the inner tie rod joints and rack ends. If compromised, abrasive dirt enters and destroys the seals and rack teeth.",
            difficulty: "Easy"
        },
        {
            question: "How does this system achieve steering leverage (mechanical advantage)?",
            options: [
                "Through the length of the tie rods.",
                "By using multiple pinion gears in series.",
                "Through the ratio of the number of teeth on the pinion compared to the rack spacing.",
                "By using high-tension rubber boots."
            ],
            correct: 2,
            explanation: "The steering ratio is determined by the circumference of the pinion gear. A smaller pinion requires more turns but less effort to move the rack.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Base rotational angle for the pinion
        const inputRotation = Math.sin(time * speed) * 2; 
        
        // 1. Column rotates
        if (meshes['Steering Column']) {
            meshes['Steering Column'].rotation.y = inputRotation;
        }
        
        // 2. Pinion rotates
        if (meshes['Pinion Gear']) {
            meshes['Pinion Gear'].rotation.z = -inputRotation; // Z axis based on our setup
        }
        
        // 3. Rack moves linearly based on pinion rotation
        // Circumference interaction mapping
        const rackDisplacement = inputRotation * pinionRadius;
        
        if (meshes['Rack (Linear Gear)']) {
            meshes['Rack (Linear Gear)'].position.x = rackOrigPos.x + rackDisplacement;
        }
        
        // 4. Tie Rods move with rack
        if (meshes['Tie Rods']) {
            meshes['Tie Rods'][0].position.x = tieRodLOrigPos.x + rackDisplacement;
            meshes['Tie Rods'][1].position.x = tieRodROrigPos.x + rackDisplacement;
        }

        // 5. Boots stretch/compress slightly with movement
        if (meshes['Dust Boots (Bellows)']) {
            meshes['Dust Boots (Bellows)'][0].position.x = bootLOrigPos.x + rackDisplacement/2;
            meshes['Dust Boots (Bellows)'][0].scale.y = 1 + rackDisplacement/6; // Stretch/compress simulation
            
            meshes['Dust Boots (Bellows)'][1].position.x = bootROrigPos.x + rackDisplacement/2;
            meshes['Dust Boots (Bellows)'][1].scale.y = 1 - rackDisplacement/6;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRackAndPinion() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
