import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials
    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const accretionDiskMat = new THREE.MeshStandardMaterial({ 
        color: 0xff6600, 
        emissive: 0xff4400, 
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const photonSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xffddaa,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.3
    });
    const jetMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 8,
        transparent: true,
        opacity: 0.6
    });
    
    // Meshes for animation
    const meshes = {};

    // 1. Singularity/Event Horizon
    const ehGeo = new THREE.SphereGeometry(2, 64, 64);
    const eventHorizon = new THREE.Mesh(ehGeo, blackHoleMat);
    group.add(eventHorizon);
    meshes.eventHorizon = eventHorizon;
    
    parts.push({
        name: "Event Horizon",
        description: "The boundary beyond which no light can escape the black hole's gravity.",
        material: "Void Material",
        function: "Traps all matter and radiation that crosses it.",
        assemblyOrder: 1,
        connections: ["Photon Sphere", "Accretion Disk"],
        failureEffect: "Hawking radiation evaporation",
        cascadeFailures: ["Loss of mass"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: eventHorizon
    });

    // 2. Photon Sphere
    const psGeo = new THREE.SphereGeometry(3, 64, 64);
    const photonSphere = new THREE.Mesh(psGeo, photonSphereMat);
    group.add(photonSphere);
    meshes.photonSphere = photonSphere;
    
    parts.push({
        name: "Photon Sphere",
        description: "A spherical region where gravity is strong enough that photons travel in orbits.",
        material: "High-Energy Plasma",
        function: "Lenses light from background objects.",
        assemblyOrder: 2,
        connections: ["Event Horizon"],
        failureEffect: "Unstable photon orbits",
        cascadeFailures: ["Radiation burst"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: photonSphere
    });

    // 3. Accretion Disk
    const diskGeo = new THREE.RingGeometry(4, 12, 128, 64);
    const accretionDisk = new THREE.Mesh(diskGeo, accretionDiskMat);
    accretionDisk.rotation.x = Math.PI / 2;
    group.add(accretionDisk);
    meshes.accretionDisk = accretionDisk;

    // Add glowing particles for disk
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i < particleCount * 3; i+=3) {
        const radius = 4 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        posArray[i] = Math.cos(theta) * radius;
        posArray[i+1] = (Math.random() - 0.5) * 0.5;
        posArray[i+2] = Math.sin(theta) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffaa00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const diskParticles = new THREE.Points(particleGeo, particleMat);
    accretionDisk.add(diskParticles);
    meshes.diskParticles = diskParticles;
    
    parts.push({
        name: "Accretion Disk",
        description: "A superheated disk of matter spiraling into the black hole.",
        material: "Superheated Plasma",
        function: "Radiates intense X-rays and feeds mass into the black hole.",
        assemblyOrder: 3,
        connections: ["Event Horizon", "Relativistic Jets"],
        failureEffect: "Starvation of black hole",
        cascadeFailures: ["Jet shutdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: accretionDisk
    });

    // 4. Relativistic Jets
    const jetGeo = new THREE.CylinderGeometry(0.1, 2, 20, 32);
    const topJet = new THREE.Mesh(jetGeo, jetMat);
    topJet.position.y = 10;
    group.add(topJet);
    
    const bottomJet = new THREE.Mesh(jetGeo, jetMat);
    bottomJet.position.y = -10;
    bottomJet.rotation.x = Math.PI;
    group.add(bottomJet);

    const jetsGroup = new THREE.Group();
    jetsGroup.add(topJet);
    jetsGroup.add(bottomJet);
    meshes.jets = jetsGroup;
    
    parts.push({
        name: "Relativistic Jets",
        description: "Beams of ionized matter accelerated to near light speed along the axis of rotation.",
        material: "Relativistic Particles",
        function: "Ejects excess angular momentum and magnetic energy.",
        assemblyOrder: 4,
        connections: ["Accretion Disk"],
        failureEffect: "Energy accumulation",
        cascadeFailures: ["Disk explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 },
        mesh: jetsGroup
    });

    const description = "A highly detailed, scientifically-inspired interactive model of a supermassive black hole. Features include a light-trapping event horizon, glowing photon sphere, superheated accretion disk, and powerful relativistic jets. Observe the extreme physics of the universe's most enigmatic objects.";

    const quizQuestions = [
        {
            question: "What is the boundary around a black hole beyond which nothing can escape?",
            options: ["Photon Sphere", "Accretion Disk", "Event Horizon", "Relativistic Jet"],
            correct: 2,
            explanation: "The Event Horizon is the boundary marking the point of no return. The escape velocity beyond this point exceeds the speed of light.",
            difficulty: "Easy"
        },
        {
            question: "Why does the accretion disk emit intense radiation, such as X-rays?",
            options: ["Nuclear fusion", "Friction and gravitational compression", "Hawking radiation", "Magnetic monopolization"],
            correct: 1,
            explanation: "As matter spirals inward, extreme friction and gravitational forces heat the plasma to millions of degrees, causing it to emit intense X-rays.",
            difficulty: "Medium"
        },
        {
            question: "What powers the relativistic jets of a supermassive black hole?",
            options: ["The black hole's magnetic field and rotation (Penrose process)", "Stellar collisions inside the event horizon", "Dark matter annihilation", "Thermal expansion of the singularity"],
            correct: 0,
            explanation: "The jets are powered by the extraction of rotational energy from the black hole and the twisting of intense magnetic fields generated by the accretion disk.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, activeMeshes = meshes) {
        const t = time * speed;
        
        // Rotate accretion disk
        if (activeMeshes.accretionDisk) {
            activeMeshes.accretionDisk.rotation.z = -t * 0.5;
        }

        // Pulse the photon sphere
        if (activeMeshes.photonSphere) {
            const scale = 1 + Math.sin(t * 2) * 0.05;
            activeMeshes.photonSphere.scale.set(scale, scale, scale);
        }

        // Animate disk particles
        if (activeMeshes.diskParticles) {
            const positions = activeMeshes.diskParticles.geometry.attributes.position.array;
            for(let i=0; i < positions.length; i+=3) {
                let x = positions[i];
                let z = positions[i+2];
                let r = Math.sqrt(x*x + z*z);
                let theta = Math.atan2(z, x);
                
                theta -= 0.02 * speed * (10 / r); // inner orbits faster
                r -= 0.01 * speed;
                
                if (r < 4) {
                    r = 12; // reset to outer edge
                }
                
                positions[i] = r * Math.cos(theta);
                positions[i+2] = r * Math.sin(theta);
            }
            activeMeshes.diskParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Pulse jets
        if (activeMeshes.jets) {
            const pulse = 1 + Math.sin(t * 10) * 0.1;
            activeMeshes.jets.scale.set(pulse, 1, pulse);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBlackHole() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
