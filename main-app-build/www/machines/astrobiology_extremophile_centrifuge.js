import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- MATERIALS ---
    const glowingGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2, transparent: true, opacity: 0.8
    });
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.5, transparent: true, opacity: 0.9
    });
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.8
    });
    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500, emissive: 0xff3300, emissiveIntensity: 2.5
    });

    // --- 1. BASE PLATE & VIBRATION DAMPERS ---
    const baseGroup = new THREE.Group();
    const baseRadius = 22;
    const baseHeight = 3;
    const baseShape = new THREE.Shape();
    baseShape.moveTo(baseRadius, 0);
    for(let i=1; i<=16; i++) {
        const theta = (i/16) * Math.PI * 2;
        const rad = (i % 2 === 0) ? baseRadius : baseRadius - 2;
        baseShape.lineTo(Math.cos(theta) * rad, Math.sin(theta) * rad);
    }
    const baseExtrudeSettings = { depth: baseHeight, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const baseGeom = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeom.rotateX(Math.PI/2);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.y = baseHeight;
    baseGroup.add(baseMesh);

    // Dampers
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const damperGeom = new THREE.CylinderGeometry(2, 2.5, 1.5, 32);
        const damper = new THREE.Mesh(damperGeom, rubber);
        damper.position.set(Math.cos(angle) * (baseRadius - 3), 0.75, Math.sin(angle) * (baseRadius - 3));
        
        // Add steel housing over damper
        const damperHousingGeom = new THREE.CylinderGeometry(2.6, 2.6, 1, 16);
        const damperHousing = new THREE.Mesh(damperHousingGeom, steel);
        damperHousing.position.y = 1;
        damper.add(damperHousing);

        baseGroup.add(damper);
    }
    group.add(baseGroup);
    meshes.base = baseGroup;

    parts.push({
        name: 'Seismic Shock-Absorbing Base',
        description: 'Multi-faceted hardened steel base with 8 massive vulcanized rubber dampening feet, designed to absorb violent kinetic oscillations.',
        material: 'darkSteel, rubber, steel',
        function: 'Secures the centrifuge to the bedrock, preventing lateral drift at 100,000 RPM.',
        assemblyOrder: 1,
        connections: ['floor', 'stator_bowl'],
        failureEffect: 'Centrifuge detaches from floor, causing catastrophic structural tear-out.',
        cascadeFailures: ['stator_bowl', 'motor_core'],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // --- 2. MASSIVE MOTOR CORE ---
    const motorGroup = new THREE.Group();
    motorGroup.position.y = baseHeight;
    const motorRadius = 10;
    const motorHeight = 12;
    
    // Core cylinder
    const motorCoreGeom = new THREE.CylinderGeometry(motorRadius, motorRadius+1, motorHeight, 64);
    const motorCore = new THREE.Mesh(motorCoreGeom, darkSteel);
    motorCore.position.y = motorHeight/2;
    motorGroup.add(motorCore);

    // Superconducting Coils (Torus arrays)
    for(let i=0; i<5; i++) {
        const coilGeom = new THREE.TorusGeometry(motorRadius + 1.2, 0.6, 16, 64);
        const coil = new THREE.Mesh(coilGeom, copper);
        coil.rotation.x = Math.PI/2;
        coil.position.y = 2 + (i * 2);
        motorGroup.add(coil);
    }
    
    group.add(motorGroup);
    meshes.motor = motorGroup;

    parts.push({
        name: 'Mag-Lev Superconducting Stator',
        description: 'Five tiers of dense copper-niobium coils generating a frictionless magnetic suspension field.',
        material: 'darkSteel, copper',
        function: 'Levitates and accelerates the drive shaft to hypersonic rotational velocities.',
        assemblyOrder: 2,
        connections: ['base_plate', 'drive_shaft', 'cooling_lines'],
        failureEffect: 'Magnetic field collapse, resulting in instant high-friction rotor strike.',
        cascadeFailures: ['drive_shaft', 'rotor_assembly'],
        originalPosition: {x: 0, y: 3 + motorHeight/2, z: 0},
        explodedPosition: {x: 0, y: -5, z: -25}
    });

    // --- 3. CRYOGENIC COOLING SYSTEM ---
    const cryoGroup = new THREE.Group();
    cryoGroup.position.y = baseHeight;
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI*2;
        // Vert cooling pipes
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*14, 0, Math.sin(angle)*14),
            new THREE.Vector3(Math.cos(angle)*13, motorHeight/2, Math.sin(angle)*13),
            new THREE.Vector3(Math.cos(angle)*11, motorHeight, Math.sin(angle)*11)
        ]);
        const pipeGeom = new THREE.TubeGeometry(pipeCurve, 32, 0.8, 16, false);
        const pipe = new THREE.Mesh(pipeGeom, chrome);
        
        // Heat sinks
        const sinkGeom = new THREE.BoxGeometry(2, 4, 3);
        const sink = new THREE.Mesh(sinkGeom, aluminum);
        sink.position.set(Math.cos(angle)*14, motorHeight/2, Math.sin(angle)*14);
        sink.lookAt(0, motorHeight/2, 0);
        
        cryoGroup.add(pipe);
        cryoGroup.add(sink);
    }
    group.add(cryoGroup);

    parts.push({
        name: 'Liquid Helium Cryo-Plumbing',
        description: 'Chrome-plated vacuum-jacketed tubes pumping liquid helium at 4 Kelvin into the stators.',
        material: 'chrome, aluminum',
        function: 'Prevents the stators from vaporizing under immense electrical loads.',
        assemblyOrder: 3,
        connections: ['motor_core'],
        failureEffect: 'Quench event. Motor immediately melts down into liquid slag.',
        cascadeFailures: ['motor_core'],
        originalPosition: {x: 0, y: 9, z: 0},
        explodedPosition: {x: -25, y: 9, z: 25}
    });

    // --- 4. DRIVE SHAFT ---
    const shaftRadius = 2.5;
    const shaftHeight = 16;
    const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftHeight, 32);
    const shaft = new THREE.Mesh(shaftGeom, chrome);
    shaft.position.y = baseHeight + motorHeight - 2 + shaftHeight/2;
    
    // Add spline teeth to shaft
    for(let i=0; i<12; i++) {
        const splineGeom = new THREE.BoxGeometry(0.5, shaftHeight, 0.5);
        const spline = new THREE.Mesh(splineGeom, steel);
        const angle = (i/12)*Math.PI*2;
        spline.position.set(Math.cos(angle)*shaftRadius, 0, Math.sin(angle)*shaftRadius);
        spline.rotation.y = -angle;
        shaft.add(spline);
    }
    group.add(shaft);
    meshes.shaft = shaft;

    parts.push({
        name: 'Titanium-Tungsten Splined Drive Shaft',
        description: 'An ultra-dense shaft with 12 locking splines to prevent torsional slippage.',
        material: 'chrome, steel',
        function: 'Transmits kinetic torque directly to the rotor without fracturing.',
        assemblyOrder: 4,
        connections: ['motor_core', 'rotor_assembly'],
        failureEffect: 'Shaft snaps, rotor flies off-axis, destroying the containment bowl.',
        cascadeFailures: ['stator_bowl', 'casing_door'],
        originalPosition: {x: 0, y: 23, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // --- 5. ARMORED STATOR BOWL ---
    const bowlGroup = new THREE.Group();
    bowlGroup.position.y = baseHeight + 5;
    
    const bowlPoints = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        // complex bell shape
        bowlPoints.push(new THREE.Vector2( 15 + Math.sin(t*Math.PI*0.5)*12, t * 24 ));
    }
    const bowlGeom = new THREE.LatheGeometry(bowlPoints, 64);
    const bowl = new THREE.Mesh(bowlGeom, steel);
    bowlGroup.add(bowl);

    // Hexagonal structural ribs on the outside of the bowl
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI*2;
        const ribGeom = new THREE.BoxGeometry(1.5, 26, 3);
        const rib = new THREE.Mesh(ribGeom, darkSteel);
        rib.position.set(Math.cos(angle)*23, 12, Math.sin(angle)*23);
        rib.rotation.y = -angle;
        rib.rotation.x = -0.15; // match slant roughly
        bowlGroup.add(rib);
    }
    group.add(bowlGroup);

    parts.push({
        name: 'Depleted-Uranium Lined Containment Bowl',
        description: 'Outer casing designed to absorb multiple hyper-velocity shrapnel impacts.',
        material: 'steel, darkSteel',
        function: 'Operator safety containment.',
        assemblyOrder: 5,
        connections: ['base_plate', 'casing_door'],
        failureEffect: 'Shrapnel breaches containment, lethal hazard to lab personnel.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 40, y: 15, z: 0}
    });

    // --- 6. MOTORIZED CASING DOOR ---
    const doorGroup = new THREE.Group();
    // Hinge position
    const hingeZ = -27;
    const doorY = baseHeight + 5 + 24; 
    doorGroup.position.set(0, doorY, hingeZ);

    const doorMeshGroup = new THREE.Group();
    doorMeshGroup.position.set(0, 0, -hingeZ); // counter offset

    const doorOuterGeom = new THREE.CylinderGeometry(27, 27, 3, 64);
    const doorOuter = new THREE.Mesh(doorOuterGeom, steel);
    
    // Viewport
    const viewPortGeom = new THREE.CylinderGeometry(14, 14, 3.5, 64);
    const viewPort = new THREE.Mesh(viewPortGeom, tinted);
    
    // Viewport bracing cross
    const brace1Geom = new THREE.BoxGeometry(28, 3.6, 1);
    const brace1 = new THREE.Mesh(brace1Geom, darkSteel);
    const brace2Geom = new THREE.BoxGeometry(1, 3.6, 28);
    const brace2 = new THREE.Mesh(brace2Geom, darkSteel);

    doorMeshGroup.add(doorOuter);
    doorMeshGroup.add(viewPort);
    doorMeshGroup.add(brace1);
    doorMeshGroup.add(brace2);
    doorGroup.add(doorMeshGroup);
    group.add(doorGroup);
    meshes.door = doorGroup;

    parts.push({
        name: 'Blast-Shield Lid with Polycarbonate Viewport',
        description: 'Massive motorized door sealing the vacuum chamber. Features a 10-inch thick transparent aluminum viewport.',
        material: 'steel, tinted, darkSteel',
        function: 'Maintains internal vacuum and provides visual access.',
        assemblyOrder: 6,
        connections: ['stator_bowl', 'hydraulic_actuators'],
        failureEffect: 'Vacuum leak, resulting in explosive decompression or rotor friction.',
        cascadeFailures: ['vacuum_pumps'],
        originalPosition: {x: 0, y: 32, z: -27},
        explodedPosition: {x: 0, y: 60, z: -40}
    });

    // --- 7. HYDRAULIC ACTUATORS ---
    const hydroGroup = new THREE.Group();
    meshes.pistons = [];
    
    for (let i = -1; i <= 1; i += 2) { // left and right
        const actuator = new THREE.Group();
        actuator.position.set(i * 20, baseHeight + 15, -20);
        
        const cylinderGeom = new THREE.CylinderGeometry(1.2, 1.2, 12, 16);
        const cylinder = new THREE.Mesh(cylinderGeom, darkSteel);
        // Angle them towards the lid
        cylinder.rotation.x = -Math.PI / 6;
        actuator.add(cylinder);

        const pistonGeom = new THREE.CylinderGeometry(0.7, 0.7, 14, 16);
        const piston = new THREE.Mesh(pistonGeom, chrome);
        piston.position.y = 6;
        cylinder.add(piston);
        meshes.pistons.push(piston);

        hydroGroup.add(actuator);
    }
    group.add(hydroGroup);

    parts.push({
        name: 'Dual-Axis Hydraulic Rams',
        description: 'Industrial hydraulics capable of lifting 50 tons, used to open the blast lid.',
        material: 'darkSteel, chrome',
        function: 'Actuates the containment lid smoothly.',
        assemblyOrder: 7,
        connections: ['stator_bowl', 'casing_door'],
        failureEffect: 'Lid cannot be opened, trapping biological samples inside.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 18, z: -20},
        explodedPosition: {x: 0, y: 18, z: -50}
    });

    // --- 8. TITANIUM ROTOR ASSEMBLY ---
    const rotorGroup = new THREE.Group();
    // Position on shaft
    rotorGroup.position.y = baseHeight + motorHeight + shaftHeight - 4;
    
    // Aerodynamic swept profile
    const rotorPoints = [];
    for(let i=0; i<=15; i++) {
        const t = i/15;
        // sharp swooping curve
        rotorPoints.push(new THREE.Vector2( 2.5 + Math.pow(t, 2)*18, 12 - t*10 ));
    }
    for(let i=0; i<=15; i++) {
        const t = i/15;
        rotorPoints.push(new THREE.Vector2( 20.5 - t*18, 2 - Math.pow(t, 2)*4 ));
    }
    rotorPoints.push(new THREE.Vector2(2.5, 12)); // close
    const rotorGeom = new THREE.LatheGeometry(rotorPoints, 64);
    const rotorBody = new THREE.Mesh(rotorGeom, aluminum); // polished ti look
    rotorGroup.add(rotorBody);

    // Inner hub collar
    const collarGeom = new THREE.CylinderGeometry(3.5, 3.5, 14, 32);
    const collar = new THREE.Mesh(collarGeom, chrome);
    collar.position.y = 5;
    rotorGroup.add(collar);
    
    group.add(rotorGroup);
    meshes.rotor = rotorGroup;

    parts.push({
        name: 'Precision-Milled Titanium Rotor',
        description: 'The heart of the centrifuge. Slices through any remaining air molecules effortlessly.',
        material: 'titanium (aluminum visual), chrome',
        function: 'Houses payload. Spins at 100k RPM, generating extreme centrifugal forces.',
        assemblyOrder: 8,
        connections: ['drive_shaft', 'payload_tubes'],
        failureEffect: 'Explosive fragmentation into thousands of supersonic shards.',
        cascadeFailures: ['stator_bowl', 'payload_tubes', 'drive_shaft'],
        originalPosition: {x: 0, y: 29, z: 0},
        explodedPosition: {x: 0, y: 70, z: 0}
    });

    // --- 9. BIOLOGICAL PAYLOAD TUBES ---
    const tubeGroup = new THREE.Group();
    const numTubes = 36; // High capacity
    const tubeMats = [glowingGreen, glowingBlue, glowingRed, glowingOrange];
    
    for(let i=0; i<numTubes; i++) {
        const angle = (i/numTubes) * Math.PI*2;
        const radius = 18;
        const h = 4.5;
        
        // Slot rim
        const rimGeom = new THREE.TorusGeometry(0.7, 0.2, 16, 32);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.position.set(Math.cos(angle)*radius, h, Math.sin(angle)*radius);
        rim.rotation.y = -angle;
        rim.rotation.x = Math.PI/3; // angled sharply outwards
        tubeGroup.add(rim);

        // Tube itself
        const tubeAssy = new THREE.Group();
        tubeAssy.position.copy(rim.position);
        tubeAssy.rotation.copy(rim.rotation);
        
        const glassGeom = new THREE.CylinderGeometry(0.6, 0.4, 5, 16);
        glassGeom.translate(0, -2, 0);
        const glassMesh = new THREE.Mesh(glassGeom, glass);
        
        const contentGeom = new THREE.CylinderGeometry(0.4, 0.25, 4, 16);
        contentGeom.translate(0, -2.2, 0);
        const content = new THREE.Mesh(contentGeom, tubeMats[i % 4]);
        
        const capGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.8, 16);
        capGeom.translate(0, 0.5, 0);
        const cap = new THREE.Mesh(capGeom, plastic);
        
        tubeAssy.add(glassMesh);
        tubeAssy.add(content);
        tubeAssy.add(cap);
        tubeGroup.add(tubeAssy);
    }
    rotorGroup.add(tubeGroup);
    meshes.tubes = tubeGroup;

    parts.push({
        name: 'Borosilicate Payload Cartridges',
        description: '36 angled test tubes containing extremophile bacteria strains from deep-sea vents and meteorites.',
        material: 'glass, glowing bio-fluids, plastic, darkSteel',
        function: 'Subjecting alien and ancient microbes to 500,000 Gs.',
        assemblyOrder: 9,
        connections: ['titanium_rotor'],
        failureEffect: 'Microbial splatter inside the vacuum chamber. Extreme biohazard.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 33, z: 0},
        explodedPosition: {x: 0, y: 90, z: 0}
    });

    // --- 10. TURBOMOLECULAR VACUUM PUMPS ---
    const pumpGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const angle = (i/3)*Math.PI*2 + Math.PI/6;
        const pumpUnit = new THREE.Group();
        pumpUnit.position.set(Math.cos(angle)*28, baseHeight + 2, Math.sin(angle)*28);
        pumpUnit.lookAt(0, baseHeight + 2, 0);

        const pumpBodyGeom = new THREE.BoxGeometry(6, 8, 8);
        const pumpBody = new THREE.Mesh(pumpBodyGeom, darkSteel);
        pumpUnit.add(pumpBody);

        const fanGeom = new THREE.CylinderGeometry(3, 3, 2, 32);
        fanGeom.rotateX(Math.PI/2);
        const fan = new THREE.Mesh(fanGeom, steel);
        fan.position.z = 4.5;
        pumpUnit.add(fan);

        // Pipe to bowl
        const lineGeom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 4, 0),
            new THREE.Vector3(0, 10, -5),
            new THREE.Vector3(0, 15, -15)
        ]), 16, 1, 16, false);
        const line = new THREE.Mesh(lineGeom, rubber);
        pumpUnit.add(line);

        pumpGroup.add(pumpUnit);
    }
    group.add(pumpGroup);

    parts.push({
        name: 'Tri-Core Vacuum Pump Array',
        description: 'Three high-displacement pumps capable of creating a hard vacuum (10^-9 Torr) in seconds.',
        material: 'darkSteel, steel, rubber',
        function: 'Removes all atmospheric gases to prevent rotor friction.',
        assemblyOrder: 10,
        connections: ['stator_bowl'],
        failureEffect: 'Vacuum loss, friction superheats the rotor to melting point.',
        cascadeFailures: ['titanium_rotor'],
        originalPosition: {x: 28, y: 5, z: 0},
        explodedPosition: {x: 60, y: 5, z: 0}
    });

    // --- 11. NEON STATUS WARNING RINGS ---
    const ringGroup = new THREE.Group();
    const ringRadii = [26, 27, 28];
    meshes.rings = [];
    
    for(let i=0; i<3; i++) {
        const ringGeom = new THREE.TorusGeometry(ringRadii[i], 0.2, 16, 64);
        const ring = new THREE.Mesh(ringGeom, glowingBlue);
        ring.rotation.x = Math.PI/2;
        ring.position.y = baseHeight + 10 + (i*4);
        ringGroup.add(ring);
        meshes.rings.push(ring);
    }
    group.add(ringGroup);

    parts.push({
        name: 'Omni-Directional Threat Indicators',
        description: 'Three tiers of neon fiber-optics wrapped around the bowl.',
        material: 'glowingBlue',
        function: 'Visual readout of rotational speed and system health.',
        assemblyOrder: 11,
        connections: ['stator_bowl'],
        failureEffect: 'Lab techs are unaware of impending catastrophic over-spooling.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 18, z: 0},
        explodedPosition: {x: 0, y: 40, z: 0}
    });

    // --- 12. ADVANCED CONTROL CONSOLE ---
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(0, baseHeight + 2, 32);

    const consoleStandGeom = new THREE.CylinderGeometry(2, 4, 10, 4);
    const consoleStand = new THREE.Mesh(consoleStandGeom, darkSteel);
    consoleStand.position.y = 5;
    consoleStand.rotation.y = Math.PI/4;
    consoleGroup.add(consoleStand);

    const deskGeom = new THREE.BoxGeometry(14, 1, 8);
    const desk = new THREE.Mesh(deskGeom, steel);
    desk.position.y = 10;
    desk.rotation.x = Math.PI/12; // tilted towards user
    consoleGroup.add(desk);

    // Displays
    const dispGeom = new THREE.BoxGeometry(5, 4, 0.5);
    const disp1 = new THREE.Mesh(dispGeom, darkSteel);
    disp1.position.set(-3, 12, -2);
    disp1.rotation.x = -Math.PI/8;
    const disp2 = new THREE.Mesh(dispGeom, darkSteel);
    disp2.position.set(3, 12, -2);
    disp2.rotation.x = -Math.PI/8;
    
    const screenMat = new THREE.MeshStandardMaterial({color:0x000000, emissive:0x0033aa});
    const sGeom = new THREE.PlaneGeometry(4.5, 3.5);
    const s1 = new THREE.Mesh(sGeom, screenMat); s1.position.z = 0.26; disp1.add(s1);
    const s2 = new THREE.Mesh(sGeom, screenMat); s2.position.z = 0.26; disp2.add(s2);

    consoleGroup.add(disp1);
    consoleGroup.add(disp2);

    // Joystick and buttons
    const stickGeom = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const stick = new THREE.Mesh(stickGeom, plastic);
    stick.position.set(5, 10.5, 2);
    stick.rotation.x = Math.PI/8;
    consoleGroup.add(stick);
    
    for(let i=0; i<6; i++) {
        const btnGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2);
        const btn = new THREE.Mesh(btnGeom, i<2 ? glowingRed : glowingGreen);
        btn.position.set(-5 + i*1.2, 10.3, 2);
        consoleGroup.add(btn);
    }
    
    group.add(consoleGroup);

    parts.push({
        name: 'Biometric Operations Console',
        description: 'Tilted operator console with dual holographic readouts and manual override joystick.',
        material: 'darkSteel, steel, plastic, glowing screens',
        function: 'Interfaces with the centrifuge core for RPM staging and emergency braking.',
        assemblyOrder: 12,
        connections: ['floor', 'motor_core'],
        failureEffect: 'Loss of operational control. Machine must run until power depletion.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 7, z: 32},
        explodedPosition: {x: 0, y: 7, z: 60}
    });

    // --- 13. POWER CONDUITS ---
    const conduitGroup = new THREE.Group();
    const pCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 10.5, 30),
        new THREE.Vector3(-10, 0, 20),
        new THREE.Vector3(-10, 0, 0)
    ]);
    const conduitGeom = new THREE.TubeGeometry(pCurve, 64, 0.5, 16, false);
    
    for(let i=0; i<3; i++) {
        const c = new THREE.Mesh(conduitGeom, rubber);
        c.position.x = i*1.5;
        conduitGroup.add(c);
    }
    group.add(conduitGroup);

    parts.push({
        name: 'Armored Data & Power Conduits',
        description: 'Thick bundles of fiber-optics and superconducting wires linking the console to the motor.',
        material: 'rubber',
        function: 'Telemetry and power transmission.',
        assemblyOrder: 13,
        connections: ['control_console', 'motor_core'],
        failureEffect: 'Signal severance, triggering automatic emergency shutdown.',
        cascadeFailures: [],
        originalPosition: {x: -8, y: 2, z: 15},
        explodedPosition: {x: -30, y: 2, z: 30}
    });

    // --- 14. EMERGENCY BRAKE CALIPERS ---
    const brakeGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2;
        const bGeom = new THREE.BoxGeometry(6, 4, 8);
        const brake = new THREE.Mesh(bGeom, darkSteel);
        brake.position.set(Math.cos(angle)*12, baseHeight + motorHeight - 2, Math.sin(angle)*12);
        brake.lookAt(0, baseHeight + motorHeight - 2, 0);
        
        // Pad
        const padGeom = new THREE.BoxGeometry(4, 3, 2);
        const pad = new THREE.Mesh(padGeom, rubber); // carbon ceramic proxy
        pad.position.z = -3;
        brake.add(pad);
        
        brakeGroup.add(brake);
    }
    group.add(brakeGroup);
    meshes.brakes = brakeGroup;

    parts.push({
        name: 'Carbon-Ceramic Caliper Array',
        description: 'Four massive pneumatic brake calipers gripping the drive shaft flange.',
        material: 'darkSteel, rubber (ceramic)',
        function: 'Arrests 100,000 RPM momentum in under 10 seconds during an abort sequence.',
        assemblyOrder: 14,
        connections: ['drive_shaft', 'stator_bowl'],
        failureEffect: 'Brakes catch fire and disintegrate, leaving rotor to coast for hours.',
        cascadeFailures: [],
        originalPosition: {x: 0, y: 15, z: 0},
        explodedPosition: {x: 0, y: 15, z: -30}
    });

    // --- 15. KINETIC DEADBOLTS ---
    const boltGroup = new THREE.Group();
    meshes.bolts = [];
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const boltGeom = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
        boltGeom.rotateX(Math.PI/2);
        const bolt = new THREE.Mesh(boltGeom, chrome);
        bolt.position.set(Math.cos(angle)*26, baseHeight + 5 + 23, Math.sin(angle)*26);
        bolt.lookAt(0, baseHeight + 5 + 23, 0);
        boltGroup.add(bolt);
        meshes.bolts.push(bolt);
    }
    group.add(boltGroup);

    parts.push({
        name: 'Pneumatic Deadbolt Interlocks',
        description: 'Eight chrome-plated solid steel locking pins that secure the massive lid.',
        material: 'chrome',
        function: 'Prevents explosive decompression and keeps the lid on if the rotor shatters.',
        assemblyOrder: 15,
        connections: ['stator_bowl', 'casing_door'],
        failureEffect: 'Lid blows off under internal pressure anomaly.',
        cascadeFailures: ['casing_door'],
        originalPosition: {x: 0, y: 31, z: 0},
        explodedPosition: {x: 0, y: 45, z: 0}
    });

    const description = "The Astrobiology Extremophile Centrifuge is a colossal, 100,000 RPM mag-lev installation. It features cryogenic superconductors, a depleted-uranium lined containment bowl, and specialized angled titanium rotors to subject extremophile samples to 500,000 Gs, testing the limits of organic life under hyper-gravity.";

    const quizQuestions = [
        {
            question: "Why does the centrifuge utilize a Tri-Core Vacuum Pump Array?",
            options: [
                "To clean the bioluminescent fluids.",
                "To evacuate all air from the containment bowl, preventing immense aerodynamic friction on the rotor.",
                "To suck extremophiles out of the tubes.",
                "To keep the operator console cool."
            ],
            correctAnswer: 1,
            explanation: "At 100,000 RPM, the air friction on a titanium rotor would instantly superheat and vaporize the metal. A hard vacuum is mandatory."
        },
        {
            question: "What is the purpose of the liquid helium cryo-plumbing?",
            options: [
                "To freeze the biological samples.",
                "To chill the operator's drinks.",
                "To super-cool the stator coils, enabling frictionless magnetic levitation.",
                "To shrink the titanium rotor."
            ],
            correctAnswer: 2,
            explanation: "Superconductivity requires near absolute zero temperatures. Liquid helium cools the copper-niobium coils to allow massive electrical currents without resistance."
        },
        {
            question: "How does the machine arrest rotation in an emergency?",
            options: [
                "It opens the lid to let air in.",
                "It uses four massive carbon-ceramic brake calipers gripping the drive shaft.",
                "It reverses the electric motors.",
                "It simply unplugs."
            ],
            correctAnswer: 1,
            explanation: "While regenerative braking exists, true emergencies require the carbon-ceramic pneumatic calipers to aggressively halt the kinetic momentum."
        },
        {
            question: "Why is the outer containment bowl lined with depleted uranium?",
            options: [
                "To irradiate the samples.",
                "To provide extreme density and kinetic absorption in the event of catastrophic rotor fragmentation.",
                "To power the magnetic motors.",
                "Because it looks cool."
            ],
            correctAnswer: 1,
            explanation: "If a titanium rotor shatters at supersonic speeds, the shrapnel energy is immense. Only ultra-dense armor can contain it."
        },
        {
            question: "What function do the 8 massive vulcanized rubber feet serve?",
            options: [
                "They act as seismic dampers to absorb high-frequency kinetic oscillations and prevent structural tear-out.",
                "They generate electricity when compressed.",
                "They make the machine easier to slide across the floor.",
                "They hold the vacuum pumps in place."
            ],
            correctAnswer: 0,
            explanation: "Slight imbalances at extreme RPMs generate violent shaking. The rubber dampers absorb this energy, preventing the centrifuge from ripping itself from the bedrock."
        }
    ];

    let lastTime = 0;
    let lidState = 'closed'; // closed, opening, open, closing
    let lidAngle = 0;
    const maxLidAngle = Math.PI / 2.2;

    function animate(time, speed, activeMeshes) {
        const dt = (time - lastTime) * 0.001;
        lastTime = time;

        // 1. ROTATION
        if (meshes.shaft && meshes.rotor) {
            const rotSpeed = speed * 3.0; // Very fast
            meshes.shaft.rotation.y += rotSpeed;
            meshes.rotor.rotation.y += rotSpeed;
        }

        // 2. NEON RINGS PULSE
        if (meshes.rings) {
            meshes.rings.forEach((ring, idx) => {
                if(speed > 0.8) {
                    ring.material.color.setHex(0xff0000);
                    ring.material.emissive.setHex(0xff0000);
                    ring.material.emissiveIntensity = 2 + Math.sin(time*20 + idx)*1.0;
                } else if(speed > 0.3) {
                    ring.material.color.setHex(0xff8800);
                    ring.material.emissive.setHex(0xff8800);
                    ring.material.emissiveIntensity = 1.5 + Math.sin(time*10 + idx)*0.5;
                } else {
                    ring.material.color.setHex(0x0088ff);
                    ring.material.emissive.setHex(0x0088ff);
                    ring.material.emissiveIntensity = 1 + Math.sin(time*3 + idx)*0.3;
                }
            });
        }

        // 3. DEADBOLT ACTUATION
        if (meshes.bolts) {
            meshes.bolts.forEach(bolt => {
                const angle = Math.atan2(bolt.position.z, bolt.position.x);
                let targetR = 26; // locked
                if (speed < 0.05 && lidState === 'open') {
                    targetR = 29; // unlocked
                } else if (speed < 0.05 && lidState === 'closed') {
                    // intermittently unlock if stopped
                    targetR = 26; 
                }
                
                // if opening/open, must be unlocked
                if(lidState === 'opening' || lidState === 'open') targetR = 29;

                const currentR = Math.sqrt(bolt.position.x**2 + bolt.position.z**2);
                const newR = THREE.MathUtils.lerp(currentR, targetR, 0.1);
                bolt.position.x = Math.cos(angle) * newR;
                bolt.position.z = Math.sin(angle) * newR;
            });
        }

        // 4. LID & HYDRAULICS
        if (meshes.door) {
            // Auto open/close logic if idle
            if(speed === 0) {
                if(lidState === 'closed' && Math.random() < 0.002) lidState = 'opening';
                if(lidState === 'open' && Math.random() < 0.002) lidState = 'closing';
            } else {
                lidState = 'closing';
            }

            if(lidState === 'opening') {
                lidAngle = THREE.MathUtils.lerp(lidAngle, maxLidAngle, 0.03);
                if(lidAngle > maxLidAngle - 0.05) lidState = 'open';
            } else if (lidState === 'closing') {
                lidAngle = THREE.MathUtils.lerp(lidAngle, 0, 0.05);
                if(lidAngle < 0.01) lidState = 'closed';
            }

            meshes.door.rotation.x = -lidAngle;

            // Update pistons visually (fake extension)
            if(meshes.pistons) {
                meshes.pistons.forEach(piston => {
                    // as lid opens, piston moves up inside cylinder
                    piston.position.y = 6 + (lidAngle * 4);
                });
            }
        }

        // 5. EMERGENCY BRAKES
        if (meshes.brakes) {
            meshes.brakes.children.forEach(brake => {
                const pad = brake.children[0];
                if(speed > 0 && speed < 0.1) {
                    // clamping
                    pad.position.z = THREE.MathUtils.lerp(pad.position.z, -4, 0.2);
                } else {
                    // released
                    pad.position.z = THREE.MathUtils.lerp(pad.position.z, -3, 0.1);
                }
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createExtremophileCentrifuge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
