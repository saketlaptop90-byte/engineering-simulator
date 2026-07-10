import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2.0, wireframe: false });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xcc0022, emissiveIntensity: 2.0 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00cc00, emissiveIntensity: 1.5 });
    const glowingScreen = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 1.0 });

    // --- VEHICLE CHASSIS & MOBILITY ---

    // 1. All-Terrain Mobility Chassis
    const chassisGeom = new THREE.BoxGeometry(30, 4, 50);
    const chassis = new THREE.Mesh(chassisGeom, darkSteel);
    chassis.position.set(0, 0, 0);
    group.add(chassis);

    // Grille & Details
    const grilleGeom = new THREE.BoxGeometry(28, 6, 2);
    const grille = new THREE.Mesh(grilleGeom, chrome);
    grille.position.set(0, 2, 26);
    chassis.add(grille);
    
    // Panel lines (rivets)
    const rivetGeom = new THREE.SphereGeometry(0.3, 8, 8);
    for(let i=0; i<20; i++) {
        const rivet1 = new THREE.Mesh(rivetGeom, chrome);
        rivet1.position.set(-14 + i*1.47, 2, -24);
        chassis.add(rivet1);
        const rivet2 = new THREE.Mesh(rivetGeom, chrome);
        rivet2.position.set(-14 + i*1.47, 2, 24);
        chassis.add(rivet2);
    }

    parts.push({
        name: "All-Terrain Mobility Chassis",
        description: "A colossal, armored vehicular frame designed to transport the highly sensitive Spintronics Memory core across hazardous environments.",
        material: "darkSteel / chrome",
        function: "Structural foundation and mobility",
        assemblyOrder: 1,
        connections: ["Heavy-Duty Suspension", "Operator Cabin", "Quantum Table"],
        failureEffect: "Structural collapse of the vehicle.",
        cascadeFailures: ["Payload destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Off-Road Aggressive Tires & Rims
    const wheelsGroup = new THREE.Group();
    meshes.wheels = [];
    const wheelPositions = [
        {x: -18, y: -2, z: 18},
        {x: 18, y: -2, z: 18},
        {x: -18, y: -2, z: -18},
        {x: 18, y: -2, z: -18}
    ];

    wheelPositions.forEach((pos, idx) => {
        const wheel = new THREE.Group();
        
        // Torus Tire
        const tireGeom = new THREE.TorusGeometry(6, 2.5, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wheel.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs
        const lugGeom = new THREE.BoxGeometry(1.5, 1.2, 5.5);
        for(let i=0; i<80; i++) {
            const angle = (i / 80) * Math.PI * 2;
            const lx = Math.cos(angle) * 8.2;
            const ly = Math.sin(angle) * 8.2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(0, ly, lx);
            lug.rotation.x = -angle;
            wheel.add(lug);
        }
        
        // Cylinder rim
        const rimGeom = new THREE.CylinderGeometry(4.5, 4.5, 3, 32);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.rotation.z = Math.PI / 2;
        wheel.add(rim);
        
        // Complex Spoke Arrays
        for(let i=0; i<16; i++) {
            const spokeGeom = new THREE.CylinderGeometry(0.3, 0.3, 9, 16);
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.rotation.z = Math.PI/2;
            spoke.rotation.x = (i / 16) * Math.PI;
            wheel.add(spoke);
        }
        
        wheel.position.set(pos.x, pos.y, pos.z);
        wheelsGroup.add(wheel);
        meshes.wheels.push(wheel);
    });
    group.add(wheelsGroup);

    parts.push({
        name: "Aggressive Off-Road Tires",
        description: "Massive tires utilizing TorusGeometry and extruded BoxGeometry lugs for extreme traction, paired with complex cylinder spoke rims.",
        material: "rubber / darkSteel / chrome",
        function: "Locomotion and terrain traversal",
        assemblyOrder: 2,
        connections: ["Chassis"],
        failureEffect: "Loss of mobility.",
        cascadeFailures: ["Stranded payload"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    // 3. Heavy-Duty Hydraulic Suspension & Steering
    const suspensionGroup = new THREE.Group();
    wheelPositions.forEach((pos) => {
        // Piston (Cylinder inside Cylinder)
        const outerPistonGeom = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
        const outerPiston = new THREE.Mesh(outerPistonGeom, copper);
        outerPiston.position.set(pos.x > 0 ? pos.x - 4 : pos.x + 4, pos.y + 2, pos.z);
        
        const innerPistonGeom = new THREE.CylinderGeometry(1, 1, 10, 32);
        const innerPiston = new THREE.Mesh(innerPistonGeom, steel);
        innerPiston.position.set(0, -2, 0);
        outerPiston.add(innerPiston);
        
        suspensionGroup.add(outerPiston);
    });
    group.add(suspensionGroup);

    parts.push({
        name: "Hydraulic Suspension Pistons",
        description: "Complex Cylinder-within-Cylinder hydraulic pistons providing immense lift and dampening for the heavy mobile chassis.",
        material: "copper / steel",
        function: "Shock absorption",
        assemblyOrder: 3,
        connections: ["Chassis", "Tires"],
        failureEffect: "Chassis bottoming out.",
        cascadeFailures: ["Vibration damage to Spintronics core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 4. Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 10, 15);
    
    // Main cabin shell
    const cabinShellGeom = new THREE.BoxGeometry(16, 12, 14);
    const cabinShell = new THREE.Mesh(cabinShellGeom, steel);
    cabinGroup.add(cabinShell);
    
    // Tinted Glass Window
    const windowGeom = new THREE.BoxGeometry(14, 6, 1);
    const windowMesh = new THREE.Mesh(windowGeom, tinted);
    windowMesh.position.set(0, 1, 7.1);
    cabinGroup.add(windowMesh);
    
    // Steering Wheel & Joysticks
    const steeringGeom = new THREE.TorusGeometry(1.5, 0.2, 16, 32);
    const steering = new THREE.Mesh(steeringGeom, plastic);
    steering.position.set(-3, 0, 5);
    steering.rotation.x = -Math.PI/4;
    cabinGroup.add(steering);
    
    const joystickGeom = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const joystick = new THREE.Mesh(joystickGeom, rubber);
    joystick.position.set(3, -1, 5);
    joystick.rotation.x = Math.PI/6;
    cabinGroup.add(joystick);
    meshes.joystick = joystick;
    
    // Glowing Control Panels
    const panelGeom = new THREE.BoxGeometry(12, 3, 0.5);
    const panel = new THREE.Mesh(panelGeom, glowingScreen);
    panel.position.set(0, -2, 6.5);
    panel.rotation.x = -Math.PI/6;
    cabinGroup.add(panel);
    
    // Side Mirrors
    const mirrorSupportGeom = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const mirrorGeom = new THREE.BoxGeometry(1, 2, 0.2);
    
    const leftMirror = new THREE.Group();
    const lSup = new THREE.Mesh(mirrorSupportGeom, chrome);
    lSup.rotation.z = Math.PI/2;
    lSup.position.set(-9.5, 1, 4);
    const lMir = new THREE.Mesh(mirrorGeom, glass);
    lMir.position.set(-11, 1, 4);
    leftMirror.add(lSup, lMir);
    cabinGroup.add(leftMirror);
    
    const rightMirror = new THREE.Group();
    const rSup = new THREE.Mesh(mirrorSupportGeom, chrome);
    rSup.rotation.z = Math.PI/2;
    rSup.position.set(9.5, 1, 4);
    const rMir = new THREE.Mesh(mirrorGeom, glass);
    rMir.position.set(11, 1, 4);
    rightMirror.add(rSup, rMir);
    cabinGroup.add(rightMirror);

    // Ladders
    const ladderGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const stepGeom = new THREE.CylinderGeometry(0.2, 0.2, 3);
        const step = new THREE.Mesh(stepGeom, chrome);
        step.rotation.z = Math.PI/2;
        step.position.set(8.5, -5 + i*2, 0);
        ladderGroup.add(step);
    }
    cabinGroup.add(ladderGroup);

    group.add(cabinGroup);

    parts.push({
        name: "Command Cabin",
        description: "Fully manned operator cabin featuring tinted glass, steering wheels, joysticks, glowing control panels, side mirrors, and access ladders.",
        material: "steel / tinted / plastic / glowingScreen",
        function: "Vehicle piloting and system monitoring",
        assemblyOrder: 4,
        connections: ["Chassis", "Logic Controllers"],
        failureEffect: "Loss of manual control.",
        cascadeFailures: ["Vehicle crash"],
        originalPosition: { x: 0, y: 10, z: 15 },
        explodedPosition: { x: 0, y: 35, z: 35 }
    });

    // 5. Exhaust Stacks & Hydraulic Lines
    const exhaustGroup = new THREE.Group();
    const stackGeom = new THREE.CylinderGeometry(1.5, 1.5, 15, 32);
    const stack1 = new THREE.Mesh(stackGeom, chrome);
    stack1.position.set(-10, 12, -20);
    const stack2 = new THREE.Mesh(stackGeom, chrome);
    stack2.position.set(10, 12, -20);
    exhaustGroup.add(stack1, stack2);
    
    // Hydraulic Lines via TubeGeometry
    const hCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 2, -15),
        new THREE.Vector3(-12, 6, -10),
        new THREE.Vector3(-14, 4, -5),
        new THREE.Vector3(-15, 8, 0)
    ]);
    const hLineGeom = new THREE.TubeGeometry(hCurve, 64, 0.5, 16, false);
    const hLine = new THREE.Mesh(hLineGeom, rubber);
    exhaustGroup.add(hLine);
    group.add(exhaustGroup);

    parts.push({
        name: "Exhaust & Hydraulic Network",
        description: "Massive chrome exhaust stacks and extensive rubber TubeGeometry hydraulic lines routing fluids throughout the vehicle.",
        material: "chrome / rubber",
        function: "Emissions and fluid transport",
        assemblyOrder: 5,
        connections: ["Chassis", "Suspension"],
        failureEffect: "Hydraulic pressure loss.",
        cascadeFailures: ["Suspension collapse", "Steering failure"],
        originalPosition: { x: 0, y: 12, z: -20 },
        explodedPosition: { x: 0, y: 30, z: -40 }
    });

    // --- SPINTRONICS MEMORY CORE PAYLOAD ---
    const memoryCoreGroup = new THREE.Group();
    memoryCoreGroup.position.set(0, 5, -5);

    // 6. Quantum Isolation Platform
    const tableGeom = new THREE.CylinderGeometry(14, 15, 4, 64);
    const tableMesh = new THREE.Mesh(tableGeom, darkSteel);
    memoryCoreGroup.add(tableMesh);

    parts.push({
        name: "Quantum Isolation Table",
        description: "Vibration-free platform mounted on the chassis, securing the nanoscale memory components from vehicular rumble.",
        material: "darkSteel",
        function: "Payload stabilization",
        assemblyOrder: 6,
        connections: ["Chassis", "U-Racetrack"],
        failureEffect: "Nanowire misalignment.",
        cascadeFailures: ["Read/write errors"],
        originalPosition: { x: 0, y: 5, z: -5 },
        explodedPosition: { x: 0, y: 25, z: -5 }
    });

    // 7. Permalloy U-Racetrack
    const curvePoints = [];
    curvePoints.push(new THREE.Vector3( -4, 12, 0 ));
    curvePoints.push(new THREE.Vector3( -4, 2, 0 ));
    curvePoints.push(new THREE.Vector3( -2, 0.5, 0 ));
    curvePoints.push(new THREE.Vector3( 0, 0, 0 ));
    curvePoints.push(new THREE.Vector3( 2, 0.5, 0 ));
    curvePoints.push(new THREE.Vector3( 4, 2, 0 ));
    curvePoints.push(new THREE.Vector3( 4, 12, 0 ));
    
    const racetrackCurve = new THREE.CatmullRomCurve3(curvePoints);
    const racetrackGeom = new THREE.TubeGeometry(racetrackCurve, 200, 0.6, 32, false);
    const racetrackMesh = new THREE.Mesh(racetrackGeom, steel);
    racetrackMesh.position.set(0, 3, 0);
    memoryCoreGroup.add(racetrackMesh);

    parts.push({
        name: "Permalloy U-Racetrack",
        description: "A U-shaped nanowire (Ni80Fe20) where massive volumes of data are stored as moving magnetic domains.",
        material: "steel",
        function: "Data substrate",
        assemblyOrder: 7,
        connections: ["Quantum Table", "Read/Write Heads"],
        failureEffect: "Data loss.",
        cascadeFailures: ["Domain wall pinning"],
        originalPosition: { x: 0, y: 8, z: -5 },
        explodedPosition: { x: 0, y: 40, z: -5 }
    });

    // 8. Magnetic Domain Walls (Bits)
    const domainGroup = new THREE.Group();
    domainGroup.position.set(0, 3, 0);
    const domains = [];
    const domainGeom = new THREE.CylinderGeometry(0.65, 0.65, 1.2, 32);
    domainGeom.rotateX(Math.PI/2);
    const numDomains = 40;
    
    for (let i = 0; i < numDomains; i++) {
        const mat = i % 2 === 0 ? neonBlue : neonRed;
        const dom = new THREE.Mesh(domainGeom, mat);
        domains.push({ mesh: dom, offset: i / numDomains });
        domainGroup.add(dom);
    }
    memoryCoreGroup.add(domainGroup);
    meshes.domains = domains;
    meshes.curve = racetrackCurve;

    parts.push({
        name: "Magnetic Domain Walls",
        description: "Information bits shifting along the track via Spin Transfer Torque. Blue=1, Red=0.",
        material: "neonBlue / neonRed",
        function: "Binary storage",
        assemblyOrder: 8,
        connections: ["Permalloy U-Racetrack"],
        failureEffect: "Bit flips.",
        cascadeFailures: ["Data corruption"],
        originalPosition: { x: 0, y: 8, z: -5 },
        explodedPosition: { x: 0, y: 50, z: -5 }
    });

    // 9. Spin-Polarized Current Injector (Write Head)
    const writeHeadGroup = new THREE.Group();
    const injectorGeom = new THREE.CylinderGeometry(2, 2, 4, 32);
    const injectorMesh = new THREE.Mesh(injectorGeom, copper);
    injectorMesh.position.set(-4, 2, 0);
    writeHeadGroup.add(injectorMesh);
    
    const ringGeom = new THREE.TorusGeometry(2.5, 0.3, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeom, neonGreen);
    ringMesh.position.set(-4, 4, 0);
    ringMesh.rotation.x = Math.PI / 2;
    writeHeadGroup.add(ringMesh);
    meshes.writeRing = ringMesh;
    
    writeHeadGroup.position.set(0, 3, 0);
    memoryCoreGroup.add(writeHeadGroup);

    parts.push({
        name: "Spin-Polarized Injector",
        description: "Injects spin-polarized electrons to write data and shift domains along the track.",
        material: "copper / neonGreen",
        function: "Data writing and shifting",
        assemblyOrder: 9,
        connections: ["U-Racetrack"],
        failureEffect: "Inability to shift domains.",
        cascadeFailures: ["Thermal runaway"],
        originalPosition: { x: 0, y: 6, z: -5 },
        explodedPosition: { x: -20, y: 20, z: -5 }
    });

    // 10. TMR Read Sensor
    const readHeadGroup = new THREE.Group();
    const tmrBaseGeom = new THREE.BoxGeometry(3, 4, 3);
    const tmrBase = new THREE.Mesh(tmrBaseGeom, aluminum);
    tmrBase.position.set(4, 3, 0);
    readHeadGroup.add(tmrBase);
    
    const readIndGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const readInd = new THREE.Mesh(readIndGeom, neonBlue);
    readInd.position.set(4, 5.5, 0);
    readHeadGroup.add(readInd);
    meshes.readIndicator = readInd;
    
    readHeadGroup.position.set(0, 3, 0);
    memoryCoreGroup.add(readHeadGroup);

    parts.push({
        name: "TMR Read Sensor",
        description: "Tunnel Magnetoresistance sensor capable of detecting molecular magnetic shifts at immense speeds.",
        material: "aluminum / neonBlue",
        function: "Data reading",
        assemblyOrder: 10,
        connections: ["U-Racetrack"],
        failureEffect: "Parity errors.",
        cascadeFailures: ["System lockup"],
        originalPosition: { x: 0, y: 6, z: -5 },
        explodedPosition: { x: 20, y: 20, z: -5 }
    });

    // 11. Logic Controller Board
    const busGroup = new THREE.Group();
    const busBoardGeom = new THREE.BoxGeometry(10, 1, 6);
    const busBoard = new THREE.Mesh(busBoardGeom, plastic);
    busBoard.position.set(0, 2.5, 6);
    busGroup.add(busBoard);
    for(let i=0; i<4; i++) {
        const chipGeom = new THREE.BoxGeometry(1.5, 0.5, 2);
        const chip = new THREE.Mesh(chipGeom, darkSteel);
        chip.position.set(-3 + i*2, 3, 6);
        busGroup.add(chip);
    }
    memoryCoreGroup.add(busGroup);

    parts.push({
        name: "Logic Controller Board",
        description: "Synchronizes the exact timing of current pulses to shift domain walls exactly one bit length.",
        material: "plastic / darkSteel",
        function: "Timing and logic",
        assemblyOrder: 11,
        connections: ["Injectors", "Sensors"],
        failureEffect: "Domain wall overshoot.",
        cascadeFailures: ["Data corruption"],
        originalPosition: { x: 0, y: 7.5, z: 1 },
        explodedPosition: { x: 0, y: 15, z: 20 }
    });

    // 12. Cryogenic Cooling Manifold
    const coolingGroup = new THREE.Group();
    const pipeGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 2, 5),
        new THREE.Vector3(-6, 6, 2),
        new THREE.Vector3(-3, 8, 0)
    ]), 32, 0.5, 16, false);
    const pipe1 = new THREE.Mesh(pipeGeom, chrome);
    coolingGroup.add(pipe1);
    const pipe2 = new THREE.Mesh(pipeGeom, chrome);
    pipe2.position.set(0, 0, 0);
    pipe2.rotation.y = Math.PI;
    coolingGroup.add(pipe2);
    memoryCoreGroup.add(coolingGroup);

    parts.push({
        name: "Cryogenic Cooling Manifold",
        description: "Circulates liquid nitrogen to minimize thermal noise that could spontaneously flip magnetic bits.",
        material: "chrome",
        function: "Thermal regulation",
        assemblyOrder: 12,
        connections: ["U-Racetrack"],
        failureEffect: "Thermal noise increases.",
        cascadeFailures: ["Spontaneous erasure"],
        originalPosition: { x: 0, y: 5, z: -5 },
        explodedPosition: { x: 0, y: 30, z: -25 }
    });

    // 13. Quantum Power Core
    const coreGeom = new THREE.CylinderGeometry(4, 4, 5, 32);
    const coreMesh = new THREE.Mesh(coreGeom, darkSteel);
    coreMesh.position.set(0, 4, -8);
    const energyGeom = new THREE.SphereGeometry(2.5, 32, 32);
    const energyMesh = new THREE.Mesh(energyGeom, neonBlue);
    energyMesh.position.set(0, 2.5, 0);
    coreMesh.add(energyMesh);
    meshes.energyCore = energyMesh;
    memoryCoreGroup.add(coreMesh);

    parts.push({
        name: "Quantum Power Core",
        description: "Generates precise ultra-low noise DC current for STT operations.",
        material: "darkSteel / neonBlue",
        function: "Power generation",
        assemblyOrder: 13,
        connections: ["Logic Board", "Injectors"],
        failureEffect: "Voltage spikes.",
        cascadeFailures: ["Head burnout"],
        originalPosition: { x: 0, y: 9, z: -13 },
        explodedPosition: { x: 0, y: 25, z: -35 }
    });

    // 14. Opto-Magnetic Alignment Lasers
    const laserGroup = new THREE.Group();
    const laserGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    for(let i=0; i<3; i++) {
        const laser = new THREE.Mesh(laserGeom, steel);
        laser.position.set(-3 + i*3, 15, 0);
        laser.rotation.x = Math.PI/2;
        const beamGeom = new THREE.CylinderGeometry(0.1, 0.1, 12, 16);
        const beam = new THREE.Mesh(beamGeom, neonRed);
        beam.position.set(0, -6, 0);
        laser.add(beam);
        laserGroup.add(laser);
    }
    memoryCoreGroup.add(laserGroup);
    meshes.lasers = laserGroup;

    parts.push({
        name: "Opto-Magnetic Alignment Lasers",
        description: "Uses femtosecond laser pulses for Heat-Assisted Magnetic Recording (HAMR) to lower coercivity during writing.",
        material: "steel / neonRed",
        function: "HAMR assistance",
        assemblyOrder: 14,
        connections: ["U-Racetrack"],
        failureEffect: "High write error rates.",
        cascadeFailures: ["Domain pinning"],
        originalPosition: { x: 0, y: 20, z: -5 },
        explodedPosition: { x: 0, y: 60, z: -5 }
    });

    // 15. Mu-Metal Shielding Dome
    const domeGeom = new THREE.SphereGeometry(14, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.1);
    const domeMesh = new THREE.Mesh(domeGeom, tinted);
    domeMesh.position.set(0, 3, 0);
    domeMesh.material = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.3,
        roughness: 0.1,
        transmission: 0.8,
        transparent: true,
        opacity: 0.5
    });
    memoryCoreGroup.add(domeMesh);

    parts.push({
        name: "Mu-Metal Shielding Dome",
        description: "Nickel-iron alloy enclosure shielding the sensitive domains from stray cosmic or environmental magnetic fields.",
        material: "tinted",
        function: "Magnetic shielding",
        assemblyOrder: 15,
        connections: ["Quantum Table"],
        failureEffect: "External field interference.",
        cascadeFailures: ["Complete memory wipe"],
        originalPosition: { x: 0, y: 8, z: -5 },
        explodedPosition: { x: 0, y: 70, z: -5 }
    });

    // 16. Turbo-Molecular Vacuum Pump
    const pumpGeom = new THREE.CylinderGeometry(2.5, 2.5, 6, 32);
    const pumpMesh = new THREE.Mesh(pumpGeom, aluminum);
    pumpMesh.position.set(10, 4, 8);
    pumpMesh.rotation.x = Math.PI/2;
    const fanGeom = new THREE.TorusGeometry(2, 0.5, 16, 32);
    const fan = new THREE.Mesh(fanGeom, darkSteel);
    fan.position.set(0, 3.5, 0);
    fan.rotation.x = Math.PI/2;
    pumpMesh.add(fan);
    meshes.pumpFan = fan;
    memoryCoreGroup.add(pumpMesh);

    parts.push({
        name: "Turbo-Molecular Vacuum Pump",
        description: "Maintains an ultra-high vacuum inside the dome to prevent oxidation of the nanoscopic permalloy wire.",
        material: "aluminum / darkSteel",
        function: "Vacuum maintenance",
        assemblyOrder: 16,
        connections: ["Shielding Dome"],
        failureEffect: "Oxidation of nanowire.",
        cascadeFailures: ["Track resistance increase", "Total failure"],
        originalPosition: { x: 10, y: 9, z: 3 },
        explodedPosition: { x: 40, y: 20, z: 20 }
    });

    // 17. High-Bandwidth I/O Ribbon
    const ribbonCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 3, 8),
        new THREE.Vector3(0, 1, 14),
        new THREE.Vector3(0, 4, 18)
    ]);
    const ribbonGeom = new THREE.ExtrudeGeometry(
        new THREE.Shape([
            new THREE.Vector2(-3, -0.2),
            new THREE.Vector2(3, -0.2),
            new THREE.Vector2(3, 0.2),
            new THREE.Vector2(-3, 0.2)
        ]),
        { extrudePath: ribbonCurve, steps: 64 }
    );
    const ribbon = new THREE.Mesh(ribbonGeom, plastic);
    memoryCoreGroup.add(ribbon);

    parts.push({
        name: "High-Bandwidth I/O Ribbon",
        description: "Transmits massive data streams from the memory payload directly to the operator cabin.",
        material: "plastic",
        function: "Data transmission",
        assemblyOrder: 17,
        connections: ["Logic Board", "Operator Cabin"],
        failureEffect: "Latency spikes.",
        cascadeFailures: ["I/O bottleneck"],
        originalPosition: { x: 0, y: 7, z: 5 },
        explodedPosition: { x: -15, y: 15, z: 15 }
    });

    // 18. Diagnostic Holographic Projectors
    const holoRingGeom = new THREE.TorusGeometry(16, 0.2, 16, 64);
    const holoRing = new THREE.Mesh(holoRingGeom, glowingScreen);
    holoRing.position.set(0, 10, 0);
    holoRing.rotation.x = Math.PI/2;
    memoryCoreGroup.add(holoRing);
    meshes.holoRing = holoRing;

    parts.push({
        name: "Diagnostic Holographic Projectors",
        description: "Projects massive telemetry rings around the payload for the operators to monitor domain wall stability.",
        material: "glowingScreen",
        function: "Telemetry UI",
        assemblyOrder: 18,
        connections: ["Logic Board"],
        failureEffect: "Loss of visual data.",
        cascadeFailures: ["Delayed maintenance"],
        originalPosition: { x: 0, y: 15, z: -5 },
        explodedPosition: { x: 0, y: 80, z: -5 }
    });

    group.add(memoryCoreGroup);

    const description = "The Mobile Spintronics Racetrack Memory Unit is a colossal, manned all-terrain vehicle transporting an ultra-high density quantum memory core. It utilizes Spin Transfer Torque to shift magnetic domain walls along a nanoscopic permalloy U-shaped wire. Complete with massive off-road tires, hydraulic suspension, a high-tech operator cabin, and cryogenic shielding, this machine brings solid-state supercomputing to the most extreme environments.";

    const quizQuestions = [
        {
            question: "What mechanism is used to shift the magnetic domains along the U-racetrack?",
            options: [
                "Lorentz Force",
                "Spin Transfer Torque (STT)",
                "Pneumatic pressure",
                "Electrostatic Repulsion"
            ],
            correctAnswer: 1,
            explanation: "Spin Transfer Torque (STT) injects a spin-polarized current that transfers angular momentum to the domain walls, shifting them along the permalloy wire."
        },
        {
            question: "Why does the vehicle's memory core require a Mu-Metal Shielding Dome?",
            options: [
                "To protect against physical shrapnel",
                "To shield the highly sensitive magnetic domains from external stray magnetic fields",
                "To contain toxic cooling gases",
                "To enhance radio transmissions"
            ],
            correctAnswer: 1,
            explanation: "Mu-Metal has exceptional magnetic permeability, effectively absorbing environmental magnetic fields that could flip or scramble the delicate magnetic bits."
        },
        {
            question: "What is the primary function of the TMR Read Sensor?",
            options: [
                "To cool the nanowire",
                "To measure the vehicle's speed",
                "To detect changes in quantum tunneling resistance caused by different magnetic domain orientations",
                "To inject data into the track"
            ],
            correctAnswer: 2,
            explanation: "Tunnel Magnetoresistance (TMR) sensors detect passing domains by measuring changes in electrical resistance, translating magnetic states into 1s and 0s."
        },
        {
            question: "How do the Opto-Magnetic Lasers assist in data writing?",
            options: [
                "They provide localized Heat-Assisted Magnetic Recording (HAMR) to lower coercivity",
                "They blind hostile observers",
                "They recharge the quantum core",
                "They illuminate the track for the operators"
            ],
            correctAnswer: 0,
            explanation: "HAMR uses precise laser pulses to temporarily heat a nanoscale region. This drastically lowers its magnetic coercivity, allowing the STT injector to write data using far less power."
        },
        {
            question: "What justifies the immense All-Terrain Tires and Hydraulic Suspension for a memory device?",
            options: [
                "Aesthetics",
                "To provide massive physical shock absorption and mobility for deploying supercomputing hardware in extreme, volatile environments",
                "To generate static electricity",
                "To crush obstacles"
            ],
            correctAnswer: 1,
            explanation: "The heavy-duty TorusGeometry tires and complex hydraulic cylinders isolate the delicate quantum table from seismic shocks while enabling the transport of massive data sets across rugged terrain."
        }
    ];

    function animate(time, speed, m) {
        // Rotate massive wheels based on speed
        if (m.wheels) {
            m.wheels.forEach(w => {
                w.rotation.x -= 0.05 * speed;
            });
        }
        
        // Pulse the Quantum Core
        if (m.energyCore) {
            m.energyCore.scale.setScalar(1 + Math.sin(time * 3 * speed) * 0.1);
            m.energyCore.material.emissiveIntensity = 2 + Math.sin(time * 5 * speed);
        }
        
        // Spin the Vacuum Pump Fan
        if (m.pumpFan) {
            m.pumpFan.rotation.y += 0.3 * speed;
        }

        // Pulse the write injector ring
        if (m.writeRing) {
            m.writeRing.scale.setScalar(1 + Math.sin(time * 10 * speed) * 0.2);
        }

        // Flicker read indicator
        if (m.readIndicator) {
            m.readIndicator.material.emissiveIntensity = Math.random() > 0.5 ? 2.5 : 0.5;
        }

        // Rotate Holographic telemetry ring
        if (m.holoRing) {
            m.holoRing.rotation.z = time * 0.5 * speed;
            m.holoRing.scale.setScalar(1 + Math.sin(time * 2 * speed) * 0.03);
        }
        
        // Animate operator joystick
        if (m.joystick) {
            m.joystick.rotation.x = Math.PI/6 + Math.sin(time * speed) * 0.1;
            m.joystick.rotation.z = Math.cos(time * speed * 1.5) * 0.1;
        }

        // Move magnetic domains along the track curve
        if (m.domains && m.curve) {
            const domainSpeed = 0.08 * speed;
            
            m.domains.forEach(domainObj => {
                domainObj.offset += domainSpeed * 0.01; 
                if (domainObj.offset > 1) {
                    domainObj.offset -= 1;
                    domainObj.mesh.material = Math.random() > 0.5 ? neonBlue : neonRed;
                }
                
                const point = m.curve.getPointAt(domainObj.offset);
                domainObj.mesh.position.copy(point);
                
                const tangent = m.curve.getTangentAt(domainObj.offset);
                const axis = new THREE.Vector3(0, 1, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
                domainObj.mesh.quaternion.copy(quaternion);
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRacetrackMemory() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
