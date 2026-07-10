import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for Visual Flair
    const sailMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        emissive: 0x112244,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const energyCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const boomMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3
    });

    // 1. Central Hub
    const hubGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const hub = new THREE.Mesh(hubGeometry, darkSteel);
    hub.name = 'central_hub';
    group.add(hub);
    parts.push({
        name: 'Central Control Hub',
        description: 'The main computing and payload center of the solar sail spacecraft.',
        material: 'darkSteel',
        function: 'Houses guidance, communication, and scientific instruments.',
        assemblyOrder: 1,
        connections: ['boom_assembly', 'energy_core'],
        failureEffect: 'Loss of spacecraft control and telemetry.',
        cascadeFailures: ['guidance_failure', 'communication_loss'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 2. Energy Core
    const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const core = new THREE.Mesh(coreGeometry, energyCoreMaterial);
    core.position.y = 1.5;
    core.name = 'energy_core';
    group.add(core);
    parts.push({
        name: 'Quantum Energy Core',
        description: 'Provides backup and supplementary power when far from the sun.',
        material: 'energyCoreMaterial',
        function: 'Powers onboard systems independent of solar panels.',
        assemblyOrder: 2,
        connections: ['central_hub'],
        failureEffect: 'Spacecraft enters safe mode, limiting functions.',
        cascadeFailures: ['instrument_shutdown'],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Deployment Booms (4 booms forming an X)
    const boomLength = 20;
    const booms = new THREE.Group();
    booms.name = 'boom_assembly';
    
    const boomData = [
        { rotZ: Math.PI / 4, name: 'Boom Alpha' },
        { rotZ: -Math.PI / 4, name: 'Boom Beta' },
        { rotZ: 3 * Math.PI / 4, name: 'Boom Gamma' },
        { rotZ: -3 * Math.PI / 4, name: 'Boom Delta' }
    ];

    boomData.forEach((data) => {
        const boomGeom = new THREE.CylinderGeometry(0.1, 0.1, boomLength, 8);
        boomGeom.translate(0, boomLength / 2, 0); // Origin at base
        const boom = new THREE.Mesh(boomGeom, boomMaterial);
        boom.rotation.z = data.rotZ;
        boom.rotation.x = Math.PI / 2;
        booms.add(boom);
    });
    group.add(booms);
    
    parts.push({
        name: 'Deployment Booms',
        description: 'Extendable lightweight composite structures that support the sail.',
        material: 'boomMaterial',
        function: 'Provides structural rigidity and tension for the Mylar sails.',
        assemblyOrder: 3,
        connections: ['central_hub', 'mylar_sails'],
        failureEffect: 'Sail crumples, drastically reducing thrust.',
        cascadeFailures: ['trajectory_deviation', 'sail_tear'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });

    // 4. Mylar Sails (4 triangular quadrants)
    const sails = new THREE.Group();
    sails.name = 'mylar_sails';
    
    const halfSpan = boomLength * Math.cos(Math.PI / 4);
    
    for (let i = 0; i < 4; i++) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(halfSpan, halfSpan);
        shape.lineTo(halfSpan, -halfSpan);
        shape.lineTo(0, 0);
        
        const sailGeom = new THREE.ShapeGeometry(shape);
        const sail = new THREE.Mesh(sailGeom, sailMaterial);
        sail.rotation.z = i * (Math.PI / 2);
        sails.add(sail);
    }
    
    group.add(sails);
    parts.push({
        name: 'Ultra-thin Mylar Sails',
        description: 'Microscopically thin reflective sheets capturing photon momentum.',
        material: 'sailMaterial',
        function: 'Propels the spacecraft using radiation pressure from stars.',
        assemblyOrder: 4,
        connections: ['boom_assembly'],
        failureEffect: 'Loss of propulsion.',
        cascadeFailures: ['mission_failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    const description = "The Deep Space Solar Sail uses the momentum of light itself to traverse the cosmos. Free from heavy chemical propellants, it achieves incredible speeds over time by continually catching stellar photons on its ultra-thin, highly reflective Mylar sails.";

    const quizQuestions = [
        {
            question: "What physical mechanism provides propulsion for a solar sail?",
            options: [
                "Solar wind (charged particles)",
                "Radiation pressure (momentum of photons)",
                "Ionized gas expulsion",
                "Magnetic field repulsion"
            ],
            correct: 1,
            explanation: "While solar wind exerts some force, the primary driver for solar sails is radiation pressure—the transfer of momentum from massless photons bouncing off the reflective surface.",
            difficulty: "Medium"
        },
        {
            question: "Why must the sails be made of ultra-thin material like Mylar?",
            options: [
                "To prevent overheating near the sun",
                "To maximize the surface-area-to-mass ratio for greater acceleration",
                "To allow light to pass through completely",
                "To easily fold into a small rocket fairing"
            ],
            correct: 1,
            explanation: "Acceleration equals force divided by mass. Since the force from radiation pressure is very small, the spacecraft's mass must be as low as possible while maximizing the sail area.",
            difficulty: "Medium"
        },
        {
            question: "How does a solar sail spacecraft steer?",
            options: [
                "Using small chemical thrusters",
                "By changing the angle of the sail relative to the light source",
                "By reeling in or extending specific booms",
                "It cannot steer; it only travels in straight lines from the star"
            ],
            correct: 1,
            explanation: "By tilting the sail (changing its angle of attack relative to the incoming light), the vector of the radiation pressure force changes, allowing the spacecraft to alter its orbit.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        
        group.rotation.y = time * speed * 0.1;
        group.rotation.z = Math.sin(time * speed * 0.2) * 0.1;

        const core = group.getObjectByName('energy_core');
        if (core) {
            core.position.y = 1.5 + Math.sin(time * speed * 2) * 0.1;
            core.scale.setScalar(1 + Math.sin(time * speed * 5) * 0.05);
        }

        const mylarSails = group.getObjectByName('mylar_sails');
        if (mylarSails) {
            mylarSails.children.forEach((sail, i) => {
                sail.position.z = Math.sin(time * speed * 3 + i) * 0.2;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSolarSail() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
