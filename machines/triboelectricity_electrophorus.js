import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // CUSTOM MATERIALS & LIGHTING
    // -------------------------------------------------------------------------
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff1111,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x1111ff,
        emissive: 0x0000ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00ff66,
        emissive: 0x00ff66,
        emissiveIntensity: 1.5
    });

    const resinMat = new THREE.MeshPhysicalMaterial({
        color: 0x110022,
        emissive: 0x2a0050,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transmission: 0.2,
        thickness: 2.0
    });

    // -------------------------------------------------------------------------
    // MOBILE OFF-ROAD PLATFORM (CHASSIS & TIRES)
    // -------------------------------------------------------------------------
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);
    meshes.chassisGroup = chassisGroup;

    // Main Chassis Body
    const chassisGeom = new THREE.BoxGeometry(16, 2, 24);
    const chassisMesh = new THREE.Mesh(chassisGeom, darkSteel);
    chassisMesh.position.y = 3.3; // Elevate chassis above ground
    chassisGroup.add(chassisMesh);

    // Chassis details (rivets, panels, bumpers)
    const bumperGeom = new THREE.BoxGeometry(16.5, 2.5, 1);
    const frontBumper = new THREE.Mesh(bumperGeom, steel);
    frontBumper.position.set(0, 3.3, 12.5);
    chassisGroup.add(frontBumper);

    const rearBumper = new THREE.Mesh(bumperGeom, steel);
    rearBumper.position.set(0, 3.3, -12.5);
    chassisGroup.add(rearBumper);

    // Tire generation function
    function createTire() {
        const wheelGroup = new THREE.Group();
        
        // Rim
        const rimGeom = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 64);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.x = Math.PI / 2; 
        wheelGroup.add(rim);
        
        // Spokes
        const spokeGeom = new THREE.BoxGeometry(0.3, 3.6, 0.5); 
        for (let i = 0; i < 8; i++) {
            const spoke = new THREE.Mesh(spokeGeom, darkSteel);
            spoke.rotation.z = (i * Math.PI) / 8;
            wheelGroup.add(spoke);
        }
        
        // Tire Torus
        const tireGeom = new THREE.TorusGeometry(2.5, 1.0, 32, 100);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Aggressive Treads (hundreds of lugs)
        const lugGeom = new THREE.BoxGeometry(0.6, 0.4, 2.2); 
        for (let i = 0; i < 120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.x = Math.cos(angle) * 3.4;
            lug.position.y = Math.sin(angle) * 3.4;
            lug.rotation.z = angle;
            lug.rotation.x = (i % 2 === 0) ? 0.25 : -0.25; // Chevron pattern
            wheelGroup.add(lug);
        }
        return wheelGroup;
    }

    const wheels = [];
    const wheelPositions = [
        { x: 9, y: 3.3, z: 9 },
        { x: -9, y: 3.3, z: 9 },
        { x: 9, y: 3.3, z: -9 },
        { x: -9, y: 3.3, z: -9 }
    ];

    wheelPositions.forEach((pos) => {
        const tire = createTire();
        tire.position.set(pos.x, pos.y, pos.z);
        if(pos.x > 0) tire.rotation.y = Math.PI; // flip right side tires for symmetry
        chassisGroup.add(tire);
        wheels.push(tire);
    });
    meshes.wheels = wheels;

    // -------------------------------------------------------------------------
    // OPERATOR CABIN
    // -------------------------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 7.3, 7); 
    chassisGroup.add(cabinGroup);

    // Frame and core
    const cFloor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 6), darkSteel);
    cFloor.position.y = -2.9;
    cabinGroup.add(cFloor);

    const cRoof = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 6), steel);
    cRoof.position.y = 2.9;
    cabinGroup.add(cRoof);

    const cBack = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 0.2), steel);
    cBack.position.set(0, 0, -2.9);
    cabinGroup.add(cBack);

    // Dashboard & Controls
    const dash = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2, 1.5), plastic);
    dash.position.set(0, -1.8, 2);
    cabinGroup.add(dash);

    const wheelCol = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 16), darkSteel);
    wheelCol.rotation.x = -Math.PI / 4;
    wheelCol.position.set(-2, -1, 1.5);
    cabinGroup.add(wheelCol);

    const sWheel = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 32), rubber);
    sWheel.rotation.x = -Math.PI / 4;
    sWheel.position.set(-2, -0.6, 1.1);
    cabinGroup.add(sWheel);

    const joyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), steel);
    joyBase.position.set(2, -0.7, 1.5);
    dash.add(joyBase);
    
    const joyStick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16), chrome);
    joyStick.position.set(2, -0.3, 1.5);
    dash.add(joyStick);
    
    const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), neonRed);
    joyKnob.position.set(2, 0.1, 1.5);
    dash.add(joyKnob);

    // Data Screens
    const screen1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.1), screenMat);
    screen1.position.set(0, -1, 1.8);
    screen1.rotation.x = -0.2;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.1), screenMat);
    screen2.position.set(3, -1, 1.8);
    screen2.rotation.x = -0.2;
    cabinGroup.add(screen2);

    // Tinted Glass Windows
    const wFront = new THREE.Mesh(new THREE.BoxGeometry(7.8, 3.5, 0.1), tinted);
    wFront.position.set(0, 1, 2.9);
    cabinGroup.add(wFront);

    const wLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 5.6), tinted);
    wLeft.position.set(3.9, 1, 0);
    cabinGroup.add(wLeft);

    const wRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 5.6), tinted);
    wRight.position.set(-3.9, 1, 0);
    cabinGroup.add(wRight);

    // -------------------------------------------------------------------------
    // ELECTROPHORUS BASE & COMPONENTS
    // -------------------------------------------------------------------------
    const electroGroup = new THREE.Group();
    electroGroup.position.set(0, 4.3, -4); // Mounted on rear of chassis
    chassisGroup.add(electroGroup);

    // Foundation Lathe Geometry
    const basePts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(8, 0),
        new THREE.Vector2(8, 0.5),
        new THREE.Vector2(7.5, 0.8),
        new THREE.Vector2(7.5, 1.2),
        new THREE.Vector2(6.5, 1.5),
        new THREE.Vector2(6.5, 2.0),
        new THREE.Vector2(5.5, 2.0)
    ];
    const baseGeom = new THREE.LatheGeometry(basePts, 128);
    const basePedestal = new THREE.Mesh(baseGeom, darkSteel);
    electroGroup.add(basePedestal);

    // Resin Containment Ring
    const ringPts = [
        new THREE.Vector2(5.5, 2.0),
        new THREE.Vector2(5.8, 2.0),
        new THREE.Vector2(5.8, 3.5),
        new THREE.Vector2(5.5, 3.5)
    ];
    const ringGeom = new THREE.LatheGeometry(ringPts, 128);
    const containmentRing = new THREE.Mesh(ringGeom, aluminum);
    electroGroup.add(containmentRing);

    // Triboelectric Resin Cake
    const resinGeom = new THREE.CylinderGeometry(5.45, 5.45, 1.4, 128);
    const resinCake = new THREE.Mesh(resinGeom, resinMat);
    resinCake.position.y = 2.7; 
    electroGroup.add(resinCake);

    // Metal Induction Plate
    const platePts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(5.3, 0),
        new THREE.Vector2(5.4, 0.1),
        new THREE.Vector2(5.4, 0.3),
        new THREE.Vector2(5.2, 0.5),
        new THREE.Vector2(0, 0.5)
    ];
    const plateGeom = new THREE.LatheGeometry(platePts, 128);
    const metalPlate = new THREE.Mesh(plateGeom, chrome);
    metalPlate.position.y = 3.5; // Rest position on resin
    electroGroup.add(metalPlate);
    meshes.metalPlate = metalPlate;

    // Target node for spark tracking
    const targetNode = new THREE.Object3D();
    targetNode.position.set(0, 0.25, -5.4); // Edge of metal plate
    metalPlate.add(targetNode);
    meshes.targetNode = targetNode;

    // Insulating Glass Handle
    const glassShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 4, 32), glass);
    glassShaft.position.y = 2.5; 
    metalPlate.add(glassShaft);

    // Rubber Safety Grip
    const rubberGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), rubber);
    rubberGrip.position.y = 1.25; 
    glassShaft.add(rubberGrip);

    // -------------------------------------------------------------------------
    // HYDRAULIC LIFTER SYSTEM (Automated Separation)
    // -------------------------------------------------------------------------
    const lifterGroup = new THREE.Group();
    electroGroup.add(lifterGroup);
    const lifterPistons = [];

    for(let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        
        // Outer Cylinder
        const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32), darkSteel);
        pistonOuter.position.set(Math.cos(angle)*6.5, 1.25, Math.sin(angle)*6.5);
        lifterGroup.add(pistonOuter);
        
        // Inner Chrome Piston
        const pistonInner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 32), chrome);
        pistonInner.position.set(0, 1.25, 0); 
        pistonOuter.add(pistonInner);
        lifterPistons.push(pistonInner);
        
        // Connecting bracket to the metal plate
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.6), steel);
        bracket.position.set(-Math.cos(angle)*0.8, 1.15, -Math.sin(angle)*0.8);
        bracket.rotation.y = -angle; 
        pistonInner.add(bracket);
    }
    meshes.lifterPistons = lifterPistons;

    // -------------------------------------------------------------------------
    // AUTOMATED SECONDARY GROUNDING PIN
    // -------------------------------------------------------------------------
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, 0, 3);
    electroGroup.add(pinGroup);

    const pinBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.0, 0.8), darkSteel);
    pinBase.position.y = 1.0;
    pinGroup.add(pinBase);

    const pinRod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 16), copper);
    // Offset geometry so scaling affects the top end
    pinRod.geometry.translate(0, 0.5, 0);
    pinRod.position.y = 2.0; 
    pinGroup.add(pinRod);
    meshes.pinRod = pinRod;

    // -------------------------------------------------------------------------
    // ROBOTIC SPARK DISCHARGE ARM
    // -------------------------------------------------------------------------
    const armGroup = new THREE.Group();
    armGroup.position.set(-6, 2.0, -8); // Position relative to electroGroup
    electroGroup.add(armGroup);

    const armBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 2, 32), steel);
    armBase.position.y = 1.0;
    armGroup.add(armBase);

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), darkSteel);
    shoulder.position.y = 2.5;
    armGroup.add(shoulder);
    meshes.shoulder = shoulder;

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 32), chrome);
    bicep.position.y = 2.0; 
    shoulder.add(bicep);

    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), steel);
    elbow.position.y = 2.0; 
    bicep.add(elbow);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4, 32), chrome);
    forearm.rotation.x = -Math.PI / 2; // Point forward from elbow
    forearm.position.set(0, 0, 2);
    elbow.add(forearm);

    const probeTip = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), copper);
    probeTip.position.y = 2.0;
    forearm.add(probeTip);
    meshes.probeTip = probeTip;

    // Spark Lighting Effect
    const sparkLight = new THREE.PointLight(0x00ffff, 0, 20);
    probeTip.add(sparkLight);
    meshes.sparkLight = sparkLight;

    // -------------------------------------------------------------------------
    // HIGH-VOLTAGE SPARK GEOMETRY (DYNAMIC LINES)
    // -------------------------------------------------------------------------
    const sparkLines = [];
    const sparkMat = new THREE.LineBasicMaterial({ color: 0xaaffff, linewidth: 2 });
    for(let i=0; i<3; i++) {
        const sparkGeom = new THREE.BufferGeometry();
        const sparkPos = new Float32Array(20 * 3);
        sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
        const sLine = new THREE.Line(sparkGeom, sparkMat);
        sLine.visible = false;
        group.add(sLine); // add to top group for world coordinates
        sparkLines.push(sLine);
    }
    meshes.sparkLines = sparkLines;

    // -------------------------------------------------------------------------
    // CHARGE VISUALIZATION PARTICLE SYSTEM
    // -------------------------------------------------------------------------
    const chargeGroup = new THREE.Group();
    electroGroup.add(chargeGroup);

    const resinCharges = [];
    const platePosCharges = [];
    const plateNegCharges = [];

    const pGeom = new THREE.SphereGeometry(0.12, 8, 8);

    // Negative charges stuck to resin
    for(let i=0; i<80; i++) {
        const c = new THREE.Mesh(pGeom, neonBlue);
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 5.2;
        c.position.set(Math.cos(a)*r, 3.4, Math.sin(a)*r);
        chargeGroup.add(c);
        resinCharges.push(c);
    }

    // Positive charges on plate
    for(let i=0; i<60; i++) {
        const c = new THREE.Mesh(pGeom, neonRed);
        chargeGroup.add(c);
        platePosCharges.push(c);
    }

    // Negative charges on plate top (polarized)
    for(let i=0; i<60; i++) {
        const c = new THREE.Mesh(pGeom, neonBlue);
        chargeGroup.add(c);
        plateNegCharges.push(c);
    }

    meshes.platePosCharges = platePosCharges;
    meshes.plateNegCharges = plateNegCharges;

    // -------------------------------------------------------------------------
    // HYDRAULIC PIPES & CABLING (CatmullRom curves)
    // -------------------------------------------------------------------------
    const pipePoints = [
        new THREE.Vector3(-6, 2, -8),
        new THREE.Vector3(-8, 1.5, -6),
        new THREE.Vector3(-8, 1, 0),
        new THREE.Vector3(-4, 0.5, 4),
        new THREE.Vector3(0, 0, 7) // Into cabin floor
    ];
    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);
    const pipeGeom = new THREE.TubeGeometry(pipeCurve, 64, 0.15, 8, false);
    const mainPipe = new THREE.Mesh(pipeGeom, rubber);
    electroGroup.add(mainPipe);

    // -------------------------------------------------------------------------
    // PARTS DICTIONARY
    // -------------------------------------------------------------------------
    parts.push(
        {
            name: 'Heavy-Duty Mobile Chassis',
            description: 'A multi-axle structural frame forged from dark steel, providing immense stability for the mobile electrophorus array during operation and transport.',
            material: 'Dark Steel',
            function: 'Foundation',
            assemblyOrder: 1,
            connections: ['Off-Road Tires', 'Operator Cabin', 'Electrophorus Base'],
            failureEffect: 'Complete structural collapse and misalignment of electrostatic components.',
            cascadeFailures: ['Resin fracture', 'Spark misfire'],
            originalPosition: { x: 0, y: 3.3, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 0 }
        },
        {
            name: 'Off-Road Multi-Terrain Tires',
            description: 'Massive Torus-geometry tires outfitted with hundreds of extruded BoxGeometry chevrons for extreme grip. Designed to carry the immense weight of the apparatus.',
            material: 'Rubber and Chrome',
            function: 'Mobility',
            assemblyOrder: 2,
            connections: ['Heavy-Duty Mobile Chassis'],
            failureEffect: 'Immobilization of the vehicle.',
            cascadeFailures: [],
            originalPosition: { x: 9, y: 3.3, z: 9 },
            explodedPosition: { x: 15, y: 3.3, z: 15 }
        },
        {
            name: 'Operator Command Cabin',
            description: 'A fortified enclosure with tinted, shielded glass, featuring glowing data-screens, joysticks, and a steering column to remotely control the high-voltage experiments.',
            material: 'Steel, Plastic, Tinted Glass',
            function: 'Control & Safety',
            assemblyOrder: 3,
            connections: ['Heavy-Duty Mobile Chassis'],
            failureEffect: 'Loss of precise control over the induction sequence.',
            cascadeFailures: ['Lifter synchronization failure'],
            originalPosition: { x: 0, y: 10.6, z: 7 },
            explodedPosition: { x: 0, y: 15, z: 12 }
        },
        {
            name: 'Dielectric Base Pedestal',
            description: 'Complex LatheGeometry foundation constructed to completely insulate the triboelectric resin from the vehicle chassis, preventing premature grounding.',
            material: 'Dark Steel',
            function: 'Insulation & Support',
            assemblyOrder: 4,
            connections: ['Heavy-Duty Mobile Chassis', 'Triboelectric Resin Cake'],
            failureEffect: 'Charge leakage into the vehicle frame.',
            cascadeFailures: ['Operator electrocution hazard', 'Zero net charge separation'],
            originalPosition: { x: 0, y: 7.6, z: -4 },
            explodedPosition: { x: 0, y: 10, z: -10 }
        },
        {
            name: 'Triboelectric Resin Cake',
            description: 'A synthetic, ultra-dense dielectric disc formulated to hold a massive, persistent negative static charge for electrostatic induction.',
            material: 'Custom Purple Poly-Resin',
            function: 'Primary Charge Reservoir',
            assemblyOrder: 5,
            connections: ['Dielectric Base Pedestal', 'Metal Induction Plate'],
            failureEffect: 'Inability to generate initial static field.',
            cascadeFailures: ['Total system failure'],
            originalPosition: { x: 0, y: 10.3, z: -4 },
            explodedPosition: { x: 0, y: 15, z: -4 }
        },
        {
            name: 'Metal Induction Plate',
            description: 'A highly polished chrome disc acting as the active electrophorus element. Electrons on its surface redistribute due to the resin\'s electric field.',
            material: 'Chrome',
            function: 'Charge Separation Carrier',
            assemblyOrder: 6,
            connections: ['Hydraulic Lift Actuators', 'Insulating Handle'],
            failureEffect: 'Inability to carry separated charge.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 11.1, z: -4 },
            explodedPosition: { x: 0, y: 20, z: -4 }
        },
        {
            name: 'Automated Grounding Pin',
            description: 'A rapidly extending copper rod that briefly taps the grounded top of the metal plate, siphoning off repelled electrons to leave the plate positively charged.',
            material: 'Copper and Dark Steel',
            function: 'Electron Drainage',
            assemblyOrder: 7,
            connections: ['Dielectric Base Pedestal'],
            failureEffect: 'Plate remains neutrally charged upon lifting.',
            cascadeFailures: ['No spark generation'],
            originalPosition: { x: 0, y: 9.6, z: -1 },
            explodedPosition: { x: 0, y: 9.6, z: 5 }
        },
        {
            name: 'Hydraulic Lift Actuators',
            description: 'A synchronized array of three heavy-duty telescoping pistons that separate the metal plate from the resin cake against immense electrostatic attraction.',
            material: 'Dark Steel and Chrome',
            function: 'Mechanical Work & Charge Isolation',
            assemblyOrder: 8,
            connections: ['Metal Induction Plate', 'Dielectric Base Pedestal'],
            failureEffect: 'Plate cannot be lifted; potential energy is not increased.',
            cascadeFailures: ['Stalled operational cycle'],
            originalPosition: { x: 0, y: 8.8, z: -4 },
            explodedPosition: { x: -8, y: 8.8, z: -8 }
        },
        {
            name: 'Robotic Discharge Arm',
            description: 'An articulated appendage with shoulder and elbow joints, designed to swing precisely into position to receive the massive positive high-voltage discharge.',
            material: 'Steel and Chrome',
            function: 'Grounding / Spark Target',
            assemblyOrder: 9,
            connections: ['Dielectric Base Pedestal'],
            failureEffect: 'Uncontrolled arcing to surrounding machinery.',
            cascadeFailures: ['Avionics and control system fry'],
            originalPosition: { x: -6, y: 9.6, z: -12 },
            explodedPosition: { x: -12, y: 12, z: -16 }
        },
        {
            name: 'Primary Spark Emitter Probe',
            description: 'A spherical copper node at the tip of the discharge arm, specifically engineered to trigger atmospheric dielectric breakdown (sparking) at optimal ranges.',
            material: 'Copper',
            function: 'Arc Focus',
            assemblyOrder: 10,
            connections: ['Robotic Discharge Arm'],
            failureEffect: 'Diffuse corona discharge instead of a clean spark.',
            cascadeFailures: [],
            originalPosition: { x: -6, y: 14.1, z: -10 },
            explodedPosition: { x: -12, y: 18, z: -12 }
        },
        {
            name: 'High-Voltage Isolation Shaft',
            description: 'A robust cylinder of high-index glass providing absolute dielectric isolation between the operator/lifting mechanisms and the highly charged metal plate.',
            material: 'Glass',
            function: 'Insulation',
            assemblyOrder: 11,
            connections: ['Metal Induction Plate', 'Safety Grip'],
            failureEffect: 'Charge leakage during the lifting phase.',
            cascadeFailures: ['Spark failure'],
            originalPosition: { x: 0, y: 13.6, z: -4 },
            explodedPosition: { x: 0, y: 25, z: -4 }
        },
        {
            name: 'Charge Visualization Field System',
            description: 'Holographic projectors mounted around the rim that trace ambient electrical fields, rendering invisible positive (Red) and negative (Blue) charges as glowing spheres.',
            material: 'Photon Emitters (Neon)',
            function: 'Scientific Diagnostics',
            assemblyOrder: 12,
            connections: ['Dielectric Base Pedestal'],
            failureEffect: 'Loss of visual telemetry regarding charge state.',
            cascadeFailures: [],
            originalPosition: { x: 0, y: 11, z: -4 },
            explodedPosition: { x: 0, y: 11, z: -4 }
        },
        {
            name: 'Hydraulic Routing Cables',
            description: 'Complex CatmullRom curves of rubber tubing transferring high-pressure fluid from the chassis pumps to the lifting pistons.',
            material: 'Rubber',
            function: 'Power Transmission',
            assemblyOrder: 13,
            connections: ['Hydraulic Lift Actuators', 'Heavy-Duty Mobile Chassis'],
            failureEffect: 'Fluid leak leading to actuator paralysis.',
            cascadeFailures: ['Inability to lift metal plate'],
            originalPosition: { x: -4, y: 7, z: 0 },
            explodedPosition: { x: -10, y: 7, z: 0 }
        },
        {
            name: 'Containment Ring Guards',
            description: 'Aluminum lathe geometry shaping the electric field and keeping the resin cake securely centered during rough off-road transport.',
            material: 'Aluminum',
            function: 'Structural Integrity',
            assemblyOrder: 14,
            connections: ['Dielectric Base Pedestal'],
            failureEffect: 'Resin cake shifts off center.',
            cascadeFailures: ['Plate misalignment'],
            originalPosition: { x: 0, y: 9.6, z: -4 },
            explodedPosition: { x: 0, y: 9.6, z: 0 }
        },
        {
            name: 'Steering & Data Dashboard',
            description: 'Internal console within the cabin processing telemetry from the visualization system, driving the robotic actuators, and steering the wheels.',
            material: 'Plastic and Steel',
            function: 'Central Processing',
            assemblyOrder: 15,
            connections: ['Operator Command Cabin'],
            failureEffect: 'Complete loss of automated sequencing.',
            cascadeFailures: ['System freeze'],
            originalPosition: { x: 0, y: 8.8, z: 9 },
            explodedPosition: { x: 0, y: 8.8, z: 15 }
        }
    );

    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the primary charging phase, the triboelectric resin cake is charged. What polarity does it acquire, and how does it affect the neutral metal plate placed atop it?",
            options: [
                "It acquires a negative charge; it repels electrons in the metal plate to the top surface (Induction).",
                "It acquires a positive charge; it attracts electrons in the metal plate to the bottom surface.",
                "It remains neutral; friction from the plate passing over it generates alternating currents.",
                "It acquires a negative charge; it conducts electrons directly into the metal plate."
            ],
            correctAnswer: 0,
            explanation: "The resin cake acts as a dielectric holding a persistent negative charge. When the neutral metal plate is placed on it, electrostatic induction repels the free electrons in the metal to the top surface, while the bottom surface becomes net positive."
        },
        {
            question: "What is the critical function of the Automated Grounding Pin during the brief moment it touches the top of the metal plate?",
            options: [
                "It provides a path for the repelled electrons on the top surface to escape to ground, leaving the plate positively charged.",
                "It injects additional electrons into the plate to maximize the negative charge.",
                "It measures the voltage of the plate before the robotic arm swings in.",
                "It physically secures the plate to the resin cake."
            ],
            correctAnswer: 0,
            explanation: "By grounding the top of the plate, the electrons that were repelled by the negative resin cake are able to escape to the earth. When the pin retracts, the plate is left with a deficit of electrons, making it highly positively charged."
        },
        {
            question: "Why does lifting the positively charged metal plate away from the negative resin cake result in a massive increase in electrical potential (voltage)?",
            options: [
                "Mechanical work is being done against the electrostatic attractive force, converting mechanical energy into electrical potential energy.",
                "The hydraulic pistons generate static electricity through friction as they extend.",
                "Air friction on the metal plate strips away more electrons.",
                "Moving away from the Earth's magnetic field increases the voltage."
            ],
            correctAnswer: 0,
            explanation: "The positive plate and negative resin attract each other. Pulling them apart requires mechanical work, which is stored in the electric field between them. Since Voltage = Potential Energy / Charge, and the charge is constant, the voltage spikes dramatically."
        },
        {
            question: "During the final phase of the cycle, the Robotic Discharge Arm swings close to the metal plate. What causes the brilliant high-voltage spark?",
            options: [
                "Dielectric breakdown of the air: the immense electric field ionizes the air molecules, creating a conductive plasma channel for electrons to rush to the plate.",
                "The mechanical collision between the copper probe and the chrome plate generates thermal sparks.",
                "The holographic projectors converge their lasers into a single point, igniting the air.",
                "Hydraulic fluid leaking from the pipes is ignited by static electricity."
            ],
            correctAnswer: 0,
            explanation: "As the grounded probe approaches the highly positive plate, the electric field strength exceeds the dielectric strength of air (~3 million volts per meter). The air ionizes into a conductive plasma, allowing electrons to jump across the gap in a brilliant spark."
        },
        {
            question: "Based on the holographic Charge Visualization Field, how do the colored particles behave when the plate is fully lifted?",
            options: [
                "The blue (negative) particles on the plate have disappeared via the grounding pin, and the red (positive) particles spread evenly across the plate.",
                "Red particles fly down to the resin cake to neutralize it.",
                "Blue and red particles rapidly mix on the plate surface.",
                "Both red and blue particles remain tightly clustered on the bottom of the plate."
            ],
            correctAnswer: 0,
            explanation: "Because the grounding pin removed the negative electrons, only the positive charges (visualized as red) remain. Once lifted away from the localized negative influence of the resin, these positive charges naturally repel each other and distribute evenly across the conductive metal plate."
        }
    ];

    const description = "The Triboelectric Electrophorus Array is a massive, hyper-realistic, self-driving electrostatic induction platform. Mounted on an off-road chassis with aggressive treads and a detailed operator cabin, the core mechanism automates the classic electrophorus experiment. A persistent negative charge on the heavy dielectric resin cake induces charge separation in the chrome plate. An automated grounding pin siphons off electrons. Powerful hydraulic pistons then perform mechanical work by ripping the positively charged plate away from the resin, scaling the voltage to extreme levels. Finally, a robotic arm swings in to trigger a massive, crackling electrostatic discharge. Real-time holographic particles visualize the invisible transfer of positive and negative charges throughout the cycle.";

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    const animate = (time, speed = 1) => {
        // Vehicle vibration and idle movement
        meshes.chassisGroup.position.y = Math.sin(time * 30) * 0.01;
        
        // Cycle time: 10 seconds
        const t = (time * speed) % 10;
        
        let plateYOffset = 0;
        let groundPinExt = 0;
        let armRot = 0;
        let showSpark = false;

        // Phase 1: Resting & Polarization (0 - 1)
        // Phase 2: Grounding Pin touches to drain electrons (1 - 2)
        if (t >= 1.0 && t < 1.3) {
            groundPinExt = (t - 1.0) / 0.3; // 0 to 1
        } else if (t >= 1.3 && t < 1.7) {
            groundPinExt = 1;
        } else if (t >= 1.7 && t < 2.0) {
            groundPinExt = 1 - (t - 1.7) / 0.3;
        }
        
        // Apply pin extension (scales Y)
        // Normal height is 1. We need it to reach Y=3.5. Distance is 2.5.
        meshes.pinRod.scale.y = 1 + (groundPinExt * 1.5);

        // Phase 3: Lift plate (2 - 4)
        if (t >= 2.0 && t < 4.0) {
            plateYOffset = ((t - 2.0) / 2.0) * 3.5; 
        } else if (t >= 4.0 && t < 7.0) {
            plateYOffset = 3.5;
        } else if (t >= 7.0 && t < 9.0) {
            plateYOffset = 3.5 - ((t - 7.0) / 2.0) * 3.5;
        }

        // Apply plate and lifter offsets
        meshes.metalPlate.position.y = 3.5 + plateYOffset;
        meshes.lifterPistons.forEach(p => {
            p.position.y = 1.25 + plateYOffset;
        });

        // Phase 4: Robotic Arm Swings In (4 - 5)
        if (t >= 4.0 && t < 5.0) {
            armRot = ((t - 4.0) / 1.0) * (Math.PI / 2);
        } else if (t >= 5.0 && t < 6.0) {
            armRot = Math.PI / 2;
        } else if (t >= 6.0 && t < 7.0) {
            armRot = (Math.PI / 2) - ((t - 6.0) / 1.0) * (Math.PI / 2);
        }
        meshes.shoulder.rotation.y = armRot;

        // Phase 5: SPARK! (5 - 6)
        if (t >= 5.0 && t < 6.0 && Math.random() > 0.3) {
            showSpark = true;
            meshes.sparkLight.intensity = Math.random() * 10 + 5;
            
            const probePos = new THREE.Vector3();
            meshes.probeTip.getWorldPosition(probePos);
            
            const platePos = new THREE.Vector3();
            meshes.targetNode.getWorldPosition(platePos);
            
            meshes.sparkLines.forEach((line) => {
                line.visible = true;
                const posAttr = line.geometry.attributes.position;
                const positions = posAttr.array;
                
                for(let i=0; i<20; i++) {
                    const alpha = i / 19;
                    const p = new THREE.Vector3().lerpVectors(probePos, platePos, alpha);
                    if (i > 0 && i < 19) {
                        p.x += (Math.random() - 0.5) * 1.5;
                        p.y += (Math.random() - 0.5) * 1.5;
                        p.z += (Math.random() - 0.5) * 1.5;
                    }
                    positions[i*3] = p.x;
                    positions[i*3+1] = p.y;
                    positions[i*3+2] = p.z;
                }
                posAttr.needsUpdate = true;
            });
        } else {
            showSpark = false;
            meshes.sparkLight.intensity = 0;
            meshes.sparkLines.forEach(l => l.visible = false);
        }

        // Particle System Updates
        const pCenterY = 3.5 + plateYOffset;
        
        // Positive charges remain on plate
        meshes.platePosCharges.forEach((c, i) => {
            // Spread evenly based on offset
            const spread = 1.0 + (plateYOffset * 0.5); 
            const angle = (i / 60) * Math.PI * 2 + time * 0.5;
            const r = (1 + Math.sin(i * 999)) * spread;
            c.position.set(Math.cos(angle)*r, pCenterY - 0.1, Math.sin(angle)*r);
        });

        // Negative charges on plate (drain during pin touch)
        meshes.plateNegCharges.forEach((c, i) => {
            if (t < 1.0) {
                // Polarized to top
                c.visible = true;
                const angle = (i / 60) * Math.PI * 2 - time * 0.5;
                const r = (1 + Math.cos(i * 777)) * 2;
                c.position.set(Math.cos(angle)*r, pCenterY + 0.6, Math.sin(angle)*r);
            } else if (t >= 1.0 && t < 1.5) {
                // Draining to pin at center (0, y, 3)
                const prog = (t - 1.0) / 0.5;
                const startX = Math.cos((i/60)*Math.PI*2 - (1.0)*0.5) * ((1+Math.cos(i*777))*2);
                const startZ = Math.sin((i/60)*Math.PI*2 - (1.0)*0.5) * ((1+Math.cos(i*777))*2);
                const startY = pCenterY + 0.6;
                
                const pinX = 0, pinZ = 3, pinY = 4.3; // Base of pin
                
                if (prog < 0.5) {
                    // move to pin top
                    const p = prog * 2;
                    c.position.set(
                        startX * (1-p) + pinX * p,
                        startY,
                        startZ * (1-p) + pinZ * p
                    );
                } else {
                    // move down pin
                    const p = (prog - 0.5) * 2;
                    c.position.set(pinX, startY * (1-p) + pinY * p, pinZ);
                }
            } else if (t >= 1.5 && t < 5.5) {
                c.visible = false;
            } else if (t >= 5.5 && t < 7.0) {
                c.visible = false; // Stay drained until reset
            } else {
                c.visible = true; // reset
                const angle = (i / 60) * Math.PI * 2 - time * 0.5;
                const r = (1 + Math.cos(i * 777)) * 2;
                c.position.set(Math.cos(angle)*r, pCenterY + 0.6, Math.sin(angle)*r);
            }
        });
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createElectrophorus() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
