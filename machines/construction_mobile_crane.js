import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- CUSTOM HIGHLIGHT & FLUID MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff2222,
        emissiveIntensity: 2.5,
        metalness: 0.5,
        roughness: 0.5
    });

    const safetyYellow = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        metalness: 0.3,
        roughness: 0.4
    });

    const hydraulicFluid = new THREE.MeshPhysicalMaterial({
        color: 0xbbffbb,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5
    });

    // --- PROCEDURAL PART GENERATORS ---

    function createDetailedWheel(radius, width) {
        const wheelGroup = new THREE.Group();
        
        // Main tire body (Normal lies on Z axis)
        const tireGeo = new THREE.TorusGeometry(radius - width/2, width/2, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);

        // Aggressive Off-Road Tread Lugs
        const lugGeo = new THREE.BoxGeometry(width * 0.5, width * 0.3, width * 1.2); 
        const numLugs = 60;
        for (let i = 0; i < numLugs; i++) {
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (i / numLugs) * Math.PI * 2;
            lug.position.set(Math.cos(angle) * (radius - 0.05), Math.sin(angle) * (radius - 0.05), 0);
            lug.rotation.z = angle;
            // Chevron pattern
            lug.rotation.x = (i % 2 === 0) ? 0.3 : -0.3;
            wheelGroup.add(lug);
        }

        // Inner Rim
        const rimGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width * 0.8, 32);
        rimGeo.rotateX(Math.PI / 2); // Axis along Z
        const rim = new THREE.Mesh(rimGeo, chrome);
        wheelGroup.add(rim);

        // Intricate load-bearing spokes
        const spokeGeo = new THREE.BoxGeometry(radius * 0.1, radius * 1.1, width * 0.7);
        const numSpokes = 12;
        for (let i = 0; i < numSpokes; i++) {
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            const angle = (i / numSpokes) * Math.PI;
            spoke.rotation.z = angle;
            wheelGroup.add(spoke);
        }

        // Central Hub
        const hubGeo = new THREE.CylinderGeometry(radius * 0.2, radius * 0.25, width * 0.9, 32);
        hubGeo.rotateX(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeo, steel);
        wheelGroup.add(hub);

        // Hub Bolts
        const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, width * 0.95, 16);
        boltGeo.rotateX(Math.PI / 2);
        for(let i=0; i<10; i++) {
            const bolt = new THREE.Mesh(boltGeo, aluminum);
            const angle = (i/10) * Math.PI * 2;
            bolt.position.set(Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.35, 0);
            wheelGroup.add(bolt);
        }

        // Brake Disc behind rim
        const brakeGeo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, width * 0.7, 32);
        brakeGeo.rotateX(Math.PI / 2);
        const brake = new THREE.Mesh(brakeGeo, darkSteel);
        brake.position.z = -width * 0.1;
        wheelGroup.add(brake);

        // Brake Caliper
        const caliperGeo = new THREE.BoxGeometry(radius * 0.3, radius * 0.4, width * 0.75);
        const caliper = new THREE.Mesh(caliperGeo, safetyYellow); 
        caliper.position.set(0, radius * 0.45, -width * 0.1);
        wheelGroup.add(caliper);

        return wheelGroup;
    }

    function createHydraulicCylinder(length, radius, strokeLength) {
        const hydGroup = new THREE.Group();
        
        // Base heavy-duty tube
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
        tubeGeo.translate(0, length / 2, 0);
        const tube = new THREE.Mesh(tubeGeo, safetyYellow);
        hydGroup.add(tube);
        
        // Hose fittings and valves
        const fittingGeo = new THREE.BoxGeometry(radius * 3, radius * 0.8, radius * 1.5);
        const fitting = new THREE.Mesh(fittingGeo, darkSteel);
        fitting.position.set(radius, length * 0.1, 0);
        hydGroup.add(fitting);

        const fitting2 = new THREE.Mesh(fittingGeo, darkSteel);
        fitting2.position.set(radius, length * 0.9, 0);
        hydGroup.add(fitting2);

        // Pressure dial
        const dialGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, 0.1, 16);
        dialGeo.rotateZ(Math.PI / 2);
        const dial = new THREE.Mesh(dialGeo, chrome);
        dial.position.set(radius * 2, length * 0.5, 0);
        hydGroup.add(dial);
        
        // Chrome Rod (piston)
        const rodGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, strokeLength + length, 32);
        rodGeo.translate(0, (strokeLength + length) / 2, 0);
        const rod = new THREE.Mesh(rodGeo, chrome);
        
        // Heavy-duty mounting eyelet at end of rod
        const eyeletGeo = new THREE.TorusGeometry(radius, radius * 0.4, 16, 32);
        const eyelet = new THREE.Mesh(eyeletGeo, steel);
        eyelet.position.y = strokeLength + length;
        rod.add(eyelet);

        hydGroup.add(rod);
        
        return { group: hydGroup, rod: rod, baseTube: tube };
    }

    // --- 1. CHASSIS MAIN FRAME ---
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(0, 0);
    chassisShape.lineTo(20, 0);
    chassisShape.lineTo(21, 1);
    chassisShape.lineTo(21, 3);
    chassisShape.lineTo(19, 3.5);
    chassisShape.lineTo(2, 3.5);
    chassisShape.lineTo(0, 3);
    chassisShape.lineTo(0, 0);
    
    // Extrude the shape to create a solid structural frame
    const chassisExtrudeOpts = { depth: 3, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, chassisExtrudeOpts);
    chassisGeo.center(); // Center the geometry
    const chassisMain = new THREE.Mesh(chassisGeo, darkSteel);
    chassisMain.position.y = 2.5;
    group.add(chassisMain);
    meshes.chassis = chassisMain;
    
    parts.push({
        name: 'Main Carrier Chassis Frame',
        description: 'Ultra-rigid, high-tensile steel frame supporting the immense weight of the crane, counterweights, and payload over 10 axles.',
        material: 'High-Strength Dark Steel',
        function: 'Provides structural integrity and acts as the foundational mounting point for axles and superstructure.',
        assemblyOrder: 1,
        connections: ['Drive Axles', 'Outriggers', 'Superstructure Slewing Ring', 'Engine Compartment'],
        failureEffect: 'Catastrophic structural collapse under heavy load, splitting the vehicle in half.',
        cascadeFailures: ['Boom collapse', 'Outrigger detachment', 'Hydraulic line severing'],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // --- 2. ENGINE COMPARTMENT & MASSIVE V12 TURBO DIESEL ---
    const engineGroup = new THREE.Group();
    const engineBlockGeo = new THREE.BoxGeometry(3, 2, 2.5);
    const engineBlock = new THREE.Mesh(engineBlockGeo, steel);
    engineGroup.add(engineBlock);
    
    // Cylinder heads
    for(let i=0; i<6; i++) {
        const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), aluminum);
        cyl1.position.set(-1.2 + (i*0.48), 1.2, 0.6);
        cyl1.rotation.x = Math.PI/6;
        engineGroup.add(cyl1);
        
        const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16), aluminum);
        cyl2.position.set(-1.2 + (i*0.48), 1.2, -0.6);
        cyl2.rotation.x = -Math.PI/6;
        engineGroup.add(cyl2);
    }
    
    // Giant exhaust stacks
    const exhaustGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.5, 1, 1),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(-2, 5, 2.5)
    ]), 20, 0.3, 16, false);
    const exhaust = new THREE.Mesh(exhaustGeo, chrome);
    engineGroup.add(exhaust);

    // Cooling Fans
    const fanBoxGeo = new THREE.BoxGeometry(0.5, 1.8, 2.4);
    const fanBox = new THREE.Mesh(fanBoxGeo, darkSteel);
    fanBox.position.set(1.8, 0.2, 0);
    engineGroup.add(fanBox);

    engineGroup.position.set(6.5, 3.5, 0);
    group.add(engineGroup);
    meshes.engine = engineGroup;
    
    parts.push({
        name: 'Carrier V12 Turbo Diesel Engine',
        description: 'Massive powerplant capable of generating thousands of pound-feet of torque for locomotion and master hydraulic pressure.',
        material: 'Cast Iron and Billet Aluminum',
        function: 'Drives the carrier axles on the road and powers the master PTO hydraulic pumps.',
        assemblyOrder: 2,
        connections: ['Carrier Chassis', 'Allison Transmission', 'Master Hydraulic Pumps'],
        failureEffect: 'Total loss of mobility and primary carrier hydraulics.',
        cascadeFailures: ['Hydraulic failure', 'Electrical failure', 'Air brake lockup'],
        originalPosition: { x: 6.5, y: 3.5, z: 0 },
        explodedPosition: { x: 12, y: 5, z: 5 }
    });

    // --- 3. DRIVE AXLES & 4. WHEELS (10x10 Multi-Steer Setup) ---
    const axlesGroup = new THREE.Group();
    const wheels = [];
    const axleXPositions = [-8, -4.5, -1, 3.5, 7];
    
    axleXPositions.forEach((x, index) => {
        // Differential and Axle shaft
        const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.4, 16);
        shaftGeo.rotateX(Math.PI/2); // Runs along Z
        const shaft = new THREE.Mesh(shaftGeo, darkSteel);
        shaft.position.set(x, 1, 0);
        axlesGroup.add(shaft);

        const diffGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const diff = new THREE.Mesh(diffGeo, steel);
        diff.position.set(x, 1, 0);
        axlesGroup.add(diff);

        // Hydro-pneumatic Suspension struts
        const suspGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
        const suspL = new THREE.Mesh(suspGeo, safetyYellow);
        suspL.position.set(x, 1.75, 1.5);
        axlesGroup.add(suspL);
        const suspR = new THREE.Mesh(suspGeo, safetyYellow);
        suspR.position.set(x, 1.75, -1.5);
        axlesGroup.add(suspR);
        
        // Massive off-road wheels
        const wheelL = createDetailedWheel(1, 0.8);
        wheelL.position.set(x, 1, 2.2);
        axlesGroup.add(wheelL);
        wheels.push({ mesh: wheelL, side: 'left', axleIndex: index });
        
        const wheelR = createDetailedWheel(1, 0.8);
        wheelR.position.set(x, 1, -2.2);
        wheelR.rotation.y = Math.PI; // flip to face outwards
        axlesGroup.add(wheelR);
        wheels.push({ mesh: wheelR, side: 'right', axleIndex: index });
    });
    group.add(axlesGroup);
    meshes.wheels = wheels;
    
    parts.push({
        name: '10x10 Steered Axle Array & Hydro-Pneumatic Suspension',
        description: 'Five independent, heavy-duty drive axles featuring multi-wheel crab steering and active hydraulic leveling.',
        material: 'High-Tensile Steel, Rubber, Hydraulic Fluid',
        function: 'Supports the extreme chassis weight, provides locomotion, and enables incredibly tight turning radiuses on jobsites.',
        assemblyOrder: 3,
        connections: ['Carrier Chassis', 'Driveshafts', 'Steering Linkage ECU'],
        failureEffect: 'Immobilization, uneven weight distribution, and chassis twist.',
        cascadeFailures: ['Tire blowout', 'Suspension strut explosion', 'Axle snap'],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // --- 5. OUTRIGGER BOXES & 6. JACKS ---
    const outriggersGroup = new THREE.Group();
    meshes.outriggerBeams = [];
    meshes.outriggerJacks = [];
    
    const outriggerZPositions = [1.5, -1.5];
    const outriggerXPositions = [-7, 5]; // Front and rear pairs
    
    outriggerXPositions.forEach(x => {
        // Welded outrigger housing box
        const boxGeo = new THREE.BoxGeometry(1.5, 1, 3.2);
        const box = new THREE.Mesh(boxGeo, safetyYellow);
        box.position.set(x, 2, 0);
        outriggersGroup.add(box);
        
        outriggerZPositions.forEach(z => {
            // Telescoping horizontal beam
            const beamGeo = new THREE.BoxGeometry(1, 0.8, 3.5);
            const beam = new THREE.Mesh(beamGeo, darkSteel);
            const dir = Math.sign(z);
            beam.position.set(x, 2, z + (dir * 1.5));
            outriggersGroup.add(beam);
            meshes.outriggerBeams.push({ mesh: beam, dir: dir, baseX: x, baseZ: z });
            
            // Vertical hydraulic jack cylinder
            const jackGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
            const jack = new THREE.Mesh(jackGeo, chrome);
            jack.position.set(0, -1, dir * 1.4);
            beam.add(jack);
            
            // Heavy-duty ground pad
            const padGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
            const pad = new THREE.Mesh(padGeo, steel);
            pad.position.set(0, -1, 0);
            jack.add(pad);
            
            meshes.outriggerJacks.push({ jack: jack, pad: pad });
        });
    });
    group.add(outriggersGroup);
    
    parts.push({
        name: 'H-Pattern Outrigger & Stabilization System',
        description: 'Two-stage telescoping horizontal beams with vertical hydraulic jacks terminating in massive steel footpads.',
        material: 'Reinforced Steel and Hardened Chrome',
        function: 'Lifts the crane off its rubber tires, bypassing the suspension to provide a massive, perfectly leveled footprint for lifting.',
        assemblyOrder: 4,
        connections: ['Carrier Chassis', 'Outrigger Hydraulic Manifold', 'Leveling Sensors'],
        failureEffect: 'Crane becomes highly unstable; tipping fulcrum moves to the tires.',
        cascadeFailures: ['Tire explosion from point load', 'Crane tip-over during lift'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 12 }
    });

    // --- 7. CARRIER CABIN (Driver) ---
    const driverCab = new THREE.Group();
    
    const cabGeo = new THREE.BoxGeometry(3, 2.5, 3.2);
    const cab = new THREE.Mesh(cabGeo, safetyYellow);
    driverCab.add(cab);
    
    // Tinted Windshield
    const glassGeo = new THREE.BoxGeometry(3.1, 1.5, 3.0);
    const windshield = new THREE.Mesh(glassGeo, tinted);
    windshield.position.set(0.1, 0.3, 0);
    driverCab.add(windshield);
    
    // Detailed Interior
    const steeringWheelGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeo, plastic);
    steeringWheel.position.set(1, 0.2, 0.8);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.rotation.x = Math.PI / 6;
    driverCab.add(steeringWheel);
    
    const seatGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0.2, -0.5, 0.8);
    driverCab.add(seat);
    
    const dashGeo = new THREE.BoxGeometry(1, 0.5, 3.0);
    const dash = new THREE.Mesh(dashGeo, plastic);
    dash.position.set(1.2, 0, 0);
    driverCab.add(dash);

    // Glowing telemetry screens
    const screenGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const screen = new THREE.Mesh(screenGeo, neonBlue);
    screen.position.set(1.71, 0.3, 0.5);
    screen.rotation.y = Math.PI / 2;
    driverCab.add(screen);

    // Roof beacon
    const warningLightGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const warningLight = new THREE.Mesh(warningLightGeo, neonRed);
    warningLight.position.set(0.5, 1.35, -1);
    driverCab.add(warningLight);
    meshes.beacon = warningLight;

    driverCab.position.set(9.5, 3.0, 0);
    group.add(driverCab);
    
    parts.push({
        name: 'Carrier Navigation Cabin',
        description: 'Ergonomic, reinforced cockpit for driving the crane on highways and navigating jobsites.',
        material: 'Composite Paneling, Shatterproof Tinted Glass, Steel Frame',
        function: 'Houses driving controls, multi-axle steering electronics, and road navigation systems.',
        assemblyOrder: 5,
        connections: ['Carrier Chassis', 'Steering Column', 'Engine ECU'],
        failureEffect: 'Inability to drive, steer, or brake the massive carrier vehicle.',
        cascadeFailures: ['Highway collision', 'Dashboard power loss'],
        originalPosition: { x: 9.5, y: 3.0, z: 0 },
        explodedPosition: { x: 15, y: 3.0, z: 0 }
    });

    // --- 8. SUPERSTRUCTURE BASE & MASSIVE SLEWING RING ---
    const slewingRingGeo = new THREE.CylinderGeometry(2, 2, 0.6, 64);
    const slewingRing = new THREE.Mesh(slewingRingGeo, chrome);
    slewingRing.position.set(-2, 4.3, 0);
    group.add(slewingRing);
    
    // Inner gear teeth simulation
    const gearGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.65, 32);
    const gearMesh = new THREE.Mesh(gearGeo, darkSteel);
    gearMesh.position.set(-2, 4.3, 0);
    group.add(gearMesh);

    const superstructure = new THREE.Group();
    superstructure.position.set(-2, 4.6, 0);
    group.add(superstructure);
    meshes.superstructure = superstructure;

    const deckGeo = new THREE.BoxGeometry(7, 0.6, 4.2);
    const deck = new THREE.Mesh(deckGeo, safetyYellow);
    deck.position.set(1.5, 0.3, 0);
    superstructure.add(deck);

    // Add hydraulic manifold blocks on deck
    const manifoldGeo = new THREE.BoxGeometry(1, 1, 2);
    const manifold = new THREE.Mesh(manifoldGeo, steel);
    manifold.position.set(3, 1.1, -1);
    superstructure.add(manifold);

    parts.push({
        name: 'Superstructure Base & Slewing Ring Bearing',
        description: 'A massive high-precision roller bearing with internal gear teeth, allowing infinite 360-degree rotation of the upper crane.',
        material: 'Hardened Chrome Steel and Cast Iron',
        function: 'Transfers immense lifting moments and vertical loads from the boom down to the chassis outriggers.',
        assemblyOrder: 6,
        connections: ['Carrier Chassis', 'Superstructure Deck', 'Hydraulic Slew Motors'],
        failureEffect: 'Jamming of rotation or sheer mechanical failure under extreme tension.',
        cascadeFailures: ['Bearing shatter', 'Superstructure tear-off from chassis'],
        originalPosition: { x: -2, y: 4.3, z: 0 },
        explodedPosition: { x: -2, y: 8, z: 0 }
    });

    // --- 9. OPERATOR CABIN (Superstructure) ---
    const opCab = new THREE.Group();
    const opCabGeo = new THREE.BoxGeometry(2, 2.4, 1.6);
    const opCabMesh = new THREE.Mesh(opCabGeo, safetyYellow);
    opCab.add(opCabMesh);
    
    const opGlassGeo = new THREE.BoxGeometry(2.1, 1.6, 1.7);
    const opGlass = new THREE.Mesh(opGlassGeo, tinted);
    opGlass.position.set(0, 0.2, 0);
    opCab.add(opGlass);
    
    // Operator chair and precision joysticks
    const opSeatGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const opSeat = new THREE.Mesh(opSeatGeo, rubber);
    opSeat.position.set(-0.3, -0.4, 0);
    opCab.add(opSeat);

    const joyGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
    const joyL = new THREE.Mesh(joyGeo, chrome);
    joyL.position.set(0, -0.1, 0.4);
    opCab.add(joyL);
    
    const joyR = new THREE.Mesh(joyGeo, chrome);
    joyR.position.set(0, -0.1, -0.4);
    opCab.add(joyR);
    
    // Advanced LMI Screen
    const opScreen = new THREE.Mesh(screenGeo, neonRed);
    opScreen.position.set(0.8, 0.2, 0);
    opScreen.rotation.y = -Math.PI / 2;
    opCab.add(opScreen);

    // Roof beacon & antenna
    const opWarningLight = new THREE.Mesh(warningLightGeo, neonRed);
    opWarningLight.position.set(0, 1.3, 0);
    opCab.add(opWarningLight);
    meshes.opBeacon = opWarningLight;

    const antennaGeo = new THREE.CylinderGeometry(0.01, 0.01, 1);
    const antenna = new THREE.Mesh(antennaGeo, darkSteel);
    antenna.position.set(-0.5, 1.6, 0.5);
    opCab.add(antenna);

    opCab.position.set(3.5, 1.8, 2.2);
    superstructure.add(opCab);
    
    parts.push({
        name: 'Crane Operator Command Cabin',
        description: 'Tiltable, sound-damped cabin attached to the rotating superstructure with multi-axis fly-by-wire joysticks.',
        material: 'Steel, Tinted Glass, Neon Digital Displays',
        function: 'Central command for hoisting, slewing, telescoping, and monitoring the LMI (Load Moment Indicator).',
        assemblyOrder: 7,
        connections: ['Superstructure Deck', 'LMI System', 'Master Valve Banks'],
        failureEffect: 'Total loss of precise crane control, causing erratic boom movements.',
        cascadeFailures: ['Dropped load', 'LMI computer crash'],
        originalPosition: { x: 1.5, y: 6.4, z: 2.2 },
        explodedPosition: { x: 1.5, y: 6.4, z: 8 }
    });

    // --- 10. COUNTERWEIGHTS ---
    const cwGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const slabGeo = new THREE.BoxGeometry(2, 0.45, 4.2);
        const slab = new THREE.Mesh(slabGeo, darkSteel);
        slab.position.set(0, i * 0.47, 0);
        cwGroup.add(slab);
        
        // Locking pins
        const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
        const pin1 = new THREE.Mesh(pinGeo, chrome);
        pin1.position.set(0.8, i * 0.47, 1.8);
        cwGroup.add(pin1);
        const pin2 = new THREE.Mesh(pinGeo, chrome);
        pin2.position.set(0.8, i * 0.47, -1.8);
        cwGroup.add(pin2);
    }
    cwGroup.position.set(-1.0, 0.6, 0);
    superstructure.add(cwGroup);

    parts.push({
        name: 'Modular Counterweight Stack',
        description: 'Interlocking, high-density cast iron plates totalling over 120 tons, lifted and pinned into place via built-in hydraulic cylinders.',
        material: 'Solid Cast Iron',
        function: 'Offsets the extreme forward tipping moment force generated by heavy loads on the extended boom.',
        assemblyOrder: 8,
        connections: ['Superstructure Deck Rear', 'Hydraulic Locking Pins'],
        failureEffect: 'Center of gravity shifts dangerously forward, causing catastrophic tip-over.',
        cascadeFailures: ['Superstructure mounting tear-out', 'Boom snap'],
        originalPosition: { x: -3.0, y: 5.2, z: 0 },
        explodedPosition: { x: -10, y: 5.2, z: 0 }
    });

    // --- 11. BOOM BASE & 12. TELESCOPIC SECTIONS (Hyper-realistic U-Profile) ---
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0.5, 1.5, 0); // Pivot point
    superstructure.add(boomGroup);
    meshes.boomPivot = boomGroup;

    // Helper to generate U-shaped extruded boom profiles to avoid blocky shapes
    function createBoomProfile(width, height, thickness, length, mat) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(width/2, -height/2);
        // The bottom curves or has angles (approximating U-shape)
        shape.lineTo(width/3, -height/1.8);
        shape.lineTo(-width/3, -height/1.8);
        shape.lineTo(-width/2, -height/2);
        shape.lineTo(-width/2, height/2);
        
        const hole = new THREE.Path();
        hole.moveTo(-width/2 + thickness, height/2 - thickness);
        hole.lineTo(width/2 - thickness, height/2 - thickness);
        hole.lineTo(width/2 - thickness, -height/2 + thickness);
        hole.lineTo(width/3 - thickness/2, -height/1.8 + thickness);
        hole.lineTo(-width/3 + thickness/2, -height/1.8 + thickness);
        hole.lineTo(-width/2 + thickness, -height/2 + thickness);
        hole.lineTo(-width/2 + thickness, height/2 - thickness);
        shape.holes.push(hole);
        
        const ext = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
        ext.translate(0, 0, length/2); // anchor at base
        const mesh = new THREE.Mesh(ext, mat);
        mesh.rotation.y = Math.PI / 2; // Point along positive X
        return mesh;
    }

    const boomBase = createBoomProfile(1.6, 2.2, 0.15, 14, safetyYellow);
    boomGroup.add(boomBase);
    
    // External hydraulic lines on boom base
    const lineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1, 0.8),
        new THREE.Vector3(14, -1, 0.8)
    ]);
    const hydLineGeo = new THREE.TubeGeometry(lineCurve, 20, 0.05, 8, false);
    const hydLine = new THREE.Mesh(hydLineGeo, rubber);
    boomBase.add(hydLine);
    
    const sec1 = createBoomProfile(1.4, 2.0, 0.12, 13, safetyYellow);
    sec1.position.x = 2; // initial offset inside base
    boomGroup.add(sec1);
    
    const sec2 = createBoomProfile(1.2, 1.8, 0.1, 12, safetyYellow);
    sec2.position.x = 4;
    boomGroup.add(sec2);
    
    const sec3 = createBoomProfile(1.0, 1.6, 0.08, 11, darkSteel);
    sec3.position.x = 6;
    boomGroup.add(sec3);

    const sec4 = createBoomProfile(0.8, 1.4, 0.08, 10, darkSteel);
    sec4.position.x = 8;
    boomGroup.add(sec4);

    meshes.boomSections = [sec1, sec2, sec3, sec4];

    parts.push({
        name: 'Base Boom Section',
        description: 'Thickest, highly reinforced U-profile steel boom acting as the primary pivot lever. Features external hydraulic hardlines.',
        material: 'Ultra-High Yield Steel',
        function: 'Houses all inner telescopic sections and bears the highest bending moments from the lift cylinders.',
        assemblyOrder: 9,
        connections: ['Superstructure Pivot', 'Main Lift Cylinders', 'Telescopic Section 1'],
        failureEffect: 'Fracture at the pivot point, dropping the entire boom assembly.',
        cascadeFailures: ['Cylinder blowout', 'Complete destruction of crane'],
        originalPosition: { x: -1.5, y: 6.1, z: 0 },
        explodedPosition: { x: -1.5, y: 18, z: 0 }
    });

    parts.push({
        name: 'Telescopic Sections (1-4)',
        description: 'Nested U-profile extensions driven by internal hydraulic rams and pinned by automated bolting systems.',
        material: 'High-Tensile Steel, Greased Teflon Wear Pads',
        function: 'Extends the reach of the crane up to incredible heights while resisting lateral torsion and bowing.',
        assemblyOrder: 10,
        connections: ['Base Boom', 'Internal Telescoping Rams', 'Boom Head'],
        failureEffect: 'Boom collapse or jamming during retraction.',
        cascadeFailures: ['Wear pad disintegration', 'Internal hydraulic fluid leak'],
        originalPosition: { x: 1, y: 6.1, z: 0 },
        explodedPosition: { x: 15, y: 24, z: 0 }
    });

    // --- 13. BOOM HEAD & PULLEYS ---
    const boomHead = new THREE.Group();
    
    // Sculpted boom head
    const headShape = new THREE.Shape();
    headShape.moveTo(0, -0.7);
    headShape.lineTo(2, -0.7);
    headShape.lineTo(2.5, -0.2);
    headShape.lineTo(2.5, 0.5);
    headShape.lineTo(0, 0.7);
    const headExt = new THREE.ExtrudeGeometry(headShape, { depth: 1, bevelEnabled: true });
    headExt.translate(0, 0, -0.5); // Center on Z
    const headMesh = new THREE.Mesh(headExt, safetyYellow);
    headMesh.position.set(10, 0, 0); // At end of sec4
    boomHead.add(headMesh);
    
    // Multiple Sheaves (Pulleys)
    for(let i=0; i<4; i++) {
        const pulleyGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32);
        pulleyGeo.rotateX(Math.PI/2);
        const pulley = new THREE.Mesh(pulleyGeo, darkSteel);
        pulley.position.set(12, -0.2, -0.4 + (i * 0.26));
        boomHead.add(pulley);
    }
    
    sec4.add(boomHead);

    // --- 14. HOOK BLOCK & WINCH CABLE ---
    const hookGroup = new THREE.Group();
    // Heavy Block
    const blockGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const block = new THREE.Mesh(blockGeo, safetyYellow);
    hookGroup.add(block);
    
    // Internal Block Sheaves
    for(let i=0; i<3; i++) {
        const pGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        pGeo.rotateX(Math.PI/2);
        const p = new THREE.Mesh(pGeo, darkSteel);
        p.position.set(0, 0.3, -0.3 + (i*0.3));
        hookGroup.add(p);
    }

    // Forged Hook
    const hookShape = new THREE.Shape();
    hookShape.moveTo(0,0);
    hookShape.bezierCurveTo(0.6, -0.6, 0.6, -1.2, 0, -1.8);
    hookShape.bezierCurveTo(-1.0, -1.8, -1.0, -0.6, -0.4, -0.3);
    const hookGeo = new THREE.ExtrudeGeometry(hookShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05 });
    hookGeo.translate(0, -1.2, -0.075);
    const hookMesh = new THREE.Mesh(hookGeo, steel);
    hookGroup.add(hookMesh);
    
    hookGroup.position.set(12, -3, 0);
    sec4.add(hookGroup);
    meshes.hook = hookGroup;

    // Multi-part wire rope lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(12, -0.2, 0),
        new THREE.Vector3(12, -2.4, 0)
    ]);
    const cableLine = new THREE.Line(lineGeo, lineMat);
    sec4.add(cableLine);
    meshes.cableLine = cableLine;

    parts.push({
        name: 'Multi-Sheave Hook Block & Forged Hook',
        description: 'Heavyweight multi-sheave block providing mechanical advantage via complex wire rope reeving, culminating in a forged steel latching hook.',
        material: 'Forged Steel, Cast Iron Ballast',
        function: 'Connects directly to the lifting rigging, multiplying the winch pulling force while keeping the rope perfectly aligned.',
        assemblyOrder: 11,
        connections: ['Wire Rope', 'Boom Head Pulleys', 'Rigging Slings'],
        failureEffect: 'Load drops uncontrollably, endangering ground crews.',
        cascadeFailures: ['Wire rope snap', 'Boom whiplash'],
        originalPosition: { x: 10.5, y: 6.1, z: 0 },
        explodedPosition: { x: 30, y: 0, z: 0 }
    });

    // --- 15. MAIN HYDRAULIC LIFT CYLINDERS ---
    const hyd1 = createHydraulicCylinder(5.5, 0.35, 4.5);
    hyd1.group.position.set(2.5, 1, 0.7);
    hyd1.group.lookAt(new THREE.Vector3(0, 3, 0.7));
    superstructure.add(hyd1.group);
    
    const hyd2 = createHydraulicCylinder(5.5, 0.35, 4.5);
    hyd2.group.position.set(2.5, 1, -0.7);
    hyd2.group.lookAt(new THREE.Vector3(0, 3, -0.7));
    superstructure.add(hyd2.group);

    meshes.liftCylinders = [hyd1, hyd2];

    parts.push({
        name: 'Main Luffing Cylinders',
        description: 'Massive twin hydraulic rams operating at ultra-high pressures (350+ bar) equipped with safety holding valves.',
        material: 'Chrome-Plated Steel Rods, High-Strength Barrels',
        function: 'Raises and lowers the entire telescopic boom assembly, fighting immense leverage and bending moments.',
        assemblyOrder: 12,
        connections: ['Superstructure Base', 'Boom Base Pins', 'Hydraulic Manifold'],
        failureEffect: 'Boom plummets, destroying the crane and surrounding structures instantly.',
        cascadeFailures: ['Holding valve seal blowout', 'Rod bending'],
        originalPosition: { x: 0.5, y: 5.7, z: 0.7 },
        explodedPosition: { x: 0.5, y: 5.7, z: 5 }
    });

    // --- 16. PRIMARY HOIST WINCH ---
    const winchGroup = new THREE.Group();
    
    // Drum
    const winchDrumGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 32);
    winchDrumGeo.rotateX(Math.PI/2);
    const winchDrum = new THREE.Mesh(winchDrumGeo, darkSteel);
    winchGroup.add(winchDrum);
    
    // Hydraulic Motor Housing
    const motorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);
    motorGeo.rotateX(Math.PI/2);
    const motor = new THREE.Mesh(motorGeo, safetyYellow);
    motor.position.set(0, 0, 1.1);
    winchGroup.add(motor);
    
    // Brake Housing
    const brakeHousing = new THREE.Mesh(motorGeo, steel);
    brakeHousing.position.set(0, 0, -1.1);
    winchGroup.add(brakeHousing);

    winchGroup.position.set(0, 2.8, 0);
    superstructure.add(winchGroup);
    meshes.winchDrum = winchDrum;

    parts.push({
        name: 'Primary Planetary Hoist Winch',
        description: 'High-torque hydraulic planetary gear winch holding thousands of feet of non-rotating wire rope, featuring a multi-disc wet brake.',
        material: 'Steel, Hydraulic Motors, Friction Discs',
        function: 'Spools the wire rope to raise and lower the hook block with extreme precision.',
        assemblyOrder: 13,
        connections: ['Superstructure Deck', 'Wire Rope', 'Hydraulic PTO'],
        failureEffect: 'Uncontrolled unspooling of wire rope in freefall.',
        cascadeFailures: ['Wet brake fade', 'Hydraulic motor explosion'],
        originalPosition: { x: -2, y: 7.4, z: 0 },
        explodedPosition: { x: -2, y: 13, z: -4 }
    });

    // --- 17. ACCESSORIES (Ladders, Grilles, Mirrors) ---
    const ladderGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), chrome);
        rung.rotation.x = Math.PI/2;
        rung.position.set(0, i * 0.35, 0);
        ladderGroup.add(rung);
    }
    const railGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.8);
    const railL = new THREE.Mesh(railGeo, steel);
    railL.position.set(0, 1.25, 0.3);
    ladderGroup.add(railL);
    const railR = new THREE.Mesh(railGeo, steel);
    railR.position.set(0, 1.25, -0.3);
    ladderGroup.add(railR);
    
    ladderGroup.position.set(1.5, -0.5, 2.1);
    superstructure.add(ladderGroup);

    // Mirrors on driver cab
    const mirrorBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), darkSteel);
    mirrorBracket.position.set(0.5, 0.5, 1.6);
    mirrorBracket.rotation.x = Math.PI/2;
    driverCab.add(mirrorBracket);
    const mirrorBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.1), chrome);
    mirrorBox.position.set(0.5, 0.5, 1.9);
    driverCab.add(mirrorBox);

    parts.push({
        name: 'Advanced LMI & Sensor Suite (Telemetry)',
        description: 'Network of anemometers (wind speed), angle sensors, load pins, and laser rangefinders distributed across the boom.',
        material: 'Electronics, Plastics, Silicone Wiring',
        function: 'Provides real-time telemetry to the operator, automatically halting unsafe movements to prevent tipping or structural failure.',
        assemblyOrder: 14,
        connections: ['Boom Head', 'Operator Cabin ECU', 'Hydraulic Valves'],
        failureEffect: 'Operator blindness to critical lifting metrics, risking fatal overload.',
        cascadeFailures: ['Computer crash', 'Sensor drift due to vibration'],
        originalPosition: { x: 7, y: 6.8, z: 0 },
        explodedPosition: { x: 7, y: 11, z: 3 }
    });

    // --- METADATA & QUIZ ---
    const description = "Massive 10x10 Mobile Telescopic Crane. Features hyper-realistic modeled parts including multi-axle steering, hydro-pneumatic suspension, a multi-stage extending U-profile boom, complex multi-part outrigger deployment, and highly detailed twin operator cabins with neon telemetry. Built for handling ultra-heavy, high-altitude industrial loads with immense precision.";

    const quizQuestions = [
        {
            question: "What is the primary function of the multi-axle steering system on this massive 10x10 carrier chassis?",
            options: [
                "To increase top speed on highways",
                "To distribute massive weights and allow incredibly tight, crab-walk turning radiuses in confined jobsites",
                "To reduce the amount of hydraulic fluid needed",
                "To act as counterweights during lifting"
            ],
            correctAnswer: 1,
            explanation: "In a 10x10 setup, multiple steering axles (often all-wheel steer) distribute the extreme weight evenly while allowing the massive crane to maneuver laterally into tightly packed industrial environments."
        },
        {
            question: "Why must the outriggers be fully deployed and jacked before attempting a heavy lift?",
            options: [
                "To lift the rubber tires off the ground, bypassing unpredictable suspension bounce and massively increasing the tipping fulcrum footprint",
                "To allow the engine to cool down faster during operation",
                "To provide an electrical ground for the LMI sensors",
                "To make the crane look taller and more intimidating to the crew"
            ],
            correctAnswer: 0,
            explanation: "Rubber tires and suspension systems compress unpredictably. Outriggers lift the chassis off the wheels, providing a rigid, immensely wider steel footprint that pushes the tipping fulcrum far outwards."
        },
        {
            question: "What is the critical structural role of the Slewing Ring in a mobile crane?",
            options: [
                "It holds the wire rope tight during transport",
                "It connects the massive rotating superstructure to the stationary chassis, bearing both extreme compression on the front edge and immense tension (pulling apart) on the rear",
                "It filters hydraulic fluid before it reaches the lift cylinders",
                "It spins the wheels on the 5th drive axle"
            ],
            correctAnswer: 1,
            explanation: "The slewing ring is a gigantic, high-precision roller bearing. When lifting, it must withstand huge compression downwards on the load side and massive tension (pulling apart) on the counterweight side, all while rotating smoothly."
        },
        {
            question: "What does the LMI (Load Moment Indicator) system do to prevent catastrophic failure?",
            options: [
                "It automatically changes the oil in the engine",
                "It analyzes boom angle, length, and load weight in real-time, locking out hydraulic controls if the crane approaches its structural or tipping limits",
                "It plays warning sirens to clear the construction site",
                "It steers the rear axles automatically on the highway"
            ],
            correctAnswer: 1,
            explanation: "The LMI is the crane's brain. By calculating the exact moment (Force x Distance), it anticipates if a load will exceed the crane's capacity charts and actively overrides the operator to stop unsafe outward or downward movements."
        },
        {
            question: "How do the nested telescopic boom sections maintain rigidity while extending to extreme heights?",
            options: [
                "They are filled with pressurized air like a balloon to resist buckling",
                "They use a unique high-tensile U-shape or ovular profile combined with internal greased Teflon wear pads and massive mechanical locking pins",
                "They are welded together on site before the lift",
                "They rely entirely on the tension of the wire rope pulling them straight"
            ],
            correctAnswer: 1,
            explanation: "Advanced telescopic booms use highly engineered U-profiles (visible in this model) to resist bending and torsional forces, sliding out smoothly on Teflon pads, and locking into place with pins to relieve stress on internal hydraulic rams."
        }
    ];

    // --- ANIMATION CONTROLLER ---
    let drivePhase = 0;
    let boomPhase = 0;

    function animate(time, speed) {
        // Advanced highly-synchronized animation loop
        drivePhase += speed * 0.05;
        boomPhase = time * speed * 0.2; 
        
        // 1. Driving and Steering (Moves along X axis)
        const moveDist = Math.sin(drivePhase) * 10;
        group.position.x = moveDist; 
        
        // Steering logic: Front axles steer right/left, rear axles steer opposite
        const steerAngle = Math.cos(drivePhase * 1.5) * 0.4;
        
        meshes.wheels.forEach(w => {
            // Wheels spin around Z axis
            w.mesh.children[0].rotation.z -= speed * 0.1 * (moveDist > 0 ? 1 : -1); 
            
            // Steer by rotating the entire wheel group around Y
            if(w.axleIndex < 2) {
                w.mesh.rotation.y = w.side === 'left' ? steerAngle : Math.PI + steerAngle;
            } else if (w.axleIndex > 2) {
                w.mesh.rotation.y = w.side === 'left' ? -steerAngle * 0.8 : Math.PI - steerAngle * 0.8;
            }
        });

        // 2. Outriggers Deployment (Deploy when vehicle is relatively stopped)
        const stopped = Math.abs(Math.sin(drivePhase)) < 0.1;
        const outriggerExt = stopped ? THREE.MathUtils.lerp(meshes.outriggerBeams[0].mesh.position.z, 2.6 * meshes.outriggerBeams[0].dir, 0.05) : THREE.MathUtils.lerp(meshes.outriggerBeams[0].mesh.position.z, 1.5 * meshes.outriggerBeams[0].dir, 0.05);
        
        meshes.outriggerBeams.forEach(beam => {
            beam.mesh.position.z = Math.abs(outriggerExt) * beam.dir;
        });

        const jackExt = stopped ? THREE.MathUtils.lerp(meshes.outriggerJacks[0].jack.position.y, -1.9, 0.05) : THREE.MathUtils.lerp(meshes.outriggerJacks[0].jack.position.y, -1.0, 0.05);
        meshes.outriggerJacks.forEach(jackSet => {
            jackSet.jack.position.y = jackExt;
        });

        // 3. Superstructure Slewing (Rotate only when stopped and outriggers deployed)
        if (stopped) {
            meshes.superstructure.rotation.y += Math.sin(boomPhase) * 0.02 * speed;
        } else {
            meshes.superstructure.rotation.y = THREE.MathUtils.lerp(meshes.superstructure.rotation.y, 0, 0.05);
        }

        // 4. Boom Luffing (Raising/lowering)
        // Angle range: 0 to 1.2 radians
        const boomAngle = stopped ? (Math.sin(boomPhase * 0.5) + 1) * 0.6 : 0; 
        meshes.boomPivot.rotation.z = boomAngle;

        // Sync main lift cylinders to exact boom pivot angle
        meshes.liftCylinders.forEach(hyd => {
            // Target point on the boom base
            const targetLocal = new THREE.Vector3(4.5, -1, 0);
            const targetWorld = meshes.boomPivot.localToWorld(targetLocal);
            const hydWorld = hyd.group.parent.localToWorld(hyd.group.position.clone());
            
            const dist = hydWorld.distanceTo(targetWorld);
            const baseLen = 5.5; // cylinder base length
            // Extend rod dynamically
            hyd.rod.position.y = (dist - baseLen) / 2 + baseLen/2;
            
            const relativeTarget = hyd.group.parent.worldToLocal(targetWorld);
            hyd.group.lookAt(relativeTarget);
            hyd.group.rotateX(Math.PI/2); // Align Y-axis cylinder to Z-axis lookAt
        });

        // 5. Boom Telescoping
        // Extend sections only when boom is raised high enough
        const extendFactor = boomAngle > 0.6 ? (Math.sin(boomPhase) + 1) * 0.5 : 0; 
        
        meshes.boomSections[0].position.x = 2 + (extendFactor * 2.5);
        meshes.boomSections[1].position.x = 4 + (extendFactor * 5);
        meshes.boomSections[2].position.x = 6 + (extendFactor * 7.5);
        meshes.boomSections[3].position.x = 8 + (extendFactor * 10);

        // 6. Hook Block and Cable Dropping
        // Cable unspools as boom extends or manually lowers
        const dropFactor = stopped ? (Math.cos(boomPhase * 1.2) + 1) * 0.5 : 0; 
        const hookY = -2.4 - (dropFactor * 10);
        meshes.hook.position.y = hookY;
        
        // Update cable line geometry to follow hook
        const positions = meshes.cableLine.geometry.attributes.position.array;
        positions[4] = hookY; 
        meshes.cableLine.geometry.attributes.position.needsUpdate = true;

        // Spin primary hoist winch drum
        if(stopped) {
            meshes.winchDrum.rotation.z += (dropFactor > 0.5 ? 0.1 : -0.1) * speed;
        }

        // 7. Beacon Lights pulsing
        const pulse = (Math.sin(time * 15) + 1) * 0.5;
        meshes.beacon.material.emissiveIntensity = 1 + pulse * 5;
        meshes.opBeacon.material.emissiveIntensity = 1 + pulse * 5;
    }

    return { group, parts, description, quizQuestions, animate };
}
