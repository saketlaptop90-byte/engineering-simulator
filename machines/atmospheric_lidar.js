import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const laserMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending 
    });
    
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x55ff55,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // 1. Main Base
    const baseGeom = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 0.25, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;
    parts.push({
        name: "Main Base Platform",
        description: "Heavy stabilizing platform for the LIDAR system.",
        material: "Dark Steel",
        function: "Provides a vibration-free foundation essential for precise optical measurements.",
        assemblyOrder: 1,
        connections: ["Scanner Turret"],
        failureEffect: "Vibrations lead to noisy data and misaligned laser pointing.",
        cascadeFailures: ["Laser Beam", "Receiver Optics"],
        originalPosition: { x: 0, y: 0.25, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Scanner Turret
    const turretGeom = new THREE.BoxGeometry(2.5, 3, 2.5);
    const turretMesh = new THREE.Mesh(turretGeom, steel);
    turretMesh.position.set(0, 2, 0);
    group.add(turretMesh);
    meshes.turret = turretMesh;
    parts.push({
        name: "Scanner Turret",
        description: "Azimuth and elevation rotation stage.",
        material: "Steel",
        function: "Steers the transmitted laser and the receiver telescope across the sky.",
        assemblyOrder: 2,
        connections: ["Main Base Platform", "Laser Housing", "Receiver Telescope"],
        failureEffect: "Inability to scan, limiting measurements to a single line of sight.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -5 }
    });

    // 3. Laser Housing
    const laserHousingGeom = new THREE.BoxGeometry(1, 1, 3);
    const laserHousingMesh = new THREE.Mesh(laserHousingGeom, aluminum);
    laserHousingMesh.position.set(1.5, 2.5, 0.5);
    turretMesh.add(laserHousingMesh);
    meshes.laserHousing = laserHousingMesh;
    parts.push({
        name: "Laser Source Housing",
        description: "Contains the Nd:YAG pulsed laser emitter.",
        material: "Aluminum",
        function: "Generates high-energy, short optical pulses directed into the atmosphere.",
        assemblyOrder: 3,
        connections: ["Scanner Turret", "Beam Expander"],
        failureEffect: "Loss of optical signal, stopping all measurements.",
        cascadeFailures: ["Laser Beam"],
        originalPosition: { x: 1.5, y: 2.5, z: 0.5 },
        explodedPosition: { x: 5, y: 2.5, z: 0.5 }
    });

    // 4. Receiver Telescope (Primary Mirror)
    const telescopeGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    telescopeGeom.rotateX(Math.PI / 2);
    const telescopeMesh = new THREE.Mesh(telescopeGeom, chrome);
    telescopeMesh.position.set(-0.8, 2, 0.5);
    turretMesh.add(telescopeMesh);
    meshes.telescope = telescopeMesh;
    parts.push({
        name: "Receiver Telescope",
        description: "Large aperture collection optics.",
        material: "Chrome / Glass",
        function: "Collects the weak backscattered photons from atmospheric aerosols and molecules.",
        assemblyOrder: 4,
        connections: ["Scanner Turret", "Photodetector"],
        failureEffect: "Reduced signal-to-noise ratio, limiting the maximum range.",
        cascadeFailures: ["Data Acquisition System"],
        originalPosition: { x: -0.8, y: 2, z: 0.5 },
        explodedPosition: { x: -4, y: 2, z: 0.5 }
    });

    // 5. Photodetector Block
    const detectorGeom = new THREE.BoxGeometry(0.8, 0.8, 1);
    const detectorMesh = new THREE.Mesh(detectorGeom, copper);
    detectorMesh.position.set(-0.8, 2, -1.5);
    turretMesh.add(detectorMesh);
    meshes.detector = detectorMesh;
    parts.push({
        name: "Photodetector Block",
        description: "Avalanche Photodiode (APD) or Photomultiplier Tube (PMT).",
        material: "Copper",
        function: "Converts weak optical signals into measurable electrical currents.",
        assemblyOrder: 5,
        connections: ["Receiver Telescope", "Data Acquisition System"],
        failureEffect: "Total loss of sensor data.",
        cascadeFailures: ["Data Acquisition System"],
        originalPosition: { x: -0.8, y: 2, z: -1.5 },
        explodedPosition: { x: -4, y: 2, z: -3 }
    });

    // 6. Laser Beam (Dynamic)
    const beamGeom = new THREE.CylinderGeometry(0.05, 0.2, 15, 16);
    beamGeom.translate(0, 7.5, 0);
    beamGeom.rotateX(Math.PI / 2);
    const beamMesh = new THREE.Mesh(beamGeom, laserMaterial);
    beamMesh.position.set(1.5, 2.5, 2);
    turretMesh.add(beamMesh);
    meshes.beam = beamMesh;
    parts.push({
        name: "Laser Beam",
        description: "Pulsed optical energy propagating through the atmosphere.",
        material: "Photons",
        function: "Interacts with aerosols and gas molecules to create backscatter.",
        assemblyOrder: 6,
        connections: ["Laser Source Housing"],
        failureEffect: "Beam attenuation prevents long-range measurement.",
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: 2.5, z: 2 },
        explodedPosition: { x: 5, y: 2.5, z: 10 }
    });

    // 7. Scattering Particles
    const particleGroup = new THREE.Group();
    beamMesh.add(particleGroup);
    meshes.particles = [];
    const sphereGeom = new THREE.SphereGeometry(0.1, 8, 8);
    for(let i=0; i<30; i++) {
        const pMesh = new THREE.Mesh(sphereGeom, particleMaterial);
        pMesh.position.set((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, Math.random() * 15);
        pMesh.userData = { speed: Math.random() * 2 + 1, offset: Math.random() * 15 };
        particleGroup.add(pMesh);
        meshes.particles.push(pMesh);
    }

    const description = "Atmospheric LIDAR (Light Detection and Ranging) uses pulsed lasers to measure atmospheric properties. It transmits a laser beam into the sky and collects the backscattered light with a telescope to map aerosols, clouds, and wind patterns.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Receiver Telescope in a LIDAR system?",
            options: [
                "To amplify the outgoing laser pulse",
                "To steer the laser beam",
                "To collect weak backscattered light from the atmosphere",
                "To digitize the analog signal"
            ],
            correct: 2,
            explanation: "The receiver telescope acts as a large light bucket, capturing the extremely weak backscattered photons and focusing them onto the photodetector.",
            difficulty: "Medium"
        },
        {
            question: "Which component converts backscattered photons into an electrical signal?",
            options: [
                "Laser Source Housing",
                "Photodetector Block",
                "Scanner Turret",
                "Main Base Platform"
            ],
            correct: 1,
            explanation: "The Photodetector Block (usually containing an APD or PMT) uses the photoelectric effect to turn photons into measurable electrical currents.",
            difficulty: "Easy"
        },
        {
            question: "Why does an Atmospheric LIDAR use pulsed lasers rather than a continuous wave?",
            options: [
                "To save electricity",
                "To determine the range (distance) to the scattering particles by timing the pulse",
                "To prevent the optics from overheating",
                "To create a visible light show"
            ],
            correct: 1,
            explanation: "By emitting short pulses and measuring the time it takes for the light to return, the LIDAR can calculate the exact distance (range) to the scattering atmospheric layers.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed) {
        // Rotate turret
        meshes.turret.rotation.y = Math.sin(time * 0.5 * speed) * 0.5;
        meshes.turret.rotation.x = Math.sin(time * 0.3 * speed) * 0.2;

        // Pulse the laser beam opacity
        meshes.beam.material.opacity = 0.5 + Math.sin(time * 10 * speed) * 0.3;

        // Animate scattering particles moving up the beam and flashing
        meshes.particles.forEach((p, i) => {
            p.position.z = ((time * p.userData.speed * speed + p.userData.offset) % 15);
            p.material.opacity = Math.max(0, Math.sin(time * 15 * speed + i) * 0.8);
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAtmosphericLidar() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
