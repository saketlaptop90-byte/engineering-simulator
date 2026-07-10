import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // CUSTOM MATERIALS FOR HYPER-REALISM
    // ==========================================
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0055ff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const glowingRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff3333,
        emissiveIntensity: 1.5,
        metalness: 0.5,
        roughness: 0.5
    });
    
    const glowingCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        metalness: 0.2,
        roughness: 0.1
    });

    const quantumCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        emissive: 0x8800ff,
        emissiveIntensity: 1.0,
        metalness: 0.9,
        roughness: 0.05,
        clearcoat: 1.0,
        transmission: 0.9,
        opacity: 0.9,
        transparent: true
    });
    
    const darkMatterMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.9,
        roughness: 0.7,
        wireframe: false
    });

    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff6600,
        emissiveIntensity: 1.5
    });

    // ==========================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRY
    // ==========================================
    function createHexagonShape(radius) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = i * (Math.PI / 3);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.lineTo(Math.cos(0) * radius, Math.sin(0) * radius);
        return shape;
    }

    function createPipe(pointsArray, radius, tubularSegments, material) {
        const curve = new THREE.CatmullRomCurve3(pointsArray.map(p => new THREE.Vector3(...p)));
        const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, 12, false);
        return new THREE.Mesh(geo, material);
    }

    function createComplexLathe(points, material) {
        const pArray = points.map(p => new THREE.Vector2(p[0], p[1]));
        const geo = new THREE.LatheGeometry(pArray, 64);
        return new THREE.Mesh(geo, material);
    }

    // ==========================================
    // COMPONENT BUILDERS
    // ==========================================

    // 1. HEAVY STATIC BASE
    const baseGroup = new THREE.Group();
    const basePoints = [
        [15, 0], [15, 2], [14, 2.5], [14, 4], [12, 5], [12, 6], [10, 6], [10, 7], [9, 7.5], [8, 7.5], [0, 7.5]
    ];
    const baseMesh = createComplexLathe(basePoints, darkSteel);
    baseGroup.add(baseMesh);
    
    // Base anchoring bolts
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const boltGeo = new THREE.CylinderGeometry(0.3, 0.4, 1, 8);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(Math.cos(angle)*14, 2, Math.sin(angle)*14);
        baseGroup.add(bolt);
    }
    group.add(baseGroup);

    parts.push({
        name: "Static Ground Anchorage",
        description: "Heavy durasteel anchoring system to prevent recoil or vibration from the hyper-rotation of the massive quantum array.",
        material: "Dark Steel / Chrome",
        function: "Structural Stability",
        assemblyOrder: 1,
        connections: ["Rotating Turret"],
        failureEffect: "Catastrophic structural failure leading to system collapse under high torque.",
        cascadeFailures: ["Turret Seizing", "Array Misalignment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 2. ROTATING TURRET PLATFORM
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, 7.5, 0);
    
    const turretPoints = [
        [8, 0], [9, 1], [9, 2], [7, 3], [7, 5], [5, 6], [0, 6]
    ];
    const turretMesh = createComplexLathe(turretPoints, steel);
    turretGroup.add(turretMesh);

    // Magnetic Levitation Drive Ring
    const magRingGeo = new THREE.TorusGeometry(8.5, 0.3, 16, 64);
    const magRing = new THREE.Mesh(magRingGeo, glowingCyan);
    magRing.rotation.x = Math.PI / 2;
    magRing.position.y = 0.5;
    turretGroup.add(magRing);
    meshes.magRing = magRing;

    parts.push({
        name: "Magnetic Levitation Turret",
        description: "Frictionless rotating turret utilizing quantum flux pinning to allow instantaneous 360-degree rotation of the heavy array.",
        material: "Steel / Superconducting Coils",
        function: "Azimuth Targeting",
        assemblyOrder: 2,
        connections: ["Static Ground Anchorage", "Yoke Support Arms"],
        failureEffect: "Inability to track moving targets laterally.",
        cascadeFailures: ["Target Loss"],
        originalPosition: {x: 0, y: 7.5, z: 0},
        explodedPosition: {x: 0, y: 10, z: 0}
    });

    // 3. YOKE SUPPORT ARMS
    const leftArmGroup = new THREE.Group();
    const rightArmGroup = new THREE.Group();
    
    const armShape = new THREE.Shape();
    armShape.moveTo(-3, 0);
    armShape.lineTo(3, 0);
    armShape.lineTo(2, 10);
    armShape.lineTo(0, 12);
    armShape.lineTo(-2, 10);
    armShape.lineTo(-3, 0);

    const armExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const armGeo = new THREE.ExtrudeGeometry(armShape, armExtrudeSettings);
    
    const leftArm = new THREE.Mesh(armGeo, darkSteel);
    leftArm.position.set(-6, 5, -1);
    leftArmGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, darkSteel);
    rightArm.position.set(4, 5, -1);
    rightArmGroup.add(rightArm);

    // Trunnion bearings
    const bearingGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
    const leftBearing = new THREE.Mesh(bearingGeo, chrome);
    leftBearing.rotation.z = Math.PI / 2;
    leftBearing.position.set(-5, 16, 0);
    leftArmGroup.add(leftBearing);

    const rightBearing = new THREE.Mesh(bearingGeo, chrome);
    rightBearing.rotation.z = Math.PI / 2;
    rightBearing.position.set(5, 16, 0);
    rightArmGroup.add(rightBearing);

    turretGroup.add(leftArmGroup);
    turretGroup.add(rightArmGroup);

    parts.push({
        name: "Titanium Trunnion Yokes",
        description: "Massive support arms housing the high-torque elevation bearings and slip rings for power transfer.",
        material: "Dark Steel / Chrome",
        function: "Array Suspension",
        assemblyOrder: 3,
        connections: ["Turret Platform", "Radar Dish Assembly"],
        failureEffect: "Array detachment or elevation tracking failure.",
        cascadeFailures: ["Hydraulic Rupture"],
        originalPosition: {x: 0, y: 12.5, z: 0},
        explodedPosition: {x: -15, y: 12.5, z: 0}
    });

    // 4. MAIN RADAR DISH ASSEMBLY
    const dishElevationGroup = new THREE.Group();
    dishElevationGroup.position.set(0, 16, 0);
    turretGroup.add(dishElevationGroup);
    meshes.dishElevationGroup = dishElevationGroup;

    // Backing structure (Octagonal pyramid-ish)
    const backRadius = 18;
    const backingGeo = new THREE.CylinderGeometry(5, backRadius, 4, 8);
    const backingMesh = new THREE.Mesh(backingGeo, darkMatterMat);
    backingMesh.rotation.x = Math.PI / 2;
    backingMesh.position.z = -2;
    dishElevationGroup.add(backingMesh);

    parts.push({
        name: "Phased Array Backplane",
        description: "Carbon-nanotube reinforced structural backplane housing primary routing matrices for the quantum transceivers.",
        material: "Dark Matter Matrix",
        function: "Structural Array Support",
        assemblyOrder: 4,
        connections: ["Trunnion Yokes", "Hexagonal Transceiver Array"],
        failureEffect: "Micro-fractures distorting the radar wave emissions.",
        cascadeFailures: ["Quantum Decoherence"],
        originalPosition: {x: 0, y: 16, z: 0},
        explodedPosition: {x: 0, y: 16, z: -20}
    });

    // 5. HEXAGONAL TRANSCEIVER ARRAY
    const arrayFaceGroup = new THREE.Group();
    arrayFaceGroup.position.z = 0.5;
    dishElevationGroup.add(arrayFaceGroup);

    const hexRadius = 0.8;
    const hexSpacing = 1.45;
    const arrayRadius = 16;
    meshes.hexTiles = [];

    const hexGeo = new THREE.ExtrudeGeometry(createHexagonShape(hexRadius), { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 2 });
    
    // Generate honeycomb
    let hexCount = 0;
    for (let q = -15; q <= 15; q++) {
        let r1 = Math.max(-15, -q - 15);
        let r2 = Math.min(15, -q + 15);
        for (let r = r1; r <= r2; r++) {
            const x = hexSpacing * Math.sqrt(3) * (q + r/2);
            const y = hexSpacing * 3/2 * r;
            
            // Circular mask
            if (Math.sqrt(x*x + y*y) < arrayRadius) {
                // Determine material dynamically based on distance from center
                let mat = (Math.random() > 0.8) ? glowingBlue : ((Math.random() > 0.9) ? glowingCyan : steel);
                
                const hexMesh = new THREE.Mesh(hexGeo, mat);
                hexMesh.position.set(x, y, 0);
                // Assign custom data for animation
                hexMesh.userData = {
                    baseZ: 0,
                    phaseOffset: Math.random() * Math.PI * 2,
                    speed: 1 + Math.random() * 2,
                    isActive: (mat === glowingBlue || mat === glowingCyan)
                };
                
                arrayFaceGroup.add(hexMesh);
                meshes.hexTiles.push(hexMesh);
                hexCount++;
            }
        }
    }

    parts.push({
        name: "Quantum Hex-Transceiver Matrix",
        description: `Dense honeycomb array consisting of ${hexCount} individual quantum wave-emitters capable of localized beamforming and stealth detection.`,
        material: "Superconducting Alloys / Emissive Plasma",
        function: "Wave Emission / Reception",
        assemblyOrder: 5,
        connections: ["Phased Array Backplane"],
        failureEffect: "Blind spots in radar coverage or false positives.",
        cascadeFailures: ["Targeting Lock Failure"],
        originalPosition: {x: 0, y: 16, z: 0.5},
        explodedPosition: {x: 0, y: 16, z: 20}
    });

    // 6. CRYOGENIC COOLING PIPES
    const pipeGroup = new THREE.Group();
    dishElevationGroup.add(pipeGroup);

    // Intricate pipe curves wrapped around the back
    const pipeMaterial = chrome;
    const coolantMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transmission: 0.9, opacity: 0.8, transparent: true, roughness: 0.1 });

    const pipeCurves = [
        [[0,0,-4], [5,5,-3], [10,0,-2], [5,-5,-3], [0,0,-4]],
        [[0,0,-4], [-5,5,-3], [-10,0,-2], [-5,-5,-3], [0,0,-4]],
        [[0,8,-3], [8,12,-1.5], [12,8,-1.5], [8,0,-2], [0,0,-4]],
        [[0,-8,-3], [-8,-12,-1.5], [-12,-8,-1.5], [-8,0,-2], [0,0,-4]]
    ];

    meshes.coolantFlows = [];

    pipeCurves.forEach((curvePoints, idx) => {
        // Outer metallic pipe
        const outerPipe = createPipe(curvePoints, 0.4, 64, pipeMaterial);
        pipeGroup.add(outerPipe);
        
        // Inner glowing coolant (visible at joints or via cutaways, represented by emissive spheres flowing along curve)
        const innerCurve = new THREE.CatmullRomCurve3(curvePoints.map(p => new THREE.Vector3(...p)));
        const flowSphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const flowSphere = new THREE.Mesh(flowSphereGeo, glowingCyan);
        pipeGroup.add(flowSphere);
        
        meshes.coolantFlows.push({ mesh: flowSphere, curve: innerCurve, progress: (idx * 0.25) });
    });

    parts.push({
        name: "Liquid Helium Cryo-Piping",
        description: "High-pressure tubing circulating liquid helium to keep the quantum core and transceivers near absolute zero.",
        material: "Chrome / Cryo-Glass",
        function: "Thermal Management",
        assemblyOrder: 6,
        connections: ["Phased Array Backplane", "Quantum Core"],
        failureEffect: "Thermal runaway leading to core meltdown.",
        cascadeFailures: ["Quantum Decoherence", "Explosive Decompression"],
        originalPosition: {x: 0, y: 16, z: -2},
        explodedPosition: {x: 0, y: 30, z: -10}
    });

    // 7. QUANTUM PROCESSING CORE
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, -5);
    dishElevationGroup.add(coreGroup);

    // Inner glowing core
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const innerCore = new THREE.Mesh(innerCoreGeo, glowingBlue);
    coreGroup.add(innerCore);
    meshes.innerCore = innerCore;

    // Outer quantum containment shell
    const outerCoreGeo = new THREE.IcosahedronGeometry(2, 1);
    const outerCore = new THREE.Mesh(outerCoreGeo, quantumCoreMat);
    coreGroup.add(outerCore);
    meshes.outerCore = outerCore;

    // Floating containment rings
    meshes.coreRings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i*0.5, 0.1, 16, 64);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        coreGroup.add(ring);
        meshes.coreRings.push({ mesh: ring, speedAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 0.02 + Math.random()*0.03 });
    }

    parts.push({
        name: "Quantum Entanglement Engine",
        description: "Central processing hub generating entangled photon pairs for hyper-resolution stealth detection.",
        material: "Crystalline Lattice / Plasma / Dark Steel",
        function: "Signal Generation / Processing",
        assemblyOrder: 7,
        connections: ["Cryo-Piping", "Phased Array Backplane"],
        failureEffect: "Complete loss of advanced tracking capabilities; reverts to standard radio waves.",
        cascadeFailures: ["Sub-system overload"],
        originalPosition: {x: 0, y: 16, z: -5},
        explodedPosition: {x: 0, y: 16, z: -30}
    });

    // 8. HYDRAULIC ELEVATION ACTUATORS
    const actuatorGroup = new THREE.Group();
    
    // Left actuator
    const actuatorBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
    const actuatorPistonGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 16);
    
    const leftBase = new THREE.Mesh(actuatorBaseGeo, darkSteel);
    leftBase.position.set(-3, 8, -4);
    leftBase.rotation.x = -Math.PI / 6;
    
    const leftPiston = new THREE.Mesh(actuatorPistonGeo, chrome);
    leftPiston.position.set(0, 4, 0); // relative to base
    leftBase.add(leftPiston);
    turretGroup.add(leftBase);

    // Right actuator
    const rightBase = new THREE.Mesh(actuatorBaseGeo, darkSteel);
    rightBase.position.set(3, 8, -4);
    rightBase.rotation.x = -Math.PI / 6;
    
    const rightPiston = new THREE.Mesh(actuatorPistonGeo, chrome);
    rightPiston.position.set(0, 4, 0); // relative to base
    rightBase.add(rightPiston);
    turretGroup.add(rightBase);

    meshes.leftPiston = leftPiston;
    meshes.rightPiston = rightPiston;
    meshes.leftActuatorBase = leftBase;
    meshes.rightActuatorBase = rightBase;

    parts.push({
        name: "Heavy Duty Elevation Hydraulics",
        description: "Twin ultra-high pressure hydraulic rams governing the vertical pitch (elevation) of the massive radar array.",
        material: "Dark Steel / Chrome Plating",
        function: "Elevation Control",
        assemblyOrder: 8,
        connections: ["Turret Platform", "Phased Array Backplane"],
        failureEffect: "Dish drops to maximum depression angle, unable to track aerial threats.",
        cascadeFailures: ["Structural stress on trunnions"],
        originalPosition: {x: 0, y: 8, z: -4},
        explodedPosition: {x: 0, y: -5, z: -15}
    });

    // 9. OPERATOR MAINTENANCE CABIN
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(9, 6, 0);
    turretGroup.add(cabinGroup);

    const cabinGeo = new THREE.BoxGeometry(4, 5, 6);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    // Tinted windows
    const windowGeo = new THREE.BoxGeometry(4.1, 2, 4);
    const cabinWindow = new THREE.Mesh(windowGeo, tinted);
    cabinWindow.position.set(0, 0.5, 0);
    cabinGroup.add(cabinWindow);

    // Access ladder
    for(let i=0; i<8; i++) {
        const stepGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        const step = new THREE.Mesh(stepGeo, aluminum);
        step.rotation.z = Math.PI / 2;
        step.position.set(2.2, -2 + (i*0.6), -2);
        cabinGroup.add(step);
    }

    parts.push({
        name: "Operator & Maintenance Pod",
        description: "Pressurized, radiation-shielded cabin for manual override operations and field diagnostics.",
        material: "Steel / Tinted Rad-Glass / Aluminum",
        function: "Human Interface / Maintenance",
        assemblyOrder: 9,
        connections: ["Turret Platform"],
        failureEffect: "Inability to perform localized manual repairs.",
        cascadeFailures: [],
        originalPosition: {x: 9, y: 13.5, z: 0},
        explodedPosition: {x: 25, y: 13.5, z: 0}
    });

    // 10. LIDAR SPINNERS (SECONDARY TRACKING)
    const lidarGroup = new THREE.Group();
    dishElevationGroup.add(lidarGroup);

    const lidarStandGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 16);
    const lidarHeadGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    
    meshes.lidarHeads = [];

    const lidarPositions = [
        [-17, 0, 0], [17, 0, 0], [0, 17, 0], [0, -17, 0]
    ];

    lidarPositions.forEach(pos => {
        const stand = new THREE.Mesh(lidarStandGeo, darkSteel);
        stand.position.set(pos[0], pos[1], pos[2]);
        
        // Orient stand pointing outward
        stand.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(...pos).normalize());
        
        const head = new THREE.Mesh(lidarHeadGeo, glowingRed);
        head.position.y = 1.5;
        // add a glass dome
        const domeGeo = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI*2, 0, Math.PI/2);
        const dome = new THREE.Mesh(domeGeo, glass);
        dome.position.y = 0.5;
        head.add(dome);

        stand.add(head);
        lidarGroup.add(stand);
        meshes.lidarHeads.push(head);
    });

    parts.push({
        name: "Peripheral LIDAR Array",
        description: "Four high-speed spinning optical LIDAR units for secondary short-range close-in threat detection.",
        material: "Dark Steel / Glass / Emissive Diodes",
        function: "Short-range Telemetry",
        assemblyOrder: 10,
        connections: ["Phased Array Backplane"],
        failureEffect: "Vulnerability to close-range, low-radar-cross-section drones.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 16, z: 0},
        explodedPosition: {x: 0, y: 16, z: 25}
    });

    // 11. INTRICATE WIRING HARNESS
    const wiringGroup = new THREE.Group();
    turretGroup.add(wiringGroup);

    for (let w = 0; w < 12; w++) {
        // Random curves from cabin to base of trunnions
        const p1 = new THREE.Vector3(7, 2, 0); // Near cabin bottom
        const p2 = new THREE.Vector3(5 + Math.random()*2, 1 + Math.random()*2, -2 + Math.random()*4);
        const p3 = new THREE.Vector3(2 + Math.random()*2, 4 + Math.random()*2, -2 + Math.random()*4);
        const p4 = new THREE.Vector3(0, 5, 0); // Center of turret
        
        const wireCurve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
        const wireGeo = new THREE.TubeGeometry(wireCurve, 20, 0.08, 8, false);
        const wireMat = (w%2===0) ? rubber : new THREE.MeshStandardMaterial({color: 0xffaa00});
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wiringGroup.add(wire);
    }

    parts.push({
        name: "Main Data & Power Harness",
        description: "Massive bundles of fiber-optic and superconducting power cables routing from the cabin and base slip rings to the array.",
        material: "Rubber / Copper / Fiber Optics",
        function: "Data & Power Transmission",
        assemblyOrder: 11,
        connections: ["Operator Cabin", "Turret Platform"],
        failureEffect: "Complete system blackout or data corruption.",
        cascadeFailures: ["Signal Loss", "Array Shutdown"],
        originalPosition: {x: 0, y: 7.5, z: 0},
        explodedPosition: {x: 10, y: 5, z: 10}
    });

    // 12. WARNING LIGHTS
    const lightsGroup = new THREE.Group();
    group.add(lightsGroup);
    meshes.warningLights = [];

    const lightGeo = new THREE.SphereGeometry(0.4, 16, 16);
    
    const lightLocs = [
        [14, 8, 14], [-14, 8, 14], [14, 8, -14], [-14, 8, -14]
    ];

    lightLocs.forEach(loc => {
        const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(loc[0], loc[1]/2, loc[2]);
        lightsGroup.add(pillar);

        const light = new THREE.Mesh(lightGeo, neonOrange);
        light.position.set(loc[0], loc[1], loc[2]);
        lightsGroup.add(light);
        meshes.warningLights.push(light);
    });

    parts.push({
        name: "Perimeter Warning Beacons",
        description: "High-intensity strobe lights enforcing the minimum safe distance during array hyper-rotation and quantum emission.",
        material: "Steel / Neon Plasma",
        function: "Safety Signaling",
        assemblyOrder: 12,
        connections: ["Static Ground Anchorage"],
        failureEffect: "Increased risk of personnel injury due to moving parts or radiation.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 30}
    });

    // 13. HEAT SINKS
    const heatSinkGroup = new THREE.Group();
    dishElevationGroup.add(heatSinkGroup);

    const finGeo = new THREE.BoxGeometry(0.1, 4, 2);
    for(let i=0; i<40; i++) {
        const fin = new THREE.Mesh(finGeo, aluminum);
        // Position them in a ring around the backing
        const angle = (i / 40) * Math.PI * 2;
        const r = 16;
        fin.position.set(Math.cos(angle)*r, Math.sin(angle)*r, -4);
        fin.rotation.z = angle;
        heatSinkGroup.add(fin);
    }

    parts.push({
        name: "Radial Aluminum Heat Sinks",
        description: "Passive thermal dissipation fins augmenting the active cryo-system for the outer edge transceiver modules.",
        material: "Aluminum",
        function: "Passive Cooling",
        assemblyOrder: 13,
        connections: ["Phased Array Backplane"],
        failureEffect: "Outer edge module degradation over prolonged operation.",
        cascadeFailures: ["Reduced effective radar range"],
        originalPosition: {x: 0, y: 16, z: -4},
        explodedPosition: {x: 0, y: 16, z: -25}
    });

    // 14. CALIBRATION ANTENNA CLUSTER
    const antennaGroup = new THREE.Group();
    dishElevationGroup.add(antennaGroup);
    meshes.antennas = [];

    for(let i=0; i<3; i++) {
        const antGeo = new THREE.CylinderGeometry(0.05, 0.2, 5, 8);
        const ant = new THREE.Mesh(antGeo, chrome);
        ant.position.set(-8 + i*8, 19, -1);
        ant.rotation.x = Math.PI / 8;
        antennaGroup.add(ant);
        meshes.antennas.push({ mesh: ant, baseRot: ant.rotation.z, phase: i });
    }

    parts.push({
        name: "Calibration Telemetry Antennas",
        description: "Standard RF antennas utilized to calibrate quantum array phase shifts against background atmospheric noise.",
        material: "Chrome / Carbon Fiber",
        function: "Calibration / Baseline Sensing",
        assemblyOrder: 14,
        connections: ["Phased Array Backplane"],
        failureEffect: "Increased noise-to-signal ratio; ghostly artifacts on radar screens.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 35, z: -1},
        explodedPosition: {x: 0, y: 45, z: -1}
    });

    // 15. POWER CONDITIONING RING
    const powerRingGeo = new THREE.TorusGeometry(18, 0.8, 16, 64);
    const powerRing = new THREE.Mesh(powerRingGeo, darkSteel);
    powerRing.position.z = -1;
    dishElevationGroup.add(powerRing);
    
    // Add glowing nodes to the power ring
    for(let i=0; i<12; i++) {
        const nodeGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
        const node = new THREE.Mesh(nodeGeo, glowingBlue);
        const angle = (i/12) * Math.PI * 2;
        node.position.set(Math.cos(angle)*18, Math.sin(angle)*18, -1);
        node.rotation.z = angle;
        dishElevationGroup.add(node);
    }

    parts.push({
        name: "High-Voltage Power Conditioning Ring",
        description: "Massive toroidal transformer stepping up voltage to drive the quantum core and emissive arrays.",
        material: "Dark Steel / Copper Windings / Emissive Plasma",
        function: "Power Distribution",
        assemblyOrder: 15,
        connections: ["Phased Array Backplane", "Quantum Core"],
        failureEffect: "Array power failure.",
        cascadeFailures: ["Complete System Shutdown"],
        originalPosition: {x: 0, y: 16, z: -1},
        explodedPosition: {x: 0, y: 16, z: -15}
    });


    group.add(group);

    const description = "The 'Omni-Sight' Defense Quantum Radar Array is a pinnacle of modern military technology. Utlilizing a heavily cooled quantum entanglement core, it can track hyper-velocity, stealth, and extra-atmospheric anomalies in real-time. The massive physical structure features a frictionless magnetic levitation rotating turret, twin heavy-duty hydraulic elevation actuators, and a dense honeycomb matrix of individual emissive quantum transceivers.";

    const quizQuestions = [
        {
            question: "What component is responsible for providing the frictionless 360-degree rotation of the massive turret?",
            options: [
                "Heavy Duty Elevation Hydraulics",
                "Magnetic Levitation Turret",
                "Static Ground Anchorage",
                "Radial Aluminum Heat Sinks"
            ],
            correctAnswer: 1,
            explanation: "The Magnetic Levitation Turret utilizes quantum flux pinning and superconducting coils to allow instantaneous, frictionless rotation of the heavy array."
        },
        {
            question: "How does the system manage the extreme temperatures generated by the Quantum Entanglement Engine?",
            options: [
                "Peripheral LIDAR Array",
                "Main Data & Power Harness",
                "Liquid Helium Cryo-Piping",
                "Calibration Telemetry Antennas"
            ],
            correctAnswer: 2,
            explanation: "Liquid Helium Cryo-Piping circulates high-pressure liquid helium to keep the core and transceivers near absolute zero."
        },
        {
            question: "If a catastrophic failure occurs in the Titanium Trunnion Yokes, what is the immediate consequence?",
            options: [
                "Array detachment or elevation tracking failure.",
                "Thermal runaway leading to core meltdown.",
                "Blind spots in radar coverage.",
                "Increased noise-to-signal ratio."
            ],
            correctAnswer: 0,
            explanation: "The yokes house the elevation bearings; failure leads to the massive array detaching or losing its ability to track targets vertically."
        },
        {
            question: "What is the primary function of the Quantum Hex-Transceiver Matrix?",
            options: [
                "Passive thermal dissipation.",
                "Human interface and maintenance.",
                "Localized beamforming and stealth detection via wave emission.",
                "Short-range close-in threat detection."
            ],
            correctAnswer: 2,
            explanation: "The dense honeycomb matrix consists of quantum wave-emitters capable of localized beamforming to detect stealth anomalies."
        },
        {
            question: "Which secondary system acts to detect close-in threats that might bypass the main quantum array?",
            options: [
                "Calibration Telemetry Antennas",
                "Peripheral LIDAR Array",
                "Perimeter Warning Beacons",
                "High-Voltage Power Conditioning Ring"
            ],
            correctAnswer: 1,
            explanation: "The four high-speed spinning optical LIDAR units act as a secondary tracking measure for short-range, close-in telemetry."
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        
        const scaledTime = time * speed;

        // 1. Turret Base Rotation (Azimuth)
        // Rotate the entire turret group around Y axis
        if(turretGroup) {
            turretGroup.rotation.y = scaledTime * 0.2;
        }

        // 2. Dish Elevation (Pitch) via Trunnions
        // Sweep up and down smoothly using sine wave
        const pitchAngle = Math.sin(scaledTime * 0.3) * (Math.PI / 6); // +/- 30 degrees
        if(activeMeshes.dishElevationGroup) {
            activeMeshes.dishElevationGroup.rotation.x = pitchAngle;
        }

        // 3. Hydraulic Piston Synchronization
        // As dish pitches up (negative rotation x), pistons must extend.
        // Base of actuator is fixed. Piston translates along its local Y axis.
        if (activeMeshes.leftPiston && activeMeshes.rightPiston) {
            // Calculate extension based on pitch angle.
            // When pitchAngle is positive (looking down), piston retracts.
            // When pitchAngle is negative (looking up), piston extends.
            const extension = 4 - (pitchAngle * 4); // basic linear mapping for effect
            activeMeshes.leftPiston.position.y = extension;
            activeMeshes.rightPiston.position.y = extension;
            
            // Adjust actuator base rotation slightly to maintain connection logic visually
            const actuatorRot = (-Math.PI / 6) + (pitchAngle * 0.5);
            if(activeMeshes.leftActuatorBase) activeMeshes.leftActuatorBase.rotation.x = actuatorRot;
            if(activeMeshes.rightActuatorBase) activeMeshes.rightActuatorBase.rotation.x = actuatorRot;
        }

        // 4. Quantum Core Animation
        if(activeMeshes.innerCore) {
            activeMeshes.innerCore.rotation.y = scaledTime * 2;
            activeMeshes.innerCore.rotation.x = scaledTime * 1.5;
            // Pulsing scale
            const pulse = 1 + Math.sin(scaledTime * 5) * 0.1;
            activeMeshes.innerCore.scale.set(pulse, pulse, pulse);
        }
        if(activeMeshes.outerCore) {
            activeMeshes.outerCore.rotation.y = -scaledTime;
        }
        if(activeMeshes.coreRings) {
            activeMeshes.coreRings.forEach(ringObj => {
                ringObj.mesh.rotateOnAxis(ringObj.speedAxis, ringObj.speed * speed * 5);
            });
        }

        // 5. Hexagonal Tile Matrix Animation
        // Create a wave ripple effect across the surface
        if(activeMeshes.hexTiles) {
            activeMeshes.hexTiles.forEach(tile => {
                if (tile.userData.isActive) {
                    const wave = Math.sin(scaledTime * tile.userData.speed + tile.userData.phaseOffset);
                    tile.position.z = tile.userData.baseZ + wave * 0.2; // physical bulging
                    // Pulsing emissive intensity could be done here if material was unique, 
                    // but they share materials. The physical movement is enough.
                }
            });
        }

        // 6. Coolant Flow Simulation
        if(activeMeshes.coolantFlows) {
            activeMeshes.coolantFlows.forEach(flow => {
                flow.progress += 0.005 * speed;
                if(flow.progress > 1) flow.progress = 0;
                
                // Get position on curve
                const point = flow.curve.getPointAt(flow.progress);
                flow.mesh.position.copy(point);
            });
        }

        // 7. LIDAR Spinners
        if(activeMeshes.lidarHeads) {
            activeMeshes.lidarHeads.forEach(head => {
                head.rotation.y += 0.2 * speed;
            });
        }

        // 8. Warning Lights Blink
        if(activeMeshes.warningLights) {
            const isBlinkOn = Math.sin(scaledTime * 8) > 0;
            const blinkColor = isBlinkOn ? 0xff0000 : 0x220000;
            activeMeshes.warningLights.forEach(light => {
                // To avoid sharing material issues, we could clone the material, 
                // but for simplicity we modify the shared material if applicable,
                // or just rely on emissive intensity changes.
                // Since they share the neonOrange material, modifying it modifies all (desired).
                neonOrange.emissiveIntensity = isBlinkOn ? 3.0 : 0.2;
            });
        }
        
        // 9. Mag Ring pulse
        if(activeMeshes.magRing) {
            glowingCyan.emissiveIntensity = 2.0 + Math.sin(scaledTime * 10) * 1.0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
