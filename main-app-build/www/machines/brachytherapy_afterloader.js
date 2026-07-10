import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for High-Tech Visual Flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xff1111,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const radioactiveGlow = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x33ff33,
        emissiveIntensity: 6.0,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const tungstenShield = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.95,
        roughness: 0.5
    });

    const displayScreen = new THREE.MeshStandardMaterial({
        color: 0x001133,
        emissive: 0x002266,
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.8
    });

    // 1. Base Housing / Chassis
    const chassisGeo = new THREE.BoxGeometry(3, 4, 3);
    const chassis = new THREE.Mesh(chassisGeo, plastic);
    chassis.position.set(0, 2, 0);
    group.add(chassis);
    
    // Aesthetic lines/panels to chassis
    const panelGeo = new THREE.BoxGeometry(3.1, 1, 3.1);
    const panel = new THREE.Mesh(panelGeo, darkSteel);
    panel.position.set(0, 0, 0);
    chassis.add(panel);

    parts.push({
        name: "Main Chassis",
        description: "The primary housing of the High Dose Rate (HDR) Brachytherapy Afterloader. Contains shielding and control systems.",
        material: "High-density Medical Plastic & Steel Frame",
        function: "Encloses and protects the internal mechanics, providing a sterile and robust exterior.",
        assemblyOrder: 1,
        connections: ["Tungsten Safe", "Control Interface", "Drive Mechanism"],
        failureEffect: "Loss of environmental protection; exposure of internal components.",
        cascadeFailures: ["Dust/debris contamination of drive mechanisms"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 },
        mesh: chassis
    });

    // 2. Tungsten Safe (Source Container)
    const safeGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const safe = new THREE.Mesh(safeGeo, tungstenShield);
    safe.position.set(0, 1.5, 0);
    chassis.add(safe);
    
    const radiationSymbolGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const radSymbol = new THREE.Mesh(radiationSymbolGeo, neonRed);
    radSymbol.position.set(0, 0, 0.85);
    safe.add(radSymbol);

    parts.push({
        name: "Tungsten Shielded Safe",
        description: "A highly shielded vault made of depleted uranium or tungsten, storing the radioactive isotope (e.g., Ir-192) when not in use.",
        material: "Tungsten / Depleted Uranium",
        function: "Prevents radiation leakage and protects staff and patients during standby.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Drive Mechanism"],
        failureEffect: "Severe radiation leakage in the treatment room.",
        cascadeFailures: ["Facility lockdown", "Immediate danger to life and health (IDLH)"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: -5, y: 5, z: -5 },
        mesh: safe
    });

    // 3. Drive Mechanism (Stepper Motor)
    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
    motorGeo.rotateZ(Math.PI / 2);
    const motor = new THREE.Mesh(motorGeo, darkSteel);
    motor.position.set(0, 3, -0.5);
    chassis.add(motor);
    
    const gearGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16);
    gearGeo.rotateZ(Math.PI / 2);
    const gear = new THREE.Mesh(gearGeo, chrome);
    gear.position.set(0.7, 0, 0);
    motor.add(gear);

    parts.push({
        name: "Precision Stepper Motor Drive",
        description: "Controls the exact positioning of the source wire inside the catheter. Must be accurate to within a millimeter.",
        material: "Steel / Copper Coils",
        function: "Extends and retracts the radioactive source according to the computerized treatment plan.",
        assemblyOrder: 3,
        connections: ["Tungsten Safe", "Source Wire", "Control System"],
        failureEffect: "Source gets stuck in the patient (Emergency Retraction required).",
        cascadeFailures: ["Radiation overdose to non-target tissues"],
        originalPosition: { x: 0, y: 3, z: -0.5 },
        explodedPosition: { x: 5, y: 8, z: -2 },
        mesh: motor
    });

    // 4. Indexer / Channel Selector
    const indexerGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16);
    indexerGeo.rotateX(Math.PI / 2);
    const indexer = new THREE.Mesh(indexerGeo, chrome);
    indexer.position.set(0, 3, 1.5);
    chassis.add(indexer);
    
    // Indexer ports
    for(let i=0; i<6; i++) {
        const portGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        portGeo.rotateX(Math.PI / 2);
        const port = new THREE.Mesh(portGeo, steel);
        const angle = (i / 6) * Math.PI * 2;
        port.position.set(Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0.2);
        indexer.add(port);
    }

    parts.push({
        name: "Channel Indexer",
        description: "A rotary mechanism that directs the source wire into one of many possible transfer tubes.",
        material: "Chrome / Steel",
        function: "Allows a single radiation source to sequentially treat multiple target areas (channels) in the patient.",
        assemblyOrder: 4,
        connections: ["Drive Mechanism", "Transfer Tubes"],
        failureEffect: "Source sent into wrong catheter, treating wrong anatomical area.",
        cascadeFailures: ["Incorrect dosimetry", "Catheter puncture"],
        originalPosition: { x: 0, y: 3, z: 1.5 },
        explodedPosition: { x: 0, y: 6, z: 5 },
        mesh: indexer
    });

    // 5. Transfer Tubes (Visualized as splines/tubes)
    const tubePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, 1.7), // Starts at indexer
        new THREE.Vector3(0, 5, 3),
        new THREE.Vector3(2, 4, 5),
        new THREE.Vector3(3, 2, 7)
    ]);
    const tubeGeo1 = new THREE.TubeGeometry(tubePath1, 30, 0.08, 8, false);
    
    // Transparent tube material to see the glowing wire inside
    const transparentTubeMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.3,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const tube1 = new THREE.Mesh(tubeGeo1, transparentTubeMat);
    group.add(tube1);
    
    parts.push({
        name: "Transfer Tubes & Catheters",
        description: "Flexible tubes connecting the afterloader to the applicators inserted into the patient.",
        material: "Medical Grade Teflon / Silicone",
        function: "Provides a safe, unobstructed pathway for the source wire to travel from the safe to the tumor site.",
        assemblyOrder: 5,
        connections: ["Channel Indexer", "Patient Applicator"],
        failureEffect: "Kinking or blockage prevents source from reaching destination.",
        cascadeFailures: ["Source wire damage", "Emergency interruption of treatment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 8 },
        mesh: tube1
    });

    // 6. Source Wire (Dummy & Active)
    const wireLength = 0.5;
    const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, wireLength, 8);
    const wire = new THREE.Mesh(wireGeo, steel);
    wire.position.set(0, 5, 1.7);
    wire.rotation.x = Math.PI / 2;
    group.add(wire);
    
    // Radioactive Seed at the tip
    const seedGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const seed = new THREE.Mesh(seedGeo, radioactiveGlow);
    seed.position.set(0, wireLength/2, 0); // At the end of the wire
    wire.add(seed);
    
    // Inner Glow PointLight to actually cast light on the tube
    const seedLight = new THREE.PointLight(0x33ff33, 2, 2);
    seed.add(seedLight);
    
    parts.push({
        name: "Source Wire & Iridium-192 Seed",
        description: "A highly flexible steel cable with a tiny pellet of radioactive Ir-192 laser-welded to the tip.",
        material: "Steel Cable / Ir-192 Isotope",
        function: "Delivers the prescribed radiation dose exactly where needed inside the patient.",
        assemblyOrder: 6,
        connections: ["Drive Mechanism", "Transfer Tubes"],
        failureEffect: "Source detachment; active isotope left inside patient.",
        cascadeFailures: ["Catastrophic radiation accident requiring immediate surgical intervention"],
        originalPosition: { x: 0, y: 5, z: 1.7 },
        explodedPosition: { x: -2, y: 7, z: 3 },
        mesh: wire
    });

    // 7. Control Console / Display
    const displayGeo = new THREE.BoxGeometry(2, 1.2, 0.2);
    const display = new THREE.Mesh(displayGeo, displayScreen);
    display.position.set(0, 4.2, 1.2);
    display.rotation.x = -Math.PI / 6;
    chassis.add(display);
    
    // Display trim/glow
    const displayTrimGeo = new THREE.BoxGeometry(2.1, 1.3, 0.1);
    const displayTrim = new THREE.Mesh(displayTrimGeo, neonBlue);
    displayTrim.position.set(0, 4.2, 1.15);
    displayTrim.rotation.x = -Math.PI / 6;
    chassis.add(displayTrim);

    parts.push({
        name: "Control & Monitoring Display",
        description: "Shows real-time telemetry: source position, dwell times, channel selection, and safety interlock status.",
        material: "Glass / Electronics",
        function: "Provides operators with critical feedback during the automated treatment execution.",
        assemblyOrder: 7,
        connections: ["Main Chassis", "Drive Mechanism"],
        failureEffect: "Loss of telemetry; blind operation.",
        cascadeFailures: ["Treatment paused", "Manual emergency retract required"],
        originalPosition: { x: 0, y: 4.2, z: 1.2 },
        explodedPosition: { x: 0, y: 6, z: 3 },
        mesh: display
    });

    const description = "A High Dose Rate (HDR) Brachytherapy Afterloader is a robotic medical device that delivers internal radiation therapy. It precisely drives a tiny radioactive source (usually Iridium-192) through a catheter directly into or near a tumor, delivering a high dose of radiation in a short time while sparing surrounding healthy tissue. It features extreme safety mechanisms, including heavy tungsten shielding and emergency retraction systems.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Tungsten Safe in the afterloader?",
            options: [
                "To generate the radioactive isotope",
                "To cool the stepper motors",
                "To shield the radioactive source when not in use",
                "To sterilize the catheters"
            ],
            correct: 2,
            explanation: "Tungsten is highly dense and provides excellent shielding against gamma radiation, protecting staff and patients from the Ir-192 source during standby.",
            difficulty: "Easy"
        },
        {
            question: "Why is the drive mechanism heavily reliant on precision stepper motors?",
            options: [
                "To ensure the source wire travels fast enough to break the sound barrier",
                "Because radiation dosage depends critically on the source's exact position (dwell position) and dwell time",
                "To generate enough heat to sterilize the tube",
                "Stepper motors are the only type immune to radiation"
            ],
            correct: 1,
            explanation: "In HDR brachytherapy, the source stops at specific 'dwell positions' for calculated 'dwell times'. A positional error of even 1 millimeter can severely alter the dose delivered to the tumor versus healthy tissue.",
            difficulty: "Medium"
        },
        {
            question: "What is the consequence of a 'Channel Indexer' failure?",
            options: [
                "The machine will overheat instantly",
                "The source may be driven into the wrong catheter, irradiating the wrong part of the body",
                "The radioactive isotope will decay faster",
                "The display screen will turn green"
            ],
            correct: 1,
            explanation: "The indexer aligns the source wire with the correct transfer tube. If it fails, the source could enter an unintended catheter, causing a severe misadministration of radiation.",
            difficulty: "Hard"
        }
    ];

    // Animation function
    function animate(time, speed, meshes) {
        // Rotate channel indexer
        indexer.rotation.z = time * speed * 0.2;

        // Drive wire animation (moving back and forth along the tube path)
        const cycle = (time * speed * 0.15) % 1;
        
        let pathT = 0;
        if (cycle < 0.3) {
            // Deploying
            pathT = cycle / 0.3;
            seedLight.intensity = 2;
        } else if (cycle < 0.7) {
            // Dwell (jitter slightly to simulate source activity)
            pathT = 1.0;
            seed.material.emissiveIntensity = 8.0 + Math.sin(time * 30) * 4;
            seedLight.intensity = 5.0 + Math.sin(time * 30) * 2;
        } else {
            // Retracting
            pathT = 1.0 - ((cycle - 0.7) / 0.3);
            seed.material.emissiveIntensity = 6.0;
            seedLight.intensity = 2;
        }

        // Safeguard to prevent pathT out of bounds
        pathT = Math.max(0, Math.min(1, pathT));

        // Get position on tube
        const pos = tubePath1.getPointAt(pathT);
        const tangent = tubePath1.getTangentAt(pathT);

        wire.position.copy(pos);
        
        // Orient wire along tangent
        const lookTarget = pos.clone().add(tangent);
        wire.lookAt(lookTarget);
        wire.rotateX(Math.PI / 2); // Adjust for cylinder orientation
        
        // Blink display and rad symbol
        display.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 3) * 0.2;
        radSymbol.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 2) * 1.5;
        
        // Gear rotation
        gear.rotation.y = time * speed * 2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBrachytherapyAfterloader() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
