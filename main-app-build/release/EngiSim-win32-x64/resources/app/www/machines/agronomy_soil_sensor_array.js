import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const meshes = {};
    const parts = [];

    // Materials - add some custom ones
    const emissiveNeon = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const lcdScreenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x0055ff,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1
    });

    const solarCellMat = new THREE.MeshStandardMaterial({
        color: 0x0a1128,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false
    });

    const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x004d00,
        metalness: 0.4,
        roughness: 0.6
    });

    // 1. Main Enclosure (Weatherproof Dome/Cylinder)
    const enclosurePoints = [];
    for ( let i = 0; i <= 20; i ++ ) {
        const t = i / 20;
        enclosurePoints.push( new THREE.Vector2( Math.sin( t * Math.PI * 0.5 ) * 2 + 1, (t * 4) - 2 ) );
    }
    const enclosureGeom = new THREE.LatheGeometry( enclosurePoints, 64 );
    const enclosure = new THREE.Mesh( enclosureGeom, plastic );
    enclosure.position.set(0, 4, 0);
    group.add(enclosure);
    meshes.enclosure = enclosure;
    
    parts.push({
        name: "Main Weatherproof Enclosure",
        description: "Aerodynamic, UV-resistant housing protecting the core electronics and telemetry units from harsh agricultural environments.",
        material: "Advanced Polymer",
        function: "Environmental protection",
        assemblyOrder: 1,
        connections: ["Base Plate", "LCD Display", "Circuit Board"],
        failureEffect: "Internal components exposed to moisture",
        cascadeFailures: ["Circuit Board", "Battery Pack"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 2. Base Plate
    const baseGeom = new THREE.CylinderGeometry( 3.2, 3.5, 0.5, 64 );
    const basePlate = new THREE.Mesh( baseGeom, darkSteel );
    basePlate.position.set(0, 1.75, 0);
    group.add(basePlate);
    meshes.basePlate = basePlate;

    parts.push({
        name: "Titanium Base Plate",
        description: "Heavy-duty foundation for the sensor array, providing stability and grounding.",
        material: "Titanium Alloy",
        function: "Structural support",
        assemblyOrder: 2,
        connections: ["Main Weatherproof Enclosure", "Ground Spikes"],
        failureEffect: "Structural instability",
        cascadeFailures: ["Ground Spikes"],
        originalPosition: {x: 0, y: 1.75, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    // 3. Ground Spikes
    const spikesGroup = new THREE.Group();
    const spikeGeom = new THREE.CylinderGeometry( 0.2, 0.01, 5, 32 );
    const spikeMat = steel;
    
    const numSpikes = 4;
    const spikeMeshes = [];
    for(let i=0; i<numSpikes; i++) {
        const angle = (i / numSpikes) * Math.PI * 2;
        const spike = new THREE.Mesh(spikeGeom, spikeMat);
        spike.position.set(Math.cos(angle) * 2, -1, Math.sin(angle) * 2);
        
        // Sensor Rings on Spikes
        const ringGeom = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
        for(let j=0; j<3; j++) {
            const ring = new THREE.Mesh(ringGeom, copper);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -1 + j * -1.2;
            spike.add(ring);
        }
        spikesGroup.add(spike);
        spikeMeshes.push(spike);
    }
    group.add(spikesGroup);
    meshes.spikes = spikeMeshes;
    
    parts.push({
        name: "Multi-depth Soil Sensor Spikes",
        description: "Deep penetration probes equipped with equidistant copper rings to measure soil moisture, temperature, and electro-conductivity at various depths.",
        material: "Stainless Steel & Copper",
        function: "Data collection",
        assemblyOrder: 3,
        connections: ["Base Plate", "Internal Wiring"],
        failureEffect: "Inaccurate soil readings",
        cascadeFailures: ["Telemetry Data Stream"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 4. Solar Panel Actuator / Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 6, 0);
    
    const armBaseGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const armBase = new THREE.Mesh(armBaseGeom, chrome);
    armBase.rotation.x = Math.PI/2;
    armGroup.add(armBase);
    
    const armExtGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const armExt = new THREE.Mesh(armExtGeom, darkSteel);
    armExt.position.set(0, 1.5, 0);
    armGroup.add(armExt);
    
    group.add(armGroup);
    meshes.solarArm = armGroup;

    parts.push({
        name: "Solar Tracking Arm",
        description: "Motorized dual-axis arm that dynamically adjusts the solar array's pitch and yaw to maximize solar irradiance.",
        material: "Carbon Fiber & Chrome",
        function: "Energy optimization",
        assemblyOrder: 4,
        connections: ["Main Weatherproof Enclosure", "Solar Array"],
        failureEffect: "Reduced power generation",
        cascadeFailures: ["Battery Pack", "Telemetry Unit"],
        originalPosition: {x: 0, y: 6, z: 0},
        explodedPosition: {x: 5, y: 12, z: 0}
    });

    // 5. Solar Panel Array
    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 3, 0); // relative to armExt tip
    armExt.add(panelGroup);
    
    const panelBackGeom = new THREE.BoxGeometry(4, 0.1, 3);
    const panelBack = new THREE.Mesh(panelBackGeom, aluminum);
    panelGroup.add(panelBack);
    
    // Detailed Solar Cells
    const cellGeom = new THREE.BoxGeometry(0.45, 0.05, 0.45);
    for(let x=0; x<8; x++) {
        for(let z=0; z<6; z++) {
            const cell = new THREE.Mesh(cellGeom, solarCellMat);
            cell.position.set(-1.75 + x * 0.5, 0.05, -1.25 + z * 0.5);
            panelGroup.add(cell);
        }
    }
    meshes.solarPanel = panelGroup;

    parts.push({
        name: "High-Efficiency Photovoltaic Array",
        description: "Monocrystalline silicon solar cells arrayed for maximum efficiency, powering the entire sensor system and charging the internal battery.",
        material: "Monocrystalline Silicon & Aluminum",
        function: "Power generation",
        assemblyOrder: 5,
        connections: ["Solar Tracking Arm", "Charge Controller"],
        failureEffect: "System power loss during extended overcast periods",
        cascadeFailures: ["Telemetry Unit", "Sensor Network"],
        originalPosition: {x: 0, y: 9, z: 0},
        explodedPosition: {x: 0, y: 18, z: 0}
    });

    // 6. Telemetry Antenna
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(1.5, 5, 1.5);
    
    const antennaBaseGeom = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 32);
    const antennaBase = new THREE.Mesh(antennaBaseGeom, chrome);
    antennaGroup.add(antennaBase);
    
    const mastGeom = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const mast = new THREE.Mesh(mastGeom, aluminum);
    mast.position.y = 2;
    antennaGroup.add(mast);
    
    // Helical coil around mast
    class HelicalCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const a = 0.2; // radius
            const b = 20;  // turns
            const h = 3.5; // height
            const angle = Math.PI * 2 * b * t;
            const x = Math.cos(angle) * a;
            const z = Math.sin(angle) * a;
            const y = t * h;
            return optionalTarget.set(x, y, z);
        }
    }
    const coilPath = new HelicalCurve();
    const coilGeom = new THREE.TubeGeometry(coilPath, 200, 0.02, 8, false);
    const coil = new THREE.Mesh(coilGeom, copper);
    coil.position.y = 0.5;
    antennaGroup.add(coil);
    
    group.add(antennaGroup);
    meshes.antenna = antennaGroup;

    parts.push({
        name: "Long-Range Telemetry Antenna",
        description: "High-gain helical antenna for transmitting dense telemetry packets over LoRaWAN or 5G directly to the agricultural control center.",
        material: "Copper & Aluminum",
        function: "Data transmission",
        assemblyOrder: 6,
        connections: ["Main Weatherproof Enclosure", "Transceiver Module"],
        failureEffect: "Loss of remote data access",
        cascadeFailures: [],
        originalPosition: {x: 1.5, y: 5, z: 1.5},
        explodedPosition: {x: 8, y: 15, z: 8}
    });

    // 7. Internal Circuit Board (PCB)
    const pcbGroup = new THREE.Group();
    pcbGroup.position.set(0, 3.5, 0);
    
    const pcbBaseGeom = new THREE.CylinderGeometry(2, 2, 0.1, 64);
    const pcbBase = new THREE.Mesh(pcbBaseGeom, pcbMat);
    pcbGroup.add(pcbBase);
    
    // PCB Components
    const chipGeom = new THREE.BoxGeometry(0.5, 0.2, 0.5);
    const chip = new THREE.Mesh(chipGeom, darkSteel);
    chip.position.set(0, 0.1, 0);
    pcbGroup.add(chip);
    
    const capGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
    for(let i=0; i<5; i++) {
        const cap = new THREE.Mesh(capGeom, aluminum);
        cap.position.set(Math.cos(i) * 1, 0.15, Math.sin(i) * 1);
        pcbGroup.add(cap);
    }
    
    const connectorGeom = new THREE.BoxGeometry(0.2, 0.3, 0.8);
    const connector = new THREE.Mesh(connectorGeom, plastic);
    connector.position.set(1.5, 0.15, 0);
    pcbGroup.add(connector);
    
    group.add(pcbGroup);
    meshes.pcb = pcbGroup;

    parts.push({
        name: "Core Processing PCB",
        description: "High-density multi-layer printed circuit board hosting the MCU, ADC, and environmental processing algorithms.",
        material: "FR4 & Silicon",
        function: "Data processing",
        assemblyOrder: 7,
        connections: ["Sensor Wiring", "Telemetry Module", "LCD Display"],
        failureEffect: "Complete system halt",
        cascadeFailures: ["All Subsystems"],
        originalPosition: {x: 0, y: 3.5, z: 0},
        explodedPosition: {x: 0, y: 6, z: -10}
    });

    // 8. LCD Display Panel
    const displayGroup = new THREE.Group();
    displayGroup.position.set(0, 4.5, 2.8); // On the surface of the enclosure
    displayGroup.rotation.x = -0.2;
    
    const frameGeom = new THREE.BoxGeometry(2.2, 1.2, 0.1);
    const frame = new THREE.Mesh(frameGeom, plastic);
    displayGroup.add(frame);
    
    const screenGeom = new THREE.BoxGeometry(2.0, 1.0, 0.12);
    const screen = new THREE.Mesh(screenGeom, lcdScreenMat);
    displayGroup.add(screen);
    
    group.add(displayGroup);
    meshes.display = displayGroup;

    parts.push({
        name: "Diagnostic OLED Display",
        description: "High-contrast ruggedized display providing direct readouts of soil pH, temperature, moisture, and system health.",
        material: "Gorilla Glass & OLED",
        function: "Local diagnostics",
        assemblyOrder: 8,
        connections: ["Core Processing PCB"],
        failureEffect: "Inability to read local diagnostic data",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 4.5, z: 2.8},
        explodedPosition: {x: 0, y: 4.5, z: 8}
    });

    // 9. Battery Pack
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 2.5, 0);
    
    const batRadius = 0.3;
    const batHeight = 1.5;
    const cellGeo = new THREE.CylinderGeometry(batRadius, batRadius, batHeight, 32);
    const cellMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.6});
    
    for(let x=0; x<3; x++) {
        for(let z=0; z<3; z++) {
            const batCell = new THREE.Mesh(cellGeo, cellMat);
            batCell.position.set(-0.7 + x*0.7, 0, -0.7 + z*0.7);
            batteryGroup.add(batCell);
        }
    }
    const strapGeom = new THREE.BoxGeometry(2.5, 0.1, 2.5);
    const strap = new THREE.Mesh(strapGeom, rubber);
    strap.position.y = 0;
    batteryGroup.add(strap);
    
    group.add(batteryGroup);
    meshes.battery = batteryGroup;

    parts.push({
        name: "Li-Ion Battery Array",
        description: "Dense 9-cell array storing solar energy for 24/7 continuous sensor operation and nocturnal telemetry.",
        material: "Lithium-Ion & Rubber",
        function: "Energy storage",
        assemblyOrder: 9,
        connections: ["Core Processing PCB", "Charge Controller"],
        failureEffect: "System goes offline at night",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.5, z: 0},
        explodedPosition: {x: -8, y: 2.5, z: 0}
    });

    // 10. Wiring Harness (Tubes)
    const wiringGroup = new THREE.Group();
    const numWires = 6;
    for(let i=0; i<numWires; i++) {
        class WireCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = Math.cos(t * Math.PI) * 1.5;
                const y = t * 2.5 + 1.5;
                const z = Math.sin(t * Math.PI) * 1.5;
                return optionalTarget.set(x, y, z);
            }
        }
        const wirePath = new WireCurve();
        const wireGeom = new THREE.TubeGeometry(wirePath, 20, 0.05, 8, false);
        const wireMat = new THREE.MeshStandardMaterial({color: i%2===0 ? 0xff0000 : 0x0000ff});
        const wire = new THREE.Mesh(wireGeom, wireMat);
        wire.rotation.y = (i/numWires) * Math.PI * 2;
        wiringGroup.add(wire);
    }
    group.add(wiringGroup);
    meshes.wiring = wiringGroup;

    parts.push({
        name: "Power and Data Wiring Harness",
        description: "Heavily shielded cables resistant to rodents and corrosive chemicals, connecting the sensory payload to the PCB.",
        material: "Silicone & Copper",
        function: "Power/Data routing",
        assemblyOrder: 10,
        connections: ["Sensor Spikes", "Core Processing PCB"],
        failureEffect: "Sensor data corruption",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 5}
    });

    // 11. Anemometer (Weather Vane)
    const anemGroup = new THREE.Group();
    anemGroup.position.set(-1.5, 5, -1.5);
    
    const anemMastGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const anemMast = new THREE.Mesh(anemMastGeo, aluminum);
    anemGroup.add(anemMast);
    
    const spinnerGroup = new THREE.Group();
    spinnerGroup.position.y = 0.75;
    
    const crossHairGeo = new THREE.BoxGeometry(2, 0.05, 0.05);
    const crossHair1 = new THREE.Mesh(crossHairGeo, darkSteel);
    const crossHair2 = new THREE.Mesh(crossHairGeo, darkSteel);
    crossHair2.rotation.y = Math.PI/2;
    spinnerGroup.add(crossHair1, crossHair2);
    
    const cupGeo = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI);
    for(let i=0; i<4; i++) {
        const cup = new THREE.Mesh(cupGeo, plastic);
        const angle = (i/4) * Math.PI * 2;
        cup.position.set(Math.cos(angle)*1, 0, Math.sin(angle)*1);
        cup.rotation.y = angle + Math.PI/2;
        spinnerGroup.add(cup);
    }
    anemGroup.add(spinnerGroup);
    group.add(anemGroup);
    meshes.anemometer = spinnerGroup;

    parts.push({
        name: "Micro-Anemometer",
        description: "Low-friction precision wind speed sensor providing micro-climate data immediately above the soil surface.",
        material: "ABS Plastic & Aluminum",
        function: "Wind speed measurement",
        assemblyOrder: 11,
        connections: ["Main Weatherproof Enclosure"],
        failureEffect: "Lack of micro-climate wind data",
        cascadeFailures: [],
        originalPosition: {x: -1.5, y: 5, z: -1.5},
        explodedPosition: {x: -8, y: 10, z: -8}
    });

    // 12. Humidity / Temp Grill
    const grillGroup = new THREE.Group();
    grillGroup.position.set(0, 3, -2.5);
    const grillGeo = new THREE.BoxGeometry(1.5, 1.5, 0.5);
    const grill = new THREE.Mesh(grillGeo, plastic);
    grillGroup.add(grill);
    
    for(let i=0; i<5; i++) {
        const slatGeo = new THREE.BoxGeometry(1.3, 0.1, 0.6);
        const slat = new THREE.Mesh(slatGeo, plastic);
        slat.position.y = -0.5 + (i * 0.25);
        slat.rotation.x = -0.2;
        grillGroup.add(slat);
    }
    group.add(grillGroup);

    parts.push({
        name: "Stevenson Screen Louvers",
        description: "Passive ventilation fins designed to shield internal temperature and humidity sensors from direct sunlight and precipitation.",
        material: "White ASA Polymer",
        function: "Sensor shielding",
        assemblyOrder: 12,
        connections: ["Main Weatherproof Enclosure"],
        failureEffect: "Artificially high temperature readings",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 3, z: -2.5},
        explodedPosition: {x: 0, y: 3, z: -8}
    });

    // 13. Neon Indicator Ring
    const neonGeo = new THREE.TorusGeometry(3.1, 0.05, 16, 64);
    const neonRing = new THREE.Mesh(neonGeo, emissiveNeon);
    neonRing.rotation.x = Math.PI/2;
    neonRing.position.y = 2.0;
    group.add(neonRing);
    meshes.neonRing = neonRing;

    parts.push({
        name: "Status Indicator Ring",
        description: "360-degree LED halo providing at-a-glance visual system diagnostics for night-time field inspections.",
        material: "Acrylic & RGB LEDs",
        function: "Status indication",
        assemblyOrder: 13,
        connections: ["Base Plate"],
        failureEffect: "Visual diagnosis compromised",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 2.0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 14. Hydraulic/Electric Linear Actuator for spikes
    const actuatorGroup = new THREE.Group();
    actuatorGroup.position.set(0, 0, 0);
    const actOuterGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const actOuter = new THREE.Mesh(actOuterGeo, darkSteel);
    actOuter.position.y = 1;
    actuatorGroup.add(actOuter);
    
    const actInnerGeo = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
    const actInner = new THREE.Mesh(actInnerGeo, chrome);
    actInner.position.y = 0; // Animatable
    actuatorGroup.add(actInner);
    
    group.add(actuatorGroup);
    meshes.actuatorInner = actInner;

    parts.push({
        name: "Insertion Actuator",
        description: "Heavy-duty electric linear actuator designed to slowly drive the sensor spikes deep into compact soil types.",
        material: "Hardened Steel",
        function: "Spike deployment",
        assemblyOrder: 14,
        connections: ["Base Plate", "Ground Spikes"],
        failureEffect: "Spikes fail to penetrate soil adequately",
        cascadeFailures: ["Ground Spikes"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -5, y: -5, z: 0}
    });

    // 15. Control Panel / Buttons
    const buttonsGroup = new THREE.Group();
    buttonsGroup.position.set(1.5, 4.0, 2.5);
    buttonsGroup.rotation.x = -0.1;
    buttonsGroup.rotation.y = 0.5;
    
    const bColors = [0xff0000, 0x00ff00, 0x0000ff];
    for(let i=0; i<3; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
        const btnMat = new THREE.MeshStandardMaterial({
            color: bColors[i],
            emissive: bColors[i],
            emissiveIntensity: 0.5
        });
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.rotation.x = Math.PI/2;
        btn.position.set(i*0.3, 0, 0);
        buttonsGroup.add(btn);
    }
    group.add(buttonsGroup);

    parts.push({
        name: "Manual Override Interface",
        description: "Rugged, tactile buttons allowing agronomists to perform manual calibrations and reboot sequences in the field.",
        material: "Silicone & Metal",
        function: "User input",
        assemblyOrder: 15,
        connections: ["Core Processing PCB"],
        failureEffect: "Inability to manually calibrate",
        cascadeFailures: [],
        originalPosition: {x: 1.5, y: 4.0, z: 2.5},
        explodedPosition: {x: 5, y: 4.0, z: 8}
    });

    const description = "The Agronomy Soil Sensor Array is a hyper-advanced, self-sustaining diagnostic monolith. Plunged deep into the earth, its multi-depth copper ring spikes assess moisture, EC, and temperature, while the top array captures solar energy and micro-climate data. A core processing unit instantly transmits critical crop insights via its high-gain telemetry mast.";

    const quizQuestions = [
        {
            question: "What specific geometry is used in the Long-Range Telemetry Antenna to boost gain?",
            options: ["A parabolic dish", "A helical copper coil", "A fractal array", "A dipole whip"],
            correctAnswer: 1,
            explanation: "The antenna features a distinct helical copper coil that winds around the main mast, vastly improving transmission gain."
        },
        {
            question: "How does the machine compensate for shifting sun angles?",
            options: ["It relies on scattered light", "A motorized dual-axis Solar Tracking Arm", "Multiple fixed panels", "Reflective mirrors"],
            correctAnswer: 1,
            explanation: "The Solar Tracking Arm dynamically adjusts pitch and yaw to keep the Photovoltaic Array optimally aimed at the sun."
        },
        {
            question: "What function do the copper rings on the Ground Spikes serve?",
            options: ["Structural reinforcement", "Measuring soil moisture and electro-conductivity", "Heating the soil", "Grounding lightning strikes"],
            correctAnswer: 1,
            explanation: "The spaced copper rings on the stainless steel spikes act as sensors for moisture, temperature, and EC at multiple soil depths."
        },
        {
            question: "Which component protects the micro-climate sensors from direct sunlight?",
            options: ["The Stevenson Screen Louvers", "The Titanium Base Plate", "The Solar Panel Array", "The Weatherproof Enclosure"],
            correctAnswer: 0,
            explanation: "The Stevenson Screen Louvers (passive ventilation fins) prevent direct solar heating from skewing internal ambient readings."
        },
        {
            question: "What indicates the system's operational status during night-time inspections?",
            options: ["A loud acoustic beep", "The OLED Display automatically waking up", "The Status Indicator Ring (LED halo)", "The Anemometer spinning rapidly"],
            correctAnswer: 2,
            explanation: "The 360-degree Status Indicator Ring glows, providing instant visual diagnostics in low-light field conditions."
        }
    ];

    function animate(time, speed, meshes) {
        // Animate anemometer based on wind (time)
        if(meshes.anemometer) {
            meshes.anemometer.rotation.y = time * 2 * speed;
        }

        // Animate solar arm tracking
        if(meshes.solarArm) {
            meshes.solarArm.rotation.y = Math.sin(time * 0.2 * speed) * 0.5;
            // Solar arm pitch
            if(meshes.solarArm.children.length > 1) {
                meshes.solarArm.children[1].rotation.x = Math.cos(time * 0.1 * speed) * 0.2;
            }
        }
        
        // Pulse neon ring based on data transmission
        if(meshes.neonRing) {
            const intensity = (Math.sin(time * 4 * speed) + 1) / 2;
            meshes.neonRing.material.emissiveIntensity = 0.5 + intensity * 1.5;
            
            // Occasionally change color to simulate different status
            if(Math.sin(time * speed) > 0.95) {
                meshes.neonRing.material.color.setHex(0x00aaff);
                meshes.neonRing.material.emissive.setHex(0x00aaff);
            } else {
                meshes.neonRing.material.color.setHex(0x00ff00);
                meshes.neonRing.material.emissive.setHex(0x00ff00);
            }
        }
        
        // Animate actuator pushing spikes in and out slightly (sampling)
        if(meshes.actuatorInner) {
            meshes.actuatorInner.position.y = Math.sin(time * 0.5 * speed) * 0.5;
        }

        // Animate LCD screen pulsing
        if(meshes.display) {
            const screenMesh = meshes.display.children[1];
            if(screenMesh) {
                screenMesh.material.emissiveIntensity = 0.6 + Math.random() * 0.4;
            }
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createSoilSensorArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
