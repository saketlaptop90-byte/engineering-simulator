import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom glowing materials for visual flair
    const glowPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00bfff,
        emissive: 0x00bfff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x001133,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: false
    });

    // 1. Satellite Bus (Main Chassis)
    const busGeometry = new THREE.BoxGeometry(2, 2, 2);
    const busMesh = new THREE.Mesh(busGeometry, darkSteel);
    const busOrig = { x: 0, y: 0, z: 0 };
    busMesh.position.set(busOrig.x, busOrig.y, busOrig.z);
    busMesh.name = "satellite_bus";
    group.add(busMesh);
    
    parts.push({
        name: "Satellite Bus",
        description: "The main chassis housing power distribution, attitude control, and structural support.",
        material: "Dark Steel",
        function: "Provides structural integrity and houses essential spacecraft subsystems.",
        assemblyOrder: 1,
        connections: ["solar_panels", "data_processor", "radiator_fins"],
        failureEffect: "Loss of structural integrity, potential mission failure due to subsystem exposure.",
        cascadeFailures: ["attitude_control", "thermal_management"],
        originalPosition: busOrig,
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: busMesh
    });

    // 2. Data Processing Unit
    const dpuGeometry = new THREE.BoxGeometry(1.6, 0.8, 1.6);
    const dpuMesh = new THREE.Mesh(dpuGeometry, copper);
    const dpuOrig = { x: 0, y: 1.4, z: 0 };
    dpuMesh.position.set(dpuOrig.x, dpuOrig.y, dpuOrig.z);
    dpuMesh.name = "data_processor";
    group.add(dpuMesh);

    parts.push({
        name: "Data Processing Unit (DPU)",
        description: "Advanced computing module for digitizing signals and filtering cosmic ray noise.",
        material: "Copper/Silicon",
        function: "Processes signals from the PMT array and runs anti-coincidence logic.",
        assemblyOrder: 2,
        connections: ["satellite_bus", "pmt_array", "telemetry_antenna"],
        failureEffect: "Inability to process or store gamma ray detection events.",
        cascadeFailures: ["telemetry_transmission"],
        originalPosition: dpuOrig,
        explodedPosition: { x: 0, y: 3, z: -3 },
        mesh: dpuMesh
    });

    // 3. Photomultiplier Tube (PMT) Array
    const pmtGroup = new THREE.Group();
    for (let i = -0.5; i <= 0.5; i += 0.5) {
        for (let j = -0.5; j <= 0.5; j += 0.5) {
            const pmtGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
            const pmtItem = new THREE.Mesh(pmtGeo, chrome);
            pmtItem.position.set(i, 0, j);
            pmtGroup.add(pmtItem);
        }
    }
    const pmtOrig = { x: 0, y: 2.1, z: 0 };
    pmtGroup.position.set(pmtOrig.x, pmtOrig.y, pmtOrig.z);
    pmtGroup.name = "pmt_array";
    group.add(pmtGroup);

    parts.push({
        name: "Photomultiplier Tube Array",
        description: "An array of highly sensitive vacuum tubes that convert weak light flashes into electrical signals.",
        material: "Chrome/Glass",
        function: "Detects scintillation light and amplifies the signal via a dynode chain.",
        assemblyOrder: 3,
        connections: ["data_processor", "scintillator_crystal"],
        failureEffect: "Loss of sensitivity or complete failure to detect scintillation flashes.",
        cascadeFailures: ["data_processor_input"],
        originalPosition: pmtOrig,
        explodedPosition: { x: -3, y: 4, z: 0 },
        mesh: pmtGroup
    });

    // 4. Scintillator Crystal (Glowing Core)
    const crystalGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32);
    const crystalMesh = new THREE.Mesh(crystalGeo, glowPurple);
    const crystalOrig = { x: 0, y: 3.0, z: 0 };
    crystalMesh.position.set(crystalOrig.x, crystalOrig.y, crystalOrig.z);
    crystalMesh.name = "scintillator_crystal";
    group.add(crystalMesh);

    parts.push({
        name: "BGO Scintillator Crystal",
        description: "A dense Bismuth Germanate crystal that glows (scintillates) when struck by high-energy gamma rays.",
        material: "BGO / Glowing Purple",
        function: "Converts incident gamma rays into visible/UV light photons for the PMTs to detect.",
        assemblyOrder: 4,
        connections: ["pmt_array", "veto_shield"],
        failureEffect: "Inability to stop gamma rays or generate light photons, completely blinding the detector.",
        cascadeFailures: ["pmt_array_idle"],
        originalPosition: crystalOrig,
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: crystalMesh
    });

    // 5. Anti-Coincidence Veto Shield
    const shieldGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.6, 32, 1, true);
    const shieldCapGeo = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    
    const shieldCyl = new THREE.Mesh(shieldGeo, shieldMaterial);
    const shieldCap = new THREE.Mesh(shieldCapGeo, shieldMaterial);
    shieldCap.position.y = 0.8;
    
    const vetoGroup = new THREE.Group();
    vetoGroup.add(shieldCyl);
    vetoGroup.add(shieldCap);
    
    const vetoOrig = { x: 0, y: 3.0, z: 0 };
    vetoGroup.position.set(vetoOrig.x, vetoOrig.y, vetoOrig.z);
    vetoGroup.name = "veto_shield";
    group.add(vetoGroup);

    parts.push({
        name: "Anti-Coincidence Veto Shield",
        description: "A thin plastic scintillator dome surrounding the main crystal.",
        material: "Plastic Scintillator / Semi-transparent",
        function: "Detects charged cosmic rays (which trigger both the shield and the main crystal) to reject false gamma-ray signals.",
        assemblyOrder: 5,
        connections: ["scintillator_crystal", "data_processor"],
        failureEffect: "Massive increase in background noise from cosmic rays, masking true gamma-ray signals.",
        cascadeFailures: ["data_processor_overload"],
        originalPosition: vetoOrig,
        explodedPosition: { x: 0, y: 8, z: 0 },
        mesh: vetoGroup
    });

    // 6. Solar Panels
    const panelGroup = new THREE.Group();
    
    const leftPanelGeo = new THREE.BoxGeometry(4, 0.1, 1.5);
    const leftPanel = new THREE.Mesh(leftPanelGeo, panelMaterial);
    leftPanel.position.set(-3, 0, 0);
    
    const rightPanelGeo = new THREE.BoxGeometry(4, 0.1, 1.5);
    const rightPanel = new THREE.Mesh(rightPanelGeo, panelMaterial);
    rightPanel.position.set(3, 0, 0);
    
    panelGroup.add(leftPanel);
    panelGroup.add(rightPanel);
    
    const panelsOrig = { x: 0, y: 0, z: 0 };
    panelGroup.position.set(panelsOrig.x, panelsOrig.y, panelsOrig.z);
    panelGroup.name = "solar_panels";
    group.add(panelGroup);

    parts.push({
        name: "Solar Array",
        description: "High-efficiency photovoltaic panels for power generation in orbit.",
        material: "Silicon/Glass",
        function: "Provides electrical power to the detector, PMTs, DPU, and telemetry systems.",
        assemblyOrder: 6,
        connections: ["satellite_bus"],
        failureEffect: "Total loss of power, leading to immediate mission failure.",
        cascadeFailures: ["all_subsystems"],
        originalPosition: panelsOrig,
        explodedPosition: { x: 0, y: -4, z: 4 },
        mesh: panelGroup
    });

    // 7. Telemetry Antenna
    const dishGeo = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMesh = new THREE.Mesh(dishGeo, aluminum);
    dishMesh.rotation.x = Math.PI; // point downwards
    const dishOrig = { x: 0, y: -1.0, z: 0 };
    dishMesh.position.set(dishOrig.x, dishOrig.y, dishOrig.z);
    dishMesh.name = "telemetry_antenna";
    group.add(dishMesh);

    parts.push({
        name: "High-Gain Telemetry Antenna",
        description: "A parabolic dish antenna used for communicating with ground stations.",
        material: "Aluminum",
        function: "Transmits collected gamma-ray event data back to Earth and receives command uplinks.",
        assemblyOrder: 7,
        connections: ["data_processor", "satellite_bus"],
        failureEffect: "Inability to transmit science data or receive attitude correction commands.",
        cascadeFailures: ["data_buffer_overflow"],
        originalPosition: dishOrig,
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: dishMesh
    });

    const description = "A high-tech Space-based Gamma Ray Detector designed to capture high-energy photons from deep space phenomena like pulsars, black holes, and gamma-ray bursts. It uses a BGO Scintillator Crystal protected by an Anti-Coincidence Veto Shield to distinguish true gamma rays from background cosmic ray noise.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Anti-Coincidence Veto Shield?",
            options: [
                "To focus gamma rays into the crystal",
                "To reject false signals caused by charged cosmic rays",
                "To protect the detector from micrometeoroids",
                "To generate power for the photomultiplier tubes"
            ],
            correct: 1,
            explanation: "Charged cosmic rays trigger both the veto shield and the main crystal simultaneously. By rejecting these 'coincident' events, the detector isolates true, uncharged gamma rays that only interact with the main crystal.",
            difficulty: "Medium"
        },
        {
            question: "How does the BGO Scintillator Crystal detect gamma rays?",
            options: [
                "By measuring the magnetic field of the photon",
                "By converting the gamma ray's energy into flashes of visible or UV light",
                "By capturing the gamma ray in a microscopic black hole",
                "By acting as a semiconductor diode directly producing electrical current"
            ],
            correct: 1,
            explanation: "A scintillator works by absorbing high-energy radiation (like gamma rays) and re-emitting that energy as lower-energy photons (visible/UV light), which are then detected by the PMTs.",
            difficulty: "Medium"
        },
        {
            question: "Why does the detector require an array of Photomultiplier Tubes (PMTs)?",
            options: [
                "To magnify the faint light flashes produced by the crystal into a measurable electrical signal",
                "To align the satellite with distant stars",
                "To cool the data processing unit",
                "To transmit data back to Earth"
            ],
            correct: 0,
            explanation: "The light flashes produced in the scintillator crystal are extremely faint. PMTs amplify these single photons via a dynode chain into a macroscopic electrical pulse that the DPU can analyze.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate solar panels slowly to track the "sun"
        const panels = meshes.find(m => m.name === "solar_panels");
        if (panels) {
            panels.rotation.y = time * speed * 0.1;
        }

        // Make the scintillator crystal pulse to simulate detecting gamma rays
        const crystal = meshes.find(m => m.name === "scintillator_crystal");
        if (crystal) {
            // Pulse emissive intensity between 0.4 and 1.2 unpredictably
            const pulse = (Math.sin(time * speed * 5) + Math.sin(time * speed * 12.3)) * 0.5; 
            crystal.material.emissiveIntensity = 0.8 + pulse * 0.4;
        }

        // Slowly rotate the telemetry antenna to simulate tracking ground stations
        const antenna = meshes.find(m => m.name === "telemetry_antenna");
        if (antenna) {
            antenna.rotation.z = Math.sin(time * speed * 0.5) * 0.2;
            antenna.rotation.x = Math.PI + Math.cos(time * speed * 0.3) * 0.1;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGammaRayDetector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
