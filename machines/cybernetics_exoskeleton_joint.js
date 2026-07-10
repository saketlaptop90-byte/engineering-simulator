import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom neon materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.6
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.6,
        metalness: 0.4,
        wireframe: true 
    });

    const goldContacts = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 1.0
    });

    // Helper to generate hexagonal bolts for realism
    function addBolts(target, positions, material) {
        const boltGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 6);
        positions.forEach(pos => {
            const bolt = new THREE.Mesh(boltGeo, material);
            bolt.position.set(pos.x, pos.y, pos.z);
            if(pos.rx) bolt.rotation.x = pos.rx;
            if(pos.ry) bolt.rotation.y = pos.ry;
            if(pos.rz) bolt.rotation.z = pos.rz;
            target.add(bolt);
        });
    }

    // 1. Central Knee Hinge Hub
    const hubGeometry = new THREE.CylinderGeometry(2, 2, 4.5, 64);
    const hub = new THREE.Mesh(hubGeometry, darkSteel);
    hub.rotation.x = Math.PI / 2;
    group.add(hub);
    meshes.hub = hub;
    
    parts.push({
        name: "Titanium Hinge Hub",
        description: "The primary articulating joint bearing the central load of the exoskeleton.",
        material: "darkSteel",
        function: "Enables single-axis rotation for the knee while supporting up to 5000 lbs of load.",
        assemblyOrder: 1,
        connections: ["Upper Thigh Frame", "Lower Calf Frame", "Rotary Encoders"],
        failureEffect: "Complete loss of mobility and structural collapse.",
        cascadeFailures: ["Actuator blowout", "Frame buckling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -15 }
    });

    // Add intricate gears/splines inside the hub
    const splineGeo = new THREE.CylinderGeometry(1.8, 1.8, 4.8, 32, 1, false, 0, Math.PI * 2);
    const splineMat = new THREE.MeshStandardMaterial({ color: 0x555555, wireframe: true });
    const splines = new THREE.Mesh(splineGeo, splineMat);
    hub.add(splines);
    
    // Internal Planetary Gears (Visual)
    for(let i=0; i<6; i++) {
        const gearGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.6, 12);
        const gear = new THREE.Mesh(gearGeo, chrome);
        const angle = (i / 6) * Math.PI * 2;
        gear.position.set(Math.cos(angle)*1.2, 0, Math.sin(angle)*1.2);
        hub.add(gear);
    }
    
    // Rotary Encoders (Left and Right)
    const encoderGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const encoderLeft = new THREE.Mesh(encoderGeo, copper);
    encoderLeft.position.y = 2.5;
    hub.add(encoderLeft);
    const encoderRight = new THREE.Mesh(encoderGeo, copper);
    encoderRight.position.y = -2.5;
    hub.add(encoderRight);

    // 2. Upper Thigh Frame
    const thighShape = new THREE.Shape();
    thighShape.moveTo(-1.8, 0);
    thighShape.lineTo(1.8, 0);
    thighShape.lineTo(2.5, 12);
    thighShape.lineTo(1.5, 14);
    thighShape.lineTo(-1.5, 14);
    thighShape.lineTo(-2.5, 12);
    thighShape.lineTo(-1.8, 0);
    
    // Add cutouts to thigh frame
    const cutout = new THREE.Path();
    cutout.absarc(0, 8, 1, 0, Math.PI * 2, false);
    thighShape.holes.push(cutout);

    const thighExtrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const thighGeo = new THREE.ExtrudeGeometry(thighShape, thighExtrudeSettings);
    const thighFrame = new THREE.Mesh(thighGeo, steel);
    thighFrame.position.z = -1.5;
    
    const thighPivot = new THREE.Group();
    thighPivot.add(thighFrame);
    group.add(thighPivot);
    meshes.thighPivot = thighPivot;

    addBolts(thighFrame, [
        { x: 2.0, y: 11, z: 3.2, rx: Math.PI/2 },
        { x: -2.0, y: 11, z: 3.2, rx: Math.PI/2 },
        { x: 1.5, y: 3, z: 3.2, rx: Math.PI/2 },
        { x: -1.5, y: 3, z: 3.2, rx: Math.PI/2 }
    ], chrome);

    parts.push({
        name: "Upper Thigh Frame",
        description: "High-tensile steel structural mounting frame connecting the knee to the hip assembly.",
        material: "steel",
        function: "Transfers load from the user's upper leg to the exoskeleton's load-bearing knee joint.",
        assemblyOrder: 2,
        connections: ["Titanium Hinge Hub", "Hydraulic Actuators", "Battery Pack"],
        failureEffect: "Inability to support upright posture.",
        cascadeFailures: ["Strain gauge overload", "Hydraulic seal rupture"],
        originalPosition: { x: 0, y: 0, z: -1.5 },
        explodedPosition: { x: 0, y: 25, z: -1.5 }
    });

    // 3. Lower Calf Frame
    const calfShape = new THREE.Shape();
    calfShape.moveTo(-1.8, 0);
    calfShape.lineTo(1.8, 0);
    calfShape.lineTo(2.0, -14);
    calfShape.lineTo(1.0, -16);
    calfShape.lineTo(-1.0, -16);
    calfShape.lineTo(-2.0, -14);
    calfShape.lineTo(-1.8, 0);
    
    const calfExtrudeSettings = { depth: 2.8, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 };
    const calfGeo = new THREE.ExtrudeGeometry(calfShape, calfExtrudeSettings);
    const calfFrame = new THREE.Mesh(calfGeo, darkSteel);
    calfFrame.position.z = -1.4;
    
    const calfPivot = new THREE.Group();
    calfPivot.add(calfFrame);
    group.add(calfPivot);
    meshes.calfPivot = calfPivot;

    addBolts(calfFrame, [
        { x: 1.5, y: -4, z: 3.0, rx: Math.PI/2 },
        { x: -1.5, y: -4, z: 3.0, rx: Math.PI/2 },
        { x: 1.5, y: -12, z: 3.0, rx: Math.PI/2 },
        { x: -1.5, y: -12, z: 3.0, rx: Math.PI/2 }
    ], chrome);

    parts.push({
        name: "Lower Calf Sub-Frame",
        description: "Reinforced lower leg armature constructed from dark steel alloys with geometric cutouts for weight reduction.",
        material: "darkSteel",
        function: "Provides mounting points for the lower hydraulic pistons and transfers load to the foot assembly.",
        assemblyOrder: 3,
        connections: ["Titanium Hinge Hub", "Piston Rods"],
        failureEffect: "Collapse of the lower leg structure.",
        cascadeFailures: ["Ankle joint stress", "Actuator hyper-extension"],
        originalPosition: { x: 0, y: 0, z: -1.4 },
        explodedPosition: { x: 0, y: -25, z: -1.4 }
    });

    // 4. Primary Hydraulic Actuators (Left and Right)
    const cylinderGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 32);
    const leftCylinder = new THREE.Mesh(cylinderGeo, chrome);
    const rightCylinder = new THREE.Mesh(cylinderGeo, chrome);
    
    // Add cooling fins to cylinders
    for(let i=0; i<6; i++) {
        const finGeo = new THREE.TorusGeometry(0.85, 0.05, 8, 32);
        const finL = new THREE.Mesh(finGeo, darkSteel);
        finL.rotation.x = Math.PI/2;
        finL.position.y = 2 - i*0.8;
        leftCylinder.add(finL);
        
        const finR = new THREE.Mesh(finGeo, darkSteel);
        finR.rotation.x = Math.PI/2;
        finR.position.y = 2 - i*0.8;
        rightCylinder.add(finR);
    }

    const actuatorGroupLeft = new THREE.Group();
    actuatorGroupLeft.position.set(2.4, 6, 0);
    actuatorGroupLeft.add(leftCylinder);
    thighPivot.add(actuatorGroupLeft);
    meshes.actuatorLeft = actuatorGroupLeft;

    const actuatorGroupRight = new THREE.Group();
    actuatorGroupRight.position.set(-2.4, 6, 0);
    actuatorGroupRight.add(rightCylinder);
    thighPivot.add(actuatorGroupRight);
    meshes.actuatorRight = actuatorGroupRight;

    parts.push({
        name: "Heavy Hydraulic Cylinders (Dual)",
        description: "Twin high-pressure hydraulic cylinders with passive cooling fins, capable of delivering 15,000 N of force each.",
        material: "chrome",
        function: "Drives the knee flexion and extension via pressurized fluid.",
        assemblyOrder: 4,
        connections: ["Upper Thigh Frame", "Hydraulic Pumps", "Piston Rods"],
        failureEffect: "Loss of active assistance; joint locks up or goes limp.",
        cascadeFailures: ["Pump overheating", "Fluid leak"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 20, y: 6, z: 0 }
    });

    // 5. Piston Rods
    const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 10, 32);
    const leftRod = new THREE.Mesh(rodGeo, steel);
    leftRod.position.y = -4; 
    const rightRod = new THREE.Mesh(rodGeo, steel);
    rightRod.position.y = -4;

    const rodGroupLeft = new THREE.Group();
    rodGroupLeft.position.set(2.4, -3, 0);
    rodGroupLeft.add(leftRod);
    calfPivot.add(rodGroupLeft);
    meshes.rodLeft = leftRod;
    meshes.rodGroupLeft = rodGroupLeft;

    const rodGroupRight = new THREE.Group();
    rodGroupRight.position.set(-2.4, -3, 0);
    rodGroupRight.add(rightRod);
    calfPivot.add(rodGroupRight);
    meshes.rodRight = rightRod;
    meshes.rodGroupRight = rodGroupRight;

    parts.push({
        name: "Titanium Piston Rods",
        description: "High-strength polished rods extending from the hydraulic cylinders to actuate the joint.",
        material: "steel",
        function: "Converts hydraulic pressure into linear mechanical motion.",
        assemblyOrder: 5,
        connections: ["Hydraulic Cylinders", "Lower Calf Frame"],
        failureEffect: "Jamming of the joint or catastrophic snapping under load.",
        cascadeFailures: ["Cylinder rupture", "Complete joint failure"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 20, y: -15, z: 0 }
    });
    
    // 6. Battery Pack on Thigh
    const batteryGeo = new THREE.BoxGeometry(3.5, 7, 2.5);
    const battery = new THREE.Mesh(batteryGeo, carbonFiber);
    battery.position.set(0, 8, 3.5);
    thighPivot.add(battery);
    
    // Add battery details (cells, terminals)
    const terminalGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const term1 = new THREE.Mesh(terminalGeo, goldContacts);
    term1.position.set(1, 3.5, 0);
    battery.add(term1);
    const term2 = new THREE.Mesh(terminalGeo, goldContacts);
    term2.position.set(-1, 3.5, 0);
    battery.add(term2);

    parts.push({
        name: "High-Density Li-Ion Battery Pack",
        description: "A compact, armored battery unit providing 48V direct current with gold-plated terminals.",
        material: "carbonFiber",
        function: "Supplies electrical power to the entire exoskeleton leg assembly.",
        assemblyOrder: 6,
        connections: ["Upper Thigh Frame", "Power Cables", "Control Unit"],
        failureEffect: "Complete system shutdown.",
        cascadeFailures: ["Hydraulic lock", "Sensor blackout"],
        originalPosition: { x: 0, y: 8, z: 3.5 },
        explodedPosition: { x: 0, y: 8, z: 18 }
    });

    // 7. Power Cables (TubeGeometry)
    class CableCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = Math.cos(t * Math.PI) * 2;
            const y = -t * 6;
            const z = Math.sin(t * Math.PI) * 2.5;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const pathLeft = new CableCurve(1.1);
    const cableGeoLeft = new THREE.TubeGeometry(pathLeft, 32, 0.25, 8, false);
    const cableLeft = new THREE.Mesh(cableGeoLeft, rubber);
    cableLeft.position.set(1.5, 6, 2.5);
    thighPivot.add(cableLeft);

    const pathRight = new CableCurve(1.1);
    const cableGeoRight = new THREE.TubeGeometry(pathRight, 32, 0.25, 8, false);
    const cableRight = new THREE.Mesh(cableGeoRight, rubber);
    cableRight.position.set(-1.5, 6, 2.5);
    cableRight.scale.x = -1;
    thighPivot.add(cableRight);

    parts.push({
        name: "Armored Power Cables",
        description: "Thick, rubberized cabling housing superconducting wires for power transmission.",
        material: "rubber",
        function: "Routes high-voltage power from the battery to the actuators and sensors.",
        assemblyOrder: 7,
        connections: ["Battery Pack", "Hydraulic Pumps"],
        failureEffect: "Loss of power to specific sub-systems.",
        cascadeFailures: ["Actuator stalling", "Fire hazard if shorted"],
        originalPosition: { x: 1.5, y: 6, z: 2.5 },
        explodedPosition: { x: 12, y: 6, z: 12 }
    });

    // 8. Strain Gauges (Sensors)
    const gaugeGeo = new THREE.BoxGeometry(0.8, 1.5, 0.2);
    const gauge1 = new THREE.Mesh(gaugeGeo, copper);
    gauge1.position.set(0, -7, 1.5);
    calfPivot.add(gauge1);
    
    const gauge2 = new THREE.Mesh(gaugeGeo, copper);
    gauge2.position.set(0, -11, 1.5);
    calfPivot.add(gauge2);

    parts.push({
        name: "Micro-Strain Gauges",
        description: "High-precision copper-etched strain gauges bonded to the calf frame.",
        material: "copper",
        function: "Measures micro-deformations in the frame to calculate applied torque and load.",
        assemblyOrder: 8,
        connections: ["Lower Calf Frame", "Sensor Bus"],
        failureEffect: "Erratic actuator behavior due to lack of force feedback.",
        cascadeFailures: ["Over-torquing", "User injury"],
        originalPosition: { x: 0, y: -7, z: 1.5 },
        explodedPosition: { x: 0, y: -7, z: 8 }
    });

    // 9. LED Status Indicators
    const ledGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    const led1 = new THREE.Mesh(ledGeo, neonBlue);
    led1.rotation.x = Math.PI / 2;
    led1.position.set(1.2, 9, 4.8);
    thighPivot.add(led1);
    meshes.led1 = led1;

    const led2 = new THREE.Mesh(ledGeo, neonBlue);
    led2.rotation.x = Math.PI / 2;
    led2.position.set(-1.2, 9, 4.8);
    thighPivot.add(led2);
    meshes.led2 = led2;

    parts.push({
        name: "Optical Status Indicators",
        description: "High-intensity LED arrays providing visual feedback on system status.",
        material: "neonBlue",
        function: "Displays power levels, fault codes, and operational modes.",
        assemblyOrder: 9,
        connections: ["Battery Pack", "Control Unit"],
        failureEffect: "Loss of visual diagnostics.",
        cascadeFailures: ["None"],
        originalPosition: { x: 1.2, y: 9, z: 4.8 },
        explodedPosition: { x: 5, y: 15, z: 10 }
    });

    // 10. Cooling Vents (On Battery)
    const ventGroup = new THREE.Group();
    ventGroup.position.set(0, 6.5, 4.8);
    for(let i=0; i<5; i++) {
        const ventBladeGeo = new THREE.BoxGeometry(2.5, 0.1, 0.5);
        const ventBlade = new THREE.Mesh(ventBladeGeo, plastic);
        ventBlade.rotation.x = Math.PI / 4;
        ventBlade.position.y = i * 0.45;
        ventGroup.add(ventBlade);
    }
    thighPivot.add(ventGroup);

    parts.push({
        name: "Active Cooling Louvers",
        description: "Angled plastic louvers directing airflow over the battery heat sinks.",
        material: "plastic",
        function: "Dissipates thermal energy generated by high-discharge battery cycles.",
        assemblyOrder: 10,
        connections: ["Battery Pack"],
        failureEffect: "Overheating of power cells.",
        cascadeFailures: ["Thermal throttling", "Battery rupture"],
        originalPosition: { x: 0, y: 6.5, z: 4.8 },
        explodedPosition: { x: 0, y: 6.5, z: 15 }
    });

    // 11. Armored Casing (Knee Pad)
    const padGeo = new THREE.SphereGeometry(3.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const pad = new THREE.Mesh(padGeo, steel);
    pad.rotation.x = -Math.PI / 2;
    pad.scale.set(1, 0.85, 1);
    pad.position.set(0, 0, 2.5);
    
    // Add ridges to the armor
    for(let i=0; i<3; i++) {
        const ridgeGeo = new THREE.TorusGeometry(2 - i*0.5, 0.15, 8, 32, Math.PI);
        const ridge = new THREE.Mesh(ridgeGeo, chrome);
        ridge.rotation.x = Math.PI/2;
        ridge.position.y = 3 - i;
        pad.add(ridge);
    }
    group.add(pad);

    parts.push({
        name: "Patellar Armor Plating",
        description: "A domed steel shield covering the delicate hinge and rotary encoders with reinforcement ridges.",
        material: "steel",
        function: "Protects the central joint from ballistic and concussive impacts.",
        assemblyOrder: 11,
        connections: ["Titanium Hinge Hub"],
        failureEffect: "Exposure of critical joint components to damage.",
        cascadeFailures: ["Encoder smashing", "Joint jamming from debris"],
        originalPosition: { x: 0, y: 0, z: 2.5 },
        explodedPosition: { x: 0, y: 0, z: 25 }
    });

    // 12. Hydraulic Fluid Reservoir
    const reservoirGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 16);
    const reservoir = new THREE.Mesh(reservoirGeo, glass);
    reservoir.position.set(0, 3, -3.5);
    thighPivot.add(reservoir);

    const fluidGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.3, 16);
    const fluidMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5
    });
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    reservoir.add(fluid);
    meshes.fluid = fluid;

    parts.push({
        name: "Hydraulic Fluid Reservoir",
        description: "Reinforced glass and poly-carbonate cylinder holding specialized hydraulic fluid.",
        material: "glass",
        function: "Maintains fluid volume and pressure for the actuator system.",
        assemblyOrder: 12,
        connections: ["Hydraulic Pumps", "Upper Thigh Frame"],
        failureEffect: "Complete loss of hydraulic pressure.",
        cascadeFailures: ["Actuator failure", "Pump cavitation"],
        originalPosition: { x: 0, y: 3, z: -3.5 },
        explodedPosition: { x: 0, y: 3, z: -18 }
    });

    // 13. Rotary Motor Hub (Assists Hydraulics)
    const motorGeo = new THREE.TorusGeometry(2.8, 0.7, 16, 64);
    const motor = new THREE.Mesh(motorGeo, chrome);
    motor.rotation.x = Math.PI / 2;
    group.add(motor);
    meshes.motor = motor;

    parts.push({
        name: "Auxiliary Torque Motor",
        description: "A high-torque brushless DC motor wrapped around the central hinge.",
        material: "chrome",
        function: "Provides rapid micro-adjustments and supplemental torque to the main hydraulics.",
        assemblyOrder: 13,
        connections: ["Titanium Hinge Hub", "Battery Pack"],
        failureEffect: "Sluggish response times and reduced peak torque.",
        cascadeFailures: ["Hydraulic over-reliance causing wear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 0, z: 0 }
    });

    // 14. Data Bus / Ribbon Cables
    const ribbonGeo = new THREE.PlaneGeometry(1.2, 5);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(1.8, -4, 1.8);
    ribbon.rotation.x = Math.PI / 4;
    calfPivot.add(ribbon);

    parts.push({
        name: "High-Speed Data Ribbon",
        description: "A flat, flexible ribbon cable containing optical fibers.",
        material: "plastic",
        function: "Transmits high-speed telemetry from the strain gauges to the processing unit.",
        assemblyOrder: 14,
        connections: ["Lower Calf Frame", "Strain Gauges"],
        failureEffect: "Loss of sensor telemetry.",
        cascadeFailures: ["AI controller malfunction", "Gait instability"],
        originalPosition: { x: 1.8, y: -4, z: 1.8 },
        explodedPosition: { x: 10, y: -4, z: 8 }
    });

    // 15. Emergency Release Valve
    const valveGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.0, 16);
    const valve = new THREE.Mesh(valveGeo, neonRed);
    valve.position.set(0, 4.5, -4.2);
    valve.rotation.x = Math.PI / 2;
    thighPivot.add(valve);
    meshes.valve = valve;

    parts.push({
        name: "Manual Override / Purge Valve",
        description: "A highly visible, mechanically actuated release valve for the hydraulic system.",
        material: "neonRed",
        function: "Instantly depressurizes the system in case of emergency to allow manual movement.",
        assemblyOrder: 15,
        connections: ["Hydraulic Fluid Reservoir"],
        failureEffect: "Inability to release pressure manually.",
        cascadeFailures: ["User trapped in locked exoskeleton"],
        originalPosition: { x: 0, y: 4.5, z: -4.2 },
        explodedPosition: { x: 0, y: 4.5, z: -25 }
    });

    // 16. Internal Gyroscope
    const gyroGeo = new THREE.OctahedronGeometry(0.6, 0);
    const gyro = new THREE.Mesh(gyroGeo, copper);
    gyro.position.set(0, 11, 0);
    thighPivot.add(gyro);
    meshes.gyro = gyro;

    parts.push({
        name: "MEMS Gyroscope Unit",
        description: "A compact copper-housed micro-electromechanical gyroscope.",
        material: "copper",
        function: "Monitors the absolute orientation and angular velocity of the thigh segment.",
        assemblyOrder: 16,
        connections: ["Upper Thigh Frame", "Control Unit"],
        failureEffect: "Loss of balance data.",
        cascadeFailures: ["Exoskeleton falls over"],
        originalPosition: { x: 0, y: 11, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    const description = "The Cybernetics Exoskeleton Knee Joint is a hyper-realistic, military-grade robotic articulation point. Featuring twin high-pressure hydraulic cylinders, a titanium central hub, carbon fiber battery packs, and embedded micro-strain gauges. It operates as the critical load-bearing and locomotive component for heavy-duty powered armor.";

    const quizQuestions = [
        {
            question: "Which component provides the primary force for knee flexion and extension?",
            options: ["Titanium Hinge Hub", "Heavy Hydraulic Cylinders", "Auxiliary Torque Motor", "MEMS Gyroscope"],
            correctAnswer: 1,
            explanation: "The Heavy Hydraulic Cylinders deliver 15,000 N of force each to actuate the joint, while the motor only provides auxiliary micro-adjustments."
        },
        {
            question: "What is the purpose of the Micro-Strain Gauges on the lower calf frame?",
            options: ["To measure the battery voltage", "To cool the hydraulic fluid", "To measure micro-deformations for applied torque", "To track the user's heartbeat"],
            correctAnswer: 2,
            explanation: "The micro-strain gauges detect slight bending in the calf frame to calculate the physical load and torque being applied during movement."
        },
        {
            question: "If the Active Cooling Louvers fail, what is the most direct cascade failure?",
            options: ["Hydraulic lock", "Thermal throttling and Battery rupture", "Loss of sensor telemetry", "Joint jamming"],
            correctAnswer: 1,
            explanation: "The louvers cool the high-density battery pack. Failure to dissipate this heat leads to thermal throttling and potential rupture of the battery cells."
        },
        {
            question: "How does the system ensure the user isn't trapped if the hydraulics lock up?",
            options: ["The battery explodes", "The Manual Override / Purge Valve can be activated", "The Auxiliary Motor reverses", "The Patellar Armor breaks off"],
            correctAnswer: 1,
            explanation: "The neon red Manual Override Valve can instantly depressurize the hydraulic system, freeing up the joint for manual un-powered movement."
        },
        {
            question: "What structural material is primarily used for the Upper Thigh Frame to support immense loads?",
            options: ["Plastic", "Rubber", "High-tensile steel", "Glass"],
            correctAnswer: 2,
            explanation: "The Upper Thigh Frame is constructed from high-tensile steel to handle the massive load transfers from the hip to the knee."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed * 2.0;

        // Knee joint angle (oscillates between 0 and -90 degrees)
        const angle = (Math.sin(t) - 1) * (Math.PI / 4); 

        activeMeshes.calfPivot.rotation.x = angle;
        
        const upperMountPos = new THREE.Vector3(2.4, 6, 0);
        const lowerMountPosLocal = new THREE.Vector3(2.4, -3, 0);
        
        const lowerMountPosWorld = lowerMountPosLocal.clone().applyMatrix4(activeMeshes.calfPivot.matrixWorld);
        const lowerMountPosThigh = lowerMountPosWorld.clone().applyMatrix4(activeMeshes.thighPivot.matrixWorld.clone().invert());
        
        activeMeshes.actuatorLeft.lookAt(lowerMountPosWorld);
        activeMeshes.actuatorLeft.rotateX(Math.PI / 2); 

        activeMeshes.actuatorRight.lookAt(new THREE.Vector3(-2.4, -3, 0).applyMatrix4(activeMeshes.calfPivot.matrixWorld));
        activeMeshes.actuatorRight.rotateX(Math.PI / 2);

        const extension = Math.sin(t) * 2.5; 
        activeMeshes.rodLeft.position.y = -4 + extension;
        activeMeshes.rodRight.position.y = -4 + extension;

        const jointSpeed = Math.cos(t);
        activeMeshes.motor.rotation.z += jointSpeed * 0.15;

        const load = Math.abs(Math.sin(t));
        activeMeshes.led1.material.emissiveIntensity = 0.5 + load * 3.0;
        activeMeshes.led2.material.emissiveIntensity = 0.5 + load * 3.0;

        activeMeshes.gyro.rotation.x += 0.25;
        activeMeshes.gyro.rotation.y += 0.35;

        activeMeshes.fluid.scale.y = 1.0 + Math.sin(t * 12) * 0.08;
        
        if (load > 0.92) {
            activeMeshes.valve.material.emissiveIntensity = 3.5 + Math.sin(t*20)*2;
        } else {
            activeMeshes.valve.material.emissiveIntensity = 0.8;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createExoskeletonJoint() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
