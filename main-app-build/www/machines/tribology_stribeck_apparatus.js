import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x22ff22, emissive: 0x22ff22, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8 });
    const oilMaterial = new THREE.MeshPhysicalMaterial({ color: 0xcca300, transmission: 0.8, opacity: 0.9, transparent: true, roughness: 0.05, metalness: 0.1, clearcoat: 1.0 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x002244, emissiveIntensity: 1, roughness: 0.1 });

    // Helper functions for complex geometries
    function createBolt(x, y, z) {
        const boltGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 6);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(x, y, z);
        bolt.rotation.x = Math.PI / 2;
        return bolt;
    }

    function createCoolingFins(radius, height, numFins, yOffset) {
        const finGroup = new THREE.Group();
        for(let i=0; i<numFins; i++) {
            const finGeo = new THREE.TorusGeometry(radius, 0.05, 16, 64);
            const fin = new THREE.Mesh(finGeo, darkSteel);
            fin.rotation.x = Math.PI / 2;
            fin.position.y = yOffset + (i * height / numFins);
            finGroup.add(fin);
        }
        return finGroup;
    }

    // 1. Vibration Isolation Base
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(6, 0.4, 4);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseGroup.add(baseMesh);
    
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const padGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 32);
            const pad = new THREE.Mesh(padGeo, rubber);
            pad.position.set(i * 2.8, -0.3, j * 1.8);
            baseGroup.add(pad);
        }
    }
    
    // Add lattice structure to base
    for (let i = -2.5; i <= 2.5; i += 0.5) {
        const strutGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.8, 8);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.rotation.x = Math.PI / 2;
        strut.position.set(i, 0.2, 0);
        baseGroup.add(strut);
    }
    
    parts.push({
        name: "Vibration Isolation Base",
        description: "Heavy-duty foundation equipped with pneumatic rubber dampeners to isolate the sensitive tribological measurements from external floor vibrations.",
        material: "Dark Steel and Rubber",
        function: "Provides a rigid, decoupled platform for high-precision friction and wear testing.",
        assemblyOrder: 1,
        connections: ["Main Frame", "Floor"],
        failureEffect: "External vibrations introduce noise into the friction data.",
        cascadeFailures: ["Friction Sensor Overload", "Inaccurate Stribeck Curve"],
        originalPosition: {x: 0, y: 0.3, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });
    baseGroup.position.set(0, 0.3, 0);
    group.add(baseGroup);
    meshes.baseGroup = baseGroup;

    // 2. Main Frame & Girders
    const frameGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
    
    const p1 = new THREE.Mesh(pillarGeo, steel); p1.position.set(-2.5, 2, -1.5);
    const p2 = new THREE.Mesh(pillarGeo, steel); p2.position.set(2.5, 2, -1.5);
    const p3 = new THREE.Mesh(pillarGeo, steel); p3.position.set(-2.5, 2, 1.5);
    const p4 = new THREE.Mesh(pillarGeo, steel); p4.position.set(2.5, 2, 1.5);
    
    frameGroup.add(p1, p2, p3, p4);

    const crossBeamGeo = new THREE.BoxGeometry(5.3, 0.2, 0.2);
    const cb1 = new THREE.Mesh(crossBeamGeo, steel); cb1.position.set(0, 3.9, -1.5);
    const cb2 = new THREE.Mesh(crossBeamGeo, steel); cb2.position.set(0, 3.9, 1.5);
    
    const sideBeamGeo = new THREE.BoxGeometry(0.2, 0.2, 3.3);
    const sb1 = new THREE.Mesh(sideBeamGeo, steel); sb1.position.set(-2.5, 3.9, 0);
    const sb2 = new THREE.Mesh(sideBeamGeo, steel); sb2.position.set(2.5, 3.9, 0);
    
    frameGroup.add(cb1, cb2, sb1, sb2);

    parts.push({
        name: "Main Support Frame",
        description: "Rigid steel girder assembly providing structural integrity for the load application system and test chamber.",
        material: "Stainless Steel",
        function: "Supports the upper loading mechanism and maintains precise alignment between the rotating and stationary specimens.",
        assemblyOrder: 2,
        connections: ["Vibration Isolation Base", "Loading Mechanism", "Test Chamber"],
        failureEffect: "Misalignment of tribo-pairs, leading to uneven wear and invalid contact pressure.",
        cascadeFailures: ["Catastrophic Sample Failure", "Load Cell Damage"],
        originalPosition: {x: 0, y: 0.3, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });
    group.add(frameGroup);
    meshes.frameGroup = frameGroup;

    // 3. High-Torque Servo Motor
    const motorGroup = new THREE.Group();
    const motorBodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8, 32);
    const motorBody = new THREE.Mesh(motorBodyGeo, aluminum);
    motorBody.rotation.z = Math.PI / 2;
    motorGroup.add(motorBody);
    
    motorGroup.add(createCoolingFins(0.65, 1.6, 20, -0.8).rotateZ(-Math.PI/2));
    
    const motorEndGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const motorEnd = new THREE.Mesh(motorEndGeo, darkSteel);
    motorEnd.rotation.z = Math.PI / 2;
    motorEnd.position.x = 1.0;
    motorGroup.add(motorEnd);
    
    const powerCableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0.5, 0),
        new THREE.Vector3(-0.5, 1.5, -0.5),
        new THREE.Vector3(-1.5, 2.0, -1.0)
    ]), 20, 0.05, 8, false);
    const powerCable = new THREE.Mesh(powerCableGeo, copper);
    motorGroup.add(powerCable);

    parts.push({
        name: "High-Torque Servo Motor",
        description: "Precision servo motor capable of extreme speed sweeps from 0.1 to 10,000 RPM to traverse the entire Stribeck curve.",
        material: "Aluminum, Copper, Dark Steel",
        function: "Drives the lower specimen with highly accurate rotational velocity and torque feedback.",
        assemblyOrder: 3,
        connections: ["Drive Shaft", "Motor Controller"],
        failureEffect: "Inability to maintain steady sliding velocity.",
        cascadeFailures: ["Frictional Heating Variations", "Hydrodynamic Film Collapse"],
        originalPosition: {x: -1, y: 1.5, z: 0},
        explodedPosition: {x: -4, y: 1.5, z: 0}
    });
    motorGroup.position.set(-1, 1.5, 0);
    group.add(motorGroup);
    meshes.motorGroup = motorGroup;

    // 4. Drive Shaft and Couplings
    const driveShaftGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32);
    const shaft = new THREE.Mesh(shaftGeo, chrome);
    shaft.rotation.z = Math.PI / 2;
    driveShaftGroup.add(shaft);
    
    const couplingGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
    const coupling1 = new THREE.Mesh(couplingGeo, steel);
    coupling1.rotation.z = Math.PI / 2;
    coupling1.position.x = -0.6;
    const coupling2 = new THREE.Mesh(couplingGeo, steel);
    coupling2.rotation.z = Math.PI / 2;
    coupling2.position.x = 0.6;
    driveShaftGroup.add(coupling1, coupling2);
    
    parts.push({
        name: "Drive Shaft & Couplings",
        description: "Zero-backlash flexible couplings and hardened chrome shaft transferring rotary motion to the test chamber.",
        material: "Chrome and Steel",
        function: "Transmits torque from the servo motor to the test disc while minimizing torsional vibrations.",
        assemblyOrder: 4,
        connections: ["Servo Motor", "Test Disc Assembly"],
        failureEffect: "Torsional resonance and angular velocity fluctuations.",
        cascadeFailures: ["Mixed Lubrication Instability", "False Friction Peaks"],
        originalPosition: {x: 0.5, y: 1.5, z: 0},
        explodedPosition: {x: 0.5, y: 1.5, z: 2}
    });
    driveShaftGroup.position.set(0.5, 1.5, 0);
    group.add(driveShaftGroup);
    meshes.driveShaftGroup = driveShaftGroup;

    // 5. Gearbox / Angular Transmission
    const gearboxGroup = new THREE.Group();
    const gbBoxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const gbBox = new THREE.Mesh(gbBoxGeo, darkSteel);
    gearboxGroup.add(gbBox);
    
    const gbVerticalShaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 32);
    const gbVerticalShaft = new THREE.Mesh(gbVerticalShaftGeo, chrome);
    gbVerticalShaft.position.y = 0.5;
    gearboxGroup.add(gbVerticalShaft);
    
    parts.push({
        name: "Bevel Gearbox Transmission",
        description: "High-precision 90-degree bevel gearbox translating horizontal motor rotation to vertical spindle rotation.",
        material: "Dark Steel, Chrome",
        function: "Changes axis of rotation to drive the lower disc specimen vertically.",
        assemblyOrder: 5,
        connections: ["Drive Shaft", "Lower Spindle"],
        failureEffect: "Gear backlash causing jerky rotation.",
        cascadeFailures: ["Lubricant Film Rupture", "Spindle Bearing Wear"],
        originalPosition: {x: 1.5, y: 1.5, z: 0},
        explodedPosition: {x: 3, y: 1.5, z: -2}
    });
    gearboxGroup.position.set(1.5, 1.5, 0);
    group.add(gearboxGroup);
    meshes.gearboxGroup = gearboxGroup;
    meshes.gbVerticalShaft = gbVerticalShaft;

    // 6. Test Chamber (Environmental Housing)
    const chamberGroup = new THREE.Group();
    const chamberBaseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const chamberBase = new THREE.Mesh(chamberBaseGeo, aluminum);
    chamberGroup.add(chamberBase);
    
    const chamberGlassGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.5, 32, 1, true);
    const chamberGlass = new THREE.Mesh(chamberGlassGeo, tinted);
    chamberGlass.position.y = 0.85;
    chamberGroup.add(chamberGlass);
    
    const chamberLidGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const chamberLid = new THREE.Mesh(chamberLidGeo, aluminum);
    chamberLid.position.y = 1.7;
    chamberGroup.add(chamberLid);
    
    // Test Chamber details (bolts)
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const bolt = createBolt(Math.cos(angle)*1.05, 1.8, Math.sin(angle)*1.05);
        chamberGroup.add(bolt);
    }
    
    parts.push({
        name: "Environmental Test Chamber",
        description: "Sealed chamber with tinted borosilicate glass allowing for controlled atmosphere, temperature regulation, and oil containment.",
        material: "Aluminum, Tinted Glass",
        function: "Isolates the contact zone, captures splashed lubricant, and allows for inert gas purging.",
        assemblyOrder: 6,
        connections: ["Lower Spindle", "Upper Specimen Holder", "Oil Circulation"],
        failureEffect: "Loss of environmental control, oxidation of lubricant.",
        cascadeFailures: ["Contaminated Contact Zone", "False Wear Rates"],
        originalPosition: {x: 1.5, y: 2.2, z: 0},
        explodedPosition: {x: 1.5, y: 2.2, z: 4}
    });
    chamberGroup.position.set(1.5, 2.2, 0);
    group.add(chamberGroup);
    meshes.chamberGroup = chamberGroup;

    // 7. Lower Specimen (Disc)
    const discGroup = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 64);
    const disc = new THREE.Mesh(discGeo, steel);
    discGroup.add(disc);
    
    // Add wear track visual
    const wearTrackGeo = new THREE.RingGeometry(0.35, 0.45, 64);
    const wearTrackMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9, metalness: 0.2 });
    const wearTrack = new THREE.Mesh(wearTrackGeo, wearTrackMat);
    wearTrack.rotation.x = -Math.PI / 2;
    wearTrack.position.y = 0.026;
    discGroup.add(wearTrack);

    parts.push({
        name: "Lower Specimen (Test Disc)",
        description: "Standardized polished steel disc serving as the rotational counter-surface in the tribological pair.",
        material: "Steel (Hardened)",
        function: "Rotates at variable speeds to drag lubricant into the contact wedge, driving hydrodynamic lift.",
        assemblyOrder: 7,
        connections: ["Gearbox Vertical Shaft"],
        failureEffect: "Surface scoring and catastrophic adhesive wear.",
        cascadeFailures: ["Seizure of Test Rig", "Upper Pin Destruction"],
        originalPosition: {x: 1.5, y: 2.4, z: 0},
        explodedPosition: {x: 5, y: 2.4, z: 0}
    });
    discGroup.position.set(1.5, 2.4, 0);
    group.add(discGroup);
    meshes.discGroup = discGroup;

    // 8. Upper Specimen (Pin/Ball) and Holder
    const upperSpecimenGroup = new THREE.Group();
    const holderGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
    const holder = new THREE.Mesh(holderGeo, steel);
    holder.position.y = 0.25;
    upperSpecimenGroup.add(holder);
    
    const pinGeo = new THREE.SphereGeometry(0.05, 32, 32);
    const pin = new THREE.Mesh(pinGeo, chrome);
    pin.position.y = -0.025;
    upperSpecimenGroup.add(pin);
    
    parts.push({
        name: "Upper Specimen (Ball/Pin)",
        description: "Stationary spherical or flat-ended pin that presses against the rotating disc.",
        material: "Chrome Steel",
        function: "Forms the highly loaded non-conformal contact to evaluate boundary and mixed lubrication.",
        assemblyOrder: 8,
        connections: ["Loading Mechanism", "Test Disc"],
        failureEffect: "Plastic deformation of the pin tip.",
        cascadeFailures: ["Transition to Severe Wear", "Friction Spike"],
        originalPosition: {x: 1.1, y: 2.45, z: 0},
        explodedPosition: {x: -2, y: 3, z: 0}
    });
    upperSpecimenGroup.position.set(1.1, 2.45, 0);
    group.add(upperSpecimenGroup);
    meshes.upperSpecimenGroup = upperSpecimenGroup;

    // 9. Load Application Mechanism (Pneumatic/Hydraulic)
    const loadGroup = new THREE.Group();
    
    // Vertical pneumatic cylinder
    const cylOuterGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 32);
    const cylOuter = new THREE.Mesh(cylOuterGeo, aluminum);
    cylOuter.position.y = 3.5;
    cylOuter.position.x = 1.1;
    loadGroup.add(cylOuter);
    
    const pistonGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 16);
    const piston = new THREE.Mesh(pistonGeo, chrome);
    piston.position.y = 3.0;
    piston.position.x = 1.1;
    loadGroup.add(piston);

    // Load Cell (Glowing sensor)
    const loadCellGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
    const loadCell = new THREE.Mesh(loadCellGeo, neonRed);
    loadCell.position.y = 2.75;
    loadCell.position.x = 1.1;
    loadGroup.add(loadCell);

    parts.push({
        name: "Pneumatic Loading System & Load Cell",
        description: "Feedback-controlled pneumatic cylinder applying precise normal forces ranging from 1N to 1000N.",
        material: "Aluminum, Chrome, Electronics",
        function: "Applies the normal load (W) to the tribo-contact and measures the exact applied force dynamically.",
        assemblyOrder: 9,
        connections: ["Main Frame", "Upper Specimen"],
        failureEffect: "Load fluctuations resulting in erratic film thickness.",
        cascadeFailures: ["Unstable Friction Coefficient", "Specimen Cracking"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 1.1, y: 6, z: 0}
    });
    group.add(loadGroup);
    meshes.loadGroup = loadGroup;
    meshes.piston = piston;

    // 10. Friction Force Sensor (Cantilever Beam)
    const frictionSensorGroup = new THREE.Group();
    const beamGeo = new THREE.BoxGeometry(0.8, 0.05, 0.1);
    const beam = new THREE.Mesh(beamGeo, steel);
    beam.position.set(0.6, 2.6, 0);
    frictionSensorGroup.add(beam);
    
    const strainGaugeGeo = new THREE.BoxGeometry(0.1, 0.06, 0.11);
    const strainGauge = new THREE.Mesh(strainGaugeGeo, neonGreen);
    strainGauge.position.set(0.4, 2.6, 0);
    frictionSensorGroup.add(strainGauge);
    
    parts.push({
        name: "Lateral Friction Sensor",
        description: "High-stiffness cantilever beam outfitted with micro-strain gauges emitting green telemetry.",
        material: "Steel, Silicon (Strain Gauges)",
        function: "Detects the minute tangential forces (F) generated by the sliding contact to calculate the friction coefficient (μ = F/W).",
        assemblyOrder: 10,
        connections: ["Upper Specimen Holder", "Data Acquisition System"],
        failureEffect: "Thermal drift in strain gauges causing baseline shift.",
        cascadeFailures: ["Negative Friction Readings", "Data Invalidation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 2.6, z: -3}
    });
    group.add(frictionSensorGroup);
    meshes.frictionSensorGroup = frictionSensorGroup;

    // 11. Oil Circulation and Heating System
    const oilSystemGroup = new THREE.Group();
    
    // Oil Reservoir
    const reservoirGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32);
    const reservoir = new THREE.Mesh(reservoirGeo, glass);
    reservoir.position.set(-1.5, 1.0, 1.5);
    oilSystemGroup.add(reservoir);
    
    // Oil inside reservoir
    const fluidGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.7, 32);
    const fluid = new THREE.Mesh(fluidGeo, oilMaterial);
    fluid.position.set(-1.5, 1.0, 1.5);
    oilSystemGroup.add(fluid);
    
    // Heater Element
    const heaterGeo = new THREE.TorusGeometry(0.3, 0.03, 16, 32);
    const heater = new THREE.Mesh(heaterGeo, neonRed);
    heater.rotation.x = Math.PI/2;
    heater.position.set(-1.5, 0.7, 1.5);
    oilSystemGroup.add(heater);
    
    // Pump
    const pumpGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const pump = new THREE.Mesh(pumpGeo, darkSteel);
    pump.position.set(-0.8, 0.8, 1.5);
    oilSystemGroup.add(pump);
    
    // Tubing
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 2.5 - 0.8;
            const ty = Math.sin(t * Math.PI) * 1.5 + 0.8;
            const tz = 1.5 - t * 2.0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new CustomSinCurve(1);
    const tubeGeo = new THREE.TubeGeometry(path, 64, 0.04, 8, false);
    const tube = new THREE.Mesh(tubeGeo, plastic);
    oilSystemGroup.add(tube);
    
    // Oil Jet inside chamber
    const jetGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.2, 16);
    const jet = new THREE.Mesh(jetGeo, chrome);
    jet.position.set(1.6, 2.5, -0.4);
    jet.rotation.x = Math.PI / 4;
    jet.rotation.z = Math.PI / 4;
    oilSystemGroup.add(jet);
    
    parts.push({
        name: "Oil Circulation & Thermal Control",
        description: "Recirculating tribology fluid system featuring a 500W immersion heater, micro-gear pump, and precision jet nozzle.",
        material: "Glass, Dark Steel, Plastic, Heating Elements",
        function: "Maintains a constant supply of temperature-controlled lubricant to the contact zone, crucial for stable viscosity.",
        assemblyOrder: 11,
        connections: ["Test Chamber", "Pump"],
        failureEffect: "Oil starvation or thermal runaway.",
        cascadeFailures: ["Viscosity Drop", "Immediate Boundary Seizure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -3, y: 0, z: 3}
    });
    group.add(oilSystemGroup);
    meshes.oilSystemGroup = oilSystemGroup;
    meshes.fluid = fluid;

    // 12. Dynamic Oil Splatter/Film Visualization
    const oilFilmGroup = new THREE.Group();
    const filmGeo = new THREE.RingGeometry(0.34, 0.46, 64);
    const dynamicOilMat = new THREE.MeshPhysicalMaterial({ color: 0xffff00, transmission: 0.9, opacity: 0.7, transparent: true, roughness: 0.1 });
    const filmMesh = new THREE.Mesh(filmGeo, dynamicOilMat);
    filmMesh.rotation.x = -Math.PI / 2;
    filmMesh.position.set(1.5, 2.43, 0); // slightly above disc
    oilFilmGroup.add(filmMesh);
    
    parts.push({
        name: "Hydrodynamic Fluid Film",
        description: "The elusive wedge of pressurized lubricant separating the microscopic asperities of the two surfaces.",
        material: "Synthetic Oil (Visualized)",
        function: "Generates hydrodynamic lift via the Reynolds equation to completely separate surfaces at high speeds.",
        assemblyOrder: 12,
        connections: ["Lower Disc", "Upper Pin"],
        failureEffect: "Film collapse under extreme load or low speed.",
        cascadeFailures: ["Asperity Contact", "Abrasive Wear Particle Generation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 1.5, y: 3.5, z: 2}
    });
    group.add(oilFilmGroup);
    meshes.filmMesh = filmMesh;

    // 13. Data Acquisition (DAQ) and Control Rack
    const daqGroup = new THREE.Group();
    const rackGeo = new THREE.BoxGeometry(1.5, 3.5, 1.5);
    const rack = new THREE.Mesh(rackGeo, darkSteel);
    rack.position.set(-2.5, 1.75, 2.5);
    daqGroup.add(rack);
    
    // Screens
    const screenGeo = new THREE.PlaneGeometry(1.2, 0.8);
    const screen1 = new THREE.Mesh(screenGeo, screenMat);
    screen1.position.set(-1.74, 2.8, 2.5);
    screen1.rotation.y = Math.PI / 2;
    daqGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo, screenMat);
    screen2.position.set(-1.74, 1.8, 2.5);
    screen2.rotation.y = Math.PI / 2;
    daqGroup.add(screen2);
    
    // Blinking LEDs
    for(let i=0; i<5; i++) {
        const ledGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const led = new THREE.Mesh(ledGeo, neonBlue);
        led.position.set(-1.74, 1.2, 2.0 + (i*0.2));
        daqGroup.add(led);
    }
    
    parts.push({
        name: "Telemetry & DAQ Supercomputer",
        description: "High-frequency data acquisition rack processing strain gauge, encoder, and thermocouple signals at 50 kHz.",
        material: "Steel, Silicon, Glass",
        function: "Computes the Stribeck curve in real-time, plotting Coefficient of Friction vs. Hersey Number.",
        assemblyOrder: 13,
        connections: ["Friction Sensor", "Load Cell", "Servo Motor"],
        failureEffect: "Signal aliasing and data corruption.",
        cascadeFailures: ["Loss of Test Data", "Control Loop Instability"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -3, y: 0, z: 5}
    });
    group.add(daqGroup);
    meshes.daqGroup = daqGroup;
    meshes.screen1 = screen1;
    meshes.screen2 = screen2;

    // 14. High-Speed Optical Microscope
    const microscopeGroup = new THREE.Group();
    const scopeBodyGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
    const scopeBody = new THREE.Mesh(scopeBodyGeo, aluminum);
    scopeBody.rotation.x = Math.PI / 4;
    scopeBody.position.set(1.5, 2.8, 0.8);
    microscopeGroup.add(scopeBody);
    
    const lensGeo = new THREE.CylinderGeometry(0.12, 0.05, 0.2, 16);
    const lens = new THREE.Mesh(lensGeo, chrome);
    lens.rotation.x = Math.PI / 4;
    lens.position.set(1.5, 2.55, 0.55);
    microscopeGroup.add(lens);
    
    const cameraGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const camera = new THREE.Mesh(cameraGeo, darkSteel);
    camera.position.set(1.5, 3.05, 1.05);
    camera.rotation.x = Math.PI / 4;
    microscopeGroup.add(camera);
    
    parts.push({
        name: "In-Situ Optical Microscope",
        description: "High-speed camera array paired with a long-working-distance objective lens for viewing cavitation and wear particles.",
        material: "Aluminum, Optics, Chrome",
        function: "Provides real-time visual confirmation of boundary layer breakdown and hydrodynamic film formation.",
        assemblyOrder: 14,
        connections: ["Test Chamber", "DAQ System"],
        failureEffect: "Lens obscured by oil splashing.",
        cascadeFailures: ["Loss of Visual Telemetry"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 1.5, y: 5, z: 3}
    });
    group.add(microscopeGroup);
    meshes.microscopeGroup = microscopeGroup;

    // 15. Exhaust / Vapour Extraction
    const extractionGroup = new THREE.Group();
    const hoodGeo = new THREE.ConeGeometry(0.4, 0.4, 32, 1, true);
    const hood = new THREE.Mesh(hoodGeo, aluminum);
    hood.position.set(1.5, 3.8, 0);
    extractionGroup.add(hood);
    
    const ductGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.5, 4.0, 0),
        new THREE.Vector3(1.5, 5.0, 0),
        new THREE.Vector3(3.0, 5.0, -1.0),
        new THREE.Vector3(3.0, -0.5, -1.0)
    ]), 64, 0.15, 16, false);
    const duct = new THREE.Mesh(ductGeo, plastic);
    extractionGroup.add(duct);
    
    parts.push({
        name: "Vapor Extraction System",
        description: "HEPA and activated carbon filtration duct system.",
        material: "Aluminum, Plastic",
        function: "Removes toxic oil mists and volatile organic compounds generated by extreme frictional heating.",
        assemblyOrder: 15,
        connections: ["Test Chamber Lid", "Facility Exhaust"],
        failureEffect: "Accumulation of explosive oil vapors.",
        cascadeFailures: ["Laboratory Fire", "Operator Asphyxiation"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 4, y: 4, z: -4}
    });
    group.add(extractionGroup);
    meshes.extractionGroup = extractionGroup;

    // Quiz Questions
    const quizQuestions = [
        {
            question: "Which lubrication regime is characterized by extensive asperity contact and high friction, typically occurring at startup or very low speeds?",
            options: ["Hydrodynamic Lubrication", "Elastohydrodynamic Lubrication", "Boundary Lubrication", "Mixed Lubrication"],
            correctAnswer: 2,
            explanation: "Boundary lubrication occurs when the fluid film is almost completely penetrated, leading to significant metal-to-metal (asperity) contact and a high coefficient of friction."
        },
        {
            question: "What parameter does the Stribeck curve plot the coefficient of friction against?",
            options: ["Temperature / Pressure", "Viscosity × Velocity / Normal Load", "Normal Load × Velocity / Viscosity", "Hardness / Elastic Modulus"],
            correctAnswer: 1,
            explanation: "The Stribeck curve typically plots the friction coefficient against the Hersey number, which is dynamic viscosity multiplied by sliding velocity, divided by normal load."
        },
        {
            question: "In the hydrodynamic lubrication regime, what physically separates the two sliding surfaces?",
            options: ["A self-assembled monolayer of additives", "Magnetic repulsion forces", "A thick, pressurized fluid film generated by the wedge effect", "Electrostatic double layers"],
            correctAnswer: 2,
            explanation: "Hydrodynamic lubrication is achieved when the relative motion of the surfaces drags viscous fluid into a converging gap, generating sufficient pressure to completely separate the surfaces."
        },
        {
            question: "Why is temperature control crucial in a tribometer testing liquid lubricants?",
            options: ["To prevent the steel specimens from melting", "Because viscosity is highly temperature-dependent, altering the Hersey number", "To keep the strain gauges from freezing", "To increase the hardness of the test disc"],
            correctAnswer: 1,
            explanation: "The viscosity of oil drops exponentially with increasing temperature. Since viscosity dictates fluid film thickness, temperature variations will artificially shift the lubrication regime."
        },
        {
            question: "What is the primary function of the cantilever beam with strain gauges in this apparatus?",
            options: ["To apply the normal load W", "To measure the tangential friction force F", "To calculate rotational velocity", "To monitor fluid temperature"],
            correctAnswer: 1,
            explanation: "The cantilever beam deflects elastically in response to the dragging force (friction) between the pin and disc. The strain gauges convert this microscopic deflection into an electrical signal representing force F."
        }
    ];

    function animate(time, speed, meshesObj) {
        const t = time * speed;
        const sweepPhase = (Math.sin(t * 0.2) + 1) / 2;
        const currentRpm = 10 + Math.pow(sweepPhase, 2) * 990; 
        const angularVelocity = currentRpm * 0.1;
        
        if(meshesObj.motorGroup) meshesObj.motorGroup.children[0].rotation.x = t * angularVelocity;
        if(meshesObj.driveShaftGroup) {
            meshesObj.driveShaftGroup.children.forEach(child => child.rotation.x = t * angularVelocity);
        }
        if(meshesObj.gbVerticalShaft) meshesObj.gbVerticalShaft.rotation.y = t * angularVelocity;
        if(meshesObj.discGroup) meshesObj.discGroup.rotation.y = t * angularVelocity;
        
        if(meshesObj.filmMesh && meshesObj.upperSpecimenGroup && meshesObj.frictionSensorGroup) {
            if(sweepPhase < 0.1) {
                meshesObj.filmMesh.material.color.setHex(0xff3300);
                meshesObj.filmMesh.material.opacity = 0.2;
                meshesObj.frictionSensorGroup.rotation.z = Math.sin(t * 50) * 0.05 + 0.1;
                meshesObj.upperSpecimenGroup.position.y = 2.41;
            } else if (sweepPhase < 0.4) {
                meshesObj.filmMesh.material.color.setHex(0xffff00);
                meshesObj.filmMesh.material.opacity = 0.5;
                meshesObj.frictionSensorGroup.rotation.z = Math.sin(t * 20) * 0.01 + 0.02;
                meshesObj.upperSpecimenGroup.position.y = 2.42 + (sweepPhase - 0.1) * 0.05;
            } else {
                meshesObj.filmMesh.material.color.setHex(0x00ffff);
                meshesObj.filmMesh.material.opacity = 0.9;
                meshesObj.frictionSensorGroup.rotation.z = 0.005;
                meshesObj.upperSpecimenGroup.position.y = 2.44;
            }
        }
        
        if(meshesObj.screen1) meshesObj.screen1.material.emissiveIntensity = 0.5 + Math.random() * 0.5;
        if(meshesObj.screen2) {
            const r = sweepPhase < 0.1 ? 255 : (sweepPhase < 0.4 ? 200 : 0);
            const g = sweepPhase < 0.1 ? 0 : (sweepPhase < 0.4 ? 200 : 255);
            const b = sweepPhase > 0.4 ? 255 : 0;
            meshesObj.screen2.material.emissive.setRGB(r/255, g/255, b/255);
        }
        
        if(meshesObj.piston) {
            meshesObj.piston.position.y = 3.0 + Math.sin(t * 2) * 0.01;
        }
    }

    return {
        group,
        parts,
        description: "An ultra-high-precision Stribeck Apparatus (Tribometer). This massive testing rig is designed to measure the coefficient of friction between a pin and a rotating disc under flooded oil conditions. By sweeping the rotational velocity, it demonstrates the full transition through Boundary, Mixed, and Hydrodynamic lubrication regimes, visualizing fluid film formation and friction dynamics.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}

// Auto-generated missing stub
export function createStribeckApparatus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
