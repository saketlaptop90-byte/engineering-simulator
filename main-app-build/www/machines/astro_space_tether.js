import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 1.2,
        metalness: 0.5,
        roughness: 0.4
    });

    const plasmaCore = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    // 1. Earth Anchor Base
    const anchorGeometry = new THREE.CylinderGeometry(5, 6, 2, 32);
    const anchorMesh = new THREE.Mesh(anchorGeometry, darkSteel);
    anchorMesh.position.set(0, -10, 0);
    group.add(anchorMesh);
    meshes.anchor = anchorMesh;
    
    parts.push({
        name: 'Earth Anchor Base',
        description: 'Massive terrestrial anchoring station to secure the tether.',
        material: 'darkSteel',
        function: 'Keeps the tether grounded and handles mechanical tension and electrical grounding.',
        assemblyOrder: 1,
        connections: ['Tether Cable'],
        failureEffect: 'Catastrophic unraveling and planetary-scale debris impact.',
        cascadeFailures: ['Tether Cable', 'Climber Vehicle'],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 2. Tether Cable
    const tetherGeometry = new THREE.CylinderGeometry(0.2, 0.2, 40, 16);
    const tetherMesh = new THREE.Mesh(tetherGeometry, chrome);
    tetherMesh.position.set(0, 10, 0);
    group.add(tetherMesh);
    meshes.tether = tetherMesh;
    
    parts.push({
        name: 'Carbon-Nanotube Tether Cable',
        description: 'Ultra-high tensile strength ribbon extending to geostationary orbit.',
        material: 'chrome',
        function: 'Provides the track for climbers and withstands immense centrifugal and gravitational forces.',
        assemblyOrder: 2,
        connections: ['Earth Anchor Base', 'Counterweight Station'],
        failureEffect: 'Cable snaps, upper section flung into deep space, lower section falls back to Earth.',
        cascadeFailures: ['Climber Vehicle', 'Power Relays'],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: -5, y: 10, z: 0 }
    });

    // 3. Counterweight Station (Apex)
    const apexGeometry = new THREE.OctahedronGeometry(4, 2);
    const apexMesh = new THREE.Mesh(apexGeometry, aluminum);
    apexMesh.position.set(0, 30, 0);
    group.add(apexMesh);
    meshes.apex = apexMesh;
    
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), plasmaCore);
    apexMesh.add(coreMesh);
    
    parts.push({
        name: 'Apex Counterweight Station',
        description: 'Orbital mass keeping the tether taut via centrifugal force.',
        material: 'aluminum / plasmaCore',
        function: 'Maintains tension on the tether by orbiting beyond geostationary altitude.',
        assemblyOrder: 3,
        connections: ['Tether Cable'],
        failureEffect: 'Loss of tension; entire structure collapses towards Earth.',
        cascadeFailures: ['Earth Anchor Base', 'Tether Cable'],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 4. Climber Vehicle
    const climberGroup = new THREE.Group();
    const climberBodyGeometry = new THREE.BoxGeometry(2, 4, 2);
    const climberBodyMesh = new THREE.Mesh(climberBodyGeometry, steel);
    
    const climberRingGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    const climberRingMesh = new THREE.Mesh(climberRingGeometry, neonBlue);
    climberRingMesh.rotation.x = Math.PI / 2;
    
    climberGroup.add(climberBodyMesh);
    climberGroup.add(climberRingMesh);
    climberGroup.position.set(0, -5, 0);
    group.add(climberGroup);
    meshes.climber = climberGroup;
    meshes.climberRing = climberRingMesh;
    
    parts.push({
        name: 'Climber Vehicle',
        description: 'Electromagnetic elevator car that travels along the tether.',
        material: 'steel / neonBlue',
        function: 'Transports payload and personnel from the surface to orbit without rockets.',
        assemblyOrder: 4,
        connections: ['Tether Cable'],
        failureEffect: 'Plummets down the cable or gets stuck, blocking the path.',
        cascadeFailures: ['Payload Module'],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 5, y: -5, z: 0 }
    });
    
    // 5. Power Relays
    const relayGeometry = new THREE.BoxGeometry(1, 1, 1);
    for(let i=0; i<3; i++) {
        const relayMesh = new THREE.Mesh(relayGeometry, neonOrange);
        relayMesh.position.set(2, 0 + i*10, 0);
        group.add(relayMesh);
        meshes[`relay${i}`] = relayMesh;
        
        parts.push({
            name: `Power Relay Node ${i+1}`,
            description: 'Laser power receiver transmitting energy to the climber.',
            material: 'neonOrange',
            function: 'Provides wireless power transmission to ascending climbers.',
            assemblyOrder: 5 + i,
            connections: ['Tether Cable', 'Climber Vehicle'],
            failureEffect: 'Climber loses power and is stranded.',
            cascadeFailures: [],
            originalPosition: { x: 2, y: 0 + i*10, z: 0 },
            explodedPosition: { x: 8, y: 0 + i*10, z: 2 }
        });
    }

    const description = "The Space Tether, or Space Elevator, is a theoretical megastructure designed to transport material from a celestial body's surface into space. It relies on a super-strong cable extending from an equatorial anchor to a counterweight beyond geostationary orbit. Electromagnetic climbers ascend this ribbon, providing an extremely efficient alternative to chemical rockets.";

    const quizQuestions = [
        {
            question: "What physical force keeps the Space Tether taut and prevents it from falling?",
            options: [
                "Magnetic levitation",
                "Centrifugal force from the counterweight",
                "Buoyancy in the upper atmosphere",
                "Solar wind pressure"
            ],
            correct: 1,
            explanation: "The counterweight is placed beyond geostationary orbit, where centrifugal force exceeds gravity, pulling the tether upward and keeping it under constant tension.",
            difficulty: "Medium"
        },
        {
            question: "Why are carbon nanotubes often proposed as the primary material for the tether cable?",
            options: [
                "They are highly reflective to lasers",
                "They have an exceptionally high tensile-strength-to-mass ratio",
                "They are completely invisible to radar",
                "They naturally conduct electricity better than copper"
            ],
            correct: 1,
            explanation: "Carbon nanotubes possess the theoretical tensile strength necessary to support their own immense weight over thousands of kilometers without snapping.",
            difficulty: "Hard"
        },
        {
            question: "Where must the Earth anchor of a traditional space elevator be located?",
            options: [
                "At one of the magnetic poles",
                "On the equator",
                "At the highest mountain peak",
                "Deep underwater"
            ],
            correct: 1,
            explanation: "The anchor must be located on the equator so that the tether aligns with the Earth's rotational plane, minimizing lateral forces and keeping the counterweight in a stable geostationary orbit.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) activeMeshes = meshes;
        
        // Rotate the apex counterweight
        if (activeMeshes.apex) {
            activeMeshes.apex.rotation.y = time * 0.5 * speed;
            activeMeshes.apex.rotation.x = time * 0.2 * speed;
        }
        
        // Move climber up and down the tether
        if (activeMeshes.climber) {
            // Tether goes from y = -10 (anchor) to y = 30 (apex)
            const cycle = (Math.sin(time * 0.5 * speed) + 1) / 2; // 0 to 1
            activeMeshes.climber.position.y = -8 + (cycle * 36); 
            
            // Spin the climber's neon ring
            if (activeMeshes.climberRing) {
                activeMeshes.climberRing.rotation.z = time * 2 * speed;
            }
        }
        
        // Pulse the power relays
        for(let i=0; i<3; i++) {
            const relay = activeMeshes[`relay${i}`];
            if (relay) {
                relay.rotation.y = time * speed;
                const scale = 1 + 0.2 * Math.sin(time * 5 * speed + i);
                relay.scale.set(scale, scale, scale);
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSpaceTether() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
