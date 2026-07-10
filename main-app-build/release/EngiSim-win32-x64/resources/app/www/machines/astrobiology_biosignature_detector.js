import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Emissive and Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.8, roughness: 0.2, metalness: 0.5 });
    const laserRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 4.0, transparent: true, opacity: 0.9 });
    const indicatorOrange = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1.5 });
    const pureGold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.1 });
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x00ccaa, emissive: 0x00ccaa, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 });
    
    // 1. Chassis Base (Complex Extruded Shape)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-3.5, -2.5);
    baseShape.lineTo(3.5, -2.5);
    baseShape.lineTo(4.5, 0);
    baseShape.lineTo(3.5, 2.5);
    baseShape.lineTo(-3.5, 2.5);
    baseShape.lineTo(-4.5, 0);
    baseShape.lineTo(-3.5, -2.5);
    
    const baseExtrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const chassisGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const chassisBase = new THREE.Mesh(chassisGeo, darkSteel);
    chassisBase.rotation.x = Math.PI / 2;
    chassisBase.position.set(0, -0.5, 0);
    group.add(chassisBase);
    meshes.chassisBase = chassisBase;

    parts.push({
        name: "Chassis Base Plate",
        description: "A heavy-duty mounting platform connecting the biosignature detector to the rover deck. It features vibration-dampening structures to protect sensitive optical instruments.",
        material: "Dark Steel",
        function: "Provides structural integrity and isolation from rover traverse shocks.",
        assemblyOrder: 1,
        connections: ["Rover Deck", "Spectral Analyzer Core", "Environmental Shield"],
        failureEffect: "Misalignment of optical instruments due to vibration, rendering spectroscopic readings inaccurate.",
        cascadeFailures: ["Laser Emitter", "Detector Array"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // 2. Spectral Analyzer Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0.5, 0);

    const coreGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.2, 32, 1, false, 0, Math.PI * 2);
    const coreMesh = new THREE.Mesh(coreGeo, chrome);
    coreGroup.add(coreMesh);
    
    // Add intricate paneling to core
    for(let i=0; i<12; i++) {
        const panelGeo = new THREE.BoxGeometry(0.2, 2.0, 0.4);
        const panel = new THREE.Mesh(panelGeo, aluminum);
        panel.position.set(Math.cos(i * Math.PI/6) * 1.6, 0, Math.sin(i * Math.PI/6) * 1.6);
        panel.lookAt(0, 0, 0);
        coreGroup.add(panel);

        const rivetGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const rivetTop = new THREE.Mesh(rivetGeo, darkSteel);
        rivetTop.position.set(Math.cos(i * Math.PI/6) * 1.7, 0.8, Math.sin(i * Math.PI/6) * 1.7);
        coreGroup.add(rivetTop);

        const rivetBot = new THREE.Mesh(rivetGeo, darkSteel);
        rivetBot.position.set(Math.cos(i * Math.PI/6) * 1.7, -0.8, Math.sin(i * Math.PI/6) * 1.7);
        coreGroup.add(rivetBot);
    }
    group.add(coreGroup);
    meshes.spectralAnalyzerCore = coreGroup;

    parts.push({
        name: "Spectral Analyzer Core",
        description: "The primary housing for the Raman and fluorescence spectroscopy systems, built from lightweight, thermal-resistant chrome alloys. Contains internal diffraction gratings.",
        material: "Chrome / Aluminum",
        function: "Houses primary optical splitters and directs scattered light to the detectors.",
        assemblyOrder: 2,
        connections: ["Chassis Base Plate", "Laser Emitter", "Detector Array"],
        failureEffect: "Loss of core analytical capabilities. Cannot split incoming light for analysis.",
        cascadeFailures: ["Detector Array", "Data Processing Unit"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Glowing Sample Chamber
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(2.5, 0.8, 0);
    
    const chamberOuterGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.8, 24);
    const chamberOuter = new THREE.Mesh(chamberOuterGeo, tinted);
    chamberGroup.add(chamberOuter);
    
    const chamberInnerGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24);
    const chamberInner = new THREE.Mesh(chamberInnerGeo, neonBlue);
    chamberGroup.add(chamberInner);
    
    const chamberBaseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.3, 24);
    const chamberBase = new THREE.Mesh(chamberBaseGeo, steel);
    chamberBase.position.y = -1.05;
    chamberGroup.add(chamberBase);
    
    const chamberCapGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.3, 24);
    const chamberCap = new THREE.Mesh(chamberCapGeo, steel);
    chamberCap.position.y = 1.05;
    chamberGroup.add(chamberCap);

    // Chamber locking mechanism
    for(let i=0; i<4; i++) {
        const lock = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.3), darkSteel);
        lock.position.set(Math.cos(i * Math.PI/2) * 1.1, 0, Math.sin(i * Math.PI/2) * 1.1);
        chamberGroup.add(lock);
    }
    
    group.add(chamberGroup);
    meshes.sampleChamber = chamberGroup;

    parts.push({
        name: "Biosignature Sample Chamber",
        description: "A hermetically sealed, pressurized chamber bathed in UV and visible light to excite organic molecules for fluorescence detection.",
        material: "Tinted Sapphire Glass / Steel",
        function: "Contains crushed regolith or liquid samples during laser bombardment.",
        assemblyOrder: 3,
        connections: ["Spectral Analyzer Core", "Microfluidic Array", "Laser Emitter"],
        failureEffect: "Contamination of samples with terrestrial microbes or Martian atmosphere.",
        cascadeFailures: ["Microfluidic Array", "Gas Chromatograph"],
        originalPosition: { x: 2.5, y: 0.8, z: 0 },
        explodedPosition: { x: 6, y: 0.8, z: 0 }
    });

    // 4. Laser Emitter
    const laserGroup = new THREE.Group();
    laserGroup.position.set(-1.8, 1.5, 0);
    laserGroup.rotation.z = -Math.PI / 4;
    
    const laserBodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.5, 24);
    const laserBody = new THREE.Mesh(laserBodyGeo, darkSteel);
    laserGroup.add(laserBody);
    
    const laserTipGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 24);
    const laserTip = new THREE.Mesh(laserTipGeo, pureGold);
    laserTip.position.y = 1.0;
    laserGroup.add(laserTip);
    
    const laserBeamGeo = new THREE.CylinderGeometry(0.02, 0.02, 4, 8);
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserRed);
    laserBeam.position.y = 3.0;
    laserGroup.add(laserBeam);
    meshes.laserBeam = laserBeam; // for animation
    
    group.add(laserGroup);
    meshes.laserEmitter = laserGroup;

    parts.push({
        name: "Deep-UV Raman Laser Emitter",
        description: "A precision laser diode array that emits high-energy deep-ultraviolet light (248 nm) to avoid fluorescence obscuration of Raman spectra.",
        material: "Dark Steel / Gold Contacts",
        function: "Excites molecular bonds in the sample to generate a unique spectroscopic fingerprint.",
        assemblyOrder: 4,
        connections: ["Spectral Analyzer Core", "Power Capacitors"],
        failureEffect: "Inability to excite samples, zero data return from the primary instrument.",
        cascadeFailures: ["Detector Array"],
        originalPosition: { x: -1.8, y: 1.5, z: 0 },
        explodedPosition: { x: -5, y: 4, z: 0 }
    });

    // 5. High-Resolution Detector Array (CCD/CMOS)
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(-2, 0.2, 1.8);
    
    const detectorBox = new THREE.BoxGeometry(1.2, 1.0, 1.2);
    const detectorMesh = new THREE.Mesh(detectorBox, aluminum);
    detectorGroup.add(detectorMesh);
    
    const lensTube = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 24);
    const lensMesh = new THREE.Mesh(lensTube, chrome);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.z = -0.9;
    detectorGroup.add(lensMesh);
    
    const lensGlass = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24);
    const lensGlassMesh = new THREE.Mesh(lensGlass, glass);
    lensGlassMesh.rotation.x = Math.PI / 2;
    lensGlassMesh.position.z = -1.3;
    detectorGroup.add(lensGlassMesh);
    
    group.add(detectorGroup);
    meshes.detectorArray = detectorGroup;

    parts.push({
        name: "Cryocooled CCD Detector Array",
        description: "Ultra-sensitive, cryocooled charge-coupled device array capable of detecting single photons scattered by the Raman effect. Back-illuminated for max quantum efficiency.",
        material: "Aluminum / Glass",
        function: "Captures the scattered light spectrum and converts it into digital data.",
        assemblyOrder: 5,
        connections: ["Spectral Analyzer Core", "Cooling Radiators", "Data Processing Unit"],
        failureEffect: "Thermal noise overwhelms the signal, destroying scientific data quality.",
        cascadeFailures: [],
        originalPosition: { x: -2, y: 0.2, z: 1.8 },
        explodedPosition: { x: -5, y: 0.2, z: 5 }
    });

    // 6. Cooling Radiators
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.set(-2, 0.8, 2.8);
    
    const radiatorBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.3), darkSteel);
    radiatorGroup.add(radiatorBase);
    
    for(let i=0; i<15; i++) {
        const finGeo = new THREE.BoxGeometry(1.3, 0.04, 0.6);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(0, -0.55 + i*0.08, 0.45);
        radiatorGroup.add(fin);
    }
    
    group.add(radiatorGroup);
    meshes.coolingRadiators = radiatorGroup;

    parts.push({
        name: "Active Cooling Radiator Fins",
        description: "A dense array of aluminum fins tied to a robust thermoelectric cooler (TEC) to maintain the CCD detector at -80°C in the Martian environment.",
        material: "Aluminum / Dark Steel",
        function: "Dissipates massive heat generated by the detector and laser systems into the thin atmosphere.",
        assemblyOrder: 6,
        connections: ["Detector Array"],
        failureEffect: "Overheating of the CCD, resulting in massive dark current noise.",
        cascadeFailures: ["Detector Array", "Laser Emitter"],
        originalPosition: { x: -2, y: 0.8, z: 2.8 },
        explodedPosition: { x: -5, y: 2.5, z: 7 }
    });

    // 7. Microfluidic Array (Complex flat plate with channels)
    const microGeo = new THREE.BoxGeometry(2.4, 0.15, 2.4);
    const microMesh = new THREE.Mesh(microGeo, plastic);
    microMesh.position.set(2.5, -0.2, 2.5);
    
    // Add intricate channel details
    for(let i=0; i<8; i++) {
        const channel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.06), channelMat);
        channel.position.set(0, 0, -1.0 + i*0.28);
        microMesh.add(channel);
        
        const crossChannel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 2.2), channelMat);
        crossChannel.position.set(-1.0 + i*0.28, 0, 0);
        microMesh.add(crossChannel);
    }

    // Microvalves
    for(let i=0; i<4; i++) {
        const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16), darkSteel);
        valve.position.set(-0.8 + i*0.5, 0.1, -0.8 + i*0.5);
        microMesh.add(valve);
    }

    group.add(microMesh);
    meshes.microfluidicArray = microMesh;

    parts.push({
        name: "Microfluidic Processing Array",
        description: "A sophisticated lab-on-a-chip platform that mixes regolith with liquid solvents to extract amino acids, lipids, and complex hydrocarbons.",
        material: "Teflon / Quartz / Channel Matrix",
        function: "Prepares chemical samples via microscopic channels and valves for analysis.",
        assemblyOrder: 7,
        connections: ["Sample Chamber", "Solvent Reservoirs"],
        failureEffect: "Inability to extract organics; relies purely on non-contact laser analysis.",
        cascadeFailures: ["Gas Chromatograph"],
        originalPosition: { x: 2.5, y: -0.2, z: 2.5 },
        explodedPosition: { x: 6, y: -2, z: 6 }
    });

    // 8. Power Capacitors (Cylinder Banks)
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 0, -2.5);
    
    for(let i=0; i<5; i++) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 24), copper);
        cap.position.set(-1.4 + i*0.7, 0.7, 0);
        
        const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), aluminum);
        capTop.position.y = 0.8;
        cap.add(capTop);
        
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), indicatorOrange);
        led.position.set(0, 0.95, 0);
        cap.add(led);
        
        capGroup.add(cap);
    }
    group.add(capGroup);
    meshes.powerCapacitors = capGroup;
    meshes.capGroup = capGroup; // For animation

    parts.push({
        name: "High-Discharge Power Capacitors",
        description: "A bank of ultra-capacitors that store energy from the rover's RTG to provide massive instantaneous power bursts required by the deep-UV laser and mass spectrometer.",
        material: "Copper / Tantalum",
        function: "Provides pulsed power to the high-draw emitter subsystems.",
        assemblyOrder: 8,
        connections: ["Laser Emitter", "Mass Spectrometer"],
        failureEffect: "Laser fires at insufficient energy levels, unable to penetrate rock rinds.",
        cascadeFailures: ["Laser Emitter"],
        originalPosition: { x: 0, y: 0, z: -2.5 },
        explodedPosition: { x: 0, y: 3, z: -6 }
    });

    // 9. Gas Chromatograph Columns (Helical Tubes)
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = Math.cos(t * Math.PI * 2 * this.turns) * this.radius;
            const z = Math.sin(t * Math.PI * 2 * this.turns) * this.radius;
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }
    
    const gcGroup = new THREE.Group();
    gcGroup.position.set(2.5, 1.2, -2.5);
    
    const helixCurve1 = new HelixCurve(0.5, 1.8, 15);
    const helixGeo1 = new THREE.TubeGeometry(helixCurve1, 150, 0.04, 12, false);
    const helixMesh1 = new THREE.Mesh(helixGeo1, steel);
    gcGroup.add(helixMesh1);
    
    const helixCurve2 = new HelixCurve(0.7, 1.8, 15);
    const helixGeo2 = new THREE.TubeGeometry(helixCurve2, 150, 0.04, 12, false);
    const helixMesh2 = new THREE.Mesh(helixGeo2, copper);
    gcGroup.add(helixMesh2);

    const gcHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.0, 24, 1, true), glass);
    gcGroup.add(gcHousing);

    const gcBase = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.2, 24), darkSteel);
    gcBase.position.y = -1.0;
    gcGroup.add(gcBase);

    group.add(gcGroup);
    meshes.gasChromatograph = gcGroup;

    parts.push({
        name: "Gas Chromatograph Capillary Columns",
        description: "Extremely long, coiled micro-capillary tubes coated with a stationary phase to separate volatilized organic compounds based on their chemical properties.",
        material: "Steel / Copper / Borosilicate Glass",
        function: "Separates complex organic mixtures into individual compounds for sequential analysis.",
        assemblyOrder: 9,
        connections: ["Sample Chamber", "Mass Spectrometer"],
        failureEffect: "All organic compounds enter the mass spec simultaneously, creating an unreadable composite spectrum.",
        cascadeFailures: ["Mass Spectrometer"],
        originalPosition: { x: 2.5, y: 1.2, z: -2.5 },
        explodedPosition: { x: 6, y: 1.2, z: -6 }
    });

    // 10. Mass Spectrometer Magnetic Sector
    const msGroup = new THREE.Group();
    msGroup.position.set(4.0, 1.5, -1.0);
    
    const msShape = new THREE.Shape();
    msShape.moveTo(0, 0);
    msShape.absarc(0, 0, 1.2, 0, Math.PI / 2, false);
    msShape.lineTo(0, 2.0);
    msShape.lineTo(-0.8, 2.0);
    msShape.lineTo(-0.8, 0);
    
    const msGeo = new THREE.ExtrudeGeometry(msShape, { depth: 1.0, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 });
    const msMesh = new THREE.Mesh(msGeo, darkSteel);
    msMesh.rotation.x = Math.PI / 2;
    msGroup.add(msMesh);
    
    // Ion detector plate
    const ionPlate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.0), pureGold);
    ionPlate.position.set(0.1, 0, -0.5);
    msGroup.add(ionPlate);

    const ionSource = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), chrome);
    ionSource.position.set(-0.4, 0, 0);
    msGroup.add(ionSource);

    group.add(msGroup);
    meshes.massSpectrometer = msGroup;

    parts.push({
        name: "Magnetic Sector Mass Spectrometer",
        description: "Uses powerful electromagnets to bend the trajectories of ionized particles. Lighter ions bend more, allowing exact determination of molecular mass and isotopic ratios.",
        material: "Dark Steel / Gold / Chrome",
        function: "Identifies specific organic molecules and isotopic signatures (e.g., C12/C13 ratios indicating biological origin).",
        assemblyOrder: 10,
        connections: ["Gas Chromatograph", "Data Processing Unit", "Vacuum Pump"],
        failureEffect: "Inability to confirm the mass or isotopic composition of detected organics.",
        cascadeFailures: [],
        originalPosition: { x: 4.0, y: 1.5, z: -1.0 },
        explodedPosition: { x: 8, y: 2, z: -2 }
    });

    // 11. Data Processing Unit (Rack Server style)
    const dpuGroup = new THREE.Group();
    dpuGroup.position.set(-4.0, 1.0, -1.5);
    
    const dpuChassis = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 1.8), darkSteel);
    dpuGroup.add(dpuChassis);
    
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
    for(let i=0; i<8; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.15, 1.7), aluminum);
        blade.position.y = -0.9 + i*0.25;
        dpuGroup.add(blade);
        
        for(let j=0; j<6; j++) {
            const dpuLed = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), ledMat);
            dpuLed.position.set(0.8, -0.9 + i*0.25, -0.6 + j*0.24);
            dpuGroup.add(dpuLed);
        }
    }
    group.add(dpuGroup);
    meshes.dataProcessingUnit = dpuGroup;
    meshes.dpuGroup = dpuGroup; // For animation

    parts.push({
        name: "Autonomous Data Processing Unit",
        description: "A radiation-hardened computing cluster that processes massive datasets from the spectrometer and CCD using onboard machine learning to compress data before transmission.",
        material: "Dark Steel / Aluminum",
        function: "Performs real-time peak identification, baseline subtraction, and data compression.",
        assemblyOrder: 11,
        connections: ["Detector Array", "Mass Spectrometer"],
        failureEffect: "Instrument continues to collect raw data, but overwhelms the rover's bandwidth, limiting transmission to Earth.",
        cascadeFailures: [],
        originalPosition: { x: -4.0, y: 1.0, z: -1.5 },
        explodedPosition: { x: -8, y: 1.0, z: -3 }
    });

    // 12. Vacuum Pump (Complex Cylinders)
    const vacuumGroup = new THREE.Group();
    vacuumGroup.position.set(2.5, -0.2, -0.5);
    
    const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 24), steel);
    pumpBody.rotation.z = Math.PI / 2;
    vacuumGroup.add(pumpBody);
    
    const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 24), darkSteel);
    pumpMotor.rotation.z = Math.PI / 2;
    pumpMotor.position.x = -1.0;
    vacuumGroup.add(pumpMotor);
    
    const exhaustTube = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16), chrome);
    exhaustTube.position.set(0.4, 0.6, 0);
    vacuumGroup.add(exhaustTube);

    // Pump cooling fins
    for(let i=0; i<6; i++) {
        const finGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.05, 24);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.rotation.z = Math.PI / 2;
        fin.position.x = -0.3 + i*0.15;
        vacuumGroup.add(fin);
    }

    group.add(vacuumGroup);
    meshes.vacuumPump = vacuumGroup;

    parts.push({
        name: "Turbomolecular Vacuum Pump",
        description: "Spins at 90,000 RPM to create a high vacuum environment required for the mass spectrometer to function without atmospheric interference. Uses magnetic bearings.",
        material: "Steel / Titanium blades / Aluminum",
        function: "Evacuates the mass spectrometer chamber to a hard vacuum.",
        assemblyOrder: 12,
        connections: ["Mass Spectrometer"],
        failureEffect: "Mass spectrometer arcs and burns out due to atmospheric pressure.",
        cascadeFailures: ["Mass Spectrometer"],
        originalPosition: { x: 2.5, y: -0.2, z: -0.5 },
        explodedPosition: { x: 5, y: -3, z: -0.5 }
    });

    // 13. Robotic Sample Arm Base
    const armBaseGroup = new THREE.Group();
    armBaseGroup.position.set(0, 0, 4.0);
    
    const swivelBase = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.6, 32), darkSteel);
    armBaseGroup.add(swivelBase);
    
    const pivotMount = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.8), steel);
    pivotMount.position.y = 0.8;
    armBaseGroup.add(pivotMount);

    const baseGear = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32), chrome);
    baseGear.position.y = -0.2;
    armBaseGroup.add(baseGear);
    
    group.add(armBaseGroup);
    meshes.roboticArmBase = armBaseGroup;

    parts.push({
        name: "Sample Acquisition Arm Base",
        description: "A heavily geared azimuth actuator that allows the sample arm to swing 360 degrees to gather regolith or abrade rocks.",
        material: "Dark Steel / Chrome",
        function: "Provides the primary rotation axis for the sample acquisition system.",
        assemblyOrder: 13,
        connections: ["Chassis Base Plate", "Robotic Arm Joint"],
        failureEffect: "Inability to reach target sampling locations.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 4.0 },
        explodedPosition: { x: 0, y: -2, z: 8 }
    });

    // 14. Robotic Arm Articulation (Hydraulic Pistons)
    const armJointGroup = new THREE.Group();
    armJointGroup.position.set(0, 1.2, 4.0);
    
    const primaryBoom = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 0.5), chrome);
    primaryBoom.position.y = 1.75;
    armJointGroup.add(primaryBoom);
    
    const hydraulicCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 24), darkSteel);
    hydraulicCyl.position.set(0.4, 1.2, 0);
    hydraulicCyl.rotation.z = 0.15;
    armJointGroup.add(hydraulicCyl);
    
    const hydraulicPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.0, 24), chrome);
    hydraulicPiston.position.set(0.5, 2.5, 0);
    hydraulicPiston.rotation.z = 0.15;
    armJointGroup.add(hydraulicPiston);
    
    group.add(armJointGroup);
    meshes.roboticArmJoint = armJointGroup;
    meshes.armJointGroup = armJointGroup; // For animation
    meshes.hydraulicPiston = hydraulicPiston;

    parts.push({
        name: "Articulated Boom & Hydraulics",
        description: "Titanium boom structure powered by specialized low-temperature hydraulic fluid, enabling precise positioning of the end effector.",
        material: "Chrome / Titanium / Dark Steel",
        function: "Extends and retracts to position the sample scoop/drill.",
        assemblyOrder: 14,
        connections: ["Robotic Arm Base", "Robotic Arm Claw"],
        failureEffect: "Arm becomes stuck in a fixed position, severely limiting sampling range.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.2, z: 4.0 },
        explodedPosition: { x: 0, y: 5, z: 8 }
    });

    // 15. Robotic Arm Claw/Drill
    const clawGroup = new THREE.Group();
    // Positioned relative to the end of the primary boom (y: 3.5 + 1.2 = 4.7)
    clawGroup.position.set(0, 4.7, 4.0);
    
    const clawHousing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.8), darkSteel);
    clawGroup.add(clawHousing);
    
    const drillBitGeo = new THREE.ConeGeometry(0.2, 1.2, 24);
    const drillBit = new THREE.Mesh(drillBitGeo, pureGold); // Gold coated for hardness/thermal
    drillBit.position.y = -1.1;
    drillBit.rotation.x = Math.PI;
    clawGroup.add(drillBit);

    // Threads on drill bit
    const threadGeo = new THREE.TorusGeometry(0.2, 0.03, 16, 16);
    for(let i=0; i<6; i++) {
        const thread = new THREE.Mesh(threadGeo, chrome);
        thread.rotation.x = Math.PI / 2;
        thread.position.y = -0.7 - (i*0.15);
        thread.scale.set(1 - (i*0.1), 1 - (i*0.1), 1);
        clawGroup.add(thread);
    }
    
    const scoopLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.6), steel);
    scoopLeft.position.set(-0.5, -0.9, 0);
    clawGroup.add(scoopLeft);
    
    const scoopRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.6), steel);
    scoopRight.position.set(0.5, -0.9, 0);
    clawGroup.add(scoopRight);
    
    group.add(clawGroup);
    meshes.roboticArmClaw = clawGroup;
    meshes.drillBit = drillBit; // For animation
    meshes.scoopLeft = scoopLeft;
    meshes.scoopRight = scoopRight;

    parts.push({
        name: "Percussive Drill & Scoop Effector",
        description: "A combination tool featuring a diamond-tipped percussive drill to abrade weathered rock surfaces and clamshell scoops to collect the pristine dust underneath.",
        material: "Dark Steel / Gold-Diamond Tipped / Steel",
        function: "Obtains subsurface rock dust and soil samples, free from high UV radiation degradation.",
        assemblyOrder: 15,
        connections: ["Articulated Boom"],
        failureEffect: "Unable to penetrate weathered rock; forced to analyze degraded surface dust only.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 4.7, z: 4.0 },
        explodedPosition: { x: 0, y: 9, z: 8 }
    });

    // 16. Intricate Wiring Harness (TubeGeometries connecting systems)
    const wireGroup = new THREE.Group();
    
    const createWire = (p1, p2, color, thickness) => {
        const path = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(p1[0], p1[1], p1[2]),
            new THREE.Vector3(p1[0], (p1[1]+p2[1])/2 + 2, (p1[2]+p2[2])/2),
            new THREE.Vector3(p2[0], p2[1], p2[2])
        );
        const tube = new THREE.TubeGeometry(path, 32, thickness, 12, false);
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });
        return new THREE.Mesh(tube, mat);
    };
    
    // Connect DPU to Core
    wireGroup.add(createWire([-4, 1.5, -1.5], [0, 2.0, 0], 0xffaa00, 0.08)); // Orange fiber optic
    wireGroup.add(createWire([-4, 1.7, -1.5], [0, 1.8, 0], 0x111111, 0.1)); // Power cable
    // Connect Capacitors to Laser
    wireGroup.add(createWire([0, 1.0, -2.5], [-1.8, 1.5, 0], 0xcc0000, 0.12)); // High voltage
    wireGroup.add(createWire([-0.5, 1.0, -2.5], [-1.8, 1.5, 0], 0x111111, 0.12)); // High voltage
    // Connect Core to Chamber
    wireGroup.add(createWire([0, 1.0, 0], [2.5, 0.8, 0], 0x0000cc, 0.06)); // Data
    // Connect Vacuum to MS
    wireGroup.add(createWire([2.5, 0.5, -0.5], [4.0, 1.5, -1.0], 0x888888, 0.18)); // Vacuum hose
    // Connect Microfluidic to Chamber
    wireGroup.add(createWire([2.5, -0.2, 2.5], [2.5, 0.8, 0], 0x00ccaa, 0.05)); // Fluid line
    
    group.add(wireGroup);
    meshes.wiringHarness = wireGroup;

    parts.push({
        name: "Avionics & Pneumatic Harness",
        description: "A complex network of shielded power cables, fiber optic data lines, and pneumatic hoses clad in multi-layer insulation (MLI) to survive extreme thermal cycling.",
        material: "Copper / Kevlar / MLI",
        function: "Routes power, data, and fluids between the disparate subsystems.",
        assemblyOrder: 16,
        connections: ["All Subsystems"],
        failureEffect: "Loss of communication or power to specific instruments, causing localized subsystem failure.",
        cascadeFailures: ["Data Processing Unit", "Laser Emitter"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -5 }
    });


    // Description and Quiz
    const description = "The Astrobiology Biosignature Detector is an ultra-sophisticated rover payload designed to search for extinct or extant life on other planets. It combines deep-UV Raman spectroscopy, a lab-on-a-chip microfluidic array, and a magnetic sector mass spectrometer. Powered by massive capacitor banks and controlled by an autonomous radiation-hardened AI cluster, this instrument can drill into rocks, extract pristine samples, volatilize them, and detect complex organic molecules—such as amino acids and lipid biomarkers—down to parts-per-billion concentrations. It represents the pinnacle of miniaturized, autonomous interplanetary analytical chemistry.";

    const quizQuestions = [
        {
            question: "Why does the Laser Emitter use deep-ultraviolet (248 nm) light instead of visible light?",
            options: [
                "To melt the rock samples faster",
                "To prevent fluorescence from overpowering the faint Raman scattering signal",
                "To sterilize the sample before analysis",
                "To conserve power from the rover's RTG"
            ],
            correctAnswer: 1,
            explanation: "In Raman spectroscopy of organic materials, visible lasers often trigger strong fluorescence that drowns out the Raman signal. Deep-UV lasers avoid this because Raman scattering occurs at wavelengths distinct from the fluorescence emission band."
        },
        {
            question: "What is the function of the Turbomolecular Vacuum Pump?",
            options: [
                "To suck dust into the sample chamber",
                "To cool the CCD detector",
                "To evacuate the mass spectrometer chamber to a hard vacuum",
                "To propel the rover forward"
            ],
            correctAnswer: 2,
            explanation: "A mass spectrometer requires a very high vacuum to operate; otherwise, the ionized particles would collide with atmospheric gas molecules, scattering their trajectories and ruining the mass analysis."
        },
        {
            question: "Which component separates complex mixtures of volatilized organics into individual compounds before they enter the mass spectrometer?",
            options: [
                "The Gas Chromatograph Capillary Columns",
                "The Microfluidic Processing Array",
                "The Active Cooling Radiator Fins",
                "The Data Processing Unit"
            ],
            correctAnswer: 0,
            explanation: "Gas chromatography columns use a stationary phase coating inside extremely long coiled tubes to separate molecules based on their chemical properties (like polarity or boiling point) so they enter the mass spec one by one."
        },
        {
            question: "What material is commonly used to coat the percussive drill bit to ensure it can penetrate hardened, weathered rock?",
            options: [
                "Teflon",
                "Copper",
                "Aluminum",
                "Diamond / Gold coating"
            ],
            correctAnswer: 3,
            explanation: "Drill bits for space exploration are often diamond-tipped or coated in extremely hard materials to ensure they do not dull when grinding through hard basaltic rocks found on bodies like Mars."
        },
        {
            question: "Why does the CCD Detector Array require Active Cooling Radiator Fins?",
            options: [
                "To keep the laser from melting the chassis",
                "To freeze the soil samples",
                "To reduce thermal noise (dark current) that would obscure single-photon detections",
                "To power the thermoelectric generators"
            ],
            correctAnswer: 2,
            explanation: "CCD detectors are highly sensitive to heat. At room temperature, thermal energy can excite electrons, creating a 'dark current' that mimics light signals. Cooling the CCD to very low temperatures minimizes this noise."
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate spectral core slowly
        if(meshes.spectralAnalyzerCore) {
            meshes.spectralAnalyzerCore.rotation.y = time * 0.3 * speed;
        }
        
        // Blink Data Processing Unit LEDs
        if(meshes.dpuGroup) {
            meshes.dpuGroup.children.forEach((child) => {
                if(child.geometry.type === 'BoxGeometry' && child.geometry.parameters.width === 0.05) {
                    // It's an LED
                    child.material.emissiveIntensity = (Math.sin(time * 15 * speed + child.position.z * 10) > 0) ? 3 : 0.2;
                }
            });
        }

        // Pulse Power Capacitors
        if(meshes.capGroup) {
            meshes.capGroup.children.forEach((cap, index) => {
                cap.children.forEach(child => {
                    if(child.geometry.type === 'SphereGeometry') {
                        child.material.emissiveIntensity = Math.abs(Math.sin(time * 4 * speed + index * 2)) * 2;
                    }
                });
            });
        }

        // Spin drill bit and thread
        if(meshes.drillBit) {
            meshes.drillBit.rotation.y = time * 15 * speed;
        }
        if(meshes.roboticArmClaw) {
            meshes.roboticArmClaw.children.forEach(child => {
                if(child.geometry.type === 'TorusGeometry') {
                    child.rotation.z = time * 15 * speed;
                }
            });
        }

        // Move Arm Boom Up and Down (Sine Wave)
        if(meshes.armJointGroup) {
            const swing = Math.sin(time * speed) * 0.4;
            meshes.armJointGroup.rotation.x = swing;
            
            // Sync hydraulic piston
            if(meshes.hydraulicPiston) {
                meshes.hydraulicPiston.position.y = 2.5 + (swing * 1.2);
            }
        }
        
        // Scoop open/close
        if(meshes.scoopLeft && meshes.scoopRight) {
            const openClose = Math.abs(Math.sin(time * 2.5 * speed)) * 0.6;
            meshes.scoopLeft.rotation.z = -openClose;
            meshes.scoopRight.rotation.z = openClose;
        }

        // Laser pulse (rapid flash)
        if(meshes.laserBeam) {
            meshes.laserBeam.material.opacity = Math.random() > 0.7 ? 0.9 : 0.1;
            meshes.laserBeam.scale.y = Math.random() > 0.7 ? 1 : 0.05;
        }

        // Rotate vacuum pump cylinder
        if(meshes.vacuumPump) {
             meshes.vacuumPump.children[0].rotation.y = time * 25 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBiosignatureDetector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
