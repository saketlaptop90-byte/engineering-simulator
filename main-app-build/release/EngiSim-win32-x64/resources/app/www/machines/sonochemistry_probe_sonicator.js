import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Advanced Custom Materials
    const titanium = new THREE.MeshStandardMaterial({
        color: 0x889196,
        metalness: 0.85,
        roughness: 0.25,
        envMapIntensity: 1.5
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0055ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00aa55,
        emissiveIntensity: 2.5
    });

    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xaa0000,
        emissiveIntensity: 1.5
    });

    const cavitationMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const bubbleMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        blending: THREE.NormalBlending,
        depthWrite: false
    });

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaa22ff,
        transparent: true,
        opacity: 0.85,
        transmission: 0.6,
        roughness: 0.1,
        ior: 1.35,
        thickness: 0.5
    });

    const coolantMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.3,
        transmission: 0.95,
        roughness: 0.0,
        ior: 1.33,
        thickness: 0.2
    });

    // 1. Heavy Base with intricate details
    const baseGroup = new THREE.Group();
    
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-4, -3);
    baseShape.lineTo(4, -3);
    baseShape.lineTo(4.5, -1);
    baseShape.lineTo(4.5, 1);
    baseShape.lineTo(4, 3);
    baseShape.lineTo(-4, 3);
    baseShape.lineTo(-4.5, 1);
    baseShape.lineTo(-4.5, -1);
    baseShape.lineTo(-4, -3);
    
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, {
        depth: 0.6,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 2,
        bevelSize: 0.15,
        bevelThickness: 0.15
    });
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.set(0, 0, 0);
    baseGroup.add(baseMesh);

    // Vibration isolating rubber feet
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const footGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 32);
            const foot = new THREE.Mesh(footGeom, rubber);
            foot.position.set(i * 3.5, -0.15, j * 2.5);
            baseGroup.add(foot);
        }
    }
    
    group.add(baseGroup);

    parts.push({
        name: "heavy_anti_vibration_base",
        description: "Cast iron base with rubber isolation feet, damping intense multi-harmonic vibrations.",
        material: "darkSteel",
        function: "Provides supreme stability against wandering and structural resonance.",
        assemblyOrder: 1,
        connections: ["support_pillar", "power_generator_unit"],
        failureEffect: "Intense workbench rattling and machine migration",
        cascadeFailures: ["glassware_shatter", "spill_hazard"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -3, z: 0}
    });

    // 2. Rigid Support Pillar and Rack
    const pillarGroup = new THREE.Group();
    const pillarGeom = new THREE.CylinderGeometry(0.4, 0.4, 12, 32);
    const pillar = new THREE.Mesh(pillarGeom, steel);
    pillar.position.set(-2.5, 6, 0);
    pillarGroup.add(pillar);
    
    // Add gear rack on the pillar for clamp height adjustment
    const rackGeom = new THREE.BoxGeometry(0.2, 11, 0.2);
    const rack = new THREE.Mesh(rackGeom, chrome);
    rack.position.set(-2.15, 6, 0);
    pillarGroup.add(rack);

    // Rack teeth
    for (let i = 0; i < 110; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.22), steel);
        tooth.position.set(-2.15, 0.6 + i * 0.1, 0);
        pillarGroup.add(tooth);
    }

    group.add(pillarGroup);

    parts.push({
        name: "support_pillar_and_rack",
        description: "Thick-walled stainless steel column with integrated precision gear rack.",
        material: "steel",
        function: "Maintains absolute verticality and allows micro-metric height adjustment of the transducer.",
        assemblyOrder: 2,
        connections: ["heavy_anti_vibration_base", "rack_pinion_clamp"],
        failureEffect: "Misalignment of probe",
        cascadeFailures: ["probe_contacts_glass", "reactor_fracture"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -6, y: 0, z: 0}
    });

    // 3. Power Generator Unit
    const generatorGroup = new THREE.Group();
    
    // Main housing
    const genHousingGeom = new THREE.BoxGeometry(5.5, 4, 4.5);
    const genHousing = new THREE.Mesh(genHousingGeom, plastic);
    genHousing.position.set(2, 2, 0);
    generatorGroup.add(genHousing);

    // Front panel bezel
    const bezelGeom = new THREE.BoxGeometry(5.6, 3.8, 0.2);
    const bezel = new THREE.Mesh(bezelGeom, darkSteel);
    bezel.position.set(2, 2, 2.25);
    generatorGroup.add(bezel);

    // Massive OLED Display
    const displayGeom = new THREE.PlaneGeometry(3.5, 2.0);
    const display = new THREE.Mesh(displayGeom, glowingBlue);
    display.position.set(1.5, 2.5, 2.36);
    generatorGroup.add(display);
    
    // Data visualization on display (graphs/bars)
    for (let i = 0; i < 10; i++) {
        const barGeom = new THREE.PlaneGeometry(0.1, 0.2 + Math.random() * 1.2);
        const bar = new THREE.Mesh(barGeom, glowingGreen);
        bar.position.set(0.1 + i * 0.2, 2.2, 2.37);
        generatorGroup.add(bar);
    }

    // Emergency Stop Button
    const estopBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), plastic);
    estopBase.rotation.x = Math.PI / 2;
    estopBase.position.set(4.0, 2.8, 2.36);
    generatorGroup.add(estopBase);
    
    const estopButton = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
    estopButton.rotation.x = Math.PI / 2;
    estopButton.position.set(4.0, 2.8, 2.45);
    generatorGroup.add(estopButton);

    // Control Knobs (Rotary encoders)
    for (let i = 0; i < 3; i++) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32), aluminum);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(3.8 + (i%2)*0.6, 1.2 + Math.floor(i/2)*0.6, 2.45);
        generatorGroup.add(knob);
        
        // indicator line on knob
        const ind = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.31), darkSteel);
        ind.position.set(0, 0.1, 0);
        knob.add(ind);
    }

    // Ventilation grills on side
    for(let i=0; i<15; i++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 0.2), darkSteel);
        vent.position.set(4.76, 0.8 + i*0.2, 0);
        vent.rotation.y = Math.PI/2;
        generatorGroup.add(vent);
    }

    // Back cooling fan
    const fanBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.2), darkSteel);
    fanBox.position.set(2, 2, -2.25);
    generatorGroup.add(fanBox);
    
    const fanBlades = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.05), plastic);
        blade.rotation.z = (i * Math.PI * 2) / 5;
        fanBlades.add(blade);
    }
    fanBlades.position.set(2, 2, -2.3);
    generatorGroup.add(fanBlades);
    
    group.add(generatorGroup);

    parts.push({
        name: "ultrasonic_generator_unit",
        description: "20kHz, 1500 Watt advanced micro-processor controlled ultrasonic generator with auto-tuning.",
        material: "plastic",
        function: "Pulsing, amplitude control, and continuous impedance matching to maintain resonant frequency.",
        assemblyOrder: 3,
        connections: ["heavy_anti_vibration_base", "high_voltage_rf_cable"],
        failureEffect: "Loss of cavitation and acoustic power",
        cascadeFailures: ["process_halt"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 6, y: 0, z: 4}
    });

    // 4. Transducer Housing with Finned Heatsink
    const housingGroup = new THREE.Group();
    
    const housingCoreGeom = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32);
    const housingCore = new THREE.Mesh(housingCoreGeom, aluminum);
    housingCore.position.set(-2.5, 9, 0);
    housingGroup.add(housingCore);
    
    // Massive cooling fins
    for(let i=0; i<20; i++) {
        const finGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.05, 32);
        const fin = new THREE.Mesh(finGeom, aluminum);
        fin.position.set(-2.5, 7.5 + i*0.15, 0);
        housingGroup.add(fin);
    }

    // Top connector cap
    const topCapGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.5, 32);
    const topCap = new THREE.Mesh(topCapGeom, darkSteel);
    topCap.position.set(-2.5, 10.9, 0);
    housingGroup.add(topCap);
    
    group.add(housingGroup);

    parts.push({
        name: "finned_transducer_housing",
        description: "Aerospace-grade aluminum casing with deep fins for passive thermal dissipation.",
        material: "aluminum",
        function: "Protects piezoelectric crystals and prevents depolarization from overheating.",
        assemblyOrder: 4,
        connections: ["rack_pinion_clamp", "piezoelectric_stack_assembly"],
        failureEffect: "Thermal runaway of crystals",
        cascadeFailures: ["transducer_burnout"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 5. Piezoelectric Stack (Visualized inside a cutout or just internal representation)
    const piezoGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const pztGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const pzt = new THREE.Mesh(pztGeom, i % 2 === 0 ? chrome : glowingBlue);
        pzt.position.set(-2.5, 8.0 + i * 0.15, 0);
        piezoGroup.add(pzt);
    }
    
    // Central titanium bolt holding the stack
    const centerBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16), titanium);
    centerBolt.position.set(-2.5, 8.5, 0);
    piezoGroup.add(centerBolt);

    group.add(piezoGroup);

    parts.push({
        name: "piezoelectric_stack_assembly",
        description: "Pre-stressed sandwich transducer utilizing lead zirconate titanate (PZT) ceramic rings.",
        material: "composite",
        function: "Transforms 20,000 Hz electrical current into highly efficient mechanical longitudinal waves.",
        assemblyOrder: 5,
        connections: ["finned_transducer_housing", "amplitude_booster"],
        failureEffect: "Stack fracture or depolarization",
        cascadeFailures: ["generator_short_circuit"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -2, y: 5, z: -3}
    });

    // 6. Amplitude Booster
    const boosterPoints = [];
    boosterPoints.push(new THREE.Vector2(0, 0));
    boosterPoints.push(new THREE.Vector2(0.8, 0));
    boosterPoints.push(new THREE.Vector2(0.8, -0.5));
    boosterPoints.push(new THREE.Vector2(0.4, -1.5));
    boosterPoints.push(new THREE.Vector2(0.4, -2.5));
    boosterPoints.push(new THREE.Vector2(0, -2.5));
    const boosterGeom = new THREE.LatheGeometry(boosterPoints, 64);
    const booster = new THREE.Mesh(boosterGeom, chrome);
    booster.position.set(-2.5, 7.25, 0);
    group.add(booster);

    // Booster nodal mounting ring
    const nodeRingGeom = new THREE.TorusGeometry(0.6, 0.1, 16, 64);
    const nodeRing = new THREE.Mesh(nodeRingGeom, steel);
    nodeRing.position.set(-2.5, 6.0, 0); // Positioned at the exact nodal point of zero vibration
    nodeRing.rotation.x = Math.PI / 2;
    group.add(nodeRing);

    parts.push({
        name: "amplitude_booster",
        description: "1:2 Ratio step-up mechanical amplifier made of aerospace titanium.",
        material: "titanium",
        function: "Multiplies the axial vibration amplitude before entering the sonotrode. Mounted at the nodal point.",
        assemblyOrder: 6,
        connections: ["piezoelectric_stack_assembly", "titanium_sonotrode", "rack_pinion_clamp"],
        failureEffect: "Acoustic impedance mismatch",
        cascadeFailures: ["overload_error", "probe_fatigue"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -2, z: -3}
    });

    // 7. Titanium Sonotrode (Probe Horn)
    const probeGroup = new THREE.Group();
    const probePoints = [];
    probePoints.push(new THREE.Vector2(0, 0));
    probePoints.push(new THREE.Vector2(0.4, 0));
    probePoints.push(new THREE.Vector2(0.3, -0.5));
    probePoints.push(new THREE.Vector2(0.2, -1.5));
    probePoints.push(new THREE.Vector2(0.1, -2.5));
    probePoints.push(new THREE.Vector2(0.08, -4.5)); // Long, slender vibrating tip
    probePoints.push(new THREE.Vector2(0, -4.5));
    
    const probeGeom = new THREE.LatheGeometry(probePoints, 64);
    const probe = new THREE.Mesh(probeGeom, titanium);
    probe.position.set(-2.5, 4.75, 0);
    probeGroup.add(probe);
    
    // Add micro-tip detail
    const tipGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 32);
    const tip = new THREE.Mesh(tipGeom, steel);
    tip.position.set(-2.5, 0.2, 0);
    probeGroup.add(tip);

    group.add(probeGroup);

    parts.push({
        name: "titanium_sonotrode",
        description: "1/2 inch (13mm) stepped exponential micro-tip horn.",
        material: "titanium",
        function: "Concentrates acoustic energy to achieve extreme amplitudes (up to 200 microns peak-to-peak) at the tip.",
        assemblyOrder: 7,
        connections: ["amplitude_booster"],
        failureEffect: "Tip erosion and titanium micro-particle shedding",
        cascadeFailures: ["sample_contamination", "loss_of_tune"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -4, z: -3}
    });

    // 8. Jacketed Reaction Vessel
    const vesselGroup = new THREE.Group();
    
    // Outer glass jacket
    const vOutPoints = [];
    vOutPoints.push(new THREE.Vector2(1.5, 0));
    vOutPoints.push(new THREE.Vector2(1.5, 3.5));
    vOutPoints.push(new THREE.Vector2(1.6, 3.5));
    vOutPoints.push(new THREE.Vector2(1.6, 0));
    const vOutGeom = new THREE.LatheGeometry(vOutPoints, 64);
    const vOuter = new THREE.Mesh(vOutGeom, glass);
    vOuter.position.set(-2.5, -1, 0);
    vesselGroup.add(vOuter);
    
    // Inner glass reactor
    const vInPoints = [];
    vInPoints.push(new THREE.Vector2(1.2, 0.2));
    vInPoints.push(new THREE.Vector2(1.2, 3.5));
    vInPoints.push(new THREE.Vector2(1.3, 3.5));
    vInPoints.push(new THREE.Vector2(1.3, 0.2));
    const vInGeom = new THREE.LatheGeometry(vInPoints, 64);
    const vInner = new THREE.Mesh(vInGeom, glass);
    vInner.position.set(-2.5, -1, 0);
    vesselGroup.add(vInner);

    // Vessel Bottoms
    const vBot1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32), glass);
    vBot1.position.set(-2.5, -0.95, 0);
    vesselGroup.add(vBot1);

    const vBot2 = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.1, 32), glass);
    vBot2.position.set(-2.5, -0.75, 0);
    vesselGroup.add(vBot2);

    // Coolant inlet and outlet ports on the jacket
    const portGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const inletPort = new THREE.Mesh(portGeom, glass);
    inletPort.rotation.z = Math.PI / 2;
    inletPort.position.set(-0.9, -0.5, 0); // right side bottom
    vesselGroup.add(inletPort);

    const outletPort = new THREE.Mesh(portGeom, glass);
    outletPort.rotation.z = Math.PI / 2;
    outletPort.position.set(-0.9, 2.0, 0); // right side top
    vesselGroup.add(outletPort);

    group.add(vesselGroup);

    parts.push({
        name: "jacketed_borosilicate_reactor",
        description: "Custom heavy-wall borosilicate glass vessel with cooling jacket.",
        material: "glass",
        function: "Contains the harsh chemical reaction while permitting continuous external cooling.",
        assemblyOrder: 8,
        connections: ["vessel_clamp_assembly", "coolant_lines"],
        failureEffect: "Glass shatters from acoustic fatigue or thermal shock",
        cascadeFailures: ["toxic_chemical_spill", "immediate_evacuation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 4}
    });

    // 9. Reactor Sample Fluid & Coolant Volume
    const fluidGroup = new THREE.Group();
    
    // Sample
    const sampleGeom = new THREE.CylinderGeometry(1.15, 1.15, 2.0, 32);
    const sample = new THREE.Mesh(sampleGeom, liquidMaterial);
    sample.position.set(-2.5, 0.3, 0);
    fluidGroup.add(sample);

    // Coolant inside jacket
    const coolantGeom = new THREE.CylinderGeometry(1.4, 1.4, 3.2, 32);
    const coolantVol = new THREE.Mesh(coolantGeom, coolantMaterial);
    coolantVol.position.set(-2.5, 0.7, 0);
    fluidGroup.add(coolantVol);

    group.add(fluidGroup);

    parts.push({
        name: "reaction_matrix",
        description: "Precursor chemicals suspended in volatile solvent.",
        material: "liquid",
        function: "Undergoes rapid sonochemical transformation driven by cavitation shockwaves.",
        assemblyOrder: 9,
        connections: ["jacketed_borosilicate_reactor", "titanium_sonotrode"],
        failureEffect: "Contamination or violent boiling",
        cascadeFailures: ["ruined_batch"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 7}
    });

    // 10. Cooling Hoses connecting to a hidden chiller
    const hoseGroup = new THREE.Group();
    
    // Inlet Hose
    const hosePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, -0.5, 0),
        new THREE.Vector3(0, -0.5, 1),
        new THREE.Vector3(2, -1.0, 2),
        new THREE.Vector3(5, -2.0, 2)
    ]);
    const hoseGeom1 = new THREE.TubeGeometry(hosePath1, 64, 0.12, 16, false);
    const hose1 = new THREE.Mesh(hoseGeom1, rubber);
    hoseGroup.add(hose1);

    // Outlet Hose
    const hosePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7, 2.0, 0),
        new THREE.Vector3(0, 2.0, 1),
        new THREE.Vector3(3, 1.0, 2),
        new THREE.Vector3(5, -1.5, 2)
    ]);
    const hoseGeom2 = new THREE.TubeGeometry(hosePath2, 64, 0.12, 16, false);
    const hose2 = new THREE.Mesh(hoseGeom2, rubber);
    hoseGroup.add(hose2);

    group.add(hoseGroup);

    parts.push({
        name: "coolant_circulation_lines",
        description: "Heavy duty silicone braided tubing.",
        material: "rubber",
        function: "Pumps chilled (-10°C) antifreeze fluid continuously through the jacket.",
        assemblyOrder: 10,
        connections: ["jacketed_borosilicate_reactor"],
        failureEffect: "Hose rupture or pump failure",
        cascadeFailures: ["reactor_overheats", "sample_destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 4, y: 0, z: 4}
    });

    // 11. Clamps (Transducer and Vessel)
    const clampGroup = new THREE.Group();
    
    // Transducer Clamp (Rack & Pinion controlled)
    const tClampArm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.6), aluminum);
    tClampArm.position.set(-1.25, 6.0, 0); // Holding the booster nodal ring
    clampGroup.add(tClampArm);
    
    const tClampCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32), aluminum);
    tClampCollar.position.set(-2.5, 6.0, 0);
    clampGroup.add(tClampCollar);
    
    // Rack and pinion adjustment knob
    const tClampKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16), plastic);
    tClampKnob.rotation.z = Math.PI / 2;
    tClampKnob.position.set(-1.5, 6.0, 0.4);
    clampGroup.add(tClampKnob);

    // Vessel Clamp (multi-finger clamp)
    const vClampArm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.4), aluminum);
    vClampArm.position.set(-1.5, 1.5, -1.0);
    clampGroup.add(vClampArm);

    // Fingers gripping glass
    for(let i=-1; i<=1; i+=2) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16), steel);
        finger.rotation.x = Math.PI/2;
        finger.rotation.y = (i * Math.PI)/6;
        finger.position.set(-2.5, 1.5, -0.5);
        clampGroup.add(finger);
    }

    group.add(clampGroup);

    parts.push({
        name: "rack_pinion_clamp",
        description: "Precision height-adjustable cast aluminum clamping system.",
        material: "aluminum",
        function: "Safely locks onto the booster nodal point to support the 5kg transducer assembly.",
        assemblyOrder: 11,
        connections: ["support_pillar_and_rack", "amplitude_booster"],
        failureEffect: "Stripped pinion gear",
        cascadeFailures: ["transducer_drops"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -4, y: 0, z: -2}
    });

    // 12. High Voltage RF Cable
    const rfPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.0, 4.0, -1.0), // back of generator
        new THREE.Vector3(1.0, 11.5, -1.0),
        new THREE.Vector3(-2.5, 12.0, 0),
        new THREE.Vector3(-2.5, 11.1, 0) // top of housing
    ]);
    const rfGeom = new THREE.TubeGeometry(rfPath, 100, 0.18, 16, false);
    const rfCable = new THREE.Mesh(rfGeom, rubber);
    group.add(rfCable);

    // BNC connectors
    const bnc1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 32), chrome);
    bnc1.position.set(-2.5, 11.1, 0);
    group.add(bnc1);

    parts.push({
        name: "high_voltage_rf_cable",
        description: "Thick heavily shielded coaxial power cable.",
        material: "rubber",
        function: "Delivers thousands of volts of high frequency AC power from generator to crystals safely.",
        assemblyOrder: 12,
        connections: ["ultrasonic_generator_unit", "finned_transducer_housing"],
        failureEffect: "Insulation breakdown and internal arcing",
        cascadeFailures: ["electrocution_hazard", "generator_destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 3, z: -5}
    });

    // 13. Advanced Acoustic Enclosure
    const encGroup = new THREE.Group();
    const encMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.9,
        transparent: true,
        opacity: 0.2, // clear acrylic look
        side: THREE.DoubleSide
    });
    const frameMat = new THREE.MeshStandardMaterial({color: 0x444444});

    // Box dimensions
    const encW = 8;
    const encH = 14;
    const encD = 8;
    const encY = 4; // center Y

    // Back panel
    const backP = new THREE.Mesh(new THREE.BoxGeometry(encW, encH, 0.1), encMat);
    backP.position.set(-2.5, encY, -4);
    encGroup.add(backP);
    
    // Side panels
    const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, encH, encD), encMat);
    side1.position.set(-6.5, encY, 0);
    encGroup.add(side1);

    const side2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, encH, encD), encMat);
    side2.position.set(1.5, encY, 0);
    encGroup.add(side2);

    // Top panel
    const topP = new THREE.Mesh(new THREE.BoxGeometry(encW, 0.1, encD), encMat);
    topP.position.set(-2.5, 11, 0);
    encGroup.add(topP);

    // Front door (slightly open for realism)
    const door = new THREE.Mesh(new THREE.BoxGeometry(encW, encH, 0.1), encMat);
    door.position.set(-2.5, encY, 4);
    door.rotation.y = Math.PI / 8; // Opened slightly
    door.position.x = -2.5 + (Math.cos(Math.PI/8)*encW/2) - encW/2;
    door.position.z = 4 - Math.sin(Math.PI/8)*encW/2;
    encGroup.add(door);

    // Enclosure frames (corner posts)
    const postGeom = new THREE.BoxGeometry(0.2, encH, 0.2);
    const postPositions = [
        [-6.5, -4], [-6.5, 4], [1.5, -4], [1.5, 4]
    ];
    postPositions.forEach(pos => {
        const post = new THREE.Mesh(postGeom, frameMat);
        post.position.set(pos[0], encY, pos[1]);
        encGroup.add(post);
    });

    group.add(encGroup);

    parts.push({
        name: "acoustic_abatement_enclosure",
        description: "Heavy duty acrylic and melamine foam-lined soundproofing cabinet.",
        material: "plastic",
        function: "Attenuates 120 dB of ear-piercing high frequency noise down to safe laboratory levels.",
        assemblyOrder: 13,
        connections: ["heavy_anti_vibration_base"],
        failureEffect: "Operator severe tinnitus and hearing loss",
        cascadeFailures: ["OSHA_violation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -10}
    });

    // 14. Intricate Cavitation Cloud (Particle System)
    // Simulating localized intense cavitation zone just below the probe tip
    const cavParticleCount = 2000;
    const cavGeom = new THREE.BufferGeometry();
    const cavPos = new Float32Array(cavParticleCount * 3);
    const cavVel = [];

    for (let i = 0; i < cavParticleCount; i++) {
        const r = Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const y = Math.random() * 2.0 - 2.0; 
        
        cavPos[i * 3] = -2.5 + r * Math.cos(theta);
        cavPos[i * 3 + 1] = 0.2 + y; // Tip is at 0.25 (4.75 - 4.5)
        cavPos[i * 3 + 2] = r * Math.sin(theta);
        
        cavVel.push({
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.8 - 0.1, // Strong downward acoustic streaming jet
            vz: (Math.random() - 0.5) * 0.3,
            life: Math.random()
        });
    }

    cavGeom.setAttribute('position', new THREE.BufferAttribute(cavPos, 3));
    const cavCloud = new THREE.Points(cavGeom, cavitationMaterial);
    group.add(cavCloud);

    parts.push({
        name: "acoustic_cavitation_zone",
        description: "Intensely violent zone of micro-bubble formation, rapid expansion, and adiabatic implosion.",
        material: "plasma/gas",
        function: "Generates microscopic hotspots of 5000 Kelvin and 1000 atmospheres of pressure shockwaves.",
        assemblyOrder: 14,
        connections: ["titanium_sonotrode", "reaction_matrix"],
        failureEffect: "No bubble implosion",
        cascadeFailures: ["chemical_reaction_fails"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -2.5, y: -2, z: 0}
    });

    // 15. Secondary Bubble Particles (Rising bubbles in the liquid outside the intense jet)
    const bubParticleCount = 500;
    const bubGeom = new THREE.BufferGeometry();
    const bubPos = new Float32Array(bubParticleCount * 3);
    const bubVel = [];

    for (let i = 0; i < bubParticleCount; i++) {
        const r = Math.random() * 1.0;
        const theta = Math.random() * Math.PI * 2;
        
        bubPos[i * 3] = -2.5 + r * Math.cos(theta);
        bubPos[i * 3 + 1] = -0.5 + Math.random() * 1.5;
        bubPos[i * 3 + 2] = r * Math.sin(theta);
        
        bubVel.push({
            vy: 0.1 + Math.random() * 0.3, // Rising slowly
            life: Math.random()
        });
    }

    bubGeom.setAttribute('position', new THREE.BufferAttribute(bubPos, 3));
    const bubCloud = new THREE.Points(bubGeom, bubbleMaterial);
    group.add(bubCloud);

    // 16. Temperature Probe (Thermocouple) inserted into the flask
    const tcGroup = new THREE.Group();
    const tcWire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 16), steel);
    tcWire.position.set(-1.8, 1.5, 0.5);
    tcWire.rotation.z = Math.PI / 12;
    tcGroup.add(tcWire);
    
    // Wire going back to generator
    const tcCablePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 2.9, 0.5),
        new THREE.Vector3(-1.0, 3.5, 1.5),
        new THREE.Vector3(2.0, 3.0, 1.5),
        new THREE.Vector3(2.0, 2.0, -1.0)
    ]);
    const tcCableGeom = new THREE.TubeGeometry(tcCablePath, 32, 0.04, 8, false);
    const tcCable = new THREE.Mesh(tcCableGeom, rubber);
    tcGroup.add(tcCable);

    group.add(tcGroup);
    
    parts.push({
        name: "k_type_thermocouple_probe",
        description: "Acid-resistant PTFE-coated stainless steel thermocouple.",
        material: "steel",
        function: "Continuously monitors reaction temperature to prevent boiling or thermal degradation of sensitive solutes.",
        assemblyOrder: 15,
        connections: ["reaction_matrix", "ultrasonic_generator_unit"],
        failureEffect: "Temperature reading drifts",
        cascadeFailures: ["thermal_runaway", "solvent_explosion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -1, y: 3, z: 2}
    });

    const description = "The Ultra High-Intensity Probe Sonicator represents the pinnacle of laboratory-scale sonochemical reactors. Operating at a precisely tuned 20 kHz, the massive 1500 Watt generator feeds high voltage RF power to a heavy-duty piezoelectric transducer stack. This electro-mechanical heart expands and contracts 20,000 times per second, translating into extreme mechanical vibrations. An aerospace-grade titanium amplitude booster and exponential sonotrode act as acoustic lenses, concentrating the vibrational energy into microscopic tip displacements of up to 200 micrometers. When submerged in a liquid, this immense acceleration rips the fluid apart, creating billions of microscopic vacuum bubbles in a phenomenon called acoustic cavitation. The violent, adiabatic implosion of these bubbles produces localized shockwaves with temperatures rivaling the surface of the sun (5,000 K) and pressures exceeding 1,000 atm. This brutal environment is harnessed for nanoparticle synthesis, cellular disruption, sonocrystallization, and aggressively accelerating sluggish chemical reactions. Due to immense thermal generation, a jacketed borosilicate reactor continually circulates cryogenic coolant to prevent the solvent from violently flashing to vapor.";

    const quizQuestions = [
        {
            question: "What specific phenomenon is responsible for generating localized 5000 K temperatures within the liquid?",
            options: [
                "Dielectric friction from high voltage",
                "Thermal conduction from the overheated titanium probe",
                "Acoustic cavitation bubble implosion",
                "Electromagnetic resonance heating"
            ],
            correctAnswer: 2,
            explanation: "The mechanical vibrations cause localized pressure drops that rip the liquid apart into microscopic vacuum bubbles. When the pressure cycle reverses, these bubbles violently implode adiabatically, reaching extreme temperatures and pressures."
        },
        {
            question: "Why is the amplitude booster mounted exactly at its 'nodal point'?",
            options: [
                "To look aesthetically pleasing",
                "Because the nodal point experiences zero axial vibration, allowing it to be clamped without losing energy or destroying the clamp",
                "To maximize the transfer of heat to the clamp",
                "To short-circuit stray electrical currents"
            ],
            correctAnswer: 1,
            explanation: "In a resonant acoustic standing wave, the nodes have zero displacement (vibration), while the anti-nodes have maximum displacement. Clamping anywhere but the node would dampen the vibration, heat up the clamp, and severely damage the system."
        },
        {
            question: "What is the primary function of the piezoelectric stack?",
            options: [
                "To cool down the titanium probe",
                "To convert 20kHz electrical voltage directly into mechanical expansion and contraction",
                "To measure the viscosity of the fluid",
                "To act as a physical weight stabilizing the housing"
            ],
            correctAnswer: 1,
            explanation: "Lead Zirconate Titanate (PZT) ceramic rings exhibit the converse piezoelectric effect. When high voltage AC is applied, their crystalline structure physically deforms, creating the mechanical vibration."
        },
        {
            question: "Why must the sonotrode (probe horn) be machined from Titanium alloys like Ti-6Al-4V rather than standard steel?",
            options: [
                "Titanium is cheaper and easier to mold",
                "Titanium does not conduct electricity",
                "Titanium has superior acoustic transmissivity, extraordinary tensile strength, and resists the immense fatigue of vibrating 20,000 times a second",
                "Titanium reacts chemically with the solvent to speed up the reaction"
            ],
            correctAnswer: 2,
            explanation: "The extreme cyclic loading (20 kHz) and high stress at the tip would rapidly cause fatigue fractures in standard metals. Titanium's strength-to-weight ratio and acoustic properties make it the only viable material."
        },
        {
            question: "During intense sonication, a strong downward flow of liquid is often observed jetting away from the probe tip. What is this called?",
            options: [
                "Thermal Convection",
                "Acoustic Streaming",
                "Laminar Drag",
                "Coriolis Effect"
            ],
            correctAnswer: 1,
            explanation: "Acoustic streaming is a physical phenomenon where the attenuation of the acoustic wave creates a steady momentum gradient, driving a powerful fluid jet away from the transducer face, which provides excellent bulk mixing."
        }
    ];

    // Variables for hyper-realistic animation
    let timeElapsed = 0;
    
    const animate = (time, speed, meshes) => {
        timeElapsed += speed * 0.05;

        // 1. OLED Screen Graphics Pulse
        display.material.emissiveIntensity = 2.0 + Math.sin(timeElapsed * 10) * 0.5;
        
        // Dynamic bars on generator
        generatorGroup.children.forEach((child, index) => {
            if(child.material === glowingGreen) {
                // random jitter for equalizer effect
                child.scale.y = 0.2 + Math.abs(Math.sin(timeElapsed * 15 + index)) * 2.0;
                child.position.y = 2.2 + (child.scale.y * child.geometry.parameters.height) / 2 - 0.1;
            }
        });

        // 2. High Frequency Transducer Assembly Vibration
        // We apply a micro-vibration to the moving parts. Note: in reality it's 20kHz, we just make it blur/shake rapidly.
        const vibAmp = 0.015 * speed; // amplitude
        const vibY = Math.sin(time * 200) * vibAmp;
        
        // The housing, piezo stack, booster, and probe vibrate. The nodal clamp does not.
        housingGroup.position.y = vibY;
        piezoGroup.position.y = vibY;
        booster.position.y = 7.25 + vibY;
        probeGroup.position.y = vibY;

        // 3. Acoustic Streaming Cavitation Cloud Dynamics (The most intense part)
        const cavPositions = cavCloud.geometry.attributes.position.array;
        
        for (let i = 0; i < cavParticleCount; i++) {
            const vel = cavVel[i];
            
            // Move particles
            cavPositions[i * 3] += vel.vx * speed * 0.5;
            cavPositions[i * 3 + 1] += vel.vy * speed * 0.5;
            cavPositions[i * 3 + 2] += vel.vz * speed * 0.5;
            
            // Age particle
            vel.life -= 0.03 * speed;
            
            // Reset if dead or hits the bottom of the flask
            if (vel.life <= 0 || cavPositions[i * 3 + 1] < -0.8) {
                const r = Math.random() * 0.2; // tighter generation at tip
                const theta = Math.random() * Math.PI * 2;
                
                cavPositions[i * 3] = -2.5 + r * Math.cos(theta);
                cavPositions[i * 3 + 1] = 0.25; // Directly at probe tip
                cavPositions[i * 3 + 2] = r * Math.sin(theta);
                
                vel.life = 1.0;
                vel.vx = (Math.random() - 0.5) * 0.4;
                vel.vy = -Math.random() * 1.2 - 0.4; // Extreme downward jet
                vel.vz = (Math.random() - 0.5) * 0.4;
            }
        }
        cavCloud.geometry.attributes.position.needsUpdate = true;
        
        // Pulse cavitation cloud opacity to simulate acoustic pulses
        cavCloud.material.opacity = 0.6 + Math.sin(timeElapsed * 50) * 0.3;

        // 4. Secondary Bubble Flow (Bulk liquid mixing)
        const bubPositions = bubCloud.geometry.attributes.position.array;
        for (let i = 0; i < bubParticleCount; i++) {
            const vel = bubVel[i];
            
            bubPositions[i * 3 + 1] += vel.vy * speed * 0.2;
            vel.life -= 0.01 * speed;

            // Swirling motion inside the flask
            const angle = Math.atan2(bubPositions[i * 3 + 2], bubPositions[i * 3] + 2.5);
            const radius = Math.sqrt(Math.pow(bubPositions[i * 3] + 2.5, 2) + Math.pow(bubPositions[i * 3 + 2], 2));
            
            const swirlSpeed = 0.05 * speed;
            bubPositions[i * 3] = -2.5 + radius * Math.cos(angle + swirlSpeed);
            bubPositions[i * 3 + 2] = radius * Math.sin(angle + swirlSpeed);

            if (vel.life <= 0 || bubPositions[i * 3 + 1] > 1.2) {
                const r = Math.random() * 1.1;
                const theta = Math.random() * Math.PI * 2;
                
                bubPositions[i * 3] = -2.5 + r * Math.cos(theta);
                bubPositions[i * 3 + 1] = -0.8;
                bubPositions[i * 3 + 2] = r * Math.sin(theta);
                
                vel.life = 1.0;
                vel.vy = 0.1 + Math.random() * 0.3;
            }
        }
        bubCloud.geometry.attributes.position.needsUpdate = true;

        // 5. Coolant Flow simulation (Subtle pulsing of the coolant material transmission)
        coolantVol.material.transmission = 0.90 + Math.sin(timeElapsed * 5) * 0.05;
        
        // Cooling fan rotation
        fanBlades.rotation.z -= speed * 0.5;
    };

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createProbeSonicator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
