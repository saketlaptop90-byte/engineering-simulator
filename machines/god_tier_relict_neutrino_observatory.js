import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM HIGH-TECH MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x6600cc,
        emissiveIntensity: 0.7,
        wireframe: true
    });
    
    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.3,
        bumpScale: 0.05
    });

    const superCold = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.4
    });

    const activeSensorMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2
    });

    const deepVacuumMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.8
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.6,
        wireframe: true
    });

    // --- PROCEDURAL GEOMETRY GENERATORS ---

    // 1. Fractal Tritium Lattice Generator
    function createFractalLattice(depth, maxDepth, radius, length, material) {
        const latticeGroup = new THREE.Group();
        if (depth > maxDepth) return latticeGroup;

        const strutGeo = new THREE.CylinderGeometry(radius, radius, length, 12, 1, false);
        const strut = new THREE.Mesh(strutGeo, material);
        latticeGroup.add(strut);

        const nodeGeo = new THREE.SphereGeometry(radius * 2, 16, 16);
        const node1 = new THREE.Mesh(nodeGeo, activeSensorMat);
        node1.position.y = length / 2;
        const node2 = new THREE.Mesh(nodeGeo, activeSensorMat);
        node2.position.y = -length / 2;
        latticeGroup.add(node1, node2);

        if (depth < maxDepth) {
            const branches = 4;
            for (let i = 0; i < branches; i++) {
                const branch = createFractalLattice(depth + 1, maxDepth, radius * 0.6, length * 0.6, material);
                branch.position.y = length / 2;
                branch.rotation.x = Math.PI / 4;
                branch.rotation.y = (i * Math.PI * 2) / branches;
                latticeGroup.add(branch);

                const branchDown = createFractalLattice(depth + 1, maxDepth, radius * 0.6, length * 0.6, material);
                branchDown.position.y = -length / 2;
                branchDown.rotation.x = Math.PI - Math.PI / 4;
                branchDown.rotation.y = (i * Math.PI * 2) / branches;
                latticeGroup.add(branchDown);
            }
        }
        return latticeGroup;
    }

    // 2. Complex Lathe Geometry for Cryostat Inner Shield
    function createCryostatShield(innerRadius, outerRadius, height, segments) {
        const points = [];
        for ( let i = 0; i <= segments; i ++ ) {
            const t = i / segments;
            const y = (t - 0.5) * height;
            // Intricate ridges
            const r = innerRadius + (outerRadius - innerRadius) * (0.5 + 0.5 * Math.sin(t * Math.PI * 20)) + (t < 0.1 || t > 0.9 ? 5 : 0);
            points.push( new THREE.Vector2( r, y ) );
        }
        const geo = new THREE.LatheGeometry( points, 128 );
        return new THREE.Mesh( geo, goldFoil );
    }

    // 3. Superconducting Wiring Harness (TubeGeometry with Sine Waves)
    function createWiringHarness(radius, coilCount, height, wireRadius, material) {
        const harness = new THREE.Group();
        class HelixCurve extends THREE.Curve {
            constructor( scale = 1, loops = 1, h = 1 ) {
                super();
                this.scale = scale;
                this.loops = loops;
                this.h = h;
            }
            getPoint( t, optionalTarget = new THREE.Vector3() ) {
                const x = this.scale * Math.cos( t * Math.PI * 2 * this.loops );
                const z = this.scale * Math.sin( t * Math.PI * 2 * this.loops );
                const y = (t - 0.5) * this.h;
                return optionalTarget.set( x, y, z );
            }
        }
        
        for (let i = 0; i < 16; i++) {
            const path = new HelixCurve(radius, coilCount, height);
            const tubeGeo = new THREE.TubeGeometry(path, 200, wireRadius, 8, false);
            const wire = new THREE.Mesh(tubeGeo, material);
            wire.rotation.y = (i * Math.PI * 2) / 16;
            harness.add(wire);
        }
        return harness;
    }

    // 4. Extruded Cooling Fins
    function createCoolingFins(outerRadius, innerRadius, thickness, finCount) {
        const shape = new THREE.Shape();
        shape.moveTo(outerRadius, 0);
        for(let i=1; i<=finCount * 2; i++) {
            const angle = (i * Math.PI) / finCount;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            shape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
        }
        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, aluminum);
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    }

    // 5. Array of Micro-Calorimeters
    function createCalorimeterArray(rows, cols, spacing) {
        const arrayGroup = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(spacing * 0.8, spacing * 0.2, spacing * 0.8);
        const sensorGeo = new THREE.CylinderGeometry(spacing * 0.3, spacing * 0.3, spacing * 0.3, 16);
        
        for(let x=0; x<cols; x++) {
            for(let z=0; z<rows; z++) {
                const px = (x - cols/2) * spacing;
                const pz = (z - rows/2) * spacing;
                
                const base = new THREE.Mesh(baseGeo, darkSteel);
                base.position.set(px, 0, pz);
                
                const sensor = new THREE.Mesh(sensorGeo, activeSensorMat);
                sensor.position.set(px, spacing * 0.25, pz);
                
                arrayGroup.add(base, sensor);
            }
        }
        return arrayGroup;
    }

    // 6. Giant Vacuum Vessel
    function createVacuumVessel(radius, height, thickness) {
        const shape = new THREE.Shape();
        shape.moveTo(radius, -height/2);
        shape.lineTo(radius, height/2);
        shape.lineTo(radius - thickness, height/2);
        shape.lineTo(radius - thickness, -height/2);
        shape.lineTo(radius, -height/2);

        const extrudeSettings = {
            steps: 1,
            depth: 0,
            bevelEnabled: false
        };
        const points = shape.getPoints();
        const latheGeo = new THREE.LatheGeometry(points, 64);
        const vessel = new THREE.Mesh(latheGeo, steel);
        
        // Add reinforcing ribs
        for(let i=0; i<10; i++) {
            const ribGeo = new THREE.TorusGeometry(radius + 0.5, 0.4, 16, 64);
            const rib = new THREE.Mesh(ribGeo, darkSteel);
            rib.position.y = -height/2 + (i/9)*height;
            rib.rotation.x = Math.PI / 2;
            vessel.add(rib);
        }
        return vessel;
    }

    // 7. Muon Veto Scintillator Panels
    function createMuonVetoPanels(radius, height, panelCount) {
        const vetoGroup = new THREE.Group();
        const panelGeo = new THREE.BoxGeometry(4, height * 0.95, 0.5);
        for(let i=0; i<panelCount; i++) {
            const angle = (i * Math.PI * 2) / panelCount;
            const panel = new THREE.Mesh(panelGeo, plastic);
            panel.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            panel.rotation.y = -angle + Math.PI/2;
            
            // Photomultiplier tubes
            const pmtGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
            const pmt = new THREE.Mesh(pmtGeo, glass);
            pmt.position.y = height * 0.475 + 0.5;
            panel.add(pmt);
            
            vetoGroup.add(panel);
        }
        return vetoGroup;
    }

    // 8. Structural Gantry
    function createGantry(width, height, depth) {
        const gantry = new THREE.Group();
        const beamGeo = new THREE.BoxGeometry(0.5, height, 0.5);
        const crossGeo = new THREE.BoxGeometry(width, 0.5, 0.5);
        const depthGeo = new THREE.BoxGeometry(0.5, 0.5, depth);

        const positions = [
            [-width/2, -depth/2], [width/2, -depth/2],
            [-width/2, depth/2], [width/2, depth/2]
        ];

        positions.forEach(pos => {
            const pillar = new THREE.Mesh(beamGeo, steel);
            pillar.position.set(pos[0], 0, pos[1]);
            gantry.add(pillar);
        });

        for(let y of [-height/2 + 1, 0, height/2 - 1]) {
            const c1 = new THREE.Mesh(crossGeo, darkSteel);
            c1.position.set(0, y, -depth/2);
            const c2 = new THREE.Mesh(crossGeo, darkSteel);
            c2.position.set(0, y, depth/2);
            
            const d1 = new THREE.Mesh(depthGeo, darkSteel);
            d1.position.set(-width/2, y, 0);
            const d2 = new THREE.Mesh(depthGeo, darkSteel);
            d2.position.set(width/2, y, 0);

            gantry.add(c1, c2, d1, d2);
        }
        return gantry;
    }

    // --- INSTANTIATE COMPONENTS ---

    // Part 1: Tritium Target Mass
    const targetMassGroup = new THREE.Group();
    const coreFractal = createFractalLattice(1, 4, 0.5, 8, superCold);
    targetMassGroup.add(coreFractal);
    targetMassGroup.position.y = 0;
    
    parts.push({
        name: "Central Tritium Target Mass",
        description: "A highly complex, ultra-clean fractal lattice structure containing adsorbed tritium. Suspended in deep vacuum to serve as the target for relic neutrino capture.",
        material: "SuperCold / ActiveSensorMat",
        function: "Provides beta-decaying nuclei necessary for neutrino capture via the process v_e + ^3H -> ^3He + e-.",
        assemblyOrder: 1,
        connections: ["CryostatInnerShield", "SuperconductingCalorimeterArray"],
        failureEffect: "Contamination of the target mass causes background noise masking the sub-eV neutrino signal.",
        cascadeFailures: ["Signal to Noise Ratio Collapse", "Data Acquisition Saturation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 },
        mesh: targetMassGroup
    });
    group.add(targetMassGroup);

    // Part 2: Superconducting Calorimeter Array
    const calorimeterArray = createCalorimeterArray(20, 20, 0.5);
    calorimeterArray.position.y = -6;
    
    parts.push({
        name: "Transition Edge Sensor (TES) Calorimeter Array",
        description: "An array of 400 ultra-sensitive Transition Edge Sensors designed to measure the kinetic energy of emitted electrons with an energy resolution of order 0.01 eV.",
        material: "DarkSteel / ActiveSensorMat",
        function: "Measures energy deposits from electron captures. The sensors operate at 10 mK on the brink of a superconducting transition.",
        assemblyOrder: 2,
        connections: ["Central Tritium Target Mass", "QuantumInterferenceReadoutWiring"],
        failureEffect: "Loss of thermal stability causing complete loss of energy resolution.",
        cascadeFailures: ["False Event Triggers", "Cryogenic Runaway"],
        originalPosition: { x: 0, y: -6, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: calorimeterArray
    });
    group.add(calorimeterArray);

    // Part 3: Cryostat Inner Shield (Thermal Radiation Baffle)
    const innerShield = createCryostatShield(8, 9, 20, 100);
    
    parts.push({
        name: "Inner Cryogenic Shielding",
        description: "A corrugated, gold-plated internal baffle system designed to reflect blackbody radiation away from the milli-Kelvin core.",
        material: "GoldFoil",
        function: "Maintains absolute thermal isolation of the inner target and calorimeter array.",
        assemblyOrder: 3,
        connections: ["Central Tritium Target Mass", "OuterCryogenicShielding"],
        failureEffect: "Infrared photon leakage heating the TES array above its critical temperature.",
        cascadeFailures: ["TES Array Quench", "Liquid Helium Boil-off"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: innerShield
    });
    group.add(innerShield);

    // Part 4: Quantum Interference Readout Wiring
    const wiringHarness = createWiringHarness(9.5, 10, 25, 0.1, copper);
    
    parts.push({
        name: "SQUID Readout Wiring Harness",
        description: "Superconducting Quantum Interference Device (SQUID) multiplexing wires spiraling around the inner shield to read out the TES arrays with zero resistance.",
        material: "Copper / Superconductor",
        function: "Transmits sub-microampere signals from the calorimeters to the room-temperature amplification electronics.",
        assemblyOrder: 4,
        connections: ["TES Calorimeter Array", "DataAcquisitionPhotonics"],
        failureEffect: "Introduction of Johnson-Nyquist noise obscuring the micro-eV neutrino capture peak.",
        cascadeFailures: ["Total Data Loss", "SQUID Amplifier Saturation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 0, z: 15 },
        mesh: wiringHarness
    });
    group.add(wiringHarness);

    // Part 5: Helium-3 Dilution Refrigerator Heat Exchanger
    const heatExchangerGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const fin = createCoolingFins(12, 10, 0.5, 30);
        fin.position.y = 10 + i * 1.5;
        heatExchangerGroup.add(fin);
    }
    const fridgeCoreGeo = new THREE.CylinderGeometry(10, 10, 8, 32);
    const fridgeCore = new THREE.Mesh(fridgeCoreGeo, darkSteel);
    fridgeCore.position.y = 13;
    heatExchangerGroup.add(fridgeCore);

    parts.push({
        name: "Helium-3/Helium-4 Dilution Refrigerator",
        description: "A massive, multi-stage cryogenic pump utilizing the enthalpy of mixing between 3He and 4He isotopes to reach temperatures below 10 mK.",
        material: "Aluminum / DarkSteel",
        function: "Extracts heat continuously from the target mass and sensor arrays, counteracting the microwatt heat loads from wiring.",
        assemblyOrder: 5,
        connections: ["Inner Cryogenic Shielding", "OuterVacuumChamber"],
        failureEffect: "Thermal runaway. The entire core rapidly warms up to 4 Kelvin, halting operations.",
        cascadeFailures: ["TES Array Quench", "Target Mass Outgassing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 },
        mesh: heatExchangerGroup
    });
    group.add(heatExchangerGroup);

    // Part 6: Primary Vacuum Vessel
    const vacuumVessel = createVacuumVessel(15, 30, 1);
    
    parts.push({
        name: "Primary Ultra-High Vacuum Vessel",
        description: "A colossal stainless steel cylinder capable of maintaining a pressure of 10^-12 Torr. Features external reinforcing ribs to withstand atmospheric crushing force.",
        material: "Steel / DarkSteel",
        function: "Isolates the cryogenic components from convective heat transfer and atmospheric contamination.",
        assemblyOrder: 6,
        connections: ["Helium-3/Helium-4 Dilution Refrigerator", "Muon Veto Scintillator Panels"],
        failureEffect: "Catastrophic implosion or massive heat leak due to gas conduction.",
        cascadeFailures: ["Complete Apparatus Destruction", "Cryogen Explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 0, z: 0 },
        mesh: vacuumVessel
    });
    group.add(vacuumVessel);

    // Part 7: Outer Magnetic Shielding (Mu-Metal)
    const magneticShieldGeo = new THREE.LatheGeometry(
        new THREE.Shape().moveTo(17, -16).lineTo(17, 16).lineTo(16, 16).lineTo(16,-16).lineTo(17,-16).getPoints(), 64
    );
    const magneticShield = new THREE.Mesh(magneticShieldGeo, chrome);
    
    parts.push({
        name: "Mu-Metal Magnetic Shielding",
        description: "Multiple concentric layers of high magnetic permeability alloy (mu-metal) to shield the inner SQUID amplifiers from Earth's magnetic field and lab noise.",
        material: "Chrome (Mu-Metal representation)",
        function: "Reduces external magnetic fields by a factor of 100,000 to prevent flux trapping in superconducting circuits.",
        assemblyOrder: 7,
        connections: ["Primary Ultra-High Vacuum Vessel", "Structural Gantry"],
        failureEffect: "Magnetic flux vortices pin within superconductors, causing massive Barkhausen noise.",
        cascadeFailures: ["SQUID Readout Failure", "False Positives"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 },
        mesh: magneticShield
    });
    group.add(magneticShield);

    // Part 8: Muon Veto Scintillator Panels
    const muonVeto = createMuonVetoPanels(19, 32, 24);
    
    parts.push({
        name: "Active Muon Veto System",
        description: "An array of 24 massive plastic scintillator panels coupled to photomultiplier tubes surrounding the main vessel.",
        material: "Plastic / Glass",
        function: "Detects passing cosmic ray muons. Triggers a veto signal to ignore simultaneous events in the TES array, suppressing cosmogenic backgrounds.",
        assemblyOrder: 8,
        connections: ["Mu-Metal Magnetic Shielding", "Structural Gantry"],
        failureEffect: "Cosmic ray showers mimic high-energy electron events, burying the neutrino signal in background noise.",
        cascadeFailures: ["Data Contamination"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 30 },
        mesh: muonVeto
    });
    group.add(muonVeto);

    // Part 9: Structural Support Gantry
    const supportGantry = createGantry(45, 40, 45);
    
    parts.push({
        name: "Seismic Isolation Gantry",
        description: "Heavy steel truss structure resting on active hydraulic dampers to decouple the experiment from ground vibrations.",
        material: "Steel / DarkSteel",
        function: "Prevents micro-seismic noise from injecting vibrational energy that could manifest as false heat signals in the calorimeters.",
        assemblyOrder: 9,
        connections: ["Earth", "Primary Ultra-High Vacuum Vessel"],
        failureEffect: "Vibrational heating destroys milli-Kelvin stability.",
        cascadeFailures: ["Cryogenic Failure", "Sensor Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 },
        mesh: supportGantry
    });
    group.add(supportGantry);

    // Part 10: Hydraulic Dampers
    const damperGroup = new THREE.Group();
    const damperGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const pistonGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const positions = [
        [-22.5, -20, -22.5], [22.5, -20, -22.5],
        [-22.5, -20, 22.5], [22.5, -20, 22.5]
    ];
    positions.forEach(pos => {
        const dGroup = new THREE.Group();
        const base = new THREE.Mesh(damperGeo, darkSteel);
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.position.y = 2;
        dGroup.add(base, piston);
        dGroup.position.set(pos[0], pos[1], pos[2]);
        damperGroup.add(dGroup);
    });

    parts.push({
        name: "Active Hydraulic Dampers",
        description: "Four massive pneumatic and hydraulic pistons controlled by interferometric feedback loops.",
        material: "DarkSteel / Chrome",
        function: "Actively cancels seismic waves below 10 Hz.",
        assemblyOrder: 10,
        connections: ["Seismic Isolation Gantry", "Facility Floor"],
        failureEffect: "Transmission of low-frequency vibrations into the cryostat.",
        cascadeFailures: ["Gantry Resonance", "TES Heating"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -35, z: 0 },
        mesh: damperGroup
    });
    group.add(damperGroup);

    // Part 11: Data Acquisition Fiber Optics
    const dataFibers = new THREE.Group();
    for(let i=0; i<100; i++) {
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, -15, 0),
            new THREE.Vector3(Math.random()*10-5, -20, Math.random()*10-5),
            new THREE.Vector3(Math.random()*20-10, -25, Math.random()*20-10),
            new THREE.Vector3(25, -30, 0)
        );
        const tube = new THREE.TubeGeometry(curve, 20, 0.05, 4, false);
        const fiber = new THREE.Mesh(tube, neonBlue);
        dataFibers.add(fiber);
    }

    parts.push({
        name: "Photonic Data Acquisition Lines",
        description: "A bundle of 100 glowing fiber optic cables carrying multiplexed digitized signals from the SQUID controllers to the main server cluster.",
        material: "NeonBlue",
        function: "Provides terabit-per-second, electromagnetically immune data transfer.",
        assemblyOrder: 11,
        connections: ["SQUID Readout Wiring Harness", "Main Compute Cluster"],
        failureEffect: "Loss of event telemetry, rendering the detector useless.",
        cascadeFailures: ["Data Buffer Overflow"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: -20, z: -20 },
        mesh: dataFibers
    });
    group.add(dataFibers);

    // Part 12: Operator Console
    const consoleGroup = new THREE.Group();
    const deskGeo = new THREE.BoxGeometry(6, 1, 3);
    const desk = new THREE.Mesh(deskGeo, carbonFiber);
    desk.position.set(30, -18, 0);
    
    for(let i=-1; i<=1; i++) {
        const screenGeo = new THREE.BoxGeometry(1.8, 1.2, 0.1);
        const screen = new THREE.Mesh(screenGeo, neonPurple);
        screen.position.set(30 + i*2, -17, -1);
        screen.rotation.y = -i * 0.2;
        screen.rotation.x = 0.1;
        consoleGroup.add(screen);
    }
    consoleGroup.add(desk);

    parts.push({
        name: "Cryogenics and DAQ Operator Console",
        description: "Carbon fiber workstation with holographic data displays for monitoring temperature streams, vacuum pressure, and real-time event triggering.",
        material: "CarbonFiber / NeonPurple",
        function: "Human-in-the-loop control and monitoring of the extreme state parameters of the observatory.",
        assemblyOrder: 12,
        connections: ["Facility Power", "Main Compute Cluster"],
        failureEffect: "Inability to monitor system health, potentially leading to catastrophic hardware failure if automated systems fail.",
        cascadeFailures: ["Unnoticed Quench", "Unnoticed Vacuum Leak"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: -18, z: 0 },
        mesh: consoleGroup
    });
    group.add(consoleGroup);

    // Part 13: Radioactive Calibration Arm
    const calibrationArm = new THREE.Group();
    const armGeo1 = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const arm1 = new THREE.Mesh(armGeo1, steel);
    arm1.rotation.z = Math.PI / 4;
    arm1.position.set(-10, -5, 0);
    const sourceGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const source = new THREE.Mesh(sourceGeo, neonBlue);
    source.position.set(-13.5, -1.5, 0);
    calibrationArm.add(arm1, source);

    parts.push({
        name: "Krypton-83m Calibration Deployer",
        description: "A precision robotic arm that inserts a gaseous radioactive source into the vacuum jacket for energy calibration.",
        material: "Steel / NeonBlue",
        function: "Fires monoenergetic conversion electrons to calibrate the TES array response function precisely at the tritium endpoint.",
        assemblyOrder: 13,
        connections: ["Primary Ultra-High Vacuum Vessel"],
        failureEffect: "Drifting energy scale calibration, leading to a fake neutrino mass measurement or missing the CνB peak entirely.",
        cascadeFailures: ["False Discovery", "Systematic Error Dominance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 10, z: 0 },
        mesh: calibrationArm
    });
    group.add(calibrationArm);

    // Part 14: Liquid Nitrogen Pre-Cooling Jacket
    const ln2JacketGeo = new THREE.TorusGeometry(16, 2, 32, 64);
    const ln2Jacket = new THREE.Mesh(ln2JacketGeo, copper);
    ln2Jacket.rotation.x = Math.PI / 2;
    ln2Jacket.position.y = 5;

    parts.push({
        name: "Liquid Nitrogen Thermal Intercept",
        description: "A massive copper toroidal reservoir circulating liquid nitrogen at 77 K.",
        material: "Copper",
        function: "Absorbs the bulk of room-temperature radiated heat before it reaches the liquid helium stages.",
        assemblyOrder: 14,
        connections: ["Primary Ultra-High Vacuum Vessel", "Inner Cryogenic Shielding"],
        failureEffect: "Excessive heat load on the Helium stages, causing rapid boil-off and system shutdown.",
        cascadeFailures: ["Helium Venting", "Cryo-Pump Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 20 },
        mesh: ln2Jacket
    });
    group.add(ln2Jacket);

    // Part 15: Event Visualizer Nodes (Particle System representation)
    const eventVisualizerGroup = new THREE.Group();
    const nodeGeometries = [];
    for(let i=0; i<500; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const mesh = new THREE.Mesh(nodeGeo, neonBlue);
        mesh.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        mesh.userData = { 
            baseScale: Math.random() * 0.5 + 0.5,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.05 + 0.01
        };
        eventVisualizerGroup.add(mesh);
    }

    parts.push({
        name: "Quantum Capture Event Topology Matrix",
        description: "Real-time three-dimensional holographic visualization matrix scattered throughout the target mass, rendering detected sub-eV energy deposits.",
        material: "NeonBlue (Emissive)",
        function: "Provides a visual debugging and monitoring interface for track reconstruction and energy calorimetry.",
        assemblyOrder: 15,
        connections: ["Central Tritium Target Mass", "Cryogenics and DAQ Operator Console"],
        failureEffect: "Inability for operators to visually identify spatial noise clustering.",
        cascadeFailures: ["Operator Blindness"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -30 },
        mesh: eventVisualizerGroup
    });
    group.add(eventVisualizerGroup);


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "The detection of the Cosmic Neutrino Background (CνB) in this observatory relies on neutrino capture on a beta-decaying nucleus like Tritium. What is the precise kinematic signature of a relic neutrino capture event in the measured electron energy spectrum?",
            options: [
                "A continuous spectrum extending up to the standard beta decay endpoint.",
                "A monochromatic peak located exactly at E_end + m_v*c^2, separated from the standard beta decay endpoint by twice the neutrino mass.",
                "A sharp drop-off in the spectrum exactly at E_end - m_v*c^2.",
                "A sequence of discrete energy peaks corresponding to different neutrino flavor eigenstates."
            ],
            correctAnswer: 1,
            explanation: "Neutrino capture (v_e + ^3H -> ^3He + e^-) produces a monoenergetic electron. Its energy is exactly the Q-value of the reaction plus the incoming neutrino's mass-energy. Since standard beta decay ends at E_end = Q - m_v*c^2, the gap between the beta decay endpoint and the relic capture peak is exactly 2*m_v*c^2."
        },
        {
            question: "In order to resolve the CνB capture peak from the overwhelmingly large background of standard beta decay electrons near the endpoint, extraordinary energy resolution is required. If the absolute neutrino mass scale is m_v = 0.05 eV, and the Tritium endpoint energy is approximately 18.6 keV, what is the approximate relative energy resolution (ΔE/E) required of the TES Calorimeter Array?",
            options: [
                "10^-3",
                "10^-4",
                "10^-6",
                "10^-8"
            ],
            correctAnswer: 2,
            explanation: "The required energy resolution ΔE must be smaller than the peak separation, which is roughly the neutrino mass scale (0.05 eV). At an endpoint energy of 18.6 keV, ΔE/E ≈ 0.05 eV / 18,600 eV ≈ 2.6 x 10^-6, putting it firmly in the 10^-6 regime."
        },
        {
            question: "The relic neutrino temperature today is theoretically derived to be lower than the Cosmic Microwave Background (CMB) temperature (T_γ ≈ 2.73 K). What is the theoretical present-day temperature of the CνB, and what specific cosmological event caused this temperature difference?",
            options: [
                "1.95 K; Because photons were reheated by electron-positron annihilation shortly after neutrinos decoupled.",
                "2.73 K; They are exactly the same temperature as they are in thermal equilibrium.",
                "3.14 K; Neutrinos decoupled earlier and retained more of the primordial plasma's heat.",
                "0.10 K; Neutrinos undergo severe adiabatic cooling due to their non-zero mass as the universe expands."
            ],
            correctAnswer: 0,
            explanation: "Neutrinos decoupled from the thermal bath at T ~ 1 MeV. Later, when the temperature dropped below the electron mass (T ~ 0.5 MeV), electrons and positrons annihilated, transferring their entropy entirely to the photon bath (the CMB), heating it relative to the already decoupled neutrinos by a factor of (11/4)^(1/3). This gives T_v ≈ 1.95 K."
        },
        {
            question: "The Transition Edge Sensors (TES) in the calorimeter array are limited by fundamental thermodynamic fluctuations. What type of noise fundamentally dictates the energy resolution of a TES operating at a critical temperature T with heat capacity C?",
            options: [
                "Johnson-Nyquist (Thermal) voltage noise from the readout leads.",
                "Shot noise from the quantized electron tunneling across the SQUID junction.",
                "Thermodynamic phonon noise (energy fluctuation noise), scaling as ΔE ∝ √(k_B * T^2 * C).",
                "1/f flicker noise originating from surface defects on the absorber."
            ],
            correctAnswer: 2,
            explanation: "While all those noises exist, the fundamental theoretical limit for a microcalorimeter measuring heat pulses is the thermodynamic fluctuation of energy across the weak thermal link to the heat bath, commonly known as phonon noise. The rms energy fluctuation is ΔE = √(k_B * T^2 * C)."
        },
        {
            question: "Because relic neutrinos have a small but non-zero mass (e.g., 0.05 eV), they are non-relativistic today. How does gravitational clustering in the Milky Way halo affect the local number density of relic neutrinos at Earth, compared to the average cosmological density of ~56 cm^-3 per flavor?",
            options: [
                "It causes a massive local overdensity factor of 10^6, making detection trivial.",
                "It depletes local neutrinos, resulting in an underdensity factor of 0.1 due to dark matter scattering.",
                "It causes a modest overdensity enhancement factor roughly between 1.2 and 2.0 for very light neutrino masses.",
                "It has absolutely zero effect; neutrinos only interact via the weak force, not gravitationally."
            ],
            correctAnswer: 2,
            explanation: "Neutrinos with mass ~0.05 eV are captured by the gravitational potential well of the Milky Way, but due to their high thermal velocities relative to the escape velocity, the clustering is quite weak. Simulations show the local overdensity factor is on the order of 1.2 to 2 for such light masses."
        }
    ];

    // --- ANIMATION LOGIC ---
    let time = 0;
    
    function animate(delta, speed, meshes) {
        time += delta * speed;
        
        // 1. Slow, ominous rotation of the massive inner cryostat and core
        if(meshes["Central Tritium Target Mass"]) {
            meshes["Central Tritium Target Mass"].rotation.y = time * 0.1;
            meshes["Inner Cryogenic Shielding"].rotation.y = -time * 0.05;
        }

        // 2. Pulsating data fibers (DAQ)
        if(meshes["Photonic Data Acquisition Lines"]) {
            meshes["Photonic Data Acquisition Lines"].children.forEach((fiber, i) => {
                const mat = fiber.material;
                mat.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 5 + i);
            });
        }

        // 3. Hydraulic Damper Active Feedback
        if(meshes["Active Hydraulic Dampers"]) {
            meshes["Active Hydraulic Dampers"].children.forEach((damperGroup, i) => {
                // The piston is the second child
                const piston = damperGroup.children[1];
                piston.position.y = 2 + 0.2 * Math.sin(time * 2 + i * Math.PI/2) + 0.1 * Math.cos(time * 7);
            });
        }

        // 4. Console Screens Flicker
        if(meshes["Cryogenics and DAQ Operator Console"]) {
            const screens = meshes["Cryogenics and DAQ Operator Console"].children.slice(0, 3);
            screens.forEach((screen, i) => {
                screen.material.emissiveIntensity = 0.7 + 0.3 * Math.random();
            });
        }

        // 5. Muon Veto PMT Blinks
        if(meshes["Active Muon Veto System"]) {
            meshes["Active Muon Veto System"].children.forEach((panel, i) => {
                // Occasional cosmic ray strike simulation
                if(Math.random() < 0.01 * speed) {
                    panel.material.color.setHex(0x00ff00);
                    setTimeout(() => panel.material.color.setHex(0xffffff), 100);
                }
            });
        }

        // 6. Quantum Capture Event Topology Matrix Animation
        if(meshes["Quantum Capture Event Topology Matrix"]) {
            meshes["Quantum Capture Event Topology Matrix"].rotation.y = time * 0.1; // Sync with core
            meshes["Quantum Capture Event Topology Matrix"].children.forEach((node) => {
                const data = node.userData;
                const scale = data.baseScale * (1 + 0.5 * Math.sin(time * 10 * data.speed + data.phase));
                node.scale.set(scale, scale, scale);
                
                // Extremely rare, intense flash representing a captured relic neutrino!
                if(Math.random() < 0.0001 * speed) {
                    node.material.color.setHex(0xffffff);
                    node.material.emissiveIntensity = 5.0;
                    node.scale.set(5,5,5);
                    setTimeout(() => {
                        node.material.color.setHex(0x0088ff);
                        node.material.emissiveIntensity = 0.8;
                    }, 200);
                }
            });
        }
        
        // 7. Calibration Arm Sweep
        if(meshes["Krypton-83m Calibration Deployer"]) {
            meshes["Krypton-83m Calibration Deployer"].rotation.y = Math.sin(time * 0.2) * (Math.PI / 8);
        }
    }

    return {
        group,
        parts,
        description: "The Ultra God Tier Relict Neutrino Observatory is an insanely sensitive, ultra-cryogenic macroscopic quantum sensor. It is engineered to detect the unimaginably faint Cosmic Neutrino Background left over from the Big Bang, just 1 second after the singularity. Combining sub-milliKelvin cryogenics, hundreds of Transition Edge Sensors, fractal atomic lattice geometries, and active seismic isolation, it represents the absolute pinnacle of human engineering and fundamental physics research.",
        quizQuestions,
        animate
    };
}
