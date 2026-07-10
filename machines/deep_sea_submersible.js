import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Emissive & specialized materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.2,
        roughness: 0.1
    });

    const glowRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.5,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.8,
        metalness: 0.3,
        roughness: 0.2
    });

    // 1. Main Titanium Pressure Sphere
    const sphereRadius = 4;
    const hullGeom = new THREE.SphereGeometry(sphereRadius, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.85);
    const mainHull = new THREE.Mesh(hullGeom, darkSteel);
    mainHull.rotation.x = -Math.PI / 2;
    group.add(mainHull);
    meshes.mainHull = mainHull;

    parts.push({
        name: 'Titanium Pressure Sphere',
        description: 'A monolithic, ultra-thick titanium alloy sphere forming the primary pressure vessel. Precisely machined to withstand massive compressive forces.',
        material: 'darkSteel',
        function: 'Protects the human occupants and sensitive electronics from crushing deep-sea hydrostatic pressures.',
        assemblyOrder: 1,
        connections: ['Acrylic Viewport', 'Outer Hydrodynamic Fairing', 'Life Support Systems'],
        failureEffect: 'Catastrophic instantaneous implosion.',
        cascadeFailures: ['Complete structural disintegration', 'Crew loss'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -5 }
    });

    // 2. Massive Acrylic Viewport
    const viewportGeom = new THREE.SphereGeometry(sphereRadius + 0.05, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.15);
    const viewport = new THREE.Mesh(viewportGeom, glass);
    viewport.rotation.x = Math.PI / 2;
    viewport.position.z = -1.5;
    group.add(viewport);
    meshes.viewport = viewport;

    parts.push({
        name: 'Acrylic Viewport',
        description: 'A chemically hardened, hyper-thick truncated acrylic dome seamlessly bonded to the titanium sphere.',
        material: 'glass',
        function: 'Provides panoramic visibility for operators while displacing immense deep-sea pressure.',
        assemblyOrder: 2,
        connections: ['Titanium Pressure Sphere'],
        failureEffect: 'Water ingress at 10,000+ PSI.',
        cascadeFailures: ['Internal flooding', 'Rapid depressurization'],
        originalPosition: { x: 0, y: 0, z: -1.5 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 3. Viewport Retaining Ring
    const ringGeom = new THREE.TorusGeometry(sphereRadius * Math.sin(Math.PI * 0.15), 0.2, 32, 64);
    const retainingRing = new THREE.Mesh(ringGeom, chrome);
    retainingRing.position.set(0, 0, -(sphereRadius * Math.cos(Math.PI * 0.15)) - 1.5);
    group.add(retainingRing);
    meshes.retainingRing = retainingRing;

    // Add rivets to the retaining ring
    const rivetGeom = new THREE.SphereGeometry(0.05, 8, 8);
    for (let i = 0; i < 36; i++) {
        const rivet = new THREE.Mesh(rivetGeom, darkSteel);
        const angle = (i / 36) * Math.PI * 2;
        rivet.position.set(
            Math.cos(angle) * sphereRadius * Math.sin(Math.PI * 0.15),
            Math.sin(angle) * sphereRadius * Math.sin(Math.PI * 0.15),
            0.15
        );
        retainingRing.add(rivet);
    }

    parts.push({
        name: 'Viewport Retaining Ring',
        description: 'A heavy-duty chrome-plated steel ring secured with 36 high-tensile titanium bolts.',
        material: 'chrome',
        function: 'Locks the acrylic viewport into the titanium seat and distributes stress evenly.',
        assemblyOrder: 3,
        connections: ['Acrylic Viewport', 'Titanium Pressure Sphere'],
        failureEffect: 'Viewport misalignment and seal breach.',
        cascadeFailures: ['Pressure seal failure', 'Implosion'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -12 }
    });

    // 4. Outer Hydrodynamic Fairing
    const fairingShape = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const x = Math.sin(t * Math.PI) * 4.5;
        const y = Math.cos(t * Math.PI) * 7.5;
        fairingShape.push(new THREE.Vector2(x, y));
    }
    const fairingGeom = new THREE.LatheGeometry(fairingShape, 64);
    const fairing = new THREE.Mesh(fairingGeom, plastic);
    fairing.rotation.x = Math.PI / 2;
    fairing.position.z = 2.5;
    fairing.scale.set(1, 1, 0.8);
    group.add(fairing);
    meshes.fairing = fairing;

    parts.push({
        name: 'Composite Exostructure Fairing',
        description: 'A syntactic foam and carbon-fiber hydrodynamic shell encompassing the rear of the submersible.',
        material: 'plastic',
        function: 'Reduces drag, houses auxiliary systems, and provides positive buoyancy via syntactic foam.',
        assemblyOrder: 4,
        connections: ['Titanium Pressure Sphere', 'Ballast Tanks', 'Propulsion Systems'],
        failureEffect: 'Increased drag and buoyancy loss.',
        cascadeFailures: ['Inability to surface', 'Excessive power drain'],
        originalPosition: { x: 0, y: 0, z: 2.5 },
        explodedPosition: { x: 0, y: 8, z: 10 }
    });

    // 5. Main Ballast Tanks (Left and Right)
    const ballastGroup = new THREE.Group();
    const tankGeom = new THREE.CylinderGeometry(1.2, 1.2, 10, 32);
    const tankMaterial = steel;

    const leftTank = new THREE.Mesh(tankGeom, tankMaterial);
    leftTank.rotation.x = Math.PI / 2;
    leftTank.position.set(-3.8, -1.5, 2);
    ballastGroup.add(leftTank);
    meshes.leftTank = leftTank;

    const rightTank = new THREE.Mesh(tankGeom, tankMaterial);
    rightTank.rotation.x = Math.PI / 2;
    rightTank.position.set(3.8, -1.5, 2);
    ballastGroup.add(rightTank);
    meshes.rightTank = rightTank;

    const bandGeom = new THREE.TorusGeometry(1.22, 0.1, 16, 32);
    for (let i = -4; i <= 4; i += 2) {
        const lBand = new THREE.Mesh(bandGeom, darkSteel);
        lBand.rotation.x = Math.PI / 2;
        lBand.position.set(-3.8, -1.5, 2 + i);
        ballastGroup.add(lBand);

        const rBand = new THREE.Mesh(bandGeom, darkSteel);
        rBand.rotation.x = Math.PI / 2;
        rBand.position.set(3.8, -1.5, 2 + i);
        ballastGroup.add(rBand);
    }
    group.add(ballastGroup);

    parts.push({
        name: 'Variable Ballast Tanks',
        description: 'Twin high-capacity cylindrical tanks flanked on the lower port and starboard sides. Includes high-pressure blow valves.',
        material: 'steel',
        function: 'Controls descent and ascent rates by flooding with seawater or purging with compressed air.',
        assemblyOrder: 5,
        connections: ['Composite Exostructure Fairing', 'Pneumatic Lines'],
        failureEffect: 'Loss of depth control.',
        cascadeFailures: ['Uncontrolled descent', 'Structural failure limits exceeded'],
        originalPosition: { x: 0, y: -1.5, z: 2 },
        explodedPosition: { x: -10, y: -5, z: 2 }
    });

    // 6. Hydraulic Piping and Cables
    const pipePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.8, -1.5, -3),
        new THREE.Vector3(-4.5, 0, -1),
        new THREE.Vector3(-4.5, 2, 1),
        new THREE.Vector3(-2, 3.5, 3),
        new THREE.Vector3(0, 3.5, 4)
    ]);
    const pipeGeom = new THREE.TubeGeometry(pipePath, 64, 0.15, 16, false);
    const pipeLine1 = new THREE.Mesh(pipeGeom, copper);
    group.add(pipeLine1);

    const pipePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.8, -1.5, -3),
        new THREE.Vector3(4.5, 0, -1),
        new THREE.Vector3(4.5, 2, 1),
        new THREE.Vector3(2, 3.5, 3),
        new THREE.Vector3(0, 3.5, 4)
    ]);
    const pipeGeom2 = new THREE.TubeGeometry(pipePath2, 64, 0.15, 16, false);
    const pipeLine2 = new THREE.Mesh(pipeGeom2, copper);
    group.add(pipeLine2);

    parts.push({
        name: 'External Hydraulic and Pneumatic Conduits',
        description: 'Copper and reinforced rubber piping weaving across the exterior, connecting tanks, pumps, and manipulators.',
        material: 'copper',
        function: 'Transmits hydraulic power and high-pressure air across the exostructure.',
        assemblyOrder: 6,
        connections: ['Variable Ballast Tanks', 'Hydraulic Pump Array', 'Robotic Manipulators'],
        failureEffect: 'Loss of hydraulic pressure.',
        cascadeFailures: ['Robotic arm paralysis', 'Valve actuation failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 7. Aft Main Propulsion Thruster
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, 0, 9);
    
    const ductShape = new THREE.Shape();
    ductShape.moveTo(1.5, -1);
    ductShape.lineTo(1.6, -1);
    ductShape.lineTo(1.8, 0);
    ductShape.lineTo(1.6, 1);
    ductShape.lineTo(1.5, 1);
    ductShape.lineTo(1.4, 0);
    ductShape.lineTo(1.5, -1);
    const ductGeom = new THREE.LatheGeometry(ductShape.getPoints(), 64);
    const duct = new THREE.Mesh(ductGeom, steel);
    duct.rotation.x = Math.PI / 2;
    thrusterGroup.add(duct);

    const motorGeom = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const motor = new THREE.Mesh(motorGeom, darkSteel);
    motor.rotation.x = Math.PI / 2;
    thrusterGroup.add(motor);

    const propHubGeom = new THREE.SphereGeometry(0.4, 32, 32);
    const propHub = new THREE.Mesh(propHubGeom, chrome);
    propHub.position.z = 0.8;
    motor.add(propHub);

    const blades = new THREE.Group();
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(0.5, 0.2, 1.2, 0.1);
    bladeShape.quadraticCurveTo(1.3, -0.2, 0.8, -0.4);
    bladeShape.quadraticCurveTo(0.3, -0.2, 0, 0);
    const bladeExtrude = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    const bladeGeom = new THREE.ExtrudeGeometry(bladeShape, bladeExtrude);
    
    for (let i = 0; i < 7; i++) {
        const blade = new THREE.Mesh(bladeGeom, aluminum);
        blade.rotation.x = 0.3; // pitch
        const angle = (i / 7) * Math.PI * 2;
        const pivot = new THREE.Group();
        pivot.rotation.z = angle;
        blade.position.x = 0.3;
        pivot.add(blade);
        blades.add(pivot);
    }
    blades.position.z = 0.8;
    motor.add(blades);
    meshes.mainBlades = blades;

    group.add(thrusterGroup);

    parts.push({
        name: 'Aft Main Propulsion Ducted Fan',
        description: 'A large, magnetically coupled, direct-drive motor enclosed in a hydrodynamic duct with a 7-blade skewed propeller.',
        material: 'steel',
        function: 'Provides primary forward and reverse thrust. Ducted design improves low-speed torque and protects the blades.',
        assemblyOrder: 7,
        connections: ['Composite Exostructure Fairing', 'Power Distribution Bus'],
        failureEffect: 'Loss of forward mobility.',
        cascadeFailures: ['Inability to fight currents', 'Mission abort'],
        originalPosition: { x: 0, y: 0, z: 9 },
        explodedPosition: { x: 0, y: 0, z: 18 }
    });

    // 8. Vertical Hover Thrusters
    const vThrusterGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const vThrusterMat = steel;
    
    const vThrusterPositions = [
        { x: -3, y: 2, z: 0 },
        { x: 3, y: 2, z: 0 },
        { x: -2.5, y: 2, z: 6 },
        { x: 2.5, y: 2, z: 6 }
    ];

    meshes.vBlades = [];

    vThrusterPositions.forEach((pos, idx) => {
        const vtGroup = new THREE.Group();
        vtGroup.position.set(pos.x, pos.y, pos.z);
        
        const housing = new THREE.Mesh(vThrusterGeom, vThrusterMat);
        vtGroup.add(housing);

        const vBlades = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            const b = new THREE.Mesh(bladeGeom, aluminum);
            b.scale.set(0.4, 0.4, 0.4);
            b.rotation.x = 0.4;
            const pivot = new THREE.Group();
            pivot.rotation.y = (i / 4) * Math.PI * 2;
            pivot.rotation.x = Math.PI / 2;
            b.position.x = 0.1;
            pivot.add(b);
            vBlades.add(pivot);
        }
        vBlades.rotation.x = Math.PI / 2;
        vtGroup.add(vBlades);
        meshes.vBlades.push(vBlades);

        group.add(vtGroup);
    });

    parts.push({
        name: 'Quad Vertical Hover Thrusters',
        description: 'Four vertically oriented thrusters embedded in the exostructure.',
        material: 'steel',
        function: 'Enables precise pitch, roll, and vertical translation (heave) control.',
        assemblyOrder: 8,
        connections: ['Composite Exostructure Fairing', 'Flight Control Computer'],
        failureEffect: 'Loss of vertical station-keeping.',
        cascadeFailures: ['Collision with seabed', 'Uncontrolled pitch/roll'],
        originalPosition: { x: 0, y: 2, z: 3 },
        explodedPosition: { x: 0, y: 15, z: 3 }
    });

    // 9. Skid Undercarriage (Landing Gear)
    const skidGroup = new THREE.Group();
    const skidTubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.5, -4.5, -3),
        new THREE.Vector3(-2.5, -5.5, -1),
        new THREE.Vector3(-2.5, -5.5, 6),
        new THREE.Vector3(-2.5, -4.5, 8)
    ]);
    const skidGeom = new THREE.TubeGeometry(skidTubePath, 64, 0.3, 16, false);
    
    const leftSkid = new THREE.Mesh(skidGeom, chrome);
    skidGroup.add(leftSkid);

    const rightSkidTubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.5, -4.5, -3),
        new THREE.Vector3(2.5, -5.5, -1),
        new THREE.Vector3(2.5, -5.5, 6),
        new THREE.Vector3(2.5, -4.5, 8)
    ]);
    const rightSkidGeom = new THREE.TubeGeometry(rightSkidTubePath, 64, 0.3, 16, false);
    const rightSkid = new THREE.Mesh(rightSkidGeom, chrome);
    skidGroup.add(rightSkid);

    for (let z = 0; z <= 5; z += 2.5) {
        const strutGeom = new THREE.CylinderGeometry(0.15, 0.15, 5, 16);
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        strut.rotation.z = Math.PI / 2;
        strut.position.set(0, -5.5, z);
        skidGroup.add(strut);
    }
    
    const shockGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const shockPositions = [
        { x: -2.5, y: -4.8, z: -1 },
        { x: 2.5, y: -4.8, z: -1 },
        { x: -2.5, y: -4.8, z: 6 },
        { x: 2.5, y: -4.8, z: 6 }
    ];
    shockPositions.forEach(pos => {
        const shock = new THREE.Mesh(shockGeom, rubber);
        shock.position.set(pos.x, pos.y, pos.z);
        skidGroup.add(shock);
    });

    group.add(skidGroup);

    parts.push({
        name: 'Shock-Absorbing Landing Skids',
        description: 'Titanium and chrome tubular skids fitted with heavy-duty rubberized hydro-pneumatic shock absorbers.',
        material: 'chrome',
        function: 'Supports the massive weight of the submersible on the ocean floor and absorbs impact kinetic energy.',
        assemblyOrder: 9,
        connections: ['Titanium Pressure Sphere', 'Composite Exostructure Fairing'],
        failureEffect: 'Hull impact with sea floor.',
        cascadeFailures: ['Hull fracture', 'Equipment damage'],
        originalPosition: { x: 0, y: -5, z: 2 },
        explodedPosition: { x: 0, y: -12, z: 2 }
    });

    // 10. Heavy Duty Robotic Manipulator Arm (Primary)
    const armGroup = new THREE.Group();
    armGroup.position.set(-2, -2, -3.5);
    
    const shoulderBaseGeom = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 32);
    const shoulderBase = new THREE.Mesh(shoulderBaseGeom, darkSteel);
    shoulderBase.rotation.x = Math.PI / 2;
    armGroup.add(shoulderBase);

    const shoulderJointGeom = new THREE.SphereGeometry(0.45, 32, 32);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeom, chrome);
    shoulderJoint.position.z = -0.5;
    shoulderBase.add(shoulderJoint);

    const bicepGroup = new THREE.Group();
    bicepGroup.position.set(0, 0, -0.5);
    const bicepGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const bicep = new THREE.Mesh(bicepGeom, steel);
    bicep.position.y = -1.25;
    bicepGroup.add(bicep);
    
    const pistonCylinderGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16);
    const pistonCylinder = new THREE.Mesh(pistonCylinderGeom, darkSteel);
    pistonCylinder.position.set(0.3, -1.0, 0);
    bicepGroup.add(pistonCylinder);

    const pistonRodGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 16);
    const pistonRod = new THREE.Mesh(pistonRodGeom, chrome);
    pistonRod.position.set(0.3, -1.8, 0);
    bicepGroup.add(pistonRod);

    const elbowJoint = new THREE.Mesh(shoulderJointGeom, chrome);
    elbowJoint.position.y = -2.5;
    bicepGroup.add(elbowJoint);

    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -2.5;
    const forearmGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.0, 16);
    const forearm = new THREE.Mesh(forearmGeom, steel);
    forearm.position.y = -1.0;
    forearmGroup.add(forearm);

    const wristGroup = new THREE.Group();
    wristGroup.position.y = -2.0;
    const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), chrome);
    wristGroup.add(wristJoint);

    const clawBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), darkSteel);
    clawBase.position.y = -0.3;
    wristGroup.add(clawBase);

    const clawShape = new THREE.Shape();
    clawShape.moveTo(0, 0);
    clawShape.lineTo(0.2, -0.8);
    clawShape.lineTo(0.05, -1.0);
    clawShape.lineTo(-0.1, -0.6);
    clawShape.lineTo(-0.2, 0);
    const clawExtrude = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    const clawGeom = new THREE.ExtrudeGeometry(clawShape, clawExtrude);
    
    const leftClaw = new THREE.Mesh(clawGeom, aluminum);
    leftClaw.position.set(-0.2, -0.5, 0);
    wristGroup.add(leftClaw);
    meshes.leftClaw = leftClaw;

    const rightClaw = new THREE.Mesh(clawGeom, aluminum);
    rightClaw.position.set(0.2, -0.5, 0);
    rightClaw.rotation.y = Math.PI; 
    wristGroup.add(rightClaw);
    meshes.rightClaw = rightClaw;

    forearmGroup.add(wristGroup);
    bicepGroup.add(forearmGroup);
    shoulderBase.add(bicepGroup);

    meshes.roboticBicep = bicepGroup;
    meshes.roboticForearm = forearmGroup;
    meshes.roboticWrist = wristGroup;
    meshes.armPistonRod = pistonRod;

    group.add(armGroup);

    parts.push({
        name: 'Primary Dexterous Manipulator (Port)',
        description: '7-function hydraulic manipulator arm with force-feedback, constructed from titanium and stainless steel. Features a heavy-duty crushing claw.',
        material: 'steel',
        function: 'Interacts with the deep-sea environment: collects biological samples, recovers artifacts, and operates external equipment.',
        assemblyOrder: 10,
        connections: ['Titanium Pressure Sphere', 'Hydraulic Pump Array'],
        failureEffect: 'Inability to collect samples or detach entanglements.',
        cascadeFailures: ['Mission failure', 'Entrapment risk'],
        originalPosition: { x: -2, y: -2, z: -3.5 },
        explodedPosition: { x: -8, y: -2, z: -6 }
    });

    // 11. External Sample Basket
    const basketGroup = new THREE.Group();
    basketGroup.position.set(0, -3.5, -5);
    
    for (let x = -1.8; x <= 1.8; x += 0.4) {
        const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 8);
        const bar = new THREE.Mesh(barGeom, aluminum);
        bar.rotation.x = Math.PI / 2;
        bar.position.set(x, -0.75, 0);
        basketGroup.add(bar);
    }
    for (let z = -1.2; z <= 1.2; z += 0.4) {
        const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 4.0, 8);
        const bar = new THREE.Mesh(barGeom, aluminum);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, -0.75, z);
        basketGroup.add(bar);
    }
    
    const railGeom = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
    const rail = new THREE.Mesh(railGeom, darkSteel);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0, -1.2);
    basketGroup.add(rail);

    group.add(basketGroup);

    parts.push({
        name: 'Extendable Sample Basket',
        description: 'Retractable titanium mesh basket with automated dividers for isolating delicate geological and biological samples.',
        material: 'aluminum',
        function: 'Stores collected materials securely during ascent.',
        assemblyOrder: 11,
        connections: ['Skid Undercarriage', 'Hydraulic Actuators'],
        failureEffect: 'Loss of collected scientific samples.',
        cascadeFailures: ['Mission objective failure'],
        originalPosition: { x: 0, y: -3.5, z: -5 },
        explodedPosition: { x: 0, y: -8, z: -10 }
    });

    // 12. External Light and Sensor Array
    const lightBarGroup = new THREE.Group();
    lightBarGroup.position.set(0, 3.8, -2.5);
    
    const mountGeom = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const mount = new THREE.Mesh(mountGeom, darkSteel);
    mount.rotation.z = Math.PI / 2;
    lightBarGroup.add(mount);

    meshes.searchLights = [];
    for (let i = -1.5; i <= 1.5; i += 1.0) {
        const lightHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16), steel);
        lightHousing.rotation.x = Math.PI / 2;
        lightHousing.position.set(i, 0, -0.2);
        
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), glowBlue);
        bulb.position.y = -0.2;
        lightHousing.add(bulb);
        meshes.searchLights.push(bulb);

        lightBarGroup.add(lightHousing);
    }

    for (let i of [-2, 2]) {
        const floodHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.6, 16), darkSteel);
        floodHousing.rotation.x = Math.PI / 2;
        floodHousing.position.set(i, -0.5, -0.2);
        
        const floodBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), glowRed);
        floodBulb.position.y = -0.28;
        floodHousing.add(floodBulb);
        meshes.searchLights.push(floodBulb);

        lightBarGroup.add(floodHousing);
    }

    group.add(lightBarGroup);

    parts.push({
        name: 'HMI Illumination Array',
        description: 'Ultra-high intensity LED and Hydrargyrum medium-arc iodide (HMI) lamps mounted on a pan-tilt titanium rack.',
        material: 'steel',
        function: 'Pierces the absolute darkness of the abyssal zone, providing visibility for the crew and high-res cameras.',
        assemblyOrder: 12,
        connections: ['Titanium Pressure Sphere', 'Main Power Bus'],
        failureEffect: 'Total blindness in the deep ocean.',
        cascadeFailures: ['Navigation failure', 'Collision hazard'],
        originalPosition: { x: 0, y: 3.8, z: -2.5 },
        explodedPosition: { x: 0, y: 10, z: -5 }
    });

    // 13. Scientific Sensor Mast
    const mastGroup = new THREE.Group();
    mastGroup.position.set(-2, 3.5, 0);
    
    const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 16), chrome);
    mastPole.position.y = 1.5;
    mastGroup.add(mastPole);

    const sonarDome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), plastic);
    sonarDome.position.y = 3.2;
    mastGroup.add(sonarDome);
    meshes.sonarDome = sonarDome;

    for (let i = 0; i < 3; i++) {
        const ctdRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 32), steel);
        ctdRing.rotation.x = Math.PI / 2;
        ctdRing.position.y = 1.0 + i * 0.5;
        mastGroup.add(ctdRing);
    }

    group.add(mastGroup);

    parts.push({
        name: 'Scientific Sensor Mast & Multibeam Sonar',
        description: 'Deployable mast housing the CTD (Conductivity, Temperature, Depth) profiler and a high-frequency multibeam sonar dome.',
        material: 'chrome',
        function: 'Maps the sea floor in 3D and collects continuous oceanographic data.',
        assemblyOrder: 13,
        connections: ['Outer Hydrodynamic Fairing', 'Data Processing Unit'],
        failureEffect: 'Loss of bathymetric mapping and spatial awareness.',
        cascadeFailures: ['Navigation errors', 'Data corruption'],
        originalPosition: { x: -2, y: 3.5, z: 0 },
        explodedPosition: { x: -5, y: 12, z: 0 }
    });

    // 14. Emergency Drop Weights
    const weightsGroup = new THREE.Group();
    for (let x of [-1.5, 1.5]) {
        for (let z of [0, 2, 4]) {
            const weightGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
            const weight = new THREE.Mesh(weightGeom, steel);
            weight.position.set(x, -3.8, z);
            weightsGroup.add(weight);
        }
    }
    group.add(weightsGroup);

    parts.push({
        name: 'Electromagnetic Drop Weights',
        description: 'Dense steel alloy cylinders held in place by powerful electromagnets.',
        material: 'steel',
        function: 'Failsafe ballast system. If power fails, magnets deactivate, weights drop, and the submersible automatically surfaces.',
        assemblyOrder: 14,
        connections: ['Titanium Pressure Sphere', 'Emergency Power Bus'],
        failureEffect: 'Weights stick or drop prematurely.',
        cascadeFailures: ['Unintended rapid ascent', 'Inability to surface if jammed'],
        originalPosition: { x: 0, y: -3.8, z: 2 },
        explodedPosition: { x: 0, y: -15, z: 2 }
    });

    // 15. Detailed Interior Cabin
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, 0, 0);
    
    const floorGeom = new THREE.CylinderGeometry(2.8, 2.8, 0.1, 32);
    const floor = new THREE.Mesh(floorGeom, aluminum);
    floor.position.y = -1.5;
    interiorGroup.add(floor);

    const seatShape = new THREE.Shape();
    seatShape.moveTo(-0.4, 0);
    seatShape.lineTo(0.4, 0);
    seatShape.lineTo(0.4, 0.8);
    seatShape.lineTo(-0.4, 0.8);
    seatShape.lineTo(-0.4, 0);
    
    const seatExtrude = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };
    
    const leftSeatGroup = new THREE.Group();
    const seatCushionL = new THREE.Mesh(new THREE.ExtrudeGeometry(seatShape, seatExtrude), rubber);
    seatCushionL.rotation.x = -Math.PI / 2;
    leftSeatGroup.add(seatCushionL);
    
    const seatBackL = new THREE.Mesh(new THREE.ExtrudeGeometry(seatShape, seatExtrude), rubber);
    seatBackL.position.set(0, 0, 0.5);
    seatBackL.rotation.x = -0.2;
    leftSeatGroup.add(seatBackL);
    leftSeatGroup.position.set(-1.0, -1.4, -0.5);
    interiorGroup.add(leftSeatGroup);

    const rightSeatGroup = new THREE.Group();
    const seatCushionR = new THREE.Mesh(new THREE.ExtrudeGeometry(seatShape, seatExtrude), rubber);
    seatCushionR.rotation.x = -Math.PI / 2;
    rightSeatGroup.add(seatCushionR);
    
    const seatBackR = new THREE.Mesh(new THREE.ExtrudeGeometry(seatShape, seatExtrude), rubber);
    seatBackR.position.set(0, 0, 0.5);
    seatBackR.rotation.x = -0.2;
    rightSeatGroup.add(seatBackR);
    rightSeatGroup.position.set(1.0, -1.4, -0.5);
    interiorGroup.add(rightSeatGroup);

    const mainConsoleShape = new THREE.Shape();
    mainConsoleShape.moveTo(-1.8, 0);
    mainConsoleShape.lineTo(1.8, 0);
    mainConsoleShape.lineTo(1.5, 1.2);
    mainConsoleShape.lineTo(-1.5, 1.2);
    mainConsoleShape.lineTo(-1.8, 0);
    const consoleGeom = new THREE.ExtrudeGeometry(mainConsoleShape, { depth: 0.2, bevelEnabled: true, bevelSize: 0.02 });
    const mainConsole = new THREE.Mesh(consoleGeom, darkSteel);
    mainConsole.position.set(0, -0.5, -2.5);
    mainConsole.rotation.x = -Math.PI / 5;
    interiorGroup.add(mainConsole);

    const interiorScreenMat = new THREE.MeshStandardMaterial({
        color: 0x002211,
        emissive: 0x00ffaa,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.2
    });
    
    meshes.screens = [];
    for (let i = -1.2; i <= 1.2; i += 0.8) {
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), interiorScreenMat);
        scr.position.set(i, 0.6, 0.21);
        mainConsole.add(scr);
        meshes.screens.push(scr);
    }

    for (let i of [-1.0, 1.0]) {
        const stickBase = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), chrome);
        stickBase.position.set(i, 0.2, 0.1);
        mainConsole.add(stickBase);

        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), darkSteel);
        stick.position.set(0, 0.2, 0);
        stickBase.add(stick);

        const handle = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), rubber);
        handle.position.set(0, 0.2, 0);
        stick.add(handle);
    }
    
    group.add(interiorGroup);

    parts.push({
        name: 'Command & Control Cabin',
        description: 'Pressurized interior environment featuring dual operator stations, life support monitors, and digital fly-by-wire navigational interfaces.',
        material: 'aluminum',
        function: 'Sustains human life for up to 96 hours and provides total control over vehicle subsystems.',
        assemblyOrder: 15,
        connections: ['Titanium Pressure Sphere', 'Life Support Scrubbers', 'Data Bus'],
        failureEffect: 'Loss of vehicle control and life support.',
        cascadeFailures: ['Crew asphyxiation', 'Total mission failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 15 }
    });

    const description = "The 'Abyssal Leviathan' Class Deep Sea Submersible. A pinnacle of modern marine engineering, designed to transport researchers to the hadal zone (up to 11,000 meters depth). Featuring a monolithic titanium pressure sphere, syntactic foam buoyancy, 7-function hydraulic manipulators, and a cutting-edge fly-by-wire propulsion array. Every component is engineered to withstand extreme hydrostatic pressures exceeding 16,000 PSI, allowing for unparalleled deep-ocean exploration, geological sampling, and biological research in the most hostile environment on Earth.";

    const quizQuestions = [
        {
            question: "Why is the main pressure sphere constructed from forged Titanium alloy rather than standard steel?",
            options: [
                "Titanium possesses a superior strength-to-weight ratio and exceptional corrosion resistance in saltwater.",
                "Titanium is cheaper to manufacture in spherical shapes.",
                "Titanium is naturally buoyant, helping the sub float.",
                "Titanium generates its own heat, keeping the cabin warm."
            ],
            correctAnswer: 0,
            explanation: "Titanium's incredible strength-to-weight ratio allows the hull to withstand massive deep-sea pressures without being overwhelmingly heavy, and it is highly resistant to corrosive seawater."
        },
        {
            question: "What is the primary function of the Syntactic Foam used in the Outer Hydrodynamic Fairing?",
            options: [
                "To absorb shock from colliding with underwater rocks.",
                "To provide positive buoyancy that offsets the massive weight of the titanium and steel components.",
                "To insulate the electronics from the cold water.",
                "To filter oxygen from the seawater."
            ],
            correctAnswer: 1,
            explanation: "Syntactic foam is filled with microscopic glass spheres, providing immense buoyancy while resisting the crushing pressures of the deep ocean."
        },
        {
            question: "How do the Electromagnetic Drop Weights act as a failsafe mechanism?",
            options: [
                "They explode to propel the submarine upward in an emergency.",
                "They require constant electrical power to stay attached; if power fails, they drop automatically, making the sub buoyant.",
                "They generate a magnetic field that repels the ocean floor.",
                "They dissolve in seawater after 96 hours."
            ],
            correctAnswer: 1,
            explanation: "In the event of a total power failure, the electromagnets turn off, dropping the heavy weights. This instantly increases the submersible's buoyancy, causing it to ascend to the surface safely."
        },
        {
            question: "What is the purpose of the truncated spherical shape of the massive Acrylic Viewport?",
            options: [
                "It distorts light to make objects appear larger.",
                "The spherical geometry evenly distributes the immense external hydrostatic pressure into the titanium retaining ring.",
                "It is easier to clean from the inside.",
                "It prevents marine life from attaching to the glass."
            ],
            correctAnswer: 1,
            explanation: "A sphere is the optimal shape for resisting external pressure. The acrylic viewport acts as a spherical wedge that presses tightly against the titanium frame, creating a seal that actually grows stronger as depth increases."
        },
        {
            question: "Why does the Aft Main Propulsion thruster utilize a 'Ducted Fan' configuration rather than an open propeller?",
            options: [
                "To make the submersible look more futuristic.",
                "To prevent the propeller blades from slicing into the titanium hull.",
                "To increase thrust efficiency at low speeds and protect the blades from striking debris or the sea floor.",
                "To create a loud acoustic signature to scare away large predators."
            ],
            correctAnswer: 2,
            explanation: "A ducted fan (Kort nozzle) accelerates water through a constrained cylinder, significantly improving thrust efficiency at the low speeds typical of deep-sea exploration, while also shielding the spinning blades."
        }
    ];

    const animate = (time, speed, meshesObj = meshes) => {
        if (meshesObj.mainBlades) {
            meshesObj.mainBlades.rotation.z += 0.2 * speed;
        }

        if (meshesObj.vBlades) {
            meshesObj.vBlades.forEach(bladeGroup => {
                bladeGroup.rotation.y += 0.25 * speed; 
            });
        }

        if (meshesObj.roboticBicep) {
            meshesObj.roboticBicep.rotation.x = Math.sin(time * 0.001 * speed) * 0.4 - 0.2;
            
            if (meshesObj.armPistonRod) {
                meshesObj.armPistonRod.position.y = -1.8 - (meshesObj.roboticBicep.rotation.x * 0.5);
            }
        }
        
        if (meshesObj.roboticForearm) {
            meshesObj.roboticForearm.rotation.x = Math.cos(time * 0.0015 * speed) * 0.5 + 0.5;
        }

        if (meshesObj.roboticWrist) {
            meshesObj.roboticWrist.rotation.y = time * 0.002 * speed;
            
            const clawOpen = (Math.sin(time * 0.003 * speed) + 1) / 2;
            if (meshesObj.leftClaw && meshesObj.rightClaw) {
                meshesObj.leftClaw.rotation.z = clawOpen * -0.5;
                meshesObj.rightClaw.rotation.z = clawOpen * 0.5;
            }
        }

        if (meshesObj.screens) {
            meshesObj.screens.forEach((scr, idx) => {
                const flicker = Math.random() > 0.9 ? 0.5 : 1.5;
                scr.material.emissiveIntensity = flicker * (1 + 0.2 * Math.sin(time * 0.005 + idx));
            });
        }

        if (meshesObj.searchLights) {
            meshesObj.searchLights.forEach((light, idx) => {
                light.material.emissiveIntensity = 2.0 + Math.sin(time * 0.002 * speed + idx) * 0.5;
            });
        }

        if (meshesObj.sonarDome) {
            meshesObj.sonarDome.rotation.y -= 0.05 * speed;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSubmersible() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
