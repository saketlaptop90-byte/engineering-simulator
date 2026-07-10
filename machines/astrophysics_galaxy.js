import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const eventHorizonMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0
    });

    const accretionDiskMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const jetMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const bulgeMat = new THREE.PointsMaterial({
        color: 0xffdcb4,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const armMat = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.3,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const nebulaMat = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 0.8,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const haloMat = new THREE.PointsMaterial({
        color: 0x4444ff,
        size: 0.1,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    // 1. Supermassive Black Hole
    const bhGeometry = new THREE.SphereGeometry(1, 64, 64);
    const blackHole = new THREE.Mesh(bhGeometry, eventHorizonMat);
    group.add(blackHole);
    meshes.blackHole = blackHole;
    parts.push({
        name: 'Supermassive Black Hole',
        description: 'The dense central core with gravity so immense that light cannot escape.',
        material: 'Singularity / Event Horizon',
        function: 'Anchors the galaxy and affects stellar dynamics in the central region.',
        assemblyOrder: 1,
        connections: ['Accretion Disk', 'Relativistic Jets'],
        failureEffect: 'Loss of central gravitational anchor leading to chaotic stellar orbits.',
        cascadeFailures: ['Accretion Disk', 'Galactic Bulge'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Accretion Disk
    const diskGeometry = new THREE.RingGeometry(1.2, 4, 128);
    // Rotate to lie flat
    diskGeometry.rotateX(-Math.PI / 2);
    const accretionDisk = new THREE.Mesh(diskGeometry, accretionDiskMat);
    group.add(accretionDisk);
    meshes.accretionDisk = accretionDisk;
    parts.push({
        name: 'Accretion Disk',
        description: 'Superheated gas and dust spiraling into the black hole.',
        material: 'Plasma',
        function: 'Generates immense friction, heating up and emitting intense X-rays.',
        assemblyOrder: 2,
        connections: ['Supermassive Black Hole', 'Relativistic Jets'],
        failureEffect: 'Cessation of X-ray emissions and jet power source.',
        cascadeFailures: ['Relativistic Jets'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Relativistic Jets
    const jetGeom = new THREE.CylinderGeometry(0.2, 1, 20, 32, 1, true);
    jetGeom.translate(0, 10, 0);
    const jetTop = new THREE.Mesh(jetGeom, jetMat);
    const jetBottom = new THREE.Mesh(jetGeom, jetMat);
    jetBottom.rotation.x = Math.PI;
    const jets = new THREE.Group();
    jets.add(jetTop);
    jets.add(jetBottom);
    group.add(jets);
    meshes.jets = jets;
    parts.push({
        name: 'Relativistic Jets',
        description: 'Twin beams of ionized matter ejected from the poles at near-light speed.',
        material: 'High-energy Plasma',
        function: 'Redistributes energy and matter out of the galactic core into deep space.',
        assemblyOrder: 3,
        connections: ['Supermassive Black Hole'],
        failureEffect: 'Energy buildup in the core and less matter injection into the intergalactic medium.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    // Helper function to create particles
    function createParticles(count, radius, heightScale, mat, spiralArms = 0, spiralTwist = 0) {
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for(let i = 0; i < count; i++) {
            let r = Math.random() * radius;
            // More particles towards center
            r = Math.pow(r / radius, 2) * radius; 
            
            let theta = Math.random() * Math.PI * 2;
            
            if (spiralArms > 0) {
                // Adjust theta to clump into arms
                const armOffset = (i % spiralArms) * (Math.PI * 2 / spiralArms);
                const twist = r * spiralTwist;
                theta = armOffset + twist + (Math.random() - 0.5) * 1.5;
            }
            
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            
            // Height based on distance from center
            const h = (Math.random() - 0.5) * heightScale * Math.exp(-r/5);
            
            positions[i*3] = x;
            positions[i*3+1] = h;
            positions[i*3+2] = z;
        }
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return new THREE.Points(geom, mat);
    }

    // 4. Galactic Bulge
    const bulge = createParticles(8000, 8, 8, bulgeMat);
    group.add(bulge);
    meshes.bulge = bulge;
    parts.push({
        name: 'Galactic Bulge',
        description: 'Dense, central group of older stars.',
        material: 'Population II Stars',
        function: 'Houses older stars and creates the central brightness profile of the galaxy.',
        assemblyOrder: 4,
        connections: ['Supermassive Black Hole', 'Spiral Arms'],
        failureEffect: 'Loss of old stellar populations, changing galaxy mass distribution.',
        cascadeFailures: ['Spiral Arms'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // 5. Spiral Arms
    const spiralArms = createParticles(20000, 30, 2, armMat, 4, 0.3);
    group.add(spiralArms);
    meshes.spiralArms = spiralArms;
    parts.push({
        name: 'Spiral Arms',
        description: 'Regions of active star formation containing young, hot stars.',
        material: 'Population I Stars, Gas, Dust',
        function: 'Primary sites of new star birth due to density waves compressing gas.',
        assemblyOrder: 5,
        connections: ['Galactic Bulge', 'Stellar Nurseries'],
        failureEffect: 'Cessation of star formation, causing the galaxy to "red and dead".',
        cascadeFailures: ['Stellar Nurseries'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 0, z: 0 }
    });

    // 6. Stellar Nurseries (Nebulae)
    const nebulae = createParticles(2000, 25, 1, nebulaMat, 4, 0.3);
    group.add(nebulae);
    meshes.nebulae = nebulae;
    parts.push({
        name: 'Stellar Nurseries (Nebulae)',
        description: 'Giant molecular clouds where gas collapses to form stars.',
        material: 'Molecular Hydrogen (H2), Dust',
        function: 'Provide the raw material for stellar genesis.',
        assemblyOrder: 6,
        connections: ['Spiral Arms'],
        failureEffect: 'Depletion of gas reserves, halting new stellar life cycles.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 }
    });

    // 7. Dark Matter Halo
    const halo = createParticles(5000, 50, 50, haloMat);
    group.add(halo);
    meshes.halo = halo;
    parts.push({
        name: 'Dark Matter Halo',
        description: 'Vast, invisible spherical envelope of dark matter.',
        material: 'Non-baryonic Dark Matter',
        function: 'Provides the gravitational glue that prevents the rapidly rotating galaxy from tearing apart.',
        assemblyOrder: 7,
        connections: ['Galactic Bulge', 'Spiral Arms'],
        failureEffect: 'Galaxy rotation curves fail; galaxy disperses into intergalactic space.',
        cascadeFailures: ['Galactic Bulge', 'Spiral Arms', 'Stellar Nurseries'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    const description = "A highly detailed, interactive, three-dimensional model of a spiral galaxy like the Milky Way. It features a central supermassive black hole with its accretion disk and relativistic jets, surrounded by a dense galactic bulge of older stars. Winding outward are prominent spiral arms littered with pinkish stellar nurseries (nebulae) where new stars are born, all embedded within an expansive, invisible dark matter halo that holds the system together.";

    const quizQuestions = [
        {
            question: "Which component prevents a rapidly rotating spiral galaxy from tearing itself apart?",
            options: [
                "The Supermassive Black Hole",
                "Relativistic Jets",
                "Dark Matter Halo",
                "The Accretion Disk"
            ],
            correct: 2,
            explanation: "The Dark Matter Halo provides the extra gravitational mass required to keep the galaxy intact at high rotational speeds, explaining flat galactic rotation curves.",
            difficulty: "Medium"
        },
        {
            question: "Where does the most active star formation occur in a spiral galaxy?",
            options: [
                "In the Galactic Bulge",
                "Inside the Event Horizon",
                "In the Dark Matter Halo",
                "Within the Spiral Arms and Stellar Nurseries"
            ],
            correct: 3,
            explanation: "Spiral arms contain giant molecular clouds (stellar nurseries) where density waves compress gas, triggering intense star formation.",
            difficulty: "Easy"
        },
        {
            question: "What produces the immense energy emitted by an accretion disk?",
            options: [
                "Nuclear fusion of dark matter",
                "Frictional heating of matter spiraling into a black hole",
                "Hawking radiation from the event horizon",
                "Supernova explosions"
            ],
            correct: 1,
            explanation: "As matter spirals into a black hole, it compresses and rubs together at relativistic speeds, generating immense friction and heating it to millions of degrees, releasing X-rays.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        if(!meshesObj) return;
        
        // Accretion disk spins rapidly
        if(meshesObj.accretionDisk) {
            meshesObj.accretionDisk.rotation.z += 0.05 * speed;
        }

        // Jets pulse and spin
        if(meshesObj.jets) {
            meshesObj.jets.rotation.y += 0.02 * speed;
            meshesObj.jets.children.forEach(child => {
                child.material.emissiveIntensity = 4.0 + Math.sin(time * 5) * 2;
            });
        }

        // Bulge rotates slowly
        if(meshesObj.bulge) {
            meshesObj.bulge.rotation.y += 0.002 * speed;
        }

        // Spiral arms rotate as a rigid body (density wave approximation)
        if(meshesObj.spiralArms) {
            meshesObj.spiralArms.rotation.y += 0.001 * speed;
        }

        // Nebulae rotate with arms
        if(meshesObj.nebulae) {
            meshesObj.nebulae.rotation.y += 0.001 * speed;
        }

        // Halo rotates extremely slowly if at all
        if(meshesObj.halo) {
            meshesObj.halo.rotation.y += 0.0001 * speed;
            meshesObj.halo.rotation.z = Math.sin(time * 0.1) * 0.05;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGalaxy() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
