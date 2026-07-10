import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- CUSTOM HYPER-REALISTIC MATERIALS --- //
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5, roughness: 0.2, metalness: 0.8 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 2.0, roughness: 0.3, metalness: 0.7 });
    const carbonFiber = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.7, metalness: 0.6, wireframe: false });
    const titanium = chrome;
    const blackMetal = darkSteel;
    const goldPin = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 1.0 });
    const myomerMat = new THREE.MeshStandardMaterial({ color: 0x880000, roughness: 0.9, wireframe: true });

    // --- UTILITY GEOMETRY GENERATORS --- //
    const createMicroController = () => {
        const boardGroup = new THREE.Group();
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 1.8), new THREE.MeshStandardMaterial({color: 0x003300, roughness: 0.9}));
        boardGroup.add(pcb);
        
        for(let i=0; i<5; i++) {
            for(let j=0; j<8; j++) {
                const chip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.12), blackMetal);
                chip.position.set(-0.45 + (i*0.22), 0.04, -0.7 + (j*0.2));
                boardGroup.add(chip);
            }
        }
        
        for(let k=0; k<4; k++) {
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16), aluminum);
            cap.position.set(0.4, 0.15, -0.6 + (k*0.4));
            boardGroup.add(cap);
        }
        return boardGroup;
    };

    const createComplexServo = () => {
        const servoGroup = new THREE.Group();
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32), blackMetal);
        housing.rotation.z = Math.PI / 2;
        servoGroup.add(housing);

        for(let i=0; i<16; i++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.8), aluminum);
            fin.rotation.x = (i / 16) * Math.PI * 2;
            servoGroup.add(fin);
        }

        const gearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32), titanium);
        gearHub.position.x = 0.9;
        gearHub.rotation.z = Math.PI / 2;
        servoGroup.add(gearHub);
        
        const gears = [];
        for(let i=0; i<6; i++) {
            const planetaryGear = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16), steel);
            const angle = (i / 6) * Math.PI * 2;
            planetaryGear.position.set(0.9, Math.cos(angle)*0.55, Math.sin(angle)*0.55);
            planetaryGear.rotation.z = Math.PI / 2;
            servoGroup.add(planetaryGear);
            gears.push(planetaryGear);
        }
        
        return { root: servoGroup, gears: gears };
    };

    const createHydraulicActuator = (length, radius) => {
        const actuatorGroup = new THREE.Group();
        
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 32), blackMetal);
        cylinder.position.y = length / 2;
        actuatorGroup.add(cylinder);

        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(radius+0.08, 0.2, 0),
            new THREE.Vector3(radius+0.15, length/2, 0),
            new THREE.Vector3(radius+0.08, length-0.2, 0)
        ]);
        const line = new THREE.Mesh(new THREE.TubeGeometry(lineCurve, 32, 0.04, 8, false), rubber);
        actuatorGroup.add(line);

        const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.6, radius*0.6, length*1.2, 32), chrome);
        rod.position.y = length;
        actuatorGroup.add(rod);

        const hookBottom = new THREE.Mesh(new THREE.TorusGeometry(radius*0.8, 0.12, 16, 32), steel);
        hookBottom.position.y = 0;
        actuatorGroup.add(hookBottom);

        const hookTop = new THREE.Mesh(new THREE.TorusGeometry(radius*0.8, 0.12, 16, 32), steel);
        hookTop.position.y = length * 0.6; 
        rod.add(hookTop);

        return { group: actuatorGroup, rod: rod };
    };

    const createArticulatedDigit = (scale, isThumb) => {
        const fingerGroup = new THREE.Group();
        
        const proxLen = 1.6 * scale;
        const prox = new THREE.Mesh(new THREE.CylinderGeometry(0.2*scale, 0.16*scale, proxLen, 32), titanium);
        prox.position.y = proxLen / 2;
        fingerGroup.add(prox);
        
        const proxJoint = new THREE.Mesh(new THREE.SphereGeometry(0.25*scale, 32, 32), blackMetal);
        proxJoint.position.y = proxLen;
        fingerGroup.add(proxJoint);

        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, proxLen, 8), copper);
        wire.position.set(0.18*scale, proxLen/2, 0);
        fingerGroup.add(wire);
        
        const midGroup = new THREE.Group();
        midGroup.position.y = proxLen;
        const midLen = 1.2 * scale;
        const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.16*scale, 0.12*scale, midLen, 32), titanium);
        mid.position.y = midLen / 2;
        midGroup.add(mid);
        
        const midJoint = new THREE.Mesh(new THREE.SphereGeometry(0.2*scale, 32, 32), blackMetal);
        midJoint.position.y = midLen;
        midGroup.add(midJoint);
        fingerGroup.add(midGroup);
        
        const distGroup = new THREE.Group();
        distGroup.position.y = midLen;
        const distLen = 1.0 * scale;
        
        const clawShape = new THREE.Shape();
        clawShape.moveTo(0, 0);
        clawShape.lineTo(0.12*scale, distLen*0.5);
        clawShape.quadraticCurveTo(0.06*scale, distLen, 0, distLen);
        clawShape.quadraticCurveTo(-0.06*scale, distLen, -0.12*scale, distLen*0.5);
        clawShape.lineTo(0, 0);
        const claw = new THREE.Mesh(new THREE.ExtrudeGeometry(clawShape, {depth: 0.12*scale, bevelEnabled:true, bevelSize:0.02}), chrome);
        claw.position.set(0, 0, -0.06*scale);
        distGroup.add(claw);
        
        midGroup.add(distGroup);
        
        return { root: fingerGroup, mid: midGroup, dist: distGroup };
    };

    // --- 1. Cortical Clavicle Mount ---
    const baseGroup = new THREE.Group();
    const basePoints = [];
    for (let i = 0; i <= 15; i++) {
        basePoints.push(new THREE.Vector2(Math.sin(i * 0.15) * 2.5 + 1, (i - 7) * 0.4));
    }
    const basePlate = new THREE.Mesh(new THREE.LatheGeometry(basePoints, 64), carbonFiber);
    basePlate.rotation.x = Math.PI / 2;
    baseGroup.add(basePlate);

    const neuralSocket = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.25, 32, 64), neonCyan);
    neuralSocket.position.z = 1.2;
    baseGroup.add(neuralSocket);
    
    for(let i=0; i<32; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 16), goldPin);
        const angle = (i/32)*Math.PI*2;
        pin.position.set(Math.cos(angle)*1.4, Math.sin(angle)*1.4, 1.5);
        pin.rotation.x = Math.PI / 2;
        baseGroup.add(pin);
    }

    baseGroup.position.set(0, 22, 0);
    group.add(baseGroup);
    meshes.base = baseGroup;
    parts.push({
        name: "Cortical Clavicle Mount",
        description: "Carbon-fiber lathed baseplate with 32 gold neural pins interfacing directly with the user's peripheral nervous system.",
        material: "Carbon Fiber & Gold",
        function: "Structural Anchoring & Neural Telemetry",
        assemblyOrder: 1,
        connections: ["Shoulder Omni-Joint"],
        failureEffect: "Complete decoupling of bionic limb and catastrophic neural feedback.",
        cascadeFailures: ["Sensory overload", "Loss of all motor functions"],
        originalPosition: { x: 0, y: 22, z: 0 },
        explodedPosition: { x: -10, y: 26, z: -5 }
    });

    // --- 2. Tri-Servo Omni-Joint (Shoulder) ---
    const shoulderGroup = new THREE.Group();
    const shoulderSphere = new THREE.Mesh(new THREE.SphereGeometry(2.6, 64, 64), blackMetal);
    shoulderGroup.add(shoulderSphere);

    const servo1 = createComplexServo();
    servo1.root.position.set(2.6, 0, 0);
    shoulderGroup.add(servo1.root);
    
    const servo2 = createComplexServo();
    servo2.root.position.set(-1.3, 2.25, 0);
    servo2.root.rotation.z = Math.PI*2/3;
    shoulderGroup.add(servo2.root);
    
    const servo3 = createComplexServo();
    servo3.root.position.set(-1.3, -2.25, 0);
    servo3.root.rotation.z = -Math.PI*2/3;
    shoulderGroup.add(servo3.root);

    shoulderGroup.position.set(0, 17, 0);
    group.add(shoulderGroup);
    meshes.shoulder = shoulderGroup;
    meshes.shoulderServos = [servo1, servo2, servo3];
    parts.push({
        name: "Tri-Servo Omni-Joint",
        description: "A massively reinforced spherical joint driven by three independent planetary gear servos for unprecedented rotational torque.",
        material: "Titanium & Dark Steel",
        function: "360-Degree Shoulder Articulation",
        assemblyOrder: 2,
        connections: ["Cortical Clavicle Mount", "Humerus Core"],
        failureEffect: "Limb hangs limply from the mount.",
        cascadeFailures: ["Servo burnout", "Gear stripping under high load"],
        originalPosition: { x: 0, y: 17, z: 0 },
        explodedPosition: { x: 10, y: 19, z: 5 }
    });

    // --- 3. Humerus Core & Myomers ---
    const upperArmGroup = new THREE.Group();
    const humerus = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.75, 8, 64), titanium);
    humerus.position.y = -4;
    upperArmGroup.add(humerus);

    for(let i=0; i<20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(i*Math.PI/10)*1.4, 0, Math.sin(i*Math.PI/10)*1.4),
            new THREE.Vector3(Math.cos((i+5)*Math.PI/10)*1.8, -4, Math.sin((i+5)*Math.PI/10)*1.8),
            new THREE.Vector3(Math.cos((i+10)*Math.PI/10)*1.2, -8, Math.sin((i+10)*Math.PI/10)*1.2)
        ]);
        const myomer = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.18, 12, false), myomerMat);
        upperArmGroup.add(myomer);
    }
    
    for(let i=0; i<6; i++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 8, 16), glass);
        pipe.position.set(Math.cos(i*Math.PI/3)*1.0, -4, Math.sin(i*Math.PI/3)*1.0);
        upperArmGroup.add(pipe);
        
        const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8, 16), neonCyan);
        fluid.position.copy(pipe.position);
        upperArmGroup.add(fluid);
    }

    upperArmGroup.position.set(0, 17, 0);
    group.add(upperArmGroup);
    meshes.upperArm = upperArmGroup;
    parts.push({
        name: "Humerus Core & Myomer Matrix",
        description: "Titanium central bone woven with electro-reactive synthetic muscle fibers. Coolant pipes regulate thermal output during heavy lifting.",
        material: "Titanium, Synthetic Polymers, Glass",
        function: "Bicep/Tricep Strength Simulation & Thermal Regulation",
        assemblyOrder: 3,
        connections: ["Tri-Servo Omni-Joint", "Planetary Elbow Drive"],
        failureEffect: "Inability to flex the elbow or lift loads.",
        cascadeFailures: ["Coolant leak leading to myomer melting"],
        originalPosition: { x: 0, y: 17, z: 0 },
        explodedPosition: { x: 0, y: 13, z: -12 }
    });

    // --- 4. Ballistic Deltoid/Bicep Plating ---
    const upperArmorGroup = new THREE.Group();
    const uaShape = new THREE.Shape();
    uaShape.absarc(0, 0, 2.4, 0, Math.PI, false);
    uaShape.lineTo(-1.8, -8);
    uaShape.absarc(0, -8, 1.8, Math.PI, 0, true);
    uaShape.lineTo(2.4, 0);

    const uaFront = new THREE.Mesh(new THREE.ExtrudeGeometry(uaShape, {depth: 0.4, bevelEnabled:true, bevelSize:0.15, steps:4}), carbonFiber);
    uaFront.position.z = 1.2;
    upperArmorGroup.add(uaFront);

    const uaBack = new THREE.Mesh(new THREE.ExtrudeGeometry(uaShape, {depth: 0.4, bevelEnabled:true, bevelSize:0.15, steps:4}), carbonFiber);
    uaBack.position.z = -1.6;
    uaBack.rotation.y = Math.PI;
    upperArmorGroup.add(uaBack);

    const decal = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6, 0.5), neonOrange);
    decal.position.set(2.1, -4, 1.3);
    upperArmorGroup.add(decal);

    upperArmorGroup.position.set(0, 17, 0);
    group.add(upperArmorGroup);
    meshes.upperArmor = upperArmorGroup;
    parts.push({
        name: "Ballistic Deltoid/Bicep Plating",
        description: "Carbon-fiber composite armor shielding the volatile myomer bundles from kinetic and energy weapons.",
        material: "Carbon-Fiber Composite",
        function: "Kinetic Deflection & Protection",
        assemblyOrder: 4,
        connections: ["Humerus Core & Myomer Matrix"],
        failureEffect: "Exposure of internal systems.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 17, z: 0 },
        explodedPosition: { x: 0, y: 13, z: 12 }
    });

    // --- 5. Planetary Elbow Drive ---
    const elbowGroup = new THREE.Group();
    const elbowHub = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 4.0, 64), blackMetal);
    elbowHub.rotation.z = Math.PI / 2;
    elbowGroup.add(elbowHub);

    const eGear1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.3, 32, 64), titanium);
    eGear1.rotation.y = Math.PI/2;
    eGear1.position.x = 2.0;
    elbowGroup.add(eGear1);

    const eGear2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.3, 32, 64), titanium);
    eGear2.rotation.y = Math.PI/2;
    eGear2.position.x = -2.0;
    elbowGroup.add(eGear2);
    
    const elbowChip = createMicroController();
    elbowChip.position.set(0, 0, 2.4);
    elbowGroup.add(elbowChip);

    elbowGroup.position.set(0, 9, 0);
    group.add(elbowGroup);
    meshes.elbow = elbowGroup;
    meshes.elbowGears = [eGear1, eGear2];
    parts.push({
        name: "Planetary Elbow Drive",
        description: "Massive gear-driven hinge providing tons of lifting force, augmented by a local processor for predictive movement algorithms.",
        material: "Dark Steel & Silicon",
        function: "Forearm Flexion and Extension",
        assemblyOrder: 5,
        connections: ["Humerus Core", "Forearm Chassis"],
        failureEffect: "Total lockup of the lower arm assembly.",
        cascadeFailures: ["Microcontroller thermal shutdown"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: -12, y: 9, z: 0 }
    });

    // --- 6. Dual-Bone Forearm Chassis ---
    const forearmGroup = new THREE.Group();
    const radius = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 7, 64), titanium);
    radius.position.set(1.0, -3.5, 0);
    forearmGroup.add(radius);

    const ulna = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 7, 64), titanium);
    ulna.position.set(-1.0, -3.5, 0);
    forearmGroup.add(ulna);

    for(let i=0; i<30; i++) {
        const coil = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.5), copper);
        coil.position.set(0, -0.5 - (i*0.22), 0);
        forearmGroup.add(coil);
    }

    forearmGroup.position.set(0, 9, 0);
    group.add(forearmGroup);
    meshes.forearm = forearmGroup;
    parts.push({
        name: "Dual-Bone Forearm Chassis",
        description: "Twin titanium shafts encased in massive copper induction coils to step up voltage for the hand's crushing grip.",
        material: "Titanium & Copper",
        function: "Structural Support & Power Amplification",
        assemblyOrder: 6,
        connections: ["Planetary Elbow Drive", "Gyroscopic Wrist"],
        failureEffect: "Loss of power to hand actuators.",
        cascadeFailures: ["Induction coil short-circuit causing localized EMP"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 12, y: 5, z: 0 }
    });

    // --- 7. Tri-Phase Hydraulic Assist ---
    const hydGroup = new THREE.Group();
    const hyd1 = createHydraulicActuator(6, 0.5);
    hyd1.group.position.set(1.5, -6.5, 1.2);
    hydGroup.add(hyd1.group);
    meshes.hyd1 = hyd1;

    const hyd2 = createHydraulicActuator(6, 0.5);
    hyd2.group.position.set(-1.5, -6.5, 1.2);
    hydGroup.add(hyd2.group);
    meshes.hyd2 = hyd2;
    
    const hyd3 = createHydraulicActuator(6, 0.5);
    hyd3.group.position.set(0, -6.5, -1.5);
    hydGroup.add(hyd3.group);
    meshes.hyd3 = hyd3;

    hydGroup.position.set(0, 9, 0);
    group.add(hydGroup);
    meshes.hydraulics = hydGroup;
    parts.push({
        name: "Tri-Phase Hydraulic Assist",
        description: "Three heavy-duty hydraulic pistons that trigger during maximum grip exertion, providing industrial-crusher levels of force.",
        material: "Dark Steel, Chrome, Rubber",
        function: "Grip Force Multiplication",
        assemblyOrder: 7,
        connections: ["Forearm Chassis", "Gyroscopic Wrist"],
        failureEffect: "Reduced grip strength to human-normal levels.",
        cascadeFailures: ["High-pressure fluid rupture causing internal damage"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -12 }
    });

    // --- 8. Vambrace Plating & Tactical Display ---
    const faArmorGroup = new THREE.Group();
    const fShape = new THREE.Shape();
    fShape.absarc(0, 0, 2.2, 0, Math.PI, false);
    fShape.lineTo(-1.5, -7);
    fShape.absarc(0, -7, 1.5, Math.PI, 0, true);
    fShape.lineTo(2.2, 0);

    const fFront = new THREE.Mesh(new THREE.ExtrudeGeometry(fShape, {depth:0.25, bevelEnabled:true}), carbonFiber);
    fFront.position.z = 1.7;
    faArmorGroup.add(fFront);

    const fBack = new THREE.Mesh(new THREE.ExtrudeGeometry(fShape, {depth:0.25, bevelEnabled:true}), carbonFiber);
    fBack.position.z = -1.95;
    fBack.rotation.y = Math.PI;
    faArmorGroup.add(fBack);
    
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.5), new THREE.MeshStandardMaterial({color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 0.5, transparent: true, opacity: 0.8}));
    screen.position.set(0, -3.5, 2.0);
    faArmorGroup.add(screen);

    faArmorGroup.position.set(0, 8.5, 0);
    group.add(faArmorGroup);
    meshes.forearmArmor = faArmorGroup;
    parts.push({
        name: "Vambrace Plating & Tactical Display",
        description: "Carbon-fiber vambrace equipped with a holographic telemetry display for diagnostic readouts.",
        material: "Carbon-Fiber & Glass",
        function: "Protection & User Interface",
        assemblyOrder: 8,
        connections: ["Forearm Chassis"],
        failureEffect: "Loss of diagnostic data and physical vulnerability.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 8.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 14 }
    });

    // --- 9. Gyroscopic Wrist Actuator ---
    const wristGroup = new THREE.Group();
    const wristCore = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), titanium);
    wristGroup.add(wristCore);

    const wristRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.2, 32, 64), neonCyan);
    wristRing1.rotation.x = Math.PI/2;
    wristGroup.add(wristRing1);

    const wristRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.15, 32, 64), blackMetal);
    wristRing2.rotation.y = Math.PI/2;
    wristGroup.add(wristRing2);

    wristGroup.position.set(0, 2, 0);
    group.add(wristGroup);
    meshes.wrist = wristGroup;
    meshes.wristRings = [wristRing1, wristRing2];
    parts.push({
        name: "Gyroscopic Wrist Actuator",
        description: "A freely rotating multi-axis sphere joint that allows the hand to spin 360 degrees continuously.",
        material: "Titanium & Energy Rings",
        function: "Infinite Wrist Rotation & Flexion",
        assemblyOrder: 9,
        connections: ["Forearm Chassis", "Metacarpal Core"],
        failureEffect: "Hand seizes up.",
        cascadeFailures: ["Gyroscopic stabilizer collapse"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -10, y: 2, z: 0 }
    });

    // --- 10. Metacarpal Core & Power Node ---
    const palmGroup = new THREE.Group();
    const palmShape = new THREE.Shape();
    palmShape.moveTo(-1.8, 0);
    palmShape.lineTo(1.8, 0);
    palmShape.lineTo(2.2, -2.5);
    palmShape.lineTo(-2.2, -2.5);
    palmShape.lineTo(-1.8, 0);
    
    const palmMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(palmShape, {depth: 1.2, bevelEnabled:true, bevelSize:0.15}), blackMetal);
    palmMesh.position.z = -0.6;
    palmGroup.add(palmMesh);

    const repulsor = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.4, 64), neonCyan);
    repulsor.rotation.x = Math.PI/2;
    repulsor.position.set(0, -1.2, 0);
    palmGroup.add(repulsor);
    
    for(let i=0; i<12; i++) {
        const pWire = new THREE.Mesh(new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -1.2, 0.8),
                new THREE.Vector3(Math.cos(i)*1.2, -1.8, 0.5),
                new THREE.Vector3(Math.cos(i)*1.8, -2.5, 0)
            ]), 16, 0.05, 8, false
        ), copper);
        palmGroup.add(pWire);
    }

    palmGroup.position.set(0, 2, 0);
    group.add(palmGroup);
    meshes.palm = palmGroup;
    parts.push({
        name: "Metacarpal Core & Power Node",
        description: "The primary hand chassis housing the finger mounts and a central glowing power node capable of localized energy discharge.",
        material: "Dark Steel & Plasma Conduit",
        function: "Digit Support & Energy Projection",
        assemblyOrder: 10,
        connections: ["Gyroscopic Wrist", "Hyper-Articulated Digits"],
        failureEffect: "Loss of finger power; node explosion.",
        cascadeFailures: ["Catastrophic plasma venting from palm"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // --- 11-15. Hyper-Articulated Digits ---
    const fingers = [];
    const fingerPositions = [
        {x: 1.5, y: -2.5, z: 0, scale: 1.0},   
        {x: 0.5, y: -2.6, z: 0, scale: 1.15}, 
        {x: -0.5, y: -2.5, z: 0, scale: 1.0},  
        {x: -1.5, y: -2.3, z: 0, scale: 0.85} 
    ];

    fingerPositions.forEach((pos) => {
        const finger = createArticulatedDigit(pos.scale, false);
        finger.root.position.set(pos.x, pos.y, pos.z);
        finger.root.rotation.x = Math.PI; 
        palmGroup.add(finger.root);
        fingers.push(finger);
    });

    const thumb = createArticulatedDigit(1.1, true);
    thumb.root.position.set(2.2, -0.6, 0);
    thumb.root.rotation.x = Math.PI * 0.8;
    thumb.root.rotation.z = -Math.PI / 2.5;
    palmGroup.add(thumb.root);
    fingers.push(thumb);

    meshes.fingers = fingers;
    parts.push({
        name: "Hyper-Articulated Digits (x5)",
        description: "Five individual fingers, each with three micro-servo joints and titanium claws, capable of tearing through steel plating.",
        material: "Titanium & Chrome",
        function: "Precision Manipulation & Puncturing",
        assemblyOrder: 11,
        connections: ["Metacarpal Core"],
        failureEffect: "Loss of fine motor control.",
        cascadeFailures: ["Claw retraction failure"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    const description = "The 'Titan-Class' Cybernetic Bionic Arm is a hyper-realistic, massive prosthetic limb engineered for extreme combat and industrial scenarios. Eschewing basic geometries, every square inch is packed with complex planetary gears, induction coils, carbon-fiber plating, hydraulic actuators, and synthetic myomer muscles. The central processor orchestrates thousands of micro-adjustments per second, driven directly by the user's neural telemetry via a gold-plated cortical socket. The glowing power nodes and repulsor palm make it as terrifying visually as it is devastating physically.";

    const quizQuestions = [
        {
            question: "What unique material is used for the neural pins in the Cortical Clavicle Mount to ensure maximum conductivity?",
            options: ["Copper", "24-Karat Gold", "Titanium", "Carbon Fiber"],
            correctAnswer: 1,
            hint: "It's a precious metal highly prized in electronics for resisting corrosion."
        },
        {
            question: "How many independent planetary gear servos drive the 'Tri-Servo Omni-Joint' at the shoulder?",
            options: ["One", "Two", "Three", "Five"],
            correctAnswer: 2,
            hint: "The name of the joint gives away the quantity."
        },
        {
            question: "What surrounds the dual titanium shafts in the Forearm Chassis to step up voltage?",
            options: ["Synthetic Myomers", "Massive Copper Induction Coils", "Hydraulic Fluid", "Carbon Plating"],
            correctAnswer: 1,
            hint: "These are typically used in transformers and electromagnets."
        },
        {
            question: "What is the extreme capability of the five Hyper-Articulated Digits?",
            options: ["Typing at 500 WPM", "Tearing through steel plating", "Generating a forcefield", "Detaching to act as drones"],
            correctAnswer: 1,
            hint: "They are equipped with titanium claws for a reason."
        },
        {
            question: "What prevents the volatile myomer bundles in the upper arm from melting down during heavy use?",
            options: ["Internal Coolant Pipes", "The Holographic Display", "Gyroscopic stabilizers", "The Repulsor Node"],
            correctAnswer: 0,
            hint: "They use glass tubes carrying glowing fluid."
        }
    ];

    const animate = (time, speed, activeMeshes) => {
        const cycle = time * speed;
        const fastCycle = time * speed * 2;

        // Shoulder breathing
        activeMeshes.shoulder.rotation.x = Math.sin(cycle * 0.5) * 0.08;
        activeMeshes.shoulder.rotation.z = Math.cos(cycle * 0.4) * 0.04;

        // Spin shoulder servo planetary gears
        activeMeshes.shoulderServos.forEach(servo => {
            servo.gears.forEach(gear => {
                gear.rotation.y = fastCycle;
            });
        });

        // Spin elbow gears
        activeMeshes.elbowGears.forEach(gear => {
            gear.rotation.z = cycle * 1.5;
        });

        // Spin wrist rings inversely
        activeMeshes.wristRings[0].rotation.z = fastCycle;
        activeMeshes.wristRings[1].rotation.x = -fastCycle * 1.2;

        // Hydraulic pistons animate extending and retracting
        const extension = (Math.sin(cycle * 2) * 1.5) + 1.5; 
        activeMeshes.hyd1.rod.position.y = 6 + extension;
        activeMeshes.hyd2.rod.position.y = 6 + extension;
        activeMeshes.hyd3.rod.position.y = 6 + extension;

        // Fingers curling 
        const grasp = (Math.sin(cycle * 1.5) * 0.8) - 0.8; 
        activeMeshes.fingers.forEach((finger, i) => {
            const delay = i * 0.15;
            const indGrasp = (Math.sin((cycle * 1.5) - delay) * 0.8) - 0.8;
            
            if (i < 4) { 
                finger.root.rotation.x = Math.PI + indGrasp; 
                finger.mid.rotation.x = indGrasp * 1.2;
                finger.dist.rotation.x = indGrasp * 0.8;
            } else { 
                finger.root.rotation.z = -Math.PI / 2.5 + (indGrasp * 0.5);
                finger.mid.rotation.x = indGrasp;
                finger.dist.rotation.x = indGrasp;
            }
        });

        // Pulsing glowing materials
        const pulseCyan = (Math.sin(fastCycle * 3) + 1) / 2;
        neonCyan.emissiveIntensity = 1.0 + pulseCyan * 4.0;
        
        const pulseOrange = (Math.cos(fastCycle * 2) + 1) / 2;
        neonOrange.emissiveIntensity = 1.5 + pulseOrange * 3.0;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBionicArm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
