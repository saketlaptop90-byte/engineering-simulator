import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Event Horizon (Black Void)
    const eventHorizonGeo = new THREE.SphereGeometry(2, 64, 64);
    const eventHorizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
    
    parts.push({
        name: 'Event Horizon',
        description: 'The boundary where the velocity needed to escape exceeds the speed of light.',
        material: 'Singularity Void',
        function: 'Traps all matter and light passing through it.',
        assemblyOrder: 1,
        connections: ['Accretion Disk', 'Photon Sphere'],
        failureEffect: 'Spaghettification of incoming matter',
        cascadeFailures: ['Complete structural collapse', 'Information paradox'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });
    group.add(eventHorizon);

    // 2. Photon Sphere
    const photonSphereGeo = new THREE.SphereGeometry(3, 64, 64);
    const photonSphereMat = new THREE.MeshBasicMaterial({ 
        color: 0xffaa00, 
        transparent: true, 
        opacity: 0.15, 
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    const photonSphere = new THREE.Mesh(photonSphereGeo, photonSphereMat);
    parts.push({
        name: 'Photon Sphere',
        description: 'Region of space where gravity is strong enough that photons are forced to travel in orbits.',
        material: 'Captured Light',
        function: 'Visual boundary of extreme gravitational lensing.',
        assemblyOrder: 2,
        connections: ['Event Horizon', 'Inner Accretion Disk'],
        failureEffect: 'Light escapes',
        cascadeFailures: ['Visual disruption'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });
    group.add(photonSphere);

    // 3. Accretion Disk
    const diskGeo = new THREE.RingGeometry(3.5, 12, 128, 32);
    const diskMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
    });
    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    accretionDisk.rotation.x = Math.PI / 2 - 0.2; // Tilted a bit for visual flare
    parts.push({
        name: 'Accretion Disk',
        description: 'A structure formed by diffused material in orbital motion around a massive central body.',
        material: 'Superheated Plasma',
        function: 'Friction heats the material, emitting intense radiation.',
        assemblyOrder: 3,
        connections: ['Photon Sphere', 'Jet'],
        failureEffect: 'Loss of matter',
        cascadeFailures: ['Energy output drop'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });
    group.add(accretionDisk);

    // 4. Relativistic Jets
    const jetGeo = new THREE.CylinderGeometry(0.1, 2.5, 25, 64);
    jetGeo.translate(0, 12.5, 0); // pivot at base
    const jetMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const topJet = new THREE.Mesh(jetGeo, jetMat);
    const bottomJet = new THREE.Mesh(jetGeo, jetMat);
    bottomJet.rotation.x = Math.PI; // point downwards

    parts.push({
        name: 'Relativistic Jets',
        description: 'Beams of ionized matter accelerated close to the speed of light along the axis of rotation.',
        material: 'Ionized Plasma',
        function: 'Expels energy and angular momentum from the system.',
        assemblyOrder: 4,
        connections: ['Accretion Disk', 'Magnetic Field'],
        failureEffect: 'Choked accretion',
        cascadeFailures: ['Magnetic field collapse'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });
    group.add(topJet);
    group.add(bottomJet);

    const description = "A highly realistic simulation of a rotating black hole, featuring an event horizon, an accretion disk of superheated plasma, a photon sphere demonstrating extreme gravitational lensing, and relativistic jets shooting from its magnetic poles.";

    const quizQuestions = [
        {
            question: "What is the 'Event Horizon' of a black hole?",
            options: [
                "The solid core of the black hole",
                "The glowing ring of plasma around the black hole",
                "The point of no return where escape velocity equals the speed of light",
                "The beam of radiation shooting from the poles"
            ],
            correct: 2,
            explanation: "The event horizon marks the boundary of a black hole beyond which nothing, not even light, can escape its gravitational pull.",
            difficulty: "easy"
        },
        {
            question: "Why does the accretion disk emit so much light and radiation?",
            options: [
                "Nuclear fusion is occurring in the disk",
                "Extreme friction and gravitational forces heat the material to millions of degrees",
                "It is reflecting light from nearby stars",
                "The black hole is expelling energy outwards"
            ],
            correct: 1,
            explanation: "Matter in the accretion disk falls inward, converting gravitational potential energy into kinetic energy, generating immense friction and heat.",
            difficulty: "medium"
        },
        {
            question: "What defines the 'Photon Sphere'?",
            options: [
                "A region where gravity is so strong that light is forced to orbit the black hole",
                "The outer edge of the accretion disk",
                "The singularity at the center",
                "The area where the relativistic jets are formed"
            ],
            correct: 0,
            explanation: "In the photon sphere, photons (light) travel in unstable circular orbits due to extreme spacetime curvature.",
            difficulty: "hard"
        }
    ];

    const cachedMeshes = {
        eventHorizon,
        photonSphere,
        accretionDisk,
        topJet,
        bottomJet
    };

    function animate(time, speed, meshes = cachedMeshes) {
        const t = time * speed;
        
        // Accretion disk spinning and pulsing
        if (meshes.accretionDisk) {
            meshes.accretionDisk.rotation.z -= 0.5 * speed;
            meshes.accretionDisk.material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 0.5;
            const scaleOffset = Math.sin(t * 2) * 0.05;
            meshes.accretionDisk.scale.set(1 + scaleOffset, 1 + scaleOffset, 1);
        }

        // Photon sphere pulsing gently
        if (meshes.photonSphere) {
            meshes.photonSphere.rotation.y -= 0.1 * speed;
            meshes.photonSphere.scale.setScalar(1 + Math.sin(t * 3) * 0.015);
            meshes.photonSphere.material.opacity = 0.1 + Math.sin(t * 4) * 0.05;
        }

        // Relativistic jets flickering
        if (meshes.topJet && meshes.bottomJet) {
            const jetScale = 1 + (Math.random() - 0.5) * 0.1 * speed;
            meshes.topJet.scale.set(jetScale, 1 + Math.random() * 0.05, jetScale);
            meshes.bottomJet.scale.set(jetScale, 1 + Math.random() * 0.05, jetScale);
            
            const jetOpacity = 0.4 + Math.sin(t * 20) * 0.15;
            meshes.topJet.material.opacity = jetOpacity;
            meshes.bottomJet.material.opacity = jetOpacity;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBlackHoleAccretionDisk() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
