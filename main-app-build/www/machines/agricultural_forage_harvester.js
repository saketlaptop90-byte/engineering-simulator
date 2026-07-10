import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions
    function createWheel(radius, tube, lugCount, lugWidth, lugHeight, lugDepth, isFront) {
        const wheelGroup = new THREE.Group();
        
        // Main tire torus
        const tireGeom = new THREE.TorusGeometry(radius, tube, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Aggressive Off-road Lugs
        const lugGeom = new THREE.BoxGeometry(lugWidth, lugHeight, lugDepth);
        for(let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position on the surface of the torus
            lug.position.x = (radius + tube * 0.75) * Math.cos(angle);
            lug.position.y = (radius + tube * 0.75) * Math.sin(angle);
            // Offset zigzag
            lug.position.z = (i % 2 === 0) ? tube * 0.35 : -tube * 0.35;
            lug.rotation.z = angle;
            lug.rotation.y = (i % 2 === 0) ? Math.PI/6 : -Math.PI/6;
            lug.rotation.x = Math.PI/8;
            wheelGroup.add(lug);
        }

        // Rim
        const rimGeom = new THREE.CylinderGeometry(radius*0.75, radius*0.75, tube*1.8, 32);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Intricate Spokes
        const spokeCount = isFront ? 16 : 10;
        const spokeGeom = new THREE.CylinderGeometry(tube*0.15, tube*0.25, radius*1.5, 16);
        for(let i = 0; i < spokeCount; i++) {
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            const angle = (i / spokeCount) * Math.PI * 2;
            spoke.position.x = (radius * 0.35) * Math.cos(angle);
            spoke.position.y = (radius * 0.35) * Math.sin(angle);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Planetary Gear Hub
        const hubGeom = new THREE.CylinderGeometry(radius*0.25, radius*0.3, tube*2.1, 32);
        const hub = new THREE.Mesh(hubGeom, steel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        // Hub bolts
        const boltGeom = new THREE.CylinderGeometry(tube*0.05, tube*0.05, tube*2.2, 8);
        for(let i=0; i < 8; i++) {
            const bolt = new THREE.Mesh(boltGeom, chrome);
            const bAngle = (i / 8) * Math.PI * 2;
            bolt.position.x = (radius * 0.15) * Math.cos(bAngle);
            bolt.position.y = (radius * 0.15) * Math.sin(bAngle);
            bolt.rotation.x = Math.PI / 2;
            wheelGroup.add(bolt);
        }

        return wheelGroup;
    }

    function createHydraulicCylinder(length, radius) {
        const hydGroup = new THREE.Group();
        const baseGeom = new THREE.CylinderGeometry(radius, radius, length*0.6, 16);
        const base = new THREE.Mesh(baseGeom, darkSteel);
        base.position.y = length*0.3;
        hydGroup.add(base);

        const rodGeom = new THREE.CylinderGeometry(radius*0.6, radius*0.6, length*0.7, 16);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length*0.65;
        hydGroup.add(rod);

        return { group: hydGroup, rod: rod };
    }

    // 1. MAIN CHASSIS & BODY
    const chassisGroup = new THREE.Group();
    chassisGroup.position.y = 2.0;
    group.add(chassisGroup);

    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-3, -1);
    bodyShape.lineTo(3, -1);
    bodyShape.lineTo(3.5, 0.5);
    bodyShape.lineTo(2.5, 2.5);
    bodyShape.lineTo(1.5, 3.5);
    bodyShape.lineTo(-1.5, 3.5);
    bodyShape.lineTo(-3.5, 2);
    bodyShape.lineTo(-3, -1);

    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 6, steps: 4, bevelSize: 0.15, bevelThickness: 0.15 };
    const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeom.center();
    const mainBody = new THREE.Mesh(bodyGeom, plastic);
    chassisGroup.add(mainBody);

    parts.push({
        name: "Main Chassis",
        description: "Heavy-duty structural framework housing the engine, transmission, and internal chopping drum.",
        material: "High-grade Steel / Impact-resistant Plastic",
        function: "Provides structural integrity and mounts for all modular sub-systems.",
        assemblyOrder: 1,
        connections: ["Engine Block", "Front Axle", "Rear Axle", "Feeder House"],
        failureEffect: "Total structural collapse, severe vibration leading to secondary component failures.",
        cascadeFailures: ["Drive Train", "Chopping Drum Alignment"],
        originalPosition: { x: 0, y: 2.0, z: 0 },
        explodedPosition: { x: 0, y: 4.0, z: 0 }
    });

    // Side Panels & Grilles
    const grilleGeom = new THREE.BoxGeometry(2, 1.5, 3.1);
    const grille = new THREE.Mesh(grilleGeom, darkSteel);
    grille.position.set(-1.5, 0.5, 0);
    chassisGroup.add(grille);

    // Glowing Neon Highlights
    const neonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2.5 });
    const neonStripGeom = new THREE.BoxGeometry(5, 0.05, 3.2);
    const neonStrip = new THREE.Mesh(neonStripGeom, neonMaterial);
    neonStrip.position.set(0, 1.5, 0);
    chassisGroup.add(neonStrip);

    // 2. ENGINE & EXHAUST
    const engineGroup = new THREE.Group();
    engineGroup.position.set(-2, 2.5, 0);
    chassisGroup.add(engineGroup);

    const exhaustGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
    const exhaust = new THREE.Mesh(exhaustGeom, chrome);
    exhaust.position.set(-0.5, 0.75, -1.2);
    engineGroup.add(exhaust);

    const exhaustCapGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    const exhaustCap = new THREE.Mesh(exhaustCapGeom, darkSteel);
    exhaustCap.position.set(-0.5, 1.6, -1.2);
    engineGroup.add(exhaustCap);

    meshes.exhaustCap = exhaustCap;

    parts.push({
        name: "Exhaust System & Particulate Filter",
        description: "High-throughput twin-turbo exhaust with active carbon filtering and heat dispersion.",
        material: "Chrome / Dark Steel",
        function: "Expels engine combustion gases while minimizing thermal signature.",
        assemblyOrder: 5,
        connections: ["Engine Block", "Main Chassis"],
        failureEffect: "Engine overheating, massive drop in torque, potential fire hazard.",
        cascadeFailures: ["Turbocharger", "Air Intake"],
        originalPosition: { x: -2, y: 4.5, z: 0 },
        explodedPosition: { x: -4, y: 7.0, z: -2 }
    });

    // 3. OPERATOR CABIN
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(1.5, 3.5, 0);
    chassisGroup.add(cabinGroup);

    const cabShape = new THREE.Shape();
    cabShape.moveTo(-1, -1);
    cabShape.lineTo(1.2, -1);
    cabShape.lineTo(1.5, 0.5);
    cabShape.lineTo(1.0, 2.0);
    cabShape.lineTo(-0.8, 2.0);
    cabShape.lineTo(-1, -1);

    const cabExtrudeSettings = { depth: 2.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const cabGeom = new THREE.ExtrudeGeometry(cabShape, cabExtrudeSettings);
    cabGeom.center();
    const cab = new THREE.Mesh(cabGeom, tinted);
    cabinGroup.add(cab);

    // Cabin Interior
    const seatGeom = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const seat = new THREE.Mesh(seatGeom, rubber);
    seat.position.set(-0.3, -0.4, 0);
    cabinGroup.add(seat);

    const steeringColumnGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16);
    const steeringColumn = new THREE.Mesh(steeringColumnGeom, darkSteel);
    steeringColumn.position.set(0.6, -0.4, 0);
    steeringColumn.rotation.z = Math.PI / 6;
    cabinGroup.add(steeringColumn);

    const steeringWheelGeom = new THREE.TorusGeometry(0.25, 0.04, 16, 32);
    const steeringWheel = new THREE.Mesh(steeringWheelGeom, plastic);
    steeringWheel.position.set(0.8, 0, 0);
    steeringWheel.rotation.y = Math.PI / 2;
    steeringWheel.rotation.x = Math.PI / 6;
    cabinGroup.add(steeringWheel);
    meshes.steeringWheel = steeringWheel;

    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 1.5 });
    const screenGeom = new THREE.BoxGeometry(0.1, 0.5, 0.8);
    const screen = new THREE.Mesh(screenGeom, screenMaterial);
    screen.position.set(1.0, 0.2, -0.6);
    screen.rotation.y = -Math.PI / 6;
    cabinGroup.add(screen);

    const joystickGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 16);
    const joystick = new THREE.Mesh(joystickGeom, chrome);
    joystick.position.set(0.3, -0.2, 0.6);
    cabinGroup.add(joystick);

    const joystickKnobGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const joystickKnob = new THREE.Mesh(joystickKnobGeom, plastic);
    joystickKnob.position.set(0.3, -0.05, 0.6);
    cabinGroup.add(joystickKnob);
    meshes.joystick = joystick;

    // Roof lights
    const lightGeom = new THREE.BoxGeometry(0.3, 0.2, 0.2);
    const roofLightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.0 });
    for(let i=0; i<4; i++) {
        const roofLight = new THREE.Mesh(lightGeom, roofLightMaterial);
        roofLight.position.set(1.1, 1.1, -0.9 + i*0.6);
        cabinGroup.add(roofLight);
    }

    parts.push({
        name: "Panoramic Operator Cabin",
        description: "Vibration-damped, climate-controlled command center with augmented reality HUD and biometric joystick controls.",
        material: "Tinted Glass / Aluminum / Composite Plastics",
        function: "Provides complete control over harvesting operations with maximum visibility.",
        assemblyOrder: 3,
        connections: ["Main Chassis", "CAN-Bus Network", "Hydraulic Manifold"],
        failureEffect: "Operator blindness, loss of primary steering and implement control.",
        cascadeFailures: ["Header Auto-contour", "Spout Aiming"],
        originalPosition: { x: 1.5, y: 5.5, z: 0 },
        explodedPosition: { x: 3.5, y: 8.0, z: 3.0 }
    });

    // 4. WHEELS & AXLES
    const frontAxleGroup = new THREE.Group();
    frontAxleGroup.position.set(1.8, 1.2, 0);
    group.add(frontAxleGroup);

    const rearAxleGroup = new THREE.Group();
    rearAxleGroup.position.set(-2.5, 0.8, 0);
    group.add(rearAxleGroup);

    // Massive Front Wheels
    const frontWheelL = createWheel(1.4, 0.6, 36, 0.8, 0.2, 0.3, true);
    frontWheelL.position.z = 2.2;
    frontAxleGroup.add(frontWheelL);
    
    const frontWheelR = createWheel(1.4, 0.6, 36, 0.8, 0.2, 0.3, true);
    frontWheelR.position.z = -2.2;
    frontAxleGroup.add(frontWheelR);

    // Steering Rear Wheels
    const rearWheelL = createWheel(0.9, 0.4, 28, 0.6, 0.15, 0.2, false);
    rearWheelL.position.z = 1.8;
    rearAxleGroup.add(rearWheelL);

    const rearWheelR = createWheel(0.9, 0.4, 28, 0.6, 0.15, 0.2, false);
    rearWheelR.position.z = -1.8;
    rearAxleGroup.add(rearWheelR);

    meshes.frontWheelL = frontWheelL;
    meshes.frontWheelR = frontWheelR;
    meshes.rearWheelL = rearWheelL;
    meshes.rearWheelR = rearWheelR;
    meshes.rearAxleGroup = rearAxleGroup;

    parts.push({
        name: "High-Flotation Drive Wheels",
        description: "Massive planetary-drive front wheels with aggressive soil-preserving tread patterns.",
        material: "Vulcanized Rubber / Forged Steel",
        function: "Transmits 1000+ HP to the ground while minimizing soil compaction.",
        assemblyOrder: 2,
        connections: ["Front Axle", "Hydrostatic Transmission"],
        failureEffect: "Immobilization, massive traction loss, sinking into soft mud.",
        cascadeFailures: ["Transmission Overload", "Axle Shearing"],
        originalPosition: { x: 1.8, y: 1.2, z: 2.2 },
        explodedPosition: { x: 3.0, y: 1.2, z: 6.0 }
    });

    // 5. FEEDER HOUSE
    const feederGroup = new THREE.Group();
    feederGroup.position.set(3.5, 1.5, 0);
    group.add(feederGroup);

    const feederGeom = new THREE.BoxGeometry(2.5, 1.8, 2.6);
    const feeder = new THREE.Mesh(feederGeom, darkSteel);
    feeder.rotation.z = -Math.PI / 8;
    feederGroup.add(feeder);

    const feederHydraulic = createHydraulicCylinder(1.5, 0.1);
    feederHydraulic.group.position.set(2.5, 0.5, 1.0);
    feederHydraulic.group.rotation.z = -Math.PI / 4;
    group.add(feederHydraulic.group);
    meshes.feederHydraulic = feederHydraulic;

    parts.push({
        name: "Pre-Compression Feeder House",
        description: "Multi-roller steel housing that violently compresses incoming crop before it hits the chopping cylinder.",
        material: "Hardox Steel / Dark Steel",
        function: "Feeds crop uniformly to the cutterhead, integrates metal and stone detectors.",
        assemblyOrder: 4,
        connections: ["Main Chassis", "Corn Header"],
        failureEffect: "Crop blockages, foreign objects destroying the chopping drum.",
        cascadeFailures: ["Cutterhead", "Drive Belts"],
        originalPosition: { x: 3.5, y: 1.5, z: 0 },
        explodedPosition: { x: 6.0, y: 3.0, z: 0 }
    });

    // 6. MASSIVE CORN HEADER (ROTARY HARVESTER)
    const headerGroup = new THREE.Group();
    headerGroup.position.set(1.2, -0.6, 0);
    feederGroup.add(headerGroup);
    meshes.headerGroup = headerGroup;

    const headerFrameGeom = new THREE.BoxGeometry(1.5, 0.5, 8.0);
    const headerFrame = new THREE.Mesh(headerFrameGeom, plastic); // Colored frame
    headerGroup.add(headerFrame);

    // Rotary Drums (4 massive drums)
    const drums = [];
    const drumGeom = new THREE.CylinderGeometry(1.1, 1.2, 0.4, 32);
    const teethGeom = new THREE.BoxGeometry(0.1, 0.1, 0.3);

    for (let d = 0; d < 4; d++) {
        const drumGrp = new THREE.Group();
        drumGrp.position.set(0.5, 0.25, -3.0 + d * 2.0);
        
        const drumBase = new THREE.Mesh(drumGeom, darkSteel);
        drumBase.rotation.x = Math.PI / 2;
        drumGrp.add(drumBase);

        const drumCap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.1, 0.3, 32), chrome);
        drumCap.rotation.x = Math.PI / 2;
        drumCap.position.y = 0.35;
        drumGrp.add(drumCap);

        // Aggressive cutting teeth
        for (let t = 0; t < 24; t++) {
            const angle = (t / 24) * Math.PI * 2;
            const tooth = new THREE.Mesh(teethGeom, steel);
            tooth.position.set(1.15 * Math.cos(angle), 1.15 * Math.sin(angle), 0);
            tooth.rotation.z = angle;
            drumBase.add(tooth);
        }

        headerGroup.add(drumGrp);
        drums.push(drumGrp);
    }
    meshes.drums = drums;

    // Folding Side Hydraulics
    const headerHydLeft = createHydraulicCylinder(2.0, 0.08);
    headerHydLeft.group.position.set(0, 0.5, -1.5);
    headerHydLeft.group.rotation.x = Math.PI / 2;
    headerGroup.add(headerHydLeft.group);

    const headerHydRight = createHydraulicCylinder(2.0, 0.08);
    headerHydRight.group.position.set(0, 0.5, 1.5);
    headerHydRight.group.rotation.x = -Math.PI / 2;
    headerGroup.add(headerHydRight.group);

    parts.push({
        name: "Rotary Corn Header (12-Row)",
        description: "Massive folding rotary header with high-speed cutting discs and gathering drums.",
        material: "High-Tensile Steel / Hardened Chrome Teeth",
        function: "Cuts and gathers standing crop, feeding it continuously into the pre-compression rollers.",
        assemblyOrder: 6,
        connections: ["Feeder House", "PTO Drive Shaft"],
        failureEffect: "Complete halt of harvesting, immense friction and wrapping of crop around drums.",
        cascadeFailures: ["PTO Shaft", "Feeder Reverser"],
        originalPosition: { x: 4.7, y: 0.9, z: 0 },
        explodedPosition: { x: 9.0, y: 0, z: 0 }
    });

    // 7. SILAGE SPOUT (DISCHARGE TOWER)
    const spoutBaseGroup = new THREE.Group();
    spoutBaseGroup.position.set(0.5, 4.5, 0);
    chassisGroup.add(spoutBaseGroup);
    meshes.spoutBase = spoutBaseGroup;

    // Rotation Ring
    const spoutRingGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const spoutRing = new THREE.Mesh(spoutRingGeom, darkSteel);
    spoutBaseGroup.add(spoutRing);

    // Lower Spout Tube
    const spoutLowerGeom = new THREE.CylinderGeometry(0.4, 0.5, 3.0, 16);
    const spoutLower = new THREE.Mesh(spoutLowerGeom, plastic);
    spoutLower.position.set(-1.0, 1.5, 0);
    spoutLower.rotation.z = -Math.PI / 4;
    spoutBaseGroup.add(spoutLower);

    // Spout Hinge & Upper Tube
    const spoutUpperGroup = new THREE.Group();
    spoutUpperGroup.position.set(-2.0, 2.5, 0);
    spoutBaseGroup.add(spoutUpperGroup);
    meshes.spoutUpper = spoutUpperGroup;

    const spoutHingeGeom = new THREE.SphereGeometry(0.45, 16, 16);
    const spoutHinge = new THREE.Mesh(spoutHingeGeom, steel);
    spoutUpperGroup.add(spoutHinge);

    const spoutUpperGeom = new THREE.CylinderGeometry(0.3, 0.4, 4.0, 16);
    const spoutUpper = new THREE.Mesh(spoutUpperGeom, plastic);
    spoutUpper.position.set(-1.8, 0.8, 0);
    spoutUpper.rotation.z = -Math.PI / 2.5;
    spoutUpperGroup.add(spoutUpper);

    // Spout Deflector Flap
    const flapGroup = new THREE.Group();
    flapGroup.position.set(-3.7, 1.4, 0);
    spoutUpperGroup.add(flapGroup);
    meshes.flapGroup = flapGroup;

    const flapGeom = new THREE.BoxGeometry(0.8, 0.1, 0.7);
    const flap = new THREE.Mesh(flapGeom, darkSteel);
    flap.position.set(-0.4, 0, 0);
    flapGroup.add(flap);

    // Spout Hydraulics
    const spoutLiftHyd = createHydraulicCylinder(2.0, 0.08);
    spoutLiftHyd.group.position.set(-0.5, 1.0, 0);
    spoutLiftHyd.group.rotation.z = Math.PI / 3;
    spoutBaseGroup.add(spoutLiftHyd.group);

    const spoutFlapHyd = createHydraulicCylinder(0.8, 0.04);
    spoutFlapHyd.group.position.set(-2.8, 1.3, 0);
    spoutFlapHyd.group.rotation.z = Math.PI / 4;
    spoutUpperGroup.add(spoutFlapHyd.group);

    parts.push({
        name: "Articulated Discharge Spout",
        description: "Multi-segment composite spout with active camera targeting, blowing silage into parallel-driving trailers.",
        material: "Reinforced Composite / Steel Liners",
        function: "Directs the massive flow of chopped crop with pinpoint accuracy.",
        assemblyOrder: 7,
        connections: ["Crop Accelerator", "Slewing Ring"],
        failureEffect: "Silage blows directly onto the harvester or misses the trailer, causing huge crop loss.",
        cascadeFailures: ["Accelerator Chute Blockage"],
        originalPosition: { x: 0.5, y: 6.5, z: 0 },
        explodedPosition: { x: 1.0, y: 12.0, z: -4.0 }
    });

    // 8. REAR BUMPER & COOLING FANS
    const rearBumperGroup = new THREE.Group();
    rearBumperGroup.position.set(-4.5, 1.0, 0);
    chassisGroup.add(rearBumperGroup);

    const bumperGeom = new THREE.BoxGeometry(0.5, 1.0, 3.2);
    const bumper = new THREE.Mesh(bumperGeom, darkSteel);
    rearBumperGroup.add(bumper);

    const fanGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const fanBase = new THREE.Mesh(fanGeom, steel);
    fanBase.position.set(0.3, 1.5, 0);
    fanBase.rotation.z = Math.PI / 2;
    rearBumperGroup.add(fanBase);

    const fanBlades = new THREE.Group();
    fanBlades.position.set(0.3, 1.5, 0);
    fanBlades.rotation.z = Math.PI / 2;
    rearBumperGroup.add(fanBlades);
    meshes.coolingFan = fanBlades;

    const bladeGeom = new THREE.BoxGeometry(1.4, 0.05, 0.3);
    for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(bladeGeom, plastic);
        blade.rotation.y = (i / 6) * Math.PI;
        fanBlades.add(blade);
    }

    parts.push({
        name: "Active Cooling Matrix",
        description: "Massive rear-mounted rotary screen and suction fans to keep the 1000HP engine cool in dusty environments.",
        material: "Aluminum / Steel Wire Mesh",
        function: "Draws massive volumes of air while repelling chaff and dust.",
        assemblyOrder: 8,
        connections: ["Radiator Pack", "Engine Block"],
        failureEffect: "Catastrophic engine overheating within minutes.",
        cascadeFailures: ["Engine Pistons", "Hydraulic Oil Cooler"],
        originalPosition: { x: -4.5, y: 3.0, z: 0 },
        explodedPosition: { x: -8.0, y: 4.0, z: 0 }
    });


    // --- ANIMATION FUNCTION ---
    function animate(time, speed, meshesObj) {
        const t = time * speed;

        // Drive wheels
        const wheelSpeed = t * 3.0;
        meshesObj.frontWheelL.rotation.z = -wheelSpeed;
        meshesObj.frontWheelR.rotation.z = -wheelSpeed;
        meshesObj.rearWheelL.rotation.z = -wheelSpeed;
        meshesObj.rearWheelR.rotation.z = -wheelSpeed;

        // Steering simulation (sine wave oscillation)
        const steeringAngle = Math.sin(t * 0.5) * 0.4;
        meshesObj.rearAxleGroup.rotation.y = steeringAngle;
        meshesObj.steeringWheel.rotation.z = -steeringAngle * 3.0; // visual steering wheel

        // Header and drums
        // Header bobs slightly simulating terrain contouring
        meshesObj.headerGroup.rotation.z = Math.sin(t * 2.0) * 0.05;
        
        // Massive drums spin very fast inwards to pull crop
        meshesObj.drums.forEach((drum, index) => {
            // Left pair spins clockwise, right pair spins counter
            const dir = (index < 2) ? 1 : -1;
            drum.rotation.y = t * 15.0 * dir;
        });

        // Joystick wiggle
        meshesObj.joystick.rotation.x = Math.sin(t * 4.0) * 0.1;
        meshesObj.joystick.rotation.z = Math.cos(t * 3.0) * 0.1;

        // Spout sweeping motion
        meshesObj.spoutBase.rotation.y = Math.sin(t * 0.3) * 1.5; // Sweeps left to right
        meshesObj.spoutUpper.rotation.z = Math.sin(t * 0.8) * 0.2; // slight elevation changes
        meshesObj.flapGroup.rotation.z = Math.cos(t * 1.5) * 0.2; // deflector flap adjustments

        // Cooling Fan
        meshesObj.coolingFan.rotation.y = t * 20.0;

        // Exhaust cap bouncing from pressure
        meshesObj.exhaustCap.rotation.z = Math.random() * 0.3 - 0.15;
        meshesObj.exhaustCap.position.y = 1.6 + (Math.random() * 0.05);
    }

    const quizQuestions = [
        {
            question: "What is the primary function of the Pre-Compression Feeder House?",
            options: [
                "To store chopped silage",
                "To cool the engine during operation",
                "To violently compress crop and feed it uniformly to the cutterhead",
                "To sort corn from stalks"
            ],
            correctAnswer: 2,
            explanation: "The feeder house uses massive steel rollers to compress the crop mat, ensuring uniform cutting length and housing metal/stone detectors to protect the chopper."
        },
        {
            question: "Why do the rotary header drums spin inwards in pairs?",
            options: [
                "To balance the gyroscope of the machine",
                "To forcefully pull standing crop stalks into the central feeder channel",
                "To blow dust away from the cabin",
                "To sharpen the cutting discs automatically"
            ],
            correctAnswer: 1,
            explanation: "Inward-spinning drums actively gather and pull the cut crop into the center where the feeder house accepts the material."
        },
        {
            question: "What failure cascade happens if the Active Cooling Matrix fails in a dusty field?",
            options: [
                "The lights go out",
                "The silage spout jams",
                "Catastrophic engine overheating within minutes due to dust blockage",
                "The tires lose pressure"
            ],
            correctAnswer: 2,
            explanation: "Forage harvesters generate immense heat (1000+ HP). If the active rotary screen gets blocked by chaff, the radiators lose airflow and the engine overheats rapidly."
        },
        {
            question: "What component is responsible for accurately directing the chopped silage into a driving trailer?",
            options: [
                "The Planetary Hub",
                "The Feeder House",
                "The Articulated Discharge Spout",
                "The Chopping Drum"
            ],
            correctAnswer: 2,
            explanation: "The discharge spout is highly articulated and actively targeted to blow a precise stream of silage into parallel-driving trailers."
        },
        {
            question: "Why are the front drive wheels equipped with planetary gears in the hubs?",
            options: [
                "To make the wheels look shiny",
                "To multiply torque directly at the wheel, transmitting massive engine power to the ground",
                "To help the wheels float on water",
                "To decrease the weight of the machine"
            ],
            correctAnswer: 1,
            explanation: "Planetary gears multiply the torque at the outermost point of the drivetrain, allowing the massive tires to pull the heavy machine through deep mud without snapping the axles."
        }
    ];

    return { 
        group, 
        parts, 
        description: "An ultra-advanced, high-capacity Agricultural Forage Harvester. Capable of generating over 1000 horsepower to drive its massive rotary header and chopping cylinder. Designed with deep-tread planetary wheels, an articulated targeting spout, and an advanced biometric cabin, this machine can consume entire fields of corn in hours, turning it into compressed silage.", 
        quizQuestions, 
        animate: (time, speed) => animate(time, speed, meshes) 
    };
}
