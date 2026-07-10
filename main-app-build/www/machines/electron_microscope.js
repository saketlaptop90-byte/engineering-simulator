import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createElectronMicroscope(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- Create Custom Animation Elements (Beam and Particles) ---
    // These are added to the group but not treated as structural 'parts' for the exploded view
    const beamMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 });
    
    // Primary Straight Beam (Gun to Scanning Coils)
    const primaryBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.5), beamMaterial);
    primaryBeam.position.set(0, 5.75, 0);
    group.add(primaryBeam);

    // Scanned/Deflected Beam Pivot
    const scannedBeamPivot = new THREE.Group();
    scannedBeamPivot.position.set(0, 2, 0); // Pivot at scanning coils
    const scannedBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.04, 6.5), beamMaterial);
    scannedBeam.position.set(0, -3.25, 0); // Extending down to the stage
    scannedBeamPivot.add(scannedBeam);
    group.add(scannedBeamPivot);

    // Secondary Electron Particles
    const particles = [];
    for(let i = 0; i < 30; i++) {
        const pMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8), 
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        pMesh.visible = false;
        group.add(pMesh);
        particles.push({ mesh: pMesh, progress: Math.random() });
    }

    // --- Helper function to build complex parts ---
    function addPart(partData) {
        partData.group.name = partData.name;
        group.add(partData.group);
        parts.push(partData);
    }

    // 1. Electron Gun
    const gunGroup = new THREE.Group();
    gunGroup.position.set(0, 9.5, 0);
    const gunHousing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 32), chrome);
    const gunCap = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), chrome);
    gunCap.position.y = 1.5;
    const filament = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), tinted(steel, 0xffaa00));
    filament.position.y = -1.25;
    gunGroup.add(gunHousing, gunCap, filament);
    
    addPart({
        group: gunGroup,
        name: "Electron Gun",
        description: "Contains a tungsten filament or field emission tip that generates the primary beam of electrons when heated and subjected to a strong electric field.",
        material: "Chrome / Tungsten",
        function: "Generates the primary electron beam.",
        assemblyOrder: 1,
        connections: ["Anode", "High Voltage Supply"],
        failureEffect: "Loss of electron beam, resulting in no image.",
        cascadeFailures: ["Complete system blackout"],
        originalPosition: { x: 0, y: 9.5, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 0 }
    });

    // 2. Anode
    const anodeGroup = new THREE.Group();
    anodeGroup.position.set(0, 7.5, 0);
    const anodePlate = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), copper);
    anodePlate.rotation.x = Math.PI / 2;
    anodeGroup.add(anodePlate);

    addPart({
        group: anodeGroup,
        name: "Anode",
        description: "A positively charged metal plate with a central hole that accelerates the electrons emitted by the gun downwards into the column.",
        material: "Copper",
        function: "Accelerates electrons to form a high-energy beam.",
        assemblyOrder: 2,
        connections: ["Electron Gun", "Condenser Lenses"],
        failureEffect: "Electrons are not accelerated, beam lacks energy to reach the sample.",
        cascadeFailures: ["Poor resolution", "Loss of signal"],
        originalPosition: { x: 0, y: 7.5, z: 0 },
        explodedPosition: { x: 4, y: 7.5, z: 0 }
    });

    // 3. Condenser Lenses
    const condenserGroup = new THREE.Group();
    condenserGroup.position.set(0, 4.5, 0);
    const lensBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 32), darkSteel);
    const coils = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.8, 32), wireCoil);
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.1, 16), darkSteel); // representing hollow core
    condenserGroup.add(lensBody, coils);

    addPart({
        group: condenserGroup,
        name: "Condenser Lenses",
        description: "Electromagnetic coils that focus the accelerated electron beam to a smaller diameter, controlling the beam current and spot size.",
        material: "Dark Steel & Copper Wire",
        function: "Demagnifies and focuses the electron beam.",
        assemblyOrder: 3,
        connections: ["Anode", "Scanning Coils"],
        failureEffect: "Beam becomes too broad, severely degrading image resolution.",
        cascadeFailures: ["Low signal-to-noise ratio", "Specimen charging"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: -5, y: 4.5, z: 0 }
    });

    // 4. Scanning Coils
    const scanGroup = new THREE.Group();
    scanGroup.position.set(0, 2, 0);
    const coilRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.3, 16, 32), plastic);
    coilRing.rotation.x = Math.PI / 2;
    scanGroup.add(coilRing);
    // Add 4 orthogonal electromagnets
    for (let i = 0; i < 4; i++) {
        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), wireCoil);
        mag.position.set(Math.cos(i * Math.PI / 2) * 0.8, 0, Math.sin(i * Math.PI / 2) * 0.8);
        mag.lookAt(0, 0, 0);
        scanGroup.add(mag);
    }

    addPart({
        group: scanGroup,
        name: "Scanning Coils",
        description: "Sets of electromagnets that rapidly deflect the focused electron beam back and forth in a raster pattern across the sample surface.",
        material: "Wire Coil & Plastic",
        function: "Deflects the beam to raster-scan the specimen.",
        assemblyOrder: 4,
        connections: ["Condenser Lenses", "Objective Lens"],
        failureEffect: "Beam remains stationary; only a single spot on the specimen is illuminated.",
        cascadeFailures: ["Specimen burn/damage at spot", "No image formation"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: -5 }
    });

    // 5. Objective Lens
    const objectiveGroup = new THREE.Group();
    objectiveGroup.position.set(0, 0.5, 0);
    const objShape = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.5, 1.5, 32), steel);
    const objTip = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.2, 0.5, 32), steel);
    objTip.position.y = -1.0;
    objectiveGroup.add(objShape, objTip);

    addPart({
        group: objectiveGroup,
        name: "Objective Lens",
        description: "The final electromagnetic lens that finely focuses the electron probe onto the precise surface of the sample.",
        material: "Steel",
        function: "Focuses the scanning beam to an extremely fine point on the sample.",
        assemblyOrder: 5,
        connections: ["Scanning Coils", "Vacuum Chamber"],
        failureEffect: "Out-of-focus, blurry image regardless of condenser settings.",
        cascadeFailures: ["Astigmatism issues", "Distorted imaging"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 5, y: 0.5, z: 0 }
    });

    // 6. Vacuum Chamber
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, -3, 0);
    const chamberBody = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 5, 32, 1, true, 0, Math.PI * 1.5), tinted(glass, 0x88bbff)); 
    // Left open for viewing (sweep angle PI*1.5)
    const chamberBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.5, 32), darkSteel);
    chamberBase.position.y = -2.5;
    const chamberTop = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.2, 16, 32), darkSteel);
    chamberTop.rotation.x = Math.PI / 2;
    chamberTop.position.y = 2.5;
    chamberGroup.add(chamberBody, chamberBase, chamberTop);

    addPart({
        group: chamberGroup,
        name: "Vacuum Chamber",
        description: "A robust, heavily sealed containment vessel that maintains a high vacuum environment essential for electron microscopy.",
        material: "Glass / Dark Steel",
        function: "Prevents air molecules from scattering the electron beam.",
        assemblyOrder: 6,
        connections: ["Objective Lens", "Specimen Stage", "Vacuum Pump"],
        failureEffect: "Air enters the system, beam scatters immediately, filament burns out.",
        cascadeFailures: ["Filament destruction", "Pump overload"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 6 }
    });

    // 7. Specimen Stage
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -4.5, 0);
    const stageBase = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 2), aluminum);
    const sampleStub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), brass);
    sampleStub.position.y = 0.3;
    const sample = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15), tinted(ceramic, 0x888888));
    sample.position.y = 0.5;
    stageGroup.add(stageBase, sampleStub, sample);

    addPart({
        group: stageGroup,
        name: "Specimen Stage",
        description: "A high-precision motorized platform capable of moving the sample in X, Y, Z, tilt, and rotation axes.",
        material: "Aluminum / Brass",
        function: "Holds and positions the sample precisely under the beam.",
        assemblyOrder: 7,
        connections: ["Vacuum Chamber"],
        failureEffect: "Inability to navigate the sample or properly focus on specific regions.",
        cascadeFailures: ["Sample drift during imaging"],
        originalPosition: { x: 0, y: -4.5, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 8. Secondary Electron Detector (SED)
    const sedGroup = new THREE.Group();
    sedGroup.position.set(2.5, -3.5, 0);
    sedGroup.rotation.z = Math.PI / 6; // Angle down towards sample
    const sedTube = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2), aluminum);
    sedTube.rotation.z = Math.PI / 2;
    const faradayCage = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5), wireCoil);
    faradayCage.position.x = -1.2;
    faradayCage.rotation.z = Math.PI / 2;
    const scintillatorTip = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), glass);
    scintillatorTip.position.x = -1.3;
    sedGroup.add(sedTube, faradayCage, scintillatorTip);

    addPart({
        group: sedGroup,
        name: "Secondary Electron Detector",
        description: "An Everhart-Thornley detector that uses a Faraday cage to attract low-energy secondary electrons, amplifying them to form a topographic image.",
        material: "Aluminum & Glass Scintillator",
        function: "Captures secondary electrons to generate detailed 3D-like topographic images.",
        assemblyOrder: 8,
        connections: ["Vacuum Chamber"],
        failureEffect: "Loss of standard surface imaging capability (black screen).",
        cascadeFailures: ["Complete dependence on backscattered detector"],
        originalPosition: { x: 2.5, y: -3.5, z: 0 },
        explodedPosition: { x: 6, y: -3.5, z: 0 }
    });

    // 9. Backscattered Electron Detector (BSED)
    const bsedGroup = new THREE.Group();
    bsedGroup.position.set(0, -0.8, 0);
    const bsedPlate = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), greenPCB);
    bsedPlate.rotation.x = Math.PI / 2;
    const bsedSensor = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.6, 32), tinted(siliconMaterial(), 0x333333));
    bsedSensor.rotation.x = Math.PI / 2;
    bsedSensor.position.y = -0.1;
    bsedGroup.add(bsedPlate, bsedSensor);

    function siliconMaterial() {
        return new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    }

    addPart({
        group: bsedGroup,
        name: "Backscattered Electron Detector",
        description: "A solid-state detector positioned directly above the sample to catch high-energy backscattered electrons.",
        material: "PCB / Silicon",
        function: "Provides compositional contrast images based on the atomic number of elements in the sample.",
        assemblyOrder: 9,
        connections: ["Objective Lens"],
        failureEffect: "Loss of compositional (Z-contrast) imaging.",
        cascadeFailures: ["Inability to distinguish different materials accurately"],
        originalPosition: { x: 0, y: -0.8, z: 0 },
        explodedPosition: { x: -4, y: -0.8, z: 0 }
    });

    // 10. Vacuum Pump System
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(-4.5, -4, 0);
    const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 2), castIron);
    const pumpPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), darkSteel);
    pumpPipe.rotation.z = Math.PI / 2;
    pumpPipe.position.set(1.5, 1, 0);
    const pumpFan = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16), steel);
    pumpFan.rotation.x = Math.PI / 2;
    pumpFan.position.set(0, 0, 1.1);
    pumpGroup.add(pumpBody, pumpPipe, pumpFan);
    pumpGroup.userData.fan = pumpFan; // For animation

    addPart({
        group: pumpGroup,
        name: "Vacuum Pump System",
        description: "A combination of mechanical roughing pumps and high-vacuum turbomolecular or ion pumps.",
        material: "Cast Iron & Steel",
        function: "Evacuates all air from the chamber and optical column to maintain a high vacuum.",
        assemblyOrder: 10,
        connections: ["Vacuum Chamber"],
        failureEffect: "Vacuum drops, safety interlocks shut down the electron gun to prevent burnout.",
        cascadeFailures: ["Complete system shutdown", "Sample contamination"],
        originalPosition: { x: -4.5, y: -4, z: 0 },
        explodedPosition: { x: -9, y: -4, z: 0 }
    });

    const description = "The Scanning Electron Microscope (SEM) utilizes a focused beam of high-energy electrons to generate a variety of signals at the surface of solid specimens. The signals reveal information about the sample including external morphology (texture), chemical composition, and crystalline structure.";

    const quizQuestions = [
        {
            question: "Why do electron microscopes achieve significantly higher resolution than light microscopes?",
            options: [
                "Electrons travel faster than the speed of light.",
                "Electrons have a much shorter wavelength than visible light photons.",
                "Magnetic lenses are inherently perfect and have no aberrations.",
                "Electron microscopes use a larger field of view."
            ],
            correctIndex: 1,
            explanation: "According to the de Broglie hypothesis, electrons have a wavelength much smaller than visible light, allowing them to resolve significantly smaller structures (down to nanometers) without diffraction limits seen in light microscopy.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the electromagnetic lenses in an SEM?",
            options: [
                "To magnify the secondary electrons bouncing off the sample.",
                "To filter out unwanted light photons.",
                "To accelerate electrons to a higher speed.",
                "To focus the electron beam into a highly concentrated point."
            ],
            correctIndex: 3,
            explanation: "The condenser and objective lenses use strong magnetic fields to demagnify and focus the electron beam into an extremely fine probe point before it strikes the sample.",
            difficulty: "Easy"
        },
        {
            question: "Why must the electron beam travel through a high vacuum chamber?",
            options: [
                "To prevent electrons from scattering via collisions with gas molecules.",
                "To keep the internal components at a cryogenic temperature.",
                "To prevent the sample from evaporating under the beam.",
                "To create a magnetic pull that speeds up the beam."
            ],
            correctIndex: 0,
            explanation: "If the column contained air, electrons would rapidly collide with gas molecules, scattering the beam and making it impossible to focus or accurately image the sample.",
            difficulty: "Medium"
        },
        {
            question: "Which detector is primarily responsible for generating 3D-like, topographic images of the sample's surface?",
            options: [
                "Backscattered Electron Detector (BSED)",
                "Secondary Electron Detector (SED)",
                "Energy Dispersive X-Ray Spectrometer (EDS)",
                "Vacuum Pump Sensor"
            ],
            correctIndex: 1,
            explanation: "The Secondary Electron Detector captures low-energy secondary electrons ejected near the sample's surface. Because emission depends heavily on the surface angle, it produces highly detailed topographic contrast.",
            difficulty: "Easy"
        },
        {
            question: "What dictates the specific raster scanning pattern of the electron beam across the sample?",
            options: [
                "The mechanical movement of the specimen stage.",
                "The temperature fluctuation in the electron gun.",
                "The rapidly changing magnetic fields of the scanning coils.",
                "The physical shape of the objective lens aperture."
            ],
            correctIndex: 2,
            explanation: "The scanning coils are sets of electromagnets that rapidly alter their magnetic fields to deflect the beam back and forth, painting a raster pattern grid over the specimen.",
            difficulty: "Medium"
        },
        {
            question: "What primarily causes Backscattered Electrons (BSE) to emerge from the sample?",
            options: [
                "Electrons bouncing back due to elastic collisions with atomic nuclei.",
                "Heat generated by the primary beam.",
                "Secondary emission from the sample's outer valence shells.",
                "Photon emission from inner shell electron transitions."
            ],
            correctIndex: 0,
            explanation: "Backscattered electrons are high-energy primary electrons that undergo elastic scattering with the positively charged nuclei of atoms in the sample. Heavier elements (higher atomic number) scatter more electrons, creating compositional contrast.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // --- 1. Beam Scanning Animation ---
        // Angle of deflection (X and Z)
        const scanAngleX = Math.sin(time * 5 * speed) * 0.12; 
        const scanAngleZ = Math.cos(time * 3 * speed) * 0.12;
        
        scannedBeamPivot.rotation.z = scanAngleX;
        scannedBeamPivot.rotation.x = scanAngleZ;

        // --- 2. Secondary Electrons Particles ---
        // Calculate where the beam currently hits the stage (Y = -4.5 approx)
        // Since pivot is at Y = 2, distance to stage is 6.5
        const targetHitX = Math.sin(scanAngleX) * 6.5;
        const targetHitZ = Math.sin(scanAngleZ) * 6.5;
        const stageHitY = -4.2; 

        // SED Detector center position to suck the particles towards
        const sedX = 2.0;
        const sedY = -3.5;
        const sedZ = 0;

        particles.forEach((p, idx) => {
            p.progress += 0.02 * speed + (idx * 0.0005); // slightly varied speeds
            
            if (p.progress >= 1.0) {
                p.progress = 0;
            }
            
            if (p.progress > 0 && speed > 0.1) {
                p.mesh.visible = true;
                const t = p.progress;
                
                // Parabolic trajectory from target hit point to SED
                p.mesh.position.x = targetHitX + (sedX - targetHitX) * t;
                p.mesh.position.z = targetHitZ + (sedZ - targetHitZ) * t;
                
                // Arc in the Y axis
                const arc = Math.sin(t * Math.PI) * 1.5; 
                p.mesh.position.y = stageHitY + (sedY - stageHitY) * t + arc;
            } else {
                p.mesh.visible = false;
            }
        });

        // --- 3. Component idle animations ---
        meshes.forEach(m => {
            if (m.group.name === "Vacuum Pump System" && m.group.userData.fan) {
                // Spin the pump fan rapidly
                m.group.userData.fan.rotation.z += 0.2 * speed;
                // Slight vibration of the pump body
                m.group.position.x = -4.5 + Math.sin(time * 20 * speed) * 0.02;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

export const create = createElectronMicroscope;
