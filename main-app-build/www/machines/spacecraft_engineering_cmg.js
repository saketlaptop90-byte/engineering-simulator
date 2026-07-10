import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom High-Tech Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff1100, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5 });
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.3, bumpScale: 0.05 });
    const matteBlack = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.9 });
    const anodizedBlue = new THREE.MeshStandardMaterial({ color: 0x1133aa, metalness: 0.9, roughness: 0.4 });
    const heatShield = new THREE.MeshStandardMaterial({ color: 0x442211, metalness: 0.3, roughness: 0.8 });

    // --- HELPER FUNCTIONS FOR EXTREME COMPLEXITY --- //

    function createBoltedFlange(radius, innerRadius, thickness, numBolts, mainMat, boltMat) {
        const flangeGroup = new THREE.Group();
        
        const shape = new THREE.Shape();
        shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
        shape.holes.push(holePath);

        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const flangeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const flange = new THREE.Mesh(flangeGeom, mainMat);
        flange.position.z = -thickness / 2;
        flangeGroup.add(flange);

        // Add Bolts
        const boltGeom = new THREE.CylinderGeometry(0.15, 0.15, thickness + 0.3, 6);
        for (let i = 0; i < numBolts; i++) {
            const angle = (i / numBolts) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeom, boltMat);
            bolt.position.set(Math.cos(angle) * (radius - 0.4), Math.sin(angle) * (radius - 0.4), 0);
            bolt.rotation.x = Math.PI / 2;
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    function createRibbedCylinder(radius, length, numRibs, ribDepth, mat) {
        const points = [];
        const ribStep = length / numRibs;
        for (let i = 0; i <= numRibs; i++) {
            const y = (i * ribStep) - (length / 2);
            points.push(new THREE.Vector2(radius, y));
            if (i < numRibs) {
                points.push(new THREE.Vector2(radius, y + ribStep * 0.2));
                points.push(new THREE.Vector2(radius - ribDepth, y + ribStep * 0.2));
                points.push(new THREE.Vector2(radius - ribDepth, y + ribStep * 0.8));
                points.push(new THREE.Vector2(radius, y + ribStep * 0.8));
            }
        }
        const geom = new THREE.LatheGeometry(points, 64);
        const mesh = new THREE.Mesh(geom, mat);
        return mesh;
    }

    function createWireBundle(curvePoints, radius, numWires, colorArr) {
        const bundleGroup = new THREE.Group();
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        
        for (let i = 0; i < numWires; i++) {
            const wireRadius = radius / Math.sqrt(numWires) * 0.8;
            const geom = new THREE.TubeGeometry(curve, 64, wireRadius, 8, false);
            const mat = colorArr[i % colorArr.length];
            const wire = new THREE.Mesh(geom, mat);
            
            // Random offset for organic clustering
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius
            );
            wire.position.copy(offset);
            bundleGroup.add(wire);
        }
        return bundleGroup;
    }

    function createGear(radius, teeth, thickness, mat) {
        const shape = new THREE.Shape();
        const outer = radius;
        const inner = radius - 0.4;
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = (i % 2 === 0) ? outer : inner;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.lineTo(Math.cos(0) * outer, Math.sin(0) * outer);

        const hole = new THREE.Path();
        hole.absarc(0, 0, radius * 0.5, 0, Math.PI * 2, true);
        shape.holes.push(hole);

        const extrudeSettings = { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.z = -thickness / 2;
        return mesh;
    }

    // --- MAIN HIERARCHY SETUP --- //

    const primaryMountGroup = new THREE.Group();
    const outerGimbalGroup = new THREE.Group();
    const innerGimbalGroup = new THREE.Group();
    const rotorHousingGroup = new THREE.Group();
    const rotorGroup = new THREE.Group();

    group.add(primaryMountGroup);
    primaryMountGroup.add(outerGimbalGroup);
    outerGimbalGroup.add(innerGimbalGroup);
    innerGimbalGroup.add(rotorHousingGroup);
    rotorHousingGroup.add(rotorGroup);

    // Provide references for animation
    meshes.outerGimbal = outerGimbalGroup;
    meshes.innerGimbal = innerGimbalGroup;
    meshes.rotor = rotorGroup;
    meshes.statusLights = [];
    meshes.pistons = [];

    // --- 1. PRIMARY BULKHEAD MOUNT --- //
    const mountShape = new THREE.Shape();
    mountShape.moveTo(-6, -6);
    mountShape.lineTo(6, -6);
    mountShape.lineTo(8, -2);
    mountShape.lineTo(8, 2);
    mountShape.lineTo(6, 6);
    mountShape.lineTo(-6, 6);
    mountShape.lineTo(-8, 2);
    mountShape.lineTo(-8, -2);
    mountShape.lineTo(-6, -6);

    const mountHole = new THREE.Path();
    mountHole.absarc(0, 0, 5, 0, Math.PI * 2, true);
    mountShape.holes.push(mountHole);

    const mountGeom = new THREE.ExtrudeGeometry(mountShape, { depth: 1, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 });
    const baseMount = new THREE.Mesh(mountGeom, darkSteel);
    baseMount.rotation.x = -Math.PI / 2;
    baseMount.position.y = -7;
    primaryMountGroup.add(baseMount);

    parts.push({
        name: "Primary Bulkhead Mount",
        description: "Massive aerospace-grade titanium mount interfacing the CMG with the spacecraft bus.",
        material: "Dark Steel / Titanium",
        function: "Structural foundation handling extreme torque loads from gyroscopic precession.",
        assemblyOrder: 1,
        connections: ["Spacecraft Hull", "Vibration Isolation Struts"],
        failureEffect: "Structural shearing and catastrophic unmooring of the CMG.",
        cascadeFailures: ["Loss of Attitude Control", "Hull Breach"],
        originalPosition: { x: 0, y: -7, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // --- 2. VIBRATION ISOLATION STRUTS --- //
    const strutGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const x = Math.cos(angle) * 7;
        const z = Math.sin(angle) * 7;
        
        const strutBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 2, 16), steel);
        strutBase.position.set(x, -6, z);
        strutGroup.add(strutBase);

        const strutPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 16), chrome);
        strutPiston.position.set(x, -4, z);
        strutGroup.add(strutPiston);

        const spring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.15, 16, 100, Math.PI * 20), copper);
        spring.position.set(x, -4, z);
        spring.rotation.x = Math.PI / 2;
        spring.scale.z = 0.2; // Compress spring visually
        strutGroup.add(spring);
    }
    primaryMountGroup.add(strutGroup);

    parts.push({
        name: "Vibration Isolation Struts",
        description: "Active magnetic-fluid dampers and heavy spring assemblies.",
        material: "Steel, Chrome, Copper",
        function: "Absorbs high-frequency micro-vibrations from the rotor to protect scientific payloads.",
        assemblyOrder: 2,
        connections: ["Primary Bulkhead Mount", "Outer Gimbal Yoke"],
        failureEffect: "High jitter transmitted to spacecraft.",
        cascadeFailures: ["Sensor Misalignment", "Optical Payload Blurring"],
        originalPosition: { x: 0, y: -4, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // --- 3. OUTER GIMBAL YOKE --- //
    const yokeShape = new THREE.Shape();
    yokeShape.absarc(0, 0, 5.5, 0, Math.PI, false);
    yokeShape.lineTo(-5.5, -3);
    yokeShape.lineTo(-4.5, -3);
    yokeShape.lineTo(-4.5, 0);
    yokeShape.absarc(0, 0, 4.5, Math.PI, 0, true);
    yokeShape.lineTo(4.5, -3);
    yokeShape.lineTo(5.5, -3);
    yokeShape.lineTo(5.5, 0);

    const yokeGeom = new THREE.ExtrudeGeometry(yokeShape, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 });
    const yokeMesh = new THREE.Mesh(yokeGeom, steel);
    yokeMesh.position.z = -0.75;
    yokeMesh.position.y = -2;
    primaryMountGroup.add(yokeMesh);

    parts.push({
        name: "Outer Gimbal Yoke",
        description: "Heavy semi-circular truss providing the Y-axis rotational pivot.",
        material: "Steel",
        function: "Supports the entire inner gimbal and rotor assembly.",
        assemblyOrder: 3,
        connections: ["Vibration Isolation Struts", "Outer Gimbal Torque Motor"],
        failureEffect: "Binding on the Y-axis pivot.",
        cascadeFailures: ["Gimbal Lock", "Torque Motor Burnout"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 10 }
    });

    // --- 4. OUTER GIMBAL TORQUE MOTOR --- //
    const outerMotorGroup = new THREE.Group();
    const outerMotorHousing = createRibbedCylinder(1.5, 3, 12, 0.2, anodizedBlue);
    outerMotorHousing.rotation.z = Math.PI / 2;
    outerMotorHousing.position.set(-6.5, 0, 0);
    outerMotorGroup.add(outerMotorHousing);

    const outerMotorFlange = createBoltedFlange(2, 0.5, 0.4, 8, darkSteel, chrome);
    outerMotorFlange.rotation.y = Math.PI / 2;
    outerMotorFlange.position.set(-5, 0, 0);
    outerMotorGroup.add(outerMotorFlange);

    primaryMountGroup.add(outerMotorGroup);
    
    parts.push({
        name: "Y-Axis Torque Motor",
        description: "High-torque, direct-drive brushless DC motor.",
        material: "Anodized Aluminum, Copper Windings",
        function: "Actuates the outer gimbal for momentum exchange steering.",
        assemblyOrder: 4,
        connections: ["Outer Gimbal Yoke", "Motor Controller Box"],
        failureEffect: "Loss of spacecraft yaw control.",
        cascadeFailures: ["Reaction Wheel Saturation", "Safe Mode Trigger"],
        originalPosition: { x: -6.5, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 0, z: 0 }
    });

    // --- 5. OUTER GIMBAL ANGLE ENCODER --- //
    const encoderGroup = new THREE.Group();
    const encoderBody = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1, 32), plastic);
    encoderBody.rotation.z = Math.PI / 2;
    encoderBody.position.set(6, 0, 0);
    encoderGroup.add(encoderBody);

    const encoderScreen = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), neonBlue);
    encoderScreen.position.set(6.6, 0, 0);
    encoderScreen.rotation.y = Math.PI / 2;
    encoderGroup.add(encoderScreen);
    meshes.statusLights.push(encoderScreen);

    primaryMountGroup.add(encoderGroup);

    parts.push({
        name: "Y-Axis Optical Encoder",
        description: "Ultra-precise absolute optical rotary encoder with redundant read heads.",
        material: "Plastic, Glass, Neon Electronics",
        function: "Measures outer gimbal angle down to microradian precision.",
        assemblyOrder: 5,
        connections: ["Outer Gimbal Yoke", "Avionics Data Bus"],
        failureEffect: "Attitude control software receives bad telemetry.",
        cascadeFailures: ["Incorrect Torquing", "Spacecraft Tumble"],
        originalPosition: { x: 6, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 }
    });

    // --- 6. INNER GIMBAL RING --- //
    // The Outer Gimbal Group will contain the Inner Gimbal Ring.
    const innerRingGeom = new THREE.TorusGeometry(4.2, 0.6, 32, 100);
    const innerRing = new THREE.Mesh(innerRingGeom, steel);
    innerRing.rotation.x = Math.PI / 2; // Lie flat initially
    outerGimbalGroup.add(innerRing);

    // Add gear teeth to the inner ring for the actuator
    const ringGear = createGear(4.9, 64, 0.4, darkSteel);
    ringGear.rotation.x = Math.PI / 2;
    outerGimbalGroup.add(ringGear);

    parts.push({
        name: "Inner Gimbal Ring",
        description: "Fully articulated X-axis mounting ring with integrated spur gear rim.",
        material: "Forged Steel",
        function: "Provides the second degree of freedom for the CMG rotor.",
        assemblyOrder: 6,
        connections: ["Outer Gimbal Yoke", "X-Axis Actuator Assembly", "Rotor Housing"],
        failureEffect: "Inability to gimbal on the X-axis.",
        cascadeFailures: ["Restricted Momentum Envelope"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // --- 7. INNER GIMBAL ACTUATOR ASSEMBLY --- //
    const xActuatorGroup = new THREE.Group();
    const xMotor = createRibbedCylinder(0.8, 2, 8, 0.1, matteBlack);
    xMotor.rotation.x = Math.PI / 2;
    xMotor.position.set(0, 0, 4.8);
    xActuatorGroup.add(xMotor);
    
    const xDriveGear = createGear(0.8, 16, 0.3, chrome);
    xDriveGear.rotation.x = Math.PI / 2;
    xDriveGear.position.set(0, 0, 4.2);
    xActuatorGroup.add(xDriveGear);
    
    outerGimbalGroup.add(xActuatorGroup);

    parts.push({
        name: "X-Axis Actuator & Drive Gear",
        description: "Secondary high-precision servo motor meshing with the inner gimbal ring gear.",
        material: "Matte Black Alloy, Chrome",
        function: "Drives the inner gimbal ring for X-axis momentum steering.",
        assemblyOrder: 7,
        connections: ["Inner Gimbal Ring", "Slip Ring Power Unit"],
        failureEffect: "Loss of pitch/roll attitude control.",
        cascadeFailures: ["Control Authority Downgrade"],
        originalPosition: { x: 0, y: 0, z: 4.8 },
        explodedPosition: { x: 0, y: -5, z: 12 }
    });

    // --- 8. SLIP RING POWER TRANSFER UNIT --- //
    const slipRingGroup = new THREE.Group();
    const slipRingCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), goldFoil);
    slipRingCore.rotation.z = Math.PI / 2;
    slipRingCore.position.set(-4.5, 0, 0);
    slipRingGroup.add(slipRingCore);

    const brushesGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const brush = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), darkSteel);
        brush.position.set(-4.5 + (i * 0.25) - 0.6, 0.4, 0);
        brushesGroup.add(brush);
    }
    slipRingGroup.add(brushesGroup);
    primaryMountGroup.add(slipRingGroup);

    parts.push({
        name: "Slip Ring Power Transfer Unit",
        description: "Gold-plated continuous rotational electrical connector assembly.",
        material: "Gold Foil, Copper, Graphite",
        function: "Transfers high-voltage power and telemetry across the continuously rotating gimbal joints without wire tangle.",
        assemblyOrder: 8,
        connections: ["Avionics Bus", "Outer Gimbal Torque Motor"],
        failureEffect: "Electrical short or open circuit.",
        cascadeFailures: ["Loss of Power to Rotor", "Telemetry Blackout"],
        originalPosition: { x: -4.5, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 5, z: 0 }
    });

    // --- 9 & 10. FLYWHEEL VACUUM HOUSING (BOTTOM & TOP) --- //
    // The Inner Gimbal holds the Rotor Housing.
    
    // Bottom Hemisphere
    const housingBottomGeom = new THREE.SphereGeometry(3.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const housingBottom = new THREE.Mesh(housingBottomGeom, steel);
    rotorHousingGroup.add(housingBottom);

    // Top Hemisphere with cutouts (simulated by adding a slightly smaller dark sphere and a cage)
    const housingTopGeom = new THREE.SphereGeometry(3.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const housingTop = new THREE.Mesh(housingTopGeom, heatShield);
    rotorHousingGroup.add(housingTop);
    
    // Equatorial Flange
    const equatorFlange = createBoltedFlange(3.8, 3.4, 0.3, 16, darkSteel, chrome);
    rotorHousingGroup.add(equatorFlange);

    parts.push({
        name: "Vacuum Housing - Lower Shell",
        description: "Lower half of the hermetically sealed enclosure.",
        material: "Steel",
        function: "Maintains a hard vacuum around the rotor to eliminate aerodynamic drag.",
        assemblyOrder: 9,
        connections: ["Inner Gimbal Ring", "Equatorial Flange"],
        failureEffect: "Micro-leaks increase drag.",
        cascadeFailures: ["Rotor Overheating", "Increased Power Consumption"],
        originalPosition: { x: 0, y: -1.75, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    parts.push({
        name: "Vacuum Housing - Upper Shell",
        description: "Upper half of the enclosure with thermal shielding.",
        material: "Heat Shielding Composite",
        function: "Protects the rotor and manages thermal radiation.",
        assemblyOrder: 10,
        connections: ["Equatorial Flange", "Magnetic Bearing Assembly"],
        failureEffect: "Thermal expansion warps the casing.",
        cascadeFailures: ["Rotor Strike", "Catastrophic Disassembly"],
        originalPosition: { x: 0, y: 1.75, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // --- 11. HIGH-MASS TITANIUM ROTOR --- //
    // This goes inside the housing. We will make it slightly protruding or visible through a window.
    const rotorWebShape = new THREE.Shape();
    rotorWebShape.moveTo(0.5, -1);
    rotorWebShape.lineTo(3.2, -0.4);
    rotorWebShape.lineTo(3.2, 0.4);
    rotorWebShape.lineTo(0.5, 1);
    rotorWebShape.lineTo(0.5, -1);

    const rotorGeom = new THREE.LatheGeometry(rotorWebShape.getPoints(), 64);
    const rotorWeb = new THREE.Mesh(rotorGeom, darkSteel);
    
    // Heavy outer rim
    const rotorRimGeom = new THREE.TorusGeometry(3.2, 0.6, 32, 100);
    const rotorRim = new THREE.Mesh(rotorRimGeom, chrome);
    rotorRim.rotation.x = Math.PI / 2;

    rotorGroup.add(rotorWeb);
    rotorGroup.add(rotorRim);

    parts.push({
        name: "High-Mass Flywheel Rotor",
        description: "Ultra-dense tungsten-titanium alloy flywheel spinning at 10,000 RPM.",
        material: "Tungsten/Titanium Alloy, Chrome",
        function: "Stores massive angular momentum for spacecraft attitude actuation.",
        assemblyOrder: 11,
        connections: ["Magnetic Bearing Assembly"],
        failureEffect: "Imbalance causing severe vibration.",
        cascadeFailures: ["Bearing Shatter", "Housing Breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -20 }
    });

    // --- 12. MAGNETIC BEARING ASSEMBLY --- //
    const bearingGroup = new THREE.Group();
    const bearingUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 0.5, 32), copper);
    bearingUpper.position.y = 1.2;
    const bearingLower = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 0.5, 32), copper);
    bearingLower.position.y = -1.2;
    bearingGroup.add(bearingUpper);
    bearingGroup.add(bearingLower);

    const glowUpper = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.05, 16, 64), neonBlue);
    glowUpper.rotation.x = Math.PI / 2;
    glowUpper.position.y = 1.2;
    const glowLower = glowUpper.clone();
    glowLower.position.y = -1.2;
    bearingGroup.add(glowUpper);
    bearingGroup.add(glowLower);

    meshes.statusLights.push(glowUpper, glowLower);
    rotorHousingGroup.add(bearingGroup);

    parts.push({
        name: "Active Magnetic Bearing Assembly",
        description: "Superconducting electromagnetic suspension system.",
        material: "Copper, Superconductors, Neon Indicators",
        function: "Levitates the rotor in a vacuum to achieve zero physical friction.",
        assemblyOrder: 12,
        connections: ["Vacuum Housing", "High-Mass Flywheel Rotor", "Motor Controller"],
        failureEffect: "Rotor drops onto backup mechanical catcher bearings.",
        cascadeFailures: ["Immediate Spin-down", "Mission Abort"],
        originalPosition: { x: 0, y: 1.2, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // --- 13. THERMAL COOLANT LOOP --- //
    // Elaborate pipes winding around the housing and gimbals.
    const pipeCurvePoints = [
        new THREE.Vector3(0, 3.5, 0),
        new THREE.Vector3(2, 3, 2),
        new THREE.Vector3(3, 1, 2.5),
        new THREE.Vector3(3.5, -1, 1),
        new THREE.Vector3(2, -3, -2),
        new THREE.Vector3(0, -3.5, 0)
    ];
    const coolantLoop = createWireBundle(pipeCurvePoints, 0.4, 3, [rubber, chrome, darkSteel]);
    rotorHousingGroup.add(coolantLoop);

    parts.push({
        name: "Active Thermal Coolant Loop",
        description: "Ammonia-based pumped fluid loop snaking around the stator and housing.",
        material: "Rubber, Chrome, Stainless Steel",
        function: "Extracts immense heat generated by the magnetic bearings and drive motors in the vacuum of space.",
        assemblyOrder: 13,
        connections: ["Vacuum Housing", "Spacecraft Radiators"],
        failureEffect: "Coolant line rupture.",
        cascadeFailures: ["Thermal Runaway", "Sensor Melting"],
        originalPosition: { x: 2, y: 0, z: 2 },
        explodedPosition: { x: 8, y: 0, z: 8 }
    });

    // --- 14. MOTOR CONTROLLER & AVIONICS BOX --- //
    const avionicsGroup = new THREE.Group();
    const avionicsBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.5), plastic);
    avionicsGroup.add(avionicsBox);
    
    // Add intricate glowing panels
    const panel1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), neonGreen);
    panel1.position.set(-0.5, 0.2, 0.76);
    avionicsGroup.add(panel1);
    const panel2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), neonRed);
    panel2.position.set(0.5, 0.2, 0.76);
    avionicsGroup.add(panel2);
    meshes.statusLights.push(panel1, panel2);

    avionicsGroup.position.set(0, -6, 4);
    primaryMountGroup.add(avionicsGroup);

    parts.push({
        name: "Integrated Avionics & Motor Controller",
        description: "Radiation-hardened command unit with complex FPGA logic.",
        material: "Plastic, Silicon, Neon Displays",
        function: "Processes steering commands from the spacecraft and controls the high-frequency 3-phase power to all motors.",
        assemblyOrder: 14,
        connections: ["Primary Bulkhead Mount", "Spacecraft Data Bus"],
        failureEffect: "Single Event Upset (SEU) corrupts control algorithms.",
        cascadeFailures: ["Erratic Torquing", "Safe Mode"],
        originalPosition: { x: 0, y: -6, z: 4 },
        explodedPosition: { x: 0, y: -12, z: 10 }
    });

    // --- 15. INSPECTION VIEWPORTS --- //
    const viewportGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const vp = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), darkSteel);
        const glassMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.1, 32), tinted);
        glassMesh.rotation.x = Math.PI / 2;
        vp.add(frame);
        vp.add(glassMesh);
        
        const angle = (i/4) * Math.PI * 2;
        vp.position.set(Math.cos(angle) * 3.4, 2, Math.sin(angle) * 3.4);
        vp.lookAt(0, 2, 0);
        viewportGroup.add(vp);
    }
    rotorHousingGroup.add(viewportGroup);

    parts.push({
        name: "Quartz Inspection Viewports",
        description: "Ultra-thick tinted quartz glass windows framed in steel.",
        material: "Tinted Quartz Glass, Dark Steel",
        function: "Allows optical laser inspection of the rotor alignment during terrestrial assembly and testing.",
        assemblyOrder: 15,
        connections: ["Vacuum Housing - Upper Shell"],
        failureEffect: "Glass fracture under extreme launch acoustics.",
        cascadeFailures: ["Loss of Vacuum", "Rotor Drag Increase"],
        originalPosition: { x: 0, y: 2, z: 3.4 },
        explodedPosition: { x: 0, y: 5, z: 12 }
    });

    // --- 16. DIAGNOSTIC SENSOR ARRAY --- //
    const sensorGroup = new THREE.Group();
    const sensorBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steel);
    sensorGroup.add(sensorBody);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 8), chrome);
    antenna.position.y = 0.75;
    sensorGroup.add(antenna);
    const blinker = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), neonRed);
    blinker.position.y = 1.3;
    sensorGroup.add(blinker);
    
    meshes.blinker = blinker;
    sensorGroup.position.set(0, 3.5, 0);
    rotorHousingGroup.add(sensorGroup);

    parts.push({
        name: "Diagnostic Sensor Array",
        description: "Multi-axis MEMS accelerometers, temperature probes, and acoustic sensors.",
        material: "Steel, Chrome, Neon Emitters",
        function: "Provides high-rate real-time health monitoring of the entire CMG assembly.",
        assemblyOrder: 16,
        connections: ["Vacuum Housing - Upper Shell", "Avionics Data Bus"],
        failureEffect: "Loss of predictive maintenance data.",
        cascadeFailures: ["Unnoticed Bearing Wear", "Catastrophic Failure Warning Loss"],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 18, z: 0 }
    });

    // --- QUIZ QUESTIONS --- //
    const quizQuestions = [
        {
            question: "What is the primary function of the Control Moment Gyroscope (CMG) on a spacecraft?",
            options: [
                "To generate electrical power.",
                "To provide attitude control via momentum exchange.",
                "To act as a backup communication antenna.",
                "To shield the spacecraft from micrometeoroids."
            ],
            correctAnswer: 1,
            explanation: "CMGs are powerful actuators that tilt a spinning rotor (gimbaling) to generate gyroscopic torque, smoothly rotating massive spacecraft like the ISS without using consumable thruster fuel."
        },
        {
            question: "Why must the high-mass flywheel rotor operate inside a hermetically sealed vacuum housing?",
            options: [
                "To protect it from solar radiation.",
                "To prevent the extreme aerodynamic drag and frictional heating that would occur if it spun in air at 10,000+ RPM.",
                "To keep the magnetic bearings magnetically charged.",
                "To prevent the titanium alloy from rusting in space."
            ],
            correctAnswer: 1,
            explanation: "Even in terrestrial testing, spinning massive rotors at ultra-high speeds in an atmosphere generates immense aerodynamic drag and heat, drastically reducing efficiency and threatening the hardware."
        },
        {
            question: "What role does the Active Magnetic Bearing Assembly play?",
            options: [
                "It magnetically couples the CMG to the spacecraft hull.",
                "It generates the magnetic field that spins the rotor.",
                "It levitates the fast-spinning rotor, achieving near-zero friction and eliminating mechanical wear.",
                "It serves as a heavy ballast for balance."
            ],
            correctAnswer: 2,
            explanation: "At 10,000+ RPM, traditional mechanical ball bearings degrade rapidly in the vacuum of space. Active magnetic bearings suspend the rotor in a magnetic field, resulting in contactless, frictionless operation."
        },
        {
            question: "What catastrophic event can occur if the CMG reaches 'Gimbal Lock'?",
            options: [
                "The gimbals align in a way that permanently welds them together.",
                "The system loses a degree of rotational freedom, resulting in a sudden inability to control attitude in one or more axes.",
                "The rotor stops spinning instantly.",
                "The vacuum housing explosively decompresses."
            ],
            correctAnswer: 1,
            explanation: "Gimbal lock occurs when the axes of two or more gimbals align, causing the system to lose a dimension of control capability, severely restricting the spacecraft's ability to maneuver."
        },
        {
            question: "What is the purpose of the Slip Ring Power Transfer Unit?",
            options: [
                "To provide physical braking to the rotor in emergencies.",
                "To act as a clutch mechanism between the motor and the gear.",
                "To allow continuous rotation of the gimbals while transferring electrical power and data without tangling wires.",
                "To measure the slip angle of the spacecraft's trajectory."
            ],
            correctAnswer: 2,
            explanation: "Because gimbals can rotate continuously 360 degrees, traditional wiring would quickly wind up and snap. Slip rings use sliding contacts (brushes) on rotating conductive rings to transfer power and data seamlessly."
        }
    ];

    // --- DESCRIPTION --- //
    const description = "The Advanced Control Moment Gyroscope (CMG) is a hyper-realistic, massively complex attitude control actuator designed for heavy spacecraft and orbital stations. Featuring a double-gimbaled high-mass titanium rotor levitated by active magnetic bearings inside a hard vacuum housing, it provides immense gyroscopic torque to steer spacecraft without expending propellant. The assembly includes over a dozen critical subsystems, including direct-drive torque motors, fluid cooling loops, redundant absolute optical encoders, and gold-plated slip rings for continuous multi-axis articulation.";

    // --- ANIMATION FUNCTION --- //
    function animate(time, speed, meshes) {
        // Rotor spins extremely fast
        meshes.rotor.rotation.y += 1.5 * speed;

        // Outer Gimbal slowly precesses on Y axis
        meshes.outerGimbal.rotation.y = Math.sin(time * 0.5 * speed) * (Math.PI / 3);

        // Inner Gimbal articulates on X axis, creating a complex combined motion
        meshes.innerGimbal.rotation.x = Math.cos(time * 0.7 * speed) * (Math.PI / 4);

        // Pulsing status lights
        const pulse = 1.5 + Math.sin(time * 5.0) * 1.0;
        meshes.statusLights.forEach(light => {
            if (light.material && light.material.emissiveIntensity !== undefined) {
                light.material.emissiveIntensity = pulse;
            }
        });

        // Fast blinker for diagnostic sensor
        if (meshes.blinker) {
            meshes.blinker.material.emissiveIntensity = (Math.floor(time * 10) % 2 === 0) ? 3.0 : 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createControlMomentGyroscope() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
