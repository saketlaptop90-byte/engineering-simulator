import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for High-Tech feel
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0033ff, emissive: 0x0055ff, emissiveIntensity: 2 });
    const emissiveGreen = new THREE.MeshStandardMaterial({ color: 0x00ff33, emissive: 0x00ff55, emissiveIntensity: 2 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff3300, emissiveIntensity: 2 });
    const emissiveYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 2 });
    const holoMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.2, transparent: true, opacity: 0.8, wireframe: true, side: THREE.DoubleSide });
    const goldPlated = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.2 });

    const animatedMeshes = {
        holoDNA: [],
        pumpTurbines: [],
        stageXYZ: null,
        scanners: [],
        electronBeam: null,
        statusLights: [],
        controlButtons: [],
        joystick: null
    };

    // Helper: Create Flange with bolts
    function createFlange(radius, thickness, bolts, mat) {
        const flangeGroup = new THREE.Group();
        const flangeGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32);
        const flange = new THREE.Mesh(flangeGeo, mat);
        flangeGroup.add(flange);

        const boltGeo = new THREE.CylinderGeometry(radius * 0.05, radius * 0.05, thickness * 1.5, 6);
        for(let i=0; i<bolts; i++) {
            const angle = (i / bolts) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, darkSteel);
            bolt.position.set(Math.cos(angle) * radius * 0.85, 0, Math.sin(angle) * radius * 0.85);
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    // 1. Base Damping Legs
    const baseGroup = new THREE.Group();
    const legPositions = [ [-2.5, -2.5], [2.5, -2.5], [2.5, 2.5], [-2.5, 2.5] ];
    const legGeo = new THREE.CylinderGeometry(0.4, 0.6, 2.5, 32);
    legPositions.forEach(pos => {
        const legGroup = new THREE.Group();
        const leg = new THREE.Mesh(legGeo, steel);
        leg.position.set(pos[0], 1.25, pos[1]);
        legGroup.add(leg);
        
        // Add intricate damping springs (coils) around the leg
        const curve = new THREE.CatmullRomCurve3(
            new Array(60).fill(0).map((_, i) => {
                const y = (i / 59) * 2.0 - 1.0;
                const r = 0.7;
                const theta = i * Math.PI * 2.5;
                return new THREE.Vector3(pos[0] + Math.cos(theta)*r, 1.25 + y, pos[1] + Math.sin(theta)*r);
            })
        );
        const springGeo = new THREE.TubeGeometry(curve, 150, 0.08, 12, false);
        const spring = new THREE.Mesh(springGeo, chrome);
        legGroup.add(spring);

        // Add hydraulic pistons adjacent to legs
        const pistonGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
        const piston = new THREE.Mesh(pistonGeo, darkSteel);
        piston.position.set(pos[0]*0.7, 1.25, pos[1]*0.7);
        legGroup.add(piston);

        baseGroup.add(legGroup);
    });
    
    // Lower Deck platform - heavily detailed
    const deckGeo = new THREE.BoxGeometry(6, 0.6, 6);
    const deck = new THREE.Mesh(deckGeo, darkSteel);
    deck.position.set(0, 2.8, 0);
    
    // Add grid pattern to deck top
    const gridGeo = new THREE.PlaneGeometry(5.8, 5.8, 20, 20);
    const gridMat = new THREE.MeshStandardMaterial({color: 0x333333, wireframe: true});
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.31;
    deck.add(grid);
    baseGroup.add(deck);

    parts.push({
        name: "Pneumatic Damping Isolation Base",
        description: "Advanced active-cancellation pneumatic and spring-loaded isolation legs to nullify seismic, acoustic, and thermal disturbances at the sub-nanometer scale.",
        material: steel,
        function: "Vibration Isolation",
        assemblyOrder: 1,
        connections: ["Vacuum Support Deck"],
        failureEffect: "Catastrophic image blurring during atomic resolution scans.",
        cascadeFailures: ["Stage misalignment", "Beam drift"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 2. Sample Chamber
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(0, 5, 0);
    
    // Complex spherical-octahedral hybrid chamber
    const chamberGeo = new THREE.IcosahedronGeometry(2.0, 3);
    const chamber = new THREE.Mesh(chamberGeo, aluminum);
    chamberGroup.add(chamber);
    
    // Add flanges to the chamber top and bottom
    const topFlange = createFlange(1.5, 0.3, 24, steel);
    topFlange.position.set(0, 1.85, 0);
    chamberGroup.add(topFlange);

    const bottomFlange = createFlange(1.5, 0.3, 24, steel);
    bottomFlange.position.set(0, -1.85, 0);
    chamberGroup.add(bottomFlange);

    // Exoskeleton cage around chamber for structural integrity under extreme vacuum
    const cageGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 4, 12);
        const pillar = new THREE.Mesh(pillarGeo, darkSteel);
        pillar.position.set(Math.cos(angle)*2.2, 0, Math.sin(angle)*2.2);
        cageGroup.add(pillar);
        
        // crossbeams
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
        beamGeo.rotateZ(Math.PI/2);
        beamGeo.rotateY(-angle - Math.PI/12);
        const beam1 = new THREE.Mesh(beamGeo, darkSteel);
        beam1.position.set(Math.cos(angle + Math.PI/12)*2.1, 1.2, Math.sin(angle + Math.PI/12)*2.1);
        cageGroup.add(beam1);
        const beam2 = beam1.clone();
        beam2.position.y = -1.2;
        cageGroup.add(beam2);
    }
    chamberGroup.add(cageGroup);

    // Front motorized airlock door for sample insertion
    const doorGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.3, 32);
    doorGeo.rotateX(Math.PI/2);
    const door = new THREE.Mesh(doorGeo, chrome);
    door.position.set(0, 0, 1.9);
    
    const windowGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 32);
    windowGeo.rotateX(Math.PI/2);
    const doorWindow = new THREE.Mesh(windowGeo, tinted);
    door.add(doorWindow);
    
    // Door hinges and hydraulics
    const hingeGeo = new THREE.BoxGeometry(0.2, 0.8, 0.4);
    const hingeL = new THREE.Mesh(hingeGeo, steel);
    hingeL.position.set(-1.1, 0, 1.8);
    chamberGroup.add(hingeL);
    
    chamberGroup.add(door);

    parts.push({
        name: "Ultra-High Vacuum Sample Chamber",
        description: "Reinforced spherical-icosahedron containment vessel where xenobiological samples are suspended in a complete vacuum for electron bombardment.",
        material: aluminum,
        function: "Vacuum Containment",
        assemblyOrder: 5,
        connections: ["Base Support", "Electron Column", "Vacuum Pumps"],
        failureEffect: "Loss of vacuum leading to electron scattering, arc flashes, and total system shutdown.",
        cascadeFailures: ["Electron Gun Burnout", "Sample Oxidation"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 8 }
    });

    // 3. 5-Axis Piezoelectric Stage (Inside Chamber)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -0.8, 0);
    
    const stageBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.3, 32), darkSteel);
    
    // Rotational stage (R)
    const stageR = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32), copper);
    stageR.position.set(0, 0.25, 0);
    
    // Tilt stage (T)
    const stageTGroup = new THREE.Group();
    stageTGroup.position.set(0, 0.15, 0);
    const stageT = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), steel);
    stageTGroup.add(stageT);
    
    // Y stage
    const stageY = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 1.0), aluminum);
    stageY.position.set(0, 0.1, 0);
    
    // X stage
    const stageX = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), darkSteel);
    stageX.position.set(0, 0.1, 0);
    
    // Z stage (Sample holder)
    const stageZ = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32), chrome);
    stageZ.position.set(0, 0.15, 0);
    
    // Alien sample on stage (Glowing complex geometry)
    const sampleGeo = new THREE.TorusKnotGeometry(0.15, 0.04, 64, 16, 2, 5);
    const sample = new THREE.Mesh(sampleGeo, emissiveGreen);
    sample.position.set(0, 0.25, 0);
    stageZ.add(sample);
    animatedMeshes.stageXYZ = stageGroup; // Animate slightly to simulate scanning
    animatedMeshes.scanners.push(sample);
    
    stageX.add(stageZ);
    stageY.add(stageX);
    stageTGroup.add(stageY);
    stageR.add(stageTGroup);
    stageBase.add(stageR);
    stageGroup.add(stageBase);
    chamberGroup.add(stageGroup);

    parts.push({
        name: "5-Axis Piezoelectric Goniometer Stage",
        description: "Nanometer-precision XYZ-Tilt-Rotate positioning system allowing comprehensive topographic imaging of complex alien cellular structures.",
        material: chrome,
        function: "Sample Manipulation",
        assemblyOrder: 6,
        connections: ["Sample Chamber"],
        failureEffect: "Unable to focus on or target specific regions of interest.",
        cascadeFailures: ["Data correlation errors"],
        originalPosition: { x: 0, y: 4.2, z: 0 },
        explodedPosition: { x: -6, y: 4.2, z: 0 }
    });

    // 4. Turbo Molecular Pump
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(-2.0, -0.5, 0);
    pumpGroup.rotation.z = Math.PI / 2;
    
    const pumpBodyGeo = new THREE.CylinderGeometry(0.7, 0.6, 1.8, 32);
    const pumpBody = new THREE.Mesh(pumpBodyGeo, steel);
    pumpGroup.add(pumpBody);
    
    // Pump fins (Highly detailed turbines)
    const turbineGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const y = -0.7 + i*0.12;
        const radius = 0.55 - i*0.015;
        for(let j=0; j<16; j++) {
            const bladeGeo = new THREE.BoxGeometry(radius*2, 0.02, 0.15);
            const blade = new THREE.Mesh(bladeGeo, chrome);
            blade.position.y = y;
            blade.rotation.y = (j / 16) * Math.PI * 2;
            blade.rotation.x = Math.PI / 5; // aggressive pitch
            turbineGroup.add(blade);
        }
    }
    pumpGroup.add(turbineGroup);
    animatedMeshes.pumpTurbines.push(turbineGroup);
    
    // Massive Exhaust pipe to backing pump
    const curvePipe = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.9, 0),
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(-1.5, -2.5, 0),
        new THREE.Vector3(-2.0, -4.5, 0)
    ]);
    const pipeGeo = new THREE.TubeGeometry(curvePipe, 32, 0.2, 16, false);
    const pipe = new THREE.Mesh(pipeGeo, copper);
    pumpGroup.add(pipe);

    chamberGroup.add(pumpGroup);

    parts.push({
        name: "Magnetic Levitation Turbo Molecular Pump",
        description: "Spinning at 120,000 RPM on magnetic bearings, it aggressively ejects gas molecules to maintain 10^-10 Torr vacuum levels.",
        material: steel,
        function: "Vacuum Generation",
        assemblyOrder: 4,
        connections: ["Sample Chamber", "Roughing Pump"],
        failureEffect: "Immediate pressure spike causing lethal arcing in the high-voltage column.",
        cascadeFailures: ["Electron Gun Burnout", "Sensor Destruction"],
        originalPosition: { x: -2.0, y: 4.5, z: 0 },
        explodedPosition: { x: -8, y: 4.5, z: -6 }
    });

    // 5. Array of Detectors (SE, EDX, BSE)
    const createDetector = (radius, length, angleX, angleY, mat, glowMat) => {
        const dGroup = new THREE.Group();
        const bodyGeo = new THREE.CylinderGeometry(radius, radius*1.5, length, 24);
        bodyGeo.translate(0, length/2, 0);
        const body = new THREE.Mesh(bodyGeo, mat);
        dGroup.add(body);
        
        const tipGeo = new THREE.CylinderGeometry(radius*0.2, radius, length*0.5, 24);
        tipGeo.translate(0, -length*0.25, 0);
        const tip = new THREE.Mesh(tipGeo, chrome);
        dGroup.add(tip);

        const glow = new THREE.Mesh(new THREE.SphereGeometry(radius*0.3, 16, 16), glowMat);
        glow.position.set(0, -length*0.6, 0);
        dGroup.add(glow);
        animatedMeshes.statusLights.push(glow);

        dGroup.rotation.x = angleX;
        dGroup.rotation.y = angleY;
        
        // Detailed cooling ribs
        for(let i=0; i<8; i++) {
            const rib = new THREE.Mesh(new THREE.TorusGeometry(radius*1.25, 0.05, 16, 32), darkSteel);
            rib.position.y = length * 0.3 + i * 0.12;
            rib.rotation.x = Math.PI/2;
            dGroup.add(rib);
        }

        // Data cabling
        const cableGeo = new THREE.TorusGeometry(radius*1.4, 0.03, 8, 32, Math.PI);
        const cable = new THREE.Mesh(cableGeo, rubber);
        cable.position.y = length * 0.8;
        dGroup.add(cable);

        return dGroup;
    };

    const seDetector = createDetector(0.2, 1.8, Math.PI/3, Math.PI/4, aluminum, emissiveBlue);
    seDetector.position.set(1.2, 0.8, 1.2);
    chamberGroup.add(seDetector);

    const edxDetector = createDetector(0.25, 2.2, Math.PI/4, -Math.PI/4, darkSteel, emissiveRed);
    edxDetector.position.set(-1.2, 1.0, 1.2);
    chamberGroup.add(edxDetector);

    const bseDetector = createDetector(0.15, 1.5, Math.PI/6, Math.PI, steel, emissiveYellow);
    bseDetector.position.set(0, 1.5, -1.4);
    chamberGroup.add(bseDetector);

    parts.push({
        name: "Everhart-Thornley Secondary Electron Detector",
        description: "Captures low-energy electrons utilizing a scintillator and photomultiplier tube to generate pristine 3D topographic images.",
        material: aluminum,
        function: "Topographical Imaging",
        assemblyOrder: 7,
        connections: ["Sample Chamber", "Image Processor"],
        failureEffect: "Complete loss of visual surface imaging.",
        cascadeFailures: [],
        originalPosition: { x: 1.2, y: 5.8, z: 1.2 },
        explodedPosition: { x: 6, y: 8, z: 6 }
    });
    
    parts.push({
        name: "Silicon Drift X-Ray (EDX) Spectrometer",
        description: "Detects characteristic X-rays emitted from the sample to accurately map the elemental chemistry of alien biology.",
        material: darkSteel,
        function: "Chemical Analysis",
        assemblyOrder: 8,
        connections: ["Sample Chamber", "Liquid Nitrogen Cooling"],
        failureEffect: "Inability to determine the atomic makeup of the xenobiological entity.",
        cascadeFailures: [],
        originalPosition: { x: -1.2, y: 6.0, z: 1.2 },
        explodedPosition: { x: -6, y: 8, z: 6 }
    });

    // 6. Giant Electron Column (Huge Lathe Geometry)
    const columnGroup = new THREE.Group();
    columnGroup.position.set(0, 7.0, 0); // Above chamber

    const columnPoints = [];
    // Generate complex profile for lathe describing a multi-stage magnetic lens stack
    columnPoints.push(new THREE.Vector2(1.5, 0)); // Base flange connecting to chamber
    columnPoints.push(new THREE.Vector2(1.5, 0.3));
    columnPoints.push(new THREE.Vector2(1.0, 0.3));
    columnPoints.push(new THREE.Vector2(1.0, 1.5)); // Objective lens section
    columnPoints.push(new THREE.Vector2(1.3, 1.8));
    columnPoints.push(new THREE.Vector2(1.3, 2.2));
    columnPoints.push(new THREE.Vector2(1.0, 2.5));
    columnPoints.push(new THREE.Vector2(1.0, 3.5)); // Condenser 3
    columnPoints.push(new THREE.Vector2(1.2, 3.8));
    columnPoints.push(new THREE.Vector2(1.2, 4.2));
    columnPoints.push(new THREE.Vector2(0.9, 4.5));
    columnPoints.push(new THREE.Vector2(0.9, 5.5)); // Condenser 2
    columnPoints.push(new THREE.Vector2(1.1, 5.8));
    columnPoints.push(new THREE.Vector2(1.1, 6.2));
    columnPoints.push(new THREE.Vector2(0.8, 6.5));
    columnPoints.push(new THREE.Vector2(0.8, 7.5)); // Condenser 1
    columnPoints.push(new THREE.Vector2(0.9, 7.8));
    columnPoints.push(new THREE.Vector2(0.9, 8.2));
    columnPoints.push(new THREE.Vector2(0.7, 8.5));
    columnPoints.push(new THREE.Vector2(0.7, 9.5)); // Gun isolation valve
    
    const columnGeo = new THREE.LatheGeometry(columnPoints, 64);
    const column = new THREE.Mesh(columnGeo, aluminum);
    columnGroup.add(column);

    // Add immense external electromagnetic coils (Torus) wrapping the column
    const addCoil = (y, radius, tube, colorMat) => {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 32, 64), colorMat);
        coil.position.y = y;
        coil.rotation.x = Math.PI / 2;
        columnGroup.add(coil);
    };

    addCoil(0.9, 1.15, 0.15, copper);
    addCoil(1.2, 1.15, 0.15, copper);
    addCoil(3.0, 1.15, 0.15, copper);
    addCoil(3.3, 1.15, 0.15, copper);
    addCoil(5.0, 1.05, 0.15, copper);
    addCoil(5.3, 1.05, 0.15, copper);
    addCoil(7.0, 0.95, 0.12, copper);
    addCoil(7.3, 0.95, 0.12, copper);

    // Intricate Hydraulic / Water Cooling Lines wrapping around the column
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5),
            new THREE.Vector3(Math.cos(angle)*1.1, 1.5, Math.sin(angle)*1.1),
            new THREE.Vector3(Math.cos(angle)*1.2, 3.8, Math.sin(angle)*1.2),
            new THREE.Vector3(Math.cos(angle)*1.0, 5.8, Math.sin(angle)*1.0),
            new THREE.Vector3(Math.cos(angle)*0.8, 8.2, Math.sin(angle)*0.8),
            new THREE.Vector3(Math.cos(angle)*0.7, 9.5, Math.sin(angle)*0.7)
        ]);
        const lineGeo = new THREE.TubeGeometry(lineCurve, 64, 0.06, 12, false);
        const line = new THREE.Mesh(lineGeo, steel);
        columnGroup.add(line);
    }

    parts.push({
        name: "Multipole Objective Lens Array",
        description: "A colossal series of water-cooled electromagnetic coils that generate a magnetic field strong enough to bend high-energy electrons into a focal point of 0.5 Angstroms.",
        material: copper,
        function: "Final Beam Focusing",
        assemblyOrder: 9,
        connections: ["Condenser Lens Stack", "Sample Chamber"],
        failureEffect: "Total loss of resolution, introducing severe spherical and chromatic astigmatism.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: -7 }
    });

    parts.push({
        name: "Triple Condenser Lens Assembly",
        description: "Three consecutive magnetic lenses that aggressively demagnify the electron source into a coherent probe beam.",
        material: aluminum,
        function: "Beam Demagnification",
        assemblyOrder: 10,
        connections: ["Electron Gun", "Objective Lens"],
        failureEffect: "Beam diffuses, catastrophically reducing signal-to-noise ratio.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: -7, y: 12, z: -7 }
    });

    // 7. Field Emission Electron Gun Assembly
    const gunGroup = new THREE.Group();
    gunGroup.position.set(0, 9.5, 0); // relative to columnGroup

    const gunBase = createFlange(1.1, 0.4, 16, steel);
    gunGroup.add(gunBase);

    // High Voltage Insulator Stack (Ceramic/Plastic rings)
    for(let i=0; i<8; i++) {
        const ringGeo = new THREE.TorusGeometry(0.7, 0.15, 16, 32);
        const ring = new THREE.Mesh(ringGeo, plastic);
        ring.position.y = 0.6 + i*0.25;
        ring.rotation.x = Math.PI / 2;
        gunGroup.add(ring);
    }
    
    // Corona Dome
    const gunTopGeo = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 32);
    const gunTop = new THREE.Mesh(gunTopGeo, chrome);
    gunTop.position.y = 3.2;
    
    const domeGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeo, chrome);
    dome.position.y = 0.75;
    gunTop.add(dome);
    gunGroup.add(gunTop);
    
    // Emitter Glow (Cold Cathode Tip)
    const emitterGlow = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), emissiveBlue);
    emitterGlow.position.y = 4.2;
    gunGroup.add(emitterGlow);
    animatedMeshes.statusLights.push(emitterGlow);

    // Extremely thick High Voltage Cabling
    const hvCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4.2, 0),
        new THREE.Vector3(0, 6.0, 0),
        new THREE.Vector3(-3, 8.0, -3),
        new THREE.Vector3(-6, 0, -6)
    ]);
    const hvGeo = new THREE.TubeGeometry(hvCurve, 64, 0.2, 16, false);
    const hvCable = new THREE.Mesh(hvGeo, rubber);
    gunGroup.add(hvCable);

    columnGroup.add(gunGroup);

    parts.push({
        name: "Cold Field Emission Electron Gun",
        description: "Utilizes extreme electric fields to rip electrons from a monocrystalline tungsten tip without heating, producing an incredibly bright, coherent beam.",
        material: chrome,
        function: "Electron Generation",
        assemblyOrder: 11,
        connections: ["Condenser Lenses", "300kV Generator"],
        failureEffect: "No electrons emitted, halting all scanning capabilities.",
        cascadeFailures: ["Ion Pump Overload"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: 0, y: 24, z: 0 }
    });

    parts.push({
        name: "300kV High Voltage Super-Cable",
        description: "Massively insulated, oil-filled transmission line delivering extreme voltage potential to accelerate the electron beam down the column.",
        material: rubber,
        function: "Extreme Power Transmission",
        assemblyOrder: 12,
        connections: ["Electron Gun", "Power Substation"],
        failureEffect: "Lethal dielectric breakdown, arcing, and instantaneous vaporization of the emitter assembly.",
        cascadeFailures: ["Total Power Grid Spike"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: -10, y: 22, z: -6 }
    });

    // 8. Operator Console & Holographic Display
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(7, 0, 7);
    consoleGroup.rotation.y = -Math.PI / 4;

    // Advanced Wrap-around Desk
    const deskGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32, 1, false, -Math.PI/3, Math.PI*(2/3));
    const desk = new THREE.Mesh(deskGeo, darkSteel);
    desk.position.set(0, 3.2, 2.5);
    consoleGroup.add(desk);

    // Desk Supports
    const supportGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 16);
    const supp1 = new THREE.Mesh(supportGeo, steel); supp1.position.set(-2.5, 1.6, 1); consoleGroup.add(supp1);
    const supp2 = new THREE.Mesh(supportGeo, steel); supp2.position.set(2.5, 1.6, 1); consoleGroup.add(supp2);
    const supp3 = new THREE.Mesh(supportGeo, steel); supp3.position.set(0, 1.6, 4); consoleGroup.add(supp3);

    // Multi-monitor array
    const createScreen = (w, h, mat, px, py, pz, rx, ry, rz) => {
        const sGroup = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w+0.1, h+0.1, 0.1), plastic);
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        screen.position.z = 0.055;
        sGroup.add(frame);
        sGroup.add(screen);
        sGroup.position.set(px, py, pz);
        sGroup.rotation.set(rx, ry, rz);
        return sGroup;
    };

    const screenCenter = createScreen(2.2, 1.4, emissiveBlue, 0, 4.2, 1.0, -0.15, 0, 0);
    const screenLeft = createScreen(1.8, 1.2, emissiveGreen, -2.1, 4.1, 1.6, -0.15, Math.PI/5, 0);
    const screenRight = createScreen(1.8, 1.2, emissiveRed, 2.1, 4.1, 1.6, -0.15, -Math.PI/5, 0);
    const screenTop = createScreen(2.0, 1.0, emissiveYellow, 0, 5.6, 0.8, 0.2, 0, 0);
    consoleGroup.add(screenCenter, screenLeft, screenRight, screenTop);

    // Complex Keyboard / Control Board
    const kbdGroup = new THREE.Group();
    kbdGroup.position.set(0, 3.3, 2.2);
    kbdGroup.rotation.x = -Math.PI / 10;
    const kbdBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.8), darkSteel);
    kbdGroup.add(kbdBase);
    
    // Hundreds of tiny buttons and sliders
    for(let i=0; i<60; i++) {
        const btnGeo = new THREE.BoxGeometry(0.06, 0.03, 0.06);
        let mat = plastic;
        if(i%7===0) mat = emissiveRed;
        else if(i%5===0) mat = emissiveBlue;
        else if(i%3===0) mat = emissiveYellow;
        
        const btn = new THREE.Mesh(btnGeo, mat);
        btn.position.set(-1.0 + (i%15)*0.14, 0.06, -0.25 + Math.floor(i/15)*0.18);
        kbdGroup.add(btn);
        if(mat !== plastic) animatedMeshes.controlButtons.push(btn);
    }
    
    // Trackball Joystick for Stage control
    const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.15, 32), steel);
    joyBase.position.set(1.6, 3.3, 2.0);
    consoleGroup.add(joyBase);
    const joyStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16), chrome);
    joyStick.position.set(1.6, 3.6, 2.0);
    consoleGroup.add(joyStick);
    animatedMeshes.joystick = joyStick;

    consoleGroup.add(kbdGroup);

    // Operator Chair with mechanical arms
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 4.0);
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.2, 32), darkSteel);
    chairGroup.add(chairBase);
    const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16), chrome);
    chairPole.position.y = 0.85;
    chairGroup.add(chairPole);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.4), plastic);
    seat.position.y = 1.6;
    chairGroup.add(seat);
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.2), plastic);
    backrest.position.set(0, 2.6, 0.6);
    chairGroup.add(backrest);
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 1.0), darkSteel);
    armL.position.set(-0.8, 2.1, 0);
    chairGroup.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 1.0), darkSteel);
    armR.position.set(0.8, 2.1, 0);
    chairGroup.add(armR);
    consoleGroup.add(chairGroup);

    // Huge Holographic Projector mounted on ceiling/stand above console
    const holoProjector = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.4, 32), chrome);
    holoProjector.position.set(0, 6.5, 1.0);
    consoleGroup.add(holoProjector);

    // The Hologram (Complex Xenobiological structure)
    const holoGroup = new THREE.Group();
    holoGroup.position.set(0, 7.8, 1.0);
    
    // Rotating intricate geometries
    const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.15, 200, 32, 4, 7);
    const dnaHolo = new THREE.Mesh(dnaGeo, holoMat);
    holoGroup.add(dnaHolo);
    
    // Holographic Light Cone
    const coneGeo = new THREE.ConeGeometry(1.6, 3.5, 32);
    const coneHolo = new THREE.Mesh(coneGeo, new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide, blending: THREE.AdditiveBlending}));
    coneHolo.position.set(0, -1.8, 0);
    holoGroup.add(coneHolo);

    animatedMeshes.holoDNA.push(dnaHolo);

    // Floating data rings and spheres
    for(let i=0; i<4; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2 + i*0.25, 0.02, 16, 64), holoMat);
        ring.rotation.x = Math.PI/2;
        holoGroup.add(ring);
        animatedMeshes.holoDNA.push(ring);
        
        const dataNode = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 1), holoMat);
        dataNode.position.set(Math.cos(i)*1.5, Math.sin(i), Math.sin(i)*1.5);
        holoGroup.add(dataNode);
        animatedMeshes.holoDNA.push(dataNode);
    }
    
    consoleGroup.add(holoGroup);
    group.add(consoleGroup);

    parts.push({
        name: "Command and Visualization Console",
        description: "Ergonomic workstation featuring manual piezoelectric overrides and an array of real-time multi-spectral analysis monitors.",
        material: plastic,
        function: "User Interface & Control",
        assemblyOrder: 13,
        connections: ["Main Processors", "Stage Controllers"],
        failureEffect: "Loss of user control, reverting system to autonomous abort mode.",
        cascadeFailures: [],
        originalPosition: { x: 7, y: 0, z: 7 },
        explodedPosition: { x: 12, y: 0, z: 12 }
    });

    parts.push({
        name: "Volumetric Xenobiological Hologram",
        description: "Projects immense, complex molecular geometries derived in real-time from electron scattering arrays, allowing researchers to walk around alien DNA.",
        material: goldPlated, // Abstract material for part listing
        function: "Spatial Data Visualization",
        assemblyOrder: 14,
        connections: ["Operator Console", "Data Trunks"],
        failureEffect: "Inability to intuitively interpret complex multi-dimensional protein folds.",
        cascadeFailures: [],
        originalPosition: { x: 7, y: 7.8, z: 8 },
        explodedPosition: { x: 12, y: 12, z: 12 }
    });

    // 9. Massive Superconducting Data Trunks
    const cableGroup = new THREE.Group();
    const cableCurves = [
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(7, 0.5, 7),
            new THREE.Vector3(5, 0.5, 5),
            new THREE.Vector3(3, 0.5, 3),
            new THREE.Vector3(0, 0.5, 0)
        ]),
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(7, 0.5, 6),
            new THREE.Vector3(4, 0.5, 3),
            new THREE.Vector3(0, 5, 2.2) // To chamber
        ]),
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(6, 0.5, 8),
            new THREE.Vector3(2, 0.5, 4),
            new THREE.Vector3(0, 10, 1.5) // To column
        ])
    ];

    cableCurves.forEach(curve => {
        // Bundle of wires
        for(let w=0; w<3; w++) {
            const offset = (w-1)*0.15;
            const wGeo = new THREE.TubeGeometry(curve, 64, 0.08, 12, false);
            const wMesh = new THREE.Mesh(wGeo, rubber);
            wMesh.position.set(offset, 0, offset);
            cableGroup.add(wMesh);
        }
    });
    group.add(cableGroup);

    parts.push({
        name: "Cryogenic Superconducting Data Trunks",
        description: "Thick bundles of optic and superconducting cables that carry petabytes of structural data per second from the detectors to the holographic processors.",
        material: rubber,
        function: "Extreme Data Transmission",
        assemblyOrder: 15,
        connections: ["Detectors", "Operator Console", "Main Column"],
        failureEffect: "Data bottleneck causing latency in the piezoelectric controls and crashing the holographic engine.",
        cascadeFailures: ["Hologram desynchronization"],
        originalPosition: { x: 3.5, y: 0.5, z: 3.5 },
        explodedPosition: { x: 7, y: -2, z: 0 }
    });

    // 10. Ion Getter Pump (Side of column for Ultra-High Vacuum)
    const ionPumpGroup = new THREE.Group();
    ionPumpGroup.position.set(1.5, 11, 0);
    
    const ionBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 1.2), aluminum);
    ionPumpGroup.add(ionBody);
    
    const ionMagnet = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.4, 32), darkSteel);
    ionMagnet.rotation.x = Math.PI / 2;
    ionPumpGroup.add(ionMagnet);
    
    const ionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 16), steel);
    ionPipe.position.set(-0.9, 0, 0);
    ionPipe.rotation.z = Math.PI / 2;
    ionPumpGroup.add(ionPipe);
    
    // High voltage connection to ion pump
    const ionCableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, 0.9, 0),
        new THREE.Vector3(0.6, 2.5, 0),
        new THREE.Vector3(-1.0, 3.5, -2.0)
    ]), 16, 0.05, 8, false);
    const ionCable = new THREE.Mesh(ionCableGeo, rubber);
    ionPumpGroup.add(ionCable);

    columnGroup.add(ionPumpGroup);

    parts.push({
        name: "Sputter Ion Getter Pump",
        description: "Maintains absolute vacuum near the delicate electron emitter by ionizing and permanently trapping residual gas molecules in a titanium lattice.",
        material: aluminum,
        function: "Emitter Vacuum Maintenance",
        assemblyOrder: 16,
        connections: ["Electron Column", "HV Supply"],
        failureEffect: "Gradual degradation of electron beam quality due to molecular collisions, eventually causing arc flashes.",
        cascadeFailures: ["Emitter Destruction"],
        originalPosition: { x: 1.5, y: 18, z: 0 },
        explodedPosition: { x: 8, y: 18, z: 0 }
    });

    // 11. Massive Liquid Nitrogen Cooling Dewar
    const dewarGroup = new THREE.Group();
    dewarGroup.position.set(-4.5, 0, -4.5);

    const dewarTank = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4.0, 32), chrome);
    dewarTank.position.y = 2.0;
    dewarGroup.add(dewarTank);

    const dewarTop = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI*2, 0, Math.PI/2), chrome);
    dewarTop.position.y = 4.0;
    dewarGroup.add(dewarTop);
    
    // Valves and dials
    const valveGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const valve = new THREE.Mesh(valveGeo, emissiveRed);
    valve.position.set(0, 4.5, 0);
    valve.rotation.x = Math.PI/2;
    dewarGroup.add(valve);

    // Thick cryogenic pipe leading to EDX detector
    const ln2Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(2.0, 7.0, 3.5),
        new THREE.Vector3(3.3, 6.0, 5.7) // Approximating connection to EDX
    ]);
    const ln2Pipe = new THREE.Mesh(new THREE.TubeGeometry(ln2Curve, 64, 0.15, 16, false), copper);
    dewarGroup.add(ln2Pipe);
    
    group.add(dewarGroup);

    parts.push({
        name: "Cryogenic Liquid Nitrogen Dewar",
        description: "Stores and circulates liquid nitrogen to super-cool the EDX semiconductor detector, minimizing thermal electronic noise.",
        material: chrome,
        function: "Cryogenic Sub-Cooling",
        assemblyOrder: 2,
        connections: ["EDX Spectrometer"],
        failureEffect: "EDX detector overheats instantly, flooding elemental chemical data with severe thermal noise artifacts.",
        cascadeFailures: ["EDX Sensor Degradation", "Data Corruption"],
        originalPosition: { x: -4.5, y: 0, z: -4.5 },
        explodedPosition: { x: -10, y: 0, z: -10 }
    });

    // Add entire complex structure to group
    group.add(baseGroup);
    group.add(chamberGroup);
    group.add(columnGroup);

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Levitation Turbo Molecular Pump in the Xenobiology Microscope?",
            options: [
                "Maintain 10^-10 Torr ultra-high vacuum in the chamber",
                "Cool down the EDX detector to cryogenic levels",
                "Accelerate electrons to 300kV",
                "Focus the electron beam onto the specimen"
            ],
            correctAnswer: 0
        },
        {
            question: "Why does the system utilize a massive Multipole Objective Lens Array?",
            options: [
                "To protect the operator from high-energy radiation",
                "To generate a magnetic field strong enough to bend high-energy electrons into a focal point of 0.5 Angstroms",
                "To maintain the cryogenic temperatures within the chamber",
                "To ionize residual gas in the vacuum column"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the specific role of the Everhart-Thornley Secondary Electron Detector?",
            options: [
                "To provide cryogenic cooling to the stage",
                "To trap and neutralize residual gases",
                "To capture low-energy electrons for pristine 3D topographic imaging of the sample",
                "To generate the high voltage field for the electron gun"
            ],
            correctAnswer: 2
        },
        {
            question: "How do the Pneumatic Damping Isolation Legs ensure atomic-resolution image stability?",
            options: [
                "By magnetically levitating the entire laboratory room",
                "By freezing the floor with liquid nitrogen to stop thermal expansion",
                "They isolate the microscope from seismic, acoustic, and thermal disturbances using active-cancellation pneumatics",
                "They continuously adjust the electron gun voltage to compensate for vibration"
            ],
            correctAnswer: 2
        },
        {
            question: "Why are Volumetric Holographic Displays strictly necessary for analyzing xenobiology samples?",
            options: [
                "To look impressive to high-level investors and military personnel",
                "To render and intuitively visualize highly complex, multi-dimensional alien protein and DNA folds in real-time",
                "Because standard flat screens cannot survive the intense magnetic fields",
                "To emit characteristic X-rays for deep structural analysis"
            ],
            correctAnswer: 1
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the turbo pump blades at extremely high speeds
        if (animatedMeshes.pumpTurbines) {
            animatedMeshes.pumpTurbines.forEach(turbine => {
                turbine.rotation.y += 0.8 * speed;
            });
        }
        
        // Rotate the incredibly complex holographic alien DNA and floating rings
        if (animatedMeshes.holoDNA && animatedMeshes.holoDNA.length > 0) {
            animatedMeshes.holoDNA[0].rotation.y += 0.03 * speed;
            animatedMeshes.holoDNA[0].rotation.x += 0.015 * speed;
            
            for(let i=1; i<animatedMeshes.holoDNA.length; i++) {
                animatedMeshes.holoDNA[i].rotation.z -= 0.04 * i * speed;
                animatedMeshes.holoDNA[i].rotation.x = Math.PI/2 + Math.sin(time * 0.003 * speed + i) * 0.3;
            }
        }

        // Pulse the detector and emitter status lights
        if (animatedMeshes.statusLights) {
            const pulse = (Math.sin(time * 0.008 * speed) + 1) / 2;
            animatedMeshes.statusLights.forEach((light, index) => {
                light.material.emissiveIntensity = 1 + pulse * (index % 2 === 0 ? 2 : 1.5);
            });
        }

        // Make the keyboard buttons blink randomly to simulate intense data processing
        if (animatedMeshes.controlButtons) {
            animatedMeshes.controlButtons.forEach(btn => {
                if (Math.random() > 0.95) {
                    btn.material.emissiveIntensity = Math.random() * 3 + 1;
                }
            });
        }

        // Subtly twitch the joystick to mirror automated scanning procedures
        if (animatedMeshes.joystick) {
            animatedMeshes.joystick.rotation.x = Math.PI/8 + Math.sin(time * 0.002 * speed) * 0.1;
            animatedMeshes.joystick.rotation.z = Math.cos(time * 0.003 * speed) * 0.1;
        }

        // Precision 5-Axis stage translation to simulate raster scanning of the alien specimen
        if (animatedMeshes.stageXYZ) {
            animatedMeshes.stageXYZ.position.x = Math.sin(time * 0.0015 * speed) * 0.08;
            animatedMeshes.stageXYZ.position.z = Math.cos(time * 0.0018 * speed) * 0.08;
            // Slight tilt
            animatedMeshes.stageXYZ.children[0].children[0].rotation.x = Math.sin(time * 0.0005 * speed) * 0.05;
        }

        // Pulsate the alien biological sample on the stage
        if (animatedMeshes.scanners && animatedMeshes.scanners.length > 0) {
            const alienPulse = (Math.sin(time * 0.01 * speed) + 1) / 2;
            animatedMeshes.scanners[0].material.emissiveIntensity = 1 + alienPulse * 3;
            animatedMeshes.scanners[0].rotation.y += 0.01 * speed; // Slowly rotate the sample itself if unconstrained
        }
    }

    return {
        group,
        parts,
        description: "An ultra-high-tech Astrobiology/Xenobiology Electron Microscope. This colossal instrument utilizes extreme magnetic fields, cryogenic cooling, and 300kV electron beams to dissect alien biology at the sub-Angstrom level. Features active-cancellation pneumatic damping, massive turbo molecular pumps, and an advanced volumetric holographic control console for multidimensional analysis.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createXenobiologyMicroscope() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
