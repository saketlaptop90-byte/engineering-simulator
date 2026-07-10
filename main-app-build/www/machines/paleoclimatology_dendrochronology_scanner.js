import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animatables = [];

    // Helper to add parts
    function addPart(name, mesh, description, func, connections, failEffect, cascade) {
        mesh.name = name;
        group.add(mesh);
        
        let explosionDir = mesh.position.clone().normalize();
        if (explosionDir.lengthSq() === 0) explosionDir.set(0, 1, 0);
        
        parts.push({
            name,
            description,
            material: mesh.material || steel,
            function: func,
            assemblyOrder: parts.length + 1,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: mesh.position.clone(),
            explodedPosition: mesh.position.clone().add(explosionDir.multiplyScalar(20 + Math.random() * 10))
        });
    }

    // Custom Emissive & High-Tech Materials
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0033, emissive: 0xff0033, emissiveIntensity: 8, transparent: true, opacity: 0.8 });
    const blueLaserMat = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 5, transparent: true, opacity: 0.7 });
    const greenScreenMat = new THREE.MeshStandardMaterial({ color: 0x001100, emissive: 0x00ff44, emissiveIntensity: 1.5, transparent: true, opacity: 0.9, wireframe: true });
    const orangeIndicator = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 3 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc28f59, roughness: 0.95 });
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 1.0 });
    const ringMatDark = new THREE.MeshStandardMaterial({ color: 0x734a29, roughness: 0.85 });
    const ringMatLight = new THREE.MeshStandardMaterial({ color: 0xa87345, roughness: 0.85 });
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2 });

    // 1. MASSIVE BASE CHASSIS
    const chassisGroup = new THREE.Group();
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-20, -8);
    baseShape.lineTo(20, -8);
    baseShape.lineTo(24, -4);
    baseShape.lineTo(24, 4);
    baseShape.lineTo(20, 8);
    baseShape.lineTo(-20, 8);
    baseShape.lineTo(-24, 4);
    baseShape.lineTo(-24, -4);
    baseShape.lineTo(-20, -8);

    const baseGeom = new THREE.ExtrudeGeometry(baseShape, { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.3, bevelThickness: 0.3 });
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.set(0, -4, 0);
    chassisGroup.add(baseMesh);

    // Chassis details (vents, grooves)
    for (let i = -18; i <= 18; i += 3) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.5), aluminum);
        vent.position.set(i, -3, 8.2);
        chassisGroup.add(vent);
    }
    addPart('Massive Base Chassis', chassisGroup, 'Heavy depleted-uranium reinforced chassis', 'Anchors the entire apparatus to prevent micro-seismic interference', [], 'Catastrophic misalignment', ['Optical Rails', 'Laser Carriage']);

    // 2. HYDRAULIC SUSPENSION SYSTEM
    const suspensionGroup = new THREE.Group();
    const susPositions = [[-18, -6], [18, -6], [-18, 6], [18, 6], [0, -6], [0, 6]];
    susPositions.forEach(pos => {
        // Main cylinder
        const outerG = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
        const outerM = new THREE.Mesh(outerG, chrome);
        outerM.position.set(pos[0], -5.5, pos[1]);
        
        // Piston rod
        const innerG = new THREE.CylinderGeometry(0.7, 0.7, 4, 32);
        const innerM = new THREE.Mesh(innerG, steel);
        innerM.position.set(pos[0], -7, pos[1]);
        
        // Hydraulic fluid tube
        const tubePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos[0], -4.5, pos[1]),
            new THREE.Vector3(pos[0]*0.8, -4, pos[1]*0.8),
            new THREE.Vector3(0, -3.5, 0)
        ]);
        const tubeGeom = new THREE.TubeGeometry(tubePath, 20, 0.15, 8, false);
        const fluidTube = new THREE.Mesh(tubeGeom, rubber);
        
        suspensionGroup.add(outerM, innerM, fluidTube);
    });
    addPart('Hydraulic Suspension System', suspensionGroup, 'Active noise-canceling hydraulic pillars', 'Neutralizes environmental vibration for nanometer scan accuracy', ['Massive Base Chassis'], 'Scan blur', ['Tree Ring Sample']);

    // 3. OPTICAL MAGNETIC RAILS
    const railsGroup = new THREE.Group();
    const railGeom = new THREE.CylinderGeometry(0.5, 0.5, 38, 64);
    
    const leftRail = new THREE.Mesh(railGeom, chrome);
    leftRail.rotation.z = Math.PI / 2;
    leftRail.position.set(0, -0.5, -5);
    
    const rightRail = new THREE.Mesh(railGeom, chrome);
    rightRail.rotation.z = Math.PI / 2;
    rightRail.position.set(0, -0.5, 5);
    
    railsGroup.add(leftRail, rightRail);
    addPart('Optical Magnetic Rails', railsGroup, 'Super-cooled magnetic levitation tracks', 'Provides zero-friction traversal for the laser gantry', ['Massive Base Chassis'], 'Gantry friction lock', ['Laser Gantry']);

    // 4. TITANIUM RAIL MOUNTS
    const mountsGroup = new THREE.Group();
    for(let i = -17; i <= 17; i += 2) {
        const mountShape = new THREE.Shape();
        mountShape.moveTo(-0.5, 0);
        mountShape.lineTo(0.5, 0);
        mountShape.lineTo(0.3, 2);
        mountShape.lineTo(-0.3, 2);
        const mountGeom = new THREE.ExtrudeGeometry(mountShape, { depth: 1.5, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
        
        const m1 = new THREE.Mesh(mountGeom, aluminum);
        m1.position.set(i, -2.5, -5.75);
        
        const m2 = new THREE.Mesh(mountGeom, aluminum);
        m2.position.set(i, -2.5, 4.25);
        
        mountsGroup.add(m1, m2);
    }
    addPart('Titanium Rail Mounts', mountsGroup, 'High-tensile track stabilizers', 'Anchors levitation rails against thermal expansion', ['Optical Magnetic Rails'], 'Track warping', ['Laser Gantry']);

    // 5. SAMPLE TURNTABLE BED
    const turntableGroup = new THREE.Group();
    
    // Main base
    const ttBase = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.5, 1.5, 64), darkSteel);
    ttBase.position.set(0, -1, 0);
    turntableGroup.add(ttBase);

    // Drive Gears
    for(let i = 0; i < 72; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), steel);
        const angle = (i / 72) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * 7.3, -1, Math.sin(angle) * 7.3);
        tooth.rotation.y = -angle;
        turntableGroup.add(tooth);
    }
    
    // Rotating Platform (The part that spins)
    const platform = new THREE.Group();
    const platDisc = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 6.8, 0.5, 64), chrome);
    platDisc.position.set(0, -0.1, 0);
    platform.add(platDisc);
    
    // Clamps
    for(let i=0; i<4; i++) {
        const clamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2), darkSteel);
        const ang = (i/4) * Math.PI * 2;
        clamp.position.set(Math.cos(ang)*6, 0.5, Math.sin(ang)*6);
        clamp.rotation.y = -ang;
        platform.add(clamp);
    }
    
    turntableGroup.add(platform);
    addPart('Sample Turntable Bed', turntableGroup, 'Geared rotational staging platform', 'Allows 360-degree topographical scanning of the sample', ['Massive Base Chassis'], 'Stuck rotation', ['Tree Ring Sample']);
    animatables.push({ obj: platform, type: 'rotateY', speed: 0.05 });

    // 6. TURNTABLE DRIVE MOTOR
    const motorGroup = new THREE.Group();
    const mBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4, 32), copper);
    mBody.rotation.z = Math.PI / 2;
    mBody.position.set(9, -1, 0);
    
    const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 32), chrome);
    mShaft.rotation.z = Math.PI / 2;
    mShaft.position.set(6.5, -1, 0);
    
    const mGear = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.8, 16), steel);
    mGear.rotation.z = Math.PI / 2;
    mGear.position.set(7.5, -1, 0);
    
    motorGroup.add(mBody, mShaft, mGear);
    addPart('Turntable Drive Motor', motorGroup, 'High-torque industrial stepper motor', 'Provides exact micro-rotations for azimuthal scanning', ['Sample Turntable Bed'], 'Scan banding', ['Sample Turntable Bed']);

    // 7. ANCIENT TREE RING SAMPLE (HIGH DETAIL)
    const sampleGroup = new THREE.Group();
    const maxRad = 5.5;
    const thickness = 0.8;
    
    // Core (Pith)
    const pith = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, thickness, 32), ringMatDark);
    sampleGroup.add(pith);

    // Bark
    const bark = new THREE.Mesh(new THREE.CylinderGeometry(maxRad+0.15, maxRad+0.15, thickness+0.05, 128), barkMat);
    sampleGroup.add(bark);

    // Wood Base
    const wood = new THREE.Mesh(new THREE.CylinderGeometry(maxRad, maxRad, thickness-0.02, 128), woodMat);
    sampleGroup.add(wood);

    // 150 Rings to simulate extreme age
    let currentRad = 0.15;
    for(let i = 1; i <= 150; i++) {
        // Varying ring width (simulate drought/wet years)
        const yearGrowth = 0.01 + Math.random() * 0.04;
        currentRad += yearGrowth;
        if (currentRad > maxRad) break;
        
        const ringG = new THREE.TorusGeometry(currentRad, 0.008 + (Math.random()*0.005), 5, 128);
        const isDarkYear = Math.random() > 0.8 || i % 10 === 0;
        const ring = new THREE.Mesh(ringG, isDarkYear ? ringMatDark : ringMatLight);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = thickness / 2;
        
        // Asymmetric growth
        const stretchX = 1 + (Math.random()*0.04 - 0.02);
        const stretchY = 1 + (Math.random()*0.04 - 0.02);
        ring.scale.set(stretchX, stretchY, 1);
        
        sampleGroup.add(ring);
    }
    
    sampleGroup.position.set(0, 0.5, 0);
    platform.add(sampleGroup); // bind to rotating platform
    addPart('Ancient Tree Sample', sampleGroup, 'Late Holocene Sequoia Cross-Section', 'Preserves thousands of years of climatic data', ['Sample Turntable Bed'], 'Sample destroyed', []);

    // 8. LASER GANTRY (CARRIAGE)
    const gantryGroup = new THREE.Group();
    const bridgeShape = new THREE.Shape();
    bridgeShape.moveTo(-2, -6);
    bridgeShape.lineTo(2, -6);
    bridgeShape.lineTo(1.5, 6);
    bridgeShape.lineTo(-1.5, 6);
    
    const bridgeExtrude = new THREE.ExtrudeGeometry(bridgeShape, { depth: 2, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.2 });
    const bridge = new THREE.Mesh(bridgeExtrude, darkSteel);
    bridge.rotation.x = Math.PI / 2;
    bridge.position.set(0, 4, 1);
    gantryGroup.add(bridge);
    
    // Magnetic Coils for Levitation
    for(let i = -1; i <= 1; i+=2) {
        const coilG = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
        const coilL = new THREE.Mesh(coilG, copper);
        coilL.rotation.y = Math.PI / 2;
        coilL.position.set(-1.5, -0.5, i * 5);
        
        const coilR = new THREE.Mesh(coilG, copper);
        coilR.rotation.y = Math.PI / 2;
        coilR.position.set(1.5, -0.5, i * 5);
        
        gantryGroup.add(coilL, coilR);
    }

    addPart('Laser Gantry Bridge', gantryGroup, 'Mag-lev structural bridge', 'Moves seamlessly over the sample carrying sensor payloads', ['Optical Magnetic Rails'], 'Gantry collapse', ['Laser Core Module', 'Sensor Array']);
    animatables.push({ obj: gantryGroup, type: 'oscX', speed: 0.8, amp: 10 });

    // 9. LASER CORE MODULE
    const laserCore = new THREE.Group();
    const coreBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 3, 32), aluminum);
    coreBody.position.set(0, 2, 0);
    
    // Cooling fins on core
    for(let i=0; i<12; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 0.1), steel);
        const ang = (i/12)*Math.PI*2;
        fin.rotation.y = ang;
        fin.position.set(0, 2, 0);
        laserCore.add(fin);
    }

    // Focusing Lens array
    const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), glass);
    lens1.position.set(0, 0.2, 0);
    const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32), tinted);
    lens2.position.set(0, -0.2, 0);
    const lens3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), glowingBlue);
    lens3.position.set(0, -0.5, 0);

    laserCore.add(coreBody, lens1, lens2, lens3);
    gantryGroup.add(laserCore);
    addPart('Laser Core Module', laserCore, 'Multi-spectral photon emitter', 'Fires specific wavelengths to measure lignin and cellulose density', ['Laser Gantry Bridge'], 'Laser misfire', ['Primary Scan Beam']);

    // 10. PRIMARY SCAN BEAM
    const scanBeamGroup = new THREE.Group();
    const mainBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.15, 3, 32), laserMat);
    mainBeam.position.set(0, -2, 0);
    
    // Secondary alignment beams
    const alignBeam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3, 16), blueLaserMat);
    alignBeam1.position.set(0.5, -2, 0);
    const alignBeam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 3, 16), blueLaserMat);
    alignBeam2.position.set(-0.5, -2, 0);
    
    scanBeamGroup.add(mainBeam, alignBeam1, alignBeam2);
    laserCore.add(scanBeamGroup);
    addPart('Primary Scan Beam', scanBeamGroup, 'Sub-micron focused laser array', 'Penetrates wood surface for internal cell mapping', ['Laser Core Module'], 'No data collection', []);
    animatables.push({ obj: mainBeam, type: 'pulseOpacity', speed: 15 });
    animatables.push({ obj: alignBeam1, type: 'pulseOpacity', speed: 12 });
    animatables.push({ obj: alignBeam2, type: 'pulseOpacity', speed: 12 });

    // 11. SENSOR ARRAY & CAMERAS
    const sensorGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const camG = new THREE.Group();
        const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 1), plastic);
        const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), glass);
        camLens.rotation.x = Math.PI/2;
        camLens.position.set(0, 0, 0.6);
        camG.add(camBody, camLens);
        
        const ang = (i/4)*Math.PI*2 + Math.PI/4;
        camG.position.set(Math.cos(ang)*2.2, 0, Math.sin(ang)*2.2);
        camG.lookAt(0, -3, 0);
        sensorGroup.add(camG);
    }
    laserCore.add(sensorGroup);
    addPart('Multispectral Sensor Array', sensorGroup, '4K High-speed optical cameras', 'Captures visual spectrum data of the tree rings', ['Laser Core Module'], 'Missing visual mapping', []);

    // 12. DATA PROCESSING RACK
    const rackGroup = new THREE.Group();
    const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 4), darkSteel);
    rackFrame.position.set(0, 5, 0);
    rackGroup.add(rackFrame);
    
    // Servers inside rack
    for(let i=1; i<9; i++) {
        const server = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 3.8), aluminum);
        server.position.set(0, i * 1.1, 0);
        
        // Blinking lights
        const led1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), orangeIndicator);
        led1.position.set(1.5, i*1.1, 1.95);
        const led2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), glowingBlue);
        led2.position.set(1.2, i*1.1, 1.95);
        
        rackGroup.add(server, led1, led2);
        animatables.push({ obj: led1, type: 'blink', speed: Math.random() * 5 + 5 });
        animatables.push({ obj: led2, type: 'blink', speed: Math.random() * 5 + 5 });
    }
    rackGroup.position.set(18, -4, -10);
    addPart('Data Processing Server Rack', rackGroup, 'Petabyte-scale supercomputing node', 'Processes point-cloud data from the laser scans in real-time', ['Massive Base Chassis'], 'System crash', ['Control Console Interface']);

    // 13. CONTROL CONSOLE INTERFACE
    const consoleGroup = new THREE.Group();
    const conBase = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 3), darkSteel);
    conBase.position.set(0, 2, 0);
    
    const conDesk = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 4), plastic);
    conDesk.position.set(0, 4, 1);
    conDesk.rotation.x = Math.PI / 16;
    
    consoleGroup.add(conBase, conDesk);
    consoleGroup.position.set(18, -4, 5);
    consoleGroup.rotation.y = -Math.PI / 4;
    addPart('Control Console Interface', consoleGroup, 'Operator command station', 'Provides human interface to the scanner', ['Data Processing Server Rack'], 'Loss of control', ['Holographic Display', 'Tactile Keyboard']);

    // 14. HOLOGRAPHIC DISPLAY
    const displayGroup = new THREE.Group();
    const dStand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 16), aluminum);
    dStand.position.set(0, 5, -0.5);
    
    const dScreen = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 0.2), darkSteel);
    dScreen.position.set(0, 6.5, -0.5);
    
    const holoPlane = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.3, 0.1), greenScreenMat);
    holoPlane.position.set(0, 6.5, -0.35);

    // Floating UI elements
    for(let i=0; i<15; i++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, Math.random()*2 + 0.5, 0.1), orangeIndicator);
        bar.position.set(-2.5 + (i*0.3), 5.5, -0.2);
        displayGroup.add(bar);
        animatables.push({ obj: bar, type: 'equalizer', speed: 2 + Math.random()*4, baseY: 5.5 });
    }
    
    const graphLine = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 6.5, -0.2), new THREE.Vector3(1, 7, -0.2), new THREE.Vector3(2, 6.2, -0.2), new THREE.Vector3(2.5, 7.5, -0.2)
    ]), 20, 0.05, 8, false), glowingBlue);
    displayGroup.add(graphLine);

    displayGroup.add(dStand, dScreen, holoPlane);
    consoleGroup.add(displayGroup);
    addPart('Holographic Display', displayGroup, 'Curved 8K transparent OLED monitor', 'Displays ring width graphs and density models', ['Control Console Interface'], 'Cannot read data', []);

    // 15. TACTILE KEYBOARD & JOYSTICKS
    const kbGroup = new THREE.Group();
    const kbBoard = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 1.5), steel);
    kbGroup.add(kbBoard);
    
    // 100+ tiny keys
    for(let row = -0.5; row <= 0.5; row += 0.25) {
        for(let col = -1.3; col <= 1.3; col += 0.2) {
            const key = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.15), plastic);
            key.position.set(col, 0.15, row);
            kbGroup.add(key);
        }
    }
    
    // Dual Joysticks for manual gantry override
    const joyL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.6, 16), chrome);
    joyL.position.set(-1.8, 0.3, 0);
    joyL.rotation.x = Math.PI/8;
    const joyR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.6, 16), chrome);
    joyR.position.set(1.8, 0.3, 0);
    joyR.rotation.x = Math.PI/8;
    
    const knobL = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), orangeIndicator);
    knobL.position.set(-1.8, 0.6, 0.1);
    const knobR = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), glowingBlue);
    knobR.position.set(1.8, 0.6, 0.1);
    
    kbGroup.add(joyL, joyR, knobL, knobR);
    kbGroup.position.set(0, 4.3, 1.2);
    kbGroup.rotation.x = Math.PI/16;
    consoleGroup.add(kbGroup);
    addPart('Tactile Keyboard & Joysticks', kbGroup, 'Operator input arrays', 'Manual override and fine-tuning of laser intensity', ['Control Console Interface'], 'Input locked', []);
    animatables.push({ obj: joyL, type: 'wobble', speed: 2, axis: 'x' });
    animatables.push({ obj: joyR, type: 'wobble', speed: 3, axis: 'z' });

    // 16. INDUSTRIAL COOLING SYSTEM
    const coolingGroup = new THREE.Group();
    const coolBox = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 8), aluminum);
    coolBox.position.set(-22, -1, 0);
    coolingGroup.add(coolBox);
    
    // Huge exhaust fans
    for(let f = -2.5; f <= 2.5; f += 2.5) {
        const fanGrp = new THREE.Group();
        const fanHole = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), darkSteel);
        fanHole.rotation.z = Math.PI/2;
        fanGrp.add(fanHole);
        
        const fCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16), chrome);
        fCenter.rotation.z = Math.PI/2;
        fanGrp.add(fCenter);
        
        for(let b=0; b<12; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.4), plastic);
            const ang = (b/12)*Math.PI*2;
            blade.position.set(0, Math.cos(ang)*0.6, Math.sin(ang)*0.6);
            blade.rotation.x = -ang;
            blade.rotation.y = Math.PI/4;
            fanGrp.add(blade);
        }
        fanGrp.position.set(-20, 0, f);
        coolingGroup.add(fanGrp);
        animatables.push({ obj: fanGrp, type: 'rotateX', speed: 25 });
    }
    addPart('Industrial Cooling System', coolingGroup, 'Liquid nitrogen chilled heat exchangers', 'Prevents the laser core from melting during deep scans', ['Massive Base Chassis'], 'Overheating meltdown', ['Laser Core Module']);

    // 17. MASSIVE FIBER OPTIC CABLE BUNDLE
    const bundleGroup = new THREE.Group();
    
    // Generate 10 winding cables connecting Rack to Gantry
    for(let i=0; i<10; i++) {
        const start = new THREE.Vector3(18, -4 + Math.random(), -10 + Math.random());
        const mid1 = new THREE.Vector3(15, -6, -5 + i);
        const mid2 = new THREE.Vector3(-5, -6, -2);
        const end = new THREE.Vector3(-2, 4, 0); // loosely tracking gantry
        
        const path = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
        const r = 0.05 + Math.random()*0.05;
        const tubeG = new THREE.TubeGeometry(path, 64, r, 8, false);
        const mat = (i%3 === 0) ? rubber : (i%3 === 1 ? copper : glowingBlue);
        const tubeM = new THREE.Mesh(tubeG, mat);
        bundleGroup.add(tubeM);
    }
    addPart('Fiber Optic Cable Bundle', bundleGroup, 'High-bandwidth data umbilicals', 'Streams terabytes of scan data per second to the server', ['Data Processing Server Rack', 'Laser Gantry Bridge'], 'Data stream severed', ['Holographic Display']);

    // 18. SAFETY ENCLOSURE CAGE
    const cageGroup = new THREE.Group();
    // 4 Corner pillars
    const pilPos = [[-16, -7], [16, -7], [-16, 7], [16, 7]];
    pilPos.forEach(p => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(1, 14, 1), darkSteel);
        pillar.position.set(p[0], 3, p[1]);
        cageGroup.add(pillar);
    });
    
    // Top Frame
    const topFrame1 = new THREE.Mesh(new THREE.BoxGeometry(33, 1, 1), darkSteel);
    topFrame1.position.set(0, 10, -7);
    const topFrame2 = new THREE.Mesh(new THREE.BoxGeometry(33, 1, 1), darkSteel);
    topFrame2.position.set(0, 10, 7);
    const topFrame3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 15), darkSteel);
    topFrame3.position.set(-16, 10, 0);
    const topFrame4 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 15), darkSteel);
    topFrame4.position.set(16, 10, 0);
    cageGroup.add(topFrame1, topFrame2, topFrame3, topFrame4);

    // Tinted Glass Panels
    const glassF = new THREE.Mesh(new THREE.BoxGeometry(32, 13, 0.2), tinted);
    glassF.position.set(0, 3, 7);
    const glassB = new THREE.Mesh(new THREE.BoxGeometry(32, 13, 0.2), tinted);
    glassB.position.set(0, 3, -7);
    const glassL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 13, 14), tinted);
    glassL.position.set(-16, 3, 0);
    const glassR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 13, 14), tinted);
    glassR.position.set(16, 3, 0);
    cageGroup.add(glassF, glassB, glassL, glassR);

    // Warning decals (simulated with emissive orange strips)
    const warningStrip = new THREE.Mesh(new THREE.BoxGeometry(32, 0.5, 0.3), orangeIndicator);
    warningStrip.position.set(0, 9, 7);
    cageGroup.add(warningStrip);

    addPart('Safety Enclosure Cage', cageGroup, 'Laser-absorbent poly-glass housing', 'Protects operators from stray photon bursts and maintains internal climate', ['Massive Base Chassis'], 'Hazardous laser exposure', []);

    // --- ANIMATION LOGIC ---
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        animatables.forEach(anim => {
            if (anim.type === 'rotateY') {
                anim.obj.rotation.y = t * anim.speed;
            } else if (anim.type === 'rotateX') {
                anim.obj.rotation.x = t * anim.speed;
            } else if (anim.type === 'oscX') {
                anim.obj.position.x = Math.sin(t * anim.speed) * anim.amp;
            } else if (anim.type === 'pulseOpacity') {
                // Flickering effect
                anim.obj.material.opacity = 0.5 + Math.sin(t * anim.speed) * 0.5;
            } else if (anim.type === 'equalizer') {
                const s = 1 + Math.sin(t * anim.speed) * 0.8 + Math.random()*0.5;
                anim.obj.scale.y = s;
                anim.obj.position.y = anim.baseY + ((s-1) * 0.5); 
            } else if (anim.type === 'blink') {
                anim.obj.material.emissiveIntensity = Math.sin(t * anim.speed) > 0.5 ? 5 : 0;
            } else if (anim.type === 'wobble') {
                if(anim.axis === 'x') anim.obj.rotation.x = Math.PI/8 + Math.sin(t * anim.speed)*0.2;
                if(anim.axis === 'z') anim.obj.rotation.z = Math.sin(t * anim.speed)*0.2;
            }
        });
    }

    const description = "The Paleoclimatology Dendrochronology Scanner is a monumental, highly advanced scientific apparatus engineered to read climatic history encoded in ancient tree rings. Utilizing a multispectral photon emitter gliding over ultra-precise magnetic levitation optical rails, it captures nanometer-scale variations in lignin and cellulose density. Integrated supercomputing racks process petabytes of 3D topological data in real time, projecting historical weather patterns spanning millennia onto a curved holographic display.";
    
    const quizQuestions = [
        {
            question: "What specific physiological properties of the tree ring does the laser array measure?",
            options: ["Isotope half-life", "Lignin and cellulose density", "Bark fungal infections", "Root depth estimates"],
            answer: 1,
            explanation: "The lasers penetrate the wood surface to measure the cellular density of lignin and cellulose, which correlates to temperature and moisture during the tree's growth year."
        },
        {
            question: "How does the system ensure zero-friction movement for the massive laser gantry?",
            options: ["Heavy lubrication oils", "Rubber wheels on steel tracks", "Super-cooled magnetic levitation tracks", "Hovercraft fans"],
            answer: 2,
            explanation: "To achieve nanometer-scale precision, mechanical friction is eliminated entirely using magnetic levitation (mag-lev) technology."
        },
        {
            question: "Why is a liquid nitrogen industrial cooling system integrated into the apparatus?",
            options: ["To preserve the ancient wood sample from rotting", "To cool the multi-spectral laser core and prevent meltdowns", "To keep the operator comfortable", "To freeze the hydraulic fluids"],
            answer: 1,
            explanation: "The extreme energy required to fire the sub-micron focused lasers generates immense heat; liquid nitrogen heat exchangers dissipate this to prevent core meltdown."
        },
        {
            question: "What is the purpose of the Hydraulic Suspension System located beneath the base chassis?",
            options: ["To raise the machine for cleaning", "To neutralize environmental micro-seismic vibrations", "To weigh the machine down", "To extract water from the soil"],
            answer: 1,
            explanation: "Even microscopic tremors from distant traffic or seismic activity can ruin a scan. The active hydraulic pillars cancel out these vibrations."
        },
        {
            question: "What role does the Data Processing Server Rack play in the scanning process?",
            options: ["It powers the cooling fans", "It stores the operator's manuals", "It processes petabytes of point-cloud laser data into readable climatic models in real-time", "It translates ancient languages found in the bark"],
            answer: 2,
            explanation: "The high-speed optical cameras and lasers generate an overwhelming amount of raw data. The local supercomputing node is required to process this point-cloud data instantly."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createDendrochronologyScanner() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
