import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Emissive Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x002244, emissiveIntensity: 1.0, roughness: 0.1 });
    const transparentGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, transmission: 0.9, roughness: 0.1, ior: 1.5 });
    
    // Add 15+ Parts

    // 1. Base Housing
    // Use an extruded shape for a high-tech sleek base
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-10, -8);
    baseShape.lineTo(10, -8);
    baseShape.lineTo(12, -6);
    baseShape.lineTo(12, 6);
    baseShape.lineTo(10, 8);
    baseShape.lineTo(-10, 8);
    baseShape.lineTo(-12, 6);
    baseShape.lineTo(-12, -6);
    baseShape.lineTo(-10, -8);

    const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    baseGeo.center();
    baseGeo.rotateX(Math.PI / 2);
    
    // Detailed base with vents and grooves
    const baseGroup = new THREE.Group();
    const mainBase = new THREE.Mesh(baseGeo, plastic);
    baseGroup.add(mainBase);

    // Vents on sides
    for(let i=0; i<10; i++) {
        const ventGeo = new THREE.BoxGeometry(0.2, 1, 2);
        const ventL = new THREE.Mesh(ventGeo, darkSteel);
        ventL.position.set(-11.5, 0, -4 + i*0.8);
        baseGroup.add(ventL);
        const ventR = new THREE.Mesh(ventGeo, darkSteel);
        ventR.position.set(11.5, 0, -4 + i*0.8);
        baseGroup.add(ventR);
    }
    
    meshes.base = baseGroup;
    group.add(baseGroup);
    parts.push({
        name: "Main Chassis",
        description: "High-grade polymer chassis housing all diagnostic and mechanical components.",
        material: "plastic",
        function: "Structural support, vibration damping for sensitive microscopic sensors.",
        assemblyOrder: 1,
        connections: ["Centrifuge Assembly", "Pipette Arm Track", "Power Supply"],
        failureEffect: "Structural instability leading to misalignment of optics and mechanical arms.",
        cascadeFailures: ["Optical Sensor Array", "Pipette Arm Track"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Centrifuge Assembly
    // Sunken cylinder in the base
    const centrifugeGroup = new THREE.Group();
    centrifugeGroup.position.set(4, 2, -2);
    
    // Centrifuge Well
    const wellGeo = new THREE.CylinderGeometry(4.5, 4.5, 3, 32, 1, true);
    const wellMesh = new THREE.Mesh(wellGeo, aluminum);
    centrifugeGroup.add(wellMesh);

    // Rotor
    const rotorGroup = new THREE.Group();
    const rotorCoreGeo = new THREE.CylinderGeometry(1.5, 2, 2, 16);
    const rotorCore = new THREE.Mesh(rotorCoreGeo, chrome);
    rotorGroup.add(rotorCore);
    
    const numVials = 12;
    for(let i=0; i<numVials; i++) {
        const angle = (i / numVials) * Math.PI * 2;
        const armGeo = new THREE.BoxGeometry(3, 0.5, 0.5);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.set(Math.cos(angle)*1.5, 0.5, Math.sin(angle)*1.5);
        arm.rotation.y = -angle;
        
        // Vial holder
        const holderGeo = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 16);
        const holder = new THREE.Mesh(holderGeo, darkSteel);
        holder.position.set(Math.cos(angle)*3, 0.5, Math.sin(angle)*3);
        holder.rotation.x = Math.PI / 6; // angled outwards
        holder.rotation.y = -angle;
        
        // Glass vial
        const vialGeo = new THREE.CylinderGeometry(0.3, 0.25, 1.0, 16);
        const vial = new THREE.Mesh(vialGeo, transparentGlass);
        vial.position.set(0, 0.2, 0);
        holder.add(vial);
        
        // Fluid inside vial
        const fluidGeo = new THREE.CylinderGeometry(0.25, 0.2, 0.6, 16);
        const fluid = new THREE.Mesh(fluidGeo, neonGreen);
        fluid.position.set(0, -0.1, 0);
        vial.add(fluid);

        rotorGroup.add(arm);
        rotorGroup.add(holder);
    }
    
    centrifugeGroup.add(rotorGroup);
    meshes.rotor = rotorGroup;

    // Dome
    const domeGeo = new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, transparentGlass);
    dome.position.y = 1.5;
    centrifugeGroup.add(dome);

    group.add(centrifugeGroup);
    parts.push({
        name: "High-Speed Centrifuge Rotor",
        description: "Titanium alloy rotor capable of 30,000 RPM for separating soil components and microbes.",
        material: "chrome",
        function: "Separates dense soil particles from the microbial suspension fluid via centrifugal force.",
        assemblyOrder: 2,
        connections: ["Main Chassis", "Vial Holders", "Centrifuge Motor"],
        failureEffect: "Vibration or complete failure to separate samples.",
        cascadeFailures: ["Vial Holders", "Main Chassis"],
        originalPosition: { x: 4, y: 2, z: -2 },
        explodedPosition: { x: 4, y: 15, z: -2 }
    });

    // 3. Centrifuge Motor (underneath)
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const motor = new THREE.Mesh(motorGeo, darkSteel);
    motor.position.set(4, -1, -2);
    group.add(motor);
    parts.push({
        name: "Centrifuge Magnetic Motor",
        description: "Brushless, magnetic levitation motor providing high torque with zero friction.",
        material: "darkSteel",
        function: "Drives the centrifuge rotor at extremely high speeds with absolute stability.",
        assemblyOrder: 3,
        connections: ["Main Chassis", "Centrifuge Rotor", "Power Supply"],
        failureEffect: "Motor stalling or overheating, aborting the separation process.",
        cascadeFailures: ["Power Supply"],
        originalPosition: { x: 4, y: -1, z: -2 },
        explodedPosition: { x: 4, y: -10, z: -2 }
    });

    // 4. Sample Tray (Micro-well Plates)
    const trayGroup = new THREE.Group();
    trayGroup.position.set(-5, 2.2, 0);

    const plateBaseGeo = new THREE.BoxGeometry(6, 0.4, 8);
    const plateBase = new THREE.Mesh(plateBaseGeo, aluminum);
    trayGroup.add(plateBase);

    // 96-well plate (8x12 grid)
    for(let r=0; r<8; r++) {
        for(let c=0; c<12; c++) {
            const wellG = new THREE.CylinderGeometry(0.2, 0.15, 0.4, 12);
            const wellM = new THREE.Mesh(wellG, plastic);
            wellM.position.set(-2.5 + c*0.45, 0.2, -3 + r*0.85);
            trayGroup.add(wellM);
            
            // tiny sample drop in some wells
            if(Math.random() > 0.3) {
                const dropGeo = new THREE.SphereGeometry(0.12, 8, 8);
                const dropMat = new THREE.MeshStandardMaterial({color: Math.random() > 0.5 ? 0xaa5500 : 0x00ff00, transparent: true, opacity: 0.8});
                const drop = new THREE.Mesh(dropGeo, dropMat);
                drop.position.set(-2.5 + c*0.45, 0.25, -3 + r*0.85);
                trayGroup.add(drop);
            }
        }
    }
    
    group.add(trayGroup);
    meshes.sampleTray = trayGroup;
    parts.push({
        name: "Micro-Well Sample Tray",
        description: "Precision-machined aluminum tray holding 96-well plates for parallel processing.",
        material: "aluminum",
        function: "Holds processed soil extracts for reagent mixing and optical scanning.",
        assemblyOrder: 4,
        connections: ["Main Chassis", "Pipette Arm", "Optical Scanner"],
        failureEffect: "Misalignment causes cross-contamination or missed samples.",
        cascadeFailures: ["Pipette Tips"],
        originalPosition: { x: -5, y: 2.2, z: 0 },
        explodedPosition: { x: -15, y: 5, z: 0 }
    });

    // 5. Automated Pipette Arm Track (X-Axis)
    const trackGroup = new THREE.Group();
    trackGroup.position.set(-5, 2.5, -5);

    const railGeo = new THREE.BoxGeometry(8, 0.5, 0.5);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.z = -1;
    trackGroup.add(rail1);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.z = 1;
    trackGroup.add(rail2);

    group.add(trackGroup);
    parts.push({
        name: "X-Axis Linear Rail",
        description: "Dual magnetic linear rails for high-speed, frictionless lateral movement.",
        material: "steel",
        function: "Guides the pipette gantry across the sample tray columns.",
        assemblyOrder: 5,
        connections: ["Main Chassis", "Y-Axis Gantry"],
        failureEffect: "Jamming or inaccurate positioning along the X-axis.",
        cascadeFailures: ["Y-Axis Gantry", "Pipette Head"],
        originalPosition: { x: -5, y: 2.5, z: -5 },
        explodedPosition: { x: -5, y: 2.5, z: -15 }
    });

    // 6. Y-Axis Gantry
    const gantryGroup = new THREE.Group();
    const gantryBaseGeo = new THREE.BoxGeometry(1.5, 1, 3);
    const gantryBase = new THREE.Mesh(gantryBaseGeo, darkSteel);
    gantryBase.position.set(0, 0.75, 0);
    gantryGroup.add(gantryBase);
    
    const yRailGeo = new THREE.BoxGeometry(0.5, 0.5, 10);
    const yRail = new THREE.Mesh(yRailGeo, chrome);
    yRail.position.set(0, 1, 3.5);
    gantryGroup.add(yRail);
    
    trackGroup.add(gantryGroup);
    meshes.xGantry = gantryGroup;
    parts.push({
        name: "Y-Axis Gantry Track",
        description: "Cantilevered rail extending over the sample tray.",
        material: "chrome",
        function: "Enables forward/backward motion of the pipette head over specific rows.",
        assemblyOrder: 6,
        connections: ["X-Axis Linear Rail", "Z-Axis Actuator Head"],
        failureEffect: "Sagging or snapping of the rail, misaligning pipettes.",
        cascadeFailures: ["Z-Axis Actuator Head", "Pipette Tips"],
        originalPosition: { x: 0, y: 0, z: 0 }, // Relative
        explodedPosition: { x: 0, y: 10, z: -5 }
    });

    // 7. Z-Axis Actuator & Pipette Head
    const headGroup = new THREE.Group();
    const headHousingGeo = new THREE.BoxGeometry(1.2, 2, 1.2);
    const headHousing = new THREE.Mesh(headHousingGeo, plastic);
    headGroup.add(headHousing);
    
    // Z-Axis rods
    const zRodGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const zRod1 = new THREE.Mesh(zRodGeo, steel);
    zRod1.position.set(0.4, 0, 0);
    headGroup.add(zRod1);
    const zRod2 = new THREE.Mesh(zRodGeo, steel);
    zRod2.position.set(-0.4, 0, 0);
    headGroup.add(zRod2);

    gantryGroup.add(headGroup);
    meshes.yGantry = headGroup;

    parts.push({
        name: "Z-Axis Actuator Head",
        description: "Precision micro-stepping motor assembly for vertical control of the pipettes.",
        material: "plastic",
        function: "Lowers and raises pipettes into the micro-wells with nanometer precision.",
        assemblyOrder: 7,
        connections: ["Y-Axis Gantry Track", "Multi-Channel Pipette"],
        failureEffect: "Crashing pipettes into the tray, breaking tips and spilling samples.",
        cascadeFailures: ["Multi-Channel Pipette", "Micro-Well Sample Tray"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // 8. Multi-Channel Pipette
    const pipetteGroup = new THREE.Group();
    const manifoldGeo = new THREE.BoxGeometry(1.0, 0.5, 2.5);
    const manifold = new THREE.Mesh(manifoldGeo, aluminum);
    pipetteGroup.add(manifold);

    // 8 tips
    for(let i=0; i<8; i++) {
        const tipGeo = new THREE.ConeGeometry(0.08, 0.8, 16);
        tipGeo.translate(0, -0.4, 0);
        const tip = new THREE.Mesh(tipGeo, transparentGlass);
        tip.position.set(0, -0.25, -1 + i*0.285);
        pipetteGroup.add(tip);
    }
    
    headGroup.add(pipetteGroup);
    meshes.pipetteHead = pipetteGroup;
    parts.push({
        name: "Multi-Channel Pipette Array",
        description: "8-channel parallel fluid dispensing unit with pneumatic pressure control.",
        material: "aluminum",
        function: "Aspirates and dispenses reagents and samples simultaneously across a row.",
        assemblyOrder: 8,
        connections: ["Z-Axis Actuator Head", "Fluidic Hoses"],
        failureEffect: "Inconsistent dispensing volumes, corrupting microbiome analysis data.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 9. Reagent Reservoir Tanks
    const tanksGroup = new THREE.Group();
    tanksGroup.position.set(-5, 4, 5);
    
    for(let i=0; i<4; i++) {
        const tankBase = new THREE.Group();
        tankBase.position.x = -3 + i*2;

        const tankGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
        const tank = new THREE.Mesh(tankGeo, transparentGlass);
        tankBase.add(tank);

        // Fluid inside
        const fluidGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.5, 32);
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
        const fMat = new THREE.MeshStandardMaterial({color: colors[i], transparent: true, opacity: 0.8, emissive: colors[i], emissiveIntensity: 0.5});
        const fMesh = new THREE.Mesh(fluidGeo, fMat);
        fMesh.position.y = -0.2;
        tankBase.add(fMesh);

        // Caps
        const capGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32);
        const cap = new THREE.Mesh(capGeo, darkSteel);
        cap.position.y = 1.5;
        tankBase.add(cap);

        // Tubes connecting to pipettes (visual representation)
        const tubeCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 1.75, 0),
            new THREE.Vector3(0, 4, -3),
            new THREE.Vector3(5 + (-3 + i*2), -1, -5)
        );
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 20, 0.05, 8, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        tankBase.add(tube);

        tanksGroup.add(tankBase);
    }
    group.add(tanksGroup);
    parts.push({
        name: "Reagent Reservoir Tanks",
        description: "Pressurized glass tanks holding lysis buffers, enzymes, and fluorescent tags.",
        material: "transparentGlass",
        function: "Supplies crucial chemical reagents to the pipette array for sample prep.",
        assemblyOrder: 9,
        connections: ["Fluidic Pump System", "Main Chassis"],
        failureEffect: "Leakage or depressurization preventing reagent delivery.",
        cascadeFailures: ["Fluidic Hoses"],
        originalPosition: { x: -5, y: 4, z: 5 },
        explodedPosition: { x: -15, y: 10, z: 15 }
    });

    // 10. Fluidic Pump System
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(0, 3, 6);
    
    const blockGeo = new THREE.BoxGeometry(4, 2, 2);
    const block = new THREE.Mesh(blockGeo, darkSteel);
    pumpGroup.add(block);

    // Mini pistons on pump
    for(let i=0; i<4; i++) {
        const pistonG = new THREE.CylinderGeometry(0.3, 0.3, 1);
        const piston = new THREE.Mesh(pistonG, chrome);
        piston.rotation.x = Math.PI/2;
        piston.position.set(-1.5 + i, 0, 1.2);
        pumpGroup.add(piston);
    }
    
    group.add(pumpGroup);
    parts.push({
        name: "Microfluidic Pneumatic Pump",
        description: "Quad-piston compressor block for precise fluid displacement.",
        material: "darkSteel",
        function: "Generates vacuum and positive pressure to move reagents through the system.",
        assemblyOrder: 10,
        connections: ["Main Chassis", "Reagent Reservoir Tanks"],
        failureEffect: "Loss of pressure, resulting in failed sample aspiration.",
        cascadeFailures: ["Multi-Channel Pipette"],
        originalPosition: { x: 0, y: 3, z: 6 },
        explodedPosition: { x: 0, y: 8, z: 12 }
    });

    // 11. Optical Sensor Array (Under the sample tray area or side)
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(-8, 3, 0);

    const laserBoxG = new THREE.BoxGeometry(2, 2, 2);
    const laserBox = new THREE.Mesh(laserBoxG, aluminum);
    opticsGroup.add(laserBox);

    const lensG = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const lens = new THREE.Mesh(lensG, transparentGlass);
    lens.rotation.z = Math.PI/2;
    lens.position.x = 1.2;
    opticsGroup.add(lens);

    // Laser beam
    const beamG = new THREE.CylinderGeometry(0.05, 0.05, 10);
    const beam = new THREE.Mesh(beamG, neonBlue);
    beam.rotation.z = Math.PI/2;
    beam.position.x = 6;
    opticsGroup.add(beam);
    meshes.laserBeam = beam; // to animate pulse

    group.add(opticsGroup);
    parts.push({
        name: "Spectroscopic Laser Array",
        description: "Multi-wavelength laser and high-sensitivity CMOS sensor.",
        material: "aluminum",
        function: "Scans the micro-well plates to detect microbial DNA via fluorescent tagging.",
        assemblyOrder: 11,
        connections: ["Main Chassis", "Data Processing Unit"],
        failureEffect: "Blindness of the machine, yielding zero analysis data.",
        cascadeFailures: ["Data Processing Unit"],
        originalPosition: { x: -8, y: 3, z: 0 },
        explodedPosition: { x: -18, y: 3, z: 0 }
    });

    // 12. Main Touch Display
    const displayGroup = new THREE.Group();
    displayGroup.position.set(8, 6, 6);
    displayGroup.rotation.y = -Math.PI / 4;
    displayGroup.rotation.x = -Math.PI / 6;

    const bezelGeo = new THREE.BoxGeometry(6, 4, 0.2);
    const bezel = new THREE.Mesh(bezelGeo, plastic);
    displayGroup.add(bezel);

    const screenGeo = new THREE.PlaneGeometry(5.6, 3.6);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.11;
    displayGroup.add(screen);

    // UI Elements on screen
    const uiLine = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.05), neonBlue);
    uiLine.position.set(0, 1.2, 0.12);
    displayGroup.add(uiLine);
    
    for(let i=0; i<3; i++) {
        const bar = new THREE.Mesh(new THREE.PlaneGeometry(1, Math.random()*2 + 0.5), neonGreen);
        bar.position.set(-2 + i*1.2, -0.5, 0.12);
        displayGroup.add(bar);
    }

    group.add(displayGroup);
    parts.push({
        name: "Holographic Touch Display",
        description: "High-resolution OLED screen with capacitive touch and AR interface.",
        material: "plastic",
        function: "User interface for configuring runs, viewing live data, and system diagnostics.",
        assemblyOrder: 12,
        connections: ["Main Chassis", "Data Processing Unit"],
        failureEffect: "Loss of user control and real-time feedback.",
        cascadeFailures: [],
        originalPosition: { x: 8, y: 6, z: 6 },
        explodedPosition: { x: 15, y: 10, z: 15 }
    });

    // 13. Data Processing Unit
    const dpuGroup = new THREE.Group();
    dpuGroup.position.set(8, 2, 2);

    const dpuBoxGeo = new THREE.BoxGeometry(3, 3, 3);
    const dpuBox = new THREE.Mesh(dpuBoxGeo, darkSteel);
    dpuGroup.add(dpuBox);

    // Glowing cooling fins
    for(let i=0; i<5; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 2.8, 2.8);
        const fin = new THREE.Mesh(finGeo, copper);
        fin.position.x = -1.4 + i*0.3;
        dpuGroup.add(fin);
    }

    group.add(dpuGroup);
    parts.push({
        name: "Quantum Core DPU",
        description: "Advanced data processing unit for rapid genomic sequencing and analysis.",
        material: "darkSteel",
        function: "Interprets optical sensor data, matching microbial DNA signatures against databases.",
        assemblyOrder: 13,
        connections: ["Main Chassis", "Spectroscopic Laser Array", "Touch Display"],
        failureEffect: "Inability to process raw sensor data into meaningful results.",
        cascadeFailures: ["Touch Display"],
        originalPosition: { x: 8, y: 2, z: 2 },
        explodedPosition: { x: 15, y: 2, z: 5 }
    });

    // 14. Thermal Cycling Block (PCR area)
    const pcrGroup = new THREE.Group();
    pcrGroup.position.set(0, 2.5, -4);
    
    const pcrBlockGeo = new THREE.BoxGeometry(4, 1.5, 3);
    const pcrBlock = new THREE.Mesh(pcrBlockGeo, aluminum);
    pcrGroup.add(pcrBlock);

    // Heating elements (glowing red)
    const heatMat = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0});
    const heaterGeo = new THREE.PlaneGeometry(3.5, 2.5);
    const heater = new THREE.Mesh(heaterGeo, heatMat);
    heater.rotation.x = -Math.PI/2;
    heater.position.y = 0.76;
    pcrGroup.add(heater);
    meshes.heater = heater;

    group.add(pcrGroup);
    parts.push({
        name: "PCR Thermal Cycler",
        description: "Peltier-driven rapid heating and cooling block.",
        material: "aluminum",
        function: "Amplifies DNA sequences in the samples for easier detection.",
        assemblyOrder: 14,
        connections: ["Main Chassis", "Power Supply"],
        failureEffect: "DNA fails to amplify, leading to false negatives.",
        cascadeFailures: ["Spectroscopic Laser Array"],
        originalPosition: { x: 0, y: 2.5, z: -4 },
        explodedPosition: { x: 0, y: 5, z: -10 }
    });

    // 15. Active Cooling System & Exhaust
    const fanGroup = new THREE.Group();
    fanGroup.position.set(8, -1, -5);

    const fanHousingG = new THREE.BoxGeometry(3, 3, 1);
    const fanHousing = new THREE.Mesh(fanHousingG, plastic);
    fanGroup.add(fanHousing);

    const bladeGroup = new THREE.Group();
    for(let i=0; i<7; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 1.2, 0.05);
        const blade = new THREE.Mesh(bladeGeo, darkSteel);
        blade.position.y = 0.6;
        
        const pivot = new THREE.Group();
        pivot.rotation.z = (i / 7) * Math.PI * 2;
        pivot.add(blade);
        bladeGroup.add(pivot);
    }
    bladeGroup.position.z = 0.5;
    fanGroup.add(bladeGroup);
    meshes.fan = bladeGroup;

    group.add(fanGroup);
    parts.push({
        name: "High-Volume Exhaust Fan",
        description: "Magnetic bearing cooling fan with titanium alloy blades.",
        material: "plastic",
        function: "Dissipates massive heat generated by the Centrifuge Motor and PCR block.",
        assemblyOrder: 15,
        connections: ["Main Chassis"],
        failureEffect: "Overheating leading to system shutdown or permanent hardware damage.",
        cascadeFailures: ["Centrifuge Motor", "PCR Thermal Cycler", "Quantum Core DPU"],
        originalPosition: { x: 8, y: -1, z: -5 },
        explodedPosition: { x: 15, y: -1, z: -12 }
    });

    // 16. Power Supply Unit (PSU)
    const psuGroup = new THREE.Group();
    psuGroup.position.set(-8, -1, 5);
    
    const psuBoxG = new THREE.BoxGeometry(4, 3, 4);
    const psuBox = new THREE.Mesh(psuBoxG, steel);
    psuGroup.add(psuBox);

    const cableG = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const cable = new THREE.Mesh(cableG, rubber);
    cable.position.set(2, 0, -2);
    cable.rotation.x = Math.PI/2;
    psuGroup.add(cable);

    group.add(psuGroup);
    parts.push({
        name: "High-Voltage Power Supply",
        description: "1200W redundant power supply with medical-grade isolation.",
        material: "steel",
        function: "Converts AC mains to clean DC power for all motors and sensitive electronics.",
        assemblyOrder: 16,
        connections: ["Main Chassis", "All electronic components"],
        failureEffect: "Complete system blackout.",
        cascadeFailures: ["Main Chassis"],
        originalPosition: { x: -8, y: -1, z: 5 },
        explodedPosition: { x: -18, y: -1, z: 12 }
    });


    // SCALE THE ENTIRE GROUP FOR VIEWING
    group.scale.set(0.4, 0.4, 0.4);

    const description = "The Farm Microbiome Analyzer is an ultra-high-tech, multi-function diagnostic laboratory compacted into a single benchtop unit. It utilizes automated pipetting, rapid thermal cycling (PCR), high-speed centrifugation, and spectroscopic laser scanning to analyze the complex microbial ecosystems in soil samples in real time.";

    const quizQuestions = [
        {
            question: "What component is responsible for separating the dense soil matrix from the microbial suspension fluid?",
            options: [
                "Microfluidic Pneumatic Pump",
                "Spectroscopic Laser Array",
                "High-Speed Centrifuge Rotor",
                "PCR Thermal Cycler"
            ],
            correctAnswer: 2,
            explanation: "The High-Speed Centrifuge Rotor spins at up to 30,000 RPM, using immense centrifugal force to pull heavier soil particles to the bottom of the vials while leaving the lighter microbes in suspension."
        },
        {
            question: "How does the machine maneuver the pipettes over specific columns in the sample tray?",
            options: [
                "By rotating the sample tray on a central axis.",
                "Using the X-Axis Linear Rail and Y-Axis Gantry combination.",
                "The pipettes are stationary and the tray floats via magnetism.",
                "A robotic arm externally reaches into the chamber."
            ],
            correctAnswer: 1,
            explanation: "The X-Axis Linear Rail moves the entire gantry left and right, while the Y-Axis Gantry moves the head forward and backward, providing precise 2D positioning over any well."
        },
        {
            question: "Which subsystem would be directly impacted if the Microfluidic Pneumatic Pump fails?",
            options: [
                "The Touch Display will freeze.",
                "The Centrifuge will wobble out of control.",
                "Reagents cannot be aspirated by the Multi-Channel Pipette.",
                "The Exhaust Fan will overspin."
            ],
            correctAnswer: 2,
            explanation: "The pump generates the necessary vacuum and positive pressure required by the Multi-Channel Pipette to aspirate and dispense precise volumes of fluid."
        },
        {
            question: "What is the primary function of the Spectroscopic Laser Array?",
            options: [
                "To melt the soil samples for DNA extraction.",
                "To scan the wells and detect microbial DNA via fluorescent tagging.",
                "To calibrate the Z-Axis Actuator Head.",
                "To sterilize the chamber between runs."
            ],
            correctAnswer: 1,
            explanation: "The Spectroscopic Laser Array emits specific wavelengths of light that excite fluorescent tags attached to the microbial DNA, allowing the CMOS sensor to read the emissions."
        },
        {
            question: "Why is the High-Volume Exhaust Fan critical for the PCR Thermal Cycler?",
            options: [
                "It blows away dust from the optics.",
                "It helps evaporate excess reagent fluids.",
                "PCR requires rapid heating and cooling cycles, generating massive thermal loads that must be dissipated.",
                "It powers the pneumatic pump."
            ],
            correctAnswer: 2,
            explanation: "PCR involves cycling temperatures rapidly between approx 95°C and 50°C. The Peltier blocks dump intense heat into the chassis during the cooling phase, which the exhaust fan must remove to prevent overheating."
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Spin the centrifuge rotor
        if (meshesObj.rotor) {
            meshesObj.rotor.rotation.y -= 0.5 * speed; // High speed
        }

        // Spin exhaust fan
        if (meshesObj.fan) {
            meshesObj.fan.rotation.z -= 0.3 * speed;
        }

        // Complex Pipette Arm Animation via Sine/Cosine
        const t = time * 0.001 * speed; // seconds scaled
        
        // X movement (back and forth across tray)
        if (meshesObj.xGantry) {
            meshesObj.xGantry.position.x = Math.sin(t) * 3;
        }
        
        // Y movement (forward/back on gantry)
        if (meshesObj.yGantry) {
            meshesObj.yGantry.position.z = 2.5 + Math.cos(t * 1.5) * 2;
        }
        
        // Z movement (pipette dipping into tray)
        if (meshesObj.pipetteHead) {
            // Dip quickly, hold, rise quickly
            const dipCycle = Math.sin(t * 3);
            if (dipCycle > 0.8) {
                meshesObj.pipetteHead.position.y = -1.5; // dipped
            } else {
                meshesObj.pipetteHead.position.y = -0.5; // raised
            }
        }

        // Laser beam pulsing
        if (meshesObj.laserBeam) {
            const intensity = (Math.sin(t * 10) + 1) / 2; // 0 to 1
            meshesObj.laserBeam.material.opacity = intensity;
            meshesObj.laserBeam.material.emissiveIntensity = intensity * 3;
        }

        // PCR Heater pulsing red
        if (meshesObj.heater) {
            const heatCycle = (Math.sin(t * 0.5) + 1) / 2;
            meshesObj.heater.material.emissiveIntensity = 0.5 + heatCycle * 3;
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
export function createMicrobiomeAnalyzer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
