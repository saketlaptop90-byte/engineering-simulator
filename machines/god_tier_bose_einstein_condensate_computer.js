import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "God_Tier_Bose_Einstein_Condensate_Computer";

    const parts = [];
    const meshes = {};

    // ============================================================================
    // CUSTOM GLOWING & HIGH-TECH MATERIALS
    // ============================================================================
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2, transparent: true, opacity: 0.8 
    });
    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff, emissive: 0x6600ff, emissiveIntensity: 1.5 
    });
    const laserRed = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5, transparent: true, opacity: 0.6 
    });
    const rubidiumGas = new THREE.MeshPhysicalMaterial({ 
        color: 0xffaa88, emissive: 0xff5522, emissiveIntensity: 0.8, transmission: 0.9, opacity: 0.5, transparent: true, roughness: 0.1 
    });
    const becWaveMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2, transmission: 1.0, opacity: 0.8, transparent: true, clearcoat: 1.0, side: THREE.DoubleSide
    });
    const glowingGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 3 
    });
    const displayScreenMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, emissive: 0x002244, emissiveIntensity: 1 
    });

    // Arrays to hold dynamic components for animation
    meshes.tires = [];
    meshes.pistons = [];
    meshes.lasers = [];
    meshes.atoms = [];
    meshes.hydraulicLines = [];
    meshes.rotors = [];
    meshes.boomArms = [];
    meshes.exhaustPipes = [];

    // ============================================================================
    // 1. CHASSIS AND MOBILE PLATFORM
    // ============================================================================
    const chassisGroup = new THREE.Group();
    
    // Main structural I-beams (ExtrudeGeometry)
    const iBeamShape = new THREE.Shape();
    iBeamShape.moveTo(-1, 2);
    iBeamShape.lineTo(1, 2);
    iBeamShape.lineTo(1, 1.5);
    iBeamShape.lineTo(0.2, 1.5);
    iBeamShape.lineTo(0.2, -1.5);
    iBeamShape.lineTo(1, -1.5);
    iBeamShape.lineTo(1, -2);
    iBeamShape.lineTo(-1, -2);
    iBeamShape.lineTo(-1, -1.5);
    iBeamShape.lineTo(-0.2, -1.5);
    iBeamShape.lineTo(-0.2, 1.5);
    iBeamShape.lineTo(-1, 1.5);
    iBeamShape.lineTo(-1, 2);

    const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    
    const beam1 = new THREE.Mesh(new THREE.ExtrudeGeometry(iBeamShape, extrudeSettings), darkSteel);
    beam1.position.set(-6, -8, -15);
    chassisGroup.add(beam1);

    const beam2 = new THREE.Mesh(new THREE.ExtrudeGeometry(iBeamShape, extrudeSettings), darkSteel);
    beam2.position.set(6, -8, -15);
    chassisGroup.add(beam2);

    // Cross beams
    for(let i=0; i<5; i++) {
        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(12, 1.5, 1.5), steel);
        crossBeam.position.set(0, -8, -12 + i * 6);
        chassisGroup.add(crossBeam);
    }

    // Add Grilles
    const grilleGeom = new THREE.BoxGeometry(14, 4, 0.5);
    const grille = new THREE.Mesh(grilleGeom, chrome);
    grille.position.set(0, -6, 15);
    chassisGroup.add(grille);
    
    for(let i=0; i<20; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.5, 0.6), darkSteel);
        slat.position.set(-6.5 + (i * 13/19), -6, 15.1);
        chassisGroup.add(slat);
    }

    group.add(chassisGroup);
    meshes.chassis = chassisGroup;

    parts.push({
        name: "Tactical Quantum Chassis",
        description: "Heavy-duty reinforced durasteel I-beam chassis, designed to transport the delicate quantum apparatus into extreme combat or off-world environments.",
        material: "darkSteel",
        function: "Provides the primary structural foundation for the mobile BEC unit.",
        assemblyOrder: 1,
        connections: ["Hydraulic Suspension", "Optical Table", "Operator Cabin"],
        failureEffect: "Structural collapse leading to immediate loss of vacuum and catastrophic implosion.",
        cascadeFailures: ["Total System Loss", "Operator Fatality"],
        originalPosition: {x: 0, y: -8, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // ============================================================================
    // 2. AGGRESSIVE OFF-ROAD TIRES & SUSPENSION
    // ============================================================================
    function createWheelAndSuspension(x, y, z, isFront) {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, y, z);
        
        // Complex Tire
        const tireRadius = 4;
        const tireTube = 1.5;
        const tireGeom = new THREE.TorusGeometry(tireRadius, tireTube, 32, 100);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs around the circumference
        const lugCount = 120;
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lugGeom = new THREE.BoxGeometry(1.8, 0.6, 3.2);
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(
                0,
                Math.cos(angle) * (tireRadius + tireTube - 0.2),
                Math.sin(angle) * (tireRadius + tireTube - 0.2)
            );
            lug.rotation.x = -angle;
            if (i % 2 === 0) {
                lug.rotation.z = 0.2;
            } else {
                lug.rotation.z = -0.2;
            }
            wheelGroup.add(lug);
        }

        // Complex Rims with Spoke Arrays
        const rimGeom = new THREE.CylinderGeometry(2.5, 2.5, 2.5, 32);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        // Center hub and bolts
        const hubGeom = new THREE.CylinderGeometry(1, 1, 3, 32);
        const hub = new THREE.Mesh(hubGeom, chrome);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        for (let i=0; i<10; i++) {
            const boltAngle = (i/10) * Math.PI * 2;
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8), chrome);
            bolt.position.set(0, Math.cos(boltAngle)*1.6, Math.sin(boltAngle)*1.6);
            bolt.rotation.z = Math.PI/2;
            wheelGroup.add(bolt);
        }

        // Complex Spoke Array
        for(let i=0; i<12; i++) {
            const spokeShape = new THREE.BoxGeometry(0.4, 3, 0.4);
            const spoke = new THREE.Mesh(spokeShape, aluminum);
            spoke.position.set(0, Math.cos((i/12)*Math.PI*2)*1.2, Math.sin((i/12)*Math.PI*2)*1.2);
            spoke.rotation.x = -(i/12)*Math.PI*2;
            spoke.rotation.z = Math.PI/2;
            wheelGroup.add(spoke);
        }

        group.add(wheelGroup);
        meshes.tires.push(wheelGroup);

        // Hydraulic Piston Suspension
        const pistonGroup = new THREE.Group();
        pistonGroup.position.set(x > 0 ? x - 2 : x + 2, y + 4, z);
        
        const outerCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6, 32), steel);
        pistonGroup.add(outerCylinder);
        
        const innerCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 32), chrome);
        innerCylinder.position.y = -3;
        pistonGroup.add(innerCylinder);
        
        const springCurve = new THREE.CatmullRomCurve3(
            Array.from({length: 100}, (_, i) => {
                const t = i / 99;
                const radius = 1.2;
                return new THREE.Vector3(
                    Math.cos(t * Math.PI * 20) * radius,
                    (t - 0.5) * 8,
                    Math.sin(t * Math.PI * 20) * radius
                );
            })
        );
        const springGeom = new THREE.TubeGeometry(springCurve, 200, 0.2, 8, false);
        const spring = new THREE.Mesh(springGeom, copper);
        pistonGroup.add(spring);

        const armGeom = new THREE.BoxGeometry(4, 1, 2);
        const arm = new THREE.Mesh(armGeom, darkSteel);
        arm.position.set(x > 0 ? 2 : -2, -6, 0);
        pistonGroup.add(arm);

        group.add(pistonGroup);
        meshes.pistons.push({ outer: outerCylinder, inner: innerCylinder, spring: spring, group: pistonGroup, initialY: innerCylinder.position.y });

        return { wheel: wheelGroup, suspension: pistonGroup };
    }

    const tFL = createWheelAndSuspension(-10, -12, 10, true);
    const tFR = createWheelAndSuspension(10, -12, 10, true);
    const tRL = createWheelAndSuspension(-10, -12, -10, false);
    const tRR = createWheelAndSuspension(10, -12, -10, false);

    parts.push({
        name: "All-Terrain Quantum Locomotion Array",
        description: "Four massive TorusGeometry-based tires with hundreds of independently extruded lugs, mounted on heavy-duty adaptive hydraulic suspension.",
        material: "rubber/chrome/darkSteel",
        function: "Allows the entire Bose-Einstein Condensate computer to traverse hostile topographies while dampening macro-vibrations.",
        assemblyOrder: 2,
        connections: ["Titanium Chassis", "Hydraulic Lines"],
        failureEffect: "Immobilization of the tactical unit, rendering it vulnerable in field deployments.",
        cascadeFailures: ["Targeting Failure", "Mission Compromise"],
        originalPosition: {x: 0, y: -12, z: 0},
        explodedPosition: {x: -25, y: -12, z: 25}
    });

    parts.push({
        name: "Adaptive Hydraulic Suspension Piston Array",
        description: "Complex dual-cylinder pistons wrapped in heavy-gauge copper coiled springs.",
        material: "steel/chrome/copper",
        function: "Actively cancels low-frequency seismic waves before they reach the optical table.",
        assemblyOrder: 3,
        connections: ["Chassis", "Wheels"],
        failureEffect: "Transmission of low-frequency rumble into the optical table.",
        cascadeFailures: ["BEC Phonon Excitation", "Decoherence"],
        originalPosition: {x: 0, y: -8, z: 0},
        explodedPosition: {x: 20, y: 0, z: 20}
    });

    // ============================================================================
    // 3. OPERATOR CABIN (Highly Detailed)
    // ============================================================================
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, -3, 10);
    
    const cabinProfile = new THREE.Shape();
    cabinProfile.moveTo(-5, 0);
    cabinProfile.lineTo(5, 0);
    cabinProfile.lineTo(5, 8);
    cabinProfile.lineTo(3, 10);
    cabinProfile.lineTo(-3, 10);
    cabinProfile.lineTo(-5, 8);
    cabinProfile.lineTo(-5, 0);

    const cabExtrudeOpts = { depth: 8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const cabHull = new THREE.Mesh(new THREE.ExtrudeGeometry(cabinProfile, cabExtrudeOpts), aluminum);
    cabHull.position.set(0, 0, -4);
    cabinGroup.add(cabHull);

    const windowGeom = new THREE.BoxGeometry(9.6, 4.6, 0.2);
    const frontWindow = new THREE.Mesh(windowGeom, tinted);
    frontWindow.position.set(0, 6, 4.1);
    cabinGroup.add(frontWindow);

    const sideWindowGeom = new THREE.BoxGeometry(0.2, 4.6, 7.6);
    const leftWindow = new THREE.Mesh(sideWindowGeom, tinted);
    leftWindow.position.set(-5.1, 6, 0);
    cabinGroup.add(leftWindow);
    const rightWindow = new THREE.Mesh(sideWindowGeom, tinted);
    rightWindow.position.set(5.1, 6, 0);
    cabinGroup.add(rightWindow);

    const dashboardGeom = new THREE.BoxGeometry(9, 2, 3);
    const dashboard = new THREE.Mesh(dashboardGeom, plastic);
    dashboard.position.set(0, 3, 2);
    dashboard.rotation.x = -Math.PI / 6;
    cabinGroup.add(dashboard);

    for(let i=0; i<3; i++) {
        const screen = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 0.1), displayScreenMat);
        screen.position.set(-3 + i*3, 3.5, 3);
        screen.rotation.x = -Math.PI / 6;
        cabinGroup.add(screen);
        meshes.displays.push(screen);
    }

    const steeringColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), darkSteel);
    steeringColumn.position.set(-2, 2.5, 1);
    steeringColumn.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringColumn);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(1, 0.15, 16, 32), rubber);
    steeringWheel.position.set(-2, 3.2, 1.7);
    steeringWheel.rotation.x = -Math.PI / 4;
    cabinGroup.add(steeringWheel);

    for (let i of [-1, 1]) {
        const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5), plastic);
        joyBase.position.set(2 + i, 3.5, 1.5);
        joyBase.rotation.x = -Math.PI / 6;
        cabinGroup.add(joyBase);
        
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), steel);
        stick.position.set(2 + i, 4, 1.5);
        cabinGroup.add(stick);
        
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.3), laserRed);
        knob.position.set(2 + i, 4.7, 1.5);
        cabinGroup.add(knob);
    }

    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), plastic);
    seatBase.position.set(-2, 1, -1);
    cabinGroup.add(seatBase);
    
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 0.5), plastic);
    seatBack.position.set(-2, 3, -2);
    cabinGroup.add(seatBack);

    const ladderGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const step = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), steel);
        step.rotation.z = Math.PI / 2;
        step.position.set(0, i*1.5, 0);
        ladderGroup.add(step);
    }
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6), steel);
    rail1.position.set(-1, 2.25, 0);
    ladderGroup.add(rail1);
    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6), steel);
    rail2.position.set(1, 2.25, 0);
    ladderGroup.add(rail2);
    ladderGroup.position.set(-5.5, -4, 0);
    cabinGroup.add(ladderGroup);

    for(let i of [-1, 1]) {
        const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), steel);
        mirrorArm.position.set(i*5.5, 5, 3);
        mirrorArm.rotation.z = i * Math.PI / 2;
        cabinGroup.add(mirrorArm);

        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 1), chrome);
        mirror.position.set(i*6.5, 5, 3);
        cabinGroup.add(mirror);
    }

    for(let i of [-1, 1]) {
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 12, 16), chrome);
        exhaust.position.set(i*4.5, 6, -5);
        cabinGroup.add(exhaust);
        meshes.exhaustPipes.push(exhaust);
        
        const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16), darkSteel);
        flap.position.set(i*4.5, 12, -5);
        flap.rotation.x = Math.PI/4;
        cabinGroup.add(flap);
    }

    group.add(cabinGroup);

    parts.push({
        name: "Command Cabin & Interface",
        description: "Heavily armored and electromagnetically shielded operator cabin featuring HUDs, joystick quantum state manipulation, and tinted radiation-proof glass.",
        material: "aluminum/tinted/plastic",
        function: "Houses the human operator and provides a manual interface to the macroscopic quantum state.",
        assemblyOrder: 4,
        connections: ["Chassis", "Control Electronics Rack"],
        failureEffect: "Operator is exposed to intense magnetic fields and extreme cold, resulting in critical injury.",
        cascadeFailures: ["Loss of Manual Override", "Runaway Exothermic Event"],
        originalPosition: {x: 0, y: -3, z: 10},
        explodedPosition: {x: 0, y: 10, z: 30}
    });

    parts.push({
        name: "Dual Chromed Exhaust Stacks",
        description: "Massive vertical exhaust pipes discharging superheated gases from the onboard multi-megawatt cryo-generator.",
        material: "chrome",
        function: "Vents heat generated by the extreme cooling systems required to reach absolute zero.",
        assemblyOrder: 5,
        connections: ["Cryo-Generator", "Cabin Rear"],
        failureEffect: "Thermal backup into the cooling system, causing rapid heating.",
        cascadeFailures: ["BEC Boiling", "Helium Venting"],
        originalPosition: {x: 0, y: 6, z: 5},
        explodedPosition: {x: -15, y: 15, z: 10}
    });

    // ============================================================================
    // 4. MASSIVE VIBRATION-ISOLATED OPTICAL TABLE
    // ============================================================================
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, -1, -5);

    const tableGeom = new THREE.BoxGeometry(16, 1.5, 22);
    const tableMesh = new THREE.Mesh(tableGeom, darkSteel);
    tableGroup.add(tableMesh);
    
    const holeGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.51, 8);
    const holeMat = new THREE.MeshBasicMaterial({color: 0x000000});
    const holeInstanced = new THREE.InstancedMesh(holeGeom, holeMat, 200);
    let holeIdx = 0;
    const dummy = new THREE.Object3D();
    for(let x=-7; x<=7; x+=1.5) {
        for(let z=-10; z<=10; z+=1.5) {
            if (holeIdx < 200) {
                dummy.position.set(x, 0, z);
                dummy.updateMatrix();
                holeInstanced.setMatrixAt(holeIdx++, dummy.matrix);
            }
        }
    }
    tableGroup.add(holeInstanced);

    for (let x of [-7, 7]) {
        for (let z of [-9, 9]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 16), steel);
            leg.position.set(x, -2.25, z);
            tableGroup.add(leg);
            
            const rubberPad = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.5, 16), rubber);
            rubberPad.position.set(x, -3.5, z);
            tableGroup.add(rubberPad);
        }
    }

    group.add(tableGroup);

    parts.push({
        name: "Invar-Steel Optical Breadboard",
        description: "A colossal, perfectly flat optical table riddled with M6 mounting holes, floating on active pneumatic isolators.",
        material: "darkSteel",
        function: "Maintains absolute sub-micron alignment for the dozens of intersecting laser paths required for trapping and cooling.",
        assemblyOrder: 6,
        connections: ["Chassis", "Lasers", "UHV Chamber"],
        failureEffect: "Thermal expansion or vibration causes laser misalignment.",
        cascadeFailures: ["Loss of Trapping Potential", "Atom Cloud Expansion"],
        originalPosition: {x: 0, y: -1, z: -5},
        explodedPosition: {x: 0, y: -5, z: -35}
    });

    // ============================================================================
    // 5. ULTRA-HIGH VACUUM (UHV) CHAMBER
    // ============================================================================
    const uhvGroup = new THREE.Group();
    uhvGroup.position.set(0, 5, -5);

    const pointsChamber = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30.0;
        const r = 3 + Math.sin(t * Math.PI) * 1.5;
        pointsChamber.push(new THREE.Vector2(r, (t - 0.5) * 6));
    }
    const chamberGeom = new THREE.LatheGeometry(pointsChamber, 64);
    const chamberMesh = new THREE.Mesh(chamberGeom, glass);
    uhvGroup.add(chamberMesh);

    const topFlange = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.5, 64), steel);
    topFlange.position.set(0, 3.25, 0);
    uhvGroup.add(topFlange);

    const bottomFlange = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.5, 64), steel);
    bottomFlange.position.set(0, -3.25, 0);
    uhvGroup.add(bottomFlange);

    for (let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const portGroup = new THREE.Group();
        
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1, 32), steel);
        tube.rotation.x = Math.PI/2;
        portGroup.add(tube);
        
        const viewport = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 32), glass);
        viewport.rotation.x = Math.PI/2;
        portGroup.add(viewport);
        
        for(let j=0; j<8; j++) {
            const bAngle = (j/8)*Math.PI*2;
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), chrome);
            bolt.position.set(Math.cos(bAngle)*1.4, Math.sin(bAngle)*1.4, 0);
            bolt.rotation.x = Math.PI/2;
            portGroup.add(bolt);
        }

        portGroup.position.set(Math.cos(angle)*4, 0, Math.sin(angle)*4);
        portGroup.rotation.y = -angle;
        uhvGroup.add(portGroup);
    }

    for (let i of [-1, 1]) {
        const pumpGroup = new THREE.Group();
        const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 5, 32), darkSteel);
        pumpBody.rotation.z = Math.PI/2;
        pumpGroup.add(pumpBody);
        
        const coolingFins = new THREE.Mesh(new THREE.BoxGeometry(4, 4.5, 4.5), aluminum);
        pumpGroup.add(coolingFins);

        const connector = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 16), steel);
        connector.position.set(0, 3, 0);
        pumpGroup.add(connector);

        pumpGroup.position.set(i*6, -5, 0);
        uhvGroup.add(pumpGroup);
    }

    group.add(uhvGroup);

    parts.push({
        name: "Octagonal UHV Glass Cell",
        description: "A heavily modified ultra-high vacuum cell constructed from anti-reflection coated fused silica. Maintains a pressure of 10^-11 Torr.",
        material: "glass/steel",
        function: "Isolates the rubidium atoms from background gas, preventing collisions that would eject atoms from the shallow trap.",
        assemblyOrder: 7,
        connections: ["Optical Table", "Ion Pumps", "MOT Coils"],
        failureEffect: "Vacuum breach destroys the condensate instantly and coats the hot filament with reactive gases.",
        cascadeFailures: ["Complete System Implosion", "Filament Burnout"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: 0, y: 25, z: -5}
    });

    parts.push({
        name: "Sputter Ion Pumps & Sublimators",
        description: "Massive electromagnetic pumps that ionize and capture stray gas molecules.",
        material: "darkSteel/aluminum",
        function: "Continuously actively pumps the chamber to maintain extreme vacuum conditions.",
        assemblyOrder: 8,
        connections: ["UHV Chamber", "High Voltage Supply"],
        failureEffect: "Gradual rise in pressure leading to the slow evaporation and loss of the trapped atom cloud.",
        cascadeFailures: ["Loss of Qubits", "Thermal Runaway"],
        originalPosition: {x: 6, y: 0, z: -5},
        explodedPosition: {x: 20, y: 0, z: -5}
    });

    // ============================================================================
    // 6. RUBIDIUM OVEN & ZEEMAN SLOWER
    // ============================================================================
    const slowerGroup = new THREE.Group();
    slowerGroup.position.set(0, 5, -15);

    const oven = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 4), steel);
    oven.position.set(0, 0, -6);
    slowerGroup.add(oven);

    const heater = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4.2), laserRed);
    heater.rotation.x = Math.PI/2;
    heater.position.set(0, 0, -6);
    slowerGroup.add(heater);

    const tubeGeom = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const slowerTube = new THREE.Mesh(tubeGeom, steel);
    slowerTube.rotation.x = Math.PI/2;
    slowerTube.position.set(0, 0, -1);
    slowerGroup.add(slowerTube);

    for(let i=0; i<15; i++) {
        const zPos = -4 + Math.pow(i/14, 1.5) * 7;
        const coil = new THREE.Mesh(new THREE.TorusGeometry(1, 0.2, 16, 32), copper);
        coil.position.set(0, 0, zPos);
        slowerGroup.add(coil);
    }

    group.add(slowerGroup);

    parts.push({
        name: "Rubidium Effusion Oven",
        description: "A superheated ampoule of Rubidium-87 emitting a high-velocity thermal atomic beam.",
        material: "steel/laserRed",
        function: "Acts as the source of raw bosons for the experiment.",
        assemblyOrder: 9,
        connections: ["Zeeman Slower"],
        failureEffect: "Source depletion or temperature drop halts atom flux.",
        cascadeFailures: ["Empty Trap", "Computation Halt"],
        originalPosition: {x: 0, y: 5, z: -21},
        explodedPosition: {x: 0, y: 5, z: -35}
    });

    parts.push({
        name: "Spatially Varying Zeeman Slower",
        description: "A tapered array of electromagnets that creates a specifically tuned magnetic field gradient.",
        material: "copper/steel",
        function: "Maintains atoms on resonance with a counter-propagating slowing laser as they decelerate via Doppler cooling.",
        assemblyOrder: 10,
        connections: ["Rubidium Oven", "UHV Chamber"],
        failureEffect: "Atoms enter the UHV chamber too fast to be captured by the MOT.",
        cascadeFailures: ["Trap Starvation"],
        originalPosition: {x: 0, y: 5, z: -16},
        explodedPosition: {x: 0, y: 15, z: -25}
    });

    // ============================================================================
    // 7. MAGNETO-OPTICAL TRAP (MOT) COILS
    // ============================================================================
    const motGroup = new THREE.Group();
    motGroup.position.set(0, 5, -5);

    const topCoil = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.6, 32, 64), copper);
    topCoil.position.set(0, 2.5, 0);
    topCoil.rotation.x = Math.PI/2;
    motGroup.add(topCoil);

    const bottomCoil = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.6, 32, 64), copper);
    bottomCoil.position.set(0, -2.5, 0);
    bottomCoil.rotation.x = Math.PI/2;
    motGroup.add(bottomCoil);
    
    const waterCoolingCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.5, 2.5, 0),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, -5, 0),
        new THREE.Vector3(3.5, -2.5, 0)
    ]);
    const waterPipe = new THREE.Mesh(new THREE.TubeGeometry(waterCoolingCurve, 20, 0.2, 8, false), plastic);
    motGroup.add(waterPipe);

    group.add(motGroup);

    parts.push({
        name: "Anti-Helmholtz MOT Coils",
        description: "Two massive water-cooled copper coils running hundreds of amps in opposite directions to create a 3D magnetic quadrupole field.",
        material: "copper",
        function: "Provides the position-dependent restoring force that, combined with lasers, spatially confines the atom cloud.",
        assemblyOrder: 11,
        connections: ["UHV Chamber", "Water Chiller", "Power Supplies"],
        failureEffect: "Loss of magnetic gradient allows atoms to drift freely out of the laser intersection region.",
        cascadeFailures: ["Cloud Expansion", "Total Decoherence"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: 0, y: 30, z: -5}
    });

    // ============================================================================
    // 8. LASER COOLING ARRAYS
    // ============================================================================
    const laserGroup = new THREE.Group();
    laserGroup.position.set(0, 5, -5);

    const beamDirections = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
    ];

    beamDirections.forEach((dir, idx) => {
        const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), chrome);
        const dist = 7;
        emitter.position.set(dir[0]*dist, dir[1]*dist, dir[2]*dist);
        emitter.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-dir[0], -dir[1], -dir[2]).normalize());
        laserGroup.add(emitter);

        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist*2, 16), laserRed);
        beam.position.set(dir[0]*(dist/2), dir[1]*(dist/2), dir[2]*(dist/2));
        beam.quaternion.copy(emitter.quaternion);
        laserGroup.add(beam);
        meshes.lasers.push(beam);
    });

    const dipoleDirections = [
        [1, 1, 0], [-1, -1, 0]
    ];
    dipoleDirections.forEach((dir, idx) => {
        const dist = 8;
        const emitter = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 3), darkSteel);
        emitter.position.set(dir[0]*dist, dir[1]*dist, dir[2]*dist);
        emitter.lookAt(0, 0, 0);
        laserGroup.add(emitter);

        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist*2.5, 16), glowingGreen);
        beam.position.set(dir[0]*(dist/2), dir[1]*(dist/2), dir[2]*(dist/2));
        beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-dir[0], -dir[1], -dir[2]).normalize());
        laserGroup.add(beam);
        meshes.lasers.push(beam);
    });

    group.add(laserGroup);

    parts.push({
        name: "Six-Beam MOT & Doppler Cooling Array",
        description: "Six counter-propagating, red-detuned laser beams with precise circular polarization controlled by quarter-wave plates.",
        material: "chrome/laserRed",
        function: "Scatters photons to impart momentum kicks, slowing the atoms to microkelvin temperatures via Doppler cooling.",
        assemblyOrder: 12,
        connections: ["Optical Table", "Fiber Optics"],
        failureEffect: "Frequency drift causes heating instead of cooling.",
        cascadeFailures: ["Cloud Explosion"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: 0, y: 5, z: 20}
    });

    parts.push({
        name: "Crossed Optical Dipole Trap Lasers",
        description: "Intensely focused, far-off-resonance, high-power continuous-wave lasers forming a conservative trapping potential.",
        material: "darkSteel/glowingGreen",
        function: "Takes over trapping from the magnetic field, allowing evaporative cooling without Majorana spin-flip losses.",
        assemblyOrder: 13,
        connections: ["Acousto-Optic Modulators", "Optical Table"],
        failureEffect: "Intensity fluctuations cause parametric heating.",
        cascadeFailures: ["BEC Destruction"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: -20, y: 5, z: -5}
    });

    // ============================================================================
    // 9. CRYOGENIC HELIUM DISTRIBUTION
    // ============================================================================
    const cryoGroup = new THREE.Group();
    cryoGroup.position.set(0, -1, -5);

    const dewar = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 6, 32), aluminum);
    dewar.position.set(10, 2, -10);
    cryoGroup.add(dewar);
    
    for(let i=0; i<3; i++) {
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(10, 5, -10),
            new THREE.Vector3(10, 8, -5),
            new THREE.Vector3(5, 8 + i, 0),
            new THREE.Vector3(2, 6, 0),
            new THREE.Vector3(0, 8, -2)
        ]);
        const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 50, 0.3, 8, false), chrome);
        cryoGroup.add(pipe);
    }

    group.add(cryoGroup);

    parts.push({
        name: "Liquid Helium Cryogenic Loop",
        description: "Vacuum-jacketed transfer lines circulating liquid helium at 4 Kelvin to superconducting elements and thermal shields.",
        material: "aluminum/chrome",
        function: "Suppresses blackbody radiation from the surrounding room, which could otherwise excite and destroy the fragile BEC.",
        assemblyOrder: 14,
        connections: ["UHV Chamber Shields", "Cryo-Generator"],
        failureEffect: "Quench in superconducting coils and massive thermal influx.",
        cascadeFailures: ["Explosive Boil-off", "Catastrophic Pressure Spike"],
        originalPosition: {x: 10, y: 2, z: -15},
        explodedPosition: {x: 30, y: 5, z: -15}
    });

    // ============================================================================
    // 10. MICROWAVE CAVITY
    // ============================================================================
    const microwaveGroup = new THREE.Group();
    microwaveGroup.position.set(0, 5, -5);

    const hornGeom = new THREE.CylinderGeometry(1.5, 0.2, 3, 4, 1, true);
    const horn = new THREE.Mesh(hornGeom, copper);
    horn.rotation.x = Math.PI/2;
    horn.position.set(0, -3.5, 3);
    horn.rotation.z = Math.PI/4;
    microwaveGroup.add(horn);

    const waveguide = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4), copper);
    waveguide.position.set(0, -3.5, 5.5);
    microwaveGroup.add(waveguide);

    group.add(microwaveGroup);

    parts.push({
        name: "Microwave Horn & Waveguide",
        description: "Precision-machined OFHC copper microwave cavity driven by an ultra-stable local oscillator.",
        material: "copper",
        function: "Drives Rabi oscillations between hyperfine ground states, executing single-qubit quantum logic gates.",
        assemblyOrder: 15,
        connections: ["Synthesizer Rack", "UHV Chamber"],
        failureEffect: "Phase noise introduces errors in quantum state rotations.",
        cascadeFailures: ["Fidelity Drop", "Algorithm Failure"],
        originalPosition: {x: 0, y: 1.5, z: -2},
        explodedPosition: {x: 0, y: -10, z: 10}
    });

    // ============================================================================
    // 11. THE MACROSCOPIC QUANTUM WAVEFUNCTION (THE BEC)
    // ============================================================================
    const quantumCore = new THREE.Group();
    quantumCore.position.set(0, 5, -5);

    const atomCount = 5000;
    const atomGeom = new THREE.SphereGeometry(0.02, 4, 4);
    const atomInstanced = new THREE.InstancedMesh(atomGeom, rubidiumGas, atomCount);
    
    const dummyAtom = new THREE.Object3D();
    for(let i=0; i<atomCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.pow(Math.random(), 1/3) * 1.5;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        dummyAtom.position.set(x, y, z);
        dummyAtom.updateMatrix();
        atomInstanced.setMatrixAt(i, dummyAtom.matrix);

        meshes.atoms.push({
            index: i,
            x: x, y: y, z: z,
            r: r, theta: theta, phi: phi,
            speed: Math.random() * 0.05 + 0.01
        });
    }
    quantumCore.add(atomInstanced);
    meshes.atomInstanced = atomInstanced;

    const becGeom = new THREE.SphereGeometry(0.5, 128, 128);
    const becWave = new THREE.Mesh(becGeom, becWaveMat);
    quantumCore.add(becWave);
    meshes.becWave = becWave;

    const interferenceGeom = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
    const interference = new THREE.Mesh(interferenceGeom, neonBlue);
    interference.rotation.x = Math.PI/2;
    quantumCore.add(interference);
    meshes.interference = interference;

    group.add(quantumCore);

    parts.push({
        name: "Rubidium-87 Thermal Cloud",
        description: "A diffuse gas of millions of Rubidium atoms trapped in the MOT, glowing due to continuous scattering of the red-detuned lasers.",
        material: "rubidiumGas",
        function: "The precursor state before evaporative cooling initiates the phase transition.",
        assemblyOrder: 16,
        connections: ["MOT Coils", "Laser Array"],
        failureEffect: "Thermal expansion annihilates the density required for phase transition.",
        cascadeFailures: ["Condensation Failure"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: 0, y: -5, z: -5}
    });

    parts.push({
        name: "Macroscopic Quantum Wavefunction (BEC)",
        description: "The God-Tier Bose-Einstein Condensate. Millions of atoms occupying the exact same lowest energy quantum state, behaving as a single giant matter-wave.",
        material: "becWaveMat",
        function: "The ultimate computing substrate. Encodes immense amounts of data in its phase and amplitude, solving NP-hard problems via quantum interference.",
        assemblyOrder: 17,
        connections: ["Dipole Trap", "Microwave Cavity"],
        failureEffect: "Spontaneous emission or thermal phonons cause decoherence, destroying the superposition.",
        cascadeFailures: ["Quantum State Collapse", "Data Annihilation"],
        originalPosition: {x: 0, y: 5, z: -5},
        explodedPosition: {x: 0, y: 5, z: -5}
    });

    // ============================================================================
    // EXTERNAL ANIMATION CONTEXT & EXPORTS
    // ============================================================================
    const positions = becWave.geometry.attributes.position.array;
    meshes.becBaseVertices = [];
    for(let i=0; i<positions.length; i+=3) {
        meshes.becBaseVertices.push(new THREE.Vector3(positions[i], positions[i+1], positions[i+2]));
    }

    const quizQuestions = [
        {
            question: "In the context of producing a Bose-Einstein Condensate, forced RF evaporative cooling is essential. Which of the following best describes the quantum mechanical requirement for the re-thermalization process during evaporation?",
            options: [
                "Fermionic anti-symmetry prevents s-wave scattering, thus p-wave interactions must be utilized.",
                "Identical bosons must be in different hyperfine states to undergo s-wave scattering.",
                "The atoms must have a non-zero, positive s-wave scattering length to thermalize via elastic collisions.",
                "The process relies purely on spontaneous emission and recoil momentum."
            ],
            correctAnswer: 2,
            explanation: "In ultra-cold identical bosons, only s-wave scattering (l=0) is allowed due to wave-function symmetry requirements. A non-zero, preferably positive s-wave scattering length ensures enough elastic collisions occur to re-thermalize the remaining gas as the hottest atoms are removed, without collapsing."
        },
        {
            question: "When simulating a quantum logic gate using the macroscopic wavefunction of a BEC, one might utilize Feshbach resonances. How does a magnetic Feshbach resonance alter the scattering properties of the condensate?",
            options: [
                "By increasing the magnetic field gradient to compress the trap volume.",
                "By tuning the energy of a molecular bound state in a closed channel into resonance with the scattering continuum of the colliding atoms.",
                "By utilizing optical transitions to excite atoms to Rydberg states.",
                "By reversing the direction of the MOT coils to flip the atomic spins."
            ],
            correctAnswer: 1,
            explanation: "A Feshbach resonance occurs when the energy of two colliding free atoms (open channel) is tuned, via an external magnetic field, to match the energy of a molecular bound state (closed channel). This allows precise tuning of the s-wave scattering length from repulsive to attractive."
        },
        {
            question: "The Gross-Pitaevskii equation (GPE) governs the dynamics of the BEC macroscopic wavefunction. In a strongly interacting regime where the Thomas-Fermi approximation applies, which term of the GPE is typically neglected?",
            options: [
                "The mean-field interaction energy term.",
                "The external trapping potential term.",
                "The kinetic energy term (quantum pressure).",
                "The chemical potential."
            ],
            correctAnswer: 2,
            explanation: "In the Thomas-Fermi regime for a large condensate with repulsive interactions, the interaction energy and trapping potential are much larger than the kinetic energy (often called quantum pressure), allowing the kinetic term involving the Laplacian of the wavefunction to be neglected for determining the density profile."
        },
        {
            question: "To achieve a Mott insulator transition from a superfluid BEC in an optical lattice, one must tune the ratio of the interaction energy (U) to the hopping matrix element (J). What physical mechanism suppresses tunneling when U >> J?",
            options: [
                "The laser intensity is too low to maintain the lattice.",
                "The energy penalty for double occupancy at a single lattice site becomes much larger than the kinetic energy gained by hopping.",
                "The atoms condense into the dark state and stop interacting with the light field.",
                "The magnetic field creates a topological barrier across the lattice."
            ],
            correctAnswer: 1,
            explanation: "In the Bose-Hubbard model, U is the repulsive energy between two atoms on the same site, and J is the hopping energy. When U dominates, the system minimizes energy by localizing exactly integer numbers of atoms per site, suppressing superfluid tunneling and forming a Mott insulator."
        },
        {
            question: "During time-of-flight (TOF) imaging of a BEC released from an anisotropic harmonic trap, the cloud exhibits aspect ratio inversion. This is a direct consequence of:",
            options: [
                "Gravity pulling heavier atoms down faster.",
                "The anisotropic momentum distribution derived from the zero-point kinetic energy and mean-field expansion forces.",
                "Uneven heating from the imaging laser beam.",
                "Magnetic field eddy currents persisting after the coils are switched off."
            ],
            correctAnswer: 1,
            explanation: "According to the Heisenberg uncertainty principle and GPE dynamics, the axis of the trap with the tightest spatial confinement has the largest momentum spread. Additionally, the mean-field repulsion is strongest along the tightest axis. Upon release, the cloud expands fastest along this previously tight axis, leading to an inversion of its shape."
        }
    ];

    // ============================================================================
    // THE ULTIMATE GOD-TIER ANIMATE FUNCTION
    // ============================================================================
    function animate(time, speed, meshes) {
        if (meshes.tires) {
            meshes.tires.forEach(tire => {
                tire.rotation.x = time * speed * 2;
            });
        }
        
        if (meshes.pistons) {
            meshes.pistons.forEach((piston, idx) => {
                const bounce = Math.sin(time * speed * 5 + idx) * 0.5;
                piston.inner.position.y = piston.initialY + bounce;
                piston.spring.scale.y = 1 + (bounce / 6);
            });
        }

        if (meshes.displays) {
            meshes.displays.forEach((disp, idx) => {
                disp.material.emissiveIntensity = 1 + Math.sin(time * speed * 20 + idx * 3) * 0.5;
                disp.material.color.setHSL((time * speed * 0.1 + idx * 0.3) % 1, 1, 0.5);
            });
        }

        if (meshes.exhaustPipes) {
            meshes.exhaustPipes.forEach((pipe, idx) => {
                pipe.scale.x = 1 + Math.sin(time * speed * 30 + idx)*0.01;
                pipe.scale.z = 1 + Math.sin(time * speed * 30 + idx)*0.01;
            });
        }

        if (meshes.lasers) {
            meshes.lasers.forEach((laser, idx) => {
                laser.material.opacity = 0.5 + 0.3 * Math.sin(time * speed * 50 + idx);
            });
        }

        if (meshes.atomInstanced && meshes.atoms) {
            const dummy = new THREE.Object3D();
            const cycle = (Math.sin(time * speed * 0.5) + 1) / 2;
            
            meshes.atoms.forEach((atomData) => {
                atomData.theta += atomData.speed * speed * 10;
                
                const currentR = atomData.r * (1 - cycle * 0.9);
                
                const x = currentR * Math.sin(atomData.phi) * Math.cos(atomData.theta);
                const y = currentR * Math.sin(atomData.phi) * Math.sin(atomData.theta);
                const z = currentR * Math.cos(atomData.phi);
                
                dummy.position.set(x, y, z);
                dummy.updateMatrix();
                meshes.atomInstanced.setMatrixAt(atomData.index, dummy.matrix);
            });
            meshes.atomInstanced.instanceMatrix.needsUpdate = true;
            meshes.atomInstanced.material.opacity = (1 - cycle) * 0.5;
        }

        if (meshes.becWave && meshes.becBaseVertices) {
            const cycle = (Math.sin(time * speed * 0.5) + 1) / 2;
            
            meshes.becWave.material.opacity = cycle * 0.9;
            meshes.becWave.visible = cycle > 0.1;

            if (meshes.becWave.visible) {
                const positionAttribute = meshes.becWave.geometry.attributes.position;
                
                for(let i=0; i<meshes.becBaseVertices.length; i++) {
                    const baseVec = meshes.becBaseVertices[i];
                    const omega = time * speed * 10;
                    
                    const rDist = Math.sqrt(baseVec.x*baseVec.x + baseVec.y*baseVec.y + baseVec.z*baseVec.z);
                    const theta = Math.atan2(baseVec.y, baseVec.x);
                    const phi = Math.acos(baseVec.z / rDist);
                    
                    const vortex = Math.sin(4 * theta - omega) * Math.sin(3 * phi);
                    const breathing = Math.cos(omega * 0.5);
                    const amplitude = 0.2 * cycle;
                    
                    const newR = rDist + amplitude * (vortex + breathing);
                    
                    positionAttribute.setXYZ(
                        i,
                        newR * Math.sin(phi) * Math.cos(theta),
                        newR * Math.sin(phi) * Math.sin(theta),
                        newR * Math.cos(phi)
                    );
                }
                positionAttribute.needsUpdate = true;
                
                meshes.becWave.rotation.y = time * speed * 0.5;
                meshes.becWave.rotation.z = time * speed * 0.2;
            }
        }

        if (meshes.interference) {
            meshes.interference.scale.setScalar(1 + Math.sin(time * speed * 5) * 0.2);
            meshes.interference.rotation.z = time * speed * 2;
            const cycle = (Math.sin(time * speed * 0.5) + 1) / 2;
            meshes.interference.material.opacity = cycle * 0.8;
            meshes.interference.visible = cycle > 0.2;
        }
    }

    return {
        group,
        parts,
        description: "The ultimate God-Tier Bose-Einstein Condensate Computer. A hyper-realistic, massive, tactical mobile unit utilizing millions of Rubidium-87 atoms cooled to absolute zero. Features a completely animated macroscopic wave function, 3D hydraulic suspension, off-road locomotive capabilities, and ultra-high vacuum optics. This machine leverages quantum interference and Feshbach resonances to solve computationally intractable problems on a battlefield.",
        quizQuestions,
        animate
    };
}
