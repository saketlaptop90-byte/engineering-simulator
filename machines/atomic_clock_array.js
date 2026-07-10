import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const laserBaseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1 });
    const coolingMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.6 });
    const microwaveMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.8 });
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Components
    // 1. Vacuum Chamber (Caesium Fountain Main Body)
    const chamberGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, chrome);
    chamberMesh.position.set(0, 2, 0);
    chamberMesh.name = 'vacuumChamber';
    group.add(chamberMesh);
    
    parts.push({
        name: 'Vacuum Chamber',
        description: 'Maintains an ultra-high vacuum environment to prevent atoms from colliding with background gas molecules.',
        material: 'Chrome',
        function: 'Isolation',
        assemblyOrder: 1,
        connections: ['coolingLasers', 'microwaveCavity', 'ionTrap'],
        failureEffect: 'Vacuum leak causes rapid collisions, completely disrupting the atomic state and halting timekeeping.',
        cascadeFailures: ['Ion Trap Contamination', 'Laser Interference'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -2 }
    });

    // 2. Cooling Lasers (Base)
    const laserGroup = new THREE.Group();
    laserGroup.position.set(0, 0, 0);
    laserGroup.name = 'coolingLasers';
    
    for(let i=0; i<6; i++) {
        const theta = (i / 6) * Math.PI * 2;
        const laserBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.4), laserBaseMat);
        laserBase.position.set(Math.cos(theta) * 0.8, 0.2, Math.sin(theta) * 0.8);
        laserBase.lookAt(0, 0.2, 0);
        laserGroup.add(laserBase);
        
        const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
        beamGeo.rotateX(Math.PI/2);
        const beam = new THREE.Mesh(beamGeo, laserBeamMat);
        beam.position.set(Math.cos(theta) * 0.4, 0.2, Math.sin(theta) * 0.4);
        beam.lookAt(0, 0.2, 0);
        laserGroup.add(beam);
    }
    group.add(laserGroup);

    parts.push({
        name: 'Cooling Lasers',
        description: 'Six intersecting laser beams that cool Caesium atoms to near absolute zero, forming an optical molasses.',
        material: 'Laser Diode / Optics',
        function: 'Atom Cooling',
        assemblyOrder: 2,
        connections: ['vacuumChamber', 'laserController'],
        failureEffect: 'Atoms fail to cool, making them move too fast for accurate measurement.',
        cascadeFailures: ['Fountain Launch Failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 3. Microwave Cavity
    const microwaveGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
    const microwaveMesh = new THREE.Mesh(microwaveGeo, microwaveMat);
    microwaveMesh.position.set(0, 2.5, 0);
    microwaveMesh.rotation.x = Math.PI / 2;
    microwaveMesh.name = 'microwaveCavity';
    group.add(microwaveMesh);

    parts.push({
        name: 'Microwave Cavity',
        description: 'Exposes atoms to microwaves exactly at their resonance frequency (9,192,631,770 Hz) to induce a state transition.',
        material: 'Copper / Gold',
        function: 'State Transition Excitation',
        assemblyOrder: 3,
        connections: ['vacuumChamber', 'microwaveSynthesizer'],
        failureEffect: 'Atoms do not transition states; no clock signal is produced.',
        cascadeFailures: ['Signal Loss', 'Complete Clock Failure'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: 2 }
    });

    // 4. Detection Laser
    const detectorGeo = new THREE.BoxGeometry(0.8, 0.3, 0.3);
    const detectorMesh = new THREE.Mesh(detectorGeo, darkSteel);
    detectorMesh.position.set(0, 3.5, 0);
    detectorMesh.name = 'detector';
    group.add(detectorMesh);
    
    const detectionBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), laserBeamMat);
    detectionBeam.rotation.z = Math.PI / 2;
    detectionBeam.position.set(0, 3.5, 0);
    detectorMesh.add(detectionBeam);

    parts.push({
        name: 'Detection System',
        description: 'A laser and photo-detector that measures how many atoms successfully transitioned states.',
        material: 'Photodiode / Silicon',
        function: 'Measurement',
        assemblyOrder: 4,
        connections: ['vacuumChamber', 'controlSystem'],
        failureEffect: 'Cannot read the atomic state, breaking the feedback loop that keeps the clock accurate.',
        cascadeFailures: ['Clock Drift', 'Synchronization Loss'],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 2, y: 3.5, z: 0 }
    });

    // 5. Magnetic Shielding
    const shieldGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.2, 32, 1, true);
    const shieldMesh = new THREE.Mesh(shieldGeo, aluminum);
    shieldMesh.position.set(0, 2, 0);
    shieldMesh.material.transparent = true;
    shieldMesh.material.opacity = 0.3;
    shieldMesh.name = 'magneticShield';
    group.add(shieldMesh);

    parts.push({
        name: 'Mu-Metal Magnetic Shield',
        description: 'Protects the sensitive atoms from external magnetic fields which could shift their energy levels (Zeeman effect).',
        material: 'Mu-Metal',
        function: 'Environmental Isolation',
        assemblyOrder: 5,
        connections: ['vacuumChamber'],
        failureEffect: 'External magnetic noise shifts the clock frequency, ruining accuracy.',
        cascadeFailures: ['Time Drift'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -2, y: 2, z: 0 }
    });

    // Atoms (Particles for animation)
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 0.2;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.05, color: 0x88ffff, transparent: true, opacity: 0.8 });
    const atomCloud = new THREE.Points(particles, particleMat);
    atomCloud.position.set(0, 0.2, 0);
    atomCloud.name = 'atomCloud';
    group.add(atomCloud);

    const description = "The Caesium Fountain Atomic Clock represents the pinnacle of timekeeping technology. It cools Caesium-133 atoms to near absolute zero using lasers, tosses them upwards in a vacuum chamber, and uses microwaves to measure their extremely precise atomic transitions, defining the exact length of a second.";

    const quizQuestions = [
        {
            question: "Why are the Caesium atoms tossed upwards in a 'fountain'?",
            options: [
                "To increase their temperature",
                "To maximize the time they spend in the microwave cavity",
                "To prevent them from sticking to the bottom",
                "To make them visible to the naked eye"
            ],
            correct: 1,
            explanation: "Tossing the cold atoms upwards allows them to fall back down under gravity, giving them about a second of interaction time with the microwaves, vastly increasing the precision of the measurement.",
            difficulty: "Medium"
        },
        {
            question: "What frequency of microwaves causes the exact state transition in Caesium-133 used to define the second?",
            options: [
                "1,000,000 Hz",
                "2.4 GHz",
                "9,192,631,770 Hz",
                "14,200,000,000 Hz"
            ],
            correct: 2,
            explanation: "The second is officially defined as exactly 9,192,631,770 cycles of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the caesium-133 atom.",
            difficulty: "Hard"
        },
        {
            question: "What is the purpose of the optical molasses (cooling lasers)?",
            options: [
                "To heat the atoms to a plasma state",
                "To push the atoms into the detector",
                "To slow the atoms down, cooling them to near absolute zero",
                "To provide power to the microwave cavity"
            ],
            correct: 2,
            explanation: "By bombarding the atoms with lasers from all sides, their momentum is counteracted, cooling them to microkelvin temperatures. This reduces thermal noise and Doppler shifts.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        if (meshes.microwaveCavity) {
            meshes.microwaveCavity.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 5) * 0.5;
            meshes.microwaveCavity.rotation.z += 0.01 * speed;
        }
        
        if (meshes.atomCloud) {
            // Simulate the fountain motion (up and down)
            const cycle = (time * speed * 0.5) % Math.PI;
            const height = Math.abs(Math.sin(cycle)) * 3; // Toss up to y=3
            meshes.atomCloud.position.y = 0.2 + height;
            
            // Expand/contract the cloud
            const scale = 1 + Math.sin(time * speed * 10) * 0.1;
            meshes.atomCloud.scale.set(scale, scale, scale);

            // Change color based on state (excitation)
            if (height > 2) {
                meshes.atomCloud.material.color.setHex(0xffaa00); // Excited state
            } else {
                meshes.atomCloud.material.color.setHex(0x88ffff); // Ground state
            }
        }
        
        if (meshes.magneticShield) {
            meshes.magneticShield.rotation.y += 0.005 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createAtomicClockArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
