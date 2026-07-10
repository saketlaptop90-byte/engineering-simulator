import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials
    const electronBeamMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const cryogenicFluidMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });

    const sensorActiveMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    // 1. Electron Gun (Top)
    const electronGunGeo = new THREE.CylinderGeometry(1, 1.5, 3, 32);
    const electronGun = new THREE.Mesh(electronGunGeo, chrome);
    electronGun.position.set(0, 10, 0);
    electronGun.userData.name = "Electron Gun";
    group.add(electronGun);

    parts.push({
        name: "Electron Gun",
        description: "Emits a highly focused beam of electrons.",
        material: "Chrome",
        function: "Generates the electron beam required for imaging.",
        assemblyOrder: 1,
        connections: ["Condenser Lenses"],
        failureEffect: "Loss of imaging beam.",
        cascadeFailures: ["Detector reads blank"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 2. Condenser Lenses (Upper Column)
    const condenserGeo = new THREE.CylinderGeometry(1.6, 1.6, 4, 32);
    const condenser = new THREE.Mesh(condenserGeo, darkSteel);
    condenser.position.set(0, 6.5, 0);
    condenser.userData.name = "Condenser Lenses";
    group.add(condenser);

    parts.push({
        name: "Condenser Lenses",
        description: "Electromagnetic lenses that focus the electron beam.",
        material: "Dark Steel",
        function: "Focuses the electron beam onto the specimen.",
        assemblyOrder: 2,
        connections: ["Electron Gun", "Sample Chamber"],
        failureEffect: "Blurry or unaligned beam.",
        cascadeFailures: ["Poor resolution", "Specimen damage"],
        originalPosition: { x: 0, y: 6.5, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 5 }
    });

    // 3. Sample Chamber (Cryogenic Stage)
    const sampleChamberGeo = new THREE.BoxGeometry(4, 3, 4);
    const sampleChamber = new THREE.Mesh(sampleChamberGeo, aluminum);
    sampleChamber.position.set(0, 3, 0);
    sampleChamber.userData.name = "Sample Chamber";
    group.add(sampleChamber);

    const cryoTankGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16);
    const cryoTank = new THREE.Mesh(cryoTankGeo, cryogenicFluidMat);
    cryoTank.position.set(2.5, 3, 0);
    cryoTank.userData.name = "Liquid Nitrogen Tank";
    group.add(cryoTank);

    parts.push({
        name: "Sample Chamber & Cryo Stage",
        description: "Houses the vitrified biological sample at liquid nitrogen temperatures.",
        material: "Aluminum & Cryogenic Fluid",
        function: "Maintains the sample in a vitreous ice state to prevent crystallization damage.",
        assemblyOrder: 3,
        connections: ["Condenser Lenses", "Objective Lenses"],
        failureEffect: "Temperature rise.",
        cascadeFailures: ["Sample crystallization", "Data destruction"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 5, y: 3, z: -5 }
    });

    // 4. Objective Lenses (Lower Column)
    const objectiveGeo = new THREE.CylinderGeometry(1.5, 1.8, 3, 32);
    const objective = new THREE.Mesh(objectiveGeo, copper);
    objective.position.set(0, 0, 0);
    objective.userData.name = "Objective Lenses";
    group.add(objective);

    parts.push({
        name: "Objective Lenses",
        description: "The primary imaging lenses.",
        material: "Copper",
        function: "Forms the initial magnified image of the sample.",
        assemblyOrder: 4,
        connections: ["Sample Chamber", "Detector"],
        failureEffect: "Loss of magnification.",
        cascadeFailures: ["Unusable image data"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 5. Direct Electron Detector (Base)
    const detectorGeo = new THREE.BoxGeometry(5, 2, 5);
    const detector = new THREE.Mesh(detectorGeo, darkSteel);
    detector.position.set(0, -2.5, 0);
    detector.userData.name = "Direct Electron Detector";
    group.add(detector);

    const sensorGeo = new THREE.PlaneGeometry(3, 3);
    const sensor = new THREE.Mesh(sensorGeo, sensorActiveMat);
    sensor.rotation.x = -Math.PI / 2;
    sensor.position.set(0, -1.49, 0);
    sensor.userData.name = "Detector Sensor";
    group.add(sensor);

    parts.push({
        name: "Direct Electron Detector",
        description: "Ultra-sensitive camera for capturing scattered electrons.",
        material: "Dark Steel & Active Sensor",
        function: "Records the electron scattering pattern to reconstruct 3D structures.",
        assemblyOrder: 5,
        connections: ["Objective Lenses"],
        failureEffect: "No image captured.",
        cascadeFailures: ["Data pipeline stalled"],
        originalPosition: { x: 0, y: -2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Animated Electron Beam
    const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 14, 8);
    const electronBeam = new THREE.Mesh(beamGeo, electronBeamMat);
    electronBeam.position.set(0, 3, 0);
    electronBeam.userData.name = "Electron Beam";
    group.add(electronBeam);

    // Structure casing
    const casingGeo = new THREE.BoxGeometry(3.5, 16, 3.5);
    const casing = new THREE.Mesh(casingGeo, tinted);
    casing.position.set(0, 3.5, 0);
    group.add(casing);

    const description = "The Cryo-Electron Microscope (Cryo-EM) fires a beam of electrons through a vitrified biological sample (like a protein complex) kept at liquid nitrogen temperatures. Electromagnetic lenses focus and magnify the scattered electrons, which are captured by a direct electron detector to computationally reconstruct highly detailed 3D molecular structures.";

    const quizQuestions = [
        {
            question: "Why must the biological sample be kept at cryogenic temperatures?",
            options: [
                "To freeze the electrons in place.",
                "To prevent the water in the sample from forming damaging ice crystals (vitrification).",
                "To make the microscope column superconductive.",
                "To speed up the electron beam."
            ],
            correct: 1,
            explanation: "Cryogenic freezing (vitrification) cools water so rapidly that it forms an amorphous glass-like state rather than crystalline ice, which would damage the delicate biological structures.",
            difficulty: "Medium"
        },
        {
            question: "What replaces traditional glass lenses in an electron microscope?",
            options: [
                "Diamond prisms",
                "Electromagnetic lenses",
                "Fiber optic cables",
                "Silicon wafers"
            ],
            correct: 1,
            explanation: "Because electrons cannot be focused by glass, electromagnetic fields are used as 'lenses' to bend and focus the electron beam.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary advantage of a Direct Electron Detector?",
            options: [
                "It converts electrons to photons first.",
                "It requires less power.",
                "It directly detects electrons, significantly improving signal-to-noise ratio and resolution.",
                "It operates at room temperature."
            ],
            correct: 2,
            explanation: "Older cameras converted electrons to light via a scintillator before detection. Direct electron detectors count electrons directly, greatly increasing image clarity and enabling near-atomic resolution.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate the electron beam
        const beam = meshes.find(m => m.userData.name === "Electron Beam");
        if (beam) {
            beam.material.opacity = 0.6 + Math.sin(time * 10 * speed) * 0.4;
            beam.scale.x = 1 + Math.sin(time * 20 * speed) * 0.2;
            beam.scale.z = 1 + Math.sin(time * 20 * speed) * 0.2;
        }

        // Pulse the active sensor
        const sensor = meshes.find(m => m.userData.name === "Detector Sensor");
        if (sensor) {
            sensor.material.emissiveIntensity = 1.0 + Math.sin(time * 5 * speed) * 0.5;
        }
        
        // Bubbling effect in cryo tank (visualized by oscillating scaling)
        const tank = meshes.find(m => m.userData.name === "Liquid Nitrogen Tank");
        if (tank) {
             tank.scale.y = 1 + Math.sin(time * 3 * speed) * 0.05;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createCryoEMProcessor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
