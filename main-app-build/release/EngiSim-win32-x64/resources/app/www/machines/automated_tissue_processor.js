import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, 
        emissive: 0x00ff00, 
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 0.7 
    });
    const glowingRed = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        emissive: 0xff0000, 
        emissiveIntensity: 1 
    });
    const heatedWaxMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xfffdd0, 
        transmission: 0.6, 
        opacity: 0.8, 
        transparent: true, 
        roughness: 0.2, 
        ior: 1.45,
        emissive: 0xfffdd0,
        emissiveIntensity: 0.2
    });

    const meshes = {};

    function addPart(name, mesh, info) {
        mesh.name = name;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name: name,
            mesh: mesh, // internal reference
            description: info.description,
            material: info.materialName,
            function: info.function,
            assemblyOrder: info.assemblyOrder,
            connections: info.connections,
            failureEffect: info.failureEffect,
            cascadeFailures: info.cascadeFailures,
            originalPosition: info.originalPosition,
            explodedPosition: info.explodedPosition
        });
    }

    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 3, 3);
    const chassisMesh = new THREE.Mesh(chassisGeo, plastic);
    chassisMesh.position.set(0, 1.5, 0);
    addPart('Chassis', chassisMesh, {
        description: 'Main structural housing of the tissue processor.',
        materialName: 'High-grade Medical Plastic',
        function: 'Encloses all internal components and provides a sterile environment.',
        assemblyOrder: 1,
        connections: ['Reagent Carousel', 'Control Panel', 'Retort Chamber'],
        failureEffect: 'Loss of containment, exposure to toxic fumes.',
        cascadeFailures: ['Fume Extraction System', 'Retort Chamber'],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 2. Reagent Carousel
    const carouselGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const carouselMesh = new THREE.Mesh(carouselGeo, aluminum);
    carouselMesh.position.set(-0.5, 0.5, 0);
    addPart('ReagentCarousel', carouselMesh, {
        description: 'Rotating platform holding various chemical reagents.',
        materialName: 'Aluminum',
        function: 'Rotates to supply different chemicals (formalin, ethanol, xylene) to the retort.',
        assemblyOrder: 2,
        connections: ['Chassis', 'Reagent Bottles', 'Fluid Manifold'],
        failureEffect: 'Incorrect chemical delivery, ruining tissue samples.',
        cascadeFailures: ['Retort Chamber'],
        originalPosition: {x: -0.5, y: 0.5, z: 0},
        explodedPosition: {x: -3, y: 0.5, z: 0}
    });

    // Add bottles to carousel
    const bottleGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
    const bottleGeoInner = new THREE.CylinderGeometry(0.13, 0.13, 0.5, 16);
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bottleGrp = new THREE.Group();
        
        const bottleOuter = new THREE.Mesh(bottleGeo, glass);
        const bottleInner = new THREE.Mesh(bottleGeoInner, neonGreen); // Glowing chemicals
        bottleInner.position.y = -0.05;
        bottleGrp.add(bottleOuter);
        bottleGrp.add(bottleInner);
        
        bottleGrp.position.set(Math.cos(angle)*0.8, 0.55, Math.sin(angle)*0.8);
        carouselMesh.add(bottleGrp);
    }

    // 3. Retort Chamber
    const retortGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const retortMesh = new THREE.Mesh(retortGeo, steel);
    retortMesh.position.set(1.2, 1.6, 0.5);
    addPart('RetortChamber', retortMesh, {
        description: 'Pressurized processing chamber.',
        materialName: 'Stainless Steel',
        function: 'Holds the tissue cassettes while they are subjected to vacuum, pressure, and heated chemicals.',
        assemblyOrder: 3,
        connections: ['Chassis', 'Fluid Manifold', 'Vacuum Pump', 'Heater'],
        failureEffect: 'Loss of pressure/vacuum, incomplete tissue penetration.',
        cascadeFailures: ['Tissue Cassettes'],
        originalPosition: {x: 1.2, y: 1.6, z: 0.5},
        explodedPosition: {x: 3, y: 3, z: 2}
    });

    // Retort Lid (glass)
    const lidGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.1, 32);
    const lidMesh = new THREE.Mesh(lidGeo, tinted);
    lidMesh.position.set(0, 0.65, 0);
    retortMesh.add(lidMesh);

    // 4. Robotic Transfer Arm
    const armBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const armBaseMesh = new THREE.Mesh(armBaseGeo, darkSteel);
    armBaseMesh.position.set(1.2, 2.5, -0.8);
    
    const armExtensionGeo = new THREE.BoxGeometry(0.1, 0.1, 1.5);
    const armExtensionMesh = new THREE.Mesh(armExtensionGeo, chrome);
    armExtensionMesh.position.set(0, 1.2, 0.75);
    armBaseMesh.add(armExtensionMesh);

    // Neon accent on arm
    const armNeonGeo = new THREE.BoxGeometry(0.12, 0.05, 1.0);
    const armNeonMesh = new THREE.Mesh(armNeonGeo, neonBlue);
    armNeonMesh.position.set(0, 0, 0);
    armExtensionMesh.add(armNeonMesh);

    addPart('TransferArm', armBaseMesh, {
        description: 'Multi-axis robotic manipulator.',
        materialName: 'Dark Steel and Chrome with Neon accents',
        function: 'Moves tissue baskets between the retort chamber and wax baths.',
        assemblyOrder: 4,
        connections: ['Chassis', 'Retort Chamber', 'Wax Baths'],
        failureEffect: 'Samples stranded mid-process, potential tissue drying.',
        cascadeFailures: ['Tissue Cassettes'],
        originalPosition: {x: 1.2, y: 2.5, z: -0.8},
        explodedPosition: {x: 1.2, y: 5, z: -2}
    });

    // 5. Control Panel
    const panelGeo = new THREE.BoxGeometry(1.5, 1, 0.1);
    const panelMesh = new THREE.Mesh(panelGeo, darkSteel);
    panelMesh.position.set(0, 2.5, 1.55);
    panelMesh.rotation.x = -Math.PI / 6;

    const screenGeo = new THREE.PlaneGeometry(1.3, 0.8);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(0, 0, 0.06);
    panelMesh.add(screenMesh);

    addPart('ControlPanel', panelMesh, {
        description: 'Touchscreen interface.',
        materialName: 'Glass and Dark Steel',
        function: 'Allows users to program processing protocols and monitor machine status.',
        assemblyOrder: 5,
        connections: ['Chassis', 'Motherboard'],
        failureEffect: 'Inability to start or monitor runs.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.5, z: 1.55},
        explodedPosition: {x: 0, y: 4, z: 3}
    });

    // 6. Vacuum Pump
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const pumpMesh = new THREE.Mesh(pumpGeo, copper);
    pumpMesh.position.set(1.2, 0.5, -0.8);
    pumpMesh.rotation.z = Math.PI / 2;
    addPart('VacuumPump', pumpMesh, {
        description: 'Heavy-duty diaphragm pump.',
        materialName: 'Copper and Steel',
        function: 'Creates alternating vacuum and pressure in the retort to accelerate fluid exchange in tissues.',
        assemblyOrder: 6,
        connections: ['Chassis', 'Retort Chamber', 'Fluid Manifold'],
        failureEffect: 'Poor reagent penetration into tissues.',
        cascadeFailures: ['Retort Chamber'],
        originalPosition: {x: 1.2, y: 0.5, z: -0.8},
        explodedPosition: {x: 4, y: 0.5, z: -3}
    });

    // 7. Paraffin Wax Baths
    const bathGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const bathGrp = new THREE.Group();
    bathGrp.position.set(-1.2, 2.5, -0.5);
    
    for(let i=0; i<3; i++) {
        const bathMesh = new THREE.Mesh(bathGeo, aluminum);
        bathMesh.position.set(0, 0, i * 0.9 - 0.9);
        
        const waxGeo = new THREE.PlaneGeometry(0.7, 0.7);
        const waxMesh = new THREE.Mesh(waxGeo, heatedWaxMat);
        waxMesh.rotation.x = -Math.PI/2;
        waxMesh.position.set(0, 0.31, 0);
        bathMesh.add(waxMesh);
        
        bathGrp.add(bathMesh);
    }
    addPart('WaxBaths', bathGrp, {
        description: 'Heated reservoirs of liquid paraffin.',
        materialName: 'Aluminum and Heated Wax',
        function: 'Provides molten wax for the final infiltration step of tissue processing.',
        assemblyOrder: 7,
        connections: ['Chassis', 'Heater', 'Transfer Arm'],
        failureEffect: 'Wax solidifies, trapping tissues or preventing infiltration.',
        cascadeFailures: ['Transfer Arm'],
        originalPosition: {x: -1.2, y: 2.5, z: -0.5},
        explodedPosition: {x: -3, y: 4, z: -2}
    });

    // 8. Fume Extraction System
    const filterGeo = new THREE.BoxGeometry(1, 0.4, 1);
    const filterMesh = new THREE.Mesh(filterGeo, plastic);
    filterMesh.position.set(-1.2, 3.2, 0.5);

    const fanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const fanMesh = new THREE.Mesh(fanGeo, chrome);
    fanMesh.position.set(0, 0.25, 0);
    filterMesh.add(fanMesh);

    addPart('FumeExtractor', filterMesh, {
        description: 'Charcoal filter and exhaust fan.',
        materialName: 'Plastic and Chrome',
        function: 'Removes toxic chemical vapors (like xylene and formalin) from the internal environment.',
        assemblyOrder: 8,
        connections: ['Chassis'],
        failureEffect: 'Toxic fume buildup, user exposure hazard.',
        cascadeFailures: [],
        originalPosition: {x: -1.2, y: 3.2, z: 0.5},
        explodedPosition: {x: -3, y: 6, z: 2}
    });

    const description = "The Automated Tissue Processor is a critical pathology lab instrument used to prepare biological tissue samples for sectioning and microscopic examination. It automates the complex process of dehydration, clearing, and wax infiltration by moving tissues through a series of chemical baths under controlled temperature, pressure, and vacuum.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Vacuum Pump in the tissue processor?",
            options: [
                "To cool down the retort chamber",
                "To extract toxic fumes from the chassis",
                "To create alternating vacuum and pressure to accelerate fluid penetration into tissues",
                "To pump liquid wax into the molds"
            ],
            correct: 2,
            explanation: "The vacuum pump creates alternating pressure and vacuum cycles inside the retort chamber. This pulsing action rapidly draws out trapped air and fluids from the tissue matrices and forces the processing reagents deeper into the cellular structure.",
            difficulty: "Medium"
        },
        {
            question: "Which component is responsible for the final step of tissue processing before embedding?",
            options: [
                "Reagent Carousel",
                "Paraffin Wax Baths",
                "Fume Extractor",
                "Control Panel"
            ],
            correct: 1,
            explanation: "The Paraffin Wax Baths hold molten wax. The final step of tissue processing is wax infiltration, where tissues are submerged in liquid paraffin. This replaces the clearing agent (like xylene) and solidifies to provide structural support for microtome sectioning.",
            difficulty: "Easy"
        },
        {
            question: "If the Reagent Carousel fails to rotate, what is the most immediate consequence?",
            options: [
                "The wax will solidify prematurely",
                "Incorrect chemicals will be delivered to the retort, ruining the samples",
                "The machine will overheat",
                "The vacuum pump will explode"
            ],
            correct: 1,
            explanation: "Tissue processing requires a strict sequence of chemicals (e.g., graded alcohols, xylene). If the carousel fails, the wrong chemical (or no chemical) will be pumped into the retort, compromising the dehydration and clearing process and destroying the irreplaceable biopsy samples.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (activeMeshes['ReagentCarousel']) {
            activeMeshes['ReagentCarousel'].rotation.y = time * 0.5 * speed;
        }
        if (activeMeshes['TransferArm']) {
            // Sweep arm back and forth
            activeMeshes['TransferArm'].rotation.y = Math.sin(time * speed) * 0.5;
            // Up and down motion
            activeMeshes['TransferArm'].children[0].position.y = 1.2 + Math.sin(time * speed * 2) * 0.2;
        }
        if (activeMeshes['FumeExtractor']) {
            // Spin the fan
            activeMeshes['FumeExtractor'].children[0].rotation.y = time * 10 * speed;
        }
        if (activeMeshes['VacuumPump']) {
            // Pulsating effect for the pump
            const scale = 1 + Math.sin(time * 15 * speed) * 0.05;
            activeMeshes['VacuumPump'].scale.set(scale, scale, scale);
        }
        if (activeMeshes['ControlPanel']) {
            // Pulse the neon screen
            const intensity = 0.5 + Math.sin(time * 3 * speed) * 0.5;
            activeMeshes['ControlPanel'].children[0].material.emissiveIntensity = intensity;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAutomatedTissueProcessor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
