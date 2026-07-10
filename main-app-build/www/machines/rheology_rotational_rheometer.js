import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for rapid and complex geometry generation
    function createExtrudedProfile(shape, depth, material) {
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    function createLathe(points, material, segments = 64) {
        const geometry = new THREE.LatheGeometry(points, segments);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    function addRivets(parent, radius, yPos, count, mat) {
        const rivetGeo = new THREE.SphereGeometry(0.04, 8, 8);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const rivet = new THREE.Mesh(rivetGeo, mat);
            rivet.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            parent.add(rivet);
        }
    }

    // Custom Emissive Materials
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0055ff, emissiveIntensity: 2, roughness: 0.2 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff1100, emissiveIntensity: 1.5, roughness: 0.2 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 1.5, roughness: 0.2 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x003366, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.8 });
    const fluidMat = new THREE.MeshPhysicalMaterial({ color: 0xff8800, transmission: 0.8, opacity: 0.9, transparent: true, roughness: 0.1, ior: 1.5, thickness: 0.5 });

    // -------------------------------------------------------------
    // 1. Heavy Vibration Damping Base
    // -------------------------------------------------------------
    const baseGroup = new THREE.Group();
    meshes.base = baseGroup;
    group.add(baseGroup);

    const baseShape = new THREE.Shape();
    baseShape.moveTo(-3, -2);
    baseShape.lineTo(3, -2);
    baseShape.lineTo(3.5, -1);
    baseShape.lineTo(3.5, 1);
    baseShape.lineTo(3, 2);
    baseShape.lineTo(-3, 2);
    baseShape.lineTo(-3.5, 1);
    baseShape.lineTo(-3.5, -1);
    baseShape.lineTo(-3, -2);

    const baseBody = createExtrudedProfile(baseShape, 1.2, darkSteel);
    baseBody.rotation.x = Math.PI / 2;
    baseBody.position.y = 0;
    baseGroup.add(baseBody);

    // Leveling feet
    for (let x of [-2.8, 2.8]) {
        for (let z of [-1.5, 1.5]) {
            const footGroup = new THREE.Group();
            
            const padGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
            const pad = new THREE.Mesh(padGeo, rubber);
            pad.position.y = 0.1;
            footGroup.add(pad);
            
            const threadGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
            const thread = new THREE.Mesh(threadGeo, steel);
            thread.position.y = 0.5;
            footGroup.add(thread);
            
            const nutGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32);
            const nut = new THREE.Mesh(nutGeo, chrome);
            nut.position.y = 0.6;
            nut.rotation.x = Math.PI / 2;
            footGroup.add(nut);

            footGroup.position.set(x, -0.2, z);
            baseGroup.add(footGroup);
        }
    }

    parts.push({
        name: "Vibration-Damping Base",
        description: "Heavycast polymer concrete base to eliminate high-frequency floor vibrations from affecting nano-torque measurements.",
        material: "Dark Steel / Polymer Concrete",
        function: "Provides absolute stability and a rigid foundation for the measurement column.",
        assemblyOrder: 1,
        connections: ["Support Column", "Leveling Feet"],
        failureEffect: "External vibrations couple into the measurement, corrupting low-shear data.",
        cascadeFailures: ["Optical Encoder Misalignment", "Air Bearing Crash"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // -------------------------------------------------------------
    // 2. Support Column & Actuator Rail
    // -------------------------------------------------------------
    const columnGroup = new THREE.Group();
    columnGroup.position.set(0, 1.2, -1);
    baseGroup.add(columnGroup);

    const columnGeo = new THREE.BoxGeometry(1.5, 6, 1.2);
    const column = new THREE.Mesh(columnGeo, aluminum);
    column.position.y = 3;
    columnGroup.add(column);

    // Ball screw & linear guide rails
    const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.8, 16);
    const railL = new THREE.Mesh(railGeo, chrome);
    railL.position.set(-0.5, 3, 0.65);
    const railR = new THREE.Mesh(railGeo, chrome);
    railR.position.set(0.5, 3, 0.65);
    columnGroup.add(railL, railR);

    const screwGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.8, 32, 100);
    // Simulate threads with a texture or just highly detailed geometry
    const screw = new THREE.Mesh(screwGeo, steel);
    screw.position.set(0, 3, 0.65);
    meshes.ballScrew = screw;
    columnGroup.add(screw);

    // Cable carrier / Energy chain (visual approximation)
    const chainGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const link = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.2), plastic);
        link.position.set(-0.8, 0.5 + i * 0.25, 0.5);
        chainGroup.add(link);
    }
    columnGroup.add(chainGroup);
    meshes.cableChain = chainGroup;

    parts.push({
        name: "Precision Column & Ball Screw",
        description: "Vertical positioning system with micrometer resolution for precise gap setting between the cone and plate.",
        material: "Aluminum / Chrome / Steel",
        function: "Moves the measurement head vertically and maintains strict perpendicularity.",
        assemblyOrder: 2,
        connections: ["Vibration-Damping Base", "Motor Head Carriage"],
        failureEffect: "Inability to set the correct measuring gap, leading to wildly inaccurate shear rate calculations.",
        cascadeFailures: ["Cone Geometry Collision", "Sample Spillage"],
        originalPosition: { x: 0, y: 1.2, z: -1 },
        explodedPosition: { x: 0, y: 4, z: -3 }
    });

    // -------------------------------------------------------------
    // 3. Motor Head Carriage (Moves vertically)
    // -------------------------------------------------------------
    const headCarriage = new THREE.Group();
    headCarriage.position.set(0, 4, 0.6); // Default Y position
    meshes.headCarriage = headCarriage;
    columnGroup.add(headCarriage);

    const carriageGeo = new THREE.BoxGeometry(1.4, 1.2, 1.0);
    const carriage = new THREE.Mesh(carriageGeo, darkSteel);
    headCarriage.add(carriage);

    // Air Bearing Motor Head
    const motorHead = new THREE.Group();
    motorHead.position.set(0, 0, 1.5);
    headCarriage.add(motorHead);

    // Elaborate Motor Housing Lathe
    const housingPoints = [];
    housingPoints.push(new THREE.Vector2(0, 2.5));
    housingPoints.push(new THREE.Vector2(0.8, 2.5));
    housingPoints.push(new THREE.Vector2(1.2, 2.0));
    housingPoints.push(new THREE.Vector2(1.2, 1.0));
    housingPoints.push(new THREE.Vector2(1.4, 0.8));
    housingPoints.push(new THREE.Vector2(1.4, -0.5));
    housingPoints.push(new THREE.Vector2(1.0, -1.0));
    housingPoints.push(new THREE.Vector2(0.8, -1.5));
    housingPoints.push(new THREE.Vector2(0, -1.5));

    const housing = createLathe(housingPoints, plastic);
    motorHead.add(housing);

    // Heatsink fins on the motor
    for (let i = 0; i < 36; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 1.5, 0.4);
        const fin = new THREE.Mesh(finGeo, aluminum);
        const angle = (i / 36) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 1.35, 0, Math.sin(angle) * 1.35);
        fin.rotation.y = -angle;
        motorHead.add(fin);
    }

    addRivets(motorHead, 1.1, 1.8, 12, chrome);
    addRivets(motorHead, 1.1, -1.2, 12, chrome);

    parts.push({
        name: "Air-Bearing Motor Head",
        description: "Frictionless synchronous EC motor supported by porous carbon air bearings, containing an ultra-high resolution optical encoder.",
        material: "Plastic / Aluminum / Internal Copper",
        function: "Applies precise torque and rotational speed while measuring angular deflection down to nanoradians.",
        assemblyOrder: 3,
        connections: ["Motor Head Carriage", "Quick-Release Chuck", "Air Supply Hoses"],
        failureEffect: "Loss of frictionless rotation, introducing massive mechanical friction artifacts into rheological data.",
        cascadeFailures: ["Motor Overheating", "Measurement Geometry Damage"],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 3, z: 5 }
    });

    // -------------------------------------------------------------
    // 4. Optical Encoder & Internal Flywheel
    // -------------------------------------------------------------
    // We expose a cutaway or just build it internally and let some glowing parts show
    const encoderGroup = new THREE.Group();
    encoderGroup.position.set(0, 1.5, 0);
    motorHead.add(encoderGroup);
    meshes.encoderGroup = encoderGroup;

    const discGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.05, 64);
    const disc = new THREE.Mesh(discGeo, glass);
    encoderGroup.add(disc);

    // Etched lines on disc (visualized as radiating thin boxes)
    for (let i = 0; i < 60; i++) {
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.02), darkSteel);
        const angle = (i / 60) * Math.PI * 2;
        tick.position.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
        tick.rotation.y = -angle;
        encoderGroup.add(tick);
    }

    // Laser reader head
    const laserReader = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.4), darkSteel);
    laserReader.position.set(0, 0, 0.95);
    motorHead.add(laserReader);

    const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2), neonRed);
    laserBeam.position.set(0, -0.1, 0.85);
    motorHead.add(laserBeam);
    meshes.laserBeam = laserBeam; // For blinking

    parts.push({
        name: "Optical Encoder & Air Bearing",
        description: "Nanoscale optical grating disc read by a laser interferometer to determine exact angular position.",
        material: "Glass / Laser Emitter",
        function: "Provides position feedback to calculate shear strain and shear rate with immense precision.",
        assemblyOrder: 4,
        connections: ["Air-Bearing Motor Head", "Rotor Shaft"],
        failureEffect: "Controller loses position feedback, resulting in runaway motor spin or complete halting.",
        cascadeFailures: ["Motor Drive Burnout"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 1.5 }
    });

    // -------------------------------------------------------------
    // 5. Rotor Shaft & Quick-Release Chuck
    // -------------------------------------------------------------
    const shaftGroup = new THREE.Group();
    shaftGroup.position.set(0, -1.5, 0);
    motorHead.add(shaftGroup);
    meshes.shaftGroup = shaftGroup;

    const shaftMain = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.0, 32), chrome);
    shaftMain.position.y = -0.5;
    shaftGroup.add(shaftMain);

    const chuckPoints = [];
    chuckPoints.push(new THREE.Vector2(0, 0));
    chuckPoints.push(new THREE.Vector2(0.4, 0));
    chuckPoints.push(new THREE.Vector2(0.4, -0.4));
    chuckPoints.push(new THREE.Vector2(0.25, -0.6));
    chuckPoints.push(new THREE.Vector2(0.25, -1.0));
    chuckPoints.push(new THREE.Vector2(0, -1.0));
    const chuck = createLathe(chuckPoints, darkSteel);
    chuck.position.y = -1.0;
    shaftGroup.add(chuck);

    // Quick release mechanism details (springs/collars)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 16, 32), aluminum);
    collar.position.y = -1.4;
    collar.rotation.x = Math.PI / 2;
    shaftGroup.add(collar);

    parts.push({
        name: "Quick-Release Chuck & Shaft",
        description: "Low-inertia coupling mechanism ensuring perfectly concentric mounting of measurement geometries.",
        material: "Titanium / Dark Steel / Chrome",
        function: "Transmits motor torque directly to the measuring system with zero backlash.",
        assemblyOrder: 5,
        connections: ["Air-Bearing Motor Head", "Cone Measuring Geometry"],
        failureEffect: "Eccentric rotation causing wobbling, leading to secondary flows in the sample and ruined data.",
        cascadeFailures: ["Cone Damage", "Lower Plate Gouging"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    // -------------------------------------------------------------
    // 6. Cone Measuring Geometry
    // -------------------------------------------------------------
    const geometryGroup = new THREE.Group();
    geometryGroup.position.set(0, -2.0, 0);
    shaftGroup.add(geometryGroup);

    const conePoints = [];
    conePoints.push(new THREE.Vector2(0, 0));
    conePoints.push(new THREE.Vector2(0.1, 0));
    conePoints.push(new THREE.Vector2(0.1, -0.5));
    conePoints.push(new THREE.Vector2(0.8, -0.5)); // Base of cone
    conePoints.push(new THREE.Vector2(0, -0.6)); // Truncated tip, slight angle
    
    const coneMesh = createLathe(conePoints, chrome);
    geometryGroup.add(coneMesh);

    parts.push({
        name: "Cone Measuring Geometry (CP50-1)",
        description: "50mm diameter cone with a 1-degree angle and a 50-micron truncation gap.",
        material: "Hard-Anodized Chrome / Steel",
        function: "Shears the fluid sample against the lower plate. The cone geometry ensures a uniform shear rate across the entire sample radius.",
        assemblyOrder: 6,
        connections: ["Quick-Release Chuck", "Fluid Sample"],
        failureEffect: "Geometry wear changes the angle, invalidating the geometric constants used for viscosity calculation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2.0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // -------------------------------------------------------------
    // 7. Fluid Sample
    // -------------------------------------------------------------
    // Represented as a disc that we can slightly scale/distort in animation
    const sampleGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const fluidSample = new THREE.Mesh(sampleGeo, fluidMat);
    // Base global position of sample: slightly above lower plate
    // We attach it to the base, not the moving head.
    fluidSample.position.set(0, 1.25, 0.5); 
    baseGroup.add(fluidSample);
    meshes.fluidSample = fluidSample;

    parts.push({
        name: "Fluid Sample (Non-Newtonian Polymer)",
        description: "The material being tested. Exhibits complex viscoelastic behavior (shear thinning, yield stress, normal force differences).",
        material: "Viscoelastic Fluid (Simulated)",
        function: "Resists the rotation of the cone, allowing the machine to measure torque and determine rheological properties.",
        assemblyOrder: 7,
        connections: ["Cone Measuring Geometry", "Lower Peltier Plate"],
        failureEffect: "Sample evaporation, edge fracture, or shear banding invalidating the continuum mechanics assumptions.",
        cascadeFailures: ["Wall Slip", "Spillage into Peltier System"],
        originalPosition: { x: 0, y: 1.25, z: 0.5 },
        explodedPosition: { x: 0, y: 1.25, z: 4 }
    });

    // -------------------------------------------------------------
    // 8. Lower Peltier Plate & Thermal System
    // -------------------------------------------------------------
    const lowerPlateGroup = new THREE.Group();
    lowerPlateGroup.position.set(0, 1.15, 0.5);
    baseGroup.add(lowerPlateGroup);

    const plateGeo = new THREE.CylinderGeometry(1.0, 1.2, 0.2, 32);
    const lowerPlate = new THREE.Mesh(plateGeo, darkSteel);
    lowerPlateGroup.add(lowerPlate);

    const peltierBaseGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.4, 32);
    const peltierBase = new THREE.Mesh(peltierBaseGeo, aluminum);
    peltierBase.position.y = -0.3;
    lowerPlateGroup.add(peltierBase);

    // Heat exchanger fins on the side of the Peltier
    for (let i = 0; i < 40; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 0.3, 0.2);
        const fin = new THREE.Mesh(finGeo, copper);
        const angle = (i / 40) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 1.5, -0.3, Math.sin(angle) * 1.5);
        fin.rotation.y = -angle;
        lowerPlateGroup.add(fin);
    }

    parts.push({
        name: "Peltier Lower Plate",
        description: "Active thermoelectric heating/cooling plate providing rapid temperature control from -40°C to 200°C.",
        material: "Dark Steel / Aluminum / Copper",
        function: "Maintains exact isothermal conditions or performs precise temperature ramps to study thermal transitions.",
        assemblyOrder: 8,
        connections: ["Vibration-Damping Base", "Fluid Sample", "Coolant System"],
        failureEffect: "Temperature gradients across the sample cause massive viscosity variations and thermal expansion artifacts.",
        cascadeFailures: ["Sample Degradation"],
        originalPosition: { x: 0, y: 1.15, z: 0.5 },
        explodedPosition: { x: 0, y: 0.5, z: 3 }
    });

    // -------------------------------------------------------------
    // 9. Environmental / Thermal Hood (Clamshell Design)
    // -------------------------------------------------------------
    const hoodGroupLeft = new THREE.Group();
    const hoodGroupRight = new THREE.Group();
    
    // Positioned relative to the lower plate
    hoodGroupLeft.position.set(0, 1.8, 0.5);
    hoodGroupRight.position.set(0, 1.8, 0.5);
    baseGroup.add(hoodGroupLeft);
    baseGroup.add(hoodGroupRight);
    meshes.hoodLeft = hoodGroupLeft;
    meshes.hoodRight = hoodGroupRight;

    // We build half a cylinder for each
    const hoodShape = new THREE.Shape();
    hoodShape.absarc(0, 0, 1.4, 0, Math.PI, false);
    
    const extrudeSettingsHood = { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const hoodGeoLeft = new THREE.ExtrudeGeometry(hoodShape, extrudeSettingsHood);
    const hoodMeshLeft = new THREE.Mesh(hoodGeoLeft, plastic);
    // Rotate to orient as a standing half-cylinder
    hoodMeshLeft.rotation.x = Math.PI / 2;
    hoodMeshLeft.rotation.z = Math.PI / 2;
    hoodMeshLeft.position.set(0, 0.75, 0); // Adjust height

    const hoodGeoRight = new THREE.ExtrudeGeometry(hoodShape, extrudeSettingsHood);
    const hoodMeshRight = new THREE.Mesh(hoodGeoRight, plastic);
    hoodMeshRight.rotation.x = Math.PI / 2;
    hoodMeshRight.rotation.z = -Math.PI / 2;
    hoodMeshRight.position.set(0, 0.75, 0);

    // Glass windows in hoods
    const windowGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.8, 16, 1, false, Math.PI * 0.2, Math.PI * 0.6);
    const windowL = new THREE.Mesh(windowGeo, tinted);
    windowL.position.y = -0.75;
    hoodMeshLeft.add(windowL);

    const windowR = new THREE.Mesh(windowGeo, tinted);
    windowR.position.y = -0.75;
    hoodMeshRight.add(windowR);

    hoodGroupLeft.add(hoodMeshLeft);
    hoodGroupRight.add(hoodMeshRight);

    // Add glowing heating elements inside
    const heaterGeo = new THREE.TorusGeometry(1.2, 0.05, 16, 32, Math.PI);
    const heaterL = new THREE.Mesh(heaterGeo, neonRed);
    heaterL.rotation.x = Math.PI / 2;
    heaterL.rotation.z = Math.PI / 2;
    heaterL.position.y = -0.75;
    hoodMeshLeft.add(heaterL);

    const heaterR = new THREE.Mesh(heaterGeo, neonRed);
    heaterR.rotation.x = Math.PI / 2;
    heaterR.rotation.z = -Math.PI / 2;
    heaterR.position.y = -0.75;
    hoodMeshRight.add(heaterR);
    meshes.heaterL = heaterL;
    meshes.heaterR = heaterR;

    parts.push({
        name: "Active Thermal Hood (Left Hemisphere)",
        description: "Upper environmental chamber utilizing forced convection and radiant heating to prevent temperature gradients.",
        material: "High-Temperature Plastic / Tinted Glass",
        function: "Eliminates sample edge cooling and maintains an inert gas atmosphere to prevent oxidative degradation.",
        assemblyOrder: 9,
        connections: ["Lower Peltier Plate", "Gas Inlet Hoses"],
        failureEffect: "Thermal drift across the sample radius causing highly erroneous viscosity readings.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.8, z: 0.5 },
        explodedPosition: { x: -3, y: 1.8, z: 0.5 }
    });

    parts.push({
        name: "Active Thermal Hood (Right Hemisphere)",
        description: "Counterpart of the environmental chamber, equipped with gas purge inlets.",
        material: "High-Temperature Plastic / Tinted Glass",
        function: "Closes automatically to seal the measurement zone.",
        assemblyOrder: 10,
        connections: ["Lower Peltier Plate"],
        failureEffect: "Loss of atmospheric seal.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1.8, z: 0.5 },
        explodedPosition: { x: 3, y: 1.8, z: 0.5 }
    });

    // -------------------------------------------------------------
    // 10. Cooling Hoses and Data Cables
    // -------------------------------------------------------------
    // We use CatmullRomCurve3 for realistic tube routing
    const hoseGroup = new THREE.Group();
    baseGroup.add(hoseGroup);

    function createCable(start, mid1, mid2, end, radius, material) {
        const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, radius, 8, false);
        return new THREE.Mesh(tubeGeo, material);
    }

    // Coolant IN/OUT to lower plate
    const coolantIn = createCable(
        new THREE.Vector3(2.5, 0.5, -1),
        new THREE.Vector3(2.0, 0.5, 0),
        new THREE.Vector3(1.5, 0.8, 0.5),
        new THREE.Vector3(1.0, 0.85, 0.5),
        0.06, rubber
    );
    const coolantOut = createCable(
        new THREE.Vector3(2.5, 0.5, -0.8),
        new THREE.Vector3(2.2, 0.4, 0.2),
        new THREE.Vector3(1.5, 0.7, 0.7),
        new THREE.Vector3(1.0, 0.85, 0.7),
        0.06, rubber
    );
    hoseGroup.add(coolantIn, coolantOut);

    // Air supply line up to the motor head (dynamic visually, but static geometry here, we attach it to the column)
    const airLine = createCable(
        new THREE.Vector3(-2.5, 0.5, -1),
        new THREE.Vector3(-2.0, 1.0, -1),
        new THREE.Vector3(-1.0, 4.0, -0.5),
        new THREE.Vector3(-0.5, 4.5, 0.5),
        0.08, plastic
    );
    hoseGroup.add(airLine);

    parts.push({
        name: "Coolant & Air Supply Lines",
        description: "High-pressure, flexible pneumatic lines for the air bearing, and fluid loops for the Peltier chiller.",
        material: "Reinforced Polyurethane / Rubber",
        function: "Provides the frictionless air cushion for the motor and dissipates heat from the thermoelectric coolers.",
        assemblyOrder: 11,
        connections: ["Air-Bearing Motor Head", "Lower Peltier Plate", "External Chiller/Compressor"],
        failureEffect: "Loss of air pressure causes instantaneous, catastrophic damage to the air bearings.",
        cascadeFailures: ["Motor Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 0, z: -2 }
    });

    // -------------------------------------------------------------
    // 11. Control Panel and Display
    // -------------------------------------------------------------
    const panelGroup = new THREE.Group();
    panelGroup.position.set(2.5, 2.5, 1.5);
    panelGroup.rotation.y = -Math.PI / 4;
    panelGroup.rotation.x = -Math.PI / 6;
    baseGroup.add(panelGroup);

    const panelHousing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.2), aluminum);
    panelGroup.add(panelHousing);

    const screenGeo = new THREE.PlaneGeometry(1.4, 1.8);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.1, 0.11);
    panelGroup.add(screen);
    meshes.touchScreen = screen;

    // Glowing graph/data points on screen
    const graphGroup = new THREE.Group();
    screen.add(graphGroup);
    meshes.graphLines = [];
    
    for (let i = 0; i < 15; i++) {
        const barGeo = new THREE.PlaneGeometry(0.05, 0.2 + Math.random());
        const bar = new THREE.Mesh(barGeo, neonGreen);
        bar.position.set(-0.6 + i * 0.08, -0.8 + barGeo.parameters.height/2, 0.01);
        graphGroup.add(bar);
        meshes.graphLines.push(bar);
    }

    // Hardware buttons below screen
    for (let i = 0; i < 3; i++) {
        const btnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
        const btn = new THREE.Mesh(btnGeo, chrome);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(-0.4 + i * 0.4, -0.9, 0.11);
        panelGroup.add(btn);
    }

    parts.push({
        name: "Interactive Touch Control Panel",
        description: "High-contrast capacitive touchscreen running realtime real-time DAQ firmware.",
        material: "Aluminum / Glass / OLED Display",
        function: "Local control for gap setting, normal force zeroing, and monitoring real-time Lissajous figures during oscillatory tests.",
        assemblyOrder: 12,
        connections: ["Support Column", "Main Controller Board"],
        failureEffect: "Inability to perform localized manual overrides or emergency stops.",
        cascadeFailures: [],
        originalPosition: { x: 2.5, y: 2.5, z: 1.5 },
        explodedPosition: { x: 5, y: 3, z: 3 }
    });

    // -------------------------------------------------------------
    // 12. Main Controller Board / Electronics Box (Back of Column)
    // -------------------------------------------------------------
    const electronicsBoxGeo = new THREE.BoxGeometry(2.0, 3.0, 0.8);
    const electronicsBox = new THREE.Mesh(electronicsBoxGeo, darkSteel);
    electronicsBox.position.set(0, 2.5, -0.6);
    columnGroup.add(electronicsBox);

    // Vents and fans on the back
    for (let i = 0; i < 3; i++) {
        const fanGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const fan = new THREE.Mesh(fanGeo, plastic);
        fan.rotation.x = Math.PI / 2;
        fan.position.set(0, 1.8 + i * 0.8, -0.4);
        electronicsBox.add(fan);
        
        const grilleGeo = new THREE.TorusGeometry(0.25, 0.02, 8, 16);
        const grille = new THREE.Mesh(grilleGeo, chrome);
        grille.position.set(0, 1.8 + i * 0.8, -0.42);
        electronicsBox.add(grille);
    }

    // Status LEDs on the side
    const ledGroup = new THREE.Group();
    ledGroup.position.set(1.0, 3.5, 0);
    electronicsBox.add(ledGroup);
    
    const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), neonBlue);
    led1.position.set(0, 0, 0);
    ledGroup.add(led1);
    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), neonGreen);
    led2.position.set(0, -0.2, 0);
    ledGroup.add(led2);
    const led3 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), neonRed);
    led3.position.set(0, -0.4, 0);
    ledGroup.add(led3);
    meshes.leds = [led1, led2, led3];

    parts.push({
        name: "DSP Real-Time Electronics Unit",
        description: "Embedded Digital Signal Processor handling 10kHz feedback loops for the EC motor and optical encoder.",
        material: "Dark Steel / PCB / Silicon",
        function: "Executes ultra-fast micro-strain control and dynamically adjusts torque to perfectly track sine-wave oscillations.",
        assemblyOrder: 13,
        connections: ["Support Column", "Optical Encoder", "Touch Control Panel"],
        failureEffect: "Control loop instability resulting in massive torque spikes that can shatter the sample and damage the bearings.",
        cascadeFailures: ["Motor Destruction", "Measurement Geometry Damage"],
        originalPosition: { x: 0, y: 2.5, z: -0.6 },
        explodedPosition: { x: 0, y: 2.5, z: -4 }
    });

    // -------------------------------------------------------------
    // Machine Description & Quizzes
    // -------------------------------------------------------------
    const description = "The Advanced Rotational Rheometer is the pinnacle of rheological characterization. Utilizing an ultra-low inertia air-bearing synchronous motor coupled with a nanoscale optical encoder, it measures the deformation and flow (kinematics) of complex fluids. Capable of continuous rotation for flow curves and micro-radian oscillatory strain for probing viscoelastic structures (G' and G''), it provides deep insights into polymers, hydrogels, suspensions, and emulsions under precisely controlled thermal environments.";

    const quizQuestions = [
        {
            question: "Why does the Rotational Rheometer use an air bearing instead of traditional mechanical ball bearings for its main motor shaft?",
            options: [
                "Air bearings are cheaper to manufacture.",
                "To provide virtually frictionless rotation, essential for measuring extremely low torque and delicate fluid structures.",
                "To actively blow air into the fluid sample for aeration.",
                "To increase the audible noise so the operator knows it is running."
            ],
            correctAnswer: 1,
            explanation: "Mechanical bearings have innate static and dynamic friction that would mask the subtle viscoelastic responses of delicate fluids. Air bearings float the shaft on a high-pressure cushion of air, achieving near-zero friction."
        },
        {
            question: "In the Cone and Plate measuring geometry, why is the upper geometry shaped like a very shallow cone rather than flat?",
            options: [
                "To create a perfectly uniform shear rate across the entire radius of the sample.",
                "To allow bubbles to escape from the center.",
                "To increase the visual appeal of the instrument.",
                "To reduce the amount of sample required."
            ],
            correctAnswer: 0,
            explanation: "In a flat parallel plate setup, the shear rate varies from zero at the center to maximum at the edge. A cone geometry compensates for this by increasing the gap distance linearly with the radius, ensuring every part of the fluid experiences the exact same shear rate."
        },
        {
            question: "What is the primary function of the high-speed Digital Signal Processor (DSP) electronics?",
            options: [
                "To compress data files for storage.",
                "To run the graphical user interface on the touchscreen.",
                "To manage the 10,000+ Hz control loop that continuously adjusts torque to track perfect oscillatory sine waves.",
                "To connect the machine to Wi-Fi."
            ],
            correctAnswer: 2,
            explanation: "Advanced rheometry requires dynamic oscillatory testing (measuring G' and G''). To do this, the machine must apply rapid, microscopic sinusoidal strains. The DSP handles this ultra-fast microsecond feedback loop between the optical encoder and motor torque."
        },
        {
            question: "Why is the environmental 'thermal hood' (clamshell) necessary for high-end measurements?",
            options: [
                "To prevent the operator from accidentally touching the rotating cone.",
                "To completely enclose the sample, preventing temperature gradients from the edges and stopping sample evaporation/drying.",
                "To pressurize the sample to 100 atmospheres.",
                "To block ambient light from interfering with the optical encoder."
            ],
            correctAnswer: 1,
            explanation: "Viscosity is exponentially dependent on temperature. Even a 0.1°C gradient from the edge of the plate to the center can ruin a measurement. The hood provides an isothermal environment and stops solvent evaporation."
        },
        {
            question: "If the air supply to the rheometer suddenly drops during an experiment, what is the immediate cascade failure?",
            options: [
                "The touchscreen goes blank.",
                "The sample immediately freezes.",
                "The air cushion collapses, causing the rapidly spinning metal shaft to grind directly against the stator, destroying the motor.",
                "The Peltier plate overheats."
            ],
            correctAnswer: 2,
            explanation: "The entire motor relies on a continuous high-pressure air cushion. If it fails, the extremely tight tolerances of the bearing surfaces will instantly clash, leading to catastrophic metal-on-metal friction and motor destruction."
        }
    ];

    // -------------------------------------------------------------
    // Animation Logic
    // -------------------------------------------------------------
    let state = 0; // 0: Lowering head, 1: Closing hood, 2: Spinning/Measuring, 3: Oscillatory, 4: Opening
    let stateTime = 0;
    
    function animate(time, speed, meshes) {
        // time is continuous, speed is a multiplier (0-1 usually, or higher)
        const dt = 0.016 * speed; // roughly 60fps delta
        stateTime += dt;

        // LEDs blink based on state
        meshes.leds[0].material.emissiveIntensity = 1 + Math.sin(time * 5); // Blue pulsing
        meshes.leds[1].material.emissiveIntensity = (state === 2 || state === 3) ? (2 + Math.sin(time * 20)) : 0.2; // Green fast pulse during measurement
        meshes.leds[2].material.emissiveIntensity = (state === 4) ? (2 + Math.sin(time * 10)) : 0.2; // Red warning

        // Laser beam pulsing
        meshes.laserBeam.material.emissiveIntensity = 1.5 + Math.sin(time * 50) * 0.5;

        // Animate Screen Data
        meshes.graphLines.forEach((bar, index) => {
            const h = 0.2 + Math.abs(Math.sin(time * 2 + index)) * 0.8;
            bar.scale.y = h;
            // Shift position up to keep bottom aligned
            bar.position.y = -0.8 + (bar.geometry.parameters.height * h) / 2;
        });

        // Sequence State Machine
        const loopDuration = 25; // total cycle time
        const modTime = stateTime % loopDuration;

        if (modTime < 4) {
            state = 0; // Head lowering
            const progress = modTime / 4; // 0 to 1
            // Smooth step interpolation
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            // Move from y=4 to y=1.2 (measurement gap)
            meshes.headCarriage.position.y = 4 - (2.8 * ease);
            meshes.shaftGroup.rotation.y = 0; // Reset rotation
            meshes.hoodLeft.rotation.y = 0;
            meshes.hoodRight.rotation.y = 0;
            meshes.fluidSample.scale.set(1, 1, 1);
            meshes.heaterL.material.emissiveIntensity = 0;
            meshes.heaterR.material.emissiveIntensity = 0;

        } else if (modTime < 7) {
            state = 1; // Closing thermal hood
            const progress = (modTime - 4) / 3;
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            // Left hood swings in
            meshes.hoodLeft.rotation.y = -Math.PI / 4 * (1 - ease); 
            // Right hood swings in
            meshes.hoodRight.rotation.y = Math.PI / 4 * (1 - ease);
            
            // Turn on heaters
            meshes.heaterL.material.emissiveIntensity = ease * 2;
            meshes.heaterR.material.emissiveIntensity = ease * 2;

            // At end of phase, force closed
            if (progress > 0.95) {
                meshes.hoodLeft.rotation.y = 0;
                meshes.hoodRight.rotation.y = 0;
            }

        } else if (modTime < 13) {
            state = 2; // Continuous rotational shear (Flow Curve)
            const spinSpeed = 2 + (modTime - 7) * 2; // Accelerating shear
            meshes.shaftGroup.rotation.y -= spinSpeed * dt;
            meshes.encoderGroup.rotation.y -= spinSpeed * dt;
            
            // Fluid bulges slightly (Weissenberg effect visually simulated)
            meshes.fluidSample.scale.y = 1 + (modTime - 7) * 0.05;
            meshes.fluidSample.scale.x = 1 - (modTime - 7) * 0.01;
            meshes.fluidSample.scale.z = 1 - (modTime - 7) * 0.01;

        } else if (modTime < 19) {
            state = 3; // Oscillatory shear (SAOS - Small Amplitude Oscillatory Shear)
            // Sine wave back and forth
            const freq = 10;
            const amplitude = 0.5;
            const angle = Math.sin(modTime * freq) * amplitude;
            meshes.shaftGroup.rotation.y = angle;
            meshes.encoderGroup.rotation.y = angle;

            // Fluid returns to normal size
            meshes.fluidSample.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);

        } else {
            state = 4; // Opening and raising
            const progress = (modTime - 19) / 6;
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            
            // Open hoods
            meshes.hoodLeft.rotation.y = -Math.PI / 4 * ease;
            meshes.hoodRight.rotation.y = Math.PI / 4 * ease;
            
            // Turn off heaters
            meshes.heaterL.material.emissiveIntensity = (1 - ease) * 2;
            meshes.heaterR.material.emissiveIntensity = (1 - ease) * 2;

            // Raise head
            meshes.headCarriage.position.y = 1.2 + (2.8 * ease);
        }

        // Spin ball screw slightly when carriage moves
        if (state === 0) {
            meshes.ballScrew.rotation.y += 10 * dt;
        } else if (state === 4) {
            meshes.ballScrew.rotation.y -= 10 * dt;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createRotationalRheometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
